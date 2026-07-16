import { lib, game, ui, get, ai, _status } from "noname";
import html from "dedent";

/** @type { importCharacterConfig["skill"] } */
const skills = {
	//神魔孙权（魔不如神这一块）------by 清风
	smsibian: {
		audio: 2,
		forced: true,
		juexingji: true,
		skillAnimation: true,
		animationColor: "thunder",
		initGroup: "shen",
		trigger: { player: "phaseBegin" },
		filter(event, player) {
			return (player.getHp() % 2 == 1 && player.countMark("smqihua_shen") > player.countMark("smqihua_mo")) || (player.getHp() % 2 == 0 && player.countMark("smqihua_shen") < player.countMark("smqihua_mo"));
		},
		async content(event, trigger, player) {
			player.awakenSkill(event.name);
			const num = player.getHp();
			if (player.getHp() % 2 == 1 && player.countMark("smqihua_shen") > player.countMark("smqihua_mo")) {
				player.changeSkin({ characterName: "sm_shenmo_sunquan" }, "sm_shen_sunquan");
				await player.changeSkills(["smshenjiang", "smshengshou", "smshifeng"], ["smsibian", "smqihua", "smdue"]);
				await player.changeGroup("shen");
				player.maxHp = 10;
				const next = game.createEvent("SmhuashenAfter", false);
				next.player = player;
				next.num = num;
				next.setContent("emptyEvent");
			} else {
				player.changeSkin({ characterName: "sm_shenmo_sunquan" }, "sm_mo_sunquan");
				await player.changeSkills(["smmobian", "smyanshi", "smpoyu"], ["smsibian", "smqihua", "smdue"]);
				await player.changeGroup("devil");
				player.maxHp = 3;
				const next = game.createEvent("SmrumoAfter", false);
				next.player = player;
				next.num = num;
				next.setContent("emptyEvent");
			}
		},
	},
	smqihua: {
		audio: 2,
		trigger: { global: "damageBegin4" },
		filter(event, player) {
			if (!event.num || !event.player?.isIn()) {
				return false;
			}
			return (event.player != player && !player.getStorage("smqihua_used").includes("other")) || (player == event.player && !player.getStorage("smqihua_used").includes("me"));
		},
		async cost(event, trigger, player) {
			const target = trigger.player;
			const num = trigger.num;
			if (player != target) {
				event.result = await player
					.chooseBool({
						prompt: get.prompt(event.skill, target),
						prompt2: `失去${num}点体力防止此伤害并获得等量“神格”`,
						ai() {
							const { player, target, num } = get.event();
							if (get.attitude(player, target) > 2 && player.getHp() > num) {
								return 1;
							}
							return 0;
						},
					})
					.set("target", target)
					.set("num", num)
					.forResult();
				if (event.result?.bool) {
					event.result.targets = [target];
				}
			} else {
				event.result = await player
					.chooseTarget({
						prompt: get.prompt(event.skill),
						prompt2: `获得${num}个“魔心”并令一名其他角色失去等量体力`,
						filterTarget: lib.filter.notMe,
						ai(target) {
							const player = get.player();
							return get.effect(target, { name: "losehp" }, player, player);
						},
					})
					.forResult();
			}
		},
		async content(event, trigger, player) {
			const target = trigger.player;
			const num = trigger.num;
			player.addTempSkill(event.name + "_used");
			player.markAuto(event.name + "_used", [player == target ? "me" : "other"]);
			if (player != target) {
				await player.loseHp(num);
				trigger.cancel();
				player.addMark(event.name + "_shen", num);
			} else {
				player.addMark(event.name + "_mo", num);
				await event.targets[0].loseHp(num);
			}
		},
		subSkill: {
			used: { charlotte: true, onremove: true },
			shen: { marktext: "神格", intro: { content: "mark" } },
			mo: { marktext: "魔心", intro: { content: "mark" } },
		},
	},
	smdue: {
		audio: 2,
		limited: true,
		skillAnimation: true,
		animationColor: "fire",
		trigger: { player: "changeHpAfter" },
		filter(event, player) {
			return ["smqihua_mo", "smqihua_shen"].some(mark => player.hasMark(mark)) && player.countMark("smqihua_mo") !== player.countMark("smqihua_shen");
		},
		check(event, player) {
			return player.countMark("smqihua_mo") > player.countMark("smqihua_shen");
		},
		async content(event, trigger, player) {
			player.awakenSkill(event.name);
			const num1 = player.countMark("smqihua_mo"),
				num2 = player.countMark("smqihua_shen");
			player.clearMark("smqihua_mo");
			player.clearMark("smqihua_shen");
			if (num1 > 0) {
				player.addMark("smqihua_shen", num1);
			}
			if (num2 > 0) {
				player.addMark("smqihua_mo", num2);
			}
		},
	},
	smshenjiang: {
		audio: 2,
		forced: true,
		trigger: { player: "SmhuashenAfter" },
		async content(event, trigger, player) {
			if (trigger.num > 0 && player.getHp() < 2 * trigger.num) {
				await player.recoverTo(trigger.num * 2);
			}
			if (player.getHp() > 2 * trigger.num) {
				await player.loseHp(player.getHp() - 2 * trigger.num);
			}
			const cards = player.getCards("e", card => ["equip1", "equip4"].includes(get.subtype(card)));
			if (cards.length) {
				await player.modedDiscard(cards);
			}
		},
	},
	smshengshou: {
		audio: 2,
		enable: "phaseUse",
		usable(skill, player) {
			return player.countMark("smqihua_shen");
		},
		filter(event, player) {
			if (player != _status.currentPhase) {
				return false;
			}
			return game.hasPlayer(current => get.info("smshengshou").filterTarget(null, player, current));
		},
		filterTarget(card, player, target) {
			return get.inpileVCardList(info => {
				if (["equip", "delay"].includes(info[0])) {
					return false;
				}
				const card = get.autoViewAs({ name: info[2], nature: info[3], isCard: true }, "unsure");
				if (get.is.damageCard(card)) {
					return false;
				}
				return target.hasUseTarget(card);
			}).length;
		},
		async content(event, trigger, player) {
			const target = event.target;
			const list = get.inpileVCardList(info => {
				if (["equip", "delay"].includes(info[0])) {
					return false;
				}
				const card = get.autoViewAs({ name: info[2], nature: info[3], isCard: true }, "unsure");
				if (get.is.damageCard(card)) {
					return false;
				}
				return target.hasUseTarget(card);
			});
			const result = await player
				.chooseButton({
					createDialog: [`圣授：令${get.translation(target)}视为使用一张非伤害牌`, [list, "vcard"]],
					filterButton(button) {
						const card = get.autoViewAs({ name: button.link[2], nature: button.link[3], isCard: true }, "unsure");
						return get.event().target.hasUseTarget(card);
					},
					ai(button) {
						const card = get.autoViewAs({ name: button.link[2], nature: button.link[3], isCard: true }, "unsure");
						return get.event().target.getUseValue(card);
					},
					forced: true,
				})
				.set("target", target)
				.forResult();
			if (result?.bool && result.links?.length) {
				const card = get.autoViewAs({ name: result.links[0][2], nature: result.links[0][3], isCard: true }, "unsure");
				if (target.hasUseTarget(card)) {
					await target.chooseUseTarget(card, true);
				}
			}
		},
		ai: {
			order: 10,
			result: {
				player: 1,
				target: 1,
			},
		},
	},
	smshifeng: {
		audio: 2,
		forced: true,
		trigger: { player: "equipBegin" },
		filter(event, player) {
			return ["equip1", "equip4"].includes(get.subtype(event.card));
		},
		async content(event, trigger, player) {
			trigger.cancel();
			if (trigger.cards?.length) {
				await player.modedDiscard(trigger.cards);
			}
			const skill = get
				.info(event.name)
				.derivation.slice(0)
				.removeArray(player.getSkills(null, false, false))
				.randomGet();
			if (skill) {
				await player.addSkills(skill);
			}
		},
		derivation: ["yinghun", "hongde", "bingyi", "smshifeng_guanwei", "bizheng", "anguo", "shelie", "wengua", "rebotu", "rezhiheng", "mbjiexun", "xiashu", "rejieyin", "oldimeng", "xinfu_guanchao", "drlt_jueyan", "lanjiang", "anxu"],
		subSkill: {
			//小巧思观微
			guanwei: {
				audio: "xinfu_guanwei",
				inherit: "xinfu_guanwei",
				filter(event, player) {
					const history = event.player.getHistory("useCard");
					let num = 0;
					let suit = false;
					for (let i = 0; i < history.length; i++) {
						var suit2 = get.suit(history[i].card);
						if (suit && suit != suit2) {
							return false;
						}
						suit = suit2;
						num++;
					}
					return num > 1;
				},
			},
		},
	},
	smmobian: {
		audio: 2,
		forced: true,
		trigger: { player: "SmrumoAfter" },
		async content(event, trigger, player) {
			const num = Math.floor(trigger.num / 2);
			if (player.maxHp > num) {
				await player.loseMaxHp(player.maxHp - num);
			}
			if (player.maxHp < num) {
				await player.gainMaxHp(num - player.maxHp);
			}
			if (num > 0 && player.getHp() < num) {
				await player.recoverTo(num);
			}
			const cards = player.getCards("e", card => ["equip2", "equip3"].includes(get.subtype(card))).concat(player.getCards("j"));
			if (cards.length) {
				await player.modedDiscard(cards);
			}
		},
	},
	smyanshi: {
		audio: 2,
		enable: "chooseToUse",
		locked: false,
		mod: {
			cardUsable(card) {
				if (card.storage?.smyanshi) {
					return Infinity;
				}
			},
			targetInRange(card) {
				if (card.storage?.smyanshi) {
					return true;
				}
			},
		},
		getUsed: () =>
			game
				.getGlobalHistory("useCard", evt => get.is.damageCard(evt.card))
				.map(evt => get.name(evt.card))
				.toUniqued(),
		hiddenCard(player, name) {
			if (player != _status.currentPhase) {
				return false;
			}
			if (["equip", "delay"].includes(get.type(name))) {
				return false;
			}
			if (get.info("smyanshi").getUsed().includes(name)) {
				return false;
			}
			return lib.inpile.includes(name) && get.is.damageCard(name);
		},
		usable(skill, player) {
			return Math.max(1, player.countMark("smqihua_mo") - player.maxHp);
		},
		filter(event, player) {
			if (player != _status.currentPhase) {
				return false;
			}
			return get.inpileVCardList(info => {
				const card = get.autoViewAs({ name: info[2], nature: info[3], storage: { smyanshi: true } }, "unsure");
				if (["equip", "delay"].includes(info[0])) {
					return false;
				}
				if (!get.is.damageCard(card)) {
					return false;
				}
				return !(event.smyanshi || []).includes(info[2]) && event.filterCard(card, player, event);
			}).length;
		},
		onChooseToUse(event) {
			if (!game.online && !event.smyanshi) {
				const player = event.player;
				event.set("smyanshi", get.info("smyanshi").getUsed());
			}
		},
		chooseButton: {
			dialog(event, player) {
				const list = get.inpileVCardList(info => {
					const card = get.autoViewAs({ name: info[2], nature: info[3], storage: { smyanshi: true } }, "unsure");
					if (["equip", "delay"].includes(info[0])) {
						return false;
					}
					if (!get.is.damageCard(card)) {
						return false;
					}
					return !(event.smyanshi || []).includes(info[2]) && event.filterCard(card, player, event);
				});
				return ui.create.dialog("魇噬", [list, "vcard"]);
			},
			check(button) {
				if (get.event().getParent().type != "phase") {
					return 1;
				}
				return get.event().player.getUseValue({
					name: button.link[2],
					nature: button.link[3],
				});
			},
			backup(links, player) {
				return {
					audio: "smyanshi",
					filterCard: () => false,
					selectCard: -1,
					popname: true,
					viewAs: {
						name: links[0][2],
						nature: links[0][3],
						storage: { smyanshi: true },
					},
					async precontent(event, trigger, player) {
						event.getParent().addCount = false;
					},
				};
			},
			prompt(links, player2) {
				return "视为使用一张" + get.translation(links[0][3] || "") + "【" + get.translation(links[0][2]) + "】";
			},
		},
		ai: {
			order: 5,
			result: {
				player: 1,
			},
		},
	},
	smpoyu: {
		audio: 2,
		forced: true,
		trigger: { player: "equipBegin" },
		filter(event, player) {
			return ["equip2", "equip3"].includes(get.subtype(event.card));
		},
		async content(event, trigger, player) {
			trigger.cancel();
			if (trigger.cards?.length) {
				await player.modedDiscard(trigger.cards);
			}
			const choices = ["baihong", "qingming", "bixie", "zidian", "baili", "liuxing"].removeArray(player.getStorage(event.name + "_effect"));
			if (!choices.length) {
				return;
			}
			const result =
				choices.length > 1
					? await player
							.chooseButton({
								createDialog: [
									`###破御###<div class="text center">请为伤害牌永久添加一个“吴六剑”效果</div>`,
									[
										[
											["baihong", "白虹：基础伤害改为2"],
											["qingming", "青冥：可以额外指定一个目标"],
											["bixie", "辟邪：无视防具"],
											["zidian", "紫电：不可响应"],
											["baili", "百里：额外结算一次"],
											["liuxing", "流星：无次数限制"],
										],
										"textbutton",
									],
								],
								filterButton(button, player) {
									return !player.getStorage("smpoyu_effect").includes(button.link);
								},
								ai(button) {
									const player = get.player();
									if (!player.getStorage("smpoyu_effect").includes("baili")) {
										return button.link == "baili";
									}
									return 1 + Math.random();
								},
							})
							.forResult()
					: { bool: true, links: choices };
			if (result?.bool && result.links?.length) {
				player.addSkill(event.name + "_effect");
				player.markAuto(event.name + "_effect", result.links);
			}
		},
		subSkill: {
			effect: {
				audio: "smpoyu",
				charlotte: true,
				forced: true,
				onremove: true,
				trigger: { player: "useCard" },
				marktext: "吴六剑",
				intro: {
					name: "吴六剑",
					content(storage, player) {
						let str = "当前拥有效果：";
						const list = [
							["baihong", "白虹：基础伤害改为2"],
							["qingming", "青冥：可以额外指定一个目标"],
							["bixie", "辟邪：无视防具"],
							["zidian", "紫电：不可响应"],
							["baili", "百里：额外结算一次"],
							["liuxing", "流星：无次数限制"],
						];
						for (const i of list) {
							if (storage.includes(i[0])) {
								str += `<li>${i[1]}`;
							}
						}
						return str;
					},
				},
				filter(event, player) {
					return get.is.damageCard(event.card) && player.getStorage("smpoyu_effect").length;
				},
				async content(event, trigger, player) {
					const storage = player.getStorage("smpoyu_effect");
					if (storage.includes("baihong")) {
						trigger.baseDamage ??= 1;
						trigger.baseDamage++;
						game.log(trigger.card, "基础伤害为2");
					}
					if (storage.includes("qingming")) {
						const targets = game.filterPlayer(target => {
							if (!trigger.targets || trigger.targets.includes(target)) {
								return false;
							}
							return lib.filter.targetEnabled2(trigger.card, player, target) && lib.filter.targetInRange(trigger.card, player, target);
						});
						if (targets.length) {
							const result = await player
								.chooseTarget({
									prompt: `吴六剑：你可以为${get.translation(trigger.card)}额外指定一个目标`,
									filterTarget(card, player, target) {
										const trigger = get.event().triggerx;
										if (trigger.targets?.includes(target)) {
											return false;
										}
										return lib.filter.targetEnabled2(trigger.card, player, target) && lib.filter.targetInRange(trigger.card, player, target);
									},
									ai(target) {
										const { player, triggerx: trigger } = get.event();
										return get.effect(target, trigger.card, player, player);
									},
								})
								.set("triggerx", trigger)
								.forResult();
							if (result?.bool && result.targets?.length) {
								const targets = result.targets.sortBySeat();
								player.line(targets);
								trigger.targets.addArray(targets);
								game.log(targets, "成为了", trigger.card, "的额外目标");
							}
						}
					}
					if (storage.includes("bixie")) {
						for (const target of trigger.targets) {
							target.addTempSkill("qinggang2");
							target.storage.qinggang2.add(trigger.card);
							target.markSkill("qinggang2");
						}
						game.log(trigger.card, "无视防具");
					}
					if (storage.includes("zidian")) {
						trigger.directHit.addArray(game.players);
						game.log(trigger.card, "不可被响应");
					}
					if (storage.includes("baili")) {
						trigger.effectCount++;
						game.log(trigger.card, "额外结算一次");
					}
					if (storage.includes("liuxing") && trigger.addCount != false) {
						trigger.addCount = false;
						const stat = player.getStat().card,
							name = trigger.card.name;
						if (typeof stat[name] === "number") {
							stat[name]--;
						}
					}
				},
				mod: {
					cardUsable(card, player) {
						if (get.is.damageCard(card) && player.getStorage("smpoyu_effect").includes("liuxing")) {
							return Infinity;
						}
					},
				},
				ai: {
					unequip_ai: true,
					skillTagFilter(player, tag, arg) {
						if (!arg?.card || !arg.target || !get.is.damageCard(arg.card)) {
							return false;
						}
						return player.getStorage("smpoyu_effect").includes("bixie");
					},
				},
			},
		},
	},
};

export default skills;
