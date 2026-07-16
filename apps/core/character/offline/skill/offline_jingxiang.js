import { lib, game, ui, get, ai, _status } from "noname";
import html from "dedent";

/** @type { importCharacterConfig["skill"] } */
const skills = {
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
				if (event.isMine() && !event.isOnline()) {
					await game.delay();
				}
				await player.showHandcards(`${get.translation(player)}发动了【绽焰】`);
				const num = Math.min(3, Math.abs(result.links[0] - player.countCards("h", card => get.color(card, player) == "red")));
				const redCards = player.getCards("he", card => get.color(card, player) == "red");
				if (redCards.length) {
					await player.give(redCards, target);
				}
				if (num > 0) {
					await target.damage("fire", num);
				}
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
				if (get.suit(card) == "diamond" && card.name == "sha") {
					return true;
				}
			},
		},
		locked: false,
		audio: "wusheng",
		enable: ["chooseToUse", "chooseToRespond"],
		filter(event, player) {
			return get
				.inpileVCardList(info => {
					const name = info[2];
					if (info[3]) {
						return false;
					}
					if (name != "sha" && name != "jiu") {
						return false;
					}
					return get.type(name) == "basic";
				})
				.some(card => player.hasCard(cardx => get.color(cardx, player) == "red" && event.filterCard({ name: card[2], nature: card[3], cards: [cardx] }, player, event), "hes"));
		},
		chooseButton: {
			dialog(event, player) {
				const list = get
					.inpileVCardList(info => {
						const name = info[2];
						if (info[3]) {
							return false;
						}
						if (name != "sha" && name != "jiu") {
							return false;
						}
						return get.type(name) == "basic";
					})
					.filter(card => player.hasCard(cardx => get.color(cardx, player) == "red" && event.filterCard({ name: card[2], nature: card[3], cards: [cardx] }, player, event), "hes"));
				return ui.create.dialog("武圣", [list, "vcard"]);
			},
			filter(button, player) {
				return _status.event.getParent().filterCard({ name: button.link[2], nature: button.link[3] }, player, _status.event.getParent());
			},
			check(button) {
				if (_status.event.getParent().type != "phase") {
					return 1;
				}
				const player = get.event().player,
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
			if (name != "jiu") {
				return false;
			}
			return player.countCards("hes", { color: "red" });
		},
		ai: {
			skillTagFilter(player) {
				if (!player.countCards("hes", { color: "red" })) {
					return false;
				}
			},
			respondSha: true,
		},
		subSkill: { backup: {} },
	},
	//神曹仁
	jxjushou: {
		trigger: {
			player: "phaseJieshuBegin",
		},
		check(event, player) {
			if (game.countPlayer() > 4) {
				return true;
			}
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
				for (const current of game.players.sortBySeat(player)) {
					if (current.isIn()) {
						await current.turnOver();
						await current.draw(3);
					}
				}
				const lose_list = [];
				for (const current of game.players.sortBySeat(player)) {
					if (current.countCards("e") && current.isIn()) {
						lose_list.push([current, current.getCards("e")]);
					}
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
					if (card.name == "guiyoujie") {
						return [0, 1];
					}
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
			if (!game.hasPlayer(current => !player.getStorage("jxtuwei").includes(current))) {
				return false;
			}
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
				if (!game.hasPlayer(target => !player.getStorage("jxtuwei").includes(target) && get.attitude(player, target) > 0)) {
					return num;
				}
				return 5 / num;
			},
			backup(links, player) {
				return {
					card: links[0],
					filterTarget(card, player, target) {
						return !player.getStorage("jxtuwei").includes(target) && target.canEquip(links[0], true);
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
										if (get.damageEffect(target, player, player) > 0) {
											return "对其造成1点伤害";
										}
										if (get.effect(target, { name: "draw" }, player, player) > 0) {
											return "令其摸一张牌";
										}
										return "cancel2";
									})()
								)
								.forResult();
							if (result.index == 0) {
								await target.draw();
							}
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
								if (att > 0) {
									return 3;
								}
								if (att < 0) {
									return -1;
								}
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
			global: ["phaseBefore", "gameDrawBegin"],
			player: "enterGame",
		},
		forced: true,
		filter(event, player) {
			if (event.name == "gameDraw") {
				return true;
			}
			return event.name != "phase" || game.phaseNumber == 0;
		},
		async content(event, trigger, player) {
			if (trigger.name == "gameDraw") {
				const me = player;
				const numx = trigger.num;
				trigger.num = function (player) {
					return (player == me ? game.countGroup() : 0) + (typeof numx == "function" ? numx(player) : numx);
				};
				return;
			}
			let cards = [];
			while (cards.length < 2) {
				const card = game.createCard2("jingxiangshengshi", "heart", 5);
				cards.push(card);
			}
			if (cards.length) {
				await player.gain(cards, "gain2");
			}
			const num = game.countGroup();
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
			if (game.countPlayer(current => player.canUse(card, current)) < game.countGroup()) {
				return;
			}
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
					if (player.countCards("he")) {
						await player.chooseToDiscard("he", true);
					}
					player.unmarkAuto("jxfujing_effect", [target]);
					if (!player.getStorage("jxfujing_effect").length) {
						player.removeSkill(event.name);
					}
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
				.chooseCard(get.prompt(event.skill, target), prompt2, "he")
				.set("ai", function (card) {
					const eff = _status.event.eff,
						isPlayer = _status.event.isPlayer;
					if ((isPlayer && eff < 0) || (!isPlayer && eff > 0)) {
						return 6 - get.value(card);
					}
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
			if (event.triggername == "damageBegin1") {
				trigger.num++;
			} else {
				trigger.num--;
			}
		},
	},
};

export default skills;
