import { lib, game, ui, get, ai, _status } from "noname";
import html from "dedent";

/** @type { importCharacterConfig["skill"] } */
const skills = {
	//曹丕------by 清风
	wxdlyishi: {
		audio: 2,
		derivation: "wxdlfangzhu",
		enable: "phaseUse",
		manualConfirm: true,
		limited: true,
		skillAnimation: true,
		animationColor: "wood",
		filter(event, player) {
			return game.players.length > 1;
		},
		filterTarget: lib.filter.notMe,
		selectTarget: -1,
		multiline: true,
		multitarget: true,
		async content(event, trigger, player) {
			player.awakenSkill(event.name);
			const targets = event.targets.sortBySeat();
			await player.useSkill({ skill: "wxdlfangzhu", targets });
			await game.doAsyncInOrder(targets, async target => {
				await target.addSkills("wxdlfangzhu");
				target.markAuto("wxdlfangzhu", [player]);
			});
		},
		ai: {
			order: 1,
			result: {
				player: 1,
			},
		},
	},
	wxdlfangzhu: {
		audio: "fangzhu",
		inherit: "fangzhu",
		//防止useSkill重复触发
		multitarget: true,
		multiline: true,
		intro: {
			content: "只能对$发动",
		},
		async cost(event, trigger, player) {
			const draw = player.getDamagedHp();
			const storage = player.getStorage(event.skill);
			event.result = await player
				.chooseTarget({
					prompt: get.prompt(event.skill),
					prompt2: "令一名其他角色翻面" + (draw > 0 ? "并摸" + get.cnNumber(draw) + "张牌" : ""),
					filterTarget(card, player, target) {
						if(player == target) {
							return false;
						}
						const storage = get.event().storage;
						if (!storage?.length) {
							return true;
						}
						return storage.includes(target);
					},
					ai(target) {
						if (target.hasSkillTag("noturn")) {
							return 0;
						}
						const player2 = get.event().player;
						const current = _status.currentPhase;
						const dis = current ? get.distance(current, target, "absolute") : 1;
						const draw2 = player2.getDamagedHp();
						const att = get.attitude(player2, target);
						if (att == 0) {
							return target.hasJudge("lebu") ? Math.random() / 3 : Math.sqrt(get.threaten(target)) / 5 + Math.random() / 2;
						}
						if (att > 0) {
							if (target.isTurnedOver()) {
								return att + draw2;
							}
							if (draw2 < 4) {
								return -1;
							}
							if (current && target.getSeatNum() > current.getSeatNum()) {
								return att + draw2 / 3;
							}
							return (10 * Math.sqrt(Math.max(0.01, get.threaten(target)))) / (3.5 - draw2) + dis / (2 * game.countPlayer());
						} else {
							if (target.isTurnedOver()) {
								return att - draw2;
							}
							if (draw2 >= 5) {
								return -1;
							}
							if (current && target.getSeatNum() <= current.getSeatNum()) {
								return -att + draw2 / 3;
							}
							return (4.25 - draw2) * 10 * Math.sqrt(Math.max(0.01, get.threaten(target))) + (2 * game.countPlayer()) / dis;
						}
					},
				})
				.set("storage", storage)
				.forResult();
		},
		async content(event, trigger, player) {
			const targets = event.targets;
			const num = player.getDamagedHp();
			if (num > 0) {
				await game.doAsyncInOrder(targets, async target => await target.draw({ num }));
			}
			await game.doAsyncInOrder(targets, async target => await target.turnOver());
		},
	},
	wxdlnianjun: {
		audio: 2,
		global: "wxdlnianjun_sha",
		group: "wxdlnianjun_loseHp",
		trigger: { player: "phaseJieshuBegin" },
		filter(event, player) {
			return game.hasPlayer(current => current.hasCards("h")) && player.hasCards("h");
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget({
					prompt: get.prompt(event.skill),
					prompt2: "连接你与任意名其他角色各一张手牌",
					filterTarget(card, player, target) {
						return player != target && target.hasCards("h");
					},
					selectTarget: [1, Infinity],
					ai(target) {
						const player = get.player();
						const att = get.sgnAttitude(player, target);
						return -att / (1 + target.countConnectedCards());
					},
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const targets = event.targets.slice().concat([player]).sortBySeat(),
				connects = new Map();
			for (const current of targets) {
				const cards2 = current.getCards("h");
				if (!current?.isIn() || !cards2.length) {
					continue;
				}
				const result =
					cards2.length == 1
						? { links: cards2 }
						: await player
								.choosePlayerCard({
									target: current,
									position: "h",
									forced: true,
									ai(button) {
										const { player: player2, target } = get.event();
										const { link } = button;
										const att = get.attitude(player2, target);
										let val = get.value(link, target);
										if (att > 0) {
											if (player2 == target && player2 == _status.currentPhase) {
												const num = target.countConnectedCards();
												if (num > 0) {
													if (get.is.connectedCard(link)) {
														val += 3;
													}
													return val;
												} else if (!get.is.connectedCard(link) && !get.tag(link, "damage")) {
													return 6.5 - val;
												}
												return 6 - val;
											}
											if (get.is.connectedCard(link)) {
												val += 3;
											}
											return val;
										}
										if (!get.is.connectedCard(link)) {
											val += 3;
										}
										return val;
									},
								})
								.forResult();
				if (result?.links?.length) {
					connects.set(current, result.links);
				}
			}
			for (const [current, cards2] of connects) {
				await current.connectCards(cards2);
			}
		},
		subSkill: {
			loseHp: {
				audio: "wxdlnianjun",
				forced: true,
				trigger: {
					global: ["loseAfter", "loseAsyncAfter", "equipAfter", "addJudgeAfter", "addToExpansionAfter", "gainAfter"],
				},
				filter(event, player) {
					const evts = game.getGlobalHistory("everything", evt => {
						return game.hasPlayer2(current => evt?.sxrmConnectCardsMap?.has?.(current));
					});
					return evts.indexOf(event) == 0;
				},
				getIndex(event, player) {
					return game.filterPlayer(current => {
						const evt = event.getl(current);
						if (!evt || !evt.cards2 || !evt.cards2.length) {
							return false;
						}
						if (event.name == "lose") {
							for (var i in event.gaintag_map) {
								if (event.gaintag_map[i].includes("visible_sxrm_connect_tag")) {
									return true;
								}
							}
							return false;
						}
						return current.hasHistory("lose", evt2 => {
							if (event != evt2.getParent()) {
								return false;
							}
							for (var i2 in evt2.gaintag_map) {
								if (evt2.gaintag_map[i2].includes("visible_sxrm_connect_tag")) {
									return true;
								}
							}
							return false;
						});
					});
				},
				logTarget(event, player, name, index) {
					return index;
				},
				async content(event, trigger, player) {
					const target = event.indexedData;
					await target.loseHp();
				},
			},
			sha: {
				mod: {
					cardUsableTarget(card, player, target) {
						if (player.hasConnectedCards() && target.hasConnectedCards()) {
							return Infinity;
						}
					},
				},
			},
		},
	},
	wxdlqianqian: {
		audio: 2,
		locked: true,
		mod: {
			cardEnabled(card, player) {
				if (!player.hasHistory("useCard") && get.suit(card) == "heart") {
					return false;
				}
			},
			cardSavable(card, player) {
				if (!player.hasHistory("useCard") && get.suit(card) == "heart") {
					return false;
				}
			},
		},
	},
	//沙币文心雕龙曹植
	wxdl_huamao: {
		derivation: ["wushen", "liushi", "gongxin", "tianxiang", "guose", "limu", "fengpo", "jiexun", "leiji", "zuoding", "miehai", "jiyu", "luoying", "lianhuan", "zhujiu", "ninghan"].map(i => "huamao_" + i),
		map: {
			heart: ["wushen", "liushi", "gongxin", "tianxiang"].map(i => "huamao_" + i),
			diamond: ["guose", "limu", "fengpo", "jiexun"].map(i => "huamao_" + i),
			spade: ["leiji", "zuoding", "miehai", "jiyu"].map(i => "huamao_" + i),
			club: ["luoying", "lianhuan", "zhujiu", "ninghan"].map(i => "huamao_" + i),
		},
		getSuit(player, skill) {
			const { map } = get.info("wxdl_huamao");
			return player.getStorage(skill + "_suit", Object.keys(map).find(suit => map[suit].includes(skill)) || null);
		},
		forced: true,
		locked: false,
		trigger: { global: "roundStart" },
		filter(event, player) {
			return game.roundNumber == 1;
		},
		async content(event, trigger, player) {
			const { map } = get.info(event.name);
			const suits = lib.suit.randomGets(3);
			const skills = suits.map(i => map[i].randomGet());
			player.addSkill(`${event.name}_clear`);
			await player.addAdditionalSkills(event.name, skills);
			const result = await player
				.chooseToMove_new({
					prompt: "华茂：你可以分配不同花色给以下技能",
					list: [
						[
							"要分配的花色",
							suits.map(suit => {
								const node = ui.create.card();
								node.init(["", NaN, "lukai_" + suit, ""]);
								return node;
							}),
						],
						skills.map(i => [get.translation(i)]),
					],
					filterOk(moved) {
						const list = [moved[1], moved[2], moved[3]];
						return list.every(i => i.length == 1);
					},
					filterMove(from, to, moved) {
						if (typeof to == "number") {
							if (to == 0) {
								return true;
							}
							return !moved[to].length;
						}
						return true;
					},
					processAI(list) {
						const suits = list[0][1].slice();
						const moved = [[], [suits.randomRemove()], [suits.randomRemove()], [suits.randomRemove()]];
						return moved;
					},
				})
				.forResult();
			const { moved } = result;
			if (result.bool && [moved[1], moved[2], moved[3]]?.every(i => i.length == 1)) {
				const suits = [moved[1], moved[2], moved[3]].map(i => get.name(i[0])?.slice(6));
				skills.forEach((skill, idx) => player.setStorage(skill + "_suit", suits[idx]));
			}
		},
		subSkill: {
			clear: {
				charlotte: true,
				trigger: {
					global: "washCard",
				},
				forced: true,
				popup: false,
				async content(event, trigger, player) {
					player.removeSkill(event.name);
					await player.removeAdditionalSkills("wxdl_huamao");
				},
			},
		},
	},
	wxdl_qishen: {
		trigger: {
			player: "phaseEnd",
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget({
					prompt: get.prompt2(event.skill),
					selectTarget: [1, 3],
					filterTaraget: lib.filter.all,
					ai(target) {
						//return -get.attitude(get.player(), target);
						return 0;
					},
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const { targets } = event;
			player.addTempSkill(event.name + "_clear", { player: "dieAfter" });
			player
				.when({ player: "phaseEnd" })
				.filter(evt => evt != trigger)
				.then(async (event, trigger, player) => {
					player.removeSkill("wxdl_qishen_clear");
				});
			targets.forEach(target => target.addAdditionalSkill(`${event.name}_${player.playerid}`, `${event.name}_chanyuan`));
			let prevTargets = [];
			for (const history of player.actionHistory.slice(0, -1).reverse()) {
				if (!history.isMe || history.isSkipped) {
					continue;
				}
				prevTargets = history["useSkill"].find(evt => evt.skill == event.name)?.targets || [];
				break;
			}
			if (targets.some(target => prevTargets.includes(target))) {
				await game.asyncDraw(
					targets.filter(target => prevTargets.includes(target)),
					3
				);
			}
		},
		subSkill: {
			clear: {
				charlotte: true,
				onremove(player, skill) {
					game.players.forEach(target => target.removeAdditionalSkill("wxdl_qishen_" + player.playerid));
				},
			},
			chanyuan: {
				charlotte: true,
				init(player, skill) {
					player.addSkillBlocker(skill);
				},
				onremove(player, skill) {
					player.removeSkillBlocker(skill);
				},
				skillBlocker(skill, player) {
					return skill != "wxdl_qishen" && !lib.skill[skill].charlotte && !lib.skill[skill].persevereSkill;
				},
				mark: true,
				intro: {
					content(storage, player, skill) {
						var str = "<li>你造成的伤害+1";
						var list = player.getSkills(null, false, false).filter(function (i) {
							return lib.skill.wxdl_qishen_chanyuan.skillBlocker(i, player);
						});
						if (list.length) {
							str += "<br><li>失效技能：" + get.translation(list);
						}
						return str;
					},
				},
				trigger: {
					source: "damageBegin1",
				},
				forced: true,
				popup: false,
				async content(event, trigger, player) {
					trigger.num++;
				},
			},
		},
	},
	huamao_wushen: {
		onremove: true,
		mod: {
			cardname(card, player, name) {
				if (get.suit(card) == get.info("wxdl_huamao").getSuit(player, "huamao_wushen")) {
					return "sha";
				}
			},
			cardnature(card, player) {
				if (get.suit(card) == get.info("wxdl_huamao").getSuit(player, "huamao_wushen")) {
					return false;
				}
			},
			targetInRange(card, player) {
				if (card.name === "sha") {
					const suit = get.suit(card);
					if (suit === get.info("wxdl_huamao").getSuit(player, "huamao_wushen") || suit === "unsure") {
						return true;
					}
				}
			},
			cardUsable(card, player) {
				if (card.name === "sha") {
					const suit = get.suit(card);
					if (suit === get.info("wxdl_huamao").getSuit(player, "huamao_wushen") || suit === "unsure") {
						return Infinity;
					}
				}
			},
		},
		trigger: { player: "useCard" },
		forced: true,
		filter(event, player) {
			return event.card.name == "sha" && get.suit(event.card) == get.info("wxdl_huamao").getSuit(player, "huamao_wushen");
		},
		async content(event, trigger, player) {
			trigger.directHit.addArray(game.players);
			if (trigger.addCount !== false) {
				trigger.addCount = false;
				if (player.stat[player.stat.length - 1].card.sha > 0) {
					player.stat[player.stat.length - 1].card.sha--;
				}
			}
		},
		ai: {
			effect: {
				target(card, player, target, current) {
					if (get.tag(card, "respondSha") && current < 0) {
						return 0.6;
					}
				},
			},
			directHit_ai: true,
			skillTagFilter(player, tag, arg) {
				return arg.card.name == "sha" && get.suit(arg.card) == get.info("wxdl_huamao").getSuit(player, "huamao_wushen");
			},
		},
	},
	huamao_liushi: {
		onremove: true,
		enable: "phaseUse",
		filter(event, player) {
			return player.countCards("he", { suit: get.info("wxdl_huamao").getSuit(player, "huamao_liushi") }) > 0;
		},
		filterCard(card, player) {
			return get.suit(card) == get.info("wxdl_huamao").getSuit(player, "huamao_liushi");
		},
		position: "he",
		filterTarget(card, player, target) {
			return player.canUse("sha", target, false);
		},
		check(card) {
			var player = _status.event.player;
			var next = player.getNext();
			var att = get.attitude(player, next);
			if (att > 0) {
				var js = next.getCards("j");
				if (js.length) {
					return get.judge(js[0]) + 10 - get.value(card);
				}
				return 9 - get.value(card);
			}
			return 6 - get.value(card);
		},
		discard: false,
		prepare: "throw",
		loseTo: "cardPile",
		visible: true,
		insert: true,
		async content(event, trigger, player) {
			const { cards, targets } = event;
			game.log(player, "将", cards, "置于牌堆顶");
			await player.useCard({ name: "sha", isCard: true, storage: { [event.name]: true } }, false, targets);
		},
		group: "huamao_liushi_damage",
		subSkill: {
			damage: {
				trigger: { source: "damageSource" },
				forced: true,
				popup: false,
				filter(event, player) {
					return event.card?.storage?.huamao_liushi == true && event.player.isIn() && event.getParent(3).name == "huamao_liushi";
				},
				async content(event, trigger, player) {
					trigger.player.addMark("huamao_liushi_effect", 1);
					trigger.player.addSkill("huamao_liushi_effect");
				},
			},
			effect: {
				mod: {
					maxHandcard(player, num) {
						return num - player.countMark("huamao_liushi_effect");
					},
				},
				onremove: true,
				charlotte: true,
				intro: {
					name2: "流",
					content: "手牌上限-#",
				},
			},
		},
		ai: {
			order() {
				return get.order({ name: "sha" }) - 0.4;
			},
			result: {
				target(player, target) {
					const eff = get.effect(target, { name: "sha" }, player, target);
					const damageEff = get.damageEffect(target, player, player);
					if (eff > 0) {
						return damageEff > 0 ? 0 : eff;
					}
					if (target.hasSkill("bagua_skill") || target.hasSkill("rw_bagua_skill") || target.hasSkill("bazhen")) {
						return 0;
					}
					return eff;
				},
			},
		},
	},
	huamao_gongxin: {
		onremove: true,
		enable: "phaseUse",
		usable: 1,
		filterTarget(card, player, target) {
			return target != player && target.countCards("h");
		},
		async content(event, trigger, player) {
			const { target } = event;
			const cards = target.getCards("h");
			const result = await player
				.chooseToMove_new("攻心")
				.set("list", [
					[get.translation(target) + "的手牌", cards],
					[["弃置"], ["置于牌堆顶"]],
				])
				.set("filterOk", moved => {
					return (
						moved[1]
							.slice()
							.concat(moved[2])
							.filter(card => get.suit(card) == get.info("wxdl_huamao").getSuit(get.player(), "huamao_gongxin")).length == 1
					);
				})
				.set("filterMove", (from, to, moved) => {
					if (moved[0].includes(from.link) && moved[1].length + moved[2].length >= 1 && [1, 2].includes(to)) {
						return false;
					}
					return get.suit(from) == get.info("wxdl_huamao").getSuit(get.player(), "huamao_gongxin");
				})
				.set("processAI", list => {
					let card = list[0][1]
						.slice()
						.filter(card => {
							return get.suit(card) == get.info("wxdl_huamao").getSuit(get.player(), "huamao_gongxin");
						})
						.sort((a, b) => {
							return get.value(b) - get.value(a);
						})[0];
					if (!card) {
						return false;
					}
					return [list[0][1].slice().remove(card), [card], []];
				})
				.forResult();
			if (result.bool) {
				if (result.moved[1].length) {
					await target.discard(result.moved[1]);
				} else {
					await player.showCards(result.moved[2], get.translation(player) + "对" + get.translation(target) + "发动了【攻心】");
					await target.lose(result.moved[2], ui.cardPile, "visible", "insert");
				}
			}
		},
		ai: {
			threaten: 1.5,
			result: {
				target(player, target) {
					return -target.countCards("h");
				},
			},
			order: 10,
			expose: 0.4,
		},
	},
	huamao_tianxiang: {
		onremove: true,
		trigger: { player: "damageBegin4" },
		filter(event, player) {
			return (
				player.countCards("h", function (card) {
					return _status.connectMode || get.suit(card, player) == get.info("wxdl_huamao").getSuit(player, "huamao_tianxiang");
				}) > 0 && event.num > 0
			);
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseCardTarget({
					filterCard(card, player) {
						return get.suit(card) == get.info("wxdl_huamao").getSuit(player, "huamao_tianxiang") && lib.filter.cardDiscardable(card, player);
					},
					filterTarget(card, player, target) {
						return player != target;
					},
					ai1(card) {
						return 10 - get.value(card);
					},
					ai2(target) {
						const att = get.attitude(_status.event.player, target);
						const trigger = _status.event.getTrigger();
						let da = 0;
						if (_status.event.player.hp == 1) {
							da = 10;
						}
						const eff = get.damageEffect(target, trigger.source, target);
						if (att == 0) {
							return 0.1 + da;
						}
						if (eff >= 0 && att > 0) {
							return att + da;
						}
						if (att > 0 && target.hp > 1) {
							if (target.maxHp - target.hp >= 3) {
								return att * 1.1 + da;
							}
							if (target.maxHp - target.hp >= 2) {
								return att * 0.9 + da;
							}
						}
						return -att + da;
					},
					prompt: get.prompt(event.skill),
					prompt2: get.skillInfoTranslation(event.skill, player, false),
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const [target] = event.targets;
			const [card] = event.cards;
			trigger.cancel();
			await player.discard(event.cards);
			const result = await player
				.chooseControlList(
					true,
					function (event, player) {
						const target = _status.event.target;
						let att = get.attitude(player, target);
						if (target.hasSkillTag("maixie")) {
							att = -att;
						}
						if (att > 0) {
							return 0;
						} else {
							return 1;
						}
					},
					["令" + get.translation(target) + "受到伤害来源对其造成的1点伤害，然后摸X张牌（X为其已损失体力值且至多为5）", "令" + get.translation(target) + "失去1点体力，然后获得" + get.translation(event.cards)]
				)
				.set("target", target)
				.forResult();
			if (typeof result.index != "number") {
				return;
			}
			if (result.index) {
				event.related = target.loseHp();
			} else {
				event.related = target.damage(trigger.source || "nosource", "nocard");
			}
			await event.related;
			//if(event.related.cancelled||target.isDead()) return;
			if (result.index && card.isInPile()) {
				await target.gain(card, "gain2");
			} else if (target.getDamagedHp()) {
				await target.draw(Math.min(5, target.getDamagedHp()));
			}
		},
		ai: {
			maixie_defend: true,
			effect: {
				target(card, player, target) {
					if (player.hasSkillTag("jueqing", false, target)) {
						return;
					}
					if (get.tag(card, "damage") && target.countCards("he") > 1) {
						return 0.7;
					}
				},
			},
		},
	},
	huamao_guose: {
		onremove: true,
		enable: "phaseUse",
		usable: 1,
		discard: false,
		lose: false,
		delay: false,
		filter(event, player) {
			return player.countCards("hes", { suit: get.info("wxdl_huamao").getSuit(player, "huamao_guose") }) > 0;
		},
		position: "hes",
		filterCard(card, player) {
			return get.suit(card) == get.info("wxdl_huamao").getSuit(player, "huamao_guose");
		},
		filterTarget(card, player, target) {
			if (get.position(ui.selected.cards[0]) != "s" && lib.filter.cardDiscardable(ui.selected.cards[0], player, "huamao_guose") && target.hasJudge("lebu")) {
				return true;
			}
			if (player == target) {
				return false;
			}
			if (!game.checkMod(ui.selected.cards[0], player, "unchanged", "cardEnabled2", player)) {
				return false;
			}
			return player.canUse({ name: "lebu", cards: ui.selected.cards }, target);
		},
		check(card) {
			return 7 - get.value(card);
		},
		async content(event, trigger, player) {
			const { target } = event;
			if (event.target.hasJudge("lebu")) {
				await player.discard(event.cards);
				await target.discard(event.target.getJudge("lebu"));
			} else {
				await player.useCard({ name: "lebu" }, event.target, event.cards).set("audio", false);
			}
			await player.draw();
		},
		ai: {
			result: {
				target(player, target) {
					if (target.hasJudge("lebu")) {
						return -get.effect(target, { name: "lebu" }, player, target);
					}
					return get.effect(target, { name: "lebu" }, player, target);
				},
			},
			order: 9,
		},
	},
	huamao_limu: {
		onremove: true,
		mod: {
			targetInRange(card, player, target) {
				if (player.countCards("j") && player.inRange(target)) {
					return true;
				}
			},
			cardUsableTarget(card, player, target) {
				if (player.countCards("j") && player.inRange(target)) {
					return true;
				}
			},
			aiOrder(player, card, num) {
				if (get.type(card, null, player) == "trick" && player.canUse(card, player) && player.canAddJudge(card)) {
					return 15;
				}
			},
		},
		locked: false,
		audio: 2,
		enable: "phaseUse",
		discard: false,
		filter(event, player) {
			if (player.hasJudge("lebu")) {
				return false;
			}
			return player.countCards("hes", { suit: get.info("wxdl_huamao").getSuit(player, "huamao_limu") }) > 0;
		},
		viewAs: { name: "lebu" },
		//prepare:"throw",
		position: "hes",
		filterCard(card, player, event) {
			const lebu = get.autoViewAs({ name: "lebu", cards: [card] }, [card]);
			return get.suit(card) == get.info("wxdl_huamao").getSuit(player, "huamao_limu") && lib.filter.judge(lebu, player, player);
		},
		selectTarget: -1,
		filterTarget(card, player, target) {
			return player == target;
		},
		check(card) {
			var player = _status.event.player;
			if (!player.getEquip("zhangba")) {
				let damaged = player.maxHp - player.hp - 1;
				if (
					player.countCards("h", function (cardx) {
						if (cardx == card) {
							return false;
						}
						if (cardx.name == "tao") {
							if (damaged < 1) {
								return true;
							}
							damaged--;
						}
						return ["shan", "jiu"].includes(cardx.name);
					}) > 0
				) {
					return 0;
				}
			}
			if (card.name == "shan") {
				return 15;
			}
			if (card.name == "tao" || card.name == "jiu") {
				return 10;
			}
			return 9 - get.value(card);
		},
		onuse(links, player) {
			var next = game.createEvent("huamao_limu_recover", false, _status.event.getParent());
			next.player = player;
			next.setContent(function () {
				player.recover();
			});
		},
		ai: {
			result: {
				target(player, target) {
					if (player.countCards("hes", "zhangba")) {
						return player.countCards("h", { type: "basic" });
					}
					let res = lib.card.lebu.ai.result.target(player, target);
					if (player.countCards("hs", "sha") >= player.hp) {
						res++;
					}
					if (target.isDamaged()) {
						return res + 2 * Math.abs(get.recoverEffect(target, player, target));
					}
					return res;
				},
				ignoreStatus: true,
			},
			order(item, player) {
				if (player.hp > 1 && player.countCards("j")) {
					return 0;
				}
				return 12;
			},
			effect: {
				target(card, player, target) {
					if (target.isPhaseUsing() && typeof card === "object" && get.type(card, null, target) === "delay" && !target.countCards("j")) {
						let shas =
							target.getCards("hs", i => {
								if (card === i || (card.cards && card.cards.includes(i))) {
									return false;
								}
								return get.name(i, target) === "sha" && target.getUseValue(i) > 0;
							}) - target.getCardUsable("sha");
						if (shas > 0) {
							return [1, 1.5 * shas];
						}
					}
				},
			},
		},
	},
	huamao_fengpo: {
		onremove: true,
		trigger: {
			player: "useCardToPlayered",
		},
		filter(event, player) {
			if (event.targets.length != 1 || !["sha", "juedou"].includes(event.card.name)) {
				return false;
			}
			const evtx = event.getParent();
			return player.getHistory("useCard", evt => evt.card.name == event.card.name).indexOf(evtx) == 0;
		},
		async cost(event, trigger, player) {
			const str1 = get.translation(trigger.card),
				str2 = get.translation(trigger.target);
			const suit = get.translation(get.info("wxdl_huamao").getSuit(player, event.skill));
			const result = await player
				.chooseControl({
					controls: ["摸X加1伤", "摸1加X伤", "cancel2"],
					prompt: get.prompt(event.skill, trigger.target),
					prompt2: "你可以选择一项：1.摸X张牌，令" + str1 + "的伤害+1；2.摸一张牌，令" + str1 + "的伤害+X（X为" + str2 + "的" + suit + "牌的数量）。",
				})
				.forResult();
			if (result.control != "cancel2") {
				event.result = {
					bool: true,
					cost_data: result.index,
				};
			}
		},
		logTarget: "target",
		async content(event, trigger, player) {
			const {
				cost_data: index,
				targets: [target],
			} = event;
			const nd = target.countCards("he", { suit: get.info("wxdl_huamao").getSuit(player, event.name) });
			let draw = 1,
				damage = 1;
			if (index == 0) {
				draw = nd;
			} else {
				damage = nd;
			}
			await player.draw(draw);
			const evt = trigger.getParent();
			if (typeof evt.baseDamage != "number") {
				evt.baseDamage = 1;
			}
			evt.baseDamage += damage;
		},
	},
	huamao_jiexun: {
		onremove: true,
		trigger: { player: "phaseJieshuBegin" },
		async cost(event, trigger, player) {
			const num1 = game.countPlayer(function (current) {
				return current.countCards("ej", { suit: get.info("wxdl_huamao").getSuit(player, event.skill) });
			});
			const num2 = player.countMark(event.skill);
			let str = "令目标摸" + get.cnNumber(num1) + "张牌";
			if (num2) {
				str += "，然后弃置" + get.cnNumber(num2) + "张牌";
			}
			event.result = await player
				.chooseTarget({
					prompt: get.prompt(event.skill),
					filterTarget(card, player, target) {
						return target != player;
					},
					ai(target) {
						return _status.event.coeff * get.attitude(_status.event.player, target);
					},
					prompt2: str,
				})
				.set("coeff", num1 >= num2 ? 1 : -1)
				.forResult();
		},
		async content(event, trigger, player) {
			const {
				targets: [target],
			} = event;
			const num1 = game.countPlayer(function (current) {
				return current.countCards("ej", { suit: get.info("wxdl_huamao").getSuit(player, event.name) });
			});
			const num2 = player.countMark(event.name);
			player.addMark(event.name, 1, false);
			if (num1 > 0) {
				await target.draw({ num: num1 });
			}
			if (num2 > 0) {
				const result = await target.chooseToDiscard({ selectCard: num2, forced: true, position: "he" }).forResult;
				if (result.bool && result.autochoose && result.cards.length == result.rawcards.length) {
					player.clearMark(event.name, false);
					player.addSkill("funan_jiexun");
				}
			}
		},
		intro: { content: "已经发动过了#次" },
	},
	huamao_leiji: {
		onremove: true,
		trigger: { player: ["useCard", "respond"] },
		filter(event, player) {
			return event.card.name == "shan";
		},
		line: "thunder",
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt2(event.skill))
				.set("ai", target => {
					const player = get.player();
					if (target.hasSkill("hongyan")) {
						return 0;
					}
					return get.damageEffect(target, player, player, "thunder");
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const [target] = event.targets;
			const next = target.judge(card => {
				const evt = get.event().name == "judge" ? get.event() : get.event().getParent("judge");
				if (get.suit(card) == evt.suit) {
					return -4;
				}
				return 4;
			});
			next.set("suit", get.info("wxdl_huamao").getSuit(player, event.name));
			next.judge2 = result => !result.bool;
			const result = await next.forResult();
			if (!result?.bool) {
				await target.damage(2, "thunder");
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
								return get.suit(cardx) === get.info("wxdl_huamao").getSuit(player, "huamao_leiji");
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
	huamao_zuoding: {
		onremove: true,
		trigger: { global: "useCardToPlayered" },
		filter(event, player) {
			if (event.getParent().triggeredTargets3.length > 1) {
				return false;
			}
			return (
				get.suit(event.card) == get.info("wxdl_huamao").getSuit(player, "huamao_zuoding") &&
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
					prompt: get.prompt(event.skill),
					prompt2: "令一名目标角色摸一张牌",
					filterTarget(card, player, target) {
						return _status.event.targets.includes(target);
					},
					ai(target) {
						return get.attitude(_status.event.player, target);
					},
				})
				.set("targets", trigger.targets)
				.forResult();
		},
		async content(event, trigger, player) {
			const {
				targets: [target],
			} = event;
			await target.draw();
		},
		ai: {
			expose: 0.2,
		},
	},
	huamao_miehai: {
		onremove: true,
		enable: "chooseToUse",
		filterCard: true,
		selectCard: 2,
		position: "hes",
		viewAs: {
			name: "sha",
			nature: "stab",
			storage: {
				huamao_miehai: true,
			},
		},
		complexCard: true,
		filter(event, player) {
			return player.countCards("hes") >= 2;
		},
		prompt: "将两张牌当刺【杀】使用或打出",
		async precontent(event, trigger, player) {
			player
				.when("useCardAfter")
				.filter(evt => evt.getParent() == event.getParent())
				.step(async (event, trigger, player) => {
					const targets = game.filterPlayer(current => {
						return current.getHistory("lose", evt => {
							const cards = evt.cards2;
							if (!evt.getParent(evt => evt == trigger, true, true) || !cards.some(card => get.suit(card) == get.info("wxdl_huamao").getSuit(player, "huamao_miehai"))) {
								return false;
							}
							return evt.visible;
						}).length;
					});
					if (!targets?.length) {
						return;
					}
					for (let target of targets) {
						if (target.isDamaged()) {
							await target.draw(2);
							await target.recover();
						}
					}
				});
		},
		check(card) {
			let player = _status.event.player;
			let val = get.value(card);
			if (get.suit(card) == get.info("wxdl_huamao").getSuit(player, "huamao_miehai") && player.isDamaged()) {
				val *= 0.6;
			}
			return Math.max(5, 8 - 0.7 * player.hp) - val;
		},
		ai: {
			order(item, player) {
				return get.order({ name: "sha" }) + 0.1;
			},
		},
		locked: false,
		mod: {
			targetInRange(card) {
				if (card?.storage?.huamao_miehai) {
					return true;
				}
			},
			cardUsable(card, player, num) {
				if (card?.storage?.huamao_miehai) {
					return Infinity;
				}
			},
		},
	},
	huamao_jiyu: {
		onremove: true,
		enable: "phaseUse",
		locked: false,
		filter(event, player) {
			const hs = player.getCards("h");
			for (let i = 0; i < hs.length; i++) {
				if (!player.getStorage("huamao_jiyu_limit").includes(get.suit(hs[i]))) {
					return true;
				}
			}
			return false;
		},
		filterTarget(card, player, target) {
			return target.countCards("h") > 0 && !player.getStorage("huamao_jiyu").includes(target);
		},
		async content(event, trigger, player) {
			const { target } = event;
			player.addTempSkill(`${event.name}_limit`);
			player.markAuto(`${event.name}`, target);
			let spade = true;
			if (player.isTurnedOver() || get.attitude(target, player) > 0 || target.hp <= 2) {
				spade = false;
			}
			const result = await target
				.chooseToDiscard({
					position: "h",
					forced: true,
					ai(card) {
						if (get.suit(card) == get.event().suit) {
							if (_status.event.spade) {
								return 10 - get.value(card);
							} else {
								return -10 - get.value(card);
							}
						}
						if (_status.event.getParent().player.getStorage("huamao_jiyu_limit").includes(get.suit(card))) {
							return -3 - get.value(card);
						}
						return -get.value(card);
					},
				})
				.set("spade", spade)
				.set("suit", get.info("wxdl_huamao").getSuit(player, event.name))
				.forResult();
			if (!result.cards?.length) {
				return;
			}
			const card = result.cards[0];
			player.markAuto(`${event.name}_limit`, get.suit(card, target));
			if (get.suit(card, target) == get.info("wxdl_huamao").getSuit(player, event.name)) {
				await player.turnOver();
				await target.loseHp();
			}
		},
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
		subSkill: {
			limit: {
				charlotte: true,
				onremove: ["huamao_jiyu", "huamao_jiyu_limit"],
				mod: {
					cardEnabled(card, player) {
						if (player.getStorage("huamao_jiyu_limit").includes(get.suit(card))) {
							return false;
						}
					},
					cardSavable(card, player) {
						if (player.getStorage("huamao_jiyu_limit").includes(get.suit(card))) {
							return false;
						}
					},
				},
			},
		},
	},
	huamao_luoying: {
		onremove: true,
		group: ["huamao_luoying_discard", "huamao_luoying_judge"],
		subSkill: {
			discard: {
				trigger: { global: ["loseAfter", "loseAsyncAfter"] },
				filter(event, player) {
					if (event.type != "discard" || event.getlx === false) {
						return false;
					}
					return game.filterPlayer2(target => target != player, void 0, true).some(target => event.getl(target)?.cards2.some(card => get.suit(card, target) == get.info("wxdl_huamao").getSuit(player, "huamao_luoying")));
				},
				async cost(event, trigger, player) {
					const cards = game.filterPlayer2(target => target != player, void 0, true).reduce((list, target) => [...list, ...trigger.getl(target)?.cards2.filter(card => get.suit(card, target) == get.info("wxdl_huamao").getSuit(player, "huamao_luoying"))], []);
					const result = await player
						.chooseButton({
							createDialog: ["落英：选择要获得的牌", cards],
							selectButton: [1, cards.length],
							ai(button) {
								return get.value(button.link, _status.event.player, "raw");
							},
						})
						.forResult();
					if (result.bool !== false) {
						event.result = {
							bool: true,
							cost_data: result.links,
						};
					}
				},
				async content(event, trigger, player) {
					const { cost_data: cards } = event;
					await player.gain({ cards, animate: "gain2" });
				},
			},
			judge: {
				trigger: { global: "cardsDiscardAfter" },
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
					return get.suit(event.cards[0]) == get.info("wxdl_huamao").getSuit(player, "huamao_luoying");
				},
				async cost(event, trigger, player) {
					const { cards } = trigger;
					const result = await player
						.chooseButton({
							createDialog: ["落英：选择要获得的牌", cards],
							selectButton: [1, cards.length],
							ai(button) {
								return get.value(button.link, _status.event.player, "raw");
							},
						})
						.forResult();
					if (result.bool !== false) {
						event.result = {
							bool: true,
							cost_data: result.links,
						};
					}
				},
				async content(event, trigger, player) {
					const { cost_data: cards } = event;
					await player.gain({ cards, animate: "gain2" });
				},
			},
		},
	},
	huamao_lianhuan: {
		onremove: true,
		hiddenCard(player, name) {
			return name == "tiesuo" && player.hasCard(card => get.suit(card) == get.info("wxdl_huamao").getSuit(player, "huamao_lianhuan"), "sh");
		},
		enable: "chooseToUse",
		filter(event, player) {
			if (!player.hasCard(card => get.suit(card) == get.info("wxdl_huamao").getSuit(player, "huamao_lianhuan"), "sh")) {
				return false;
			}
			return event.type == "phase" || event.filterCard(get.autoViewAs({ name: "tiesuo" }, "unsure"), player, event);
		},
		position: "hs",
		filterCard(card, player, event) {
			if (!event) {
				event = _status.event;
			}
			if (get.suit(card) != get.info("wxdl_huamao").getSuit(player, "huamao_lianhuan")) {
				return false;
			}
			if (event.type == "phase" && get.position(card) != "s" && player.canRecast(card)) {
				return true;
			} else {
				if (game.checkMod(card, player, "unchanged", "cardEnabled2", player) === false) {
					return false;
				}
				const cardx = get.autoViewAs({ name: "tiesuo" }, [card]);
				return event._backup.filterCard(cardx, player, event);
			}
		},
		filterTarget(fuck, player, target) {
			const card = ui.selected.cards[0],
				event = _status.event,
				backup = event._backup;
			if (!card || game.checkMod(card, player, "unchanged", "cardEnabled2", player) === false) {
				return false;
			}
			const cardx = get.autoViewAs({ name: "tiesuo" }, [card]);
			return backup.filterCard(cardx, player, event) && backup.filterTarget(cardx, player, target);
		},
		selectTarget() {
			const card = ui.selected.cards[0],
				event = _status.event,
				player = event.player,
				backup = event._backup;
			let recast = false,
				use = false;
			const cardx = get.autoViewAs({ name: "tiesuo" }, [card]);
			if (event.type == "phase" && player.canRecast(card)) {
				recast = true;
			}
			if (card && game.checkMod(card, player, "unchanged", "cardEnabled2", player) !== false) {
				if (backup.filterCard(cardx, player, event)) {
					use = true;
				}
			}
			if (!use) {
				return [0, 0];
			} else {
				const select = backup.selectTarget(cardx, player);
				if (recast && select[0] > 0) {
					select[0] = 0;
				}
				return select;
			}
		},
		filterOk() {
			const card = ui.selected.cards[0],
				event = _status.event,
				player = event.player,
				backup = event._backup;
			const selected = ui.selected.targets.length;
			let recast = false,
				use = false;
			const cardx = get.autoViewAs({ name: "tiesuo" }, [card]);
			if (event.type == "phase" && player.canRecast(card)) {
				recast = true;
			}
			if (card && game.checkMod(card, player, "unchanged", "cardEnabled2", player) !== false) {
				if (backup.filterCard(cardx, player, event)) {
					use = true;
				}
			}
			if (recast && selected == 0) {
				return true;
			} else if (use) {
				const select = backup.selectTarget(cardx, player);
				if (select[0] <= -1) {
					return true;
				}
				return selected >= select[0] && selected <= select[1];
			}
		},
		ai1(card) {
			return 6 - get.value(card);
		},
		ai2(target) {
			const player = get.player();
			return get.effect(target, { name: "tiesuo" }, player, player);
		},
		discard: false,
		lose: false,
		delay: false,
		viewAs(cards, player) {
			return {
				name: "tiesuo",
			};
		},
		prepare: () => true,
		async precontent(event, trigger, player) {
			const result = event.result;
			if (!result?.targets?.length) {
				delete result.card;
			}
		},
		async content(event, trigger, player) {
			await player.recast(event.cards);
		},
		ai: {
			order(item, player) {
				if (game.hasPlayer(current => get.effect(current, { name: "tiesuo" }, player, player) > 0) || player.hasCard(card => get.suit(card) == "club" && player.canRecast(card), "h")) {
					return 8;
				}
				return 1;
			},
			result: { player: 1 },
		},
	},
	huamao_zhujiu: {
		onremove: true,
		onChooseToUse(event) {
			if (!game.online && !event.huamao_zhujiu) {
				event.set("huamao_zhujiu", event.player.getHistory("useCard", evt => get.name(evt.card) == "jiu").length + 1);
			}
		},
		enable: "chooseToUse",
		viewAs: {
			name: "jiu",
		},
		position: "hes",
		filter(event, player) {
			const num = event.huamao_zhujiu;
			return typeof num == "number" && player.countCards("hes") >= num;
		},
		filterCard: true,
		selectCard() {
			const num = get.event().huamao_zhujiu;
			return [num, Infinity];
		},
		log: false,
		allowChooseAll: true,
		async precontent(event, trigger, player) {
			player.logSkill("huamao_zhujiu");
			if (event.result.cards?.some(i => get.suit(i) !== get.info("wxdl_huamao").getSuit(player, "huamao_zhujiu"))) {
				player.tempBanSkill("huamao_zhujiu");
			}
		},
		check(card) {
			const player = get.player();
			if (game.hasPlayer(current => current.hasSkill("spoljinglei") && !current.storage.counttrigger?.spoljinglei && get.attitude(current, player) > 0 && current.getHp() > 1)) {
				if (get.position(card) !== "h") {
					return -get.value(card);
				}
				return 10 - ui.selected.cards.length - get.value(card);
			}
			const num = get.event().huamao_zhujiu;
			if (typeof num == "number" && ui.selected.cards.length >= num) {
				return 0;
			}
			return 6 - get.value(card);
		},
		ai: {
			save: true,
			order(item, player) {
				if (get.event().dying) {
					return 9;
				}
				if (game.hasPlayer(current => current.hasSkill("spoljinglei") && !current.storage.counttrigger?.spoljinglei && get.attitude(current, player) > 0 && current.getHp() > 1)) {
					return get.order({ name: "sha" }) + 0.2;
				}
				return get.order({ name: "jiu" }) + 0.1;
			},
			nokeep: true,
			skillTagFilter(player, tag, arg) {
				if (tag === "nokeep") {
					return (!arg || (arg?.card && get.name(arg.card) === "tao")) && get.event()?.type === "phase" && game.hasPlayer(current => current.hasSkill("spoljinglei") && !current.storage.counttrigger?.spoljinglei && get.attitude(current, player) > 0 && current.getHp() > 1) && player.hasCard(card => get.name(card) !== "tao", "h");
				}
			},
		},
	},
	huamao_ninghan: {
		onremove: true,
		trigger: { global: "damageEnd" },
		filter(event, player) {
			return event.hasNature("ice") && event.cards?.someInD();
		},
		forced: true,
		async content(event, trigger, player) {
			const cards = trigger.cards.filterInD();
			const next = player.addToExpansion(cards, "gain2");
			next.gaintag.add("jsrgshacheng");
			await next;
		},
		global: "huamao_ninghan_frozen",
		subSkill: {
			frozen: {
				mod: {
					cardnature(card, player) {
						const sources = game.filterPlayer(current => current.hasSkill("huamao_ninghan"));
						if (!sources.length) {
							return;
						}
						sources.sortBySeat().reverse();
						if (card.name === "sha" && get.suit(card) === get.info("wxdl_huamao").getSuit(sources[0], "huamao_ninghan")) {
							return "ice";
						}
					},
					aiOrder(player, card, num) {
						if (!game.hasPlayer(current => current.hasSkill("huamao_ninghan"))) {
							return;
						}
						if (num && card.name === "sha" && game.hasNature(card, "ice")) {
							return (
								num +
								0.15 *
									Math.sign(
										game.countPlayer(current => {
											if (!current.hasSkill("huamao_ninghan")) {
												return 0;
											}
											return Math.sign(get.attitude(player, current));
										})
									)
							);
						}
					},
				},
			},
		},
		ai: {
			combo: "jsrgshacheng",
		},
	},
	//文心雕龙
	wxdl_kejie: {
		audio: 2,
		trigger: {
			player: "phaseDrawEnd",
		},
		filter(event, player) {
			if (player.countCards("h") >= 5) {
				return false;
			}
			return game.hasPlayer(current => current.isDamaged()); //current != player &&
		},
		async cost(event, trigger, player) {
			const targets = game.filterPlayer(current => current.isDamaged()); //current != player &&
			let answer_ok = undefined;
			let humans = targets.filter(current => current === game.me || current.isOnline());
			let locals = targets.slice(0).randomSort();
			locals.removeArray(humans);
			const eventId = get.id();
			const send = (current, player, eventId) => {
				lib.skill.wxdl_kejie.chooseBool(current, player, eventId);
				game.resume();
			};
			event._global_waiting = true;
			let time = 10000;
			if (lib.configOL && lib.configOL.choose_timeout) {
				time = parseInt(lib.configOL.choose_timeout) * 1000;
			}
			targets.forEach(current => current.showTimer(time));
			if (humans.length > 0) {
				const solve = function (resolve, reject) {
					return function (result, player) {
						if (result?.bool && !answer_ok) {
							answer_ok = player;
							resolve();
						} else {
							reject();
						}
					};
				};
				await Promise.any(
					humans.map(current => {
						return new Promise((resolve, reject) => {
							if (current.isOnline()) {
								current.send(send, current, player, eventId);
								current.wait(solve(resolve, reject));
							} else {
								const next = lib.skill.wxdl_kejie.chooseBool(current, player, eventId);
								const solver = solve(resolve, reject);
								if (_status.connectMode) {
									game.me.wait(solver);
								}
								return next.forResult().then(result => {
									if (_status.connectMode && !answer_ok) {
										game.me.unwait(result, current);
									} else {
										solver(result, current);
									}
								});
							}
						});
					})
				).catch(() => {});
				game.broadcastAll("cancel", eventId);
			}
			if (!answer_ok && locals.length > 0) {
				for (const current of locals) {
					const result = await lib.skill.wxdl_kejie.chooseBool(current, player).forResult();
					if (result?.bool) {
						answer_ok = current;
						break;
					}
				}
			}
			delete event._global_waiting;
			for (const i of targets) {
				i.hideTimer();
			}
			if (answer_ok && get.itemtype(answer_ok) == "player") {
				event.result = {
					bool: true,
					targets: [answer_ok],
				};
			}
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			const result = {
				skill: "xiantu",
				targets: [player],
			};
			await target.useResult(result, event);
			const result2 = await player
				.chooseCard(
					"克捷：是否重铸任意张【闪】？",
					[1, Infinity],
					function (card) {
						if (get.name(card) != "shan") {
							return false;
						}
						return lib.filter.cardRecastable.apply(this, arguments);
					},
					"he",
					"allowChooseAll"
				)
				.set("ai", card => {
					return 6 - get.value(card);
				})
				.forResult();
			if (result2?.bool) {
				await player.recast(result2.cards);
				player.addTempSkill("wxdl_kejie_sha");
				player.addMark("wxdl_kejie_sha", result2.cards.length, false);
			}
		},
		chooseBool(player, source, eventId) {
			const next = player.chooseBool(`###克捷###<div class="text center">是否对${get.translation(source)}发动${get.poptip("xiantu")}？</div>`);
			next.set("id", eventId);
			next.set("_global_waiting", true);
			next.set("choice", get.attitude(player, source) > 0);
			return next;
		},
		subSkill: {
			sha: {
				charlotte: true,
				onremove: true,
				intro: {
					content: "出杀次数+#",
				},
				mod: {
					cardUsable(card, player, num) {
						if (card?.name == "sha") {
							return num + player.countMark("wxdl_kejie_sha");
						}
					},
				},
			},
		},
		derivation: "xiantu",
	},
	wxdl_hongqi: {
		audio: 2,
		trigger: {
			player: "phaseZhunbeiBegin",
		},
		limited: true,
		zhuSkill: true,
		skillAnimation: true,
		animationColor: "water",
		filter(event, player) {
			const card = new lib.element.VCard({ name: "wanjian", isCard: true });
			return player.hasUseTarget(card);
		},
		async content(event, trigger, player) {
			player.awakenSkill(event.name);
			const card = new lib.element.VCard({ name: "wanjian", isCard: true });
			await player.chooseUseTarget(card, true);
			const func = async target => {
				if (!target?.isIn() || target.group !== "wei" || target == player) {
					return;
				}
				await target.chooseToUse(function (card, player, event) {
					if (get.name(card) != "sha") {
						return false;
					}
					return lib.filter.filterCard.apply(this, arguments);
				}, "洪起：是否使用一张杀？");
			};
			await game.doAsyncInOrder(
				game.filterPlayer(() => true),
				func
			);
		},
	},
};

export default skills;
