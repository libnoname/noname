import { lib, game, ui, get, ai, _status } from "noname";

export const type = "card";

/** @type { importCardConfig } */
export default {
	name: "standard",
	connect: true,
	card: {
		damage: {
			ai: {
				result: {
					target: -1.5,
				},
				tag: {
					damage: 1,
				},
			},
		},
		draw: {
			ai: {
				result: {
					target: 1,
				},
				tag: {
					draw: 1,
				},
			},
		},
		losehp: {
			ai: {
				result: {
					target: -1.5,
				},
				tag: {
					loseHp: 1,
				},
			},
		},
		recover: {
			ai: {
				result: {
					target: 1.5,
				},
				tag: {
					recover: 1,
				},
			},
		},
		firedamage: {
			ai: {
				result: {
					target: -1.5,
				},
				tag: {
					damage: 1,
					fireDamage: 1,
					natureDamage: 1,
				},
			},
		},
		thunderdamage: {
			ai: {
				result: {
					target: -1.5,
				},
				tag: {
					damage: 1,
					thunderDamage: 1,
					natureDamage: 1,
				},
			},
		},
		icedamage: {
			ai: {
				result: {
					target: -1.5,
				},
				tag: {
					damage: 1,
					iceDamage: 1,
					natureDamage: 1,
				},
			},
		},
		respondShan: {
			ai: {
				result: {
					target: -1.5,
				},
				tag: {
					respond: 1,
					respondShan: 1,
					damage: 1,
				},
			},
		},
		sha: {
			audio: true,
			fullskin: true,
			nature: ["thunder", "fire", "kami", "ice"],
			type: "basic",
			enable: true,
			usable: 1,
			updateUsable: "phaseUse",
			global: "icesha_skill",
			range(card, player, target) {
				return player.inRange(target);
			},
			selectTarget: 1,
			cardPrompt(card) {
				const natures = get.natureList(Array.isArray(card) ? card[3] : card);
				const natureInfo = lib.translate[`sha_nature_${natures[0]}_info`];
				if (natureInfo) {
					return natureInfo;
				}
				let str = "出牌阶段，对你攻击范围内的一名角色使用。其须使用一张【闪】，";
				if (natures.includes("stab")) {
					str += "且在此之后需弃置一张手牌（没有则不弃），";
				}
				str += "否则你对其造成1点";
				const linked = lib.linked.filter(n => natures.includes(n));
				if (linked.length) {
					str += `${get.translation(get.nature(linked))}属性`;
				}
				str += "伤害。";
				return str;
			},
			defaultYingbianEffect: "add",
			filterTarget(card, player, target) {
				return player !== target;
			},
			async content(event, trigger, player) {
				const { target } = event;
				const triggerWithFallback = async (name, result) => {
					const next = event.trigger(name);
					if (!next) {
						return result;
					}
					event._result = result;
					await next;
					return event._result;
				};
				const damageTarget = async () => {
					if (!event.directHit && !event.directHit2 && lib.filter.cardEnabled(new lib.element.VCard({ name: "shan" }), target, "forceEnable") && target.countCards("hs") > 0 && get.damageEffect(target, player, target) < 0) {
						target.addGaintag(target.getCards("hs"), "sha_notshan");
					}
					await target.damage(get.nature(event.card));
					event.result = { bool: true };
					await event.trigger("shaDamage");
				};
				const setUnhurtResult = async () => {
					event.result = { bool: false };
					await event.trigger("shaUnhirt");
				};
				const isShaned = result => result?.bool && result.result === "shaned";
				const chooseShan = async () => {
					if (event.directHit || event.directHit2 || (!_status.connectMode && lib.config.skip_shan && !target.hasShan())) {
						return { bool: false };
					}
					if (event.skipShan) {
						return { bool: true, result: "shaned" };
					}
					const next = target.chooseToUse("请使用一张闪响应杀");
					next.set("type", "respondShan");
					next.set("filterCard", (card, player) => {
						if (get.name(card) !== "shan") {
							return false;
						}
						return lib.filter.cardEnabled(card, player, "forceEnable");
					});
					if (event.shanRequired > 1) {
						next.set("prompt2", `（共需使用${event.shanRequired}张闪）`);
					} else if (game.hasNature(event.card, "stab")) {
						next.set("prompt2", "（在此之后仍需弃置一张手牌）");
					}
					next.set("ai1", card => {
						if (get.event().toUse) {
							return get.order(card);
						}
						return 0;
					}).set("shanRequired", event.shanRequired);
					next.set("respondTo", [player, event.card]);
					next.set(
						"toUse",
						(() => {
							if (target.hasSkillTag("noShan", null, "use")) {
								return false;
							}
							if (target.hasSkillTag("useShan", null, "use")) {
								return true;
							}
							if (
								target.isLinked() &&
								game.hasNature(event.card) &&
								game.hasPlayer(cur => {
									if (cur === target || !cur.isLinked()) {
										return false;
									}
									return true; //return get.attitude(target, cur) <= 0;
								})
							) {
								if (get.attitude(target, player._trueMe || player) > 0) {
									return false;
								}
							}
							if (event.baseDamage + event.extraDamage <= 0 && !game.hasNature(event.card, "ice")) {
								return false;
							}
							if (!game.hasNature(event.card, "ice") && !player.hasSkillTag("jueqing", false, target) && !target.hasSkill("gangzhi") && get.damageEffect(target, player, target, get.nature(event.card)) >= 0) {
								return false;
							}
							if (event.baseDamage + event.extraDamage >= target.hp + (player.hasSkillTag("jueqing", false, target) || target.hasSkill("gangzhi") ? 0 : target.hujia)) {
								return true;
							}
							if (
								event.shanRequired > 1 &&
								!target.hasSkillTag("freeShan", null, {
									player: player,
									card: event.card,
									type: "use",
								}) &&
								target.mayHaveShan(target, "use", true, "count") < event.shanRequired - (event.shanIgnored || 0)
							) {
								return false;
							}
							return true;
						})()
					);
					return next.forResult();
				};
				if (typeof event.shanRequired !== "number" || !event.shanRequired || event.shanRequired < 0) {
					event.shanRequired = 1;
				}
				if (typeof event.baseDamage !== "number") {
					event.baseDamage = 1;
				}
				if (typeof event.extraDamage !== "number") {
					event.extraDamage = 0;
				}
				let result;
				while (true) {
					result = await chooseShan();
					if (!isShaned(result)) {
						result = await triggerWithFallback("shaHit", result);
						break;
					}
					event.shanRequired--;
					event.responded = result;
					if (event.shanRequired > 0) {
						continue;
					}
					if (game.hasNature(event.card, "stab") && target.countCards("h") > 0) {
						const discardResult = await target
							.chooseToDiscard("刺杀：请弃置一张牌，否则此【杀】依然造成伤害")
							.set("ai", card => {
								const target = _status.event.player;
								const evt = _status.event.getParent();
								if (get.damageEffect(target, evt.player, target, evt.card.nature) >= 0) {
									return 0;
								}
								return 8 - get.useful(card);
							})
							.forResult();
						if ((!discardResult || !discardResult.bool) && !event.unhurt) {
							await damageTarget();
							return;
						}
						result = await triggerWithFallback("shaMiss", discardResult);
						if ((!result || !result.bool) && !event.unhurt) {
							await damageTarget();
						} else {
							await setUnhurtResult();
						}
						return;
					} else {
						result = await triggerWithFallback("shaMiss", result);
					}
					break;
				}
				if (!isShaned(result) && !event.unhurt) {
					await damageTarget();
					return;
				}
				await setUnhurtResult();
			},
			ai: {
				yingbian(card, player, targets, viewer) {
					if (get.attitude(viewer, player) <= 0) {
						return 0;
					}
					let base = 0;
					let hit = false;
					if (get.cardtag(card, "yingbian_hit")) {
						hit = true;
						if (
							targets.some(target => {
								return target.mayHaveShan(viewer, "use") && get.attitude(viewer, target) < 0 && get.damageEffect(target, player, viewer, get.natureList(card)) > 0;
							})
						) {
							base += 5;
						}
					}
					if (get.cardtag(card, "yingbian_add")) {
						if (game.hasPlayer(current => !targets.includes(current) && lib.filter.targetEnabled2(card, player, current) && get.effect(current, card, player, player) > 0)) {
							base += 5;
						}
					}
					if (get.cardtag(card, "yingbian_damage")) {
						if (
							targets.some(target => {
								return (
									get.attitude(player, target) < 0 &&
									(hit ||
										!target.mayHaveShan(viewer, "use") ||
										player.hasSkillTag(
											"directHit_ai",
											true,
											{
												target: target,
												card: card,
											},
											true
										)) &&
									!target.hasSkillTag("filterDamage", null, {
										player: player,
										card: card,
										jiu: true,
									})
								);
							})
						) {
							base += 5;
						}
					}
					return base;
				},
				canLink(player, target, card) {
					if (!target.isLinked() && !player.hasSkill("wutiesuolian_skill")) {
						return false;
					}
					if (player.hasSkill("jueqing") || player.hasSkill("gangzhi") || target.hasSkill("gangzhi")) {
						return false;
					}
					let obj = {};
					if (get.attitude(player, target) > 0 && get.attitude(target, player) > 0) {
						if (
							(player.hasSkill("jiu") ||
								player.hasSkillTag("damageBonus", true, {
									target: target,
									card: card,
								})) &&
							!target.hasSkillTag("filterDamage", null, {
								player: player,
								card: card,
								jiu: player.hasSkill("jiu"),
							})
						) {
							obj.num = 2;
						}
						if (target.hp > obj.num) {
							obj.odds = 1;
						}
					}
					if (!obj.odds) {
						obj.odds = 1 - target.mayHaveShan(player, "use", true, "odds");
					}
					return obj;
				},
				basic: {
					useful: [5, 3, 1],
					value: [5, 3, 1],
				},
				order(item, player) {
					let res = 3.2;
					if (player.hasSkillTag("presha", true, null, true)) {
						res = 10;
					}
					if (typeof item !== "object" || !game.hasNature(item, "linked") || game.countPlayer(cur => cur.isLinked()) < 2) {
						return res;
					}
					//let used = player.getCardUsable('sha') - 1.5, natures = ['thunder', 'fire', 'ice', 'kami'];
					let uv = player.getUseValue(item, true);
					if (uv <= 0) {
						return res;
					}
					let temp = player.getUseValue("sha", true) - uv;
					if (temp < 0) {
						return res + 0.15;
					}
					if (temp > 0) {
						return res - 0.15;
					}
					return res;
				},
				result: {
					target(player, target, card, isLink) {
						let eff = -1.5;
						let odds = 1.35;
						let num = 1;
						if (isLink) {
							eff = isLink.eff || -2;
							odds = isLink.odds || 0.65;
							num = isLink.num || 1;
							if (
								num > 1 &&
								target.hasSkillTag("filterDamage", null, {
									player: player,
									card: card,
									jiu: player.hasSkill("jiu"),
								})
							) {
								num = 1;
							}
							return odds * eff * num;
						}
						if (
							player.hasSkill("jiu") ||
							player.hasSkillTag("damageBonus", true, {
								target: target,
								card: card,
							})
						) {
							if (
								target.hasSkillTag("filterDamage", null, {
									player: player,
									card: card,
									jiu: player.hasSkill("jiu"),
								})
							) {
								eff = -0.5;
							} else {
								num = 2;
								if (get.attitude(player, target) > 0) {
									eff = -7;
								} else {
									eff = -4;
								}
							}
						}
						if (
							!player.hasSkillTag(
								"directHit_ai",
								true,
								{
									target: target,
									card: card,
								},
								true
							)
						) {
							odds -= 0.7 * target.mayHaveShan(player, "use", true, "odds");
						}
						_status.event.putTempCache("sha_result", "eff", {
							bool: target.hp > num && get.attitude(player, target) > 0,
							card: ai.getCacheKey(card, true),
							eff: eff,
							odds: odds,
						});
						return odds * eff;
					},
				},
				tag: {
					respond: 1,
					respondShan: 1,
					damage(card) {
						if (game.hasNature(card, "poison")) {
							return;
						}
						return 1;
					},
					natureDamage(card) {
						if (game.hasNature(card, "linked")) {
							return 1;
						}
					},
					fireDamage(card, nature) {
						if (game.hasNature(card, "fire")) {
							return 1;
						}
					},
					thunderDamage(card, nature) {
						if (game.hasNature(card, "thunder")) {
							return 1;
						}
					},
					poisonDamage(card, nature) {
						if (game.hasNature(card, "poison")) {
							return 1;
						}
					},
				},
			},
		},
		shacopy: {
			ai: {
				basic: {
					useful: [5, 3, 1],
					value: [5, 3, 1],
				},
				order: 3,
				result: {
					target: -1.5,
				},
				tag: {
					respond: 1,
					respondShan: 1,
					damage(card) {
						if (game.hasNature(card, "poison")) {
							return;
						}
						return 1;
					},
					natureDamage(card) {
						if (game.hasNature(card)) {
							return 1;
						}
					},
					fireDamage(card, nature) {
						if (game.hasNature(card, "fire")) {
							return 1;
						}
					},
					thunderDamage(card, nature) {
						if (game.hasNature(card, "thunder")) {
							return 1;
						}
					},
					poisonDamage(card, nature) {
						if (game.hasNature(card, "poison")) {
							return 1;
						}
					},
				},
			},
		},
		shan: {
			audio: true,
			fullskin: true,
			type: "basic",
			cardcolor: "red",
			notarget: true,
			nodelay: true,
			defaultYingbianEffect: "draw",
			async content(event, trigger, player) {
				event.result = "shaned";
				event.getParent().delayx = false;
				await game.delay(0.5);
			},
			ai: {
				order: 3,
				basic: {
					useful: (card, i) => {
						let player = _status.event.player,
							basic = [7, 5.1, 2],
							num = basic[Math.min(2, i)];
						if (player.hp > 2 && player.hasSkillTag("maixie")) {
							num *= 0.57;
						}
						if (player.hasSkillTag("freeShan", false, null, true) || player.getEquip("rewrite_renwang")) {
							num *= 0.8;
						}
						return num;
					},
					value: [7, 5.1, 2],
				},
				result: { player: 1 },
				//expose:0.2
			},
		},
		tao: {
			fullskin: true,
			type: "basic",
			cardcolor: "red",
			toself: true,
			enable(card, player) {
				return player.isDamaged();
			},
			savable: true,
			selectTarget: -1,
			filterTarget(card, player, target) {
				return target === player && target.isDamaged();
			},
			modTarget(card, player, target) {
				return target.isDamaged();
			},
			async content(event, trigger, player) {
				await event.target.recover();
			},
			ai: {
				basic: {
					order: (card, player) => {
						if (player.hasSkillTag("pretao")) {
							return 9;
						}
						return 2;
					},
					useful: (card, i) => {
						let player = _status.event.player;
						if (!game.checkMod(card, player, "unchanged", "cardEnabled2", player)) {
							return 2 / (1 + i);
						}
						let fs = game.filterPlayer(current => {
								return get.attitude(player, current) > 0 && current.hp <= 2;
							}),
							damaged = 0,
							needs = 0;
						fs.forEach(f => {
							if (f.hp > 3 || !lib.filter.cardSavable(card, player, f)) {
								return;
							}
							if (f.hp > 1) {
								damaged++;
							} else {
								needs++;
							}
						});
						if (needs && damaged) {
							return 5 * needs + 3 * damaged;
						}
						if (needs + damaged > 1 || player.hasSkillTag("maixie")) {
							return 8;
						}
						if (player.hp / player.maxHp < 0.7) {
							return 7 + Math.abs(player.hp / player.maxHp - 0.5);
						}
						if (needs) {
							return 7;
						}
						if (damaged) {
							return Math.max(3, 7.8 - i);
						}
						return Math.max(1, 7.2 - i);
					},
					value: (card, player) => {
						let fs = game.filterPlayer(current => {
								return get.attitude(_status.event.player, current) > 0;
							}),
							damaged = 0,
							needs = 0;
						fs.forEach(f => {
							if (!player.canUse("tao", f)) {
								return;
							}
							if (f.hp <= 1) {
								needs++;
							} else if (f.hp === 2) {
								damaged++;
							}
						});
						if ((needs && damaged) || player.hasSkillTag("maixie")) {
							return Math.max(9, 5 * needs + 3 * damaged);
						}
						if (needs || damaged > 1) {
							return 8;
						}
						if (damaged) {
							return 7.5;
						}
						return Math.max(5, 9.2 - player.hp);
					},
				},
				result: {
					target: (player, target) => {
						if (target.hasSkillTag("maixie")) {
							return 3;
						}
						return 2;
					},
					target_use: (player, target, card) => {
						let mode = get.mode(),
							taos = player.getCards("hs", i => get.name(i) === "tao" && lib.filter.cardEnabled(i, target, "forceEnable"));
						if (target !== _status.event.dying) {
							if (
								!player.isPhaseUsing() ||
								player.needsToDiscard(0, (i, player) => {
									return !player.canIgnoreHandcard(i) && taos.includes(i);
								}) ||
								player.hasSkillTag(
									"nokeep",
									true,
									{
										card: card,
										target: target,
									},
									true
								)
							) {
								return 2;
							}
							let min = 8.1 - (4.5 * player.hp) / player.maxHp,
								nd = player.needsToDiscard(0, (i, player) => {
									return !player.canIgnoreHandcard(i) && (taos.includes(i) || get.value(i) >= min);
								}),
								keep = nd ? 0 : 2;
							if (nd > 2 || (taos.length > 1 && (nd > 1 || (nd && player.hp < 1 + taos.length))) || (target.identity === "zhu" && (nd || target.hp < 3) && (mode === "identity" || mode === "versus" || mode === "chess")) || !player.hasFriend()) {
								return 2;
							}
							if (
								game.hasPlayer(current => {
									return player !== current && current.identity === "zhu" && current.hp < 3 && (mode === "identity" || mode === "versus" || mode === "chess") && get.attitude(player, current) > 0;
								})
							) {
								keep = 3;
							} else if (nd === 2 || player.hp < 2) {
								return 2;
							}
							if (nd === 2 && player.hp <= 1) {
								return 2;
							}
							if (keep === 3) {
								return 0;
							}
							if (taos.length <= player.hp / 2) {
								keep = 1;
							}
							if (
								keep &&
								game.countPlayer(current => {
									if (player !== current && current.hp < 3 && player.hp > current.hp && get.attitude(player, current) > 2) {
										keep += player.hp - current.hp;
										return true;
									}
									return false;
								})
							) {
								if (keep > 2) {
									return 0;
								}
							}
							return 2;
						}
						if (target.isZhu2() || target === game.boss) {
							return 2;
						}
						if (player !== target) {
							if (target.hp < 0 && taos.length + target.hp <= 0) {
								return 0;
							}
							if (Math.abs(get.attitude(player, target)) < 1) {
								return 0;
							}
						}
						if (!player.getFriends().length) {
							return 2;
						}
						let tri = _status.event.getTrigger(),
							num = game.countPlayer(current => {
								if (get.attitude(current, target) > 0) {
									return current.countCards("hs", i => get.name(i) === "tao" && lib.filter.cardEnabled(i, target, "forceEnable"));
								}
							}),
							dis = 1,
							t = _status.currentPhase || game.me;
						while (t !== target) {
							let att = get.attitude(player, t);
							if (att < -2) {
								dis++;
							} else if (att < 1) {
								dis += 0.45;
							}
							t = t.next;
						}
						if (mode === "identity") {
							if (tri && tri.name === "dying") {
								if (target.identity === "fan") {
									if ((!tri.source && player !== target) || (tri.source && tri.source !== target && player.getFriends().includes(tri.source.identity))) {
										if (num > dis || (player === target && player.countCards("hs", { type: "basic" }) > 1.6 * dis)) {
											return 2;
										}
										return 0;
									}
								} else if (tri.source && tri.source.isZhu && (target.identity === "zhong" || target.identity === "mingzhong") && (tri.source.countCards("he") > 2 || (player === tri.source && player.hasCard(i => i.name !== "tao", "he")))) {
									return 2;
								}
								//if(player!==target&&!target.isZhu&&target.countCards('hs')<dis) return 0;
							}
							if (player.identity === "zhu") {
								if (
									player.hp <= 1 &&
									player !== target &&
									taos + player.countCards("hs", "jiu") <=
										Math.min(
											dis,
											game.countPlayer(current => {
												return current.identity === "fan";
											})
										)
								) {
									return 0;
								}
							}
						} else if (mode === "stone" && target.isMin() && player !== target && tri && tri.name === "dying" && player.side === target.side && tri.source !== target.getEnemy()) {
							return 0;
						}
						return 2;
					},
				},
				tag: {
					recover: 1,
					save: 1,
				},
			},
		},
		bagua: {
			fullskin: true,
			type: "equip",
			subtype: "equip2",
			bingzhu: ["诸葛亮", "黄月英", "黄承彦"],
			ai: {
				basic: {
					equipValue: 7.5,
				},
			},
			skills: ["bagua_skill"],
		},
		jueying: {
			fullskin: true,
			type: "equip",
			subtype: "equip3",
			bingzhu: ["曹操"],
			distance: { globalTo: 1 },
			battleOfWancheng() {
				// 宛城之战
				if (get.mode() !== "doudizhu") {
					return false;
				}
				const date = new Date();
				if (date.getMonth() !== 6) {
					return false;
				}
				let day = date.getDate();
				if (day === 5) {
					return date.getHours() >= 8;
				}
				return day > 5 && day < 22;
			},
			global: "jueying_wancheng",
		},
		dilu: {
			fullskin: true,
			type: "equip",
			subtype: "equip3",
			bingzhu: ["刘备"],
			distance: { globalTo: 1 },
		},
		zhuahuang: {
			fullskin: true,
			type: "equip",
			subtype: "equip3",
			bingzhu: ["曹操"],
			distance: { globalTo: 1 },
		},
		chitu: {
			fullskin: true,
			type: "equip",
			subtype: "equip4",
			bingzhu: ["吕布", "关羽"],
			distance: { globalFrom: -1 },
		},
		dawan: {
			fullskin: true,
			type: "equip",
			subtype: "equip4",
			bingzhu: ["曹操"],
			distance: { globalFrom: -1 },
		},
		zixin: {
			fullskin: true,
			type: "equip",
			subtype: "equip4",
			bingzhu: ["曹操"],
			distance: { globalFrom: -1 },
		},
		zhuge: {
			fullskin: true,
			type: "equip",
			subtype: "equip1",
			bingzhu: ["诸葛亮", "马钧"],
			ai: {
				order() {
					return get.order({ name: "sha" }) - 0.1;
				},
				equipValue(card, player) {
					if (player._zhuge_temp) {
						return 1;
					}
					player._zhuge_temp = true;
					const result = (() => {
						if (!game.hasPlayer(current => get.distance(player, current) <= 1 && player.canUse("sha", current) && get.effect(current, { name: "sha" }, player, player) > 0)) {
							return 1;
						}
						if (player.hasSha() && _status.currentPhase === player) {
							if ((player.getEquip("zhuge") && player.countUsed("sha")) || player.getCardUsable("sha") === 0) {
								return 10;
							}
						}
						const num = player.countCards("h", "sha");
						if (num > 1) {
							return 6 + num;
						}
						return 3 + num;
					})();
					delete player._zhuge_temp;
					return result;
				},
				basic: {
					equipValue: 5,
				},
				tag: {
					valueswap: 1,
				},
			},
			skills: ["zhuge_skill"],
		},
		cixiong: {
			fullskin: true,
			type: "equip",
			subtype: "equip1",
			bingzhu: ["刘备"],
			distance: { attackFrom: -1 },
			ai: {
				basic: {
					equipValue: 2,
				},
			},
			skills: ["cixiong_skill"],
		},
		qinggang: {
			fullskin: true,
			type: "equip",
			subtype: "equip1",
			bingzhu: ["赵云", "曹操"],
			distance: { attackFrom: -1 },
			ai: {
				basic: {
					equipValue: 2,
				},
			},
			skills: ["qinggang_skill"],
		},
		qinglong: {
			fullskin: true,
			type: "equip",
			subtype: "equip1",
			bingzhu: ["关羽", "关兴", "张苞", "关银屏"],
			distance: { attackFrom: -2 },
			ai: {
				equipValue(card, player) {
					return Math.min(2.5 + player.countCards("h", "sha"), 4);
				},
				basic: {
					equipValue: 3.5,
				},
			},
			skills: ["qinglong_skill", "qinglong_guozhan"],
		},
		zhangba: {
			fullskin: true,
			type: "equip",
			subtype: "equip1",
			bingzhu: ["张飞", "关兴", "张苞", "张星彩"],
			distance: { attackFrom: -2 },
			ai: {
				equipValue(card, player) {
					const num = 2.5 + player.countCards("h") / 3;
					return Math.min(num, 4);
				},
				basic: {
					equipValue: 3.5,
				},
			},
			skills: ["zhangba_skill"],
		},
		guanshi: {
			fullskin: true,
			type: "equip",
			subtype: "equip1",
			bingzhu: ["徐晃"],
			distance: { attackFrom: -2 },
			ai: {
				equipValue(card, player) {
					const num = 2.5 + player.countCards("he") / 2.5;
					return Math.min(num, 5);
				},
				basic: {
					equipValue: 4.5,
				},
			},
			skills: ["guanshi_skill"],
		},
		fangtian: {
			fullskin: true,
			type: "equip",
			subtype: "equip1",
			bingzhu: ["吕布"],
			distance: { attackFrom: -3 },
			ai: {
				basic: {
					equipValue: 2.5,
				},
			},
			skills: ["fangtian_skill", "fangtian_guozhan"],
		},
		qilin: {
			fullskin: true,
			type: "equip",
			subtype: "equip1",
			bingzhu: ["吕布"],
			distance: { attackFrom: -4 },
			ai: {
				basic: {
					equipValue: 3,
				},
			},
			skills: ["qilin_skill"],
		},
		wugu: {
			audio: true,
			fullskin: true,
			type: "trick",
			enable: true,
			cardcolor: "red",
			selectTarget: -1,
			filterTarget: true,
			async contentBefore(event, trigger, player) {
				const card = event.card;
				const targets = event.targets;
				if (!targets.length) {
					return;
				}
				if (card.storage?.chooseDirection || get.is.versus()) {
					const result = await player
						.chooseControl("顺时针", "逆时针", (event, player) => {
							if ((get.event().isVersus && player.next.side === player.side) || get.attitude(player, player.next) > get.attitude(player, player.previous)) {
								return "逆时针";
							}
							return "顺时针";
						})
						.set("prompt", `选择${get.translation(card)}的结算方向`)
						.set("isVersus", get.is.versus())
						.forResult();
					if (result && result.control === "顺时针") {
						const evt = event.getParent();
						const sorter = _status.currentPhase || player;
						evt.fixedSeat = true;
						evt.targets.sortBySeat(sorter);
						evt.targets.reverse();
						if (evt.targets[evt.targets.length - 1] === sorter) {
							evt.targets.unshift(evt.targets.pop());
						}
					}
				}
				ui.clear();
				let cards;
				const nextEvents = [];
				if (get.itemtype(card.storage?.fixedShownCards) === "cards") {
					cards = card.storage.fixedShownCards.slice();
					const lose_list = [];
					const cards2 = [];
					cards.forEach(cardx => {
						const owner = get.owner(cardx);
						if (owner) {
							const arr = lose_list.find(i => i[0] === owner);
							if (arr) {
								arr[1].push(cardx);
							} else {
								lose_list.push([owner, [cardx]]);
							}
						} else {
							cards2.add(cardx);
						}
					});
					if (lose_list.length) {
						lose_list.forEach(list => {
							list[0].$throw(list[1]);
							game.log(list[0], "将", list[1], "置于了处理区");
						});
						const loseEvent = game
							.loseAsync({
								lose_list: lose_list,
								visible: true,
								relatedEvent: event.getParent(),
							})
							.setContent("chooseToCompareLose");
						nextEvents.push(loseEvent);
					}
					if (cards2.length) {
						const orderingEvent = game.cardsGotoOrdering(cards2);
						orderingEvent.relatedEvent = event.getParent();
						nextEvents.push(orderingEvent);
					}
					nextEvents.push(game.delayex());
				} else {
					let num = event.targets?.length ?? game.countPlayer();
					if (typeof card.storage?.extraCardsNum === "number") {
						num += card.storage.extraCardsNum;
					}
					cards = get.cards(num);
					const orderingEvent = game.cardsGotoOrdering(cards);
					orderingEvent.relatedEvent = event.getParent();
					nextEvents.push(orderingEvent);
				}
				const dialog = ui.create.dialog("五谷丰登", cards, true);
				_status.dieClose.push(dialog);
				dialog.videoId = lib.status.videoId++;
				game.addVideo("cardDialog", null, ["五谷丰登", get.cardsInfo(cards), dialog.videoId]);
				event.getParent().preResult = dialog.videoId;
				game.broadcast(
					(cards, id) => {
						const dialog = ui.create.dialog("五谷丰登", cards, true);
						_status.dieClose.push(dialog);
						dialog.videoId = id;
					},
					cards,
					dialog.videoId
				);
				game.log(event.card, "亮出了", cards);
				for (const nextEvent of nextEvents) {
					await nextEvent;
				}
			},
			async content(event, trigger, player) {
				const { target } = event;
				const dialog = ui.dialogs.find(dialog => dialog.videoId === event.preResult);
				if (!dialog || dialog.buttons.length === 0) {
					return;
				}
				let result;
				let directButton;
				if (dialog.buttons.length > 1) {
					const next = target.chooseButton(true);
					next.set("ai", button => {
						const player = _status.event.player;
						const card = button.link;
						let val = get.value(card, player);
						if (get.tag(card, "recover")) {
							val += game.countPlayer(target => target.hp < 2 && get.attitude(player, target) > 0 && lib.filter.cardSavable(card, player, target));
							if (player.hp <= 2 && game.checkMod(card, player, "unchanged", "cardEnabled2", player)) {
								val *= 2;
							}
						}
						return val;
					});
					next.set("dialog", event.preResult);
					next.set("closeDialog", false);
					next.set("dialogdisplay", true);
					result = await next.forResult();
				} else {
					directButton = dialog.buttons[0];
				}
				let card;
				if (directButton) {
					card = directButton.link;
				} else {
					for (const button of dialog.buttons) {
						if (button.link === result.links[0]) {
							card = button.link;
							break;
						}
					}
					if (!card) {
						card = dialog.buttons[0].link;
					}
				}
				const button = dialog.buttons.find(button => button.link === card);
				if (button) {
					const innerHTML = target.getName(true);
					game.createButtonCardsetion(innerHTML, button);
					dialog.buttons.remove(button);
				}
				const capt = `${get.translation(target)}选择了${get.translation(button.link)}`;
				let gainEvent;
				if (card) {
					gainEvent = target.gain(card, "visible");
					target.$gain2(card);
					game.broadcast(
						(card, id, name, capt) => {
							const dialog = get.idDialog(id);
							if (dialog) {
								dialog.content.firstChild.innerHTML = capt;
								const button = dialog.buttons.find(button => button.link === card);
								if (button) {
									game.createButtonCardsetion(name, button);
									dialog.buttons.remove(button);
								}
							}
						},
						card,
						dialog.videoId,
						target.getName(true),
						capt
					);
				}
				dialog.content.firstChild.innerHTML = capt;
				game.addVideo("dialogCapt", null, [dialog.videoId, dialog.content.firstChild.innerHTML]);
				game.log(target, "选择了", button.link);
				const delayEvent = game.delay();
				if (gainEvent) {
					await gainEvent;
				}
				await delayEvent;
			},
			async contentAfter(event) {
				const dialog = ui.dialogs.find(dialog => dialog.videoId === event.preResult);
				let remainedEvent;
				if (dialog) {
					dialog.close();
					_status.dieClose.remove(dialog);
					if (dialog.buttons.length) {
						event.remained = dialog.buttons.map(button => button.link);
						remainedEvent = event.trigger("wuguRemained");
					}
				}
				game.broadcast(id => {
					const dialog = get.idDialog(id);
					if (dialog) {
						dialog.close();
						_status.dieClose.remove(dialog);
					}
				}, event.preResult);
				game.addVideo("cardDialog", null, event.preResult);
				if (remainedEvent) {
					await remainedEvent;
				}
			},
			ai: {
				wuxie() {
					if (Math.random() < 0.5) {
						return 0;
					}
				},
				basic: {
					order: 3,
					useful: 0.5,
				},
				result: {
					target(player, target) {
						const sorter = _status.currentPhase || player;
						let opt = 6 + 0.75 * (game.countPlayer() - 2 * get.distance(sorter, target, "absolute"));
						if (get.is.versus()) {
							if (target !== sorter && get.attitude(player, player.next) < get.attitude(player, player.previous)) {
								opt = 6 + 0.75 * (2 * get.distance(sorter, target, "absolute") - game.countPlayer());
							}
						}
						if (player.hasUnknown(2)) {
							return 0;
						}
						return opt / 6;
					},
				},
				tag: {
					draw: 1,
					multitarget: 1,
				},
			},
		},
		taoyuan: {
			audio: true,
			fullskin: true,
			type: "trick",
			enable: true,
			selectTarget: -1,
			cardcolor: "red",
			reverseOrder: true,
			defaultYingbianEffect: "remove",
			filterTarget(card, player, target) {
				//return target.hp<target.maxHp;
				return true;
			},
			ignoreTarget(card, player, target) {
				return target.isHealthy();
			},
			async content(event, trigger, player) {
				event.target.recover();
			},
			ai: {
				basic: {
					order: (item, player) => {
						if (game.hasPlayer(current => current.hp <= 1 && get.recoverEffect(current, player, _status.event.player) < 0)) {
							return 1;
						}
						return 10;
					},
					useful: [3, 1],
					value: 0,
				},
				result: {
					target(player, target) {
						return target.hp < target.maxHp ? 2 : 0;
					},
				},
				tag: {
					recover: 0.5,
					multitarget: 1,
				},
			},
		},
		nanman: {
			audio: true,
			fullskin: true,
			type: "trick",
			enable: true,
			selectTarget: -1,
			defaultYingbianEffect: "remove",
			filterTarget(card, player, target) {
				return target !== player;
			},
			reverseOrder: true,
			async content(event, trigger, player) {
				const target = event.target;
				if (typeof event.shaRequired !== "number" || !event.shaRequired || event.shaRequired < 0) {
					event.shaRequired = 1;
				}
				if (typeof event.baseDamage !== "number") {
					event.baseDamage = 1;
				}
				while (event.shaRequired > 0) {
					let result = { bool: false };
					if (!event.directHit) {
						const next = target.chooseToRespond();
						next.set("filterCard", (card, player) => get.name(card) === "sha" && lib.filter.cardRespondable(card, player));
						if (event.shaRequired > 1) {
							next.set("prompt2", `共需打出${event.shaRequired}张【杀】`);
						}
						next.set("ai", card => (get.event().toRespond ? get.order(card) : -1));
						next.set(
							"toRespond",
							(() => {
								if (target.hasSkillTag("noSha", null, "respond")) {
									return false;
								}
								if (target.hasSkillTag("useSha", null, "respond")) {
									return true;
								}
								if (event.baseDamage <= 0 || player.hasSkillTag("notricksource", null, event) || target.hasSkillTag("notrick", null, event)) {
									return false;
								}
								if (event.baseDamage >= target.hp + (player.hasSkillTag("jueqing", false, target) || target.hasSkill("gangzhi") ? 0 : target.hujia)) {
									return true;
								}
								const damage = get.damageEffect(target, player, target);
								if (damage >= 0) {
									return false;
								}
								if (
									event.shaRequired > 1 &&
									!target.hasSkillTag("freeSha", null, {
										player: player,
										card: event.card,
										type: "respond",
									}) &&
									event.shaRequired > target.mayHaveSha(target, "respond", null, "count")
								) {
									return false;
								}
								// if (target.hasSkill("naman")) {
								// 	return true;
								// }
								return true;
							})()
						);
						next.set("respondTo", [player, event.card]);
						next.autochoose = lib.filter.autoRespondSha;
						result = await next.forResult();
					}
					if (!result?.bool) {
						await target.damage();
						break;
					} else {
						event.shaRequired--;
					}
				}
			},
			ai: {
				wuxie(target, card, player, viewer, status) {
					let att = get.attitude(viewer, target),
						eff = get.effect(target, card, player, target);
					if (Math.abs(att) < 1 || status * eff * att >= 0) {
						return 0;
					}
					let evt = _status.event.getParent("useCard"),
						pri = 1,
						bonus = player.hasSkillTag("damageBonus", true, {
							target: target,
							card: card,
						}),
						damage = 1,
						isZhu = tar => tar.isZhu || tar === game.boss || tar === game.trueZhu || tar === game.falseZhu,
						canSha = (tar, blur) => {
							let known = tar.getKnownCards(viewer);
							if (!blur) {
								return known.some(card => {
									let name = get.name(card, tar);
									return (name === "sha" || name === "hufu" || name === "yuchanqian") && lib.filter.cardRespondable(card, tar);
								});
							}
							if (tar.countCards("hs", i => !known.includes(i)) > 4.67 - (2 * tar.hp) / tar.maxHp) {
								return true;
							}
							if (!tar.hasSkillTag("respondSha", true, "respond", true)) {
								return false;
							}
							if (tar.hp <= damage) {
								return false;
							}
							if (tar.hp <= damage + 1) {
								return isZhu(tar);
							}
							return true;
						},
						self = false;
					if (canSha(target)) {
						return 0;
					}
					if (
						bonus &&
						!viewer.hasSkillTag("filterDamage", null, {
							player: player,
							card: card,
						})
					) {
						damage = 2;
					}
					if ((viewer.hp <= damage || (viewer.hp <= damage + 1 && isZhu(viewer))) && !canSha(viewer)) {
						if (viewer === target) {
							return status;
						}
						let fv = true;
						if (evt && evt.targets) {
							for (let i of evt.targets) {
								if (fv) {
									if (target === i) {
										fv = false;
									}
									continue;
								}
								if (viewer === i) {
									if (isZhu(viewer)) {
										return 0;
									}
									self = true;
									break;
								}
							}
						}
					}
					let maySha = canSha(target, true);
					if (
						bonus &&
						!target.hasSkillTag("filterDamage", null, {
							player: player,
							card: card,
						})
					) {
						damage = 2;
					} else {
						damage = 1;
					}
					if (isZhu(target)) {
						if (eff < 0) {
							if (target.hp <= damage + 1 || (!maySha && target.hp <= damage + 2)) {
								return 1;
							}
							if (maySha && target.hp > damage + 2) {
								return 0;
							} else if (maySha || target.hp > damage + 2) {
								pri = 3;
							} else {
								pri = 4;
							}
						} else if (target.hp > damage + 1) {
							pri = 2;
						} else {
							return 0;
						}
					} else if (self) {
						return 0;
					} else if (eff < 0) {
						if (!maySha && target.hp <= damage) {
							pri = 5;
						} else if (maySha) {
							return 0;
						} else if (target.hp > damage + 1) {
							pri = 2;
						} else if (target.hp === damage + 1) {
							pri = 3;
						} else {
							pri = 4;
						}
					} else if (target.hp <= damage) {
						return 0;
					}
					let find = false;
					if (evt && evt.targets) {
						for (let i = 0; i < evt.targets.length; i++) {
							if (!find) {
								if (evt.targets[i] === target) {
									find = true;
								}
								continue;
							}
							let att1 = get.attitude(viewer, evt.targets[i]),
								eff1 = get.effect(evt.targets[i], card, player, evt.targets[i]),
								temp = 1;
							if (Math.abs(att1) < 1 || att1 * eff1 >= 0 || canSha(evt.targets[i])) {
								continue;
							}
							maySha = canSha(evt.targets[i], true);
							if (
								bonus &&
								!evt.targets[i].hasSkillTag("filterDamage", null, {
									player: player,
									card: card,
								})
							) {
								damage = 2;
							} else {
								damage = 1;
							}
							if (isZhu(evt.targets[i])) {
								if (eff1 < 0) {
									if (evt.targets[i].hp <= damage + 1 || (!maySha && evt.targets[i].hp <= damage + 2)) {
										return 0;
									}
									if (maySha && evt.targets[i].hp > damage + 2) {
										continue;
									}
									if (maySha || evt.targets[i].hp > damage + 2) {
										temp = 3;
									} else {
										temp = 4;
									}
								} else if (evt.targets[i].hp > damage + 1) {
									temp = 2;
								} else {
									continue;
								}
							} else if (eff1 < 0) {
								if (!maySha && evt.targets[i].hp <= damage) {
									temp = 5;
								} else if (maySha) {
									continue;
								} else if (evt.targets[i].hp > damage + 1) {
									temp = 2;
								} else if (evt.targets[i].hp === damage + 1) {
									temp = 3;
								} else {
									temp = 4;
								}
							} else if (evt.targets[i].hp > damage + 1) {
								temp = 2;
							}
							if (temp > pri) {
								return 0;
							}
						}
					}
					return 1;
				},
				basic: {
					order: 7.2,
					useful: [5, 1],
					value: 5,
				},
				result: {
					player(player, target) {
						if (player._nanman_temp || player.hasSkillTag("jueqing", false, target)) {
							return 0;
						}
						if (target.hp > 2 || (target.hp > 1 && !target.isZhu && target !== game.boss && target !== game.trueZhu && target !== game.falseZhu)) {
							return 0;
						}
						player._nanman_temp = true;
						let eff = get.effect(target, new lib.element.VCard({ name: "nanman" }), player, target);
						delete player._nanman_temp;
						if (eff >= 0) {
							return 0;
						}
						if (target.hp > 1 && target.hasSkillTag("respondSha", true, "respond", true)) {
							return 0;
						}
						let known = target.getKnownCards(player);
						if (
							known.some(card => {
								let name = get.name(card, target);
								if (name === "sha" || name === "hufu" || name === "yuchanqian") {
									return lib.filter.cardRespondable(card, target);
								}
								if (name === "wuxie") {
									return lib.filter.cardEnabled(card, target, "forceEnable");
								}
							})
						) {
							return 0;
						}
						if (target.hp > 1 || target.countCards("hs", i => !known.includes(i)) > 4.67 - (2 * target.hp) / target.maxHp) {
							return 0;
						}
						let res = 0,
							att = get.sgnAttitude(player, target);
						res -= att * (0.8 * target.countCards("hs") + 0.6 * target.countCards("e") + 3.6);
						if (get.mode() === "identity" && target.identity === "fan") {
							res += 2.4;
						}
						if ((get.mode() === "guozhan" && player.identity !== "ye" && player.identity === target.identity) || (get.mode() === "identity" && player.identity === "zhu" && (target.identity === "zhong" || target.identity === "mingzhong"))) {
							res -= 0.8 * player.countCards("he");
						}
						return res;
					},
					target(player, target) {
						let zhu = (get.mode() === "identity" && target.isZhu) || target.identity === "zhu";
						if (!lib.filter.cardRespondable({ name: "sha" }, target)) {
							if (zhu) {
								if (target.hp < 2) {
									return -99;
								}
								if (target.hp === 2) {
									return -3.6;
								}
							}
							return -2;
						}
						let known = target.getKnownCards(player);
						if (
							known.some(card => {
								let name = get.name(card, target);
								if (name === "sha" || name === "hufu" || name === "yuchanqian") {
									return lib.filter.cardRespondable(card, target);
								}
								if (name === "wuxie") {
									return lib.filter.cardEnabled(card, target, "forceEnable");
								}
							})
						) {
							return -1.2;
						}
						let nh = target.countCards("hs", i => !known.includes(i));
						if (zhu && target.hp <= 1) {
							if (nh === 0) {
								return -99;
							}
							if (nh === 1) {
								return -60;
							}
							if (nh === 2) {
								return -36;
							}
							if (nh === 3) {
								return -12;
							}
							if (nh === 4) {
								return -8;
							}
							return -5;
						}
						if (target.hasSkillTag("respondSha", true, "respond", true)) {
							return -1.35;
						}
						if (!nh) {
							return -2;
						}
						if (nh === 1) {
							return -1.8;
						}
						return -1.5;
					},
				},
				tag: {
					respond: 1,
					respondSha: 1,
					damage: 1,
					multitarget: 1,
					multineg: 1,
				},
			},
		},
		wanjian: {
			audio: true,
			fullskin: true,
			type: "trick",
			enable: true,
			selectTarget: -1,
			reverseOrder: true,
			defaultYingbianEffect: "remove",
			filterTarget(card, player, target) {
				return target !== player;
			},
			async content(event, trigger, player) {
				const target = event.target;
				if (typeof event.shanRequired !== "number" || !event.shanRequired || event.shanRequired < 0) {
					event.shanRequired = 1;
				}
				if (typeof event.baseDamage !== "number") {
					event.baseDamage = 1;
				}
				while (event.shanRequired > 0) {
					let result = { bool: false };
					if (!event.directHit) {
						const next = target.chooseToRespond();
						next.set("filterCard", (card, player) => get.name(card) === "shan" && lib.filter.cardRespondable(card, player));
						if (event.shanRequired > 1) {
							next.set("prompt2", `共需打出${event.shanRequired}张闪`);
						}
						next.set("ai", card => (get.event().toRespond ? get.order(card) : -1));
						next.set(
							"toRespond",
							(() => {
								if (target.hasSkillTag("noShan", null, "respond")) {
									return false;
								}
								if (target.hasSkillTag("useShan", null, "respond")) {
									return true;
								}
								if (event.baseDamage <= 0 || player.hasSkillTag("notricksource", null, event) || target.hasSkillTag("notrick", null, event)) {
									return false;
								}
								if (event.baseDamage >= target.hp + (player.hasSkillTag("jueqing", false, target) || target.hasSkill("gangzhi") ? 0 : target.hujia)) {
									return true;
								}
								const damage = get.damageEffect(target, player, target);
								if (damage >= 0) {
									return false;
								}
								if (
									event.shanRequired > 1 &&
									!target.hasSkillTag("freeShan", null, {
										player: player,
										card: event.card,
										type: "respond",
									}) &&
									event.shanRequired > target.mayHaveShan(target, "respond", null, "count")
								) {
									return false;
								}
								return true;
							})()
						);
						next.set("respondTo", [player, event.card]);
						next.autochoose = lib.filter.autoRespondShan;
						result = await next.forResult();
					}
					if (!result?.bool) {
						await target.damage();
						break;
					} else {
						event.shanRequired--;
					}
				}
			},
			ai: {
				wuxie(target, card, player, viewer, status) {
					let att = get.attitude(viewer, target),
						eff = get.effect(target, card, player, target);
					if (Math.abs(att) < 1 || status * eff * att >= 0) {
						return 0;
					}
					let evt = _status.event.getParent("useCard"),
						pri = 1,
						bonus = player.hasSkillTag("damageBonus", true, {
							target: target,
							card: card,
						}),
						damage = 1,
						isZhu = tar => tar.isZhu || tar === game.boss || tar === game.trueZhu || tar === game.falseZhu,
						canShan = (tar, blur) => {
							let known = tar.getKnownCards(viewer);
							if (!blur) {
								return known.some(card => {
									let name = get.name(card, tar);
									return (name === "shan" || name === "hufu") && lib.filter.cardRespondable(card, tar);
								});
							}
							if (tar.countCards("hs", i => !known.includes(i)) > 3.67 - (2 * tar.hp) / tar.maxHp) {
								return true;
							}
							if (!tar.hasSkillTag("respondShan", true, "respond", true)) {
								return false;
							}
							if (tar.hp <= damage) {
								return false;
							}
							if (tar.hp <= damage + 1) {
								return isZhu(tar);
							}
							return true;
						},
						self = false;
					if (canShan(target)) {
						return 0;
					}
					if (
						bonus &&
						!viewer.hasSkillTag("filterDamage", null, {
							player: player,
							card: card,
						})
					) {
						damage = 2;
					}
					if ((viewer.hp <= damage || (viewer.hp <= damage + 1 && isZhu(viewer))) && !canShan(viewer)) {
						if (viewer === target) {
							return status;
						}
						let fv = true;
						if (evt && evt.targets) {
							for (let i of evt.targets) {
								if (fv) {
									if (target === i) {
										fv = false;
									}
									continue;
								}
								if (viewer === i) {
									if (isZhu(viewer)) {
										return 0;
									}
									self = true;
									break;
								}
							}
						}
					}
					let mayShan = canShan(target, true);
					if (
						bonus &&
						!target.hasSkillTag("filterDamage", null, {
							player: player,
							card: card,
						})
					) {
						damage = 2;
					} else {
						damage = 1;
					}
					if (isZhu(target)) {
						if (eff < 0) {
							if (target.hp <= damage + 1 || (!mayShan && target.hp <= damage + 2)) {
								return 1;
							}
							if (mayShan && target.hp > damage + 2) {
								return 0;
							} else if (mayShan || target.hp > damage + 2) {
								pri = 3;
							} else {
								pri = 4;
							}
						} else if (target.hp > damage + 1) {
							pri = 2;
						} else {
							return 0;
						}
					} else if (self) {
						return 0;
					} else if (eff < 0) {
						if (!mayShan && target.hp <= damage) {
							pri = 5;
						} else if (mayShan) {
							return 0;
						} else if (target.hp > damage + 1) {
							pri = 2;
						} else if (target.hp === damage + 1) {
							pri = 3;
						} else {
							pri = 4;
						}
					} else if (target.hp <= damage) {
						return 0;
					}
					let find = false;
					if (evt && evt.targets) {
						for (let i = 0; i < evt.targets.length; i++) {
							if (!find) {
								if (evt.targets[i] === target) {
									find = true;
								}
								continue;
							}
							let att1 = get.attitude(viewer, evt.targets[i]),
								eff1 = get.effect(evt.targets[i], card, player, evt.targets[i]),
								temp = 1;
							if (Math.abs(att1) < 1 || att1 * eff1 >= 0 || canShan(evt.targets[i])) {
								continue;
							}
							mayShan = canShan(evt.targets[i], true);
							if (
								bonus &&
								!evt.targets[i].hasSkillTag("filterDamage", null, {
									player: player,
									card: card,
								})
							) {
								damage = 2;
							} else {
								damage = 1;
							}
							if (isZhu(evt.targets[i])) {
								if (eff1 < 0) {
									if (evt.targets[i].hp <= damage + 1 || (!mayShan && evt.targets[i].hp <= damage + 2)) {
										return 0;
									}
									if (mayShan && evt.targets[i].hp > damage + 2) {
										continue;
									}
									if (mayShan || evt.targets[i].hp > damage + 2) {
										temp = 3;
									} else {
										temp = 4;
									}
								} else if (evt.targets[i].hp > damage + 1) {
									temp = 2;
								} else {
									continue;
								}
							} else if (eff1 < 0) {
								if (!mayShan && evt.targets[i].hp <= damage) {
									temp = 5;
								} else if (mayShan) {
									continue;
								} else if (evt.targets[i].hp > damage + 1) {
									temp = 2;
								} else if (evt.targets[i].hp === damage + 1) {
									temp = 3;
								} else {
									temp = 4;
								}
							} else if (evt.targets[i].hp > damage + 1) {
								temp = 2;
							}
							if (temp > pri) {
								return 0;
							}
						}
					}
					return 1;
				},
				basic: {
					order: 7.2,
					useful: 1,
					value: 5,
				},
				result: {
					player(player, target) {
						if (player._wanjian_temp || player.hasSkillTag("jueqing", false, target)) {
							return 0;
						}
						if (target.hp > 2 || (target.hp > 1 && !target.isZhu && target !== game.boss && target !== game.trueZhu && target !== game.falseZhu)) {
							return 0;
						}
						player._wanjian_temp = true;
						let eff = get.effect(target, new lib.element.VCard({ name: "wanjian" }), player, target);
						delete player._wanjian_temp;
						if (eff >= 0) {
							return 0;
						}
						if (target.hp > 1 && target.hasSkillTag("respondShan", true, "respond", true)) {
							return 0;
						}
						let known = target.getKnownCards(player);
						if (
							known.some(card => {
								let name = get.name(card, target);
								if (name === "shan" || name === "hufu") {
									return lib.filter.cardRespondable(card, target);
								}
								if (name === "wuxie") {
									return lib.filter.cardEnabled(card, target, "forceEnable");
								}
							})
						) {
							return 0;
						}
						if (target.hp > 1 || target.countCards("hs", i => !known.includes(i)) > 3.67 - (2 * target.hp) / target.maxHp) {
							return 0;
						}
						let res = 0,
							att = get.sgnAttitude(player, target);
						res -= att * (0.8 * target.countCards("hs") + 0.6 * target.countCards("e") + 3.6);
						if (get.mode() === "identity" && target.identity === "fan") {
							res += 2.4;
						}
						if ((get.mode() === "guozhan" && player.identity !== "ye" && player.identity === target.identity) || (get.mode() === "identity" && player.identity === "zhu" && (target.identity === "zhong" || target.identity === "mingzhong"))) {
							res -= 0.8 * player.countCards("he");
						}
						return res;
					},
					target(player, target) {
						let zhu = (get.mode() === "identity" && target.isZhu) || target.identity === "zhu";
						if (!lib.filter.cardRespondable({ name: "shan" }, target)) {
							if (zhu) {
								if (target.hp < 2) {
									return -99;
								}
								if (target.hp === 2) {
									return -3.6;
								}
							}
							return -2;
						}
						let known = target.getKnownCards(player);
						if (
							known.some(card => {
								let name = get.name(card, target);
								if (name === "shan" || name === "hufu") {
									return lib.filter.cardRespondable(card, target);
								}
								if (name === "wuxie") {
									return lib.filter.cardEnabled(card, target, "forceEnable");
								}
							})
						) {
							return -1.2;
						}
						let nh = target.countCards("hs", i => !known.includes(i));
						if (zhu && target.hp <= 1) {
							if (nh === 0) {
								return -99;
							}
							if (nh === 1) {
								return -60;
							}
							if (nh === 2) {
								return -36;
							}
							if (nh === 3) {
								return -8;
							}
							return -5;
						}
						if (target.hasSkillTag("respondShan", true, "respond", true)) {
							return -1.35;
						}
						if (!nh) {
							return -2;
						}
						if (nh === 1) {
							return -1.65;
						}
						return -1.5;
					},
				},
				tag: {
					respond: 1,
					respondShan: 1,
					damage: 1,
					multitarget: 1,
					multineg: 1,
				},
			},
		},
		wuzhong: {
			audio: true,
			fullskin: true,
			type: "trick",
			enable: true,
			selectTarget: -1,
			cardcolor: "red",
			toself: true,
			filterTarget(card, player, target) {
				return target === player;
			},
			modTarget: true,
			async content(event, trigger, player) {
				const { target } = event;
				if (get.is.versus()) {
					if (game.friend.includes(target)) {
						if (game.friend.length < game.enemy.length) {
							await target.draw(3);
							return;
						}
					} else {
						if (game.friend.length > game.enemy.length) {
							await target.draw(3);
							return;
						}
					}
				}
				await target.draw(2);
			},
			ai: {
				wuxie(target, card, player, viewer) {
					if (get.mode() === "guozhan") {
						if (!_status._aozhan) {
							if (!player.isMajor()) {
								if (!viewer.isMajor()) {
									return 0;
								}
							}
						}
					}
					if (target.countCards("h") * Math.max(target.hp, 5) > 6) {
						return 0;
					}
				},
				basic: {
					order: 7,
					useful: 4.5,
					value(card, player) {
						if (player.hp > 2) {
							return 9.2;
						}
						return 9.2 - 0.7 * Math.min(3, player.countCards("hs"));
					},
				},
				result: {
					target: 2,
				},
				tag: {
					draw: 2,
				},
			},
		},
		juedou: {
			audio: true,
			fullskin: true,
			type: "trick",
			enable: true,
			defaultYingbianEffect: "hit",
			filterTarget(card, player, target) {
				return target !== player;
			},
			async content(event, trigger, player) {
				const target = event.target;
				if (event.turn === undefined) {
					event.turn = target;
				}
				event.source = player;
				if (typeof event.baseDamage !== "number") {
					event.baseDamage = 1;
				}
				if (typeof event.extraDamage !== "number") {
					event.extraDamage = 0;
				}
				if (!event.shaReq) {
					event.shaReq = {};
				}
				if (typeof event.shaReq[player.playerid] !== "number") {
					event.shaReq[player.playerid] = 1;
				}
				if (typeof event.shaReq[target.playerid] !== "number") {
					event.shaReq[target.playerid] = 1;
				}
				event.playerCards = [];
				event.targetCards = [];
				while (true) {
					await event.trigger("juedou");
					event.shaRequired = event.shaReq[event.turn.playerid];
					let damaged = false;
					while (event.shaRequired > 0) {
						let result = { bool: false };
						if (!event.directHit) {
							const next = event.turn.chooseToRespond();
							next.set("filterCard", (card, player) => get.name(card) === "sha" && lib.filter.cardRespondable(card, player));
							if (event.shaRequired > 1) {
								next.set("prompt2", `共需打出${event.shaRequired}张杀`);
							}
							next.set("ai", card => (get.event().toRespond ? get.order(card) : -1));
							next.set("shaRequired", event.shaRequired);
							next.set(
								"toRespond",
								(() => {
									const responder = event.turn;
									const opposite = event.source;
									if (responder.hasSkillTag("noSha", null, "respond")) {
										return false;
									}
									if (responder.hasSkillTag("useSha", null, "respond")) {
										return true;
									}
									if (event.baseDamage + event.extraDamage <= 0 || player.hasSkillTag("notricksource", null, event) || responder.hasSkillTag("notrick", null, event)) {
										return false;
									}
									if (event.baseDamage + event.extraDamage >= responder.hp + (opposite.hasSkillTag("jueqing", false, target) || target.hasSkill("gangzhi") ? 0 : target.hujia)) {
										return true;
									}
									const damage = get.damageEffect(responder, opposite, responder);
									if (damage >= 0) {
										return false;
									}
									if (
										event.shaRequired > 1 &&
										!target.hasSkillTag("freeSha", null, {
											player: player,
											card: event.card,
											type: "respond",
										}) &&
										event.shaRequired > responder.mayHaveSha(responder, "respond", null, "count")
									) {
										return false;
									}
									if (get.attitude(responder, opposite._trueMe || opposite) > 0 && damage >= get.damageEffect(opposite, responder, responder)) {
										return false;
									}
									// if (responder.hasSkill("naman")) {
									// 	return true;
									// }
									return true;
								})()
							);
							next.set("respondTo", [player, event.card]);
							next.autochoose = lib.filter.autoRespondSha;
							if (event.turn === target) {
								next.source = player;
							} else {
								next.source = target;
							}
							result = await next.forResult();
						}
						if (result?.bool) {
							event.shaRequired--;
							if (result.cards?.length) {
								if (event.turn === target) {
									event.targetCards.addArray(result.cards);
								} else {
									event.playerCards.addArray(result.cards);
								}
							}
						} else {
							await event.turn.damage(event.source);
							damaged = true;
							break;
						}
					}
					if (damaged) {
						break;
					}
					[event.source, event.turn] = [event.turn, event.source];
				}
			},
			ai: {
				wuxie(target, card, player, viewer, status) {
					if (player === game.me && get.attitude(viewer, player._trueMe || player) > 0) {
						return 0;
					}
					if (status * get.attitude(viewer, target) * get.effect(target, card, player, target) >= 0) {
						return 0;
					}
				},
				basic: {
					order: 5,
					useful: 1,
					value: 5.5,
				},
				result: {
					player(player, target, card) {
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
							return 0;
						}
						if (get.damageEffect(target, player, target) >= 0) {
							return 0;
						}
						let pd = get.damageEffect(player, target, player),
							att = get.attitude(player, target);
						if (att > 0 && get.damageEffect(target, player, player) > pd) {
							return 0;
						}
						let ts = target.mayHaveSha(player, "respond", null, "count"),
							ps = player.mayHaveSha(
								player,
								"respond",
								player.getCards("h", i => {
									return card === i || (card.cards && card.cards.includes(i)) || ui.selected.cards.includes(i);
								}),
								"count"
							);
						if (ts < 1 && ts * 8 < Math.pow(player.hp, 2)) {
							return 0;
						}
						if (att > 0) {
							if (ts < 1) {
								return 0;
							}
							return -2;
						}
						if (pd >= 0) {
							return pd / get.attitude(player, player);
						}
						if (ts - ps + Math.exp(0.8 - player.hp) < 1) {
							return -ts;
						}
						return -2 - ts;
					},
					target(player, target, card) {
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
							return -2;
						}
						let td = get.damageEffect(target, player, target);
						if (td >= 0) {
							return td / get.attitude(target, target);
						}
						let pd = get.damageEffect(player, target, player),
							att = get.attitude(player, target);
						if (att > 0 && get.damageEffect(target, player, player) > pd) {
							return -2;
						}
						let ts = target.mayHaveSha(player, "respond", null, "count"),
							ps = player.mayHaveSha(
								player,
								"respond",
								player.getCards("h", i => {
									return card === i || (card.cards && card.cards.includes(i)) || ui.selected.cards.includes(i);
								}),
								"count"
							);
						if (ts < 1) {
							return -1.5;
						}
						if (att > 0) {
							return -2;
						}
						if (pd >= 0) {
							return -1;
						}
						if (ts - ps < 1) {
							return -2 - ts;
						}
						return -ts;
					},
				},
				tag: {
					respond: 2,
					respondSha: 2,
					damage: 1,
				},
			},
		},
		shunshou: {
			audio: true,
			fullskin: true,
			type: "trick",
			enable: true,
			range: { global: 1 },
			selectTarget: 1,
			postAi(targets) {
				return targets.length === 1 && targets[0].countCards("j");
			},
			filterTarget(card, player, target) {
				if (player === target) {
					return false;
				}
				return target.hasCard(card => lib.filter.canBeGained(card, player, target), get.is.single() ? "he" : "hej");
			},
			async content(event, trigger, player) {
				const target = event.target;
				let pos = get.is.single() ? "he" : "hej";
				if (target.countGainableCards(player, pos)) {
					await player.gainPlayerCard(pos, target, true).set("target", target).set("complexSelect", false).set("ai", lib.card.shunshou.ai.button);
				}
			},
			ai: {
				wuxie(target, card, player, viewer) {
					if (!target.countCards("hej") || get.attitude(viewer, player._trueMe || player) > 0) {
						return 0;
					}
				},
				basic: {
					order: 7.5,
					useful: (card, i) => 8 / (3 + i),
					value: (card, player) => {
						let max = 0;
						game.countPlayer(cur => {
							max = Math.max(max, lib.card.shunshou.ai.result.target(player, cur) * get.attitude(player, cur));
						});
						if (max <= 0) {
							return 2;
						}
						return 0.53 * max;
					},
				},
				button: button => {
					let player = _status.event.player,
						target = _status.event.target;
					if (!lib.filter.canBeGained(button.link, player, target)) {
						return 0;
					}
					let att = get.attitude(player, target),
						val = get.value(button.link, player) / 60,
						btv = get.buttonValue(button),
						pos = get.position(button.link),
						name = get.name(button.link);
					if (pos === "j") {
						let viewAs = button.link.viewAs;
						if (viewAs === "lebu") {
							let needs = target.needsToDiscard(2);
							btv *= 1.08 + 0.2 * needs;
						} else if (viewAs === "shandian" || viewAs === "fulei") {
							btv /= 2;
						}
					}
					if (att > 0) {
						btv = -btv;
					}
					if (pos !== "e") {
						if (pos === "h" && !player.hasSkillTag("viewHandcard", null, target, true)) {
							return btv + 0.1;
						}
						return btv + val;
					}
					let sub = get.subtype(button.link);
					if (sub === "equip1") {
						return (btv * Math.min(3.6, target.hp)) / 3;
					}
					if (sub === "equip2") {
						if (name === "baiyin" && pos === "e" && target.isDamaged()) {
							let by = 3 - 0.6 * Math.min(5, target.hp);
							return get.sgn(get.recoverEffect(target, player, player)) * by;
						}
						return 1.57 * btv + val;
					}
					if (att <= 0 && (sub === "equip3" || sub === "equip4") && (player.hasSkill("shouli") || player.hasSkill("psshouli"))) {
						return 0;
					}
					if (sub === "equip3" && !game.hasPlayer(cur => !cur.inRange(target) && get.attitude(cur, target) < 0)) {
						return 0.4 * btv + val;
					}
					if (sub === "equip4") {
						return btv / 2 + val;
					}
					return btv + val;
				},
				result: {
					player(player, target) {
						const hs = target.getGainableCards(player, "h");
						const es = target.getGainableCards(player, "e");
						const js = target.getGainableCards(player, "j");
						const att = get.attitude(player, target);
						if (att < 0) {
							if (
								!hs.length &&
								!es.some(card => {
									return get.value(card, target) > 0 && card !== target.getEquip("jinhe");
								}) &&
								!js.some(card => {
									const cardj = card.viewAs ? { name: card.viewAs } : card;
									if (cardj.name === "xumou_jsrg") {
										return true;
									}
									return get.effect(target, cardj, target, player) < 0;
								})
							) {
								return 0;
							}
						} else if (att > 1) {
							return es.some(card => {
								return get.value(card, target) <= 0;
							}) ||
								js.some(card => {
									const cardj = card.viewAs ? { name: card.viewAs } : card;
									if (cardj.name === "xumou_jsrg") {
										return false;
									}
									return get.effect(target, cardj, target, player) < 0;
								})
								? 1.5
								: 0;
						}
						return 1;
					},
					target(player, target) {
						const hs = target.getGainableCards(player, "h");
						const es = target.getGainableCards(player, "e");
						const js = target.getGainableCards(player, "j");

						if (get.attitude(player, target) <= 0) {
							if (hs.length > 0) {
								return -1.5;
							}
							return es.some(card => {
								return get.value(card, target) > 0 && card !== target.getEquip("jinhe");
							}) ||
								js.some(card => {
									const cardj = card.viewAs ? { name: card.viewAs } : card;
									if (cardj.name === "xumou_jsrg") {
										return true;
									}
									return get.effect(target, cardj, target, player) < 0;
								})
								? -1.5
								: 1.5;
						}
						return es.some(card => {
							return get.value(card, target) <= 0;
						}) ||
							js.some(card => {
								const cardj = card.viewAs ? { name: card.viewAs } : card;
								if (cardj.name === "xumou_jsrg") {
									return false;
								}
								return get.effect(target, cardj, target, player) < 0;
							})
							? 1.5
							: -1.5;
					},
				},
				tag: {
					loseCard: 1,
					gain: 1,
				},
			},
		},
		shunshou_copy: {
			ai: {
				basic: {
					order: 7.5,
					useful: 4,
					value: 9,
				},
				result: {
					target(player, target, card) {
						let position = "hej";
						if (card && card.position) {
							position = card.position;
						}
						const hs = position.includes("h") ? target.getGainableCards(player, "h") : [];
						const es = position.includes("e") ? target.getGainableCards(player, "e") : [];
						const js = position.includes("j") ? target.getGainableCards(player, "j") : [];
						if (get.attitude(player, target) <= 0) {
							if (hs.length > 0) {
								return -1.5;
							}
							return es.some(card => {
								return get.value(card, target) > 0 && card !== target.getEquip("jinhe");
							}) ||
								js.some(card => {
									const cardj = card.viewAs ? { name: card.viewAs } : card;
									if (cardj.name === "xumou_jsrg") {
										return true;
									}
									return get.effect(target, cardj, target, player) < 0;
								})
								? -1.5
								: 1.5;
						}
						return es.some(card => {
							return get.value(card, target) <= 0;
						}) ||
							js.some(card => {
								const cardj = card.viewAs ? { name: card.viewAs } : card;
								if (cardj.name === "xumou_jsrg") {
									return false;
								}
								return get.effect(target, cardj, target, player) < 0;
							})
							? 1.5
							: -1.5;
					},
					player(player, target, card) {
						let position = "hej";
						if (card && card.position) {
							position = card.position;
						}
						const hs = position.includes("h") ? target.getGainableCards(player, "h") : [];
						const es = position.includes("e") ? target.getGainableCards(player, "e") : [];
						const js = position.includes("j") ? target.getGainableCards(player, "j") : [];
						const att = get.attitude(player, target);
						if (att < 0) {
							if (
								!hs.length &&
								!es.some(card => {
									return get.value(card, target) > 0 && card !== target.getEquip("jinhe");
								}) &&
								!js.some(card => {
									const cardj = card.viewAs ? { name: card.viewAs } : card;
									if (cardj.name === "xumou_jsrg") {
										return true;
									}
									return get.effect(target, cardj, target, player) < 0;
								})
							) {
								return 0;
							}
						} else if (att > 1) {
							return es.some(card => {
								return get.value(card, target) <= 0;
							}) ||
								js.some(card => {
									const cardj = card.viewAs ? { name: card.viewAs } : card;
									if (cardj.name === "xumou_jsrg") {
										return false;
									}
									return get.effect(target, cardj, target, player) < 0;
								})
								? 1.5
								: 0;
						}
						return 1;
					},
				},
				tag: {
					loseCard: 1,
					gain: 1,
				},
			},
		},
		shunshou_copy2: {
			ai: {
				basic: {
					order: 7.5,
					useful: 4,
					value: 9,
				},
				result: {
					target(player, target, card, isLink) {
						return lib.card.shunshou_copy.ai.result.target(
							player,
							target,
							{
								name: "shunshou_copy",
								position: "he",
							},
							isLink
						);
					},
					player(player, target, card, isLink) {
						return lib.card.shunshou_copy.ai.result.player(
							player,
							target,
							{
								name: "shunshou_copy",
								position: "he",
							},
							isLink
						);
					},
				},
				tag: {
					loseCard: 1,
					gain: 1,
				},
			},
		},
		guohe: {
			audio: true,
			fullskin: true,
			type: "trick",
			enable: true,
			selectTarget: 1,
			postAi(targets) {
				return targets.length === 1 && targets[0].hasCards("j");
			},
			filterTarget(card, player, target) {
				if (player === target) {
					return false;
				}
				return target.hasCard(card => lib.filter.canBeDiscarded(card, player, target), get.is.single() ? "he" : "hej");
			},
			defaultYingbianEffect: "add",
			/**
			 * @type {ContentFuncByAll}
			 */
			async content(event, trigger, player) {
				const target = event.target;
				let result;
				if (get.is.single()) {
					const bool1 = target.hasDiscardableCards(player, "h");
					const bool2 = target.hasDiscardableCards(player, "e");
					if (bool1 && bool2) {
						result = await player
							.chooseControl({
								prompt: `弃置${get.translation(target)}装备区的一张牌，或观看其手牌并弃置其中的一张牌。`,
								controls: ["手牌区", "装备区"],
								ai() {
									return Math.random() < 0.5 ? 1 : 0;
								},
							})
							.forResult();
					} else {
						result = { control: bool1 ? "手牌区" : "装备区" };
					}
				} else {
					result = { control: "所有区域" };
				}
				let pos;
				let vis = true;
				if (result.control === "手牌区") {
					pos = "h";
				} else if (result.control === "装备区") {
					pos = "e";
				} else {
					pos = "hej";
					vis = false;
				}
				if (target.hasDiscardableCards(player, pos)) {
					await player
						.discardPlayerCard({
							target,
							position: pos,
							forced: true,
							visible: vis,
						})
						.set("target", target)
						.set("complexSelect", false)
						.set("ai", lib.card.guohe.ai.button);
				}
			},
			ai: {
				wuxie: (target, card, player, viewer, status) => {
					if (
						!target.hasCards("hej") ||
						status * get.attitude(viewer, player._trueMe || player) > 0 ||
						(target.hp > 2 &&
							!target.hasCard(i => {
								const val = get.value(i, target);
								const subtypes = get.subtypes(i);
								if (val < 8 && target.hp < 2 && !subtypes.includes("equip2") && !subtypes.includes("equip5")) {
									return false;
								}
								return val > 3 + Math.min(5, target.hp);
							}, "e") &&
							target.countCards("h") * _status.event.getRand("guohe_wuxie") > 1.57)
					) {
						return 0;
					}
				},
				basic: {
					order: 9,
					useful: (card, i) => 10 / (3 + i),
					value: (card, player) => {
						let max = 0;
						for (const current of game.filterPlayer()) {
							max = Math.max(max, lib.card.guohe.ai.result.target(player, current) * get.attitude(player, current));
						}
						if (max <= 0) {
							return 5;
						}
						return 0.42 * max;
					},
				},
				yingbian(card, player, targets, viewer) {
					if (get.attitude(viewer, player) <= 0) {
						return 0;
					}
					if (game.hasPlayer(current => !targets.includes(current) && lib.filter.targetEnabled2(card, player, current) && get.effect(current, card, player, player) > 0)) {
						return 6;
					}
					return 0;
				},
				button: button => {
					const player = _status.event.player;
					const target = _status.event.target;
					if (!lib.filter.canBeDiscarded(button.link, player, target)) {
						return 0;
					}
					const att = get.attitude(player, target);
					let val = get.buttonValue(button);
					const pos = get.position(button.link);
					const name = get.name(button.link);
					if (pos === "j") {
						const viewAs = button.link.viewAs;
						if (viewAs === "lebu") {
							const needs = target.needsToDiscard(2);
							val *= 1.08 + 0.2 * needs;
						} else if (viewAs === "shandian" || viewAs === "fulei") {
							val /= 2;
						}
					}
					if (att > 0) {
						val = -val;
					}
					if (pos !== "e") {
						return val;
					}
					const sub = get.subtypes(button.link);
					if (sub.includes("equip1")) {
						return (val * Math.min(3.6, target.hp)) / 3;
					}
					if (sub.includes("equip2")) {
						if (name === "baiyin" && pos === "e" && target.isDamaged()) {
							const by = 3 - 0.6 * Math.min(5, target.hp);
							return get.sgn(get.recoverEffect(target, player, player)) * by;
						}
						return 1.57 * val;
					}
					if (att <= 0 && (sub.includes("equip3") || sub.includes("equip4")) && (player.hasSkill("shouli") || player.hasSkill("psshouli"))) {
						return 0;
					}
					if (sub.includes("equip6")) {
						return val;
					}
					if (sub.includes("equip4")) {
						return val / 2;
					}
					if (sub.includes("equip3") && !game.hasPlayer(cur => !cur.inRange(target) && get.attitude(cur, target) < 0)) {
						return 0.4 * val;
					}
					return val;
				},
				result: {
					target(player, target) {
						const att = get.attitude(player, target);
						const hs = target.getDiscardableCards(player, "h");
						const es = target.getDiscardableCards(player, "e");
						const js = target.getDiscardableCards(player, "j");
						if (!hs.length && !es.length && !js.length) {
							return 0;
						}
						if (att > 0) {
							if (
								js.some(card => {
									const cardj = card.viewAs ? { name: card.viewAs } : card;
									if (cardj.name === "xumou_jsrg") {
										return false;
									}
									return get.effect(target, cardj, target, player) < 0;
								})
							) {
								return 3;
							}
							if (target.isDamaged() && es.some(card => card.name === "baiyin") && get.recoverEffect(target, player, player) > 0) {
								if (target.hp === 1 && !target.hujia) {
									return 1.6;
								}
							}
							if (es.some(card => get.value(card, target) < 0)) {
								return 1;
							}
							return -1.5;
						} else {
							const noh = hs.length === 0 || target.hasSkillTag("noh");
							const noe = es.length === 0 || target.hasSkillTag("noe");
							const noe2 = noe || !es.some(card => get.value(card, target) > 0);
							const noj =
								js.length === 0 ||
								!js.some(card => {
									const cardj = card.viewAs ? { name: card.viewAs } : card;
									if (cardj.name === "xumou_jsrg") {
										return true;
									}
									return get.effect(target, cardj, target, player) < 0;
								});
							if (noh && noe2 && noj) {
								return 1.5;
							}
							return -1.5;
						}
					},
				},
				tag: {
					loseCard: 1,
					discard: 1,
				},
			},
		},
		guohe_copy: {
			ai: {
				basic: {
					order: 9,
					useful: 5,
					value: 5,
				},
				result: {
					target(player, target, card) {
						let position = "hej";
						if (card && card.position) {
							position = card.position;
						}
						const att = get.attitude(player, target);
						const hs = position.includes("h") ? target.getDiscardableCards(player, "h") : [];
						const es = position.includes("e") ? target.getDiscardableCards(player, "e") : [];
						const js = position.includes("j") ? target.getDiscardableCards(player, "j") : [];
						if (!hs.length && !es.length && !js.length) {
							return 0;
						}
						if (att > 0) {
							if (
								js.some(card => {
									const cardj = card.viewAs ? { name: card.viewAs } : card;
									if (cardj.name === "xumou_jsrg") {
										return false;
									}
									return get.effect(target, cardj, target, player) < 0;
								})
							) {
								return 3;
							}
							if (target.isDamaged() && es.some(card => card.name === "baiyin") && get.recoverEffect(target, player, player) > 0) {
								if (target.hp === 1 && !target.hujia) {
									return 1.6;
								}
							}
							if (
								es.some(card => {
									return get.value(card, target) < 0;
								})
							) {
								return 1;
							}
							return -1.5;
						} else {
							const noh = hs.length === 0 || target.hasSkillTag("noh");
							const noe = es.length === 0 || target.hasSkillTag("noe");
							const noe2 =
								noe ||
								!es.some(card => {
									return get.value(card, target) > 0;
								});
							const noj =
								js.length === 0 ||
								!js.some(card => {
									const cardj = card.viewAs ? { name: card.viewAs } : card;
									if (cardj.name === "xumou_jsrg") {
										return true;
									}
									return get.effect(target, cardj, target, player) < 0;
								});
							if (noh && noe2 && noj) {
								return 1.5;
							}
							return -1.5;
						}
					},
				},
				tag: {
					loseCard: 1,
					discard: 1,
				},
			},
		},
		guohe_copy2: {
			ai: {
				basic: {
					order: 9,
					useful: 5,
					value: 5,
				},
				result: {
					target(player, target, card, isLink) {
						return lib.card.guohe_copy.ai.result.target(
							player,
							target,
							{
								name: "guohe_copy",
								position: "he",
							},
							isLink
						);
					},
				},
				tag: {
					loseCard: 1,
					discard: 1,
				},
			},
		},
		jiedao: {
			audio: true,
			fullskin: true,
			type: "trick",
			enable: true,
			singleCard: true,
			targetprompt: ["被借刀", "出杀目标"],
			complexSelect: true,
			complexTarget: true,
			multicheck() {
				const card = { name: "sha", isCard: true };
				return game.hasPlayer(current => {
					if (!current.getEquips(1).length) {
						return false;
					}
					return game.hasPlayer(current2 => current.inRange(current2) && !!lib.filter.targetEnabled(card, current, current2));
				});
			},
			filterTarget(card, player, target) {
				const sha = { name: "sha", isCard: true };
				return player !== target && target.getEquips(1).length > 0 && game.hasPlayer(current => target !== current && target.inRange(current) && lib.filter.targetEnabled(sha, target, current));
			},
			filterAddedTarget(card, player, target, preTarget) {
				const sha = { name: "sha", isCard: true };
				return target !== preTarget && preTarget.inRange(target) && lib.filter.targetEnabled(sha, preTarget, target);
			},
			async content(event, trigger, player) {
				const target = event.target;
				let result = { bool: false };
				if (!event.directHit && event.addedTarget && (_status.connectMode || !lib.config.skip_shan || target.hasSha())) {
					result = await target
						.chooseToUse(`对${get.translation(event.addedTarget)}使用一张杀，或令${get.translation(player)}获得你的武器牌`, (card, player, event) => {
							if (get.name(card) !== "sha") {
								return false;
							}
							return lib.filter.filterCard(card, player, event);
						})
						.set("targetRequired", true)
						.set("complexSelect", true)
						.set("complexTarget", true)
						.set("filterTarget", (card, player, target) => {
							if (target !== _status.event.sourcex && !ui.selected.targets.includes(_status.event.sourcex)) {
								return false;
							}
							return lib.filter.filterTarget(card, player, target);
						})
						.set("sourcex", event.addedTarget)
						.set("addCount", false)
						.set("respondTo", [player, event.card])
						.forResult();
				}
				if (!result.bool) {
					const cards = target.getGainableCards(player, "e", card => get.subtypes(card)?.includes("equip1"));
					if (cards.length) {
						await player.gain(cards, target, "give", "bySelf");
					}
				}
			},
			ai: {
				wuxie(target, card, player, viewer) {
					if (player === game.me && get.attitude(viewer, player._trueMe || player) > 0) {
						return 0;
					}
				},
				basic: {
					order: 8,
					value: 2,
					useful: 1,
				},
				result: {
					player: (player, target) => {
						if (!target.hasSkillTag("noe") && get.attitude(player, target) > 0) {
							return 0;
						}
						return (player.hasSkillTag("noe") ? 0.32 : 0.15) * target.getEquips(1).reduce((num, i) => num + get.value(i, player), 0);
					},
					target: (player, target, card) => {
						const targets = ui.selected.targets.slice();
						if (_status.event.preTarget) {
							targets.add(_status.event.preTarget);
						}
						if (targets.length) {
							const preTarget = targets.at(-1);
							const pre = _status.event.getTempCache("jiedao_result", preTarget.playerid);
							if (pre && pre.target && pre.target.isIn() && pre.card === ai.getCacheKey(card, true)) {
								return target === pre.target ? pre.res : 0;
							}
							return (get.effect(target, { name: "sha" }, preTarget, target) / get.attitude(target, target)) * preTarget.mayHaveSha(player, "use", null, "odds");
						}
						const odds = target.mayHaveSha(player, "use", null, "odds");
						let addTar = null;
						let sha = game
							.filterPlayer(cur => get.info({ name: "jiedao" }).filterAddedTarget(null, player, cur, target))
							.reduce((num, current) => {
								const eff = get.effect(current, { name: "sha" }, target, player);
								if (eff < num) {
									return num;
								}
								addTar = current;
								return eff;
							}, -Infinity);
						if (addTar) {
							sha = get.effect(addTar, { name: "sha" }, target, target) / 10;
						}
						let res = target.getEquips(1).reduce((num, i) => num + get.value(i, target), 0) / (target.hasSkillTag("noe") ? -2 : -4);
						if (odds > 0.06 && sha > res) {
							res += (sha - res) * odds;
						}
						_status.event.putTempCache("jiedao_result", target.playerid, {
							target: addTar,
							card: ai.getCacheKey(card, true),
							res: res,
						});
						return res;
					},
				},
				tag: {
					gain: 1,
					use: 1,
					useSha: 1,
					loseCard: 1,
				},
			},
		},
		wuxie: {
			audio: true,
			fullskin: true,
			type: "trick",
			ai: {
				basic: {
					useful: [6, 4, 3],
					value: [6, 4, 3],
				},
				result: { player: 1 },
				expose: 0.2,
			},
			notarget: true,
			finalDelay: false,
			defaultYingbianEffect: "draw",
			async contentBefore(event, trigger, player) {
				const card = event.card;
				if (get.mode() !== "guozhan" || !get.cardtag(card, "guo")) {
					return;
				}
				const triggerEvent = event.getParent(2)._trigger;
				if (triggerEvent.name === "phaseJudge" || triggerEvent.card.name === "wuxie" || triggerEvent.targets.length <= 1) {
					return;
				}
				const result = await player
					.chooseControl("对单体使用", "对势力使用")
					.set("prompt", `请选择${get.translation(card)}的使用方式`)
					.set("ai", () => "对势力使用")
					.forResult();
				if (result.control === "对势力使用") {
					player.chat("对势力使用");
					event.getParent().guowuxie = true;
				}
			},
			async content(event, trigger, player) {
				const triggerEvent = event.getParent(2)._trigger;
				if (triggerEvent.name === "phaseJudge") {
					triggerEvent.untrigger("currentOnly");
					triggerEvent.cancelled = true;
				} else {
					triggerEvent.neutralize();
					if (event.getParent().guowuxie === true) {
						triggerEvent.getParent().excluded.addArray(game.filterPlayer(current => current.isFriendOf(triggerEvent.target)));
					}
				}
				/*
					event.result={
						wuxied:true,
						directHit:evt.directHit||[],
						nowuxie:evt.nowuxie,
					};*/
				if (player.isOnline()) {
					player.send(player => {
						if (ui.tempnowuxie && !player.hasWuxie()) {
							ui.tempnowuxie.close();
							delete ui.tempnowuxie;
						}
					}, player);
				} else if (player === game.me) {
					if (ui.tempnowuxie && !player.hasWuxie()) {
						ui.tempnowuxie.close();
						delete ui.tempnowuxie;
					}
				}
			},
		},
		lebu: {
			audio: true,
			fullskin: true,
			type: "delay",
			filterTarget(card, player, target) {
				return lib.filter.judge(card, player, target) && player !== target;
			},
			judge(card) {
				if (get.suit(card) === "heart") {
					return 1;
				}
				return -2;
			},
			judge2(result) {
				if (result.bool === false) {
					return true;
				}
				return false;
			},
			async effect(event, trigger, player, result) {
				if (result.bool === false) {
					player.skip("phaseUse");
				}
			},
			ai: {
				basic: {
					order: 1,
					useful(card, i) {
						let player = _status.event.player;
						if (_status.event.isPhaseUsing()) {
							return game.hasPlayer(cur => {
								return cur !== player && lib.filter.judge(card, player, cur) && get.effect(cur, card, player, player) > 0;
							})
								? 4.2
								: 1;
						}
						return 1.3;
					},
					value: 8,
				},
				result: {
					ignoreStatus: true,
					target: (player, target) => {
						if (target === _status.currentPhase && target.skipList.includes("phaseUse")) {
							let evt = _status.event.getParent("phase");
							if (evt && evt.phaseList.indexOf("phaseJudge") <= evt.num) {
								return 0;
							}
						}
						let num = target.needsToDiscard(3),
							cf = Math.pow(get.threaten(target, player) + 0.6, 2);
						if (!num) {
							return -0.01 * cf;
						}
						if (target.hp > 2) {
							num--;
						}
						let dist = Math.sqrt(1 + get.distance(player, target, "absolute"));
						if (dist < 1) {
							dist = 1;
						}
						if (target.isTurnedOver()) {
							dist++;
						}
						return (Math.min(-0.1, -num) * cf) / dist;
					},
				},
				tag: {
					skip: "phaseUse",
				},
			},
		},
		shandian: {
			audio: true,
			fullskin: true,
			type: "delay",
			cardnature: "thunder",
			modTarget(card, player, target) {
				return lib.filter.judge(card, player, target);
			},
			enable(card, player) {
				return player.canAddJudge(card);
			},
			filterTarget(card, player, target) {
				return lib.filter.judge(card, player, target) && player === target;
			},
			selectTarget: [-1, -1],
			toself: true,
			judge(card) {
				if (get.suit(card) === "spade" && get.number(card) > 1 && get.number(card) < 10) {
					return -5;
				}
				return 1;
			},
			judge2(result) {
				if (result.bool === false) {
					return true;
				}
				return false;
			},
			async effect(event, trigger, player, result) {
				if (result.bool === false) {
					player.damage(3, "thunder", "nosource");
				} else {
					player.addJudgeNext(event.card);
				}
			},
			async cancel(event, trigger, player) {
				player.addJudgeNext(event.card);
			},
			ai: {
				basic: {
					order: 1,
					useful: 0,
					value: 0,
				},
				result: {
					target(player, target) {
						const num = game.countPlayer(current => {
							//var skills=current.getSkills();
							for (const skill of current.skills) {
								const rejudge = get.tag(skill, "rejudge", current);
								if (rejudge === undefined) {
									continue;
								}
								if (get.attitude(target, current) > 0 && get.attitude(current, target) > 0) {
									return rejudge;
								}
								return -rejudge;
							}
						});
						if (num > 0) {
							return num;
						}
						const mode = get.mode();
						if (mode === "identity") {
							if (target.identity === "nei") {
								return 1;
							}
							const situ = get.situation();
							if (target.identity === "fan") {
								if (situ > 1) {
									return 1;
								}
							} else if (situ < -1) {
								return 1;
							}
						} else if (mode === "guozhan") {
							if (target.identity === "ye") {
								return 1;
							}
							if (game.hasPlayer(current => current.identity === "unknown")) {
								return -1;
							}
							if (get.population(target.identity) === 1) {
								if (target.maxHp > 2 && target.hp < 2) {
									return 1;
								}
								if (game.countPlayer() < 3) {
									return -1;
								}
								if (target.hp <= 2 && target.countCards("he") <= 3) {
									return 1;
								}
							}
						}
						return -1;
					},
				},
				tag: {
					damage: 0.16,
					natureDamage: 0.16,
					thunderDamage: 0.16,
				},
			},
		},
		hanbing: {
			fullskin: true,
			type: "equip",
			subtype: "equip1",
			distance: { attackFrom: -1 },
			skills: ["hanbing_skill"],
			ai: {
				basic: {
					equipValue: 2,
				},
			},
		},
		renwang: {
			fullskin: true,
			type: "equip",
			subtype: "equip2",
			skills: ["renwang_skill"],
			ai: {
				basic: {
					equipValue: 7.5,
				},
			},
		},
	},
	skill: {
		qinglong_guozhan: {
			equipSkill: true,
			trigger: { player: "useCard" },
			forced: true,
			audio: "qinglong_skill",
			filter(event, player) {
				return get.mode() === "guozhan" && event.card.name === "sha";
			},
			async content(event, trigger, player) {
				if (!_status.qinglong_guozhan) {
					_status.qinglong_guozhan = [];
				}
				_status.qinglong_guozhan.add(trigger);
				for (const current of game.filterPlayer2()) {
					current.addTempSkill("qinglong_guozhan_mingzhi");
				}
				game.broadcast(
					list => {
						_status.qinglong_guozhan = list;
					},
					_status.qinglong_guozhan.map(i => ({ targets: i.targets }))
				);

				const next = game.createEvent("qinglong_guozhan");
				event.next.remove(next);
				trigger.after.add(next);
				next.setContent(async (event, trigger, player) => {
					_status.qinglong_guozhan.remove(event.parent);
					game.broadcast(
						list => {
							_status.qinglong_guozhan = list;
						},
						_status.qinglong_guozhan.map(i => ({ targets: i.targets }))
					);
				});
			},
		},
		qinglong_guozhan_mingzhi: {
			ai: {
				nomingzhi: true,
				skillTagFilter(player) {
					if (_status.qinglong_guozhan) {
						for (const info of _status.qinglong_guozhan) {
							if (info.targets.includes(player)) {
								return true;
							}
						}
					}
					return false;
				},
			},
		},
		hanbing_skill: {
			equipSkill: true,
			trigger: { source: "damageBegin2" },
			//direct:true,
			audio: true,
			filter(event) {
				return event.card && event.card.name === "sha" && event.notLink() && event.player.hasCards("he");
			},
			//priority:1,
			check(event, player) {
				const target = event.player;
				const eff = get.damageEffect(target, player, player, event.nature);
				if (get.attitude(player, target) > 0) {
					if (eff >= 0 || (event.nature && target.isLinked() && game.hasPlayer(current => current !== target && current.isLinked() && get.damageEffect(current, player, player, event.nature) > 0))) {
						return false;
					}
					return true;
				}
				if (eff <= 0) {
					return true;
				}
				if (target.hp === 1 || player.hasSkill("tianxianjiu")) {
					return false;
				}
				if (
					!target.hasSkillTag("filterDamage", null, {
						player: player,
						card: event.card,
						jiu: player.hasSkill("jiu"),
					})
				) {
					if (
						event.num > 1 ||
						player.hasSkillTag("damageBonus", true, {
							player: player,
							card: event.card,
						})
					) {
						return false;
					}
				}
				if (target.countCards("he") < 2) {
					return false;
				}
				const num = target.countCards("he", card => get.value(card) > 6);
				return num >= 2;
			},
			logTarget: "player",
			async content(event, trigger, player) {
				trigger.cancel();
				if (trigger.player.hasDiscardableCards(player, "he")) {
					player.line(trigger.player);
					await player.discardPlayerCard({
						target: trigger.player,
						position: "he",
						forced: true,
					});
				}
				if (trigger.player.hasDiscardableCards(player, "he")) {
					player.line(trigger.player);
					await player.discardPlayerCard({
						target: trigger.player,
						position: "he",
						forced: true,
					});
				}
			},
		},
		icesha_skill: {
			inherit: "hanbing_skill",
			trigger: { source: "damageBegin3" },
			equipSkill: false,
			ruleSkill: true,
			filter(event) {
				return event.hasNature("ice") && event.notLink() && event.player.hasCards("he");
			},
		},
		renwang_skill: {
			equipSkill: true,
			trigger: { target: "shaBegin" },
			forced: true,
			priority: 6,
			audio: true,
			filter(event, player) {
				if (player.hasSkillTag("unequip2")) {
					return false;
				}
				if (
					event.player.hasSkillTag("unequip", false, {
						name: event.card ? event.card.name : null,
						target: player,
						card: event.card,
					})
				) {
					return false;
				}
				return event.card.name === "sha" && get.color(event.card) === "black";
			},
			async content(event, trigger, player) {
				trigger.cancel();
			},
			ai: {
				effect: {
					target(card, player, target) {
						if (typeof card !== "object" || target.hasSkillTag("unequip2")) {
							return;
						}
						if (
							player.hasSkillTag("unequip", false, {
								name: card ? card.name : null,
								target: target,
								card: card,
							}) ||
							player.hasSkillTag("unequip_ai", false, {
								name: card ? card.name : null,
								target: target,
								card: card,
							})
						) {
							return;
						}
						if (card.name === "sha" && get.color(card) === "black") {
							return "zeroplayertarget";
						}
					},
				},
			},
		},
		zhuge_skill: {
			equipSkill: true,
			audio: true,
			firstDo: true,
			trigger: { player: "useCard1" },
			forced: true,
			filter(event, player) {
				return !event.audioed && event.card.name === "sha" && player.countUsed("sha", true) > 1 && event.getParent().type === "phase";
			},
			async content(event, trigger, player) {
				trigger.audioed = true;
			},
			mod: {
				cardUsable(card, player, num) {
					const cards = player.getCards("e", card => get.name(card) === "zhuge");
					if (card.name === "sha") {
						if (!cards.length || player.hasSkill("zhuge_skill", null, false) || cards.some(card => card !== _status.zhuge_temp && !ui.selected.cards.includes(card))) {
							if (get.is.versus() || get.is.changban()) {
								return num + 3;
							}
							return Infinity;
						}
					}
				},
				cardEnabled2(card, player) {
					if (!_status.event.addCount_extra || player.hasSkill("zhuge_skill", null, false)) {
						return;
					}
					const cards = player.getCards("e", card => get.name(card) === "zhuge");
					if (card && cards.includes(card)) {
						let cardz;
						try {
							cardz = get.card();
						} catch (e) {
							return;
						}
						if (!cardz || cardz.name !== "sha") {
							return;
						}
						_status.zhuge_temp = card;
						const bool = lib.filter.cardUsable(get.autoViewAs(cardz, ui.selected.cards.concat([card])), player);
						delete _status.zhuge_temp;
						if (!bool) {
							return false;
						}
					}
				},
			},
		},
		cixiong_skill: {
			equipSkill: true,
			trigger: { player: "useCardToPlayered" },
			audio: true,
			logTarget: "target",
			check(event, player) {
				if (get.attitude(player, event.target) > 0) {
					return true;
				}
				const target = event.target;
				return !target.hasSkillTag("noh") || !target.hasCards("h");
			},
			filter(event, player) {
				if (event.card.name !== "sha") {
					return false;
				}
				return player.differentSexFrom(event.target);
			},
			async content(event, trigger, player) {
				if (!trigger.target.hasCards("h")) {
					await player.draw();
					return;
				}

				const result = await trigger.target
					.chooseToDiscard({
						prompt: `弃置一张手牌，或令${get.translation(player)}摸一张牌`,
						ai(card) {
							const { bool, shan } = get.event();
							if (!bool) {
								return 0;
							}
							if (get.name(card) === "shan") {
								return bool - shan * get.value(card);
							}
							return bool - get.value(card);
						},
					})
					.set(
						"bool",
						(() => {
							const hs = trigger.target.countCards("h");
							const att = get.attitude(trigger.target, trigger.player);
							if (!hs || att > 0) {
								return false;
							}
							if (trigger.target.hasSkillTag("noh")) {
								return 8;
							}
							if (get.effect(trigger.target, trigger.card, player, trigger.target) >= 0) {
								return 6;
							}
							return -att - Math.max(0, 4 - trigger.target.hp) * 2;
						})()
					)
					.set(
						"shan",
						(() => {
							if (
								player.hasSkillTag("directHit_ai", true, {
									target: trigger.target,
									card: trigger.card,
								})
							) {
								return 0;
							}
							const shans = trigger.target.mayHaveShan(trigger.target, "use", true, "count");
							if (shans === 0 || shans > 2) {
								return 1;
							}
							if (shans === 1) {
								return 3.6 / Math.min(3.6, trigger.target.getHp());
							}
							return 1.8 / Math.min(1.8, trigger.target.getHp());
						})()
					);

				if (!result?.bool) {
					player.draw();
				}
			},
		},
		qinggang_skill: {
			equipSkill: true,
			audio: true,
			trigger: {
				player: "useCardToPlayered",
			},
			filter(event) {
				return event.card.name === "sha";
			},
			forced: true,
			logTarget: "target",
			async content(event, trigger, player) {
				trigger.target.addTempSkill("qinggang2");
				trigger.target.storage.qinggang2.add(trigger.card);
				trigger.target.markSkill("qinggang2");
			},
			ai: {
				unequip_ai: true,
				skillTagFilter(player, tag, arg) {
					if (arg && arg.name === "sha") {
						return true;
					}
					return false;
				},
			},
		},
		qinggang2: {
			firstDo: true,
			ai: { unequip2: true },
			init(player, skill) {
				if (!player.storage[skill]) {
					player.storage[skill] = [];
				}
			},
			onremove: true,
			trigger: {
				player: ["damage", "damageCancelled", "damageZero"],
				source: ["damage", "damageCancelled", "damageZero"],
				target: ["shaMiss", "useCardToExcluded", "useCardToEnd", "eventNeutralized"],
				global: ["useCardEnd"],
			},
			charlotte: true,
			filter(event, player) {
				const evt = event.getParent("useCard", true, true);
				if (evt && evt.effectedCount < evt.effectCount) {
					return false;
				}
				return player.storage.qinggang2 && event.card && player.storage.qinggang2.includes(event.card) && (event.name !== "damage" || event.notLink());
			},
			silent: true,
			forced: true,
			popup: false,
			priority: 12,
			async content(event, trigger, player) {
				player.storage.qinggang2.remove(trigger.card);
				if (!player.storage.qinggang2.length) {
					player.removeSkill("qinggang2");
				}
			},
			marktext: "※",
			intro: { content: "当前防具技能已失效" },
		},
		qinglong_skill: {
			audio: true,
			equipSkill: true,
			trigger: { player: ["shaMiss", "eventNeutralized"] },
			direct: true,
			filter(event, player) {
				if (get.mode() === "guozhan" || !event.card || event.card.name !== "sha") {
					return false;
				}
				return event.target.isIn() && player.canUse("sha", event.target, false) && (player.hasSha() || (_status.connectMode && player.hasCards("hs")));
			},
			async content(event, trigger, player) {
				await player
					.chooseToUse({
						prompt: get.prompt("qinglong", trigger.target),
						filterCard(card, player, event) {
							if (get.name(card) !== "sha") {
								return false;
							}
							if (player.hasSkill("qinglong_skill", null, false)) {
								return lib.filter.filterCard.apply(this, arguments);
							}
							const cards = player.getCards("e", card => get.name(card) === "qinglong");
							if (!cards.some(card2 => card2 !== card && !ui.selected.cards.includes(card2))) {
								return false;
							}
							return lib.filter.filterCard.apply(this, arguments);
						},
						filterTarget: get.filter(trigger.target, 2),
						selectTarget: -1,
					})
					.set("addCount", false)
					.set("logSkill", "qinglong_skill");
			},
		},
		zhangba_skill: {
			audio: true,
			equipSkill: true,
			enable: ["chooseToUse", "chooseToRespond"],
			filterCard: true,
			selectCard: 2,
			position: "hs",
			viewAs: { name: "sha" },
			complexCard: true,
			filter(event, player) {
				return player.countCards("hs") >= 2;
			},
			prompt: "将两张手牌当杀使用或打出",
			check(card) {
				const player = get.player();
				if (player.hasCards("hs", card => get.name(card) === "sha")) {
					return 0;
				}
				if (_status.event && _status.event.name === "chooseToRespond" && player.hp < 3 && !player.hasCards("hs", card => get.name(card) !== "tao" && get.name(card) !== "jiu")) {
					return (player.hp > 1 ? 10 : 8) - get.value(card);
				}
				return Math.max(5, 8 - 0.7 * player.hp) - get.value(card);
			},
			ai: {
				respondSha: true,
				skillTagFilter(player) {
					return player.countCards("hs") >= 2;
				},
			},
		},
		guanshi_skill: {
			equipSkill: true,
			trigger: {
				player: ["shaMiss", "eventNeutralized"],
			},
			direct: true,
			audio: true,
			filter(event, player) {
				if (event.type !== "card" || event.card.name !== "sha" || !event.target.isIn()) {
					return false;
				}
				let min = 2;
				if (!player.hasSkill("guanshi_skill", null, false)) {
					min += player.hasCards("e", card => get.name(card) === "guanshi") ? 1 : 0;
				}
				return player.countCards("he") >= min;
			},
			async content(event, trigger, player) {
				// 装备区内可能有多个贯石斧 或者玩家可能通过其他渠道获得贯石斧技能 只要留一张贯石斧不扔掉即可
				const result = await player
					.chooseToDiscard({
						prompt: get.prompt("guanshi"),
						filterCard(card, player) {
							if (_status.event.ignoreCard) {
								return true;
							}
							const cards = get.event().cardxs;
							if (!cards.includes(card)) {
								return true;
							}
							return cards.some(cardx => cardx !== card && !ui.selected.cards.includes(cardx));
						},
						selectCard: 2,
						position: "he",
						ai(card) {
							const evt = get.event().getTrigger();
							if (get.attitude(evt.player, evt.target) < 0) {
								if (evt.player.needsToDiscard()) {
									return 15 - get.value(card);
								}
								if (evt.baseDamage + evt.extraDamage >= Math.min(2, evt.target.hp)) {
									return 8 - get.value(card);
								}
								return 5 - get.value(card);
							}
							return -1;
						},
					})
					.set(
						"cardxs",
						player.getCards("e", card => get.name(card) === "guanshi")
					)
					.set("ignoreCard", player.hasSkill("guanshi_skill", null, false))
					.set("complexCard", true)
					.set("logSkill", "guanshi_skill")
					.forResult();

				if (result.bool) {
					if (event.triggername === "shaMiss") {
						trigger.untrigger();
						trigger.trigger("shaHit");
						trigger._result.bool = false;
						trigger._result.result = null;
					} else {
						trigger.unneutralize();
					}
				}
			},
			ai: {
				directHit_ai: true,
				skillTagFilter(player, tag, arg) {
					if (player._guanshi_temp) {
						return;
					}
					player._guanshi_temp = true;
					const bool = get.attitude(player, arg.target) < 0 && arg.card && arg.card.name === "sha" && player.countCards("he", card => card !== player.getEquip("guanshi") && card !== arg.card && (!arg.card.cards || !arg.card.cards.includes(card)) && get.value(card) < 5) > 1;
					delete player._guanshi_temp;
					return bool;
				},
			},
		},
		fangtian_skill: {
			equipSkill: true,
			audio: true,
			trigger: { player: "useCard1" },
			forced: true,
			firstDo: true,
			filter(event, player) {
				if (event.card.name !== "sha" || get.mode() === "guozhan") {
					return false;
				}
				const card = event.card;
				let range;
				const select = get.copy(get.info(card).selectTarget);
				if (select === undefined) {
					if (get.info(card).filterTarget === undefined) {
						return false;
					}
					range = [1, 1];
				} else if (typeof select === "number") {
					range = [select, select];
				} else if (get.itemtype(select) === "select") {
					range = select;
				} else if (typeof select === "function") {
					range = select(card, player);
					if (typeof range === "number") {
						range = [range, range];
					}
				}
				game.checkMod(card, player, range, "selectTarget", player);
				return range[1] !== -1 && event.targets.length > range[1];
			},
			async content(_) {},
			mod: {
				selectTarget(card, player, range) {
					if (card.name !== "sha") {
						return;
					}
					if (get.mode() === "guozhan") {
						return;
					}
					if (range[1] === -1) {
						return;
					}
					const cards = player.getCards("h");
					if (!cards.length) {
						return;
					}
					if (cards.every(card => ui.selected.cards.includes(card)) && ui.selected.cards.length === cards.length) {
						range[1] += 2;
					}
				},
			},
		},
		fangtian_guozhan: {
			equipSkill: true,
			trigger: { player: "useCard2" },
			filter(event, player) {
				if (get.mode() !== "guozhan") {
					return false;
				}
				if (event.card.name !== "sha") {
					return false;
				}
				return game.hasPlayer(target => {
					if (event.targets.includes(target)) {
						return false;
					}
					if (!lib.filter.filterTarget(event.card, player, target)) {
						return false;
					}
					if (target.identity === "ye" || target.identity === "unknown") {
						return true;
					}
					for (const targetx of event.targets) {
						if (target.identity === targetx.identity) {
							return false;
						}
					}
					return true;
				});
			},
			log: false,
			async cost(event, trigger, player) {
				const next = player.chooseTarget({
					prompt: get.prompt2("fangtian"),
					filterTarget,
					selectTarget: [1, Infinity],
					complexTarget: true,
					ai: check,
				});
				next.set("promptbar", "none");
				next.set("targets", trigger.targets);
				next.set("cardx", trigger.card);

				event.result = await next.forResult();

				return;

				function filterTarget(card, player, target) {
					const cardx = get.event().cardx;

					if (!lib.filter.filterTarget(cardx, player, target)) {
						return false;
					}

					const targets = get.event().targets.concat(ui.selected.targets);

					if (targets.includes(target)) {
						return false;
					}
					if (target.identity === "ye" || target.identity === "unknown") {
						return true;
					}

					for (let i = 0; i < targets.length; i++) {
						if (target.identity === targets[i].identity) {
							return false;
						}
					}

					return true;
				}

				function check(target) {
					const player = get.player();
					const card = get.event().cardx;
					return get.effect(target, card, player, player);
				}
			},
			async content(event, trigger, player) {
				player.logSkill("fangtian_skill", event.targets);

				trigger.targets.addArray(event.targets);
				player.addTempSkill(`${event.name}_trigger`);
				player.markAuto(`${event.name}_trigger`, [trigger.card]);
			},
			subSkill: {
				trigger: {
					trigger: { player: ["shaMiss", "useCardAfter", "useCardCancelled"] },
					filter(event, player) {
						return player.getStorage("fangtian_guozhan_trigger").includes(event.card);
					},
					silent: true,
					onremove: true,
					charlotte: true,
					async content(event, trigger, player) {
						if (event.triggername === "shaMiss" && player.getStorage(event.name).includes(trigger.card)) {
							trigger.getParent()?.excluded.addArray(trigger.getParent()?.targets);
						} else {
							player.unmarkAuto(event.name, [trigger.card]);
						}
					},
				},
			},
		},
		qilin_skill: {
			equipSkill: true,
			trigger: { source: "damageBegin2" },
			filter(event, player) {
				return event.card && event.card.name === "sha" && event.notLink() && event.player.hasCards("e", { subtype: ["equip3", "equip4", "equip6"] });
			},
			direct: true,
			audio: true,
			async content(event, trigger, player) {
				const att = get.attitude(player, trigger.player) <= 0;
				const result = await player
					.chooseButton({
						createDialog: [`是否发动【麒麟弓】，弃置${get.translation(trigger.player)}的一张坐骑牌？`, trigger.player.getCards("e", { subtype: ["equip3", "equip4", "equip6"] })],
						ai(button) {
							if (get.event().att) {
								return get.buttonValue(button);
							}
							return 0;
						},
					})
					.set("att", att)
					.forResult();
				if (result.bool && result.links?.length) {
					player.logSkill("qilin_skill", trigger.player);
					trigger.player.discard(result.links[0]);
				}
			},
		},
		bagua_skill: {
			equipSkill: true,
			trigger: { player: ["chooseToRespondBegin", "chooseToUseBegin"] },
			filter(event, player) {
				if (event.responded) {
					return false;
				}
				if (event.bagua_skill) {
					return false;
				}
				if (!event.filterCard || !event.filterCard({ name: "shan" }, player, event)) {
					return false;
				}
				if (event.name === "chooseToRespond" && !lib.filter.cardRespondable({ name: "shan" }, player, event)) {
					return false;
				}
				if (player.hasSkillTag("unequip2")) {
					return false;
				}
				const evt = event.getParent();
				return !evt?.player.hasSkillTag("unequip", false, {
					name: evt.card ? evt.card.name : null,
					target: player,
					card: evt.card,
				});
			},
			audio: true,
			check(event, player) {
				if (!event) {
					return true;
				}
				if (event.ai) {
					const ai = event.ai;
					const tmp = _status.event;
					_status.event = event;
					const result = ai({ name: "shan" }, _status.event.player, event);
					_status.event = tmp;
					return result > 0;
				}
				const type = event.name === "chooseToRespond" ? "respond" : "use";
				const evt = event.getParent();
				if (player.hasSkillTag("noShan", null, type)) {
					return false;
				}
				if (!evt || !evt.card || !evt.player || player.hasSkillTag("useShan", null, type)) {
					return true;
				}
				if (evt.card && evt.player && player.isLinked() && game.hasNature(evt.card) && get.attitude(player, evt.player._trueMe || evt.player) > 0) {
					return false;
				}
				return true;
			},
			async content(event, trigger, player) {
				trigger.bagua_skill = true;
				const judgeEvent = player.judge("bagua", card => (get.color(card) === "red" ? 1.5 : -0.5));
				judgeEvent.judge2 = result => result.bool;
				const result = await judgeEvent.forResult();
				if (result.judge > 0) {
					trigger.untrigger();
					trigger.set("responded", true);
					trigger.result = { bool: true, card: { name: "shan", isCard: true } };
				}
			},
			ai: {
				respondShan: true,
				freeShan: true,
				skillTagFilter(player, tag, arg) {
					if (tag !== "respondShan" && tag !== "freeShan") {
						return;
					}
					if (player.hasSkillTag("unequip2")) {
						return false;
					}
					if (!arg || !arg.player) {
						return true;
					}
					if (
						arg.player.hasSkillTag("unequip", false, {
							target: player,
						})
					) {
						return false;
					}
					return true;
				},
				effect: {
					target(card, player, target, effect) {
						if (target.hasSkillTag("unequip2")) {
							return;
						}
						if (
							player.hasSkillTag("unequip", false, {
								name: card ? card.name : null,
								target: target,
								card: card,
							}) ||
							player.hasSkillTag("unequip_ai", false, {
								name: card ? card.name : null,
								target: target,
								card: card,
							})
						) {
							return;
						}
						if (get.tag(card, "respondShan")) {
							return 0.5;
						}
					},
				},
			},
		},
		jueying_wancheng: {
			trigger: {
				player: "damageBegin4",
			},
			filter(event, player) {
				return (
					lib.card.jueying.battleOfWancheng() &&
					player.hasCard(card => {
						return get.name(card, player) === "jueying";
					}, "e")
				);
			},
			check(event, player) {
				if (event.num <= 0) {
					return false;
				}
				let eff = get.damageEffect(player, event.source, get.event().player, event.nature);
				if (eff >= 0 || (event.source && event.source.isIn() && get.attitude(get.event().player, event.source) > 0 && get.damageEffect(player, event.source, event.source, event.nature) > 0)) {
					return false;
				}
				if (event.num >= player.hp + (event.source && event.source.hasSkillTag("jueqing", false, player) ? 0 : player.hujia)) {
					return true;
				}
				return (
					player
						.getCards("e", card => {
							return get.name(card, player) === "jueying";
						})
						.reduce((acc, i) => acc - get.value(i, player), 0) >
					eff * event.num
				);
			},
			prompt: "是否发动〖绝影〗，将装备区内的【绝影】置入弃牌堆并防止此伤害？",
			async content(event, trigger, player) {
				const e3 = player.getCards("e", card => {
					return get.name(card, player) === "jueying";
				});
				if (e3.length) {
					await player.loseToDiscardpile(e3);
				}
				trigger.cancel();
			},
		},
		_wuxie: {
			trigger: { player: ["useCardToBegin", "phaseJudge"] },
			priority: 5,
			popup: false,
			forced: true,
			silent: true,
			filter(event, player) {
				if (event.card.storage?.nowuxie) {
					return false;
				}
				let card = event.card;
				if (event.name === "phaseJudge" && card.viewAs) {
					card = { name: card.viewAs };
				}
				const info = get.info(card);
				if (info.wuxieable === false) {
					return false;
				}
				if (event.name !== "phaseJudge") {
					if (event.getParent().nowuxie) {
						return false;
					}
					if (event.player.hasSkillTag("playernowuxie", false, event.card)) {
						return false;
					}
					if (get.type(event.card) !== "trick" && !info.wuxieable) {
						return false;
					}
				}
				return true;
			},
			forceLoad: true,
			forceDie: true,
			content: [
				async (event, trigger, player, result) => {
					delete event.wuxieresult;
					delete event.wuxieresult2;
					delete event._result;
					delete event.resultOL;
					delete event._info_map;
					//创建map存储各种信息，用于hasHiddenWuxie判断
					const map = {};
					event._info_map = map;
					let card = trigger.card;
					let state = true;
					if (trigger.name === "phaseJudge") {
						if (get.itemtype(card) === "card" && card.viewAs) {
							card = get.autoViewAs({ name: card.viewAs }, [card]);
						}
						map.target = trigger.player;
						map.isJudge = true;
					} else {
						map.player = trigger.player;
						if (trigger.multitarget) {
							map.multitargets = true;
						}
						map.target = trigger.target;
						map.targets = trigger.targets;
						map.tempnowuxie = trigger.targets && trigger.targets.length > 1 && !trigger.multitarget;
						map.noai = Boolean(trigger.getParent().noai);
						//如果对拼无懈，获取历史数据
						if (card.name === "wuxie") {
							let evt = event;
							while (true) {
								evt = evt.getParent(5);
								if (!evt || evt.name !== "_wuxie") {
									break;
								}
								state = !state;
								const evtmap = evt._info_map;
								if (evtmap.card.name !== "wuxie") {
									map._source = evtmap;
								}
							}
						}
					}
					map.card = card;
					map.state = state ? 1 : -1;
					map.id2 = trigger.getParent().id;
					event._global_waiting = true;
					//发送函数
					event.send = (player, map, skillState, eventData) => {
						//获取技能数据
						if (skillState) {
							player.applySkills(skillState);
						}
						//生成描述提示
						let prompt = "";
						let evtmap = map;
						const state = map.state;
						if (map._source) {
							evtmap = map._source;
						}
						if (evtmap.isJudge) {
							prompt += `${get.translation(evtmap.target)}的${get.translation(evtmap.card)}即将${state > 0 ? "生" : "失"}效。`;
						} else {
							prompt += get.translation(evtmap.player);
							if (evtmap.multitarget) {
								if (evtmap.targets.length) {
									prompt += "对";
									prompt += get.translation(evtmap.targets);
								}
							} else if (evtmap.target) {
								prompt += "对";
								prompt += evtmap.target === evtmap.player ? "自己" : get.translation(evtmap.target);
							}
							prompt += `使用的${get.translation(evtmap.card)}`;
							prompt += `即将${state > 0 ? "生" : "失"}效。`;
						}
						prompt += "是否使用【无懈可击】？";
						if (player.isUnderControl(true) && !_status.auto && !ui.tempnowuxie && map.tempnowuxie) {
							let translation = get.translation(map.card.name);
							if (translation.length >= 4) {
								translation = lib.translate[`${map.card.name}_ab`] || translation.slice(0, 2);
							}
							ui.tempnowuxie = ui.create.control(`不无懈${translation}`, ui.click.tempnowuxie, "stayleft");
							ui.tempnowuxie._origin = map.id2;
						}
						const next = player.chooseToUse({
							filterCard(card, player) {
								if (get.name(card) !== "wuxie") {
									return false;
								}
								return lib.filter.cardEnabled(card, player, "forceEnable");
							},
							prompt: prompt,
							type: "wuxie",
							_global_waiting: true,
							ai1() {
								if (map.isJudge) {
									const card = evtmap.card;
									const source = evtmap.target;
									const name = card.viewAs || card.name;
									const info = lib.card[name];
									if (info && info.ai && info.ai.wuxie) {
										const aiii = info.ai.wuxie(source, card, source, _status.event.player, state);
										if (typeof aiii === "number") {
											return aiii;
										}
									}
									if (Math.abs(get.attitude(_status.event.player, source)) < 3) {
										return 0;
									}
									if (source.hasSkillTag("nowuxie_judge") || (source.hasSkillTag("guanxing") && (source !== player || !source.hasSkill("guanxing_fail")))) {
										return 0;
									}
									if (name !== "lebu" && name !== "bingliang" && source !== _status.event.player) {
										return 0;
									}
									if (name === "bingliang" && source.countCards("j") > 0 && source.countCards("h") >= source.hp - 1) {
										return 0;
									}
									let card2;
									if (name !== card.name) {
										card2 = { name };
									} else {
										card2 = card;
									}
									const eff = get.effect(source, card2, source, source);
									if (eff >= 0) {
										return 0;
									}
									return state * get.attitude(_status.event.player, source);
								}
								if (evtmap.target) {
									const triggerevent = _status.event.getTrigger();
									if (triggerevent && triggerevent.parent && triggerevent.parent.postAi && triggerevent.player.isUnknown(_status.event.player)) {
										return 0;
									}
									const card = evtmap.card;
									const target = evtmap.target;
									const source = evtmap.player;
									const info = get.info(card);
									if (info.ai && info.ai.wuxie) {
										const aiii = info.ai.wuxie(target, card, source, _status.event.player, state);
										if (typeof aiii === "number") {
											return aiii;
										}
									}
									if (info.multitarget && evtmap.targets) {
										let eff = 0;
										for (const target of evtmap.targets) {
											eff += get.effect(target, card, source, _status.event.player);
										}
										return -eff * state;
									}
									if (Math.abs(get.attitude(_status.event.player, target)) < 3) {
										return 0;
									}
									return -get.effect(target, card, source, _status.event.player) * state;
								}
								const triggerevent = _status.event.getTrigger();
								if (triggerevent && triggerevent.parent && triggerevent.parent.postAi && triggerevent.player.isUnknown(_status.event.player)) {
									return 0;
								}
								const card = evtmap.card;
								const source = evtmap.player;
								const info = get.info(card);
								if (info.ai && info.ai.wuxie) {
									const aiii = info.ai.wuxie(undefined, card, source, _status.event.player, state);
									if (typeof aiii === "number") {
										return aiii;
									}
								}
								if (Math.abs(get.attitude(_status.event.player, source)) < 3) {
									return 0;
								}
								return -get.attitude(_status.event.player, source) * state;
							},
							source: evtmap.target,
							source2: evtmap.targets,
							id: map.id,
							id2: map.id2,
							state: state,
							info_map: map,
						});
						if (map.card && map.player) {
							next.respondTo = [map.player, map.card];
						}
						if (game.online) {
							_status.event._resultid = map.id;
							game.resume();
						} else {
							next.nouse = true;
						}
						if (eventData) {
							for (const key in eventData) {
								if (next[key] === undefined) {
									next[key] = eventData[key];
								}
							}
						}
					};
				},
				async (event, trigger, player, result) => {
					//判断谁有无懈
					const map = event._info_map;
					const list = game.filterPlayer(current => {
						if (event.triggername === "phaseJudge") {
							if (game.checkMod(map.card, map.target, current, "unchanged", "wuxieJudgeEnabled", current) === false) {
								return false;
							}
							if (game.checkMod(map.card, map.target, current, "unchanged", "wuxieJudgeRespondable", map.target) === false) {
								return false;
							}
						} else {
							if (trigger.getParent().directHit.includes(current)) {
								return false;
							}
							if (game.checkMod(map.card, map.player, map.target, current, "unchanged", "wuxieEnabled", current) === false) {
								return false;
							}
							if (game.checkMod(map.card, map.player, map.target, current, "unchanged", "wuxieRespondable", map.player) === false) {
								return false;
							}
						}
						return current.hasWuxie(map);
					});
					event.list = list;
					if (!event.id) {
						event.id = get.id();
					}
					map.id = event.id;
					list.sortBySeat(_status.currentPhase);
				},
				async (event, trigger, player, result) => {
					if (event.list.length === 0) {
						event.finish();
					} else if (_status.connectMode && (event.list[0].isOnline() || event.list[0] === game.me)) {
						event.goto(4);
					} else {
						event.current = event.list.shift();
						event.send(event.current, event._info_map);
					}
				},
				async (event, trigger, player, result) => {
					if (result.bool) {
						event.wuxieresult = event.current;
						event.wuxieresult2 = result;
						event.goto(8);
					} else {
						event.goto(2);
					}
				},
				async (event, trigger, player, result) => {
					const id = event.id;
					const sendback = (result, player) => {
						if (result && result.id === id && !event.wuxieresult && result.bool) {
							event.wuxieresult = player;
							event.wuxieresult2 = result;
							game.broadcast("cancel", id);
							return () => {
								let evt = get.event();
								if (evt.getParent().name === "chooseToUse") {
									evt = evt.getParent();
								}
								if (evt.id === id && evt.name === "chooseToUse" && _status.paused) {
									event.resultOL = _status.event.resultOL;
								}
								if (_status.event._parent_id === id) {
									ui.click.cancel();
									if (_status.event.getParent().name === "chooseToUse" && _status.event.getParent().id === id) {
										_status.event.getParent().cancel(null, null, true);
										if (ui.confirm) {
											ui.confirm.close();
										}
									}
								}
								if (_status.event.id === id) {
									if (_status.event._backup) {
										ui.click.cancel();
									}
									ui.click.cancel();
									if (ui.confirm) {
										ui.confirm.close();
									}
									if (_status.event.result) {
										_status.event.result.id = id;
									}
								}
							};
						}
						let evt = get.event();
						//判断主机是否还在特殊框架内转化卡牌
						if (evt.getParent()?.name === "chooseToUse") {
							evt = evt.getParent();
						}
						if (evt.id === id && evt.name === "chooseToUse" && _status.paused) {
							return () => {
								//如果主机还在想要不要打无懈(包括chooseButton+backup框架)的情况下所有客机均完成响应执行的代码
								event.resultOL = _status.event.resultOL;
							};
						}
						//主机完成响应后所有客机完成响应后执行的代码
						return () => {
							//判断本次_wuxie事件是否在“暂停”状态
							if (get.event().name === "_wuxie" && _status.paused && get.event().withol && get.event().step === 6) {
								game.resume();
							}
						};
					};

					let withme = false;
					let withol = false;
					const list = event.list;
					let dx = 0;
					for (const [i, current] of [...list].entries()) {
						if (current.isOnline()) {
							withol = true;
							const onchooseToUse_data = current.chooseToUse();
							onchooseToUse_data.setContent(async () => {});
							event.next.remove(onchooseToUse_data);
							const skills = current.getSkills("invisible").concat(lib.skill.global);
							game.expandSkills(skills);
							for (const skill of skills) {
								const info = lib.skill[skill];
								if (info?.onChooseToUse) {
									info.onChooseToUse(onchooseToUse_data);
								}
							}
							onchooseToUse_data.cancel(null, null, true);
							current.wait(sendback);
							current.send(event.send, current, event._info_map, get.skillState(current), onchooseToUse_data);
							list.splice(i - dx, 1);
							++dx;
						} else if (current === game.me) {
							withme = true;
							event.send(current, event._info_map);
							list.splice(i - dx, 1);
							++dx;
						}
					}
					if (!withme) {
						event.goto(6);
					}
					if (_status.connectMode && (withme || withol)) {
						for (const player of game.players) {
							player.showTimer();
						}
					}
					event.withol = withol;
				},
				async (event, trigger, player, result) => {
					if (result && result.bool && !event.wuxieresult) {
						game.broadcast("cancel", event.id);
						event.wuxieresult = game.me;
						event.wuxieresult2 = result;
					}
				},
				async (event, trigger, player, result) => {
					if (event.withol && !event.wuxieresult && !event.resultOL) {
						game.pause();
					}
				},
				async (event, trigger, player, result) => {
					for (const player of game.players) {
						player.hideTimer();
					}
				},
				async (event, trigger, player, result) => {
					if (event.wuxieresult2 && event.wuxieresult2._sendskill) {
						lib.skill[event.wuxieresult2._sendskill[0]] = event.wuxieresult2._sendskill[1];
					}
					if (event.wuxieresult && event.wuxieresult2 && event.wuxieresult2.skill) {
						const info = get.info(event.wuxieresult2.skill);
						if (info && info.precontent && !game.online) {
							const next = game.createEvent(`pre_${event.wuxieresult2.skill}`);
							next.setContent(info.precontent);
							next.set("result", event.wuxieresult2);
							next.set("player", event.wuxieresult);
						}
					}
				},
				async (event, trigger, player, result) => {
					if (event?.wuxieresult2?.cancel) {
						event.goto(0);
					} else if (event.wuxieresult) {
						const next = event.wuxieresult.useResult(event.wuxieresult2);
						if (event.triggername !== "phaseJudge") {
							next.respondTo = [trigger.player, trigger.card];
						}
					}
				},
			],
		},
		/*
			_wuxie:{
				trigger:{player:['useCardToBegin','phaseJudge']},
				priority:5,
				popup:false,
				forced:true,
				filter:function(event,player){
					if(event.card.storage&&event.card.storage.nowuxie) return false;
					var card=event.card;
					if(event.name=='phaseJudge'&&card.viewAs) card={name:card.viewAs};
					var info=get.info(card);
					if(info.wuxieable===false) return false;
					if(event.name!='phaseJudge'){
						if(event.getParent().nowuxie) return false;
						if(!event.target){
							if(info.wuxieable) return true;
							return false;
						}
						if(event.player.hasSkillTag('playernowuxie',false,event.card)) return false;
						if(get.type(event.card)!='trick'&&!info.wuxieable) return false;
					}
					return true;
				},
				forceLoad:true,
				content:function(){
					'step 0'
					delete event.wuxieresult;
					delete event.wuxieresult2;
					if(trigger.multitarget){
						event.targets=trigger.targets;
					}
					event.target=trigger.target;
					if(event.triggername=='phaseJudge'){
						event.target=trigger.player;
					}
					event.sourcex=event.targets||event.target;
					if(!event.targets&&trigger.targets&&trigger.targets.length==1){
						event.sourcex2=trigger.player;
					}
					event.source=trigger.player;
					if(event.state==undefined) event.state=true;
					event.card=trigger.card;
					event._global_waiting=true;
					event.tempnowuxie=(trigger.targets&&trigger.targets.length>1&&!trigger.multitarget);
					event.filterCard=function(card,player){
						if(get.name(card)!='wuxie') return false;
						return lib.filter.cardEnabled(card,player,'forceEnable');
					};
					event.send=function(player,state,isJudge,card,source,target,targets,id,id2,tempnowuxie,skillState,respondInfo){
						if(skillState){
							player.applySkills(skillState);
						}
						state=state?1:-1;
						var str='';
						if(isJudge){
							str+=get.translation(source)+'的';
						}
						if(isJudge){
							str+=get.translation(card,'viewAs');
						}
						else{
							str+=get.translation(card);
						}
						if((targets||target)&&!isJudge){
							str+='对'+get.translation(targets||target);
						}
						str+='将'+(state>0?'生效':'失效')+'，是否无懈？';

						if(player.isUnderControl(true)&&!_status.auto&&!ui.tempnowuxie&&tempnowuxie){
							var translation=get.translation(card.name);
							if(translation.length>=4){
								translation=lib.translate[card.name+'_ab']||translation.slice(0,2);
							}
							ui.tempnowuxie=ui.create.control('不无懈'+translation,ui.click.tempnowuxie,'stayleft');
							ui.tempnowuxie._origin=id2;
						}
						var next=player.chooseToUse({
							filterCard:function(card,player){
								if(get.name(card)!='wuxie') return false;
								return lib.filter.cardEnabled(card,player,'forceEnable');
							},
							prompt:str,
							type:'wuxie',
							state:state,
							_global_waiting:true,
							ai1:function(){
								if(isJudge){
									var name=card.viewAs||card.name;
									var info=lib.card[name];
									if(info&&info.ai&&info.ai.wuxie){
										var aiii=info.ai.wuxie(source,card,source,_status.event.player,state);
										if(typeof aiii=='number') return aiii;
									}
									if(Math.abs(get.attitude(_status.event.player,source))<3) return 0;
									if(source.hasSkillTag('nowuxie_judge')||source.hasSkillTag('guanxing')&&(source!=player||!source.hasSkill('guanxing_fail'))) return 0;
									if(name!='lebu'&&name!='bingliang'){
										if(source!=_status.event.player){
											return 0;
										}
									}
									var card2;
									if(name!=card.name){
										card2={name:name};
									}
									else{
										card2=card;
									}
									var eff=get.effect(source,card2,source,source);
									if(eff>=0) return 0;
									return state*get.attitude(_status.event.player,source);
								}
								else if(target){
									var triggerevent=_status.event.getTrigger();
									if(triggerevent&&triggerevent.parent&&
										triggerevent.parent.postAi&&
										triggerevent.player.isUnknown(_status.event.player)){
										return 0;
									}
									var info=get.info(card);
									if(info.ai&&info.ai.wuxie){
										var aiii=info.ai.wuxie(target,card,source,_status.event.player,state);
										if(typeof aiii=='number') return aiii;
									}
									if(info.multitarget&&targets){
										var eff=0;
										for(var i=0;i<targets.length;i++){
											eff+=get.effect(targets[i],card,source,_status.event.player)
										}
										return -eff*state;
									}
									if(Math.abs(get.attitude(_status.event.player,target))<3) return 0;
									return -get.effect(target,card,source,_status.event.player)*state;
								}
								else{
									var triggerevent=_status.event.getTrigger();
									if(triggerevent&&triggerevent.parent&&
										triggerevent.parent.postAi&&
										triggerevent.player.isUnknown(_status.event.player)){
										return 0;
									}
									var info=get.info(card);
									if(info.ai&&info.ai.wuxie){
										var aiii=info.ai.wuxie(target,card,source,_status.event.player,state);
										if(typeof aiii=='number') return aiii;
									}
									if(Math.abs(get.attitude(_status.event.player,source))<3) return 0;
									return -get.attitude(_status.event.player,source)*state;
								}
							},
							source:target,
							source2:targets,
							id:id,
							id2:id2,
							respondInfo:respondInfo,
						});
						if(event.stateplayer&&event.statecard) next.set('respondTo',[event.stateplayer,event.statecard]);
						else if(!isJudge){
							next.set('respondTo',[source,card]);
						}
						if(game.online){
							_status.event._resultid=id;
							game.resume();
						}
						else{
							next.nouse=true;
						}
					};
					event.settle=function(){
						if(event.respondWuxie) event.trigger('eventNeutralized');
						if(!event.state){
							if(event.triggername=='phaseJudge'){
								trigger.untrigger();
								trigger.cancelled=true;
							}
							else{
								trigger.neutralize();
								if(event.guowuxie==true){
									trigger.getParent().excluded.addArray(game.filterPlayer(function(current){
										return current.isFriendOf(trigger.target);
									}));
								}
							}
						}
						event.finish();
					};
					'step 1'
					var info={};
					if(event.statecard){
						info.player=event.stateplayer;
						info.card=event.statecard;
					}
					else if(event.triggername=='phaseJudge'){
						info.card=trigger.card;
						info.target=trigger.player;
					}
					else{
						info.player=trigger.player;
						info.card=trigger.card;
						if(trigger.multitarget){
							info.targets=trigger.targets;
						}
						else info.target=trigger.target;
					}
					event.respond_info=info;
					var list=game.filterPlayer(function(current){
						if(event.nowuxie) return false;
						if(event.directHit&&event.directHit.includes(current)) return false;
						if(event.triggername=='phaseJudge'){
							if(game.checkMod(trigger.card,player,current,'unchanged','wuxieJudgeEnabled',current)==false) return false;
							if(game.checkMod(trigger.card,player,current,'unchanged','wuxieJudgeRespondable',player)==false) return false;
							if(event.stateplayer&&event.statecard&&(game.checkMod(event.statecard,event.stateplayer,player,current,'unchanged','wuxieRespondable',event.stateplayer)==false)) return false;
						}
						else{
							if(!event.statecard&&trigger.getParent().directHit.includes(current)) return false;
							if(game.checkMod(trigger.card,player,trigger.target,current,'unchanged','wuxieEnabled',current)==false) return false;
							if(game.checkMod(trigger.card,player,trigger.target,current,'unchanged','wuxieRespondable',player)==false) return false;
							if(event.stateplayer&&event.statecard&&(game.checkMod(event.statecard,event.stateplayer,trigger.player,current,'unchanged','wuxieRespondable',event.stateplayer)==false)) return false;
						}
						return current.hasWuxie(info);
					});
					event.list=list;
					event.id=get.id();
					list.sort(function(a,b){
						return get.distance(event.source,a,'absolute')-get.distance(event.source,b,'absolute');
					});
					'step 2'
					if(event.list.length==0){
						event.settle();
					}
					else if(_status.connectMode&&(event.list[0].isOnline()||event.list[0]==game.me)){
						event.goto(4);
					}
					else{
						event.current=event.list.shift();
						event.send(event.current,event.state,event.triggername=='phaseJudge',
						event.card,event.source,event.target,event.targets,event.id,trigger.parent.id,event.tempnowuxie,null,event.respond_info);
					}
					'step 3'
					if(result.bool){
						event.wuxieresult=event.current;
						event.wuxieresult2=result;
						event.goto(8);
					}
					else{
						event.goto(2);
					}
					'step 4'
					var id=event.id;
					var sendback=function(result,player){
						if(result&&result.id==id&&!event.wuxieresult&&result.bool){
							event.wuxieresult=player;
							event.wuxieresult2=result;
							game.broadcast('cancel',id);
							return (function(){
								if(_status.event.id==id&&_status.event.name=='chooseToUse'&&_status.paused) event.resultOL=_status.event.resultOL;
								if(_status.event._parent_id==id){
									ui.click.cancel();
								}
								if(_status.event.id==id){
									if(_status.event._backup) ui.click.cancel();
									ui.click.cancel();
									if(ui.confirm){
										ui.confirm.close();
									}
									if(_status.event.result){
										_status.event.result.id=id;
									}
								}
							});
						}
						else{
							if(_status.event.id==id&&_status.event.name=='chooseToUse'&&_status.paused){
								return (function(){
									event.resultOL=_status.event.resultOL;
								});
							}
						}
					};
					var withme=false;
					var withol=false;
					var list=event.list;
					for(var i=0;i<list.length;i++){
						if(list[i].isOnline()){
							withol=true;
							list[i].wait(sendback);
							list[i].send(event.send,list[i],event.state,event.triggername=='phaseJudge',
							event.card,event.source,event.target,event.targets,event.id,trigger.parent.id,event.tempnowuxie,get.skillState(list[i]),event.respond_info);
							list.splice(i--,1);
						}
						else if(list[i]==game.me){
							withme=true;
							event.send(list[i],event.state,event.triggername=='phaseJudge',
							event.card,event.source,event.target,event.targets,event.id,trigger.parent.id,event.tempnowuxie,null,respondInfo);
							list.splice(i--,1);
						}
					}
					if(!withme){
						event.goto(6);
					}
					if(_status.connectMode){
						if(withme||withol){
							for(var i=0;i<game.players.length;i++){
								game.players[i].showTimer();
							}
						}
					}
					event.withol=withol;
					'step 5'
					if(result&&result.bool&&!event.wuxieresult){
						game.broadcast('cancel',event.id);
						event.wuxieresult=game.me;
						event.wuxieresult2=result;
					}
					'step 6'
					if(event.withol&&!event.resultOL){
						game.pause();
					}
					'step 7'
					for(var i=0;i<game.players.length;i++){
						game.players[i].hideTimer();
					}
					'step 8'
					if(event.wuxieresult2&&event.wuxieresult2._sendskill) lib.skill[event.wuxieresult2._sendskill[0]]=event.wuxieresult2._sendskill[1];
					if(event.wuxieresult&&event.wuxieresult2&&event.wuxieresult2.skill){
						var info=get.info(event.wuxieresult2.skill);
						if(info&&info.precontent&&!game.online){
							var next=game.createEvent('pre_'+event.wuxieresult2);
							next.setContent(info.precontent);
							next.set('result',event.wuxieresult2);
							next.set('player',event.wuxieresult);
						}
					}
					'step 9'
					if(event.wuxieresult){
						var next=event.wuxieresult.useResult(event.wuxieresult2);
						if(event.stateplayer&&event.statecard){
							event.respondWuxie=true;
							next.respondTo=[event.stateplayer,event.statecard];
						}
						else if(event.triggername!='phaseJudge'){
							next.respondTo=[trigger.player,trigger.card];
						}
					}
					'step 10'
					if(event.wuxieresult){
						if(result.wuxied){
							event.nowuxie=result.nowuxie;
							event.directHit=result.directHit;
							event.stateplayer=event.wuxieresult;
							if(event.wuxieresult2&&event.wuxieresult2.used){
								event.statecard=event.wuxieresult2.used;
							}
							else{
								event.statecard=true;
							}
							event.state=!event.state;
							event.goto(1);
						}
						else event.settle();
					}
					else if(event.list.length){
						event.goto(2);
					}
					else{
						event.settle();
					}
					delete event.resultOL;
					delete event.wuxieresult;
					delete event.wuxieresult2;
				}
			},*/
	},
	translate: {
		sha: "杀",
		huosha: "火杀",
		leisha: "雷杀",
		icesha: "冰杀",
		kamisha: "神杀",
		cisha: "刺杀",
		shan: "闪",
		tao: "桃",
		bagua: "八卦阵",
		bagua_bg: "卦",
		bagua_skill: "八卦阵",
		jueying: "绝影",
		jueying_wancheng: "绝影",
		dilu: "的卢",
		zhuahuang: "爪黄飞电",
		jueying_bg: "+马",
		dilu_bg: "+马",
		zhuahuang_bg: "+马",
		chitu: "赤兔",
		chitu_bg: "-马",
		dawan: "大宛",
		dawan_bg: "-马",
		zixin: "紫骍",
		zixin_bg: "-马",
		zhuge: "诸葛连弩",
		cixiong: "雌雄双股剑",
		zhuge_bg: "弩",
		cixiong_bg: "双",
		qinggang: "青釭剑",
		qinglong: "青龙偃月刀",
		zhangba: "丈八蛇矛",
		qinglong_bg: "偃",
		zhangba_bg: "蛇",
		guanshi: "贯石斧",
		fangtian: "方天画戟",
		qilin: "麒麟弓",
		qilin_bg: "弓",
		zhuge_skill: "诸葛连弩",
		cixiong_skill: "雌雄双股剑",
		qinggang_skill: "青釭剑",
		qinglong_skill: "青龙偃月刀",
		qinglong_guozhan: "青龙偃月刀",
		zhangba_skill: "丈八蛇矛",
		guanshi_skill: "贯石斧",
		fangtian_skill: "方天画戟",
		qilin_skill: "麒麟弓",
		wugu: "五谷丰登",
		taoyuan: "桃园结义",
		nanman: "南蛮入侵",
		wanjian: "万箭齐发",
		wuzhong: "无中生有",
		juedou: "决斗",
		wugu_bg: "谷",
		taoyuan_bg: "园",
		nanman_bg: "蛮",
		wanjian_bg: "箭",
		wuzhong_bg: "生",
		juedou_bg: "斗",
		shunshou: "顺手牵羊",
		guohe: "过河拆桥",
		guohe_bg: "拆",
		jiedao: "借刀杀人",
		wuxie: "无懈可击",
		wuxie_bg: "懈",
		lebu: "乐不思蜀",
		shandian: "闪电",
		shandian_bg: "电",
		hanbing: "寒冰剑",
		renwang: "仁王盾",
		hanbing_bg: "冰",
		renwang_bg: "盾",
		hanbing_skill: "寒冰剑",
		renwang_skill: "仁王盾",
		hanbing_info: "当你因执行【杀】的效果而造成伤害时，若目标角色有能被弃置的牌，则你可以防止此伤害，然后依次弃置目标角色的两张牌。",
		hanbing_skill_info: "当你因执行【杀】的效果而造成伤害时，若目标角色有能被弃置的牌，则你可以防止此伤害，然后依次弃置目标角色的两张牌。",
		renwang_info: "锁定技，黑色【杀】对你无效。",
		renwang_skill_info: "锁定技，黑色【杀】对你无效。",
		sha_info: "出牌阶段，对你攻击范围内的一名角色使用。其须使用一张【闪】，否则你对其造成1点伤害。",
		shan_info: "抵消一张【杀】。",
		tao_info: "①出牌阶段，对自己使用，目标角色回复1点体力。②当有角色处于濒死状态时，对该角色使用。目标角色回复1点体力。",
		bagua_info: "当你需要使用或打出一张【闪】时，你可以进行判定。若结果为红色，则你视为使用或打出一张【闪】。",
		bagua_skill_info: "当你需要使用或打出一张【闪】时，你可以进行判定。若结果为红色，则你视为使用或打出一张【闪】。",
		jueying_info: "锁定技，其他角色计算与你的距离+1。",
		get jueying_append() {
			if (get.mode() === "doudizhu") {
				return '<span class="text" style="font-family: yuanli">【绝影】于7月5日8时-7月21日24时位于装备区时，可以将【绝影】置入弃牌堆防止一次伤害。</span>';
			}
			return "";
		},
		dilu_info: "锁定技，其他角色计算与你的距离+1。",
		zhuahuang_info: "锁定技，其他角色计算与你的距离+1。",
		chitu_info: "锁定技，你计算与其他角色的距离-1。",
		dawan_info: "锁定技，你计算与其他角色的距离-1。",
		zixin_info: "锁定技，你计算与其他角色的距离-1。",
		zhuge_skill_info: "锁定技，你于出牌阶段内使用【杀】无次数限制。",
		zhuge_info: "锁定技，你于出牌阶段内使用【杀】无次数限制。",
		cixiong_skill_info: "当你使用【杀】指定一名异性的目标角色后，你可以令其选择一项：1.弃置一张手牌；2.令你摸一张牌。",
		cixiong_info: "当你使用【杀】指定一名异性的目标角色后，你可以令其选择一项：1.弃置一张手牌；2.令你摸一张牌。",
		qinggang_skill_info: "锁定技，当你使用【杀】指定一名目标角色后，你令其防具技能无效直到此【杀】被抵消或造成伤害。",
		qinggang_info: "锁定技，当你使用【杀】指定一名目标角色后，你令其防具技能无效直到此【杀】被抵消或造成伤害。",
		qinglong_skill_info: "当你使用的【杀】被目标角色使用的【闪】抵消时，你可以对其使用一张【杀】（无距离限制）。",
		qinglong_guozhan_info: "锁定技，当你使用【杀】指定目标后，所有目标角色不能明置武将牌直到此【杀】结算完毕为止。",
		qinglong_info: "当你使用的【杀】被目标角色使用的【闪】抵消时，你可以对其使用一张【杀】（无距离限制）。",
		qinglong_info_guozhan: "锁定技，当你使用【杀】指定目标后，所有目标角色不能明置武将牌直到此【杀】结算完毕为止。",
		zhangba_skill_info: "你可以将两张手牌当【杀】使用或打出。",
		zhangba_info: "你可以将两张手牌当【杀】使用或打出。",
		guanshi_skill_info: "当你使用的【杀】被目标角色使用的【闪】抵消时，你可以弃置两张牌，令此【杀】依然对其造成伤害。",
		guanshi_info: "当你使用的【杀】被目标角色使用的【闪】抵消时，你可以弃置两张牌，令此【杀】依然对其造成伤害。",
		fangtian_skill_info: "你使用的【杀】若是你最后的手牌，你可以额外选择至多两个目标。",
		fangtian_info: "你使用的【杀】若是你最后的手牌，你可以额外选择至多两个目标。",
		fangtian_info_guozhan: "你使用【杀】可以指定任意名角色为目标（不能包含势力相同的角色），若任意一名目标角色使用【闪】抵消了此【杀】，则此【杀】对剩余的目标角色无效。",
		qilin_skill_info: "当你使用【杀】对目标角色造成伤害时，你可以弃置其装备区里的一张坐骑牌。",
		qilin_info: "当你使用【杀】对目标角色造成伤害时，你可以弃置其装备区里的一张坐骑牌。",
		wugu_info: "出牌阶段，对所有角色使用。（选择目标后）你从牌堆顶亮出等同于目标数量的牌，每名目标角色获得这些牌中（剩余的）的任意一张。",
		taoyuan_info: "出牌阶段，对所有角色使用。每名目标角色回复1点体力。",
		nanman_info: "出牌阶段，对所有其他角色使用。每名目标角色需打出一张【杀】，否则受到1点伤害。",
		wanjian_info: "出牌阶段，对所有其他角色使用。每名目标角色需打出一张【闪】，否则受到1点伤害。",
		wuzhong_info: "出牌阶段，对你使用。你摸两张牌。",
		juedou_info: "出牌阶段，对一名其他角色使用。由其开始，其与你轮流打出一张【杀】，直到其中一方未打出【杀】为止。未打出【杀】的一方受到另一方对其造成的1点伤害。",
		shunshou_info: "出牌阶段，对距离为1且区域里有牌的一名其他角色使用。你获得其区域里的一张牌。",
		guohe_info: "出牌阶段，对区域里有牌的一名其他角色使用。你弃置其区域里的一张牌。",
		jiedao_info: "出牌阶段，对装备区里有武器牌且有使用【杀】的目标的一名其他角色使用。令其对你指定的一名角色使用一张【杀】，否则将其装备区里的武器牌交给你。",
		jiedao_append: '<span class="text" style="font-family: yuanli">这是一种十分含蓄的计谋。</span>',
		wuxie_info: "一张锦囊牌生效前，对此牌使用。抵消此牌对一名角色产生的效果，或抵消另一张【无懈可击】产生的效果。",
		lebu_info: "出牌阶段，对一名其他角色使用。若判定结果不为红桃，跳过其出牌阶段。",
		shandian_info: "出牌阶段，对自己使用。若判定结果为黑桃2~9，则目标角色受到3点雷电伤害。若判定不为黑桃2~9，将之移动到下家的判定区里。",
		icesha_skill: "冰冻",
		icesha_skill_info: "防止即将造成的伤害，改为依次弃置其两张牌。",
		sha_notshan: "invisible",
		qinggang2: "破防",
	},
	list: [
		["spade", 7, "sha"],
		["spade", 8, "sha"],
		["spade", 8, "sha"],
		["spade", 9, "sha"],
		["spade", 9, "sha"],
		["spade", 10, "sha"],
		["spade", 10, "sha"],
		["club", 2, "sha"],
		["club", 3, "sha"],
		["club", 4, "sha"],
		["club", 5, "sha"],
		["club", 6, "sha"],
		["club", 7, "sha"],
		["club", 8, "sha"],
		["club", 8, "sha"],
		["club", 9, "sha"],
		["club", 9, "sha"],
		["club", 10, "sha"],
		["club", 10, "sha"],
		["club", 11, "sha"],
		["club", 11, "sha"],
		["heart", 10, "sha"],
		["heart", 10, "sha"],
		["heart", 11, "sha"],
		["diamond", 6, "sha"],
		["diamond", 7, "sha"],
		["diamond", 8, "sha"],
		["diamond", 9, "sha"],
		["diamond", 10, "sha"],
		["diamond", 13, "sha"],
		["heart", 2, "shan"],
		["heart", 2, "shan"],
		["heart", 13, "shan"],
		["diamond", 2, "shan"],
		["diamond", 2, "shan"],
		["diamond", 3, "shan"],
		["diamond", 4, "shan"],
		["diamond", 5, "shan"],
		["diamond", 6, "shan"],
		["diamond", 7, "shan"],
		["diamond", 8, "shan"],
		["diamond", 9, "shan"],
		["diamond", 10, "shan"],
		["diamond", 11, "shan"],
		["diamond", 11, "shan"],
		["heart", 3, "tao"],
		["heart", 4, "tao"],
		["heart", 6, "tao"],
		["heart", 7, "tao"],
		["heart", 8, "tao"],
		["heart", 9, "tao"],
		["heart", 12, "tao"],
		["diamond", 12, "tao"],

		["spade", 2, "bagua"],
		["club", 2, "bagua"],
		["spade", 5, "jueying"],
		["club", 5, "dilu"],
		["heart", 13, "zhuahuang"],
		["heart", 5, "chitu"],
		["spade", 13, "dawan"],
		["diamond", 13, "zixin"],
		["club", 1, "zhuge"],
		["diamond", 1, "zhuge"],
		["spade", 2, "cixiong"],
		["spade", 6, "qinggang"],
		["spade", 5, "qinglong"],
		["spade", 12, "zhangba"],
		["diamond", 5, "guanshi"],
		["diamond", 12, "fangtian"],
		["heart", 5, "qilin"],

		["heart", 3, "wugu"],
		["heart", 4, "wugu"],
		["heart", 1, "taoyuan"],
		["spade", 7, "nanman"],
		["spade", 13, "nanman"],
		["club", 7, "nanman"],
		["heart", 1, "wanjian"],
		["spade", 1, "juedou"],
		["club", 1, "juedou"],
		["diamond", 1, "juedou"],
		["heart", 7, "wuzhong"],
		["heart", 8, "wuzhong"],
		["heart", 9, "wuzhong"],
		["heart", 11, "wuzhong"],
		["spade", 3, "shunshou"],
		["spade", 4, "shunshou"],
		["spade", 11, "shunshou"],
		["diamond", 3, "shunshou"],
		["diamond", 4, "shunshou"],
		["spade", 3, "guohe"],
		["spade", 4, "guohe"],
		["spade", 12, "guohe"],
		["club", 3, "guohe"],
		["club", 4, "guohe"],
		["heart", 12, "guohe"],
		["club", 12, "jiedao"],
		["club", 13, "jiedao"],
		["spade", 11, "wuxie"],
		["club", 12, "wuxie"],
		["club", 13, "wuxie"],
		["spade", 6, "lebu"],
		["club", 6, "lebu"],
		["heart", 6, "lebu"],
		["spade", 1, "shandian"],
		["spade", 2, "hanbing"],
		["club", 2, "renwang"],
		["heart", 12, "shandian"],
		["diamond", 12, "wuxie"],
	],
};
