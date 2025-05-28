import { lib, game, ui, get, ai, _status } from "../../noname.js";

/** @type { importCharacterConfig['skill'] } */
const skills = {
	//疑包
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
					if (result.winner) {
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
						if (moved[0].includes(from.link)) {
							let num = [1, 2, 3].find(i => moved[i].includes(to.link));
							return get[list[num]](from.link) == get.event(list[num]);
						}
						let numx = [1, 2, 3].find(i => moved[i].includes(from.link));
						return get[list[numx]](to.link) == get.event(list[numx]);
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
				if (result2.winner == target) {
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
							if (evt.getParent("useCard", true, true) != trigger || !cards.some(card => get.suit(card) == "spade")) {
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
				targetx.addAdditionalSkill(skillName, ["shefu2"], true);
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
						let cards = player.getExpansions("shefu");
						if (cards.length) {
							await player.loseToDiscardpile(cards);
						}
						player.unmarkSkill("shefu");
					});
				if (targetx.countCards("he")) {
					let list = get.inpileVCardList(info => ["basic", "trick"].includes(get.type2(info[2])));
					const result = await targetx
						.chooseButton(["设伏", [list, "vcard"]], true)
						.set("filterButton", function (button) {
							let player = _status.event.player;
							if (player.storage?.shefu2?.includes(button.link[2])) {
								return false;
							}
							return true;
						})
						.set("ai", function (button) {
							let rand = _status.event.rand;
							switch (button.link[2]) {
								case "sha":
									return 5 + rand[1];
								case "tao":
									return 4 + rand[2];
								case "lebu":
									return 3 + rand[3];
								case "shan":
									return 4.5 + rand[4];
								case "wuzhong":
									return 4 + rand[5];
								case "shunshou":
									return 3 + rand[6];
								case "nanman":
									return 2 + rand[7];
								case "wanjian":
									return 2 + rand[8];
								default:
									return rand[0];
							}
						})
						.set("rand", [Math.random(), Math.random(), Math.random(), Math.random(), Math.random(), Math.random(), Math.random(), Math.random(), Math.random()])
						.forResult();
					if (result.bool) {
						const name = result.links[0][2];
						targetx.logSkill("shefu");
						const result2 = await targetx.chooseCard("he", "选择一张牌作为“伏兵”", true).forResult();
						if (result2.bool) {
							const card = result2.cards[0];
							const next = targetx.addToExpansion(card, targetx, "give");
							next.gaintag.add("shefu");
							await next;
							if (targetx.getExpansions("shefu").includes(card)) {
								targetx.markAuto("shefu", card);
								targetx.markAuto("shefu2", name);
								if (targetx.isOnline2()) {
									targetx.send(function (storage) {
										game.me.storage.shefu2 = storage;
									}, targetx.storage.shefu2);
								}
								targetx.syncStorage("shefu");
								targetx.markSkill("shefu");
							}
						}
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
		derivation: "shefu",
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
			event.target.sortBySeat();
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
					let cards = list[0][1],
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
						case "phaseJieshu":
							target = target.next;
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
			let bool1 = get.sgn(event.player.countCards("h") - event.source.countCards("h")),
				bool2 = get.sgn(event.player.hp - event.source.hp);
			return !player.getStorage("sxrmyihe_used").includes(bool1 == bool2);
		},
		logTarget: "player",
		check(event, player) {
			let bool1 = get.sgn(event.player.countCards("h") - event.source.countCards("h")),
				bool2 = get.sgn(event.player.hp - event.source.hp);
			if (get.attitude(player, event.player) > 0) {
				return bool1 == bool2 && get.attitude(player, event.source) >= 0;
			}
			return bool1 != bool2;
		},
		prompt2(event, player) {
			let bool1 = get.sgn(event.player.countCards("h") - event.source.countCards("h")),
				bool2 = get.sgn(event.player.hp - event.source.hp);
			if (bool1 == bool2) {
				return `令其和${get.translation(event.source)}依次摸两张牌`;
			}
			return "令此伤害+1";
		},
		async content(event, trigger, player) {
			let bool1 = get.sgn(trigger.player.countCards("h") - trigger.source.countCards("h")),
				bool2 = get.sgn(trigger.player.hp - trigger.source.hp);
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
};

export default skills;
