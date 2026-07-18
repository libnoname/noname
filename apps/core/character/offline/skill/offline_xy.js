import { lib, game, ui, get, ai, _status } from "noname";
import html from "dedent";

/** @type { importCharacterConfig["skill"] } */
const skills = {
	//徐兖纵横
	//吕布
	xy_xiaoxi: {
		trigger: {
			global: "phaseBefore",
			player: ["enterGame", "phaseDrawBegin1"],
		},
		filter(event, player) {
			if (event.name == "phaseDraw") {
				return !event.numFixed;
			}
			return event.name != "phase" || game.phaseNumber == 0;
		},
		forced: true,
		locked: false,
		onremove: true,
		async content(event, trigger, player) {
			if (trigger.name == "phaseDraw") {
				trigger.num = player.countMark(event.name);
				trigger.numFixed = true;
				player.removeMark(event.name, 1);
			} else {
				player.addMark(event.name, 7);
			}
		},
		marktext: "势",
		intro: {
			name: "势",
			content: "mark",
		},
	},
	xy_fenqi: {
		enable: "phaseUse",
		filter(event, player) {
			return !player.hasSkill("xy_fenqi_used") && player.hasMark("xy_xiaoxi");
		},
		manualConfirm: true,
		async content(event, trigger, player) {
			player.addTempSkill("xy_fenqi_used");
			player.removeMark("xy_xiaoxi", 1);
			const args = [
				["diamond", 13],
				["club", 12],
				["heart", 2],
				["spade", 1],
			].randomGet();
			const card = game.createCard2("yiguzuoqi", ...args);
			if (!lib.inpile.includes("yiguzuoqi")) {
				game.broadcastAll(() => {
					lib.inpile.add("yiguzuoqi");
				});
			}
			await player.gain(card, "gain2");
		},
		subSkill: {
			used: {
				charlotte: true,
			},
		},
		ai: {
			combo: "xy_xiaoxi",
			order: 11,
			result: {
				player(player) {
					const cards = player.getCards("hs", card => {
						if (get.name(card) != "sha") {
							return false;
						}
						return player.hasValueTarget(card, false);
					});
					if (cards.length >= player.getCardUsable("sha", true)) {
						return 1;
					}
					return 0;
				},
			},
		},
	},
	yiguzuoqi_effect: {
		trigger: {
			player: "useCard",
		},
		charlotte: true,
		forced: true,
		popup: false,
		async content(event, trigger, player) {
			if (trigger.addCount !== false) {
				trigger.addCount = false;
				const stat = player.getStat().card,
					name = trigger.card.name;
				if (typeof stat[name] == "number" && stat[name] > 0) {
					stat[name]--;
				}
			}
		},
		mod: {
			cardUsable: () => Infinity,
			targetInRange: () => true,
		},
	},
	//张邈
	xy_mouni: {
		audio: "mouni",
		trigger: {
			player: "phaseBegin",
		},
		filter(event, player) {
			return game.hasPlayer(current => {
				return current != player && current.countCards("h");
			});
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt2(event.skill), (card, player, target) => {
					return player != target && target.countCards("h");
				})
				.set("ai", target => {
					const player = get.player();
					return (-get.attitude(player, target) * target.countCards("h")) / Math.max(1, target.getHp());
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			const { cards } = await target.showHandcards(`${get.translation(player)}发动了【谋逆】`).forResult();
			const shas = cards.filter(card => get.name(card) == "sha"),
				list = [];
			while (shas.length) {
				const card = shas.find(card => player.canUse(card, target, false));
				if (card) {
					shas.remove(card);
					const next = player.useCard(card, target, false);
					list.push(next);
					await next;
					if (
						game.getGlobalHistory("everything", evt => {
							if (evt.name != "dying" || evt.player != target) {
								return false;
							}
							return evt.reason?.getParent(2) == next;
						}).length
					) {
						break;
					}
				} else {
					break;
				}
			}
			if (list.length && list.every(evt => !player.hasHistory("sourceDamage", evtx => evtx.getParent(2) == evt))) {
				const evt = event.getParent("phase", true);
				if (evt) {
					game.log(player, "结束了回合");
					evt.num = evt.phaseList.length;
					evt.goto(11);
				}
			}
		},
	},
	xy_zongfan: {
		audio: "zongfan",
		juexingji: true,
		skillAnimation: true,
		animationColor: "metal",
		derivation: "xy_zhangu",
		trigger: {
			player: "phaseEnd",
		},
		filter(event, player) {
			if (!player.hasHistory("useSkill", evt => evt.skill == "xy_mouni")) {
				return false;
			}
			return game.hasGlobalHistory("everything", evt => evt.name == "dying");
		},
		forced: true,
		async content(event, trigger, player) {
			player.awakenSkill(event.name);
			let num = 0;
			if (player.countCards("he")) {
				const result = await player
					.chooseCardTarget({
						prompt: "纵反",
						prompt2: "将任意张牌交给一名其他角色，然后增加等量体力上限并恢复等量体力",
						forced: true,
						filterCard: true,
						selectCard: [1, Infinity],
						allowChooseAll: true,
						position: "he",
						filterTarget: lib.filter.notMe,
						ai1(card) {
							return 1;
						},
						ai2(target) {
							const player = get.player();
							return get.attitude(player, target);
						},
					})
					.forResult();
				if (result.bool) {
					await player.give(result.cards, result.targets[0]);
					num = result.cards.length;
				}
			}
			if (num > 0) {
				await player.gainMaxHp(num);
			}
			await player.removeSkills("xy_mouni");
			if (num > 0) {
				await player.recover(num);
			}
			await player.addSkills("xy_zhangu");
		},
		ai: {
			combo: "xy_mouni",
		},
	},
	xy_zhangu: {
		audio: "zhangu",
		trigger: {
			player: "phaseBegin",
		},
		filter(event, player) {
			if (player.maxHp <= 1) {
				return false;
			}
			return ["h", "e"].some(pos => !player.countCards(pos));
		},
		forced: true,
		async content(event, trigger, player) {
			await player.loseMaxHp();
			await player.draw(2);
		},
	},
	//曹嵩
	xy_lilu: {
		audio: "cslilu",
		trigger: {
			player: "phaseDrawBegin1",
		},
		filter(event, player) {
			return !event.numFixed;
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseToDiscard(get.prompt2(event.skill), [0, Infinity], "allowChooseAll", "he")
				.set("ai", card => {
					const player = get.player();
					if (player.countCards("h") > Math.min(5, player.maxHp)) {
						return 0;
					}
					return 4 - get.value(card);
				})
				.set("chooseonly", true)
				.forResult();
		},
		async content(event, trigger, player) {
			trigger.changeToZero();
			if (event.cards?.length) {
				await player.modedDiscard(event.cards);
			}
			const num = Math.min(5, player.maxHp);
			if (player.countCards("h") < num) {
				await player.drawTo(num);
			}
			if (!player.countCards("h")) {
				return;
			}
			let str = "将至少一张手牌交给一名其他角色",
				numx = 0;
			let evts = player.getAllHistory("custom", evt => evt.skill == event.name);
			if (evts?.length) {
				numx = evts[evts.length - 1].num ?? 0;
			}
			if (numx < player.countCards("h")) {
				str = `${str}，${numx > 0 ? `若给出的牌数大于${get.cnNumber(numx)}张，你` : "然后"}增加1点体力上限并回复1点体力`;
			}
			const result = await player
				.chooseCardTarget({
					prompt: str,
					filterCard: true,
					filterTarget: lib.filter.notMe,
					selectCard: [1, Infinity],
					forced: true,
					ai1(card) {
						const { player, goon } = get.event();
						if (ui.selected.cards.length < goon) {
							if (
								get.tag(card, "damage") &&
								game.hasPlayer(current => {
									current != player && get.attitude(player, current) > 0 && !current.hasSkillTag("nogain") && !current.hasJudge("lebu") && current.hasValueTarget(card);
								})
							) {
								return 1;
							}
							return 1 / Math.max(0.1, get.value(card));
						}
						return 0;
					},
					ai2(target) {
						return Math.sqrt(5 - Math.min(4, target.countCards("h"))) * get.attitude(get.player(), target);
					},
					goon: (() => {
						if (
							!game.hasPlayer(function (current) {
								return current != player && get.attitude(player, current) > 0 && !current.hasSkillTag("nogain") && !current.hasJudge("lebu");
							})
						) {
							return 1;
						}
						if (num < player.countCards("h")) {
							return num + 1;
						}
						return 1;
					})(),
					allowChooseAll: true,
				})
				.forResult();
			if (result.bool) {
				const {
					cards,
					targets: [target],
				} = result;
				await player.give(cards, target);
				if (cards.length > numx) {
					await player.gainMaxHp();
					await player.recover();
				}
				player.getHistory("custom").push({
					skill: event.name,
					num: cards.length,
				});
			}
		},
	},
	xy_yizheng: {
		audio: "csyizheng",
		trigger: { player: "phaseJieshuBegin" },
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt2(event.skill), lib.filter.notMe)
				.set("ai", target => {
					if (target.isTurnedOver() || target.hasJudge("lebu")) {
						return 0;
					}
					return get.attitude(_status.event.player, target) * Math.max(0, target.countCards("h") - 2);
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const target = event.targets[0],
				name = `${event.name}_effect`;
			player.markAuto(name, target);
			player.addTip(name, `翊正 ${get.translation(player.getStorage(name))}`);
			player.addTempSkill(name, { player: "phaseBegin" });
		},
		subSkill: {
			effect: {
				audio: "xy_yizheng",
				onremove(player, skill) {
					player.removeTip(skill);
					delete player.storage[skill];
				},
				charlotte: true,
				trigger: {
					global: ["recoverBegin", "damageBegin1"],
				},
				forced: true,
				logTarget(event) {
					return event.name == "damage" ? event.source : event.player;
				},
				filter(event, player) {
					const target = lib.skill.xy_yizheng_effect.logTarget(event);
					return player.getStorage("xy_yizheng_effect").includes(target);
				},
				async content(event, trigger, player) {
					await player.loseMaxHp();
					trigger.num++;
				},
			},
		},
	},
	//曹操
	xy_shengju: {
		forced: true,
		mod: {
			cardUsable(card, player, num) {
				if (get.name(card) == "sha") {
					return Math.min(
						5,
						game.countPlayer(current => current.group == "wei")
					);
				}
			},
			attackRange(player, num) {
				return Math.min(
					5,
					game.countPlayer(current => current.group == "wei")
				);
			},
		},
		trigger: { player: "phaseDrawBegin2" },
		filter(event, player) {
			return !event.numFixed;
		},
		async content(event, trigger, player) {
			trigger.num = Math.min(
				5,
				game.countPlayer(current => current.group == "wei")
			);
		},
	},
	xy_mintong: {
		trigger: { global: "useCardAfter" },
		usable: 1,
		check(event, player) {
			return get.effect(event.player, { name: "sha" }, player, player) > 0;
		},
		filter(event, player) {
			if (!get.is.damageCard(event.card) || event.targets?.length !== 1) {
				return false;
			}
			if (event.targets[0].group !== "wei") {
				return false;
			}
			const card = get.autoViewAs({ name: "sha", isCard: true });
			return player.canUse(card, event.player, false);
		},
		logTarget: "player",
		async content(event, trigger, player) {
			const sha = get.autoViewAs({ name: "sha", isCard: true });
			if (player.canUse(sha, trigger.player, false)) {
				player.useCard(sha, trigger.player, false);
			}
		},
	},
	//程昱
	xy_liaofu: {
		enable: "phaseUse",
		trigger: { global: "useCard" },
		filterCard: (card, player, target) => {
			if (card.name !== "sha") {
				return false;
			}
			const cards = player.getExpansions("xy_liaofu"),
				natures = get.natureList(card);
			return cards.every(cardx => {
				const list = get.natureList(cardx);
				return list.length !== natures.length || !natures.containsAll(...list);
			});
		},
		position: "he",
		selectCard: 1,
		lose: false,
		discard: false,
		marktext: "伏",
		intro: {
			mark(dialog, storage, player) {
				var cards = player.getExpansions("xy_liaofu");
				if (player.isUnderControl(true)) {
					dialog.addAuto(cards);
				} else {
					return "共有" + get.cnNumber(cards.length) + "张牌";
				}
			},
			markcount: "expansion",
		},
		onremove(player, skill) {
			const cards = player.getExpansions(skill);
			if (cards.length) {
				player.loseToDiscardpile(cards);
			}
		},
		filter(event, player) {
			if (event.name == "useCard") {
				if (player == _status.currentPhase || player == event.player || event.card.name != "sha") {
					return false;
				}
				const natures = get.natureList(event.card),
					cards = player.getExpansions("xy_liaofu");
				if (!cards.length) {
					return false;
				}
				return cards.some(cardx => {
					const list = get.natureList(cardx);
					return list.length === natures.length && natures.containsAll(...list);
				});
			}
			return !player.hasSkill("xy_liaofu_used") && player.countCards("he", card => get.info("xy_liaofu").filterCard(card, player));
		},
		async cost(event, trigger, player) {
			const result = await player
				.chooseCardButton(`###${get.prompt(event.skill, trigger.player)}###弃置一张同属性杀并对其造成1点同属性伤害`, player.getExpansions(event.skill))
				.set("ai", button => {
					const player = get.player(),
						target = get.event().getTrigger().player,
						natures = get.natureList(button.link).join(lib.natureSeparator);
					return get.damageEffect(target, player, player, natures);
				})
				.set("filterButton", button => {
					const event = get.event().getTrigger();
					const list = get.natureList(event.card);
					const natures = get.natureList(button.link);
					return list.length === natures.length && list.containsAll(...natures);
				})
				.forResult();
			if (result?.bool) {
				event.result = {
					bool: true,
					targets: [trigger.player],
					cost_data: result.links,
				};
			}
		},
		async content(event, trigger, player) {
			const { cards, name, cost_data } = event;
			if (cost_data?.length > 0) {
				await player.loseToDiscardpile(cost_data);
				await trigger.player.damage(1, get.natureList(cost_data[0]).join(lib.natureSeparator));
			} else {
				player.addTempSkill("xy_liaofu_used", { global: "phaseChange" });
				const next = player.addToExpansion(cards, player, "giveAuto");
				next.gaintag.add(name);
				await next;
			}
		},
		ai: {
			order: 10,
			result: {
				player: 1,
				target: 1,
			},
			fireAttack: true,
			skillTagFilter: (player, tag) => {
				return player.getExpansions("xy_liaofu").length > 0;
			},
		},
		subSkill: {
			used: {
				charlotte: true,
			},
		},
	},
	xy_jinshou: {
		trigger: { player: "phaseJieshuBegin" },
		filter(event, player) {
			return game.getGlobalHistory("changeHp", evt => evt.player == player && evt.changedHp !== 0).length == 0;
		},
		check(event, player) {
			const cards = player.getCards("h");
			const num = cards.reduce((num, card) => {
				if (get.name(card) == "tao") {
					return (num += 2);
				}
				{
					return (num += 1);
				}
			}, 0);
			return num < player.getHandcardLimit();
		},
		prompt2: "是否弃置所有手牌并且直到你的下回合开始，其他角色不能对你使用单目标伤害牌",
		async content(event, trigger, player) {
			player.discard(player.getDiscardableCards(player, "h"));
			player.loseHp();
			player.addTempSkill("xy_jinshou_effect", { player: "phaseBegin" });
		},
		subSkill: {
			effect: {
				charlotte: true,
				mark: true,
				marktext: "烬守",
				intro: { content: "其他角色不能对你使用单目标伤害牌" },
				mod: {
					targetEnabled(card, player, target) {
						if (get.info(card).selectTarget == 1 && get.is.damageCard(card)) {
							return false;
						}
					},
				},
			},
		},
	},
	//荀彧
	xy_jianzu: {
		enable: "phaseUse",
		usable: 1,
		filterTarget(card, player, target) {
			return target != player && player.canCompare(target);
		},
		selectTarget: 1,
		filter(event, player) {
			return player.countCards("h") > 0 && game.hasPlayer(curr => player.canCompare(curr));
		},
		async content(event, trigger, player) {
			const result = await player.chooseToCompare(event.targets[0]).forResult();
			if (!result.tie) {
				const win = result.bool ? player : event.targets[0];
				if (!game.hasPlayer(curr => win.inRange(curr))) {
					win.chat("手短是会呼吸的痛");
				} else {
					const { targets } = await win
						.chooseTarget("请选择一名攻击范围内的角色对其造成1点伤害", true, 1)
						.set("filterTarget", (card, player, target) => {
							return player.inRange(target);
						})
						.set("ai", target => {
							if (get.effect(target, { name: "damage" }, player, player) > 0) {
								return -get.attitude(player, target);
							}
						})
						.forResult();
					await targets[0].damage(win);
				}
			}
		},
		ai: {
			result: {
				player(player, target) {
					const list = player.getCards("h").map(card => get.number(card));
					if (get.attitude(player, target) > 0) {
						return [1, 1];
					} else {
						let num = 0;
						for (let i of [7, 10, 13]) {
							if (Math.max(...list) >= i) {
								num++;
							}
						}
						if (num == 0) {
							return -10;
						}
						return [1, num];
					}
				},
				target(player, target) {
					const list = player.getCards("h").map(card => get.number(card));
					if (get.attitude(player, target) > 0) {
						return [1, 1];
					} else {
						let num = 3;
						for (let i of [7, 10, 13]) {
							if (Math.max(...list) >= i) {
								num--;
							}
						}
						return [1, -num];
					}
				},
			},
		},
	},
	xy_dishou: {
		trigger: { player: "damageBegin4" },
		filter(event, player) {
			if (!event.source?.isIn()) {
				return false;
			}
			return event.source.countCards("h") != event.source.getHp();
		},
		check(event, player) {
			if (get.attitude(player, event.source) > 0) {
				return false;
			}
			return true;
		},
		async content(event, trigger, player) {
			const target = trigger.source;
			do {
				let result;
				const choiceList = ["弃置所有手牌", "失去1点体力"];
				if (!target.countDiscardableCards(target, "h")) {
					result = { index: 1 };
				} else {
					result = await target
						.chooseControl()
						.set("choiceList", choiceList)
						.set("ai", () => 1)
						.forResult();
				}
				if (result?.index == 0) {
					await target.modedDiscard(target.getCards("h"));
				} else if (result?.index == 1) {
					await target.loseHp();
				}
			} while (target.countCards("h") != target.getHp() && target.isIn() && !game.hasGlobalHistory("everything", evt => evt.name == "dying" && evt.player == target && evt.reason.getParent() == event));
		},
		ai: {
			effect: {
				target: function (card, player, target) {
					if (player.hasSkillTag("jueqing", false, target)) {
						return [1, -2];
					}
					if (card.cards?.length > 0) {
						return [1, -2];
					}
					if (get.tag(card, "damage") || card.name == "damage") {
						return [1, 10];
					}
				},
			},
		},
	},
	//陈宫
	xy_jizheng: {
		trigger: { player: "drawBegin" },
		usable: 1,
		filter(event, player) {
			return game.hasPlayer(curr => curr.hasUseTarget({ name: "sha", isCard: true }, false));
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt2(event.skill))
				.set("ai", target => {
					const player = get.player(),
						card = new lib.element.VCard({ name: "sha", isCard: true });
					return target.getUseValue(card, false) * get.attitude(player, target);
				})
				.forResult();
		},
		async content(event, trigger, player) {
			trigger.cancel();
			const target = event.targets[0],
				card = new lib.element.VCard({ name: "sha", isCard: true });
			await target.chooseUseTarget(card, false, true, "nodistance");
		},
	},
	//张闿
	xy_luejin: {
		trigger: {
			global: "phaseDrawEnd",
		},
		check(event, player) {
			return get.effect(event.player, { name: "sha", isCard: true }, player, player) > 0;
		},
		filter(event, player) {
			let num = 0;
			event.player.getHistory("gain", evt => {
				if (evt.getParent()?.name != "draw") {
					return false;
				}
				if (evt.getParent(event.name) != event) {
					return false;
				}
				if (!evt?.cards?.length) {
					return false;
				}
				num += evt.cards.length;
			});
			return num > 2;
		},
		async content(event, trigger, player) {
			if (player.canUse({ name: "sha", isCard: true }, trigger.player, false)) {
				const next = player.useCard({ name: "sha", isCard: true }, trigger.player, false);
				await next;
				if (!trigger.player.hasHistory("damage", evt => evt.card == next.card)) {
					player.recover();
				}
			}
		},
	},
};

export default skills;
