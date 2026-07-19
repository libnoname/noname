import { lib, game, ui, get, ai, _status } from "noname";
import html from "dedent";

/** @type { importCharacterConfig["skill"] } */
const skills = {
	//王战贾诩
	sclwansha: {
		audio: "rewansha",
		forced: true,
		trigger: {
			global: "dying",
		},
		filter(event, player) {
			return _status.currentPhase == player && player != event.player;
		},
		logTarget: "player",
		async content(event, trigger, player) {
			const [target] = event.targets;
			await target.die(trigger.reason);
		},
	},
	//SCL
	scls_zhanshen: {
		audio: 2,
		trigger: {
			player: "phaseZhunbeiBegin",
		},
		filter(event, player) {
			return ["draw", "damage", "target"].some(suffix => {
				return !player.hasSkill(`scls_zhanshen_${suffix}`, null, null, false);
			});
		},
		forced: true,
		async content(event, trigger, player) {
			const list = [
				["draw", "摸牌阶段额外摸一张牌"],
				["damage", "使用【杀】造成的伤害+1"],
				["target", "使用【杀】可以额外指定一个目标"],
			].filter(suffix => {
				return !player.hasSkill(`scls_zhanshen_${suffix[0]}`, null, null, false);
			});
			const result =
				list.length > 1
					? await player
							.chooseButton(["战神：选择一项", [list, "textbutton"]], true)
							.set("ai", button => {
								return [null, "target", "damage", "draw"].indexOf(button.link);
							})
							.forResult()
					: {
							bool: true,
							links: [list[0][0]],
						};
			if (result.bool) {
				result.links.forEach(suffix => {
					player.addSkill(`scls_zhanshen_${suffix}`);
				});
			}
		},
		subSkill: {
			draw: {
				audio: "scls_zhanshen",
				trigger: {
					player: "phaseDrawBegin2",
				},
				filter(event) {
					return !event.numFixed;
				},
				forced: true,
				charlotte: true,
				async content(event, trigger, player) {
					trigger.num++;
				},
			},
			damage: {
				audio: "scls_zhanshen",
				trigger: {
					source: "damageBegin1",
				},
				filter(event) {
					return event.card?.name == "sha";
				},
				forced: true,
				charlotte: true,
				async content(event, trigger, player) {
					trigger.num++;
				},
			},
			target: {
				audio: "scls_zhanshen",
				forced: true,
				charlotte: true,
				mod: {
					selectTarget(card, player, range) {
						if (card.name == "sha" && range[1] != -1) {
							range[1]++;
						}
					},
				},
			},
		},
	},
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
					if (get.type(card) === "delay") {
						return "zeroplayertarget";
					}
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
			if (get.mode() === "doudizhu") {
				return 0;
			}
			return 1;
		},
		check(card) {
			let suit = get.suit(card);
			return lib.skill.scls_pingcai.takaramonoValue(suit, get.event().player);
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
						if (surname === "诸葛" && name === "亮") {
							return true;
						}
					}
				});
			const result = await player
				.chooseTarget("请选择" + (ingame ? "至多两名" : "一名") + "角色，对其造成1点火焰伤害", ingame ? [1, 2] : [1, 1], true)
				.set("ai", target => {
					const player = get.event().player;
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
						if (surname === "庞" && name === "统") {
							return true;
						}
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
					const player = get.event().player;
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
						if (surname === "司马" && name === "徽") {
							return true;
						}
					}
				});
			if (equip && !player.canMoveCard(null, true)) {
				return;
			}
			if (
				!equip &&
				!player.canMoveCard(null, true, card => {
					return get.subtype(card) === "equip2";
				})
			) {
				return;
			}
			const { bool, targets } = await player
				.chooseTarget(2, (card, player, target) => {
					if (ui.selected.targets.length) {
						if (!get.event().equip) {
							let cards = ui.selected.targets[0].getEquips(2);
							return cards.some(card => target.canEquip(card));
						}
						let from = ui.selected.targets[0];
						if (target.isMin()) {
							return false;
						}
						let es = from.getCards("e");
						for (let i = 0; i < es.length; i++) {
							if (target.canEquip(es[i])) {
								return true;
							}
						}
						return false;
					} else {
						if (!get.event().equip) {
							if (target.getEquips(2).length) {
								return true;
							}
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
					const player = get.event().player,
						att = get.attitude(player, target);
					if (ui.selected.targets.length === 0) {
						if (
							att < 0 &&
							game.hasPlayer(current => {
								if (get.attitude(player, current) > 0) {
									let es = target.getCards("e");
									for (let i = 0; i < es.length; i++) {
										if (current.canEquip(es[i])) {
											return true;
										}
									}
									return false;
								}
							})
						) {
							return -att;
						}
						return 0;
					}
					if (att > 0) {
						let es = ui.selected.targets[0].getCards("e"),
							i;
						for (i = 0; i < es.length; i++) {
							if (target.canEquip(es[i])) {
								break;
							}
						}
						if (i === es.length) {
							return 0;
						}
					}
					return -att * get.attitude(player, ui.selected.targets[0]);
				})
				.set("equip", equip)
				.forResult();
			if (!bool || targets.length !== 2) {
				return;
			}
			player.line2(targets, "green");
			await game.delay();
			let result;
			if (equip) {
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
			} else {
				let cards = targets[0].getEquips(2);
				if (cards.length === 1) {
					result = {
						bool: true,
						links: cards,
					};
				} else {
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
							if (!get.subtypes(button.link, false).includes("equip2")) {
								return false;
							}
							let targets1 = _status.event.targets1;
							return targets1.canEquip(button.link);
						})
						.forResult();
				}
			}
			if (result.bool && result.links.length) {
				let link = result.links[0];
				if (get.position(link) === "e") {
					await targets[1].equip(link);
				} else if (link.viewAs) {
					await targets[1].addJudge({ name: link.viewAs }, [link]);
				} else {
					await targets[1].addJudge(link);
				}
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
						if (surname === "徐" && name === "庶") {
							return true;
						}
					}
				});
			const result = await player
				.chooseTarget("请选择一名角色，令其回复1点体力并摸一张牌" + (ingame ? "，然后你摸一张牌" : ""), true)
				.set("ai", target => {
					const player = get.event().player;
					let eff = get.effect(target, { name: "draw" }, player, player);
					if (target.isDamaged()) {
						eff += get.recoverEffect(target, player, player);
					}
					if (get.event().ingame) {
						eff += get.effect(player, { name: "draw" }, player, player);
					}
					return eff;
				})
				.set("ingame", ingame)
				.forResult();
			if (result.bool && result.targets.length) {
				player.line(result.targets, "thunder");
				const target = result.targets[0];
				await target.draw();
				await target.recover();
				if (ingame) {
					await player.draw();
				}
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
					if (player.canMoveCard(true)) {
						return 12;
					}
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
						return lib.skill.scls_pingcai.takaramonoValue(button.link[2], get.event().player);
					})
					.forResult();
				if (!result.bool) {
					return;
				}
				name = result.links[0][2];
			} else {
				await player.showCards(event.cards);
				name = lib.skill.scls_pingcai.derivation[["diamond", "club", "spade", "heart"].indexOf(get.suit(event.cards[0], player))];
			}
			if (name) {
				await lib.skill.scls_pingcai[name](player);
			}
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
				bool,
				links: [card],
			} = await player
				.chooseCardButton("冲虚：选择要获得的牌", true, cards)
				.set("ai", button => {
					let color = get.color(button.link),
						need = get.event().color;
					if (need && color !== need) {
						return 0.1;
					}
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
							) {
								return "red";
							}
						}
						if (!player.hasSkill("scls_chongxu_miaojian")) {
							if (player.canUse({ name: "wuzhong" }, player)) {
								return "black";
							}
						}
						return false;
					})()
				)
				.forResult();
			if (!bool) {
				return;
			}
			let skill = get.color(card) === "red" ? "scls_lianhua" : "scls_miaojian";
			await player.gain(card, "gain2");
			if (!player.hasMark(skill)) {
				player.addMark(skill, 1, false);
			}
			if (skill === "scls_miaojian") {
				player.addTempSkill("scls_chongxu_miaojian");
			}
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
				if (level) {
					return true;
				}
				return player.hasCard(card => {
					return get.type2(card) === "basic";
				}, "hs");
			}
			if (event.filterCard({ name: "wuzhong" }, player, event)) {
				if (level) {
					return true;
				}
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
					if (!event.filterCard({ name: "sha", nature: "stab" }, player, event)) {
						return false;
					}
					if (level) {
						return true;
					}
					return player.hasCard(card => {
						return get.type2(card) === "basic";
					}, "hs");
				}
				if (button.link[2] === "wuzhong") {
					if (!event.filterCard({ name: "wuzhong" }, player, event)) {
						return false;
					}
					if (level) {
						return true;
					}
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
						if (card) {
							return 6.5 - get.value(card);
						}
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
			if (!player.hasMark("scls_lianhua")) {
				return;
			}
			const result = await trigger.player
				.chooseToDiscard("he", "弃置一张牌，或令" + get.translation(trigger.card) + "对" + get.translation(player) + "无效")
				.set("ai", card => {
					if (_status.event.eff > 0) {
						return 9 - get.value(card);
					}
					return 0;
				})
				.set("eff", get.effect(player, trigger.card, trigger.player, trigger.player))
				.forResult();
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
		mod: {
			targetInRange(card, player) {
				if (player.isPhaseUsing()) {
					return true;
				}
			},
			aiOrder(player, card, num) {
				let name = get.name(card);
				if (name === "tao") {
					return num + 7 + Math.pow(player.getDamagedHp(), 2);
				}
				if (name === "sha") {
					return num + 6;
				}
				if (get.subtype(card) === "equip2") {
					return num + get.value(card) / 3;
				}
			},
			cardUsable(card, player) {
				if (!player.isPhaseUsing()) {
					return false;
				}
				if (get.info(card) && get.info(card).forceUsable) {
					return;
				}
				return Infinity;
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
			return "摸一张牌" + (player.hasMark("scls_kuangcai_mark") ? "" : "，本回合至多使用五张牌");
		},
		frequent: true,
		async content(event, trigger, player) {
			player.addTempSkill("scls_kuangcai_mark");
			await player.draw("nodelay");
		},
		ai: {
			threaten: 4.5,
		},
		subSkill: {
			mark: {
				mod: {
					cardEnabled(card, player) {
						if (player.countMark("scls_kuangcai_mark") >= 5) {
							return false;
						}
					},
					cardSavable(card, player) {
						if (player.countMark("scls_kuangcai_mark") >= 5) {
							return false;
						}
					},
				},
				init(player, skill) {
					const num = player.getHistory("useCard").length - 1;
					player.setMark(skill, num, false);
				},
				onremove: true,
				intro: {
					content(storage, player) {
						return "本回合还可使用" + get.cnNumber(5 - storage) + "张牌";
					},
				},
				charlotte: true,
				trigger: { player: "useCard1" },
				silent: true,
				content() {
					player.addMark(event.name, 1, false);
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
				if (evt.type === "discard" && evt.getParent("phaseDiscard") === event) {
					cards.addArray(evt.cards2);
				}
			});
			if (!cards.length) {
				return false;
			}
			let suits = [];
			for (let i of cards) {
				let suit = get.suit(i);
				if (suits.includes(suit)) {
					return false;
				}
				suits.push(suit);
			}
			return true;
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt(event.name.slice(0, -5)), "弃置一名其他角色的一张牌", (card, player, target) => {
					if (player === target) {
						return false;
					}
					return target.countDiscardableCards(player, "he") > 0;
				})
				.set("ai", target => {
					const player = get.player();
					let att = get.attitude(player, target);
					if (att >= 0) {
						return 0;
					}
					if (target.countDiscardableCards(player, "h") > 0 && target.hasSkillTag("noh")) {
						att /= 6;
					}
					if (target.countDiscardableCards(player, "e") > 0 && target.hasSkillTag("noe")) {
						att /= 4;
					}
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
		filterCard: lib.filter.cardDiscardable,
		position: "he",
		selectCard: [2, Infinity],
		check(card) {
			if (ui.selected.cards.length > 1) {
				return 0;
			}
			let player = get.event().player;
			if (player.hasSkill("xingtu") && player.storage.xingtu) {
				let number = get.number(card);
				return player.getHp() - player.getUseValue(card, null, number % (player.storage.xingtu_mark || 13) !== 0);
			}
			return 5 - get.value(card);
		},
		allowChooseAll: true,
		async content(event, trigger, player) {
			let cards = get.cards(event.cards.length, true);
			await player.showCards(cards, get.translation(player) + "发动了【爵制】");
			const result = await player
				.chooseCardButton({
					prompt: "爵制：选择要获得的牌",
					cards,
					forced: true,
					ai(button) {
						const player = get.player();
						const number = get.number(button.link);
						return player.getUseValue(button.link, null, number % (player.storage.xingtu_mark || 13) !== 0);
					},
				})
				.forResult();
			if (result?.links?.length) {
				await player.gain({
					cards: result.links,
					animate: "gain2",
				});
			}
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
		inherit: "xinfu_lingren",
		filter(event, player) {
			if (!player.isPhaseUsing()) {
				return false;
			}
			if (event.getParent().triggeredTargets3.length > 1) {
				return false;
			}
			if (event.card.name === "sha") {
				return true;
			}
			return get.tag(event.card, "damage") && get.type(event.card) === "trick";
		},
		derivation: ["jianxiong", "xingshang"],
		async content(event, trigger, player) {
			const target = event.targets[0];
			const result = await player
				.chooseButton(["凌人：猜测其有哪些类别的手牌", [["basic", "trick", "equip"].map(i => `caoying_${i}`), "vcard"]], [0, 3], true)
				.set("ai", button => {
					const type = button.link[2].slice(8);
					return get.event().choice.includes(type);
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
						if (!cards || choice.length > 2) {
							return choice;
						}
						if (!choice.includes("basic") && cards > 2 * Math.random()) {
							choice.push("basic");
						}
						if (!choice.includes("trick") && cards > 3 * Math.random()) {
							choice.push("trick");
						}
						if (!choice.includes("equip") && cards > 6 * Math.random()) {
							choice.push("equip");
						}
						return choice;
					})()
				)
				.forResult();
			if (!result?.bool) {
				return;
			}
			const choices = result.links.map(i => i[2].slice(8));
			await target.showHandcards();
			let num = 0;
			["basic", "trick", "equip"].forEach(type => {
				if (choices.includes(type) === target.hasCard(card => get.type2(card, target) === type, "h")) {
					num++;
				}
			});
			player.popup("猜对" + get.cnNumber(num) + "项");
			game.log(player, "猜对了" + get.cnNumber(num) + "项");
			if (num > 0) {
				await player.draw(2);
			}
			if (num > 1) {
				const map = trigger.customArgs;
				const id = target.playerid;
				map[id] ??= {};
				if (typeof map[id].extraDamage != "number") {
					map[id].extraDamage = 0;
				}
				map[id].extraDamage++;
			}
			if (num > 2) {
				await player.addTempSkills(get.info(event.name).derivation, { player: "phaseBegin" });
			}
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
			if (total % 3 === 0) {
				num++;
			}
			if (total % 5 === 0) {
				num++;
			}
			if (total % 8 === 0) {
				num++;
			}
			if (num) {
				await player.draw(num);
			}
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
};

export default skills;
