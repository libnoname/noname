import { lib, game, ui, get, ai, _status } from "../../noname.js";

/** @type { importCharacterConfig['skill'] } */
const skills = {
	//渭南神马超
	wn_qiangshu: {
		trigger: {
			source: "damageBegin1",
		},
		filter(event, player) {
			if (!event.card || !["sha", "juedou"].includes(event.card.name)) {
				return false;
			}
			const num = player.getAttackRange() - 1;
			return num > 0 && player.countCards("he") >= num;
		},
		async cost(event, trigger, player) {
			const num = player.getAttackRange() - 1;
			event.result = await player
				.chooseToDiscard("he", get.prompt2(event.skill), num)
				.set("chooseonly", true)
				.set("ai", card => {
					const trigger = get.event().getTrigger(),
						player = get.player();
					if (get.damageEffect(trigger.player, trigger.source, player) <= 0) {
						return 0;
					}
					return 7 - get.value(card);
				})
				.forResult();
			event.result.targets = [trigger.player];
		},
		async content(event, trigger, player) {
			await player.discard(event.cards);
			trigger.num += event.cards.length;
		},
	},
	wn_yuma: {
		trigger: {
			global: ["loseAfter", "loseAsyncAfter", "cardsDiscardAfter", "equipAfter"],
		},
		usable: 1,
		filter(event, player) {
			if (!event.getd || !event.getl) {
				return false;
			}
			let cards = event.getd();
			return cards.some(card => {
				if (get.position(card) != "d" || get.type(card) != "equip") {
					return false;
				}
				if (card.willBeDestroyed("discardPile", get.owner(card), event)) {
					return false;
				}
				return game.hasPlayer(current => {
					return current.canEquip(card, true);
				});
			});
		},
		async cost(event, trigger, player) {
			const cards = trigger.getd().filter(card => {
				if (get.position(card) != "d" || get.type(card) != "equip") {
					return false;
				}
				if (card.willBeDestroyed("discardPile", get.owner(card), trigger)) {
					return false;
				}
				return true;
			});
			const {
				result: { bool, targets, links },
			} = await player.chooseButtonTarget({
				createDialog: [get.prompt2(event.skill), cards],
				filterTarget(card, player, target) {
					const buttons = ui.selected.buttons;
					if (!buttons.length) {
						return false;
					}
					return target.canEquip(buttons[0].link, true);
				},
				ai1(button) {
					return 20 - get.value(button.link);
				},
				ai2(target) {
					const player = get.player();
					const card = ui.selected.buttons[0]?.link;
					if (!card) {
						return 0;
					}
					if (!target.countCards("h")) {
						return get.value(card, target) * get.attitude(player, target);
					}
					return (get.value(card, target) - target.countCards("h")) * get.attitude(player, target);
				},
			});
			event.result = {
				bool: bool,
				targets: targets,
				cards: links,
			};
		},
		async content(event, trigger, player) {
			const {
				targets: [target],
				cards: [card],
			} = event;
			target.$gain2(card);
			await game.delay();
			await target.equip(card);
			const num = target.countCards("h");
			if (num > 0 && target != player) {
				await player.gainPlayerCard(target, true, "h", num);
			}
		},
	},
	//渭南神许褚
	wn_zhuanzhan: {
		trigger: {
			global: "phaseZhunbeiBegin",
		},
		filter(event, player) {
			if (event.player == player || !player.hasEnabledSlot()) {
				return false;
			}
			const card = new lib.element.VCard({ name: "juedou" });
			return player.canUse(card, event.player);
		},
		async cost(event, trigger, player) {
			let list = [];
			for (let i = 1; i <= 5; i++) {
				const slot = `equip${i}`;
				if (player.hasEnabledSlot(slot)) {
					list.push("equip" + i);
				}
			}
			list.push("cancel2");
			let bool = "cancel2";
			const card = new lib.element.VCard({ name: "juedou" });
			if (get.effect(trigger.player, card, player, player) > 0) {
				bool = list.filter(i => i != "cancel2").randomGet();
			}
			const result = await player
				.chooseControl(list)
				.set("prompt", get.prompt2(event.skill))
				.set("ai", () => get.event("bool"))
				.set("bool", bool)
				.forResult();
			event.result = {
				bool: result.control != "cancel2",
				targets: [trigger.player],
				cost_data: result.control,
			};
		},
		async content(event, trigger, player) {
			const slot = event.cost_data;
			await player.disableEquip([slot]);
			const card = new lib.element.VCard({ name: "juedou" });
			if (player.canUse(card, trigger.player)) {
				await player.useCard(card, trigger.player);
			}
		},
	},
	wn_huwei: {
		trigger: {
			player: "phaseDrawBegin2",
		},
		forced: true,
		filter(event, player) {
			let list = Array.from({ length: 13 }).map((_, i) => "equip" + parseFloat(i + 1));
			list = list.filter(i => player.hasDisabledSlot(i));
			return !event.numFixed && list.length;
		},
		async content(event, trigger, player) {
			let list = Array.from({ length: 13 }).map((_, i) => "equip" + parseFloat(i + 1));
			let num = list.reduce((sum, slot) => sum + player.countDisabledSlot(slot), 0);
			trigger.num += num;
		},
	},
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
		trigger: {
			target: "useCardToTarget",
		},
		filter(event, player) {
			if (!get.tag(event.card, "damage")) {
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
				sub: true,
			},
		},
	},
	cadingxi: {
		chargeSkill: Infinity,
		locked: false,
		trigger: { player: "useCard" },
		filter(event, player) {
			if (!player.countCharge()) {
				return false;
			}
			let evt = lib.skill.dcjianying.getLastUsed(player, event);
			if (!evt || !evt.card) {
				return false;
			}
			return get.type2(evt.card) == get.type2(event.card);
		},
		async content(event, trigger, player) {
			player.removeCharge();
			let cards = get.cards(1, true);
			await player.showCards(cards, `${get.translation(player)}发动了【定西】`).set("delay_time", 5);
			if (get.type2(cards[0]) == get.type2(trigger.card)) {
				if (player.hasUseTarget(cards[0], true, true)) {
					await player.chooseUseTarget(cards[0], true, false);
				}
				player.getHistory("custom").push({ [event.name]: "same" });
				let history = player.getAllHistory("custom", evt => evt.cadingxi),
					num = history.length;
				if (num < 1 || history[num - 1]?.cadingxi == "diff") {
					return;
				}
				if (num > 2 && history[num - 2]?.cadingxi == "same") {
					let targets = game.players.sortBySeat().slice();
					for (let target of targets) {
						if (target != player) {
							await target.damage();
						}
					}
				} else {
					if (player.isDamaged()) {
						await player.recoverTo(player.maxHp);
					}
				}
			} else {
				await player.draw("bottom");
				player.getHistory("custom").push({ [event.name]: "diff" });
			}
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
				content() {
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
			const control = await player
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
				.forResultControl();
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
							await lib.skill.cazhaoshao.closeEquip(target, target, list[0]);
							target.setStorage("cazhaoshao_equip", []);
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
					.chooseCard("h", "将任意张手牌当作“威”置于武将牌上", [1, Infinity], true)
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
					return get.event("resultC");
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
						if (!game.hasPlayer(current => current.countExpansions("caweijue_tag"))) {
							break;
						}
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
	//神钟会 —— by 刘巴
	dclinjie: {
		group: "dclinjie_effect",
		marktext: "凛",
		intro: {
			name: "凛界（凛）",
			name2: "凛",
			content: "mark",
		},
		audio: 2,
		trigger: {
			global: "roundStart",
		},
		filter(event, player) {
			return game.hasPlayer(target => !target.hasMark("dclinjie"));
		},
		async cost(event, trigger, player) {
			event.result = await player //
				.chooseTarget(`###${get.prompt(event.skill)}###对一名没有「凛」的角色造成一点伤害然后令其获得一个「凛」标记`, (card, player, target) => !target.hasMark("dclinjie"))
				.set("ai", target => {
					return get.damageEffect(target, get.player(), get.player());
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			await target.damage();
			target.addMark(event.name, 1);
		},
		subSkill: {
			effect: {
				audio: "dclinjie",
				trigger: {
					global: "damageEnd",
				},
				forced: true,
				locked: false,
				filter(event, player) {
					const target = event.player;
					return target !== player && target.hasMark("dclinjie") && target.countDiscardableCards(target, "h");
				},
				logTarget: "player",
				async content(event, trigger, player) {
					let target = trigger.player;
					let hs = target.getDiscardableCards(target, "h");
					if (hs.length) {
						const damage = target.countCards("h") == 1;
						await target.discard(hs.randomGet());
						if (damage) {
							await target.damage();
							target.clearMark("dclinjie");
						}
					}
				},
			},
		},
	},
	dcduzhang: {
		audio: 2,
		usable: 1,
		mod: {
			maxHandcard(player, num) {
				return (num += player.countMark("dclinjie"));
			},
		},
		trigger: {
			player: "useCardToPlayered",
			target: "useCardToTargeted",
		},
		filter(event, player) {
			if (get.color(event.card) !== "black") {
				return false;
			}
			return (player === event.player || event.targets.includes(player)) && event.targets.length === 1;
		},
		locked: false,
		frequent: true,
		content() {
			player.draw();
			player.addMark("dclinjie", 1);
		},
	},
	dcjianghuo: {
		derivation: ["dclishi"],
		skillAnimation: true,
		animationColor: "fire",
		audio: 2,
		juexingji: true,
		forced: true,
		trigger: { player: "phaseBegin" },
		filter(event, player) {
			return !game.hasPlayer(current => !current.hasAllHistory("damage", evt => evt.num));
		},
		async content(event, trigger, player) {
			player.awakenSkill(event.name);
			const num = game
				.filterPlayer(target => target !== player && target.hasMark("dclinjie"))
				.map(target => target.countMark("dclinjie"))
				.reduce((sum, cur) => sum + cur, 0);
			game.filterPlayer(target => target !== player).forEach(target => target.clearMark("dclinjie"));
			if (num > 0) {
				player.addMark("dclinjie", num);
			}
			await player.draw(player.countMark("dclinjie"));
			await player.gainMaxHp();
			await player.removeSkills("dclinjie");
			await player.addSkills("dclishi");
			player.markSkill("dclinjie");
		},
	},
	dclishi: {
		audio: 2,
		locked: true,
		trigger: {
			player: "phaseJieshuBegin",
		},
		async cost(event, trigger, player) {
			if (!player.hasMark("dclinjie")) {
				event.result = {
					bool: true,
					cost_data: "damage",
				};
			} else {
				const num = player.countMark("dclinjie");
				const result = await player
					.chooseButton([
						"立世：你需移除任意「凛」标记然后执行等量个选项",
						[
							[
								["fengyin", "令所有其他角色于下个准备和结束阶段期间非锁定技失效"],
								["judge", "令所有其他角色于下个判定阶段开始时在【闪电】.【乐不思蜀】和【兵粮寸断】中选择两个个并依次进行判定。"],
								["discard", "令所有其他角色于下个摸牌阶段期间内摸到的牌若颜色相同，则全部弃置。"],
								["use", "令所有其他角色于下个出牌阶段每种类型的牌仅能使用一张"],
								["gain", "令所有其他角色于下个弃牌阶段期间内弃置牌后你获得之"],
							],
							"textbutton",
						],
					])
					.set("ai", button => {
						const player = get.player();
						if (button.link === "fengyin") {
							return 1.5;
						} else if (button.link === "judge") {
							return 1;
						} else if (button.link === "discard") {
							return 3;
						} else if (button.link === "use") {
							return 4;
						} else if (button.link === "gain") {
							return 8;
						}
					})
					.set("forced", true)
					.set("selectButton", [1, num])
					.forResult();
				event.result = {
					bool: result.bool,
					cost_data: result.links,
				};
			}
		},
		async content(event, trigger, player) {
			const choices = event.cost_data;
			if (choices === "damage") {
				await player.damage("thunder");
				return;
			}
			player.removeMark("dclinjie", choices.length);
			const targets = game.filterPlayer(target => target != player);
			player.line(targets);
			if (choices.includes("fengyin")) {
				game.log(player, "选择了", "#y准备阶段、结束阶段", "的效果");
				for (const target of targets) {
					target.when({ player: "phaseJieshuBefore" }).then(() => player.addTempSkill("fengyin", ["phaseBefore", "phaseChange", "phaseAfter"]));
					target.when({ player: "phaseZhunbeiBefore" }).then(() => player.addTempSkill("fengyin", ["phaseBefore", "phaseChange", "phaseAfter"]));
				}
			}
			if (choices.includes("judge")) {
				game.log(player, "选择了", "#y判定阶段", "的效果");
				for (const target of targets) {
					target.when({ player: "phaseJudgeBegin" }).step(async (event, trigger, player) => {
						const result = await player
							.chooseVCardButton(["lebu", "bingliang", "shandian"], "立世：请选择两个延时锦囊并依次进行判定", 2, true)
							.set("ai", button => {
								const player = get.player();
								return get.info({ name: button.link[2] }).ai.result.target(player, player);
							})
							.forResult();
						if (result?.links.length) {
							const links = result.links;
							for (let i = 0; i < links.length; i++) {
								await target.executeDelayCardEffect(links[i][2]);
							}
						}
					});
				}
			}
			if (choices.includes("discard")) {
				game.log(player, "选择了", "#y摸牌阶段", "的效果");
				for (const target of targets) {
					target.addTempSkill("dclishi_discard", { player: "phaseDrawAfter" });
					//target.when({ player: "phaseDrawBegin" }).then(() => trigger.set("dclishi", player.playerid));
				}
			}
			if (choices.includes("use")) {
				game.log(player, "选择了", "#y出牌阶段", "的效果");
				for (const target of targets) {
					target.addTempSkill("dclishi_limit", { player: "phaseUseAfter" });
					//target.when({ player: "phaseUseBegin" }).then(() => player.addTempSkill("dclishi_limit", ["phaseBefore", "phaseChange", "phaseAfter"]));
				}
			}
			if (choices.includes("gain")) {
				game.log(player, "选择了", "#y弃牌阶段", "的效果");
				for (const target of targets) {
					target.addTempSkill("dclishi_gain", { player: "phaseDiscardAfter" });
					target.markAuto("dclishi_gain", player);
					//target.when({ player: "phaseDiscardBegin" }).then(() => trigger.set("dclishi", player.playerid));
				}
			}
		},
		subSkill: {
			gain: {
				trigger: {
					player: ["loseAfter"],
					global: ["loseAsyncAfter"],
				},
				charlotte: true,
				forced: true,
				popup: false,
				onremove: true,
				filter(event, player) {
					if (event.type !== "discard") {
						return false;
					}
					const evt = event.getParent("phaseDiscard");
					const evt2 = event.getl(player);
					return evt?.name === "phaseDiscard" && evt?.player === player && evt2?.cards2?.filterInD("d");
				},
				async content(event, trigger, player) {
					const gainer = player
						.getStorage(event.name)
						.sortBySeat()
						.find(target => target.isIn());
					if (gainer) {
						await gainer.gain(trigger.getl(player).cards2.filterInD("d"), "gain2");
					}
				},
			},
			limit: {
				charlotte: true,
				onremove: true,
				trigger: { player: "useCard1" },
				silent: true,
				firstDo: true,
				filter(event, player) {
					return player.isPhaseUsing();
				},
				content() {
					player.markAuto(event.name, get.type2(trigger.card));
				},
				mod: {
					cardEnabled(card, player) {
						const type = get.type2(card);
						if (player.getStorage("dclishi_limit").includes(type)) {
							return false;
						}
					},
					cardSavable(card, player) {
						const type = get.type2(card);
						if (player.getStorage("dclishi_limit").includes(type)) {
							return false;
						}
					},
				},
			},
			discard: {
				charlotte: true,
				forced: true,
				popup: false,
				trigger: {
					player: ["gainAfter"],
				},
				filter(event, player) {
					const evt = event.getParent("phaseDraw");
					const cards = event.getg?.(player);
					return event.getParent()?.name == "draw" && evt?.name === "phaseDraw" && evt?.player === player && cards.map(card => get.color(card)).unique().length == 1;
				},
				async content(event, trigger, player) {
					const cards = trigger.getg(player);
					await player.modedDiscard(cards);
				},
			},
		},
	},
	//神庞统
	//复活神将
	luansuo: {
		audio: 2,
		trigger: { player: "phaseBegin" },
		filter(event, player) {
			return game.hasPlayer(target => target.countCards("h"));
		},
		forced: true,
		logTarget(event, player) {
			return game.filterPlayer(target => target.countCards("h"));
		},
		content() {
			for (const i of event.targets) {
				i.addTempSkill("luansuo_debuff");
				i.addGaintag(i.getCards("h"), "luansuo_debuff");
			}
		},
		global: "luansuo_discard",
		subSkill: {
			discard: {
				mod: {
					cardDiscardable(card) {
						if (_status.currentPhase?.hasSkill("luansuo") && get.position(card) === "h") {
							return false;
						}
					},
					canBeDiscarded(card) {
						if (_status.currentPhase?.hasSkill("luansuo") && get.position(card) === "h") {
							return false;
						}
					},
				},
			},
			debuff: {
				mod: {
					cardname(card) {
						if (get.itemtype(card) !== "card" || get.position(card) !== "h") {
							return;
						}
						if (card.hasGaintag("luansuo_debuff")) {
							return "tiesuo";
						}
					},
					cardnature(card) {
						if (get.itemtype(card) !== "card" || get.position(card) !== "h") {
							return;
						}
						if (card.hasGaintag("luansuo_debuff")) {
							return false;
						}
					},
					aiOrder(player, card, num) {
						if (num > 0 && get.name(card, player) === "huogong") {
							return 0;
						}
					},
					aiValue(player, card, num) {
						if (num > 0 && get.name(card, player) === "huogong") {
							return 0.01;
						}
					},
					aiUseful(player, card, num) {
						if (num > 0 && get.name(card, player) === "huogong") {
							return 0;
						}
					},
				},
				charlotte: true,
				onremove(player, skill) {
					player.removeGaintag(skill);
				},
				trigger: { global: ["loseAfter", "equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter", "cardsDiscardAfter"] },
				filter(event, player) {
					return player.hasCard(card => {
						if (!card.hasGaintag("luansuo_debuff")) {
							return false;
						}
						return event.getd().some(cardx => get.suit(card) === get.suit(cardx));
					}, "h");
				},
				silent: true,
				firstDo: true,
				content() {
					const cards = player.getCards("h", card => {
						if (!card.hasGaintag(event.name)) {
							return false;
						}
						return trigger.getd().some(cardx => get.suit(card) === get.suit(cardx));
					});
					player.removeGaintag(event.name, cards);
				},
			},
		},
	},
	fengliao: {
		audio: 2,
		zhuanhuanji: true,
		mark: true,
		marktext: "☯",
		intro: {
			content(storage) {
				if (storage) {
					return "你使用牌指定唯一目标后，你对其造成1点火焰伤害。";
				}
				return "你使用牌指定唯一目标后，你令其摸一张牌。";
			},
		},
		trigger: { player: "useCardToPlayered" },
		filter(event, player) {
			return event.targets.length == 1;
		},
		forced: true,
		logTarget: "target",
		async content(event, trigger, player) {
			player.changeZhuanhuanji("fengliao");
			const { target } = trigger;
			if (player.storage.fengliao) {
				await target.draw();
			} else {
				await target.damage("fire", player);
			}
		},
		mod: {
			aiOrder(player, card, num) {
				if (num > 0) {
					const select = get.info(card).selectTarget;
					let range;
					if (select == undefined) {
						range = [1, 1];
					} else if (typeof select == "number") {
						range = [select, select];
					} else if (get.itemtype(select) == "select") {
						range = select;
					} else if (typeof select == "function") {
						range = select(card, player);
					}
					game.checkMod(card, player, range, "selectTarget", player);
					if (
						(() => {
							if (
								!(() => {
									if (range[1] !== -1) {
										return range[1] <= 1;
									}
									return game.countPlayer(i => player.canUse(card, i)) === 1;
								})()
							) {
								return false;
							}
							let targets = game.filterPlayer(i => player.canUse(card, i));
							if (!targets.length) {
								return false;
							}
							_status._fengliao_check = true;
							targets.sort((a, b) => get.effect(b, card, player, player) - get.effect(a, card, player, player));
							delete _status._fengliao_check;
							return (player.storage.fengliao ? get.damageEffect(targets[0], player, player, "fire") : get.effect(targets[0], { name: "draw" }, player, player)) > 0;
						})()
					) {
						return num + 15;
					}
				}
			},
		},
		ai: {
			fireAttack: true,
			effect: {
				player(card, player, target) {
					if (_status._fengliao_check) {
						return;
					}
					if (!(typeof card !== "object") || !player || !target) {
						return;
					}
					const select = get.info(card).selectTarget;
					let range;
					if (select == undefined) {
						range = [1, 1];
					} else if (typeof select == "number") {
						range = [select, select];
					} else if (get.itemtype(select) == "select") {
						range = select;
					} else if (typeof select == "function") {
						range = select(card, player);
					}
					game.checkMod(card, player, range, "selectTarget", player);
					if (
						(() => {
							if (range[1] !== -1) {
								return !ui.selected.targets.length;
							}
							return !game.hasPlayer(i => i !== target && player.canUse(card, i));
						})()
					) {
						return [
							1,
							(() => {
								_status._fengliao_check = true;
								const num = player.storage.fengliao ? get.damageEffect(target, player, player, "fire") : get.effect(target, { name: "draw" }, player, player);
								delete _status._fengliao_check;
								return num;
							})(),
						];
					}
				},
			},
		},
	},
	kunyu: {
		audio: 2,
		trigger: { player: "dieBegin" },
		filter(event, player) {
			if (!(event.getParent().name !== "giveup" && player.maxHp > 0)) {
				return false;
			}
			return get.cardPile2(c => get.tag(c, "fireDamage"));
		},
		forced: true,
		async content(event, trigger, player) {
			const card = get.cardPile2(c => get.tag(c, "fireDamage"));
			if (!card) {
				return;
			}
			await game.cardsGotoSpecial(card);
			game.log(player, "将", card, "移出游戏");
			trigger.cancel();
			await player.recoverTo(1);
		},
		group: "kunyu_debuff",
		subSkill: {
			debuff: {
				audio: "kunyu",
				trigger: {
					global: "phaseBefore",
					player: ["gainMaxHpBegin", "loseMaxHpBegin", "enterGame"],
				},
				forced: true,
				filter(event, player) {
					let bool = player.maxHp !== 1;
					if (event.name === "phase") {
						return bool && game.phaseNumber === 0;
					}
					return true;
				},
				async content(event, trigger, player) {
					if (["gainMaxHp", "loseMaxHp"].includes(trigger.name)) {
						trigger.cancel();
					} else {
						player.maxHp = 1;
						player.update();
					}
				},
			},
		},
	},
	//神黄忠
	//丁真神将，赤矢神将，爆头神将，吃人神将
	dclieqiong: {
		audio: 2,
		trigger: { source: "damageSource" },
		filter(event, player) {
			return event.player.isIn() && event.source != event.player;
		},
		frequent: true,
		logTarget: "player",
		prompt2: (event, player) => "击伤其一个部位",
		async cost(event, trigger, player) {
			const target = trigger.player;
			let places = lib.skill["dclieqiong"].derivation.slice();
			if (target.hasSex("male")) {
				places.push("dclieqiong_place8");
			}
			places = places.filter(i => {
				let storage = target.getStorage("dclieqiong_injury");
				if (!storage.length && i == "dclieqiong_place1") {
					return false;
				}
				return true;
			});
			if (!places.length) {
				return;
			}
			//射击部位-by 鸽子
			await Promise.all(event.next);
			event.videoId = lib.status.videoId++;
			if (player.isUnderControl()) {
				game.swapPlayerAuto(player);
			}
			const switchToAuto = function () {
				_status.imchoosing = false;
				if (event.dialog) {
					event.dialog.close();
				}
				if (event.control) {
					event.control.close();
				}
				game.resume();
				return Promise.resolve({
					bool: true,
					hurt: places.randomGet(),
				});
			};
			const chooseButton = (places, target) => {
				const { promise, resolve } = Promise.withResolvers();
				const event = _status.event;
				event.switchToAuto = function () {
					_status.imchoosing = false;
					resolve({
						bool: true,
						hurt: places.randomGet(),
					});
					if (event.dialog) {
						event.dialog.close();
					}
					if (event.control) {
						event.control.close();
					}
					if (event.control2) {
						event.control2.close();
					}
				};
				event.control = ui.create.control("cancel2", function (link) {
					event.dialog.close();
					event.control.close();
					if (event.control2) {
						event.control2.close();
					}
					game.resume();
					_status.imchoosing = false;
					event._result = { bool: false };
					resolve(event._result);
				});
				event.control2 = ui.create.control("ok", function (link) {
					event.dialog.close();
					event.control.close();
					event.control2.close();
					game.resume();
					_status.imchoosing = false;
					resolve(event._result);
				});
				event.control2.close();
				const dialog = ui.create.dialog("forcebutton", "hidden");
				event.dialog = dialog;
				//白底大图不加textPrompt了
				dialog.textPrompt = dialog.add('<div class="text center">裂穹：是否击伤' + get.translation(target) + "的一个部位？</div>");
				dialog.style.display = "flex";
				dialog.style.justifyContent = "center";
				dialog.style.alignItems = "center";
				dialog.style.position = "relative";
				dialog.style.width = "100%";
				dialog.style.height = "100%";
				dialog.id = "dclieqiong";
				dialog.classList.add("fixed");
				dialog.classList.add("scroll1");
				dialog.classList.add("scroll2");
				dialog.classList.add("center");
				dialog.classList.add("scroll3");
				dialog.classList.add("fullwidth");
				dialog.classList.add("fullheight");
				const target_img = document.createElement("div");
				const position = lib.skill["dclieqiong"].derivation.slice();
				if (target.hasSex("male")) {
					position.push("dclieqiong_place8");
				}
				target_img.style.width = "50%";
				target_img.style.height = "100%";
				target_img.style.position = "relative";
				target_img.style.overflow = "visible";
				target_img.style.boxSizing = "border-box";
				target_img.style.border = "1px solid black";
				target_img.style.backgroundColor = "rgb(255,178,102,0.5)";
				dialog.appendChild(target_img);
				target_img.style.backgroundImage = "url(" + lib.assetURL + "image/card/yiwu_" + (target.hasSex("male") ? "male" : "female") + ".png)";
				target_img.style.backgroundSize = "cover";
				target_img.style.backgroundRepeat = "no-repeat";
				target_img.style.backgroundSize = "contain";
				target_img.style.backgroundRepeat = "no-repeat";
				target_img.style.backgroundPosition = "center center";
				const number = target.hasSex("male")
					? [
							["7", "1"],
							//["5", "3"],
							//["4", "7"],
							["9", "5"],
							["9", "13"],
							["7", "3"],
							["7", "6"],
							["7", "8"],
					  ]
					: [
							["7", "1"],
							//["8", "3"],
							//["4", "7"],
							["9", "5"],
							["9", "13"],
							["6", "3"],
							["6", "6"],
					  ];
				let list = [];
				for (let i = 0; i < position.length; i++) {
					const num_px = document.createElement("div");
					num_px.classList.add("nodeintro");
					num_px.nodeTitle = get.translation(position[i]);
					num_px.nodeContent = get.skillInfoTranslation(position[i]);
					num_px.style.width = "15%";
					num_px.style.height = "15%";
					num_px.id = position[i];
					num_px.style.position = "absolute";
					num_px.style.left = `${number[i][0] * 6}%`;
					num_px.style.top = `${number[i][1] * 6}%`;
					num_px.style.boxSizing = "border-box";
					num_px.style.backgroundImage = "url(" + lib.assetURL + "image/card/yiwu_click.png)";
					num_px.style.backgroundSize = "cover";
					num_px.style.backgroundRepeat = "no-repeat";
					num_px.style.backgroundSize = "contain";
					num_px.style.backgroundRepeat = "no-repeat";
					num_px.style.backgroundPosition = "center center";
					num_px.addEventListener(lib.config.touchscreen ? "touchend" : "click", a => {
						let hurt = event._result?.position;
						event._result = {
							bool: true,
							hurt: a.target.id,
							position: a.target,
						};
						let bool = true;
						if (hurt) {
							hurt.style.backgroundImage = "url(" + lib.assetURL + "image/card/yiwu_click.png)";
							if (hurt == a.target) {
								event._result = { bool: false };
								if (event.control2) {
									event.control2.close();
								}
								if (event.control) {
									event.control.open();
								}
								bool = false;
							}
						}
						if (bool) {
							a.target.style.backgroundImage = "url(" + lib.assetURL + "image/card/yiwu_click_chosen.png)";
							if (event.control) {
								event.control.close();
							}
							if (!lib.config.autoskilllist.includes("dclieqiong")) {
								event.dialog.close();
								game.resume();
								_status.imchoosing = false;
								resolve(event._result);
							} else if (event.control2) {
								event.control2.open();
							}
						}
					});
					if (!lib.config.touchscreen) {
						if (lib.config.hover_all) {
							lib.setHover(num_px, ui.click.hoverplayer);
						}
						if (lib.config.right_info) {
							num_px.oncontextmenu = ui.click.rightplayer;
						}
					}
					list.push(num_px);
				}
				const selectedList = list.filter(i => places.includes(i.id));
				for (const i of selectedList) {
					target_img.appendChild(i);
				}
				dialog.open();
				game.pause();
				game.countChoose();
				return promise;
			};
			let next;
			if (event.isMine()) {
				next = chooseButton(places, target);
			} else if (event.isOnline()) {
				const { promise, resolve } = Promise.withResolvers();
				event.player.send(chooseButton, places, target);
				event.player.wait(async result => {
					if (result == "ai") {
						result = await switchToAuto();
					}
					resolve(result);
				});
				game.pause();
				next = promise;
			} else {
				next = switchToAuto();
			}
			const result = await next;
			if (event.control2) {
				event.control2.close();
			}
			game.resume();
			event.result = {
				bool: result.bool,
				targets: [target],
				cost_data: result.hurt,
			};
			event.result.targets = [target];
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			const place = event.cost_data;
			player.popup(place, "fire");
			game.log(player, "击伤了", target, "的", "#y" + get.translation(place));
			target.addTempSkill("dclieqiong_injury");
			target.markAuto("dclieqiong_injury", [place]);
			switch (parseInt(place.slice("dclieqiong_place".length))) {
				case 1:
					if (target.getHp() > 0) {
						await target.loseHp(target.getHp());
						if (
							game.getGlobalHistory("everything", evt => {
								if (evt.name != "die" || evt.player != target) {
									return false;
								}
								return evt.reason?.getParent() == event;
							}).length > 0
						) {
							await player.gainMaxHp();
						}
					}
					break;
				case 2: {
					const cards = target
						.getEquips(1)
						.slice()
						.concat(target.getEquips("equip3_4"))
						.filter(card => lib.filter.canBeDiscarded(card, player, target));
					if (cards.length) {
						await target.discard(cards).set("discarder", player);
					}
					break;
				}
				case 3:
					target.addTempSkill("dclieqiong_maxhand", { player: "phaseEnd" });
					break;
				case 4: {
					const cardx = target.getDiscardableCards(target, "h");
					const num = Math.ceil(cardx.length / 2);
					if (cardx.length) {
						await target.discard(cardx.randomGets(num));
					}
					break;
				}
				case 5:
					target.addTempSkill("dclieqiong_damage", { player: "phaseEnd" });
					break;
				case 6:
					target.addTempSkill("dclieqiong_use", { player: "phaseEnd" });
					break;
				case 7:
					target.addTempSkill("dclieqiong_respond", { player: "phaseEnd" });
					break;
				case 8: {
					game.broadcastAll(
						(player, sex) => {
							player.sex = sex;
						},
						target,
						"female"
					);
					game.log(target, "将性别变为了", "#y女性");
					const nvzhuang = get.cardPile("nvzhuang") || game.createCard("nvzhuang", "diamond", 6);
					await game.delayx();
					if (target.canEquip(nvzhuang, true)) {
						await target.equip(nvzhuang);
					}
					await target.gainMaxHp();
					break;
				}
			}
		},
		marktext: "赤",
		intro: { content: "mark" },
		// frequent: true,
		derivation: ["dclieqiong_place1", "dclieqiong_place4", "dclieqiong_place5", "dclieqiong_place6", "dclieqiong_place7"],
		subSkill: {
			injury: {
				charlotte: true,
				onremove: true,
			},
			maxhand: {
				charlotte: true,
				mark: true,
				marktext: "伤",
				intro: {
					name: "中伤 - 手部",
					content: "手牌上限变为原来的一半（向下取整）",
				},
				mod: {
					maxHandcard(player, num) {
						if (_status["dclieqiong_maxhand"]) {
							return;
						}
						_status["dclieqiong_maxhand"] = true;
						const numx = player.getHandcardLimit();
						delete _status["dclieqiong_maxhand"];
						return num - Math.ceil(numx);
					},
				},
			},
			damage: {
				charlotte: true,
				mark: true,
				marktext: "伤",
				intro: {
					name: "中伤 - 地机",
					content: "下次受到的伤害+1",
				},
				trigger: { player: "damageBegin2" },
				forced: true,
				popup: false,
				content() {
					trigger.num++;
					player.removeSkill(event.name);
				},
			},
			use: {
				charlotte: true,
				forced: true,
				mark: true,
				marktext: "伤",
				intro: {
					name: "中伤 - 中枢",
					content: (_, player) => (_status.currentPhase === player ? "" : "下回合") + "使用的下一张牌无效",
				},
				trigger: {
					player: "useCard",
				},
				async content(event, trigger, player) {
					trigger.all_excluded = true;
					trigger.targets.length = 0;
					player.removeSkill("dclieqiong_use");
				},
			},
			respond: {
				charlotte: true,
				mark: true,
				marktext: "伤",
				intro: {
					name: "中伤 - 气海",
					content: (_, player) => "不能使用或打出红桃牌",
				},
				mod: {
					cardEnabled(card) {
						if (get.suit(card) == "heart") {
							return false;
						}
					},
					cardSavable(card) {
						if (get.suit(card) == "heart") {
							return false;
						}
					},
					cardRespondable(card) {
						if (get.suit(card) == "heart") {
							return false;
						}
					},
				},
			},
		},
	},
	new_dclieqiong: {
		audio: "dclieqiong",
		trigger: { source: "damageSource" },
		filter(event, player) {
			return event.player.isIn() && event.source != event.player;
		},
		derivation: ["dclieqiong_place1", "dclieqiong_place4", "dclieqiong_place5", "dclieqiong_place6", "dclieqiong_place7"],
		positions: {
			head: {
				name: "天冲",
				info: "令其失去所有体力，若其因此死亡，你增加1点体力上限",
				css_male: {
					left: "50%",
					top: "14%",
				},
				css_female: {
					left: "45%",
					top: "10%",
				},
				async content(event, trigger, player) {
					const { target, position } = event;
					game.log(player, "击伤了", target, "的", "#y天冲");
					if (target.getHp() > 0) {
						await target.loseHp(target.getHp());
						if (
							game.getGlobalHistory("everything", evt => {
								if (evt.name != "die" || evt.player != target) {
									return false;
								}
								return evt.reason?.getParent() == event;
							}).length > 0
						) {
							await player.gainMaxHp();
						}
					}
				},
			},
			hand: {
				name: "力烽",
				info: "令其随机弃置一半手牌（向上取整）",
				css_male: {
					left: "28%",
					top: "40%",
				},
				css_female: {
					left: "72%",
					top: "40%",
				},
				async content(event, trigger, player) {
					const { target, position } = event;
					game.log(player, "击伤了", target, "的", "#y力烽");
					const cardx = target.getDiscardableCards(target, "h");
					const num = Math.ceil(cardx.length / 2);
					if (cardx.length) {
						await target.discard(cardx.randomGets(num));
					}
				},
			},
			leg: {
				name: "地机",
				info: "令其下一次受到的伤害+1直到其下个回合结束",
				css_male: {
					left: "35%",
					top: "80%",
				},
				css_female: {
					left: "67%",
					top: "80%",
				},
				async content(event, trigger, player) {
					const { target, position } = event;
					game.log(player, "击伤了", target, "的", "#y地机");
					target.addTip("new_dclieqiong_leg", "裂穹 地机");
					target
						.when({
							player: ["damageBegin3", "phaseEnd"],
						})
						.then(() => {
							player.removeTip("new_dclieqiong_leg");
							if (trigger.name == "damage") {
								trigger.num++;
							}
						});
				},
			},
			chest: {
				name: "中枢",
				info: "令其使用的下一张牌无效直到其回合结束",
				css_male: {
					left: "50%",
					top: "30%",
				},
				css_female: {
					left: "40%",
					top: "25%",
				},
				async content(event, trigger, player) {
					const { target, position } = event;
					game.log(player, "击伤了", target, "的", "#y中枢");
					target.addTip("new_dclieqiong_chest", "裂穹 中枢");
					target
						.when({
							player: ["useCard", "phaseEnd"],
						})
						.then(() => {
							player.removeTip("new_dclieqiong_chest");
							if (trigger.name == "useCard") {
								trigger.targets.length = 0;
								trigger.all_excluded = true;
							}
						});
				},
			},
			abdomen: {
				name: "气海",
				info: "令其不能使用或打出♥️牌直到其回合结束",
				css_male: {
					left: "50%",
					top: "42%",
				},
				css_female: {
					left: "40%",
					top: "35%",
				},
				async content(event, trigger, player) {
					const { target, position } = event;
					game.log(player, "击伤了", target, "的", "#y气海");
					target.addTempSkill("new_dclieqiong_abdomen", { player: "phaseEnd" });
				},
			},
		},
		async cost(event, trigger, player) {
			const target = trigger.player;
			await Promise.all(event.next);
			event.videoId = lib.status.videoId++;
			let list = Object.keys(lib.skill[event.skill].positions);
			if (
				!player.hasHistory("useSkill", evt => {
					return evt.skill == event.name.slice(0, -5) && evt?.targets.includes(target);
				})
			) {
				list.remove("head");
			}
			if (!list?.length) {
				event.result = { bool: false };
				return;
			}
			const switchToAuto = function () {
				_status.imchoosing = false;
				if (event.dialog) {
					event.dialog.close();
				}
				if (event.control) {
					event.control.close();
				}
				game.resume();
				if (get.attitude(player, target) > 0) {
					event._result = { bool: false };
				} else {
					event._result = {
						bool: true,
						position: list.includes("head") ? "head" : "abdomen",
					};
				}
				return Promise.resolve(event._result);
			};
			const choosePosition = function (player, target, list) {
				const { promise, resolve } = Promise.withResolvers();
				const event = _status.event;
				event.switchToAuto = function () {
					_status.imchoosing = false;
					if (get.attitude(player, target) > 0) {
						event._result = { bool: false };
					} else {
						event._result = {
							bool: true,
							position: list.includes("head") ? "head" : "abdomen",
						};
					}
					resolve(event._result);
					if (event.dialog) {
						event.dialog.close();
					}
					if (event.control_cancel) {
						event.control_cancel.close();
					}
					if (event.control_ok) {
						event.control_ok.close();
					}
				};
				event.control_ok = ui.create.control("ok", function (link) {
					event.dialog.close();
					event.control_cancel.close();
					event.control_ok.close();
					game.resume();
					_status.imchoosing = false;
					event._result = {
						bool: true,
						position: event.selectedPos,
					};
					resolve(event._result);
				});
				event.control_ok.classList.add("disabled");
				event.control_cancel = ui.create.control("cancel2", function (link) {
					event.dialog.close();
					event.control_cancel.close();
					if (event.control_ok) {
						event.control_ok.close();
					}
					game.resume();
					_status.imchoosing = false;
					event._result = { bool: false };
					resolve(event._result);
				});
				//创建对话框
				const dialog = ui.create.dialog("forcebutton", "hidden");
				dialog.listen(() => {
					let allpos = dialog.querySelectorAll(".position");
					allpos.forEach(pos => pos.classList.remove("selected_cp"));
					event.selectedPos = null;
					event.control_ok.classList.add("disabled");
				});
				event.dialog = dialog;
				dialog.classList.add("dclieqiong", "fixed", "fullheight");
				dialog.style.backgroundImage = "url(" + lib.assetURL + "image/card/yiwu_" + (target.hasSex("male") ? "male" : "female") + ".png)";
				const title = ui.create.div(".title", dialog);
				title.innerHTML = `裂穹：是否击伤${get.translation(target)}的一个部位？`;
				//添加部位
				for (let pos of list) {
					let position = lib.skill.new_dclieqiong.positions[pos];
					let div = ui.create.div(".position", dialog, e => {
						e.stopPropagation();
						let allPosDiv = Array.from(dialog.querySelectorAll(".position"));
						allPosDiv.forEach(p => p.classList.remove("selected_cp"));
						div.classList.add("selected_cp");
						event.selectedPos = pos;
						if (allPosDiv.some(p => p.classList.contains("selected_cp")) && event.selectedPos) {
							event.control_ok.classList.remove("disabled");
						} else {
							event.control_ok.classList.add("disabled");
						}
					});
					let sex = target.hasSex("male") ? "male" : "female";
					div.css(position["css_" + sex] || {});

					div.setNodeIntro(position.name, position.info);
					div.style.setProperty("--info", `"【${position.name}】:${position.info}"`);
				}
				dialog.open();
				game.pause();
				game.countChoose();
				return promise;
			};
			/** @type {Promise<{bool:boolean,position:string}>} */
			let next;
			if (event.isMine()) {
				next = choosePosition(player, target, list);
			} else if (event.isOnline()) {
				const { promise, resolve } = Promise.withResolvers();
				event.player.send(choosePosition, player, target, list);
				event.player.wait(async result => {
					if (result == "ai") {
						result = await switchToAuto();
					}
					resolve(result);
				});
				game.pause();
				next = promise;
			} else {
				next = switchToAuto();
			}

			const result = await next;
			if (event.control2) {
				event.control2.close();
			}
			game.resume();
			event.result = {
				bool: result.bool,
				targets: [target],
				cost_data: {
					position: result.position,
					target: target,
				},
			};
		},
		async content(event, trigger, player) {
			const { target, position } = event.cost_data;
			game.broadcastAll(function (position) {
				if (lib.config.background_speak) {
					game.playAudio("skill", "dclieqiong_" + position);
				}
			}, position);
			const positionObj = lib.skill[event.name].positions[position];
			let next = game.createEvent(event.name + "effect", false);
			next.setContent(positionObj.content);
			next.set("target", target);
			next.set("player", player);
			next.set("position", positionObj);
			await next;
		},
		subSkill: {
			abdomen: {
				init(player, skill) {
					player.addTip(skill, "裂穹 气海");
				},
				onremove(player, skill) {
					player.removeTip(skill);
				},
				charlotte: true,
				mark: true,
				marktext: "伤",
				intro: {
					name: "中伤 - 气海",
					content: (_, player) => "不能使用或打出红桃牌",
				},
				mod: {
					cardEnabled(card) {
						if (get.suit(card) == "heart") {
							return false;
						}
					},
					cardSavable(card) {
						if (get.suit(card) == "heart") {
							return false;
						}
					},
					cardRespondable(card) {
						if (get.suit(card) == "heart") {
							return false;
						}
					},
				},
			},
		},
	},
	dczhanjue: {
		audio: 2,
		trigger: {
			player: "phaseUseBegin",
		},
		async cost(event, trigger, player) {
			const hps = [player.getHp(), player.getDamagedHp()];
			let list = [(hps[0] > 0 ? "摸" + get.cnNumber(hps[0]) + "张牌，" : "") + "此阶段使用的下一张【杀】无距离限制且不能被响应。", (hps[1] > 0 ? "摸" + get.cnNumber(hps[1]) + "张牌，" : "") + "此阶段下一次造成伤害后，回复等量体力。"];
			let result = await player
				.chooseControlList(list)
				.set("ai", function () {
					let player = get.event("player"),
						damaged = player.getDamagedHp();
					if (damaged) {
						damaged +=
							0.6 *
							(player.countCards("hs", card => {
								if (card.name == "sha" || !get.tag(card, "damage")) {
									return 0;
								}
								let info = get.info(card);
								if (!info || info.type != "trick") {
									return false;
								}
								if (info.notarget) {
									return false;
								}
								if (info.selectTarget != undefined) {
									if (Array.isArray(info.selectTarget)) {
										if (info.selectTarget[1] == -2) {
											return 1;
										}
										if (info.selectTarget[1] == -1) {
											let func = info.filterTarget;
											if (typeof func != "function") {
												func = () => true;
											}
											return game.countPlayer(cur => {
												return func(card, player, cur);
											});
										}
										return Math.max(1, info.selectTarget[0], info.selectTarget[1]);
									} else {
										if (info.selectTarget == -2) {
											return 1;
										}
										if (info.selectTarget == -1) {
											let func = info.filterTarget;
											if (typeof func != "function") {
												func = () => true;
											}
											return game.countPlayer(cur => {
												return func(card, player, cur);
											});
										}
										return Math.max(1, info.selectTarget);
									}
								}
								return 1;
							}) +
								Math.max(player.getCardUsable("sha"), player.countCards("hs", "sha")));
					}
					if (damaged > player.hp) {
						return "选项二";
					}
					return "选项一";
				})
				.forResult();
			event.result = {
				bool: result.control != "cancel2",
				cost_data: result.control,
			};
		},
		async content(event, trigger, player) {
			if (event.cost_data == "选项一") {
				player.draw(player.getHp());
				player.addTempSkill("dczhanjue_directHit", { player: "phaseUseEnd" });
			} else {
				player.draw(player.getDamagedHp());
				player.addTempSkill("dczhanjue_recover", { player: "phaseUseEnd" });
			}
		},
		subSkill: {
			directHit: {
				audio: "dczhanjue",
				charlotte: true,
				forced: true,
				mod: {
					targetInRange(card) {
						if (card.name == "sha") {
							return true;
						}
					},
				},
				trigger: {
					player: "useCard",
				},
				filter(event, player) {
					return event.card.name == "sha";
				},
				async content(event, trigger, player) {
					trigger.directHit.addArray(game.players);
					game.log(trigger.card, "不可被响应");
					player.removeSkill(event.name);
				},
			},
			recover: {
				audio: "dczhanjue",
				trigger: {
					source: "damageSource",
				},
				forced: true,
				charlotte: true,
				content: async function (event, trigger, player) {
					if (player.isDamaged()) {
						player.recover(trigger.num);
					}
					player.removeSkill(event.name);
				},
			},
		},
	},
	//应天司马懿！别肘
	jilin: {
		audio: 5,
		trigger: {
			global: "phaseBefore",
			player: "enterGame",
		},
		filter(event, player) {
			return event.name != "phase" || game.phaseNumber == 0;
		},
		forced: true,
		locked: false,
		logAudio: () => 1,
		async content(event, trigger, player) {
			const cards = get.cards(2);
			const next = player.addToExpansion(cards, "draw");
			next.gaintag.add(event.name);
			await next;
		},
		marktext: "志",
		intro: {
			markcount: "expansion",
			mark(dialog, content, player) {
				const cards = player.getExpansions("jilin"),
					mingzhi = cards.filter(card => card.storage.jilin),
					hidden = cards.removeArray(mingzhi);
				if (mingzhi.length) {
					dialog.addText("已明之志");
					dialog.addSmall(mingzhi);
				}
				if (hidden.length) {
					if (player == game.me || player.isUnderControl()) {
						dialog.addText("未明之志");
						dialog.addSmall(hidden);
					} else {
						return "共有" + get.cnNumber(hidden.length) + "张暗“志”";
					}
				}
			},
			content(content, player) {
				const cards = player.getExpansions("jilin"),
					mingzhi = cards.filter(card => card.storage.jilin),
					hidden = cards.removeArray(mingzhi);
				if (mingzhi.length) {
					dialog.addText("已明之志");
					dialog.addSmall(mingzhi);
				}
				if (hidden.length) {
					if (player == game.me || player.isUnderControl()) {
						dialog.addText("未明之志");
						dialog.addSmall(hidden);
					} else {
						return "共有" + get.cnNumber(hidden.length) + "张暗“志”";
					}
				}
			},
		},
		group: ["jilin_kanpo", "jilin_change"],
		subSkill: {
			kanpo: {
				audio: ["jilin2.mp3", "jilin3.mp3"],
				trigger: {
					target: "useCardToTarget",
				},
				filter(event, player) {
					return event.player != player && player.getExpansions("jilin").some(card => !card.storage.jilin);
				},
				async cost(event, trigger, player) {
					const hidden = player.getExpansions("jilin").filter(card => !card.storage.jilin);
					const goon = get.effect(player, trigger.card, trigger.player, player) < 0;
					const suits = player
						.getExpansions("jilin")
						.filter(card => card.storage.jilin)
						.map(card => get.suit(card))
						.toUniqued();
					if (hidden.length == 1) {
						const bool = await player
							.chooseBool("戢鳞：明置一张“志”", `令${get.translation(trigger.card)}对你无效`)
							.set("choice", goon)
							.forResultBool();
						event.result = {
							bool: bool,
							cost_data: hidden,
						};
					} else {
						const {
							result: { bool, links },
						} = await player
							.chooseButton(["戢鳞：明置一张“志”", hidden])
							.set("ai", button => {
								const player = get.player(),
									card = button.link,
									suits = get.event("suits");
								if (!get.event("goon")) {
									return 0;
								}
								if (!suits.includes(get.suit(card))) {
									return 10;
								}
								return 6 - get.value(card);
							})
							.set("suits", suits)
							.set("goon", goon);
						event.result = {
							bool: bool,
							cost_data: links,
						};
					}
				},
				async content(event, trigger, player) {
					await player.showCards(event.cost_data, get.translation(player) + "发动了【戢鳞】");
					event.cost_data[0].storage.jilin = true;
					trigger.getParent().excluded.add(player);
				},
			},
			change: {
				audio: ["jilin4.mp3", "jilin5.mp3"],
				trigger: {
					player: "phaseBegin",
				},
				filter(event, player) {
					return player.countCards("h") && player.getExpansions("jilin").some(card => !card.storage.jilin);
				},
				async cost(event, trigger, player) {
					const hidden = player.getExpansions("jilin").filter(card => !card.storage.jilin);
					const next = player.chooseToMove("戢鳞：是否交换“志”和手牌？");
					next.set("list", [
						[get.translation(player) + "（你）的未明之“志”", hidden],
						["手牌区", player.getCards("h")],
					]);
					next.set("filterMove", (from, to) => {
						return typeof to != "number";
					});
					next.set("processAI", list => {
						let player = get.player(),
							cards = list[0][1].concat(list[1][1]).sort(function (a, b) {
								return get.useful(a) - get.useful(b);
							}),
							cards2 = cards.splice(0, player.getExpansions("jilin").length);
						return [cards2, cards];
					});
					const {
						result: { bool, moved },
					} = await next;
					event.result = {
						bool: bool,
						cost_data: moved,
					};
				},
				async content(event, trigger, player) {
					const moved = event.cost_data;
					const pushs = moved[0],
						gains = moved[1];
					pushs.removeArray(player.getExpansions("jilin"));
					gains.removeArray(player.getCards("h"));
					if (!pushs.length || pushs.length != gains.length) {
						return;
					}
					const next = player.addToExpansion(pushs);
					next.gaintag.add("jilin");
					await next;
					await player.gain(gains, "draw");
				},
			},
		},
	},
	yingyou: {
		audio: 4,
		trigger: {
			player: "phaseUseBegin",
		},
		filter(event, player) {
			return player.countCards("h") && player.getExpansions("jilin").some(card => !card.storage.jilin);
		},
		async cost(event, trigger, player) {
			const hidden = player.getExpansions("jilin").filter(card => !card.storage.jilin);
			const suits = player
				.getExpansions("jilin")
				.filter(card => card.storage.jilin)
				.map(card => get.suit(card))
				.toUniqued();
			const {
				result: { bool, links },
			} = await player
				.chooseButton(["英猷：你可以明志", hidden])
				.set("ai", button => {
					const player = get.player(),
						card = button.link,
						suits = get.event("suits");
					const getNum = player => {
						var list = [];
						for (var i of lib.suit) {
							list.push(player.countCards("h", { suit: i }) + 3);
						}
						return list.sort((a, b) => b - a)[0];
					};
					if (!suits.includes(get.suit(card))) {
						return 10;
					}
					if (get.suit(card) == getNum(player)) {
						return 5;
					}
					return 0;
				})
				.set("suits", suits);
			event.result = {
				bool: bool,
				cost_data: links,
			};
		},
		logAudio: () => 2,
		async content(event, trigger, player) {
			await player.showCards(event.cost_data, get.translation(player) + "发动了【英猷】");
			event.cost_data[0].storage.jilin = true;
			const num = player.getExpansions("jilin").filter(card => card.storage.jilin).length;
			await player.draw(num);
		},
		ai: {
			combo: "jilin",
		},
		group: "yingyou_draw",
		subSkill: {
			draw: {
				audio: ["yingyou3.mp3", "yingyou4.mp3"],
				trigger: {
					player: "loseAfter",
					global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"],
				},
				filter(event, player) {
					const suits = player
						.getExpansions("jilin")
						.filter(card => card.storage.jilin)
						.map(card => get.suit(card))
						.toUniqued();
					const evt = event.getl(player);
					if (!evt || !evt.cards2 || !evt.cards2.length) {
						return false;
					}
					return evt.cards2.some(card => {
						return suits.includes(get.suit(card, player));
					});
				},
				forced: true,
				locked: false,
				async content(event, trigger, player) {
					const suits = player
						.getExpansions("jilin")
						.filter(card => card.storage.jilin)
						.map(card => get.suit(card))
						.toUniqued();
					const num = trigger.getl(player).cards2.filter(card => {
						return suits.includes(get.suit(card, player));
					}).length;
					await player.draw(num);
				},
			},
		},
	},
	yingtian: {
		audio: 2,
		trigger: { global: "dieAfter" },
		filter(event, player) {
			return game.countGroup() < 3;
		},
		forced: true,
		juexingji: true,
		skillAnimation: true,
		animationColor: "gray",
		async content(event, trigger, player) {
			const skill = event.name;
			player.awakenSkill(skill);
			await player.changeSkills(get.info(skill).derivation, ["yingyou"]);
			player.addSkill(skill + "_effect");
		},
		derivation: ["reguicai", "rewansha", "lianpo"],
		subSkill: {
			effect: {
				mod: {
					targetInRange: () => true,
				},
			},
		},
	},
	//手杀神司马？
	//极略神司马！
	xinrenjie: {
		audio: 2,
		trigger: {
			player: ["chooseToUseAfter", "chooseToRespondAfter"],
			global: "_wuxieAfter",
		},
		filter(event, player) {
			if (player.countMark("xinrenjie_used") >= 4) {
				return false;
			}
			if (event.name == "chooseToUse" && event.type == "wuxie") {
				return false;
			}
			if (event.name == "_wuxie") {
				if (event.wuxieresult && event.wuxieresult == player) {
					return false;
				}
				if (event._info_map.player == player) {
					return false;
				}
				return true;
			}
			return event.respondTo && event.respondTo[0] !== player && !event.result.bool;
		},
		forced: true,
		async content(event, trigger, player) {
			player.addMark("xinrenjie", 1);
			player.addTempSkill("xinrenjie_used", "roundStart");
			player.addMark("xinrenjie_used", 1, false);
		},
		intro: {
			name2: "忍",
			content: "mark",
		},
		marktext: "忍",
		hiddenCard: player => player.countMark("xinrenjie_used") < 4,
		ai: {
			combo: "xinjilve",
			respondSha: true,
			respondShan: true,
			skillTagFilter(player) {
				if (player.countMark("xinrenjie_used") >= 4) {
					return false;
				}
			},
		},
		group: "xinrenjie_change",
		subSkill: {
			used: {
				charlotte: true,
				onremove: true,
			},
			change: {
				audio: "xinrenjie",
				trigger: {
					global: "phaseBefore",
					player: "enterGame",
				},
				filter(event, player) {
					if (event.name === "phase" && game.phaseNumber > 0) {
						return false;
					}
					if (!lib.group.some(group => group !== "shen")) {
						return false;
					}
					return player.group === "shen" && player._groupChosen !== "kami";
				},
				async cost(event, trigger, player) {
					const groups = lib.group.filter(group => group !== "shen");
					const result = (event.result = await player
						.chooseControl(groups, "cancel2")
						.set("ai", () => {
							const groups = get.event().controls.filter(group => !["wei", "shu", "wu", "qun"].includes(group));
							return groups.length ? groups.randomGet() : "cancel2";
						})
						.set("prompt", get.translation("xinrenjie") + "：是否变更势力？")
						.forResult());
					event.result.bool = typeof result.control === "string" && result.control !== "cancel2";
					event.result.cost_data = result.control;
				},
				content() {
					player.changeGroup(event.cost_data);
				},
			},
		},
	},
	xinbaiyin: {
		audio: 2,
		inherit: "sbaiyin",
		filter(event, player) {
			return player.countMark("xinrenjie") >= 4;
		},
		async content(event, trigger, player) {
			player.awakenSkill(event.name);
			await player.loseMaxHp();
			await player.addSkills("xinjilve");
		},
		derivation: ["xinjilve", "reguicai", "fangzhu", "rejizhi", "rezhiheng", "rewansha"],
		ai: { combo: "xinrenjie" },
	},
	xinlianpo: {
		audio: "lianpo",
		audioname: ["new_simayi"],
		trigger: { source: "dieAfter" },
		filter(event, player) {
			return !player.hasSkill("xinlianpo_mark") || get.info("xinbaiyin").derivation.some(skill => !["xinjilve", "reguicai"].includes(skill) && !player.hasSkill(skill, null, null, false));
		},
		async cost(event, trigger, player) {
			const skills = get
				.info("xinbaiyin")
				.derivation.removeArray(["xinjilve", "reguicai"])
				.filter(skill => !player.hasSkill(skill, null, null, false));
			if (skills.length && player.hasSkill("xinjilve", null, null, false)) {
				const next = player.chooseButton(["连破：请选择一项", [skills.map(i => [i, `获得【${get.translation(i)}】`]).concat(["于此回合结束后获得一个额外回合"]), "textbutton"]]);
				next.set("ai", button => {
					const link = button.link,
						skills = get.event("skills");
					if ((skills.length <= 2 || game.countPlayer() <= 2) && !player.hasSkill("xinlianpo_mark", null, null, false) && link == "于此回合结束后获得一个额外回合") {
						return 6;
					}
					if (link == "rezhiheng" && player.countCards("h") > 0) {
						return 5;
					}
					if (link == "rejizhi" && (!skills.includes("rezhiheng") || player.countCards("hs", { type: "trick" }))) {
						return 3;
					}
					if (link == "rewansha" && game.hasPlayer(current => get.attitude(player, current) < 0 && current.getHp() < 2 && (player == _status.currentPhase || player.hasSkill("xinlianpo_mark", null, null, false)))) {
						return 2;
					}
					return 1;
				});
				next.set("skills", skills);
				const {
					result: { bool, links },
				} = await next;
				event.result = {
					bool: bool,
					cost_data: links,
				};
			} else {
				const bool = await player.chooseBool("连破：于此回合结束后获得一个额外回合？").forResultBool();
				event.result = {
					bool: bool,
				};
			}
		},
		async content(event, trigger, player) {
			const links = event.cost_data;
			if (links && get.info("xinbaiyin").derivation.includes(links[0])) {
				await player.addSkills(links[0]);
			} else {
				player.addTempSkill("xinlianpo_mark");
				player.insertPhase();
			}
		},
		subSkill: {
			mark: {
				charlotte: true,
				mark: true,
				intro: {
					content: "本回合结束后执行一个额外回合",
				},
			},
		},
	},
	xinjilve: {
		audio: 2,
		trigger: { player: "phaseUseBegin" },
		filter(event, player) {
			return player.countMark("xinrenjie");
		},
		async cost(event, trigger, player) {
			const limit = Math.min(3, player.countMark("xinrenjie"));
			const choices = Array.from({
				length: limit,
			}).map((_, i) => [i, get.cnNumber(i + 1, true)]);
			const history = game.getAllGlobalHistory("everything", evt => evt.name == "xinjilve" && evt.player == player && Array.isArray(evt.cost_data) && get.info("xinbaiyin").derivation.includes(evt.cost_data[0]));
			const num = Math.max(2, history.length + 1);
			const skills = get
				.info("xinbaiyin")
				.derivation.removeArray(["xinjilve", "reguicai"])
				.filter(skill => !player.hasSkill(skill, null, null, false));
			if (skills.length && limit >= num) {
				const next = player.chooseButton(2, ["连破：请选择你要移去的“忍”标记数和相应操作", '<div class="text center">移去“忍”标记数</div>', [choices, "tdnodes"], '<div class="text center">执行的操作</div>', [skills.map(i => [i, `获得【${get.translation(i)}】`]).concat(["摸牌"]), "tdnodes"]]);
				next.set("filterButton", button => {
					const link = button.link;
					if (Boolean(ui.selected.buttons.length) !== (typeof link == "number")) {
						return false;
					}
					if (ui.selected.buttons.length) {
						if (ui.selected.buttons[0].link == "摸牌") {
							return link <= 1;
						}
						return link == get.event("num") - 1;
					}
					return true;
				});
				next.set("ai", button => {
					const link = button.link,
						num = get.event("num"),
						skills = get.event("skills");
					if (!ui.selected.buttons.length) {
						if (num > 2 && link == "摸牌") {
							return 10;
						}
						if (link == "rezhiheng" && player.countCards("h") > 0) {
							return 10;
						}
						if (link == "rejizhi" && (!skills.includes("rezhiheng") || player.countCards("hs", { type: "trick" }))) {
							return 8;
						}
						if (player.countMark("xinrenjie") <= 2) {
							return 0;
						}
					}
					return ui.selected.buttons.length && ui.selected.buttons[0].link == "摸牌" ? num - 1 : 1;
				});
				next.set("num", num);
				next.set("skills", skills);
				const {
					result: { bool, links },
				} = await next;
				event.result = {
					bool: bool,
					cost_data: links,
				};
			} else {
				const draw = Array.from({
					length: Math.min(2, limit),
				}).map((_, i) => get.cnNumber(i + 1, true));
				const { result } = await player
					.chooseControl(draw, "cancel2")
					.set("prompt", get.prompt("xinrenjie"))
					.set("prompt2", `你可以移去至多${get.cnNumber(draw.length)}枚“忍”标记并摸等量张牌`)
					.set("ai", () => {
						return get.event("choice");
					})
					.set(
						"choice",
						(function () {
							if (!player.hasSkill("rejizhi", null, null, false)) {
								return "cancel2";
							}
							return choices.length - 1;
						})()
					);
				event.result = {
					bool: result.control != "cancel2",
					cost_data: result.index,
				};
			}
		},
		async content(event, trigger, player) {
			const choice = event.cost_data;
			if (typeof choice == "number") {
				player.removeMark("xinrenjie", choice + 1);
				await player.draw(choice + 1);
			} else if (get.info("xinbaiyin").derivation.includes(choice[0])) {
				const history = game.getAllGlobalHistory("everything", evt => evt.name == "xinjilve" && evt.player == player && Array.isArray(evt.cost_data) && get.info("xinbaiyin").derivation.includes(evt.cost_data[0]));
				const num = Math.max(2, history.length);
				player.removeMark("xinrenjie", num);
				await player.addSkills(choice[0]);
			} else {
				player.removeMark("xinrenjie", choice[1] + 1);
				await player.draw(choice[1] + 1);
			}
		},
		group: "xinjilve_gain",
		subSkill: {
			gain: {
				audio: "xinjilve",
				trigger: {
					player: "changeSkillsAfter",
				},
				filter(event, player) {
					return event.addSkill.includes("xinjilve");
				},
				forced: true,
				async content(event, trigger, player) {
					let skills = ["reguicai"];
					const groupList = new Map([
						["wei", "fangzhu"],
						["shu", "rejizhi"],
						["wu", "rezhiheng"],
						["qun", "rewansha"],
						["key", "hiroto_zonglve"],
					]);
					if (Array.from(groupList.keys()).includes(player.group)) {
						skills.push(groupList.get(player.group));
					}
					skills = skills.filter(skill => !player.hasSkill(skill, null, null, false));
					if (skills.length) {
						await player.addSkills(skills);
					}
				},
			},
		},
		ai: {
			notemp: true,
		},
	},
	//十周年神华佗
	jingyu: {
		audio: 2,
		trigger: {
			global: ["useSkill", "logSkillBegin"],
		},
		filter(event, player) {
			if (["global", "equip"].includes(event.type)) {
				return false;
			}
			let skill = get.sourceSkillFor(event);
			if (!skill || skill === "jingyu") {
				return false;
			}
			let info = get.info(skill);
			if (!info || info.charlotte || info.equipSkill) {
				return false;
			}
			return !player.getStorage("jingyu_used").includes(skill);
		},
		direct: true,
		forced: true,
		async content(event, trigger, player) {
			if (!player.storage.jingyu_used) {
				player
					.when({ global: "roundStart" })
					.assign({
						firstDo: true,
					})
					.then(() => delete player.storage.jingyu_used);
			}
			let skill = get.sourceSkillFor(trigger);
			player.markAuto("jingyu_used", skill);
			player.logSkill(event.name);
			await player.draw();
		},
		ai: { threaten: 6 },
	},
	lvxin: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		filterCard: true,
		filterTarget: lib.filter.notMe,
		filter() {
			const round = game.roundNumber;
			return typeof round == "number" && round > 0;
		},
		check(card) {
			const round = game.roundNumber,
				player = get.player();
			let valueFix = 0;
			if (["sha", "shan"].includes(get.name(card, false))) {
				valueFix += 3;
			}
			if (
				(round <= 2 &&
					player.hasCard(card => {
						return ["sha", "shan"].includes(get.name(card)) && get.value(card) <= 3;
					})) ||
				game.hasPlayer(current => {
					return current !== player && get.attitude(player, current) > 0;
				})
			) {
				return 6 - get.value(card) + valueFix;
			}
			return 4.5 - get.value(card) + valueFix;
		},
		delay: false,
		discard: false,
		lose: false,
		async content(event, trigger, player) {
			const { target, cards } = event,
				round = Math.min(5, game.roundNumber);
			const name = get.translation(target);
			await player.give(cards, target);
			const result = await player
				.chooseControl(["摸牌", "弃牌"])
				.set("choiceList", [`令${name}摸${get.cnNumber(round)}张牌`, `令${name}随机弃置${get.cnNumber(round)}张手牌`])
				.set("prompt", "滤心：请选择一项")
				.set("ai", () => {
					return get.event("choice");
				})
				.set("choice", get.attitude(player, target) > 0 ? "摸牌" : "弃牌")
				.forResult();
			let cards2 = [];
			const makeDraw = result.index === 0;
			if (makeDraw) {
				cards2 = await target.draw(round).forResult();
			} else {
				const cards = target.getCards("h", card => {
					return lib.filter.cardDiscardable(card, target, "lvxin");
				});
				if (cards.length > 0) {
					const evt = target.discard(cards.randomGets(round)).set("discarder", target);
					await evt;
					cards2 = evt.done.cards2;
				}
			}
			const cardName = get.name(cards[0], player);
			if (
				cards2.some(card => {
					return get.name(card, target) === cardName;
				})
			) {
				const skillName = `lvxin_${makeDraw ? "recover" : "lose"}`;
				target.addSkill(skillName);
				target.addMark(skillName, 1, false);
			}
		},
		subSkill: {
			recover: {
				trigger: { player: ["useSkill", "logSkillBegin", "useCard", "respond"] },
				filter(event, player) {
					if (["global", "equip"].includes(event.type)) {
						return false;
					}
					if ((get.info(event.skill) || {}).charlotte) {
						return false;
					}
					const skill = get.sourceSkillFor(event);
					const info = get.info(skill);
					return info && !info.charlotte && !info.equipSkill;
				},
				forced: true,
				onremove: true,
				charlotte: true,
				async content(event, trigger, player) {
					player.recover(player.countMark(event.name));
					player.removeSkill(event.name);
				},
				intro: { content: "下次发动技能时回复#点体力" },
			},
			lose: {
				trigger: { player: ["useSkill", "logSkillBegin", "useCard", "respond"] },
				filter(event, player) {
					if (["global", "equip"].includes(event.type)) {
						return false;
					}
					if ((get.info(event.skill) || {}).charlotte) {
						return false;
					}
					const skill = get.sourceSkillFor(event);
					const info = get.info(skill);
					return info && !info.charlotte && !info.equipSkill;
				},
				forced: true,
				onremove: true,
				charlotte: true,
				async content(event, trigger, player) {
					player.loseHp(player.countMark(event.name));
					player.removeSkill(event.name);
				},
				intro: { content: "下次发动技能时失去#点体力" },
			},
		},
		ai: {
			order: 5,
			result: {
				target(player, target) {
					const round = game.roundNumber;
					if (
						round <= 2 &&
						target.countCards("h") > round * 2 &&
						player.getCards("h").some(card => {
							return ["sha", "shan"].includes(get.name(card)) && get.value(card) <= 3;
						})
					) {
						return 1;
					}
					if (get.attitude(player, target) > 0) {
						return round + Math.sqrt(1 + target.getDamagedHp());
					}
					return -(round + Math.sqrt(Math.max(0, 2 - target.getHp())));
				},
			},
		},
	},
	huandao: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		limited: true,
		filterTarget: lib.filter.notMe,
		skillAnimation: true,
		animationColor: "metal",
		async content(event, trigger, player) {
			player.awakenSkill(event.name);
			const { target } = event;
			await target.turnOver(false);
			await target.link(false);
			let names = [target.name1 || target.name];
			if (target.name2) {
				names.add(target.name2);
			}
			names = names.map(name => get.rawName(name));
			if (!_status.characterlist) {
				game.initCharactertList();
			}
			_status.characterlist.randomSort();
			let ownedSkills = target.getSkills(null, false, false),
				ownedSkillsName = ownedSkills.map(skill => get.translation(skill));
			let skillToGain = null;
			outer: for (const name of _status.characterlist) {
				const info = lib.character[name];
				if (!names.includes(get.rawName(name))) {
					continue;
				}
				const skills = info[3].slice().randomSort();
				while (skills.length) {
					const skill = skills.shift(),
						skillName = get.translation(skill);
					if (!ownedSkillsName.includes(skillName)) {
						skillToGain = skill;
						break outer;
					}
				}
			}
			if (!skillToGain) {
				return;
			}
			player.popup(skillToGain);
			player.line(target, "green");
			let prompt2 = "若你选择是，则你于获得此技能后须失去一个其他技能。<br><br>";
			if (lib.skill[skillToGain].nobracket) {
				prompt2 += `<div class="skilln">${get.translation(skillToGain)}</div><div><span style="font-family: yuanli">${get.skillInfoTranslation(skillToGain)}</span></div><br><br>`;
			} else {
				const translation = lib.translate[skillToGain + "_ab"] || get.translation(skillToGain).slice(0, 2);
				prompt2 += `<div class="skill">【${translation}】</div><div><span style="font-family: yuanli">${get.skillInfoTranslation(skillToGain)}</span></div><br><br>`;
			}
			const bool = await target
				.chooseBool(`寰道：是否获得技能〖${get.translation(skillToGain)}〗？`, prompt2)
				.set(
					"choice",
					(() => {
						const rank = get.skillRank(skillToGain, "inout") + 1;
						return ownedSkills.some(skill => {
							const info = get.info(skill);
							if (info) {
								if (target.awakenedSkills.includes(skill) && (info.limited || info.juexingji || info.dutySkill)) {
									return true;
								}
								if (info.ai && (info.ai.neg || info.ai.halfneg)) {
									return true;
								}
							}
							return get.skillRank(skill, "inout") < rank;
						});
					})()
				)
				.forResultBool();
			if (!bool) {
				target.chat("拒绝");
				game.log(target, "拒绝获得技能", `#g【${get.translation(skillToGain)}】`);
				await game.delay();
				return;
			}
			await target.addSkills(skillToGain);
			ownedSkills = target.getSkills(null, false, false).filter(skill => {
				if (skill === skillToGain) {
					return false;
				}
				const info = get.info(skill);
				if (!info || info.charlotte || !get.skillInfoTranslation(skill, player).length) {
					return false;
				}
				return true;
			});
			if (!ownedSkills) {
				return;
			}
			const control = await target
				.chooseControl(ownedSkills)
				.set(
					"choiceList",
					ownedSkills.map(skill => {
						return `<div class="skill">【${get.translation(lib.translate[skill + "_ab"] || get.translation(skill).slice(0, 2))}】</div><div>${get.skillInfoTranslation(skill, target)}</div>`;
					})
				)
				.set("displayIndex", false)
				.set("prompt", "寰道：选择失去一个技能")
				.set("ai", () => {
					return get.event("choice");
				})
				.set(
					"choice",
					(() => {
						const uselessSkills = ownedSkills.filter(skill => {
							const info = get.info(skill);
							if (!info) {
								return false;
							}
							if (target.awakenedSkills.includes(skill) && (info.limited || info.juexingji || info.dutySkill)) {
								return true;
							}
							if (info.ai && (info.ai.neg || info.ai.halfneg)) {
								return true;
							}
							return false;
						});
						if (uselessSkills.length) {
							return uselessSkills.randomGet();
						}
						return ownedSkills.sort((a, b) => {
							return get.skillRank(a, "inout") - get.skillRank(b, "inout");
						})[0];
					})()
				)
				.forResultControl();
			await target.removeSkills(control);
		},
		ai: {
			order: 5,
			result: {
				target(player, target) {
					if (!_status.characterlist) {
						game.initCharactertList();
					}
					if (game.roundNumber * game.countPlayer() <= (1.5 * game.countPlayer2()) / Math.sqrt(player.getDamagedHp() + 1)) {
						return 0;
					}
					const ownedSkills = target.getSkills(null, false, false).filter(skill => {
						const info = get.info(skill);
						if (!info || info.charlotte || !get.skillInfoTranslation(skill, player).length) {
							return false;
						}
						return true;
					});
					const uselessSkills = ownedSkills.filter(skill => {
						const info = get.info(skill);
						if (!info) {
							return false;
						}
						if (target.awakenedSkills.includes(skill) && (info.limited || info.juexingji || info.dutySkill)) {
							return true;
						}
						if (info.ai && (info.ai.neg || info.ai.halfneg)) {
							return true;
						}
						return false;
					});
					if (uselessSkills.length) {
						return 3;
					}
					let names = [target.name1 || target.name];
					if (target.name2) {
						names.add(target.name2);
					}
					names = names.map(name => get.rawName(name));
					if (_status.characterlist.some(name => names.includes(get.rawName(name)))) {
						return 1;
					}
					return 0;
				},
			},
		},
	},
	//神许褚
	zhengqing: {
		audio: 2,
		trigger: { global: "roundEnd" },
		forced: true,
		filter() {
			return (
				game.hasPlayer(current => {
					return current.countMark("zhengqing");
				}) || lib.skill.zhengqing.getMostInfoLastRound()[0] > 0
			);
		},
		getMostInfoLastRound() {
			let max = -1,
				players = [];
			const history = game.getAllGlobalHistory();
			if (history.length <= 1) {
				return [max, players];
			}
			for (let i = history.length - 1; i >= 0; i--) {
				const evts = history[i]["everything"].filter(evt => {
					if (evt.name !== "damage") {
						return false;
					}
					const source = evt.source;
					return source && source.isIn();
				});
				if (evts.length) {
					let curMax = -1,
						curPlayers = [];
					const map = {};
					for (const evt of evts) {
						const source = evt.source;
						const id = source.playerid;
						if (typeof map[id] !== "number") {
							map[id] = 0;
						}
						map[id] += evt.num;
						if (map[id] > curMax) {
							curMax = map[id];
							curPlayers = [source];
						} else if (map[id] == curMax) {
							curPlayers.add(source);
						}
					}
					if (curMax > max) {
						max = curMax;
						players = curPlayers.slice();
					} else if (curMax === max) {
						players.addArray(curPlayers);
					}
				}
				if (history[i].isRound) {
					break;
				}
			}
			return [max, players];
		},
		async content(event, trigger, player) {
			game.countPlayer(current => {
				if (current.hasMark("zhengqing")) {
					current.clearMark("zhengqing");
				}
			});
			const [num, players] = lib.skill.zhengqing.getMostInfoLastRound();
			let target;
			if (!players.length) {
				return;
			} else if (players.length === 1) {
				target = players[0];
			} else if (players.includes(player)) {
				target = player;
			} else {
				target = players.randomGet();
			}
			player.line(target, "thunder");
			const isMax =
				(player
					.getAllHistory("custom", evt => evt && evt.zhengqing_count)
					.map(evt => evt.zhengqing_count)
					.sort((a, b) => b - a)[0] || 0) <= num;
			target.addMark("zhengqing", num);
			if (target === player && isMax) {
				player.draw(Math.min(5, num));
				player.getHistory("custom").push({ zhengqing_count: num });
			} else {
				await game.asyncDraw([player, target].sortBySeat(trigger.player));
			}
		},
		marktext: "擎",
		intro: {
			name: "争擎",
			name2: "擎",
			content: "mark",
		},
	},
	zhuangpo: {
		audio: 2,
		enable: "chooseToUse",
		onChooseToUse(event) {
			if (!game.online && !event.zhuangpo_cards) {
				event.set(
					"zhuangpo_cards",
					event.player.getCards("hes", card => {
						if (get.name(card, event.player) == "sha") {
							return true;
						}
						const str = get.cardDescription(card, event.player);
						return str.includes("【杀】");
					})
				);
			}
		},
		viewAs: {
			name: "juedou",
			storage: { zhuangpo: true },
		},
		viewAsFilter() {
			return get.event("zhuangpo_cards")?.length;
		},
		prompt: "将一张牌面信息包含“【杀】”的牌当【决斗】使用",
		filterCard(card, player) {
			return get.event("zhuangpo_cards").includes(card);
		},
		position: "hes",
		precontent() {
			player.addTempSkill("zhuangpo_effect");
		},
		subSkill: {
			effect: {
				trigger: {
					player: "useCardToPlayered",
				},
				filter(event, player) {
					const card = event.card;
					if (!card || !card.storage || !card.storage.zhuangpo) {
						return false;
					}
					return player.hasMark("zhengqing");
				},
				direct: true,
				charlotte: true,
				group: "zhuangpo_damage",
				async content(event, trigger, player) {
					const target = trigger.target;
					const list = Array.from({ length: player.countMark("zhengqing") }, (_, i) => {
						return get.cnNumber(i + 1, true);
					});
					const result = await player
						.chooseControl(list, "cancel2")
						.set("prompt", "壮魄：是否移去任意枚“擎”？")
						.set("prompt2", `若如此做，${get.translation(target)}须弃置等量的牌`)
						.set("ai", () => get.event("choice"))
						.set(
							"choice",
							(() => {
								if (get.attitude(player, target) >= 0) {
									return "cancel2";
								}
								const markCount = list.length;
								const cards = target.getCards("he", card => lib.filter.cardDiscardable(card, target));
								let allIn = false;
								if (player.hp < 2 || target.hp + target.countCards("h", card => target.canSaveCard(card, target)) <= 1 + trigger.targets.some(current => current.hasMark("zhengqing"))) {
									allIn = true;
								}
								if (cards.map(card => get.value(card)).reduce((p, c) => p + c, 0) / cards.length > 5) {
									allIn = true;
								}
								if (
									!player.isPhaseUsing() ||
									!player.hasCard(card => {
										if (!get.cardDescription(card, player).includes("【杀】")) {
											return false;
										}
										return player.hasValueTarget(get.autoViewAs({ name: "juedou" }, [card]));
									})
								) {
									allIn = true;
								}
								const maxCount = Math.min(markCount, cards.length);
								const toRemoveCount = allIn ? maxCount : Math.ceil(Math.random() * maxCount);
								return get.cnNumber(toRemoveCount, true);
							})()
						)
						.forResult();
					if (result.control === "cancel2") {
						return;
					}
					const toRemoveCount = result.index + 1;
					player.logSkill("zhuangpo_effect", target);
					player.popup(get.cnNumber(toRemoveCount) + "张");
					player.removeMark("zhengqing", toRemoveCount);
					target.chooseToDiscard("he", toRemoveCount, true);
				},
			},
			damage: {
				audio: "zhuangpo",
				trigger: { global: "damageBegin1" },
				filter(event, player) {
					const card = event.card;
					if (!card || !card.storage || !card.storage.zhuangpo) {
						return false;
					}
					const evt = event.getParent(2);
					return evt.targets && evt.targets.some(current => current.hasMark("zhengqing"));
				},
				charlotte: true,
				forced: true,
				async content(event, trigger) {
					trigger.num++;
				},
			},
		},
	},
	//神鲁肃
	dingzhou: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			const num = player.countCards("he");
			return game.hasPlayer(current => {
				if (current == player) {
					return false;
				}
				const total = current.countCards("ej");
				return total > 0 && num >= total;
			});
		},
		filterCard: true,
		selectCard() {
			return [1, Math.max(...game.filterPlayer(i => i != get.player()).map(i => i.countCards("ej")))];
		},
		check(card) {
			return 7 - get.value(card);
		},
		filterTarget(card, player, target) {
			const num = target.countCards("ej");
			if (!num) {
				return false;
			}
			return ui.selected.cards.length == num && player != target;
		},
		filterOk() {
			return ui.selected.cards.length == ui.selected.targets[0].countCards("ej");
		},
		position: "he",
		lose: false,
		discard: false,
		delay: false,
		async content(event, trigger, player) {
			const target = event.targets[0];
			await player.give(event.cards, target);
			const cards = target.getGainableCards(player, "ej");
			if (cards.length) {
				player.gain(cards, "give", target);
			}
		},
		ai: {
			order: 9,
			result: {
				target(player, target) {
					let eff = 0;
					if (ui.selected.cards.length) {
						eff = ui.selected.cards.map(card => get.value(card)).reduce((p, c) => p + c, 0);
					}
					if (player.hasSkill("zhimeng") && (get.mode() == "identity" || player.countCards("h") - target.countCards("h") > 2 * ui.selected.cards.length)) {
						eff *= 1 + get.sgnAttitude(player, target) * 0.15;
					}
					const es = target.getCards("e"),
						js = target.getCards("j");
					es.forEach(card => {
						eff -= get.value(card, target);
					});
					js.forEach(card => {
						eff -= get.effect(
							target,
							{
								name: card.viewAs || card.name,
								cards: [card],
							},
							target,
							target
						);
					});
					return eff;
				},
			},
		},
	},
	tamo: {
		available(mode) {
			// 走另外的phaseLoop的模式/子模式/设置
			if (["boss", "stone", "tafang"].includes(mode) || ["jiange", "standard", "three", "leader"].includes(_status.mode) || get.config("seat_order") === "指定") {
				return false;
			}
		},
		getTargets() {
			return game.filterPlayer(current => {
				return !current.isZhu2();
			});
		},
		audio: 2,
		trigger: {
			global: "phaseBefore",
			player: "enterGame",
		},
		filter(event, player) {
			return (event.name != "phase" || game.phaseNumber == 0) && get.info("tamo").getTargets().length > 1;
		},
		seatRelated: "changeSeat",
		derivation: "tamo_faq",
		async cost(event, trigger, player) {
			const toSortPlayers = get.info(event.skill).getTargets();
			toSortPlayers.sortBySeat(game.findPlayer2(current => current.getSeatNum() == 1, true));
			const next = player.chooseToMove("榻谟：是否分配" + (get.mode() != "doudizhu" ? (game.hasPlayer(cur => cur.isZhu2()) ? "除主公外" : "") : "") + "所有角色的座次？");
			next.set("list", [["（以下排列的顺序即为发动技能后角色的座次顺序）", [toSortPlayers.map(i => `${i.getSeatNum()}|${i.name}`), lib.skill.tamo.$createButton]]]);
			next.set("toSortPlayers", toSortPlayers.slice(0));
			next.set("processAI", () => {
				const players = get.event("toSortPlayers"),
					player = get.player();
				players.randomSort().sort((a, b) => get.attitude(player, b) - get.attitude(player, a));
				return [players.map(i => `${i.getSeatNum()}|${i.name}`)];
			});
			const { result } = await next;
			event.result = {
				bool: result?.bool,
				cost_data: [toSortPlayers, result?.moved],
			};
		},
		async content(event, trigger, player) {
			const [toSortPlayers, moved] = event.cost_data;
			const resultList = moved[0].map(info => {
				return parseInt(info.split("|")[0]);
			});
			const toSwapList = [];
			const cmp = (a, b) => {
				return resultList.indexOf(a) - resultList.indexOf(b);
			};
			for (let i = 0; i < toSortPlayers.length; i++) {
				for (let j = 0; j < toSortPlayers.length; j++) {
					if (cmp(toSortPlayers[i].getSeatNum(), toSortPlayers[j].getSeatNum()) < 0) {
						toSwapList.push([toSortPlayers[i], toSortPlayers[j]]);
						[toSortPlayers[i], toSortPlayers[j]] = [toSortPlayers[j], toSortPlayers[i]];
					}
				}
			}
			game.broadcastAll(toSwapList => {
				for (const list of toSwapList) {
					game.swapSeat(list[0], list[1], false);
				}
			}, toSwapList);
			if (trigger.name === "phase" && !trigger.player.isZhu2() && trigger.player !== toSortPlayers[0] && !trigger._finished) {
				trigger.finish();
				trigger._triggered = 5;
				const evt = toSortPlayers[0].insertPhase();
				delete evt.skill;
				const evt2 = trigger.getParent();
				if (evt2.name == "phaseLoop" && evt2._isStandardLoop) {
					evt2.player = toSortPlayers[0];
				}
				//跳过新回合的phaseBefore
				evt.pushHandler("onPhase", (event, option) => {
					if (event.step === 0 && option.state === "begin") {
						event.step = 1;
					}
				});
			}
			await game.delay();
		},
		$createButton(item, type, position, noclick, node) {
			const info = item.split("|"),
				_item = item;
			const seat = parseInt(info[0]);
			item = info[1];
			if (node) {
				node.classList.add("button");
				node.classList.add("character");
				node.style.display = "";
			} else {
				node = ui.create.div(".button.character", position);
			}
			node._link = item;
			node.link = item;

			const func = function (node, item) {
				const currentPlayer = game.findPlayer(current => current.getSeatNum() == seat);
				if (currentPlayer.classList.contains("unseen_show")) {
					node.setBackground("hidden_image", "character");
				} else if (item != "unknown") {
					node.setBackground(item, "character");
				}
				if (node.node) {
					node.node.name.remove();
					node.node.hp.remove();
					node.node.group.remove();
					node.node.intro.remove();
					if (node.node.replaceButton) {
						node.node.replaceButton.remove();
					}
				}
				node.node = {
					name: ui.create.div(".name", node),
					group: ui.create.div(".identity", node),
					intro: ui.create.div(".intro", node),
				};
				const infoitem = [currentPlayer.sex, currentPlayer.group, `${currentPlayer.hp}/${currentPlayer.maxHp}/${currentPlayer.hujia}`];
				node.node.name.innerHTML = get.slimName(item);
				if (lib.config.buttoncharacter_style == "default" || lib.config.buttoncharacter_style == "simple") {
					if (lib.config.buttoncharacter_style == "simple") {
						node.node.group.style.display = "none";
					}
					node.classList.add("newstyle");
					node.node.name.dataset.nature = get.groupnature(get.bordergroup(infoitem));
					node.node.group.dataset.nature = get.groupnature(get.bordergroup(infoitem), "raw");
				}
				node.node.name.style.top = "8px";
				if (node.node.name.querySelectorAll("br").length >= 4) {
					node.node.name.classList.add("long");
					if (lib.config.buttoncharacter_style == "old") {
						node.addEventListener("mouseenter", ui.click.buttonnameenter);
						node.addEventListener("mouseleave", ui.click.buttonnameleave);
					}
				}
				node.node.intro.innerHTML = lib.config.intro;
				if (!noclick) {
					lib.setIntro(node);
				}
				node.node.group.innerHTML = `<div>${get.cnNumber(seat, true)}号</div>`;
				node.node.group.style.backgroundColor = get.translation(`${get.bordergroup(infoitem)}Color`);
			};
			node.refresh = func;
			node.refresh(node, item);

			node.link = _item;
			node.seatNumber = seat;
			node._customintro = uiintro => {
				uiintro.add(`${get.translation(node._link)}(原${get.cnNumber(node.seatNumber, true)}号位)`);
			};
			return node;
		},
	},
	//什么均贫卡
	zhimeng: {
		audio: 2,
		trigger: { player: "phaseAfter" },
		filter(event, player) {
			return game.hasPlayer(target => {
				if (target == player || target.countCards("h") + player.countCards("h") == 0) {
					return false;
				}
				return true;
			});
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt(event.skill), "与一名其他角色平分手牌", (card, player, target) => {
					if (target == player || target.countCards("h") + player.countCards("h") == 0) {
						return false;
					}
					return true;
				})
				.set("ai", target => {
					const player = get.player();
					const pvalue = -player
						.getCards("h")
						.map(card => get.value(card, player))
						.reduce((p, c) => p + c, 0);
					const tvalue =
						-target
							.getCards("h")
							.map(card => get.value(card, target))
							.reduce((p, c) => p + c, 0) * get.sgnAttitude(player, target);
					return (pvalue + tvalue) / 2;
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			const lose_list = [];
			let cards = [];
			[player, target].forEach(current => {
				const hs = current.getCards("h");
				if (hs.length) {
					cards.addArray(hs);
					current.$throw(hs.length, 500);
					game.log(current, "将", get.cnNumber(hs.length), "张牌置入了处理区");
					lose_list.push([current, hs]);
				}
			});
			if (lose_list.length) {
				await game
					.loseAsync({
						lose_list,
					})
					.setContent("chooseToCompareLose");
			}
			await game.delay();
			cards = cards.filterInD();
			const pcards = cards.randomGets(Math.ceil(cards.length / 2));
			const tcards = cards.removeArray(pcards);
			const list = [];
			if (pcards.length) {
				list.push([player, pcards]);
				game.log(player, "获得了", get.cnNumber(pcards.length), "张牌");
			}
			if (tcards.length) {
				list.push([target, tcards]);
				game.log(target, "获得了", get.cnNumber(tcards.length), "张牌");
			}
			await game
				.loseAsync({
					gain_list: list,
					player,
					animate: "draw",
				})
				.setContent("gaincardMultiple");
		},
		ai: { threaten: 4 },
	},
	//神华佗
	wuling: {
		audio: 2,
		enable: "phaseUse",
		filter(event, player) {
			return game.hasPlayer(target => lib.skill.wuling.filterTarget(null, player, target));
		},
		filterTarget(card, player, target) {
			return !target.hasSkill("wuling_wuqinxi");
		},
		usable: 2,
		prompt: "选择一名角色，向其传授“五禽戏”",
		group: "wuling_die",
		content() {
			"step 0";
			target.addAdditionalSkill(`wuling_${player.playerid}`, "wuling_wuqinxi");
			var next = player.chooseToMove(`五灵：调整向${get.translation(target)}传授的“五禽戏”顺序`);
			next.set("list", [
				[
					"",
					[
						lib.skill.wuling.wuqinxi,
						(item, type, position, noclick, node) => {
							node = ui.create.buttonPresets.vcard(item, type, position, noclick);
							node._customintro = [node => `五禽戏：${node.link[2]}`, node => lib.skill.wuling.wuqinxiMap[lib.skill.wuling.wuqinxi.indexOf(node.link[2])].slice(2)];
							return node;
						},
					],
				],
			]);
			next.set("processAI", () => {
				const event = get.event().getParent(),
					player = event.player,
					target = event.target;
				const spirits = [];
				let nextPlayer = player;
				do {
					nextPlayer = nextPlayer.getNext();
					if (get.attitude(player, nextPlayer) < 0) {
						spirits.add("熊");
						break;
					}
				} while (nextPlayer != target);
				if (!spirits.length) {
					spirits.add("猿");
				}
				if (
					get.recoverEffect(target, player, player) > 0 ||
					target.hasCard(card => {
						return (
							get.effect(
								target,
								{
									name: card.viewAs || card.name,
									cards: [card],
								},
								target,
								target
							) < -1
						);
					}, "j")
				) {
					spirits.add("鹿");
				}
				const others = lib.skill.wuling.wuqinxi.slice().removeArray(spirits);
				do {
					others.randomSort();
				} while (others.length > 1 && others[0] == "鹿");
				return [spirits.concat(others).map(i => ["", "", i])];
			});
			"step 1";
			var sortedWuqinxi = result.moved[0].map(i => i[2]);
			game.log(target, "习得的五禽戏顺序为", "#g" + sortedWuqinxi.join("、"));
			sortedWuqinxi.unshift(sortedWuqinxi[0]);
			target.storage.wuling_wuqinxi = sortedWuqinxi;
			lib.skill.wuling.updateMark(target);
		},
		wuqinxi: ["虎", "鹿", "熊", "猿", "鹤"],
		wuqinxiMap: ["虎：当你使用指定唯一目标的牌对目标角色造成伤害时，此伤害+1。", "鹿：①当你获得此效果时，你回复1点体力并弃置判定区的所有牌。②你不能成为延时锦囊牌的目标。", "熊：每回合限一次，当你受到伤害时，此伤害-1。", "猿：当你获得此效果时，你选择一名其他角色，获得其装备区里的一张牌。", "鹤：当你获得此效果时，你摸三张牌。"],
		updateMark(player) {
			var wuqinxi = player.storage.wuling_wuqinxi;
			if (!wuqinxi) {
				return;
			}
			var prevMark = wuqinxi.shift();
			// wuqinxi.push(prevMark);
			var curMark = wuqinxi[0];
			if (!curMark) {
				for (var skill in player.additionalSkills) {
					if (!skill.startsWith("wuling_")) {
						continue;
					}
					player.removeAdditionalSkill(skill);
				}
				game.log(player, "完成了五禽戏的操练");
				return;
			}
			game.log(player, "获得了", "#g【" + curMark + "】", "标记");
			player.markSkill("wuling_wuqinxi");
			game.broadcastAll(
				function (player, curMark) {
					if (player.marks.wuling_wuqinxi) {
						player.marks.wuling_wuqinxi.firstChild.innerHTML = curMark;
					}
				},
				player,
				curMark
			);
			var next = game.createEvent("wuling_change");
			next.player = player;
			next.setContent("emptyEvent");
		},
		ai: {
			order: 7,
			threaten: 5,
			result: { target: 1 },
		},
		derivation: "wuling_wuqinxi",
		subSkill: {
			wuqinxi: {
				nopop: true,
				charlotte: true,
				intro: {
					markcount: () => 0,
					mark(dialog, storage) {
						const wuqinxiMap = lib.skill.wuling.wuqinxiMap;
						const str = `<li>当前效果：${storage[0]}<br><li>${wuqinxiMap.find(str => storage[0] == str[0]).slice(2)}<br>`;
						dialog.addText(str, false);
						const str2 = '<div class="text center">“五禽戏”顺序：<br>' + storage.join(" ") + "</div>";
						dialog.addText(str2);
						if (storage.length > 1) {
							const str3 = `<div class="text" style="font-size:10px; ">[下一效果] ${wuqinxiMap.find(str => storage[1] == str[0])}<br></div>`;
							dialog.add(str3);
						}
					},
				},
				mod: {
					targetEnabled(card, player, target) {
						if (get.type(card) == "delay" && target.storage.wuling_wuqinxi && target.storage.wuling_wuqinxi[0] == "鹿") {
							return false;
						}
					},
				},
				trigger: {
					source: "damageBegin1",
					player: ["phaseZhunbeiBegin", "damageBegin4", "wuling_change"],
				},
				filter(event, player, name) {
					const wuqinxi = player.storage.wuling_wuqinxi && player.storage.wuling_wuqinxi[0];
					if (!wuqinxi) {
						return false;
					}
					if (event.name == "phaseZhunbei") {
						return true;
					}
					switch (name) {
						case "damageBegin1":
							if (wuqinxi != "虎" || !event.card) {
								return false;
							}
							var evt = event.getParent("useCard");
							return evt.targets && evt.targets.length == 1 && evt.targets.includes(event.player);
						case "damageBegin4":
							return wuqinxi == "熊" && !player.hasSkill("wuling_xiong");
						default:
							switch (wuqinxi) {
								case "鹿":
									return player.isDamaged() || player.countCards("j");
								case "鹤":
									return true;
								case "猿":
									return game.hasPlayer(target => target != player && target.countGainableCards(player, "e"));
								default:
									return false;
							}
					}
				},
				forced: true,
				onremove: true,
				content() {
					"step 0";
					var wuqinxi = player.storage.wuling_wuqinxi[0];
					if (trigger.name == "phaseZhunbei") {
						lib.skill.wuling.updateMark(player);
						event.finish();
					} else {
						var name = event.triggername;
						switch (name) {
							case "damageBegin1":
								player.line(trigger.player);
								trigger.num++;
								event.finish();
								break;
							case "damageBegin4":
								player.addTempSkill("wuling_xiong");
								trigger.num--;
								event.finish();
								break;
							default:
								switch (wuqinxi) {
									case "鹿":
										player.recover();
										player.discard(player.getCards("j")).discarder = player;
										event.finish();
										break;
									case "鹤":
										player.draw(3);
										event.finish();
										break;
									case "猿":
										player
											.chooseTarget("五禽戏：获得一名其他角色装备区里的一张装备牌", function (card, player, target) {
												return target != player && target.countGainableCards(player, "e");
											})
											.set("ai", function (target) {
												var player = _status.event.player;
												var att = get.attitude(player, target),
													eff = 0;
												target.getCards("e", function (card) {
													var val = get.value(card, target);
													eff = Math.max(eff, -val * att);
												});
												return eff;
											});
										break;
								}
								break;
						}
					}
					"step 1";
					if (result.bool) {
						var target = result.targets[0];
						player.line(target, "green");
						player.gainPlayerCard(target, "e", true);
					}
				},
				ai: {
					effect: {
						target(card, player, target) {
							const wuqinxi = target.storage.wuling_wuqinxi;
							if (!wuqinxi || !wuqinxi.length) {
								return;
							}
							const curWuqinxi = wuqinxi[0];
							const nextWuqinxi = wuqinxi[1];
							if (nextWuqinxi == "鹿" && get.type(card) == "delay") {
								return "zerotarget";
							}
							if (curWuqinxi != "熊" || player.hasSkill("wuling_xiong")) {
								return;
							}
							if (player.hasSkillTag("jueqing", false, target)) {
								return;
							}
							var num = get.tag(card, "damage");
							if (num) {
								if (num > 1) {
									return 0.5;
								}
								return 0;
							}
						},
					},
				},
			},
			xiong: { charlotte: true },
			die: {
				trigger: { player: "die" },
				filter(event, player) {
					return game.hasPlayer(current => current.additionalSkills[`wuling_${player.playerid}`]);
				},
				forced: true,
				locked: false,
				forceDie: true,
				content() {
					var targets = game.filterPlayer(current => {
						return current.additionalSkills[`wuling_${player.playerid}`];
					});
					player.line(targets);
					targets.forEach(current => current.removeAdditionalSkill(`wuling_${player.playerid}`));
				},
			},
		},
	},
	youyi: {
		init(player) {
			player.storage.renku = true;
		},
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return _status.renku.length > 0;
		},
		prompt: "将仁区所有牌置入弃牌堆，令所有角色各回复1点体力",
		content() {
			"step 0";
			var cards = _status.renku.slice();
			game.cardsDiscard(cards).fromRenku = true;
			_status.renku.removeArray(cards);
			player.$throw(cards, 1000);
			game.updateRenku();
			game.log(cards, "从仁库进入了弃牌堆");
			"step 1";
			var targets = game.filterPlayer();
			player.line(targets);
			targets.forEach(target => target.recover());
		},
		ai: {
			order(item, player) {
				return get.order({ name: "taoyuan" }, player);
			},
			result: {
				player(player) {
					return Math.max(
						0,
						game.filterPlayer().reduce((num, target) => num + get.recoverEffect(target, player, player), 0)
					);
				},
			},
		},
		group: "youyi_put",
		subSkill: {
			put: {
				audio: "youyi",
				trigger: { player: "phaseDiscardEnd" },
				filter(event, player) {
					return lib.skill.twlijian.getCards(event).length;
				},
				prompt2(event, player) {
					return "将" + get.translation(lib.skill.twlijian.getCards(event)) + "置入仁区";
				},
				content() {
					var cards = lib.skill.twlijian.getCards(trigger);
					game.log(player, "将", cards, "置于了仁库");
					game.cardsGotoSpecial(cards, "toRenku");
				},
			},
		},
	},
	//神贾诩
	jxlianpo: {
		init: () => {
			game.addGlobalSkill("jxlianpo_global");
		},
		onremove: () => {
			if (!game.hasPlayer(i => i.hasSkill("jxlianpo", null, null, false), true)) {
				game.removeGlobalSkill("jxlianpo_global");
			}
		},
		trigger: { global: "dieAfter" },
		filter(event, player) {
			if (lib.skill.jxlianpo.getMax(event.player).length <= 1) {
				return false;
			}
			return event.source && event.source.isIn();
		},
		forced: true,
		logTarget: "source",
		getMax: dead => {
			let curs = game.players.slice(0);
			if (get.itemtype(dead) === "player" && !curs.includes(dead)) {
				curs.push(dead);
			}
			const map = {
				zhu: curs.reduce((count, current) => {
					let num = 0;
					if (["zhu", "zhong", "mingzhong"].includes(current.identity)) {
						num++;
					}
					num += current.countMark("jxlianpo_mark_zhong");
					return num + count;
				}, 0),
				fan: curs.reduce((count, current) => {
					let num = 0;
					if (current.identity == "fan") {
						num++;
					}
					num += current.countMark("jxlianpo_mark_fan");
					return num + count;
				}, 0),
				nei: curs.reduce((count, current) => {
					let num = 0;
					if (current.identity == "nei") {
						num++;
					}
					num += current.countMark("jxlianpo_mark_nei");
					return num + count;
				}, 0),
				commoner: curs.reduce((count, current) => {
					let num = 0;
					if (current.identity == "commoner") {
						num++;
					}
					num += current.countMark("jxlianpo_mark_commoner");
					return num + count;
				}, 0),
			};
			let population = 0,
				identities = [];
			for (let i in map) {
				let curPopulation = map[i];
				if (curPopulation >= population) {
					if (curPopulation > population) {
						identities = [];
					}
					identities.add(i);
					population = curPopulation;
				}
			}
			return identities;
		},
		group: "jxlianpo_show",
		*content(event, map) {
			var source = map.trigger.source;
			source.chooseDrawRecover(2, true);
		},
		mark: true,
		intro: {
			content: () =>
				`场上最大阵营为${lib.skill.jxlianpo
					.getMax()
					.map(i => {
						if (i == "zhu") {
							return "主忠";
						}
						return get.translation(i + "2");
					})
					.join("、")}`,
		},
		$createButton(item, type, position, noclick, node) {
			node = ui.create.identityCard(item, position, noclick);
			node.link = item;
			return node;
		},
		subSkill: {
			show: {
				audio: "jxlianpo",
				trigger: { global: "roundStart" },
				filter(event, player) {
					var list = lib.config.mode_config.identity.identity.lastItem.slice();
					list.removeArray(
						game.filterPlayer().map(i => {
							let identity = i.identity;
							if (identity == "mingzhong") {
								identity = "zhong";
							}
							return identity;
						})
					);
					return list.length;
				},
				forced: true,
				content() {
					"step 0";
					var list = lib.config.mode_config.identity.identity.lastItem.slice();
					list.removeArray(
						game.filterPlayer().map(i => {
							var identity = i.identity;
							return identity == "mingzhong" ? "zhong" : identity;
						})
					).unique();
					player.chooseButton(
						[
							'###炼魄：请选择一个身份###<div class="text center">你选择的身份对应的阵营角色数于本轮内视为+1</div>',
							[
								list,
								function (item, type, position, noclick, node) {
									return lib.skill.jxlianpo.$createButton(item, type, position, noclick, node);
								},
							],
						],
						true
					);
					"step 1";
					var choice = result.links[0],
						mark = `jxlianpo_mark_${choice}`;
					player
						.when({ global: "roundStart" })
						.assign({
							firstDo: true,
						})
						.filter(evt => evt != trigger)
						.then(() => {
							for (var i in player.storage) {
								if (i.startsWith("jxlianpo_mark_")) {
									player.clearMark(i);
								}
							}
						});
					player.addMark(mark, 1, false);
					event.videoId = lib.status.videoId++;
					var createDialog = function (player, identity, id) {
						var dialog = ui.create.dialog(`${get.translation(player)}展示了“${get.translation(identity + "2")}”的身份牌<br>`, "forcebutton");
						dialog.videoId = id;
						ui.create.spinningIdentityCard(identity, dialog);
					};
					game.broadcastAll(createDialog, player, choice, event.videoId);
					var color = "";
					if (choice == "zhong") {
						color = "#y";
					} else if (choice == "fan") {
						color = "#g";
					} else if (choice == "nei") {
						color = "#b";
					}
					game.log(player, "展示了", `${color}${get.translation(choice + "2")}`, "的身份牌");
					game.delay(3);
					"step 2";
					game.broadcastAll("closeDialog", event.videoId);
				},
			},
			global: {
				mod: {
					maxHandcard(player, num) {
						if (!lib.skill.jxlianpo.getMax().includes("fan")) {
							return;
						}
						return (
							num -
							game.countPlayer(current => {
								return current != player && current.hasSkill("jxlianpo");
							})
						);
					},
					cardUsable(card, player, num) {
						if (card.name == "sha") {
							if (!lib.skill.jxlianpo.getMax().includes("fan")) {
								return;
							}
							return (
								num +
								game.countPlayer(current => {
									return current.hasSkill("jxlianpo");
								})
							);
						}
					},
					attackRange(player, num) {
						if (!lib.skill.jxlianpo.getMax().includes("fan")) {
							return;
						}
						return (
							num +
							game.countPlayer(current => {
								return current.hasSkill("jxlianpo");
							})
						);
					},
					cardSavable(card, player, target) {
						if (card.name == "tao" && !player.hasSkill("jxlianpo")) {
							if (!lib.skill.jxlianpo.getMax().includes("zhu")) {
								return;
							}
							if (player == target) {
								return;
							}
							return false;
						}
					},
					playerEnabled(card, player, target) {
						if (card.name == "tao" && !player.hasSkill("jxlianpo")) {
							if (!lib.skill.jxlianpo.getMax().includes("zhu")) {
								return;
							}
							if (player == target) {
								return;
							}
							return false;
						}
					},
				},
				trigger: { player: "dieAfter" },
				filter: () => {
					return !game.hasPlayer(i => i.hasSkill("jxlianpo", null, null, false), true);
				},
				silent: true,
				forceDie: true,
				content: () => {
					game.removeGlobalSkill("jxlianpo_global");
				},
			},
		},
	},
	jxzhaoluan: {
		trigger: { global: "dieBegin" },
		filter(event, player) {
			return event.getParent().name == "dying" && event.player.isIn();
		},
		limited: true,
		skillAnimation: true,
		animationColor: "metal",
		logTarget: "player",
		check(event, player) {
			if (event.source && event.source.isIn() && get.attitude(player, event.source) > 0 && player.identity == "fan") {
				return false;
			}
			return get.attitude(player, event.player) > 3.5;
		},
		*content(event, map) {
			var player = map.player,
				trigger = map.trigger;
			var target = trigger.player;
			player.awakenSkill(event.name);
			trigger.cancel();
			const skills = target.getSkills(null, false, false).filter(skill => {
				var info = get.info(skill);
				if (info && !info.charlotte && !get.is.locked(skill)) {
					return true;
				}
			});
			if (skills.length) {
				yield target.removeSkills(skills);
			}
			yield target.gainMaxHp(3);
			var num = 3 - target.getHp(true);
			if (num > 0) {
				yield target.recover(num);
			}
			target.draw(4);
			player.addSkill("jxzhaoluan_effect");
			player.markAuto("jxzhaoluan_effect", target);
		},
		ai: {
			expose: 0.5,
			threaten: 3,
		},
		subSkill: {
			effect: {
				audio: "jxzhaoluan",
				enable: "phaseUse",
				filter(event, player) {
					return player.getStorage("jxzhaoluan_effect").some(i => i.isIn());
				},
				filterTarget(card, player, target) {
					return !player.getStorage("jxzhaoluan_hit").includes(target);
				},
				line: false,
				locked: true,
				charlotte: true,
				promptfunc() {
					var bodies = _status.event.player.getStorage("jxzhaoluan_effect").filter(i => i.isIn());
					return `选择一名角色，你令${get.translation(bodies)}${bodies.length > 1 ? "中的一人" : ""}减1点体力上限，然后你对选择的角色造成1点伤害。`;
				},
				delay: false,
				content() {
					"step 0";
					var bodies = player.getStorage("jxzhaoluan_effect").filter(i => i.isIn());
					if (bodies.length == 1) {
						event._result = { bool: true, targets: bodies };
					} else {
						player
							.chooseTarget("兆乱：请选择被减上限的傀儡", true, (card, player, target) => {
								return _status.event.targets.includes(target);
							})
							.set("targets", bodies)
							.set("ai", target => {
								return 8 - get.attitude(_status.event.player, target);
							});
					}
					"step 1";
					if (result.bool) {
						var target = result.targets[0];
						player.line(target);
						target.loseMaxHp();
						game.delayex();
					} else {
						event.finish();
					}
					"step 2";
					player.line(target);
					target.damage();
					if (!player.storage.jxzhaoluan_hit) {
						player.when("phaseUseAfter").then(() => {
							delete player.storage.jxzhaoluan_hit;
						});
					}
					player.markAuto("jxzhaoluan_hit", target);
				},
				ai: {
					order: 9,
					result: {
						player(player) {
							var bodies = player.getStorage("jxzhaoluan_effect").filter(i => i.isIn());
							var body;
							if (bodies.length == 1) {
								body = bodies[0];
							} else {
								body = bodies.sort((a, b) => get.attitude(player, a) - get.attitude(player, b))[0];
							}
							if (get.attitude(player, body) > 4 && !body.isDamaged() && body.getHp() <= 2) {
								return -10;
							}
							return 0;
						},
						target(player, target) {
							return Math.sign(get.damageEffect(target, player, target));
						},
					},
				},
			},
		},
	},
	//神典韦
	juanjia: {
		audio: 2,
		trigger: {
			global: "phaseBefore",
			player: "enterGame",
		},
		forced: true,
		filter(event, player) {
			return (event.name != "phase" || game.phaseNumber == 0) && player.hasEnabledSlot(2);
		},
		content() {
			player.disableEquip(2);
			player.expandEquip(1);
		},
	},
	qiexie: {
		audio: 2,
		trigger: { player: "phaseZhunbeiBegin" },
		forced: true,
		filter(event, player) {
			return player.countEmptySlot(1) > 0;
		},
		content() {
			"step 0";
			if (!_status.characterlist) {
				game.initCharactertList();
			}
			_status.characterlist.randomSort();
			var list = [];
			for (var name of _status.characterlist) {
				var info = lib.character[name];
				if (
					info[3].some(function (skill) {
						var info = get.plainText(get.skillInfoTranslation(skill));
						if (!info.includes("【杀】")) {
							return false;
						}
						var list = get.skillCategoriesOf(skill, player);
						list.remove("锁定技");
						return list.length == 0;
					})
				) {
					list.push(name);
					if (list.length >= 5) {
						break;
					}
				}
			}
			if (!list.length) {
				event.finish();
			} else {
				var num = player.countEmptySlot(1);
				player
					.chooseButton(
						[
							"挈挟：选择" + (num > 1 ? "至多" : "") + get.cnNumber(num) + "张武将置入武器栏",
							[
								list,
								function (item, type, position, noclick, node) {
									return lib.skill.qiexie.$createButton(item, type, position, noclick, node);
								},
							],
						],
						[1, num],
						true
					)
					.set("ai", function (button) {
						var name = button.link;
						var info = lib.character[name];
						var skills = info[3].filter(function (skill) {
							var info = get.plainText(get.skillInfoTranslation(skill));
							if (!info.includes("【杀】")) {
								return false;
							}
							var list = get.skillCategoriesOf(skill, get.player());
							list.remove("锁定技");
							return list.length == 0;
						});
						var eff = 0.2;
						for (var i of skills) {
							eff += get.skillRank(i, "in");
						}
						return eff;
					});
			}
			"step 1";
			if (result.bool) {
				var list = result.links;
				game.addVideo("skill", player, ["qiexie", [list]]);
				_status.characterlist.removeArray(list);
				game.broadcastAll(
					function (player, list) {
						player.tempname.addArray(list);
						for (var name of list) {
							lib.skill.qiexie.createCard(name);
						}
					},
					player,
					list
				);
				var cards = list.map(function (name) {
					var card = game.createCard("qiexie_" + name, "none", "none");
					return card;
				});
				player.$gain2(cards);
				game.delayx();
				// player.equip(cards);
				for (var card of cards) {
					player.equip(card);
				}
			}
		},
		$createButton(item, type, position, noclick, node) {
			node = ui.create.buttonPresets.character(item, "character", position, noclick);
			const info = lib.character[item];
			const skills = info[3].filter(function (skill) {
				var info = get.plainText(get.skillInfoTranslation(skill));
				if (!info.includes("【杀】")) {
					return false;
				}
				var list = get.skillCategoriesOf(skill, get.player());
				list.remove("锁定技");
				return list.length == 0;
			});
			if (skills.length) {
				const skillstr = skills.map(i => `[${get.translation(i)}]`).join("<br>");
				const skillnode = ui.create.caption(`<div class="text" data-nature=${get.groupnature(info[1], "raw")}m style="font-family: ${lib.config.name_font || "xinwei"},xinwei">${skillstr}</div>`, node);
				skillnode.style.left = "2px";
				skillnode.style.bottom = "2px";
			}
			node._customintro = function (uiintro, evt) {
				const character = node.link,
					characterInfo = get.character(node.link);
				let capt = get.translation(character);
				if (characterInfo) {
					const infoHp = get.infoMaxHp(characterInfo[2]);
					capt += `&nbsp;&nbsp;范围：${infoHp}`;
				}
				uiintro.add(capt);
				if (lib.characterTitle[node.link]) {
					uiintro.addText(get.colorspan(lib.characterTitle[node.link]));
				}
				for (let i = 0; i < skills.length; i++) {
					if (lib.translate[skills[i] + "_info"]) {
						let translation = lib.translate[skills[i] + "_ab"] || get.translation(skills[i]).slice(0, 2);
						if (lib.skill[skills[i]] && lib.skill[skills[i]].nobracket) {
							uiintro.add('<div><div class="skilln">' + get.translation(skills[i]) + "</div><div>" + get.skillInfoTranslation(skills[i]) + "</div></div>");
						} else {
							uiintro.add('<div><div class="skill">【' + translation + "】</div><div>" + get.skillInfoTranslation(skills[i]) + "</div></div>");
						}
						if (lib.translate[skills[i] + "_append"]) {
							uiintro._place_text = uiintro.add('<div class="text">' + lib.translate[skills[i] + "_append"] + "</div>");
						}
					}
				}
			};
			return node;
		},
		video(player, info) {
			for (var name of info[0]) {
				lib.skill.qiexie.createCard(name);
			}
		},
		createCard(name) {
			if (!_status.postReconnect.qiexie) {
				_status.postReconnect.qiexie = [
					function (list) {
						for (var name of list) {
							lib.skill.qiexie.createCard(name);
						}
					},
					[],
				];
			}
			_status.postReconnect.qiexie[1].add(name);
			if (!lib.card["qiexie_" + name]) {
				if (lib.translate[name + "_ab"]) {
					lib.translate["qiexie_" + name] = lib.translate[name + "_ab"];
				} else {
					lib.translate["qiexie_" + name] = lib.translate[name];
				}
				var info = lib.character[name];
				var card = {
					fullimage: true,
					image: "character:" + name,
					type: "equip",
					subtype: "equip1",
					enable: true,
					selectTarget: -1,
					filterCard(card, player, target) {
						if (player != target) {
							return false;
						}
						return target.canEquip(card, true);
					},
					modTarget: true,
					allowMultiple: false,
					content: lib.element.content.equipCard,
					toself: true,
					ai: {},
					skills: ["qiexie_destroy"],
				};
				var maxHp = get.infoMaxHp(info[2]);
				if (maxHp != 1) {
					card.distance = { attackFrom: 1 - maxHp };
				}
				var skills = info[3].filter(function (skill) {
					var info = get.plainText(get.skillInfoTranslation(skill));
					if (!info.includes("【杀】")) {
						return false;
					}
					var list = get.skillCategoriesOf(skill, get.player());
					list.remove("锁定技");
					return list.length == 0;
				});
				var str = "锁定技。";
				if (skills.length) {
					card.skills.addArray(skills);
					str += "你视为拥有技能";
					for (var skill of skills) {
						str += "〖" + get.translation(skill) + "〗";
						str += "、";
					}
					str = str.slice(0, str.length - 1);
					str += "；";
					card.ai.equipValue = function (card, player) {
						let val = maxHp;
						if (player.hasSkill("qiexie")) {
							val *= 0.4;
						} else {
							val *= 0.6;
						}
						return (val += skills.length);
					};
				}
				str += "此牌离开你的装备区后，改为置入剩余武将牌牌堆。";
				lib.translate["qiexie_" + name + "_info"] = str;
				var append = "";
				if (skills.length) {
					for (var skill of skills) {
						if (lib.skill[skill].nobracket) {
							append += '<div class="skilln">' + get.translation(skill) + '</div><div><span style="font-family: yuanli">' + get.plainText(get.skillInfoTranslation(skill)) + "</span></div><br><br>";
						} else {
							var translation = lib.translate[skill + "_ab"] || get.translation(skill).slice(0, 2);
							append += '<div class="skill">【' + translation + '】</div><div><span style="font-family: yuanli">' + get.plainText(get.skillInfoTranslation(skill)) + "</span></div><br><br>";
						}
					}
					str = str.slice(0, str.length - 8);
				}
				lib.translate["qiexie_" + name + "_append"] = append;
				lib.card["qiexie_" + name] = card;
			}
		},
		subSkill: {
			destroy: {
				trigger: { player: "loseBegin" },
				equipSkill: true,
				forceDie: true,
				charlotte: true,
				forced: true,
				popup: false,
				filter(event, player) {
					return event.cards.some(card => card.name.indexOf("qiexie_") == 0);
				},
				content() {
					for (var card of trigger.cards) {
						if (card.name.indexOf("qiexie_") == 0) {
							card._destroy = true;
							game.log(card, "被放回武将牌堆");
							var name = card.name.slice(7);
							if (player.tempname && player.tempname.includes(name)) {
								game.broadcastAll(
									(player, name) => {
										player.tempname.remove(name);
									},
									player,
									name
								);
							}
							if (lib.character[name]) {
								_status.characterlist.add(name);
							}
						}
					}
				},
			},
		},
	},
	cuijue: {
		audio: 2,
		enable: "phaseUse",
		filter(event, player) {
			return player.countCards("he") > 0; //&&game.hasPlayer(target=>lib.skill.cuijue.filterTarget('SB',player,target));
		},
		filterCard: true,
		filterTarget(card, player, target) {
			if (player.getStorage("cuijue_used").includes(target) || !player.inRange(target)) {
				return false;
			}
			var distance = get.distance(player, target);
			return !game.hasPlayer(current => current != target && player.inRange(current) && get.distance(player, current) > distance);
		},
		selectTarget: [0, 1],
		filterOk() {
			var player = _status.event.player;
			if (game.hasPlayer(target => lib.skill.cuijue.filterTarget("SB", player, target))) {
				return ui.selected.targets.length > 0;
			}
			return true;
		},
		position: "he",
		complexTarget: true,
		check: card => {
			var player = _status.event.player,
				goon = 0;
			try {
				ui.selected.cards.add(card);
				if (
					game.hasPlayer(target => {
						return lib.skill.cuijue.filterTarget("SB", player, target);
					})
				) {
					goon = 6;
				}
			} catch (e) {
				console.trace(e);
			}
			ui.selected.cards.remove(card);
			return goon - get.value(card);
		},
		content() {
			if (target) {
				player.addTempSkill("cuijue_used", "phaseUseAfter");
				player.markAuto("cuijue_used", [target]);
				target.damage("nocard");
			}
		},
		ai: {
			order: 2,
			result: {
				target: -1.5,
			},
			tag: {
				damage: 1,
			},
		},
		subSkill: {
			used: {
				onremove: true,
				charlotte: true,
			},
		},
	},
	//神邓艾
	dctuoyu: {
		audio: 2,
		trigger: { player: ["phaseUseBegin", "phaseUseEnd"] },
		forced: true,
		filter(event, player) {
			return player.countCards("h") > 0 && player.getStorage("dctuoyu").length > 0;
		},
		content() {
			"step 0";
			var hs = player.getCards("h"),
				tags = ["dctuoyu_fengtian", "dctuoyu_qingqu", "dctuoyu_junshan"];
			var storage = player.getStorage("dctuoyu");
			var list = [
				["未分配手牌", []],
				[get.translation(tags[0] + "_tag") + '<div class="text center">伤害/回复值+1</div>', []],
				[get.translation(tags[1] + "_tag") + '<div class="text center">无次数和距离限制</div>', []],
				[get.translation(tags[2] + "_tag") + '<div class="text center">不可被响应</div>', []],
			];
			for (var card of hs) {
				var added = false;
				for (var i = 0; i < tags.length; i++) {
					if (card.hasGaintag(tags[i] + "_tag")) {
						added = true;
						list[i + 1][1].push(card);
						break;
					}
				}
				if (!added) {
					list[0][1].push(card);
				}
			}
			for (var i = 0; i < tags.length; i++) {
				if (!storage.includes(tags[i])) {
					list[i + 1][0] = get.translation(tags[i] + "_tag") + '<div class="text center">尚未激活</div>';
				}
			}
			list = [list[0], list.slice(1)];
			var next = player.chooseToMove_new("拓域：请分配你的手牌", true);
			next.set("list", list);
			next.set("filterMove", function (from, to, moved) {
				var storage = _status.event.player.getStorage("dctuoyu"),
					tags = ["dctuoyu_fengtian", "dctuoyu_qingqu", "dctuoyu_junshan"];
				if (typeof to == "number") {
					if (to == 0) {
						return true;
					}
					return storage.includes(tags[to - 1]) && moved[to].length < 5;
				}
				return true;
			});
			next.set("processAI", function () {
				var player = _status.event.player;
				var storage = player.getStorage("dctuoyu"),
					tags = ["dctuoyu_fengtian", "dctuoyu_qingqu", "dctuoyu_junshan"];
				var moved = [[], [], [], []];
				var isEmpty = function (to) {
					return storage.includes(tags[to - 1]) && moved[to].length < 5;
				};
				var hs = player.getCards("h");
				var hs2 = hs.slice(0);
				var usable = player.getCardUsable("sha");
				var addTo = function (card, to) {
					if (isEmpty(to)) {
						hs2.remove(card);
						moved[to].push(card);
						if (get.name(card) == "sha" && to != 2) {
							usable--;
						}
					}
				};
				var hasRuanshizi = game.hasPlayer(function (target) {
					return target != player && player.canUse("sha", target, null, true) && !target.mayHaveShan(player, "use") && get.attitude(player, target) < 0 && get.effect(target, { name: "sha" }, player, player) > 0;
				});
				for (var card of hs) {
					var name = get.name(card);
					if (name == "tao" || name == "jiu") {
						addTo(card, 1);
					} else if (name == "sha") {
						if (hasRuanshizi && isEmpty(1) && usable > 0) {
							addTo(card, 1);
						} else if (isEmpty(3) && usable > 0) {
							addTo(card, 3);
						} else {
							addTo(card, 2);
						}
					} else if (get.type(name) == "trick") {
						if (isEmpty(1) && get.tag(card, "damage") > 0 && player.hasUseTarget(card)) {
							addTo(card, 1);
						} else {
							addTo(card, 3);
						}
					}
				}
				moved[0].addArray(hs2);
				return moved;
			});
			"step 1";
			if (result.bool) {
				game.broadcastAll(
					function (moved, player) {
						if (player == game.me) {
							const cards = moved.flat(1).reverse();
							game.addVideo("lose", game.me, [get.cardsInfo(cards), [], [], []]);
							for (var i = 0; i < cards.length; i++) {
								cards[i].goto(ui.special);
							}
							game.me.directgain(cards, false);
						}
						var tags = ["dctuoyu_fengtian", "dctuoyu_qingqu", "dctuoyu_junshan"];
						var map = {};
						for (var i = 0; i < moved.length; i++) {
							for (var card of moved[i]) {
								for (var j = 0; j < tags.length; j++) {
									const tag = `${tags[j]}_tag`;
									if (!map[tag]) {
										map[tag] = [[], []];
									}
									if (i == j + 1) {
										map[tag][0].add(card);
										if (!card.hasGaintag(tag)) {
											card.addGaintag(tag);
										}
									} else {
										if (card.hasGaintag(tag)) {
											map[tag][1].add(card);
											card.removeGaintag(tag);
										}
									}
								}
							}
						}
						for (const tag in map) {
							if (map[tag][0].length) {
								game.addVideo("addGaintag", player, [get.cardsInfo(map[tag][0]), tag]);
							}
							if (map[tag][1].length) {
								game.addVideo("removeGaintag", player, [tag, get.cardsInfo(map[tag][1])]);
							}
						}
						game.addVideo("delay", null, 1);
					},
					result.moved,
					player
				);
			}
		},
		intro: {
			content: "已激活的副区域：$",
		},
		group: "dctuoyu_effect",
		subSkill: {
			effect: {
				mod: {
					targetInRange(card, player, target) {
						if (get.suit(card) == "unsure") {
							return true;
						}
						if (!card.cards) {
							return;
						}
						for (var i of card.cards) {
							if (i.hasGaintag("dctuoyu_qingqu_tag")) {
								return true;
							}
						}
					},
					cardUsable(card, player, num) {
						if (get.suit(card) == "unsure") {
							return Infinity;
						}
						if (!card.cards) {
							return;
						}
						for (var i of card.cards) {
							if (i.hasGaintag("dctuoyu_qingqu_tag")) {
								return Infinity;
							}
						}
					},
				},
				audio: "dctuoyu",
				trigger: { player: "useCard" },
				forced: true,
				filter(event, player) {
					var tags = ["dctuoyu_fengtian_tag", "dctuoyu_qingqu_tag", "dctuoyu_junshan_tag"],
						card = event.card;
					return player.hasHistory("lose", function (evt) {
						if (evt.getParent() != event) {
							return false;
						}
						for (var i in evt.gaintag_map) {
							for (var tag of evt.gaintag_map[i]) {
								if (tags.includes(tag)) {
									return true;
								}
							}
						}
						return false;
					});
				},
				content() {
					var tags = ["dctuoyu_fengtian_tag", "dctuoyu_qingqu_tag", "dctuoyu_junshan_tag"],
						card = trigger.card;
					player.hasHistory("lose", function (evt) {
						if (evt.getParent() != trigger) {
							return false;
						}
						for (var i in evt.gaintag_map) {
							tags.removeArray(evt.gaintag_map[i]);
						}
						return tags.length == 0;
					});
					if (!tags.includes("dctuoyu_fengtian_tag")) {
						if (get.tag(card, "damage") > 0 || get.tag(card, "recover") > 0) {
							trigger.baseDamage++;
							game.log(card, "的伤害值/回复值+1");
						}
					}
					if (!tags.includes("dctuoyu_qingqu_tag")) {
						if (trigger.addCount !== false) {
							trigger.addCount = false;
							var stat = player.getStat("card");
							if (stat[card.name] && stat[card.name] > 0) {
								stat[card.name]--;
							}
							game.log(card, "不计入次数限制");
						}
					}
					if (!tags.includes("dctuoyu_junshan_tag")) {
						game.log(card, "不可被响应");
						trigger.directHit.addArray(game.filterPlayer());
					}
				},
			},
		},
		ai: {
			combo: "dcxianjin",
		},
	},
	dcxianjin: {
		init(player) {
			var num = game
				.getAllGlobalHistory("changeHp", evt => {
					return evt.getParent().name == "damage" && (evt.getParent().player == player || (evt.getParent().source && evt.getParent().source == player));
				})
				.concat(
					game.getAllGlobalHistory("changeHp", evt => {
						return evt.getParent().name == "damage" && evt.getParent().player == player && evt.getParent().source && evt.getParent().source == player;
					})
				).length;
			if (num) {
				player.addMark("dcxianjin", num, false);
			}
		},
		onremove: true,
		audio: 2,
		trigger: {
			player: "damageEnd",
			source: "damageSource",
		},
		filter(event, player) {
			return player.countMark("dcxianjin") % 2 == 0;
		},
		forced: true,
		content() {
			"step 0";
			var tags = ["dctuoyu_fengtian", "dctuoyu_qingqu", "dctuoyu_junshan"];
			tags.removeArray(player.getStorage("dctuoyu"));
			if (!tags.length) {
				player.draw(player.isMaxHandcard() ? 1 : 3);
				event.finish();
			} else if (tags.length == 1) {
				event._result = { control: tags[0] };
			} else {
				player.chooseControl(tags).set("prompt", "险峻：选择激活一个副区域标签");
			}
			"step 1";
			var control = result.control;
			game.log(player, "激活了副区域", "#y" + get.translation(control));
			player.markAuto("dctuoyu", [control]);
			player.popup(get.translation(control + "_tag"));
			if (player.isMaxHandcard()) {
				player.draw();
			} else {
				player.draw(player.getStorage("dctuoyu").length);
			}
		},
		group: "dcxianjin_mark",
		intro: { content: "已造成或受到#次伤害" },
		subSkill: {
			mark: {
				charlotte: true,
				trigger: {
					player: "damageEnd",
					source: "damageSource",
				},
				forced: true,
				popup: false,
				firstDo: true,
				content() {
					player.addMark("dcxianjin", 1, false);
				},
			},
		},
		ai: {
			effect: {
				player(card, player, target) {
					if (!get.tag(card, "damage") || player.countMark("dcxianjin") % 2 || player.hasSkillTag("jueqing", false, target)) {
						return;
					}
					if (player.isMaxHandcard()) {
						return [1, 1];
					}
					return [1, Math.min(3, 1 + player.getStorage("dctuoyu").length)];
				},
			},
		},
	},
	dcqijing: {
		derivation: "dccuixin",
		audio: 2,
		trigger: { global: "phaseEnd" },
		filter(event, player) {
			return player.getStorage("dctuoyu").length == 3;
		},
		forced: true,
		juexingji: true,
		skillAnimation: true,
		animationColor: "orange",
		seatRelated: "changeSeat",
		content() {
			"step 0";
			player.awakenSkill(event.name);
			player.loseMaxHp();
			player.addSkills("dccuixin");
			"step 1";
			if (game.countPlayer() > 2) {
				if (player == trigger.player && !trigger.skill) {
					var evt = trigger.getParent();
					if (evt.name == "phaseLoop" && evt._isStandardLoop) {
						evt.player = player.previous;
						_status.lastPhasedPlayer = player.next;
					}
				}
				player
					.chooseTarget(
						"请选择一名要更换座次的角色，将自己移动到该角色的上家位置",
						function (card, player, target) {
							return target != player && target != player.next;
						},
						true
					)
					.set("ai", function (target) {
						var player = _status.event.player;
						var current = _status.currentPhase?.next;
						var max = 20,
							att = 0;
						while (max > 0) {
							max--;
							if (current == target) {
								return att;
							}
							att -= get.attitude(player, current);
							current = current.next;
						}
						return att;
					});
			} else {
				event.finish();
			}
			"step 2";
			if (result.bool) {
				var target = result.targets[0];
				game.broadcastAll(
					function (target1, target2) {
						game.swapSeat(target1, target2, null, true);
					},
					player,
					target
				);
			} else {
				event.finish();
			}
			"step 3";
			player.insertPhase();
		},
		ai: {
			combo: "dctuoyu",
		},
	},
	dccuixin: {
		audio: 2,
		trigger: { player: "useCardAfter" },
		filter(event, player) {
			if (!event._dccuixin || get.type(event.card, null, false) == "delay" || get.type(event.card, null, false) == "equip") {
				return false;
			}
			var card = {
					name: event.card.name,
					nature: event.card.nature,
					isCard: true,
				},
				list = event._dccuixin;
			for (var target of list) {
				var targetx = player[target]();
				if (lib.filter.targetEnabled2(card, targetx, player)) {
					return true;
				}
			}
			return false;
		},
		direct: true,
		content() {
			"step 0";
			var card = {
				name: trigger.card.name,
				nature: trigger.card.nature,
				isCard: true,
			};
			event.card = card;
			var list = [];
			trigger._dccuixin.forEach(target => {
				var targetx = player[target]();
				if (lib.filter.targetEnabled2(card, targetx, player)) {
					list.add(targetx);
				}
			});
			if (list.length == 1) {
				event.target = list[0];
				player
					.chooseBool("摧心：是否视为对" + get.translation(list[0]) + "使用" + get.translation(card) + "？")
					.set("goon", get.effect(list[0], card, player, player) > 0)
					.set("ai", () => _status.event.goon);
			} else {
				player
					.chooseTarget("摧心：是否视为对上家或下家使用" + get.translation(card) + "？", "操作提示：从上家或下家中选择一名角色作为使用目标", function (card, player, target) {
						return (target == player.getNext() || target == player.getPrevious()) && lib.filter.targetEnabled2(_status.event.getParent().card, target, player);
					})
					.set("ai", function (target) {
						var player = _status.event.player;
						return get.effect(target, _status.event.getParent().card, player, player);
					});
			}
			"step 1";
			if (result.bool) {
				var target = event.target || result.targets[0];
				player.useCard(card, target, false, "dccuixin");
			}
		},
		group: "dccuixin_silent",
		subSkill: {
			silent: {
				trigger: { player: "useCardToPlayered" },
				silent: true,
				forced: true,
				popup: false,
				firstDo: true,
				charlotte: true,
				filter(event, player) {
					if (!event.isFirstTarget || event.getParent().skill == "dccuixin") {
						return false;
					}
					if (event.targets.length == 0) {
						return false;
					}
					return event.targets.includes(player.getNext()) || event.targets.includes(player.getPrevious());
				},
				content() {
					var list = [];
					if (trigger.targets.includes(player.getNext())) {
						list.push("getPrevious");
					}
					if (trigger.targets.includes(player.getPrevious())) {
						list.push("getNext");
					}
					trigger.getParent()._dccuixin = list;
				},
			},
		},
	},
	//海外神吕蒙
	twshelie: {
		audio: "shelie",
		inherit: "shelie",
		prompt2: () => lib.translate.shelie_info,
		group: "twshelie_jingce",
		//什么精策技能啊喂！
		subSkill: {
			round: { charlotte: true },
			count: {
				charlotte: true,
				onremove: true,
				intro: {
					markcount(storage) {
						return storage.length;
					},
					content: "本回合已使用$花色的牌",
				},
			},
			jingce: {
				audio: "shelie",
				trigger: { player: ["phaseJieshuBegin", "useCard1"] },
				filter(event, player) {
					if (player.hasSkill("twshelie_round") || player != _status.currentPhase) {
						return false;
					}
					var list = [];
					player.getHistory("useCard", function (evt) {
						if (lib.suit.includes(get.suit(evt.card)) && !list.includes(get.suit(evt.card))) {
							list.push(get.suit(evt.card));
						}
					});
					if (list.length) {
						player.addTempSkill("twshelie_count");
						player.storage.twshelie_count = list.sort(function (a, b) {
							return lib.suit.indexOf(b) - lib.suit.indexOf(a);
						});
						player.markSkill("twshelie_count");
						player.syncStorage("twshelie_count");
					}
					return event.name != "useCard" && list.length >= 4;
				},
				forced: true,
				locked: false,
				content() {
					"step 0";
					player.addTempSkill("twshelie_round", "roundStart");
					if (typeof player.storage.twshelie == "number") {
						event._result = { index: player.storage.twshelie };
					} else {
						player.chooseControl("摸牌阶段", "出牌阶段").set("prompt", "涉猎：请选择要执行的额外阶段");
					}
					"step 1";
					player.storage.twshelie = 1 - result.index;
					const evt = trigger.getParent("phase", true, true);
					if (result.index == 0) {
						if (evt?.phaseList) {
							evt.phaseList.splice(evt.num + 1, 0, "phaseDraw|twshelie");
						}
					}
					if (result.index == 1) {
						if (evt?.phaseList) {
							evt.phaseList.splice(evt.num + 1, 0, "phaseUse|twshelie");
						}
					}
				},
			},
		},
	},
	twgongxin: {
		audio: "gongxin",
		enable: "phaseUse",
		filter(event, player) {
			return game.hasPlayer(function (current) {
				return current != player && current.countCards("h");
			});
		},
		filterTarget(card, player, target) {
			return target != player && target.countCards("h") > 0;
		},
		usable: 1,
		content() {
			"step 0";
			event.num = target.getCards("h").reduce(function (arr, card) {
				return arr.add(get.suit(card, player)), arr;
			}, []).length;
			"step 1";
			var cards = target.getCards("h");
			var next = player.chooseToMove_new("攻心");
			next.set("list", [
				[get.translation(target) + "的手牌", cards],
				[["弃置"], ["置于牌堆顶"]],
			]);
			next.set("filterOk", moved => {
				return moved[1].slice().concat(moved[2]).length == 1;
			});
			next.set("processAI", list => {
				let card = list[0][1].slice().sort((a, b) => {
					return get.value(b) - get.value(a);
				})[0];
				if (!card) {
					return false;
				}
				return [list[0][1].slice().remove(card), [card], []];
			});
			"step 2";
			if (result.bool) {
				if (result.moved[1].length) {
					target.discard(result.moved[1]);
				} else {
					player.showCards(result.moved[2], get.translation(player) + "对" + get.translation(target) + "发动了【攻心】");
					target.lose(result.moved[2], ui.cardPile, "visible", "insert");
				}
			} else {
				event.finish();
			}
			"step 3";
			if (
				event.num >
				target.getCards("h").reduce(function (arr, card) {
					return arr.add(get.suit(card, target)), arr;
				}, []).length
			) {
				player.line(target);
				player.addTempSkill("twgongxin3", { player: ["twgongxin3After", "phaseAfter"] });
				player.markAuto("twgongxin3", [target]);
			}
		},
		ai: {
			order: 10,
			expose: 0.25,
			result: {
				target(player, target) {
					return -target.countCards("h");
				},
			},
		},
	},
	twgongxin2: {
		mod: {
			cardEnabled2(card, player) {
				const color = get.color(card);
				if (color != "unsure" && player.getStorage("twgongxin2").includes(color)) {
					return false;
				}
			},
		},
		charlotte: true,
		onremove: true,
		intro: { content: "本回合内不能使用或打出$牌" },
	},
	twgongxin3: {
		charlotte: true,
		onremove: true,
		intro: { content: "$不可响应你本回合使用的下一张牌" },
		trigger: { player: "useCard" },
		forced: true,
		popup: false,
		sourceSkill: "twgongxin",
		content() {
			"step 0";
			game.delayx();
			"step 1";
			var targets = player.getStorage("twgongxin3");
			player.line(targets, "fire");
			trigger.directHit.addArray(targets);
		},
	},
	//神张角
	yizhao: {
		audio: 2,
		trigger: {
			player: ["useCard", "respond"],
		},
		forced: true,
		filter(event, player) {
			const number = get.number(event.card);
			return typeof number == "number" && number > 0;
		},
		marktext: "黄",
		intro: {
			name: "黄(异兆/肆军)",
			name2: "黄",
			content: "mark",
			markcount(storage, player) {
				return (storage || 0).toString().slice(-2);
			},
		},
		content() {
			"step 0";
			event.num = player.countMark("yizhao");
			player.addMark("yizhao", get.number(trigger.card));
			"step 1";
			var num = Math.floor(num / 10) % 10,
				num2 = Math.floor(player.countMark("yizhao") / 10) % 10;
			if (num != num2) {
				var card = get.cardPile2(card => {
					return get.number(card, false) == num2;
				});
				if (card) {
					player.gain(card, "gain2");
				}
			}
		},
		mod: {
			aiOrder(player, card, num) {
				if (Math.floor((get.number(card) + (player.countMark("yizhao") % 10)) / 10) == 1) {
					return num + 10;
				}
			},
		},
		ai: {
			threaten: 1.5,
			effect: {
				target_use(card, player, target, current) {
					if (get.type(card) == "equip" && !get.cardtag(card, "gifts")) {
						return [1, 0.1];
					}
				},
			},
		},
	},
	sijun: {
		audio: 2,
		trigger: { player: "phaseZhunbeiBegin" },
		filter(event, player) {
			return player.countMark("yizhao") > ui.cardPile.childNodes.length;
		},
		check(event, player) {
			return ui.cardPile.childNodes.length;
		},
		content() {
			"step 0";
			player.removeMark("yizhao", player.countMark("yizhao"));
			game.washCard();
			"step 1";
			var pile = Array.from(ui.cardPile.childNodes);
			if (pile.length < 3) {
				return;
			}
			var bool = false,
				max = Math.pow(2, Math.min(100, pile.length)),
				index;
			for (var i = 0; i < max; i++) {
				var num = 0;
				index = i.toString(2);
				while (index.length < pile.length) {
					index = "0" + index;
				}
				for (var k = 0; k < index.length; k++) {
					if (index[k] == "1") {
						num += get.number(pile[k]);
					}
					if (num > 36) {
						break;
					}
				}
				if (num == 36) {
					bool = true;
					break;
				}
			}
			if (bool) {
				var cards = [];
				for (var k = 0; k < index.length; k++) {
					if (index[k] == "1") {
						cards.push(pile[k]);
					}
				}
				player.gain(cards, "gain2");
			}
		},
		ai: {
			combo: "yizhao",
		},
	},
	sanshou: {
		audio: 2,
		trigger: { player: "damageBegin4" },
		check(event, player) {
			return get.damageEffect(player, event.source, player, event.nature) <= 0;
		},
		content() {
			"step 0";
			var cards = game.cardsGotoOrdering(get.cards(3)).cards;
			event.cards = cards;
			player.showCards(cards, get.translation(player) + "发动了【三首】");
			"step 1";
			var types = [];
			types.addArray(game.getGlobalHistory("useCard").map(evt => get.type2(evt.card)));
			if (cards.filter(card => !types.includes(get.type2(card))).length) {
				trigger.cancel();
			}
			game.delayx();
		},
		ai: {
			effect: {
				target(card, player, target) {
					if (card.name == "shandian" || card.name == "fulei") {
						return [0, 0.1];
					}
					if (!get.tag(card, "damage")) {
						return;
					}
					var types = [],
						bool = 0;
					types.addArray(game.getGlobalHistory("useCard").map(evt => get.type2(evt.card)));
					if (!types.includes(get.type2(card))) {
						bool = 1;
					}
					if (types.length < 2) {
						return Math.min(1, 0.4 + (types.length + bool) * 0.2);
					}
				},
			},
		},
	},
	tianjie: {
		audio: 3,
		trigger: { global: "phaseEnd" },
		direct: true,
		filter(event, player) {
			return game.hasGlobalHistory("cardMove", evt => evt.washCard) && game.hasPlayer(current => current != player);
		},
		skillAnimation: true,
		animationColor: "metal",
		content() {
			"step 0";
			player.chooseTarget(get.prompt("tianjie"), "选择至多三名其他角色，依次对这些角色造成X点雷电伤害（X为其手牌中【闪】的数量，至少为1）", [1, 3], lib.filter.notMe).set("ai", target => {
				var player = _status.event.player;
				return get.damageEffect(target, player, player, "thunder") * Math.sqrt(Math.max(1, target.countCards("h", "shan")));
			});
			"step 1";
			if (result.bool) {
				var targets = result.targets;
				targets.sortBySeat();
				player.logSkill("tianjie", targets);
				for (var target of targets) {
					var num = Math.max(1, target.countCards("h", "shan"));
					target.damage(num, "thunder");
				}
			}
		},
	},
	shencai: {
		audio: 2,
		enable: "phaseUse",
		usable(skill, player) {
			return 1 + player.countMark("shencai");
		},
		filterTarget: lib.filter.notMe,
		onremove: true,
		prompt: "选择一名其他角色进行地狱审判",
		content() {
			var next = target.judge();
			next.callback = lib.skill.shencai.contentx;
		},
		ai: {
			order: 8,
			result: { target: -1 },
		},
		contentx() {
			var card = event.judgeResult.card;
			var player = event.getParent(2).player;
			var target = event.getParent(2).target;
			if (get.position(card, true) == "o") {
				player.gain(card, "gain2");
			}
			var list = [],
				str = get.cardDescription(card, player);
			for (var i in lib.skill.shencai.filterx) {
				if (str.indexOf(lib.skill.shencai.filterx[i]) != -1) {
					list.push("shencai_" + i);
				}
			}
			if (list.length) {
				for (var i in lib.skill.shencai.filterx) {
					var num = target.countMark("shencai_" + i);
					if (num > 0) {
						target.removeMark("shencai_" + i, num);
						target.removeSkill("shencai_" + i);
					}
				}
				if (target.isIn()) {
					for (var i of list) {
						target.addSkill(i);
						target.addMark(i, 1);
					}
				}
			} else if (target.isIn()) {
				player.gainPlayerCard(target, true, "hej");
				target.addMark("shencai_death", 1);
				target.addSkill("shencai_death");
			}
		},
		filterx: {
			losehp: "体力",
			weapon: "武器",
			respond: "打出",
			distance: "距离",
		},
		getStr(node) {
			var str = "",
				name = node.name;
			if (lib.translate[name + "_info"]) {
				if (lib.card[name].type && lib.translate[lib.card[name].type]) {
					str += "" + get.translation(lib.card[name].type) + "牌|";
				}
				if (get.subtype(name)) {
					str += "" + get.translation(get.subtype(name)) + "|";
				}
				if (lib.card[name] && lib.card[name].addinfomenu) {
					str += "" + lib.card[name].addinfomenu + "|";
				}
				if (get.subtype(name) == "equip1") {
					var added = false;
					if (lib.card[node.name] && lib.card[node.name].distance) {
						var dist = lib.card[node.name].distance;
						if (dist.attackFrom) {
							added = true;
							str += "攻击范围：" + (-dist.attackFrom + 1) + "|";
						}
					}
					if (!added) {
						str += "攻击范围：1|";
					}
				}
			}
			if (lib.card[name].cardPrompt) {
				str += "" + lib.card[name].cardPrompt(node) + "|";
			} else if (lib.translate[name + "_info"]) {
				str += "" + lib.translate[name + "_info"] + "|";
			}
			if (lib.translate[name + "_append"]) {
				str += "" + lib.translate[name + "_append"] + "|";
			}
			if (get.is.yingbianConditional(node)) {
				const yingbianEffects = get.yingbianEffects(node);
				if (!yingbianEffects.length) {
					const defaultYingbianEffect = get.defaultYingbianEffect(node);
					if (lib.yingbian.prompt.has(defaultYingbianEffect)) {
						yingbianEffects.push(defaultYingbianEffect);
					}
				}
				if (yingbianEffects.length) {
					str += `应变：${yingbianEffects.map(value => lib.yingbian.prompt.get(value)).join("；")}|`;
				}
			}
			return str;
		},
		subSkill: {
			losehp: {
				charlotte: true,
				marktext: "笞",
				trigger: { player: "damageEnd" },
				forced: true,
				content() {
					player.loseHp(trigger.num);
				},
				ai: {
					effect: {
						target(card, player, target, current) {
							if (get.tag(card, "damage") && current < 0 && !target._shencai_losehp_effect) {
								target._shencai_losehp_effect = true;
								let eff = get.effect(target, { name: "losehp" }, target, target) / 10;
								delete target._shencai_losehp_effect;
								return [1, eff];
							}
						},
					},
				},
				intro: {
					name: "神裁 - 体力",
					name2: "笞",
					content: "锁定技。当你受到伤害后，你失去等量的体力。",
					onunmark: true,
				},
			},
			weapon: {
				charlotte: true,
				marktext: "杖",
				trigger: { target: "useCardToTargeted" },
				forced: true,
				filter(event, player) {
					return event.card.name == "sha";
				},
				content() {
					trigger.directHit.add(player);
					game.log(player, "不可响应", trigger.card);
				},
				intro: {
					name: "神裁 - 武器",
					name2: "杖",
					content: "锁定技。当你成为【杀】的目标后，你不能使用牌响应此【杀】。",
					onunmark: true,
				},
				global: "shencai_weapon_ai",
			},
			ai: {
				ai: {
					directHit_ai: true,
					skillTagFilter(player, tag, arg) {
						if (!arg || !arg.card || arg.card.name != "sha") {
							return false;
						}
						if (!arg.target || !arg.target.hasSkill("shencai_weapon")) {
							return false;
						}
						return true;
					},
				},
			},
			respond: {
				charlotte: true,
				marktext: "徒",
				trigger: {
					player: "loseAfter",
					global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"],
				},
				forced: true,
				filter(event, player) {
					if (
						!player.hasCard(function (card) {
							return lib.filter.cardDiscardable(card, player, "shencai_respond");
						}, "h")
					) {
						return false;
					}
					var evt = event.getParent("shencai_respond");
					if (evt && evt.player == player) {
						return false;
					}
					evt = event.getl(player);
					return evt && evt.hs && evt.hs.length > 0;
				},
				content() {
					var cards = player.getCards("h", function (card) {
						return lib.filter.cardDiscardable(card, player, "shencai_respond");
					});
					if (cards.length > 0) {
						player.discard(cards.randomGet());
					}
				},
				intro: {
					name: "神裁 - 打出",
					name2: "徒",
					content: "锁定技。当你失去手牌后，你随机弃置一张手牌（不嵌套触发）。",
					onunmark: true,
				},
			},
			distance: {
				charlotte: true,
				marktext: "流",
				trigger: { player: "phaseJieshuBegin" },
				forced: true,
				content() {
					player.turnOver();
				},
				intro: {
					name: "神裁 - 距离",
					name2: "流",
					content: "锁定技。结束阶段开始时，你翻面。",
					onunmark: true,
				},
			},
			death: {
				charlotte: true,
				marktext: "死",
				mod: {
					maxHandcard(player, num) {
						return num - player.countMark("shencai_death");
					},
				},
				trigger: { player: "phaseEnd" },
				forced: true,
				filter(event, player) {
					return player.countMark("shencai_death") > game.countPlayer();
				},
				content() {
					player.die();
				},
				intro: {
					name: "神裁 - 死",
					name2: "死",
					content: "锁定技。你的角色手牌上限-#；回合结束时，若场上存活人数小于#，则你死亡。",
					onunmark: true,
				},
			},
		},
		mark: true,
		intro: {
			markcount: (storage = 0) => storage + 1,
			content: (storage = 0) => "当前最大发动次数：" + (storage + 1),
		},
	},
	xunshi: {
		audio: 2,
		mod: {
			cardname(card) {
				if (lib.skill.xunshi.isXunshi(card)) {
					return "sha";
				}
			},
			cardnature(card) {
				if (lib.skill.xunshi.isXunshi(card)) {
					return false;
				}
			},
			suit(card) {
				if (lib.skill.xunshi.isXunshi(card)) {
					return "none";
				}
			},
			targetInRange(card) {
				const suit = get.color(card);
				if (suit == "none" || suit == "unsure") {
					return true;
				}
			},
			cardUsable(card) {
				const suit = get.color(card);
				if (suit == "none" || suit == "unsure") {
					return Infinity;
				}
			},
		},
		isXunshi(card) {
			var info = lib.card[card.name];
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
		trigger: { player: "useCard2" },
		forced: true,
		filter(event, player) {
			return get.color(event.card) == "none";
		},
		content() {
			"step 0";
			if (player.countMark("shencai") < 4 && player.hasSkill("shencai", null, null, false)) {
				player.addMark("shencai", 1, false);
			}
			if (trigger.addCount !== false) {
				trigger.addCount = false;
				var stat = player.getStat().card,
					name = trigger.card.name;
				if (typeof stat[name] == "number") {
					stat[name]--;
				}
			}
			var info = get.info(trigger.card);
			if (info.allowMultiple == false) {
				event.finish();
			} else if (trigger.targets && !info.multitarget) {
				if (
					!game.hasPlayer(function (current) {
						return !trigger.targets.includes(current) && lib.filter.targetEnabled2(trigger.card, player, current);
					})
				) {
					event.finish();
				}
			} else {
				event.finish();
			}
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
				if (!event.isMine() && !event.isOnline()) {
					game.delayx();
				}
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
	},
	twwushen: {
		mod: {
			cardname(card, player, name) {
				if (get.suit(card) == "heart") {
					return "sha";
				}
			},
			cardnature(card, player) {
				if (get.suit(card) == "heart") {
					return false;
				}
			},
			targetInRange(card) {
				if (card.name === "sha") {
					const suit = get.suit(card);
					if (suit === "heart" || suit === "unsure") {
						return true;
					}
				}
			},
			cardUsable(card) {
				if (card.name === "sha") {
					const suit = get.suit(card);
					if (suit === "heart" || suit === "unsure") {
						return Infinity;
					}
				}
			},
		},
		audio: "wushen",
		trigger: { player: "useCard2" },
		forced: true,
		filter(event, player) {
			return event.card.name == "sha" && (get.suit(event.card) == "heart" || !player.hasSkill("twwushen_phase", null, null, false));
		},
		logTarget(event, player) {
			if (get.suit(event.card) == "heart") {
				var targets = game.filterPlayer(function (current) {
					return !event.targets.includes(current) && current.hasMark("twwuhun") && lib.filter.targetEnabled(event.card, player, current);
				});
				if (targets.length) {
					return targets.sortBySeat();
				}
			}
			return null;
		},
		content() {
			if (!player.hasSkill("twwushen_phase", null, null, false)) {
				trigger.directHit.addArray(game.players);
				player.addTempSkill("twwushen_phase", ["phaseZhunbeiAfter", "phaseJudgeAfter", "phaseDrawAfter", "phaseUseAfter", "phaseDiscardAfter", "phaseJieshuAfter"]);
			}
			if (get.suit(trigger.card) == "heart") {
				if (trigger.addCount !== false) {
					trigger.addCount = false;
					if (player.stat[player.stat.length - 1].card.sha > 0) {
						player.stat[player.stat.length - 1].card.sha--;
					}
				}
				var targets = game.filterPlayer(function (current) {
					return !trigger.targets.includes(current) && current.hasMark("twwuhun") && lib.filter.targetEnabled(trigger.card, player, current);
				});
				if (targets.length) {
					trigger.targets.addArray(targets.sortBySeat());
					game.log(targets, "也成为了", trigger.card, "的目标");
				}
			}
		},
		ai: {
			directHit_ai: true,
			skillTagFilter(player, tag, arg) {
				return arg.card.name == "sha" && !player.hasSkill("twwushen_phase", null, null, false);
			},
		},
		subSkill: { phase: { charlotte: true } },
	},
	twwuhun: {
		audio: 2,
		trigger: { player: "die" },
		forceDie: true,
		skillAnimation: true,
		animationColor: "soil",
		locked: true,
		check(event, player) {
			return game.hasPlayer(function (current) {
				return current != player && current.hasMark("twwuhun") && get.attitude(player, current) < 0;
			});
		},
		content() {
			"step 0";
			player
				.judge(function (card) {
					var name = get.name(card, false);
					if (name == "tao" || name == "taoyuan") {
						return -25;
					}
					return 15;
				})
				.set("forceDie", true).judge2 = function (result) {
				return result.bool;
			};
			"step 1";
			var num = game.countPlayer(function (current) {
				return current != player && current.hasMark("twwuhun");
			});
			if (result.bool && num > 0) {
				player
					.chooseTarget("请选择【武魂】的目标", "选择至少一名拥有“梦魇”标记的角色。令这些角色各自失去X点体力（X为其“梦魇”标记数）", true, [1, num], function (card, player, target) {
						return target != player && target.hasMark("twwuhun");
					})
					.set("forceDie", true)
					.set("ai", function (target) {
						return -get.attitude(_status.event.player, target);
					});
			} else {
				event.finish();
			}
			"step 2";
			var targets = result.targets.sortBySeat();
			player.line(targets, "fire");
			event.targets = targets;
			"step 3";
			var target = targets.shift();
			var num = target.countMark("twwuhun");
			if (num > 0) {
				target.loseHp(num);
			}
			if (targets.length > 0) {
				event.redo();
			}
		},
		marktext: "魇",
		intro: {
			name: "梦魇",
			content: "mark",
			onunmark: true,
		},
		group: "twwuhun_gain",
		subSkill: {
			gain: {
				audio: "twwuhun",
				trigger: {
					player: "damageEnd",
					source: "damageSource",
				},
				forced: true,
				filter(event, player, name) {
					if (event.player == event.source) {
						return false;
					}
					var target = lib.skill.twwuhun_gain.logTarget(event, player);
					if (!target || !target.isIn()) {
						return false;
					}
					return name == "damageEnd" || target.hasMark("twwuhun");
				},
				logTarget(event, player) {
					if (player == event.player) {
						return event.source;
					}
					return event.player;
				},
				content() {
					var target = lib.skill.twwuhun_gain.logTarget(trigger, player);
					target.addMark("twwuhun", player == trigger.source ? 1 : trigger.num);
					game.delayx();
				},
			},
		},
		ai: {
			notemp: true,
			maixie_defend: true,
			effect: {
				target: (card, player, target) => {
					if (!get.tag(card, "damage") || !target.hasFriend()) {
						return;
					}
					let die = [],
						extra = [null, 0],
						temp;
					game.filterPlayer(i => {
						if (!i.hasMark("twwuhun")) {
							return false;
						}
						temp = get.attitude(target, i);
						if (temp < 0) {
							die.push(i);
						} else {
							temp = Math.sqrt(temp) * i.countMark("twwuhun");
							if (!extra[0] || temp < extra[1]) {
								extra = [i, temp];
							}
						}
					});
					if (extra[0] && !die.length) {
						die.push(extra[0]);
					}
					if (target.hp + target.hujia > 1 && (!die.length || get.attitude(player, target) <= 0)) {
						die.add(player);
					}
					if (die.length) {
						return [
							1,
							0,
							1,
							die.reduce((num, i) => {
								return (num -= 2 * get.sgnAttitude(player, i));
							}, 0),
						];
					}
				},
			},
		},
	},
	shouli: {
		audio: 2,
		mod: {
			cardUsable(card) {
				if (card.storage?.shouli) {
					return Infinity;
				}
			},
		},
		enable: ["chooseToUse", "chooseToRespond"],
		hiddenCard(player, name) {
			if (player != _status.currentPhase && (name == "sha" || name == "shan")) {
				return true;
			}
		},
		filter(event, player) {
			if (event.responded || event.shouli || event.type == "wuxie") {
				return false;
			}
			if (
				game.hasPlayer(function (current) {
					return current.getCards("e", card => get.is.attackingMount(card)).length > 0;
				}) &&
				event.filterCard(
					get.autoViewAs(
						{
							name: "sha",
							storage: { shouli: true },
						},
						"unsure"
					),
					player,
					event
				)
			) {
				return true;
			}
			if (
				game.hasPlayer(function (current) {
					return current.getCards("e", card => get.is.defendingMount(card)).length > 0;
				}) &&
				event.filterCard(
					get.autoViewAs(
						{
							name: "shan",
							storage: { shouli: true },
						},
						"unsure"
					),
					player,
					event
				)
			) {
				return true;
			}
			return false;
		},
		delay: false,
		locked: false,
		filterTarget(card, player, target) {
			var event = _status.event,
				evt = event;
			if (event._backup) {
				evt = event._backup;
			}
			var equip3 = target.getCards("e", card => get.is.defendingMount(card, false));
			var equip4 = target.getCards("e", card => get.is.attackingMount(card, false));
			if (
				equip3.length &&
				equip3.some(card =>
					evt.filterCard(
						get.autoViewAs(
							{
								name: "shan",
								storage: { shouli: true },
							},
							[card]
						),
						player,
						event
					)
				)
			) {
				return true;
			}
			return equip4.some(card => {
				var sha = get.autoViewAs(
					{
						name: "sha",
						storage: { shouli: true },
					},
					[card]
				);
				if (evt.filterCard(sha, player, event)) {
					if (!evt.filterTarget) {
						return true;
					}
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
			evt.set("shouli", true);
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
								storage: { shouli: true },
							},
							[card]
						);
						if (evt.filterCard(shan, player, event)) {
							return true;
						}
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
								storage: { shouli: true },
							},
							[card]
						);
						if (
							evt.filterCard(sha, player, evt) &&
							(!evt.filterTarget ||
								game.hasPlayer(function (current) {
									return evt.filterTarget(sha, player, current);
								}))
						) {
							return true;
						}
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
				if (cards.length == 1) {
					event._result = {
						bool: true,
						links: [cards[0]],
					};
				} else {
					player
						.choosePlayerCard(true, target, "e")
						.set("filterButton", function (button) {
							return _status.event.cards.includes(button.link);
						})
						.set("cards", cards);
				}
			} else {
				player.choosePlayerCard(true, target, "e").set("filterButton", function (button) {
					var card = button.link;
					return get.is.attackingMount(card) || get.is.defendingMount(card);
				});
			}
			"step 1";
			var evt = event.getParent(2);
			if (result.bool && result.links && result.links.length) {
				var name = event.cardName || (get.is.attackingMount(result.links[0]) ? "sha" : "shan");
				if (evt.name == "chooseToUse") {
					game.broadcastAll(
						function (result, name) {
							lib.skill.shouli_backup.viewAs = {
								name: name,
								cards: [result],
								storage: { shouli: true },
							};
							lib.skill.shouli_backup.prompt = "选择" + get.translation(name) + "（" + get.translation(result) + "）的目标";
						},
						result.links[0],
						name
					);
					evt.set("_backupevent", "shouli_backup");
					evt.backup("shouli_backup");
					evt.set("openskilldialog", "选择" + get.translation(name) + "（" + get.translation(result.links[0]) + "）的目标");
					evt.set("norestore", true);
					evt.set("custom", {
						add: {},
						replace: { window() {} },
					});
				} else {
					delete evt.result.used;
					evt.result.card = get.autoViewAs(
						{
							name: name,
							cards: [result.links[0]],
							storage: { shouli: true },
						},
						result.links
					);
					evt.result.cards = [result.links[0]];
					target.$give(result.links[0], player, false);
					if (player != target) {
						target.addTempSkill("fengyin");
					}
					target.addTempSkill("shouli_thunder");
					player.addTempSkill("shouli_thunder");
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
					if (_status.event.type != "phase") {
						return 9 - att;
					}
					if (!player.hasValueTarget({ name: "sha" })) {
						return 0;
					}
					return 9 - att;
				},
			},
		},
		group: "shouli_init",
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
				intro: { content: "受到的伤害+1且改为雷属性" },
				ai: {
					effect: {
						target: (card, player, target) => {
							if (!get.tag(card, "damage")) {
								return;
							}
							if (target.hasSkillTag("nodamage") || target.hasSkillTag("nothunder")) {
								return "zeroplayertarget";
							}
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
							) {
								return;
							}
							return 2;
						},
					},
				},
			},
			init: {
				audio: "shouli",
				trigger: {
					global: "phaseBefore",
					player: "enterGame",
				},
				forced: true,
				locked: false,
				filter(event, player) {
					return event.name != "phase" || game.phaseNumber == 0;
				},
				logTarget: () => game.filterPlayer(),
				content() {
					"step 0";
					var targets = game.filterPlayer().sortBySeat(player.getNext());
					event.targets = targets;
					event.num = 0;
					"step 1";
					var target = event.targets[num];
					if (target.isIn()) {
						var card = get.cardPile2(function (card) {
							if (get.cardtag(card, "gifts")) {
								return false;
							}
							var type = get.subtype(card);
							if (type != "equip3" && type != "equip4" && type != "equip6") {
								return false;
							}
							return target.canUse(card, target);
						});
						if (card) {
							target.chooseUseTarget(card, "nopopup", "noanimate", true);
						}
					}
					event.num++;
					if (event.num < targets.length) {
						event.redo();
					}
				},
			},
			backup: {
				precontent() {
					"step 0";
					var cards = event.result.card.cards;
					event.result.cards = cards;
					var owner = get.owner(cards[0]);
					event.target = owner;
					owner.$give(cards[0], player, false);
					player.popup(event.result.card.name, "metal");
					game.delayx();
					event.getParent().addCount = false;
					"step 1";
					if (player != target) {
						target.addTempSkill("fengyin");
					}
					target.addTempSkill("shouli_thunder");
					player.addTempSkill("shouli_thunder");
				},
				filterCard: () => false,
				prompt: "请选择【杀】的目标",
				selectCard: -1,
				log: false,
			},
		},
	},
	hengwu: {
		audio: 2,
		trigger: { player: ["useCard", "respond"] },
		frequent: true,
		filter(event, player) {
			var suit = get.suit(event.card);
			if (
				!lib.suit.includes(suit) ||
				player.hasCard(function (card) {
					return get.suit(card, player) == suit;
				}, "h")
			) {
				return false;
			}
			return game.hasPlayer(function (current) {
				return current.hasCard(function (card) {
					return get.suit(card, current) == suit;
				}, "e");
			});
		},
		content() {
			var suit = get.suit(trigger.card);
			player.draw(
				game.countPlayer(function (current) {
					return current.countCards("e", function (card) {
						return get.suit(card, current) == suit;
					});
				})
			);
		},
		ai: {
			effect: {
				player_use(card, player, target) {
					if (typeof card !== "object") {
						return;
					}
					let suit = get.suit(card);
					if (
						!lib.suit.includes(suit) ||
						player.hasCard(function (i) {
							return get.suit(i, player) == suit;
						}, "h")
					) {
						return;
					}
					return [
						1,
						0.8 *
							game.countPlayer(current => {
								return current.countCards("e", card => {
									return get.suit(card, current) == suit;
								});
							}),
					];
				},
				target: (card, player, target) => {
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
					) {
						return [0, -0.5];
					}
				},
			},
		},
	},
	changandajian_equip5: {
		equipSkill: true,
		mod: { maxHandcard: (player, num) => num + 2 },
	},
	changandajian_destroy: {
		trigger: {
			player: "loseAfter",
			global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"],
		},
		forced: true,
		charlotte: true,
		equipSkill: true,
		filter(event, player) {
			var evt = event.getl(player);
			if (!evt || !evt.es || !evt.es.length) {
				return false;
			}
			for (var i of evt.es) {
				if (i.name.indexOf("changandajian_equip") == 0) {
					return true;
				}
			}
			return false;
		},
		getEffect(player, target) {
			if (player == target) {
				return 0;
			}
			var getRaw = function () {
				var att = get.attitude(player, target);
				if (att > 0) {
					if (
						target.countCards("j", function (card) {
							var cardj = card.viewAs ? { name: card.viewAs } : card;
							return get.effect(target, cardj, target, player) < 0;
						}) > 0
					) {
						return 3;
					}
					if (target.getEquip("baiyin") && target.isDamaged() && get.recoverEffect(target, player, player) > 0) {
						if (target.hp == 1 && !target.hujia) {
							return 1.6;
						}
					}
					if (
						target.countCards("e", function (card) {
							if (get.position(card) == "e") {
								return get.value(card, target) < 0;
							}
						}) > 0
					) {
						return 1;
					}
				}
				var es = target.getCards("e");
				var noe = es.length == 0 || target.hasSkillTag("noe");
				var noe2 =
					es.filter(function (esx) {
						return get.value(esx, target) > 0;
					}).length == 0;
				if (noe || noe2) {
					return 0;
				}
				if (att <= 0 && !target.countCards("e")) {
					return 1.5;
				}
				return -1.5;
			};
			return getRaw() * get.attitude(player, target);
		},
		content() {
			"step 0";
			var num = 0,
				recover = 0;
			var evt = trigger.getl(player);
			for (var i of evt.es) {
				if (i.name.indexOf("changandajian_equip") == 0) {
					num++;
				}
				if (i.name == "changandajian_equip2") {
					recover++;
				}
			}
			if (recover > 0) {
				player.recover(recover);
			}
			event.count = num;
			if (
				!game.hasPlayer(function (current) {
					return current.countCards("ej") > 0;
				})
			) {
				event.finish();
			}
			"step 1";
			event.count--;
			player
				.chooseTarget(true, "选择一名装备区或判定区有牌的角色", function (card, player, target) {
					return target.countCards("ej") > 0;
				})
				.set("ai", function (target) {
					return lib.skill.changandajian_destroy.getEffect(_status.event.player, target);
				});
			"step 2";
			if (result.bool) {
				var target = result.targets[0];
				event.target = target;
				player.line(target, "green");
				player.choosePlayerCard(target, true, "ej");
			} else {
				event.finish();
			}
			"step 3";
			if (result.bool) {
				var card = result.cards[0];
				var num = get.number(card);
				if (typeof get.strNumber(num, false) === "string") {
					if (lib.filter.canBeGained(card, player, target)) {
						player.gain(card, target, "give", "bySelf");
					}
				} else if (lib.filter.canBeDiscarded(card, player, target)) {
					target.discard(card);
				}
			} else {
				event.finish();
			}
			"step 4";
			if (
				event.count > 0 &&
				game.hasPlayer(function (current) {
					return current.countCards("ej") > 0;
				})
			) {
				event.goto(1);
			}
		},
	},
	dili: {
		audio: 2,
		trigger: {
			global: "phaseBefore",
			player: "enterGame",
		},
		forced: true,
		filter(event, player) {
			if (player.storage.dili) {
				return false;
			}
			if (event.name != "phase") {
				return true;
			}
			if (game.phaseNumber == 0) {
				return true;
			}
			//让神山识能够获得东吴命运线
			return player.name == "key_shiki";
		},
		content() {
			player.storage.dili = true;
			var skill = ["dili_shengzhi", "dili_chigang", "dili_qionglan", "dili_quandao", "dili_jiaohui", "dili_yuanlv"].randomGet();
			player.addSkill(skill);
			game.log(player, '解锁了<span style="font-family: yuanli">东吴命运线</span>：', "#g【" + get.translation(skill) + "】");
		},
		derivation: ["dili_shengzhi", "dili_chigang", "dili_qionglan", "dili_quandao", "dili_jiaohui", "dili_yuanlv", "gzyinghun", "hongde", "rebingyi", "xinfu_guanwei", "bizheng", "xinanguo", "shelie", "wengua", "rebotu", "rezhiheng", "jiexun", "reanxu", "xiashu", "rejieyin", "oldimeng", "xinfu_guanchao", "drlt_jueyan", "lanjiang"],
		subSkill: {
			shengzhi: {
				audio: 2,
				trigger: { player: "useCard" },
				forced: true,
				filter(event, player) {
					var num = get.number(event.card);
					if (typeof num != "number") {
						return false;
					}
					if (num <= 1) {
						return false;
					}
					for (var i = 2; i <= Math.sqrt(num); i++) {
						if (num % i == 0) {
							return false;
						}
					}
					if (!player.storage.yuheng) {
						return false;
					}
					var list = ["gzyinghun", "hongde", "rebingyi"];
					for (var i of list) {
						if (!player.storage.yuheng.includes(i)) {
							return false;
						}
					}
					return true;
				},
				content() {
					trigger.directHit.addArray(
						game.filterPlayer(function (current) {
							return current != player;
						})
					);
				},
				init(player, skill) {
					player.markAuto("yuheng_current", ["gzyinghun", "hongde", "rebingyi"]);
				},
				mark: true,
				ai: {
					directHit_ai: true,
					skillTagFilter(player, tag, arg) {
						if (arg && arg.card) {
							var num = get.number(arg.card);
							if (typeof num != "number") {
								return false;
							}
							if (num <= 1) {
								return false;
							}
							for (var i = 2; i <= Math.sqrt(num); i++) {
								if (num % i == 0) {
									return false;
								}
							}
							return true;
						}
						return false;
					},
				},
				intro: {
					name: "命运线：圣质",
					content(storage, player) {
						var finished = [],
							unfinished = ["gzyinghun", "hongde", "rebingyi"];
						if (player.storage.yuheng) {
							for (var i = 0; i < unfinished.length; i++) {
								if (player.storage.yuheng.includes(unfinished[i])) {
									finished.push(unfinished[i]);
									unfinished.splice(i--, 1);
								}
							}
						}
						var str = "";
						if (unfinished.length) {
							str += "<li>未获得：" + get.translation(unfinished) + "<br>";
						}
						if (finished.length) {
							str += "<li>已获得过：" + get.translation(finished) + "<br>";
						}
						str += "<li>锁定技。若你因〖驭衡〗获得过〖英魂〗〖弘德〗〖秉壹〗，则当你使用点数为质数的牌时，此牌不可被响应。";
						return str;
					},
				},
			},
			chigang: {
				audio: 2,
				trigger: { player: "phaseChange" },
				forced: true,
				filter(event, player) {
					if (!player.storage.yuheng?.length) {
						return false;
					}
					const list = ["xinfu_guanwei", "bizheng", "xinanguo"];
					if (list.some(skill => !player.storage.yuheng.includes(skill))) {
						return false;
					}
					return event.phaseList[event.num].indexOf("phaseJudge") != -1;
				},
				content() {
					trigger.phaseList[trigger.num] = `phaseDraw|${event.name}`;
					game.delayx();
				},
				init(player, skill) {
					player.markAuto("yuheng_current", ["xinfu_guanwei", "bizheng", "xinanguo"]);
				},
				ai: {
					effect: {
						target(card) {
							if (get.type(card) == "delay") {
								return "zeroplayertarget";
							}
						},
					},
				},
				mark: true,
				intro: {
					name: "命运线：持纲",
					content(storage, player) {
						var finished = [],
							unfinished = ["xinfu_guanwei", "bizheng", "xinanguo"];
						if (player.storage.yuheng) {
							for (var i = 0; i < unfinished.length; i++) {
								if (player.storage.yuheng.includes(unfinished[i])) {
									finished.push(unfinished[i]);
									unfinished.splice(i--, 1);
								}
							}
						}
						var str = "";
						if (unfinished.length) {
							str += "<li>未获得：" + get.translation(unfinished) + "<br>";
						}
						if (finished.length) {
							str += "<li>已获得过：" + get.translation(finished) + "<br>";
						}
						str += "<li>锁定技。若你因〖驭衡〗获得过〖观微〗〖弼政〗〖安国〗，则当你的判定阶段开始前，你跳过此阶段并获得一个额外的摸牌阶段。";
						return str;
					},
				},
			},
			qionglan: {
				audio: 2,
				init(player, skill) {
					player.markAuto("yuheng_current", ["shelie", "wengua", "rebotu"]);
				},
				trigger: { player: "useSkillAfter" },
				forced: true,
				limited: true,
				filter(event, player) {
					if (!player.storage.yuheng || event.skill != "yuheng") {
						return false;
					}
					var list = ["shelie", "wengua", "rebotu"];
					for (var i of list) {
						if (!player.storage.yuheng.includes(i)) {
							return false;
						}
					}
					return true;
				},
				content() {
					player.awakenSkill(event.name);
					var list = ["dili_shengzhi", "dili_chigang", "dili_quandao", "dili_jiaohui", "dili_yuanlv"];
					var list2 = list.randomRemove(2);
					if (list2.includes("dili_quandao") && list2.includes("dili_jiaohui")) {
						list2.randomRemove(1);
						list2.push(list.randomGet());
					}
					for (var skill of list2) {
						player.addSkill(skill);
						game.log(player, '解锁了<span style="font-family: yuanli">东吴命运线</span>：', "#g【" + get.translation(skill) + "】");
					}
				},
				mark: true,
				intro: {
					name: "命运线：穹览",
					content(storage, player) {
						var finished = [],
							unfinished = ["shelie", "wengua", "rebotu"];
						if (player.storage.yuheng) {
							for (var i = 0; i < unfinished.length; i++) {
								if (player.storage.yuheng.includes(unfinished[i])) {
									finished.push(unfinished[i]);
									unfinished.splice(i--, 1);
								}
							}
						}
						var str = "";
						if (unfinished.length) {
							str += "<li>未获得：" + get.translation(unfinished) + "<br>";
						}
						if (finished.length) {
							str += "<li>已获得过：" + get.translation(finished) + "<br>";
						}
						str += '<li>锁定技，限定技。若你因〖驭衡〗获得过〖涉猎〗〖问卦〗〖博图〗，则当你发动的〖驭衡〗结算结束后，你随机获得两条其他<span style="font-family: yuanli">东吴命运线</span>。';
						return str;
					},
				},
			},
			quandao: {
				audio: 2,
				mod: {
					cardname(card, player) {
						if (player.storage.yuheng && typeof get.strNumber(card.number, false) === "string") {
							var list = ["rezhiheng", "jiexun", "reanxu"];
							for (var i of list) {
								if (!player.storage.yuheng.includes(i)) {
									return;
								}
							}
							return "tiaojiyanmei";
						}
					},
				},
				init(player, skill) {
					player.markAuto("yuheng_current", ["rezhiheng", "jiexun", "reanxu"]);
				},
				mark: true,
				intro: {
					name: "命运线：权道",
					content(storage, player) {
						var finished = [],
							unfinished = ["rezhiheng", "jiexun", "reanxu"];
						if (player.storage.yuheng) {
							for (var i = 0; i < unfinished.length; i++) {
								if (player.storage.yuheng.includes(unfinished[i])) {
									finished.push(unfinished[i]);
									unfinished.splice(i--, 1);
								}
							}
						}
						var str = "";
						if (unfinished.length) {
							str += "<li>未获得：" + get.translation(unfinished) + "<br>";
						}
						if (finished.length) {
							str += "<li>已获得过：" + get.translation(finished) + "<br>";
						}
						str += "<li>锁定技。若你因〖驭衡〗获得过〖制衡〗〖诫训〗〖安恤〗，则你手牌区内点数为字母的牌的牌名视为【调剂盐梅】。";
						return str;
					},
				},
			},
			jiaohui: {
				audio: 2,
				mod: {
					cardname(card, player) {
						if (player.countCards("h") == 1 && player.storage.yuheng) {
							var list = ["xiashu", "rejieyin", "oldimeng"];
							for (var i of list) {
								if (!player.storage.yuheng.includes(i)) {
									return;
								}
							}
							return "yuanjiao";
						}
					},
				},
				init(player, skill) {
					player.markAuto("yuheng_current", ["xiashu", "rejieyin", "oldimeng"]);
				},
				mark: true,
				intro: {
					name: "命运线：交辉",
					content(storage, player) {
						var finished = [],
							unfinished = ["xiashu", "rejieyin", "oldimeng"];
						if (player.storage.yuheng) {
							for (var i = 0; i < unfinished.length; i++) {
								if (player.storage.yuheng.includes(unfinished[i])) {
									finished.push(unfinished[i]);
									unfinished.splice(i--, 1);
								}
							}
						}
						var str = "";
						if (unfinished.length) {
							str += "<li>未获得：" + get.translation(unfinished) + "<br>";
						}
						if (finished.length) {
							str += "<li>已获得过：" + get.translation(finished) + "<br>";
						}
						str += "<li>锁定技。若你因〖驭衡〗获得过〖下书〗〖结姻〗〖缔盟〗，且你的手牌数为1，则此牌的牌名视为【远交近攻】。";
						return str;
					},
				},
			},
			yuanlv: {
				audio: 2,
				init(player, skill) {
					_status.changandajian_cardcolor = 0;
					player.markAuto("yuheng_current", ["xinfu_guanchao", "drlt_jueyan", "lanjiang"]);
				},
				trigger: { player: "useCardToTargeted" },
				forced: true,
				filter(event, player) {
					if (get.type(event.card, null, false) != "equip" || player != event.target || event.card.name.indexOf("changandajian_equip") == 0) {
						return false;
					}
					if (!player.storage.yuheng) {
						return false;
					}
					var list = ["xinfu_guanchao", "drlt_jueyan", "lanjiang"];
					for (var i of list) {
						if (!player.storage.yuheng.includes(i)) {
							return false;
						}
					}
					var type = get.subtype(event.card);
					if (lib.card["changandajian_" + type] && player.hasEquipableSlot(type)) {
						return true;
					}
					return false;
				},
				content() {
					var cards = trigger.cards.filterInD();
					if (cards.length > 0) {
						game.cardsDiscard(cards);
					}
					var type = get.subtype(trigger.card);
					var card = game.createCard("changandajian_" + type, _status.changandajian_cardcolor++ % 2 ? "spade" : "heart", 10);
					player.useCard(card, player);
				},
				mark: true,
				intro: {
					name: "命运线：渊虑",
					content(storage, player) {
						var finished = [],
							unfinished = ["xinfu_guanchao", "drlt_jueyan", "lanjiang"];
						if (player.storage.yuheng) {
							for (var i = 0; i < unfinished.length; i++) {
								if (player.storage.yuheng.includes(unfinished[i])) {
									finished.push(unfinished[i]);
									unfinished.splice(i--, 1);
								}
							}
						}
						var str = "";
						if (unfinished.length) {
							str += "<li>未获得：" + get.translation(unfinished) + "<br>";
						}
						if (finished.length) {
							str += "<li>已获得过：" + get.translation(finished) + "<br>";
						}
						str += "<li>锁定技。若你因〖驭衡〗获得过〖观潮〗〖决堰〗〖澜疆〗，则当你成为自己使用的装备牌的目标后，你将此牌置于弃牌堆，然后使用一张与此装备牌副类别相同的【长安大舰】。";
						return str;
					},
				},
			},
		},
		ai: {
			combo: "yuheng",
		},
	},
	yuheng: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		content() {
			var skills = player.getSkills(null, false, false).filter(function (i) {
				if (i == "yuheng") {
					return false;
				}
				var info = get.info(i);
				return info && !info.charlotte && !get.is.locked(i);
			});
			if (skills.length) {
				player.removeSkills(skills);
			}
			//初始化技能库
			var list1 = ["dili_shengzhi", "dili_chigang", "dili_qionglan", "dili_quandao", "dili_jiaohui", "dili_yuanlv"];
			var list2 = ["gzyinghun", "hongde", "rebingyi", "xinfu_guanwei", "bizheng", "xinanguo", "shelie", "wengua", "rebotu", "rezhiheng", "jiexun", "reanxu", "xiashu", "rejieyin", "oldimeng", "xinfu_guanchao", "drlt_jueyan", "lanjiang"];
			var list3 = [];
			if (!player.storage.yuheng_full) {
				player.storage.yuheng_full = list2.slice(0);
			}
			if (player.getStorage("yuheng_current").length == 0) {
				for (var i = 0; i < list1.length; i++) {
					if (player.hasSkill(list1[i])) {
						for (var j = 0; j < 3; j++) {
							list3.add(list2[i * 3 + j]);
						}
					}
				}
				if (!player.storage.yuheng_current) {
					player.storage.yuheng_current = list3.slice(0);
				}
			}
			var fullskills, currentskills;
			//决定抽选技能范围
			if (player.storage.yuheng_full && player.storage.yuheng_full.length) {
				fullskills = player.storage.yuheng_full;
			} else {
				fullskills = list2.slice(0);
			}
			if (player.storage.yuheng_current && player.storage.yuheng_current.length) {
				currentskills = player.storage.yuheng_current;
			} else {
				currentskills = list3.slice(0);
			}
			var skills = [];
			//在没有发动过其他非锁定技时抽选技能
			var evtx = event.getParent("phaseUse");
			if (
				currentskills.length > 0 &&
				!player.hasHistory("useSkill", function (evt) {
					if (evt.skill == "yuheng" || evt.type != "player" || !evt.sourceSkill) {
						return false;
					}
					var info1 = get.info(evt.skill);
					if (info1.charlotte) {
						return false;
					}
					var info = get.info(evt.sourceSkill);
					if (info.charlotte || get.is.locked(evt.skill)) {
						return false;
					}
					return evt.event.getParent("phaseUse") == evtx;
				})
			) {
				fullskills.randomSort();
				currentskills.randomSort();
				for (var i = 0; i < fullskills.length; i++) {
					for (var j = 0; j < currentskills.length; j++) {
						if (fullskills[i] != currentskills[j] || (i == fullskills.length - 1 && j == currentskills.length - 1)) {
							skills.add(fullskills.splice(i--, 1)[0]);
							skills.add(currentskills.splice(j--, 1)[0]);
							break;
						}
					}
					if (skills.length > 0) {
						break;
					}
				}
			}
			//在已经发动过其他非锁定技时抽选技能
			else {
				skills.add(fullskills.randomRemove(1)[0]);
			}
			for (var i of skills) {
				player.addSkills(i);
			}
			player.markAuto("yuheng", skills);
		},
		ai: {
			order(item, player) {
				var evtx = _status.event.getParent("phaseUse");
				if (
					!player.hasHistory("useSkill", function (evt) {
						if (evt.skill == "yuheng" || evt.type != "player" || !evt.sourceSkill) {
							return false;
						}
						var info1 = get.info(evt.skill);
						if (info1.charlotte) {
							return false;
						}
						var info = get.info(evt.sourceSkill);
						if (info.charlotte || get.is.locked(evt.skill)) {
							return false;
						}
						return evt.event.getParent("phaseUse") == evtx;
					})
				) {
					return 11;
				}
				return 0.8;
			},
			result: { player: 1 },
		},
		group: "yuheng_losehp",
		subSkill: {
			losehp: {
				audio: "yuheng",
				trigger: { player: "phaseUseEnd" },
				forced: true,
				locked: false,
				filter(event, player) {
					return !player.hasHistory("useSkill", function (evt) {
						if (evt.skill != "yuheng") {
							return false;
						}
						return evt.event.getParent("phaseUse") == event;
					});
				},
				content() {
					player.loseHp();
				},
			},
		},
	},
	jiufa: {
		audio: 2,
		trigger: { player: ["useCardAfter", "respondAfter"] },
		frequent: true,
		filter(event, player) {
			return event.jiufa_counted && player.getStorage("jiufa").length >= 9;
		},
		content() {
			"step 0";
			player.unmarkSkill("jiufa");
			event.cards = get.cards(9);
			event.cards.sort(function (a, b) {
				return get.number(b) - get.number(a);
			});
			game.cardsGotoOrdering(event.cards);
			event.videoId = lib.status.videoId++;
			game.broadcastAll(
				function (player, id, cards) {
					var str;
					if (player == game.me && !_status.auto) {
						str = "九伐：选择任意张点数满足条件的牌";
					} else {
						str = "九伐";
					}
					var dialog = ui.create.dialog(str, cards);
					dialog.videoId = id;
				},
				player,
				event.videoId,
				event.cards
			);
			event.time = get.utc();
			game.addVideo("showCards", player, ["九伐", get.cardsInfo(event.cards)]);
			game.addVideo("delay", null, 2);
			"step 1";
			var next = player.chooseButton([0, 9], true);
			next.set("dialog", event.videoId);
			next.set("filterButton", function (button) {
				var num = get.number(button.link),
					cards = _status.event.getParent().cards;
				for (var i of ui.selected.buttons) {
					if (get.number(i.link) == num) {
						return false;
					}
				}
				for (var i of cards) {
					if (i != button.link && get.number(i) == num) {
						return true;
					}
				}
				return false;
			});
			next.set("ai", function (button) {
				return get.value(button.link, _status.event.player);
			});
			"step 2";
			if (result.bool && result.links && result.links.length) {
				event.cards2 = result.links;
			}
			var time = 1000 - (get.utc() - event.time);
			if (time > 0) {
				game.delay(0, time);
			}
			"step 3";
			game.broadcastAll("closeDialog", event.videoId);
			var cards2 = event.cards2;
			if (cards2 && cards2.length) {
				player.gain(cards2, "log", "gain2");
			}
		},
		marktext: "⑨",
		intro: {
			content: "已记录牌名：$",
			onunmark: true,
		},
		group: "jiufa_count",
		subSkill: {
			count: {
				trigger: { player: ["useCard1", "respond"] },
				forced: true,
				charlotte: true,
				popup: false,
				firstDo: true,
				filter(event, player) {
					return !player.getStorage("jiufa").includes(event.card.name);
				},
				content() {
					trigger.jiufa_counted = true;
					player.markAuto("jiufa", [trigger.card.name]);
				},
			},
		},
	},
	tianren: {
		audio: 2,
		trigger: { global: ["loseAfter", "cardsDiscardAfter", "loseAsyncAfter"] },
		forced: true,
		filter(event, player) {
			if (event.name.indexOf("lose") == 0) {
				if (event.getlx === false || event.position != ui.discardPile) {
					return false;
				}
			} else {
				var evt = event.getParent();
				if (evt.relatedEvent && evt.relatedEvent.name == "useCard") {
					return false;
				}
			}
			for (var i of event.cards) {
				var owner = false;
				if (event.hs && event.hs.includes(i)) {
					owner = event.player;
				}
				var type = get.type(i, null, owner);
				if (type == "basic" || type == "trick") {
					return true;
				}
			}
			return false;
		},
		content() {
			var num = 0;
			for (var i of trigger.cards) {
				var owner = false;
				if (trigger.hs && trigger.hs.includes(i)) {
					owner = trigger.player;
				}
				var type = get.type(i, null, owner);
				if (type == "basic" || type == "trick") {
					num++;
				}
			}
			player.addMark("tianren", num);
		},
		group: "tianren_maxHp",
		intro: { content: "mark" },
		subSkill: {
			maxHp: {
				audio: "tianren",
				trigger: { player: ["tianrenAfter", "gainMaxHpAfter", "loseMaxHpAfter"] },
				forced: true,
				filter(event, player) {
					return player.countMark("tianren") >= player.maxHp;
				},
				content() {
					player.removeMark("tianren", player.maxHp);
					player.gainMaxHp();
					player.draw(2);
				},
			},
		},
	},
	pingxiang: {
		audio: 2,
		enable: "phaseUse",
		limited: true,
		skillAnimation: true,
		animationColor: "ice",
		filter(event, player) {
			return player.maxHp > 9;
		},
		content() {
			"step 0";
			player.awakenSkill(event.name);
			player.loseMaxHp(9);
			event.num = 0;
			"step 1";
			event.num++;
			player.chooseUseTarget(
				{
					name: "sha",
					nature: "fire",
					isCard: true,
				},
				"请选择火【杀】的目标（" + (event.num == 9 ? "⑨" : event.num) + "/9）",
				false
			);
			"step 2";
			if (result.bool && event.num < 9) {
				event.goto(1);
			} else {
				player.removeSkills("jiufa");
			}
			"step 3";
			player.addSkill("pingxiang_effect");
		},
		ai: {
			order() {
				return get.order({
					name: "sha",
					nature: "fire",
					isCard: true,
				});
			},
			result: {
				player(player) {
					if (
						player.hasValueTarget({
							name: "sha",
							nature: "fire",
							isCard: true,
						})
					) {
						return 1;
					}
					return 0;
				},
			},
			combo: "tianren",
		},
		subSkill: {
			effect: {
				marktext: "襄",
				intro: { content: "手牌上限基数改为体力上限" },
				mod: {
					maxHandcardBase(player) {
						return player.maxHp;
					},
				},
			},
		},
	},
	yingba: {
		audio: 2,
		mod: {
			aiOrder(player, card, num) {
				if (num > 0 && _status.event && _status.event.type == "phase" && get.tag(card, "recover")) {
					if (player.needsToDiscard()) {
						return num / 3;
					}
					return 0;
				}
			},
			targetInRange(card, player, target) {
				if (target.hasMark("yingba_mark")) {
					return true;
				}
			},
		},
		enable: "phaseUse",
		usable: 1,
		filter: (event, player) => game.hasPlayer(current => current != player && current.maxHp > 1),
		filterTarget: (card, player, target) => target != player && target.maxHp > 1,
		content() {
			"step 0";
			target.loseMaxHp();
			"step 1";
			if (target.isIn()) {
				target.addMark("yingba_mark", 1);
			}
			player.loseMaxHp();
		},
		locked: false,
		//global:'yingba_mark',
		ai: {
			threaten(player, target) {
				if (player === target || player.isDamaged() || get.attitude(player, target) > 0) {
					return 1;
				}
				return 8 / player.maxHp;
			},
			order: 11,
			result: {
				player(player, target) {
					if (player.maxHp == 1) {
						return -2.5;
					}
					return -0.25;
				},
				target(player, target) {
					if (target.isHealthy()) {
						return -2;
					}
					if (!target.hasMark("yingba_mark")) {
						return -1;
					}
					return -0.2;
				},
			},
		},
		subSkill: {
			mark: {
				marktext: "定",
				intro: {
					name: "平定",
					content: "mark",
					onunmark: true,
				},
				mod: {
					maxHandcard(player, numx) {
						var num = player.countMark("yingba_mark");
						if (num) {
							return (
								numx +
								num *
									game.countPlayer(function (current) {
										return current.hasSkill("yingba");
									})
							);
						}
					},
				},
			},
		},
	},
	scfuhai: {
		audio: 2,
		trigger: { player: "useCardToPlayered" },
		forced: true,
		filter(event, player) {
			return event.target && event.target.hasMark("yingba_mark");
		},
		logTarget: "target",
		content() {
			trigger.directHit.add(trigger.target);
			if (
				player.getHistory("gain", function (evt) {
					return evt.getParent(2).name == "scfuhai";
				}).length < 2
			) {
				player.draw();
			}
		},
		group: ["scfuhai_die"],
		ai: {
			directHit_ai: true,
			skillTagFilter(player, tag, arg) {
				return arg && arg.target && arg.target.hasMark("yingba_mark");
			},
			combo: "yingba",
		},
		subSkill: {
			usea: {
				audio: "scfuhai",
				trigger: { player: "useCardAfter" },
				forced: true,
				filter(event, player) {
					return lib.skill.scfuhai_usea.logTarget(event, player).length > 0;
				},
				logTarget(event, player) {
					return event.targets.filter(function (i) {
						return i.hasMark("yingba_mark");
					});
				},
				content() {
					var num = 0;
					for (var i of trigger.targets) {
						var numx = i.countMark("yingba_mark");
						if (numx) {
							num += numx;
							i.removeMark("yingba_mark", numx);
						}
					}
					if (num) {
						player.gainMaxHp(num);
					}
				},
			},
			die: {
				audio: "scfuhai",
				trigger: { global: "die" },
				forced: true,
				filter(event, player) {
					return event.player.countMark("yingba_mark") > 0;
				},
				content() {
					player.gainMaxHp(trigger.player.countMark("yingba_mark"));
					player.draw(trigger.player.countMark("yingba_mark"));
				},
			},
		},
	},
	pinghe: {
		audio: 2,
		mod: {
			maxHandcardBase(player) {
				return player.getDamagedHp();
			},
		},
		trigger: { player: "damageBegin2" },
		forced: true,
		filter(event, player) {
			return event.source && event.source != player && player.maxHp > 1 && player.countCards("h") > 0;
		},
		content() {
			"step 0";
			player.chooseCardTarget({
				prompt: "请选择【冯河】的牌和目标",
				prompt2: "将一张手牌交给一名其他角色并防止伤害" + (player.hasSkill("yingba") ? "，然后令伤害来源获得一个“平定”标记" : ""),
				filterCard: true,
				forced: true,
				filterTarget: lib.filter.notMe,
				ai1(card) {
					if (
						get.tag(card, "recover") &&
						!game.hasPlayer(function (current) {
							return get.attitude(current, player) > 0 && !current.hasSkillTag("nogain");
						})
					) {
						return 0;
					}
					return 1 / Math.max(0.1, get.value(card));
				},
				ai2(target) {
					var player = _status.event.player,
						att = get.attitude(player, target);
					if (target.hasSkillTag("nogain")) {
						att /= 9;
					}
					return 4 + att;
				},
			});
			"step 1";
			if (result.bool) {
				var target = result.targets[0];
				//player.logSkill('pinghe',target);
				player.line(target, "green");
				player.give(result.cards, target);
				trigger.cancel();
				player.loseMaxHp();
				if (player.hasSkill("yingba")) {
					trigger.source.addMark("yingba_mark", 1);
				}
			}
		},
		ai: {
			maixie_defend: true,
			effect: {
				target(card, player, target) {
					if (player !== target && target.maxHp > 1 && target.countCards("h") > 0) {
						if (get.tag(card, "damage") && target.hasSkill("yingba")) {
							let damage = 1.6;
							if (target.isHealthy()) {
								damage += 1.6;
							}
							if (
								game.hasPlayer(cur => {
									return cur !== target && get.attitude(target, cur) > 0;
								})
							) {
								damage -= 0.9;
							}
							return [0, -damage, 0, -0.4];
						}
						if (card.name === "tiesuo") {
							return 0.4;
						}
					}
					if (get.tag(card, "recover") && _status.event.type == "phase" && !player.needsToDiscard()) {
						return 0;
					}
				},
			},
		},
	},
	tianzuo: {
		audio: 2,
		trigger: {
			global: "phaseBefore",
			player: "enterGame",
		},
		forced: true,
		filter(event, player) {
			return (event.name != "phase" || game.phaseNumber == 0) && !lib.inpile.includes("qizhengxiangsheng");
		},
		content() {
			game.addGlobalSkill("tianzuo_global");
			var cards = [];
			for (var i = 2; i < 10; i++) {
				cards.push(game.createCard2("qizhengxiangsheng", i % 2 ? "club" : "spade", i));
			}
			game.broadcastAll(function () {
				lib.inpile.add("qizhengxiangsheng");
			});
			game.cardsGotoPile(cards, () => {
				return ui.cardPile.childNodes[get.rand(0, ui.cardPile.childNodes.length - 1)];
			});
		},
		group: "tianzuo_remove",
		subSkill: {
			remove: {
				audio: "tianzuo",
				trigger: { target: "useCardToBefore" },
				forced: true,
				priority: 15,
				filter(event, player) {
					return event.card && event.card.name == "qizhengxiangsheng";
				},
				content() {
					trigger.cancel();
				},
				ai: {
					effect: {
						target(card, player, target) {
							if (card && card.name == "qizhengxiangsheng") {
								return "zeroplayertarget";
							}
						},
					},
				},
			},
			global: {
				trigger: { player: "useCardToPlayered" },
				forced: true,
				popup: false,
				filter(event, player) {
					return event.card.name == "qizhengxiangsheng";
				},
				content() {
					"step 0";
					var target = trigger.target;
					event.target = target;
					player
						.chooseControl("奇兵", "正兵")
						.set("prompt", "请选择" + get.translation(target) + "的标记")
						.set(
							"choice",
							(function () {
								var e1 = 1.5 * get.sgn(get.damageEffect(target, player, target));
								var e2 = 0;
								if (target.countGainableCards(player, "h") > 0 && !target.hasSkillTag("noh")) {
									e2 = -1;
								}
								var es = target.getGainableCards(player, "e");
								if (es.length) {
									e2 = Math.min(
										e2,
										(function () {
											var max = 0;
											for (var i of es) {
												max = Math.max(max, get.value(i, target));
											}
											return -max / 4;
										})()
									);
								}
								if (Math.abs(e1 - e2) <= 0.3) {
									return Math.random() < 0.5 ? "奇兵" : "正兵";
								}
								if (e1 < e2) {
									return "奇兵";
								}
								return "正兵";
							})()
						)
						.set("ai", function () {
							return _status.event.choice;
						});
					"step 1";
					var map = trigger.getParent().customArgs,
						id = target.playerid;
					if (!map[id]) {
						map[id] = {};
					}
					map[id].qizheng_name = result.control;
				},
			},
			rewrite: {
				audio: "tianzuo",
				trigger: { global: "useCardToTargeted" },
				filter(event, player) {
					return event.card.name == "qizhengxiangsheng";
				},
				logTarget: "target",
				prompt2: "观看其手牌并修改“奇正相生”标记",
				content() {
					"step 0";
					var target = trigger.target;
					event.target = target;
					if (player != target && target.countCards("h") > 0) {
						player.viewHandcards(target);
					}
					player
						.chooseControl("奇兵", "正兵")
						.set("prompt", "请选择" + get.translation(target) + "的标记")
						.set(
							"choice",
							(function () {
								var shas = target.getCards("h", "sha"),
									shans = target.getCards("h", "shan");
								var e1 = 1.5 * get.sgn(get.damageEffect(target, player, target));
								var e2 = 0;
								if (target.countGainableCards(player, "h") > 0 && !target.hasSkillTag("noh")) {
									e2 = -1;
								}
								var es = target.getGainableCards(player, "e");
								if (es.length) {
									e2 = Math.min(
										e2,
										(function () {
											var max = 0;
											for (var i of es) {
												max = Math.max(max, get.value(i, target));
											}
											return -max / 4;
										})()
									);
								}
								if (get.attitude(player, target) > 0) {
									if (shas.length >= Math.max(1, shans.length)) {
										return "奇兵";
									}
									if (shans.length > shas.length) {
										return "正兵";
									}
									return e1 > e2 ? "奇兵" : "正兵";
								}
								if (shas.length) {
									e1 = -0.5;
								}
								if (shans.length) {
									e2 = -0.7;
								}
								if (Math.abs(e1 - e2) <= 0.3) {
									return Math.random() < 0.5 ? "奇兵" : "正兵";
								}
								var rand = Math.random();
								if (e1 < e2) {
									return rand < 0.1 ? "奇兵" : "正兵";
								}
								return rand < 0.1 ? "正兵" : "奇兵";
							})()
						)
						.set("ai", () => _status.event.choice);
					"step 1";
					var map = trigger.getParent().customArgs,
						id = target.playerid;
					if (!map[id]) {
						map[id] = {};
					}
					map[id].qizheng_name = result.control;
					map[id].qizheng_aibuff = get.attitude(player, target) > 0;
				},
			},
		},
	},
	lingce: {
		audio: 2,
		init: player => {
			game.addGlobalSkill("lingce_global");
		},
		trigger: { global: "useCard" },
		forced: true,
		filter(event, player) {
			if (!event.card.isCard || !event.cards || event.cards.length !== 1) {
				return false;
			}
			return event.card.name == "qizhengxiangsheng" || get.zhinangs().includes(event.card.name) || player.getStorage("dinghan").includes(event.card.name);
		},
		content() {
			player.draw();
		},
		subSkill: {
			global: {
				ai: {
					effect: {
						player_use(card, player, target) {
							if (typeof card !== "object") {
								return;
							}
							let num = 0,
								nohave = true;
							game.countPlayer(i => {
								if (i.hasSkill("lingce", null, null, false)) {
									nohave = false;
									if (
										i.isIn() &&
										lib.skill.lingce.filter(
											{
												card: card,
												cards: card.cards ? card.cards : [card],
											},
											i
										)
									) {
										num += get.sgnAttitude(player, i);
									}
								}
							}, true);
							if (nohave) {
								game.removeGlobalSkill("lingce_global");
							} else {
								return [1, 0.8 * num];
							}
						},
					},
				},
			},
		},
	},
	dinghan: {
		audio: 2,
		trigger: {
			target: "useCardToTarget",
			player: "addJudgeBefore",
		},
		forced: true,
		locked: false,
		filter(event, player) {
			if (event.name == "useCardToTarget" && get.type(event.card, null, false) != "trick") {
				return false;
			}
			return !player.getStorage("dinghan").includes(event.card.name);
		},
		content() {
			player.markAuto("dinghan", [trigger.card.name]);
			if (trigger.name == "addJudge") {
				trigger.cancel();
				var owner = get.owner(trigger.card);
				if (owner && owner.getCards("hej").includes(trigger.card)) {
					owner.lose(trigger.card, ui.discardPile);
				} else {
					game.cardsDiscard(trigger.card);
				}
				game.log(trigger.card, "进入了弃牌堆");
			} else {
				trigger.targets.remove(player);
				trigger.getParent().triggeredTargets2.remove(player);
				trigger.untrigger();
			}
		},
		onremove: true,
		intro: { content: "已记录牌名：$" },
		group: "dinghan_add",
		subSkill: {
			add: {
				trigger: { player: "phaseBegin" },
				direct: true,
				content() {
					"step 0";
					var dialog = [get.prompt("dinghan")];
					(list1 = player.getStorage("dinghan")),
						(list2 = lib.inpile.filter(function (i) {
							return get.type2(i, false) == "trick" && !list1.includes(i);
						}));
					if (list1.length) {
						dialog.push('<div class="text center">已记录</div>');
						dialog.push([list1, "vcard"]);
					}
					if (list2.length) {
						dialog.push('<div class="text center">未记录</div>');
						dialog.push([list2, "vcard"]);
					}
					player.chooseButton(dialog).set("ai", function (button) {
						var player = _status.event.player,
							name = button.link[2];
						if (player.getStorage("dinghan").includes(name)) {
							return -get.effect(player, { name: name }, player, player);
						} else {
							return get.effect(player, { name: name }, player, player) * (1 + player.countCards("hs", name));
						}
					});
					"step 1";
					if (result.bool) {
						player.logSkill("dinghan");
						var name = result.links[0][2];
						if (player.getStorage("dinghan").includes(name)) {
							player.unmarkAuto("dinghan", [name]);
							game.log(player, "从定汉记录中移除了", "#y" + get.translation(name));
						} else {
							player.markAuto("dinghan", [name]);
							game.log(player, "向定汉记录中添加了", "#y" + get.translation(name));
						}
						game.delayx();
					}
				},
			},
		},
	},
	dulie: {
		audio: 2,
		trigger: { target: "useCardToTarget" },
		forced: true,
		logTarget: "player",
		filter(event, player) {
			return event.card.name == "sha" && event.player.hp > player.hp;
		},
		content() {
			"step 0";
			player.judge(function (result) {
				if (get.suit(result) == "heart") {
					return 2;
				}
				return -1;
			}).judge2 = function (result) {
				return result.bool;
			};
			"step 1";
			if (result.bool) {
				trigger.targets.remove(player);
				trigger.getParent().triggeredTargets2.remove(player);
				trigger.untrigger();
			}
		},
		ai: {
			effect: {
				target_use(card, player, target, current, isLink) {
					if (card.name == "sha" && !isLink && player.hp > target.hp) {
						return 0.5;
					}
				},
			},
		},
		marktext: "围",
		intro: {
			name: "破围(围)",
			name2: "围",
			content: "mark",
		},
	},
	tspowei: {
		audio: 3,
		dutySkill: true,
		derivation: "shenzhu",
		group: ["tspowei_init", "tspowei_move", "tspowei_achieve", "tspowei_fail", "tspowei_use", "tspowei_remove"],
		subSkill: {
			remove: {
				audio: "tspowei3.mp3",
				trigger: { global: "damageEnd" },
				filter(event, player) {
					return event.player && event.player.isIn() && event.player.hasMark("dulie");
				},
				forced: true,
				logTarget: "player",
				content() {
					trigger.player.removeMark("dulie", trigger.player.countMark("dulie"));
				},
			},
			use: {
				audio: "tspowei3.mp3",
				trigger: { global: "phaseBegin" },
				direct: true,
				filter(event, player) {
					return event.player != player && event.player.hasMark("dulie") && (player.countCards("h") > 0 || (player.hp >= event.player.hp && event.player.countCards("h") > 0));
				},
				content() {
					"step 0";
					var list = [],
						target = trigger.player,
						choiceList = ["弃置一张牌并对其造成1点伤害", "获得其一张手牌"];
					event.target = target;
					if (
						player.hasCard(function (card) {
							return lib.filter.cardDiscardable(card, player, "tspowei_use");
						}, "h")
					) {
						list.push("选项一");
					} else {
						choiceList[0] = '<span style="opacity:0.5">' + choiceList[0] + "</span>";
					}
					if (player.hp >= target.hp && target.countCards("h") > 0) {
						list.push("选项二");
					} else {
						choiceList[1] = '<span style="opacity:0.5">' + choiceList[1] + "</span>";
					}
					player
						.chooseControl(list, "cancel2")
						.set("prompt", get.prompt("tspowei", target))
						.set("choiceList", choiceList)
						.set("ai", function () {
							var evt = _status.event.getParent();
							if (
								evt.player.hasCard(function (card) {
									return lib.filter.cardDiscardable(card, evt.player, "tspowei_use") && get.value(card, evt.player) < 7;
								}, "h") &&
								get.damageEffect(evt.target, evt.player, evt.player) > 0
							) {
								return "选项一";
							}
							if (evt.player.hp >= evt.target.hp && evt.target.countCards("h") > 0 && get.attitude(evt.player, evt.target) <= 0 && !evt.target.hasSkillTag("noh")) {
								return "选项二";
							}
							return "cancel2";
						});
					"step 1";
					if (result.control != "cancel2") {
						if (result.control == "选项二") {
							player.logSkill("tspowei_use", target);
							player.gainPlayerCard(target, "h", true);
							event.goto(3);
						}
					} else {
						event.finish();
					}
					"step 2";
					player.chooseToDiscard("h", true).logSkill = ["tspowei_use", target];
					if (get.mode() != "identity" || player.identity != "nei") {
						player.addExpose(0.2);
					}
					target.damage();
					"step 3";
					player.addTempSkill("tspowei_inRange");
				},
				ai: { expose: 0.2 },
			},
			inRange: {
				charlotte: true,
				mod: {
					inRangeOf(from, to) {
						if (from == _status.currentPhase) {
							return true;
						}
					},
				},
			},
			init: {
				audio: "tspowei3.mp3",
				trigger: {
					global: "phaseBefore",
					player: "enterGame",
				},
				forced: true,
				filter(event, player) {
					return event.name != "phase" || game.phaseNumber == 0;
				},
				logTarget(event, player) {
					return game.filterPlayer(current => current != player && !current.hasMark("dulie"));
				},
				content() {
					var list = game.filterPlayer(current => current != player && !current.hasMark("dulie")).sortBySeat();
					for (var i of list) {
						i.addMark("dulie", 1, false);
					}
				},
			},
			move: {
				audio: "tspowei3.mp3",
				trigger: { player: "phaseBegin" },
				forced: true,
				filter(event, player) {
					return game.hasPlayer(current => current != player && current.hasMark("dulie"));
				},
				content() {
					var list = game.filterPlayer(current => current != player && current.hasMark("dulie")).sortBySeat();
					var map = {};
					for (var i of list) {
						var num = i.countMark("dulie");
						i.removeMark("dulie", num);
						map[i.playerid] = num;
					}
					for (var i of list) {
						var next = i.next;
						if (next == player) {
							next = next.next;
						}
						next.addMark("dulie", map[i.playerid]);
					}
				},
			},
			achieve: {
				audio: "tspowei1.mp3",
				trigger: { player: "phaseBegin" },
				forced: true,
				skillAnimation: true,
				animationColor: "metal",
				filter(event, player) {
					return !game.hasPlayer(function (current) {
						return current.hasMark("dulie");
					});
				},
				content() {
					game.log(player, "成功完成使命");
					player.awakenSkill("tspowei");
					player.addSkills("shenzhu");
				},
			},
			fail: {
				audio: "tspowei2.mp3",
				trigger: { player: "dying" },
				forced: true,
				content() {
					"step 0";
					game.log(player, "使命失败");
					player.awakenSkill("tspowei");
					if (player.hp < 1) {
						player.recover(1 - player.hp);
					}
					"step 1";
					var num = player.countCards("e");
					if (num > 0) {
						player.chooseToDiscard("e", true, num);
					}
				},
			},
		},
	},
	shenzhu: {
		audio: 2,
		trigger: { player: "useCardAfter" },
		forced: true,
		filter(event, player) {
			return event.card.name == "sha" && event.card.isCard && event.cards.length == 1;
		},
		content() {
			"step 0";
			player
				.chooseControl()
				.set("choiceList", ["摸一张牌，且本回合使用【杀】的次数上限+1", "摸三张牌，且本回合不能再使用【杀】"])
				.set("ai", () => (_status.event.player.hasSha() ? 0 : 1));
			"step 1";
			if (result.index == 0) {
				player.draw();
				player.addTempSkill("shenzhu_more");
				player.addMark("shenzhu_more", 1, false);
			} else {
				player.draw(3);
				player.addTempSkill("shenzhu_less");
			}
		},
		subSkill: {
			more: {
				charlotte: true,
				onremove: true,
				mod: {
					cardUsable(card, player, num) {
						if (card.name == "sha") {
							return num + player.countMark("shenzhu_more");
						}
					},
				},
			},
			less: {
				charlotte: true,
				mod: {
					cardEnabled(card) {
						if (card.name == "sha") {
							return false;
						}
					},
				},
			},
		},
	},
	dangmo: {
		audio: 2,
		trigger: { player: "useCard2" },
		direct: true,
		filter(event, player) {
			if (event.card.name != "sha" || player.hp <= 1) {
				return false;
			}
			var evt = event.getParent("phaseUse");
			return (
				evt &&
				evt.player == player &&
				player.getHistory("useCard", function (evtx) {
					return evtx.card.name == "sha" && evtx.getParent("phaseUse") == evt;
				})[0] == event &&
				game.hasPlayer(function (current) {
					return !event.targets.includes(current) && lib.filter.filterTarget(event.card, player, current);
				})
			);
		},
		content() {
			"step 0";
			var num = Math.min(
				player.hp - 1,
				game.countPlayer(function (current) {
					return !trigger.targets.includes(current) && lib.filter.filterTarget(trigger.card, player, current);
				})
			);
			player
				.chooseTarget(get.prompt("dangmo"), "为" + get.translation(trigger.card) + "增加至多" + get.translation(num) + "个目标", [1, num], function (card, player, target) {
					var evt = _status.event.getTrigger();
					return !evt.targets.includes(target) && lib.filter.filterTarget(evt.card, player, target);
				})
				.set("ai", function (target) {
					var evt = _status.event.getTrigger(),
						eff = get.effect(target, evt.card, evt.player, evt.player);
					if (player.hasSkill("tspowei") && target.hasMark("dulie")) {
						return 4 * eff;
					}
					return eff;
				});
			"step 1";
			if (result.bool) {
				if (player != game.me && !player.isOnline()) {
					game.delayx();
				}
				event.targets = result.targets;
			} else {
				event.finish();
			}
			"step 2";
			player.logSkill("dangmo", targets);
			trigger.targets.addArray(targets);
		},
	},
	reshuishi: {
		audio: "shuishi",
		enable: "phaseUse",
		usable: 1,
		frequent: true,
		filter(event, player) {
			return player.maxHp < 10;
		},
		content() {
			"step 0";
			event.cards = [];
			event.suits = [];
			"step 1";
			player
				.judge(function (result) {
					var evt = _status.event.getParent("reshuishi");
					if (evt && evt.suits && evt.suits.includes(get.suit(result))) {
						return 0;
					}
					return 1;
				})
				.set("callback", lib.skill.reshuishi.callback).judge2 = function (result) {
				return result.bool ? true : false;
			};
			"step 2";
			var cards = cards.filterInD();
			if (cards.length) {
				player
					.chooseTarget("将" + get.translation(cards) + "交给一名角色", true)
					.set("ai", function (target) {
						var player = _status.event.player,
							att = get.attitude(player, target);
						if (att <= 0) {
							return att;
						}
						if (target.countCards("h") + _status.event.num >= _status.event.max) {
							att /= 3;
						}
						if (target.hasSkillTag("nogain")) {
							att /= 10;
						}
						return att;
					})
					.set("num", cards.length)
					.set(
						"max",
						game.filterPlayer().reduce((num, i) => {
							return Math.max(num, i.countCards("h"));
						}, 0)
					);
			} else {
				event.finish();
			}
			"step 3";
			if (result.bool) {
				var target = result.targets[0];
				event.target = target;
				player.line(target, "green");
				target.gain(cards, "gain2").giver = player;
			} else {
				event.finish();
			}
			"step 4";
			if (target.isMaxHandcard()) {
				player.loseMaxHp();
			}
		},
		callback() {
			"step 0";
			var evt = event.getParent(2);
			event.getParent().orderingCards.remove(event.judgeResult.card);
			evt.cards.push(event.judgeResult.card);
			if (event.getParent().result.bool && player.maxHp < 10) {
				evt.suits.push(event.getParent().result.suit);
				player.gainMaxHp();
				player.chooseBool("是否继续发动【慧识】？").set("frequentSkill", "reshuishi");
			} else {
				event._result = { bool: false };
			}
			"step 1";
			if (result.bool) {
				event.getParent(2).redo();
			}
		},
		ai: {
			order: 9,
			result: {
				player: 1,
			},
		},
	},
	shuishi: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return player.maxHp < 10;
		},
		filterTarget: true,
		content() {
			"step 0";
			target.draw();
			"step 1";
			if (!result || !Array.isArray(result) || result.length != 1 || get.itemtype(result[0]) != "card") {
				event.finish();
				return;
			}
			var suit = get.suit(result[0]),
				hs = target.getCards("h");
			for (var i of hs) {
				if (i != result[0] && get.suit(i, target) == suit) {
					player.loseMaxHp();
					target.showHandcards();
					event.finish();
					return;
				}
			}
			player.gainMaxHp();
			"step 2";
			if (player.maxHp < 10) {
				player.chooseBool("是否继续发动【慧识】？");
			} else {
				event.finish();
			}
			"step 3";
			if (result.bool) {
				event.goto(0);
			}
		},
		ai: {
			order: 0.5,
			result: {
				target: 0.2,
				player(player, target) {
					var list = [],
						hs = target.getCards("h");
					for (var i of hs) {
						list.add(get.suit(i, target));
					}
					if (list.length == 0) {
						return 0;
					}
					if (list.length == 1) {
						return player.maxHp > 2 ? 0 : -2;
					}
					if (list.length == 2) {
						return player.maxHp > 3 ? 0 : -2;
					}
					return -2;
				},
			},
		},
	},
	stianyi: {
		audio: 2,
		trigger: { player: "phaseZhunbeiBegin" },
		forced: true,
		juexingji: true,
		skillAnimation: true,
		animationColor: "gray",
		filter(event, player) {
			return !game.hasPlayer(function (current) {
				return current.getAllHistory("damage").length == 0;
			});
		},
		content() {
			"step 0";
			player.awakenSkill(event.name);
			player.gainMaxHp(2);
			player.recover();
			"step 1";
			player.chooseTarget(true, "令一名角色获得技能〖佐幸〗").set("ai", function (target) {
				return get.attitude(_status.event.player, target);
			});
			"step 2";
			if (result.bool) {
				var target = result.targets[0];
				player.line(target, "green");
				target.storage.zuoxing = player;
				target.addSkills("zuoxing");
			}
		},
		derivation: "zuoxing",
	},
	zuoxing: {
		audio: 3,
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			var target = player.storage.zuoxing;
			if (!target || !target.isIn() || target.maxHp < 2) {
				return false;
			}
			for (var i of lib.inpile) {
				if (get.type(i) == "trick" && event.filterCard({ name: i, isCard: true }, player, event)) {
					return true;
				}
			}
			return false;
		},
		chooseButton: {
			dialog(event, player) {
				var list = [];
				for (var i of lib.inpile) {
					if (get.type(i) == "trick" && event.filterCard({ name: i, isCard: true }, player, event)) {
						list.push(["锦囊", "", i]);
					}
				}
				return ui.create.dialog("佐幸", [list, "vcard"]);
			},
			check(button) {
				return _status.event.player.getUseValue({ name: button.link[2], isCard: true });
			},
			backup(links, player) {
				return {
					viewAs: {
						name: links[0][2],
						isCard: true,
					},
					filterCard: () => false,
					selectCard: -1,
					popname: true,
					log: false,
					precontent() {
						player.logSkill("zuoxing");
						var target = player.storage.zuoxing;
						target.loseMaxHp();
					},
				};
			},
			prompt(links, player) {
				return "请选择" + get.translation(links[0][2]) + "的目标";
			},
		},
		ai: { order: 1, result: { player: 1 } },
	},
	resghuishi: {
		audio: "sghuishi",
		inherit: "sghuishi",
		filterTarget: true,
		prompt() {
			var player = _status.event.player;
			if (player.maxHp >= game.players.length) {
				return "选择一名角色。若其拥有未发动过的觉醒技，则你解除其中一个觉醒技的发动限制；否则其摸四张牌。然后你减2点体力上限。";
			}
			return "令一名角色摸四张牌，然后你减2点体力上限。";
		},
		content() {
			"step 0";
			player.awakenSkill(event.name);
			var list = target.getSkills(null, false, false).filter(function (skill) {
				var info = lib.skill[skill];
				return info && info.juexingji && !target.awakenedSkills.includes(skill);
			});
			if (player.maxHp >= game.players.length && list.length > 0) {
				if (list.length == 1) {
					event._result = { control: list[0] };
				} else {
					player.chooseControl(list).set("prompt", "选择一个觉醒技，令" + get.translation(target) + "可无视条件发动该技能");
				}
			} else {
				target.draw(4);
				event.goto(2);
			}
			"step 1";
			target.storage.resghuishi_mark = result.control;
			target.markSkill("resghuishi_mark");
			var info = lib.skill[result.control];
			if (info.filter && !info.charlotte && !info.resghuishi_filter) {
				info.resghuishi_filter = info.filter;
				info.filter = function (event, player) {
					if (player.storage.resghuishi_mark) {
						return true;
					}
					return this.resghuishi_filter.apply(this, arguments);
				};
			}
			"step 2";
			player.loseMaxHp(2);
		},
		intro: { content: "未发动" },
		ai: {
			order: 0.1,
			expose: 0.2,
			result: {
				target(player, target) {
					if ((target != player && player.hasUnknown()) || player.maxHp < (player.getDamagedHp() > 1 ? 5 : 6)) {
						return 0;
					}
					if (
						target == player &&
						player.hasSkill("resghuishi") &&
						game.hasPlayer(function (current) {
							return current.getAllHistory("damage").length == 0;
						})
					) {
						return 4;
					}
					var list = target.getSkills(null, false, false).filter(function (skill) {
						var info = lib.skill[skill];
						return info && info.juexingji && !target.awakenedSkills.includes(skill);
					});
					if (list.length || target.hasJudge("lebu") || target.hasSkillTag("nogain")) {
						return 0;
					}
					return 4;
				},
			},
		},
		subSkill: { mark: { intro: { content: "发动【$】时无视条件" } } },
	},
	sghuishi: {
		audio: 2,
		enable: "phaseUse",
		limited: true,
		skillAnimation: true,
		animationColor: "water",
		filterTarget: lib.filter.notMe,
		content() {
			"step 0";
			player.awakenSkill(event.name);
			var list = target.getSkills(null, false, false).filter(function (skill) {
				var info = lib.skill[skill];
				return info && info.juexingji;
			});
			if (list.length) {
				target.addMark("sghuishi", 1, false);
				for (var i of list) {
					var info = lib.skill[i];
					if (info.filter && !info.charlotte && !info.sghuishi_filter) {
						info.sghuishi_filter = info.filter;
						info.filter = function (event, player) {
							if (player.hasMark("sghuishi")) {
								return true;
							}
							return this.sghuishi_filter.apply(this, arguments);
						};
					}
				}
			} else {
				target.draw(4);
			}
			player.loseMaxHp(2);
		},
		intro: { content: "发动非Charlotte觉醒技时无视条件" },
		ai: {
			order: 0.1,
			expose: 0.2,
			result: {
				target(player, target) {
					if (player.hasUnknown() || player.maxHp < 5) {
						return 0;
					}
					var list = target.getSkills(null, false, false).filter(function (skill) {
						var info = lib.skill[skill];
						return info && info.juexingji;
					});
					if (list.length || target.hasJudge("lebu") || target.hasSkillTag("nogain")) {
						return 0;
					}
					return 4;
				},
			},
		},
	},
	zhanjiang: {
		trigger: { player: "phaseZhunbeiBegin" },
		filter(event, player) {
			var players = game.filterPlayer();
			for (var i = 0; i < players.length; i++) {
				if (players[i] != player && players[i].getEquips("qinggang").length > 0) {
					return true;
				}
			}
		},
		content() {
			var players = game.filterPlayer();
			for (var i = 0; i < players.length; i++) {
				if (players[i] != player) {
					var e = players[i].getEquips("qinggang");
					if (e.length > 0) {
						player.line(players[i], "green");
						player.gain(e, players[i], "give", "bySelf");
					}
				}
			}
		},
	},
	boss_juejing: {
		audio: "juejing",
		audioname2: {
			dc_zhaoyun: "dcjuejing",
		},
		trigger: { player: "phaseDrawBefore" },
		forced: true,
		content() {
			trigger.cancel();
		},
		ai: {
			noh: true,
			nogain: true,
		},
		group: "boss_juejing2",
	},
	boss_juejing2: {
		audio: "juejing",
		sourceSkill: "boss_juejing",
		audioname2: {
			dc_zhaoyun: "dcjuejing",
		},
		mod: {
			aiOrder(player, card, num) {
				if (num > 0) {
					return num;
				}
				if (card.name === "zhuge" && player.getCardUsable("sha", true) < 6) {
					return 1;
				}
			},
			aiValue(player, card, num) {
				if (card.name === "zhuge") {
					return 60 / (1 + player.getCardUsable("sha", true));
				}
			},
			aiUseful(player, card, num) {
				if (card.name === "zhuge") {
					return 60 / (1 + player.getCardUsable("sha", true));
				}
			},
		},
		trigger: {
			player: "loseAfter",
			global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"],
		},
		forced: true,
		filter(event, player) {
			if (event.name == "gain" && event.player == player) {
				return player.countCards("h") > 4;
			}
			var evt = event.getl(player);
			if (!evt || !evt.hs || evt.hs.length == 0 || player.countCards("h") >= 4) {
				return false;
			}
			var evt = event;
			for (var i = 0; i < 4; i++) {
				evt = evt.getParent("boss_juejing2");
				if (evt.name != "boss_juejing2") {
					return true;
				}
			}
			return false;
		},
		content() {
			var num = 4 - player.countCards("h");
			if (num > 0) {
				player.draw(num);
			} else {
				player.chooseToDiscard("h", true, -num);
			}
		},
	},
	dcjuejing: { audio: 2 },
	meihun: {
		audio: 2,
		trigger: {
			player: "phaseJieshuBegin",
			target: "useCardToTargeted",
		},
		direct: true,
		filter(event, player) {
			if (event.name != "phaseJieshu" && event.card.name != "sha") {
				return false;
			}
			return game.hasPlayer(function (current) {
				return current != player && current.countCards("h");
			});
		},
		content() {
			"step 0";
			player
				.chooseTarget(get.prompt2("meihun"), function (card, player, target) {
					return target != player && target.countCards("h") > 0;
				})
				.set("ai", function (target) {
					var player = _status.event.player;
					var att = get.attitude(player, target);
					if (att > 0) {
						return 0;
					}
					return 0.1 - att / target.countCards("h");
				});
			"step 1";
			if (result.bool) {
				var target = result.targets[0];
				player.logSkill("meihun", target);
				event.target = target;
				player
					.chooseControl(lib.suit)
					.set("prompt", "请选择一种花色")
					.set("ai", function () {
						return lib.suit.randomGet();
					});
			} else {
				event.finish();
			}
			"step 2";
			var suit = result.control;
			player.chat(get.translation(suit + 2));
			game.log(player, "选择了", "#y" + get.translation(suit + 2));
			if (target.countCards("h", { suit: suit })) {
				target
					.chooseCard("h", "交给" + get.translation(player) + "一张" + get.translation(suit) + "花色的手牌", true, function (card, player) {
						return get.suit(card, player) == _status.event.suit;
					})
					.set("suit", suit);
			} else {
				player.discardPlayerCard(target, true, "h", "visible");
				event.finish();
			}
			"step 3";
			if (result.bool && result.cards && result.cards.length) {
				target.give(result.cards, player, "give");
			}
		},
	},
	//Connect Mode support after Angel Beats! -2nd beat-
	huoxin: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			if (game.countPlayer() < 3) {
				return false;
			}
			for (var i of lib.suit) {
				if (player.countCards("h", { suit: i }) > 1) {
					return true;
				}
			}
			return false;
		},
		complexCard: true,
		position: "h",
		filterCard(card, player) {
			if (!ui.selected.cards.length) {
				var suit = get.suit(card);
				return (
					player.countCards("h", function (card2) {
						return card != card2 && get.suit(card2, player) == suit;
					}) > 0
				);
			}
			return get.suit(card, player) == get.suit(ui.selected.cards[0], player);
		},
		selectCard: 2,
		selectTarget: 2,
		filterTarget: lib.filter.notMe,
		multitarget: true,
		multiline: true,
		delay: false,
		discard: false,
		lose: false,
		check(card) {
			return 6 - get.value(card);
		},
		targetprompt: ["拼点发起人", "拼点目标"],
		content() {
			"step 0";
			var list = [];
			for (var i = 0; i < targets.length; i++) {
				list.push([targets[i], cards[i]]);
			}
			game.loseAsync({
				gain_list: list,
				player: player,
				cards: cards,
				giver: player,
				animate: "giveAuto",
			}).setContent("gaincardMultiple");
			"step 1";
			game.delayx();
			if (targets[0].canCompare(targets[1])) {
				targets[0].chooseToCompare(targets[1]);
			} else {
				event.finish();
			}
			"step 2";
			if (result.winner !== targets[0]) {
				targets[0].addMark("huoxin", 1);
			}
			if (result.winner !== targets[1]) {
				targets[1].addMark("huoxin", 1);
			}
		},
		marktext: "魅",
		intro: {
			name: "魅惑",
			name2: "魅惑",
			content: "mark",
		},
		group: "huoxin_control",
		ai: {
			order: 1,
			result: {
				target(player, target) {
					if (target.hasMark("huoxin")) {
						return -2;
					}
					return -1;
				},
			},
		},
	},
	huoxin_control: {
		audio: "huoxin",
		forced: true,
		trigger: { global: "phaseBeginStart" },
		sourceSkill: "huoxin",
		filter(event, player) {
			return player != event.player && !event.player._trueMe && event.player.countMark("huoxin") > 1;
		},
		logTarget: "player",
		skillAnimation: true,
		animationColor: "key",
		content() {
			trigger.player.removeMark("huoxin", trigger.player.countMark("huoxin"));
			trigger.player._trueMe = player;
			game.addGlobalSkill("autoswap");
			if (trigger.player == game.me) {
				game.notMe = true;
				if (!_status.auto) {
					ui.click.auto();
				}
			}
			trigger.player.addSkill("huoxin2");
		},
	},
	huoxin2: {
		trigger: {
			player: ["phaseAfter", "dieAfter"],
			global: "phaseBeforeStart",
		},
		lastDo: true,
		charlotte: true,
		forceDie: true,
		forced: true,
		silent: true,
		sourceSkill: "huoxin",
		content() {
			player.removeSkill("huoxin2");
		},
		onremove(player) {
			if (player == game.me) {
				if (!game.notMe) {
					game.swapPlayerAuto(player._trueMe);
				} else {
					delete game.notMe;
				}
				if (_status.auto) {
					ui.click.auto();
				}
			}
			delete player._trueMe;
		},
	},
	caopi_xingdong: {
		audio: true,
		subSkill: {
			mark: {
				mark: true,
				marktext: "令",
				intro: {
					content: "跳过下个回合的判定阶段和摸牌阶段",
				},
			},
		},
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return player.countCards("h", lib.skill.caopi_xingdong.filterCard) > 0;
		},
		filterCard(card) {
			return card.name == "sha" || get.type(card) == "trick";
		},
		check(card) {
			return 1;
		},
		filterTarget: lib.filter.notMe,
		discard: false,
		lose: false,
		delay: 0,
		content() {
			"step 0";
			player.give(cards, target);
			"step 1";
			if (!target.getCards("h").includes(cards[0])) {
				event._result = { bool: false };
			} else {
				target.chooseUseTarget(
					cards[0],
					game.filterPlayer(function (current) {
						return current != player;
					}),
					"请使用得到的牌，或者跳过下回合的判定阶段和摸牌阶段"
				);
			}
			"step 2";
			if (result.bool) {
				game.asyncDraw([player, target]);
			} else {
				target.addTempSkill("caopi_xingdong_mark", "phaseJudgeSkipped");
				target.skip("phaseJudge");
				target.skip("phaseDraw");
				event.finish();
			}
			"step 3";
			game.delay();
		},
		ai: {
			order: 12,
			result: {
				target(player, target) {
					var card = ui.selected.cards[0];
					if (target.hasSkill("pingkou")) {
						return 1;
					}
					if (!card) {
						return 0;
					}
					var info = get.info(card);
					if (info.selectTarget == -1) {
						var eff = 0;
						game.countPlayer(function (current) {
							if (current != player && target.canUse(card, current)) {
								eff += get.effect(current, card, target, target) > 0;
							}
						});
						if (eff > 0 || get.value(card) < 3) {
							return eff;
						}
						return 0;
					} else if (
						game.hasPlayer(function (current) {
							return current != player && target.canUse(card, current) && get.effect(current, card, target, target) > 0;
						})
					) {
						return 1.5;
					} else if (get.value(card) < 3) {
						return -1;
					}
					return 0;
				},
			},
		},
	},
	shenfu: {
		audio: 2,
		trigger: { player: "phaseEnd" },
		direct: true,
		content() {
			"step 0";
			event.logged = false;
			event.targets = [];
			event.goto(player.countCards("h") % 2 == 1 ? 1 : 4);
			"step 1";
			player
				.chooseTarget(get.prompt("shenfu"), "对一名其他角色造成1点雷属性伤害", function (card, player, target) {
					return target != player && !_status.event.getParent().targets.includes(target);
				})
				.set("ai", function (target) {
					var player = _status.event.player;
					return get.damageEffect(target, player, player, "thunder") * (target.hp == 1 ? 2 : 1);
				});
			"step 2";
			if (result.bool) {
				var target = result.targets[0];
				event.target = target;
				if (!event.logged) {
					event.logged = true;
					player.logSkill("shenfu", target, "thunder");
				} else {
					player.line(target, "thunder");
				}
				event.targets.push(target);
				target.damage("thunder");
			} else {
				event.finish();
			}
			"step 3";
			if (
				target.getHistory("damage", function (evt) {
					return evt.getParent("shenfu") == event && evt._dyinged;
				}).length
			) {
				event.goto(1);
			} else {
				event.finish();
			}
			"step 4";
			player
				.chooseTarget(get.prompt("shenfu"), "令一名角色摸一张牌或弃置其一张手牌", function (card, player, target) {
					return !_status.event.getParent().targets.includes(target);
				})
				.set("ai", function (target) {
					var att = get.attitude(_status.event.player, target);
					var delta = target.hp - target.countCards("h");
					if (Math.abs(delta) == 1 && get.sgn(delta) == get.sgn(att)) {
						return 3 * Math.abs(att);
					}
					if (att > 0 || target.countCards("h") > 0) {
						return Math.abs(att);
					}
					return 0;
				});
			"step 5";
			if (result.bool) {
				var target = result.targets[0];
				event.target = target;
				if (!event.logged) {
					event.logged = true;
					player.logSkill("shenfu", target);
				} else {
					player.line(target, "green");
				}
				event.targets.push(target);
				if (target.countCards("h") == 0) {
					event._result = { index: 0 };
				} else {
					player
						.chooseControl("摸一张牌", "弃置一张手牌")
						.set("prompt", "选择一项令" + get.translation(target) + "执行…")
						.set("goon", get.attitude(player, target) > 0 ? 0 : 1)
						.set("ai", () => _status.event.goon);
				}
				//else player.discardPlayerCard(target,'h','弃置'+get.translation(target)+'一张手牌，或点【取消】令其摸一张牌。');
			} else {
				event.finish();
			}
			"step 6";
			if (result.index == 0) {
				target.draw();
			} else {
				target.chooseToDiscard("h", true);
			}
			"step 7";
			if (target.hp == target.countCards("h")) {
				event.goto(4);
			}
		},
		ai: { expose: 0.25 },
	},
	qixian: {
		mod: {
			maxHandcardBase(player, num) {
				return 7;
			},
		},
	},
	chuyuan: {
		audio: 2,
		trigger: { global: "damageEnd" },
		filter(event, player) {
			return event.player.isIn() && player.getExpansions("chuyuan").length < player.maxHp;
		},
		logTarget: "player",
		locked: false,
		content() {
			"step 0";
			trigger.player.draw();
			"step 1";
			if (!trigger.player.countCards("h")) {
				event.finish();
			} else {
				trigger.player.chooseCard("h", true, "选择一张牌置于" + get.translation(player) + "的武将牌上作为「储」");
			}
			"step 2";
			player.addToExpansion(result.cards, trigger.player, "give").gaintag.add("chuyuan");
		},
		intro: {
			content: "expansion",
			markcount: "expansion",
		},
		onremove(player, skill) {
			var cards = player.getExpansions(skill);
			if (cards.length) {
				player.loseToDiscardpile(cards);
			}
		},
		ai: {
			notemp: true,
		},
	},
	dengji: {
		audio: 2,
		derivation: ["tianxing", "new_rejianxiong", "rerende", "rezhiheng", "olluanji", "caopi_xingdong"],
		trigger: { player: "phaseZhunbeiBegin" },
		forced: true,
		juexingji: true,
		skillAnimation: true,
		animationColor: "water",
		filter(event, player) {
			return player.getExpansions("chuyuan").length >= 3;
		},
		content() {
			player.awakenSkill(event.name);
			player.addSkills(["tianxing", "new_rejianxiong"]);
			player.loseMaxHp();
			player.gain(player.getExpansions("chuyuan"), "gain2", "fromStorage");
		},
		ai: {
			combo: "chuyuan",
		},
	},
	tianxing: {
		audio: 2,
		trigger: { player: "phaseZhunbeiBegin" },
		forced: true,
		juexingji: true,
		skillAnimation: true,
		animationColor: "thunder",
		filter(event, player) {
			return player.getExpansions("chuyuan").length >= 3;
		},
		content() {
			"step 0";
			player.awakenSkill(event.name);
			player.loseMaxHp();
			player.gain(player.getExpansions("chuyuan"), "gain2", "fromStorage");
			"step 1";
			player.removeSkills("chuyuan");
			player
				.chooseControl("rerende", "rezhiheng", "olluanji", "caopi_xingdong")
				.set("prompt", "选择获得一个技能")
				.set("ai", function () {
					var player = _status.event.player;
					if (!player.hasSkill("luanji") && !player.hasSkill("olluanji") && player.getUseValue({ name: "wanjian" }) > 4) {
						return "olluanji";
					}
					if (!player.hasSkill("rezhiheng")) {
						return "rezhiheng";
					}
					if (!player.hasSkill("caopi_xingdong")) {
						return "caopi_xingdong";
					}
					return "rerende";
				});
			"step 2";
			player.addSkills(result.control);
		},
		ai: {
			combo: "chuyuan",
		},
	},
	rerende_shen_caopi: { audio: 1 },
	rezhiheng_shen_caopi: { audio: 1 },
	olluanji_shen_caopi: { audio: 1 },
	olzhiti: {
		audio: "drlt_zhiti",
		global: "olzhiti2",
		mod: {
			maxHandcard(player, num) {
				if (
					game.hasPlayer(function (current) {
						return current.isDamaged();
					})
				) {
					return num + 1;
				}
			},
		},
		trigger: { player: ["phaseDrawBegin2", "phaseEnd"] },
		forced: true,
		filter(event, player) {
			var num = event.name == "phase" ? 5 : 3;
			if (
				num == 3
					? event.numFixed
					: !game.hasPlayer(function (current) {
							return current.hasEnabledSlot();
					  })
			) {
				return false;
			}
			return (
				game.countPlayer(function (current) {
					return current.isDamaged();
				}) >= num
			);
		},
		direct: true,
		content() {
			"step 0";
			if (trigger.name == "phaseDraw") {
				player.logSkill("olzhiti");
				trigger.num++;
				event.finish();
			} else {
				player
					.chooseTarget(get.prompt("olzhiti"), "废除一名角色的一个随机装备栏", function (card, player, target) {
						return target.hasEnabledSlot();
					})
					.set("ai", function (target) {
						return -get.attitude(_status.event.player, target) * (target.countCards("e") + 1);
					});
			}
			"step 1";
			if (result.bool) {
				var target = result.targets[0];
				player.logSkill("olzhiti", target);
				var list = [];
				for (var i = 1; i < 6; i++) {
					if (target.hasEnabledSlot(i)) {
						list.add(i == 3 || i == 4 ? 6 : i);
					}
				}
				var num = list.randomGet();
				if (num != 6) {
					target.disableEquip(num);
				} else {
					target.disableEquip(3, 4);
				}
			}
		},
	},
	olzhiti2: {
		mod: {
			maxHandcard(player, num) {
				if (player.isDamaged()) {
					return (
						num -
						game.countPlayer(function (current) {
							return current.hasSkill("olzhiti") && current.inRange(player);
						})
					);
				}
			},
		},
	},
	olduorui: {
		audio: "drlt_duorui",
		trigger: {
			source: "damageSource",
		},
		filter(event, player) {
			if (!player.isPhaseUsing() || event.player.isDead()) {
				return false;
			}
			for (var i in event.player.disabledSkills) {
				if (event.player.disabledSkills[i].includes("olduorui2")) {
					return false;
				}
			}
			var list = [];
			var listm = [];
			var listv = [];
			if (event.player.name1 != undefined) {
				listm = lib.character[event.player.name1][3];
			} else {
				listm = lib.character[event.player.name][3];
			}
			if (event.player.name2 != undefined) {
				listv = lib.character[event.player.name2][3];
			}
			listm = listm.concat(listv);
			var func = function (skill) {
				var info = get.info(skill);
				if (!info || info.charlotte || info.persevereSkill) {
					return false;
				}
				return true;
			};
			for (var i = 0; i < listm.length; i++) {
				if (func(listm[i])) {
					list.add(listm[i]);
				}
			}
			return list.length > 0;
		},
		check(event, player) {
			if (get.attitude(_status.event.player, event.player) >= 0) {
				return false;
			}
			if (event.getParent("phaseUse").skipped) {
				return true;
			}
			var nd = player.needsToDiscard();
			return (
				player.countCards("h", function (card) {
					return player.getUseValue(card, null, true) > 0 && (nd ? true : get.tag(card, "damage") > 0);
				}) == 0
			);
		},
		logTarget: "player",
		content() {
			"step 0";
			var list = [];
			var listm = [];
			var listv = [];
			if (trigger.player.name1 != undefined) {
				listm = lib.character[trigger.player.name1][3];
			} else {
				listm = lib.character[trigger.player.name][3];
			}
			if (trigger.player.name2 != undefined) {
				listv = lib.character[trigger.player.name2][3];
			}
			listm = listm.concat(listv);
			var func = function (skill) {
				var info = get.info(skill);
				if (!info || info.charlotte || info.persevereSkill) {
					return false;
				}
				return true;
			};
			for (var i = 0; i < listm.length; i++) {
				if (func(listm[i])) {
					list.add(listm[i]);
				}
			}
			event.skills = list;
			player.chooseControl(list).set("prompt", "选择" + get.translation(trigger.player) + "武将牌上的一个技能并令其失效");
			"step 1";
			trigger.player.disableSkill("olduorui2", result.control);
			trigger.player.addTempSkill("olduorui2", { player: "phaseAfter" });
			game.log(player, "选择了", trigger.player, "的技能", "#g【" + get.translation(result.control) + "】");
			event.getParent("phaseUse").skipped = true;
		},
	},
	olduorui2: {
		onremove(player, skill) {
			player.enableSkill(skill);
		},
		locked: true,
		mark: true,
		charlotte: true,
		intro: {
			content(storage, player, skill) {
				var list = [];
				for (var i in player.disabledSkills) {
					if (player.disabledSkills[i].includes(skill)) {
						list.push(i);
					}
				}
				if (list.length) {
					var str = "失效技能：";
					for (var i = 0; i < list.length; i++) {
						if (lib.translate[list[i] + "_info"]) {
							str += get.translation(list[i]) + "、";
						}
					}
					return str.slice(0, str.length - 1);
				}
			},
		},
	},
	wuhun2: { audio: 2 },
	new_wuhun: {
		audio: "wuhun2",
		trigger: { player: "damageEnd" },
		filter(event, player) {
			return event.source && event.source.isIn();
		},
		forced: true,
		logTarget: "source",
		content() {
			trigger.source.addMark("new_wuhun", trigger.num);
		},
		group: "new_wuhun_die",
		ai: {
			notemp: true,
			effect: {
				target: (card, player, target) => {
					if (!target.hasFriend()) {
						return;
					}
					let rec = get.tag(card, "recover"),
						damage = get.tag(card, "damage");
					if (!rec && !damage) {
						return;
					}
					if (damage && player.hasSkillTag("jueqing", false, target)) {
						return 1.7;
					}
					let die = [null, 1],
						temp;
					game.filterPlayer(i => {
						temp = i.countMark("new_wuhun");
						if (i === player && target.hp + target.hujia > 1) {
							temp++;
						}
						if (temp > die[1]) {
							die = [i, temp];
						} else if (temp === die[1]) {
							if (!die[0]) {
								die = [i, temp];
							} else if (get.attitude(target, i) < get.attitude(target, die[0])) {
								die = [i, temp];
							}
						}
					});
					if (die[0]) {
						if (damage) {
							return [1, 0, 1, (-6 * get.sgnAttitude(player, die[0])) / Math.max(1, target.hp)];
						}
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
					return game.hasPlayer(function (current) {
						return current != player && current.hasMark("new_wuhun");
					});
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
						if (current != player && current.countMark("new_wuhun") > num) {
							num = current.countMark("new_wuhun");
						}
					}
					player
						.chooseTarget(true, "请选择【武魂】的目标", "令其进行判定，若判定结果不为【桃】或【桃园结义】，则其死亡", function (card, player, target) {
							return target != player && target.countMark("new_wuhun") == _status.event.num;
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
						player.logSkill("new_wuhun_die", target);
						player.line(target, { color: [255, 255, 0] });
						game.delay(2);
					}
					"step 2";
					target.judge(function (card) {
						if (["tao", "taoyuan"].includes(card.name)) {
							return 10;
						}
						return -10;
					}).judge2 = function (result) {
						return result.bool == false ? true : false;
					};
					"step 3";
					if (!result.bool) {
						target.die();
					}
				},
			},
		},
	},
	new_guixin: {
		audio: "guixin",
		trigger: {
			player: "damageEnd",
		},
		filter(event, player) {
			return game.hasPlayer(cur => {
				return cur !== player && cur.countCards("hej") > 0;
			});
		},
		check(event, player) {
			if (player.isTurnedOver() || event.num > 1) {
				return true;
			}
			var num = game.countPlayer(function (current) {
				if (current.countCards("he") && current != player && get.attitude(player, current) <= 0) {
					return true;
				}
				if (current.countCards("j") && current != player && get.attitude(player, current) > 0) {
					return true;
				}
			});
			return num >= 2;
		},
		getIndex(event, player) {
			return event.num;
		},
		async content(event, trigger, player) {
			let targets = game.filterPlayer();
			targets.remove(player);
			targets.sort(lib.sort.seat);
			player.line(targets, "green");
			const control = await player
				.chooseControl("手牌区", "装备区", "判定区")
				.set("ai", function () {
					if (
						game.hasPlayer(function (current) {
							return current.countCards("j") && current != player && get.attitude(player, current) > 0;
						})
					) {
						return 2;
					}
					return Math.floor(Math.random() * 3);
				})
				.set("prompt", "请选择优先获得的区域")
				.forResult();
			const range = {
				手牌区: ["h", "e", "j"],
				装备区: ["e", "h", "j"],
				判定区: ["j", "h", "e"],
			}[control.control || "手牌区"];
			while (targets.length > 0) {
				const target = targets.shift();
				for (var i = 0; i < range.length; i++) {
					var cards = target.getCards(range[i]);
					if (cards.length) {
						var card = cards.randomGet();
						await player.gain(card, target, "giveAuto", "bySelf");
						break;
					}
				}
			}
			await player.turnOver();
		},
		ai: {
			maixie: true,
			maixie_hp: true,
			threaten(player, target) {
				if (target.hp == 1) {
					return 2.5;
				}
				return 1;
			},
			effect: {
				target(card, player, target) {
					if (
						!target._new_guixin_eff &&
						get.tag(card, "damage") &&
						target.hp >
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
						target._new_guixin_eff = true;
						let gain = game.countPlayer(function (current) {
							if (target == current) {
								return 0;
							}
							if (get.attitude(target, current) > 0) {
								if (current.hasCard(cardx => lib.filter.canBeGained(cardx, target, current, "new_guixin") && get.effect(current, cardx, current, current) < 0, "j")) {
									return 1.3;
								}
								return 0;
							}
							if (current.hasCard(cardx => lib.filter.canBeGained(cardx, target, current, "new_guixin") && get.effect(current, cardx, current, current) > 0, "e")) {
								return 1.1;
							}
							if (current.hasCard(cardx => lib.filter.canBeGained(cardx, target, current, "new_guixin"), "h")) {
								return 0.9;
							}
							return 0;
						});
						if (target.isTurnedOver()) {
							gain += 2.3;
						} else {
							gain -= 2.3;
						}
						delete target._new_guixin_eff;
						return [1, Math.max(0, gain)];
					}
				},
			},
		},
	},
	ol_shenfen: {
		audio: 2,
		enable: "phaseUse",
		filter(event, player) {
			return player.countMark("baonu") >= 6;
		},
		usable: 1,
		skillAnimation: true,
		animationColor: "metal",
		content() {
			"step 0";
			event.delay = false;
			player.removeMark("baonu", 6);
			event.targets = game.filterPlayer();
			event.targets.remove(player);
			event.targets.sort(lib.sort.seat);
			player.line(event.targets, "green");
			event.targets2 = event.targets.slice(0);
			event.targets3 = event.targets.slice(0);
			"step 1";
			if (event.targets2.length) {
				event.targets2.shift().damage("nocard");
				event.redo();
			}
			"step 2";
			if (event.targets.length) {
				event.current = event.targets.shift();
				if (event.current.countCards("e")) {
					event.delay = true;
				}
				event.current.discard(event.current.getCards("e")).delay = false;
			}
			"step 3";
			if (event.delay) {
				game.delay(0.5);
			}
			event.delay = false;
			if (event.targets.length) {
				event.goto(2);
			}
			"step 4";
			if (event.targets3.length) {
				var target = event.targets3.shift();
				target.chooseToDiscard(4, "h", true).delay = false;
				if (target.countCards("h")) {
					event.delay = true;
				}
			}
			"step 5";
			if (event.delay) {
				game.delay(0.5);
			}
			event.delay = false;
			if (event.targets3.length) {
				event.goto(4);
			}
			"step 6";
			player.turnOver();
		},
		ai: {
			combo: "baonu",
			order: 10,
			result: {
				player(player) {
					return game.countPlayer(function (current) {
						if (current != player) {
							return get.sgn(get.damageEffect(current, player, player));
						}
					});
				},
			},
		},
	},
	ol_wuqian: {
		audio: 2,
		enable: "phaseUse",
		derivation: "wushuang",
		filter(event, player) {
			return player.countMark("baonu") >= 2 && game.hasPlayer(target => lib.skill.ol_wuqian.filterTarget(null, player, target));
		},
		filterTarget(card, player, target) {
			return target != player && !target.hasSkill("ol_wuqian_targeted");
		},
		content() {
			player.removeMark("baonu", 2);
			player.addTempSkills("wushuang");
			player.popup("无双");
			// game.log(player,'获得了技能','#g【无双】');
			target.addTempSkill("ol_wuqian_targeted");
		},
		ai: {
			order: 9,
			result: {
				target(player, target) {
					if (
						player.countCards("hs", card => {
							if (!player.getCardUsable({ name: card.name })) {
								return false;
							}
							if (!player.canUse(card, target)) {
								return false;
							}
							var eff1 = get.effect(target, card, player, player);
							_status.baonuCheck = true;
							var eff2 = get.effect(target, card, player, player);
							delete _status.baonuCheck;
							return eff2 > Math.max(0, eff1);
						})
					) {
						return -1;
					}
					return 0;
				},
			},
			combo: "baonu",
		},
		global: "ol_wuqian_ai",
		subSkill: {
			targeted: {
				charlotte: true,
				ai: { unequip2: true },
			},
			ai: {
				ai: {
					unequip2: true,
					skillTagFilter(player) {
						if (!_status.baonuCheck) {
							return false;
						}
					},
				},
			},
		},
	},
	wumou: {
		audio: 2,
		trigger: { player: "useCard" },
		forced: true,
		filter(event) {
			return get.type(event.card) == "trick";
		},
		content() {
			"step 0";
			if (player.hasMark("baonu")) {
				player.chooseControlList(["移去一枚【暴怒】标记", "失去1点体力"], true).set("ai", function (event, player) {
					if (get.effect(player, { name: "losehp" }, player, player) >= 0) {
						return 1;
					}
					if (player.storage.baonu > 6) {
						return 0;
					}
					if (player.hp + player.num("h", "tao") > 3) {
						return 1;
					}
					return 0;
				});
			} else {
				player.loseHp();
				event.finish();
			}
			"step 1";
			if (result.index == 0) {
				player.removeMark("baonu", 1);
			} else {
				player.loseHp();
			}
		},
		ai: {
			effect: {
				player_use(card, player) {
					if (get.type(card) == "trick" && get.value(card) < 6) {
						return [0, -2];
					}
				},
			},
			neg: true,
		},
	},
	qinyin: {
		audio: 2,
		trigger: { player: "phaseDiscardEnd" },
		direct: true,
		logAudio: index => (typeof index === "number" ? "qinyin" + index + ".mp3" : 2),
		filter(event, player) {
			var cards = [];
			player.getHistory("lose", function (evt) {
				if (evt.type == "discard" && evt.getParent("phaseDiscard") == event) {
					cards.addArray(evt.cards2);
				}
			});
			return cards.length > 1;
		},
		content() {
			"step 0";
			event.forceDie = true;
			if (typeof event.count != "number") {
				// event.count=trigger.cards.length-1;
				event.count = 1;
			}
			var recover = 0,
				lose = 0,
				players = game.filterPlayer();
			for (var i = 0; i < players.length; i++) {
				if (players[i].hp < players[i].maxHp) {
					if (get.attitude(player, players[i]) > 0) {
						if (players[i].hp < 2) {
							lose--;
							recover += 0.5;
						}
						lose--;
						recover++;
					} else if (get.attitude(player, players[i]) < 0) {
						if (players[i].hp < 2) {
							lose++;
							recover -= 0.5;
						}
						lose++;
						recover--;
					}
				} else {
					if (get.attitude(player, players[i]) > 0) {
						lose--;
					} else if (get.attitude(player, players[i]) < 0) {
						lose++;
					}
				}
			}
			var prompt = get.prompt("qinyin") + "（剩余" + get.cnNumber(event.count) + "次）";
			player.chooseControl("失去体力", "回复体力", "cancel2", ui.create.dialog(get.prompt("qinyin"), "hidden")).ai = function () {
				if (lose > recover && lose > 0) {
					return 0;
				}
				if (lose < recover && recover > 0) {
					return 1;
				}
				return 2;
			};
			"step 1";
			if (result.control == "cancel2") {
				event.finish();
			} else {
				player.logSkill("qinyin", null, null, null, [result.control == "回复体力" ? 2 : 1]);
				event.bool = result.control == "回复体力";
				event.num = 0;
				event.players = game.filterPlayer();
			}
			"step 2";
			if (event.num < event.players.length) {
				var target = event.players[event.num];
				if (event.bool) {
					target.recover();
				} else {
					target.loseHp();
				}
				event.num++;
				event.redo();
			}
			"step 3";
			if (event.count > 1) {
				event.count--;
				event.goto(0);
			}
		},
		ai: {
			expose: 0.1,
			threaten: 2,
		},
	},
	lianpo: {
		audio: 2,
		audioname: ["new_simayi"],
		trigger: { global: "phaseAfter" },
		frequent: true,
		filter(event, player) {
			return player.getStat("kill") > 0;
		},
		content() {
			player.insertPhase();
		},
	},
	baonu: {
		audio: 2,
		marktext: "暴",
		trigger: {
			source: "damageSource",
			player: ["damageEnd", "enterGame"],
			global: "phaseBefore",
		},
		forced: true,
		filter(event) {
			return (event.name != "damage" && (event.name != "phase" || game.phaseNumber == 0)) || event.num > 0;
		},
		content() {
			player.addMark("baonu", trigger.name == "damage" ? trigger.num : 2);
		},
		intro: {
			name: "暴怒",
			content: "mark",
		},
		ai: {
			combo: "ol_shenfen",
			maixie: true,
			maixie_hp: true,
		},
	},
	shenfen: {
		audio: 2,
		unique: true,
		enable: "phaseUse",
		filter(event, player) {
			return player.storage.baonu >= 6;
		},
		skillAnimation: true,
		animationColor: "metal",
		limited: true,
		content() {
			"step 0";
			player.awakenSkill(event.name);
			player.storage.baonu -= 6;
			player.markSkill("baonu");
			player.syncStorage("baonu");
			event.targets = game.filterPlayer();
			event.targets.remove(player);
			event.targets.sort(lib.sort.seat);
			event.targets2 = event.targets.slice(0);
			player.line(event.targets, "green");
			"step 1";
			if (event.targets.length) {
				event.targets.shift().damage();
				event.redo();
			}
			"step 2";
			if (event.targets2.length) {
				var cur = event.targets2.shift();
				if (cur && cur.countCards("he")) {
					cur.chooseToDiscard("he", true, 4);
				}
				event.redo();
			}
		},
		ai: {
			order: 10,
			result: {
				player(player) {
					return game.countPlayer(function (current) {
						if (current != player) {
							return get.sgn(get.damageEffect(current, player, player));
						}
					});
				},
			},
			combo: "baonu",
		},
	},
	wuqian: {
		audio: 2,
		enable: "phaseUse",
		derivation: "wushuang",
		filter(event, player) {
			return player.storage.baonu >= 2 && !player.hasSkill("wushuang");
		},
		content() {
			player.storage.baonu -= 2;
			player.addTempSkill("wushuang");
		},
		ai: {
			order: 5,
			result: {
				player(player) {
					if (!player.storage.shenfen) {
						return 0;
					}
					var cards = player.getCards("h", "sha");
					if (cards.length) {
						if (
							game.hasPlayer(function (current) {
								return player.canUse("sha", current) && get.effect(current, cards[0], player, player) > 0 && current.hasShan();
							})
						) {
							return 1;
						}
					}
					return 0;
				},
			},
			combo: "baonu",
		},
	},
	renjie: {
		audio: "renjie2",
		trigger: { player: "damageEnd" },
		forced: true,
		group: "renjie2",
		filter(event) {
			return event.num > 0;
		},
		content() {
			player.addMark("renjie", trigger.num);
		},
		intro: {
			name2: "忍",
			content: "mark",
		},
		marktext: "忍",
		ai: {
			maixie: true,
			maixie_hp: true,
			combo: "jilue",
			effect: {
				target(card, player, target) {
					if ((!target.hasSkill("sbaiyin") && !target.hasSkill("jilue")) || !target.hasFriend()) {
						return;
					}
					if (player.hasSkillTag("jueqing", false, target)) {
						return [1, -2];
					}
					if (get.tag(card, "damage")) {
						if (target.hp == target.maxHp) {
							if (!target.hasSkill("jilue")) {
								return [0, 1];
							}
							return [0.7, 1];
						}
						return 0.7;
					}
				},
			},
		},
	},
	renjie2: {
		audio: 2,
		mod: {
			aiOrder: (player, card, num) => {
				if (num <= 0 || typeof card !== "object" || !player.isPhaseUsing()) {
					return num;
				}
				if (player.hasSkill("sbaiyin")) {
					if (player.countMark("renjie") < 4 && player.getUseValue(card) < Math.min(4, (player.hp * player.hp) / 4)) {
						return 0;
					}
				} else if (player.hasSkill("jilue")) {
					if (player.countMark("renjie") < 3 && player.getUseValue(card) < Math.min(1.8, 0.18 * player.hp * player.hp)) {
						return 0;
					}
				}
			},
		},
		trigger: {
			player: "loseAfter",
			global: "loseAsyncAfter",
		},
		forced: true,
		sourceSkill: "renjie",
		filter(event, player) {
			if (event.type != "discard" || event.getlx === false) {
				return false;
			}
			var evt = event.getParent("phaseDiscard"),
				evt2 = event.getl(player);
			return evt && evt2 && evt.name == "phaseDiscard" && evt.player == player && evt2.cards2 && evt2.cards2.length > 0;
		},
		content() {
			player.addMark("renjie", trigger.getl(player).cards2.length);
		},
	},
	sbaiyin: {
		skillAnimation: "epic",
		animationColor: "thunder",
		juexingji: true,
		trigger: { player: "phaseZhunbeiBegin" },
		forced: true,
		audio: 2,
		filter(event, player) {
			return player.countMark("renjie") >= 4;
		},
		content() {
			player.awakenSkill(event.name);
			player.loseMaxHp();
			player.addSkills("jilue");
		},
		derivation: ["jilue", "jilue_guicai", "jilue_fangzhu", "jilue_jizhi", "jilue_zhiheng", "jilue_wansha"],
		ai: { combo: "renjie" },
	},
	jilue: {
		audio: 2,
		group: ["jilue_guicai", "jilue_fangzhu", "jilue_wansha", "jilue_zhiheng", "jilue_jizhi"],
		ai: { combo: "renjie" },
	},
	jilue_guicai: {
		audio: 1,
		trigger: { global: "judge" },
		direct: true,
		filter(event, player) {
			return player.countCards("hes") > 0 && player.hasMark("renjie");
		},
		content() {
			"step 0";
			player.chooseCard("是否弃置一枚“忍”，并发动〖鬼才〗？", "hes", function (card) {
				var player = _status.event.player;
				var mod2 = game.checkMod(card, player, "unchanged", "cardEnabled2", player);
				if (mod2 != "unchanged") {
					return mod2;
				}
				var mod = game.checkMod(card, player, "unchanged", "cardRespondable", player);
				if (mod != "unchanged") {
					return mod;
				}
				return true;
			}).ai = function (card) {
				var trigger = _status.event.parent._trigger;
				var player = _status.event.player;
				var result = trigger.judge(card) - trigger.judge(trigger.player.judging[0]);
				var attitude = get.attitude(player, trigger.player);
				let val = get.value(card);
				if (get.subtype(card) == "equip2") {
					val /= 2;
				} else {
					val /= 4;
				}
				if (attitude == 0 || result == 0) {
					return 0;
				}
				if (attitude > 0) {
					return result - val;
				}
				return -result - val;
			};
			"step 1";
			if (result.bool) {
				player.respond(result.cards, "highlight", "jilue_guicai", "noOrdering");
			} else {
				event.finish();
			}
			"step 2";
			if (result.bool) {
				player.removeMark("renjie", 1);
				if (trigger.player.judging[0].clone) {
					trigger.player.judging[0].clone.delete();
					game.addVideo("deletenode", player, get.cardsInfo([trigger.player.judging[0].clone]));
				}
				game.cardsDiscard(trigger.player.judging[0]);
				trigger.player.judging[0] = result.cards[0];
				trigger.orderingCards.addArray(result.cards);
				game.log(trigger.player, "的判定牌改为", result.cards[0]);
				game.delay(2);
			}
		},
		ai: {
			rejudge: true,
			tag: {
				rejudge: 1,
			},
		},
	},
	jilue_fangzhu: {
		audio: 1,
		trigger: { player: "damageEnd" },
		direct: true,
		//priority:-1,
		filter(event, player) {
			return player.hasMark("renjie");
		},
		content() {
			"step 0";
			player
				.chooseTarget("是否弃置一枚“忍”，并发动【放逐】？", function (card, player, target) {
					return player != target;
				})
				.set("ai", target => {
					if (target.hasSkillTag("noturn")) {
						return 0;
					}
					var player = _status.event.player;
					var current = _status.currentPhase;
					var dis = current ? get.distance(current, target, "absolute") : 1;
					var draw = player.getDamagedHp();
					var att = get.attitude(player, target);
					if (att == 0) {
						return target.hasJudge("lebu") ? Math.random() / 3 : Math.sqrt(get.threaten(target)) / 5 + Math.random() / 2;
					}
					if (att > 0) {
						if (target.isTurnedOver()) {
							return att + draw;
						}
						if (draw < 4) {
							return -1;
						}
						if (current && target.getSeatNum() > current.getSeatNum()) {
							return att + draw / 3;
						}
						return (10 * Math.sqrt(Math.max(0.01, get.threaten(target)))) / (3.5 - draw) + dis / (2 * game.countPlayer());
					} else {
						if (target.isTurnedOver()) {
							return att - draw;
						}
						if (draw >= 5) {
							return -1;
						}
						if (current && target.getSeatNum() <= current.getSeatNum()) {
							return -att + draw / 3;
						}
						return (4.25 - draw) * 10 * Math.sqrt(Math.max(0.01, get.threaten(target))) + (2 * game.countPlayer()) / dis;
					}
				});
			"step 1";
			if (result.bool) {
				player.removeMark("renjie", 1);
				player.logSkill("jilue_fangzhu", result.targets);
				result.targets[0].draw(player.maxHp - player.hp);
				result.targets[0].turnOver();
			}
		},
	},
	jilue_wansha: {
		audio: 1,
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return player.hasMark("renjie");
		},
		content() {
			player.removeMark("renjie", 1);
			player.addTempSkill("rewansha");
		},
		ai: {
			order: () => {
				let player = _status.event.player;
				if (
					game.hasPlayer(current => {
						if (player === current || current.hp > 1 || get.attitude(player, current) >= 0) {
							return false;
						}
						return (player.inRange(current) && player.countCards("hs", "sha") && player.getCardUsable("sha")) || player.countCards("hs", card => get.name(card) !== "sha" && get.tag(card, "damage")) > 1;
					})
				) {
					return 9.2;
				}
				return 0;
			},
			result: {
				player: 1,
			},
			effect: {
				player(card, player, target) {
					if (target && player.hasSkill("rewansha") && target.hp <= 1 && get.tag(card, "damage")) {
						return [1, 0, 1.5, -1.5];
					}
				},
			},
		},
	},
	jilue_zhiheng: {
		audio: 1,
		audioname2: {},
		inherit: "rezhiheng",
		filter(event, player) {
			return player.hasMark("renjie");
		},
		prompt: "弃置一枚“忍”，然后弃置任意张牌并摸等量的牌。若弃置了所有的手牌，则可以多摸一张牌。",
		content() {
			"step 0";
			player.removeMark("renjie", 1);
			player.discard(cards);
			event.num = 1;
			var hs = player.getCards("h");
			if (!hs.length) {
				event.num = 0;
			}
			for (var i = 0; i < hs.length; i++) {
				if (!cards.includes(hs[i])) {
					event.num = 0;
					break;
				}
			}
			"step 1";
			player.draw(event.num + cards.length);
		},
		ai: {
			order(item, player) {
				if (player.hasCard(i => get.value(i) > Math.max(6, 9 - player.hp), "he")) {
					return 1;
				}
				return 10;
			},
			result: {
				player(player) {
					var num = 0;
					var cards = player.getCards("he");
					for (var i = 0; i < cards.length; i++) {
						if (get.value(cards[i]) < 6) {
							num++;
						}
					}
					if (cards.length > 2) {
						return 1;
					}
					// if (cards.length == 2 && player.storage.jilue > 1) {
					// }
					return 0;
				},
			},
			nokeep: true,
			skillTagFilter(player, tag, arg) {
				if (tag === "nokeep") {
					return player.isPhaseUsing() && !player.getStat().skill.jilue_zhiheng && player.hasCard(card => get.name(card) !== "tao", "h");
				}
			},
		},
	},
	jilue_jizhi: {
		audio: 1,
		trigger: { player: "useCard" },
		filter(event, player) {
			return get.type(event.card, "trick") == "trick" && event.card.isCard && player.hasMark("renjie");
		},
		content() {
			"step 0";
			player.removeMark("renjie", 1);
			player.draw();
			"step 1";
			event.card = result[0];
			if (get.type(event.card) == "basic") {
				player
					.chooseBool("是否弃置" + get.translation(event.card) + "并令本回合手牌上限+1？")
					.set("ai", function (evt, player) {
						return _status.currentPhase == player && player.needsToDiscard(-3) && _status.event.value < 6;
					})
					.set("value", get.value(event.card, player));
			}
			"step 2";
			if (result.bool) {
				player.discard(event.card);
				player.addTempSkill("jilue_jizhi_clear");
				player.addMark("jilue_jizhi_clear", 1, false);
			}
		},
		subSkill: {
			clear: {
				charlotte: true,
				onremove: true,
				mod: {
					maxHandcard(player, num) {
						return num + player.countMark("jilue_jizhi_clear");
					},
				},
				intro: { content: "手牌上限+#" },
			},
		},
	},
	wushen: {
		mod: {
			cardname(card, player, name) {
				if (get.suit(card) == "heart") {
					return "sha";
				}
			},
			cardnature(card, player) {
				if (get.suit(card) == "heart") {
					return false;
				}
			},
			targetInRange(card) {
				if (card.name === "sha") {
					const suit = get.suit(card);
					if (suit === "heart" || suit === "unsure") {
						return true;
					}
				}
			},
			cardUsable(card) {
				if (card.name === "sha") {
					const suit = get.suit(card);
					if (suit === "heart" || suit === "unsure") {
						return Infinity;
					}
				}
			},
		},
		audio: 2,
		trigger: { player: "useCard" },
		forced: true,
		filter(event, player) {
			return event.card.name == "sha" && get.suit(event.card) == "heart";
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
		ai: {
			effect: {
				target(card, player, target, current) {
					if (get.tag(card, "respondSha") && current < 0) {
						return 0.6;
					}
				},
			},
			directHit_ai: true,
			skillTagFilter(player, tag, arg) {
				return arg.card.name == "sha" && get.suit(arg.card) == "heart";
			},
		},
	},
	wuhun: {
		audio: "wuhun2",
		trigger: { player: "die" },
		filter(event) {
			return event.source && event.source.isIn();
		},
		forced: true,
		forceDie: true,
		skillAnimation: true,
		animationColor: "soil",
		logTarget: "source",
		content() {
			var num = trigger.source.getHp();
			if (num > 0) {
				trigger.source.loseHp(num);
			}
		},
		ai: {
			threaten(player, target) {
				if (target.hp == 1) {
					if (player.getHp() <= 0) {
						return 100;
					}
					return 0.2;
				}
				return 0.8;
			},
			effect: {
				target(card, player, target, current) {
					if (player.getHp() <= 0) {
						return;
					}
					if (!target.hasFriend()) {
						return;
					}
					if (target.hp <= 1 && get.tag(card, "damage")) {
						return [1, 0, 0, -2 * player.getHp()];
					}
				},
			},
		},
	},
	guixin: {
		audio: 2,
		trigger: { player: "damageEnd" },
		filter(event, player) {
			return game.hasPlayer(cur => {
				return cur !== player && cur.countCards("hej") > 0;
			});
		},
		check(event, player) {
			if (player.isTurnedOver() || event.num > 1) {
				return true;
			}
			var num = game.countPlayer(function (current) {
				if (current.countCards("he") && current != player && get.attitude(player, current) <= 0) {
					return true;
				}
				if (current.countCards("j") && current != player && get.attitude(player, current) > 0) {
					return true;
				}
			});
			return num >= 2;
		},
		getIndex(event, player) {
			return event.num;
		},
		async content(event, trigger, player) {
			let targets = game.filterPlayer(current => current != player).sortBySeat();
			player.line(targets, "green");
			await player.gainMultiple(targets, "hej");
			await player.turnOver();
		},
		ai: {
			maixie: true,
			maixie_hp: true,
			threaten(player, target) {
				if (target.hp == 1) {
					return 2.5;
				}
				return 0.5;
			},
			effect: {
				target(card, player, target) {
					if (
						!target._guixin_eff &&
						get.tag(card, "damage") &&
						target.hp >
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
						target._guixin_eff = true;
						let gain = game.countPlayer(function (current) {
							if (target == current) {
								return 0;
							}
							if (get.attitude(target, current) > 0) {
								if (current.hasCard(cardx => lib.filter.canBeGained(cardx, target, current, "guixin") && get.effect(current, cardx, current, current) < 0, "ej")) {
									return 1.3;
								}
								return 0;
							}
							if (current.hasCard(cardx => lib.filter.canBeGained(cardx, target, current, "guixin") && get.effect(current, cardx, current, current) > 0, "ej")) {
								return 1.1;
							}
							if (current.hasCard(cardx => lib.filter.canBeGained(cardx, target, current, "guixin"), "h")) {
								return 0.9;
							}
							return 0;
						});
						if (target.isTurnedOver()) {
							gain += 2.3;
						} else {
							gain -= 2.3;
						}
						delete target._guixin_eff;
						return [1, Math.max(0, gain)];
					}
				},
			},
		},
	},
	qixing: {
		audio: 2,
		trigger: {
			global: "phaseBefore",
			player: "enterGame",
		},
		forced: true,
		locked: false,
		filter(event, player) {
			return event.name != "phase" || game.phaseNumber == 0;
		},
		content() {
			"step 0";
			player.addToExpansion(get.cards(7), "draw").gaintag.add("qixing");
			"step 1";
			var cards = player.getExpansions("qixing");
			if (!cards.length || !player.countCards("h")) {
				event.finish();
				return;
			}
			var next = player.chooseToMove("七星：是否交换“星”和手牌？");
			next.set("list", [
				[get.translation(player) + "（你）的星", cards],
				["手牌区", player.getCards("h")],
			]);
			next.set("filterMove", function (from, to) {
				return typeof to != "number";
			});
			next.set("processAI", function (list) {
				var player = _status.event.player,
					cards = list[0][1].concat(list[1][1]).sort(function (a, b) {
						return get.useful(a) - get.useful(b);
					}),
					cards2 = cards.splice(0, player.getExpansions("qixing").length);
				return [cards2, cards];
			});
			"step 2";
			if (result.bool) {
				var pushs = result.moved[0],
					gains = result.moved[1];
				pushs.removeArray(player.getExpansions("qixing"));
				gains.removeArray(player.getCards("h"));
				if (!pushs.length || pushs.length != gains.length) {
					return;
				}
				player.addToExpansion(pushs, player, "giveAuto").gaintag.add("qixing");
				player.gain(gains, "draw");
			}
		},
		intro: {
			markcount: "expansion",
			mark(dialog, content, player) {
				var content = player.getExpansions("qixing");
				if (content && content.length) {
					if (player == game.me || player.isUnderControl()) {
						dialog.addAuto(content);
					} else {
						return "共有" + get.cnNumber(content.length) + "张星";
					}
				}
			},
			content(content, player) {
				var content = player.getExpansions("qixing");
				if (content && content.length) {
					if (player == game.me || player.isUnderControl()) {
						return get.translation(content);
					}
					return "共有" + get.cnNumber(content.length) + "张星";
				}
			},
		},
		group: ["qixing2"],
		ai: {
			notemp: true,
		},
	},
	qixing2: {
		trigger: { player: "phaseDrawAfter" },
		direct: true,
		sourceSkill: "qixing",
		filter(event, player) {
			return player.getExpansions("qixing").length > 0 && player.countCards("h") > 0;
		},
		content() {
			"step 0";
			var cards = player.getExpansions("qixing");
			if (!cards.length || !player.countCards("h")) {
				event.finish();
				return;
			}
			var next = player.chooseToMove("七星：是否交换“星”和手牌？");
			next.set("list", [
				[get.translation(player) + "（你）的星", cards],
				["手牌区", player.getCards("h")],
			]);
			next.set("filterMove", function (from, to) {
				return typeof to != "number";
			});
			next.set("processAI", function (list) {
				var player = _status.event.player,
					cards = list[0][1].concat(list[1][1]).sort(function (a, b) {
						return get.value(a) - get.value(b);
					}),
					cards2 = cards.splice(0, player.getExpansions("qixing").length);
				return [cards2, cards];
			});
			"step 1";
			if (result.bool) {
				var pushs = result.moved[0],
					gains = result.moved[1];
				pushs.removeArray(player.getExpansions("qixing"));
				gains.removeArray(player.getCards("h"));
				if (!pushs.length || pushs.length != gains.length) {
					return;
				}
				player.logSkill("qixing2");
				player.addToExpansion(pushs, player, "giveAuto").gaintag.add("qixing");
				player.gain(gains, "draw");
			}
		},
	},
	dawu: {
		trigger: { player: "phaseJieshuBegin" },
		filter(event, player) {
			return player.getExpansions("qixing").length;
		},
		audio: 2,
		async cost(event, trigger, player) {
			const {
				result: { bool, targets, links: cost_data },
			} = await player
				.chooseButtonTarget({
					createDialog: [get.prompt2(event.skill), player.getExpansions("qixing")],
					selectButton: [1, game.countPlayer()],
					filterTarget: true,
					selectTarget() {
						return ui.selected.buttons.length;
					},
					complexSelect: true,
					ai1(button) {
						const { player, allUse } = get.event();
						const targets = game.filterPlayer(target => {
							if (target.isMin() || target.hasSkill("biantian2") || target.hasSkill("dawu2")) {
								return false;
							}
							let att = get.attitude(player, target);
							if (att >= 4) {
								if (target.hp > 2 && (target.isHealthy() || target.hasSkillTag("maixie"))) {
									return false;
								}
								if (allUse || target.hp == 1) {
									return true;
								}
								if (target.hp == 2 && target.countCards("he") <= 2) {
									return true;
								}
							}
							return false;
						});
						if (ui.selected.buttons.length < targets.length) {
							return 1;
						}
						return 0;
					},
					ai2(target) {
						const { player, allUse } = get.event();
						if (target.isMin() || target.hasSkill("biantian2") || target.hasSkill("dawu2")) {
							return 0;
						}
						let att = get.attitude(player, target);
						if (att >= 4) {
							if (target.hp > 2 && (target.isHealthy() || target.hasSkillTag("maixie"))) {
								return 0;
							}
							if (allUse || target.hp == 1) {
								return att;
							}
							if (target.hp == 2 && target.countCards("he") <= 2) {
								return att * 0.7;
							}
							return 0;
						}
						return -1;
					},
				})
				.set("allUse", player.getExpansions("qixing").length >= game.countPlayer(current => get.attitude(player, current) > 4) * 2);
			event.result = {
				bool: bool,
				targets: targets?.sortBySeat(),
				cost_data: cost_data,
			};
		},
		async content(event, trigger, player) {
			const { targets, cost_data: cards } = event;
			targets.forEach(target => {
				target.addAdditionalSkill(`dawu_${player.playerid}`, "dawu2");
				target.markAuto("dawu2", [player]);
			});
			player.addTempSkill("dawu3", { player: "phaseBeginStart" });
			await player.loseToDiscardpile(cards);
		},
		ai: {
			combo: "qixing",
		},
	},
	dawu2: {
		charlotte: true,
		ai: {
			nofire: true,
			nodamage: true,
			effect: {
				target(card, player, target, current) {
					if (get.tag(card, "damage") && !get.tag(card, "thunderDamage")) {
						return "zeroplayertarget";
					}
				},
			},
		},
		intro: {
			content(storage) {
				return `共有${storage.length}枚标记`;
			},
		},
	},
	dawu3: {
		trigger: { global: "damageBegin4" },
		sourceSkill: "dawu",
		filter(event, player) {
			return !event.hasNature("thunder") && event.player.getStorage("dawu2").includes(player);
		},
		forced: true,
		charlotte: true,
		logTarget: "player",
		content() {
			trigger.cancel();
		},
		onremove(player) {
			game.countPlayer2(current => {
				if (current.getStorage("dawu2").includes(player)) {
					current.unmarkAuto("dawu2", [player]);
					current.removeAdditionalSkill(`dawu_${player.playerid}`);
				}
			}, true);
		},
	},
	kuangfeng: {
		audio: 2,
		trigger: { player: "phaseJieshuBegin" },
		filter(event, player) {
			return player.getExpansions("qixing").length;
		},
		async cost(event, trigger, player) {
			const {
				result: { bool, targets, links: cost_data },
			} = await player.chooseButtonTarget({
				createDialog: [get.prompt2(event.skill), player.getExpansions("qixing")],
				selectButton: 1,
				filterTarget: true,
				ai1(button) {
					if (
						game.hasPlayer(target => {
							return get.attitude(get.player(), target) < 0;
						})
					) {
						return 1;
					}
					return 0;
				},
				ai2(target) {
					return -get.attitude(get.player(), target);
				},
			});
			event.result = {
				bool: bool,
				targets: targets?.sortBySeat(),
				cost_data: cost_data,
			};
		},
		async content(event, trigger, player) {
			const { targets, cost_data: cards } = event;
			targets.forEach(target => {
				target.addAdditionalSkill(`kuangfeng_${player.playerid}`, "kuangfeng2");
				target.markAuto("kuangfeng2", [player]);
			});
			player.addTempSkill("kuangfeng3", { player: "phaseBeginStart" });
			await player.loseToDiscardpile(cards);
		},
		ai: {
			combo: "qixing",
		},
	},
	kuangfeng2: {
		charlotte: true,
		intro: {
			content(storage) {
				return `共有${storage.length}枚标记`;
			},
		},
		ai: {
			effect: {
				target(card, player, target, current) {
					if (get.tag(card, "fireDamage") && current < 0) {
						return 1.5;
					}
				},
			},
		},
	},
	kuangfeng3: {
		trigger: { global: "damageBegin3" },
		sourceSkill: "kuangfeng",
		filter(event, player) {
			return event.hasNature("fire") && event.player.getStorage("kuangfeng2").includes(player);
		},
		charlotte: true,
		forced: true,
		logTarget: "player",
		content() {
			trigger.num++;
		},
		onremove(player) {
			game.countPlayer2(current => {
				if (current.getStorage("kuangfeng2").includes(player)) {
					current.unmarkAuto("kuangfeng2", player);
					current.removeAdditionalSkill(`kuangfeng_${player.playerid}`);
				}
			}, true);
		},
	},
	yeyan: {
		limited: true,
		audio: 2,
		enable: "phaseUse",
		filterCard(card, player) {
			return !ui.selected.cards.some(cardx => get.suit(cardx, player) == get.suit(card, player));
		},
		selectCard: [0, 4],
		filterTarget(card, player, target) {
			var length = ui.selected.cards.length;
			return length == 0 || length == 4;
		},
		selectTarget() {
			if (ui.selected.cards.length == 4) {
				return [1, 2];
			}
			if (ui.selected.cards.length == 0) {
				return [1, 3];
			}
			game.uncheck("target");
			return [1, 3];
		},
		complexCard: true,
		complexSelect: true,
		line: "fire",
		forceDie: true,
		animationColor: "metal",
		skillAnimation: "legend",
		check(card) {
			if (!lib.skill.yeyan.getBigFire(get.event("player"))) {
				return -1;
			}
			return 1 / (get.value(card) || 0.5);
		},
		multitarget: true,
		multiline: true,
		contentBefore() {
			player.awakenSkill(event.skill);
		},
		content() {
			"step 0";
			event.num = 0;
			targets.sortBySeat();
			"step 1";
			if (cards.length == 4) {
				event.goto(2);
			} else {
				if (event.num < targets.length) {
					targets[event.num].damage("fire", 1, "nocard");
					event.num++;
				}
				if (event.num == targets.length) {
					event.finish();
				} else {
					event.redo();
				}
			}
			"step 2";
			player.loseHp(3);
			if (targets.length == 1) {
				event.goto(4);
			} else {
				player
					.chooseTarget("请选择受到2点伤害的角色", true, function (card, player, target) {
						return _status.event.targets.includes(target);
					})
					.set("ai", function (target) {
						return 1;
					})
					.set("forceDie", true)
					.set("targets", targets);
			}
			"step 3";
			if (event.num < targets.length) {
				var dnum = 1;
				if (result.bool && result.targets && targets[event.num] == result.targets[0]) {
					dnum = 2;
				}
				targets[event.num].damage("fire", dnum, "nocard");
				event.num++;
			}
			if (event.num == targets.length) {
				event.finish();
			} else {
				event.redo();
			}
			"step 4";
			player
				.chooseControl("2点", "3点")
				.set("prompt", "请选择伤害点数")
				.set("ai", function () {
					return "3点";
				})
				.set("forceDie", true);
			"step 5";
			targets[0].damage("fire", result.control == "2点" ? 2 : 3, "nocard");
		},
		ai: {
			order(item, player) {
				return lib.skill.yeyan.getBigFire(player) ? 10 : 1;
			},
			fireAttack: true,
			result: {
				target(player, target) {
					if (player.hasUnknown()) {
						return 0;
					}
					const att = get.sgn(get.attitude(player, target));
					const targets = game.filterPlayer(target => get.damageEffect(target, player, player, "fire") && (!lib.skill.yeyan.getBigFire(player) || (target.hp <= 3 && !target.hasSkillTag("filterDamage", null, { player: player }))));
					if (!targets.includes(target)) {
						return 0;
					}
					if (lib.skill.yeyan.getBigFire(player)) {
						if (ui.selected.targets.length) {
							return 0;
						}
						if (!(targets.length == 1 || (att < 0 && target.identity && target.identity.indexOf("zhu") != -1))) {
							return 0;
						}
					}
					return att * get.damageEffect(target, player, player, "fire");
				},
			},
		},
		getBigFire(player) {
			if (player.getDiscardableCards(player, "h").reduce((list, card) => list.add(get.suit(card, player)), []).length < 4) {
				return false;
			}
			const targets = game.filterPlayer(target => get.damageEffect(target, player, player, "fire") && target.hp <= 3 && !target.hasSkillTag("filterDamage", null, { player: player }));
			if (!targets.length) {
				return false;
			}
			if (targets.length == 1 || targets.some(target => get.attitude(player, target) < 0 && target.identity && target.identity.indexOf("zhu") != -1)) {
				let suits = player.getDiscardableCards(player, "h").reduce((map, card) => {
						const suit = get.suit(card, player);
						if (!map[suit]) {
							map[suit] = [];
						}
						return map;
					}, {}),
					cards = [];
				Object.keys(suits).forEach(i => {
					suits[i].addArray(player.getDiscardableCards(player, "h").filter(card => get.suit(card) == i));
					cards.add(suits[i].sort((a, b) => get.value(a) - get.value(b))[0]);
				});
				return player.hp + player.countCards("h", card => !cards.includes(card) && player.canSaveCard(card, player)) - 3 > 0;
			}
			return false;
		},
	},
	longhun: {
		audio: 4,
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
		group: ["longhun1", "longhun2", "longhun3", "longhun4"],
		ai: {
			fireAttack: true,
			skillTagFilter(player, tag) {
				switch (tag) {
					case "respondSha": {
						if (player.countCards("he", { suit: "diamond" }) < Math.max(1, player.hp)) {
							return false;
						}
						break;
					}
					case "respondShan": {
						if (player.countCards("he", { suit: "club" }) < Math.max(1, player.hp)) {
							return false;
						}
						break;
					}
					case "save": {
						if (player.countCards("he", { suit: "heart" }) < Math.max(1, player.hp)) {
							return false;
						}
						break;
					}
					default:
						return true;
				}
			},
			maixie: true,
			respondSha: true,
			respondShan: true,
			effect: {
				target(card, player, target) {
					if (get.tag(card, "recover") && target.hp >= 1) {
						return [0, 0];
					}
					if (!target.hasFriend()) {
						return;
					}
					if ((get.tag(card, "damage") == 1 || get.tag(card, "loseHp")) && target.hp > 1) {
						return [0, 1];
					}
				},
			},
			threaten(player, target) {
				if (target.hp == 1) {
					return 2;
				}
				return 0.5;
			},
		},
	},
	longhun1: {
		audio: true,
		enable: ["chooseToUse", "chooseToRespond"],
		sourceSkill: "longhun",
		prompt() {
			return "将" + get.cnNumber(Math.max(1, _status.event.player.hp)) + "张红桃牌当作桃使用";
		},
		position: "hes",
		check(card, event) {
			if (_status.event.player.hp > 1) {
				return 0;
			}
			return 10 - get.value(card);
		},
		selectCard() {
			return Math.max(1, _status.event.player.hp);
		},
		viewAs: { name: "tao" },
		viewAsFilter(player) {
			return player.countCards("hes", { suit: "heart" }) >= player.hp;
		},
		filterCard(card) {
			return get.suit(card) == "heart";
		},
	},
	longhun2: {
		audio: true,
		enable: ["chooseToUse", "chooseToRespond"],
		sourceSkill: "longhun",
		prompt() {
			return "将" + get.cnNumber(Math.max(1, _status.event.player.hp)) + "张方片当作火杀使用或打出";
		},
		position: "hes",
		check(card, event) {
			if (_status.event.player.hp > 1) {
				return 0;
			}
			return 10 - get.value(card);
		},
		selectCard() {
			return Math.max(1, _status.event.player.hp);
		},
		viewAs: { name: "sha", nature: "fire" },
		viewAsFilter(player) {
			return player.countCards("hes", { suit: "diamond" }) >= player.hp;
		},
		filterCard(card) {
			return get.suit(card) == "diamond";
		},
	},
	longhun3: {
		audio: true,
		enable: ["chooseToUse", "chooseToRespond"],
		sourceSkill: "longhun",
		prompt() {
			return "将" + get.cnNumber(Math.max(1, _status.event.player.hp)) + "张黑桃牌当作无懈可击使用";
		},
		position: "hes",
		check(card, event) {
			if (_status.event.player.hp > 1) {
				return 0;
			}
			return 7 - get.value(card);
		},
		selectCard() {
			return Math.max(1, _status.event.player.hp);
		},
		viewAs: { name: "wuxie" },
		viewAsFilter(player) {
			return player.countCards("hes", { suit: "spade" }) >= player.hp;
		},
		filterCard(card) {
			return get.suit(card) == "spade";
		},
	},
	longhun4: {
		audio: true,
		enable: ["chooseToUse", "chooseToRespond"],
		sourceSkill: "longhun",
		prompt() {
			return "将" + get.cnNumber(Math.max(1, _status.event.player.hp)) + "张梅花牌当作闪使用或打出";
		},
		position: "hes",
		check(card, event) {
			if (_status.event.player.hp > 1) {
				return 0;
			}
			return 10 - get.value(card);
		},
		selectCard() {
			return Math.max(1, _status.event.player.hp);
		},
		viewAsFilter(player) {
			return player.countCards("hes", { suit: "club" }) >= player.hp;
		},
		viewAs: { name: "shan" },
		filterCard(card) {
			return get.suit(card) == "club";
		},
	},
	juejing: {
		mod: {
			maxHandcard(player, num) {
				return 2 + num;
			},
			aiOrder(player, card, num) {
				if (num <= 0 || !player.isPhaseUsing() || !get.tag(card, "recover")) {
					return num;
				}
				if (player.needsToDiscard() > 1) {
					return num;
				}
				return 0;
			},
		},
		audio: true,
		trigger: { player: "phaseDrawBegin2" },
		//priority:-5,
		filter(event, player) {
			return !event.numFixed && player.hp < player.maxHp;
		},
		forced: true,
		content() {
			trigger.num += player.getDamagedHp();
		},
	},
	relonghun: {
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
		//技能发动时机
		enable: ["chooseToUse", "chooseToRespond"],
		//发动时提示的技能描述
		prompt: "将♦牌当做杀，♥牌当做桃，♣牌当做闪，♠牌当做无懈可击使用或打出",
		//动态的viewAs
		viewAs(cards, player) {
			if (cards.length) {
				var name = false,
					nature = null;
				//根据选择的卡牌的花色 判断要转化出的卡牌是闪还是火杀还是无懈还是桃
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
				//返回判断结果
				if (name) {
					return { name: name, nature: nature };
				}
			}
			return null;
		},
		//AI选牌思路
		check(card) {
			if (ui.selected.cards.length) {
				return 0;
			}
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
						player.getUseValue({ name: name, nature: name == "sha" ? "fire" : null }) > 0
					) {
						var temp = get.order({ name: name, nature: name == "sha" ? "fire" : null });
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
		//选牌数量
		selectCard: [1, 2],
		//确保选择第一张牌后 重新检测第二张牌的合法性 避免选择两张花色不同的牌
		complexCard: true,
		//选牌范围：手牌区和装备区和木马
		position: "hes",
		//选牌合法性判断
		filterCard(card, player, event) {
			//如果已经选了一张牌 那么第二张牌和第一张花色相同即可
			if (ui.selected.cards.length) {
				return get.suit(card, player) == get.suit(ui.selected.cards[0], player);
			}
			event = event || _status.event;
			//获取当前时机的卡牌选择限制
			var filter = event._backup.filterCard;
			//获取卡牌花色
			var name = get.suit(card, player);
			//如果这张牌是梅花并且当前时机能够使用/打出闪 那么这张牌可以选择
			if (name == "club" && filter(get.autoViewAs({ name: "shan" }, "unsure"), player, event)) {
				return true;
			}
			//如果这张牌是方片并且当前时机能够使用/打出火杀 那么这张牌可以选择
			if (name == "diamond" && filter(get.autoViewAs({ name: "sha", nature: "fire" }, "unsure"), player, event)) {
				return true;
			}
			//如果这张牌是黑桃并且当前时机能够使用/打出无懈 那么这张牌可以选择
			if (name == "spade" && filter(get.autoViewAs({ name: "wuxie" }, "unsure"), player, event)) {
				return true;
			}
			//如果这张牌是红桃并且当前时机能够使用/打出桃 那么这张牌可以选择
			if (name == "heart" && filter(get.autoViewAs({ name: "tao" }, "unsure"), player, event)) {
				return true;
			}
			//上述条件都不满足 那么就不能选择这张牌
			return false;
		},
		//判断当前时机能否发动技能
		filter(event, player) {
			//获取当前时机的卡牌选择限制
			var filter = event.filterCard;
			//如果当前时机能够使用/打出火杀并且角色有方片 那么可以发动技能
			if (filter(get.autoViewAs({ name: "sha", nature: "fire" }, "unsure"), player, event) && player.countCards("hes", { suit: "diamond" })) {
				return true;
			}
			//如果当前时机能够使用/打出闪并且角色有梅花 那么可以发动技能
			if (filter(get.autoViewAs({ name: "shan" }, "unsure"), player, event) && player.countCards("hes", { suit: "club" })) {
				return true;
			}
			//如果当前时机能够使用/打出桃并且角色有红桃 那么可以发动技能
			if (filter(get.autoViewAs({ name: "tao" }, "unsure"), player, event) && player.countCards("hes", { suit: "heart" })) {
				return true;
			}
			//如果当前时机能够使用/打出无懈可击并且角色有黑桃 那么可以发动技能
			if (filter(get.autoViewAs({ name: "wuxie" }, "unsure"), player, event) && player.countCards("hes", { suit: "spade" })) {
				return true;
			}
			return false;
		},
		ai: {
			respondSha: true,
			respondShan: true,
			//让系统知道角色“有杀”“有闪”
			skillTagFilter(player, tag) {
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
			//AI牌序
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
		//让系统知道玩家“有无懈”“有桃”
		hiddenCard(player, name) {
			if (name == "wuxie" && _status.connectMode && player.countCards("hs") > 0) {
				return true;
			}
			if (name == "wuxie") {
				return player.countCards("hes", { suit: "spade" }) > 0;
			}
			if (name == "tao") {
				return player.countCards("hes", { suit: "heart" }) > 0;
			}
		},
		group: ["relonghun_num", "relonghun_discard"],
		subSkill: {
			num: {
				trigger: { player: "useCard" },
				forced: true,
				popup: false,
				filter(event) {
					var evt = event;
					return ["sha", "tao"].includes(evt.card.name) && evt.skill == "relonghun" && evt.cards && evt.cards.length == 2;
				},
				content() {
					trigger.baseDamage++;
				},
			},
			discard: {
				trigger: { player: ["useCardAfter", "respondAfter"] },
				forced: true,
				popup: false,
				logTarget() {
					return _status.currentPhase;
				},
				autodelay(event) {
					return event.name == "respond" ? 0.5 : false;
				},
				filter(evt, player) {
					return ["shan", "wuxie"].includes(evt.card.name) && evt.skill == "relonghun" && evt.cards && evt.cards.length == 2 && _status.currentPhase && _status.currentPhase != player && _status.currentPhase.countDiscardableCards(player, "he");
				},
				content() {
					//game.log(trigger.card)
					//game.log(trigger.cards)
					player.line(_status.currentPhase, "green");
					player.discardPlayerCard(_status.currentPhase, "he", true);
				},
			},
		},
	},
	xinlonghun: {
		audio: "longhun",
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
		prompt: "将♦手牌当做火【杀】，♥手牌当做【桃】，♣手牌当做【闪】，♠手牌当做【无懈可击】使用或打出",
		viewAs(cards, player) {
			if (cards.length) {
				var name = false,
					nature = null;
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
						player.countCards("hs", function (card) {
							return (name != "sha" || get.value(card) < 5) && get.suit(card, player) == map[name];
						}) > 0 &&
						player.getUseValue({ name: name, nature: name == "sha" ? "fire" : null }) > 0
					) {
						var temp = get.order({ name: name, nature: name == "sha" ? "fire" : null });
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
		position: "hs",
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
			if (filter(get.autoViewAs({ name: "sha", nature: "fire" }, "unsure"), player, event) && player.countCards("hs", { suit: "diamond" })) {
				return true;
			}
			if (filter(get.autoViewAs({ name: "shan" }, "unsure"), player, event) && player.countCards("hs", { suit: "club" })) {
				return true;
			}
			if (filter(get.autoViewAs({ name: "tao" }, "unsure"), player, event) && player.countCards("hs", { suit: "heart" })) {
				return true;
			}
			if (filter(get.autoViewAs({ name: "wuxie" }, "unsure"), player, event) && player.countCards("hs", { suit: "spade" })) {
				return true;
			}
			return false;
		},
		logAudio(event, player) {
			return "longhun" + (4 - lib.suit.indexOf(get.suit(event.cards[0], player))) + ".mp3";
		},
		ai: {
			respondSha: true,
			respondShan: true,
			skillTagFilter(player, tag) {
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
				if (!player.countCards("hs", { suit: name })) {
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
							player.countCards("hs", function (card) {
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
			if (name == "wuxie" && _status.connectMode && player.countCards("hs") > 0) {
				return true;
			}
			if (name == "wuxie") {
				return player.countCards("hs", { suit: "spade" }) > 0;
			}
			if (name == "tao") {
				return player.countCards("hs", { suit: "heart" }) > 0;
			}
		},
	},
	xinjuejing: {
		mod: {
			maxHandcard(player, num) {
				return 2 + num;
			},
			aiOrder(player, card, num) {
				if (num <= 0 || !player.isPhaseUsing() || !get.tag(card, "recover")) {
					return num;
				}
				if (player.needsToDiscard() > 1) {
					return num;
				}
				return 0;
			},
		},
		audio: 2,
		trigger: { player: ["dying", "dyingAfter"] },
		forced: true,
		content() {
			player.draw();
		},
		ai: {
			effect: {
				target(card, player, target) {
					if (target.getHp() > 1) {
						return;
					}
					if (get.tag(card, "damage") || get.tag(card, "losehp")) {
						return [1, 1];
					}
				},
			},
		},
	},
	shelie: {
		audio: 2,
		trigger: { player: "phaseDrawBegin1" },
		filter(event, player) {
			return !event.numFixed;
		},
		content() {
			"step 0";
			trigger.changeToZero();
			event.cards = get.cards(5);
			game.cardsGotoOrdering(event.cards);
			event.videoId = lib.status.videoId++;
			game.broadcastAll(
				function (player, id, cards) {
					var str;
					if (player == game.me && !_status.auto) {
						str = "涉猎：获取花色各不相同的牌";
					} else {
						str = "涉猎";
					}
					var dialog = ui.create.dialog(str, cards);
					dialog.videoId = id;
				},
				player,
				event.videoId,
				event.cards
			);
			event.time = get.utc();
			game.addVideo("showCards", player, ["涉猎", get.cardsInfo(event.cards)]);
			game.addVideo("delay", null, 2);
			"step 1";
			var list = [];
			for (var i of cards) {
				list.add(get.suit(i, false));
			}
			var next = player.chooseButton(list.length, true);
			next.set("dialog", event.videoId);
			next.set("filterButton", function (button) {
				for (var i = 0; i < ui.selected.buttons.length; i++) {
					if (get.suit(ui.selected.buttons[i].link) == get.suit(button.link)) {
						return false;
					}
				}
				return true;
			});
			next.set("ai", function (button) {
				return get.value(button.link, _status.event.player);
			});
			"step 2";
			if (result.bool && result.links) {
				event.cards2 = result.links;
			} else {
				event.finish();
			}
			var time = 1000 - (get.utc() - event.time);
			if (time > 0) {
				game.delay(0, time);
			}
			"step 3";
			game.broadcastAll("closeDialog", event.videoId);
			var cards2 = event.cards2;
			player.gain(cards2, "log", "gain2");
		},
		ai: {
			threaten: 1.2,
		},
	},
	gongxin: {
		audio: 2,
		audioname: ["re_lvmeng"],
		audioname2: { gexuan: "gongxin_gexuan" },
		enable: "phaseUse",
		usable: 1,
		filterTarget(card, player, target) {
			return target != player && target.countCards("h");
		},
		content() {
			"step 0";
			var cards = target.getCards("h");
			var next = player.chooseToMove_new("攻心");
			next.set("list", [
				[get.translation(target) + "的手牌", cards],
				[["弃置"], ["置于牌堆顶"]],
			]);
			next.set("filterOk", moved => {
				return (
					moved[1]
						.slice()
						.concat(moved[2])
						.filter(card => get.suit(card) == "heart").length == 1
				);
			});
			next.set("filterMove", (from, to, moved) => {
				if (moved[0].includes(from.link) && moved[1].length + moved[2].length >= 1 && [1, 2].includes(to)) {
					return false;
				}
				return get.suit(from) == "heart";
			});
			next.set("processAI", list => {
				let card = list[0][1]
					.slice()
					.filter(card => {
						return get.suit(card) == "heart";
					})
					.sort((a, b) => {
						return get.value(b) - get.value(a);
					})[0];
				if (!card) {
					return false;
				}
				return [list[0][1].slice().remove(card), [card], []];
			});
			"step 1";
			if (result.bool) {
				if (result.moved[1].length) {
					target.discard(result.moved[1]);
				} else {
					player.showCards(result.moved[2], get.translation(player) + "对" + get.translation(target) + "发动了【攻心】");
					target.lose(result.moved[2], ui.cardPile, "visible", "insert");
				}
			}
		},
		ai: {
			threaten: 1.5,
			result: {
				target(player, target) {
					return -target.countCards("h");
				},
			},
			order: 10,
			expose: 0.4,
		},
	},
	nzry_longnu: {
		mark: true,
		locked: true,
		zhuanhuanji: true,
		marktext: "☯",
		intro: {
			content(storage, player, skill) {
				if (player.storage.nzry_longnu == true) {
					return "锁定技，出牌阶段开始时，你减1点体力上限并摸一张牌，然后本阶段内你的锦囊牌均视为雷杀且无使用次数限制";
				}
				return "锁定技，出牌阶段开始时，你失去1点体力并摸一张牌，然后本阶段内你的红色手牌均视为火杀且无距离限制";
			},
		},
		audio: 2,
		trigger: {
			player: "phaseUseBegin",
		},
		forced: true,
		content() {
			"step 0";
			player.changeZhuanhuanji("nzry_longnu");
			if (player.storage.nzry_longnu != true) {
				player.loseMaxHp();
			} else {
				player.loseHp();
			}
			player.draw();
			"step 1";
			if (player.storage.nzry_longnu != true) {
				player.addTempSkill("nzry_longnu_2", "phaseUseAfter");
			} else {
				player.addTempSkill("nzry_longnu_1", "phaseUseAfter");
			}
		},
		subSkill: {
			1: {
				mod: {
					cardname(card, player) {
						if (get.color(card) == "red") {
							return "sha";
						}
					},
					cardnature(card, player) {
						if (get.color(card) == "red") {
							return "fire";
						}
					},
					targetInRange(card) {
						if (get.color(card) == "red") {
							return true;
						}
					},
				},
				ai: {
					effect: {
						target(card, player, target, current) {
							if (get.tag(card, "respondSha") && current < 0) {
								return 0.6;
							}
						},
					},
					respondSha: true,
				},
			},
			2: {
				mod: {
					cardname(card, player) {
						if (["trick", "delay"].includes(lib.card[card.name].type)) {
							return "sha";
						}
					},
					cardnature(card, player) {
						if (["trick", "delay"].includes(lib.card[card.name].type)) {
							return "thunder";
						}
					},
					cardUsable(card, player) {
						if (card.name == "sha" && game.hasNature(card, "thunder")) {
							return Infinity;
						}
					},
				},
				ai: {
					effect: {
						target(card, player, target, current) {
							if (get.tag(card, "respondSha") && current < 0) {
								return 0.6;
							}
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
	nzry_jieying: {
		audio: 2,
		locked: true,
		global: "g_nzry_jieying",
		ai: {
			effect: {
				target(card) {
					if (card.name == "tiesuo") {
						return "zeroplayertarget";
					}
				},
			},
		},
		group: ["nzry_jieying_1", "nzry_jieying_2"],
		subSkill: {
			1: {
				audio: "nzry_jieying",
				trigger: {
					player: ["linkBefore", "enterGame"],
					global: "phaseBefore",
				},
				forced: true,
				filter(event, player) {
					if (event.name == "link") {
						return player.isLinked();
					}
					return (event.name != "phase" || game.phaseNumber == 0) && !player.isLinked();
				},
				content() {
					if (trigger.name != "link") {
						player.link(true);
					} else {
						trigger.cancel();
					}
				},
				ai: {
					noLink: true,
				},
			},
			2: {
				audio: "nzry_jieying",
				trigger: {
					player: "phaseJieshuBegin",
				},
				direct: true,
				filter(event, player) {
					return game.hasPlayer(function (current) {
						return current != player && !current.isLinked();
					});
				},
				content() {
					"step 0";
					player.chooseTarget(true, "请选择【结营】的目标", function (card, player, target) {
						return target != player && !target.isLinked();
					}).ai = function (target) {
						return 1 + Math.random();
					};
					"step 1";
					if (result.bool) {
						player.line(result.targets);
						player.logSkill("nzry_jieying");
						result.targets[0].link(true);
					} else {
						event.finish();
					}
				},
			},
		},
	},
	g_nzry_jieying: {
		mod: {
			maxHandcard(player, num) {
				if (
					game.countPlayer(function (current) {
						return current.hasSkill("nzry_jieying");
					}) > 0 &&
					player.isLinked()
				) {
					return num + 2;
				}
			},
		},
	},
	nzry_junlve: {
		audio: 2,
		//marktext:"军",
		intro: {
			content: "当前有#个标记",
		},
		trigger: {
			player: "damageAfter",
			source: "damageSource",
		},
		forced: true,
		content() {
			player.addMark("nzry_junlve", trigger.num);
		},
		ai: {
			combo: "nzry_cuike",
		},
	},
	nzry_cuike: {
		audio: 2,
		trigger: {
			player: "phaseUseBegin",
		},
		direct: true,
		content() {
			"step 0";
			if (player.countMark("nzry_junlve") % 2 == 1) {
				player.chooseTarget("是否发动【摧克】，对一名角色造成1点伤害？").ai = function (target) {
					return -get.attitude(player, target);
				};
			} else {
				player.chooseTarget("是否发动【摧克】，横置一名角色并弃置其区域内的一张牌？").ai = function (target) {
					return -get.attitude(player, target);
				};
			}
			"step 1";
			if (result.bool) {
				player.logSkill("nzry_cuike", result.targets);
				if (player.countMark("nzry_junlve") % 2 == 1) {
					result.targets[0].damage();
				} else {
					result.targets[0].link(true);
					player.discardPlayerCard(result.targets[0], 1, "hej", true);
				}
			}
			"step 2";
			if (player.countMark("nzry_junlve") > 7) {
				player
					.chooseBool()
					.set("ai", function () {
						return true;
					})
					.set("prompt", "是否弃置所有“军略”标记并对所有其他角色造成1点伤害？");
			} else {
				event.finish();
			}
			"step 3";
			if (result.bool) {
				var players = game.players.slice(0).sortBySeat();
				player.line(players);
				player.removeMark("nzry_junlve", player.countMark("nzry_junlve"));
				for (var i = 0; i < players.length; i++) {
					if (players[i] != player) {
						players[i].damage();
					}
				}
			}
		},
		ai: {
			notemp: true,
		},
	},
	nzry_dinghuo: {
		audio: 2,
		limited: true,
		skillAnimation: true,
		animationColor: "metal",
		enable: "phaseUse",
		filter(event, player) {
			return player.countMark("nzry_junlve") > 0;
		},
		check(event, player) {
			var num = game.countPlayer(function (current) {
				return get.attitude(player, current) < 0 && current.isLinked();
			});
			return (
				player.storage.nzry_junlve >= num &&
				num ==
					game.countPlayer(function (current) {
						return get.attitude(player, current) < 0;
					})
			);
		},
		filterTarget(card, player, target) {
			return target.isLinked();
		},
		selectTarget() {
			return [1, _status.event.player.countMark("nzry_junlve")];
		},
		multiline: true,
		multitarget: true,
		content() {
			"step 0";
			player.awakenSkill(event.name);
			player.storage.nzry_dinghuo = true;
			"step 1";
			player.removeMark("nzry_junlve", player.countMark("nzry_junlve"));
			for (var i = 0; i < targets.length; i++) {
				targets[i].discard(targets[i].getCards("e"));
			}
			player
				.chooseTarget(true, "对一名目标角色造成1点火焰伤害", function (card, player, target) {
					return _status.event.targets.includes(target);
				})
				.set("targets", targets).ai = function () {
				return 1;
			};
			"step 2";
			if (result.bool) {
				result.targets[0].damage("fire", "nocard");
			}
		},
		ai: {
			order: 1,
			fireAttack: true,
			combo: "nzry_junlve",
			result: {
				target(player, target) {
					if (target.hasSkillTag("nofire")) {
						return 0;
					}
					if (lib.config.mode == "versus") {
						return -1;
					}
					if (player.hasUnknown()) {
						return 0;
					}
					return get.damageEffect(target, player) - target.countCards("e");
				},
			},
		},
	},
	drlt_duorui: {
		audio: 2,
		init(player, skill) {
			if (!player.storage.drlt_duorui) {
				player.storage.drlt_duorui = [];
			}
		},
		trigger: {
			source: "damageSource",
		},
		filter(event, player) {
			if (player.storage.drlt_duorui.length) {
				return false;
			}
			return event.player.isIn() && _status.currentPhase == player;
		},
		check(event, player) {
			if (get.attitude(_status.event.player, event.player) >= 0) {
				return false;
			}
			if (player.hasEnabledSlot() && !player.hasEnabledSlot(5)) {
				return false;
			}
			return true;
		},
		bannedList: ["bifa", "buqu", "gzbuqu", "songci", "funan", "xinfu_guhuo", "reguhuo", "huashen", "rehuashen", "old_guhuo", "shouxi", "xinpojun", "taoluan", "xintaoluan", "xinfu_yingshi", "zhenwei", "zhengnan", "xinzhengnan"],
		logTarget: "player",
		content() {
			"step 0";
			var list = [];
			var listm = [];
			var listv = [];
			if (trigger.player.name1 != undefined) {
				listm = lib.character[trigger.player.name1][3];
			} else {
				listm = lib.character[trigger.player.name][3];
			}
			if (trigger.player.name2 != undefined) {
				listv = lib.character[trigger.player.name2][3];
			}
			listm = listm.concat(listv);
			var func = function (skill) {
				var info = get.info(skill);
				if (!info || info.charlotte || info.persevereSkill || info.hiddenSkill || info.zhuSkill || info.juexingji || info.limited || info.dutySkill || (info.unique && !info.gainable) || lib.skill.drlt_duorui.bannedList.includes(skill)) {
					return false;
				}
				return true;
			};
			for (var i = 0; i < listm.length; i++) {
				if (func(listm[i])) {
					list.add(listm[i]);
				}
			}
			event.skills = list;
			if (player.hasEnabledSlot()) {
				player.chooseToDisable().ai = function (event, player, list) {
					if (list.includes("equip5")) {
						return "equip5";
					}
					return list.randomGet();
				};
			}
			"step 1";
			if (event.skills.length > 0) {
				player.chooseButton(["请选择要获得的技能", [event.skills, "skill"]], true).set("ai", function () {
					return Math.random();
				});
			} else {
				event.finish();
			}
			"step 2";
			player.addTempSkills(result.links, { player: "dieAfter" });
			// player.popup(result.control,'thunder');
			player.storage.drlt_duorui = result.links;
			player.storage.drlt_duorui_player = trigger.player;
			trigger.player.storage.drlt_duorui = result.links;
			trigger.player.addTempSkill("drlt_duorui1", { player: "phaseAfter" });
			// game.log(player,'获得了技能','#g【'+get.translation(result.control)+'】')
		},
		group: ["duorui_clear"],
	},
	duorui_clear: {
		trigger: { global: ["phaseAfter", "dieAfter"] },
		filter(event, player) {
			if (!player.storage.drlt_duorui_player || !player.storage.drlt_duorui) {
				return false;
			}
			return player.storage.drlt_duorui_player == event.player && player.storage.drlt_duorui.length;
		},
		silent: true,
		forced: true,
		popup: false,
		content() {
			player.removeSkills(player.storage.drlt_duorui[0]);
			delete player.storage.drlt_duorui_player;
			player.storage.drlt_duorui = [];
		},
	},
	drlt_duorui1: {
		init(player, skill) {
			player.disableSkill(skill, player.storage.drlt_duorui);
		},
		onremove(player, skill) {
			player.enableSkill(skill);
		},
		locked: true,
		mark: true,
		charlotte: true,
		intro: {
			content(storage, player, skill) {
				var list = [];
				for (var i in player.disabledSkills) {
					if (player.disabledSkills[i].includes(skill)) {
						list.push(i);
					}
				}
				if (list.length) {
					var str = "失效技能：";
					for (var i = 0; i < list.length; i++) {
						if (lib.translate[list[i] + "_info"]) {
							str += get.translation(list[i]) + "、";
						}
					}
					return str.slice(0, str.length - 1);
				}
			},
		},
	},
	drlt_zhiti: {
		audio: 2,
		trigger: {
			global: ["juedouAfter", "chooseToCompareAfter", "compareMultipleAfter"],
			player: "damageEnd",
		},
		filter(event, player) {
			if (!player.hasDisabledSlot()) {
				return false;
			}
			if (event.name == "juedou") {
				if (![event.player, event.target].includes(player)) {
					return false;
				}
				if (!event.turn || event.turn === player) {
					return false;
				}
				const opposite = event.player === player ? event.target : event.player;
				return opposite?.isIn() && opposite.inRangeOf(player) && opposite.isDamaged();
			} else if (event.name == "damage") {
				const opposite = event.source;
				return opposite?.isIn() && opposite.inRangeOf(player) && opposite.isDamaged();
			} else {
				if (![event.player, event.target].includes(player)) {
					return false;
				}
				if (event.preserve) {
					return false;
				}
				let opposite;
				if (player === event.player) {
					if (event.num1 > event.num2) {
						opposite = event.target;
					} else {
						return false;
					}
				} else {
					if (event.num1 < event.num2) {
						opposite = event.player;
					} else {
						return false;
					}
				}
				return opposite?.isIn() && opposite.inRangeOf(player) && opposite.isDamaged();
			}
		},
		forced: true,
		content() {
			player.chooseToEnable();
		},
		global: "g_drlt_zhiti",
	},
	g_drlt_zhiti: {
		mod: {
			maxHandcard(player, num) {
				if (player.isDamaged()) {
					return (
						num -
						game.countPlayer(function (current) {
							return current != player && current.hasSkill("drlt_zhiti") && current.inRange(player);
						})
					);
				}
			},
		},
	},
	drlt_poxi: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		filterTarget(card, player, target) {
			return target != player && target.countCards("h") > 0;
			//return target!=player;
		},
		content() {
			"step 0";
			event.list1 = [];
			event.list2 = [];
			if (player.countCards("h") > 0) {
				var chooseButton = player.chooseButton(4, ["你的手牌", player.getCards("h"), get.translation(target.name) + "的手牌", target.getCards("h")]);
			} else {
				var chooseButton = player.chooseButton(4, [get.translation(target.name) + "的手牌", target.getCards("h")]);
			}
			chooseButton.set("target", target);
			chooseButton.set("ai", function (button) {
				var player = _status.event.player;
				var target = _status.event.target;
				var ps = [];
				var ts = [];
				for (var i = 0; i < ui.selected.buttons.length; i++) {
					var card = ui.selected.buttons[i].link;
					if (target.getCards("h").includes(card)) {
						ts.push(card);
					} else {
						ps.push(card);
					}
				}
				var card = button.link;
				var owner = get.owner(card);
				var val = get.value(card) || 1;
				if (owner == target) {
					if (ts.length > 1) {
						return 0;
					}
					if (ts.length == 0 || player.hp > 3) {
						return val;
					}
					return 2 * val;
				}
				return 7 - val;
			});
			chooseButton.set("filterButton", function (button) {
				for (var i = 0; i < ui.selected.buttons.length; i++) {
					if (get.suit(button.link) == get.suit(ui.selected.buttons[i].link)) {
						return false;
					}
				}
				return true;
			});
			"step 1";
			if (result.bool) {
				var list = result.links;
				for (var i = 0; i < list.length; i++) {
					if (get.owner(list[i]) == player) {
						event.list1.push(list[i]);
					} else {
						event.list2.push(list[i]);
					}
				}
				if (event.list1.length && event.list2.length) {
					game.loseAsync({
						lose_list: [
							[player, event.list1],
							[target, event.list2],
						],
						discarder: player,
					}).setContent("discardMultiple");
				} else if (event.list2.length) {
					target.discard(event.list2);
				} else {
					player.discard(event.list1);
				}
			}
			"step 2";
			if (event.list1.length + event.list2.length == 4) {
				if (event.list1.length == 0) {
					player.loseMaxHp();
				}
				if (event.list1.length == 1) {
					var evt = _status.event;
					for (var i = 0; i < 10; i++) {
						if (evt && evt.getParent) {
							evt = evt.getParent();
						}
						if (evt.name == "phaseUse") {
							evt.skipped = true;
							break;
						}
					}
					player.addTempSkill("drlt_poxi1", { player: "phaseAfter" });
				}
				if (event.list1.length == 3) {
					player.recover();
				}
				if (event.list1.length == 4) {
					player.draw(4);
				}
			}
		},
		ai: {
			order: 13,
			result: {
				target(target, player) {
					return -1;
				},
			},
		},
	},
	drlt_poxi1: {
		mod: {
			maxHandcard(player, num) {
				return num - 1;
			},
		},
	},
	drlt_jieying: {
		audio: 2,
		trigger: { global: "phaseDrawBegin2" },
		filter(event, player) {
			return !event.numFixed && event.player.hasMark("drlt_jieying_mark");
		},
		forced: true,
		locked: false,
		logTarget: "player",
		content() {
			trigger.num++;
		},
		global: "drlt_jieying_mark",
		group: ["drlt_jieying_1", "drlt_jieying_2", "drlt_jieying_3"],
		subSkill: {
			1: {
				audio: "drlt_jieying",
				trigger: { player: "phaseBegin" },
				filter(event, player) {
					return !game.hasPlayer(current => current.hasMark("drlt_jieying_mark"));
				},
				forced: true,
				content() {
					player.addMark("drlt_jieying_mark", 1);
				},
			},
			2: {
				audio: "drlt_jieying",
				trigger: { player: "phaseJieshuBegin" },
				filter(event, player) {
					return (
						player.hasMark("drlt_jieying_mark") &&
						game.hasPlayer(target => {
							return target != player && !target.hasMark("drlt_jieying_mark");
						})
					);
				},
				direct: true,
				content() {
					"step 0";
					player.chooseTarget(get.prompt("drlt_jieying"), "将“营”交给一名角色；其摸牌阶段多摸一张牌，出牌阶段使用【杀】的次数上限+1且手牌上限+1。该角色回合结束后，其移去“营”标记，然后你获得其所有手牌。", function (card, player, target) {
						return target != player && !target.hasMark("drlt_jieying_mark");
					}).ai = function (target) {
						let th = target.countCards("h"),
							att = get.attitude(_status.event.player, target);
						for (let i in target.skills) {
							let info = get.info(i);
							if (!info || info.shaRelated === false) {
								continue;
							}
							if (info.shaRelated || get.skillInfoTranslation(i, target).includes("【杀】")) {
								return Math.abs(att);
							}
						}
						if (att > 0) {
							if (th > 3 && target.hp > 2) {
								return 0.6 * th;
							}
						}
						if (att < 1) {
							if (target.countCards("j", { name: "lebu" })) {
								return 1 + Math.min((1.5 + th) * 0.8, target.getHandcardLimit() * 0.7);
							}
							if (!th || target.getEquip("zhangba") || target.getEquip("guanshi")) {
								return 0;
							}
							if (!target.inRange(player) || player.countCards("hs", { name: "shan" }) > 1) {
								return Math.min((1 + th) * 0.3, target.getHandcardLimit() * 0.2);
							}
						}
						return 0;
					};
					"step 1";
					if (result.bool) {
						var target = result.targets[0];
						player.line(target);
						player.logSkill("drlt_jieying", target);
						var mark = player.countMark("drlt_jieying_mark");
						player.removeMark("drlt_jieying_mark", mark);
						target.addMark("drlt_jieying_mark", mark);
					}
				},
				ai: {
					effect: {
						player(card, player, target) {
							if (get.name(card) === "lebu" && get.attitude(player, target) < 0) {
								return 1 + Math.min((target.countCards("h") + 1.5) * 0.8, target.getHandcardLimit() * 0.7);
							}
						},
					},
				},
			},
			3: {
				audio: "drlt_jieying",
				trigger: { global: "phaseEnd" },
				filter(event, player) {
					return player != event.player && event.player.hasMark("drlt_jieying_mark") && event.player.isIn();
				},
				forced: true,
				logTarget: "player",
				content() {
					if (trigger.player.countCards("h") > 0) {
						trigger.player.give(trigger.player.getCards("h"), player);
					}
					trigger.player.clearMark("drlt_jieying_mark");
				},
			},
			mark: {
				marktext: "营",
				intro: {
					name2: "营",
					content: "mark",
				},
				mod: {
					cardUsable(card, player, num) {
						if (player.hasMark("drlt_jieying_mark") && card.name == "sha") {
							return (
								num +
								game.countPlayer(function (current) {
									return current.hasSkill("drlt_jieying");
								})
							);
						}
					},
					maxHandcard(player, num) {
						if (player.hasMark("drlt_jieying_mark")) {
							return (
								num +
								game.countPlayer(function (current) {
									return current.hasSkill("drlt_jieying");
								})
							);
						}
					},
					aiOrder(player, card, num) {
						if (
							player.hasMark("drlt_jieying_mark") &&
							game.hasPlayer(current => {
								return current.hasSkill("drlt_jieying") && get.attitude(player, current) <= 0;
							})
						) {
							return Math.max(num, 0) + 1;
						}
					},
				},
				ai: {
					nokeep: true,
					skillTagFilter(player) {
						return (
							player.hasMark("drlt_jieying_mark") &&
							game.hasPlayer(current => {
								return current.hasSkill("drlt_jieying") && get.attitude(player, current) <= 0;
							})
						);
					},
				},
			},
		},
	},
};

export default skills;
