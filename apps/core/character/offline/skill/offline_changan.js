import { lib, game, ui, get, ai, _status } from "noname";
import html from "dedent";

/** @type { importCharacterConfig["skill"] } */
const skills = {
	//汉末神王允
	caanchao: {
		trigger: {
			global: "phaseAfter",
		},
		frequent: true,
		filter(event, player) {
			return game.hasPlayer2(current => {
				return current.hasHistory("useCard", evt => {
					return get.is.convertedCard(evt.card) || get.is.virtualCard(evt.card);
				});
			}, true);
		},
		async content(event, trigger, player) {
			await player.draw();
			player.addCharge();
		},
	},
	cayurong: {
		trigger: { target: "useCardToTarget" },
		filter(event, player) {
			if (!get.is.damageCard(event.card)) {
				return false;
			}
			if (player.getStorage("cayurong_targeted").includes(event.card.name)) {
				return false;
			}
			return true;
		},
		forced: true,
		async content(event, trigger, player) {
			trigger.getParent().excluded.add(player);
			player.addTempSkill("cayurong_targeted", "roundStart");
			player.markAuto("cayurong_targeted", [trigger.card.name]);
		},
		subSkill: {
			targeted: {
				onremove: true,
				charlotte: true,
			},
		},
	},
	cadingxi: {
		chargeSkill: Infinity,
		locked: false,
		enable: "chooseToUse",
		getCanUse(event, player) {
			return lib.inpile.filter(i => event.filterCard(get.autoViewAs({ name: i }, "unsure"), player, event));
		},
		hiddenCard(player, name) {
			if (lib.inpile.includes(name)) {
				return player.countCharge();
			}
		},
		filter(event, player) {
			if (event.responded || !player.countCharge() || event.cadingxi_result) {
				return false;
			}
			return lib.skill["cadingxi"].getCanUse(event, player).length;
		},
		chooseButton: {
			dialog(event, player) {
				const list = lib.skill["cadingxi"]
					.getCanUse(event, player)
					.map(name => get.type2(name))
					.unique();
				const dialog = ui.create.dialog("定西", [list.map(type => ["", "", "caoying_" + type]), "vcard"]);
				dialog.direct = true;
				return dialog;
			},
			check(event, player) {
				return Math.random();
			},
			backup(links, player) {
				const type = links[0][2].slice(8);
				return {
					type: type,
					filterCard: () => false,
					selectCard: -1,
					popname: true,
					async content(event, trigger, player) {
						const type = lib.skill[event.name].type,
							evt = event.getParent(2),
							filterCard = evt.name == "_wuxie" ? (card, player, event) => card.name == "wuxie" : evt.filterCard;
						player.removeCharge();
						const cards = get.cards(1, true),
							card = cards[0];
						await player.showCards(cards, `${get.translation(player)}发动了【定西】`);
						let key;
						switch (evt.name) {
							case "_wuxie":
								key = "wuxieresult2";
								break;
							default:
								key = "result";
						}
						if (get.type2(card) == type) {
							event.getParent().set("cadingxi_result", true);
							const history = player.getAllHistory("useSkill", evt => evt.skill == event.name);
							const list = history.slice(-Math.min(3, history.length)).map(evt => evt.event.cadingxi_result);
							if (list.slice(-2).length >= 2 && !list.slice(-2).some(i => !i)) {
								await player.recoverTo(player.maxHp);
							}
							if (list.length >= 3 && !list.some(i => !i)) {
								const damage = async target => {
									await target.damage();
								};
								const targets = game.filterPlayer(target => target != player);
								player.line(targets);
								await game.doAsyncInOrder(targets, damage);
							}
							if (filterCard(get.autoViewAs(card), player, evt)) {
								if (evt.name == "chooseToUse") {
									game.broadcastAll(
										(result, name) => {
											lib.skill.cadingxi_backup2.viewAs = { name: name, cards: [result], isCard: true };
										},
										card,
										card.name
									);
									evt.set("_backupevent", "cadingxi_backup2");
									evt.set("openskilldialog", "请选择" + get.translation(card) + "的目标");
									evt.backup("cadingxi_backup2");
								} else {
									delete evt[key].used;
									evt[key].card = get.autoViewAs(card);
									evt[key].cards = [card];
									delete evt[key].skill;
									evt.redo();
									return;
								}
							}
						} else {
							event.getParent().set("cadingxi_result", false);
							await player.draw("bottom");
						}
						evt.goto(0);
					},
				};
			},
		},
		mod: {
			aiOrder(player, card, num) {
				if (typeof card == "object" && player.isPhaseUsing()) {
					let evt = lib.skill.dcjianying.getLastUsed(player);
					if (evt && evt.card && get.type2(evt.card) && get.type2(evt.card) == get.type2(card)) {
						return num + 10;
					}
				}
			},
		},
		group: "cadingxi_init",
		subSkill: {
			backup2: {
				async precontent(event, trigger, player) {
					const name = event.result?.card?.name;
					const cards = event.result.card?.cards.slice(0);
					event.result.cards = cards;

					const rcard = cards[0];
					let card;
					if (rcard.name == name) {
						card = get.autoViewAs(rcard);
					} else {
						card = get.autoViewAs({ name, isCard: true });
					}

					event.result.card = card;
				},
				filterCard: () => false,
				selectCard: -1,
				log: false,
			},
			backup: {},
			init: {
				trigger: {
					player: "enterGame",
					global: "phaseBefore",
				},
				filter(event, player) {
					if (!player.countCharge(true)) {
						return false;
					}
					return event.name != "phase" || game.phaseNumber == 0;
				},
				forced: true,
				locked: false,
				async content(event, trigger, player) {
					player.addCharge(4);
				},
			},
		},
	},
	//汉末神曹
	cazhaoshao: {
		trigger: {
			player: "damageEnd",
			source: "damageSource",
		},
		getIndex(event) {
			return event.num;
		},
		frequent: true,
		async content(event, trigger, player) {
			await player.draw();
			let targets = [],
				target;
			for (let current of [trigger.source, trigger.player]) {
				if (current?.isIn()) {
					targets.add(current);
				}
			}
			if (!targets.length) {
				return;
			}
			if (targets.length > 1) {
				const result = await player
					.chooseTarget("选择执行【诏绍】的目标", true, (card, player, target) => {
						const trigger = get.event().getTrigger();
						return target == trigger.player || target == trigger.source;
					})
					.set("ai", target => {
						const player = get.player();
						return get.attitude(player, target) * (Math.random() - 0.5);
					})
					.forResult();
				if (!result.bool) {
					return;
				}
				target = result.targets[0];
			} else {
				target = targets[0];
			}
			player.line(target, "green");
			let choices = ["获得弃牌堆或场上一张装备牌并使用", "翻面并摸一张牌", "减少1点体力上限"];
			const { control } = await player
				.chooseControl()
				.set("choiceList", choices)
				.set("prompt", `令${get.translation(target)}执行一项`)
				.set("target", target)
				.set("ai", () => {
					const { player, target } = get.event();
					let eff = 1;
					for (let current of game.players) {
						if (current == target) {
							continue;
						}
						eff += get.effect(current, { name: "losehp" }, current, player);
					}
					if (target.hasSkill("caxiaoxiong") && eff > 0) {
						return "选项二";
					}
					if (get.attitude(player, target) > 0) {
						return target.isTurnedOver() ? "选项二" : "选项一";
					}
					if (!target.isTurnedOver() && Math.random() < 0.2) {
						return "选项二";
					}
					return "选项三";
				})
				.forResult();
			switch (control) {
				case "选项一": {
					let bool = false,
						equip;
					if (
						game.hasPlayer(current => {
							return current.countGainableCards(target, "e");
						})
					) {
						const result2 = await target
							.chooseTarget("获得场上的一张装备牌，或点取消从弃牌堆获得一张装备牌", (card, player, target) => {
								return target.countGainableCards(player, "e");
							})
							.set("ai", target => {
								const player = get.player();
								if (get.attitude(player, target) < 0) {
									if (target.countCards("e", card => get.value(card, player) >= 6)) {
										return 12;
									}
									return 0;
								}
								return 0;
							})
							.forResult();
						if (result2.bool) {
							bool = result2.targets[0];
						}
					}
					if (bool) {
						const result3 = await target.gainPlayerCard(bool, "e", true).forResult();
						equip = result3.links[0];
					} else {
						equip = get.discardPile(card => get.type(card) == "equip" && get.subtypes(card)?.length);
						if (equip) {
							await target.gain(equip, "gain2");
						} else {
							break;
						}
						game.updateRoundNumber();
					}
					target.addSkill("cazhaoshao_equip");
					if (target.getStorage("cazhaoshao_equip").length) {
						let list = target.getStorage("cazhaoshao_equip"),
							equips = target.getCards("e", card => list[1].includes(card));
						if (equips.length) {
							await target.loseToDiscardpile(equips);
							//await lib.skill.cazhaoshao.closeEquip(target, target, list[0]);
							//target.setStorage("cazhaoshao_equip", []);
						}
					}
					const subtypes = get.subtypes(equip);
					await target.expandEquip(subtypes);
					await target.equip(equip);
					target.setStorage("cazhaoshao_equip", [subtypes, [equip]]);
					break;
				}
				case "选项二": {
					await target.turnOver();
					await target.draw();
					break;
				}
				case "选项三": {
					await target.loseMaxHp();
					break;
				}
			}
		},
		closeEquip() {
			const next = game.createEvent("closenEquip");
			next.slots = [];
			for (let i = 0; i < arguments.length; i++) {
				if (get.itemtype(arguments[i]) == "player") {
					if (!next.player) {
						next.player = arguments[i];
					} else {
						next.source = arguments[i];
					}
				} else if (Array.isArray(arguments[i])) {
					for (var arg of arguments[i]) {
						if (typeof arg == "string") {
							if (arg.startsWith("equip") && parseInt(arg.slice(5)) > 0) {
								next.slots.push(arg);
							}
						} else if (typeof arg == "number") {
							next.slots.push("equip" + arg);
						}
					}
				} else if (typeof arguments[i] == "string") {
					if (arguments[i].startsWith("equip") && parseInt(arguments[i].slice(5)) > 0) {
						next.slots.push(arguments[i]);
					}
				} else if (typeof arguments[i] == "number") {
					next.slots.push("equip" + arguments[i]);
				}
			}
			if (!next.player) {
				next.player = get.player();
			}
			if (!next.source) {
				next.source = get.player();
			}
			if (!next.slots.length) {
				_status.event.next.remove(next);
				next.resolve();
			}
			next.setContent(lib.skill.cazhaoshao.closenEquip);
			return next;
		},
		async closenEquip(event, trigger, player) {
			let slotsx = [];
			if (get.is.mountCombined()) {
				event.slots.forEach(type => {
					if (type == "equip3" || type == "equip4") {
						slotsx.add("equip3_4");
					} else {
						slotsx.add(type);
					}
				});
			} else {
				slotsx.addArray(event.slots);
			}
			slotsx.sort();
			for (var slot of slotsx) {
				var expand = get.numOf(event.slots, slot),
					slot_key = slot;
				if (slot == "equip3_4") {
					expand = Math.max(get.numOf(event.slots, "equip3"), get.numOf(event.slots, "equip4"));
					slot_key = "equip3";
				}
				game.log(player, "失去了" + get.cnNumber(expand) + "个额外的", "#g" + get.translation(slot) + "栏");
				if (!player.expandedSlots) {
					player.expandedSlots = {};
				}
				if (!player.expandedSlots[slot_key]) {
					player.expandedSlots[slot_key] = 0;
				}
				player.expandedSlots[slot_key] -= expand;
			}
			player.$syncExpand();
		},
		subSkill: {
			equip: {
				charlotte: true,
				trigger: {
					player: "loseAfter",
					global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"],
				},
				filter(event, player) {
					if (!player.getStorage("cazhaoshao_equip").length) {
						return false;
					}
					const evt = event.getl(player),
						list = player.getStorage("cazhaoshao_equip");
					if (evt?.player === player && evt.es) {
						return evt.es.some(card => list[1].includes(card));
					}
				},
				direct: true,
				forced: true,
				async content(event, trigger, player) {
					await lib.skill.cazhaoshao.closeEquip(player, player.getStorage("cazhaoshao_equip")[0]);
					player.setStorage("cazhaoshao_equip", []);
				},
				mod: {
					canBeReplaced(card, player) {
						const list = player.getStorage("cazhaoshao_equip");
						if (!list.length) {
							return;
						}
						const cards = player.getVCards("e", card => (card?.cards || []).some(cardx => list[1].includes(cardx)));
						if (cards && cards.includes(card)) {
							return false;
						}
					},
				},
				sub: true,
			},
		},
	},
	caxiaoxiong: {
		trigger: {
			player: "turnOverBegin",
		},
		forced: true,
		async content(event, trigger, player) {
			trigger.cancel();
			const targets = game.players.sortBySeat().slice();
			for (let target of targets) {
				if (target == player) {
					continue;
				}
				await target.loseHp();
			}
		},
	},
	//神李郭
	caweijue: {
		forced: true,
		trigger: {
			player: "phaseZhunbeiBegin",
		},
		async content(event, trigger, player) {
			let target = player.getNext();
			while (target != player) {
				if (!target.countCards("h")) {
					target = target.getNext();
					continue;
				}
				const result = await target
					.chooseCard("h", "将任意张手牌当作“威”置于武将牌上", [1, Infinity], true, "allowChooseAll")
					.set("ai", () => {
						return -1;
					})
					.forResult();
				if (result.bool) {
					const cards = result.cards;
					const next = target.addToExpansion(cards, "giveAuto", target);
					next.gaintag.add("caweijue_tag");
					await next;
					target.addSkill("caweijue_tag");
				}
				target = target.getNext();
			}
		},
		mod: {
			inRangeOf(from, to) {
				const num1 = from.countExpansions("caweijue_tag"),
					num2 = from.countCards("h");
				if (num1 <= num2) {
					return true;
				}
			},
			inRange(from, to) {
				const num1 = to.countExpansions("caweijue_tag"),
					num2 = to.countCards("h");
				if (num1 <= num2) {
					return true;
				}
			},
		},
		subSkill: {
			tag: {
				trigger: {
					global: "phaseEnd",
				},
				forced: true,
				popup: false,
				charlotte: true,
				filter(event, player) {
					return player.getExpansions("caweijue_tag").length > 0;
				},
				async content(event, trigger, player) {
					const cards = player.getExpansions("caweijue_tag");
					await player.gain(cards, "draw");
					game.log(player, "收回了" + get.cnNumber(cards.length) + "张“威”牌");
					player.removeSkill("caweijue_tag");
				},
				marktext: "威",
				intro: {
					content: "expansion",
					markcount: "expansion",
				},
			},
		},
	},
	cachuxiong: {
		trigger: {
			player: "phaseUseBegin",
		},
		filter(event, player) {
			return player.countCards("h");
		},
		check(event, player) {
			const colors = player
				.getCards("h")
				.map(card => get.color(card, player))
				.toUniqued();
			for (let color of colors) {
				if (lib.skill.cachuxiong.getVal(color, player) > 0) {
					return true;
				}
			}
			return false;
		},
		getVal(color, player) {
			let val = 0,
				cards = player.getCards("h", { color: color });
			val -= cards.length;
			if (color == "black") {
				val += Math.min(
					cards.length,
					game.players.reduce((sum, current) => {
						if (get.attitude(player, current) > 0) {
							return sum;
						}
						return sum + current.countExpansions("caweijue_tag");
					}, 0)
				);
				val++;
			} else if (color == "red") {
				val += game.players.reduce((sum, current) => {
					if (!player.inRange(current) || player == current) {
						return sum;
					}
					return sum + get.damageEffect(current, player, player);
				}, 0);
			}
			return val;
		},
		async content(event, trigger, player) {
			await player.showHandcards(`${get.translation(player)}发动了【除凶】`);
			let colors = player
				.getCards("h")
				.map(card => get.color(card, player))
				.toUniqued();
			if (!colors.length) {
				return;
			}
			colors.sort((a, b) => lib.skill.cachuxiong.getVal(b, player) - lib.skill.cachuxiong.getVal(a, player));
			const result = await player
				.chooseControl(colors)
				.set("prompt", "弃置一种颜色的所有手牌")
				.set("resultC", colors[0])
				.set("ai", () => {
					return get.event().resultC;
				})
				.forResult();
			if (result.control) {
				const color = result.control,
					cards = player.getDiscardableCards(player, "h").filter(card => get.color(card, player) == color);
				if (cards.length) {
					await player.discard(cards);
				}
				if (color == "black") {
					let num = cards.length;
					while (num > 0) {
						if (!game.hasPlayer(current => current.countExpansions("caweijue_tag") > 0)) {
							break;
						}
						const result2 = await player
							.chooseTarget("获得一名角色的“威”", true, (card, player, target) => {
								return target.countExpansions("caweijue_tag");
							})
							.set("ai", target => {
								const player = get.player();
								return -get.attitude(player, target);
							})
							.forResult();
						if (!result2.bool) {
							break;
						}
						const target = result2.targets[0];
						const result3 = await player.chooseCardButton(`选择获得至多${get.cnNumber(num)}张“威”`, [1, num], target.getExpansions("caweijue_tag"), true).forResult();
						if (!result3.bool) {
							break;
						}
						const cards = result3.links;
						player.line(target);
						await player.gain(cards, "give", target, "bySelf");
						num -= cards.length;
					}
				} else if (color == "red") {
					const targets = game
						.filterPlayer(current => {
							return current != player && player.inRange(current);
						})
						.sortBySeat();
					if (targets.length) {
						for (let target of targets) {
							await target.damage();
						}
					}
				}
			}
		},
	},
	//长安樊稠
	caxingwei: {
		audio: "xinfu_xingluan",
		trigger: {
			player: "gainAfter",
			global: "loseAsyncAfter",
		},
		frequent: true,
		filter(event, player) {
			return event.getg(player).some(i => get.owner(i) == player && get.color(i, player) == "red");
		},
		async content(event, trigger, player) {
			const cards = trigger.getg(player).filter(i => {
				return get.owner(i) == player && get.color(i, player) == "red";
			});
			await player.showCards(cards, `${get.translation(player)}发动了【兴威】`);
			await player.draw(cards.length, "nodelay");
		},
		subfrequent: ["gain"],
		group: "caxingwei_gain",
		subSkill: {
			gain: {
				trigger: {
					player: ["phaseZhunbeiBegin", "damageEnd"],
				},
				prompt2: "获得弃牌堆里的一张红色牌",
				frequent: true,
				async content(event, trigger, player) {
					const card = get.discardPile(card => get.color(card, false) == "red");
					if (card) {
						await player.gain(card, "gain2");
					}
				},
			},
		},
	},
	caqianmu: {
		enable: ["chooseToUse", "chooseToRespond"],
		filter(event, player) {
			if (!player.countCards("hse")) {
				return false;
			}
			for (let i of lib.inpile) {
				let type = get.type2(i);
				if (!event.filterCard(get.autoViewAs({ name: i }, "unsure"), player, event)) {
					continue;
				}
				if (!player.countCards("hes", { suit: type == "basic" ? "diamond" : "heart" })) {
					continue;
				}
				if (["basic", "trick"].includes(type) && !player.getStorage("caqianmu_used").includes(type)) {
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
					if (!event.filterCard(get.autoViewAs({ name: name }, "unsure"), player, event)) {
						continue;
					}
					let type = get.type2(name);
					if (!["basic", "trick"].includes(type)) {
						continue;
					}
					if (!player.countCards("hes", { suit: type == "basic" ? "diamond" : "heart" })) {
						continue;
					}
					if (player.getStorage("caqianmu_used").includes(type)) {
						continue;
					}
					if (name == "sha") {
						list.push([type, "", "sha"]);
						for (let nature of lib.inpile_nature) {
							if (event.filterCard(get.autoViewAs({ name, nature }, "unsure"), player, event)) {
								list.push([type, "", "sha", nature]);
							}
						}
					} else {
						list.push([type, "", name]);
					}
				}
				return ui.create.dialog("浅目", [list, "vcard"]);
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
					filterCard(card, player) {
						return get.suit(card, player) == (links[0][0] == "basic" ? "diamond" : "heart");
					},
					audio: "caqianmu",
					popname: true,
					check(card) {
						return 8 - get.value(card);
					},
					position: "hse",
					viewAs: { name: links[0][2], nature: links[0][3] },
					precontent() {
						player.addTempSkill("caqianmu_used");
						player.markAuto("caqianmu_used", get.type2(event.result.card));
						player.showCards(event.result.cards);
					},
				};
			},
			prompt(links, player) {
				const suit = links[0][0] == "basic" ? "diamond" : "heart";
				return `将一张${get.translation(suit)}牌当做${get.translation(links[0][3]) || ""}${get.translation(links[0][2])}使用或打出`;
			},
		},
		hiddenCard(player, name) {
			if (!lib.inpile.includes(name)) {
				return false;
			}
			const type = get.type2(name),
				suit = type == "basic" ? "diamond" : "heart";
			return (type == "basic" || type == "trick") && !player.getStorage("caqianmu_used").includes(type) && player.countCards("she", { suit: suit });
		},
		ai: {
			fireAttack: true,
			respondSha: true,
			respondShan: true,
			skillTagFilter(player) {
				if (player.getStorage("caqianmu_used").includes("basic") || !player.countCards("she", { suit: "diamond" })) {
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
				onremove: true,
				charlotte: true,
			},
			backup: {},
		},
	},
	//长安张济
	casilve: {
		audio: "xinfu_tunjun",
		trigger: { player: "phaseDrawBegin1" },
		filter(event, player) {
			return !event.numFixed;
		},
		async cost(event, trigger, player) {
			const result = await player
				.chooseTarget(
					get.prompt(event.skill),
					"改为获得任意名角色至多两张牌",
					[1, 2],
					(card, player, target) => {
						return target.countCards("h") > 0;
					},
					target => {
						const att = get.attitude(_status.event.player, target);
						if (target.hasSkill("tuntian")) {
							return att / 10;
						}
						return 1 - att;
					}
				)
				.forResult();
			event.result = result;
		},
		async content(event, trigger, player) {
			const targets = event.targets;
			if (targets.length > 1) {
				await player.gainMultiple(targets, "he");
			} else {
				await player.gainPlayerCard(targets[0], [1, 2], "he", true);
			}
			trigger.changeToZero();
			const num = Math.min(
				player
					.getHistory("gain", evt => {
						return evt.getParent(event.name) == event;
					})
					.reduce((sum, evt) => (sum += evt.cards?.length || 0), 0),
				player.countCards("he")
			);
			const result = await player
				.chooseCard("he", `肆掠：将${get.cnNumber(num)}置于武将牌上`, num, true)
				.set("ai", card => 7 - get.value(card))
				.forResult();
			if (result.bool) {
				const next = player.addToExpansion(result.cards, player, "giveAuto");
				next.gaintag.add(event.name);
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
		ai: {
			threaten: 2,
			expose: 0.3,
			ai: { combo: "casuibian" },
		},
	},
	casuibian: {
		audio: "xinfu_lveming",
		trigger: { global: "useCard" },
		filter(event, player) {
			const suit = get.suit(event.card, event.player);
			return player.getExpansions("casilve").some(card => get.suit(card, false) == suit);
		},
		async cost(event, trigger, player) {
			const suit = get.suit(trigger.card, trigger.player);
			const result = await player
				.chooseButton([
					get.prompt(event.skill, trigger.player),
					[
						[
							["damage", `弃置所有花色为${get.translation(suit)}的“掠”，对其造成1点伤害`],
							["draw", "与其各摸一张牌"],
							["losehp", `失去1点体力并令${get.translation(trigger.card)}失效，然后将此牌交给一名角色并摸一张牌`],
						],
						"textbutton",
					],
				])
				.set("ai", button => {
					const { player } = get.event(),
						trigger = get.event().getTrigger();
					switch (button.link) {
						case "damage": {
							return get.damageEffect(trigger.player, player, player) / 10;
						}
						case "draw": {
							return 2;
						}
						case "losehp": {
							let eff = 1 + get.effect(player, { name: "losehp" }, player, player);
							if (trigger.targets?.length) {
								for (let target of trigger.targets) {
									eff -= get.effect(target, trigger.card, player, player);
								}
							}
							return eff;
						}
					}
					return 0;
				})
				.forResult();
			event.result = {
				bool: result.bool,
				cost_data: result.bool ? result.links[0] : null,
			};
		},
		async content(event, trigger, player) {
			const sel = event.cost_data;
			switch (sel) {
				case "damage": {
					const cards = player.getExpansions("casilve").filter(card => {
						return get.suit(card, false) == get.suit(trigger.card, trigger.player);
					});
					if (cards.length) {
						await player.loseToDiscardpile(cards);
					}
					player.line(trigger.player, "green");
					await trigger.player.damage();
					break;
				}
				case "draw": {
					await game.asyncDraw([player, trigger.player]);
					break;
				}
				case "losehp": {
					await player.loseHp();
					trigger.targets.length = 0;
					trigger.all_excluded = true;
					if (trigger.cards.length) {
						const result = await player
							.chooseTarget(`随变：令一名角色获得${get.translation(trigger.cards)}`, true)
							.set("ai", target => {
								const player = get.player();
								return get.attitude(player, target);
							})
							.forResult();
						if (result.bool) {
							await result.targets[0].gain(trigger.cards, "gain2");
						}
					}
					await player.draw();
					break;
				}
			}
		},
		ai: { combo: "casilve" },
	},
	//长安郭汜
	casixi: {
		audio: "xinfu_sidao",
		enable: "phaseUse",
		usable: 2,
		filterTarget(card, player, target) {
			return player.canCompare(target);
		},
		filter(event, player) {
			return game.hasPlayer(current => player.canCompare(current));
		},
		async content(event, trigger, player) {
			const { bool } = await player.chooseToCompare(event.target).forResult();
			if (bool) {
				const card = new lib.element.VCard({ name: "sha", nature: "stab", isCard: true });
				if (player.hasUseTarget(card)) {
					await player.chooseUseTarget(card, false);
				}
			} else {
				player.addTempSkill("casixi_distance", { player: "phaseBegin" });
				let list = player.getStorage("casixi_distance");
				player.setStorage("casixi_distance", list.concat([event.target]), true);
			}
		},
		ai: {
			order(name, player) {
				return get.order({ name: "sha" }) - 1;
			},
			result: {
				target(player, target) {
					if (target.countCards("h") == 1) {
						return -1;
					}
					return -0.5;
				},
			},
			threaten: 1.3,
		},
		subfrequent: ["gain"],
		group: "casixi_gain",
		subSkill: {
			gain: {
				audio: "casixi",
				trigger: {
					global: ["chooseToCompareAfter", "compareMultipleAfter"],
				},
				frequent(event, player) {
					const bool = event.compareMeanwhile || event.compareMultiple,
						cards = bool ? event.cards : [event.card1, event.card2];
					return !cards.filterInD("od").some(card => card.name == "du");
				},
				filter(event, player) {
					const bool = event.compareMeanwhile || event.compareMultiple,
						cards = bool ? event.cards : [event.card1, event.card2];
					return cards.someInD("od");
				},
				prompt2(event, player) {
					const bool = event.compareMeanwhile || event.compareMultiple,
						cards = bool ? event.cards : [event.card1, event.card2];
					return `获得${get.translation(cards.filterInD("od"))}`;
				},
				async content(event, trigger, player) {
					const bool = trigger.compareMeanwhile || trigger.compareMultiple,
						cards = bool ? trigger.cards : [trigger.card1, trigger.card2];
					await player.gain(cards.filterInD("od"), "gain2");
				},
			},
			distance: {
				intro: {
					markcount: () => null,
					content(storage, player) {
						if (!storage || !storage.length) {
							return "无记录";
						}
						let str = "直到你的下回合开始：";
						let list = [];
						for (let target of game.players) {
							if (storage.includes(target)) {
								str += `<br>${get.translation(target)}计算与你的距离+${storage.filter(i => i == target).length}`;
							}
						}
						return str;
					},
				},
				onremove: true,
				mod: {
					globalTo(from, to, distance) {
						return distance + to.getStorage("casixi_distance")?.filter(i => i == from)?.length;
					},
				},
			},
		},
	},
	calvedao: {
		audio: "xinfu_tanbei",
		trigger: {
			source: "damageBegin1",
		},
		filter(event, player) {
			return event.card?.name == "sha";
		},
		logTarget: "player",
		async content(event, trigger, player) {
			await player.gainPlayerCard(trigger.player, "he", true);
			await trigger.player.loseMaxHp();
			await trigger.player.addSkills("bixiong");
		},
		derivation: "bixiong",
	},
	//长安李傕
	cacuixi: {
		audio: "xinfu_langxi",
		enable: "phaseUse",
		usable: 2,
		filterCard: lib.filter.cardDiscardable,
		filter(event, player) {
			return player.countCards("h");
		},
		position: "h",
		selectCard: [1, Infinity],
		check(card) {
			if (ui.selected?.cards?.length >= 3) {
				return 0;
			}
			return 4 - get.value(card);
		},
		allowChooseAll: true,
		async content(event, trigger, player) {
			const num = event.cards.length,
				targets = game.filterPlayer(current => current.hp < player.hp);
			if (!targets.length) {
				return;
			}
			let result =
				targets.length > 2
					? await player
							.chooseTarget(
								"摧袭：与两名体力值小于你的角色各展示牌堆顶一张牌",
								(card, player, target) => {
									return target.hp < player.hp;
								},
								2,
								true
							)
							.set("ai", target => {
								return get.damageEffect(target, get.player(), get.player());
							})
							.forResult()
					: { bool: true, targets: targets };

			let list = [player];
			if (result?.targets?.length) {
				list.addArray(result.targets);
			}
			list = list.toUniqued().sortBySeat(player);
			let cardMap = [];
			for (let i = 0; i < list.length; i++) {
				let cards = get.cards();
				await game.cardsGotoOrdering(cards);
				await list[i].showCards(cards, get.translation(list[i]) + "发动了【摧袭】");
				cardMap.push([cards[0], get.number(cards[0], false), list[i]]);
				if (player == list[i] && get.number(cards[0], false) == 1) {
					player.chat("这河里吗？");
				}
			}
			result = await player
				.chooseBool()
				.set("createDialog", [
					`摧袭：是否令你的点数+${num}？`,
					[
						cardMap,
						(item, type, position, noclick, node) => {
							node = ui.create.buttonPresets.card(item[0], type, position, noclick);
							game.createButtonCardsetion(item[2].getName(true) + item[1], node);
							return node;
						},
					],
				])
				.set(
					"choice",
					(() => {
						const max = cardMap.map(item => item[1]).maxBy(i => i);
						let bool = false;
						for (const [card, number, target] of cardMap) {
							if (player == target && number <= max) {
								bool = true;
								break;
							}
						}
						if (bool) {
							return true;
						}
						const list = cardMap.map(item => item[2]);
						if (list.remove(player).every(current => get.damageEffect(current, player, player) > 0)) {
							return true;
						}
						return false;
					})()
				)
				.forResult();
			if (result?.bool) {
				player.popup(num);
				game.log(player, "选择作弊使其展示牌点数+", `#g${num}`);
				cardMap = cardMap.map(item => {
					let [card, number, target] = item;
					if (player == target) {
						return [card, number + num, target];
					}
					return item;
				});
			}
			const max = cardMap.map(item => item[1]).maxBy(i => i);
			for (const [card, number, target] of cardMap) {
				target.popup(number);
				game.log(target, "本次展示牌点数为", `#g${number}`);
				if (number < max) {
					player.line(target, "green");
					await target.damage(2);
				}
			}
		},
		ai: {
			order: 9,
			result: {
				player(player, target) {
					if (player.hp <= 2) {
						return 0;
					}
					return game.countPlayer(current => {
						return get.damageEffect(current, player, player) > 0 && current.hp < player.hp;
					});
				},
			},
		},
	},
	cajujun: {
		enable: "phaseUse",
		limited: true,
		skillAnimation: true,
		animationColor: "metal",
		manualConfirm: true,
		filter(event, player) {
			return Math.min(player.hp, player.countCards("h")) < player.maxHp;
		},
		async content(event, trigger, player) {
			player.awakenSkill(event.name);
			await player.recoverTo(player.maxHp);
			await player.drawTo(player.maxHp);
			player.addTempSkill("cajujun_norecover", { source: "dieAfter" });
		},
		ai: {
			order: 2,
			result: {
				player(player, target) {
					if (Math.min(player.hp, player.countCards("h")) > 2) {
						return 0;
					}
					return 1;
				},
			},
		},
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
		},
	},
	//长安吕布
	caliyu: {
		audio: "liyu",
		enable: "phaseUse",
		usable: 2,
		filter(event, player) {
			return game.hasPlayer(current => {
				return current != player && current.countGainableCards(player, "he");
			});
		},
		filterTarget(card, player, target) {
			return target != player && target.countGainableCards(player, "he");
		},
		async content(event, trigger, player) {
			const target = event.target;
			await player.gainPlayerCard(target);
			player.addTempSkill("caliyu_damage");
			player.addMark("caliyu_damage", 1, false);
			const card = new lib.element.VCard({ name: "juedou", isCard: true });
			if (target.canUse(card, player)) {
				await target.useCard(card, player, "noai");
			}
		},
		ai: {
			order: 8,
			result: {
				target(player, target) {
					return get.effect(target, { name: "shunshou_copy2" }, player, target);
				},
				player(player, target) {
					return get.effect(player, { name: "juedou" }, target, player) / 2;
				},
			},
		},
		subSkill: {
			damage: {
				trigger: {
					source: "damageBegin1",
				},
				filter(event, player) {
					return player.countMark("caliyu_damage") && event.card && ["sha", "juedou"].includes(event.card.name);
				},
				intro: {
					content: "使用【杀】和【决斗】造成的伤害+$",
				},
				audio: "caliyu",
				onremove: true,
				forced: true,
				async content(event, trigger, player) {
					trigger.num += player.countMark(event.name);
				},
			},
		},
	},
	//长安王允
	calianji: {
		audio: "wylianji",
		enable: "phaseUse",
		usable: 1,
		filterTarget: lib.filter.notMe,
		async content(event, trigger, player) {
			const target = event.target;
			await target.draw();
			const list = get.inpileVCardList(info => {
				const card = new lib.element.VCard({ name: info[2], nature: info[3], isCard: true });
				if (!get.tag(card, "damage") || !["basic", "trick"].includes(get.type(card, false))) {
					return false;
				}
				return target.hasUseTarget(card);
			});
			if (!list.length) {
				return;
			}
			const result = await player
				.chooseButton([`连计：选择要令${get.translation(target)}使用的牌`, [list, "vcard"]], true)
				.set("ai", button => {
					const card = new lib.element.VCard({ name: button.link[2], nature: button.link[3], isCard: true }),
						{ player, target } = get.event();
					return target.getUseValue(card) * get.attitude(player, target);
				})
				.set("target", target)
				.forResult();
			if (result.bool) {
				const card = new lib.element.VCard({ name: result.links[0][2], nature: result.links[0][3], isCard: true });
				if (target.hasUseTarget(card)) {
					await target.chooseUseTarget(card, true);
				}
			}
		},
		ai: {
			order: 6,
			result: {
				target: 1,
			},
		},
	},
	camoucheng: {
		audio: "moucheng",
		trigger: {
			global: "damageSource",
		},
		filter(event, player) {
			let num = 0;
			const historys = _status.globalHistory;
			refrain: for (let history of historys) {
				const evts = history.everything;
				for (let evt of evts) {
					if (evt.name == "damage" && evt.card && evt.getParent(4)?.name == "calianji") {
						num += evt.num || 0;
					}
					if (num >= 3) {
						break refrain;
					}
				}
			}
			return num >= 3;
		},
		forced: true,
		juexingji: true,
		skillAnimation: true,
		animationColor: "gray",
		async content(event, trigger, player) {
			player.awakenSkill(event.name);
			await player.gainMaxHp();
			await player.removeSkills("calianji");
			await player.recover();
			await player.addSkills("cajingong");
		},
		derivation: "cajingong",
	},
	cajingong: {
		audio: "jingong",
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return player.countCards("hes", function (card) {
				return card.name == "sha" || get.type(card) == "equip";
			});
		},
		chooseButton: {
			dialog(event, player) {
				let list = get
					.inpile("trick")
					.concat(["wy_meirenji", "wy_xiaolicangdao"])
					.map(i => ["锦囊", "", i]);
				return ui.create.dialog("矜功", [list, "vcard"]);
			},
			filter(button, player) {
				return lib.filter.filterCard({ name: button.link[2] }, player, _status.event.getParent());
			},
			check(button) {
				return _status.event.player.getUseValue({ name: button.link[2] });
			},
			backup(links, player) {
				return {
					audio: "cajingong",
					popname: true,
					position: "hes",
					viewAs: { name: links[0][2] },
					check(card) {
						return 6 - get.value(card);
					},
					filterCard(card) {
						return card.name == "sha" || get.type(card) == "equip";
					},
					precontent() {
						player.addTempSkill("cajingong_benghuai");
					},
				};
			},
			prompt(links, player) {
				return "将一张【杀】或装备牌当做" + get.translation(links[0][2]) + "使用";
			},
		},
		onremove(player) {
			player.removeSkill("cajingong_benghuai");
		},
		ai: {
			order: 2,
			result: {
				player: 1,
			},
		},
		subSkill: {
			benghuai: {
				trigger: {
					player: "phaseEnd",
				},
				charlotte: true,
				forced: true,
				locked: false,
				filter(event, player) {
					return !player.getHistory("sourceDamage").length;
				},
				async content(event, trigger, player) {
					await player.loseHp();
				},
			},
		},
	},
	//神贾诩
	zombiesangluan: {
		trigger: { player: "useCardAfter" },
		filter(event, player) {
			return get.is.damageCard(event.card) && game.hasPlayer(current => current !== player);
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(
					get.prompt2(event.skill),
					(card, player, target) => {
						return Boolean(ui.selected.targets.length) || target !== player;
					},
					2
				)
				.set("ai", target => {
					const player = get.player();
					const source = ui.selected.targets[0];
					if (!source) {
						return Math.max(
							...game
								.filterPlayer(current => current !== player)
								.map(current => {
									let list = [get.effect(target, { name: "losehp" }, player, player) + get.recoverEffect(player, player, player)];
									let cards = target.getCards("h", card => get.name(card) === "sha" && target.canUse(card, current));
									if (cards.length) {
										cards.sort((a, b) => get.effect(current, b, target, target) - get.effect(current, a, target, target));
										list.push(get.effect(current, cards[0], target, player));
									}
									return Math.max(...list);
								})
						);
					}
					let list = [get.effect(source, { name: "losehp" }, player, player) + get.recoverEffect(player, player, player)];
					let cards = source.getCards("h", card => get.name(card) === "sha" && source.canUse(card, target));
					if (cards.length) {
						cards.sort((a, b) => get.effect(target, b, source, source) - get.effect(target, a, source, source));
						list.push(get.effect(target, cards[0], source, player));
					}
					return Math.max(...list);
				})
				.set("complexTarget", true)
				.forResult();
		},
		line: false,
		async content(event, trigger, player) {
			player.line2(event.targets);
			await game.delayx();
			const [source, target] = event.targets;
			const result = await source
				.chooseToUse(
					function (card, player, event) {
						if (get.name(card) !== "sha") {
							return false;
						}
						return lib.filter.filterCard.apply(this, arguments);
					},
					get.translation(event.name) + "：对" + get.translation(target) + "使用一张【杀】，或失去1点体力且" + get.translation(player) + "回复1点体力"
				)
				.set("filterTarget", function (card, player, target) {
					const source = get.event().sourcex;
					if (target !== source && !ui.selected.targets.includes(source)) {
						return false;
					}
					return lib.filter.filterTarget.apply(this, arguments);
				})
				.set("sourcex", target)
				.set("targetRequired", true)
				.set("complexSelect", true)
				.set("complexTarget", true)
				.forResult();
			if (!result?.bool) {
				await source.loseHp();
				await player.recover();
			}
		},
	},
	zombieshibao: {
		enable: "phaseUse",
		filter(event, player) {
			return game.hasPlayer(target => get.info("zombieshibao").filterTarget(null, player, target));
		},
		filterTarget(card, player, target) {
			return get.is.playerNames(target, "zombie_zombie") && target.getHp() > 0;
		},
		async content(event, trigger, player) {
			const target = event.target;
			if (target.getHp() > 0) {
				const targets = game.filterPlayer(current => [current.getPrevious(), current.getNext()].includes(target));
				await target.loseHp(target.getHp());
				if (targets.length > 0) {
					player.line(targets);
					for (const i of targets) {
						await i.damage();
					}
				}
			}
		},
		ai: {
			order: 7,
			result: {
				player(player, target) {
					return (
						game.countPlayer(current => {
							if (![current.getPrevious(), current.getNext()].includes(target)) {
								return 0;
							}
							return get.damageEffect(current, player, player);
						}) +
						get.effect(target, { name: "losehp" }, player, player) * target.getHp()
					);
				},
			},
		},
	},
	zombiechuce: {
		enable: "chooseToUse",
		filter(event, player) {
			return get
				.inpileVCardList(info => {
					return ["basic", "trick", "delay"].includes(info[0]);
				})
				.some(info =>
					player.hasCard(cardx => {
						if (get.type2(cardx) !== "trick") {
							return false;
						}
						const card = get.autoViewAs({ name: info[2], nature: info[3], storage: { zombiechuce: true }, cards: [cardx] }, [cardx]);
						return event.filterCard(card, player, event);
					}, "hes")
				);
		},
		chooseButton: {
			dialog(event, player) {
				const list = get.inpileVCardList(info => ["basic", "trick", "delay"].includes(info[0]));
				return ui.create.dialog("出策", [list, "vcard"]);
			},
			filter(button, player) {
				const event = get.event().getParent();
				return player.hasCard(cardx => {
					if (get.type2(cardx) !== "trick") {
						return false;
					}
					const card = get.autoViewAs({ name: button.link[2], nature: button.link[3], storage: { zombiechuce: true }, cards: [cardx] }, [cardx]);
					return event.filterCard(card, player, event);
				}, "hes");
			},
			check(button) {
				if (get.event().getParent().type != "phase") {
					return 1;
				}
				return get.player().getUseValue({ name: button.link[2], nature: button.link[3] }, false);
			},
			prompt(links, player) {
				return "将一张锦囊牌当作" + (get.translation(links[0][3]) || "") + "【" + get.translation(links[0][2]) + "】使用";
			},
			backup(links, player) {
				return {
					filterCard(card, player) {
						return get.type2(card) === "trick";
					},
					popname: true,
					check(card) {
						return 6 - get.value(card);
					},
					position: "hes",
					async precontent(event, trigger, player) {
						event.getParent().addCount = false;
					},
					viewAs: {
						name: links[0][2],
						nature: links[0][3],
						storage: {
							zombiechuce: true,
						},
					},
				};
			},
		},
		hiddenCard(player, name) {
			if (!lib.inpile.includes(name) || !["basic", "trick", "delay"].includes(get.type(name))) {
				return false;
			}
			return player.hasCard(card => {
				if (_status.connectMode && get.position(card) === "h") {
					return true;
				}
				return get.type2(card) === "trick";
			}, "hes");
		},
		locked: false,
		mod: {
			cardUsable(card, player) {
				if (card?.storage?.zombiechuce) {
					return Infinity;
				}
			},
			targetInRange(card, player) {
				if (card?.storage?.zombiechuce) {
					return true;
				}
			},
		},
		ai: {
			fireAttack: true,
			respondSha: true,
			skillTagFilter(player, tag, arg) {
				if (arg == "respond") {
					return false;
				}
				if (!player.countCards("hes")) {
					return false;
				}
			},
			order(item, player) {
				if (player && _status.event.type == "phase" && player.hasValueTarget({ name: "sha" }, true, true)) {
					let max = 0,
						names = get.inpileVCardList(info => {
							const name = info[2];
							if (name != "sha" && name != "jiu") {
								return false;
							}
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
						max += 15;
					}
					return max;
				}
				return 0.5;
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
		group: "zombiechuce_kanpo",
		subSkill: {
			backup: {},
			kanpo: {
				trigger: { global: "useCard" },
				filter(event, player) {
					return get.type2(event.card) === "trick" && event.player !== player;
				},
				usable: 1,
				check: (event, player) => get.info("sbkanpo").subSkill.kanpo.check(event, player),
				prompt2: event => "摸三张牌，令" + get.translation(event.card) + "无效，然后你可以视为使用此牌",
				logTarget: "player",
				async content(event, trigger, player) {
					await player.draw(3);
					trigger.targets.length = 0;
					trigger.all_excluded = true;
					game.log(trigger.card, "被无效了");
					const card = new lib.element.VCard({ name: trigger.card.name, nature: trigger.card.nature, isCard: true });
					if (get.type(card) !== "delay" && player.hasUseTarget(card)) {
						await player.chooseUseTarget(card, null, false);
					}
				},
			},
		},
	},
	zombielongmu: {
		trigger: { global: ["die", "recoverBefore"] },
		filter(event, player) {
			const target = event.player;
			if (event.name === "recover") {
				return _status.currentPhase === player && target !== player;
			}
			if (get.is.playerNames(target, "zombie_zombie")) {
				return false;
			}
			if (event.reserveOut || player.maxHp <= 0) {
				return false;
			}
			return player.hasAllHistory("useSkill", evt => {
				if (evt.type !== "player") {
					return false;
				}
				if (!Array.isArray(evt.targets) || !evt.targets.includes(target)) {
					return false;
				}
				let skill = evt.skill,
					info = get.info(skill);
				if (!info || info.charlotte) {
					return false;
				}
				if (skill === get.sourceSkillFor(skill)) {
					return true;
				}
				info = get.info(get.sourceSkillFor(skill));
				return info && !info.charlotte;
			});
		},
		forceDie: true,
		forced: true,
		logTarget: "player",
		async content(event, trigger, player) {
			const target = trigger.player;
			trigger.cancel();
			if (trigger.name === "die") {
				const names = get.nameList(target).filter(i => i !== "zombie_zombie");
				const result =
					names.length > 1
						? await player
								.chooseControl(names)
								.set("ai", () => {
									const { controls } = get.event();
									return controls.slice().sort((a, b) => get.rank(b, true) - get.rank(a, true))[0];
								})
								.set("prompt", "请选择替换的武将牌")
								.forResult()
						: { control: names[0] };
				if (result.control) {
					game.broadcastAll(player => player.revive(2), target);
					let doubleDraw = false;
					let num = (get.character("zombie_zombie").maxHp || get.character("zombie_zombie").hp) - (get.character(result.control).maxHp || get.character(result.control).hp);
					if (num !== 0) {
						if (typeof target.singleHp === "boolean") {
							if (num % 2 !== 0) {
								if (target.singleHp) {
									target.maxHp += (num + 1) / 2;
									target.singleHp = false;
								} else {
									target.maxHp += (num - 1) / 2;
									target.singleHp = true;
									doubleDraw = true;
								}
							} else {
								target.maxHp += num / 2;
							}
						} else {
							target.maxHp += num;
						}
						target.update();
					}
					event.skills = get.character(result.control).skills || [];
					await target.reinitCharacter(result.control, "zombie_zombie");
					if (doubleDraw) {
						await target.doubleDraw();
					}
				}
			}
		},
		group: "zombielongmu_weimu",
		global: "zombielongmu_global",
		subSkill: {
			weimu: {
				trigger: { target: "useCardToTarget", player: "addJudgeBefore" },
				filter(event, player) {
					return event.name === "addJudge" || get.type2(event.card) === "trick";
				},
				forced: true,
				priority: 15,
				content() {
					if (trigger.name === "addJudge") {
						trigger.cancel();
						game.log(trigger.card, "进入了弃牌堆");
						const owner = get.owner(trigger.card);
						if (owner?.getCards("hejxs").includes(trigger.card)) {
							owner.lose(trigger.card, ui.discardPile);
						} else {
							game.cardsDiscard(trigger.card);
						}
					} else {
						trigger.getParent().targets.remove(player);
						game.log(trigger.card, "对", player, "无效");
					}
				},
				ai: {
					effect: {
						target(card, player, target) {
							if (get.type2(card) === "trick") {
								return "zeroplayertarget";
							}
						},
					},
				},
			},
			global: {
				ai: {
					effect: {
						target(card, player, target2) {
							const target = _status.currentPhase;
							if (target?.hasSkill("zombielongmu") && target !== player && get.tag(card, "recover")) {
								return "zeroplayertarget";
							}
						},
					},
				},
			},
		},
	},
	zombieshibian: {
		trigger: { player: "changeCharacterAfter" },
		filter(event, player) {
			return event.getParent().name === "zombielongmu" || event.getParent().name === "zombieganran";
		},
		forced: true,
		async content(event, trigger, target) {
			let { player, skills } = trigger.getParent();
			player = player["zombieshibian"] || player;
			if (skills.length) {
				await target.addSkills(skills);
			}
			game.broadcastAll(
				(player, target) => {
					target["zombieshibian"] = player;
					const identity = (target.identity = (identity => {
						switch (identity) {
							case "zhu":
							case "mingzhong":
								return "zhong";
							case "zhu_false":
								return "zhong_false";
							case "bZhu":
								return "bZhong";
							case "rZhu":
								return "rZhong";
							default:
								return identity;
						}
					})(player.identity));
					if (!lib.translate[identity]) {
						lib.translate[identity] = "尸";
					}
					const goon = player !== game.me && target !== game.me && player.node.identity.classList.contains("guessing") && !player.identityShown;
					if (goon) {
						if (target.identityShown) {
							delete target.identityShown;
						}
						if (!target.node.identity.classList.contains("guessing")) {
							target.node.identity.classList.add("guessing");
						}
					}
					target.setIdentity(goon ? "cai" : undefined);
					if (target.node.dieidentity) {
						target.node.dieidentity.innerHTML = get.translation(target.identity + 2);
					}
					if (typeof player.ai?.shown === "number" && target.ai) {
						target.ai.shown = player.ai.shown;
					}
					if (typeof player.side == "boolean") {
						target.side = player.side;
						target.node.identity.firstChild.innerHTML = player.node.identity.firstChild.innerHTML;
						target.node.identity.dataset.color = player.node.identity.dataset.color;
					}
					if (_status._zombieshibian) {
						return;
					}
					_status.zombieshibian = true;
					//检测游戏胜负
					if (typeof game.checkResult === "function") {
						const origin_checkResult = game.checkResult;
						game.checkResult = function () {
							const player = game.me._trueMe || game.me;
							if (game.players.filter(i => i !== player).every(i => i["zombieshibian"] === (player["zombieshibian"] || player))) {
								game.over(true);
							}
							return origin_checkResult.apply(this, arguments);
						};
					}
					if (typeof game.checkOnlineResult === "function") {
						const origin_checkOnlineResult = game.checkOnlineResult;
						game.checkOnlineResult = function (player) {
							if (game.players.filter(i => i !== player).every(i => i["zombieshibian"] === (player["zombieshibian"] || player))) {
								return true;
							}
							return origin_checkOnlineResult.apply(this, arguments);
						};
					}
					/*/检测态度
					if (typeof get.attitude === "function") {
						const origin_attitude = get.attitude;
						get.attitude = function (from, to) {
							if ((from["zombieshibian"] || from) === (to["zombieshibian"] || to)) {
								return 114514;
							}
							return origin_attitude.apply(this, arguments);
						};
					}
					if (typeof get.rawAttitude === "function") {
						const origin_rawAttitude = get.rawAttitude;
						get.rawAttitude = function (from, to) {
							if ((from["zombieshibian"] || from) === (to["zombieshibian"] || to)) {
								return 114514;
							}
							return origin_rawAttitude.apply(this, arguments);
						};
					}*/
					//敌友判定
					//实际上只是友方，敌方不用写
					if (typeof lib.element.player.getFriends === "function") {
						const origin_getFriends = lib.element.player.getFriends;
						const getFriends = function (func, includeDie) {
							const player = this;
							return [...origin_getFriends.apply(this, arguments), ...game[includeDie ? "filterPlayer2" : "filterPlayer"](target => (target["zombieshibian"] || target) === (player["zombieshibian"] || player))]
								.filter(i => i !== player || func === true)
								.unique()
								.sortBySeat(player);
						};
						lib.element.player.getFriends = getFriends;
						[...game.players, ...game.dead].forEach(i => (i.getFriends = getFriends));
					}
					if (typeof lib.element.player.isFriendOf === "function") {
						const origin_isFriendOf = lib.element.player.isFriendOf;
						const isFriendOf = function (player) {
							if ((this["zombieshibian"] || this) === (player["zombieshibian"] || player)) {
								return true;
							}
							return origin_isFriendOf.apply(this, arguments);
						};
						lib.element.player.isFriendOf = isFriendOf;
						[...game.players, ...game.dead].forEach(i => (i.isFriendOf = isFriendOf));
					}
					if (typeof lib.element.player.getEnemies === "function") {
						const origin_getEnemies = lib.element.player.getEnemies;
						const getEnemies = function (func, includeDie) {
							if (this["zombieshibian"]) {
								return this["zombieshibian"].getEnemies(func, includeDie);
							} else {
								const player = this;
								return [
									...origin_getEnemies.apply(this, arguments),
									...game[includeDie ? "filterPlayer2" : "filterPlayer"](target => {
										return origin_getEnemies.apply(this, arguments).includes(target["zombieshibian"] || target);
									}),
								]
									.filter(i => player != (i["zombieshibian"] || i))
									.unique()
									.sortBySeat(player);
							}
						};
						lib.element.player.getEnemies = getEnemies;
						[...game.players, ...game.dead].forEach(i => (i.getEnemies = getEnemies));
					}
				},
				player,
				target
			);
			target.ai.modAttitudeFrom = function (from, to) {
				if (to == from["zombieshibian"]) {
					return 114514;
				}
				return get.attitude(from["zombieshibian"] || from, to["zombieshibian"] || to);
			};
			target.ai.modAttitudeTo = function (from, to, att) {
				if (from == to["zombieshibian"]) {
					return 7;
				}
				return get.attitude(from["zombieshibian"] || from, to["zombieshibian"] || to);
			};
		},
		mark: true,
		intro: { content: (孩子们我复活了, player) => "made in " + (player?.["zombieshibian"] ? get.translation(player["zombieshibian"]) : "东汉") },
	},
	zombieganran: {
		trigger: { player: "phaseJieshuBegin" },
		filter(event, player) {
			return game.dead.some(target => {
				if (target["zombieshibian"] || get.is.playerNames(target, "zombie_zombie")) {
					return false;
				}
				return game.getGlobalHistory("everything", evt => evt.name === "die" && evt.player === target && evt.source === player).length > 0;
			});
		},
		forced: true,
		logTarget(event, player) {
			return game.dead
				.filter(target => {
					if (target["zombieshibian"] || get.is.playerNames(target, "zombie_zombie")) {
						return false;
					}
					return game.getGlobalHistory("everything", evt => evt.name === "die" && evt.player === target && evt.source === player).length > 0;
				})
				.sortBySeat();
		},
		async content(event, trigger, player) {
			for (const target of event.targets) {
				const names = get.nameList(target).filter(i => i !== "zombie_zombie");
				const result =
					names.length > 1
						? await player
								.chooseControl(names)
								.set("ai", () => {
									const { controls } = get.event();
									return controls.slice().sort((a, b) => get.rank(b, true) - get.rank(a, true));
								})
								.set("prompt", "请选择替换的武将牌")
								.forResult()
						: { control: names[0] };
				if (result.control) {
					game.broadcastAll(player => player.revive(2), target);
					let doubleDraw = false;
					let num = (get.character("zombie_zombie").maxHp || get.character("zombie_zombie").hp) - (get.character(result.control).maxHp || get.character(result.control).hp);
					if (num !== 0) {
						if (typeof target.singleHp === "boolean") {
							if (num % 2 !== 0) {
								if (target.singleHp) {
									target.maxHp += (num + 1) / 2;
									target.singleHp = false;
								} else {
									target.maxHp += (num - 1) / 2;
									target.singleHp = true;
									doubleDraw = true;
								}
							} else {
								target.maxHp += num / 2;
							}
						} else {
							target.maxHp += num;
						}
						target.update();
					}
					event.skills = get.character(result.control).skills || [];
					await target.reinitCharacter(result.control, "zombie_zombie");
					if (doubleDraw) {
						await target.doubleDraw();
					}
				}
				if (player.isDamaged()) {
					const num = player.getDamagedHp();
					await player.recover(num);
					await player.draw(num);
				}
			}
		},
	},
};

export default skills;
