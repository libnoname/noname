import { lib, game, ui, get as _get, ai, _status } from "../../../../../noname.js";
import { cast } from "../../../../../noname/util/index.js";
import { GetGuozhan } from "../../patch/get.js";
import { PlayerGuozhan } from "../../patch/player.js";

/** @type {GetGuozhan}  */
const get = cast(_get);

export default {
	//手杀杜预
	gz_wuku: {
		audio: "spwuku",
		trigger: { global: "useCard" },
		forced: true,
		preHidden: true,
		filter(event, player) {
			if (get.type(event.card) != "equip") {
				return false;
			}
			if (player.isFriendOf(event.player)) {
				return false;
			}
			return player.countMark("gz_wuku") < 2;
		},
		async content(event, trigger, player) {
			player.addMark("gz_wuku", 1);
		},
		marktext: "库",
		intro: {
			content: "mark",
		},
		ai: {
			combo: "gz_miewu",
		},
	},
	gz_miewu: {
		audio: "spmiewu",
		enable: ["chooseToUse", "chooseToRespond"],
		filter(event, player) {
			if (!player.countMark("gz_wuku") || !player.countCards("hse") || player.hasSkill("gz_miewu_used")) {
				return false;
			}
			for (let i of lib.inpile) {
				let type = get.type2(i);
				if ((type == "basic" || type == "trick") && event.filterCard(get.autoViewAs({ name: i }, "unsure"), player, event)) {
					return true;
				}
			}
			return false;
		},
		chooseButton: {
			dialog(event, player) {
				let list = [];
				for (let i = 0; i < lib.inpile.length; i++) {
					let name = lib.inpile[i];
					if (name == "sha") {
						if (event.filterCard(get.autoViewAs({ name }, "unsure"), player, event)) {
							list.push(["基本", "", "sha"]);
						}
						for (let nature of lib.inpile_nature) {
							if (event.filterCard(get.autoViewAs({ name, nature }, "unsure"), player, event)) {
								list.push(["基本", "", "sha", nature]);
							}
						}
					} else if (get.type2(name) == "trick" && event.filterCard(get.autoViewAs({ name }, "unsure"), player, event)) {
						list.push(["锦囊", "", name]);
					} else if (get.type(name) == "basic" && event.filterCard(get.autoViewAs({ name }, "unsure"), player, event)) {
						list.push(["基本", "", name]);
					}
				}
				return ui.create.dialog("灭吴", [list, "vcard"]);
			},
			check(button) {
				if (_status.event.getParent().type != "phase") {
					return 1;
				}
				let player = _status.event.player;
				if (["wugu", "zhulu_card", "yiyi", "lulitongxin", "lianjunshengyan", "diaohulishan"].includes(button.link[2])) {
					return 0;
				}
				return player.getUseValue({
					name: button.link[2],
					nature: button.link[3],
				});
			},
			backup(links, player) {
				return {
					filterCard: true,
					audio: "gz_miewu",
					popname: true,
					check(card) {
						return 8 - get.value(card);
					},
					position: "hse",
					viewAs: { name: links[0][2], nature: links[0][3] },
					onuse(result, player) {
						const next = game.createEvent("miewuDraw", false, _status.event.getParent());
						next.player = player;
						next.setContent(async (event, trigger, player) => {
							await player.draw();
						});
					},
					onrespond(result, player) {
						const next = game.createEvent("miewuDraw", false, _status.event.getParent());
						next.player = player;
						next.setContent(async (event, trigger, player) => {
							await player.draw();
						});
					},
					precontent() {
						player.addTempSkill("gz_miewu_used");
						player.removeMark("gz_wuku", 1);
					},
				};
			},
			prompt(links, player) {
				return "将一张牌当做" + (get.translation(links[0][3]) || "") + get.translation(links[0][2]) + "使用";
			},
		},
		hiddenCard(player, name) {
			if (!lib.inpile.includes(name)) {
				return false;
			}
			var type = get.type2(name);
			return (type == "basic" || type == "trick") && player.countMark("gz_wuku") > 0 && player.countCards("she") > 0 && !player.hasSkill("gz_miewu_used");
		},
		ai: {
			combo: "gz_wuku",
			fireAttack: true,
			respondSha: true,
			respondShan: true,
			skillTagFilter(player) {
				if (!player.countMark("gz_wuku") || !player.countCards("hse") || player.hasSkill("gz_miewu_used")) {
					return false;
				}
			},
			order: 1,
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
			used: {
				charlotte: true,
			},
			backup: {
				audio: "gz_miewu",
			},
		},
	},
	//紫气东来
	gz_yingshi: {
		audio: "smyyingshi",
		trigger: {
			player: "phaseUseBegin",
		},
		filter(event, player) {
			const card = new lib.element.VCard({ name: "zhibi" });
			return game.hasPlayer(current => current.hasUseTarget(card));
		},
		preHidden: true,
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt2(event.skill), 2)
				.set("filterTarget", (cardx, player, target) => {
					const card = new lib.element.VCard({ name: "zhibi" });
					if (ui.selected.targets.length) {
						const user = ui.selected.targets[0];
						return user.canUse(card, target);
					}
					return target.hasUseTarget(card);
				})
				.set("ai", target => {
					const att = get.attitude(get.player(), target);
					if (att <= 0) {
						return 0;
					}
					const card = new lib.element.VCard({ name: "zhibi" });
					return target != get.player() ? target.getUseValue(card) : 0.2;
				})
				.set("targetprompt", ["使用者", "目标"])
				.set("complexTarget", true)
				.setHiddenSkill(event.skill)
				.forResult();
		},
		async content(event, trigger, player) {
			const card = new lib.element.VCard({ name: "zhibi" });
			await event.targets[0].useCard(card, event.targets[1], "noai");
			if (event.targets[0] != player) {
				await player.draw();
			}
		},
	},
	gz_ejue: {
		audio: "oljianmie",
		trigger: {
			source: "damageBegin1",
		},
		filter(event, player) {
			return event?.card?.name == "sha" && event.player.isUnseen();
		},
		preHidden: true,
		forced: true,
		logTarget: "player",
		async content(event, trigger, player) {
			trigger.num++;
		},
	},
	gz_shangshi: {
		audio: "reshangshi",
		trigger: {
			global: "phaseEnd",
		},
		filter(event, player) {
			return player.countCards("h") < player.getDamagedHp();
		},
		preHidden: true,
		frequent: true,
		async content(event, trigger, player) {
			await player.drawTo(player.getDamagedHp());
		},
	},
	gz_yimie: {
		locked: true,
		audio: "yimie",
		global: "gz_yimie_effect",
		trigger: { global: "dying" },
		priority: 16,
		forced: true,
		preHidden: true,
		filter(event, player, name) {
			return _status.currentPhase == player;
		},
		logTarget: "player",
		async content() { },
		subSkill: {
			effect: {
				enable: "chooseToUse",
				viewAsFilter(player) {
					if (!_status.currentPhase || !_status.currentPhase.hasSkill("gz_yimie")) {
						return false;
					}
					const target = _status.event.dying;
					if (!target || target.isUnseen()) {
						return false;
					}
					return !player.isFriendOf(target) && player.countCards("hs", { suit: "heart" });
				},
				filterCard(card) {
					return get.suit(card) == "heart";
				},
				locked: true,
				position: "hs",
				viewAs: { name: "tao" },
				prompt: "将一张♥手牌当桃使用",
				check(card) {
					return 15 - get.value(card);
				},
				mod: {
					cardSavable(card, player) {
						if (card.name == "tao" && _status.currentPhase?.isIn() && _status.currentPhase.hasSkill("gz_yimie")) {
							if (_status.event.dying && player.isFriendOf(_status.event.dying)) {
								return false;
							}
						}
					},
					cardEnabled(card, player) {
						if (card.name == "tao" && _status.currentPhase?.isIn() && _status.currentPhase.hasSkill("gz_yimie")) {
							if (_status.event.dying && player.isFriendOf(_status.event.dying)) {
								return false;
							}
						}
					},
				},
			},
		},
	},
	gz_ruilve: {
		audio: "ruilve",
		global: "gz_ruilve_give",
		subSkill: {
			used: {
				charlotte: true,
			},
			give: {
				enable: "phaseUse",
				discard: false,
				lose: false,
				delay: false,
				line: true,
				log: false,
				prepare(cards, player, targets) {
					targets[0].logSkill("gz_ruilve");
				},
				prompt() {
					let player = _status.event.player;
					let list = game.filterPlayer(function (target) {
						return target != player && target.hasSkill("gz_ruilve");
					});
					let str = "将一张具有伤害标签的牌交给" + get.translation(list);
					if (list.length > 1) {
						str += "中的一人";
					}
					return str;
				},
				filter(event, player) {
					if (!player.isUnseen()) {
						return false;
					}
					if (player.countCards("h", lib.skill.gz_ruilve_give.filterCard) == 0) {
						return false;
					}
					return game.hasPlayer(function (target) {
						return target != player && target.hasSkill("gz_ruilve") && !target.hasSkill("gz_ruilve_used");
					});
				},
				filterCard(card) {
					if (!get.tag(card, "damage")) {
						return false;
					}
					return true;
				},
				visible: true,
				filterTarget(card, player, target) {
					return target != player && target.hasSkill("gz_ruilve") && !target.hasSkill("gz_ruilve_used");
				},
				async content(event, trigger, player) {
					await player.showCards(event.cards);
					await player.give(event.cards, event.target);
					event.target.addTempSkill("gz_ruilve_used", "phaseUseEnd");
					await player.draw();
				},
				ai: {
					expose: 0.3,
					order: 1,
					result: {
						target: 5,
					},
				},
			},
		},
	},
	gz_zhaoran: {
		audio: "zhaoran",
		trigger: {
			player: "phaseUseBefore",
		},
		filter(event, player) {
			return game.countGroup() < 4;
		},
		preHidden: true,
		async content(event, trigger, player) {
			const num = 4 - game.countGroup();
			if (num > 0) {
				await player.draw(num);
			}
			let target = player.getNext();
			while (target != player) {
				if (!target.isUnseen()) {
					target = target.getNext();
				} else {
					player.line(target, "green");
					const result = await target
						.chooseControl("明置主将", "明置副将", "cancel2")
						.set("ai", () => {
							return get.event("value");
						})
						.set(
							"value",
							(() => {
								const att = get.attitude(target, player),
									num = player.countCards("h") - player.hp;
								if (num < 3) {
									return 2;
								}
								if (att > 0) {
									return player.hp > 2 ? [1, 0].randomGet() : 2;
								}
								return player.hp <= 2 ? [1, 0].randomGet() : 2;
							})()
						)
						.set("prompt", `昭然：是否明置一张武将牌令${get.translation(player)}结束回合？`)
						.forResult();
					if (result.control != "cancel2") {
						await target.showCharacter(result.index);
						trigger.cancel();
						let evt = trigger.getParent("phase");
						if (evt && evt.player == player) {
							game.log(player, "结束了回合");
							evt.num = evt.phaseList.length;
							evt.goto(11);
						}
						break;
					}
					target = target.getNext();
				}
			}
		},
	},
	gz_beiluan: {
		audio: "choufa",
		trigger: {
			player: "damageEnd",
		},
		logTarget: "source",
		preHidden: true,
		filter(event, player) {
			return event.source;
		},
		async content(event, trigger, player) {
			trigger.source.addTempSkill("gz_beiluan_viewas");
		},
		ai: {
			maixie_defend: true,
			effect: {
				target(card, player, target) {
					if (player.countCards("he", cardx => cardx.name != "sha" && get.tag(cardx, "damage")) > 1 && get.tag(card, "damage")) {
						if (player.hasSkillTag("jueqing", false, target)) {
							return [1, -1.5];
						}
						if (get.attitude(target, player) < 0) {
							return [1, 0, 1, -1];
						}
					}
				},
			},
		},
		subSkill: {
			viewas: {
				onremove: true,
				charlotte: true,
				mark: true,
				intro: {
					content: "手牌中的非装备牌均视为杀",
				},
				mod: {
					cardname(card, player) {
						if (get.type2(card, false) != "equip") {
							return "sha";
						}
					},
					cardnature(card, player) {
						if (get.type2(card, false) != "equip") {
							return false;
						}
					},
				},
			},
		},
	},
	gz_pojing: {
		enable: "phaseUse",
		usable: 1,
		audio: "naxiang",
		filterTarget: lib.filter.notMe,
		async content(event, trigger, player) {
			const target = event.target;
			const result = await target
				.chooseControl()
				.set("prompt", "迫境：选择一项")
				.set("choiceList", [`令${get.translation(player)}获得你区域里的一张牌`, `令与${get.translation(player)}势力相同的角色可以明置武将牌对你造成伤害`])
				.set("ai", () => get.event("value"))
				.set(
					"value",
					(() => {
						const targets = game.filterPlayer(current => current != target && current.isUnseen()),
							jins = game.filterPlayer(current => current.identity == player.identity && current.isUnseen(2));
						if (Math.random() * 10 < targets.length || jins.length) {
							return get.damageEffect(target, player, target) > 0 ? 1 : 0;
						}
						return 1;
					})()
				)
				.forResult();
			if (result.index == 0) {
				await player.gainPlayerCard(target, "hej", true);
			} else {
				const players = game
					.filterPlayer(function (current) {
						return current.isUnseen() || current.identity == player.identity;
					})
					.sort(lib.sort.seat);
				let num = 0,
					count = 0;
				const filterName = name => {
					return lib.character[name][1] == player.identity && !get.is.double(name);
				};
				while (num < players.length) {
					let targetx = players[num];
					if ((targetx.isUnseen(0) && filterName(targetx.name1)) || (targetx.isUnseen(1) && filterName(targetx.name2))) {
						let list = [];
						const bool1 = targetx.isUnseen(0) && filterName(targetx.name1),
							bool2 = targetx.isUnseen(1) && filterName(targetx.name2);
						if (bool1) {
							list.push("明置主将");
						}
						if (bool2) {
							list.push("明置副将");
						}
						if (bool1 && bool2) {
							list.push("全部明置");
						}
						list.push("cancel2");
						const result2 = await targetx
							.chooseControl(list)
							.set("prompt", `是否响应${get.translation(player)}的号召？`)
							.set("prompt2", `明置任意张武将牌并对${get.translation(target)}造成等量伤害`)
							.set("ai", () => {
								if (get.event("eff") > 0) {
									return list.filter(i => i != "cancel2").randomGet();
								}
								return "cancel2";
							})
							.set("eff", get.damageEffect(target, targetx, targetx))
							.forResult();
						if (result2.control != "cancel2") {
							count++;
							const map = {
								明置主将: 0,
								明置副将: 1,
								全部明置: 2,
							};
							await targetx.showCharacter(map[result2.control]);
							targetx.line(target, "green");
							const numx = map[result2.control] == 2 ? 2 : 1;
							await target.damage(targetx, numx);
						}
					} else {
						await targetx
							.chooseControl("ok")
							.set("prompt", `${get.translation(player)}正在尝试召集他的小伙伴`)
							.set("prompt2", "没什么，只是想让你知道");
					}
					num++;
				}
				if (!count) {
					player.chat("欺我军无人乎？");
				}
			}
		},
		ai: {
			order: 7,
			result: {
				target(player, target) {
					const targets = game.filterPlayer(current => current != target && current.isUnseen());
					if (Math.random() * 7 < targets.length) {
						return get.damageEffect(target, player, target);
					}
					return get.effect(target, { name: "shunshou" }, player, target);
				},
			},
		},
	},
	gz_gongzhi: {
		trigger: {
			player: "phaseDrawBefore",
		},
		async content(event, trigger, player) {
			trigger.cancel();
			let num = 0,
				target = player;
			while (num < 4) {
				await target.draw();
				num++;
				target = target.getNext();
				while (!player.isFriendOf(target)) {
					target = target.getNext();
				}
			}
		},
	},
	gz_sheju: {
		trigger: {
			global: "showCharacterEnd",
		},
		filter(event, player) {
			return event.player != player && event.player.isFriendOf(player) && player.isDamaged();
		},
		forced: true,
		async content(event, trigger, player) {
			await player.recover();
			const cards = player.getDiscardableCards(player, "h");
			if (cards.length) {
				await player.discard(cards);
			}
		},
	},
	gz_zhulan: {
		trigger: {
			global: "damageBegin3",
		},
		filter(event, player) {
			return event.player != player && event.source?.isFriendOf(event.player) && player.countCards("he");
		},
		preHidden: true,
		async cost(event, trigger, player) {
			event.result = await player
				.chooseToDiscard("he", get.prompt2(event.skill, trigger.player))
				.set("ai", card => {
					if (get.event("eff") > 0) {
						return 0;
					}
					return 7 - get.value(card);
				})
				.set("eff", get.attitude(player, trigger.player))
				.set("chooseonly", true)
				.setHiddenSkill(event.skill)
				.forResult();
			event.result.targets = [trigger.player];
		},
		async content(event, trigger, player) {
			await player.discard(event.cards);
			trigger.num++;
		},
	},
	gz_luanchang: {
		trigger: {
			global: "phaseEnd",
		},
		limited: true,
		skillAnimation: true,
		animationColor: "thunder",
		filter(event, player) {
			const card = new lib.element.VCard({ name: "wanjian" }, event.player.getCards("h"));
			return (
				event.player.countCards("h") &&
				event.player.hasUseTarget(card) &&
				game.hasPlayer2(current => {
					if (!player.isFriendOf(current)) {
						return false;
					}
					return current.getHistory("damage").length;
				})
			);
		},
		logTarget: "player",
		check(event, player) {
			const card = new lib.element.VCard({ name: "wanjian" }, event.player.getCards("h"));
			let eff = event.player.countCards("h");
			game.filterPlayer(current => {
				if (event.player.canUse(card, current)) {
					eff += get.effect(current, card, event.player, player);
				}
			});
			return eff > 0;
		},
		async content(event, trigger, player) {
			player.awakenSkill(event.name);
			const card = new lib.element.VCard({ name: "wanjian" }, trigger.player.getCards("h"));
			await trigger.player.chooseUseTarget(card, trigger.player.getCards("h"), true);
		},
	},
	gz_zhuosheng: {
		audio: "zhuosheng",
		trigger: {
			player: "gainAfter",
		},
		frequent: true,
		filter(event, player) {
			return event.getg(player)?.length && !player.hasSkill("gz_zhuosheng_up");
		},
		async content(event, trigger, player) {
			player.addTempSkill("gz_zhuosheng_up");
		},
		subSkill: {
			up: {
				audio: "gz_zhuosheng",
				charlotte: true,
				mark: true,
				intro: {
					content: "本回合使用的下一张牌伤害+1",
				},
				trigger: {
					player: "useCard1",
				},
				firstDo: true,
				forced: true,
				locked: false,
				async content(event, trigger, player) {
					if (get.tag(trigger.card, "damage")) {
						if (typeof trigger.baseDamage != "number") {
							trigger.baseDamage = 1;
						}
						trigger.baseDamage++;
					}
					player.removeSkill(event.name);
				},
				ai: {
					presha: true,
				},
			},
		},
	},
	gz_ciwei: {
		audio: "ciwei",
		trigger: {
			global: "useCard",
		},
		filter(event, player) {
			if (event.all_excluded || event.player == player || !player.countCards("he") || player != _status.currentPhase) {
				return false;
			}
			return game.hasPlayer(current => {
				if (current == player || current.isFriendOf(event.player)) {
					return false;
				}
				return current.getHistory("useCard").length || current.getHistory("respond").length;
			});
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseToDiscard(get.prompt2(event.skill, trigger.player), "he")
				.set("ai", card => {
					return _status.event.goon / 1.4 - get.value(card);
				})
				.set(
					"goon",
					(function () {
						if (!trigger.targets.length) {
							return -get.attitude(player, trigger.player);
						}
						var num = 0;
						for (var i of trigger.targets) {
							num -= get.effect(i, trigger.card, trigger.player, player);
						}
						return num;
					})()
				)
				.setHiddenSkill(event.skill)
				.set("logSkill", [event.skill, trigger.player])
				.forResult();
		},
		preHidden: true,
		popup: false,
		async content(event, trigger, player) {
			trigger.targets.length = 0;
			trigger.all_excluded = true;
		},
	},
	gz_caiyuan: {
		audio: "caiyuan",
		trigger: {
			player: ["phaseBeginStart", "damageEnd"],
		},
		forced: true,
		filter(event, player) {
			return !player.isUnseen(2);
		},
		async content(event, trigger, player) {
			if (trigger.name == "phase") {
				await player.draw(2);
			} else {
				if (!player.isUnseen(0) && get.character(player.name1, 3).includes("gz_caiyuan")) {
					await player.hideCharacter(0);
				}
				if (!player.isUnseen(1) && get.character(player.name2, 3).includes("gz_caiyuan")) {
					await player.hideCharacter(1);
				}
			}
		},
	},
	gz_yanxi: {
		audio: "yanxi",
		trigger: {
			player: "phaseZhunbeiBegin",
		},
		filter(event, player) {
			return game.hasPlayer(current => !player.isFriendOf(current) && current.countCards("h"));
		},
		preHidden: true,
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt2(event.skill), [1, 3], (card, player, target) => {
					return !player.isFriendOf(target) && target.countCards("h");
				})
				.set("ai", target => {
					const att = get.attitude(get.player(), target);
					return -att;
				})
				.setHiddenSkill(event.skill)
				.forResult();
		},
		async content(event, trigger, player) {
			const cards = [],
				targets = event.targets.sortBySeat();
			for (const target of targets) {
				const result = await player.choosePlayerCard(target, "h", true).forResult();
				if (result?.bool && result.cards?.length) {
					cards.addArray(result.cards);
				}
			}
			const names = [];
			for (const target of targets) {
				const prompt = `宴戏：声明一个牌名（你被选择的牌为${get.translation(cards[targets.indexOf(target)])}）`;
				const result = await target
					.chooseButton([prompt, [get.inpileVCardList(i => !i[3]), "vcard"]], true)
					.set("ai", button => {
						const { player, chosenCard: card } = get.event();
						if (Math.random() > 0.5 && button.link[2] == card.name) {
							return 24;
						}
						return player.countCards("h", button.link[2]);
					})
					.set("chosenCard", cards[targets.indexOf(target)])
					.forResult();
				if (result?.bool && result.links?.length) {
					names.push(result.links[0][2]);
					target.chat(get.translation(result.links[0][2]));
					game.log(target, "声明了", `#y${get.translation(result.links[0][2])}`);
				}
			}
			const result = await player
				.chooseTarget(
					"宴席：展示并获得一名角色被你选择的牌",
					(card, player, target) => {
						return get.event("targetx").includes(target);
					},
					true
				)
				.set("targetx", targets)
				.set("ai", target => Math.random())
				.forResult();
			if (result?.bool) {
				const target = result.targets[0],
					index = targets.indexOf(target),
					card = cards[index],
					name = names[index];
				await target.showCards([card]);
				await target.give(card, player, true);
				if (name != card.name) {
					await player.gain(
						cards.filter(cardx => cardx != card),
						"giveAuto"
					);
				}
			}
		},
	},
	gz_shiren: {
		audio: "shiren",
		trigger: {
			global: "damageEnd",
		},
		filter(event, player) {
			return event.player != player && event.player.isUnseen() && event.player.isIn() && player.countCards("he") > 1;
		},
		usable: 1,
		async cost(event, trigger, player) {
			event.result = await player
				.chooseCardTarget({
					filterCard: true,
					prompt: get.prompt2(event.skill, trigger.player),
					position: "he",
					selectCard: 2,
					filterTarget(card, player, target) {
						return target == get.event("targetx");
					},
					targetx: trigger.player,
					selectTarget: -1,
					ai1(card) {
						const { player, targetx: target } = get.event();
						if (get.attitude(player, target) <= 0) {
							return 0;
						}
						return 8 - get.value(card);
					},
					ai2() {
						return 1;
					},
				})
				.setHiddenSkill(event.skill)
				.forResult();
		},
		preHidden: true,
		async content(event, trigger, player) {
			await player.give(event.cards, event.targets[0]);
			await player.draw(2);
		},
	},
	gz_chengxi: {
		audio: 2,
		trigger: {
			player: "phaseZhunbeiBegin",
		},
		preHidden: true,
		filter(event, player) {
			const card = new lib.element.VCard({ name: "yiyi" });
			return game.hasPlayer(current => current.hasUseTarget(card));
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt2(event.skill), (cardx, player, target) => {
					const card = new lib.element.VCard({ name: "yiyi" });
					return target.hasUseTarget(card);
				})
				.set("ai", target => {
					const card = new lib.element.VCard({ name: "yiyi" });
					return get.attitude(get.player(), target) * target.getUseValue(card);
				})
				.setHiddenSkill(event.skill)
				.forResult();
		},
		async content(event, trigger, player) {
			const card = new lib.element.VCard({ name: "yiyi" }),
				target = event.targets[0];
			game.addGlobalSkill("gz_chengxi_ai");
			const { result } = await target.chooseUseTarget(card, true);
			game.removeGlobalSkill("gz_chengxi_ai");
			if (
				result?.targets?.length &&
				game.hasPlayer2(current => {
					return current.hasHistory("lose", evt => {
						return evt.getParent(6) == event && evt.cards2?.some(card => get.type(card) != "basic");
					});
				})
			) {
				target.line(result.targets, "green");
				for (const targetx of result.targets) {
					await targetx.damage(target);
				}
			}
		},
		subSkill: {
			ai: {
				mod: {
					aiValue(player, card, num) {
						if (get.type(card) != "basic" || card?.name == "tao") {
							return;
						}
						return 0.2;
					},
					aiUseful(player, card, num) {
						if (get.type(card) != "basic" || card?.name == "tao") {
							return;
						}
						return 0.2;
					},
				},
				locked: false,
			},
		},
	},
	gz_jiantong: {
		audio: 2,
		trigger: {
			player: "damageEnd",
		},
		preHidden: true,
		filter(event, player) {
			return game.hasPlayer(current => current.countCards("h"));
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt2(event.skill), (card, player, target) => {
					return target.countCards("h");
				})
				.set("ai", target => {
					return -get.attitude(get.player(), target) * target.countCards("h");
				})
				.setHiddenSkill(event.skill)
				.forResult();
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			if (player.countCards("e")) {
				const result = await player
					.chooseButton(["监统：是否用装备区一张牌交换至多两张牌？", `${get.translation(player)}的装备区`, player.getCards("e"), `${get.translation(target)}的手牌`, target.getCards("h")], [2, 3])
					.set("filterButton", button => {
						const cards = get.player().getCards("e");
						if (ui.selected.buttons.length) {
							return !cards.includes(button.link);
						}
						return cards.includes(button.link);
					})
					.set("complexSelect", true)
					.set("ai", button => {
						if (ui.selected.buttons.length) {
							return 6 - get.buttonValue(button);
						}
						return get.buttonValue(button);
					})
					.forResult();
				if (result?.bool) {
					const cards1 = result.links.slice(0, 1),
						cards2 = result.links.slice(1);
					await player.swapHandcards(target, cards1, cards2);
				}
			} else {
				await player.viewHandcards(target);
			}
		},
	},
	gz_chujue: {
		audio: "dcbeini",
		trigger: {
			player: "useCard",
		},
		filter(event, player) {
			return event.targets?.some(target => {
				return game.hasPlayer2(current => current.isDead() && current.isFriendOf(target));
			});
		},
		forced: true,
		async content(event, trigger, player) {
			const targets = [];
			trigger.targets.filter(target => {
				if (game.hasPlayer2(current => current.isDead() && current.isFriendOf(target))) {
					targets.addArray(game.filterPlayer(current => current.isFriendOf(target)));
				}
			});
			trigger.directHit.addArray(targets);
		},
		mod: {
			cardUsableTarget(card, player, target) {
				if (game.hasPlayer2(current => current.isDead() && current.isFriendOf(target))) {
					return Infinity;
				}
			},
		},
	},
	gz_jianzhi: {
		audio: "jianhui",
		trigger: {
			source: "damageBegin4",
		},
		filter(event, player) {
			return event.num >= event.player.hp && player.countDiscardableCards(player, "h");
		},
		check(event, player) {
			return player.countCards("h") <= 2;
		},
		preHidden: true,
		async content(event, trigger, player) {
			const cards = player.getDiscardableCards(player, "h");
			if (cards.length) {
				await player.discard(cards);
			}
			player.addTempSkill("gz_jianzhi_draw");
			player.addMark("gz_jianzhi_draw", 1, false);
		},
		subSkill: {
			draw: {
				onremove: true,
				charlotte: true,
				forceDie: true,
				trigger: {
					global: "drawBegin",
				},
				forced: true,
				direct: true,
				filter(event, player) {
					return event.getParent()?.name == "die";
				},
				async content(event, trigger, player) {
					let num = 0;
					while (num < player.countMark(event.name)) {
						trigger.num *= 3;
						num++;
					}
					player.removeSkill(event.name);
				},
			},
		},
	},
	gz_zhefu: {
		audio: "zhefu",
		trigger: {
			player: ["useCardAfter", "respondAfter"],
		},
		filter(event, player) {
			return (
				player != _status.currentPhase &&
				get.type(event.card) == "basic" &&
				game.hasPlayer(current => {
					const num1 = game.countPlayer(target => target.identity == current.identity),
						num2 = game.countPlayer(target => target.identity == player.identity);
					return num1 >= num2 && current.countCards("h");
				})
			);
		},
		preHidden: true,
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt2(event.skill), (card, player, target) => {
					const num = game.countPlayer(current => target.identity == current.identity),
						num2 = get.event("numx");
					return num >= num2 && target.countCards("h");
				})
				.set(
					"numx",
					game.countPlayer(target => target.identity == player.identity)
				)
				.set("ai", target => {
					const player = get.player();
					return get.effect(target, { name: "guohe_copy2" }, player, player);
				})
				.setHiddenSkill(event.skill)
				.forResult();
		},
		async content(event, trigger, player) {
			await player
				.discardPlayerCard(event.targets[0], "h", "visible")
				.set("filterButton", button => {
					return get.type(button.link) == "basic";
				})
				.forResult();
		},
	},
	gz_yidu: {
		audio: "yidu",
		trigger: {
			player: "useCardAfter",
		},
		filter(event, player) {
			return (
				get.tag(event.card, "damage") > 0.5 &&
				event.targets.some(target => {
					return target.countCards("h") > 0 && !target.hasHistory("damage", evt => evt.card == event.card);
				})
			);
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt2(event.skill), (card, player, target) => {
					return get.event().targets.includes(target);
				})
				.set(
					"targets",
					trigger.targets.filter(target => {
						return target.countCards("h") > 0 && !target.hasHistory("damage", evt => evt.card == trigger.card);
					})
				)
				.set("ai", target => {
					const player = get.player();
					if (target.hasSkillTag("noh")) {
						return 0;
					}
					return -get.attitude(player, target);
				})
				.setHiddenSkill(event.skill)
				.forResult();
		},
		preHidden: true,
		async content(event, trigger, player) {
			const {
				targets: [target],
			} = event;
			if (!target.countCards("h")) {
				return;
			}
			const cards = await player
				.choosePlayerCard(target, "遗毒：展示" + get.translation(target) + "的至多两张手牌", true, "h", [1, Math.min(2, target.countCards("h"))])
				.set("forceAuto", true)
				.set("ai", button => {
					if (ui.selected.buttons.length) {
						return 0;
					}
					return 1 + Math.random();
				})
				.forResultCards();
			if (!cards?.length) {
				return;
			}
			await player.showCards(cards, get.translation(player) + "对" + get.translation(target) + "发动了【遗毒】");
			const color = get.color(cards[0], target);
			if (cards.every(card => get.color(card, target) == color)) {
				await target.discard(cards, "notBySelf").set("discarder", player);
			}
		},
	},
	gz_chengliu: {
		audio: "jsrgchengliu",
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return game.hasPlayer(current => {
				return current.countCards("e") < player.countCards("e");
			});
		},
		filterTarget(card, player, target) {
			return target.countCards("e") < player.countCards("e");
		},
		async content(event, trigger, player) {
			let target = event.target;
			while (true) {
				await target.damage();
				if (!target.isIn()) {
					return;
				}
				const result = await player
					.chooseBool(`是否与${get.translation(target)}交换装备区里的牌并重复此流程？`)
					.set("choice", false)
					.forResult();
				if (result.bool) {
					await player.swapEquip(target);
					if (
						!game.hasPlayer(current => {
							return current.countCards("e") < player.countCards("e");
						})
					) {
						break;
					}
					const result2 = await player
						.chooseTarget("乘流：对一名装备区牌数少于你的角色造成1点伤害", (card, player, target) => {
							return target.countCards("e") < player.countCards("e");
						})
						.forResult();
					if (result2.bool) {
						target = result2.targets[0];
						player.line(target, "green");
					} else {
						break;
					}
				} else {
					break;
				}
			}
		},
		ai: {
			order: 7,
			result: {
				target: -2,
			},
		},
	},
	gz_zhuanzhan: {
		locked: true,
		mod: {
			targetInRange(card, player) {
				if (game.hasPlayer(current => current.isUnseen()) && card.name == "sha") {
					return true;
				}
			},
			playerEnabled(card, player, target) {
				if (game.hasPlayer(current => current.isUnseen()) && card.name == "sha" && target.isUnseen()) {
					return false;
				}
			},
		},
	},
	gz_xunji: {
		audio: "jsrgxunji",
		trigger: {
			player: ["useCard1", "useCardAfter"],
		},
		forced: true,
		locked: false,
		filter(event, player, name) {
			if (event.card.name != "sha") {
				return false;
			}
			if (name == "useCardAfter") {
				return (
					event.targets?.every(target => {
						return target.hasHistory("damage", evt => evt.card == event.card);
					}) && event.addCount !== false
				);
			}
			let card = event.card;
			let range;
			let select = get.copy(get.info(card).selectTarget);
			if (select == undefined) {
				if (get.info(card).filterTarget == undefined) {
					return false;
				}
				range = [1, 1];
			} else if (typeof select == "number") {
				range = [select, select];
			} else if (get.itemtype(select) == "select") {
				range = select;
			} else if (typeof select == "function") {
				range = select(card, player);
			}
			player._checkXunji = true;
			game.checkMod(card, player, range, "selectTarget", player);
			delete player._checkXunji;
			return range[1] != -1 && event.targets.length > range[1];
		},
		async content(event, trigger, player) {
			if (event.triggername == "useCardAfter") {
				trigger.addCount = false;
				let stat = player.getStat().card,
					name = trigger.card.name;
				if (typeof stat[name] == "number") {
					stat[name]--;
				}
			}
		},
		mod: {
			selectTarget(card, player, range) {
				if (card.name != "sha" || range[1] == -1 || player._checkXunji) {
					return;
				}
				range[1] += 2;
			},
		},
	},

	//受命于天
	gz_sanchen: {
		audio: "sanchen",
		enable: "phaseUse",
		filter(event, player) {
			let stat = player.getStat("spsanchen");
			return (
				game.hasPlayer(function (current) {
					return !stat || !stat.includes(current);
				}) && !player.isUnseen(2)
			);
		},
		filterTarget(card, player, target) {
			let stat = player.getStat("spsanchen");
			return !stat || !stat.includes(target);
		},
		async content(event, trigger, player) {
			const target = event.target;
			let stat = player.getStat();
			if (!stat.spsanchen) {
				stat.spsanchen = [];
			}
			stat.spsanchen.push(target);
			await target.draw(3);

			if (!target.countCards("he")) {
				return;
			} else {
				const result = await target
					.chooseToDiscard("he", true, 3)
					.set("ai", card => {
						let list = ui.selected.cards.map(function (i) {
							return get.type2(i);
						});
						if (!list.includes(get.type2(card))) {
							return 7 - get.value(card);
						}
						return -get.value(card);
					})
					.forResult();
				if (result?.bool && result?.cards?.length) {
					let list = [];
					for (let i of result.cards) {
						list.add(get.type2(i));
					}
					if (list.length < result.cards.length) {
						if (get.character(player.name1, 3).includes("gz_sanchen")) {
							player.hideCharacter(0);
						}
						if (get.character(player.name2, 3).includes("gz_sanchen")) {
							player.hideCharacter(1);
						}
					}
				}
			}
		},
		ai: {
			order: 9,
			threaten: 1.7,
			result: {
				target(player, target) {
					if (target.hasSkillTag("nogain")) {
						return 0.1;
					}
					return Math.sqrt(target.countCards("he"));
				},
			},
		},
	},
	gz_pozhu: {
		mainSkill: true,
		init(player) {
			if (player.checkMainSkill("gz_pozhu")) {
				player.removeMaxHp();
			}
		},
		audio: "pozhu",
		trigger: {
			player: "phaseZhunbeiBegin",
		},
		direct: true,
		preHidden: true,
		filter(event, player) {
			return player.countCards("hes");
		},
		async content(event, trigger, player) {
			while (true) {
				const next = player.chooseToUse();
				next.set("openskilldialog", `###${get.prompt(event.name)}###是否将一张牌当作【杀】使用？`);
				next.set("norestore", true);
				next.set("_backupevent", "gz_pozhu_backup");
				next.set("custom", {
					add: {},
					replace: { window() { } },
				});
				next.backup("gz_pozhu_backup");
				next.set("targetRequired", true);
				next.set("complexSelect", true);
				next.set("addCount", false);
				const result = await next.forResult();
				if (result.bool && result?.targets?.length == 1) {
					const target = result.targets[0];
					if (!target.isIn() || !target.countCards("h")) {
						break;
					}
					const result2 = await player.choosePlayerCard(target, "h", true).forResult();
					if (result2.bool && result2.cards?.length) {
						await player.showCards(result2.cards);
						const card = result2.cards[0];
						if (get.suit(card, target) == get.suit(result.card)) {
							break;
						}
					}
				} else {
					break;
				}
			}
		},
		subSkill: {
			backup: {
				audio: "gz_pozhu",
				filterCard(card, player) {
					return get.itemtype(card) === "card";
				},
				viewAs: {
					name: "sha",
				},
				position: "hes",
				ai1(card) {
					return 8 - get.value(card);
				},
			},
		},
	},
	gz_huaiyuan: {
		audio: "huaiyuan",
		trigger: {
			global: "phaseZhunbeiBegin",
		},
		filter(event, player) {
			return event.player.isFriendOf(player);
		},
		async cost(event, trigger, player) {
			const result = await player
				.chooseControl("攻击范围", "手牌上限", "出杀次数", "cancel2")
				.set("prompt", get.prompt(event.skill, trigger.player))
				.set("prompt2", "令其本回合一项数值+1")
				.set("ai", () => {
					return [1, 2].randomGet();
				})
				.forResult();
			event.result = {
				bool: result.index != 3,
				targets: [trigger.player],
				cost_data: result.index,
			};
		},
		async content(event, trigger, player) {
			const {
				targets: [target],
				cost_data: index,
			} = event;
			const result = ["range", "limit", "useCard"][index];
			target.addTempSkill(`${event.name}_${result}`);
			target.addMark(`${event.name}_${result}`, 1, false);
		},
		subSkill: {
			range: {
				charlotte: true,
				onremove: true,
				marktext: "怀",
				intro: {
					content: "攻击范围+#",
				},
				mod: {
					attackRange(player, num) {
						return num + player.countMark("gz_huaiyuan_range");
					},
				},
			},
			limit: {
				charlotte: true,
				onremove: true,
				marktext: "远",
				intro: {
					content: "手牌上限+#",
				},
				mod: {
					maxHandcard(player, num) {
						return num + player.countMark("gz_huaiyuan_limit");
					},
				},
			},
			useCard: {
				charlotte: true,
				onremove: true,
				marktext: "戍",
				intro: {
					content: "出杀次数+#",
				},
				mod: {
					cardUsable(card, player, num) {
						if (card.name == "sha") {
							return num + player.countMark("gz_huaiyuan_useCard");
						}
					},
				},
			},
		},
	},
	gz_fushou: {
		audio: "dezhang",
		trigger: {
			player: "hideCharacterBegin",
			global: "showCharacterEnd",
		},
		filter(event, player) {
			const targets = get.info("gz_fushou")?.logTarget(event, player);
			if (!targets?.length) {
				return false;
			}
			const evt = event.getParent("showCharacter", true);
			if (evt?.player && !targets.some(target => target != evt.player)) {
				return false;
			}
			if (
				event.name == "hideCharacter" &&
				game.hasPlayer(current => {
					return current != player && current.hasSkill("gz_fushou");
				})
			) {
				return false;
			}
			return true;
		},
		onremove(player) {
			const filter = get.info("gz_fushou")?.filterCheck;
			const targets = game.filterPlayer(current => current.isFriendOf(player) && filter(current).length);
			if (
				!game.hasPlayer(current => {
					return current != player && current.hasSkill("gz_fushou");
				}) &&
				targets.length
			) {
				for (let target of targets) {
					const skills = [];
					if (!target.isUnseen(0)) {
						skills.addArray(
							get.character(target.name1, 3)?.filter(skill => {
								const info = get.info(skill);
								return info?.viceSkill;
							})
						);
					}
					if (!target.isUnseen(1)) {
						skills.addArray(
							get.character(target.name2, 3)?.filter(skill => {
								const info = get.info(skill);
								return info?.mainSkill;
							})
						);
					}
					if (skills.length) {
						for (const skill of skills) {
							target.awakenSkill(skill);
						}
						player.line(target, "green");
						game.log(target, "失去了", skills.map(i => `#g【${get.translation(i)}】`).join(""));
					}
				}
			}
		},
		preHidden: true,
		forced: true,
		filterCheck(current, name) {
			let skills = [];
			if (name !== undefined) {
				if (!Array.isArray(name)) {
					name = [name];
				}
				skills.addArray(
					name.reduce(
						(arr, namex) =>
							get.character(namex, 3)?.filter(skill => {
								const info = get.info(skill);
								const bool = name == current.name1;
								return info?.[bool ? "viceSkill" : "mainSkill"];
							}),
						[]
					)
				);
			} else if (get.itemtype(current) == "player") {
				if (!current.isUnseen(0)) {
					skills.addArray(
						get.character(current.name1, 3)?.filter(skill => {
							const info = get.info(skill);
							return info?.viceSkill;
						})
					);
				}
				if (!current.isUnseen(1)) {
					skills.addArray(
						get.character(current.name2, 3)?.filter(skill => {
							const info = get.info(skill);
							return info?.mainSkill;
						})
					);
				}
			}
			return skills;
		},
		logTarget(event, player) {
			const filter = get.info("gz_fushou")?.filterCheck;
			let names = event[event.name == "hideCharacter" ? "toHide" : "toShow"];
			if (!Array.isArray(names)) {
				names = [names];
			}
			const skills = names.reduce((arr, name) => arr.addArray(get.character(name, 3)), []);
			if (event.name == "showCharacter" && !skills.includes("gz_fushou")) {
				if (event.player.isFriendOf(player) && filter(event.player, event.toShow).length) {
					return [event.player];
				}
				return [];
			}
			if (skills.includes("gz_fushou")) {
				return game.filterPlayer(current => current.isFriendOf(player) && filter(current).length);
			}
			return [];
		},
		async content(event, trigger, player) {
			let names = trigger[trigger.name == "hideCharacter" ? "toHide" : "toShow"];
			if (!Array.isArray(names)) {
				names = [names];
			}
			const skillsx = names.reduce((arr, name) => arr.addArray(get.character(name, 3)), []);
			if (trigger.name == "showCharacter" && !skillsx.includes("gz_fushou")) {
				const skills = skillsx?.filter(skill => {
					const info = get.info(skill);
					return info?.[trigger.toShow == trigger.player.name1 ? "viceSkill" : "mainSkill"];
				});
				if (skills.length) {
					for (const skill of skills) {
						trigger.player.restoreSkill(skill);
					}
					game.log(trigger.player, "拥有了", skills.map(i => `#g【${get.translation(i)}】`).join(""));
				}
			} else {
				for (const target of event.targets) {
					const skills = [];
					if (!target.isUnseen(0)) {
						skills.addArray(
							get.character(target.name1, 3)?.filter(skill => {
								const info = get.info(skill);
								return info?.viceSkill;
							})
						);
					}
					if (!target.isUnseen(1)) {
						skills.addArray(
							get.character(target.name2, 3)?.filter(skill => {
								const info = get.info(skill);
								return info?.mainSkill;
							})
						);
					}
					if (skills.length) {
						for (const skill of skills) {
							target[trigger.name == "hideCharacter" ? "awakenSkill" : "restoreSkill"](skill);
						}
						const str = trigger.name == "hideCharacter" ? "失去了" : "拥有了";
						game.log(target, str, skills.map(i => `#g【${get.translation(i)}】`).join(""));
					}
				}
			}
		},
		global: "gz_fushou_global",
		subSkill: {
			global: {
				ai: {
					alwaysViceSkill: true,
					alwaysMainSkill: true,
					skillTagFilter(player, tag, arg) {
						if (!game.hasPlayer(current => current.isFriendOf(player) && current.hasSkill("gz_fushou"))) {
							return false;
						}
					}
				},
			},
		},
	},
	gz_xijue: {
		audio: "xijue",
		trigger: {
			global: "phaseJieshuBegin",
		},
		preHidden: true,
		filter(event, player) {
			return (
				event.player != player &&
				player.countCards("he") > 1 &&
				player.countCards("he", card => {
					return get.type(card) == "basic";
				})
			);
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseToDiscard(get.prompt("gz_xijue", trigger.player), "弃置一张牌并对其发动【骁果】", "he")
				.set("ai", card => {
					const player = get.player(),
						target = get.event().getTrigger().player;
					if (get.damageEffect(target, player, player) > 2) {
						if (get.type(card) == "basic") {
							return 4 - get.value(card);
						}
						return 8 - get.value(card);
					}
					return 0;
				})
				.set("chooseonly", true)
				.setHiddenSkill(event.skill)
				.forResult();
			event.result.targets = [trigger.player];
		},
		async content(event, trigger, player) {
			await player.discard(event.cards);
			const result = await player
				.chooseToDiscard(get.prompt2("gz_xijue_xiaoguo", trigger.player), "he", { type: "basic" })
				.set("logSkill", ["gz_xijue_xiaoguo", trigger.player])
				.set("ai", card => 9 - get.value(card))
				.forResult();
			if (result.bool) {
				let nono = get.damageEffect(trigger.player, player, trigger.player) >= 0;
				const result2 = await trigger.player
					.chooseToDiscard("弃置一张装备牌，或受到1点伤害", "he", { type: "equip" })
					.set("ai", function (card) {
						if (_status.event.nono) {
							return 0;
						}
						if (_status.event.player.hp == 1) {
							return 10 - get.value(card);
						}
						return 9 - get.value(card);
					})
					.set("nono", nono)
					.forResult();
				if (!result2?.bool) {
					await trigger.player.damage();
				}
			}
		},
		derivation: ["gz_xijue_tuxi", "gz_xijue_xiaoguo"],
		group: "gz_xijue_tuxi",
		subSkill: {
			tuxi: {
				audio: "xijue_tuxi",
				trigger: {
					player: "phaseDrawBegin2",
				},
				preHidden: true,
				filter(event, player) {
					return (
						event.num > 0 &&
						!event.numFixed &&
						game.hasPlayer(target => {
							return target.countCards("h") > 0 && player != target;
						}) &&
						player.countCards("he")
					);
				},
				async cost(event, trigger, player) {
					let num = get.copy(trigger.num);
					event.result = await player
						.chooseCardTarget({
							prompt: get.prompt(event.skill),
							prompt2: "弃置一张牌并获得至多" + get.translation(num) + "名角色的各一张手牌，然后少摸等量的牌",
							filterCard: true,
							position: "he",
							selectTarget: [1, num],
							filterTarget(card, player, target) {
								return target.countCards("h") > 0 && player != target;
							},
							ai1(card) {
								return 5 - get.value(card);
							},
							ai2(target) {
								const att = get.attitude(get.player(), target);
								if (target.hasSkill("tuntian")) {
									return att / 10;
								}
								return 1 - att;
							},
						})
						.setHiddenSkill("gz_xijue")
						.forResult();
					if (event.result.bool) {
						player.logSkill("gz_xijue");
					}
				},
				async content(event, trigger, player) {
					await player.discard(event.cards);
					event.targets.sortBySeat();
					await player.gainMultiple(event.targets);
					trigger.num -= event.targets.length;
					if (trigger.num <= 0) {
						await game.delay();
					}
				},
				ai: {
					threaten: 1.6,
					expose: 0.2,
				},
			},
			xiaoguo: {
				audio: "xijue_xiaoguo",
			},
		},
	},
	gz_lvxian: {
		mainSkill: true,
		init(player, skill) {
			player.checkMainSkill(skill);
		},
		trigger: {
			player: "damageEnd",
		},
		filter(event, player) {
			if (
				game
					.getGlobalHistory(
						"everything",
						evt => {
							return evt.name == "damage" && evt.player == player;
						},
						event
					)
					.indexOf(event) !== 0
			) {
				return false;
			}
			let num = _status.globalHistory.length;
			if (num < 2) {
				return false;
			}
			num -= 2;
			let history = player.actionHistory[num];
			while (history.isSkipped && num >= 0) {
				num--;
				history = player.actionHistory[num];
			}
			if (history.isMe) {
				return false;
			}
			return history?.lose?.some(evt => {
				return evt?.cards2?.length;
			});
		},
		preHidden: true,
		async content(event, trigger, player) {
			let num = _status.globalHistory.length - 2,
				history = player.actionHistory[num];
			while (history.isSkipped && num >= 0) {
				num--;
				history = player.actionHistory[num];
			}
			let numx = history.lose.reduce((sum, evt) => {
				return sum + (evt.cards2.length || 0);
			}, 0);
			if (numx > 0) {
				await player.draw(numx);
			}
		},
	},
	gz_yingwei: {
		viceSkill: true,
		init(player, skill) {
			player.checkViceSkill(skill);
		},
		trigger: {
			player: "phaseJieshuBegin",
		},
		filter(event, player) {
			const num1 = player
				.getHistory("gain", evt => evt.getParent()?.name == "draw")
				.reduce((num, evt) => {
					return num + evt?.cards?.length;
				}, 0),
				num2 = player.getHistory("sourceDamage").reduce((num, evt) => {
					return num + (evt?.num || 0);
				}, 0);
			return num1 == num2 && player.countCards("he");
		},
		preHidden: true,
		async cost(event, trigger, player) {
			event.result = await player
				.chooseCard(get.prompt2(event.skill), [1, 2], "he")
				.set("filterCard", (card, player) => {
					return lib.filter.cardRecastable(card, player);
				})
				.set("ai", card => {
					return 5 - get.value(card);
				})
				.setHiddenSkill(event.skill)
				.forResult();
		},
		async content(event, trigger, player) {
			await player.recast(event.cards);
		},
	},
	gz_jiaping: {
		audio: 2,
		unique: true,
		forceunique: true,
		derivation: ["bahuangsishiling", "gz_shunfu", "luanwu", "jianglue", "yongjin", "gz_fengying"],
		lordSkill: true,
		global: ["bahuangsishiling", "gz_jiaping_use"],
		init(player) {
			player.markSkill("bahuangsishiling");
		},
		subSkill: {
			use: {
				audio: "gz_jiaping",
				enable: "phaseUse",
				filter(event, player) {
					const target = game.findPlayer(current => {
						return current.hasSkill("gz_jiaping");
					});
					if (target && target.hasSkill("gz_jiaping_round")) {
						return false;
					}
					let list = ["gz_shunfu", "luanwu", "jianglue", "yongjin", "gz_fengying"].filter(i => {
						if (_status.jiapingUsed?.includes(i)) {
							return false;
						}
						const info = get.info(i);
						if (info?.filter) {
							return info.filter(event, player);
						}
						return true;
					});
					return event.jiapingCanUse && player.identity == "jin" && list.length;
				},
				onChooseToUse(event) {
					if (game.online) {
						return;
					}
					const player = event.player,
						history = _status.globalHistory;
					for (let i = history.length - 1; i >= 0; i--) {
						const evts = history[i]?.everything;
						if (evts.some(evt => evt.name == "showCharacter" && evt.player == player)) {
							event.set("jiapingCanUse", true);
						}
						if (history[i].isRound) {
							break;
						}
					}
				},
				chooseButton: {
					dialog(event, player) {
						let list = [
							["gz_shunfu", "gz_new_jin_simayi"],
							["luanwu", "gz_jiaxu"],
							["jianglue", "gz_wangping"],
							["yongjin", "gz_lingtong"],
							["gz_fengying", "gz_cuimao"],
						].filter(i => {
							return !_status.jiapingUsed || !_status.jiapingUsed.includes(i[0]);
						});
						return ui.create.dialog("嘉平", [list, "skill"]);
					},
					check(button) {
						const info = get.info(button.link);
						return info?.ai?.result?.player?.(get.player()) || 0;
					},
					filter(button) {
						const info = get.info(button.link);
						if (info?.filter) {
							return info.filter(get.event().getParent(), get.player());
						}
						return true;
					},
					backup(links, player) {
						const info = get.copy(get.info(links[0]));
						game.broadcastAll(
							(skill, name, info) => {
								lib.translate[skill] = get.translation(name);
								if (!_status.jiapingUsed) {
									_status.jiapingUsed = [];
								}
								info.precontent = async (event, trigger, player) => {
									player.logSkill("bahuangsishiling");
									game.broadcastAll(list => {
										_status.jiapingUsed = list;
									}, _status.jiapingUsed.concat(links));
									const target = game.findPlayer(current => {
										return current.hasSkill("gz_jiaping");
									});
									if (target) {
										target.addTempSkill("gz_jiaping_round", { global: ["roundStart", "roundEnd"] });
									}
									if (player.hasViceCharacter()) {
										await player.removeCharacter(1);
									}
								};
							},
							"gz_jiaping_use_backup",
							links[0],
							info
						);
						return info;
					},
					prompt(links, player) {
						return get.prompt2(links[0]);
					},
				},
				ai: {
					order: 8,
					result: {
						player: 1,
					},
				},
			},
			round: {
				charlotte: true,
			},
		},
	},
	bahuangsishiling: {
		audio: 2,
		nopop: true,
		unique: true,
		forceunique: true,
		mark: true,
		intro: {
			content() {
				let str = "每轮共计限一次，本轮明置过武将牌的晋势力角色可以于对应时机移除副将并发动一个未以此法发动过的技能：",
					skills = ["gz_shunfu", "luanwu", "jianglue", "yongjin", "gz_fengying"],
					groups = ["jin", "qun", "shu", "wu", "wei"];
				for (let i = 0; i < skills.length; i++) {
					let skill = skills[i],
						group = groups[i],
						border = get.groupnature(group, "raw"),
						name = `<span data-nature="${border}">〖${get.translation(skill)}〗</span>`;
					if (_status.jiapingUsed?.includes(skill)) {
						name = `<span style="text-decoration:line-through;">${name}</span>`;
					}
					str += name;
				}
				return str;
			},
		},
	},
	gz_shunfu: {
		skillAnimation: true,
		animationColor: "thunder",
		unique: true,
		enable: "phaseUse",
		audio: "xiongzhi",
		limited: true,
		selectTarget: [1, 3],
		filterTarget(card, player, target) {
			return player != target && target.isUnseen();
		},
		multitarget: true,
		multiline: true,
		async content(event, trigger, player) {
			event.targets.sortBySeat(_status.currentPhase);
			player.awakenSkill(event.name);
			await game.asyncDraw(event.targets, 2);
			for (const target of event.targets) {
				await target
					.chooseToUse(function (card, player, event) {
						if (get.name(card) != "sha") {
							return false;
						}
						return lib.filter.filterCard.apply(this, arguments);
					}, "瞬覆：是否使用一张不可被响应的【杀】？")
					.set("oncard", card => {
						_status.event.directHit.addArray(game.players);
					})
					.set("filterTarget", function (card, player, target) {
						return lib.filter.targetEnabled.apply(this, arguments);
					});
			}
		},
		ai: {
			order: 1,
			result: {
				target: 1,
			},
		},
	},
	gz_guikuang: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		filterTarget(card, player, target) {
			if (ui.selected.targets.length) {
				const source = ui.selected.targets[0];
				return !source.isFriendOf(target) && source.canCompare(target);
			}
			return target.countCards("h");
		},
		selectTarget: 2,
		complexTarget: true,
		multitarget: true,
		async content(event, trigger, player) {
			const {
				targets: [target1, target2],
			} = event;
			const result = await target1.chooseToCompare(target2).forResult();
			let bool1 = target1 != result.winner,
				bool2 = target2 != result.winner;
			if (result.player && get.color(result.player) == "red") {
				if (bool1) {
					await target1.damage(target1);
				}
				if (bool2) {
					target1.line(target2, "green");
					await target2.damage(target1);
				}
			}
			if (result.target && get.color(result.target) == "red") {
				if (bool1) {
					target2.line(target1, "green");
					await target1.damage(target2);
				}
				if (bool2) {
					await target2.damage(target2);
				}
			}
		},
		ai: {
			order: 6,
			result: {
				target: -1,
			},
		},
	},
	gz_shujuan: {
		audio: 2,
		derivation: "jilinqianyi",
		unique: true,
		forceunique: true,
		ai: {
			threaten: 2,
		},
		trigger: {
			global: ["loseAfter", "cardsDiscardAfter", "equipAfter", "loseAsyncAfter"],
		},
		forced: true,
		filter(event, player) {
			const history = _status.globalHistory[_status.globalHistory.length - 1];
			if (event.name == "equip" && event.card.name == "jilinqianyi") {
				if (player == event.player) {
					return false;
				}
				if (
					history?.everything
						?.filter(evt => {
							return evt.name == "equip" && evt.card.name == "jilinqianyi" && evt.player != player;
						})
						.indexOf(event) != 0
				) {
					return false;
				}
				return event.player.getVCards("e").includes(event.card);
			}
			let entered = false;
			game.getGlobalHistory("cardMove", function (evt) {
				if (evt.name != "lose" && evt.name != "cardsDiscard") {
					return false;
				}
				if (evt.name == "lose" && evt.position != ui.discardPile) {
					return false;
				}
				if (evt == event || evt.getParent() == event) {
					return false;
				}
				if (evt.cards?.some(card => card.name == "jilinqianyi")) {
					entered = true;
				}
			});
			return !entered && event.getd().some(card => card.name == "jilinqianyi" && get.position(card) == "d");
		},
		logTarget(event, player) {
			if (event.name == "equip" && event.card.name == "jilinqianyi" && event.player.getVCards("e").includes(event.card)) {
				return event.player;
			}
			return [];
		},
		async content(event, trigger, player) {
			await game.delayx();
			let cards = [];
			if (trigger.name == "equip") {
				if (trigger.card.name == "jilinqianyi" && trigger.player.getVCards("e").includes(trigger.card)) {
					cards.addArray(trigger.player.getCards("e", { name: "jilinqianyi" }));
				}
			}
			cards.addArray(trigger.getd().filter(card => card.name == "jilinqianyi" && get.position(card) == "d"));
			let owner = get.owner(cards[0]);
			if (owner) {
				await player.gain(cards, "give", owner, "bySelf");
			} else {
				await player.gain(cards, "gain2");
			}
			for (let card of cards) {
				if (get.position(card) == "h") {
					await player.equip(card);
				}
			}
		},
	},
	gz_duanqiu: {
		audio: "jsrgfuzhen",
		trigger: {
			player: "phaseZhunbeiBegin",
		},
		preHidden: true,
		filter(event, player) {
			const card = new lib.element.VCard({ name: "juedou" });
			return game.hasPlayer(current => {
				if (current.isUnseen()) {
					return false;
				}
				return player.isEnemyOf(current) && player.canUse(card, current) && player != current;
			});
		},
		async cost(event, trigger, player) {
			const result = await player
				.chooseTarget(get.prompt2(event.skill), (cardx, player, target) => {
					if (target.isUnseen()) {
						return false;
					}
					const card = new lib.element.VCard({ name: "juedou" });
					return player.isEnemyOf(target) && player.canUse(card, target) && target != player;
				})
				.set("ai", target => {
					const card = new lib.element.VCard({ name: "juedou" });
					let eff = 0,
						limit = player.getHandcardLimit();
					for (let current of game.filterPlayer(i => target.isFriendOf(i))) {
						if (player.canUse(card, current)) {
							limit++;
							eff += get.effect(current, card, player, player);
						}
					}
					if (player.countCards("h") > limit) {
						eff -= 2 * (player.countCards("h") - limit);
					}
					return eff;
				})
				.setHiddenSkill(event.skill)
				.forResult();
			if (result.bool) {
				event.result = {
					bool: true,
					targets: game.filterPlayer(i => result.targets[0].isFriendOf(i) && i != player),
				};
			}
		},
		async content(event, trigger, player) {
			const card = new lib.element.VCard({ name: "juedou" }),
				targets = event.targets.filter(target => player.canUse(card, target));
			await player.useCard(card, targets);
			if (!player.isIn()) {
				return;
			}
			let num = 0;
			game.filterPlayer(current => {
				current.checkHistory("respond", evt => {
					if (evt.getParent(4) == event) {
						num++;
					}
				});
			});
			player.addTempSkill("gz_duanqiu_count");
			if (num > 0) {
				player.addMark("gz_duanqiu_count", num, 0);
			}
		},
		global: "gz_duanqiu_zhixi",
		subSkill: {
			count: {
				charlotte: true,
				init(player, skill) {
					player.storage[skill] = 0;
				},
				onremove: true,
				mark: true,
				intro: {
					content: "本回合所有角色合计还可使用#张手牌",
				},
				trigger: {
					global: "useCard",
				},
				firstDo: true,
				filter(event, player) {
					return event.player.hasHistory("lose", evt => {
						return evt.hs.length > 0 && (evt.relatedEvent || evt.getParent()) == event;
					});
				},
				direct: true,
				async content(event, trigger, player) {
					player.removeMark(event.name, 1, false);
				},
				ai: {
					presha: true,
					pretao: true,
				},
			},
			zhixi: {
				mod: {
					cardEnabled(card) {
						if (get.position(card) != "h" || !_status.currentPhase) {
							return;
						}
						const target = _status.currentPhase;
						if (target.hasSkill("gz_duanqiu_count") && !target.hasMark("gz_duanqiu_count")) {
							return false;
						}
					},
					cardSavable(card) {
						if (get.position(card) != "h" || !_status.currentPhase) {
							return;
						}
						const target = _status.currentPhase;
						if (target.hasSkill("gz_duanqiu_count") && !target.hasMark("gz_duanqiu_count")) {
							return false;
						}
					},
				},
			},
		},
	},
	gz_xiace: {
		audio: "dcxiace",
		enable: "chooseToUse",
		filterCard: true,
		viewAsFilter(player) {
			if (!_status.currentPhase || !player.countCards("hes")) {
				return false;
			}
			const target = _status.currentPhase,
				num = target.getCardUsable("sha", true);
			if (num <= 0) {
				return false;
			}
			const event = get.event().getParent("phaseUse", true, true);
			if (event) {
				return (
					num >
					target.getHistory("useCard", evt => {
						return evt.getParent("phaseUse") == event && evt.card.name == "sha" && evt.addCount !== false;
					}).length
				);
			}
			return true;
		},
		viewAs: {
			name: "wuxie",
		},
		async precontent(event, trigger, player) {
			const target = _status.currentPhase;
			if (target) {
				target.addTempSkill("gz_xiace_limit");
				target.addMark("gz_xiace_limit", 1, false);
			}
		},
		position: "hes",
		prompt: "将一张牌当【无懈可击】使用",
		check(card) {
			const tri = _status.event.getTrigger();
			if (tri && tri.card && tri.card.name == "chiling") {
				return -1;
			}
			return 8 - get.value(card);
		},
		group: "gz_xiace_change",
		subSkill: {
			change: {
				trigger: {
					player: "useCardAfter",
				},
				filter(event, player) {
					return event.skill == "gz_xiace";
				},
				silent: true,
				async content(event, _trigger, player) {
					/** @type {PlayerGuozhan} */
					const playerRef = cast(player);
					await playerRef.mayChangeVice(undefined, undefined);
					event.skill = "gz_xiace";
					await event.trigger("skillAfter");
				},
			},
			limit: {
				charlotte: true,
				onremove: true,
				intro: {
					markcount(storage) {
						return -(storage || 0);
					},
					content: "出杀次数-#",
				},
				mod: {
					cardUsable(card, player, num) {
						if (card.name == "sha") {
							return num - player.countMark("gz_xiace_limit");
						}
					},
				},
			},
		},
	},
	gz_limeng: {
		audio: 2,
		trigger: {
			player: "phaseJieshuBegin",
		},
		filter(event, player) {
			if (
				!player.countCards("he", card => {
					if (_status.connectMode) {
						return true;
					}
					return get.type(card) != "basic";
				})
			) {
				return false;
			}
			return game.hasPlayer(current => {
				return game.hasPlayer(current2 => get.info("gz_limeng")?.isPerfectPair?.(current, current2));
			});
		},
		isPerfectPair(player, target) {
			let list1 = [],
				list2 = [];
			for (let i = 0; i < 2; i++) {
				if (!player.isUnseen(i)) {
					list1.push(player[`name${i + 1}`]);
				}
				if (!target.isUnseen(1)) {
					list2.push(target[`name${i + 1}`]);
				}
			}
			if (!list1.length || !list2.length) {
				return false;
			}
			return list1.some(name => {
				return list2.some(name2 => {
					const tempPlayer = {
						name1: name,
						name2: name2,
					};
					if (get.is.jun(name) || get.is.jun(name2)) {
						return lib.character[name][1] == lib.character[name2][1];
					}
					return lib.element.player.perfectPair.call(tempPlayer);
				});
			});
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseCardTarget({
					prompt: get.prompt2(event.skill),
					filterCard(card, player) {
						return get.type(card) != "basic" && lib.filter.cardDiscardable(card, player, "gz_limeng");
					},
					filterTarget(card, player, target) {
						const filter = get.info("gz_limeng")?.isPerfectPair;
						if (ui.selected.targets.length) {
							const targetx = ui.selected.targets[0];
							return filter && filter(target, targetx);
						}
						return game.hasPlayer(current => filter && filter(target, current));
					},
					selectTarget() {
						if (ui.selected.targets.length && ui.selected.targets[0]?.perfectPair()) {
							return [1, 2];
						}
						return 2;
					},
					complexTarget: true,
					complexSelect: true,
					ai1(card) {
						return 7 - get.value(card);
					},
					ai2(target) {
						const filter = get.info("gz_limeng")?.isPerfectPair;
						if (
							!game.hasPlayer(current => {
								return current != target && filter?.(target, current);
							})
						) {
							return 0;
						}
						return get.damageEffect(target, target, player);
					},
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const {
				cards,
				targets: [target1, target2],
			} = event;
			await player.discard(cards);
			if (target2) {
				if (target1.isIn() && target2.isIn()) {
					target1.line(target2, "thunder");
					await target2.damage(target1);
				}
				if (target1.isIn() && target2.isIn()) {
					target2.line(target1, "thunder");
					await target1.damage(target2);
				}
			}
		},
	},
	gz_xiejian: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		filterTarget: lib.filter.notMe,
		async content(event, trigger, player) {
			const target = event.target;
			const { junling, targets: junlingTargets, unchosenJunling: junling2 } = await player.chooseJunlingFor(target).forResult();
			const choiceList = [];
			choiceList.push("执行该军令");
			choiceList.push(`执行未被${get.translation(player)}选择的军令`);

			const result = await target.chooseJunlingControl(player, junling, junlingTargets).set("prompt", "挟奸").set("choiceList", choiceList).set("ai", chooseJunlingCheck).forResult();

			if (result.index == 0) {
				await target.carryOutJunling(player, junling, junlingTargets);
			} else {
				let targets = [];
				if (junling2[0] == "junling1") {
					const result2 = await player
						.chooseTarget("选择一名角色，做为因该军令被执行而受到伤害的角色", true)
						.set("ai", other => get.damageEffect(other, target, player))
						.forResult();
					if (result2.bool) {
						player.line(result2.targets, "green");
						targets = result2.targets;
					}
				}
				await target.carryOutJunling(player, junling2[0], targets);
			}

			function chooseJunlingCheck() {
				return get.junlingEffect(player, junling, target, junlingTargets, target) > 1 ? 0 : 1;
			}
		},
		ai: {
			order: 3,
			result: {
				target: -1,
			},
		},
	},
	gz_yinsha: {
		audio: 2,
		enable: "chooseToUse",
		filterCard: true,
		selectCard: -1,
		position: "h",
		viewAs: {
			name: "jiedao",
		},
		filter(event, player) {
			return player.countCards("h") > 0;
		},
		viewAsFilter(player) {
			return player.countCards("h") > 0;
		},
		prompt: "将所有手牌当借刀杀人使用",
		check(card) {
			const val = get.value(card);
			return 5 - val;
		},
		ai: {
			result: {
				player(player, target) {
					if (!target.hasSkillTag("noe") && get.attitude(player, target) > 0) {
						return 0;
					}
					if (player.countCards("h") >= Math.max(3, player.hp)) {
						return 0;
					}
					return (
						(player.hasSkillTag("noe") ? 0.32 : 0.15) *
						target.getEquips(1).reduce((num, i) => {
							return num + get.value(i, player);
						}, 0)
					);
				},
			},
		},
		group: "gz_yinsha_effect",
		subSkill: {
			effect: {
				trigger: {
					global: "chooseToUseBegin",
				},
				filter(event, player) {
					if (event.getParent().name !== "jiedao") {
						return false;
					}
					const evt = event.getParent(2);
					return evt?.name === "useCard" && evt.player === player && evt.skill == "gz_yinsha";
				},
				async cost(event, trigger, player) {
					const target = trigger.player;
					if (target.countCards("h", "sha")) {
						const backup = _status.event;
						_status.event = trigger;
						const bool = target.countCards("h", card => {
							return trigger.filterCard(card, player, trigger) && game.hasPlayer(current => {
								return current !== target && trigger.filterTarget(card, target, current);
							});
						}) > 0;
						_status.event = backup;
						trigger.set("forced", bool);
					} else if (target.countCards("h")) {
						const card = get.autoViewAs({ name: "sha" }, target.getCards("h"));
						const backup = _status.event;
						_status.event = trigger;
						const bool = trigger.filterCard(card, player, trigger);
						const targets = game.filterPlayer(current => {
							return current !== target && trigger.filterTarget(card, target, current);
						});
						_status.event = backup;
						if (bool && targets.length) {
							trigger.result = {
								bool: true,
								card: card,
								cards: target.getCards("h"),
								targets: targets,
							};
							trigger.untrigger();
							trigger.set("responded", true);
						}
					}
				},
			},
		},
	},
	gz_neiji: {
		audio: 2,
		trigger: {
			player: "phaseUseBegin",
		},
		preHidden: true,
		filter(event, player) {
			return game.hasPlayer(current => {
				if (current == player) {
					return false;
				}
				if (player.isUnseen()) {
					return current.isUnseen();
				}
				return !current.isFriendOf(player);
			});
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt2(event.skill), (card, player, target) => {
					if (target == player) {
						return false;
					}
					if (player.isUnseen()) {
						return target.isUnseen();
					}
					return !target.isFriendOf(player);
				})
				.setHiddenSkill(event.skill)
				.set("ai", target => {
					const player = get.player(),
						num = player.countCards("h", "sha");
					if (num >= 2) {
						return get.attitude(player, target);
					}
					if (num == 1) {
						return -get.attitude(player, target);
					}
					return 0;
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			const next = player
				.chooseCardOL([player, target], "内忌：请选择要展示的牌", true, 2)
				.set("ai", card => {
					if (card.name == "sha") {
						return 7 - get.value(card);
					}
					return -get.value(card);
				})
				.set("source", player);
			next.aiCard = function (target) {
				let hs = target.getCards("h");
				if (hs.length > 2) {
					hs = hs.randomGets(2);
				}
				return { bool: true, cards: hs };
			};
			next._args.remove("glow_result");
			const result = await next.forResult();
			let cards1 = result[0].cards,
				cards2 = result[1].cards;
			await player.showCards(cards1);
			await target.showCards(cards2);
			player.$throw(cards1, 1000);
			target.$throw(cards2, 1000);
			let lose_list = [],
				num = 0,
				discards = [];
			if (cards1.some(card => card.name == "sha")) {
				const cards = cards1.filter(card => card.name == "sha");
				lose_list.push([player, cards]);
				num += cards.length;
				discards.push(player);
			}
			if (cards2.some(card => card.name == "sha")) {
				const cards = cards2.filter(card => card.name == "sha");
				lose_list.push([target, cards]);
				num += cards.length;
				discards.push(target);
			}
			await game
				.loseAsync({
					lose_list: lose_list,
					discarder: player,
				})
				.setContent("discardMultiple");
			if (num > 1) {
				await game.asyncDraw([player, target], 3);
			} else {
				if (discards.length == 1) {
					const targetx = discards[0],
						user = [player, target].find(i => i != targetx),
						card = new lib.element.VCard({ name: "juedou" });
					if (user.canUse(card, targetx)) {
						await user.useCard(card, targetx, "noai");
					}
				}
			}
		},
	},
	gz_bingxin: {
		audio: "bingxin",
		enable: "chooseToUse",
		hiddenCard(player, name) {
			if (get.type(name) == "basic" && lib.inpile.includes(name) && !player.getStorage("gz_bingxin_count").includes(name)) {
				return true;
			}
		},
		filter(event, player) {
			if (event.type == "wuxie") {
				return false;
			}
			var hs = player.getCards("h");
			if (hs.length != Math.max(0, player.hp)) {
				return false;
			}
			if (hs.length > 1) {
				var color = get.color(hs[0], player);
				for (var i = 1; i < hs.length; i++) {
					if (get.color(hs[i], player) != color) {
						return false;
					}
				}
			}
			var storage = player.storage.gz_bingxin_count;
			for (var i of lib.inpile) {
				if (get.type(i) != "basic") {
					continue;
				}
				if (storage && storage.includes(i)) {
					continue;
				}
				var card = { name: i, isCard: true };
				if (event.filterCard(card, player, event)) {
					return true;
				}
				if (i == "sha") {
					for (var j of lib.inpile_nature) {
						card.nature = j;
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
				var list = [];
				var storage = player.storage.gz_bingxin_count;
				for (var i of lib.inpile) {
					if (get.type(i) != "basic") {
						continue;
					}
					if (storage && storage.includes(i)) {
						continue;
					}
					var card = { name: i, isCard: true };
					if (event.filterCard(card, player, event)) {
						list.push(["基本", "", i]);
					}
					if (i == "sha") {
						for (var j of lib.inpile_nature) {
							card.nature = j;
							if (event.filterCard(card, player, event)) {
								list.push(["基本", "", i, j]);
							}
						}
					}
				}
				return ui.create.dialog("冰心", [list, "vcard"], "hidden");
			},
			check(button) {
				if (button.link[2] == "shan") {
					return 3;
				}
				var player = _status.event.player;
				if (button.link[2] == "jiu") {
					if (player.getUseValue({ name: "jiu" }) <= 0) {
						return 0;
					}
					if (player.countCards("h", "sha")) {
						return player.getUseValue({ name: "jiu" });
					}
					return 0;
				}
				return player.getUseValue({ name: button.link[2], nature: button.link[3] }) / 4;
			},
			backup(links, player) {
				return {
					selectCard: -1,
					filterCard: () => false,
					viewAs: {
						name: links[0][2],
						nature: links[0][3],
						isCard: true,
					},
					log: false,
					precontent() {
						player.logSkill("gz_bingxin");
						player.draw();
						var name = event.result.card.name;
						player.addTempSkill("gz_bingxin_count");
						player.markAuto("gz_bingxin_count", [name]);
					},
				};
			},
			prompt(links, player) {
				var name = links[0][2];
				var nature = links[0][3];
				return "摸一张并视为使用" + (get.translation(nature) || "") + get.translation(name);
			},
		},
		ai: {
			order: 10,
			respondShan: true,
			respondSha: true,
			skillTagFilter(player, tag, arg) {
				if (arg == "respond") {
					return false;
				}
				var hs = player.getCards("h");
				if (hs.length != Math.max(0, hs.length)) {
					return false;
				}
				if (hs.length > 1) {
					var color = get.color(hs[0], player);
					for (var i = 1; i < hs.length; i++) {
						if (get.color(hs[i], player) != color) {
							return false;
						}
					}
				}
				var storage = player.storage.gz_bingxin_count;
				if (storage && storage.includes("s" + tag.slice(8))) {
					return false;
				}
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
		subSkill: { count: { charlotte: true, onremove: true } },
	},

	fakexiongshu: {
		audio: "xiongshu",
		trigger: { global: "useCardToPlayered" },
		filter(event, player) {
			if (!event.isFirstTarget) {
				return false;
			}
			if (event.player == player && game.countPlayer() < 2) {
				return false;
			}
			if (event.player != player && !player.countDiscardableCards(player, "he")) {
				return false;
			}
			return event.card.name == "sha" || (get.type(event.card) == "trick" && get.tag(event.card, "damage"));
		},
		check(event, player) {
			if (event.player == player) {
				if (event.targets.some(i => i.hasSkill("gzduanchang"))) {
					return true;
				}
				return !event.targets.some(i => i.getHp() == 1 && !i.hasSkill("gzbuqu") && i.isEnemyOf(player));
			}
			if (event.targets.some(i => i.hasSkill("gzduanchang"))) {
				return false;
			}
			return event.targets.some(i => i.getHp() == 1 && !i.hasSkill("gzbuqu") && i.isEnemyOf(player));
		},
		usable: 1,
		async content(event, trigger, player) {
			if (trigger.player == player) {
				await player.draw();
				const {
					result: { bool, targets },
				} = await player.chooseTarget("令一名其他角色成为" + get.translation(trigger.card) + "的伤害来源", true, lib.filter.notMe).set("ai", target => {
					const player = get.event("player"),
						targets = get.event().getTrigger().targets;
					const goon = player.hasSkill("fakejianhui") && targets.some(i => i != target && i.isFriendOf(target));
					return targets.reduce((sum, i) => sum + get.damageEffect(i, target, player), 0) * (goon ? 3 : 1);
				});
				if (bool) {
					const target = targets[0];
					player.line(target);
					game.log(target, "成为了", trigger.card, "的伤害来源");
					trigger.getParent().customArgs.default.customSource = target;
				}
			} else {
				await player.chooseToDiscard("he", true);
				game.log(player, "成为了", trigger.card, "的伤害来源");
				trigger.getParent().customArgs.default.customSource = player;
			}
		},
	},
	fakejianhui: {
		audio: "jianhui",
		trigger: { global: "damageSource" },
		filter(event, player) {
			if (!event.source || !event.player || !event.source.isIn() || !event.player.isIn() || event.source == event.player) {
				return false;
			}
			return event.source.isFriendOf(event.player) && [event.source, event.player].some(target => target.countCards("he"));
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(
					get.prompt2("fakejianhui"),
					(card, player, target) => {
						const trigger = get.event().getTrigger();
						if (!(trigger.source == target || trigger.player == target)) {
							return false;
						}
						if (!ui.selected.targets.length) {
							return true;
						}
						return target.countCards("he");
					},
					2
				)
				.set("targetprompt", ["摸牌", "拆牌"])
				.set("ai", target => {
					const player = get.event("player"),
						trigger = get.event().getTrigger();
					const source = trigger.source,
						playerx = trigger.player;
					const min = -Math.min(get.effect(source, { name: "draw" }, player, player), get.effect(playerx, { name: "draw" }, player, player));
					const max = Math.max(get.effect(source, { name: "guohe_copy" }, player, player), get.effect(playerx, { name: "guohe_copy" }, player, player));
					if (min > max) {
						return 0;
					}
					if (!ui.selected.targets.length) {
						return -1 / Math.min(get.effect(target, { name: "draw" }, player, player), -0.001);
					}
					return get.effect(target, { name: "guohe_copy" }, player, player);
				})
				.set("complexSelect", true)
				.set("complexTarget", true)
				.forResult();
		},
		popup: false,
		async content(event, trigger, player) {
			player.logSkill("fakejianhui", event.targets, false);
			player.line2(event.targets);
			await event.targets[0].draw();
			await player.discardPlayerCard(event.targets[1], "he", true);
		},
	},
	fakechongxin: {
		audio: "chongxin",
		enable: "phaseUse",
		viewAs: {
			name: "yiyi",
			isCard: true,
		},
		usable: 1,
		filter(event, player) {
			const card = new lib.element.VCard({ name: "yiyi" });
			return lib.filter.targetEnabled2(card, player, player) && game.hasPlayer(target => lib.skill.fakechongxin.filterTarget(card, player, target));
		},
		selectTarget: 1,
		filterTarget(card, player, target) {
			if (game.checkMod(card, player, target, "unchanged", "playerEnabled", player) == false) {
				return false;
			}
			if (game.checkMod(card, player, target, "unchanged", "targetEnabled", target) == false) {
				return false;
			}
			return target.isEnemyOf(player);
		},
		filterCard: () => false,
		selectCard: -1,
		precontent() {
			event.result.targets.add(player);
		},
		ai: {
			order(item, player) {
				return get.order({ name: "yiyi" }, player) + 0.1;
			},
			result: {
				target(player, target) {
					const card = new lib.element.VCard({ name: "yiyi" });
					const num = get.sgn(get.attitude(player, target));
					return num * (get.effect(player, card, player, player) - get.effect(target, card, player, player));
				},
			},
		},
	},
	fakeweirong: {
		zhuanhuanji: true,
		locked: false,
		marktext: "☯",
		intro: {
			content(storage) {
				if (storage) {
					return "出牌阶段，你可以摸X张牌，然后当你于本轮不因此法失去牌后，你弃置一张牌。（X为你上一轮以此法摸和弃置的牌数之和，且X至少为1，至多为你的体力上限）";
				}
				return "出牌阶段，你可以弃置X张牌，然后当你于本轮不因此法得到牌后，你摸一张牌。（X为你上一轮以此法摸和弃置的牌数之和，且X至少为1，至多为你的体力上限）";
			},
		},
		audio: "weishu",
		enable: "phaseUse",
		filter(event, player) {
			if (!get.info("fakeweirong").getNum(player)) {
				return false;
			}
			const storage = player.storage.fakeweirong;
			return storage || player.countCards("he", card => lib.filter.cardDiscardable) >= get.info("fakeweirong").getNum(player);
		},
		filterCard(card, player) {
			return !player.storage.fakeweirong && lib.filter.cardDiscardable(card, player);
		},
		selectCard() {
			const player = get.event("player");
			return player.storage.fakeweirong ? -1 : get.info("fakeweirong").getNum(player);
		},
		check(card) {
			return 7.5 - get.value(card);
		},
		prompt() {
			const player = get.event("player");
			const num = get.info("fakeweirong").getNum(player);
			if (player.storage.fakeweirong) {
				return "摸" + get.cnNumber(num) + "张牌，然后当你于本轮不因此法失去牌后，你弃置一张牌";
			}
			return "弃置" + get.cnNumber(num) + "张牌，然后当你于本轮不因此法得到牌后，你摸一张牌";
		},
		round: 1,
		async content(event, trigger, player) {
			const storage = player.storage.fakeweirong;
			player.changeZhuanhuanji("fakeweirong");
			if (storage) {
				await player.draw(get.info("fakeweirong").getNum(player));
			}
			player.addTempSkill("fakeweirong_" + (storage ? "lose" : "gain"), "roundStart");
		},
		ai: {
			order(item, player) {
				const storage = player.storage.fakeweirong;
				return storage ? 0.01 : 9;
			},
			result: { player: 1 },
		},
		group: "fakeweirong_mark",
		subSkill: {
			mark: {
				charlotte: true,
				trigger: { player: ["hideCharacterBegin", "showCharacterEnd"] },
				filter(event, player) {
					if (event.name == "hideCharacter") {
						return get.character(event.toHide, 3).includes("fakeweirong");
					}
					return event.toShow?.some(name => {
						return get.character(name, 3).includes("fakeweirong");
					});
				},
				forced: true,
				popup: false,
				firstDo: true,
				content() {
					player[(trigger.name == "hideCharacter" ? "un" : "") + "markSkill"]("fakeweirong");
				},
			},
			gain: {
				charlotte: true,
				mark: true,
				marktext: "↑",
				intro: { content: "不因此法得到牌后，你摸一张牌" },
				audio: "weishu",
				trigger: { player: "gainAfter", global: "loseAsyncAfter" },
				filter(event, player) {
					if (!event.getg || !event.getg(player).length) {
						return false;
					}
					return event.getParent(2).name != "fakeweirong_gain";
				},
				forced: true,
				content() {
					player.draw();
				},
			},
			lose: {
				charlotte: true,
				mark: true,
				marktext: "↓",
				intro: { content: "不因此法失去牌后，你弃置一张牌" },
				audio: "weishu",
				trigger: { player: "loseAfter", global: "loseAsyncAfter" },
				filter(event, player) {
					if (!player.countCards("he")) {
						return false;
					}
					const evt = event.getl(player);
					if (!evt || !evt.cards2 || !evt.cards2.length) {
						return false;
					}
					return event.getParent(3).name != "fakeweirong_lose";
				},
				forced: true,
				content() {
					player.chooseToDiscard("he", true);
				},
			},
		},
		getNum(player) {
			let num = 0,
				count = false;
			const history = player.actionHistory;
			for (let i = history.length - 1; i >= 0; i--) {
				if (history[i].isRound) {
					if (!count) {
						count = true;
						continue;
					} else {
						break;
					}
				}
				if (!count) {
					continue;
				}
				const allHistory = history[i].gain
					.filter(evt => {
						return evt.getParent(2).name == "fakeweirong" || evt.getParent(2).name == "fakeweirong_gain";
					})
					.slice()
					.concat(
						history[i].lose.filter(evt => {
							return evt.getParent(2).skill == "fakeweirong" || evt.getParent(3).name == "fakeweirong_lose";
						})
					);
				for (const evt of allHistory) {
					num += evt.cards.length;
				}
			}
			return Math.max(1, Math.min(player.maxHp, num));
		},
	},
	fakequanbian: {
		audio: "quanbian",
		trigger: { player: ["useCard", "respond"] },
		filter(event, player) {
			if (!Array.from(ui.cardPile.childNodes).length) {
				return false;
			}
			return player.countCards("h") && _status.currentPhase == player;
		},
		async cost(event, trigger, player) {
			const cards = Array.from(ui.cardPile.childNodes);
			const {
				result: { bool, moved },
			} = await player
				.chooseToMove(get.prompt2("fakequanbian"))
				.set("list", [
					["牌堆顶", cards.slice(0, Math.min(player.maxHp, cards.length)), "fakequanbian_tag"],
					["手牌", player.getCards("h")],
				])
				.set("filterOk", moved => moved[1].filter(i => !get.owner(i)).length == 1)
				.set("filterMove", (from, to) => typeof to != "number")
				.set("processAI", list => {
					const player = get.event("player"),
						goon = player.hasSkill("fakezhouting");
					let cards1 = list[0][1].slice(),
						cards2 = list[1][1].slice();
					let card1 = cards1.slice().sort((a, b) => get[goon ? "useful" : "value"](goon ? a : b) - get[goon ? "useful" : "value"](goon ? b : a))[0];
					let card2 = cards2.slice().sort((a, b) => get[goon ? "useful" : "value"](goon ? b : a) - get[goon ? "useful" : "value"](goon ? a : b))[0];
					if (get[goon ? "useful" : "value"](card1) * (goon ? -1 : 1) < get[goon ? "useful" : "value"](card2) * (goon ? -1 : 1)) {
						cards1.remove(card1);
						cards2.remove(card2);
						return [cards1.concat(card2), cards2.concat(card1)];
					}
				});
			if (bool) {
				event.result = {
					bool: true,
					cost_data: [moved[0].filter(i => get.owner(i))[0], moved[1].filter(i => !get.owner(i))[0]],
				};
			} else {
				event.result = { bool: false };
			}
		},
		async content(event, trigger, player) {
			await player
				.lose(event.cost_data[0], ui.cardPile)
				.set("insert_index", () => {
					return ui.cardPile.childNodes[Array.from(ui.cardPile.childNodes).indexOf(get.event("card2"))];
				})
				.set("card2", event.cost_data[1]);
			await player.gain(event.cost_data[1], "gain2");
		},
	},
	fakezhouting: {
		unique: true,
		limited: true,
		audio: "xiongzhi",
		enable: "phaseUse",
		skillAnimation: true,
		animationColor: "thunder",
		async content(event, trigger, player) {
			player.awakenSkill("fakezhouting");
			let gains = [];
			const cards = Array.from(ui.cardPile.childNodes).slice(0, Math.min(player.maxHp, Array.from(ui.cardPile.childNodes).length));
			await game.cardsGotoOrdering(cards);
			for (const card of cards) {
				if (player.hasUseTarget(card, false, false) || (get.info(card).notarget && lib.filter.cardEnabled(card, player))) {
					await player.chooseUseTarget(card, true, false, "nodistance");
				} else {
					gains.push(card);
				}
			}
			if (gains.length) {
				await player.gain(gains, "gain2");
			}
			if (
				game.getGlobalHistory("everything", evt => {
					return evt.name == "die" && evt.getParent(6) == event && evt.getParent(6).player == player;
				}).length
			) {
				player.restoreSkill("fakezhouting");
			}
		},
		ai: {
			order: 1,
			result: {
				player(player) {
					return player.hasUnknown() ? 0 : 1;
				},
			},
		},
	},
	fakexuanbei: {
		audio: "xuanbei",
		trigger: { player: "showCharacterEnd" },
		filter(event, player) {
			return (
				game
					.getAllGlobalHistory(
						"everything",
						evt => {
							return evt.name == "showCharacter" && evt.player == player && evt.toShow.some(i => get.character(i, 3).includes("fakexuanbei"));
						},
						event
					)
					.indexOf(event) == 0
			);
		},
		forced: true,
		locked: false,
		async content(event, trigger, player) {
			await player.draw(2);
			player.addTempSkill("fakexuanbei_effect");
		},
		group: ["fakexuanbei_change", "fakexuanbei_give"],
		subSkill: {
			effect: {
				charlotte: true,
				mark: true,
				intro: { content: "使用应变牌时直接获得强化" },
			},
			give: {
				audio: "xuanbei",
				trigger: { player: "useCardAfter" },
				filter(event, player) {
					return (event.card.yingbian || get.is.yingbian(event.card)) && event.cards.filterInD().length;
				},
				usable: 1,
				async cost(event, trigger, player) {
					const cards = trigger.cards.filterInD();
					const {
						result: { bool, targets },
					} = await player.chooseTarget(get.prompt("fakexuanbei"), "令一名其他角色获得" + get.translation(event.cards), lib.filter.notMe).set("ai", target => {
						let att = get.attitude(get.event("player"), target);
						if (att < 0) {
							return 0;
						}
						if (target.hasJudge("lebu")) {
							att /= 2;
						}
						if (target.hasSkillTag("nogain")) {
							att /= 10;
						}
						return att / (1 + get.distance(player, target, "absolute"));
					});
					event.result = { bool: bool, targets: targets, cards: cards };
				},
				async content(event, trigger, player) {
					await event.targets[0].gain(event.cards, "gain2").set("giver", player);
				},
			},
			change: {
				audio: "xuanbei",
				trigger: { player: "die" },
				direct: true,
				forceDie: true,
				skillAnimation: true,
				animationColor: "thunder",
				async cost(event, trigger, player) {
					const {
						result: { bool, targets },
					} = await player
						.chooseTarget(get.prompt("fakexuanbei"), "令一名其他角色变更副将", lib.filter.notMe)
						.set("ai", target => {
							const player = get.event("player");
							const rank = get.guozhanRank(target.name2, target) <= 3;
							const att = get.attitude(player, target);
							if (att > 0) {
								return (4 - rank) * att;
							}
							return -(rank - 6) * att;
						})
						.set("forceDie", true);
					event.result = { bool: bool, targets: targets };
				},
				async content(event, trigger, player) {
					await event.targets[0].changeVice();
				},
			},
		},
	},
	fakeqingleng: {
		audio: "qingleng",
		trigger: { global: "phaseEnd" },
		filter(event, player) {
			var target = event.player;
			return target != player && target.isIn() && !target.isUnseen(2) && player.countCards("he") && player.canUse({ name: "sha", nature: "ice" }, target, false);
		},
		direct: true,
		preHidden: true,
		async content(event, trigger, player) {
			const target = trigger.player;
			const {
				result: { bool },
			} = await player
				.chooseToUse()
				.set("openskilldialog", get.prompt2("fakeqingleng", target))
				.set("norestore", true)
				.set("_backupevent", "fakeqingleng_backup")
				.set("custom", {
					add: {},
					replace: { window() { } },
				})
				.set("targetRequired", true)
				.set("complexSelect", true)
				.set("complexTarget", true)
				.set("filterTarget", function (card, player, target) {
					if (target != _status.event.sourcex && !ui.selected.targets.includes(_status.event.sourcex)) {
						return false;
					}
					return lib.filter.targetEnabled.apply(this, arguments);
				})
				.set("sourcex", target)
				.set("addCount", false)
				.setHiddenSkill("fakeqingleng")
				.backup("fakeqingleng_backup")
				.set("logSkill", ["fakeqingleng", target]);
			if (
				bool &&
				!player.getHistory("sourceDamage", evt => {
					return evt.getParent(4) == event;
				}).length
			) {
				const {
					result: { bool, links },
				} = await player.chooseButton(["清冷：暗置" + get.translation(target) + "的一张武将牌", '<div class="text center">' + get.translation(target) + "的武将牌</div>", [[target.name1, target.name2], "character"]], true).set("filterButton", button => !get.is.jun(button.link));
				if (bool) {
					player.line(target);
					player.addSkill("fakeqingleng_effect");
					if (player.getStorage("fakeqingleng_effect").some(list => list[0] == target)) {
						player.storage.fakeqingleng_effect.indexOf(player.getStorage("fakeqingleng_effect").find(list => list[0] == target))[1].addArray(links);
					} else {
						player.markAuto("fakeqingleng_effect", [[target, links[0]]]);
					}
					target
						.when(["phaseBegin", "die"])
						.vars({ target: player })
						.then(() => {
							const removes = target.getStorage("fakeqingleng_effect").filter(list => list[0] == player);
							target.unmarkAuto("fakeqingleng_effect", removes);
							if (!target.getStorage("fakeqingleng_effect").length) {
								target.removeSkill("fakeqingleng_effect");
							}
						});
					await target.hideCharacter(target.name1 == links[0] ? 0 : 1);
				}
			}
		},
		subSkill: {
			backup: {
				filterCard(card) {
					return get.itemtype(card) == "card";
				},
				check(card) {
					return 7.5 - get.value(card);
				},
				position: "he",
				popname: true,
				viewAs: { name: "sha", nature: "ice" },
				log: false,
			},
			effect: {
				charlotte: true,
				onremove: true,
				intro: {
					content(storage) {
						return (
							"•" +
							storage
								.map(list => {
									return get.translation(list[0]) + "明置" + get.translation(list[1]) + "后，对其造成1点伤害";
								})
								.join("<br>•")
						);
					},
				},
				audio: "qingleng",
				trigger: { global: "showCharacterEnd" },
				filter(event, player) {
					const list = player.getStorage("fakeqingleng_effect").find(list => list[0] == event.player);
					return list && list[1].includes(event.toShow);
				},
				forced: true,
				logTarget: "player",
				content() {
					trigger.player.damage();
				},
			},
		},
	},
	fakexijue: {
		audio: "xijue",
		trigger: { player: "showCharacterEnd" },
		filter(event, player) {
			return (
				game
					.getAllGlobalHistory(
						"everything",
						evt => {
							return evt.name == "showCharacter" && evt.player == player && evt.toShow.some(i => get.character(i, 3).includes("fakexijue"));
						},
						event
					)
					.indexOf(event) == 0
			);
		},
		forced: true,
		locked: false,
		popup: false,
		preHidden: ["xijue_tuxi", "fakexijue_xiaoguo"],
		content() {
			player.addMark("xijue", 2);
		},
		derivation: ["xijue_tuxi", "fakexijue_xiaoguo"],
		group: ["fakexijue_effect", "xijue_tuxi", "fakexijue_xiaoguo"],
		subSkill: {
			effect: {
				audio: "xijue",
				trigger: { player: ["phaseDrawBegin2", "phaseEnd"] },
				filter(event, player) {
					if (event.name == "phaseDraw") {
						return !event.numFixed;
					}
					return player.getHistory("sourceDamage").length;
				},
				forced: true,
				popup: false,
				content() {
					if (trigger.name == "phaseDraw") {
						trigger.num = Math.min(player.countMark("xijue"), player.maxHp);
					} else {
						player.addMark("xijue", 1);
					}
				},
			},
			xiaoguo: {
				audio: "xijue_xiaoguo",
				trigger: { global: "phaseZhunbeiBegin" },
				filter(event, player) {
					if (!player.hasMark("xijue")) {
						return false;
					}
					return (
						event.player != player &&
						player.countCards("h", card => {
							if (_status.connectMode) {
								return true;
							}
							return get.type(card) == "basic" && lib.filter.cardDiscardable(card, player);
						})
					);
				},
				async cost(event, trigger, player) {
					event.result = await player
						.chooseToDiscard(
							get.prompt2("fakexijue_xiaoguo", trigger.player),
							(card, player) => {
								return get.type(card) == "basic";
							},
							[1, Math.min(player.countMark("xijue"), player.maxHp)]
						)
						.set("complexSelect", true)
						.set("ai", card => {
							const player = get.event("player"),
								target = get.event().getTrigger().player;
							const effect = get.damageEffect(target, player, player);
							const cards = target.getCards("e", card => get.attitude(player, target) * get.value(card, target) < 0);
							if (effect <= 0 && !cards.length) {
								return 0;
							}
							if (ui.selected.cards.length > cards.length - (effect <= 0 ? 1 : 0)) {
								return 0;
							}
							return 1 / (get.value(card) || 0.5);
						})
						.set("logSkill", ["fakexijue_xiaoguo", trigger.player])
						.setHiddenSkill("fakexijue_xiaoguo")
						.forResult();
				},
				preHidden: true,
				popup: false,
				async content(event, trigger, player) {
					const num = trigger.player.countCards("e"),
						num2 = event.cards.length;
					await player.discardPlayerCard(trigger.player, "e", num2, true);
					if (num2 > num) {
						await trigger.player.damage();
					}
					player.removeMark("xijue", 1);
				},
			},
		},
	},
	fakeqimei: {
		audio: "qimei",
		trigger: { player: "phaseZhunbeiBegin" },
		direct: true,
		preHidden: true,
		content() {
			"step 0";
			player
				.chooseTarget(get.prompt("fakeqimei"), "选择一名其他角色并获得“齐眉”效果", lib.filter.notMe)
				.set("ai", target => {
					var player = _status.event.player;
					return get.attitude(player, target) / (Math.abs(player.countCards("h") + 2 - target.countCards("h")) + 1);
				})
				.setHiddenSkill("fakeqimei");
			"step 1";
			if (result.bool) {
				var target = result.targets[0];
				player.logSkill("fakeqimei", target);
				player.addTempSkill("fakeqimei_draw");
				player.storage.fakeqimei_draw = target;
				game.delayx();
			}
		},
		subSkill: {
			draw: {
				audio: "qimei",
				charlotte: true,
				forced: true,
				popup: false,
				trigger: {
					global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "loseAfter", "addToExpansionAfter"],
				},
				filter(event, player) {
					var target = player.storage.fakeqimei_draw;
					if (!target || !target.isIn()) {
						return false;
					}
					if (player.countCards("h") != target.countCards("h")) {
						return false;
					}
					var hasChange = function (event, player) {
						var gain = 0,
							lose = 0;
						if (event.getg) {
							gain = event.getg(player).length;
						}
						if (event.getl) {
							lose = event.getl(player).hs.length;
						}
						return gain != lose;
					};
					return (hasChange(event, player) && target.isDamaged()) || (hasChange(event, target) && player.isDamaged());
				},
				content() {
					"step 0";
					if (trigger.delay === false) {
						game.delayx();
					}
					"step 1";
					var target = player.storage.fakeqimei_draw;
					player.logSkill("fakeqimei_draw", target);
					var drawer = [];
					var hasChange = function (event, player) {
						var gain = 0,
							lose = 0;
						if (event.getg) {
							gain = event.getg(player).length;
						}
						if (event.getl) {
							lose = event.getl(player).hs.length;
						}
						return gain != lose;
					};
					if (hasChange(trigger, player)) {
						drawer.push(target);
					}
					if (hasChange(trigger, target)) {
						drawer.push(player);
					}
					for (const i of drawer) {
						if (i.isDamaged()) {
							i.recover();
						}
					}
				},
				group: "fakeqimei_hp",
				onremove: true,
				mark: true,
				intro: { content: "已和$组成齐眉组合" },
			},
			hp: {
				audio: "qimei",
				trigger: { global: "changeHp" },
				charlotte: true,
				forced: true,
				logTarget(event, player) {
					return player.storage.fakeqimei_draw;
				},
				filter(event, player) {
					var target = player.storage.fakeqimei_draw;
					if (!target || !target.isIn()) {
						return false;
					}
					if (player != event.player && target != event.player) {
						return false;
					}
					return player.hp == target.hp;
				},
				content() {
					game.delayx();
					(player == trigger.player ? player.storage.fakeqimei_draw : player).draw();
				},
			},
		},
	},
	fakebaoqie: {
		unique: true,
		audio: "baoqie",
		trigger: { player: "showCharacterEnd" },
		filter(event, player) {
			if (
				!game.hasPlayer(target => {
					return target.getGainableCards(player, "e").some(card => get.subtype(card) == "equip5");
				})
			) {
				return false;
			}
			return (
				game
					.getAllGlobalHistory(
						"everything",
						evt => {
							return evt.name == "showCharacter" && evt.player == player && evt.toShow.some(i => get.character(i, 3).includes("fakebaoqie"));
						},
						event
					)
					.indexOf(event) == 0
			);
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt("fakebaoqie"), "获得一名角色装备区里所有的宝物牌，然后你可以使用其中的一张牌", (card, player, target) => {
					return target.getGainableCards(player, "e").some(card => get.subtype(card) == "equip5");
				})
				.set("ai", target => {
					const player = get.event("player");
					return (
						-get.sgn(get.attitude(player, target)) *
						target
							.getGainableCards(player, "e")
							.filter(card => {
								return get.subtype(card) == "equip5";
							})
							.reduce((sum, card) => sum + get.value(card, target), 0)
					);
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			let cards = target.getGainableCards(player, "e").filter(card => get.subtype(card) == "equip5");
			await player.gain(cards, target, "giveAuto");
			cards = cards.filter(i => get.owner(i) == player && get.position(i) == "h" && player.hasUseTarget(i));
			if (cards.length) {
				const {
					result: { bool, links },
				} = await player.chooseButton(["宝箧：是否使用其中的一张宝物牌？", cards]).set("ai", button => {
					return get.equipValue(button.link, get.event("player"));
				});
				if (bool) {
					await player.chooseUseTarget(links[0], true);
				}
			}
		},
		ai: { mingzhi_no: true },
		group: "fakebaoqie_damage",
		subSkill: {
			damage: {
				audio: "baoqie",
				trigger: { player: "damageBegin4" },
				filter(event, player) {
					if (!player.getStockSkills(true, true, true).includes("fakebaoqie")) {
						return false;
					}
					return !game.getAllGlobalHistory("everything", evt => {
						return evt.name == "showCharacter" && evt.player == player && evt.toShow.some(i => get.character(i, 3).includes("fakebaoqie"));
					}).length;
				},
				check(event, player) {
					return !event.source || get.damageEffect(player, event.source, player) < 0;
				},
				prompt: "宝箧：是否明置此武将牌并防止此伤害？",
				content() {
					trigger.cancel();
				},
			},
		},
	},
	fakeciwei: {
		audio: "ciwei",
		trigger: { global: "useCard" },
		filter(event, player) {
			if (event.all_excluded || event.player == player || !player.countCards("he")) {
				return false;
			}
			return event.player.getHistory("useCard").indexOf(event) % 2 == 1;
		},
		async cost(event, trigger, player) {
			let str = "弃置一张牌，取消" + get.translation(trigger.card) + "的所有目标";
			if (get.type(trigger.card) == "equip") {
				str += "，然后你获得此牌且你可以使用之";
			}
			event.result = await player
				.chooseToDiscard(get.prompt("fakeciwei", trigger.player), str, "he")
				.set("ai", card => {
					return _status.event.goon / 1.4 - get.value(card);
				})
				.set(
					"goon",
					(function () {
						if (!trigger.targets.length) {
							return -get.attitude(player, trigger.player);
						}
						var num = 0;
						for (var i of trigger.targets) {
							num -= get.effect(i, trigger.card, trigger.player, player);
						}
						return num;
					})()
				)
				.setHiddenSkill("fakeciwei")
				.set("logSkill", ["fakeciwei", trigger.player])
				.forResult();
		},
		preHidden: true,
		popup: false,
		async content(event, trigger, player) {
			trigger.targets.length = 0;
			trigger.all_excluded = true;
			const cards = trigger.cards.filterInD();
			if (cards.length && get.type(trigger.card) == "equip") {
				await player.gain(cards, "gain2");
				for (let i of cards) {
					if (player.getCards("h").includes(i) && player.hasUseTarget(i)) {
						await player.chooseUseTarget(i);
					}
				}
			}
		},
		global: "fakeciwei_ai",
		subSkill: {
			ai: {
				mod: {
					aiOrder(player, card, num) {
						if (
							!player.getHistory("useCard").length % 2 ||
							!game.hasPlayer(current => {
								return current != player && (get.realAttitude || get.attitude)(current, player) < 0 && current.hasSkill("fakeciwei") && current.countCards("he") > 0;
							})
						) {
							return;
						}
						if (!player._fakeciwei_temp) {
							player._fakeciwei_temp = true;
							num /= Math.max(1, player.getUseValue(card));
						}
						delete player._fakeciwei_temp;
						return num;
					},
				},
			},
		},
	},
	fakehuirong: {
		unique: true,
		audio: "huirong",
		trigger: { player: "showCharacterEnd" },
		filter(event, player) {
			if (
				!game.hasPlayer(target => {
					return target.countCards("h") != target.getHp();
				})
			) {
				return false;
			}
			return (
				game
					.getAllGlobalHistory(
						"everything",
						evt => {
							return evt.name == "showCharacter" && evt.player == player && evt.toShow.some(i => get.character(i, 3).includes("fakehuirong"));
						},
						event
					)
					.indexOf(event) == 0
			);
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt("fakehuirong"), "令一名角色将手牌数摸至/弃置至与其体力值相同", (card, player, target) => {
					return target.countCards("h") != target.getHp();
				})
				.set("ai", target => {
					const att = get.attitude(get.event("player"), target);
					const num = target.countCards("h");
					if (num > target.hp) {
						return -att * (num - target.getHp());
					}
					return att * Math.max(0, target.getHp() - target.countCards("h"));
				})
				.forResult();
		},
		preHidden: true,
		content() {
			const target = event.targets[0];
			if (target.countCards("h") < target.getHp()) {
				target.drawTo(target.getHp());
			} else {
				target.chooseToDiscard("h", true, target.countCards("h") - target.getHp());
			}
		},
		ai: { mingzhi_no: true },
		group: "fakehuirong_damage",
		subSkill: {
			damage: {
				audio: "huirong",
				trigger: { player: "damageBegin4" },
				filter(event, player) {
					if (!player.getStockSkills(true, true, true).includes("fakehuirong")) {
						return false;
					}
					return !game.getAllGlobalHistory("everything", evt => {
						return evt.name == "showCharacter" && evt.player == player && evt.toShow.some(i => get.character(i, 3).includes("fakehuirong"));
					}).length;
				},
				check(event, player) {
					return !event.source || get.damageEffect(player, event.source, player) < 0;
				},
				prompt: "慧容：是否明置此武将牌并防止此伤害？",
				content() {
					trigger.cancel();
				},
			},
		},
	},
	fakeyanxi: {
		audio: "yanxi",
		enable: "phaseUse",
		filter(event, player) {
			return game.hasPlayer(target => {
				return get.info("fakeyanxi").filterTarget(null, player, target);
			});
		},
		filterTarget(card, player, target) {
			return target != player && target.countCards("h");
		},
		usable: 1,
		async content(event, trigger, player) {
			const target = event.target,
				str = get.translation(target);
			const {
				result: { bool, links },
			} = await player.choosePlayerCard(target, "宴戏：展示" + str + "的一张手牌", "h", true);
			if (bool) {
				let cards = get.cards(2),
					gains = [];
				await game.cardsGotoOrdering(cards);
				cards = links.slice().concat(cards);
				await player.showCards(cards, get.translation(player) + "发动了【宴戏】");
				for (const card of cards) {
					gains.unshift(get.color(card));
					gains.add(get.type2(card));
				}
				gains = gains.unique().map(i => (i == "none" ? "none2" : i));
				const {
					result: { control },
				} = await player
					.chooseControl(gains)
					.set("cards", cards)
					.set("ai", () => {
						const player = get.event("player"),
							cards = get.event("cards"),
							getNum = function (cards, control, player) {
								cards = cards.filter(i => get.type2(i) == control || get.color(i) == control);
								return cards.reduce((sum, card) => sum + get.value(card, player), 0);
							};
						let controls = get
							.event("controls")
							.slice()
							.map(i => (i == "none2" ? "none" : i));
						controls.sort((a, b) => getNum(cards, b, player) - getNum(cards, a, player));
						return controls[0] == "none" ? "none2" : controls[0];
					})
					.set("dialog", ["获得其中一种颜色或类别的所有牌，然后" + str + "获得剩余牌", "hidden", cards]);
				if (control) {
					const choice = control == "none2" ? "none" : control;
					gains = cards.filter(i => get.type2(i) == choice || get.color(i) == choice);
					const num = gains.length;
					cards.removeArray(gains);
					if (gains.includes(links[0])) {
						gains.removeArray(links);
						await player.gain(links, target, "give", "bySelf");
					}
					if (gains.length) {
						await player.gain(gains, "gain2");
					}
					player.addTempSkill("fakeyanxi_maxHand");
					player.addMark("fakeyanxi_maxHand", num, false);
					cards = cards.filter(i => !links.includes(i));
					if (cards.length) {
						await target.gain(cards, "gain2");
					}
				}
			}
		},
		ai: {
			order: 9,
			result: {
				target(player, target) {
					return [-1, 1, 2][get.sgn(get.attitude(player, target)) + 1] / target.countCards("h");
				},
			},
		},
		subSkill: {
			maxHand: {
				charlotte: true,
				onremove: true,
				intro: { content: "手牌上限+#" },
				mod: {
					maxHandcard(player, num) {
						return num + player.countMark("fakeyanxi_maxHand");
					},
				},
			},
		},
	},
	fakeshiren: {
		unique: true,
		audio: "shiren",
		trigger: { player: "showCharacterEnd" },
		filter(event, player) {
			if (
				!game.hasPlayer(target => {
					return get.info("fakeyanxi").filterTarget(null, player, target);
				})
			) {
				return false;
			}
			return (
				game
					.getAllGlobalHistory(
						"everything",
						evt => {
							return evt.name == "showCharacter" && evt.player == player && evt.toShow.some(i => get.character(i, 3).includes("fakeshiren"));
						},
						event
					)
					.indexOf(event) == 0
			);
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt("fakeshiren"), "发动一次【宴戏】", (card, player, target) => {
					return get.info("fakeyanxi").filterTarget(null, player, target);
				})
				.set("ai", target => {
					const player = get.event("player");
					return -get.sgn(get.attitude(player, target)) * get.info("fakeyanxi").ai.result.target(player, target);
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			player.useResult({ skill: "fakeyanxi", target: target, targets: [target] }, event);
		},
		ai: { mingzhi_no: true },
		group: "fakeshiren_damage",
		subSkill: {
			damage: {
				audio: "shiren",
				trigger: { player: "damageBegin4" },
				filter(event, player) {
					if (!player.getStockSkills(true, true, true).includes("fakeshiren")) {
						return false;
					}
					return !game.getAllGlobalHistory("everything", evt => {
						return evt.name == "showCharacter" && evt.player == player && evt.toShow.some(i => get.character(i, 3).includes("fakeshiren"));
					}).length;
				},
				check(event, player) {
					return !event.source || get.damageEffect(player, event.source, player) < 0;
				},
				prompt: "识人：是否明置此武将牌并防止此伤害？",
				content() {
					trigger.cancel();
				},
			},
		},
	},
	fakecanmou: {
		audio: "canmou",
		trigger: { global: "useCardToPlayer" },
		filter(event, player) {
			if (!event.player.isMaxHandcard(true) || !event.isFirstTarget || get.type(event.card) != "trick") {
				return false;
			}
			if (event.targets.length > 1 && !player.getStorage("fakecanmou_used").includes("-")) {
				return true;
			}
			return get.info("fakecanmou").filter_add(event, player);
		},
		filter_add(event, player) {
			const info = get.info(event.card);
			if (info.allowMultiple == false) {
				return false;
			}
			if (event.targets && !info.multitarget && !player.getStorage("fakecanmou_used").includes("+")) {
				if (
					game.hasPlayer(current => {
						return !event.targets.includes(current) && lib.filter.targetEnabled2(event.card, event.player, current);
					})
				) {
					return true;
				}
			}
			return false;
		},
		async cost(event, trigger, player) {
			let str = "",
				goon = get.info("fakecanmou").filter_add(trigger, player),
				bool = trigger.targets.length > 1 && !player.getStorage("fakecanmou_used").includes("-");
			if (goon) {
				str += "增加";
			}
			if (goon && bool) {
				str = "或";
			}
			if (bool) {
				str += "减少";
			}
			event.result = await player
				.chooseTarget(get.prompt("fakecanmou"), (card, player, target) => {
					const trigger = get.event().getTrigger();
					if (trigger.targets.length > 1 && !player.getStorage("fakecanmou_used").includes("-") && trigger.targets.includes(target)) {
						return true;
					}
					return !player.getStorage("fakecanmou_used").includes("+") && !trigger.targets.includes(target) && lib.filter.targetEnabled2(trigger.card, trigger.player, target);
				})
				.set("prompt2", "为" + get.translation(trigger.card) + str + "一个目标")
				.set("ai", target => {
					const player = get.event("player"),
						trigger = get.event().getTrigger();
					return get.effect(target, trigger.card, trigger.player, player) * (trigger.targets.includes(target) ? -1 : 1);
				})
				.setHiddenSkill("fakecanmou")
				.forResult();
		},
		preHidden: true,
		async content(event, trigger, player) {
			const target = event.targets[0],
				goon = trigger.targets.includes(target);
			player.addTempSkill("fakecanmou_used");
			player.markAuto("fakecanmou_used", [goon ? "-" : "+"]);
			if (goon) {
				trigger.targets.remove(target);
				game.log(target, "被", player, "移除了目标");
			} else {
				trigger.targets.add(target);
				game.log(target, "成为了", trigger.card, "的目标");
			}
		},
		subSkill: { used: { charlotte: true, onremove: true } },
	},
	fakezhuosheng: {
		hiddenCard(player, name) {
			return player.countCards("hs") > 1 && get.type(name) == "basic" && lib.inpile.includes(name) && !player.getStorage("fakezhuosheng_count").includes(name);
		},
		audio: "zhuosheng",
		enable: "chooseToUse",
		filter(event, player) {
			if (event.type == "wuxie") {
				return false;
			}
			if (player.countCards("hs") < 2) {
				return false;
			}
			return get
				.inpileVCardList(info => {
					const name = info[2];
					return !player.getStorage("fakezhuosheng_count").includes(name) && get.type(name) == "basic";
				})
				.some(card => event.filterCard({ name: card[2], nature: card[3] }, player, event));
		},
		chooseButton: {
			dialog(event, player) {
				var list = get
					.inpileVCardList(info => {
						const name = info[2];
						return !player.getStorage("fakezhuosheng_count").includes(name) && get.type(name) == "basic";
					})
					.filter(card => event.filterCard({ name: card[2], nature: card[3] }, player, event));
				return ui.create.dialog("擢升", [list, "vcard"], "hidden");
			},
			check(button) {
				var player = _status.event.player;
				var evt = _status.event.getParent();
				var name = button.link[2],
					card = { name: name, nature: button.link[3] };
				if (name == "shan") {
					return 2;
				}
				if (evt.type == "dying") {
					if (get.attitude(player, evt.dying) < 2) {
						return 0;
					}
					if (name == "jiu") {
						return 2.1;
					}
					return 1.9;
				}
				if (evt.type == "phase") {
					if (button.link[2] == "jiu") {
						if (player.getUseValue({ name: "jiu" }) <= 0) {
							return 0;
						}
						var cards = player.getCards("hs", cardx => get.value(cardx) < 8);
						cards.sort((a, b) => get.value(a) - get.value(b));
						if (cards.some(cardx => get.name(cardx) == "sha" && !cards.slice(0, 2).includes(cardx))) {
							return player.getUseValue({ name: "jiu" });
						}
						return 0;
					}
					return player.getUseValue(card) / 4;
				}
				return 1;
			},
			backup(links, player) {
				return {
					audio: "zhuosheng",
					filterCard: true,
					selectCard: [2, Infinity],
					position: "hs",
					complexCard: true,
					check(card) {
						if (ui.selected.cards.length >= 2) {
							return 0;
						}
						return 8 - get.value(card);
					},
					popname: true,
					viewAs: {
						name: links[0][2],
						nature: links[0][3],
					},
					precontent() {
						var name = event.result.card.name;
						player.addTempSkill("fakezhuosheng_count");
						player.markAuto("fakezhuosheng_count", [name]);
						player
							.when("yingbian")
							.filter(evt => evt.skill == "fakezhuosheng_backup")
							.then(() => {
								if (trigger.cards && trigger.cards.length) {
									let cards = trigger.cards.slice();
									cards = cards.filter(i => get.is.yingbian(i));
									if (cards.length) {
										if (!Array.isArray(trigger.temporaryYingbian)) {
											trigger.temporaryYingbian = [];
										}
										trigger.temporaryYingbian.add("force");
										trigger.temporaryYingbian.addArray(
											Array.from(lib.yingbian.effect.keys()).filter(value => {
												return cards.some(card => get.cardtag(card, `yingbian_${value}`));
											})
										);
									}
								}
							});
					},
				};
			},
			prompt(links, player) {
				var name = links[0][2];
				var nature = links[0][3];
				return "将至少两张手牌当作" + (get.translation(nature) || "") + get.translation(name) + "使用";
			},
		},
		ai: {
			order(item, player) {
				if (player && _status.event.type == "phase") {
					var add = false,
						max = 0;
					var names = lib.inpile.filter(name => get.type(name) == "basic" && !player.getStorage("fakezhuosheng_count").includes(name));
					if (names.includes("sha")) {
						add = true;
					}
					names = names.map(namex => {
						return { name: namex };
					});
					if (add) {
						lib.inpile_nature.forEach(nature => names.push({ name: "sha", nature: nature }));
					}
					names.forEach(card => {
						if (player.getUseValue(card) > 0) {
							var temp = get.order(card);
							if (card.name == "jiu") {
								var cards = player.getCards("hs", cardx => get.value(cardx) < 8);
								cards.sort((a, b) => get.value(a) - get.value(b));
								if (!cards.some(cardx => get.name(cardx) == "sha" && !cards.slice(0, 2).includes(cardx))) {
									temp = 0;
								}
							}
							if (temp > max) {
								max = temp;
							}
						}
					});
					if (max > 0) {
						max -= 0.001;
					}
					return max;
				}
				return 0.5;
			},
			respondShan: true,
			respondSha: true,
			fireAttack: true,
			skillTagFilter(player, tag, arg) {
				if (arg == "respond") {
					return false;
				}
				const name = tag == "respondShan" ? "shan" : "sha";
				return get.info("fakezhuosheng").hiddenCard(player, name);
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
			count: { charlotte: true, onremove: true },
			backup: {},
		},
	},
	fakejuhou: {
		zhenfa: "inline",
		trigger: { global: "useCardToTargeted" },
		filter(event, player) {
			return (event.card.name == "sha" || get.type(event.card) == "trick") && event.target.inline(player);
		},
		logTarget: "target",
		async content(event, trigger, player) {
			const target = trigger.target;
			const {
				result: { bool, cards },
			} = await target.chooseCard("he", [1, Infinity], "是否将任意张牌置于武将牌上？").set("ai", card => {
				const trigger = get.event().getTrigger(),
					player = trigger.target;
				if (card.name == "baiyin" && get.position(card) == "e" && player.isDamaged() && get.recoverEffect(player, player, player) > 0) {
					return 1;
				}
				if (["guohe", "shunshou", "zhujinqiyuan", "chuqibuyi", "huogong"].includes(trigger.card.name) && get.effect(player, trigger.card, trigger.player, player) < 0) {
					return 1;
				}
				return 0;
			});
			if (bool) {
				target.addToExpansion(cards, "giveAuto", target).gaintag.add("fakejuhou");
				target.addSkill("fakejuhou");
				target
					.when({ global: "useCardAfter" })
					.filter(evt => evt == trigger.getParent())
					.then(() => {
						const cards = player.getExpansions("fakejuhou");
						if (cards.length) {
							player.gain(cards, "gain2");
						}
					});
			}
		},
		intro: {
			content: "expansion",
			markcount: "expansion",
		},
	},
	gznaxiang: {
		audio: "naxiang",
		inherit: "naxiang",
	},
	fakecaiwang: {
		audio: "caiwang",
		trigger: { player: "loseAfter" },
		filter(event, player) {
			const evt = event.getParent(2);
			if (evt.name != "yingbianZhuzhan") {
				return false;
			}
			const color = (get.color(evt.card) == get.color(event.cards[0])).toString();
			if (
				color == "true" &&
				!game.hasPlayer(target => {
					return target != player && target.countCards("he");
				})
			) {
				return false;
			}
			return !player.getStorage("fakecaiwang_used").includes(color);
		},
		async cost(event, trigger, player) {
			const color = (get.color(trigger.getParent(2).card) == get.color(trigger.cards[0])).toString();
			if (color == "false") {
				//event.result=await player.chooseBool(get.prompt('fakecaiwang'),'摸一张牌').forResult();
				event.result = { bool: true };
			} else {
				event.result = await player
					.chooseTarget(get.prompt("fakecaiwang"), "弃置一名其他角色的一张牌", (card, player, target) => {
						return target != player && target.countCards("he");
					})
					.set("ai", target => {
						const player = get.event("player");
						return get.effect(target, { name: "guohe_copy2" }, player, player);
					})
					.forResult();
			}
		},
		async content(event, trigger, player) {
			const color = (get.color(trigger.getParent(2).card) == get.color(trigger.cards[0])).toString();
			player.addTempSkill("fakecaiwang_used");
			player.markAuto("fakecaiwang_used", [color]);
			if (color == "false") {
				await player.draw();
			} else {
				await player.discardPlayerCard(event.targets[0], "he", true);
			}
		},
		group: "fakecaiwang_zhuzhan",
		subSkill: {
			used: {
				charlotte: true,
				onremove: true,
			},
			zhuzhan: {
				trigger: { player: "yingbianZhuzhanBegin" },
				forced: true,
				locked: false,
				popup: false,
				firstDo: true,
				content() {
					trigger.setContent(get.info("fakecaiwang").yingbian);
				},
			},
		},
		yingbian() {
			"step 0";
			event._global_waiting = true;
			event.send = (player, card, source, targets, id, id2, yingbianZhuzhanAI, skillState) => {
				if (skillState) {
					player.applySkills(skillState);
				}
				var type = get.type2(card),
					str = get.translation(source);
				if (targets && targets.length) {
					str += `对${get.translation(targets)}`;
				}
				str += `使用了${get.translation(card)}，是否弃置一张${get.translation(type)}为其助战？`;
				player.chooseCard({
					filterCard: (card, player) => get.type2(card) == type && lib.filter.cardDiscardable(card, player),
					prompt: str,
					position: "h",
					_global_waiting: true,
					id: id,
					id2: id2,
					ai:
						typeof yingbianZhuzhanAI == "function"
							? yingbianZhuzhanAI(player, card, source, targets)
							: cardx => {
								var info = get.info(card);
								if (info && info.ai && info.ai.yingbian) {
									var ai = info.ai.yingbian(card, source, targets, player);
									if (!ai) {
										return 0;
									}
									return ai - get.value(cardx);
								} else if (get.attitude(player, source) <= 0) {
									return 0;
								}
								return 5 - get.value(cardx);
							},
				});
				if (!game.online) {
					return;
				}
				_status.event._resultid = id;
				game.resume();
			};
			"step 1";
			var type = get.type2(card);
			event.list = game.filterPlayer(current => current.countCards("h") && (_status.connectMode || current.hasCard(cardx => get.type2(cardx) == type, "h"))).sortBySeat(_status.currentPhase || player);
			event.id = get.id();
			"step 2";
			if (!event.list.length) {
				event.finish();
			} else if (_status.connectMode && (event.list[0].isOnline() || event.list[0] == game.me)) {
				event.goto(4);
			} else {
				event.send((event.current = event.list.shift()), event.card, player, trigger.targets, event.id, trigger.parent.id, trigger.yingbianZhuzhanAI);
			}
			"step 3";
			if (result.bool) {
				event.zhuzhanresult = event.current;
				event.zhuzhanresult2 = result;
				if (event.current != game.me) {
					game.delayx();
				}
				event.goto(8);
			} else {
				event.goto(2);
			}
			"step 4";
			var id = event.id,
				sendback = (result, player) => {
					if (result && result.id == id && !event.zhuzhanresult && result.bool) {
						event.zhuzhanresult = player;
						event.zhuzhanresult2 = result;
						game.broadcast("cancel", id);
						if (_status.event.id == id && _status.event.name == "chooseCard" && _status.paused) {
							return () => {
								event.resultOL = _status.event.resultOL;
								ui.click.cancel();
								if (ui.confirm) {
									ui.confirm.close();
								}
							};
						}
					} else if (_status.event.id == id && _status.event.name == "chooseCard" && _status.paused) {
						return () => (event.resultOL = _status.event.resultOL);
					}
				},
				withme = false,
				withol = false,
				list = event.list;
			for (var i = 0; i < list.length; i++) {
				var current = list[i];
				if (current.isOnline()) {
					withol = true;
					current.wait(sendback);
					current.send(event.send, current, event.card, player, trigger.targets, event.id, trigger.parent.id, trigger.yingbianZhuzhanAI, get.skillState(current));
					list.splice(i--, 1);
				} else if (current == game.me) {
					withme = true;
					event.send(current, event.card, player, trigger.targets, event.id, trigger.parent.id, trigger.yingbianZhuzhanAI);
					list.splice(i--, 1);
				}
			}
			if (!withme) {
				event.goto(6);
			}
			if (_status.connectMode && (withme || withol)) {
				game.players.forEach(value => {
					if (value != player) {
						value.showTimer();
					}
				});
			}
			event.withol = withol;
			"step 5";
			if (!result || !result.bool || event.zhuzhanresult) {
				return;
			}
			game.broadcast("cancel", event.id);
			event.zhuzhanresult = game.me;
			event.zhuzhanresult2 = result;
			"step 6";
			if (event.withol && !event.resultOL) {
				game.pause();
			}
			"step 7";
			game.players.forEach(value => value.hideTimer());
			"step 8";
			if (event.zhuzhanresult) {
				var target = event.zhuzhanresult;
				if (target == player && player.hasSkill("fakecaiwang")) {
					player.logSkill("fakecaiwang");
				}
				target.line(player, "green");
				target.discard(event.zhuzhanresult2.cards).discarder = target;
				if (typeof event.afterYingbianZhuzhan == "function") {
					event.afterYingbianZhuzhan(event, trigger);
				}
				var yingbianCondition = event.name.slice(8).toLowerCase(),
					yingbianConditionTag = `yingbian_${yingbianCondition}_tag`;
				target.popup(yingbianConditionTag, lib.yingbian.condition.color.get(yingbianCondition));
				game.log(target, "响应了", '<span class="bluetext">' + (target == player ? "自己" : get.translation(player)) + "</span>", "发起的", yingbianConditionTag);
				target.addExpose(0.2);
				event.result = {
					bool: true,
				};
			} else {
				event.result = {
					bool: false,
				};
			}
		},
	},
	fakenaxiang: {
		audio: "naxiang",
		trigger: {
			source: "damageSource",
			player: "damageEnd",
		},
		filter(event, player) {
			if (!event.source || !event.player || !event.source.isIn() || !event.player.isIn() || !event.source.isEnemyOf(event.player)) {
				return false;
			}
			return !player.getStorage("fakenaxiang").includes(get.info("fakenaxiang").logTarget(event, player));
		},
		logTarget(event, player) {
			return event.source == player ? event.player : event.source;
		},
		forced: true,
		async content(event, trigger, player) {
			const target = get.info("fakenaxiang").logTarget(trigger, player);
			const {
				result: { junling, targets },
			} = await player.chooseJunlingFor(target);
			const {
				result: { index },
			} = await target.chooseJunlingControl(player, junling, targets).set("prompt", "纳降：是否执行军令？");
			if (index == 0) {
				await target.carryOutJunling(player, junling, targets);
			} else {
				if (!player.storage.fakenaxiang) {
					player.when(["phaseBegin", "die"]).then(() => {
						player.unmarkSkill("fakenaxiang");
						delete player.storage.fakenaxiang;
					});
				}
				player.markAuto("fakenaxiang", [target]);
			}
		},
		onremove: true,
		marktext: '<span style="text-decoration: line-through;">降</span>',
		intro: { content: "无法对$发动【纳降】" },
		group: ["fakenaxiang_discard", "fakenaxiang_yingbian"],
		subSkill: {
			discard: {
				trigger: { player: "chooseCardBegin" },
				filter(event, player) {
					return event.getParent().name == "yingbianZhuzhan";
				},
				forced: true,
				popup: false,
				firstDo: true,
				content() {
					trigger.filterCard = lib.filter.cardDiscardable;
				},
			},
			yingbian: {
				trigger: { player: "yingbian" },
				filter(event, player) {
					if (event.card.yingbian) {
						return false;
					}
					const temporaryYingbian = event.temporaryYingbian || [],
						card = event.card;
					if (temporaryYingbian.includes("force") || get.cardtag(card, "yingbian_force")) {
						return true;
					}
					return get.yingbianConditions(event.card).length;
				},
				forced: true,
				popup: false,
				firstDo: true,
				content() {
					"step 0";
					trigger.card.yingbian = true;
					event.card = trigger.card;
					event.temporaryYingbian = trigger.temporaryYingbian || [];
					if (event.temporaryYingbian.includes("force") || get.cardtag(event.card, "yingbian_force") || trigger.forceYingbian || player.hasSkillTag("forceYingbian")) {
						player.popup("yingbian_force_tag", lib.yingbian.condition.color.get("force"));
						game.log(player, "触发了", event.card, "的应变条件");
						event._result = { bool: true };
					} else {
						trigger.yingbianZhuzhanAI = (player, card, source, targets) => cardx => {
							if (get.attitude(player, source) <= 0) {
								return 0;
							}
							var info = get.info(card),
								num = 0;
							if (info && info.ai && info.ai.yingbian) {
								var ai = info.ai.yingbian(card, source, targets, player);
								if (ai) {
									num = ai;
								}
							}
							return Math.max(num, 6) - get.value(cardx);
						};
						lib.yingbian.condition.complex.get("zhuzhan")(trigger);
					}
					"step 1";
					if (!result.bool) {
						return;
					}
					var yingbianEffectExecuted = false;
					lib.yingbian.effect.forEach((value, key) => {
						if (!event.temporaryYingbian.includes(key) && !get.cardtag(card, `yingbian_${key}`)) {
							return;
						}
						game.yingbianEffect(trigger, value);
						if (!yingbianEffectExecuted) {
							yingbianEffectExecuted = true;
						}
					});
					if (!yingbianEffectExecuted) {
						var defaultYingbianEffect = get.defaultYingbianEffect(card);
						if (lib.yingbian.effect.has(defaultYingbianEffect)) {
							game.yingbianEffect(trigger, lib.yingbian.effect.get(defaultYingbianEffect));
							if (!yingbianEffectExecuted) {
								yingbianEffectExecuted = true;
							}
						}
					}
					if (yingbianEffectExecuted) {
						player.addTempSkill("yingbian_changeTarget");
					}
				},
			},
		},
	},

	//杨芷
	gzwanyi: {
		audio: "wanyi",
		enable: "phaseUse",
		filter(event, player) {
			if (player.getStorage("gzwanyi2").length >= 4) {
				return false;
			}
			if (_status.mode == "yingbian") {
				return player.hasCard(function (i) {
					return get.is.yingbian(i);
				}, "hs");
			}
			return player.hasCard(function (card) {
				return card.hasTag("lianheng");
			}, "hs");
		},
		chooseButton: {
			dialog(event, player) {
				var list = ["lianjunshengyan", "huoshaolianying", "xietianzi", "lulitongxin"];
				if (_status.mode == "yingbian") {
					list = ["zhujinqiyuan", "chuqibuyi", "shuiyanqijunx", "dongzhuxianji"];
				}
				list.removeArray(player.getStorage("gzwanyi2"));
				return ui.create.dialog("婉嫕", [list, "vcard"], "hidden");
			},
			filter(button, player) {
				return lib.filter.filterCard({ name: button.link[2] }, player, _status.event.getParent());
			},
			check(button) {
				return _status.event.player.getUseValue({ name: button.link[2] });
			},
			backup(links) {
				return {
					audio: "wanyi",
					popname: true,
					viewAs: {
						name: links[0][2],
					},
					filterCard(card) {
						if (_status.mode == "yingbian") {
							return get.is.yingbian(card);
						}
						return card.hasTag("lianheng");
					},
					check(card) {
						return 1 / Math.max(1, get.value(card));
					},
					position: "hs",
					onuse(links, player) {
						if (!player.storage.gzwanyi2) {
							player.storage.gzwanyi2 = [];
						}
						player.storage.gzwanyi2.add(links.card.name);
						player.addTempSkill("gzwanyi2");
					},
				};
			},
			prompt(links) {
				if (_status.mode == "yingbian") {
					return "将一张应变牌当做" + get.translation(links[0][2]) + "使用";
				}
				return "将一张合纵牌当做" + get.translation(links[0][2]) + "使用";
			},
		},
		subSkill: { backup: {} },
		ai: { order: 8, result: { player: 1 } },
	},
	gzwanyi2: { onremove: true },
	gzmaihuo: {
		audio: "maihuo",
		limited: true,
		trigger: { global: "useCardToTarget" },
		logTarget: "player",
		filter(event, player) {
			return event.card.name == "sha" && event.target.isIn() && event.target.isFriendOf(player);
		},
		preHidden: true,
		skillAnimation: true,
		animationColor: "thunder",
		check(event, player) {
			var source = event.player,
				targets = event.targets,
				card = event.card;
			for (var target of targets) {
				if (target.hasShan() || get.effect(target, card, source, player) >= 0) {
					continue;
				}
				if (player.hp <= 1 || target.hp <= (event.getParent().baseDamage || 1)) {
					return true;
				}
			}
			return false;
		},
		content() {
			player.awakenSkill("gzmaihuo");
			trigger.targets.length = 0;
			trigger.getParent().triggeredTargets2.length = 0;
			player.addSkill("gzmaihuo_effect");
			player.markAuto("gzmaihuo_effect", [trigger.player]);
			trigger.player.addMark("gzmaihuo_mark", 1, false);
		},
		subSkill: {
			effect: {
				audio: "maihuo",
				trigger: { global: "phaseBegin" },
				forced: true,
				charlotte: true,
				popup: false,
				filter(event, player) {
					return player.getStorage("gzmaihuo_effect").includes(event.player) && event.player.canUse("sha", player, false);
				},
				content() {
					"step 0";
					var target = trigger.player;
					player.unmarkAuto("gzmaihuo_effect", [target]);
					target.removeMark("gzmaihuo_mark", 1, false);
					target.useCard({ name: "sha", isCard: true }, player, "gzmaihuo_effect", false);
					"step 1";
					if (!player.getStorage("gzmaihuo_effect").length) {
						player.removeSkill("gzmaihuo_effect");
					}
				},
				group: "gzmaihuo_remove",
			},
			remove: {
				trigger: { player: "damageBegin2" },
				forced: true,
				filter(event, player) {
					return event.card && event.card.name == "sha" && event.getParent().skill == "gzmaihuo_effect";
				},
				content() {
					trigger.cancel();
					player.draw(2);
					if (player.checkMainSkill("gzmaihuo", false)) {
						player.removeCharacter(0);
					} else if (player.checkViceSkill("gzmaihuo", false)) {
						player.changeVice();
					}
				},
			},
			mark: {
				marktext: "祸",
				intro: {
					content: "mark",
					onunmark: true,
				},
			},
		},
	},
	//羊徽瑜
	gzcaiyuan: {
		audio: "caiyuan",
		trigger: { player: "phaseJieshuBegin" },
		forced: true,
		preHidden: true,
		filter(event, player) {
			var num1 = player.countCards("h"),
				num2 = num1;
			player.getHistory("gain", function (evt) {
				num2 -= evt.cards.length;
			});
			player.getHistory("lose", function (evt) {
				if (evt.hs) {
					num2 += evt.hs.length;
				}
			});
			return num1 >= num2;
		},
		content() {
			player.chooseDrawRecover(2, true);
		},
	},
	//左棻
	gzzhaosong: {
		audio: "zhaosong",
		enable: "phaseUse",
		preHidden: ["gzzhaosong_dying", "gzzhaosong_sha"],
		filter(event, player) {
			return !player.getStorage("gzzhaosong").includes("效果②") && game.hasPlayer(current => lib.skill.gzzhaosong.filterTarget(null, player, current));
		},
		filterTarget(card, player, target) {
			return target != player && (target.isUnseen(2) || target.countCards("h") > 0);
		},
		promptfunc: () => "出牌阶段，你可观看一名其他角色的所有暗置武将牌和手牌，然后可以获得其区域内的一张牌。",
		content() {
			player.markAuto("gzzhaosong", ["效果②"]);
			if (target.isUnseen(2)) {
				player.viewCharacter(target, 2);
			}
			if (target.countCards("hej") > 0) {
				player.gainPlayerCard(target, "hej", "visible");
			}
		},
		ai: {
			order: 11,
			result: {
				player(player, target) {
					return get.effect(target, { name: "zhibi" }, player, player) + get.effect(target, { name: "shunshou_copy" }, player, player);
				},
			},
		},
		group: ["gzzhaosong_dying", "gzzhaosong_sha"],
		subSkill: {
			dying: {
				audio: "zhaosong",
				trigger: { global: "dying" },
				logTarget: "player",
				filter(event, player) {
					return !player.getStorage("gzzhaosong").includes("效果①") && event.player.isDying() && event.player.hp <= 0;
				},
				prompt2: "令该角色回复至2点体力并摸一张牌",
				check(event, player) {
					return event.player.isFriendOf(player) && get.attitude(player, event.player) > 0;
				},
				content() {
					player.markAuto("gzzhaosong", ["效果①"]);
					var target = trigger.player,
						num = 2 - target.hp;
					if (num > 0) {
						target.recover(num);
					}
					target.draw();
				},
			},
			sha: {
				audio: "zhaosong",
				trigger: { global: "useCard2" },
				direct: true,
				filter(event, player) {
					if (event.card.name != "sha" || player.getStorage("gzzhaosong").includes("效果③")) {
						return false;
					}
					return game.hasPlayer(function (current) {
						return !event.targets.includes(current) && lib.filter.filterTarget(event.card, event.player, current);
					});
				},
				content() {
					"step 0";
					player
						.chooseTarget([1, 2], get.prompt("gzzhaosong"), "为" + get.translation(trigger.card) + "增加至多两个目标", function (card, player, target) {
							var event = _status.event.getTrigger();
							return !event.targets.includes(target) && lib.filter.filterTarget(event.card, event.player, target);
						})
						.set("ai", function (target) {
							var event = _status.event.getTrigger();
							return get.effect(target, event.card, event.player, _status.event.player);
						})
						.set(
							"goon",
							game.countPlayer(function (current) {
								return !trigger.targets.includes(current) && lib.filter.filterTarget(trigger.card, trigger.player, current) && get.effect(current, trigger.card, trigger.player, player) > 0;
							}) >=
							Math.min(
								2,
								game.countPlayer(function (current) {
									return !trigger.targets.includes(current) && lib.filter.filterTarget(trigger.card, trigger.player, current);
								})
							)
						)
						.setHiddenSkill("gzzhaosong_sha");
					"step 1";
					if (result.bool) {
						if (!event.isMine() && !event.isOnline()) {
							game.delayx();
						}
					} else {
						event.finish();
					}
					"step 2";
					var targets = result.targets;
					player.markAuto("gzzhaosong", ["效果③"]);
					player.logSkill("gzzhaosong_sha", targets);
					trigger.targets.addArray(targets);
				},
			},
		},
	},
	gzlisi: {
		audio: "lisi",
		trigger: { global: "dieAfter" },
		filter(event, player) {
			return event.player.isFriendOf(player) && player.getStorage("gzzhaosong").length > 0;
		},
		direct: true,
		content() {
			"step 0";
			var list = player.getStorage("gzzhaosong").slice(0);
			list.push("cancel2");
			player.chooseControl(list).set("prompt", get.prompt("gzlisi")).set("prompt2", "恢复〖诏颂〗的一个已发动的选项");
			"step 1";
			if (result.control != "cancel2") {
				player.logSkill("gzlisi");
				player.unmarkAuto("gzzhaosong", [result.control]);
			}
		},
	},
	//杨艳
	gzxuanbei: {
		audio: "xuanbei",
		trigger: { player: "showCharacterAfter" },
		filter(event, player) {
			return (
				!player.storage.gzxuanbei &&
				event.toShow.some(name => {
					return get.character(name, 3).includes("gzxuanbei");
				})
			);
		},
		forced: true,
		locked: false,
		content() {
			"step 0";
			player.storage.gzxuanbei = true;
			var cards = [];
			while (cards.length < 2) {
				var card = get.cardPile2(function (card) {
					if (cards.includes(card)) {
						return false;
					}
					return card.hasTag("lianheng") || get.is.yingbian(card);
				});
				if (!card) {
					break;
				} else {
					cards.push(card);
				}
			}
			if (cards.length) {
				player.gain(cards, "gain2");
			}
			if (cards.length < 2) {
				player.draw(2 - cards.length);
			}
			"step 1";
			player.addTempSkill("gzxuanbei_effect");
		},
		group: "gzxuanbei_change",
		subSkill: {
			effect: {
				trigger: { player: "useCard" },
				forced: true,
				popup: false,
				charlotte: true,
				filter(event, player) {
					return get.cardtag(event.card, "lianheng");
				},
				content() {
					player.draw();
				},
				ai: { forceYingbian: true },
				mark: true,
				intro: { content: "使用应变牌时直接获得强化，使用合纵牌时摸一张牌。" },
			},
			change: {
				audio: "xuanbei",
				trigger: { player: "die" },
				direct: true,
				forceDie: true,
				skillAnimation: true,
				animationColor: "thunder",
				content() {
					"step 0";
					player
						.chooseTarget(get.prompt("gzxuanbei"), "令一名其他角色变更副将", lib.filter.notMe)
						.set("forceDie", true)
						.set("ai", function (target) {
							var player = _status.event.player;
							var rank = get.guozhanRank(target.name2, target) <= 3;
							var att = get.attitude(player, target);
							if (att > 0) {
								return (4 - rank) * att;
							}
							return -(rank - 6) * att;
						});
					"step 1";
					if (result.bool) {
						var target = result.targets[0];
						player.logSkill("gzxuanbei_change", target);
						game.delayx();
						target.changeVice();
					}
				},
			},
		},
	},
	//司马师
	gzyimie: {
		audio: "yimie",
		inherit: "yimie",
		mainSkill: true,
		init(player) {
			if (player.checkMainSkill("gzyimie")) {
				player.removeMaxHp(2);
			}
		},
	},
	gztairan: {
		audio: "tairan",
		trigger: { player: "phaseUseBegin" },
		check(event, player) {
			return (
				player.isDamaged() &&
				player.hasCard(function (card) {
					return 5.5 - get.value(card);
				}, "he")
			);
		},
		content() {
			"step 0";
			var list = [],
				num = 0;
			if (
				player.isHealthy() ||
				!player.hasCard(function (card) {
					return lib.filter.cardDiscardable(card, player, "gztairan");
				}, "he")
			) {
				num = 1;
			}
			event.num = num;
			for (var i = num; i <= player.hp; i++) {
				list.push(i + "点");
			}
			player.chooseControl(list).set("prompt", "###请先失去任意点体力###此回合结束时，你将恢复等量的体力");
			"step 1";
			var num1 = result.index + num;
			event.num1 = num1;
			if (num1 > 0) {
				player.loseHp(num1);
			}
			"step 2";
			if (
				player.isDamaged() &&
				player.hasCard(function (card) {
					return lib.filter.cardDiscardable(card, player, "gztairan");
				}, "he")
			) {
				var next = player.chooseToDiscard("he", [1, player.getDamagedHp()], "然后请弃置任意张牌", "此回合结束时，你将摸等量的牌。").set("ai", function (card) {
					return 5.5 - get.value(card);
				});
				if (event.num1 == 0) {
					next.set("forced", true);
				}
			}
			"step 3";
			var num2 = 0;
			if (result.bool) {
				num2 = result.cards.length;
			}
			var storage = [event.num1, num2];
			player.addTempSkill("gztairan_effect");
			player.storage.gztairan_effect = storage;
		},
		subSkill: {
			effect: {
				audio: "tairan",
				trigger: { player: "phaseEnd" },
				filter(event, player) {
					var storage = player.storage.gztairan_effect;
					return storage && storage.length == 2 && (storage[1] > 0 || player.isDamaged());
				},
				forced: true,
				charlotte: true,
				onremove: true,
				content() {
					var storage = player.storage.gztairan_effect;
					if (storage[0] > 0) {
						player.recover(storage[0]);
					}
					if (storage[1] > 0) {
						player.draw(storage[1]);
					}
				},
			},
		},
	},
	//杜预
	gzsanchen: {
		audio: "sanchen",
		enable: "phaseUse",
		filter(event, player) {
			var stat = player.getStat("sanchen");
			return game.hasPlayer(function (current) {
				return !stat || !stat.includes(current);
			});
		},
		filterTarget(card, player, target) {
			var stat = player.getStat("sanchen");
			return !stat || !stat.includes(target);
		},
		usable: 1,
		content() {
			"step 0";
			if (!player._fakesanchen) {
				player._fakesanchen = true;
				player.when({ global: "phaseAfter" }).then(() => {
					delete player._fakesanchen;
					if (player.hasMark("gzsanchen")) {
						player.removeMark("gzsanchen", player.countMark("gzsanchen"), false);
					}
				});
			}
			var stat = player.getStat();
			if (!stat.sanchen) {
				stat.sanchen = [];
			}
			stat.sanchen.push(target);
			target.draw(3);
			"step 1";
			if (!target.countCards("he")) {
				event.finish();
			} else {
				target.chooseToDiscard("he", true, 3).set("ai", function (card) {
					var list = ui.selected.cards.map(function (i) {
						return get.type2(i);
					});
					if (!list.includes(get.type2(card))) {
						return 7 - get.value(card);
					}
					return -get.value(card);
				});
			}
			"step 2";
			if (result.bool && result.cards && result.cards.length) {
				var list = [];
				for (var i of result.cards) {
					list.add(get.type2(i));
				}
				if (list.length == result.cards.length) {
					target.draw();
					player.getStat("skill").gzsanchen--;
					player.addMark("gzsanchen", 1, false);
				}
			} else {
				target.draw();
				player.getStat("skill").gzsanchen--;
				player.addMark("gzsanchen", 1, false);
			}
		},
		ai: {
			order: 9,
			threaten: 1.7,
			result: {
				target(player, target) {
					if (target.hasSkillTag("nogain")) {
						return 0.1;
					}
					return Math.sqrt(target.countCards("he"));
				},
			},
		},
		marktext: "陈",
		intro: {
			name2: "陈",
			content: "mark",
		},
	},
	gzpozhu: {
		audio: "pozhu",
		enable: "phaseUse",
		mainSkill: true,
		init(player) {
			if (player.checkMainSkill("gzpozhu")) {
				player.removeMaxHp();
			}
		},
		viewAsFilter(player) {
			return player.countMark("gzsanchen") > 0 && player.countCards("hs") > 0;
		},
		viewAs: { name: "chuqibuyi" },
		filterCard: true,
		position: "hs",
		check(card) {
			return 7 - get.value(card);
		},
		onuse(result, player) {
			player.removeMark("gzsanchen", 1, false);
		},
	},
	//钟琰
	gzbolan: {
		audio: "bolan",
		global: "gzbolan_global",
		enable: "phaseUse",
		usable: 1,
		content() {
			"step 0";
			if ((event.num && event.num > 0) || !_status.characterlist.length) {
				event.finish();
				return;
			}
			var character = _status.characterlist.randomGet();
			var groups,
				double = get.is.double(character, true);
			if (double) {
				groups = double.slice(0);
			} else {
				groups = [lib.character[character][1]];
			}
			event.groups = groups;
			event.videoId = lib.status.videoId++;
			game.broadcastAll(
				function (player, id, character) {
					ui.create.dialog(get.translation(player) + "发动了【博览】", [[character], "character"]).videoId = id;
				},
				player,
				event.videoId,
				character
			);
			game.delay(3);
			"step 1";
			game.broadcastAll("closeDialog", event.videoId);
			var list1 = ["wei", "shu", "wu", "qun", "jin"],
				list2 = ["gz_qice", "tiaoxin", "gz_zhiheng", "new_chuli", "gzsanchen"];
			var skills = [];
			for (var i = 0; i < list1.length; i++) {
				if (event.groups.includes(list1[i])) {
					skills.push(list2[i]);
				}
			}
			if (!skills.length) {
				event.finish();
			} else if (skills.length == 1) {
				event._result = { control: skills[0] };
			} else {
				player.chooseControl(skills).set("prompt", "选择获得一个技能直到回合结束");
			}
			"step 2";
			var skill = result.control;
			player.addTempSkills(skill);
			player.popup(skill);
		},
		derivation: ["gz_qice", "tiaoxin", "gz_zhiheng", "new_chuli", "gzsanchen"],
		ai: {
			order: 10,
			result: { player: 1 },
		},
		subSkill: {
			global: {
				inherit: "gzbolan",
				filter(event, player) {
					return (
						!player.hasSkill("gzbolan", true) &&
						game.hasPlayer(function (current) {
							return current != player && current.hasSkill("gzbolan");
						})
					);
				},
				selectTarget: -1,
				filterTarget(card, player, target) {
					return target != player && target.hasSkill("gzbolan");
				},
				contentAfter() {
					player.loseHp();
				},
				ai: {
					order: 10,
					result: {
						player(player, target) {
							if (get.effect(player, { name: "losehp" }, player, player) > 0) {
								return 3;
							}
							if (player.isHealthy()) {
								return 1;
							}
							return -1;
						},
					},
				},
			},
		},
	},
	//司马昭
	gzchoufa: {
		audio: "choufa",
		inherit: "choufa",
		content() {
			"step 0";
			player.choosePlayerCard(target, "h", true);
			"step 1";
			player.showCards(result.cards, get.translation(player) + "对" + get.translation(target) + "发动了【筹伐】");
			var type = get.type2(result.cards[0], target),
				hs = target.getCards("h", function (card) {
					return card != result.cards[0] && get.type2(card, target) != type;
				});
			if (hs.length) {
				target.addGaintag(hs, "xinchoufa");
				target.addTempSkill("xinchoufa2");
			}
		},
	},
	//张春华
	gzhuishi: {
		audio: "huishi",
		trigger: { player: "phaseDrawBegin1" },
		filter(event, player) {
			return ui.discardPile.childNodes.length > 0;
		},
		preHidden: true,
		prompt() {
			return get.prompt("huishi") + "（可观看牌数：" + lib.skill.gzhuishi.getNum() + "）";
		},
		check(event, player) {
			return lib.skill.gzhuishi.getNum() > 3;
		},
		getNum() {
			var list = [];
			list.push(ui.discardPile.lastChild);
			if (list[0].previousSibling) {
				list.push(list[0].previousSibling);
			}
			var num = 0;
			for (var i of list) {
				var name = get.translation(i.name);
				if (name == "挟令") {
					name = "挟天子以令诸侯";
				}
				num += name.length;
			}
			return num;
		},
		content() {
			"step 0";
			trigger.changeToZero();
			var cards = game.cardsGotoOrdering(get.cards(lib.skill.gzhuishi.getNum())).cards;
			var num = Math.ceil(cards.length / 2);
			var next = player.chooseToMove("慧识：将" + get.cnNumber(num) + "张牌置于牌堆底并获得其余的牌", true);
			next.set("list", [["牌堆顶的展示牌", cards], ["牌堆底"]]);
			next.set("filterMove", function (from, to, moved) {
				if (moved[0].includes(from) && to == 1) {
					return moved[1].length < _status.event.num;
				}
				return true;
			});
			next.set("filterOk", function (moved) {
				return moved[1].length == _status.event.num;
			});
			next.set("num", num);
			next.set("processAI", function (list) {
				var cards = list[0][1].slice(0).sort(function (a, b) {
					return get.value(b) - get.useful(a);
				});
				return [cards, cards.splice(cards.length - _status.event.num)];
			});
			"step 1";
			if (result.bool) {
				var list = result.moved;
				if (list[0].length) {
					player.gain(list[0], "gain2");
				}
				while (list[1].length) {
					ui.cardPile.appendChild(list[1].shift().fix());
				}
			}
		},
	},
	gzqingleng: {
		audio: 2,
		trigger: { global: "phaseEnd" },
		direct: true,
		preHidden: true,
		filter(event, player) {
			var target = event.player;
			return target != player && target.isIn() && target.isUnseen(2) && player.countCards("he") > 0 && player.canUse({ name: "sha", nature: "ice" }, target, false);
		},
		content() {
			"step 0";
			player
				.chooseCard("he", get.prompt("gzqingleng", trigger.player), "将一张牌当做冰【杀】对其使用", function (card, player) {
					return player.canUse(get.autoViewAs({ name: "sha", nature: "ice" }, [card]), _status.event.target, false);
				})
				.set("target", trigger.player)
				.set("ai", function (card) {
					if (get.effect(_status.event.target, get.autoViewAs({ name: "sha", nature: "ice" }, [card]), player) <= 0) {
						return false;
					}
					return 6 - get.value(card);
				})
				.setHiddenSkill(event.name);
			"step 1";
			if (result.bool) {
				player.useCard(get.autoViewAs({ name: "sha", nature: "ice" }, result.cards), result.cards, false, trigger.player, "gzqingleng");
				if (trigger.player.isUnseen()) {
					player.draw();
				}
			}
		},
	},
	//司马懿
	gzquanbian: {
		audio: "quanbian",
		preHidden: true,
		trigger: { player: ["useCard", "respond"] },
		filter(event, player) {
			if (player.hasSkill("gzquanbian_blocker")) {
				return false;
			}
			var phase = event.getParent("phaseUse");
			if (!phase || phase.player != player) {
				return false;
			}
			var suit = get.suit(event.card);
			if (!lib.suit.includes(suit) || !lib.skill.quanbian.hasHand(event)) {
				return false;
			}
			return (
				player.getHistory("useCard", function (evt) {
					return evt != event && get.suit(evt.card) == suit && lib.skill.quanbian.hasHand(evt) && evt.getParent("phaseUse") == phase;
				}).length +
				player.getHistory("respond", function (evt) {
					return evt != event && get.suit(evt.card) == suit && lib.skill.quanbian.hasHand(evt) && evt.getParent("phaseUse") == phase;
				}).length ==
				0
			);
		},
		content() {
			"step 0";
			var cards = get.cards(player.maxHp);
			for (var i = cards.length - 1; i >= 0; i--) {
				ui.cardPile.insertBefore(cards[i], ui.cardPile.firstChild);
			}
			game.updateRoundNumber();
			player.chooseButton(["权变：选择获得一张牌", cards], true).set("ai", function (button) {
				var player = _status.event.player,
					card = button.link;
				var suit = get.suit(card, false),
					val = get.value(card);
				if (
					player.hasHistory("useCard", function (evt) {
						return get.suit(evt.card, false) == suit;
					}) ||
					player.hasHistory("respond", function (evt) {
						return get.suit(evt.card, false) == suit;
					})
				) {
					return val;
				}
				return val + 8;
			});
			"step 1";
			if (result.bool) {
				var card = result.links[0];
				player.gain(card, "gain2");
				var suit = get.suit(card, false);
				if (
					player.hasHistory("useCard", function (evt) {
						return get.suit(evt.card, false) == suit;
					}) ||
					player.hasHistory("respond", function (evt) {
						return get.suit(evt.card, false) == suit;
					})
				) {
					player.addTempSkill("gzquanbian_blocker");
				}
			}
		},
		subSkill: { blocker: { charlotte: true } },
	},
	gzzhuosheng: {
		audio: "zhuosheng",
		trigger: { global: "damageEnd" },
		logTarget: "player",
		filter(event, player) {
			return event.player.isFriendOf(player);
		},
		preHidden: true,
		content() {
			var target = trigger.player;
			target.addTempSkill("gzzhuosheng2", { player: "phaseJieshuBegin" });
			target.draw().gaintag = ["gzzhuosheng2"];
		},
	},
	gzzhuosheng2: {
		onremove(player, skill) {
			player.removeGaintag(skill);
		},
		mod: {
			targetInRange(card, player, target) {
				if (!card.cards || get.type(card) != "basic") {
					return;
				}
				for (var i of card.cards) {
					if (i.hasGaintag("gzzhuosheng2")) {
						return game.online ? player == _status.currentPhase : player.isPhaseUsing();
					}
				}
			},
			cardUsable(card, player, target) {
				if (!card.cards || get.type(card) != "basic" || !(game.online ? player == _status.currentPhase : player.isPhaseUsing())) {
					return;
				}
				for (var i of card.cards) {
					if (i.hasGaintag("gzzhuosheng2")) {
						return Infinity;
					}
				}
			},
			aiOrder(player, card, num) {
				if (get.itemtype(card) == "card" && card.hasGaintag("gzzhuosheng2") && get.type(card) == "basic") {
					return num - 0.1;
				}
			},
		},
		audio: "zhuosheng",
		trigger: { player: "useCard2" },
		direct: true,
		filterx(event, player) {
			if (!player.isPhaseUsing()) {
				return false;
			}
			return (
				player.getHistory("lose", function (evt) {
					if ((evt.relatedEvent || evt.getParent()) != event) {
						return false;
					}
					for (var i in evt.gaintag_map) {
						if (evt.gaintag_map[i].includes("gzzhuosheng2")) {
							return true;
						}
					}
					return false;
				}).length > 0
			);
		},
		filter(event, player) {
			if (!lib.skill.gzzhuosheng2.filterx(event, player)) {
				return false;
			}
			if (get.type(event.card) != "trick") {
				return false;
			}
			if (event.targets && event.targets.length > 0) {
				return true;
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
		content() {
			"step 0";
			var prompt2 = "为" + get.translation(trigger.card) + "增加或减少一个目标";
			player
				.chooseTarget(get.prompt("gzzhuosheng2"), function (card, player, target) {
					var player = _status.event.player;
					if (_status.event.targets.includes(target)) {
						return true;
					}
					return lib.filter.targetEnabled2(_status.event.card, player, target) && lib.filter.targetInRange(_status.event.card, player, target);
				})
				.set("prompt2", prompt2)
				.set("ai", function (target) {
					var trigger = _status.event.getTrigger();
					var player = _status.event.player;
					return get.effect(target, trigger.card, player, player) * (_status.event.targets.includes(target) ? -1 : 1);
				})
				.set("targets", trigger.targets)
				.set("card", trigger.card);
			"step 1";
			if (result.bool) {
				if (!event.isMine() && !event.isOnline()) {
					game.delayx();
				}
				event.targets = result.targets;
			} else {
				event.finish();
			}
			"step 2";
			if (event.targets) {
				player.logSkill("gzzhuosheng2", event.targets);
				if (trigger.targets.includes(event.targets[0])) {
					trigger.targets.removeArray(event.targets);
				} else {
					trigger.targets.addArray(event.targets);
				}
			}
		},
		group: ["gzzhuosheng2_equip", "gzzhuosheng2_silent"],
		subSkill: {
			equip: {
				audio: "zhuosheng",
				trigger: { player: "useCard" },
				filter(event, player) {
					return get.type(event.card) == "equip" && lib.skill.gzzhuosheng2.filterx(event, player);
				},
				prompt: "是否发动【擢升】摸一张牌？",
				content() {
					player.draw();
				},
			},
			silent: {
				trigger: {
					player: "useCard1",
				},
				silent: true,
				firstDo: true,
				filter(event, player) {
					return get.type(event.card) == "basic" && lib.skill.gzzhuosheng2.filterx(event, player) && event.addCount !== false;
				},
				content() {
					trigger.addCount = false;
					var stat = player.getStat();
					if (stat && stat.card && stat.card[trigger.card.name]) {
						stat.card[trigger.card.name]--;
					}
				},
			},
		},
	},
};
