import { lib, game, ui, get, ai, _status } from "noname";
import html from "dedent";

/** @type { importCharacterConfig["skill"] } */
const skills = {
	//祖郎
	xkxijun: {
		enable: ["chooseToUse", "chooseToRespond"],
		trigger: { player: "damageEnd" },
		filter(event, player) {
			if (player.countMark("xkxijun_used") >= 2) {
				return false;
			}
			if (!player.countCards("hes", { color: "black" })) {
				return false;
			}
			if (event.name == "damage") {
				return ["sha", "juedou"].some(name => player.countCards("hes", card => get.color(card) == "black" && player.hasUseTarget(get.autoViewAs({ name: name }, [card]), false, false)));
			}
			if (!player.isPhaseUsing()) {
				return false;
			}
			return ["sha", "juedou"].some(name => event.filterCard(get.autoViewAs({ name: name }, "unsure"), player, event));
		},
		direct: true,
		async content(event, trigger, player) {
			const result = await player
				.chooseButton([
					get.prompt2("xkxijun"),
					[
						[
							["基本", "", "sha"],
							["锦囊", "", "juedou"],
						],
						"vcard",
					],
				])
				.set("filterButton", button => {
					const name = button.link[2],
						player = get.player();
					return player.countCards("hes", card => get.color(card) == "black" && player.hasUseTarget(get.autoViewAs({ name: name }, [card]), false, false));
				})
				.set("ai", button => {
					const name = button.link[2],
						player = get.player();
					return player.getUseValue({ name: name });
				})
				.forResult();
			if (!result?.bool || !result?.links?.length) {
				return;
			}
			const card = { name: result.links[0][2], storage: { xkxijun: true } };
			game.broadcastAll(card => {
				lib.skill.xkxijun_backup.viewAs = card;
			}, card);
			const next = player.chooseToUse();
			next.set("openskilldialog", "袭军：是否将一张黑色牌当做" + get.translation(card) + "使用？");
			next.set("norestore", true);
			next.set("addCount", false);
			next.set("_backupevent", "xkxijun_backup");
			next.set("custom", {
				add: {},
				replace: { window() {} },
			});
			next.backup("xkxijun_backup");
			await next;
		},
		chooseButton: {
			dialog(event, player) {
				const list = [];
				for (const name of ["sha", "juedou"]) {
					if (event.filterCard(get.autoViewAs({ name: name }, "unsure"), player, event)) {
						list.push([get.type(name), "", name]);
					}
				}
				return ui.create.dialog("袭军", [list, "vcard"]);
			},
			check(button) {
				const player = _status.event.player;
				return player.getUseValue({
					name: button.link[2],
				});
			},
			backup(links, player) {
				const backup = get.copy(lib.skill["xkxijun_backup"]);
				backup.viewAs = { name: links[0][2], storage: { xkxijun: true } };
				return backup;
			},
			prompt(links, player) {
				return "将一张黑色牌当做" + get.translation(links[0][2]) + "使用或打出";
			},
		},
		hiddenCard(player, name) {
			if (!player.isPhaseUsing()) {
				return false;
			}
			if (!["sha", "juedou"].includes(name)) {
				return false;
			}
			return player.countMark("xkxijun_used") < 2 && player.countCards("hes", { color: "black" });
		},
		ai: {
			respondSha: true,
			skillTagFilter(player) {
				if (!player.isPhaseUsing()) {
					return false;
				}
				if (player.countMark("xkxijun_used") >= 2 || !player.countCards("hes", { color: "black" })) {
					return false;
				}
			},
			order: 1,
			result: { player: 1 },
		},
		group: "xkxijun_effect",
		subSkill: {
			norecover: {
				charlotte: true,
				mark: true,
				intro: { content: "不能回复体力" },
				trigger: { player: "recoverBefore" },
				forced: true,
				firstDo: true,
				content() {
					trigger.cancel();
				},
				ai: {
					effect: {
						target(card, player, target) {
							if (get.tag(card, "recover")) {
								return "zeroplayertarget";
							}
						},
					},
				},
			},
			effect: {
				trigger: { global: "damageEnd" },
				filter(event, player) {
					if (!event.player.isIn()) {
						return false;
					}
					return event.card?.storage?.xkxijun;
				},
				firstDo: true,
				logTarget: "player",
				forced: true,
				async content(event, trigger, player) {
					event.targets[0].addTempSkill("xkxijun_norecover");
				},
			},
			used: {
				onremove: true,
				charlotte: true,
			},
			backup: {
				audio: "xkxijun",
				filterCard: card => get.itemtype(card) == "card" && get.color(card) == "black",
				popname: true,
				check(card) {
					return 8 - get.value(card);
				},
				position: "hes",
				async precontent(event, trigger, player) {
					player.addTempSkill("xkxijun_used");
					player.addMark("xkxijun_used", 1, false);
				},
			},
		},
	},
	xkhaokou: {
		trigger: {
			global: "phaseBefore",
			player: "enterGame",
		},
		groupSkill: "qun",
		forced: true,
		filter(event, player) {
			if (player.group != "qun") {
				return false;
			}
			return event.name != "phase" || game.phaseNumber == 0;
		},
		async content(event, trigger, player) {
			await lib.skill.xk_qiyijun.qiyi(player);
		},
		group: "xkhaokou_change",
		subSkill: {
			change: {
				trigger: {
					player: "removeQiyi",
				},
				groupSkill: "qun",
				forced: true,
				filter(event, player) {
					if (player.group != "qun") {
						return false;
					}
					return true;
				},
				async content(event, trigger, player) {
					player.changeGroup("wu");
				},
			},
		},
	},
	xkronggui: {
		groupSkill: "wu",
		trigger: {
			global: "useCardToPlayer",
		},
		filter(event, player) {
			if (event.player.group != "wu" || player.group != "wu") {
				return false;
			}
			if (!event.isFirstTarget) {
				return false;
			}
			if (!(event.card.name == "juedou" || (event.card.name == "sha" && get.color(event.card) == "red"))) {
				return false;
			}
			if (!player.countCards("he", { type: "basic" })) {
				return false;
			}
			if (
				game.hasPlayer(current => {
					return !event.targets.includes(current) && lib.filter.targetEnabled2(event.card, event.player, current);
				})
			) {
				return true;
			}
			return false;
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseCardTarget({
					prompt: get.prompt2(event.skill),
					filterCard(card, player) {
						return get.type(card) == "basic" && lib.filter.canBeDiscarded(card, player, player);
					},
					filterTarget(card, player, target) {
						const trigger = get.event().getTrigger();
						return !trigger.targets.includes(target) && lib.filter.targetEnabled2(trigger.card, trigger.player, target);
					},
					ai1(card) {
						return 6 - get.value(card);
					},
					ai2(target) {
						const trigger = get.event().getTrigger(),
							player = get.player();
						return get.effect(target, trigger.card, trigger.player, player);
					},
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const { cards, targets } = event;
			await player.discard(cards);
			trigger.targets.addArray(targets);
		},
	},
	//彭绮
	xkjushou: {
		trigger: {
			global: "phaseBefore",
			player: "enterGame",
		},
		forced: true,
		filter(event, player) {
			return event.name != "phase" || game.phaseNumber == 0;
		},
		async content(event, trigger, player) {
			await lib.skill.xk_qiyijun.qiyi(player);
			if (
				game.hasPlayer(target => {
					return target.getSeatNum() !== 1 && !target.hasSkill("xk_qiyijun") && target != player;
				})
			) {
				const result = await player
					.chooseTarget("聚首：令至多两名其他角色选择是否成为起义军", [1, 2], true, function (card, player, target) {
						return target.getSeatNum() !== 1 && !target.hasSkill("xk_qiyijun") && target != player;
					})
					.set("ai", target => Math.random())
					.forResult();
				if (result.bool && result.targets) {
					for (const target of result.targets) {
						const result2 = await target.chooseBool(`是否响应${get.translation(player)}的号召，成为起义军？`).forResult();
						if (result2.bool) {
							await lib.skill.xk_qiyijun.qiyi(target);
						} else {
							player.line(target, "green");
							await player.gainPlayerCard(target, "h", true);
						}
					}
				}
			}
		},
	},
	xkliaoluan: {
		global: "xkliaoluan_global",
		subSkill: {
			global: {
				enable: "phaseUse",
				filter(event, player) {
					if (!game.hasPlayer(current => current.hasSkill("xkliaoluan"))) {
						return false;
					}
					if (!player.hasSkill("xk_qiyijun")) {
						return false;
					}
					if (player.hasSkill("xkliaoluan_used")) {
						return false;
					}
					return game.hasPlayer(current => !current.hasSkill("xk_qiyijun") && player.inRange(current));
				},
				filterTarget(card, player, target) {
					return !target.hasSkill("xk_qiyijun") && player.inRange(target);
				},
				async content(event, trigger, player) {
					player.addSkill("xkliaoluan_used");
					await player.turnOver();
					await event.target.damage();
				},
				ai: {
					order: 1,
					result: {
						target: -1,
						player(player, target) {
							if (player.isTurnedOver()) {
								return 1;
							}
							return -1;
						},
					},
				},
			},
			used: {
				charlotte: true,
			},
		},
	},
	xkhuaying: {
		trigger: {
			global: "dieAfter",
		},
		filter(event, player) {
			if (!event.player.hasSkill("xk_qiyijun")) {
				return false;
			}
			if (!event.source || event.source == event.player) {
				return false;
			}
			return game.hasPlayer(current => current.hasSkill("xk_qiyijun"));
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt2(event.skill), (card, player, target) => {
					return target.hasSkill("xk_qiyijun");
				})
				.set("ai", target => {
					const player = get.player();
					let eff = get.attitude(player, target);
					if (eff <= 0) {
						return 0;
					}
					if (target.isTurnedOver()) {
						eff *= 2;
					}
					if (target.isLinked()) {
						eff += 2;
					}
					if (target.hasSkill("xkliaoluan_used")) {
						eff += 2;
					}
					return eff;
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			if (target.isTurnedOver()) {
				await target.turnOver(false);
			}
			if (target.isLinked()) {
				await target.link(false);
			}
			if (target.hasSkill("xkliaoluan_used")) {
				target.removeSkill("xkliaoluan_used");
			}
		},
	},
	xkjizhong: {
		locked: true,
		global: "xkjizhong_global",
		subSkill: {
			global: {
				trigger: { player: "phaseDrawBegin2" },
				forced: true,
				filter(event, player) {
					if (!player.hasSkill("xk_qiyijun")) {
						return false;
					}
					if (!game.hasPlayer(current => current.hasSkill("xkjizhong"))) {
						return false;
					}
					return !event.numFixed;
				},
				async content(event, trigger, player) {
					trigger.num += game.countPlayer(current => current.hasSkill("xkjizhong"));
				},
				mod: {
					globalFrom(from, to, distance) {
						if (!from.hasSkill("xk_qiyijun")) {
							return;
						}
						const num = game.countPlayer(current => current.hasSkill("xkjizhong"));
						return distance - num;
					},
				},
			},
		},
	},
	//单福
	xkbimeng: {
		enable: "phaseUse",
		filter(event, player) {
			if (player.countCards("hs") < player.hp || player.hasSkill("xkbimeng_used")) {
				return false;
			}
			for (var i of lib.inpile) {
				var type = get.type(i);
				if ((type == "basic" || type == "trick") && event.filterCard(get.autoViewAs({ name: i }, "unsure"), player, event)) {
					return true;
				}
			}
			return false;
		},
		chooseButton: {
			dialog(event, player) {
				var list = [];
				for (var i = 0; i < lib.inpile.length; i++) {
					var name = lib.inpile[i];
					if (name == "sha") {
						if (event.filterCard(get.autoViewAs({ name }, "unsure"), player, event)) {
							list.push(["基本", "", "sha"]);
						}
						for (var nature of lib.inpile_nature) {
							if (event.filterCard(get.autoViewAs({ name, nature }, "unsure"), player, event)) {
								list.push(["基本", "", "sha", nature]);
							}
						}
					} else if (get.type(name) == "trick" && event.filterCard(get.autoViewAs({ name }, "unsure"), player, event)) {
						list.push(["锦囊", "", name]);
					} else if (get.type(name) == "basic" && event.filterCard(get.autoViewAs({ name }, "unsure"), player, event)) {
						list.push(["基本", "", name]);
					}
				}
				return ui.create.dialog("弊蒙", [list, "vcard"]);
			},
			check(button) {
				if (_status.event.getParent().type != "phase") {
					return 1;
				}
				const player = _status.event.player;
				return player.getUseValue({
					name: button.link[2],
					nature: button.link[3],
				});
			},
			backup(links, player) {
				return {
					filterCard: true,
					audio: "xkbimeng",
					popname: true,
					check(card) {
						return 8 - get.value(card);
					},
					selectCard() {
						const player = get.player();
						return player.hp;
					},
					position: "hs",
					viewAs: { name: links[0][2], nature: links[0][3] },
					precontent() {
						player.addTempSkill("xkbimeng_used", "phaseUseAfter");
					},
				};
			},
			prompt(links, player) {
				return "将" + get.cnNumber(player.hp) + "张牌当做" + (get.translation(links[0][3]) || "") + get.translation(links[0][2]) + "使用";
			},
		},
		ai: {
			fireAttack: true,
			skillTagFilter(player) {
				if (player.countCards("sh") < player.hp || player.hasSkill("xkbimeng_used")) {
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
		},
	},
	xkzhue: {
		groupSkill: "qun",
		usable: 1,
		trigger: {
			global: "useCard",
		},
		filter(event, player) {
			if (event.player.group != "qun" || player.group != "qun") {
				return false;
			}
			if (get.type(event.card) == "equip") {
				return false;
			}
			return true;
		},
		check(event, player) {
			if (get.attitude(player, event.player) <= 0) {
				return false;
			}
			if (!get.tag(event.card, "damage")) {
				return true;
			}
			if (!event.targets?.length) {
				return false;
			}
			let eff = 0;
			for (let target of event.targets) {
				eff += get.effect(target, event.card, event.player, player);
			}
			return eff >= 5;
		},
		logTarget: "player",
		async content(event, trigger, player) {
			await trigger.player.draw();
			trigger.directHit.addArray(game.players);
			player
				.when({ global: "useCardAfter" })
				.filter(evt => evt.card == trigger.card)
				.step(async (event, trigger, player) => {
					if (game.hasPlayer2(current => current.hasHistory("damage", evt => evt.card == trigger.card))) {
						await player.changeGroup("shu");
					}
				});
		},
	},
	xkfuzhu: {
		groupSkill: "shu",
		usable: 1,
		trigger: {
			global: "useCardAfter",
		},
		filter(event, player) {
			if (player.group != "shu") {
				return false;
			}
			return player.countCards("he") && get.is.convertedCard(event.card);
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseCard(get.prompt2(event.skill, trigger.player), "he")
				.set("ai", card => {
					const player = get.player(),
						trigger = get.event().getTrigger();
					if (get.attitude(player, trigger.player) <= 0) {
						return 0;
					}
					if (get.type2(card) != "trick") {
						return 4 - get.value(card);
					}
					return trigger.player.getUseValue(card);
				})
				.forResult();
			event.result.targets = [trigger.player];
		},
		async content(event, trigger, player) {
			const { cards, targets } = event;
			player.$throw(get.position(cards[0]) == "e" ? cards[0] : 1, 1000);
			game.log(player, "将", get.position(cards[0]) == "e" ? cards[0] : "#y一张手牌", "置于了牌堆顶");
			await player.lose(cards, ui.cardPile, "insert");
			game.updateRoundNumber();
			const cardx = game.cardsGotoOrdering(get.cards(4)).cards,
				target = targets[0];
			await player.showCards(cardx, get.translation(player) + "发动了【辅主】");
			let putback = [];
			for (let card of cardx) {
				if (get.type2(card) == "trick" && target.hasUseTarget(card)) {
					await target.chooseUseTarget(card, true);
				} else {
					putback.push(card);
				}
			}
			if (putback.length) {
				const next = player.chooseToMove("辅主：点击或拖动将牌置于牌堆顶或牌堆底", true);
				next.set("list", [["牌堆顶", putback], ["牌堆底"]]);
				next.set("processAI", function (list) {
					const cards = list[0][1].slice(0).sort(function (a, b) {
						return get.value(b) - get.value(a);
					});
					return [cards, []];
				});
				const result = await next.forResult();
				if (result?.bool) {
					const top = result.moved[0],
						bottom = result.moved[1];
					top.reverse();
					await game.cardsGotoPile(top.concat(bottom), ["top_cards", top], (event, card) => {
						if (event.top_cards.includes(card)) {
							return ui.cardPile.firstChild;
						}
						return null;
					});
					await game.delayx();
				}
			}
		},
	},
	//彭虎
	xkjuqian: {
		trigger: {
			global: "phaseBefore",
			player: "enterGame",
		},
		forced: true,
		filter(event, player) {
			return event.name != "phase" || game.phaseNumber == 0;
		},
		async content(event, trigger, player) {
			await lib.skill.xk_qiyijun.qiyi(player);
			if (
				game.hasPlayer(target => {
					return target.getSeatNum() !== 1 && !target.hasSkill("xk_qiyijun") && target != player;
				})
			) {
				const result = await player
					.chooseTarget("聚黔：令至多两名其他角色选择是否成为起义军", [1, 2], true, function (card, player, target) {
						return target.getSeatNum() !== 1 && !target.hasSkill("xk_qiyijun") && target != player;
					})
					.set("ai", target => Math.random())
					.forResult();
				if (result.bool && result.targets) {
					for (const target of result.targets) {
						const result2 = await target.chooseBool(`是否响应${get.translation(player)}的号召，成为起义军？`).forResult();
						if (result2.bool) {
							await lib.skill.xk_qiyijun.qiyi(target);
						} else {
							player.line(target, "green");
							await target.damage(player);
						}
					}
				}
			}
		},
	},
	xkkanpo: {
		trigger: {
			source: "damageSource",
		},
		filter(event, player) {
			if (!game.hasPlayer(current => current.hasSkill("xk_qiyijun"))) {
				return false;
			}
			return !event.player.isIn() || event.player.hp <= player.hp;
		},
		forced: true,
		usable: 1,
		async content(event, trigger, player) {
			const num = game.countPlayer(current => current.hasSkill("xk_qiyijun"));
			await player.draw(num);
		},
	},
	xkyizhong: {
		trigger: {
			global: "becomeQiyi",
		},
		filter(event, player) {
			return event.player.hujia < 5;
		},
		logTarget: "player",
		forced: true,
		async content(event, trigger, player) {
			await trigger.player.changeHujia(1, null, true);
		},
	},
	//崔廉
	xktanlu: {
		trigger: {
			global: "phaseBegin",
		},
		logTarget: "player",
		filter(event, player) {
			return event.player != player;
		},
		check(event, player) {
			return get.attitude(player, event.player) < 0;
		},
		async content(event, trigger, player) {
			const target = trigger.player,
				num = Math.abs(target.hp - player.hp);
			let result;
			if (num == 0 || num > target.countCards("h")) {
				result = {
					index: 1,
				};
			} else {
				result = await target
					.chooseControl("交给牌", "造成伤害")
					.set("prompt", "贪赂：请选择一项")
					.set("choiceList", [`交给${get.translation(player)}${get.cnNumber(num)}张手牌`, `令${get.translation(player)}对你造成1点伤害，然后弃置其一张手牌`])
					.set("target", player)
					.set("ai", () => {
						const { player, target } = get.event();
						const eff1 = get.effect(player, { name: "shunshou_copy2" }, target, player),
							eff2 = get.damageEffect(player, target, player) + get.effect(target, { name: "guohe_copy2" }, player, player);
						if (eff1 >= eff2) {
							return "交给牌";
						}
						return "造成伤害";
					})
					.forResult();
			}
			if (result.index == 0) {
				await target.chooseToGive(player, "h", num, true);
			} else {
				await target.damage(player);
				await target.discardPlayerCard(player, "h", true);
			}
		},
	},
	xkjubian: {
		trigger: { player: "damageBegin4" },
		filter(event, player) {
			return player.countCards("h") > player.hp;
		},
		forced: true,
		async content(event, trigger, player) {
			await player.chooseToDiscard("h", true, player.countCards("h") - player.hp, "allowChooseAll");
			trigger.cancel();
		},
	},
	//罗历
	xkjuluan: {
		trigger: {
			global: "phaseBefore",
			player: "enterGame",
		},
		forced: true,
		filter(event, player) {
			return event.name != "phase" || game.phaseNumber == 0;
		},
		async content(event, trigger, player) {
			await lib.skill.xk_qiyijun.qiyi(player);
			if (
				game.hasPlayer(target => {
					return target.getSeatNum() !== 1 && !target.hasSkill("xk_qiyijun") && target != player;
				})
			) {
				const result = await player
					.chooseTarget("聚乱：令至多两名其他角色选择是否成为起义军", [1, 2], true, function (card, player, target) {
						return target.getSeatNum() !== 1 && !target.hasSkill("xk_qiyijun") && target != player;
					})
					.set("ai", target => Math.random())
					.forResult();
				if (result.bool && result.targets) {
					for (const target of result.targets) {
						const result2 = await target.chooseBool(`是否响应${get.translation(player)}的号召，成为起义军？`).forResult();
						if (result2.bool) {
							await lib.skill.xk_qiyijun.qiyi(target);
						} else {
							player.line(target, "green");
							await player.discardPlayerCard(target, "h", true);
						}
					}
				}
			}
		},
		group: "xkjuluan_damage",
		subSkill: {
			damage: {
				trigger: {
					source: "damageBegin1",
					player: "damageBegin3",
				},
				forced: true,
				filter(event, player, name) {
					const key = name == "damageBegin1" ? "sourceDamage" : "damage";
					return player.getHistory(key).length == 1;
				},
				async content(event, trigger, player) {
					trigger.num++;
				},
			},
		},
	},
	xkxianxing: {
		trigger: { player: "useCardToPlayered" },
		filter(event, player) {
			if (!event.targets || event.targets.length != 1) {
				return false;
			}
			if (event.target == player) {
				return false;
			}
			if (!event.card || !get.is.damageCard(event.card)) {
				return false;
			}
			return player.isPhaseUsing();
		},
		logTarget: "target",
		async content(event, trigger, player) {
			player.addTempSkill(event.name + "_used");
			player.addMark(event.name + "_used", 1, false);
			const num = player.countMark(event.name + "_used");
			await player.draw(num);
			if (num > 1) {
				player
					.when("useCardAfter")
					.filter(evt => evt.card == trigger.card)
					.step(async () => {
						if (!game.hasPlayer2(current => current.hasHistory("damage", evt => evt.card == trigger.card))) {
							const { index } = await player
								.chooseControl(`失去${num - 1}点体力`, "此技能本回合失效")
								.set("prompt", "险行：选择一项")
								.set("ai", () => {
									if (get.event().num > 1) {
										return 1;
									}
									return [0, 1].randomGet();
								})
								.set("num", num)
								.forResult();
							if (index == 0) {
								await player.loseHp(num - 1);
							} else {
								player.tempBanSkill("xkxianxing");
							}
						}
					});
			}
		},
		subSkill: {
			used: {
				charlotte: true,
				onremove: true,
				intro: {
					content: "已发动过#次",
				},
			},
		},
	},
	xk_qiyijun: {
		charlotte: true,
		nopop: true,
		forced: true,
		trigger: {
			player: "phaseEnd",
		},
		filter(event, player) {
			if (player.hasHistory("sourceDamage", evt => evt.player && !evt.player.hasSkill("xk_qiyijun"))) {
				return false;
			}
			if (
				player.hasHistory(
					"useCard",
					evt =>
						evt.card.name == "sha" &&
						evt.targets?.some(target => {
							return !target.hasSkill("xk_qiyijun");
						})
				)
			) {
				return false;
			}
			return true;
		},
		async content(event, trigger, player) {
			const result = await player
				.chooseControl("失去“起义军”", "失去1点体力")
				.set("prompt", "起义军：请选择一项")
				.set("choiceList", ["失去“起义军”并弃置所有手牌", "失去1点体力"])
				.set("ai", () => {
					if (player.hp <= 1) {
						return "失去“起义军”";
					}
					return ["失去“起义军”", "失去1点体力"].randomGet();
				})
				.forResult();
			if (result.index == 0) {
				await lib.skill.xk_qiyijun.unQiyi(player);
				const hs = player.getDiscardableCards(player, "h");
				if (hs.length) {
					await player.discard(hs);
				}
			} else {
				await player.loseHp();
			}
		},
		mod: {
			cardUsable(card, player, num) {
				if (card.name == "sha") {
					return num + 1;
				}
			},
		},
		global: "xk_qiyijun_effect",
		qiyi(player) {
			player.addSkill("xk_qiyijun");
			player.markSkillCharacter("xk_qiyijun", "shibing1", "起义军", "已决定起义<br>未起义的角色对你使用【杀】次数+1");
			const next = game.createEvent("becomeQiyi");
			next.player = player;
			next.setContent("emptyEvent");
			return next;
		},
		unQiyi(player) {
			player.removeSkill("xk_qiyijun");
			const next = game.createEvent("removeQiyi");
			next.player = player;
			next.setContent("emptyEvent");
			return next;
		},
		subSkill: {
			effect: {
				trigger: {
					player: "useCard",
				},
				filter(event, player) {
					if (!player.isPhaseUsing() || event.card.name != "sha") {
						return false;
					}
					player._countPrenum = true;
					const num = player.getCardUsable("sha");
					delete player._countPrenum;
					if (num >= 0) {
						return false;
					}
					return event.targets?.some(target => target.hasSkill("xk_qiyijun"));
				},
				charlotte: true,
				direct: true,
				async content(event, trigger, player) {
					if (!player.getStorage("xk_qiyijun").length) {
						player.when({ global: ["phaseBefore", "phaseAfter", "phaseUseBefore", "phaseUseAfter"] }).step(async () => {
							player.unmarkAuto("xk_qiyijun", player.getStorage("xk_qiyijun"));
						});
					}
					player.markAuto(
						"xk_qiyijun",
						trigger.targets.filter(target => target.hasSkill("xk_qiyijun"))
					);
				},
				mod: {
					cardUsable(card, player, num) {
						if (player._countPrenum || player.hasSkill("xk_qiyijun")) {
							return;
						}
						if (card.name == "sha") {
							return num + game.countPlayer(current => current.hasSkill("xk_qiyijun"));
						}
					},
					playerEnabled(card, player, target) {
						if (card.name != "sha") {
							return;
						}
						player._countPrenum = true;
						const num = player.getCardUsable(card);
						delete player._countPrenum;
						if (num > 0) {
							return;
						}
						if (game.checkMod(card, player, target, false, "cardUsableTarget", player)) {
							return;
						}
						if (player.getStorage("xk_qiyijun").includes(target)) {
							return false;
						}
						if (!target.hasSkill("xk_qiyijun")) {
							return false;
						}
					},
				},
			},
		},
	},
};

export default skills;
