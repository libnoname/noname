import { lib, game, ui, get, ai, _status } from "noname";
import html from "dedent";

/** @type { importCharacterConfig["skill"] } */
const skills = {
	//【众】
	hm_zhong_heart_skill: {
		equipSkill: true,
		forced: true,
		trigger: {
			player: "damageEnd",
		},
		async content(event, trigger, player) {
			player.addSkill("hm_zhong_heart_skill_buff");
			player.addMark("hm_zhong_heart_skill_buff", player.countCards("e", { name: "hm_zhong_heart" }));
		},
		subSkill: {
			buff: {
				charlotte: true,
				mod: {
					attackRange(player, num) {
						return num + player.countMark("hm_zhong_heart_skill_buff");
					},
					targetInRange(card) {
						if (card.name == "sha") {
							return true;
						}
					},
				},
			},
		},
	},
	hm_zhong_diamond_skill: {
		equipSkill: true,
		forced: true,
		trigger: {
			player: "damageEnd",
		},
		async content(event, trigger, player) {
			await player.draw(2 * player.countCards("e", { name: "hm_zhong_diamond" }));
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
						let num = target.countCards("e", { name: "hm_zhong_diamond" });
						if (target.hp >= 4) {
							return [1, num * 2];
						}
						if (target.hp == 3) {
							return [1, num * 1.5];
						}
						if (target.hp == 2) {
							return [1, num * 0.5];
						}
					}
				},
			},
		},
	},
	hm_zhong_club_skill: {
		equipSkill: true,
		forced: true,
		trigger: {
			player: "damageEnd",
		},
		async content(event, trigger, player) {
			player.addSkill("hm_zhong_club_skill_buff");
			player.addMark("hm_zhong_club_skill_buff", player.countCards("e", { name: "hm_zhong_club" }));
		},
		subSkill: {
			buff: {
				charlotte: true,
				mod: {
					maxHandcard(player, num) {
						return num + player.countMark("hm_zhong_club_skill_buff");
					},
				},
			},
		},
	},
	hm_zhong_spade_skill: {
		equipSkill: true,
		forced: true,
		trigger: {
			player: "damageEnd",
		},
		async content(event, trigger, player) {
			player.addSkill("hm_zhong_spade_skill_buff");
			player.addMark("hm_zhong_spade_skill_buff", player.countCards("e", { name: "hm_zhong_spade" }));
		},
		subSkill: {
			buff: {
				charlotte: true,
				mod: {
					globalFrom(from, to, current) {
						return current - from.countMark("hm_zhong_club_skill_buff");
					},
					globalTo(from, to, current) {
						return current + to.countMark("hm_zhong_club_skill_buff");
					},
				},
			},
		},
	},
	//白绕
	hm_huoyin: {
		mod: {
			cardUsableTarget(card, player, target, result) {
				if (player.inRange(target) && target.inRange(player)) {
					if (card.name == "sha") {
						return true;
					}
				}
			},
		},
		group: "hm_huoyin_damageSource",
		subSkill: {
			damageSource: {
				trigger: {
					source: "damageSource",
				},
				filter(event) {
					const { source, player } = event;
					return player.inRange(source) && source.inRange(player);
				},
				forced: true,
				async content(event, trigger, player) {
					await player.draw();
					await trigger.player.chooseToUse("【祸引】：是否使用一张牌？");
				},
			},
		},
	},
	//唐周
	hm_jukou: {
		enable: "phaseUse",
		usable: 1,
		filterTarget: lib.filter.notMe,
		subSkill: {
			sha: {
				charlotte: true,
				mod: {
					cardEnabled(card, player) {
						if (card.name == "sha") {
							return false;
						}
					},
				},
			},
			handcard: {
				charlotte: true,
				mod: {
					cardEnabled(card) {
						if (get.position(card) == "h") {
							return false;
						}
					},
				},
			},
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			const name = get.translation(target.name);
			const dialog = [
				"请选择一项",
				[
					[
						["draw", `令${name}摸一张牌`],
						["gain", `令${name}获得武将牌上所有的牌`],
					],
					"textbutton",
				],
			];
			const next = player.chooseButton(dialog, true);
			next.set("ai", function (button) {
				return Math.random();
			});
			next.set("targetx", target);
			next.set("filterButton", function (button) {
				const evt = _status.event;
				const { targetx } = evt;
				if (button.link == "gain") {
					return targetx.countCards("xs", card => !card._cardid) > 0;
				}
				return true;
			});
			const result = await next.forResult();
			if (result.bool) {
				switch (result.links[0]) {
					case "gain":
						await target.gain(
							target.getCards("xs", card => !card._cardid),
							"draw"
						);
						target.addTempSkill("hm_jukou_handcard");
						break;
					case "draw":
						await target.draw();
						target.addTempSkill("hm_jukou_sha");
						break;
				}
			}
		},
		ai: {
			order: 1,
			result: {
				target: 1,
			},
			threaten: 1.5,
		},
	},
	hm_weichenn: {
		limited: true,
		enable: "phaseUse",
		filterTarget: lib.filter.notMe,
		selectTarget: 2,
		targetprompt: ["展示手牌", "摸牌"],
		complexTarget: true,
		multitarget: true,
		async content(event, trigger, player) {
			const { targets } = event;
			player.awakenSkill(event.name);
			await player.showCards(targets[0].getCards("h"));
			await game.asyncDraw([player, targets[1]], 3);
			for (const target of targets) {
				target.addTempSkill("hm_weichenn_buff");
			}
			while (true) {
				const list = targets[0].getCards("h", card => get.is.damageCard(card));
				if (!list.some(card => targets[0].canUse(card, targets[1], true))) {
					break;
				}
				const next2 = await targets[0]
					.chooseToUse(
						function (card, player, event) {
							let bool = get.is.damageCard(card);
							if (!bool) {
								return false;
							}
							return lib.filter.cardEnabled.apply(this, arguments);
						},
						"违谶：对" + get.translation(targets[1]) + "使用一张伤害牌"
					)
					.set("complexSelect", true)
					.set("filterTarget", function (card, player, target) {
						if (target != _status.event.sourcex && !ui.selected.targets.includes(_status.event.sourcex)) {
							return false;
						}
						return lib.filter.targetEnabled.apply(this, arguments);
					})
					.set("sourcex", targets[1])
					.set("forced", true);
				const result2 = await next2.forResult();
				if (!result2?.bool) {
					break;
				}
			}
		},
		subSkill: {
			buff: {
				charlotte: true,
				mod: {
					cardUsable(card, player, num) {
						return Infinity;
					},
				},
			},
		},
	},
	//浮云
	hm_shuiqu: {
		trigger: { global: "phaseDiscardBegin" },
		forced: true,
		filter(event, player) {
			const hs = player.getCards("h");
			if (!hs.length) {
				return false;
			}
			return hs.every(card => lib.filter.cardDiscardable(card, player, "hm_shuiqu"));
		},
		async content(event, trigger, player) {
			await player.chooseToDiscard(true, "h", player.countCards("h"));
			let result;
			if (player.isDamaged()) {
				result = await player
					.chooseControl("baonue_hp", "baonue_maxHp", function (event, player) {
						if (player.hp == player.maxHp) {
							return "baonue_maxHp";
						}
						if (player.hp < player.maxHp - 1 || player.hp <= 2) {
							return "baonue_hp";
						}
						return "baonue_hp";
					})
					.set("prompt", "随去：回复1点体力或加1点体力上限")
					.forResult();
			} else {
				result = { control: "baonue_maxHp" };
			}
			if (!result?.control) {
				return;
			}
			if (result.control == "baonue_hp") {
				await player.recover();
			} else {
				await player.gainMaxHp();
			}
		},
	},
	hm_yure: {
		limited: true,
		trigger: {
			player: "loseAfter",
			global: "loseAsyncAfter",
		},
		filter(event, player) {
			if (event.type != "discard" || event.getlx === false || !game.hasPlayer(current => player != current)) {
				return false;
			}
			return event.getl?.(player)?.cards2?.someInD("d");
		},
		async cost(event, trigger, player) {
			const cards = trigger.getl(player).cards2.filterInD("d");
			event.result = await player
				.chooseTarget(lib.filter.notMe, get.prompt(event.skill), `将${get.translation(cards)}交给一名其他角色`)
				.set("ai", target => {
					const { player, cards } = get.event();
					if (cards.length < 3) {
						return 0;
					}
					let att = get.attitude(player, target);
					if (att < 3) {
						return 0;
					}
					if (target.hasSkillTag("nogain")) {
						att /= 10;
					}
					if (target.hasJudge("lebu")) {
						att /= 5;
					}
					if (target.hasSha() && cards.some(card => card.name == "sha")) {
						att /= 5;
					}
					if (target.needsToDiscard(1) && cards.some(card => card.name == "wuxie")) {
						att /= 5;
					}
					return att / (1 + get.distance(player, target, "absolute"));
				})
				.set("cards", cards)
				.forResult();
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			player.awakenSkill(event.name);
			await target.gain(trigger.getl(player).cards2.filterInD("d"), "gain2").set("giver", player);
		},
	},
	//陶升
	hm_zhannei: {
		limited: true,
		enable: "phaseUse",
		filterTarget: lib.filter.notMe,
		async content(event, trigger, player) {
			player.awakenSkill(event.name);
			player.addTempSkill("hm_zhannei_distance", { player: "dying" });
			player.storage.hm_zhannei_distance = event.targets[0];
		},
		subSkill: {
			distance: {
				charlotte: true,
				onremove: true,
				mod: {
					globalFrom(from, to) {
						if (from.storage.hm_zhannei_distance == to) {
							return -Infinity;
						}
					},
				},
			},
		},
	},
	hm_qianwei: {
		enable: "phaseUse",
		usable: 1,
		discard: false,
		filter(event, player) {
			return player.countCards("he", card => !get.is.damageCard(card));
		},
		filterCard(card) {
			return !get.is.damageCard(card);
		},
		position: "he",
		selectCard: [1, Infinity],
		filterTarget(_, player, target) {
			return player.distanceTo(target) === 1;
		},
		allowChooseAll: true,
		async content(event, trigger, player) {
			const { cards, target } = event;
			await player.showCards(cards);
			await player.give(cards, target, true);
			await player.draw(cards.length);
			const list = [].concat(cards);
			while (true) {
				if (!list.some(card => target.hasUseTarget(card))) {
					break;
				}
				const next2 = target.chooseCardButton(list);
				next2.set("prompt", "选择一张牌使用之");
				next2.set("filterButton", function (button) {
					return get.player().hasUseTarget(button.link);
				});
				const result2 = await next2.forResult();
				if (result2?.bool) {
					list.removeArray(result2.links);
					await target.chooseUseTarget(result2.links[0]);
				} else {
					break;
				}
			}
		},
	},
	//于毒
	hm_dafu: {
		trigger: { player: "useCardToPlayered" },
		prompt2(event, player) {
			const target = event.target;
			return `令${get.translation(target)}摸一张牌并令其不能响应此牌？`;
		},
		filter(event, player) {
			return get.is.damageCard(event.card);
		},
		check(event, player) {
			return get.attitude(player, event.target) < 0;
		},
		logTarget: "target",
		async content(event, trigger, player) {
			await trigger.target.draw();
			trigger.getParent().directHit.add(trigger.target);
		},
	},
	hm_jipin: {
		trigger: {
			source: "damageSource",
		},
		filter(event, player) {
			return event.player.countCards("h") > player.countCards("h");
		},
		async cost(event, trigger, player) {
			const next = player.gainPlayerCard(trigger.player, "h");
			const result = await next.forResult();
			event.result = {
				bool: result.bool,
				cards: result.cards,
				targets: [trigger.player],
			};
		},
		async content(event, trigger, player) {
			const next = player.chooseCardTarget();
			next.set("prompt", "将此牌交给一名其他角色");
			next.set("cardx", event.cards[0]);
			next.set("filterCard", function (card) {
				const evt = _status.event;
				return card == evt.cardx;
			});
			next.set("filterTarget", lib.filter.notMe);
			const result = await next.forResult();
			if (result.bool) {
				player.give(result.cards, result.targets[0], false);
			}
		},
	},
	//南华老仙
	hm_tianshu: {
		audio: "tianshu",
		trigger: { player: "phaseUseBegin" },
		filter(event, player) {
			return (
				player.countCards("he") &&
				!game.hasPlayer(function (current) {
					return current.countCards("ej", "taipingyaoshu");
				})
			);
		},
		async cost(event, trigger, player) {
			const next = player.chooseCardTarget({
				prompt: get.prompt2(event.skill),
				filterCard: true,
				filterTarget(card, player, target) {
					return target.canEquip("taipingyaoshu");
				},
				position: "he",
				ai1(card) {
					return 5 - get.value(card);
				},
				ai2(target) {
					var player = _status.event.player;
					if (get.attitude(player, target) > 0 && !target.hasEmptySlot(2)) {
						return 0;
					}
					return get.attitude(player, target);
				},
			});
			const result = await next.forResult();
			event.result = result;
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			let card;
			player.discard(event.cards);
			if (!lib.inpile.includes("taipingyaoshu")) {
				lib.inpile.push("taipingyaoshu");
				card = game.createCard2("taipingyaoshu", "heart", 3);
			} else {
				card = get.cardPile(function (card) {
					return card.name == "taipingyaoshu";
				});
			}
			if (card) {
				target.equip(card);
			}
		},
	},
	hm_yufeng: {
		usable: 1,
		enable: "phaseUse",
		async content(event, trigger, player) {
			const next = player.judge(card => {
				if (["diamond", "club"].includes(get.suit(card))) {
					return 2;
				}
				return 0;
			});
			const { suit } = await next.forResult();
			switch (suit) {
				case "spade":
					{
						if (!game.hasPlayer(current => player != current)) {
							return;
						}
						const result = await player
							.chooseTarget("【御风】：令一名其他角色跳过其下个回合的出牌阶段和弃牌阶段", lib.filter.notMe, true)
							.set("ai", target => {
								const player = get.player();
								const att = get.attitude(player, target);
								return att * lib.skill.yijin.getValue(player, "yijin_jinmi", target);
							})
							.forResult();
						if (result?.bool && result?.targets?.length) {
							const {
								targets: [target],
							} = result;
							target.skip("phaseUse");
							target.skip("phaseDiscard");
							target.addTempSkill(event.name + "_skipUse", { player: ["phaseUseSkipped", "phaseDiscardSkipped"] });
							game.log(target, "跳过其下个回合的出牌阶段和弃牌阶段");
						}
					}
					break;
				case "heart":
					{
						if (!game.hasPlayer(current => player != current)) {
							return;
						}
						const result = await player
							.chooseTarget("【御风】：令一名其他角色跳过其下个回合的摸牌阶段", lib.filter.notMe, true)
							.set("ai", target => {
								const player = get.player();
								const att = get.attitude(player, target);
								return att * lib.skill.yijin.getValue(player, "yijin_yongbi", target);
							})
							.forResult();
						if (result?.bool && result?.targets?.length) {
							const {
								targets: [target],
							} = result;
							target.skip("phaseDraw");
							target.addTempSkill(event.name + "_skipDraw", { player: "phaseDrawSkipped" });
							game.log(target, "跳过其下个回合的摸牌阶段");
						}
					}
					break;
				case "diamond":
				case "club":
					await player.draw();
					if (!player.getStat().skill.hm_yufeng) {
						return;
					}
					delete player.getStat().skill.hm_yufeng;
					game.log(player, "重置了", "#g【御风】");
					break;
			}
		},
		ai: {
			order: 13,
			result: { player: 1 },
			threaten: 1.5,
		},
		subSkill: {
			skipDraw: {
				charlotte: true,
				mark: true,
				intro: { content: "跳过下回合的摸牌阶段" },
			},
			skipUse: {
				charlotte: true,
				mark: true,
				intro: { content: "跳过下回合的出牌和弃牌阶段" },
			},
		},
	},
	//卜巳
	hm_weiluan: {
		trigger: {
			player: ["phaseZhunbeiBegin", "phaseDrawBegin2", "phaseUseBegin"],
		},
		forced: true,
		filter(event, player, triggername) {
			if (triggername === "phaseDrawBegin2") {
				return !event.numFixed;
			}
			return true;
		},
		async content(event, trigger, player) {
			const next = player.judge(function (card) {
				const suit = get.suit(card);
				if (suit == "spade") {
					return 4;
				}
				return 0;
			});
			next.judge2 = function (result) {
				return result.bool == false ? true : false;
			};
			const { suit } = await next.forResult();
			if (suit == "spade") {
				switch (event.triggername) {
					case "phaseZhunbeiBegin":
						player.addTempSkill("hm_weiluan_attackRange");
						break;
					case "phaseDrawBegin2":
						trigger.num++;
						break;
					case "phaseUseBegin":
						player.addTempSkill("hm_weiluan_sha");
						break;
				}
			}
		},
		subSkill: {
			attackRange: {
				charlotte: true,
				mod: {
					attackRange(player, num) {
						return num++;
					},
				},
			},
			sha: {
				charlotte: true,
				mod: {
					cardUsable(card, player, num) {
						if (card.name == "sha") {
							return num + 1;
						}
					},
				},
			},
		},
	},
	hm_tianpan: {
		trigger: {
			player: "judgeEnd",
		},
		forced: true,
		async content(event, trigger, player) {
			if (trigger.result.suit == "spade") {
				if (get.position(trigger.result.card, true) == "o") {
					await player.gain(trigger.result.card, "gain2");
				}
				const { control } = await player
					.chooseControl("baonue_hp", "baonue_maxHp", function (event, player) {
						if (player.hp == player.maxHp) {
							return "baonue_maxHp";
						}
						if (player.hp < player.maxHp - 1 || player.hp <= 2) {
							return "baonue_hp";
						}
						return "baonue_hp";
					})
					.set("prompt", "天判：恢复1点体力或加1点体力上限")
					.forResult();
				if (control == "baonue_hp") {
					await player.recover();
				} else {
					await player.gainMaxHp(true);
				}
			} else {
				const { control } = await player
					.chooseControl("baonue_hp", "baonue_maxHp", function (event, player) {
						if (player.hp == player.maxHp) {
							return "baonue_hp";
						}
						if (player.hp < player.maxHp - 1 || player.hp <= 2) {
							return "baonue_maxHp";
						}
						return "baonue_hp";
					})
					.set("prompt", "天判：失去1点体力或减1点体力上限")
					.forResult();
				if (control == "baonue_hp") {
					await player.loseHp();
				} else {
					await player.loseMaxHp(true);
				}
			}
		},
	},
	hm_gaiming: {
		usable: 1,
		trigger: {
			player: "judge",
		},
		filter(event, player) {
			const card = player.judging[0];
			return get.suit(card, player) != "spade";
		},
		prompt2: "亮出牌堆顶的一张牌代替判定牌",
		async content(event, trigger, player) {
			const card = get.cards(1)[0];
			await player.respond([card], "hm_gaiming", "highlight", "noOrdering");
			if (player.judging[0].clone) {
				player.judging[0].clone.classList.remove("thrownhighlight");
				game.broadcast(function (card) {
					if (card.clone) {
						card.clone.classList.remove("thrownhighlight");
					}
				}, player.judging[0]);
				game.addVideo("deletenode", player, get.cardsInfo([player.judging[0].clone]));
			}
			await game.cardsDiscard(player.judging[0]);
			player.judging[0] = card;
			trigger.orderingCards.add(card);
			game.log(player, "的判定牌改为", card);
			await game.delay(2);
		},
	},
	//珪固
	hm_tuntian: {
		trigger: { player: "phaseZhunbeiBegin" },
		forced: true,
		async content(event, trigger, player) {
			player.addTempSkill("hm_tuntian_temp", { player: "hm_qianjunAfter" });
			player.addMark("hm_tuntian_temp", 1, false);
		},
		subSkill: {
			temp: {
				charlotte: true,
				mod: {
					maxHandcard(player, num) {
						return num + player.countMark("hm_tuntian_temp");
					},
				},
				trigger: {
					player: ["phaseDrawBegin2", "damageBegin3"],
				},
				forced: true,
				filter(event, player) {
					if (event.name == "phaseDraw") {
						return !event.numFixed;
					}
					return game.getGlobalHistory("everything", evt => evt.name == "damage" && evt.player == player).indexOf(event) == 0;
				},
				async content(event, trigger, player) {
					trigger.num += player.countMark(event.name);
				},
				onremove: true,
				mark: true,
				intro: { content: "本局游戏的摸牌阶段摸牌数、手牌上限、本回合首次受到的伤害+#" },
			},
		},
	},
	hm_qianjun: {
		limited: true,
		enable: "phaseUse",
		seatRelated: "changeSeat",
		skillAnimation: true,
		animationColor: "orange",
		derivation: "olluanji",
		filter(event, player) {
			return player.countCards("e");
		},
		filterTarget: lib.filter.notMe,
		async content(event, trigger, player) {
			const target = event.targets[0];
			player.awakenSkill(event.name);
			await target.gain(player.getCards("e"), "gain2").set("giver", player);
			game.broadcastAll(
				function (target1, target2) {
					game.swapSeat(target1, target2);
				},
				player,
				target
			);
			await player.recover();
			await player.addSkills("olluanji");
		},
		ai: {
			order: 13,
			result: {
				player: 1,
				target: 2,
			},
			threaten: 1.5,
		},
	},
	//神朱儁
	hm_cheji: {
		usable: 1,
		enable: "phaseUse",
		filterCard: lib.filter.cardRecastable,
		selectCard: [1, Infinity],
		position: "he",
		discard: false,
		prompt: "重铸任意张牌，然后令一名其他角色重铸等量张手牌",
		filterTarget: lib.filter.notMe,
		allowChooseAll: true,
		async content(event, trigger, player) {
			const { cards, targets } = event;
			await player.recast(cards);
			const target = targets[0];
			const next = target
				.chooseCard(`选择重铸${cards.length}张牌`, "h", cards.length, true, (card, player) => player.canRecast(card), "allowChooseAll")
				.set("ai", card => {
					return 6.5 - get.value(card);
				});
			const result = await next.forResult();
			if (result.bool) {
				await target.recast(result.cards);
				const cardname = result.cards.map(c => c.name).unique();
				if (cardname.includes("sha")) {
					await target.damage("fire", player);
				}
				if (cardname.includes("shan") && target.hasUseTarget({ name: "sha", isCard: true })) {
					const next2 = player.chooseTarget(`撤击：请选择${get.translation(target)}使用【杀】的目标`, true);
					next2.set("filterTarget", function (card, player, targetx) {
						return lib.filter.filterTarget({ name: "sha", isCard: true }, get.event().target, targetx);
					});
					next2.set("ai", targetx => get.effect(targetx, { name: "sha", isCard: true }, get.event().target, get.player()));
					next2.set("target", target);
					const result2 = await next2.forResult();
					if (result2.bool) {
						await target.chooseUseTarget({ name: "sha", isCard: true }, true, result2.targets);
					}
				}
				if (cardname.includes("tao")) {
					await game.asyncDraw([player, target], 2);
				}
			}
		},
		ai: {
			order: 1,
			result: {
				player: 1,
			},
			threaten: 1.5,
		},
	},
	hm_daicui: {
		trigger: {
			global: "useCardToPlayered",
		},
		filter(event, player) {
			if (_status.currentPhase != player || !get.discarded().length) {
				return false;
			}
			return event.card.name == "sha" && event.card.hasNature();
		},
		forced: true,
		async content(event, trigger, player) {
			const { target } = trigger;
			const discarded = get.discarded();
			const min = Math.max(0, discarded.length);
			const next = target.chooseCard("he", [min, Infinity], true);
			next.set("prompt2", "置于武将牌上直到回合结束");
			const { bool, cards } = await next.forResult();
			if (bool) {
				target.addSkill("hm_daicui_expansion");
				target.addToExpansion("giveAuto", cards, target).gaintag.add("hm_daicui_expansion");
				trigger.getParent().baseDamage++;
			}
		},
		subSkill: {
			expansion: {
				trigger: {
					global: "phaseEnd",
				},
				forced: true,
				popup: false,
				charlotte: true,
				filter(event, player) {
					return player.getExpansions("hm_daicui_expansion").length > 0;
				},
				async content(event, trigger, player) {
					var cards = player.getExpansions("hm_daicui_expansion");
					await player.gain(cards, "draw");
					game.log(player, "收回了" + get.cnNumber(cards.length) + "张“怠摧”牌");
					player.removeSkill("hm_daicui_expansion");
				},
				intro: {
					markcount: "expansion",
					mark(dialog, storage, player) {
						var cards = player.getExpansions("hm_daicui_expansion");
						if (player.isUnderControl(true)) {
							dialog.addAuto(cards);
						} else {
							return "共有" + get.cnNumber(cards.length) + "张牌";
						}
					},
				},
			},
		},
	},
	hm_kuixiang: {
		trigger: {
			global: "dyingAfter",
		},
		prompt2(event, player) {
			return `对${get.translation(event.player.name)}造成1点伤害`;
		},
		filter(event, player) {
			if (event.player == player || !event.player.isIn()) {
				return false;
			}
			return !player.getStorage("hm_kuixiang_used").includes(event.player);
		},
		onremove(player) {
			player.removeSkill("hm_kuixiang_used");
		},
		logTarget: "player",
		check(event, player) {
			return get.attitude(player, event.player) < 0;
		},
		async content(event, trigger, player) {
			const target = trigger.player;
			player.addSkill("hm_kuixiang_used");
			player.markAuto("hm_kuixiang_used", [target]);
			await target.damage(player);
			if (
				game.getGlobalHistory("everything", evt => {
					if (evt.name != "die" || evt.player != target) {
						return false;
					}
					return evt.reason?.getParent() == event;
				}).length > 0 &&
				target.isDead()
			) {
				const next = player.chooseBool("〖溃降〗：是否摸三张牌？");
				const { bool } = await next.forResult();
				if (bool) {
					await player.draw(3);
				}
			}
		},
		subSkill: {
			used: {
				intro: {
					content: "已对$发动过〖溃降〗",
				},
				charlotte: true,
				onremove: true,
			},
		},
	},
	//神皇甫嵩
	hm_shice: {
		zhuanhuanji: true,
		mark: true,
		marktext: "☯",
		intro: {
			content(storage, player, skill) {
				if (!storage) {
					return "当你受到属性伤害时，若你的技能数不大于伤害来源，你可以防止此伤害并视为使用一张【火攻】。";
				}
				return "当你不因此技能使用牌指定唯一目标后，你可以令其弃置装备区任意张牌，然后此牌额外结算X次（X为其装备区的牌数）。";
			},
		},
		trigger: { player: ["damageBegin4", "useCardToPlayered"] },
		filter(event, player) {
			const storage = player.storage.hm_shice;
			if (!storage && event.name == "damage") {
				const { source } = event;
				if (!source) {
					return false;
				}
				return event.hasNature() && lib.skill.jsrgjuxia.countSkill(source) >= lib.skill.jsrgjuxia.countSkill(player);
			} else if (storage && event.name == "useCardToPlayered") {
				return event.getParent(3).name !== "hm_shice" && event.targets?.length === 1 && event.targets[0].countCards("e");
			}
			return false;
		},
		async cost(event, trigger, player) {
			const { source, target, card, nature } = trigger;
			if (trigger.name == "damage") {
				event.result = await player
					.chooseBool(get.prompt(event.skill), "防止此伤害并视为使用一张【火攻】")
					.set("choice", get.damageEffect(player, source, player, nature) < 0)
					.forResult();
			} else {
				const { bool } = await player
					.chooseBool(get.prompt(event.skill, target), "令其弃置装备区任意张牌，然后此牌额外结算X次（X为其装备区的牌数）")
					.set("choice", get.effect(target, card, player, player) > 0)
					.forResult();
				event.result = {
					bool: bool,
					targets: [target],
				};
			}
		},
		async content(event, trigger, player) {
			player.changeZhuanhuanji(event.name);
			if (trigger.name == "damage") {
				trigger.cancel();
				const huogong = get.autoViewAs({ name: "huogong", isCard: true });
				if (player.hasUseTarget(huogong)) {
					await player.chooseUseTarget(huogong, true);
				}
			} else {
				const { target, card } = trigger;
				if (target.countCards("e")) {
					await target
						.chooseToDiscard("e", [1, Infinity], "弃置装备区任意张牌，然后" + get.translation(card) + "额外结算X次（X为你装备区的牌数）", "allowChooseAll")
						.set("ai", card => {
							if (get.event().goon) {
								return 0;
							}
							return 7 - get.value(card);
						})
						.set("goon", get.effect(target, card, player, target) > 0);
				}
				const num = target.countCards("e");
				if (!num) {
					return;
				}
				trigger.getParent().effectCount += num;
				game.log(card, `额外结算${num}次`);
			}
		},
	},
	hm_podai: {
		trigger: { global: ["phaseBegin", "phaseEnd"] },
		filter(event, player) {
			const storage = player.getStorage("hm_podai_round");
			if (!event.player.isIn() || storage.length > 1) {
				return false;
			}
			return !storage.includes("draw") || (!storage.includes("disable") && lib.skill.hm_podai.getSkills(event.player).length);
		},
		infoTranslationIncludesString(skill, list, player) {
			const text = get.skillInfoTranslation(skill, player);
			return list.some(key => text.includes(key));
		},
		derivation: "hm_podai_faq",
		getSkills(player) {
			return player.getSkills(null, false, true).filter(skill => {
				const info = get.info(skill);
				//无人生还
				const list = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"]
					.concat(["零", "一", "二", "两", "三", "四", "五", "六", "七", "八", "九", "十"])
					.concat(["壹", "贰", "叁", "肆", "伍", "陆", "柒", "捌", "玖", "拾", "佰", "仟", "万", "亿"])
					.concat(get.cardTranslation(c => get.type(c) == "basic"));
				if (!info || info.charlotte || info.persevereSkill) {
					return false;
				}
				return lib.skill.hm_podai.infoTranslationIncludesString(skill, list, player);
			});
		},
		async cost(event, trigger, player) {
			const { player: target } = trigger;
			const storage = player.getStorage("hm_podai_round");
			const name = get.translation(target);
			const dialog = [
				"请选择一项",
				[
					[
						["disable", `令${name}描述中含有基本牌名或数字的一个技能失效`],
						["draw", `令${name}摸三张牌，然后对其造成1点火焰伤害。`],
					],
					"textbutton",
				],
			];
			const next = player.chooseButton(dialog);
			next.set("ai", button => {
				const { player, target } = get.event();
				const { link } = button;
				if (link == "disable") {
					return -(get.threaten(target, player) * get.attitude(player, target));
				} else {
					if (
						get.attitude(player, target) > 0 &&
						(target.hasSkillTag("nofire") ||
							target.hasSkillTag("nodamage", null, {
								source: player,
								natures: ["fire"],
							}))
					) {
						return 1;
					}
					return get.damageEffect(target, player, player, "fire") + get.effect(target, { name: "draw" }, player, player) * 3;
				}
			});
			next.set("filterButton", button => {
				const { player, target, storage } = get.event();
				const { link } = button;
				if (storage.includes(link)) {
					return false;
				}
				const skill = lib.skill.hm_podai.getSkills(target);
				return link !== "disable" || skill.length;
			});
			next.set("target", target);
			next.set("storage", storage);
			const result = await next.forResult();
			event.result = {
				bool: result.bool,
				cost_data: result.links?.[0],
			};
		},
		logTarget: "player",
		async content(event, trigger, player) {
			const { cost_data } = event;
			const { player: target } = trigger;
			player.addTempSkill("hm_podai_round", "roundStart");
			player.markAuto("hm_podai_round", [cost_data]);
			if (cost_data === "disable") {
				const list = lib.skill.hm_podai.getSkills(target);
				if (!list.length) {
					return;
				}
				const next = player.chooseButton([`令${get.translation(target)}的一个技能失效`, [list, "skill"]], true);
				const result = await next.forResult();
				if (result.bool) {
					target.addSkill("hm_podai_sb");
					target.markAuto("hm_podai_sb", [result.links[0]]);
				}
			} else if (cost_data === "draw") {
				await target.draw(3);
				await target.damage("fire", player);
			}
		},
		subSkill: {
			round: {
				charlotte: true,
				onremove: true,
			},
			sb: {
				init(player, skill) {
					player.storage[skill] = [];
					player.addSkillBlocker(skill);
				},
				onremove(player, skill) {
					player.removeSkillBlocker(skill);
				},
				charlotte: true,
				skillBlocker(skill, player) {
					return player.getStorage("hm_podai_sb").includes(skill);
				},
				mark: true,
				intro: {
					content(storage, player, skill) {
						const list = player.getSkills(null, false, false).filter(i => {
							return lib.skill.hm_podai_sb.skillBlocker(i, player);
						});
						if (list.length) {
							return "失效技能：" + get.translation(list);
						}
						return "无失效技能";
					},
				},
			},
		},
	},
	//神卢植
	hm_jigan: {
		trigger: { global: "phaseAfter" },
		setDistanceObj(player) {
			const obj = {};
			for (const i of game.players) {
				if (!obj[i.playerid]) {
					obj[i.playerid] = {};
				}
				for (const j of game.players) {
					//i到j的距离
					obj[i.playerid][j.playerid] = get.distance(i, j);
				}
			}
			player.storage["hm_jigan"] = obj;
		},
		filter(event, player) {
			let storage = player.storage["hm_jigan"];
			if (!storage) {
				lib.skill["hm_jigan"].setDistanceObj(player);
				storage = player.storage["hm_jigan"];
			}
			let bool = false;
			if (
				game.getGlobalHistory("everything", event => {
					if (event.name != "gain") {
						return false;
					}
					return event.giver;
				}).length
			) {
				bool = true;
			}
			for (const i of game.players) {
				for (const j of game.players) {
					if (storage[i.playerid]?.[j.playerid] != get.distance(i, j)) {
						bool = true;
					}
				}
			}
			return bool;
		},
		async cost(event, trigger, player) {
			const giver = [];
			game.getGlobalHistory("everything", event => {
				if (event.name != "gain") {
					return false;
				}
				return event.giver;
			}).forEach(evt => {
				giver.add(evt.giver);
			});
			const storage = player.storage["hm_jigan"];
			const distanceChanged = [];
			for (const i of game.players) {
				for (const j of game.players) {
					if (storage[i.playerid]?.[j.playerid] != get.distance(i, j)) {
						distanceChanged.add(i);
					}
				}
			}
			const targetsx = [].concat(giver).concat(distanceChanged);
			const next = player.chooseTarget("令其中两名角色分别视为使用一张基本牌");
			next.set("ai", target => {
				const player = get.player();
				const list = get.inpileVCardList(info => {
					if (info[0] != "basic") {
						return false;
					}
					return target.hasValueTarget({ name: info[2], nature: info[3], isCard: true });
				});
				if (!list.length) {
					return 0;
				}
				return get.attitude(player, target);
			});
			next.set("selectTarget", [2, 2]);
			next.set("targetsx", targetsx);
			next.set("filterTarget", (card, player, target) => {
				const evt = get.event();
				return evt.targetsx.includes(target);
			});
			const result = await next.forResult();
			lib.skill["hm_jigan"].setDistanceObj(player);
			event.result = result;
		},
		async content(event, trigger, player) {
			const { targets } = event;
			for (const target of targets.sortBySeat()) {
				const list = get.inpileVCardList(info => {
					if (info[0] != "basic") {
						return false;
					}
					return target.hasUseTarget({ name: info[2], nature: info[3], isCard: true });
				});
				if (list.length) {
					const next = target.chooseButton(["是否视为使用一张基本牌？", [list, "vcard"]]);
					next.set("ai", button => {
						const player = get.player();
						const card = {
							name: button.link[2],
							nature: button.link[3],
							isCard: true,
						};
						return player.getUseValue(card);
					});
					const { links } = await next.forResult();
					if (!links?.length) {
						return;
					}
					const card = { name: links[0][2], nature: links[0][3], isCard: true };
					await target.chooseUseTarget(card, true);
				}
			}
		},
		group: "hm_jigan_gameStart",
		subSkill: {
			gameStart: {
				charlotte: true,
				trigger: {
					global: "phaseBefore",
					player: "enterGame",
				},
				silent: true,
				filter(event, player) {
					return event.name != "phase" || game.phaseNumber == 0;
				},
				async content(event, trigger, player) {
					lib.skill["hm_jigan"].setDistanceObj(player);
				},
			},
		},
	},
	hm_weizhu: {
		enable: "phaseUse",
		usable: 1,
		filterCard: lib.filter.cardRecastable,
		selectCard: [1, Infinity],
		discard: false,
		lose: false,
		allowChooseAll: true,
		async content(event, trigger, player) {
			const { cards } = event;
			await player.recast(cards);
			const equip = Array.from(ui.discardPile.childNodes).filter(c => get.type(c) === "equip");
			if (cards.length >= equip.length) {
				await player.gain(equip);
			} else {
				const next = player.chooseCardButton(equip, true);
				next.set("selectButton", cards.length);
				const result = await next.forResult();
				if (result.bool) {
					await player.gain(result.links);
				}
			}
			if (_status.connectMode) {
				game.broadcastAll(() => (_status.noclearcountdown = true));
			}
			const map = new Map();
			while (player.countCards("he")) {
				const result = await player
					.chooseCardTarget({
						forced: true,
						map: map,
						position: "he",
						prompt: "围铸：请选择要分配的卡牌和目标",
						filterTarget(card, player, target) {
							return player != target && !get.event().map.has(target);
						},
						filterCard(card) {
							return !card.hasGaintag("hm_weizhu_tag");
						},
						ai1(card) {
							const { player, map } = get.event();
							return Math.max(
								...game.filterPlayer().map(target => {
									return [...ui.selected.cards, card, ...(map.get(target) || [])].reduce((sum, cardx) => {
										return sum + get.value(cardx, target) * get.attitude(player, target);
									}, 0);
								})
							);
						},
						ai2(target) {
							const player = get.player();
							const card = ui.selected.cards[0];
							if (card) {
								return get.value(card, target) * get.attitude(player, target);
							}
							return 0;
						},
					})
					.forResult();
				if (result?.bool && result.targets?.length && result.cards?.length) {
					const target = result.targets[0];
					player.addGaintag(result.cards, "hm_weizhu_tag");
					map.set(target, result.cards);
					if (map.size >= cards.length || map.size >= game.countPlayer(target => target != player)) {
						break;
					}
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
			if (map.size) {
				const gain_list = [];
				map.forEach((cards, source) => {
					player.line(source, "green");
					gain_list.push([source, cards]);
					source.addTempSkill("hm_weizhu_buff", "roundStart");
				});
				await game
					.loseAsync({
						gain_list: gain_list,
						player: player,
						giver: player,
						animate: "giveAuto",
					})
					.setContent("gaincardMultiple");
			}
		},
		subSkill: {
			tag: {},
			buff: {
				charlotte: true,
				mod: {
					globalFrom(from, to, distance) {
						return distance - 1;
					},
				},
			},
		},
	},
	hm_guiquan: {
		enable: "chooseToUse",
		init(player, skill) {
			player.storage[skill] = [];
		},
		filter(event, player) {
			const cards = player.getCards("hes", { type: "equip" });
			if (!cards.length) {
				return false;
			}
			return lib.inpile.some(name => {
				if (player.getStorage("hm_guiquan").includes(name)) {
					return false;
				}
				if (get.type(name) != "trick") {
					return false;
				}
				let bool = false;
				for (const card of cards) {
					const vcard = get.autoViewAs({ name }, card);
					if (event.filterCard(vcard, player, event)) {
						bool = true;
					}
				}
				return bool;
			});
		},
		chooseButton: {
			dialog(event, player) {
				const list = [];
				for (const name of lib.inpile) {
					if (player.getStorage("hm_guiquan").includes(name)) {
						continue;
					}
					if (get.type(name) == "trick") {
						list.push(["锦囊", "", name]);
					}
				}
				return ui.create.dialog(get.translation("hm_guiquan"), [list, "vcard"]);
			},
			filter(button, player) {
				const event = _status.event.getParent(),
					card = get.autoViewAs({
						name: button.link[2],
					});
				return event.filterCard(card, player, event);
			},
			backup(links, player) {
				return {
					filterCard(card) {
						return get.type(card) == "equip";
					},
					filterTarget(card, player, target) {
						if (target.hp > player.hp) {
							return false;
						}
						return lib.filter.filterTarget.apply(this, arguments);
					},
					selectCard: 1,
					position: "hes",
					popname: true,
					viewAs: { name: links[0][2] },
					onuse(result, player) {
						const { card } = result;
						player.getStorage("hm_guiquan").add(card.name);
					},
				};
			},
			prompt(links, player) {
				return "将一张装备牌当作" + get.translation(links[0][2]) + "使用";
			},
		},
		ai: {
			order: 1,
			result: {
				//Waiting For 157
				player(player) {
					var num = 0;
					return 12 - num;
				},
			},
			threaten: 1.6,
		},
	},
	//程远志
	hm_wuxiao: {
		trigger: {
			global: ["loseAfter", "equipAfter", "loseAsyncAfter", "cardsDiscardAfter"],
		},
		filter(event, player, name) {
			if (!event.getd?.().some(card => get.color(card, false) === "red")) {
				return false;
			}
			return (
				game.getGlobalHistory("everything", evt => {
					return evt.getd?.()?.some(card => get.color(card, false) === "red");
				}).length == 1
			);
		},
		forced: true,
		async content(event, trigger, player) {
			player.addTempSkill(["hm_wuxiao_buff", "hm_wuxiao_debuff"]);
		},
		subSkill: {
			buff: {
				charlotte: true,
				forced: true,
				trigger: {
					source: "damageBegin1",
				},
				async content(event, trigger, player) {
					trigger.num++;
					player.removeSkill("hm_wuxiao_buff");
				},
			},
			debuff: {
				charlotte: true,
				forced: true,
				trigger: {
					player: "damageBegin3",
				},
				async content(event, trigger, player) {
					trigger.num++;
					player.removeSkill("hm_wuxiao_debuff");
				},
			},
		},
	},
	hm_qianhu: {
		enable: "phaseUse",
		filterCard: card => get.color(card) == "red",
		filter(event, player) {
			return player.countCards("he", { color: "red" }) > 1 && player.hasUseTarget("juedou");
		},
		selectCard: 2,
		position: "he",
		check(card) {
			return 6 - get.value(card);
		},
		async content(event, trigger, player) {
			await player.chooseUseTarget("juedou", true);
		},
		group: "hm_qianhu_draw",
		subSkill: {
			draw: {
				trigger: {
					source: "damageSource",
				},
				filter(event, player) {
					return event.getParent(5).skill == "hm_qianhu";
				},
				silent: true,
				charlotte: true,
				async content(event, trigger, player) {
					await player.draw();
				},
			},
		},
		ai: {
			order: 9,
			result: {
				player(player) {
					if (player.getUseValue({ name: "juedou" }) < 0) {
						return 0;
					}
					return 1;
				},
			},
		},
	},
	//高升
	hm_xiongshi: {
		global: "hm_xiongshi_global",
		mark: true,
		intro: {
			markcount: "expansion",
			mark(dialog, content, player) {
				var content = player.getExpansions("hm_xiongshi");
				if (content && content.length) {
					if (player == game.me || player.isUnderControl()) {
						dialog.addAuto(content);
					} else {
						return "共有" + get.cnNumber(content.length) + "张“凶势”";
					}
				}
			},
			content(content, player) {
				var content = player.getExpansions("hm_xiongshi");
				if (content && content.length) {
					if (player == game.me || player.isUnderControl()) {
						return get.translation(content);
					}
					return "共有" + get.cnNumber(content.length) + "张“凶势”";
				}
			},
		},
		subSkill: {
			global: {
				audio: "hm_xiongshi",
				enable: "phaseUse",
				filter(event, player) {
					if (player.hasSkill("hm_xiongshi_used")) {
						return false;
					}
					return (
						player.countCards("he") &&
						game.hasPlayer(function (current) {
							return current.hasSkill("hm_xiongshi");
						})
					);
				},
				log: false,
				delay: false,
				filterCard: true,
				discard: false,
				lose: false,
				position: "he",
				prompt() {
					var player = _status.event.player;
					var list = game.filterPlayer(function (current) {
						return current.hasSkill("hm_xiongshi");
					});
					if (list.length == 1 && list[0] == player) {
						return "将一张牌置于你的武将牌上";
					}
					let str = "将一张牌置于" + get.translation(list);
					if (list.length > 1) {
						return (str += "其中一人的武将牌上");
					}
					return (str += "的武将牌上");
				},
				filterTarget(card, player, target) {
					return target.hasSkill("hm_xiongshi");
				},
				check(card) {
					return 8 - get.value(card);
				},
				async content(event, trigger, player) {
					const { targets, cards } = event;
					targets[0].addToExpansion(cards, player, "giveAuto").gaintag.add("hm_xiongshi");
					player.addTempSkill("hm_xiongshi_used", { player: "phaseUseAfter" });
				},
				ai: {
					order: 2,
					threaten: 1.5,
					result: {
						player(player, target) {
							var target = game.findPlayer(function (current) {
								return current.hasSkill("hm_xiongshi");
							});
							if (target) {
								return get.attitude(player, target);
							}
						},
					},
				},
			},
			used: {
				charlotte: true,
			},
		},
	},
	hm_difeng: {
		trigger: {
			global: ["loseAfter", "loseAsyncAfter", "addToExpansionAfter"],
		},
		getIndex(event, player) {
			return game.filterPlayer(target => event.getl?.(target)?.cards2?.length > 0);
		},
		filter(event, player, name, target) {
			if (!target?.isIn()) {
				return false;
			}
			if (event.name == "addToExpansion") {
				return true;
			}
			return event.getlx !== false && (event.toStorage == true || event.type == "addToExpansion");
		},
		forced: true,
		logTarget(event, player, name, target) {
			return target;
		},
		async content(event, trigger, player) {
			await game.asyncDraw([player, ...event.targets].sortBySeat());
		},
		group: "hm_difeng_damage",
		subSkill: {
			damage: {
				trigger: {
					player: "damageBegin3",
					source: "damageBegin1",
				},
				filter(event, player) {
					return event.source?.isIn() && player.countCards("xs") > 0;
				},
				async cost(event, trigger, player) {
					const { source } = trigger;
					let cards = player.getCards("xs", card => !card._cardid);
					const next = source.chooseCardButton("弃置一张牌令此伤害+1", cards);
					const result = await next.forResult();
					event.result = {
						bool: result.bool,
						cost_data: result.links,
					};
				},
				async content(event, trigger, player) {
					const { cost_data } = event;
					await player.loseToDiscardpile(cost_data);
					trigger.num++;
				},
			},
		},
	},
	//何曼
	hm_juedian: {
		trigger: { source: "damageSource" },
		filter(event, player) {
			const { player: target } = event;
			const juedou = get.autoViewAs({ name: "juedou", isCard: true });
			if (!target.isIn() || !player.canUse(juedou, target, false)) {
				return false;
			}
			return event.getParent().type == "card" && event.getParent(2)?.targets?.length === 1 && player.getHistory("sourceDamage", evt => evt.getParent(2)?.targets?.length === 1).indexOf(event) == 0;
		},
		locked: true,
		async cost(event, trigger, player) {
			const { player: target } = trigger;
			const { control } = await player
				.chooseControl("baonue_hp", "baonue_maxHp", "背水！")
				.set("prompt", `决巅：选择一项并视为对${get.translation(target)}使用一张【决斗】`)
				.set("ai", () => {
					const { player, target } = get.event();
					const bool1 = player.getHp() > 2;
					const bool2 = player.isDamaged() && player.maxHp > 3;
					const eff = get.effect(target, { name: "juedou", isCard: true }, player, player);
					if (eff > 0 && ((bool1 && bool2 && target.mayHaveSha(player, "respond", null, "count") <= player.mayHaveSha(player, "respond", null, "count")) || player.hasSkill("hm_nitian_buff"))) {
						return "背水！";
					}
					if (bool2) {
						return "baonue_maxHp";
					}
					return "baonue_hp";
				})
				.set("target", target)
				.forResult();
			event.result = {
				bool: true,
				cost_data: control,
				targets: [target],
			};
		},
		async content(event, trigger, player) {
			const {
				targets: [target],
				cost_data: control,
			} = event;
			const juedou = get.autoViewAs({ name: "juedou", isCard: true });
			if (["baonue_hp", "背水！"].includes(control)) {
				await player.loseHp();
			}
			if (["baonue_maxHp", "背水！"].includes(control)) {
				await player.loseMaxHp(true);
			}
			if (player.canUse(juedou, target, false)) {
				const next = player.useCard(juedou, target, false);
				next.baseDamage = control == "背水！" ? 2 : 1;
				await next;
			}
		},
	},
	hm_nitian: {
		enable: "phaseUse",
		limited: true,
		skillAnimation: true,
		animationColor: "fire",
		async content(event, trigger, player) {
			player.awakenSkill(event.name);
			player.addTempSkill(event.name + "_buff");
		},
		/*ai: {
			order(item, player) {
				if (
					game.hasPlayer(current => {
						if (get.attitude(player, current) > 0) {
							return false;
						}
						if (current.getHp() > 3) {
							return false;
						}
						return player.hasCard(card => get.tag(card, "damage") && get.type(card) != "delay" && player.canUse(card, current) && get.effect(current, card, player, player) > 0, "hs");
					})
				) {
					return 10;
				}
				return 0.1;
			},
			result: {
				player(player, target) {
					return player.hasCard(card => get.tag(card, "damage") && get.type(card) != "delay" && player.hasValueTarget(card), "hs") ? 1 : 0;
				},
			},
		},*/
		subSkill: {
			buff: {
				trigger: { player: ["useCard", "phaseJieshuBegin"] },
				filter(event, player) {
					if (event.name == "useCard") {
						return true;
					}
					return !player.getStat("kill");
				},
				silent: true,
				charlotte: true,
				async content(event, trigger, player) {
					if (trigger.name == "useCard") {
						trigger.customArgs.default.directHit2 = true;
					} else {
						await player.die();
					}
				},
			},
		},
	},
	//严政
	hm_didao: {
		trigger: {
			player: "phaseUseBegin",
		},
		filter(event, player) {
			return player.isDamaged() && player.countCards("h");
		},
		limited: true,
		skillAnimation: true,
		animationColor: "metal",
		direct: true,
		clearTime: true,
		async content(event, trigger, player) {
			await player
				.chooseToUse()
				.set("openskilldialog", get.prompt2(event.name))
				.set("norestore", true)
				.set("_backupevent", `${event.name}_backup`)
				.set("custom", {
					add: {},
					replace: { window() {} },
				})
				.backup(`${event.name}_backup`)
				.set("addCount", false)
				.set("oncard", () => {
					get.event().baseDamage = get.event().cards.length;
				});
		},
		subSkill: {
			backup: {
				filterCard(card) {
					return get.itemtype(card) === "card";
				},
				filterTarget(card, player, target) {
					return lib.filter.targetEnabled.apply(this, arguments);
				},
				selectCard: -1,
				position: "h",
				viewAs: {
					name: "sha",
				},
				prompt: "将所有手牌当一张【杀】使用",
				check(card) {
					return 7 - get.value(card);
				},
				precontent(event, trigger, player) {
					player.trySkillAnimate("hm_didao", "hm_didao", player.checkShow("hm_didao"));
					player.awakenSkill("hm_didao");
				},
			},
		},
	},
	hm_xianxiang: {
		trigger: {
			source: "die",
		},
		forced: true,
		filter(event, player) {
			if (!event.player.countCards("hej")) {
				return false;
			}
			return game.countPlayer(target => target != player) >= 1;
		},
		async content(event, trigger, player) {
			const next = player.chooseTarget(`令另一名其他角色获得${get.translation(trigger.player.name)}区域内的所有牌`, lib.filter.notMe, true);
			const result = await next.forResult();
			if (result.bool) {
				const togain = trigger.player.getCards("hej");
				await result.targets[0].gain(togain, trigger.player, "giveAuto");
			}
		},
	},
	//波才
	hm_kunjun: {
		trigger: { global: "useCard" },
		filter(event, player) {
			if (get.type(event.card) != "trick" && (get.type(event.card) != "basic" || ["shan", "tao", "jiu", "du"].includes(event.card.name))) {
				return false;
			}
			if (event.player == player) {
				return game.hasPlayer(current => player.countCards("h") > current.countCards("h"));
			}
			return event.player.countCards("h") > player.countCards("h");
		},
		forced: true,
		async content(event, trigger, player) {
			if (trigger.player == player) {
				trigger.directHit.addArray(game.filterPlayer(current => player.countCards("h") > current.countCards("h")));
			} else {
				trigger.directHit.add(player);
			}
		},
		ai: {
			halfneg: true,
		},
		group: "hm_kunjun_advent",
		subSkill: {
			advent: {
				trigger: { global: "gameDrawBegin" },
				forced: true,
				content() {
					const me = player,
						numx = trigger.num;
					trigger.num = function (player) {
						return (typeof numx == "function" ? numx(player) : numx) + (player === me ? 4 : 0);
					};
				},
			},
		},
	},
	hm_yingzhan: {
		trigger: {
			player: "damageBegin3",
			source: "damageBegin1",
		},
		forced: true,
		filter(event, player) {
			return event.hasNature();
		},
		async content(event, trigger, player) {
			trigger.num++;
		},
	},
	hm_cuiji: {
		trigger: {
			global: "phaseUseBegin",
		},
		filter(event, player) {
			if (event.player == player) {
				return false;
			}
			const card = new lib.element.VCard({ name: "sha", nature: "thunder" });
			return player.countCards("h") > event.player.countCards("h") && lib.filter.targetEnabled(card, player, event.player);
		},
		direct: true,
		async content(event, trigger, player) {
			const next = player.chooseToUse();
			next.set("targets", [trigger.player]);
			next.set("openskilldialog", get.prompt2("hm_cuiji"));
			next.set("norestore", true);
			next.set("_backupevent", "hm_cuiji_backup");
			next.set("custom", {
				add: {},
				replace: { window() {} },
			});
			next.backup("hm_cuiji_backup");
			await next;
		},
		group: "hm_cuiji_draw",
		subSkill: {
			backup: {
				filterCard(card) {
					return get.itemtype(card) == "card";
				},
				selectCard: [1, Infinity],
				position: "hs",
				viewAs: {
					name: "sha",
					nature: "thunder",
				},
				filterTarget(card, player, target) {
					return _status.event.targets && _status.event.targets.includes(target) && lib.filter.targetEnabled.apply(this, arguments);
				},
				allowChooseAll: true,
				prompt: "将任意张手牌当一张雷【杀】使用",
				check(card) {
					return 7 - get.value(card);
				},
			},
			draw: {
				trigger: {
					player: "useCardAfter",
				},
				silent: true,
				charlotte: true,
				filter(event, player) {
					return (
						event.skill == "hm_cuiji_backup" &&
						player.getHistory("sourceDamage", function (card) {
							return card.card == event.card;
						}).length > 0
					);
				},
				async content(event, trigger, player) {
					player.draw(trigger.cards?.length);
				},
			},
		},
	},
	//邓茂
	hm_houying: {
		enable: "phaseUse",
		filterCard: card => get.color(card) == "black",
		filter(event, player) {
			return player.countCards("he", { color: "black" }) > 1 && player.hasUseTarget("sha");
		},
		selectCard: 2,
		position: "he",
		check(card) {
			return 6 - get.value(card);
		},
		async content(event, trigger, player) {
			await player.chooseUseTarget("sha", true, false);
		},
		group: "hm_houying_draw",
		subSkill: {
			draw: {
				trigger: {
					source: "damageSource",
				},
				filter(event, player) {
					return event.getParent(5).skill == "hm_houying";
				},
				silent: true,
				charlotte: true,
				async content(event, trigger, player) {
					await player.draw();
				},
			},
		},
		ai: {
			order: 9,
			result: {
				player(player) {
					if (player.getUseValue({ name: "sha" }) < 0) {
						return 0;
					}
					return 1;
				},
			},
		},
	},
	hm_paoxi: {
		usable: 1,
		trigger: {
			player: "useCardToPlayered",
			target: "useCardToPlayered",
		},
		forced: true,
		filter(event, player) {
			const history = game.getGlobalHistory("useCard");
			const index = history.indexOf(event.getParent()) - 1;
			if (index < 0) {
				return false;
			}
			const evt = history[index];
			if (!evt || !evt.targets || !evt.targets.length) {
				return false;
			}
			if (evt.targets.includes(event.target)) {
				return true;
			}
			return false;
		},
		async content(event, trigger, player) {
			player.addTempSkill(["hm_paoxi_buff", "hm_paoxi_debuff"]);
		},
		subSkill: {
			buff: {
				charlotte: true,
				forced: true,
				trigger: {
					source: "damageBegin1",
				},
				async content(event, trigger, player) {
					trigger.num++;
					player.removeSkill("hm_paoxi_buff");
				},
			},
			debuff: {
				charlotte: true,
				forced: true,
				trigger: {
					player: "damageBegin3",
				},
				async content(event, trigger, player) {
					trigger.num++;
					player.removeSkill("hm_paoxi_debuff");
				},
			},
		},
	},
	//神张角
	hm_fudao: {
		trigger: {
			global: ["phaseBefore", "useSkill_hm_fudao"],
			player: "enterGame",
		},
		filter(event, player) {
			return event.name != "phase" || game.phaseNumber == 0;
		},
		async cost(event, trigger, player) {
			const result = await player
				.chooseVCardButton(["hm_zhong_heart", "hm_zhong_diamond", "hm_zhong_club", "hm_zhong_spade"])
				.set("ai", function (button) {
					return Math.random();
				})
				.forResult();
			event.result = {
				bool: result.bool,
				cost_data: result.links,
			};
		},
		async content(event, trigger, player) {
			const { cost_data } = event;
			const result = await player.chooseControl(lib.suit.slice()).set("prompt", "请选择【众】的花色").forResult();
			const card = game.createCard(cost_data[0][2], result.control, 1);
			player.chooseUseTarget(card, true);
		},
	},
	hm_zongfu: {
		trigger: { global: "roundStart" },
		async cost(event, trigger, player) {
			const next = player.chooseButton(["###众附：是否声明一种花色？###", [lib.suit.map(i => ["", "", "lukai_" + i]), "vcard"]]);
			next.set("ai", button => {
				return Math.random();
			});
			const result = await next.forResult();
			event.result = {
				bool: result.bool,
				cost_data: result.links,
			};
		},
		async content(event, trigger, player) {
			const { cost_data } = event;
			const suit = cost_data[0][2];
			game.log(player, "声明了", `#y${get.translation(suit)}`);
			player.storage.hm_zongfu = suit.replace("lukai_", "");
			const targets = game.filterPlayer(p => p.isMinHandcard());
			for (const i of targets) {
				const next = i.chooseCard("将一张牌置于牌堆顶，否则按“取消”从牌堆底摸一张牌", "he");
				next.set("ai", function (card) {
					if (get.attitude(i, player) < 0) {
						return 0;
					}
					if (get.suit(card) == suit.replace("lukai_", "")) {
						return 8 - get.value(card);
					}
					return 6 - get.value(card);
				});
				const result = await next.forResult();
				if (result.bool) {
					await i.lose(result.cards, ui.cardPile, "insert");
					game.log(i, "将一张牌置于牌堆顶");
					i.addTempSkill("hm_zongfu_lose", { global: "roundStart" });
				} else {
					await i.draw("bottom");
				}
			}
		},
		derivation: "hm_fudao",
		group: "hm_zongfu_useSkill",
		subSkill: {
			lose: {
				charlotte: true,
			},
			useSkill: {
				trigger: {
					global: "damageSource",
				},
				charlotte: true,
				silent: true,
				filter(event, player) {
					return event.source?.hasSkill("hm_zongfu_lose");
				},
				async content(event, trigger, player) {
					event.trigger("useSkill_hm_fudao");
				},
			},
		},
	},
	hm_dangjing: {
		trigger: { player: ["hm_zongfuAfter", "hm_dangjing_callback"] },
		filter(event, player) {
			return player.isMaxEquip();
		},
		async cost(event, trigger, player) {
			const next = player.chooseTarget("令一名角色进行一次判定");
			next.set("ai", function (target) {
				const player = get.player();
				return get.damageEffect(target, player, player, "thunder");
			});
			const result = await next.forResult();
			event.result = result;
		},
		async content(event, trigger, player) {
			const { targets } = event;
			const next = targets[0].judge(function (card) {
				const evt = get.event();
				if (get.suit(card) == evt.suitx) {
					return -4;
				}
				return 0;
			});
			next.judge2 = function (result) {
				return result.bool == false ? true : false;
			};
			next.set("suitx", player.storage.hm_zongfu);
			const result = await next.forResult();
			if (result.suit == player.storage.hm_zongfu) {
				targets[0].damage("thunder", player);
				event.trigger("hm_dangjing_callback");
			}
		},
		ai: { combo: "hm_zongfu" },
	},
	//神张宝
	hm_zhouyuan: {
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return player.countCards("h") > 0 || game.hasPlayer(current => get.info("hm_zhouyuan").filterTarget(null, player, current));
		},
		filterTarget(card, player, target) {
			if (player == target) {
				return false;
			}
			return target.countCards("h") > 0;
		},
		async content(event, trigger, player) {
			const { targets } = event,
				target = targets[0];
			if (!target.countCards("h", card => ["red", "black"].includes(get.color(card, false)))) {
				return;
			}
			const dialog = [
				"请选择一项",
				[
					[
						["black", "将所有黑色手牌扣置于武将牌上"],
						["red", "将所有红色手牌扣置于武将牌上"],
					],
					"textbutton",
				],
			];
			const next = target.chooseButton(dialog, true);
			next.set("filterButton", function (button) {
				const evt = get.event();
				if (button.link == "black") {
					return evt.player.countCards("h", { color: "black" });
				}
				return evt.player.countCards("h", { color: "red" });
			});
			const result = await next.forResult();
			if (result?.links) {
				const color1 = result.links[0],
					cards1 = target.getCards("h", { color: color1 }),
					cards2 = player.getCards("h", { color: color1 == "black" ? "red" : "black" });
				game.log(target, "选择了", color1);
				if (cards1.length) {
					await target.addToExpansion(cards1, "draw").set("gaintag", ["hm_zhouyuan_expansion"]);
					target.addTempSkill("hm_zhouyuan_expansion", ["phaseChange", "phaseAfter", "phaseBeforeStart"]);
				}
				if (cards2.length) {
					await player.addToExpansion(cards2, "draw").set("gaintag", ["hm_zhouyuan_expansion"]);
					player.addTempSkill("hm_zhouyuan_expansion", ["phaseChange", "phaseAfter", "phaseBeforeStart"]);
				}
			}
		},
		subSkill: {
			expansion: {
				trigger: {
					global: "phaseUseEnd",
				},
				forced: true,
				popup: false,
				charlotte: true,
				filter(event, player) {
					return player.countExpansions("hm_zhouyuan_expansion");
				},
				async content(event, trigger, player) {
					const cards = player.getExpansions("hm_zhouyuan_expansion");
					game.log(player, "收回了" + get.cnNumber(cards.length) + "张“咒兵”牌");
					await player.gain(cards, "draw");
				},
				onremove: true,
				intro: {
					markcount: "expansion",
					mark(dialog, storage, player) {
						const cards = player.getExpansions("hm_zhouyuan_expansion");
						if (player.isUnderControl(true)) {
							dialog.addAuto(cards);
						} else {
							return "共有" + get.cnNumber(cards.length) + "张牌";
						}
					},
				},
			},
		},
		ai: {
			order: 7,
			result: {
				target: -1,
			},
			threaten: 1.5,
		},
	},
	hm_zhaobing: {
		trigger: {
			player: ["loseEnd", "dying", "phaseBefore", "phaseAfter", "dyingAfter", "die"],
			global: ["equipEnd", "addJudgeEnd", "gainEnd", "loseAsyncEnd", "addToExpansionEnd"],
		},
		filter(event, player) {
			return (game.hasPlayer(target => target.countExpansions("hm_zhouyuan_expansion")) && event.name != "die") ^ player.hasSkill("hm_zhaobing_in");
		},
		forced: true,
		firstDo: true,
		silent: true,
		forceDie: true,
		content() {
			if (game.hasPlayer(target => target.countExpansions("hm_zhouyuan_expansion")) && trigger.name != "die") {
				const cards = game
					.filterPlayer()
					.map(target => target.getExpansions("hm_zhouyuan_expansion"))
					.flat();
				const cardsx = cards.map(card => {
					const cardx = ui.create.card();
					cardx.init(get.cardInfo(card));
					cardx._cardid = card.cardid;
					return cardx;
				});
				player.directgains(cardsx, null, "hm_zhaobing_tag");
				player.addSkill("hm_zhaobing_in");
			} else {
				player.removeSkill("hm_zhaobing_in");
			}
		},
		ai: {
			combo: "hm_zhouyuan",
		},
		subSkill: {
			tag: {},
			in: {
				charlotte: true,
				trigger: {
					global: ["addToExpansionEnd", "gainEnd", "loseEnd", "equipEnd", "addJudgeEnd", "loseAsyncEnd"],
				},
				filter(event, player) {
					return (
						event.gaintag?.includes("hm_zhouyuan_expansion") ||
						Object.values(event.gaintag_map || {})
							?.flat()
							.includes("hm_zhouyuan_expansion")
					);
				},
				forced: true,
				locked: false,
				silent: true,
				content() {
					"step 0";
					const cards2 = player.getCards("s", card => card.hasGaintag("hm_zhaobing_tag"));
					if (player.isOnline2()) {
						player.send(
							function (cards, player) {
								cards.forEach(i => i.delete());
								if (player == game.me) {
									ui.updatehl();
								}
							},
							cards2,
							player
						);
					}
					cards2.forEach(i => i.delete());
					if (player == game.me) {
						ui.updatehl();
					}
					"step 1";
					const cards = game
						.filterPlayer()
						.map(target => target.getExpansions("hm_zhouyuan_expansion"))
						.flat();
					const cardsx = cards.map(card => {
						const cardx = ui.create.card();
						cardx.init(get.cardInfo(card));
						cardx._cardid = card.cardid;
						return cardx;
					});
					player.directgains(cardsx, null, "hm_zhaobing_tag");
				},
				onremove(player) {
					const cards2 = player.getCards("s", card => card.hasGaintag("hm_zhaobing_tag"));
					if (player.isOnline2()) {
						player.send(
							function (cards, player) {
								cards.forEach(i => i.delete());
								if (player == game.me) {
									ui.updatehl();
								}
							},
							cards2,
							player
						);
					}
					cards2.forEach(i => i.delete());
					if (player == game.me) {
						ui.updatehl();
					}
				},
				group: "hm_zhaobing_use",
			},
			use: {
				charlotte: true,
				trigger: {
					player: ["useCardBefore", "respondBefore"],
				},
				filter(event, player) {
					const cards = player.getCards("s", card => card.hasGaintag("hm_zhaobing_tag") && card._cardid);
					return (
						event.cards &&
						event.cards.some(card => {
							return cards.includes(card);
						})
					);
				},
				forced: true,
				popup: false,
				firstDo: true,
				content() {
					const idList = player.getCards("s", card => card.hasGaintag("hm_zhaobing_tag")).map(i => i._cardid);
					const cards = game
						.filterPlayer()
						.map(target => target.getExpansions("hm_zhouyuan_expansion"))
						.flat();
					const cards2 = [];
					for (const card of trigger.cards) {
						const cardx = cards.find(cardx => cardx.cardid == card._cardid);
						if (cardx) {
							cards2.push(cardx);
						}
					}
					const cards3 = trigger.cards.slice();
					trigger.cards = cards2;
					trigger.card.cards = cards2;
					if (player.isOnline2()) {
						player.send(
							function (cards, player) {
								cards.forEach(i => i.delete());
								if (player == game.me) {
									ui.updatehl();
								}
							},
							cards3,
							player
						);
					}
					cards3.forEach(i => i.delete());
					if (player == game.me) {
						ui.updatehl();
					}
				},
			},
		},
	},
	//神张梁
	hm_jijun: {
		trigger: { target: "useCardToPlayered" },
		frequent: true,
		filter(event, player) {
			if (!event.isFirstTarget) {
				return false;
			}
			return event.player == player;
		},
		onremove(player, skill) {
			const cards = player.getExpansions(skill);
			if (cards.length) {
				player.loseToDiscardpile(cards);
			}
		},
		intro: {
			markcount: "expansion",
			mark(dialog, storage, player) {
				var cards = player.getExpansions("hm_jijun");
				if (player.isUnderControl(true)) {
					dialog.addAuto(cards);
				} else {
					return "共有" + get.cnNumber(cards.length) + "张牌";
				}
			},
		},
		async content(event, trigger, player) {
			const next = player.judge();
			const result = await next.forResult();
			const card = result?.card;
			if (!card || get.owner(card)) {
				return;
			}
			const next2 = player
				.chooseControl([`获得${get.translation(card)}`, `将${get.translation(card)}置于武将牌`])
				.set("ai", () => {
					const { player, cardx } = get.event();
					if (player.getUseValue(cardx) > 3) {
						return 0;
					}
					return player.hasSkill("hm_fangtong") ? 1 : 0;
				})
				.set("cardx", card);
			const result2 = await next2.forResult();
			if (result2.index == 0) {
				await player.gain(card, "gain2");
			} else {
				const next = player.addToExpansion("giveAuto", card, player);
				next.gaintag.add(event.name);
				await next;
			}
		},
	},
	hm_fengtong: {
		trigger: { player: "phaseUseEnd" },
		getAuto(player) {
			var hs = player.getCards("h");
			var ss = player.getExpansions("xinfu_jijun");
			var bool = false,
				max = Math.pow(2, ss.length),
				index,
				i;
			for (i = 0; i < hs.length; i++) {
				for (var j = 1; j < max; j++) {
					var num = get.number(hs[i]);
					index = j.toString(2);
					while (index.length < ss.length) {
						index = "0" + index;
					}
					for (var k = 0; k < ss.length; k++) {
						if (index[k] == "1") {
							num += get.number(ss[k]);
						}
					}
					if (num == 36) {
						bool = true;
						break;
					}
				}
				if (bool) {
					break;
				}
			}
			if (!bool) {
				return [];
			}
			var list = [hs[i]];
			for (var k = 0; k < ss.length; k++) {
				if (index[k] == "1") {
					list.push(ss[k]);
				}
			}
			return list;
		},
		filter(event, player) {
			return player.getExpansions("hm_jijun").length && player.hasCard(lib.filter.cardRecastable, "h");
		},
		async cost(event, trigger, player) {
			event.result = await player.chooseCard(get.prompt2(event.skill), "h", lib.filter.cardRecastable).forResult();
		},
		async content(event, trigger, player) {
			const { cards } = event;
			await player.recast(cards);
			const expansions = player.getExpansions("hm_jijun");
			if (!expansions.length) {
				return;
			}
			let result;
			const next = player.chooseCardButton(expansions, [1, Infinity]);
			next.set("num", get.number(cards[0]));
			next.set("filterOk", () => {
				let sum = get.event().num;
				ui.selected.buttons.forEach(button => {
					const num = get.number(button.link);
					if (typeof num == "number") {
						sum += num;
					}
				});
				return sum === 36;
			});
			next.set("autolist", lib.skill.xinfu_fangtong.getAuto(player));
			next.set("processAI", () => {
				if (_status.event.autolist?.length) {
					return {
						bool: true,
						links: _status.event.autolist,
					};
				}
				return { bool: false };
			});
			next.set("complexSelect", true);
			result = await next.forResult();
			if (result?.bool && result?.links?.length) {
				await player.loseToDiscardpile(result.links);
				if (!game.hasPlayer(current => player != current)) {
					return;
				}
				const next = player.chooseTarget("【方统】：对一名其他角色造成3点雷电伤害", lib.filter.notMe, true);
				next.set("ai", target => {
					const player = get.player();
					return get.damageEffect(player, target, player, "thunder");
				});
				result = await next.forResult();
				if (result?.bool && result?.targets?.length) {
					await result.targets[0].damage("thunder", 3, player);
				}
			}
		},
		ai: { combo: "hm_jijun" },
	},
	//三兄弟都有的玩意
	hm_sanshou: {
		trigger: {
			player: "phaseChange",
		},
		filter(event, player) {
			if (event.phaseList[event.num].startsWith("phaseZhunbei") || event.phaseList[event.num].startsWith("phaseJieshu")) {
				return true;
			}
			return false;
		},
		forced: true,
		async content(event, trigger, player) {
			trigger.phaseList[trigger.num] = `phaseUse|${event.name}`;
			const newPair = [];
			for (const i of [player.name1, player.name2]) {
				if (!i) {
					continue;
				}
				if (i == "hm_shen_zhangjiao") {
					const next = player.chooseButton(["请选择变身对象", [["hm_shen_zhangbao", "hm_shen_zhangliang"], "character"]], true);
					next.set("ai", function (button) {
						return Math.random() - 1;
					});
					const result = await next.forResult();
					if (result.bool) {
						newPair.push(result.links[0]);
					}
				} else {
					newPair.push(i);
				}
			}
			await player.changeCharacter(newPair);
			player.addSkill("hm_sanshou_back");
		},
		subSkill: {
			back: {
				trigger: {
					player: "phaseUseAfter",
				},
				silent: true,
				charlotte: true,
				async content(event, trigger, player) {
					const newPair = [];
					for (const i of [player.name1, player.name2]) {
						if (!i) {
							continue;
						}
						if (["hm_shen_zhangbao", "hm_shen_zhangliang"].includes(i)) {
							newPair.push("hm_shen_zhangjiao");
						} else {
							newPair.push(i);
						}
					}
					await player.changeCharacter(newPair);
					player.removeSkill("hm_sanshou_back");
				},
			},
		},
	},
};

export default skills;
