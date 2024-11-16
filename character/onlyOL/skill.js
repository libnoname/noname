import { lib, game, ui, get, ai, _status } from "../../noname.js";

/** @type { importCharacterConfig['skill'] } */
const skills = {
	//OL界吴国太
	olganlu: {
		inherit: "xinganlu",
		async content(event, trigger, player) {
			const num = Math.abs(event.targets[0].countCards("e") - event.targets[1].countCards("e"));
			await event.targets[0].swapEquip(event.targets[1]);
			await game.asyncDelayx();
			if (player.getDamagedHp() < num && player.countCards("e")) await player.chooseToDiscard("he", num, true);
		},
	},
	olbuyi: {
		audio: 2,
		trigger: {
			global: "dying",
		},
		filter(event, player) {
			return event.player.hp <= 0 && event.player.countCards("hej") > 0;
		},
		logTarget: "player",
		async cost(event, trigger, player) {
			const target = trigger.player;
			let check;
			if (trigger.player.isUnderControl(true, player)) {
				check = player.hasCard(card => {
					return get.type(card) != "basic";
				}, "hej");
			} else {
				check = get.attitude(player, target) > 0;
			}
			event.result = await player
				.choosePlayerCard(target, get.prompt(event.name.slice(0, -5), target), "hej")
				.set("ai", button => {
					if (!get.event().check) return 0;
					if (get.event().target.isUnderControl(true, get.player())) {
						if (get.type(button.link) != "basic") {
							return 10 - get.value(button.link);
						}
						return 0;
					} else {
						return Math.random();
					}
				})
				.set("check", check)
				.set("filterButton", button => {
					if (get.player() == get.event().target) {
						return lib.filter.cardDiscardable(button.link, get.player());
					}
					return true;
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const target = trigger.player;
			await player.showCards(event.cards, get.translation(player) + "对" + (player == target ? "自己" : get.translation(target)) + "发动了【补益】");
			if (get.type(event.cards[0]) != "basic") {
				await target.recover();
				await target.discard(event.cards[0]);
			}
		},
	},
	//OL界刘表（袁术
	olzishou: {
		audio: 2,
		trigger: {
			player: "phaseDrawBegin2",
		},
		filter(event, player) {
			return !event.numFixed;
		},
		check(event, player) {
			return (
				player.countCards("h") <= (player.hasSkill("olzongshi") ? player.maxHp : player.hp - 2) ||
				player.skipList.includes("phaseUse") ||
				!player.countCards("h", function (card) {
					return get.tag(card, "damage") && player.hasUseTarget(card);
				})
			);
		},
		async content(event, trigger, player) {
			trigger.num += game.countGroup();
			player
				.when("phaseJieshuBegin")
				.filter(evt => evt.getParent() == trigger.getParent() && player.hasHistory("sourceDamage", evtx => evtx.player != player) && player.countCards("he"))
				.then(() => {
					player.chooseToDiscard("he", game.countGroup(), true);
				});
		},
		ai: {
			threaten: 1.5,
		},
	},
	olzongshi: {
		mod: {
			maxHandcard(player, num) {
				return num + game.countGroup();
			},
		},
		audio: 2,
		trigger: {
			player: "damageBegin4",
		},
		filter(event, player) {
			const source = event.source;
			if (!source || source == player || !source.isIn()) return false;
			return !player.getStorage("olzongshi_record").includes(source.group);
		},
		forced: true,
		logTarget: "source",
		async content(event, trigger, player) {
			const target = trigger.source;
			await trigger.cancel();
			await target.draw();
			player.addSkill("olzongshi_record");
			player.markAuto("olzongshi_record", [target.group]);
		},
		ai: {
			filterDamage: true,
			skillTagFilter(player, tag, arg) {
				if (arg && arg.player && player.getStorage("olzongshi_record").includes(arg.player.group)) return true;
				return false;
			},
		},
		subSkill: {
			record: {
				charlotte: true,
				intro: {
					content: (storage, player) => `已记录势力：${get.translation(storage)}`,
				},
			},
		},
	},
	//OL界李儒
	olmieji: {
		audio: 2,
		inherit: "xinmieji",
		filter(event, player) {
			return player.countCards("h", { type: ["trick", "delay"] });
		},
		filterCard(card) {
			return get.type2(card) == "trick";
		},
		async content(event, trigger, player) {
			const target = event.target;
			player.$throw(event.cards.length, 1000);
			const result = await target.chooseToDiscard("he", true).set("prompt", "请弃置一张锦囊牌，或依次弃置两张非锦囊牌。").forResult();
			if (
				(!result.cards || get.type(result.cards[0], "trick", result.cards[0].original == "h" ? target : false) != "trick") &&
				target.countCards("he", function (card) {
					return get.type(card, "trick") != "trick";
				})
			) {
				await target
					.chooseToDiscard("he", true, function (card) {
						return get.type(card, "trick") != "trick";
					})
					.set("prompt", "请弃置第二张非锦囊牌");
			}
			const cards = game
				.getGlobalHistory("everything", evt => {
					return evt.name == "lose" && evt.getParent(3) == event;
				})
				.reduce((list, evt) => {
					return list.add(evt.cards[0]);
				}, [])
				.filterInD("d");
			if (cards.some(card => player.hasUseTarget(card, true, false))) {
				const result = await player
					.chooseButton(["灭计：是否使用其中的一张牌？", cards])
					.set("filterButton", button => {
						return get.event().player.hasUseTarget(button.link, true, false);
					})
					.set("ai", button => {
						return get.event().player.getUseValue(button.link);
					})
					.forResult();
				if (result.bool) {
					const card = result.links[0];
					player.$gain2(card, false);
					await game.asyncDelayx();
					await player.chooseUseTarget(true, card, false);
				}
			}
		},
	},
	//OL界蔡夫人
	olqieting: {
		audio: 2,
		trigger: {
			global: "phaseEnd",
		},
		filter(event, player) {
			const target = event.player;
			if (target == player || !target.isIn()) return false;
			return !target.hasHistory("useCard", evt => evt.targets && evt.targets.some(i => i != target)) || !target.hasHistory("sourceDamage", evt => evt.player != target);
		},
		async cost(event, trigger, player) {
			const target = trigger.player;
			let num = 0;
			if (!target.hasHistory("useCard", evt => evt.targets && evt.targets.some(i => i != target))) num++;
			if (!target.hasHistory("sourceDamage", evt => evt.player != target)) num++;
			const next = player.chooseButton([
				"窃听：请选择" + (num > 1 ? "一至两" : "一") + "项",
				[
					[
						["move", "将" + get.translation(target) + "装备区的一张牌置于你的装备区"],
						["draw", "摸一张牌"],
					],
					"textbutton",
				],
			]);
			next.set("selectButton", [1, num]);
			next.set("filterButton", button => {
				if (
					button.link == "move" &&
					!get
						.event()
						.getTrigger()
						.player.countCards("e", card => {
							return player.canEquip(card);
						})
				)
					return false;
				return true;
			});
			next.set("ai", button => {
				const target = get.event().getTrigger().player,
					val = target.hasSkillTag("noe") ? 6 : 0;
				if (
					button.link == "move" &&
					(get.attitude(player, target) > 0 ||
						!target.countCards("e", function (card) {
							return player.canEquip(card) && get.value(card, target) > val && get.effect(player, card, player, player) > 0;
						}))
				)
					return 0;
				return 1;
			});
			const {
				result: { bool, links },
			} = await next;
			event.result = {
				bool: bool,
				cost_data: links,
			};
		},
		logTarget: "player",
		async content(event, trigger, player) {
			const target = trigger.player,
				choices = event.cost_data;
			if (choices.includes("move")) {
				const cards = await player
					.choosePlayerCard(target, "e", true)
					.set("filterButton", button => {
						return get.player().canEquip(button.link);
					})
					.set("ai", button => {
						const player = get.player();
						return get.effect(player, button.link, player, player);
					})
					.forResultCards();
				const card = cards[0];
				target.$give(card, player, false);
				await game.asyncDelay(0.5);
				await player.equip(card);
			}
			if (choices.includes("draw")) await player.draw();
		},
	},
	//谋庞统
	olsbhongtu: {
		audio: 6,
		trigger: {
			global: ["phaseZhunbeiEnd", "phaseJudgeEnd", "phaseDrawEnd", "phaseUseEnd", "phaseDiscardEnd", "phaseJieshuEnd"],
		},
		filter(event, player) {
			let count = 0;
			player.checkHistory("gain", evt => {
				if (evt.getParent(event.name) !== event) return;
				count += evt.cards.length;
			});
			return count >= 2;
		},
		derivation: ["nzry_feijun", "qianxi"],
		prompt2: "你可以摸三张牌，展示三张手牌，令一名其他角色选择是否使用其中一张牌并令你随机弃置其中另一张牌。若使用牌的点数于三张牌中满足以下条件，其获得如下技能或效果直到其下一个回合的回合结束：唯一最大：〖飞军〗；不为最大且不为最小：〖潜袭〗；唯一最小：手牌上限+2。若其未以此法使用牌，你对其与你各造成1点火焰伤害。",
		check(event, player) {
			if (
				game.hasPlayer(current => {
					return current !== player && get.attitude(player, current) > 0;
				})
			)
				return true;
			const eff = get.damageEffect(player, player, player, "fire");
			if (
				game.hasPlayer(current => {
					return (
						get.damageEffect(current, player, player, "fire") > eff &&
						player.countCards("h", card => {
							return !current.hasUseTarget(card);
						}) >=
						2 + (player.getHp() > 1)
					);
				})
			)
				return true;
			return false;
		},
		async content(event, trigger, player) {
			await player.draw(3);
			if (player.countCards("h") < 3) return;
			const [cards, targets] = await player
				.chooseCardTarget({
					prompt: "鸿图：请展示三张手牌并选择一名角色",
					prompt2: "你选择的角色须选择是否使用其中的一张牌，并令你随机弃置其中的另一张牌。",
					position: "h",
					filterCard: true,
					selectCard: 3,
					filterTarget: lib.filter.notMe,
					forced: true,
					hasFriend: game.hasPlayer(current => {
						return current !== player && get.attitude(player, current) > 0;
					}),
					ai1(card) {
						const player = get.player(),
							val = player.getUseValue(card);
						if (get.event("hasFriend")) {
							if (
								ui.selected.cards.some(cardx => {
									return player.getUseValue(cardx) > 5;
								})
							)
								return -val - get.value(card);
							return val - 5;
						}
						if (
							game.hasPlayer(current => {
								return get.attitude(get.player(), current) < 0 && !current.hasUseTarget(card);
							})
						)
							return 100 - val;
						return -val;
					},
					ai2(target) {
						const att = get.attitude(get.player(), target);
						if (!ui.selected.cards.length) return 0;
						if (ui.selected.cards.every(card => !target.hasUseTarget(card))) {
							return 10 * (get.damageEffect(target, player, player, "fire") - get.damageEffect(player, player, player, "fire"));
						}
						return Math.max(...ui.selected.cards.map(card => target.getUseValue(card) * att));
					},
				})
				.forResult("cards", "targets");
			if (!cards || !cards.length || !targets || !targets.length) return;
			const [target] = targets;
			player.line(target, "green");
			await player.showCards(cards, `${get.translation(player)}对${get.translation(target)}发动了【鸿图】`);
			const links = await target
				.chooseButton([`鸿图：是否使用${get.translation(player)}展示的其中一张牌？`, cards])
				.set("filterButton", button => {
					const player = get.player(),
						card = button.link;
					const cardx = get.autoViewAs(
						{
							name: get.name(card),
							nature: get.nature(card),
						},
						[card]
					);
					return player.hasUseTarget(cardx, null, false);
				})
				.set("ai", button => {
					return get.player().getUseValue(button.link);
				})
				.forResultLinks();
			if (!links || !links.length) {
				for (const current of [target, player]) {
					if (!current.isIn()) continue;
					player.line(current, "fire");
					await current.damage("fire");
				}
			} else {
				const [card] = links;
				cards.remove(card);
				const cardx = get.autoViewAs(
					{
						name: get.name(card),
						nature: get.nature(card),
					},
					[card]
				);
				const owner = get.owner(card);
				const next = target
					.chooseUseTarget(cardx, [card], true, false)
					.set("throw", false)
					.set("owner", owner)
					.set("oncard", card => {
						const owner = get.event().getParent().owner;
						if (owner) owner.$throw(card.cards);
					});
				if (card.name === cardx.name && get.is.sameNature(card, cardx, true)) next.set("viewAs", false);
				await next;
				const restCards = cards.filter(card => {
					return get.owner(card) === player && get.position(card) === "h" && lib.filter.cardDiscardable(card, player, "olsbhongtu");
				});
				if (restCards.length) {
					player.discard(restCards.randomGet());
				}
				const num = get.number(card, player);
				let skill = null;
				if (
					cards.every(cardx => {
						if (cardx === card) return true;
						return get.number(cardx) < num;
					})
				) {
					skill = "nzry_feijun";
				} else if (
					cards.every(cardx => {
						if (cardx === card) return true;
						return get.number(cardx) > num;
					})
				) {
					target.addSkill("olsbhongtu_limit");
					if (!target.storage.olsbhongtu_limit) target.storage.olsbhongtu_limit = [0, 0];
					target.storage.olsbhongtu_limit[0] += 2;
				} else {
					skill = "qianxi";
				}
				if (skill) {
					let skillName = `olsbhongtu_${player.playerid}`;
					target.addAdditionalSkills(skillName, [skill]);
					delete target.storage.olsbhongtu_phased;
					target.when({ player: "phaseBegin" }).then(() => {
						player.storage.olsbhongtu_phased = true;
					});
					target
						.when({ player: "phaseEnd" })
						.filter(() => {
							return target.storage.olsbhongtu_phased;
						})
						.assign({
							firstDo: true,
							priority: Infinity,
						})
						.vars({
							skillName,
						})
						.then(() => {
							delete player.storage.olsbhongtu_phased;
							player.removeAdditionalSkills(skillName);
						});
				}
			}
		},
		subSkill: {
			limit: {
				markimage: "image/card/handcard.png",
				intro: {
					content(storage, player) {
						return "手牌上限+" + storage;
					},
				},
				charlotte: true,
				mod: {
					maxHandcard(player, num) {
						return num + player.storage.olsbhongtu_limit[0];
					},
				},
				trigger: {
					player: "phaseEnd"
				},
				silent: true,
				lastDo: true,
				content() {
					player.storage.olsbhongtu_limit = [player.storage.olsbhongtu_limit[1], 0];
					if (!player.storage.olsbhongtu_limit[0]) player.removeSkill("olsbhongtu_limit");
				}
			},
		},
	},
	olsbqiwu: {
		audio: 6,
		trigger: {
			player: "damageBegin4",
		},
		filter(event, player) {
			if (!event.source) return false;
			if (event.source !== player && !event.source.inRangeOf(player)) return false;
			return (
				game
					.getGlobalHistory(
						"everything",
						evt => {
							return evt.name == "damage" && evt.player == player;
						},
						event
					)
					.indexOf(event) === 0
			);
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseToDiscard(get.prompt("olsbqiwu"), `你可以弃置一张红色牌，防止${get.translation(trigger.source)}对你造成的${trigger.num}点伤害。`, "chooseonly", { color: "red" }, "he")
				.set("ai", card => {
					if (get.event("goon")) return 6 - get.value(card);
					return 0;
				})
				.set("goon", get.damageEffect(player, trigger.source, player) < 0)
				.forResult();
		},
		async content(event, trigger, player) {
			await player.discard(event.cards);
			trigger.cancel();
		},
	},
	//法正
	olxuanhuo: {
		audio: 2,
		trigger: { player: "phaseDrawEnd" },
		filter(event, player) {
			return player.countCards("he") > 1 && game.hasPlayer(target => target != player);
		},
		async cost(event, trigger, player) {
			const ai2 = function (target) {
				const player = _status.event.player;
				if (
					!game.hasPlayer(current => {
						return current != player && current != target;
					})
				)
					return get.effect(target, new lib.element.VCard({ name: "shunshou_copy2" }), player, player);
				if (get.attitude(player, target) <= 0) return 0;
				const num = target.getUseValue(new lib.element.VCard({ name: "sha" }), false);
				if (target.hasSkillTag("nogain")) num /= 4;
				return num;
			};
			event.result = await player
				.chooseCardTarget({
					prompt: get.prompt2("olxuanhuo"),
					filterCard: true,
					selectCard: 2,
					position: "he",
					filterTarget: lib.filter.notMe,
					goon: game.hasPlayer(function (current) {
						return current != player && ai2(player, current) > 0;
					}),
					ai1(card) {
						if (!_status.event.goon && game.countPlayer(target => target != _status.event.player) > 1) return 0;
						return 7 - get.value(card);
					},
					ai2: ai2,
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			await player.give(event.cards, target);
			if (
				game.hasPlayer(function (current) {
					return current != player && current != target;
				})
			) {
				const result2 = await player
					.chooseTarget(
						function (card, player, target) {
							return target != player && target != _status.event.target;
						},
						"请选择" + get.translation(target) + "使用【杀】的目标",
						true
					)
					.set("target", target)
					.set("ai", function (target) {
						const evt = _status.event,
							card = new lib.element.VCard({ name: "sha" });
						if (!evt.target.canUse(card, target, false)) return 0;
						return get.effect(target, card, evt.target, evt.player);
					})
					.set("target", target)
					.forResult();
				if (result2.bool) {
					const target2 = result2.targets[0];
					player.line(target2);
					const result = await target
						.chooseToUse(function (card, player, event) {
							if (get.name(card) != "sha") return false;
							return lib.filter.filterCard.apply(this, arguments);
						}, "眩惑：对" + get.translation(target2) + "使用一张【杀】，或令" + get.translation(player) + "你的手牌并获得你的两张牌")
						.set("filterTarget", function (card, player, target) {
							if (target != _status.event.sourcex && !ui.selected.targets.includes(_status.event.sourcex)) return false;
							return lib.filter.targetEnabled.apply(this, arguments);
						})
						.set("targetRequired", true)
						.set("complexSelect", true)
						.set("sourcex", target2)
						.forResult();
					if (result.bool) return;
				}
			}
			await player.gainPlayerCard(target, 2, "he", true, "visible");
		},
		ai: { expose: 0.15 },
	},
	olenyuan: {
		audio: 2,
		group: ["olenyuan1", "olenyuan2"],
	},
	olenyuan1: {
		inherit: "xinenyuan1",
	},
	olenyuan2: {
		inherit: "xinenyuan2",
		prompt2: event => "令" + get.translation(event.source) + "交给你一张红色手牌或失去1点体力",
		getIndex: event => event.num,
		async content(event, trigger, player) {
			const result = await trigger.source
				.chooseToGive(
					"恩怨：交给" + get.translation(player) + "一张红色手牌，或失去1点体力",
					(card, player) => {
						return get.color(card) == "red";
					},
					"h",
					player
				)
				.set("ai", card => {
					const player = _status.event.getParent().player,
						source = _status.event.player;
					if (get.effect(source, { name: "losehp" }, source, source) >= 0) return 0;
					if (get.attitude(player, source) > 0) return 11 - get.value(card);
					return 7 - get.value(card);
				})
				.forResult();
			if (!result.bool) {
				await trigger.source.loseHp();
			}
		},
	},
	//王异
	olzhenlie: {
		audio: 2,
		inherit: "zhenlie",
		async content(event, trigger, player) {
			const target = trigger.player;
			if (get.attitude(player, target) < 0 && target.countDiscardableCards(player, "he")) player.addTempSkill("zhenlie_lose");
			await player.loseHp();
			player.removeSkill("zhenlie_lose");
			trigger.getParent().excluded.add(player);
			if (!player.isIn()) return;
			const goon = target.hasCard(card => {
				if (get.position(card) == "h") return true;
				return lib.filter.canBeGained(card, player, target);
			}, "he");
			if (goon || player.isDamaged()) {
				let result;
				if (goon && player.isDamaged())
					result = await player
						.chooseControl()
						.set("choiceList", ["获得" + get.translation(target) + "的一张牌", "于本回合的结束阶段发动一次〖秘计〗"])
						.set("ai", () => {
							const player = get.event("player"),
								target = get.event().getTrigger().player;
							return get.effect(target, { name: "shunshou_copy2" }, player, player) > get.effect(player, { name: "draw" }, player, player) * player.getDamagedHp() ? 0 : 1;
						})
						.forResult();
				else result = { index: goon ? 0 : 1 };
				if (result.index == 0) {
					await player.gainPlayerCard(target, "he", true);
				} else {
					player.addTempSkill("olzhenlie_effect");
					player.addMark("olzhenlie_effect", 1, false);
				}
			}
		},
		subSkill: {
			effect: {
				charlotte: true,
				onremove: true,
				intro: { content: "本回合的结束阶段额外发动#次〖秘计〗" },
				trigger: { global: "phaseJieshuBegin" },
				filter(event, player) {
					if (player.isHealthy()) return false;
					return player.hasMark("olzhenlie_effect");
				},
				getIndex(event, player) {
					return player.countMark("olzhenlie_effect");
				},
				forced: true,
				inherit: "olmiji"
			},
		},
	},
	olmiji: {
		audio: 2,
		trigger: { player: "phaseJieshuBegin" },
		filter(event, player) {
			if (player.isHealthy()) return false;
			return true;
		},
		async content(event, trigger, player) {
			let num = player.getDamagedHp();
			await player.draw(num);
			if (player.countCards("he") && game.hasPlayer(target => target != player)) {
				if (_status.connectMode) game.broadcastAll(() => (_status.noclearcountdown = true));
				let given_map = [];
				while (num > 0 && player.hasCard(card => !card.hasGaintag("olsujian_given"), "he")) {
					const {
						result: { bool, cards, targets },
					} = await player.chooseCardTarget({
						filterCard(card, player) {
							return !card.hasGaintag("olsujian_given");
						},
						selectCard: [1, num],
						position: "he",
						filterTarget: lib.filter.notMe,
						prompt: "秘计：请选择要分配的卡牌和目标",
						prompt2: "（还可分配" + num + "张）",
						ai1(card) {
							return !ui.selected.cards.length && card.name == "du" ? 1 : 0;
						},
						ai2(target) {
							const player = get.event("player");
							const card = ui.selected.cards[0];
							if (card) return get.value(card, target) * get.attitude(player, target);
							return 0;
						},
					});
					if (bool) {
						num -= cards.length;
						const target = targets[0];
						if (given_map.some(i => i[0] == target)) {
							given_map[given_map.indexOf(given_map.find(i => i[0] == target))][1].addArray(cards);
						} else given_map.push([target, cards]);
						player.addGaintag(cards, "olsujian_given");
					} else break;
				}
				if (_status.connectMode) {
					game.broadcastAll(() => {
						delete _status.noclearcountdown;
						game.stopCountChoose();
					});
				}
				if (given_map.length) {
					await game
						.loseAsync({
							gain_list: given_map,
							player: player,
							cards: given_map.slice().map(list => list[1]),
							giver: player,
							animate: "giveAuto",
						})
						.setContent("gaincardMultiple");
				}
			}
		},
	},
	//程普
	dclihuo: {
		audio: "relihuo",
		trigger: { player: "useCard1" },
		filter(event, player) {
			return event.card.name == "sha" && !game.hasNature(event.card, "fire");
		},
		check(event, player) {
			let card = new lib.element.VCard(get.copy(event.card));
			game.setNature(card, "fire");
			const eff1 = event.targets.reduce((sum, target) => {
				return sum + get.effect(target, event.card, player, player);
			}, 0);
			let targets = event.targets.slice();
			if (get.info("lihuo2").filter(event, player)) {
				let targetx = game.filterPlayer(target => {
					return !targets.includes(target) && player.canUse(card, target) && get.effect(target, card, player, player) > 0;
				});
				if (targetx.length)
					targets.add(
						targetx.sort((a, b) => {
							return get.effect(b, card, player, player) - get.effect(a, card, player, player);
						})[0]
					);
			}
			const eff2 = targets.reduce((sum, target) => {
				return sum + get.effect(target, card, player, player);
			}, 0);
			return eff2 > eff1;
		},
		content() {
			game.log(player, "将", trigger.card, "改为了火属性");
			game.setNature(trigger.card, "fire");
			player
				.when("useCardAfter")
				.filter(evt => evt == trigger)
				.then(() => {
					if (
						game.hasPlayer2(target => {
							return target.getHistory("damage", evt => evt.card && evt.card == trigger.card).length;
						})
					) {
						player.chooseToDiscard("he", "疠火：弃置一张牌，或失去1点体力").set("ai", card => {
							const player = get.event("player");
							if ((get.name(card) == "tao" || get.name(card) == "jiu") && lib.filter.cardSavable(card, player, player)) return -1;
							if (player.hp <= 1) {
								if (
									cards.length < player.getEnemies().length &&
									player.hasCard(cardx => {
										return (get.name(cardx) == "tao" || get.name(cardx) == "jiu") && lib.filter.cardSavable(cardx, player, player);
									}, "hs")
								)
									return 7 - get.value(card);
								return -1;
							}
							return 24 - 5 * cards.length - 2 * Math.min(4, player.getHp()) - get.value(card);
						});
					} else event.finish();
				})
				.then(() => {
					if (!result.bool) player.loseHp();
				});
		},
		ai: { fireAttack: true },
		group: "dclihuo_add",
		subSkill: {
			add: {
				inherit: "lihuo2",
				async content(event, trigger, player) {
					const {
						result: { bool, targets },
					} = await player
						.chooseTarget(get.prompt("dclihuo"), "为" + get.translation(trigger.card) + "增加一个目标", (card, player, target) => {
							const trigger = get.event().getTrigger();
							return !trigger.targets.includes(target) && player.canUse(trigger.card, target);
						})
						.set("card", trigger.card)
						.set("ai", target => {
							const player = get.event("player"),
								trigger = get.event().getTrigger();
							return get.effect(target, trigger.card, player, player);
						});
					if (bool) {
						player.logSkill("dclihuo", targets);
						trigger.targets.addArray(targets);
					}
				},
			},
		},
	},
	olchunlao: {
		audio: "chunlao",
		audioname: ["xin_chengpu"],
		trigger: {
			player: "loseAfter",
			global: "loseAsyncAfter",
		},
		filter(event, player) {
			if (event.type != "discard" || event.getlx === false) return false;
			const evt = event.getl(player);
			return evt && evt.cards2 && evt.cards2.some(i => i.name == "sha" && get.position(i) == "d");
		},
		forced: true,
		locked: false,
		content() {
			const evt = trigger.getl(player);
			player
				.addToExpansion(
					evt.cards2.filter(i => i.name == "sha" && get.position(i) == "d"),
					"gain2"
				)
				.gaintag.add("olchunlao");
		},
		ai: {
			effect: {
				player(card, player, target) {
					if (_status.currentPhase != player) return;
					if (card.name == "sha" && !player.getExpansions("olchunlao").length && target.hp > 1) {
						return "zeroplayertarget";
					}
				},
			},
		},
		intro: {
			content: "expansion",
			markcount: "expansion",
		},
		onremove(player, skill) {
			var cards = player.getExpansions(skill);
			if (cards.length) player.loseToDiscardpile(cards);
		},
		group: "olchunlao_save",
		subSkill: {
			save: {
				inherit: "chunlao2",
				filter(event, player) {
					return event.type == "dying" && event.dying && event.dying.hp <= 0 && player.getExpansions("olchunlao").length;
				},
				async content(event, trigger, player) {
					const target = event.targets[0];
					const {
						result: { bool, links },
					} = await player.chooseCardButton(get.translation("olchunlao"), player.getExpansions("olchunlao"), true);
					if (bool) {
						player.logSkill("olchunlao", target);
						await player.loseToDiscardpile(links);
						event.type = "dying";
						await target.useCard({ name: "jiu", isCard: true }, target);
					}
				},
				ai: {
					save: true,
					skillTagFilter(player) {
						return player.getExpansions("olchunlao").length;
					},
					order: 6,
					result: { target: 1 },
				},
			},
		},
	},
	//虞翻
	olzongxuan: {
		audio: "rezongxuan",
		trigger: { global: ["loseAfter", "loseAsyncAfter"] },
		filter(event, player) {
			if (event.type != "discard" || event.getlx === false) return false;
			return get.info("olzongxuan").getCards(event, player).length;
		},
		check(event, player) {
			if (event.getParent(3).name != "phaseDiscard") return false;
			const cards = get.info("olzongxuan").getCards(event, player);
			return game.hasPlayer(target => {
				if (cards.some(i => get.type(i, target) == "equip") && (get.attitude(player, target) > 0 || get.recoverEffect(target, player, player) > 0)) return true;
				if (cards.some(i => get.type(i, target) != "equip") && target.getHp() >= player.getHp() && get.effect(target, { name: "losehp" }, player, player) > 0) return true;
				return false;
			});
		},
		async content(event, trigger, player) {
			const {
				result: { bool, moved },
			} = await player
				.chooseToMove("纵玄：将任意张牌置于牌堆顶", true)
				.set("list", [["本次弃置的牌", get.info("olzongxuan").getCards(trigger, player)], ["牌堆顶"]])
				.set("filterOk", moved => moved[1].length)
				.set("processAI", list => {
					const player = get.event("player");
					const cards = list[0][1].slice(),
						cards2 = cards.filter(card => {
							return game.hasPlayer(target => {
								if (get.type(card, target) == "equip" && (get.attitude(player, target) > 0 || get.recoverEffect(target, player, player) > 0)) return true;
								if (get.type(card, target) != "equip" && target.getHp() >= player.getHp() && get.effect(target, { name: "losehp" }, player, player) > 0) return true;
								return false;
							});
						}),
						cards3 = cards2.length ? cards2.randomGet() : cards.randomGet();
					return [[], [cards3]];
				});
			if (bool) {
				let cards = moved[1].slice();
				game.log(player, "将", cards, "置于了牌堆顶");
				while (cards.length) {
					ui.cardPile.insertBefore(cards.pop().fix(), ui.cardPile.firstChild);
				}
			}
		},
		getCards(event, player) {
			let cards = [];
			for (const target of [player, player.getPrevious()]) {
				const evt = event.getl(target);
				if (evt && evt.cards2 && evt.cards2.some(i => get.position(i) == "d")) {
					if (
						target == player ||
						target
							.getHistory("lose", evt => {
								return evt.type == "discard" && evt.getlx !== false;
							})
							.indexOf(event) == 0
					) {
						cards.addArray(evt.cards2.filter(i => get.position(i) == "d"));
					}
				}
			}
			return cards;
		},
	},
	olzhiyan: {
		audio: "zhiyan",
		audioname: ["re_yufan"],
		trigger: { global: "phaseJieshuBegin" },
		filter(event, player) {
			return event.player == player || event.player == player.getPrevious();
		},
		direct: true,
		async content(event, trigger, player) {
			const {
				result: { bool, targets },
			} = await player
				.chooseTarget(get.prompt2("olzhiyan"))
				.set("ai", target => {
					const player = get.event("player"),
						cards = get.event("cards");
					if (!cards.length) return 0;
					const card = cards[0],
						att = get.attitude(player, target);
					if (get.type(card, target) == "equip" && (get.attitude(player, target) > 0 || get.recoverEffect(target, player, player) > 0)) return get.recoverEffect(target, player, player) * 20 + att / 114514;
					if (get.type(card, target) != "equip") {
						if (target.getHp() >= player.getHp()) return get.effect(target, { name: "losehp" }, player, player) * 20 - att / 114514;
						return get.effect(target, { name: "draw" }, player, player);
					}
					return 0;
				})
				.set("cards", Array.from(ui.cardPile.childNodes || []) || []);
			if (bool) {
				const target = targets[0];
				player.logSkill("olzhiyan", target);
				const { result } = await target.draw("visible");
				if (result) {
					const card = result[0];
					if (get.type(card, target) == "equip") {
						if (target.getCards("h").includes(card) && target.hasUseTarget(card)) {
							const {
								result: { bool },
							} = await target.chooseUseTarget(card, true, "nopopup");
							if (bool) await target.recover();
						}
					} else if (target.getHp() >= player.getHp()) await target.loseHp();
				}
			}
		},
		ai: { expose: 0.2 },
	},
	//OL谋袁绍
	//真·四世三公——袁神，启动
	olsbhetao: {
		audio: 3,
		audioname: ["ol_sb_yuanshao_shadow"],
		trigger: { global: "useCardToPlayered" },
		filter(event, player) {
			return (
				event.player != player &&
				event.isFirstTarget &&
				event.targets.length > 1 &&
				player.countCards("he", card => {
					if (get.position(card) == "h" && _status.connectMode) return true;
					return get.color(card) == get.color(event.card) && lib.filter.cardDiscardable(card, player);
				})
			);
		},
		direct: true,
		async content(event, trigger, player) {
			const {
				result: { bool, cards, targets },
			} = await player
				.chooseCardTarget({
					prompt: get.prompt("olsbhetao"),
					filterCard(card, player) {
						return get.color(card) == get.color(get.event().getTrigger().card) && lib.filter.cardDiscardable(card, player);
					},
					position: "he",
					filterTarget(card, player, target) {
						return get.event().getTrigger().targets.includes(target);
					},
					ai1(card) {
						return 7.5 - get.value(card);
					},
					ai2(target) {
						const player = get.event("player"),
							trigger = get.event().getTrigger();
						const att = get.attitude(player, target),
							eff = get.effect(target, trigger.card, trigger.player, player);
						if (trigger.card.name == "tiesuo") return eff > 0 ? 0 : get.sgn(att) * (2 + get.sgn(att));
						const sum = trigger.targets.reduce((i, j) => i + get.effect(j, trigger.card, trigger.player, player), 0);
						return eff * 2 - sum;
					},
				})
				.set("prompt2", "弃置一张" + get.translation(get.color(trigger.card)) + "牌，令" + get.translation(trigger.card) + "改为对其中一个目标结算两次");
			if (bool) {
				const target = targets[0];
				player.logSkill("olsbhetao", target);
				player.changeSkin({ characterName: "ol_sb_yuanshao" }, "ol_sb_yuanshao");
				player.discard(cards);
				trigger.getParent().effectCount++;
				trigger.getParent().excluded.addArray(game.filterPlayer(i => trigger.targets.includes(i) && target != i));
			}
		},
		ai: { threaten: 3.5 },
		global: "olsbhetao_ai",
		subSkill: {
			ai: {
				effect: {
					player_use(card, player) {
						if (
							!game.hasPlayer(target => {
								return target.hasSkill("olsbhetao") && (get.attitude(player, target) < 0 || get.attitude(target, player) < 0);
							}) ||
							game.countPlayer(target => {
								return player.canUse(card, target);
							}) < 2
						)
							return;
						const select = get.copy(get.info(card).selectTarget);
						let range;
						if (select == undefined) range = [1, 1];
						else if (typeof select == "number") range = [select, select];
						else if (get.itemtype(select) == "select") range = select;
						else if (typeof select == "function") range = select(card, player);
						game.checkMod(card, player, range, "selectTarget", player);
						if (range[1] == -1 || (range[1] > 1 && ui.selected.targets && ui.selected.targets.length)) return "zeroplayertarget";
					},
				},
			},
		},
	},
	olsbshenli: {
		audio: 3,
		audioname: ["ol_sb_yuanshao_shadow"],
		trigger: { player: "useCardToPlayered" },
		filter(event, player) {
			if (!player.isPhaseUsing() || player.hasSkill("olsbshenli_used")) return false;
			return (
				event.card.name == "sha" &&
				game.hasPlayer(target => {
					return !event.targets.includes(target) && player.canUse(event.card, target, false);
				}) &&
				event.isFirstTarget
			);
		},
		check(event, player) {
			const targets = game.filterPlayer(target => player.canUse(event.card, target, false));
			const num1 = event.targets.reduce((sum, target) => sum + get.effect(target, event.card, player, player), 0);
			const num2 = targets.reduce((sum, target) => sum + get.effect(target, event.card, player, player), 0);
			if (num2 >= num1) return true;
			let num = event.baseDamage || 1;
			if (event.extraDamage) num += event.extraDamage;
			let extra_num = 0;
			for (const target of targets) {
				if (
					target.mayHaveShan(
						player,
						"use",
						target.getCards("h", i => {
							return i.hasGaintag("sha_notshan");
						})
					) &&
					!player.hasSkillTag(
						"directHit_ai",
						true,
						{
							target: target,
							card: event.card,
						},
						true
					)
				) {
					if (player.hasSkillTag("jueqing", false, target)) extra_num--;
					else if (
						target.hasSkillTag("filterDamage", null, {
							player: event.player,
							card: event.card,
						})
					)
						extra_num++;
				} else extra_num += num;
			}
			const sum = targets.length + extra_num;
			return num2 + (sum > player.countCards("h") ? Math.min(5, sum) : 0) + (sum > player.getHp() ? num2 : 0) >= num1;
		},
		async content(event, trigger, player) {
			player.changeSkin({ characterName: "ol_sb_yuanshao" }, "ol_sb_yuanshao_shadow");
			player.addTempSkill("olsbshenli_used", "phaseUseAfter");
			trigger.getParent().targets.addArray(
				game.filterPlayer(target => {
					return !trigger.targets.includes(target) && player.canUse(trigger.card, target, false);
				})
			);
			player
				.when("useCardAfter")
				.filter(evt => evt == trigger.getParent())
				.then(() => {
					const sum = player
						.getHistory("sourceDamage", evt => evt.card && evt.card == trigger.card)
						.reduce((num, evt) => {
							return num + evt.num;
						}, 0);
					const bool = sum > player.countCards("h"),
						goon = sum > player.getHp();
					if (bool) player.draw(Math.min(5, sum));
					if (goon) {
						const targets = game.filterPlayer(target => trigger.targets.includes(target) && player.canUse(trigger.card, target, false));
						if (
							targets.length &&
							(!trigger.cards ||
								!trigger.cards.length ||
								trigger.cards.every(card => {
									return !get.owner(card);
								}))
						)
							player.useCard(trigger.card, targets, false);
					}
				});
		},
		ai: { threaten: 3.5 },
		subSkill: { used: { charlotte: true } },
	},
	olsbyufeng: {
		audio: 2,
		audioname2: {
			ol_sb_yuanshao_shadow: "olsbyufeng_ol_sb_yuanshao_shadow",
		},
		trigger: {
			global: "phaseBefore",
			player: "enterGame",
		},
		filter(event, player) {
			const card = get.cardPile("sizhaojian", "field") || game.createCard2("sizhaojian", "diamond", 6);
			return (event.name != "phase" || game.phaseNumber == 0) && player.canEquip(card, true);
		},
		forced: true,
		locked: false,
		async content(event, trigger, player) {
			if (lib.card.sizhaojian.inShanShanFestival()) {
				game.broadcastAll(() => lib.inpile.add("sizhaojian"));
			}
			const card = get.cardPile("sizhaojian", "field") || game.createCard2("sizhaojian", "diamond", 6);
			if (get.owner(card)) get.owner(card).$give(card, player, false);
			else {
				player.$gain2(card, false);
				game.delayx();
			}
			player.equip(card);
		},
		subSkill: {
			ol_sb_yuanshao_shadow: {
				audio: 1,
			},
			sizhaojian: {
				equipSkill: true,
				mod: {
					aiOrder(player, card, num) {
						if (card.name == "sha" && typeof get.number(card) == "number") return num + get.number(card) / 114514;
					},
				},
				trigger: { player: "useCardToPlayered" },
				filter(event, player) {
					return event.card.name == "sha" && typeof get.number(event.card) == "number";
				},
				forced: true,
				locked: false,
				logTarget: "target",
				async content(event, trigger, player) {
					const target = trigger.target;
					target.addTempSkill("olsbyufeng_block");
					target.markAuto("olsbyufeng_block", [trigger.card]);
				},
			},
			block: {
				mod: {
					cardEnabled(card, player) {
						if (!player.storage.olsbyufeng_block) return;
						const storage = player.getStorage("olsbyufeng_block");
						let evt = _status.event;
						if (evt.name != "chooseToUse") evt = evt.getParent("chooseToUse");
						if (!evt || !evt.respondTo || !storage.includes(evt.respondTo[1])) return;
						const num = get.number(card);
						if (num != "unsure" && typeof num == "number" && num < get.number(evt.respondTo[1])) return false;
					},
				},
				onremove(player) {
					delete player.storage.olsbyufeng_block;
				},
				charlotte: true,
				trigger: {
					player: ["damageBefore", "damageCancelled", "damageZero"],
					target: ["shaMiss", "useCardToExcluded", "useCardToEnd"],
					global: ["useCardEnd"],
				},
				filter(event, player) {
					if (!event.card || !player.storage.olsbyufeng_block) return false;
					return player.getStorage("olsbyufeng_block").includes(event.card);
				},
				forced: true,
				popup: false,
				firstDo: true,
				content() {
					player.unmarkAuto("olsbyufeng_block", [trigger.card]);
					if (!player.getStorage("olsbyufeng_block").length) player.removeSkill("olsbyufeng_block");
				},
			},
		},
	},
	olsbshishou: {
		unique: true,
		audio: 3,
		audioname: ["ol_sb_yuanshao_shadow"],
		trigger: {
			global: ["loseAfter", "equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"],
		},
		filter(event, player) {
			if (player.getEquip(1)) return false;
			const card = get.cardPile("sizhaojian", "field") || game.createCard2("sizhaojian", "diamond", 6);
			if (!player.canEquip(card, true)) return false;
			return game.hasPlayer(target => {
				if (target == player || target.group != "qun") return false;
				const evt = event.getl(target);
				return evt && evt.player == target && evt.es && evt.es.length > 0;
			});
		},
		direct: true,
		zhuSkill: true,
		async content(event, trigger, player) {
			const targets = game
				.filterPlayer(target => {
					if (target == player || target.group != "qun") return false;
					const evt = trigger.getl(target);
					return evt && evt.player == target && evt.es && evt.es.length > 0;
				})
				.sortBySeat();
			const card = get.cardPile("sizhaojian", "field") || game.createCard2("sizhaojian", "diamond", 6);
			for (const target of targets) {
				const {
					result: { bool },
				} = await target.chooseBool(get.prompt("olsbshishou", player), "将" + get.translation(card) + "置入" + get.translation(player) + "的装备区中").set("choice", get.attitude(target, player) > 0);
				if (bool) {
					target.logSkill("olsbshishou", player);
					if (get.owner(card)) get.owner(card).$give(card, player, false);
					else {
						player.$gain2(card, false);
						game.delayx();
					}
					player.equip(card);
					break;
				}
			}
		},
	},
	//界高顺
	olxianzhen: {
		audio: "rexianzhen",
		inherit: "xianzhen",
		async content(event, trigger, player) {
			const target = event.target;
			const {
				result: { bool },
			} = await player.chooseToCompare(target);
			if (bool) {
				player.markAuto("olxianzhen_effect", [target]);
				player.addTempSkill("olxianzhen_effect");
			} else {
				player.markAuto("olxianzhen_buff", [target]);
				player.addTempSkill("olxianzhen_buff");
			}
		},
		subSkill: {
			effect: {
				charlotte: true,
				onremove: true,
				audio: "rexianzhen",
				mod: {
					targetInRange(card, player, target) {
						if (player.getStorage("olxianzhen_effect").includes(target)) return true;
					},
					cardUsableTarget(card, player, target) {
						if (player.getStorage("olxianzhen_effect").includes(target)) return true;
					},
				},
				trigger: { player: "useCard2" },
				filter(event, player) {
					if (event.card.name != "sha" && get.type(event.card) != "trick") return false;
					if (!Array.isArray(event.targets)) return false;
					return game.hasPlayer(target => {
						if (!player.getStorage("olxianzhen_effect").includes(target)) return false;
						return !event.targets.includes(target) && lib.filter.targetEnabled2(event.card, player, target);
					});
				},
				async cost(event, trigger, player) {
					const targets = game.filterPlayer(target => {
						if (!player.getStorage("olxianzhen_effect").includes(target)) return false;
						return !trigger.targets.includes(target) && lib.filter.targetEnabled2(trigger.card, player, target);
					});
					if (targets.length == 1) {
						const target = targets[0];
						const bool = await player.chooseBool(get.prompt("olxianzhen_effect", target), "令" + get.translation(target) + "也成为" + get.translation(trigger.card) + "的目标").forResult("bool");
						event.result = { bool: bool, targets: targets };
					} else {
						event.result = await player
							.chooseTarget(get.prompt("olxianzhen_effect"), "令任意名【陷阵】拼点成功的目标角色也成为" + get.translation(trigger.card) + "的目标", (card, player, target) => {
								const trigger = get.event().getTrigger();
								if (!player.getStorage("olxianzhen_effect").includes(target)) return false;
								return !trigger.targets.includes(target) && lib.filter.targetEnabled2(trigger.card, player, target);
							})
							.set("ai", target => {
								const player = get.event("player"),
									trigger = get.event().getTrigger();
								return get.effect(target, trigger.card, player, player);
							})
							.forResult();
					}
				},
				content() {
					trigger.targets.addArray(event.targets);
					game.log(event.targets, "成为了", trigger.card, "的额外目标");
				},
				ai: {
					unequip: true,
					skillTagFilter(player, tag, arg) {
						if (!arg || !arg.target || !player.getStorage("olxianzhen_effect").includes(arg.target)) return false;
					},
					effect: {
						player_use(card, player, target, current, isLink) {
							if (isLink || !target || player._olxianzhen_effect_temp) return;
							if (!player.getStorage("olxianzhen_effect").includes(target) && ["sha", "guohe", "shunshou", "huogong", "juedou"].includes(card.name)) {
								player._olxianzhen_effect_temp = true;
								let eff = get.effect(target, card, player, player);
								delete player._olxianzhen_effect_temp;
								if (eff > 0) {
									return [1, 2];
								}
							}
						},
					},
				},
			},
			buff: {
				charlotte: true,
				onremove: true,
				mod: {
					playerEnabled(card, player, target) {
						if (get.name(card, player) == "sha" && player.getStorage("olxianzhen_buff").includes(target)) return false;
					},
					ignoredHandcard(card, player) {
						if (get.name(card, player) == "sha") return true;
					},
					cardDiscardable(card, player, name) {
						if (name == "phaseDiscard" && get.name(card, player) == "sha") return false;
					},
				},
			},
		},
	},
	//新OL谋关羽
	olsbweilin: {
		audio: 2,
		enable: "chooseToUse",
		filter(event, player) {
			return get
				.inpileVCardList(info => {
					const name = info[2];
					if (name != "sha" && name != "jiu") return false;
					return get.type(name) == "basic";
				})
				.some(card => player.hasCard(cardx => event.filterCard({ name: card[2], nature: card[3], cards: [cardx] }, player, event), "hes"));
		},
		usable: 1,
		chooseButton: {
			dialog(event, player) {
				const list = get
					.inpileVCardList(info => {
						const name = info[2];
						if (name != "sha" && name != "jiu") return false;
						return get.type(name) == "basic";
					})
					.filter(card => player.hasCard(cardx => event.filterCard({ name: card[2], nature: card[3], cards: [cardx] }, player, event), "hes"));
				return ui.create.dialog("威临", [list, "vcard"]);
			},
			filter(button, player) {
				return _status.event.getParent().filterCard({ name: button.link[2], nature: button.link[3] }, player, _status.event.getParent());
			},
			check(button) {
				if (_status.event.getParent().type != "phase") return 1;
				const player = get.event("player"),
					value = player.getUseValue({ name: button.link[2], nature: button.link[3] });
				if (button.link[2] == "sha" && !player.getHistory("useCard", evt => get.type(evt.card) == "basic").length) {
					if (value > 0) return value + 20;
				}
				return value;
			},
			backup(links, player) {
				return {
					audio: "olsbweilin",
					filterCard: true,
					popname: true,
					check(card) {
						const name = lib.skill.olsbweilin_backup.viewAs.name,
							color = get.color(card);
						const phase = _status.event.getParent().type == "phase";
						if (phase && name == "sha" && color == "red") return 10 - get.value(card);
						if (name == "tao") return 7 + [-2, 0, 2][["black", "red", "none"].indexOf(color)] - get.value(card);
						return 6 - get.value(card);
					},
					position: "hse",
					viewAs: { name: links[0][2], nature: links[0][3] },
					precontent() {
						if (!player.storage.olsbweilin_backup) {
							player.storage.olsbweilin_backup = true;
							player
								.when("useCardToTargeted")
								.filter(evt => evt.getParent().skill == "olsbweilin_backup" && evt.getParent().triggeredTargets3.length == evt.targets.length)
								.then(() => {
									delete player.storage.olsbweilin_backup;
									const targets = trigger.targets.slice().sortBySeat();
									player.line(targets);
									for (const target of targets) {
										target.addTempSkill("olsbweilin_wusheng");
										target.markAuto("olsbweilin_wusheng", [get.color(trigger.card)]);
									}
								});
						}
					},
					ai: {
						directHit_ai: true,
						skillTagFilter(player, tag, arg) {
							if (get.event("skill") != "olsbweilin_backup") return false;
							return arg && arg.card && arg.card.name == "sha" && get.color(arg.card) == "red";
						},
					},
				};
			},
			prompt(links, player) {
				return "将一张牌当作" + (get.translation(links[0][3]) || "") + "【" + get.translation(links[0][2]) + "】使用";
			},
		},
		hiddenCard(player, name) {
			if (!lib.inpile.includes(name) || name != "jiu") return false;
			return get.type(name) == "basic" && !player.getStat("skill").olsbweilin && player.countCards("hes");
		},
		ai: {
			fireAttack: true,
			respondSha: true,
			skillTagFilter(player, tag, arg) {
				if (arg == "respond") return false;
				if (player.getStat("skill").olsbweilin || !player.countCards("hes")) return false;
			},
			order(item, player) {
				if (player && _status.event.type == "phase" && player.hasValueTarget({ name: "sha" }, true, true)) {
					let max = 0,
						names = get.inpileVCardList(info => {
							const name = info[2];
							if (name != "sha" && name != "jiu") return false;
							return get.type(name) == "basic";
						});
					names = names.map(namex => {
						return { name: namex[2], nature: namex[3] };
					});
					names.forEach(card => {
						if (player.getUseValue(card) > 0) {
							let temp = get.order(card);
							if (card.name == "jiu") {
								let cards = player.getCards("hs", cardx => get.value(cardx) < 8);
								cards.sort((a, b) => get.value(a) - get.value(b));
								if (!cards.some(cardx => get.name(cardx) == "sha" && !cards.slice(0, 2).includes(cardx))) temp = 0;
							}
							if (temp > max) max = temp;
						}
					});
					if (max > 0) max += 15;
					return max;
				}
				return 0.5;
			},
			result: {
				player(player) {
					if (_status.event.dying) return get.attitude(player, _status.event.dying);
					return 1;
				},
			},
		},
		subSkill: {
			backup: {},
			wusheng: {
				charlotte: true,
				onremove: true,
				mod: {
					cardname(card, player) {
						if (player.getStorage("olsbweilin_wusheng").includes(get.color(card))) return "sha";
					},
				},
				intro: { content: "手牌中所有$牌均视为【杀】" },
			},
		},
	},
	olsbduoshou: {
		init(player) {
			if (player.getHistory("useCard", evt => get.color(evt.card) == "red").length) player.addTempSkill("olsbduoshou_used");
		},
		mod: {
			targetInRange(card, player, target) {
				if (get.color(card) == "red" && !player.hasSkill("olsbduoshou_used")) return true;
			},
		},
		audio: 2,
		trigger: {
			player: "useCard",
			source: "damageSource",
		},
		filter(event, player) {
			if (event.name == "damage") return player.getHistory("sourceDamage").indexOf(event) == 0;
			if (get.color(event.card) == "red" && !player.hasSkill("olsbduoshou_used")) return true;
			return get.type(event.card) == "basic" && player.getHistory("useCard", evt => get.type(evt.card) == "basic").indexOf(event) == 0;
		},
		forced: true,
		async content(event, trigger, player) {
			if (trigger.name == "damage") player.draw();
			else {
				if (get.color(trigger.card) == "red" && !player.hasSkill("olsbduoshou_used")) {
					game.log(trigger.card, "无距离限制");
					player.addTempSkill("olsbduoshou_used");
				}
				if (get.type(trigger.card) == "basic" && player.getHistory("useCard", evt => get.type(evt.card) == "basic").indexOf(trigger) == 0) {
					game.log(trigger.card, "不计入次数上限");
					if (trigger.addCount !== false) {
						trigger.addCount = false;
						const stat = player.stat[player.stat.length - 1].card;
						if (typeof stat[trigger.card.name] === "number") stat[trigger.card.name]--;
					}
				}
			}
		},
		subSkill: { used: { charlotte: true } },
	},
	//OL谋太史慈
	olsbdulie: {
		audio: 2,
		trigger: { target: "useCardToTarget" },
		filter(event, player) {
			if (event.player == player || !event.isFirstTarget || event.targets.length != 1) return false;
			if (player.getAttackRange() <= 0) return;
			return ["basic", "trick"].includes(get.type(event.card));
		},
		prompt2(event, player) {
			return "令" + get.translation(event.card) + "额外结算一次，此牌结算完毕后，你摸等同于你攻击范围的牌";
		},
		check(event, player) {
			const num = Math.min(5, player.getAttackRange());
			if (get.effect(player, event.card, event.player, player) > 0) return true;
			if (event.card.name == "guohe" || event.card.name == "shunshou" || event.card.name == "zhujinqiyuan") return num > (event.effectCount || 0);
			if (!get.tag(event.card, "damage")) return true;
			return num > 1;
		},
		usable: 1,
		async content(event, trigger, player) {
			trigger.getParent().effectCount++;
			player
				.when({ global: "useCardAfter" })
				.filter(evt => evt == trigger.getParent())
				.then(() => {
					const num = Math.min(5, player.getAttackRange());
					if (num > 0) player.draw(num);
				});
		},
	},
	olsbdouchan: {
		audio: 2,
		trigger: { player: "phaseZhunbeiBegin" },
		forced: true,
		async content(event, trigger, player) {
			const card = get.cardPile2(card => card.name == "juedou");
			if (card) player.gain(card, "gain2");
			else if (player.countMark("olsbdouchan") < game.players.length + game.dead.length) player.addMark("olsbdouchan", 1, false);
		},
		mod: {
			attackRange(player, num) {
				return num + player.countMark("olsbdouchan");
			},
			cardUsable(card, player, num) {
				if (card.name == "sha") return num + player.countMark("olsbdouchan");
			},
		},
		intro: { content: "<li>攻击距离+#<br><li>使用【杀】的次数上限+#" },
	},
	//OL谋关羽
	//可以和手杀谋关羽组成卧龙凤雏了
	olsbfumeng: {
		audio: 2,
		trigger: { global: "roundStart" },
		filter(event, player) {
			return player.countCards("h", card => {
				if (_status.connectMode) return true;
				return get.name(card, player) != "sha";
			});
		},
		direct: true,
		async content(event, trigger, player) {
			const {
				result: { bool, cards },
			} = await player
				.chooseCard(get.prompt2("olsbfumeng"), [1, Infinity], (card, player) => {
					return get.name(card, player) != "sha";
				})
				.set("ai", card => {
					const player = get.event("player");
					if (player.hasSkill("olsbfumeng")) return 7 - get.value(card);
					return 4.5 - get.value(card);
				});
			if (!bool) return;
			player.logSkill("olsbfumeng");
			player.addSkill("olsbfumeng_buff");
			player.addGaintag(cards, "olsbfumeng_buff");
		},
		subSkill: {
			buff: {
				charlotte: true,
				mod: {
					cardname: function (card) {
						if (get.itemtype(card) == "card" && card.hasGaintag("olsbfumeng_buff")) return "sha";
					},
				},
			},
		},
	},
	olsbguidao: {
		audio: 2,
		enable: "phaseUse",
		filter(event, player) {
			if (event.olsbguidao_num > 2) return false;
			const card = new lib.element.VCard({ name: "juedou", storage: { olsbguidao: true } });
			return (
				game.hasPlayer(target => {
					return player.canUse(card, target, false);
				}) &&
				player.countCards("he", cardx => {
					return player.canRecast(cardx);
				}) >= 2 &&
				player.countCards("he", cardx => {
					return get.name(cardx, player) == "sha" && player.canRecast(cardx);
				}) >= event.olsbguidao_num
			);
		},
		onChooseToUse(event) {
			if (!game.online && !event.olsbguidao_num) {
				const player = event.player,
					history = player.getHistory("custom", evt => evt.olsbguidao_num);
				if (!history.length) event.set("olsbguidao_num", 1);
				else {
					const evt = history[history.length - 1];
					event.set("olsbguidao_num", evt.olsbguidao_num);
				}
			}
		},
		filterCard(card, player) {
			const num = get.event("olsbguidao_num");
			if (ui.selected.cards.filter(cardx => get.name(cardx, player) == "sha").length < num && get.name(card, player) != "sha") return false;
			return player.canRecast(card);
		},
		selectCard: 2,
		position: "he",
		check(card) {
			const player = get.event("player");
			if (get.name(card, player) == "sha") return 1 / (get.value(card) || 0.5);
			return 7 - get.value(card);
		},
		complexCard: true,
		lose: false,
		discard: false,
		delay: 0,
		filterTarget(card, player, target) {
			const cardx = new lib.element.VCard({ name: "juedou", storage: { olsbguidao: true } });
			return player.canUse(cardx, target, false);
		},
		prompt() {
			let str = "重铸两张牌";
			const num = get.event("olsbguidao_num");
			if (num > 0) str += "（至少重铸" + get.cnNumber(num) + "张【杀】）";
			str += "并视为使用【决斗】";
			return str;
		},
		async content(event, trigger, player) {
			const target = event.target,
				cards = event.cards;
			player.getHistory("custom").push({
				olsbguidao_num: cards.filter(card => get.name(card, player) == "sha").length + 1,
			});
			const card = new lib.element.VCard({ name: "juedou", storage: { olsbguidao: true } });
			await player.recast(cards);
			player.addTempSkill("olsbguidao_buff");
			if (player.canUse(card, target, false)) player.useCard(card, target, false);
		},
		ai: {
			order(item, player) {
				const card = new lib.element.VCard({ name: "juedou", storage: { olsbguidao: true } });
				const order = get.order(card, player);
				if (order <= 0) return 0;
				return order + 0.1;
			},
			result: {
				target(player, target) {
					const card = new lib.element.VCard({
						name: "juedou",
						storage: { olsbguidao: true },
					});
					return get.sgn(get.attitude(player, target)) * get.effect(target, card, player, player);
				},
			},
		},
		subSkill: {
			buff: {
				charlotte: true,
				trigger: { global: "damageBegin3" },
				filter(event, player) {
					if (!event.card || !event.card.storage || !event.card.storage.olsbguidao) return false;
					if (!event.source || event.source != player) return false;
					const evt = event.getParent("useCard");
					return evt.player == player && evt.targets.includes(event.player);
				},
				forced: true,
				popup: false,
				async content(event, trigger, player) {
					const target = trigger.player;
					const {
						result: { control },
					} = await target
						.chooseControl("【杀】更多", "非【杀】更多")
						.set("prompt", "归刀：请猜测" + get.translation(player) + "手牌中【杀】与非【杀】牌数哪个更多")
						.set("prompt2", "若猜错，则" + get.translation(trigger.card) + "对你造成的伤害+1")
						.set("ai", () => _status.event.controls.randomGet());
					const goon1 = player.countCards("h", card => get.name(card, player) == "sha") >= player.countCards("h", card => get.name(card, player) != "sha");
					const goon2 = player.countCards("h", card => get.name(card, player) != "sha") >= player.countCards("h", card => get.name(card, player) == "sha");
					if ((goon1 && control == "【杀】更多") || (goon2 && control == "非【杀】更多")) {
						target.popup("洗具");
						game.log(target, "猜测", "#g正确");
					} else {
						target.popup("杯具");
						game.log(target, "猜测", "#y错误");
						trigger.increase("num");
					}
				},
			},
		},
	},
	//OL谋姜维
	olsbzhuri: {
		audio: 2,
		trigger: {
			player: ["phaseZhunbeiEnd", "phaseJudgeEnd", "phaseDrawEnd", "phaseUseEnd", "phaseDiscardEnd", "phaseJieshuEnd"],
		},
		filter: function (event, player) {
			if (player.hasSkill("olsbzhuri_block")) return false;
			if (!game.hasPlayer(target => player.canCompare(target))) return false;
			return player.getHistory("gain", evt => evt.getParent(event.name) == event).length + player.getHistory("lose", evt => evt.getParent(event.name) == event && evt.hs.length).length;
		},
		direct: true,
		content: function* (event, map) {
			var player = map.player;
			var trigger = map.trigger;
			var result = yield player
				.chooseTarget(get.prompt("olsbzhuri"), "与一名角色进行拼点，若你赢，你可以使用其中的一张拼点牌；若你没赢，你失去1点体力或令此技能于本回合失效", (card, player, target) => {
					return player.canCompare(target);
				})
				.set("ai", target => {
					var player = _status.event.player;
					var ts = target.getCards("h").sort((a, b) => get.number(a) - get.number(b));
					if (get.attitude(player, target) < 0) {
						var hs = player.getCards("h").sort((a, b) => get.number(b) - get.number(a));
						var ts = target.getCards("h").sort((a, b) => get.number(b) - get.number(a));
						if (get.number(hs[0]) > get.number(ts[0])) return 1;
						if (get.effect(player, { name: "losehp" }, player, player) > 0) return Math.random() + 0.2;
						if (player.getHp() > 2) return Math.random() - 0.5;
						return 0;
					}
					return 0;
				});
			if (result.bool) {
				var target = result.targets[0];
				player.logSkill("olsbzhuri", target);
				var result2 = yield player.chooseToCompare(target);
				if (result2.bool) {
					var cards = [result2.player, result2.target].filterInD("d");
					cards = cards.filter(card => player.hasUseTarget(card));
					if (cards.length) {
						var result3 = yield player.chooseButton(["是否使用其中的牌？", cards]).set("ai", button => _status.event.player.getUseValue(button.link));
						if (result3.bool) {
							var card = result3.links[0];
							player.$gain2(card, false);
							game.delayx();
							player.chooseUseTarget(true, card, false);
						}
					}
				} else {
					var list = lib.skill.olsbranji.getList(trigger);
					var result3 = yield player
						.chooseControl("失去体力", "技能失效")
						.set("prompt", "逐日：失去1点体力，或令此技能于本回合失效")
						.set("ai", () => {
							var player = _status.event.player;
							if (player.getHp() > 2) {
								var list = _status.event.list;
								list.removeArray(player.skipList);
								if (list.includes("phaseDraw") || list.includes("phaseUse")) return "失去体力";
							}
							if (get.effect(player, { name: "losehp" }, player, player) > 0) return "失去体力";
							return "技能失效";
						})
						.set("list", list.slice(trigger.getParent().num, list.length));
					player[result3.control == "失去体力" ? "loseHp" : "addTempSkill"](result3.control == "失去体力" ? 1 : "olsbzhuri_block");
				}
			}
		},
		subSkill: {
			block: {
				charlotte: true,
				mark: true,
				marktext: '<span style="text-decoration: line-through;">日</span>',
				intro: { content: "追不动太阳了" },
			},
		},
	},
	olsbranji: {
		audio: 2,
		trigger: { player: "phaseJieshuBegin" },
		prompt2: function (event, player) {
			var str = "获得技能";
			var num = lib.skill.olsbranji.getNum(player);
			if (num >= player.getHp()) str += "【困奋】";
			if (num == player.getHp()) str += "和";
			if (num <= player.getHp()) str += "【诈降】";
			str += "，然后";
			var num1 = player.countCards("h") - player.getHandcardLimit();
			if (num1 || player.isDamaged()) {
				if (num1) str += num1 < 0 ? "摸" + get.cnNumber(-num1) + "张牌" : "弃置" + get.cnNumber(num1) + "张牌";
				if (num1 && player.isDamaged()) str += "或";
				if (player.isDamaged()) str += "回复" + player.getDamagedHp() + "点体力";
				str += "，最后";
			}
			str += "你不能回复体力直到你杀死角色。";
			return str;
		},
		check: function (event, player) {
			var num = lib.skill.olsbranji.getNum(player);
			if (num == player.getHp()) return true;
			return player.getHandcardLimit() - player.countCards("h") >= 3 || player.getDamagedHp() >= 2;
		},
		limited: true,
		skillAnimation: true,
		animationColor: "fire",
		content: function* (event, map) {
			var player = map.player;
			var trigger = map.trigger;
			player.awakenSkill("olsbranji");
			var num = lib.skill.olsbranji.getNum(player);
			const skills = [];
			if (num >= player.getHp()) {
				skills.push("kunfen");
				player.storage.kunfen = true;
			}
			if (num <= player.getHp()) skills.push("zhaxiang");
			player.addSkills(skills);
			if (player.countCards("h") != player.getHandcardLimit() || player.isDamaged()) {
				var result,
					num1 = player.countCards("h") - player.getHandcardLimit();
				if (!num1) result = { index: 1 };
				else if (player.isHealthy()) result = { index: 0 };
				else {
					result = yield player
						.chooseControl("手牌数", "体力值")
						.set("choiceList", [num1 < 0 ? "摸" + get.cnNumber(-num1) + "张牌" : "弃置" + get.cnNumber(num1) + "张牌", "回复" + player.getDamagedHp() + "点体力"])
						.set("ai", () => {
							var player = _status.event.player;
							var list = _status.event.list;
							var num1 = get.effect(player, { name: "draw" }, player, player);
							var num2 = get.recoverEffect(player, player, player);
							return num1 * list[0] > num2 * list[1] ? 0 : 1;
						})
						.set("list", [-num1, player.getDamagedHp()]);
				}
				if (result.index == 0) {
					if (num1 < 0) yield player.drawTo(player.getHandcardLimit());
					else yield player.chooseToDiscard(num1, "h", true);
				} else {
					yield player.recover(player.maxHp - player.hp);
				}
			}
			player.addSkill("olsbranji_norecover");
			player.when({ source: "dieAfter" }).then(() => player.removeSkill("olsbranji_norecover"));
		},
		derivation: ["kunfenx", "zhaxiang"],
		getList: function (event) {
			return event.getParent().phaseList.map(list => list.split("|")[0]);
		},
		getNum: function (player) {
			return player
				.getHistory("useCard", evt => {
					return lib.phaseName.some(name => {
						return evt.getParent(name).name == name;
					});
				})
				.reduce((list, evt) => {
					return list.add(evt.getParent(lib.phaseName.find(name => evt.getParent(name).name == name)));
				}, []).length;
		},
		subSkill: {
			norecover: {
				charlotte: true,
				mark: true,
				intro: { content: "不能回复体力" },
				trigger: { player: "recoverBefore" },
				forced: true,
				firstDo: true,
				content: function () {
					trigger.cancel();
				},
				ai: {
					effect: {
						target: function (card, player, target) {
							if (get.tag(card, "recover")) return "zeroplayertarget";
						},
					},
				},
			},
		},
	},
	kunfenx: {
		audio: "kunfen",
		audioname2: { ol_sb_jiangwei: "kunfen_ol_sb_jiangwei" },
	},
	kunfen_ol_sb_jiangwei: { audio: 1 },
	zhaxiang_ol_sb_jiangwei: { audio: 1 },
	//界曹彰
	oljiangchi: {
		audio: "rejiangchi",
		trigger: { player: "phaseDrawEnd" },
		direct: true,
		content: function* (event, map) {
			var player = map.player;
			var choiceList = ["摸一张牌，本回合使用【杀】的次数上限-1，且【杀】不计入手牌上限。", "重铸一张牌，本回合使用【杀】无距离限制，且使用【杀】的次数上限+1。"],
				list = ["cancel2"];
			if (player.countCards("he", card => player.canRecast(card))) list.unshift("重铸，+1");
			else choiceList[1] = '<span style="opacity:0.5">' + choiceList[1] + "</span>";
			list.unshift("摸牌，-1");
			var result = yield player
				.chooseControl(list)
				.set("ai", () => {
					var player = _status.event.player;
					var controls = _status.event.controls.slice();
					if (controls.includes("重铸，+1") && player.countCards("hs", card => get.name(card) == "sha" && player.hasValueTarget(card)) >= 2) return "重铸，+1";
					return "摸牌，-1";
				})
				.set("choiceList", choiceList)
				.set("prompt", get.prompt("oljiangchi"));
			if (result.control != "cancel2") {
				player.logSkill("oljiangchi");
				if (result.control == "摸牌，-1") {
					player.draw();
					player.addTempSkill("oljiangchi_less");
					player.addMark("oljiangchi_less", 1, false);
				} else {
					var result2 = yield player.chooseCard("he", "将驰：请重铸一张牌", true, (card, player) => player.canRecast(card));
					if (result2.bool) {
						player.recast(result2.cards);
						player.addTempSkill("oljiangchi_more");
						player.addMark("oljiangchi_more", 1, false);
					}
				}
			}
		},
		subSkill: {
			less: {
				charlotte: true,
				onremove: true,
				mod: {
					cardUsable: function (card, player, num) {
						if (card.name == "sha") return num - player.countMark("oljiangchi_less");
					},
					ignoredHandcard: function (card, player) {
						if (card.name == "sha") return true;
					},
					cardDiscardable: function (card, player, name) {
						if (name == "phaseDiscard" && card.name == "sha") return false;
					},
				},
			},
			more: {
				charlotte: true,
				onremove: true,
				mod: {
					cardUsable: function (card, player, num) {
						if (card.name == "sha") return num + player.countMark("oljiangchi_more");
					},
					targetInRange: function (card, player) {
						if (card.name == "sha") return true;
					},
				},
			},
		},
	},
	//界简雍
	olqiaoshui: {
		audio: "reqiaoshui",
		inherit: "reqiaoshui",
		filter(event, player) {
			return player.countCards("h") > 0 && !player.hasSkill("olqiaoshui_used");
		},
		async content(event, trigger, player) {
			const target = event.target;
			const result = await player.chooseToCompare(target).forResult();
			if (result.bool) player.addTempSkill("qiaoshui3", { player: "phaseUseAfter" });
			else {
				player.addTempSkill("qiaoshui2");
				player.addTempSkill("olqiaoshui_used");
			}
		},
		subSkill: {
			used: {
				charlotte: true,
				mark: true,
				marktext: '<span style="text-decoration: line-through;">说</span>',
				intro: { content: "被迫闭嘴" },
			},
		},
	},
	//界凌统
	olxuanfeng: {
		audio: "xuanfeng",
		audioname: ["boss_lvbu3"],
		audioname2: {
			lingtong: "xuanfeng",
			ol_lingtong: "xuanfeng_re_lingtong",
		},
		trigger: {
			player: ["loseAfter"],
			global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"],
		},
		filter(event, player) {
			const evt = event.getl(player);
			return evt && (evt.es.length || evt.cards2.length > 1);
		},
		getIndex: () => 2,
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt("olxuanfeng"), "弃置一名其他角色的一张牌", (card, player, target) => {
					if (player == target) return false;
					return target.countDiscardableCards(player, "he");
				})
				.set("ai", target => {
					const player = get.event("player");
					return get.effect(target, { name: "guohe_copy2" }, player, player);
				})
				.forResult();
		},
		content() {
			const target = event.targets[0];
			player.discardPlayerCard(target, "he", true);
		},
		ai: {
			reverseEquip: true,
			noe: true,
			effect: {
				target: function (card, player, target, current) {
					if (get.type(card) == "equip" && !get.cardtag(card, "gifts")) return [1, 3];
				},
			},
		},
	},
	xuanfeng_re_lingtong: { audio: 2 },
};

export default skills;
