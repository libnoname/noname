import { lib, game, ui, get, ai, _status } from "noname";

/** @type { importCharacterConfig['skill'] } */
const skills = {
	//高达木牛流马
	mbshezi: {
		audio: 2,
		trigger: {
			player: ["phaseZhunbeiBegin"],
		},
		forced: true,
		filter(event, player) {
			return game.hasPlayer(current => current.countCards("hej"));
		},
		async content(event, trigger, player) {
			const result = await player
				.chooseTarget(
					get.prompt2(event.name),
					(card, player, target) => {
						return target.countCards("hej");
					},
					true
				)
				.set("ai", target => {
					const player = get.player();
					return -get.attitude(player, target);
				})
				.forResult();
			if (result?.bool && result?.targets?.length) {
				const target = result.targets[0];
				player.line(target);
				const control = await player
					.chooseControl("手牌区", "装备区", "判定区", true)
					.set("ai", function () {
						const target = get.event().target;
						if (target.countCards("h") > target.countCards("e")) {
							return 0;
						}
						return 1;
					})
					.set("target", target)
					.set("prompt", `请选择${get.translation(target)}的一个区域`)
					.forResult();
				const choice = {
					手牌区: "h",
					装备区: "e",
					判定区: "j",
				}[control.control];
				if (target.countCards(choice, card => get.type(card) == "equip")) {
					await player.gain(target.getGainableCards(player, choice), target, "giveAuto");
				} else {//刘巴！刘巴！刘巴！
					target.chat("沒有！没有！没有！");
				}
			}
		},
	},
	mbyixing: {
		group: "mbyixing_update",
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		locked: false,
		manualConfirm: true,
		async content(event, trigger, player) {
			const cards = player.getExpansions(event.name);
			if (cards?.length) {
				await player.loseToDiscardpile(cards);
				await player.draw(cards.length);
			}
			if (!player.countCards("he", card => get.type(card) == "equip")) {
				return;
			}
			const result = await player
				.chooseCard("he", "你可将任意张装备牌置于武将牌上，称为“器”", [1, Infinity], card => get.type(card) == "equip")
				.set("ai", card => {
					return 6 - get.value(card);
				})
				.forResult();
			if (result.bool) {
				const next = player.addToExpansion(result.cards, player, "give");
				next.gaintag.add(event.name);
				await next;
			}
		},
		marktext: "器",
		intro: {
			name: "易型（器）",
			content: "expansion",
			markcount: "expansion",
		},
		onremove(player, skill) {
			const cards = player.getExpansions(skill);
			if (cards.length) {
				player.loseToDiscardpile(cards);
				player.removeAdditionalSkill(skill);
			}
		},
		mod: {
			globalFrom(from, to, distance) {
				return (
					distance + from.getExpansions("mbyixing").reduce((sum, card) => sum + (lib.card[get.name(card)]?.distance?.globalFrom || 0), 0)
				);
			},
			globalTo(from, to, distance) {
				return distance + to.getExpansions("mbyixing").reduce((sum, card) => sum + (lib.card[get.name(card)]?.distance?.globalTo || 0), 0);
			},
			attackRange(from, distance) {
				return (
					distance - from.getExpansions("mbyixing").reduce((sum, card) => sum + (lib.card[get.name(card)]?.distance?.attackFrom || 0), 0)
				);
			},
			attackTo(from, to, distance) {
				return distance + to.getExpansions("mbyixing").reduce((sum, card) => sum + (lib.card[get.name(card)]?.distance?.attackTo || 0), 0);
			},
		},
		ai: {
			result: {
				player(player) {
					if (player.hp < 3) {
						return 5;
					}
					return 1;
				},
			},
		},
		subSkill: {
			update: {
				trigger: {
					player: ["loseAfter"],
					global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"],
				},
				charlotte: true,
				popup: false,
				forced: true,
				filter(event, player) {
					const skill = "mbyixing";
					if (event?.gaintag?.includes(skill)) {
						return event.name == "loseAsync" ? event.type == "addToExpansion" : event.name == "addToExpansion";
					}
					const evt = event?.getl(player);
					return evt?.xs?.length && evt?.xs?.some(card => evt?.gaintag_map[card.cardid]?.includes(skill));
				},
				async content(event, trigger, player) {
					const cards = player.getExpansions("mbyixing");
					player.addAdditionalSkill("mbyixing", get.skillsFromEquips(cards));
				},
			},
		},
	},
	//哈基术
	mbjimi: {
		audio: 4,
		forced: true,
		trigger: {
			global: "phaseBefore",
			player: "enterGame",
		},
		filter(event, player) {
			return event.name != "phase" || game.phaseNumber == 0;
		},
		logTarget: () => game.players,
		logAudio: () => 2,
		async content(event, trigger, player) {
			const { targets } = event;
			const map = new Map();
			targets.forEach(target =>
				map.set(
					target,
					target.getCards("h", card => !["tao", "jiu"].includes(get.name(card)))
				)
			);
			await game.loseAsync({ lose_list: Array.from(map.entries()) }).setContent("chooseToCompareLose");
			await game.doAsyncInOrder(
				targets.sortBySeat(game.findPlayer(i => i.getSeatNum() == 1)),
				async target => {
					const cards = [];
					const list = [[], []];
					const hs = map.get(target);
					while (cards.length < hs.length) {
						const card = get.cardPile(card => ["tao", "jiu"].includes(get.name(card)) && !cards.includes(card));
						if (card) {
							cards.push(card);
							if (get.position(card) == "c") {
								list[0].push(hs[list[0].length]);
								list[1].push(card);
							}
						} else {
							break;
						}
					}
					if (list[0].length) {
						await game.cardsGotoPile(list[0], (event, card) => event.list[1][event.list[0].indexOf(card)]).set("list", list);
					}
					if (cards.length) {
						target._start_cards = target.getCards("h").concat(cards);
						return target.gain(cards, "draw").set("delay", false);
					}
				},
				() => false
			);
		},
		group: "mbjimi_gain",
		subSkill: {
			gain: {
				audio: ["mbjimi3.mp3", "mbjimi4.mp3"],
				forced: true,
				trigger: {
					global: ["loseAfter", "loseAsyncAfter", "cardsDiscardAfter", "equipAfter"],
				},
				filter(event, player) {
					if (event.name == "cardsDiscard") {
						const evt = event.getParent();
						if ((evt.relatedEvent || evt.getParent()).name == "useCard") {
							return false;
						}
					}
					return event.getd?.().some(card => ["tao", "jiu"].includes(get.name(card)));
				},
				async content(event, trigger, player) {
					const num = get.discarded().filter(card => ["tao", "jiu"].includes(get.name(card))).length;
					const card = get.cardPile(card => get.is.damageCard(card) && get.cardNameLength(card) == num);
					if (card) {
						await player.gain(card, "gain2");
					} else {
						player.chat("哈基米哦南北路多");
					}
				},
			},
		},
	},
	mbmaodie: {
		audio: 4,
		forced: true,
		trigger: { player: "useCardAfter" },
		filter(event, player) {
			if (player.hasHistory("sourceDamage", evt => evt.card == event.card)) {
				return true;
			}
			return player.countMark(`mbmaodie_used`) < 2 && get.info("mbmaodie").getCards(player, event.targets || []).length > 0;
		},
		getCards(player, targets) {
			return targets.flatMap(target =>
				(target._start_cards || []).filter(card => "cdhej".includes(get.position(card)) && get.owner(card) !== player)
			);
		},
		logAudio: (event, player) => player.hasHistory("sourceDamage", evt => evt.card == event.card) ? 2 : ["mbmaodie3.mp3", "mbmaodie4.mp3"],
		async content(event, trigger, player) {
			if (player.hasHistory("sourceDamage", evt => evt.card == trigger.card)) {
				player.addTempSkill(`${event.name}_limit`);
				player.setStorage(`${event.name}_limit`, get.cardNameLength(trigger.card), true);
			} else {
				player.addTempSkill(`${event.name}_used`);
				player.addMark(`${event.name}_used`, 1, false);
				const card = get.info(event.name).getCards(player, trigger.targets).randomGet();
				if (card) {
					let animate = ["gain2"];
					if (get.owner(card)) {
						animate = [get.owner(card), "giveAuto"];
					}
					await player.gain(card, ...animate);
					return;
				}
			}
		},
		subSkill: {
			used: {
				charlotte: true,
				onremove: true,
			},
			limit: {
				charlotte: true,
				onremove: true,
				silent: true,
				trigger: { player: "useCard1" },
				filter(event, player) {
					return get.is.damageCard(event.card);
				},
				async content(event, trigger, player) {
					player.removeSkill(event.name);
				},
				mod: {
					cardEnabled(card, player) {
						const storage = player.storage.mbmaodie_limit;
						if (!storage || typeof storage != "number" || !get.is.damageCard(card)) {
							return;
						}
						return get.cardNameLength(card) > storage;
					},
				},
				intro: {
					markcount: storage => storage,
					content: "下一次使用的伤害牌字数需大于#",
				},
			},
		},
	},
	//魔白马
	dmchongqi: {
		audio: 2,
		trigger: {
			player: "useCardToPlayered",
		},
		usable: 1,
		filter(event, player) {
			return event.card.name == "sha" && event.target.countDiscardableCards(player, "he");
		},
		check(event, player) {
			return get.effect(event.target, { name: "guohe_copy2" }, player, player) > 0;
		},
		logTarget: "target",
		async content(event, trigger, player) {
			const target = event.targets[0];
			if (target.countDiscardableCards(player, "he")) {
				await player.discardPlayerCard(target, "he", true);
			}
			if (player.inRange(target) && !target.inRange(player)) {
				game.log(player, "触发了", "#y游击", "效果");
				player.popup("游击", "fire");
				const evt = trigger.getParent();
				evt.baseDamage ??= 1;
				evt.baseDamage++;
			}
		},
	},
	dmfanquan: {
		audio: 2,
		trigger: {
			player: "damageEnd",
		},
		filter(event, player) {
			return game.hasPlayer(current => current != player);
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt2(event.skill), lib.filter.notMe)
				.set("ai", target => {
					const player = get.player();
					const eff = get.damageEffect(target, player, player);
					if (player.inRange(target) && target.inRange(player)) {
						return eff * 2;
					}
					return eff;
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			await target.damage();
			if (player.inRange(target) && target.inRange(player)) {
				game.log(player, "触发了", "#y搏击", "效果");
				player.popup("搏击", "fire");
				if (trigger.num > 0) {
					await target.damage(trigger.num);
				}
				const skill = "dmfanquan_range";
				player.addTempSkill(skill);
				player.addMark(skill, 1, false);
			}
		},
		subSkill: {
			range: {
				charlotte: true,
				onremove: true,
				intro: {
					content: "计算与其他角色的距离+#",
				},
				mod: {
					globalFrom(from, to, distance) {
						return distance + from.countMark("dmfanquan_range");
					},
				},
			},
		},
	},
	bachiqionggouyu_skill: {
		trigger: {
			player: ["phaseUseEnd", "phaseDrawBegin"],
		},
		forced: true,
		equipSkill: true,
		filter(event, player) {
			const damageed = player.isDamaged();
			if (event.name == "phaseUSe") {
				return damageed;
			} else {
				return !damageed && !event.numFixed;
			}
		},
		async content(event, trigger, player) {
			if (trigger.name == "phaseUse") {
				await player.recover();
			} else {
				trigger.num += 2;
			}
		},
	},
	bazhijing_skill: {
		trigger: {
			player: ["damageAfter", "damageBegin"],
		},
		equipSkill: true,
		forced: true,
		init(player) {
			player.setStorage("bazhijing", []);
		},
		filter(event, player, triggername) {
			if (player.hasSkillTag("unequip2")) {
				return false;
			}
			if (
				event.source &&
				event.source.hasSkillTag("unequip", false, {
					name: event.card ? event.card.name : null,
					target: player,
					card: event.card,
				})
			) {
				return false;
			}
			const bool = player.getStorage("bazhijing").includes(event.card.name);
			if (triggername == "damageAfter") {
				return !bool;
			} else {
				return bool;
			}
		},
		async content(event, trigger, player) {
			if (event.triggername == "damageAfter") {
				player.markAuto("bazhijing", trigger.card.name);
			} else {
				trigger.cancel();
			}
		},
	},
	olmojin: {
		audio: 2,
		trigger: {
			player: ["enterGame", "mojinSucces"],
			global: ["phaseBefore"],
		},
		extraCards: [
			"bintieshuangji",
			"wuxinghelingshan",
			"wutiesuolian",
			"wushuangfangtianji",
			"chixueqingfeng",
			"guilongzhanyuedao",
			"huxinjing",
			"heiguangkai",
			"linglongshimandai",
			"hongmianbaihuapao",
			"qimenbagua",
			"guofengyupao",
			"zhaogujing",
			"sanlve",
			"tianjitu",
			"taigongyinfu",
			"shufazijinguan",
			"xuwangzhimian",
			"huntianyi",
			"bachiqionggouyu",
			"bazhijing",
			"changandajian_equip1",
			"changandajian_equip2",
			"changandajian_equip3",
			"changandajian_equip4",
			"changandajian_equip5",
		],
		init(player, skill) {
			const mojinMap = [
				[
					"使用至少三张非基本牌",
					{ player: ["useCard"] },
					(evt, player) => {
						const history = player.getAllHistory(
							"useCard",
							evt => get.type(evt.card, null, false) != "basic" && !player.getStorage("immojin").includes(evt)
						);
						return history.length >= 3;
					},
					player => {
						const history = player.getAllHistory("useCard", evt => get.type(evt.card, null, false) != "basic");
						player.setStorage("immojin", history);
					},
				],
				[
					"本回合因弃置失去至少两张牌",
					{ player: ["loseAfter"], global: ["loseAsyncAfter"] },
					(evt, player) => {
						if (evt.type != "discard") {
							return false;
						}
						const count = player
							.getHistory("lose", evt => evt.type == "discard" && !player.getStorage("immojin").includes(evt))
							.reduce((num, evt) => (num += evt.cards2.length), 0);
						return count >= 2;
					},
					player => {
						const history = player.getAllHistory("lose", evt => evt.type == "discard");
						player.setStorage("immojin", history);
					},
				],
				[
					"使用至少两张装备牌",
					{ player: ["useCard"] },
					(evt, player) => {
						const history = player.getAllHistory(
							"useCard",
							evt => get.type(evt.card, null, false) == "equip" && !player.getStorage("immojin").includes(evt)
						);
						return history.length >= 2;
					},
					player => {
						const history = player.getAllHistory("useCard", evt => get.type(evt.card, null, false) == "equip");
						player.setStorage("immojin", history);
					},
				],
				[
					"使用三张基本牌",
					{ player: ["useCard"] },
					(evt, player) => {
						const history = player.getAllHistory(
							"useCard",
							evt => get.type(evt.card, null, false) == "basic" && !player.getStorage("immojin").includes(evt)
						);
						return history.length >= 3;
					},
					player => {
						const history = player.getAllHistory("useCard", evt => get.type(evt.card, null, false) == "basic");
						player.setStorage("immojin", history);
					},
				],
				[
					"使用两张锦囊牌",
					{ player: ["useCard"] },
					(evt, player) => {
						const history = player.getAllHistory(
							"useCard",
							evt => get.type(evt.card, "trick", false) == "trick" && !player.getStorage("immojin").includes(evt)
						);
						return history.length >= 2;
					},
					player => {
						const history = player.getAllHistory("useCard", evt => get.type(evt.card, "trick", false) == "trick");
						player.setStorage("immojin", history);
					},
				],
				[
					"单次造成至少两点伤害",
					{ source: ["damageSource"] },
					(evt, player) => {
						const history = player.getAllHistory("sourceDamage", evt => evt.num >= 2 && !player.getStorage("immojin").includes(evt));
						return history.length >= 1;
					},
					player => {
						const history = player.getAllHistory("sourceDamage", evt => evt.num >= 2);
						player.setStorage("immojin", history);
					},
				],
				[
					"令一名角色进入濒死",
					{ source: ["dying"] },
					(evt, player) => {
						return true;
					},
				],
				[
					"造成一点属性伤害",
					{ source: ["damageSource"] },
					(evt, player) => {
						return evt.hasNature();
					},
				],
				[
					"获得一名角色至少一张牌",
					{ player: ["gainAfter"] },
					(evt, player) => {
						return evt.source && evt.source != player;
					},
				],
				[
					"使用【酒】【杀】",
					{ player: ["useCard"] },
					(evt, player) => {
						return evt.card.name == "sha" && evt.jiu;
					},
				],
				[
					"连续使用牌指定同一角色为目标",
					{ player: ["useCardToPlayered"] },
					(evt, player) => {
						const last = player.getAllHistory("useCard").at(-2);
						return last?.targets?.includes(evt.target);
					},
				],
				[
					"本回合获得至少四张牌",
					{ player: ["gainAfter"] },
					(evt, player) => {
						const count = player
							.getHistory("gain", evt => !player.getStorage("immojin").includes(evt))
							.reduce((num, evt) => (num += evt.cards.length), 0);
						return count >= 4;
					},
					player => {
						const history = player.getAllHistory("gain");
						player.setStorage("immojin", history);
					},
				],
				[
					"装备区牌数变化后最多",
					{ player: "loseAfter", global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"] },
					(evt, player) => {
						if (
							(() => {
								if (evt.name == "equip" && evt.player == player) {
									return false;
								}
								const evtx = evt.getl(player);
								if (evtx?.es?.length) {
									return false;
								}
								return true;
							})()
						) {
							return false;
						}
						return !evt.immojin && player.isMaxEquip();
					},
				],
				[
					"使用至少一张延时锦囊牌",
					{ player: ["useCard"] },
					(evt, player) => {
						const history = player.getAllHistory(
							"useCard",
							evt => get.type(evt.card, null, false) == "delay" && !player.getStorage("immojin").includes(evt)
						);
						return history.length >= 1;
					},
					player => {
						const history = player.getAllHistory("useCard", evt => get.type(evt.card, null, false) == "delay");
						player.setStorage("immojin", history);
					},
				],
				[
					"一名其他角色失去最后手牌",
					{ global: ["loseAfter", "loseAsyncAfter", "gainAfter", "addToExpansionAfter", "equipAfter", "addJudgeAfter"] },
					(evt, player) => {
						return game.hasPlayer(current => {
							if (current == player || current.countCards("h")) {
								return false;
							}
							return evt.getl?.(current)?.hs?.length;
						});
					},
				],
			];
			const list = get.info(skill).extraCards;
			for (let pack in lib.cardPack) {
				if (!["standard", "extra", "yingbian", "mode_boss_card"].includes(pack)) {
					continue;
				}
				const cards = lib.cardPack[pack].filter(card => {
					if (card.destroy) {
						return false;
					}
					return pack != "mode_boss_card" || card.type == "equip";
				});
				list.addArray(cards);
			}
			game.loadModeAsync("boss", function (mode) {
				for (let i in mode.translate) {
					if (lib.translate[i]) {
						continue;
					}
					lib.translate[i] = mode.translate[i];
				}
				lib.cardPack["mode_boss_card"] ??= Object.keys(mode.card);
				for (let i in mode.card) {
					if (lib.card[i]) {
						continue;
					}
					lib.card[i] = mode.card[i];
				}
				for (let i in mode.skill) {
					if (lib.skill[i]) {
						continue;
					}
					lib.skill[i] = mode.skill[i];
				}
				Object.keys(mode.card).forEach(i => game.finishCard(i));
				Object.keys(mode.skill).forEach(i => game.finishSkill(i));

				const list = [];
				for (let pack in lib.cardPack) {
					if (!["standard", "extra", "yingbian", "mode_boss_card"].includes(pack)) {
						continue;
					}
					const cards = lib.cardPack[pack].filter(card => {
						const info = lib.card[card];
						if (info.destroy) {
							return false;
						}
						return pack != "mode_boss_card" || info.type == "equip";
					});
					list.addArray(cards);
				}
				game.countPlayer(current => {
					if (current.hasSkill("olmojin", null, null, false)) {
						current.markAuto("mojinAward", list);
					}
				});
			});
			player.setStorage("mojinMap", mojinMap);
			player.setStorage("mojinAward", list);
		},
		marktext: "摸金",
		intro: {
			content(storage) {
				return storage;
			},
		},
		filter(event, player, triggername) {
			return event.name != "phase" || game.phaseNumber == 0;
		},
		async cost(event, trigger, player) {
			const list = player.getStorage("mojinMap").randomGets(3);
			const buttons = list.map(info => [info, info[0]]);
			const result = await player
				.chooseButton(["选择一项进行摸金", [buttons, "textbutton"]])
				.set("forced", true)
				.forResult();
			event.result = {
				bool: result.bool,
				confirm: result.confirm,
				cost_data: result.links[0],
			};
		},
		async content(event, trigger, player) {
			const data = event.cost_data;
			if (data[3]) {
				game.broadcastAll((player, data) => data[3](player), player, data);
			}
			player.setStorage("olmojin", data[0]);
			player.markSkill(event.name);
			player
				.when(data[1])
				.filter(data[2])
				.step(async (event, trigger, player) => {
					if (data[3]) {
						game.broadcastAll((player, data) => data[3](player), player, data);
					}
					const type = ["basic", "trick", "equip"].randomGet();
					const info = [
						player
							.getStorage("mojinAward")
							.filter(name => get.type2(name) == type)
							.randomGet(),
						lib.suit.randomGet(),
						get.rand(1, 13),
					];
					if (info[0] == "sha") {
						info[3] = ["ice", "thunder", "fire", undefined].randomGet();
					}
					const card = game.createCard(...info);
					const next = player.gain(card, "draw");
					next.set("immojin", true);
					if (["basic", "trick"].includes(get.type2(card.name, false))) {
						let gaintag = "olmojin_directHit";
						if (get.tag(card, "recover") && Math.random() > 0.5) {
							gaintag = "olmojin_baseDamage";
						}
						next.gaintag.add(gaintag);
					}
					await next;
					event.trigger("mojinSucces");
				});
		},
		group: ["olmojin_equip", "olmojin_effect"],
		subSkill: {
			equip: {
				trigger: {
					player: ["phaseBegin"],
				},
				filter(event, player) {
					return player.hasEquipableSlot(1);
				},
				forced: true,
				async content(event, trigger, player) {
					const card = game.createCard("luoyangchan", "spade", 13);
					await player.equip(card, "gain2");
				},
			},
			effect: {
				trigger: {
					player: "useCard",
					global: "recoverBegin",
				},
				filter(event, player) {
					const useCard = event.getParent("useCard", true, true);
					return (
						useCard?.player == player &&
						player.hasHistory("lose", evt => {
							const evtx = evt.relatedEvent || evt.getParent();
							if (evtx != useCard) {
								return false;
							}
							const list = Object.values(evt.gaintag_map).flat();
							if (event.name == "useCard") {
								return list.includes("olmojin_directHit");
							}
							return list.includes("olmojin_baseDamage");
						})
					);
				},
				forced: true,
				async content(event, trigger, player) {
					if (trigger.name == "useCard") {
						trigger.directHit.addArray(game.players);
					} else {
						trigger.num++;
					}
				},
			},
		},
	},
	oldingbao: {
		audio: 2,
		enable: ["phaseUse"],
		filterTarget: () => false,
		limited: true,
		selectTarget: -1,
		filterCArd: () => false,
		selectCard: -1,
		filter(event, player) {
			return player.storage.olmojin;
		},
		async content(event, trigger, player) {
			player.awakenSkill(event.name);
			const phase = get.event().getParent("phaseUse");
			if (phase?.name == "phaseUse") {
				phase.skipped = true;
			}
			const data = player.getStorage("mojinMap").find(data => player.getStorage("olmojin") == data[0]);
			if (data?.[3]) {
				game.broadcastAll((player, data) => data[3](player), player, data);
			}
			const type = ["basic", "trick", "equip"].randomGet();
			const info = [
				player
					.getStorage("mojinAward")
					.filter(name => get.type2(name) == type)
					.randomGet(),
				lib.suit.randomGet(),
				get.rand(1, 13),
			];
			if (info[0] == "sha") {
				info[3] = ["ice", "thunder", "fire", undefined].randomGet();
			}
			const card = game.createCard(...info);
			const next = player.gain(card, "draw");
			next.set("immojin", true);
			if (["basic", "trick"].includes(get.type2(card.name, false))) {
				let gaintag = "olmojin_directHit";
				if (get.tag(card, "recover") && Math.random() > 0.5) {
					gaintag = "olmojin_baseDamage";
				}
				next.gaintag.add(gaintag);
			}
			await next;
			event.trigger("mojinSucces");
		},
	},
	luoyangchan_skill: {
		enable: ["phaseUse"],
		usable: 1,
		equipSkill: true,
		filterCard(card, player) {
			if (!player.hasSkill("luoyangchan_skill", null, false)) {
				const cards = player.getCards("e", cardx => get.name(cardx) == "luoyangchan");
				if (cards.every(cardx => cardx == card)) {
					return false;
				}
			}
			return get.color(card, player) == "black" && lib.filter.cardDiscardable(card, player, "luoyangchan_skill");
		},
		filter(event, player) {
			return player.countCards("he", card => {
				if (!player.hasSkill("luoyangchan_skill", null, false)) {
					const cards = player.getCards("e", cardx => get.name(cardx) == "luoyangchan");
					if (cards.every(cardx => cardx == card)) {
						return false;
					}
				}
				return get.color(card, player) == "black" && lib.filter.cardDiscardable(card, player, "luoyangchan_skill");
			});
		},
		position: "he",
		discard: false,
		lose: false,
		async content(event, trigger, player) {
			await player.modedDiscard(event.cards);
			const cards = player.getCards("h");
			await player.loseToDiscardpile(cards);
			await player.draw(cards.length);
		},
	},
	//乐刘禅 ————蜀十头
	oltuoquan: {
		audio: 2,
		init(player, skill) {
			player.setStorage(skill, get.info(skill).fuchens.slice(0), true);
		},
		onremove(player, skill) {
			player.setStorage(skill, null);
			player.setStorage(`${skill}_current`, null);
			game.broadcastAll(
				(player, names) => {
					if (Array.isArray(player.tempname)) {
						player.tempname.removeArray(names);
					}
				},
				player,
				player.getStorage(`${skill}_current2`)
			);
			player.setStorage(`${skill}_current2`, null);
		},
		mark: true,
		intro: {
			mark(dialog, storage, player) {
				dialog.addText(`剩余辅臣（蒋琬费祎${player._gainJiangFei ? "已" : "未"}出阵）`);
				dialog.addSmall([storage, "character"]);
				if (player.storage.oltuoquan_current2?.length && player.isIn()) {
					dialog.addText(`当前辅臣${player.getStorage("oltuoquan_current").length ? "" : "（已败阵）"}`);
					dialog.addSmall([player.storage.oltuoquan_current2, "character"]);
				}
			},
		},
		fuchens: ["guanyu", "zhangfei", "zhaoyun", "re_huangzhong", "jiangwei", "ol_weiyan", "ol_zhangyì", "xin_masu"],
		trigger: {
			player: ["enterGame", "phaseZhunbeiBegin"],
			global: "phaseBefore",
		},
		filter(event, player) {
			if (event.name == "phaseZhunbei") {
				return player.getStorage("oltuoquan").length || player.additionalSkills["oltuoquan"]?.length;
			}
			if (
				!game.hasPlayer(current => {
					if (get.mode() == "doudizhu") {
						return current.identity == "fan";
					}
					return current != player;
				})
			) {
				return false;
			}
			return event.name != "phase" || game.phaseNumber == 0;
		},
		locked: true,
		async cost(event, trigger, player) {
			event.result = { bool: true };
			if (trigger.name != "phaseZhunbei") {
				event.result.targets = game
					.filterPlayer(current => {
						if (get.mode() == "doudizhu") {
							return current.identity == "fan";
						}
						return current != player;
					})
					.sortBySeat();
			} else if (player.getStorage(event.skill).length == 1) {
				event.result.cost_data = true;
			}
		},
		logAudio(_1, _2, _3, _4, costResult) {
			if (costResult.cost_data === true) {
				return "shoucheng1.mp3";
			}
			return 2;
		},
		async content(event, trigger, player) {
			if (trigger.name != "phaseZhunbei") {
				const func = async target => {
					if (!target.hasSkill("oldianzan", null, null, false)) {
						await target.addSkills("oldianzan");
					}
					target.markAuto("oldianzan", player);
				};
				await game.doAsyncInOrder(event.targets, func);
				return;
			}
			const nows = player.getStorage(`${event.name}_current2`);
			if (nows.length) {
				player.setStorage(`${event.name}_current2`, null);
				await player.addAdditionalSkills(event.name, []);
				game.broadcastAll(
					(player, names) => {
						player.tempname.removeArray(names);
					},
					player,
					nows
				);
			}
			if (!player.getStorage(event.name).length && !player._gainJiangFei) {
				player._gainJiangFei = true;
				const jiangfei = Math.random() > 0.99 ? ["jiangfei"] : ["ol_jiangwan", "ol_feiyi"];
				player.markAuto(event.name, jiangfei);
			}
			const names = player.getStorage(event.name).randomGets(4);
			if (!names.length) {
				player.unmarkSkill(event.name);
				return;
			}
			const result = await player
				.chooseButton(["托权", [names, "character"]], Math.min(2, names.length), true)
				.set("ai", () => Math.random())
				.forResult();
			if (result?.bool && result.links?.length) {
				const fuchens = result.links;
				const skills = fuchens.reduce((arr, name) => {
					const skills = get.character(name, 3).filter(skill => {
						const info = get.info(skill);
						return info && !info.charlotte && !info.limited && !info.juexingji;
					});
					arr.addArray(skills);
					return arr;
				}, []);
				await player.addAdditionalSkills(event.name, skills);
				game.broadcastAll(
					(player, names) => {
						player.tempname.addArray(names);
					},
					player,
					fuchens
				);
				player.setStorage(`${event.name}_current`, [...fuchens]);
				player.setStorage(`${event.name}_current2`, [...fuchens]);
				const next = game.createEvent("gainFuchen", false);
				next.player = player;
				next.fuchens = fuchens;
				next.setContent("emptyEvent");
				await next;
			}
		},
	},
	oldianzan: {
		clickableFilter(player) {
			const targets = player.getStorage("oldianzan");
			return targets.some(target => target?.isIn());
		},
		init(player, skill) {
			if (get.nameList(player).some(name => get.character(name)?.skills?.includes(skill))) {
				player.markAuto(skill, player);
			}
			if (!_status._click_throwFlower) {
				game.broadcastAll(() => {
					_status._click_throwFlower = function () {
						const target = this,
							player = game.me;
						if (!player?._click_throwFlower?.includes(target)) {
							return;
						}
						player._click_throwFlower = [];
						if (game.online) {
							game.requestSkillData("oldianzan", "throwEmotion", 5000, target);
						} else {
							player.throwEmotion(target, ["flower", "wine", "egg", "shoe"].randomGet());
						}
					};
					game.countPlayer2(current => {
						current.addEventListener("click", _status._click_throwFlower);
					}, true);
				});
			}
		},
		sync: {
			throwEmotion(player, target) {
				player.throwEmotion(target, ["flower", "wine", "egg", "shoe"].randomGet());
				return;
			},
		},
		clickable(player) {
			if (player.isUnderControl(true)) {
				const targets = player.getStorage("oldianzan").filter(current => current?.isIn());
				if (targets.length === 1) {
					player.throwEmotion(targets[0], ["flower", "wine", "egg", "shoe"].randomGet());
				} else {
					player._click_throwFlower = targets;
				}
			}
		},
		onremove: true,
	},
	olxianglv: {
		audio: 2,
		trigger: {
			player: ["enterGame", "gainFuchen"],
			global: "phaseBefore",
		},
		filter(event, player) {
			if (event.name == "gainFuchen") {
				return event.fuchens?.length && player.hasExpansions("olxianglv");
			}
			return event.name != "phase" || game.phaseNumber == 0;
		},
		forced: true,
		async content(event, trigger, player) {
			if (trigger.name == "gainFuchen") {
				const cards = player.getExpansions(event.name).randomGets(trigger.fuchens.length);
				if (cards.length) {
					await player.gain(cards, "gain2");
				}
				return;
			}
			const cards = [];
			while (true) {
				const card = get.cardPile2(card => get.type(card) == "basic" && cards.every(cardx => cardx.name != card.name));
				if (card) {
					cards.add(card);
				} else {
					break;
				}
			}
			const next = player.addToExpansion(cards, "gain2");
			next.gaintag.add(event.name);
			await next;
		},
		intro: {
			content: "expansion",
			markcount: "expansion",
		},
		onremove(player, skill) {
			const cards = player.getExpansions(skill);
			if (cards.length) {
				player.loseToDiscardpile(cards);
			}
		},
		ai: { combo: "oltuoquan" },
	},
	olanle: {
		audio: 2,
		trigger: { player: "damageEnd" },
		filter(event, player) {
			return player.getStorage("oltuoquan_current").length > 0;
		},
		init(player, skill) {
			if (!player.getStorage("oltuoquan_current").length) {
				player.addAdditionalSkill(skill, "xiangle");
			}
			player.addSkill("olanle_viewas");
		},
		onremove(player, skill) {
			player.removeAdditionalSkill(skill);
			player.removeSkill("olanle_viewas");
		},
		forced: true,
		async content(event, trigger, player) {
			const removes = [...player.getStorage("oltuoquan_current")];
			player.unmarkAuto("oltuoquan", removes);
			player.unmarkAuto("oltuoquan_current", removes);
			const next = game.createEvent("removeFuchen", false);
			next.player = player;
			next.fuchens = removes;
			next.setContent("emptyEvent");
			await next;
			const targets = [player];
			if (_status.currentPhase?.isIn()) {
				targets.push(_status.currentPhase);
			}
			await game.asyncDraw(targets);
		},
		derivation: "xiangle",
		subSkill: {
			viewas: {
				trigger: { player: ["gainFuchen", "removeFuchen"] },
				charlotte: true,
				firstDo: true,
				async cost(event, trigger, player) {
					const bool = player.getStorage("oltuoquan_current").length === 0;
					if (bool) {
						player.addAdditionalSkill("olanle", "xiangle");
					} else {
						player.removeAdditionalSkill("olanle");
					}
				},
			},
		},
	},
	//有诸葛亮 ————我才是奶龙！
	dcyingyou: {
		trigger: {
			player: ["phaseBegin", "phaseJieshuBegin", "damageEnd"],
		},
		async cost(event, trigger, player) {
			const list = [
				["skill", "随机获得一个五虎将持有的技能"],
				["card", "将【真·诸葛连弩】置入装备区"],
				["mantou", "获得10吨馒头"],
			];
			const result = await player
				.chooseButton([`###${get.prompt("dcyingyou")}###选择一项并摸一张牌`, [list, "textbutton"]])
				.set("filterButton", ({ link }) => {
					const player = get.player();
					return link != "card" || (player.hasEquipableSlot(1) && !player.getEquip("real_zhuge"));
				})
				.set("ai", ({ link }) => {
					return link == "skill" ? 2 : 1;
				})
				.forResult();
			if (result.bool) {
				event.result = {
					bool: true,
					cost_data: result.links[0],
				};
			}
		},
		marktext: "馒",
		intro: {
			name: "馒头",
			content: "你有$吨馒头",
		},
		getList() {
			let list,
				skills = [];
			if (get.mode() == "guozhan") {
				list = [];
				for (const i in lib.characterPack.mode_guozhan) {
					if (lib.character[i]) {
						list.push(i);
					}
				}
			} else if (_status.connectMode) {
				list = get.charactersOL();
			} else {
				list = [];
				for (const i in lib.character) {
					if (lib.filter.characterDisabled2(i) || lib.filter.characterDisabled(i)) {
						continue;
					}
					list.push(i);
				}
			}
			const wuhu = ["关羽", "张飞", "赵云", "马超", "黄忠"],
				wuhuList = list.filter(character => {
					const names = get.characterSurname(character).map(name => name.join(""));
					return names.containsSome(...wuhu);
				});
			for (const i of wuhuList) {
				const skillsx = (lib.character[i][3] || [])
					.filter(skill => {
						const info = get.info(skill);
						return info && !info.hiddenSkill && !info.charlotte;
					})
					.map(skill => [skill, i]);
				skills.addArray(skillsx);
			}
			return skills;
		},
		async content(event, trigger, player) {
			switch (event.cost_data) {
				case "skill": {
					const skills = get
						.info(event.name)
						.getList()
						.filter(skill => !player.hasSkill(skill[0], null, null, false));
					if (skills?.length) {
						const skill = skills.randomGet();
						player.flashAvatar(event.name, skill[1]);
						await player.addAdditionalSkills(event.name, skill[0], true);
					}
					break;
				}
				case "card": {
					const card = game.createCard("real_zhuge", "club", 1);
					if (player.canEquip(card, true)) {
						await player.equip(card, "gain2");
					}
					break;
				}
				default: {
					player.addMark(event.name, 10, false);
					game.log(player, "获得了10吨", "#y馒头");
					break;
				}
			}
			await player.draw();
		},
		group: "dcyingyou_eat",
		subSkill: {
			eat: {
				trigger: {
					player: "useCard",
				},
				filter(event, player) {
					if (
						!player.hasHistory("lose", evt => {
							if (!evt?.hs?.length) {
								return false;
							}
							const evtx = evt.relatedEvent || evt.getParent();
							return evtx == event;
						})
					) {
						return false;
					}
					if (!get.info("dcshixian").filterx(event)) {
						return false;
					}
					const num = get.number(event.card);
					return typeof num == "number" && num > 0 && num <= player.countMark("dcyingyou");
				},
				prompt2(event, player) {
					const num = get.number(event.card);
					return `吃掉${num}吨馒头，令${get.translation(event.card)}额外结算一次`;
				},
				async content(event, trigger, player) {
					const num = get.number(trigger.card);
					player.removeMark("dcyingyou", num, false);
					game.log(player, `吃掉了${num}吨`, "#y馒头");
					trigger.effectCount++;
				},
			},
		},
	},
	real_zhuge_skill: {
		equipSkill: true,
		audio: "zhuge_skill",
		firstDo: true,
		trigger: { player: "useCard1" },
		forced: true,
		filter(event, player) {
			if (event.card.name === "sha") {
				const num = get.number(event.card);
				if (typeof num == "number" && num < 7) {
					return true;
				}
			}
			return !event.audioed && event.card.name === "sha" && player.countUsed("sha", true) > 1 && event.getParent().type === "phase";
		},
		async content(event, trigger, player) {
			const num = get.number(trigger.card);
			if (typeof num == "number" && num < 7) {
				trigger.directHit.addArray(game.players);
			}
			trigger.audioed = true;
		},
		ai: {
			directHit_ai: true,
			skillTagFilter(player, tag, arg) {
				if (arg?.card?.name == "sha") {
					const num = get.number(arg.card);
					if (typeof num == "number" && num < 7) {
						return true;
					}
				}
			},
		},
		mod: {
			cardUsable(card, player, num) {
				var cards = player.getCards("e", card => get.name(card) == "zhuge");
				if (card.name === "sha") {
					if (
						!cards.length ||
						player.hasSkill("real_zhuge_skill", null, false) ||
						cards.some(card => card !== _status.zhuge_temp && !ui.selected.cards.includes(card))
					) {
						if (get.is.versus() || get.is.changban()) {
							return num + 3;
						}
						return Infinity;
					}
				}
			},
			cardEnabled2(card, player) {
				if (!_status.event.addCount_extra || player.hasSkill("real_zhuge_skill", null, false)) {
					return;
				}
				var cards = player.getCards("e", card => get.name(card) == "real_zhuge");
				if (card && cards.includes(card)) {
					try {
						var cardz = get.card();
					} catch (e) {
						return;
					}
					if (!cardz || cardz.name !== "sha") {
						return;
					}
					_status.zhuge_temp = card;
					var bool = lib.filter.cardUsable(get.autoViewAs(cardz, ui.selected.cards.concat([card])), player);
					delete _status.zhuge_temp;
					if (!bool) {
						return false;
					}
				}
			},
		},
	},
	//谋谋邓艾
	olandu: {
		audio: 2,
		init(player, skill) {
			player.addSkill("olandu_mark");
		},
		onremove(player, skill) {
			player.removeSkill("olandu_mark");
		},
		isYinping(card) {
			const actualCardName = new Map([
					...lib.actualCardName,
					["借刀杀人", "借刀"], //给OL借刀开门
				]),
				name = get.translation(typeof card == "string" ? card : get.name(card, false));
			const trueName = actualCardName.has(name) ? actualCardName.get(name) : name,
				pinyins = get.pinyin(trueName);
			if (!pinyins.length) {
				return false;
			}
			const check = pinyin => {
				const yunmu = get.yunmu(pinyin);
				if (!yunmu?.length) {
					return false;
				}
				return yunmu.split("").containsSome("ā", "ē", "ī", "ō", "ū", "ǖ");
			};
			return check(pinyins[0]) || check(pinyins[pinyins.length - 1]);
		},
		trigger: {
			player: "useCardAfter",
		},
		filter(event, player, name, card) {
			if (!get.info("olandu").isYinping(card)) {
				return false;
			}
			return game.hasPlayer(current => current != player && current.countCards("h", card => get.info("olandu").isYinping(card)));
		},
		locked: true,
		getIndex(event, player) {
			return event.cards ?? [];
		},
		async cost(event, trigger, player) {
			const cards = game
				.filterPlayer(current => current != player)
				.reduce((cards, current) => {
					return [...cards, ...current.getCards("h", card => get.info(event.skill).isYinping(card))];
				}, []);
			if (cards?.length) {
				const card = cards.randomGet();
				event.result = {
					bool: true,
					targets: [get.owner(card)],
					cost_data: card,
				};
			}
		},
		async content(event, trigger, player) {
			const { cost_data: card } = event;
			await player.gain(card, "giveAuto");
		},
		subSkill: {
			mark: {
				init(player, skill) {
					get.info(skill).initTag(player, skill, player.getCards("h"));
				},
				initTag(player, skill, cards) {
					cards = cards.filter(card => {
						return get.info("olandu").isYinping(card) && !card.hasGaintag(skill);
					});
					if (cards?.length) {
						player.addGaintag(cards, skill);
					}
				},
				onremove(player, skill) {
					player.removeGaintag(skill);
				},
				trigger: {
					player: "gainAfter",
					global: ["loseAfter", "loseAsyncAfter", "gameDrawAfter"],
				},
				filter(event, player) {
					if (event.name == "gameDraw") {
						return true;
					}
					return event.getg?.(player)?.length;
				},
				charlotte: true,
				async cost(event, trigger, player) {
					const cards = trigger.name == "gameDraw" ? player.getCards("h") : trigger.getg(player);
					get.info(event.skill).initTag(player, event.skill, cards);
				},
			},
		},
	},
	olqiqi: {
		audio: 2,
		trigger: {
			player: "useCardToPlayer",
		},
		round: 1,
		filter(event, player) {
			return event.isFirstTarget && get.cardNameLength(event.card) >= player.hp;
		},
		async content(event, trigger, player) {
			await player.draw(2);
			trigger.getParent().effectCount++;
			const result = await player
				.judge(card => {
					return get.suit(card) == "heart" ? -2 : 2;
				})
				.forResult();
			if (result.suit == "heart") {
				await player.loseMaxHp();
			}
		},
	},
	//狂李儒
	olhuaquan: {
		audio: 2,
		trigger: { player: "useCardToPlayered" },
		filter(event, player) {
			return event.targets.some(target => target != player) && event.isFirstTarget; //&& get.color(event.card) == "black"
		},
		forced: true,
		async content(event, trigger, player) {
			const list = [
				["", "", "olhuaquan_heavy"],
				["", "", "olhuaquan_light"],
			];
			const result = await player
				.chooseButton([`###花拳###${get.skillInfoTranslation(event.name, null, false)}`, [list, "vcard"]], true)
				.set("ai", button => {
					const card = get.event().card;
					const bool = button.link == "olhuaquan_heavy";
					if (get.tag(card, "damage") && get.type(card) != "delay") {
						return bool ? 1 + Math.random() : 0.5 + Math.random();
					}
					return bool ? 0.5 + Math.random() : 1 + Math.random();
				})
				.set("card", trigger.card)
				.forResult();
			if (!result?.links?.length) {
				return;
			}
			const choice = result.links[0][2];
			if (choice == "olhuaquan_heavy") {
				trigger.getParent().baseDamage++;
			} else {
				player
					.when("useCardAfter")
					.filter(evt => evt == trigger.getParent())
					.step(async () => {
						await player.draw();
					});
			}
			const targets = trigger.targets.filter(target => target != player);
			player.line(targets);
			const chooseButton = async target => {
				event.target = target;
				const result = await target
					.chooseButton([`###花拳###猜测${get.translation(player)}选择的效果`, [list, "vcard"]], true)
					.set("ai", button => {
						const card = get.event().card;
						const bool = button.link == "olhuaquan_heavy";
						if (get.tag(card, "damage") && get.type(card) != "delay") {
							return bool ? 1 + Math.random() : 0.5 + Math.random();
						}
						return bool ? 0.5 + Math.random() : 1 + Math.random();
					})
					.set("card", trigger.card)
					.forResult();
				if (result?.links?.[0]?.[2] != choice) {
					await event.trigger("olhuaquan_wrong");
				}
			};
			await game.doAsyncInOrder(targets, chooseButton);
		},
	},
	olsanou: {
		audio: 2,
		marktext: "👊",
		intro: {
			name: "击倒",
			name2: "击倒",
			content: "mark",
			markcount: "mark",
		},
		trigger: {
			global: ["damageEnd", "olhuaquan_wrong"],
		},
		forced: true,
		filter(event, player) {
			if (event.name == "damage") {
				return event.source == player && event.player != player && event.player.isIn();
			}
			return event.target.isIn();
		},
		logTarget(event, player) {
			if (event.name == "damage") {
				return event.player;
			}
			return event.target;
		},
		async content(event, trigger, player) {
			const [target] = event.targets;
			await player.draw();
			target.addMark(event.name);
			if (target.countMark(event.name) >= 3 && !target.hasSkill(event.name + "_debuff")) {
				target.clearMark(event.name);
				target.addSkill(event.name + "_debuff");
				game.log(target, "被击倒，简直毫无还手之力");
			}
		},
		subSkill: {
			debuff: {
				charlotte: true,
				forced: true,
				popup: false,
				trigger: {
					player: "phaseUseBefore",
					get global() {
						const list = ["lose", "cardsDiscard", "cardsGotoOrdering", "gain", "addJudge", "equip", "addToExpansion"];
						const listx = list.map(i => [`${i}End`, `${i}Begin`]).flat();
						return listx.concat(list.slice(0, 2).map(i => `${i}After`));
					},
				},
				firstDo: true,
				filter(event, player, name) {
					if (event.name == "phaseUse") {
						return true;
					}
					if (name.endsWith("End")) {
						return event.olsanou_debuff?.length;
					}
					if (name.endsWith("Begin")) {
						return event.cards.some(card => lib.skill.olsanou_debuff.filterCardx(card, event));
					}
					return event.name == "lose" ? event.position == ui.discardPile : true;
				},
				filterCardx(card, event) {
					if (event.name == "gain") {
						if ((event.getParent().name == "draw" || !get.owner(card)) && card.original == "c") {
							return true;
						}
					}
					return get.position(card) == "c";
				},
				async content(event, trigger, player) {
					if (trigger.name == "phaseUse") {
						trigger.cancel();
					} else {
						const name = event.triggername;
						let num = 0;
						if (name.endsWith("End")) {
							num += trigger[event.name]?.filter(card => trigger.cards.includes(card)).length;
							//console.log("End:"+num);
						} else if (name.endsWith("Begin")) {
							trigger.set(
								event.name,
								trigger.cards.filter(card => lib.skill[event.name].filterCardx(card, trigger))
							);
							return;
						} else {
							num += trigger.cards.length;
							//console.log("After:"+num);
						}
						player.removeMark(event.name, num, false);
						if (!player.hasMark(event.name)) {
							player.removeSkill(event.name);
						}
					}
				},
				init(player, skill) {
					player.addMark(skill, 10, false);
				},
				onremove(player, skill) {
					delete player.storage[skill];
					game.log("读秒结束，", player, "站立了过来");
				},
				marktext: "💫",
				intro: {
					name: "击倒状态",
					content: "距离脱离击倒状态还差#“秒”",
				},
			},
		},
	},
	//忍邓艾&姜维
	renhuoluan: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return game.hasPlayer(current => player.canCompare(current));
		},
		intro: {
			mark(dialog, storage, player) {
				if (!storage || get.itemtype(storage) != "cards") {
					return "未记录";
				}
				dialog.addText("当前〖惑乱〗记录牌");
				dialog.addSmall(storage);
			},
		},
		onremove: true,
		chooseButton: {
			dialog(event, player) {
				return ui.create.dialog("惑乱", "是否修改你拼点牌的点数？", "hidden");
			},
			chooseControl(event, player) {
				const list = Array.from(Array(13)).map((p, i) => i + 1);
				return [...list, "不修改", "cancel2"];
			},
			check() {
				return 12;
			},
			backup(result, player) {
				return {
					audio: "renhuoluan",
					number: result.control,
					filterTarget(card, player, target) {
						return player.canCompare(target);
					},
					selectTarget: [1, 2],
					multitarget: true,
					multiline: true,
					async content(event, trigger, player) {
						const num = get.info(event.name)?.number;
						if (typeof num == "number") {
							player
								.when("compare", false)
								.filter((evt, player) => {
									if (!evt.getParent(event.name, true)) {
										return false;
									}
									return [event.player, event.target].includes(player);
								})
								.assign({
									firstDo: true,
								})
								.step(async (event, trigger, player) => {
									for (const [role, ind] of [
										["player", 1],
										["target", 2],
									]) {
										const current = trigger[role];
										if (current == player) {
											player.logSkill("renhuoluan");
											game.log(current, "拼点牌点数视为", `#y${get.strNumber(num, true)}`);
											trigger[`num${ind}`] = num;
										}
									}
								})
								.finish();
						}
						const next = player
							.chooseToCompare(event.targets, card => {
								return get.number(card);
							})
							.setContent("chooseToCompareMeanwhile");

						const { player: card, num2 } = await next.forResult();
						const { targets, num1 } = next;
						player.markAuto("renhuoluan", card);
						let max = 0,
							min = 14,
							maxPlayer,
							minPlayer,
							players = [player, ...targets],
							nums = [num1, ...num2];
						for (let i = 0; i < nums.length; i++) {
							const num = nums[i];
							if (num >= max) {
								if (num == max) {
									maxPlayer = null;
								} else {
									max = num;
									maxPlayer = players[i];
								}
							}
							if (num <= min) {
								if (num == min) {
									minPlayer = null;
								} else {
									min = num;
									minPlayer = players[i];
								}
							}
						}
						if (minPlayer) {
							for (let target of players) {
								if (target == minPlayer || !minPlayer.isIn() || !target.isIn()) {
									continue;
								}
								const sha = new lib.element.VCard({ name: "sha", isCard: true });
								if (target.canUse(sha, minPlayer, false)) {
									await target.useCard(sha, minPlayer, false);
								}
							}
						}
						if (maxPlayer) {
							if (maxPlayer.isIn() && maxPlayer.hp > 0) {
								await maxPlayer.draw(maxPlayer.hp);
							}
						}
						if (minPlayer != player && maxPlayer != player) {
							if (player.getStat("skill")["renhuoluan"]) {
								delete player.getStat("skill")["renhuoluan"];
								game.log(player, "重置了", "#g【惑乱】");
							}
						}
					},
					ai1(card) {
						return 1;
					},
					ai2(target) {
						return -get.attitude(get.player(), target);
					},
				};
			},
			prompt(result, player) {
				const num = result.control;
				let str = `###${get.prompt("renhuoluan")}###与至多两名其他角色共同拼点`;
				if (typeof num == "number") {
					str += `且你的拼点牌点数视为${get.strNumber(num, true)}`;
				}
				return str;
			},
		},
		ai: {
			order: 7,
			result: {
				player: 1,
			},
		},
		subSkill: {
			backup: {},
		},
	},
	renguxing: {
		audio: 2,
		trigger: {
			player: "phaseBegin",
		},
		filter(event, player) {
			const num = game.roundNumber,
				cards = player.getStorage("renhuoluan");
			if (typeof num != "number" || num <= 0) {
				return false;
			}
			return cards && get.itemtype(cards) == "cards";
		},
		prompt2(event, player) {
			const num = Math.min(3, game.roundNumber),
				cards = player.getStorage("renhuoluan");
			let str = "从牌堆或弃牌堆中获得：";
			if (num >= 1) {
				str += get.translation(cards);
			}
			if (num >= 2) {
				const list = cards.map(card => `${get.translation(get.suit(card))}${get.translation(get.number(card))}`).toUniqued();
				str += `；点数花色组合为${list.join("、")}的所有牌`;
			}
			if (num >= 3) {
				const list = cards.map(card => get.translation(get.name(card))).toUniqued();
				str += `；牌名为${list.join("、")}的所有牌`;
			}
			return `${str}（同名牌至多获得五张）`;
		},
		check(event, player) {
			return game.roundNumber >= 3 || player.hp <= 1;
		},
		limited: true,
		skillAnimation: true,
		animationColor: "fire",
		async content(event, trigger, player) {
			player.awakenSkill(event.name);
			const num = Math.min(3, game.roundNumber),
				cardsx = player.getStorage("renhuoluan"),
				filter = [
					(cardx, card, cards) => {
						if (cards.includes(cardx) || cards.filter(cardxx => get.name(cardxx) == get.name(cardx)).length >= 5) {
							return false;
						}
						return cardx == card;
					},
					(cardx, card, cards) => {
						if (cards.includes(cardx) || cards.filter(cardxx => get.name(cardxx) == get.name(cardx)).length >= 5) {
							return false;
						}
						return get.number(cardx) == get.number(card) && get.suit(cardx) == get.suit(card);
					},
					(cardx, card, cards) => {
						if (cards.includes(cardx) || cards.filter(cardxx => get.name(cardxx) == get.name(cardx)).length >= 5) {
							return false;
						}
						return get.name(cardx) == get.name(card);
					},
				];
			let count = 0;
			const cards = [];
			while (count < num) {
				for (let card of cardsx) {
					while (true) {
						const cardx = get.cardPile(cardx => filter[count](cardx, card, cards), null, "bottom");
						if (cardx) {
							cards.push(cardx);
						} else {
							break;
						}
					}
				}
				count++;
			}
			if (cards.length) {
				await player.gain(cards, "gain2");
			}
		},
		ai: {
			combo: "renhuoluan",
		},
	},
	renneyan: {
		audio: 2,
		trigger: {
			player: "useCard1",
		},
		filter(event, player) {
			return get.type(event.card) != "equip";
		},
		forced: true,
		zhuanhuanji: true,
		marktext: "☯",
		mark: true,
		intro: {
			content(storage, player) {
				return `你使用非装备牌时，${storage ? "此牌无次数限制" : "须弃置一张同类型牌并令此牌额外结算一次，否则此牌无效"}。`;
			},
		},
		async content(event, trigger, player) {
			const bool = player.getStorage(event.name, false);
			player.changeZhuanhuanji(event.name);
			if (bool) {
				if (trigger.addCount !== false) {
					trigger.addCount = false;
					const stat = player.getStat().card,
						name = trigger.card.name;
					if (typeof stat[name] == "number") {
						stat[name]--;
					}
				}
			} else {
				const prompt = `弃置一张${get.translation(get.type2(trigger.card, player))}牌令${get.translation(trigger.card)}额外结算一次，否则无效`;
				const result = await player
					.chooseToDiscard(prompt, "he", (card, player) => {
						return get.type2(card, player) == get.event().cardType;
					})
					.set("cardType", get.type2(trigger.card, player))
					.set("ai", card => {
						return 9 - get.value(card);
					})
					.forResult();
				if (result?.bool) {
					if (get.info("dcshixian")?.filterx(trigger)) {
						trigger.effectCount++;
						game.log(trigger.card, "额外结算一次");
					}
				} else {
					trigger.targets.length = 0;
					trigger.all_excluded = true;
					game.log(trigger.card, "被无效了");
				}
			}
		},
		mod: {
			aiOrder(player, card, order) {
				if (get.type(card) == "equip") {
					return order;
				}
				const bool = player.getStorage("renneyan", false);
				if (bool && card.name == "sha") {
					order += 7;
				}
				if (!bool) {
					if (
						player.countCards("he", cardx => {
							const type = get.type(card, player);
							return type == get.type(cardx, player) && cardx != card;
						})
					) {
						if (get.tag(card, "gain") || get.tag(card, "draw")) {
							order += 9;
						}
					} else {
						order = 0;
					}
				}
				return order;
			},
			cardUsable(card, player, num) {
				const bool = player.getStorage("renneyan", false),
					type = get.type2(card, player);
				if (bool && type != "equip") {
					return Infinity;
				}
			},
		},
	},
	renqianyao: {
		audio: 2,
		trigger: {
			player: "phaseBegin",
		},
		filter(event, player) {
			const num = game.roundNumber;
			if (typeof num != "number" || num <= 0) {
				return false;
			}
			return true;
		},
		check(event, player) {
			return game.roundNumber >= 3 || player.hp <= 2;
		},
		limited: true,
		skillAnimation: true,
		animationColor: "thunder",
		async content(event, trigger, player) {
			player.awakenSkill(event.name);
			const num = game.roundNumber,
				card = new lib.element.VCard({ name: "sha", isCard: true });
			await player.draw(num);
			if (!player.hasUseTarget(card)) {
				return;
			}
			const next = player.chooseUseTarget(card, true);
			if (num >= 1) {
				player
					.when({
						player: "useCard2",
					})
					.filter((evt, player) => {
						if (evt.card.name != "sha" || evt.getParent(event.name) != event) {
							return false;
						}
						return (
							evt.targets &&
							game.hasPlayer(current => {
								return (
									!evt.targets.includes(current) &&
									lib.filter.targetEnabled2(evt.card, player, current) &&
									lib.filter.targetInRange(evt.card, player, current)
								);
							})
						);
					})
					.step(async (event, trigger, player) => {
						const result = await player
							.chooseTarget(
								"潜曜：为此【杀】额外指定一个目标",
								(cardx, player, target) => {
									const { targets, card } = get.event();
									if (targets.includes(target)) {
										return false;
									}
									return lib.filter.targetEnabled2(card, player, target) && lib.filter.targetInRange(card, player, target);
								},
								true
							)
							.set("autodelay", true)
							.set("ai", target => {
								const event = get.event(),
									player = get.player(),
									trigger = event.getTrigger();
								return get.effect(target, trigger.card, player, player);
							})
							.set("targets", trigger.targets)
							.set("card", trigger.card)
							.forResult();
						if (result.bool && result.targets?.length) {
							player.line(result.targets, "green");
							game.log(result.targets, "成为了", trigger.card, "的目标");
							trigger.targets.addArray(result.targets);
						}
					});
			}
			if (num >= 2) {
				player
					.when({
						player: "useCard1",
					})
					.filter((evt, player) => {
						if (evt.card.name != "sha" || evt.getParent(event.name) != event) {
							return false;
						}
						return true;
					})
					.step(async (event, trigger, player) => {
						if (typeof trigger.baseDamage != "number") {
							trigger.baseDamage = 1;
						}
						trigger.baseDamage++;
						game.log(trigger.card, "伤害+1");
					});
			}
			if (num >= 3) {
				next.set("oncard", () => {
					const evt = get.event();
					evt.directHit.addArray(game.players);
					game.log(evt.card, "不可被响应");
				});
			}
			await next;
		},
	},
	//健美圈冲儿
	strongduanti: {
		audio: 2,
		trigger: {
			player: ["chengxiangShowBegin", "drawAfter"],
		},
		filter(event, player) {
			if (event.name == "draw") {
				return true;
			}
			return player.isMaxHp() || player.isMinHp();
		},
		forced: true,
		async content(event, trigger, player) {
			if (trigger.name == "draw") {
				await player.damage("nosource");
			} else {
				if (!trigger.showCards) {
					trigger.showCards = [];
				}
				if (player.isMaxHp()) {
					let card = get.cardPile2(card => {
						return get.subtype(card) == "equip1" || get.is.damageCard(card);
					});
					if (card) {
						trigger.showCards.add(card);
						await game.cardsGotoOrdering(card).set("relatedEvent", trigger);
					}
				}
				if (player.isMinHp()) {
					let card = get.cardPile2(card => {
						return card.name == "tao" || card.name == "jiu";
					});
					if (card) {
						trigger.showCards.add(card);
						await game.cardsGotoOrdering(card).set("relatedEvent", trigger);
					}
				}
			}
		},
		derivation: "olchengxiang",
		ai: {
			halfneg: true,
		},
	},
	stronglianwu: {
		audio: 2,
		trigger: {
			player: "useCardToPlayered",
			target: "useCardToTargeted",
		},
		filter(event, player) {
			if (event.card?.name != "sha" || event.targets.length != 1) {
				return false;
			}
			if (!event.target.countCards("he")) {
				return false;
			}
			return event.player.getEquips(1).length || event.getParent().jiu;
		},
		async cost(event, trigger, player) {
			let num = 0;
			if (trigger.player.getEquips(1).length) {
				num++;
			}
			if (trigger.getParent().jiu) {
				num++;
			}
			event.result = await trigger.player
				.choosePlayerCard(get.prompt2(event.skill, trigger.target, trigger.player), [1, num], "he", trigger.target)
				.set("ai", button => {
					let val = get.buttonValue(button);
					if (get.attitude(_status.event.player, get.owner(button.link)) > 0) {
						return -val;
					}
					return val;
				})
				.forResult();
			event.result.targets = [trigger[player == trigger.player ? "target" : "player"]];
		},
		async content(event, trigger, player) {
			await trigger.target.modedDiscard(event.cards, trigger.player);
		},
	},
	//张角三兄弟
	oltiangong: {
		audio: 2,
		forced: true,
		trigger: {
			player: ["phaseBegin", "phaseEnd"],
			global: ["judgeAfter"],
		},
		filter(event, player) {
			if (event.name == "judge") {
				return event.result.suit == "spade";
			}
			return true;
		},
		async content(event, trigger, player) {
			if (trigger.name == "phase") {
				const name = event.triggername == "phaseBegin" ? "leigong" : "younan",
					card = get.autoViewAs({ name: name, isCard: true });
				if (player.hasUseTarget(card, false, false)) {
					await player.chooseUseTarget(card, true, false);
				}
			} else {
				const result = await player
					.chooseTarget(`天公：对一名不为${get.translation(trigger.player)}的角色造成1点雷电伤害`, true, (card, player, target) => {
						return get.event().sourcex != target;
					})
					.set("sourcex", trigger.player)
					.set("ai", target => get.damageEffect(target, get.player(), get.player(), "thunder"))
					.forResult();
				if (result?.targets) {
					const target = result.targets[0];
					player.line(target, "thunder");
					await target.damage("nocard", "thunder");
				}
			}
		},
	},
	oldigong: {
		init(player) {
			player.storage.oldigongCount = 0;
		},
		audio: 2,
		trigger: { player: "useCard" },
		forced: true,
		filter(event, player) {
			return game.hasPlayer2(target => {
				return target.hasHistory("lose", evt => {
					const evtx = evt.relatedEvent || evt.getParent();
					if (evtx != event) {
						return false;
					}
					return !Object.values(evt.gaintag_map).flat().includes("oldigong_tag");
				});
			});
		},
		async content(event, trigger, player) {
			if (player.storage.oldigongCount < 4) {
				player.storage.oldigongCount++;
				if (player.storage.oldigongCount == 4) {
					player.changeSkin({ characterName: "taipingsangong" }, "taipingsangong_ultimate");
				}
			}
			if (get.is.damageCard(trigger.card)) {
				trigger.baseDamage++;
			} else {
				player
					.when("useCardAfter")
					.filter(evt => evt == trigger)
					.step(async (event, trigger, player) => {
						const target = _status.currentPhase;
						if (!target?.isIn()) {
							return;
						}
						const result = await target
							.judge("oldigong", function (card) {
								if (get.color(card) == "red") {
									return 1;
								}
								return 0;
							})
							.forResult();
						if (result.color == "red") {
							await player.draw();
						}
					});
			}
		},
		group: ["oldigong_tag"],
		subSkill: {
			tag: {
				charlotte: true,
				silent: true,
				firstDo: true,
				trigger: { player: "gainBegin" },
				filter(event, player) {
					return event.cards?.length;
				},
				content() {
					if (!trigger.gaintag) {
						trigger.gaintag = [];
					}
					trigger.gaintag.add("oldigong_tag");
					player.addTempSkill("oldigong_remove", "roundEnd");
				},
			},
			remove: {
				charlotte: true,
				onremove(player) {
					player.removeGaintag("oldigong_tag");
				},
			},
		},
	},
	olrengong: {
		audio: 2,
		trigger: { player: "useCardAfter" },
		forced: true,
		filter(event, player) {
			const last = player.getLastUsed(1);
			if (!last) {
				return false;
			}
			return get.type2(event.card) != get.type2(last.card) && player.countDiscardableCards(player, "he");
		},
		async content(event, trigger, player) {
			const last = player.getLastUsed(1),
				type = ["basic", "trick", "equip"].removeArray([get.type2(trigger.card), get.type2(last.card)])[0];
			if (!player.countDiscardableCards(player, "he")) {
				return false;
			}
			await player.chooseToDiscard(`人公：请弃置一张牌，然后从牌堆获得一张${get.translation(type)}牌`, "he", true);
			const card = get.cardPile2(card => get.type2(card) == type);
			if (card) {
				await player.gain(card, "gain2");
			} else {
				player.chat(`黄天在上，赐我${get.translation(type)}`);
			}
		},
		init(player) {
			player.addSkill("olrengong_mark");
		},
		onremove(player) {
			player.removeSkill("olrengong_mark");
		},
		subSkill: {
			mark: {
				charlotte: true,
				silent: true,
				init(player, skill) {
					const history = player.getLastUsed();
					if (!history) {
						return;
					}
					const card = history.card;
					player.storage[skill] = get.type2(card);
					player.markSkill(skill);
					game.broadcastAll(
						function (player, type) {
							if (player.marks.olrengong_mark) {
								player.marks.olrengong_mark.firstChild.innerHTML = get.translation(type).slice(0, 1);
							}
						},
						player,
						get.type2(card)
					);
				},
				intro: {
					content: "上次使用：$",
				},
				onremove: true,
				trigger: {
					global: "useCard1",
				},
				content() {
					lib.skill[event.name].init(player, event.name);
				},
			},
		},
	},
	//烈袁绍袁术
	dclieti: {
		trigger: {
			//因为需要兼容联机，所以加上replaceHandcards的时机，该事件是联机时的手气卡事件
			global: ["gameDrawBegin", "replaceHandcardsBegin"],
		},
		forced: true,
		popup: false,
		async content(event, trigger, player) {
			const me = player;
			if (trigger.name == "gameDraw") {
				player.logSkill(event.name);
				const numx = trigger.num;
				trigger.num =
					typeof numx == "function"
						? function (player) {
								if (player == me) {
									return 2 * numx(player);
								}
								return numx(player);
							}
						: function (player) {
								if (player == me) {
									return 2 * numx;
								}
								return numx;
							};
				player.changeSkin({ characterName: "yuanshaoyuanshu" }, "yuanshaoyuanshu_shao");
			}
			if (!trigger.gaintag) {
				trigger.gaintag = {};
			}
			trigger.gaintag[me.playerid] = (num, cards) => {
				const numy = Math.ceil(num / 2);
				return [
					[cards.slice(0, numy), "yuanshaoyuanshu_shu"],
					[cards.slice(numy, num), "yuanshaoyuanshu_shao"],
				];
			};
		},
		mod: {
			cardEnabled2(card, player) {
				if (get.itemtype(card) != "card" || !player.getCards("h").includes(card)) {
					return;
				}
				if (player.hasSkill("dcshigong", null, false, false) && player.storage.dcshigong_first !== false) {
					return;
				}
				if (!card.hasGaintag(lib.skill.dclieti.getName(player))) {
					return false;
				}
			},
			ignoredHandcard(card, player) {
				if (!card.hasGaintag(lib.skill.dclieti.getName(player))) {
					return true;
				}
			},
			cardDiscardable(card, player, name) {
				if (name == "phaseDiscard" && !card.hasGaintag(lib.skill.dclieti.getName(player))) {
					return false;
				}
			},
		},
		getName(player) {
			const name = player.tempname.find(i => i.indexOf("yuanshaoyuanshu") == 0);
			if (name) {
				return name;
			}
			return player.name1;
		},
		group: "dclieti_mark",
		subSkill: {
			mark: {
				trigger: {
					player: "gainBegin",
				},
				filter(event, player) {
					return event.cards?.length;
				},
				forced: true,
				popup: false,
				content() {
					if (!trigger.gaintag) {
						trigger.gaintag = [];
					}
					const name = lib.skill.dclieti.getName(player);
					trigger.gaintag.add(name);
				},
			},
		},
	},
	dcshigong: {
		locked: true,
		direct: true,
		trigger: { player: "useCard" },
		filter(event, player) {
			return (
				player
					.getHistory("useCard", evt => {
						return player.hasHistory("lose", evtx => {
							if ((evtx.relatedEvent || evtx.getParent()) != evt) {
								return false;
							}
							return evtx.getl?.(player)?.hs?.length;
						});
					})
					.indexOf(event) == 0
			);
		},
		async content(event, trigger, player) {
			//为false则表示不是第一次使用手牌，因为考虑到技能可能被失效导致第一张手牌受到限制所以用的false来赋值
			player.storage.dcshigong_first = false;
			player.when({ global: "phaseAfter" }).step(async () => {
				delete player.storage.dcshigong_first;
			});
			if (lib.skill.dclieti.getName(player).indexOf("yuanshaoyuanshu") != 0) {
				return false;
			}
			const gaintag = [];
			player.checkHistory("lose", evt => {
				if ((evt.relatedEvent || evt.getParent()) != trigger) {
					return false;
				}
				gaintag.addArray(
					Object.values(evt.gaintag_map)
						.flat()
						.filter(tag => tag.indexOf("yuanshaoyuanshu") == 0)
				);
			});
			if (gaintag.length == 1 && gaintag[0] != lib.skill.dclieti.getName(player)) {
				const name = gaintag[0];
				player.logSkill(event.name);
				player.changeSkin({ characterName: "yuanshaoyuanshu" }, name);
				if (name == "yuanshaoyuanshu_shao") {
					await player.chooseUseTarget({ name: "wanjian", isCard: true }, true);
				}
				if (name == "yuanshaoyuanshu_shu") {
					await player.draw(2);
				}
			}
		},
		ai: {
			combo: "dclieti",
		},
	},
	dcluankui: {
		trigger: {
			source: ["damageSource"],
			player: ["gainAfter"],
			global: ["loseAsyncAfter"],
		},
		filter(event, player) {
			if (event.name == "damage") {
				return (
					player.getHistory("sourceDamage", evt => evt.num).indexOf(event) == 1 &&
					player.countDiscardableCards(player, "h", card => card.hasGaintag("yuanshaoyuanshu_shao"))
				);
			} else {
				return (
					event.getg?.(player)?.length &&
					player.getHistory("gain", evt => evt.cards.length).indexOf(event) == 1 &&
					player.countDiscardableCards(player, "h", card => card.hasGaintag("yuanshaoyuanshu_shu"))
				);
			}
		},
		async cost(event, trigger, player) {
			const name = trigger.name,
				tag = name == "damage" ? "yuanshaoyuanshu_shao" : "yuanshaoyuanshu_shu";
			let str = `###${get.prompt(event.skill)}###`;
			if (name == "damage") {
				str += "弃置一张「袁绍」牌令自己本回合下次造成的伤害翻倍";
			} else {
				str += "弃置一张「袁术」牌令自己本回合下次摸牌翻倍";
			}
			event.result = await player
				.chooseToDiscard(str, "h", "chooseonly", card => card.hasGaintag(get.event().tag))
				.set("tag", tag)
				.set("ai", card => 6 - get.value(card))
				.forResult();
		},
		async content(event, trigger, player) {
			const cards = event.cards,
				name = trigger.name;
			await player.discard(cards);
			if (name == "damage") {
				player.addTempSkill(event.name + "_damage");
			} else {
				player.addTempSkill(event.name + "_draw");
			}
		},
		subSkill: {
			damage: {
				audio: "dcluankui",
				mark: true,
				intro: {
					content: "下次造成伤害翻倍",
				},
				charlotte: true,
				forced: true,
				trigger: { source: "damageBegin1" },
				content() {
					trigger.num *= 2;
					player.removeSkill(event.name);
				},
			},
			draw: {
				audio: "dcluankui",
				mark: true,
				intro: {
					content: "下次摸牌翻倍",
				},
				charlotte: true,
				forced: true,
				trigger: { player: "drawBegin" },
				content() {
					trigger.num *= 2;
					player.removeSkill(event.name);
				},
			},
		},
		ai: {
			combo: "dclieti",
		},
	},
	//田忌
	dcweiji: {
		audio: 2,
		trigger: { player: "useCardToPlayered" },
		filter(event, player) {
			return event.isFirstTarget && event.targets.some(i => i !== player);
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt2(event.skill), (card, player, target) => {
					return target !== player && get.event().getTrigger().targets.includes(target);
				})
				.set("ai", target => {
					const player = get.player();
					return 2 + Math.sign(get.attitude(player, target)) + Math.random();
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const target = event.targets[0],
				numbers = Array.from({ length: 3 }).map((_, i) => (i + 1).toString());
			const { control: num1 } = await player
				.chooseControl(numbers)
				.set("ai", () => {
					const { player, target } = get.event().getParent();
					if (get.attitude(player, target) > 0 || get.attitude(target, player) > 0) {
						return 2;
					}
					return get.rand(0, 2);
				})
				.set("prompt", "请选择你给" + get.translation(target) + "设下的难题")
				.forResult();
			game.log(player, "选择了一个数字");
			player.chat("我选的" + [1, 2, 3, 114514, 1919810].randomGet() + "，你信吗");
			await game.delayx();
			const { control: num2 } = await target
				.chooseControl(numbers)
				.set("ai", () => {
					const { player, target } = get.event().getParent();
					if (get.attitude(player, target) > 0 || get.attitude(target, player) > 0) {
						return 0;
					}
					return get.rand(0, 2);
				})
				.set("prompt", "请猜测" + get.translation(player) + "选择的数字")
				.forResult();
			target.chat("我猜是" + num2 + "！");
			await game.delayx();
			player.chat(num1 === num2 ? "悲" : "喜");
			await game.delayx();
			if (num1 !== num2) {
				player.popup("洗具");
				player.chat("孩子们，这很好笑");
				await player.draw(parseInt(num1));
			} else {
				player.popup("杯具");
				player.chat("孩子们，这不好笑");
			}
		},
	},
	dcsaima: {
		audio: 2,
		trigger: { player: "useCardAfter" },
		filter(event, player) {
			const card = event.card;
			if (get.type(card) !== "equip" || ![3, 4, 6].map(str => "equip" + str).some(item => get.subtypes(card).includes(item))) {
				return false;
			}
			return game.hasPlayer(target => player.canCompare(target));
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt2(event.skill), (card, player, target) => {
					return player.canCompare(target);
				})
				.set("ai", target => {
					const player = get.player();
					return (
						get.damageEffect(target, player, player) +
						Math.max(3, target.countCards("h")) * get.effect(target, { name: "guohe_copy", position: "h" }, player, player)
					);
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			let num = 0,
				win = 0;
			while (num < 3) {
				num++;
				const { bool } = await player.chooseToCompare(target).forResult();
				if (bool) {
					win++;
					game.log("双方拼点剩余", "#y" + (3 - num), "场，", player, "已赢", "#g" + win, "场");
				}
			}
			if (win >= 2) {
				if (win === 2) {
					player.chat("今以吾之下驷与君上驷，取吾驷与君中驷，取吾中驷与君下驷。则吾一不胜而再胜");
				}
				player.line(target);
				await target.damage();
			}
		},
	},
	//夏侯恩
	olyinfeng: {
		audio: 2,
		trigger: { global: ["gainAfter", "loseAsyncAfter"] },
		getIndex(event, player) {
			return game
				.filterPlayer(current => {
					if (current == player) {
						return false;
					}
					const cards = event.getg?.(current);
					if (!cards?.length) {
						return false;
					}
					return (
						event.getl?.(player)?.hs?.some(card => cards.includes(card)) &&
						(cards.some(card => card.name == "chixueqingfeng") || player.countCards("h", { name: "chixueqingfeng" }))
					);
				})
				.sortBySeat();
		},
		filter(event, player, name, target) {
			if (event.name === "loseAsync" && event.type !== "gain") {
				return false;
			}
			return target?.isIn();
		},
		forced: true,
		logTarget: (event, player, name, target) => target,
		async content(event, trigger, player) {
			const {
				targets: [target],
			} = event;
			if (player.countCards("h", { name: "chixueqingfeng" })) {
				await target.damage();
			}
			if (trigger.getg(target).some(card => card.name == "chixueqingfeng")) {
				await player.damage(target);
			}
		},
		group: "olyinfeng_gain",
		subSkill: {
			gain: {
				audio: "olyinfeng",
				trigger: {
					global: ["phaseBefore", "loseAfter", "loseAsyncAfter"],
					player: "enterGame",
				},
				forced: true,
				filter(event, player) {
					if (event.name.indexOf("lose") == 0) {
						if (event.type != "discard" || event.getlx === false || event.position != ui.discardPile) {
							return false;
						}
						return event.getd().some(card => card.name == "chixueqingfeng" && get.position(card, true) == "d");
					}
					return event.name != "phase" || game.phaseNumber == 0;
				},
				async content(event, trigger, player) {
					if (trigger.name.indexOf("lose") == 0) {
						await player.loseHp();
						const cards = trigger.getd().filter(card => card.name == "chixueqingfeng" && get.position(card, true) == "d");
						if (cards.length) {
							await player.gain(cards, "gain2");
						}
					} else {
						await player.gain(game.createCard2("chixueqingfeng", "spade", 6), "gain2");
					}
				},
			},
		},
	},
	olfulu: {
		audio: 2,
		trigger: { global: "useCardAfter" },
		filter(event, player) {
			const { card, player: target, targets } = event;
			if (card.name != "sha" || !target.countCards("h")) {
				return false;
			}
			if (player == target) {
				return targets.some(i => i.isIn());
			}
			return event.olfulu_map?.[player.playerid] && targets.includes(player);
		},
		async cost(event, trigger, player) {
			const { player: target } = trigger;
			if (player == target) {
				event.result = await player
					.chooseCardTarget({
						prompt: get.prompt(event.skill),
						prompt2: "交给其中一名角色一张手牌，然后获得其至多两张手牌",
						filterCard: true,
						filterTarget(card, player, target) {
							return get.event().targets.includes(target);
						},
						ai1(card) {
							const { player, targets } = get.event();
							if (
								player.countCards("h", { name: "chixueqingfeng" }) &&
								player.hasSkill("olyinfeng") &&
								targets.some(target => get.damageEffect(target, player, player) > 0)
							) {
								if (card.name == "chixueqingfeng") {
									return 0;
								}
								return 6.5 - get.value(card);
							}
							if (targets.some(target => get.effect(target, { name: "shunshou_copy", position: "h" }, player, player) > 0)) {
								return 6.5 - get.value(card);
							}
							return 0;
						},
						ai2(target) {
							const { player, targets } = get.event();
							const cards = ui.selected.cards;
							if (!cards.length) {
								return 0;
							}
							const { name } = cards[0];
							const eff =
								get.effect(target, { name: "shunshou_copy", position: "h" }, player, player) * Math.min(2, target.countCards("h"));
							if (player.countCards("h", { name: "chixueqingfeng" }) && name != "chixueqingfeng" && player.hasSkill("olyinfeng")) {
								return get.damageEffect(target, player, player) + eff;
							}
							return eff;
						},
					})
					.set(
						"targets",
						trigger.targets.filter(i => i.isIn())
					)
					.forResult();
			} else {
				event.result = await target
					.chooseCard("h", get.prompt(event.skill), `交给${get.translation(player)}一张手牌，然后获得其至多两张手牌`)
					.set("ai", card => {
						const { player, target } = get.event();
						const att = get.attitude(player, target);
						if (att > 0) {
							const bool = target.countCards("h", { name: "chixueqingfeng" });
							if (!target.countCards("h")) {
								return 0;
							}
							return !bool && player.needsToDiscard() ? 6 - get.value(card) : 0;
						}
						return get.effect(target, { name: "shunshou_copy", position: "h" }, player, player) > 0 ? 6 - get.value(card) : 0;
					})
					.set("target", player)
					.forResult();
			}
		},
		async content(event, trigger, player) {
			const { player: target } = trigger;
			const { cards, targets } = event;
			if (player == target) {
				const [target] = targets;
				await player.give(cards, target);
				if (target.countGainableCards(player, "h")) {
					await player.gainPlayerCard(target, "h", [1, 2], true);
				}
			} else {
				await target.give(cards, player);
				if (player.countGainableCards(target, "h")) {
					await target.gainPlayerCard(player, "h", [1, 2], true);
				}
			}
		},
		group: "olfulu_record",
		subSkill: {
			record: {
				trigger: { global: "useCard1" },
				silent: true,
				forced: true,
				popup: false,
				firstDo: true,
				filter(event, player) {
					const { card, player: target } = event;
					if (card.name != "sha") {
						return false;
					}
					return target != player && target.getHp() < player.getHp();
				},
				content() {
					if (!trigger.olfulu_map) {
						trigger.olfulu_map = {};
					}
					trigger.olfulu_map[player.playerid] = true;
				},
			},
		},
	},
	//韩氏芜湖
	oljuejue: {
		audio: 2,
		trigger: {
			player: "useCard",
		},
		forced: true,
		filter(event, player) {
			if (!["sha", "shan", "tao", "jiu"].includes(get.name(event.card))) {
				return false;
			}
			return player.getAllHistory("useCard", evt => get.name(evt.card) === get.name(event.card)).indexOf(event) == 0;
		},
		content() {
			trigger.baseDamage++;
			trigger.addCount = false;
			const stat = player.getStat().card,
				name = trigger.card.name;
			if (typeof stat[name] === "number") {
				stat[name]--;
			}
			trigger.set(event.name, true);
			player
				.when({ player: "useCardAfter" })
				.filter((evt, player, name) => evt.card === trigger.card && evt.oljuejue)
				.step(async (event, trigger, player) => {
					if (trigger.cards.filterInD().length) {
						await player.gain(trigger.cards.filterInD(), "gain2");
					}
				});
		},
	},
	olpimi: {
		audio: 2,
		trigger: {
			player: "useCardToPlayered",
			target: "useCardToTargeted",
		},
		filter(event, player) {
			if (!event.card || event.targets.length != 1 || !event.player.isIn()) {
				return false;
			}
			return (
				(event.player !== player &&
					player === event.targets[0] &&
					event.player.hasCard(card => lib.filter.canBeDiscarded(card, player, event.player), "he")) ||
				(event.player === player &&
					player !== event.targets[0] &&
					player.hasCard(card => lib.filter.cardDiscardable(card, player, "olpimi"), "he"))
			);
		},
		async cost(event, trigger, player) {
			let result,
				str = "的一张牌使此牌伤害或回复值+1，若使用者的手牌最多或最少，你摸一张牌且此技能本回合失效。";
			if (player === trigger.player) {
				result = player
					.chooseToDiscard("he", get.prompt(event.skill), "弃置" + get.translation(trigger.player) + str, "chooseonly")
					.set("ai", card => {
						const player = get.player();
						let val = player.getUseValue(card);
						const evt = get.event().getTrigger();
						const att = get.attitude(player, evt.targets[0]);
						if (att > 0 && !["tao", "jiu"].includes(get.name(evt.card))) {
							return false;
						}
						if (get.name(card) === "sha" && player.getUseValue(card) > 0) {
							val += 5;
						}
						return 20 - val;
					});
			} else {
				result = player
					.discardPlayerCard("he", trigger.player)
					.set("chooseonly", true)
					.set("prompt", get.prompt(event.skill))
					.set("prompt2", "弃置" + get.translation(trigger.player) + str)
					.set("ai", button => {
						const player = get.player(),
							card = button.link;
						const event = get.event().getTrigger(),
							target = event.player;
						if (get.attitude(player, target) > 0) {
							return 0;
						}
						let eff = get.effect(target, { name: "guohe_copy2" }, player, player);
						if (eff <= 0) {
							return 0;
						}
						if (get.tag(event.card, "damage")) {
							eff += get.effect(player, event.card, target, player);
						}
						return eff > 0 ? get.value(card) * (1 + Math.random()) : 0;
					});
			}
			event.result = await result.forResult();
		},
		logTarget: "player",
		async content(event, trigger, player) {
			await trigger.player.modedDiscard(event.cards, player);
			trigger.getParent().baseDamage++;
			if (trigger.player.isMinHandcard() || trigger.player.isMaxHandcard()) {
				await player.draw();
				player.tempBanSkill(event.name);
			}
		},
	},
	//食岑昏
	dcbaoshi: {
		trigger: { player: "phaseDrawEnd" },
		async content(event, trigger, player) {
			let cards = [];
			while (true) {
				const next = game.cardsGotoOrdering(get.cards(cards.length > 0 ? 1 : 2));
				await next;
				cards.addArray(next.cards);
				game.log(player, "亮出了", next.cards);
				await player.showCards(get.translation(player) + "亮出的牌", cards);
				let numx = cards.filter(c => !["tao", "jiu"].includes(get.name(c, player))).reduce((sum, card) => sum + get.cardNameLength(card), 0);
				if (numx > 10) {
					return;
				}
				const result = await player
					.chooseControlList(
						get.translation(event.name) + "：请选择一项（已亮出牌名字数之和为" + numx + "）",
						["获得" + get.translation(cards), "再亮出一张牌"],
						true
					)
					.set("ai", () => (get.event().numx < 7 ? 1 : 0))
					.set("numx", numx)
					.forResult();
				if (result.index == 0) {
					await player.gain(cards, "gain2");
					break;
				}
			}
		},
	},
	dcxinggong: {
		enable: "phaseUse",
		filter: event => event.dcshixinggong_cards?.length,
		onChooseToUse: event => {
			if (game.online || event.type !== "phase" || event.dcshixinggong_cards) {
				return;
			}
			event.set("dcshixinggong_cards", _status.discarded);
		},
		usable: 1,
		chooseButton: {
			dialog: event => {
				return ui.create.dialog('###兴功###<div class="text center">请选择要从弃牌堆获得的牌</div>', event.dcshixinggong_cards, "hidden");
			},
			select: [1, Infinity],
			allowChooseAll: true,
			check: button => {
				const player = get.player();
				if (player.hasSkillTag("filterDamage") || player.hasSkillTag("nodamage")) {
					return get.value(button.link);
				}
				if (ui.selected.buttons.length >= player.getHp() && get.damageEffect(player, player, player) < 0) {
					return 0;
				}
				return get.value(button.link);
			},
			backup: links => {
				return {
					audio: "dcshixinggong",
					card: links,
					async content(event, trigger, player) {
						const card = lib.skill.dcxinggong_backup.card;
						await player.gain(card, "gain2");
						const num = card.length - player.getHp();
						if (num > 0) {
							await player.damage(num);
						}
					},
				};
			},
			prompt: links => '###兴功###<div class="text center">点击“确定”获得' + get.translation(links) + "</div>",
		},
		ai: {
			order: 1,
			threaten: 2,
			result: { player: 11 },
		},
		subSkill: { backup: {} },
	},
	//年兽
	olsuichong: {
		trigger: {
			global: "phaseBefore",
			player: ["phaseZhunbeiBegin", "enterGame"],
		},
		filter(event, player) {
			if (!get.info("olsuichong").derivation.some(skill => !player.hasSkill(skill, null, false, false))) {
				return false;
			}
			if (event.name !== "phaseZhunbei") {
				return event.name !== "phase" || game.phaseNumber === 0;
			}
			if (!_status.connectMode && game.changeCoin && lib.config.coin < Math.max(10, game.countPlayer() + 1)) {
				return false;
			}
			return (
				game.getAllGlobalHistory(
					"everything",
					evt => evt.name === "olsuichong" && evt.player === player && evt._trigger?.name === "phaseZhunbei"
				).length < 3
			);
		},
		prompt2(event, player) {
			const cost = !_status.connectMode && game.changeCoin;
			return (
				(cost ? "消耗" + Math.max(10, game.countPlayer() + 1) + "金币" : "") +
				"发起拼手气红包，手气最好的角色从三个生肖兽技能中选择一个令你获得"
			);
		},
		logTarget: () => game.filterPlayer(),
		async content(event, trigger, player) {
			const targets = game.filterPlayer().sortBySeat(player);
			let coin = Math.max(10, game.countPlayer() + 1);
			const cost = !_status.connectMode && game.changeCoin;
			if (cost) {
				game.changeCoin(-coin);
			}
			let humans = targets.filter(current => current === game.me || current.isOnline());
			let locals = targets.slice().removeArray(humans).randomSort(),
				coinMap = new Map([]);
			event._global_waiting = true;
			let time = 10000,
				eventId = get.id();
			const send = (current, eventId) => {
				get.info("olsuichong").chooseOk(current, eventId);
				game.resume();
			};
			if (lib.configOL && lib.configOL.choose_timeout) {
				time = parseInt(lib.configOL.choose_timeout) * 1000;
			}
			for (let i of targets) {
				i.showTimer(time);
			}
			if (humans.length > 0) {
				const solve = function (resolve, reject) {
					return function (result, player) {
						coinMap.set(player, get.info("olsuichong").getNum(coin, coinMap, targets.length));
						resolve();
					};
				};
				await Promise.all(
					humans.map(current => {
						return new Promise((resolve, reject) => {
							if (current.isOnline()) {
								current.send(send, current, eventId);
								current.wait(solve(resolve, reject));
							} else {
								const next = get.info("olsuichong").chooseOk(current, eventId);
								const solver = solve(resolve, reject);
								if (_status.connectMode) {
									game.me.wait(solver);
								}
								return next.forResult().then(result => {
									if (_status.connectMode) {
										game.me.unwait(result, current);
									} else {
										solver(result, current);
									}
								});
							}
						});
					})
				).catch(() => {});
				game.broadcastAll("cancel", eventId);
			}
			if (locals.length > 0) {
				for (let current of locals) {
					coinMap.set(current, get.info("olsuichong").getNum(coin, coinMap, targets.length));
				}
			}
			delete event._global_waiting;
			for (let i of targets) {
				i.hideTimer();
			}
			const videoId = lib.status.videoId++,
				list = Array.from(coinMap.entries()).sort((a, b) => b[1] - a[1]),
				winner = list[0][0]; //大＞小，先抢＞后抢，大＞先抢
			if (cost) {
				game.changeCoin(coinMap.get(player));
			}
			game.log(winner, "为本次", "#y拼手气", "中手气最好的角色");
			game.broadcastAll(
				(player, id, list, cost) => {
					const dialog = ui.create.dialog(get.translation(player) + "发起了拼手气红包");
					dialog.videoId = id;
					dialog.classList.add("fullheight");
					const double = list.length > 4;
					for (let index = 0; index < list.length; index++) {
						let newRow = [
							{
								item: [[list[index][0]]],
								ratio: 2,
							},
							{
								item:
									(index === 0 ? "<font color=#FFA500>" : "") +
									"抢到" +
									list[index][1] +
									(cost ? "金币" : "欢乐豆") +
									(index === 0 ? "" : "</font>"),
								ratio: 5,
							},
						];
						if (double && index < list.length - 1) {
							index++;
							newRow.addArray([
								{
									item: [[list[index][0]]],
									ratio: 2,
								},
								{
									item: "抢到" + list[index][1] + (cost ? "金币" : "欢乐豆"),
									ratio: 5,
								},
							]);
						}
						dialog.addNewRow(...newRow);
					}
				},
				player,
				videoId,
				list,
				cost
			);
			await game.delay(3);
			game.broadcastAll("closeDialog", videoId);
			const skills = get
				.info("olsuichong")
				.derivation.filter(skill => !player.hasSkill(skill, null, false, false))
				.randomGets(3);
			const result =
				skills.length > 1
					? await winner
							.chooseButton(
								[
									"岁崇：请选择一个生肖兽技能令" + get.translation(player) + "获得",
									[
										skills.map(skill => [
											skill,
											'<div class="popup text" style="width:calc(100% - 10px);display:inline-block"><div class="skill">【' +
												get.translation(skill) +
												"】</div><div>" +
												lib.translate[skill + "_info"] +
												"</div></div>",
										]),
										"textbutton",
									],
								],
								true
							)
							.set("ai", () => 1 + Math.random())
							.forResult()
					: { bool: true, links: skills };
			const skill = result?.links?.[0];
			if (skill) {
				winner.line(player);
				await player.addAdditionalSkills("olsuichong", [skill]);
			}
		},
		derivation: [
			"olzishu",
			"olchouniu",
			"olyinhu",
			"olmaotu",
			"olchenlong",
			"olsishe",
			"olwuma",
			"olweiyang",
			"olshenhou",
			"olyouji",
			"olxugou",
			"olhaizhu",
		],
		/*
		模拟随机抢红包的过程，同时尽量保证公平性。具体思路如下：
		基础分配：每个人至少分配1元，确保每个人都能抢到红包。
		剩余金额分配：将剩余金额随机分配，但尽量保证分配的随机性不会导致先抢的人优势过大。
		随机性与公平性平衡：通过随机分配剩余金额，但限制每次分配的最大值，避免某一个人抢到过多金额。
		*/
		getNum(coin, coinMap, max) {
			const remainingCoin = coin - Array.from(coinMap.values()).reduce((sum, num) => sum + num, 0),
				remainingPeople = max - coinMap.size;
			if (remainingCoin === remainingPeople) {
				return 1;
			}
			if (remainingPeople === 1) {
				return remainingCoin;
			}
			const maxAllocatable = Math.min(remainingCoin - remainingPeople + 1, Math.floor(remainingCoin / remainingPeople) + 1);
			return Math.floor(Math.random() * maxAllocatable) + 1;
		},
		chooseOk(player, eventId) {
			return player
				.chooseControl("ok")
				.set("prompt", "新年新气象，来拼个手气吧！")
				.set("prompt2", "点击“确定”进行抢红包")
				.set("id", eventId)
				.set("_global_waiting", true);
		},
	},
	olshouhun: {
		trigger: {
			global: "phaseBefore",
			player: ["phaseDrawBegin2", "damageBegin4", "enterGame"],
		},
		filter(event, player) {
			const storage = player.storage?.["olshouhun"];
			if (!storage) {
				return false;
			}
			if (event.name === "damage") {
				return storage.some(num => num < 4);
			}
			if (event.name === "phaseDraw") {
				return !event.numFixed && storage[0] > 0;
			}
			return storage[2] > 0 && (event.name !== "phase" || game.phaseNumber === 0);
		},
		forced: true,
		async content(event, trigger, player) {
			const skill = event.name,
				storage = player.storage[skill];
			switch (trigger.name) {
				case "damage": {
					const list = ["摸牌数", "手牌上限", "体力上限"];
					const choices = [0, 1, 2].filter(num => storage[num] === Math.min(...storage));
					const result =
						choices.length > 1
							? await player
									.chooseControl(choices.map(num => list[num]))
									.set("ai", () => {
										const list = ["摸牌数", "体力上限", "手牌上限"];
										return get.event().controls.sort((a, b) => list.indexOf(a) - list.indexOf(b))[0];
									})
									.set("prompt", "兽魂：请选择一个数值项最小的选项，令其数值+1")
									.forResult()
							: { control: list[choices[0]] };
					const choice = result?.control;
					if (choice) {
						const index = list.indexOf(choice);
						player.popup(choice);
						game.log(player, "令", "#g【" + get.translation(skill) + "】", "的", "#y" + choice + "+1");
						player.storage[skill][index]++;
						player.markSkill(skill);
						player.addTip(skill, [get.translation(skill)].concat(player.storage[skill]).join(" "));
						if (index === 2) {
							await player.gainMaxHp();
						}
					}
					break;
				}
				case "phaseDraw":
					trigger.num += storage[0];
					break;
				default:
					await player.gainMaxHp(storage[2]);
					break;
			}
		},
		init(player, skill) {
			player.storage[skill] = player.storage[skill] || [0, 1, 2];
			player.markSkill(skill);
			player.addTip(skill, [get.translation(skill)].concat(player.storage[skill]).join(" "));
		},
		onremove(player, skill) {
			delete player.storage[skill];
			player.removeTip(skill);
		},
		mark: true,
		intro: {
			markcount: storage => storage.map(num => num.toString()).join(""),
			content(storage = []) {
				return ["摸牌阶段额外摸" + storage[0] + "张牌", "手牌上限+" + storage[1], "体力上限+" + storage[2]]
					.map(str => "<li>" + str)
					.join("<br>");
			},
		},
		mod: { maxHandcard: (player, num) => num + (player.storage?.["olshouhun"]?.[1] || 0) },
	},
	//十二生肖
	olzishu: {
		audio: true,
		enable: "phaseUse",
		usable: 1,
		selectTarget: 1,
		filter(event, player) {
			return game.hasPlayer(target => get.info("olzishu").filterTarget(null, player, target));
		},
		filterTarget(card, player, target) {
			return target !== player && target.countCards("h") > player.countCards("h");
		},
		async content(event, trigger, player) {
			await player.gainPlayerCard(event.target, "h", true);
			while (game.hasPlayer(target => get.info(event.name).filterTarget(null, player, target)) && !player.isMaxHandcard()) {
				const result = await player
					.chooseTarget("是否继续获得手牌数大于你的一名角色的一张手牌？", get.info(event.name).filterTarget)
					.set("ai", function (target) {
						const player = get.player();
						return get.effect(target, { name: "shunshou_copy", position: "h" }, player, player);
					})
					.forResult();
				if (result.bool) {
					player.line(result.targets[0]);
					await player.gainPlayerCard(result.targets[0], "h", true);
				} else {
					break;
				}
			}
		},
		ai: {
			order: 0.01,
			result: {
				player(player, target) {
					return get.effect(target, { name: "shunshou_copy", position: "h" }, player, player);
				},
			},
		},
	},
	olchouniu: {
		audio: true,
		trigger: { player: "phaseJieshuBegin" },
		filter(event, player) {
			return player.isMinHp();
		},
		forced: true,
		content() {
			player.recover();
		},
	},
	olyinhu: {
		audio: true,
		enable: "phaseUse",
		filter(event, player) {
			return player.hasCard(card => get.info("olyinhu").filterCard(card, player), "he");
		},
		filterCard(card, player) {
			if (!lib.filter.cardDiscardable(card, player)) {
				return false;
			}
			return !player.getStorage("olyinhu_used").some(cardx => get.type2(cardx[2]) === get.type2(card));
		},
		filterTarget: lib.filter.notMe,
		check(card) {
			return 8 - get.value(card);
		},
		position: "he",
		async content(event, trigger, player) {
			const [card] = event.cards;
			player.addTempSkill("olyinhu_used", "phaseUseAfter");
			player.markAuto("olyinhu_used", [[get.translation(get.type2(card)), "", card.name]]);
			const next = event.target.damage();
			await next;
			if (
				game.getGlobalHistory("everything", evt => {
					return evt.name === "dying" && evt.getParent(next.name) === next;
				}).length > 0
			) {
				player.tempBanSkill("olyinhu");
			}
		},
		ai: {
			order: 7,
			result: {
				player(player, target) {
					return get.damageEffect(target, player, player);
				},
			},
		},
		subSkill: {
			used: {
				charlotte: true,
				onremove: true,
				intro: {
					name: "弃置过的牌",
					mark(dialog, content = []) {
						if (content.length) {
							dialog.addSmall([content, "vcard"]);
						}
					},
				},
			},
		},
	},
	olmaotu: {
		audio: true,
		trigger: { global: "dyingAfter" },
		filter(event, player) {
			return !player.hasSkill("olmaotu_effect", null, false, false);
		},
		forced: true,
		content() {
			player.addTempSkill("olmaotu_effect", { player: "phaseBegin" });
		},
		subSkill: {
			effect: {
				charlotte: true,
				mod: {
					targetEnabled(card, player, target) {
						if (player !== target && player.getHp() >= target.getHp()) {
							return false;
						}
					},
				},
				mark: true,
				intro: { content: "不能成为体力值大于等于你的其他角色使用牌的目标" },
			},
		},
	},
	olchenlong: {
		audio: true,
		enable: "phaseUse",
		filterTarget: lib.filter.notMe,
		usable: 1,
		async content(event, trigger, player) {
			player.addTempSkill("olchenlong_temp");
			const result = await player
					.chooseNumbers(get.translation(event.name), [{ prompt: "请选择你要失去的体力值", min: 1, max: 2 }], true)
					.set("processAI", () => {
						const player = get.player();
						let num = Math.min(2, player.getHp() - 1);
						if (!player.hasCard(card => player.canSaveCard(card, player), "hs")) {
							num = Math.min(2, player.getHp());
						}
						return [num];
					})
					.forResult(),
				num = result.numbers?.[0];
			if (num) {
				await player.loseHp(num);
				await event.target.damage(num);
			}
		},
		ai: {
			order: 1,
			result: {
				player(player, target) {
					if (player.getHp() + player.countCards("hs", card => player.canSaveCard(card, player)) <= 1) {
						return 0;
					}
					return get.damageEffect(target, player, player);
				},
			},
		},
		subSkill: {
			temp: {
				audio: "olchenlong",
				charlotte: true,
				trigger: { player: "dying" },
				filter(event, player) {
					return event.getParent("loseHp").name === "olchenlong";
				},
				content() {
					player.loseMaxHp();
				},
			},
		},
	},
	olsishe: {
		audio: true,
		trigger: { player: "damageEnd" },
		filter(event, player) {
			return event.source?.isIn();
		},
		check(event, player) {
			return get.damageEffect(event.source, player, player) > 0;
		},
		logTarget: "source",
		content() {
			trigger.source.damage(trigger.num);
		},
		ai: {
			threaten: 0.6,
			maixie: true,
			effect: {
				target(card, player, target) {
					if (player.hasSkillTag("jueqing", false, target)) {
						return [1, -1.5];
					}
					if (target.hasFriend() && get.tag(card, "damage")) {
						return [1, 0, 0, -0.7];
					}
				},
			},
		},
	},
	olwuma: {
		audio: true,
		trigger: { target: "useCardToTargeted" },
		filter(event, player) {
			return event.player !== player && get.type2(event.card) === "trick";
		},
		forced: true,
		content() {
			player.draw();
		},
		group: ["olwuma_turn", "olwuma_skip"],
		subSkill: {
			turn: {
				audio: "olwuma",
				trigger: { player: "turnOverBefore" },
				filter(event, player) {
					return !player.isTurnedOver();
				},
				forced: true,
				content() {
					trigger.cancel();
				},
			},
			skip: {
				audio: "olwuma",
				trigger: {
					player: ["phaseAnySkipped", "phaseAnyCancelled"],
				},
				forced: true,
				content() {
					game.log(player, "恢复了", trigger.name);
					player[trigger.name]();
				},
			},
		},
	},
	olweiyang: {
		audio: true,
		enable: "phaseUse",
		filter(event, player) {
			if (!player.hasCard(card => lib.filter.cardDiscardable(card, player), "he")) {
				return false;
			}
			return game.hasPlayer(target => target.isDamaged());
		},
		filterCard(card, player) {
			if (!lib.filter.cardDiscardable(card, player)) {
				return false;
			}
			return !ui.selected.cards?.some(cardx => get.type2(card) === get.type2(cardx));
		},
		selectCard: [1, Infinity],
		position: "he",
		complexCard: true,
		check(card) {
			var player = _status.event.player;
			var count = game.filterPlayer(function (current) {
				return current.isDamaged() && get.attitude(player, current) > 2;
			}).length;
			if (ui.selected.cards.length >= count) {
				return -1;
			}
			return 8 - get.value(card);
		},
		filterTarget(card, player, target) {
			return target.isDamaged();
		},
		selectTarget() {
			return ui.selected.cards.length;
		},
		usable: 1,
		content() {
			target.recover();
		},
		ai: {
			order: 6,
			result: {
				player(player, target) {
					return get.recoverEffect(target, player, player);
				},
			},
		},
	},
	olshenhou: {
		audio: true,
		trigger: { target: "useCardToTargeted" },
		filter(event, player) {
			return event.player !== player && event.card.name === "sha";
		},
		check(event, player) {
			return get.effect(player, event.card, event.player, player) <= 0;
		},
		async content(event, trigger, player) {
			const result = await player.judge(card => (get.color(card) === "red" ? 2 : -2)).forResult();
			if (result.bool) {
				trigger.getParent().excluded.add(player);
			}
		},
		ai: {
			effect: {
				target(card) {
					if (card.name === "sha") {
						return [1, 0.4];
					}
				},
			},
		},
	},
	olyouji: {
		audio: true,
		trigger: { player: "phaseDrawBegin2" },
		filter(event, player) {
			return game.roundNumber > 0 && !event.numFixed;
		},
		forced: true,
		content() {
			trigger.num += Math.min(5, game.roundNumber);
		},
	},
	olxugou: {
		mod: {
			targetInRange(card, player, target) {
				if (card.name === "sha" && ["unsure", "red"].includes(get.color(card))) {
					return true;
				}
			},
		},
		audio: true,
		trigger: { player: "useCard" },
		filter(event, player) {
			return event.card.name === "sha" && get.color(event.card) === "red";
		},
		forced: true,
		content() {
			trigger.baseDamage++;
		},
		ai: {
			effect: {
				player(card, player, target) {
					if (card.name === "sha" && get.color(card) === "red") {
						if (get.attitude(player, target) > 0) {
							return [1, -0.5];
						}
						return [1, 0.8];
					}
				},
			},
		},
		group: "olxugou_buff",
		subSkill: {
			buff: {
				audio: "olxugou",
				trigger: { target: "shaBefore" },
				filter(event, player) {
					return get.color(event.card) == "red";
				},
				forced: true,
				content() {
					trigger.cancel();
				},
				ai: {
					effect: {
						target(card, player, target) {
							if (card.name === "sha" && get.color(card) === "red") {
								return "zerotarget";
							}
						},
					},
				},
			},
		},
	},
	olhaizhu: {
		audio: true,
		trigger: {
			player: "phaseZhunbeiBegin",
			global: ["loseAfter", "loseAsyncAfter"],
		},
		filter(event, player) {
			if (event.name === "phaseZhunbei") {
				return player.isMaxHandcard();
			}
			if (event.type !== "discard" || event.getlx === false) {
				return false;
			}
			return game.hasPlayer(target => {
				if (target === player) {
					return false;
				}
				return event.getl?.(target)?.cards2?.some(card => get.color(card) === "black" && get.position(card, true) === "d");
			});
		},
		forced: true,
		async content(event, trigger, player) {
			if (trigger.name === "phaseZhunbei") {
				await player.loseHp();
				return event.finish();
			}
			if (trigger.delay === false) {
				await game.delay();
			}
			await player.gain(
				game
					.filterPlayer(target => {
						if (target === player) {
							return false;
						}
						return trigger.getl?.(target)?.cards2?.some(card => get.color(card) === "black" && get.position(card, true) === "d");
					})
					.reduce((list, target) => {
						return list.addArray(
							trigger.getl(target).cards2.filter(card => get.color(card) === "black" && get.position(card, true) === "d")
						);
					}, []),
				"gain2"
			);
		},
	},
	//战神吕布
	olfengzhu: {
		audio: 1,
		trigger: { player: "phaseZhunbeiBegin" },
		filter(event, player) {
			return game.hasPlayer(current => player != current && current.hasSex("male") && !player.getStorage("olfengzhu").includes(current));
		},
		locked: true,
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(
					(card, player, target) => {
						return player != target && target.hasSex("male") && !player.getStorage("olfengzhu").includes(target);
					},
					"逢主：义父你在哪儿？",
					lib.translate.olfengzhu_info,
					true
				)
				.set("ai", target => {
					const player = get.player();
					const att = get.attitude(player, target),
						num = target.getHp();
					return (-att + 0.1) * get.effect(player, { name: "draw" }, player, player) * num;
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const target = event.targets[0],
				num = target.getHp();
			player.markAuto(event.name, [target]);
			await player.draw(num);
			const [surname] = get.characterSurname(target.name)[0];
			if (surname) {
				game.broadcastAll(
					(player, surname) => {
						if (player.name == "ol_jsrg_lvbu" || player.name1 == "ol_jsrg_lvbu") {
							player.node.name.innerHTML = `战神${surname}布`;
						}
						if (player.name2 == "ol_jsrg_lvbu") {
							player.node.name2.innerHTML = `战神${surname}布`;
						}
						lib.character.ol_jsrg_lvbu.names = lib.character.ol_jsrg_lvbu.names + `-${surname}|布`;
					},
					player,
					surname
				);
			} else {
				player.chat("不是，连姓也没有？什么罐头我说！");
			}
		},
		intro: { content: "当前的义父有：$" },
	},
	olyuyu: {
		audio: 1,
		trigger: { player: "phaseEnd" },
		filter(event, player) {
			return game.hasPlayer(current => player.getStorage("olfengzhu").includes(current));
		},
		locked: true,
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(
					get.prompt(event.name.slice(0, -5)),
					(card, player, target) => {
						return player.getStorage("olfengzhu").includes(target);
					},
					"选择一名义父，令其饮恨",
					true
				)
				.set("ai", target => {
					const player = get.player();
					return -get.attitude(player, target);
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const {
				targets: [target],
				name,
			} = event;
			target.addMark(name);
			player.addSkill(name + "_effect");
			player.markAuto(name + "_effect", [target]);
		},
		marktext: "恨",
		intro: {
			name: "恨(玉玉)",
			name2: "恨",
			content: "mark",
		},
		ai: { combo: "olfengzhu" },
		subSkill: {
			effect: {
				audio: "olyuyu",
				charlotte: true,
				onremove: true,
				intro: { content: "于$回合内受到1点伤害或失去一张牌后，其获得1枚“恨“标记" },
				trigger: {
					player: ["loseAfter", "damageEnd"],
					global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"],
				},
				filter(event, player) {
					const target = _status.currentPhase;
					if (!target || !player.getStorage("olfengzhu").includes(target) || !target.isIn()) {
						return false;
					}
					if (event.name == "damage") {
						return event.num > 0;
					}
					const evt = event.getl(player);
					return evt?.cards2?.length;
				},
				forced: true,
				logTarget: () => _status.currentPhase,
				async content(event, trigger, player) {
					const num = trigger.name == "damage" ? trigger.num : trigger.getl(player).cards2.length;
					_status.currentPhase.addMark("olyuyu", num);
				},
			},
		},
	},
	ollbzhiji: {
		audio: 2,
		trigger: { player: "useCardToPlayer" },
		filter(event, player) {
			return player.getStorage("olfengzhu").includes(event.target) && event.target.hasMark("olyuyu");
		},
		forced: true,
		logTarget: "target",
		async content(event, trigger, player) {
			const { card, target } = trigger;
			let num = target.countMark("olyuyu");
			if (get.is.damageCard(card)) {
				const evt = trigger.getParent();
				if (typeof evt.baseDamage != "number") {
					evt.baseDamage = 1;
				}
				evt.baseDamage += num;
				game.log(card, "伤害", `#g+${num}`);
				target.clearMark("olyuyu");
			} else {
				while (num--) {
					const judgeEvent = player.judge(card => {
						return get.type(card) == "equip" || ["sha", "judou"].includes(get.name(card)) ? 1.5 : -1.5;
					});
					judgeEvent.judge2 = result => result.bool;
					judgeEvent.set("callback", async event => {
						const { card } = event;
						if (get.type(card) == "equip" && !player.hasSkill("shenji")) {
							await player.addSkills("shenji");
						}
						if (["sha", "judou"].includes(get.name(card))) {
							if (!player.hasSkill("wushuang")) {
								await player.addSkills("wushuang");
							}
							if (get.position(card, true) == "o") {
								await player.gain(card, "gain2");
							}
						}
					});
					await judgeEvent;
				}
			}
		},
		derivation: ["shenji", "wushuang"],
		ai: { combo: "olfengzhu" },
	},
	oljiejiu: {
		audio: 1,
		mod: {
			cardEnabled(card, player) {
				if (card.name == "jiu") {
					return false;
				}
			},
			cardSavable(card, player) {
				if (card.name == "jiu") {
					return false;
				}
			},
		},
		enable: "chooseToUse",
		filter(event, player) {
			if (event.type == "wuxie") {
				return false;
			}
			if (
				!player.hasCard(card => {
					return _status.connectMode || get.name(card) == "jiu";
				}, "hes")
			) {
				return false;
			}
			return get.inpileVCardList(info => {
				if (info[0] != "basic") {
					return false;
				}
				return event.filterCard(get.autoViewAs({ name: info[2], nature: info[3] }, "unsure"), player, event);
			}).length;
		},
		chooseButton: {
			dialog(event, player) {
				const vcards = get.inpileVCardList(info => {
					if (info[0] != "basic") {
						return false;
					}
					return event.filterCard(get.autoViewAs({ name: info[2], nature: info[3] }, "unsure"), player, event);
				});
				return ui.create.dialog("戒酒", [vcards, "vcard"]);
			},
			check(button) {
				if (get.event().getParent().type != "phase") {
					return 1;
				}
				return get.player().getUseValue({ name: button.link[2], nature: button.link[3] });
			},
			backup(links, player) {
				return {
					audio: "oljiejiu",
					popname: true,
					viewAs: { name: links[0][2], nature: links[0][3] },
					filterCard(card, player) {
						return get.name(card) == "jiu";
					},
					check(card) {
						return 7 - get.value(card);
					},
					position: "hes",
				};
			},
			prompt(links, player) {
				return "将一张【酒】当" + (get.translation(links[0][3]) || "") + get.translation(links[0][2]) + "使用";
			},
		},
		hiddenCard(player, name) {
			if (get.type(name) !== "basic") {
				return false;
			}
			return (
				lib.inpile.includes(name) &&
				player.hasCard(card => {
					return _status.connectMode || get.name(card) == "jiu";
				}, "hes")
			);
		},
		ai: {
			respondSha: true,
			respondShan: true,
			skillTagFilter(player) {
				if (
					!player.hasCard(card => {
						return _status.connectMode || get.name(card) == "jiu";
					}, "hes")
				) {
					return false;
				}
			},
			order: 3,
			result: {
				player(player) {
					return get.event().dying ? get.attitude(player, get.event().dying) : 1;
				},
			},
		},
		derivation: "lijian",
		group: "oljiejiu_jiese",
		subSkill: {
			backup: {},
			jiese: {
				audio: "oljiejiu",
				trigger: {
					global: "phaseBefore",
					player: "enterGame",
				},
				filter(event, player) {
					if (!get.info("oljiejiu_jiese").logTarget(event, player).length) {
						return false;
					}
					return event.name != "phase" || game.phaseNumber == 0;
				},
				forced: true,
				logTarget: (event, player) =>
					game.filterPlayer(current => {
						if (!current.hasSex("female") || player == current) {
							return false;
						}
						return current.getStockSkills(true, true).length;
					}),
				async content(event, trigger, player) {
					for (const target of event.targets.sortBySeat()) {
						const skills = target.getStockSkills(true, true);
						if (!skills.length) {
							continue;
						}
						const skill = skills.randomRemove();
						await target.changeSkills(["lijian"], [skill]);
						game.broadcastAll(
							(target, skill) => {
								for (const name of get.nameList(target)) {
									if (get.character(name, 3).includes(skill)) {
										get.character(name, 3).add("lijian");
										get.character(name, 3).remove(skill);
									}
								}
							},
							target,
							skill
						);
					}
				},
			},
		},
	},
	//卫青
	dcbeijin: {
		enable: "phaseUse",
		content() {
			player.addSkill("dcbeijin_effect");
			player.addTempSkill("dcbeijin_buff");
			player.draw().gaintag = ["dcbeijin_effect"];
		},
		ai: {
			order: 20,
			result: { player: player => 1 - (player.hasSkill("dcbeijin_buff") && player.hasCard(card => card.hasGaintag("dcbeijin_effect"), "h")) },
		},
		locked: false,
		mod: {
			aiValue(player, card, num) {
				if (card.name === "zhangba") {
					return num + 1145141919810;
				}
			},
		},
		subSkill: {
			effect: {
				charlotte: true,
				mod: {
					cardUsable(card) {
						if (get.number(card) === "unsure" || card.cards?.some(card => card.hasGaintag("dcbeijin_effect"))) {
							return Infinity;
						}
					},
					aiOrder(player, card, num) {
						if (player.hasSkill("dcbeijin_buff") && typeof card === "object") {
							if (get.itemtype(card) === "card" || card.cards?.some(card => card.hasGaintag("dcbeijin_effect"))) {
								return num + 100;
							}
							return num / (get.tag(card, "recover") ? 1 : 1145141919810);
						}
					},
				},
				trigger: { player: "useCard1" },
				filter(event, player) {
					return (
						event.addCount !== false &&
						player.hasHistory("lose", evt => {
							const evtx = evt.relatedEvent || evt.getParent();
							if (evtx !== event) {
								return false;
							}
							return Object.values(evt.gaintag_map).flat().includes("dcbeijin_effect");
						})
					);
				},
				forced: true,
				popup: false,
				firstDo: true,
				content() {
					trigger.addCount = false;
					const stat = player.getStat().card,
						name = trigger.card.name;
					if (typeof stat[name] === "number") {
						stat[name]--;
					}
				},
			},
			buff: {
				charlotte: true,
				trigger: { player: ["useCard", "dcbeijinBegin"] },
				forced: true,
				popup: false,
				content() {
					player.removeSkill(event.name);
					if (player.hasCard(card => card.hasGaintag("dcbeijin_effect"))) {
						player.loseHp();
					}
				},
				mark: true,
				intro: { content: "本回合下次使用牌时或发动【北进】时，若手牌中有因【北进】得到的牌，你失去1点体力" },
			},
		},
	},
	//姜子牙
	xingzhou: {
		usable: 1,
		trigger: {
			global: "damageEnd",
		},
		filter(event, player) {
			if (!event.source || !event.source.isIn()) {
				return false;
			}
			if (!player.canUse({ name: "sha" }, event.source, false)) {
				return false;
			}
			return player.countCards("h") > 1 && event.player.isMinHandcard();
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseToDiscard("h", 2, get.prompt2(event.skill, trigger.source))
				.set("chooseonly", true)
				.set("ai", card => {
					const player = get.player(),
						target = get.event().getTrigger().source;
					if (!player.canUse({ name: "sha" }, target, false)) {
						return 0;
					}
					if (get.effect(target, { name: "sha" }, player, player) <= 0) {
						return 0;
					}
					return 6 - get.value(card);
				})
				.forResult();
			event.result.targets = [trigger.source];
		},
		async content(event, trigger, player) {
			const { cards, targets } = event;
			await player.discard(cards);
			const card = { name: "sha", isCard: true };
			if (player.canUse(card, targets[0], false)) {
				await player.useCard(card, targets, false);
			}
			if (
				game.getGlobalHistory("everything", evt => {
					if (evt.name != "die" || evt.player != targets[0]) {
						return false;
					}
					return evt.reason?.getParent(event.name) == event;
				}).length > 0
			) {
				player.restoreSkill("lieshen");
			}
		},
	},
	lieshen: {
		init(player) {
			player.addSkill("lieshen_init");
		},
		onremove(player) {
			player.removeSkill("lieshen_init");
		},
		enable: "phaseUse",
		mark: true,
		skillAnimation: true,
		animationColor: "gray",
		limited: true,
		onChooseToUse(event) {
			if (game.online) {
				return;
			}
			let list = [];
			if (_status.lieshen_map) {
				let map = _status.lieshen_map;
				for (let key in map) {
					let target = game.findPlayer(current => current.playerid == key);
					if (target) {
						list.add([target, ...map[key]]);
					}
				}
			}
			event.set("lieshen_list", list);
		},
		filter(event, player) {
			const list = event.lieshen_list;
			if (!list || !list.length) {
				return false;
			}
			return list.some(map => {
				return map[0].hp != map[1] || map[0].countCards("h") != map[2];
			});
		},
		filterTarget(card, player, target) {
			const list = _status.event.lieshen_list;
			return list.some(map => {
				if (map[0] != target) {
					return false;
				}
				return map[0].hp != map[1] || map[0].countCards("h") != map[2];
			});
		},
		async content(event, trigger, player) {
			const target = event.target;
			player.awakenSkill(event.name);
			const map = _status.lieshen_map[target.playerid];
			if (map) {
				if (target.hp > map[0]) {
					await target.loseHp(target.hp - map[0]);
				} else if (target.hp < map[0]) {
					await target.recoverTo(map[0]);
				}
				const num = target.countCards("h");
				if (num > map[1]) {
					await target.chooseToDiscard("h", num - map[1], true);
				} else if (num < map[1]) {
					await target.drawTo(map[1]);
				}
			}
		},
		ai: {
			order: 2,
			result: {
				target(player, target) {
					const list = _status.event.lieshen_list;
					if (!list || !list.length) {
						return 0;
					}
					const map = list.find(key => key[0] == target);
					if (!map) {
						return 0;
					}
					let eff = 0,
						num1 = target.hp - map[1],
						num2 = target.countCards("h") - map[2];
					if (num1 > 0) {
						eff += get.effect(target, { name: "losehp" }, target, target) * num1;
					} else if (num1 < 0) {
						eff -= get.recoverEffect(target, target, target) * num1;
					}
					if (num2 > 0) {
						eff += get.effect(target, { name: "guohe_copy2" }, target, target) * num2;
					} else if (num2 < 0) {
						eff -= get.effect(target, { name: "draw" }, target, target) * num2;
					}
					if (Math.abs(eff) <= 5) {
						return 0;
					}
					return eff;
				},
			},
		},
		subSkill: {
			init: {
				trigger: {
					global: ["phaseBefore", "enterGame"],
				},
				filter(event, player) {
					return event.name != "phase" || game.phaseNumber == 0;
				},
				charlotte: true,
				lastDo: true,
				async cost(event, trigger, player) {
					let targets = game.players;
					if (trigger.name != "phase" && trigger.player != player) {
						targets = [trigger.player];
					}
					let bool = targets.some(target => {
						if (!_status.lieshen_map) {
							return true;
						}
						return !_status.lieshen_map[target.playerid];
					});
					event.result = {
						bool: bool,
						targets: targets,
						skill_popup: false,
					};
				},
				async content(event, trigger, player) {
					if (!_status.lieshen_map) {
						_status.lieshen_map = {};
					}
					for (let target of event.targets) {
						if (_status.lieshen_map[target.playerid]) {
							continue;
						}
						_status.lieshen_map[target.playerid] = [target.hp, target.countCards("h")];
					}
				},
			},
		},
	},
	//申公豹
	zhuzhou: {
		usable: 1,
		trigger: {
			global: "damageSource",
		},
		filter(event, player) {
			if (!event.source || event.source == event.player) {
				return false;
			}
			if (!event.source.isIn() || !event.player.isIn()) {
				return false;
			}
			return event.source.isMaxHandcard() && event.player.countCards("h");
		},
		check(event, player) {
			return get.effect(event.player, { name: "shunshou_copy2" }, event.source, player) > 0;
		},
		logTarget: "source",
		prompt2: "令其获得受伤角色的一张手牌",
		async content(event, trigger, player) {
			await trigger.source.gainPlayerCard(trigger.player, "h", true);
		},
	},
	yaoxian: {
		enable: "phaseUse",
		usable: 1,
		selectTarget: 2,
		multitarget: true,
		targetprompt: ["摸牌", "出杀目标"],
		filterTarget(card, player, target) {
			if (ui.selected.targets.length == 0) {
				return true;
			} else {
				return target != player;
			}
		},
		delay: false,
		async content(event, trigger, player) {
			const drawer = event.targets[0],
				target = event.targets[1];
			await drawer.draw(2);
			const result = await drawer
				.chooseToUse(
					function (card, player, event) {
						if (get.name(card) != "sha") {
							return false;
						}
						return lib.filter.filterCard.apply(this, arguments);
					},
					"邀仙：对" + get.translation(target) + "使用一张杀，否则失去1点体力"
				)
				.set("targetRequired", true)
				.set("complexTarget", true)
				.set("complexSelect", true)
				.set("filterTarget", function (card, player, target) {
					if (target != _status.event.sourcex && !ui.selected.targets.includes(_status.event.sourcex)) {
						return false;
					}
					return lib.filter.targetEnabled.apply(this, arguments);
				})
				.set("sourcex", target)
				.forResult();
			if (!result.bool) {
				await drawer.loseHp();
			}
		},
		ai: {
			result: {
				player(player) {
					var players = game.filterPlayer();
					for (var i = 0; i < players.length; i++) {
						if (players[i] != player && get.attitude(player, players[i]) > 1 && get.attitude(players[i], player) > 1) {
							return 1;
						}
					}
					return 0;
				},
				target(player, target) {
					if (ui.selected.targets.length) {
						return -0.1;
					}
					if (target.hp <= 1) {
						return 0;
					}
					return 1;
				},
			},
			order: 8.5,
			expose: 0.2,
		},
	},
	//寿星
	xwshoufa: {
		enable: "phaseUse",
		filter(event, player) {
			return player.countCards("h", card => lib.suit.includes(get.suit(card, player)));
		},
		chooseButton: {
			dialog(event, player) {
				const dialog = ui.create.dialog("###授法###请选择要给出的花色");
				return dialog;
			},
			chooseControl(event, player) {
				var list = player.getCards("h").reduce((arr, card) => arr.add(get.suit(card, player)), []);
				list.push("cancel2");
				return list;
			},
			check(event, player) {
				return 1 + Math.random();
			},
			backup(result, player) {
				return {
					audio: "xwshoufa",
					filterCard(card, player) {
						return get.suit(card, player) == result.control;
					},
					selectCard: -1,
					position: "h",
					suit: result.control,
					filterTarget: lib.filter.notMe,
					discard: false,
					lose: false,
					async content(event, trigger, player) {
						const { cards, target } = event;
						await player.give(cards, target);
						let suit = get.info(event.name).suit;
						if (suit) {
							let skill = lib.skill.xwshoufa.derivation[["spade", "heart", "club", "diamond"].indexOf(suit)];
							player.addSkill("xwshoufa_clear");
							target.addAdditionalSkills(`xwshoufa_${player.playerid}`, skill, true);
						}
					},
					ai: {
						result: {
							target(player, target) {
								if (target.hasSkillTag("nogain")) {
									return 0;
								}
								if (!ui.selected.cards?.length) {
									return 0;
								}
								return ui.selected.cards.reduce((sum, card) => (sum += get.value(card, target)), 0);
							},
						},
					},
				};
			},
			prompt(result, player) {
				let skill = lib.skill.xwshoufa.derivation[["spade", "heart", "club", "diamond"].indexOf(result.control)];
				return `将所有${get.translation(result.control)}牌交给一名其他角色并令其获得【${get.translation(skill)}】`;
			},
		},
		ai: {
			order: 2,
			result: { player: 1 },
		},
		derivation: ["tiandu", "retianxiang", "reqingguo", "new_rewusheng"],
		subSkill: {
			clear: {
				trigger: {
					player: "phaseBegin",
				},
				direct: true,
				firstDo: true,
				charlotte: true,
				async content(event, trigger, player) {
					const func = async current => {
						await current.removeAdditionalSkills(`xwshoufa_${player.playerid}`);
					};
					await game.doAsyncInOrder(game.players, func);
				},
			},
			backup: {},
		},
	},
	fuzhao: {
		trigger: {
			global: "dying",
		},
		logTarget: "player",
		filter(event, player) {
			return event.player.hp < 1;
		},
		check(event, player) {
			return get.attitude(player, event.player) > 0;
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			const result = await target
				.judge(function (card) {
					if (get.suit(card) == "heart") {
						return 2;
					}
					return 0;
				})
				.forResult();
			if (result?.suit) {
				if (result.suit == "heart") {
					await target.recover();
				}
			}
		},
	},
	//汉曹操
	//江山如故二代目
	oldingxi: {
		audio: 2,
		trigger: { global: "cardsDiscardAfter" },
		filter(event, player) {
			if (
				!player.getPrevious() ||
				!event.cards.filterInD("d").some(card => {
					return get.is.damageCard(card) && player.canUse(card, player.getPrevious());
				})
			) {
				return false;
			}
			const evt = event.getParent();
			if (evt.name != "orderingDiscard") {
				return false;
			}
			const evtx = evt.relatedEvent || evt.getParent();
			return player.hasHistory("useCard", evtxx => {
				if (evtxx.getParent().name === "oldingxi") {
					return false;
				}
				return evtx.getParent() == (evtxx.relatedEvent || evtxx.getParent()) && get.is.damageCard(evtxx.card);
			});
		},
		async cost(event, trigger, player) {
			const target = player.getPrevious();
			const cards = trigger.cards.filterInD("d").filter(card => get.is.damageCard(card));
			event.result = await player
				.chooseButton([get.prompt2(event.skill, target), cards])
				.set("filterButton", button => {
					const player = get.player(),
						target = get.event().target;
					return player.canUse(button.link, target);
				})
				.set("target", target)
				.set("ai", button => {
					const player = get.player(),
						target = get.event().target;
					return get.effect(target, button.link, player, player);
				})
				.forResult();
			if (event.result.bool) {
				event.result.cards = event.result.links;
			}
		},
		logTarget(event, player) {
			return player.getPrevious();
		},
		async content(event, trigger, player) {
			player.$gain2(event.cards, false);
			await game.delayx();
			const useCardEvent = player.useCard(event.cards[0], event.targets[0], false);
			await useCardEvent;
			const cards = useCardEvent.cards.filterInD("d");
			if (cards.length) {
				const next = player.addToExpansion(cards, "gain2");
				next.gaintag.add("oldingxi");
				await next;
			}
		},
		intro: {
			content: "expansion",
			markcount: "expansion",
		},
		onremove(player, skill) {
			const cards = player.getExpansions(skill);
			if (cards.length) {
				player.loseToDiscardpile(cards);
			}
		},
		group: "oldingxi_biyue",
		subSkill: {
			biyue: {
				audio: "oldingxi",
				trigger: { player: "phaseJieshuBegin" },
				forced: true,
				locked: false,
				filter(event, player) {
					return player.countExpansions("oldingxi") > 0;
				},
				async content(event, trigger, player) {
					await player.draw(player.countExpansions("oldingxi"));
				},
			},
		},
	},
	olnengchen: {
		audio: 2,
		trigger: { player: "damageEnd" },
		filter(event, player) {
			return event.card && player.getExpansions("oldingxi").some(card => card.name === event.card.name);
		},
		forced: true,
		content() {
			const cards = player.getExpansions("oldingxi").filter(card => card.name === trigger.card.name);
			player.gain(cards.randomGet(), player, "give");
		},
		ai: { combo: "oldingxi" },
	},
	olhuojie: {
		audio: 2,
		trigger: { player: "phaseUseBegin" },
		filter(event, player) {
			return player.countExpansions("oldingxi") > game.players.length + game.dead.length;
		},
		forced: true,
		async content(event, trigger, player) {
			let num = player.getExpansions("oldingxi").length;
			while (num > 0) {
				num--;
				const next = player.executeDelayCardEffect("shandian");
				await next;
				if (player.hasHistory("damage", evt => evt.getParent(2) == next)) {
					const cards = player.getExpansions("oldingxi");
					if (cards.length) {
						await player.gain(cards, player, "give");
					}
					break;
				}
			}
		},
		ai: {
			combo: "oldingxi",
			neg: true,
		},
	},
	//刘协曹节
	//我们意念合一×2
	dcjuanlv: {
		audio: false,
		equipSkill: false,
		inherit: "cixiong_skill",
		filter(event, player) {
			return player.differentSexFrom(event.target);
		},
	},
	dcqixin: {
		enable: "phaseUse",
		filter(event, player) {
			return !player.storage.dcqixin_die;
		},
		manualConfirm: true,
		prompt() {
			const player = get.player();
			return "将性别变更为" + (player.storage["dcqixin"] ? "刘协--男" : "曹节--女");
		},
		async content(event, trigger, player) {
			player.changeZhuanhuanji("dcqixin");
			player.storage.dcqixin_hp[1 - Boolean(player.storage["dcqixin"])] = player.hp;
			const hp = player.storage.dcqixin_hp[0 + Boolean(player.storage["dcqixin"])];
			if (player.hp != hp) {
				await player.changeHp(hp - player.hp);
			}
			player.tempBanSkill(
				"dcqixin",
				{
					player: ["useCard1", "useSkillBegin", "phaseUseEnd"],
					global: ["phaseAfter", "phaseBeforeStart"],
				},
				false
			);
			const sex = player.storage["dcqixin"] ? "female" : "male";
			game.broadcastAll(
				(player, sex) => {
					player.sex = sex;
				},
				player,
				sex
			);
			game.log(player, "将性别变为了", "#y" + get.translation(sex) + "性");
		},
		mark: true,
		zhuanhuanji: true,
		markimage: "image/character/liuxie.jpg",
		init(player) {
			if (_status.gameStarted && !player.storage.dcqixin_hp) {
				player.storage.dcqixin_hp = [player.maxHp, player.maxHp];
			}
		},
		$zhuanhuanji(skill, player) {
			const image = player.storage[skill] ? "caojie" : "liuxie";
			const mark = player.marks[skill];
			if (mark) {
				mark.setBackground(image, "character");
			}
			player.changeSkin({ characterName: "liuxiecaojie" }, "liuxiecaojie" + (player.storage[skill] ? "_shadow" : ""));
		},
		intro: {
			content(storage, player) {
				const str = "当前性别：" + (!storage ? "刘协--男" : "曹节--女");
				const hp = player.storage.dcqixin_hp || [player.maxHp, player.maxHp];
				return player.storage.dcqixin_die
					? str
					: "<li>" + str + "<br><li>" + (storage ? "刘协" : "曹节") + "体力值：" + hp[1 - Boolean(storage)];
			},
		},
		ai: {
			order: 10,
			result: {
				player(player) {
					const cards = player.getCards("hs");
					const target = game
						.filterPlayer(i => i != player)
						.sort((a, b) => {
							return (
								cards
									.filter(j => player.canUse(j, b, true, true) && get.effect(b, j, player, player) > 0)
									.reduce((sum, card) => {
										return sum + get.effect(b, card, player, player);
									}, 0) -
								cards
									.filter(j => player.canUse(j, a, true, true) && get.effect(a, j, player, player) > 0)
									.reduce((sum, card) => {
										return sum + get.effect(a, card, player, player);
									}, 0)
							);
						})[0];
					return player.differentSexFrom(target) ? 0 : 1;
				},
			},
		},
		derivation: "dcqixin_faq",
		group: ["dcqixin_die", "dcqixin_mark"],
		subSkill: {
			die: {
				audio: "dcqixin",
				trigger: { player: "dieBefore" },
				filter(event, player) {
					return !player.storage.dcqixin_die && player.maxHp > 0;
				},
				forced: true,
				locked: false,
				content() {
					trigger.cancel();
					player.storage.dcqixin_die = true;
					player.changeZhuanhuanji("dcqixin");
					const sex = player.storage["dcqixin"] ? "female" : "male";
					game.broadcastAll(
						(player, sex) => {
							player.sex = sex;
						},
						player,
						sex
					);
					game.log(player, "将性别变为了", "#y" + get.translation(sex) + "性");
					player.storage.dcqixin_hp[1 - Boolean(player.storage["dcqixin"])] = player.hp;
					const hp = player.storage.dcqixin_hp[0 + Boolean(player.storage["dcqixin"])];
					if (player.hp != hp) {
						player.changeHp(hp - player.hp);
					}
				},
			},
			//双武将牌--梦回橙续缘双面武将
			mark: {
				charlotte: true,
				trigger: { global: "gameStart" },
				filter(event, player) {
					return !player.storage.dcqixin_hp;
				},
				forced: true,
				popup: false,
				firstDo: true,
				content() {
					player.storage.dcqixin_hp = [player.maxHp, player.maxHp];
				},
			},
		},
	},
	//五虎将
	//是的孩子们，我们意念合一
	olhuyi: {
		audio: 5,
		getList() {
			let list,
				skills = [];
			if (get.mode() == "guozhan") {
				list = [];
				for (const i in lib.characterPack.mode_guozhan) {
					if (lib.character[i]) {
						list.push(i);
					}
				}
			} else if (_status.connectMode) {
				list = get.charactersOL();
			} else {
				list = [];
				for (const i in lib.character) {
					if (lib.filter.characterDisabled2(i) || lib.filter.characterDisabled(i)) {
						continue;
					}
					list.push(i);
				}
			}
			const wuhu = ["关羽", "张飞", "赵云", "马超", "黄忠"],
				wuhuList = list.filter(character => {
					const names = get.characterSurname(character).map(name => name.join(""));
					return names.containsSome(...wuhu);
				});
			for (const i of wuhuList) {
				skills.addArray(
					(lib.character[i][3] || []).filter(skill => {
						const info = get.info(skill);
						return info && !info.zhuSkill && !info.hiddenSkill && !info.charlotte && !info.groupSkill && !info.limited && !info.juexingji;
					})
				);
			}
			return skills;
		},
		getBasic(event, player) {
			const name = event.card.name;
			return get
				.info("olhuyi")
				.getList()
				.filter(skill => {
					const translation = get.skillInfoTranslation(skill, player);
					if (!translation) {
						return false;
					}
					const info = get.plainText(translation);
					const reg = `【${get.translation(name)}】`;
					if (name == "sha") {
						for (let nature of lib.inpile_nature) {
							const reg1 = `【${get.translation(nature) + get.translation(name)}】`,
								reg2 = `${get.translation(nature)}【${get.translation(name)}】`;
							if (info.includes(reg1) || info.includes(reg2)) {
								return true;
							}
						}
					}
					return info.includes(reg);
				});
		},
		prioritySkills: [
			"boss_juejing",
			"xinlonghun",
			"relonghun",
			"sbwusheng",
			"jsrgnianen",
			"jsrgguanjue",
			"shencai",
			"sbpaoxiao",
			"sbliegong",
			"pshengwu",
		],
		trigger: {
			global: "phaseBefore",
			player: ["enterGame", "useCardAfter", "respondAfter"],
		},
		filter(event, player) {
			if (["useCard", "respond"].includes(event.name)) {
				if (get.type(event.card) != "basic") {
					return false;
				}
				if (
					!get
						.info("olhuyi")
						.getBasic(event, player)
						.some(skill => !player.hasSkill(skill, null, null, false))
				) {
					return false;
				}
				return !player.additionalSkills.olhuyi || (player.additionalSkills.olhuyi && player.additionalSkills.olhuyi.length < 5);
			}
			const skills = get.info("olhuyi").getList();
			return (event.name != "phase" || game.phaseNumber == 0) && skills.some(skill => !player.hasSkill(skill, null, null, false));
		},
		locked: false,
		async cost(event, trigger, player) {
			if (["useCard", "respond"].includes(trigger.name)) {
				event.result = { bool: true };
			} else {
				const skills = get
					.info(event.skill)
					.getList()
					.filter(skill => !player.hasSkill(skill, null, null, false))
					.randomGets(3);
				const list = [];
				for (const skill of skills) {
					list.push([
						skill,
						'<div class="popup text" style="width:calc(100% - 10px);display:inline-block"><div class="skill">【' +
							get.translation(skill) +
							"】</div><div>" +
							lib.translate[skill + "_info"] +
							"</div></div>",
					]);
				}
				const next = player.chooseButton(["虎翼：请选择获得其中一个技能", [list, "textbutton"]]);
				next.set("forced", true);
				next.set("ai", button => {
					const skill = button.link,
						choice = get.event().choice;
					if (get.info("olhuyi").prioritySkills.includes(skill)) {
						return 3;
					}
					if (skill == choice) {
						return 2;
					}
					return 1;
				});
				next.set(
					"choice",
					skills.sort((a, b) => {
						return get.skillRank(b, "in") - get.skillRank(a, "in");
					})[0]
				);
				const { links } = await next.forResult();
				event.result = { bool: true, cost_data: links };
			}
		},
		async content(event, trigger, player) {
			const skill = ["useCard", "respond"].includes(trigger.name)
				? get
						.info("olhuyi")
						.getBasic(trigger, player)
						.filter(skill => !player.hasSkill(skill, null, null, false))
						.randomGets(1)
				: event.cost_data;
			player.addAdditionalSkills("olhuyi", skill, true);
		},
		group: "olhuyi_remove",
		subSkill: {
			remove: {
				audio: "olhuyi",
				trigger: { player: "phaseEnd" },
				filter(event, player) {
					return player.additionalSkills?.olhuyi?.length;
				},
				async cost(event, trigger, player) {
					const skills = player.additionalSkills.olhuyi;
					const list = [];
					for (const skill of skills) {
						list.push([
							skill,
							'<div class="popup text" style="width:calc(100% - 10px);display:inline-block"><div class="skill">【' +
								get.translation(skill) +
								"】</div><div>" +
								lib.translate[skill + "_info"] +
								"</div></div>",
						]);
					}
					const next = player.chooseButton([
						'###虎翼###<div class="text center">你可以失去其中一个技能，然后观看一名牌堆顶三张牌并获得其中一张</div>',
						[list, "textbutton"],
					]);
					next.set("ai", button => {
						const player = get.player();
						const skill = button.link;
						let skills = get.event().skills.slice(0);
						skills.removeArray(get.info("olhuyi").prioritySkills);
						if (skills.length < 4) {
							return 0;
						}
						if (skills.includes(skill)) {
							return 2;
						}
						return Math.random();
					});
					next.set("skills", skills);
					const { bool, links } = await next.forResult();
					event.result = {
						bool: bool,
						cost_data: links,
					};
				},
				async content(event, trigger, player) {
					player.changeSkills([], event.cost_data).set("$handle", (player, addSkills, removeSkills) => {
						game.log(
							player,
							"失去了技能",
							...removeSkills.map(i => {
								return "#g【" + get.translation(i) + "】";
							})
						);
						player.removeSkill(removeSkills);
						const additionalSkills = player.additionalSkills.olhuyi;
						additionalSkills.removeArray(removeSkills);
						if (!additionalSkills.length) {
							delete player.additionalSkills.olhuyi;
						}
					});
					const cards = get.cards(3, true);
					const { links: gains } = await player
						.chooseButton(["虎翼：选择获得其中一张牌", cards], true)
						.set("ai", button => get.value(button.link))
						.forResult();
					if (gains?.length) {
						await player.gain(gains, "draw");
					}
				},
			},
		},
	},
	//无名
	dcchushan: {
		trigger: {
			global: "phaseBefore",
			player: "enterGame",
		},
		filter(event, player) {
			return event.name != "phase" || game.phaseNumber == 0;
		},
		forced: true,
		async content(event, trigger, player) {
			if (!_status.characterlist) {
				game.initCharacterList();
			}
			_status.characterlist.randomSort();
			let characters = [];
			for (let i = 0; i < _status.characterlist.length; i++) {
				if (
					get.character(_status.characterlist[i], 3).some(skill => {
						return lib.skill[skill] && !lib.skill[skill].charlotte;
					})
				) {
					characters.push(_status.characterlist[i]);
					if (characters.length >= 6) {
						break;
					}
				}
			}
			if (characters.length < 2) {
				return;
			}
			const first = characters.slice(0, characters.length / 2),
				last = characters.slice(characters.length / 2, 6);
			const skills1 = [],
				skills2 = [];
			for (let i of first) {
				skills1.push(
					get
						.character(i, 3)
						.filter(skill => {
							return lib.skill[skill] && !lib.skill[skill].charlotte;
						})
						.randomGet()
				);
			}
			for (let i of last) {
				skills2.push(
					get
						.character(i, 3)
						.filter(skill => {
							return lib.skill[skill] && !lib.skill[skill].charlotte;
						})
						.randomGet()
				);
			}
			const result1 = await player
				.chooseControl(skills1)
				.set("dialog", ["无名：请选择姓氏", [first, "character"]])
				.forResult();
			const gains = [];
			let surname = first[skills1.indexOf(result1.control)];
			gains.add(result1.control);
			const result2 = await player
				.chooseControl(skills2)
				.set("dialog", ["无名：请选择名字", [last, "character"]])
				.forResult();
			let name = last[skills2.indexOf(result2.control)];
			gains.add(result2.control);
			let newname = get.characterSurname(surname).randomGet()[0] + get.characterSurname(name).randomGet()[1];
			if (newname === "某") {
				newname = "无名氏";
				player.chat("终究还是落得藉藉无名...");
			}
			game.broadcastAll(
				(player, name, list) => {
					if (player.name == "dc_noname" || player.name1 == "dc_noname") {
						player.node.name.innerHTML = name;
					}
					if (player.name2 == "dc_noname") {
						player.node.name2.innerHTML = name;
					}
					player.tempname.addArray(
						list.map(name => {
							while (get.character(name).tempname.length > 0) {
								name = get.character(name).tempname[0];
							}
							return name;
						})
					);
				},
				player,
				newname,
				[surname, name]
			);
			await player.addSkills(gains);
		},
	},
	//会玩孙权
	dchuiwan: {
		audio: 2,
		trigger: { player: "drawBegin" },
		filter(event, player) {
			return lib.skill.dchuiwan.gainCards(player)?.length;
		},
		gainCards(player) {
			const cards = Array.from(ui.cardPile.childNodes).slice(0);
			const list = [];
			for (const card of cards) {
				const name = get.name(card);
				const type = get.type(card);
				if (type != "basic" && type != "trick") {
					continue;
				}
				if (!player.getStorage("dchuiwan_used").includes(name)) {
					list.add(name);
				}
			}
			return list;
		},
		async cost(event, trigger, player) {
			let result = await player
				.chooseButton([get.prompt2(event.skill), [get.info(event.skill).gainCards(player), "vcard"]], [1, trigger.num])
				.set("ai", button => {
					if (!get.cardPile2(button.link[2])) {
						return 0;
					}
					return get.value({ name: button.link[2] }, get.event().player);
				})
				.forResult();
			if (result.bool) {
				result.cost_data = result.links;
			}
			event.result = result;
		},
		async content(event, trigger, player) {
			trigger.num -= event.cost_data.length;
			if (!player.storage.dchuiwan_used) {
				player.when({ global: "phaseAfter" }).step(async () => delete player.storage.dchuiwan_used);
			}
			player.markAuto(
				"dchuiwan_used",
				event.cost_data.map(name => name[2])
			);
			let list = [];
			for (const name of event.cost_data) {
				const card = get.cardPile2(name[2]);
				if (card) {
					list.push(card);
				}
			}
			if (list.length) {
				await player.gain(list, "gain2");
			} else {
				player.chat("无牌可得？！");
			}
		},
	},
	dchuanli: {
		audio: 2,
		trigger: { player: "phaseJieshuBegin" },
		filter(event, player) {
			return (
				player.getHistory("useCard", evt => {
					return (evt.targets || []).includes(player);
				}).length >= 3 ||
				game.hasPlayer(target => {
					if (target == player) {
						return false;
					}
					return (
						player.getHistory("useCard", evt => {
							return (evt.targets || []).includes(target);
						}).length >= 3
					);
				})
			);
		},
		direct: true,
		async content(event, trigger, player) {
			let zhangzhang = false,
				zhouyu = false;
			if (
				player.getHistory("useCard", evt => {
					return (evt.targets || []).includes(player);
				}).length >= 3
			) {
				const result = await player
					.chooseTarget(
						get.prompt("dchuanli"),
						"令一名其他角色的所有技能失效，然后令其获得〖直谏〗和〖固政〗直到其回合结束",
						(card, player, target) => {
							return target != player && !target.hasSkill("dchuanli_zhangzhang");
						}
					)
					.set("ai", target => {
						const player = get.event().player;
						return (
							get.rank("zhangzhang", true) -
							["name", "name1", "name2"].reduce((sum, name) => {
								if (!target[name] || !lib.character[target[name]] || (name == "name1" && target.name1 == target.name)) {
									return sum;
								}
								return sum + get.rank(target[name], true);
							}, 0)
						);
					})
					.forResult();
				if (result.bool) {
					zhangzhang = true;
					const target = result.targets[0];
					await player.logSkill("dchuanli", target);
					target.addTempSkill("dchuanli_zhangzhang", { player: "phaseAfter" });
					target.markSkillCharacter("dchuanli_zhangzhang", "zhangzhang", "唤理-内事", "内事不决问张昭");
					await target.addAdditionalSkills("dchuanli_zhangzhang", ["zhijian", "guzheng"]);
				}
			}
			const targets = game.filterPlayer(target => {
				if (target == player || target.hasSkill("dchuanli_zhouyu")) {
					return false;
				}
				return (
					player.getHistory("useCard", evt => {
						return (evt.targets || []).includes(target);
					}).length >= 3
				);
			});
			if (targets.length) {
				const result = await player
					.chooseTarget(
						get.prompt("dchuanli"),
						"令一名其他角色的所有技能失效，然后令其获得〖英姿〗和〖反间〗直到其回合结束",
						(card, player, target) => {
							return get.event().targets.includes(target);
						}
					)
					.set("ai", target => {
						const player = get.event().player;
						return (
							get.rank("re_zhouyu", true) -
							["name", "name1", "name2"].reduce((sum, name) => {
								if (!target[name] || !lib.character[target[name]] || (name == "name1" && target.name1 == target.name)) {
									return sum;
								}
								return sum + get.rank(target[name], true);
							}, 0)
						);
					})
					.set("targets", targets)
					.forResult();
				if (result.bool) {
					zhouyu = true;
					const target = result.targets[0];
					await player.logSkill("dchuanli", target);
					target.addTempSkill("dchuanli_zhouyu", { player: "phaseAfter" });
					target.markSkillCharacter("dchuanli_zhouyu", "re_zhouyu", "唤理-外事", "外事不决问周瑜");
					await target.addAdditionalSkills("dchuanli_zhouyu", ["reyingzi", "refanjian"]);
				}
			}
			if (zhangzhang && zhouyu) {
				await player.logSkill("dchuanli");
				if (player.storage.dchuanli_sunquan) {
					delete player.storage.dchuanli_sunquan;
				}
				await player.addAdditionalSkills("dchuanli_sunquan", "rezhiheng");
				player.addSkill("dchuanli_sunquan");
			}
		},
		subSkill: {
			zhangzhang: {
				init(player, skill) {
					player.addSkillBlocker(skill);
				},
				onremove(player, skill) {
					player.removeSkillBlocker(skill);
					player.removeAdditionalSkills(skill);
				},
				charlotte: true,
				skillBlocker(skill) {
					if (lib.skill[skill].persevereSkill) {
						return false;
					}
					return !["zhijian", "guzheng"].includes(skill) && skill != "dchuanli_zhangzhang" && !lib.skill[skill].charlotte;
				},
			},
			zhouyu: {
				init(player, skill) {
					player.addSkillBlocker(skill);
				},
				onremove(player, skill) {
					player.removeSkillBlocker(skill);
					player.removeAdditionalSkills(skill);
				},
				charlotte: true,
				skillBlocker(skill) {
					if (lib.skill[skill].persevereSkill) {
						return false;
					}
					return !["reyingzi", "refanjian"].includes(skill) && skill != "dchuanli_zhouyu" && !lib.skill[skill].charlotte;
				},
			},
			sunquan: {
				charlotte: true,
				onremove(player, skill) {
					delete player.storage[skill];
				},
				trigger: { player: "phaseAfter" },
				forced: true,
				popup: false,
				async content(event, trigger, player) {
					if (!player.storage.dchuanli_sunquan) {
						player.storage.dchuanli_sunquan = true;
					} else {
						await player.removeAdditionalSkills("dchuanli_sunquan");
						player.removeSkill("dchuanli_sunquan");
					}
				},
			},
		},
		derivation: ["zhijian", "guzheng", "reyingzi", "refanjian", "rezhiheng"],
	},
	//屈原
	dcqiusuo: {
		audio: 2,
		trigger: {
			source: "damageSource",
			player: "damageEnd",
		},
		frequent: true,
		async content(event, trigger, player) {
			const tiesuo = get.cardPile("tiesuo");
			if (tiesuo) {
				await player.gain(tiesuo, "gain2");
			}
		},
	},
	dclisao: {
		audio: 2,
		enable: "phaseUse",
		filterTarget: true,
		selectTarget: [1, 2],
		usable: 1,
		multitarget: true,
		multiline: true,
		async content(event, trigger, player) {
			let targets = event.targets.sortBySeat();
			//处理问题
			let answer_ok = undefined,
				answered = targets.slice(),
				gaifa = targets.slice(); //该罚
			let question = [];
			const sentences = _status.lisao_text.randomGets(2).randomSort();
			const goon = Math.round(Math.random());
			question.addArray([
				"请回答《离骚》中“" + sentences[0].split("，")[goon] + "”的" + (goon ? "上" : "下") + "句",
				[sentences[0].split("，")[1 - goon], sentences[1].split("，")[1 - goon]].randomSort(),
			]);
			//人类和AI
			//AI随机排序一下，模拟不同顺序回答
			let humans = targets.filter(current => current === game.me || current.isOnline());
			let locals = targets.slice(0).randomSort();
			locals.removeArray(humans);
			const eventId = get.id();
			const send = (question, current, eventId) => {
				lib.skill.dclisao.chooseControl(question, current, eventId);
				game.resume();
			};
			//让读条不消失并显示读条
			event._global_waiting = true;
			let time = 10000;
			if (lib.configOL && lib.configOL.choose_timeout) {
				time = parseInt(lib.configOL.choose_timeout) * 1000;
			}
			targets.forEach(current => current.showTimer(time));
			//先处理人类玩家
			if (humans.length > 0) {
				const solve = function (resolve, reject) {
					return function (result, player) {
						if (result && result.control && !answer_ok) {
							answered.remove(player);
							if (result.control == sentences[0].split("，")[1 - goon]) {
								resolve();
								player.popup("回答正确", "wood");
								game.log(player, "回答正确");
								answer_ok = player;
								gaifa.remove(player);
							} else {
								reject();
								player.popup("回答错误", "fire");
								game.log(player, "回答错误");
							}
						} else {
							reject();
						}
					};
				};
				//等待第一位回答正确（兑现Promise）的玩家，若回答错误（Promise被拒绝）则继续等待
				await Promise.any(
					humans.map(current => {
						return new Promise((resolve, reject) => {
							if (current.isOnline()) {
								current.send(send, question, current, eventId);
								current.wait(solve(resolve, reject));
							} else {
								const next = lib.skill.dclisao.chooseControl(question, current, eventId);
								const solver = solve(resolve, reject);
								if (_status.connectMode) {
									game.me.wait(solver);
								}
								return next.forResult().then(result => {
									if (_status.connectMode && !answer_ok) {
										game.me.unwait(result, current);
									} else {
										solver(result, current);
									}
								});
							}
						});
					})
				).catch(() => {});
				game.broadcastAll("cancel", eventId);
			}
			//再处理单机的他人控制玩家/AI玩家
			if (!answer_ok && locals.length > 0) {
				for (const current of locals) {
					const result = await lib.skill.dclisao.chooseControl(question, current).forResult();
					if (result && result.control) {
						answered.remove(current);
						if (result.control == sentences[0].split("，")[1 - goon]) {
							current.popup("回答正确", "wood");
							game.log(current, "回答正确");
							answer_ok = current;
							gaifa.remove(current);
							break;
						} else {
							current.popup("回答错误", "fire");
							game.log(current, "回答错误");
						}
					}
				}
			}
			//清除读条
			delete event._global_waiting;
			for (const i of targets) {
				i.hideTimer();
				if (answered.includes(i)) {
					i.popup("未回答");
					game.log(i, "未进行回答");
				}
			}
			await game.delay();
			//处理结果
			if (answer_ok && answer_ok.countCards("h")) {
				await answer_ok.showHandcards();
			}
			if (gaifa.length) {
				for (const i of gaifa) {
					i.addTempSkill("dclisao_gaifa");
					i.markAuto("dclisao_gaifa", [player]);
				}
				await game.delay();
			}
		},
		chooseControl(question, current, eventId) {
			const next = current.chooseControl(question[1]);
			next.set("prompt", question[0]);
			next.set("id", eventId);
			next.set("_global_waiting", true);
			next.set("ai", () => Math.round(Math.random()));
			return next;
		},
		init() {
			//《离骚》（高中节选）
			if (!_status.lisao_text) {
				let text =
					"长太息以掩涕兮，哀民生之多艰。余虽好修姱以鞿羁兮，謇朝谇而夕替。既替余以蕙纕兮，又申之以揽茝。亦余心之所善兮，虽九死其犹未悔。怨灵修之浩荡兮，终不察夫民心。众女嫉余之蛾眉兮，谣诼谓余以善淫。固时俗之工巧兮，偭规矩而改错。背绳墨以追曲兮，竞周容以为度。忳郁邑余侘傺兮，吾独穷困乎此时也。宁溘死以流亡兮，余不忍为此态也。鸷鸟之不群兮，自前世而固然。何方圜之能周兮，夫孰异道而相安。屈心而抑志兮，忍尤而攘诟。伏清白以死直兮，固前圣之所厚。悔相道之不察兮，延伫乎吾将反。回朕车以复路兮，及行迷之未远。步余马于兰皋兮，驰椒丘且焉止息。进不入以离尤兮，退将复修吾初服。制芰荷以为衣兮，集芙蓉以为裳。不吾知其亦已兮，苟余情其信芳。高余冠之岌岌兮，长余佩之陆离。芳与泽其杂糅兮，唯昭质其犹未亏。忽反顾以游目兮，将往观乎四荒。佩缤纷其繁饰兮，芳菲菲其弥章。民生各有所乐兮，余独好修以为常。虽体解吾犹未变兮，岂余心之可惩。";
				_status.lisao_text = text.slice(0, -1).split("。");
			}
		},
		ai: {
			order: 10,
			result: {
				target(player, target) {
					if (player === target) {
						if (ui.selected.targets.length) {
							return 8;
						}
						return 0;
					}
					if (target.getStorage("dclisao_gaifa").includes(player)) {
						return 0;
					}
					if (get.damageEffect(target, player, player) < 0 && get.attitude(player, target) > 0) {
						return 0;
					}
					let cards = player.getCards("hs", card => get.tag(card, "damage") && get.effect(target, card, player, player) > 0);
					if (!cards.length) {
						return 0;
					}
					let cardx = cards.filter(card => get.name(card) == "sha");
					cardx.sort((a, b) => get.effect(target, b, player, player) - get.effect(target, a, player, player));
					cardx = cardx.slice(Math.min(cardx.length, player.getCardUsable("sha")), cardx.length);
					cards.removeArray(cardx);
					return (
						cards.reduce((sum, card) => {
							if (player.canUse(card, target)) {
								return sum + get.effect(target, card, player, target);
							}
							if (player.canUse(card, target, false)) {
								return sum + get.effect(target, card, player, target) / 10;
							}
							return 0;
						}, 0) - 10
					);
				},
			},
		},
		subSkill: {
			gaifa: {
				charlotte: true,
				onremove: true,
				trigger: {
					global: "useCard",
					player: "damageBegin3",
				},
				filter(event, player) {
					const targets = player.getStorage("dclisao_gaifa");
					return event.name != "useCard" || targets.includes(event.player);
				},
				forced: true,
				popup: false,
				async content(event, trigger, player) {
					const targets = player.getStorage("dclisao_gaifa");
					if (trigger.name == "useCard") {
						trigger.directHit.add(player);
					} else {
						trigger.num = trigger.num * (targets.length + 1);
					}
				},
				mark: true,
				marktext: "江",
				intro: {
					markcount: () => 0,
					content(storage) {
						return "<li>无法响应" + get.translation(storage) + "使用的牌<br><li>受到的伤害翻" + storage.length + "倍";
					},
				},
			},
		},
	},
	//名将吴懿
	dcbenxi: {
		trigger: {
			player: ["loseAfter"],
			global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"],
		},
		forced: true,
		zhuanhuanji: true,
		filter(event, player) {
			const evt = event.getl(player);
			return evt && evt.hs && evt.hs.length > 0;
		},
		async content(event, trigger, player) {
			player.changeZhuanhuanji("dcbenxi");
			if (player.storage.dcbenxi) {
				const map = lib.skill.dcbenxi.getMap(),
					list = Object.keys(map);
				if (list.length > 0) {
					const skill = list.randomGet(),
						voiceMap = get.Audio.skill({ skill, player: map[skill] }).audioList;
					player.storage.dcbenxi_pending = skill;
					findaudio: for (let data of voiceMap) {
						if (!data.text) {
							continue;
						}
						const pinyins = get.pinyin(data.text, false);
						for (let i = 0; i < pinyins.length - 1; i++) {
							if (pinyins[i] === "wu" && pinyins[i + 1] === "yi") {
								player.chat(data.text);
								game.broadcastAll(file => game.playAudio(file), data.file);
								break findaudio;
							}
						}
					}
				}
			} else {
				const skill = player.storage.dcbenxi_pending;
				if (skill) {
					if (player.hasSkill(skill, null, false)) {
						const targets = game.filterPlayer(current => current != player).sortBySeat();
						player.line(targets, "fire");
						for (let target of targets) {
							if (target.isIn()) {
								await target.damage();
							}
						}
					} else {
						await player.addTempSkills([skill], { player: "phaseBegin" });
					}
					delete player.storage.dcbenxi_pending;
				}
			}
			player.markSkill(event.name);
		},
		onremove(player) {
			delete player.storage.dcbenxi;
			delete player.storage.dcbenxi_pending;
		},
		mark: true,
		marktext: "☯",
		intro: {
			mark(dialog, storage, player) {
				if (storage) {
					const skill = player.storage.dcbenxi_pending;
					if (skill) {
						dialog.addText(
							`锁定技，当你下次失去手牌后，你获得技能〖${get.translation(skill)}〗直到你的下回合开始。若已获得该技能，则改为对所有其他角色各造成1点伤害。`,
							false
						);
						dialog.add(
							'<div><div class="skill">【' +
								get.translation(lib.translate[skill + "_ab"] || get.translation(skill).slice(0, 2)) +
								"】</div><div>" +
								get.skillInfoTranslation(skill, player, false) +
								"</div></div>"
						);
					}
				} else {
					return "锁定技。当你下次失去手牌后，你随机念出一句拼音中含有“wu,yi”的台词。";
				}
			},
		},
		getMap() {
			if (!_status.dcbenxi_map) {
				_status.dcbenxi_map = {};
				let list;
				if (_status.connectMode) {
					list = get.charactersOL();
				} else {
					list = get.gainableCharacters();
				}
				list.forEach(name => {
					if (name !== "dc_wuyi") {
						const skills = get.character(name, 3);
						skills.forEach(skill => {
							const info = get.info(skill);
							if (!info || (info.ai && info.ai.combo)) {
								return;
							}
							if (skill in _status.dcbenxi_map) {
								return;
							}
							const voices = get.Audio.skill({ skill, name }).textList;
							if (
								voices.some(text => {
									const pinyins = get.pinyin(text, false);
									for (let i = 0; i < pinyins.length - 1; i++) {
										if (pinyins[i] === "wu" && pinyins[i + 1] === "yi") {
											return true;
										}
									}
									return false;
								})
							) {
								_status.dcbenxi_map[skill] = name;
							}
						});
					}
				});
			}
			return _status.dcbenxi_map;
		},
	},
	//新InitFilter测试高达一号
	//打赢复活赛的牢达[哭]
	dclonghun: {
		audio: 2,
		mod: {
			aiOrder(player, card, num) {
				if (num <= 0 || !player.isPhaseUsing() || player.needsToDiscard() < 2) {
					return num;
				}
				let suit = get.suit(card, player);
				if (suit === "heart") {
					return num - 3.6;
				}
			},
			aiValue(player, card, num) {
				if (num <= 0) {
					return num;
				}
				let suit = get.suit(card, player);
				if (suit === "heart") {
					return num + 3.6;
				}
				if (suit === "club") {
					return num + 1;
				}
				if (suit === "spade") {
					return num + 1.8;
				}
			},
			aiUseful(player, card, num) {
				if (num <= 0) {
					return num;
				}
				let suit = get.suit(card, player);
				if (suit === "heart") {
					return num + 3;
				}
				if (suit === "club") {
					return num + 1;
				}
				if (suit === "spade") {
					return num + 1;
				}
			},
		},
		locked: false,
		enable: ["chooseToUse", "chooseToRespond"],
		prompt: "将♦牌当做火【杀】，♥牌当做【桃】，♣牌当做【闪】，♠牌当做【无懈可击】使用或打出",
		viewAs(cards, player) {
			var name;
			var nature = null;
			switch (get.suit(cards[0], player)) {
				case "club":
					name = "shan";
					break;
				case "diamond":
					name = "sha";
					nature = "fire";
					break;
				case "spade":
					name = "wuxie";
					break;
				case "heart":
					name = "tao";
					break;
			}
			if (name) {
				return { name: name, nature: nature };
			}
			return null;
		},
		check(card) {
			var player = _status.event.player;
			if (_status.event.type == "phase") {
				var max = 0;
				var name2;
				var list = ["sha", "tao"];
				var map = { sha: "diamond", tao: "heart" };
				for (var i = 0; i < list.length; i++) {
					var name = list[i];
					if (
						player.countCards("hes", function (card) {
							return (name != "sha" || get.value(card) < 5) && get.suit(card, player) == map[name];
						}) > 0 &&
						player.getUseValue({
							name: name,
							nature: name == "sha" ? "fire" : null,
						}) > 0
					) {
						var temp = get.order({
							name: name,
							nature: name == "sha" ? "fire" : null,
						});
						if (temp > max) {
							max = temp;
							name2 = map[name];
						}
					}
				}
				if (name2 == get.suit(card, player)) {
					return name2 == "diamond" ? 5 - get.value(card) : 20 - get.value(card);
				}
				return 0;
			}
			return 1;
		},
		position: "hes",
		filterCard(card, player, event) {
			event = event || _status.event;
			var filter = event._backup.filterCard;
			var name = get.suit(card, player);
			if (name == "club" && filter({ name: "shan", cards: [card] }, player, event)) {
				return true;
			}
			if (name == "diamond" && filter({ name: "sha", cards: [card], nature: "fire" }, player, event)) {
				return true;
			}
			if (name == "spade" && filter({ name: "wuxie", cards: [card] }, player, event)) {
				return true;
			}
			if (name == "heart" && filter({ name: "tao", cards: [card] }, player, event)) {
				return true;
			}
			return false;
		},
		filter(event, player) {
			var filter = event.filterCard;
			if (filter(get.autoViewAs({ name: "sha", nature: "fire" }, "unsure"), player, event) && player.countCards("hes", { suit: "diamond" })) {
				return true;
			}
			if (filter(get.autoViewAs({ name: "shan" }, "unsure"), player, event) && player.countCards("hes", { suit: "club" })) {
				return true;
			}
			if (filter(get.autoViewAs({ name: "tao" }, "unsure"), player, event) && player.countCards("hes", { suit: "heart" })) {
				return true;
			}
			if (filter(get.autoViewAs({ name: "wuxie" }, "unsure"), player, event) && player.countCards("hes", { suit: "spade" })) {
				return true;
			}
			return false;
		},
		usable: 20,
		ai: {
			respondSha: true,
			respondShan: true,
			skillTagFilter(player, tag) {
				if ((player.getStat("skill").dclonghun || 0) >= 20) {
					return false;
				}
				var name;
				switch (tag) {
					case "respondSha":
						name = "diamond";
						break;
					case "respondShan":
						name = "club";
						break;
					case "save":
						name = "heart";
						break;
				}
				if (!player.countCards("hes", { suit: name })) {
					return false;
				}
			},
			order(item, player) {
				if (player && _status.event.type == "phase") {
					var max = 0;
					var list = ["sha", "tao"];
					var map = { sha: "diamond", tao: "heart" };
					for (var i = 0; i < list.length; i++) {
						var name = list[i];
						if (
							player.countCards("hes", function (card) {
								return (name != "sha" || get.value(card) < 5) && get.suit(card, player) == map[name];
							}) > 0 &&
							player.getUseValue({
								name: name,
								nature: name == "sha" ? "fire" : null,
							}) > 0
						) {
							var temp = get.order({
								name: name,
								nature: name == "sha" ? "fire" : null,
							});
							if (temp > max) {
								max = temp;
							}
						}
					}
					max /= 1.1;
					return max;
				}
				return 2;
			},
		},
		hiddenCard(player, name) {
			if ((player.getStat("skill").dclonghun || 0) >= 20) {
				return false;
			}
			if (name == "wuxie" && _status.connectMode && player.countCards("hes") > 0) {
				return true;
			}
			if (name == "wuxie") {
				return player.countCards("hes", { suit: "spade" }) > 0;
			}
			if (name == "tao") {
				return player.countCards("hes", { suit: "heart" }) > 0;
			}
		},
	},
	dczhanjiang: {
		trigger: { player: "phaseZhunbeiBegin" },
		filter(event, player) {
			return game.hasPlayer(target => {
				return target.countCards("ej", card => get.name(card, false) == "qinggang" || get.name(card, get.owner(card)) == "qinggang");
			});
		},
		content() {
			let cards = [],
				targets = game.filterPlayer(target => {
					return target.countCards("ej", card => get.name(card, false) == "qinggang" || get.name(card, get.owner(card)) == "qinggang");
				});
			targets.forEach(target =>
				cards.addArray(target.getCards("ej", card => get.name(card, false) == "qinggang" || get.name(card, get.owner(card)) == "qinggang"))
			);
			player.gain(cards, "give");
		},
	},
	//孙策
	//双壁=100%技能周瑜+100%原画孙策
	dcshuangbi: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		async content(event, trigger, player) {
			var num = game.countPlayer();
			var result = await player
				.chooseControl()
				.set("choiceList", [
					"摸" + get.cnNumber(num) + "张牌，本回合手牌上限+" + parseFloat(num),
					"弃置至多" + get.cnNumber(num) + "张牌，随机对其他角色造成等量火焰伤害",
					"视为使用" + get.cnNumber(num) + "张火【杀】或【火攻】",
				])
				.set("ai", () => {
					var player = _status.event.player,
						card = { name: "sha", nature: "fire" };
					if (!game.hasPlayer(target => player.canUse(card, target) && get.effect(target, card, player, player) > 0)) {
						return 0;
					}
					return 2;
				})
				.forResult();
			player.flashAvatar("dcshuangbi", ["re_zhouyu", "shen_zhouyu", "dc_sb_zhouyu"][result.index]);
			switch (result.index) {
				case 0:
					player.draw(num);
					player.addTempSkill("dcshuangbi_effect");
					player.addMark("dcshuangbi_effect", num, false);
					break;
				case 1:
					var result2 = await player
						.chooseToDiscard("双壁：弃置至多" + get.cnNumber(num) + "张牌，随机对其他角色造成等量火焰伤害", [1, num], "he")
						.set("ai", card => 1 / (get.value(card) || 0.5))
						.forResult();
					if (result2.bool) {
						var map = {},
							sum = result2.cards.length;
						var targets = game.filterPlayer(target => target != player);
						if (targets.length) {
							while (sum) {
								sum--;
								var target = targets.randomGet();
								player.line(target);
								target.damage(1, "fire");
								game.delayx();
							}
						}
					}
					break;
				case 2:
					while (
						num &&
						game.hasPlayer(target => player.canUse({ name: "sha", nature: "fire" }, target) || player.canUse({ name: "huogong" }, target))
					) {
						num--;
						var list = [];
						if (game.hasPlayer(target => player.canUse({ name: "sha", nature: "fire" }, target))) {
							list.push(["基本", "", "sha", "fire"]);
						}
						if (game.hasPlayer(target => player.canUse({ name: "huogong" }, target))) {
							list.push(["锦囊", "", "huogong"]);
						}
						var result2 = await player
							.chooseButton(["双壁：请选择你要使用的牌", [list, "vcard"]], true)
							.set("ai", button => (button.link[2] == "sha" ? 1 : 0))
							.forResult();
						if (result2.bool) {
							var card = {
								name: result2.links[0][2],
								nature: result2.links[0][3],
							};
							await player.chooseUseTarget(true, card, false);
						} else {
							break;
						}
					}
					break;
			}
		},
		ai: {
			order: 9,
			result: { player: 1 },
		},
		subSkill: {
			effect: {
				charlotte: true,
				onremove: true,
				intro: { content: "手牌上限+#" },
				mod: {
					maxHandcard(player, num) {
						return num + player.countMark("dcshuangbi_effect");
					},
				},
			},
		},
	},
	//哪吒
	dcsantou: {
		audio: 2,
		trigger: { player: "damageBegin4" },
		forced: true,
		async content(event, trigger, player) {
			var source = trigger.source;
			trigger.cancel();
			var hp = player.getHp();
			var lose = false;
			if (hp >= 3) {
				if (
					player.hasHistory("useSkill", evt => {
						var evtx = evt.event;
						return evt.skill == "dcsantou" && evtx.getTrigger().source == source && evtx.getParent(2) != trigger;
					})
				) {
					lose = true;
				}
			} else if (hp == 2) {
				if (trigger.hasNature()) {
					lose = true;
				}
			} else if (hp == 1) {
				if (trigger.card && get.color(trigger.card) == "red") {
					lose = true;
				}
			}
			if (lose) {
				player.loseHp();
			}
		},
		ai: {
			filterDamage: true,
			skillTagFilter(player, tag, arg) {
				if (arg && arg.player && arg.player.hasSkillTag("jueqing", false, player)) {
					return false;
				}
			},
			effect: {
				target(card, player, target) {
					if (player.hasSkillTag("jueqing", false, target)) {
						return;
					}
					if (player._dcsantou_temp) {
						return;
					}
					if (get.tag(card, "damage")) {
						const hp = target.getHp();
						player._dcsantou_temp = true;
						const losehp = get.effect(target, { name: "losehp" }, target, target) / get.attitude(target, target);
						delete player._dcsantou_temp;
						if (hp >= 3) {
							if (target.hasHistory("useSkill", evt => evt.skill == "dcsantou" && evt.event.getTrigger().source == player)) {
								return [0, losehp, 0, 0];
							} else if (get.attitude(player, target) < 0) {
								let hs = player.getCards("hs", i => {
										return i !== card && (!card.cards || !card.cards.includes(i));
									}),
									num = player.getCardUsable("sha");
								if (card.name === "sha") {
									num--;
								}
								hs = hs.filter(i => {
									if (!player.canUse(i, target)) {
										return false;
									}
									if (get.tag(card, "damage") && get.name(i, player) !== "sha") {
										return true;
									}
									if (num) {
										num--;
										return true;
									}
									return false;
								}).length;
								if (
									player.hasSkillTag("damage", null, {
										target: target,
									})
								) {
									hs++;
								}
								if (!hs) {
									return "zeroplayertarget";
								}
								num = 1 - 2 / 3 / hs;
								return [num, 0, num, 0];
							}
						}
						if ((hp == 2 && get.tag(card, "natureDamage")) || (hp == 1 && typeof card == "object" && get.color(card) == "red")) {
							return [0, losehp, 0, 0];
						}
						return "zeroplayertarget";
					}
				},
			},
		},
	},
	dcfaqi: {
		audio: 2,
		trigger: { player: "useCardAfter" },
		filter(event, player) {
			if (get.type(event.card) != "equip") {
				return false;
			}
			if (!player.isPhaseUsing()) {
				return false;
			}
			for (const name of lib.inpile) {
				if (get.type(name) != "trick") {
					continue;
				}
				if (!player.hasStorage("dcfaqi", name) && player.hasUseTarget({ name: name, isCard: true })) {
					return true;
				}
			}
			return false;
		},
		direct: true,
		async content(event, trigger, player) {
			var list = get.inpileVCardList(info => {
				if (info[0] != "trick") {
					return false;
				}
				var name = info[2];
				return !player.hasStorage("dcfaqi", name) && player.hasUseTarget({ name: name, isCard: true });
			});
			if (list.length) {
				var result = await player
					.chooseButton(["法器：视为使用一张普通锦囊牌", [list, "vcard"]], true)
					.set("ai", button => {
						return get.player().getUseValue({ name: button.link[2] });
					})
					.forResult();
				if (result.bool) {
					var name = result.links[0][2];
					if (!player.storage.dcfaqi) {
						player.when({ global: "phaseAfter" }).step(async () => delete player.storage.dcfaqi);
					}
					player.markAuto("dcfaqi", name);
					player.chooseUseTarget({ name: name, isCard: true }, true, false).logSkill = "dcfaqi";
				}
			} else {
				event.finish();
			}
		},
		ai: {
			reverseEquip: true,
		},
	},
	//隅泣曹操
	dcjianxiong: {
		audio: "rejianxiong",
		trigger: {
			player: "damageEnd",
		},
		async content(event, trigger, player) {
			if (get.itemtype(trigger.cards) == "cards" && get.position(trigger.cards[0], true) == "o") {
				await player.gain(trigger.cards, "gain2");
			}
			await player.draw(player.countMark("dcjianxiong") + 1, "nodelay");
			if (player.countMark("dcjianxiong") < 4) {
				player.addMark("dcjianxiong", 1, false);
			}
		},
		mark: true,
		marktext: "雄",
		intro: {
			markcount(storage, player) {
				return player.countMark("dcjianxiong") + 1;
			},
			content(storage, player) {
				return "摸牌数为" + (player.countMark("dcjianxiong") + 1);
			},
		},
		ai: {
			maixie: true,
			maixie_hp: true,
			effect: {
				target(card, player, target) {
					if (get.tag(card, "damage") && player != target) {
						if (player.hasSkillTag("jueqing", false, target)) {
							return [1, -1];
						}
						var cards = card.cards,
							evt = _status.event;
						if (evt.player == target && card.name == "damage" && evt.getParent().type == "card") {
							cards = evt.getParent().cards.filterInD();
						}
						if (target.hp <= 1) {
							return;
						}
						if (get.itemtype(cards) != "cards") {
							return;
						}
						for (var i of cards) {
							if (get.name(i, target) == "tao") {
								return [1, 2.5 + player.countMark("dcjianxiong") / 2];
							}
						}
						if (get.value(cards, target) >= 7 - player.countMark("dcjianxiong") / 2 + target.getDamagedHp()) {
							return [1, 1.5 + player.countMark("dcjianxiong") / 2];
						}
						return [1, 0.6 + player.countMark("dcjianxiong") / 2];
					}
				},
			},
		},
	},
	//缺德刘备
	dcrende: {
		audio: "rerende",
		enable: "phaseUse",
		filter(event, player) {
			return game.hasPlayer(current => {
				return lib.skill.dcrende.filterTarget(null, player, current);
			});
		},
		discard: false,
		lose: false,
		delay: false,
		filterTarget(card, player, target) {
			if (player.getStorage("dcrende_targeted").includes(target)) {
				return false;
			}
			return player != target && target.countGainableCards(player, "h") > 1;
		},
		async content(event, trigger, player) {
			player.addTempSkill("dcrende_targeted", "phaseUseAfter");
			player.markAuto("dcrende_targeted", [event.target]);
			await player.gainPlayerCard(event.target, "h", true, 2);
			var list = [];
			for (var name of lib.inpile) {
				if (get.type(name) != "basic") {
					continue;
				}
				var card = { name: name, isCard: true };
				if (
					lib.filter.cardUsable(card, player, event.getParent("chooseToUse")) &&
					game.hasPlayer(current => {
						return player.canUse(card, current);
					})
				) {
					list.push(["基本", "", name]);
				}
				if (name == "sha") {
					for (var nature of lib.inpile_nature) {
						card.nature = nature;
						if (
							lib.filter.cardUsable(card, player, event.getParent("chooseToUse")) &&
							game.hasPlayer(current => {
								return player.canUse(card, current);
							})
						) {
							list.push(["基本", "", name, nature]);
						}
					}
				}
			}
			if (list.length) {
				const result = await player
					.chooseButton(["是否视为使用一张基本牌？", [list, "vcard"]])
					.set("ai", function (button) {
						var player = _status.event.player;
						var card = {
							name: button.link[2],
							nature: button.link[3],
							isCard: true,
						};
						if (card.name == "tao") {
							if (player.hp == 1 || (player.hp == 2 && !player.hasShan("all")) || player.needsToDiscard()) {
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
								if (card.nature == "fire") {
									return 2.95;
								}
								if (card.nature == "thunder" || card.nature == "ice") {
									return 2.92;
								}
								return 2.9;
							}
							return 0;
						}
						if (card.name == "jiu") {
							return 0.5;
						}
						return 0;
					})
					.forResult();
				if (result && result.bool && result.links[0]) {
					var card = {
						name: result.links[0][2],
						nature: result.links[0][3],
						isCard: true,
					};
					await player.chooseUseTarget(card, true);
				}
			}
		},
		subSkill: {
			targeted: {
				onremove: true,
				charlotte: true,
			},
		},
		ai: {
			fireAttack: true,
			order(skill, player) {
				return 10;
			},
			result: {
				target(player, target) {
					if (target.hasSkillTag("noh")) {
						return -0.1;
					}
					return -2;
				},
			},
			threaten: 3,
		},
	},
	//会玩孙权
	dczhiheng: {
		audio: "rezhiheng",
		init: player => {
			player.storage.dczhiheng_hit = [];
		},
		enable: "phaseUse",
		usable(skill, player) {
			return 1 + player.getStorage("dczhiheng_hit").length;
		},
		position: "he",
		filterCard: lib.filter.cardDiscardable,
		discard: false,
		lose: false,
		delay: false,
		selectCard: [1, Infinity],
		allowChooseAll: true,
		check(card) {
			let player = _status.event.player;
			if (
				get.position(card) == "h" &&
				!player.countCards("h", "du") &&
				(player.hp > 2 ||
					!player.countCards("h", i => {
						return get.value(i) >= 8;
					}))
			) {
				return 1;
			}
			if (get.position(card) == "e") {
				let subs = get.subtypes(card);
				if (subs.includes("equip2") || subs.includes("equip3")) {
					return player.getHp() - get.value(card);
				}
			}
			return 6 - get.value(card);
		},
		group: "dczhiheng_add",
		async content(event, trigger, player) {
			let num = 1;
			var hs = player.getCards("h");
			if (!hs.length) {
				num = 0;
			} else {
				for (var i = 0; i < hs.length; i++) {
					if (!event.cards.includes(hs[i])) {
						num = 0;
						break;
					}
				}
			}
			await player.discard(event.cards);
			await player.draw(num + event.cards.length);
		},
		subSkill: {
			add: {
				audio: "dczhiheng",
				trigger: {
					source: "damageSource",
				},
				forced: true,
				locked: false,
				filter(event, player) {
					if (event.player == player) {
						return false;
					}
					return !player.getStorage("dczhiheng_hit").includes(event.player);
				},
				logTarget: "player",
				content() {
					player.addTempSkill("dczhiheng_hit");
					player.markAuto("dczhiheng_hit", [trigger.player]);
					game.log(player, "#g【制衡】", "可发动次数", "#y+1");
				},
			},
			hit: {
				charlotte: true,
				onremove: player => {
					player.storage.dczhiheng_hit = [];
				},
				mark: true,
				marktext: "衡",
				intro: {
					markcount(storage) {
						if (storage) {
							return storage.length;
						}
						return 0;
					},
					content: "本回合已对$造成过伤害",
				},
			},
		},
		ai: {
			order(item, player) {
				if (
					player.hasCard(i => {
						return get.value(i) > Math.max(6, 9 - player.hp);
					}, "he")
				) {
					return 1;
				}
				return 10;
			},
			result: {
				player: 1,
			},
			nokeep: true,
			skillTagFilter(player, tag, arg) {
				if (tag === "nokeep") {
					return (
						(!arg || (arg && arg.card && get.name(arg.card) === "tao")) &&
						player.isPhaseUsing() &&
						player.countSkill("dczhiheng") < 1 + player.getStorage("dczhiheng_hit").length &&
						player.hasCard(card => {
							return get.name(card) !== "tao";
						}, "h")
					);
				}
			},
			threaten: 1.55,
		},
	},
	//朱铁雄
	dcbianzhuang: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		async content(event, trigger, player) {
			var list = [];
			for (var i in lib.skill.dcbianzhuang.characterMap) {
				if (lib.character[i] && get.is.object(lib.skill[lib.skill.dcbianzhuang.characterMap[i]])) {
					list.push(i);
				}
			}
			var characters = list.randomGets(player.storage.dcbianzhuang_inited ? 3 : 2);
			if (!characters.length) {
				event.finish();
				return;
			}
			var skills = characters.map(i => lib.skill.dcbianzhuang.characterMap[i]);
			const result = await player
				.chooseControl(skills)
				.set("dialog", ["选择获得一个技能并“变装”", [characters, "character"]])
				.forResult();
			var skill = result.control;
			await player.addTempSkills(skill, "dcbianzhuangAfter");
			for (var i in lib.skill.dcbianzhuang.characterMap) {
				if (lib.skill.dcbianzhuang.characterMap[i] == skill) {
					player.flashAvatar("dcbianzhuang", i);
					game.log(player, "“变装”为了", "#b" + get.translation(i));
					break;
				}
			}
			const card = new lib.element.VCard({ name: "sha", isCard: true });
			if (!player.hasUseTarget(card, false)) {
				return;
			}
			const result2 = await player.chooseUseTarget(card, true, false, "nodistance").forResult();
			if (result2.bool && !player.storage.dcbianzhuang_inited) {
				player.addMark("dcbianzhuang", 1, false);
				if (player.countMark("dcbianzhuang") > 2) {
					player.storage.dcbianzhuang_inited = true;
					player.changeSkin({ characterName: "zhutiexiong" }, "wu_zhutiexiong");
				}
			}
		},
		group: "dcbianzhuang_refresh",
		ai: {
			order: 16,
			result: {
				player(player) {
					if (player.hasValueTarget("sha", false)) {
						return 1;
					}
					return 0;
				},
			},
			effect: {
				target_use(card, player, target, current) {
					if (player == target && player.isPhaseUsing() && get.type(card) == "equip") {
						if (player.hasValueTarget("sha", false) && typeof player.getStat("skill").dcbianzhuang == "number") {
							return [1, 3];
						}
					}
				},
			},
		},
		subSkill: {
			refresh: {
				audio: "dcbianzhuang",
				trigger: { player: "useCardAfter" },
				forced: true,
				filter(event, player) {
					return get.type2(event.card, false) == "equip" && typeof player.getStat("skill").dcbianzhuang == "number";
				},
				content() {
					var stat = player.getStat("skill");
					delete stat.dcbianzhuang;
					game.log(player, "重置了技能", "#g【变装】");
				},
			},
		},
		characterMap: {
			re_zhangchunhua: "rejueqing",
			wangshuang: "spzhuilie",
			re_machao: "retieji",
			ol_weiyan: "xinkuanggu",
			re_lvbu: "wushuang",
			re_huangzhong: "xinliegong",
			ol_pangde: "rejianchu",
			ol_zhurong: "lieren",
			re_masu: "rezhiman",
			re_panzhangmazhong: "reanjian",
			mayunlu: "fengpo",
			re_quyi: "refuqi",
		},
	},
	//小约翰可汗
	dctongliao: {
		audio: 3,
		trigger: { player: "phaseDrawAfter" },
		direct: true,
		locked: false,
		filter(event, player) {
			return player.countCards("h") > 0;
		},
		async content(event, trigger, player) {
			const result = await player
				.chooseCard("h", get.prompt("dctongliao"), "选择一张牌标记为“通辽”", function (card, player) {
					if (card.hasGaintag("dctongliao")) {
						return false;
					}
					var num = get.number(card, player);
					return !player.hasCard(card2 => {
						return card != card2 && get.number(card2, player) < num;
					});
				})
				.set("ai", function (card) {
					var player = _status.event.player;
					return 1 + Math.max(0, player.getUseValue(card, null, true));
				})
				.forResult();
			if (result.bool) {
				await player.logSkill("dctongliao");
				player.addGaintag(result.cards, "dctongliao");
				await game.delayx();
			}
		},
		mod: {
			aiOrder(player, card, num) {
				if (get.itemtype(card) == "card" && card.hasGaintag("dctongliao")) {
					return num + 0.6;
				}
			},
		},
		group: "dctongliao_draw",
		subSkill: {
			draw: {
				audio: "dctongliao",
				trigger: {
					player: ["loseAfter"],
					global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"],
				},
				filter(event, player) {
					var evt = event.getl(player);
					if (!evt || !evt.hs || !evt.hs.length) {
						return false;
					}
					if (event.name == "lose") {
						for (var i in event.gaintag_map) {
							if (event.gaintag_map[i].includes("dctongliao")) {
								return true;
							}
						}
						return false;
					}
					return player.hasHistory("lose", function (evt) {
						if (event != evt.getParent()) {
							return false;
						}
						for (var i in evt.gaintag_map) {
							if (evt.gaintag_map[i].includes("dctongliao")) {
								return true;
							}
						}
						return false;
					});
				},
				forced: true,
				content() {
					var num = 0;
					var cards = trigger.getl(player).hs,
						ids = [];
					if (trigger.name == "lose") {
						for (var i in trigger.gaintag_map) {
							if (trigger.gaintag_map[i].includes("dctongliao")) {
								ids.push(i);
							}
						}
					} else {
						player.getHistory("lose", function (evt) {
							if (trigger != evt.getParent()) {
								return false;
							}
							for (var i in evt.gaintag_map) {
								if (evt.gaintag_map[i].includes("dctongliao")) {
									ids.push(i);
								}
							}
						});
					}
					for (var card of cards) {
						if (ids.includes(card.cardid)) {
							num += get.number(card, player);
						}
					}
					if (num > 0) {
						player.draw(num);
					}
				},
			},
		},
	},
	dcwudao: {
		audio: 3,
		trigger: { player: "useCardAfter" },
		frequent: true,
		filter(event, player) {
			if (player.getStorage("dcwudao_effect").includes(get.type2(event.card, false))) {
				return false;
			}
			var history = player.getHistory("useCard"),
				index = history.indexOf(event);
			if (index < 1) {
				return false;
			}
			var evt = history[index - 1];
			return get.type2(event.card, false) == get.type2(evt.card, false);
		},
		prompt2(event) {
			return "令你本回合使用" + get.translation(get.type2(event.card, false)) + "牌时不可被响应且伤害+1";
		},
		content() {
			player.addTempSkill("dcwudao_effect");
			player.markAuto("dcwudao_effect", [get.type2(trigger.card, false)]);
		},
		subSkill: {
			effect: {
				trigger: { player: "useCard" },
				forced: true,
				popup: false,
				onremove: true,
				filter(event, player) {
					return player.getStorage("dcwudao_effect").includes(get.type2(event.card, false));
				},
				content() {
					if (get.tag(trigger.card, "damage") > 0) {
						trigger.baseDamage++;
					}
					trigger.directHit.addArray(game.filterPlayer());
				},
				intro: { content: "已经悟到了$牌" },
				ai: {
					directHit_ai: true,
					skillTagFilter(player, tag, arg) {
						if (arg && arg.card && player.getStorage("dcwudao_effect").includes(get.type2(arg.card))) {
							return true;
						}
						return false;
					},
				},
			},
		},
	},
	//叶诗文
	clbjisu: {
		trigger: { player: "phaseJudgeBefore" },
		direct: true,
		async content(event, trigger, player) {
			var check = player.countCards("h") > 2;
			const result = await player
				.chooseTarget(get.prompt("clbjisu"), "跳过判定阶段和摸牌阶段，视为对一名其他角色使用一张【杀】", function (card, player, target) {
					if (player == target) {
						return false;
					}
					return player.canUse({ name: "sha" }, target, false);
				})
				.set("check", check)
				.set("ai", function (target) {
					if (!_status.event.check) {
						return 0;
					}
					return get.effect(target, { name: "sha" }, _status.event.player);
				})
				.setHiddenSkill("clbjisu")
				.forResult();
			if (result.bool) {
				await player.useCard({ name: "sha", isCard: true }, result.targets[0], false, "clbjisu");
				trigger.cancel();
				player.skip("phaseDraw");
			}
		},
	},
	clbshuiyong: {
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
					if (get.tag(card, "fireDamage")) {
						return "zeroplayertarget";
					}
				},
			},
		},
	},
	//孙杨
	clbshuijian: {
		trigger: { player: "phaseDrawBegin2" },
		frequent: true,
		filter(event, player) {
			return !event.numFixed;
		},
		content() {
			var num = 1 + Math.floor(player.countCards("e") / 2);
			trigger.num += num;
		},
	},
	//李白
	dclbjiuxian: {
		audio: 2,
		enable: "chooseToUse",
		locked: false,
		viewAs: { name: "jiu" },
		check: card => 6.5 - get.value(card),
		filterCard(card) {
			var info = get.info(card);
			if (!info || (info.type != "trick" && info.type != "delay")) {
				return false;
			}
			if (info.notarget) {
				return false;
			}
			if (info.selectTarget != undefined) {
				if (Array.isArray(info.selectTarget)) {
					if (info.selectTarget[0] < 0) {
						return !info.toself;
					}
					return info.selectTarget[0] != 1 || info.selectTarget[1] != 1;
				} else {
					if (info.selectTarget < 0) {
						return !info.toself;
					}
					return info.selectTarget != 1;
				}
			}
			return false;
		},
		viewAsFilter(player) {
			if (_status.connectMode && player.countCards("hs") > 0) {
				return true;
			}
			return player.hasCard(lib.skill.dclbjiuxian.filterCard, "hs");
		},
		ai: {
			order: (item, player) => get.order({ name: "jiu" }, player),
		},
		mod: {
			cardUsable(card) {
				if (card.name == "jiu") {
					return Infinity;
				}
			},
		},
	},
	dcshixian: {
		audio: 2,
		trigger: { player: "useCard" },
		//frequent:true,
		//direct:true,
		locked: false,
		filter(event, player) {
			var history = player.getAllHistory("useCard"),
				index = history.indexOf(event);
			if (index < 1) {
				return false;
			}
			var evt = history[index - 1];
			return get.is.yayun(get.translation(event.card.name), get.translation(evt.card.name));
		},
		filterx(event) {
			if (event.targets.length == 0) {
				return false;
			}
			var type = get.type(event.card);
			if (type != "basic" && type != "trick") {
				return false;
			}
			return true;
		},
		prompt2(event, player) {
			if (lib.skill.dcshixian.filterx(event)) {
				return "摸一张牌并令" + get.translation(event.card) + "额外结算一次？";
			}
			return "摸一张牌。";
		},
		check(event, player) {
			if (lib.skill.dcshixian.filterx(event)) {
				return !get.tag(event.card, "norepeat");
			}
			return true;
		},
		content() {
			player.draw();
			if (lib.skill.dcshixian.filterx(trigger)) {
				trigger.effectCount++;
				game.log(trigger.card, "额外结算一次");
			}
		},
		mod: {
			aiOrder(player, card, num) {
				if (typeof card == "object" && !get.tag(card, "norepeat")) {
					var history = player.getAllHistory("useCard");
					if (history.length > 0) {
						var cardx = history[history.length - 1].card;
						if (get.is.yayun(get.translation(cardx.name), get.translation(card.name))) {
							return num + 20;
						}
					}
				}
			},
		},
		init(player) {
			player.addSkill("dcshixian_yayun");
			var history = player.getAllHistory("useCard");
			if (history.length) {
				player.addGaintag(
					player.getCards("h", card => {
						return get.is.yayun(get.translation(card.name), get.translation(history[history.length - 1].card.name));
					}),
					"dcshixian_yayun"
				);
			}
		},
		onremove(player) {
			player.removeSkill("dcshixian_yayun");
			player.removeGaintag("dcshixian_yayun");
		},
		subSkill: {
			yayun: {
				charlotte: true,
				trigger: { player: "useCard1" },
				filter(event, player) {
					return player.countCards("h") > 0;
				},
				direct: true,
				priority: 11 + 45 + 14 + 19 + 19 + 810,
				content() {
					player.removeGaintag("dcshixian_yayun");
					player.addGaintag(
						player.getCards("h", card => {
							return get.is.yayun(get.translation(card.name), get.translation(trigger.card.name));
						}),
						"dcshixian_yayun"
					);
				},
			},
		},
	},
	//龙王
	dclonggong: {
		audio: 2,
		trigger: { player: "damageBegin4" },
		usable: 1,
		filter(event, player) {
			return event.source && event.source.isIn();
		},
		logTarget: "source",
		check(event, player) {
			return get.attitude(player, event.source) >= 0 || player.hp <= Math.max(2, event.num);
		},
		async content(event, trigger, player) {
			trigger.cancel();
			var card = get.cardPile2(function (card) {
					return get.type(card, null, false) == "equip";
				}),
				source = trigger.source;
			if (card && source && source.isIn()) {
				await source.gain(card, "gain2");
			}
		},
		ai: {
			filterDamage: true,
			skillTagFilter(player) {
				return !player.storage.counttrigger || !player.storage.counttrigger.dclonggong;
			},
		},
	},
	dcsitian: {
		audio: 2,
		enable: "phaseUse",
		filter(event, player) {
			var colorx = false,
				hs = player.getCards("he");
			if (hs.length < 2) {
				return false;
			}
			for (var card of hs) {
				if (!lib.filter.cardDiscardable(card, player)) {
					continue;
				}
				var color = get.color(card, player);
				if (color == "none") {
					continue;
				}
				if (!colorx) {
					colorx = color;
				} else if (colorx != color) {
					return true;
				}
			}
			return false;
		},
		filterCard(card, player) {
			var color = get.color(card, player);
			if (color == "none") {
				return false;
			}
			return !ui.selected.cards.length || get.color(ui.selected.cards[0]) != color;
		},
		selectCard: 2,
		complexCard: true,
		prompt: "弃置两张颜色不同的牌并改变天气",
		check: card => 4.5 - get.value(card),
		async content(event, trigger, player) {
			var list = ["烈日", "雷电", "大浪", "暴雨", "大雾"].randomGets(2);
			const result = await player
				.chooseButton(true, [
					"请选择执行一个天气",
					[
						list.map(i => [
							i,
							'<div class="popup text" style="width:calc(100% - 10px);display:inline-block"><div class="skill">【' +
								i +
								"】</div><div>" +
								lib.skill.dcsitian.weathers[i].description +
								"</div></div>",
						]),
						"textbutton",
					],
				])
				.set("ai", function (button) {
					return lib.skill.dcsitian.weathers[button.link].ai(_status.event.player);
				})
				.forResult();
			if (result.bool) {
				var choice = result.links[0];
				game.log(player, "将当前天气变更为", "#g" + choice);
				var next = game.createEvent("dcsitian_weather", false);
				next.player = player;
				next.setContent(lib.skill.dcsitian.weathers[choice].content);
			}
		},
		ai: {
			order: 8,
			result: {
				player(player) {
					var num1 = 0,
						num2 = 0;
					game.countPlayer(function (current) {
						if (player == current) {
							return;
						}
						var att = get.attitude(player, current);
						if (att > 0) {
							num1++;
						} else {
							num2++;
						}
					});
					return num2 - num1;
				},
			},
		},
		subSkill: {
			dawu: {
				trigger: { player: "useCard" },
				forced: true,
				charlotte: true,
				filter(event, player) {
					return get.type2(event.card, false) == "basic";
				},
				content() {
					trigger.targets.length = 0;
					trigger.all_excluded = true;
					player.removeSkill("dcsitian_dawu");
				},
				mark: true,
				marktext: "雾",
				intro: {
					name: "司天 - 大雾",
					content: "使用的下一张基本牌无效",
				},
			},
		},
		weathers: {
			烈日: {
				description: "你对其他角色造成1点火属性伤害。",
				content() {
					var targets = game.filterPlayer(current => current != player).sortBySeat();
					player.line(targets, "fire");
					for (var target of targets) {
						target.damage("fire");
					}
				},
				ai(player) {
					var effect = 0;
					game.countPlayer(function (current) {
						if (current == player) {
							return;
						}
						effect += get.damageEffect(current, player, player, "fire");
					});
					return effect;
				},
			},
			雷电: {
				description: "你令其他角色各进行一次判定。若结果为♠2~9，则其受到3点无来源雷属性伤害。",
				async content(event, trigger, player) {
					var targets = game.filterPlayer(current => current != player).sortBySeat();
					player.line(targets, "thunder");
					for (const target of targets) {
						if (!target.isIn()) {
							continue;
						}
						const result = await target
							.judge(lib.card.shandian.judge, get.translation("shandian"))
							.set("judge2", lib.card.shandian.judge2)
							.forResult();
						var name = "shandian";
						if (event.cancelled && !event.direct) {
							if (lib.card[name].cancel) {
								var next = game.createEvent(name + "Cancel");
								next.setContent(lib.card[name].cancel);
								next.cards = [];
								next.card = get.autoViewAs({ name: name });
								next.player = target;
								await next;
							}
						} else {
							var next = game.createEvent(name);
							next.setContent(function () {
								if (result.bool == false) {
									player.damage(3, "thunder", "nosource");
								}
							});
							next._result = result;
							next.cards = [];
							next.card = get.autoViewAs({ name: name });
							next.player = target;
							await next;
						}
					}
				},
				ai(player) {
					var effect = 0;
					game.countPlayer(function (current) {
						if (current == player) {
							return;
						}
						effect += get.damageEffect(current, current, player, "thunder") / 5;
					});
					return effect;
				},
			},
			大浪: {
				description: "你弃置其他角色装备区内的所有牌（装备区内没有牌的角色改为失去1点体力）。",
				async content(event, trigger, player) {
					var targets = game.filterPlayer(current => current != player).sortBySeat();
					player.line(targets, "green");
					for (const target of targets) {
						if (target.isIn()) {
							var num = target.countCards("e");
							if (num > 0) {
								await player.discardPlayerCard(target, true, "e", num);
							} else {
								await target.loseHp();
								await game.delayx();
							}
						}
					}
				},
				ai(player) {
					var effect = 0;
					game.countPlayer(function (current) {
						if (current == player) {
							return;
						}
						var es = current.getCards("e");
						if (es.length > 0) {
							var att = get.attitude(player, current),
								val = get.value(es, current);
							effect -= Math.sqrt(att) * val;
						} else {
							effect += get.effect(current, { name: "losehp" }, player, player);
						}
					});
					return effect;
				},
			},
			暴雨: {
				description: "你弃置一名角色的所有手牌。若其没有手牌，则改为令其失去1点体力。",
				async content(event, trigger, player) {
					const result = await player
						.chooseTarget("请选择【暴雨】的目标", "令目标角色弃置所有手牌。若其没有手牌，则其改为失去1点体力。")
						.set("ai", function (current) {
							var es = current.getCards("h"),
								player = _status.event.player;
							if (es.length > 0) {
								var att = get.attitude(player, current),
									val = get.value(es, current);
								return -Math.sqrt(att) * val;
							}
							return get.effect(current, { name: "losehp" }, player, player);
						})
						.forResult();
					if (result.bool) {
						var target = result.targets[0];
						player.line(target, "green");
						var num = target.countCards("h");
						if (num > 0) {
							player.discardPlayerCard(target, true, "h", num);
						} else {
							target.loseHp();
							await game.delayex();
						}
					}
				},
				ai(player) {
					return Math.max.apply(
						Math,
						game
							.filterPlayer(function (current) {
								return current != player;
							})
							.map(function (current) {
								var es = current.getCards("h");
								if (es.length > 0) {
									var att = get.attitude(player, current),
										val = get.value(es, current);
									return -Math.sqrt(att) * val;
								}
								return get.effect(current, { name: "losehp" }, player, player);
							})
					);
				},
			},
			大雾: {
				description: "你令所有其他角色获得如下效果：当其使用下一张基本牌时，取消之。",
				content() {
					var targets = game.filterPlayer(current => current != player).sortBySeat();
					player.line(targets);
					for (var target of targets) {
						target.addSkill("dcsitian_dawu");
					}
				},
				ai(player) {
					var effect = 0;
					game.countPlayer(function (current) {
						if (current == player || current.hasSkill("dcsitian_dawu")) {
							return;
						}
						effect -= 0.5 * get.attitude(player, current);
					});
					return effect;
				},
			},
		},
	},
	//美猴王
	dcjinjing: {
		audio: 2,
		locked: true,
		ai: {
			viewHandcard: true,
			skillTagFilter(player, tag, arg) {
				if (player == arg) {
					return false;
				}
			},
		},
	},
	dccibei: {
		audio: 2,
		trigger: { source: "damageBegin2" },
		logTarget: "player",
		filter(event, player) {
			return (
				player != event.player &&
				!player.hasHistory("useSkill", function (evt) {
					return evt.skill == "dccibei" && evt.targets.includes(event.player);
				})
			);
		},
		check(event, player) {
			var target = event.player;
			if (get.attitude(player, target) >= 0) {
				return true;
			}
			return !player.getStat("skill").ruyijingubang_skill || player.storage.ruyijingubang_skill == 1;
		},
		content() {
			trigger.cancel();
			player.draw(5);
		},
		ai: {
			threaten: 4.5,
		},
	},
	dcruyi: {
		audio: 2,
		derivation: "ruyijingubang_skill",
		trigger: {
			global: "phaseBefore",
			player: "enterGame",
		},
		forced: true,
		filter(event, player) {
			return (event.name != "phase" || game.phaseNumber == 0) && player.hasEquipableSlot(1) && !player.getEquips("ruyijingubang").length;
		},
		content() {
			var card = game.createCard2("ruyijingubang", "heart", 9);
			player.$gain2(card, false);
			game.delayx();
			player.equip(card);
		},
		mod: {
			canBeGained(card, source, player) {
				if (player.getEquips("ruyijingubang").includes(card)) {
					return false;
				}
			},
			canBeDiscarded(card, source, player) {
				if (player.getEquips("ruyijingubang").includes(card)) {
					return false;
				}
			},
			canBeReplaced(card, player) {
				if (player.getVEquips("ruyijingubang").includes(card)) {
					return false;
				}
			},
			cardname(card) {
				if (get.subtype(card, false) == "equip1") {
					return "sha";
				}
			},
			cardnature(card) {
				if (get.subtypes(card, false).includes("equip1")) {
					return false;
				}
			},
			cardDiscardable(card, player) {
				if (player.getEquips("ruyijingubang").includes(card)) {
					return false;
				}
			},
			cardEnabled2(card, player) {
				if (player.getEquips("ruyijingubang").includes(card)) {
					return false;
				}
			},
		},
		group: "dcruyi_blocker",
		subSkill: {
			blocker: {
				audio: "dcruyi",
				trigger: {
					player: ["loseBefore", "disableEquipBefore"],
				},
				forced: true,
				filter(event, player) {
					if (event.name == "disableEquip") {
						return event.slots.includes("equip1");
					}
					var cards = player.getEquips("ruyijingubang");
					return event.cards.some(card => cards.includes(card));
				},
				content() {
					if (trigger.name == "lose") {
						trigger.cards.removeArray(player.getEquips("ruyijingubang"));
					} else {
						while (trigger.slots.includes("equip1")) {
							trigger.slots.remove("equip1");
						}
					}
				},
			},
		},
	},
	ruyijingubang_skill: {
		equipSkill: true,
		enable: "phaseUse",
		usable: 1,
		chooseButton: {
			dialog() {
				var dialog = ui.create.dialog(
					"如意金箍棒：选择变化攻击范围",
					[
						[
							[1, "　　　⒈【杀】无次数限制　　　"],
							[2, "　　　⒉【杀】的伤害值+1　　　"],
						],
						"tdnodes",
					],
					[
						[
							[3, "　　　⒊【杀】不可被响应　　　"],
							[4, "　　　⒋【杀】的目标数+1　　　"],
						],
						"tdnodes",
					]
				);
				return dialog;
			},
			filter(button, player) {
				return button.link != player.storage.ruyijingubang_skill;
			},
			check(button) {
				if (button.link == 1 || button.link == 3) {
					return 1;
				}
				return 0;
			},
			backup(links, player) {
				return {
					audio: "dcruyi",
					num: links[0],
					popup: "如意金箍棒",
					content() {
						var num = lib.skill.ruyijingubang_skill_backup.num;
						player.storage.ruyijingubang_skill = num;
						var cards = player.getEquips(1);
						for (var card of cards) {
							if (card && card.name == "ruyijingubang") {
								card.storage.ruyijingubang_skill = num;
								game.log(player, "将", card, "的攻击范围改为" + num);
							}
						}
						player.markSkill("ruyijingubang_skill");
					},
				};
			},
		},
		mod: {
			cardUsable(card, player, num) {
				if (player.storage.ruyijingubang_skill == 1 && card.name == "sha") {
					return Infinity;
				}
			},
		},
		ai: {
			order: 1,
			directHit_ai: true,
			skillTagFilter(player, tag, arg) {
				return player.storage.ruyijingubang_skill == 3;
			},
			effect: {
				player(card, player, target, current) {
					if (get.tag(card, "damage") > 0 && player != target) {
						if (player.getStat("skill").ruyijingubang_skill && player.storage.ruyijingubang_skill != 1) {
							return;
						}
						if (
							player.hasSkill("dccibei") &&
							!player.hasHistory("useSkill", function (evt) {
								return evt.skill == "dccibei" && evt.targets.includes(target);
							})
						) {
							return [1, 3];
						}
					}
				},
			},
			result: {
				player(player) {
					if (player.storage.ruyijingubang_skill == 1) {
						if (!player.hasSha()) {
							return 1;
						}
						return 0;
					} else {
						if (player.hasSha() && player.getCardUsable("sha") <= 0) {
							return 1;
						}
						return 0;
					}
				},
			},
		},
		intro: {
			name: "如意金箍棒",
			content(storage) {
				if (!storage) {
					storage = 3;
				}
				return (
					"<li>攻击范围：" +
					storage +
					"<br><li>" +
					[
						"你使用【杀】无次数限制。",
						"你使用的【杀】伤害+1。",
						"你使用的【杀】不可被响应。",
						"你使用【杀】选择目标后，可以增加一个额外目标。",
					][storage - 1]
				);
			},
		},
		subSkill: {
			backup: {},
		},
	},
	ruyijingubang_effect: {
		equipSkill: true,
		trigger: { player: "useCard2" },
		direct: true,
		locked: true,
		filter(event, player) {
			if (event.card.name != "sha") {
				return false;
			}
			var num = player.storage.ruyijingubang_skill;
			if (!num || num == 1) {
				return false;
			}
			if (num != 4) {
				return true;
			}
			var card = event.card;
			if (
				game.hasPlayer(function (current) {
					return (
						!event.targets.includes(current) &&
						lib.filter.targetEnabled2(card, player, current) &&
						lib.filter.targetInRange(card, player, current)
					);
				})
			) {
				return true;
			}
			return false;
		},
		async content(event, trigger, player) {
			var num = player.storage.ruyijingubang_skill;
			if (num == 4) {
				const result = await player
					.chooseTarget(
						get.prompt("ruyijingubang_effect"),
						"为" + get.translation(trigger.card) + "额外指定一个目标",
						function (card, player, target) {
							return !_status.event.sourcex.includes(target) && player.canUse(_status.event.card, target, false);
						}
					)
					.set("sourcex", trigger.targets)
					.set("ai", function (target) {
						var player = _status.event.player;
						return get.effect(target, _status.event.card, player, player);
					})
					.set("card", trigger.card)
					.forResult();
				if (result.bool) {
					if (!event.isMine() && !event.isOnline()) {
						await game.delayx();
					}
					await player.logSkill("ruyijingubang_effect", result.targets);
					trigger.targets.addArray(result.targets);
				}
			} else {
				await player.logSkill("ruyijingubang_effect");
				if (num == 2) {
					trigger.baseDamage++;
					game.log(trigger.card, "的伤害+1");
				} else if (num == 3) {
					trigger.directHit.addArray(game.filterPlayer());
					game.log(trigger.card, "不可被响应");
				}
				return;
			}
		},
	},
	//涛神
	dcnutao: {
		audio: 4,
		trigger: { player: "useCardToPlayer" },
		forced: true,
		group: "dcnutao_add",
		filter(event, player) {
			if (get.type2(event.card) != "trick") {
				return false;
			}
			return event.isFirstTarget && event.targets.some(i => i != player);
		},
		content() {
			var target = trigger.targets.filter(i => i != player).randomGet();
			player.line(target, "thunder");
			target.damage("thunder");
		},
		ai: {
			effect: {
				player_use(card, player, target) {
					if (player !== target && get.type2(card) === "trick") {
						let tars = [target];
						if (ui.selected.targets.length) {
							tars.addArray(ui.selected.targets.filter(i => i !== player && i !== target));
						}
						if (tars.length < 2) {
							return [1, 0, 1, -2];
						}
						return [1, 0, 1, -2 / tars.length];
					}
				},
			},
		},
		subSkill: {
			add: {
				audio: "dcnutao",
				trigger: { source: "damageSource" },
				filter(event, player) {
					return event.nature == "thunder" && player.isPhaseUsing();
				},
				forced: true,
				content() {
					player.addTempSkill("dcnutao_sha", "phaseUseAfter");
					player.addMark("dcnutao_sha", 1, false);
				},
			},
			sha: {
				charlotte: true,
				onremove: true,
				marktext: "涛",
				intro: {
					content: "此阶段使用【杀】的次数上限+#",
				},
				mod: {
					cardUsable(card, player, num) {
						if (card.name == "sha") {
							return num + player.countMark("dcnutao_sha");
						}
					},
				},
			},
		},
	},
	//铜雀台
	spduanzhi: {
		trigger: { target: "useCardToTargeted" },
		logTarget: "player",
		check(event, player) {
			var target = event.player;
			if (
				get.attitude(player, target) >= -2 ||
				target.countCards("he", function (card) {
					return get.value(card, target) > 5;
				}) < 2
			) {
				return false;
			}
			if (player.hp > 2) {
				return true;
			}
			if (player.hp == 1) {
				if (get.tag(event.card, "respondSha")) {
					if (player.countCards("h", { name: "sha" }) == 0) {
						return true;
					}
				} else if (get.tag(event.card, "respondShan")) {
					if (player.countCards("h", { name: "shan" }) == 0) {
						return true;
					}
				} else if (get.tag(event.card, "damage")) {
					if (event.card.name == "shuiyanqijunx") {
						return player.countCards("e") == 0;
					}
					return true;
				}
			}
			return false;
		},
		filter(event, player) {
			return player != event.player && event.player.countDiscardableCards(player, "he") > 0;
		},
		content() {
			player.discardPlayerCard(trigger.player, true, "he", [1, 2]);
			player.loseHp();
		},
	},
	spduyi: {
		enable: "phaseUse",
		usable: 1,
		async content(event, trigger, player) {
			const card = get.cards()[0];
			await game.cardsGotoOrdering(card);
			await player.showCards(card);
			const result = await player
				.chooseTarget("令一名角色获得" + get.translation(card), true)
				.set("ai", function (target) {
					var att = get.attitude(_status.event.player, target);
					if (_status.event.du) {
						if (target.hasSkillTag("nodu")) {
							return 0;
						}
						return -att;
					}
					if (att > 0) {
						if (target == player) {
							att *= 0.6;
						}
						return att + Math.sqrt(Math.max(0, 5 - target.countCards("h")));
					}
					return att;
				})
				.set("du", card.name == "du")
				.forResult();
			if (result.bool) {
				var target = result.targets[0];
				target.gain(card, "gain2");
				if (get.color(card, false) == "black") {
					target.addTempSkill("spduyi2");
				}
			}
		},
		ai: {
			order: 0.1,
			result: {
				player: 1,
			},
		},
	},
	spduyi2: {
		mod: {
			cardEnabled2(card) {
				if (get.position(card) == "h") {
					return false;
				}
			},
		},
		mark: true,
		intro: {
			content: "不能使用或打出手牌",
		},
	},
	spcangni: {
		audio: "zhuikong",
		trigger: { player: "phaseDiscardBegin" },
		direct: true,
		async content(event, trigger, player) {
			const result = await player
				.chooseDrawRecover("###" + get.prompt("spcangni") + "###摸两张牌或回复1点体力，然后将武将牌翻面", 2)
				.set("logSkill", "spcangni")
				.forResult();
			if (result.control != "cancel2") {
				await player.turnOver();
			}
		},
		group: ["spcangni_gain", "spcangni_lose"],
		subSkill: {
			gain: {
				audio: "zhuikong",
				trigger: {
					player: "gainAfter",
					global: "loseAsyncAfter",
				},
				usable: 1,
				filter(event, player) {
					if (!_status.currentPhase?.isIn()) {
						return false;
					}
					return player.isTurnedOver() && player != _status.currentPhase && event.getg?.(player)?.length > 0;
				},
				check(event, player) {
					return get.attitude(player, _status.currentPhase) > 0;
				},
				logTarget() {
					return _status.currentPhase;
				},
				prompt2: "令该角色摸一张牌",
				content() {
					_status.currentPhase.draw();
				},
			},
			lose: {
				audio: "zhuikong",
				trigger: {
					player: "loseAfter",
					global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"],
				},
				filter(event, player) {
					if (!_status.currentPhase?.isIn()) {
						return false;
					}
					if (event.name == "gain" && player == event.player) {
						return false;
					}
					if (!event.getl?.(player)?.cards2?.length) {
						return false;
					}
					return player.isTurnedOver() && player != _status.currentPhase && _status.currentPhase.countCards("he") > 0;
				},
				check(event, player) {
					const target = _status.currentPhase;
					const att = get.attitude(player, target);
					if (target.countCards("e", card => get.value(card, target) <= 0)) {
						return att > 0;
					}
					return att < 0;
				},
				logTarget() {
					return _status.currentPhase;
				},
				prompt2: "令该角色弃置一张牌",
				content() {
					_status.currentPhase.chooseToDiscard("he", true);
				},
			},
		},
	},
	spmixin: {
		audio: "qiuyuan",
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return player.countCards("h") > 0 && game.countPlayer() > 2;
		},
		filterCard: true,
		filterTarget: lib.filter.notMe,
		position: "h",
		selectTarget: 2,
		targetprompt: ["拿牌打人", "被打"],
		multitarget: true,
		delay: false,
		discard: false,
		lose: false,
		check(card) {
			if (card.name == "sha") {
				return 4;
			}
			return 4 - get.value(card);
		},
		async content(event, trigger, player) {
			const targets = event.targets;
			await player.give(event.cards, targets[0]);
			if (!targets[0].isIn() || !targets[1].isIn()) {
				return;
			}
			const result = await targets[0]
				.chooseToUse(
					function (card, player, event) {
						if (get.name(card) != "sha") {
							return false;
						}
						return lib.filter.filterCard.apply(this, arguments);
					},
					"密信：对" + get.translation(targets[1]) + "使用一张【杀】，或令其观看并获得你的一张手牌"
				)
				.set("complexSelect", true)
				.set("filterTarget", function (card, player, target) {
					if (target != _status.event.sourcex && !ui.selected.targets.includes(_status.event.sourcex)) {
						return false;
					}
					return lib.filter.targetEnabled.apply(this, arguments);
				})
				.set("sourcex", targets[1])
				.forResult();
			if (!result.bool && targets[0].countCards("h")) {
				await targets[1].gainPlayerCard(targets[0], "visible", "h", true);
			}
		},
		ai: {
			order: 1,
			expose: 0.1,
			result: {
				target(player, target) {
					var card = ui.selected.cards[0];
					if (!card) {
						return 0;
					}
					if (ui.selected.targets.length == 0) {
						if (card.name == "sha" || target.hasSha()) {
							return 2;
						}
						if (get.value(card, target) < 0) {
							return -2;
						}
						return 0;
					}
					var target1 = ui.selected.targets[0];
					if ((card.name == "sha" || target1.hasSha()) && get.effect(target, { name: "sha" }, target1, target1) > 0) {
						return get.effect(target, { name: "sha" }, target1, target);
					}
					return 1.5;
				},
			},
		},
	},
	spfengyin: {
		audio: "moukui",
		trigger: { global: "phaseZhunbeiBegin" },
		direct: true,
		filter(event, player) {
			return (
				player != event.player &&
				event.player.hp >= player.hp &&
				player.countCards("h", function (card) {
					if (_status.connectMode) {
						return true;
					}
					return get.name(card, player) == "sha";
				}) > 0
			);
		},
		async content(event, trigger, player) {
			const result = await player
				.chooseCard(
					"h",
					get.prompt("spfengyin", trigger.player),
					"交给该角色一张【杀】并令其跳过出牌阶段和弃牌阶段",
					function (card, player) {
						return get.name(card, player) == "sha";
					}
				)
				.set("ai", function (card) {
					if (_status.event.goon) {
						return 5 - get.value(card);
					}
					return 0;
				})
				.set(
					"goon",
					(function () {
						if (get.attitude(player, trigger.player) >= 0) {
							return false;
						}
						if (trigger.player.countCards("hs") < trigger.player.hp) {
							return false;
						}
						return true;
					})()
				)
				.forResult();
			if (result.bool) {
				var target = trigger.player;
				player.logSkill("spfengyin", target);
				player.give(result.cards, target, "give");
				target.skip("phaseUse");
				target.skip("phaseDiscard");
			}
		},
	},
	spchizhong: {
		mod: {
			maxHandcardBase(player, num) {
				return player.maxHp;
			},
		},
		trigger: { global: "dieAfter" },
		forced: true,
		content() {
			player.gainMaxHp();
		},
	},
	fenxin_old: {
		mode: ["identity"],
		trigger: { source: "dieBegin" },
		init(player) {
			player.storage.fenxin = false;
		},
		intro: {
			content: "limited",
		},
		skillAnimation: "epic",
		animationColor: "fire",
		unique: true,
		limited: true,
		audio: "fenxin",
		mark: true,
		filter(event, player) {
			if (player.storage.fenxin) {
				return false;
			}
			return (
				event.player.identity != "zhu" && player.identity != "zhu" && player.identity != "mingzhong" && event.player.identity != "mingzhong"
			);
		},
		check(event, player) {
			if (player.identity == event.player.identity) {
				return Math.random() < 0.5;
			}
			var stat = get.situation();
			switch (player.identity) {
				case "fan":
					if (stat < 0) {
						return false;
					}
					if (stat == 0) {
						return Math.random() < 0.6;
					}
					return true;
				case "zhong":
					if (stat > 0) {
						return false;
					}
					if (stat == 0) {
						return Math.random() < 0.6;
					}
					return true;
				case "nei":
					if (event.player.identity == "fan" && stat < 0) {
						return true;
					}
					if (event.player.identity == "zhong" && stat > 0) {
						return true;
					}
					if (stat == 0) {
						return Math.random() < 0.7;
					}
					return false;
			}
			return false;
		},
		prompt(event, player) {
			return "焚心：是否与" + get.translation(event.player) + "交换身份？";
		},
		content() {
			game.broadcastAll(
				function (player, target, shown) {
					var identity = player.identity;
					player.identity = target.identity;
					if (shown || player == game.me) {
						player.setIdentity();
					}
					target.identity = identity;
				},
				player,
				trigger.player,
				trigger.player.identityShown
			);
			player.line(trigger.player, "green");
			player.storage.fenxin = true;
			player.awakenSkill(event.name);
		},
	},
	//波仔
	quanjia: {
		intro: {
			markcount(storage, player) {
				return storage || 0;
			},
			content(storage) {
				return `下次多看${storage || 0}张牌`;
			},
		},
		trigger: {
			global: "damageSource",
		},
		filter(event, player) {
			if (!event.source || event.source == player || !event.player || event.player == event.source || _status.currentPhase != event.source) {
				return false;
			}
			if (!event.source.isIn()) {
				return false;
			}
			return event.source.countCards("h") > 0;
		},
		logTarget: "source",
		prompt2(event, player) {
			return `随机观看其${2 + player.countMark("quanjia")}张手牌，若没有【杀】，下次多看一张`;
		},
		check(event, player) {
			return get.attitude(player, event.source) < 0;
		},
		async content(event, trigger, player) {
			const {
				targets: [target],
			} = event;
			const skill = event.name;
			const num = 2 + player.countMark(skill);
			const cards = target.getCards("h").randomGets(num);
			player.clearMark(skill, false);
			if (cards.length) {
				await player.viewCards(get.translation(target) + "的手牌", cards);
				const shaCards = cards.filter(card => {
					return get.name(card, target) == "sha";
				});
				if (shaCards.length) {
					while (shaCards.length) {
						const card = shaCards.shift();
						if (player.canUse(card, target, false, false)) {
							await player.useCard(card, target, false);
						}
					}
					return;
				}
			}
			player.chat("(小猫骂骂咧咧)");
			player.addMark(skill, 1, false);
		},
	},
	//香蕉端午
	xiaomian: {
		trigger: { player: "useCard" },
		filter(event, player) {
			const suit = get.suit(event.card);
			/*if (!lib.suit.includes(suit)) {
				return false;
			}*/
			return player.countCards("e", { suit: suit }) > 0;
		},
		check: () => true,
		async content(event, trigger, player) {
			const suit = get.suit(trigger.card);
			const num = player.countCards("e", { suit: suit });
			if (!num) {
				return;
			}
			await player.draw(num);
			await player.chooseToDiscard(true, "e");
		},
	},
	xuyuan: {
		trigger: { player: "phaseUseBegin" },
		async cost(event, trigger, player) {
			const result = await player
				.chooseButton(
					[
						get.prompt2(event.skill),
						[lib.suit.map(i => [i, get.translation(i)]), "tdnodes"],
						[Array.from({ length: 5 }).map((val, i) => [`equip${i + 1}`, get.translation(`equip${i + 1}`)]), "tdnodes"],
					],
					2
				)
				.set("filterButton", button => {
					const { buttons } = ui.selected;
					if (!buttons?.length) {
						return true;
					}
					return lib.suit.includes(button.link) != lib.suit.includes(buttons[0].link);
				})
				.set("ai", button => Math.random())
				.forResult();
			if (result?.bool && result.links?.length) {
				const { links } = result;
				if (!lib.suit.includes(links[0])) {
					links.reverse();
				}
				event.result = {
					bool: true,
					cost_data: links,
				};
			}
		},
		async content(event, trigger, player) {
			const {
				cost_data: [suit, subtype],
			} = event;
			const card = get.cardPile2(card => {
				return get.suit(card) == suit && get.subtype(card) == subtype && player.canEquip(card, true);
			}, "random");
			if (card) {
				player.chat("Happy Happy Happy");
				await player.equip(card);
			} else {
				player.chat("呜呜呜...");
			}
		},
	},
};

export default skills;
