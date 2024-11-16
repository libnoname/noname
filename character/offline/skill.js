import { lib, game, ui, get, ai, _status } from "../../noname.js";

/** @type { importCharacterConfig['skill'] } */
const skills = {
	//祖郎
	xkxijun: {
		enable: ["chooseToUse", "chooseToRespond"],
		trigger: {
			player: "damageEnd",
		},
		filter(event, player) {
			if (player.countMark("xkxijun_used") >= 2) return false;
			if (!player.countCards("hes", { color: "black" })) return false;
			if (event?.name == "damage") return true;
			if (!player.isPhaseUsing()) return false;
			for (const name of ["sha", "juedou"]) {
				if (event.filterCard(get.autoViewAs({ name: name }, "unsure"), player, event)) return true;
			}
			return false;
		},
		direct: true,
		async content(event, trigger, player) {
			const result = await player
				.chooseButton([get.prompt2("xkxijun"), [[
					["基本", "", "sha"],
					["锦囊", "", "juedou"],
				], "vcard"]])
				.set("filterButton", button => {
					const name = button.link[2],
						player = get.player();
					return player.hasUseTarget({ name: name });
				})
				.set("ai", button => {
					const name = button.link[2],
						player = get.player();
					return player.getUseValue({ name: name });
				})
				.forResult();
			if (!result.bool) return;
			const card = { name: result.links[0][2] };
			game.broadcastAll(function (card) {
				lib.skill.xkxijun_use.viewAs = card;
				lib.skill.xkxijun_use.prompt = "袭军：是否将一张黑色牌当做" + get.translation(card) + "使用？";
			}, card);
			const next = player.chooseToUse();
			next.set("openskilldialog", "袭军：是否将一张黑色牌当做" + get.translation(card) + "使用？");
			next.set("norestore", true);
			next.set("addCount", false);
			next.set("_backupevent", "xkxijun_use");
			next.set("custom", {
				add: {},
				replace: { window: function () {} },
			});
			next.backup("xkxijun_use");
			await next;
		},
		chooseButton: {
			dialog(event, player) {
				var list = [];
				for (const name of ["sha", "juedou"]) {
					if (event.filterCard(get.autoViewAs({ name: name }, "unsure"), player, event)) list.push([get.type(name), "", name]);
				}
				return ui.create.dialog("袭军", [list, "vcard"]);
			},
			check(button) {
				const player = _status.event.player;
				return player.getUseValue({
					name: button.link[2],
					nature: button.link[3],
				});
			},
			backup(links, player) {
				return {
					filterCard:(card) => get.color(card) == "black",
					audio: "xkxijun",
					popname: true,
					check(card) {
						return 8 - get.value(card);
					},
					position: "hes",
					viewAs: { name: links[0][2], nature: links[0][3] },
					precontent() {
						player.addTempSkill("xkxijun_used");
						player.addMark("xkxijun_used", 1, false);
					},
				};
			},
			prompt(links, player) {
				return "将一张黑色牌当做" + get.translation(links[0][2]) + "使用或打出";
			},
		},
		hiddenCard(player, name) {
			if (!player.isPhaseUsing()) return false;
			if (!["sha", "juedou"].includes(name)) return false;
			return player.countMark("xkxijun_used") < 2 && player.countCards("hes", { color: "black" });
		},
		ai: {
			respondSha: true,
			skillTagFilter(player) {
				if (!player.isPhaseUsing()) return false;
				if (player.countMark("xkxijun_used") >= 2 || !player.countCards("hes", { color: "black" })) return false;
			},
			order: 1,
			result: {
				player: 1,
			},
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
			effect: {
				trigger: {
					global: "damageEnd",
				},
				filter(event, player) {
					if (!event.card || !event.player.isIn()) return false;
					const evt = event.getParent("useCard", true);
					if (!evt || evt.card != event.card) return false;
					return evt.skill == "xkxijun_backup";
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
			backup: {},
			use: {
				filterCard(card) {
					return get.itemtype(card) == "card" && get.color(card) == "black";
				},
				position: "hes",
				selectCard: 1,
				check: card => 7 - get.value(card),
				popname: true,
				precontent() {
					event.result.skill = "xkxijun_backup";
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
			if (player.group != "qun") return false;
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
					if (player.group != "qun") return false;
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
			if (event.player.group != "wu" || player.group != "wu") return false;
			if (!event.isFirstTarget) return false;
			if (!(event.card.name == "juedou" || (event.card.name == "sha" && get.color(event.card) == "red"))) return false;
			if (!player.countCards("he", { type: "basic" })) return false;
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
					prompt: get.prompt2("xkronggui"),
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
			if (game.hasPlayer(target => {
				return target.getSeatNum() !== 1 && !target.hasSkill("xk_qiyijun") && target != player;
			})) {
				const result = await player
					.chooseTarget("聚首：令至多两名其他角色选择是否成为起义军", [1, 2], true, function(card, player, target) {
						return target.getSeatNum() !== 1 && !target.hasSkill("xk_qiyijun") && target != player;
					})
					.set("ai", target => Math.random())
					.forResult();
				if (result.bool && result.targets) {
					for (const target of result.targets) {
						const result2 = await target
							.chooseBool(`是否响应${get.translation(player)}的号召，成为起义军？`)
							.forResult();
						if (result2.bool) {
							await lib.skill.xk_qiyijun.qiyi(target);
						}
						else {
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
					if (!game.hasPlayer(current => current.hasSkill("xkliaoluan"))) return false;
					if (!player.hasSkill("xk_qiyijun")) return false;
					if (player.hasSkill("xkliaoluan_used")) return false;
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
							if (player.isTurnedOver()) return 1;
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
			if (!event.player.hasSkill("xk_qiyijun")) return false;
			if (!event.source || event.source == event.player) return false;
			return game.hasPlayer(current => current.hasSkill("xk_qiyijun"));
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt2("xkhuaying"), (card, player, target) => {
					return target.hasSkill("xk_qiyijun");
				})
				.set("ai", target => {
					const player = get.player();
					let eff = get.attitude(player, target);
					if (eff <= 0) return 0;
					if (target.isTurnedOver()) eff *= 2;
					if (target.isLinked()) eff += 2;
					if (target.hasSkill("xkliaoluan_used")) eff += 2;
					return eff;
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			if (target.isTurnedOver()) await target.turnOver(false);
			if (target.isLinked()) await target.link(false);
			if (target.hasSkill("xkliaoluan_used")) target.removeSkill("xkliaoluan_used");
		},
	},
	xkjizhong: {
		forced: true,
		global: "xkjizhong_global",
		subSkill: {
			global: {
				trigger: { player: "phaseDrawBegin2" },
				forced: true,
				filter(event, player) {
					if (!player.hasSkill("xk_qiyijun")) return false;
					if (!game.hasPlayer(current => current.hasSkill("xkjizhong"))) return false;
					return !event.numFixed;
				},
				async content(event, trigger, player) {
					trigger.num += game.countPlayer(current => current.hasSkill("xkjizhong"));
				},
				mod: {
					globalFrom(from, to, distance) {
						if (!from.hasSkill("xk_qiyijun")) return;
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
			if (player.countCards("hs") < player.hp || player.hasSkill("xkbimeng_used")) return false;
			for (var i of lib.inpile) {
				var type = get.type(i);
				if ((type == "basic" || type == "trick") && event.filterCard(get.autoViewAs({ name: i }, "unsure"), player, event)) return true;
			}
			return false;
		},
		chooseButton: {
			dialog(event, player) {
				var list = [];
				for (var i = 0; i < lib.inpile.length; i++) {
					var name = lib.inpile[i];
					if (name == "sha") {
						if (event.filterCard(get.autoViewAs({ name }, "unsure"), player, event)) list.push(["基本", "", "sha"]);
						for (var nature of lib.inpile_nature) {
							if (event.filterCard(get.autoViewAs({ name, nature }, "unsure"), player, event)) list.push(["基本", "", "sha", nature]);
						}
					} else if (get.type(name) == "trick" && event.filterCard(get.autoViewAs({ name }, "unsure"), player, event)) list.push(["锦囊", "", name]);
					else if (get.type(name) == "basic" && event.filterCard(get.autoViewAs({ name }, "unsure"), player, event)) list.push(["基本", "", name]);
				}
				return ui.create.dialog("弊蒙", [list, "vcard"]);
			},
			check(button) {
				if (_status.event.getParent().type != "phase") return 1;
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
					precontent: function () {
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
				if (player.countCards("sh") < player.hp || player.hasSkill("xkbimeng_used")) return false;
			},
			order: 1,
			result: {
				player(player) {
					if (_status.event.dying) return get.attitude(player, _status.event.dying);
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
			if (event.player.group != "qun" || player.group != "qun") return false;
			if (get.type(event.card) == "equip") return false;
			return true;
		},
		check(event, player) {
			if (get.attitude(player, event.player) <= 0) return false;
			if (!get.tag(event.card, "damage")) return true;
			if (!event.targets?.length) return false;
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
				.then(() => {
					if (game.hasPlayer2(current => current.hasHistory("damage", evt => evt.card == trigger.card))) {
						player.changeGroup("shu");
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
			if (player.group != "shu") return false;
			return player.countCards("he") && get.is.convertedCard(event.card);
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseCard(get.prompt2("xkfuzhu", trigger.player), "he")
				.set("ai", card => {
					const player = get.player(),
						trigger = get.event().getTrigger();
					if (get.attitude(player, trigger.player) <= 0) return 0;
					if (get.type2(card) != "trick") return 4 - get.value(card);
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
				if (get.type2(card) == "trick" && target.hasUseTarget(card)) await target.chooseUseTarget(card, true);
				else putback.push(card);
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
					for (var i = 0; i < top.length; i++) {
						ui.cardPile.insertBefore(top[i], ui.cardPile.firstChild);
					}
					for (i = 0; i < bottom.length; i++) {
						ui.cardPile.appendChild(bottom[i]);
					}
					game.updateRoundNumber();
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
			if (game.hasPlayer(target => {
				return target.getSeatNum() !== 1 && !target.hasSkill("xk_qiyijun") && target != player;
			})) {
				const result = await player
					.chooseTarget("聚黔：令至多两名其他角色选择是否成为起义军", [1, 2], true, function(card, player, target) {
						return target.getSeatNum() !== 1 && !target.hasSkill("xk_qiyijun") && target != player;
					})
					.set("ai", target => Math.random())
					.forResult();
				if (result.bool && result.targets) {
					for (const target of result.targets) {
						const result2 = await target
							.chooseBool(`是否响应${get.translation(player)}的号召，成为起义军？`)
							.forResult();
						if (result2.bool) {
							await lib.skill.xk_qiyijun.qiyi(target);
						}
						else {
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
			if (!game.hasPlayer(current => current.hasSkill("xk_qiyijun"))) return false;
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
			}
			else {
				result = await target
					.chooseControl("交给牌", "造成伤害")
					.set("prompt", "贪赂：请选择一项")
					.set("choiceList", [
						`交给${get.translation(player)}${get.cnNumber(num)}张手牌`,
						`令${get.translation(player)}对你造成1点伤害，然后弃置其一张手牌`,
					])
					.set("target", player)
					.set("ai", () => {
						const { player, target } = get.event();
						const eff1 = get.effect(player, { name: "shunshou_copy2" }, target, player),
							eff2 = get.damageEffect(player, target, player) + get.effect(target, { name: "guohe_copy2" }, player, player);
						if (eff1 >= eff2) return "交给牌";
						return "造成伤害"; 
					})
					.forResult();
			}
			if (result.index == 0) {
				await target.chooseToGive(player, "h", num, true);
			}
			else {
				await target.damage(player);
				await target.discardPlayerCard(player, "h", true);
			}
		},
	},
	xkjubian: {
		trigger: {
			player: "damageBegin3",
		},
		filter(event, player) {
			return player.countCards("h") > player.hp;
		},
		forced: true,
		async content(event, trigger, player) {
			await player.chooseToDiscard("h", true, player.countCards("h") - player.hp);
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
			if (game.hasPlayer(target => {
				return target.getSeatNum() !== 1 && !target.hasSkill("xk_qiyijun") && target != player;
			})) {
				const result = await player
					.chooseTarget("聚乱：令至多两名其他角色选择是否成为起义军", [1, 2], true, function(card, player, target) {
						return target.getSeatNum() !== 1 && !target.hasSkill("xk_qiyijun") && target != player;
					})
					.set("ai", target => Math.random())
					.forResult();
				if (result.bool && result.targets) {
					for (const target of result.targets) {
						const result2 = await target
							.chooseBool(`是否响应${get.translation(player)}的号召，成为起义军？`)
							.forResult();
						if (result2.bool) {
							await lib.skill.xk_qiyijun.qiyi(target);
						}
						else {
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
		trigger: {
			player: "useCardToPlayered",
		},
		filter(event, player) {
			if (!event.targets || event.targets.length != 1) return false;
			if (event.target == player) return false;
			if (!event.card || !get.tag(event.card, "damage")) return false;
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
					.then(() => {
						if (!game.hasPlayer2(current => current.hasHistory("damage", evt => evt.card == card))) {
							player
								.chooseControl(`失去${num - 1}点体力`, "此技能本回合失效")
								.set("prompt", "险行：选择一项")
								.set("ai", () => {
									if (get.event("num") > 1) return 1;
									return [0, 1].randomGet();
								})
								.set("num", num);
						} else event.finish();
					})
					.then(() => {
						if (result.index == 0) player.loseHp(num - 1);
						else player.tempBanSkill("xkxianxing");
					})
					.vars({
						card: trigger.card,
						num: num,
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
			if (player.hasHistory("sourceDamage", evt => evt.player && !evt.player.hasSkill("xk_qiyijun"))) return false;
			if (player.hasHistory("useCard", evt => evt.card.name == "sha" && evt.targets?.some(target => {
				return !target.hasSkill("xk_qiyijun");
			}))) return false;
			return true;
		},
		async content(event, trigger, player) {
			const result = await player
				.chooseControl("失去“起义军”", "失去1点体力")
				.set("prompt", "起义军：请选择一项")
				.set("choiceList", [
					"失去“起义军”并弃置所有手牌",
					"失去1点体力",
				])
				.set("ai", () => {
					if (player.hp <= 1) return "失去“起义军”";
					return ["失去“起义军”", "失去1点体力"].randomGet();
				})
				.forResult();
			if (result.index == 0) {
				await lib.skill.xk_qiyijun.unQiyi(player);
				const hs = player.getDiscardableCards(player, "h");
				if (hs.length) await player.discard(hs);
			}
			else {
				await player.loseHp();
			}
		},
		mod: {
			cardUsable(card, player, num) {
				if (card.name == "sha") return num + 1;
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
					if (!player.isPhaseUsing() || event.card.name != "sha") return false;
					player._countPrenum = true;
					const num = player.getCardUsable("sha");
					delete player._countPrenum;
					if (num >= 0) return false;
					return event.targets?.some(target => target.hasSkill("xk_qiyijun"));
				},
				charlotte: true,
				direct: true,
				async content(event, trigger, player) {
					if (!player.getStorage("xk_qiyijun").length) {
						player
							.when({global: ["phaseBefore", "phaseAfter", "phaseUseBefore", "phaseUseAfter"]})
							.then(() => {
								player.unmarkAuto("xk_qiyijun", player.getStorage("xk_qiyijun"));
							});
					}
					player.markAuto("xk_qiyijun", trigger.targets.filter(target => target.hasSkill("xk_qiyijun")));
				},
				mod: {
					cardUsable(card, player, num) {
						if (player._countPrenum || player.hasSkill("xk_qiyijun")) return;
						if (card.name == "sha") return num + game.countPlayer(current => current.hasSkill("xk_qiyijun"));
					},
					playerEnabled(card, player, target) {
						if (card.name != "sha") return;
						player._countPrenum = true;
						const num = player.getCardUsable(card);
						delete player._countPrenum;
						if (num > 0) return;
						if (game.checkMod(card, player, target, false, "cardUsableTarget", player)) return;
						if (player.getStorage("xk_qiyijun").includes(target)) return false;
						if (!target.hasSkill("xk_qiyijun")) return false;
					},
				},
			},
		},
	},
	//e系列纪灵
	yjshuangren: {
		audio: "shuangren",
		enable: "phaseUse",
		filterTarget(card, player, target) {
			return player.canCompare(target);
		},
		filter(event, player) {
			return player.countCards("h") > 0;
		},
		async content(event, trigger, player) {
			const bool = await player.chooseToCompare(event.target).forResultBool();
			if (bool) {
				player.addTempSkill("yjshuangren_count");
				player.addMark("yjshuangren_count", 1, false);
				let num = 0;
				while(num < player.countMark("yjshuangren_count")) {
					num++;
					const card = { name: "sha", isCard: true };
					if (player.hasUseTarget(card)) {
						const result = await player.chooseUseTarget(card, false).forResult();
						if (!result.bool) break;
					}
					else break;
				}
			} else {
				player.addTempSkill("yjshuangren_viewas");
			}
		},
		ai: {
			order(name, player) {
				const cards = player.getCards("h");
				for (let i = 0; i < cards.length; i++) {
					if (get.number(cards[i]) > 11 && get.value(cards[i]) < 7) {
						return 9;
					}
				}
				return get.order({ name: "sha" }) - 0.1;
			},
			result: {
				player(player) {
					const num = player.countCards("h");
					if (num > player.hp) return 0;
					if (num == 1) return -1;
					if (num == 2) return -0.7;
					return -0.5;
				},
				target(player, target) {
					const num = target.countCards("h");
					if (num == 1) return -2;
					if (num == 2) return -1;
					return -0.7;
				},
			},
			threaten: 1.3,
		},
		subSkill: {
			count: {
				charlotte: true,
				onremove: true,
			},
			viewas: {
				charlotte: true,
				mod: {
					cardname(card, player) {
						if (card.name == "sha") return "shan";
					},
					cardnumber(card) {
						if (card.name == "sha") return 13;
					},
				},
			},
		},
	},
	//线下幻系列
	yjqingjiao: {
		trigger: { player: "phaseJieshuBegin" },
		filter(event, player) {
			return player.hasHistory("sourceDamage", evt => evt.player.group === "qun" && evt.player !== player);
		},
		forced: true,
		zhuSkill: true,
		content() {
			player.draw();
		},
	},
	//燕幽烽火
	//全琮
	yyyaoming: {
		audio: "sbyaoming",
		enable: "phaseUse",
		trigger: { player: "damageEnd" },
		filter(event, player) {
			return game.hasPlayer(target => {
				if (target.countCards("he") && target.countCards("h") >= player.countCards("h")) {
					if (target !== player && (event.name === "damage" || !player.getStorage("yyyaoming_used").includes("弃牌"))) return true;
				}
				if (target.countCards("h") <= player.countCards("h")) {
					if (event.name === "damage" || !player.getStorage("yyyaoming_used").includes("摸牌")) return true;
				}
				return false;
			});
		},
		filterTarget(card, player, target) {
			if (target !== player && target.countCards("he") && target.countCards("h") >= player.countCards("h") && !player.getStorage("yyyaoming_used").includes("弃牌")) return true;
			if (target.countCards("h") <= player.countCards("h") && !player.getStorage("yyyaoming_used").includes("摸牌")) return true;
			return false;
		},
		prompt() {
			const player = get.player(),
				storage = player.getStorage("yyyaoming_used");
			return ["弃牌", "摸牌"]
				.filter(i => !storage.includes(i))
				.map(i => {
					return {
						弃牌: "弃置一名手牌数不小于你的其他角色的一张牌",
						摸牌: "令一名手牌数不大于你的角色摸一张牌",
					}[i];
				})
				.join("，或");
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(
					get.prompt("yyyaoming"),
					(card, player, target) => {
						if (target !== player && target.countCards("he") && target.countCards("h") >= player.countCards("h")) return true;
						if (target.countCards("h") <= player.countCards("h")) return true;
						return false;
					},
					"弃置一名手牌数不小于你的其他角色的一张牌，或令一名手牌数不大于你的角色摸一张牌"
				)
				.set("ai", target => {
					const player = get.player();
					return get.effect(target, "yyyaoming", player, player);
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const target = event.target || event.targets[0];
			let choice = ["弃牌", "摸牌"].filter(choice => {
					if (!(trigger?.name === "damage" || !player.getStorage("yyyaoming_used").includes(choice))) return false;
					if (choice === "弃牌") return target !== player && target.countCards("he") && target.countCards("h") >= player.countCards("h");
					return target.countCards("h") <= player.countCards("h");
				}),
				result;
			if (choice.length === 1) result = { control: choice[0] };
			else
				result = await player
					.chooseControl(choice)
					.set("choiceList", ["弃置" + get.translation(target) + "一张牌", "令" + get.translation(target) + "摸一张牌"])
					.set("prompt", "邀名：请选择一项")
					.set("ai", () => {
						const player = get.player(),
							event = get.event().getParent(),
							target = event.target || event.targets[0];
						return get.effect(target, { name: "guohe_copy2" }, player, player) > get.effect(target, { name: "draw" }, player, player) ? 0 : 1;
					})
					.forResult();
			if (result.control === "弃牌") await player.discardPlayerCard(target, "he", true);
			else await target.draw();
			if (!(trigger?.name === "damage")) {
				player.addTempSkill("yyyaoming_used", "phaseUseAfter");
				player.markAuto("yyyaoming_used", [result.control]);
			}
		},
		ai: {
			order: 7,
			result: {
				player(player, target) {
					let eff = [0, 0],
						hs = player.countCards("h"),
						ht = target.countCards("h");
					if (hs >= ht) {
						eff[0] = get.effect(target, { name: "draw" }, player, player);
					}
					if (hs <= ht) {
						eff[1] = get.effect(target, { name: "guohe_copy2" }, player, player);
					}
					return Math.max.apply(Math, eff);
				},
			},
		},
		subSkill: {
			used: {
				charlotte: true,
				onremove: true,
			},
		},
	},
	//白虎骁骑
	yy_baimaxiaoqi_skill: {
		equipSkill: true,
		mod: {
			attackRange(player, num) {
				if (player.countVCards("e") > 0) return num + player.countVCards("e");
			},
			cardUsable(card, player, num) {
				if (card.name != "sha") return;
				if (player.countVCards("e") > 1) return num + player.countVCards("e");
			},
			globalFrom(player, target, num) {
				if (player.countVCards("e") > 2) return num - player.countVCards("e");
			},
		},
		trigger: { player: "phaseDrawBegin2" },
		filter(event, player) {
			return player.countVCards("e") > 3 && !event.numFixed;
		},
		forced: true,
		content() {
			trigger.num += player.countVCards("e");
		},
	},
	//麹义
	yyfuqi: {
		audio: "fuqi",
		trigger: { player: "useCardToPlayer" },
		filter(event, player) {
			return get.distance(player, event.target) > 1;
		},
		forced: true,
		logTarget: "target",
		content() {
			player.draw();
		},
		group: "yyfuqi_fuqi",
		subSkill: { fuqi: { audio: "fuqi", inherit: "fuqi" } },
	},
	//公孙瓒
	yyqizhen: {
		trigger: { player: "useCardToPlayered" },
		filter(event, player) {
			return event.card.name == "sha";
		},
		check(event, player) {
			return get.attitude(player, event.target) < 0 || event.targets.some(i => get.attitude(player, target) < 0);
		},
		logTarget: "target",
		content() {
			const skill = "yyqizhen_effect";
			player.addTempSkill(skill);
			if (!player.storage[skill]) player.storage[skill] = {};
			const id = trigger.target.playerid;
			if (!player.storage[skill][id]) player.storage[skill][id] = [trigger.target, trigger.getParent()];
			else player.storage[skill][id].add(trigger.getParent());
		},
		subSkill: {
			effect: {
				charlotte: true,
				onremove: true,
				trigger: { player: "useCardAfter" },
				filter(event, player) {
					return Object.keys(player.storage["yyqizhen_effect"]).some(id => player.storage["yyqizhen_effect"][id].includes(event));
				},
				forced: true,
				popup: false,
				async content(event, trigger, player) {
					const storage = player.storage["yyqizhen_effect"];
					const targets = Object.keys(storage)
						.filter(id => {
							return storage[id].includes(trigger);
						})
						.slice()
						.map(id => storage[id][0]);
					const goon = game.getGlobalHistory("changeHp", evt => evt.getParent().name === "damage" && evt.getParent().card === trigger.card).reduce((sum, evt) => sum - evt.num, 0);
					for (const target of targets) {
						if (goon) {
							player.line(target);
							await player.draw(goon);
						} else {
							if (!target.isIn() || !target.countDiscardableCards(player, "e")) continue;
							player.line(target);
							await player.discardPlayerCard(target, "e", true);
						}
					}
				},
			},
		},
	},
	yymujun: {
		zhuSkill: true,
		limited: true,
		enable: "phaseUse",
		filterTarget(card, player, target) {
			return target.group == "qun" && player.hasZhuSkill("yymujun", target) && !target.hasSkill("yicong", null, false, false);
		},
		skillAnimation: true,
		animationColor: "metal",
		content() {
			player.awakenSkill("yymujun");
			target.addSkills("yicong");
		},
		ai: {
			order: 1,
			result: { target: 1 },
		},
	},
	//文丑
	yyxuezhan: {
		trigger: { player: "useCard" },
		filter(event) {
			return event.card.name == "juedou";
		},
		forced: true,
		content() {
			trigger.nowuxie = true;
		},
		mod: {
			cardname(card, player) {
				if (get.type(card, "trick", false) == "trick") return "juedou";
			},
		},
	},
	yyyazhen: {
		enable: ["chooseToUse", "chooseToRespond"],
		filter(event, player) {
			return player.countCards("e");
		},
		filterCard: true,
		position: "e",
		viewAs: { name: "sha" },
		check(card) {
			const val = get.value(card);
			if (get.event().name == "chooseToRespond") return 1 / Math.max(0.1, val);
			return 5 - val;
		},
		ai: {
			respondSha: true,
			skillTagFilter(player) {
				if (!player.countCards("e")) return false;
			},
		},
	},
	//公孙渊
	yyxuanshi: {
		enable: "phaseUse",
		filter(event, player) {
			return player.countCards("h") && player.countCards("h", { color: "red" }) === player.countCards("h", { color: "black" });
		},
		filterTarget(card, player, target) {
			return target !== player && target.countCards("hej");
		},
		usable: 2,
		delay: false,
		content() {
			player.showHandcards(get.translation(player) + "对" + get.translation(target) + "发动了【旋势】");
			player.gainPlayerCard(target, "hej", true);
		},
		ai: {
			order: 20,
			result: {
				player(player, target) {
					return get.effect(target, { name: "shunshou" }, player, player);
				},
			},
		},
	},
	yyxiongye: {
		zhuSkill: true,
		enable: "phaseUse",
		selectCard() {
			if (ui.selected.targets.length) return [ui.selected.targets.length, Infinity];
			return [1, Infinity];
		},
		selectTarget: () => ui.selected.cards.length,
		filterTarget(card, player, target) {
			return target !== player && target.group === "qun" && player.hasZhuSkill("yyxiongye", target);
		},
		filterCard: true,
		check(card) {
			if (get.tag(card, "recover")) return 0;
			return 7 - get.value(card);
		},
		position: "h",
		complexCard: true,
		discard: false,
		lose: false,
		delay: false,
		multitarget: true,
		multiline: true,
		usable: 1,
		async content(event, trigger, player) {
			await game
				.loseAsync({
					gain_list: Array.from({ length: event.targets.length }).map((_, i) => [event.targets[i], event.cards[i]]),
					giver: player,
					player: player,
					cards: event.cards,
					animate: "giveAuto",
				})
				.setContent("gaincardMultiple");
			for (const i of event.targets.sortBySeat()) await i.damage();
		},
		ai: {
			order: 5,
			result: {
				player(player, target) {
					return get.damageEffect(target, player, player);
				},
			},
		},
	},
	//袁绍
	yysudi: {
		trigger: { global: ["useCardAfter", "respondAfter"] },
		filter(event, player) {
			if (!Array.isArray(event.respondTo) || event.respondTo[0] !== player) return false;
			return event.player.inRange(player);
		},
		forced: true,
		logTarget: "player",
		content() {
			player.draw();
		},
	},
	yyqishe: {
		trigger: {
			global: "phaseBefore",
			player: ["enterGame", "phaseJieshuBegin"],
		},
		filter(event, player) {
			return event.name !== "phase" || game.phaseNumber === 0;
		},
		frequent: true,
		async cost(event, trigger, player) {
			if (trigger.name !== "phaseJieshu") event.result = { bool: true };
			else event.result = await player.chooseBool("是否发动【齐射】，从弃牌堆中获得一张【万箭齐发】？").set("frequentSkill", "yyqishe").forResult();
		},
		content() {
			const card = trigger.name === "phaseJieshu" ? get.discardPile("wanjian") : game.createCard2("wanjian", "heart", 1);
			if (card) player.gain(card, "gain2");
		},
	},
	yylinzhen: {
		zhuSkill: true,
		global: "yylinzhen_global",
		subSkill: {
			global: {
				zhuSkill: true,
				mod: {
					inRange(from, to) {
						if (from === to || from.group !== "qun") return;
						if (to.hasZhuSkill("yylinzhen", from)) return true;
					},
				},
			},
		},
	},
	//司马懿
	yyyanggu: {
		enable: "chooseToUse",
		filter(event, player) {
			return player.storage.yyyanggu && player.countCards("h");
		},
		filterCard: true,
		position: "h",
		viewAs: { name: "shengdong" },
		prompt: "将一张手牌当作【声东击西】使用",
		check(card) {
			return 7 - get.value(card);
		},
		onuse(result, player) {
			player.changeZhuanhuanji("yyyanggu");
		},
		mark: true,
		zhuanhuanji: true,
		marktext: "☯",
		intro: {
			content(storage) {
				if (storage) return "你可以将一张手牌当作【声东击西】使用";
				return "当你受到伤害后，你可以回复1点体力";
			},
		},
		group: "yyyanggu_effect",
		subSkill: {
			effect: {
				trigger: { player: "damageEnd" },
				filter(event, player) {
					return !player.storage.yyyanggu && player.isDamaged();
				},
				check(event, player) {
					return get.recoverEffect(player, player, player) > 0;
				},
				prompt: "回复1点体力",
				content() {
					player.changeZhuanhuanji("yyyanggu");
					player.recover();
				},
			},
		},
	},
	yyzuifu: {
		trigger: { global: ["gainAfter", "loseAsyncAfter"] },
		filter(event, player, name, target) {
			if (!event.getg || _status.dying.length) return false;
			return target?.isIn();
		},
		getIndex(event, player) {
			if (!event.getg) return false;
			return game
				.filterPlayer(current => {
					const evt = event.getParent("phaseDraw");
					if (evt?.player == current) return false;
					return event.getg(current).length;
				})
				.sortBySeat();
		},
		usable: 1,
		logTarget: (event, player, name, target) => target,
		prompt2: (event, player, name, target) => "对" + get.translation(target) + "造成1点伤害",
		check: (event, player, name, target) => get.damageEffect(target, player, player) > 0,
		content() {
			event.targets[0].damage();
		},
	},
	//曹叡
	yyhuituo: {
		audio: "huituo",
		trigger: { player: "damageEnd" },
		getIndex: event => event.num,
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt2("yyhuituo"))
				.set("ai", target => {
					const player = get.player();
					if (get.attitude(player, target) > 0) return get.recoverEffect(target, player, player) + 1;
					return 0;
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			const result = await target
				.judge(card => {
					if (get.color(card) == "red") return target.isDamaged() ? 1 : -1;
					return 0;
				})
				.forResult();
			if (result.color === "red") await target.recover();
			if (result.color === "black") await target.draw();
		},
	},
	yymingjian: {
		audio: "mingjian",
		trigger: { global: "phaseUseBegin" },
		filter(event, player) {
			return event.player !== player && player.countCards("h");
		},
		async cost(event, trigger, player) {
			const suits = player
				.getCards("h")
				.slice()
				.map(i => get.suit(i, player))
				.unique();
			event.result = await player
				.chooseControl(suits, "cancel2")
				.set("ai", () => {
					const player = get.player(),
						target = get.event().getTrigger().player;
					if (get.attitude(player, target) < 2) return "cancel2";
					return get.event().controls.randomGet();
				})
				.set("prompt", get.prompt2("yymingjian", trigger.player))
				.forResult();
			if (event.result.control !== "cancel2") {
				event.result.bool = true;
				event.result.cards = player.getCards("h", { suit: event.result.control });
			}
		},
		logTarget: "player",
		async content(event, trigger, player) {
			const target = trigger.player;
			await player.showHandcards(get.translation(player) + "对" + get.translation(target) + "发动了【明鉴】");
			await player.give(event.cards, target, "visible");
			target.addTempSkill("yymingjian_effect");
			target.addMark("yymingjian_effect", 1, false);
		},
		subSkill: {
			effect: {
				charlotte: true,
				onremove: true,
				intro: { content: "本回合使用的下一张牌额外结算#次" },
				trigger: { player: "useCard" },
				forced: true,
				popup: false,
				content() {
					const num = player.countMark(event.name);
					player.removeSkill(event.name);
					if (lib.skill.dcshixian.filterx(trigger)) {
						trigger.effectCount += num;
						game.log(trigger.card, "额外结算" + num + "次");
					}
				},
				mod: {
					aiOrder(player, card, num) {
						if (typeof card == "object" && !get.tag(card, "norepeat")) {
							const type = get.type(card);
							if (type === "basic" || type === "trick") return num + 20;
						}
					},
				},
			},
		},
	},
	//SCL
	scls_yinshi: {
		//audio: "xinfu_pdgyingshi",
		mod: {
			targetEnabled(card, player, target) {
				if (get.mode() === "doudizhu" && get.type(card) === "delay") {
					return false;
				}
			},
		},
		trigger: {
			player: "phaseJudgeBefore",
		},
		forced: true,
		async content(event, trigger, player) {
			trigger.cancel();
			game.log(player, "跳过了判定阶段");
		},
		ai: {
			effect: {
				target(card, player, target) {
					if (get.type(card) === "delay") return "zeroplayertarget";
				},
			},
		},
	},
	scls_pingcai: {
		audio: ["xinfu_pingcai", 5],
		enable: "phaseUse",
		usable: 1,
		filterCard: true,
		selectCard() {
			if (get.mode() === "doudizhu") return 0;
			return 1;
		},
		check(card) {
			let suit = get.suit(card);
			return lib.skill.scls_pingcai.takaramonoValue(suit, get.event("player"));
		},
		discard: false,
		lose: false,
		delay: false,
		derivation: ["sclc_wolong", "sclc_fengchu", "sclc_shuijing", "sclc_xuanjian"],
		async sclc_wolong(player) {
			const ingame =
				get.mode() === "doudizhu" &&
				game.hasPlayer(cur => {
					let names = get.characterSurname(cur.name1);
					names.addArray(get.characterSurname(cur.name2));
					for (let [surname, name] of names) {
						if (surname === "诸葛" && name === "亮") return true;
					}
				});
			const result = await player
				.chooseTarget("请选择" + (ingame ? "至多两名" : "一名") + "角色，对其造成1点火焰伤害", ingame ? [1, 2] : [1, 1], true)
				.set("ai", target => {
					const player = get.event("player");
					return get.damageEffect(target, player, player, "fire");
				})
				.forResult();
			if (result.bool && result.targets.length) {
				player.line(result.targets, "fire");
				result.targets.sortBySeat();
				for (const target of result.targets) {
					await target.damage("fire");
				}
			}
		},
		async sclc_fengchu(player) {
			const ingame =
				get.mode() === "doudizhu" &&
				game.hasPlayer(cur => {
					let names = get.characterSurname(cur.name1);
					names.addArray(get.characterSurname(cur.name2));
					for (let [surname, name] of names) {
						if (surname === "庞" && name === "统") return true;
					}
				});
			const result = await player
				//斗地主有四名角色？
				.chooseTarget(
					"请选择至多" + (ingame ? "四名" : "三名") + "要横置的角色",
					ingame ? [1, 4] : [1, 3],
					(card, player, target) => {
						return !target.isLinked();
					},
					true
				)
				.set("ai", target => {
					const player = get.event("player");
					return get.effect(target, { name: "tiesuo" }, player, player);
				})
				.forResult();
			if (result.bool && result.targets.length) {
				player.line(result.targets, "green");
				result.targets.sortBySeat();
				for (const target of result.targets) {
					await target.link();
				}
			}
		},
		async sclc_shuijing(player) {
			const equip =
				get.mode() !== "doudizhu" ||
				game.hasPlayer(cur => {
					let names = get.characterSurname(cur.name1);
					names.addArray(get.characterSurname(cur.name2));
					for (let [surname, name] of names) {
						if (surname === "司马" && name === "徽") return true;
					}
				});
			if (equip && !player.canMoveCard(null, true)) return;
			if (
				!equip &&
				!player.canMoveCard(null, true, card => {
					return get.subtype(card) === "equip2";
				})
			)
				return;
			const {
				result: { bool, targets },
			} = await player
				.chooseTarget(2, (card, player, target) => {
					if (ui.selected.targets.length) {
						if (!get.event("equip")) {
							let cards = ui.selected.targets[0].getEquips(2);
							return cards.some(card => target.canEquip(card));
						}
						let from = ui.selected.targets[0];
						if (target.isMin()) return false;
						let es = from.getCards("e");
						for (let i = 0; i < es.length; i++) {
							if (target.canEquip(es[i])) return true;
						}
						return false;
					} else {
						if (!get.event("equip")) {
							if (target.getEquips(2).length) return true;
							return false;
						}
						return target.countCards("e") > 0;
					}
				})
				.set("forced", true)
				.set("multitarget", true)
				.set("targetprompt", ["被移走", "移动目标"])
				.set("prompt", "将一名角色装备区的一张" + (equip ? "" : "防具") + "牌移动到另一名角色的装备区中")
				.set("ai", target => {
					const player = get.event("player"),
						att = get.attitude(player, target);
					if (ui.selected.targets.length === 0) {
						if (
							att < 0 &&
							game.hasPlayer(current => {
								if (get.attitude(player, current) > 0) {
									let es = target.getCards("e");
									for (let i = 0; i < es.length; i++) {
										if (current.canEquip(es[i])) return true;
									}
									return false;
								}
							})
						)
							return -att;
						return 0;
					}
					if (att > 0) {
						let es = ui.selected.targets[0].getCards("e"),
							i;
						for (i = 0; i < es.length; i++) {
							if (target.canEquip(es[i])) break;
						}
						if (i === es.length) return 0;
					}
					return -att * get.attitude(player, ui.selected.targets[0]);
				})
				.set("equip", equip);
			if (!bool || targets.length !== 2) return;
			player.line2(targets, "green");
			await game.delay();
			let result;
			if (equip)
				result = await player
					.choosePlayerCard(
						"e",
						true,
						button => {
							return get.equipValue(button.link);
						},
						targets[0]
					)
					.set("targets0", targets[0])
					.set("targets1", targets[1])
					.set("filterButton", button => {
						let targets1 = _status.event.targets1;
						return targets1.canEquip(button.link);
					})
					.forResult();
			else {
				let cards = targets[0].getEquips(2);
				if (cards.length === 1)
					result = {
						bool: true,
						links: cards,
					};
				else
					result = await player
						.choosePlayerCard(
							"e",
							true,
							button => {
								return get.equipValue(button.link);
							},
							targets[0]
						)
						.set("targets0", targets[0])
						.set("targets1", targets[1])
						.set("filterButton", button => {
							if (!get.subtypes(button.link, false).includes("equip2")) return false;
							let targets1 = _status.event.targets1;
							return targets1.canEquip(button.link);
						})
						.forResult();
			}
			if (result.bool && result.links.length) {
				let link = result.links[0];
				if (get.position(link) === "e") await targets[1].equip(link);
				else if (link.viewAs) await targets[1].addJudge({ name: link.viewAs }, [link]);
				else await targets[1].addJudge(link);
				targets[0].$give(link, targets[1], false);
				await game.delay();
			}
		},
		async sclc_xuanjian(player) {
			const ingame =
				get.mode() === "doudizhu" &&
				game.hasPlayer(cur => {
					let names = get.characterSurname(cur.name1);
					names.addArray(get.characterSurname(cur.name2));
					for (let [surname, name] of names) {
						if (surname === "徐" && name === "庶") return true;
					}
				});
			const result = await player
				.chooseTarget("请选择一名角色，令其回复1点体力并摸一张牌" + (ingame ? "，然后你摸一张牌" : ""), true)
				.set("ai", target => {
					const player = get.event("player");
					let eff = get.effect(target, { name: "draw" }, player, player);
					if (target.isDamaged()) eff += get.recoverEffect(target, player, player);
					if (get.event("ingame")) eff += get.effect(player, { name: "draw" }, player, player);
					return eff;
				})
				.set("ingame", ingame)
				.forResult();
			if (result.bool && result.targets.length) {
				player.line(result.targets, "thunder");
				const target = result.targets[0];
				await target.draw();
				await target.recover();
				if (ingame) await player.draw();
			}
		},
		takaramonoValue(name, player) {
			switch (name) {
				case "sclc_wolong":
				case "diamond":
					return Math.max(
						...game
							.filterPlayer(cur => {
								return cur !== player;
							})
							.map(tar => {
								return get.damageEffect(tar, player, player);
							})
					);
				case "sclc_fengchu":
				case "club":
					return game
						.filterPlayer(cur => {
							return cur !== player && !cur.isLinked();
						})
						.map(tar => {
							return get.effect(tar, { name: "tiesuo" }, player, player);
						})
						.sort((a, b) => b - a)
						.slice(0, 3)
						.reduce((acc, val) => acc + val, 0);
				case "sclc_shuijing":
				case "spade":
					if (player.canMoveCard(true)) return 12;
					return 0;
				case "sclc_xuanjian":
				case "heart":
					return Math.max(
						...game.filterPlayer().map(tar => {
							return get.recoverEffect(tar, player, player) + get.effect(tar, { name: "draw" }, player, player);
						})
					);
				default:
					return 0;
			}
		},
		logAudio(event, player) {
			const suit = get.suit(event.cards[0], player);
			switch (suit) {
				case "diamond":
					return "xinfu_pingcai2.mp3";
				case "club":
					return "xinfu_pingcai3.mp3";
				case "spade":
					return "xinfu_pingcai4.mp3";
				case "heart":
					return "xinfu_pingcai5.mp3";
				default:
					return "xinfu_pingcai1.mp3";
			}
		},
		async content(event, trigger, player) {
			let name;
			if (get.mode() === "doudizhu") {
				const result = await player
					.chooseButton(["评才：选择你要擦拭的宝物", [lib.skill.scls_pingcai.derivation.map(name => ["", "", name]), "vcard"]])
					.set("ai", button => {
						return lib.skill.scls_pingcai.takaramonoValue(button.link[2], get.event("player"));
					})
					.forResult();
				if (!result.bool) return;
				name = result.links[0][2];
			} else {
				await player.showCards(event.cards);
				name = lib.skill.scls_pingcai.derivation[["diamond", "club", "spade", "heart"].indexOf(get.suit(event.cards[0], player))];
			}
			if (name) await lib.skill.scls_pingcai[name](player);
		},
		ai: {
			order: 10,
			result: {
				player: 3,
			},
		},
	},
	scls_chongxu: {
		audio: "chongxu",
		enable: "phaseUse",
		usable: 1,
		async content(event, trigger, player) {
			let cards = get.cards(3, true);
			await player.showCards(cards, get.translation(player) + "发动了【冲虚】");
			const {
				result: {
					bool,
					links: [card],
				},
			} = await player
				.chooseCardButton("冲虚：选择要获得的牌", true, cards)
				.set("ai", button => {
					let color = get.color(button.link),
						need = get.event("color");
					if (need && color !== need) return 0.1;
					return get.buttonValue(button);
				})
				.set(
					"color",
					(function () {
						if (!player.hasSkill("scls_chongxu_lianhua")) {
							if (
								player.hp < 2 ||
								(player.hp + player.hujia < 3 &&
									!player.hasCard(i => {
										let name = get.name(i, player);
										return name === "shan" || name === "tao";
									})) ||
								get.threaten(player) > 2
							)
								return "red";
						}
						if (!player.hasSkill("scls_chongxu_miaojian")) {
							if (player.canUse({ name: "wuzhong" }, player)) return "black";
						}
						return false;
					})()
				);
			if (!bool) return;
			let skill = get.color(card) === "red" ? "scls_lianhua" : "scls_miaojian";
			await player.gain(card, "gain2");
			if (!player.hasMark(skill)) player.addMark(skill, 1, false);
			if (skill === "scls_miaojian") player.addTempSkill("scls_chongxu_miaojian");
			player.addTempSkill("scls_chongxu_lianhua", { player: "phaseBegin" });
			game.log(player, "修改了技能", "#g【" + get.translation(skill) + "】");
		},
		ai: {
			order: 10,
			result: {
				player: 1,
			},
		},
		subSkill: {
			miaojian: {
				charlotte: true,
				onremove(player) {
					player.removeMark("scls_miaojian", player.countMark("scls_miaojian"), false);
				},
			},
			lianhua: {
				charlotte: true,
				onremove(player) {
					player.removeMark("scls_lianhua", player.countMark("scls_lianhua"), false);
				},
			},
		},
	},
	scls_miaojian: {
		audio: "miaojian",
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			let level = player.hasMark("scls_miaojian");
			if (event.filterCard({ name: "sha", nature: "stab" }, player, event)) {
				if (level) return true;
				return player.hasCard(card => {
					return get.type2(card) === "basic";
				}, "hs");
			}
			if (event.filterCard({ name: "wuzhong" }, player, event)) {
				if (level) return true;
				return player.hasCard(card => {
					return get.type2(card) !== "basic";
				}, "hes");
			}
			return false;
		},
		chooseButton: {
			dialog() {
				return ui.create.dialog("妙剑", [
					[
						["基本", "", "sha", "stab"],
						["锦囊", "", "wuzhong"],
					],
					"vcard",
				]);
			},
			filter(button, player) {
				let event = _status.event.getParent(),
					level = player.hasMark("scls_miaojian");
				if (button.link[2] === "sha") {
					if (!event.filterCard({ name: "sha", nature: "stab" }, player, event)) return false;
					if (level) return true;
					return player.hasCard(card => {
						return get.type2(card) === "basic";
					}, "hs");
				}
				if (button.link[2] === "wuzhong") {
					if (!event.filterCard({ name: "wuzhong" }, player, event)) return false;
					if (level) return true;
					return player.hasCard(card => {
						return get.type2(card) !== "basic";
					}, "hes");
				}
			},
			check(button) {
				let card = { name: button.link[2], nature: button.link[3] },
					player = _status.event.player;
				return get.value(card, player) * get.sgn(player.getUseValue(card));
			},
			backup(links, player) {
				let index = links[0][2] === "sha" ? 0 : 1,
					level = player.countMark("scls_miaojian");
				let next = {
					audio: "miaojian",
					filterCard: [
						[
							card => {
								return get.type(card) === "basic";
							},
							() => false,
						],
						[
							card => {
								return get.type(card) !== "basic";
							},
							() => false,
						],
					][index][level],
					position: "hes",
					check(card) {
						if (card) return 6.5 - get.value(card);
						return 1;
					},
					viewAs: [
						{
							name: "sha",
							nature: "stab",
						},
						{
							name: "wuzhong",
						},
					][index],
				};
				if (level) {
					next.selectCard = -1;
					next.viewAs.isCard = true;
				}
				return next;
			},
			prompt(links, player) {
				let index = links[0][2] === "sha" ? 0 : 1,
					level = player.countMark("scls_miaojian");
				return [
					["将一张基本牌当做刺【杀】使用", "请选择刺【杀】的目标"],
					["将一张非基本牌当做【无中生有】使用", "请选择【无中生有】的目标"],
				][index][level];
			},
		},
		ai: {
			order: 7,
			result: { player: 1 },
		},
		onremove: true,
		derivation: ["miaojian2"],
		subSkill: { backup: { audio: "miaojian" } },
	},
	scls_lianhua: {
		audio: "shhlianhua",
		trigger: {
			target: "useCardToTargeted",
		},
		filter: event => event.card.name === "sha",
		forced: true,
		locked: false,
		derivation: ["shhlianhua2"],
		async content(event, trigger, player) {
			await player.draw();
			if (!player.hasMark("scls_lianhua")) return;
			const result = await trigger.player
				.chooseToDiscard("he", "弃置一张牌，或令" + get.translation(trigger.card) + "对" + get.translation(player) + "无效")
				.set("ai", card => {
					if (_status.event.eff > 0) {
						return 9 - get.value(card);
					}
					return 0;
				})
				.set("eff", get.effect(player, trigger.card, trigger.player, trigger.player));
			if (result.bool === false) {
				trigger.getParent().excluded.add(player);
			}
		},
		ai: {
			effect: {
				target_use(card, player, target, current) {
					if (card.name === "sha" && current < 0) {
						return [target.hasMark("scls_lianhua") ? 0.7 : 1, 1, 1, 0];
					}
				},
			},
		},
	},
	scls_kuangcai: {
		audio: "kuangcai",
		init(player, skill) {
			player.storage[skill] = 0;
			let evt = _status.event.getParent("phaseUse");
			if (evt && evt.player === player) {
				player.getHistory("useCard", evtx => {
					if (evtx.getParent("phaseUse") === evt) {
						player.storage[skill]++;
					}
				});
			}
		},
		onremove: true,
		intro: {
			content(storage, player) {
				return "本回合还可使用" + get.cnNumber(5 - storage) + "张牌";
			},
		},
		mod: {
			targetInRange(card, player) {
				if (player.isPhaseUsing()) return true;
			},
			aiOrder(player, card, num) {
				let name = get.name(card);
				if (name === "tao") return num + 7 + Math.pow(player.getDamagedHp(), 2);
				if (name === "sha") return num + 6;
				if (get.subtype(card) === "equip2") return num + get.value(card) / 3;
			},
			cardEnabled(card, player) {
				if (player.countMark("scls_kuangcai") >= 5) return false;
			},
			cardUsable(card, player) {
				if (!player.isPhaseUsing() || player.countMark("scls_kuangcai") >= 5) return false;
				if (get.info(card) && get.info(card).forceUsable) return;
				return Infinity;
			},
			cardSavable(card, player) {
				if (player.countMark("scls_kuangcai") >= 5) return false;
			},
		},
		trigger: {
			player: "useCard1",
		},
		filter(event, player) {
			return player.isPhaseUsing();
		},
		locked: false,
		prompt2(event, player) {
			return "摸一张牌" + (player.hasMark("scls_kuangcai") ? "" : "，本回合至多使用五张牌");
		},
		frequent: true,
		async content(event, trigger, player) {
			player.markSkill("scls_kuangcai");
			await player.draw();
		},
		ai: {
			threaten: 4.5,
		},
		group: ["scls_kuangcai_add", "scls_kuangcai_clear"],
		subSkill: {
			add: {
				trigger: {
					player: "useCard1",
				},
				filter(event, player) {
					return player === _status.currentPhase;
				},
				silent: true,
				priority: 5,
				async content(event, trigger, player) {
					if (player.storage.scls_kuangcai) player.storage.scls_kuangcai++;
					else player.storage.scls_kuangcai = 1;
				},
			},
			clear: {
				trigger: {
					player: "phaseAfter",
				},
				silent: true,
				async content(event, trigger, player) {
					delete player.storage.scls_kuangcai;
					player.unmarkSkill("scls_kuangcai");
				},
			},
		},
	},
	scls_shejian: {
		audio: "shejian",
		trigger: {
			player: "phaseDiscardEnd",
		},
		filter(event, player) {
			let cards = [];
			player.getHistory("lose", evt => {
				if (evt.type === "discard" && evt.getParent("phaseDiscard") === event) cards.addArray(evt.cards2);
			});
			if (!cards.length) return false;
			let suits = [];
			for (let i of cards) {
				let suit = get.suit(i);
				if (suits.includes(suit)) return false;
				suits.push(suit);
			}
			return true;
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt(event.name.slice(0, -5)), "弃置一名其他角色的一张牌", (card, player, target) => {
					if (player === target) return false;
					return target.countDiscardableCards(player, "he") > 0;
				})
				.set("ai", target => {
					let att = get.attitude(player, target);
					if (att >= 0) return 0;
					if (target.countDiscardableCards(player, "h") > 0 && target.hasSkillTag("noh")) att /= 6;
					if (target.countDiscardableCards(player, "e") > 0 && target.hasSkillTag("noe")) att /= 4;
					return -att;
				})
				.forResult();
		},
		async content(event, trigger, player) {
			await player.discardPlayerCard(event.targets[0], "he", true);
		},
	},
	scls_juezhi: {
		audio: "juezhi",
		enable: "phaseUse",
		filter(event, player) {
			return player.countCards("he") > 1;
		},
		filterCard: true,
		position: "he",
		selectCard: [2, Infinity],
		check(card) {
			if (ui.selected.cards.length > 1) return 0;
			let player = get.event("player");
			if (player.hasSkill("xingtu") && player.storage.xingtu) {
				let number = get.number(card);
				return player.getHp() - player.getUseValue(card, null, number % (player.storage.xingtu_mark || 13) !== 0);
			}
			return 5 - get.value(card);
		},
		async content(event, trigger, player) {
			let cards = get.cards(event.cards.length, true);
			await player.showCards(cards, get.translation(player) + "发动了【爵制】");
			const {
				result: {
					links: [card],
				},
			} = await player.chooseCardButton("爵制：选择要获得的牌", true, cards).set("ai", button => {
				let player = get.event("player"),
					number = get.number(button.link);
				return player.getUseValue(button.link, null, number % (player.storage.xingtu_mark || 13) !== 0);
			});
			if (card) player.gain(card, "gain2");
		},
		ai: {
			order: 1,
			result: {
				player: 1,
			},
		},
	},
	scls_lingren: {
		audio: "xinfu_lingren",
		trigger: {
			player: "useCardToPlayered",
		},
		filter(event, player) {
			if (!player.isPhaseUsing() || player.hasSkill("scls_lingren_used")) return false;
			if (event.getParent().triggeredTargets3.length > 1) return false;
			if (event.card.name === "sha") return true;
			return get.tag(event.card, "damage") && get.type(event.card) === "trick";
		},
		derivation: ["scls_lingren_jianxiong", "scls_lingren_xingshang"],
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt(event.name.slice(0, -5)), "选择一名目标角色并猜测其手牌构成", (card, player, target) => {
					return _status.event.targets.includes(target);
				})
				.set("ai", target => {
					return 2 - get.attitude(_status.event.player, target);
				})
				.set("targets", trigger.targets)
				.forResult();
		},
		async content(event, trigger, player) {
			player.addTempSkill("scls_lingren_used", "phaseUseAfter");
			const target = event.targets[0];
			const result = await player
				.chooseButton(["凌人：猜测其有哪些类别的手牌", [["basic", "trick", "equip"], "vcard"]], [0, 3], true)
				.set("ai", button => {
					return get.event("choice").includes(button.link[2]);
				})
				.set(
					"choice",
					(function () {
						let choice = [],
							known = target.getKnownCards(player),
							cards = target.countCards("h", i => !known.includes(i));
						for (let i of known) {
							choice.add(get.type2(i, target));
						}
						if (!cards) return choice;
						if (!choice.includes("basic") && cards > 2 * Math.random()) choice.push("basic");
						if (!choice.includes("trick") && cards > 3 * Math.random()) choice.push("trick");
						if (!choice.includes("equip") && cards > 6 * Math.random()) choice.push("equip");
						return choice;
					})()
				)
				.forResult();
			if (!result.bool) return;
			const choices = result.links.map(i => i[2]);
			//if (!event.isMine() && !event.isOnline()) await game.delayx();
			await target.showHandcards();
			let num = 0;
			["basic", "trick", "equip"].forEach(type => {
				if (choices.includes(type) === target.hasCard(card => get.type2(card, target) === type, "h")) num++;
			});
			player.popup("猜对" + get.cnNumber(num) + "项");
			game.log(player, "猜对了" + get.cnNumber(num) + "项");
			switch (num) {
				case 3:
					player.addTempSkills(["scls_lingren_jianxiong", "scls_lingren_xingshang"], { player: "phaseBegin" });
				case 2:
					target.addTempSkill("lingren_adddamage");
					target.storage.lingren = {
						card: trigger.card,
						//player:event.targett,
					};
				case 1:
					await player.draw(2);
			}
		},
		ai: {
			threaten: 2.4,
		},
		subSkill: {
			jianxiong: {
				audio: "lingren_jianxiong",
				mark: true,
				intro: {
					content: lib.translate.lingren_jianxiong_info,
				},
				inherit: "jianxiong",
			},
			xingshang: {
				audio: "lingren_xingshang",
				mark: true,
				intro: {
					content: lib.translate.lingren_xingshang_info,
				},
				inherit: "xingshang",
			},
			used: {
				charlotte: true,
			},
		},
	},
	scls_qinzheng: {
		audio: "qinzheng",
		trigger: {
			player: ["useCard", "respond"],
		},
		filter(event, player) {
			let num = player.getAllHistory("useCard").length + player.getAllHistory("respond").length;
			return num % 3 === 0 || num % 5 === 0 || num % 8 === 0;
		},
		forced: true,
		async content(event, trigger, player) {
			let num = 0,
				total = player.getAllHistory("useCard").length + player.getAllHistory("respond").length;
			if (total % 3 === 0) num++;
			if (total % 5 === 0) num++;
			if (total % 8 === 0) num++;
			if (num) await player.draw(num);
		},
		group: "scls_qinzheng_count",
		intro: {
			content: "本局游戏已使用或打出过#张牌",
		},
		subSkill: {
			count: {
				trigger: {
					player: ["useCard1", "respond"],
				},
				silent: true,
				firstDo: true,
				noHidden: true,
				async content(event, trigger, player) {
					player.storage.scls_qinzheng = player.getAllHistory("useCard").length + player.getAllHistory("respond").length;
					player.markSkill("scls_qinzheng");
				},
			},
		},
	},
	//桃园挽歌
	//铠甲合体
	_taoyuanwange: {
		trigger: {
			global: "phaseBefore",
			player: "enterGame",
		},
		filter(event, player) {
			if (event.name == "phase" && game.phaseNumber != 0) return false;
			return Object.keys(lib.skill._taoyuanwange.getEquip).some(name => {
				return get.nameList(player).includes(name);
			});
		},
		direct: true,
		getEquip: {
			ty_liubei: ["dilu", "ty_feilongduofeng"],
			ty_luxun: ["shangfangbaojian"],
			ty_sunquan: ["qingmingjian"],
		},
		getAudio: {
			ty_liubei: "jizhao2",
			ty_luxun: "nzry_cuike2",
			ty_sunquan: "sbzhiheng2",
		},
		async content(event, trigger, player) {
			let list = get.nameList(player),
				info = lib.skill._taoyuanwange,
				names = Object.keys(info.getEquip);
			for (const name of names) {
				if (list.includes(name)) {
					let equips = [];
					for (let card of info.getEquip[name]) {
						let cardx = get.cardPile(cardx => cardx.name == card && player.canEquip(cardx));
						if (cardx) equips.push(cardx);
					}
					if (equips.length) {
						game.broadcastAll(function (audio) {
							if (lib.config.background_speak) {
								game.playAudio("skill", audio);
							}
						}, info.getAudio[name]);
						player.$gain2(equips);
						await player.equip(equips);
					}
				}
			}
		},
	},
	//刺客×4
	//孩子们，我分身了
	tyliupo: {
		mark: true,
		zhuanhuanji: true,
		marktext: "☯",
		intro: {
			content(storage, player, skill) {
				if (storage) return "回合开始时，你可令本轮所有所有即将造成的伤害均视为体力流失";
				return "回合开始时，你可令所有角色不能使用【桃】";
			},
		},
		trigger: {
			player: "phaseBegin",
		},
		logTarget: () => game.players,
		async content(event, trigger, player) {
			player.changeZhuanhuanji(event.name);
			let skill = event.name + "_" + (player.storage[event.name] ? "wansha" : "jueqing");
			for (let i of game.players) i.addTempSkill(skill, "roundStart");
		},
		subSkill: {
			wansha: {
				charlotte: true,
				mod: {
					cardSavable(card, player) {
						if (card.name == "tao") return false;
					},
					cardEnabled(card, player) {
						if (card.name == "tao") return false;
					},
				},
				mark: true,
				marktext: '<span style="text-decoration: line-through;">桃</span>',
				intro: {
					content: "不能使用桃",
				},
			},
			jueqing: {
				trigger: { player: "damageBefore" },
				forced: true,
				charlotte: true,
				content: function () {
					trigger.cancel();
					trigger.player.loseHp(trigger.num);
				},
				ai: {
					jueqing: true,
				},
				mark: true,
				marktext: '<span style="text-decoration: line-through;">伤</span>',
				intro: {
					content: "造成伤害改为失去体力",
				},
			},
		},
	},
	tyzhuiling: {
		trigger: {
			global: "loseHpEnd",
		},
		filter(event, player) {
			return player.countMark("tyzhuiling") < 3 && event.num > 0;
		},
		forced: true,
		logTarget: "player",
		async content(event, trigger, player) {
			let num = Math.min(3 - player.countMark(event.name), trigger.num);
			player.addMark(event.name, num);
		},
		marktext: "魂",
		intro: {
			name: "魂",
			content: "mark",
		},
		mod: {
			cardUsableTarget(card, player, target) {
				if (!target.countCards("h")) return Infinity;
			},
			targetInRange(card, player, target) {
				if (!target.countCards("h")) return true;
			},
		},
	},
	tyxihun: {
		trigger: { global: "roundStart" },
		forced: true,
		filter(event, player) {
			const curLen = player.actionHistory.length;
			if (curLen <= 2) return false;
			return true;
		},
		async content(event, trigger, player) {
			for (const target of game.players) {
				if (target == player) continue;
				const result = await target
					.chooseToDiscard(2, "h", "弃置两张手牌，或点取消失去1点体力")
					.set("ai", card => {
						let player = get.player();
						if (get.effect(player, { name: "losehp" }, player, player) > 0) return 0;
						return 6 - get.value(card);
					})
					.forResult();
				if (!result.bool) await target.loseHp();
			}
			if (!player.hasMark("tyzhuiling")) return;
			let list = [];
			for (let i = 1; i <= player.countMark("tyzhuiling"); i++) {
				list.push(get.cnNumber(i, true));
			}
			const result = await player
				.chooseControl(list)
				.set("prompt", "吸魂：选择要移去的“魂”数")
				.set("ai", () => {
					const player = get.player();
					return get.cnNumber(Math.max(1, Math.min(player.countMark("tyzhuiling"), player.getDamagedHp())), true);
				})
				.forResult();
			let num = result.index + 1;
			player.removeMark("tyzhuiling", num);
			if (player.isDamaged()) await player.recover(num);
		},
	},
	tyxianqi: {
		global: "tyxianqi_damage",
		subSkill: {
			damage: {
				enable: "phaseUse",
				usable: 1,
				prompt: "弃置两张牌或对自身造成1点伤害，然后令有【献气】的其他角色受到1点伤害",
				filterCard: true,
				position: "he",
				selectCard: [0, 2],
				filter(event, player) {
					return game.hasPlayer(current => current.hasSkill("tyxianqi") && current != player);
				},
				filterTarget(card, player, target) {
					if (ui.selected.cards?.length == 1) return false;
					return target.hasSkill("tyxianqi") && target != player;
				},
				selectTarget() {
					if (ui.selected.cards?.length == 1) return 114514;
					return -1;
				},
				check(card) {
					let player = get.player();
					if (get.damageEffect(player, player, player) > 0) return 0;
					return 8 - get.value(card);
				},
				complexTarget: true,
				async contentBefore(event, trigger, player) {
					if (!event.cards || !event.cards.length) await player.damage();
				},
				async content(event, trigger, player) {
					await event.target.damage();
				},
				ai: {
					order: 6,
					result: {
						player(player, target) {
							if (ui.selected.cards.length) return 0;
							if (player.hp >= target.hp) return -0.9;
							if (player.hp <= 2) return -10;
							return -2;
						},
						target(player, target) {
							if (!ui.selected.cards.length) {
								if (player.hp < 2) return 0;
								if (player.hp == 2 && target.hp >= 2) return 0;
								if (target.hp > player.hp) return 0;
							}
							return get.damageEffect(target, player);
						},
					},
				},
			},
		},
	},
	tyfansheng: {
		trigger: {
			player: "dying",
		},
		filter(event, player) {
			return (
				game
					.getAllGlobalHistory("everything", evt => {
						return evt.name == "dying" && evt.player == player;
					})
					.indexOf(event) == 0
			);
		},
		forced: true,
		skillAnimation: true,
		animationColor: "metal",
		async content(event, trigger, player) {
			await player.recoverTo(1);
			for (const target of game.players) {
				if (target == player) continue;
				const list = [];
				if (target.countCards("h")) list.push("手牌区");
				if (target.countCards("e")) list.push("装备区");
				if (list.length == 0) continue;
				let result;
				if (list.length == 1) result = { control: list[0] };
				else {
					result = await target
						.chooseControl(list)
						.set("prompt", "返生：弃置一个区域的所有牌")
						.set("ai", () => [0, 1].randomGet())
						.forResult();
				}
				let pos = result.control == "手牌区" ? "h" : "e";
				let cards = target.getCards(pos);
				if (cards.length) await target.discard(cards);
			}
		},
	},
	tyansha: {
		inherit: "tysiji",
		filter: function (event, player) {
			return (
				player.countCards("hes") &&
				player.canUse(
					{
						name: "sha",
						nature: "stab",
					},
					event.player
				)
			);
		},
		group: "tyansha_range",
		subSkill: {
			range: {
				trigger: {
					player: "useCardAfter",
				},
				filter(event, player) {
					return (
						event.skill == "tyansha" &&
						event.targets?.some(i => {
							return i.isIn() && !player.getStorage("tyansha_range").includes(i);
						})
					);
				},
				direct: true,
				content() {
					if (!player.getStorage("tyansha_range").length) {
						player.when({ global: "roundStart" }).then(() => {
							player.unmarkAuto("tyansha_range", player.getStorage("tyansha_range"));
						});
					}
					let targets = trigger.targets.filter(i => {
						return i.isIn() && !player.getStorage("tyansha_range").includes(i);
					});
					player.markAuto("tyansha_range", targets);
				},
				intro: {
					content: "$本轮计算与你的距离视为1",
				},
				firstDo: true,
				onremove: true,
				locked: false,
				mod: {
					globalTo(from, to, num) {
						if (to.getStorage("tyansha_range").includes(from)) {
							return -Infinity;
						}
					},
				},
			},
			backup: {
				filterCard: function (card) {
					return get.itemtype(card) == "card";
				},
				viewAs: {
					name: "sha",
					nature: "stab",
				},
				selectCard: 1,
				position: "hes",
				filterTarget(card, player, target) {
					if (target != _status.event.useTarget && !ui.selected.targets.includes(_status.event.useTarget)) return false;
					return lib.filter.targetEnabled.apply(this, arguments);
				},
				precontent() {
					event.result.skill = event.getParent(2).name;
				},
				ai1(card) {
					return 7 - get.value(card);
				},
			},
		},
	},
	tycangshen: {
		forced: true,
		trigger: {
			player: "useCardAfter",
		},
		filter(event, player) {
			return event.card.name == "sha";
		},
		async content(event, trigger, player) {
			player.tempBanSkill("tycangshen", "roundStart");
		},
		mod: {
			globalTo(from, to, num) {
				if (!to.isTempBanned("tycangshen")) return num + 1;
			},
		},
	},
	tyxiongren: {
		trigger: {
			source: "damageBegin1",
		},
		filter(event, player) {
			if (get.distance(event.player, player) <= 1) return false;
			return event.card?.name == "sha";
		},
		forced: true,
		async content(event, trigger, player) {
			trigger.num++;
		},
		mod: {
			cardUsableTarget(card, player, target) {
				if (get.distance(target, player) <= 1) return Infinity;
			},
			targetInRange(card, player, target) {
				if (get.distance(target, player) <= 1) return true;
			},
		},
	},
	tysiji: {
		trigger: { global: "phaseJieshuBegin" },
		filter: function (event, player) {
			if (
				!event.player.hasHistory("lose", evt => {
					return !["useCard", "respond"].includes(evt.getParent().name);
				})
			)
				return false;
			return (
				player.countCards("hes") &&
				player.canUse(
					{
						name: "sha",
						nature: "stab",
					},
					event.player,
					false
				)
			);
		},
		direct: true,
		async content(event, trigger, player) {
			var next = player.chooseToUse();
			next.set("useTarget", trigger.player);
			next.set("openskilldialog", `###${get.prompt(event.name, trigger.player)}###${lib.translate[event.name + "_info"]}`);
			next.set("norestore", true);
			next.set("_backupevent", "tyansha_backup");
			next.set("addCount", false);
			next.set("custom", {
				add: {},
				replace: { window: function () {} },
			});
			next.backup("tyansha_backup");
		},
	},
	tydaifa: {
		inherit: "tysiji",
		filter: function (event, player) {
			if (
				!game.hasPlayer2(current => {
					if (current == event.player) return false;
					if (
						current.hasHistory("lose", evt => {
							if (evt.type != "gain") return false;
							var evtx = evt.getParent();
							if (evtx.giver || evtx.getParent().name == "gift") return false;
							var cards = evtx.getg(event.player);
							if (!cards.length) return false;
							var cards2 = evtx.getl(current).cards2;
							for (var card of cards2) {
								if (cards.includes(card)) return true;
							}
							return false;
						})
					)
						return true;
				})
			)
				return false;
			return (
				player.countCards("hes") &&
				player.canUse(
					{
						name: "sha",
						nature: "stab",
					},
					event.player,
					false
				)
			);
		},
	},
	//桃神关羽
	tywushen: {
		audio: "wushen",
		enable: ["chooseToRespond", "chooseToUse"],
		filterCard(card, player) {
			return get.suit(card) == "heart";
		},
		position: "hes",
		viewAs: {
			name: "sha",
			storage: {
				tywushen: true,
			},
		},
		viewAsFilter(player) {
			if (!player.countCards("hes", { suit: "heart" })) return false;
		},
		prompt: "将一张红桃牌当杀使用或打出",
		check(card) {
			const val = get.value(card);
			if (_status.event.name == "chooseToRespond") return 1 / Math.max(0.1, val);
			return 5 - val;
		},
		ai: {
			skillTagFilter(player) {
				if (!player.countCards("hes", { suit: "heart" })) return false;
			},
			respondSha: true,
		},
		locked: false,
		mod: {
			cardUsable(card, player) {
				if (card?.storage?.tywushen) return Infinity;
			},
			targetInRange(card, player) {
				if (card?.storage?.tywushen) return true;
			},
		},
		group: "tywushen_respond",
		subSkill: {
			respond: {
				trigger: { player: "useCard" },
				direct: true,
				forced: true,
				filter(event, player) {
					return event.card?.storage?.tywushen;
				},
				content() {
					trigger.directHit.addArray(game.players);
					if (trigger.addCount !== false) {
						trigger.addCount = false;
						if (player.stat[player.stat.length - 1].card.sha > 0) {
							player.stat[player.stat.length - 1].card.sha--;
						}
					}
				},
			},
		},
	},
	tywuhun: {
		audio: "wuhun2",
		trigger: { player: "damageEnd" },
		filter(event, player) {
			return event.source && event.source.isIn();
		},
		forced: true,
		logTarget: "source",
		content() {
			trigger.source.addMark("tywuhun", trigger.num);
		},
		group: "tywuhun_die",
		ai: {
			notemp: true,
			effect: {
				target: (card, player, target) => {
					if (!target.hasFriend()) return;
					let rec = get.tag(card, "recover"),
						damage = get.tag(card, "damage");
					if (!rec && !damage) return;
					if (damage && player.hasSkillTag("jueqing", false, target)) return 1.7;
					let die = [null, 1],
						temp;
					game.filterPlayer(i => {
						temp = i.countMark("new_wuhun");
						if (i === player && target.hp + target.hujia > 1) temp++;
						if (temp > die[1]) die = [i, temp];
						else if (temp === die[1]) {
							if (!die[0]) die = [i, temp];
							else if (get.attitude(target, i) < get.attitude(target, die[0])) die = [i, temp];
						}
					});
					if (die[0]) {
						if (damage) return [1, 0, 1, (-6 * get.sgnAttitude(player, die[0])) / Math.max(1, target.hp)];
						return [1, (6 * get.sgnAttitude(player, die[0])) / Math.max(1, target.hp)];
					}
				},
			},
		},
		marktext: "魇",
		intro: {
			name: "梦魇",
			content: "mark",
			onunmark: true,
		},
		subSkill: {
			die: {
				audio: "wuhun2",
				trigger: { player: "die" },
				filter(event, player) {
					return (
						event.source ||
						game.hasPlayer(function (current) {
							return current != player && current.hasMark("tywuhun");
						})
					);
				},
				forced: true,
				direct: true,
				forceDie: true,
				skillAnimation: true,
				animationColor: "soil",
				content() {
					"step 0";
					var num = 0;
					for (var i = 0; i < game.players.length; i++) {
						var current = game.players[i];
						if (current != player && current.countMark("tywuhun") > num) {
							num = current.countMark("tywuhun");
						}
					}
					player
						.chooseTarget(true, "请选择【武魂】的目标", "令其进行判定，若判定结果不为【桃】，则其死亡", function (card, player, target) {
							return target != player && (target == _status.event.getTrigger().source || target.countMark("tywuhun") == _status.event.num);
						})
						.set("ai", function (target) {
							return -get.attitude(_status.event.player, target);
						})
						.set("forceDie", true)
						.set("num", num);
					"step 1";
					if (result.bool) {
						var target = result.targets[0];
						event.target = target;
						player.logSkill("tywuhun_die", target);
						player.line(target, { color: [255, 255, 0] });
						game.delay(2);
					}
					"step 2";
					target.judge(function (card) {
						if (["tao"].includes(card.name)) return 10;
						return -10;
					}).judge2 = function (result) {
						return result.bool == false ? true : false;
					};
					"step 3";
					if (!result.bool) target.die();
				},
			},
		},
	},
	//桃神张飞
	tyshencai: {
		audio: "shencai",
		enable: "phaseUse",
		filter(event, player) {
			if (player.countMark("tyshencai") > player.countMark("shencai")) return false;
			return true;
		},
		filterTarget: lib.filter.notMe,
		onremove: true,
		prompt: "选择一名其他角色进行地狱审判",
		content() {
			player.addMark("tyshencai", 1, false);
			player.addTempSkill("tyshencai_clear", "phaseUseEnd");
			var next = target.judge();
			next.callback = lib.skill.shencai.contentx;
		},
		ai: {
			order: 8,
			result: { target: -1 },
		},
		group: "tyshencai_wusheng",
		subSkill: {
			clear: {
				onremove: ["tyshencai"],
				charlotte: true,
			},
			wusheng: {
				audio: "shencai",
				enable: ["chooseToRespond", "chooseToUse"],
				filterCard(card, player) {
					return get.suit(card) == "none";
				},
				position: "hes",
				viewAs: {
					name: "sha",
					color: "none",
					suit: "none",
				},
				viewAsFilter(player) {
					if (!player.countCards("hes", { suit: "none" })) return false;
				},
				prompt: "将一张无色牌当杀使用或打出",
				check(card) {
					const val = get.value(card);
					if (_status.event.name == "chooseToRespond") return 1 / Math.max(0.1, val);
					return 5 - val;
				},
				ai: {
					skillTagFilter(player) {
						if (!player.countCards("hes", { color: "none" })) return false;
					},
					respondSha: true,
				},
			},
		},
	},
	tyxunshi: {
		audio: "xunshi",
		mod: {
			suit(card) {
				if (lib.skill.xunshi.isXunshi(card)) return "none";
			},
			targetInRange(card) {
				const suit = get.color(card);
				if (suit == "none" || suit == "unsure") return true;
			},
			cardUsable(card) {
				const suit = get.color(card);
				if (suit == "none" || suit == "unsure") return Infinity;
			},
		},
		init(player, skill) {
			player.addSkill("tyxunshi_mark");
		},
		onremove(player, skill) {
			player.removeSkill("tyxunshi_mark");
		},
		trigger: { player: "useCard2" },
		forced: true,
		filter(event, player) {
			return get.color(event.card) == "none";
		},
		content() {
			"step 0";
			if (player.countMark("shencai") < 4 && player.hasSkill("tyshencai", null, null, false)) player.addMark("shencai", 1, false);
			if (trigger.addCount !== false) {
				trigger.addCount = false;
				var stat = player.getStat().card,
					name = trigger.card.name;
				if (typeof stat[name] == "number") stat[name]--;
			}
			var info = get.info(trigger.card);
			if (info.allowMultiple == false) event.finish();
			else if (trigger.targets && !info.multitarget) {
				if (
					!game.hasPlayer(function (current) {
						return !trigger.targets.includes(current) && lib.filter.targetEnabled2(trigger.card, player, current);
					})
				)
					event.finish();
			} else event.finish();
			"step 1";
			var prompt2 = "为" + get.translation(trigger.card) + "增加任意个目标";
			player
				.chooseTarget(
					get.prompt("xunshi"),
					function (card, player, target) {
						var player = _status.event.player;
						return !_status.event.targets.includes(target) && lib.filter.targetEnabled2(_status.event.card, player, target);
					},
					[1, Infinity]
				)
				.set("prompt2", prompt2)
				.set("ai", function (target) {
					var trigger = _status.event.getTrigger();
					var player = _status.event.player;
					return get.effect(target, trigger.card, player, player);
				})
				.set("card", trigger.card)
				.set("targets", trigger.targets);
			"step 2";
			if (result.bool) {
				if (!event.isMine() && !event.isOnline()) game.delayx();
				event.targets = result.targets;
			} else {
				event.finish();
			}
			"step 3";
			if (event.targets) {
				player.line(event.targets, "fire");
				trigger.targets.addArray(event.targets);
			}
		},
		subSkill: {
			mark: {
				charlotte: true,
				trigger: {
					player: "gainAfter",
					global: "loseAsyncAfter",
				},
				filter(event, player, name) {
					return event.getg(player).length && player.countCards("h");
				},
				direct: true,
				firstDo: true,
				content() {
					let cards1 = [],
						cards2 = [];
					player.getCards("h").forEach(card => {
						let bool1 = lib.skill.xunshi.isXunshi(card),
							bool2 = card.hasGaintag("tyxunshi_tag");
						if (bool1 && !bool2) cards1.add(card);
						if (!bool1 && bool2) cards2.add(card);
					});
					if (cards1.length) player.addGaintag(cards1, "tyxunshi_tag");
					if (cards2.length) cards2.forEach(card => card.removeGaintag("tyxunshi_tag"));
				},
			},
		},
	},
	//范强张达
	tybianta: {
		trigger: {
			target: "useCardToTargeted",
		},
		usable: 1,
		filter(event, player) {
			return get.tag(event.card, "damage") && event.cards?.length;
		},
		marktext: "怨",
		intro: {
			name: "怨",
			content: "expansion",
			markcount: "expansion",
		},
		init(player, skill) {
			if (player.getExpansions("tyxingsha").length) {
				for (let card of player.getExpansions("tyxingsha")) {
					card.gaintag.remove("tyxingsha");
					card.gaintag.add(skill);
				}
				player.markSkill(skill);
			}
		},
		onremove(player, skill) {
			if (!_status.event.getParent("tyxiezhan", true)) {
				let cards = player.getExpansions(skill);
				if (cards.length) player.loseToDiscardpile(skill);
			}
		},
		async content(event, trigger, player) {
			const next = player.addToExpansion(trigger.cards, "gain2");
			next.gaintag.add("tybianta");
			await next;
		},
		group: "tybianta_jieshu",
		subSkill: {
			jieshu: {
				trigger: {
					player: "phaseJieshuBegin",
				},
				filter(event, player) {
					return player.getExpansions("tybianta").length;
				},
				prompt2: "依次使用或打出你所有的“怨”",
				async content(event, trigger, player) {
					player.addTempSkill("tybianta_use");
					while (player.getExpansions("tybianta").length) {
						const card = player.getExpansions("tybianta")[0];
						if (player.hasUseTarget(card)) {
							const result = await player.chooseUseTarget(card).forResult();
							if (!result.bool) break;
						} else break;
					}
					player.removeSkill("tybianta_use");
				},
			},
			use: {
				enable: ["chooseToUse", "chooseToRespond"],
				filter(event, player) {
					if (!event.tybianta) return false;
					let card = event.tybianta;
					return event.filterCard(card, player, event);
				},
				onChooseToUse(event) {
					if (game.online) return;
					var player = event.player;
					if (!player.getExpansions("tybianta").length) event.set("tybianta", false);
					else event.set("tybianta", player.getExpansions("tybianta")[0]);
				},
				onChooseToRespond(event) {
					if (game.online) return;
					var player = event.player;
					if (!player.getExpansions("tybianta").length) event.set("tybianta", false);
					else event.set("tybianta", player.getExpansions("tybianta")[0]);
				},
				filterCard(card, player) {
					return card == _status.event.tybianta;
				},
				selectCard: -1,
				position: "x",
				viewAs(cards, player) {
					let card = _status.event.tybianta;
					if (card) return card;
					return null;
				},
				prompt(event, player) {
					let card = _status.event.tybianta;
					return `是否使用${get.translation(card)}？`;
				},
				precontent() {
					event.result.card = event.result.cards[0];
				},
				hiddenCard(player, name) {
					if (!player.getExpansions("tybianta").length) return false;
					return get.name(player.getExpansions("tybianta")[0], false) == name;
				},
				ai: {
					respondSha: true,
					respondShan: true,
					skillTagFilter(player, tag) {
						let name = tag.slice(7).toLowerCase();
						if (!player.getExpansions("tybianta").length) return false;
						return get.name(player.getExpansions("tybianta")[0], false) == name;
					},
				},
			},
		},
	},
	tybenxiang: {
		trigger: {
			source: "die",
		},
		locked: true,
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt2(event.name.slice(0, -5)), lib.filter.notMe, true)
				.set("ai", target => {
					return get.effect(target, { name: "draw" }, get.player(), get.player());
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			await target.draw(3);
		},
	},
	tyxiezhan: {
		audio: "juesheng",
		trigger: {
			player: ["phaseUseBegin", "enterGame"],
			global: "phaseBefore",
		},
		filter(event, player) {
			return event.name != "phase" || game.phaseNumber == 0;
		},
		locked: true,
		async cost(event, trigger, player) {
			let list = get.nameList(player),
				bool = trigger.name == "phaseUse";
			if (bool) {
				if (list.includes("ty_fanjiang")) {
					event.result = {
						bool: true,
						cost_data: "ty_zhangda",
					};
				} else if (list.includes("ty_zhangda")) {
					event.result = {
						bool: true,
						cost_data: "ty_fanjiang",
					};
				} else bool = false;
			}
			if (!bool) {
				const result = await player
					.chooseControl("范疆", "张达")
					.set("prompt", "协战：请变身")
					.set("ai", () => [0, 1].randomGet())
					.forResult();
				event.result = {
					bool: true,
					cost_data: result.control == "范疆" ? "ty_fanjiang" : "ty_zhangda",
				};
			}
		},
		async content(event, trigger, player) {
			let prename = player.name1;
			if (player.name2 && get.character(player.name2, 3).includes("tyxiezhan")) prename = player.name2;
			await player.reinitCharacter(prename, event.cost_data);
			await game.delay();
		},
	},
	tyxingsha: {
		marktext: "怨",
		intro: {
			name: "怨",
			content: "expansion",
			markcount: "expansion",
		},
		init(player, skill) {
			if (player.getExpansions("tybianta").length) {
				for (let card of player.getExpansions("tybianta")) {
					card.gaintag.remove("tybianta");
					card.gaintag.add(skill);
				}
				player.markSkill(skill);
			}
		},
		onremove(player, skill) {
			if (!_status.event.getParent("tyxiezhan", true)) {
				let cards = player.getExpansions(skill);
				if (cards.length) player.loseToDiscardpile(skill);
			}
		},
		enable: "phaseUse",
		filter(event, player) {
			return player.countCards("he") && !player.hasSkill("tyxingsha_used");
		},
		filterCard: true,
		selectCard: [1, 2],
		lose: false,
		discard: false,
		async content(event, trigger, player) {
			player.addTempSkill("tyxingsha_used");
			const next = player.addToExpansion(event.cards, player, "give");
			next.gaintag.add("tyxingsha");
			await next;
		},
		group: "tyxingsha_use",
		subSkill: {
			used: {
				charlotte: true,
			},
			use: {
				trigger: {
					player: "phaseJieshuBegin",
				},
				filter(event, player) {
					if (!player.hasUseTarget(get.autoViewAs({ name: "sha" }, "unsure"), false)) return false;
					return player.getExpansions("tyxingsha").length;
				},
				async cost(event, trigger, player) {
					const result = await player
						.chooseButton(["刑杀：是否将两张“怨”当作杀使用？", player.getExpansions("tyxingsha")], 2)
						.set("ai", button => {
							let player = get.player(),
								eff = player.getUseValue(get.autoViewAs({ name: "sha" }, "unsure"), false);
							if (eff <= 0) return 0;
							return player.getHp() - player.getUseValue(button.link);
						})
						.forResult();
					event.result = {
						bool: result.bool,
						cards: result.links,
					};
				},
				async content(event, trigger, player) {
					let card = get.autoViewAs({ name: "sha" }, event.cards);
					await player.chooseUseTarget(card, event.cards, false, "nodistance");
				},
			},
		},
	},
	tyxianshou: {
		trigger: {
			source: "die",
		},
		locked: true,
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt2(event.name.slice(0, -5)), lib.filter.notMe, true)
				.set("ai", target => {
					return get.effect(target, { name: "recover" }, get.player(), get.player());
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			if (target.isDamaged()) await target.recover(2);
		},
	},
	//刘阿
	tyxiyu: {
		audio: 2,
		trigger: {
			global: "useCardToPlayered",
		},
		filter(event, player) {
			return event.isFirstTarget && (get.is.convertedCard(event.card) || get.is.virtualCard(event.card));
		},
		frequent: true,
		async content(event, trigger, player) {
			await player.draw();
		},
	},
	//谭雄
	tylengjian: {
		trigger: {
			player: "useCardToTargeted",
		},
		filter(event, player) {
			if (event.card.name != "sha") return false;
			return !player.getStorage("tylengjian").includes(event.target);
		},
		intro: {
			content: "本回合已对$使用过【杀】",
		},
		forced: true,
		logTarget: "target",
		async content(event, trigger, player) {
			const target = event.targets[0];
			if (!player.getStorage("tylengjian").length) {
				player.when({ global: "phaseEnd" }).then(() => {
					player.unmarkSkill("tylengjian");
					delete player.storage.tylengjian;
				});
			}
			player.markAuto("tylengjian", target);
			if (player.inRange(target)) {
				const id = target.playerid;
				const map = trigger.getParent().customArgs;
				if (!map[id]) map[id] = {};
				if (typeof map[id].extraDamage != "number") {
					map[id].extraDamage = 0;
				}
				map[id].extraDamage++;
			} else trigger.getParent().directHit.push(target);
		},
		mod: {
			targetInRange(card, player, target) {
				if (card.name == "sha" && !player.inRange(target)) {
					if (!player.getStorage("tylengjian").includes(target)) return true;
				}
			},
		},
	},
	tysheju: {
		trigger: {
			player: "useCardAfter",
		},
		filter(event, player) {
			if (event.card.name != "sha") return false;
			return event.targets?.some(current => current.isIn() && current.countCards("he"));
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt2("tysheju"), function (card, player, target) {
					return _status.event.getTrigger().targets.includes(target) && target.countCards("he");
				})
				.set("ai", target => {
					return get.effect(target, { name: "guohe_copy2" }, get.player(), get.player());
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			const result = await player.discardPlayerCard(target, "he", true).forResult();
			if (!result.bool || !result.links) return;
			let subtype = get.subtype(result.links[0]);
			if (subtype && ["equip3", "equip4", "equip6"].includes(subtype)) return;
			target.addTempSkill("tysheju_range");
			target.addMark("tysheju_range", 1, false);
			if (target.inRange(player)) {
				await target
					.chooseToUse(function (card, player, event) {
						if (get.name(card) != "sha") return false;
						return lib.filter.filterCard.apply(this, arguments);
					}, "是否对" + get.translation(player) + "使用一张杀？")
					.set("targetRequired", true)
					.set("complexSelect", true)
					.set("filterTarget", function (card, player, target) {
						if (target != _status.event.sourcex && !ui.selected.targets.includes(_status.event.sourcex)) return false;
						return lib.filter.targetEnabled.apply(this, arguments);
					})
					.set("sourcex", player);
			}
		},
		subSkill: {
			range: {
				charlotte: true,
				onremove: true,
				mark: true,
				intro: {
					content: "本回合攻击范围+#",
				},
				mod: {
					attackFrom(from, to, distance) {
						return distance - from.countMark("tysheju_range");
					},
				},
			},
		},
	},
	//buzhi
	tyhongde: {
		audio: "hongde",
		trigger: {
			player: ["loseAfter", "gainAfter"],
			global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"],
		},
		filter(event, player) {
			var num = event.getl(player).cards2.length;
			if (event.getg) num = Math.max(num, event.getg(player).length);
			return num > 1;
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt2("tyhongde"))
				.set("ai", function (target) {
					let player = get.player(),
						name = get.attitude(player, target) > 0 ? "draw" : "guohe_copy2";
					return get.effect(target, { name: name }, player, player);
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			const result = await player
				.chooseControl("摸一张牌", "弃置一张牌")
				.set("prompt", `令${get.translation(target)}执行一项`)
				.set("target", target)
				.set("ai", () => {
					const player = get.player(),
						target = get.event("target");
					let eff1 = get.effect(target, { name: "guohe_copy2" }, player, player),
						eff2 = get.effect(target, { name: "draw" }, player, player);
					if (eff1 > eff2) return 1;
					return 0;
				})
				.forResult();
			if (result.index == 0) await target.draw();
			else if (target.countCards("he")) await target.chooseToDiscard("he", true);
		},
	},
	tydingpan: {
		audio: "dingpan",
		enable: "phaseUse",
		usable(skill, player) {
			return get.event().tydingpan?.length;
		},
		filter(event, player) {
			return game.hasPlayer(current => current.countCards("e"));
		},
		filterTarget(event, player, target) {
			return target.countCards("e");
		},
		onChooseToUse(event) {
			if (event.type != "phase" || game.online) return;
			var list = [],
				player = event.player;
			player.getHistory("useCard", function (evt) {
				list.add(get.type2(evt.card));
			});
			event.set("tydingpan", list);
		},
		async content(event, trigger, player) {
			const { target } = event;
			await target.draw();
			let goon = get.damageEffect(target, player, target) >= 0;
			if (!goon && target.hp >= 4 && get.attitude(player, target) < 0) {
				var es = target.getCards("e");
				for (var i = 0; i < es.length; i++) {
					if (get.equipValue(es[i], target) >= 8) {
						goon = true;
						break;
					}
				}
			}
			const result = await target
				.chooseControl(function () {
					if (_status.event.goon) return "选项二";
					return "选项一";
				})
				.set("goon", goon)
				.set("prompt", "定叛")
				.set("choiceList", ["令" + get.translation(player) + "弃置你两张牌", "获得你装备区内的所有牌并受到1点伤害"])
				.forResult();
			if (result.index == 0) await player.discardPlayerCard(target, "he", Math.min(target.countCards("he"), 2), true);
			else {
				await target.gain(target.getCards("e"), "gain2");
				await target.damage();
			}
		},
		ai: {
			order: 7,
			result: {
				target(player, target) {
					if (get.damageEffect(target, player, target) >= 0) return 2;
					var att = get.attitude(player, target);
					if (att == 0) return 0;
					var es = target.getCards("e");
					if (att > 0 && (target.countCards("h") > 2 || target.needsToDiscard(1))) return 0;
					if (es.length == 1 && att > 0) return 0;
					for (var i = 0; i < es.length; i++) {
						var val = get.equipValue(es[i], target);
						if (val <= 4) {
							if (att > 0) {
								return 1;
							}
						} else if (val >= 7) {
							if (att < 0) {
								return -1;
							}
						}
					}
					return 0;
				},
			},
		},
	},
	//甘宁
	tyqixi: {
		audio: "qixi",
		inherit: "qixi",
		group: "tyqixi_nowuxie",
		subSkill: {
			nowuxie: {
				trigger: {
					player: "useCard",
				},
				filter(event, player) {
					if (event.card.name != "guohe" || !get.is.convertedCard(event.card)) return false;
					return event.cards?.some(card => get.type(card) != "basic");
				},
				direct: true,
				async content(event, trigger, player) {
					trigger.directHit.addArray(game.players);
				},
			},
		},
	},
	tyfenwei: {
		skillAnimation: true,
		animationColor: "wood",
		audio: "fenwei",
		trigger: { global: "useCardToPlayered" },
		filter(event, player) {
			if (event.getParent().triggeredTargets3.length > 1) return false;
			if (get.type(event.card) != "trick") return false;
			if (get.info(event.card).multitarget) return false;
			if (event.targets.length < 2) return false;
			return true;
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt("tyfenwei"), [1, trigger.targets.length], function (card, player, target) {
					return _status.event.targets.includes(target);
				})
				.set("ai", function (target) {
					var trigger = _status.event.getTrigger();
					if (game.phaseNumber > game.players.length * 2 && trigger.targets.length >= game.players.length - 1 && !trigger.excluded.includes(target)) {
						return -get.effect(target, trigger.card, trigger.player, _status.event.player);
					}
					return -1;
				})
				.set("targets", trigger.targets)
				.forResult();
		},
		async content(event, trigger, player) {
			trigger.getParent().excluded.addArray(event.targets);
			let num = Math.max(1, player.getAllHistory("useSkill", evt => evt.skill == event.name).length - 1);
			const result = await player
				.chooseBool(`失去${num}点体力，或点取消失去【奋威】`)
				.set("choice", player.hp > num)
				.forResult();
			if (result.bool) await player.loseHp(num);
			else await player.removeSkills(event.name);
		},
	},
	//陆逊
	tyqianshou: {
		mark: true,
		zhuanhuanji: true,
		marktext: "☯",
		intro: {
			content(storage) {
				if (storage) return "其他角色的回合开始时，若其体力值大于你，或其未处于横置状态，你可令其展示并交给你一张牌，若此牌不为黑色，你失去一点体力。";
				return "其他角色的回合开始时，若其体力值大于你，或其未处于横置状态，你可展示并交给其一张红色牌，本回合你不能使用手牌且你与其不能成为牌的目标。";
			},
		},
		trigger: {
			global: "phaseBegin",
		},
		filter(event, player) {
			if (event.player == player) return false;
			if (event.player.hp <= player.hp && event.player.isLinked()) return false;
			if (player.storage.tyqianshou) return event.player.countCards("he");
			return player.countCards("he", { color: "red" });
		},
		async cost(event, trigger, player) {
			if (player.storage.tyqianshou) {
				event.result = await player
					.chooseBool(get.prompt2("tyqianshou", trigger.player))
					.set("choice", get.attitude(player, trigger.player) > 0 || player.hp > 1)
					.forResult();
			} else {
				event.result = await player
					.chooseCard(get.prompt2("tyqianshou", trigger.player), "he", function (card) {
						return get.color(card) == "red";
					})
					.set(
						"canGive",
						(function () {
							const att = get.attitude(player, trigger.player) > 0;
							if (trigger.player.hp >= 3) return att;
							if (trigger.player.countCards("h") < 4) return att;
							return false;
						})()
					)
					.set("ai", card => {
						if (get.event("canGive")) return 6 - get.value(card);
						return 0;
					})
					.forResult();
			}
			event.result.targets = [trigger.player];
		},
		async content(event, trigger, player) {
			player.changeZhuanhuanji(event.name);
			if (player.storage[event.name]) {
				await player.showCards(get.translation(player) + "发动了【谦守】", event.cards);
				await player.give(event.cards, event.targets[0]);
				player.addTempSkill("tyqianshou_use");
				for (let target of [player].concat(event.targets)) {
					target.addTempSkill("tyqianshou_target");
				}
			} else {
				const target = event.targets[0],
					result = await target
						.chooseCard("he", true, `交给${get.translation(player)}一张牌，若不为黑色其失去1点体力`)
						.set("att", get.attitude(target, player))
						.set("ai", card => {
							let att = _status.event.att,
								val = 7 - get.value(card);
							if (get.color(card) == "black") val += att;
							return val;
						})
						.forResult();
				await target.showCards(get.translation(player) + "发动了【谦守】", result.cards);
				await target.give(result.cards, player);
				if (
					!player.getHistory("gain", evt => {
						return evt?.cards?.includes(result.cards[0]) && evt.getParent(event.name) == event;
					}).length
				)
					return;
				if (get.color(result.cards[0]) != "black") {
					await player.loseHp();
				}
			}
		},
		subSkill: {
			use: {
				mark: true,
				marktext: '<span style="text-decoration: line-through;">谦</span>',
				mod: {
					cardEnabled2(card) {
						if (get.position(card) == "h") return false;
					},
				},
				charlotte: true,
				intro: {
					content: "不能使用或打出手牌",
				},
			},
			target: {
				charlotte: true,
				mark: true,
				marktext: '<span style="text-decoration: line-through;">守</span>',
				intro: { content: "本回合无法成为牌的目标" },
				mod: { targetEnabled: () => false },
			},
		},
	},
	tytanlong: {
		enable: "phaseUse",
		usable: 221,
		filter(event, player) {
			if (player.countMark("tytanlong") > game.countPlayer(current => current.isLinked())) return false;
			return game.hasPlayer(current => player.canCompare(current)) && player.countCards("h");
		},
		filterTarget(event, player, target) {
			return player.canCompare(target);
		},
		async content(event, trigger, player) {
			if (!player.countMark("tytanlong")) {
				player.when({ global: ["phaseUseBegin", "phaseUseAfter"] }).then(() => {
					player.removeMark("tytanlong", player.countMark("tytanlong"), false);
				});
			}
			player.addMark("tytanlong", 1, false);
			const target = event.target;
			const next = player.chooseToCompare(target);
			if (get.attitude(player, target) > 0) next.set("small", true);
			const result = await next.forResult();
			if (result.tie) return;
			let winner = result.bool ? player : target,
				card = result[result.bool ? "target" : "player"];
			if (winner?.isIn() && card && [card].filterInD("d")) {
				let bool = get.attitude(winner, player) > 0;
				if (winner.getUseValue(card) >= 4) bool = true;
				const result2 = await winner
					.chooseBool(`是否获得${get.translation(card)}并视为对自己使用一张【铁索连环】？`)
					.set("choice", bool)
					.forResult();
				if (!result2.bool) return;
				await winner.gain(card, "gain2");
				let cardx = { name: "tiesuo", isCard: true };
				if (winner.canUse(cardx, winner)) await winner.useCard(cardx, winner);
			}
		},
		ai: {
			order: 7,
			result: {
				target(player, target) {
					return get.effect(target, { name: "tiesuo" }, target, target);
				},
			},
		},
	},
	tyxibei: {
		trigger: {
			global: ["gainAfter", "loseAsyncAfter"],
		},
		getIndex(event, player) {
			if (!event.getg) return [];
			return game
				.filterPlayer(current => {
					if (current == player) return false;
					if (event.name == "gain") return event.getg(current)?.length && event.notFromCardpile;
					return event.getg(current)?.some(card => {
						return card.original != "c";
					});
				})
				.sortBySeat();
		},
		logTarget(event, player, name, target) {
			return target;
		},
		frequent: true,
		async content(event, trigger, player) {
			await player.draw();
			if (!player.isPhaseUsing()) return;
			const result = await player
				.chooseCard("h", "是否展示一张锦囊牌，令此牌视为【火烧连营】？", card => {
					return get.type2(card) == "trick";
				})
				.set("ai", card => {
					let player = get.player();
					if (player.getUseValue("huogong") > 0) return 6 - get.value(card);
					return 0;
				})
				.forResult();
			if (!result.bool) return;
			game.broadcastAll(function (cards) {
				cards.forEach(card => card.addGaintag("tyxibei"));
			}, result.cards);
			player.addTempSkill("tyxibei_viewAs");
		},
		group: "tyxibei_record",
		subSkill: {
			record: {
				trigger: { global: "gainBefore" },
				direct: true,
				filter(event, player) {
					if (player == event.player) return false;
					if (event.cards?.length) {
						if (event.getParent().name == "draw") return false;
						for (var i = 0; i < event.cards.length; i++) if (get.position(event.cards[i]) != "c" || (!get.position(event.cards[i]) && event.cards[i].original != "c")) return true;
					}
					return false;
				},
				content() {
					trigger.notFromCardpile = true;
				},
			},
			viewAs: {
				mod: {
					cardname(card, player) {
						if (card.hasGaintag("tyxibei")) return "lx_huoshaolianying";
					},
				},
				charlotte: true,
				onremove(player) {
					player.removeGaintag("tyxibei");
				},
			},
		},
	},
	//神刘
	tylongnu: {
		mark: true,
		zhuanhuanji: true,
		marktext: "☯",
		intro: {
			content(storage) {
				if (storage) return "出牌阶段开始时，你可以减少1点体力上限并摸一张牌，然后本阶段内你可以将锦囊牌当作无次数限制雷杀使用或打出";
				return "锁定技，出牌阶段开始时，你可以失去1点体力并摸一张牌，然后本阶段内你可以将红色手牌当作无距离限制的火杀使用或打出";
			},
		},
		audio: "nzry_longnu",
		trigger: {
			player: "phaseUseBegin",
		},
		async content(event, trigger, player) {
			player.changeZhuanhuanji("tylongnu");
			await player.draw();
			if (!player.storage.tylongnu) {
				await player.loseMaxHp();
				player.addTempSkill("tylongnu_yang", "phaseUseAfter");
			} else {
				await player.loseHp();
				player.addTempSkill("tylongnu_yin", "phaseUseAfter");
			}
		},
		group: "tylongnu_change",
		subSkill: {
			change: {
				audio: "nzry_longnu",
				trigger: {
					global: "phaseBefore",
					player: "enterGame",
				},
				filter(event, player) {
					return event.name != "phase" || game.phaseNumber == 0;
				},
				prompt2(event, player) {
					return "切换【龙怒】为状态" + (player.storage.tylongnu ? "阴" : "阳");
				},
				check: () => Math.random() > 0.5,
				content() {
					player.changeZhuanhuanji("tylongnu");
				},
			},
			yang: {
				mod: {
					cardUsable(card, player) {
						if (card?.storage?.tylongnu) return Infinity;
					},
				},
				charlotte: true,
				locked: false,
				audio: "nzry_longnu",
				enable: ["chooseToUse", "chooseToRespond"],
				filterCard(card, player) {
					return get.type2(card) == "trick";
				},
				position: "hes",
				viewAs: {
					name: "sha",
					nature: "thunder",
					storage: {
						tylongnu: true,
					},
				},
				viewAsFilter(player) {
					if (!player.countCards("hes", card => get.type2(card) == "trick")) return false;
				},
				prompt: "将一张锦囊牌当雷杀使用或打出",
				check(card) {
					var val = get.value(card);
					return 5 - val;
				},
				ai: {
					effect: {
						target(card, player, target, current) {
							if (get.tag(card, "respondSha") && current < 0) return 0.6;
						},
					},
					respondSha: true,
				},
			},
			yin: {
				mod: {
					targetInRange(card) {
						if (card?.storage?.tylongnu) return true;
					},
				},
				charlotte: true,
				locked: false,
				audio: "nzry_longnu",
				enable: ["chooseToUse", "chooseToRespond"],
				filterCard(card, player) {
					return get.color(card) == "red";
				},
				position: "hs",
				viewAs: {
					name: "sha",
					nature: "fire",
					storage: {
						tylongnu: true,
					},
				},
				viewAsFilter(player) {
					if (!player.countCards("hs", { color: "red" })) return false;
				},
				prompt: "将一张红色手牌当火杀使用或打出",
				check(card) {
					var val = get.value(card);
					return 5 - val;
				},
				ai: {
					effect: {
						target(card, player, target, current) {
							if (get.tag(card, "respondSha") && current < 0) return 0.6;
						},
					},
					respondSha: true,
				},
			},
		},
		ai: {
			fireAttack: true,
			halfneg: true,
			threaten: 1.05,
		},
	},
	tytaoyuan: {
		enable: "phaseUse",
		usable: 1,
		filterCard: true,
		selectCard: 2,
		position: "he",
		filterTarget: true,
		check(card) {
			return 4 - get.value(card);
		},
		async content(event, trigger, player) {
			const card = game.createCard("taoyuan", "heart", 1);
			if (card) await event.target.gain(card, "gain2");
		},
		ai: {
			order: 4,
			result: {
				target(player, target) {
					if (target.getUseValue("taoyuan") * get.sgnAttitude(player, target) >= player.getUseValue("wuzhong")) return 1;
					return 0;
				},
			},
		},
	},
	//关银屏
	tywuji: {
		skillAnimation: true,
		animationColor: "orange",
		audio: "wuji",
		trigger: { player: "phaseJieshuBegin" },
		forced: true,
		juexingji: true,
		filter(event, player) {
			return player.getStat("damage") >= 3;
		},
		async content(event, trigger, player) {
			player.awakenSkill(event.name);
			await player.gainMaxHp();
			await player.recover();
			await player.removeSkills("huxiao");
			const result = await player
				.chooseControl("获得青龙刀", "摸两张牌")
				.set("prompt", "武继：选择一项")
				.set("ai", () => 1)
				.forResult();
			if (result.index == 0) {
				const card = game.createCard("qinglong", "spade", 5);
				if (card) {
					await player.gain(card, "gain2", "log");
				}
			} else await player.draw(2);
		},
	},
	//沙和尚
	tymanyong: {
		onremove: true,
		trigger: {
			player: ["phaseZhunbeiBegin", "phaseJieshuBegin"],
		},
		filter(event, player) {
			let hasCard = player.getEquips("tiejili").length > 0;
			if (event.name == "phaseZhunbei") return !hasCard;
			return hasCard;
		},
		async content(event, trigger, player) {
			if (trigger.name == "phaseZhunbei") {
				const card = game.createCard("tiejili", "spade", 5);
				if (card) {
					player.$gain2(card);
					await player.equip(card);
				}
			} else {
				const cards = player.getEquips("tiejili");
				if (cards?.length) await player.discard(cards);
			}
		},
	},
	//关兴
	tyconglong: {
		trigger: {
			global: ["useCard", "damageBegin1", "phaseEnd"],
		},
		filter(event, player) {
			if (event.name == "phase") {
				let num = 0;
				player.getHistory("lose", evt => {
					if (evt.type == "discard") num += evt.cards2.length;
				});
				return num >= 2;
			}
			if (!event.card || event.card.name != "sha" || get.color(event.card) != "red") return false;
			return player.countCards("he", card => get.type2(card) == (event.name == "damage" ? "equip" : "trick"));
		},
		frequent: true,
		async cost(event, trigger, player) {
			if (trigger.name == "phase") {
				event.result = await player.chooseBool(get.prompt("tyconglong"), "摸一张牌").set("frequentSkill", "tyconglong").forResult();
			} else {
				const eff1 = get.damageEffect(trigger.player, trigger.source, player);
				const eff2 = get.attitude(player, trigger.player);
				event.result = await player
					.chooseToDiscard("he", card => {
						const type = _status.event.typex;
						return get.type2(card) == type;
					})
					.set("typex", trigger.name == "damage" ? "equip" : "trick")
					.set("prompt", get.prompt("tyconglong"))
					.set("prompt2", trigger.name == "damage" ? "令此伤害+1" : "令此牌不可响应")
					.set("eff", trigger.name == "damage" ? eff1 : eff2)
					.set("ai", card => {
						if (get.event("eff") <= 0) return 0;
						if (get.color(card) == "red") return 4 - get.value(card);
						return 8 - get.value(card);
					})
					.set("chooseonly", true)
					.forResult();
			}
		},
		async content(event, trigger, player) {
			if (trigger.name == "phase") await player.draw();
			else {
				await player.discard(event.cards);
				if (trigger.name == "damage") trigger.num++;
				else trigger.directHit.addArray(game.players);
			}
		},
	},
	tyzhaowu: {
		trigger: {
			player: "damageEnd",
		},
		filter(event, player) {
			if (!player.countCards("he")) return false;
			return event.source && event.source != player;
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseToDiscard("he", get.prompt2("tyzhaowu", trigger.source))
				.set("ai", card => {
					let player = get.player(),
						target = get.event().getTrigger().source;
					if (get.attitude(player, target) >= 0 || player.getStorage("tyzhaowu").includes(target)) return 0;
					return 7 - get.value(card);
				})
				.set("chooseonly", true)
				.forResult();
			event.result.targets = [trigger.source];
		},
		async content(event, trigger, player) {
			await player.discard(event.cards);
			player.addTempSkill("tyzhaowu_wusheng", "roundStart");
			player.markAuto("tyzhaowu_wusheng", event.targets);
		},
		subSkill: {
			wusheng: {
				mark: true,
				intro: {
					content: "本轮可对$使用父亲的力量",
				},
				charlotte: true,
				onremove: true,
				mod: {
					targetInRange(card, player, target) {
						if (player.getStorage("tyzhaowu_wusheng").includes(target)) return true;
					},
					playerEnabled(card, player, target) {
						if (player.getStorage("tyzhaowu_wusheng").includes(target)) return;
						if (card.storage?.tyzhaowu) return false;
					},
				},
				locked: false,
				audio: "new_rewusheng",
				enable: "chooseToUse",
				filterCard(card, player) {
					return get.color(card) == "red";
				},
				position: "hes",
				viewAs: {
					name: "sha",
					storage: {
						tyzhaowu: true,
					},
				},
				viewAsFilter(player) {
					if (!player.countCards("hes", { color: "red" })) return false;
				},
				prompt: "将一张红色牌当杀使用或打出",
				check(card) {
					var val = get.value(card);
					return 5 - val;
				},
				ai: {
					respondSha: true,
					skillTagFilter: function (player) {
						if (!player.countCards("hes", { color: "red" })) return false;
					},
				},
			},
		},
	},
	//侍从
	tyjinzhong: {
		trigger: {
			player: ["phaseUseBegin", "damageEnd"],
		},
		filter(event, player) {
			if (game.hasPlayer(i => i.getSeatNum() == 1 || get.nameList(i).some(name => get.rawName(name) == "刘备"))) return true;
			if (player.countCards("h")) return true;
			return false;
		},
		seatRelated: true,
		async cost(event, trigger, player) {
			const result = await player
				.chooseControl("选项一", "选项二", "cancel2")
				.set("choiceList", ["失去一点体力，令一号位或“刘备”回复一点体力", "交给一名角色至多两张手牌"])
				.set("prompt", get.prompt("tyjinzhong"))
				.set(
					"choice",
					(function () {
						let targets = game.filterPlayer(i => i.getSeatNum() == 1 || get.nameList(i).some(name => get.rawName(name) == "刘备"));
						if (targets?.length && targets.some(i => get.attitude(player, i) > 0 && i.hp <= player.hp)) return "选项一";
						if (game.hasPlayer(i => get.attitude(player, i) > 0 && player.countCards("h") > Math.min(2, player.hp))) return "选项二";
						return "cancel2";
					})()
				)
				.set("ai", () => get.event("choice"))
				.forResult();
			if (result.control == "cancel2") {
				event.result = { bool: false };
				return;
			}
			if (result.control == "选项一") {
				event.result = await player
					.chooseTarget("尽忠：是否失去一点体力并令一号位或“刘备”回复一点体力？", function (card, player, target) {
						return target.getSeatNum() == 1 || get.nameList(target).some(name => get.rawName(name) == "刘备");
					})
					.set("ai", target => {
						if (get.attitude(get.player(), target) <= 0) return 0;
						return player.hp + 1 - target.hp;
					})
					.forResult();
			} else {
				event.result = await player
					.chooseCardTarget({
						filterCard: true,
						selectCard: [1, 2],
						position: "h",
						filterTarget: lib.filter.notMe,
						prompt: "尽忠：是否交给一名其他角色至多两张牌？",
						ai1(card) {
							return 8 - get.value(card);
						},
						ai2(target) {
							let player = _status.event.player,
								card = ui.selected.cards[0],
								att = get.attitude(player, target);
							if (att <= 0) return 0;
							return target.getUseValue(card) + 4;
						},
					})
					.forResult();
			}
		},
		async content(event, trigger, player) {
			if (event.cards?.length > 0) {
				await player.give(event.cards, event.targets[0]);
			} else {
				await player.loseHp();
				await event.targets[0].recover();
			}
		},
	},
	//吴班
	tyyoujun: {
		audio: "dcyouzhan",
		enable: "phaseUse",
		usable: 1,
		filterTarget(card, player, target) {
			return target.countGainableCards(player, "he") && target != player;
		},
		async content(event, trigger, player) {
			const target = event.target;
			await player.gainPlayerCard(target, "he", true);
			const result = await target
				.chooseBool("是否令你所有手牌视为杀，然后视为对" + get.translation(player) + "使用决斗？")
				.set("choice", get.effect(player, { name: "juedou" }, target, target) > 0)
				.forResult();
			if (result.bool) {
				target.addTempSkill("tyyoujun_sha");
				const card = { name: "juedou", isCard: true };
				if (target.canUse(card, player)) await target.useCard(card, player);
			}
		},
		subSkill: {
			sha: {
				charlotte: true,
				mod: {
					cardname(card) {
						return "sha";
					},
				},
			},
		},
		ai: {
			order: 5,
			result: {
				target(player, target) {
					if (player.hp == 1) return 0;
					return get.effect(target, { name: "shunshou_copy2" }, player, target);
				},
			},
		},
	},
	tyjicheng: {
		skillAnimation: true,
		animationColor: "fire",
		limited: true,
		trigger: {
			player: "damageEnd",
		},
		filter(event, player) {
			if (player.hp > 2) return false;
			return event.card && get.type(event.card) == "trick";
		},
		async content(event, trigger, player) {
			player.awakenSkill(event.name);
			await player.chooseDrawRecover(2, true);
		},
	},
	//黄忠
	tyyizhuang: {
		trigger: { player: "phaseZhunbeiBegin" },
		filter(event, player) {
			return player.countCards("j");
		},
		check(event, player) {
			return player.hp > 1 && player.countCards("j", card => card.viewAs || card.name != "jsrg_xumou");
		},
		async content(event, trigger, player) {
			await player.damage();
			await player.discardPlayerCard(player, "j", true, player.countCards("j"));
		},
	},
	//廖化
	tydangxian: {
		trigger: { player: "phaseBegin" },
		forced: true,
		audio: "dangxian",
		async content(event, trigger, player) {
			const cards = Array.from(ui.discardPile.childNodes).filter(card => card.name == "sha");
			if (cards.length) {
				const result = await player.chooseButton(["获得一张杀", cards], true).forResult();
				if (result.bool) await player.gain(result.links, "gain2");
			}
			game.updateRoundNumber();
			trigger.phaseList.splice(trigger.num, 0, "phaseUse|tydangxian");
		},
	},
	tyfuli: {
		audio: "xinfuli",
		skillAnimation: true,
		animationColor: "soil",
		unique: true,
		limited: true,
		enable: "chooseToUse",
		mark: true,
		filter(event, player) {
			if (event.type != "dying") return false;
			if (player != event.dying) return false;
			return true;
		},
		async content(event, trigger, player) {
			player.awakenSkill(event.name);
			await player.recoverTo(2);
			await player.drawTo(2);
		},
		ai: {
			save: true,
			skillTagFilter(player, arg, target) {
				return player == target;
			},
			result: {
				player: 10,
			},
			threaten: function (player, target) {
				if (!target.storage.tyfuli) return 0.9;
			},
		},
		intro: {
			content: "limited",
		},
	},
	//冯习
	tyqingkou: {
		trigger: {
			player: "phaseJieshuBegin",
		},
		frequent: true,
		async content(event, trigger, player) {
			const result = await player.draw("bottom").forResult();
			await player.showCards(get.translation(player) + "发动了【轻寇】", result);
			if (result?.length != 1) return;
			let list = [],
				card = result[0];
			for (let name of lib.inpile) {
				if (get.type(name) == "trick" && get.cardNameLength(name) == player.hp) {
					list.push(["锦囊", "", name]);
				}
			}
			list.push(["基本", "", "sha"]);
			const result2 = await player
				.chooseButton([`是否将${get.translation(result)}当作其中一张使用？`, [list, "vcard"]])
				.set("filterButton", button => {
					let card = get.autoViewAs({ name: button.link[2], natrue: button.link[3] }, get.event("resultCard"));
					return get.player().hasUseTarget(card);
				})
				.set("resultCard", [card])
				.set("ai", button => {
					let card = get.autoViewAs({ name: button.link[2], natrue: button.link[3] }, get.event("resultCard"));
					return get.player().getUseValue(card);
				})
				.forResult();
			if (result2.bool && player.getCards("h").includes(card)) {
				const cardx = { name: result2.links[0][2], natrue: result2.links[0][3] };
				game.broadcastAll(function (card) {
					lib.skill.tyqingkou_backup.viewAs = card;
					lib.skill.tyqingkou_backup.prompt = `是否将此牌当作${get.translation(card)}使用？`;
				}, cardx);
				const next = player.chooseToUse();
				next.set("cards", result);
				next.set("openskilldialog", `是否将此牌当作${get.translation(cardx)}使用？`);
				next.set("norestore", true);
				next.set("_backupevent", "tyqingkou_backup");
				next.set("custom", {
					add: {},
					replace: { window: function () {} },
				});
				next.backup("tyqingkou_backup");
				await next;
			}
		},
		subSkill: {
			backup: {
				filterCard: function (card) {
					return get.itemtype(card) == "card" && get.event("cards").includes(card);
				},
				position: "h",
				selectCard: 1,
				check: card => 7 - get.value(card),
				popname: true,
			},
		},
	},
	//张南
	tyfenwu: {
		trigger: {
			player: "phaseZhunbeiBegin",
		},
		frequent: true,
		async content(event, trigger, player) {
			const result = await player.draw().forResult();
			await player.showCards(get.translation(player) + "发动了【奋武】", result);
			if (result?.length != 1) return;
			let list = [],
				card = result[0];
			for (let name of lib.inpile) {
				if (get.type(name) == "basic" && get.cardNameLength(name) == get.cardNameLength(card)) {
					list.push(["基本", "", name]);
					if (name == "sha") {
						for (let nature of lib.inpile_nature) list.push(["基本", "", name, nature]);
					}
				}
			}
			list.push(["锦囊", "", "juedou"]);
			const result2 = await player
				.chooseButton([`是否将${get.translation(result)}当作其中一张使用？`, [list, "vcard"]])
				.set("filterButton", button => {
					let card = get.autoViewAs({ name: button.link[2], natrue: button.link[3] }, get.event("resultCard"));
					return get.player().hasUseTarget(card);
				})
				.set("resultCard", [card])
				.set("ai", button => {
					let card = get.autoViewAs({ name: button.link[2], natrue: button.link[3] }, get.event("resultCard"));
					return get.player().getUseValue(card);
				})
				.forResult();
			if (result2.bool && player.getCards("h").includes(card)) {
				const cardx = { name: result2.links[0][2], natrue: result2.links[0][3] };
				game.broadcastAll(function (card) {
					lib.skill.tyfenwu_backup.viewAs = card;
					lib.skill.tyfenwu_backup.prompt = `是否将此牌当作${get.translation(card)}使用？`;
				}, cardx);
				const next = player.chooseToUse();
				next.set("cards", result);
				next.set("openskilldialog", `是否将此牌当作${get.translation(cardx)}使用？`);
				next.set("norestore", true);
				next.set("_backupevent", "tyfenwu_backup");
				next.set("custom", {
					add: {},
					replace: { window: function () {} },
				});
				next.backup("tyfenwu_backup");
				await next;
			}
		},
		subSkill: {
			backup: {
				filterCard: function (card) {
					return get.itemtype(card) == "card" && get.event("cards").includes(card);
				},
				position: "h",
				selectCard: 1,
				check: card => 7 - get.value(card),
				popname: true,
			},
		},
	},
	//赵融
	tyyuantao: {
		trigger: {
			global: "useCard",
		},
		usable: 1,
		filter(event, player) {
			if (!event.targets.length) return false;
			return get.type(event.card) == "basic";
		},
		check(event, player) {
			return get.effect(event.targets[0], event.card, event.player, player) > 0 && player.hp > 2;
		},
		async content(event, trigger, player) {
			trigger.effectCount++;
			player.when({ global: "phaseEnd" }).then(() => {
				player.loseHp();
			});
		},
	},
	//程畿
	tyzhongen: {
		audio: 2,
		trigger: {
			global: "phaseJieshuBegin",
		},
		filter(event, player) {
			return player.getHistory("gain").length + player.getHistory("lose", evt => evt.hs?.length).length;
		},
		async cost(event, trigger, player) {
			const target = trigger.player,
				goon = player.hasCard(card => {
					if (_status.connectMode) return true;
					return get.name(card, player) == "sha" && game.checkMod(card, player, "unchanged", "cardEnabled2", player) !== false && lib.filter.targetEnabled2(get.autoViewAs({ name: "wuzhong" }, [card]), player, target);
				}, "hs");
			let list = [];
			if (goon) list.push("选项一");
			list.addArray(["选项二", "cancel2"]);
			const { result } = await player
				.chooseControl(list)
				.set("choiceList", [`将一张【杀】当【无中生有】对${get.translation(target)}使用`, `使用一张无距离限制的【杀】`])
				.set("ai", () => {
					const player = get.event("player"),
						target = get.event().getTrigger().player;
					return get.effect(target, { name: "wuzhong" }, player, player) > player.getUseValue({ name: "sha" }) ? 0 : 1;
				});
			event.result = {
				bool: result.control != "cancel2",
				skill_popup: false,
				cost_data: result.control,
			};
		},
		async content(event, trigger, player) {
			const index = event.cost_data,
				target = trigger.player;
			if (index == "选项一") {
				const {
					result: { bool, cards },
				} = await player
					.chooseCard(
						"hes",
						true,
						(card, player) => {
							if (get.name(card, player) != "sha") return false;
							if (!game.checkMod(card, player, "unchanged", "cardEnabled2", player)) return false;
							return lib.filter.targetEnabled2(get.autoViewAs({ name: "wuzhong" }, [card]), player, get.event("target"));
						},
						"将一张【杀】当作【无中生有】对" + get.translation(target) + "使用"
					)
					.set("ai", card => {
						const player = get.event("player"),
							target = get.event("target");
						return get.effect(target, get.autoViewAs({ name: "wuzhong" }, [card]), player, player) / Math.max(1, get.value(card));
					})
					.set("target", target);
				if (bool) {
					player.logSkill(event.name, target);
					await player.useCard({ name: "wuzhong" }, cards, target, false);
				}
			} else {
				await player
					.chooseToUse(function (card, player, event) {
						if (get.name(card) != "sha") return false;
						return lib.filter.filterCard.apply(this, arguments);
					}, "忠恩：是否使用一张【杀】？")
					.set("targetRequired", true)
					.set("complexSelect", true)
					.set("filterTarget", function (card, player, target) {
						return lib.filter.targetEnabled.apply(this, arguments);
					})
					.set("logSkill", event.name)
					.set("addCount", false)
					.forResult();
			}
		},
	},
	tyliebao: {
		trigger: { global: "useCardToTarget" },
		filter(event, player) {
			if (event.card.name != "sha" || event.targets?.includes(player)) return false;
			if (!event.target.isMinHandcard()) return false;
			return lib.filter.targetEnabled(event.card, event.player, player);
		},
		check(event, player) {
			return get.attitude(player, event.target) > 0 && (player.hp > 2 || player.countCards("h", "shan"));
		},
		logTarget: "target",
		async content(event, trigger, player) {
			const target = event.targets[0];
			const evt = trigger.getParent();
			evt.triggeredTargets2.remove(target);
			evt.targets.remove(target);
			evt.targets.push(player);
			await player.draw();
			target
				.when({ global: "useCardAfter" })
				.filter(evt => evt.card == trigger.card)
				.then(() => {
					if (!skiller.hasHistory("damage", evt => evt.getParent("useCard") == evtx) && player.isDamaged()) player.recover();
				})
				.vars({
					skiller: player,
					evtx: evt,
				});
		},
	},
	//龙果子
	tyzhuan: {
		audio: "qingbei",
		enable: "phaseUse",
		filterCard(card, player) {
			return get.name(card, player) == "sha";
		},
		filterTarget(card, player, target) {
			return target != player && target.countCards("ej", card => get.type(card, target) == "equip");
		},
		check(card) {
			return 5 - get.value(card);
		},
		filter(event, player) {
			if (!player.countCards("he", card => lib.skill.tyzhuan.filterCard(card, player))) return false;
			return game.hasPlayer(target => lib.skill.tyzhuan.filterTarget(event, player, target));
		},
		async content(event, trigger, player) {
			const target = event.target;
			if (!target.countCards("ej", card => get.type(card, target) == "equip")) return;
			await player.gainPlayerCard("ej", target, true).set("filterButton", button => {
				return get.type(button.link, get.owner(button.link)) == "equip";
			});
		},
		ai: {
			order(item, player) {
				if (!player.hasCard(card => player.hasValueTarget(card), "h")) return 9;
				return 1;
			},
			result: {
				target: -1,
			},
		},
		subfrequent: ["draw"],
		group: "tyzhuan_draw",
		subSkill: {
			draw: {
				audio: "tyzhuan",
				trigger: { global: "useCardAfter" },
				filter(event, player) {
					return get.type(event.card, null, false) == "equip";
				},
				frequent: true,
				prompt2: "摸一张牌",
				content() {
					player.draw();
				},
			},
		},
	},
	//龙刘备
	tyqingshi: {
		audio: 2,
		trigger: { player: "phaseZhunbeiBegin" },
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget([1, player.hp], get.prompt2("tyqingshi"), function (card, player, target) {
					return target.countCards("h");
				})
				.set("ai", target => {
					return Math.max(0.1, get.attitude(get.player(), target));
				})
				.forResult();
		},
		async content(event, trigger, player) {
			await player.chooseToDebate(event.targets.sortBySeat()).set("callback", lib.skill.tyqingshi.callback);
		},
		async callback(event, trigger, player) {
			const result = event.debateResult;
			if (result.bool && result.opinion) {
				if (!["red", "black"].includes(result.opinion)) return;
				const targets = result[result.opinion].map(i => i[0]);
				if (result.opinion == "red") {
					for (const target of targets) {
						target.addTempSkill("tyqingshi_distance", "roundStart");
						target.addMark("tyqingshi_distance", 1, false);
					}
				} else {
					await player.draw(targets.length);
					let gains = [],
						give_map = [];
					while (true) {
						const result = await player
							.chooseCardTarget({
								filterCard(card) {
									return get.itemtype(card) == "card" && !card.hasGaintag("mbjiejian_tag");
								},
								filterTarget(card, player, target) {
									return get.event("canGain")(target) && target != player;
								},
								prompt: "倾师：是否分配手牌？",
								prompt2: "请选择要分配的卡牌和目标",
								ai1(card) {
									return 8 - get.value(card);
								},
								ai2(target) {
									let player = _status.event.player,
										card = ui.selected.cards[0],
										att = get.attitude(player, target);
									if (att <= 0) return 0;
									return target.getUseValue(card) + 4;
								},
							})
							.set("canGain", target => {
								return targets.includes(target) && !gains.includes(target);
							})
							.forResult();
						if (result.bool && result.targets?.length) {
							give_map.add([result.targets[0], result.cards]);
							player.addGaintag(result.cards, "mbjiejian_tag");
							gains.addArray(result.targets);
						} else break;
						if (!game.hasPlayer(i => i != player && targets.includes(i) && !gains.includes(i))) break;
					}
					await game
						.loseAsync({
							gain_list: give_map,
							player: player,
							cards: give_map.map(i => i[1]).flat(),
							giver: player,
							animate: "giveAuto",
						})
						.setContent("gaincardMultiple");
				}
			}
		},
		subSkill: {
			distance: {
				charlotte: true,
				mod: {
					globalFrom(from, to, distance) {
						return distance + from.countMark("tyqingshi_distance");
					},
					globalTo(from, to, distance) {
						return distance + to.countMark("tyqingshi_distance");
					},
				},
				onremove: true,
				mark: true,
				intro: {
					content: "你与其他角色的相互距离+$",
				},
			},
		},
	},
	tyyilin: {
		audio: 2,
		trigger: {
			global: ["gainAfter", "loseAsyncAfter"],
		},
		getIndex(event, player) {
			if (event.name == "loseAsync" && event.type != "gain") return [];
			if (!event.getl || !event.getg) return [];
			let cardsx = event.getl(player).cards2,
				cardsy = event.getg(player);
			return game
				.filterPlayer(current => {
					if (current == player) return false;
					if (player.getHistory("useSkill", evt => evt.skill == "tyyilin" && evt.targets?.includes(current)).length) return false;
					if (cardsx.length) {
						let cards = event.getg(current);
						if (cards?.length && cards.some(card => cardsx.includes(card))) return true;
					}
					if (cardsy.length) {
						let evt = event.getl(current);
						if (evt?.cards2?.length && evt.cards2.some(card => cardsy.includes(card))) return true;
					}
					return false;
				})
				.sortBySeat();
		},
		logTarget(event, player, name, target) {
			return target;
		},
		check(event, player, name, target) {
			return get.attitude(player, target) > 0;
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			let cards1 = trigger.getl(player)?.cards2,
				cards2 = trigger.getg(player);
			let cardsx = trigger.getl(target)?.cards2,
				cardsy = trigger.getg(target);
			if (cards1?.some(card => cardsy.includes(card))) {
				await target
					.chooseToUse({
						filterCard(card) {
							if (get.itemtype(card) != "card" || !get.event("useCard").includes(card)) return false;
							return lib.filter.filterCard.apply(this, arguments);
						},
						prompt: "是否使用获得的一张牌？",
					})
					.set("useCard", cards1);
			}
			if (cardsx?.some(card => cards2.includes(card))) {
				await player
					.chooseToUse({
						filterCard(card) {
							if (get.itemtype(card) != "card" || !get.event("useCard").includes(card)) return false;
							return lib.filter.filterCard.apply(this, arguments);
						},
						prompt: "是否使用获得的一张牌？",
					})
					.set("useCard", cardsx);
			}
		},
	},
	tychengming: {
		audio: 2,
		skillAnimation: true,
		animationColor: "fire",
		trigger: { player: "dying" },
		zhuSkill: true,
		filter: function (event, player) {
			if (player.hp > 0) return false;
			if (!player.hasZhuSkill("tychengming")) return false;
			return game.hasPlayer(function (current) {
				return current != player && current.group == "shu";
			});
		},
		mark: true,
		unique: true,
		limited: true,
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt2("tychengming"), function (card, player, target) {
					return target != player && target.group == "shu";
				})
				.set("ai", target => {
					return Math.max(1, get.attitude(get.player(), target));
				})
				.forResult();
		},
		async content(event, trigger, player) {
			player.awakenSkill(event.name);
			let cards = player.getCards("hej"),
				target = event.targets[0];
			if (cards.length) await target.gain(cards, "give");
			await player.recoverTo(1);
			let skills = target.getSkills(null, false, false).filter(skill => {
				var info = get.info(skill);
				if (!info || info.charlotte || !get.is.locked(skill) || get.skillInfoTranslation(skill, target).length == 0) return false;
				return true;
			});
			if (skills.length) await target.addSkills("rerende");
		},
	},
	//蜀孙权-孩子们，其实我早就是蜀国人了
	tyfuhan: {
		audio: 2,
		trigger: {
			global: ["gainAfter", "loseAsyncAfter"],
		},
		getIndex(event, player) {
			if (event.name == "loseAsync" && event.type != "gain") return [];
			if (!event.getl || !event.getg) return [];
			let cardsx = event.getl(player).cards2,
				cardsy = event.getg(player);
			return game
				.filterPlayer(current => {
					if (current == player) return false;
					if (cardsx.length) {
						let cards = event.getg(current);
						if (cards?.length && cards.some(card => cardsx.includes(card))) return true;
					}
					if (cardsy.length) {
						let evt = event.getl(current);
						if (evt?.cards2?.length && evt.cards2.some(card => cardsy.includes(card))) return true;
					}
					return false;
				})
				.sortBySeat();
		},
		filter: function (event, player, name, target) {
			if (!target.isIn()) return false;
			return true;
		},
		async cost(event, trigger, player) {
			const target = event.indexedData;
			let dialog = [get.prompt("tyfuhan", player, target)],
				list1 = [],
				list2 = [],
				bool = false;
			for (let i = 1; i < 6; i++) {
				if (player.hasEnabledSlot(i)) list1.push(i);
				if (player.hasDisabledSlot(i)) list2.push(i);
			}
			if (list2.length && trigger.getl(player)?.cards2?.length && trigger.getg(target).some(card => trigger.getl(player).cards2.includes(card))) {
				dialog.push("恢复其一个装备栏");
				dialog.push([list2.map(i => [[i, true], get.translation(`equip${i}`) + "栏"]), "tdnodes"]);
				bool = true;
			}
			if (list1.length && trigger.getg(player) && trigger.getl(target)?.cards2.some(card => trigger.getg(player).includes(card))) {
				dialog.push("废除其一个装备栏");
				dialog.push([list1.map(i => [[i, false], get.translation(`equip${i}`) + "栏"]), "tdnodes"]);
				bool = true;
			}
			if (bool) {
				const result = await target
					.chooseButton(dialog)
					.set("ai", button => {
						const type = button.link[1];
						if (_status.event.att > 0) {
							if (!_status.event.used || type) return 1 + Math.random();
							return 0;
						}
						return type ? 0 : 1 + Math.random();
					})
					.set("used", player.getHistory("useSkill", evt => evt.skill == "tyfuhan").length > 0)
					.set("att", get.attitude(target, _status.currentPhase))
					.forResult();
				event.result = {
					bool: result.bool,
					targets: [target],
					cost_data: result.links?.[0],
				};
			} else event.result = { bool: false };
		},
		async content(event, trigger, player) {
			const cost = event.cost_data;
			if (cost[1]) await player.enableEquip(cost[0]);
			else await player.disableEquip(cost[0]);
		},
		group: "tyfuhan_draw",
		subSkill: {
			draw: {
				trigger: {
					global: "phaseEnd",
				},
				filter(event, player) {
					if (!_status.currentPhase || _status.currentPhase.countCards("h") >= _status.currentPhase.maxHp) return false;
					return player.getHistory("useSkill", evt => evt.skill == "tyfuhan").length;
				},
				forced: true,
				locked: true,
				logTarget: () => _status.currentPhase,
				async content(event, trigger, player) {
					await event.targets[0].drawTo(event.targets[0].maxHp);
				},
			},
		},
	},
	tychende: {
		audio: 2,
		enable: "phaseUse",
		filterCard: true,
		selectCard: [2, Infinity],
		filter(event, player) {
			return player.countCards("h") > 1;
		},
		check(card) {
			const player = get.player();
			if (ui.selected.cards.length >= 2) return 0;
			if (player.getUseValue(card)) return 10 - get.value(card);
			return 6 - get.value(card);
		},
		position: "he",
		lose: false,
		delay: false,
		discard: false,
		filterTarget: lib.filter.notMe,
		async content(event, trigger, player) {
			const target = event.target,
				cards = event.cards;
			await player.showCards(get.translation(player) + "发动了【臣德】", cards);
			await player.give(cards, target, true);
			let list = [];
			for (let card of cards) {
				if (player.hasUseTarget(card, true, true) && ["trick", "basic"].includes(get.type(card))) list.push([get.type(card), "", get.name(card, false), get.nature(card, false)]);
			}
			if (!list.length) return;
			const result = await player
				.chooseButton(["臣德：是否视为使用其中一张？", [list, "vcard"]])
				.set("ai", button => {
					return get.player().getUseValue(button.link[2]);
				})
				.forResult();
			if (result.bool) await player.chooseUseTarget({ name: result.links[0][2], nature: result.links[0][3] }, true);
		},
		ai: {
			order: 6,
			result: {
				target: 1,
			},
		},
	},
	tywansu: {
		audio: 2,
		trigger: {
			global: ["useCard", "damageBefore"],
		},
		filter(event, player) {
			if (!event.card || !get.is.virtualCard(event.card)) return false;
			if (event.name == "useCard") return game.players.some(target => target.hasDisabledSlot());
			return true;
		},
		forced: true,
		logTarget(event, player) {
			if (event.name == "useCard") return game.players.filter(target => target.hasDisabledSlot());
			return event.player;
		},
		async content(event, trigger, player) {
			if (trigger.name == "useCard") trigger.directHit.addArray(event.targets);
			else {
				trigger.cancel();
				trigger.player.loseHp(trigger.num);
			}
		},
		ai: {
			jueqing: true,
		},
	},
	//神秘将军-孩子们，其实我没有死
	tywusheng: {
		audio: 2,
		enable: ["chooseToRespond", "chooseToUse"],
		filterCard(card, player) {
			return get.color(card) == "red";
		},
		position: "hes",
		viewAs: {
			name: "sha",
			storage: {
				tywusheng: true,
			},
		},
		viewAsFilter(player) {
			if (!player.countCards("hes", { color: "red" })) return false;
		},
		precontent: function () {
			var targets = event.result.targets;
			for (var target of targets) {
				target.addTempSkill("tywusheng_guanjue");
			}
		},
		prompt: "将一张红色牌当杀使用或打出",
		check(card) {
			const val = get.value(card);
			if (_status.event.name == "chooseToRespond") return 1 / Math.max(0.1, val);
			return 5 - val;
		},
		ai: {
			skillTagFilter(player) {
				if (!player.countCards("hes", { color: "red" })) return false;
			},
			respondSha: true,
		},
		subSkill: {
			guanjue: {
				mod: {
					cardEnabled(card, player) {
						let evt = _status.event;
						if (evt.name != "chooseToUse") evt = evt.getParent("chooseToUse");
						if (!evt || !evt.respondTo) return;
						const cardx = evt.respondTo[1];
						if (!cardx.storage?.tywusheng) return;
						const suit = get.suit(card);
						if (suit != "unsure" && suit != get.suit(cardx)) return false;
					},
				},
				charlotte: true,
			},
		},
	},
	tychengshi: {
		audio: 2,
		trigger: {
			source: "damageSource",
		},
		forced: true,
		usable: 1,
		filter(event, player) {
			if (!_status.currentPhase) return false;
			if (_status.currentPhase != player && !event.player.isIn()) return false;
			return event.card?.name == "sha" && get.color(event.card) == "red";
		},
		async content(event, trigger, player) {
			if (player == _status.currentPhase) {
				let evt = trigger.getParent("useCard", true);
				if (evt?.addCount !== false) {
					evt.addCount = false;
					evt.player.getStat().card.sha--;
				}
			} else if (trigger.player.isIn()) {
				trigger.player.addTempSkill("tychengshi_tiaoxin", { global: lib.phaseName.map(i => `${i}End`) });
				trigger.player.markAuto("tychengshi_tiaoxin", [player]);
			}
		},
		subSkill: {
			tiaoxin: {
				mark: true,
				intro: {
					content(storage, player) {
						if (!storage || !storage.length) return "无记录";
						if (storage.length > 1) return "不能使用伤害类牌指定任何人";
						return `不能使用伤害类牌指定${get.translation(storage)}以外的角色`;
					},
				},
				charlotte: true,
				onremove: true,
				mod: {
					playerEnabled(card, player, target) {
						if (!get.tag(card, "damage")) return;
						let storage = player.getStorage("tychengshi_tiaoxin");
						if (!storage.length) return;
						if (storage.length > 1 || !player.getStorage("tychengshi_tiaoxin").includes(target)) return false;
					},
				},
			},
		},
	},
	tyfuwei: {
		audio: 2,
		trigger: {
			global: "damageEnd",
		},
		filter(event, player) {
			if (!player.countCards("he") || !event.player.isIn() || event.player == player) return false;
			if (event.player.getSeatNum() == 1) return true;
			if (get.nameList(event.player).some(name => get.rawName(name) == "刘备")) return true;
		},
		usable: 1,
		seatRelated: true,
		async cost(event, trigger, player) {
			event.result = await player
				.chooseCardTarget({
					prompt: get.prompt("tyfuwei", trigger.player),
					prompt2: `交给其至多${trigger.num}张牌，然后可以对伤害来源使用至多${trigger.num}张杀`,
					filterCard: true,
					selectCard: [1, trigger.num],
					position: "he",
					filterTarget(card, player, target) {
						return target == _status.event.getTrigger().player;
					},
					ai1(card) {
						return 4 - get.value(card);
					},
					ai2(target) {
						let att = get.attitude(_status.event.player, target);
						return Math.max(0, att);
					},
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const target = event.targets[0],
				cards = event.cards;
			await player.give(cards, target);
			if (!trigger.source || !trigger.source.isIn() || !player.canUse(get.autoViewAs({ name: "sha" }, "unsure"), trigger.source, false)) return;
			let num = 0;
			while (num < trigger.num) {
				const { result } = await player
					.chooseToUse(function (card, player, event) {
						if (get.name(card) != "sha") return false;
						return lib.filter.filterCard.apply(this, arguments);
					}, `抚危：是否对${get.translation(trigger.source)}使用一张杀？（${num}/${trigger.num}）`)
					.set("targetRequired", true)
					.set("complexSelect", true)
					.set("filterTarget", function (card, player, target) {
						if (target != _status.event.sourcex && !ui.selected.targets.includes(_status.event.sourcex)) return false;
						return lib.filter.targetEnabled.apply(this, arguments);
					})
					.set("sourcex", trigger.source);
				if (result.bool == false) break;
				else num++;
			}
		},
	},
	//九鼎-徐晃
	jdsbduanliang: {
		audio: "sbduanliang",
		inherit: "sbduanliang",
		async content(event, trigger, player) {
			const target = event.targets[0];
			const result = await player
				.chooseToDuiben(target)
				.set("title", "谋弈")
				.set("namelist", ["固守城池", "突出重围", "围城断粮", "擂鼓进军"])
				.set("translationList", [`以防止${get.translation(player)}通过此技能对你使用【决斗】`, `以防止${get.translation(player)}通过此技能对你使用【兵粮寸断】`, `若成功，你摸一张牌，然后可以将一张黑色非锦囊牌当做【兵粮寸断】对${get.translation(target)}使用`, `若成功，视为对${get.translation(target)}使用【决斗】`])
				.set("ai", button => {
					var source = _status.event.getParent().player,
						target = _status.event.getParent().target;
					if (get.effect(target, { name: "juedou" }, source, source) >= 10 && button.link[2] == "db_def2" && Math.random() < 0.5) return 10;
					return 1 + Math.random();
				})
				.forResult();
			if (result.bool) {
				if (result.player == "db_def1") {
					await player.draw();
					if (target.hasJudge("bingliang") && target.countGainableCards(player, "he")) await player.gainPlayerCard(target, "he", true);
					else {
						const next = player.chooseToUse();
						next.set("openskilldialog", "断粮：是否将一张黑色非锦囊牌当作【兵粮寸断】对" + get.translation(target) + "使用？");
						next.set("norestore", true);
						next.set("_backupevent", "jdsbduanliang_backup");
						next.set("custom", {
							add: {},
							replace: { window: function () {} },
						});
						next.backup("jdsbduanliang_backup");
						next.set("targetRequired", true);
						next.set("complexSelect", true);
						next.set("filterTarget", function (card, player, target) {
							if (target != _status.event.sourcex) return false;
							return lib.filter.targetEnabled.apply(this, arguments);
						});
						next.set("sourcex", target);
						await next;
					}
				} else {
					const card = { name: "juedou", isCard: true };
					if (player.canUse(card, target)) await player.useCard(card, target);
				}
			}
		},
		subSkill: {
			backup: {
				viewAs: {
					name: "bingliang",
				},
				filterCard(card, player) {
					return get.itemtype(card) == "card" && get.color(card, player) == "black" && get.type2(card) != "trick";
				},
				position: "hes",
				selectCard: 1,
				check(card) {
					return 6 - get.value(card);
				},
			},
		},
	},
	//九鼎--王元姬
	jdshiren: {
		audio: "shiren",
		trigger: { player: "showCharacterAfter" },
		filter(event, player) {
			if (!event.toShow?.some(i => get.character(i).skills?.includes("jdshiren"))) return false;
			const target = _status.currentPhase;
			return target && target != player && target.isAlive() && target.countCards("h") > 0;
		},
		logTarget: () => _status.currentPhase,
		hiddenSkill: true,
		content() {
			const next = game.createEvent("jdyanxi", false);
			next.player = player;
			next.target = _status.currentPhase;
			next.setContent(lib.skill["jdyanxi"].content);
		},
	},
	jdyanxi: {
		audio: "yanxi",
		inherit: "yanxi",
		async content(event, trigger, player) {
			const target = event.target;
			const [card] = await player.choosePlayerCard(target, "h", true).forResult("cards");
			if (card) {
				const videoId = lib.status.videoId++;
				game.addVideo("showCards", player, [`${get.translation(player)}对${get.translation(target)}发动了【宴戏】`, get.cardsInfo([card])]);
				game.broadcastAll(
					(card, id, player, target) => {
						let dialog;
						if (player === game.me) dialog = ui.create.dialog(`${get.translation(target)}手牌展示中...`);
						else dialog = ui.create.dialog(`${get.translation(player)}对${get.translation(target)}发动了【宴戏】`, [card]);
						dialog.forcebutton = true;
						dialog.videoId = id;
					},
					card,
					videoId,
					player,
					target
				);
				await game.delay(2);
				game.broadcastAll("closeDialog", videoId);
				let cards = [card].concat(get.cards(2)).randomSort();
				game.log(player, "展示了", cards);
				const videoIdx = lib.status.videoId++;
				const str = get.translation(player) + "对" + get.translation(target) + "发动了【宴戏】";
				game.broadcastAll(
					(str, id, cards) => {
						const dialog = ui.create.dialog(str, cards);
						dialog.videoId = id;
					},
					str,
					videoIdx,
					cards
				);
				game.addVideo("showCards", player, [str, get.cardsInfo(cards)]);
				const func = function (id, target) {
					const dialog = get.idDialog(id);
					if (dialog) dialog.content.firstChild.innerHTML = "猜猜哪张是" + get.translation(target) + "的手牌？";
				};
				if (player == game.me) func(videoIdx, target);
				else if (player.isOnline()) player.send(func, videoIdx, target);
				const next = player.chooseButton(true);
				next.set("dialog", videoIdx);
				next.set("ai", button => {
					const evt = get.event();
					if (evt.answer) return button.link == evt.answer ? 1 : 0;
					return get.value(button.link, evt.player);
				});
				if (player.hasSkillTag("viewHandcard", null, target, true)) next.set("answer", card);
				const result = await next.forResult();
				game.broadcastAll("closeDialog", videoIdx);
				if (result.bool) {
					const card2 = result.links[0];
					cards.remove(card2);
					if (card2 == card) {
						player.popup("洗具");
						player.$gain2(cards);
						await player.gain(cards, "log");
						await player.gain(card, target, "bySelf", "give");
					} else {
						player.popup("杯具");
						await player.gain(card2, "gain2");
						const { result } = await player
							.chooseToMove("宴戏：将剩余的牌以任意顺序置于牌堆顶", true)
							.set("list", [["牌堆顶", cards]])
							.set("reverse", _status.currentPhase && _status.currentPhase.next && get.attitude(player, _status.currentPhase.next) > 0)
							.set("processAI", list => {
								const cards = list[0][1].slice(0);
								cards.sort((a, b) => {
									return (_status.event.reverse ? 1 : -1) * (get.value(b) - get.value(a));
								});
								return [cards];
							});
						if (!result.bool) return;
						cards = result.moved[0];
						cards.reverse();
						if (cards.includes(card)) {
							target.$throw(1, 1000);
							await target.lose([card], ui.special);
						}
						await game.cardsGotoPile(cards, "insert");
						game.log(player, "将", cards, "置于了牌堆顶");
					}
				}
			}
		},
	},
	//九鼎-华歆
	jdcaozhao: {
		audio: "caozhao",
		trigger: { global: "phaseUseBegin" },
		filter(event, player) {
			if (
				lib.inpile.every(i => {
					return player.getStorage("jdcaozhao").includes(i);
				})
			)
				return false;
			return event.player.countCards("h") && event.player.getHp() <= player.getHp();
		},
		async cost(event, trigger, player) {
			const target = trigger.player;
			event.result = await player
				.choosePlayerCard(target, "h", get.prompt2("jdcaozhao", target))
				.set("ai", () => {
					const player = get.player(),
						target = get.event().getTrigger().player;
					if (lib.inpile.some(i => !player.getStorage("jdcaozhao").includes(i) && target.getUseValue(i) * get.attitude(player, target) > 0)) return 1 + Math.random();
					return 0;
				})
				.forResult();
		},
		logTarget: "player",
		round: 1,
		async content(event, trigger, player) {
			const target = trigger.player;
			await player.showCards(event.cards, get.translation(player) + "对" + get.translation(target) + "发动了【草诏】");
			const result = await player
				.chooseButton(
					[
						"草诏：请选择一个基本牌或锦囊牌",
						[
							lib.inpile.filter(i => {
								if (!["basic", "trick"].includes(get.type(i))) {
									return false;
								}
								return !player.getStorage("jdcaozhao").includes(i);
							}),
							"vcard",
						],
					],
					true
				)
				.set("ai", button => {
					const player = get.player(),
						target = get.event().getTrigger().player,
						sgn = get.sgn(get.attitude(player, target));
					const cards = get.event().getParent().cards,
						card = get.autoViewAs({ name: button.link[2] }, cards);
					if (!target.hasUseTarget(card) || target.getUseValue(card) * sgn <= 0) Math.random();
					return 5 + target.getUseValue(card) * sgn;
				})
				.forResult();
			if (result.bool) {
				const name = result.links[0][2];
				player.markAuto("jdcaozhao", [name]);
				player.popup(name, "thunder");
				game.log(player, "声明了", "#y" + get.translation(name));
				const card = get.autoViewAs({ name: name }, event.cards);
				let resultx;
				if (!target.hasUseTarget(card)) resultx = { bool: false };
				else
					resultx = await target
						.chooseUseTarget('###草诏###<div class="text center">使用' + get.translation(card) + "（" + get.translation(event.cards) + "），或失去1点体力</div>", card, false)
						.set("cards", event.cards)
						.forResult();
				if (!resultx.bool) await target.loseHp();
			}
		},
	},
	//九鼎-杨婉
	jdmingxuan: {
		audio: "spmingxuan",
		trigger: { player: "phaseUseBegin" },
		filter(event, player) {
			const num = Math.min(
				player
					.getCards("h")
					.slice()
					.map(i => get.suit(i, player))
					.unique().length,
				game.countPlayer(current => {
					return current != player && !player.getStorage("jdmingxuan").includes(current);
				})
			);
			return num > 0;
		},
		forced: true,
		async content(event, trigger, player) {
			const num = Math.min(
				player
					.getCards("h")
					.slice()
					.map(i => get.suit(i, player))
					.unique().length,
				game.countPlayer(current => {
					return current != player && !player.getStorage("jdmingxuan").includes(current);
				})
			);
			const result = await player
				.chooseCard("h", true, [1, num], "瞑昡：请选择至多" + get.cnNumber(num) + "张花色各不相同的手牌", (card, player) => {
					if (!ui.selected.cards.length) return true;
					return !ui.selected.cards.some(i => get.suit(i, player) == get.suit(card));
				})
				.set("complexCard", true)
				.set("ai", card => 6 - get.value(card))
				.forResult();
			if (result.bool && result.cards?.length > 0) {
				let cards = result.cards.slice().randomSort();
				let targets = game.filterPlayer(current => current != player && !player.getStorage("jdmingxuan").includes(current)).sortBySeat(player);
				const dialog = ui.create.dialog("瞑昡", cards, true);
				_status.dieClose.push(dialog);
				dialog.videoId = lib.status.videoId++;
				event.dialogID = dialog.videoId;
				game.addVideo("cardDialog", null, ["瞑昡", get.cardsInfo(cards), dialog.videoId]);
				game.broadcast(
					function (cards, id) {
						var dialog = ui.create.dialog("瞑昡", cards, true);
						_status.dieClose.push(dialog);
						dialog.videoId = id;
					},
					cards,
					dialog.videoId
				);
				while (cards.length && targets.length) {
					await game.delayx();
					const target = targets.shift();
					const resultx = await target
						.chooseButton(true, button => {
							return get.value(button.link, _status.event.player);
						})
						.set("dialog", event.dialogID)
						.set("closeDialog", false)
						.set("dialogdisplay", true)
						.set("cardFilter", cards.slice())
						.set("filterButton", button => {
							return _status.event.cardFilter.includes(button.link);
						})
						.forResult();
					if (resultx.bool) {
						const card = resultx.links[0];
						if (card) {
							cards.remove(card);
							const capt = get.translation(target) + "选择了" + get.translation(card);
							game.broadcastAll(
								(card, id, name, capt) => {
									const dialog = get.idDialog(id);
									if (dialog) {
										dialog.content.firstChild.innerHTML = capt;
										for (let i = 0; i < dialog.buttons.length; i++) {
											if (dialog.buttons[i].link == card) {
												dialog.buttons[i].querySelector(".info").innerHTML = name;
												break;
											}
										}
										game.addVideo("dialogCapt", null, [dialog.videoId, dialog.content.firstChild.innerHTML]);
									}
								},
								card,
								event.dialogID,
								(target => {
									if (target._tempTranslate) return target._tempTranslate;
									const name = target.name;
									if (lib.translate[name + "_ab"]) return lib.translate[name + "_ab"];
									return get.translation(name);
								})(target),
								capt
							);
							await target.gain(card, player, "give");
						}
						const resulty = await target
							.chooseToUse(function (card, player, event) {
								if (get.name(card) != "sha") return false;
								return lib.filter.filterCard.apply(this, arguments);
							}, "对" + get.translation(player) + "使用一张杀，否则交给其一张牌且其摸一张牌")
							.set("targetRequired", true)
							.set("complexSelect", true)
							.set("filterTarget", function (card, player, target) {
								if (target != _status.event.sourcex && !ui.selected.targets.includes(_status.event.sourcex)) return false;
								return lib.filter.filterTarget.apply(this, arguments);
							})
							.set("sourcex", player)
							.set("addCount", false)
							.forResult();
						if (resulty.bool) player.markAuto("jdmingxuan", [target]);
						else {
							await target.chooseToGive("he", true, player, "交给" + get.translation(player) + "一张牌");
							await player.draw();
						}
					}
				}
				for (let i = 0; i < ui.dialogs.length; i++) {
					if (ui.dialogs[i].videoId == event.dialogID) {
						const dialogx = ui.dialogs[i];
						dialogx.close();
						_status.dieClose.remove(dialogx);
						break;
					}
				}
				game.broadcast(id => {
					const dialog = get.idDialog(id);
					if (dialog) {
						dialog.close();
						_status.dieClose.remove(dialog);
					}
				}, event.dialogID);
				game.addVideo("cardDialog", null, event.dialogID);
			}
		},
		intro: { content: "已被$使用过杀" },
	},
	//九鼎-黄月英
	jdjizhi: {
		audio: "sbjizhi",
		trigger: { player: "useCard" },
		filter(event, player) {
			return get.type(event.card) == "trick";
		},
		forced: true,
		content() {
			"step 0";
			player.draw();
			"step 1";
			player.addTempSkill("jdjizhi_mark");
			player.addMark("jdjizhi_mark", 1, false);
		},
		subSkill: {
			mark: {
				charlotte: true,
				onremove: true,
				intro: { content: "本回合手牌上限+#" },
				charlotte: true,
				onremove: true,
				mod: {
					maxHandcard(player, num) {
						return num + player.countMark("jdjizhi_mark");
					},
				},
			},
		},
	},
	jdqicai: {
		audio: "sbqicai",
		enable: "phaseUse",
		filter(event, player) {
			return player.countCards("he", { type: "equip" });
		},
		filterCard(card) {
			return !ui.selected.cards.length && get.type(card) == "equip";
		},
		selectCard: [1, 2],
		filterTarget: lib.filter.notMe,
		position: "he",
		check(card) {
			return 8 - get.value(card);
		},
		complexCard: true,
		complexSelect: true,
		lose: false,
		discard: false,
		delay: false,
		usable: 1,
		get prompt() {
			return lib.translate.jdqicai_info.slice("①你使用锦囊牌无距离限制。②".length);
		},
		async content(event, trigger, player) {
			const target = event.target;
			const str = get.translation(player);
			await player.showCards(event.cards, get.translation(player) + "发动了【奇才】");
			await player.give(event.cards, target);
			const result = await target
				.chooseCard(
					2,
					"he",
					card => {
						return get.type(card) !== "equip";
					},
					"奇才：交给" + str + "两张非装备牌，或令" + str + "获得两张普通锦囊牌"
				)
				.set("ai", card => {
					if (get.event("att") >= 0) return -1;
					return 7 - get.value(card);
				})
				.set("att", get.attitude(target, player))
				.forResult();
			if (!result.bool) {
				let gains = [];
				while (gains.length < 2) {
					const card = get.cardPile(i => get.type(i) == "trick" && !gains.includes(i));
					if (card) gains.push(card);
					else break;
				}
				if (gains.length) await player.gain(gains, "gain2");
				else {
					player.chat("无牌可得？！");
					game.log("但是牌堆和弃牌堆都没有普通锦囊牌了！");
				}
			} else {
				await target.showCards(result.cards);
				await target.give(result.cards, player);
			}
		},
		ai: {
			order: 7,
			result: {
				target(player, target) {
					const att = get.attitude(player, target);
					return get.sgn(att) * (2 + get.sgn(att));
				},
			},
		},
		mod: {
			targetInRange(card) {
				if (get.type2(card) == "trick") return true;
			},
		},
		locked: false,
	},
	//九鼎-赵云
	jdlongdan: {
		audio: "sblongdan",
		enable: ["chooseToUse", "chooseToRespond"],
		filter(event, player) {
			if (event.type == "wuxie") return false;
			var marked = player.hasSkill("sblongdan_mark", null, null, false);
			for (var name of lib.inpile) {
				if (!marked && name != "sha" && name != "shan") continue;
				if (get.type(name) != "basic") continue;
				if (player.hasCard(lib.skill.jdlongdan.getFilter(name, player), "hs")) {
					if (event.filterCard(get.autoViewAs({ name }, "unsure"), player, event)) return true;
					if (marked && name == "sha") {
						for (var nature of lib.inpile_nature) {
							if (event.filterCard(get.autoViewAs({ name, nature }, "unsure"), player, event)) return true;
						}
					}
				}
			}
			return false;
		},
		chooseButton: {
			dialog(event, player) {
				var list = [];
				var marked = player.hasSkill("sblongdan_mark", null, null, false);
				for (var name of lib.inpile) {
					if (!marked && name != "sha" && name != "shan") continue;
					if (get.type(name) != "basic") continue;
					if (player.hasCard(lib.skill.jdlongdan.getFilter(name, player), "hs")) {
						if (event.filterCard(get.autoViewAs({ name }, "unsure"), player, event)) list.push(["基本", "", name]);
						if (marked && name == "sha") {
							for (var nature of lib.inpile_nature) {
								if (event.filterCard(get.autoViewAs({ name, nature }, "unsure"), player, event)) list.push(["基本", "", name, nature]);
							}
						}
					}
				}
				return ui.create.dialog("龙胆", [list, "vcard"], "hidden");
			},
			check(button) {
				if (_status.event.getParent().type != "phase") return 1;
				var player = _status.event.player,
					card = { name: button.link[2], nature: button.link[3] };
				if (card.name == "jiu" && player.countCards("h", { type: "basic" }) < 2) return 0;
				return player.getUseValue(card, null, true);
			},
			backup(links, player) {
				return {
					audio: "jdlongdan",
					viewAs: {
						name: links[0][2],
						nature: links[0][3],
					},
					filterCard: lib.skill.jdlongdan.getFilter(links[0][2], player),
					position: "he",
					popname: true,
					check(card) {
						return 6 / Math.max(1, get.value(card));
					},
					precontent() {
						player.addTempSkill("jdlongdan_draw");
					},
				};
			},
			prompt(links, player) {
				var marked = player.hasSkill("sblongdan_mark", null, null, false);
				var card = {
					name: links[0][2],
					nature: links[0][3],
					isCard: true,
				};
				if (marked) return "将一张基本牌当作【" + get.translation(card) + "】使用";
				return "将一张【" + (card.name == "sha" ? "闪" : "杀") + "】当作【" + get.translation(card) + "】使用";
			},
		},
		hiddenCard(player, name) {
			if (get.type(name) != "basic") return false;
			var marked = player.hasSkill("sblongdan_mark", null, null, false);
			if (!marked && name != "sha" && name != "shan") return false;
			return player.hasCard(lib.skill.jdlongdan.getFilter(name, player), "hs");
		},
		ai: {
			respondSha: true,
			respondShan: true,
			skillTagFilter(player, tag) {
				return lib.skill.jdlongdan.hiddenCard(player, tag == "respondSha" ? "sha" : "shan");
			},
			order: 9,
			result: {
				player(player) {
					if (_status.event.dying) return get.attitude(player, _status.event.dying);
					return 1;
				},
			},
		},
		getFilter(name, player) {
			if (!player.hasSkill("sblongdan_mark", null, null, false)) {
				if (name == "sha") return { name: "shan" };
				if (name == "shan") return { name: "sha" };
				return () => false;
			}
			return { type: "basic" };
		},
		derivation: "jdlongdanx",
		onremove(player) {
			player.removeSkill("sblongdan_mark");
		},
		subSkill: {
			backup: { audio: "sblongdan" },
			mark: { charlotte: true },
			draw: {
				charlotte: true,
				trigger: { player: ["useCardAfter", "respondAfter"] },
				filter(event, player) {
					if (player.hasSkill("jdlongdan_mark")) return false;
					return event.skill == "jdlongdan_backup";
				},
				forced: true,
				popup: false,
				*content(event, map) {
					const player = map.player;
					const result = yield player.draw(2);
					if (Array.isArray(result) && result.length) player.addTempSkill("jdlongdan_mark", ["phaseChange", "phaseAfter"]);
				},
			},
		},
	},
	jdjizhu: {
		inherit: "sbjizhu",
		audio: ["sbjizhu", 3],
		ai: {
			combo: "jdlongdan",
		},
	},
	//九鼎-甘宁
	jdqixi: {
		audio: "sbqixi",
		inherit: "sbqixi",
		filterCard(card) {
			return lib.suit.includes(get.suit(card));
		},
		check(card) {
			return 7 - get.value(card);
		},
		position: "h",
		lose: false,
		discard: false,
		async content(event, trigger, player) {
			const target = event.target;
			let suits = lib.suit.slice().reverse(),
				num = 0;
			while (suits.length > 0) {
				const control = await target
					.chooseControl(suits)
					.set("prompt", "奇袭：猜测" + get.translation(player) + "选择的牌的花色")
					.set("ai", () => {
						var player = _status.event.getParent().player,
							controls = _status.event.controls;
						if (player.countCards("h") <= 3 && controls.includes("diamond") && Math.random() < 0.3) return "diamond";
						return controls.randomGet();
					})
					.forResult("control");
				if (control) {
					target.chat("我猜是" + get.translation(control) + "！");
					game.log(target, "猜测为", "#y" + control);
					if (!event.isMine() && !event.isOnline()) await game.delayx();
					if (get.suit(event.cards[0]) !== control) {
						player.chat("猜错了！");
						game.log(target, "猜测", "#y错误");
						suits.remove(control);
						num++;
						continue;
					} else {
						player.chat(num == 0 ? "这么准？" : "猜对了！");
						game.log(target, "猜测", "#g正确");
						const card = event.cards[0];
						if (get.owner(card) == player && get.position(card) == "h") {
							await player.showCards([card], get.translation(player) + "选择的手牌");
							if (lib.filter.cardDiscardable(card, player)) await player.discard([card]);
						}
						if (num > 0 && target.countDiscardableCards(player, "hej")) {
							player.line(target);
							player.discardPlayerCard(target, num, true, "hej");
						}
						break;
					}
				} else break;
			}
		},
	},
	jdfenwei: {
		unique: true,
		limited: true,
		audio: "sbfenwei",
		trigger: { global: "useCardToPlayered" },
		filter(event, player) {
			if (!event.isFirstTarget || get.type(event.card) != "trick") return false;
			return event.targets.length >= 2;
		},
		direct: true,
		skillAnimation: true,
		animationColor: "wood",
		content() {
			"step 0";
			player
				.chooseTarget(get.prompt("jdfenwei"), "令" + get.translation(trigger.card) + "对任意名角色无效", [1, trigger.targets.length], (card, player, target) => {
					return _status.event.targets.includes(target);
				})
				.set("ai", target => {
					var trigger = _status.event.getTrigger();
					return -get.effect(target, trigger.card, trigger.player, _status.event.player);
				})
				.set("targets", trigger.targets);
			"step 1";
			if (result.bool) {
				player.logSkill("jdfenwei", result.targets);
				player.awakenSkill("jdfenwei");
				trigger.getParent().excluded.addArray(result.targets);
				if (result.targets.includes(player)) player.addTempSkill("jdfenwei_qixi");
			}
		},
		ai: { expose: 0.2 },
		subSkill: {
			qixi: {
				charlotte: true,
				trigger: { global: "phaseEnd" },
				async cost(event, trigger, player) {
					const result = await player
						.chooseCardTarget({
							prompt: get.prompt2("jdqixi"),
							prompt2: lib.translate.jdqixi_info.slice("出牌阶段限一次，你可以".length),
							filterCard: lib.skill.jdqixi.filterCard,
							filterTarget: lib.skill.jdqixi.filterTarget,
							position: lib.skill.jdqixi.position,
							ai1: lib.skill.jdqixi.check,
							ai2: target => {
								const player = get.player();
								return get.effect(target, "twyuanhu", player, player);
							},
						})
						.forResult();
					event.result = result;
					if (result.bool) event.result.cost_data = result;
				},
				popup: false,
				async content(event, trigger, player) {
					const result = event.cost_data;
					result.skill = "jdqixi";
					player.useResult(result, event);
				},
			},
		},
	},
	//九鼎-庞统
	jdlianhuan: {
		audio: "sblianhuan",
		trigger: { player: "useCardToPlayered" },
		filter(event, player) {
			return event.card.name == "tiesuo" && !event.target.isLinked() && event.target.countCards("he");
		},
		direct: true,
		content() {
			const target = trigger.target;
			player.discardPlayerCard(target, "he", get.prompt("jdlianhuan", target)).logSkill = ["jdlianhuan", target];
		},
		group: "jdlianhuan_lianhuan",
		subSkill: {
			lianhuan: {
				audio: "sblianhuan",
				inherit: "lianhuan",
				prompt: "将♣手牌当作【铁索连环】使用或重铸",
			},
		},
	},
	//九鼎-韩龙
	jdcibei: {
		audio: "cibei",
		inherit: "cibei",
		group: ["jdcibei_gain", "jdcibei_fullyReady"],
		subSkill: {
			fullyReady: {
				audio: "cibei",
				trigger: { global: "phaseEnd" },
				filter(event, player) {
					var storage = player.getExpansions("duwang");
					return storage.length > 0 && storage.every(i => i.name == "sha");
				},
				forced: true,
				locked: false,
				*content(event, map) {
					const player = map.player;
					yield player.gain(player.getExpansions("duwang"), "gain2");
					player.addSkill("jdcibei_effect");
				},
			},
			effect: {
				mod: {
					cardUsable(card) {
						if (card.name == "sha") return Infinity;
					},
					targetInRange(card) {
						if (card.name == "sha") return true;
					},
				},
				charlotte: true,
				mark: true,
				marktext: "杀",
				intro: { content: "准备完毕！本局游戏使用【杀】无距离和次数限制" },
			},
			gain: {
				audio: "cibei",
				trigger: { global: "phaseEnd" },
				filter(event, player) {
					return player.hasHistory("lose", evt => evt.type == "discard" && evt.cards.filterInD("d").some(i => i.name == "sha"));
				},
				forced: true,
				locked: false,
				content() {
					player.gain(
						player
							.getHistory("lose", evt => {
								return evt.type == "discard" && evt.cards.filterInD("d").filter(i => i.name == "sha");
							})
							.slice()
							.map(evt => {
								return evt.cards.filterInD("d").filter(i => i.name == "sha");
							})
							.flat(),
						"gain2"
					);
				},
			},
		},
	},
	//九鼎-夏侯徽
	jdbaoqie: {
		audio: "baoqie",
		trigger: { player: "showCharacterAfter" },
		forced: true,
		hiddenSkill: true,
		filter(event, player) {
			return event.toShow?.some(i => get.character(i).skills?.includes("jdbaoqie"));
		},
		content() {
			"step 0";
			var card = get.cardPile(function (card) {
				return get.subtype(card, false) == "equip2" && !get.cardtag(card, "gifts");
			});
			if (!card) {
				event.finish();
				return;
			}
			event.card = card;
			player.gain(card, "gain2");
			"step 1";
			if (player.getCards("h").includes(card) && get.subtype(card) == "equip2") player.chooseUseTarget(card).nopopup = true;
		},
	},
	//九鼎-曹操
	jdjianxiong: {
		audio: "sbjianxiong",
		inherit: "sbjianxiong",
		filter(event, player) {
			return (get.itemtype(event.cards) == "cards" && event.cards.some(i => get.position(i, true) == "o")) || 2 - player.countMark("sbjianxiong") > 0;
		},
		prompt2(event, player) {
			var gain = get.itemtype(event.cards) == "cards" && event.cards.some(i => get.position(i, true) == "o"),
				draw = 2 - player.countMark("sbjianxiong");
			var str = "";
			if (gain) str += "获得" + get.translation(event.cards);
			if (gain && draw > 0) str += "并";
			if (draw > 0) str += "摸" + get.cnNumber(draw) + "张牌";
			if (player.countMark("sbjianxiong")) str += "，然后可以弃1枚“治世”";
			return str;
		},
		content() {
			"step 0";
			if (get.itemtype(trigger.cards) == "cards" && trigger.cards.some(i => get.position(i, true) == "o")) {
				player.gain(trigger.cards, "gain2");
			}
			var num = player.countMark("sbjianxiong");
			if (2 - num > 0) player.draw(2 - num, "nodelay");
			if (!num) event.finish();
			"step 1";
			player.chooseBool("是否弃1枚“治世”？").set("ai", () => {
				var player = _status.event.player,
					current = _status.currentPhase;
				if (get.distance(current, player, "absolute") > 3 && player.hp <= 2) return true;
				return false;
			});
			"step 2";
			if (result.bool) player.removeMark("sbjianxiong", 1);
		},
		ai: {
			maixie: true,
			maixie_hp: true,
			effect: {
				target(card, player, target) {
					if (player.hasSkillTag("jueqing", false, target)) return [1, -1];
					if (get.tag(card, "damage") && player != target) {
						var cards = card.cards,
							evt = _status.event;
						if (evt.player == target && card.name == "damage" && evt.getParent().type == "card") cards = evt.getParent().cards.filterInD();
						if (target.hp <= 1) return;
						if (get.itemtype(cards) != "cards") return;
						for (var i of cards) {
							if (get.name(i, target) == "tao") return [1, 4.5];
						}
						if (get.value(cards, target) >= 7 + target.getDamagedHp()) return [1, 2];
						return [1, 0.55 + 0.05 * Math.max(0, 2 - target.countMark("sbjianxiong"))];
					}
				},
			},
		},
		group: "jdjianxiong_mark",
	},
	//九鼎-诸葛亮
	jdhuoji: {
		audio: "sbhuoji",
		dutySkill: true,
		derivation: ["jdguanxing", "sbkongcheng"],
		group: ["jdhuoji_fire", "jdhuoji_achieve", "jdhuoji_fail", "jdhuoji_mark"],
		subSkill: {
			fire: {
				audio: "sbhuoji1.mp3",
				enable: "phaseUse",
				filterTarget: lib.filter.notMe,
				prompt: "选择一名其他角色，对其与其势力相同的所有其他角色各造成1点火属性伤害",
				usable: 1,
				line: "fire",
				content: function () {
					"step 0";
					target.damage("fire");
					"step 1";
					var targets = game.filterPlayer(current => {
						if (current == player || current == target) return false;
						return current.group == target.group;
					});
					if (targets.length) {
						game.delayx();
						player.line(targets, "fire");
						targets.forEach(i => i.damage("fire"));
					}
				},
				ai: {
					order: 7,
					fireAttack: true,
					result: {
						target: function (player, target) {
							var att = get.attitude(player, target);
							return (
								get.sgn(att) *
								game
									.filterPlayer(current => {
										if (current == player) return false;
										return current.group == target.group;
									})
									.reduce((num, current) => num + get.damageEffect(current, player, player, "fire"), 0)
							);
						},
					},
				},
			},
			achieve: {
				audio: "jdhuoji2.mp3",
				trigger: { player: "phaseZhunbeiBegin" },
				filter: function (event, player) {
					return player.getAllHistory("sourceDamage", evt => evt.hasNature("fire") && evt.player != player).reduce((num, evt) => num + evt.num, 0) >= game.players.length + game.dead.length;
				},
				forced: true,
				locked: false,
				skillAnimation: true,
				animationColor: "fire",
				async content(event, trigger, player) {
					player.awakenSkill("jdhuoji");
					game.log(player, "成功完成使命");
					player.changeSkin("jdhuoji", "sb_zhugeliang");
					player.changeSkills(["jdguanxing", "sbkongcheng"], ["jdhuoji", "jdkanpo"]);
				},
			},
			fail: {
				audio: "jdhuoji3.mp3",
				trigger: { player: "dying" },
				forced: true,
				locked: false,
				content: function () {
					player.awakenSkill("jdhuoji");
					game.log(player, "使命失败");
				},
			},
			mark: {
				charlotte: true,
				trigger: { source: "damage" },
				filter: function (event, player) {
					return event.hasNature("fire");
				},
				firstDo: true,
				forced: true,
				popup: false,
				content: function () {
					player.addTempSkill("jdhuoji_count", {
						player: ["jdhuoji_achieveBegin", "jdhuoji_failBegin"],
					});
					player.storage.jdhuoji_count = player.getAllHistory("sourceDamage", evt => evt.hasNature("fire") && evt.player != player).reduce((num, evt) => num + evt.num, 0);
					player.markSkill("jdhuoji_count");
				},
			},
			count: {
				charlotte: true,
				intro: { content: "本局游戏已造成过#点火属性伤害" },
			},
		},
	},
	jdkanpo: {
		audio: "sbkanpo",
		trigger: {
			global: ["phaseBefore", "useCard"],
			player: "enterGame",
		},
		filter(event, player) {
			if (event.name == "useCard")
				return player
					.getExpansions("jdkanpo")
					.slice()
					.map(i => i.name)
					.includes(event.card.name);
			return event.name != "phase" || game.phaseNumber == 0;
		},
		async cost(event, trigger, player) {
			if (trigger.name == "useCard") {
				event.result = await player
					.chooseButton(["###" + get.prompt("jdkanpo") + "###弃置一张同名牌，令" + get.translation(trigger.card) + "无效", player.getExpansions("jdkanpo")])
					.set("filterButton", button => {
						const name = get.event().getTrigger().card.name;
						return button.link.name == name;
					})
					.set("ai", () => {
						const player = get.player(),
							trigger = get.event().getTrigger();
						return lib.skill.sbkanpo.subSkill.kanpo.check(trigger, player) ? 1 : 0;
					})
					.forResult();
				if (event.result.bool) {
					event.result.cards = event.result.links;
					event.result.targets = [trigger.player];
				}
			} else event.result = { bool: true };
		},
		async content(event, trigger, player) {
			if (trigger.name == "useCard") {
				await player.loseToDiscardpile(event.cards);
				trigger.targets.length = 0;
				trigger.all_excluded = true;
				game.log(trigger.card, "被无效了");
				await player.draw();
			} else {
				await player.draw(3);
				if (player.countCards("h")) {
					const result = await player
						.chooseCard("看破：是否将至多三张牌置于武将牌上？", [1, 3])
						.set("ai", card => {
							switch (card.name) {
								case "wuxie":
									return 5 + Math.random();
								case "sha":
									return 5 + Math.random();
								case "tao":
									return 4 + Math.random();
								case "jiu":
									return 3 + Math.random();
								case "lebu":
									return 3 + Math.random();
								case "shan":
									return 4.5 + Math.random();
								case "wuzhong":
									return 4 + Math.random();
								case "shunshou":
									return 2.7 + Math.random();
								case "nanman":
									return 2 + Math.random();
								case "wanjian":
									return 1.6 + Math.random();
								default:
									return 0;
							}
						})
						.forResult();
					if (result.bool) await player.addToExpansion(result.cards, player, "giveAuto").set("gaintag", ["jdkanpo"]);
				}
			}
		},
		marktext: "谋",
		intro: {
			mark(dialog, storage, player) {
				var cards = player.getExpansions("jdkanpo");
				if (player.isUnderControl(true)) dialog.addAuto(cards);
				else return "共有" + get.cnNumber(cards.length) + "张牌";
			},
			markcount: "expansion",
		},
		onremove(player, skill) {
			const cards = player.getExpansions(skill);
			if (cards.length) player.loseToDiscardpile(cards);
		},
	},
	jdguanxing: {
		audio: "sbguanxing",
		inherit: "sbguanxing",
		trigger: { player: "phaseZhunbeiBegin" },
		filter(event, player) {
			const bool = player.hasCard(card => card.hasGaintag("sbguanxing"), "s");
			return bool || 7 - 3 * player.countMark("sbguanxingx") > 0;
		},
		async content(event, trigger, player) {
			player.addMark("sbguanxingx", 1, false);
			const cards = player.getCards("s", card => card.hasGaintag("sbguanxing"));
			if (cards.length) player.loseToDiscardpile(cards);
			const num = Math.max(0, 7 - 3 * (player.countMark("sbguanxingx") - 1));
			if (num) {
				const cards2 = get.cards(num);
				player.$gain2(cards2, false);
				game.log(player, "将", cards2, "置于了武将牌上");
				await player.loseToSpecial(cards2, "sbguanxing").set("visible", true);
				player.markSkill("sbguanxing");
			}
		},
		group: ["sbguanxing_unmark", "jdguanxing_put"],
		subSkill: {
			put: {
				audio: "sbguanxing",
				enable: "phaseUse",
				filter(event, player) {
					return player.hasCard(card => card.hasGaintag("sbguanxing"), "s");
				},
				filterCard(card) {
					return card.hasGaintag("sbguanxing");
				},
				selectCard: [1, Infinity],
				position: "s",
				lose: false,
				discard: false,
				delay: 0,
				prompt: "将任意张“星”置于牌堆顶",
				content() {
					player.loseToDiscardpile(cards, ui.cardPile, "insert").log = false;
					game.log(player, "将", cards, "置于了牌堆顶");
				},
			},
		},
	},
	//九鼎-司马师
	jdtairan: {
		audio: "tairan",
		inherit: "tairan",
		trigger: {
			player: "phaseJieshuBegin",
		},
		async content(event, trigger, player) {
			const maxHp = player.maxHp;
			const hp = maxHp - player.getHp();
			if (hp > 0) await player.recoverTo(maxHp);
			const num = maxHp - player.countCards("h");
			if (num > 0) await player.drawTo(maxHp);
			player
				.when("phaseUseBegin")
				.then(() => {
					if (hp > 0) player.loseHp(hp);
				})
				.then(() => {
					if (player.countCards("h") && num > 0) player.chooseToDiscard("h", num, true);
				})
				.vars({ hp: hp, num: num });
		},
	},
	//九鼎-张飞
	jdsbpaoxiao: {
		audio: "sbpaoxiao",
		inherit: "sbpaoxiao",
		content() {
			if (!trigger.card.storage) trigger.card.storage = {};
			trigger.card.storage.jdsbpaoxiao = true;
			trigger.baseDamage++;
			trigger.directHit.addArray(game.players);
			player.addTempSkill(event.name + "_effect", "phaseUseAfter");
		},
		subSkill: {
			effect: {
				inherit: "sbpaoxiao_effect",
				filter(event, player) {
					return event.card.storage && event.card.storage.jdsbpaoxiao && event.target.isIn();
				},
				group: "jdsbpaoxiao_recoil",
			},
			recoil: {
				inherit: "sbpaoxiao_recoil",
				filter(event, player) {
					return event.card && event.card.storage && event.card.storage.jdsbpaoxiao && event.player.isIn();
				},
				async content(event, trigger, player) {
					await player.loseHp();
					if (player.countDiscardableCards(trigger.player, "h")) await trigger.player.discardPlayerCard(player, "h", true);
				},
			},
		},
	},
	//九鼎-法正
	jdsbxuanhuo: {
		audio: "sbxuanhuo",
		inherit: "sbxuanhuo",
		group: "jdsbxuanhuo_rob",
		filterTarget(card, player, target) {
			return !target.hasMark("jdsbxuanhuo_mark") && player != target;
		},
		onremove(player) {
			delete player.storage.jdsbxuanhuo;
			player.unmarkSkill("jdsbxuanhuo");
		},
		subSkill: {
			mark: {
				marktext: "眩",
				intro: {
					name: "眩惑",
					name2: "眩",
					markcount: () => 0,
					content: "已获得“眩”标记",
				},
			},
			rob: {
				audio: "jdsbxuanhuo",
				inherit: "sbxuanhuo_rob",
				filter(event, player, name, target) {
					const evt = event.getParent("phaseDraw");
					if (evt && evt.name == "phaseDraw") return false;
					if (!event.getg(target).length || !target.hasMark("jdsbxuanhuo_mark")) return false;
					if (evt && evt.player == target) return false;
					if (lib.skill.sbxuanhuo.getNum(target, "jdsbxuanhuo_rob", "jdsbxuanhuo_mark") >= 5) return false;
					return target.hasCard(card => lib.filter.canBeGained(card, target, player), "he");
				},
				getIndex(event, player) {
					const evt = event.getParent("phaseDraw");
					if (evt && evt.name == "phaseDraw") return false;
					return game
						.filterPlayer(current => {
							if (!event.getg(current).length || !current.hasMark("jdsbxuanhuo_mark")) return false;
							if (evt && evt.player == current) return false;
							if (lib.skill.sbxuanhuo.getNum(current, "jdsbxuanhuo_rob", "jdsbxuanhuo_mark") >= 5) return false;
							return current.hasCard(card => lib.filter.canBeGained(card, current, player), "he");
						})
						.sortBySeat();
				},
				async content(event, trigger, player) {
					const target = event.targets[0],
						hs = target.getCards("h", card => lib.filter.canBeGained(card, target, player));
					if (hs.length) {
						await player.gainPlayerCard(target, "h", true);
						if (!player.storage.jdsbxuanhuo) player.storage.jdsbxuanhuo = {};
						player.storage.jdsbxuanhuo[target.playerid] = lib.skill.sbxuanhuo.getNum(target, "jdsbxuanhuo_rob", "jdsbxuanhuo_mark");
						player.markSkill("jdsbxuanhuo");
					}
				},
			},
		},
	},
	jdsbenyuan: {
		audio: "sbenyuan",
		inherit: "sbenyuan",
		filter(event, player, name, target) {
			return target?.isIn() && target.hasMark("jdsbxuanhuo_mark");
		},
		getIndex(event, player) {
			return game.filterPlayer(target => target.hasMark("jdsbxuanhuo_mark")).sortBySeat();
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			target.clearMark("jdsbxuanhuo_mark");
			for (const current of game.players) {
				const storage = current.storage.jdsbxuanhuo;
				if (storage && storage[target.playerid]) delete storage[target.playerid];
				if (storage && get.is.empty(storage)) {
					delete current.storage.jdsbxuanhuo;
					current.unmarkSkill("jdsbxuanhuo");
				}
			}
			if (target.countCards("h") < player.countCards("h")) {
				const num = Math.min(player.countCards("he"), 2);
				if (num) await player.chooseToGive(target, `恩怨：交给${get.translation(target)}${get.cnNumber(num)}张牌`, true, num, "he");
			} else {
				await target.loseHp();
				await player.recover();
			}
		},
		ai: {
			combo: "jdsbxuanhuo",
		},
	},
	//九鼎-刘备
	jdsbzhangwu: {
		audio: "sbzhangwu",
		enable: "phaseUse",
		filter(event, player) {
			return player.countMark("sbrende");
		},
		limited: true,
		chooseButton: {
			dialog(event, player) {
				return ui.create.dialog("###章武###" + get.translation("jdsbzhangwu_info"));
			},
			chooseControl(event, player) {
				return Array.from({
					length: player.countMark("sbrende"),
				})
					.map((_, i) => get.cnNumber(i + 1, true))
					.concat(["cancel2"]);
			},
			check(event, player) {
				const choices = Array.from({
					length: player.countMark("sbrende"),
				}).map((_, i) => get.cnNumber(i + 1, true));
				return choices.length - 1;
			},
			backup(result, player) {
				return {
					num: result.index + 1,
					audio: "sbzhangwu",
					filterCard: () => false,
					selectCard: -1,
					skillAnimation: "epic",
					animationColor: "orange",
					async content(event, trigger, player) {
						player.awakenSkill("jdsbzhangwu");
						const num = lib.skill.jdsbzhangwu_backup.num;
						player.removeMark("sbrende", num);
						await player.draw(num);
						player.tempBanSkill("sbrende", { player: "dying" });
						player.addTempSkill("new_repaoxiao2");
					},
				};
			},
			prompt(result, player) {
				return `移去${result.index + 1}枚“仁望”并摸等量张牌`;
			},
		},
		ai: {
			order: 9,
			combo: "sbrende",
			result: {
				player(player, target) {
					return player.countMark("sbrende") > 3 ? 1 : 0;
				},
			},
		},
		subSkill: {
			backup: {},
		},
	},
	//九鼎-孙尚香
	jdsbjieyin: {
		audio: "sbjieyin",
		trigger: {
			player: "phaseUseBegin",
		},
		filter(event, player) {
			return game.hasPlayer(current => current.countCards("h") <= player.countCards("h"));
		},
		locked: true,
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(
					get.prompt2(event.name.slice(0, -5)),
					(card, player, target) => {
						return target.countCards("h") <= player.countCards("h");
					},
					true
				)
				.set("ai", target => {
					return get.attitude(get.player(), target) * (target.countCards("h") + 1);
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			const num = Math.min(2, Math.max(1, target.countCards("h")));
			let bool;
			if (player == target) bool = !target.countCards("h") ? false : await player.chooseBool(get.prompt(event.name), "是否获得1点护甲？").forResultBool();
			else
				bool = await target
					.chooseToGive(player, `交给${get.translation(player)}${get.cnNumber(num)}张手牌，然后获得1点护甲；或令其回复1点体力并获得所有“妆”，然后其减少1点体力上限，变更势力为吴`, num, "h")
					.set("ai", card => {
						if (_status.event.goon) return 100 - get.value(card);
						return 0;
					})
					.set("goon", get.attitude(target, player) > 1)
					.forResultBool();
			if (bool) await target.changeHujia(1, null, true);
			else {
				await player.recover();
				if (player.getExpansions("jdsbliangzhu").length) await player.gain(player.getExpansions("jdsbliangzhu"), "gain2");
				await player.loseMaxHp();
				if (player.group != "wu") await player.changeGroup("wu");
			}
		},
	},
	jdsbliangzhu: {
		audio: "sbliangzhu",
		inherit: "sbliangzhu",
		async content(event, trigger, player) {
			const target = event.targets[0];
			const cards = await player.choosePlayerCard(target, "e", true).forResultCards();
			if (!cards || !cards.length) return;
			const next = player.addToExpansion(cards, target, "give");
			next.gaintag.add(event.name);
			await next;
			const targets = game.filterPlayer(current => current != player && current.isDamaged());
			if (!targets) return;
			const list =
				targets.length == 1
					? targets
					: await player
							.chooseTarget(`选择一名其他角色，令其回复1点体力`, (card, player, target) => {
								return target != player && target.isDamaged();
							})
							.set("ai", target => {
								const player = get.player();
								return get.recoverEffect(target, player, player);
							})
							.forResultTargets();
			if (list && list.length) await list[0].recover();
		},
		ai: {
			order: 9,
			result: {
				player: 1,
				target: -1,
			},
		},
	},
	//九鼎-种地的
	jdsbjieyue: {
		audio: "sbjieyue",
		trigger: {
			player: "phaseJieshuBegin",
		},
		filter(event, player) {
			return game.hasPlayer(current => current != player);
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(lib.filter.notMe, get.prompt2(event.name.slice(0, -5)))
				.set("ai", target => {
					return get.attitude(get.player(), target) / Math.sqrt(Math.min(1, target.hp + target.hujia));
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			await target.draw(2);
			await target.changeHujia(1, null, true);
			if (target.countCards("he")) await target.chooseToGive(player, "he", Math.min(2, target.countCards("he")), true);
		},
	},
	//九鼎-高贵名门
	jdsbluanji: {
		audio: "sbluanji",
		inherit: "sbluanji",
		filter(event, player) {
			if (event.name == "chooseToUse") return player.countCards("hs") > 1 && !player.hasSkill("jdsbluanji_used");
			const evt = event.getParent(2);
			return evt.name == "wanjian" && evt.getParent().player == player && event.player != player && event.player.countCards("h") > player.countCards("h") && player.countCards("h") < player.getHp();
		},
		precontent() {
			player.addTempSkill("jdsbluanji_used", "phaseUseAfter");
		},
		subSkill: {
			used: {
				charlotte: true,
			},
		},
	},
	jdsbxueyi: {
		audio: "sbxueyi",
		trigger: {
			global: ["useCardAfter", "respondAfter"],
		},
		filter(event, player) {
			if (!event.respondTo) return false;
			if (player != event.respondTo[0]) return false;
			return player.hasZhuSkill("jdsbxueyi") && event.player != player && event.player.group == "qun";
		},
		zhuSkill: true,
		forced: true,
		logTarget: "player",
		async content(event, trigger, player) {
			for (const name of lib.phaseName) {
				const evt = _status.event.getParent(name);
				if (!evt || evt.name != name) continue;
				trigger.player.addTempSkill(event.name + "_ban", name + "After");
				break;
			}
		},
		mod: {
			maxHandcard(player, num) {
				if (player.hasZhuSkill("jdsbxueyi")) {
					return num + 2 * game.countPlayer(current => player != current && current.group == "qun");
				}
			},
		},
		subSkill: {
			ban: {
				charlotte: true,
				mark: true,
				mod: {
					cardEnabled2(card) {
						if (get.position(card) == "h") return false;
					},
				},
				intro: {
					content: "不能使用或打出手牌",
				},
			},
		},
	},
	//九鼎-孟获
	jdsbhuoshou: {
		audio: "sbhuoshou",
		trigger: {
			player: "phaseUseEnd",
		},
		filter(event, player) {
			return player.countCards("h");
		},
		async content(event, trigger, player) {
			await player.discard(player.getCards("h"));
			const nanman = get.autoViewAs({ name: "nanman", isCard: true });
			if (player.hasUseTarget(nanman)) await player.chooseUseTarget(nanman, true, false);
		},
		forced: true,
		group: ["sbhuoshou_cancel", "sbhuoshou_source"],
	},
	jdsbzaiqi: {
		audio: "sbzaiqi",
		trigger: {
			player: "phaseDiscardEnd",
		},
		filter(event, player) {
			return player.getHistory("lose", evt => evt.type == "discard").length;
		},
		async cost(event, trigger, player) {
			const num = player.getHistory("lose", evt => evt.type == "discard").reduce((num, evt) => num + evt.cards2.length, 0);
			event.result = await player
				.chooseTarget(get.prompt2(event.name.slice(0, -5)), [1, num])
				.set("ai", target => {
					const player = get.player();
					const att = get.attitude(player, target);
					return 3 - get.sgn(att) + Math.abs(att / 1000);
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const targets = event.targets.sortBySeat();
			while (targets.length) {
				const target = targets.shift();
				const bool = !target.countCards("he")
					? false
					: await target
							.chooseToDiscard(get.translation(player) + "对你发动了【再起】", "是否弃置一张牌令其回复1点体力？或者点击“取消”，令该角色摸一张牌。", "he")
							.set("ai", card => {
								const eff = _status.event.eff,
									att = _status.event.att;
								if ((eff > 0 && att > 0) || (eff <= 0 && att < 0)) return 5.5 - get.value(card);
								return 0;
							})
							.set("eff", get.recoverEffect(player, player, target))
							.set("att", get.attitude(target, player))
							.forResultBool();
				target.line(player);
				await player[bool ? "recover" : "draw"]();
			}
		},
	},
	//九鼎-大乔
	jdsbguose: {
		audio: "sbguose",
		inherit: "sbguose",
		usable: 1,
		filterTarget(card, player, target) {
			if (!ui.selected.cards.length) {
				if (!target.hasJudge("lebu")) return false;
				return game.hasPlayer(current => current != target && current.canAddJudge("lebu"));
			}
			if (player == target) return false;
			return player.canUse(get.autoViewAs({ name: "lebu" }, ui.selected.cards), target);
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			if (target.hasJudge("lebu")) {
				await player
					.moveCard(true, card => (card.viewAs || card.name) == "lebu")
					.set("sourceTargets", [target])
					.set(
						"aimTargets",
						game.filterPlayer(current => current != target && current.canAddJudge("lebu"))
					)
					.set("prompt", `移动${get.translation(target)}的一张【乐不思蜀】`);
			} else {
				const next = player.useCard({ name: "lebu" }, target, event.cards);
				next.audio = false;
				await next;
			}
		},
	},
	jdsbliuli: {
		audio: "sbliuli",
		inherit: "liuli",
		group: "jdsbliuli_add",
		subSkill: {
			add: {
				trigger: { player: "logSkill" },
				filter(event, player) {
					if (event.skill != "jdsbliuli") return false;
					return event.targets[0].isIn();
				},
				forced: true,
				popup: false,
				content() {
					game.countPlayer(i => i.removeSkill("jdsbliuli_dangxian"));
					trigger.targets[0].addSkill("jdsbliuli_dangxian");
				},
			},
			dangxian: {
				trigger: { player: "phaseBegin" },
				forced: true,
				charlotte: true,
				mark: true,
				marktext: "流",
				intro: { content: "回合开始时，执行一个额外的出牌阶段" },
				content() {
					player.removeSkill("jdsbliuli_dangxian");
					trigger.phaseList.splice(trigger.num, 0, "phaseUse|jdsbliuli_dangxian");
				},
			},
		},
	},
	//九鼎-姜维
	jdsbtiaoxin: {
		audio: "sbtiaoxin",
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return game.hasPlayer(current => current != player);
		},
		filterTarget: lib.filter.notMe,
		selectTarget() {
			return [1, get.player().getHp()];
		},
		multiline: true,
		async content(event, trigger, player) {
			const target = event.target;
			const bool = await target
				.chooseToUse(function (card, player, event) {
					if (get.name(card) != "sha") return false;
					return lib.filter.filterCard.apply(this, arguments);
				}, "挑衅：对" + get.translation(player) + "使用一张杀，或令其获得你一张牌")
				.set("targetRequired", true)
				.set("complexSelect", true)
				.set("filterTarget", function (card, player, target) {
					if (target != _status.event.sourcex && !ui.selected.targets.includes(_status.event.sourcex)) return false;
					return lib.filter.targetEnabled.apply(this, arguments);
				})
				.set("sourcex", player)
				.forResultBool();
			if (!target.countGainableCards(player, "he")) return;
			if (!bool || (bool && !target.hasHistory("sourceDamage", evt => evt.getParent(4) == event))) await player.gainPlayerCard(target, "he", true);
		},
		ai: {
			threaten: 1.2,
			order: 4,
			expose: 0.2,
			result: {
				target(player, target) {
					if (target.countGainableCards(player, "he") == 0) return 0;
					return -1;
				},
				player(player, target) {
					if (!target.canUse("sha", player)) return 0;
					if (target.countCards("h") == 0) return 0;
					if (target.countCards("h") == 1) return -0.1;
					if (player.hp <= 2) return -2;
					if (player.countCards("h", "shan") == 0) return -1;
					return -0.5;
				},
			},
		},
	},
	jdsbzhiji: {
		audio: "sbzhiji",
		trigger: {
			player: "dying",
		},
		juexingji: true,
		forced: true,
		skillAnimation: true,
		animationColor: "fire",
		async content(event, trigger, player) {
			player.awakenSkill(event.name);
			await player.recoverTo(2);
			await player.loseMaxHp();
			await player.addSkills("jdsbbeifa");
			if (player.isMinHandcard()) await player.draw(2);
		},
		derivation: "jdsbbeifa",
	},
	jdsbbeifa: {
		audio: 2,
		enable: "phaseUse",
		filter(event, player) {
			return game.hasPlayer(current => current != player);
		},
		filterCard: true,
		selectCard: [1, Infinity],
		check(card) {
			if (ui.selected.cards.length > 2) return 0;
			const player = get.player();
			if (game.hasPlayer(current => current != player && get.attitude(player, current) > 0 && current.getCards("h").some(cardx => get.name(cardx) == get.name(card)))) return 1;
			return 7.5 - get.value(card);
		},
		async content(event, trigger, player) {
			const cards = event.cards,
				num = cards.length,
				names = cards.map(card => get.name(card)).toUniqued();
			if (!game.hasPlayer(current => current != player && current.countCards("h"))) return;
			const targets = await player
				.chooseTarget(`北伐：令一名其他角色展示${num}张手牌`, true, (card, player, target) => {
					return target != player && target.countCards("h");
				})
				.set("ai", target => {
					const player = get.player();
					return get.attitude(player, target) * (1 + target.countCards("h"));
				})
				.forResultTargets();
			if (!targets || !targets.length) return;
			const target = targets[0];
			let showCards = await target
				.chooseCard("h", Math.min(num, target.countCards("h")), true, `选择${get.translation(num)}张手牌展示`)
				.set("ai", card => {
					const player = get.player(),
						goon = get.event("goon"),
						names = get.event("names");
					if (goon) {
						if (names.includes(get.name(card))) return 10;
						return 7.5 - get.value(card);
					} else {
						if (names.includes(get.name(card))) return 0;
						return 6 - get.value(card);
					}
				})
				.set("goon", get.attitude(target, player) > 0)
				.set("names", names)
				.forResultCards();
			if (!showCards || !showCards.length) return;
			await target.showCards(showCards);
			while (showCards.some(card => names.includes(get.name(card)) && player.hasUseTarget(get.autoViewAs({ name: "sha" }, [card]), false, false))) {
				const links = await player
					.chooseButton(["北伐：将其中一张牌当【杀】使用", showCards])
					.set("filterButton", button => {
						const player = get.player(),
							card = button.link;
						if (!get.event("names").includes(get.name(card))) return false;
						return player.hasUseTarget(get.autoViewAs({ name: "sha" }, [card]), false, false);
					})
					.set("ai", button => {
						return get.value(button.link);
					})
					.set("names", names)
					.forResultLinks();
				if (!links || !links.length) break;
				showCards.removeArray(links);
				const card = links[0],
					cardx = {
						name: "sha",
						cards: [card],
					};
				await player.chooseUseTarget(cardx, [card], true, false);
			}
		},
		ai: {
			order: 10,
			result: {
				player(player, target) {
					if (!game.hasPlayer(current => get.effect(current, { name: "sha" }, player, player) > 0)) return 0;
					const names = player
						.getCards("he")
						.map(card => get.name(card))
						.toUniqued();
					if (game.hasPlayer(current => current != player && get.attitude(player, current) > 0 && current.getCards("h").some(card => names.includes(get.name(card))))) return 1;
					return 0;
				},
			},
		},
	},
	//九鼎-关羽
	jdsbwusheng: {
		audio: "sbwusheng",
		trigger: {
			player: "phaseUseBegin",
		},
		filter(event, player) {
			return game.hasPlayer(target => target != player && target.countCards("h"));
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt(event.name.slice(0, -5)), "令一名其他角色展示所有手牌，本阶段对其使用的前X张【杀】无距离和次数限制且结算后你摸一张牌（X为其以此法展示的红色手牌数）", (card, player, target) => {
					return target != player && target.countCards("h");
				})
				.set("ai", target => {
					const player = get.player();
					return get.effect(target, { name: "sha" }, player, player) * (1 + target.countCards("h", { color: "red" }));
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			await target.showHandcards();
			if (get.mode() !== "identity" || player.identity !== "nei") player.addExpose(0.25);
			const num = target.countCards("h", { color: "red" });
			if (num > 0) {
				player.addTempSkill("jdsbwusheng_effect", { player: "phaseUseAfter" });
				player.storage.jdsbwusheng_effect[target.playerid] = num;
			}
		},
		group: "sbwusheng_wusheng",
		subSkill: {
			effect: {
				charlotte: true,
				onremove: true,
				init(player, skill) {
					if (!player.storage[skill]) player.storage[skill] = {};
				},
				mod: {
					targetInRange(card, player, target) {
						if (card.name !== "sha" || typeof player.storage.jdsbwusheng_effect[target.playerid] !== "number") return;
						if (player.storage.jdsbwusheng_effect[target.playerid] > 0) return true;
					},
					cardUsableTarget(card, player, target) {
						if (card.name !== "sha" || typeof player.storage.jdsbwusheng_effect[target.playerid] !== "number") return;
						if (player.storage.jdsbwusheng_effect[target.playerid] > 0) return true;
					},
				},
				audio: "sbwusheng",
				trigger: {
					player: "useCardAfter",
				},
				filter(event, player) {
					if (event.card.name != "sha") return false;
					return event.targets.some(target => typeof player.storage.jdsbwusheng_effect[target.playerid] == "number" && player.storage.jdsbwusheng_effect[target.playerid] > 0);
				},
				forced: true,
				async content(event, trigger, player) {
					const targets = trigger.targets.filter(target => typeof player.storage.jdsbwusheng_effect[target.playerid] == "number" && player.storage.jdsbwusheng_effect[target.playerid] > 0);
					player.line(targets);
					await player.draw(targets.length);
					for (const target of targets) player.storage.jdsbwusheng_effect[target.playerid]--;
				},
			},
		},
	},
	jdsbyijue: {
		audio: "sbyijue",
		trigger: {
			player: "phaseZhunbeiBegin",
		},
		filter(event, player) {
			return game.hasPlayer(current => current != player);
		},
		forced: true,
		logTarget(event, player) {
			return game.filterPlayer(current => current != player).sortBySeat();
		},
		async content(event, trigger, player) {
			const givers = [];
			for (const target of event.targets) {
				const bool = !target.countCards("he")
					? false
					: await target
							.chooseToGive(player, "he", `交给${get.translation(player)}一张牌，本回合当你首次受到其的【杀】的造成的伤害时，防止之`)
							.set("ai", card => {
								const player = get.event("player"),
									target = get.event().getParent().player;
								const att = get.attitude(player, target);
								if (att >= 0) return 0;
								if (player.getHp() > 1 || !target.canUse({ name: "sha" }, player, true, true)) return 0;
								return 7.5 - get.value(card);
							})
							.forResultBool();
				if (bool) givers.add(target);
			}
			if (givers.length) {
				player.addTempSkill(event.name + "_effect");
				player.markAuto(event.name + "_effect", givers);
			}
		},
		subSkill: {
			effect: {
				charlotte: true,
				onremove: true,
				intro: {
					content: "本回合$首次受到你的【杀】的造成的伤害时，你防止之",
				},
				trigger: {
					global: "damageBegin4",
				},
				filter(event, player) {
					if (!player.getStorage("jdsbyijue_effect").includes(event.player)) return false;
					return event.card && event.card.name == "sha" && event.getParent().type == "card";
				},
				forced: true,
				popup: false,
				async content(event, trigger, player) {
					trigger.cancel();
					player.unmarkAuto(event.name, [trigger.player]);
				},
			},
		},
	},
	//九鼎-小乔
	jdsbtianxiang: {
		audio: "sbtianxiang",
		trigger: {
			player: "damageBegin4",
		},
		filter(event, player) {
			return player.countCards("h") > 1 && event.num > 0;
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseCardTarget({
					filterCard: true,
					selectCard: 2,
					filterTarget: lib.filter.notMe,
					position: "he",
					ai1(card) {
						return 10 - get.value(card);
					},
					ai2(target) {
						var att = get.attitude(_status.event.player, target);
						var trigger = _status.event.getTrigger();
						var da = 0;
						if (_status.event.player.hp == 1) {
							da = 10;
						}
						var eff = get.damageEffect(target, trigger.source, target);
						if (att == 0) return 0.1 + da;
						if (eff >= 0 && att > 0) {
							return att + da;
						}
						if (att > 0 && target.hp > 1) {
							if (target.maxHp - target.hp >= 3) return att * 1.1 + da;
							if (target.maxHp - target.hp >= 2) return att * 0.9 + da;
						}
						return -att + da;
					},
					prompt: get.prompt("jdsbtianxiang"),
					prompt2: lib.translate.jdsbtianxiang_info,
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const cards = event.cards,
				target = event.targets[0];
			await player.showCards(cards);
			const links = await target
				.chooseButton(["天香：获得其中一张牌", cards], true)
				.set("ai", button => {
					const player = get.player(),
						card = button.link;
					return get.value(card);
				})
				.forResultLinks();
			if (!links || !links.length) return;
			const suit = get.suit(links[0], player);
			await target.gain(links, "gain2");
			if (suit == "heart") {
				trigger.cancel();
				await target
					.damage(trigger.source || "nosource", trigger.nature, trigger.num)
					.set("card", trigger.card)
					.set("cards", trigger.cards);
			} else {
				target.addTempSkill(event.name + "_effect");
				target.markAuto(event.name + "_effect", [get.type2(links[0])]);
			}
		},
		subSkill: {
			effect: {
				charlotte: true,
				onremove: true,
				mark: true,
				intro: {
					content: storage => `本回合不能使用${get.translation(storage)}牌`,
				},
				mod: {
					cardEnabled(card, player) {
						const hs = player.getCards("h"),
							cards = [card];
						if (Array.isArray(card.cards)) cards.addArray(card.cards);
						if (cards.containsSome(...hs) && player.getStorage("jdsbtianxiang_effect").includes(get.type2(card))) return false;
					},
					cardSavable(card, player) {
						const hs = player.getCards("h"),
							cards = [card];
						if (Array.isArray(card.cards)) cards.addArray(card.cards);
						if (cards.containsSome(...hs) && player.getStorage("jdsbtianxiang_effect").includes(get.type2(card))) return false;
					},
				},
			},
		},
	},
	jdsbhongyan: {
		audio: "xinhongyan",
		mod: {
			suit(card, suit) {
				if (suit == "spade") return "heart";
			},
		},
		trigger: {
			player: "loseAfter",
			global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"],
		},
		forced: true,
		filter(event, player) {
			if (player.hasHistory("gain", evt => evt.getParent().name == "draw" && evt.getParent(2).name == "jdsbhongyan")) return false;
			const evt = event.getl(player);
			return evt.cards2.some(i => get.suit(i, player) == "heart");
		},
		async content(event, trigger, player) {
			if (!trigger.visible) {
				const cards = trigger.getl(player).hs.filter(i => get.suit(i, player) == "heart");
				if (cards.length > 0) await player.showCards(cards, get.translation(player) + "发动了【红颜】");
			}
			await player.draw();
		},
	},
	//九鼎-孙权
	jdsbzhiheng: {
		audio: "sbzhiheng",
		inherit: "sbzhiheng",
		check(card) {
			let player = _status.event.player;
			if (get.position(card) == "e") {
				if (
					ui.selected.cards.some(i => {
						return get.position(i) == "e";
					})
				)
					return 0;
				let subs = get.subtypes(card);
				if (subs.includes("equip2") || subs.includes("equip3")) return 2 * player.getHp() - get.value(card);
				return 12 - get.value(card);
			}
			return 6 - get.value(card);
		},
		prompt() {
			return "出牌阶段限一次。你可以弃置任意张牌并摸等量的牌，若你以此法弃置的牌包括你装备区的牌，则你多摸一张牌";
		},
		async content(event, trigger, player) {
			const cards = event.cards;
			const num = cards.some(card => player.getCards("e").includes(card)) ? 1 : 0;
			await player.discard(cards);
			await player.draw(cards.length + num);
		},
	},
	jdsbtongye: {
		init(player) {
			if (game.shuffleNumber == 0) {
				player.addAdditionalSkill("jdsbtongye", get.info("jdsbtongye").derivation);
				lib.onwash.push(function () {
					player.removeAdditionalSkill("jdsbtongye");
				});
			}
		},
		onremove(player) {
			player.removeAdditionalSkill("jdsbtongye");
		},
		derivation: ["sbyingzi", "olguzheng"],
		locked: true,
	},
	jdsbjiuyuan: {
		audio: "sbjiuyuan",
		enable: "phaseUse",
		usable: 1,
		zhuSkill: true,
		filter(event, player) {
			return game.hasPlayer(current => get.info("jdsbjiuyuan").filterTarget(null, player, current));
		},
		filterTarget(card, player, target) {
			return target != player && target.group == "wu" && target.countGainableCards(player, "e") && player.hasZhuSkill("jdsbjiuyuan", target);
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			await player.gain(target.getCards("e"), target, "giveAuto", "bySelf");
			await player.recover();
		},
		ai: {
			order: 10,
			result: {
				target(player, target) {
					return get.effect(target, { name: "shunshou_copy2" }, player, target) * target.countGainableCards(player, "e");
				},
			},
		},
	},
	//九鼎-司马炎
	jdfengtu: {
		mode: ["identity", "guozhan", "doudizhu", "versus"],
		available(mode) {
			if (mode == "versus" && _status.mode == "three") return false;
		},
		trigger: { global: "dieAfter" },
		filter(event, player) {
			//if (game.players.includes(event.player)) return false;
			return game.hasPlayer(target => {
				return !game.getAllGlobalHistory("everything", evt => {
					return evt.name == "loseMaxHp" && evt.getParent().name == "jdfengtu" && evt.player == target;
				}).length;
			});
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt2("jdfengtu"), (card, player, target) => {
					return get.event().targets.includes(target);
				})
				.set("ai", target => {
					const player = get.event("player"),
						att = get.attitude(player, target);
					if (target.maxHp <= 1) return 114514119810 * get.sgn(-att);
					if (player.identity == "nei" && target != player) return 0;
					return (target.maxHp - 1) * att;
				})
				.set(
					"targets",
					game.filterPlayer(target => {
						return !game.getAllGlobalHistory("everything", evt => {
							return evt.name == "loseMaxHp" && evt.getParent().name == "jdfengtu" && evt.player == target;
						}).length;
					})
				)
				.forResult();
		},
		async content(event, trigger, player) {
			if (!lib.onround.includes(lib.skill.jdfengtu.onRound)) {
				lib.onround.push(lib.skill.jdfengtu.onRound);
			}
			const target = event.targets[0];
			await target.loseMaxHp();
			target.addSkill("jdfengtu_phase");
			target.markAuto("jdfengtu_phase", [trigger.player]);
		},
		onRound(event) {
			return (event.relatedEvent || event.getParent(2)).name != "jdfengtu_phase";
		},
		check(source, player) {
			const players = game.players
				.slice()
				.concat(game.dead)
				.filter(target => {
					return target.isAlive() || [source, player].includes(target);
				})
				.sort((a, b) => parseInt(a.dataset.position) - parseInt(b.dataset.position));
			const num = players.indexOf(source),
				num2 = players.indexOf(player);
			return num2 - num == 1 || (num == players.length - 1 && num2 == 0);
		},
		subSkill: {
			phase: {
				charlotte: true,
				trigger: { global: "phaseOver" },
				filter(event, player) {
					return player.getStorage("jdfengtu_phase").some(target => {
						return lib.skill.jdfengtu.check(event.player, target);
					});
				},
				forced: true,
				popup: false,
				content() {
					const next = player.insertPhase();
					delete next.skill;
				},
				intro: { content: "获得$的额定回合" },
			},
		},
	},
	jdjuqi: {
		trigger: { global: "phaseZhunbeiBegin" },
		filter(event, player) {
			const storage = player.storage.jdjuqi;
			return event.player == player || event.player.countCards("h", card => _status.connectMode || (get.color(card, event.player) == storage ? "red" : "black"));
		},
		async cost(event, trigger, player) {
			const target = trigger.player;
			if (target == player) {
				event.result = { bool: true };
			} else {
				const color = player.storage.jdjuqi ? "red" : "black";
				event.result = await target
					.chooseCard((card, player) => get.color(card, player) == _status.event.color, `举棋：你可以交给${get.translation(player)}一张${get.translation(color)}手牌`)
					.set("ai", card => {
						const player = get.player(),
							target = get.event("target");
						if (get.attitude(player, target) <= 0) return 0;
						return 6 - get.value(card);
					})
					.set("color", color)
					.set("target", player)
					.forResult();
			}
		},
		async content(event, trigger, player) {
			const target = trigger.player;
			player.changeZhuanhuanji(event.name);
			if (target == player) {
				if (player.storage[event.name]) await player.draw(3);
				else player.addTempSkill(event.name + "_effect");
			} else {
				await target.showCards(event.cards);
				await target.give(event.cards, player);
			}
		},
		mark: true,
		zhuanhuanji: true,
		marktext: "☯",
		intro: {
			content(storage) {
				if (storage) return "<li>准备阶段，你令你本回合使用牌无次数限制且造成的伤害+1<br><li>其他角色的准备阶段，其可以展示并交给你一张红色手牌";
				return "<li>准备阶段，你摸三张牌<br><li>其他角色的准备阶段，其可以展示并交给你一张黑色手牌";
			},
		},
		subSkill: {
			effect: {
				charlotte: true,
				mod: { cardUsable: () => Infinity },
				forced: true,
				popup: false,
				trigger: { source: "damageBegin1" },
				filter(event, player) {
					return event.card && event.getParent().type == "card";
				},
				async content(event, trigger, player) {
					trigger.num++;
				},
				mark: true,
				intro: { content: "本回合使用牌无次数限制且造成的伤害+1" },
			},
		},
	},
	jdtaishi: {
		zhuSkill: true,
		trigger: { global: "phaseBefore" },
		filter(event, player) {
			return game.hasPlayer(current => current.isUnseen(2));
		},
		logTarget() {
			return game.filterPlayer(current => current.isUnseen(2)).sortBySeat();
		},
		limited: true,
		skillAnimation: true,
		animationColor: "orange",
		async content(event, trigger, player) {
			player.awakenSkill(event.name);
			for (const target of game.filterPlayer(current => current.isUnseen(2)).sortBySeat()) {
				await target.showCharacter(2);
			}
		},
	},
	//荆襄风云
	jxxiongzi: {
		audio: "reyingzi",
		trigger: {
			player: "phaseDrawBegin2",
		},
		forced: true,
		preHidden: true,
		filter(event, player) {
			return !event.numFixed;
		},
		content() {
			trigger.num += player.hp;
		},
		ai: {
			threaten: 1.5,
		},
		mod: {
			maxHandcard(player, num) {
				return num + player.hp;
			},
		},
	},
	jxzhanyan: {
		enable: "phaseUse",
		usable: 1,
		audio: "dcsbronghuo",
		filter(event, player) {
			return player.countCards("h");
		},
		filterTarget: lib.filter.notMe,
		async content(event, trigger, player) {
			const target = event.targets[0];
			let list = Array.from(Array(player.countCards("h") + 1)).map((i, p) => p);
			let dialog = [`猜测${get.translation(player)}拥有的红色手牌数量`];
			while (list.length) {
				let nums = list.slice(0, Math.min(10, list.length));
				list.removeArray(nums);
				dialog.push([nums, "tdnodes"]);
			}
			const result = await target
				.chooseButton(dialog, true)
				.set("ai", () => Math.random())
				.forResult();
			if (result.bool) {
				target.chat(`我猜你有${result.links[0]}张红色牌！`);
				game.log(target, "猜测", player, "有红色牌", "#g" + result.links[0] + "张");
				if (event.isMine() && !event.isOnline()) await game.delay();
				await player.showHandcards(player, "发动了【绽焰】");
				const num = Math.min(3, Math.abs(result.links[0] - player.countCards("h", card => get.color(card, player) == "red")));
				const redCards = player.getCards("he", card => get.color(card, player) == "red");
				if (redCards.length) await player.give(redCards, target);
				if (num > 0) await target.damage("fire", num);
			}
		},
		ai: {
			order: 3,
			result: {
				target(player, target) {
					return get.damageEffect(target, player, target) + player.countCards("he", { color: "red" });
				},
			},
		},
	},
	jxwusheng: {
		mod: {
			targetInRange(card) {
				if (get.suit(card) == "diamond" && card.name == "sha") return true;
			},
		},
		locked: false,
		audio: "wusheng",
		enable: ["chooseToUse", "chooseToRespond"],
		filter(event, player) {
			return get
				.inpileVCardList(info => {
					const name = info[2];
					if (info[3]) return false;
					if (name != "sha" && name != "jiu") return false;
					return get.type(name) == "basic";
				})
				.some(card => player.hasCard(cardx => get.color(cardx, player) == "red" && event.filterCard({ name: card[2], nature: card[3], cards: [cardx] }, player, event), "hes"));
		},
		chooseButton: {
			dialog(event, player) {
				const list = get
					.inpileVCardList(info => {
						const name = info[2];
						if (info[3]) return false;
						if (name != "sha" && name != "jiu") return false;
						return get.type(name) == "basic";
					})
					.filter(card => player.hasCard(cardx => get.color(cardx, player) == "red" && event.filterCard({ name: card[2], nature: card[3], cards: [cardx] }, player, event), "hes"));
				return ui.create.dialog("武圣", [list, "vcard"]);
			},
			filter(button, player) {
				return _status.event.getParent().filterCard({ name: button.link[2], nature: button.link[3] }, player, _status.event.getParent());
			},
			check(button) {
				if (_status.event.getParent().type != "phase") return 1;
				const player = get.event("player"),
					value = player.getUseValue({ name: button.link[2], nature: button.link[3] });
				return value;
			},
			backup(links, player) {
				return {
					audio: "wusheng",
					filterCard(card, player) {
						return get.color(card, player) == "red";
					},
					popname: true,
					check(card) {
						return 6 - get.value(card);
					},
					position: "hse",
					viewAs: { name: links[0][2], nature: links[0][3] },
				};
			},
			prompt(links, player) {
				return "将一张牌当作" + (get.translation(links[0][3]) || "") + "【" + get.translation(links[0][2]) + "】使用或打出";
			},
		},
		hiddenCard(player, name) {
			if (name != "jiu") return false;
			return player.countCards("hes", { color: "red" });
		},
		ai: {
			skillTagFilter(player) {
				if (!player.countCards("hes", { color: "red" })) return false;
			},
			respondSha: true,
		},
	},
	//神曹仁
	jxjushou: {
		trigger: {
			player: "phaseJieshuBegin",
		},
		check(event, player) {
			if (game.countPlayer() > 4) return true;
			return event.player.hp + player.countCards("h") < 4;
		},
		async content(event, trigger, player) {
			const num = game.countPlayer();
			await player.turnOver();
			await player.draw(num);
			let eff = num > 4 ? 4 * (4 - num) : 0;
			for (const current of game.players) {
				eff += get.sgnAttitude(player, current) * (current.countCards("e") + 3 + current.isTurnedOver() ? 5 : -5);
			}
			const result = await player
				.chooseBool("是否令所有角色翻面并摸三张牌？")
				.set("choice", eff > 0)
				.forResult();
			if (result.bool) {
				for (const current of game.players) {
					await current.turnOver();
					await current.draw(3);
				}
				const lose_list = [];
				for (const current of game.players) {
					if (current.countCards("e")) lose_list.push([current, current.getCards("e")]);
				}
				if (lose_list.length) {
					await game
						.loseAsync({
							lose_list: lose_list,
							discarder: player,
						})
						.setContent("discardMultiple");
				}
				await player.changeSkills(["jxtuwei"], ["jxjushou"]);
			}
		},
		ai: {
			effect: {
				target(card, player, target) {
					if (card.name == "guiyoujie") return [0, 1];
				},
			},
		},
		derivation: ["jxtuwei"],
	},
	jxtuwei: {
		enable: "phaseUse",
		intro: {
			content: "已对$发动过【突围】",
		},
		onremove: true,
		onChooseToUse(event) {
			if (!event.jxtuwei && !game.online) {
				const player = get.player();
				const cards = Array.from(ui.discardPile.childNodes).filter(card => get.type(card) == "equip");
				event.set("jxtuwei", cards);
			}
		},
		filter(event, player) {
			if (!game.hasPlayer(current => !player.getStorage("jxtuwei").includes(current))) return false;
			return event.jxtuwei && event.jxtuwei.length;
		},
		chooseButton: {
			dialog(event, player) {
				const list2 = event.jxtuwei;
				var dialog = ui.create.dialog('###突围###<div class="text center">请选择一张装备牌置入一名其他角色的装备区</div>');
				if (list2.length) {
					dialog.add(list2);
				}
				return dialog;
			},
			check(button) {
				var player = _status.event.player;
				var num = get.value(button.link);
				if (!game.hasPlayer(target => !player.getStorage("jxtuwei").includes(target) && get.attitude(player, target) > 0)) return num;
				return 5 / num;
			},
			backup(links, player) {
				return {
					card: links[0],
					filterTarget(card, player, target) {
						return !player.getStorage("jxtuwei").includes(target);
					},
					check: () => 1,
					async content(event, trigger, player) {
						const cardx = lib.skill.jxtuwei_backup.card,
							target = event.targets[0];
						target.$gain2(cardx);
						await game.delayx();
						await target.equip(cardx);
						player.markAuto("jxtuwei", target);
						if (target != player) {
							const result = await player
								.chooseControl("令其摸一张牌", "对其造成1点伤害", "cancel2")
								.set("ai", function () {
									return _status.event.choice;
								})
								.set(
									"choice",
									(function () {
										if (get.damageEffect(target, player, player) > 0) return "对其造成1点伤害";
										if (get.effect(target, { name: "draw" }, player, player) > 0) return "令其摸一张牌";
										return "cancel2";
									})()
								)
								.forResult();
							if (result.index == 0) await target.draw();
							if (result.index == 1) {
								player.line(target, "green");
								await target.damage();
							}
						}
					},
					ai: {
						result: {
							target(player, target) {
								var att = get.attitude(player, target);
								if (att > 0) return 3;
								if (att < 0) return -1;
								return 0;
							},
						},
					},
				};
			},
			prompt(links, player) {
				return "请选择置入" + get.translation(links) + "的角色";
			},
		},
		subSkill: {
			backup: {},
		},
	},
	//神刘表
	jxxiongju: {
		trigger: {
			global: "phaseBefore",
			player: "enterGame",
		},
		forced: true,
		filter(event, player) {
			return event.name != "phase" || game.phaseNumber == 0;
		},
		async content(event, trigger, player) {
			let cards = [];
			while (cards.length < 2) {
				const card = game.createCard2("jingxiangshengshi", "heart", 5);
				cards.push(card);
			}
			if (cards.length) await player.gain(cards, "gain2");
			const num = game.countGroup();
			await player.draw(num);
			await player.gainMaxHp(num);
			await player.recover(num);
		},
		mod: {
			maxHandcard(player, num) {
				return num + game.countGroup();
			},
		},
	},
	jxfujing: {
		trigger: {
			player: "phaseDrawBefore",
		},
		forced: true,
		async content(event, trigger, player) {
			trigger.cancel();
			const card = { name: "jingxiangshengshi", isCard: true };
			if (game.countPlayer(current => player.canUse(card, current)) < game.countGroup()) return;
			await player.chooseUseTarget(card, true);
			for (const target of game.players) {
				if (target.getHistory("gain", evt => evt.getParent(event.name) == event).length && target != player) {
					target.addTempSkill("jxfujing_effect", "roundStart");
					target.markAuto("jxfujing_effect", player);
				}
			}
		},
		subSkill: {
			effect: {
				mark: true,
				intro: {
					content: "本轮下一次对$使用牌时须弃置一张牌",
				},
				onremove: true,
				trigger: {
					player: "useCardToPlayer",
				},
				filter(event, player) {
					return player.getStorage("jxfujing_effect").includes(event.target);
				},
				forced: true,
				charlotte: true,
				async content(event, trigger, player) {
					const target = trigger.target;
					if (player.countCards("he")) await player.chooseToDiscard("he", true);
					player.unmarkAuto("jxfujing_effect", [target]);
					if (!player.getStorage("jxfujing_effect").length) player.removeSkill(event.name);
				},
			},
		},
	},
	jxyongrong: {
		trigger: {
			source: "damageBegin1",
			player: "damageBegin3",
		},
		usable: 1,
		filter(event, player, name) {
			const target = name == "damageBegin1" ? event.player : event.source;
			return target && target.isIn() && target.countCards("h") < player.countCards("h");
		},
		async cost(event, trigger, player) {
			const target = event.triggername == "damageBegin1" ? trigger.player : trigger.source;
			const prompt2 = `交给其一张牌并令此伤害${event.triggername == "damageBegin1" ? "+" : "-"}1`;
			const result = await player
				.chooseCard(get.prompt("jxyongrong", target), prompt2, "he")
				.set("ai", function (card) {
					const eff = _status.event.eff,
						isPlayer = _status.event.isPlayer;
					if ((isPlayer && eff < 0) || (!isPlayer && eff > 0)) return 6 - get.value(card);
					return 0;
				})
				.set("eff", get.damageEffect(trigger.player, trigger.source, player))
				.set("isPlayer", player == trigger.player)
				.forResult();
			event.result = {
				bool: result.bool,
				cards: result.cards,
				targets: [target],
			};
		},
		async content(event, trigger, player) {
			await player.give(event.cards, event.targets[0]);
			if (event.triggername == "damageBegin1") trigger.num++;
			else trigger.num--;
		},
	},
	//线下E系列
	//钟会
	psmouchuan: {
		audio: 2,
		trigger: {
			global: "roundStart",
		},
		async content(event, trigger, player) {
			await player.draw(2);
			if (!player.countCards("he") || !game.hasPlayer(current => current != player)) return;
			const [cards, targets] = await player
				.chooseCardTarget({
					forced: true,
					prompt: get.prompt("psmouchuan"),
					prompt2: "将一张牌交给一名其他角色",
					filterTarget: lib.filter.notMe,
					filterCard: true,
					position: "he",
					ai1(card) {
						return 6 - get.value(card);
					},
					ai2(target) {
						const player = get.player();
						return get.attitude(player, target);
					},
				})
				.forResult("cards", "targets");
			if (!cards || !cards.length || !targets || !targets.length) return;
			const [target] = targets;
			await player.give(cards, target);
			if ([player, target].some(i => !i.countCards("h"))) return;
			let card1, card2;
			if (player.countCards("h")) {
				const cardp = await player.chooseCard("请展示一张手牌", true, "h").forResultCards();
				await player.showCards(cardp);
				card1 = cardp[0];
			}
			if (target.countCards("h")) {
				const cardt = await target.chooseCard("请展示一张手牌", true, "h").forResultCards();
				await target.showCards(cardt);
				card2 = cardt[0];
			}
			if (card1 && card2) {
				const skill = get.color(card1, player) == get.color(card2, target) ? "psdaohe" : "pszhiyi";
				await player.addTempSkills(skill, "roundStart");
			}
		},
		derivation: ["psdaohe", "pszhiyi"],
	},
	pszizhong: {
		audio: 2,
		mod: {
			maxHandcard(player, num) {
				return num + get.info("jsrgjuxia").countSkill(player);
			},
		},
		trigger: {
			player: ["useCard", "respond"],
		},
		filter(event, player) {
			const num = get.info("jsrgjuxia").countSkill(player) - 2;
			if (num <= 0 || get.type(event.card) == "equip") return false;
			let name = get.name(event.card),
				stat =
					player.getRoundHistory("useCard", evt => {
						return evt != event && get.name(evt.card) == name;
					}).length +
					player.getRoundHistory("respond", evt => {
						return evt != event && get.name(evt.card) == name;
					}).length;
			return stat == 0;
		},
		forced: true,
		async content(event, trigger, player) {
			const num = get.info("jsrgjuxia").countSkill(player) - 2;
			await player.draw(num);
		},
	},
	psjizun: {
		audio: 2,
		trigger: {
			player: "dyingAfter",
		},
		filter(event, player) {
			return player.isDamaged() || !player.hasSkill("psqingsuan");
		},
		forced: true,
		unique: true,
		juexingji: true,
		skillAnimation: true,
		animationColor: "orange",
		async content(event, trigger, player) {
			player.awakenSkill("psjizun");
			if (!player.hasSkill("psqingsuan")) await player.addSkills("psqingsuan");
			else await player.recoverTo(player.maxHp);
		},
		derivation: "psqingsuan",
	},
	psqingsuan: {
		locked: true,
		zhuSkill: true,
		getEnemies(player) {
			const enemies = [];
			player.checkAllHistory("damage", evt => {
				if (evt.source && player.group != evt.source.group) enemies.add(evt.source);
			});
			return enemies;
		},
		mod: {
			targetInRange(card, player, target) {
				if (get.info("psqingsuan").getEnemies(player).includes(target)) return true;
			},
			cardUsableTarget(card, player, target) {
				if (get.info("psqingsuan").getEnemies(player).includes(target)) return true;
			},
		},
	},
	psdaohe: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return game.hasPlayer(current => current != player && current.countCards("h"));
		},
		filterTarget(card, player, target) {
			return target != player && target.countCards("h");
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			await target.chooseToGive(player, "h", [1, Infinity], true).set("ai", card => {
				const player = get.player(),
					target = get.event("target"),
					att = get.attitude(player, target);
				if (att <= 0) {
					if (ui.selected.cards.length) return 0;
					return 6 - get.value(card);
				}
				return target.getUseValue(card);
			});
			await target.recover();
		},
		ai: {
			order: 6,
			result: {
				player(player, target) {
					if (target.isHealthy()) return get.effect(target, { name: "shunshou_copy2" }, player, player);
					return get.recoverEffect(target, player, player);
				},
			},
		},
	},
	pszhiyi: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		filterTarget: true,
		async content(event, trigger, player) {
			const target = event.targets[0];
			await target.draw();
			await target.damage();
		},
		ai: {
			order: 1,
			result: {
				player(player, target) {
					return get.effect(target, { name: "draw" }, player, player) + get.damageEffect(target, player, player);
				},
			},
		},
	},
	//鄂焕
	psdiwan: {
		trigger: { player: "useCardToPlayered" },
		filter(event, player) {
			return event.card.name == "sha" && event.isFirstTarget;
		},
		frequent: true,
		usable: 1,
		content() {
			player.draw(trigger.targets.length);
		},
	},
	pssuiluan: {
		trigger: { player: "useCard2" },
		filter(event, player) {
			if (player.group != "qun" || event.card.name != "sha") return false;
			return (
				game.countPlayer(target => {
					return !event.targets.includes(target) && lib.filter.targetEnabled2(event.card, player, target) && lib.filter.targetInRange(event.card, player, target);
				}) > 1
			);
		},
		groupSkill: "qun",
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(
					get.prompt2("pssuiluan"),
					(card, player, target) => {
						const event = get.event().getTrigger();
						return !event.targets.includes(target) && lib.filter.targetEnabled2(event.card, player, target) && lib.filter.targetInRange(event.card, player, target);
					},
					2
				)
				.set("ai", target => {
					const player = get.event("player"),
						event = get.event().getTrigger();
					return get.effect(target, event.card, player);
				})
				.forResult();
		},
		async content(event, trigger, player) {
			trigger.targets.addArray(event.targets);
			player.addTempSkill("pssuiluan_effect");
			trigger.card.pssuiluan = true;
		},
		subSkill: {
			effect: {
				charlotte: true,
				trigger: { player: ["useCardAfter", "damageEnd"] },
				filter(event, player) {
					if (event.name == "damage") {
						return player.group != "shu" && event.getParent(4).name == "pssuiluan_effect";
					}
					return event.card.pssuiluan && (event.targets || []).some(i => i.isIn());
				},
				forced: true,
				popup: false,
				forceDie: true,
				async content(event, trigger, player) {
					if (trigger.name == "damage") {
						await player.changeGroup("shu");
						return;
					}
					const targets = trigger.targets.filter(i => i.isIn()).sortBySeat();
					for (const target of targets) {
						await target
							.chooseToUse(function (card, player, event) {
								if (get.name(card) != "sha") return false;
								return lib.filter.filterCard.apply(this, arguments);
							}, "随乱：是否对" + get.translation(player) + "使用一张【杀】？")
							.set("filterTarget", function (card, player, target) {
								if (target != _status.event.sourcex && !ui.selected.targets.includes(_status.event.sourcex)) return false;
								return lib.filter.filterTarget.apply(this, arguments);
							})
							.set("targetRequired", true)
							.set("complexSelect", true)
							.set("sourcex", player);
					}
				},
			},
		},
	},
	psconghan: {
		trigger: { global: "damageSource" },
		filter(event, player) {
			if (player.group != "shu" || !event.source || !event.player.isIn()) return false;
			return event.source.getSeatNum() == 1 && (player.hasSha() || (_status.connectMode && player.countCards("hs")));
		},
		direct: true,
		groupSkill: "shu",
		seatRelated: true,
		content() {
			player
				.chooseToUse(function (card, player, event) {
					if (get.name(card) != "sha") return false;
					return lib.filter.filterCard.apply(this, arguments);
				}, get.prompt2("psconghan", trigger.player))
				.set("filterTarget", function (card, player, target) {
					if (target != _status.event.sourcex && !ui.selected.targets.includes(_status.event.sourcex)) return false;
					return lib.filter.filterTarget.apply(this, arguments);
				})
				.set("targetRequired", true)
				.set("complexSelect", true)
				.set("logSkill", ["psconghan", trigger.player])
				.set("sourcex", trigger.player);
		},
	},
	//肘击
	psyanmou: {
		getCards(event, player) {
			let cards = [];
			if (event.name == "cardsDiscard") {
				const evt = event.getParent().relatedEvent;
				if (evt && evt.name == "judge" && evt.player != player) {
					cards.addArray(event.cards.filter(i => get.position(i, true) == "d"));
				}
			} else {
				if (event.type == "discard" && event.getlx !== false) {
					for (const target of game.filterPlayer2()) {
						if (target == player) continue;
						const evt = event.getl(target);
						if (evt && (evt.cards2 || []).length) {
							cards.addArray((evt.cards2 || []).filter(i => i.original != "j" && get.position(i, true) == "d"));
						}
					}
				}
			}
			return cards.filter(card => {
				return card.name == "huogong" || (card.name == "sha" && game.hasNature(card, "fire"));
			});
		},
		trigger: { global: ["cardsDiscardAfter", "loseAfter", "loseAsyncAfter"] },
		filter(event, player) {
			return lib.skill.psyanmou.getCards(event, player).length;
		},
		prompt2(event, player) {
			return "获得" + get.translation(lib.skill.psyanmou.getCards(event, player));
		},
		frequent: true,
		content() {
			player.gain(lib.skill.psyanmou.getCards(trigger, player), "gain2");
		},
		group: "psyanmou_chooseToUse",
		subSkill: {
			chooseToUse: {
				trigger: {
					player: "gainAfter",
					global: "loseAsyncAfter",
				},
				filter(event, player) {
					return event.getg && event.getg(player).length;
				},
				forced: true,
				locked: false,
				async content(event, trigger, player) {
					let cards = trigger.getg(player);
					await player.showCards(cards, get.translation(player) + "发动了【炎谋】");
					cards = cards.filter(card => {
						if (!player.hasUseTarget(card) || get.owner(card) !== player) return false;
						return get.name(card) == "huogong" || (get.name(card) == "sha" && game.hasNature(card, "fire"));
					});
					if (cards.length) {
						await player
							.chooseToUse(function (card, player, event) {
								if (!get.event("cards").includes(card)) return false;
								return lib.filter.filterCard.apply(this, arguments);
							}, "炎谋：选择使用其中的一张【火攻】或火【杀】")
							.set("cards", cards)
							.set("filterTarget", function (card, player, target) {
								return lib.filter.filterTarget.apply(this, arguments);
							})
							.set("targetRequired", true)
							.set("complexSelect", true)
							.set("forced", true)
							.set("addCount", false);
					}
				},
			},
		},
	},
	pszhanyan: {
		enable: "phaseUse",
		filter(event, player) {
			return game.hasPlayer(target => player.inRange(target));
		},
		usable: 1,
		filterTarget(card, player, target) {
			return player.inRange(target);
		},
		selectTarget: -1,
		multitarget: true,
		multiline: true,
		delay: 0,
		async content(event, trigger, player) {
			const targets = event.targets.sortBySeat();
			let damages = 0,
				puts = 0;
			player.line(targets);
			await game.delay();
			for (const target of targets) {
				let dialog = ["绽焰：将手牌中或弃牌堆中的一张【火攻】或火【杀】置于牌堆顶，或受到1点火焰伤害"];
				const Tcards = target.getCards("h", card => {
					return get.name(card) == "huogong" || (get.name(card) == "sha" && game.hasNature(card, "fire"));
				});
				const Pcards = Array.from(ui.discardPile.childNodes).filter(card => {
					return card.name == "huogong" || (card.name == "sha" && game.hasNature(card, "fire"));
				});
				if (Tcards.length) {
					dialog.push('<div class="text center">手牌区</div>');
					dialog.push(Tcards);
				}
				if (Pcards.length) {
					dialog.push('<div class="text center">弃牌堆</div>');
					dialog.push(Pcards);
				}
				let result;
				if (Tcards.length + Pcards.length == 0) {
					result = { bool: false };
				} else {
					result = await target
						.chooseButton(dialog)
						.set("ai", button => {
							const player = get.event("player"),
								source = get.event().getParent().player;
							if (get.damageEffect(source, player, player) <= 0 && get.attitude(player, source) <= 0) return 0;
							if (!get.owner(button.link)) return 114514;
							return 20 - get.value(button.link);
						})
						.forResult();
				}
				if (result.bool) {
					puts++;
					const card = result.links[0];
					target.$throw([card], 1000);
					if (get.owner(card)) await get.owner(card).lose([card], ui.cardPile);
					else ui.discardPile.removeChild(card);
					ui.cardPile.insertBefore(card, ui.cardPile.firstChild);
					game.updateRoundNumber();
					game.log(target, "将" + get.translation(card) + "置于牌堆顶");
				} else {
					damages++;
					await target.damage(1, "fire");
				}
				await game.delay(0.5);
			}
			const num = Math.min(damages, puts);
			if (num) await player.draw(num);
		},
		ai: {
			order: 9,
			result: { player: 1 },
		},
	},
	psyuhuo: {
		trigger: { player: "damageBegin4" },
		filter(event) {
			return event.hasNature("fire");
		},
		forced: true,
		content() {
			trigger.cancel();
		},
		ai: {
			nofire: true,
			effect: {
				target(card, player, target, current) {
					if (get.tag(card, "fireDamage")) return "zeroplayertarget";
				},
			},
		},
		mod: {
			cardDiscardable(card, player, name) {
				if (name == "phaseDiscard" && (get.name(card) == "huogong" || (get.name(card) == "sha" && game.hasNature(card, "fire")))) return false;
			},
			ignoredHandcard(card, player) {
				if (get.name(card) == "huogong" || (get.name(card) == "sha" && game.hasNature(card, "fire"))) return true;
			},
		},
	},
	//龙起襄樊
	//关羽
	//界界关羽
	dragchaojue: {
		trigger: { player: "phaseZhunbeiBegin" },
		filter(event, player) {
			if (!game.hasPlayer(target => target != player)) return false;
			return player.countCards("h", card => _status.connectMode || lib.filter.cardDiscardable(card, player));
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseToDiscard(get.prompt2("dragchaojue"), "h")
				.set("ai", card => {
					const player = get.event("player");
					if (!game.hasPlayer(target => get.attitude(player, target) < 0)) return 0;
					if (get.suit(card, player) == "diamond") return 8 - get.value(card);
					return 7.5 - get.value(card);
				})
				.set("logSkill", "dragchaojue")
				.forResult();
		},
		popup: false,
		async content(event, trigger, player) {
			const targets = game.filterPlayer(target => target != player).sortBySeat();
			if (targets.length) {
				const suits = event.cards
					.reduce((list, card) => list.add(get.suit(card, player)), [])
					.sort((a, b) => {
						return lib.suit.indexOf(b) - lib.suit.indexOf(a);
					});
				player.line(targets);
				for (const i of targets) {
					i.addTempSkill("dragchaojue_buff");
					i.markAuto("dragchaojue_buff", suits);
				}
				for (const target of targets) {
					const {
						result: { bool },
					} = await target
						.chooseToGive(
							player,
							(card, player) => {
								return get.event("suits").includes(get.suit(card));
							},
							"h",
							"give"
						)
						.set("suits", suits)
						.set("ai", card => {
							const player = get.event("player"),
								target = get.event().getParent().player;
							const att = get.attitude(player, target);
							if (att > 0) return 7.5 - get.value(card);
							if (att > -1) return 0;
							if (
								att < 0 &&
								get.attitude(target, player) < 0 &&
								player.getSkills(null, false, false).some(skill => {
									if (get.is.locked(skill, player)) return false;
									const info = get.info(skill);
									return info && info.ai && (info.ai.maixie || info.ai.maixie_hp || info.ai.maixie_defend);
								}) &&
								player.getHp() <= 2
							)
								return 7.5 - get.value(card);
							return 0;
						})
						.set("prompt", "超绝：交给" + get.translation(player) + "一张" + get.translation(suits) + "手牌，或本回合非锁定技失效");
					if (!bool) target.addTempSkill("fengyin");
				}
			}
		},
		subSkill: {
			buff: {
				onremove: true,
				charlotte: true,
				mod: {
					cardEnabled2(card, player) {
						if (player.getStorage("dragchaojue_buff").includes(get.suit(card))) return false;
					},
				},
				marktext: "绝",
				intro: { content: "本回合内不能使用或打出$牌" },
			},
		},
	},
	dragjunshen: {
		mod: {
			targetInRange(card, player) {
				if (get.suit(card) == "diamond" && card.name == "sha") return true;
			},
		},
		locked: false,
		enable: ["chooseToUse", "chooseToRespond"],
		filterCard(card, player) {
			return get.color(card) == "red";
		},
		viewAsFilter(player) {
			return player.countCards("hes", { color: "red" });
		},
		position: "hes",
		viewAs: { name: "sha" },
		prompt: "将一张红色牌当作【杀】使用或打出",
		check(card) {
			const val = get.value(card);
			if (_status.event.name == "chooseToRespond") return 1 / Math.max(0.1, val);
			return 5 - val;
		},
		ai: {
			order(item, player) {
				if (!player || !_status.event.type || _status.event.type != "phase") {
					return 0.1;
				}
				return get.order({ name: "sha" }, player) + 0.3;
			},
			respondSha: true,
			skillTagFilter(player) {
				if (!player.countCards("hes", { color: "red" })) return false;
			},
		},
		group: ["dragjunshen_add", "dragjunshen_damage"],
		subSkill: {
			add: {
				trigger: { player: "useCard2" },
				filter(event, player) {
					if (event.card.name != "sha" || get.suit(event.card) != "heart") return false;
					return game.hasPlayer(target => {
						return target != player && !event.targets.includes(target) && lib.filter.targetEnabled2(event.card, player, target) && lib.filter.targetInRange(event.card, player, target);
					});
				},
				async cost(event, trigger, player) {
					event.result = await player
						.chooseTarget(get.prompt("dragjunshen_add"), "为" + get.translation(trigger.card) + "额外指定一个目标", (card, player, target) => {
							const evt = get.event().getTrigger();
							return target != player && !evt.targets.includes(target) && lib.filter.targetEnabled2(evt.card, player, target) && lib.filter.targetInRange(evt.card, player, target);
						})
						.set("ai", target => get.effect(target, _status.event.getTrigger().card, _status.event.player))
						.forResult();
				},
				content() {
					trigger.targets.addArray(event.targets);
				},
			},
			damage: {
				trigger: { source: "damageBegin1" },
				filter(event, player) {
					const evt = event.getParent(2);
					return evt.name == "useCard" && evt.skill == "dragjunshen";
				},
				logTarget: "player",
				prompt2(event, player) {
					return "令" + get.translation(event.player) + "选择弃置装备区所有牌或令此伤害+1";
				},
				async content(event, trigger, player) {
					const target = trigger.player;
					let result;
					if (!target.countDiscardableCards(target, "e")) result = { index: 1 };
					else
						result = await target
							.chooseControl()
							.set("choiceList", ["弃置装备区所有牌", "令此伤害+1"])
							.set("ai", () => {
								const player = get.event("player"),
									trigger = get.event().getTrigger();
								if (
									player.getHp() <= 2 ||
									player.getDiscardableCards(player, "e").reduce((sum, card) => {
										return sum + get.value(card, player);
									}, 0) < 7
								)
									return 0;
								return 1;
							})
							.forResult();
					if (result.index == 0) {
						await target.discard(target.getDiscardableCards(target, "e"));
					} else trigger.increase("num");
				},
			},
		},
	},
	//龙曹仁
	draglizhong: {
		trigger: { player: "phaseJieshuBegin" },
		async cost(event, trigger, player) {
			let choiceList = ["将任意张装备牌至于任意名角色的装备区", "令你或任意名装备区里有牌的角色摸一张牌"],
				choices = ["置入装备", "团体摸牌", "cancel2"];
			if (
				!player.countCards("he", card => {
					if (get.type(card) != "equip") return false;
					return game.hasPlayer(target => {
						return target.canEquip(card);
					});
				})
			) {
				choices.shift();
				choiceList[0] = '<span style="opacity:0.5">' + choiceList[0] + "</span>";
			}
			const {
				result: { control },
			} = await player
				.chooseControl(choices)
				.set("prompt", "###" + get.prompt("draglizhong") + "###选择首先执行的一项")
				.set("choiceList", choiceList)
				.set("ai", () => {
					return get.event("controls")[0];
				});
			event.result = { bool: control != "cancel2", cost_data: control };
		},
		async content(event, trigger, player) {
			let choices = ["置入装备", "团体摸牌"],
				used = false;
			if (event.cost_data == "团体摸牌") choices.reverse();
			choices.push(event.cost_data);
			for (let i = 1; i <= 3; i++) {
				if (i == 3 && used) break;
				switch (choices[i - 1]) {
					case "置入装备": {
						while (
							player.hasCard(card => {
								if (get.type(card) != "equip") return false;
								return game.hasPlayer(target => {
									return target.canEquip(card);
								});
							}, "he")
						) {
							const {
								result: { bool, cards, targets },
							} = await player.chooseCardTarget({
								prompt: "厉战：将一张装备牌置于一名角色的装备区",
								filterCard(card) {
									return get.type(card) == "equip";
								},
								position: "he",
								filterTarget(card, player, target) {
									return target.canEquip(card);
								},
								ai1(card) {
									return 6 - get.value(card);
								},
								ai2(target) {
									const player = get.event("player");
									const att = get.attitude(player, target);
									if (att <= 0 || target.countCards("e")) return 0;
									return att * (target == player ? 1 : 3);
								},
							});
							if (bool) {
								if (i == 1 && !used) used = true;
								const card = cards[0],
									target = targets[0];
								player.line(target);
								if (target != player) {
									player.$give(card, target, false);
								}
								await game.delay(0.5);
								await target.equip(card);
							} else break;
						}
						break;
					}
					case "团体摸牌": {
						const { result } = await player
							.chooseTarget(
								"厉战：令你或任意名装备区有牌的角色摸一张牌",
								(card, player, target) => {
									if (target != player && !target.countCards("e")) return false;
									if (ui.selected.targets.length) {
										const choose = ui.selected.targets[0];
										if (choose == player && !player.countCards("e")) return false;
									}
									return true;
								},
								[1, Infinity]
							)
							.set("multitarget", true)
							.set("complexTarget", true)
							.set("ai", target => {
								const player = get.event("player");
								if (!player.countCards("e")) {
									if (
										game.countPlayer(choose => {
											return choose.countCards("e") && get.attitude(player, choose) > 0;
										}) > 1 &&
										target == player
									)
										return 0;
								}
								return get.attitude(player, target);
							});
						if (result.bool) {
							if (i == 1 && !used) used = true;
							const targets = result.targets.sortBySeat();
							player.line(targets);
							choices.addArray(targets);
							for (let j = 0; j < targets.length; j++) {
								await targets[j].draw("nodelay");
							}
							await game.delayx();
						}
						break;
					}
				}
			}
			choices = choices.slice(3);
			if (choices.length) {
				choices.sortBySeat();
				player.line(choices);
				for (const target of choices) {
					target.addTempSkill("draglizhong_effect", "roundStart");
				}
				await game.delayx();
			}
		},
		subSkill: {
			effect: {
				charlotte: true,
				mod: {
					maxHandcard(player, num) {
						return num + 2;
					},
				},
				enable: "chooseToUse",
				filterCard: true,
				position: "e",
				viewAs: { name: "wuxie" },
				filter(event, player) {
					return player.countCards("e") > 0;
				},
				viewAsFilter(player) {
					return player.countCards("e") > 0;
				},
				prompt: "将一张装备区的牌当作【无懈可击】使用",
				check(card) {
					return 8 - get.equipValue(card);
				},
				mark: true,
				marktext: "守",
				intro: { content: "手牌上限+2，可将装备区的牌当作【无懈可击】使用" },
			},
		},
	},
	//撅碎（难视
	dragjuesui: {
		trigger: { global: "dying" },
		filter(event, player) {
			return !player.getStorage("dragjuesui").includes(event.player) && event.player.hasEnabledSlot();
		},
		check(event, player) {
			const target = event.player;
			if (get.attitude(player, target) <= 0) return false;
			return player.countCards("hs", card => player.canSaveCard(card, target)) + target.countCards("hs", card => target.canSaveCard(card, target)) < 1 - target.hp;
		},
		logTarget: "player",
		async content(event, trigger, player) {
			const target = trigger.player;
			player.markAuto("dragjuesui", [target]);
			const {
				result: { bool },
			} = await target.chooseBool("是否将体力值回复至1点并废除装备栏？");
			if (bool) {
				await target.recoverTo(1);
				let disables = [];
				for (let i = 1; i <= 5; i++) {
					for (let j = 0; j < target.countEnabledSlot(i); j++) {
						disables.push(i);
					}
				}
				if (disables.length) await target.disableEquip(disables);
				target.addSkill("dragjuesui_wusheng");
			} else {
				target.chat("拒绝！");
			}
		},
		init(player) {
			if (player.getStorage("dragjuesui").length) {
				player.markSkill("dragjuesui");
			}
		},
		intro: { content: "已对$发动过此技能" },
		subSkill: {
			wusheng: {
				charlotte: true,
				mark: true,
				marktext: "碎",
				intro: { content: "殊死一搏！可将黑色非基本牌当作无次数限制的【杀】使用" },
				mod: {
					cardUsable(card, player, num) {
						if (card.storage && card.storage.dragjuesui) return Infinity;
					},
				},
				enable: ["chooseToUse", "chooseToRespond"],
				filterCard(card, player) {
					return get.color(card) == "black" && get.type(card) != "basic";
				},
				position: "hse",
				viewAs: { name: "sha", storage: { dragjuesui: true } },
				viewAsFilter(player) {
					if (
						!player.countCards("hes", card => {
							return get.color(card) == "black" && get.type(card) != "basic";
						})
					)
						return false;
				},
				prompt: "将一张黑色非基本牌当作无次数限制的【杀】使用或打出",
				check(card) {
					return 7 - get.value(card);
				},
				ai: {
					order(item, player) {
						if (!player || !_status.event.type || _status.event.type != "phase") {
							return 0.1;
						}
						return get.order({ name: "sha" }, player) * 0.99;
					},
					respondSha: true,
					skillTagFilter(player) {
						if (
							!player.countCards("hes", card => {
								return get.color(card) == "black" && get.type(card) != "basic";
							})
						)
							return false;
					},
				},
			},
		},
	},
	//吕常×SP淳于琼√
	dragjuwu: {
		trigger: { target: "shaBefore" },
		filter(event, player) {
			return !game.hasNature(event.card) && game.countPlayer(target => event.player.inRange(target)) >= 3;
		},
		forced: true,
		content() {
			trigger.cancel();
		},
		ai: {
			effect: {
				target_use(card, player, target) {
					if (card.name == "sha" && !game.hasNature(card) && game.countPlayer(targetx => player.inRange(targetx)) >= 3) return "zerotarget";
				},
			},
		},
	},
	dragshouxiang: {
		trigger: { player: "phaseDrawBegin2" },
		filter(event, player) {
			if (!game.hasPlayer(target => target.inRange(player))) return false;
			return !event.numFixed;
		},
		check(event, player) {
			if (player.skipList.includes("phaseUse")) return true;
			return (
				player.countCards("h") +
					event.num +
					Math.min(
						5,
						game.countPlayer(target => {
							return target.inRange(player);
						})
					) -
					game.countPlayer(target => {
						return target != player && get.attitude(player, target) > 0;
					}) <=
				player.getHandcardLimit()
			);
		},
		content() {
			trigger.num += Math.min(
				5,
				game.countPlayer(target => target.inRange(player))
			);
			player.skip("phaseUse");
			player.addTempSkill("dragshouxiang_effect");
		},
		subSkill: {
			effect: {
				charlotte: true,
				trigger: { player: "phaseDiscardBegin" },
				filter(event, player) {
					return game.hasPlayer(target => target.inRange(player));
				},
				forced: true,
				async content(event, trigger, player) {
					const num = Math.min(
						5,
						game.countPlayer(target => target.inRange(player))
					);
					if (num) {
						if (_status.connectMode) game.broadcastAll(() => (_status.noclearcountdown = true));
						let list = [];
						while (
							num - list.length > 0 &&
							player.hasCard(card => {
								return !list.some(list => list[1] == card);
							}, "h") &&
							game.hasPlayer(target => {
								return target != player && !list.some(list => list[0] == target);
							})
						) {
							const {
								result: { bool, targets, cards },
							} = await player
								.chooseCardTarget({
									prompt: "守襄：你可以交给任意名角色各一张手牌",
									prompt2: "（还可分配" + (num - list.length) + "张）",
									position: "h",
									animate: false,
									filterCard(card, player) {
										return !get.event("list").some(list => list[1] == card);
									},
									filterTarget(card, player, target) {
										return target != player && !get.event("list").some(list => list[0] == target);
									},
									ai1(card) {
										if (card.name == "shan") return 1;
										return Math.random();
									},
									ai2(target) {
										return get.attitude(get.event("player"), target);
									},
								})
								.set("list", list);
							if (bool) {
								list.push([targets[0], cards[0]]);
								player.addGaintag(cards, "olsujian_given");
							} else break;
						}
						if (_status.connectMode) {
							game.broadcastAll(() => {
								delete _status.noclearcountdown;
								game.stopCountChoose();
							});
						}
						if (list.length) {
							await game
								.loseAsync({
									gain_list: list,
									player: player,
									cards: list.slice().map(list => list[1]),
									giver: player,
									animate: "giveAuto",
								})
								.setContent("gaincardMultiple");
						}
					}
				},
			},
		},
	},
	//天书乱斗虚拟偶像线下化
	//小杀
	vtbguisha: {
		audio: 1,
		trigger: { global: "useCard" },
		direct: true,
		filter(event, player) {
			return event.player != player && event.card.name == "sha" && player.countCards("he") > 0 && event.player.isPhaseUsing();
		},
		content() {
			"step 0";
			var go = false,
				d1 = false;
			if (get.attitude(player, trigger.player) > 0) {
				for (var target of trigger.targets) {
					if (
						!target.mayHaveShan(
							player,
							"use",
							target.getCards("h", i => {
								return i.hasGaintag("sha_notshan");
							})
						) ||
						trigger.player.hasSkillTag(
							"directHit_ai",
							true,
							{
								target: target,
								card: trigger.card,
							},
							true
						)
					) {
						if (
							get.attitude(player, target) < 0 &&
							!trigger.player.hasSkillTag("jueqing", false, target) &&
							!target.hasSkillTag("filterDamage", null, {
								player: trigger.player,
								card: trigger.card,
							})
						) {
							d1 = true;
							break;
						}
					}
				}
				if (trigger.addCount === false || !trigger.player.isPhaseUsing()) go = false;
				else if (!trigger.player.hasSkill("paoxiao") && !trigger.player.hasSkill("tanlin3") && !trigger.player.hasSkill("zhaxiang2") && !trigger.player.hasSkill("fengnu") && !trigger.player.getEquip("zhuge")) {
					var nh = trigger.player.countCards("h");
					if (player == trigger.player) {
						go = player.countCards("h", "sha") > 0;
					} else if (nh >= 4) {
						go = true;
					} else if (player.countCards("h", "sha")) {
						if (nh == 3) {
							go = Math.random() < 0.8;
						} else if (nh == 2) {
							go = Math.random() < 0.5;
						}
					} else if (nh >= 3) {
						if (nh == 3) {
							go = Math.random() < 0.5;
						} else if (nh == 2) {
							go = Math.random() < 0.2;
						}
					}
				}
			}
			go = go * Math.random() + d1 * Math.random() > 0.4;
			//AI停顿
			if (
				go &&
				!event.isMine() &&
				!event.isOnline() &&
				player.hasCard(function (card) {
					return get.value(card) < 6 && lib.filter.cardDiscardable(card, player, event.name);
				}, "he")
			) {
				game.delayx();
			}
			var next = player.chooseToDiscard(get.prompt("vtbguisha"), "弃置一张牌，令" + get.translation(trigger.player) + "本次使用的【杀】不计入使用次数，且对" + get.translation(trigger.targets) + "造成的伤害+1", "he");
			next.logSkill = ["vtbguisha", trigger.player];
			next.set("ai", function (card) {
				if (_status.event.go) {
					return 6 - get.value(card);
				}
				return 0;
			});
			next.set("go", go);
			"step 1";
			if (result.bool) {
				if (trigger.addCount !== false) {
					trigger.addCount = false;
					trigger.player.getStat().card.sha--;
				}
				trigger.player.addTempSkill("vtbguisha_bonus");
				if (!trigger.card.storage) trigger.card.storage = {};
				trigger.card.storage.vtbguisha_targets = trigger.targets;
			}
		},
		ai: {
			expose: 0.2,
		},
		subSkill: {
			bonus: {
				trigger: {
					source: "damageBegin1",
				},
				forced: true,
				charlotte: true,
				onremove: true,
				filter(event, player) {
					return event.card && event.card.name == "sha" && event.card.storage && event.card.storage.vtbguisha_targets && event.card.storage.vtbguisha_targets.includes(event.player);
				},
				content() {
					trigger.num++;
				},
			},
		},
	},
	vtbshuli: {
		audio: 1,
		trigger: {
			global: "damageSource",
		},
		usable: 2,
		filter(event, player) {
			return event.source && event.source != player && event.card && event.card.name == "sha" && event.source.isIn();
		},
		logTarget: "source",
		check(event, player) {
			return get.attitude(player, event.source) >= 0 || (get.attitude(player, event.source) >= -4 && get.distance(_status.currentPhase, player, "absolute") > get.distance(_status.currentPhase, event.source, "absolute"));
		},
		content() {
			"step 0";
			var drawers = [trigger.source, player].sortBySeat(_status.currentPhase);
			game.asyncDraw(drawers);
		},
	},
	//小闪
	vtbshanwu: {
		audio: 1,
		trigger: {
			global: "useCardToTarget",
		},
		filter(event, player) {
			return (
				event.card.name == "sha" &&
				event.target != player &&
				event.isFirstTarget &&
				player.hasCard(card => {
					return get.name(card) == "shan" || _status.connectMode;
				})
			);
		},
		direct: true,
		content() {
			"step 0";
			player
				.chooseToDiscard(get.prompt("vtbshanwu"), "弃置一张【闪】，取消此【杀】对" + get.translation(trigger.targets) + "的目标", { name: "shan" })
				.set("logSkill", "vtbshanwu")
				.set("ai", card => {
					if (_status.event.goon) return 6 - get.value(card);
					return 0;
				})
				.set(
					"goon",
					(function () {
						var effect = 0;
						for (var target of trigger.targets) {
							var eff = get.effect(target, trigger.card, trigger.player, player);
							if (
								!target.mayHaveShan(
									player,
									"use",
									target.getCards("h", i => {
										return i.hasGaintag("sha_notshan");
									})
								) ||
								trigger.player.hasSkillTag(
									"directHit_ai",
									true,
									{
										target: target,
										card: trigger.card,
									},
									true
								)
							) {
								eff *= 1.25;
							}
							if (target.hp <= 2) eff *= 1.1;
							effect += eff;
						}
						return effect < 0;
					})()
				);
			"step 1";
			if (result.bool) {
				game.log(player, "取消了", trigger.card, "的所有目标");
				trigger.targets.length = 0;
				trigger.getParent().triggeredTargets2.length = 0;
				trigger.untrigger();
			}
		},
		ai: {
			expose: 0.2,
		},
	},
	vtbxianli: {
		audio: 1,
		trigger: {
			player: "loseAfter",
			global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"],
		},
		usable: 2,
		filter(event, player) {
			if (!_status.currentPhase || !_status.currentPhase.isIn() || !_status.currentPhase.countGainableCards(player, "he")) return false;
			var evt = event.getl(player);
			return (
				evt &&
				evt.cards2 &&
				evt.cards2.some(card => {
					return get.name(card, false) == "shan";
				})
			);
		},
		check(event, player) {
			return get.effect(_status.currentPhase, { name: "shunshou_copy2" }, player, player) > 0;
		},
		prompt2(event, player) {
			return "获得" + get.translation(_status.currentPhase) + "的一张牌";
		},
		logTarget: () => _status.currentPhase,
		content() {
			"step 0";
			player.gainPlayerCard(_status.currentPhase, "he", true);
		},
		ai: {
			expose: 0.15,
		},
	},
	//小桃
	vtbtaoyan: {
		audio: 1,
		trigger: {
			player: "phaseBegin",
		},
		direct: true,
		content() {
			"step 0";
			if (!_status.vtbtaoyan_count) {
				_status.vtbtaoyan_count = 6;
			}
			player.chooseTarget(get.prompt("vtbtaoyan"), "令一或两名其他角色摸一张牌并从游戏外获得一张【桃】指示物", lib.filter.notMe, [1, 2]).set("ai", target => {
				var player = _status.event.player;
				return get.recoverEffect(target, player, player) / 2 + get.attitude(player, target);
			});
			"step 1";
			if (result.bool) {
				var targets = result.targets.slice();
				targets.sortBySeat();
				player.logSkill("vtbtaoyan", targets);
				game.broadcastAll(function () {
					if (!lib.inpile.includes("tao")) {
						lib.inpile.add("tao");
					}
				});
				player.addSkill("vtbtaoyan_remove");
				for (var target of targets) {
					target.draw();
					if (!_status.vtbtaoyan_count) continue;
					if (!_status.vtbtaoyan_cards) _status.vtbtaoyan_cards = [];
					_status.vtbtaoyan_count--;
					var card = game.createCard("tao");
					_status.vtbtaoyan_cards.push(card.cardid);
					target.gain(card, "gain2");
				}
			}
		},
		ai: {
			expose: 0.3,
			threaten: 3.2,
		},
		subSkill: {
			remove: {
				trigger: {
					global: ["loseAfter", "loseAsyncAfter", "cardsDiscardAfter", "equipAfter"],
				},
				forced: true,
				charlotte: true,
				popup: false,
				firstDo: true,
				forceDie: true,
				filter(event, player) {
					if (typeof _status.vtbtaoyan_count != "number") return false;
					var cards = event.getd();
					return cards.some(card => {
						return _status.vtbtaoyan_cards.includes(card.cardid);
					});
				},
				content() {
					var cards = trigger.getd(),
						remove = [];
					for (var card of cards) {
						if (_status.vtbtaoyan_cards.includes(card.cardid)) {
							_status.vtbtaoyan_cards.remove(card.cardid);
							remove.push(card);
						}
					}
					if (remove.length) {
						remove.forEach(i => {
							i.remove();
							_status.vtbtaoyan_count++;
						});
						game.log(remove, "被移出了游戏");
					}
				},
			},
		},
	},
	vtbyanli: {
		audio: 1,
		trigger: {
			global: "dying",
		},
		filter(event, player) {
			if (player.hasSkill("vtbyanli_used")) return false;
			if (_status.currentPhase == player) return false;
			return event.player.hp <= 0;
		},
		check(event, player) {
			return get.recoverEffect(event.player, player, player) > 0;
		},
		logTarget: "player",
		content() {
			"step 0";
			player.addTempSkill("vtbyanli_used", "roundStart");
			trigger.player.recover(1 - trigger.player.hp);
			trigger.player.draw();
		},
		subSkill: {
			used: {
				charlotte: true,
			},
		},
	},
	//小乐
	vtbleyu: {
		audio: 1,
		trigger: {
			global: "phaseBegin",
		},
		direct: true,
		filter(event, player) {
			return player.countCards("he") >= 3;
		},
		content() {
			"step 0";
			player
				.chooseToDiscard(get.prompt2("vtbleyu", trigger.player), 3, "he")
				.set("ai", card => {
					if (ui.selected.cards.length == 2) return 10 - get.value(card);
					if (_status.event.effect > 0) {
						return 6 - get.value(card);
					}
					return 0;
				})
				.set("effect", trigger.player.hasJudge("lebu") ? 0 : get.effect(trigger.player, { name: "lebu" }, player, player))
				.set("logSkill", ["vtbleyu", trigger.player]);
			"step 1";
			if (result.bool) {
				trigger.player.judge(lib.card.lebu.judge).judge2 = lib.card.lebu.judge2;
			} else event.finish();
			"step 2";
			if (!result.bool) {
				trigger.player.skip("phaseUse");
			}
		},
		ai: {
			expose: 0.3,
			threaten: 2.9,
		},
	},
	vtbyuanli: {
		audio: 1,
		trigger: { global: ["phaseUseSkipped", "phaseUseCancelled"] },
		direct: true,
		content() {
			"step 0";
			player.chooseTarget(get.prompt2("vtbyuanli"), lib.filter.notMe).set("ai", target => get.attitude(_status.event.player, target) + 1);
			"step 1";
			if (result.bool) {
				player.logSkill("vtbyuanli", result.targets[0]);
				game.asyncDraw([player, result.targets[0]].sortBySeat(_status.currentPhase));
			}
		},
		ai: {
			expose: 0.1,
		},
	},
	vtbmeiniang: {
		audio: 1,
		trigger: { global: "phaseUseBegin" },
		filter(event, player) {
			return event.player != player;
		},
		check(event, player) {
			return get.attitude(player, event.player) > 0 && event.player.getUseValue("jiu") >= 0;
		},
		logTarget: "player",
		content() {
			trigger.player.chooseUseTarget("jiu", true, false);
		},
	},
	vtbyaoli: {
		audio: 1,
		trigger: { global: "useCardAfter" },
		filter(event, player) {
			return event.card.name == "jiu" && event.player != player && event.player.isPhaseUsing();
		},
		logTarget: "player",
		check(event, player) {
			return get.attitude(player, event.player) > 0;
		},
		content() {
			trigger.player.addTempSkill("vtbyaoli_effect");
			trigger.player.addMark("vtbyaoli_effect", 1, false);
		},
		ai: {
			expose: 0.15,
		},
		subSkill: {
			effect: {
				audio: "vtbyaoli",
				charlotte: true,
				trigger: { player: "useCard2" },
				forced: true,
				onremove: true,
				nopop: true,
				filter(event, player) {
					return event.card.name == "sha" && player.countMark("vtbyaoli_effect") > 0;
				},
				content() {
					"step 0";
					player.removeSkill("vtbyaoli_effect");
					trigger.directHit.addArray(game.filterPlayer());
					var num = player.countMark("vtbyaoli_effect");
					if (
						!game.hasPlayer(current => {
							return !trigger.targets.includes(current) && lib.filter.targetEnabled2(trigger.card, player, current);
						})
					)
						event.finish();
					else
						player
							.chooseTarget("媱丽：是否为" + get.translation(trigger.card) + "额外指定" + (num > 1 ? "至多" : "") + get.cnNumber(num) + "个目标？", num == 1 ? 1 : [1, num], (card, player, target) => {
								return !_status.event.sourcex.includes(target) && player.canUse(_status.event.card, target);
							})
							.set("sourcex", trigger.targets)
							.set("ai", target => {
								var player = _status.event.player;
								return get.effect(target, _status.event.card, player, player);
							})
							.set("card", trigger.card);
					"step 1";
					if (result.bool) {
						if (!event.isMine() && !event.isOnline()) game.delayx();
						event.targets = result.targets;
					} else {
						event.finish();
					}
					"step 2";
					player.logSkill("vtbyaoli_effect", event.targets);
					trigger.targets.addArray(event.targets);
				},
				marktext: "媱",
				intro: {
					content: "下一张【杀】不可被响应且可以额外指定&个目标",
				},
				ai: {
					directHit_ai: true,
					skillTagFilter(player, tag, arg) {
						return arg.card.name == "sha";
					},
				},
			},
		},
	},
	//官盗S特015神马超
	psshouli: {
		audio: "shouli",
		enable: ["chooseToUse", "chooseToRespond"],
		hiddenCard(player, name) {
			if (player != _status.currentPhase && (name == "sha" || name == "shan")) return true;
		},
		filter(event, player) {
			if (event.responded || event.psshouli || event.type == "wuxie") return false;
			if (
				game.hasPlayer(function (current) {
					return current.getEquips(4).length > 0;
				}) &&
				event.filterCard(
					get.autoViewAs(
						{
							name: "sha",
							storage: { psshouli: true },
						},
						"unsure"
					),
					player,
					event
				)
			)
				return true;
			if (
				game.hasPlayer(function (current) {
					return current.getEquips(3).length > 0;
				}) &&
				event.filterCard(
					get.autoViewAs(
						{
							name: "shan",
							storage: { psshouli: true },
						},
						"unsure"
					),
					player,
					event
				)
			)
				return true;
			return false;
		},
		delay: false,
		locked: true,
		filterTarget(card, player, target) {
			var event = _status.event,
				evt = event;
			if (event._backup) evt = event._backup;
			var equip3 = target.getCards("e", card => get.is.defendingMount(card, false));
			var equip4 = target.getCards("e", card => get.is.attackingMount(card, false));
			if (
				equip3.length &&
				equip3.some(card =>
					evt.filterCard(
						get.autoViewAs(
							{
								name: "shan",
								storage: { psshouli: true },
							},
							[card]
						),
						player,
						event
					)
				)
			)
				return true;
			return equip4.some(card => {
				var sha = get.autoViewAs(
					{
						name: "sha",
						storage: { psshouli: true },
					},
					[card]
				);
				if (evt.filterCard(sha, player, event)) {
					if (!evt.filterTarget) return true;
					return game.hasPlayer(function (current) {
						return evt.filterTarget(sha, player, current);
					});
				}
			});
		},
		prompt: "将场上的一张坐骑牌当做【杀】或【闪】使用或打出",
		content() {
			"step 0";
			var evt = event.getParent(2);
			evt.set("psshouli", true);
			var list = [];
			var equip3 = target.getCards("e", card => get.is.defendingMount(card, false));
			var equip4 = target.getCards("e", card => get.is.attackingMount(card, false));
			var backupx = _status.event;
			_status.event = evt;
			try {
				if (
					equip3.length &&
					equip3.some(card => {
						var shan = get.autoViewAs(
							{
								name: "shan",
								storage: { psshouli: true },
							},
							[card]
						);
						if (evt.filterCard(shan, player, event)) return true;
						return false;
					})
				) {
					list.push("shan");
				}
				if (
					equip4.length &&
					equip4.some(card => {
						var sha = get.autoViewAs(
							{
								name: "sha",
								storage: { psshouli: true },
							},
							[card]
						);
						if (
							evt.filterCard(sha, player, evt) &&
							(!evt.filterTarget ||
								game.hasPlayer(function (current) {
									return evt.filterTarget(sha, player, current);
								}))
						)
							return true;
						return false;
					})
				) {
					list.push("sha");
				}
			} catch (e) {
				game.print(e);
			}
			_status.event = backupx;
			if (list.length == 1) {
				event.cardName = list[0];
				var cards = list[0] == "shan" ? equip3 : equip4;
				if (cards.length == 1)
					event._result = {
						bool: true,
						links: [cards[0]],
					};
				else
					player
						.choosePlayerCard(true, target, "e")
						.set("filterButton", function (button) {
							return _status.event.cards.includes(button.link);
						})
						.set("cards", cards);
			} else
				player.choosePlayerCard(true, target, "e").set("filterButton", function (button) {
					var card = button.link;
					return get.is.attackingMount(card) || get.is.defendingMount(card);
				});
			"step 1";
			var evt = event.getParent(2);
			if (result.bool && result.links && result.links.length) {
				var name = event.cardName || (get.is.attackingMount(result.links[0]) ? "sha" : "shan");
				if (evt.name == "chooseToUse") {
					game.broadcastAll(
						function (result, name) {
							lib.skill.psshouli_backup.viewAs = {
								name: name,
								cards: [result],
								storage: { psshouli: true },
							};
							lib.skill.psshouli_backup.prompt = "选择" + get.translation(name) + "（" + get.translation(result) + "）的目标";
						},
						result.links[0],
						name
					);
					evt.set("_backupevent", "psshouli_backup");
					evt.backup("psshouli_backup");
					evt.set("openskilldialog", "选择" + get.translation(name) + "（" + get.translation(result.links[0]) + "）的目标");
					evt.set("norestore", true);
					evt.set("custom", {
						add: {},
						replace: { window() {} },
					});
				} else {
					delete evt.result.skill;
					delete evt.result.used;
					evt.result.card = get.autoViewAs(
						{
							name: name,
							cards: [result.links[0]],
							storage: { psshouli: true },
						},
						result.links
					);
					evt.result.cards = [result.links[0]];
					target.$give(result.links[0], player, false);
					if (player != target) target.addTempSkill("fengyin");
					target.addTempSkill("psshouli_thunder");
					player.addTempSkill("psshouli_thunder");
					evt.redo();
					return;
				}
			}
			evt.goto(0);
		},
		ai: {
			respondSha: true,
			respondShan: true,
			skillTagFilter(player, tag) {
				var func = get.is[tag == "respondSha" ? "attackingMount" : "defendingMount"];
				return game.hasPlayer(function (current) {
					return current.hasCard(card => func(card, false), "e");
				});
			},
			order: 2,
			result: {
				player(player, target) {
					var att = Math.max(8, get.attitude(player, target));
					if (_status.event.type != "phase") return 9 - att;
					if (!player.hasValueTarget({ name: "sha" })) return 0;
					return 9 - att;
				},
			},
		},
		group: "psshouli_init",
		subSkill: {
			thunder: {
				charlotte: true,
				trigger: { player: "damageBegin1" },
				forced: true,
				mark: true,
				content() {
					trigger.num++;
					game.setNature(trigger, "thunder");
				},
				marktext: "⚡",
				intro: {
					content: "受到的伤害+1且改为雷属性",
				},
				ai: {
					effect: {
						target: (card, player, target) => {
							if (!get.tag(card, "damage")) return;
							if (target.hasSkillTag("nodamage") || target.hasSkillTag("nothunder")) return "zeroplayertarget";
							if (
								target.hasSkillTag("filterDamage", null, {
									player: player,
									card: new lib.element.VCard(
										{
											name: card.name,
											nature: "thunder",
										},
										[card]
									),
								})
							)
								return;
							return 2;
						},
					},
				},
			},
			init: {
				audio: "psshouli",
				trigger: {
					global: "phaseBefore",
					player: "enterGame",
				},
				forced: true,
				filter(event, player) {
					return event.name != "phase" || game.phaseNumber == 0;
				},
				logTarget: () => game.filterPlayer(),
				equips: [
					["heart", 5, "chitu"],
					["diamond", 13, "zixin"],
					["spade", 5, "jueying"],
					["diamond", 13, "hualiu"],
					["club", 5, "dilu"],
					["spade", 13, "dawan"],
					["heart", 13, "zhuahuang"],
					["heart", 3, "jingfanma"],
				],
				content() {
					"step 0";
					event.targets = game.filterPlayer().sortBySeat(_status.firstAct2 || game.zhong || game.zhu || _status.firstAct || player);
					event.target = event.targets.shift();
					game.delayx();
					"step 1";
					player.line(target, "green");
					target
						.chooseToUse("狩骊：使用一张坐骑牌并摸一张牌，或使用一张坐骑牌指示物", function (card, player, event) {
							if (get.subtype(card) != "equip3" && get.subtype(card) != "equip4" && get.subtype(card) != "equip6") return false;
							return lib.filter.filterCard.apply(this, arguments);
						})
						.set("ai", () => 1);
					"step 2";
					if (result.bool) target.draw();
					else {
						var cardx = lib.skill.psshouli_init.equips.randomRemove();
						if (!cardx) return;
						cardx = {
							suit: cardx[0],
							number: cardx[1],
							name: cardx[2],
						};
						var card = game.createCard(cardx);
						if (!_status.psshouli_equips) _status.psshouli_equips = [];
						_status.psshouli_equips.push(card.cardid);
						if (card) {
							target.chooseUseTarget(card, true, "nopopup", "noanimate");
							player.addSkill("psshouli_remove");
						}
					}
					"step 3";
					event.target = event.targets.shift();
					if (event.target) {
						event.goto(1);
					}
				},
			},
			remove: {
				trigger: {
					global: ["loseAfter", "loseAsyncAfter", "cardsDiscardAfter", "equipAfter"],
				},
				forced: true,
				charlotte: true,
				popup: false,
				firstDo: true,
				forceDie: true,
				filter(event, player) {
					if (!_status.psshouli_equips || !_status.psshouli_equips.length) return false;
					var cards = event.getd();
					return cards.filter(i => _status.psshouli_equips.includes(i.cardid)).length;
				},
				content() {
					var cards = trigger.getd(),
						remove = [];
					for (var card of cards) {
						if (_status.psshouli_equips.includes(card.cardid)) {
							_status.psshouli_equips.remove(card.cardid);
							remove.push(card);
						}
					}
					if (remove.length) {
						game.cardsGotoSpecial(remove);
						lib.skill.psshouli_init.equips.addArray(remove.map(i => [i.suit, i.number, i.name]));
						game.log("坐骑指示物", remove, "被移出了游戏");
					}
				},
			},
		},
	},
	psshouli_backup: {
		sourceSkill: "psshouli",
		precontent() {
			"step 0";
			delete event.result.skill;
			event.result._apply_args = { throw: false };
			var cards = event.result.card.cards;
			event.result.cards = cards;
			var owner = get.owner(cards[0]);
			event.target = owner;
			owner.$throw(cards[0]);
			player.popup(event.result.card.name, "metal");
			game.delayx();
			event.getParent().addCount = false;
			"step 1";
			if (player != target) target.addTempSkill("fengyin");
			target.addTempSkill("psshouli_thunder");
			player.addTempSkill("psshouli_thunder");
		},
		filterCard() {
			return false;
		},
		prompt: "请选择【杀】的目标",
		selectCard: -1,
	},
	pshengwu: {
		audio: "hengwu",
		mod: {
			aiOrder: (player, card, num) => {
				if (num > 0 && get.tag(card, "draw") && ui.cardPile.childNodes.length + ui.discardPile.childNodes.length < 20) return 0;
			},
			aiValue: (player, card, num) => {
				if (num > 0 && card.name === "zhuge") return 20;
			},
			aiUseful: (player, card, num) => {
				if (num > 0 && card.name === "zhuge") return 10;
			},
		},
		trigger: { player: ["useCard", "respond"] },
		direct: true,
		locked: false,
		filter(event, player) {
			return game.hasPlayer(i => i.countCards("ej", cardx => get.type(cardx) == "equip" && get.suit(event.card) == get.suit(cardx)));
		},
		content() {
			"step 0";
			var suit = get.suit(trigger.card),
				extra = game
					.filterPlayer()
					.map(i =>
						i.countCards("ej", cardx => {
							return get.type(cardx) == "equip" && get.suit(trigger.card) == get.suit(cardx);
						})
					)
					.reduce((p, c) => p + c);
			var prompt2 = "弃置任意张" + get.translation(suit) + "手牌，然后摸X张牌（X为你弃置的牌数+" + extra + "）";
			player
				.chooseToDiscard("h", [1, player.countCards("h", { suit: suit })], { suit: suit })
				.set("prompt", get.prompt("pshengwu"))
				.set("prompt2", prompt2)
				.set("ai", card => {
					if (_status.event.tie) return 0;
					let player = _status.event.player;
					if (_status.event.goon) return 12 - get.value(card);
					if (player == _status.currentPhase) {
						if (["shan", "caochuan", "tao", "wuxie"].includes(card.name)) return 8 - get.value(card);
						return 6 - get.value(card);
					}
					return 5.5 - get.value(card);
				})
				.set("goon", player.countCards("h", { suit: suit }) == 1)
				.set("tie", extra > ui.cardPile.childNodes.length + ui.discardPile.childNodes.length)
				.set("logSkill", "pshengwu");
			"step 1";
			if (result.bool) {
				var num = result.cards.length;
				player.draw(
					num +
						game
							.filterPlayer()
							.map(i => i.countCards("ej", cardx => get.type(cardx) == "equip" && get.suit(trigger.card) == get.suit(cardx)))
							.reduce((p, c) => p + c)
				);
			}
		},
		ai: {
			threaten: 100,
			reverseEquip: true,
			effect: {
				player_use(card, player, target) {
					if (typeof card !== "object") return;
					let suit = get.suit(card);
					if (
						!lib.suit.includes(suit) ||
						player.hasCard(function (i) {
							return get.suit(i, player) == suit;
						}, "h")
					)
						return;
					return [
						1,
						game.countPlayer(current => {
							return current.countCards("e", card => {
								return get.suit(card, current) == suit;
							});
						}),
					];
				},
				target(card, player, target) {
					if (
						card.name === "sha" &&
						!player.hasSkillTag(
							"directHit_ai",
							true,
							{
								target: target,
								card: card,
							},
							true
						) &&
						game.hasPlayer(current => {
							return current.hasCard(cardx => {
								return get.subtype(cardx) === "equip3";
							}, "e");
						})
					)
						return [0, -0.5];
				},
			},
		},
	},
	//战役篇田丰
	gzsuishi: {
		audio: "suishi",
		preHidden: ["gzsuishi2"],
		trigger: { global: "dying" },
		forced: true,
		logAudio: () => 1,
		filter(event, player) {
			return event.player != player && event.parent.name == "damage" && event.parent.source && event.parent.source.group == player.group;
		},
		content() {
			player.draw();
		},
		ai: {
			halfneg: true,
		},
		group: "gzsuishi2",
	},
	gzsuishi2: {
		audio: "suishi",
		trigger: { global: "dieAfter" },
		forced: true,
		sourceSkill: "gzsuishi",
		logAudio: () => 2,
		filter(event, player) {
			return event.player.group == player.group;
		},
		content() {
			player.loseHp();
		},
	},
	//战役篇孔融
	zymingshi: {
		audio: "mingshi",
		forced: true,
		trigger: { target: "useCardToBefore" },
		priority: 15,
		filter(event, player) {
			if (!player.hasEmptySlot(2)) return false;
			if (event.card.name != "sha") return false;
			return game.hasNature(event.card);
		},
		content() {
			trigger.cancel();
		},
		ai: {
			effect: {
				target(card, player, target) {
					if (card.name === "sha" && game.hasNature(card) && target.hasEmptySlot(2)) return "zeroplayertarget";
					if (get.subtype(card) == "equip2" && target.isEmpty(2)) return [0.6, -0.8];
				},
			},
		},
	},
	//战役篇蒋钦
	zyshangyi: {
		audio: "shangyi",
		enable: "phaseUse",
		usable: 1,
		filterTarget(card, player, target) {
			return player != target;
		},
		content() {
			"step 0";
			target.viewHandcards(player);
			"step 1";
			if (!target.countCards("h")) event.finish();
			else player.chooseCardButton(target, target.getCards("h"));
			"step 2";
			if (result.bool) {
				target.discard(result.links[0]);
			}
		},
		ai: {
			order: 11,
			result: {
				target(player, target) {
					return -target.countCards("h");
				},
			},
			threaten: 1.1,
		},
	},
	//官盗K系列杜预
	pkwuku: {
		audio: "spwuku",
		trigger: { global: "useCard" },
		forced: true,
		preHidden: true,
		filter(event, player) {
			if (get.type(event.card) != "equip") return false;
			return player.countMark("pkwuku") < 3;
		},
		content() {
			player.addMark("pkwuku", 1);
		},
		marktext: "库",
		intro: {
			content: "mark",
		},
		ai: {
			combo: "pkmiewu",
			threaten: 3.6,
		},
	},
	pksanchen: {
		audio: "spsanchen",
		trigger: { player: "phaseJieshuBegin" },
		forced: true,
		juexingji: true,
		skillAnimation: true,
		animationColor: "gray",
		filter(event, player) {
			return player.countMark("pkwuku") > 2;
		},
		content() {
			player.awakenSkill("pksanchen");
			player.gainMaxHp();
			player.recover();
			player.addSkills("pkmiewu");
		},
		ai: {
			combo: "pkwuku",
		},
		derivation: "pkmiewu",
	},
	pkmiewu: {
		audio: "spmiewu",
		enable: ["chooseToUse", "chooseToRespond"],
		filter(event, player) {
			if (!player.countMark("pkwuku") || player.hasSkill("pkmiewu2")) return false;
			for (var i of lib.inpile) {
				var type = get.type(i);
				if ((type == "basic" || type == "trick") && event.filterCard(get.autoViewAs({ name: i }, "unsure"), player, event)) return true;
			}
			return false;
		},
		chooseButton: {
			dialog(event, player) {
				var list = [];
				for (var i = 0; i < lib.inpile.length; i++) {
					var name = lib.inpile[i];
					if (name == "sha") {
						if (event.filterCard(get.autoViewAs({ name }, "unsure"), player, event)) list.push(["基本", "", "sha"]);
						for (var nature of lib.inpile_nature) {
							if (event.filterCard(get.autoViewAs({ name, nature }, "unsure"), player, event)) list.push(["基本", "", "sha", nature]);
						}
					} else if (get.type(name) == "trick" && event.filterCard(get.autoViewAs({ name }, "unsure"), player, event)) list.push(["锦囊", "", name]);
					else if (get.type(name) == "basic" && event.filterCard(get.autoViewAs({ name }, "unsure"), player, event)) list.push(["基本", "", name]);
				}
				return ui.create.dialog("灭吴", [list, "vcard"]);
			},
			//これ  要らない（そよりん声线）
			//filter:function(button,player){
			//	return _status.event.getParent().filterCard({name:button.link[2]},player,_status.event.getParent());
			//},
			check(button) {
				if (_status.event.getParent().type != "phase") return 1;
				var player = _status.event.player;
				if (["wugu", "zhulu_card", "yiyi", "lulitongxin", "lianjunshengyan", "diaohulishan"].includes(button.link[2])) return 0;
				return player.getUseValue({
					name: button.link[2],
					nature: button.link[3],
				});
			},
			backup(links, player) {
				return {
					audio: "spmiewu",
					filterCard: () => false,
					selectCard: -1,
					popname: true,
					viewAs: { name: links[0][2], nature: links[0][3] },
					precontent() {
						player.addTempSkill("pkmiewu2");
						player.removeMark("pkwuku", 1);
					},
				};
			},
			prompt(links, player) {
				return "视为使用" + (get.translation(links[0][3]) || "") + get.translation(links[0][2]) + "并摸一张牌";
			},
		},
		hiddenCard(player, name) {
			if (!lib.inpile.includes(name)) return false;
			var type = get.type(name);
			return (type == "basic" || type == "trick") && player.countMark("pkwuku") > 0 && !player.hasSkill("pkmiewu2");
		},
		ai: {
			combo: "pkwuku",
			fireAttack: true,
			respondSha: true,
			respondShan: true,
			skillTagFilter(player) {
				if (!player.countMark("pkwuku") || player.hasSkill("pkmiewu2")) return false;
			},
			order: 1,
			result: {
				player(player) {
					if (_status.event.dying) return get.attitude(player, _status.event.dying);
					return 1;
				},
			},
		},
	},
	pkmiewu2: {
		trigger: { player: ["useCardAfter", "respondAfter"] },
		forced: true,
		charlotte: true,
		popup: false,
		sourceSkill: "pkmiewu",
		filter(event, player) {
			return event.skill == "pkmiewu_backup";
		},
		content() {
			player.draw();
		},
	},
	pkmiewu_backup: { audio: "pkmiewu" },
	//官盗S系列关羽
	pszhonghun: {
		audio: "zhongyi",
		trigger: { player: ["useCard", "respond"] },
		filter(event, player) {
			return get.color(event.card) == "red";
		},
		frequent: true,
		content() {
			"step 0";
			var card = game.cardsGotoOrdering(get.cards()).cards[0];
			event.card = card;
			game.updateRoundNumber();
			player.showCards(card, get.translation(player) + "发动了【忠魂】");
			"step 1";
			if (get.color(card) == "red") player.gain(card, "gain2");
		},
	},
	//官盗S系列郭嘉·一版
	psqizuo: {
		audio: 2,
		trigger: { global: ["damageBegin1", "damageBegin3"] },
		filter(event, player, name) {
			return (name == "damageBegin1" && event.source && event.source.isIn() && player.inRange(event.source)) || (name == "damageBegin3" && event.player && event.player.isIn() && player.inRange(event.player));
		},
		direct: true,
		content() {
			"step 0";
			var name = event.triggername;
			var source = get.translation(trigger.source),
				target = get.translation(trigger.player),
				num = trigger.num;
			var targetx = trigger[name == "damageBegin1" ? "source" : "player"];
			var str = name == "damageBegin1" ? source + "即将对" + target + "造成" + num + "点伤害" : target + "即将受到" + source + "造成的" + num + "点伤害";
			player
				.chooseToDiscard(get.prompt("psqizuo", targetx), str + "，是否弃置一张牌并判定，若结果颜色与此牌相同，你可以令此伤害+1或-1？", "he")
				.set("ai", card => {
					if (_status.event.goon) return 5.25 - get.value(card) + (get.color(card) == get.color(_status.pileTop) ? 0.75 : 0);
					return 0;
				})
				.set(
					"goon",
					(function () {
						var eff = get.damageEffect(trigger.player, trigger.source, player);
						if (
							eff > 5 &&
							!trigger.player.hasSkillTag("filterDamage", null, {
								player: player,
								card: trigger.card,
							})
						)
							return true;
						if (eff < -5) return true;
						return false;
					})()
				)
				.set("logSkill", ["psqizuo", targetx]);
			"step 1";
			if (result.bool) {
				event.color = get.color(result.cards[0], player);
				player.judge(function (card) {
					if (get.color(card) == _status.event.getParent("psqizuo").color) return 1;
					return 0;
				});
			} else event.finish();
			"step 2";
			if (result.bool) {
				player
					.chooseControl("+1", "-1", "cancel2")
					.set("prompt", "是否令此伤害+1或-1？")
					.set("ai", () => {
						if (_status.event.eff < 0) return 1;
						return 0;
					})
					.set("eff", get.damageEffect(trigger.player, trigger.source, player));
			} else event.finish();
			"step 3";
			if (result.index == 0) {
				trigger.num++;
				player.popup(" +1 ", "fire");
				game.log(player, "令此伤害+1");
			}
			if (result.index == 1) {
				trigger.num--;
				player.popup(" -1 ", "water");
				game.log(player, "令此伤害-1");
			}
		},
		ai: {
			threaten: 0.8,
		},
	},
	//官盗S系列郭嘉·二版
	psquanmou: {
		audio: 2,
		trigger: {
			global: "useCardAfter",
		},
		direct: true,
		filter(event, player) {
			return get.type2(event.card) == "trick" && event.player != player && event.targets && event.targets.includes(player) && event.cards.filterInD("odj").length && player.countCards("h");
		},
		content() {
			"step 0";
			player
				.chooseToDiscard(get.prompt("psquanmou"), "弃置一张" + get.translation(get.color(trigger.card)) + "手牌，获得" + get.translation(trigger.cards), "h", (card, player) => {
					return get.color(card) == _status.event.color;
				})
				.set("ai", card => {
					return _status.event.value - get.value(card);
				})
				.set("logSkill", "psquanmou")
				.set("value", get.value(trigger.cards, player))
				.set("color", get.color(trigger.card));
			"step 1";
			if (result.bool) {
				var cards = trigger.cards.filterInD("odj");
				if (cards.filterInD("od").length) player.gain(cards.filterInD("od"), "gain2");
				if (cards.filterInD("j").length) player.gain(cards.filterInD("j"), get.owner(cards.filterInD("j")[0]), "give");
			}
		},
	},
	//官盗S赵云·一版
	pshuiqiang: {
		audio: 2,
		trigger: { player: ["shaMiss", "eventNeutralized"] },
		direct: true,
		filter(event, player) {
			if (!event.card || event.card.name != "sha") return false;
			return event.target.isIn() && player.canUse("sha", event.target, false) && (player.hasSha() || (_status.connectMode && player.countCards("h")));
		},
		content() {
			"step 0";
			player
				.chooseToUse(
					get.prompt2("pshuiqiang", trigger.target),
					function (card, player, event) {
						if (get.name(card) != "sha") return false;
						return lib.filter.filterCard.apply(this, arguments);
					},
					trigger.target,
					-1
				)
				.set("addCount", false).logSkill = "pshuiqiang";
		},
	},
	pshuntu: {
		audio: 2,
		trigger: { source: "damageSource" },
		usable: 1,
		filter(event, player) {
			return event.card && event.card.name == "sha" && event.getParent(2).player == player && event.notLink() && player.isPhaseUsing();
		},
		direct: true,
		content() {
			"step 0";
			player
				.chooseToUse(
					get.prompt2("pshuntu", trigger.player),
					function (card, player, event) {
						if (get.name(card) != "sha") return false;
						return lib.filter.filterCard.apply(this, arguments);
					},
					trigger.player,
					-1
				)
				.set("addCount", false).logSkill = "pshuntu";
			"step 1";
			if (!result.bool) player.storage.counttrigger.pshuntu--;
		},
	},
	//官盗S赵云·二版
	psqijin: {
		audio: 2,
		trigger: { player: "phaseDrawBegin1" },
		filter(event, player) {
			return !event.numFixed;
		},
		content() {
			"step 0";
			trigger.changeToZero();
			event.cards = get.cards(7);
			game.cardsGotoOrdering(event.cards);
			event.videoId = lib.status.videoId++;
			game.broadcastAll(
				function (player, id, cards) {
					var str = "七进";
					if (player == game.me && !_status.auto) str += "：获得一种颜色的所有牌";
					var dialog = ui.create.dialog(str, cards);
					dialog.videoId = id;
				},
				player,
				event.videoId,
				event.cards
			);
			event.time = get.utc();
			game.addVideo("showCards", player, ["七进", get.cardsInfo(event.cards)]);
			game.addVideo("delay", null, 2);
			"step 1";
			var list = [];
			for (var i of cards) list.add(get.color(i, false));
			list.sort();
			var next = player.chooseControl(list);
			next.set("ai", function () {
				return _status.event.choice;
			}).set(
				"choice",
				(function () {
					if (list.length == 0) return list[0];
					var color = list[0];
					var cards1 = cards.filter(i => get.color(i) == color),
						cards2 = cards.filter(i => get.color(i) == list[1]);
					if (get.value(cards1) * cards1.length > get.value(cards2) * cards2.length) return list[0];
					return list[1];
				})()
			);
			"step 2";
			event.color = result.control;
			var time = 1000 - (get.utc() - event.time);
			if (time > 0) game.delay(0, time);
			"step 3";
			game.broadcastAll("closeDialog", event.videoId);
			player.gain(
				cards.filter(i => get.color(i, false) == event.color),
				"gain2"
			);
		},
		ai: {
			threaten: 1.5,
		},
	},
	psqichu: {
		audio: 2,
		enable: ["chooseToUse", "chooseToRespond"],
		hiddenCard(player, name) {
			if (player != _status.currentPhase && !player.hasSkill("psqichu_used") && get.type(name) == "basic" && lib.inpile.includes(name)) return true;
		},
		filter(event, player) {
			if (event.responded || player == _status.currentPhase || player.hasSkill("psqichu_used")) return false;
			for (var i of lib.inpile) {
				if (get.type(i) == "basic" && event.filterCard({ name: i }, player, event)) return true;
			}
			return false;
		},
		delay: false,
		content() {
			"step 0";
			player.addTempSkill("psqichu_used");
			var evt = event.getParent(2);
			var cards = get.cards(2);
			for (var i = cards.length - 1; i >= 0; i--) {
				ui.cardPile.insertBefore(cards[i].fix(), ui.cardPile.firstChild);
			}
			var aozhan = player.hasSkill("aozhan");
			player
				.chooseButton(["七出：选择要" + (evt.name == "chooseToUse" ? "使用" : "打出") + "的牌", cards])
				.set("filterButton", function (button) {
					return _status.event.cards.includes(button.link);
				})
				.set(
					"cards",
					cards.filter(function (card) {
						if (get.type(card) != "basic") return false;
						if (aozhan && card.name == "tao") {
							return (
								evt.filterCard(
									{
										name: "sha",
										isCard: true,
										cards: [card],
									},
									evt.player,
									evt
								) ||
								evt.filterCard(
									{
										name: "shan",
										isCard: true,
										cards: [card],
									},
									evt.player,
									evt
								)
							);
						}
						return evt.filterCard(card, evt.player, evt);
					})
				)
				.set("ai", function (button) {
					var evt = _status.event.getParent(3);
					if (evt && evt.ai) {
						var tmp = _status.event;
						_status.event = evt;
						var result = (evt.ai || event.ai1)(button.link, _status.event.player, evt);
						_status.event = tmp;
						return result;
					}
					return 1;
				});
			"step 1";
			var evt = event.getParent(2);
			if (result.bool && result.links && result.links.length) {
				var name = result.links[0].name,
					aozhan = player.hasSkill("aozhan") && name == "tao";
				if (aozhan) {
					name = evt.filterCard(
						{
							name: "sha",
							isCard: true,
							cards: [card],
						},
						evt.player,
						evt
					)
						? "sha"
						: "shan";
				}
				if (evt.name == "chooseToUse") {
					game.broadcastAll(
						function (result, name) {
							lib.skill.psqichu_backup.viewAs = {
								name: name,
								cards: [result],
								isCard: true,
							};
							lib.skill.psqichu_backup.prompt = "选择" + get.translation(result) + "的目标";
						},
						result.links[0],
						name
					);
					evt.set("_backupevent", "psqichu_backup");
					evt.backup("psqichu_backup");
				} else {
					delete evt.result.skill;
					delete evt.result.used;
					evt.result.card = get.autoViewAs(result.links[0]);
					if (aozhan) evt.result.card.name = name;
					evt.result.cards = [result.links[0]];
					evt.redo();
					return;
				}
			}
			evt.goto(0);
		},
		ai: {
			effect: {
				target(card, player, target, effect) {
					if (target.hasSkill("psqichu_used")) return;
					if (get.tag(card, "respondShan")) return 0.7;
					if (get.tag(card, "respondSha")) return 0.7;
				},
			},
			order: 11,
			respondShan: true,
			respondSha: true,
			result: {
				player(player) {
					if (_status.event.dying) return get.attitude(player, _status.event.dying);
					return 1;
				},
			},
		},
		subSkill: {
			backup: {
				precontent() {
					delete event.result.skill;
					var name = event.result.card.name;
					event.result.cards = event.result.card.cards;
					event.result.card = get.autoViewAs(event.result.cards[0]);
					event.result.card.name = name;
				},
				filterCard() {
					return false;
				},
				selectCard: -1,
			},
			used: { charlotte: true },
		},
	},
	pslongxin: {
		audio: 2,
		trigger: { player: "phaseJudgeBegin" },
		direct: true,
		filter(event, player) {
			return player.countCards("j") && player.countCards("h");
		},
		content() {
			"step 0";
			player
				.chooseToDiscard(get.prompt2("pslongxin"), { type: "equip" }, "he")
				.set("logSkill", "pslongxin")
				.set("ai", card => {
					if (_status.event.goon) return 15 - get.value(card);
					return 0;
				})
				.set(
					"goon",
					player.hasCard(card => {
						var cardj = card.viewAs ? { name: card.viewAs } : card;
						return get.effect(player, cardj, player, player) < 0;
					}, "j")
				);
			"step 1";
			if (result.bool) {
				player.discardPlayerCard(player, "j", true);
			}
		},
	},
	//官盗S周瑜·一版
	psoldshiyin: {
		audio: 2,
		trigger: {
			player: "gainAfter",
			global: "loseAsyncAfter",
		},
		frequent: true,
		filter(event, player) {
			if (player != _status.currentPhase) return false;
			return event.getg(player).filter(i => get.owner(i) == player).length > 0;
		},
		content() {
			"step 0";
			player.showCards(
				trigger.getg(player).filter(i => get.owner(i) == player),
				get.translation(player) + "发动了【识音】"
			);
			"step 1";
			var suits = [],
				cards = trigger.getg(player).filter(i => get.owner(i) == player);
			for (var card of cards) suits.add(get.suit(card, player));
			player.addTempSkill("psoldshiyin_effect");
			if (!player.storage.psoldshiyin_effect) player.storage.psoldshiyin_effect = 0;
			player.storage.psoldshiyin_effect = Math.max(player.storage.psoldshiyin_effect, suits.length);
			if (suits.length >= 2) player.addMark("psoldshiyin_damage", 1, false);
		},
		subSkill: {
			effect: {
				trigger: { player: "useCard" },
				charlotte: true,
				forced: true,
				onremove: ["psoldshiyin_effect", "psoldshiyin_damage"],
				content() {
					var num = player.countMark("psoldshiyin_effect");
					if (num >= 1) trigger.directHit.addArray(game.players);
					if (num >= 2 && get.tag(trigger.card, "damage")) trigger.baseDamage += player.countMark("psoldshiyin_damage");
					if (num >= 3) player.draw();
					player.removeSkill("psoldshiyin_effect");
				},
				mod: {
					aiOrder(player, card, num) {
						var numx = player.countMark("psoldshiyin_effect");
						if (numx >= 2 && get.tag(card, "damage")) return num + 10;
					},
				},
			},
		},
	},
	//官盗S周瑜·二版
	psshiyin: {
		audio: 2,
		trigger: {
			global: "phaseBefore",
			player: "enterGame",
		},
		forced: true,
		locked: false,
		direct: true,
		group: "psshiyin_change",
		filter(event, player) {
			return event.name != "phase" || game.phaseNumber == 0;
		},
		content() {
			"step 0";
			player.chooseCard(get.prompt("psshiyin"), "将一张手牌置于武将牌上，称为“杂音”牌").set("ai", card => 20 - get.value(card));
			"step 1";
			if (result.bool) {
				player.logSkill("psshiyin");
				player.addToExpansion(result.cards, player, "give").gaintag.add("psshiyin");
			}
		},
		marktext: "音",
		intro: {
			name: "杂音",
			name2: "杂音",
			content: "expansion",
			markcount: "expansion",
		},
		subSkill: {
			change: {
				trigger: { player: "phaseUseBegin" },
				direct: true,
				filter(event, player) {
					return player.getExpansions("psshiyin").length && player.countCards("h");
				},
				content() {
					"step 0";
					var card = player.getExpansions("psshiyin")[0];
					player
						.chooseCard(get.prompt("psshiyin"), "用一张手牌替换“杂音”牌（" + get.translation(card) + "）")
						.set("ai", card => {
							if (_status.event.suit && get.suit(card) == _status.event.suit) return 8 - get.value(card);
							return 0;
						})
						.set(
							"suit",
							(function () {
								var suits = lib.suit
									.slice()
									.map(i => [i, (get.suit(card) == i ? 1 : 0) + player.countCards("h", { suit: i })])
									.filter(i => i[1] > 0);
								suits.sort((a, b) => a[1] - b[1]);
								if (suits.length > 0) return suits[0][0];
								return null;
							})()
						);
					"step 1";
					if (result.bool) {
						player.logSkill("psshiyin");
						player.addToExpansion(result.cards[0], "give", player).gaintag.add("psshiyin");
						var card = player.getExpansions("psshiyin")[0];
						if (card) player.gain(card, "gain2");
					}
				},
			},
		},
		ai: {
			combo: "psliaozou",
		},
	},
	psquwu: {
		audio: 2,
		forced: true,
		trigger: { target: "useCardToBefore" },
		filter(event, player) {
			return player.getExpansions("psshiyin").length && get.suit(player.getExpansions("psshiyin")[0]) == get.suit(event.card);
		},
		content() {
			trigger.cancel();
		},
		ai: {
			threaten: 1.1,
			combo: "psshiyin",
			effect: {
				target(card, player, target, current) {
					var list = target.getExpansions("psshiyin");
					for (var cardx of list) {
						if (get.suit(cardx) == get.suit(card)) return "zeroplayertarget";
					}
				},
			},
		},
		mod: {
			cardEnabled2(card, player) {
				var list = player.getExpansions("psshiyin");
				for (var cardx of list) {
					if (get.suit(cardx) == get.suit(card)) return false;
				}
			},
			cardRespondable(card, player) {
				var list = player.getExpansions("psshiyin");
				for (var cardx of list) {
					if (get.suit(cardx) == get.suit(card)) return false;
				}
			},
			cardSavable(card, player) {
				var list = player.getExpansions("psshiyin");
				for (var cardx of list) {
					if (get.suit(cardx) == get.suit(card)) return false;
				}
			},
		},
	},
	psliaozou: {
		audio: 2,
		enable: "phaseUse",
		locked: false,
		filter(event, player) {
			return !player.hasSkill("psliaozou_blocker", null, null, false) && player.getExpansions("psshiyin").length > 0;
		},
		content() {
			"step 0";
			player.showHandcards(get.translation(player) + "发动了【聊奏】");
			"step 1";
			var cards = player.getExpansions("psshiyin"),
				bool = true;
			for (var card of cards) {
				var suit = get.suit(card);
				if (player.hasCard(cardx => get.suit(cardx) == suit)) {
					bool = false;
					break;
				}
			}
			if (bool) player.draw();
			else
				player.addTempSkill("psliaozou_blocker", {
					player: ["useCard1", "useSkillBegin", "phaseUseEnd"],
				});
		},
		subSkill: {
			blocker: { charlotte: true },
		},
		mod: {
			aiValue(player, card, num) {
				var suit = get.suit(card);
				if (player.isPhaseUsing() && player.getExpansions("psshiyin").some(i => get.suit(i) == suit)) return num / 5;
			},
			aiUseful() {
				return lib.skill.psliaozou.mod.aiValue.apply(this, arguments);
			},
		},
		ai: {
			combo: "psshiyin",
			order: 9.9,
			result: {
				player(player) {
					var cards = player.getExpansions("psshiyin"),
						bool = true;
					for (var card of cards) {
						var suit = get.suit(card);
						if (player.hasCard(cardx => get.suit(cardx) == suit)) return 0;
					}
					return 1;
				},
			},
		},
	},
	//官盗S武将传晋司马
	psquanyi: {
		enable: "phaseUse",
		usable: 1,
		filterTarget(card, player, target) {
			return player.canCompare(target);
		},
		group: "psquanyi_tianbian",
		content() {
			"step 0";
			player.chooseToCompare(target, function (card) {
				if (typeof card == "string" && lib.skill[card]) {
					var ais =
						lib.skill[card].check ||
						function () {
							return 0;
						};
					return ais();
				}
				var player = get.owner(card);
				var getn = function (card) {
					if (player.hasSkill("tianbian") && get.suit(card) == "heart") return 13;
					return get.number(card);
				};
				var event = _status.event.getParent();
				var to = player == event.player ? event.target : event.player;
				var addi = get.value(card) >= 8 && get.type(card) != "equip" ? -6 : 0;
				if (card.name == "du") addi -= 5;
				if (get.color(card) == "black") addi -= 6;
				if (player == event.player) {
					if (event.small) {
						return -getn(card) - get.value(card) / 2 + addi;
					}
					return getn(card) - get.value(card) / 2 + addi;
				} else {
					if (get.attitude(player, to) <= 0 == Boolean(event.small)) {
						return -getn(card) - get.value(card) / 2 + addi;
					}
					return getn(card) - get.value(card) / 2 + addi;
				}
			});
			"step 1";
			if (result.tie) event.finish();
			else {
				var targets = [player, target];
				if (!result.bool) targets.reverse();
				var suits = [result.player, result.target].map(i => get.suit(i, false));
				event.targets = targets;
				event.suits = suits;
			}
			"step 2";
			if (event.suits.includes("heart")) {
				if (targets[1].countGainableCards("hej", targets[0]) > 0) {
					targets[0].gainPlayerCard(targets[1], "hej", true);
				}
			}
			"step 3";
			if (event.suits.includes("diamond")) {
				targets[1].damage(targets[0]);
			}
			"step 4";
			if (event.suits.includes("spade")) {
				targets[0].loseHp();
			}
			"step 5";
			if (event.suits.includes("club")) {
				if (targets[0].countDiscardableCards(targets[0], "he")) {
					targets[0].chooseToDiscard(2, true, "he");
				}
			}
		},
		ai: {
			order: 6,
			result: {
				target: -1,
			},
		},
		subSkill: {
			tianbian: {
				audio: "psquanyi",
				enable: "chooseCard",
				check(event) {
					var player = _status.event.player;
					if (player.hasSkill("smyyingshi")) {
						var card = ui.cardPile.childNodes[0];
						if ((get.color(card) == "black" && get.number(card) <= 4) || (get.color(card) == "red" && get.number(card) >= 11)) return 20;
					}
					return !player.hasCard(function (card) {
						var val = get.value(card);
						return val < 0 || (get.color(card) == "black" && val <= 4) || (get.color(card) == "red" && get.number(card) >= 11);
					}, "h")
						? 20
						: 0;
				},
				filter(event) {
					return event.type == "compare" && !event.directresult;
				},
				onCompare(player) {
					return game.cardsGotoOrdering(get.cards()).cards;
				},
			},
		},
	},
	//官盗S曹植
	psliushang: {
		audio: 2,
		trigger: { player: "phaseDrawBegin1" },
		forced: true,
		filter(event, player) {
			return !event.numFixed;
		},
		group: "psliushang_give",
		content() {
			"step 0";
			trigger.changeToZero();
			player.draw(1 + Math.max(3, game.countPlayer()));
			event.targets = game.filterPlayer(i => i != player);
			"step 1";
			var current = targets.shift();
			if (!player.countCards("h")) event.finish();
			else
				player.chooseCardTarget({
					prompt: "流殇：将一张牌置于" + get.translation(current) + "武将牌上",
					current: current,
					filterCard: true,
					forced: true,
					filterTarget(card, player, target) {
						return target == _status.event.current;
					},
					selectTarget: -1,
					ai1(card) {
						var current = _status.event.current;
						return get.value(card, current) * get.attitude(_status.event.player, current);
					},
					ai2: () => 1,
				});
			"step 2";
			if (result.bool) {
				result.targets[0].addToExpansion(result.cards, player, "give").gaintag.add("psliushang");
			}
			if (targets.length) event.goto(1);
		},
		marktext: "殇",
		intro: {
			content: "expansion",
			markcount: "expansion",
		},
		subSkill: {
			give: {
				trigger: { global: "phaseZhunbeiBegin" },
				filter(event, player) {
					return event.player != player && event.player.getExpansions("psliushang").length;
				},
				forced: true,
				logTarget: "player",
				content() {
					"step 0";
					var cards = trigger.player.getExpansions("psliushang"),
						name = get.translation(cards);
					event.cards = cards;
					trigger.player
						.chooseControl()
						.set("choiceList", ["获得" + name + "，且于本回合防止对" + get.translation(player) + "的伤害", "将" + name + "置入弃牌堆"])
						.set("ai", () => {
							return _status.event.choice;
						})
						.set(
							"choice",
							(function () {
								if (get.damageEffect(player, trigger.player, trigger.player) <= 0) return 0;
								if (get.value(cards, trigger.player) < 0) return 1;
								if (
									trigger.player.hasCard(card => {
										return get.tag(card, "damage") && trigger.player.canUse(card, player) && get.effect(player, card, trigger.player, trigger.player) > 0;
									}, "hs")
								)
									return 1;
								return 0;
							})()
						);
					"step 1";
					if (result.index == 0) {
						trigger.player.gain(cards, "gain2");
						trigger.player.addTempSkill("psliushang_prevent");
						trigger.player.markAuto("psliushang_prevent", [player]);
					} else {
						trigger.player.loseToDiscardpile(cards);
					}
					"step 2";
					game.delayx();
				},
			},
			prevent: {
				trigger: { source: "damageBegin2" },
				filter(event, player) {
					return player.getStorage("psliushang_prevent").includes(event.player);
				},
				forced: true,
				onremove: true,
				charlotte: true,
				logTarget: "player",
				content() {
					trigger.cancel();
				},
				ai: {
					effect: {
						target(card, player, target, current) {
							if (player.getStorage("psliushang_prevent").includes(target) && get.tag(card, "damage")) {
								return "zeroplayertarget";
							}
						},
					},
				},
			},
		},
	},
	psqibu: {
		trigger: { player: "dying" },
		filter(event, player) {
			return player.hp <= 0;
		},
		limited: true,
		skillAnimation: true,
		animationColor: "water",
		content() {
			"step 0";
			player.awakenSkill("psqibu");
			var cards = game.cardsGotoOrdering(get.cards(7)).cards;
			game.updateRoundNumber();
			event.cards = cards;
			player.showCards(cards, get.translation(player) + "发动了【流殇】");
			"step 1";
			var num = cards.filter(i => get.suit(i) == "heart").length;
			var gains = cards.filter(i => get.suit(i) == "club");
			if (num > 0) player.recover(num);
			if (gains.length) player.gain(gains, "gain2");
		},
	},
	//官盗S曹丕
	psjianwei: {
		audio: 2,
		trigger: { player: "phaseBegin" },
		skillAnimation: true,
		animationColor: "water",
		limited: true,
		direct: true,
		filter(event, player) {
			return player.hp >= 1;
		},
		content() {
			"step 0";
			player.chooseTarget(get.prompt2("psjianwei"), lib.filter.notMe).set("ai", target => {
				var player = _status.event.player;
				if (player.hp == 1 && !player.canSave(player)) return 0;
				var sgn = get.sgnAttitude(player, target);
				var valMine = [0, 0],
					valHis = [0, 0];
				player.getCards("hej", card => {
					if (get.position(card) == "j") {
						valMine[0] += get.effect(player, card, player);
						valMine[1] += get.effect(target, card, player);
					} else {
						valMine[0] += get.value(card, player);
						valMine[1] += get.value(card, target) * sgn;
					}
				});
				target.getCards("hej", card => {
					if (get.position(card) == "j") {
						valHis[0] += get.effect(player, card, player);
						valHis[1] += get.effect(target, card, player);
					} else {
						valHis[0] += get.value(card, player);
						valHis[1] += get.value(card, target) * sgn;
					}
				});
				return valMine[1] - valMine[0] + valHis[0] - valHis[1] >= 60;
			});
			"step 1";
			if (result.bool) {
				var target = result.targets[0];
				event.target = target;
				player.logSkill("psjianwei", target);
				player.awakenSkill("psjianwei");
				player.loseHp();
			} else event.finish();
			"step 2";
			if (player.isIn() && target.isIn()) {
				var next = game.createEvent("psjianwei_swap");
				next.player = player;
				next.target = target;
				next.set("cards1", player.getCards("hej"));
				next.set("cards2", target.getCards("hej"));
				next.setContent(lib.skill.psjianwei.swapRegioncards);
			}
		},
		swapRegioncards() {
			"step 0";
			player.$giveAuto(event.cards1, target);
			target.$giveAuto(event.cards2, player);
			"step 1";
			event.h1 = event.cards1.filter(i => get.position(i) == "h");
			event.e1 = event.cards1.filter(i => get.position(i) == "e");
			event.j1 = event.cards1.filter(i => get.position(i) == "j");
			event.h2 = event.cards2.filter(i => get.position(i) == "h");
			event.e2 = event.cards2.filter(i => get.position(i) == "e");
			event.j2 = event.cards2.filter(i => get.position(i) == "j");
			game.loseAsync({
				lose_list: [
					[player, event.cards1],
					[target, event.cards2],
				],
			}).setContent("chooseToCompareLose");
			"step 2";
			var todis = [];
			for (var i = 0; i < event.j1.length; i++) {
				if (target.isDisabledJudge() || target.hasJudge(event.j1[i].viewAs || event.j1[i].name)) todis.push(event.j1[i]);
			}
			for (var i = 0; i < event.j2.length; i++) {
				if (player.isDisabledJudge() || player.hasJudge(event.j2[i].viewAs || event.j2[i].name)) todis.push(event.j2[i]);
			}
			if (todis.length) game.cardsDiscard(todis);
			"step 3";
			game.loseAsync({
				gain_list: [
					[player, event.h2.filter(i => get.position(i, true) == "o")],
					[target, event.h1.filter(i => get.position(i, true) == "o")],
				],
			}).setContent("gaincardMultiple");
			for (var i = 0; i < event.e2.length; i++) {
				if (get.position(event.e2[i], true) == "o") player.equip(event.e2[i]);
			}
			for (var i = 0; i < event.e1.length; i++) {
				if (get.position(event.e1[i], true) == "o") target.equip(event.e1[i]);
			}
			for (var i = 0; i < event.j2.length; i++) {
				if (get.position(event.j2[i], true) == "o") player.addJudge(event.j2[i]);
			}
			for (var i = 0; i < event.j1.length; i++) {
				if (get.position(event.j1[i], true) == "o") target.addJudge(event.j1[i]);
			}
			"step 4";
			game.delayx();
		},
	},
	//官盗S司马懿
	pszhonghu: {
		audio: 2,
		trigger: { global: "dieAfter" },
		global: "pszhonghu_skip",
		filter(event, player) {
			return player != _status.currentPhase;
		},
		content() {
			"step 0";
			var evt = trigger.getParent("phaseUse");
			if (evt && evt.name == "phaseUse") {
				evt.skipped = true;
			}
			var evt = trigger.getParent("phase");
			if (evt && evt.name == "phase") {
				game.log(evt.player, "结束了回合");
				evt.finish();
				evt.untrigger(true);
			}
			_status._pszhonghu = player;
		},
		subSkill: {
			skip: {
				trigger: { player: "phaseBeforeStart" },
				forced: true,
				priority: Infinity,
				popup: false,
				firstDo: true,
				filter(event, player) {
					if ((_status._pszhonghu && !_status._pszhonghu.isIn()) || event.player == _status._pszhonghu) delete _status._pszhonghu;
					return _status._pszhonghu && event.player != _status._pszhonghu;
				},
				content() {
					trigger.cancel(null, null, "notrigger");
				},
			},
		},
	},
	//官盗S虎啸龙吟司马懿&诸葛亮
	pshuxiao: {
		audio: 2,
		trigger: { player: "phaseBegin" },
		frequent: true,
		content() {
			"step 0";
			player.judge(function (card) {
				if (get.type(card) == "basic" || get.type(card) == "trick") return 3;
				return -1;
			});
			"step 1";
			if (result.bool) {
				player.addTempSkill("pshuxiao_use");
				player.storage.pshuxiao_use = {
					card: { name: result.name, nature: result.card.nature },
					number: result.number,
					suit: result.suit,
				};
			}
		},
		subSkill: {
			use: {
				charlotte: true,
				onremove: true,
				enable: "chooseToUse",
				popname: true,
				position: "hs",
				hiddenCard(player, name) {
					return player.storage.pshuxiao_use.card.name == name;
				},
				filter(event, player) {
					if (!player.storage.pshuxiao_use) return false;
					if (!player.countCards("h")) return false;
					return event.filterCard(player.storage.pshuxiao_use.card, player, event);
				},
				viewAs(cards, player) {
					return player.storage.pshuxiao_use.card;
				},
				filterCard(card, player) {
					return get.number(card) == player.storage.pshuxiao_use.number || get.suit(card) == player.storage.pshuxiao_use.suit;
				},
				prompt(event) {
					var player = _status.event.player;
					return "将一张" + get.translation(player.storage.pshuxiao_use.suit) + "牌或点数为" + get.strNumber(player.storage.pshuxiao_use.number) + "的牌当作" + get.translation(player.storage.pshuxiao_use.card) + "使用";
				},
			},
		},
	},
	psguanxing: {
		audio: "guanxing",
		trigger: { player: "phaseZhunbeiBegin" },
		frequent: true,
		preHidden: true,
		async content(event, trigger, player) {
			const result = await player.chooseToGuanxing(5).set("prompt", "观星：点击或拖动将牌移动到牌堆顶或牌堆底").forResult();
			if (!result.bool || !result.moved[0].length) player.addTempSkill("guanxing_fail");
		},
		ai: {
			threaten: 1.2,
			guanxing: true,
		},
	},
	pslongyin: {
		audio: 2,
		enable: ["chooseToUse", "chooseToRespond"],
		filter(event, player) {
			if (!player.countCards("hse") || player.hasSkill("pslongyin_used")) return false;
			for (var i of lib.inpile) {
				var type = get.type(i);
				if ((type == "basic" || type == "trick") && event.filterCard(get.autoViewAs({ name: i }, "unsure"), player, event)) return true;
			}
			return false;
		},
		chooseButton: {
			dialog(event, player) {
				var list = [];
				for (var i = 0; i < lib.inpile.length; i++) {
					var name = lib.inpile[i];
					if (name == "sha") {
						if (event.filterCard({ name: name }, player, event)) list.push(["基本", "", "sha"]);
						for (var j of lib.inpile_nature) {
							if (event.filterCard({ name: name, nature: j }, player, event)) list.push(["基本", "", "sha", j]);
						}
					} else if (get.type(name) == "trick" && event.filterCard({ name: name }, player, event)) list.push(["锦囊", "", name]);
					else if (get.type(name) == "basic" && event.filterCard({ name: name }, player, event)) list.push(["基本", "", name]);
				}
				return ui.create.dialog("虎啸", [list, "vcard"]);
			},
			filter(button, player) {
				return _status.event.getParent().filterCard({ name: button.link[2], nature: button.link[3] }, player, _status.event.getParent());
			},
			check(button) {
				if (_status.event.getParent().type != "phase") return 1;
				var player = _status.event.player;
				if (["wugu", "zhulu_card", "yiyi", "lulitongxin", "lianjunshengyan", "diaohulishan"].includes(button.link[2])) return 0;
				return player.getUseValue({
					name: button.link[2],
					nature: button.link[3],
				});
			},
			backup(links, player) {
				return {
					filterCard(card, player) {
						var num = 0;
						for (var i = 0; i < ui.selected.cards.length; i++) {
							num += get.number(ui.selected.cards[i]);
						}
						return get.number(card) + num <= 13;
					},
					selectCard: [1, Infinity],
					filterOk() {
						var num = 0;
						for (var i = 0; i < ui.selected.cards.length; i++) {
							num += get.number(ui.selected.cards[i]);
						}
						return num == 13;
					},
					audio: "pslongyin",
					popname: true,
					complexCard: true,
					check(card) {
						var num = 0;
						for (var i = 0; i < ui.selected.cards.length; i++) {
							num += get.number(ui.selected.cards[i]);
						}
						if (num + get.number(card) == 13) return 5.5 - get.value(card);
						if (ui.selected.cards.length == 0) {
							var cards = _status.event.player.getCards("h");
							for (var i = 0; i < cards.length; i++) {
								for (var j = i + 1; j < cards.length; j++) {
									if (get.number(cards[i]) + get.number(cards[j]) == 13) {
										if (cards[i] == card || cards[j] == card) return 6 - get.value(card);
									}
								}
							}
						}
						return 0;
					},
					position: "hes",
					viewAs: { name: links[0][2], nature: links[0][3] },
					precontent() {
						player.addTempSkill("pslongyin_used");
					},
				};
			},
			prompt(links, player) {
				return "将任意张点数和为13牌当做" + (get.translation(links[0][3]) || "") + get.translation(links[0][2]) + "使用";
			},
		},
		hiddenCard(player, name) {
			if (!lib.inpile.includes(name)) return false;
			var type = get.type(name);
			return (type == "basic" || type == "trick") && player.countCards("she") > 0 && !player.hasSkill("pslongyin_used");
		},
		ai: {
			fireAttack: true,
			respondSha: true,
			respondShan: true,
			skillTagFilter(player) {
				if (!player.countCards("hse") || player.hasSkill("pslongyin_used")) return false;
			},
			order: 1,
			result: {
				player(player) {
					if (_status.event.dying) return get.attitude(player, _status.event.dying);
					return 1;
				},
			},
		},
		subSkill: {
			used: { charlotte: true },
		},
	},
	//官盗S武将传诸葛亮
	pszhiji: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		filterTarget(card, player, target) {
			if (!ui.selected.targets.length) return true;
			return target.group != ui.selected.targets[0].group;
		},
		selectTarget: 2,
		complexTarget: true,
		multitarget: true,
		multiline: true,
		filterCard: true,
		selectCard: 2,
		check(card) {
			return 6 - get.value(card);
		},
		content() {
			"step 0";
			targets.sortBySeat();
			if (targets[0].canUse("sha", targets[1], false)) targets[0].useCard({ name: "sha", isCard: true }, targets[1], false, "noai");
			"step 1";
			if (targets[1].canUse("sha", targets[0], false)) targets[1].useCard({ name: "sha", isCard: true }, targets[0], false, "noai");
		},
		ai: {
			order: 2.5,
			result: {
				player: 1,
				target(player, target) {
					if (ui.selected.targets.length) {
						var targetx = ui.selected.targets[0];
						if (get.effect(targetx, { name: "sha" }, target, player) + get.effect(target, { name: "sha" }, targetx, player) < 0) return 0;
						return -1;
					}
					return -1;
				},
			},
		},
	},
	psjiefeng: {
		audio: 2,
		enable: "phaseUse",
		filterCard: true,
		selectCard: 2,
		check(card) {
			return 6 - get.value(card);
		},
		content() {
			"step 0";
			var cards = game.cardsGotoOrdering(get.cards(5)).cards;
			event.cards = cards;
			player.showCards(cards, get.translation(player) + "发动了【借风】");
			"step 1";
			if (cards.filter(i => get.color(i) == "red").length >= 2) {
				player.chooseUseTarget("wanjian", true);
			}
		},
		ai: {
			order: 9,
			result: {
				player(player) {
					if (player.getUseValue({ name: "wanjian" }) < 0) return 0;
					return 1;
				},
			},
		},
	},
	//官盗S马超
	psweihou: {
		trigger: { player: "judgeBegin" },
		filter(event, player) {
			return !event.directresult;
		},
		content() {
			"step 0";
			var cards = get.cards(2);
			for (var i = cards.length - 1; i >= 0; i--) {
				ui.cardPile.insertBefore(cards[i], ui.cardPile.firstChild);
			}
			game.updateRoundNumber();
			event.cards = cards;
			event.videoId = lib.status.videoId++;
			game.broadcastAll(
				function (player, id, cards) {
					var str;
					if (player == game.me && !_status.auto) str = "威侯：选择一张作为本次判定结果";
					else str = get.translation(player) + "发动了【威侯】";
					var dialog = ui.create.dialog(str, cards);
					dialog.videoId = id;
				},
				player,
				event.videoId,
				event.cards
			);
			game.addVideo("showCards", player, ["威侯", get.cardsInfo(event.cards)]);
			if (!event.isMine() && !event.isOnline()) game.delayx();
			"step 1";
			player
				.chooseButton(["威侯：选择一张作为本次判定结果", cards], true)
				.set("ai", button => {
					return _status.event.getTrigger().judge(button.link);
				})
				.set("dialog", event.videoId);
			"step 2";
			game.broadcastAll("closeDialog", event.videoId);
			if (result.bool) {
				trigger.directresult = result.links[0];
				game.cardsDiscard(cards.removeArray(result.links).filter(i => get.position(i) == "c"));
			}
			"step 3";
			game.updateRoundNumber();
		},
	},
	//官盗S1066★贾诩
	psqupo: {
		audio: 2,
		trigger: { global: "phaseBegin" },
		filter(event, player) {
			return player.countCards("he");
		},
		direct: true,
		content() {
			"step 0";
			var cards = player.getCards("he");
			var current = trigger.player;
			var ai1 = function (card) {
				var player = _status.event.player,
					current = _status.event.current;
				var card = get.color(card);
				if (color == "black") {
					if (!current.hasSha() || !current.hasUseTarget({ name: "sha" })) return 0;
					if (targets.length) return 5.5 - get.value(card);
				} else if (color == "red") {
					if (get.attitude(player, current) <= 0) return 0;
					if (
						current.hasCard(card => {
							if (!get.tag(card, "damage")) return false;
							var targetsx = game.filterPlayer(currentx => {
								if (currentx == current || current == player) return false;
								return current.canUse(card, currentx) && get.effect(currentx, card, current, player) > 0;
							});
							targets2.addArray(targetsx);
							return targetsx.length;
						}, "hs")
					)
						return 5.5 - get.value(card);
				}
				return 0;
			};
			var targets = game.filterPlayer(currentx => {
				if (currentx == current || current == player) return false;
				return !current.canUse("sha", currentx) || (get.effect(currentx, { name: "sha" }, current, player) > 0 && get.attitude(player, currentx) > -3);
			});
			targets.sort((a, b) => get.attitude(player, b) - get.attitude(player, a));
			var targets2 = [];
			var cardx = cards.sort((a, b) => ai1(b) - ai1(a))[0];
			targets2.sort((a, b) => get.threaten(b, current) - get.threaten(a, current));
			var next = player.chooseCardTarget({
				filterCard: true,
				prompt: get.prompt2("psqupo"),
				current: trigger.player,
				filterTarget(card, player, target) {
					return player != target && target != _status.event.current;
				},
				ai1(card) {
					return card == _status.event.cardx ? 1 : 0;
				},
				ai2(target) {
					return target == _status.event.targetx ? 1 : 0;
				},
			});
			if (ai1(cardx) > 0) {
				next.cardx = cardx;
				if (get.color(cardx) == "black") {
					if (targets.length) next.targetx = targets[0];
				} else {
					if (targets2.length) next.targetx = targets2[0];
				}
			}
			"step 1";
			if (result.bool) {
				var target = result.targets[0],
					cards = result.cards;
				player.logSkill("psqupo", target);
				player.give(cards, target);
				var color = get.color(cards[0]);
				if (color == "black") {
					_status.currentPhase.addTempSkill("psqupo_black");
					_status.currentPhase.markAuto("psqupo_black", [target]);
				} else if (color == "red") {
					target.addTempSkill("psqupo_red");
					target.addMark("psqupo_red", 1, false);
				}
			}
		},
		subSkill: {
			black: {
				trigger: { player: "useCardToTarget" },
				forced: true,
				charlotte: true,
				onremove: true,
				filter(event, player) {
					if (event.card.name != "sha") return false;
					var targets = player.getStorage("psqupo_black").slice();
					targets.remove(event.target);
					return targets.length;
				},
				content() {
					var targets = player.getStorage("psqupo_black").slice();
					targets.remove(trigger.target);
					player.loseHp(targets.length);
				},
			},
			red: {
				trigger: { player: "damageBegin3" },
				charlotte: true,
				forced: true,
				onremove: true,
				content() {
					player.loseHp(player.countMark("psqupo_red"));
					player.removeSkill("psqupo_red");
				},
			},
		},
	},
	psbaoquan: {
		audio: 2,
		trigger: { player: "damageBegin4" },
		filter(event, player) {
			return player.countCards("h", { type: ["trick", "delay"] }) || _status.connectMode;
		},
		direct: true,
		content() {
			"step 0";
			player
				.chooseToDiscard(get.prompt2("psbaoquan"), { type: ["trick", "delay"] })
				.set("logSkill", "psbaoquan")
				.set("ai", card => {
					if (_status.event.goon) return 7 - get.value(card);
					return 0;
				})
				.set("goon", get.damageEffect(player, trigger.source, player) < -5);
			"step 1";
			if (result.bool) {
				trigger.cancel();
			}
		},
	},
	//官盗S吕布
	pssheji: {
		audio: 2,
		enable: "phaseUse",
		filterCard: true,
		selectCard: -1,
		position: "h",
		locked: false,
		filter(event, player) {
			if (player.hasSkill("pssheji_used")) return false;
			var hs = player.getCards("h");
			if (!hs.length) return false;
			for (var card of hs) {
				var mod2 = game.checkMod(card, player, "unchanged", "cardEnabled2", player);
				if (mod2 === false) return false;
			}
			return event.filterCard(get.autoViewAs({ name: "sha" }, hs));
		},
		viewAs: {
			name: "sha",
			storage: { pssheji: true },
		},
		onuse(links, player) {
			player.addTempSkill("pssheji_used", "phaseUseAfter");
		},
		ai: {
			order: 1,
			threaten: 1.1,
		},
		mod: {
			targetInRange(card, player, target) {
				if (card.storage && card.storage.pssheji) return true;
			},
		},
		subSkill: {
			used: {
				audio: "pssheji",
				trigger: { source: "damageSource" },
				charlotte: true,
				forced: true,
				popup: false,
				logTarget: "player",
				filter(event, player) {
					return (
						event.card.storage &&
						event.card.storage.pssheji &&
						event.player.hasCard(card => {
							if (!lib.filter.canBeGained(card, player, event.player)) return false;
							return ["equip1", "equip3", "equip4", "equip6"].includes(get.subtype(card));
						}, "e")
					);
				},
				content() {
					var cards = trigger.player.getCards("e", card => {
						if (!lib.filter.canBeGained(card, player, trigger.player)) return false;
						return ["equip1", "equip3", "equip4", "equip6"].includes(get.subtype(card));
					});
					if (cards.length) player.gain(cards, "giveAuto", trigger.player);
				},
			},
		},
	},
	//战役篇国战将转身份
	//钟会
	zyquanji: {
		audio: "gzquanji",
		trigger: {
			player: "damageEnd",
			source: "damageSource",
		},
		frequent: true,
		filter(event, player, name) {
			if (name == "damageEnd") return true;
			var evt = event.getParent();
			if (evt.player != player) return false;
			return evt.card && evt.type == "card" && evt.targets.length == 1;
		},
		content() {
			"step 0";
			player.draw();
			"step 1";
			var hs = player.getCards("he");
			if (hs.length > 0) {
				if (hs.length == 1) event._result = { bool: true, cards: hs };
				else player.chooseCard("he", true, "选择一张牌作为“权”");
			} else event.finish();
			"step 2";
			if (result.bool) {
				var cs = result.cards;
				player.addToExpansion(cs, player, "give").gaintag.add("zyquanji");
			}
		},
		intro: {
			content: "expansion",
			markcount: "expansion",
		},
		onremove(player, skill) {
			var cards = player.getExpansions(skill);
			if (cards.length) player.loseToDiscardpile(cards);
		},
		locked: false,
		mod: {
			maxHandcard(player, num) {
				return num + player.getExpansions("zyquanji").length;
			},
		},
		ai: {
			notemp: true,
		},
	},
	zypaiyi: {
		audio: "gzpaiyi",
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return player.getExpansions("zyquanji").length > 0;
		},
		chooseButton: {
			dialog(event, player) {
				return ui.create.dialog("排异", player.getExpansions("zyquanji"), "hidden");
			},
			backup(links, player) {
				return {
					audio: "gzpaiyi",
					filterTarget: true,
					filterCard() {
						return false;
					},
					selectCard: -1,
					card: links[0],
					delay: false,
					content: lib.skill.zypaiyi.contentx,
					ai: {
						order: 10,
						result: {
							target(player, target) {
								if (target != player) return 0;
								if (player.getExpansions("zyquanji").length <= 1 || (player.needsToDiscard() && !player.getEquip("zhuge") && !player.hasSkill("new_paoxiao"))) return 0;
								return 1;
							},
						},
					},
				};
			},
			prompt() {
				return "请选择【排异】的目标";
			},
		},
		contentx() {
			"step 0";
			var card = lib.skill.zypaiyi_backup.card;
			player.loseToDiscardpile(card);
			"step 1";
			var num = player.getExpansions("zyquanji").length;
			if (num > 0) target.draw(Math.min(7, num));
			"step 2";
			if (target.countCards("h") > player.countCards("h")) {
				target.damage();
			}
		},
		ai: {
			order(item, player) {
				var num = player.getExpansions("zyquanji").length;
				if (num == 1) return 8;
				return 1;
			},
			result: {
				player: 1,
			},
			combo: "zyquanji",
		},
	},
	//孙綝
	zyshilu: {
		audio: 2,
		preHidden: true,
		trigger: { global: "dieAfter" },
		prompt2(event, player) {
			return "将其的所有武将牌" + (player == event.source ? "及武将牌库里的一张随机武将牌" : "") + "置于武将牌上作为“戮”";
		},
		logTarget: "player",
		content() {
			var list = [],
				target = trigger.player;
			if (target.name1 && !target.isUnseen(0) && target.name1.indexOf("gz_shibing") != 0 && _status.characterlist.includes(target.name1)) list.push(target.name1);
			if (target.name2 && !target.isUnseen(1) && target.name2.indexOf("gz_shibing") != 0 && _status.characterlist.includes(target.name1)) list.push(target.name2);
			_status.characterlist.removeArray(list);
			if (player == trigger.source) list.addArray(_status.characterlist.randomRemove(1));
			if (list.length) {
				player.markAuto("zyshilu", list);
				game.log(player, "将", "#g" + get.translation(list), "置于武将牌上作为", "#y“戮”");
				game.broadcastAll(
					function (player, list) {
						var cards = [];
						for (var i = 0; i < list.length; i++) {
							var cardname = "huashen_card_" + list[i];
							lib.card[cardname] = {
								fullimage: true,
								image: "character:" + list[i],
							};
							lib.translate[cardname] = get.rawName2(list[i]);
							cards.push(game.createCard(cardname, "", ""));
						}
						player.$draw(cards, "nobroadcast");
					},
					player,
					list
				);
			}
		},
		marktext: "戮",
		intro: {
			content: "character",
			onunmark(storage, player) {
				if (storage && storage.length) {
					_status.characterlist.addArray(storage);
					storage.length = 0;
				}
			},
			mark(dialog, storage, player) {
				if (storage && storage.length) {
					dialog.addSmall([storage, "character"]);
				} else {
					return "没有“戮”";
				}
			},
			// content:function(storage,player){
			// 	return '共有'+get.cnNumber(storage.length)+'张“戮”';
			// },
		},
		group: "zyshilu_zhiheng",
		subSkill: {
			zhiheng: {
				audio: "zyshilu",
				trigger: { player: "phaseZhunbeiBegin" },
				filter(event, player) {
					return player.getStorage("zyshilu").length > 0 && player.countCards("he") > 0;
				},
				direct: true,
				content() {
					"step 0";
					var num = Math.min(player.getStorage("zyshilu").length, player.countCards("he"));
					player.chooseToDiscard("he", get.prompt("zyshilu"), "弃置至多" + get.cnNumber(num) + "张牌并摸等量的牌", [1, num]).logSkill = "zyshilu_zhiheng";
					"step 1";
					if (result.bool && result.cards && result.cards.length) player.draw(result.cards.length);
				},
			},
		},
	},
	zyxiongnve: {
		audio: 2,
		trigger: { player: "phaseUseBegin" },
		direct: true,
		filter(event, player) {
			return player.getStorage("zyshilu").length > 0;
		},
		content() {
			"step 0";
			player
				.chooseButton([get.prompt("zyxiongnve"), [player.storage.zyshilu, "character"]])
				.set("ai", function (button) {
					if (!_status.event.goon) return 0;
					return 1;
				})
				.set(
					"goon",
					player.countCards("hs", function (card) {
						return get.tag(card, "damage") && player.hasValueTarget(card);
					}) > 1
				);
			"step 1";
			if (result.bool) {
				player.logSkill("zyxiongnve");
				lib.skill.zyxiongnve.throwCharacter(player, result.links);
				game.delayx();
				player
					.chooseControl()
					.set("prompt", "选择获得一项效果")
					.set("choiceList", ["本回合造成的伤害+1", "本回合造成伤害时，获得其一张牌", "本回合使用牌没有次数限制"])
					.set("ai", function () {
						var player = _status.event.player;
						if (
							player.countCards("hs", function (card) {
								return get.name(card) == "sha" && player.hasValueTarget(card);
							}) > player.getCardUsable("sha")
						)
							return 0;
						return get.rand(1, 2);
					});
			} else event.finish();
			"step 2";
			var skill = "zyxiongnve_effect" + result.index;
			player.addTempSkill(skill);
			game.log(player, "本回合", "#g" + lib.skill[skill].promptx);
		},
		group: "zyxiongnve_end",
		throwCharacter(player, list) {
			player.unmarkAuto("zyshilu", list);
			_status.characterlist.addArray(list);
			game.log(player, "从", "#y“戮”", "中移去了", "#g" + get.translation(list));
			game.broadcastAll(
				function (player, list) {
					var cards = [];
					for (var i = 0; i < list.length; i++) {
						var cardname = "huashen_card_" + list[i];
						lib.card[cardname] = {
							fullimage: true,
							image: "character:" + list[i],
						};
						lib.translate[cardname] = get.rawName2(list[i]);
						cards.push(game.createCard(cardname, "", ""));
					}
					player.$throw(cards, 1000, "nobroadcast");
				},
				player,
				list
			);
		},
		subSkill: {
			effect0: {
				promptx: "造成的伤害+1",
				charlotte: true,
				onremove: true,
				audio: "zyxiongnve",
				intro: {
					content: "当你造成伤害时，此伤害+1",
				},
				trigger: { source: "damageBegin1" },
				forced: true,
				logTarget: "player",
				content() {
					trigger.num++;
				},
			},
			effect1: {
				promptx: "造成伤害后，获得其一张牌",
				charlotte: true,
				onremove: true,
				audio: "zyxiongnve",
				intro: {
					content: "对其他角色造成伤害时，获得其一张牌",
				},
				trigger: { source: "damageBegin1" },
				forced: true,
				filter(event, player) {
					return player != event.player && event.player.countGainableCards(player, "he") > 0;
				},
				logTarget: "player",
				content() {
					player.gainPlayerCard(trigger.player, true, "he");
				},
			},
			effect2: {
				promptx: "使用牌没有次数限制",
				charlotte: true,
				onremove: true,
				intro: {
					content: "使用牌没有次数限制",
				},
				mod: {
					cardUsable: () => Infinity,
				},
			},
			effect3: {
				charlotte: true,
				audio: "zyxiongnve",
				mark: true,
				intro: {
					content: "受到的伤害-1",
				},
				trigger: { player: "damageBegin4" },
				forced: true,
				filter(event, player) {
					return event.source != player && event.source && event.source.isIn();
				},
				content() {
					trigger.num--;
				},
				ai: {
					effect: {
						target(card, player, target) {
							if (player.hasSkillTag("jueqing", false, target)) return;
							var num = get.tag(card, "damage");
							if (num) {
								if (num > 1) return 0.5;
								return 0;
							}
						},
					},
				},
			},
			end: {
				trigger: { player: "phaseUseEnd" },
				direct: true,
				filter(event, player) {
					return player.getStorage("zyshilu").length > 1;
				},
				content() {
					"step 0";
					player.chooseButton(["凶虐：是否移去两张“戮”获得减伤？", [player.storage.zyshilu, "character"]], 2).set("ai", function (button) {
						var player = _status.event.player;
						if (game.countPlayer() * 1.5 + player.storage.zyshilu.length / 2 > 8) return 1;
						if (player.hp <= 2) return 1;
						return 0;
					});
					"step 1";
					if (result.bool) {
						player.logSkill("zyxiongnve");
						lib.skill.zyxiongnve.throwCharacter(player, result.links);
						player.addTempSkill("zyxiongnve_effect3", { player: "phaseBegin" });
						game.delayx();
					}
				},
			},
		},
		ai: {
			combo: "zyshilu",
		},
	},
	//孟达
	qiuan: {
		audio: 2,
		trigger: { player: "damageBegin4" },
		filter(event, player) {
			return event.cards && event.cards.filterInD().length > 0 && !player.getExpansions("qiuan").length;
		},
		check(event, player) {
			if (get.damageEffect(player, event.source || player, player, event.nature) >= 0) return false;
			return true;
		},
		preHidden: true,
		content() {
			var cards = trigger.cards.filterInD();
			player.addToExpansion("gain2", cards).gaintag.add("qiuan");
			trigger.cancel();
		},
		ai: {
			combo: "liangfan",
		},
		intro: {
			content: "expansion",
			markcount: "expansion",
		},
		marktext: "函",
	},
	liangfan: {
		audio: 2,
		trigger: { player: "phaseZhunbeiBegin" },
		forced: true,
		filter(event, player) {
			return player.getExpansions("qiuan").length > 0;
		},
		content() {
			"step 0";
			var cards = player.getExpansions("qiuan");
			player.gain(cards, "gain2").gaintag.add("liangfan");
			player.addTempSkill("liangfan2");
			"step 1";
			player.loseHp();
		},
		ai: {
			combo: "qiuan",
		},
	},
	liangfan2: {
		audio: "liangfan",
		mark: true,
		mod: {
			aiOrder(player, card, num) {
				if (get.itemtype(card) == "card" && card.hasGaintag("liangfan")) return num + 0.1;
			},
		},
		intro: { content: "使用“量反”牌造成伤害后，可获得目标角色的一张牌" },
		trigger: { source: "damageEnd" },
		logTarget: "player",
		charlotte: true,
		sourceSkill: "liangfan",
		onremove(player) {
			player.removeGaintag("liangfan");
		},
		prompt: event => "量反：是否获得" + get.translation(event.player) + "的一张牌？",
		filter(event, player) {
			var evt = event.getParent(2);
			if (evt.name != "useCard" || evt.card != event.card) return false;
			if (!event.player.countGainableCards(player, "he")) return false;
			return (
				player.getHistory("lose", function (evt2) {
					if (evt2.getParent() != evt) return false;
					for (var i in evt2.gaintag_map) {
						if (evt2.gaintag_map[i].includes("liangfan")) return true;
					}
					return false;
				}).length > 0
			);
		},
		marktext: "反",
		content() {
			player.gainPlayerCard(trigger.player, true, "he");
		},
	},
	//文钦
	gzjinfa: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return (
				player.countCards("he") > 0 &&
				game.hasPlayer(function (current) {
					return current != player && current.countCards("he") > 0;
				})
			);
		},
		filterCard: true,
		position: "he",
		filterTarget(card, player, target) {
			return target != player && target.countCards("he") > 0;
		},
		check(card) {
			return 6 - get.value(card);
		},
		content() {
			"step 0";
			target
				.chooseCard("he", "交给" + get.translation(player) + "一张装备牌，或令其获得你的一张牌", { type: "equip" })
				.set("ai", function (card) {
					if (_status.event.goon && get.suit(card) == "spade") return 8 - get.value(card);
					return 5 - get.value(card);
				})
				.set("goon", target.canUse("sha", player, false) && get.effect(player, { name: "sha" }, target, target) > 0);
			"step 1";
			if (!result.bool) {
				player.gainPlayerCard(target, "he", true);
				event.finish();
			} else target.give(result.cards, player);
			"step 2";
			if (result.bool && result.cards && result.cards.length && target.isIn() && player.isIn() && get.suit(result.cards[0], target) == "spade" && target.canUse("sha", player, false)) target.useCard({ name: "sha", isCard: true }, false, player);
		},
		ai: {
			order: 6,
			result: {
				player(player, target) {
					if (
						target.countCards("e", function (card) {
							return get.suit(card) == "spade" && get.value(card) < 8;
						}) &&
						target.canUse("sha", player, false)
					)
						return get.effect(player, { name: "sha" }, target, player);
					return 0;
				},
				target(player, target) {
					var es = target.getCards("e").sort(function (a, b) {
						return get.value(b, target) - get.value(a, target);
					});
					if (es.length) return -Math.min(2, get.value(es[0]));
					return -2;
				},
			},
		},
	},
	//一战成名·群雄逐鹿·长安之战专属神贾诩
	zybishi: {
		audio: 2,
		trigger: { target: "useCardToTargeted" },
		filter(event, player) {
			return event.card.name == "sha" && event.player != player;
		},
		check(event, player) {
			var effect = 0;
			if (event.targets && event.targets.length) {
				for (var i = 0; i < event.targets.length; i++) {
					effect += get.effect(event.targets[i], event.card, event.player, player);
				}
			}
			if (effect < 0) {
				var target = event.targets[0];
				if (target == player) {
					return !player.countCards("h", "shan");
				} else {
					return target.hp == 1 || (target.countCards("h") <= 2 && target.hp <= 2);
				}
			}
			return false;
		},
		content() {
			player.line(trigger.player, "green");
			trigger.player.draw();
			var evt = trigger.getParent();
			evt.targets.length = 0;
			evt.all_excluded = true;
			game.log(evt.card, "被无效了");
		},
	},
	zyjianbing: {
		audio: 2,
		trigger: { global: "damageBegin3" },
		logTarget: "player",
		filter(event, player) {
			return event.player != player && event.player.isIn() && event.card && event.card.name == "sha" && event.player.countGainableCards(player, "he") > 0;
		},
		content() {
			"step 0";
			player.gainPlayerCard(trigger.player, true, "he");
			"step 1";
			if (result.bool && result.cards && result.cards.length) {
				var card = result.cards[0];
				if (get.suit(card, trigger.player) == "heart") {
					trigger.player.recover();
				}
			}
		},
	},
	//战役篇改王允
	zylianji: {
		audio: "wylianji",
		trigger: { player: "phaseUseEnd" },
		filter(event, player) {
			return player.hasHistory("useCard", evt => evt.getParent("phaseUse") == event);
		},
		direct: true,
		content() {
			"step 0";
			var types = [];
			player.getHistory("useCard", evt => {
				if (evt.getParent("phaseUse") != trigger) return false;
				types.add(get.type2(evt.card));
			});
			event.num = types.length;
			event.logged = false;
			player.chooseTarget(get.prompt("zylianji"), "令一名角色摸一张牌").set("ai", target => {
				var player = _status.event.player;
				if (target == player && player.needsToDiscard(1)) return 1;
				return get.effect(target, { name: "draw" }, player, player);
			});
			"step 1";
			if (result.bool) {
				var target = result.targets[0];
				if (!event.logged) {
					event.logged = true;
					player.logSkill("zylianji", target);
				}
				target.draw();
			}
			if (event.num <= 1) event.finish();
			"step 2";
			if (player.isHealthy()) event._result = { bool: false };
			else player.chooseBool(get.prompt("zylianji"), "回复1点体力").set("ai", () => true);
			"step 3";
			if (result.bool) {
				if (!event.logged) {
					event.logged = true;
					player.logSkill("zylianji");
				}
				player.recover();
			}
			if (event.num <= 2) event.finish();
			"step 4";
			player.chooseTarget(get.prompt("zylianji"), "跳过本回合的剩余阶段，然后令一名其他角色执行这些阶段", lib.filter.notMe).set("ai", target => {
				var att = get.attitude(_status.event.player, target),
					num = target.needsToDiscard(),
					numx = player.needsToDiscard();
				if (att < 0 && num > 0) return (-att * Math.sqrt(num)) / 3 + numx;
				var skills = target.getSkills();
				var val = 0;
				for (var skill of skills) {
					var info = get.info(skill);
					if (info.trigger && info.trigger.player && (info.trigger.player.indexOf("phaseJieshu") == 0 || (Array.isArray(info.trigger.player) && info.trigger.player.some(i => i.indexOf("phaseJieshu") == 0)))) {
						var threaten = info.ai && info.ai.threaten ? info.ai.threaten : 1;
						if (info.ai && info.ai.neg) val -= 3 * threaten;
						else if (info.ai && info.ai.halfneg) val -= 1.5 * threaten;
						else val += threaten;
					}
				}
				return (att * val) / 2 + numx;
			});
			"step 5";
			if (result.bool) {
				var target = result.targets[0];
				if (!event.logged) {
					event.logged = true;
					player.logSkill("zylianji", target);
				} else player.line(target);
				player.addTempSkill("zylianji_skip");
				player.storage.zylianji_insert = target;
			}
		},
		subSkill: {
			skip: {
				trigger: {
					player: ["phaseZhunbeiBefore", "phaseJudgeBefore", "phaseDrawBefore", "phaseUseBefore", "phaseDiscardBefore", "phaseJieshuBefore"],
				},
				init(player) {
					if (!player.storage.zylianji_skip) player.storage.zylianji_skip = [];
				},
				forced: true,
				charlotte: true,
				group: "zylianji_insert",
				onremove: true,
				content() {
					trigger.cancel();
					player.storage.zylianji_skip.push(trigger.name);
				},
			},
			insert: {
				trigger: { player: "phaseEnd" },
				filter(event, player) {
					return player.storage.zylianji_skip && player.storage.zylianji_skip.length && player.storage.zylianji_insert && player.storage.zylianji_insert.isIn();
				},
				forced: true,
				charlotte: true,
				onremove: true,
				getStr(str) {
					switch (str) {
						case "phaseDraw":
							return "player.phaseDraw();if(!player.noPhaseDelay){if(player==game.me){game.delay()}else{game.delayx()}}";
						case "phaseDiscard":
							return "game.broadcastAll(function(){if(ui.tempnowuxie){ui.tempnowuxie.close();delete ui.tempnowuxie;}});player.phaseDiscard();if(!player.noPhaseDelay){game.delayx()};delete player._noSkill;";
						default:
							return "player." + str + "();";
					}
				},
				content() {
					"step 0";
					var func = "";
					for (var i = 0; i < player.storage.zylianji_skip.length; i++) {
						var phase = player.storage.zylianji_skip[i];
						func += "\n'step" + " " + i + "'\n";
						func += lib.skill.zylianji_insert.getStr(phase);
					}
					player.line(player.storage.zylianji_insert);
					player.storage.zylianji_insert.insertPhase().setContent(new Function(func))._noTurnOver = true;
				},
			},
		},
	},
	zymoucheng: {
		enable: "phaseUse",
		usable: 1,
		viewAs: { name: "jiedao" },
		filterCard: { color: "black" },
		position: "he",
		check(card) {
			return 4.5 - get.value(card);
		},
	},
	//用间篇豪华版盒子甄姬
	yjluoshen: {
		audio: "luoshen",
		trigger: { player: "phaseZhunbeiBegin" },
		frequent: true,
		content() {
			"step 0";
			event.cards = [];
			"step 1";
			var next = player.judge(function (card) {
				var color = get.color(card);
				var evt = _status.event.getParent("yjluoshen");
				if (evt) {
					if (!evt.color) evt.color = color;
					else if (evt.color != color) return -1;
				}
				return 1;
			});
			next.judge2 = function (result) {
				return result.bool;
			};
			if (get.mode() != "guozhan" && !player.hasSkillTag("rejudge"))
				next.set("callback", function () {
					if (get.position(card, true) == "o") player.gain(card, "gain2");
				});
			else
				next.set("callback", function () {
					event.getParent().orderingCards.remove(card);
				});
			"step 2";
			if (result.judge > 0) {
				event.cards.push(result.card);
				player.chooseBool("是否再次发动【洛神】？").set("frequentSkill", "yjluoshen");
			} else {
				for (var i = 0; i < event.cards.length; i++) {
					if (get.position(event.cards[i], true) != "o") {
						event.cards.splice(i, 1);
						i--;
					}
				}
				if (event.cards.length) {
					player.gain(event.cards, "gain2");
				}
				event.finish();
			}
			"step 3";
			if (result.bool) {
				event.goto(1);
			} else {
				if (event.cards.length) {
					player.gain(event.cards, "gain2");
				}
			}
		},
	},
	//用间篇豪华版盒子贾诩
	yjzhenlve: {
		audio: "zhenlue",
		inherit: "zhenlue",
		content() {
			trigger.directHit.addArray(game.players);
		},
	},
	yjjianshu: {
		audio: "jianshu",
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return player.countCards("h") > 0;
		},
		filterTarget(card, player, target) {
			if (target == player) return false;
			if (ui.selected.targets.length) {
				return ui.selected.targets[0] != target && !ui.selected.targets[0].hasSkillTag("noCompareSource") && target.countCards("h") && !target.hasSkillTag("noCompareTarget");
			}
			return true;
		},
		filterCard: true,
		discard: false,
		lose: false,
		delay: false,
		check(card) {
			if (_status.event.player.hp == 1) return 8 - get.value(card);
			return 6 - get.value(card);
		},
		selectTarget: 2,
		targetprompt: ["发起者", "拼点对象"],
		multitarget: true,
		content() {
			"step 0";
			player.give(cards, targets[0], "give");
			"step 1";
			if (targets[0].canCompare(targets[1])) targets[0].chooseToCompare(targets[1]);
			else event.finish();
			"step 2";
			if (result.bool) {
				targets[1].loseHp();
			} else if (result.tie) {
				targets[0].loseHp();
				targets[1].loseHp();
			} else {
				targets[0].loseHp();
			}
		},
		ai: {
			expose: 0.4,
			order: 4,
			result: {
				target(player, target) {
					if (ui.selected.targets.length) return -1;
					return -0.5;
				},
			},
		},
	},
	yjyongdi: {
		audio: "yongdi",
		unique: true,
		limited: true,
		trigger: { player: "phaseZhunbeiBegin" },
		animationColor: "thunder",
		skillAnimation: "legend",
		mark: true,
		intro: {
			content: "limited",
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt2("yjyongdi"), (card, player, target) => {
					return target.hasSex("male") || target.name == "key_yuri";
				})
				.set("ai", target => {
					if (!_status.event.goon) return 0;
					var player = _status.event.player;
					var att = get.attitude(player, target);
					if (att <= 1) return 0;
					var mode = get.mode();
					if (mode == "identity" || (mode == "versus" && _status.mode == "four")) {
						if (
							target.getStockSkills(true, true).some(i => {
								if (target.hasSkill(i)) return false;
								let info = get.info(i);
								return info && info.zhuSkill;
							})
						)
							return att * 2;
					}
					return att;
				})
				.set("goon", !player.hasUnknown(Math.round(game.players.length / 4 - 0.2)))
				.forResult();
		},
		async content(event, trigger, player) {
			player.awakenSkill("yjyongdi");
			let target = event.targets[0],
				mode = get.mode();
			if (player !== target && (mode !== "identity" || player.identity !== "nei")) player.addExpose(0.3);
			target.gainMaxHp(true);
			target.recover();
			if (mode == "identity" || (mode == "versus" && _status.mode == "four") || mode == "doudizhu") {
				let skills = target.getStockSkills(true, true).filter(i => {
					if (target.hasSkill(i)) return false;
					let info = get.info(i);
					return info && info.zhuSkill;
				});
				if (skills.length) target.addSkills(skills);
			}
		},
	},
	//用间篇豪华版盒子许攸
	yjshicai: {
		audio: "spshicai",
		enable: "phaseUse",
		usable: 1,
		filterCard: true,
		position: "he",
		prompt() {
			var str = "弃置一张牌，然后获得";
			if (get.itemtype(_status.pileTop) == "card") str += get.translation(_status.pileTop);
			else str += "牌堆顶的一张牌";
			return str;
		},
		check(card) {
			var player = _status.event.player;
			var cardx = _status.pileTop;
			if (get.itemtype(cardx) != "card") return 0;
			var val = player.getUseValue(cardx, null, true);
			if (!val) return 0;
			var val2 = player.getUseValue(card, null, true);
			return (val - val2) / Math.max(0.1, get.value(card));
		},
		group: ["yjshicai_mark"],
		content() {
			var card = get.cards()[0];
			player.gain(card, "gain2").gaintag.add("yjshicai_clear");
			player.addTempSkill("yjshicai_clear", "phaseUseAfter");
		},
		ai: {
			order: 3,
			result: { player: 1 },
		},
		subSkill: {
			mark: {
				trigger: { player: "phaseBegin" },
				silent: true,
				firstDo: true,
				content() {
					player.addTempSkill("spshicai2");
				},
			},
			clear: {
				trigger: {
					player: "loseAfter",
					global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"],
				},
				onremove(player, skill) {
					player.removeGaintag(skill);
				},
				forced: true,
				charlotte: true,
				popup: false,
				filter(event, player) {
					if (event.name == "lose") {
						for (var i in event.gaintag_map) {
							if (event.gaintag_map[i].includes("yjshicai_clear")) return true;
						}
						return false;
					}
					return player.hasHistory("lose", function (evt) {
						if (evt.getParent() != event) return false;
						for (var i in evt.gaintag_map) {
							if (evt.gaintag_map[i].includes("yjshicai_clear")) return true;
						}
					});
				},
				content() {
					delete player.getStat("skill").yjshicai;
				},
			},
		},
	},
	yjchenggong: {
		audio: "chenggong",
		trigger: {
			global: "useCardToPlayered",
		},
		filter(event, player) {
			return event.isFirstTarget && event.targets.length > 1 && event.player.isIn();
		},
		check(event, player) {
			return get.attitude(player, event.player) > 0;
		},
		logTarget: "player",
		content() {
			trigger.player.draw();
		},
		ai: { expose: 0.2 },
	},
	yjzezhu: {
		audio: "zezhu",
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			var zhu = get.zhu(player);
			if (!zhu) return false;
			return zhu.countGainableCards(player, zhu == player ? "ej" : "hej");
		},
		filterTarget(card, player, target) {
			var zhu = get.zhu(player);
			return target == zhu;
		},
		selectTarget: 1,
		content() {
			"step 0";
			player.gainPlayerCard(target, player == target ? "ej" : "hej", true);
			"step 1";
			if (!player.countCards("he") || player == target) event.finish();
			else player.chooseCard("择主：交给" + get.translation(target) + "一张牌", "he", true);
			"step 2";
			player.give(result.cards, target);
		},
		ai: {
			order: 2.9,
			result: { player: 1 },
		},
	},
	//用间beta董卓
	yjtuicheng: {
		audio: 2,
		enable: "phaseUse",
		viewAs: { name: "tuixinzhifu", isCard: true },
		filterCard: () => false,
		selectCard: -1,
		log: false,
		precontent() {
			player.logSkill("yjtuicheng");
			player.loseHp();
		},
		ai: {
			effect: {
				player(card, player) {
					if (get.name(card) != "tuixinzhifu" || _status.event.skill != "yjtuicheng") return;
					if (player.hp < 3) return "zeroplayertarget";
					if (player.hasSkill("yjshicha") && !player.hasHistory("useSkill", evt => evt.skill == "yjtuicheng")) return [1, 2];
					return "zeroplayertarget";
				},
			},
		},
	},
	yjyaoling: {
		audio: 2,
		trigger: {
			player: "phaseUseEnd",
		},
		direct: true,
		content() {
			"step 0";
			player
				.chooseTarget(get.prompt("yjyaoling"), "减1点体力上限，选择一名其他角色A和一名角色B，令A选择对B使用杀或被你弃牌", 2, (card, player, target) => {
					if (!ui.selected.targets.length) return target != player;
					return ui.selected.targets[0].canUse("sha", target, false);
				})
				.set("targetprompt", ["打人", "被打"])
				.set("complexSelect", true)
				.set("ai", target => {
					if (!get.event("check")) return -1;
					var player = _status.event.player;
					if (!ui.selected.targets.length) return get.effect(target, { name: "guohe_copy2" }, player, player);
					var targetx = ui.selected.targets[0];
					return get.effect(target, { name: "sha" }, targetx, player) + 5;
				})
				.set(
					"check",
					(function () {
						if (player.maxHp < 2) return false;
						if (player.hasSkill("yjshicha") && !player.hasHistory("useSkill", evt => evt.skill == "yjtuicheng")) return true;
						if (player.maxHp > 2 && player.getDamagedHp() > 1) return true;
						return false;
					})()
				);
			"step 1";
			if (result.bool) {
				var targets = result.targets;
				event.targets = targets;
				player.logSkill("yjyaoling", targets, false);
				player.line2(targets);
				player.loseMaxHp();
				targets[0]
					.chooseToUse(function (card, player, event) {
						if (get.name(card) != "sha") return false;
						return lib.filter.filterCard.apply(this, arguments);
					}, "耀令：对" + get.translation(targets[1]) + "使用一张杀，或令" + get.translation(player) + "弃置你的一张牌")
					.set("targetRequired", true)
					.set("filterTarget", function (card, player, target) {
						if (target != _status.event.sourcex && !ui.selected.targets.includes(_status.event.sourcex)) return false;
						return lib.filter.filterTarget.apply(this, arguments);
					})
					.set("sourcex", targets[1]);
			} else event.finish();
			"step 2";
			if (!result.bool && targets[0].countDiscardableCards(player, "he")) {
				player.discardPlayerCard(targets[0], "he", true);
			}
		},
	},
	yjshicha: {
		audio: 2,
		trigger: { player: "phaseDiscardBegin" },
		forced: true,
		filter(event, player) {
			var tuicheng = false,
				yaoling = false;
			player.getHistory("useSkill", evt => {
				if (evt.skill == "yjtuicheng") tuicheng = true;
				if (evt.skill == "yjyaoling") yaoling = true;
			});
			return !(tuicheng && yaoling);
		},
		content() {
			player.addTempSkill("yjshicha_limit");
		},
		subSkill: {
			limit: {
				charlotte: true,
				mark: true,
				intro: { content: "本回合手牌上限为1" },
				mod: {
					maxHandcard: () => 1,
				},
			},
		},
		ai: {
			neg: true,
		},
	},
	yjyongquan: {
		audio: 2,
		trigger: { player: "phaseJieshuBegin" },
		zhuSkill: true,
		filter(event, player) {
			return (
				player.hasZhuSkill("yjyongquan") &&
				game.hasPlayer(current => {
					return current != player && player.hasZhuSkill(current) && current.group == "qun";
				})
			);
		},
		logTarget(event, player) {
			return game.filterPlayer(current => {
				return current != player && player.hasZhuSkill(current) && current.group == "qun";
			});
		},
		content() {
			"step 0";
			var targets = lib.skill.yjyongquan.logTarget(trigger, player);
			event.targets = targets;
			"step 1";
			var target = targets.shift();
			event.target = target;
			target
				.chooseCard("拥权：是否交给" + get.translation(player) + "一张牌？", "he")
				.set("ai", card => {
					if (_status.event.goon) return 4.5 - get.value(card);
					return 0;
				})
				.set("goon", get.attitude(target, player) > 3);
			"step 2";
			if (result.bool) {
				target.line(player);
				target.give(result.cards, player);
			}
			"step 3";
			if (targets.length) event.goto(1);
		},
	},
	//用间beta甘宁的新版
	yjjielve: {
		audio: 2,
		enable: "phaseUse",
		viewAs: { name: "chenghuodajie" },
		filterCard(card, player) {
			if (ui.selected.cards.length) return get.color(card) == get.color(ui.selected.cards[0]);
			var cards = player.getCards("hes");
			for (var cardx of cards) {
				if (card != cardx && get.color(card) == get.color(cardx)) return true;
			}
			return false;
		},
		position: "hes",
		selectCard: 2,
		complexCard: true,
		check(card) {
			return 5 - get.value(card);
		},
		onuse(links, player) {
			player.addTempSkill("yjjielve_check");
		},
		subSkill: {
			check: {
				trigger: { source: "damageSource" },
				forced: true,
				charlotte: true,
				popup: false,
				filter(event, player) {
					return event.card && event.card.name == "chenghuodajie" && event.getParent().skill == "yjjielve";
				},
				content() {
					player.tempBanSkill("yjjielve");
				},
			},
		},
	},
	//用间beta张飞
	yjmangji: {
		audio: 2,
		forced: true,
		trigger: {
			player: ["loseAfter", "damageEnd", "loseHpEnd", "recoverEnd"],
			global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"],
		},
		direct: true,
		filter(event, player) {
			if (player.hp < 1 || !player.countDiscardableCards(player, "h")) return false;
			if (["damage", "loseHp", "recover"].includes(event.name)) return true;
			var evt = event.getl(player);
			if (event.name == "equip" && event.player == player) return !evt || evt.cards.length != 1;
			if (!evt || !evt.es.length) return false;
			return game.hasPlayer(current => player.canUse("sha", current, false));
		},
		content() {
			"step 0";
			player.chooseCardTarget({
				prompt: "莽击：弃置一张手牌，视为对一名其他角色使用一张【杀】",
				forced: true,
				filterCard: lib.filter.cardDiscardable,
				filterTarget(card, player, target) {
					return player.canUse("sha", target, false);
				},
				ai2(target) {
					return get.effect(target, { name: "sha" }, _status.event.player);
				},
			});
			"step 1";
			if (result.bool) {
				var target = result.targets[0],
					cards = result.cards;
				player.logSkill("yjmangji", target);
				player.discard(cards);
				if (player.canUse("sha", target, false)) player.useCard({ name: "sha", isCard: true }, target, false);
			}
		},
	},
	//用间beta曹洪
	yjlifeng: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		locked: false,
		filter(event, player) {
			for (var card of ui.discardPile.childNodes) {
				if (get.type(card) == "equip") return true;
			}
			return false;
		},
		content() {
			"step 0";
			var cards = Array.from(ui.discardPile.childNodes).filter(i => get.type(i) == "equip");
			player.chooseButton(["厉锋：获得一张装备牌", cards], cards.length > 0).set("ai", get.buttonValue);
			"step 1";
			if (result.bool) {
				var card = result.links[0];
				player.gain(card, "gain2");
			}
		},
		ai: {
			order: 10,
			result: { player: 1 },
			effect: {
				target(card, player, target) {
					if (card && get.type(card) == "equip" && _status.event.skill == "_gifting") return 0;
				},
			},
		},
		mod: {
			cardGiftable(card, player) {
				return get.type(card) == "equip";
			},
		},
	},
	//用间篇李儒
	yjdumou: {
		audio: 2,
		forced: true,
		mod: {
			cardname(card, player, name) {
				if (player == _status.currentPhase && card.name == "du") return "guohe";
			},
			aiValue(player, card, num) {
				if (card.name == "du") return get.value({ name: "guohe" });
			},
		},
		init: () => {
			game.addGlobalSkill("yjdumou_du");
		},
		onremove: () => {
			if (!game.hasPlayer(i => i.hasSkill("yjdumou", null, null, false), true)) game.removeGlobalSkill("yjdumou_du");
		},
		subSkill: {
			du: {
				mod: {
					cardname(card, player, name) {
						if (_status.currentPhase && player != _status.currentPhase && _status.currentPhase.hasSkill("yjdumou") && get.color(card) == "black") return "du";
					},
					aiValue(player, card, num) {
						if (get.name(card) == "du" && card.name != "du") return get.value({ name: card.name });
					},
				},
				trigger: { player: "dieAfter" },
				filter: () => {
					return !game.hasPlayer(i => i.hasSkill("yjdumou", null, null, false), true);
				},
				silent: true,
				forceDie: true,
				content: () => {
					game.removeGlobalSkill("yjdumou_du");
				},
			},
		},
		ai: { threaten: 2.1 },
	},
	yjweiquan: {
		audio: 2,
		enable: "phaseUse",
		skillAnimation: true,
		animationColor: "soil",
		filterTarget: true,
		limited: true,
		selectTarget: () => [1, game.roundNumber],
		contentBefore() {
			"step 0";
			player.awakenSkill("yjweiquan");
			player.chooseTarget("威权：选择获得牌的角色", true).set("ai", target => {
				var att = get.attitude(_status.event.player, target),
					num = target.needsToDiscard(targets.filter(i => i != target && i.countCards("h")).length);
				if (att > 0 && num <= 2) return 0;
				if (att < 0 && target.needsToDiscard(-5)) return -att - Math.sqrt(num);
				return att - Math.sqrt(num);
			});
			"step 1";
			event.getParent()._yjweiquan = result.targets[0];
		},
		content() {
			"step 0";
			var targetx = event.getParent()._yjweiquan;
			if (target == targetx || !target.countCards("h")) event.finish();
			else target.chooseCard("威权：将一张手牌交给" + get.translation(targetx), true);
			"step 1";
			if (result.bool) {
				var targetx = event.getParent()._yjweiquan;
				target.give(result.cards, targetx);
			}
		},
		contentAfter() {
			var targetx = event.getParent()._yjweiquan;
			if (targetx.countCards("h") > targetx.hp) {
				var next = targetx.phase();
				event.next.remove(next);
				event.getParent().after.push(next);
				next.player = targetx;
				next._noTurnOver = true;
				next._triggered = null;
				next.setContent(function () {
					game.broadcastAll(function () {
						if (ui.tempnowuxie) {
							ui.tempnowuxie.close();
							delete ui.tempnowuxie;
						}
					});
					player.phaseDiscard();
					if (!player.noPhaseDelay) game.delayx();
					delete player._noSkill;
				});
			}
		},
		ai: {
			order: 6,
			result: {
				player(player) {
					var num = game.countPlayer(current => get.attitude(player, current) < 0 && current.countCards("h"));
					if (
						(game.roundNumber < num && player.hp > 2) ||
						!game.hasPlayer(current => {
							return (get.attitude(player, current) > 0 && current.needsToDiscard(num) < 2) || (get.attitude(player, current) < 0 && current.needsToDiscard(-5));
						})
					)
						return -10;
					return 1;
				},
				target: -1,
			},
		},
	},
	yjrenwang: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			for (var card of ui.discardPile.childNodes) {
				if (get.color(card) == "black" && get.type(card) == "basic") return true;
			}
			return false;
		},
		content() {
			"step 0";
			var cards = Array.from(ui.discardPile.childNodes).filter(i => get.color(i) == "black" && get.type(i) == "basic");
			player.chooseButton(["人望：选择一张黑色基本牌", cards], cards.length > 0).set("ai", get.buttonValue);
			"step 1";
			if (result.bool) {
				var card = result.links[0];
				event.card = card;
				player.chooseTarget("选择一名角色获得" + get.translation(card), true).set("ai", target => get.attitude(_status.event.player, target));
			} else event.finish();
			"step 2";
			if (result.bool) {
				var target = result.targets[0];
				player.line(target);
				target.gain(card, "gain2");
			}
		},
		ai: {
			order: 10,
			result: { player: 1 },
		},
	},
	//群曹操
	yjxiandao: {
		trigger: { player: "giftAccepted" },
		usable: 1,
		forced: true,
		locked: false,
		filter: (event, player) => event.target != player && event.target.isIn(),
		logTarget: "target",
		content() {
			"step 0";
			event.target = trigger.target;
			event.card = trigger.card;
			event.target.markAuto("yjxiandao_block", [get.suit(event.card, false)]);
			event.target.addTempSkill("yjxiandao_block");
			"step 1";
			var type = get.type(card);
			if (type == "trick") player.draw(2);
			if (type == "equip") {
				if (
					target.countGainableCards(player, "he", function (cardx) {
						return cardx != card;
					}) > 0
				)
					player
						.gainPlayerCard(target, "he", true)
						.set("card", card)
						.set("filterButton", function (button) {
							return button.link != _status.event.card;
						});
				if (get.subtype(card, false) == "equip1") target.damage();
			}
		},
		subSkill: {
			block: {
				charlotte: true,
				onremove: true,
				mod: {
					cardEnabled(card, player) {
						if (player.getStorage("yjxiandao_block").includes(get.suit(card))) return false;
					},
					cardRespondable(card, player) {
						if (player.getStorage("yjxiandao_block").includes(get.suit(card))) return false;
					},
					cardSavable(card, player) {
						if (player.getStorage("yjxiandao_block").includes(get.suit(card))) return false;
					},
				},
				mark: true,
				intro: { content: "不能使用或打出$牌" },
			},
		},
	},
	yjsancai: {
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return player.countCards("h") > 0;
		},
		content() {
			"step 0";
			player.showHandcards();
			var hs = player.getCards("h");
			if (hs.length > 1) {
				var type = get.type2(hs[0], player);
				for (var i = 1; i < hs.length; i++) {
					if (get.type(hs[i]) != type) {
						event.finish();
						return;
					}
				}
			}
			"step 1";
			player.chooseCardTarget({
				prompt: "是否赠予一张手牌？",
				filterCard: true,
				filterTarget: lib.filter.notMe,
			});
			"step 2";
			if (result.bool) {
				var target = result.targets[0];
				player.line(target, "green");
				player.gift(result.cards, target);
			}
		},
		ai: {
			combo: "yixiandao",
		},
	},
	yjyibing: {
		trigger: {
			player: "gainAfter",
			global: "loseAsyncAfter",
		},
		direct: true,
		filter(event, player) {
			if (event.getParent().name == "gift") return false;
			if (event.getParent("yjyibing").player == player) return false;
			var evt = event.getParent("phaseDraw"),
				hs = player.getCards("h"),
				cards = event.getg(player);
			return (
				cards.length > 0 &&
				(!evt || evt.player != player) &&
				cards.filter(function (card) {
					return hs.includes(card) && game.checkMod(card, player, "unchanged", "cardEnabled2", player) !== false;
				}).length == cards.length &&
				player.hasUseTarget(
					{
						name: "sha",
						cards: event.cards,
					},
					false
				)
			);
		},
		content() {
			var cards = trigger.getg(player);
			player.chooseUseTarget(get.prompt("yjyibing"), "将" + get.translation(cards) + "当做【杀】使用", "sha", cards, false, "nodistance").logSkill = "yjyibing";
		},
	},
	//龙羽飞
	longyi: {
		enable: ["chooseToUse", "chooseToRespond"],
		filter(event, player) {
			if (event.type == "wuxie") return false;
			var hs = player.getCards("h");
			if (!hs.length) return false;
			for (var i of hs) {
				if (game.checkMod(i, player, "unchanged", "cardEnabled2", player) === false) return false;
			}
			for (var i of lib.inpile) {
				if (i != "du" && get.type(i) == "basic" && event.filterCard({ name: i, cards: hs }, player, event)) return true;
				if (i == "sha") {
					var list = ["fire", "thunder", "ice"];
					for (var j of list) {
						if (event.filterCard({ name: i, nature: j, cards: hs }, player, event)) return true;
					}
				}
			}
			return false;
		},
		chooseButton: {
			dialog(event, player) {
				var vcards = [],
					hs = player.getCards("h");
				for (var i of lib.inpile) {
					if (i != "du" && get.type(i) == "basic" && event.filterCard({ name: i, cards: hs }, player, event)) vcards.push(["基本", "", i]);
					if (i == "sha") {
						for (var j of lib.inpile_nature) {
							if (event.filterCard({ name: i, nature: j, cards: hs }, player, event)) vcards.push(["基本", "", i, j]);
						}
					}
				}
				return ui.create.dialog("龙裔", [vcards, "vcard"]);
			},
			check(button, player) {
				if (_status.event.getParent().type != "phase") return 1;
				return _status.event.player.getUseValue({
					name: button.link[2],
					nature: button.link[3],
				});
			},
			backup(links, player) {
				return {
					audio: "longyi",
					popname: true,
					viewAs: { name: links[0][2], nature: links[0][3] },
					filterCard: true,
					selectCard: -1,
					position: "h",
				};
			},
			prompt(links, player) {
				return "将所有手牌当做" + (get.translation(links[0][3]) || "") + get.translation(links[0][2]) + "使用或打出";
			},
		},
		hiddenCard(player, name) {
			return name != "du" && get.type(name) == "basic" && player.countCards("h") > 0;
		},
		ai: {
			respondSha: true,
			respondShan: true,
			skillTagFilter(player) {
				return player.countCards("h") > 0;
			},
			order: 0.5,
			result: {
				player(player) {
					if (_status.event.dying) {
						return get.attitude(player, _status.event.dying);
					}
					if (_status.event.type == "respondShan") return 1;
					var val = 0,
						hs = player.getCards("h"),
						max = 0;
					for (var i of hs) {
						val += get.value(i, player);
						if (get.type(i, null, player) == "trick") max += 5;
					}
					if (player.hasSkill("zhenjue")) max += 7;
					return val <= max ? 1 : 0;
				},
			},
		},
		group: "longyi_effect",
		subSkill: {
			effect: {
				trigger: { player: ["useCard", "respond"] },
				forced: true,
				charlotte: true,
				popup: false,
				filter(event, player) {
					if (event.skill != "longyi_backup") return false;
					for (var i of event.cards) {
						var type = get.type2(i, player);
						if (type == "equip" || type == "trick") return true;
					}
					return false;
				},
				content() {
					var map = {};
					for (var i of trigger.cards) {
						map[get.type2(i, player)] = true;
					}
					if (map.trick) player.draw();
					if (map.equip && trigger.directHit) trigger.directHit.addArray(game.players);
				},
			},
			backup: {},
		},
	},
	zhenjue: {
		trigger: { global: "phaseJieshuBegin" },
		filter(event, player) {
			return player.countCards("h") == 0;
		},
		logTarget: "player",
		content() {
			"step 0";
			trigger.player
				.chooseToDiscard("he", "弃置一张牌，或令" + get.translation(player) + "摸一张牌")
				.set("ai", function (card) {
					if (_status.event.goon) return 7 - get.value(card);
					return -get.value(card);
				})
				.set("goon", get.attitude(trigger.player, player) < 0);
			"step 1";
			if (!result.bool) player.draw();
		},
	},
	//群刘备
	jsprende: {
		audio: "rerende",
		enable: "phaseUse",
		filterCard: true,
		selectCard: [1, Infinity],
		discard: false,
		lose: false,
		delay: false,
		filterTarget(card, player, target) {
			return player != target;
		},
		onremove: true,
		check(card) {
			if (ui.selected.cards.length && ui.selected.cards[0].name == "du") return 0;
			if (!ui.selected.cards.length && card.name == "du") return 20;
			var player = get.owner(card);
			if (ui.selected.cards.length >= Math.max(2, player.countCards("h") - player.hp)) return 0;
			if (player.hp == player.maxHp || player.storage.jsprende < 0 || player.countCards("h") <= 1) {
				var players = game.filterPlayer();
				for (var i = 0; i < players.length; i++) {
					if (players[i].hasSkill("haoshi") && !players[i].isTurnedOver() && !players[i].hasJudge("lebu") && get.attitude(player, players[i]) >= 3 && get.attitude(players[i], player) >= 3) {
						return 11 - get.value(card);
					}
				}
				if (player.countCards("h") > player.hp) return 10 - get.value(card);
				if (player.countCards("h") > 2) return 6 - get.value(card);
				return -1;
			}
			return 10 - get.value(card);
		},
		content() {
			"step 0";
			var evt = _status.event.getParent("phaseUse");
			if (evt && evt.name == "phaseUse" && !evt.jsprende) {
				var next = game.createEvent("jsprende_clear");
				_status.event.next.remove(next);
				evt.after.push(next);
				evt.jsprende = true;
				next.player = player;
				next.setContent(function () {
					delete player.storage.jsprende;
				});
			}
			player.give(cards, target);
			if (typeof player.storage.jsprende != "number") {
				player.storage.jsprende = 0;
			}
			if (player.storage.jsprende >= 0) {
				player.storage.jsprende += cards.length;
				if (player.storage.jsprende >= 2) {
					var list = [];
					if (
						lib.filter.cardUsable({ name: "sha", isCard: true }, player, event.getParent("chooseToUse")) &&
						game.hasPlayer(function (current) {
							return player.canUse("sha", current);
						})
					) {
						list.push(["基本", "", "sha"]);
					}
					for (var i of lib.inpile_nature) {
						if (
							lib.filter.cardUsable({ name: "sha", nature: i, isCard: true }, player, event.getParent("chooseToUse")) &&
							game.hasPlayer(function (current) {
								return player.canUse({ name: "sha", nature: i, isCard: true }, current);
							})
						) {
							list.push(["基本", "", "sha", i]);
						}
					}
					if (
						lib.filter.cardUsable({ name: "tao", isCard: true }, player, event.getParent("chooseToUse")) &&
						game.hasPlayer(function (current) {
							return player.canUse("tao", current);
						})
					) {
						list.push(["基本", "", "tao"]);
					}
					if (
						lib.filter.cardUsable({ name: "jiu", isCard: true }, player, event.getParent("chooseToUse")) &&
						game.hasPlayer(function (current) {
							return player.canUse("jiu", current);
						})
					) {
						list.push(["基本", "", "jiu"]);
					}
					if (list.length) {
						player.chooseButton(["是否视为使用一张基本牌？", [list, "vcard"]]).set("ai", function (button) {
							var player = _status.event.player;
							var card = {
								name: button.link[2],
								nature: button.link[3],
								isCard: true,
							};
							if (card.name == "tao") {
								if (player.hp == 1 || (player.hp == 2 && !player.hasShan()) || player.needsToDiscard()) {
									return 5;
								}
								return 1;
							}
							if (card.name == "sha") {
								if (
									game.hasPlayer(function (current) {
										return player.canUse(card, current) && get.effect(current, card, player, player) > 0;
									})
								) {
									if (card.nature == "fire") return 2.95;
									if (card.nature == "thunder" || card.nature == "ice") return 2.92;
									return 2.9;
								}
								return 0;
							}
							if (card.name == "jiu") {
								return 0.5;
							}
							return 0;
						});
					} else {
						event.finish();
					}
					player.storage.jsprende = -1;
				} else {
					event.finish();
				}
			} else {
				event.finish();
			}
			"step 1";
			if (result && result.bool && result.links[0]) {
				var card = { name: result.links[0][2], nature: result.links[0][3], isCard: true };
				player.chooseUseTarget(card, true);
			}
		},
		ai: {
			fireAttack: true,
			order(skill, player) {
				if (player.hp < player.maxHp && player.storage.jsprende < 2 && player.countCards("h") > 1) {
					return 10;
				}
				return 4;
			},
			result: {
				target(player, target) {
					if (target.hasSkillTag("nogain")) return 0;
					if (ui.selected.cards.length && ui.selected.cards[0].name == "du") {
						if (target.hasSkillTag("nodu")) return 0;
						return -10;
					}
					if (target.hasJudge("lebu")) return 0;
					var nh = target.countCards("h");
					var np = player.countCards("h");
					if (player.hp == player.maxHp || player.storage.jsprende < 0 || player.countCards("h") <= 1) {
						if (nh >= np - 1 && np <= player.hp && !target.hasSkill("haoshi")) return 0;
					}
					return Math.max(1, 5 - nh);
				},
			},
			effect: {
				target_use(card, player, target) {
					if (player == target && get.type(card) == "equip") {
						if (player.countCards("e", { subtype: get.subtype(card) })) {
							if (
								game.hasPlayer(function (current) {
									return current != player && get.attitude(player, current) > 0;
								})
							) {
								return 0;
							}
						}
					}
				},
			},
			threaten: 0.8,
		},
	},
	//曹安民
	nskuishe: {
		enable: "phaseUse",
		usable: 1,
		filterTarget(card, player, target) {
			return target != player && target.countCards("he") > 0;
		},
		content() {
			"step 0";
			player.choosePlayerCard(target, "he", true).set("ai", get.buttonValue);
			"step 1";
			if (result.bool) {
				var card = result.cards[0];
				event.card = card;
				player
					.chooseTarget("将" + get.translation(target) + "的" + (get.position(card) == "h" && !player.hasSkillTag("viewHandcard", null, target, true) ? "手牌" : get.translation(card)) + "交给一名角色", true, function (target) {
						return target != _status.event.getParent().target;
					})
					.set("ai", function (target) {
						var att = get.attitude(_status.event.player, target);
						if (_status.event.du) {
							if (target.hasSkillTag("nodu")) return 0;
							return -att;
						}
						if (target.hasSkillTag("nogain")) return 0.1;
						if (att > 0) {
							return att + Math.max(0, 5 - target.countCards("h"));
						}
						return att;
					})
					.set("du", event.card.name == "du");
			} else event.finish();
			"step 2";
			if (result.bool) {
				var target2 = result.targets[0];
				target.line(target2, "green");
				target2.gain(target, card, "giveAuto").giver = player;
			} else event.finish();
			"step 3";
			target
				.chooseToUse(function (card, player, event) {
					if (get.name(card) != "sha") return false;
					return lib.filter.filterCard.apply(this, arguments);
				}, "是否对" + get.translation(player) + "使用一张杀？")
				.set("targetRequired", true)
				.set("complexSelect", true)
				.set("filterTarget", function (card, player, target) {
					if (target != _status.event.sourcex && !ui.selected.targets.includes(_status.event.sourcex)) return false;
					return lib.filter.filterTarget.apply(this, arguments);
				})
				.set("sourcex", player);
		},
		ai: {
			order: 6,
			expose: 0.2,
			result: {
				target: -1.5,
				player(player, target) {
					if (!target.canUse("sha", player)) return 0;
					if (target.countCards("h") == 1) return 0.1;
					if (player.hasShan()) return -0.5;
					if (player.hp <= 1) return -2;
					if (player.hp <= 2) return -1;
					return 0;
				},
			},
		},
	},
	//文和乱武
	nsyangwu: {
		enable: "phaseUse",
		usable: 1,
		filterCard: { suit: "heart" },
		filterTarget(card, player, target) {
			return target != player && target.countCards("h") > player.countCards("h");
		},
		filter(event, player) {
			var info = lib.skill.nsyangwu;
			return (
				player.countCards("h", info.filterCard) &&
				game.hasPlayer(function (target) {
					return info.filterTarget(null, player, target);
				})
			);
		},
		check(card) {
			var num = 0;
			var player = _status.event.player;
			game.countPlayer(function (current) {
				if (current != player && get.attitude(player, current) < 0) num = Math.max(num, current.countCards("h") - player.countCards("h"));
			});
			return Math.ceil((num + 1) / 2) * 2 + 4 - get.value(card);
		},
		content() {
			var num = Math.ceil((target.countCards("h") - player.countCards("h")) / 2);
			if (num) player.gainPlayerCard(target, true, "h", num, "visible");
		},
		ai: {
			order: 4,
			result: {
				target(player, target) {
					return player.countCards("h") - target.countCards("h");
				},
			},
		},
	},
	nslulve: {
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return game.hasPlayer(function (current) {
				return current.countCards("e") > 0 && current.countCards("e") <= player.countCards("he");
			});
		},
		filterCard() {
			if (ui.selected.targets.length) return false;
			return true;
		},
		position: "he",
		selectCard: [1, Infinity],
		complexSelect: true,
		complexCard: true,
		filterTarget(card, player, target) {
			return target != player && target.countCards("e") > 0 && ui.selected.cards.length == target.countCards("e");
		},
		check(card) {
			var player = _status.event.player;
			if (
				game.hasPlayer(function (current) {
					return current != player && current.countCards("e") > 0 && ui.selected.cards.length == current.countCards("e") && get.damageEffect(current, player, player) > 0;
				})
			)
				return 0;
			switch (ui.selected.cards.length) {
				case 0:
					return 8 - get.value(card);
				case 1:
					return 6 - get.value(card);
				case 2:
					return 3 - get.value(card);
				default:
					return 0;
			}
		},
		content() {
			target.damage("nocard");
		},
		ai: {
			damage: true,
			order: 2,
			result: {
				target(player, target) {
					return get.damageEffect(target, player);
				},
			},
			expose: 0.3,
		},
	},
	nsfeixiong: {
		trigger: { player: "phaseUseBegin" },
		direct: true,
		filter(event, player) {
			return (
				player.countCards("h") > 0 &&
				game.hasPlayer(function (current) {
					return current != player && player.canCompare(current);
				})
			);
		},
		content() {
			"step 0";
			player
				.chooseTarget(get.prompt2("nsfeixiong"), function (card, player, target) {
					return player != target && player.canCompare(target);
				})
				.set("ai", function (target) {
					var player = _status.event.player;
					var hs = player.getCards("h").sort(function (a, b) {
						return b.number - a.number;
					});
					var ts = target.getCards("h").sort(function (a, b) {
						return b.number - a.number;
					});
					if (!hs.length || !ts.length) return 0;
					if (hs[0].number > ts[0].number) return get.damageEffect(target, player, player);
					return 0;
				});
			"step 1";
			if (result.bool) {
				var target = result.targets[0];
				event.target = target;
				player.logSkill("nsfeixiong", target);
				if (get.mode() !== "identity" || player.identity !== "nei") player.addExpose(0.2);
				player.chooseToCompare(target);
			} else event.finish();
			"step 2";
			if (!result.tie) {
				var targets = [player, target];
				if (result.bool) targets.reverse();
				targets[0].damage(targets[1]);
			}
		},
	},
	nscesuan: {
		trigger: { player: "damageBegin3" },
		forced: true,
		content() {
			"step 0";
			trigger.cancel();
			event.lose = player.loseMaxHp();
			"step 1";
			if (event.lose && event.lose.loseHp) player.draw();
		},
		ai: {
			neg: true,
			filterDamage: true,
			skillTagFilter(player, tag, arg) {
				if (tag === "filterDamage" && arg && arg.player) {
					if (arg.player.hasSkillTag("jueqing", false, player)) return false;
				}
			},
		},
	},
	//S贾诩
	nsyice: {
		trigger: {
			player: "loseAfter",
			global: ["cardsDiscardAfter", "loseAsyncAfter"],
		},
		filter(event, player) {
			if (event.name != "cardsDiscard") {
				if (event.type != "discard") return false;
				var evt = event.getl(player);
				return evt.cards2 && evt.cards2.filterInD("d").length > 0;
			} else {
				var evt = event.getParent();
				if (evt.name != "orderingDiscard" || !evt.relatedEvent || evt.relatedEvent.player != player || !["useCard", "respond"].includes(evt.relatedEvent.name)) return false;
				return event.cards.filterInD("d").length > 0;
			}
		},
		forced: true,
		content() {
			"step 0";
			var evt = trigger.getParent().relatedEvent;
			if ((trigger.name == "discard" && !trigger.delay) || (evt && evt.name == "respond")) game.delayx();
			"step 1";
			var cards;
			if (trigger.getl) cards = trigger.getl(player).cards2.filterInD("d");
			else cards = trigger.cards.filterInD("d");
			if (cards.length == 1) event._result = { bool: true, links: cards };
			else {
				var dialog = ["遗策：选择要放置的卡牌", '<div class="text center">（从左到右为从旧到新，后选择的后置入）</div>', cards];
				var cards2 = player.getExpansions("nsyice");
				cards2.reverse();
				if (cards2.length) {
					dialog.push('<div class="text center">原有“策”</div>');
					dialog.push(cards2);
				}
				player
					.chooseButton(dialog, true, cards.length)
					.set("filterButton", function (button) {
						return _status.event.cards.includes(button.link);
					})
					.set("cards", cards);
			}
			"step 2";
			player.addToExpansion(result.links, "gain2").gaintag.add("nsyice");
			"step 3";
			var storage = player.getExpansions("nsyice");
			var bool = false;
			for (var i = 0; i < storage.length; i++) {
				for (var j = storage.length - 1; j > i; j--) {
					if (get.number(storage[i]) == get.number(storage[j])) {
						bool = true;
						break;
					}
				}
				if (bool) break;
			}
			if (bool) {
				event.cards = storage.splice(i, j - i + 1);
			} else event.finish();
			"step 4";
			var cardsx = [];
			cardsx.push(cards.shift());
			cardsx.push(cards.pop());
			if (cards.length) player.gain(cards, "gain2");
			event.cards = cardsx;
			"step 5";
			player.chooseButton(["将一张牌置于牌堆顶，将另一张牌置于牌堆底", cards], true);
			"step 6";
			player.lose(event.cards, ui.cardPile).set("topper", result.links[0]).insert_index = function (event, card) {
				if (card == event.topper) return ui.cardPile.firstChild;
				return null;
			};
			if (_status.dying.length) event.finish();
			"step 7";
			player.chooseTarget("对一名角色造成1点伤害", true).set("ai", function (target) {
				var player = _status.event.player;
				return get.damageEffect(target, player, player);
			});
			"step 8";
			if (result.bool) {
				var target = result.targets[0];
				player.line(target);
				target.damage("nocard");
			}
		},
		onremove(player, skill) {
			var cards = player.getExpansions(skill);
			if (cards.length) player.loseToDiscardpile(cards);
		},
		marktext: "策",
		intro: {
			content: "expansion",
			markcount: "expansion",
		},
	},
	//用间篇
	yjxuepin: {
		enable: "phaseUse",
		usable: 1,
		filterTarget(event, player, target) {
			return player.inRange(target) && target.countDiscardableCards(player, "he") > 0;
		},
		content() {
			"step 0";
			player.loseHp();
			"step 1";
			if (target.countDiscardableCards(player, "he") > 0) player.discardPlayerCard(target, 2, "he", true);
			else event.finish();
			"step 2";
			if (result.bool && result.cards.length == 2 && get.type2(result.cards[0], result.cards[0].original == "h" ? target : false) == get.type2(result.cards[1], result.cards[1].original == "h" ? target : false)) player.recover();
		},
		ai: {
			order: 4,
			result: {
				player(player, target) {
					if (player.hp == 1) return -8;
					if (target.countCards("e") > 1) return 0;
					if (player.hp > 2 || target.countCards("h") > 1) return -0.5;
					return -2;
				},
				target(player, target) {
					if (target.countDiscardableCards(player, "he") < 2) return 0;
					return -2;
				},
			},
		},
	},
	nsjianglie: {
		trigger: { player: "useCardToPlayered" },
		filter(event, player) {
			return event.card.name == "sha" && event.target.countCards("h") > 0;
		},
		check(event, player) {
			return get.attitude(player, event.target) < 0;
		},
		logTarget: "target",
		content() {
			"step 0";
			trigger.target.showHandcards();
			"step 1";
			var cards = trigger.target.getCards("h");
			var list = [];
			for (var i = 0; i < cards.length; i++) {
				list.add(get.color(cards[i]));
			}
			if (list.length == 1) event._result = { control: list[0] };
			else {
				list.sort();
				trigger.target
					.chooseControl(list)
					.set("prompt", "选择弃置一种颜色的所有手牌")
					.set("ai", function () {
						var player = _status.event.player;
						if (get.value(player.getCards("h", { color: "red" })) >= get.value(player.getCards("h", { color: "black" }))) return "black";
						return "red";
					});
			}
			"step 2";
			trigger.target.discard(trigger.target.getCards("h", { color: result.control }));
		},
	},
	//桌游志贴纸
	spyinzhi: {
		trigger: { player: "damageEnd" },
		frequent: true,
		content() {
			"step 0";
			event.count = trigger.num;
			"step 1";
			event.count--;
			var cards = game.cardsGotoOrdering(get.cards(2)).cards;
			player.showCards(cards);
			event.count2 = 0;
			for (var i = 0; i < cards.length; i++) {
				if (get.suit(cards[i]) == "spade") {
					event.count2++;
					cards.splice(i--, 1);
				}
			}
			event.cards = cards;
			if (!event.count2 || !trigger.source) event.goto(4);
			"step 2";
			event.count2--;
			if (trigger.source.countCards("h") > 0) {
				player
					.chooseTarget("令一名角色获得" + get.translation(trigger.source) + "的一张手牌", function (card, player, target) {
						var source = _status.event.source;
						return target != source && source.countGainableCards(target, "h") > 0;
					})
					.set("source", trigger.source);
			} else event.goto(4);
			"step 3";
			if (result.bool) {
				var target = result.targets[0];
				player.line([trigger.source, target], "green");
				target.gainPlayerCard(trigger.source, "h", true);
				if (event.count2) event.goto(2);
			}
			"step 4";
			if (cards.length) player.gain(cards, "gain2", "log");
			"step 5";
			if (event.count > 0 && player.hasSkill(event.name) && !get.is.blocked(event.name, player)) {
				player.chooseBool(get.prompt2("spyinzhi")).set("frequentSkill", event.name);
			} else event.finish();
			"step 6";
			if (result.bool) {
				player.logSkill("spyinzhi");
				event.goto(1);
			}
		},
	},
	spmingjian: {
		trigger: { global: "phaseBegin" },
		direct: true,
		filter(event, player) {
			return player.countCards("he") > 0;
		},
		content() {
			"step 0";
			var next = player.chooseCard(get.prompt2("spmingjian", trigger.player), "he");
			next.set("ai", function (card) {
				var target = _status.event.getTrigger().player;
				var player = _status.event.player;
				if (get.attitude(player, target) > 0 && target.countCards("j") > 0) return 5 - get.value(card);
				return -1;
			});
			next.set("filterCard", function (card, player) {
				if (get.position(card) == "e") return lib.filter.cardDiscardable.apply(this, arguments);
				return true;
			});
			//next.set('logSkill',['spmingjian',trigger.player]);
			"step 1";
			if (result.bool) {
				player.logSkill("spmingjian", trigger.player);
				var card = result.cards[0];
				event.card = card;
				if (get.position(card) == "e") event._result = { index: 0 };
				else if (!lib.filter.cardDiscardable(card, player, event)) event._result = { index: 1 };
				else {
					var name = get.translation(trigger.player);
					player
						.chooseControl()
						.set("choiceList", ["令" + name + "跳过本回合的判定阶段", "令" + name + "于本回合的判定中不触发「判定结果生效前」的时机"])
						.set("ai", function () {
							return 0;
						});
				}
			} else event.finish();
			"step 2";
			if (result.index == 0) {
				player.discard(card);
				trigger.player.skip("phaseJudge");
			} else {
				trigger.player.addToExpansion(card, player, "giveAuto").gaintag.add("spmingjian_charlotte");
				trigger.player.addSkill("spmingjian_charlotte");
			}
		},
		ai: {
			expose: 0.25,
		},
	},
	spmingjian_charlotte: {
		trigger: { player: ["judgeBefore", "phaseAfter"] },
		forced: true,
		firstDo: true,
		silent: true,
		popup: false,
		charlotte: true,
		sourceSkill: "spmingjian",
		content() {
			if (trigger.name == "phase") player.removeSkill(event.name);
			else trigger.noJudgeTrigger = true;
		},
		onremove(player, skill) {
			var cards = player.getExpansions(skill);
			if (cards.length) player.loseToDiscardpile(cards);
		},
		marktext: "鉴",
		intro: {
			name: "明鉴",
			content: "expansion",
			markcount: "expansion",
		},
	},
	spshude: {
		trigger: { player: "phaseJieshuBegin" },
		frequent: true,
		filter(event, player) {
			return player.countCards("h") < player.maxHp;
		},
		content() {
			player.drawTo(player.maxHp);
		},
	},
	spfuluan: {
		enable: "phaseUse",
		usable: 1,
		filterTarget(card, player, target) {
			return player.inRange(target);
		},
		selectCard: 3,
		position: "he",
		check(card) {
			return 5 - get.value(card);
		},
		complexCard: true,
		filterCard(card, player) {
			if (!ui.selected.cards.length) return player.countCards("he", { suit: get.suit(card) }) > 2;
			return get.suit(card) == get.suit(ui.selected.cards[0]);
		},
		content() {
			target.turnOver();
			player.addTempSkill("spfuluan2");
		},
		ai: {
			order: 1,
			result: {
				target(player, target) {
					if (target.isTurnedOver()) return 2;
					return -1;
				},
			},
		},
	},
	spfuluan2: {
		mod: {
			cardEnabled(card) {
				if (card.name == "sha") return false;
			},
		},
	},
	spzhaoxin: {
		trigger: { player: "phaseDrawEnd" },
		check(event, player) {
			return player.getUseValue({ name: "sha", isCard: true }) > 0;
		},
		filter(event, player) {
			return player.countCards("h") > 0;
		},
		content() {
			"step 0";
			player.showHandcards();
			"step 1";
			player.chooseUseTarget("sha", false);
		},
	},
	splanggu: {
		trigger: { player: "damageEnd" },
		filter(event, player) {
			return get.itemtype(event.source) == "player";
		},
		logTarget: "source",
		content() {
			"step 0";
			player.judge();
			"step 1";
			if (trigger.source.countCards("h") > 0) {
				var next = player.discardPlayerCard(trigger.source, "h", [1, Infinity]);
				next.set("suit", result.suit);
				next.set("filterButton", function (button) {
					return get.suit(button.link) == _status.event.suit;
				});
				next.set("visible", true);
			}
		},
		group: "splanggu_rewrite",
	},
	splanggu_rewrite: {
		trigger: { player: "judge" },
		sourceSkill: "splanggu",
		filter(event, player) {
			return player.countCards("hs") > 0 && event.getParent().name == "splanggu";
		},
		direct: true,
		content() {
			"step 0";
			player
				.chooseCard("狼顾的判定结果为" + get.translation(trigger.player.judging[0]) + "，是否打出一张手牌进行代替？", "hs", function (card) {
					var player = _status.event.player;
					var mod2 = game.checkMod(card, player, "unchanged", "cardEnabled2", player);
					if (mod2 != "unchanged") return mod2;
					var mod = game.checkMod(card, player, "unchanged", "cardRespondable", player);
					if (mod != "unchanged") return mod;
					return true;
				})
				.set("ai", function (card) {
					return -1;
				});
			"step 1";
			if (result.bool) {
				player.respond(result.cards, "highlight", "splanggu", "noOrdering");
			} else {
				event.finish();
			}
			"step 2";
			if (result.bool) {
				if (trigger.player.judging[0].clone) {
					trigger.player.judging[0].clone.classList.remove("thrownhighlight");
					game.broadcast(function (card) {
						if (card.clone) {
							card.clone.classList.remove("thrownhighlight");
						}
					}, trigger.player.judging[0]);
					game.addVideo("deletenode", player, get.cardsInfo([trigger.player.judging[0].clone]));
				}
				game.cardsDiscard(trigger.player.judging[0]);
				trigger.player.judging[0] = result.cards[0];
				trigger.orderingCards.addArray(result.cards);
				game.log(trigger.player, "的判定牌改为", result.cards[0]);
				game.delay(2);
			}
		},
	},
	sphantong: {
		trigger: {
			player: "loseEnd",
		},
		frequent: true,
		filter(event, player) {
			return event.type == "discard" && event.getParent(3).name == "phaseDiscard" && event.cards.filterInD("d").length > 0;
		},
		content() {
			if (!player.storage.sphantong) player.storage.sphantong = [];
			var cards = trigger.cards.filterInD("d");
			player.storage.sphantong.addArray(cards);
			player.$gain2(cards);
			game.log(player, "将", cards, "置于武将牌上");
			player.markSkill("sphantong");
		},
		group: ["sphantong_gain"],
		derivation: ["hujia", "jijiang", "jiuyuan", "xueyi"],
		marktext: "诏",
		intro: {
			content: "cards",
			onunmark: "throw",
		},
	},
	sphantong_gain: {
		trigger: { global: "phaseBegin" },
		direct: true,
		sourceSkill: "sphantong",
		filter(event, player) {
			return player.storage.sphantong && player.storage.sphantong.length > 0;
		},
		content() {
			"step 0";
			player.chooseButton([get.prompt("sphantong"), player.storage.sphantong], function (button) {
				var player = _status.event.player;
				if (_status.currentPhase == player) {
					//血裔
					if (
						(player.hasJudge("lebu") || player.skipList.includes("phaseUse")) &&
						game.hasPlayer(function (current) {
							return current != player && current.group == "qun";
						})
					)
						return 1;
					//激将
					if (
						!player.hasJudge("lebu") &&
						!player.skipList.includes("phaseUse") &&
						game.hasPlayer(function (current) {
							return current != player && current.group == "shu" && current.hasSha() && get.attitude(player, current) > 0 && get.attitude(current, player) > 0;
						}) &&
						game.hasPlayer(function (target) {
							return player.canUse({ name: "sha" }, target) && get.effect(target, { name: "sha" }, player, player) > 0;
						})
					)
						return 1;
				}
				//护驾
				else if (
					!player.hasShan() &&
					game.hasPlayer(function (current) {
						return current != player && current.group == "wei" && current.mayHaveShan(player, "respond") && get.attitude(player, current) > 0 && get.attitude(current, player) > 0;
					})
				)
					return 1;
				return -1;
			});
			"step 1";
			if (result.bool) {
				player.logSkill("sphantong");
				var card = result.links[0];
				player.$throw(card);
				game.log(player, "将", card, "置入了弃牌堆");
				player.storage.sphantong.remove(card);
				player[player.storage.sphantong.length > 0 ? "markSkill" : "unmarkSkill"]("sphantong");
				game.cardsDiscard(card);
				var list = ["hujia", "jijiang", "jiuyuan", "xueyi"];
				for (var i = 0; i < list.length; i++) {
					if (player.hasSkill(list[i])) list.splice(i--, 1);
				}
				if (list.length) {
					player
						.chooseControl(list)
						.set("prompt", "选择获得以下技能中的一个")
						.set("ai", function () {
							var player = _status.event.player;
							if (_status.currentPhase == player) {
								//血裔
								if (
									(player.hasJudge("lebu") || player.skipList.includes("phaseUse")) &&
									game.hasPlayer(function (current) {
										return current != player && current.group == "qun";
									})
								)
									return "xueyi";
								//激将
								if (
									!player.hasJudge("lebu") &&
									!player.skipList.includes("phaseUse") &&
									game.hasPlayer(function (current) {
										return current != player && current.group == "shu" && current.hasSha() && get.attitude(player, current) > 0 && get.attitude(current, player) > 0;
									}) &&
									game.hasPlayer(function (target) {
										return player.canUse({ name: "sha" }, target) && get.effect(target, { name: "sha" }, player, player) > 0;
									})
								)
									return "jijiang";
							}
							//护驾
							else if (
								!player.hasShan() &&
								game.hasPlayer(function (current) {
									return current != player && current.group == "wei" && current.mayHaveShan(player, "respond") && get.attitude(player, current) > 0 && get.attitude(current, player) > 0;
								})
							)
								return "hujia";
						});
				} else event.finish();
			} else event.finish();
			"step 2";
			var skill = result.control;
			player.addTempSkills(skill);
			// player.popup(skill,'wood');
			// game.log(player,'获得了技能','#g【'+get.translation(skill)+'】');
		},
	},
	sphuangen: {
		trigger: { global: "useCardToPlayered" },
		filter(event, player) {
			if (!event.isFirstTarget) return false;
			if (get.type(event.card) != "trick") return false;
			if (get.info(event.card).multitarget) return false;
			if (event.targets.length < 2) return false;
			return player.hp > 0;
		},
		direct: true,
		content() {
			"step 0";
			player
				.chooseTarget(get.prompt("sphuangen"), [1, Math.min(player.hp, trigger.targets.length)], function (card, player, target) {
					return _status.event.targets.includes(target);
				})
				.set("ai", function (target) {
					return -get.effect(target, trigger.card, trigger.player, _status.event.player);
				})
				.set("targets", trigger.targets);
			"step 1";
			if (result.bool) {
				player.logSkill("sphuangen", result.targets);
				trigger.excluded.addArray(result.targets);
				player.draw();
			}
		},
		ai: { threaten: 3.5 },
		global: "sphuangen_ai",
		subSkill: {
			ai: {
				ai: {
					effect: {
						player_use(card, player) {
							if (
								typeof card != "object" ||
								!game.hasPlayer(target => {
									return target.hasSkill("sphuangen") && (get.attitude(player, target) < 0 || get.attitude(target, player) < 0);
								}) ||
								game.countPlayer(target => {
									return player.canUse(card, target);
								}) < 2
							)
								return;
							if (get.info(card)?.type != "trick") return;
							const select = get.info(card).selectTarget;
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
	},
	spyicong: {
		trigger: { player: "phaseDiscardEnd" },
		direct: true,
		locked: false,
		filter(event, player) {
			return player.countCards("he") > 0;
		},
		content() {
			"step 0";
			player.chooseCard("he", [1, player.countCards("he")], get.prompt2("spyicong")).set("ai", function (card) {
				if (card.name == "du") return 10;
				if (ui.selected.cards.length) return -1;
				return 4 - get.value(card);
			});
			"step 1";
			if (result.bool) {
				player.logSkill("spyicong");
				player.addToExpansion(result.cards, player, "give").gaintag.add("spyicong");
			}
		},
		mod: {
			globalTo(from, to, num) {
				return num + to.getExpansions("spyicong").length;
			},
		},
		marktext: "扈",
		onremove(player, skill) {
			var cards = player.getExpansions(skill);
			if (cards.length) player.loseToDiscardpile(cards);
		},
		intro: {
			name: "义从",
			content(storage, player) {
				return "共有" + get.cnNumber(player.getExpansions("spyicong").length) + "张“扈”";
			},
			markcount: "expansion",
		},
	},
	sptuji: {
		trigger: { player: "phaseZhunbeiBegin" },
		forced: true,
		locked: false,
		filter(event, player) {
			return player.getExpansions("spyicong").length > 0;
		},
		content() {
			var cards = player.getExpansions("spyicong");
			var num = cards.length;
			player.addMark("sptuji2", num, false);
			player.addTempSkill("sptuji2");
			player.loseToDiscardpile(cards);
			if (num <= 1) player.draw();
		},
		ai: {
			combo: "spyicong",
		},
	},
	sptuji2: {
		onremove: true,
		charlotte: true,
		mod: {
			globalFrom(from, to, num) {
				return num - from.countMark("sptuji2");
			},
		},
		marktext: "突",
		intro: {
			name: "突骑",
			content: "至其他角色的距离-#",
		},
	},
	xinfu_yanyu: {
		trigger: {
			global: "phaseUseBegin",
		},
		direct: true,
		filter(event, player) {
			return player.countCards("he") > 0;
		},
		content() {
			"step 0";
			var next = player.chooseToDiscard(get.prompt("xinfu_yanyu"), get.translation("xinfu_yanyu_info"), "he").set("logSkill", "xinfu_yanyu");
			if (player == trigger.player) {
				next.set(
					"goon",
					(function () {
						var map = {
							basic: 0,
							trick: 0.1,
						};
						var hs = trigger.player.getCards("h");
						var sha = false;
						var jiu = false;
						for (var i = 0; i < hs.length; i++) {
							if (trigger.player.hasValueTarget(hs[i])) {
								if (hs[i].name == "sha" && !sha) {
									sha = true;
									map.basic += 2;
								}
								if (hs[i].name == "tao") map.basic += 6;
								if (hs[i].name == "jiu") {
									jiu = true;
									map.basic += 2.5;
								}
								if (get.type(hs[i]) == "trick") map.trick += get.value(hs[i], player, "raw");
							}
						}
						return map;
					})()
				);
				next.set("ai", function (card) {
					var map = _status.event.goon;
					var type = get.type(card, "trick");
					if (!map[type]) return -1;
					return map[type] - get.value(card);
				});
			} else {
				next.set("ai", function (cardx) {
					var map = {
						basic: 0,
						trick: 0,
					};
					var hs = trigger.player.getCards("h");
					var sha = false;
					var jiu = false;
					for (var i = 0; i < hs.length; i++) {
						if (hs[i] != cardx && trigger.player.hasValueTarget(hs[i])) {
							if (hs[i].name == "sha" && !sha) {
								sha = true;
								map.basic += 2;
							}
							if (hs[i].name == "tao") map.basic += 6;
							if (hs[i].name == "jiu") {
								jiu = true;
								map.basic += 3;
							}
							if (get.type(hs[i]) == "trick") map.trick += player.getUseValue(hs[i]);
						}
					}
					var type = get.type(cardx, "trick");
					if (!map[type]) return -get.value(cardx);
					return map[type] - get.value(cardx);
				});
			}
			"step 1";
			if (result.bool) {
				player.storage.xinfu_yanyu = get.type(result.cards[0], "trick");
				player.addTempSkill("xinfu_yanyu2", "phaseUseAfter");
			}
		},
	},
	xinfu_yanyu2: {
		init(player, skill) {
			player.storage[skill] = 0;
		},
		onremove(player, skill) {
			delete player.storage.xinfu_yanyu;
			delete player.storage.xinfu_yanyu2;
		},
		trigger: {
			global: ["loseAfter", "cardsDiscardAfter", "loseAsyncAfter", "equipAfter"],
		},
		direct: true,
		sourceSkill: "xinfu_yanyu",
		filter(event, player) {
			if (player.storage.xinfu_yanyu2 >= 3) return false;
			var type = player.storage.xinfu_yanyu,
				cards = event.getd();
			for (var i = 0; i < cards.length; i++) {
				if (get.type(cards[i], "trick") == type && get.position(cards[i], true) == "d") return true;
			}
			return false;
		},
		content() {
			"step 0";
			event.logged = false;
			event.cards = [];
			var type = player.storage.xinfu_yanyu;
			var cards = trigger.getd();
			for (var i = 0; i < cards.length; i++) {
				if (get.type(cards[i], "trick") == type && get.position(cards[i], true) == "d") event.cards.push(cards[i]);
			}
			"step 1";
			if (player.storage.xinfu_yanyu2 >= 3) event.finish();
			else
				player.chooseCardButton(event.cards, "【燕语】：是否将其中的一张牌交给一名角色？").ai = function (card) {
					if (card.name == "du") return 10;
					return get.value(card);
				};
			"step 2";
			if (result.bool) {
				player.storage.xinfu_yanyu2++;
				if (!event.logged) {
					player.logSkill("xinfu_yanyu");
					player.addExpose(0.25);
					event.logged = true;
				}
				event.togain = result.links[0];
				event.cards.remove(event.togain);
				player
					.chooseTarget(true, "请选择要获得" + get.translation(event.togain) + "的角色")
					.set("ai", function (target) {
						var att = get.attitude(_status.event.player, target);
						var card = _status.event.card;
						var val = get.value(card);
						if (player.storage.xinfu_yanyu2 < 3 && target == _status.currentPhase && target.hasValueTarget(card, null, true)) att = att * 5;
						else if (target == player && !player.hasJudge("lebu") && get.type(card) == "trick") att = att * 3;
						if (target.hasSkillTag("nogain")) att /= 10;
						return att * val;
					})
					.set("card", event.togain);
			} else event.finish();
			"step 3";
			var target = result.targets[0];
			player.line(target, "green");
			target.gain(event.togain, "gain2");
			if (event.cards.length) event.goto(1);
		},
	},
	xinfu_xiaode: {
		subSkill: {
			remove: {
				unique: true,
				charlotte: true,
				trigger: {
					player: "phaseAfter",
				},
				forced: true,
				popup: false,
				content() {
					player.removeAdditionalSkill("xinfu_xiaode");
					player.removeSkill("xinfu_xiaode_remove");
				},
			},
		},
		trigger: {
			global: "dieAfter",
		},
		direct: true,
		filter(skill, event) {
			return !event.hasSkill("xinfu_xiaode_remove");
		},
		content() {
			"step 0";
			var list = [];
			var listm = [];
			var listv = [];
			if (trigger.player.name1 != undefined) listm = lib.character[trigger.player.name1][3];
			else listm = lib.character[trigger.player.name][3];
			if (trigger.player.name2 != undefined) listv = lib.character[trigger.player.name2][3];
			listm = listm.concat(listv);
			var func = function (skill) {
				var info = get.info(skill);
				if (info.charlotte || info.zhuSkill || (info.unique && !info.limited) || info.juexingji || info.dutySkill || info.hiddenSkill) return false;
				return true;
			};
			for (var i = 0; i < listm.length; i++) {
				if (func(listm[i])) list.add(listm[i]);
			}
			if (list.length) {
				player
					.chooseControl(list, "cancel2")
					.set("prompt", get.prompt("xinfu_xiaode"))
					.set("prompt2", get.translation("xinfu_xiaode_info"))
					.set("ai", function () {
						return list.randomGet();
					});
			} else event.finish();
			"step 1";
			if (result.control && result.control != "cancel2") {
				player.logSkill("xinfu_xiaode");
				player.popup(result.control, "thunder");
				game.log(player, "获得了技能", "#g【" + get.translation(result.control) + "】");
				player.addAdditionalSkill("xinfu_xiaode", [result.control]);
				player.addSkill("xinfu_xiaode_remove");
			}
		},
	},
	chixin: {
		group: ["chixin1", "chixin2"],
		mod: {
			cardUsableTarget(card, player, target) {
				if (card.name == "sha" && !target.hasSkill("chixin3") && player.inRange(target)) return true;
			},
		},
		trigger: { player: "useCardToPlayered" },
		silent: true,
		firstDo: true,
		locked: false,
		content() {
			trigger.target.addTempSkill("chixin3");
		},
	},
	chixin1: {
		enable: ["chooseToRespond", "chooseToUse"],
		filterCard: { suit: "diamond" },
		position: "hes",
		viewAs: { name: "sha" },
		prompt: "将一张♦牌当杀使用或打出",
		sourceSkill: "chixin",
		check(card) {
			return 5 - get.value(card);
		},
		ai: {
			respondSha: true,
		},
	},
	chixin2: {
		enable: ["chooseToUse", "chooseToRespond"],
		filterCard: { suit: "diamond" },
		viewAs: { name: "shan" },
		position: "hes",
		prompt: "将一张♦牌当闪使用或打出",
		sourceSkill: "chixin",
		check(card) {
			return 5 - get.value(card);
		},
		ai: {
			respondShan: true,
			effect: {
				target(card, player, target, current) {
					if (get.tag(card, "respondShan") && current < 0) return 0.8;
				},
			},
		},
	},
	chixin3: { charlotte: true },
	suiren: {
		trigger: { player: "phaseZhunbeiBegin" },
		skillAnimation: true,
		animationColor: "gray",
		filter(event, player) {
			return !player.storage.suiren;
		},
		intro: {
			content: "limited",
		},
		mark: true,
		direct: true,
		unique: true,
		limited: true,
		content() {
			"step 0";
			var check = player.hp == 1 || (player.hp == 2 && player.countCards("h") <= 1);
			player
				.chooseTarget(get.prompt2("suiren"))
				.set("ai", function (target) {
					if (!_status.event.check) return 0;
					return get.attitude(_status.event.player, target);
				})
				.set("check", check);
			"step 1";
			if (result.bool) {
				player.storage.suiren = true;
				player.awakenSkill("suiren");
				player.logSkill("suiren", result.targets);
				player.removeSkills("reyicong");
				player.gainMaxHp();
				player.recover();
				result.targets[0].draw(3);
			}
		},
	},
	xinmanjuan: {
		audio: "manjuan",
		forced: true,
		trigger: {
			player: "gainAfter",
			global: "loseAsyncAfter",
		},
		filter(event, player) {
			var hs = player.getCards("h");
			return (
				event.type != "xinmanjuan" &&
				event.getg(player).filter(function (card) {
					return hs.includes(card);
				}).length > 0
			);
		},
		content() {
			"step 0";
			var hs = player.getCards("h"),
				cards = trigger.getg(player).filter(function (card) {
					return hs.includes(card);
				});
			event.cards = cards;
			event.rawCards = cards.slice(0);
			player.loseToDiscardpile(cards);
			if (_status.currentPhase != player) event.finish();
			"step 1";
			event.card = event.cards.shift();
			event.togain = [];
			var number = get.number(event.card);
			for (var i = 0; i < ui.discardPile.childNodes.length; i++) {
				var current = ui.discardPile.childNodes[i];
				if (!event.rawCards.includes(current) && get.number(current) == number) event.togain.push(current);
			}
			if (!event.togain.length) event.goto(4);
			"step 2";
			player.chooseButton(["是否获得其中的一张牌？", event.togain]).ai = function (button) {
				return get.value(button.link);
			};
			"step 3";
			if (result.bool) {
				player.gain(result.links[0], "gain2").type = "xinmanjuan";
			}
			"step 4";
			if (event.cards.length) event.goto(1);
		},
		ai: {
			threaten: 4.2,
			nogain: 1,
			skillTagFilter(player) {
				return player != _status.currentPhase;
			},
		},
	},
	manjuan: {
		audio: true,
		trigger: { global: "loseAfter" },
		filter(event, player) {
			if (event.type != "discard") return false;
			if (event.player == player) return false;
			if (!player.countCards("he")) return false;
			for (var i = 0; i < event.cards2.length; i++) {
				if (get.position(event.cards2[i], true) == "d") {
					return true;
				}
			}
			return false;
		},
		direct: true,
		unique: true,
		gainable: true,
		content() {
			"step 0";
			if (trigger.delay == false) game.delay();
			"step 1";
			var cards = [];
			var suits = ["club", "spade", "heart", "diamond"];
			for (var i = 0; i < trigger.cards2.length; i++) {
				if (get.position(trigger.cards2[i], true) == "d") {
					cards.push(trigger.cards2[i]);
					suits.remove(get.suit(trigger.cards2[i]));
				}
			}
			if (cards.length) {
				var maxval = 0;
				for (var i = 0; i < cards.length; i++) {
					var tempval = get.value(cards[i]);
					if (tempval > maxval) {
						maxval = tempval;
					}
				}
				maxval += cards.length - 1;
				var next = player.chooseToDiscard("he", { suit: suits });
				next.set("ai", function (card) {
					return _status.event.maxval - get.value(card);
				});
				next.set("maxval", maxval);
				next.set("dialog", [get.prompt(event.name), "hidden", cards]);
				next.logSkill = event.name;
				event.cards = cards;
			}
			"step 2";
			if (result.bool) {
				player.gain(event.cards, "gain2", "log");
			}
		},
		ai: {
			threaten: 1.3,
		},
	},
	zuixiang: {
		skillAnimation: true,
		animationColor: "gray",
		audio: true,
		unique: true,
		limited: true,
		trigger: { player: "phaseZhunbeiBegin" },
		content() {
			"step 0";
			player.awakenSkill("zuixiang");
			event.cards = player.showCards(get.cards(3)).cards;
			player.addToExpansion(event.cards, "gain2").gaintag.add("zuixiang2");
			"step 1";
			if (lib.skill.zuixiang.filterSame(cards)) {
				player.gain(cards, "gain2").type = "xinmanjuan";
			} else {
				trigger._zuixiang = true;
				player.addSkill("zuixiang2");
			}
		},
		filterSame(c) {
			for (var i = 0; i < c.length; i++) {
				for (var j = i + 1; j < c.length; j++) {
					if (get.number(c[i]) == get.number(c[j])) return true;
				}
			}
			return false;
		},
	},
	zuixiang2: {
		intro: {
			content: "expansion",
			markcount: "expansion",
		},
		mod: {
			cardEnabled(card, player) {
				var type = get.type2(card);
				var list = player.getExpansions("zuixiang2");
				for (var i of list) {
					if (get.type2(i, false) == type) return false;
				}
			},
			cardRespondable() {
				return lib.skill.zuixiang2.mod.cardEnabled.apply(this, arguments);
			},
			cardSavable() {
				return lib.skill.zuixiang2.mod.cardEnabled.apply(this, arguments);
			},
		},
		trigger: {
			player: "phaseZhunbeiBegin",
			target: "useCardToBefore",
		},
		forced: true,
		charlotte: true,
		sourceSkill: "zuixiang",
		filter(event, player) {
			if (event.name == "phaseZhunbei") return !event._zuixiang;
			var type = get.type2(event.card);
			var list = player.getExpansions("zuixiang2");
			for (var i of list) {
				if (get.type2(i) == type) return true;
			}
			return false;
		},
		content() {
			"step 0";
			if (event.triggername == "useCardToBefore") {
				trigger.cancel();
				event.finish();
				return;
			}
			var cards = get.cards(3);
			player.addToExpansion("gain2", cards).gaintag.add("zuixiang2");
			"step 1";
			var cards = player.getExpansions("zuixiang2");
			player.showCards(cards);
			if (lib.skill.zuixiang.filterSame(cards)) {
				player.gain(cards, "gain2", "log").type = "xinmanjuan";
				player.removeSkill("zuixiang2");
			}
		},
		ai: {
			effect: {
				target(card, player, target) {
					var type = get.type2(card);
					var list = target.getExpansions("zuixiang2");
					for (var i of list) {
						if (get.type2(i) == type) return "zeroplayertarget";
					}
				},
			},
		},
	},
	yanxiao: {
		audio: 2,
		enable: "phaseUse",
		filterCard: { suit: "diamond" },
		filterTarget(card, player, target) {
			return target.canAddJudge({ name: "yanxiao_card" });
		},
		check(card) {
			return 7 - get.value(card);
		},
		position: "he",
		filter(event, player) {
			return player.countCards("he", { suit: "diamond" }) > 0;
		},
		discard: false,
		lose: false,
		delay: false,
		prepare: "give",
		content() {
			"step 0";
			game.addGlobalSkill("yanxiao_global");
			target.addJudge({ name: "yanxiao_card" }, cards);
			"step 1";
			game.delay();
		},
		ai: {
			order: 8,
			result: {
				target(player, target) {
					if (
						target.countCards("j", function (card) {
							return (
								get.effect(
									target,
									{
										name: card.viewAs || card.name,
										cards: [card],
									},
									target,
									target
								) < 0
							);
						})
					)
						return 1;
					return 0;
				},
			},
		},
	},
	yanxiao_global: {
		trigger: { player: "phaseJudgeBegin" },
		forced: true,
		filter(event, player) {
			return player.countCards("j") > 0 && player.hasJudge("yanxiao_card");
		},
		content() {
			player.gain(player.getCards("j"), "gain2");
		},
		ai: {
			effect: {
				target_use(card, player, target) {
					if (get.type(card) == "delay" && target.hasJudge("yanxiao_card")) return [0, 0.1];
				},
			},
		},
	},
	anxian: {
		audio: 2,
		group: ["anxian_source", "anxian_target"],
		subSkill: {
			source: {
				audio: "anxian",
				trigger: { source: "damageBegin2" },
				filter(event, player) {
					return event.card && event.card.name == "sha";
				},
				check(event, player) {
					if (get.damageEffect(event.player, player, player) <= 0) return true;
					return false;
				},
				content() {
					"step 0";
					if (trigger.player.countCards("h")) {
						trigger.player.chooseToDiscard(true);
					}
					"step 1";
					player.draw();
					trigger.cancel();
				},
			},
			target: {
				audio: "anxian",
				trigger: { target: "useCardToTargeted" },
				direct: true,
				filter(event, player) {
					return event.card.name == "sha" && player.countCards("h");
				},
				content() {
					"step 0";
					var next = player.chooseToDiscard(get.prompt2("anxian"));
					next.set("ai", function (card) {
						var player = _status.event.player;
						var trigger = _status.event.getTrigger();
						if (get.attitude(player, trigger.player) > 0) {
							return 9 - get.value(card);
						}
						if (player.countCards("h", { name: "shan" })) return -1;
						return 7 - get.value(card);
					});
					next.logSkill = "anxian";
					"step 1";
					if (result.bool) {
						trigger.player.draw();
						trigger.getParent().excluded.push(player);
					}
				},
			},
		},
	},
	junwei: {
		trigger: { player: "phaseJieshuBegin" },
		direct: true,
		filter(event, player) {
			return player.getExpansions("yinling").length >= 3;
		},
		content() {
			"step 0";
			var cards = player.getExpansions("yinling");
			if (cards.length > 3) {
				player.chooseButton(3, [get.prompt("junwei"), "hidden", cards]).set("ai", function (button) {
					return 1;
				});
			} else {
				player
					.chooseBool()
					.set("createDialog", [get.prompt("junwei"), "hidden", cards])
					.set("dialogselectx", true)
					.set("choice", true);
				event.cards = cards.slice(0);
			}
			"step 1";
			if (result.bool) {
				player.logSkill("junwei");
				var cards = event.cards || result.links;
				player.loseToDiscardpile(cards);
				player
					.chooseTarget(true, function (card, player, target) {
						return player != target;
					})
					.set("ai", function (target) {
						return -get.attitude(_status.event.player, target) / Math.sqrt(1 + target.hp);
					});
			} else {
				event.finish();
			}
			"step 2";
			if (result.bool && result.targets && result.targets.length) {
				var target = result.targets[0];
				player.line(result.targets);
				event.target = target;
				var nshan = target.countCards("h", function (card) {
					if (_status.connectMode) return true;
					return card.name == "shan";
				});
				if (nshan == 0) {
					event.directfalse = true;
				} else {
					target
						.chooseCard("交给" + get.translation(player) + "一张【闪】，或失去1点体力", function (card) {
							return card.name == "shan";
						})
						.set("ai", function (card) {
							if (_status.event.nshan > 1) return 1;
							if (_status.event.player.hp >= 3) return 0;
							return 1;
						})
						.set("nshan", nshan);
				}
			} else {
				event.finish();
			}
			"step 3";
			if (!event.directfalse && result.bool) game.delay();
			ui.clear();
			"step 4";
			if (!event.directfalse && result.bool) {
				event.cards = result.cards;
				event.target.$throw(result.cards);
				player
					.chooseTarget("将" + get.translation(event.cards) + "交给一名角色", true, function (card, player, target) {
						return target != _status.event.getParent().target;
					})
					.set("ai", function (target) {
						return get.attitude(_status.event.player, target) / (target.countCards("h", "shan") + 1);
					});
			} else {
				event.target.loseHp();
				delete event.cards;
			}
			"step 5";
			if (event.cards) {
				player.line(result.targets, "green");
				result.targets[0].gain(event.cards, "gain2").giver = player;
				game.log(player, "将", event.cards, "交给", result.targets[0]);
				event.finish();
			} else {
				if (event.target.countCards("e")) {
					player.choosePlayerCard("e", "将" + get.translation(event.target) + "的一张装备牌移出游戏", true, event.target);
				} else {
					event.finish();
				}
			}
			"step 6";
			if (result.bool) {
				var card = result.links[0];
				target.addToExpansion(card, target, "give").gaintag.add("junwei2");
				target.addSkill("junwei2");
			}
		},
		ai: {
			combo: "yinling",
		},
	},
	junwei2: {
		mark: true,
		intro: {
			content: "expansion",
			markcount: "expansion",
		},
		onremove(player, skill) {
			var cards = player.getExpansions(skill);
			if (cards.length) player.loseToDiscardpile(cards);
		},
		trigger: { player: "phaseJieshuBegin" },
		forced: true,
		charlotte: true,
		sourceSkill: "junwei",
		content() {
			"step 0";
			var cards = player.getExpansions("junwei2").filter(function (card) {
				return player.canEquip(card, true);
			});
			if (cards.length) {
				player.$give(cards[0], player, false);
				game.delay(0.5);
				player.equip(cards[0]);
				event.redo();
			}
			"step 1";
			player.removeSkill("junwei2");
		},
	},
	yinling: {
		enable: "phaseUse",
		filterCard: { color: "black" },
		position: "he",
		marktext: "锦",
		intro: {
			content: "expansion",
			markcount: "expansion",
		},
		onremove(player, skill) {
			var cards = player.getExpansions(skill);
			if (cards.length) player.loseToDiscardpile(cards);
		},
		filter(event, player) {
			return player.countCards("he", { color: "black" }) > 0 && player.getExpansions("yinling").length < 4;
		},
		filterTarget(card, player, target) {
			return target.countCards("he") > 0 && target != player;
		},
		check(card) {
			return 6 - get.value(card);
		},
		content() {
			"step 0";
			player.choosePlayerCard("hej", target, true);
			"step 1";
			if (result.bool && result.links && result.links.length) {
				player.addToExpansion(result.links, target, "give").gaintag.add("yinling");
			}
		},
		ai: {
			order: 10.1,
			expose: 0.1,
			result: {
				target(player, target) {
					if (target.hasSkill("tuntian")) return 0;
					var es = target.getCards("e");
					var nh = target.countCards("h");
					var noe = es.length == 0 || target.hasSkillTag("noe");
					var noe2 = es.length == 1 && es[0].name == "baiyin" && target.hp < target.maxHp;
					var noh = nh == 0 || target.hasSkillTag("noh");
					if (noh && noe) return 0;
					if (noh && noe2) return 0.01;
					if (get.attitude(player, target) <= 0) return target.countCards("he") ? -1.5 : 1.5;
					var js = target.getCards("j");
					if (js.length) {
						var jj = js[0].viewAs ? { name: js[0].viewAs } : js[0];
						if (jj.name == "guohe") return 3;
						if (js.length == 1 && get.effect(target, jj, target, player) >= 0) {
							return -1.5;
						}
						return 2;
					}
					return -1.5;
				},
			},
		},
	},
	fenyong: {
		audio: 2,
		trigger: { player: "damageEnd" },
		content() {
			player.addTempSkill("fenyong2");
		},
	},
	fenyong2: {
		audio: "fenyong",
		mark: true,
		intro: {
			content: "防止你受到的所有伤害",
		},
		trigger: { player: "damageBegin3" },
		forced: true,
		sourceSkill: "fenyong",
		content() {
			trigger.cancel();
		},
		ai: {
			maixie: true,
			maixie_hp: true,
			nofire: true,
			nothunder: true,
			nodamage: true,
			effect: {
				target(card, player, target, current) {
					if (get.tag(card, "damage")) return "zeroplayertarget";
				},
			},
		},
	},
	xuehen: {
		audio: 2,
		trigger: { global: "phaseJieshuBegin" },
		forced: true,
		locked: false,
		filter(event, player) {
			return player.hasSkill("fenyong2") && event.player.isIn();
		},
		content() {
			"step 0";
			player.removeSkill("fenyong2");
			player
				.chooseControl("弃牌", "出杀", function () {
					var player = _status.event.player;
					var trigger = _status.event.getTrigger();
					if (get.attitude(player, trigger.player) < 0) {
						var he = trigger.player.countCards("he");
						if (he < 2) return "出杀";
						if (player.maxHp - player.hp >= 2 && he <= 3) {
							return "弃牌";
						}
						if (player.maxHp - player.hp >= 3 && he <= 5) {
							return "弃牌";
						}
						if (player.maxHp - player.hp > 3) {
							return "弃牌";
						}
						return "出杀";
					}
					return "出杀";
				})
				.set("prompt", "弃置" + get.translation(trigger.player) + get.cnNumber(player.maxHp - player.hp) + "张牌，或对任意一名角色使用一张杀");
			"step 1";
			if (result.control == "弃牌") {
				player.line(trigger.player, "green");
				if (player.hp < player.maxHp && trigger.player.countCards("he")) {
					player.discardPlayerCard(trigger.player, true, "he", player.maxHp - player.hp);
				}
			} else {
				player.chooseUseTarget({ name: "sha" }, true, false, "nodistance");
			}
		},
		ai: {
			combo: "fenyong",
		},
	},
	mouduan: {
		audio: 1,
		init2(player) {
			game.broadcastAll(function (player) {
				player._mouduan_mark = player.mark("武", {
					content: "拥有技能【激昂】、【谦逊】",
				});
			}, player);
			player.addAdditionalSkill("mouduan", ["jiang", "qianxun"]);
		},
		derivation: ["jiang", "qianxun", "yingzi", "keji"],
		onremove(player) {
			game.broadcastAll(function (player) {
				if (player._mouduan_mark) {
					player._mouduan_mark.delete();
					delete player._mouduan_mark;
				}
			}, player);
			player.removeAdditionalSkills("mouduan");
		},
		trigger: { player: "loseEnd" },
		forced: true,
		locked: false,
		filter(event, player) {
			return player._mouduan_mark && player._mouduan_mark.name == "武" && player.countCards("h") <= 2;
		},
		content() {
			game.broadcastAll(function (player) {
				if (!player._mouduan_mark) return;
				player._mouduan_mark.name = "文";
				player._mouduan_mark.skill = "文";
				player._mouduan_mark.firstChild.innerHTML = "文";
				player._mouduan_mark.info.content = "拥有技能【英姿】、【克己】";
			}, player);
			player.addAdditionalSkills("mouduan", ["yingzi", "keji"]);
		},
		group: "mouduan2",
	},
	mouduan2: {
		audio: 1,
		trigger: { global: "phaseZhunbeiBegin" },
		sourceSkill: "mouduan",
		//priority:5,
		filter(event, player) {
			return player._mouduan_mark && player._mouduan_mark.name == "文" && player.countCards("h") > 2;
		},
		direct: true,
		content() {
			"step 0";
			player.chooseToDiscard("he", "谋断：是否弃置一张牌将标记变为“武”？").ai = function () {
				return -1;
			};
			"step 1";
			if (result.bool && player.countCards("h") > 2) {
				game.broadcastAll(function (player) {
					if (!player._mouduan_mark) return;
					player._mouduan_mark.name = "武";
					player._mouduan_mark.skill = "武";
					player._mouduan_mark.firstChild.innerHTML = "武";
					player._mouduan_mark.info.content = "拥有技能【激昂】、【谦逊】";
				}, player);
				player.addAdditionalSkills("mouduan", ["jiang", "qianxun"]);
			}
		},
	},
	tanhu: {
		audio: 1,
		enable: "phaseUse",
		usable: 1,
		filterTarget(card, player, target) {
			return player.canCompare(target);
		},
		filter(event, player) {
			return player.countCards("h") > 0;
		},
		content() {
			"step 0";
			player.chooseToCompare(target);
			"step 1";
			if (result.bool) {
				target.addTempSkill("tanhu2");
			}
		},
		ai: {
			result: {
				target(player, target) {
					var hs = player.getCards("h");
					if (hs.length < 3) return 0;
					var bool = false;
					for (var i = 0; i < hs.length; i++) {
						if (hs[i].number >= 9 && get.value(hs[i]) < 7) {
							bool = true;
							break;
						}
					}
					if (!bool) return 0;
					return -1;
				},
			},
			order: 9,
		},
		group: "tanhu3",
	},
	tanhu2: {
		mark: true,
		intro: {
			content: "已成为探虎目标",
		},
	},
	tanhu3: {
		mod: {
			globalFrom(from, to) {
				if (to.hasSkill("tanhu2")) return -Infinity;
			},
			wuxieRespondable(card, player, target) {
				if (target && target.hasSkill("tanhu2")) return false;
			},
		},
	},
	jie: {
		audio: 1,
		trigger: { source: "damageBegin1" },
		filter(event) {
			return event.card && event.card.name == "sha" && get.color(event.card) == "red" && event.notLink();
		},
		forced: true,
		content() {
			trigger.num++;
		},
	},
	dahe: {
		audio: true,
		enable: "phaseUse",
		usable: 1,
		filterTarget(card, player, target) {
			return player.canCompare(target);
		},
		filter(event, player) {
			return player.countCards("h") > 0;
		},
		content() {
			"step 0";
			player.chooseToCompare(target).set("preserve", "win");
			"step 1";
			if (result.bool && result.target) {
				event.type = true;
				event.card = result.target;
				player
					.chooseTarget("将" + get.translation(result.target) + "交给一名角色", function (card, player, target) {
						return target.hp <= player.hp;
					})
					.set("ai", function (target) {
						var att = get.attitude(_status.event.player, target);
						if (_status.event.du) return -att;
						return att;
					})
					.set("du", event.card.name == "du");
				target.addTempSkill("dahe2");
			} else {
				event.type = false;
				if (player.countCards("h")) {
					player.showHandcards();
					player.chooseToDiscard("h", true);
				}
			}
			"step 2";
			if (event.type) {
				if (result.bool) {
					player.line(result.targets, "green");
					result.targets[0].gain(event.card, "gain2");
				}
			}
		},
		ai: {
			result: {
				target(player, target) {
					var hs = player.getCards("h");
					if (hs.length < 3) return 0;
					var bool = false;
					for (var i = 0; i < hs.length; i++) {
						if (hs[i].number >= 9 && get.value(hs[i]) < 7) {
							bool = true;
							break;
						}
					}
					if (!bool) return 0;
					if (player.canUse("sha", target) && player.countCards("h", "sha")) {
						return -2;
					}
					return -0.5;
				},
			},
			order: 9,
		},
	},
	dahe2: {
		mark: true,
		intro: {
			content: "非红桃闪无效",
		},
		mod: {
			cardRespondable(card, player) {
				if (card.name == "shan") {
					const suit = get.suit(card);
					if (suit != "heart" && suit != "unsure") return false;
				}
			},
			cardEnabled(card, player) {
				if (card.name == "shan") {
					const suit = get.suit(card);
					if (suit != "heart" && suit != "unsure") return false;
				}
			},
		},
	},
	shichou: {
		audio: true,
		skillAnimation: true,
		animationColor: "orange",
		unique: true,
		limited: true,
		mark: false,
		trigger: { player: "phaseZhunbeiBegin" },
		zhuSkill: true,
		direct: true,
		filter(event, player) {
			if (!player.hasZhuSkill("shichou")) return false;
			if (player.countCards("he") < 2) return false;
			return game.hasPlayer(function (current) {
				return current != player && current.group == "shu";
			});
		},
		init(player) {
			if (player.hasZhuSkill("shichou")) {
				player.markSkill("shichou");
				player.storage.shichou = false;
			}
		},
		content() {
			"step 0";
			player.chooseCardTarget({
				prompt: get.prompt2("shichou"),
				selectCard: 2,
				filterTarget(card, player, target) {
					return target.group == "shu" && target != player;
				},
				filterCard: true,
				position: "he",
				ai1(card) {
					return 7 - get.value(card);
				},
				ai2(target) {
					var player = _status.event.player;
					if (player.hasUnknown()) return 0;
					var att = get.attitude(player, target);
					if (att <= 0) {
						if (target.hp == 1) return (10 - att) / 2;
						return 10 - att;
					} else {
						if (target.hp == 1) return 0;
						return (10 - att) / 4;
					}
				},
			});
			"step 1";
			if (!result.bool) return;
			var target = result.targets[0];
			var cards = result.cards;
			player.storage.shichou = true;
			player.logSkill("shichou", target);
			player.awakenSkill("shichou");
			player.give(cards, target);
			player.storage.shichou_target = target;
			player.addSkill("shichou2");
			target.markSkillCharacter("shichou", player, "誓仇", "代替" + get.translation(player) + "承受伤害直到首次进入濒死状态");
		},
		intro: {
			content: "limited",
		},
	},
	shichou2: {
		group: "shichou3",
		trigger: { player: "damageBegin3" },
		forced: true,
		popup: false,
		sourceSkill: "shichou",
		content() {
			trigger.player = player.storage.shichou_target;
			trigger.shichou4 = true;
			trigger.player.addSkill("shichou4");
			player.logSkill("shichou2", player.storage.shichou_target);
			game.delay(0.5);
		},
		ai: {
			effect: {
				target(card, player, target, current) {
					if (get.tag(card, "damage")) {
						if (player.hasSkillTag("jueqing", false, target)) return [1, -2];
						if (get.attitude(player, target) > 0) return [0, 0];
						var eff = get.damageEffect(target.storage.shichou_target, player, target);
						if (eff > 0) {
							return [0, 1];
						} else if (eff < 0) {
							return [0, -2];
						} else {
							return [0, 0];
						}
					}
				},
			},
		},
	},
	shichou3: {
		trigger: { global: ["dying", "dieBegin"] },
		forced: true,
		popup: false,
		sourceSkill: "shichou",
		//priority:10,
		filter(event, player) {
			return event.player == player.storage.shichou_target;
		},
		content() {
			trigger.player.unmarkSkill("shichou");
			delete player.storage.shichou_target;
			player.removeSkill("shichou2");
		},
	},
	shichou4: {
		trigger: { player: ["damageAfter", "damageCancelled"] },
		forced: true,
		popup: false,
		audio: false,
		sourceSkill: "shichou",
		content() {
			if (!trigger.shichou4) return;
			if (event.triggername == "damageAfter" && trigger.num) {
				player.draw(trigger.num);
			}
			player.removeSkill("shichou4");
		},
	},
	zhaolie: {
		trigger: { player: "phaseDrawBegin2" },
		direct: true,
		filter(event, player) {
			return !event.numFixed;
		},
		content() {
			"step 0";
			player
				.chooseTarget(get.prompt2("zhaolie"), function (card, player, target) {
					return target != player && player.inRange(target);
				})
				.set("ai", function (target) {
					var player = _status.event.player;
					if (get.attitude(player, target) > 0) return 0;
					return get.damageEffect(target, player, player);
				});
			"step 1";
			if (result.bool) {
				trigger.num--;
				player.storage.zhaolie = result.targets[0];
				player.logSkill("zhaolie", result.targets);
				player.addTempSkill("zhaolie2", "phaseDrawAfter");
			}
		},
	},
	zhaolie2: {
		trigger: { player: "phaseDrawEnd" },
		forced: true,
		popup: false,
		sourceSkill: "zhaolie",
		content() {
			"step 0";
			event.cards = get.cards(3);
			player.showCards(event.cards);
			"step 1";
			event.basic = [];
			event.nonbasic = [];
			event.todis = [];
			for (var i = 0; i < event.cards.length; i++) {
				if (get.type(event.cards[i]) == "basic") {
					if (event.cards[i].name == "tao") {
						event.todis.push(event.cards[i]);
					} else {
						event.basic.push(event.cards[i]);
					}
				} else {
					event.todis.push(event.cards[i]);
					event.nonbasic.push(event.cards[i]);
				}
			}
			game.cardsDiscard(event.todis);
			var num = event.nonbasic.length;
			if (num == 0) {
				if (event.basic.length == 0) {
					event.finish();
					return;
				}
				player.storage.zhaolie
					.chooseTarget(
						function (card, player, target) {
							var source = _status.event.source;
							return target == source || target == source.storage.zhaolie;
						},
						true,
						"选择一个目标获得" + get.translation(event.basic)
					)
					.set("ai", function (target) {
						return get.attitude(_status.event.player, target);
					})
					.set("source", player);
			} else {
				player.storage.zhaolie
					.chooseToDiscard(num, "he", "弃置" + get.cnNumber(num) + "张牌并令" + get.translation(player) + "拿牌，或受到" + get.cnNumber(num) + "点伤害并拿牌")
					.set("ai", function (card) {
						var player = _status.event.player;
						switch (_status.event.num) {
							case 1:
								return player.hp > 1 ? 0 : 7 - get.value(card);
							case 2:
								return 8 - get.value(card);
							case 3:
								return 10 - get.value(card);
							default:
								return 0;
						}
					})
					.set("num", num);
			}
			"step 2";
			var num = event.nonbasic.length;
			var undone = false;
			if (num == 0) {
				if (event.basic.length) {
					result.targets[0].gain(event.basic, "gain2", "log");
				}
			} else {
				if (result.bool) {
					if (event.basic.length) {
						player.gain(event.basic, "gain2", "log");
					}
				} else {
					player.storage.zhaolie.damage(num);
					if (event.basic.length) {
						undone = true;
					}
				}
			}
			if (!undone) {
				delete player.storage.zhaolie;
				event.finish();
			}
			"step 3";
			if (player.storage.zhaolie.isIn()) {
				player.storage.zhaolie.gain(event.basic, "gain2", "log");
			} else {
				game.cardsDiscard(event.basic);
			}
			delete player.storage.zhaolie;
		},
	},
	fulu: {
		trigger: { player: "useCard1" },
		filter(event, player) {
			if (event.card.name == "sha" && !game.hasNature(event.card)) return true;
		},
		audio: true,
		check(event, player) {
			var eff = 0;
			for (var i = 0; i < event.targets.length; i++) {
				var target = event.targets[i];
				var eff1 = get.damageEffect(target, player, player);
				var eff2 = get.damageEffect(target, player, player, "thunder");
				eff += eff2;
				eff -= eff1;
			}
			return eff >= 0;
		},
		content() {
			game.setNature(trigger.card, "thunder");
			if (get.itemtype(trigger.card) == "card") {
				var next = game.createEvent("fulu_clear");
				next.card = trigger.card;
				event.next.remove(next);
				trigger.after.push(next);
				next.setContent(function () {
					game.setNature(card, []);
				});
			}
		},
	},
	fuji: {
		trigger: { global: "damageBegin1" },
		filter(event) {
			return event.source && event.source.isIn() && event.hasNature("thunder");
		},
		check(event, player) {
			return get.attitude(player, event.source) > 0 && get.attitude(player, event.player) < 0;
		},
		prompt(event) {
			return get.translation(event.source) + "即将对" + get.translation(event.player) + "造成伤害，" + get.prompt("fuji");
		},
		logTarget: "source",
		content() {
			trigger.source.judge().callback = lib.skill.fuji.callback;
		},
		callback() {
			var evt = event.getParent(2);
			switch (event.judgeResult.color) {
				case "black":
					evt._trigger.num++;
					break;

				case "red":
					evt._trigger.source.gain(card, "gain2");
				default:
					break;
			}
		},
	},
	//田钏
	pshuying: {
		trigger: {
			global: ["phaseBefore", "dieAfter"],
			player: "enterGame",
		},
		forced: true,
		filter(event, player) {
			if (event.name == "die") return event.player != player;
			return event.name != "phase" || game.phaseNumber == 0;
		},
		async content(event, trigger, player) {
			let cards = [],
				num = trigger.name == "die" ? 1 : 2;
			while (cards.length < num) {
				const card = game.createCard2("xingbian", "spade", 9);
				cards.push(card);
			}
			if (cards.length) await player.gain(cards, "gain2");
		},
		mod: {
			ignoredHandcard(card, player) {
				if (card.name == "xingbian") {
					return true;
				}
			},
			cardDiscardable(card, player, name) {
				if (name == "phaseDiscard" && card.name == "xingbian") {
					return false;
				}
			},
			globalTo(from, to, num) {
				let count = 0;
				game.filterPlayer(current => {
					count += current.countCards("ej", card => card.name == "xingbian");
				});
				return num + count;
			},
		},
	},
	psqianjing: {
		trigger: {
			player: "damageEnd",
			source: "damageSource",
		},
		filter(event, player) {
			if (!player.countCards("h", card => card.name == "xingbian")) return false;
			return game.hasPlayer(current => current.hasEnabledSlot());
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseCardTarget({
					filterCard(card) {
						return card.name == "xingbian";
					},
					position: "h",
					prompt: get.prompt("psqianjing"),
					prompt2: "将手牌中的一张【刑鞭】置入一名角色装备区",
					filterTarget(card, player, target) {
						return target.hasEnabledSlot();
					},
					ai1(card) {
						return 10 - get.value(card);
					},
					ai2(target) {
						const player = get.player();
						if (target == player) return 1;
						if (get.attitude(player, target) < 0) return 3;
						return 0;
					},
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const target = event.targets[0],
				cardx = event.cards[0];
			const choices = [];
			for (let i = 0; i <= 5; i++) {
				if (target.hasEquipableSlot(i)) choices.push(`equip${i}`);
			}
			if (!choices.length) return;
			const result = await player
				.chooseControl(choices)
				.set("prompt", `请选择为${get.translation(target)}置入【刑鞭】的装备栏`)
				.set("ai", () => _status.event.controls.randomGet())
				.forResult();
			const card = get.autoViewAs(cardx);
			card.subtypes = [result.control];
			player.$give(card, target, false);
			await target.equip(card);
			if (target == player) await player.draw();
		},
		group: "psqianjing_use",
		subSkill: {
			use: {
				enable: "chooseToUse",
				filter(event, player) {
					if (!event.filterCard(get.autoViewAs({ name: "sha" }, "unsure"), player, event)) return false;
					if (player.countCards("h", card => card.name == "xingbian")) return true;
					return game.hasPlayer(current => {
						return current.countCards("ej", card => card.name == "xingbian");
					});
				},
				delay: false,
				locked: false,
				prompt: "将场上或你手牌中的一张【刑鞭】当作【杀】使用",
				filterTarget(card, player, target) {
					let event = _status.event,
						evt = event;
					if (event._backup) evt = event._backup;
					const pos = target == player ? "hej" : "ej";
					return target.countCards(pos, card => {
						if (card.name != "xingbian") return false;
						let sha = get.autoViewAs({ name: "sha", storage: { qianjing: true } }, [card]);
						if (evt.filterCard(sha, player, event)) {
							return game.hasPlayer(function (current) {
								return evt.filterTarget(sha, player, current);
							});
						}
					});
				},
				async content(event, trigger, player) {
					var evt = event.getParent(2),
						target = event.targets[0];
					evt.set("xingbian", true);
					const result = await player
						.choosePlayerCard(true, target, target == player ? "hej" : "ej")
						.set("filterButton", function (button) {
							var card = button.link;
							return card.name == "xingbian";
						})
						.forResult();
					game.broadcastAll(
						function (result, name) {
							lib.skill.psqianjing_backup.viewAs = {
								name: name,
								cards: [result],
								storage: { qianjing: true },
							};
							lib.skill.psqianjing_backup.prompt = "选择" + get.translation(name) + "（" + get.translation(result) + "）的目标";
						},
						result.links[0],
						"sha"
					);
					evt.set("_backupevent", "psqianjing_backup");
					evt.backup("psqianjing_backup");
					evt.set("openskilldialog", "选择杀（" + get.translation(result.links[0]) + "）的目标");
					evt.set("norestore", true);
					evt.set("custom", {
						add: {},
						replace: { window() {} },
					});
					evt.goto(0);
				},
				ai: {
					respondSha: true,
					skillTagFilter(player, tag) {
						var func = card => card.name == "xingbian";
						return game.hasPlayer(function (current) {
							return current.countCards(current == player ? "hej" : "ej", func);
						});
					},
					order: 1,
					result: {
						player(player, target) {
							if (_status.event.type != "phase") return 1;
							if (!player.hasValueTarget({ name: "sha" })) return 0;
							return 0.1;
						},
					},
				},
			},
			backup: {
				precontent() {
					"step 0";
					delete event.result.skill;
					var cards = event.result.card.cards;
					event.result.cards = cards;
					var owner = get.owner(cards[0]);
					event.target = owner;
					owner.$give(cards[0], player, false);
					player.popup(event.result.card.name, "metal");
					game.delayx();
					event.getParent().addCount = false;
				},
				filterCard() {
					return false;
				},
				prompt: "请选择【杀】的目标",
				selectCard: -1,
			},
		},
	},
	psbianchi: {
		trigger: {
			player: "phaseJieshuEnd",
		},
		limited: true,
		skillAnimation: true,
		animationColor: "metal",
		logTarget(event, player) {
			return game.filterPlayer(current => {
				return current.countCards("ej", card => card.name == "xingbian");
			});
		},
		filter(event, player) {
			const targets = lib.skill.psbianchi.logTarget(event, player);
			return targets && targets.length;
		},
		check(event, player) {
			const targets = lib.skill.psbianchi.logTarget(event, player);
			let eff = 0;
			for (const target of targets) eff += get.sgnAttitude(player, target);
			return eff < 0;
		},
		async content(event, trigger, player) {
			player.awakenSkill(event.name);
			const lose_list = [];
			for (const target of event.targets) {
				lose_list.push([target, target.getCards("ej", card => card.name == "xingbian")]);
			}
			await game
				.loseAsync({
					lose_list: lose_list,
					discarder: player,
				})
				.setContent("discardMultiple");
			for (const target of event.targets) {
				const result = await target
					.chooseControl()
					.set("choiceList", ["令" + get.translation(player) + "操控你执行一个仅能使用两张牌的出牌阶段", "失去2点体力"])
					.set(
						"choice",
						(function () {
							if (get.attitude(target, player) > 0) return "选项一";
							if (get.effect(target, { name: "losehp" }, target, target) > 0 && target.hp > 2) return "选项二";
							return "选项一";
						})()
					)
					.set("ai", () => {
						return _status.event.choice;
					})
					.forResult();
				if (result.control == "选项一") {
					target.addTempSkill("psbianchi_control", { player: "phaseUseEnd" });
					const next = target.phaseUse();
					next.owner = ["psbianchi", player];
					await next;
				} else await target.loseHp(2);
			}
		},
		subSkill: {
			control: {
				forced: true,
				charlotte: true,
				direct: true,
				trigger: {
					player: "phaseUseBefore",
				},
				filter(event, player) {
					return !player._trueMe && event?.owner?.[1].isIn() && player != event.owner[1];
				},
				content() {
					const owner = trigger.owner[1];
					player._trueMe = owner;
					game.addGlobalSkill("autoswap");
					if (player == game.me) {
						game.notMe = true;
						if (!_status.auto) ui.click.auto();
					}
				},
				mod: {
					cardEnabled(card, player) {
						let history = player.getHistory("useCard", evt => {
							let phaseUse = evt.getParent("phaseUse", true);
							return phaseUse?.player == player && phaseUse.owner?.[0] == "psbianchi";
						});
						if (history?.length >= 2) return false;
					},
					cardUsable(card, player) {
						return lib.skill.psbianchi_control.mod.cardEnabled.apply(this, arguments);
					},
					cardSavable(card, player) {
						return lib.skill.psbianchi_control.mod.cardEnabled.apply(this, arguments);
					},
				},
				onremove(player) {
					if (player._trueMe) {
						if (player == game.me) {
							if (!game.notMe) game.swapPlayerAuto(player._trueMe);
							else delete game.notMe;
							if (_status.auto) ui.click.auto();
						}
						delete player._trueMe;
					}
				},
			},
		},
	},
	xingbian_skill: {
		equipSkill: true,
		mod: {
			attackRange: function (player, distance) {
				return distance + player.countCards("e", card => card.name == "xingbian");
			},
		},
		trigger: {
			player: "phaseUseBegin",
		},
		forced: true,
		intro: {
			content(storage, player) {
				let str = "";
				for (const arg of storage) {
					str += `${get.translation(arg[0])}命你攻击${get.translation(arg[1])}<br>`;
				}
				return str.slice(0, -4);
			},
		},
		logTarget(event, player) {
			return game.filterPlayer(current => get.nameList(current).includes("yj_tianchuan"));
		},
		filter(event, player) {
			const targets = lib.skill.xingbian_skill.logTarget(event, player);
			return targets && targets.length;
		},
		async content(event, trigger, player) {
			for (const target of event.targets) {
				const result = await target
					.chooseTarget(`刑鞭：为${get.translation(player)}指定塔塔开目标`, true, function (card, player, targetx) {
						return targetx != _status.event.owner;
					})
					.set("owner", player)
					.set("ai", target => {
						return get.distance(_status.event.owner, target) + 1;
					})
					.forResult();
				if (result.bool) {
					if (!player.getStorage("xingbian_skill").length) {
						player.when("phaseJieshuBegin").then(() => {
							const args = player.storage.xingbian_skill.shift();
							let damage = true;
							if (player.getHistory("useCard", evt => evt.card.name == "sha" && evt.targets?.includes(args[1])).length) damage = false;
							if (player.getHistory("sourceDamage", evt => evt.player == args[1]).length) damage = false;
							if (damage === true) {
								args[0].chat("该罚！");
								args[0].line(player, "green");
								player.damage(player);
							}
							if (player.storage.xingbian_skill.length) event.redo();
							else {
								player.unmarkSkill("xingbian_skill");
								delete player.storage.xingbian_skill;
							}
						});
						player.storage.xingbian_skill = [];
					}
					target.line(result.targets[0], "green");
					player.storage.xingbian_skill.push([target, result.targets[0]]);
					player.markSkill("xingbian_skill");
				}
			}
		},
	},
};

export default skills;
