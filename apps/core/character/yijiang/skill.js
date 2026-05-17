import { lib, game, ui, get, ai, _status } from "noname";

/** @type { importCharacterConfig["skill"] } */
const skills = {
	//OL51
	olbenxi: {
		audio: "benxi",
		trigger: { player: "useCard2" },
		filter(trigger, player) {
			return _status.currentPhase === player && trigger.targets?.length === 1 && (trigger.card.name === "sha" || get.type(trigger.card) === "trick") && !game.hasPlayer(current => get.distance(player, current) > 1);
		},
		filterx(event, player) {
			const info = get.info(event.card);
			if (!event.targets?.length || info.multitarget || info.allowMultiple === false) {
				return false;
			}
			return game.hasPlayer(current => {
				return lib.filter.targetEnabled2(event.card, player, current) && !event.targets.includes(current);
			});
		},
		forced: true,
		async content(event, trigger, player) {
			const str = get.translation(trigger.card);
			const list = ["为" + str + "多选择一个目标", "　令" + str + "无视防具牌　", "　令" + str + "不可被抵消　", "令" + str + "造成伤害后摸牌"].map((item, i) => [i, item]);
			const next = player.chooseButton({
				createDialog: ["奔袭：请选择一至两项", [list.slice(0, 2), "tdnodes"], [list.slice(2, 4), "tdnodes"]],
				filterButton(button) {
					return button.link !== 0 || get.event().bool1;
				},
				selectButton: [1, 2],
				forced: true,
				ai(button) {
					const player = get.player();
					const event = get.event().getTrigger();
					switch (button.link) {
						case 0: {
							if (
								game.hasPlayer(current => {
									return lib.filter.targetEnabled2(event.card, player, current) && !event.targets.includes(current) && get.effect(current, event.card, player, player) > 0;
								})
							) {
								return 1.6 + Math.random();
							}
							return 0;
						}
						case 1: {
							if (
								event.targets.filter(current => {
									const eff1 = get.effect(current, event.card, player, player);
									player._olbenxi_ai = true;
									const eff2 = get.effect(current, event.card, player, player);
									delete player._olbenxi_ai;
									return eff1 > eff2;
								}).length
							) {
								return 1.9 + Math.random();
							}
							return Math.random();
						}
						case 2: {
							let num = 1.3;
							if (
								event.card.name === "sha" &&
								event.targets.filter(current => {
									if (current.mayHaveShan(player, "use") && get.attitude(player, current) <= 0) {
										if (current.hasSkillTag("useShan", null, "use")) {
											num = 1.9;
										}
										return true;
									}
									return false;
								}).length
							) {
								return num + Math.random();
							}
							return 0.5 + Math.random();
						}
						case 3: {
							return (get.tag(event.card, "damage") || 0) + Math.random();
						}
					}
				},
			});
			next.set("bool1", get.info("olbenxi").filterx(trigger, player));

			const { bool, links } = await next.forResult();
			if (!bool || !links?.length) {
				return;
			}
			for (const num of links.sort((a, b) => a - b)) {
				switch (num) {
					case 0: {
						const result2 = await player
							.chooseTarget("请选择" + get.translation(trigger.card) + "的额外目标", true, (card, player, target) => {
								const event = get.event().getTrigger();
								if (event.targets.includes(target)) {
									return false;
								}
								return lib.filter.targetEnabled2(event.card, player, target) && lib.filter.targetInRange(event.card, player, target);
							})
							.set("ai", target => {
								const player = get.player();
								const event = get.event().getTrigger();
								return get.effect(target, event.card, player, player);
							})
							.forResult();
						if (result2?.targets?.length) {
							player.line(result2.targets);
							trigger.targets.addArray(result2.targets);
							game.log(result2.targets, "成为了", trigger.card, "的额外目标");
						}
						break;
					}
					case 2:
						trigger.nowuxie = true;
						trigger.customArgs.default.directHit2 = true;
					// [falls through]
					default:
						player.addTempSkill("olbenxi_effect");
						player.storage.olbenxi_effect[num - 1].add(trigger.card);
						break;
				}
			}
		},
		ai: {
			unequip_ai: true,
			directHit_ai: true,
			skillTagFilter(player, tag, arg) {
				if (_status.currentPhase !== player || game.hasPlayer(current => get.distance(player, current) > 1)) {
					return false;
				}
				if (tag === "directHit_ai") {
					return arg.card.name === "sha";
				}
				if (!arg || !arg.card || (arg.card.name != "sha" && arg.card.name !== "chuqibuyi")) {
					return false;
				}
				var card = arg.target.getEquip(2);
				if (card && card.name.indexOf("bagua") != -1) {
					return true;
				}
				if (player._olbenxi_ai) {
					return false;
				}
			},
		},
		group: "olbenxi_summer",
		subSkill: {
			effect: {
				charlotte: true,
				init(player, skill) {
					if (!player.storage[skill]) {
						player.storage[skill] = [[], [], []];
					}
				},
				audio: "benxi",
				trigger: { global: "damageSource" },
				filter(event, player) {
					return event.card && player.storage.olbenxi_effect[2].includes(event.card);
				},
				forced: true,
				async content(event, trigger, player) {
					await player.draw();
				},
				ai: {
					unequip: true,
					unequip_ai: true,
					skillTagFilter(player, tag, arg) {
						return player.storage.olbenxi_effect[0].includes(arg?.card);
					},
				},
				mod: {
					wuxieRespondable(card, player) {
						if (player.storage.olbenxi_effect[1].includes(card)) {
							return false;
						}
					},
				},
			},
			summer: {
				//audio: "benxi",
				trigger: { player: "useCard" },
				filter(event, player) {
					return player === _status.currentPhase;
				},
				forced: true,
				popup: false,
				async content(event, trigger, player) {
					player.addTempSkill("olbenxi_dist");
					player.addMark("olbenxi_dist", 1, false);
				},
			},
			dist: {
				charlotte: true,
				onremove: true,
				mod: {
					globalFrom(from, to, distance) {
						return distance - from.countMark("olbenxi_dist");
					},
				},
				intro: { content: "距离与其他角色的距离-#" },
			},
		},
	},
	//顾雍
	olbingyi: {
		audio: "bingyi",
		trigger: {
			player: "loseAfter",
			global: "loseAsyncAfter",
		},
		filter(event, player) {
			return event.type == "discard" && event.getl(player).cards2.length > 0 && player.countCards("h") > 0 && !player.hasSkill("olbingyi_blocker", null, null, false);
		},
		prompt2(event, player) {
			let str = "展示所有手牌，然后";
			const hs = player.getCards("h");
			const color = get.color(hs);
			if (color === "none") {
				return str + "无事发生";
			}
			str += "令至多" + get.cnNumber(hs.length) + "名其他角色和自己各摸一张牌";
			return str;
		},
		check(event, player) {
			var color = get.color(player.getCards("h"));
			return color != "none";
		},
		async content(event, trigger, player) {
			player.addTempSkill("olbingyi_blocker", ["phaseZhunbeiAfter", "phaseJudgeAfter", "phaseDrawAfter", "phaseUseAfter", "phaseDiscardAfter", "phaseJieshuAfter"]);

			const cards = player.getCards("h");
			await player.showCards(cards, `${get.translation(player)}发动了【秉壹】`);

			if (get.color(cards) === "none") {
				return;
			}

			const num = cards.length;
			const result = await player
				.chooseTarget({
					prompt: `令至多${get.cnNumber(num)}名角色也各摸一张牌`,
					filterTarget(card, player, target) {
						return player !== target;
					},
					ai(target) {
						const player = get.player();
						let att = get.attitude(player, target) / Math.sqrt(1 + target.countCards("h"));
						if (target.hasSkillTag("nogain")) {
							att /= 10;
						}
						return att;
					},
				})
				.forResult();

			if (!result.bool || !result.targets?.length) {
				await player.draw();
				return;
			}

			const targets = result.targets;
			player.line(targets, "green");
			targets.push(player);
			await game.asyncDraw(targets.sortBySeat());
			await game.delayx();
		},
		subSkill: {
			blocker: {
				charlotte: true,
			},
		},
	},
	//孙体
	xinzhaofu: {
		audio: "zhaofu",
		audioname: ["ol_sunxiu"],
		enable: "phaseUse",
		usable: 1,
		limited: true,
		skillAnimation: true,
		animationColor: "wood",
		selectTarget: [1, 2],
		filterTarget: lib.filter.notMe,
		zhuSkill: true,
		async contentBefore(event, trigger, player) {
			player.awakenSkill(event.skill);
		},
		async content(event, trigger, player) {
			const { target } = event;
			target.addSkill("xinzhaofu_effect");
			target.markAuto("xinzhaofu_effect", [player]);
		},
		ai: {
			order: 9,
			result: {
				target(player, target) {
					var targets = game.filterPlayer(function (current) {
						return current.group == "wu" && get.attitude(player, current) > 0;
					});
					if (targets.length) {
						for (var targetx of targets) {
							if (!targetx.inRange(target)) {
								return -1;
							}
						}
						return -0.5;
					}
					return 0;
				},
			},
		},
		subSkill: {
			effect: {
				charlotte: true,
				mark: true,
				intro: { content: "已视为在其他吴势力角色的攻击范围内" },
				mod: {
					inRangeOf(from, to) {
						if (from.group != "wu") {
							return;
						}
						var list = to.getStorage("xinzhaofu_effect");
						for (var i of list) {
							if (i != from) {
								return true;
							}
						}
					},
				},
			},
		},
	},
	xinkuangbi: {
		audio: "kuangbi",
		enable: "phaseUse",
		usable: 1,
		filterTarget(card, player, target) {
			return target != player && target.countCards("he") > 0;
		},
		async content(event, trigger, player) {
			const { target } = event;
			const result = await target
				.chooseCard({
					prompt: `匡弼：交给${get.translation(player)}一至三张牌`,
					selectCard: [1, 3],
					position: "he",
					forced: true,
					ai(card) {
						const event = get.event();
						const player = get.player();
						if (get.attitude(player, event.getParent()?.player) > 0) {
							return 7 - get.value(card);
						}
						return -get.value(card);
					},
				})
				.forResult();

			if (result.bool && result.cards?.length) {
				const next = target.give(result.cards, player, false);
				next.gaintag.add("xinkuangbi_keep");
				player.addTempSkill("xinkuangbi_keep");
				target.addSkill("xinkuangbi_draw");
				target.addMark("xinkuangbi_draw", result.cards.length, false);
				await next;
			}
		},
		ai: {
			order: 1,
			result: {
				target(player, target) {
					if (get.attitude(player, target) > 0) {
						return Math.sqrt(target.countCards("he"));
					}
					return 0;
				},
				player: 1,
			},
		},
		subSkill: {
			keep: {
				mod: {
					ignoredHandcard(card, player) {
						if (card.hasGaintag("xinkuangbi_keep")) {
							return true;
						}
					},
					cardDiscardable(card, player, name) {
						if (name == "phaseDiscard" && card.hasGaintag("xinkuangbi_keep")) {
							return false;
						}
					},
				},
				charlotte: true,
				onremove(player) {
					player.removeGaintag("xinkuangbi_keep");
				},
			},
			draw: {
				trigger: { player: "phaseBegin" },
				forced: true,
				charlotte: true,
				onremove: true,
				intro: {
					content: "下回合开始时摸#张牌",
				},
				async content(event, trigger, player) {
					await player.draw(player.countMark("xinkuangbi_draw"));
					player.removeSkill("xinkuangbi_draw");
				},
			},
		},
	},
	rejingce: {
		getNum(event, player) {
			const list = [];
			player.getHistory("useCard", evt => {
				if (evt.getParent("phaseUse") == event) {
					list.add(get.type2(evt.card));
				}
			});
			return list.length;
		},
		audio: "jingce",
		trigger: { player: "phaseUseEnd" },
		frequent: true,
		filter(event, player) {
			return player.hasHistory("useCard", evt => evt.getParent("phaseUse") == event);
		},
		async content(event, trigger, player) {
			const num = get.info(event.name).getNum(trigger, player);
			await player.draw(num);
		},
		group: "rejingce_add",
		subSkill: {
			add: {
				trigger: { player: "loseEnd" },
				silent: true,
				firstDo: true,
				filter(event, player) {
					if (_status.currentPhase !== player) {
						return false;
					}
					if (event.getParent().name != "useCard") {
						return false;
					}
					const list = player.getStorage("rejingce_effect");
					return event.cards.some(card => !list.includes(get.suit(card, player)));
				},
				async content(event, trigger, player) {
					const effect = "rejingce_effect";
					player.addTempSkill(effect);
					player.markAuto(
						effect,
						trigger.cards.map(card => get.suit(card, player))
					);
					player.storage[effect].sort((a, b) => lib.suit.indexOf(b) - lib.suit.indexOf(a));
					player.addTip(effect, get.translation(effect) + player.getStorage(effect).reduce((str, suit) => str + get.translation(suit), ""));
				},
			},
			effect: {
				charlotte: true,
				onremove(player, skill) {
					delete player.storage[skill];
					player.removeTip(skill);
				},
				intro: { content: "当前已使用花色：$" },
				mod: {
					maxHandcard(player, num) {
						return num + player.getStorage("rejingce_effect").length;
					},
				},
			},
		},
	},
	rejueqing: {
		audio: 2,
		trigger: { source: "damageBegin2" },
		skillAnimation: true,
		animationColor: "water",
		filter(event, player) {
			return player != event.player && !player.storage.rejueqing_rewrite && event.notLink();
		},
		prompt2(event, player) {
			var num = get.cnNumber(2 * event.num, true);
			return "令即将对其造成的伤害翻倍至" + num + "点，并令自己失去" + get.cnNumber(event.num) + "点体力";
		},
		check(event, player) {
			return (
				player.hp > event.num &&
				event.player.hp > event.num &&
				!event.player.hasSkillTag("filterDamage", null, {
					player: player,
					card: event.card,
				}) &&
				get.attitude(player, event.player) < 0
			);
		},
		locked(skill, player) {
			return player && player.storage.rejueqing_rewrite;
		},
		logTarget: "player",
		async content(event, trigger, player) {
			await player.loseHp(trigger.num);
			trigger.num *= 2;
			const next = game.createEvent("rejueqing_rewrite", false);
			next.player = player;
			next.setContent(() => {
				if (!player.storage.rejueqing_rewrite) {
					game.log(player, "修改了", "#g【绝情】");
					player.popup("绝情");
					player.storage.rejueqing_rewrite = true;
				}
			});
			event.next.remove(next);
			trigger.after.push(next);
		},
		derivation: "rejueqing_rewrite",
		group: "rejueqing_rewrite",
		subSkill: {
			rewrite: {
				trigger: { source: "damageBefore" },
				forced: true,
				charlotte: true,
				audio: "rejueqing",
				filter(event, player) {
					return player.storage.rejueqing_rewrite == true;
				},
				check() {
					return false;
				},
				async content(event, trigger, player) {
					trigger.cancel();
					await trigger.player.loseHp(trigger.num);
				},
				ai: {
					jueqing: true,
					skillTagFilter(player) {
						return player.storage.rejueqing_rewrite == true;
					},
				},
			},
		},
	},
	reshangshi: {
		audio: 2,
		trigger: {
			player: ["loseAfter", "changeHp", "gainMaxHpAfter", "loseMaxHpAfter"],
			global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"],
		},
		frequent: true,
		prompt(event, player) {
			return "是否发动【伤逝】将手牌摸至" + get.cnNumber(player.getDamagedHp()) + "张？";
		},
		prompt2: false,
		filter(event, player) {
			if (event.getl && !event.getl(player)) {
				return false;
			}
			return player.countCards("h") < player.getDamagedHp();
		},
		async content(event, trigger, player) {
			await player.draw(player.getDamagedHp() - player.countCards("h"));
		},
		ai: {
			noh: true,
			freeSha: true,
			freeShan: true,
			skillTagFilter(player, tag) {
				if (player.maxHp - player.hp < player.countCards("h")) {
					return false;
				}
			},
		},
		group: "reshangshi_2nd",
	},
	reshangshi_2nd: {
		trigger: { player: "damageBegin3" },
		sourceSkill: "reshangshi",
		filter(event, player) {
			return player.countCards("he") > 0;
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseToDiscard({
					prompt: "是否发动【伤逝】弃置一张牌？",
					position: "he",
					ai(card) {
						const player = get.player();
						if (player.countCards("h") > player.getDamagedHp() + _status.event.getTrigger().num) {
							return 1;
						}
						if (player.isPhaseUsing()) {
							return 0.1 - player.getUseValue(card, null, true) / Math.max(0.1, get.value(card));
						}
						return (get.position(card) == "h" ? 5 : 0.1) - get.value(card);
					},
				})
				.set("chooseonly", true)
				.forResult();
		},
		async content(event, trigger, player) {
			await player.discard({
				cards: event.cards,
				discarder: player,
			});
		},
	},
	oldzhenlie: {
		audio: 2,
		trigger: {
			player: "judge",
		},
		check(event, player) {
			return event.judge(player.judging[0]) < 0;
		},
		async content(event, trigger, player) {
			const card = get.cards()[0];

			const next = game.cardsGotoOrdering(card);
			next.relatedEvent = trigger;
			await next;

			player.$throw(card);
			if (trigger.player.judging[0].clone) {
				trigger.player.judging[0].clone.classList.remove("thrownhighlight");
				game.broadcast(card => {
					if (card.clone) {
						card.clone.classList.remove("thrownhighlight");
					}
				}, trigger.player.judging[0]);
				game.addVideo("deletenode", player, get.cardsInfo([trigger.player.judging[0].clone]));
			}
			trigger.player.judging[0] = card;
			game.log(trigger.player, "的判定牌改为", card);
			await game.cardsDiscard(trigger.player.judging[0]);
			await game.delay(2);
		},
	},
	oldmiji: {
		trigger: { player: ["phaseZhunbeiBegin", "phaseJieshuBegin"] },
		audio: 2,
		filter(event, player) {
			return player.isDamaged();
		},
		async content(event, trigger, player) {
			let result = await player
				.judge({
					judge(card) {
						return get.color(card) === "black" ? 1 : -1;
					},
					judge2(result) {
						return result.bool;
					},
				})
				.forResult();

			if (!result.bool || player.maxHp <= player.hp) {
				return;
			}

			const cards = get.cards(player.maxHp - player.hp);
			result = await player
				.chooseTarget({
					forced: true,
					ai(target) {
						const player = get.player();
						return get.attitude(player, target) / Math.sqrt(1 + target.countCards("h"));
					},
				})
				.set("createDialog", ["请选择一名角色获得这些牌", cards])
				.forResult();

			if (result.bool && result.targets?.length) {
				player.line(result.targets);
				await result.targets[0].gain({
					cards,
					animate: "draw",
				});
			}
		},
		ai: {
			effect: {
				target(card, player, target) {
					if (get.tag(card, "recover") && target.hp == target.maxHp - 1) {
						return [0, 0];
					}
					if (target.hasFriend()) {
						if ((get.tag(card, "damage") == 1 || get.tag(card, "loseHp")) && target.hp == target.maxHp) {
							return [0, 1];
						}
					}
				},
			},
			threaten(player, target) {
				if (target.hp == 1) {
					return 3;
				}
				if (target.hp == 2) {
					return 2;
				}
				return 1;
			},
		},
	},
	oldqianxi: {
		audio: 2,
		trigger: { source: "damageBegin2" },
		check(event, player) {
			const att = get.attitude(player, event.player);
			if (event.player.hp == event.player.maxHp) {
				return att < 0;
			}
			if (event.player.hp == event.player.maxHp - 1 && (event.player.maxHp <= 3 || event.player.hasSkillTag("maixie"))) {
				return att < 0;
			}
			return att > 0;
		},
		filter(event, player) {
			return event.card && event.card.name == "sha" && get.distance(player, event.player) <= 1;
		},
		logTarget: "player",
		async content(event, trigger, player) {
			const result = await player
				.judge({
					judge(card) {
						return get.suit(card) != "heart" ? 1 : -1;
					},
					judge2(result) {
						return result.bool;
					},
				})
				.forResult();

			if (result.bool) {
				trigger.cancel();
				trigger.player.loseMaxHp({ forced: true });
			}
		},
	},
	old_fuhun: {
		audio: 2,
		trigger: { player: "phaseDrawBegin1" },
		filter(event, player) {
			return !event.numFixed;
		},
		async content(event, trigger, player) {
			trigger.changeToZero();

			const cards = get.cards(2);
			await player.showCards(cards, `${get.translation(player)}发动了【父魂】`);

			await player.gain({
				cards,
				animate: "gain2",
			});
			if (get.color(cards[0]) !== get.color(cards[1])) {
				player.addTempSkills(["wusheng", "paoxiao"]);
			}
		},
		derivation: ["wusheng", "paoxiao"],
	},
	wusheng_old_guanzhang: { audio: true },
	paoxiao_old_guanzhang: { audio: true },
	shiyong: {
		audio: 2,
		trigger: { player: "damageEnd" },
		forced: true,
		check() {
			return false;
		},
		filter(event, player) {
			return event.card && event.card.name == "sha" && (get.color(event.card) == "red" || event.getParent(2).jiu == true);
		},
		async content(event, trigger, player) {
			await player.loseMaxHp();
		},
		ai: {
			neg: true,
		},
	},
	xindanshou: {
		audio: 2,
		trigger: {
			global: "phaseJieshuBegin",
			target: "useCardToTargeted",
		},
		filter(event, player) {
			return ((event.name == "phaseJieshu" && event.player != player && player.countCards("he") >= event.player.countCards("h")) || (event.targets?.includes(player) && ["basic", "trick"].includes(get.type2(event.card)))) && !player.hasHistory("gain", evt => evt.getParent().name == "draw" && evt.getParent(2).name == "xindanshou");
		},
		async cost(event, trigger, player) {
			const skillName = event.name.slice(0, -5);
			if (trigger.name == "phaseJieshu") {
				let next;
				const { player: target } = trigger;
				const num = target.countCards("h");
				if (num > 0) {
					next = player.chooseToDiscard(get.prompt(skillName, target), num, `弃置${get.cnNumber(num)}张牌并对${get.translation(target)}造成1点伤害`, "he").set("ai", card => {
						const player = get.player();
						if (get.damageEffect(_status.event.getTrigger().player, player, player) > 0) {
							return 6 - get.value(card);
						}
						return -1;
					});
				} else {
					next = player.chooseBool(get.prompt(skillName, target), `对${get.translation(target)}造成1点伤害`).set("choice", get.damageEffect(target, player, player) > 0);
				}
				event.result = await next.forResult();
				event.result.targets = [target];
			} else {
				let num = 0;
				game.countPlayer2(current => {
					num += current.getHistory("useCard").filter(evt => ["basic", "trick"].includes(get.type2(evt.card)) && evt.targets?.includes(player)).length;
				});
				const { bool } = await player
					.chooseBool(`${get.prompt(skillName)}（可摸${get.cnNumber(num)}张牌）`, get.translation(`${skillName}_info`))
					.set("ai", () => {
						return _status.event.choice;
					})
					.set(
						"choice",
						(function () {
							if (player.isPhaseUsing()) {
								if (
									player.countCards("h", function (card) {
										return ["basic", "trick"].includes(get.type(card, "trick")) && player.canUse(card, player, null, true) && get.effect(player, card, player) > 0 && player.getUseValue(card, null, true) > 0;
									})
								) {
									return false;
								}
								return true;
							}
							if (num > 2) {
								return true;
							}
							var card = trigger.card;
							if (get.tag(card, "damage") && player.hp <= trigger.getParent().baseDamage && (!get.tag(card, "respondShan") || !player.hasShan("all")) && (!get.tag(card, "respondSha") || !player.hasSha())) {
								return true;
							}
							var source = _status.currentPhase;
							if (source?.isIn()) {
								var todis = source.countCards("h") - source.needsToDiscard();
								if (
									todis <=
										Math.max(
											Math.min(
												2 + (source.hp <= 1 ? 1 : 0),
												player.countCards("he", function (card) {
													return get.value(card, player) < Math.max(5.5, 8 - todis);
												})
											),
											player.countCards("he", function (card) {
												return get.value(card, player) <= 0;
											})
										) &&
									get.damageEffect(source, player, player) > 0
								) {
									return false;
								}
								if (!source.isPhaseUsing() || get.attitude(player, source) > 0) {
									return true;
								}
								if (card.name == "sha" && !source.getCardUsable("sha")) {
									return true;
								}
							}
							return Math.random() < num / 3;
						})()
					)
					.forResult();
				event.result = {
					bool: bool,
					cost_data: num,
				};
			}
		},
		async content(event, trigger, player) {
			if (trigger.name == "phaseJieshu") {
				await trigger.player.damage("nocard");
			} else {
				player.addTempSkill(event.name + "_used");
				await player.draw(event.cost_data);
			}
		},
		subSkill: { used: { charlotte: true } },
		ai: {
			threaten: 0.6,
			effect: {
				target_use(card, player, target, current) {
					if (typeof card != "object" || target.hasSkill("xindanshou_used") || !["basic", "trick"].includes(get.type(card, "trick"))) {
						return;
					}
					var num = 0;
					game.countPlayer2(function (current) {
						var history = current.getHistory("useCard");
						for (var j = 0; j < history.length; j++) {
							if (["basic", "trick"].includes(get.type(history[j].card, "trick")) && history[j].targets && history[j].targets.includes(player)) {
								num++;
							}
						}
					});
					if (player == target && current > 0) {
						return [1.1, num];
					}
					return [0.9, num];
				},
			},
		},
	},
	xinbenxi: {
		group: ["xinbenxi_summer", "xinbenxi_damage"],
		audio: 2,
		trigger: {
			player: "useCard2",
		},
		forced: true,
		mod: {
			globalFrom(from, to, distance) {
				if (_status.currentPhase == from) {
					return distance - from.storage.xinbenxi;
				}
			},
			wuxieRespondable(card, player, target, current) {
				if (player != current && player.storage.xinbenxi_directHit.includes(card)) {
					return false;
				}
			},
		},
		init(player) {
			player.storage.xinbenxi_directHit = [];
			player.storage.xinbenxi_damage = [];
			player.storage.xinbenxi_unequip = [];
			player.storage.xinbenxi = 0;
		},
		filter(trigger, player) {
			return (
				_status.currentPhase == player &&
				trigger.targets &&
				trigger.targets.length == 1 &&
				(get.name(trigger.card) == "sha" || get.type(trigger.card) == "trick") &&
				!game.hasPlayer(function (current) {
					return get.distance(player, current) > 1;
				})
			);
		},
		filterx(event, player) {
			var info = get.info(event.card);
			if (info.allowMultiple == false) {
				return false;
			}
			if (event.targets && !info.multitarget) {
				if (
					game.hasPlayer(function (current) {
						return lib.filter.targetEnabled2(event.card, player, current) && !event.targets.includes(current);
					})
				) {
					return true;
				}
			}
			return false;
		},
		async content(event, trigger, player) {
			const list = ["为XXX多选择一个目标", "　令XXX无视防具牌　", "　令XXX不可被抵消　", "当XXX造成伤害时摸牌"];
			const card = get.translation(trigger.card);
			for (const [i, item] of list.entries()) {
				// @ts-ignore
				list[i] = [i, item.replace(/XXX/g, card)];
			}
			const next = player.chooseButton({
				createDialog: ["奔袭：请选择一至两项", [list.slice(0, 2), "tdnodes"], [list.slice(2, 4), "tdnodes"]],
			});
			next.set("forced", true);
			next.set("selectButton", [1, 2]);
			next.set("filterButton", button => {
				if (button.link == 0) {
					return _status.event.bool1;
				}
				return true;
			});
			next.set("bool1", lib.skill.xinbenxi.filterx(trigger, player));
			next.set("ai", button => {
				const player = _status.event.player;
				const event = _status.event.getTrigger();
				switch (button.link) {
					case 0: {
						if (
							game.hasPlayer(current => {
								return lib.filter.targetEnabled2(event.card, player, current) && !event.targets.includes(current) && get.effect(current, event.card, player, player) > 0;
							})
						) {
							return 1.6 + Math.random();
						}
						return 0;
					}
					case 1: {
						if (
							event.targets.filter(current => {
								const eff1 = get.effect(current, event.card, player, player);
								player._xinbenxi_ai = true;
								const eff2 = get.effect(current, event.card, player, player);
								delete player._xinbenxi_ai;
								return eff1 > eff2;
							}).length
						) {
							return 1.9 + Math.random();
						}
						return Math.random();
					}
					case 2: {
						let num = 1.3;
						if (
							event.card.name == "sha" &&
							event.targets.filter(current => {
								if (current.mayHaveShan(player, "use") && get.attitude(player, current) <= 0) {
									if (current.hasSkillTag("useShan", null, "use")) {
										num = 1.9;
									}
									return true;
								}
								return false;
							}).length
						) {
							return num + Math.random();
						}
						return 0.5 + Math.random();
					}
					case 3: {
						return (get.tag(event.card, "damage") || 0) + Math.random();
					}
				}
			});
			const result = await next.forResult();
			if (!result?.bool || !result.links?.length) {
				return;
			}
			const map = [
				async (trigger, player, event) => {
					const result = await player
						.chooseTarget("请选择" + get.translation(trigger.card) + "的额外目标", true, (card, player, target) => {
							player = _status.event.player;
							if (_status.event.targets.includes(target)) {
								return false;
							}
							return lib.filter.targetEnabled2(_status.event.card, player, target);
						})
						.set("targets", trigger.targets)
						.set("card", trigger.card)
						.set("ai", target => {
							const trigger = _status.event.getTrigger();
							const player = _status.event.player;
							return get.effect(target, trigger.card, player, player);
						})
						.forResult();

					if (result.targets) {
						player.line(result.targets);
						trigger.targets.addArray(result.targets);
					}
				},
				(trigger, player, event) => {
					player.storage.xinbenxi_unequip.add(trigger.card);
				},
				(trigger, player, event) => {
					player.storage.xinbenxi_directHit.add(trigger.card);
					trigger.nowuxie = true;
					trigger.customArgs.default.directHit2 = true;
				},
				(trigger, player, event) => {
					player.storage.xinbenxi_damage.add(trigger.card);
				},
			];
			for (const link of result.links) {
				game.log(player, "选择了", "#g【奔袭】", "的", "#y选项" + get.cnNumber(link + 1, true));
				await map[link](trigger, player, event);
			}
		},
		ai: {
			unequip: true,
			unequip_ai: true,
			directHit_ai: true,
			skillTagFilter(player, tag, arg) {
				if (tag == "unequip") {
					if (arg && player.storage.xinbenxi_unequip.includes(arg.card)) {
						return true;
					}
					return false;
				}
				if (
					_status.currentPhase != player ||
					game.hasPlayer(function (current) {
						return get.distance(player, current) > 1;
					})
				) {
					return false;
				}
				if (tag == "directHit_ai") {
					return arg.card.name == "sha";
				}
				if (!arg || !arg.card || (arg.card.name != "sha" && arg.card.name != "chuqibuyi")) {
					return false;
				}
				var card = arg.target.getEquip(2);
				if (card && card.name.indexOf("bagua") != -1) {
					return true;
				}
				if (player._xinbenxi_ai) {
					return false;
				}
			},
		},
		subSkill: {
			damage: {
				sub: true,
				trigger: { global: "damageBegin1" },
				audio: "xinbenxi",
				forced: true,
				filter(event, player) {
					return event.card && player.storage.xinbenxi_damage.includes(event.card);
				},
				async content(event, trigger, player) {
					await player.draw();
				},
			},
			summer: {
				sub: true,
				trigger: { player: ["phaseAfter", "useCardAfter", "useCard"] },
				silent: true,
				filter(event, player) {
					return player == _status.currentPhase;
				},
				async content(event, trigger, player) {
					if (trigger.name == "phase") {
						player.storage.xinbenxi = 0;
						return;
					} else if (event.triggername == "useCard") {
						player.logSkill("xinbenxi");
						player.storage.xinbenxi++;
						player.syncStorage("xinbenxi");
						return;
					} else {
						player.storage.xinbenxi_unequip.remove(event.card);
						player.storage.xinbenxi_directHit.remove(event.card);
						player.storage.xinbenxi_damage.remove(event.card);
					}
				},
			},
		},
	},
	xinyaoming: {
		audio: 2,
		trigger: {
			player: "damageEnd",
			source: "damageSource",
		},
		filter(event, player) {
			const storage = player.getStorage("xinyaoming_used");

			const items = ["摸牌", "弃牌", "制衡"].filter(control => !storage.includes(control));
			if (items.length === 0) {
				return false;
			}

			return game.hasPlayer(target => {
				return items.some(control => {
					switch (control) {
						case "摸牌":
							return target !== player;
						case "弃牌":
							return target !== player && target.countCards("h") > 0;
						case "制衡":
							return true;
						default:
							return false;
					}
				});
			});
		},
		async cost(event, trigger, player) {
			if (player === game.me) {
				availableControlsPrompt(player);
			} else {
				player.send(availableControlsPrompt, player);
			}

			event.result = await player
				.chooseTarget({
					prompt: get.prompt2("xinyaoming"),
					filterTarget(card, player, target) {
						const storage = player.getStorage("xinyaoming_used");
						if (!storage.includes("制衡")) {
							return true;
						}

						if (target === player) {
							return false;
						}
						return !storage.includes("摸牌") || target.countCards("h") > 0;
					},
					ai(target) {
						const player = get.player();
						const storage = player.getStorage("xinyaoming_used");
						if (get.attitude(player, target) > 0 && !storage.includes("摸牌") && target !== player) {
							return get.effect(target, { name: "draw" }, player, player);
						}
						if (get.attitude(player, target) < 0 && !storage.includes("弃牌") && target !== player && target.countCards("h") > 0) {
							return get.effect(target, { name: "guohe_copy2" }, player, player);
						}
						if (get.attitude(player, target) > 0 && !storage.includes("制衡")) {
							return get.effect(target, { name: "kaihua" }, player, player);
						}
						return 0;
					},
				})
				.forResult();

			return;

			function availableControlsPrompt(player) {
				const storage = player.getStorage("xinyaoming_used");
				const controls = ["摸牌", "弃牌", "制衡"].filter(control => !storage.includes(control));

				for (const target of game.filterPlayer()) {
					const prompt = controls
						.filter(control => {
							switch (control) {
								case "摸牌":
									return target !== player;
								case "弃牌":
									return target !== player && target.countCards("h") > 0;
								case "制衡":
									return true;
								default:
									return false;
							}
						})
						.join("<br/>");
					target.prompt(prompt);
				}
			}
		},
		logTarget: "targets",
		async content(event, trigger, player) {
			const target = event.targets[0];

			const storage = player.getStorage("xinyaoming_used");
			const controls = ["摸牌", "弃牌", "制衡"]
				.filter(control => !storage.includes(control))
				.filter(control => {
					switch (control) {
						case "摸牌":
							return target !== player;
						case "弃牌":
							return target !== player && target.countCards("h") > 0;
						case "制衡":
							return true;
						default:
							return false;
					}
				});

			/** @type {Partial<Result>} */
			let result;
			if (controls.length > 1) {
				const targetName = get.translation(target);
				const controlMap = {
					摸牌: `令${targetName}摸一张牌`,
					弃牌: `弃置${targetName}一张手牌`,
					制衡: `令${targetName}弃置至多两张牌，然后其摸等量的牌`,
				};

				const choiceList = ["摸牌", "弃牌", "制衡"].map(control => (controls.includes(control) ? controlMap[control] : `<span style="opacity:0.5">${controlMap[control]}</span>`));
				result = await player
					.chooseControl({
						controls,
						choiceList,
						ai() {
							const { player, target, controls } = get.event();
							const map = {
								摸牌: get.effect(target, { name: "draw" }, player, player),
								弃牌: get.effect(target, { name: "guohe_copy2" }, player, player),
								制衡: get.effect(target, { name: "kaihua" }, player, player),
							};
							return controls.toSorted((a, b) => map[b] - map[a])[0];
						},
					})
					.set("target", target)
					.forResult();
			} else {
				result = { control: controls[0] };
			}

			player.addTempSkill("xinyaoming_used");
			player.markAuto("xinyaoming_used", [result.control]);
			switch (result.control) {
				case "摸牌":
					await target.draw();
					break;
				case "弃牌":
					await player.discardPlayerCard({
						target,
						position: "h",
						forced: true,
					});
					break;
				case "制衡":
					result = await target
						.chooseToDiscard({
							prompt: "邀名：弃置至多两张牌，然后摸等量的牌",
							selectCard: [1, 2],
							position: "he",
							forced: true,
							ai(card) {
								return lib.skill.zhiheng.check(card);
							},
						})
						.forResult();

					if (result.bool && result.cards?.length) {
						await target.draw(result.cards.length);
					}
					break;
			}
		},
		subSkill: {
			used: {
				charlotte: true,
				onremove: true,
			},
		},
	},
	xinfuli: {
		audio: 2,
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
			const num = game.countGroup();
			await player.recoverTo(num);
			await player.drawTo(num);
			if (num > 2) {
				await player.turnOver();
			}
		},
		ai: {
			save: true,
			skillTagFilter(player, arg, target) {
				return player == target;
			},
			result: { player: 10 },
			threaten(player, target) {
				if (!target.storage.xinfuli) {
					return 0.9;
				}
			},
		},
	},
	xindangxian: {
		trigger: { player: "phaseBegin" },
		forced: true,
		audio: "dangxian",
		audioname: ["xin_liaohua", "re_liaohua"],
		audioname2: {
			dc_guansuo: "dangxian_guansuo",
			guansuo: "dangxian_guansuo",
		},
		async content(event, trigger, player) {
			trigger.phaseList.splice(trigger.num, 0, `phaseUse|${event.name}`);
		},
		group: "xindangxian_rewrite",
		subSkill: {
			rewrite: {
				trigger: { player: "phaseUseBegin" },
				forced: true,
				popup: false,
				filter(kagari) {
					return kagari._extraPhaseReason == "xindangxian";
				},
				async content(event, trigger, player) {
					const result = player.storage.xinfuli
						? await player
								.chooseBool("是否失去1点体力并获得一张【杀】？")
								.set("choice", player.hp > 2 && !player.hasSha())
								.forResult()
						: { bool: true };
					if (!result?.bool) {
						return;
					}
					await player.loseHp();
					const card = get.cardPile(card => card.name == "sha");
					if (card) {
						await player.gain(card, "gain2");
					}
					game.updateRoundNumber();
				},
			},
		},
		ai: {
			combo: "xinfuli",
			halfneg: true,
		},
	},
	xinjunxing: {
		inherit: "junxing",
		audio: "junxing",
		async content(event, trigger, player) {
			const { cards, target } = event;
			const types = new Set(cards.map(card => get.type(card, "trick", player)));
			const result = await target
				.chooseToDiscard({
					filterCard(card) {
						const { types } = get.event();
						return !types.has(get.type(card, "trick"));
					},
					ai(card) {
						const player = get.player();
						if (player.isTurnedOver()) {
							return -1;
						}
						return 8 - get.value(card);
					},
				})
				.set("types", types)
				.set("dialog", [`弃置一张与${get.translation(player)}弃置的牌类别均不同的牌，或将武将牌翻面`, "hidden", cards])
				.forResult();
			if (result.bool) {
				return;
			}

			await target.turnOver();
			const num = 4 - target.countCards("h");
			if (num) {
				await target.draw(num);
			}
		},
	},
	xinzhige: {
		enable: "phaseUse",
		usable: 1,
		audio: "zhige",
		position: "he",
		selectTarget: 2,
		multitarget: true,
		targetprompt: ["出杀人", "出杀目标"],
		filterTarget(card, player, target) {
			if (ui.selected.targets.length == 0) {
				return target != player && target.inRange(player);
			} else {
				return ui.selected.targets[0].inRange(target);
			}
		},
		async content(event, trigger, player) {
			const { targets } = event;

			const result = await targets[0]
				.chooseCard({
					prompt: `"交给${get.translation(player)}一张【杀】或武器牌，否则视为对${get.translation(targets[1])}使用一张【杀】"`,
					filterCard(card) {
						return get.name(card) === "sha" || get.subtype(card) === "equip1";
					},
					position: "he",
					ai(card) {
						const player = _status.event.player;
						const target = _status.event.getParent("xinzhige").targets[1];
						return get.effect(target, { name: "sha" }, player, player) >= 0 ? -1 : 9 - get.value(card);
					},
				})
				.forResult();
			if (result.bool && result.cards?.length) {
				await targets[0].give(result.cards, player, true);
			} else {
				if (targets[0].canUse("sha", targets[1])) {
					await targets[0].useCard({
						card: get.autoViewAs({ name: "sha", isCard: true }),
						targets: [targets[1]],
					});
				}
			}
		},
		ai: {
			result: {
				target(player, target) {
					if (ui.selected.targets.length) {
						var from = ui.selected.targets[0];
						return get.effect(target, { name: "sha" }, from, target);
					}
					var effs = [0, 0];
					game.countPlayer(function (current) {
						if (current != target && target.canUse("sha", current)) {
							var eff = get.effect(current, { name: "sha" }, target, target);
							if (eff > effs[0]) {
								effs[0] = eff;
							}
							if (eff < effs[1]) {
								effs[1] = eff;
							}
						}
					});
					return effs[get.attitude(player, target) > 0 ? 0 : 1];
				},
			},
			order: 8.5,
			expose: 0.2,
		},
	},
	xinzongzuo: {
		trigger: {
			global: "phaseBefore",
			player: "enterGame",
		},
		forced: true,
		audio: "zongzuo",
		filter(event, player) {
			return event.name != "phase" || game.phaseNumber == 0;
		},
		async content(event, trigger, player) {
			const num = game.countGroup();
			await player.gainMaxHp({ num });
			await player.recover({ num });
		},
		group: "xinzongzuo_lose",
		subSkill: {
			lose: {
				trigger: { global: "dieAfter" },
				forced: true,
				audio: "zongzuo",
				filter(event, player) {
					if (!lib.group.includes(event.player.group)) {
						return false;
					}
					if (
						game.hasPlayer(function (current) {
							return current.group == event.player.group;
						})
					) {
						return false;
					}
					return true;
				},
				async content(event, trigger, player) {
					await player.loseMaxHp();
					await player.draw(2);
				},
			},
		},
	},
	xintaoluan: {
		hiddenCard(player, name) {
			return !player.getStorage("xintaoluan").includes(name) && player.countCards("hes") > 0 && lib.inpile.includes(name);
		},
		audio: "taoluan",
		enable: "chooseToUse",
		filter(event, player) {
			return (
				player.hasCard(card =>
					lib.inpile.some(name => {
						if (player.getStorage("xintaoluan").includes(name)) {
							return false;
						}
						if (get.type(name) != "basic" && get.type(name) != "trick") {
							return false;
						}
						if (event.filterCard({ name: name, isCard: true, cards: [card] }, player, event)) {
							return true;
						}
						if (name == "sha") {
							for (var nature of lib.inpile_nature) {
								if (event.filterCard({ name: name, nature: nature, isCard: true, cards: [card] }, player, event)) {
									return true;
								}
							}
						}
						return false;
					}, "hes")
				) && !_status.dying.length
			);
		},
		chooseButton: {
			dialog(event, player) {
				var list = [];
				for (var name of lib.inpile) {
					if (get.type(name) == "basic" || get.type(name) == "trick") {
						if (player.getStorage("xintaoluan").includes(name)) {
							continue;
						}
						list.push([get.translation(get.type(name)), "", name]);
						if (name == "sha") {
							for (var j of lib.inpile_nature) {
								list.push(["基本", "", "sha", j]);
							}
						}
					}
				}
				return ui.create.dialog("滔乱", [list, "vcard"]);
			},
			filter(button, player) {
				return _status.event.getParent().filterCard({ name: button.link[2] }, player, _status.event.getParent());
			},
			check(button) {
				var player = _status.event.player;
				var card = { name: button.link[2], nature: button.link[3] };
				if (player.countCards("hes", cardx => cardx.name == card.name)) {
					return 0;
				}
				return _status.event.getParent().type == "phase" ? player.getUseValue(card) : 1;
			},
			backup(links, player) {
				return {
					filterCard: true,
					audio: "taoluan",
					popname: true,
					check(card) {
						return 7 - get.value(card);
					},
					position: "hes",
					viewAs: { name: links[0][2], nature: links[0][3] },
					onuse(result, player) {
						var evt = _status.event.getParent("phase");
						if (evt && evt.name == "phase" && !evt.xintaoluan) {
							evt.xintaoluan = true;
							var next = game.createEvent("xintaoluan_clear");
							_status.event.next.remove(next);
							evt.after.push(next);
							next.player = player;
							next.setContent(function () {
								delete player.storage.xintaoluan;
								delete player.storage.xintaoluan2;
							});
						}
						player.markAuto("xintaoluan", [result.card.name]);
					},
				};
			},
			prompt(links, player) {
				return "将一张牌当做" + (get.translation(links[0][3]) || "") + get.translation(links[0][2]) + "使用";
			},
		},
		ai: {
			order: 4,
			save: true,
			respondSha: true,
			respondShan: true,
			skillTagFilter(player, tag, arg) {
				if (!player.countCards("hes") || player.isTempBanned("xintaoluan")) {
					return false;
				}
				if (tag == "respondSha" || tag == "respondShan") {
					if (arg == "respond") {
						return false;
					}
					return !player.getStorage("taoluan").includes(tag == "respondSha" ? "sha" : "shan");
				}
				return !player.getStorage("taoluan").includes("tao") || (!player.getStorage("taoluan").includes("jiu") && arg == player);
			},
			result: {
				player(player) {
					var num = player.countMark("xintaoluan2");
					var players = game.filterPlayer();
					for (var i = 0; i < players.length; i++) {
						if (players[i] != player && players[i].countCards("he") > (num + 1) * 2 && get.attitude(player, players[i]) > 0) {
							return 1;
						}
					}
					return 0;
				},
			},
			threaten: 1.9,
		},
		group: "xintaoluan2",
	},
	xintaoluan2: {
		trigger: { player: ["useCardAfter", "respondAfter"] },
		forced: true,
		popup: false,
		charlotte: true,
		sourceSkill: "xintaoluan",
		filter(event, player) {
			if (!game.hasPlayer(current => current != player)) {
				return false;
			}
			return event.skill == "xintaoluan_backup";
		},
		async content(event, trigger, player) {
			player.addMark("xintaoluan2", 1, false);
			const num = player.countMark("xintaoluan2");
			let result = await player
				.chooseTarget({
					prompt: `滔乱<br><br><div class="text center">令一名其他角色选择一项：1.交给你${get.cnNumber(num)}张与你以此法使用的牌类别不同的牌；2.你失去${get.cnNumber(num)}点体力`,
					filterTarget(card, player, target) {
						return target !== player;
					},
					forced: true,
					ai(target) {
						const player = get.player();
						if (get.attitude(player, target) > 0) {
							if (get.attitude(target, player) > 0) {
								return target.countCards("h");
							}
							return target.countCards("h") / 2;
						}
						return 0;
					},
				})
				.forResult();
			if (!result.bool || !result.targets?.length) {
				return;
			}

			const target = result.targets[0];
			player.line(target, "green");
			const type = get.type(trigger.card, "trick");
			result = await target
				.chooseCard({
					prompt: `滔乱<br><br><div class="text center">交给${get.translation(player)}${get.cnNumber(num)}张不为${get.translation(type)}牌的牌，或令其失去${get.cnNumber(num)}点体力且滔乱无效直到回合结束`,
					filterCard(card) {
						return get.type(card, "trick") !== get.event().cardType;
					},
					selectCard: num,
					position: "he",
					ai(card) {
						if (get.event().att) {
							return 11 - get.value(card);
						}
						return 0;
					},
				})
				.set("cardType", type)
				.set("att", get.attitude(target, player) > 0)
				.forResult();
			if (result.bool && result.cards?.length) {
				await target.give(result.cards, player, true);
			} else {
				player.tempBanSkill("xintaoluan");
				await player.loseHp(num);
			}
		},
	},
	xintaoluan_backup: {},
	xincaishi: {
		audio: "caishi",
		trigger: { player: "phaseDrawBegin2" },
		async cost(event, trigger, player) {
			const choices = [];
			const choiceList = ["少摸一张牌，本回合发动〖忠鉴〗时可以多展示自己的一张牌", "手牌上限-1且本回合发动〖忠鉴〗时可以多展示对方的一张牌", "多摸两张牌，然后本回合内不能发动〖忠鉴〗"];
			if (!trigger.numFixed && trigger.num > 0) {
				choices.push("选项一");
			} else {
				choiceList[0] = '<span style="opacity:0.5">' + choiceList[0] + "</span>";
			}
			choices.push("选项二");
			if (!trigger.numFixed) {
				choices.push("选项三");
			} else {
				choiceList[2] = '<span style="opacity:0.5">' + choiceList[2] + "</span>";
			}
			const result = await player
				.chooseControl(choices, "cancel2")
				.set("choiceList", choiceList)
				.set("prompt", get.prompt(event.skill))
				.set("ai", () => {
					return 2;
				})
				.forResult();
			event.result = {
				bool: result?.control !== "cancel2",
				cost_data: result?.index,
			};
		},
		async content(event, trigger, player) {
			const index = event.cost_data;
			trigger.num += index > 1 ? 2 : index - 1;
			player.addTempSkill(`${event.name}_${index}`);
		},
		subSkill: {
			0: {
				charlotte: true,
				mark: true,
				intro: { content: "本回合发动〖忠鉴〗时可以多展示自己的一张牌" },
			},
			1: {
				charlotte: true,
				mark: true,
				intro: { content: "本回合发动〖忠鉴〗时可以多展示目标角色的一张牌" },
				mod: {
					maxHandcard(player, num) {
						return num - 1;
					},
				},
			},
			2: {
				charlotte: true,
				mark: true,
				intro: { content: "本回合不能发动〖忠鉴〗" },
			},
		},
	},
	xinzhongjian: {
		audio: "zhongjian",
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return !player.hasSkill("xincaishi_2") && player.countCards("h") > 0;
		},
		filterTarget(event, player, target) {
			return target != player && target.countCards("h") > 0;
		},
		filterCard: true,
		selectCard() {
			return get.player().hasSkill("xincaishi_0") ? [1, 2] : [1, 1];
		},
		check() {
			return 1;
		},
		discard: false,
		lose: false,
		async content(event, trigger, player) {
			const { cards, target } = event;
			const suits = cards.map(card => get.suit(card)).toUniqued();
			const numbers = cards.map(card => get.number(card)).toUniqued();
			await player.showCards(cards);
			if (!target.countCards("h")) {
				return;
			}
			const result = await player.choosePlayerCard(target, "h", [1, player.hasSkill("xincaishi_1") ? 4 : 3], `请选择${get.translation(target)}要展示的牌`, true).forResult();
			if (!result?.cards?.length) {
				return;
			}
			const cards2 = result.cards.slice(0);
			await target.showCards(cards2);
			while (cards2.length) {
				const card = cards2.shift();
				let bool = false;
				if (suits.includes(get.suit(card))) {
					bool = true;
					await player.draw();
				}
				if (numbers.includes(get.number(card))) {
					bool = true;
					await target.damage("nocard");
				}
				if (!bool && player.countDiscardableCards(player, "h")) {
					await player.chooseToDiscard("h", true);
				}
			}
		},
		ai: {
			result: {
				target(player, target) {
					return -target.countCards("h");
				},
			},
		},
	},
	new_qingxian: {
		group: ["qingxian_draw"],
		enable: "phaseUse",
		audio: "qingxian",
		usable: 1,
		position: "he",
		filterTarget(card, player, target) {
			return target != player;
		},
		complexCard: true,
		complexSelect: true,
		selectTarget() {
			return ui.selected.cards.length;
		},
		filterCard: true,
		selectCard() {
			var player = _status.event.player;
			return [1, player.hp];
		},
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
				} else if (pe == te && get.attitude(player, target) > 2) {
					return true;
				} else if (pe < te && get.attitude(player, target) < 0) {
					return true;
				}
				return false;
			});
			if (ui.selected.cards.length < number) {
				return 7 - get.value(cardx);
			} else {
				return 0;
			}
		},
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
		line: "thunder",
		async content(event, trigger, player) {
			const { target } = event;
			const pe = player.countCards("e");
			const te = target.countCards("e");
			if (pe > te) {
				await target.recover();
			} else if (pe == te) {
				await target.draw();
			} else if (pe < te) {
				await target.loseHp();
			}
		},
		ai: {
			order: 10,
			result: {
				target(player, target) {
					var pe = player.countCards("e", function (card) {
						return ui.selected.cards.includes(card) == false;
					});
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
	new_juexiang: {
		audio: "juexiang",
		trigger: {
			player: "die",
		},
		forced: true,
		forceDie: true,
		skillAnimation: true,
		animationColor: "water",
		derivation: ["new_canyun"],
		async content(event, trigger, player) {
			const source = trigger.source;
			if (source && source.isIn()) {
				await source.discard(source.getCards("e"));
				await source.loseHp();
			}
			const { targets } = await player
				.chooseTarget("【绝响】：是否令一名其他角色获得技能〖残韵〗？", lib.filter.notMe)
				.set("ai", target => {
					let att = get.attitude(get.player(), target);
					if (target.countCards("ej", { suit: "club" })) {
						att = att * 2;
					}
					return 10 + att;
				})
				.set("forceDie", true)
				.forResult();
			if (!targets || !targets.length) {
				return;
			}
			const target = targets[0];
			player.line(target, "thunder");
			await target.addSkills("new_canyun");
			const result = await target
				.chooseTarget("是否弃置场上的一张牌，获得技能〖绝响〗？", (card, player, target) => {
					return target.getDiscardableCards(player, "ej").some(i => get.suit(i) == "club");
				})
				.set("ai", target => {
					const player = get.player();
					return get.effect(target, { name: "guohe_copy2" }, player, player);
				})
				.forResult();
			if (result.bool) {
				await target.discardPlayerCard(result.targets[0], "ej", true).set("filterButton", button => {
					return get.suit(button.link) == "club";
				});
				await target.addSkills("new_juexiang");
			}
		},
	},
	new_canyun: {
		group: ["qingxian_draw"],
		complexCard: true,
		complexSelect: true,
		marktext: "韵",
		init(player, skill) {
			if (!player.storage[skill]) {
				player.storage[skill] = [];
			}
		},
		intro: {
			content(storage) {
				var str = "";
				var str2 = "<li>出牌阶段限一次，你可以弃置至多X张牌并选择等量的其他角色（不能选择已经成为过〖残韵〗目标的角色）。这些角色中，装备区内牌数少于你的回复1点体力，等于你的摸一张牌，多于你的失去1点体力。若你以此法指定的角色数等于X，则你摸一张牌。（X为你的体力值）";
				if (storage.length > 0) {
					for (var i = 0; i < storage.length; i++) {
						str += "、";
						str += get.translation(storage[i]);
					}
					str = str.slice(1);
					str2 += "<br><li>已对" + str + "发动过〖残韵〗";
				}
				return str2;
			},
		},
		mark: true,
		enable: "phaseUse",
		usable: 1,
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
		filter(event, player) {
			if (!player.storage.new_canyun) {
				player.storage.new_canyun = [];
			}
			return game.hasPlayer(function (current) {
				return current != player && !player.storage.new_canyun.includes(current);
			});
		},
		filterTarget(card, player, target) {
			return target != player && !player.storage.new_canyun.includes(target);
		},
		selectTarget() {
			return ui.selected.cards.length;
		},
		filterCard: true,
		selectCard() {
			var player = _status.event.player;
			return [1, player.hp];
		},
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
		line: "thunder",
		position: "he",
		async content(event, trigger, player) {
			const { target } = event;
			player.storage.new_canyun.push(target);
			const pe = player.countCards("e");
			const te = target.countCards("e");
			if (pe > te) {
				await target.recover();
			} else if (pe == te) {
				await target.draw();
			} else if (pe < te) {
				await target.loseHp();
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
	qingxian_draw: {
		trigger: {
			player: ["new_qingxianAfter", "new_canyunAfter"],
		},
		forced: true,
		popup: false,
		silent: false,
		filter(event, player) {
			return event.target == event.targets[event.targets.length - 1] && event.targets.length == player.hp;
		},
		async content(event, trigger, player) {
			await player.draw();
		},
	},
	zhenjun: {
		audio: ["jieyue", 2],
		trigger: {
			player: "phaseZhunbeiBegin",
		},
		filter(event, player) {
			return game.hasPlayer(function (current) {
				return current.countCards("h") > current.hp;
			});
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget({
					prompt: get.prompt2("zhenjun"),
					filterTarget(card, player, target) {
						return target.countCards("h") > target.hp;
					},
					ai(target) {
						const player = get.player();
						return -get.attitude(player, target) * (target.countCards("e") + 1);
					},
				})
				.forResult();
		},
		line: "thunder",
		logTarget: "targets",
		async content(event, trigger, player) {
			const target = event.targets[0];
			const num = target.countCards("h") - target.hp;

			let result = await player
				.discardPlayerCard({
					target,
					selectButton: num,
					forced: true,
					allowChooseAll: true,
				})
				.forResult();

			if (!result.bool || !result.cards?.length) {
				return;
			}

			let num2 = 0;
			const num3 = result.cards.length;
			for (const card of result.cards) {
				if (get.type(card, null, card.original === "h" ? target : false) !== "equip") {
					num2++;
				}
			}

			if (num2 <= 0) {
				return;
			}
			const prompt = `弃置${get.cnNumber(num2)}张牌，或令${get.translation(target)}摸${get.cnNumber(num3)}张牌`;
			result = await player
				.chooseToDiscard({
					prompt,
					selectCard: num2,
					position: "he",
					allowChooseAll: true,
					ai(card) {
						return 5 - get.value(card);
					},
				})
				.forResult();
			if (!result.bool) {
				await target.draw(num3);
			}
		},
	},
	rezhenjun: {
		audio: ["jieyue", 2],
		trigger: {
			player: "phaseZhunbeiBegin",
		},
		filter(event, player) {
			return game.hasPlayer(function (current) {
				return current.countCards("h") > 0;
			});
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt2("rezhenjun"), (card, player, target) => {
					return target.countCards("he");
				})
				.set("ai", target => {
					const player = get.player();
					return -get.attitude(player, target) * (target.countCards("e") + 1);
				})
				.forResult();
		},
		logTarget: "targets",
		async content(event, trigger, player) {
			const target = event.targets[0];
			const num = Math.max(target.countCards("h") - target.hp, 1);

			let result = await player
				.discardPlayerCard({
					target,
					selectButton: num,
					forced: true,
					allowChooseAll: true,
				})
				.forResult();
			if (!result.bool || !result.cards?.length) {
				return;
			}

			let num2 = 0;
			for (const card of result.cards) {
				if (get.type(card) !== "equip") {
					num2++;
				}
			}

			if (num2 <= 0) {
				return;
			}

			const prompt = `弃置${get.cnNumber(num2)}张牌，或令${get.translation(target)}摸${get.cnNumber(num2)}张牌`;
			result = await player
				.chooseToDiscard({
					prompt,
					selectCard: num2,
					position: "he",
					allowChooseAll: true,
					ai(card) {
						return 5 - get.value(card);
					},
				})
				.forResult();
			if (!result.bool) {
				await target.draw(num2);
			}
		},
	},
	fenli: {
		audio: 2,
		audioname: ["xin_zhuhuan"],
		group: ["fenli_draw", "fenli_use", "fenli_discard"],
		subfrequent: ["discard"],
		subSkill: {
			draw: {
				audio: "fenli",
				audioname: ["xin_zhuhuan"],
				trigger: { player: "phaseDrawBefore" },
				prompt: "是否发动【奋励】跳过摸牌阶段？",
				filter(event, player) {
					return player.isMaxHandcard();
				},
				check(event, player) {
					if ((!player.hasSkill("pingkou") && !player.hasSkill("xinpingkou")) || player.getHistory("skipped").length > 0) {
						return false;
					}
					return game.hasPlayer(function (current) {
						return get.attitude(player, current) < 0 && current.hp == 1 && get.damageEffect(current, player, player) > 0;
					});
				},
				async content(event, trigger, player) {
					trigger.cancel();
				},
			},
			use: {
				audio: "fenli",
				audioname: ["xin_zhuhuan"],
				trigger: { player: "phaseUseBefore" },
				prompt: "是否发动【奋励】跳过出牌阶段？",
				filter(event, player) {
					return player.isMaxHp();
				},
				check(event, player) {
					if (!player.hasSkill("pingkou") && !player.hasSkill("xinpingkou")) {
						return false;
					}
					if (!player.needsToDiscard() || (player.countCards("e") && player.isMaxEquip())) {
						return true;
					}
					if (player.getHistory("skipped").length > 0) {
						return false;
					}
					return game.hasPlayer(function (current) {
						return get.attitude(player, current) < 0 && current.hp == 1 && get.damageEffect(current, player, player) > 0;
					});
				},
				async content(event, trigger, player) {
					trigger.cancel();
				},
			},
			discard: {
				audio: "fenli",
				audioname: ["xin_zhuhuan"],
				trigger: { player: "phaseDiscardBefore" },
				prompt: "是否发动【奋励】跳过弃牌阶段？",
				frequent: true,
				filter(event, player) {
					return player.isMaxEquip() && player.countCards("e") > 0;
				},
				async content(event, trigger, player) {
					trigger.cancel();
				},
			},
		},
		ai: {
			combo: "pingkou",
		},
	},
	pingkou: {
		audio: 2,
		trigger: { player: "phaseEnd" },
		filter(event, player) {
			return player.getHistory("skipped").length > 0;
		},
		async cost(event, trigger, player) {
			const skippedCount = player.getHistory("skipped").length;
			event.result = await player
				.chooseTarget({
					prompt: get.prompt2("pingkou"),
					filterTarget(card, player, target) {
						return target !== player;
					},
					selectTarget: [1, skippedCount],
					ai(target) {
						return get.damageEffect(target, get.player(), get.player());
					},
				})
				.forResult();
		},
		logTarget: "targets",
		async content(event, trigger, player) {
			// @ts-ignore
			await game.doAsyncInOrder(event.targets, target => target.damage());
		},
		ai: {
			effect: {
				target(card) {
					if (card.name == "lebu" || card.name == "bingliang") {
						return 0.5;
					}
				},
			},
			combo: "fenli",
		},
	},
	xinanguo: {
		audio: "anguo",
		enable: "phaseUse",
		usable: 1,
		filterTarget: lib.filter.notMe,
		async content(event, trigger, player) {
			const { target } = event;

			const drawing = [current => current.isMinHandcard(), current => current.draw()];
			const recovering = [current => current.isMinHp() && current.isDamaged(), current => current.recover()];
			const equipping = [
				current => current.isMinEquip(),
				async current => {
					const equip = get.cardPile(card => get.type(card) == "equip" && current.hasUseTarget(card), false, "random");
					if (equip) {
						await current.chooseUseTarget({
							card: equip,
							throw: false,
							nopopup: true,
							forced: true,
						});
					}
				},
			];

			const todo = [drawing, recovering, equipping];

			for (let i = 0; i < todo.length; ++i) {
				const [condition, action] = todo[i];
				if (condition(target)) {
					await action(target);
					todo.splice(i, 1);
					--i;
				}
			}

			game.updateRoundNumber();
			if (!todo.length) {
				return;
			}

			for (const [condition, action] of todo) {
				if (condition(player)) {
					await action(player);
				}
			}
			game.updateRoundNumber();
		},
		ai: {
			threaten: 1.6,
			order: 9,
			result: {
				player(player, target) {
					if (get.attitude(player, target) <= 0) {
						if (target.isMinHandcard() || target.isMinEquip() || target.isMinHp()) {
							return -1;
						}
					}
					var num = 0;
					if (player.isMinHandcard() || target.isMinHandcard()) {
						num++;
					}
					if (player.isMinEquip() || target.isMinEquip()) {
						num++;
					}
					if ((player.isMinHp() && player.isDamaged()) || (target.isMinHp() && target.isDamaged())) {
						num += 2.1;
					}
					return num;
				},
			},
		},
	},
	pindi: {
		audio: 2,
		enable: "phaseUse",
		filterTarget(card, player, target) {
			if (player == target) {
				return false;
			}
			if (player.storage.pindi_target && player.storage.pindi_target.includes(target)) {
				return false;
			}
			return true;
		},
		filterCard(card, player) {
			if (player.storage.pindi_type && player.storage.pindi_type.includes(get.type2(card))) {
				return false;
			}
			return true;
		},
		subSkill: {
			clear: {
				trigger: { player: "phaseAfter" },
				silent: true,
				async content(event, trigger, player) {
					delete player.storage.pindi_target;
					delete player.storage.pindi_type;
				},
			},
		},
		//group:'pindi_clear',
		check(card) {
			var num = _status.event.player.getStat("skill").pindi || 0;
			return 6 + num - get.value(card);
		},
		position: "he",
		async content(event, trigger, player) {
			const { target, cards } = event;
			if (!player.storage.pindi_target) {
				player.storage.pindi_target = [];
			}
			if (!player.storage.pindi_type) {
				player.storage.pindi_type = [];
			}
			player.storage.pindi_target.push(target);
			player.storage.pindi_type.push(get.type2(cards[0], cards[0].original == "h" ? player : false));
			const num = player.getStat("skill").pindi;
			const evt = _status.event.getParent("phase");
			if (evt && evt.name == "phase" && !evt.pindi) {
				const next = game.createEvent("rerende_clear");
				_status.event.next.remove(next);
				evt.after.push(next);
				evt.pindi = true;
				next.player = player;
				next.setContent(lib.skill.pindi_clear.content);
			}
			player.syncStorage();
			let result;
			if (target.countCards("he") == 0) {
				result = { index: 0 };
			} else {
				result = await player
					.chooseControlList(true, ["令" + get.translation(target) + "摸" + get.cnNumber(num) + "张牌", "令" + get.translation(target) + "弃置" + get.cnNumber(num) + "张牌"], function () {
						return _status.event.choice;
					})
					.set("choice", get.attitude(player, target) > 0 ? 0 : 1)
					.forResult();
			}
			if (result.index == 0) {
				await target.draw(num);
			} else {
				await target.chooseToDiscard(num, "he", true);
			}
			if (target.isDamaged()) {
				await player.link(true);
			}
		},
		ai: {
			order: 8,
			threaten: 1.8,
			result: {
				target(player, target) {
					var att = get.attitude(player, target);
					var num = (player.getStat("skill").pindi || 0) + 1;
					if (att <= 0 && target.countCards("he") < num) {
						return 0;
					}
					return get.sgn(att);
				},
			},
		},
	},
	funan: {
		audio: 2,
		trigger: { global: ["respond", "useCard"] },
		filter(event, player) {
			if (!event.respondTo) {
				return false;
			}
			if (event.player == player) {
				return false;
			}
			if (player != event.respondTo[0]) {
				return false;
			}
			if (!player.hasSkill("funan_jiexun")) {
				const cards = [];
				if (get.itemtype(event.respondTo[1]) == "card") {
					cards.push(event.respondTo[1]);
				} else if (event.respondTo[1].cards) {
					cards.addArray(event.respondTo[1].cards);
				}
				return cards.filterInD("od").length > 0;
			} else {
				return event.cards.filterInD("od").length > 0;
			}
		},
		check(event, player) {
			if (player.hasSkill("funan_jiexun") || get.attitude(player, event.player) > 0) {
				return true;
			}
			let cards = [];
			if (get.itemtype(event.respondTo[1]) == "card") {
				cards.push(event.respondTo[1]);
			} else if (event.respondTo[1].cards) {
				cards.addArray(event.respondTo[1].cards);
			}
			return (
				event.cards.filterInD("od").reduce((acc, card) => {
					return acc + get.value(card);
				}, 0) -
				cards.filterInD("od").reduce((acc, card) => {
					return acc + get.value(card);
				})
			);
		},
		logTarget: "player",
		async content(event, trigger, player) {
			if (!player.hasSkill("funan_jiexun")) {
				let cards = [];
				if (get.itemtype(trigger.respondTo[1]) == "card") {
					cards.push(trigger.respondTo[1]);
				} else if (trigger.respondTo[1].cards) {
					cards.addArray(trigger.respondTo[1].cards);
				}
				cards = cards.filterInD("od");
				trigger.player.addTempSkill("funan_use");
				await trigger.player.gain({
					cards,
					animate: "gain2",
					log: true,
					gaintag: ["funan"],
				});
			}

			const cards = trigger.cards.filterInD("od");
			await player.gain({
				cards,
				animate: "gain2",
				log: true,
			});
		},
		subSkill: {
			jiexun: {
				charlotte: true,
				mark: true,
				marktext: "复",
				intro: {
					content: "你发动“复难”时，无须令其他角色获得你使用的牌",
				},
			},
			use: {
				onremove(player) {
					player.removeGaintag("funan");
				},
				charlotte: true,
				mod: {
					cardEnabled2(card, player) {
						if (get.itemtype(card) == "card" && card.hasGaintag("funan")) {
							return false;
						}
					},
				},
			},
		},
	},
	jiexun: {
		audio: 2,
		trigger: { player: "phaseJieshuBegin" },
		onremove: true,
		async cost(event, trigger, player) {
			const num1 = game
				.filterPlayer()
				.map(current => current.countCards("ej", { suit: "diamond" }))
				.reduce((a, b) => a + b, 0);
			const num2 = player.countMark("jiexun");

			let prompt = `令目标摸${get.cnNumber(num1)}张牌`;
			if (num2 > 0) {
				prompt = `${prompt}，然后弃置${get.cnNumber(num2)}张牌；若目标因此法弃置了所有牌，则你失去“诫训”，然后你发动“复难”时，无须令其获得你使用的牌`;
			}

			event.result = await player
				.chooseTarget({
					prompt: get.prompt("jiexun"),
					prompt2: prompt,
					filterTarget(card, player, target) {
						return target !== player;
					},
					ai(target) {
						const { player, coeff } = get.event();
						return coeff * get.attitude(player, target);
					},
				})
				.set("coeff", num1 >= num2 ? 1 : -1)
				.forResult();

			event.result.cost_data = {
				num1,
				num2,
			};
		},
		logTarget: "targets",
		async content(event, trigger, player) {
			const target = event.targets[0];
			const { num1, num2 } = event.cost_data;

			if (num1) {
				await target.draw(num1);
			}
			player.addMark("jiexun", 1, false);

			if (!num2) {
				return;
			}

			const result = await target
				.chooseToDiscard({
					selectCard: num2,
					position: "he",
					forced: true,
				})
				.forResult();
			if (result.bool && result.autochoose && result.cards?.length === result.rawcards.length) {
				player.removeSkills("jiexun");
				player.addSkill("funan_jiexun");
			}
		},
	},
	xinjiexun: {
		audio: "jiexun",
		trigger: { player: "phaseJieshuBegin" },
		onremove: true,
		async cost(event, trigger, player) {
			const num1 = game
				.filterPlayer()
				.map(current => current.countCards("ej", { suit: "diamond" }))
				.reduce((a, b) => a + b, 0);
			const num2 = player.countMark("xinjiexun");

			let prompt = `令目标摸${get.cnNumber(num1)}张牌`;
			if (num2 > 0) {
				prompt = `${prompt}，然后弃置${get.cnNumber(num2)}张牌`;
			}

			event.result = await player
				.chooseTarget({
					prompt: get.prompt("xinjiexun"),
					prompt2: prompt,
					filterTarget(card, player, target) {
						return target !== player;
					},
					ai(target) {
						const { player, coeff } = get.event();
						return coeff * get.attitude(player, target);
					},
				})
				.forResult();

			event.result.cost_data = {
				num1,
				num2,
			};
		},
		logTarget: "targets",
		async content(event, trigger, player) {
			const target = event.targets[0];
			const { num1, num2 } = event.cost_data;
			if (num1) {
				await target.draw(num1);
			}
			player.addMark("xinjiexun", 1, false);

			if (num2) {
				const result = await target
					.chooseToDiscard({
						selectCard: num2,
						position: "he",
						forced: true,
					})
					.forResult();

				if (result.bool && result.autochoose && result.cards?.length === result.rawcards.length) {
					player.removeMark("xinjiexun", player.countMark("xinjiexun"), false);
					player.addSkill("funan_jiexun");
				}
			}
		},
		intro: { content: "已经发动过了#次" },
	},
	zhuandui: {
		audio: 2,
		group: ["zhuandui_respond", "zhuandui_use"],
		subSkill: {
			use: {
				audio: "zhuandui",
				trigger: { player: "useCardToPlayered" },
				check(event, player) {
					return get.attitude(player, event.target) < 0;
				},
				filter(event, player) {
					return event.card.name == "sha" && player.canCompare(event.target);
				},
				logTarget: "target",
				async content(event, trigger, player) {
					const result = await player.chooseToCompare(trigger.target).forResult();
					if (result.bool) {
						trigger.getParent().directHit.add(trigger.target);
					}
				},
			},
			respond: {
				audio: "zhuandui",
				trigger: { target: "useCardToTargeted" },
				check(event, player) {
					return get.effect(player, event.card, event.player, player) < 0;
				},
				filter(event, player) {
					return event.card.name == "sha" && player.canCompare(event.player);
				},
				logTarget: "player",
				async content(event, trigger, player) {
					const result = await player.chooseToCompare(trigger.player).forResult();
					if (result.bool) {
						trigger.getParent().excluded.add(player);
					}
				},
			},
		},
		ai: {
			directHit_ai: true,
			skillTagFilter(player, tag, arg) {
				if (player._zhuandui_temp || tag !== "directHit_ai") {
					return false;
				}
				player._zhuandui_temp = true;
				var bool = (function () {
					if (arg.card.name != "sha" || get.attitude(player, arg.target) >= 0 || !arg.target.countCards("h")) {
						return false;
					}
					if (
						arg.target.countCards("h") == 1 &&
						(!arg.target.hasSkillTag(
							"freeShan",
							false,
							{
								player: player,
								card: arg.card,
								type: "use",
							},
							true
						) ||
							player.hasSkillTag("unequip", false, {
								name: arg.card ? arg.card.name : null,
								target: arg.target,
								card: arg.card,
							}) ||
							player.hasSkillTag("unequip_ai", false, {
								name: arg.card ? arg.card.name : null,
								target: arg.target,
								card: arg.card,
							}))
					) {
						return true;
					}
					return (
						player.countCards("h", function (card) {
							return card != arg.card && (!arg.card.cards || !arg.card.cards.includes(card)) && get.value(card) <= 4 && (get.number(card) >= 11 + arg.target.countCards("h") / 2 || get.suit(card, player) == "heart");
						}) > 0
					);
				})();
				delete player._zhuandui_temp;
				return bool;
			},
			effect: {
				target_use(card, player, target, current) {
					if (card.name == "sha" && current < 0) {
						return 0.7;
					}
				},
			},
		},
	},
	tianbian: {
		audio: 2,
		enable: "chooseCard",
		check(event, player) {
			var player = _status.event.player;
			return !player.hasCard(function (card) {
				var val = get.value(card);
				return val < 0 || (val <= 4 && (get.number(card) >= 11 || get.suit(card) == "heart"));
			}, "h")
				? 20
				: 0;
		},
		filter(event) {
			return event.type == "compare" && !event.directresult;
		},
		onCompare(player) {
			return game.cardsGotoOrdering(get.cards()).cards;
		},
		ai: {
			forceWin: true,
			skillTagFilter(player, tag, arg) {
				return arg.card && get.suit(arg.card, false) == "heart";
			},
		},
		group: "tianbian_number",
		subSkill: {
			number: {
				trigger: { player: "compare", target: "compare" },
				filter(event, player) {
					if (event.player == player) {
						return !event.iwhile && get.suit(event.card1) == "heart"; //&&event.card1.vanishtag.includes('tianbian');
					} else {
						return get.suit(event.card2) == "heart"; //&&event.card2.vanishtag.includes('tianbian');
					}
				},
				silent: true,
				async content(event, trigger, player) {
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
	jianzheng: {
		audio: 2,
		trigger: { global: "useCardToPlayer" },
		filter(event, player) {
			if (!player.countCards("h")) {
				return false;
			}
			return event.player != player && event.card.name == "sha" && !event.targets.includes(player) && event.player.inRange(player);
		},
		async cost(event, trigger, player) {
			const { targets, player: playerx, card } = trigger;
			let effect = 0;
			for (let i = 0; i < targets.length; i++) {
				effect -= get.effect(targets[i], card, playerx, player);
			}
			if (effect > 0) {
				if (get.color(card) != "black") {
					effect = 0;
				} else {
					effect = 1;
				}
				if (targets.length == 1) {
					if (targets[0].hp == 1) {
						effect++;
					}
					if (effect > 0 && targets[0].countCards("h") < player.countCards("h")) {
						effect++;
					}
				}
				if (effect > 0) {
					effect += 6;
				}
			}
			event.result = await player
				.chooseCard("h", get.prompt2(event.skill, playerx))
				.set("ai", function (card) {
					if (_status.event.effect >= 0) {
						const val = get.value(card);
						if (val < 0) {
							return 10 - val;
						}
						return _status.event.effect - val;
					}
					return 0;
				})
				.set("effect", effect)
				.forResult();
		},
		logTarget: "player",
		async content(event, trigger, player) {
			const {
				cards: [card],
			} = event;
			game.log(player, "将", card, "置于牌堆顶");
			player.$throw(card, 1000);
			await player.lose(card, ui.cardPile, "visible", "insert");
			trigger.targets.length = 0;
			trigger.getParent().triggeredTargets1.length = 0;
			if (get.color(trigger.card) != "black") {
				trigger.getParent().targets.push(player);
				trigger.player.line(player);
				await game.delay();
			}
		},
		ai: {
			threaten: 1.1,
			expose: 0.25,
		},
	},
	qingxian: {
		audio: 2,
		group: ["qingxian_jilie", "qingxian_rouhe", "qingxian_dying"],
		ai: {
			threaten: 0.8,
			maixie: true,
			maixie_hp: true,
			maixie_defend: true,
			effect: {
				target(card, player, target) {
					if (get.tag(card, "damage")) {
						if (target.hp > 1 && target.hasFriend()) {
							return 0.4;
						}
					}
				},
			},
		},
		subSkill: {
			dying: {
				audio: "qingxian",
				trigger: { global: "dyingAfter" },
				filter(event, player) {
					return player.storage.qingxian && player.storage.qingxian > 0 && !_status.dying.length;
				},
				getIndex(event, player) {
					return player.storage.qingxian;
				},
				async cost(event, trigger, player) {
					event.result = await player
						.chooseTarget({
							prompt: get.prompt("qingxian"),
							prompt2: "当你回复体力后，你可以令一名其他角色执行一项：失去1点体力，随机使用一张装备牌；回复1点体力，弃置一张装备牌。若其以此法使用或弃置的牌为梅花，你回复1点体力",
							filterTarget(card, player, target) {
								return target !== player;
							},
							ai(target) {
								const att = get.attitude(_status.event.player, target);
								if (target.isHealthy() && att > 0) {
									return 0;
								}
								if (target.hp == 1 && att != 0) {
									if (att > 0) {
										return 9;
									} else {
										return 10;
									}
								} else {
									return Math.sqrt(Math.abs(att));
								}
							},
						})
						.forResult();
				},
				logTarget: "targets",
				async content(event, trigger, player) {
					const target = event.targets[0];
					event.insert(lib.skill.qingxian.content_choose, {
						target,
						player,
					});
				},
			},
			rouhe: {
				audio: "qingxian",
				trigger: { player: "recoverEnd" },
				async cost(event, trigger, player) {
					if (_status.dying.length) {
						player.storage.qingxian ??= 0;
						player.storage.qingxian++;
						event.result = { bool: false };
						return;
					}

					event.result = await player
						.chooseTarget({
							prompt: get.prompt("qingxian"),
							prompt2: "当你回复体力后，你可以令一名其他角色执行一项：失去1点体力，随机使用一张装备牌；回复1点体力，弃置一张装备牌。若其以此法使用或弃置的牌为梅花，你回复1点体力",
							filterTarget(card, player, target) {
								return target !== player;
							},
							ai(target) {
								const att = get.attitude(_status.event.player, target);
								if (target.isHealthy() && att > 0) {
									return 0;
								}
								if (target.hp == 1 && att != 0) {
									if (att > 0) {
										return 9;
									} else {
										return 10;
									}
								} else {
									return Math.sqrt(Math.abs(att));
								}
							},
						})
						.forResult();
				},
				logTarget: "targets",
				async content(event, trigger, player) {
					const target = event.targets[0];
					event.insert(lib.skill.qingxian.content_choose, {
						target,
						player,
					});
				},
			},
			jilie: {
				audio: "qingxian",
				trigger: { player: "damageEnd" },
				filter(event, player) {
					return event.source && event.source.isIn();
				},
				check(event, player) {
					if (get.attitude(player, event.source) > 0 && event.source.isHealthy()) {
						return false;
					}
					return true;
				},
				logTarget: "source",
				prompt2: "当你受到伤害后，你可以令伤害来源执行一项：失去1点体力，随机使用一张装备牌；回复1点体力，弃置一张装备牌。若其以此法使用或弃置的牌为梅花，你回复1点体力",
				async content(event, trigger, player) {
					event.insert(lib.skill.qingxian.content_choose, {
						target: trigger.source,
						player,
					});
				},
			},
		},
		/**
		 * @type {ContentFuncByAll}
		 */
		async content_choose(event, trigger, player) {
			const { target } = event;

			let resultIndex;
			if (target.isHealthy()) {
				resultIndex = 0;
			} else {
				let index;
				if (get.attitude(player, target) > 0) {
					index = 1;
				} else {
					index = 0;
				}

				const chooseResult = await player
					.chooseControlList({
						list: ["令" + get.translation(target) + "失去1点体力，随机使用一张装备牌", "令" + get.translation(target) + "回复1点体力，弃置一张装备牌"],
						forced: true,
						ai(event, player) {
							return get.event().index;
						},
					})
					.set("index", index)
					.forResult();
				resultIndex = chooseResult?.index || index;
			}
			let card = null;
			if (resultIndex == 0) {
				await target.loseHp();
				card = get.cardPile(card => get.type(card) == "equip" && target.canUse(card, target), false, "random");
				if (card) {
					await target.chooseUseTarget({
						card,
						throw: false,
						nopopup: true,
						forced: true,
					});
				}
			} else {
				await target.recover();
				if (target.countCards("he", { type: "equip" })) {
					const discardResult = await target
						.chooseToDiscard({
							prompt: "弃置一张装备牌",
							filterCard(card) {
								return get.type(card) === "equip";
							},
							position: "he",
							forced: true,
							ai(card) {
								let val = -get.value(card);
								if (get.suit(card) === "club") {
									val += get.event().att * 10;
								}
								return val;
							},
						})
						.set("att", get.sgnAttitude(target, player))
						.forResult();
					if (discardResult && discardResult.cards) {
						card = discardResult.cards[0];
					}
				}
			}
			if (card && get.suit(card) === "club") {
				await player.draw();
			}
		},
	},
	juexiang: {
		audio: 2,
		trigger: { player: "die" },
		forceDie: true,
		skillAnimation: true,
		animationColor: "thunder",
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget({
					prompt: get.prompt2("juexiang"),
					filterTarget: lib.filter.notMe,
					ai(target) {
						const player = get.player();
						return get.attitude(player, target) / Math.sqrt(target.hp + 1);
					},
				})
				.set("forceDie", true)
				.forResult();
		},
		logTarget: "targets",
		async content(event, trigger, player) {
			const target = event.targets[0];
			target.addSkills(lib.skill.juexiang.derivation.randomGet());
			target.addTempSkill("juexiang_club", { player: "phaseZhunbeiBegin" });
		},
		derivation: ["juexiang_ji", "juexiang_lie", "juexiang_rou", "juexiang_he"],
		subSkill: {
			ji: {
				audio: 1,
				mark: true,
				nopop: true,
				intro: {
					content: "info",
				},
				trigger: { player: "damageEnd" },
				filter(event, player) {
					return event.source && event.source.isIn() && event.source != player;
				},
				check(event, player) {
					return get.attitude(player, event.source) < 0;
				},
				logTarget: "source",
				async content(event, trigger, player) {
					await trigger.source.loseHp();
					const card = get.cardPile(card => get.type(card) == "equip" && trigger.source.canUse(card, trigger.source), false, "random");
					if (card) {
						await trigger.source.chooseUseTarget({
							card,
							throw: false,
							nopopup: true,
							forced: true,
						});
					}
				},
				ai: {
					maixie_defend: true,
				},
			},
			lie: {
				audio: 1,
				mark: true,
				nopop: true,
				intro: {
					content: "info",
				},
				trigger: {
					player: "recoverEnd",
					global: "dyingAfter",
				},
				getIndex(event, player, triggername) {
					if (_status.dying.length) {
						if (triggername == "recoverEnd") {
							player.storage.juexiang_lie ??= 0;
							++player.storage.juexiang_lie;
						}
						return 0;
					}

					return triggername === "dyingAfter" ? player.storage.juexiang_lie : 1;
				},
				async cost(event, trigger, player) {
					event.result = await player
						.chooseTarget({
							prompt: get.prompt2("juexiang_lie"),
							filterTarget: lib.filter.notMe,
							ai(target) {
								return -get.attitude(player, target) / (1 + target.hp);
							},
						})
						.forResult();
				},
				logTarget: "targets",
				async content(event, trigger, player) {
					const target = event.targets[0];
					await target.loseHp();
					const card = get.cardPile(card => get.type(card) == "equip" && target.canUse(card, target), false, "random");
					if (card) {
						await target.chooseUseTarget({
							card,
							throw: false,
							nopopup: true,
							forced: true,
						});
					}
				},
			},
			rou: {
				audio: 1,
				mark: true,
				nopop: true,
				intro: {
					content: "info",
				},
				trigger: { player: "damageEnd" },
				filter(event, player) {
					return event.source && event.source.isIn() && event.source != player;
				},
				check(event, player) {
					var att = get.attitude(player, event.source);
					if (player.isHealthy()) {
						return att < 0;
					} else {
						return att > 0;
					}
				},
				logTarget: "source",
				async content(event, trigger, player) {
					await trigger.source.recover();
					if (trigger.source.countCards("he", { type: "equip" })) {
						await trigger.source.chooseToDiscard({
							prompt: "弃置一张装备牌",
							filterCard(card) {
								return get.type(card) === "equip";
							},
							position: "he",
							forced: true,
						});
					}
				},
				ai: {
					maixie_defend: true,
				},
			},
			he: {
				audio: 1,
				mark: true,
				nopop: true,
				intro: {
					content: "info",
				},
				trigger: { player: "recoverEnd" },
				async cost(event, trigger, player) {
					event.result = await player
						.chooseTarget({
							prompt: get.prompt2("juexiang_he"),
							filterTarget: lib.filter.notMe,
							ai(target) {
								const att = get.attitude(get.event().player, target);
								if (target.isHealthy() && target.countCards("he")) {
									return -att;
								}
								return (10 * att) / (1 + target.hp);
							},
						})
						.forResult();
				},
				logTarget: "targets",
				async content(event, trigger, player) {
					const target = event.targets[0];
					await target.recover();
					if (target.countCards("he", { type: "equip" })) {
						await target.chooseToDiscard({
							prompt: "弃置一张装备牌",
							filterCard(card) {
								return get.type(card) === "equip";
							},
							position: "he",
							forced: true,
						});
					}
				},
			},
			club: {
				mark: true,
				nopop: true,
				intro: {
					content: "info",
				},
				mod: {
					targetEnabled(card, player, target) {
						if (get.suit(card) == "club" && player != target) {
							return false;
						}
					},
				},
			},
		},
	},
	bizhuan: {
		audio: 2,
		trigger: {
			player: "useCard",
			target: "useCardToTargeted",
		},
		filter(event, player) {
			if (event.name != "useCard" && event.player == event.target) {
				return false;
			}
			if (player.getExpansions("bizhuan").length >= 4) {
				return false;
			}
			return get.suit(event.card) == "spade";
		},
		intro: {
			content: "expansion",
			markcount: "expansion",
		},
		frequent: true,
		locked: false,
		async content(event, trigger, player) {
			await player.addToExpansion({
				cards: get.cards(), 
				animate: "gain2",
				gaintag: ["bizhuan"]
			});
		},
		mod: {
			maxHandcard(player, num) {
				return num + player.getExpansions("bizhuan").length;
			},
		},
		ai: {
			notemp: true,
		},
	},
	tongbo: {
		audio: 2,
		trigger: { player: "phaseDrawAfter" },
		direct: true,
		filter(event, player) {
			return player.getExpansions("bizhuan").length > 0 && player.countCards("he") > 0;
		},
		async content(event, trigger, player) {
			let result;
			let four = false;
			const nofour = !player.hasFriend();
			const expansions = player.getExpansions("bizhuan");
			if (expansions.length == 4) {
				const suits = new Set(["club", "spade", "heart", "diamond"]);
				const list = player.getCards("he").concat(expansions);
				for (const card of list) {
					suits.delete(get.suit(card));
					if (suits.size == 0) {
						four = true;
						break;
					}
				}
			}
			const chooseMoveEvent = player.chooseToMove({ prompt: "通博：是否交换“书”和手牌？" }).set("four", four).set("nofour", nofour);
			chooseMoveEvent.set("list", [
				[get.translation(player) + "（你）的“书”", expansions],
				["你的牌", player.getCards("he")],
			]);
			chooseMoveEvent.set("filterMove", (from, to) => typeof to != "number");
			chooseMoveEvent.set("processAI", list => {
				const player = _status.event.player;
				const cards = list[0][1].concat(list[1][1]);
				let cards2 = [];
				if (_status.event.four) {
					const sorted = [[], [], [], []];
					for (const card of cards) {
						const index = lib.suit.indexOf(get.suit(card, false));
						if (sorted[index]) {
							sorted[index].push(card);
						}
					}
					if (_status.event.nofour) {
						sorted.sort((a, b) => a.length - b.length);
						const cards3 = cards.slice(0).sort((a, b) => get.useful(a) - get.useful(b));
						cards3.removeArray(sorted[0]);
						cards2 = cards3.slice(0, 4);
						cards.removeArray(cards2);
					} else {
						for (const i of sorted) {
							cards2.push(i.randomGet());
							cards.remove(cards2);
						}
					}
				} else {
					cards.sort((a, b) => get.useful(a) - get.useful(b));
					cards2 = cards.splice(0, player.getExpansions("bizhuan").length);
				}
				return [cards2, cards];
			});
			result = await chooseMoveEvent.forResult();

			if (result.bool) {
				const pushs = result.moved[0];
				const gains = result.moved[1];
				pushs.removeArray(player.getExpansions("bizhuan"));
				gains.removeArray(player.getCards("he"));
				if (!pushs.length || pushs.length != gains.length) {
					return;
				}
				player.logSkill("tongbo");
				await player.addToExpansion({
					cards: pushs,
					animate: "give",
					source: player,
					gaintag: ["bizhuan"],
				});
				await player.gain({
					cards: gains,
					animate: "gain2",
				});
			}

			const suits2 = new Set(["club", "spade", "heart", "diamond"]);
			const expansions2 = player.getExpansions("bizhuan");
			for (const expansion of expansions2) {
				suits2.delete(get.suit(expansion));
			}
			if (suits2.size > 0) {
				return;
			}

			const cards = player.getExpansions("bizhuan").slice(0);
			while (cards.length) {
				if (cards.length > 1) {
					result = await player
						.chooseCardButton({
							prompt: "将所有“书”交给任意名其他角色",
							forced: true,
							cards,
							select: [1, cards.length],
							ai(button) {
								if (ui.selected.buttons.length == 0) {
									return 1;
								}
								return 0;
							},
						})
						.forResult();
				} else {
					result = { links: cards.slice(0), bool: true };
				}
				if (!result.bool) {
					return;
				}

				for (const link of result.links) {
					cards.remove(link);
				}
				const togive = result.links.slice(0);
				result = await player
					.chooseTarget({
						prompt: `将${get.translation(result.links)}交给一名其他角色`,
						filterTarget(card, player, target) {
							return target !== player;
						},
						forced: true,
						ai(target) {
							const att = get.attitude(_status.event.player, target);
							if (_status.event.enemy) {
								return -att;
							}
							if (att > 0) {
								return att / (1 + target.countCards("h"));
							}
							return att / 100;
						},
					})
					.set("enemy", get.value(togive[0], player, "raw") < 0)
					.forResult();

				if (!result.targets?.length) {
					return;
				}

				const gainEvent = result.targets[0].gain({ cards: togive, animate: "draw" });
				gainEvent.giver = player;
				await gainEvent;
				player.line(result.targets[0], "green");
				game.log(result.targets[0], "获得了" + get.cnNumber(togive.length) + "张", "#g“书”");
			}
		},
		ai: {
			combo: "bizhuan",
		},
	},
	shouxi: {
		audio: 2,
		trigger: { target: "useCardToTargeted" },
		init(player) {
			player.storage.shouxi ??= [];
		},
		filter(event, player) {
			return event.card.name === "sha" && event.player.isIn();
		},
		async cost(event, trigger, player) {
			const cards = lib.inpile.filter(card => {
				if (player.storage.shouxi.includes(card)) {
					return false;
				}
				const type = get.type2(card);
				return type === "basic" || type === "trick";
			});
			if (cards.length === 0) {
				event.result = { bool: false };
				return;
			}

			const list = cards.map(card => [get.type(card), "", card]);
			const result = await player
				.chooseButton({
					createDialog: [get.prompt("shouxi", trigger.player), [list, "vcard"]],
					ai() {
						return Math.random();
					},
				})
				.forResult();

			event.result = {
				bool: result.bool,
				cost_data: {
					vcard: result.links,
					name: result.links?.[0]?.[2],
				},
			};
		},
		async content(event, trigger, player) {
			const { vcard, name } = event.cost_data;
			player.storage.shouxi.add(name);
			player.popup(name);
			game.log(player, "声明了", `#y${get.translation(name)}`);

			const result = await trigger.player
				.chooseToDiscard({
					filterCard(card) {
						return card.name === get.event().cardname;
					},
					ai(card) {
						return get.event().att < 0 ? 10 - get.value(card) : 0;
					},
				})
				.set("att", get.attitude(trigger.player, player))
				.set("cardname", name)
				.set("dialog", ["守玺：请弃置一张【" + get.translation(name) + "】，否则此【杀】对" + get.translation(player) + "无效", [vcard, "vcard"]])
				.forResult();

			if (result.bool) {
				await trigger.player.gainPlayerCard({ target: player });
			} else {
				trigger.excluded.push(player);
			}
		},
		ai: {
			effect: {
				target_use(card, player, target, current) {
					if (card.name == "sha" && get.attitude(player, target) < 0) {
						return 0.3;
					}
				},
			},
		},
	},
	huimin: {
		audio: 2,
		trigger: { player: "phaseJieshuBegin" },
		check(event, player) {
			return (
				game.countPlayer(function (current) {
					if (current.countCards("h") < current.hp) {
						return get.sgn(get.attitude(player, current));
					}
				}) >= 0
			);
		},
		filter(event, player) {
			return game.hasPlayer(function (current) {
				return current.countCards("h") < current.hp;
			});
		},
		async content(event, trigger, player) {
			const list = game
				.filterPlayer(function (current) {
					return current.countCards("h") < current.hp;
				})
				.sortBySeat();
			await player.draw(list.length);
			const result = await player
				.chooseCardTarget({
					prompt: "惠民",
					prompt2: "选择要分配的牌和分牌起点",
					selectCard: Math.min(list.length, player.countCards("h")),
					forced: true,
					list: list,
					filterTarget(card, player, target) {
						return get.event().list.includes(target);
					},
					ai1(card) {
						return 6 - get.value(card);
					},
					ai2(target) {
						const { player, list } = get.event();
						const att = get.attitude(player, target),
							index = list.indexOf(target);
						if (att <= 0) {
							return att;
						}
						let prev = list[(index ? index : list.length) - 1];
						if (get.attitude(player, prev) < 0) {
							return att;
						}
						return 0;
					},
				})
				.forResult();
			if (!result?.bool || !result.cards?.length) {
				return;
			}
			const { cards, targets } = result;
			await player.showCards(cards).setContent(() => {});
			list.sortBySeat(targets[0]);
			player.line(list, "green");
			await player.lose(cards, ui.ordering);
			const dialog = ui.create.dialog("惠民", cards, true);
			_status.dieClose.push(dialog);
			dialog.videoId = lib.status.videoId++;
			game.addVideo("cardDialog", null, ["惠民", get.cardsInfo(cards), dialog.videoId]);
			game.broadcast(
				function (cards, id) {
					const dialog = ui.create.dialog("惠民", cards, true);
					_status.dieClose.push(dialog);
					dialog.videoId = id;
				},
				cards,
				dialog.videoId
			);
			await game.delay();
			while (list.length && cards.length) {
				const current = list.shift();
				const next = current.chooseButton(true, function (button) {
					return get.value(button.link, _status.event.player);
				});
				next.set("dialog", dialog.videoId);
				next.set("closeDialog", false);
				next.set("dialogdisplay", true);
				next.set("cardFilter", cards.slice(0));
				next.set("filterButton", function (button) {
					return _status.event.cardFilter.includes(button.link);
				});
				const result2 = await next.forResult();
				if (!result2.bool || !result2.links?.length) {
					continue;
				}
				await current.gain(result2.links, "gain2");
				cards.removeArray(result2.links);
				let capt = get.translation(current) + "选择了" + get.translation(result2.links);
				game.broadcastAll(
					function (card, id, name, capt) {
						const dialog = get.idDialog(id);
						if (dialog) {
							dialog.content.firstChild.innerHTML = capt;
							for (const button of dialog.buttons) {
								if (button.link == card) {
									game.createButtonCardsetion(name, button);
									break;
								}
							}
							game.addVideo("dialogCapt", null, [dialog.videoId, dialog.content.firstChild.innerHTML]);
						}
					},
					result2.links[0],
					dialog.videoId,
					current.getName(true),
					capt
				);
			}
			game.broadcastAll("closeDialog", dialog.videoId);
			game.broadcastAll(dialog => {
				_status.dieClose.remove(dialog);
			}, dialog);
			if (cards.length) {
				await game.cardsDiscard(cards);
			}
		},
	},
	fuzhu: {
		audio: 2,
		trigger: {
			global: "phaseJieshuBegin",
		},
		filter(event, player) {
			return event.player !== player && event.player.hasSex("male") && ui.cardPile.childElementCount <= player.hp * 10;
		},
		check(event, player) {
			return get.attitude(player, event.player) < 0 && get.effect(event.player, { name: "sha" }, player, player) > 0;
		},
		logTarget: "player",
		skillAnimation: true,
		animationColor: "wood",
		onWash() {
			_status.event.getParent("fuzhu").washed = true;
			return "remove";
		},
		async content(event, trigger, player) {
			event.washed = false;
			lib.onwash.push(lib.skill.fuzhu.onWash);
			let total = game.players.length + game.dead.length;
			while (true) {
				total--;
				const card = get.cardPile2(card => {
					return card.name == "sha" && player.canUse(card, trigger.player, false);
				});
				if (card) {
					await player.useCard({
						card,
						targets: [trigger.player],
						addCount: false,
					});
				}
				if (!(total > 0 && !event.washed && ui.cardPile.childElementCount <= player.hp * 10 && trigger.player.isIn())) {
					break;
				}
			}
			lib.onwash.remove(lib.skill.fuzhu.onWash);
			game.washCard();
		},
		ai: {
			threaten: 1.5,
		},
	},
	wengua: {
		global: "wengua2",
		audio: 2,
	},
	wengua2: {
		audio: "wengua",
		enable: "phaseUse",
		filter(event, player) {
			return player.countCards("he") && game.hasPlayer(current => current.hasSkill("wengua") && !current.hasSkill("wengua3"));
		},
		log: false,
		delay: false,
		filterCard: true,
		discard: false,
		lose: false,
		position: "he",
		prompt() {
			const player = get.player();

			const targets = game.filterPlayer(current => current.hasSkill("wengua") && !current.hasSkill("wengua3"));
			if (targets.length === 1 && targets[0] === player) {
				return "将一张牌置于牌堆顶或牌堆底";
			}

			let str = `将一张牌交给${get.translation(targets)}`;
			if (targets.length > 1) {
				str += "中的一人";
			}

			return str;
		},
		check(card) {
			if (card.name == "sha") {
				return 5;
			}
			return 8 - get.value(card);
		},
		async content(event, trigger, player) {
			const { cards } = event;
			const targets = game.filterPlayer(current => current.hasSkill("wengua") && !current.hasSkill("wengua3"));

			let target;
			if (targets.length === 1) {
				target = targets[0];
			} else {
				const result = await player
					.chooseTarget({
						prompt: "选择【问卦】的目标",
						filterTarget(card, player, target) {
							const event = get.event();
							return event.list.includes(target);
						},
						ai(target) {
							const player = get.player();
							return get.attitude(player, target);
						},
					})
					.set("list", targets)
					.set("chessForceAll", true)
					.forResult();

				if (!result.bool || !result.targets.length) {
					return;
				}

				target = result.targets[0];
			}

			delete _status.noclearcountdown;
			game.stopCountChoose();
			if (!target) {
				return;
			}

			player.logSkill("wengua", target);
			target.addTempSkill("wengua3", "phaseUseEnd");
			const card = cards[0];
			if (target !== player) {
				await player.give(cards, target);
			}

			if (!target.getCards("he").includes(card)) {
				return;
			}

			const result = await target
				.chooseControlList({
					prompt: "问卦",
					list: [`将${get.translation(card)}置于牌堆顶`, `将${get.translation(card)}置于牌堆底`],
					forced: target === player,
					ai() {
						const { player, target } = get.event();
						if (get.attitude(target, player) < 0) {
							return 2;
						}
						return 1;
					},
				})
				.set("target", target)
				.forResult();

			const index = result.index;
			if (index >= 2) {
				return;
			}

			const next = target.lose(card, ui.cardPile);
			if (index == 0) {
				next.insert_card = true;
			}

			game.broadcastAll(player => {
				const cardx = ui.create.card();
				cardx.classList.add("infohidden");
				cardx.classList.add("infoflip");
				player.$throw(cardx, 1000, "nobroadcast");
			}, target);

			await next;

			await game.delay();

			if (index == 1) {
				game.log(target, "将得到的牌置于牌堆底");
				if (ui.cardPile.childElementCount === 1 || player === target) {
					await player.draw();
				} else {
					await game.asyncDraw([player, target], null, null);
				}
			} else if (index == 0) {
				game.log(target, "将获得的牌置于牌堆顶");
				if (ui.cardPile.childElementCount === 1 || player === target) {
					await player.draw("bottom");
				} else {
					await game.asyncDraw([player, target], null, null, true);
				}
			}
		},
		ai: {
			order: 2,
			threaten: 1.5,
			result: {
				player(player, target) {
					var target = game.findPlayer(function (current) {
						return current.hasSkill("wengua");
					});
					if (target) {
						return get.attitude(player, target);
					}
				},
			},
		},
	},
	wengua3: { charlotte: true },
	daiyan: {
		audio: 2,
		trigger: { player: "phaseJieshuBegin" },
		init() {
			lib.onwash.push(() => void Reflect.deleteProperty(_status, "daiyan_notao"));
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget({
					prompt: get.prompt2("daiyan"),
					filterTarget: lib.filter.notMe,
					ai(target) {
						const player = _status.event.player;
						const att = get.attitude(player, target);
						if (att > 0) {
							if (Reflect.has(_status, "daiyan_notao")) {
								return 0;
							}
							if (target === player.storage.daiyan) {
								return 0;
							}
							return (2 * att) / Math.sqrt(1 + target.hp);
						}
						if (Reflect.has(_status, "daiyan_notao")) {
							if (target === player.storage.daiyan) {
								return -3 * att;
							}
							return -att;
						}
						return 0;
					},
				})
				.forResult();

			if (!event.result.bool) {
				delete player.storage.daiyan;
			}
		},
		logTarget: "targets",
		async content(event, trigger, player) {
			const target = event.targets[0];
			const tao = get.cardPile2(card => get.suit(card) === "heart" && get.type(card) === "basic");
			if (tao) {
				await target.gain({
					cards: [tao],
					animate: "gain2",
				});
			} else {
				Reflect.set(_status, "daiyan_notao", true);
			}
			if (target === player.storage.daiyan) {
				await target.loseHp();
			}
			player.storage.daiyan = target;
		},
		ai: {
			threaten: 1.5,
			expose: 0.2,
		},
	},
	fumian: {
		audio: 2,
		trigger: { player: "phaseZhunbeiBegin" },
		async cost(event, trigger, player) {
			const choices = ["摸牌阶段多摸一张牌", "使用红色牌可以多选择一个目标（限一次）"];
			let ai = (event, player) => {
				if (player.hp == 1 || player.countCards("h") < player.hp) {
					return 0;
				}
				return 1;
			};
			switch (player.storage.fumian_choice) {
				case "red":
					choices[0] = "摸牌阶段多摸两张牌";
					ai = () => 0;
					break;
				case "draw":
					choices[1] = "使用红色牌可以多选择两个目标（限一次）";
					ai = (event, player) => {
						if (player.hp == 1 || player.countCards("h") <= 1) {
							return 0;
						}
						return 1;
					};
					break;
			}

			const result = await player
				.chooseControlList({
					prompt: get.prompt("fumian"),
					list: choices,
					ai,
				})
				.forResult();

			event.result = {
				bool: result.control !== "cancel2",
				cost_data: {
					index: result.index,
					choice: result.index === 0 ? "draw" : "red",
				},
			};
		},
		async content(event, trigger, player) {
			const { index, choice } = event.cost_data;

			let draw = 1;
			let red = 2;
			if (player.storage.fumian_choice !== choice) {
				const last = player.storage.fumian_choice;
				delete player.storage.fumian_choice;
				switch (last) {
					case "draw":
						red = 2;
						break;
					case "red":
						draw = 2;
						break;
					default:
						player.storage.fumian_choice = choice;
						break;
				}
			}

			if (index === 0) {
				player.storage.fumian_draw = draw;
				player.addTempSkill("fumian_draw");
			} else {
				player.storage.fumian_red = red;
				player.addTempSkill("fumian_red");
			}
		},
		ai: {
			threaten: 1.3,
		},
		subSkill: {
			draw: {
				trigger: { player: "phaseDrawBegin2" },
				forced: true,
				popup: false,
				onremove: true,
				filter(event, player) {
					return !event.numFixed && typeof player.storage.fumian_draw == "number";
				},
				async content(event, trigger, player) {
					trigger.num += player.storage.fumian_draw;
				},
			},
			red2: {},
			red: {
				trigger: { player: "useCard2" },
				mark: true,
				onremove: true,
				intro: {
					content: "你使用红色牌可以多选择#个目标（限一次）",
				},
				filter(event, player) {
					if (get.color(event.card) != "red") {
						return false;
					}
					if (player.hasSkill("fumian_red2")) {
						return false;
					}
					var info = get.info(event.card);
					if (info.allowMultiple == false) {
						return false;
					}
					if (event.targets && !info.multitarget) {
						if (
							game.hasPlayer(function (current) {
								return lib.filter.targetEnabled2(event.card, player, current) && !event.targets.includes(current);
							})
						) {
							return true;
						}
					}
					return false;
				},
				async cost(event, trigger, player) {
					const prompt2 = `额外指定${player.storage.fumian_red === 2 ? "至多两" : "一"}名${get.translation(trigger.card)}的目标`;
					event.result = await player
						.chooseTarget({
							prompt: get.prompt("fumian"),
							prompt2,
							filterTarget(card, player, target) {
								const event = get.event();
								if (event.targets.includes(target)) {
									return false;
								}
								return lib.filter.targetEnabled2(event.card, player, target);
							},
							selectTarget: [1, player.storage.fumian_red],
							ai(target) {
								const event = get.event();
								const trigger = event.getTrigger();
								const player = event.player;
								return get.effect(target, trigger.card, player, player);
							},
						})
						.set("targets", trigger.targets)
						.set("card", trigger.card)
						.forResult();
				},
				logTarget: "targets",
				async content(event, trigger, player) {
					if (!event.isMine()) {
						await game.delayx();
					}
					const targets = event.targets;
					if (targets) {
						trigger.targets.addArray(targets);
						player.addTempSkill("fumian_red2");
					}
				},
			},
		},
	},
	zhongjian: {
		audio: 2,
		enable: "phaseUse",
		usable(skill, player) {
			return 1 + (player.hasSkill(skill + "_rewrite", null, null, false) ? 1 : 0);
		},
		filter(event, player) {
			if (!player.countCards("h")) {
				return false;
			}
			return game.hasPlayer(current => current != player && Math.min(current.hp, current.countCards("h")) > 0);
		},
		filterCard: true,
		check() {
			return Math.random();
		},
		discard: false,
		lose: false,
		delay: false,
		filterTarget(card, player, target) {
			return target != player && target.hp > 0 && target.countCards("h") > 0;
		},
		async content(event, trigger, player) {
			const { cards, target } = event;
			await player.showCards(cards);
			if (Math.min(target.hp, target.countCards("h")) <= 0) {
				return;
			}
			const result = await player.choosePlayerCard(target, "h", Math.min(target.countCards("h"), target.hp), true).forResult();
			if (!result?.cards?.length) {
				return;
			}
			const hs = result.cards;
			await target.showCards(hs);
			const bool1 = cards.some(card => hs.some(cardx => get.color(cardx) == get.color(card)));
			const bool2 = cards.some(card => hs.some(cardx => get.number(cardx) == get.number(card)));
			if (bool1) {
				const result = !game.hasPlayer(current => current != player && current.countDiscardableCards(player, "he"))
					? { bool: false }
					: await player
							.chooseTarget((card, player, target) => {
								return target != player && target.countDiscardableCards(player, "he");
							}, "弃置一名其他角色的一张牌或摸一张牌")
							.set("ai", target => {
								const player = get.player();
								const att = get.attitude(player, target);
								if (att >= 0) {
									return 0;
								}
								if (target.countCards("he", card => get.value(card) > 5)) {
									return -att;
								}
								return 0;
							})
							.forResult();
				if (result?.targets?.length) {
					const [target] = result.targets;
					player.line(target, "green");
					await player.discardPlayerCard(target, true, "he");
				} else {
					await player.draw();
				}
			}
			if (bool2) {
				player.addTempSkill(event.name + "_rewrite", "phaseUseEnd");
			}
			if (!bool1 && !bool2) {
				player.addSkill(event.name + "_effect");
				player.addMark(event.name + "_effect", 1, false);
				player.popup("杯具");
			}
		},
		ai: {
			order: 8,
			result: {
				player(player, target) {
					return Math.min(target.hp, target.countCards("h"));
				},
			},
		},
		subSkill: {
			rewrite: { charlotte: true },
			effect: {
				charlotte: true,
				onremove: true,
				markimage: "image/card/handcard.png",
				intro: { content: "手牌上限-#" },
				mod: {
					maxHandcard(player, num) {
						return num - player.countMark("zhongjian_effect");
					},
				},
			},
		},
	},
	caishi: {
		audio: 2,
		trigger: { player: "phaseDrawBegin" },
		async cost(event, trigger, player) {
			const choices = [];
			const choiceList = ["令自己的手牌上限+1", "回复1点体力，然后本回合你不能对自己使用牌"];
			choices.push("选项一");
			if (player.isDamaged()) {
				choices.push("选项二");
			} else {
				choiceList[1] = '<span style="opacity:0.5">' + choiceList[1] + "</span>";
			}
			const result = await player
				.chooseControl(choices, "cancel2")
				.set("choiceList", choiceList)
				.set("prompt", get.prompt(event.skill))
				.set("ai", () => {
					return get.event().choice;
				})
				.set(
					"choice",
					(() => {
						if (player.isDamaged()) {
							if (player.countCards("h", "tao")) {
								return 0;
							}
							if (player.hp < 2) {
								return 1;
							}
							if (
								player.countCards("h", card => {
									const info = get.info(card);
									return info && (info.toself || info.selectTarget == -1) && player.canUse(card, player) && player.getUseValue(card) > 0;
								}) == 0
							) {
								return 1;
							}
						}
						return 0;
					})()
				)
				.forResult();
			event.result = {
				bool: result?.control !== "cancel2",
				cost_data: result?.index,
			};
		},
		async content(event, trigger, player) {
			const index = event.cost_data;
			if (index == 0) {
				player.addSkill(event.name + "_effect");
				player.addMark(event.name + "_effect", 1, false);
			} else if (index == 1) {
				await player.recover();
				player.addTempSkill(event.name + "_buff");
			}
		},
		subSkill: {
			effect: {
				charlotte: true,
				onremove: true,
				markimage: "image/card/handcard.png",
				intro: { content: "手牌上限+#" },
				mod: {
					maxHandcard(player, num) {
						return num + player.countMark("caishi_effect");
					},
				},
			},
			buff: {
				charlotte: true,
				mark: true,
				intro: { content: "本回合内不能对自己使用牌" },
				mod: {
					playerEnabled(card, player, target) {
						if (player == target) {
							return false;
						}
					},
				},
			},
		},
	},
	ttt: {
		mod: {
			targetEnabled(card) {
				if (card.name == "tao") {
					return false;
				}
			},
		},
	},
	jyzongshi: {
		audio: 2,
		audioname: ["re_jianyong"],
		trigger: {
			global: ["chooseToCompareAfter", "compareMultipleAfter"],
		},
		getCards(event, player) {
			if (event.compareMultiple) {
				return [];
			}
			if (event.compareMeanwhile) {
				const index = [...event.targets, event.player].indexOf(player),
					winner = event.winner || event.result.winner;
				if (index < 0) {
					return [];
				}
				return event.cards
					.filter((card, i) => {
						return (i == index) != (winner == player);
					})
					.filterInD("od");
			}
			if (player != event.player && player != event.target) {
				return [];
			}
			const winner = event.winner || event.result.winner;
			const bool = (winner == player) == (player == event.player);
			return [event[bool ? "card2" : "card1"]].filterInD("od");
		},
		prompt2(event, player) {
			const cards = get.info("jyzongshi").getCards(event, player);
			return `获得${get.translation(cards)}`;
		},
		filter(event, player) {
			if (event.preserve) {
				return false;
			}
			const cards = get.info("jyzongshi").getCards(event, player);
			return cards.length;
		},
		check(event, player) {
			const cards = get.info("jyzongshi").getCards(event, player);
			return cards.every(card => card.name != "du");
		},
		async content(event, trigger, player) {
			const cards = get.info(event.name).getCards(trigger, player);
			await player.gain(cards, "gain2", "log");
		},
	},
	xinsidi: {
		audio: "sidi",
		trigger: { global: "phaseUseBegin" },
		filter(event, player) {
			if (event.player == player || event.player.isDead()) {
				return false;
			}
			return player.countCards("e") > 0;
		},
		async cost(event, trigger, player) {
			const attitude = get.attitude(player, trigger.player) >= -0.8;
			const ocards = trigger.player.countCards("h") <= 3;
			const scards = player.countCards("h", "shan") === 0;

			const goon = !(attitude && ocards && scards);
			const es = player.getCards("e");
			// AI给出的神秘去重代码
			const colors = es.map(card => get.color(card)).filter((color, index, self) => self.indexOf(color) === index);

			const color = colors.length === 2 ? "all" : colors[0];

			event.result = await player
				.chooseToDiscard({
					prompt: get.prompt2("xinsidi", trigger.player),
					filterCard(card) {
						if (get.type(card) === "basic") {
							return false;
						}
						const { color } = get.event();
						if (color === "all") {
							return true;
						}
						return get.color(card) === color;
					},
					ai(card) {
						return get.event().goon ? 6 - get.value(card) : 0;
					},
				})
				.set("goon", goon)
				.set("color", color)
				.set("chooseonly", true)
				.forResult();

			event.result.targets = [trigger.player];
		},
		logTarget: "targets",
		async content(event, trigger, player) {
			const { cards } = event;
			await player.discard({
				cards,
				discarder: player,
			});
			trigger.player.addSkill("xinsidi2");
			trigger.player.markAuto("xinsidi2", [get.color(cards[0], cards[0].original === "h" ? player : false)]);
			trigger.player.storage.xinsidi4 = player;
			trigger.player.syncStorage("xinsidi2");
		},
		ai: {
			threaten: 1.5,
		},
	},
	xinsidi2: {
		mark: true,
		group: ["xinsidi2_end"],
		sourceSkill: "xinsidi",
		subSkill: {
			end: {
				trigger: { player: "phaseUseEnd" },
				forced: true,
				popup: false,
				audio: false,
				async content(event, trigger, player) {
					if (player.storage.xinsidi4.isIn() && !player.getHistory("useCard", evt => evt.card.name === "sha").length && player.storage.xinsidi4.canUse({ name: "sha", isCard: true }, player, false)) {
						player.storage.xinsidi4.logSkill("xinsidi", player);
						await player.storage.xinsidi4.useCard({ name: "sha", isCard: true }, player);
					}
					delete player.storage.xinsidi2;
					delete player.storage.xinsidi3;
					delete player.storage.xinsidi4;
					player.removeSkill("xinsidi2");
				},
			},
		},
		mod: {
			cardEnabled(card, player) {
				if (player.getStorage("xinsidi2").includes(get.color(card))) {
					return false;
				}
			},
			cardRespondable(card, player) {
				if (player.getStorage("xinsidi2").includes(get.color(card))) {
					return false;
				}
			},
			cardSavable(card, player) {
				if (player.getStorage("xinsidi2").includes(get.color(card))) {
					return false;
				}
			},
		},
		intro: {
			content: "不能使用或打出$的牌",
		},
	},
	taoluan: {
		hiddenCard(player, name) {
			return !player.getStorage("taoluan").includes(name) && player.countCards("hes") > 0 && lib.inpile.includes(name);
		},
		audio: 2,
		enable: "chooseToUse",
		filter(event, player) {
			return player.hasCard(
				card =>
					lib.inpile.some(name => {
						if (player.getStorage("taoluan").includes(name)) {
							return false;
						}
						if (get.type(name) != "basic" && get.type(name) != "trick") {
							return false;
						}
						if (event.filterCard({ name: name, isCard: true, cards: [card] }, player, event)) {
							return true;
						}
						if (name == "sha") {
							for (var nature of lib.inpile_nature) {
								if (event.filterCard({ name: name, nature: nature, isCard: true, cards: [card] }, player, event)) {
									return true;
								}
							}
						}
						return false;
					}),
				"hes"
			);
		},
		onremove: true,
		chooseButton: {
			dialog(event, player) {
				var list = [];
				for (var name of lib.inpile) {
					if (get.type(name) == "basic" || get.type(name) == "trick") {
						if (player.getStorage("taoluan").includes(name)) {
							continue;
						}
						list.push([get.translation(get.type(name)), "", name]);
						if (name == "sha") {
							for (var j of lib.inpile_nature) {
								list.push(["基本", "", "sha", j]);
							}
						}
					}
				}
				return ui.create.dialog("滔乱", [list, "vcard"]);
			},
			filter(button, player) {
				return _status.event.getParent().filterCard({ name: button.link[2] }, player, _status.event.getParent());
			},
			check(button) {
				var player = _status.event.player;
				var card = { name: button.link[2], nature: button.link[3] };
				if (player.countCards("hes", cardx => cardx.name == card.name)) {
					return 0;
				}
				return _status.event.getParent().type == "phase" ? player.getUseValue(card) : 1;
			},
			backup(links, player) {
				return {
					audio: "taoluan",
					filterCard: true,
					popname: true,
					check(card) {
						return 7 - get.value(card);
					},
					position: "hes",
					viewAs: { name: links[0][2], nature: links[0][3] },
					onuse(result, player) {
						player.markAuto("taoluan", [result.card.name]);
					},
				};
			},
			prompt(links, player) {
				return "将一张牌当做" + (get.translation(links[0][3]) || "") + get.translation(links[0][2]) + "使用";
			},
		},
		ai: {
			save: true,
			respondSha: true,
			respondShan: true,
			skillTagFilter(player, tag, arg) {
				if (!player.countCards("hes") || player.isTempBanned("taoluan")) {
					return false;
				}
				if (tag == "respondSha" || tag == "respondShan") {
					if (arg == "respond") {
						return false;
					}
					return !player.getStorage("taoluan").includes(tag == "respondSha" ? "sha" : "shan");
				}
				return !player.getStorage("taoluan").includes("tao") || (!player.getStorage("taoluan").includes("jiu") && arg == player);
			},
			order: 4,
			result: {
				player(player) {
					var allshown = true,
						players = game.filterPlayer();
					for (var i = 0; i < players.length; i++) {
						if (players[i].ai.shown == 0) {
							allshown = false;
						}
						if (players[i] != player && players[i].countCards("h") && get.attitude(player, players[i]) > 0) {
							return 1;
						}
					}
					if (allshown) {
						return 1;
					}
					return 0;
				},
			},
			threaten: 1.9,
		},
		group: "taoluan2",
	},
	taoluan2: {
		charlotte: true,
		trigger: { player: "useCardAfter" },
		sourceSkill: "taoluan",
		filter(event, player) {
			if (!game.hasPlayer(current => current != player)) {
				return false;
			}
			return event.skill == "taoluan_backup";
		},
		forced: true,
		popup: false,
		async content(event, trigger, player) {
			let result = await player
				.chooseTarget({
					prompt: '滔乱<br /><br /><div class="text center">令一名其他角色选择一项：1.交给你一张与你以此法使用的牌类别不同的牌；2.你失去1点体力',
					filterTarget: lib.filter.notMe,
					forced: true,
					ai(target) {
						const current = _status.event.player;
						if (get.attitude(current, target) > 0) {
							if (get.attitude(target, current) > 0) {
								return target.countCards("he");
							}
							return target.countCards("he") / 2;
						}
						return 0;
					},
				})
				.forResult();
			const target = result.targets[0];
			player.line(target, "green");
			const type = get.type(trigger.card, "trick");
			result = await target
				.chooseCard({
					prompt: `滔乱<br><br><div class="text center">交给${get.translation(player)}一张不为${get.translation(type)}牌的牌，或令其失去1点体力且滔乱无效直到回合结束`,
					position: "he",
					filterCard(card) {
						return get.type(card, "trick") !== get.event().cardType;
					},
					ai(card) {
						if (get.event().att) {
							return 11 - get.value(card);
						}
						return 0;
					},
				})
				.set("cardType", type)
				.set("att", get.attitude(target, player) > 0)
				.forResult();
			if (!result.bool) {
				player.tempBanSkill("taoluan");
				await player.loseHp();
				return;
			}
			await target.give(result.cards, player);
		},
	},
	taoluan_backup: {},
	jishe: {
		audio: 2,
		enable: "phaseUse",
		filter(event, player) {
			return player.getHandcardLimit() > 0;
		},
		usable: 20,
		locked: false,
		delay: false,
		async content(event, trigger, player) {
			await player.draw({ nodelay: true });
			player.addTempSkill("jishe2");
			player.addMark("jishe2", 1, false);
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
		group: ["jishe3"],
	},
	jishe2: {
		mod: {
			maxHandcard(player, num) {
				return num - player.countMark("jishe2");
			},
		},
		onremove: true,
		charlotte: true,
		marktext: "奢",
		intro: { content: "手牌上限-#" },
	},
	jishe3: {
		audio: "jishe",
		trigger: { player: "phaseJieshuBegin" },
		sourceSkill: "jishe",
		filter(event, player) {
			if (player.countCards("h")) {
				return false;
			}
			return game.hasPlayer(current => !current.isLinked());
		},
		async cost(event, trigger, player) {
			const num = game.countPlayer(current => !current.isLinked());
			event.result = await player
				.chooseTarget({
					prompt: get.prompt("jishe"),
					prompt2: `横置至多${get.cnNumber(Math.min(num, player.hp))}名未横置的角色`,
					filterTarget(card, player, target) {
						return !target.isLinked();
					},
					selectTarget: [1, Math.min(num, player.hp)],
					ai(target) {
						return -get.attitude(get.player(), target);
					},
				})
				.forResult();
		},
		logTarget: "targets",
		async content(event, trigger, player) {
			await game.doAsyncInOrder(event.targets, target => target.link());
		},
		ai: {
			expose: 0.3,
		},
	},
	lianhuo: {
		audio: 2,
		trigger: { player: "damageBegin3" },
		forced: true,
		filter(event, player) {
			return player.isLinked() && event.notLink() && event.hasNature("fire");
		},
		async content(event, trigger, player) {
			trigger.num++;
		},
		ai: {
			neg: true,
		},
	},
	huisheng: {
		audio: 2,
		audioname: ["dc_huanghao"],
		trigger: { player: "damageBegin4" },
		filter(event, player) {
			if (!player.countCards("he")) {
				return false;
			}
			if (!event.source || event.source == player || !event.source.isIn()) {
				return false;
			}
			if (player.storage.huisheng && player.storage.huisheng.includes(event.source)) {
				return false;
			}
			return true;
		},
		init(player) {
			player.storage.huisheng ??= [];
		},
		async cost(event, trigger, player) {
			const att = get.attitude(player, trigger.source) > 0;
			let goon = false;
			if (player.hp === 1) {
				goon = true;
			} else {
				let num = 0;
				for (const card of player.iterableGetCards("he")) {
					if (get.value(card) < 8) {
						num++;
						if (num >= 2) {
							goon = true;
							break;
						}
					}
				}
			}

			event.result = await player
				.chooseCard({
					prompt: get.prompt2("huisheng", trigger.source),
					selectCard: [1, player.countCards("he")],
					position: "he",
					ai(card) {
						const { att, goon } = get.event();
						if (att) {
							return 10 - get.value(card);
						}
						if (goon) {
							return 8 - get.value(card);
						}
						if (!ui.selected.cards.length) {
							return 7 - get.value(card);
						}
						return 0;
					},
				})
				.set("goon", goon)
				.set("att", att)
				.forResult();
		},
		logTarget(event) {
			return event?.source;
		},
		async content(event, trigger, player) {
			await game.delay();
			const cards = event.cards;
			const num = cards.length;
			const goon = num > 2 || get.attitude(trigger.source, player) >= 0;
			let forced = false;
			let str = "获得其中一张牌并防止伤害";
			if (trigger.source.countCards("he") < num) {
				forced = true;
			} else {
				str += `，或取消并弃置${get.cnNumber(cards.length)}张牌`;
			}
			const result = await trigger.source
				.chooseButton({
					createDialog: [str, cards],
					forced,
					ai(button) {
						if (get.event().goon) {
							return get.value(button.link);
						}
						return get.value(button.link) - 8;
					},
				})
				.set("goon", goon)
				.forResult();
			if (result.bool && result.links?.length) {
				const cards = result.links;
				await trigger.source.gain({
					cards,
					source: player,
					animate: "giveAuto",
					bySelf: true,
				});
				trigger.cancel();
				player.storage.huisheng ??= [];
				player.storage.huisheng.push(trigger.source);
			} else {
				await trigger.source.chooseToDiscard({
					selectCard: num,
					position: "he",
					forced: true,
				});
			}
		},
	},
	qinqing: {
		audio: 2,
		mode: ["identity", "versus", "doudizhu"],
		available(mode) {
			if (mode == "versus" && _status.mode != "four") {
				return false;
			}
			if (mode == "identity" && _status.mode == "purple") {
				return false;
			}
			return true;
		},
		getZhu(player) {
			if (get.mode() === "doudizhu") {
				return game.findPlayer(i => i.identity === "zhu");
			}
			return get.zhu(player);
		},
		trigger: { player: "phaseJieshuBegin" },
		filter(event, player) {
			const zhu = get.info("qinqing").getZhu(player);
			if (!zhu || (get.mode() !== "doudizhu" && !zhu.isZhu)) {
				return false;
			}
			return game.hasPlayer(current => current !== zhu && current.inRange(zhu));
		},
		async cost(event, trigger, player) {
			const zhu = get.info("qinqing").getZhu(player);

			event.result = await player
				.chooseTarget({
					prompt: get.prompt2("qinqing"),
					filterTarget(card, player, target) {
						const zhu = get.event().zhu;
						return target !== zhu && target.inRange(zhu);
					},
					selectTarget: [1, Infinity],
					ai(target) {
						const player = get.player();
						const he = target.countCards("he");
						const zhu = get.event().zhu;
						if (get.attitude(player, target) > 0) {
							if (he == 0) {
								return 1;
							}
							if (target.countCards("h") > zhu.countCards("h")) {
								return 1;
							}
						} else {
							if (he > 0) {
								return 1;
							}
						}
						return 0;
					},
				})
				.set("zhu", zhu)
				.forResult();
		},
		logTarget: "targets",
		async content(event, trigger, player) {
			const zhu = get.info("qinqing").getZhu(player);
			const targets = event.targets.toSorted(lib.sort.seat);

			for (const target of targets) {
				if (target.countCards("he") > 0) {
					await player.discardPlayerCard({
						target,
						position: "he",
						forced: true,
					});
				}
				await target.draw();
			}

			if (!zhu) {
				return;
			}
			let num = 0;
			const nh = zhu.countCards("h");
			for (const target of targets) {
				if (target.countCards("h") > nh) {
					++num;
				}
			}
			if (num) {
				await player.draw(num);
			}
		},
		ai: {
			threaten: 1.2,
		},
	},
	guizao: {
		audio: 2,
		trigger: { player: "phaseDiscardEnd" },
		direct: true,
		filter(event, player) {
			if (event.cards && event.cards.length > 1) {
				var suits = [];
				for (var i = 0; i < event.cards.length; i++) {
					var suit = get.suit(event.cards[i]);
					if (suits.includes(suit)) {
						return false;
					} else {
						suits.push(suit);
					}
				}
				return true;
			}
			return false;
		},
		async content(event, trigger, player) {
			player.chooseDrawRecover({
				prompt: get.prompt("guizao"),
				prompt2: "摸一张牌或回复1点体力",
			}).logSkill = "guizao";
		},
	},
	jiyu: {
		audio: 2,
		enable: "phaseUse",
		locked: false,
		filter(event, player) {
			if (!player.getStat().skill.jiyu || !player.storage.jiyu2) {
				return true;
			}
			var hs = player.getCards("h");
			for (var i = 0; i < hs.length; i++) {
				if (!player.storage.jiyu2.includes(get.suit(hs[i]))) {
					return true;
				}
			}
			return false;
		},
		filterTarget(card, player, target) {
			return target.countCards("h") > 0 && (!player.storage.jiyu || !player.storage.jiyu.includes(target));
		},
		async content(event, trigger, player) {
			const { target } = event;
			let result;
			const evt = event.getParent("phaseUse");
			if (evt && evt.name == "phaseUse" && !evt.jiyu) {
				evt.jiyu = true;
				const next = game.createEvent("jiyu_clear");
				_status.event.next.remove(next);
				evt.after.push(next);
				next.player = player;
				next.setContent(() => {
					game.broadcastAll(player => {
						delete player.storage.jiyu;
						delete player.storage.jiyu2;
					}, player);
				});
			}
			player.storage.jiyu ??= [];
			player.storage.jiyu.push(target);
			let spade = true;
			if (player.isTurnedOver() || get.attitude(target, player) > 0 || target.hp <= 2) {
				spade = false;
			}
			result = await target
				.chooseToDiscard({
					position: "h",
					forced: true,
					ai(card) {
						if (get.suit(card) == "spade") {
							if (_status.event.spade) {
								return 10 - get.value(card);
							}
							return -10 - get.value(card);
						}
						if (_status.event.getParent().player.storage.jiyu2 && _status.event.getParent().player.storage.jiyu2.includes(get.suit(card))) {
							return -3 - get.value(card);
						}
						return -get.value(card);
					},
				})
				.set("spade", spade)
				.forResult();
			if (!result.cards || !result.cards.length) {
				return;
			}
			const card = result.cards[0];
			if (get.suit(card, target) === "spade") {
				await player.turnOver();
				await target.loseHp();
			}
			player.storage.jiyu2 ??= [];
			player.storage.jiyu2.add(get.suit(card));
		},
		onremove: ["jiyu", "jiyu2"],
		ai: {
			order: 9,
			result: {
				target(player, target) {
					if (player.isTurnedOver() || target.countCards("h") <= 3) {
						return -1;
					}
					return 0;
				},
			},
		},
		mod: {
			cardEnabled(card, player) {
				if (player.storage.jiyu2 && player.storage.jiyu2.includes(get.suit(card))) {
					return false;
				}
			},
			cardSavable(card, player) {
				if (player.storage.jiyu2 && player.storage.jiyu2.includes(get.suit(card))) {
					return false;
				}
			},
		},
	},
	jiyu2: {
		trigger: { player: ["phaseUseBegin", "phaseUseAfter"] },
		silent: true,
		sourceSkill: "jiyu",
		async content(event, trigger, player) {
			player.storage.jiyu = [];
			player.storage.jiyu2 = [];
		},
	},
	jiaozhao: {
		audio: 2,
		usable: 1,
		enable: "phaseUse",
		filter(event, player) {
			return player.countMark("xindanxin") < 2 && player.countCards("h") > 0;
		},
		filterCard: true,
		check(card) {
			return 8 - get.value(card);
		},
		locked: false,
		discard: false,
		lose: false,
		delay: false,
		async content(event, trigger, player) {
			const { cards } = event;
			await player.showCards(cards);
			let jiaozhaoTarget = player;
			if (player.countMark("xindanxin") <= 1) {
				const targets = game.filterPlayer();
				targets.remove(player);
				targets.sort((a, b) => Math.max(1, get.distance(player, a)) - Math.max(1, get.distance(player, b)));
				const distance = Math.max(1, get.distance(player, targets[0]));
				for (const [i, target] of targets.entries()) {
					if (i == 0) {
						continue;
					}
					if (Math.max(1, get.distance(player, target)) > distance) {
						targets.splice(i);
						break;
					}
				}
				const result = await player
					.chooseTarget({
						prompt: "请选择【矫诏】的目标",
						filterTarget(card, player, target) {
							return get.event().targets.includes(target);
						},
						forced: true,
						ai(target) {
							return get.attitude(get.player(), target);
						},
					})
					.set("targets", targets)
					.forResult();
				jiaozhaoTarget = result.targets[0];
				player.line(result.targets, "green");
			}
			if (!jiaozhaoTarget) {
				return;
			}
			const list = [];
			for (const name of lib.inpile) {
				if (name == "sha") {
					list.push(["基本", "", "sha"]);
					for (const nature of lib.inpile_nature) {
						list.push(["基本", "", "sha", nature]);
					}
				} else if (get.type(name) == "basic") {
					list.push(["基本", "", name]);
				} else if (player.countMark("xindanxin") > 0 && get.type(name) == "trick") {
					list.push(["锦囊", "", name]);
				}
			}
			const result = await jiaozhaoTarget
				.chooseButton({
					createDialog: ["矫诏", [list, "vcard"]],
					forced: true,
					ai(button) {
						const player = get.event(0).getParent().player;
						const card = {
							name: button.link[2],
							nature: button.link[3],
							storage: {
								jiaozhao: player,
							},
						};
						return player.getUseValue(card, null, true) * get.event().att;
					},
				})
				.set("att", get.attitude(jiaozhaoTarget, player) > 0 ? 1 : -1)
				.forResult();
			const chosen = result.links[0][2];
			const nature = result.links[0][3];
			const fakecard = {
				name: chosen,
				storage: { jiaozhao: player },
			};
			if (nature) {
				fakecard.nature = nature;
			}
			await jiaozhaoTarget.showCards(
				game.createCard({
					name: chosen,
					nature: nature,
					suit: cards[0].suit,
					number: cards[0].number,
				}),
				get.translation(jiaozhaoTarget) + "声明了" + get.translation(chosen)
			);
			player.storage.jiaozhao = cards[0];
			player.storage.jiaozhao_card = fakecard;
			game.broadcastAll(
				function (name, card) {
					lib.skill.jiaozhao2.viewAs = name;
					card.addGaintag("jiaozhao");
				},
				fakecard,
				cards[0]
			);
			player.addTempSkill("jiaozhao2", "phaseUseEnd");
		},
		group: "jiaozhao3",
		mod: {
			targetEnabled(card, player, target) {
				if (card.storage && card.storage.jiaozhao && card.storage.jiaozhao == target) {
					return false;
				}
			},
		},
		ai: {
			order: 9,
			result: {
				player: 1,
			},
		},
	},
	jiaozhao2: {
		enable: "phaseUse",
		audio: "jiaozhao",
		charlotte: true,
		sourceSkill: "jiaozhao",
		filter(event, player) {
			if (!player.storage.jiaozhao || !lib.skill.jiaozhao2.viewAs) {
				return false;
			}
			var name = lib.skill.jiaozhao2.viewAs.name;
			return player.getCards("h").includes(player.storage.jiaozhao) && player.storage.jiaozhao.hasGaintag("jiaozhao") && game.checkMod(player.storage.jiaozhao, player, "unchanged", "cardEnabled2", player) !== false;
		},
		filterCard(card, player) {
			return card == player.storage.jiaozhao;
		},
		selectCard: -1,
		popname: true,
		prompt() {
			return "选择" + get.translation(lib.skill.jiaozhao2.viewAs) + "的目标";
		},
		check(card) {
			return 8 - get.value(card);
		},
		ai: {
			order: 6,
		},
		onremove(player) {
			player.removeGaintag("jiaozhao");
			delete player.storage.jiaozhao;
			delete player.storage.jiaozhao_card;
		},
	},
	jiaozhao3: {
		audio: "jiaozhao",
		enable: "phaseUse",
		sourceSkill: "jiaozhao",
		filter(event, player) {
			return (player.getStat("skill").jiaozhao || 0) + (player.getStat("skill").jiaozhao3 || 0) < player.countMark("xindanxin") - 1 && player.countCards("h") > 0;
		},
		chooseButton: {
			dialog(event, player) {
				var list = [];
				for (var i of lib.inpile) {
					var type = get.type(i, null, false);
					if (type == "basic" || type == "trick") {
						var card = {
							name: i,
							storage: {
								jiaozhao: player,
							},
						};
						if (event.filterCard(card, player, event)) {
							list.push([type, "", i]);
						}
						if (i == "sha") {
							for (var j of lib.inpile_nature) {
								card.nature = j;
								if (event.filterCard(card, player, event)) {
									list.push([type, "", i, j]);
								}
							}
						}
					}
				}
				if (list.length) {
					return ui.create.dialog("矫诏", [list, "vcard"]);
				}
				return ui.create.dialog("矫诏：当前没有可用牌");
			},
			check(button) {
				var player = _status.event.player,
					card = {
						name: button.link[2],
						nature: button.link[3],
						storage: {
							jiaozhao: player,
						},
					};
				return player.getUseValue(card);
			},
			backup(links, player) {
				return {
					audio: "jiaozhao",
					filterCard: true,
					position: "h",
					popname: true,
					viewAs: {
						name: links[0][2],
						nature: links[0][3],
						storage: {
							jiaozhao: player,
						},
					},
					check(card) {
						return 8 - get.value(card);
					},
				};
			},
			prompt(links, player) {
				return "将一张牌当做" + (get.translation(links[0][3]) || "") + get.translation(links[0][2]) + "使用";
			},
		},
		ai: {
			order: 9,
			result: {
				player: 1,
			},
		},
	},
	jiaozhao3_backup: { audio: "jiaozhao" },
	xindanxin: {
		trigger: { player: "damageEnd" },
		frequent: true,
		audio: "danxin",
		async content(event, trigger, player) {
			await player.draw();
			if (player.countMark("xindanxin") < 3) {
				player.addMark("xindanxin", 1, false);
				game.log(player, "修改了技能", "#g【矫诏】");
			}
		},
		intro: { content: "【矫诏】加成等级：Lv.#" },
		ai: {
			maixie: true,
			effect: {
				target: (card, player, target) => {
					if (!get.tag(card, "damage")) {
						return;
					}
					if (target.hp + target.hujia < 2 || player.hasSkillTag("jueqing", false, target)) {
						return 1.8;
					}
					if (!target.hasSkill("jiaozhao") || target.countMark("xindanxin") > 1) {
						return [1, 1];
					}
					return [1, 0.8 * target.hp - 0.5];
				},
			},
		},
	},
	danxin: {
		trigger: { player: "damageEnd" },
		frequent: true,
		audio: 2,
		async content(event, trigger, player) {
			let result;
			if (player.countMark("xindanxin") >= 2) {
				await player.draw();
				return;
			}
			const list = ["draw_card", "更改描述"];
			let prompt;
			if (player.countMark("xindanxin") == 0) {
				prompt = '摸一张牌或更改矫诏的描述<br><br><div class="text">更改描述：将“选择距离最近的一名其他角色，该角色”改为“你”';
			} else {
				prompt = '摸一张牌或更改矫诏的描述<br><br><div class="text">更改描述：将“基本牌”改为“基本牌或普通锦囊牌”';
			}
			result = await player
				.chooseControl({
					prompt,
					controls: list,
					ai() {
						if (!_status.event.player.hasSkill("jiaozhao")) {
							return "draw_card";
						}
						return "更改描述";
					},
				})
				.forResult();
			if (result.control == "draw_card") {
				await player.draw();
			} else {
				game.log(player, "更改了", "【矫诏】", "的描述");
				player.popup("更改描述");
				player.addMark("xindanxin", 1, false);
			}
		},
		ai: {
			maixie: true,
			effect: {
				target: (card, player, target) => {
					if (!get.tag(card, "damage")) {
						return;
					}
					if (target.hp < 2 || player.hasSkillTag("jueqing", false, target)) {
						return 1.5;
					}
					return [1, 0.8];
				},
			},
		},
	},
	zongzuo: {
		trigger: {
			global: "phaseBefore",
			player: "enterGame",
		},
		forced: true,
		audio: 2,
		filter(event, player) {
			return event.name != "phase" || game.phaseNumber == 0;
		},
		async content(event, trigger, player) {
			const num = game.countGroup();
			await player.gainMaxHp({ num });
			await player.recover({ num });
			//player.update();
		},
		group: "zongzuo_lose",
		subSkill: {
			lose: {
				trigger: { global: "dieAfter" },
				forced: true,
				audio: "zongzuo",
				filter(event, player) {
					if (!lib.group.includes(event.player.group)) {
						return false;
					}
					if (
						game.hasPlayer(function (current) {
							return current.group == event.player.group;
						})
					) {
						return false;
					}
					return true;
				},
				async content(event, trigger, player) {
					await player.loseMaxHp();
				},
			},
		},
	},
	zhige: {
		enable: "phaseUse",
		usable: 1,
		audio: 2,
		filter(event, player) {
			return player.countCards("h") > player.hp;
		},
		filterTarget(card, player, target) {
			return player !== target && target.inRange(player);
		},
		async content(event, trigger, player) {
			const { target } = event;
			let result;
			result = await target
				.chooseToUse({
					prompt: `止戈：使用一张杀，或将装备区里的一张牌交给${get.translation(player)}`,
					filterCard: get.filter({ name: "sha" }),
				})
				.forResult();
			if (result.bool || !target.countCards("e")) {
				return;
			}

			result = await target
				.chooseCard({
					prompt: `将装备区里的一张牌交给${get.translation(player)}`,
					position: "e",
					forced: true,
				})
				.forResult();
			if (result.bool && result.cards?.length) {
				await target.give(result.cards, player);
			}
		},
		ai: {
			expose: 0.2,
			order: 5,
			result: {
				target: -1,
				player(player, target) {
					if (target.countCards("h") == 0) {
						return 0;
					}
					if (target.countCards("h") == 1) {
						return -0.1;
					}
					if (player.hp <= 2) {
						return -2;
					}
					if (player.countCards("h", "shan") == 0) {
						return -1;
					}
					return -0.5;
				},
			},
		},
	},
	kuangbi: {
		enable: "phaseUse",
		usable: 1,
		audio: 2,
		filterTarget(card, player, target) {
			return target != player && target.countCards("he") > 0;
		},
		async content(event, trigger, player) {
			const { target } = event;
			let result;
			result = await target
				.chooseCard({
					prompt: `匡弼：将至多三张牌置于${get.translation(player)}的武将牌上`,
					selectCard: [1, 3],
					position: "he",
					forced: true,
					ai(card) {
						if (get.attitude(_status.event.player, _status.event.getParent().player) > 0) {
							return 7 - get.value(card);
						}
						return -get.value(card);
					},
				})
				.forResult();
			if (result.bool && result.cards?.length) {
				await player.addToExpansion({
					cards: result.cards,
					source: target,
					animate: "give",
					gaintag: ["kuangbi"],
				});
				if (!player.storage.kuangbi_draw) {
					player.storage.kuangbi_draw = [[], []];
				}
				player.storage.kuangbi_draw[0].push(target);
				player.storage.kuangbi_draw[1].push(result.cards.length);
				player.addSkill("kuangbi_draw");
				player.syncStorage("kuangbi_draw");
				player.updateMarks("kuangbi_draw");
			}
		},
		intro: {
			content: "expansion",
			markcount: "expansion",
		},
		onremove(player, skill) {
			var cards = player.getExpansions(skill);
			if (cards.length) {
				player.loseToDiscardpile(cards);
			}
			delete player.storage[skill];
		},
		ai: {
			order: 1,
			result: {
				target(player, target) {
					if (get.attitude(player, target) > 0) {
						return Math.sqrt(target.countCards("he"));
					}
					return 0;
				},
				player: 1,
			},
		},
		subSkill: {
			draw: {
				trigger: { player: "phaseZhunbeiBegin" },
				forced: true,
				mark: true,
				charlotte: true,
				audio: "kuangbi",
				onremove: true,
				filter(event, player) {
					return player.getExpansions("kuangbi").length > 0;
				},
				async content(event, trigger, player) {
					await player.gain(player.getExpansions("kuangbi"), "gain2");
					const storage = player.storage.kuangbi_draw;
					if (storage.length) {
						for (const [index, target] of storage[0].entries()) {
							const num = storage[1][index];
							if (target && target.isIn()) {
								player.line(target);
								target.draw(num);
							}
						}
					}
					player.removeSkill("kuangbi_draw");
				},
			},
		},
	},
	fulin: {
		trigger: { player: "phaseDiscardBegin" },
		audio: 2,
		forced: true,
		async content(event, trigger, player) {
			player.addTempSkill("fulin2", "phaseDiscardAfter");
		},
		group: ["fulin_count", "fulin_reset"],
		subSkill: {
			reset: {
				trigger: { player: ["phaseBefore", "phaseAfter"] },
				silent: true,
				priority: 10,
				async content(event, trigger, player) {
					player.removeGaintag("fulin");
				},
			},
			count: {
				trigger: { player: "gainBegin" },
				audio: "fulin",
				forced: true,
				silent: true,
				filter(event, player) {
					return _status.currentPhase == player;
				},
				async content(event, trigger, player) {
					trigger.gaintag.add("fulin");
				},
			},
		},
		onremove(player) {
			player.removeGaintag("fulin");
		},
	},
	fulin2: {
		mod: {
			ignoredHandcard(card, player) {
				if (card.hasGaintag("fulin")) {
					return true;
				}
			},
			cardDiscardable(card, player, name) {
				if (name == "phaseDiscard" && card.hasGaintag("fulin")) {
					return false;
				}
			},
		},
	},
	duliang: {
		audio: 2,
		usable: 1,
		enable: "phaseUse",
		filterTarget(card, player, target) {
			return player !== target && target.countCards("h") > 0;
		},
		async content(event, trigger, player) {
			const { target } = event;
			await player.gainPlayerCard(target, "h", true);

			const name = get.translation(target);
			const result = await player
				.chooseControl({
					prompt: "督粮",
					choiceList: [`令${name}观看牌堆顶的两张牌，然后获得其中的基本牌`, `令${name}于下个摸牌阶段额外摸一张牌`],
					ai() {
						return Math.random() < 0.5 ? "选项一" : "选项二";
					},
				})
				.forResult();
			if (result.control == "选项一") {
				const cards = get.cards(2);
				await target.viewCards("督粮", cards);

				const cards2 = [];
				const tothrow = [];
				for (const card of cards) {
					if (get.type(card) == "basic") {
						ui.special.appendChild(card);
						cards2.push(card);
					} else {
						tothrow.push(card);
					}
				}
				while (tothrow.length) {
					ui.cardPile.insertBefore(tothrow.pop(), ui.cardPile.firstChild);
				}
				if (cards2.length) {
					await target.gain({
						cards: cards2,
						animate: "draw",
					});
					game.log(target, "获得了" + get.cnNumber(cards2.length) + "张牌");
				}
				game.updateRoundNumber();
				return;
			}
			target.addSkill("duliang2");
			target.updateMarks("duliang2");
			++target.storage.duliang2;
		},
		ai: {
			order: 4,
			result: {
				target: -1,
				player: 0.1,
			},
		},
	},
	duliang2: {
		audio: false,
		trigger: {
			player: "phaseDrawBegin",
		},
		charlotte: true,
		forced: true,
		sourceSkill: "duliang",
		init(player, skill) {
			player.storage[skill] ??= 0;
		},
		onremove: true,
		async content(event, trigger, player) {
			trigger.num += player.storage.duliang2;
			player.removeSkill("duliang2");
		},
		mark: true,
		intro: {
			content: "下个摸牌阶段额外摸#张牌",
		},
	},
	xinfencheng: {
		skillAnimation: "epic",
		animationColor: "gray",
		audio: 2,
		audioname: ["re_liru"],
		enable: "phaseUse",
		filterTarget(card, player, target) {
			return player != target;
		},
		limited: true,
		selectTarget: -1,
		multitarget: true,
		multiline: true,
		line: "fire",
		async content(event, trigger, player) {
			player.awakenSkill(event.name);

			const targets = event.targets.toSorted(lib.sort.seat);

			let num = 1;
			for (const target of targets) {
				const res = get.damageEffect(target, player, target, "fire");
				const result = await target
					.chooseToDiscard({
						prompt: `弃置至少${get.cnNumber(num)}张牌或受到2点火焰伤害`,
						selectCard: [num, Infinity],
						position: "he",
						allowChooseAll: true,
						ai(card) {
							if (ui.selected.cards.length >= get.event().num) {
								return -1;
							}
							if (_status.event.player.hasSkillTag("nofire")) {
								return -1;
							}
							if (_status.event.res >= 0) {
								return 6 - get.value(card);
							}
							if (get.type(card) != "basic") {
								return 10 - get.value(card);
							}
							return 8 - get.value(card);
						},
					})
					.set("res", res)
					.set("num", num)
					.forResult();
				if (result.bool && result.cards?.length) {
					num = result.cards.length + 1;
				} else {
					await target.damage({
						num: 2,
						nature: "fire",
					});
					num = 1;
				}
			}
		},
		ai: {
			order: 1,
			result: {
				player(player) {
					var num = 0,
						eff = 0,
						players = game
							.filterPlayer(function (current) {
								return current != player;
							})
							.sortBySeat(player);
					for (var target of players) {
						if (get.damageEffect(target, player, target, "fire") >= 0) {
							num = 0;
							continue;
						}
						var shao = false;
						num++;
						if (
							target.countCards("he", function (card) {
								if (get.type(card) != "basic") {
									return get.value(card) < 10;
								}
								return get.value(card) < 8;
							}) < num
						) {
							shao = true;
						}
						if (shao) {
							eff -= 4 * (get.realAttitude || get.attitude)(player, target);
							num = 0;
						} else {
							eff -= (num * (get.realAttitude || get.attitude)(player, target)) / 4;
						}
					}
					if (eff < 4) {
						return 0;
					}
					return eff;
				},
			},
		},
	},
	xinjuece: {
		audio: "juece",
		audioname: ["dc_liru", "ol_liru"],
		trigger: {
			player: "phaseJieshuBegin",
		},
		filter(event, player) {
			return game.hasPlayer(current => current.countCards("h") === 0);
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget({
					prompt: get.prompt("xinjuece"),
					prompt2: "对一名没有手牌的角色造成1点伤害",
					filterTarget(card, player, target) {
						return target.countCards("h") === 0;
					},
					ai(target) {
						const player = get.player();
						return get.damageEffect(target, player, player);
					},
				})
				.forResult();
		},
		logTarget: "targets",
		async content(event, trigger, player) {
			const target = event.targets[0];
			await target.damage();
		},
	},
	xinmieji: {
		audio: "mieji",
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return player.countCards("h", { type: ["trick", "delay"], color: "black" });
		},
		filterCard(card) {
			return get.color(card) == "black" && get.type(card, "trick") == "trick";
		},
		filterTarget(card, player, target) {
			return target != player && target.countCards("h") > 0;
		},
		discard: false,
		delay: false,
		check(card) {
			return 8 - get.value(card);
		},
		loseTo: "cardPile",
		insert: true,
		visible: true,
		async content(event, trigger, player) {
			const { target, cards } = event;
			await player.showCards(cards, `${get.translation(player)}对${get.translation(target)}发动了【${get.translation(event.name)}】`);
			const result = await target.chooseToDiscard("he", true).set("prompt", "灭计：请弃置一张锦囊牌，或依次弃置两张非锦囊牌。").forResult();
			if (
				(!result.cards || get.type(result.cards[0], "trick", result.cards[0].original == "h" ? target : false) != "trick") &&
				target.countCards("he", function (card) {
					return get.type(card, "trick") != "trick";
				})
			) {
				await target
					.chooseToDiscard("he", true, function (card) {
						return get.type(card, "trick") != "trick";
					})
					.set("prompt", "灭计：请弃置第二张非锦囊牌");
			}
		},
		ai: {
			order: 9,
			result: {
				target: -1,
			},
		},
	},
	qianju: {
		mod: {
			globalFrom(from, to, distance) {
				return distance - from.getDamagedHp();
			},
		},
	},
	reqianju: {
		mod: {
			globalFrom(from, to, distance) {
				return distance - Math.max(1, from.getDamagedHp());
			},
		},
	},
	reqingxi: {
		audio: 2,
		trigger: { player: "useCardToPlayered" },
		filter(event, player) {
			return event.card.name == "sha" || event.card.name == "juedou";
		},
		check(event, player) {
			return get.attitude(player, event.target) < 0;
		},
		logTarget: "target",
		async content(event, trigger, player) {
			const num = Math.min(
				game.countPlayer(current => player.inRange(current)),
				player.getEquips(1).length ? 4 : 2
			);
			let result;
			if (trigger.target.countCards("h") < num) {
				result = { bool: false };
			} else {
				result = await trigger.target
					.chooseToDiscard({
						prompt: "弃置" + get.cnNumber(num) + "张手牌，或令" + get.translation(trigger.card) + "的伤害+1",
						selectCard: num,
						ai(card) {
							const player = get.player();
							if (player.hp == 1) {
								if (get.type(card) == "basic") {
									return 8 - get.value(card);
								}
								return 10 - get.value(card);
							}
							if (num > 2) {
								return 0;
							}
							return 8 - get.value(card);
						},
					})
					.forResult();
			}
			if (result.bool) {
				const e1 = player.getEquips(1);
				if (e1.length) {
					await player.modedDiscard({
						cards: e1,
						discarder: trigger.target,
					});
				}
				return;
			}
			const id = trigger.target.playerid;
			if (id != null) {
				const map = trigger.customArgs;
				if (!map[id]) {
					map[id] = {};
				}
				if (!map[id].extraDamage) {
					map[id].extraDamage = 0;
				}
				map[id].extraDamage++;
			}
			result = await player
				.judge({
					judge(card) {
						if (get.color(card) == "red") {
							return 1;
						}
						return 0;
					},
					judge2(result) {
						return result.bool;
					},
				})
				.forResult();
			if (result.color == "red" && typeof trigger.directHit !== "boolean") {
				trigger.directHit.add(trigger.target);
			}
		},
	},
	reqingxi2: {
		mod: {
			cardEnabled(card, player) {
				if (
					player.storage.reqingxi2 &&
					player.storage.reqingxi2.filter(function (cd) {
						return get.color(cd) == get.color(card);
					}).length
				) {
					return false;
				}
			},
			cardRespondable(card, player) {
				if (
					player.storage.reqingxi2 &&
					player.storage.reqingxi2.filter(function (cd) {
						return get.color(cd) == get.color(card);
					}).length
				) {
					return false;
				}
			},
		},
		firstDo: true,
		onremove: true,
		trigger: {
			player: ["damage", "damageCancelled", "damageZero"],
			target: ["shaMiss", "useCardToExcluded"],
		},
		charlotte: true,
		sourceSkill: "reqingxi",
		filter(event, player) {
			const evt = event.getParent("useCard", true, true);
			if (evt && evt.effectedCount < evt.effectCount) {
				return false;
			}
			return player.storage.reqingxi2 && event.card && player.storage.reqingxi2.includes(event.card);
		},
		silent: true,
		forced: true,
		popup: false,
		priority: 12,
		async content(event, trigger, player) {
			player.storage.reqingxi2.remove(trigger.card);
			if (!player.storage.reqingxi2.length) {
				player.removeSkill("reqingxi2");
			}
		},
	},
	qingxi: {
		audio: 2,
		trigger: { source: "damageBegin1" },
		check(event, player) {
			return get.attitude(player, event.player) < 0;
		},
		filter(event, player) {
			return event.getParent()?.name === "sha" && player.getEquips(1).length > 0;
		},
		async content(event, trigger, player) {
			const num = player.getEquipRange();

			/** @type {Partial<Result>} */
			let result = { bool: false };
			if (trigger.player.countCards("h") >= num) {
				result = await trigger.player
					.chooseToDiscard({
						prompt: "弃置" + get.cnNumber(num) + "张手牌，或令杀的伤害+1",
						selectCard: num,
						ai(card) {
							const player = _status.event.player;
							if (player.hp == 1) {
								if (get.type(card) == "basic") {
									return 8 - get.value(card);
								}
								return 10 - get.value(card);
							}
							if (num > 2) {
								return 0;
							}
							return 8 - get.value(card);
						},
					})
					.forResult();
			}
			if (result.bool) {
				const e1 = player.getEquips(1);
				if (e1.length) {
					await player.modedDiscard({
						cards: e1,
						discarder: trigger.player,
					});
				}
			} else {
				trigger.num++;
			}
		},
	},
	jieyue: {
		audio: 4,
		trigger: { player: "phaseJieshuBegin" },
		logAudio: () => 2,
		async cost(event, trigger, player) {
			event.result = await await player
				.chooseCardTarget({
					filterTarget(card, player, target) {
						return target != player && target.countCards("he") > 0;
					},
					filterCard: lib.filter.cardDiscardable,
					ai1(card) {
						return 7 - get.useful(card);
					},
					ai2(target) {
						return 1 - get.attitude(_status.event.player, target);
					},
					prompt: get.prompt2("jieyue"),
				})
				.forResult();
		},
		logTarget: "targets",
		async content(event, trigger, player) {
			await player.discard({ cards: event.cards });
			const target = event.targets[0];

			const result = await target
				.chooseCard({
					prompt: `将一张牌置于${get.translation(player)}的武将牌上，或令其弃置你的一张牌`,
					position: "he",
					ai(card) {
						if (card.name == "du") {
							return 20;
						}
						const player = _status.event.player;
						if (get.attitude(player, _status.event.getParent().player) > 0) {
							return 8 - get.value(card);
						}
						const nh = player.countCards("h");
						if (nh <= 2) {
							return 6 - get.value(card);
						}
						if (nh <= 3) {
							return 2 - get.value(card);
						}
						return 0;
					},
				})
				.forResult();

			if (result.bool && result.cards?.length) {
				await player.addToExpansion({
					cards: result.cards,
					source: target,
					animate: "give",
					gaintag: ["jieyue"],
				});
			} else if (target.countCards("he")) {
				await player.discardPlayerCard({
					target,
					forced: true,
				});
			}
		},
		ai: { expose: 0.1 },
		marktext: "节",
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
		group: ["jieyue_wuxie", "jieyue_shan", "jieyue_gain"],
		subSkill: {
			wuxie: {
				audio: "jieyue3.mp3",
				enable: "chooseToUse",
				filterCard(card) {
					return get.color(card) == "black";
				},
				viewAsFilter(player) {
					return player.countExpansions("jieyue") > 0 && player.countCards("hs", { color: "black" }) > 0;
				},
				position: "hs",
				viewAs: { name: "wuxie" },
				prompt: "将一张黑色手牌当无懈可击使用",
				check(card) {
					return 8 - get.value(card);
				},
			},
			shan: {
				audio: "jieyue4.mp3",
				enable: ["chooseToRespond", "chooseToUse"],
				filterCard(card) {
					return get.color(card) == "red";
				},
				position: "hs",
				viewAs: { name: "shan" },
				viewAsFilter(player) {
					return player.countExpansions("jieyue") > 0 && player.countCards("hs", { color: "red" }) > 0;
				},
				prompt: "将一张红色手牌当闪使用或打出",
				check: () => 1,
				ai: {
					respondShan: true,
					skillTagFilter(player) {
						if (!player.getExpansions("jieyue").length || !player.countCards("hs", { color: "red" })) {
							return false;
						}
					},
					effect: {
						target(card, player, target, current) {
							if (get.tag(card, "respondShan") && current < 0) {
								return 0.8;
							}
						},
					},
				},
			},
			gain: {
				audio: ["jieyue1.mp3", "jieyue2.mp3"],
				trigger: { player: "phaseZhunbeiBegin" },
				filter(event, player) {
					return player.getExpansions("jieyue").length;
				},
				forced: true,
				async content(event, trigger, player) {
					const cards = player.getExpansions("jieyue");
					if (cards.length) {
						player.gain(cards, "gain2");
					}
				},
			},
		},
	},
	jinjiu: {
		mod: {
			cardname(card, player) {
				if (card.name == "jiu") {
					return "sha";
				}
			},
		},
		ai: {
			skillTagFilter(player) {
				if (!player.countCards("h", "jiu")) {
					return false;
				}
			},
			respondSha: true,
		},
		audio: 2,
		trigger: { player: ["useCard1", "respond"] },
		firstDo: true,
		forced: true,
		filter(event, player) {
			return event.card.name == "sha" && !event.skill && event.cards.length == 1 && event.cards[0].name == "jiu";
		},
		async content(event, trigger, player) {},
	},
	xinxianzhen: {
		audio: "xianzhen",
		inherit: "xianzhen",
	},
	xinxianzhen2: {
		audio: "xianzhen",
		audioname2: {
			ol_gaoshun: "rexianzhen",
		},
		mod: {
			targetInRange(card, player, target) {
				if (target == player.storage.xinxianzhen) {
					return true;
				}
			},
			cardUsableTarget(card, player, target) {
				if (target == player.storage.xinxianzhen) {
					return true;
				}
			},
		},
		ai: {
			unequip: true,
			skillTagFilter(player, tag, arg) {
				if (arg.target != player.storage.xinxianzhen) {
					return false;
				}
			},
			effect: {
				player_use(card, player, target, current, isLink) {
					if (isLink || !player.storage.xinxianzhen || player._xinxianzhen_effect_temp) {
						return;
					}
					if (target != player.storage.xinxianzhen && ["sha", "guohe", "shunshou", "huogong", "juedou"].includes(card.name)) {
						player._xinxianzhen_effect_temp = true;
						let eff = get.effect(player.storage.xinxianzhen, card, player, player);
						delete player._xinxianzhen_effect_temp;
						if (eff > 0) {
							return [1, 2];
						}
					}
				},
			},
		},
		trigger: { player: "useCard2" },
		sourceSkill: "xinxianzhen",
		filter(event, player) {
			return player.storage.xinxianzhen && player.storage.xinxianzhen.isIn() && (event.card.name == "sha" || get.type(event.card) == "trick") && event.targets && event.targets.length == 1 && !event.targets.includes(player.storage.xinxianzhen);
		},
		check(event, player) {
			return get.effect(player.storage.xinxianzhen, event.card, player, player) > 0;
		},
		logTarget(event, player) {
			return player.storage.xinxianzhen;
		},
		prompt2: (event, player) => "令" + get.translation(player.storage.decadexianzhen2) + "也成为" + get.translation(event.card) + "的目标",
		async content(event, trigger, player) {
			const target = player.storage.xinxianzhen;
			trigger.targets.push(target);
			game.log(target, "成为了", trigger.card, "的额外目标");
		},
	},
	xinxianzhen3: {
		charlotte: true,
		mod: {
			cardEnabled(card) {
				if (card.name == "sha") {
					return false;
				}
			},
			ignoredHandcard(card, player) {
				if (get.name(card) == "sha") {
					return true;
				}
			},
			cardDiscardable(card, player, name) {
				if (name == "phaseDiscard" && get.name(card) == "sha") {
					return false;
				}
			},
		},
	},
	xianzhen: {
		audio: 2,
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
			if (result.bool) {
				player.storage[event.name] = target;
				player.addTempSkill(event.name + 2);
			} else {
				player.addTempSkill(event.name + 3);
			}
		},
		ai: {
			order(name, player) {
				var cards = player.getCards("h");
				if (player.countCards("h", "sha") == 0) {
					return 1;
				}
				for (var i = 0; i < cards.length; i++) {
					if (cards[i].name != "sha" && get.number(cards[i]) > 11 && get.value(cards[i]) < 7) {
						return 9;
					}
				}
				return get.order({ name: "sha" }) - 1;
			},
			result: {
				player(player) {
					if (player.countCards("h", "sha") > 0) {
						return 0;
					}
					var num = player.countCards("h");
					if (num > player.hp) {
						return 0;
					}
					if (num == 1) {
						return -2;
					}
					if (num == 2) {
						return -1;
					}
					return -0.7;
				},
				target(player, target) {
					var num = target.countCards("h");
					if (num == 1) {
						return -1;
					}
					if (num == 2) {
						return -0.7;
					}
					return -0.5;
				},
			},
			threaten: 1.3,
		},
	},
	xianzhen2: {
		charlotte: true,
		mod: {
			targetInRange(card, player, target) {
				if (target == player.storage.xianzhen) {
					return true;
				}
			},
			cardUsableTarget(card, player, target) {
				if (target == player.storage.xianzhen) {
					return true;
				}
			},
		},
		ai: {
			unequip: true,
			skillTagFilter(player, tag, arg) {
				if (arg.target != player.storage.xianzhen) {
					return false;
				}
			},
		},
	},
	xianzhen3: {
		charlotte: true,
		mod: {
			cardEnabled(card) {
				if (card.name == "sha") {
					return false;
				}
			},
		},
	},
	lihuo: {
		trigger: { player: "useCard1" },
		filter(event, player) {
			if (event.card.name == "sha" && !game.hasNature(event.card)) {
				return true;
			}
			return false;
		},
		audio: 2,
		audioname: ["re_chengpu"],
		check(event, player) {
			return false;
		},
		async content(event, trigger, player) {
			const { card } = event;
			game.setNature(trigger.card, "fire");
			const next = game.createEvent("lihuo_clear");
			next.player = player;
			next.card = trigger.card;
			event.next.remove(next);
			next.forceDie = true;
			trigger.after.push(next);
			next.setContent(function () {
				if (
					player.isIn() &&
					player.getHistory("sourceDamage", function (evt) {
						return evt.getParent(2) == event.parent;
					}).length > 0
				) {
					player.loseHp();
				}
				game.setNature(card, [], true);
			});
		},
		group: "lihuo2",
	},
	lihuo2: {
		trigger: { player: "useCard2" },
		sourceSkill: "lihuo",
		filter(event, player) {
			if (event.card.name != "sha" || !game.hasNature(event.card, "fire")) {
				return false;
			}
			return game.hasPlayer(function (current) {
				return !event.targets.includes(current) && player.canUse(event.card, current);
			});
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget({
					prompt: get.prompt("lihuo"),
					prompt2: `为${get.translation(trigger.card)}增加一个目标`,
					filterTarget(card, player, target) {
						return !_status.event.sourcex.includes(target) && player.canUse(_status.event.card, target);
					},
					ai(target) {
						const player = _status.event.player;
						return get.effect(target, _status.event.card, player, player);
					},
				})
				.set("sourcex", trigger.targets)
				.set("card", trigger.card)
				.forResult();
		},
		logTarget: "targets",
		async content(event, trigger, player) {
			if (!event.isMine() && !_status.connectMode) {
				await game.delayx();
			}
			const target = event.targets[0];
			trigger.targets.push(target);
		},
	},
	lihuo3: {
		trigger: { player: "useCardAfter" },
		vanish: true,
		sourceSkill: "lihuo",
		filter(event, player) {
			return event.card.name == "sha";
		},
		forced: true,
		audio: false,
		async content(event, trigger, player) {
			player.loseHp();
			player.removeSkill("lihuo3");
		},
	},
	chunlao: {
		trigger: { player: "phaseJieshuBegin" },
		audio: 2,
		audioname: ["xin_chengpu"],
		filter(event, player) {
			return player.countCards("h") > 0 && (_status.connectMode || player.countCards("h", "sha") > 0) && !player.getExpansions("chunlao").length;
		},
		intro: {
			content: "expansion",
			markcount: "expansion",
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseCard({
					prompt: get.prompt("chunlao"),
					filterCard: get.filter({ name: "sha" }),
					selectCard: [1, Math.max(1, player.countCards("h", "sha"))],
					allowChooseAll: true,
					ai() {
						return 1;
					},
				})
				.forResult();
		},
		async content(event, trigger, player) {
			await player.addToExpansion({
				cards: event.cards,
				source: player,
				animate: "giveAuto",
				gaintag: ["chunlao"],
			});
		},
		ai: {
			effect: {
				player_use(card, player, target) {
					if (_status.currentPhase != player) {
						return;
					}
					if (card.name == "sha" && !player.needsToDiscard() && !player.getExpansions("chunlao").length && target.hp > 1) {
						return "zeroplayertarget";
					}
				},
			},
			threaten: 1.4,
		},
		group: "chunlao2",
	},
	chunlao2: {
		enable: "chooseToUse",
		sourceSkill: "chunlao",
		filter(event, player) {
			return event.type == "dying" && event.dying && event.dying.hp <= 0 && player.getExpansions("chunlao").length > 0;
		},
		filterTarget(card, player, target) {
			return target == _status.event.dying;
		},
		direct: true,
		clearTime: true,
		delay: false,
		selectTarget: -1,
		async content(event, trigger, player) {
			const target = event.target;
			const result = await player
				.chooseCardButton({
					prompt: get.translation("chunlao"),
					cards: player.getExpansions("chunlao"),
					forced: true,
				})
				.forResult();
			if (!result.bool || !result.links?.length) {
				return;
			}
			player.logSkill("chunlao", target);
			await player.loseToDiscardpile({
				cards: result.links,
			});
			event.type = "dying";
			await target.useCard({
				card: get.autoViewAs({ name: "jiu", isCard: true }),
				targets: [target],
			});
		},
		ai: {
			order: 6,
			skillTagFilter(player) {
				return player.getExpansions("chunlao").length > 0;
			},
			save: true,
			result: {
				target: 3,
			},
			threaten: 1.6,
		},
	},
	chunlao2_old: {
		trigger: { global: "dying" },
		sourceSkill: "chunlao",
		//priority:6,
		filter(event, player) {
			return event.player.hp <= 0 && player.storage.chunlao.length > 0;
		},
		async cost(event, trigger, player) {
			const att = get.attitude(player, trigger.player);

			event.result = await player
				.chooseCardButton({
					prompt: get.prompt("chunlao", trigger.player),
					cards: player.storage.chunlao,
					ai(button) {
						if (_status.event.att > 0) {
							return 1;
						}
						return 0;
					},
				})
				.set("att", att)
				.forResult();

			event.result.cards = event.result.links;
		},
		logTarget: "player",
		async content(event, trigger, player) {
			const cards = event.cards;
			player.$throw(cards);
			player.storage.chunlao.remove(cards[0]);
			cards[0].discard();
			player.syncStorage("chunlao");
			await trigger.player.useCard({
				card: get.autoViewAs({ name: "jiu", isCard: true }),
				targets: [trigger.player],
			});
			if (!player.storage.chunlao.length) {
				player.unmarkSkill("chunlao");
			} else {
				player.markSkill("chunlao");
			}
		},
		ai: {
			expose: 0.2,
		},
	},
	shenduan: {
		trigger: {
			player: "loseAfter",
			global: "loseAsyncAfter",
		},
		filter(event, player) {
			if (event.type != "discard" || event.getlx === false) {
				return;
			}
			var evt = event.getl(player);
			for (var i = 0; i < evt.cards2.length; i++) {
				if (get.color(evt.cards2[i], evt.hs.includes(evt.cards2[i]) ? evt.player : false) == "black" && get.type(evt.cards2[i]) == "basic" && get.position(evt.cards2[i], evt.hs.includes(evt.cards2[i]) ? evt.player : false) == "d") {
					return true;
				}
			}
			return false;
		},
		audio: 2,
		async cost(event, trigger, player) {
			const cards = [];
			const evt = trigger.getl(player);
			for (let i = 0; i < evt.cards2.length; i++) {
				if (get.color(evt.cards2[i], evt.hs.includes(evt.cards2[i]) ? evt.player : false) == "black" && get.type(evt.cards2[i], evt.hs.includes(evt.cards2[i]) ? evt.player : false) == "basic" && get.position(evt.cards2[i]) == "d") {
					cards.push(evt.cards2[i]);
				}
			}
			if (!cards.length) {
				return;
			}
			const result = await player
				.chooseButtonTarget({
					createDialog: [get.prompt2(event.skill), cards],
					filterButton: true,
					filterTarget(_, player, target) {
						const card = ui.selected.buttons[0]?.link;
						return player.canUse({ name: "bingliang", cards: [card] }, target, false);
					},
					ai1(button) {
						return Math.random();
					},
					ai2(target) {
						const player = get.player();
						return get.effect(target, { name: "bingliang" }, player, player);
					},
				})
				.forResult();
			const { bool, links, targets } = result;
			if (bool && links?.length && targets?.length) {
				cards.remove(links[0]);
				event.result = {
					bool: true,
					cost_data: [targets[0], links[0], cards],
				};
			}
		},
		async content(event, trigger, player) {
			let {
				cost_data: [target, card, cards],
			} = event;
			player.line(target);
			await player.useCard({ name: "bingliang" }, target, [card], "shenduan").set("animate", false);
			while (cards?.someInD("d")) {
				const result = await player
					.chooseButtonTarget({
						createDialog: [get.prompt2(event.name), cards],
						filterButton: true,
						filterTarget(_, player, target) {
							const card = ui.selected.buttons[0]?.link;
							return player.canUse({ name: "bingliang", cards: [card] }, target, false);
						},
						ai1(button) {
							return Math.random();
						},
						ai2(target) {
							const player = get.player();
							return get.effect(target, { name: "bingliang" }, player, player);
						},
					})
					.forResult();
				const { bool, links, targets } = result;
				if (bool && links?.length && targets?.length) {
					player.line(targets[0]);
					cards.remove(links[0]);
					await player.useCard({ name: "bingliang" }, targets[0], links, "shenduan").set("animate", false);
				} else {
					break;
				}
				cards = cards.filterInD("d");
			}
		},
	},
	reshenduan: {
		audio: 2,
		trigger: {
			global: "loseAsyncAfter",
			player: "loseAfter",
		},
		filter(event, player) {
			if (event.type != "discard" || event.getlx === false) {
				return;
			}
			var evt = event.getl(player);
			for (var i = 0; i < evt.cards2.length; i++) {
				if (get.color(evt.cards2[i], player) == "black" && ["basic", "equip"].includes(get.type(evt.cards2[i], evt.hs.includes(evt.cards2[i]) ? evt.player : false)) && get.position(evt.cards2[i]) == "d") {
					return true;
				}
			}
			return false;
		},
		async cost(event, trigger, player) {
			const cards = [];
			const evt = trigger.getl(player);
			for (let i = 0; i < evt.cards2.length; i++) {
				if (get.color(evt.cards2[i], player) == "black" && ["basic", "equip"].includes(get.type(evt.cards2[i], evt.hs.includes(evt.cards2[i]) ? evt.player : false)) && get.position(evt.cards2[i]) == "d") {
					cards.push(evt.cards2[i]);
				}
			}
			if (!cards.length) {
				return;
			}
			const result = await player
				.chooseButtonTarget({
					createDialog: [get.prompt2(event.skill), cards],
					filterButton: true,
					filterTarget(_, player, target) {
						const card = ui.selected.buttons[0]?.link;
						return player.canUse({ name: "bingliang", cards: [card] }, target, false);
					},
					ai1(button) {
						return Math.random();
					},
					ai2(target) {
						const player = get.player();
						return get.effect(target, { name: "bingliang" }, player, player);
					},
				})
				.forResult();
			const { bool, links, targets } = result;
			if (bool && links?.length && targets?.length) {
				cards.remove(links[0]);
				event.result = {
					bool: true,
					cost_data: [targets[0], links[0], cards],
				};
			}
		},
		async content(event, trigger, player) {
			let {
				cost_data: [target, card, cards],
			} = event;
			player.line(target);
			await player.useCard({ name: "bingliang" }, target, [card], "shenduan").set("animate", false);
			while (cards?.someInD("d")) {
				const result = await player
					.chooseButtonTarget({
						createDialog: [get.prompt2(event.name), cards],
						filterButton: true,
						filterTarget(_, player, target) {
							const card = ui.selected.buttons[0]?.link;
							return player.canUse({ name: "bingliang", cards: [card] }, target, false);
						},
						ai1(button) {
							return Math.random();
						},
						ai2(target) {
							const player = get.player();
							return get.effect(target, { name: "bingliang" }, player, player);
						},
					})
					.forResult();
				const { bool, links, targets } = result;
				if (bool && links?.length && targets?.length) {
					player.line(targets[0]);
					cards.remove(links[0]);
					await player.useCard({ name: "bingliang" }, targets[0], links, "shenduan").set("animate", false);
				} else {
					break;
				}
				cards = cards.filterInD("d");
			}
		},
	},
	reyonglve: {
		audio: 2,
		trigger: { global: "phaseJudgeBegin" },
		filter(event, player) {
			return event.player != player && event.player.countCards("j") > 0;
		},
		async cost(event, trigger, player) {
			const att = get.attitude(player, trigger.player);
			const nh = trigger.player.countCards("h");
			let eff = get.effect(trigger.player, { name: "sha", isCard: true }, player, player);
			if (player.inRange(trigger.player) || !player.canUse({ name: "sha", isCard: true }, trigger.player, false)) {
				eff = 0;
			}

			event.result = await player
				.discardPlayerCard({
					prompt: get.prompt("yonglve", trigger.player),
					target: trigger.player,
					position: "j",
					ai(button) {
						const name = button.link.viewAs || button.link.name;
						const { att, nh, eff } = get.event();
						const trigger = get.event().getTrigger();
						if (att > 0 && eff >= 0) {
							return 1;
						}
						if (att >= 0 && eff > 0) {
							return 1;
						}
						if (
							att > 0 &&
							(trigger.player.hp >= 3 ||
								trigger.player.hasSkillTag("freeShan", false, {
									player: _status.event.player,
									card: new lib.element.VCard({ name: "sha", isCard: true }),
									type: "use",
								}) ||
								trigger.player.countCards("h", "shan"))
						) {
							if (name == "lebu" && nh > trigger.player.hp) {
								return 1;
							}
							if (name == "bingliang" && nh < trigger.player.hp) {
								return 1;
							}
						}
						return 0;
					},
				})
				.set("att", att)
				.set("nh", nh)
				.set("eff", eff)
				.set("chooseonly", true)
				.forResult();
		},
		logTarget: "player",
		async content(event, trigger, player) {
			await trigger.player.discard({
				cards: event.cards,
				discarder: player,
			});
			if (!player.inRange(trigger.player) && player.canUse({ name: "sha", isCard: true }, trigger.player, false)) {
				await player.useCard({
					card: get.autoViewAs({ name: "sha", isCard: true }),
					targets: [trigger.player],
				});
			} else {
				await player.draw();
			}
		},
	},
	yonglve: {
		trigger: { global: "phaseJudgeBegin" },
		audio: 2,
		filter(event, player) {
			return event.player != player && event.player.countCards("j") > 0 && player.inRange(event.player);
		},
		async cost(event, trigger, player) {
			const att = get.attitude(player, trigger.player);
			const nh = trigger.player.countCards("h");
			let eff = get.effect(trigger.player, { name: "sha", isCard: true }, player, player);
			if (!player.canUse({ name: "sha", isCard: true }, trigger.player)) {
				eff = 0;
			}
			event.result = await player
				.discardPlayerCard({
					prompt: get.prompt("yonglve", trigger.player),
					target: trigger.player,
					position: "j",
					ai(button) {
						const name = button.link.viewAs || button.link.name;
						const { att, nh, eff } = get.event();
						const trigger = get.event().getTrigger();
						if (att > 0 && eff >= 0) {
							return 1;
						}
						if (att >= 0 && eff > 0) {
							return 1;
						}
						if (
							att > 0 &&
							(trigger.player.hp >= 3 ||
								trigger.player.hasSkillTag("freeShan", false, {
									player: _status.event.player,
									card: new lib.element.VCard({ name: "sha", isCard: true }),
									type: "use",
								}) ||
								trigger.player.countCards("h", "shan"))
						) {
							if (name == "lebu" && nh > trigger.player.hp) {
								return 1;
							}
							if (name == "bingliang" && nh < trigger.player.hp) {
								return 1;
							}
						}
						return 0;
					},
				})
				.set("att", att)
				.set("nh", nh)
				.set("eff", eff)
				.set("chooseonly", true)
				.forResult();
		},
		logTarget: "player",
		async content(event, trigger, player) {
			await trigger.player.discard({
				cards: event.cards,
				discarder: player,
			});
			let related;
			let used = false;
			if (player.canUse({ name: "sha", isCard: true }, trigger.player)) {
				used = true;
				related = await player.useCard({
					card: get.autoViewAs({ name: "sha", isCard: true }),
					targets: [trigger.player],
				});
			}
			if (!used || !game.hasPlayer2(current => current.hasHistory("damage", evt => evt.getParent(2) == related))) {
				await player.draw();
			}
		},
		//group:'yonglve2'
	},
	yonglve2: {
		trigger: { source: "damage" },
		forced: true,
		popup: false,
		sourceSkill: "yonglve",
		filter(event) {
			return event.parent.skill == "yonglve";
		},
		async content(event, trigger, player) {
			player.storage.yonglve = true;
		},
	},
	benxi: {
		audio: 2,
		trigger: { player: "useCard2" },
		forced: true,
		filter(event, player) {
			return player.isPhaseUsing();
		},
		async content(event, trigger, player) {},
		mod: {
			globalFrom(from, to, distance) {
				if (_status.currentPhase == from) {
					return distance - from.countUsed();
				}
			},
			selectTarget(card, player, range) {
				if (_status.currentPhase == player) {
					if (card.name == "sha" && range[1] != -1) {
						if (
							!game.hasPlayer(function (current) {
								return get.distance(player, current) > 1;
							})
						) {
							range[1]++;
						}
					}
				}
			},
		},
		ai: {
			unequip: true,
			skillTagFilter(player) {
				if (
					game.hasPlayer(function (current) {
						return get.distance(player, current) > 1;
					})
				) {
					return false;
				}
			},
		},
	},
	sidi: {
		audio: 2,
		trigger: { global: "useCard" },
		filter(event, player) {
			if (event.card.name != "shan") {
				return false;
			}
			if (event.player == player) {
				return true;
			}
			return _status.currentPhase == player;
		},
		frequent: true,
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
		async content(event, trigger, player) {
			player.addToExpansion(get.cards(), "gain2").gaintag.add("sidi");
		},
		group: "sidi2",
	},
	sidi2: {
		trigger: { global: "phaseUseBegin" },
		sourceSkill: "sidi",
		filter(event, player) {
			if (event.player == player || event.player.isDead()) {
				return false;
			}
			if (!player.getExpansions("sidi").length) {
				return false;
			}
			return true;
		},
		check(event, player) {
			if (get.attitude(player, event.player) >= 0) {
				return false;
			}
			if (event.player.getEquip("zhuge")) {
				return false;
			}
			if (event.player.hasSkill("paoxiao")) {
				return false;
			}
			var players = game.filterPlayer();
			for (var i = 0; i < players.length; i++) {
				if (event.player.canUse("sha", players[i]) && get.attitude(player, players[i]) > 0) {
					break;
				}
			}
			if (i == players.length) {
				return false;
			}
			var nh = event.player.countCards("h");
			var nsha = event.player.countCards("h", "sha");
			if (nh < 2) {
				return false;
			}
			switch (nh) {
				case 2:
					if (nsha) {
						return Math.random() < 0.4;
					}
					return Math.random() < 0.2;
				case 3:
					if (nsha) {
						return Math.random() < 0.8;
					}
					return Math.random() < 0.3;
				case 4:
					if (nsha > 1) {
						return true;
					}
					if (nsha) {
						return Math.random() < 0.9;
					}
					return Math.random() < 0.5;
				default:
					return true;
			}
		},
		logTarget: "player",
		async content(event, trigger, player) {
			const cards = player.getExpansions("sidi");
			let button;
			if (cards.length == 1) {
				button = cards[0];
			} else {
				const result = await player
					.chooseCardButton({
						prompt: "弃置一张“司敌”牌",
						cards,
						forced: true,
					})
					.forResult();
				if (result.bool && result.links?.length) {
					button = result.links[0];
				}
			}
			if (button) {
				await player.loseToDiscardpile(button);
				trigger.player.addTempSkill("sidi3", "phaseUseAfter");
				trigger.player.addMark("sidi3", 1, false);
			}
		},
	},
	sidi3: {
		mod: {
			cardUsable(card, player, num) {
				if (card.name == "sha") {
					return num - player.countMark("sidi3");
				}
			},
		},
		onremove: true,
	},
	zhongyong: {
		audio: 2,
		trigger: {
			player: "shaMiss",
		},
		filter(event, player) {
			return event.responded && get.itemtype(event.responded.cards) == "cards";
		},
		async cost(event, trigger, player) {
			const cards = trigger.responded.cards;

			event.result = await player
				.chooseTarget({
					prompt: `忠勇：将${get.translation(trigger.responded.cards)}交给一名角色`,
					filterTarget(card, player, target) {
						return target !== get.event().source;
					},
					ai(target) {
						const att = get.attitude(get.player(), target);
						const cards = target.getCards("h");
						if (cards.length >= 2 && cards.some(card => card.name === "shan")) {
							att /= 1.5;
						}
						return att;
					},
				})
				.set("source", trigger.target);
		},
		logTarget: "targets",
		async content(event, trigger, player) {
			const cards = trigger.responded.cards;
			const target = event.targets[0];
			if (target === player) {
				return;
			}

			await player
				.chooseToUse({
					prompt: `是否对${get.translation(trigger.target)}使用一张杀？`,
					filterCard(card) {
						return card.name === "sha";
					},
					filterTarget(card, player, target) {
						return target === get.event().target;
					},
					selectTarget: -1,
				})
				.set("target", trigger.target)
				.set("addCount", false);
		},
	},
	xinzhongyong: {
		audio: "zhongyong",
		trigger: {
			player: "useCardAfter",
		},
		filter(event, player) {
			return event.card.name == "sha";
		},
		async cost(event, trigger, player) {
			const sha = trigger.cards.slice(0).filterInD();
			const shan = [];
			for (const current of game.filterPlayer2()) {
				for (const evt of current.getHistory("useCard", evt => evt.card.name === "shan" && evt.getParent(3) == trigger)) {
					shan.addArray(evt.cards);
				}
			}
			shan.filterInD();

			if (!sha.length && !shan.length) {
				return;
			}

			event.result = await player
				.chooseTarget({
					prompt: get.prompt2("xinzhongyong"),
					filterTarget(card, player, target) {
						return !_status.event.source.includes(target) && target !== player;
					},
					ai(target) {
						return get.attitude(_status.event.player, target);
					},
				})
				.set("source", trigger.targets)
				.forResult();

			event.result.cost_data = {
				sha,
				shan,
			};
		},
		logTarget: "targets",
		async content(event, trigger, player) {
			const target = event.targets[0];
			const { sha, shan } = event.cost_data;

			let result;
			if (sha.length && shan.length) {
				result = await player
					.chooseControl({
						choiceList: ["将" + get.translation(event.sha) + "交给" + get.translation(target), "将" + get.translation(event.shan) + "交给" + get.translation(target)],
						ai() {
							return _status.event.choice;
						},
					})
					.set(
						"choice",
						(function () {
							if (get.color(event.sha) != "black") {
								return 0;
							}
							return 1;
						})()
					)
					.forResult();
			} else {
				result = { index: sha.length ? 0 : 1 };
			}

			const cards = result.index == 0 ? sha : shan;
			await target.gain({
				cards,
				animate: "gain2",
			});
			if (cards.some(card => get.color(card) === "red")) {
				await target
					.chooseToUse({
						prompt: "是否使用一张杀？",
						filterCard: get.filter({ name: "sha" }),
						filterTarget(card, player, target) {
							return target != _status.event.sourcex && _status.event.sourcex.inRange(target) && lib.filter.targetEnabled.apply(this, arguments);
						},
					})
					.set("sourcex", player)
					.set("addCount", false);
			}
		},
	},
	dangxian: {
		trigger: { player: "phaseBegin" },
		forced: true,
		audio: 2,
		audioname2: { guansuo: "dangxian_guansuo" },
		async content(event, trigger, player) {
			trigger.phaseList.splice(trigger.num, 0, `phaseUse|${event.name}`);
		},
	},
	longyin: {
		audio: 2,
		init: player => {
			game.addGlobalSkill("longyin_order");
		},
		onremove: player => {
			if (!game.hasPlayer(current => current.hasSkill("longyin", null, null, false), true)) {
				game.removeGlobalSkill("longyin_order");
			}
		},
		trigger: { global: "useCard" },
		filter(event, player) {
			return event.card.name == "sha" && player.countCards("he") > 0 && event.player.isPhaseUsing();
		},
		async cost(event, trigger, player) {
			let go = false;
			if (get.attitude(player, trigger.player) > 0) {
				if (get.color(trigger.card) == "red") {
					go = true;
				} else if (trigger.addCount === false || !trigger.player.isPhaseUsing()) {
					go = false;
				} else if (!trigger.player.hasSkill("paoxiao") && !trigger.player.hasSkill("tanlin3") && !trigger.player.hasSkill("zhaxiang2") && !trigger.player.hasSkill("fengnu") && !trigger.player.getEquip("zhuge")) {
					var nh = trigger.player.countCards("h");
					if (player == trigger.player) {
						go = player.countCards("h", "sha") > 0;
					} else if (nh >= 4) {
						go = true;
					} else if (player.countCards("h", "sha")) {
						if (nh == 3) {
							go = Math.random() < 0.8;
						} else if (nh == 2) {
							go = Math.random() < 0.5;
						}
					} else if (nh >= 3) {
						if (nh == 3) {
							go = Math.random() < 0.5;
						} else if (nh == 2) {
							go = Math.random() < 0.2;
						}
					}
				}
			}
			if (go && !event.isMine() && !event.isOnline() && player.hasCard(card => get.value(card) < 6 && lib.filter.cardDiscardable(card, player, event.name), "he")) {
				await game.delayx();
			}

			event.result = await player
				.chooseToDiscard({
					prompt: get.prompt("longyin"),
					prompt2: "弃置一张牌" + (get.color(trigger.card) == "red" ? "并摸一张牌" : "") + "，令" + get.translation(trigger.player) + "本次使用的【杀】不计入使用次数",
					position: "he",
					ai(card) {
						if (get.event().go) {
							return 6 - get.value(card);
						}
						return 0;
					},
				})
				.set("go", go)
				.set("chooseonly", true)
				.forResult();
		},
		logTarget: "player",
		async content(event, trigger, player) {
			await player.discard({
				cards: event.cards,
				discarder: player,
			});
			if (trigger.addCount !== false) {
				trigger.addCount = false;
				const stat = trigger.player.getStat().card;
				const name = trigger.card.name;
				if (typeof stat[name] === "number") {
					stat[name]--;
				}
			}
			if (get.color(trigger.card) == "red") {
				await player.draw();
			}
		},
		ai: {
			expose: 0.2,
		},
		subSkill: {
			order: {
				mod: {
					aiOrder: (player, card, num) => {
						if (num && card.name === "sha" && get.color(card) === "red") {
							let gp = game.findPlayer(current => {
								return current.hasSkill("longyin") && current.hasCard(i => true, "he");
							});
							if (gp) {
								return num + 0.15 * Math.sign(get.attitude(player, gp));
							}
						}
					},
				},
				trigger: { player: "dieAfter" },
				filter: (event, player) => {
					return !game.hasPlayer(current => current.hasSkill("longyin", null, null, false), true);
				},
				silent: true,
				forceDie: true,
				charlotte: true,
				content: () => {
					game.removeGlobalSkill("longyin_order");
				},
			},
		},
	},
	jigong: {
		audio: 2,
		trigger: { player: "phaseUseBegin" },
		check(event, player) {
			var nh = player.countCards("h") - player.countCards("h", { type: "equip" });
			if (nh <= 1) {
				return true;
			}
			if (player.countCards("h", "tao")) {
				return false;
			}
			if (nh <= 2) {
				return Math.random() < 0.7;
			}
			if (nh <= 3) {
				return Math.random() < 0.4;
			}
			return false;
		},
		async content(event, trigger, player) {
			player.draw(2);
			player.addTempSkill("jigong2");
		},
	},
	jigong2: {
		mod: {
			maxHandcardBase(player, num) {
				var damage = player.getStat().damage;
				if (typeof damage == "number") {
					return damage;
				}
				return 0;
			},
		},
	},
	shifei: {
		audio: 2,
		audioname: ["re_guotufengji"],
		enable: ["chooseToRespond", "chooseToUse"],
		filter(event, player) {
			if (!_status.currentPhase || event.shifei) {
				return false;
			}
			if (!event.filterCard({ name: "shan", isCard: true }, player, event)) {
				return false;
			}
			if (event.name != "chooseToUse" && !lib.filter.cardRespondable({ name: "shan", isCard: true }, player, event)) {
				return false;
			}
			return true;
		},
		delay: false,
		checkx(player) {
			if (get.attitude(player, _status.currentPhase) > 0) {
				return true;
			}
			var nh = _status.currentPhase.countCards("h") + 1;
			var players = game.filterPlayer();
			for (var i = 0; i < players.length; i++) {
				if (players[i].countCards("h") >= nh) {
					if (!player.countCards("h", "shan") || get.attitude(player, players[i]) <= 0) {
						return true;
					}
				}
			}
			return false;
		},
		async content(event, trigger, player) {
			player.line(_status.currentPhase, "green");
			await _status.currentPhase.draw();
			const evt = event.getParent(2);
			if (evt == null) {
				return;
			}
			if (_status.currentPhase.isMaxHandcard(true)) {
				evt.set("shifei", true);
				evt.goto(0);
				return;
			}
			const targets = game.filterPlayer(current => current.isMaxHandcard());
			let target;
			if (targets.length == 1) {
				target = targets[0];
			} else if (targets.length) {
				const result = await player
					.chooseTarget({
						prompt: "选择一名角色弃置其一张牌",
						filterTarget(card, player, target) {
							return get.event().targets.includes(target);
						},
						forced: true,
						ai(target) {
							return -get.attitude(_status.event.player, target);
						},
					})
					.set("targets", targets)
					.forResult();
				if (result.targets?.length) {
					target = result.targets[0];
				}
			}
			if (target) {
				player.line(target, "green");
				await player.discardPlayerCard({
					target,
					position: "he",
					forced: true,
				});
				evt.result = { bool: true, card: { name: "shan", isCard: true }, cards: [] };
				evt.redo();
				return;
			}
			evt.set("shifei", true);
			evt.goto(0);
		},
		ai: {
			respondShan: true,
			effect: {
				target_use(card, player, target, current) {
					if (get.tag(card, "respondShan") && current < 0) {
						var nh = player.countCards("h");
						var players = game.filterPlayer();
						for (var i = 0; i < players.length; i++) {
							if (players[i].countCards("h") > nh) {
								return 0.4;
							}
						}
					}
				},
			},
			order: 8,
			result: {
				player(player) {
					return lib.skill.shifei.checkx(player) ? 1 : 0;
				},
			},
		},
	},
	huaiyi: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		delay: false,
		filter(event, player) {
			return player.countCards("h") > 0;
		},
		async content(event, trigger, player) {
			await player.showHandcards();

			const hs = player.getCards("h");
			const color = get.color(hs[0], player);
			if (hs.length === 1 || !hs.some((card, index) => index > 0 && get.color(card) !== color)) {
				return;
			}

			const colors = [];
			const bannedList = [];
			const indexs = Object.keys(lib.color);
			for (const card of player.getCards("h")) {
				const color = get.color(card, player);
				colors.add(color);
				if (!lib.filter.cardDiscardable(card, player, "huaiyi")) {
					bannedList.add(color);
				}
			}
			colors.removeArray(bannedList);
			colors.sort((a, b) => indexs.indexOf(a) - indexs.indexOf(b));

			let result;
			if (!colors.length) {
				return;
			}
			if (colors.length === 1) {
				result = { control: colors[0] };
			} else {
				result = await player
					.chooseControl({
						controls: colors.map(color => `${color}2`),
						prompt: "请选择弃置一种颜色的所有手牌",
						ai() {
							const player = get.player();
							if (player.countCards("h", { color: "red" }) == 1 && player.countCards("h", { color: "black" }) > 1) {
								return 1;
							}
							return 0;
						},
					})
					.forResult();
			}

			const control = result.control.slice(0, result.control.length - 1);
			const cards = player.getCards("h", { color: control });
			const num = cards.length;
			await player.discard({ cards });

			result = await player
				.chooseTarget({
					prompt: `请选择至多${get.cnNumber(num)}名有牌的其他角色，获得这些角色的各一张牌。`,
					filterTarget(card, player, target) {
						return target !== player && target.countCards("he") > 0;
					},
					selectTarget: [1, num],
					ai(target) {
						return -get.attitude(get.player(), target) + 0.5;
					},
				})
				.forResult();
			if (!result.bool || !result.targets?.length) {
				return;
			}
			const targets = result.targets;
			player.line(targets, "green");
			let gained = 0;
			for (const target of targets.sortBySeat()) {
				if (!player.isIn() || !target.countCards("he")) {
					continue;
				}
				const result = await player
					.gainPlayerCard({
						target,
						position: "he",
						forced: true,
					})
					.forResult();
				if (result.bool && result.cards?.length) {
					gained += result.cards.length;
				}
			}

			if (gained > 1) {
				await player.loseHp();
			}
		},
		ai: {
			order(item, player) {
				if (player.countCards("h", { color: "red" }) == 1) {
					return 10;
				}
				if (player.countCards("h", { color: "black" }) == 1) {
					return 10;
				}
				return 1;
			},
			result: {
				player: player => {
					if (get.color(player.getCards("h")) != "none") {
						return 0;
					}
					return 1;
				},
			},
		},
	},
	yaoming: {
		audio: 2,
		trigger: { player: "damageEnd", source: "damageSource" },
		filter(event, player) {
			if (player.hasSkill("yaoming2")) {
				return false;
			}
			var nh = player.countCards("h");
			return game.hasPlayer(function (current) {
				return current.countCards("h") != nh;
			});
		},
		async cost(event, trigger, player) {
			const nh = player.countCards("h");
			event.result = await player
				.chooseTarget({
					prompt: get.prompt2("yaoming"),
					filterTarget(card, player, target) {
						return _status.event.nh != target.countCards("h");
					},
					ai(target) {
						const att = get.attitude(_status.event.player, target);
						if (target.countCards("h") > _status.event.nh) {
							return -att;
						}
						return att;
					},
				})
				.set("nh", nh)
				.forResult();
		},
		logTarget: "targets",
		async content(event, trigger, player) {
			player.addTempSkill("yaoming2");
			const target = event.targets[0];
			if (target.countCards("h") < player.countCards("h")) {
				await target.draw();
			} else {
				await target.discard({
					cards: [target.getCards("h").randomGet()],
				});
			}
		},
		ai: {
			expose: 0.2,
		},
	},
	yaoming2: {},
	anguo: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		filterTarget(card, player, target) {
			return player != target && target.countCards("e") > 0;
		},
		async content(event, trigger, player) {
			const { target } = event;
			const result = await player
				.choosePlayerCard({
					target,
					position: "e",
					forced: true,
				})
				.forResult();
			if (!result.links?.length) {
				return;
			}
			const numOld = game.filterPlayer().filter(current => target.inRange(current)).length;
			await target.gain({
				cards: result.links,
				animate: "gain2",
			});
			const numNew = game.filterPlayer().filter(current => target.inRange(current)).length;
			if (numOld > numNew) {
				await player.draw();
			}
		},
		ai: {
			order: 7,
			result: {
				target(player, target) {
					if (target.hasSkillTag("noe")) {
						return 1;
					}
					if (target.getEquip(1) || target.getEquip(4)) {
						return -1;
					}
					if (target.getEquip(2)) {
						return -0.7;
					}
					return -0.5;
				},
			},
		},
	},
	reyanzhu: {
		audio: 2,
		audioname: ["ol_sunxiu"],
		enable: "phaseUse",
		filterTarget: lib.filter.notMe,
		derivation: ["reyanzhu_rewrite", "rexingxue_rewrite"],
		prompt() {
			return lib.translate[(_status.event.player.storage.reyanzhu ? "reyanzhu_rewrite" : "reyanzhu") + "_info"];
		},
		usable: 1,
		async content(event, trigger, player) {
			const { target } = event;
			let result;
			if (player.storage.reyanzhu || !target.countCards("e")) {
				result = { index: 1 };
			} else {
				result = await target
					.chooseControl()
					.set("prompt", get.translation(player) + "发动了【宴诛】，请选择一项")
					.set("choiceList", ["将装备区内的所有牌交给" + get.translation(player) + "并令其修改技能", "弃置一张牌，并令下次受到的伤害+1直到下回合开始"])
					.set("ai", function () {
						if (_status.event.player.countCards("e") >= 3) {
							return 1;
						}
						return 0;
					})
					.forResult();
			}
			if (result.index == 0) {
				await target.give(target.getCards("e"), player);
				player.storage.reyanzhu = true;
			} else {
				target.addTempSkill("reyanzhu2", { player: "phaseBegin" });
				target.addMark("reyanzhu2", 1, false);
				if (!player.storage.reyanzhu && target.countCards("he") > 0) {
					await target.chooseToDiscard({
						position: "he",
						forced: true,
					});
				}
			}
		},
		ai: {
			order: 6,
			result: {
				target(player, target) {
					if (player.storage.reyanzhu) {
						return -1;
					}
					var ne = target.countCards("e");
					if (!ne) {
						return -2;
					}
					if (ne >= 2) {
						return -ne;
					}
					return 0;
				},
			},
		},
	},
	reyanzhu2: {
		charlotte: true,
		trigger: { player: "damageBegin3" },
		forced: true,
		onremove: true,
		sourceSkill: "reyanzhu",
		async content(event, trigger, player) {
			trigger.num += player.countMark("reyanzhu2");
			game.log(player, "受到的伤害+" + player.countMark("reyanzhu2"));
			player.removeSkill("reyanzhu2");
		},
		intro: {
			content: "下次受到的伤害+#直到下回合开始",
		},
	},
	rexingxue: {
		audio: 2,
		audioname: ["ol_sunxiu"],
		trigger: { player: "phaseJieshuBegin" },
		filter(event, player) {
			return (player.storage.reyanzhu ? player.maxHp : player.hp) > 0;
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget({
					prompt: get.prompt("rexingxue"),
					prompt2: "令所有目标角色依次摸一张牌，然后所有手牌数大于体力值的目标角色依次将一张牌置于牌堆顶",
					selectTarget: [1, player.storage.reyanzhu ? player.maxHp : player.hp],
					ai(target) {
						let att = get.attitude(player, target);
						if (target.countCards("h") == target.hp - 1) {
							att *= 2;
						}
						return att;
					},
				})
				.forResult();
		},
		logTarget: "targets",
		async content(event, trigger, player) {
			const { targets } = event;
			targets.sortBySeat();

			await game.asyncDraw(targets);
			await game.delay();

			for (const target of targets) {
				if (target.isDead()) {
					continue;
				}
				if (!(target.isIn() && target.countCards("h") && target.countCards("h") > target.hp)) {
					continue;
				}

				const result = await target
					.chooseCard({
						prompt: "将一张牌置于牌堆顶",
						position: "he",
						forced: true,
					})
					.forResult();
				if (!result.bool || !result?.cards.length) {
					continue;
				}

				const card = result.cards[0];
				game.log(target, "将", get.position(card) == "h" ? "一张牌" : card, "置于牌堆顶");
				await target.lose({
					cards: result.cards,
					position: ui.cardPile,
					insert_card: true,
				});
				game.broadcastAll(current => {
					const cardx = ui.create.card();
					cardx.classList.add("infohidden");
					cardx.classList.add("infoflip");
					current.$throw(cardx, 1000, "nobroadcast");
				}, target);
			}
		},
	},
	rezhaofu: {
		locked: true,
		global: "rezhaofu2",
		zhuSkill: true,
	},
	rezhaofu2: {
		mod: {
			inRangeOf(from, to) {
				if (from.group != "wu") {
					return;
				}
				var players = game.filterPlayer();
				for (var i = 0; i < players.length; i++) {
					if (from != players[i] && to != players[i] && players[i].hasZhuSkill("rezhaofu", from)) {
						if (players[i].inRange(to)) {
							return true;
						}
					}
				}
			},
		},
	},
	zhaofu: {
		audio: 2,
		audioname: ["ol_sunxiu"],
		global: "zhaofu2",
		zhuSkill: true,
		locked: true,
	},
	zhaofu2: {
		mod: {
			inRangeOf(from, to) {
				if (from.group != "wu") {
					return;
				}
				var players = game.filterPlayer();
				for (var i = 0; i < players.length; i++) {
					if (from != players[i] && to != players[i] && players[i].hasZhuSkill("zhaofu", from)) {
						if (get.distance(players[i], to) <= 1) {
							return true;
						}
					}
				}
			},
		},
	},
	xingxue: {
		audio: 2,
		trigger: { player: "phaseJieshuBegin" },
		direct: true,
		async content(event, trigger, player) {
			let num = player.hp;
			if (!player.hasSkill("yanzhu")) {
				num = player.maxHp;
			}
			const { targets, bool } = await player
				.chooseTarget([1, num], get.prompt2("xingxue"))
				.set("ai", function (target) {
					const att = get.attitude(_status.event.player, target);
					if (target.countCards("he")) {
						return att;
					}
					return att / 10;
				})
				.forResult();
			if (bool) {
				player.logSkill("xingxue", targets);
				const chooseToPutCard = async function (target) {
					await target.draw();
					if (target.countCards("he")) {
						const { cards, bool } = await target.chooseCard("选择一张牌置于牌堆顶", "he", true).forResult();
						if (bool) {
							await target.lose(cards, ui.cardPile, "insert");
						}
						game.broadcastAll(function (player) {
							const cardx = ui.create.card();
							cardx.classList.add("infohidden");
							cardx.classList.add("infoflip");
							player.$throw(cardx, 1000, "nobroadcast");
						}, target);
						if (player == game.me) {
							await game.delay(0.5);
						}
					}
				};
				await game.doAsyncInOrder(targets, chooseToPutCard);
			}
		},
	},
	yanzhu: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		filterTarget(card, player, target) {
			return target.countCards("he") > 0 && target != player;
		},
		async content(event, trigger, player) {
			const { target } = event;
			let result;
			if (target.countCards("e")) {
				result = await target
					.chooseBool({
						prompt: "是否将装备区内的所有牌交给" + get.translation(player) + "？",
						ai() {
							if (_status.event.player.countCards("e") >= 3) {
								return false;
							}
							return true;
						},
					})
					.forResult();
			} else {
				await target.chooseToDiscard({
					position: "he",
					forced: true,
				});
				return;
			}
			if (result.bool) {
				const es = target.getCards("e");
				await target.give(es, player, true);
				player.removeSkills("yanzhu");
			} else {
				await target.chooseToDiscard({
					position: "he",
					forced: true,
				});
			}
		},
		ai: {
			order: 6,
			result: {
				target(player, target) {
					var ne = target.countCards("e");
					if (!ne) {
						return -2;
					}
					if (ne >= 2) {
						return -ne;
					}
					return 0;
				},
			},
		},
	},
	shizhi: {
		mod: {
			cardname(card, player, name) {
				if (card.name == "shan" && player.hp == 1) {
					return "sha";
				}
			},
		},
		ai: {
			skillTagFilter(player) {
				if (!player.countCards("h", "shan")) {
					return false;
				}
				if (player.hp != 1) {
					return false;
				}
			},
			respondSha: true,
			neg: true,
		},
		audio: 2,
		trigger: { player: ["useCard1", "respond"] },
		firstDo: true,
		forced: true,
		filter(event, player) {
			return event.card.name == "sha" && !event.skill && event.cards.length == 1 && event.cards[0].name == "shan";
		},
		async content(event, trigger, player) {},
	},
	wurong: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return player.countCards("h") > 0;
		},
		filterTarget(card, player, target) {
			return target.countCards("h") > 0 && target != player;
		},
		async content(event, trigger, player) {
			const { target } = event;
			if (target.countCards("h") == 0 || player.countCards("h") == 0) {
				return;
			}

			const sendback = () => {
				if (_status.event !== event) {
					return () => {
						event.resultOL = _status.event.resultOL;
					};
				}
			};
			if (player.isOnline()) {
				player.wait(sendback);
				event.ol = true;
				player.send(() => {
					game.me
						.chooseCard(true)
						.set("glow_result", true)
						.set("ai", () => Math.random());
					game.resume();
				});
			} else {
				event.localPlayer = true;
				const result = await player
					.chooseCard(true)
					.set("glow_result", true)
					.set("ai", () => Math.random())
					.forResult();
				event.card1 = result.cards[0];
			}
			if (target.isOnline()) {
				target.wait(sendback);
				event.ol = true;
				target.send(() => {
					const rand = Math.random() < 0.4;
					game.me
						.chooseCard(true)
						.set("glow_result", true)
						.set("ai", card => {
							if (rand) {
								return card.name == "shan" ? 1 : 0;
							}
							return card.name == "shan" ? 0 : 1;
						});
					game.resume();
				});
			} else {
				event.localTarget = true;
				const rand = Math.random() < 0.4;
				const result = await target
					.chooseCard(true)
					.set("glow_result", true)
					.set("ai", card => {
						if (rand) {
							return card.name == "shan" ? 1 : 0;
						}
						return card.name == "shan" ? 0 : 1;
					})
					.forResult();
				event.card2 = result.cards[0];
			}

			if (!event.resultOL && event.ol) {
				await game.pause();
			}
			try {
				if (!event.card1) {
					event.card1 = event.resultOL[player.playerid].cards[0];
				}
				if (!event.card2) {
					event.card2 = event.resultOL[target.playerid].cards[0];
				}
				if (!event.card1 || !event.card2) {
					throw new Error("err");
				}
			} catch (e) {
				console.log(e);
				return;
			}
			game.broadcastAll(
				(card1, card2) => {
					card1.classList.remove("glow");
					card2.classList.remove("glow");
				},
				event.card1,
				event.card2
			);

			game.broadcastAll(() => {
				ui.arena.classList.add("thrownhighlight");
			});
			game.addVideo("thrownhighlight1");
			player.$compare(event.card1, target, event.card2);
			await game.delay(4);

			let next = game.createEvent("showCards");
			next.player = player;
			next.cards = [event.card1];
			next.setContent("emptyEvent");
			game.log(player, "展示了", event.card1);
			await next;

			next = game.createEvent("showCards");
			next.player = target;
			next.cards = [event.card2];
			next.setContent("emptyEvent");
			game.log(target, "展示了", event.card2);
			await next;

			const name1 = get.name(event.card1);
			const name2 = get.name(event.card2);
			if (name1 == "sha" && name2 != "shan") {
				await player.discard(event.card1).set("animate", false);
				target.$gain2(event.card2);
				const clone = event.card1.clone;
				if (clone) {
					clone.style.transition = "all 0.5s";
					clone.style.transform = "scale(1.2)";
					clone.delete();
					game.addVideo("deletenode", player, get.cardsInfo([clone]));
				}
				game.broadcast(card => {
					const clone = card.clone;
					if (clone) {
						clone.style.transition = "all 0.5s";
						clone.style.transform = "scale(1.2)";
						clone.delete();
					}
				}, event.card1);
				await target.damage("nocard");
			} else if (name1 != "sha" && name2 == "shan") {
				await player.discard(event.card1).set("animate", false);
				target.$gain2(event.card2);
				const clone = event.card1.clone;
				if (clone) {
					clone.style.transition = "all 0.5s";
					clone.style.transform = "scale(1.2)";
					clone.delete();
					game.addVideo("deletenode", player, get.cardsInfo([clone]));
				}
				game.broadcast(card => {
					const clone = card.clone;
					if (clone) {
						clone.style.transition = "all 0.5s";
						clone.style.transform = "scale(1.2)";
						clone.delete();
					}
				}, event.card1);
				await player.gainPlayerCard(target, true, "he");
			} else {
				player.$gain2(event.card1);
				target.$gain2(event.card2);
			}
			game.broadcastAll(() => {
				ui.arena.classList.remove("thrownhighlight");
			});
			game.addVideo("thrownhighlight2");
		},
		ai: {
			order: 6,
			result: {
				target: -1,
			},
		},
	},
	zhanjue: {
		audio: 2,
		enable: "phaseUse",
		filterCard: true,
		selectCard: -1,
		position: "h",
		filter(event, player) {
			if (player.getStat().skill.zhanjue_draw && player.getStat().skill.zhanjue_draw >= 2) {
				return false;
			}
			var hs = player.getCards("h");
			if (!hs.length) {
				return false;
			}
			for (var i = 0; i < hs.length; i++) {
				var mod2 = game.checkMod(hs[i], player, "unchanged", "cardEnabled2", player);
				if (mod2 === false) {
					return false;
				}
			}
			return true;
		},
		viewAs: { name: "juedou" },
		group: ["zhanjue4"],
		ai: {
			damage: true,
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
			effect: {
				player_use(card, player, target) {
					if (_status.event.skill == "zhanjue") {
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
							return;
						}
						if (player.countCards("h") >= 3 || target.countCards("h") >= 3) {
							return "zeroplayertarget";
						}
						if (player.countCards("h", "tao")) {
							return "zeroplayertarget";
						}
						if (target.countCards("h", "sha") > 1) {
							return "zeroplayertarget";
						}
					}
				},
			},
			nokeep: true,
			skillTagFilter(player, tag, arg) {
				if (tag === "nokeep") {
					return (!arg || (arg.card && get.name(arg.card) === "tao")) && player.isPhaseUsing() && get.skillCount("zhanjue_draw") < 2 && player.hasCard(card => get.name(card) != "tao", "h");
				}
			},
		},
	},
	zhanjue2: {
		audio: false,
		trigger: { player: "phaseBefore" },
		silent: true,
		sourceSkill: "zhanjue",
		async content(event, trigger, player) {
			player.storage.zhanjue = 0;
		},
	},
	zhanjue3: {
		audio: false,
		trigger: { player: "damageAfter", source: "damageAfter" },
		forced: true,
		popup: false,
		sourceSkill: "zhanjue",
		filter(event, player) {
			return event.parent.skill == "zhanjue";
		},
		async content(event, trigger, player) {
			trigger.player.addTempSkill("zhanjue5");
		},
	},
	zhanjue4: {
		audio: false,
		trigger: { player: "useCardAfter" },
		forced: true,
		popup: false,
		sourceSkill: "zhanjue",
		filter(event, player) {
			return event.skill == "zhanjue";
		},
		async content(event, trigger, player) {
			const stat = player.getStat().skill;
			stat.zhanjue_draw ??= 0;
			++stat.zhanjue_draw;
			await player.draw({ nodelay: true });
			const list = game.filterPlayer(current => {
				if (current.getHistory("damage", evt => evt.card === trigger.card).length > 0) {
					if (current === player) {
						stat.zhanjue_draw++;
					}
					return true;
				}
				return false;
			});
			if (list.length) {
				list.sortBySeat();
				await game.asyncDraw(list);
			}
			await game.delay();
		},
	},
	zhanjue5: {},
	qinwang: {
		audio: "qinwang1",
		group: ["qinwang1"],
		zhuSkill: true,
		filter(event, player) {
			if (
				!player.hasZhuSkill("qinwang") ||
				!game.hasPlayer(function (current) {
					return current != player && current.group == "shu";
				}) ||
				!player.countCards("he")
			) {
				return false;
			}
			return !event.jijiang && (event.type != "phase" || !player.hasSkill("jijiang3"));
		},
		enable: ["chooseToUse", "chooseToRespond"],
		viewAs: {
			name: "sha",
			cards: [],
			suit: "none",
			number: null,
			isCard: true,
		},
		filterCard: lib.filter.cardDiscardable,
		position: "he",
		check(card) {
			var player = _status.event.player,
				players = game.filterPlayer();
			if (player.hasSkill("qinwang_ai")) {
				return false;
			}
			for (var i = 0; i < players.length; i++) {
				var nh = players[i].countCards("h");
				if (players[i] != player && players[i].group == "shu" && get.attitude(players[i], player) > 2 && nh >= 3 && players[i].countCards("h", "sha")) {
					return 5 - get.value(card);
				}
			}
			return 0;
		},
		ai: {
			order() {
				return get.order({ name: "sha" }) - 0.3;
			},
			respondSha: true,
			skillTagFilter(player) {
				if (
					!player.hasZhuSkill("qinwang") ||
					!game.hasPlayer(function (current) {
						return current != player && current.group == "shu";
					}) ||
					!player.countCards("he")
				) {
					return false;
				}
			},
		},
	},
	qinwang1: {
		audio: 2,
		trigger: { player: ["useCardBegin", "respondBegin"] },
		logTarget: "targets",
		sourceSkill: "qinwang",
		filter(event, player) {
			return event.skill == "qinwang";
		},
		forced: true,
		async content(event, trigger, player) {
			delete trigger.skill;
			delete trigger.card.cards;
			await player.discard(trigger.cards);
			delete trigger.cards;
			trigger.getParent().set("jijiang", true);
			let current = player.next;
			while (current != player) {
				if (current.group != "shu") {
					current = current.next;
					continue;
				}
				const next = current
					.chooseToRespond({
						prompt: "是否替" + get.translation(player) + "打出一张杀？",
						card: get.autoViewAs({ name: "sha" }),
						ai() {
							const event = get.event();
							return get.attitude(event.player, event.source) - 2;
						},
					})
					.set("source", player)
					.set("jijiang", true)
					.set("skillwarn", "替" + get.translation(player) + "打出一张杀");
				next.noOrdering = true;
				next.autochoose = lib.filter.autoRespondSha;
				const result = await next.forResult();
				if (result.bool) {
					await current.draw();
					trigger.card = result.card;
					trigger.cards = result.cards;
					trigger.throw = false;
					if (typeof current.ai.shown == "number" && current.ai.shown < 0.95) {
						current.ai.shown += 0.3;
						if (current.ai.shown > 0.95) {
							current.ai.shown = 0.95;
						}
					}
					return;
				}
				current = current.next;
			}
			player.addTempSkill("jijiang3");
			player.addTempSkill("qinwang_ai");
			trigger.cancel();
			trigger.getParent().goto(0);
		},
	},
	qinwang_ai: {},
	zuoding: {
		audio: 2,
		audioname: ["re_zhongyao"],
		trigger: { global: "useCardToPlayered" },
		filter(event, player) {
			if (event.getParent().triggeredTargets3.length > 1) {
				return false;
			}
			return (
				get.suit(event.card) == "spade" &&
				_status.currentPhase == event.player &&
				event.targets &&
				event.targets.length &&
				event.player != player &&
				game.countPlayer2(function (current) {
					return current.getHistory("damage").length > 0;
				}) == 0
			);
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget({
					prompt: get.prompt("zuoding"),
					prompt2: "令一名目标角色摸一张牌",
					filterTarget(card, player, target) {
						return get.event().targets.includes(target);
					},
					ai(target) {
						return get.attitude(get.event().player, target);
					},
				})
				.set("targets", trigger.targets)
				.forResult();
		},
		logTarget: "targets",
		async content(event, trigger, player) {
			await event.targets[0].draw();
		},
		ai: {
			expose: 0.2,
		},
		//group:'zuoding3'
	},
	zuoding2: {},
	zuoding3: {
		trigger: { global: "damage" },
		silent: true,
		sourceSkill: "zuoding",
		async content(event, trigger, player) {
			player.addTempSkill("zuoding2");
		},
	},
	huomo: {
		audio: 2,
		audioname: ["huzhao", "re_zhongyao"],
		enable: "chooseToUse",
		onChooseToUse(event) {
			if (game.online || event.huomo_list) {
				return;
			}
			var list = lib.skill.huomo.getUsed(event.player);
			event.set("huomo_list", list);
		},
		getUsed(player) {
			var list = [];
			player.getHistory("useCard", function (evt) {
				if (get.type(evt.card, null, false) == "basic") {
					list.add(evt.card.name);
				}
			});
			return list;
		},
		hiddenCard(player, name) {
			if (get.type(name) != "basic") {
				return false;
			}
			var list = lib.skill.huomo.getUsed(player);
			if (list.includes(name)) {
				return false;
			}
			return player.hasCard(function (card) {
				return get.color(card) == "black" && get.type(card) != "basic";
			}, "eh");
		},
		filter(event, player) {
			if (
				event.type == "wuxie" ||
				!player.hasCard(function (card) {
					return get.color(card) == "black" && get.type(card) != "basic";
				}, "eh")
			) {
				return false;
			}
			var list = event.huomo_list || lib.skill.huomo.getUsed(player);
			for (var name of lib.inpile) {
				if (get.type(name) != "basic" || list.includes(name)) {
					continue;
				}
				var card = { name: name, isCard: true };
				if (event.filterCard(card, player, event)) {
					return true;
				}
				if (name == "sha") {
					for (var nature of lib.inpile_nature) {
						card.nature = nature;
						if (event.filterCard(card, player, event)) {
							return true;
						}
					}
				}
			}
			return false;
		},
		chooseButton: {
			dialog(event, player) {
				var vcards = [];
				var list = event.huomo_list || lib.skill.huomo.getUsed(player);
				for (var name of lib.inpile) {
					if (get.type(name) != "basic" || list.includes(name)) {
						continue;
					}
					var card = { name: name, isCard: true };
					if (event.filterCard(card, player, event)) {
						vcards.push(["基本", "", name]);
					}
					if (name == "sha") {
						for (var nature of lib.inpile_nature) {
							card.nature = nature;
							if (event.filterCard(card, player, event)) {
								vcards.push(["基本", "", name, nature]);
							}
						}
					}
				}
				return ui.create.dialog("活墨", [vcards, "vcard"], "hidden");
			},
			check(button) {
				var player = _status.event.player;
				var card = { name: button.link[2], nature: button.link[3] };
				if (
					game.hasPlayer(function (current) {
						return player.canUse(card, current) && get.effect(current, card, player, player) > 0;
					})
				) {
					switch (button.link[2]) {
						case "tao":
							return 5;
						case "jiu":
							return 3.01;
						case "sha":
							if (button.link[3] == "fire") {
								return 2.95;
							} else if (button.link[3] == "thunder") {
								return 2.92;
							} else {
								return 2.9;
							}
						case "shan":
							return 1;
					}
				}
				return 0;
			},
			backup(links, player) {
				return {
					check(card) {
						return 1 / Math.max(0.1, get.value(card));
					},
					filterCard(card) {
						return get.type(card) != "basic" && get.color(card) == "black";
					},
					viewAs: {
						name: links[0][2],
						nature: links[0][3],
						suit: "none",
						number: null,
						isCard: true,
					},
					position: "he",
					popname: true,
					ignoreMod: true,
					async precontent(event, trigger, player) {
						player.logSkill("huomo");
						const card = event.result.cards[0];
						game.log(player, "将", card, "置于牌堆顶");
						await player.loseToDiscardpile(card, ui.cardPile, "visible", "insert").set("log", false);
						const viewAs = {
							name: event.result.card.name,
							nature: event.result.card.nature,
							isCard: true,
						};
						event.result.card = viewAs;
						event.result.cards = [];
					},
				};
			},
			prompt(links, player) {
				return "将一张黑色非基本牌置于牌堆顶并视为使用一张" + get.translation(links[0][3] || "") + get.translation(links[0][2]);
			},
		},
		ai: {
			order() {
				var player = _status.event.player;
				var event = _status.event;
				var list = lib.skill.huomo.getUsed(player);
				if (!list.includes("jiu") && event.filterCard({ name: "jiu" }, player, event) && get.effect(player, { name: "jiu" }) > 0) {
					return 3.1;
				}
				return 2.9;
			},
			respondSha: true,
			fireAttack: true,
			respondShan: true,
			skillTagFilter(player, tag, arg) {
				if (tag == "fireAttack") {
					return true;
				}
				if (
					player.hasCard(function (card) {
						return get.color(card) == "black" && get.type(card) != "basic";
					}, "he")
				) {
					if (arg === "respond") {
						return false;
					}
					var list = lib.skill.huomo.getUsed(player);
					if (tag == "respondSha") {
						if (list.includes("sha")) {
							return false;
						}
					} else if (tag == "respondShan") {
						if (list.includes("shan")) {
							return false;
						}
					}
				} else {
					return false;
				}
			},
			result: {
				player: 1,
			},
		},
	},
	taoxi: {
		audio: "qingxi",
		trigger: { player: "useCardToPlayered" },
		check(event, player) {
			if (get.attitude(player, event.target) >= 0) {
				return false;
			}
			var cards = event.target.getCards("h");
			if (cards.filter(card => player.hasUseTarget(card)).length >= cards.length / 2) {
				return true;
			}
			return false;
		},
		filter(event, player) {
			return player.isPhaseUsing() && event.targets.length == 1 && event.target.countCards("h") > 0 && player != event.target && !player.hasSkill("taoxi_used");
		},
		logTarget: "target",
		async content(event, trigger, player) {
			const result = await player
				.choosePlayerCard({
					target: trigger.target,
					position: "h",
					forced: true,
				})
				.forResult();
			if (result.bool && result.links?.length) {
				const card = result.links[0];
				await player.showCards(card, get.translation(player) + "对" + get.translation(trigger.target) + "发动了【讨袭】");
				if (!player.storage.taoxi_list) {
					player.storage.taoxi_list = [[], []];
				}
				if (!player.storage.taoxi_list[1].some(i => i._cardid == card.cardid)) {
					const cardx = ui.create.card();
					cardx.init(get.cardInfo(card));
					cardx._cardid = card.cardid;
					player.directgains([cardx], null, "taoxi");
					player.storage.taoxi_list[0].push(trigger.target);
					player.storage.taoxi_list[1].push(cardx);
					player.markSkill("taoxi_list");
					player.addTempSkill("taoxi_list");
					player.addTempSkill("taoxi_use");
					player.addTempSkill("taoxi_used", "phaseUseAfter");
				}
			}
		},
		subSkill: {
			used: {},
			use: {
				trigger: { player: "useCardBefore" },
				charlotte: true,
				forced: true,
				popup: false,
				firstDo: true,
				group: "taoxi_lose",
				filter(event, player) {
					if (!player.storage.taoxi_list || !player.storage.taoxi_list.length) {
						return false;
					}
					var list = player.storage.taoxi_list[1];
					return (
						event.cards &&
						event.cards.some(card => {
							return list.includes(card);
						})
					);
				},
				async content(event, trigger, player) {
					const cards = [];
					const list = player.storage.taoxi_list;
					for (const card of trigger.cards) {
						let bool = false;
						for (const [i, owner] of list[0].entries()) {
							if (list[1][i] == card) {
								const cardid = card._cardid;
								const cardx = owner.getCards("h", cardxx => cardxx.cardid == cardid)[0];
								if (cardx && get.position(cardx) == "h") {
									cards.push(cardx);
									owner.$throw(cardx);
									bool = true;
									break;
								}
							}
						}
						if (!bool) {
							cards.push(card);
						}
					}
					trigger.cards = cards;
					trigger.card.cards = cards;
					trigger.throw = false;
				},
				mod: {
					aiOrder(player, card, num) {
						var list = player.storage.taoxi_list;
						if (!list || !list[1]) {
							return;
						}
						if (list[1].includes(card)) {
							return num + 0.5;
						}
					},
					cardEnabled2(card) {
						if (get.itemtype(card) == "card" && card.hasGaintag("taoxi") && _status.event.name == "chooseToRespond") {
							return false;
						}
					},
				},
				ai: {
					effect: {
						player_use(card, player, target) {
							var list = player.storage.taoxi_list;
							if (!list || !list[1]) {
								return;
							}
							if (list[1].includes(card)) {
								return [1, 1];
							}
						},
					},
				},
			},
			lose: {
				trigger: {
					global: ["loseEnd", "equipEnd", "addJudgeEnd", "gainEnd", "loseAsyncEnd", "addToExpansionEnd"],
				},
				charlotte: true,
				forced: true,
				popup: false,
				firstDo: true,
				filter(event, player) {
					var list = player.storage.taoxi_list;
					if (!list || !list[0].length) {
						return false;
					}
					return game.hasPlayer(function (current) {
						if (!list[0].includes(current)) {
							return;
						}
						var evt = event.getl(current);
						if (
							evt &&
							evt.hs &&
							evt.hs.some(card => {
								return list[1].some(i => i._cardid == card.cardid);
							})
						) {
							return true;
						}
						return false;
					});
				},
				async content(event, trigger, player) {
					const list = player.storage.taoxi_list;
					const targets = game.filterPlayer(function (current) {
						if (!list[0].includes(current)) {
							return;
						}
						const evt = trigger.getl(current);
						if (
							evt &&
							evt.hs &&
							evt.hs.some(card => {
								return list[1].some(i => i._cardid == card.cardid);
							})
						) {
							return true;
						}
						return false;
					});
					for (const target of targets) {
						const hs = trigger.getl(target).hs;
						for (let i = 0; i < list[0].length; i++) {
							if (hs.some(j => j.cardid == list[1][i]._cardid)) {
								if (player.isOnline2()) {
									player.send(
										function (list, i) {
											game.me.storage.taoxi_list = list;
											list[1][i].delete();
											list[0].splice(i, 1);
											list[1].splice(i, 1);
										},
										player.storage.taoxi_list,
										i
									);
								}
								list[1][i].delete();
								list[0].splice(i, 1);
								list[1].splice(i, 1);
								i--;
							}
						}
					}
				},
			},
			list: {
				audio: "qingxi",
				trigger: { player: "phaseEnd" },
				charlotte: true,
				forced: true,
				onremove(player) {
					game.broadcastAll(function (player) {
						player.storage.taoxi_list[1].forEach(i => i.delete());
						delete player.storage.taoxi_list;
					}, player);
				},
				filter(event, player) {
					return player.storage.taoxi_list && player.storage.taoxi_list[0].length > 0;
				},
				async content(event, trigger, player) {
					player.loseHp();
				},
			},
		},
	},
	xingshuai: {
		skillAnimation: true,
		animationColor: "thunder",
		audio: 2,
		audioname2: {
			re_caorui: "rexingshuai",
		},
		trigger: { player: "dying" },
		zhuSkill: true,
		filter(event, player) {
			if (player.hp > 0) {
				return false;
			}
			if (!player.hasZhuSkill("xingshuai")) {
				return false;
			}
			return game.hasPlayer(function (current) {
				return current != player && current.group == "wei";
			});
		},
		limited: true,
		async content(event, trigger, player) {
			player.awakenSkill(event.name);
			const phaseTargets = game.filterPlayer(current => current !== player && current.group === "wei");
			const damages = [];
			for (const current of phaseTargets) {
				if (current.group != "wei") {
					continue;
				}
				const result = await current
					.chooseBool({
						prompt: `是否令${get.translation(player)}回复1点体力？`,
						ai() {
							const { player, target } = get.event();
							return get.attitude(player, target) > 2;
						},
					})
					.set("target", player)
					.forResult();

				if (result.bool) {
					damages.push(current);
					current.line(player, "green");
					game.log(current, "令", player, "回复1点体力");
					await player.recover({ source: current });
				}
			}
			if (damages.length) {
				const next = game.createEvent("xingshuai_next");
				event.next.remove(next);
				trigger.after.push(next);
				next.targets = damages;
				next.setContent(async event => {
					for (const target of event.targets) {
						await target.damage();
					}
				});
			}
		},
	},
	mingjian: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		filterTarget(card, player, target) {
			return player != target;
		},
		filter(event, player) {
			return player.countCards("h") > 0;
		},
		filterCard: true,
		selectCard: -1,
		discard: false,
		lose: false,
		delay: false,
		async content(event, trigger, player) {
			const { cards, target } = event;
			player.give(cards, target);
			target.addTempSkill("mingjian2", { player: "phaseAfter" });
			target.storage.mingjian2++;
			target.updateMarks("mingjian2");
		},
		ai: {
			order: 1,
			result: {
				target(player, target) {
					if (target.hasSkillTag("nogain")) {
						return 0;
					}
					if (player.countCards("h") == player.countCards("h", "du")) {
						return -1;
					}
					if (target.hasJudge("lebu")) {
						return 0;
					}
					if (get.attitude(player, target) > 3) {
						var basis = get.threaten(target);
						if (
							player == get.zhu(player) &&
							player.hp <= 2 &&
							player.countCards("h", "shan") &&
							!game.hasPlayer(function (current) {
								return get.attitude(current, player) > 3 && current.countCards("h", "tao") > 0;
							})
						) {
							return 0;
						}
						if (target.countCards("h") + player.countCards("h") > target.hp + 2) {
							return basis * 0.8;
						}
						return basis;
					}
					return 0;
				},
			},
		},
	},
	mingjian2: {
		charlotte: true,
		mark: true,
		intro: {
			content: "手牌上限+#，出杀次数+#",
		},
		init(player, skill) {
			if (!player.storage[skill]) {
				player.storage[skill] = 0;
			}
		},
		onremove: true,
		mod: {
			maxHandcard(player, num) {
				return num + player.storage.mingjian2;
			},
			cardUsable(card, player, num) {
				if (card.name == "sha") {
					return num + player.storage.mingjian2;
				}
			},
		},
	},
	mingjian_old: {
		audio: 2,
		trigger: { player: "phaseUseBefore" },
		filter(event, player) {
			return player.countCards("h") > 0;
		},
		async cost(event, trigger, player) {
			const go = Math.random() < 0.5;
			event.result = await player
				.chooseTarget({
					prompt: get.prompt2("mingjian_old"),
					filterTarget(card, player, target) {
						return player !== target;
					},
					ai(target) {
						const att = get.attitude(player, target);
						if (att > 3) {
							if (player.countCards("h") > player.hp) {
								return att;
							}
							if (go) {
								return att;
							}
						}
						return 0;
					},
				})
				.forResult();
		},
		async content(event, trigger, player) {
			trigger.cancel();
			const target = event.targets[0];
			target.addSkill("mingjian2_old");
			const hs = player.getCards("h");
			await player.give(hs, target);
		},
	},
	mingjian2_old: {
		audio: false,
		trigger: { global: "phaseAfter" },
		forced: true,
		popup: false,
		charlotte: true,
		sourceSkill: "mingjian_old",
		async content(event, trigger, player) {
			if (lib.config.glow_phase) {
				if (_status.currentPhase) {
					_status.currentPhase.classList.remove("glow_phase");
				}
				player.classList.add("glow_phase");
			}
			game.addVideo("phaseChange", player);
			_status.currentPhase = player;
			player.ai.tempIgnore = [];
			player.stat.push({ card: {}, skill: {} });
			player.phaseUse();
			player.removeSkill("mingjian2_old");
		},
	},
	huituo: {
		audio: 2,
		audioname: ["re_caorui"],
		trigger: { player: "damageEnd" },
		direct: true,
		async content(event, trigger, player) {
			const forced = event.forced === undefined ? false : event.forced;
			const info = get.skillInfoTranslation("huituo", player, false);
			const str = `###${forced ? "恢拓：请选择一名角色" : get.prompt("huituo")}###令一名角色判定。若结果为红色，其回复1点体力；若结果为黑色，其摸${get.cnNumber(trigger.num)}张牌`;
			let result = await player
				.chooseTarget(str, event.forced)
				.set("ai", function (target) {
					const player = get.player();
					if (get.attitude(player, target) > 0) {
						return get.recoverEffect(target, player, player) + 1;
					}
					return 0;
				})
				.forResult();
			if (result?.bool) {
				player.logSkill(event.name, result.targets);
				const target = result.targets[0];
				event.target = target;
				result = await target
					.judge(card => {
						if (target.isDamaged()) {
							if (get.color(card) == "red") {
								return -1;
							}
						}
						if (get.color(card) == "red") {
							return 1;
						}
						return 0;
					})
					.forResult();
				switch (result?.color) {
					case "red":
						await event.target.recover();
						break;

					case "black":
						await event.target.draw(trigger.num);
						break;

					default:
						break;
				}
			}
		},
		ai: {
			maixie: true,
			maixie_hp: true,
		},
	},
	duodao: {
		audio: 2,
		trigger: { player: "damageEnd" },
		filter(event, player) {
			return player.countCards("he") > 0 && event.source && event.card && event.card.name == "sha";
		},
		async cost(event, trigger, player) {
			let prompt = "弃置一张牌，然后",
				cards = trigger.source.getEquips(1).filter(card => {
					return lib.filter.canBeGained(card, player, trigger.source);
				});
			if (cards.length) {
				prompt += "获得" + get.translation(trigger.source) + "装备区中的" + get.translation(cards);
			} else {
				prompt += "无事发生";
			}
			event.result = await player
				.chooseToDiscard("he", get.prompt(event.skill, trigger.source), prompt)
				.set("ai", function (card) {
					let eff = get.event().eff;
					if (typeof eff === "number") {
						return eff - get.value(card);
					}
					return 0;
				})
				.set(
					"eff",
					(function () {
						let es = trigger.source.getEquips(1).filter(card => {
							return lib.filter.canBeGained(card, player, trigger.source);
						});
						if (!es.length) {
							return false;
						}
						if (get.attitude(player, trigger.source) > 0) {
							return (
								-2 *
								es.reduce((acc, card) => {
									return acc + get.value(card, trigger.source);
								}, 0)
							);
						}
						return es.reduce((acc, card) => {
							return acc + get.value(card, player);
						}, 0);
					})()
				)
				.forResult();
		},
		logTarget: "source",
		async content(event, trigger, player) {
			const cards = trigger.source.getEquips(1).filter(card => {
				return lib.filter.canBeGained(card, player, trigger.source);
			});
			if (cards.length) {
				player.gain(cards, trigger.source, "give", "bySelf");
			}
		},
		ai: {
			maixie_defend: true,
		},
	},
	reanjian: {
		trigger: { player: "useCardToPlayered" },
		forced: true,
		audio: 2,
		filter(event, player) {
			return event.card.name == "sha" && !event.target.inRange(player);
		},
		logTarget: "target",
		async content(event, trigger, player) {
			trigger.getParent().reanjian_buffed = true;
			const map = trigger.customArgs;
			const id = trigger.target.playerid;
			if (!map[id]) {
				map[id] = {};
			}
			if (!map[id].extraDamage) {
				map[id].extraDamage = 0;
			}
			map[id].extraDamage++;
			trigger.target.addTempSkill("reanjian2");
			trigger.target.addTempSkill("reanjian4");
			trigger.target.storage.reanjian2.add(trigger.card);
		},
		ai: {
			unequip_ai: true,
			skillTagFilter(player, tag, arg) {
				if (arg && arg.name == "sha" && arg.target && !arg.target.inRange(player)) {
					return true;
				}
				return false;
			},
		},
	},
	reanjian2: {
		firstDo: true,
		sourceSkill: "reanjian",
		ai: { unequip2: true },
		init(player, skill) {
			if (!player.storage[skill]) {
				player.storage[skill] = [];
			}
		},
		onremove: true,
		trigger: {
			player: ["damage", "damageCancelled", "damageZero"],
			target: ["shaMiss", "useCardToExcluded"],
		},
		charlotte: true,
		filter(event, player) {
			const evt = event.getParent("useCard", true, true);
			if (evt && evt.effectedCount < evt.effectCount) {
				return false;
			}
			return player.storage.reanjian2 && event.card && player.storage.reanjian2.includes(event.card);
		},
		silent: true,
		forced: true,
		popup: false,
		priority: 12,
		async content(event, trigger, player) {
			player.storage.reanjian2.remove(trigger.card);
			if (!player.storage.reanjian2.length) {
				player.removeSkill("reanjian2");
			}
		},
	},
	reanjian3: {
		mod: {
			cardSavable(card) {
				if (card.name == "tao") {
					return false;
				}
			},
		},
	},
	reanjian4: {
		trigger: { player: "dyingBegin" },
		forced: true,
		silent: true,
		firstDo: true,
		sourceSkill: "reanjian",
		filter(event, player) {
			return (event.getParent(2).reanjian_buffed = true);
		},
		async content(event, trigger, player) {
			player.addTempSkill("reanjian3", { global: ["dyingEnd", "phaseEnd"] });
		},
	},
	reduodao: {
		audio: 2,
		trigger: { target: "useCardToTargeted" },
		filter(event, player) {
			return event.card.name == "sha" && player.countCards("he") > 0;
		},
		async cost(event, trigger, player) {
			let prompt = "弃置一张牌，然后",
				cards = trigger.player.getEquips(1).filter(card => {
					return lib.filter.canBeGained(card, player, trigger.player);
				});
			if (cards.length) {
				prompt += "获得" + get.translation(trigger.player) + "装备区中的" + get.translation(cards);
			} else {
				prompt += "无事发生";
			}
			event.result = await player
				.chooseToDiscard("he", get.prompt(event.skill, trigger.player), prompt)
				.set("ai", function (card) {
					let eff = get.event().eff;
					if (typeof eff === "number") {
						return eff - get.value(card);
					}
					return 0;
				})
				.set(
					"eff",
					(function () {
						let es = trigger.player.getEquips(1).filter(card => {
							return lib.filter.canBeGained(card, player, trigger.player);
						});
						if (!es.length) {
							return false;
						}
						if (get.attitude(player, trigger.player) > 0) {
							return (
								-2 *
								es.reduce((acc, card) => {
									return acc + get.value(card, trigger.player);
								}, 0)
							);
						}
						return (
							2 *
							es.reduce((acc, card) => {
								return acc + get.value(card, player);
							}, 0)
						);
					})()
				)
				.forResult();
		},
		logTarget: "player",
		async content(event, trigger, player) {
			const cards = trigger.player.getEquips(1).filter(card => {
				return lib.filter.canBeGained(card, player, trigger.player);
			});
			if (cards.length) {
				player.gain(cards, trigger.player, "give", "bySelf");
			}
		},
	},
	anjian: {
		audio: 2,
		trigger: { source: "damageBegin1" },
		check(event, player) {
			return get.attitude(player, event.player) <= 0;
		},
		forced: true,
		filter(event, player) {
			return event.getParent().name == "sha" && !event.player.inRange(player);
		},
		async content(event, trigger, player) {
			trigger.num++;
		},
	},
	xinpojun: {
		trigger: { player: "useCardToPlayered" },
		filter(event, player) {
			return event.card.name == "sha" && player.isPhaseUsing() && event.target.hp > 0 && event.target.countCards("he") > 0;
		},
		audio: "pojun",
		async cost(event, trigger, player) {
			event.result = await player
				.choosePlayerCard({
					prompt: get.prompt("xinpojun", trigger.target),
					target: trigger.target,
					selectButton: [1, Math.min(trigger.target.countCards("he"), trigger.target.hp)],
					allowChooseAll: true,
				})
				.set("forceAuto", true)
				.forResult();

			event.result.cards = event.result.links;
		},
		logTarget(event) {
			return event?.target;
		},
		async content(event, trigger, player) {
			const target = trigger.target;
			await target.addToExpansion({
				cards: event.cards,
				source: target,
				animate: "giveAuto",
				gaintag: ["xinpojun2"],
			});
			target.addSkill("xinpojun2");
		},
		ai: {
			unequip_ai: true,
			directHit_ai: true,
			skillTagFilter(player, tag, arg) {
				if (get.attitude(player, arg.target) > 0 || !player.isPhaseUsing()) {
					return false;
				}
				if (tag == "directHit_ai") {
					return arg.target.hp >= Math.max(1, arg.target.countCards("h") - 1);
				}
				if (arg && arg.name == "sha" && arg.target.getEquip(2)) {
					return true;
				}
				return false;
			},
		},
	},
	xinpojun2: {
		trigger: { global: "phaseEnd" },
		forced: true,
		popup: false,
		charlotte: true,
		sourceSkill: "xinpojun",
		filter(event, player) {
			return player.getExpansions("xinpojun2").length > 0;
		},
		async content(event, trigger, player) {
			const cards = player.getExpansions("xinpojun2");
			await player.gain({
				cards,
				animate: "draw",
			});
			game.log(player, "收回了" + get.cnNumber(cards.length) + "张“破军”牌");
			player.removeSkill("xinpojun2");
		},
		intro: {
			markcount: "expansion",
			mark(dialog, storage, player) {
				var cards = player.getExpansions("xinpojun2");
				if (player.isUnderControl(true)) {
					dialog.addAuto(cards);
				} else {
					return "共有" + get.cnNumber(cards.length) + "张牌";
				}
			},
		},
	},
	qiaoshi: {
		audio: 2,
		trigger: { global: "phaseJieshuBegin" },
		filter(event, player) {
			return event.player != player && event.player.countCards("h") == player.countCards("h") && event.player.isIn();
		},
		check(event, player) {
			return get.attitude(player, event.player) >= 0;
		},
		logTarget: "player",
		async content(event, trigger, player) {
			game.asyncDraw([trigger.player, player]);
		},
	},
	yanyu: {
		audio: 2,
		enable: "phaseUse",
		filter(event, player) {
			return player.hasCard(card => lib.skill.yanyu.filterCard(card, player), "h");
		},
		filterCard: (card, player) => get.name(card) == "sha" && player.canRecast(card),
		discard: false,
		lose: false,
		delay: false,
		async content(event, trigger, player) {
			const { cards } = event;
			player.recast(cards);
		},
		ai: {
			basic: {
				order: 1,
			},
			result: {
				player: 1,
			},
		},
		group: "yanyu2",
	},
	yanyu2: {
		trigger: { player: "phaseUseEnd" },
		filter(event, player) {
			return (
				player.getHistory("useSkill", function (evt) {
					return evt.event.getParent("phaseUse") == event && evt.skill == "yanyu";
				}).length >= 2
			);
		},
		sourceSkill: "yanyu",
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget({
					prompt: get.prompt("yanyu"),
					prompt2: "令一名男性角色摸两张牌",
					filterTarget(card, player, target) {
						return target.hasSex("male") && target !== player;
					},
					ai(target) {
						return get.attitude(_status.event.player, target);
					},
				})
				.forResult();
		},
		logTarget: "targets",
		async content(event, trigger, player) {
			await event.targets[0].draw(2);
		},
	},
	youdi: {
		audio: 2,
		trigger: { player: "phaseJieshuBegin" },
		filter(event, player) {
			return player.countCards("he") > 0;
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget({
					prompt: get.prompt("youdi"),
					filterTarget: lib.filter.notMe,
					ai(target) {
						if (!_status.event.goon) {
							return 0;
						}
						if (target.countCards("he") == 0) {
							return 0;
						}
						return -get.attitude(_status.event.player, target);
					},
				})
				.set("goon", player.countCards("h", "sha") <= player.countCards("h") / 3)
				.forResult();
		},
		async content(event, trigger, player) {
			await game.delay();
			const target = event.targets[0];

			const result = await target
				.discardPlayerCard({
					target: player,
					position: "he",
					forced: true,
				})
				.forResult();
			if (result.links?.length && result.links[0].name != "sha" && target.countGainableCards(player, "he")) {
				await player.gainPlayerCard({
					target,
					position: "he",
					forced: true,
				});
			}
		},
		ai: {
			expose: 0.2,
		},
	},
	fuhun: {
		enable: ["chooseToUse", "chooseToRespond"],
		filterCard: true,
		selectCard: 2,
		position: "hs",
		audio: 2,
		audioname: ["re_guanzhang"],
		derivation: ["new_rewusheng", "olpaoxiao"],
		viewAs: { name: "sha" },
		prompt: "将两张手牌当杀使用或打出",
		viewAsFilter(player) {
			return player.countCards("hs") > 1;
		},
		check(card) {
			if (_status.event.player.hasSkill("new_rewusheng") && get.color(card) == "red") {
				return 0;
			}
			if (_status.event.name == "chooseToRespond") {
				if (card.name == "sha") {
					return 0;
				}
				return 6 - get.useful(card);
			}
			if (_status.event.player.countCards("hs") < 4) {
				return 6 - get.useful(card);
			}
			return 7 - get.useful(card);
		},
		ai: {
			respondSha: true,
			skillTagFilter(player) {
				if (player.countCards("hs") < 2) {
					return false;
				}
			},
			order(item, player) {
				if (player.hasSkill("new_rewusheng") && player.hasSkill("olpaoxiao")) {
					return 1;
				}
				if (player.countCards("hs") < 4) {
					return 1;
				}
				return 4;
			},
		},
		group: "fuhun_effect",
		subSkill: {
			effect: {
				audio: "fuhun",
				audioname: ["re_guanzhang"],
				trigger: { source: "damageSource" },
				forced: true,
				sourceSkill: "fuhun",
				filter(event, player) {
					if (["new_rewusheng", "olpaoxiao"].every(skill => player.hasSkill(skill, null, false, false))) {
						return false;
					}
					return event.getParent().skill == "fuhun";
				},
				async content(event, trigger, player) {
					await player.addTempSkills(["new_rewusheng", "olpaoxiao"]);
				},
			},
		},
	},
	wusheng_guanzhang: { audio: 2 },
	paoxiao_guanzhang: { audio: 2 },
	fencheng: {
		skillAnimation: "epic",
		animationColor: "gray",
		audio: "xinfencheng",
		enable: "phaseUse",
		filterTarget(card, player, target) {
			return player != target;
		},
		limited: true,
		selectTarget: -1,
		line: "fire",
		async content(event, trigger, player) {
			player.awakenSkill(event.name);
			const { target } = event;
			const res = get.damageEffect(target, player, target, "fire");
			const num = Math.max(1, target.countCards("e"));
			const result = await target
				.chooseToDiscard({
					prompt: "弃置" + get.cnNumber(num) + "张牌或受到1点火焰伤害",
					selectCard: num,
					position: "he",
					allowChooseAll: true,
					ai(card) {
						const res = _status.event.res;
						const num = _status.event.num;
						const player = _status.event.player;
						if (res >= 0) {
							return -1;
						}
						if (num > 2 && player.hp > 1) {
							return -1;
						}
						if (num > 1 && player.hp > 2) {
							return -1;
						}
						if (get.position(card) == "e") {
							return 10 - get.value(card);
						}
						return 6 - get.value(card);
					},
				})
				.set("res", res)
				.set("num", num)
				.forResult();
			if (!result.bool) {
				await target.damage({ nature: "fire" });
			}
		},
		ai: {
			order: 1,
			result: {
				player(player) {
					var num = 0,
						players = game.filterPlayer();
					for (var i = 0; i < players.length; i++) {
						if (player != players[i] && get.damageEffect(players[i], player, players[i], "fire") < 0) {
							var att = get.attitude(player, players[i]);
							if (att > 0) {
								num -= Math.max(1, players[i].countCards("e"));
							} else if (att < 0) {
								num += Math.max(1, players[i].countCards("e"));
							}
						}
					}
					if (players.length < 5) {
						return num - 1;
					} else {
						return num - 2;
					}
				},
			},
		},
	},
	mieji: {
		trigger: { player: "useCard2" },
		audio: 2,
		filter(event, player) {
			if (get.type(event.card) != "trick" || get.color(event.card) != "black") {
				return false;
			}
			if (!event.targets || event.targets.length != 1) {
				return false;
			}
			var info = get.info(event.card);
			if (info.allowMultiple == false) {
				return false;
			}
			if (event.targets && !info.multitarget) {
				if (
					game.hasPlayer(function (current) {
						return !event.targets.includes(current) && lib.filter.targetEnabled2(event.card, player, current) && lib.filter.targetInRange(event.card, player, current);
					})
				) {
					return true;
				}
			}
			return false;
		},
		position: "he",
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget({
					prompt: get.prompt("mieji"),
					prompt2: "为" + get.translation(trigger.card) + "增加一个额外目标",
					filterTarget(_card, _player, target) {
						const { player, card, targets } = get.event();
						if (targets.includes(target)) {
							return false;
						}
						return lib.filter.targetEnabled2(card, player, target) && lib.filter.targetInRange(card, player, target);
					},
					ai(target) {
						const event = get.event();
						const trigger = event.getTrigger();
						const player = event.player;
						return get.effect(target, trigger.card, player, player);
					},
				})
				.set("autodelay", true)
				.set("targets", trigger.targets)
				.set("card", trigger.card)
				.forResult();
		},
		logTarget: "targets",
		async content(event, trigger, player) {
			trigger.targets.push(event.targets[0]);
		},
	},
	junxing: {
		enable: "phaseUse",
		audio: 2,
		usable: 1,
		filterCard: true,
		selectCard: [1, Infinity],
		filter(event, player) {
			return player.countCards("h") > 0;
		},
		check(card) {
			if (ui.selected.cards.length) {
				return -1;
			}
			var val = get.value(card);
			if (get.type(card) == "basic") {
				return 8 - get.value(card);
			}
			return 5 - get.value(card);
		},
		filterTarget(card, player, target) {
			return player != target;
		},
		allowChooseAll: true,
		async content(event, trigger, player) {
			const { cards, target } = event;
			const types = new Set(cards.map(card => get.type2(card, player)));
			const result = await target
				.chooseToDiscard({
					filterCard(card) {
						return !_status.event.types.has(get.type2(card));
					},
					ai(card) {
						if (_status.event.player.isTurnedOver()) {
							return -1;
						}
						return 8 - get.value(card);
					},
				})
				.set("types", types)
				.set("dialog", ["弃置一张与" + get.translation(player) + "弃置的牌类别均不同的牌，或将武将牌翻面", "hidden", cards])
				.forResult();
			if (!result.bool) {
				await target.turnOver();
				await target.draw(cards.length);
			}
		},
		ai: {
			order: 2,
			expose: 0.3,
			threaten: 1.8,
			result: {
				target(player, target) {
					if (target.hasSkillTag("noturn")) {
						return 0;
					}
					if (target.isTurnedOver()) {
						return 2;
					}
					return -1 / (target.countCards("h") + 1);
				},
			},
		},
	},
	juece: {
		audio: 2,
		audioname: ["dc_liru", "ol_liru"],
		trigger: {
			global: ["loseAfter", "equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"],
		},
		getIndex(event, player) {
			if (_status.currentPhase !== player) {
				return [];
			}
			return game.filterPlayer(current => {
				if (current === player || current.countCards("h") > 0) {
					return false;
				}
				const evt = event.getl(current);
				return evt?.hs?.length > 0;
			});
		},
		filter(event, player, _name, target) {
			return _status.currentPhase === player;
		},
		check(event, player) {
			return get.damageEffect(event.player, player, player) > 0;
		},
		async cost(event, trigger, player) {
			/** @type {Player} */
			const target = event.indexedData;

			const result = await player
				.chooseBool({
					prompt: get.prompt2("juece", target),
					ai() {
						const { player, target } = get.event();
						return get.damageEffect(target, player, player) >= 0;
					},
				})
				.set("target", target)
				.forResult();

			event.result = {
				bool: result.bool,
				targets: [target],
			};
		},
		logTarget: "targets",
		async content(event, trigger, player) {
			const target = event.targets[0];
			await target.damage();
		},
		ai: {
			threaten: 1.1,
		},
	},
	jiefan: {
		skillAnimation: true,
		animationColor: "wood",
		audio: 2,
		audioname: ["re_handang"],
		limited: true,
		enable: "phaseUse",
		filterTarget: true,
		async content(event, trigger, player) {
			const { target } = event;
			player.awakenSkill(event.name);
			const players = game.filterPlayer(current => current !== target && current.inRange(target));
			players.sortBySeat(target);
			for (const current of players) {
				current.addTempClass("target");
				player.line(current, "green");
				let shouldDraw = true;
				if (current.countCards("he") && target.isIn()) {
					const result = await current
						.chooseToDiscard({
							prompt: "弃置一张武器牌或让" + get.translation(target) + "摸一张牌",
							filterCard: get.filter({ subtype: "equip1" }),
							position: "he",
							ai(card) {
								if (get.attitude(_status.event.player, _status.event.target) < 0) {
									return 7 - get.value(card);
								}
								return -1;
							},
						})
						.set("target", target)
						.forResult();
					shouldDraw = !result.bool;
				}
				if (shouldDraw) {
					await target.draw();
				}
			}
		},
		ai: {
			order: 5,
			result: {
				target(player, target) {
					if (player.hp > 2) {
						if (game.phaseNumber < game.players.length * 2) {
							return 0;
						}
					}
					var num = 0,
						players = game.filterPlayer();
					for (var i = 0; i < players.length; i++) {
						if (players[i] != target && players[i].inRange(target)) {
							num++;
						}
					}
					return num;
				},
			},
		},
	},
	fuli: {
		skillAnimation: true,
		animationColor: "soil",
		audio: 2,
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
			await player.recoverTo(game.countGroup());
			await player.turnOver();
		},
		ai: {
			save: true,
			skillTagFilter(player, arg, target) {
				return player == target && player.storage.fuli != true;
			},
			result: {
				player: 10,
			},
			threaten(player, target) {
				if (!target.storage.fuli) {
					return 0.9;
				}
			},
		},
	},
	qianxi: {
		audio: 2,
		trigger: { player: "phaseZhunbeiBegin" },
		preHidden: true,
		async content(event, trigger, player) {
			await player.draw();
			let result = await player
				.chooseToDiscard({
					position: "he",
					forced: true,
					ai(card) {
						const player = get.player();
						if (get.color(card, player)) {
							return 7 - get.value(card, player);
						}
						return 4 - get.value(card, player);
					},
				})
				.forResult();
			if (!result.bool || !result.cards?.length) {
				return;
			}
			const color = get.color(result.cards[0], result.cards[0].original === "h" ? player : false);
			result = await player
				.chooseTarget({
					filterTarget(card, player, target) {
						return player !== target && get.distance(player, target) <= 1;
					},
					forced: true,
					ai(target) {
						return -get.attitude(_status.event.player, target);
					},
				})
				.forResult();
			if (result.bool && result.targets?.length) {
				result.targets[0].storage.qianxi2 = color;
				player.line(result.targets, "green");
				result.targets[0].addTempSkill("qianxi2");
				result.targets[0].markSkill("qianxi2");
			}
		},
		ai: {
			directHit_ai: true,
			skillTagFilter(player, tag, arg) {
				if (tag !== "directHit_ai" || !arg.target.hasSkill("qianxi2")) {
					return false;
				}
				if (arg.card.name == "sha") {
					return (
						arg.target.storage.qianxi2 == "red" &&
						(!arg.target.hasSkillTag(
							"freeShan",
							false,
							{
								player: player,
								card: arg.card,
								type: "use",
							},
							true
						) ||
							player.hasSkillTag("unequip", false, {
								name: arg.card ? arg.card.name : null,
								target: arg.target,
								card: arg.card,
							}) ||
							player.hasSkillTag("unequip_ai", false, {
								name: arg.card ? arg.card.name : null,
								target: arg.target,
								card: arg.card,
							}))
					);
				}
				return arg.target.storage.qianxi2 == "black";
			},
		},
	},
	qianxi2: {
		//trigger:{global:'phaseAfter'},
		forced: true,
		mark: true,
		audio: false,
		sourceSkill: "qianxi",
		async content(event, trigger, player) {
			player.removeSkill("qianxi2");
			delete player.storage.qianxi2;
		},
		mod: {
			cardEnabled2(card, player) {
				if (get.color(card) == player.storage.qianxi2 && get.position(card) == "h") {
					return false;
				}
			},
		},
		intro: {
			content(color) {
				return "不能使用或打出" + get.translation(color) + "的手牌";
			},
		},
	},
	zhiman: {
		audio: 2,
		audioname2: {
			guansuo: "zhiman_guansuo",
			gz_guansuo: "zhiman_guansuo",
		},
		trigger: { source: "damageBegin2" },
		check(event, player) {
			if (get.damageEffect(event.player, player, player) < 0) {
				return true;
			}
			var att = get.attitude(player, event.player);
			if (att > 0 && event.player.countCards("j")) {
				return true;
			}
			if (event.num > 1) {
				if (att < 0) {
					return false;
				}
				if (att > 0) {
					return true;
				}
			}
			var cards = event.player.getGainableCards(player, "e");
			for (var i = 0; i < cards.length; i++) {
				if (get.equipValue(cards[i]) >= 6) {
					return true;
				}
			}
			return false;
		},
		filter(event, player) {
			return player != event.player;
		},
		logTarget: "player",
		async content(event, trigger, player) {
			if (trigger.player.countGainableCards(player, "ej")) {
				player.gainPlayerCard(trigger.player, "ej", true);
			}
			trigger.cancel();
		},
	},
	sanyao: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		filterTarget(card, player, target) {
			return target.isMaxHp();
		},
		filter(event, player) {
			return player.countCards("he") > 0;
		},
		check(card) {
			return 7 - get.value(card);
		},
		position: "he",
		filterCard: true,
		async content(event, trigger, player) {
			const { target } = event;
			target.damage("nocard");
		},
		ai: {
			result: {
				target(player, target) {
					if (target.countCards("j") && get.attitude(player, target) > 0) {
						return 1;
					}
					if (target.countCards("e")) {
						return -1;
					}
					return get.damageEffect(target, player);
				},
			},
			order: 7,
		},
	},
	olsanyao: {
		enable: "phaseUse",
		audio: "sanyao",
		filter(event, player) {
			return player.countCards("he") > 0 && player.getStorage("olsanyao_used").length < 2;
		},
		chooseButton: {
			dialog(event, player) {
				var list = ["选择手牌数最多的一名角色", "选择体力值最大的一名角色"];
				var choiceList = ui.create.dialog("散谣：请选择一项", "forcebutton", "hidden");
				choiceList.add([
					list.map((item, i) => {
						return [i, item];
					}),
					"textbutton",
				]);
				return choiceList;
			},
			filter(button, player) {
				return !player.getStorage("olsanyao_used").includes(button.link);
			},
			check(button) {
				var player = _status.event.player;
				if (
					game.hasPlayer(
						[
							function (target) {
								var num = target.countCards("h");
								return (
									!game.hasPlayer(function (current) {
										return current != target && current.countCards("h") > num;
									}) && get.effect(target, "sanyao", player, player) > 0
								);
							},
							function (target) {
								var num = target.hp;
								return (
									!game.hasPlayer(function (current) {
										return current != target && current.hp > num;
									}) && get.effect(target, "sanyao", player, player) > 0
								);
							},
						][button.link]
					)
				) {
					return 1 + button.link;
				}
				return 0;
			},
			backup(links) {
				return {
					audio: "sanyao",
					filterTarget: [
						function (card, player, target) {
							var num = target.countCards("h");
							return !game.hasPlayer(function (current) {
								return current != target && current.countCards("h") > num;
							});
						},
						function (card, player, target) {
							return !game.hasPlayer(function (current) {
								return current != target && current.hp > target.hp;
							});
						},
					][links[0]],
					index: links[0],
					filterCard: true,
					check(card) {
						return 7 - get.value(card);
					},
					position: "he",
					async content(event, trigger, player) {
						const { target } = event;
						player.addTempSkill("olsanyao_used", "phaseUseAfter");
						player.markAuto("olsanyao_used", lib.skill[event.name].index);
						target.damage("nocard");
					},
					ai: lib.skill.sanyao.ai,
				};
			},
			prompt() {
				return "请选择【散谣】的目标";
			},
		},
		ai: {
			order: 7,
			result: {
				player: 1,
			},
		},
		subSkill: {
			used: {
				charlotte: true,
				onremove: true,
			},
		},
	},
	rezhiman: {
		audio: "zhiman",
		audioname: ["re_masu"],
		audioname2: {
			dc_guansuo: "zhiman_guansuo",
			guansuo: "zhiman_guansuo",
			re_baosanniang: "zhiman_re_baosanniang",
		},
		trigger: { source: "damageBegin2" },
		filter(event, player) {
			return player != event.player;
		},
		check(event, player) {
			if (get.damageEffect(event.player, player, player) < 0) {
				return true;
			}
			var att = get.attitude(player, event.player);
			if (att > 0 && event.player.countCards("j")) {
				return true;
			}
			if (event.num > 1) {
				if (att < 0) {
					return false;
				}
				if (att > 0) {
					return true;
				}
			}
			var cards = event.player.getGainableCards(player, "he");
			for (var i = 0; i < cards.length; i++) {
				if (get.equipValue(cards[i]) >= 6) {
					return true;
				}
			}
			return false;
		},
		logTarget: "player",
		async content(event, trigger, player) {
			if (trigger.player.countGainableCards(player, "hej")) {
				player.gainPlayerCard(trigger.player, "hej", true);
			}
			trigger.cancel();
		},
	},
	resanyao: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		selectCard() {
			var player = _status.event.player;
			return [
				Math.max(1, ui.selected.targets.length),
				game.countPlayer(function (target) {
					return (
						target != player &&
						!game.hasPlayer(function (current) {
							return current != player && current.hp > target.hp;
						})
					);
				}),
			];
		},
		selectTarget() {
			return ui.selected.cards.length;
		},
		filterTarget(card, player, target) {
			return (
				target != player &&
				!game.hasPlayer(function (current) {
					return current != player && current.hp > target.hp;
				})
			);
		},
		check(card) {
			var player = _status.event.player;
			if (
				game.countPlayer(function (target) {
					return (
						target != player &&
						!game.hasPlayer(function (current) {
							return current != player && current.hp > target.hp;
						}) &&
						get.effect(target, "sanyao", player, player) > 0
					);
				}) <= ui.selected.cards.length
			) {
				return 0;
			}
			return 7 - get.value(card);
		},
		position: "he",
		filterCard: lib.filter.cardDiscardable,
		allowChooseAll: true,
		async content(event, trigger, player) {
			const { target } = event;
			target.damage("nocard");
		},
		ai: {
			result: {
				target(player, target) {
					var disbool = false;
					if (player.hasSkill("rezhiman")) {
						if (target.countCards("j") && get.attitude(player, target) > 0) {
							return 1;
						}
						if (
							target.countCards("he", function (card) {
								return card.name == "tengjia" || get.value(card) > 0;
							})
						) {
							disbool = true;
						}
					}
					var damage = get.damageEffect(target, player);
					if (disbool && get.attitude(player, target) < 0) {
						return Math.min(-1, damage);
					}
					return damage;
				},
			},
			order: 7,
		},
	},
	reqiaoshui: {
		audio: 2,
		enable: "phaseUse",
		filterTarget(card, player, target) {
			return player.canCompare(target);
		},
		filter(event, player) {
			return player.countCards("h") > 0;
		},
		async content(event, trigger, player) {
			const target = event.target;
			const result = await player.chooseToCompare(target).forResult();
			if (result.bool) {
				player.addTempSkill("reqiaoshui_target", "phaseUseEnd");
			} else {
				player.addTempSkill("qiaoshui4");
				event.getParent(3).skipped = true;
			}
		},
		subSkill: {
			target: {
				audio: "reqiaoshui",
				inherit: "qiaoshui3",
				sourceSkill: "reqiaoshui",
			},
		},
		ai: {
			order(item, player) {
				if (
					player.countCards("h", function (card) {
						return player.hasValueTarget(card);
					})
				) {
					return 10;
				}
				return 1;
			},
			result: {
				target(player, target) {
					if (
						player.countCards("h", function (card) {
							return player.hasValueTarget(card);
						})
					) {
						if (player.hasSkill("reqiaoshui_target")) {
							return 0;
						}
						var nd = !player.needsToDiscard();
						if (
							player.hasCard(function (card) {
								if (get.position(card) != "h") {
									return false;
								}
								var val = get.value(card);
								if (nd && val < 0) {
									return true;
								}
								if (val <= 5) {
									return get.number(card) >= 12;
								}
								if (val <= 6) {
									return get.number(card) >= 13;
								}
								return false;
							})
						) {
							return -1;
						}
						return 0;
					}
					return -1;
				},
			},
		},
	},
	qiaoshui: {
		audio: 2,
		audioname2: {
			re_jianyong: "reqiaoshui",
			xin_jianyong: "xinqiaoshui",
		},
		trigger: {
			player: "phaseUseBegin",
		},
		filter(event, player) {
			return player.countCards("h") > 0;
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget({
					prompt: get.prompt2("qiaoshui"),
					filterTarget(card, player, target) {
						return player.canCompare(target);
					},
					ai(target) {
						const player = get.player();
						return -get.attitude(player, target) / target.countCards("h");
					},
				})
				.forResult();
		},
		logTarget: "targets",
		async content(event, trigger, player) {
			const target = event.targets[0];
			const result = await player.chooseToCompare(target).forResult();
			player.addTempSkill(result.bool ? "qiaoshui3" : "qiaoshui2");
		},
		ai: {
			expose: 0.1,
		},
	},
	qiaoshui2: {
		charlotte: true,
		mod: {
			cardEnabled(card) {
				if (get.type(card, "trick") == "trick") {
					return false;
				}
			},
		},
	},
	qiaoshui3: {
		audio: "qiaoshui",
		trigger: {
			player: "useCard2",
		},
		silent: true,
		charlotte: true,
		sourceSkill: "qiaoshui",
		filter(event, player) {
			const type = get.type(event.card);
			return type == "basic" || type == "trick";
		},
		async content(event, trigger, player) {
			player.removeSkill(event.name);

			// 00，01，10，11分别表示是否可以增加目标和是否可以减少目标
			// 0b00: Neither，0b01: Add，0b10: Remove，0b11: Both
			let flags = 0;

			// 是否能增加目标
			const info = get.info(trigger.card);
			if (trigger.targets && !info.multitarget) {
				const players = game.filterPlayer();
				for (const target of players) {
					if (lib.filter.targetEnabled2(trigger.card, player, target) && !trigger.targets.includes(target)) {
						flags |= 0b01;
						break;
					}
				}
			}

			// 是否能减少目标
			if (!info.multitarget && trigger.targets && trigger.targets.length > 1) {
				flags |= 0b10;
			}

			if (flags === 0) {
				return;
			}

			// 增加目标的流程
			const addTarget = async forced => {
				const result = await player
					.chooseTarget({
						prompt: forced ? `巧说：为${get.translation(trigger.card)}额外指定一名目标` : `巧说：是否为${get.translation(trigger.card)}额外指定一名目标？`,
						filterTarget(card, player, target) {
							const currentEvent = get.event();
							if (currentEvent.targets.includes(target)) {
								return false;
							}
							return lib.filter.targetEnabled2(currentEvent.card, currentEvent.player, target);
						},
						forced,
						ai(target) {
							const trigger = _status.event.getTrigger();
							const player = _status.event.player;
							return get.effect(target, trigger.card, player, player);
						},
					})
					.set("targets", trigger.targets)
					.set("card", trigger.card)
					.forResult();

				if (!result.bool || !result.targets?.length) {
					return;
				}

				if (!event.isMine()) {
					await game.delayx();
				}
				const target = result.targets[0];
				player.logSkill("qiaoshui3", target);
				trigger.targets.add(target);
			};

			// 减少目标的流程
			const removeTarget = async forced => {
				const result = await player
					.chooseTarget({
						prompt: forced ? `巧说：减少一名${get.translation(trigger.card)}的目标` : `巧说：是否减少一名${get.translation(trigger.card)}的目标？`,
						filterTarget(card, player, target) {
							return get.event().targets.includes(target);
						},
						forced,
						ai(target) {
							const trigger = get.event().getTrigger();
							return -get.effect(target, trigger.card, trigger.player, get.player());
						},
					})
					.set("targets", trigger.targets)
					.forResult();

				if (!result.bool || !result.targets?.length) {
					return;
				}

				const target = result.targets[0];
				if (event.isMine()) {
					player.logSkill("qiaoshui3", target);
				}
				trigger.targets.remove(target);
				await game.delay();
				if (!event.isMine()) {
					player.logSkill("qiaoshui3", target);
				}
			};

			const items = [addTarget, removeTarget];

			switch (flags) {
				case 0b01:
				case 0b10:
					await items[flags - 1](false);
					break;
				case 0b11: {
					const result = await player
						.chooseControlList({
							prompt: get.prompt("qiaoshui3"),
							list: [`为${get.translation(trigger.card)}增加一个目标`, `为${get.translation(trigger.card)}减少一个目标`],
							ai() {
								return get.event().add ? 0 : 1;
							},
						})
						.set("add", get.effect(player, trigger.card, trigger.player, player) >= 0)
						.forResult();

					if (result.control === "cancel2") {
						return;
					}

					await items[result.index](true);
				}
			}
		},
	},
	qiaoshui4: {
		mod: {
			ignoredHandcard(card, player) {
				if (get.type(card, "trick", player) == "trick") {
					return true;
				}
			},
			cardDiscardable(card, player, name) {
				if (name == "phaseDiscard" && get.type(card, "trick", player) == "trick") {
					return false;
				}
			},
		},
	},
	jyzongshi_old: {
		audio: 2,
		trigger: { target: "useCardToBegin" },
		filter(event, player) {
			if (event.targets && event.targets.length > 1) {
				return false;
			}
			return event.card && get.type(event.card) == "trick" && event.player != player;
		},
		frequent: true,
		async content(event, trigger, player) {
			player.draw();
		},
		ai: {
			effect: {
				target(card, player, target) {
					if (get.type(card) == "trick" && player !== target) {
						return [1, 1];
					}
				},
			},
		},
	},
	shenxing: {
		audio: 2,
		enable: "phaseUse",
		position: "he",
		filterCard: true,
		selectCard: 2,
		prompt: "弃置两张牌并摸一张牌",
		check(card) {
			var player = _status.event.player;
			if (!player.hasSkill("olbingyi") || player.hasSkill("olbingyi_blocker", null, null, false)) {
				return 4 - get.value(card);
			}
			var red = 0,
				black = 0,
				hs = player.getCards("h");
			for (var i of hs) {
				if (ui.selected.cards.includes(i)) {
					continue;
				}
				var color = get.color(i, player);
				if (color == "red") {
					red++;
				}
				if (color == "black") {
					black++;
				}
			}
			if (red > 2 && black > 2) {
				return 4 - get.value(card);
			}
			if (red == 0 || black == 0) {
				return 8 - get.value(card);
			}
			var color = get.color(card);
			if (black <= red) {
				return (color == "black" && get.position(card) == "h" ? 8 : 4) - get.value(card);
			}
			return (color == "red" && get.position(card) == "h" ? 8 : 4) - get.value(card);
		},
		async content(event, trigger, player) {
			player.draw();
		},
		ai: {
			order: 9,
			result: {
				player(player, target) {
					if (!ui.selected.cards.length) {
						return 1;
					}
					if (!player.hasSkill("olbingyi") || player.hasSkill("olbingyi_blocker", null, null, false)) {
						return 1;
					}
					var red = 0,
						black = 0,
						hs = player.getCards("h");
					for (var i of hs) {
						if (ui.selected.cards.includes(i)) {
							continue;
						}
						var color = get.color(i);
						if (color == "red") {
							red++;
						}
						if (color == "black") {
							black++;
						}
					}
					var val = 0;
					for (var i of ui.selected.cards) {
						val += get.value(i, player);
					}
					if (red == 0 || black == 0) {
						if (red + black == 0) {
							return 0;
						}
						var num =
							Math.min(
								red + black,
								game.countPlayer(function (current) {
									return current != player && get.attitude(player, current) > 0 && !current.hasSkillTag("nogain");
								})
							) + 1;
						if (num * 7 > val) {
							return 1;
						}
					}
					if (val < 8) {
						return 1;
					}
					return 0;
				},
			},
		},
	},
	bingyi: {
		audio: 2,
		audioname: ["xin_guyong"],
		trigger: { player: "phaseJieshuBegin" },
		filter(event, player) {
			return player.countCards("h") > 0;
		},
		filterx(event, player) {
			var cards = player.getCards("h");
			if (cards.length < 1) {
				return false;
			}
			var color = get.color(cards[0]);
			for (var i = 1; i < cards.length; i++) {
				if (get.color(cards[i]) != color) {
					return false;
				}
			}
			return true;
		},
		async cost(event, trigger, player) {
			if (lib.skill.bingyi.filterx(trigger, player)) {
				event.result = await player
					.chooseTarget({
						prompt: get.prompt("bingyi"),
						prompt2: "展示所有手牌，并令至多" + get.cnNumber(player.countCards("h")) + "名角色各摸一张牌",
						filterTarget: lib.filter.all,
						selectTarget: [1, player.countCards("h")],
						ai(target) {
							return get.attitude(_status.event.player, target);
						},
					})
					.forResult();
			} else {
				event.result = await player
					.chooseBool({
						prompt: get.prompt("bingyi"),
						prompt2: "展示所有手牌",
						ai() {
							return false;
						},
					})
					.forResult();
			}
		},
		async content(event, trigger, player) {
			await player.showHandcards(get.translation(player) + "发动了【秉壹】");
			const targets = event.targets;
			if (targets?.length) {
				player.line(targets, "green");
				targets.sortBySeat();
				await game.asyncDraw(targets);
			}
		},
		ai: {
			expose: 0.1,
		},
	},
	xiantu: {
		audio: 2,
		logAudio(event) {
			if (typeof event == "string") {
				return "xiantu2.mp3";
			}
			return 1;
		},
		trigger: { global: "phaseUseBegin" },
		filter(event, player) {
			return event.player != player;
		},
		logTarget: "player",
		prompt2: "摸两张牌，然后交给其两张牌。若该角色于本回合阶段时未杀死过角色，则你失去1点体力。",
		check(event, player) {
			if (get.attitude(player, event.player) < 5) {
				return false;
			}
			if (player.maxHp - player.hp >= 2) {
				return false;
			}
			if (player.hp == 1) {
				return false;
			}
			if (player.hp == 2 && player.countCards("h") < 2) {
				return false;
			}
			if (event.player.countCards("h") >= event.player.hp) {
				return false;
			}
			return true;
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			if (get.mode() !== "identity" || player.identity !== "nei") {
				player.addExpose(0.2);
			}
			await player.draw(2);
			const result = await player
				.chooseCard(2, "he", true, `交给${get.translation(target)}两张牌`)
				.set("ai", card => {
					if (ui.selected.cards.length && card.name == ui.selected.cards[0].name) {
						return -1;
					}
					if (get.tag(card, "damage")) {
						return 1;
					}
					if (get.type(card) == "equip") {
						return 1;
					}
					return 0;
				})
				.forResult();
			if (result?.bool && result.cards?.length) {
				player.give(result.cards, target);
				player
					.when({
						global: "phaseAnyEnd",
					})
					.filter(evt => evt == event.getParent(evt.name, true, true))
					.step(async (event, trigger, player) => {
						if (
							game.hasGlobalHistory("everything", evt => {
								if (evt.name != "die" || evt.source != target) {
									return false;
								}
								return evt.getParent(trigger.name, true) == trigger;
							})
						) {
							return;
						}
						player.logSkill("xiantu", null, null, null, ["loseHp"]);
						await player.loseHp();
					});
			}
		},
		ai: {
			threaten: 1.1,
		},
	},
	qiangzhi: {
		audio: 2,
		audioname: ["re_zhangsong"],
		trigger: { player: "phaseUseBegin" },
		filter(event, player) {
			return game.hasPlayer(function (current) {
				return current != player && current.countCards("h") > 0;
			});
		},
		subfrequent: ["draw"],
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget({
					prompt: get.prompt2("qiangzhi"),
					filterTarget(card, player, target) {
						return target !== player && target.countCards("h") > 0;
					},
					ai() {
						return Math.random();
					},
				})
				.forResult();
		},
		logTarget: "targets",
		async content(event, trigger, player) {
			const target = event.targets[0];
			const result = await player
				.choosePlayerCard({
					target,
					position: "h",
					forced: true,
				})
				.forResult();
			if (!result.cards?.length) {
				return;
			}
			const card = result.cards[0];
			await target.showCards(card, get.translation(target) + "因【强识】展示");
			player.storage.qiangzhi_draw = get.type(card, "trick");
			game.addVideo("storage", player, ["qiangzhi_draw", player.storage.qiangzhi_draw]);
			player.addTempSkill("qiangzhi_draw", "phaseUseEnd");
		},
	},
	qiangzhi_draw: {
		trigger: { player: "useCard" },
		frequent: true,
		popup: false,
		charlotte: true,
		prompt: "是否执行【强识】的效果摸一张牌？",
		sourceSkill: "qiangzhi",
		filter(event, player) {
			return get.type(event.card, "trick") == player.storage.qiangzhi_draw;
		},
		async content(event, trigger, player) {
			player.draw("nodelay");
		},
		onremove: true,
		mark: true,
		intro: {
			content(type) {
				return get.translation(type) + "牌";
			},
		},
	},
	dingpin: {
		audio: "pindi",
		enable: "phaseUse",
		onChooseToUse(event) {
			if (event.type != "phase" || game.online) {
				return;
			}
			var list = [],
				player = event.player;
			player.getHistory("useCard", function (evt) {
				list.add(get.type2(evt.card));
			});
			player.getHistory("lose", function (evt) {
				if (evt.type != "discard") {
					return;
				}
				for (var i of evt.cards2) {
					list.add(get.type2(i, evt.hs.includes(i) ? player : false));
				}
			});
			event.set("dingpin_types", list);
		},
		filter(event, player) {
			var list = event.dingpin_types || [];
			return (
				player.countCards("he", function (card) {
					return !list.includes(get.type2(card));
				}) > 0
			);
		},
		filterCard(card) {
			var list = _status.event.dingpin_types || [];
			return !list.includes(get.type2(card));
		},
		position: "he",
		filterTarget(card, player, target) {
			return !target.hasSkill("dingpin2");
		},
		async content(event, trigger, player) {
			const { target } = event;
			const result = await target
				.judge({
					judge(card) {
						const evt = _status.event.getParent("dingpin");
						if (evt == null) {
							return 0;
						}
						const color = get.color(card);
						switch (color) {
							case "black":
								return evt.target.getDamagedHp();
							case "red":
								return get.sgn(get.attitude(evt.target, evt.player)) * -3;
						}
						return 0;
					},
					judge2(result) {
						return result.color === "black";
					},
				})
				.forResult();
			switch (result.color) {
				case "black":
					if (target.getDamagedHp() > 0) {
						await target.draw(target.getDamagedHp());
					}
					target.addTempSkill("dingpin2");
					break;
				case "red":
					await player.turnOver();
					break;
			}
		},
		ai: {
			order: 9,
			result: {
				target(player, target) {
					if (player.isTurnedOver()) {
						return target.getDamagedHp();
					}
					var card = ui.cardPile.firstChild;
					if (!card) {
						return;
					}
					if (get.color(card) == "black") {
						return target.getDamagedHp();
					}
					return 0;
				},
			},
		},
	},
	dingpin2: { charlotte: true },
	faen: {
		audio: 2,
		trigger: { global: ["turnOverAfter", "linkAfter"] },
		filter(event, player) {
			if (event.name == "link") {
				return event.player.isLinked();
			}
			return !event.player.isTurnedOver();
		},
		check(event, player) {
			return get.attitude(player, event.player) > 0;
		},
		logTarget: "player",
		async content(event, trigger, player) {
			trigger.player.draw();
		},
		ai: {
			expose: 0.2,
		},
		global: "faen_global",
		subSkill: {
			global: {
				ai: {
					effect: {
						target(card, player, target) {
							if (card.name == "tiesuo" && !target.isLinked()) {
								return [
									1,
									0.6 *
										game.countPlayer(cur => {
											return (cur.hasSkill("faen") || cur.hasSkill("oldfaen") || cur.hasSkill("refaen") || cur.hasSkill("dcfaen")) && get.attitude(target, cur) > 0;
										}),
								];
							}
						},
					},
				},
			},
		},
	},
	jiaojin: {
		audio: 2,
		trigger: { player: "damageBegin3" },
		filter(event, player) {
			return player.countCards("he", { type: "equip" }) > 0 && event.source && event.source.hasSex("male");
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseToDiscard({
					prompt: "骄矜：是否弃置一张装备牌令伤害-1？",
					filterCard(card, player) {
						return get.type(card) === "equip";
					},
					position: "he",
					ai(card) {
						const event = get.event();
						const player = event.player;
						if (player.hp === 1 || event.getTrigger().num > 1) {
							return 9 - get.value(card);
						}
						if (player.hp === 2) {
							return 8 - get.value(card);
						}
						return 7 - get.value(card);
					},
				})
				.set("chooseonly", true)
				.forResult();
		},
		async content(event, trigger, player) {
			await player.discard({
				cards: event.cards,
				discarder: player,
			});
			--trigger.num;
		},
	},
	chanhui: {
		audio: 2,
		trigger: { player: "useCardToPlayer" },
		filter(event, player) {
			if (_status.currentPhase != player) {
				return false;
			}
			if (player.hasSkill("chanhui2")) {
				return false;
			}
			if (event.targets.length > 1) {
				return false;
			}
			var card = event.card;
			if (card.name == "sha") {
				return true;
			}
			if (get.color(card) == "black" && get.type(card) == "trick") {
				return true;
			}
			return false;
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget({
					prompt: get.prompt2("chanhui"),
					filterTarget(card, player, target) {
						if (player === target) {
							return false;
						}
						const evt = _status.event.getTrigger();
						return !evt.targets.includes(target) && lib.filter.targetEnabled2(evt.card, player, target) && lib.filter.targetInRange(evt.card, player, target);
					},
					ai(target) {
						const event = get.event();
						const trigger = event.getTrigger();
						const player = get.player();
						return get.effect(target, trigger.card, player, player) + 0.01;
					},
				})
				.forResult();
		},
		logTarget: "targets",
		async content(event, trigger, player) {
			const target = event.targets[0];
			player.addTempSkill("chanhui2");
			const result = await target
				.chooseCard({
					prompt: `交给${get.translation(player)}一张手牌，或成为${get.translation(trigger.card)}的额外目标`,
					ai(card) {
						return 5 - get.value(card);
					},
				})
				.forResult();
			if (result.bool) {
				await target.give(result.cards, player);
				trigger.untrigger();
				trigger.getParent().player = target;
				game.log(target, "成为了", trigger.card, "的使用者");
			} else {
				game.log(target, "成为了", trigger.card, "的额外目标");
				trigger.getParent().targets.push(target);
			}
		},
	},
	rechanhui: {
		audio: 2,
		trigger: { player: "useCardToPlayer" },
		filter(event, player) {
			if (event.targets.length > 1) {
				return false;
			}
			var card = event.card;
			if (card.name == "sha" || get.type(card) == "trick") {
				return true;
			}
			return false;
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget({
					prompt: get.prompt2("rechanhui"),
					filterTarget(card, player, target) {
						if (player === target) {
							return false;
						}
						const trigger = get.event();
						return player.canUse(trigger.card, target, false) && !trigger.targets.includes(target);
					},
					ai(target) {
						const trigger = get.event().getTrigger();
						const player = get.player();
						return get.effect(target, trigger.card, player, player) + 0.01;
					},
				})
				.set("targets", trigger.targets)
				.set("card", trigger.card)
				.forResult();
		},
		logTarget: "targets",
		async content(event, trigger, player) {
			const target = event.targets[0];
			const result = await target
				.chooseCard({
					prompt: `交给${get.translation(player)}一张牌，或成为${get.translation(trigger.card)}的额外目标`,
					position: "he",
					ai(card) {
						return 5 - get.value(card);
					},
				})
				.forResult();

			if (result.bool) {
				await target.give(result.cards, player);
				trigger.untrigger();
				trigger.getParent().player = target;
				game.log(target, "成为了", trigger.card, "的使用者");
				return;
			}
			game.log(target, "成为了", trigger.card, "的额外目标");
			trigger.getParent().targets.push(target);
			player.tempBanSkill("rechanhui");
		},
	},
	rejiaojin: {
		audio: 2,
		trigger: { target: "useCardToTargeted" },
		filter(event, player) {
			return (event.card.name === "sha" || get.type(event.card) === "trick") && event.player !== player && player.hasCard(card => _status.connectMode || get.type(card) == "equip", "he");
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseToDiscard({
					prompt: "骄矜：是否弃置一张装备牌令" + get.translation(trigger.card) + "对你无效？",
					filterCard(card) {
						return get.type(card) === "equip";
					},
					position: "he",
					ai(card) {
						const { goon2, val } = get.event();
						if (goon2) {
							return 3 + val - get.value(card);
						}
						return 0;
					},
				})
				.set("val", get.value(trigger.cards.filterInD()))
				.set("goon2", get.effect(player, trigger.card, trigger.player, player) < 0)
				.set("chooseonly", true)
				.forResult();
		},
		logTarget: "player",
		async content(event, trigger, player) {
			await player.discard({
				cards: event.cards,
				discarder: player,
			});
			const cards = trigger.cards.filterInD();
			if (cards.length) {
				await player.gain({
					cards,
					animate: "gain2",
					log: true,
				});
			}
			trigger.excluded.push(player);
			if (trigger.player.hasSex("female")) {
				player.tempBanSkill("rejiaojin");
			}
		},
	},
	chanhui2: {},
	quanji: {
		audio: 2,
		trigger: { player: "damageEnd" },
		frequent: true,
		locked: false,
		filter(event) {
			return event.num > 0;
		},
		getIndex: event => event.num,
		async content(event, trigger, player) {
			await player.draw();
			const hs = player.getCards("h");
			if (!hs.length) {
				return;
			}
			const result = hs.length == 1 ? { bool: true, cards: hs } : await player.chooseCard("h", true, "选择一张牌作为“权”").forResult();
			if (result?.bool && result?.cards?.length) {
				const next = player.addToExpansion(result.cards, player, "give");
				next.gaintag.add(event.name);
				await next;
			}
		},
		intro: {
			content: "expansion",
			markcount: "expansion",
		},
		onremove(player, skill) {
			const cards = player.getExpansions(skill);
			if (cards.length) {
				player.loseToDiscardpile(cards);
			}
		},
		mod: {
			maxHandcard(player, num) {
				return num + player.getExpansions("quanji").length;
			},
		},
		ai: {
			maixie: true,
			maixie_hp: true,
			notemp: true,
			threaten: 0.8,
			effect: {
				target(card, player, target) {
					if (get.tag(card, "damage") && (player.hasSkill("paiyi") || player.hasSkill("zili"))) {
						if (player.hasSkillTag("jueqing", false, target)) {
							return [1, -2];
						}
						if (!target.hasFriend()) {
							return;
						}
						if (target.hp >= 4) {
							return [0.5, get.tag(card, "damage") * 2];
						}
						if (!target.hasSkill("paiyi") && target.hp > 1) {
							return [0.5, get.tag(card, "damage") * 1.5];
						}
						if (target.hp == 3) {
							return [0.5, get.tag(card, "damage") * 1.5];
						}
						if (target.hp == 2) {
							return [1, get.tag(card, "damage") * 0.5];
						}
					}
				},
			},
		},
	},
	zili: {
		skillAnimation: true,
		animationColor: "thunder",
		audio: 2,
		audioname: ["re_zhonghui"],
		juexingji: true,
		trigger: { player: "phaseZhunbeiBegin" },
		forced: true,
		derivation: "paiyi",
		filter(event, player) {
			return player.countExpansions("quanji") >= 3;
		},
		async content(event, trigger, player) {
			player.awakenSkill(event.name);
			await player.loseMaxHp();
			await player.chooseDrawRecover(2, true, (event, player) => {
				if (player.hp == 1 && player.isDamaged()) {
					return "recover_hp";
				}
				return "draw_card";
			});
			await player.addSkills("paiyi");
		},
		ai: { combo: "quanji" },
	},
	paiyi: {
		enable: "phaseUse",
		usable: 1,
		audio: 2,
		audioname: ["re_zhonghui"],
		filter(event, player) {
			return player.getExpansions("quanji").length > 0;
		},
		chooseButton: {
			dialog(event, player) {
				return ui.create.dialog("排异", player.getExpansions("quanji"), "hidden");
			},
			backup(links, player) {
				return {
					audio: "paiyi",
					audioname: ["re_zhonghui"],
					filterTarget: true,
					filterCard() {
						return false;
					},
					selectCard: -1,
					card: links[0],
					delay: false,
					content: lib.skill.paiyi.contentx,
					ai: {
						order: 10,
						result: {
							target(player, target) {
								if (player != target) {
									return 0;
								}
								if (player.hasSkill("requanji") || player.countCards("h") + 2 <= player.hp + player.getExpansions("quanji").length) {
									return 1;
								}
								return 0;
							},
						},
					},
				};
			},
			prompt() {
				return "请选择〖排异〗的目标";
			},
		},
		async contentx(event, trigger, player) {
			const { target } = event;
			const card = lib.skill.paiyi_backup.card;
			await player.loseToDiscardpile(card);
			await target.draw(2);
			if (target.countCards("h") > player.countCards("h")) {
				await target.damage();
			}
		},
		ai: {
			order: 1,
			combo: "quanji",
			result: {
				player: 1,
			},
		},
	},
	xianzhou: {
		skillAnimation: true,
		animationColor: "gray",
		audio: 2,
		audioname: ["xin_caifuren", "ol_caifuren"],
		limited: true,
		enable: "phaseUse",
		filter(event, player) {
			return player.countCards("e") > 0;
		},
		filterTarget(card, player, target) {
			return player != target;
		},
		delay: false,
		async content(event, trigger, player) {
			const cards = player.getCards("e");
			const target = event.target;
			const num = cards.length;
			player.awakenSkill(event.name);
			await player.give(cards, target);
			await game.delay();

			const result = await target
				.chooseTarget({
					prompt: "令" + get.translation(player) + "回复" + num + "点体力，或对攻击范围内的" + num + "名角色造成1点伤害",
					filterTarget(card, player, target2) {
						return _status.event.player.inRange(target2);
					},
					selectTarget: [1, num],
					ai(target2) {
						const target = _status.event.player;
						const player = _status.event.getParent().player;
						if (get.attitude(target, player) > 0) {
							if (player.hp + num <= player.maxHp || player.hp == 1) {
								return -1;
							}
						}
						return get.damageEffect(target2, target, target);
					},
				})
				.forResult();
			if (!result.bool) {
				await player.recover({
					num,
					source: target,
				});
				return;
			}
			target.line(result.targets, "green");
			for (const targetx of result.targets) {
				await targetx.damage({ source: target });
			}
		},
		ai: {
			order: 1,
			result: {
				target: 1,
				player(player) {
					var bool = true,
						players = game.filterPlayer();
					for (var i = 0; i < players.length; i++) {
						if (players[i] != player && get.attitude(player, players[i]) > 2 && get.attitude(players[i], player) > 2) {
							bool = false;
							break;
						}
					}
					if (bool) {
						return -10;
					}
					if (player.hp == 1) {
						return 1;
					}
					if (game.phaseNumber < game.players.length) {
						return -10;
					}
					if (player.countCards("e") + player.hp <= player.maxHp) {
						return 1;
					}
					return -10;
				},
			},
		},
	},
	qieting: {
		audio: 2,
		trigger: { global: "phaseEnd" },
		filter(event, player) {
			if (event.player == player || !event.player.isIn()) {
				return false;
			}
			var history = event.player.getHistory("useCard");
			for (var i = 0; i < history.length; i++) {
				if (!history[i].targets) {
					continue;
				}
				for (var j = 0; j < history[i].targets.length; j++) {
					if (history[i].targets[j] != event.player) {
						return false;
					}
				}
			}
			return true;
		},
		direct: true,
		async content(event, trigger, player) {
			let result;
			if (trigger.player.hasCard(card => player.canEquip(card), "e")) {
				result = await player
					.chooseControl({
						prompt: get.prompt("qieting", trigger.player),
						controls: ["移动装备", "draw_card", "cancel2"],
						ai(event, player) {
							const source = _status.event.sourcex;
							const att = get.attitude(player, source);
							if (source.hasSkillTag("noe")) {
								if (att > 0) {
									return "移动装备";
								}
							} else {
								if (att <= 0 && source.countCards("e", card => get.value(card, source) > 0 && get.effect(player, card, player, player) > 0)) {
									return "移动装备";
								}
							}
							return "draw_card";
						},
					})
					.set("sourcex", trigger.player)
					.forResult();
			} else {
				result = await player
					.chooseControl({
						prompt: get.prompt("qieting", trigger.player),
						controls: ["draw_card", "cancel2"],
						ai() {
							return "draw_card";
						},
					})
					.forResult();
			}
			if (result.control != "移动装备") {
				if (result.control == "draw_card") {
					player.logSkill("qieting");
					await player.draw();
				}
				return;
			}
			player.logSkill("qieting", trigger.player);
			result = await player
				.choosePlayerCard({
					prompt: "将一张装备牌移至你的装备区",
					target: trigger.player,
					filterButton(button) {
						return _status.event.player.canEquip(button.link);
					},
					position: "e",
					forced: true,
					ai(button) {
						return get.effect(player, button.link, player, player);
					},
				})
				.forResult();
			if (!result || !result.links || !result.links.length) {
				return;
			}
			await game.delay(2);
			trigger.player.$give(result.links[0], player, false);
			await player.equip(result.links[0]);
			player.addExpose(0.2);
		},
	},
	oldzhuikong: {
		audio: "zhuikong",
		inherit: "zhuikong",
	},
	zhuikong: {
		audio: 2,
		trigger: { global: "phaseZhunbeiBegin" },
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
		logTarget: "player",
		filter(event, player) {
			return player.hp < player.maxHp && player.canCompare(event.player);
		},
		async content(event, trigger, player) {
			const result = await player.chooseToCompare(trigger.player).forResult();
			if (result.bool) {
				if (event.name == "zhuikong") {
					trigger.player.addTempSkill("zishou2");
				} else {
					trigger.player.skip("phaseUse");
				}
			} else {
				trigger.player.storage.zhuikong_distance = player;
				trigger.player.addTempSkill("zhuikong_distance");
			}
		},
		subSkill: {
			distance: {
				sub: true,
				onremove: true,
				mod: {
					globalFrom(from, to, distance) {
						if (from.storage.zhuikong_distance == to) {
							return -Infinity;
						}
					},
				},
			},
		},
	},
	oldqiuyuan: {
		audio: "qiuyuan",
		inherit: "qiuyuan",
		filter(event, player) {
			return (
				event.card.name == "sha" &&
				game.hasPlayer(current => {
					return current != player && !event.targets.includes(current) && current.countCards("h") > 0 && lib.filter.targetEnabled(event.card, event.player, current);
				})
			);
		},
		async content(event, trigger, player) {
			const {
				targets: [target],
			} = event;
			const { card } = trigger;
			const result = await target
				.chooseToGive("he", `交给${get.translation(player)}一张牌，若此牌不为【闪】，则成为${get.translation(card)}的额外目标`, player, true)
				.set("ai", card => {
					const { player, target } = get.event();
					return Math.sign(Math.sign(get.attitude(player, target)) - 0.5) * get.value(card, player, "raw");
				})
				.forResult();
			if (!result?.bool || !result?.cards?.length || get.name(result.cards[0], target) !== "shan") {
				trigger.getParent().targets.push(target);
				trigger.getParent().triggeredTargets2.push(target);
				game.log(target, "成为了", card, "的额外目标");
			}
		},
	},
	qiuyuan: {
		audio: 2,
		trigger: { target: "useCardToTarget" },
		filter(event, player) {
			return (
				event.card.name == "sha" &&
				game.hasPlayer(current => {
					return current != player && !event.targets.includes(current) && lib.filter.targetEnabled(event.card, event.player, current);
				})
			);
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt2(event.skill), (card, player, target) => {
					const evt = get.event().getTrigger();
					return target != player && !evt.targets.includes(target) && lib.filter.targetEnabled(evt.card, evt.player, target);
				})
				.set("ai", target => {
					const evt = get.event().getTrigger();
					const player = get.player();
					return get.effect(target, evt.card, evt.player, player) + 0.1;
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const {
				targets: [target],
			} = event;
			const { card } = trigger;
			const { bool } = await target
				.chooseToGive({ name: "shan" }, `交给${get.translation(player)}一张【闪】，或成为${get.translation(card)}的额外目标`, player)
				.set("ai", card => {
					const { player, target } = get.event();
					return get.attitude(player, target) >= 0 ? 1 : -1;
				})
				.forResult();
			if (!bool) {
				trigger.getParent().targets.push(target);
				trigger.getParent().triggeredTargets2.push(target);
				game.log(target, "成为了", card, "的额外目标");
			}
		},
		ai: {
			expose: 0.2,
			effect: {
				target_use(card, player, target) {
					if (card.name != "sha") {
						return;
					}
					var players = game.filterPlayer();
					if (get.attitude(player, target) <= 0) {
						for (var i = 0; i < players.length; i++) {
							var target2 = players[i];
							if (player != target2 && target != target2 && player.canUse(card, target2, false) && get.effect(target2, { name: "shacopy", nature: card.nature, suit: card.suit }, player, target) > 0 && get.effect(target2, { name: "shacopy", nature: card.nature, suit: card.suit }, player, player) < 0) {
								if (target.hp == target.maxHp) {
									return 0.3;
								}
								return 0.6;
							}
						}
					} else {
						for (var i = 0; i < players.length; i++) {
							var target2 = players[i];
							if (player != target2 && target != target2 && player.canUse(card, target2, false) && get.effect(target2, { name: "shacopy", nature: card.nature, suit: card.suit }, player, player) > 0) {
								if (player.canUse(card, target2)) {
									return;
								}
								if (target.hp == target.maxHp) {
									return [0, 1];
								}
								return [0, 0];
							}
						}
					}
				},
			},
		},
	},
	gongji: {
		enable: "phaseUse",
		usable: 1,
		audio: 2,
		position: "he",
		filterCard: true,
		check(card) {
			if (get.type(card) != "equip") {
				return 0;
			}
			var player = _status.currentPhase;
			if (player.countCards("he", { subtype: get.subtype(card) }) > 1) {
				return 11 - get.equipValue(card);
			}
			return 6 - get.equipValue(card);
		},
		async content(event, trigger, player) {
			const { cards } = event;
			player.addTempSkill("gongji2");
			if (get.type(cards[0], null, cards[0].original == "h" ? player : false) != "equip") {
				return;
			}
			const result = await player
				.chooseTarget({
					prompt: "是否弃置一名角色的一张牌？",
					filterTarget(card, player, target) {
						return player != target && target.countCards("he") > 0;
					},
					ai(target) {
						const player = _status.event.player;
						if (get.attitude(player, target) < 0) {
							return Math.max(0.5, get.effect(target, { name: "sha" }, player, player));
						}
						return 0;
					},
				})
				.forResult();
			if (!result.bool || !result.targets?.length) {
				return;
			}
			player.line(result.targets, "green");
			const target = result.targets[0];
			await player.discardPlayerCard({
				target,
				position: "he",
				forced: true,
				ai: get.buttonValue,
			});
		},
		ai: {
			order: 9,
			result: {
				player: 1,
			},
		},
	},
	gongji2: {
		mod: {
			attackRangeBase() {
				return Infinity;
			},
		},
	},
	zhuiyi: {
		audio: 2,
		audioname: ["re_bulianshi"],
		trigger: { player: "die" },
		skillAnimation: true,
		animationColor: "wood",
		forceDie: true,
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget({
					prompt: get.prompt2("zhuiyi"),
					filterTarget(card, player, target) {
						return player !== target && _status.event.sourcex !== target;
					},
					ai(target) {
						let num = get.attitude(_status.event.player, target);
						if (num > 0) {
							if (target.hp == 1) {
								num += 2;
							}
							if (target.hp < target.maxHp) {
								num += 2;
							}
						}
						return num;
					},
				})
				.set("forceDie", true)
				.set("sourcex", trigger.source)
				.forResult();
		},
		logTarget: "targets",
		async content(event, trigger, player) {
			const target = event.targets[0];
			player.line(target, "green");
			await target.recover();
			await target.draw(3);
		},
		ai: {
			expose: 0.5,
		},
	},
	old_anxu: {
		enable: "phaseUse",
		usable: 1,
		multitarget: true,
		audio: "anxu",
		filterTarget(card, player, target) {
			if (player == target) {
				return false;
			}
			var num = target.countCards("h");
			if (ui.selected.targets.length) {
				return num < ui.selected.targets[0].countCards("h");
			}
			var players = game.filterPlayer();
			for (var i = 0; i < players.length; i++) {
				if (num > players[i].countCards("h")) {
					return true;
				}
			}
			return false;
		},
		selectTarget: 2,
		async content(event, trigger, player) {
			const { targets } = event;
			let gainner;
			let giver;
			if (targets[0].countCards("h") < targets[1].countCards("h")) {
				gainner = targets[0];
				giver = targets[1];
			} else {
				gainner = targets[1];
				giver = targets[0];
			}
			const result = await gainner
				.gainPlayerCard({
					target: giver,
					positon: "h",
					forced: true,
					visibleMove: true,
				})
				.forResult();
			if (!result.cards?.length) {
				return;
			}
			const card = result.cards[0];
			if (get.suit(card) == "spade") {
				return;
			}
			await player.draw();
		},
		ai: {
			order: 10.5,
			threaten: 2.3,
			result: {
				target(player, target) {
					var num = target.countCards("h");
					var att = get.attitude(player, target);
					if (ui.selected.targets.length == 0) {
						if (att > 0) {
							return -1;
						}
						var players = game.filterPlayer();
						for (var i = 0; i < players.length; i++) {
							var num2 = players[i].countCards("h");
							var att2 = get.attitude(player, players[i]);
							if (num2 < num) {
								if (att2 > 0) {
									return -3;
								}
								return -1;
							}
						}
						return 0;
					} else {
						return 1;
					}
				},
				player: 1,
			},
		},
	},
	anxu: {
		enable: "phaseUse",
		usable: 1,
		multitarget: true,
		audio: 2,
		filterTarget(card, player, target) {
			if (player == target) {
				return false;
			}
			var num = target.countCards("h");
			if (ui.selected.targets.length) {
				return num < ui.selected.targets[0].countCards("h");
			}
			var players = game.filterPlayer();
			for (var i = 0; i < players.length; i++) {
				if (num > players[i].countCards("h")) {
					return true;
				}
			}
			return false;
		},
		selectTarget: 2,
		async content(event, trigger, player) {
			const { targets } = event;
			let gainner;
			let giver;
			if (targets[0].countCards("h") < targets[1].countCards("h")) {
				gainner = targets[0];
				giver = targets[1];
			} else {
				gainner = targets[1];
				giver = targets[0];
			}
			const result = await giver
				.chooseCard({
					prompt: "选择一张手牌交给" + get.translation(gainner),
					forced: true,
				})
				.forResult();
			const card = result.cards[0];
			await giver.give(card, gainner);
			if (gainner.countCards("h") === giver.countCards("h")) {
				await player.chooseDrawRecover(true);
			}
		},
		ai: {
			order: 10.5,
			threaten: 1.6,
			result: {
				target(player, target) {
					var num = target.countCards("h");
					var att = get.attitude(player, target);
					if (ui.selected.targets.length == 0) {
						if (att > 0) {
							return -1;
						}
						var players = game.filterPlayer();
						for (var i = 0; i < players.length; i++) {
							var num2 = players[i].countCards("h");
							var att2 = get.attitude(player, players[i]);
							if (att2 >= 0 && num2 < num) {
								return -1;
							}
						}
						return 0;
					} else {
						return 1;
					}
				},
				player: 0.1,
			},
		},
	},
	mingce: {
		enable: "phaseUse",
		usable: 1,
		audio: 2,
		position: "he",
		filterCard(card) {
			return get.name(card) == "sha" || get.type(card) == "equip";
		},
		filter(event, player) {
			return player.countCards("h", "sha") > 0 || player.countCards("he", { type: "equip" }) > 0;
		},
		check(card) {
			return 8 - get.value(card);
		},
		selectTarget: 2,
		multitarget: true,
		discard: false,
		lose: false,
		targetprompt: ["得到牌", "出杀目标"],
		filterTarget(card, player, target) {
			if (ui.selected.targets.length == 0) {
				return player != target;
			} else {
				return ui.selected.targets[0].inRange(target);
			}
		},
		delay: false,
		async content(event, trigger, player) {
			const { cards, targets } = event;
			await player.give(cards, targets[0], true);
			let result;
			if (!lib.filter.filterTarget({ name: "sha", isCard: true }, targets[0], targets[1])) {
				result = { control: "draw_card" };
			} else {
				result = await targets[0]
					.chooseControl({
						prompt: "对" + get.translation(targets[1]) + "使用一张杀，或摸一张牌",
						controls: ["draw_card", "出杀"],
						ai() {
							const { player, target } = get.event();
							if (get.effect(_status.event.target, { name: "sha" }, player, player) > 0) {
								return 1;
							}
							return 0;
						},
					})
					.set("target", targets[1])
					.forResult();
			}
			if (result.control == "draw_card") {
				await targets[0].draw();
			} else {
				await targets[0].useCard({
					card: get.autoViewAs({ name: "sha", isCard: true }),
					targets: [targets[1]],
				});
			}
		},
		ai: {
			result: {
				player(player) {
					var players = game.filterPlayer();
					for (var i = 0; i < players.length; i++) {
						if (players[i] != player && get.attitude(player, players[i]) > 1 && get.attitude(players[i], player) > 1) {
							return 1;
						}
					}
					return 0;
				},
				target(player, target) {
					if (ui.selected.targets.length) {
						return -0.1;
					}
					return 1;
				},
			},
			order: 8.5,
			expose: 0.2,
		},
	},
	xinxuanhuo: {
		audio: 2,
		trigger: {
			player: "phaseDrawBegin1",
		},
		filter(event, player) {
			return !event.numFixed;
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget({
					prompt: get.prompt2("xinxuanhuo"),
					filterTarget(card, player, target) {
						return player != target;
					},
					ai(target) {
						const event = get.event();
						const player = get.player();

						let att = get.attitude(player, target);
						const count = target.countCards("h");
						if (att > 0) {
							if (count < target.hp) {
								att += 2;
							}
							return att - count / 3;
						} else {
							return -1;
						}
					},
				})
				.forResult();
		},
		logTarget: "targets",
		async content(event, trigger, player) {
			trigger.changeToZero();

			const target = event.targets[0];
			await target.draw(2);

			let noSha = true;
			if (game.hasPlayer(current => target.canUse("sha", current))) {
				let result = await player
					.chooseTarget({
						prompt: "选择出杀的目标",
						filterTarget(card, player, target) {
							const event = get.event();
							return event.target.canUse("sha", target);
						},
						forced: true,
						ai(target) {
							const event = get.event();
							return get.effect(target, { name: "sha" }, event.target, event.player);
						},
					})
					.set("target", target)
					.forResult();

				if (result.bool && result.targets?.length) {
					game.log(player, "指定的出杀目标为", result.targets);
					const target2 = result.targets[0];
					target.line(target2);
					result = await target
						.chooseToUse({
							prompt: `对${get.translation(result.targets)}使用一张杀，或令${get.translation(player)}获得你的两张牌`,
							filterTarget(card, player, target) {
								return target === target2;
							},
							selectTarget: -1,
							filterCard(card) {
								return card.name === "sha";
							},
						})
						.forResult();
					noSha = !result.bool;
				}
			}

			if (noSha) {
				await player.gainPlayerCard({
					target,
					selectButton: Math.min(2, target.countCards("he")),
					position: "he",
					forced: true,
				});
			}
		},
		ai: {
			expose: 0.2,
		},
	},
	zhichi: {
		audio: 2,
		trigger: { player: "damageEnd" },
		audioname: ["re_chengong"],
		audioname2: { sxrm_caocao: "zhichi_sxrm_caocao" },
		forced: true,
		filter(event, player) {
			return _status.currentPhase != player;
		},
		async content(event, trigger, player) {
			player.addTempSkill("zhichi2", ["phaseAfter", "phaseBefore"]);
		},
	},
	zhichi2: {
		audio: "zhichi",
		trigger: { target: "useCardToBefore" },
		audioname: ["re_chengong"],
		audioname2: { sxrm_caocao: "zhichi_sxrm_caocao" },
		forced: true,
		charlotte: true,
		priority: 15,
		sourceSkill: "zhichi",
		filter(event, player) {
			return get.type(event.card) == "trick" || event.card.name == "sha";
		},
		async content(event, trigger, player) {
			game.log(player, "发动了智迟，", trigger.card, "对", trigger.target, "失效");
			trigger.cancel();
		},
		mark: true,
		intro: {
			content: "杀或普通锦囊牌对你无效",
		},
		ai: {
			effect: {
				target(card, player, target, current) {
					if (get.type(card) == "trick" || card.name == "sha") {
						return "zeroplayertarget";
					}
				},
			},
		},
	},
	zongxuan: {
		audio: 2,
		trigger: {
			player: "loseAfter",
			global: "loseAsyncAfter",
		},
		filter(event, player) {
			if (event.type != "discard" || event.getlx === false) {
				return;
			}
			var evt = event.getl(player);
			for (var i = 0; i < evt.cards2.length; i++) {
				if (get.position(evt.cards2[i]) == "d") {
					return true;
				}
			}
			return false;
		},
		check(trigger, player) {
			if (
				trigger.getParent(3).name != "phaseDiscard" ||
				!game.hasPlayer(function (current) {
					return current.isDamaged() && get.recoverEffect(current, player, player) > 0;
				})
			) {
				return false;
			}
			var evt = trigger.getl(player);
			for (var i = 0; i < evt.cards2.length; i++) {
				if (get.position(evt.cards2[i], true) == "d" && get.type(evt.cards2[i], false) == "equip") {
					return true;
				}
			}
			return false;
		},
		async content(event, trigger, player) {
			const cards = [],
				cards2 = trigger.getl(player).cards2;
			cards.push(...cards2.filter(card => get.position(card, true) == "d"));
			const result = await player
				.chooseToMove("纵玄：将任意张牌置于牌堆顶（左边的牌更接近牌堆顶）", true, "allowChooseAll")
				.set("list", [["本次弃置的牌", cards], ["牌堆顶"]])
				.set("filterOk", function (moved) {
					if (moved[0].length == 1 && get.type2(moved[0][0], false) == "trick") {
						return true;
					}
					return moved[1].length > 0;
				})
				.set("processAI", function (list) {
					const cards = list[0][1].slice(0),
						player = _status.event.player;
					let result = [[], []];
					if (
						game.hasPlayer(function (current) {
							return current != player && get.attitude(player, current) > 0 && !current.hasSkillTag("nogain");
						})
					) {
						let max_val = 0;
						let max_card = false;
						for (const i of cards) {
							if (get.type2(i, false) == "trick") {
								const val = get.value(i, "raw");
								if (val > max_val) {
									max_card = i;
									max_val = val;
								}
							}
						}
						if (max_card) {
							result[0].push(max_card);
							cards.remove(max_card);
						}
					}
					if (cards.length) {
						let max_val = 0;
						let max_card = false;
						const equip = game.hasPlayer(function (current) {
							return current.isDamaged() && get.recoverEffect(current, player, player) > 0;
						});
						for (const i of cards) {
							let val = get.value(i);
							const type = get.type2(i, false);
							if (type == "basic") {
								val += 3;
							}
							if (type == "equip" && equip) {
								val += 9;
							}
							if (max_val == 0 || val > max_val) {
								max_card = i;
								max_val = val;
							}
						}
						if (max_card) {
							result[1].push(max_card);
							cards.remove(max_card);
						}
						result[0].addArray(cards);
					}
					return result;
				})
				.forResult();
			if (result.bool) {
				const cards = result.moved[1].slice(0);
				if (cards?.length) {
					cards.reverse();
					game.log(player, "将", cards, "置于牌堆顶");
					await game.cardsGotoPile(cards, "insert");
				}
			}
		},
	},
	zhiyan: {
		audio: 2,
		audioname: ["gexuan", "re_yufan"],
		trigger: { player: "phaseJieshuBegin" },
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget({
					prompt: get.prompt("zhiyan"),
					prompt2: "令一名角色摸一张牌并展示之。若为装备牌，则其回复1点体力",
					ai(target) {
						return get.attitude(_status.event.player, target);
					},
				})
				.forResult();
		},
		logTarget: "targets",
		async content(event, trigger, player) {
			const target = event.targets[0];
			let shouldRecover = false;
			const result = await target.draw({ visible: true }).forResult();
			const card = result.cards[0];
			if (get.type(card) == "equip") {
				if (target.getCards("h").includes(card) && target.hasUseTarget(card)) {
					await target.chooseUseTarget(card, true, "nopopup");
					await game.delay();
				}
				shouldRecover = true;
			}
			if (shouldRecover) {
				await target.recover();
			}
		},
		ai: {
			expose: 0.2,
			threaten: 1.2,
		},
	},
	miji: {
		audio: 2,
		audioname: ["re_wangyi"],
		trigger: {
			player: "phaseJieshuBegin",
		},
		locked: false,
		filter(event, player) {
			return player.hp < player.maxHp;
		},
		async content(event, trigger, player) {
			const num = player.getDamagedHp();
			await player.draw(num);
			if (_status.connectMode) {
				game.broadcastAll(() => {
					_status.noclearcountdown = true;
				});
			}

			const check = () => {
				const result = {
					bool: true,
					cards: [],
				};
				const cards = player.getCards("he");
				const targets = game.filterPlayer(current => player !== current);

				for (const card of cards) {
					const val = get.value(card, player);
					let max = val;
					let target = null;
					for (const targetx of targets) {
						const otherVal = get.value(card, targetx);
						if (otherVal > max) {
							max = otherVal;
							target = targetx;
						}
					}
					if (target != null) {
						result.cards.push([card, target, max - val]);
					}
				}
				if (result.cards.length < num) {
					result.bool = false;
				} else if (result.cards.length > num) {
					result.cards
						.sort((a, b) => {
							return b[2] - a[2];
						})
						.slice(0, num);
				}
				return result;
			};

			let given = 0;
			let forced = false;
			const givenMap = new Map();
			const aiCheck = check();
			while (given < num) {
				const result = await player
					.chooseCardTarget({
						filterTarget: lib.filter.notMe,
						filterCard(card) {
							return get.itemtype(card) === "card" && !card.hasGaintag("miji_tag");
						},
						selectCard: [1, num - given],
						prompt: "请选择要分配的卡牌和目标",
						forced,
						ai1(card) {
							const event = get.event();
							if (!event.res.bool || ui.selected.cards.length) {
								return 0;
							}
							for (const arr of event.res.cards) {
								if (arr[0] === card) {
									return arr[2];
								}
							}
							return 0;
						},
						ai2(target) {
							const event = get.event();
							const card = ui.selected.cards[0];
							for (const arr of event.res.cards) {
								if (arr[0] === card) {
									return get.attitude(player, target);
								}
							}
							const val = target.getUseValue(card);
							if (val > 0) {
								return val * get.attitude(player, target) * 2;
							}
							return get.value(card, target) * get.attitude(player, target);
						},
					})
					.set("res", aiCheck)
					.forResult();

				if (!result.bool || !result.cards?.length || !result.targets?.length) {
					break;
				}

				forced = true;
				const cards = result.cards;
				const target = result.targets[0].playerid;
				player.addGaintag(cards, "miji_tag");
				given += cards.length;
				if (!givenMap.has(target)) {
					givenMap.set(target, []);
				}
				givenMap.get(target).addArray(cards);
			}

			if (_status.connectMode) {
				game.broadcastAll(() => {
					delete _status.noclearcountdown;
					game.stopCountChoose();
				});
			}

			if (!givenMap.size) {
				return;
			}

			const map = [];
			const cards = [];
			for (const [name, cardxs] of givenMap) {
				const source = (_status.connectMode ? lib.playerOL : game.playerMap)[name];
				player.line(source, "green");
				if (player !== source && (get.mode() !== "identity" || player.identity !== "nei")) {
					player.addExpose(0.18);
				}
				map.push([source, cardxs]);
				cards.addArray(cardxs);
			}

			const loseAsyncEvent = game.loseAsync({
				gain_list: map,
				player: player,
				cards,
				giver: player,
				animate: "giveAuto",
			});
			loseAsyncEvent.setContent("gaincardMultiple");
			await loseAsyncEvent;
		},
		mod: {
			aiOrder(player, card, num) {
				if (num > 0 && _status.event && _status.event.type === "phase" && get.tag(card, "recover")) {
					if (player.needsToDiscard()) {
						return num / 3;
					}
					return 0;
				}
			},
		},
		ai: {
			threaten(player, target) {
				return 0.6 + 0.7 * target.getDamagedHp();
			},
			effect: {
				target(card, player, target) {
					if (target.hp <= 2 && get.tag(card, "damage")) {
						let num = 1;
						if (
							get.itemtype(player) === "player" &&
							player.hasSkillTag("damageBonus", false, {
								target: target,
								card: card,
							}) &&
							!target.hasSkillTag("filterDamage", null, {
								player: player,
								card: card,
							})
						) {
							num = 2;
						}
						if (target.hp > num) {
							return [1, 1];
						}
					}
				},
			},
		},
	},
	zhenlie: {
		audio: 2,
		audioname: ["re_wangyi"],
		filter(event, player) {
			return event.player != player && event.card && (event.card.name == "sha" || get.type(event.card) == "trick");
		},
		logTarget: "player",
		check(event, player) {
			if (event.getParent().excluded.includes(player)) {
				return false;
			}
			if (get.attitude(player, event.player) > 0 || (player.hp < 2 && !get.tag(event.card, "damage"))) {
				return false;
			}
			let evt = event.getParent(),
				directHit = (evt.nowuxie && get.type(event.card, "trick") === "trick") || (evt.directHit && evt.directHit.includes(player)) || (evt.customArgs && evt.customArgs.default && evt.customArgs.default.directHit2);
			if (get.tag(event.card, "respondSha")) {
				if (directHit || player.countCards("h", { name: "sha" }) === 0) {
					return true;
				}
			} else if (get.tag(event.card, "respondShan")) {
				if (directHit || player.countCards("h", { name: "shan" }) === 0) {
					return true;
				}
			} else if (get.tag(event.card, "damage")) {
				if (event.card.name === "huogong") {
					return event.player.countCards("h") > 4 - player.hp - player.hujia;
				}
				if (event.card.name === "shuiyanqijunx") {
					return player.countCards("e") === 0;
				}
				return true;
			} else if (player.hp > 2) {
				if (event.card.name === "shunshou" || (event.card.name === "zhujinqiyuan" && (event.card.yingbian || get.distance(event.player, player) < 0))) {
					return true;
				}
			}
			return false;
		},
		trigger: { target: "useCardToTargeted" },
		async content(event, trigger, player) {
			if (get.attitude(player, trigger.player) < 0 && trigger.player.countDiscardableCards(player, "he")) {
				player.addTempSkill("zhenlie_lose");
			}
			await player.loseHp();
			player.removeSkill("zhenlie_lose");
			trigger.getParent().excluded.add(player);
			if (trigger.player.countCards("he")) {
				if (get.mode() !== "identity" || player.identity !== "nei") {
					player.addExpose(0.12);
				}
				await player.discardPlayerCard({
					target: trigger.player,
					position: "he",
					forced: true,
				});
			}
		},
		subSkill: {
			lose: {
				charlotte: true,
			},
		},
		ai: {
			filterDamage: true,
			skillTagFilter: (player, tag, arg) => {
				return arg && arg.jiu == true;
			},
			effect: {
				target(card, player, target) {
					if (target.hp <= 0 && target.hasSkill("zhenlie_lose") && get.tag(card, "recover")) {
						return [1, 1.2];
					}
				},
			},
		},
	},
	//吾彦...
	wuyan: { audio: 2 },
	xswuyan: {
		audio: "wuyan",
		trigger: { target: "useCardToBefore", player: "useCardToBefore" },
		forced: true,
		check(event, player) {
			return get.effect(event.target, event.card, event.player, player) < 0;
		},
		filter(event, player) {
			if (!event.target) {
				return false;
			}
			if (event.player == player && event.target == player) {
				return false;
			}
			return get.type(event.card) == "trick";
		},
		async content(event, trigger, player) {
			trigger.cancel();
		},
		ai: {
			effect: {
				target(card, player, target, current) {
					if (get.type(card) == "trick" && player != target) {
						return "zeroplayertarget";
					}
				},
				player(card, player, target, current) {
					if (get.type(card) == "trick" && player != target) {
						return "zeroplayertarget";
					}
				},
			},
		},
	},
	xinwuyan: {
		audio: 2,
		trigger: { source: "damageBegin2", player: "damageBegin4" },
		forced: true,
		check(event, player) {
			if (player == event.player) {
				return true;
			}
			return false;
		},
		filter(event, player) {
			return get.type(event.card, "trick") == "trick";
		},
		async content(event, trigger, player) {
			trigger.cancel();
		},
		ai: {
			notrick: true,
			notricksource: true,
			effect: {
				target(card, player, target, current) {
					if (get.type(card) == "trick" && get.tag(card, "damage")) {
						return "zeroplayertarget";
					}
				},
				player(card, player, target, current) {
					if (get.type(card) == "trick" && get.tag(card, "damage")) {
						return "zeroplayertarget";
					}
				},
			},
		},
	},
	xinjujian: {
		trigger: { player: "phaseJieshuBegin" },
		audio: 2,
		filter(event, player) {
			return player.countCards("he") > player.countCards("he", { type: "basic" });
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseCardTarget({
					filterTarget(card, player, target) {
						return player != target;
					},
					filterCard(card, player) {
						return get.type(card) != "basic" && lib.filter.cardDiscardable(card, player);
					},
					ai1(card) {
						if (get.tag(card, "damage") && get.type(card) == "trick") {
							return 20;
						}
						return 9 - get.value(card);
					},
					ai2(target) {
						var att = get.attitude(_status.event.player, target);
						if (att > 0) {
							if (target.isTurnedOver()) {
								att += 3;
							}
							if (target.hp == 1) {
								att += 3;
							}
						}
						return att;
					},
					position: "he",
					prompt: get.prompt2("xinjujian"),
				})
				.forResult();
		},
		logTarget: "targets",
		async content(event, trigger, player) {
			const target = event.targets[0];

			await player.discard(event.cards);

			const controls = ["draw_card"];
			if (target.hp < target.maxHp) {
				controls.push("recover_hp");
			}
			if (target.isLinked() || target.isTurnedOver()) {
				controls.push("reset_character");
			}

			let result;
			if (controls.length === 1) {
				result = { control: controls[0] };
			} else {
				result = await target
					.chooseControl({
						controls,
						ai() {
							const target = get.event().target;
							if (target.isTurnedOver()) {
								return "reset_character";
							} else if (target.hp == 1 && target.maxHp > 2) {
								return "recover_hp";
							} else if (target.hp == 2 && target.maxHp > 2 && target.countCards("h") > 1) {
								return "recover_hp";
							} else {
								return "draw_card";
							}
						},
					})
					.set("target", target)
					.forResult();
			}

			switch (result.control) {
				case "recover_hp":
					await target.recover();
					break;
				case "draw_card":
					await target.draw(2);
					break;
				case "reset_character":
					if (target.isTurnedOver()) {
						await target.turnOver();
					}
					if (target.isLinked()) {
						await target.link();
					}
					break;
			}
		},
		ai: {
			expose: 0.2,
			threaten: 1.4,
		},
	},
	jujian: {
		enable: "phaseUse",
		usable: 1,
		audio: 2,
		filterCard: true,
		position: "he",
		selectCard: [1, 3],
		check(card) {
			var player = get.owner(card);
			if (get.type(card) == "trick") {
				return 10;
			}
			if (player.countCards("h") - player.hp - ui.selected.cards.length > 0) {
				return 8 - get.value(card);
			}
			return 4 - get.value(card);
		},
		filterTarget(card, player, target) {
			return player != target;
		},
		async content(event, trigger, player) {
			const { cards, target } = event;
			target.draw(cards.length);
			if (cards.length == 3) {
				if (get.type(cards[0], "trick") == get.type(cards[1], "trick") && get.type(cards[0], "trick") == get.type(cards[2], "trick")) {
					player.recover();
				}
			}
		},
		ai: {
			expose: 0.2,
			order: 1,
			result: {
				target: 1,
			},
		},
	},
	yizhong: {
		trigger: { target: "shaBefore" },
		forced: true,
		audio: 2,
		filter(event, player) {
			if (!player.hasEmptySlot(2)) {
				return false;
			}
			return event.card.name == "sha" && get.color(event.card) == "black";
		},
		async content(event, trigger, player) {
			trigger.cancel();
		},
		ai: {
			effect: {
				target(card, player, target) {
					if (player == target && get.subtypes(card).includes("equip2")) {
						if (get.equipValue(card) <= 8) {
							return 0;
						}
					}
					if (!player.hasEmptySlot(2)) {
						return;
					}
					if (card.name == "sha" && get.color(card) == "black") {
						return "zeroplayertarget";
					}
				},
			},
		},
	},
	jueqing: {
		audio: 2,
		audioname: ["ol_zhangchunhua"],
		trigger: { source: "damageBefore" },
		forced: true,
		async content(event, trigger, player) {
			trigger.cancel();
			trigger.player.loseHp(trigger.num);
		},
		ai: {
			jueqing: true,
		},
	},
	shangshi: {
		audio: 2,
		audioname: ["ol_zhangchunhua"],
		audioname2: {
			re_zhangchunhua: "reshangshi",
		},
		trigger: {
			player: ["loseAfter", "changeHp", "gainMaxHpAfter", "loseMaxHpAfter"],
			global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"],
		},
		frequent: true,
		filter(event, player) {
			if (event.getl && !event.getl(player)) {
				return false;
			}
			return player.countCards("h") < player.getDamagedHp();
		},
		async content(event, trigger, player) {
			player.draw(player.getDamagedHp() - player.countCards("h"));
		},
		ai: {
			noh: true,
			freeSha: true,
			freeShan: true,
			skillTagFilter(player, tag) {
				if (player.maxHp - player.hp < player.countCards("h")) {
					return false;
				}
			},
		},
	},
	luoying: {
		//unique:true,
		//gainable:true,
		audio: 2,
		group: ["luoying_discard", "luoying_judge"],
		subfrequent: ["judge"],
		subSkill: {
			discard: {
				audio: "luoying",
				trigger: { global: "loseAfter" },
				filter(event, player) {
					if (event.type != "discard" || event.getlx === false) {
						return false;
					}
					var cards = event.cards.slice(0);
					var evt = event.getl(player);
					if (evt && evt.cards) {
						cards.removeArray(evt.cards);
					}
					for (var i = 0; i < cards.length; i++) {
						if (cards[i].original != "j" && get.suit(cards[i], event.player) == "club" && get.position(cards[i], true) == "d") {
							return true;
						}
					}
					return false;
				},
				async cost(event, trigger, player) {
					if (trigger.delay == false) {
						await game.delay();
					}
					const cards2 = trigger.cards.slice(0);
					const evt = trigger.getl(player);
					if (evt && evt.cards) {
						cards2.removeArray(evt.cards);
					}
					const cards = cards2.filter(card => card.original !== "j" && get.suit(card, trigger.player) === "club" && get.position(card, true) === "d");
					if (!cards.length) {
						return;
					}

					event.result = await player
						.chooseButton({
							createDialog: ["落英：选择要获得的牌", cards],
							selectButton: [1, cards.length],
							ai(button) {
								return get.value(button.link, _status.event.player, "raw");
							},
						})
						.forResult();
					event.result.cards = event.result.links;
				},
				async content(event, trigger, player) {
					await player.gain({
						cards: event.cards,
						animate: "gain2",
						log: true,
					});
				},
			},
			judge: {
				audio: "luoying",
				trigger: { global: "cardsDiscardAfter" },
				//frequent:'check',
				filter(event, player) {
					var evt = event.getParent().relatedEvent;
					if (!evt || evt.name != "judge") {
						return;
					}
					if (evt.player == player) {
						return false;
					}
					if (get.position(event.cards[0], true) != "d") {
						return false;
					}
					return get.suit(event.cards[0]) == "club";
				},
				async cost(event, trigger, player) {
					const result = await player
						.chooseButton({
							createDialog: ["落英：选择要获得的牌", trigger.cards],
							selectButton: [1, trigger.cards.length],
							ai(button) {
								return get.value(button.link, _status.event.player, "raw");
							},
						})
						.forResult();

					event.result = {
						bool: result.bool,
						cards: result.links,
					};
				},
				async content(event, trigger, player) {
					await player.gain({
						cards: event.cards,
						animate: "gain2",
						log: true,
					});
				},
			},
		},
	},
	jiushi: {
		audio: "jiushi1",
		group: ["jiushi1", "jiushi3"],
	},
	jiushi1: {
		audio: 2,
		enable: "chooseToUse",
		sourceSkill: "jiushi",
		hiddenCard(player, name) {
			if (name == "jiu") {
				return !player.isTurnedOver();
			}
			return false;
		},
		filter(event, player) {
			if (player.classList.contains("turnedover")) {
				return false;
			}
			return event.filterCard({ name: "jiu", isCard: true }, player, event);
		},
		async content(event, trigger, player) {
			if (_status.event.getParent(2).type == "dying") {
				event.dying = player;
				event.type = "dying";
			}
			await player.turnOver();
			await player.useCard({ name: "jiu", isCard: true }, player);
		},
		ai: {
			save: true,
			skillTagFilter(player, tag, arg) {
				return !player.isTurnedOver() && _status.event?.dying == player;
			},
			order: 5,
			result: {
				player(player) {
					if (_status.event.parent.name == "phaseUse") {
						if (player.countCards("h", "jiu") > 0) {
							return 0;
						}
						if (player.getEquip("zhuge") && player.countCards("h", "sha") > 1) {
							return 0;
						}
						if (!player.countCards("h", "sha")) {
							return 0;
						}
						var targets = [];
						var target;
						var players = game.filterPlayer();
						for (var i = 0; i < players.length; i++) {
							if (get.attitude(player, players[i]) < 0) {
								if (player.canUse("sha", players[i], true, true)) {
									targets.push(players[i]);
								}
							}
						}
						if (targets.length) {
							target = targets[0];
						} else {
							return 0;
						}
						var num = get.effect(target, { name: "sha" }, player, player);
						for (var i = 1; i < targets.length; i++) {
							var num2 = get.effect(targets[i], { name: "sha" }, player, player);
							if (num2 > num) {
								target = targets[i];
								num = num2;
							}
						}
						if (num <= 0) {
							return 0;
						}
						var e2 = target.getEquip(2);
						if (e2) {
							if (e2.name == "tengjia") {
								if (!player.countCards("h", { name: "sha", nature: "fire" }) && !player.getEquip("zhuque")) {
									return 0;
								}
							}
							if (e2.name == "renwang") {
								if (!player.countCards("h", { name: "sha", color: "red" })) {
									return 0;
								}
							}
							if (e2.name == "baiyin") {
								return 0;
							}
						}
						if (player.getEquip("guanshi") && player.countCards("he") > 2) {
							return 1;
						}
						return target.countCards("h") > 3 ? 0 : 1;
					}
					if (player == _status.event.dying || player.isTurnedOver()) {
						return 3;
					}
				},
			},
			effect: {
				target(card, player, target) {
					if (target.isTurnedOver()) {
						if (get.tag(card, "damage")) {
							if (player.hasSkillTag("jueqing", false, target)) {
								return [1, -2];
							}
							if (target.hp == 1) {
								return;
							}
							return [1, target.countCards("h") / 2];
						}
					}
				},
			},
		},
	},
	jiushi3: {
		audio: "jiushi1",
		trigger: { player: "damageEnd" },
		sourceSkill: "jiushi",
		check(event, player) {
			return player.isTurnedOver();
		},
		prompt: "是否发动【酒诗】，将武将牌翻面？",
		filter(event, player) {
			if (event.checkJiushi) {
				return true;
			}
			return false;
		},
		async content(event, trigger, player) {
			player.turnOver();
		},
	},
	zongshi: {
		audio: 2,
		mod: {
			maxHandcard(player, num) {
				return num + game.countGroup();
			},
		},
	},
	zishou: {
		audio: 2,
		audioname: ["re_liubiao"],
		trigger: { player: "phaseDrawBegin2" },
		check(event, player) {
			return player.countCards("h") <= (player.hasSkill("zongshi") ? player.maxHp : player.hp - 2) || player.skipList.includes("phaseUse");
		},
		filter(event, player) {
			return !event.numFixed;
		},
		async content(event, trigger, player) {
			trigger.num += game.countGroup();
			player.addTempSkill("zishou2");
		},
		ai: {
			threaten: 1.5,
		},
	},
	zishou2: {
		mod: {
			playerEnabled(card, player, target) {
				if (player != target) {
					return false;
				}
			},
		},
	},
	olddanshou: {
		audio: "danshou",
		trigger: { source: "damageSource" },
		//priority:9,
		check(event, player) {
			return get.attitude(player, event.player) <= 0;
		},
		async content(event, trigger, player) {
			await player.draw();
			const cards = Array.from(ui.ordering.childNodes);
			cards.forEach(card => card.discard());
			const evt = _status.event.getParent("phase", true);
			if (evt) {
				game.resetSkills();
				_status.event = evt;
				_status.event.finish();
				_status.event.untrigger(true);
			}
		},
		ai: {
			jueqing: true,
		},
	},
	danshou: {
		enable: "phaseUse",
		filterCard: true,
		position: "he",
		audio: 2,
		filter(event, player) {
			var num = player.getStat().skill.danshou;
			if (num) {
				num++;
			} else {
				num = 1;
			}
			return player.countCards("he") >= num;
		},
		check(card) {
			if (ui.selected.cards.length >= 2) {
				return 4 - get.value(card);
			}
			return 6 - get.value(card);
		},
		selectCard(card) {
			var num = _status.event.player.getStat().skill.danshou;
			if (num) {
				return num + 1;
			}
			return 1;
		},
		filterTarget(card, player, target) {
			if (player == target) {
				return false;
			}
			var num = player.getStat().skill.danshou;
			if (num) {
				num++;
			} else {
				num = 1;
			}
			if (num <= 2 && !target.countCards("he")) {
				return false;
			}
			return player.inRange(target);
		},
		async content(event, trigger, player) {
			const { target } = event;
			const num = player.getStat().skill.danshou;
			switch (num) {
				case 1:
					await player.discardPlayerCard({
						target,
						forced: true,
					});
					return;
				case 2: {
					const result = await target
						.chooseCard({
							prompt: "选择一张牌交给" + get.translation(player),
							position: "he",
							forced: true,
						})
						.forResult();
					if (result.cards) {
						await target.give(result.cards, player);
					}
					return;
				}
				case 3:
					await target.damage({
						nocard: true,
					});
					return;
				default:
					await game.asyncDraw([player, target], 2);
			}
		},
		ai: {
			order: 8.6,
			result: {
				target(player, target) {
					var num = player.getStat().skill.danshou;
					if (num) {
						num++;
					} else {
						num = 1;
					}
					if (num > 3) {
						return 0;
					}
					if (num == 3) {
						return get.damageEffect(target, player, target);
					}
					return -1;
				},
			},
		},
	},
	qice: {
		audio: 2,
		audioname: ["clan_xunyou", "pot_huanjie"],
		enable: "phaseUse",
		filter(event, player) {
			const hs = player.getCards("h");
			if (!hs.length) {
				return false;
			}
			if (
				hs.some(card => {
					const mod2 = game.checkMod(card, player, "unchanged", "cardEnabled2", player);
					return mod2 === false;
				})
			) {
				return false;
			}
			return lib.inpile.some(name => {
				if (get.type(name) != "trick") {
					return false;
				}
				const card = get.autoViewAs({ name }, hs);
				return event.filterCard(card, player, event);
			});
		},
		usable: 1,
		chooseButton: {
			dialog(player) {
				var list = [];
				for (var i = 0; i < lib.inpile.length; i++) {
					if (get.type(lib.inpile[i]) == "trick") {
						list.push(["锦囊", "", lib.inpile[i]]);
					}
				}
				return ui.create.dialog(get.translation("qice"), [list, "vcard"]);
			},
			filter(button, player) {
				const event = _status.event.getParent(),
					card = get.autoViewAs(
						{
							name: button.link[2],
						},
						player.getCards("h")
					);
				return event.filterCard(card, player, event);
			},
			check(button) {
				var player = _status.event.player;
				var recover = 0,
					lose = 1,
					players = game.filterPlayer();
				for (var i = 0; i < players.length; i++) {
					if (players[i].hp == 1 && get.damageEffect(players[i], player, player) > 0 && !players[i].hasSha()) {
						return button.link[2] == "juedou" ? 2 : -1;
					}
					if (!players[i].isOut()) {
						if (players[i].hp < players[i].maxHp) {
							if (get.attitude(player, players[i]) > 0) {
								if (players[i].hp < 2) {
									lose--;
									recover += 0.5;
								}
								lose--;
								recover++;
							} else if (get.attitude(player, players[i]) < 0) {
								if (players[i].hp < 2) {
									lose++;
									recover -= 0.5;
								}
								lose++;
								recover--;
							}
						} else {
							if (get.attitude(player, players[i]) > 0) {
								lose--;
							} else if (get.attitude(player, players[i]) < 0) {
								lose++;
							}
						}
					}
				}
				if (lose > recover && lose > 0) {
					return button.link[2] == "nanman" ? 1 : -1;
				}
				if (lose < recover && recover > 0) {
					return button.link[2] == "taoyuan" ? 1 : -1;
				}
				return button.link[2] == "wuzhong" ? 1 : -1;
			},
			backup(links, player) {
				return {
					audio: "qice",
					audioname: ["clan_xunyou"],
					filterCard: true,
					selectCard: -1,
					position: "h",
					popname: true,
					viewAs: { name: links[0][2] },
				};
			},
			prompt(links, player) {
				return "将全部手牌当作" + get.translation(links[0][2]) + "使用";
			},
		},
		ai: {
			order: 1,
			result: {
				player(player) {
					var num = 0;
					var cards = player.getCards("h");
					if (cards.length >= 3 && player.hp >= 3) {
						return 0;
					}
					for (var i = 0; i < cards.length; i++) {
						num += Math.max(0, get.value(cards[i], player, "raw"));
					}
					num /= cards.length;
					num *= Math.min(cards.length, player.hp);
					return 12 - num;
				},
			},
			nokeep: true,
			skillTagFilter(player, tag, arg) {
				if (tag === "nokeep") {
					return (!arg || (arg.card && get.name(arg.card) === "tao")) && player.isPhaseUsing() && !player.getStat("skill").qice && player.hasCard(card => get.name(card) != "tao", "h");
				}
			},
			threaten: 1.6,
		},
	},
	zhiyu: {
		audio: 2,
		audioname2: { sxrm_caocao: "zhiyu_sxrm_caocao" },
		trigger: { player: "damageEnd" },
		preHidden: true,
		async content(event, trigger, player) {
			await player.draw();
			if (!player.hasCard(() => true, "h")) {
				return;
			}
			await player.showHandcards();
			if (!trigger.source) {
				return;
			}
			const cards = player.getCards("h");
			const color = get.color(cards[0], player);
			for (const card of cards.slice(1)) {
				if (get.color(card, player) !== color) {
					return;
				}
			}
			await trigger.source.chooseToDiscard({ forced: true });
		},
		ai: {
			maixie_defend: true,
			threaten: 0.9,
		},
	},
	xuanfeng: {
		audio: 2,
		audioname: ["boss_lvbu3"],
		audioname2: {
			re_heqi: "fenwei_heqi",
		},
		trigger: {
			player: ["loseAfter", "phaseDiscardEnd"],
			global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"],
		},
		filter(event, player) {
			if (event.name == "phaseDiscard") {
				var cards = [];
				player.getHistory("lose", function (evt) {
					if (evt && evt.type == "discard" && evt.getParent("phaseDiscard") == event && evt.hs) {
						cards.addArray(evt.hs);
					}
				});
				return cards.length > 1;
			} else {
				var evt = event.getl(player);
				return evt && evt.es && evt.es.length > 0;
			}
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget({
					prompt: get.prompt2("xuanfeng"),
					filterTarget(event, player, target) {
						return player !== target && target.countDiscardableCards(player, "he") > 0;
					},
					ai(target) {
						const player = get.player();
						return -get.attitude(player, target);
					},
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const target1 = event.targets[0];
			player.line(target1, "green");
			await player.discardPlayerCard({
				target: target1,
				position: "he",
				forced: true,
			});

			const result = await player
				.chooseTarget({
					prompt: "旋风：弃置一名其他角色的一张牌",
					filterTarget(event, player, target) {
						return player !== target && target.countDiscardableCards(player, "he") > 0;
					},
					ai(target) {
						const player = get.player();
						return -get.attitude(player, target);
					},
				})
				.forResult();
			if (!result.bool || !result.targets?.length) {
				return;
			}

			const target2 = result.targets[0];
			player.line(target2, "green");
			await player.discardPlayerCard({
				target: target2,
				position: "he",
				forced: true,
			});
		},
		ai: {
			effect: {
				target(card, player, target, current) {
					if (get.type(card) == "equip" && !get.cardtag(card, "gifts")) {
						return [1, 3];
					}
				},
			},
			reverseEquip: true,
			noe: true,
		},
	},
	jiangchi: {
		audio: 2,
		trigger: { player: "phaseDrawBegin2" },
		filter(event, player) {
			return !event.numFixed;
		},
		async cost(event, trigger, player) {
			const result = await player
				.chooseControl({
					controls: ["jiangchi_less", "jiangchi_more", "cancel2"],
					ai() {
						const player = get.player();
						if (player.countCards("h") > 3 && player.countCards("h", "sha") > 1) {
							return "jiangchi_less";
						}
						if (player.countCards("h", "sha") > 2) {
							return "jiangchi_less";
						}
						if (player.hp - player.countCards("h") > 1) {
							return "jiangchi_more";
						}
						return "cancel2";
					},
				})
				.forResult();

			event.result = {
				bool: result.control !== "cancel2",
				cost_data: {
					control: result.control,
				},
			};
		},
		async content(event, trigger, player) {
			const { control } = event.cost_data;
			if (control == "jiangchi_less") {
				trigger.num--;
				player.addTempSkill("jiangchi2", "phaseUseEnd");
			} else if (control == "jiangchi_more") {
				trigger.num++;
				player.addTempSkill("jiangchi3", "phaseUseEnd");
			}
		},
	},
	jiangchi2: {
		mod: {
			targetInRange(card, player, target, now) {
				if (card.name == "sha") {
					return true;
				}
			},
			cardUsable(card, player, num) {
				if (card.name == "sha") {
					return num + 1;
				}
			},
		},
	},
	jiangchi3: {
		mod: {
			cardEnabled2(card) {
				if (card.name == "sha") {
					return false;
				}
			},
		},
	},
	xinzhan: {
		audio: 2,
		enable: "phaseUse",
		filter(event, player) {
			return player.countCards("h") > player.maxHp;
		},
		usable: 1,
		async content(event, trigger, player) {
			const cards = get.cards(3);
			const result = await player
				.chooseCardButton({
					prompt: "选择获得的红桃牌",
					cards,
					filter(button) {
						return get.suit(button.link) === "heart";
					},
					select: [1, Infinity],
				})
				.forResult();
			if (result.bool) {
				await player.gain({
					cards: result.links,
					animate: "draw",
				});
				cards.removeArray(result.links);
			}
			for (const card of cards.slice(0).reverse()) {
				ui.cardPile.insertBefore(card, ui.cardPile.firstChild);
			}
		},
		ai: {
			order: 11,
			result: {
				player: 1,
			},
		},
	},
	huilei: {
		audio: 2,
		trigger: { player: "die" },
		forced: true,
		forceDie: true,
		filter(event) {
			return event.source && event.source.isIn();
		},
		logTarget: "source",
		skillAnimation: true,
		animationColor: "thunder",
		async content(event, trigger, player) {
			trigger.source.discard(trigger.source.getCards("he"));
		},
		ai: {
			threaten: 0.7,
		},
	},
	xinenyuan: {
		audio: 2,
		group: ["xinenyuan1", "xinenyuan2"],
	},
	xinenyuan1: {
		audio: true,
		sourceSkill: "xinenyuan",
		trigger: { player: "gainAfter", global: "loseAsyncAfter" },
		filter(event, player, triggername, target) {
			return target?.isIn();
		},
		getIndex(event, player) {
			return game
				.filterPlayer(current => {
					if (current == player) {
						return false;
					}
					return event.getl?.(current)?.cards2?.filter(card => event.getg?.(player)?.includes(card)).length >= 2;
				})
				.sortBySeat();
		},
		logTarget: (event, player, triggername, target) => target,
		check(event, player, triggername, target) {
			return get.attitude(player, target) > 0;
		},
		prompt2: (event, player, triggername, target) => `令${get.translation(target)}摸一张牌`,
		async content(event, trigger, player) {
			await event.targets[0].draw();
		},
	},
	xinenyuan2: {
		audio: true,
		trigger: { player: "damageEnd" },
		sourceSkill: "xinenyuan",
		check(event, player) {
			const att = get.attitude(player, event.source);
			const num = event.source.countCards("h");
			if (att <= 0) {
				return true;
			}
			if (num > 2) {
				return true;
			}
			if (num) {
				return att < 4;
			}
			return false;
		},
		filter(event, player) {
			return event.source?.isIn() && event.source != player && event.num > 0;
		},
		logTarget: "source",
		prompt2(event, player) {
			return "令" + get.translation(event.source) + "交给你一张手牌或失去1点体力";
		},
		getIndex: event => event.num,
		async content(event, trigger, player) {
			const result = await trigger.source
				.chooseToGive(`恩怨：交给${get.translation(player)}一张手牌，或失去1点体力`, "h", player)
				.set("ai", card => {
					const { player, target } = get.event();
					if (get.effect(player, { name: "losehp" }, player, player) >= 0) {
						return 0;
					}
					if (get.attitude(target, player) > 0) {
						return 11 - get.value(card);
					}
					return 7 - get.value(card);
				})
				.forResult();
			if (!result?.bool) {
				await trigger.source.loseHp();
			}
		},
		ai: {
			maixie_defend: true,
			effect: {
				target(card, player, target) {
					if (player.hasSkillTag("jueqing", false, target)) {
						return [1, -1.5];
					}
					if (!target.hasFriend()) {
						return;
					}
					if (get.tag(card, "damage")) {
						return [1, 0, 0, -0.7];
					}
				},
			},
		},
	},
	enyuan: {
		audio: 4,
		audioname2: { boss_songdiwang: "boss_songdiwang_enyuan" },
		locked: true,
		group: ["enyuan1", "enyuan2"],
	},
	enyuan1: {
		audio: ["enyuan3.mp3", "enyuan4.mp3"],
		audioname2: { boss_songdiwang: "boss_songdiwang_enyuan" },
		trigger: { player: "damageEnd" },
		forced: true,
		sourceSkill: "enyuan",
		filter(event, player) {
			return event.source?.isIn() && event.source != player && event.num > 0;
		},
		logTarget: "source",
		getIndex: event => event.num,
		async content(event, trigger, player) {
			const result = await trigger.source
				.chooseToGive(
					`恩怨：交给${get.translation(player)}一张红桃手牌，或失去1点体力`,
					(card, player) => {
						return get.suit(card) == "heart";
					},
					"h",
					player
				)
				.set("ai", card => {
					const { player, target } = get.event();
					if (get.effect(player, { name: "losehp" }, player, player) >= 0) {
						return 0;
					}
					if (get.attitude(target, player) > 0) {
						return 11 - get.value(card);
					}
					return 7 - get.value(card);
				})
				.forResult();
			if (!result?.bool) {
				await trigger.source.loseHp();
			}
		},
		ai: {
			maixie_defend: true,
			effect: {
				target(card, player, target) {
					if (player.hasSkillTag("jueqing", false, target)) {
						return [1, -2];
					}
					if (!target.hasFriend()) {
						return;
					}
					if (get.tag(card, "damage")) {
						return [1, 0, 0, -1];
					}
				},
			},
		},
	},
	enyuan2: {
		audio: ["enyuan1.mp3", "enyuan2.mp3"],
		audioname2: { boss_songdiwang: "boss_songdiwang_enyuan" },
		trigger: { player: "recoverEnd" },
		forced: true,
		logTarget: "source",
		sourceSkill: "enyuan",
		filter(event, player) {
			return event.source?.isIn() && event.source != player && event.num > 0;
		},
		getIndex: event => event.num,
		async content(event, trigger, player) {
			await trigger.source.draw();
		},
	},
	xuanhuo: {
		audio: 2,
		usable: 1,
		enable: "phaseUse",
		discard: false,
		lose: false,
		delay: 0,
		filter(event, player) {
			return player.countCards("he", { suit: "heart" });
		},
		filterCard(card) {
			return get.suit(card) == "heart";
		},
		filterTarget(card, player, target) {
			if (game.countPlayer() == 2) {
				return false;
			}
			return player != target;
		},
		check(card) {
			var player = get.owner(card);
			var players = game.filterPlayer();
			for (var i = 0; i < players.length; i++) {
				if (players[i] != player && get.attitude(player, players[i]) > 3) {
					break;
				}
			}
			if (i == players.length) {
				return -1;
			}
			return 5 - get.value(card);
		},
		async content(event, trigger, player) {
			const { cards, target } = event;

			await player.give(cards, target);

			let result = await player
				.gainPlayerCard({
					target,
					position: "he",
					forced: true,
				})
				.forResult();

			if (!result.bool || !result.cards?.length) {
				return;
			}

			const card = result.cards[0];
			if (!player.hasCard(cardx => cardx === card, "h")) {
				return;
			}

			result = await player
				.chooseTarget({
					prompt: `将${get.translation(card)}交给另一名其他角色`,
					filterTarget(card, player, target) {
						return target !== get.event().sourcex && target !== player;
					},
					ai(target) {
						return get.attitude(get.event().player, target);
					},
				})
				.set("sourcex", target)
				.forResult();

			if (result.bool && result.targets?.length) {
				await player.give(card, result.targets[0], "give");
				await game.delay();
			}
		},
		ai: {
			result: {
				target: -0.5,
			},
			basic: {
				order: 9,
			},
		},
	},
	ganlu: {
		enable: "phaseUse",
		usable: 1,
		audio: 2,
		selectTarget: 2,
		filterTarget(card, player, target) {
			if (target.isMin()) {
				return false;
			}
			if (ui.selected.targets.length == 0) {
				return true;
			}
			if (ui.selected.targets[0].countCards("e") == 0 && target.countCards("e") == 0) {
				return false;
			}
			return Math.abs(ui.selected.targets[0].countCards("e") - target.countCards("e")) <= player.maxHp - player.hp;
		},
		multitarget: true,
		async content(event, trigger, player) {
			const { targets } = event;
			targets[0].swapEquip(targets[1]);
		},
		ai: {
			order: 10,
			threaten(player, target) {
				return 0.8 * Math.max(1 + target.maxHp - target.hp);
			},
			result: {
				target(player, target) {
					var list1 = [];
					var list2 = [];
					var num = player.maxHp - player.hp;
					var players = game.filterPlayer();
					for (var i = 0; i < players.length; i++) {
						if (get.attitude(player, players[i]) > 0) {
							list1.push(players[i]);
						} else if (get.attitude(player, players[i]) < 0) {
							list2.push(players[i]);
						}
					}
					list1.sort(function (a, b) {
						return a.countCards("e") - b.countCards("e");
					});
					list2.sort(function (a, b) {
						return b.countCards("e") - a.countCards("e");
					});
					var delta;
					for (var i = 0; i < list1.length; i++) {
						for (var j = 0; j < list2.length; j++) {
							delta = list2[j].countCards("e") - list1[i].countCards("e");
							if (delta <= 0) {
								continue;
							}
							if (delta <= num) {
								if (target == list1[i] || target == list2[j]) {
									return get.attitude(player, target);
								}
								return 0;
							}
						}
					}
					return 0;
				},
			},
			effect: {
				target(card, player, target) {
					if (target.hp == target.maxHp && get.tag(card, "damage")) {
						return 0.2;
					}
				},
			},
		},
	},
	buyi: {
		trigger: { global: "dying" },
		//priority:6,
		audio: 2,
		audioname: ["re_wuguotai"],
		filter(event, player) {
			return event.player.hp <= 0 && event.player.countCards("h") > 0;
		},
		async cost(event, trigger, player) {
			let check;
			if (trigger.player.isUnderControl(true, player)) {
				check = player.hasCard(function (card) {
					return get.type(card) != "basic";
				});
			} else {
				check = get.attitude(player, trigger.player) > 0;
			}

			event.result = await player
				.choosePlayerCard({
					prompt: get.prompt("buyi", trigger.player),
					target: trigger.player,
					filterButton(button) {
						if (_status.event.player == _status.event.target) {
							return lib.filter.cardDiscardable(button.link, _status.event.player);
						}
						return true;
					},
					position: "h",
					ai(button) {
						if (!_status.event.check) {
							return 0;
						}
						if (_status.event.target.isUnderControl(true, _status.event.player)) {
							if (get.type(button.link) != "basic") {
								return 10 - get.value(button.link);
							}
							return 0;
						}
						return Math.random();
					},
				})
				.set("check", check)
				.forResult();

			event.result.cards = event.result.links;
		},
		logTarget: "player",
		async content(event, trigger, player) {
			const card = event.cards[0];
			await player.showCards([card], get.translation(player) + "展示的手牌");
			if (get.type(card) !== "basic") {
				await trigger.player.discard(card);
				await trigger.player.recover();
			}
		},
		ai: {
			threaten: 1.4,
		},
	},
	pojun: {
		audio: 2,
		trigger: { source: "damageSource" },
		check(event, player) {
			if (event.player.isTurnedOver()) {
				return get.attitude(player, event.player) > 0;
			}
			if (event.player.hp < 3) {
				return get.attitude(player, event.player) < 0;
			}
			return get.attitude(player, event.player) > 0;
		},
		filter(event) {
			if (event._notrigger.includes(event.player)) {
				return false;
			}
			return event.card && event.card.name == "sha" && event.player.isIn();
		},
		logTarget: "player",
		async content(event, trigger, player) {
			await trigger.player.draw(Math.min(5, trigger.player.hp));
			await trigger.player.turnOver();
		},
	},
	jingce: {
		trigger: { player: "phaseUseEnd" },
		frequent: true,
		filter(event, player) {
			return player.countUsed(null, true) >= player.hp;
		},
		async content(event, trigger, player) {
			player.draw(2);
		},
		audio: 2,
	},
	xinjingce: {
		trigger: { player: "phaseJieshuBegin" },
		frequent: true,
		filter(event, player) {
			return player.countUsed(null, true) >= player.hp;
		},
		async content(event, trigger, player) {
			player.draw(2);
		},
		audio: 2,
	},
	oldchengxiang: {
		audio: "chengxiang",
		inherit: "chengxiang",
		maxNum: 12,
	},
	chengxiang: {
		audio: 2,
		trigger: { player: "damageEnd" },
		filter(event, player) {
			return event.num > 0;
		},
		//模版继承会用到，别问，问就是四个称象合一起，全靠event.name分效果
		//能拿的牌的点数和
		maxNum: 13,
		//亮出牌的数量
		getNum(player, num) {
			return num;
		},
		//拿完牌之后的回调
		async callback(event, trigger, player) {
			return;
		},
		frequent: true,
		async content(event, trigger, player) {
			const num = get.info(event.name).getNum(player, 4);
			event.showCards ??= [];
			const cards = [];
			event.cards = cards;
			//给肌肉曹冲用的，修改称象亮出的牌
			await event.trigger("chengxiangShowBegin");
			cards.addArray(event.showCards);
			if (num > cards.length) {
				cards.addArray(get.cards(num - cards.length));
			}
			await player.showCards(cards, `${get.translation(player)}发动了〖${get.translation(event.name)}〗`, true).set("clearArena", false);
			const maxNum = get.info(event.name).maxNum;
			const result = await player
				.chooseCardButton(cards, `称象：选择任意张点数不大于${maxNum}的牌`, [1, Infinity], true)
				.set("filterButton", function (button) {
					let num = 0;
					for (const selectedButton of ui.selected.buttons) {
						num += get.number(selectedButton.link);
					}
					return num + get.number(button.link) <= _status.event.maxNum;
				})
				.set("maxNum", maxNum)
				.set("ai", function (button) {
					let player = _status.event.player,
						name = get.name(button.link),
						val = get.value(button.link, player);
					if (name === "tao") {
						return val + 2 * Math.min(3, 1 + player.getDamagedHp());
					}
					if (name === "jiu" && player.hp < 3) {
						return val + 2 * (2.8 - player.hp);
					}
					if (name === "wuxie" && player.countCards("j") && !player.hasWuxie()) {
						return val + 5;
					}
					if (player.hp > 1 && (player.hasSkill("renxin") || player.hasSkill("olrenxin")) && player.hasFriend() && get.type(button.link) === "equip") {
						return val + 4;
					}
					return val;
				})
				.forResult();
			game.broadcastAll(ui.clear);
			if (result.links?.length) {
				const { links } = result;
				event.cards2 = links;
				await player.gain(links, "gain2");
				await get.info(event.name).callback(event, trigger, player);
			}
		},
		ai: {
			maixie: true,
			maixie_hp: true,
			effect: {
				target(card, player, target) {
					if (get.tag(card, "damage")) {
						if (player.hasSkillTag("jueqing", false, target)) {
							return [1, -2];
						}
						if (!target.hasFriend()) {
							return;
						}
						if (target.hp >= 4) {
							return [1, 2];
						}
						if (target.hp == 3) {
							return [1, 1.5];
						}
						if (target.hp == 2) {
							return [1, 0.5];
						}
					}
				},
			},
		},
	},
	/*chengxiang: {
		audio: 2,
		trigger: { player: "damageEnd" },
		filter(event, player) {
			return event.num > 0;
		},
		frequent: true,
		async content(event, trigger, player) {
			let num = 4;
			if (!event.showCards) {
				event.showCards = [];
			}
			await event.trigger("chengxiangShowBegin");
			if (event.name == "olchengxiang") {
				let mark = player.countMark("olchengxiang");
				num += mark;
				player.removeMark("olchengxiang", mark, false);
			}
			const cards = [];
			if (num > event.showCards.length) {
				cards.addArray(get.cards(num - event.showCards.length));
				await game.cardsGotoOrdering(cards);
			}
			cards.addArray(event.showCards);
			const videoId = lib.status.videoId++;
			game.broadcastAll(
				function (player, id, cards, num) {
					var str;
					if (player == game.me && !_status.auto) {
						str = "称象：选择任意张点数不大于" + num + "的牌";
					} else {
						str = "称象";
					}
					var dialog = ui.create.dialog(str, cards);
					dialog.videoId = id;
				},
				player,
				videoId,
				cards,
				event.name == "oldchengxiang" ? 12 : 13
			);
			const time = get.utc();
			game.addVideo("showCards", player, ["称象", get.cardsInfo(cards)]);
			game.addVideo("delay", null, 2);
			const next = player.chooseButton([0, Infinity]);
			next.set("dialog", videoId);
			next.set("filterButton", function (button) {
				let num = 0;
				for (let i = 0; i < ui.selected.buttons.length; i++) {
					num += get.number(ui.selected.buttons[i].link);
				}
				return num + get.number(button.link) <= _status.event.maxNum;
			});
			next.set("maxNum", event.name == "oldchengxiang" ? 12 : 13);
			next.set("ai", function (button) {
				let player = _status.event.player,
					name = get.name(button.link),
					val = get.value(button.link, player);
				if (name === "tao") {
					return val + 2 * Math.min(3, 1 + player.getDamagedHp());
				}
				if (name === "jiu" && player.hp < 3) {
					return val + 2 * (2.8 - player.hp);
				}
				if (name === "wuxie" && player.countCards("j") && !player.hasWuxie()) {
					return val + 5;
				}
				if (player.hp > 1 && player.hasSkill("renxin") && player.hasFriend() && get.type(button.link) === "equip") {
					return val + 4;
				}
				return val;
			});
			const result = await next.forResult();
			let cards2 = [];
			if (result.bool && result.links) {
				for (let i = 0; i < result.links.length; i++) {
					cards2.push(result.links[i]);
					cards.remove(result.links[i]);
				}
			} else {
				return;
			}
			let timex = 1000 - (get.utc() - time);
			if (timex > 0) {
				await game.delay(0, timex);
			}
			game.broadcastAll("closeDialog", videoId);
			await player.gain(cards2, "gain2");
			if (event.name == "olchengxiang") {
				let num = cards2.reduce((num, i) => {
					return num + get.number(i, player);
				}, 0);
				if (num == 13) {
					player.addMark("olchengxiang", 1, false);
				}
			}
		},
		ai: {
			maixie: true,
			maixie_hp: true,
			effect: {
				target(card, player, target) {
					if (get.tag(card, "damage")) {
						if (player.hasSkillTag("jueqing", false, target)) {
							return [1, -2];
						}
						if (!target.hasFriend()) {
							return;
						}
						if (target.hp >= 4) {
							return [1, 2];
						}
						if (target.hp == 3) {
							return [1, 1.5];
						}
						if (target.hp == 2) {
							return [1, 0.5];
						}
					}
				},
			},
		},
	},*/
	oldrenxin: {
		audio: "renxin",
		trigger: { global: "dying" },
		//priority:6,
		filter(event, player) {
			return event.player != player && event.player.hp <= 0 && player.countCards("h") > 0;
		},
		check(event, player) {
			if (get.attitude(player, event.player) <= 0) {
				return false;
			}
			if (player.countCards("h", { name: ["tao", "jiu"] }) + event.player.hp < 0) {
				return false;
			}
			return true;
		},
		async content(event, trigger, player) {
			await player.turnOver();
			await player.give(player.getCards("h"), trigger.player);
			await trigger.player.recover();
		},
	},
	renxin: {
		trigger: { global: "damageBegin4" },
		audio: 2,
		audioname: ["re_caochong"],
		//priority:6,
		filter(event, player) {
			return event.player != player && event.player.hp == 1 && player.countCards("he", { type: "equip" }) > 0;
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseToDiscard({
					prompt: get.prompt("renxin", trigger.player),
					prompt2: "弃置一张装备牌并将武将牌翻面，然后防止" + get.translation(trigger.player) + "受到的伤害",
					filterCard: get.filter({ type: "equip" }),
					position: "he",
					ai(card) {
						const player = get.player();
						if (get.attitude(player, _status.event.getTrigger().player) > 3) {
							return 11 - get.value(card);
						}
						return -1;
					},
				})
				.set("chooseonly", true)
				.forResult();
		},
		logTarget: "player",
		async content(event, trigger, player) {
			await player.discard({
				cards: event.cards,
				discarder: player,
			});
			await player.turnOver();
			trigger.cancel();
		},
		ai: {
			expose: 0.5,
		},
	},
	yuce: {
		audio: 2,
		audioname: ["re_manchong"],
		trigger: { player: "damageEnd" },
		filter(event, player) {
			return player.countCards("h") > 0;
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseCard({
					prompt: get.prompt2(event.skill),
					ai(card) {
						if (get.type(card) == "basic") {
							return 1;
						}
						return Math.abs(get.value(card)) + 1;
					},
				})
				.forResult();
		},
		logTarget: "source",
		async content(event, trigger, player) {
			const {
				cards: [card],
				targets,
			} = event;
			await player.showCards(card, get.translation(player) + "发动了【御策】");
			const type = get.type2(card);
			let result;
			if (targets?.length && targets[0]?.isIn()) {
				result = await targets[0]
					.chooseToDiscard({
						prompt: "弃置一张不为" + get.translation(type) + "牌的牌或令" + get.translation(player) + "回复1点体力",
						filterCard(card) {
							return get.type(card, "trick") != _status.event.type;
						},
						ai(card) {
							if (get.recoverEffect(_status.event.getParent().player, _status.event.player, _status.event.player) < 0) {
								return 7 - get.value(card);
							}
							return 0;
						},
					})
					.set("type", type)
					.forResult();
			} else {
				result = { bool: false };
			}
			if (!result.bool) {
				await player.recover({ source: targets?.[0] });
			}
		},
		ai: {
			effect: {
				target(card, player, target) {
					if (get.tag(card, "damage") && target.countCards("h")) {
						return 0.8;
					}
				},
			},
		},
	},
	xiansi: {
		audio: 2,
		audioname: ["re_liufeng"],
		trigger: {
			player: "phaseZhunbeiBegin",
		},
		onremove(player) {
			const cards = player.getExpansions("xiansi");
			if (cards.length) {
				player.loseToDiscardpile(cards);
			}
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget({
					prompt: get.prompt2("xiansi"),
					filterTarget(card, player, target) {
						return target.countCards("he") > 0;
					},
					selectTarget: [1, 2],
					ai(target) {
						const player = get.player();
						return -get.attitude(player, target);
					},
				})
				.forResult();
		},
		logTarget: "targets",
		async content(event, trigger, player) {
			for (const target of event.targets) {
				const result = await player
					.choosePlayerCard({
						target,
						position: "he",
						forced: true,
					})
					.forResult();

				if (!result.bool || !result.cards?.length) {
					return;
				}

				await player.addToExpansion({
					cards: result.cards,
					source: target,
					animate: "give",
					gaintag: ["xiansi"],
				});
			}
		},
		group: "xiansix",
		global: "xiansi2",
		intro: {
			content: "expansion",
			markcount: "expansion",
		},
		ai: {
			threaten: 2,
		},
	},
	xiansix: {},
	xiansi2: {
		audio: 2,
		enable: "chooseToUse",
		audioname2: {
			re_liufeng: "rexiansi",
		},
		viewAs: {
			name: "sha",
			isCard: true,
		},
		filter(event, player) {
			return game.hasPlayer(current => current.hasSkill("xiansix") && current.getExpansions("xiansi").length > 1 && event.filterTarget({ name: "sha" }, player, current));
		},
		filterTarget(card, player, target) {
			let bool = false;
			const players = ui.selected.targets.slice(0);
			for (const current of players) {
				if (current.hasSkill("xiansix") && current.getExpansions("xiansi").length > 1) {
					bool = true;
				}
				break;
			}
			if (!bool && (!target.hasSkill("xiansix") || target.getExpansions("xiansi").length <= 1)) {
				return false;
			}
			return _status.event._backup.filterTarget.apply(this, arguments);
		},
		filterCard() {
			return false;
		},
		selectCard: -1,
		complexSelect: true,
		forceaudio: true,
		prompt: "弃置一名有【逆】的角色的两张【逆】，然后视为对包含其在内的角色使用【杀】。",
		delay: false,
		log: false,
		async precontent(event, trigger, player) {
			const targets = event.result.targets.filter(current => current.getExpansions("xiansi").length > 1 && current.hasSkill("xiansix"));
			if (!targets.length) {
				return;
			}

			let target;
			if (targets.length == 1) {
				target = targets[0];
			} else {
				const result = await player
					.chooseTarget({
						prompt: "选择弃置【陷嗣】牌的目标",
						filterTarget(card, player, target) {
							return get.event().list.includes(target);
						},
						forced: true,
						ai(target) {
							const player = get.player();
							return get.attitude(player, target);
						},
					})
					.set("list", targets)
					.forResult();
				if (!result.bool || !result.targets.length) {
					return;
				}
				target = result.targets[0];
			}

			let links;
			if (target.getExpansions("xiansi").length == 2) {
				links = target.getExpansions("xiansi").slice(0);
			} else {
				const result = await player.chooseCardButton("移去两张“逆”", 2, target.getExpansions("xiansi"), true).forResult();
				if (!result.bool) {
					return;
				}
				links = result.links;
			}

			player.logSkill("xiansi2_log", target);
			game.trySkillAudio("xiansi2", target, true);
			await target.loseToDiscardpile(links);
		},
		ai: {
			order() {
				return get.order({ name: "sha" }) + 0.05;
			},
		},
		subSkill: {
			log: {},
		},
	},
	shibei: {
		trigger: { player: "damageEnd" },
		forced: true,
		audio: 2,
		audioname: ["xin_jushou"],
		audioname2: { sxrm_caocao: "shibei_sxrm_caocao" },
		check(event, player) {
			return player.getHistory("damage").indexOf(event) == 0;
		},
		async content(event, trigger, player) {
			if (player.getHistory("damage").indexOf(trigger) > 0) {
				player.loseHp();
			} else {
				player.recover();
			}
		},
		subSkill: {
			damaged: {},
			ai: {},
		},
		ai: {
			maixie_defend: true,
			threaten: 0.9,
			effect: {
				target(card, player, target) {
					if (player.hasSkillTag("jueqing", false, target)) {
						return;
					}
					if (target.hujia) {
						return;
					}
					if (player._shibei_tmp) {
						return;
					}
					if (target.hasSkill("shibei_ai")) {
						return;
					}
					if (_status.event.getParent("useCard", true) || _status.event.getParent("_wuxie", true)) {
						return;
					}
					if (get.tag(card, "damage")) {
						if (target.getHistory("damage").length > 0) {
							return [1, -2];
						} else {
							if (get.attitude(player, target) > 0 && target.hp > 1) {
								return 0;
							}
							if (get.attitude(player, target) < 0 && !player.hasSkillTag("damageBonus")) {
								if (card.name == "sha") {
									return;
								}
								var sha = false;
								player._shibei_tmp = true;
								var num = player.countCards("h", function (card) {
									if (card.name == "sha") {
										if (sha) {
											return false;
										} else {
											sha = true;
										}
									}
									return get.tag(card, "damage") && player.canUse(card, target) && get.effect(target, card, player, player) > 0;
								});
								delete player._shibei_tmp;
								if (player.hasSkillTag("damage")) {
									num++;
								}
								if (num < 2) {
									var enemies = player.getEnemies();
									if (enemies.length == 1 && enemies[0] == target && player.needsToDiscard()) {
										return;
									}
									return 0;
								}
							}
						}
					}
				},
			},
		},
	},
	shibei_old: {
		audio: 2,
		trigger: { player: "damageAfter" },
		forced: true,
		async content(event, trigger, player) {
			const result = await player
				.judge({
					judge(card) {
						if (player.hasSkill("shibei2")) {
							if (get.color(card) == "black") {
								return -1;
							}
						} else {
							if (get.color(card) == "red") {
								return 1;
							}
						}
						return 0;
					},
				})
				.forResult();
			if (result.judge > 0) {
				await player.recover();
			} else if (result.judge < 0) {
				await player.loseHp();
			}
			if (!player.hasSkill("shibei2")) {
				player.addTempSkill("shibei2");
			}
		},
	},
	shibei2: {},
	jianying: {
		audio: 2,
		locked: false,
		mod: {
			aiOrder(player, card, num) {
				if (typeof card == "object" && player.isPhaseUsing()) {
					var evt = player.getLastUsed();
					if (!evt || !evt.card || evt.getParent("phaseUse") !== _status.event.getParent("phaseUse")) {
						return num;
					}
					if ((get.suit(evt.card) && get.suit(evt.card) == get.suit(card)) || (evt.card.number && evt.card.number == get.number(card))) {
						return num + 10;
					}
				}
			},
		},
		trigger: { player: "useCard" },
		frequent: true,
		filter(event, player) {
			if (!player.isPhaseUsing()) {
				return false;
			}
			player.addTip("jianying", "渐营 " + get.translation(get.suit(event.card, player)) + get.translation(get.strNumber(get.number(event.card, player))), true);
			var evt = player.getLastUsed(1);
			if (!evt || !evt.card) {
				return false;
			}
			var evt2 = evt.getParent("phaseUse");
			if (!evt2 || evt2.name != "phaseUse" || evt2 !== event.getParent("phaseUse")) {
				return false;
			}
			return (get.suit(evt.card) != "none" && get.suit(evt.card) == get.suit(event.card)) || (typeof get.number(evt.card, false) == "number" && get.number(evt.card, false) == get.number(event.card));
		},
		async content(event, trigger, player) {
			player.draw("nodelay");
		},
		group: "jianying_mark",
		init(player) {
			if (player.isPhaseUsing()) {
				var evt = _status.event.getParent("phaseUse");
				var history = player.getHistory("useCard", function (evt2) {
					return evt2.getParent("phaseUse") == evt;
				});
				if (history.length) {
					var trigger = history[history.length - 1];
					if (get.suit(trigger.card, player) == "none" || typeof get.number(trigger.card, player) != "number") {
						return;
					}
					player.storage.jianying_mark = trigger.card;
					player.markSkill("jianying_mark");
					game.broadcastAll(
						function (player, suit) {
							if (player.marks.jianying_mark) {
								player.marks.jianying_mark.firstChild.innerHTML = get.translation(suit);
							}
						},
						player,
						get.suit(trigger.card, player)
					);
					player.when("phaseUseAfter").step(async () => {
						player.unmarkSkill("jianying_mark");
						delete player.storage.jianying_mark;
					});
				}
			}
		},
		onremove(player) {
			player.unmarkSkill("jianying_mark");
			delete player.storage.jianying_mark;
		},
		subSkill: {
			mark: {
				charlotte: true,
				trigger: { player: "useCard1" },
				filter(event, player) {
					return player.isPhaseUsing();
				},
				forced: true,
				popup: false,
				firstDo: true,
				async content(event, trigger, player) {
					if (get.suit(trigger.card, player) == "none" || typeof get.number(trigger.card, player) != "number") {
						player.unmarkSkill("jianying_mark");
					} else {
						player.storage.jianying_mark = trigger.card;
						player.markSkill("jianying_mark");
						game.broadcastAll(
							function (player, suit) {
								if (player.marks.jianying_mark) {
									player.marks.jianying_mark.firstChild.innerHTML = get.translation(suit);
								}
							},
							player,
							get.suit(trigger.card, player)
						);
						player.when("phaseUseAfter").step(async () => {
							player.unmarkSkill("jianying_mark");
							delete player.storage.jianying_mark;
						});
					}
				},
				intro: {
					markcount(card, player) {
						return get.strNumber(get.number(card, player));
					},
					content(card, player) {
						var suit = get.suit(card, player);
						var num = get.number(card, player);
						var str = "<li>上一张牌的花色：" + get.translation(suit);
						str += "<br><li>上一张牌的点数：" + get.strNumber(num);
						return str;
					},
				},
			},
		},
	},
	zzhenggong: {
		trigger: { player: "damageEnd" },
		filter(event, player) {
			return event.source && event.source.countCards("e") > 0;
		},
		async cost(event, trigger, player) {
			const att = get.attitude(player, trigger.source);
			const result = await player
				.gainPlayerCard({
					prompt: get.prompt("zzhenggong"),
					target: trigger.source,
					position: "e",
					ai(button) {
						if (att <= 0) {
							return get.equipValue(button.link);
						}
						return 0;
					},
				})
				.set("chooseonly", true)
				.forResult();

			event.result = {
				bool: result.bool,
				cards: result.links,
			};
		},
		logTarget: "source",
		async content(event, trigger, player) {
			const cards = event.cards;
			await player.gain({
				cards,
				source: trigger.source,
			});
			const card = cards[0];
			if (player.hasCard(cardx => cardx === card, "h")) {
				player.$give(card, player, false);
				await player.equip(card);
			}
		},
		ai: {
			maixie_defend: true,
		},
	},
	zquanji: {
		trigger: { global: "phaseBegin" },
		check(event, player) {
			const att = get.attitude(player, event.player);
			if (att < 0) {
				const nh1 = event.player.countCards("h");
				const nh2 = player.countCards("h");
				return nh1 <= 2 && nh2 > nh1 + 1;
			}
			if (att > 0 && event.player.hasJudge("lebu") && event.player.countCards("h") > event.player.hp + 1) {
				return true;
			}
			return false;
		},
		logTarget: "player",
		filter(event, player) {
			return event.player != player && player.canCompare(event.player);
		},
		async content(event, trigger, player) {
			const { player: target } = trigger;
			const result = await player.chooseToCompare(target);
			if (result?.bool) {
				target.skip("phaseZhunbei");
				target.skip("phaseJudge");
			}
		},
		ai: { expose: 0.2 },
	},
	zbaijiang: {
		skillAnimation: true,
		trigger: { player: "phaseZhunbeiBegin" },
		forced: true,
		juexingji: true,
		derivation: ["zyexin", "zzili", "zpaiyi"],
		filter(event, player) {
			return player.countCards("e") >= 2;
		},
		async content(event, trigger, player) {
			player.awakenSkill(event.name);
			player.gainMaxHp();
			player.changeSkills(["zyexin", "zzili"], ["zquanji", "zzhenggong"]);
		},
	},
	zyexin: {
		trigger: { player: "damageEnd", source: "damageSource" },
		marktext: "权",
		frequent: true,
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
		async content(event, trigger, player) {
			player.addToExpansion("zyexin", get.cards(), "gain2").gaintag.add("zyexin");
		},
		group: "zyexin2",
	},
	zyexin2: {
		enable: "phaseUse",
		usable: 1,
		lose: false,
		discard: false,
		delay: false,
		selectCard: [1, Infinity],
		filterCard: true,
		sourceSkill: "zyexin",
		filter(event, player) {
			return player.getExpansions("zyexin").length > 0;
		},
		prompt: "用任意数量的手牌与等量的“权”交换",
		async content(event, trigger, player) {
			const { cards } = event;
			await player.addToExpansion({
				cards,
				animate: "give",
				source: player,
				gaintag: ["zyexin"],
			});
			const result = await player
				.chooseCardButton({
					prompt: "选择" + get.cnNumber(cards.length) + "张牌作为手牌",
					cards: player.getExpansions("zyexin"),
					select: cards.length,
					forced: true,
					ai(button) {
						return get.value(button.link);
					},
				})
				.forResult();
			await player.gain(result.links, "gain2");
		},
		ai: {
			order: 5,
			result: {
				player: 1,
			},
		},
	},
	zzili: {
		skillAnimation: true,
		juexingji: true,
		derivation: "zpaiyi",
		trigger: { player: "phaseZhunbeiBegin" },
		filter(event, player) {
			return player.getExpansions("zyexin").length >= 4;
		},
		forced: true,
		async content(event, trigger, player) {
			player.awakenSkill(event.name);
			await player.loseMaxHp();
			await player.addSkills("zpaiyi");
		},
		ai: { combo: "zyexin" },
	},
	zpaiyi: {
		trigger: {
			player: "phaseJieshuBegin",
		},
		filter(event, player) {
			return player.getExpansions("zyexin").length;
		},
		async cost(event, trigger, player) {
			let result = await player
				.chooseCardButton({
					prompt: get.prompt("zpaiyi"),
					cards: player.getExpansions("zyexin"),
					ai(button) {
						return get.value(button.link);
					},
				})
				.forResult();

			if (!result.bool || !result.links?.length) {
				event.result = { bool: false };
				return;
			}

			const cards = result.links;

			result = await player
				.chooseTarget({
					selectTarget(card, player, target) {
						card = get.event().card;
						const type = get.type(card);
						switch (type) {
							case "basic":
							case "trick":
								return true;
							case "delay":
								return target.canAddJudge(card);
							case "equip":
								return target.canEquip(card, true);
						}
						return true;
					},
					ai(target) {
						const { player, card } = get.event();
						return get.effect(target, card, player, player);
					},
				})
				.set("card", cards[0])
				.forResult();

			if (!result.bool || !result.targets?.length) {
				event.result = { bool: false };
				return;
			}

			const targets = result.targets;

			event.result = {
				bool: true,
				cards,
				targets,
			};
		},
		logTarget: "targets",
		async content(event, trigger, player) {
			const { cards, targets } = event;
			const card = cards[0];
			const target = targets[0];

			switch (type) {
				case "basic":
				case "trick":
					await player.give(card, target, "give");
					break;
				case "delay":
					player.$give(card, target, false);
					await target.addJudge(card);
					break;
				case "equip":
					player.$give(card, target, false);
					await target.equip(card);
					break;
			}

			if (player === target) {
				return;
			}

			const result = await player.chooseBool({ prompt: "是否摸一张牌？" }).forResult();
			if (result.bool) {
				await player.draw();
			}
		},
		ai: {
			combo: "zyexin",
		},
	},
};

export default skills;
