import { lib, game, ui, get, ai, _status } from "noname";
import html from "dedent";

/** @type { importCharacterConfig["skill"] } */
const skills = {
	//蛇吕蒙
	shefujing: {
		trigger: {
			global: "roundStart",
		},
		filter(event, player, name) {
			return game.roundNumber === 1;
		},
		forced: true,
		async content(event, trigger, player) {
			await player.turnOver();
			await player.draw(3);
			const result = await player
				.chooseTarget(
					"令一名其他角色获得“伏”",
					(card, player, target) => {
						return !target.getStorage("shefujing_mark").length && target != player;
					},
					true
				)
				.forResult();
			if (result.bool) {
				const target = result.targets[0];
				player.line(target, "green");
				target.addSkill("shefujing_mark");
				target.markAuto("shefujing_mark", player);
			}
		},
		derivation: "shefujing_fu",
		subSkill: {
			mark: {
				charlotte: true,
				onremove: true,
				trigger: {
					player: "damageEnd",
					source: "damageSource",
				},
				filter(event, player, name) {
					if (!player.getStorage("shefujing_mark").some(p => p.isIn())) {
						return false;
					}
					const key = name == "damageEnd" ? "damage" : "sourceDamage";
					return player.getHistory(key, () => true, event).indexOf(event) == 0;
				},
				mark: true,
				marktext: "伏",
				intro: {
					markcount: () => null,
					content(storage, player) {
						const targets = player.getStorage("shefujing_mark").filter(i => i.isIn());
						if (!targets.length) {
							return "无效果";
						}
						return `你每回合首次受到/造成伤害后，${get.translation(targets[0])}可以选择一项：
						1.摸一张牌；2.获得1点护甲；3.${get.poptip("rule_beishui")}，失去1点体力并对你发动一次〖攻心〗`;
					},
				},
				async cost(event, trigger, player) {
					const target = player.getStorage("shefujing_mark").find(p => p.isIn());
					const result = await target
						.chooseControl("选项一", "选项二", "背水！", "cancel2")
						.set("prompt", get.prompt(event.skill, player, target))
						.set("choiceList", ["摸一张牌", "获得1点护甲", `背水：失去1点体力并对${get.translation(player)}发动一次【攻心】`])
						.set("ai", () => {
							const player = get.player();
							if (player.hujia > 4) {
								return "选项一";
							}
							if (player.hp > 1) {
								return "背水！";
							}
							return "选项二";
						})
						.forResult();
					event.result = {
						bool: result.control != "cancel2",
						cost_data: result.index,
						skill_popup: false,
						targets: [target],
					};
				},
				async content(event, trigger, player) {
					const target = event.targets[0],
						index = event.cost_data;
					target.logSkill("shefujing", player);
					if (index != 1) {
						await target.draw();
					}
					if (index != 0) {
						await target.changeHujia();
					}
					if (index == 2) {
						await target.loseHp();
						await target.useSkill("gongxin", [player]);
					}
				},
			},
			fu: {},
		},
	},
	shefujiang: {
		trigger: {
			global: "damageEnd",
		},
		usable: 1,
		filter(event, player) {
			return event.player.isIn();
		},
		check(event, player) {
			return get.attitude(player, event.player) < 0;
		},
		logTarget: "player",
		async content(event, trigger, player) {
			for (const target of [trigger.player.getPrevious(), trigger.player.getNext()]) {
				if (!target.isIn() || !trigger.player.isIn()) {
					continue;
				}
				await target
					.chooseToUse(
						`浮江：是否对${get.translation(trigger.player)}使用一张【杀】？`,
						function (card, player, event) {
							if (get.name(card) != "sha") {
								return false;
							}
							return lib.filter.filterCard.apply(this, arguments);
						},
						trigger.player,
						-1
					)
					.set("addCount", false);
			}
		},
	},
	shetonglu: {
		skillAnimation: true,
		animationColor: "wood",
		juexingji: true,
		trigger: {
			global: "roundEnd",
		},
		forced: true,
		filter(event, player) {
			return player.countCards("h") > player.hp;
		},
		async content(event, trigger, player) {
			player.awakenSkill(event.name);
			await player.loseMaxHp();
			await player.addSkills(["gongxin", "rebotu", "sbduojing"]);
			const target = game.findPlayer(current => current.getStorage("shefujing_mark").includes(player));
			if (!target) {
				return;
			}
			const result = await player.chooseBool(`是否令${get.translation(target)}移动至你的上家或下家`).forResult();
			if (!result.bool) {
				return;
			}
			const result2 = await target
				.chooseControl("上家", "下家")
				.set("prompt", `选择移动至${get.translation(player)}的上家或下家`)
				.set("ai", () => ["上家", "下家"].randomGet())
				.forResult();
			const point = result2.index == 1 ? player.getNext() : player;
			if (target == point.getPrevious()) {
				return;
			}
			game.broadcastAll(
				(target1, target2) => {
					game.swapSeat(target1, target2, null, true);
				},
				target,
				point
			);
			player.insertPhase();
		},
		derivation: ["gongxin", "rebotu", "sbduojing"],
	},
	//龙大宝
	dragpojun: {
		audio: "repojun",
		trigger: {
			player: "useCardToPlayered",
		},
		filter(event, player) {
			return event.card.name == "sha" && event.target.hp > 0 && event.target.countCards("he") > 0;
		},
		preHidden: true,
		async cost(event, trigger, player) {
			const num = Math.min(trigger.target.hp, trigger.target.countCards("he"));
			event.result = await player
				.choosePlayerCard(trigger.target, "he", [1, num], get.prompt(event.skill, trigger.target), "allowChooseAll")
				.set("ai", button => {
					if (!_status.event.goon) {
						return 0;
					}
					var val = get.value(button.link);
					if (button.link == _status.event.target.getEquip(2)) {
						return 2 * (val + 3);
					}
					return val;
				})
				.set("goon", get.attitude(player, trigger.target) <= 0)
				.set("forceAuto", true)
				.setHiddenSkill(event.skill)
				.forResult();
			event.result.targets = [trigger.target];
		},
		async content(event, trigger, player) {
			const target = trigger.target;
			await player.viewCards(get.translation(target) + "的“破军”牌", event.cards);
			target.addSkill("repojun2");
			const next = target.addToExpansion("giveAuto", event.cards, target);
			next.gaintag.add("repojun2");
			await next;
			if (event.cards.some(card => get.type2(card) == "equip")) {
				const result = await player
					.chooseButton(["选择一张牌置入弃牌堆", event.cards.filter(card => get.type(card) == "equip")], true)
					.set("ai", function (button) {
						return get.value(button.link, _status.event.getTrigger().target);
					})
					.forResult();
				if (result.bool) {
					await target.loseToDiscardpile(result.links);
				}
			}
			if (event.cards.some(card => get.type2(card) == "trick")) {
				await player.draw();
			}
		},
		ai: {
			unequip_ai: true,
			directHit_ai: true,
			skillTagFilter(player, tag, arg) {
				if (get.attitude(player, arg.target) > 0) {
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
		group: "repojun3",
	},
	//龙陆逊
	dragqianxun: {
		trigger: { player: "phaseJudgeBegin" },
		filter(event, player) {
			return player.countCards("h") > 1;
		},
		enable: "phaseUse",
		selectCard: 2,
		filterCard: true,
		prompt: "弃置两张手牌并摸一张牌",
		check(card) {
			return 4 - get.value(card);
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseToDiscard("h", 2, get.prompt(event.skill), "弃置两张手牌并弃置判定区里的一张牌")
				.set("ai", card => {
					if (_status.event.goon) {
						return 6 - get.value(card);
					}
					return 0;
				})
				.set(
					"goon",
					(() => {
						if (player.hasSkillTag("rejudge") && player.countCards("j") < 2) {
							return false;
						}
						return player.hasCard(card => {
							if (get.tag(card, "damage") && get.damageEffect(player, player, get.player(), get.natureList(card)) >= 0) {
								return false;
							}
							const cardx = { name: card.viewAs || card.name, cards: [card] };
							return get.effect(player, cardx, player, player) < 0;
						}, "j");
					})()
				)
				.set("chooseonly", true)
				.forResult();
		},
		async content(event, trigger, player) {
			if (trigger?.name == "phaseJudge") {
				await player.discard(event.cards);
				await player.discardPlayerCard(player, "j", true);
			} else {
				await player.draw();
			}
		},
		ai: {
			order: 9,
			result: {
				player(player, target) {
					if (player.countCards("h") > player.getHandcardLimit()) {
						return 1;
					}
					return 0;
				},
			},
		},
	},
	draglianying: {
		trigger: {
			player: "loseAfter",
			global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"],
		},
		frequent: true,
		filter(event, player) {
			if (player.countCards("h")) {
				return false;
			}
			const skills = player.getSkills(null, false, false).filter(skill => {
				let info = get.info(skill);
				if (!info || info.charlotte || get.skillInfoTranslation(skill, player).length == 0) {
					return false;
				}
				return true;
			});
			const evtx = event.getParent("useSkill", true);
			if (evtx && skills.includes(evtx.skill)) {
				return false;
			}
			if (skills.some(skill => event.getParent(skill, true, true))) {
				return false;
			}
			const evt = event.getl(player);
			return evt?.player == player && evt?.hs?.length > 0;
		},
		async content(event, trigger, player) {
			await player.draw(2);
			const result = await player.chooseToDiscard([1, 2], "弃置至多两张牌，若弃置两张牌则令一种牌名的牌对你无效", "he", true).forResult();
			if (result?.cards?.length > 1) {
				player.addTempSkill("draglianying_effect", { player: "phaseBegin" });
				const list = get.inpileVCardList(info => !player.getStorage("draglianying_effect").includes(info[2]) && !info[3]);
				if (!list.length) {
					return;
				}
				const result2 = await player
					.chooseButton(["令一种牌名对你无效", [list, "vcard"]], true)
					.set("ai", button => {
						const player = get.player();
						return -get.effect(player, { name: button.link[2] }, player, player);
					})
					.forResult();
				if (!result2.bool) {
					return;
				}
				player.markAuto("draglianying_effect", result2.links[0][2]);
			}
		},
		ai: {
			threaten: 0.8,
			effect: {
				player_use(card, player, target) {
					if (player.countCards("h") === 1) {
						return [1, 0.8];
					}
				},
				target(card, player, target) {
					if (get.tag(card, "loseCard") && target.countCards("h") === 1) {
						return 0.5;
					}
				},
			},
			noh: true,
			freeSha: true,
			freeShan: true,
			skillTagFilter(player, tag) {
				if (player.countCards("h") !== 1) {
					return false;
				}
			},
		},
		subSkill: {
			effect: {
				trigger: {
					target: "useCardToBefore",
				},
				forced: true,
				onremove: true,
				charlotte: true,
				mark: true,
				intro: {
					content(storage, player) {
						if (!storage?.length) {
							return "无效果";
						}
						return `直到你的下回合开始前，${storage.map(i => get.translation(i)).join("、")}对你无效`;
					},
				},
				filter(event, player) {
					return player.getStorage("draglianying_effect").includes(event.card.name);
				},
				async content(event, trigger, player) {
					trigger.cancel();
				},
				ai: {
					effect: {
						target(card, player, target) {
							if (target.getStorage("draglianying_effect").includes(card.name)) {
								return "zeroplayertarget";
							}
						},
					},
				},
			},
		},
	},
	//申耽申仪
	draglianxiang: {
		trigger: { target: "useCardToTarget" },
		filter(event, player) {
			return event.player != player && player.countCards("he");
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseToDiscard("he", get.prompt2(event.skill))
				.set("ai", card => {
					const player = get.player(),
						targets = game.filterPlayer(current => {
							if (get.attitude(player, current) <= 0) {
								return false;
							}
							const count = c => (c == player ? -1 : 0) + c.countCards("h");
							return !game.hasPlayer(currentx => count(currentx) > count(current));
						});
					if (targets.length) {
						return 7 - get.value(card);
					}
					return 0;
				})
				.set("chooseonly", true)
				.forResult();
		},
		async content(event, trigger, player) {
			await player.discard(event.cards);
			const targets = game.filterPlayer(current => current.isMaxHandcard());
			if (!targets.length) {
				return;
			}
			let target = targets[0];
			if (targets.length > 1) {
				const result = await player
					.chooseTarget("令场上手牌数最多的一名角色摸一张牌", true, (card, player, target) => {
						return target.isMaxHandcard();
					})
					.set("ai", target => get.attitude(get.player(), target))
					.forResult();
				if (result.bool) {
					target = result.targets[0];
				}
			}
			player.line(target, "green");
			await target.draw();
		},
	},
	dragpingmeng: {
		trigger: {
			player: ["loseAfter", "useCard"],
			global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"],
		},
		frequent: true,
		filter(event, player) {
			if (player.countCards("h") >= player.maxHp) {
				return false;
			}
			if (event.name == "useCard") {
				return event.card.name == "sha";
			}
			if (player.countCards("h")) {
				return false;
			}
			const evt = event.getl(player);
			return evt?.player == player && evt?.hs?.length > 0;
		},
		async content(event, trigger, player) {
			const list = lib.group.slice().remove(player.group);
			const result = await player
				.chooseControl(list)
				.set("prompt", "平孟：请选择要变更为的势力")
				.set("ai", () => {
					return _status.event.choice;
				})
				.set("choice", list.randomGet())
				.forResult();
			await player.changeGroup(result.control);
			if (player.countCards("h") < player.maxHp) {
				await player.drawTo(player.maxHp);
			}
			player.addTempSkill("dragpingmeng_effect");
		},
		subSkill: {
			effect: {
				trigger: {
					global: "phaseJieshuBegin",
				},
				direct: true,
				charlotte: true,
				async content(event, trigger, player) {
					const card = get.autoViewAs({ name: "sha", isCard: true });
					if (player.hasUseTarget(card)) {
						await player.chooseUseTarget(card);
					}
				},
			},
		},
		ai: {
			threaten: 0.8,
			effect: {
				player_use(card, player, target) {
					if (player.countCards("h") === 1) {
						return [1, 0.8];
					}
				},
				target(card, player, target) {
					if (get.tag(card, "loseCard") && target.countCards("h") === 1) {
						return 0.5;
					}
				},
			},
			noh: true,
			skillTagFilter(player, tag) {
				if (tag == "noh") {
					if (player.countCards("h") != 1) {
						return false;
					}
				}
			},
		},
	},
	dragpanfeng: {
		trigger: {
			player: ["loseAfter", "useCard"],
			global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"],
		},
		frequent: true,
		filter(event, player) {
			if (player.countCards("h") >= player.maxHp) {
				return false;
			}
			if (event.name == "useCard") {
				return event.card.name == "sha";
			}
			if (player.countCards("h")) {
				return false;
			}
			const evt = event.getl(player);
			return evt?.player == player && evt?.hs?.length > 0;
		},
		async content(event, trigger, player) {
			const list = lib.group.slice().remove(player.group);
			let targetGroup = game.findPlayer(current => {
				if (current.group == player.group) {
					return false;
				}
				return !game.hasPlayer(currentx => {
					if (currentx.group == player.group) {
						return false;
					}
					return get.damageEffect(currentx, player, player) > get.damageEffect(current, player, player);
				});
			})?.[0]?.group;
			if (!list.includes(targetGroup)) {
				targetGroup = list.randomGet();
			}
			const result = await player
				.chooseControl(list)
				.set("prompt", "叛封：请选择要变更为的势力")
				.set("ai", () => {
					return _status.event.choice;
				})
				.set("choice", targetGroup)
				.forResult();
			await player.changeGroup(result.control);
			if (player.countCards("h") < player.maxHp) {
				await player.drawTo(player.maxHp);
			}
			const targets = game.filterPlayer(cur => cur.group == player.group);
			if (!targets.length) {
				return;
			}
			if (targets.length == 1) {
				const target = targets[0];
				player.line(target, "green");
				await target.damage(player);
				return;
			}
			const result2 = await player
				.chooseTarget("对一名与你势力相同的角色造成1点伤害", true, (card, player, target) => {
					return target.group == player.group;
				})
				.set("ai", target => get.damageEffect(target, get.player(), get.player()))
				.forResult();
			if (result2.bool) {
				const target = result2.targets[0];
				player.line(target, "green");
				await target.damage(player);
			}
		},
		ai: {
			threaten: 0.8,
			effect: {
				player_use(card, player, target) {
					if (player.countCards("h") === 1) {
						return [1, 0.8];
					}
				},
				target(card, player, target) {
					if (get.tag(card, "loseCard") && target.countCards("h") === 1) {
						return 0.5;
					}
				},
			},
			noh: true,
			skillTagFilter(player, tag) {
				if (tag == "noh") {
					if (player.countCards("h") != 1) {
						return false;
					}
				}
			},
		},
	},
	//龙廖化
	dragzhawang: {
		trigger: { player: "phaseBegin" },
		async cost(event, trigger, player) {
			const result = await player
				.chooseControl("选项一", "选项二", "背水！", "cancel2")
				.set("prompt", get.prompt(event.skill))
				.set("choiceList", ["本回合获得〖诈降〗", "失去1点体力，将本回合的准备阶段和结束阶段改为摸牌阶段", "背水！减少1点体力上限"])
				.set("ai", () => {
					const player = get.player();
					if (player.maxHp > 4) {
						return "背水！";
					}
					if (player.hasSkill("dragxigui") || player.hp > 1) {
						return "选项二";
					}
					return "cancel2";
				})
				.forResult();
			event.result = {
				bool: result.control != "cancel2",
				cost_data: result.index,
			};
		},
		async content(event, trigger, player) {
			const index = event.cost_data;
			if (index != 1) {
				await player.addTempSkills(["zhaxiang"]);
			}
			if (index != 0) {
				await player.loseHp();
				player.addTempSkill("dragzhawang_draw");
			}
			if (index == 2) {
				await player.loseMaxHp();
			}
		},
		derivation: "zhaxiang",
		subSkill: {
			draw: {
				trigger: {
					player: "phaseChange",
				},
				direct: true,
				charlotte: true,
				filter(event, player) {
					return ["phaseZhunbei", "phaseJieshu"].some(key => event.phaseList[event.num].indexOf(key) != -1);
				},
				async content(event, trigger, player) {
					trigger.phaseList[trigger.num] = `phaseDraw|${event.name}`;
				},
			},
		},
	},
	dragxigui: {
		trigger: {
			global: "roundEnd",
			player: "dying",
		},
		check(event, player) {
			return event.name == "dying";
		},
		limited: true,
		filter(event, player) {
			return event.name != "dying" || event.player.hp <= 0;
		},
		skillAnimation: true,
		animationColor: "fire",
		async content(event, trigger, player) {
			player.awakenSkill(event.name);
			await player.recoverTo(player.maxHp);
			const next = game.createEvent("xiguiContent", false);
			next.player = player;
			next.setContent(() => {
				player.when({ global: "roundEnd" }).step(async (event, trigger, player) => {
					await player.changeSkills(["tydangxian"], ["dragzhawang"]);
				});
			});
			if (trigger.name != "dying") {
				event.next.remove(next);
				trigger.next.push(next);
			}
		},
		derivation: ["tydangxian"],
	},
	//龙周仓
	dragzhongyong: {
		audio: "mobilezhongyong",
		trigger: {
			global: "useCardToTarget",
		},
		filter(event, player) {
			if (event.target.group != player.group || event.targets?.includes(player)) {
				return false;
			}
			if (event.player == event.target) {
				return false;
			}
			if (!["trick", "basic"].includes(get.type2(event.card))) {
				return false;
			}
			return lib.filter.targetEnabled(event.card, event.player, player);
		},
		check(event, player) {
			const type = get.type2(event.card);
			if (get.tag(event.card, "damage") && player.hp <= type == "trick" ? 2 : 1) {
				return false;
			}
			if (type == "trick" && player.hp <= 1) {
				return false;
			}
			return get.effect(event.target, event.card, event.player, player) <= get.effect(player, event.card, event.player, player) + 1;
		},
		usable(skill, player) {
			return 1 + player.getDamagedHp();
		},
		logTarget: "target",
		async content(event, trigger, player) {
			const target = trigger.target,
				type = get.type2(trigger.card);
			const evt = trigger.getParent();
			evt.triggeredTargets2.remove(target);
			evt.targets.remove(target);
			evt.targets.push(player);
			if (type == "basic") {
				await target.draw();
			} else {
				await player.loseHp();
			}
		},
	},
	//龙关银屏
	dragxueji: {
		audio: "xueji",
		enable: "phaseUse",
		usable: 1,
		filterTarget: true,
		selectTarget() {
			const player = _status.event.player;
			return [1, Math.max(1, player.getDamagedHp())];
		},
		multiline: true,
		line: "fire",
		async content(event, trigger, player) {
			await event.target.damage("fire", "nocard");
		},
		ai: {
			damage: true,
			fireAttack: true,
			threaten: 1.5,
			order: 7,
			result: {
				target(player, target) {
					return get.damageEffect(target, player, target, "fire");
				},
			},
		},
	},
	draghuxiao: {
		audio: "huxiao",
		trigger: { source: "damageSource" },
		forced: true,
		filter(event, player) {
			if (!event.player.isIn()) {
				return false;
			}
			return event.hasNature("fire") && !player.hasHistory("sourceDamage", evt => evt.hasNature("fire") && evt != event, event);
		},
		logTarget: "player",
		async content(event, trigger, player) {
			await player.draw();
			player.addTempSkill("draghuxiao_effect");
			player.markAuto("draghuxiao_effect", trigger.player);
		},
		subSkill: {
			effect: {
				onremove: true,
				mark: true,
				intro: {
					content: "players",
				},
				mod: {
					cardUsableTarget(card, player, target) {
						if (player.getStorage("draghuxiao_effect").includes(target)) {
							return true;
						}
					},
				},
			},
		},
	},
	//龙关平
	draglongyin: {
		audio: "relongyin",
		trigger: {
			global: "useCard",
		},
		filter(event, player) {
			if (event.card.name != "sha" || !event.player.isPhaseUsing()) {
				return false;
			}
			if (get.color(event.card) != "red") {
				return false;
			}
			return true;
		},
		usable: 1,
		logTarget: "player",
		check(event, player) {
			return get.attitude(player, event.player) > 0;
		},
		async content(event, trigger, player) {
			const result = (await player.draw().forResult()).cards;
			if (!result) {
				return;
			}
			await player.showCards(result, `${get.translation(player)}发动了【龙吟】`);
			if (trigger.addCount !== false) {
				trigger.addCount = false;
				const stat = trigger.player.getStat().card,
					name = trigger.card.name;
				if (typeof stat[name] === "number") {
					stat[name]--;
				}
			}
			if (get.color(result[0]) == get.color(trigger.card)) {
				trigger.effectCount++;
			}
		},
	},
	dragjiezhong: {
		audio: "jiezhong",
		trigger: {
			global: "phaseZhunbeiBegin",
		},
		limited: true,
		skillAnimation: true,
		animationColor: "orange",
		check(event, player) {
			if (event.player == player) {
				return !game.hasPlayer(current => get.attitude(player, current) >= 0 && current != player);
			}
			return get.attitude(player, event.player) > 0;
		},
		logTarget: "player",
		async content(event, trigger, player) {
			player.awakenSkill(event.name);
			await trigger.player.draw(player.hp);
			if (trigger.player != player) {
				player.when({ global: "roundStart" }).step(async () => {
					player.restoreSkill("dragjiezhong");
				});
			}
		},
	},
	//龙关索
	dragqianfu: {
		enable: "chooseToUse",
		filter(event, player) {
			if (event.type === "wuxie") {
				return false;
			}
			return get
				.inpileVCardList(info => get.type(info[2]) == "basic")
				.some(card => {
					return event.filterCard({ name: card[2], nature: card[3] }, player, event);
				});
		},
		usable: 1,
		chooseButton: {
			dialog(event, player) {
				const list = get
					.inpileVCardList(info => get.type(info[2]) == "basic")
					.filter(card => {
						return event.filterCard({ name: card[2], nature: card[3] }, player, event);
					});
				return ui.create.dialog("搴芙", [list, "vcard"], "hidden");
			},
			check(button) {
				const event = get.event().getParent();
				if (event.type !== "phase") {
					return 1;
				}
				return get.player().getUseValue({ name: button.link[2], nature: button.link[3] });
			},
			prompt(links) {
				return "视为使用" + (get.translation(links[0][3]) || "") + get.translation(links[0][2]) + "并摸三张牌";
			},
			backup(links, player) {
				return {
					selectCard: -1,
					filterCard: () => false,
					viewAs: {
						name: links[0][2],
						nature: links[0][3],
						isCard: true,
						storage: {
							dragqianfu: true,
						},
					},
					precontent() {
						player.logSkill("dragqianfu");
						player.addTempSkill("dragqianfu_effect");
					},
				};
			},
		},
		hiddenCard(player, name) {
			if (player.getStat("skill").dragqianfu) {
				return false;
			}
			return get.type(name) == "basic" && lib.inpile.includes(name);
		},
		ai: {
			order: 10,
			respondShan: true,
			respondSha: true,
			skillTagFilter(player, tag, arg) {
				if (arg === "respond") {
					return false;
				}
				return get.info("dragqianfu").hiddenCard(player, tag.slice("respond".length).toLowerCase());
			},
			result: {
				player(player) {
					if (_status.event.dying) {
						return get.attitude(player, _status.event.dying);
					}
					return 1;
				},
			},
		},
		subSkill: {
			effect: {
				charlotte: true,
				trigger: {
					player: ["useCardToPlayer", "useCardAfter"],
				},
				filter(event, player, name) {
					if (!event?.card?.storage?.dragqianfu) {
						return false;
					}
					return name == "useCardAfter" || event.target.hasSex("female");
				},
				forced: true,
				direct: true,
				async content(event, trigger, player) {
					if (event.triggername == "useCardAfter") {
						await player.draw(3);
					} else {
						await trigger.target.gainMaxHp();
					}
				},
			},
		},
	},
	dragchengyuan: {
		trigger: {
			global: "dying",
		},
		check(event, player) {
			if (get.attitude(player, event.player) < 4) {
				return false;
			}
			if (event.player == player || event.player == get.zhu(player)) {
				return true;
			}
			return !player.hasUnknown();
		},
		limited: true,
		filter(event, player) {
			if (event.player != player && !event.player.hasSex("female")) {
				return false;
			}
			return event.player.hp <= 0;
		},
		skillAnimation: true,
		animationColor: "fire",
		logTarget: "player",
		async content(event, trigger, player) {
			player.awakenSkill(event.name);
			await trigger.player.recoverTo(trigger.player.maxHp);
		},
	},
	dragyuxian: {
		dutySkill: true,
		derivation: ["dragyinglong", "dragxiefang"],
		group: ["dragyuxian_phase", "dragyuxian_achieve", "dragyuxian_fail"],
		subSkill: {
			phase: {
				trigger: {
					global: "phaseAfter",
				},
				prompt2: "执行一个额外回合",
				filter(event, player) {
					if (player.hasSkill("dragyuxian_used")) {
						return false;
					}
					return game.hasGlobalHistory("changeHp", evt => {
						return evt.getParent().name == "recover" && [event.player, player].some(p => p == evt.player);
					});
				},
				async content(event, trigger, player) {
					player.addTempSkill("dragyuxian_used", "roundStart");
					player.insertPhase();
				},
			},
			used: {
				charlotte: true,
			},
			achieve: {
				trigger: {
					player: "phaseZhunbeiBegin",
				},
				filter(event, player) {
					return player.actionHistory.filter(i => i.isMe && !i.isSkipped).length >= 4;
				},
				forced: true,
				locked: false,
				skillAnimation: true,
				animationColor: "fire",
				async content(event, trigger, player) {
					player.awakenSkill("dragyuxian");
					game.log(player, "成功完成使命");
					player.addSkills(["dragyinglong", "dragxiefang"]);
				},
			},
			fail: {
				trigger: {
					player: "dying",
				},
				forced: true,
				filter(event, player) {
					return event.source?.hasSex("female");
				},
				locked: false,
				content() {
					player.awakenSkill("dragyuxian");
					game.log(player, "使命失败");
				},
			},
		},
	},
	dragyinglong: {
		trigger: {
			global: "useCard",
		},
		filter(event, player) {
			return get.is.convertedCard(event.card) || get.is.virtualCard(event.card);
		},
		usable: 1,
		async cost(event, trigger, player) {
			const target = trigger.player;
			const result = await player
				.chooseControl("cancel2")
				.set("prompt", get.prompt(event.skill, target))
				.set("choiceList", [`令${get.translation(target)}本回合使用${get.translation(get.type2(trigger.card))}牌不可被响应`, `令${get.translation(target)}本回合使用${get.translation(get.color(trigger.card))}牌无次数限制`])
				.set("ai", () => {
					const player = get.player(),
						trigger = get.event().getTrigger();
					if (get.attitude(player, trigger.player) <= 0) {
						return "cancel2";
					}
					if (get.color(trigger.card) == "none") {
						return "选项一";
					}
					return target.countCards("h") > Math.random() * 4 ? "选项二" : "选项一";
				})
				.forResult();
			event.result = {
				bool: result.control != "cancel2",
				targets: [target],
				cost_data: result.control,
			};
		},
		async content(event, trigger, player) {
			const target = trigger.player,
				result = event.cost_data == "选项一" ? "dragyinglong_directHit" : "dragyinglong_unlimit";
			target.addTempSkill(result);
			target.markAuto(result, trigger.card);
		},
		subSkill: {
			directHit: {
				onremove: true,
				trigger: {
					player: "useCard",
				},
				filter(event, player) {
					return player.getStorage("dragyinglong_directHit").some(card => get.type2(card) == get.type2(event.card));
				},
				marktext: "威",
				intro: {
					markcount: () => null,
					content(storage, player) {
						const list = player
							.getStorage("dragyinglong_directHit")
							.map(card => {
								return get.translation(get.type2(card));
							})
							.toUniqued();
						if (list.length) {
							return `本回合使用${list.join("、")}牌不可被响应`;
						}
						return "无效果";
					},
				},
				charlotte: true,
				forced: true,
				async content(event, trigger, player) {
					trigger.directHit.addArray(game.players);
					game.log(trigger.card, "不可被响应");
				},
				ai: {
					directHit_ai: true,
					skillTagFilter(player, tag, arg) {
						if (!player.getStorage("dragyinglong_directHit").some(card => get.type2(card) == get.type2(arg.card))) {
							return false;
						}
					},
				},
			},
			unlimit: {
				onremove: true,
				marktext: "武",
				intro: {
					markcount: () => null,
					content(storage, player) {
						const list = player
							.getStorage("dragyinglong_unlimit")
							.map(card => {
								return get.translation(get.color(card));
							})
							.toUniqued();
						if (list.length) {
							return `本回合使用${list.join("、")}牌无次数限制`;
						}
						return "无效果";
					},
				},
				charlotte: true,
				mod: {
					cardUsable(card, player) {
						const color = get.color(card);
						if (color == "unsure" || player.getStorage("dragyinglong_unlimit").some(cardx => get.color(cardx) == color)) {
							return Infinity;
						}
					},
				},
			},
		},
	},
	dragxiefang: {
		locked: false,
		trigger: {
			player: "useCard2",
		},
		filter(event, player) {
			if (!["basic", "trick"].includes(get.type(event.card))) {
				return false;
			}
			if (!event.targets) {
				return false;
			}
			const info = get.info(event.card);
			if (info.allowMultiple == false) {
				return false;
			}
			if (
				event.targets &&
				!info.multitarget &&
				game.hasPlayer(current => {
					return !event.targets.includes(current) && lib.filter.targetEnabled2(event.card, player, current) && lib.filter.targetInRange(event.card, player, current);
				})
			) {
				return true;
			}
			return false;
		},
		async cost(event, trigger, player) {
			const num = Math.max(
				1,
				game.countPlayer(current => current.hasSex("female"))
			);
			event.result = await player
				.chooseTarget(
					get.prompt(event.skill),
					`为${get.translation(trigger.card)}额外指定至多${get.cnNumber(num)}个目标`,
					(card, player, target) => {
						const { targets, card: cardx } = get.event();
						if (targets.includes(target)) {
							return false;
						}
						return lib.filter.targetEnabled2(cardx, player, target) && lib.filter.targetInRange(cardx, player, target);
					},
					[1, num]
				)
				.set("autodelay", true)
				.set("ai", target => {
					const trigger = get.event().getTrigger(),
						player = get.player();
					return get.effect(target, trigger.card, player, player);
				})
				.set("targets", trigger.targets)
				.set("card", trigger.card)
				.forResult();
		},
		async content(event, trigger, player) {
			trigger.targets.addArray(event.targets);
		},
		mod: {
			globalFrom(from, to, distance) {
				const num = Math.max(
					1,
					game.countPlayer(current => current.hasSex("female"))
				);
				return distance - num;
			},
		},
	},
	//华雌
	dragshiyao: {
		global: "dragshiyao_global",
		subSkill: {
			global: {
				enable: "phaseUse",
				usable: 1,
				filterTarget(card, player, target) {
					return target.hasSkill("dragshiyao");
				},
				filter(event, player) {
					const num = game.countPlayer(current => current.hasSkill("dragshiyao"));
					return num > 0;
				},
				selectTarget() {
					const num = game.countPlayer(current => current.hasSkill("dragshiyao"));
					if (num > 1) {
						return 1;
					}
					return -1;
				},
				async content(event, trigger, player) {
					const target = event.target;
					await player.draw();
					const card = game.createCard("du", lib.suit.randomGet(), Math.ceil(Math.random() * 13));
					if (card) {
						await target.gain(card, "gain2");
					}
					const result = await player
						.judge(card => {
							if (get.color(card) == "red") {
								return 2;
							}
							return 1;
						})
						.forResult();
					if (result.color == "red" && player.hasUseTarget({ name: "tao" })) {
						const next = player.chooseToUse();
						next.set("openskilldialog", "试药：是否将一张红色牌当做【桃】使用？");
						next.set("norestore", true);
						next.set("addCount", false);
						next.set("_backupevent", "dragshiyao_backup");
						next.set("custom", {
							add: {},
							replace: { window() {} },
						});
						next.backup("dragshiyao_backup");
					} else if (result.color == "black") {
						await target.loseMaxHp();
						const cardx = game.createCard("du", lib.suit.randomGet(), Math.ceil(Math.random() * 13));
						if (cardx) {
							await player.gain(cardx, "gain2");
						}
					}
				},
				ai: {
					order: 1,
					result: {
						player: 1,
					},
				},
			},
			backup: {
				filterCard(card) {
					return get.itemtype(card) == "card" && get.color(card) == "red";
				},
				viewAs: {
					name: "tao",
				},
				position: "hes",
				selectCard: 1,
				check: card => 7 - get.value(card),
				popname: true,
			},
		},
	},
	dragzuoyu: {
		trigger: {
			global: ["loseHpAfter", "recoverAfter"],
		},
		usable: 1,
		filter(event, player) {
			if (event.player == _status.currentPhase || event.player == player) {
				return false;
			}
			if (event.name == "recover") {
				return true;
			}
			if (!player.countCards("hes", "du") && !_status.connectMode) {
				return false;
			}
			if (!event.player.isIn()) {
				return false;
			}
			return ["sha", "guaguliaodu", "yidugongdu"].some(name => {
				if (player.getStorage("dragduyi_used").includes(name)) {
					return false;
				}
				return player.canUse(get.autoViewAs({ name: name }, "unsure"), event.player, false);
			});
		},
		derivation: "dragduyi",
		direct: true,
		async content(event, trigger, player) {
			if (trigger.name == "recover") {
				const result = await player.chooseBool(get.prompt("dragzuoyu"), "增加1点体力上限").forResult();
				if (result.bool) {
					player.logSkill(event.name);
					await player.gainMaxHp();
					return;
				}
			} else {
				const list = [],
					target = trigger.player;
				for (const name of ["sha", "guaguliaodu", "yidugongdu"]) {
					if (player.getStorage("dragduyi_used").includes(name)) {
						continue;
					}
					if (player.canUse(get.autoViewAs({ name: name }, "unsure"), target, false)) {
						list.push([get.type(name), "", name]);
					}
				}
				if (list.length) {
					const result = await player
						.chooseButton([get.prompt("dragzuoyu", target), [list, "vcard"]])
						.set("ai", button => {
							const player = _status.event.player;
							return player.getUseValue({
								name: button.link[2],
							});
						})
						.forResult();
					if (result.bool) {
						const card = { name: result.links[0][2] };
						game.broadcastAll(card => {
							lib.skill.dragduyi_backup.viewAs = card;
						}, card);
						const next = player.chooseToUse();
						next.set("openskilldialog", `毒医：是否将一张【毒】当做【${get.translation(card)}】对${get.translation(target)}使用`);
						next.set("norestore", true);
						next.set("addCount", false);
						next.set("_backupevent", "dragduyi_backup");
						next.set("custom", {
							add: {},
							replace: { window() {} },
						});
						next.set("onlyTarget", target);
						next.backup("dragduyi_backup");
						const result2 = await next.forResult();
						if (result2.bool) {
							return;
						}
					}
				}
			}
			player.storage.counttrigger.dragzuoyu--;
		},
	},
	dragduyi: {
		enable: "chooseToUse",
		filter(event, player) {
			if (!player.countCards("hes", "du") && !_status.connectMode) {
				return false;
			}
			return ["sha", "guaguliaodu", "yidugongdu"].some(name => {
				if (player.getStorage("dragduyi_used").includes(name)) {
					return false;
				}
				return event.filterCard(get.autoViewAs({ name: name }, "unsure"), player, event);
			});
		},
		chooseButton: {
			dialog(event, player) {
				const list = [];
				for (const name of ["sha", "guaguliaodu", "yidugongdu"]) {
					if (player.getStorage("dragduyi_used").includes(name)) {
						continue;
					}
					if (event.filterCard(get.autoViewAs({ name: name }, "unsure"), player, event)) {
						list.push([get.type(name), "", name]);
					}
				}
				return ui.create.dialog("毒医", [list, "vcard"]);
			},
			check(button) {
				const player = _status.event.player;
				return player.getUseValue({
					name: button.link[2],
				});
			},
			backup(links, player) {
				const backup = get.copy(lib.skill["dragduyi_backup"]);
				backup.viewAs = { name: links[0][2] };
				return backup;
			},
			prompt(links, player) {
				return "将一张【毒】当做【" + get.translation(links[0][2]) + "】使用";
			},
		},
		hiddenCard(player, name) {
			if (!["sha", "guaguliaodu", "yidugongdu"].includes(name)) {
				return false;
			}
			if (player.getStorage("dragduyi_used").includes(name)) {
				return false;
			}
			return player.countCards("hes", "du");
		},
		ai: {
			respondSha: true,
			skillTagFilter(player) {
				if (player.getStorage("dragduyi_used").includes("sha")) {
					return false;
				}
				if (!player.countCards("hes", "du")) {
					return false;
				}
			},
			order: 1,
			result: { player: 1 },
		},
		subSkill: {
			used: {
				charlotte: true,
				onremove: true,
			},
			backup: {
				filterCard: card => get.itemtype(card) == "card" && get.name(card) == "du",
				popname: true,
				check(card) {
					return 8 - get.value(card);
				},
				filterTarget(card, player, target) {
					const targetx = get.event().onlyTarget;
					if (targetx && targetx != target) {
						return false;
					}
					return lib.filter.filterTarget.apply(this, arguments);
				},
				position: "hes",
				async precontent(event, trigger, player) {
					const evt = event.getParent("chooseToUse", null, true);
					if (evt?.onlyTarget) {
						player.logSkill("dragzuoyu", [evt.onlyTarget]);
					}
				},
				onuse(event, player) {
					player.addTempSkill("dragduyi_used");
					player.markAuto("dragduyi_used", event.card.name);
				},
			},
		},
	},
	dragjuliao: {
		trigger: {
			player: "loseHpBegin",
			global: "useCardToTargeted",
		},
		forced: true,
		filter(event, player) {
			if (event.name == "loseHp") {
				return event.type == "du";
			}
			if (event.player != player || event.target == player) {
				return false;
			}
			return get.is.convertedCard(event.card);
		},
		logTarget(event, player) {
			return event[event.name == "loseHp" ? "player" : "target"];
		},
		async content(event, trigger, player) {
			if (trigger.name == "loseHp") {
				trigger.cancel();
			} else {
				const target = trigger.target,
					bool = target.maxHp > 1 && get.effect(target, trigger.card, player, target) <= -7;
				const result = await target
					.chooseBool(`拒疗：是否减少1点体力上限，令【${get.translation(trigger.card)}】对你无效？`)
					.set("choice", bool)
					.forResult();
				if (result.bool) {
					await target.loseMaxHp();
					trigger.getParent().excluded.add(target);
				}
			}
		},
		ai: {
			nodu: true,
		},
	},
};

export default skills;
