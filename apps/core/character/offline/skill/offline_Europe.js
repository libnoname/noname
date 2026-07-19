import { lib, game, ui, get, ai, _status } from "noname";
import html from "dedent";

/** @type { importCharacterConfig["skill"] } */
const skills = {
	//欧陆风云
	//于禁张辽乐进
	eu_jieyue: {
		audio: "rejieyue",
		trigger: {
			player: "phaseJieshuBegin",
		},
		filter(event, player) {
			return player.getStorage("eu_jieyue_used").length < 2;
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt2(event.skill))
				.set("ai", target => {
					const player = get.player(),
						used = player.getStorage("eu_jieyue_used"),
						att = get.attitude(player, target);
					if (used.includes("draw")) {
						return 10 - att;
					}
					if (target.hp == 1 && get.effect(target, { name: "losehp" }, player, player) <= 0) {
						return att;
					}
					return 10 + att;
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const {
					targets: [target],
				} = event,
				used = player.getStorage("eu_jieyue_used");
			await target.draw();
			const result = used.length
				? {
						bool: true,
						links: ["draw", "phase"].removeArray(used),
					}
				: await target
						.chooseButton([
							"节钺：选择一项",
							[
								[
									["draw", `令${get.translation(player)}摸三张牌`],
									["phase", `失去1点体力，令${get.translation(player)}执行一个额外回合`],
								],
								"textbutton",
							],
						])
						.set("ai", button => {
							const bool1 = button.link == "draw",
								bool2 = get.event().eff,
								player = get.player();
							if (bool2 && player.hp > 1) {
								return bool1 ? 1 : 2;
							}
							return bool1 ? 2 : 1;
						})
						.set("eff", get.attitude(target, player) > 0)
						.forResult();
			if (result.bool) {
				const link = result.links[0];
				player.addTempSkill("eu_jieyue_used", "roundStart");
				player.markAuto("eu_jieyue_used", link);
				if (link == "draw") {
					await player.draw(3);
				} else {
					await target.loseHp();
					player.insertPhase(event.name);
				}
			}
		},
		subSkill: {
			used: {
				charlotte: true,
				onremove: true,
			},
		},
	},
	eu_tuxi: {
		audio: ["dcyuxi", "dcporong"],
		trigger: {
			source: "damageSource",
		},
		frequent: true,
		async content(event, trigger, player) {
			await player.draw();
			for (const current of [trigger.player, trigger.player?.getPrevious(), trigger.player?.getNext()]) {
				const pos = current == player ? "e" : "he";
				if (current?.isIn() && current.countGainableCards(player, pos)) {
					player.line(current);
					await player.gainPlayerCard(current, pos, true);
				}
			}
		},
	},
	eu_xiaoguo: {
		audio: "xiaoguo",
		enable: "phaseUse",
		filterCard(card) {
			return get.type(card) == "basic";
		},
		filterTarget: lib.filter.notMe,
		async content(event, trigger, player) {
			const damage = event.target.damage("nocard");
			await damage;
			if (game.hasGlobalHistory("everything", evt => evt.name == "dying" && evt.reason == damage)) {
				player.tempBanSkill(event.name);
			}
		},
		check(card) {
			return 6 - get.value(card);
		},
		ai: {
			order: 7,
			result: {
				target(player, target) {
					let eff = get.damageEffect(target, player, target);
					if (target.hp == 1 && player.countCards("h", card => get.type(card) == "basic") > 1) {
						eff /= 4;
					}
					return eff;
				},
				player: -1,
			},
		},
	},
	//马抗
	eu_xiru: {
		trigger: {
			player: "phaseDrawBegin2",
		},
		filter(event, player) {
			if (event.numFixed) {
				return false;
			}
			return game.hasPlayer(current => {
				return current.getEquips("equip3_4")?.length > 0;
			});
		},
		forced: true,
		async content(event, trigger, player) {
			const cards = game.filterPlayer().reduce((cards, current) => {
				const equips = current.getEquips("equip3_4");
				if (equips?.length) {
					return [...cards, ...equips];
				}
				return cards;
			}, []);
			trigger.num += Math.ceil(cards.length / 2);
		},
	},
	eu_zongma: {
		trigger: {
			player: "phaseUseBegin",
		},
		filter(event, player) {
			return player.countCards("he", card => {
				if (card.viewAs) {
					return false;
				}
				return ["zongma_attack", "zongma_defend"].some(name => {
					const equip = get.autoViewAs({ name }, [card]);
					return game.hasPlayer(current => current.canEquip(equip));
				});
			});
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseCardTarget({
					prompt: get.prompt2(event.skill),
					filterCard(card) {
						return !card.viewAs;
					},
					position: "he",
					filterTarget(card, player, target) {
						const cards = ui.selected.cards;
						return (
							cards?.length &&
							["zongma_attack", "zongma_defend"].some(name => {
								const equip = get.autoViewAs({ name }, cards);
								return target.canEquip(equip);
							})
						);
					},
					ai1(card) {
						return 7 - get.value(card);
					},
					ai2(target) {
						const cards = ui.selected.cards,
							player = get.player(),
							attack = get.autoViewAs({ name: "zongma_attack" }, cards),
							defend = get.autoViewAs({ name: "zongma_defend" }, cards);
						if (target.canEquip(attack) && get.attitude(player, target) > 0) {
							return 2 + Math.random();
						}
						if (target.canEquip(defend) && get.attitude(player, target) < 0) {
							return 1 + Math.random();
						}
						return 0;
					},
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const {
					cards,
					targets: [target],
				} = event,
				list = ["zongma_attack", "zongma_defend"].filter(name => {
					const equip = get.autoViewAs({ name }, cards);
					return target.canEquip(equip);
				});
			if (!list?.length) {
				return;
			}
			const result =
				list.length > 1
					? await player
							.chooseButton(["选择要置入的装备栏", [list.map(i => ["", "", i]), "vcard"]], true)
							.set("ai", button => {
								const bool1 = button.link[2] == "zongma_attack",
									bool2 = get.event().att;
								return bool1 == bool2 ? 2 : 1;
							})
							.set("att", get.attitude(player, target) > 0)
							.forResult()
					: {
							bool: true,
							links: list.map(i => ["", "", i]),
						};
			if (result.bool) {
				const card = get.autoViewAs({ name: result.links[0][2] }, cards);
				player.$give(cards, target, false);
				await target.equip(card);
			}
		},
		subSkill: {
			attack: {
				charlotte: true,
				forced: true,
				locked: false,
				trigger: {
					source: "damageBegin1",
				},
				getIndex(event, player) {
					return player.getVEquips("zongma_attack");
				},
				filter(event, player, name, card) {
					return get.position(card) == "e";
				},
				async content(event, trigger, player) {
					const card = event.indexedData;
					const cards = player.getCards("e", cardx => cardx[cardx.cardSymbol] == card);
					await player.loseToDiscardpile(cards);
					trigger.num++;
				},
			},
			defend: {
				charlotte: true,
				forced: true,
				locked: false,
				trigger: {
					player: "damageBegin3",
				},
				getIndex(event, player) {
					return player.getVEquips("zongma_defend");
				},
				filter(event, player, name, card) {
					return get.position(card) == "e";
				},
				async content(event, trigger, player) {
					const card = event.indexedData;
					const cards = player.getCards("e", cardx => cardx[cardx.cardSymbol] == card);
					await player.loseToDiscardpile(cards);
					trigger.num++;
				},
			},
		},
	},
	//阿尔达希尔
	eu_wanwang: {
		trigger: {
			global: "phaseUseBegin",
		},
		logTarget: "player",
		round: 1,
		filter(event, player) {
			return event.player != player && event.player.group == "western";
		},
		async content(event, trigger, player) {
			trigger.player = player;
		},
	},
	eu_sashan: {
		trigger: {
			global: "phaseBefore",
			player: "enterGame",
		},
		forced: true,
		filter(event, player) {
			return event.name != "phase" || game.phaseNumber == 0;
		},
		logTarget: () => game.players,
		async content(event, trigger, player) {
			for (const target of event.targets) {
				if (target.group != "western") {
					await target.changeGroup("western");
				}
			}
		},
	},
	eu_nagong: {
		global: "eu_nagong_global",
		subSkill: {
			global: {
				trigger: {
					player: "phaseZhunbeiBegin",
				},
				filter(event, player) {
					if (player.group == "qun" || !player.countCards("he")) {
						return false;
					}
					return game.hasPlayer(current => {
						return current.hasSkill("eu_nagong") && current != player;
					});
				},
				async cost(event, trigger, player) {
					const targets = game.filterPlayer(current => current.hasSkill("eu_nagong") && current != player);
					if (targets.length > 1) {
						event.result = await player
							.chooseCardTarget({
								prompt: get.prompt(event.skill),
								prompt2: "上贡一名角色并将势力变更为群直到你的下回合开始",
								filterCard: true,
								position: "he",
								filterTarget(card, player, target) {
									return player != target && target.hasSkill("eu_nagong");
								},
								ai1(card) {
									return 6 - get.value(card);
								},
								ai2(target) {
									const player = get.player();
									if (get.attitude(player, target) > 0) {
										return 5;
									}
									if (!target.hasSkill("eu_wanwang") || target.storage.eu_wanwang_roundcount) {
										return 0;
									}
									if (player.needsToDiscard(2)) {
										return 3;
									}
									return 0;
								},
							})
							.forResult();
					} else {
						event.result = await player
							.chooseCard("he", get.prompt(event.skill, targets))
							.set("prompt2", "上贡其一张牌，然后你将势力变更为群直到你的下回合开始")
							.set("ai", card => {
								const { player, targetx: target } = get.event();
								if (get.attitude(player, target) > 0) {
									return 6 - get.value(card);
								}
								if (!target.hasSkill("eu_wanwang") || target.storage.eu_wanwang_roundcount) {
									return 0;
								}
								if (player.needsToDiscard(2)) {
									return 6 - get.value(card);
								}
								return 0;
							})
							.set("targetx", targets[0])
							.forResult();
						event.result.targets = targets;
					}
					event.result.skill_popup = false;
				},
				async content(event, trigger, player) {
					const {
						cards,
						targets: [target],
					} = event;
					target.logSkill("eu_nagong", [player]);
					await player.give(cards, target);
					const group = player.group;
					player.changeGroup("qun");
					player
						.when({
							player: "phaseBegin",
						})
						.step(async (event, trigger, player) => {
							if (player.group == group) {
								return;
							}
							await player.changeGroup(group);
						});
				},
			},
		},
	},
	//马克里努斯
	eu_dengtian: {
		init(player, skill) {
			player.setStorage(skill, [0, 0, 0]);
			player.addTip(skill, `登天 ${player.getStorage(skill).join(" ")}`);
		},
		onremove(player, skill) {
			player.removeTip(skill);
			player.setStorage(skill, null);
		},
		trigger: {
			global: "roundStart",
		},
		forced: true,
		async content(event, trigger, player) {
			const list = player.getStorage(event.name, [0, 0, 0]),
				choiceList = [`摸牌阶段摸牌数（当前+${list[0]}）`, `手牌上限（当前+${list[1]}）`, `每回合首次造成伤害值（当前+${list[2]}）`];
			const { index } = await player
				.chooseControl()
				.set("prompt", "登天：令一项数值+1")
				.set("choiceList", choiceList)
				.set(
					"resultx",
					(() => {
						let val = index => {
							let num = 3 - index;
							if (player.hasSkill("eu_mingshu") && list[index] == 2) {
								if (player.countCards("hs", card => ["tao", "jiu"].includes(card.name))) {
									num /= player.hp + 1;
								} else {
									num /= 114514;
								}
							}
							let rate = list[index] + 1;
							if (index == 1) {
								rate = player.getHandcardLimit() / 3 + 1;
							}
							return num / rate;
						};
						return [0, 1, 2].maxBy(val);
					})()
				)
				.set("ai", () => get.event().resultx)
				.forResult();
			list[index]++;
			const str = choiceList[index].slice(0, choiceList[index].indexOf("（"));
			game.log(player, "令", `#g${str}`, "+1");
			player.setStorage(event.name, list);
			player.addTip(event.name, `登天 ${player.getStorage(event.name).join(" ")}`);
			event.list = list;
			event.index = index;
		},
		mod: {
			maxHandcard(player, num) {
				const list = player.getStorage("eu_dengtian", [0, 0, 0]);
				return num + list[1];
			},
		},
		group: "eu_dengtian_effect",
		subSkill: {
			effect: {
				trigger: {
					source: "damageBegin1",
					player: "phaseDrawBegin2",
				},
				filter(event, player) {
					const list = player.getStorage("eu_dengtian", [0, 0, 0]);
					if (event.name == "damage") {
						const historys = game.getGlobalHistory("everything", evt => evt.name == "damage" && evt.source == player);
						return list[2] > 0 && historys.indexOf(event) == 0;
					}
					return list[0] > 0 && !event.numFixed;
				},
				forced: true,
				async content(event, trigger, player) {
					const list = player.getStorage("eu_dengtian", [0, 0, 0]);
					if (trigger.name == "damage") {
						trigger.num += list[2];
					} else {
						trigger.num += list[0];
					}
				},
			},
		},
	},
	eu_mingshu: {
		trigger: {
			player: "eu_dengtianAfter",
		},
		filter(event, player) {
			const { list, index } = event;
			return list[index] == 3 && player.getHp() > 0;
		},
		forced: true,
		async content(event, trigger, player) {
			await player.loseHp(player.getHp());
		},
		ai: {
			combo: "eu_dengtian",
			neg: true,
		},
	},
	eu_juedou: {
		trigger: {
			global: "useCardAfter",
		},
		filter(event, player) {
			if (event.player == player || event.card?.name != "sha" || !event.player?.isIn()) {
				return false;
			}
			if (!event.targets?.includes(player) || player.hasHistory("damage", evt => evt.card == event.card)) {
				return false;
			}
			const card = new lib.element.VCard({ name: "sha", isCard: true });
			return player.canUse(card, event.player, false);
		},
		logTarget: "player",
		check(event, player) {
			const card = new lib.element.VCard({ name: "sha", isCard: true });
			return get.effect(event.player, card, player, player) > 0;
		},
		async content(event, trigger, player) {
			const card = new lib.element.VCard({ name: "sha", isCard: true });
			await player.useCard(card, event.targets);
		},
	},
	//欧陆凯撒
	eu_ducai: {
		init(player, skill) {
			if (_status?.currentPhase !== player) {
				return;
			}
			const targets = game.filterPlayer(current => current !== player);
			for (const target of targets) {
				target.addTempSkill(skill + "_block");
			}
		},
		onremove(player, skill) {
			if (_status?.currentPhase !== player) {
				return;
			}
			const targets = game.filterPlayer(current => current !== player);
			for (const target of targets) {
				target.removeSkill(skill + "_block");
			}
		},
		trigger: {
			player: "phaseBeginStart",
		},
		persevereSkill: true,
		forced: true,
		firstDo: true,
		priority: Infinity,
		async content(event, trigger, player) {
			get.info(event.name).init(player, event.name);
		},
		mod: {
			targetInRange(card, player) {
				if (player == _status.currentPhase) {
					return true;
				}
			},
			cardUsable(card, player) {
				if (player == _status.currentPhase) {
					return Infinity;
				}
			},
		},
		subSkill: {
			block: {
				inherit: "baiban",
				intro: {
					content(storage, player, skill) {
						let str = "<li>不能使用牌";
						const list = player.getSkills(null, false, false).filter(function (i) {
							return lib.skill.baiban.skillBlocker(i, player);
						});
						if (list.length) {
							str += "<br><li>" + get.translation(list) + "失效";
						}
						return str;
					},
				},
				mod: {
					cardEnabled(card) {
						return false;
					},
					cardSavable(card) {
						return false;
					},
				},
			},
		},
	},
	eu_zhitong: {
		mark: true,
		zhuanhuanji: true,
		marktext: "☯",
		intro: {
			content(storage, player, skill) {
				if (storage) {
					return "转换技，当你使用牌时，若目标包含其他角色，你依次获得这些角色装备区的所有牌并对其造成1点伤害。";
				}
				return "转换技，当你使用牌时，若目标包含自己，摸两张牌且回复1点体力。";
			},
		},
		trigger: {
			player: "useCard",
		},
		filter(event, player) {
			if (!event?.targets?.length) {
				return false;
			}
			const bool = player.storage?.eu_zhitong;
			return (bool && event.targets.some(current => current !== player)) || (!bool && event.targets.includes(player));
		},
		check(event, player) {
			if (!player.storage?.eu_zhitong) {
				return true;
			}
			return event.targets.filter(target => target != player).reduce((eff, target) => eff + get.damageEffect(target, player, player), 0) > 0;
		},
		async content(event, trigger, player) {
			player.changeZhuanhuanji(event.name);
			if (player.storage?.eu_zhitong) {
				await player.draw(2);
				await player.recover();
			} else {
				const targets = trigger.targets.filter(current => current !== player).sortBySeat();
				for (const target of targets) {
					const cards = target.getGainableCards(player, "e");
					if (cards.length) {
						await player.gain(cards, target, "give", "bySelf");
					}
					await target.damage();
				}
			}
		},
	},
	eu_jiquan: {
		trigger: {
			global: "phaseBegin",
		},
		zhuSkill: true,
		forced: true,
		filter(event, player) {
			return event.player?.group === "western" && event.player?.isIn();
		},
		async content(event, trigger, player) {
			await player.recover();
			await player.draw();
		},
	},
};

export default skills;
