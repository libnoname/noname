import { lib, game, ui, get, ai, _status } from "../../noname.js";

/** @type { importCharacterConfig['skill'] } */
const skills = {
	//疑包
	//曹操 -by.柴油鹿鹿
	sxrmkuxin: {
		trigger: { player: "damageEnd" },
		filter(event, player) {
			return game.hasPlayer(cur => {
				return cur !== player && cur.countCards("h") > 0;
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
			return (
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
			);
		},
		logTarget(event, player) {
			return game.filterPlayer(current => current !== player).sortBySeat(_status.currentPhase);
		},
		async content(event, trigger, player) {
			const targets = event.targets,
				showcards = [];
			for (const target of targets) {
				if (!target.countCards("h")) {
					continue;
				}
				const result = await target
					.chooseCard("枯心：展示任意张手牌", "h", [1, Infinity], true)
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
				if (result.bool) {
					showcards.addArray(result.cards);
					await target.showCards(result.cards);
					await game.delay();
				}
			}
			const videoId = lib.status.videoId++;
			const func = (id, cards) => {
				const dialog = ui.create.dialog("枯心：请选择获得的牌");
				if (cards.length) {
					dialog.add(cards);
					const getName = function (target) {
						if (target._tempTranslate) {
							return target._tempTranslate;
						}
						let name = target.name;
						if (lib.translate[name + "_ab"]) {
							return lib.translate[name + "_ab"];
						}
						return get.translation(name);
					};
					for (let i = 0; i < cards.length; i++) {
						dialog.buttons[i].node.gaintag.innerHTML = getName(get.owner(cards[i]));
					}
				} else {
					dialog.add("没有角色展示牌");
				}
				dialog.videoId = id;
				return dialog;
			};
			if (event.isMine()) {
				func(videoId, showcards);
			}
			else if (player.isOnline2()) {
				player.send(func, videoId, showcards);
			}
			const next2 = player
				.chooseControl("获得所有角色的展示牌", "获得一名角色的未展示牌")
				.set("dialog", get.idDialog(videoId))
				.set("ai", () => {
					const { player, num, cards } = get.event();
					if (player.isTurnedOver() && cards.some(card => get.suit(card, false) === "heart")) {
						return 1;
					}
					if (cards.length <= num && game.hasPlayer(current => current != player && current.countCards("h", cardx => !cards.includes(cardx)) > cards.length && get.attitude(player, current) < 0)) {
						return 1;
					}
					if (cards.length <= num) {
						return get.rand(0, 1);
					}
					if (cards.some(card => get.suit(card, false) === "heart")) {
						return 0;
					}
					return 1;
				})
				.set("cards", showcards)
				.set("num", trigger.num * 2);
			const result2 = await next2.forResult();
			game.broadcastAll("closeDialog", videoId);
			if (!result2?.control) {
				return;
			}
			game.log(player, "选择了", "#g【枯心】", "的", "#y" + result2.control);
			let gaincards = [];
			if (result2.control == "获得一名角色的未展示牌") {
				const result3 = await player
					.chooseTarget("枯心：选择一名其他角色获得其未展示的手牌", true, lib.filter.notMe)
					.set("ai", target => {
						const { player, cards } = get.event();
						return -get.attitude(player, target) * target.countCards("h", cardx => !cards.includes(cardx));
					})
					.set("cards", showcards)
					.forResult();
				gaincards = result3?.targets?.[0].getCards("h", cardx => !showcards.includes(cardx));
			} else {
				gaincards = showcards;
			}
			if (gaincards.length) {
				await player.gain(gaincards, "give");
				await player.showCards(gaincards);
			}
			if (!gaincards.some(card => get.suit(card, false) === "heart")) {
				player.chat("孩子们，一张牌都拿不到力");
				if (gaincards.length) {
					await player.discard(gaincards);
				}
				await player.turnOver();
			} else {
				player.chat("保持富态");
			}
		},
		//依旧归心改/.
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
		enable: "phaseUse",
		usable: 1,
		filterTarget: lib.filter.notMe,
		async content(event, trigger, player) {
			const target = event.targets[0];
			const result = await target.judge().forResult();
			if (!result.number) {
				return;
			}
			const name = get.info(event.name).pasts[result.number - 1],
				skill = get.info(event.name).derivation[result.number - 1];
			const mark = `desigu_${player.playerid}`;
			if (name) {
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
			if (name) {
				target.removeAdditionalSkills(mark);
				target.removeTip(mark);
				target.setAvatar(target.name, target.name);
			}
		},
		//不太会写ai，随便写了点简单的情况
		ai: {
			order: 1,
			result: {
				target(player, target) {
					if ((target.hasSkillTag("maixie") || target.hasSkillTag("maixie_hp")) && get.attitude(player, target) < 0) {
						return 0;
					}
					if (get.attitude(player, target) < 0 && target.getHp() + target.hujia <= 1) {
						return -1;
					}
					if ((target.hasSkillTag("maixie") || target.hasSkillTag("maixie_hp")) && get.attitude(player, target) > 0 && target.getHp() + target.hujia >= 3) {
						return 2;
					}
					if (get.attitude(player, target) > 0 && target.getHp() + target.hujia >= 4) {
						return 1;
					}
					if (get.attitude(player, target) == 0 && target.getHp() + target.hujia >= 2) {
						return 1;
					}
					return 0;
				},
			},
			tag: {
				damage: 1,
			},
		},
		pasts: ["chengong", "re_xiahoudun", "re_simayi", "re_guojia", "ol_xunyu", "sb_caopi", "shenpei", "re_caochong", "re_xunyou", "yangxiu", "chengyu", "xizhicai", "shen_guanyu"],
		derivation: ["zhichi", "reganglie", "refankui", "new_reyiji", "oljieming", "fangzhu", "shibei", "rechengxiang", "zhiyu", "jilei", "benyu", "chouce", "new_wuhun"],
	},
	//刘备
	sxrmchengbian: {
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
			const next = await player.chooseToCompare(target).set("isDelay", true);
			player
				.when({
					player: "useCardAfter",
				})
				.filter(evt => evt.getParent() == event)
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
			const card = new lib.element.VCard({ name: "juedou" });
			if (player.canUse(card, target)) {
				await player.useCard(card, target);
			}
			player.removeSkill("sxrmchengbian_sha");
			target.removeSkill("sxrmchengbian_sha");
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
				complexCard: true,
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
							if (moved[i].some(card => get[key](card) != get.event(key)) || moved[i].length > 1) {
								return false;
							}
						}
						return moved[1].length + moved[2].length + moved[3].length;
					})
					.set("filterMove", (from, to, moved) => {
						let list = [null, "suit", "number", "type2"];
						if (typeof to == "number") {
							if (to != 0) {
								return moved[to].length < 1 && get[list[to]](from.link) == get.event(list[to]);
							}
							return true;
						}
						let num1 = [0, 1, 2, 3].find(i => moved[i].includes(from.link)),
							num2 = [0, 1, 2, 3].find(i => moved[i].includes(to.link));
						if (num1 != 0 && get[list[num1]](to.link) != get.event(list[num1])) {
							return false;
						}
						if (num2 != 0 && get[list[num2]](from.link) != get.event(list[num2])) {
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
							let card = cardx.find(j => !cards.includes(j) && get[key](j) == get.event(key));
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
					await other.discard(cards).set("discarder", player);
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
			const next = await player.chooseToCompare(target).set("isDelay", true);
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
		audio: true,
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
					.vars({
						skillName,
					})
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
				.when({
					player: "phaseEnd",
				})
				.assign({
					lastDo: true,
				})
				.filter(evt => evt.skill == event.name)
				.step(async (event, trigger, player) => {
					for (let targetx of targets) {
						if (!targetx.getHistory("damage").length) {
							const card = new lib.element.VCard({ name: "sha" });
							if (targetx.canUse(card, player, false)) {
								await targetx.useCard(card, player, false);
							}
						}
					}
				});
			target.insertPhase(event.name);
		},
		derivation: "sxrmshefu",
	},
	sxrmshefu: {
		audio: "shefu",
		trigger: {
			player: "phaseJieshuBegin",
		},
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
				trigger: {
					global: ["useCard"],
				},
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
				const result = await next.forResult();
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
							return get.event("comparer").canCompare(target);
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
								sha = new lib.element.VCard({ name: "sha" });
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
		trigger: {
			global: "useCardToTargeted",
		},
		filter(event, player) {
			return get.distance(player, event.target) <= 1 && event.card?.name == "sha";
		},
		frequent: true,
		logTarget: "target",
		async content(event, trigger, player) {
			const { cards } = await game.cardsGotoOrdering(get.bottomCards(4));
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
			for (let i = 0; i < top.length; i++) {
				ui.cardPile.insertBefore(top[i], ui.cardPile.firstChild);
			}
			for (let i = 0; i < bottom.length; i++) {
				ui.cardPile.appendChild(bottom[i]);
			}
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
						return get.event("first") != target && player.canCompare(target);
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
			if (
				game
					.getGlobalHistory(
						"everything",
						evt => {
							return evt.name == "damage" && evt.player == event.player;
						},
						event
					)
					.indexOf(event) != 0
			) {
				return false;
			}
			let bool1 = get.sgn(event.source.hp - event.source.countCards("h")),
				bool2 = get.sgn(event.player.hp - event.player.countCards("h"));
			return !player.getStorage("sxrmyihe_used").includes(bool1 == bool2);
		},
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
						return !get.event("selected").includes(button.link);
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
