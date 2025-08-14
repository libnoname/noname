import { lib, game, ui, get, ai, _status } from "../../noname.js";

/** @type { importCharacterConfig['skill'] } */
const skills = {
	//二成
	oltousui: {
		audio: 2,
		enable: "chooseToUse",
		viewAsFilter(player) {
			return player.countCards("he");
		},
		viewAs: {
			name: "sha",
			suit: "none",
			number: null,
			isCard: true,
		},
		filterCard: true,
		selectCard: [1, Infinity],
		position: "he",
		check(card) {
			const player = get.player();
			return 4.5 + (player.hasSkill("olchuming") ? 1 : 0) - 1.5 * ui.selected.cards.length - get.value(card);
		},
		popname: true,
		ignoreMod: true,
		log: false,
		*precontent(event, map) {
			var player = map.player;
			var evt = event.getParent();
			if (evt.dialog && typeof evt.dialog == "object") {
				evt.dialog.close();
			}
			player.logSkill("oltousui");
			var cards = event.result.cards;
			player.loseToDiscardpile(cards, ui.cardPile, false, "blank").log = false;
			var shownCards = cards.filter(i => get.position(i) == "e"),
				handcardsLength = cards.length - shownCards.length;
			if (shownCards.length) {
				player.$throw(shownCards, null);
				game.log(player, "将", shownCards, "置于了牌堆底");
			}
			if (handcardsLength > 0) {
				player.$throw(handcardsLength, null);
				game.log(player, "将", get.cnNumber(handcardsLength), "张牌置于了牌堆底");
			}
			game.delayex();
			var viewAs = new lib.element.VCard({ name: event.result.card.name, isCard: true });
			event.result.card = viewAs;
			event.result.cards = [];
			event.result._apply_args = {
				shanReq: cards.length,
				oncard: () => {
					var evt = get.event();
					for (var target of game.filterPlayer(null, null, true)) {
						var id = target.playerid;
						var map = evt.customArgs;
						if (!map[id]) {
							map[id] = {};
						}
						map[id].shanRequired = evt.shanReq;
					}
				},
			};
		},
		ai: {
			order(item, player) {
				return get.order({ name: "sha" }) + 0.1;
			},
			result: { player: 1 },
			keepdu: true,
			respondSha: true,
			skillTagFilter: (player, tag, arg) => {
				if (tag == "respondSha" && arg === "respond") {
					return false;
				}
			},
		},
	},
	olchuming: {
		audio: 2,
		trigger: {
			source: "damageBegin1",
			player: "damageBegin3",
		},
		filter(event, player) {
			if (event.source === event.player) {
				return false;
			}
			if (!event.card || !event.cards || !event.cards.length) {
				return true;
			}
			let target = event[player === event.source ? "player" : "source"];
			return target && target.isIn();
		},
		forced: true,
		*content(event, map) {
			var player = map.player,
				trigger = map.trigger;
			if (!trigger.card || !trigger.cards || !trigger.cards.length) {
				trigger.num++;
				event.finish();
				return;
			} else {
				var target = trigger[trigger.source == player ? "player" : "source"];
				trigger._olchuming = true;
				target.addTempSkill("olchuming_effect");
			}
		},
		ai: {
			effect: {
				player(card, player, target) {
					if (!get.tag(card, "damage")) {
						return;
					}
					if (!lib.card[card.name] || !card.cards || !card.cards.length) {
						return [1, 0, 2, 0];
					}
					return [1, -1];
				},
				target(card, player, target) {
					if (!get.tag(card, "damage")) {
						return;
					}
					if (!lib.card[card.name] || !card.cards || !card.cards.length) {
						return 2;
					}
					return [1, -1];
				},
			},
			combo: "oltousui",
			halfneg: true,
		},
		subSkill: {
			effect: {
				charlotte: true,
				trigger: { global: "phaseEnd" },
				forced: true,
				popup: false,
				*content(event, map) {
					var player = map.player;
					var mapx = {};
					var history = player.getHistory("damage").concat(player.getHistory("sourceDamage"));
					history.forEach(evt => {
						if (!evt._olchuming) {
							return;
						}
						var target = evt[evt.source == player ? "player" : "source"];
						if (!target.isIn()) {
							return;
						}
						var cards = evt.cards.filterInD("d");
						if (!cards.length) {
							return;
						}
						if (!mapx[target.playerid]) {
							mapx[target.playerid] = [];
						}
						mapx[target.playerid].addArray(cards);
					});
					var entries = Object.entries(mapx).map(entry => {
						return [(_status.connectMode ? lib.playerOL : game.playerMap)[entry[0]], entry[1]];
					});
					if (!entries.length) {
						event.finish();
						return;
					}
					player.logSkill(
						"olchuming_effect",
						entries.map(i => i[0])
					);
					entries.sort((a, b) => lib.sort.seat(a[0], b[0]));
					for (var entry of entries) {
						var current = entry[0],
							cards = entry[1];
						var list = ["jiedao", "guohe"].filter(i => player.canUse(new lib.element.VCard({ name: i, cards: cards }), current, false));
						if (!list.length) {
							return;
						}
						var result = {};
						if (list.length == 1) {
							result = { bool: true, links: [["", "", list[0]]] };
						} else {
							result = yield player
								.chooseButton([`畜鸣：请选择要对${get.translation(current)}使用的牌`, [list, "vcard"]], true)
								.set("ai", button => {
									var player = get.player();
									return get.effect(get.event("currentTarget"), { name: button.link[2] }, player, player);
								})
								.set("currentTarget", current);
						}
						if (result.bool) {
							var card = get.autoViewAs({ name: result.links[0][2] }, cards);
							if (player.canUse(card, current, false)) {
								player.useCard(card, cards, current, false);
							}
						}
					}
				},
			},
		},
	},
	bingxin: {
		audio: 2,
		enable: "chooseToUse",
		hiddenCard(player, name) {
			if (get.type(name) == "basic" && lib.inpile.includes(name) && !player.getStorage("bingxin_count").includes(name)) {
				return true;
			}
		},
		filter(event, player) {
			if (event.type == "wuxie") {
				return false;
			}
			var hs = player.getCards("h");
			if (hs.length != Math.max(0, player.hp)) {
				return false;
			}
			if (hs.length > 1) {
				var color = get.color(hs[0], player);
				for (var i = 1; i < hs.length; i++) {
					if (get.color(hs[i], player) != color) {
						return false;
					}
				}
			}
			var storage = player.storage.bingxin_count;
			for (var i of lib.inpile) {
				if (get.type(i) != "basic") {
					continue;
				}
				if (storage && storage.includes(i)) {
					continue;
				}
				var card = { name: i, isCard: true };
				if (event.filterCard(card, player, event)) {
					return true;
				}
				if (i == "sha") {
					for (var j of lib.inpile_nature) {
						card.nature = j;
						if (event.filterCard(card, player, event)) {
							return true;
						}
					}
				}
			}
			return false;
		},
		chooseButton: {
			dialog(event, player) {
				var list = [];
				var storage = player.storage.bingxin_count;
				for (var i of lib.inpile) {
					if (get.type(i) != "basic") {
						continue;
					}
					if (storage && storage.includes(i)) {
						continue;
					}
					var card = { name: i, isCard: true };
					if (event.filterCard(card, player, event)) {
						list.push(["基本", "", i]);
					}
					if (i == "sha") {
						for (var j of lib.inpile_nature) {
							card.nature = j;
							if (event.filterCard(card, player, event)) {
								list.push(["基本", "", i, j]);
							}
						}
					}
				}
				return ui.create.dialog("冰心", [list, "vcard"], "hidden");
			},
			check(button) {
				if (button.link[2] == "shan") {
					return 3;
				}
				var player = _status.event.player;
				if (button.link[2] == "jiu") {
					if (player.getUseValue({ name: "jiu" }) <= 0) {
						return 0;
					}
					if (player.countCards("h", "sha")) {
						return player.getUseValue({ name: "jiu" });
					}
					return 0;
				}
				return player.getUseValue({ name: button.link[2], nature: button.link[3] }) / 4;
			},
			backup(links, player) {
				return {
					selectCard: -1,
					filterCard: () => false,
					viewAs: {
						name: links[0][2],
						nature: links[0][3],
						isCard: true,
					},
					log: false,
					precontent() {
						player.logSkill("bingxin");
						player.draw();
						var name = event.result.card.name;
						player.addTempSkill("bingxin_count");
						player.markAuto("bingxin_count", [name]);
					},
				};
			},
			prompt(links, player) {
				var name = links[0][2];
				var nature = links[0][3];
				return "摸一张并视为使用" + (get.translation(nature) || "") + get.translation(name);
			},
		},
		ai: {
			order: 10,
			respondShan: true,
			respondSha: true,
			skillTagFilter(player, tag, arg) {
				if (arg == "respond") {
					return false;
				}
				var hs = player.getCards("h");
				if (hs.length != Math.max(0, hs.length)) {
					return false;
				}
				if (hs.length > 1) {
					var color = get.color(hs[0], player);
					for (var i = 1; i < hs.length; i++) {
						if (get.color(hs[i], player) != color) {
							return false;
						}
					}
				}
				var storage = player.storage.bingxin_count;
				if (storage && storage.includes("s" + tag.slice(8))) {
					return false;
				}
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
		subSkill: { count: { charlotte: true, onremove: true } },
	},
	zhefu: {
		audio: 2,
		trigger: { player: ["useCardAfter", "respondAfter"] },
		filter(event, player) {
			return player != _status.currentPhase && game.hasPlayer(current => current != player && current.countCards("h"));
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt(event.skill), "令一名有手牌的其他角色弃置一张【" + get.translation(trigger.card.name) + "】，否则受到你造成的1点伤害。", (card, player, target) => {
					return target != player && target.countCards("h") > 0;
				})
				.set("ai", target => {
					const player = get.player();
					return get.damageEffect(target, player, player) / Math.sqrt(target.countCards("h"));
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const {
				targets: [target],
			} = event;
			const { name } = trigger.card;
			const bool = await target
				.chooseToDiscard("he", { name: name }, "弃置一张【" + get.translation(name) + "】或受到1点伤害")
				.set("ai", card => {
					const { player, take } = get.event();
					if (take || (get.name(card) == "tao" && !player.hasJudge("lebu"))) {
						return 0;
					}
					return 8 - get.value(card);
				})
				.set("take", get.damageEffect(target, player, target) >= 0)
				.forResultBool();
			if (!bool) {
				await target.damage();
			}
		},
	},
	yidu: {
		audio: 2,
		trigger: { player: "useCardAfter" },
		filter(event, player) {
			return (
				(event.card.name == "sha" || (get.type(event.card, null, false) == "trick" && get.tag(event.card, "damage") > 0.5)) &&
				event.targets.some(target => {
					return target.countCards("h") > 0 && !target.hasHistory("damage", evt => evt.card == event.card);
				})
			);
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt2(event.skill), (card, player, target) => {
					return get.event().targets.includes(target);
				})
				.set(
					"targets",
					trigger.targets.filter(target => {
						return target.countCards("h") > 0 && !target.hasHistory("damage", evt => evt.card == trigger.card);
					})
				)
				.set("ai", target => {
					const player = get.player();
					if (target.hasSkillTag("noh")) {
						return 0;
					}
					return -get.attitude(player, target);
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const {
				targets: [target],
			} = event;
			if (!target.countCards("h")) {
				return;
			}
			const cards = await player
				.choosePlayerCard(target, "遗毒：展示" + get.translation(target) + "的至多三张手牌", true, "h", [1, Math.min(3, target.countCards("h"))])
				.set("forceAuto", true)
				.set("ai", button => {
					if (ui.selected.buttons.length) {
						return 0;
					}
					return 1 + Math.random();
				})
				.forResultCards();
			if (!cards?.length) {
				return;
			}
			await player.showCards(cards, get.translation(player) + "对" + get.translation(target) + "发动了【遗毒】");
			const color = get.color(cards[0], target);
			if (cards.every(card => get.color(card, target) == color)) {
				await target.discard(cards, "notBySelf").set("discarder", player);
			}
		},
	},
	xinwanyi: {
		audio: "wanyi",
		trigger: { player: "useCardToTargeted" },
		filter(event, player) {
			return player != event.target && event.targets.length == 1 && (event.card.name == "sha" || get.type(event.card, null, false) == "trick") && event.target.countCards("he") > 0;
		},
		locked: false,
		logTarget: "target",
		check(event, player) {
			return get.effect(event.target, { name: "guohe_copy2" }, player, player) > 0;
		},
		prompt2: "将该角色的一张牌置于武将牌上作为“嫕”",
		content() {
			"step 0";
			event.target = trigger.target;
			player.choosePlayerCard(event.target, true, "he");
			"step 1";
			if (result.bool) {
				var cards = result.cards;
				player.addToExpansion(cards, target, "give").gaintag.add("xinwanyi");
			}
		},
		mod: {
			cardEnabled(card, player) {
				var cards = player.getExpansions("xinwanyi");
				if (cards.length) {
					var suit = get.suit(card);
					if (suit == "none") {
						return;
					}
					for (var i of cards) {
						if (get.suit(i, player) == suit) {
							return false;
						}
					}
				}
			},
			cardRespondable(card, player) {
				var cards = player.getExpansions("xinwanyi");
				if (cards.length) {
					var suit = get.suit(card);
					if (suit == "none") {
						return;
					}
					for (var i of cards) {
						if (get.suit(i, player) == suit) {
							return false;
						}
					}
				}
			},
			cardSavable(card, player) {
				var cards = player.getExpansions("xinwanyi");
				if (cards.length) {
					var suit = get.suit(card);
					if (suit == "none") {
						return;
					}
					for (var i of cards) {
						if (get.suit(i, player) == suit) {
							return false;
						}
					}
				}
			},
			cardDiscardable(card, player) {
				var cards = player.getExpansions("xinwanyi");
				if (cards.length) {
					var suit = get.suit(card);
					if (suit == "none") {
						return;
					}
					for (var i of cards) {
						if (get.suit(i, player) == suit) {
							return false;
						}
					}
				}
			},
		},
		marktext: "嫕",
		intro: {
			markcount: "expansion",
			content: "expansion",
		},
		onremove(player, skill) {
			var cards = player.getExpansions(skill);
			if (cards.length) {
				player.loseToDiscardpile(cards);
			}
		},
		group: "xinwanyi_give",
		subSkill: {
			give: {
				audio: "wanyi",
				trigger: { player: ["phaseJieshuBegin", "damageEnd"] },
				forced: true,
				locked: false,
				filter(event, player) {
					return player.getExpansions("xinwanyi").length > 0;
				},
				content() {
					"step 0";
					player.chooseTarget(true, "婉嫕：令一名角色获得一张“嫕”").set("ai", function (target) {
						return get.attitude(_status.event.player, target);
					});
					"step 1";
					if (result.bool) {
						var target = result.targets[0];
						event.target = target;
						player.line(target, "green");
						var cards = player.getExpansions("xinwanyi");
						if (cards.length == 1) {
							event._result = { bool: true, links: cards };
						} else {
							player.chooseButton(["令" + get.translation(target) + "获得一张“嫕”", cards], true);
						}
					} else {
						event.finish();
					}
					"step 2";
					if (result.bool) {
						target.gain(result.links, player, "give");
					}
				},
			},
		},
	},
	xinxuanbei: {
		audio: "xuanbei",
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return game.hasPlayer(current => lib.skill.xinxuanbei.filterTarget(null, player, current));
		},
		filterTarget(card, player, target) {
			return target != player && target.countCards("hej") > 0;
		},
		content() {
			"step 0";
			player.choosePlayerCard(target, "hej", true);
			"step 1";
			if (result.bool) {
				var card = result.cards[0];
				var cardx = get.autoViewAs({ name: "sha" }, [card]);
				if ((get.position(card) != "j" && !game.checkMod(card, target, "unchanged", "cardEnabled2", target)) || !target.canUse(cardx, player, false)) {
					event.finish();
				} else {
					var next = target.useCard(cardx, [card], player, false);
					event.card = next.card;
				}
			} else {
				event.finish();
			}
			"step 2";
			var num = 1;
			if (
				player.hasHistory("damage", function (evt) {
					return evt.card == event.card;
				})
			) {
				num++;
			}
			player.draw(num);
		},
		ai: {
			order: 7,
			result: {
				player(player, target) {
					return get.effect(target, { name: "guohe_copy" }, player, player) + get.effect(player, { name: "sha" }, target, player);
				},
			},
		},
	},
	xiongshu: {
		audio: 2,
		trigger: { global: "phaseUseBegin" },
		filter(event, player) {
			return player != event.player && event.player.countCards("h") > 0 && player.countCards("he") >= player.countMark("xiongshu_count");
		},
		logTarget: "player",
		async cost(event, trigger, player) {
			const { player: target } = trigger;
			const num = player.countMark("xiongshu_count");
			const goon = get.attitude(player, target) < 0;
			let next;
			if (num > 0) {
				next = player
					.chooseToDiscard("he", num, get.prompt(event.skill, target), "弃置" + get.cnNumber(num) + "张牌并展示其一张手牌")
					.set("goon", goon)
					.set("ai", card => {
						const { player, goon } = get.event();
						if (!goon) {
							return 0;
						}
						return 6 - player.countMark("xiongshu_count") - get.value(card);
					});
			} else {
				next = player
					.chooseBool(get.prompt(event.skill, target), "展示其一张牌")
					.set("goon", goon)
					.set("ai", () => {
						return get.event().goon;
					});
			}
			event.result = await next.forResult();
		},
		async content(event, trigger, player) {
			const { player: target } = trigger,
				{ name: skillName } = event;
			player.addTempSkill(skillName + "_count", "roundStart");
			player.addMark(skillName + "_count", 1, false);
			if (!target.countCards("h")) {
				return;
			}
			const cards = await player.choosePlayerCard(target, true, "h").forResultCards();
			if (!cards?.length) {
				return;
			}
			const [card] = cards,
				name = get.name(card),
				str = get.translation(target);
			await player.showCards(card, get.translation(player) + "对" + str + "发动了【凶竖】");
			const {
				result: { index },
			} = await player
				.chooseControl("会使用", "不会使用")
				.set("prompt", "预测：" + str + "是否会使用" + get.translation(name) + "？")
				.set(
					"choice",
					(() => {
						if (!target.hasValueTarget(card)) {
							return 1;
						}
						return Math.random() < 0.5 ? 0 : 1;
					})()
				)
				.set("ai", () => get.event().choice);
			if (typeof index != "number") {
				return;
			}
			if (Math.random() < 0.5) {
				target.storage.xiongshu_ai = name;
				target.addTempSkill("xiongshu_ai", "phaseUseAfter");
			}
			player
				.when({ global: "phaseUseEnd" })
				.filter(evt => evt == trigger)
				.step(async () => {
					if (target.hasHistory("useCard", evt => evt.card.name == name && evt.getParent("phaseUse") == trigger) == (index == 0)) {
						if (target.isIn()) {
							await target.damage();
						}
					} else {
						if (target.getCards("hej").includes(card)) {
							await player.gain(card, target, "give");
						} else if (get.position(card, true) == "d") {
							await player.gain(card, "gain2");
						}
					}
				});
		},
		ai: { expose: 0.35 },
		subSkill: {
			ai: {
				charlotte: true,
				onremove: true,
				ai: {
					effect: {
						player_use(card, player, target) {
							if (card.name == player.storage.xiongshu_ai) {
								return "zeroplayertarget";
							}
						},
					},
				},
			},
			count: {
				charlotte: true,
				onremove: true,
			},
		},
	},
	jianhui: {
		audio: 2,
		getLastPlayer(evt, player) {
			var history = player.getAllHistory("damage");
			if (!history.length) {
				return null;
			}
			var i = history.indexOf(evt);
			if (i == -1) {
				i = history.length - 1;
			} else {
				i--;
			}
			for (i; i >= 0; i--) {
				if (history[i].source) {
					return history[i].source;
				}
			}
			return null;
		},
		trigger: { player: "damageEnd" },
		forced: true,
		filter(event, player) {
			return event.source && event.source.isIn() && event.source == lib.skill.jianhui.getLastPlayer(event, player) && event.source.countCards("he") > 0;
		},
		content() {
			trigger.source.chooseToDiscard("he", true);
		},
		group: "jianhui_draw",
		subSkill: {
			draw: {
				audio: "jianhui",
				trigger: { source: "damageSource" },
				forced: true,
				logTarget: "player",
				filter(event, player) {
					return event.player == lib.skill.jianhui.getLastPlayer(event, player);
				},
				content() {
					player.draw();
				},
			},
		},
	},
	huaiyuan: {
		audio: 2,
		trigger: {
			player: "loseAfter",
			global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"],
		},
		getIndex(event, player) {
			if (!event.getl?.(player)?.hs?.length) {
				return false;
			}
			let num = 0;
			if (event.name == "lose") {
				Object.values(event.gaintag_map)
					.flat()
					.forEach(tags => {
						if (tags.includes("huaiyuanx")) {
							num++;
						}
					});
			} else {
				player.checkHistory("lose", evt => {
					if (event != evt.getParent()) {
						return;
					}
					Object.values(evt.gaintag_map)
						.flat()
						.forEach(tags => {
							if (tags.includes("huaiyuanx")) {
								num++;
							}
						});
				});
			}
			return num;
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(true, "请选择【怀远】的目标", "令一名角色执行一项：⒈其的手牌上限+1。⒉其的攻击范围+1。⒊其摸一张牌。")
				.set("ai", target => {
					const player = get.player();
					let att = get.attitude(player, target);
					if (att <= 0) {
						return 0;
					}
					if (target.hasValueTarget({ name: "sha" }, false) && !target.hasValueTarget({ name: "sha" })) {
						att *= 2.2;
					}
					if (target.needsToDiscard()) {
						att *= 1.3;
					}
					return att * Math.sqrt(Math.max(1, 4 - target.countCards("h")));
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const {
				targets: [target],
			} = event;
			player.line(target, "green");
			const str = get.translation(target);
			const { result } = await player
				.chooseControl()
				.set("choiceList", [`令${str}的手牌上限+1`, `令${str}的攻击范围+1`, `令${str}摸一张牌`])
				.set("ai", () => {
					const { player, target } = get.event();
					if (target.hasValueTarget({ name: "sha" }, false) && !target.hasValueTarget({ name: "sha" })) {
						return 1;
					}
					if (target.needsToDiscard()) {
						return 0;
					}
					return 2;
				})
				.set("target", target);
			if (result?.index == 2) {
				await target.draw();
			} else if ([0, 1].includes(result?.index)) {
				target.addSkill("huaiyuan_effect" + result.index);
				target.addMark("huaiyuan_effect" + result.index, 1, false);
				game.log(target, "的", "#g" + ["手牌上限", "攻击范围"][result.index], "+1");
				await game.delayx();
			}
		},
		group: ["huaiyuan_init", "huaiyuan_die"],
		subSkill: {
			init: {
				audio: "huaiyuan",
				trigger: {
					global: "phaseBefore",
					player: "enterGame",
				},
				forced: true,
				locked: false,
				filter(event, player) {
					return (event.name != "phase" || game.phaseNumber == 0) && player.countCards("h") > 0;
				},
				async content(event, trigger, player) {
					const hs = player.getCards("h");
					if (hs.length) {
						player.addGaintag(hs, "huaiyuanx");
					}
				},
			},
			die: {
				audio: "huaiyuan",
				trigger: { player: "die" },
				forceDie: true,
				skillAnimation: true,
				animationColor: "water",
				filter(event, player) {
					if (!game.hasPlayer(current => player != current)) {
						return false;
					}
					return player.hasMark("huaiyuan_effect0") || player.hasMark("huaiyuan_effect1");
				},
				async cost(event, trigger, player) {
					let str = "令一名其他角色",
						num1 = player.countMark("huaiyuan_effect0"),
						num2 = player.countMark("huaiyuan_effect1");
					if (num1 > 0) {
						str += "手牌上限+";
						str += num1;
						if (num2 > 0) {
							str += "且";
						}
					}
					if (num2 > 0) {
						str += "攻击范围+";
						str += num2;
					}
					event.result = await player
						.chooseTarget(lib.filter.notMe, get.prompt(event.skill), str)
						.set("forceDie", true)
						.set("ai", target => {
							const player = get.player();
							return get.attitude(player, target) + 114514;
						})
						.forResult();
				},
				async content(event, trigger, player) {
					const {
						targets: [target],
					} = event;
					const effect = "huaiyuan_effect0",
						effect1 = "huaiyuan_effect1";
					const num1 = player.countMark(effect),
						num2 = player.countMark(effect1);
					if (num1 > 0) {
						target.addSkill(effect);
						target.addMark(effect, num1, false);
					}
					if (num2 > 0) {
						target.addSkill(effect1);
						target.addMark(effect1, num2, false);
					}
					await game.delayx();
				},
			},
			effect0: {
				charlotte: true,
				onremove: true,
				mod: {
					maxHandcard(player, num) {
						return num + player.countMark("huaiyuan_effect0");
					},
				},
				marktext: "怀",
				intro: { content: "手牌上限+#" },
			},
			effect1: {
				charlotte: true,
				onremove: true,
				mod: {
					attackRange(player, num) {
						return num + player.countMark("huaiyuan_effect1");
					},
				},
				marktext: "远",
				intro: { content: "攻击范围+#" },
			},
		},
	},
	chongxin: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return player.hasCard(lib.filter.cardRecastable, "he") && game.hasPlayer(current => get.info("chongxin").filterTarget(null, player, current));
		},
		filterCard: lib.filter.cardRecastable,
		filterTarget(card, player, target) {
			return target != player && target.countCards("h");
		},
		check(card) {
			return 6 - get.value(card);
		},
		discard: false,
		lose: false,
		delay: false,
		position: "he",
		async content(event, trigger, player) {
			const { cards, target } = event;
			await player.recast(cards);
			if (!target.hasCard(lib.filter.cardRecastable, "he")) {
				return;
			}
			const { result } = await target.chooseCard("he", true, "请重铸一张牌", lib.filter.cardRecastable);
			if (result?.bool && result?.cards?.length) {
				await target.recast(result.cards);
			}
		},
		ai: {
			order: 6,
			result: {
				player: 1,
				target(player, target) {
					return 0.5 * Math.sqrt(Math.min(3, target.countCards("h")));
				},
			},
		},
	},
	dezhang: {
		audio: 2,
		trigger: { player: "phaseZhunbeiBegin" },
		derivation: "weishu",
		juexingji: true,
		forced: true,
		skillAnimation: true,
		animationColor: "thunder",
		filter(event, player) {
			return !player.hasCard(function (card) {
				return card.hasGaintag("huaiyuanx");
			}, "h");
		},
		content() {
			player.awakenSkill(event.name);
			player.loseMaxHp();
			player.addSkills("weishu");
		},
	},
	weishu: {
		audio: 2,
		trigger: { player: "gainAfter" },
		forced: true,
		filter(event, player) {
			return event.getParent().name == "draw" && event.getParent(2).name != "weishu" && event.getParent("phaseDraw").player != player;
		},
		content() {
			"step 0";
			player.chooseTarget(true, "请选择【卫戍】的目标", "令一名角色摸一张牌").set("ai", function (target) {
				return get.attitude(_status.event.player, target) * Math.sqrt(Math.max(1, 4 - target.countCards("h")));
			});
			"step 1";
			if (result.bool) {
				var target = result.targets[0];
				player.line(target, "green");
				target.draw();
			}
		},
		group: "weishu_discard",
		subSkill: {
			discard: {
				audio: "weishu",
				trigger: {
					player: "loseAfter",
					global: "loseAsyncAfter",
				},
				forced: true,
				filter(event, player) {
					return event.type == "discard" && event.getParent(3).name != "weishu_discard" && event.getParent("phaseDiscard").player != player && event.getl(player).cards2.length > 0 && game.hasPlayer(target => target != player && target.countDiscardableCards(player, "he") > 0);
				},
				content() {
					"step 0";
					player
						.chooseTarget(true, "请选择【卫戍】的目标", "弃置一名其他角色的一张牌", function (card, player, target) {
							return target != player && target.countDiscardableCards(player, "he") > 0;
						})
						.set("ai", function (target) {
							var player = _status.event.player;
							return get.effect(target, { name: "guohe_copy2" }, player, player);
						});
					"step 1";
					if (result.bool) {
						var target = result.targets[0];
						player.line(target, "green");
						player.discardPlayerCard(target, "he", true);
					}
				},
			},
		},
	},
	gaoling: {
		audio: 2,
		trigger: { player: "showCharacterAfter" },
		hiddenSkill: true,
		filter(event, player) {
			return event.toShow?.some(i => get.character(i).skills?.includes("gaoling")) && player != _status.currentPhase && game.hasPlayer(current => current.isDamaged());
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt2(event.skill), (card, player, target) => {
					return target.isDamaged();
				})
				.set("ai", target => {
					const player = get.player();
					return get.recoverEffect(target, player, player);
				})
				.forResult();
		},
		async content(event, trigger, player) {
			await event.targets[0].recover();
		},
	},
	qimei: {
		audio: 2,
		trigger: { player: "phaseZhunbeiBegin" },
		direct: true,
		preHidden: true,
		content() {
			"step 0";
			player
				.chooseTarget(get.prompt("qimei"), "选择一名其他角色并获得“齐眉”效果", lib.filter.notMe)
				.set("ai", function (target) {
					var player = _status.event.player;
					return get.attitude(player, target) / (Math.abs(player.countCards("h") + 2 - target.countCards("h")) + 1);
				})
				.setHiddenSkill("qimei");
			"step 1";
			if (result.bool) {
				var target = result.targets[0];
				player.logSkill("qimei", target);
				player.storage.qimei_draw = target;
				player.addTempSkill("qimei_draw", { player: "phaseBegin" });
				game.delayx();
			}
		},
		subSkill: {
			draw: {
				audio: "qimei",
				charlotte: true,
				forced: true,
				popup: false,
				trigger: {
					global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "loseAfter", "addToExpansionAfter"],
				},
				usable: 1,
				filter(event, player) {
					var target = player.storage.qimei_draw;
					if (!target || !target.isIn()) {
						return false;
					}
					if (player.countCards("h") != target.countCards("h")) {
						return false;
					}
					var hasChange = function (event, player) {
						var gain = 0,
							lose = 0;
						if (event.getg) {
							gain = event.getg(player).length;
						}
						if (event.getl) {
							lose = event.getl(player).hs.length;
						}
						return gain != lose;
					};
					return hasChange(event, player) || hasChange(event, target);
				},
				content() {
					"step 0";
					if (trigger.delay === false) {
						game.delayx();
					}
					"step 1";
					var target = player.storage.qimei_draw;
					player.logSkill("qimei_draw", target);
					var drawer = [];
					var hasChange = function (event, player) {
						var gain = 0,
							lose = 0;
						if (event.getg) {
							gain = event.getg(player).length;
						}
						if (event.getl) {
							lose = event.getl(player).hs.length;
						}
						return gain != lose;
					};
					if (hasChange(trigger, player)) {
						drawer.push(target);
					}
					if (hasChange(trigger, target)) {
						drawer.push(player);
					}
					if (drawer.length == 1) {
						drawer[0].draw();
					} else {
						game.asyncDraw(drawer.sortBySeat());
						game.delayex();
					}
				},
				group: "qimei_hp",
				onremove: true,
				mark: "character",
				intro: { content: "已和$组成齐眉组合" },
			},
			hp: {
				audio: "qimei",
				trigger: { global: "changeHp" },
				charlotte: true,
				forced: true,
				logTarget(event, player) {
					return player.storage.qimei_draw;
				},
				usable: 1,
				filter(event, player) {
					var target = player.storage.qimei_draw;
					if (!target || !target.isIn()) {
						return false;
					}
					if (player != event.player && target != event.player) {
						return false;
					}
					return player.hp == target.hp;
				},
				content() {
					game.delayx();
					(player == trigger.player ? player.storage.qimei_draw : player).draw();
				},
			},
		},
	},
	ybzhuiji: {
		audio: 2,
		trigger: { player: "phaseUseBegin" },
		direct: true,
		preHidden: true,
		content() {
			"step 0";
			var list = ["摸两张牌，并于出牌阶段结束时失去1点体力"];
			if (player.isDamaged()) {
				list.push("回复1点体力，并于出牌阶段结束时弃置两张牌");
			}
			player
				.chooseControl("cancel2")
				.set("choiceList", list)
				.set("prompt", get.prompt("ybzhuiji"))
				.set("ai", function () {
					var player = _status.event.player;
					if (player.isDamaged() && player.countCards("h", "tao") < player.getDamagedHp()) {
						return 1;
					}
					return "cancel2";
				})
				.setHiddenSkill("ybzhuiji");
			"step 1";
			if (result.control != "cancel2") {
				player.logSkill("ybzhuiji");
				if (result.index == 0) {
					player.draw(2);
				} else {
					player.recover();
				}
				player.addTempSkill("ybzhuiji_" + result.index, "phaseUseAfter");
			}
		},
		subSkill: {
			0: {
				audio: "ybzhuiji",
				trigger: { player: "phaseUseEnd" },
				forced: true,
				charlotte: true,
				content() {
					player.loseHp();
				},
			},
			1: {
				audio: "ybzhuiji",
				trigger: { player: "phaseUseEnd" },
				forced: true,
				charlotte: true,
				content() {
					player.chooseToDiscard("he", 2, true);
				},
			},
		},
	},
	canmou: {
		audio: 2,
		trigger: { global: "useCardToPlayer" },
		direct: true,
		filter(event, player) {
			if (!event.player.isMaxHandcard(true) || !event.isFirstTarget || get.type(event.card, null, false) != "trick") {
				return false;
			}
			var info = get.info(event.card);
			if (info.allowMultiple == false) {
				return false;
			}
			if (event.targets && !info.multitarget) {
				if (
					game.hasPlayer(function (current) {
						return !event.targets.includes(current) && lib.filter.targetEnabled2(event.card, event.player, current); //&&lib.filter.targetInRange(event.card,event.player,current);
					})
				) {
					return true;
				}
			}
			return false;
		},
		preHidden: true,
		content() {
			"step 0";
			var prompt2 = "为" + get.translation(trigger.card) + "增加一个目标";
			player
				.chooseTarget(get.prompt("canmou"), function (card, player, target) {
					var player = _status.event.source;
					return !_status.event.targets.includes(target) && lib.filter.targetEnabled2(_status.event.card, player, target); //&&lib.filter.targetInRange(_status.event.card,player,target);
				})
				.set("prompt2", prompt2)
				.set("ai", function (target) {
					var trigger = _status.event.getTrigger();
					var player = _status.event.source;
					return get.effect(target, trigger.card, player, _status.event.player);
				})
				.set("targets", trigger.targets)
				.set("card", trigger.card)
				.set("source", trigger.player)
				.setHiddenSkill(event.name);
			"step 1";
			if (result.bool) {
				if (!event.isMine() && !event.isOnline()) {
					game.delayx();
				}
				event.targets = result.targets;
			} else {
				event.finish();
			}
			"step 2";
			if (event.targets) {
				player.logSkill(event.name, event.targets);
				trigger.targets.addArray(event.targets);
				game.log(event.targets, "也成为了", trigger.card, "的目标");
			}
		},
	},
	congjian: {
		audio: 2,
		trigger: { global: "useCardToTarget" },
		logTarget: "target",
		filter(event, player) {
			return event.target != player && event.targets.length == 1 && get.type(event.card, null, false) == "trick" && event.target.isMaxHp(true) && lib.filter.targetEnabled2(event.card, event.player, player);
		},
		check(event, player) {
			return get.effect(player, event.card, event.player, player) > 0;
		},
		preHidden: true,
		content() {
			trigger.targets.push(player);
			game.log(player, "也成为了", trigger.card, "的目标");
			var next = game.createEvent("congjian_draw", false);
			next.player = player;
			event.next.remove(next);
			trigger.getParent().after.push(next);
			next.setContent(function () {
				if (
					player.hasHistory("damage", function (evt) {
						return evt.card == event.parent.card;
					})
				) {
					player.draw(2);
				}
			});
		},
	},
	wanyi: {
		audio: 2,
		enable: "phaseUse",
		filter(event, player) {
			return player.getStorage("wanyi_used").length < 4 && player.hasCard(card => get.is.yingbian(card), "hs");
		},
		chooseButton: {
			dialog(event, player) {
				var list = ["zhujinqiyuan", "chuqibuyi", "shuiyanqijunx", "dongzhuxianji"];
				list.removeArray(player.getStorage("wanyi_used"));
				return ui.create.dialog("婉嫕", [list, "vcard"], "hidden");
			},
			filter(button, player) {
				return lib.filter.filterCard({ name: button.link[2] }, player, _status.event.getParent());
			},
			check(button) {
				return _status.event.player.getUseValue({ name: button.link[2] });
			},
			backup(links) {
				return {
					audio: "wanyi",
					popname: true,
					viewAs: {
						name: links[0][2],
					},
					filterCard(card) {
						return get.is.yingbian(card);
					},
					check(card) {
						return 1 / Math.max(1, get.value(card));
					},
					position: "hs",
					onuse(links, player) {
						player.addTempSkill("wanyi_used");
						player.markAuto("wanyi_used", [links.card.name]);
					},
				};
			},
			prompt(links) {
				return "将一张应变牌当做" + get.translation(links[0][2]) + "使用";
			},
		},
		ai: { order: 8, result: { player: 1 } },
		subSkill: {
			backup: {},
			used: {
				charlotte: true,
				onremove: true,
			},
		},
	},
	maihuo: {
		audio: 2,
		trigger: { target: "useCardToTargeted" },
		logTarget: "player",
		filter(event, player) {
			return event.card.name == "sha" && event.card.isCard && event.getParent(2).name != "maihuo_effect" && event.cards.filterInD().length > 0 && event.targets.length == 1 && event.player.isIn() && !event.player.getExpansions("maihuo_effect").length;
		},
		prompt2(event) {
			return "令" + get.translation(event.card) + "暂时对你无效";
		},
		check(event, player) {
			return get.effect(player, event.card, event.player, player) < 0;
		},
		content() {
			trigger.excluded.add(player);
			var target = trigger.player,
				cards = trigger.cards.filterInD();
			target.addToExpansion("gain2", cards).gaintag.add("maihuo_effect");
			target.storage.maihuo_target = player;
			target.addSkill("maihuo_effect");
		},
		group: "maihuo_damage",
		subSkill: {
			effect: {
				trigger: { player: "phaseUseBegin" },
				forced: true,
				charlotte: true,
				filter(event, player) {
					return player.getExpansions("maihuo_effect").length > 0;
				},
				content() {
					"step 0";
					var cards = player.getExpansions("maihuo_effect"),
						card = cards[0];
					if (card.name != "sha") {
						card = get.autoViewAs(
							{
								name: "sha",
								isCard: true,
							},
							cards
						);
					}
					var target = player.storage.maihuo_target;
					if (target.isIn() && player.canUse(card, target, null, true)) {
						player.useCard(card, target, cards);
					}
					"step 1";
					player.removeSkill("maihuo_effect");
				},
				marktext: "祸",
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
				ai: { threaten: 1.05 },
			},
			damage: {
				trigger: { source: "damageSource" },
				forced: true,
				locked: false,
				filter(event, player) {
					return event.player.hasSkill("maihuo_effect") && event.player.getExpansions("maihuo_effect").length > 0;
				},
				content() {
					trigger.player.removeSkill("maihuo_effect");
				},
			},
		},
	},
	xuanbei: {
		audio: 2,
		trigger: {
			global: "phaseBefore",
			player: ["enterGame", "useCardAfter"],
		},
		filter(event, player) {
			if (event.name == "useCard") {
				return !player.hasSkill("xuanbei_used", null, null, false) && (event.card.yingbian || get.is.yingbian(event.card)) && event.cards.someInD() && game.hasPlayer(current => player != current);
			}
			return event.name != "phase" || game.phaseNumber == 0;
		},
		async cost(event, trigger, player) {
			if (trigger.name == "useCard") {
				const cards = trigger.cards.filterInD();
				const {
					result: { bool, targets },
				} = await player.chooseTarget(get.prompt(event.name.slice(0, -5)), `令一名其他角色获得${get.translation(cards)}`, lib.filter.notMe).set("ai", target => {
					let att = get.attitude(get.player(), target);
					if (att < 3) {
						return 0;
					}
					if (target.hasJudge("lebu")) {
						att /= 2;
					}
					if (target.hasSkillTag("nogain")) {
						att /= 10;
					}
					return att / (1 + get.distance(player, target, "absolute"));
				});
				event.result = {
					bool: bool,
					targets: targets,
					cost_data: cards,
				};
			} else {
				event.result = {
					bool: true,
				};
			}
		},
		async content(event, trigger, player) {
			if (trigger.name == "useCard") {
				player.addTempSkill(event.name + "_used");
				const next = event.targets[0].gain(event.cost_data, "gain2");
				next.giver = player;
				await next;
			} else {
				const cards = [];
				while (cards.length < 2) {
					const card = get.cardPile2(i => get.is.yingbian(i) && !cards.includes(i));
					if (!card) {
						break;
					} else {
						cards.push(card);
					}
				}
				if (cards.length) {
					await player.gain(cards, "gain2");
				}
			}
		},
		subSkill: { used: { charlotte: true } },
	},
	xianwan: {
		audio: 2,
		enable: "chooseToUse",
		filter(event, player) {
			return (
				event.filterCard &&
				event.filterCard(
					{
						name: "sha" + (player.isLinked() ? "" : "n"),
						isCard: true,
					},
					player,
					event
				)
			);
		},
		viewAs(cards, player) {
			return {
				name: "sha" + (player.isLinked() ? "" : "n"),
				isCard: true,
			};
		},
		filterCard: () => false,
		selectCard: -1,
		prompt: "将武将牌重置并视为使用【杀】",
		log: false,
		check: () => 1,
		precontent() {
			player.logSkill("xianwan");
			player.link();
		},
		ai: {
			order: 3.4,
			respondSha: true,
			respondShan: true,
			skillTagFilter(player, tag) {
				return tag == "respondSha" + (player.isLinked() ? "" : "n");
			},
			effect: {
				target(card, player, target, current) {
					if (get.tag(card, "respondShan") && current < 0 && !player.isLinked()) {
						return 0.4;
					}
				},
			},
		},
	},
	recaiwang: {
		audio: "caiwang",
		inherit: "caiwang",
		group: ["recaiwang_hand", "recaiwang_equip", "recaiwang_judge"],
	},
	recaiwang_hand: {
		audio: "caiwang",
		enable: ["chooseToUse", "chooseToRespond"],
		sourceSkill: "recaiwang",
		viewAsFilter(player) {
			var js = player.getCards("h");
			return js.length == 1 && game.checkMod(js[0], player, "unchanged", "cardEnabled2", player);
		},
		selectCard: -1,
		filterCard: true,
		position: "h",
		prompt: "将全部手牌当做【闪】使用",
		viewAs: { name: "shan" },
		check: card => 10 - get.value(card),
		ai: {
			order: 1,
			respondShan: true,
			skillTagFilter(player) {
				return player.countCards("h") == 1;
			},
		},
	},
	recaiwang_equip: {
		audio: "caiwang",
		enable: ["chooseToUse", "chooseToRespond"],
		sourceSkill: "recaiwang",
		viewAsFilter(player) {
			var js = player.getCards("e");
			return js.length == 1 && game.checkMod(js[0], player, "unchanged", "cardEnabled2", player);
		},
		selectCard: -1,
		filterCard: true,
		check: card => 9 - get.value(card),
		position: "e",
		prompt: "将装备区的牌当做【无懈可击】使用",
		viewAs: { name: "wuxie" },
		ai: {
			order: 1,
		},
	},
	recaiwang_judge: {
		audio: "caiwang",
		enable: ["chooseToUse", "chooseToRespond"],
		sourceSkill: "recaiwang",
		viewAsFilter(player) {
			var js = player.getCards("j");
			return js.length == 1 && game.checkMod(js[0], player, "unchanged", "cardEnabled2", player);
		},
		selectCard: -1,
		filterCard: true,
		position: "j",
		prompt: "将判定区的牌当做【杀】使用",
		viewAs: { name: "sha" },
		check: card => 1,
		locked: false,
		ai: {
			order: 10,
			respondSha: true,
			skillTagFilter(player) {
				return player.countCards("j") == 1;
			},
			effect: {
				target_use(card, player, target, current) {
					if (card && (card.name == "shandian" || card.name == "fulei") && player == target && !target.countCards("j") && target.isPhaseUsing() && target.hasValueTarget({ name: "sha" }, null, true)) {
						return [1, 2];
					}
				},
			},
		},
		mod: {
			aiOrder(player, card, num) {
				if (card.name == "shandian" || card.name == "fulei") {
					return num + 3;
				}
			},
		},
	},
	caozhao: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			if (
				player.countCards("h") == 0 ||
				!game.hasPlayer(function (current) {
					return current != player && current.hp <= player.hp;
				})
			) {
				return false;
			}
			var list = player.getStorage("caozhao");
			for (var i of lib.inpile) {
				if (!list.includes(i) && ["basic", "trick"].includes(get.type(i))) {
					return true;
				}
			}
			return false;
		},
		chooseButton: {
			dialog(event, player) {
				var list = player.getStorage("caozhao"),
					vcards = [];
				for (var i of lib.inpile) {
					if (!list.includes(i)) {
						var type = get.type(i);
						if (type == "basic" || type == "trick") {
							vcards.push([type, "", i]);
						}
					}
				}
				return ui.create.dialog("草诏", [vcards, "vcard"]);
			},
			check(button) {
				return _status.event.player.getUseValue({ name: button.link[2], isCard: true }, null, true);
			},
			backup(links, player) {
				return {
					audio: "caozhao",
					cardname: links[0][2],
					filterCard: true,
					position: "h",
					check(card) {
						return player.getUseValue({ name: lib.skill.caozhao_backup.cardname }) - (player.getUseValue(card, null, true) + 0.1) / (get.value(card) / 6);
					},
					filterTarget(card, player, target) {
						return target != player && target.hp <= player.hp;
					},
					discard: false,
					lose: false,
					content() {
						"step 0";
						player.showCards(cards, get.translation(player) + "发动【草诏】，声明" + get.translation(lib.skill.caozhao_backup.cardname));
						if (!player.storage.caozhao) {
							player.storage.caozhao = [];
						}
						player.storage.caozhao.push(lib.skill.caozhao_backup.cardname);
						"step 1";
						target
							.chooseControl()
							.set("choiceList", ["令" + get.translation(player) + "将" + get.translation(cards[0]) + "的牌名改为" + get.translation(lib.skill.caozhao_backup.cardname), "失去1点体力"])
							.set("ai", function (event, player) {
								var target = _status.event.getParent().player;
								if (get.attitude(player, target) > 0) {
									return 0;
								}
								if (player.hp > 3 || (player.hp > 1 && player.hasSkill("zhaxiang"))) {
									return 1;
								}
								if (player.hp > 2) {
									return Math.random() > 0.5 ? 0 : 1;
								}
								return 0;
							});
						"step 2";
						if (result.index == 1) {
							target.addExpose(0.2);
							target.loseHp();
							event.finish();
						} else {
							player.chooseTarget("是否将" + get.translation(lib.skill.caozhao_backup.cardname) + "（" + get.translation(cards[0]) + "）交给一名其他角色？", lib.filter.notMe).set("ai", () => -1);
						}
						"step 3";
						if (result.bool) {
							var target = result.targets[0];
							player.line(target, "green");
							if (!target.storage.caozhao_info) {
								target.storage.caozhao_info = {};
							}
							target.storage.caozhao_info[cards[0].cardid] = lib.skill.caozhao_backup.cardname;
							target.addSkill("caozhao_info");
							player.give(cards, target, "give").gaintag.add("caozhao");
						} else {
							if (!player.storage.caozhao_info) {
								player.storage.caozhao_info = {};
							}
							player.storage.caozhao_info[cards[0].cardid] = lib.skill.caozhao_backup.cardname;
							player.addGaintag(cards, "caozhao");
							player.addSkill("caozhao_info");
						}
					},
					ai: {
						result: {
							player: 2,
							target: 0.1,
						},
					},
				};
			},
			prompt(links, player) {
				return "将一张手牌声明为" + get.translation(links[0][2]);
			},
		},
		ai: {
			order: 1,
			result: {
				player: 1,
			},
		},
	},
	caozhao_info: {
		charlotte: true,
		mod: {
			cardname(card, player) {
				var map = player.storage.caozhao_info;
				if (map && map[card.cardid] && get.itemtype(card) == "card" && card.hasGaintag("caozhao")) {
					return map[card.cardid];
				}
			},
			cardnature(card, player) {
				var map = player.storage.caozhao_info;
				if (map && map[card.cardid] && get.itemtype(card) == "card" && card.hasGaintag("caozhao")) {
					return false;
				}
			},
		},
	},
	olxibing: {
		audio: 2,
		trigger: { player: "damageEnd" },
		filter(event, player) {
			return event.player && event.source && event.player != event.source && event.player.isAlive() && event.source.isAlive() && (event.player.countCards("he") > 0 || event.source.countCards("he") > 0);
		},
		direct: true,
		content() {
			"step 0";
			var target = trigger.source;
			event.target = target;
			player
				.chooseTarget(get.prompt("olxibing"), "弃置自己或" + get.translation(target) + "的两张牌，然后手牌数较少的角色摸两张牌且不能对你使用牌直到回合结束", function (card, player, target) {
					if (target != player && target != _status.event.target) {
						return false;
					}
					return target.countCards("he") > 0;
				})
				.set("target", target)
				.set("ai", function (targetx) {
					var player = _status.event.player,
						target = _status.event.target;
					if (target == targetx) {
						if (get.attitude(player, target) > 0) {
							return 0;
						}
						var cards = target
							.getCards("he", function (card) {
								return lib.filter.canBeDiscarded(card, player, target);
							})
							.map(c => ({
								link: c,
							}))
							.sort(function (a, b) {
								return get.buttonValue(b) - get.buttonValue(a);
							})
							.map(b => b.link);
						if (
							target.countCards("h") - player.countCards("h") >=
							Math.max(
								0,
								Math.min(2, cards.length) -
									target.countCards("e", function (card) {
										var index = cards.indexOf(card);
										return index != -1 && index < 2;
									})
							)
						) {
							return 1;
						}
						return 0;
					}
					var cards = player
						.getCards("he", function (card) {
							return lib.filter.cardDiscardable(card, player, "olxibing");
						})
						.sort(function (a, b) {
							return get.useful(a) - get.useful(b);
						});
					if (
						player.countCards("h") - target.countCards("h") <
							Math.max(
								0,
								Math.min(cards.length, 2) -
									player.countCards("e", function (card) {
										var index = cards.indexOf(card);
										return index != -1 && index < 2;
									})
							) &&
						(cards.length < 2 || get.value(cards[1]) < 5.5)
					) {
						return 0.8;
					}
					return 0;
				});
			"step 1";
			if (result.bool) {
				player.logSkill("olxibing", target);
				var target = result.targets[0];
				if (target == player) {
					player.chooseToDiscard("he", 2, true);
				} else {
					player.discardPlayerCard(target, "he", true, 2);
				}
			} else {
				event.finish();
			}
			"step 2";
			if (player.isIn() && target.isIn()) {
				var hs = player.countCards("h"),
					ts = target.countCards("h");
				if (hs != ts) {
					var drawer = hs > ts ? target : player;
					drawer.draw(2);
					player.addTempSkill("olxibing2");
					player.markAuto("olxibing2", [drawer]);
				}
			}
		},
	},
	olxibing2: {
		mod: {
			targetEnabled(card, player, target) {
				if (target.getStorage("olxibing2").includes(player)) {
					return false;
				}
			},
			cardSavable(card, player, target) {
				if (target.getStorage("olxibing2").includes(player)) {
					return false;
				}
			},
		},
		onremove: true,
	},
	bolan: {
		audio: 2,
		banned: ["kotomi_chuanxiang"],
		global: "bolan_g",
		initList(player) {
			var list,
				skills = [];
			if (get.mode() == "guozhan") {
				list = [];
				for (var i in lib.characterPack.mode_guozhan) {
					if (lib.character[i]) {
						list.push(i);
					}
				}
			} else if (_status.connectMode) {
				list = get.charactersOL();
			} else {
				list = [];
				for (var i in lib.character) {
					if (lib.filter.characterDisabled2(i) || lib.filter.characterDisabled(i)) {
						continue;
					}
					list.push(i);
				}
			}
			for (var i of list) {
				if (i.indexOf("gz_jun") == 0) {
					continue;
				}
				for (var j of lib.character[i][3]) {
					if (j == "bolan") {
						continue;
					}
					var skill = lib.skill[j];
					if (!skill || skill.juexingji || skill.hiddenSkill || skill.zhuSkill || skill.dutySkill || skill.chargeSkill || lib.skill.bolan.banned.includes(j)) {
						continue;
					}
					if (skill.init || (skill.ai && (skill.ai.combo || skill.ai.notemp || skill.ai.neg))) {
						continue;
					}
					var info = lib.translate[j + "_info"];
					if (info && get.plainText(info).indexOf("出牌阶段限一次") != -1) {
						skills.add(j);
					}
				}
			}
			player.storage.bolan = skills;
		},
		check(event, player) {
			return true;
		},
		trigger: { player: "phaseUseBegin" },
		frequent: true,
		preHidden: true,
		content() {
			"step 0";
			if (player.isIn()) {
				if (!player.storage.bolan) {
					lib.skill.bolan.initList(player);
				}
				var list = player.storage.bolan.randomGets(3);
				if (!list.length) {
					event.finish();
					return;
				}
				player
					.chooseControl(list)
					.set(
						"choiceList",
						list.map(function (i) {
							return '<div class="skill">【' + get.translation(lib.translate[i + "_ab"] || get.translation(i).slice(0, 2)) + "】</div><div>" + get.skillInfoTranslation(i, player) + "</div>";
						})
					)
					.set("displayIndex", false)
					.set("prompt", "博览：请选择你要获得的技能")
					.set("ai", () => {
						var list = _status.event.controls.slice();
						return list.sort((a, b) => {
							return get.skillRank(b, "in") - get.skillRank(a, "in");
						})[0];
					});
			} else {
				event.finish();
			}
			"step 1";
			player.addTempSkills(result.control, "phaseUseEnd");
			player.popup(result.control);
			// game.log(player,'获得了','#g【'+get.translation(result.control)+'】');
		},
		ai: { threaten: 0.9 },
		subSkill: {
			g: {
				audio: "bolan",
				forceaudio: true,
				enable: "phaseUse",
				usable: 1,
				prompt: "出牌阶段限一次。你可以令一名有〖博览〗的角色从三个描述中包含“出牌阶段限一次”的技能中选择一个，你获得此技能直到此阶段结束。",
				filter(event, player) {
					return game.hasPlayer(function (current) {
						return current != player && current.hasSkill("bolan");
					});
				},
				filterTarget(card, player, target) {
					return player != target && target.hasSkill("bolan");
				},
				selectTarget() {
					if (
						game.countPlayer(current => {
							return lib.skill.bolan_g.filterTarget(null, _status.event.player, current);
						}) == 1
					) {
						return -1;
					}
					return 1;
				},
				content() {
					"step 0";
					player.loseHp();
					"step 1";
					if (target.isIn() && player.isIn()) {
						if (!target.storage.bolan) {
							lib.skill.bolan.initList(target);
						}
						var list = target.storage.bolan.randomGets(3);
						if (!list.length) {
							event.finish();
							return;
						}
						target
							.chooseControl(list)
							.set(
								"choiceList",
								list.map(function (i) {
									return '<div class="skill">【' + get.translation(lib.translate[i + "_ab"] || get.translation(i).slice(0, 2)) + "】</div><div>" + get.skillInfoTranslation(i, player) + "</div>";
								})
							)
							.set("displayIndex", false)
							.set("prompt", "博览：请选择令" + get.translation(player) + "获得的技能")
							.set("ai", () => {
								var list = _status.event.controls.slice();
								return list.sort((a, b) => {
									return (get.skillRank(b, "in") - get.skillRank(a, "in")) * get.attitude(_status.event.player, _status.event.getParent().player);
								})[0];
							});
					} else {
						event.finish();
					}
					"step 2";
					target.line(player);
					player.addTempSkills(result.control, "phaseUseEnd");
				},
				ai: {
					order(item, player) {
						if (player.hp >= 5 || player.countCards("h") >= 10) {
							return 10;
						}
						var list = game.filterPlayer(current => lib.skill.bolan_g.filterTarget(null, player, current));
						for (var target of list) {
							if (get.attitude(target, player) > 0) {
								return 10;
							}
						}
						return 4;
					},
					result: {
						player(player, target) {
							if (player.hasUnknown()) {
								return player.hp + player.countCards("h") / 4 - 5 > 0 ? 1 : 0;
							}
							var tao = player.countCards("h", "tao");
							if (player.hp + tao > 4) {
								return 4 + get.attitude(player, target);
							}
							if (player.hp + tao > 3) {
								return get.attitude(player, target) - 2;
							}
							return 0;
						},
					},
				},
			},
		},
	},
	yifa: {
		audio: 2,
		trigger: { target: "useCardToTargeted" },
		forced: true,
		logTarget: "player",
		filter(event, player) {
			return player != event.player && (event.card.name == "sha" || (get.color(event.card) == "black" && get.type(event.card) == "trick"));
		},
		content() {
			var target = trigger.player;
			target.addTempSkill("yifa2", { player: "phaseEnd" });
			target.addMark("yifa2", 1, false);
		},
		ai: { threaten: 0.8 },
	},
	yifa2: {
		charlotte: true,
		onremove: true,
		intro: { content: "手牌上限-#" },
		mod: {
			maxHandcard(player, num) {
				return num - player.countMark("yifa2");
			},
		},
	},
	buchen: {
		audio: 2,
		trigger: { player: "showCharacterAfter" },
		hiddenSkill: true,
		filter(event, player) {
			var target = _status.currentPhase;
			return event.toShow?.some(i => get.character(i).skills?.includes("buchen")) && target?.isIn() && target != player && target.countGainableCards(player, "he") > 0;
		},
		direct: true,
		content() {
			var target = _status.currentPhase;
			player.gainPlayerCard(target, "he", get.prompt("buchen", target)).set("logSkill", ["buchen", target]);
		},
	},
	smyyingshi: {
		audio: 2,
		locked: true,
		clickableFilter(player) {
			return player.isPhaseUsing();
		},
		clickable(player) {
			if (player.isUnderControl(true)) {
				const cards = lib.skill.smyyingshi.getCards(player);
				function createDialogWithControl(result) {
					const dialog = ui.create.dialog("鹰视", "peaceDialog");
					result.length > 0 ? dialog.add(result, true) : dialog.addText("牌堆顶无牌");
					const control = ui.create.control("确定", () => dialog.close());
					dialog._close = dialog.close;
					dialog.hide = dialog.close = function (...args) {
						control.close();
						return dialog._close(...args);
					};
					dialog.open();
				}
				if (cards instanceof Promise) {
					cards.then(([ok, result]) => createDialogWithControl(result));
				} else {
					createDialogWithControl(cards);
				}
			}
		},
		getCards(player) {
			const num = player.maxHp;
			if (num > 0) {
				if (game.online) {
					return game.dataRequest("smyyingshi", "getTopCards", 10000);
				} else {
					if (ui.cardPile.hasChildNodes !== false) {
						return Array.from(ui.cardPile.childNodes).slice(0, num);
					}
				}
			}
			return [];
		},
		sync: {
			getTopCards(client) {
				if (ui.cardPile.hasChildNodes !== false) {
					return Array.from(ui.cardPile.childNodes).slice(0, client.maxHp);
				}
				return [];
			},
		},
		mark: true,
		marktext: "牌",
		intro: {
			mark(dialog, content, player, event, skill) {
				const intronode = ui.create.div(".menubutton.pointerdiv", "点击发动", function () {
					if (!this.classList.contains("disabled")) {
						this.classList.add("disabled");
						this.style.opacity = 0.5;
						lib.skill[skill].clickable(player);
					}
				});
				if (!_status.gameStarted || !player.isUnderControl(true) || !lib.skill[skill].clickableFilter(player)) {
					intronode.classList.add("disabled");
					intronode.style.opacity = 0.5;
				}
				dialog.add(intronode);
			},
		},
	},
	xiongzhi: {
		audio: 2,
		enable: "phaseUse",
		limited: true,
		skillAnimation: true,
		animationColor: "thunder",
		async content(event, trigger, player) {
			player.awakenSkill(event.name);
			while (true) {
				const card = get.cards()[0];
				const content = ["牌堆顶", [card]];
				game.log(player, "观看了牌堆顶的一张牌");
				await player.chooseControl("ok").set("dialog", content);
				if (player.hasUseTarget(card, null, card.name === "sha") || (get.info(card).notarget && lib.filter.cardEnabled(card, player))) {
					const result = await player.chooseUseTarget(card, true).forResult();
					if (result?.bool) {
						continue;
					}
				}
				break;
			}
		},
		ai: {
			order: 1,
			result: {
				player(player) {
					if (!player.hasSkill("smyyingshi")) {
						return 1;
					}
					for (var i = 0; i < Math.min(2, player.maxHp); i++) {
						var card = ui.cardPile.childNodes[i];
						if (card) {
							if (!player.hasValueTarget(card)) {
								return 0;
							}
						} else {
							break;
						}
					}
					return 1;
				},
			},
		},
	},
	quanbian: {
		audio: 2,
		trigger: { player: ["useCard", "respond"] },
		hasHand(event) {
			var evts = event.player.getHistory("lose", function (evt) {
				return (evt.relatedEvent || evt.getParent()) == event;
			});
			return evts && evts.length == 1 && evts[0].hs.length > 0;
		},
		filter(event, player) {
			var phase = event.getParent("phaseUse");
			if (!phase || phase.player != player) {
				return false;
			}
			var suit = get.suit(event.card);
			if (!lib.suit.includes(suit) || !lib.skill.quanbian.hasHand(event)) {
				return false;
			}
			return (
				player.getHistory("useCard", function (evt) {
					return evt != event && get.suit(evt.card) == suit && lib.skill.quanbian.hasHand(evt) && evt.getParent("phaseUse") == phase;
				}).length +
					player.getHistory("respond", function (evt) {
						return evt != event && get.suit(evt.card) == suit && lib.skill.quanbian.hasHand(evt) && evt.getParent("phaseUse") == phase;
					}).length ==
				0
			);
		},
		direct: true,
		content() {
			"step 0";
			player
				.chooseControl("cancel2")
				.set("prompt", get.prompt("quanbian"))
				.set("choiceList", ["摸一张牌", "观看牌堆顶的" + get.cnNumber(player.maxHp) + "张牌并将其中一张置于牌堆底"])
				.set("ai", function () {
					var player = _status.event.player;
					var suit = get.suit(_status.event.getTrigger().card);
					if (
						player.countCards("h", function (card) {
							return get.suit(card) == suit && player.hasValueTarget(card, null, true);
						})
					) {
						return "cancel2";
					}
					return 0;
				});
			"step 1";
			if (result.control == "cancel2") {
				event.finish();
				return;
			}
			player.addTempSkill("quanbian2");
			player.storage.quanbian2.add(get.suit(trigger.card));
			player.markSkill("quanbian2");
			if (result.index == 0) {
				player.draw();
				event.finish();
				return;
			}
			event.cards = get.cards(player.maxHp);
			player.chooseButton(["将一张牌置于牌堆底", event.cards], true);
			"step 2";
			while (cards.length) {
				var card = cards.pop();
				card.fix();
				if (card == result.links[0]) {
					ui.cardPile.appendChild(card);
				} else {
					ui.cardPile.insertBefore(card, ui.cardPile.firstChild);
				}
			}
			game.updateRoundNumber();
		},
	},
	quanbian2: {
		init(player, skill) {
			if (!player.storage[skill]) {
				player.storage[skill] = [];
			}
		},
		onremove: true,
		mod: {
			cardEnabled2(card, player) {
				if (get.position(card) == "h" && player.storage.quanbian2.includes(get.suit(card))) {
					return false;
				}
			},
		},
		intro: {
			content: "本回合内不能使用$花色的手牌",
		},
	},
	//卫瓘
	zhongyun: {
		audio: 2,
		trigger: { player: ["damageEnd", "recoverEnd"] },
		forced: true,
		filter(event, player) {
			return (
				player.hp == player.countCards("h") &&
				(player.isDamaged() ||
					game.hasPlayer(function (current) {
						return player.inRange(current);
					}))
			);
		},
		usable: 1,
		preHidden: ["zhongyun2"],
		content() {
			"step 0";
			var filterTarget = function (card, player, target) {
				return player.inRange(target);
			};
			if (game.hasPlayer(current => filterTarget("L∞pers", player, current))) {
				var bool = player.isHealthy();
				player.chooseTarget("忠允：对攻击范围内的一名角色造成1点伤害" + (bool ? "" : "，或点取消回复1点体力"), filterTarget, bool).set("ai", function (target) {
					var player = _status.event.player;
					return get.damageEffect(target, player, player);
				});
			} else {
				event._result = { bool: false };
			}
			"step 1";
			if (result.bool) {
				var target = result.targets[0];
				player.line(target, "green");
				target.damage();
			} else {
				player.recover();
			}
		},
		group: "zhongyun2",
	},
	zhongyun2: {
		audio: "zhongyun",
		trigger: {
			player: ["loseAfter"],
			global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"],
		},
		forced: true,
		sourceSkill: "zhongyun",
		filter(event, player) {
			var cards1 = event.getl(player).hs,
				cards2 = [];
			if (event.getg) {
				cards2 = event.getg(player);
			}
			return (cards1.length > 0 || cards2.length > 0) && player.countCards("h") == player.hp;
		},
		usable: 1,
		content() {
			"step 0";
			if (trigger.delay === false) {
				game.delayx();
			}
			var filterTarget = function (card, player, target) {
				return target != player && target.countDiscardableCards(player, "he") > 0;
			};
			if (!game.hasPlayer(current => filterTarget("L∞pers", player, current))) {
				event._result = { bool: false };
			} else {
				player.chooseTarget(filterTarget, "忠允：弃置一名其他角色的一张牌，或点取消摸一张牌").set("ai", function (target) {
					var att = get.attitude(player, target);
					if (att >= 0) {
						return 0;
					}
					if (
						target.countCards("he", function (card) {
							return get.value(card) > 5;
						})
					) {
						return -att;
					}
					return 0;
				});
			}
			"step 1";
			if (!result.bool) {
				player.draw();
			} else {
				var target = result.targets[0];
				player.line(target, "green");
				player.discardPlayerCard(target, true, "he");
			}
		},
	},
	shenpin: {
		audio: 2,
		trigger: { global: "judge" },
		filter(event, player) {
			var color = get.color(event.player.judging[0], event.player);
			return (
				player.countCards("hes", function (card) {
					if (_status.connectMode && get.position(card) != "e") {
						return true;
					}
					return get.color(card) != color;
				}) > 0
			);
		},
		direct: true,
		preHidden: true,
		content() {
			"step 0";
			var color = get.color(trigger.player.judging[0], trigger.player);
			player
				.chooseCard(get.translation(trigger.player) + "的" + (trigger.judgestr || "") + "判定为" + get.translation(trigger.player.judging[0]) + "，" + get.prompt("shenpin"), "hes", function (card) {
					if (get.color(card) == _status.event.color) {
						return false;
					}
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
				})
				.set("ai", function (card) {
					var trigger = _status.event.getTrigger();
					var player = _status.event.player;
					var judging = _status.event.judging;
					var result = trigger.judge(card) - trigger.judge(judging);
					var attitude = get.attitude(player, trigger.player);
					if (attitude == 0 || result == 0) {
						return 0;
					}
					if (attitude > 0) {
						return result;
					} else {
						return -result;
					}
				})
				.set("judging", trigger.player.judging[0])
				.set("color", color)
				.setHiddenSkill(event.name);
			"step 1";
			if (result.bool) {
				player.respond(result.cards, "highlight", "shenpin", "noOrdering");
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
		ai: {
			rejudge: true,
			tag: {
				rejudge: 1,
			},
		},
	},
	//彻里吉
	chexuan: {
		audio: 2,
		enable: "phaseUse",
		derivation: ["cheliji_sichengliangyu", "cheliji_tiejixuanyu", "cheliji_feilunzhanyu"],
		filter(event, player) {
			return !player.getEquips(5).length && player.countCards("he", { color: "black" }) > 0;
		},
		filterCard: { color: "black" },
		position: "he",
		check(card) {
			return 5 - get.value(card);
		},
		content() {
			"step 0";
			player
				.chooseButton(
					[
						"请选择要装备的宝物",
						[
							lib.skill.chexuan.derivation.map(function (i) {
								return ["宝物", "", i];
							}),
							"vcard",
						],
					],
					true
				)
				.set("ai", function (button) {
					if (button.link[2] == "cheliji_sichengliangyu" && player.countCards("h") < player.hp) {
						return 1;
					}
					return Math.random();
				});
			"step 1";
			var name = result.links[0][2],
				card = game.createCard(name, lib.card[name].cardcolor, 5);
			player.$gain2(card);
			player.equip(card);
			game.delay();
		},
		group: "chexuan_lose",
		subfrequent: ["lose"],
		ai: {
			order: 6,
			result: {
				player: 1,
			},
		},
		subSkill: {
			lose: {
				audio: "chexuan",
				trigger: {
					player: "loseAfter",
					global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"],
				},
				frequent: true,
				filter(event, player) {
					var evt = event.getl(player);
					if (!evt || !evt.es || !evt.es.length) {
						return false;
					}
					if (event.name == "equip" && event.player == player) {
						return false;
					}
					for (var i of evt.es) {
						if (get.subtype(i, false) == "equip5") {
							return true;
						}
					}
					return false;
				},
				content() {
					"step 0";
					player.judge(function (card) {
						if (get.color(card) == "black") {
							return 3;
						}
						return 0;
					});
					"step 1";
					if (result.bool) {
						const name = lib.skill.chexuan.derivation.randomGet(),
							card = game.createCard(name, lib.card[name].cardcolor, 5);
						player.$gain2(card);
						player.equip(card);
						game.delay();
					}
				},
			},
		},
	},
	qiangshou: {
		mod: {
			globalFrom(player, target, distance) {
				if (player.getEquips(5).length) {
					return distance - 1;
				}
			},
		},
		ai: {
			combo: "chexuan",
		},
	},
	cheliji_sichengliangyu: {
		trigger: { global: "phaseJieshuBegin" },
		equipSkill: true,
		cardcolor: "heart",
		filter(event, player) {
			return player.countCards("h") < player.hp && player.getEquip("cheliji_sichengliangyu");
		},
		content() {
			"step 0";
			player.draw(2);
			"step 1";
			var card = player.getEquip("cheliji_sichengliangyu");
			if (card) {
				player.discard(card);
			}
		},
	},
	cheliji_tiejixuanyu: {
		trigger: { global: "phaseJieshuBegin" },
		equipSkill: true,
		cardcolor: "club",
		filter(event, player) {
			return player != event.player && !event.player.getHistory("sourceDamage").length && event.player.countCards("he") > 0 && player.getEquip("cheliji_tiejixuanyu");
		},
		logTarget: "player",
		check(event, player) {
			return get.attitude(player, event.player) < 0;
		},
		content() {
			"step 0";
			trigger.player.chooseToDiscard("he", 2, true);
			"step 1";
			var card = player.getEquip("cheliji_tiejixuanyu");
			if (card) {
				player.discard(card);
			}
		},
	},
	cheliji_feilunzhanyu: {
		trigger: { global: "phaseJieshuBegin" },
		equipSkill: true,
		cardcolor: "spade",
		filter(event, player) {
			return (
				player != event.player &&
				event.player.getHistory("useCard", function (card) {
					return get.type(card.card) != "basic";
				}).length > 0 &&
				event.player.countCards("he") > 0 &&
				player.getEquip("cheliji_feilunzhanyu")
			);
		},
		logTarget: "player",
		check(event, player) {
			return get.attitude(player, event.player) <= 0;
		},
		content() {
			"step 0";
			trigger.player.chooseCard("he", true, "将一张牌交给" + get.translation(player));
			"step 1";
			if (result.bool) {
				trigger.player.give(result.cards, player);
			}
			"step 2";
			var card = player.getEquip("cheliji_feilunzhanyu");
			if (card) {
				player.discard(card);
			}
		},
	},
	//司马伷和黄祖
	caiwang: {
		audio: 2,
		trigger: { global: ["useCard", "respond"] },
		preHidden: true,
		filter(event, player) {
			if (!Array.isArray(event.respondTo) || event.respondTo[0] == event.player || ![event.respondTo[0], event.player].includes(player)) {
				return false;
			}
			var color = get.color(event.card);
			if (color == "none" || get.color(event.respondTo[1]) != color) {
				return false;
			}
			var target = lib.skill.caiwang.logTarget(event, player);
			return target[player.getStorage("naxiang2").includes(target) ? "countGainableCards" : "countDiscardableCards"](player, "he") > 0;
		},
		logTarget(event, player) {
			return player == event.respondTo[0] ? event.player : event.respondTo[0];
		},
		prompt2(event, player) {
			var target = lib.skill.caiwang.logTarget(event, player);
			return (player.getStorage("naxiang2").includes(target) ? "获得" : "弃置") + "该角色的一张牌";
		},
		check(event, player) {
			return get.attitude(player, lib.skill.caiwang.logTarget(event, player)) <= 0;
		},
		popup: false,
		content() {
			"step 0";
			if (player != game.me && !player.isOnline()) {
				game.delayx();
			}
			"step 1";
			var target = lib.skill.caiwang.logTarget(trigger, player);
			player.logSkill(event.name, target);
			player[player.getStorage("naxiang2").includes(target) ? "gainPlayerCard" : "discardPlayerCard"](target, "he", true);
		},
	},
	naxiang: {
		audio: 2,
		trigger: {
			player: "damageEnd",
			source: "damageSource",
		},
		forced: true,
		preHidden: true,
		filter(event, player) {
			var target = lib.skill.naxiang.logTarget(event, player);
			return target && target != player && target.isAlive();
		},
		logTarget(event, player) {
			return player == event.player ? event.source : event.player;
		},
		content() {
			player.addTempSkill("naxiang2", { player: "phaseBegin" });
			if (!player.storage.naxiang2) {
				player.storage.naxiang2 = [];
			}
			player.storage.naxiang2.add(lib.skill.naxiang.logTarget(trigger, player));
			player.markSkill("naxiang2");
		},
		ai: {
			combo: "caiwang",
		},
	},
	naxiang2: {
		onremove: true,
		intro: {
			content: "已接受$的投降；对这些角色发动【才望】时将“弃置”改为“获得”",
		},
	},
	//李肃
	qiaoyan: {
		audio: 2,
		trigger: { player: "damageBegin2" },
		forced: true,
		filter(event, player) {
			return player != _status.currentPhase && event.source && event.source != player;
		},
		logTarget: "source",
		content() {
			"step 0";
			var cards = player.getExpansions("qiaoyan");
			if (cards.length) {
				var source = trigger.source;
				source.gain(cards, player, "give", "bySelf");
				event.finish();
			} else {
				trigger.cancel();
				player.draw();
			}
			"step 1";
			var hs = player.getCards("he");
			if (!hs.length) {
				event.finish();
			} else if (hs.length == 1) {
				event._result = { bool: true, cards: hs };
			} else {
				player.chooseCard("he", true, "将一张牌作为“珠”置于武将牌上");
			}
			"step 2";
			if (result.bool && result.cards && result.cards.length) {
				var cards = result.cards;
				player.addToExpansion(cards, player, "give").gaintag.add("qiaoyan");
			}
			event.finish();
		},
		marktext: "珠",
		intro: { content: "expansion", markcount: "expansion" },
		onremove(player, skill) {
			var cards = player.getExpansions(skill);
			if (cards.length) {
				player.loseToDiscardpile(cards);
			}
		},
		ai: {
			filterDamage: true,
			skillTagFilter(player, tag, arg) {
				if (!player.getExpansions("qiaoyan").length) {
					return false;
				}
				if (arg && arg.player) {
					if (arg.player.hasSkillTag("jueqing", false, player)) {
						return false;
					}
				}
			},
		},
	},
	xianzhu: {
		audio: 2,
		trigger: { player: "phaseUseBegin" },
		locked: true,
		filter(event, player) {
			return player.getExpansions("qiaoyan").length > 0;
		},
		async cost(event, trigger, player) {
			event.cards = player.getExpansions("qiaoyan");
			event.result = await player
				.chooseTarget(true, "请选择【献珠】的目标", "将" + get.translation(event.cards) + "交给一名角色。若该角色不为你自己，则你令其视为对其攻击范围内的另一名角色使用【杀】")
				.set("ai", function (target) {
					var player = _status.event.player;
					var eff = get.sgn(get.attitude(player, target)) * get.value(_status.event.getParent().cards[0], target);
					if (player != target) {
						eff += Math.max.apply(
							null,
							game
								.filterPlayer(function (current) {
									if (current != target && player.inRange(current) && target.canUse("sha", current, false)) {
										return true;
									}
								})
								.map(function (current) {
									return get.effect(current, { name: "sha" }, target, player);
								})
						);
					}
					return eff;
				})
				.forResult();
		},
		content() {
			"step 0";
			event.cards = player.getExpansions("qiaoyan");
			event.target = targets[0];
			"step 1";
			player.give(cards, target, "give");
			"step 2";
			if (
				player != target &&
				target.isIn() &&
				player.isIn() &&
				game.hasPlayer(function (current) {
					return current != target && player.inRange(current) && target.canUse("sha", current, false);
				})
			) {
				var str = get.translation(target);
				player
					.chooseTarget(true, "选择攻击范围内的一名角色，视为" + str + "对其使用【杀】", function (card, player, target) {
						var source = _status.event.target;
						return player.inRange(target) && source.canUse("sha", target, false);
					})
					.set("target", target)
					.set("ai", function (target) {
						var evt = _status.event;
						return get.effect(target, { name: "sha" }, evt.target, evt.player);
					});
			} else {
				event.finish();
			}
			"step 3";
			if (result.bool) {
				target.useCard({ name: "sha", isCard: true }, result.targets[0], false);
			}
		},
		ai: { combo: "qiaoyan" },
	},
	huirong: {
		audio: 2,
		trigger: { player: "showCharacterAfter" },
		forced: true,
		filter(event, player) {
			return (
				event.toShow?.some(i => get.character(i).skills?.includes("huirong")) &&
				game.hasPlayer(function (target) {
					var num = target.countCards("h");
					return num > target.hp || num < Math.min(5, target.hp);
				})
			);
		},
		hiddenSkill: true,
		content() {
			"step 0";
			player
				.chooseTarget("请选择【慧容】的目标", "令一名角色将手牌数摸至/弃置至与其体力值相同（至多摸至五张）", true, function (card, player, target) {
					var num = target.countCards("h");
					return num > target.hp || num < Math.min(5, target.hp);
				})
				.set("ai", function (target) {
					var att = get.attitude(_status.event.player, target);
					var num = target.countCards("h");
					if (num > target.hp) {
						return -att * (num - target.hp);
					}
					return att * Math.max(0, Math.min(5, target.hp) - target.countCards("h"));
				});
			"step 1";
			if (result.bool) {
				var target = result.targets[0];
				player.line(target, "green");
				if (target.countCards("h") < target.hp) {
					target.drawTo(Math.min(5, target.hp));
				} else {
					target.chooseToDiscard("h", true, target.countCards("h") - target.hp);
				}
			}
		},
	},
	ciwei: {
		init: () => {
			game.addGlobalSkill("ciwei_ai");
		},
		onremove: () => {
			if (!game.hasPlayer(i => i.hasSkill("ciwei", null, null, false), true)) {
				game.removeGlobalSkill("ciwei_ai");
			}
		},
		audio: 2,
		trigger: { global: "useCard" },
		direct: true,
		preHidden: true,
		filter(event, player) {
			if (event.all_excluded || event.player == player || event.player != _status.currentPhase || !player.countCards("he")) {
				return false;
			}
			return event.player.getHistory("useCard").indexOf(event) == 1 && ["basic", "trick"].includes(get.type(event.card));
		},
		content() {
			"step 0";
			if (player != game.me && !player.isOnline()) {
				game.delayx();
			}
			player
				.chooseToDiscard(get.prompt("ciwei", trigger.player), "弃置一张牌，取消" + get.translation(trigger.card) + "的所有目标", "he")
				.set("ai", function (card) {
					return _status.event.goon / 1.4 - get.value(card);
				})
				.set(
					"goon",
					(function () {
						if (!trigger.targets.length) {
							return -get.attitude(player, trigger.player);
						}
						var num = 0;
						for (var i of trigger.targets) {
							num -= get.effect(i, trigger.card, trigger.player, player);
						}
						return num;
					})()
				)
				.setHiddenSkill(event.name).logSkill = ["ciwei", trigger.player];
			"step 1";
			if (result.bool) {
				trigger.targets.length = 0;
				trigger.all_excluded = true;
			}
		},
	},
	ciwei_ai: {
		mod: {
			aiOrder(player, card, num) {
				if (
					player != _status.currentPhase ||
					player.getHistory("useCard").length > 1 ||
					!game.hasPlayer(function (current) {
						return current != player && (get.realAttitude || get.attitude)(current, player) < 0 && current.hasSkill("ciwei") && current.countCards("he") > 0;
					})
				) {
					return;
				}
				if (player.getHistory("useCard").length == 0) {
					if (["basic", "trick"].includes(get.type(card))) {
						return num + 10;
					}
					return;
				}
				if (!["basic", "trick"].includes(get.type(card))) {
					return num + 10;
				}
				if (!player._ciwei_temp) {
					player._ciwei_temp = true;
					num /= Math.max(1, player.getUseValue(card));
				}
				delete player._ciwei_temp;
				return num;
			},
		},
		trigger: { player: "dieAfter" },
		sourceSkill: "ciwei",
		filter: () => {
			return !game.hasPlayer(i => i.hasSkill("ciwei", null, null, false), true);
		},
		silent: true,
		forceDie: true,
		content: () => {
			game.removeGlobalSkill("ciwei_ai");
		},
	},
	caiyuan: {
		audio: 2,
		trigger: { player: "phaseEnd" },
		forced: true,
		preHidden: true,
		filter(event, player) {
			if (player.phaseNumber <= 1) {
				return false;
			}
			const history1 = _status.globalHistory,
				history2 = player.actionHistory;
			for (let i = 0; i < Math.min(history1.length, history2.length); i++) {
				let i1 = history1.length - 1 - i,
					i2 = history2.length - 1 - i;
				if (i > 0 && history2[i2].isMe) {
					break;
				}
				if (history1[i1].changeHp.some(evt => evt.player == player && evt.num < 0)) {
					return false;
				}
			}
			return true;
		},
		content() {
			player.draw(2);
		},
	},
	zhuosheng: {
		audio: 2,
		locked: false,
		init(player) {
			player.addSkill("zhuosheng_count");
			if (game.phaseNumber > 0) {
				var hs = player.getCards("h"),
					all = player.getAllHistory(),
					cards = [];
				for (var i = all.length - 1; i >= 0; i--) {
					for (var j of all[i].gain) {
						cards.addArray(j.cards);
					}
					if (all[i].isRound) {
						break;
					}
				}
				cards = cards.filter(function (i) {
					return hs.includes(i);
				});
				if (cards.length) {
					player.addGaintag(cards, "zhuosheng");
				}
			}
		},
		onremove(player) {
			player.removeSkill("zhuosheng_count");
			player.removeGaintag("zhuosheng");
		},
		mod: {
			targetInRange(card, player) {
				if (get.type(card) !== "basic") {
					return;
				}
				if (!(game.online ? player === _status.currentPhase : player.isPhaseUsing())) {
					return;
				}
				if (get.number(card) === "unsure" || card.cards?.every(card => card.hasGaintag("zhuosheng"))) {
					return true;
				}
			},
			cardUsable(card, player) {
				if (get.mode() === "guozhan" || get.type(card) !== "basic") {
					return;
				}
				if (!(game.online ? player === _status.currentPhase : player.isPhaseUsing())) {
					return;
				}
				if (get.number(card) === "unsure" || card.cards?.every(card => card.hasGaintag("zhuosheng"))) {
					return Infinity;
				}
			},
			aiOrder(player, card, num) {
				if (get.itemtype(card) === "card" && card.hasGaintag("zhuosheng") && get.type(card) === "basic") {
					return num - 0.1;
				}
			},
		},
		trigger: { player: "useCard2" },
		direct: true,
		filterx(event, player) {
			if (!player.isPhaseUsing()) {
				return false;
			}
			return (
				player.getHistory("lose", function (evt) {
					if ((evt.relatedEvent || evt.getParent()) != event) {
						return false;
					}
					for (var i in evt.gaintag_map) {
						if (evt.gaintag_map[i].includes("zhuosheng")) {
							return true;
						}
					}
					return false;
				}).length > 0
			);
		},
		filter(event, player) {
			if (!lib.skill.zhuosheng.filterx(event, player)) {
				return false;
			}
			if (get.type(event.card) != "trick") {
				return false;
			}
			if (event.targets && event.targets.length > 0) {
				return true;
			}
			var info = get.info(event.card);
			if (info.allowMultiple == false) {
				return false;
			}
			if (event.targets && !info.multitarget) {
				if (
					game.hasPlayer(function (current) {
						return !event.targets.includes(current) && lib.filter.targetEnabled2(event.card, player, current) && lib.filter.targetInRange(event.card, player, current);
					})
				) {
					return true;
				}
			}
			return false;
		},
		content() {
			"step 0";
			var prompt2 = "为" + get.translation(trigger.card) + "增加或减少一个目标";
			player
				.chooseTarget(get.prompt("zhuosheng"), function (card, player, target) {
					var player = _status.event.player;
					if (_status.event.targets.includes(target)) {
						return true;
					}
					return lib.filter.targetEnabled2(_status.event.card, player, target) && lib.filter.targetInRange(_status.event.card, player, target);
				})
				.set("prompt2", prompt2)
				.set("ai", function (target) {
					var trigger = _status.event.getTrigger();
					var player = _status.event.player;
					return get.effect(target, trigger.card, player, player) * (_status.event.targets.includes(target) ? -1 : 1);
				})
				.set("targets", trigger.targets)
				.set("card", trigger.card);
			"step 1";
			if (result.bool) {
				if (!event.isMine() && !event.isOnline()) {
					game.delayx();
				}
				event.targets = result.targets;
			} else {
				event.finish();
			}
			"step 2";
			if (event.targets) {
				player.logSkill("zhuosheng", event.targets);
				if (trigger.targets.includes(event.targets[0])) {
					trigger.targets.removeArray(event.targets);
				} else {
					trigger.targets.addArray(event.targets);
				}
			}
		},
		group: ["zhuosheng_equip", "zhuosheng_silent"],
		subfrequent: ["equip"],
		subSkill: {
			equip: {
				audio: "zhuosheng",
				trigger: { player: "useCard" },
				filter(event, player) {
					return get.type(event.card) == "equip" && lib.skill.zhuosheng.filterx(event, player);
				},
				frequent: true,
				prompt: "是否发动【擢升】摸一张牌？",
				content() {
					player.draw();
				},
			},
			silent: {
				trigger: {
					player: "useCard1",
				},
				silent: true,
				firstDo: true,
				filter(event, player) {
					return get.mode() != "guozhan" && get.type(event.card) == "basic" && lib.skill.zhuosheng.filterx(event, player) && event.addCount !== false;
				},
				content() {
					trigger.addCount = false;
					var stat = player.getStat();
					if (stat && stat.card && stat.card[trigger.card.name]) {
						stat.card[trigger.card.name]--;
					}
				},
			},
		},
	},
	zhuosheng_count: {
		trigger: {
			player: "gainBegin",
			global: "roundStart",
		},
		silent: true,
		sourceSkill: "zhuosheng",
		filter(event, player) {
			if (event.name == "gain") {
				return event.getParent(2).name != "zhuosheng_equip";
			}
			return game.roundNumber > 1;
		},
		content() {
			if (trigger.name == "gain") {
				trigger.gaintag.add("zhuosheng");
			} else {
				player.removeGaintag("zhuosheng");
			}
		},
	},
	xinquanbian: {
		audio: "quanbian",
		preHidden: true,
		trigger: { player: ["useCard", "respond"] },
		filter(event, player) {
			var phase = event.getParent("phaseUse");
			if (!phase || phase.player != player) {
				return false;
			}
			var suit = get.suit(event.card);
			if (!lib.suit.includes(suit) || !lib.skill.quanbian.hasHand(event)) {
				return false;
			}
			return (
				player.getHistory("useCard", function (evt) {
					return evt != event && get.suit(evt.card) == suit && lib.skill.quanbian.hasHand(evt) && evt.getParent("phaseUse") == phase;
				}).length +
					player.getHistory("respond", function (evt) {
						return evt != event && get.suit(evt.card) == suit && lib.skill.quanbian.hasHand(evt) && evt.getParent("phaseUse") == phase;
					}).length ==
				0
			);
		},
		content() {
			"step 0";
			var cards = get.cards(Math.min(5, player.maxHp));
			game.cardsGotoOrdering(cards);
			var suit = get.suit(trigger.card);
			var next = player.chooseToMove("权变：获得一张不为" + get.translation(suit) + "花色的牌并排列其他牌");
			next.set("suit", suit);
			next.set("list", [["牌堆顶", cards], ["获得"]]);
			next.set("filterMove", function (from, to, moved) {
				var suit = _status.event.suit;
				if (moved[0].includes(from.link)) {
					if (typeof to == "number") {
						if (to == 1) {
							if (moved[1].length) {
								return false;
							}
							return get.suit(from.link, false) != suit;
						}
						return true;
					}
					if (moved[1].includes(to.link)) {
						return get.suit(from.link, false) != suit;
					}
					return true;
				} else {
					if (typeof to == "number") {
						return true;
					}
					return get.suit(to.link, false) != suit;
				}
			});
			next.set("processAI", function (list) {
				var cards = list[0][1].slice(0).sort(function (a, b) {
						return get.value(b) - get.value(a);
					}),
					gains = [];
				for (var i of cards) {
					if (get.suit(i, false) != _status.event.suit) {
						cards.remove(i);
						gains.push(i);
						break;
					}
				}
				return [cards, gains];
			});
			"step 1";
			if (result.bool) {
				var list = result.moved;
				if (list[1].length) {
					player.gain(list[1], "gain2");
				}
				while (list[0].length) {
					ui.cardPile.insertBefore(list[0].pop(), ui.cardPile.firstChild);
				}
				game.updateRoundNumber();
			}
		},
		//group:'xinquanbian_count',
		init: (player, skill) => player.addSkill("xinquanbian_count"),
		onremove: (player, skill) => player.removeSkill("xinquanbian_count"),
	},
	xinquanbian_count: {
		trigger: {
			player: ["useCard0", "phaseUseBefore", "phaseUseAfter"],
		},
		silent: true,
		firstDo: true,
		charlotte: true,
		sourceSkill: "xinquanbian",
		filter(event, player) {
			if (event.name === "phaseUse") {
				return true;
			}
			return player.isPhaseUsing() && lib.skill.quanbian.hasHand(event) && get.type(event.card) != "equip";
		},
		content() {
			var stat = player.getStat("skill");
			if (trigger.name === "phaseUse") {
				delete stat.xinquanbian;
			} else {
				if (!stat.xinquanbian) {
					stat.xinquanbian = 0;
				}
				stat.xinquanbian++;
			}
		},
		mod: {
			cardEnabled2(card, player) {
				var stat = player.getStat("skill");
				if (stat.xinquanbian && stat.xinquanbian >= player.maxHp && get.position(card) == "h" && get.type(card, null, player) != "equip") {
					return false;
				}
			},
		},
	},
	taoyin: {
		audio: 2,
		trigger: { player: "showCharacterAfter" },
		hiddenSkill: true,
		logTarget() {
			return _status.currentPhase;
		},
		filter(event, player) {
			const target = _status.currentPhase;
			return player != target && target?.isAlive() && event.toShow?.some(i => get.character(i).skills?.includes("taoyin"));
		},
		check(event, player) {
			return get.attitude(player, _status.currentPhase) < 0;
		},
		async content(event, trigger, player) {
			const {
				targets: [target],
			} = event;
			target.addTempSkill(event.name + "_effect");
			target.addMark(event.name + "_effect", 2, false);
		},
		ai: { expose: 0.2 },
		subSkill: {
			effect: {
				onremove: true,
				charlotte: true,
				intro: { content: "本回合手牌上限-#" },
				mod: {
					maxHandcard(player, num) {
						return num - player.countMark("taoyin_effect");
					},
				},
			},
		},
	},
	yimie: {
		audio: 2,
		usable: 1,
		preHidden: true,
		trigger: { source: "damageBegin1" },
		filter(event, player) {
			return player != event.player && event.num < event.player.hp;
		},
		check(event, player) {
			if (
				event.player.hasSkillTag("nodamage", null, {
					source: player,
					card: event.card,
					natures: get.natureList(event),
				})
			) {
				return false;
			}
			let tj = player.countCards("hs", function (card) {
					return get.name(card) === "tao" || get.name(card) === "jiu";
				}),
				att = get.attitude(_status.event.player, event.player),
				eff = get.damageEffect(event.player, player, _status.event.player, get.natureList(event)),
				fd = event.player.hasSkillTag("filterDamage", null, {
					player: player,
					card: event.card,
				}),
				hp = player.hp + tj;
			if (player.storage.tairan2) {
				hp -= player.storage.tairan2;
			}
			if (eff <= 0 || fd || att >= -2 || Math.abs(hp) <= 1) {
				return false;
			}
			if (hp > 2 || (eff > 0 && event.player.isLinked() && event.hasNature())) {
				return true;
			}
			return !event.player.countCards("hs") || (event.player.hp > 2 * event.num && !event.player.hasSkillTag("maixie"));
		},
		logTarget: "player",
		content() {
			player.loseHp();
			trigger.player.addTempSkill("yimie2");
			trigger.yimie_num = trigger.player.hp - trigger.num;
			trigger.num = trigger.player.hp;
		},
		ai: {
			damageBonus: true,
			skillTagFilter(player, tag, arg) {
				return arg && arg.target && arg.target.hp > 1 && player.hp > 1 && get.attitude(player, arg.target) < -2;
			},
		},
	},
	yimie2: {
		trigger: { player: "damageEnd" },
		forced: true,
		popup: false,
		charlotte: true,
		sourceSkill: "yimie",
		filter(event, player) {
			return typeof event.yimie_num == "number";
		},
		content() {
			player.recover(trigger.yimie_num);
		},
	},
	ruilve: {
		audio: 2,
		global: "ruilve2",
		zhuSkill: true,
	},
	ruilve2: {
		enable: "phaseUse",
		discard: false,
		lose: false,
		delay: false,
		line: true,
		log: false,
		prepare(cards, player, targets) {
			targets[0].logSkill("ruilve");
		},
		prompt() {
			var player = _status.event.player;
			var list = game.filterPlayer(function (target) {
				return target != player && target.hasZhuSkill("ruilve", player);
			});
			var str = "将一张具有伤害标签的基本牌或锦囊牌交给" + get.translation(list);
			if (list.length > 1) {
				str += "中的一人";
			}
			return str;
		},
		filter(event, player) {
			if (player.group != "jin") {
				return false;
			}
			if (player.countCards("h", lib.skill.ruilve2.filterCard) == 0) {
				return false;
			}
			return game.hasPlayer(function (target) {
				return target != player && target.hasZhuSkill("ruilve", player) && !target.hasSkill("ruilve3");
			});
		},
		filterCard(card) {
			if (!get.tag(card, "damage")) {
				return false;
			}
			var type = get.type(card);
			return type == "basic" || type == "trick";
		},
		visible: true,
		filterTarget(card, player, target) {
			return target != player && target.hasZhuSkill("ruilve", player) && !target.hasSkill("ruilve3");
		},
		content() {
			player.give(cards, target);
			target.addTempSkill("ruilve3", "phaseUseEnd");
		},
		ai: {
			expose: 0.3,
			order: 1,
			result: {
				target: 5,
			},
		},
	},
	ruilve3: {},
	tairan: {
		audio: 2,
		trigger: { player: "phaseEnd" },
		forced: true,
		preHidden: true,
		filter(event, player) {
			return player.hp < player.maxHp || player.countCards("h") < player.maxHp;
		},
		content() {
			"step 0";
			player.addSkill("tairan2");
			if (!player.storage.tairan2) {
				player.storage.tairan2 = 0;
			}
			var num = player.maxHp - player.hp;
			if (num > 0) {
				player.storage.tairan2 = num;
				player.recover(num);
			}
			"step 1";
			if (player.countCards("h") < player.maxHp) {
				player.drawTo(player.maxHp).gaintag = ["tairan"];
			}
		},
	},
	tairan2: {
		mod: {
			aiOrder(player, card, num) {
				if (card.hasGaintag && card.hasGaintag("tairan")) {
					return 10 * num;
				}
			},
			aiValue(player, card, num) {
				if (card.hasGaintag && card.hasGaintag("tairan")) {
					if (card.name !== "wuxie" && (get.type(card) === "basic" || get.type(card, "trick") === "trick")) {
						return num / 64;
					}
					return num / 8;
				}
			},
			aiUseful(player, card, num) {
				return lib.skill.tairan2.mod.aiValue.apply(this, arguments);
			},
		},
		audio: "tairan",
		trigger: { player: "phaseUseBegin" },
		charlotte: true,
		forced: true,
		onremove: true,
		sourceSkill: "tairan",
		content() {
			var map = player.storage.tairan2;
			if (map > 0) {
				player.loseHp(map);
			}
			var hs = player.getCards("h", function (card) {
				return card.hasGaintag("tairan");
			});
			if (hs.length) {
				player.discard(hs);
			}
			player.removeSkill("tairan2");
		},
	},
	baoqie: {
		audio: 2,
		trigger: { player: "showCharacterAfter" },
		forced: true,
		hiddenSkill: true,
		filter(event, player) {
			return event.toShow?.some(i => get.character(i).skills?.includes("baoqie"));
		},
		content() {
			"step 0";
			var card = get.cardPile(function (card) {
				return get.subtype(card, false) == "equip5" && !get.cardtag(card, "gifts");
			});
			if (!card) {
				event.finish();
				return;
			}
			event.card = card;
			player.gain(card, "gain2");
			"step 1";
			if (player.getCards("h").includes(card) && get.subtype(card) == "equip5") {
				player.chooseUseTarget(card).nopopup = true;
			}
		},
	},
	jyishi: {
		audio: 2,
		trigger: { global: ["loseAfter", "loseAsyncAfter"] },
		usable: 1,
		preHidden: true,
		filter(event, player) {
			const target = _status.currentPhase;
			if (!target || !target.isIn() || event.type != "discard" || !target.isPhaseUsing()) {
				return false;
			}
			if (target == player) {
				return false;
			}
			const evt = event.getl(target);
			return evt?.hs?.someInD("d");
		},
		async cost(event, trigger, player) {
			const target = _status.currentPhase,
				cards = trigger.getl(target).hs.filterInD("d");
			event.cards = cards;
			let str = "是否发动【宜室】令" + get.translation(target) + "获得其中一张牌";
			if (cards.length > 1) {
				str += "，然后获得其余的牌";
			}
			str += "？";
			const {
				result: { bool, links },
			} = await player
				.chooseButton([str, cards])
				.set("ai", button => {
					const card = button.link;
					const { player, source } = get.event();
					if (get.attitude(player, source) > 0) {
						return Math.max(1, source.getUseValue(card, null, true));
					}
					const cards = get.event().getParent().cards.slice(0);
					if (cards.length == 1) {
						return -get.value(card);
					}
					cards.remove(card);
					return get.value(cards) - get.value(card) - 2;
				})
				.set("source", target)
				.setHiddenSkill(event.skill);
			event.result = {
				bool: bool,
				targets: [target],
				cost_data: links,
			};
		},
		async content(event, trigger, player) {
			const {
					targets: [target],
					cost_data: links,
				} = event,
				cards = trigger.getl(target).hs.filterInD("d");
			await target.gain(links, "gain2");
			cards.remove(links[0]);
			if (cards.length) {
				await player.gain(cards, "gain2");
			}
		},
	},
	shiduo: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return game.hasPlayer(function (target) {
				return player != target && player.canCompare(target);
			});
		},
		filterTarget(card, player, target) {
			return player != target && player.canCompare(target);
		},
		content() {
			"step 0";
			player.chooseToCompare(target);
			"step 1";
			if (result.bool && target.isAlive()) {
				var num = target.countCards("h");
				if (num > 0) {
					player.gainPlayerCard(target, true, "h", num);
				}
			} else {
				event.finish();
			}
			"step 2";
			var num = Math.floor(player.countCards("h") / 2);
			if (num && target.isAlive()) {
				player.chooseCard("h", num, true, "交给" + get.translation(target) + get.cnNumber(num) + "张牌");
			} else {
				event.finish();
			}
			"step 3";
			if (result.bool && result.cards && result.cards.length) {
				player.give(result.cards, target);
			}
		},
		ai: {
			order: 1,
			result: {
				target(player, target) {
					var delta = target.countCards("h") - player.countCards("h");
					if (delta < 0) {
						return 0;
					}
					return -1 - delta;
				},
			},
		},
	},
	tuishi: {
		audio: 2,
		trigger: { player: "showCharacterAfter" },
		forced: true,
		locked: false,
		hiddenSkill: true,
		filter(event, player) {
			var target = _status.currentPhase;
			return player != target && target && target.isAlive() && event.toShow?.some(i => get.character(i).skills?.includes("tuishi"));
		},
		content() {
			player.addTempSkill("tuishi2");
		},
	},
	tuishi2: {
		trigger: { global: "phaseEnd" },
		direct: true,
		charlotte: true,
		sourceSkill: "tuishi",
		filter(event, player) {
			var target = _status.currentPhase;
			return (
				target != player &&
				target &&
				target.isAlive() &&
				game.hasPlayer(function (current) {
					return current != target && target.inRange(current);
				})
			);
		},
		content() {
			"step 0";
			var target = _status.currentPhase;
			event.target = target;
			player
				.chooseTarget(get.prompt2("tuishi", event.target), function (card, player, target) {
					var source = _status.event.source;
					return source != target && source.inRange(target);
				})
				.set("source", target)
				.set("goon", get.damageEffect(target, player, player) > 0)
				.set("ai", function (target) {
					if (!_status.event.goon) {
						return 0;
					}
					var evt = _status.event;
					return get.effect(target, { name: "sha" }, evt.source, evt.player);
				});
			"step 1";
			if (result.bool) {
				event.target2 = result.targets[0];
				player.logSkill("tuishi");
				player.line2([target, event.target2]);
				game.delayx();
			} else {
				event.finish();
			}
			"step 2";
			target.chooseToUse({
				preTarget: event.target2,
				prompt: "请对" + get.translation(event.target2) + "使用一张【杀】，或受到来自" + get.translation(player) + "的1点伤害",
				filterCard(card, player) {
					return get.name(card) == "sha" && lib.filter.filterCard.apply(this, arguments);
				},
				filterTarget(card, player, target) {
					return target == _status.event.preTarget && lib.filter.filterTarget.apply(this, arguments);
				},
				addCount: false,
			});
			"step 3";
			if (!result.bool) {
				target.damage();
			}
		},
	},
	xinchoufa: {
		audio: "choufa",
		inherit: "choufa",
		content() {
			"step 0";
			player.choosePlayerCard(target, "h", true);
			"step 1";
			player.showCards(result.cards, get.translation(player) + "对" + get.translation(target) + "发动了【筹伐】");
			var type = get.type2(result.cards[0], target),
				hs = target.getCards("h", function (card) {
					return card != result.cards[0] && get.type2(card, target) != type;
				});
			if (hs.length) {
				target.addGaintag(hs, "xinchoufa");
				target.addTempSkill("xinchoufa2", { player: "phaseAfter" });
			}
		},
	},
	xinchoufa2: {
		charlotte: true,
		onremove(player) {
			player.removeGaintag("xinchoufa");
		},
		mod: {
			cardname(card) {
				if (get.itemtype(card) == "card" && card.hasGaintag("xinchoufa")) {
					return "sha";
				}
			},
			cardnature(card) {
				if (get.itemtype(card) == "card" && card.hasGaintag("xinchoufa")) {
					return false;
				}
			},
		},
	},
	choufa: {
		enable: "phaseUse",
		audio: 2,
		usable: 1,
		filter(event, player) {
			return game.hasPlayer(function (current) {
				return lib.skill.choufa.filterTarget(null, player, current);
			});
		},
		filterTarget(card, player, target) {
			return target != player && !target.hasSkill("choufa2") && target.countCards("h") > 0;
		},
		content() {
			"step 0";
			player.choosePlayerCard(target, "h", true);
			"step 1";
			player.showCards(result.cards);
			var type = get.type2(result.cards[0], target);
			target.storage.choufa2 = type;
			target.addTempSkill("choufa2", { player: "phaseAfter" });
		},
		ai: {
			order: 9,
			result: {
				target(player, target) {
					return -target.countCards("h");
				},
			},
		},
	},
	choufa2: {
		onremove: true,
		charlotte: true,
		mark: true,
		intro: { content: "手牌中的非$牌均视为杀" },
		mod: {
			cardname(card, player) {
				if (get.type2(card, false) != player.storage.choufa2) {
					return "sha";
				}
			},
			cardnature(card, player) {
				if (get.type2(card, false) != player.storage.choufa2) {
					return false;
				}
			},
		},
	},
	zhaoran: {
		audio: 2,
		trigger: { player: "phaseUseBegin" },
		preHidden: true,
		content() {
			player.addTempSkill("zhaoran2", "phaseUseAfter");
			var cards = player.getCards("h");
			if (cards.length > 0) {
				player.addShownCards(cards, "visible_zhaoran");
			}
		},
	},
	zhaoran2: {
		audio: "zhaoran",
		group: "zhaoran3",
		sourceSkill: "zhaoran",
		init: (player, skill) => {
			if (!player.storage[skill]) {
				player.storage[skill] = [];
			}
		},
		onremove: true,
		trigger: {
			player: "loseAfter",
			global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"],
		},
		forced: true,
		charlotte: true,
		popup: false,
		filter(event, player, name) {
			if (name == "gainBegin") {
				return true;
			}
			var evt = event.getl(player);
			if (!evt || !evt.hs || !evt.hs.length) {
				return false;
			}
			var list = player.getStorage("zhaoran2");
			for (var i of evt.hs) {
				var suit = get.suit(i, player);
				if (!list.includes(suit) && !player.countCards("h", { suit: suit })) {
					return true;
				}
			}
			return false;
		},
		content() {
			"step 0";
			if (trigger.delay === false) {
				game.delayx();
			}
			"step 1";
			var list = [];
			var suits = get.copy(player.storage.zhaoran2);
			suits.addArray(
				player.getCards("h").map(function (card) {
					return get.suit(card);
				})
			);
			var evt = trigger.getl(player);
			for (var i of evt.hs) {
				var suit = get.suit(i, player);
				if (!suits.includes(suit)) {
					list.add(suit);
				}
			}
			event.count = list.length;
			player.markAuto("zhaoran2", list);
			"step 1";
			event.count--;
			var filterTarget = function (card, player, target) {
				return target != player && target.countDiscardableCards(player, "he") > 0;
			};
			if (
				!game.hasPlayer(function (current) {
					return filterTarget(null, player, current);
				})
			) {
				event._result = { bool: false };
			} else {
				player.chooseTarget(filterTarget, "弃置一名其他角色的一张牌或摸一张牌").set("ai", function (target) {
					var att = get.attitude(player, target);
					if (att >= 0) {
						return 0;
					}
					if (
						target.countCards("he", function (card) {
							return get.value(card) > 5;
						})
					) {
						return -att;
					}
					return 0;
				});
			}
			"step 2";
			if (!result.bool) {
				player.logSkill("zhaoran2");
				player.draw();
			} else {
				var target = result.targets[0];
				player.logSkill("zhaoran2", target);
				player.discardPlayerCard(target, true, "he");
			}
			if (event.count > 0) {
				event.goto(1);
			}
		},
		intro: {
			content: "已因$牌触发过效果",
		},
	},
	zhaoran3: {
		trigger: { player: ["phaseUseEnd", "gainBegin"] },
		forced: true,
		charlotte: true,
		firstDo: true,
		silent: true,
		sourceSkill: "zhaoran",
		content() {
			if (event.triggername == "gainBegin") {
				trigger.gaintag.add("visible_zhaoran");
			} else {
				player.hideShownCards(player.getCards("h"), "visible_zhaoran");
			}
		},
	},
	chengwu: {
		audio: 2,
		zhuSkill: true,
		mod: {
			inRange(from, to) {
				if (!from.hasZhuSkill("chengwu") || from._chengwu) {
					return;
				}
				from._chengwu = true;
				var bool = game.hasPlayer(function (current) {
					return current != from && current != to && current.group == "jin" && from.hasZhuSkill("chengwu", current) && current.inRange(to);
				});
				delete from._chengwu;
				if (bool) {
					return true;
				}
			},
		},
	},
	shiren: {
		audio: 2,
		trigger: { player: "showCharacterAfter" },
		hiddenSkill: true,
		logTarget() {
			return _status.currentPhase;
		},
		filter(event, player) {
			if (!event.toShow?.some(i => get.character(i).skills?.includes("shiren"))) {
				return false;
			}
			var target = _status.currentPhase;
			return target && target != player && target.isAlive() && target.countCards("h") > 0;
		},
		content() {
			var next = game.createEvent("yanxi", false);
			next.player = player;
			next.target = _status.currentPhase;
			next.setContent(lib.skill.yanxi.content);
		},
	},
	yanxi: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		filterTarget(card, player, target) {
			return target != player && target.countCards("h") > 0;
		},
		filter(event, player) {
			return game.hasPlayer(function (current) {
				return current != player && current.countCards("h") > 0;
			});
		},
		content() {
			"step 0";
			event.card = target.getCards("h").randomGet();
			var cards;
			cards = get.cards(2);
			event.cards = cards.concat([event.card]);
			while (cards.length) {
				ui.cardPile.insertBefore(cards.pop().fix(), ui.cardPile.firstChild);
			}
			if (get.mode() == "guozhan") {
				var num = ui.cardPile.childElementCount;
				var num1 = get.rand(1, num - 1),
					num2 = get.rand(1, num - 1);
				if (num1 == num2) {
					if (num1 == 0) {
						num2++;
					} else {
						num1--;
					}
				}
				event.cards = [event.card, ui.cardPile.childNodes[num1], ui.cardPile.childNodes[num2]];
			}
			game.updateRoundNumber();
			event.cards.randomSort();
			game.log(player, "展示了", event.cards);
			event.videoId = lib.status.videoId++;
			var str = get.translation(player) + "对" + get.translation(target) + "发动了【宴戏】";
			game.broadcastAll(
				function (str, id, cards) {
					var dialog = ui.create.dialog(str, cards);
					dialog.videoId = id;
				},
				str,
				event.videoId,
				event.cards
			);
			game.addVideo("showCards", player, [str, get.cardsInfo(event.cards)]);
			game.delay(2);
			"step 1";
			var func = function (id, target) {
				var dialog = get.idDialog(id);
				if (dialog) {
					dialog.content.firstChild.innerHTML = "猜猜哪张是" + get.translation(target) + "的手牌？";
				}
			};
			if (player == game.me) {
				func(event.videoId, target);
			} else if (player.isOnline()) {
				player.send(func, event.videoId, target);
			}
			"step 2";
			var next = player.chooseButton(true);
			next.set("dialog", event.videoId);
			next.set("ai", function (button) {
				if (_status.event.answer) {
					return button.link == _status.event.answer ? 1 : 0;
				}
				return get.value(button.link, _status.event.player);
			});
			if (player.hasSkillTag("viewHandcard", null, target, true)) {
				next.set("answer", card);
			}
			"step 3";
			game.broadcastAll("closeDialog", event.videoId);
			player.addTempSkill("yanxi2");
			var card2 = result.links[0];
			if (card2 == card) {
				player.popup("洗具");
				cards.remove(card2);
				player.$gain2(cards);
				player.gain(cards, "log").gaintag.add("yanxi");
				player.gain(card, target, "bySelf", "give").gaintag.add("yanxi");
			} else {
				player.popup("杯具");
				player.gain(card2, "gain2").gaintag.add("yanxi");
			}
		},
		ai: {
			order: 6,
			result: {
				player: 1,
				target: -0.6,
			},
		},
	},
	yanxi2: {
		mod: {
			ignoredHandcard(card, player) {
				if (card.hasGaintag("yanxi")) {
					return true;
				}
			},
			cardDiscardable(card, player, name) {
				if (name == "phaseDiscard" && card.hasGaintag("yanxi")) {
					return false;
				}
			},
		},
		onremove(player) {
			player.removeGaintag("yanxi");
		},
	},
	sanchen: {
		audio: 2,
		enable: "phaseUse",
		usable(skill, player) {
			return 1 + player.countMark("sanchen_add");
		},
		filter(event, player) {
			var stat = player.getStat("sanchen");
			return game.hasPlayer(function (current) {
				return !stat || !stat.includes(current);
			});
		},
		filterTarget(card, player, target) {
			var stat = player.getStat("sanchen");
			return !stat || !stat.includes(target);
		},
		content() {
			"step 0";
			var stat = player.getStat();
			if (!stat.sanchen) {
				stat.sanchen = [];
			}
			stat.sanchen.push(target);
			if (get.mode() != "guozhan") {
				player.addMark("sanchen", 1, false);
			}
			target.draw(3);
			"step 1";
			if (!target.countCards("he")) {
				event._result = { bool: false };
			} else {
				target.chooseToDiscard("he", true, 3).set("ai", function (card) {
					var list = ui.selected.cards.map(function (i) {
						return get.type2(i);
					});
					if (!list.includes(get.type2(card))) {
						return 7 - get.value(card);
					}
					return -get.value(card);
				});
			}
			"step 2";
			if (result.bool && result.cards && result.cards.length) {
				var list = [];
				for (var i of result.cards) {
					list.add(get.type2(i));
				}
				if (list.length == result.cards.length) {
					target.draw();
					player.addTempSkill(event.name + "_add", "phaseUseAfter");
					player.addMark(event.name + "_add", 1, false);
					if (get.mode() == "guozhan") {
						player.addTempSkills("pozhu");
					}
				}
			} else {
				target.draw();
				player.addTempSkill(event.name + "_add", "phaseUseAfter");
				player.addMark(event.name + "_add", 1, false);
				if (get.mode() == "guozhan") {
					player.addTempSkills("pozhu");
				}
			}
		},
		ai: {
			order: 9,
			threaten: 1.7,
			result: {
				target(player, target) {
					if (target.hasSkillTag("nogain")) {
						return 0.1;
					}
					return Math.sqrt(target.countCards("he"));
				},
			},
		},
		intro: {
			content: "已发动过#次技能",
		},
		marktext: "陈",
		subSkill: {
			add: {
				charlotte: true,
				onremove: true,
			},
		},
	},
	zhaotao: {
		forbid: ["guozhan"],
		audio: 2,
		trigger: { player: "phaseZhunbeiBegin" },
		forced: true,
		juexingji: true,
		skillAnimation: true,
		animationColor: "thunder",
		filter(event, player) {
			return player.countMark("sanchen") > 2;
		},
		content() {
			player.awakenSkill(event.name);
			player.loseMaxHp();
			player.addSkills("pozhu");
		},
		derivation: "pozhu",
		ai: {
			combo: "sanchen",
		},
	},
	pozhu: {
		audio: 2,
		enable: "phaseUse",
		viewAsFilter(player) {
			return player.countCards("hs") > 0;
		},
		viewAs: { name: "chuqibuyi" },
		filterCard: true,
		position: "hs",
		check(card) {
			return 7 - get.value(card);
		},
		group: "pozhu2",
	},
	pozhu2: {
		trigger: { player: "useCardAfter" },
		silent: true,
		sourceSkill: "pozhu",
		filter(event, player) {
			return (
				event.skill == "pozhu" &&
				(get.mode() == "guozhan" ||
					!player.getHistory("sourceDamage", function (evt) {
						return evt.card == event.card;
					}).length)
			);
		},
		content() {
			player.tempBanSkill("pozhu");
		},
	},
	xijue: {
		audio: 2,
		trigger: {
			global: "phaseBefore",
			player: ["enterGame", "showCharacterAfter"],
		},
		forced: true,
		filter(event, player) {
			if (get.mode() == "guozhan") {
				return (
					game
						.getAllGlobalHistory("everything", evt => {
							return evt.name == "showCharacter" && evt.toShow?.some(i => get.character(i).skills?.includes("xijue"));
						})
						.indexOf(event) == 0
				);
			}
			return event.name != "showCharacter" && (event.name != "phase" || game.phaseNumber == 0);
		},
		content() {
			player.addMark("xijue", 4);
		},
		intro: {
			name2: "爵",
			content: "mark",
		},
		derivation: ["xijue_tuxi", "xijue_xiaoguo"],
		group: ["xijue_gain", "xijue_tuxi", "xijue_xiaoguo"],
		subSkill: {
			gain: {
				audio: "xijue",
				trigger: { player: "phaseEnd" },
				forced: true,
				sourceSkill: "xijue",
				filter(event, player) {
					var stat = player.getStat();
					return stat.damage && stat.damage > 0;
				},
				content() {
					player.addMark("xijue", player.getStat().damage);
				},
			},
			tuxi: {
				audio: 2,
				trigger: {
					player: "phaseDrawBegin2",
				},
				direct: true,
				filter(event, player) {
					return (
						event.num > 0 &&
						!event.numFixed &&
						player.hasMark("xijue") &&
						game.hasPlayer(function (target) {
							return player != target && target.countCards("h") > 0;
						})
					);
				},
				content() {
					"step 0";
					var num = trigger.num;
					if (get.mode() == "guozhan" && num > 2) {
						num = 2;
					}
					player.chooseTarget(
						"是否弃置一枚“爵”发动【突袭】？",
						"获得至多" + get.translation(num) + "名角色的各一张手牌，然后少摸等量的牌",
						[1, num],
						function (card, player, target) {
							return target.countCards("h") > 0 && player != target;
						},
						function (target) {
							var att = get.attitude(_status.event.player, target);
							if (target.hasSkill("tuntian")) {
								return att / 10;
							}
							return 1 - att;
						}
					);
					"step 1";
					if (result.bool) {
						result.targets.sortBySeat();
						player.logSkill("xijue_tuxi", result.targets);
						player.removeMark("xijue", 1);
						player.gainMultiple(result.targets);
						trigger.num -= result.targets.length;
					} else {
						event.finish();
					}
					"step 2";
					if (trigger.num <= 0) {
						game.delay();
					}
				},
				ai: {
					expose: 0.2,
				},
			},
			xiaoguo: {
				audio: 2,
				trigger: { global: "phaseJieshuBegin" },
				filter(event, player) {
					return (
						player.hasMark("xijue") &&
						event.player.isAlive() &&
						event.player != player &&
						player.countCards("h", function (card) {
							if (_status.connectMode || get.mode() != "guozhan") {
								return true;
							}
							return get.type(card) == "basic";
						})
					);
				},
				direct: true,
				content() {
					"step 0";
					var nono =
						Math.abs(get.attitude(player, trigger.player)) < 3 ||
						trigger.player.hp > player.countMark("xijue") * 1.5 ||
						trigger.player.countCards("e", function (card) {
							return get.value(card, trigger.player) <= 0;
						});
					if (get.damageEffect(trigger.player, player, player) <= 0) {
						nono = true;
					}
					var next = player.chooseToDiscard(`是否弃置一枚“爵”和一张${get.mode() == "guozhan" ? "基本" : "手"}牌，对${get.translation(trigger.player)}发动【骁果】？`, "h", function (card, player) {
						if (get.mode() != "guozhan") {
							return true;
						}
						return get.type(card, null, player) == "basic";
					});
					next.set("ai", function (card) {
						if (_status.event.nono) {
							return 0;
						}
						return 8 - get.useful(card);
					});
					next.set("logSkill", ["xijue_xiaoguo", trigger.player]);
					next.set("nono", nono);
					"step 1";
					if (result.bool) {
						player.removeMark("xijue", 1);
						var nono = get.damageEffect(trigger.player, player, trigger.player) >= 0;
						trigger.player
							.chooseToDiscard("he", "弃置一张装备牌并令" + get.translation(player) + "摸一张牌，或受到1点伤害", { type: "equip" })
							.set("ai", function (card) {
								if (_status.event.nono) {
									return 0;
								}
								if (_status.event.player.hp == 1) {
									return 10 - get.value(card);
								}
								return 9 - get.value(card);
							})
							.set("nono", nono);
					} else {
						event.finish();
					}
					"step 2";
					if (result.bool) {
						if (get.mode() != "guozhan") {
							player.draw();
						}
					} else {
						trigger.player.damage();
					}
				},
				ai: {
					expose: 0.3,
					threaten: 1.3,
				},
			},
		},
	},
	huishi: {
		audio: 2,
		trigger: { player: "phaseDrawBegin1" },
		filter(event, player) {
			return ui.cardPile.childElementCount % 10 > 0 && !event.numFixed;
		},
		preHidden: true,
		prompt() {
			return get.prompt("huishi") + "（当前牌堆尾数：" + (ui.cardPile.childElementCount % 10) + "）";
		},
		check(event, player) {
			return ui.cardPile.childElementCount % 10 > 3;
		},
		content() {
			"step 0";
			trigger.changeToZero();
			var cards = game.cardsGotoOrdering(get.cards(ui.cardPile.childElementCount % 10)).cards;
			var num = Math.ceil(cards.length / 2);
			var next = player.chooseToMove("慧识：将" + get.cnNumber(num) + "张牌置于牌堆底并获得其余的牌", true);
			next.set("list", [["牌堆顶的展示牌", cards], ["牌堆底"]]);
			next.set("filterMove", function (from, to, moved) {
				if (moved[0].includes(from) && to == 1) {
					return moved[1].length < _status.event.num;
				}
				return true;
			});
			next.set("filterOk", function (moved) {
				return moved[1].length == _status.event.num;
			});
			next.set("num", num);
			next.set("processAI", function (list) {
				var cards = list[0][1].slice(0).sort(function (a, b) {
					return get.value(b) - get.useful(a);
				});
				return [cards, cards.splice(cards.length - _status.event.num)];
			});
			"step 1";
			if (result.bool) {
				var list = result.moved;
				if (list[0].length) {
					player.gain(list[0], "gain2");
				}
				while (list[1].length) {
					ui.cardPile.appendChild(list[1].shift().fix());
				}
			}
		},
	},
	qingleng: {
		audio: 2,
		trigger: { global: "phaseEnd" },
		direct: true,
		preHidden: true,
		filter(event, player) {
			var target = event.player;
			return target != player && target.isIn() && !target.storage.nohp && target.hp + target.countCards("h") >= ui.cardPile.childElementCount % 10 && player.countCards("he") > 0 && player.canUse({ name: "sha", nature: "ice" }, target, false);
		},
		content() {
			"step 0";
			player
				.chooseCard("he", get.prompt("qingleng", trigger.player), "将一张牌当做冰【杀】对其使用", function (card, player) {
					return player.canUse(get.autoViewAs({ name: "sha", nature: "ice" }, [card]), _status.event.target, false);
				})
				.set("target", trigger.player)
				.set("ai", function (card) {
					if (get.effect(_status.event.target, get.autoViewAs({ name: "sha", nature: "ice" }, [card]), player) <= 0) {
						return false;
					}
					return 6 - get.value(card);
				})
				.setHiddenSkill(event.name);
			"step 1";
			if (result.bool) {
				player.useCard(get.autoViewAs({ name: "sha", nature: "ice" }, result.cards), result.cards, false, trigger.player, "qingleng");
				if (!player.storage.qingleng || !player.storage.qingleng.includes(trigger.player)) {
					player.draw();
					player.markAuto("qingleng", [trigger.player]);
					player.storage.qingleng.sortBySeat();
				}
			}
		},
		intro: {
			content: "已对$发动过此技能",
		},
	},
	xuanmu: {
		audio: 2,
		trigger: { player: "showCharacterAfter" },
		forced: true,
		hiddenSkill: true,
		filter(event, player) {
			return event.toShow?.some(i => get.character(i).skills?.includes("xuanmu")) && player != _status.currentPhase;
		},
		content() {
			player.addTempSkill("xuanmu2");
		},
	},
	xuanmu2: {
		trigger: { player: "damageBegin4" },
		forced: true,
		popup: false,
		sourceSkill: "xuanmu",
		content() {
			trigger.cancel();
		},
		ai: {
			effect: {
				target(card, player, target) {
					if (get.tag(card, "damage") && !player.hasSkillTag("jueqing", false, target)) {
						return "zerotarget";
					}
				},
			},
		},
	},
	g_hidden_ai: {
		charlotte: true,
		ai: {
			threaten(player, target) {
				if (get.mode() != "guozhan" && target.isUnseen(2)) {
					return 0.0001;
				}
				return 1;
			},
		},
	},
};

export default skills;
