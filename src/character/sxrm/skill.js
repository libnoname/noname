import { lib, game, ui, get, ai, _status } from "noname";

/** @type { importCharacterConfig["skill"] } */
const skills = {
	//嗔包
	//魔周瑜
	sxrmjiehuo: {
		audio: 2,
		dutySkill: true,
		trigger: { player: "phaseBegin" },
		check(event, player) {
			return player.hasCards("hs", card => get.is.damageCard(card) && player.getUseValue(card) > 0);
		},
		async content(event, trigger, player) {
			player.addTempSkill(`${event.name}_damage`, { player: "dieAfter" });
		},
		group: ["sxrmjiehuo_fail"],
		subSkill: {
			fail: {
				trigger: { player: "sxrmjiehuoFail" },
				forced: true,
				locked: false,
				async content(event, trigger, player) {
					player.awakenSkill("sxrmjiehuo");
					game.log(player, "使命失败");
					await player.loseMaxHp();
				},
			},
			damage: {
				intro: { content: "本局下次伤害改为3点火焰伤害" },
				mark: true,
				charlotte: true,
				trigger: { global: "damageBegin1" },
				forced: true,
				locked: false,
				async content(event, trigger, player) {
					player.removeSkill(event.name);
					game.setNature(trigger, "fire");
					trigger.num = 3;
					if (trigger.source !== player) {
						await event.trigger("sxrmjiehuoFail");
					}
				},
			},
		},
	},
	sxrmxianger: {
		audio: 2,
		dutySkill: true,
		enable: "phaseUse",
		usable: 1,
		filterTarget: true,
		async content(event, trigger, player) {
			const target = event.target;
			target.addTempSkill("sxrmxianger_limit", { player: "dieAfter" });
			target.addMark("sxrmxianger_limit", 2, false);
			const skill = event.name + "_mark";
			player.addSkill(skill);
			const map = player.getStorage(skill, new Map());
			if (map.has(target)) {
				map.set(target, map.get(target) + 1);
			} else {
				map.set(target, 0);
			}
			player.setStorage(skill, map, true);
		},
		group: ["sxrmxianger_fail"],
		subSkill: {
			fail: {
				trigger: { global: "sxrmxiangerFail" },
				filter(event, player) {
					const num = (event.sxrmxiangerMap ?? new Map()).get(player);
					return typeof num == "number" && num < 2;
				},
				forced: true,
				locked: false,
				async content(event, trigger, player) {
					player.awakenSkill("sxrmxianger");
					game.log(player, "使命失败");
					await player.loseMaxHp();
				},
			},
			mark: {
				intro: {
					content(storage = new Map(), player) {
						if (!storage?.size) {
							return "目前没有【香饵】目标";
						} else {
							let str = "【香饵】目标受伤情况：<br>";
							for (const [target, num] of storage) {
								str += `<li>${get.translation(target)}：${num}`;
							}
							return str;
						}
					},
				},
				charlotte: true,
				onremove: true,
			},
			limit: {
				charlotte: true,
				onremove(player, skill) {
					delete player.storage[skill];
					const targets = game.filterPlayer(target => target.getStorage("sxrmxianger_mark", new Map()).has(player));
					for (const target of targets) {
						const map = target.getStorage("sxrmxianger_mark", new Map());
						map.delete(player);
						target.setStorage("sxrmxianger_mark", map, true);
						if (!map.size) {
							target.removeSkill("sxrmxianger_mark");
						}
					}
				},
				intro: { content: "<li>不能使用点数大于6的牌<br><li>下个结束阶段回复#点体力" },
				mod: {
					cardEnabled(card, player) {
						const num = get.number(card);
						if (typeof num === "number" && num > 6) {
							return false;
						}
					},
					cardSavable(card, player) {
						const num = get.number(card);
						if (typeof num === "number" && num > 6) {
							return false;
						}
					},
				},
				trigger: { player: ["phaseJieshuBegin", "damageEnd"] },
				filter(event, player) {
					if (event.name === "damage") {
						return game.hasPlayer(target => target.getStorage("sxrmxianger_mark", new Map()).has(player));
					}
					return true;
				},
				forced: true,
				popup: false,
				async content(event, trigger, player) {
					if (trigger.name === "damage") {
						for (const target of game.filterPlayer(target => target.getStorage("sxrmxianger_mark", new Map()).has(player))) {
							const map = target.getStorage("sxrmxianger_mark", new Map());
							if (map.has(player)) {
								map.set(player, map.get(player) + trigger.num);
							} else {
								map.set(player, 0);
							}
							target.setStorage("sxrmxianger_mark", map, true);
						}
					} else {
						const num = player.countMark(event.name);
						const sxrmxiangerMap = new Map();
						for (const target of game.filterPlayer(target => target.getStorage("sxrmxianger_mark", new Map()).has(player)).sortBySeat()) {
							const num = target.getStorage("sxrmxianger_mark", new Map()).get(player) || 0;
							sxrmxiangerMap.set(target, num);
						}
						event.sxrmxiangerMap = sxrmxiangerMap;
						player.removeSkill(event.name);
						await player.recover({ num });
						await event.trigger("sxrmxiangerFail");
					}
				},
			},
		},
		ai: {
			effect: {
				target(card, player, target) {
					if (get.tag(card, "damage")) {
						const targets = game.filterPlayer(current => current.getStorage("sxrmxianger_mark", new Map()).has(target));
						if (targets.some(current => get.attitude(player, current) > 0)) {
							return [1, -2];
						}
					}
				},
			},
		},
	},
	sxrmmieguo: {
		audio: 2,
		dutySkill: true,
		trigger: { player: "phaseEnd" },
		filter(event, player) {
			return !event.skill && game.hasPlayer(current => current != player && current.hasCards("he"));
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget({
					prompt: get.prompt2(event.skill),
					filterTarget(card, player, target) {
						return target !== player && target.hasCards("he");
					},
					ai(target) {
						const player = get.player();
						if (get.attitude(player, target) > 0 && target.countCards("he") >= 4) {
							return 10;
						}
						if (get.attitude(player, target) < 0) {
							return 5;
						}
						return -1;
					},
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			let result = await player
				.gainPlayerCard({
					target,
					prompt: `灭虢：请选择获得${get.translation(target)}至多三张牌`,
					selectButton: [1, 3],
					position: "he",
					forced: true,
					allowChooseAll: true,
					ai(button) {
						const { player, target } = get.event();
						if (ui.selected.buttons?.length) {
							return -1;
						}
						if (get.attitude(player, target) > 0) {
							if (get.position(button.link) === "h") {
								return 5;
							}
							return 1;
						} else {
							return 1;
						}
					},
				})
				.forResult();
			if (!result?.cards?.length) {
				return;
			}
			const num = result.cards.length;
			result =
				game.countPlayer() <= num
					? { bool: true, targets: game.filterPlayer() }
					: await target
							.chooseTarget({
								prompt: `${get.translation(player)}对你发动了【灭虢】`,
								prompt2: `请选择${get.cnNumber(num)}名角色，${get.translation(player)}的额外回合内无法对这些角色使用牌`,
								selectTarget: num,
								forced: true,
								ai(target) {
									if (target === get.player()) {
										return 5;
									}
									return 1;
								},
							})
							.forResult();
			if (!result?.targets?.length) {
				return;
			}
			target.line(result.targets);
			player.addSkill("sxrmmieguo_ban");
			player.markAuto("sxrmmieguo_ban", result.targets);
			player.insertPhase();
		},
		subSkill: {
			ban: {
				charlotte: true,
				onremove: true,
				intro: { content: "“灭虢”回合内不能对$使用牌" },
				mod: {
					playerEnabled(card, player, target) {
						if (player.getStorage("sxrmmieguo_ban").includes(target)) {
							return false;
						}
					},
				},
				trigger: { player: "phaseEnd" },
				filter(event, player) {
					return event.skill === "sxrmmieguo";
				},
				forced: true,
				popup: false,
				async content(event, trigger, player) {
					player.removeSkill(event.name);
					if (!player.hasHistory("useCard")) {
						game.log(player, "使命失败");
						player.awakenSkill("sxrmmieguo");
						await player.loseMaxHp();
					}
				},
			},
		},
	},
	//嗔孙尚香
	sxrmjiaozong: {
		audio: 2,
		trigger: {
			player: "phaseZhunbeiBegin",
			target: "useCardToTargeted",
		},
		filter(event, player) {
			if (event.name !== "phaseZhunbei" && event.card.name !== "sha") {
				return false;
			}
			return player.canMoveCard(null, true);
		},
		direct: true,
		async content(event, trigger, player) {
			let result = await player.moveCard(get.prompt2(event.name)).set("nojudge", true).set("logSkill", event.name).forResult();
			if (!result?.bool) {
				return;
			}
			const targets = result.targets;
			const color = get.color(result.card);
			targets[1].addTempSkill(event.name + "_ban");
			targets[1].markAuto(event.name + "_ban", color);
		},
		subSkill: {
			ban: {
				charlotte: true,
				onremove: true,
				intro: {
					content(storage, player) {
						let str = "";
						if (storage?.length) {
							str = "本回合不能使用" + storage.map(i => get.translation(i)).join("、") + "牌且";
						}
						str += "受到的伤害+1";
						return str;
					},
				},
				mod: {
					cardEnabled(card, player) {
						if (player.getStorage("sxrmjiaozong_ban").includes(get.color(card))) {
							return false;
						}
					},
					cardSavable(card, player) {
						if (player.getStorage("sxrmjiaozong_ban").includes(get.color(card))) {
							return false;
						}
					},
				},
				trigger: { player: "damageBegin3" },
				forced: true,
				popup: false,
				async content(event, trigger, player) {
					trigger.num++;
				},
			},
		},
	},
	sxrmfusui: {
		audio: 2,
		enable: "phaseUse",
		filter(event, player) {
			return game.hasPlayer(current => get.info("sxrmfusui").filterTarget(null, player, current));
		},
		filterTarget(card, player, target) {
			const skills = target.getSkills(null, false, false).filter(skill => {
				const list = get.skillCategoriesOf(skill, target);
				return !list.length;
			});
			return target !== player && target.hasSex("male") && skills.length > 0;
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			player.awakenSkill(event.name);
			const skills = target.getSkills(null, false, false).filter(skill => {
				const list = get.skillCategoriesOf(skill, target);
				return !list.length;
			});
			if (!skills.length) {
				return;
			}
			const result = await player
				.chooseButton({
					createDialog: [`妇随：令${get.translation(target)}失去其中一个技能`, [skills, "skill"]],
					forced: true,
				})
				.forResult();
			if (!result?.links?.length) {
				return;
			}
			const skill = result.links[0];
			await target.removeSkills(skill);
			for (const current of [player, target]) {
				current.setStorage("sxrmbiyi_skill", [skill], true);
				await current.changeSkills(["sxrmbiyi"], []).set("$handle", (player, addSkills, removeSkills) => {
					if (addSkills.length) {
						player.addSkillLog(addSkills);
						// 单独处理因【妇随】失去的技能init，（不失去【比翼】情况再次【妇随】，如【中流】刷新，是不会二次触发init的，详见player.addSkill）
						if (addSkills.includes("sxrmbiyi")) {
							lib.skill.sxrmbiyi.init(player, "sxrmbiyi");
						}
					}
				});
				current.addTempSkill(event.name + "_muteki", "roundStart");
			}
		},
		limited: true,
		derivation: "sxrmbiyi",
		ai: {
			order: 7,
			result: { target: 1 },
		},
		subSkill: {
			muteki: {
				audio: "sxrmfusui",
				charlotte: true,
				mark: true,
				marktext: "随",
				intro: { content: "防止本轮受到的伤害" },
				trigger: { player: "damageBegin4" },
				forced: true,
				async content(event, trigger, player) {
					trigger.cancel();
				},
				ai: {
					nofire: true,
					nothunder: true,
					nodamage: true,
					effect: {
						target(card, player, target, current) {
							if (get.tag(card, "damage")) {
								return [0, 0];
							}
						},
					},
				},
			},
		},
	},
	sxrmbiyi: {
		audio: 2,
		mark: true,
		marktext: "☯",
		init(player, skill) {
			player.removeAdditionalSkill(skill);
			const skills = !player.storage[skill] ? player.getStorage("sxrmbiyi_skill") : ["xiaoji"];
			if (skills.length) {
				player.addAdditionalSkill(skill, skills);
			}
		},
		onremove(player, skill) {
			player.removeAdditionalSkill(skill);
			delete player.storage.sxrmbiyi_skill;
		},
		// 由于转换有特殊效果，需要像新杀大谋武将一样采用函数形式
		zhuanhuanji(player, skill) {
			player.storage[skill] = !player.storage[skill];
			player.removeAdditionalSkill(skill);
			const skills = !player.storage[skill] ? player.getStorage("sxrmbiyi_skill") : ["xiaoji"];
			if (skills.length) {
				player.addAdditionalSkill(skill, skills);
			}
		},
		intro: {
			content(storage, player) {
				if (!storage) {
					const skills = player.getStorage("sxrmbiyi_skill");
					if (skills.length) {
						return `当前状态：阳（${skills.map(skill => get.poptip(skill)).join("、")}）`;
					}
					return `当前状态：阳（${skills.length ? `${skills.map(skill => get.poptip(skill)).join("、")}` : "无技能"}）`;
				} else {
					return `当前状态：阴（${get.poptip("xiaoji")}）`;
				}
			},
		},
		trigger: { player: ["useSkill", "logSkillBegin"] },
		filter(event, player) {
			const skill = get.sourceSkillFor(event);
			if (!skill) {
				return false;
			}
			const info = get.info(skill);
			if (info?.charlotte) {
				return false;
			}
			const skills = !player.storage.sxrmbiyi ? player.getStorage("sxrmbiyi_skill") : ["xiaoji"];
			return skills.includes(skill);
		},
		forced: true,
		locked: false,
		async content(event, trigger, player) {
			player.changeZhuanhuanji(event.name);
		},
		derivation: "xiaoji",
		ai: { combo: "sxrmfusui" },
	},
	//嗔张昭
	sxrmxiezhong: {
		audio: 2,
		trigger: { player: "phaseZhunbeiBegin" },
		async cost(event, trigger, player) {
			const num = Math.ceil(game.countPlayer() / 2);
			event.result = await player
				.chooseTarget({
					prompt: get.prompt2(event.skill),
					selectTarget: num,
					ai(target) {
						const player = get.player();
						let val;
						if (get.attitude(player, target) > 0) {
							val = 3;
							if (target.countCards("h") <= 3 && target.hp <= 3) {
								val = -1;
							} else if (target.hp >= 5) {
								val = 5;
							}
						} else {
							val = 2;
							if (target.countCards("h") <= 3 && target.hp <= 3) {
								val = 4;
							} else if (target.countCards("h") >= 6 || target.hp >= 5) {
								val = -1;
							}
						}
						return val;
					},
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const targets = event.targets.sortBySeat();
			const choiceMap = new Map();
			for (const target of targets) {
				if (!target.isIn()) {
					continue;
				}
				if (!lib.skill.sxrmxiezhong.canUseSha(target)) {
					choiceMap.set(target, 0);
				} else {
					let result = await target
						.chooseControl({
							prompt: "挟众：请选择一项",
							choiceList: ["摸两张牌并失去1点体力", "将两张牌当【杀】使用"],
							ai() {
								const player = get.player();
								if (player.hp <= 2) {
									return 1;
								}
								if (player.countCards("he") <= 3) {
									return 0;
								}
								return player.getUseValue(get.autoViewAs({ name: "sha", isCard: true })) > 1 ? 1 : 0;
							},
						})
						.forResult();
					if (typeof result.index == "number") {
						choiceMap.set(target, result.index);
					}
				}
			}
			if (!choiceMap.size) {
				return;
			}
			const count1 = Array.from(choiceMap.values()).filter(index => index == 0).length;
			const count2 = choiceMap.size - count1;
			for (const [target, index] of choiceMap) {
				if (!target.isIn()) {
					continue;
				}
				target.popup(index === 0 ? "降" : "战");
				if (index == 0) {
					await target.draw(2);
					await target.loseHp();
				} else {
					if (!lib.skill.sxrmxiezhong.canUseSha(target)) {
						continue;
					}
					const next = target.chooseToUse();
					next.set("_backupevent", "sxrmxiezhong_backup");
					next.set("openskilldialog", `###挟众###请将两张牌当作【杀】使用`);
					next.backup("sxrmxiezhong_backup");
					next.set("norestore", true);
					next.set("custom", {
						add: {},
						replace: { window() {} },
					});
					next.set("forced", true);
					next.set("addCount", false);
					await next;
				}
			}
			if (count1 === count2 || !game.hasPlayer(target => !targets.includes(target))) {
				return;
			}
			const num = count1 > count2 ? 0 : 1;
			const result = await player
				.chooseTarget({
					prompt: `挟众：请选择一名角色，令其执行两次“${num == 0 ? "摸两张牌并失去1点体力" : "将两张牌当【杀】使用"}”`,
					filterTarget(card, player, target) {
						const { targets } = get.event();
						return !targets?.includes(target);
					},
					forced: true,
					ai(target) {
						const player = get.player();
						const att = get.attitude(player, target);
						const { num } = get.event();
						let val;
						if (att > 0) {
							val = 1;
							if (target.hp >= 6 && num === 0) {
								val = 3;
							}
							if (target.countCards("he") === 1 && num === 1) {
								val = 6;
							}
						} else {
							val = 2;
							if (target.hp <= 1 && num === 0) {
								val = 5;
							} else if (target.countCards("he") <= 4 && target.countCards("he") > 1 && num === 1) {
								val = 4;
							}
							if (target.countCards("he") === 1 && num === 1) {
								val = 0.5;
							}
						}
						return val;
					},
				})
				.set("num", num)
				.set("targets", targets)
				.forResult();
			if (!result?.targets?.length) {
				return;
			}
			const target = result.targets[0];
			player.line(target);
			for (let i = 0; i < 2; i++) {
				if (num == 0) {
					await target.draw(2);
					await target.loseHp();
				} else {
					if (!lib.skill.sxrmxiezhong.canUseSha(target)) {
						continue;
					}
					const next = target.chooseToUse();
					next.set("_backupevent", "sxrmxiezhong_backup");
					next.set("openskilldialog", `###挟众###请将两张牌当作【杀】使用`);
					next.backup("sxrmxiezhong_backup");
					next.set("norestore", true);
					next.set("custom", {
						add: {},
						replace: { window() {} },
					});
					next.set("forced", true);
					next.set("addCount", false);
					await next;
				}
			}
		},
		canUseSha(player) {
			let cards = player.getCards("hes");
			if (cards.length < 2) {
				return false;
			}
			for (let i = 0; i < cards.length - 1; i++) {
				for (let j = i + 1; j < cards.length; j++) {
					const sha = get.autoViewAs({ name: "sha" }, [cards[i], cards[j]]);
					if (player.hasUseTarget(sha, void 0, false)) {
						return true;
					}
				}
			}
			return false;
		},
		subSkill: {
			backup: {
				filterCard(card) {
					return get.itemtype(card) == "card";
				},
				viewAs: { name: "sha" },
				selectCard: 2,
				position: "hes",
				log: false,
				ai1(card) {
					return 6 - get.value(card);
				},
			},
		},
	},
	sxrmqishi: {
		audio: 2,
		trigger: { player: "phaseJieshuBegin" },
		locked(skill, player) {
			if (!player?.storage?.sxrmqishi) {
				return false;
			}
			return true;
		},
		qidingSkill(skill, player) {
			if (!player?.storage?.sxrmqishi) {
				return true;
			}
			return false;
		},
		getCards(player) {
			let cards = [];
			game.checkGlobalHistory("cardMove", evt => {
				if (evt.name == "lose" && evt.player != player && evt.position === ui.discardPile) {
					cards.addArray(evt.cards);
				} else if (evt.name == "cardsDiscard") {
					for (const current of game.filterPlayer()) {
						if (current != player) {
							cards.addArray(evt.getd(current, "cards2"));
						}
					}
				}
			});
			cards = cards.filterInD("d").flat().unique();
			return cards;
		},
		filter(event, player) {
			return get.info("sxrmqishi").getCards(player).length > 0;
		},
		async cost(event, trigger, player) {
			const forced = Boolean(player.storage[event.skill]);
			const cards = get.info(event.skill).getCards(player);
			const result = await player
				.chooseButton({
					createDialog: [`${!forced ? get.prompt2(event.skill) : "###乞施###<div class='text center'>获得本回合其他角色进入弃牌堆的至多五张牌，然后你跳过下个摸牌阶段</div>"}`, cards],
					selectButton: [1, 5],
					allowChooseAll: true,
					forced,
					ai(button) {
						const { cards } = get.event();
						if (cards.length < 4) {
							return -1;
						}
						return get.value(button.link);
					},
				})
				.set("cards", cards)
				.forResult();
			event.result = {
				bool: result.bool,
				cards: result.links,
			};
		},
		async content(event, trigger, player) {
			player.awakenQidingSkill(event.name);
			const { cards } = event;
			player.gain({
				cards,
				animate: "gain2",
			});
			player.skip("phaseDraw");
			player.addTempSkill(event.name + "_mark", { player: "phaseDrawSkipped" });
		},
		mark: true,
		intro: { content: "qidingSkill" },
		subSkill: {
			mark: {
				charlotte: true,
				mark: true,
				marktext: "饿",
				intro: { content: "跳过下个摸牌阶段" },
			},
		},
	},
	//嗔鲁肃
	sxrmwanli: {
		audio: 2,
		trigger: { global: "roundStart" },
		filter(event, player) {
			return game.roundNumber == 1 && player.hasCards("he") && game.hasPlayer(current => current != player);
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseCardTarget({
					prompt: get.prompt2(event.skill),
					position: "he",
					selectCard: [1, Infinity],
					allowChooseAll: true,
					filterTarget: lib.filter.notMe,
					ai(target) {
						const player = get.player();
						return -get.attitude(player, target);
					},
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const {
				cards,
				targets: [target],
			} = event;
			await player.give(cards, target);
			let skill = event.name + "_effect";
			player.addSkill(skill);
			const map = player.getStorage(skill, new Map());
			if (map.has(target)) {
				map.get(target).giveNum += 3 * cards.length;
			} else {
				map.set(target, {
					giveNum: 3 * cards.length,
					roundNumber: 4,
					huanqian: false,
				});
			}
			player.setStorage(skill, map, true);
		},
		group: "sxrmwanli_draw",
		subSkill: {
			effect: {
				charlotte: true,
				onremove: true,
				intro: {
					content(storage = new Map()) {
						if (!storage?.size) {
							return "账单是空的？！";
						}
						let str = "当前账单：<br>";
						for (const [target, { giveNum, roundNumber, huanqian }] of storage) {
							let str1 = `${get.translation(target)}：第${roundNumber}轮结束时还${get.cnNumber(giveNum)}张牌`;
							let str2 = "";
							if (!target.isAlive()) {
								str2 += "已死亡";
							}
							if (huanqian) {
								if (str2) {
									str2 += "，且已还钱";
								} else {
									str2 += "已还钱";
								}
							}
							if (str2) {
								str1 = `<span style="text-decoration: line-through;">${str1}</span>（${str2}）`;
							}
							str1 = `<li>${str1}`;
							str += str1;
						}
						return str;
					},
				},
				audio: "sxrmwanli",
				trigger: { global: "roundEnd" },
				filter(event, player) {
					return get.info("sxrmwanli_effect").logTarget(event, player).length > 0;
				},
				forced: true,
				logTarget(event, player) {
					return game
						.filterPlayer(current => {
							const storage = player.getStorage("sxrmwanli_effect", new Map());
							return storage.has(current) && !storage.get(current).huanqian && game.roundNumber == storage.get(current).roundNumber;
						})
						.sortBySeat();
				},
				async content(event, trigger, player) {
					const storage = player.getStorage(event.name, new Map());
					for (const target of event.targets) {
						if (!target.isIn() || !storage.has(target)) {
							continue;
						}
						const num = storage.get(target).giveNum;
						const map = player.getStorage(event.name, new Map());
						map.get(target).huanqian = true;
						player.setStorage(event.name, map, true);
						const result = await target.chooseToGive(num, player, true).forResult();
						if (result?.cards?.length < num) {
							target.clearSkills();
						}
					}
				},
			},
			draw: {
				audio: "sxrmwanli",
				trigger: { player: "phaseDrawBegin2" },
				filter(event, player) {
					return (
						!event.numFixed &&
						game.hasPlayer2(current => {
							const storage = player.getStorage("sxrmwanli_effect", new Map());
							if (!storage.has(current)) {
								return false;
							}
							return storage.get(current).huanqian || current.isDead();
						})
					);
				},
				forced: true,
				locked: false,
				async content(event, trigger, player) {
					trigger.num +=
						3 *
						game.countPlayer2(current => {
							const storage = player.getStorage("sxrmwanli_effect", new Map());
							if (!storage.has(current)) {
								return false;
							}
							return storage.get(current).huanqian || current.isDead();
						});
				},
			},
		},
	},
	sxrmlishui: {
		audio: 2,
		trigger: { target: "useCardToTargeted" },
		filter(event, player) {
			return (
				get.color(event.card) == "black" &&
				game.hasPlayer(current => {
					const storage = player.getStorage("sxrmwanli_effect", new Map());
					return storage.has(current) && !storage.get(current).huanqian;
				})
			);
		},
		async content(event, trigger, player) {
			await player.draw();
			const targets = game.filterPlayer(current => {
				const storage = player.getStorage("sxrmwanli_effect", new Map());
				return storage.has(current) && !storage.get(current).huanqian && player.canCompare(current);
			});
			if (!targets.length) {
				return;
			}
			let result =
				targets.length == 1
					? { bool: true, targets }
					: await player
							.chooseTarget({
								prompt: "选择一名“万利”角色拼点",
								filterTarget: (card, player, target) => {
									return get.event().targets?.includes(target);
								},
								forced: true,
								targets,
								ai(target) {
									const player = get.player();
									return -get.attitude(player, target);
								},
							})
							.forResult();
			if (!result?.bool) {
				return;
			}
			const target = result.targets[0];
			result = await player.chooseToCompare(target).forResult();
			if (result?.winner == player) {
				const map = player.getStorage("sxrmwanli_effect", new Map());
				if (!map.size) {
					return;
				}
				player.say("还钱！");
				map.get(target).roundNumber--;
				player.setStorage("sxrmwanli_effect", map, true);
				game.log(target, "的“还钱”时间被提前一轮");
			}
		},
		ai: { combo: "sxrmwanli" },
	},
	//嗔曹操
	sxrmlanjiao: {
		audio: 2,
		enable: "phaseUse",
		filter(event, player) {
			return game.hasPlayer(current => get.info("sxrmlanjiao").filterTarget(null, player, current));
		},
		filterTarget(card, player, target) {
			return target != player && !player.getStorage("sxrmlanjiao_used").includes(target) && target.countCards("h") >= 2;
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			player.addTempSkill(event.name + "_used", { player: "phaseUseEnd" });
			player.markAuto(event.name + "_used", [target]);
			event.showCards ??= [];
			while (true) {
				let result = await player
					.choosePlayerCard({
						prompt: `揽娇：展示并获得${get.translation(target)}两张手牌`,
						forced: true,
						target,
						position: "h",
						selectButton: 2,
					})
					.forResult();
				if (result?.bool) {
					const { cards } = result;
					event.showCards = cards;
					await player.showCards(cards, `${get.translation(player)}发动了【揽娇】`);
					result = await target
						.chooseBool({
							ai() {
								const { player, cards } = get.event();
								return (player.hp > 3 || get.effect(player, { name: "losehp" }, player, player) > 4) && !cards.some(card => get.color(card) == "red");
							},
							cards,
						})
						.set("createDialog", [`###${get.translation(player)}对你发动了【揽娇】###你可以失去1点体力并摸一张牌，令${get.translation(player)}重新选择展示的手牌`, cards])
						.forResult();
					if (!result?.bool) {
						break;
					} else {
						await target.draw();
						await target.loseHp();
					}
				} else {
					break;
				}
			}
			if (get.itemtype(event.showCards) == "cards") {
				await player.gain(event.showCards, target, "giveAuto");
				const suits = event.showCards.map(card => get.suit(card, false)).toUniqued();
				const skill = event.name + "_mark";
				player.addTempSkill(skill);
				player.markAuto(skill, suits);
				player.addTip(
					skill,
					get.translation(skill) +
						player
							.getStorage(skill)
							.sort((a, b) => lib.suit.indexOf(b) - lib.suit.indexOf(a))
							.reduce((str, suit) => str + get.translation(suit), "")
				);
			}
			const suits = game.getGlobalHistory("everything", evt => evt.name == event.name && evt.player == player && get.itemtype(evt.showCards) == "cards").flatMap(evt => evt.showCards.map(card => get.suit(card, false)));
			if (["heart", "diamond"].every(suit => suits.includes(suit))) {
				player.tempBanSkill(event.name);
			}
		},
		ai: {
			order: 8,
			result: { target: -1 },
		},
		subSkill: {
			used: {
				charlotte: true,
				onremove: true,
				intro: { content: "本阶段已将$置于铜雀台" },
			},
			mark: {
				charlotte: true,
				onremove(player, skill) {
					delete player.storage[skill];
					player.removeTip(skill);
				},
				intro: { content: "本回合已因【揽矫】获得花色：$" },
			},
		},
	},
	//嗔诸葛亮
	sxrmbingqu: {
		audio: 2,
		trigger: { player: "phaseZhunbeiBegin" },
		filter(event, player) {
			return game.countPlayer() > 1;
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget({
					prompt: get.prompt2(event.skill),
					filterTarget: lib.filter.notMe,
					ai(target) {
						const player = get.player();
						if (player.countCards("h") > 4) {
							return 0;
						}
						const att = get.attitude(player, target);
						if (att > 0) {
							return target.countCards("h") <= 4 ? 1 : -1;
						} else {
							return target.countCards("h") > 4 ? 1 : -1;
						}
					},
				})
				.forResult();
		},
		getVcards(player) {
			const vcards = get.inpileVCardList(info => {
				if (info[0] != "trick") {
					return false;
				}
				return player.hasUseTarget({ name: info[2], nature: info[3] });
			});
			return vcards;
		},
		hasUseTarget(player, card) {
			const hs = player.getCards("h");
			const total = hs.length;

			if (total === 0) {
				return false;
			}

			const count = Math.ceil(total / 2);
			function* combinations(cards, chooseCount) {
				const choose = new Array(chooseCount);

				function* dfs(start, depth) {
					if (depth === chooseCount) {
						yield choose.slice();
						return;
					}

					const limit = cards.length - (chooseCount - depth);

					for (let i = start; i <= limit; i++) {
						choose[depth] = cards[i];
						yield* dfs(i + 1, depth + 1);
					}
				}

				yield* dfs(0, 0);
			}

			for (const cards of combinations(hs, count)) {
				if (player.hasUseTarget(get.autoViewAs(card, cards))) {
					return true;
				}
			}

			return false;
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			const list = new Map();
			for (const current of [player, target]) {
				const vcards = get.info(event.name).getVcards(current);
				if (!vcards.length) {
					continue;
				}
				const targetx = current == player ? target : player;
				const result = await current
					.chooseButton({
						createDialog: [`###请声明一个锦囊牌名###<div class='text center'>${get.translation(targetx)}将选择其半数手牌当此牌使用</div>`, [vcards, "vcard"]],
						forced: true,
						ai(button) {
							const { player, target } = get.event();
							return -target.getUseValue({ name: button.link[2], nature: button.link[3] });
						},
					})
					.set("target", targetx)
					.forResult();
				if (result?.bool) {
					const card = { name: result.links[0][2], nature: result.links[0][3] };
					current.popup(card.name);
					game.log(player, "声明了", card);
					list.set(targetx, card);
				}
			}
			if (!list?.size) {
				return;
			}
			for (const current of [player, target]) {
				if (!list.has(current) || !current.isIn()) {
					continue;
				}
				const card = list.get(current);
				if (!get.info(event.name).hasUseTarget(current, card)) {
					continue;
				}
				const num = Math.ceil(current.countCards("h") / 2);
				game.broadcastAll(
					(viewAs, num) => {
						lib.skill.sxrmbingqu_backup.viewAs = viewAs;
						lib.skill.sxrmbingqu_backup.selectCard = num;
					},
					card,
					num
				);
				const next = current.chooseToUse();
				next.set("_backupevent", "sxrmbingqu_backup");
				next.set("openskilldialog", `###并驱###将${get.cnNumber(num)}张手牌当作【${get.translation(card)}】使用`);
				next.backup("sxrmbingqu_backup");
				next.set("norestore", true);
				next.set("custom", {
					add: {},
					replace: { window() {} },
				});
				next.set("forced", true);
				await next;
			}
		},
		subSkill: {
			backup: {
				filterCard(card) {
					return get.itemtype(card) == "card";
				},
				position: "h",
				log: false,
				allowChooseAll: true,
				ai1(card) {
					return 6 - get.value(card);
				},
			},
		},
	},
	sxrmfanxin: {
		audio: 2,
		trigger: {
			global: ["phaseBefore", "dieAfter"],
			player: "enterGame",
		},
		filter(event, player) {
			if (event.name == "die") {
				return player.getStorage("sxrmfanxin").includes(event.player);
			}
			return (event.name != "phase" || game.phaseNumber == 0) && game.hasPlayer(current => current != player && !player.getStorage("sxrmfanxin").includes(current));
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget({
					prompt: get.prompt(event.skill),
					prompt2: "选择一名其他角色，令其获得【暴怒】和【无谋】",
					filterTarget: (card, player, target) => {
						return target != player && !player.getStorage("sxrmfanxin").includes(target);
					},
					ai(target) {
						const player = get.player();
						return -get.attitude(player, target);
					},
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			player.markAuto(event.name, [target]);
			await target.addSkills(["baonu", "wumou"]);
		},
		intro: { content: "当前“燔心”角色：$" },
		onremove: true,
		derivation: ["baonu", "wumou"],
		group: ["sxrmfanxin_draw"],
		subSkill: {
			draw: {
				audio: "sxrmfanxin",
				trigger: { global: "phaseBegin" },
				filter(event, player) {
					const target = event.player;
					return player.getStorage("sxrmfanxin").includes(target) && target.hasMark("baonu");
				},
				async cost(event, trigger, player) {
					const target = trigger.player,
						num = Math.min(5, target.countMark("baonu"));
					let list = Array.from({ length: num }).map((_, i) => get.cnNumber(i + 1, true));
					list.push("cancel2");
					const result = await player
						.chooseControl({
							prompt: get.prompt(event.skill, target),
							prompt2: `移去${get.translation(target)}的至多5枚“暴怒”标记并摸等量张牌`,
							controls: list,
							ai() {
								return _status.event.choice;
							},
						})
						.set("choice", num - 1)
						.forResult();
					event.result = {
						bool: result.control != "cancel2",
						cost_data: result.index + 1,
					};
				},
				logTarget: "player",
				async content(event, trigger, player) {
					const num = event.cost_data;
					event.targets[0].removeMark("baonu", num);
					await player.draw(num);
				},
			},
		},
	},
	//嗔贾华
	sxrmfubei: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return player.countCards("h") < player.maxHp;
		},
		manualConfirm: true,
		prompt(event, player) {
			const num = player.maxHp - player.countCards("h");
			return `摸${get.cnNumber(num)}张牌，然后将两张牌正面朝上置于牌堆顶前十张的任意位置`;
		},
		async content(event, trigger, player) {
			await player.drawTo(player.maxHp);
			if (player.countCards("h") < 2) {
				return;
			}
			let result = await player
				.chooseCard({
					prompt: "选择置入牌堆的两张牌",
					forced: true,
					selectCard: 2,
					position: "he",
					ai(card) {
						return 10 - get.value(card);
					},
				})
				.forResult();
			if (!result?.cards?.length) {
				return;
			}
			let { cards } = result;
			const [card1, card2] = cards;
			const insertRange = Math.min(ui.cardPile.childElementCount + 2, 10);
			result = await player
				.chooseNumbers({
					prompt: "请依次选择两张牌插入的位置",
					forced: true,
					list: [
						{
							prompt: `将${get.translation(card1)}置于牌堆顶的第（）张`,
							min: 1,
							max: insertRange,
						},
						{
							prompt: `将${get.translation(card2)}置于牌堆顶的第（）张`,
							min: 1,
							max: insertRange,
						},
					],
					filterOk(event) {
						return event.numbers.toUniqued().length == 2;
					},
					processAI() {
						const list = Array.from({ length: get.event().range0 }).map((val, idx) => idx + 1);
						if (list.length >= 2) {
							list.remove(1);
						}
						return [list.randomRemove(), list.randomRemove()];
					},
				})
				.set("range0", insertRange)
				.forResult();
			if (!result?.numbers?.length) {
				return;
			}
			const [num1, num2] = result.numbers;
			if (num1 > num2) {
				cards = [card2, card1];
			}
			player.setStorage("sxrmfubei_effect", player.getStorage("sxrmfubei_effect").concat(cards));
			game.broadcastAll(function () {
				lib.skill.sxrmfubei.createObserver();
			});
			await player
				.lose(cards, ui.cardPile)
				.set("insert_index", (event, card) => {
					const nums = get.event().nums,
						cardsx = get.event().cardsx;
					return ui.cardPile.childNodes[nums[cardsx.indexOf(card)] - 1];
				})
				.set("nums", [num1, num2])
				.set("cardsx", [card1, card2]);
			game.log(player, "将", card1, "与", card2, `分别置于牌堆顶的第${num1}张与第${num2}张`);
		},
		mark: true,
		marktext: "牌",
		intro: {
			markcount: () => 10,
			mark(dialog, storage, player, event, skill) {
				const intronode = ui.create.div(".menubutton.pointerdiv", "点击观看", function () {
					if (!this.classList.contains("disabled")) {
						this.classList.add("disabled");
						this.style.opacity = 0.5;
						lib.skill[skill].clickable(player);
					}
				});
				if (!_status.gameStarted) {
					intronode.classList.add("disabled");
					intronode.style.opacity = 0.5;
				}
				dialog.add(intronode);
			},
		},
		// 【知天】看牌
		clickable(player) {
			const cards = lib.skill.sxrmfubei.getCards(player);
			function createDialogWithControl(result) {
				const dialog = ui.create.dialog("伏备", "peaceDialog");
				if (result.length > 0) {
					dialog.addSmall([
						result,
						(item, type, position, noclick, node) => {
							// 处理下可见与否的情况
							if (get.is.shownCard(item)) {
								node = ui.create.buttonPresets.card(item, type, position, noclick);
							} else {
								node = ui.create.buttonPresets.blank(item, type, position, noclick);
							}
							return node;
						},
					]);
				} else {
					dialog.addText("牌堆顶无牌");
				}
				const control = ui.create.control("确定", () => dialog.close());
				dialog._close = dialog.close;
				dialog.hide = dialog.close = function (...args) {
					control.close();
					return dialog._close(...args);
				};
				if (_status.sxrmfubei_clickable) {
					_status.sxrmfubei_clickable.close();
				}
				_status.sxrmfubei_clickable = dialog;
				dialog.open();
			}
			if (cards instanceof Promise) {
				cards.then(([ok, result]) => createDialogWithControl(result));
			} else {
				createDialogWithControl(cards);
			}
		},
		getCards(player) {
			let cards = [];
			if (game.online) {
				return game.requestSkillData("sxrmfubei", "getTopCards", 10000);
			} else {
				if (ui.cardPile.hasChildNodes !== false) {
					cards = Array.from(ui.cardPile.childNodes).slice(0, 10);
				}
			}
			return cards;
		},
		sync: {
			getTopCards(client) {
				if (ui.cardPile.hasChildNodes !== false) {
					const cards = Array.from(ui.cardPile.childNodes).slice(0, 10);
					// 重连手动添加刀斧手标记
					cards.forEach(card => {
						if (game.hasPlayer(current => current.getStorage("sxrmfubei_effect").includes(card))) {
							game.broadcastAll(card => {
								card.addGaintag("visible_sxrmfubei");
							}, card);
						}
					});
					return cards;
				}
				return [];
			},
		},
		createObserver() {
			// 重连
			if (!_status.postReconnect.sxrmfubei) {
				_status.postReconnect.sxrmfubei = [
					function (list) {
						lib.skill.sxrmfubei.createObserver();
					},
					[],
				];
			}
			// 监听牌堆
			ui[`sxrmfubeiUpdate`] = new MutationObserver(mutationsList => {
				for (const mutation of mutationsList) {
					if (mutation.type === "childList") {
						// 新增节点，有场上角色【伏备】插入卡牌至牌堆，添加刀斧手标记
						mutation.addedNodes.forEach(card => {
							if (game.hasPlayer(current => current.getStorage("sxrmfubei_effect").includes(card))) {
								game.broadcastAll(card => {
									card.addGaintag("visible_sxrmfubei");
								}, card);
							}
						});
						// 移除节点，移除标记和清除记录
						mutation.removedNodes.forEach(card => {
							game.filterPlayer(current => current.getStorage("sxrmfubei_effect").includes(card)).forEach(current => current.unmarkAuto("sxrmfubei_effect", [card]));
							game.broadcastAll(card => {
								if (card?.gaintag?.length) {
									card.removeGaintag("visible_sxrmfubei");
								}
							}, card);
						});
					}
				}
			});
			const config = { childList: true, subtree: false };
			ui[`sxrmfubeiUpdate`].observe(ui.cardPile, config);
		},
		ai: {
			order: 2,
			result: {
				player(player) {
					if (player.maxHp - player.countCards("h") >= 2) return 1;
					return -1;
				},
			},
		},
		group: "sxrmfubei_damage",
		subSkill: {
			damage: {
				audio: "sxrmfubei",
				trigger: { global: "phaseEnd" },
				filter(event, player) {
					return get.is.shownCard(ui.cardPile.childNodes[0]);
				},
				forced: true,
				locked: false,
				logTarget: "player",
				async content(event, trigger, player) {
					await event.targets[0].damage();
				},
			},
		},
	},
	sxrmdancui: {
		audio: 2,
		locked(skill, player) {
			if (!player?.storage?.sxrmdancui) {
				return false;
			}
			return true;
		},
		qidingSkill(skill, player) {
			if (!player?.storage?.sxrmdancui) {
				return true;
			}
			return false;
		},
		trigger: { source: "damageBegin1" },
		async cost(event, trigger, player) {
			const qiding = player.storage["sxrmdancui"],
				target = trigger.player;
			if (player.countDiscardableCards(player, "he") < 2) {
				const cards = player.getDiscardableCards(player, "he");
				if (qiding) {
					event.result = {
						bool: true,
						cards,
					};
				} else {
					const result = await player
						.chooseBool({
							prompt: get.prompt(event.skill, target),
							prompt2: `${cards.length ? `弃置${get.translation(cards)}，` : ""}使${get.translation(target)}受到的伤害值+1？`,
							ai() {
								const { player, target } = get.event();
								return get.attitude(player, target) < 0;
							},
						})
						.set("target", target)
						.forResult();
					event.result = {
						bool: result.bool,
						cards,
					};
				}
			} else {
				const next = player
					.chooseToDiscard({
						position: "he",
						selectCard: 2,
						ai(card) {
							const { player, target } = get.event();
							if (get.attitude(player, target) >= 0) {
								return -1;
							}
							return 5 - get.value(card);
						},
						chooseonly: true,
					})
					.set("target", target);
				if (!qiding) {
					next.set("prompt", get.prompt(event.skill, target));
					next.set("prompt2", `弃置两张牌，使${get.translation(target)}受到的伤害值+1`);
				} else {
					next.set("prompt", "殚瘁");
					next.set("prompt2", `请弃置两张牌，使${get.translation(target)}受到的伤害值+1`);
					next.set("forced", true);
				}
				event.result = await next.forResult();
			}
		},
		async content(event, trigger, player) {
			player.awakenQidingSkill(event.name);
			const { cards } = event;
			if (cards?.length) {
				await player.discard(cards);
			}
			trigger.num++;
		},
		mark: true,
		intro: { content: "qidingSkill" },
	},
	//嗔赵云
	sxrmzhaduo: {
		audio: 2,
		trigger: { player: "phaseJieshuBegin" },
		filter(event, player) {
			return (
				game.countPlayer(current => {
					return player != current && current.hasGainableCards(player, "he");
				}) >= 2
			);
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget({
					prompt: get.prompt2(event.skill),
					selectTarget: 2,
					filterTarget(card, player, target) {
						return player != target && target.hasGainableCards(player, "he");
					},
					ai(target) {
						const player = get.player();
						const eff1 = get.effect(target, { name: "shunshou_copy2" }, player, player);
						if (!ui.selected.targets.length) {
							return (
								eff1 +
								get.effect(target, { name: "sha" }, player, player) +
								target.getSkills(null, false, false).filter(skill => {
									const info = get.info(skill);
									return info?.ai && (info.ai.maixie || info.ai.maixie_hp || info.ai.maixie_defend);
								}).length *
									3
							);
						}
						const target1 = ui.selected.targets[0];
						return (
							eff1 +
							get.effect(player, { name: "juedou" }, target, player) +
							target1.getSkills(null, false, false).filter(skill => {
								const info = get.info(skill);
								return info?.ai && (info.ai.maixie || info.ai.maixie_hp || info.ai.maixie_defend);
							}).length *
								3
						);
					},
				})
				.set("targetprompt", ["出杀对象", "决斗对象"])
				.set("multitarget", true)
				.forResult();
		},
		async content(event, trigger, player) {
			const [target1, target2] = event.targets;
			await player.gainMultiple(event.targets, "he");
			const sha = get.autoViewAs({ name: "sha", isCard: true });
			const juedou = get.autoViewAs({ name: "juedou", isCard: true });
			if (player.canUse(sha, target1, false)) {
				const skills1 = target2.getSkills(null, false, false);
				player.addAdditionalSkill(event.name, skills1);
				await player.useCard(sha, target1, false);
				player.removeAdditionalSkill(event.name);
				if (target2.canUse(juedou, player, false)) {
					const skills1 = target1.getSkills(null, false, false);
					player.addAdditionalSkill(event.name, skills1);
					await target2.useCard(juedou, player, false);
					player.removeAdditionalSkill(event.name);
				}
			}
		},
	},
	//嗔曹仁
	sxrmyangbei: {
		audio: 2,
		trigger: { player: ["phaseZhunbeiBegin", "phaseJieshuBegin", "useCardToPlayered"] },
		filter(event, player, name) {
			if (name != "useCardToPlayered") {
				return true;
			}
			const { card } = event;
			if ((card.name !== "sha" && get.type(card) !== "trick") || event.targets?.length != 1) {
				return false;
			}
			const target = event.targets[0];
			const hs = target.getCards("h");
			if (!hs.length) {
				return false;
			}
			if (hs.some(card => !lib.filter.cardDiscardable(card, player, "sxrmyangbei"))) {
				return false;
			}
			return true;
		},
		async cost(event, trigger, player) {
			if (event.triggername != "useCardToPlayered") {
				event.result = await player
					.chooseBool({
						prompt: get.prompt(event.skill),
						prompt2: "你可以摸三张牌并翻面",
					})
					.forResult();
			} else {
				const { target, card } = trigger;
				const hs = target.getCards("h");
				event.result = await target
					.chooseBool({
						prompt: `###${player == target ? "" : `${get.translation(player)}对`}你使用了${get.translation(card)}###你可以弃置${get.translation(hs)}，令${player == target ? "" : "其"}【佯北】本回合失效`,
						ai() {
							const { player, target } = get.event();
							if (get.attitude(player, target) >= 0) {
								return false;
							}
							if (!target.isTurnedOver()) {
								return false;
							}
							switch (player.countCards("h")) {
								case 1:
									return true;
								case 2:
								case 3:
									return (
										player.countCards("h", card => {
											return ["shan", "tao"].includes(card.name);
										}) <= 1
									);
								default:
									return false;
							}
						},
					})
					.set("target", player)
					.forResult();
			}
		},
		async content(event, trigger, player) {
			if (event.triggername != "useCardToPlayered") {
				await player.draw(3);
				await player.turnOver();
			} else {
				const target = trigger.target;
				await target.modedDiscard(target.getCards("h"));
				player.tempBanSkill(event.name);
			}
		},
	},
	sxrmyinfeng: {
		audio: 2,
		trigger: { source: "damageSource" },
		filter(event, player) {
			return player.getHistory("sourceDamage").indexOf(event) == 0 && event.player.isIn();
		},
		forced: true,
		check(event, player) {
			return get.attitude(player, event.player) <= 0;
		},
		logTarget: "player",
		async content(event, trigger, player) {
			const target = event.targets[0];
			player.addSkill(event.name + "_effect");
			player.markAuto(event.name + "_effect", [target]);
			target.addSkill(event.name + "_debuff");
			const num = target.maxHp - target.getHp();
			if (num > 0) {
				await target.loseMaxHp(num);
				target.addMark(event.name + "_debuff", num, false);
			}
		},
		subSkill: {
			effect: {
				charlotte: true,
				onremove: true,
				intro: { content: "已偷袭角色：$" },
				trigger: { player: "phaseBegin" },
				filter(event, player) {
					return game.hasPlayer(current => player.getStorage("sxrmyinfeng_effect").includes(current));
				},
				forced: true,
				popup: false,
				logTarget(event, player) {
					return game.filterPlayer(current => player.getStorage("sxrmyinfeng_effect").includes(current)).sortBySeat();
				},
				async content(event, trigger, player) {
					player.removeSkill(event.name);
					for (const target of event.targets) {
						const num = target.countMark("sxrmyinfeng_debuff");
						target.removeSkill("sxrmyinfeng_debuff");
						await target.gainMaxHp(num);
					}
				},
			},
			debuff: {
				charlotte: true,
				init(player, skill) {
					game.addGlobalSkill("sxrmyinfeng_jueqing");
				},
				onremove(player, skill) {
					delete player.storage[skill];
					if (!game.hasPlayer(current => current.hasSkill("sxrmyinfeng", null, null, false), true)) {
						game.removeGlobalSkill("sxrmyinfeng_jueqing");
					}
				},
				marktext: "箭",
				intro: {
					content(storage = 0) {
						return `中了冷箭，${storage > 0 ? `暂时损失了${storage}点体力上限，` : ""}期间造成与受到伤害均视为失去体力。`;
					},
				},
				trigger: {
					player: "damageBefore",
					source: "damageBefore",
				},
				forced: true,
				popup: false,
				async content(event, trigger, player) {
					trigger.cancel();
					await trigger.player.loseHp(trigger.num);
				},
				ai: { jueqing: true },
			},
			juqing: {
				trigger: { player: "dieAfter" },
				filter(event, player) {
					return !game.hasPlayer(cur => cur.hasSkill("sxrmyinfeng_debuff", null, null, false));
				},
				silent: true,
				forceDie: true,
				async content(event, trigger, player) {
					game.removeGlobalSkill(event.name);
				},
				ai: {
					jueqing: true,
					skillTagFilter(player, tag, arg) {
						if (tag === "jueqing") {
							return arg?.hasSkill("sxrmyinfeng_debuff");
						}
					},
				},
			},
		},
	},

	//曼巴
	//关羽
	sxrmhanguo: {
		audio: 2,
		trigger: {
			global: "roundStart",
		},
		filter(event, player) {
			const targets = get.info("sxrmhanguo").getSelected(player);
			return game.hasPlayer(current => !targets.includes(current));
		},
		async cost(event, trigger, player) {
			const targets = get.info(event.skill).getSelected(player);
			event.result = await player
				.chooseTarget(get.prompt2(event.skill), (card, player, target) => {
					return target != player && !get.event().usedTarget.includes(target);
				})
				.set("usedTarget", targets)
				.set("ai", target => {
					const player = get.player();
					return -get.attitude(player, target);
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const target = event.targets[0],
				skill = "sxrmhanguo_hujia";
			target.markAuto(skill, player);
			target.getStorage(skill).forEach(current => {
				target.addTip(`${skill}_${current.playerid}`, `撼国 ${get.translation(current)}`);
			});
			target.addTempSkill(skill, "roundEnd");
			const cards = target.getCards("he");
			if (!cards.length) {
				return;
			}
			const next = target.addToExpansion(cards, "giveAuto", target);
			next.gaintag.add(skill);
			await next;
		},
		getSelected(player) {
			const historys = game.getRoundHistory(
				"everything",
				evt => {
					return evt.player == player && evt.name == "sxrmhanguo";
				},
				void 0,
				1
			);
			if (!historys.length) {
				return [];
			}
			return historys.map(evt => evt.targets || []).flat();
		},
		init(player, skill) {
			player.addSkill("sxrmhanguo_effect");
		},
		derivation: "hujia",
		subSkill: {
			effect: {
				charlotte: true,
				audio: "sxrmhanguo",
				trigger: {
					source: "damageSource",
				},
				filter(event, player) {
					if (event.card?.name != "sha" || !event.player?.isIn()) {
						return false;
					}
					return event.player.getStorage("sxrmhanguo_hujia")?.includes(player);
				},
				forced: true,
				locked: false,
				async content(event, trigger, player) {
					await trigger.player.die({ source: player });
				},
				ai: {
					jueqing: true,
					skillTagFilter(player, tag, arg) {
						return arg?.getStorage("sxrmhanguo_hujia")?.includes(player);
					},
				},
			},
			hujia: {
				inherit: "hujia",
				charlotte: true,
				sourceSkill: "hujia",
				name: "护驾",
				nopop: true,
				audio: "hujia",
				filter(event, player) {
					if (event.responded) {
						return false;
					}
					if (player.storage.hujiaing) {
						return false;
					}
					if (!event.filterCard(get.autoViewAs({ name: "shan", isCard: true }), player, event)) {
						return false;
					}
					return game.hasPlayer(current => current != player);
				},
				async content(event, trigger, player) {
					const start = _status.currentPhase == player ? _status.currentPhase.getNext() : _status.currentPhase || player;
					while (true) {
						let bool;
						if (!event.current) {
							event.current = start;
						} else if (event.current == start) {
							return;
						}
						if (event.current == player) {
							event.current = event.current.getNext();
							continue;
						}
						if ((event.current == game.me && !_status.auto) || get.attitude(event.current, player) > 2 || event.current.isOnline()) {
							player.storage.hujiaing = true;
							const next = event.current.chooseToRespond("是否替" + get.translation(player) + "打出一张闪？", { name: "shan" });
							next.set("ai", () => {
								const event = _status.event;
								return get.attitude(event.player, event.source) - 2;
							});
							next.set("skillwarn", "替" + get.translation(player) + "打出一张闪");
							next.autochoose = lib.filter.autoRespondShan;
							next.set("source", player);
							bool = (await next.forResult()).bool;
						}
						player.storage.hujiaing = false;
						if (bool) {
							trigger.result = { bool: true, card: { name: "shan", isCard: true } };
							trigger.responded = true;
							trigger.animate = false;
							if (typeof event.current.ai.shown == "number" && event.current.ai.shown < 0.95) {
								event.current.ai.shown += 0.3;
								if (event.current.ai.shown > 0.95) {
									event.current.ai.shown = 0.95;
								}
							}
							const targets = player.getStorage(event.name).filter(current => current.countGainableCards(event.current, "he"));
							if (!targets.length) {
								return;
							}
							const result =
								targets.length > 1
									? await event.current
											.chooseTarget(`撼国：获得${get.translation(targets)}中的一名角色一张牌`, true, (card, player, target) => {
												return get.event().selectTargets.includes(target);
											})
											.set("selectTargets", targets)
											.set("ai", target => {
												const player = get.player();
												return get.effect(target, { name: "shunshou_copy2" }, player, player);
											})
											.forResult()
									: {
											bool: true,
											targets: targets,
										};
							if (result?.bool) {
								const target = result.targets[0];
								await event.current.gainPlayerCard(target, "he", true);
							}
							return;
						} else {
							event.current = event.current.getNext();
						}
					}
				},
				ai: {
					respondShan: true,
					skillTagFilter(player) {
						if (player.storage.hujiaing) {
							return false;
						}
						return game.hasPlayer(current => current != player);
					},
				},
				marktext: "标",
				intro: {
					name: "撼国",
					markcount: "expansion",
					mark(dialog, storage, player) {
						const cards = player.getExpansions("sxrmhanguo_hujia");
						if (player.isUnderControl(true)) {
							dialog.addAuto(cards);
						} else {
							return "共有" + get.cnNumber(cards.length) + "张牌";
						}
					},
				},
				onremove(player, skill) {
					const targets = player.getStorage(skill);
					if (targets.length) {
						targets.forEach(current => {
							player.removeTip(`${skill}_${current.playerid}`);
						});
					}
					const cards = player.getExpansions(skill);
					if (cards.length) {
						if (_status.event.name == "die") {
							player.loseToDiscardpile(cards);
						} else {
							player.gain(cards, "draw");
							game.log(player, "收回了" + get.cnNumber(cards.length) + "张“撼国”牌");
						}
					}
					player.setStorage(skill, null);
				},
			},
		},
	},
	sxrmweiwo: {
		audio: 2,
		trigger: {
			player: "phaseJieshuBegin",
		},
		limited: true,
		skillAnimation: true,
		animationColor: "fire",
		async cost(event, trigger, player) {
			const result = await player
				.chooseButtonTarget({
					createDialog: [get.prompt2(event.skill), [["rende", "qingnang", "longyin"], "skill"]],
					selectButton: [1, 3],
					filterTarget: lib.filter.notMe,
					selectTarget() {
						return ui.selected?.buttons?.length;
					},
					complexSelect: true,
					complexTarget: true,
					targetprompt(target) {
						const index = ui.selected.targets?.indexOf(target);
						if (index >= 0) {
							return get.translation(ui.selected.buttons[index]);
						}
						return "";
					},
					ai1: () => Math.random(),
					ai2(target) {
						return Math.max(0.1, get.attitude(get.player(), target));
					},
				})
				.forResult();
			if (result.bool) {
				event.result = {
					bool: true,
					targets: result.targets,
					cost_data: result.links,
				};
			}
		},
		async content(event, trigger, player) {
			player.awakenSkill(event.name);
			const { targets, cost_data: skills } = event;
			for (let i = 0; i < targets.length; i++) {
				const skill = `${event.name}_${skills[i]}`;
				targets[i].markAuto(skill, player);
				await targets[i].addSkills(skill);
				get.info(skill).init(targets[i], skill);
			}
			await player.addSkills("old_wushen");
		},
		derivation: ["rende", "qingnang", "longyin", "old_wushen"],
		subSkill: {
			rende: {
				inherit: "rende",
				sourceSkill: "rende",
				duplicatePrefix(player, skill) {
					const targets = player.getStorage(skill);
					if (targets.length == 1) {
						return `${get.translation(targets)}·`;
					}
					return "魔";
				},
				name: "仁德",
				audio: "rende",
				init(player, skill) {
					player.getStorage(skill).forEach(current => {
						player.addTip(`${skill}_${current.playerid}`, `${get.translation(skill)} ${get.translation(current)}`);
					});
				},
				onremove(player, skill) {
					player.getStorage(skill).forEach(current => {
						player.removeTip(`${skill}_${current.playerid}`);
					});
					player.setStorage(skill, null);
				},
				filterTarget(card, player, target) {
					if (!player.getStorage("sxrmweiwo_rende").length) {
						return player != target;
					}
					return player != target && player.getStorage("sxrmweiwo_rende").includes(target);
				},
				check(card) {
					if (ui.selected.cards.length > 1) {
						return 0;
					}
					if (ui.selected.cards.length && ui.selected.cards[0].name == "du") {
						return 0;
					}
					if (!ui.selected.cards.length && card.name == "du") {
						return 20;
					}
					const player = get.owner(card);
					let num = 0;
					const evt2 = _status.event.getParent();
					player.getHistory("lose", evt => {
						if (evt.getParent().skill == "sxrmweiwo_rende" && evt.getParent(3) == evt2) {
							num += evt.cards.length;
						}
					});
					if (player.hp == player.maxHp || num > 1 || player.countCards("h") <= 1) {
						if (ui.selected.cards.length) {
							return -1;
						}
						const players = game.filterPlayer();
						for (let i = 0; i < players.length; i++) {
							if (players[i].hasSkill("haoshi") && !players[i].isTurnedOver() && !players[i].hasJudge("lebu") && get.attitude(player, players[i]) >= 3 && get.attitude(players[i], player) >= 3) {
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
					const evt2 = event.getParent(3);
					let num = 0;
					player.getHistory("lose", evt => {
						if (evt.getParent(2).name == "sxrmweiwo_rende" && evt.getParent(5) == evt2) {
							num += evt.cards.length;
						}
					});
					await player.give(event.cards, event.target);
					if (num < 2 && num + event.cards.length > 1) {
						await player.recover();
					}
				},
				ai: {
					order(skill, player) {
						if (player.hp < player.maxHp && player.storage.rende < 2 && player.countCards("h") > 1) {
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
							if (player.hp == player.maxHp || player.storage.rende < 0 || player.countCards("h") <= 1) {
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
			},
			qingnang: {
				inherit: "qingnang",
				sourceSkill: "qingnang",
				duplicatePrefix(player, skill) {
					const targets = player.getStorage(skill);
					if (targets.length == 1) {
						return `${get.translation(targets)}·`;
					}
					return "魔";
				},
				name: "青囊",
				audio: "qingnang",
				init(player, skill) {
					player.getStorage(skill).forEach(current => {
						player.addTip(`${skill}_${current.playerid}`, `${get.translation(skill)} ${get.translation(current)}`);
					});
				},
				onremove(player, skill) {
					player.getStorage(skill).forEach(current => {
						player.removeTip(`${skill}_${current.playerid}`);
					});
					player.setStorage(skill, null);
				},
				filterTarget(card, player, target) {
					if (target.hp >= target.maxHp) {
						return false;
					}
					if (!player.getStorage("sxrmweiwo_qingnang").length) {
						return true;
					}
					return player.getStorage("sxrmweiwo_qingnang").includes(target);
				},
			},
			longyin: {
				inherit: "longyin",
				sourceSkill: "longyin",
				duplicatePrefix(player, skill) {
					const targets = player.getStorage(skill);
					if (targets.length == 1) {
						return `${get.translation(targets)}·`;
					}
					return "魔";
				},
				name: "龙吟",
				audio: "longyin",
				init(player, skill) {
					player.getStorage(skill).forEach(current => {
						player.addTip(`${skill}_${current.playerid}`, `${get.translation(skill)} ${get.translation(current)}`);
					});
				},
				onremove(player, skill) {
					player.getStorage(skill).forEach(current => {
						player.removeTip(`${skill}_${current.playerid}`);
					});
					player.setStorage(skill, null);
				},
				filter(event, player) {
					if (player.getStorage("sxrmweiwo_longyin").length && !player.getStorage("sxrmweiwo_longyin").includes(event.player)) {
						return false;
					}
					return event.card.name == "sha" && player.countCards("he") > 0 && event.player.isPhaseUsing();
				},
			},
		},
	},
	old_wushen: {
		mod: {
			cardname(card, player, name) {
				if (get.suit(card) == "heart") {
					return "sha";
				}
			},
			cardnature(card, player) {
				if (get.suit(card) == "heart") {
					return false;
				}
			},
			targetInRange(card) {
				if (card.name === "sha") {
					const suit = get.suit(card);
					if (suit === "heart" || suit === "unsure") {
						return true;
					}
				}
			},
		},
		audio: "wushen",
		trigger: {
			player: "useCard",
		},
		forced: true,
		filter(event, player) {
			return !event.audioed && event.card.name == "sha" && get.suit(event.card) == "heart";
		},
		async content(event, trigger, player) {
			trigger.audioed = true;
		},
		ai: {
			effect: {
				target(card, player, target, current) {
					if (get.tag(card, "respondSha") && current < 0) {
						return 0.6;
					}
				},
			},
		},
	},
	//关银屏
	sxrmyinmou: {
		audio: 2,
		trigger: {
			global: ["loseAfter", "loseAsyncAfter", "equipAfter", "addJudgeAfter", "addToExpansionAfter", "gainAfter"],
		},
		filter(event, player) {
			const evts = game.getGlobalHistory("everything", evt => {
				return evt?.sxrmConnectCardsMap?.has?.(player);
			});
			return evts.indexOf(event) == 0;
		},
		forced: true,
		locked: false,
		logTarget(event, player) {
			const map = event.sxrmConnectCardsMap;
			return Array.from(map.keys()).sortBySeat();
		},
		async content(event, trigger, player) {
			const targets = event.targets;
			const func = async target => {
				await target.draw(Math.min(5, targets.length));
			};
			await game.doAsyncInOrder(targets, func);
		},
		global: "sxrmyinmou_global",
		subSkill: {
			global: {
				trigger: { player: "phaseJieshuBegin" },
				filter(event, player) {
					if (!player.hasSex("male") || !player.countCards("h", card => !get.is.connectedCard(card))) {
						return false;
					}
					return game.hasPlayer(current => {
						return current.hasSkill("sxrmyinmou") && current.countCards("h", card => !get.is.connectedCard(card));
					});
				},
				async cost(event, trigger, player) {
					event.result = await player
						.chooseTarget(get.prompt("sxrmyinmou"), "连接你与一名拥有〖姻谋〗的角色各一张未连接的手牌", (card, player, target) => {
							return target.hasSkill("sxrmyinmou") && target.countCards("h", card => !get.is.connectedCard(card));
						})
						.set("ai", target => {
							return get.attitude(get.player(), target) / (1 + target.countConnectedCards());
						})
						.forResult();
				},
				async content(event, trigger, player) {
					const target = event.targets[0],
						connects = new Map();
					for (const current of [target, player].sortBySeat().toUniqued()) {
						const cards = current.getCards("h", card => !get.is.connectedCard(card));
						if (!current.isIn() || !cards.length) {
							continue;
						}
						const result =
							cards.length == 1
								? { bool: true, links: cards }
								: await player
										.choosePlayerCard(current, "h", true)
										.set("filterButton", button => {
											return !get.is.connectedCard(button.link);
										})
										.forResult();
						if (result?.bool) {
							connects.set(current, result.links);
						}
					}
					for (const [current, cards] of connects) {
						await current.connectCards(cards);
					}
				},
			},
		},
	},
	sxrmquchi: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		filterTarget: true,
		async content(event, trigger, player) {
			const { target } = event;
			const cards = target.getConnectedCards();
			let num = cards.length ? 2 : 1;
			if (cards.length) {
				await target.resetConnectedCards(cards);
			}
			const next = target.damage("fire");
			next.num = num;
			await next;
		},
		ai: {
			order: 8,
			result: {
				target(player, target) {
					return get.damageEffect(target, player, target, "fire");
				},
			},
		},
	},
	//于禁
	sxrmsuwu: {
		audio: 2,
		trigger: {
			player: "phaseZhunbeiBegin",
			global: "useCard",
		},
		filter(event, player) {
			if (event.name == "useCard") {
				if (
					[player, event.player].some(current => {
						return !current.hasConnectedCards();
					})
				) {
					return false;
				}
				const evts = event.player.getHistory("useCard", evt => get.is.damageCard(evt.card));
				return evts.indexOf(event) == 0;
			}
			return game.hasPlayer(current => current.countCards("h"));
		},
		async cost(event, trigger, player) {
			if (trigger.name == "useCard") {
				event.result = {
					bool: true,
					targets: [trigger.player],
				};
			} else {
				event.result = await player
					.chooseTarget(get.prompt(event.skill), "连接至多四名角色各一张手牌", [1, 4], (card, player, target) => {
						return target.countCards("h");
					})
					.set("ai", target => {
						const player = get.player();
						const att = get.sgnAttitude(player, target);
						if (!ui.selected.targets.length) {
							if (player == target && ((player.isDamaged() && player.hasValueTarget({ name: "tao" })) || player == _status.currentPhase)) {
								return 12;
							}
							if (att > 0 && target == _status.currentPhase?.getNext()) {
								return 10;
							}
							return -att / (1 + target.countConnectedCards());
						}
						return -att / (1 + target.countConnectedCards());
					})
					.forResult();
			}
		},
		async content(event, trigger, player) {
			if (trigger.name == "useCard") {
				trigger.directHit.addArray(game.players);
				trigger.player
					.when("useCardAfter")
					.filter(evt => evt == trigger)
					.step(async (event, trigger, player) => {
						await player.draw(2);
					});
			} else {
				const targets = event.targets,
					connects = new Map();
				for (const current of targets.sortBySeat()) {
					const cards = current.getCards("h");
					if (!current.isIn() || !cards.length) {
						continue;
					}
					const result =
						cards.length == 1
							? { bool: true, links: cards }
							: await player
									.choosePlayerCard(current, "h", true)
									.set("ai", button => {
										const { player, target } = get.event();
										const { link } = button;
										const att = get.attitude(player, target);
										let val = get.value(link, target);
										if (att > 0) {
											if (player == target && player == _status.currentPhase) {
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
									})
									.forResult();
					if (result?.links?.length) {
						connects.set(current, result.links);
					}
				}
				for (const [current, cards] of connects) {
					await current.connectCards(cards);
				}
			}
		},
	},
	sxrmrenwang: {
		audio: 2,
		enable: "chooseToUse",
		viewAsFilter(player) {
			return player.hasConnectedCards();
		},
		filterCard(card) {
			return get.is.connectedCard(card);
		},
		position: "h",
		viewAs: { name: "tao" },
		prompt: "将一张连接牌当桃使用",
		check(card) {
			return 15 - get.value(card);
		},
		ai: {
			save: true,
			order(item, player) {
				const num = game.filterPlayer(current => player != current).reduce((sum, current) => sum + current.countConnectedCards() * -get.sgnAttitude(player, current), 0);
				if (num > 0) {
					return 10;
				}
				return get.order({ name: "tao" }) + 0.1;
			},
		},
	},
	//糜芳
	sxrmhuoe: {
		audio: 2,
		trigger: {
			player: "phaseJieshuBegin",
		},
		filter(event, player) {
			const card = new lib.element.VCard({ name: "huogong", isCard: true });
			return game.hasPlayer(current => current != player && player.canUse(card, current));
		},
		async cost(event, trigger, player) {
			const card = new lib.element.VCard({ name: "huogong", isCard: true });
			event.result = await player
				.chooseTarget(
					get.prompt2(event.skill),
					(card, player, target) => {
						const { huogong } = get.event();
						return target != player && player.canUse(huogong, target);
					},
					[1, 4]
				)
				.set("huogong", card)
				.set("ai", target => {
					const { huogong, player } = get.event();
					return get.effect(target, huogong, player, player);
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const card = new lib.element.VCard({ name: "huogong", isCard: true, storage: { huoe: true } }),
				targets = event.targets;
			player.addTempSkill("sxrmhuoe_effect");
			const next = player.useCard(card, targets);
			await next;
			player.removeSkill("sxrmhuoe_effect");
			const cards = game
				.getGlobalHistory("everything", evt => {
					return evt.name == "showCards" && evt.getParent(evtx => evtx == next, true);
				})
				.reduce((arr, evt) => arr.concat(evt.cards ?? []), []);
			if (!cards.length) {
				return;
			}
			let num = 0;
			while (cards.length) {
				const card = cards.shift();
				num += get.number(card);
				const result = await player
					.chooseTarget(`火厄：分配${get.translation(card)}给一名角色`, true)
					.set("ai", target => {
						const { cardx, player } = get.event();
						return get.value(cardx, target) * get.attitude(player, target);
					})
					.set("cardx", card)
					.forResult();
				if (result?.bool) {
					const target = result.targets[0],
						owner = get.owner(card);
					if (!owner) {
						await target.gain(card, "gain2");
					} else if (target != owner) {
						await owner.give(card, target, true);
					}
				}
			}
			if (num < 13) {
				await player.loseHp();
			}
		},
		subSkill: {
			effect: {
				trigger: {
					player: "chooseToDiscardBegin",
				},
				charlotte: true,
				filter(event, player) {
					const evt = event.getParent();
					return evt.name == "huogong" && evt.card?.storage?.huoe;
				},
				async cost(event, trigger, player) {
					if (
						player.countCards(trigger.position, card => {
							if (!lib.filter.cardDiscardable(card, player, trigger)) {
								return false;
							}
							return trigger.filterCard(card, player);
						})
					) {
						trigger.forced = true;
						const evt = trigger.getParent(2);
						evt.targets.splice(evt.num + 1);
					} else if (player.countCards("h")) {
						const evt = trigger.getParent();
						const next = evt.target.viewHandcards(player);
						event.next.remove(next);
						trigger.next.push(next);
					}
				},
			},
		},
	},
	sxrmtanduo: {
		audio: 2,
		trigger: { player: "phaseChange" },
		forced: true,
		filter(event, player) {
			if (!event.phaseList[event.num].startsWith("phaseDiscard")) {
				return false;
			}
			return player.needsToDiscard();
		},
		async content(event, trigger, player) {
			trigger.phaseList[trigger.num] = `phaseDraw|${event.name}`;
			await game.delayx();
		},
	},
	//寇封
	sxrmhuaibing: {
		audio: 2,
		trigger: {
			player: "phaseZhunbeiBegin",
		},
		filter(event, player) {
			return game.countPlayer(current => current.countCards("h")) >= 2;
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt2(event.skill), 2, (card, player, target) => {
					return target.countCards("h");
				})
				.set("ai", target => {
					const player = get.player();
					let eff = get.effect(target, { name: "shunshou_copy2" }, player, player),
						count = player.countCards("h", { color: "red" }) - 2;
					if (ui.selected.targets.length) {
						const first = ui.selected.targets[0];
						if (first.hp != target.hp) {
							const current = first.hp > target.hp ? target : first;
							return eff + get.effect(current, { name: "wuzhong" }, current, player) * count;
						}
					}
					return eff;
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const gains = event.targets.filter(current => current != player && current.countCards("h"));
			if (gains.length) {
				await player.gainMultiple(gains, "h");
			}
			await player.showHandcards(`${get.translation(player)}发动了【怀兵】`);
			const num = event.targets.reduce((sum, current) => sum + current.getHp(), 0) / 2,
				current = event.targets.find(current => current.getHp() < num);
			if (!current) {
				return;
			}
			const red = player.countCards("h", { color: "red" });
			for (const key of ["Draw", "Use", "Discard"]) {
				current.addTempSkill(`${event.name}_${key}`, { player: `phase${key}After` });
				current.setStorage(`${event.name}_${key}`, red);
				current.markSkill(`${event.name}_${key}`);
			}
		},
		subSkill: {
			Draw: {
				charlotte: true,
				marktext: "摸",
				intro: {
					content: "下个摸牌阶段摸牌数改为#",
				},
				onremove: true,
				trigger: {
					player: "phaseDrawBegin2",
				},
				filter(event, player) {
					const storage = player.getStorage("sxrmhuaibing_Draw", 0);
					return !event.numFixed && typeof storage == "number";
				},
				firstDo: true,
				forced: true,
				locked: false,
				async content(event, trigger, player) {
					trigger.num = player.getStorage(event.name, 0);
					trigger.numFixed = true;
				},
			},
			Use: {
				charlotte: true,
				marktext: "杀",
				intro: {
					content: "下个出牌阶段出【杀】次数改为#",
				},
				onremove: true,
				trigger: {
					player: "phaseUseBegin",
				},
				filter(event, player) {
					const storage = player.getStorage("sxrmhuaibing_Use", 0);
					return typeof storage == "number";
				},
				firstDo: true,
				forced: true,
				locked: false,
				async content(event, trigger, player) {
					player
						.when("phaseUseAfter")
						.step(async () => {})
						.assign({
							mod: {
								cardUsable(card, player, num) {
									const storage = player.getStorage("sxrmhuaibing_Use", 0);
									if (typeof storage != "number" || card.name != "sha") {
										return;
									}
									return storage;
								},
							},
						});
				},
			},
			Discard: {
				charlotte: true,
				marktext: "弃",
				intro: {
					content: "下个弃牌阶段手牌上限改为#",
				},
				onremove: true,
				trigger: {
					player: "phaseDiscardBegin",
				},
				filter(event, player) {
					const storage = player.getStorage("sxrmhuaibing_Discard", 0);
					return typeof storage == "number";
				},
				firstDo: true,
				forced: true,
				locked: false,
				async content(event, trigger, player) {
					player
						.when("phaseDiscardAfter")
						.step(async () => {})
						.assign({
							mod: {
								maxHandcardFinal(player, num) {
									const storage = player.getStorage("sxrmhuaibing_Discard", 0);
									if (typeof storage != "number") {
										return;
									}
									return storage;
								},
							},
						});
				},
			},
		},
	},
	//陆逊
	sxrmchanyu: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return game.hasPlayer(current => current != player);
		},
		filterTarget: lib.filter.notMe,
		async content(event, trigger, player) {
			const target = event.target;
			if (target.getHp() > 0) {
				await target.draw(target.getHp());
			}
			[player, target].forEach(current => {
				const num = Math.min(...current.getCards("h").map(card => get.number(card, current)));
				current.addGaintag(
					current.getCards("h", card => get.number(card, current) <= num),
					"sxrmchanyu_tag"
				);
			});
			const next = player.chooseToCompare(target);
			next.set("filterCard", (card, player) => {
				const bool = cardx => cardx.hasGaintag("sxrmchanyu_tag");
				return !player?.countCards("h", bool) || bool(card);
			});
			const result = await next.forResult();
			const func = async current => {
				current.removeGaintag("sxrmchanyu_tag");
				await current.showHandcards();
			};
			await game.doAsyncInOrder([player, target], func);
			if (result?.winner) {
				const winner = result.winner,
					loser = [player, target].find(current => current != winner);
				const dialog = [`###谄谀###<div class='text center'>你可以交换你与${get.translation(loser)}其中一种颜色或类别的所有手牌</div>`, `你的手牌`, winner.getCards("h"), `${get.translation(loser)}的手牌`, loser.getCards("h")];
				const list1 = Object.keys(lib.color).filter(color => [winner, loser].some(current => current.hasCards("h", card => get.color(card) == color)));
				const list2 = lib.inpile
					.map(name => get.type2(name))
					.toUniqued()
					.filter(type => [winner, loser].some(current => current.hasCards("h", card => get.type2(card) == type)));
				const result2 = await winner
					.chooseControl(list1.concat(list2), "cancel2")
					.set("dialog", dialog)
					.set("ai", () => get.event().resultx)
					.set(
						"resultx",
						(() => {
							const getFilter = (card, key) => {
								if (list1.includes(key)) {
									return get.color(card) == key;
								}
								return get.type2(card) == key;
							};
							const getV = key => {
								if (key === "cancel2") {
									return 0;
								}
								const cards1 = winner.getCards("h", card => getFilter(card, key)),
									cards2 = loser.getCards("h", card => getFilter(card, key));
								let sum1 = cards1.reduce((sum, card) => {
									sum += get.value(card, winner);
									return sum;
								}, 0);
								let sum2 = cards2.reduce((sum, card) => {
									sum += get.value(card, loser);
									return sum;
								}, 0);
								if (get.attitude(winner, loser) > 0) {
									return Math.abs(sum1 - sum2);
								}
								return sum2 - sum1;
							};
							return list1.addArray([list2, "cancel2"]).maxBy(getV);
						})()
					)
					.forResult();
				if (result2?.control != "cancel2") {
					const control = result2.control,
						getC = current => {
							return current.getCards("h", card => {
								if (list1.includes(control)) {
									return get.color(card) == control;
								}
								return get.type2(card) == control;
							});
						};
					await winner.swapHandcards(loser, getC(winner), getC(loser));
				}
			}
		},
		ai: {
			order: 9,
			result: {
				player: -1,
				target(player, target) {
					return target.getHp() - 1;
				},
			},
		},
	},
	sxrmcongfeng: {
		audio: 2,
		mark: true,
		zhuanhuanji: true,
		marktext: "☯",
		intro: {
			content(storage, player, skill) {
				const bool = player.getStorage(skill, false);
				return `转换技，你使用牌或成为牌的目标后，你可以${bool ? "弃置使用者两张牌" : "与使用者各摸一张牌"}`;
			},
		},
		trigger: {
			player: "useCard",
			target: "useCardToTargeted",
		},
		filter(event, player) {
			if (!event.player?.isIn()) {
				return false;
			}
			const bool = player.getStorage("sxrmcongfeng", false);
			return !bool || event.player.countDiscardableCards(player, "he");
		},
		logTarget: "player",
		check(event, player) {
			const bool = player.getStorage("sxrmcongfeng", false),
				getV = (current, name) => get.effect(current, { name: name }, player, player);
			if (bool) {
				return getV(event.player, "guohe_copy2") > 0;
			}
			return getV(event.player, "draw") + getV(player, "draw") > 0;
		},
		async content(event, trigger, player) {
			const bool = player.getStorage(event.name, false);
			player.changeZhuanhuanji(event.name);
			if (bool) {
				const num = Math.min(2, trigger.player.countDiscardableCards(player, "he"));
				if (num > 0) {
					await player.discardPlayerCard(trigger.player, "he", num, true);
				}
			} else {
				await game.asyncDraw([player, trigger.player]);
			}
		},
	},
	//吕蒙
	sxrmkongzhi: {
		audio: 2,
		trigger: {
			player: "useCardToPlayered",
			global: "useCard",
		},
		filter(event, player, name) {
			if (name == "useCard") {
				return player.isDamaged() && get.type(event.card) == "trick" && event.targets?.includes(player);
			}
			return event.card?.name == "sha" && event.targets?.length === 1 && event.target.countGainableCards(player, "he");
		},
		forced: true,
		async content(event, trigger, player) {
			if (event.triggername == "useCard") {
				trigger.excluded.add(player);
				await game.delayx();
			} else {
				await player.gainPlayerCard(trigger.target, "he", [1, 3], true);
			}
		},
		mod: {
			cardname(card, player) {
				if (player.isDamaged() && lib.card[card.name].type == "basic") {
					return "shan";
				}
			},
		},
		ai: {
			effect: {
				target(card, player, target) {
					if (!target.isDamaged()) {
						return;
					}
					if (get.type(card) == "trick") {
						return "zeroplayertarget";
					}
					if (get.name(card) == "sha") {
						return 0.3;
					}
				},
			},
		},
	},
	sxrmbizha: {
		audio: 2,
		trigger: {
			player: "phaseJieshuBegin",
		},
		async content(event, trigger, player) {
			await player.draw();
			const targets = game.filterPlayer(current => player.canCompare(current));
			if (!targets.length) {
				return;
			}
			const result =
				targets.length > 1
					? await player
							.chooseTarget("鄙诈：与一名角色拼点", true, (card, player, target) => player.canCompare(target))
							.set("ai", target => {
								return -get.attitude(get.player(), target);
							})
							.forResult()
					: {
							bool: true,
							targets: targets,
						};
			if (result?.bool) {
				const target = result.targets[0];
				const result2 = await player.chooseToCompare(target).forResult();
				if (result2?.winner != target) {
					await target.loseHp(2);
					let num = 0;
					while (num < 2 && target?.isIn() && target.countCards("h")) {
						const result3 = await player
							.chooseButton([`鄙诈：是否使用其中一张点数小于${result2.num2}的牌？（${num}/2）`, target.getCards("h")])
							.set("filterButton", button => {
								const { player, maxNum } = get.event(),
									card = button.link;
								if (get.number(card) >= maxNum) {
									return false;
								}
								return player.hasUseTarget(card);
							})
							.set("maxNum", result2.num2)
							.set("ai", button => {
								const { player } = get.event();
								return player.getUseValue(button.link);
							})
							.forResult();
						if (result3?.bool) {
							await player.chooseUseTarget(result3.links[0], true);
						} else {
							break;
						}
						num++;
					}
				}
				if (result2?.winner != player) {
					await player.loseMaxHp();
				}
			}
		},
	},
	//庞德
	sxrmnuozhan: {
		audio: 2,
		trigger: {
			player: "phaseZhunbeiBegin",
		},
		filter(event, player) {
			return game.hasPlayer(current => current != player);
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt2(event.skill), lib.filter.notMe)
				.set("ai", target => get.damageEffect(target, get.player(), get.player()))
				.forResult();
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			while (target?.isIn()) {
				await player.draw();
				const names = get.inpileVCardList(info => {
					if (info[0] == "delay") {
						return false;
					}
					const card = new lib.element.VCard({ name: info[2], nature: info[3], isCard: true });
					return get.tag(card, "damage");
				});
				if (!names.length) {
					return;
				}
				const result = await target
					.chooseButton(["声明一种伤害类牌", [names, "vcard"]], true)
					.set("ai", button => {
						const { player, kuangtu } = get.event(),
							card = new lib.element.VCard({ name: button.link[2], nature: button.link[3], isCard: true });
						let eff = Math.max(get.effect(player, card, kuangtu, kuangtu), get.effect(kuangtu, card, player, kuangtu));
						return eff;
					})
					.set("kuangtu", player)
					.forResult();
				if (!result?.bool) {
					return;
				}
				const card = new lib.element.VCard({ name: result.links[0][2], nature: result.links[0][3], isCard: true });
				const targets = [player, target].filter(current => current.canUse(card, current == player ? target : player, false));
				if (!targets?.length) {
					return;
				}
				const result2 =
					targets.length > 1
						? await player
								.chooseTarget(
									`选择${get.translation(card)}的使用者`,
									(card, player, target) => {
										return get.event().canUse.includes(target);
									},
									true
								)
								.set("canUse", targets)
								.set("targetx", target)
								.set("willUse", card)
								.set("ai", target => {
									const { player, targetx, willUse } = get.event();
									if (target == player) {
										return get.effect(targetx, willUse, target, player);
									}
									return get.effect(player, willUse, target, player);
								})
								.forResult()
						: {
								bool: true,
								targets: targets,
							};
				if (!result2?.bool) {
					return;
				}
				const user = result2.targets[0],
					targetx = [player, target].remove(user)[0];
				const next = user.useCard(card, targetx);
				next.baseDamage ??= 1;
				next.baseDamage++;
				await next;
				if (
					next.targets?.length &&
					next.targets.some(current => {
						return current.hasHistory("damage", evt => evt.card == next.card);
					})
				) {
					break;
				}
				await user.loseHp();
				if (!player?.isIn() || !target?.isIn()) {
					return;
				}
				const { bool } = await player
					.chooseBool(`是否继续对${get.translation(target)}搦战？`)
					.set("choice", player.hp > 1)
					.forResult();
				if (!bool) {
					break;
				}
			}
		},
	},
	//颜良文丑
	sxrmhaibian: {
		audio: 2,
		trigger: {
			global: "phaseBegin",
		},
		filter(event, player) {
			const historys = player.actionHistory;
			if (historys.length <= 1) {
				return false;
			}
			const { useCard, lose } = historys[historys.length - 2];
			return useCard.some(evt =>
				lose.some(evtx => {
					const evtxx = evtx.relatedEvent || evtx.getParent();
					return evtx.hs.length > 0 && evtxx == evt;
				})
			);
		},
		forced: true,
		locked: false,
		async content(event, trigger, player) {
			const historys = _status.globalHistory;
			if (historys.length <= 1) {
				return;
			}
			const { useCard } = historys[historys.length - 2];
			let black, red;
			for (let i = useCard.length - 1; i >= 0; i--) {
				const evt = useCard[i],
					color = get.color(evt.card);
				if (color === "black" && !black) {
					black = evt.player;
				}
				if (color === "red" && !red) {
					red = evt.player;
				}
				if (black && red) {
					break;
				}
			}
			for (const current of [black, red]) {
				if (current?.isIn()) {
					const card = new lib.element.VCard({ name: "juedou", isCard: true });
					if (current.hasUseTarget(card)) {
						await current.chooseUseTarget(card, "是否使用【决斗】？");
					}
				}
			}
		},
	},
	sxrmqiewang: {
		audio: 2,
		trigger: {
			global: "damageEnd",
		},
		filter(event, player) {
			return event.player?.isIn() && get.distance(player, event.player) <= 1;
		},
		forced: true,
		async content(event, trigger, player) {
			await player.draw();
			player
				.when({
					global: ["phaseAfter", "phaseBeforeStart"],
				})
				.step(async () => {})
				.assign({
					mod: {
						cardname(card, player) {
							if (get.position(card) == "h") {
								return "wuxie";
							}
						},
					},
				});
		},
	},
	//疑包
	//曹操
	sxrmkuxin: {
		audio: 2,
		trigger: { player: "damageEnd" },
		filter(event, player) {
			return game.hasPlayer(current => {
				return current !== player && current.countCards("h") > 0;
			});
		},
		check(event, player) {
			if (player.isTurnedOver()) {
				return true;
			}
			if (
				game.countPlayer(current => {
					if (current === player) {
						return 0;
					}
					if (get.attitude(player, current) > 0) {
						return current.countCards("h") >= 4;
					}
					return current.countCards("h");
				}) <
				4 / (1 + player.getHp())
			) {
				// 红桃牌很难获得
				return false;
			}
			return true; //跟你爆了 TODO: 一个考虑大局的枯心ai
			/*return (
				game.countPlayer(current => {
					if (current === player) {
						return 0;
					}
					const att = get.attitude(player, current);
					if (att > 0) {
						return -1;
					}
					if (att < 0) {
						return 1;
					}
					return 0.5;
				}) >=
				6 / (1 + player.getHp())
			);*/
		},
		logTarget(event, player) {
			return game.filterPlayer(current => current !== player).sortBySeat(_status.currentPhase);
		},
		async content(event, trigger, player) {
			const { targets } = event,
				list = [];
			for (const target of targets) {
				if (!target.countCards("h")) {
					continue;
				}
				const result = await target
					.chooseCard("枯心：展示任意张手牌", "h", [1, Infinity], true, "allowChooseAll")
					.set("targetx", player)
					.set("ai", card => {
						const { player, targetx } = get.event();
						let att = get.attitude(player, targetx);
						let val = get.value(card);
						if (get.suit(card, false) === "heart") {
							// 优先处理特殊逻辑
							return att * 10086 - val;
						}
						if (att < 0) {
							// 不情愿亮
							val = -val;
						} else if (att > 0) {
							// 队友有增益的可以给
							val = get.value(card, targetx) - val;
						}
						return val;
					})
					.forResult();
				if (!result?.cards?.length) {
					continue;
				}
				list.push([result.cards, target]);
				await target.showCards(result.cards);
				await game.delay();
			}
			let result,
				gains = [];
			if (list.length) {
				result = await player
					.chooseButtonTarget({
						createDialog: [
							"枯心：请选择一项执行",
							[
								list.flatMap(([cards, target]) => {
									return cards.map(card => [card, target]);
								}),
								(item, type, position, noclick, node) => {
									node = ui.create.buttonPresets.card(item[0], type, position, noclick);
									game.createButtonCardsetion(item[1].getName(true), node);
									return node;
								},
							],
							[
								["获得所有角色的展示牌", "获得一名角色的未展示牌"].map((item, i) => {
									return [i, item];
								}),
								"tdnodes",
							],
							[
								dialog => {
									dialog.css({ top: get.is.phoneLayout() ? "20%" : "40%" });
									dialog.buttons.forEach(button => {
										if (typeof button.link == "number") {
											button.style.setProperty("width", "200px", "important");
											button.style.setProperty("text-align", "left", "important");
										} else {
											button.style.setProperty("opacity", "1", "important");
										}
									});
									dialog.buttons = dialog.buttons.filter(button => typeof button.link == "number");
								},
								"handle",
							],
						],
						forced: true,
						filterTarget: lib.filter.notMe,
						selectTarget() {
							if (ui.selected.buttons.length) {
								const { link } = ui.selected.buttons[0];
								if (link == 1) {
									return 1;
								}
								return 0;
							}
							return 0;
						},
						filterOk() {
							if (ui.selected.buttons.length) {
								const { link } = ui.selected.buttons[0];
								if (link == 1) {
									return ui.selected.targets.length == 1;
								}
								return link == 0;
							}
							return false;
						},
						list,
						ai1(button) {
							const player = get.player();
							const cards =
								get
									.event()
									.list?.map(i => i[0])
									.flat() || [];
							const { num } = get.event().getTrigger();
							const { link } = button;
							if (typeof link !== "number") {
								return 0;
							}
							if (link == 1) {
								if (player.isTurnedOver() && cards.some(card => get.suit(card, false) === "heart")) {
									return 2;
								}
								if (cards.length <= num * 2 && game.hasPlayer(current => current != player && current.countCards("h", cardx => !cards?.includes(cardx)) > cards.length && get.attitude(player, current) < 0)) {
									return 2;
								}
							}
							if (link == 0 && cards.some(card => get.suit(card, false) === "heart")) {
								return 1;
							}
							return 1;
						},
						ai2(target) {
							if (ui.selected.buttons[0].link == 0) {
								return 1;
							}
							const player = get.player();
							const cards =
								get
									.event()
									.list?.map(i => i[0])
									.flat() || [];
							return -get.attitude(player, target) * target.countCards("h", cardx => !cards?.includes(cardx));
						},
					})
					.forResult();
				if (!result?.links?.length) {
					return;
				}
				const [link] = result.links;
				if (link == 0) {
					game.log(player, "选择了", "#g【枯心】", "的", "#y选项一");
					gains = list.flatMap(([cards, target]) => {
						return cards.filter(card => lib.filter.canBeGained(card, target, player));
					});
				} else if (link == 1 && result?.targets?.length) {
					game.log(player, "选择了", "#g【枯心】", "的", "#y选项二");
					const [target] = result.targets;
					player.line(target);
					gains = target.getCards("h", card => !list.flatMap(i => i[0]).includes(card) && lib.filter.canBeGained(card, target, player));
				}
			} else if (game.hasPlayer(target => target != player)) {
				const targets = game.filterPlayer(target => target != player);
				result =
					targets.length == 1
						? { bool: true, targets }
						: await player
								.chooseTarget("枯心：选择一名其他角色获得其未展示的手牌", true, lib.filter.notMe)
								.set("ai", target => {
									const player = get.player();
									return -get.attitude(player, target) * target.countCards("h");
								})
								.forResult();
				if (result?.targets?.length) {
					game.log(player, "选择了", "#g【枯心】", "的", "#y选项二");
					const [target] = result.targets;
					player.line(target);
					gains = target.getCards("h", card => lib.filter.canBeGained(card, target, player));
				}
			}
			if (gains.length) {
				await player.gain(gains, "gain2");
				await player.showCards(gains);
			}
			if (!gains.some(card => get.suit(card, false) === "heart")) {
				if (gains.length) {
					await player.discard(gains);
				}
				await player.turnOver();
			}
		},
		ai: {
			maixie: true,
			maixie_hp: true,
			threaten(player, target) {
				if (target.getHp() == 1) {
					return 2.5;
				}
				return 0.5;
			},
			effect: {
				target(card, player, target) {
					if (
						!target._dekuxin_eff &&
						get.tag(card, "damage") &&
						target.getHp() >
							(player.hasSkillTag("damageBonus", true, {
								card: card,
								target: target,
							})
								? 2
								: 1)
					) {
						if (player.hasSkillTag("jueqing", false, target)) {
							return [1, -2];
						}
						target._dekuxin_eff = true;
						let gain = game.countPlayer(current => {
							if (target == current) {
								return 0;
							}
							if (get.attitude(target, current) > 0) {
								return 0;
							}
							if (current.hasCard(cardx => lib.filter.canBeGained(cardx, target, current, "sxrmkuxin"), "h")) {
								return 0.9;
							}
							return 0;
						});
						if (target.isTurnedOver()) {
							gain += 2.3;
						} else {
							gain -= 2.3;
						}
						delete target._dekuxin_eff;
						return [1, Math.max(0, gain)];
					}
				},
			},
		},
	},
	sxrmsigu: {
		audio: 2,
		enable: "phaseUse",
		filter(event, player) {
			return game.hasPlayer(current => player !== current);
		},
		usable: 1,
		filterTarget: lib.filter.notMe,
		async content(event, trigger, player) {
			const target = event.targets[0];
			const result = await target
				.judge(card => {
					if ([4, 5, 6, 8].includes(get.number(card))) {
						return 2;
					}
					if ([9, 12].includes(get.number(card))) {
						return 1;
					}
					return -1;
				})
				.forResult();
			if (!result?.number) {
				return;
			}
			const name = get.info(event.name).pasts[result.number - 1],
				skill = get.info(event.name).derivation[result.number - 1];
			const mark = `sxrmsigu_${player.playerid}`;
			if (name && skill) {
				game.broadcastAll((player, name) => player.tempname.add(name), target, "sxrm_caocao");
				await target.addAdditionalSkills(mark, [skill], true);
				//写个标记吧
				target.addTip(mark, `似故 ${get.translation(skill)}`);
				//再加个动画
				target.setAvatar(target.name, name);
			} else {
				player.chat("孩子你是谁？");
			}
			await target.damage();
			await target.damage();
			if (name && skill) {
				if (Array.isArray(target.tempname)) {
					game.broadcastAll((player, name) => player.tempname.remove(name), target, "sxrm_caocao");
				}
				target.removeAdditionalSkills(mark);
				target.removeTip(mark);
				target.setAvatar(target.name, target.name);
			}
		},
		ai: {
			order(item, player) {
				return get.order({ name: "sha" }) - 0.1;
			},
			result: {
				target(player, target) {
					let eff = get.damageEffect(target, player, player);
					const att = get.attitude(player, target);
					if (eff <= 0) {
						const numbers = [4, 5, 6, 8, 9, 12];
						if (att > 0 && player.hasSkillTag("rejudge") && target.hp + target.hujia >= 5 && eff >= -2 && player.hasCards("he", card => numbers.includes(get.number(card)))) {
							return 0.1;
						}
						if (eff == 0 && att < 0) {
							return -0.1;
						}
						return 0;
					}
					return (-eff * get.threaten(target)) / Math.sqrt(target.hp + target.hujia + 1) / Math.sqrt(target.countCards("h") + 1);
				},
			},
			tag: {
				damage: 1,
			},
		},
		pasts: ["chengong", "re_xiahoudun", "re_simayi", "re_guojia", "ol_xunyu", "sb_caopi", "jushou", "re_caochong", "re_xunyou", "yangxiu", "chengyu", "xizhicai", "shen_guanyu"],
		derivation: ["zhichi", "reganglie", "refankui", "new_reyiji", "oljieming", "fangzhu", "shibei", "rechengxiang", "zhiyu", "jilei", "benyu", "chouce", "new_wuhun"],
	},
	//刘备
	sxrmchengbian: {
		audio: 2,
		trigger: {
			player: ["phaseZhunbeiBegin", "phaseJieshuBegin"],
		},
		filter(event, player) {
			return game.hasPlayer(current => player.canCompare(current));
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt2(event.skill), (card, player, target) => {
					return player.canCompare(target);
				})
				.set("ai", target => {
					const player = get.player();
					return get.effect(target, { name: "juedou" }, player, player);
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			const next = player.chooseToCompare(target).set("isDelay", true);
			await next;
			await game.delay();
			const card = new lib.element.VCard({ name: "juedou", isCard: true });
			if (player.canUse(card, target)) {
				const next2 = player.useCard(card, target);
				player
					.when({
						player: "useCardAfter",
					})
					.filter(evt => evt === next2)
					.step(async (event, trigger, player) => {
						player.removeSkill("sxrmchengbian_sha");
						target.removeSkill("sxrmchengbian_sha");
						const result = await game.createEvent("chooseToCompare", false).set("player", player).set("parentEvent", next).setContent("chooseToCompareEffect").forResult();
						if (result?.winner) {
							await result.winner.drawTo(result.winner.maxHp);
						}
					});
				player.addTempSkill("sxrmchengbian_sha");
				target.addTempSkill("sxrmchengbian_sha");
				await next2;
				player.removeSkill("sxrmchengbian_sha");
				target.removeSkill("sxrmchengbian_sha");
			}
		},
		subSkill: {
			sha: {
				audio: "sxrmchengbian",
				enable: "chooseToRespond",
				filterCard: true,
				selectCard() {
					const player = get.player(),
						num = Math.ceil(player.countCards("h") / 2);
					return [num, Infinity];
				},
				position: "h",
				viewAs: { name: "sha" },
				viewAsFilter(player) {
					if (!player.countCards("h")) {
						return false;
					}
				},
				prompt: "将至少半数手牌当杀打出",
				allowChooseAll: true,
				check(card) {
					const player = get.player(),
						num = Math.ceil(player.countCards("h") / 2),
						val = get.value(card);
					if (ui.selected.cards.length >= num) {
						return 0;
					}
					return 1 / Math.max(0.1, val);
				},
				ai: {
					skillTagFilter(player) {
						if (!player.countCards("h")) {
							return false;
						}
					},
					respondSha: true,
				},
			},
		},
	},
	//蒋干
	sxrmzongheng: {
		trigger: {
			player: "phaseZhunbeiBegin",
		},
		filter(event, player) {
			return game.countPlayer(current => current.countCards("h") && current != player) > 1;
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt2(event.skill), 2, (card, player, target) => {
					return target.countCards("h") && target != player;
				})
				.set("ai", target => {
					const player = get.player();
					return get.effect(target, { name: "guohe_copy2" }, player, player);
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const targets = event.targets;
			const result = await player
				.chooseButton(["纵横：展示并获得其中一张", `###${get.translation(targets[0])}的手牌###`, targets[0].getCards("h"), `###${get.translation(targets[1])}的手牌###`, targets[1].getCards("h")], true)
				.set("targets", targets)
				.set("ai", button => {
					const { player, targets } = get.event(),
						owner = get.owner(button.link),
						other = targets.find(i => i != owner);
					let eff1 = get.value(button.link),
						eff2 = other ? get.effect(other, { name: "guohe_copy2" }, player, player) : 0;
					if (other) {
						eff2 *= Math.min(
							3,
							other.countCards("h", card => {
								return ["suit", "type2", "number"].some(key => {
									return get[key](card, other) == get[key](button.link, owner);
								});
							})
						);
					}
					return eff1 + eff2;
				})
				.forResult();
			const card = result.links[0],
				owner = get.owner(card),
				other = targets.find(i => i != owner),
				suit = get.suit(card, owner),
				num = get.number(card, owner),
				type = get.type2(card, owner);
			await owner.give(card, player);
			if (other) {
				if (
					!other.countCards("h", cardx => {
						return get.suit(cardx) == suit || get.number(cardx) == num || get.type2(cardx) == type;
					})
				) {
					return;
				}
				const result = await player
					.chooseToMove_new("纵横：弃置符合要求的牌各一张", true)
					.set("list", [
						[get.translation(other) + "的手牌", other.getCards("h")],
						[[`花色为${get.translation(suit)}`], [`点数为${get.translation(num)}`], [`类型为${get.translation(type)}`]],
					])
					.set("filterOk", moved => {
						let list = [null, "suit", "number", "type2"];
						for (let i = 1; i < 4; i++) {
							let key = list[i];
							if (moved[i].some(card => get[key](card) != get.event()[key]) || moved[i].length > 1) {
								return false;
							}
						}
						return moved[1].length + moved[2].length + moved[3].length;
					})
					.set("filterMove", (from, to, moved) => {
						let list = [null, "suit", "number", "type2"];
						if (typeof to == "number") {
							if (to != 0) {
								return moved[to].length < 1 && get[list[to]](from.link) == get.event()[list[to]];
							}
							return true;
						}
						let num1 = [0, 1, 2, 3].find(i => moved[i].includes(from.link)),
							num2 = [0, 1, 2, 3].find(i => moved[i].includes(to.link));
						if (num1 != 0 && get[list[num1]](to.link) != get.event()[list[num1]]) {
							return false;
						}
						if (num2 != 0 && get[list[num2]](from.link) != get.event()[list[num2]]) {
							return false;
						}
						return true;
					})
					.set("processAI", list => {
						let cards = [],
							cardx = list[0][1].slice().sort((a, b) => get.value(b) - get.value(a)),
							discards = [[], [], []],
							keys = ["suit", "number", "type2"];
						for (let i = 0; i < keys.length; i++) {
							let key = keys[i];
							let card = cardx.find(j => !cards.includes(j) && get[key](j) == get.event()[key]);
							if (card) {
								cards.add(card);
								discards[i].add(card);
							}
						}
						return [cardx.removeArray(cards), ...discards];
					})
					.set("suit", suit)
					.set("number", num)
					.set("type2", type)
					.forResult();
				if (result.bool) {
					const cards = result.moved.slice(1).flat();
					await other.modedDiscard(cards, player);
				}
			}
		},
	},
	sxrmduibian: {
		trigger: {
			player: "damageBegin4",
		},
		filter(event, player) {
			if (!event.source || event.source == player) {
				return false;
			}
			if (!player.canCompare(event.source)) {
				return false;
			}
			return (
				game
					.getGlobalHistory(
						"everything",
						evt => {
							return evt.name == "damage" && evt.player == player;
						},
						event
					)
					.indexOf(event) == 0
			);
		},
		logTarget: "source",
		async content(event, trigger, player) {
			const target = event.targets[0];
			const next = player.chooseToCompare(target).set("isDelay", true);
			await next;
			trigger.cancel();
			let bool = get.damageEffect(player, target, target) + get.effect(target, { name: "guohe_copy2" }, player, target) > 0;
			bool = Math.random() > 0.4 ? bool : false;
			const result = await target
				.chooseBool(`对辩：是否令${get.translation(player)}弃置你一张牌，然后揭示拼点结果？`)
				.set("choice", bool)
				.forResult();
			if (result.bool) {
				await player.discardPlayerCard(target, "he", true);
				const result2 = await game.createEvent("chooseToCompare", false).set("player", player).set("parentEvent", next).setContent("chooseToCompareEffect").forResult();
				if (result2?.winner == target) {
					await player.loseHp();
				}
			} else {
				await game.delayx();
			}
		},
	},
	//华佗
	sxrmmiehai: {
		audio: 2,
		enable: "chooseToUse",
		filterCard: true,
		selectCard: 2,
		position: "hes",
		viewAs: {
			name: "sha",
			nature: "stab",
			storage: {
				miehai: true,
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
							if (!evt.getParent(evt => evt == trigger, true, true) || !cards.some(card => get.suit(card) == "spade")) {
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
			if (get.suit(card) == "spade" && player.isDamaged()) {
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
				if (card?.storage?.miehai) {
					return true;
				}
			},
			cardUsable(card, player, num) {
				if (card?.storage?.miehai) {
					return Infinity;
				}
			},
		},
	},
	sxrmqingjun: {
		audio: 2,
		trigger: {
			global: "roundEnd",
		},
		filter(event, player) {
			return game.hasPlayer(current => current != player);
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt2(event.skill), lib.filter.notMe)
				.set("ai", target => {
					const player = get.player();
					let eff = 5 * get.sgnAttitude(player, target);
					let targets = game.filterPlayer(current => {
						return current == player || current.inRange(target);
					});
					for (let targetx of targets) {
						eff += get.effect(targetx, { name: "wuzhong" }, targetx, player);
						eff += get.effect(target, { name: "sha" }, targetx, player);
					}
					return eff;
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const target = event.targets[0],
				targets = game.filterPlayer(current => {
					return current == player || current.inRange(target);
				});
			for (let targetx of targets) {
				await targetx.draw(2);
				let skillName = `${event.name}_${player.playerid}`;
				targetx.addAdditionalSkill(skillName, ["sxrmshefu_effect"], true);
				targetx
					.when({
						global: "phaseEnd",
					})
					.filter(evt => evt.skill == event.name)
					.step(async (event, trigger, player) => {
						player.removeAdditionalSkill(skillName);
						let cards = player.getExpansions("sxrmshefu_effect");
						if (cards.length) {
							await player.loseToDiscardpile(cards);
						}
					});
				if (targetx.countCards("he")) {
					const result = await targetx
						.chooseCard(get.prompt2("sxrmshefu"), "he", true)
						.set("ai", card => {
							let val = get.value(card);
							if (get.type(card) == "basic") {
								val *= 0.5;
							}
							if (get.color(card) == "black") {
								val *= 0.8;
							}
							return 6 - val;
						})
						.forResult();
					if (result.bool) {
						await targetx.useSkill("sxrmshefu", result.cards);
					}
				}
			}
			target
				.when(
					{
						player: "phaseEnd",
					},
					false
				)
				.assign({
					lastDo: true,
				})
				.filter(evt => evt.skill == event.name)
				.step(async (event, trigger, player) => {
					for (let targetx of targets) {
						if (!targetx.getHistory("damage").length) {
							const card = new lib.element.VCard({ name: "sha", isCard: true });
							if (targetx.canUse(card, player, false)) {
								await targetx.useCard(card, player, false);
							}
						}
					}
				})
				.finish();
			target.insertPhase(event.name);
		},
		derivation: "sxrmshefu",
	},
	sxrmshefu: {
		audio: "shefu",
		trigger: { player: "phaseJieshuBegin" },
		filter(event, player) {
			return player.countCards("he");
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseCard(get.prompt2(event.skill), "he")
				.set("ai", card => {
					let val = get.value(card);
					if (get.type(card) == "basic") {
						val *= 0.5;
					}
					if (get.color(card) == "black") {
						val *= 0.8;
					}
					return 6 - val;
				})
				.forResult();
		},
		// 防止【请君】中useSkill('sxrmshefu')出现player.discard(event.cards)的结算，lose: false也可以
		discard: false,
		async content(event, trigger, player) {
			const next = player.addToExpansion(event.cards, player, "giveAuto");
			next.gaintag.add("sxrmshefu_effect");
			await next;
		},
		onremove(player) {
			let cards = player.getExpansions("sxrmshefu_effect");
			if (cards.length) {
				player.loseToDiscardpile(cards);
			}
		},
		group: "sxrmshefu_effect",
		subSkill: {
			effect: {
				trigger: { global: "useCard" },
				filter(event, player) {
					if (_status.currentPhase == player || event.player == player || event.all_excluded) {
						return false;
					}
					return (
						player.getExpansions("sxrmshefu_effect").some(card => {
							return get.color(card) == get.color(event.card) && get.type2(card) == get.type2(event.card);
						}) &&
						event.player.getHistory("lose", function (evt) {
							return (evt.relatedEvent || evt.getParent()) == event && evt.hs && evt.hs.length == event.cards.length;
						}).length
					);
				},
				async cost(event, trigger, player) {
					let effect = 0;
					if (trigger.card.name == "wuxie" || trigger.card.name == "shan") {
						if (get.attitude(player, trigger.player) < -1) {
							effect = -1;
						}
					} else if (trigger.targets?.length) {
						for (let i = 0; i < trigger.targets.length; i++) {
							effect += get.effect(trigger.targets[i], trigger.card, trigger.player, player);
						}
					}
					let str = "设伏：是否令" + get.translation(trigger.player);
					if (trigger.targets && trigger.targets.length) {
						str += "对" + get.translation(trigger.targets);
					}
					str += "使用的" + get.translation(trigger.card) + "失效？";
					const result = await player
						.chooseButton([str, player.getExpansions("sxrmshefu_effect")])
						.set("filterButton", button => {
							const { used } = get.event();
							return get.color(button.link) == get.color(used) && get.type2(button.link) == get.type2(used);
						})
						.set("ai", button => {
							const { choice } = get.event();
							if (choice) {
								return Math.random();
							}
							return 0;
						})
						.set("used", trigger.card)
						.set("choice", effect < 0)
						.forResult();
					event.result = {
						bool: result.bool,
						targets: [trigger.player],
						cards: result.bool ? result.links : [],
					};
				},
				async content(event, trigger, player) {
					await player.loseToDiscardpile(event.cards);
					trigger.targets.length = 0;
					trigger.all_excluded = true;
				},
				ai: {
					threaten: 1.8,
					expose: 0.3,
				},
				intro: {
					mark(dialog, storage, player) {
						var cards = player.getExpansions("sxrmshefu_effect");
						if (player.isUnderControl(true)) {
							dialog.addAuto(cards);
						} else {
							return "共有" + get.cnNumber(cards.length) + "张牌";
						}
					},
					markcount: "expansion",
				},
			},
		},
	},
	//伏寿
	sxrmmitu: {
		audio: 2,
		trigger: {
			player: "phaseZhunbeiBegin",
		},
		filter(event, player) {
			return game.hasPlayer(current => current.isDamaged());
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt2(event.skill), [1, 3], (card, player, target) => {
					return target.isDamaged();
				})
				.set("ai", target => {
					return get.attitude(get.player(), target);
				})
				.forResult();
		},
		async content(event, trigger, player) {
			event.targets.sortBySeat();
			for (const target of event.targets) {
				const next = target.draw();
				next.gaintag.add("sxrmmitu");
				const result = (await next.forResult()).cards;
				if (result?.length) {
					await target.showCards(result, "密图");
					event[target.playerid] = result[0];
				}
				target.addTempSkill("sxrmmitu_ai", "phaseChange");
			}
			for (const target of event.targets) {
				if (!game.hasPlayer(current => target.canCompare(current))) {
					continue;
				}
				const result = await player
					.chooseTarget(
						`为${get.translation(target)}指定拼点目标`,
						(card, player, target) => {
							return get.event().comparer.canCompare(target);
						},
						true
					)
					.set("comparer", target)
					.set("ai", target => {
						const { player, comparer } = get.event();
						return get.effect(target, { name: "sha" }, comparer, player);
					})
					.forResult();
				if (result.bool) {
					const targetx = result.targets[0],
						card = target.getCards("h").find(card => card.hasGaintag("sxrmmitu"));
					let bool = get.attitude(target, player) >= 0 ? get.effect(targetx, { name: "sha" }, target, target) > 0 : false;
					if (card && get.number(card) < 7 && get.attitude(target, player) > 0) {
						bool = false;
					}
					const result2 = await target
						.chooseBool(`是否与${get.translation(targetx)}进行拼点？`, "赢的角色视为对没赢的角色使用一张【杀】")
						.set("choice", bool)
						.forResult();
					if (result2.bool) {
						const result3 = await target.chooseToCompare(targetx).forResult();
						if (result3.winner) {
							const loser = [target, targetx].find(i => i != result3.winner),
								sha = new lib.element.VCard({ name: "sha", isCard: true });
							if (loser && result3.winner.canUse(sha, loser, false)) {
								await result3.winner.useCard(sha, loser, false);
							}
						}
					}
				}
			}
		},
		group: "sxrmmitu_benghuai",
		subSkill: {
			ai: {
				charlotte: true,
				onremove(player) {
					player.removeGaintag("sxrmmitu");
				},
				mod: {
					aiValue: (player, card, num) => {
						let evt = _status.event.getParent("sxrmmitu", true);
						if (!evt || !evt.player || get.attitude(player, evt.player) <= 0) {
							return;
						}
						if (num > 0 && get.itemtype(card) === "card" && card.hasGaintag("sxrmmitu")) {
							return -114514;
						}
					},
				},
			},
			benghuai: {
				trigger: {
					global: "compare",
				},
				getIndex(event, player) {
					const evt = event.getParent("sxrmmitu", true);
					if (!evt) {
						return [];
					}
					return [event.player, event.target].filter(current => {
						if (!evt.targets.includes(current)) {
							return false;
						}
						const card = event[event.player == current ? "card1" : "card2"],
							showed = evt[current.playerid];
						return showed && get.itemtype(showed) == "card" && showed != card;
					});
				},
				logTarget(event, player, name, index) {
					return index;
				},
				forced: true,
				locked: false,
				async content(event, trigger, player) {
					await player.loseMaxHp();
				},
			},
		},
	},
	sxrmqianliu: {
		audio: 2,
		trigger: {
			global: "useCardToTargeted",
		},
		filter(event, player) {
			return get.distance(player, event.target) <= 1 && event.card?.name == "sha";
		},
		frequent: true,
		logTarget: "target",
		async content(event, trigger, player) {
			const cards = get.bottomCards(4);
			await game.cardsGotoOrdering(cards);
			if (cards.map(i => get.suit(i)).toUniqued().length > 3) {
				const result = await player
					.chooseBool(`是否展示并获得${get.translation(cards)}？`)
					.set("frequentSkill", event.name)
					.forResult();
				if (result.bool) {
					await player.showCards(cards);
					await player.gain(cards, "gain2");
					return;
				}
			}
			const result = await player
				.chooseToMove()
				.set("list", [["牌堆顶"], ["牌堆底", cards]])
				.set("prompt", "点击或拖动将牌移动到牌堆顶或牌堆底")
				.set("processAI", list => {
					let cards = list[1][1],
						player = _status.event.player,
						target = _status.currentPhase || player,
						name = _status.event.getTrigger()?.name,
						countWuxie = current => {
							let num = current.getKnownCards(player, card => {
								return get.name(card, current) === "wuxie";
							});
							if (num && current !== player) {
								return num;
							}
							let skills = current.getSkills("invisible").concat(lib.skill.global);
							game.expandSkills(skills);
							for (let i = 0; i < skills.length; i++) {
								let ifo = get.info(skills[i]);
								if (!ifo) {
									continue;
								}
								if (ifo.viewAs && typeof ifo.viewAs != "function" && ifo.viewAs.name == "wuxie") {
									if (!ifo.viewAsFilter || ifo.viewAsFilter(current)) {
										num++;
										break;
									}
								} else {
									let hiddenCard = ifo.hiddenCard;
									if (typeof hiddenCard == "function" && hiddenCard(current, "wuxie")) {
										num++;
										break;
									}
								}
							}
							return num;
						},
						top = [];
					switch (name) {
						case "phaseJieshu": {
							target = target.next;
							cards.sort((a, b) => {
								return get.value(b, target) - get.value(a, target);
							});
							while (cards.length) {
								if (get.value(cards[0], target) > 6) {
									top.push(cards.shift());
								} else {
									break;
								}
							}
							return [top, cards];
						}
						case "phaseZhunbei": {
							let att = get.sgn(get.attitude(player, target)),
								judges = target.getCards("j"),
								needs = 0,
								wuxie = countWuxie(target);
							for (let i = Math.min(cards.length, judges.length) - 1; i >= 0; i--) {
								let j = judges[i],
									cardj = j.viewAs ? { name: j.viewAs, cards: j.cards || [j] } : j;
								if (wuxie > 0 && get.effect(target, j, target, target) < 0) {
									wuxie--;
									continue;
								}
								let judge = get.judge(j);
								cards.sort((a, b) => {
									return (judge(b) - judge(a)) * att;
								});
								if (judge(cards[0]) * att < 0) {
									needs++;
									continue;
								} else {
									top.unshift(cards.shift());
								}
							}
							if (needs > 0 && needs >= judges.length) {
								return [top, cards];
							}
							cards.sort((a, b) => {
								return (get.value(b, target) - get.value(a, target)) * att;
							});
							while (needs--) {
								top.unshift(cards.shift());
							}
							while (cards.length) {
								if (get.value(cards[0], target) > 6 == att > 0) {
									top.push(cards.shift());
								} else {
									break;
								}
							}
							return [top, cards];
						}
						default:
							cards.sort((a, b) => {
								return get.value(b, target) - get.value(a, target);
							});
							while (cards.length) {
								if (get.value(cards[0], target) > 6) {
									top.push(cards.shift());
								} else {
									break;
								}
							}
							return [top, cards];
					}
				})
				.forResult();
			let top = result.moved[0],
				bottom = result.moved[1];
			top.reverse();
			await game.cardsGotoPile(top.concat(bottom), ["top_cards", top], (event, card) => {
				if (event.top_cards.includes(card)) {
					return ui.cardPile.firstChild;
				}
				return null;
			});
			game.addCardKnower(top, player);
			game.addCardKnower(bottom, player);
			player.popup(get.cnNumber(top.length) + "上" + get.cnNumber(bottom.length) + "下");
			game.log(player, "将" + get.cnNumber(top.length) + "张牌置于牌堆顶");
			game.updateRoundNumber();
			await game.delayx();
		},
	},
	//荀彧
	sxrmhuice: {
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return game.hasPlayer(current => player.canCompare(current));
		},
		filterTarget(card, player, target) {
			return player.canCompare(target);
		},
		async content(event, trigger, player) {
			const result1 = await player.chooseToCompare(event.target).forResult();
			if (game.hasPlayer(current => current != event.target && player.canCompare(current))) {
				const result = await player
					.chooseTarget("迴策：与另一名角色进行拼点", true, (card, player, target) => {
						return get.event().first != target && player.canCompare(target);
					})
					.set("first", event.target)
					.set("ai", target => {
						return get.damageEffect(target, get.player());
					})
					.forResult();
				if (!result.bool) {
					return;
				}
				const result2 = await player.chooseToCompare(result.targets[0]).forResult();
				if (result1 && result2) {
					if (result1.winner) {
						for (const target of [player, result.targets[0]]) {
							if (target != result2.winner) {
								result1.winner.line(target, "green");
								await target.damage(result1.winner);
							}
						}
					}
					if (result2.winner) {
						for (const target of [player, event.target]) {
							if (target != result1.winner) {
								result2.winner.line(target, "green");
								await target.damage(result2.winner);
							}
						}
					}
				}
			}
		},
		ai: {
			order: 7,
			result: {
				target: -1,
				player(player, target) {
					const targets = game.filterPlayer(current => {
						return player.canCompare(current) && get.damageEffect(current, current, player) > 0;
					});
					return targets.length > 1 ? 1 : -2;
				},
			},
		},
	},
	sxrmyihe: {
		trigger: {
			global: "damageBegin1",
		},
		filter(event, player) {
			if (player != _status.currentPhase || !event.source) {
				return false;
			}
			let bool1 = get.sgn(event.source.hp - event.source.countCards("h")),
				bool2 = get.sgn(event.player.hp - event.player.countCards("h"));
			return !player.getStorage("sxrmyihe_used").includes(bool1 == bool2);
		},
		forced: true,
		logTarget: "player",
		check(event, player) {
			let bool1 = get.sgn(event.source.hp - event.source.countCards("h")),
				bool2 = get.sgn(event.player.hp - event.player.countCards("h"));
			if (get.attitude(player, event.player) > 0) {
				return bool1 == bool2 && get.attitude(player, event.source) >= 0;
			}
			return bool1 != bool2;
		},
		prompt2(event, player) {
			let bool1 = get.sgn(event.source.hp - event.source.countCards("h")),
				bool2 = get.sgn(event.player.hp - event.player.countCards("h"));
			if (bool1 == bool2) {
				return `令其和${get.translation(event.source)}依次摸两张牌`;
			}
			return "令此伤害+1";
		},
		async content(event, trigger, player) {
			let bool1 = get.sgn(trigger.source.hp - trigger.source.countCards("h")),
				bool2 = get.sgn(trigger.player.hp - trigger.player.countCards("h"));
			player.addTempSkill("sxrmyihe_used");
			player.markAuto("sxrmyihe_used", bool1 == bool2);
			if (bool1 == bool2) {
				await trigger.player.draw(2);
				await trigger.source.draw(2);
			} else {
				trigger.num++;
			}
		},
		subSkill: {
			used: {
				charlotte: true,
				onremove: true,
			},
		},
	},
	sxrmjizhi: {
		trigger: {
			player: "dying",
		},
		filter(event, player) {
			if (
				game
					.getGlobalHistory(
						"everything",
						evt => {
							return evt.name == "dying" && evt.player == player;
						},
						event
					)
					.indexOf(event) != 0
			) {
				return false;
			}
			return player.hp <= 0;
		},
		forced: true,
		async content(event, trigger, player) {
			await player.recover();
		},
		mod: {
			targetEnabled(card, player, target) {
				if (card.name == "tao" && target != player) {
					return false;
				}
			},
		},
	},
	//曹丕
	sxrmzhengsi: {
		enable: "phaseUse",
		filterTarget(card, player, target) {
			if (ui.selected.targets.length > 1 && !ui.selected.targets.includes(player)) {
				if (target != player) {
					return false;
				}
			}
			return target.countCards("h");
		},
		selectTarget: 3,
		complexSelect: true,
		targetprompt: ["首先展示", "随后展示"],
		multitarget: true,
		multiline: true,
		async content(event, trigger, player) {
			const target = event.targets[0],
				targets = event.targets.slice(0).remove(target);
			const result = await target
				.chooseCard("争嗣：展示一张手牌", true, "h")
				.set("ai", card => {
					return 10 - Math.abs(7 - get.number(card));
				})
				.forResult();
			if (!result.bool) {
				return;
			}
			let cards = result.cards.slice(0, 1);
			await target.showCards(result.cards);
			const next = player.chooseCardOL(targets, "h", true, "争嗣：展示一张手牌");
			next._args.remove("glow_result");
			const result2 = await next.forResult();
			if (!result2) {
				return;
			}
			await targets[0].showCards(result2[0].cards);
			await targets[1].showCards(result2[1].cards);
			await game.delayx();
			cards.addArray(result2[0].cards).addArray(result2[1].cards);
			const targetx = [target, ...targets];
			game.log(cards, targetx);
			let max = cards.map(i => get.number(i)).maxBy(i => i),
				min = cards.map(i => get.number(i)).minBy(i => i);
			for (let i = 0; i < cards.length; i++) {
				if (get.number(cards[i]) == max) {
					await targetx[i].chooseToDiscard(2, true, "h");
				}
			}
			for (let i = 0; i < cards.length; i++) {
				if (get.number(cards[i]) == min) {
					await targetx[i].loseHp();
				}
			}
		},
		ai: {
			order: 3,
			result: {
				target(player, target) {
					if (target == player) {
						return 0.1;
					}
					return -2;
				},
				player(player, target) {
					if (player.hp > 2 && player.countCards("h") > 2) {
						return 1;
					}
					return 0;
				},
			},
		},
	},
	sxrmchengming: {
		trigger: {
			player: "phaseUseEnd",
		},
		getIndex(event, player) {
			let targets = [],
				bool = false;
			game.filterPlayer(current => {
				current.checkHistory("useSkill", evt => {
					if (evt.skill != "sxrmzhengsi" || evt?.event?.getParent("phaseUse") != event) {
						return false;
					}
					if (current == player) {
						bool = true;
					}
					targets.addArray(evt.targets || []);
				});
			});
			let result = [];
			if (bool && player.countCards("h") == targets.map(i => i.countCards("h")).maxBy(i => i)) {
				result.push("recover");
			}
			if (bool && player.hp == targets.map(i => i.hp).maxBy(i => i)) {
				result.push(targets.filter(i => i != player));
			}
			return result;
		},
		filter(event, player, name, data) {
			if (data == "recover") {
				return player.isDamaged();
			}
			return data.some(i => i != player && i.countGainableCards(player, "he"));
		},
		logTarget(event, player, name, data) {
			if (data == "recover") {
				return player;
			}
			return data;
		},
		prompt2(event, player, name, data) {
			if (data == "recover") {
				return "回复2点体力";
			}
			return `获得这些角色各一张牌`;
		},
		async content(event, trigger, player) {
			const data = event.indexedData;
			if (data == "recover") {
				await player.recover(2);
			} else {
				await player.gainMultiple(event.targets, "he");
			}
		},
		ai: {
			combo: "sxrmzhengsi",
		},
	},
	//王垕
	sxrmjugu: {
		trigger: {
			player: "phaseZhunbeiBegin",
		},
		filter(event, player) {
			return game.hasPlayer(current => current.countCards("he"));
		},
		async cost(event, trigger, player) {
			const lose_list = [],
				selected = [];
			let forced = false;
			do {
				const result = await player
					.chooseTarget(forced ? "聚谷：是否继续选择牌？" : get.prompt2(event.skill))
					.set("filterTarget", (card, player, target) => {
						const { selected, lose_list: list } = get.event(),
							num = list.map(i => i[0]).indexOf(target);
						if (num != -1) {
							target.prompt(`已选择 ${list[num][1].length}张`);
						}
						return target.countCards("he", card => !selected.includes(card));
					})
					.set("lose_list", lose_list)
					.set("selected", selected)
					.set("ai", target => {
						const { player, selected } = get.event();
						if (selected.length >= 3) {
							return 0;
						}
						return get.effect(target, { name: "guohe_copy2" }, player, player);
					})
					.forResult();
				if (!result.bool) {
					break;
				}
				forced = true;
				const target = result.targets[0],
					num = lose_list.map(i => i[0]).indexOf(target);
				const result2 = await player
					.choosePlayerCard(target, "he", [1, 5 - selected.length], true, "选择要明置于牌堆顶的牌")
					.set("filterButton", button => {
						return !get.event().selected.includes(button.link);
					})
					.set("selected", selected)
					.set("ai", button => {
						const { player, selected } = get.event();
						if (selected.length + ui.selected.buttons.length >= 3) {
							return 0;
						}
						return get.buttonValue(button);
					})
					.forResult();
				if (!result2.bool) {
					break;
				}
				const cards = result2.links;
				if (num != -1) {
					lose_list[num][1].addArray(cards);
				} else {
					lose_list.add([target, cards]);
				}
				selected.addArray(cards);
			} while (selected.length < 5);
			event.result = {
				bool: forced,
				targets: lose_list.map(i => i[0]),
				cards: selected,
				cost_data: lose_list,
			};
		},
		async content(event, trigger, player) {
			let cards = event.cards;
			while (cards.length) {
				const card = cards.shift(),
					owner = get.owner(card);
				owner.$throw(card, 1000);
				game.log(player, "将", owner, "的", card, "置于了牌堆顶");
				await owner.lose([card], ui.cardPile, "insert", "visible");
				if (!trigger.getParent().jugu) {
					trigger.getParent().jugu = [];
				}
				trigger.getParent().jugu.push([owner, card]);
			}
			game.addGlobalSkill("sxrmjugu_log");
		},
		group: "sxrmjugu_return",
		subSkill: {
			return: {
				trigger: {
					player: "phaseEnd",
				},
				filter(event, player) {
					return event?.jugu?.length;
				},
				forced: true,
				locked: false,
				async content(event, trigger, player) {
					for (let i of trigger.jugu) {
						let card = get.cardPile2(card => card == i[1]);
						if (card) {
							await i[0].gain(card, "gain2");
						}
					}
					const targets = trigger.jugu
						.map(i => i[0])
						.filter(i => i.isIn())
						.toUniqued();
					if (targets.length) {
						await game.asyncDraw(targets);
					}
				},
			},
			log: {
				charlotte: true,
				direct: true,
				trigger: {
					player: "gainAfter",
					global: "loseAsyncAfter",
				},
				filter(event, player) {
					if (!event.getg || !event.getg(player).length || event.getParent("sxrmjugu_return", true)) {
						return false;
					}
					let evt = event.getParent("phase", true);
					return evt?.jugu?.map(i => i[1]).some(i => event.getg(player).includes(i));
				},
				async content(event, trigger, player) {
					let evt = trigger.getParent("phase", true),
						cards = trigger.getg(player),
						log = [];
					for (let i = evt.jugu.length - 1; i >= 0; i--) {
						if (cards.includes(evt.jugu[i][1])) {
							log.add(evt.jugu[i][1]);
							//evt.jugu.splice(i, 1);
						}
					}
					if (!trigger.visible) {
						game.log(player, "获得的牌中有明置牌", log);
					}
				},
			},
		},
	},
};

export default skills;
