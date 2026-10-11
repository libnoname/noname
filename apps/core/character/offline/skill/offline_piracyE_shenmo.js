import { lib, game, ui, get, ai, _status } from "noname";
import html from "dedent";

/** @type { importCharacterConfig["skill"] } */
const skills = {
	//神魔孙策
	smxiaoyang: {
		init(player, skill) {
			player.addSkill(skill + "_use");
			if (player.countUsed("sha", true) && player.isPhaseUsing()) {
				player.addTempSkill(skill + "_mark", "phaseAnyAfter");
			}
		},
		onremove(player, skill) {
			player.removeSkill(skill + "_use");
			player.removeSkill(skill + "_mark");
		},
		audio: 2,
		locked: true,
		frequent: true,
		mod: {
			cardEnabled2(card, player, event) {
				if (card.name == "sha" && player.hasSkill("smxiaoyang_mark") && player.isPhaseUsing()) {
					return false;
				}
			},
		},
		trigger: {
			player: "loseAfter",
			global: ["gainAfter", "equipAfter", "loseAsyncAfter", "addToExpansionAfter", "addJudgeAfter"],
		},
		filter(event, player) {
			const evt = event.getl?.(player);
			return evt?.cards2?.length;
		},
		async content(event, trigger, player) {
			const num = trigger.getl(player).cards2.length;
			await player.draw({ num, nodelay: true });
		},
		subSkill: {
			use: {
				silent: true,
				charlotte: true,
				popup: false,
				trigger: { player: "useCard1" },
				filter(event, player) {
					return event.card.name == "sha" && player.isPhaseUsing() && !player.hasSkill("smxiaoyang_mark");
				},
				async content(event, trigger, player) {
					player.addTempSkill("smxiaoyang_mark", "phaseAnyAfter");
				},
			},
			mark: { charlotte: true },
		},
	},
	smlinyuan: {
		audio: 2,
		initGroup: "shen",
		juexingji: true,
		forced: true,
		skillAnimation: true,
		animationColor: "wood",
		trigger: { player: "phaseEnd" },
		filter(event, player) {
			const num = player.getHistory("sourceDamage").reduce((sum, evt) => sum + evt.num, 0);
			return num <= 1 || num > player.maxHp;
		},
		async content(event, trigger, player) {
			player.awakenSkill(event.name);
			const num = player.getHistory("sourceDamage").reduce((sum, evt) => sum + evt.num, 0);
			const skills = num <= 1 ? ["smkuangfei", "smaodou", "smbifeng"] : ["smfuqing", "smchengrui"];
			const name = num <= 1 ? "sm_devil_sunce" : "sm_shen_sunce";
			const maxHp = 6;
			const hp = num <= 1 ? 6 : 1;
			await player.changeSkills(skills, ["smxiaoyang", "smlinyuan"]);
			player.changeSkin({ characterName: "sm_shenmo_sunce" }, name);
			player.maxHp = maxHp;
			player.hp = hp;
			player.update();
		},
	},
	smfuqing: {
		audio: 2,
		trigger: {
			player: "loseEnd",
			global: ["gainEnd", "equipEnd", "loseAsyncEnd", "addToExpansionEnd", "addJudgeEnd"],
		},
		filter(event, player) {
			const evt = event.getl?.(player);
			return evt?.cards2?.length && game.hasPlayer(current => current.isDamaged());
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget({
					prompt: get.prompt2(event.skill),
					filterTarget(card, player, target) {
						return target.isDamaged();
					},
					ai(target) {
						return get.recoverEffect(target, get.player(), get.player());
					},
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			await target.recover();
		},
	},
	smchengrui: {
		audio: 2,
		init(player, skill) {
			player.addSkill(skill + "_mark");
		},
		onremove(player, skill) {
			player.removeSkill(skill + "_mark");
		},
		trigger: { global: "phaseEnd" },
		filter(event, player) {
			const num = _status.smchengrui ?? 0;
			return num > 0;
		},
		async cost(event, trigger, player) {
			const num = _status.smchengrui ?? 0;
			if (num <= 0) return;
			const list = [["draw", "摸一张牌"]];
			const card = get.autoViewAs({ name: "juedou", isCard: true }, "unsure");
			if (player.hasUseTarget(card)) {
				list.push(["juedou", "视为使用一张【决斗】"]);
			}
			const result = await player
				.chooseButton({
					createDialog: [`骋锐：你可以执行以下项（还剩${num}次）`, [list, "textbutton"]],
					ai(button) {
						const player = get.player();
						const juedou = Math.max(...game.filterPlayer().map(current => get.effect(current, { name: "juedou" }, player, player)));
						const draw = get.effect(player, { name: "draw" }, player, player);
						return button.link == juedou >= draw ? "juedou" : "draw";
					},
				})
				.forResult();
			if (result?.bool && result.links?.length) {
				event.result = {
					bool: true,
					cost_data: {
						link: result.links[0],
						num: num - 1,
					},
				};
			}
		},
		async content(event, trigger, player) {
			let { link, num } = event.cost_data;
			const func = async (player, link) => {
				const card = get.autoViewAs({ name: "juedou", isCard: true }, "unsure");
				if (player.hasUseTarget(card) && link == "juedou") {
					await player.chooseUseTarget(card, true);
				}
				if (link == "draw") {
					await player.draw();
				}
			};
			await func(player, link);
			while (num > 0) {
				const list = [["draw", "摸一张牌"]];
				const card = get.autoViewAs({ name: "juedou", isCard: true }, "unsure");
				if (player.hasUseTarget(card)) {
					list.push(["juedou", "视为使用一张【决斗】"]);
				}
				const result = await player
					.chooseButton({
						createDialog: [`骋锐：你可以执行以下项（还剩${num}次）`, [list, "textbutton"]],
						ai(button) {
							const player = get.player();
							const juedou = Math.max(...game.filterPlayer().map(current => get.effect(current, { name: "juedou" }, player, player)));
							const draw = get.effect(player, { name: "draw" }, player, player);
							return button.link == juedou >= draw ? "juedou" : "draw";
						},
					})
					.forResult();
				if (result?.bool && result.links?.length) {
					link = result.links[0];
					await func(player, link);
				} else {
					break;
				}
				num--;
			}
		},
		subSkill: {
			mark: {
				charlotte: true,
				silent: true,
				popup: false,
				trigger: { global: ["phaseUseBefore", "phaseUseAfter"] },
				async content(event, trigger, player) {
					if (event.triggername == "phaseUseBefore") {
						_status.smchengrui = 0;
					} else {
						const targets = [];
						game.getGlobalHistory("changeHp", evt => {
							if (evt.num !== 0 && !targets.includes(evt.player) && evt.getParent(trigger.name) == trigger) {
								targets.push(evt.player);
							}
						});
						_status.smchengrui = targets.length;
					}
				},
			},
		},
	},
	smkuangfei: {
		audio: 2,
		enable: "phaseUse",
		usable: 50,
		manualConfirm: true,
		async content(event, trigger, player) {
			await player.draw();
		},
		ai: {
			order: 114514,
			result: {
				player(player) {
					if (player.hasSkill("smbifeng", null, false, false)) {
						if (player.isDamaged() && player.maxHp > 3) {
							return 1;
						}
						const num = player.countHistory("useSkill", evt => evt.skill != "smbifeng");
						if (num + 1 >= player.maxHp && player.isHealthy()) {
							return 0;
						}
					}
					return 1;
				},
			},
		},
	},
	smaodou: {
		audio: 2,
		trigger: {
			player: "gainEnd",
			global: "loseAsyncEnd",
		},
		filter(event, player) {
			const card = get.autoViewAs({ name: "juedou", isCard: true }, "unsure");
			return player.hasCards("hes") && player.hasUseTarget(card) && event.getg?.(player)?.length;
		},
		direct: true,
		clearTime: true,
		async content(event, trigger, player) {
			await player
				.chooseToUse()
				.set("openskilldialog", `###${get.prompt(event.name)}###将一张牌当作【决斗】使用`)
				.set("norestore", true)
				.set("_backupevent", `${event.name}_backup`)
				.set("custom", {
					add: {},
					replace: { window() {} },
				})
				.backup(`${event.name}_backup`)
				.set("targetRequired", true)
				.set("complexTarget", true)
				.set("complexSelect", true)
				.set("logSkill", event.name);
		},
		subSkill: {
			backup: {
				filterCard(card) {
					return get.itemtype(card) == "card";
				},
				filterTarget(card, player, target) {
					return lib.filter.targetEnabled.apply(this, arguments);
				},
				viewAs: { name: "juedou" },
				selectCard: 1,
				position: "hes",
				log: false,
				ai1(card) {
					return 7 - get.value(card);
				},
			},
		},
	},
	smbifeng: {
		audio: 2,
		forced: true,
		trigger: { player: ["logSkillBegin", "useSkill"] },
		filter(event, player) {
			if (["global", "equip"].includes(event.type)) return false;
			const skill = get.sourceSkillFor(event);
			if (!skill || skill === "smbifeng") return false;
			const info = get.info(skill);
			if (!info || info.charlotte || info.equipSkill) return false;
			const num = player.countHistory("useSkill", evt => evt.skill != "smbifeng");
			return num >= player.maxHp;
		},
		async content(event, trigger, player) {
			const result = await player
				.chooseControl({
					prompt: "蔽锋：选择失去1点体力或减1点体力上限",
					controls: ["失去1点体力", "减1点体力上限"],
					ai() {
						const player = get.player();
						if (player.hp > 3) return "失去1点体力";
						if (player.isDamaged()) return "减1点体力上限";
						return "失去1点体力";
					},
				})
				.forResult();
			if (typeof result?.index == "number") {
				if (result.index == 0) {
					await player.loseHp();
				} else {
					await player.loseMaxHp();
				}
			}
		},
	},
	//神魔孙权（魔不如神这一块）
	smsibian: {
		audio: 2,
		forced: true,
		juexingji: true,
		skillAnimation: true,
		animationColor: "thunder",
		initGroup: "shen",
		trigger: { player: "phaseBegin" },
		filter(event, player) {
			return (player.getHp() % 2 === 1 && player.countMark("smqihua_shen") > player.countMark("smqihua_mo")) || (player.getHp() % 2 === 0 && player.countMark("smqihua_shen") < player.countMark("smqihua_mo"));
		},
		async content(event, trigger, player) {
			player.awakenSkill(event.name);
			const num = player.getHp();
			if (player.getHp() % 2 === 1 && player.countMark("smqihua_shen") > player.countMark("smqihua_mo")) {
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
			return (event.player !== player && !player.getStorage("smqihua_used").includes("other")) || (player === event.player && !player.getStorage("smqihua_used").includes("me"));
		},
		async cost(event, trigger, player) {
			const target = trigger.player;
			const num = trigger.num;
			if (player !== target) {
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
			player.addTempSkill(`${event.name}_used`);
			player.markAuto(`${event.name}_used`, [player === target ? "me" : "other"]);
			if (player !== target) {
				await player.loseHp(num);
				trigger.cancel();
				player.addMark(`${event.name}_shen`, num);
			} else {
				player.addMark(`${event.name}_mo`, num);
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
			const num1 = player.countMark("smqihua_mo");
			const num2 = player.countMark("smqihua_shen");
			player.clearMark("smqihua_mo");
			player.clearMark("smqihua_shen");
			if (num1 > 0) {
				player.addMark("smqihua_shen", num1);
			}
			if (num2 > 0) {
				player.addMark("smqihua_mo", num2);
			}
		},
		ai: { combo: "smqihua" },
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
			if (player !== _status.currentPhase) {
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
					for (const evt of history) {
						const suit2 = get.suit(evt.card);
						if (suit && suit !== suit2) {
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
			if (player !== _status.currentPhase) {
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
			if (player !== _status.currentPhase) {
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
				if (get.event().getParent().type !== "phase") {
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
				return `视为使用一张${get.translation(links[0][3] || "")}【${get.translation(links[0][2])}】`;
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
			const choices = ["baihong", "qingming", "bixie", "zidian", "baili", "liuxing"].removeArray(player.getStorage(`${event.name}_effect`));
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
										return button.link === "baili";
									}
									return 1 + Math.random();
								},
							})
							.forResult()
					: { bool: true, links: choices };
			if (result?.bool && result.links?.length) {
				player.addSkill(`${event.name}_effect`);
				player.markAuto(`${event.name}_effect`, result.links);
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
					if (storage.includes("liuxing") && trigger.addCount !== false) {
						trigger.addCount = false;
						const stat = player.getStat().card;
						const name = trigger.card.name;
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
