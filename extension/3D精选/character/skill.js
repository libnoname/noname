import { lib, game, ui, get, ai, _status } from "../../../noname.js";

/** @type { importCharacterConfig['skill'] } */
const skills = {
	//牵招
	dddyuanzhen: {
		audio: 2,
		trigger: { player: "useCardToPlayered" },
		forced: true,
		filter(event, player) {
			return event.target !== player && get.distance(player, event.target) !== 1 && event.isFirstTarget && event.targets.length === 1;
		},
		logTarget: "target",
		*content(event, map) {
			const player = map.player,
				trigger = map.trigger,
				target = trigger.target;
			let result;
			game.delayex();
			if (!target.countCards("he")) {
				result = { bool: false };
			} else {
				result = yield target
					.chooseToDiscard("he", `${get.translation(player)}对你使用了【远振】`, "请弃置一张牌，或点击“取消”令其摸一张牌")
					.set("ai", card => {
						if (get.event("goon")) {
							return 4.5 - get.value(card);
						}
					})
					.set("goon", get.attitude(target, player) > 0);
			}
			if (!result.bool) {
				target.line(player);
				player.draw();
			}
		},
	},
	dddzhishu: {
		audio: 2,
		trigger: { player: "phaseUseBegin" },
		filter(event, player) {
			return player.canMoveCard(null, true);
		},
		check(event, player) {
			return player.canMoveCard(true, true);
		},
		*content(event, map) {
			const player = map.player;
			let result = yield player.moveCard();
			const targets = result.targets;
			const guohe = new lib.element.VCard({
				name: "guohe",
				isCard: true,
			});
			if (targets[0].canUse(guohe, targets[1])) {
				targets[0].useCard(guohe, targets[1], "noai");
			}
		},
	},
	//张邈
	dddxiaxing: {
		audio: 2,
		enable: "chooseToUse",
		hiddenCard(player, name) {
			if (player.hasSkill("dddxiaxing_used")) {
				return false;
			}
			return name === "tao";
		},
		filter(event, player) {
			if (event.type !== "dying") {
				return false;
			}
			if (!player.countCards("he")) {
				return false;
			}
			const evt = get.event().getParent("_save");
			if (!evt || !evt.dying || !evt.dying.isIn()) {
				return false;
			}
			return !player.hasSkill("dddxiaxing_used");
		},
		check: card => {
			return 7 - get.value(card);
		},
		filterCard: true,
		position: "he",
		discard: false,
		delay: false,
		lose: false,
		group: ["dddxiaxing_begin", "dddxiaxing_viewas"],
		prompt() {
			const evt = get.event().getParent("_save");
			return `将一张牌置于牌堆顶，视为${get.translation(evt.dying)}使用一张【桃】`;
		},
		*content(event, map) {
			const player = map.player,
				cards = event.cards;
			player.addTempSkill("dddxiaxing_used", "roundStart");
			game.log(player, "将一张牌置于了牌堆顶");
			player.$throw(cards.length, 1000);
			yield player.lose(cards, ui.cardPile, "insert");
			const evt = event.getParent("_save");
			yield evt.dying.chooseUseTarget("tao", true);
			if (!player.hasMark("dddxiaxing")) {
				player.addMark("dddxiaxing");
			}
		},
		marktext: "侠",
		intro: {
			markcount: () => 0,
			name: "侠行",
			name2: "侠",
			content: "已拥有“侠”标记",
		},
		ai: {
			order: 4,
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
			begin: {
				audio: 2,
				trigger: { global: "phaseZhunbeiBegin" },
				filter(event, player) {
					if (!player.countCards("he")) {
						return false;
					}
					return !player.hasSkill("dddxiaxing_used");
				},
				direct: true,
				*content(event, map) {
					const player = map.player,
						trigger = map.trigger,
						target = trigger.player;
					let result = yield player
						.chooseCard(get.prompt("dddxiaxing"), `将一张牌置于牌堆顶，视为${get.translation(target)}使用一张【酒】`, "he")
						.set("ai", card => {
							if (get.event("goon")) {
								return 5 - get.value(card);
							}
							return 0;
						})
						.set("goon", get.effect(target, { name: "jiu" }, player, player) > 0);
					if (!result.bool) {
						return event.finish();
					}
					const cards = result.cards;
					player.logSkill("dddxiaxing_begin", target);
					player.addTempSkill("dddxiaxing_used", "roundStart");
					game.log(player, "将一张牌置于了牌堆顶");
					player.$throw(cards.length, 1000);
					yield player.lose(cards, ui.cardPile, "insert");
					yield target.chooseUseTarget("jiu", true);
					if (!player.hasMark("dddxiaxing")) {
						player.addMark("dddxiaxing");
					}
				},
			},
			used: { charlotte: true },
			viewas: {
				audio: "dddxiaxing",
				enable: "chooseToUse",
				filter(event, player) {
					if (event.type === "wuxie" || !player.hasMark("dddxiaxing")) {
						return false;
					}
					for (const name of ["sha", "shan"]) {
						if (event.filterCard({ name: name, isCard: true }, player, event)) {
							return true;
						}
					}
					return false;
				},
				chooseButton: {
					dialog(event, player) {
						const vcards = [];
						for (const name of ["sha", "shan"]) {
							const card = { name: name, isCard: true };
							if (event.filterCard(card, player, event)) {
								vcards.push(["基本", "", name]);
							}
						}
						const dialog = ui.create.dialog("侠行", [vcards, "vcard"], "hidden");
						dialog.direct = true;
						return dialog;
					},
					backup(links, player) {
						return {
							filterCard: () => false,
							selectCard: -1,
							viewAs: {
								name: links[0][2],
								isCard: true,
							},
							popname: true,
							precontent() {
								player.logSkill("dddxiaxing_viewas");
								player.clearMark("dddxiaxing");
							},
						};
					},
					prompt(links, player) {
						return "侠行：移去“侠”标记，视为使用一张【" + get.translation(links[0][2]) + "】";
					},
				},
				ai: {
					order(item, player) {
						const event = get.event();
						if (event.filterCard({ name: "sha" }, player, event)) {
							if (
								!player.hasSha() &&
								!game.hasPlayer(function (current) {
									return player.canUse("sha", current) && current.hp === 1 && get.effect(current, { name: "sha" }, player, player) > 0;
								})
							) {
								return 0;
							}
							return 2.95;
						} else {
							return 3.15;
						}
					},
					respondSha: true,
					respondShan: true,
					skillTagFilter(player, tag, arg) {
						if (arg === "respond") {
							return false;
						}
						if (!player.hasMark("dddxiaxing")) {
							return false;
						}
					},
					result: {
						player: 1,
					},
				},
			},
		},
	},
	//张承
	dddjuxian: {
		enable: "phaseUse",
		usable: 2,
		filter(event, player) {
			return !player.hasSkill("dddjuxian_ban");
		},
		chooseButton: {
			dialog(event, player) {
				var dialog = ui.create.dialog("聚贤：请选择一项", "hidden");
				dialog.add([
					[
						["top", "展示一张牌，然后将此牌置于牌堆顶"],
						["hand", "展示一张牌，然后将此牌交给一名其他角色"],
					],
					"textbutton",
				]);
				return dialog;
			},
			filter(button, player) {
				return !player.hasSkill("dddjuxian_" + button.link, null, null, false);
			},
			check(button) {
				return 1;
			},
			backup(links) {
				return get.copy(lib.skill["dddjuxian_" + links[0]]);
			},
			prompt(links) {
				if (links[0] === "top") {
					return "展示一张牌，然后将此牌置于牌堆顶";
				}
				return "展示一张牌，然后将此牌交给一名其他角色";
			},
		},
		ai: {
			order: 10,
			threaten: 1.7,
			result: { player: 1 },
		},
		subSkill: {
			backup: { audio: "dddjuxian" },
			ban: { charlotte: true },
			top: {
				audio: "dddjuxian",
				filterCard: true,
				selectCard: 1,
				position: "he",
				discard: false,
				delay: false,
				lose: false,
				*content(event, map) {
					const player = map.player,
						cards = event.cards;
					player.addTempSkill("dddjuxian_top", "phaseUseAfter");
					player.showCards(cards);
					const color1 = get.color(cards);
					player.$throw(cards, 1000);
					game.log(player, "将", cards, "置于了牌堆顶");
					yield player.lose(cards, ui.cardPile, "insert");
					const targets = game.filterPlayer(target => target.countGainableCards(player, "he"));
					let result;
					if (!targets.length) {
						return event.finish();
					} else if (targets.length === 1) {
						result = { bool: true, targets: targets };
					} else {
						result = yield player
							.chooseTarget(
								"聚贤：获得一名其他角色的一张牌",
								(card, player, target) => {
									if (target === player) {
										return false;
									}
									return target.countGainableCards(player, "he");
								},
								true
							)
							.set("ai", target => {
								const player = get.player();
								return get.effect(target, { name: "shunshou" }, player, player);
							});
					}
					if (!result.bool) {
						return event.finish();
					}
					const target = result.targets[0];
					player.line(target);
					result = yield player.gainPlayerCard(target, "he", true);
					if (!result.bool) {
						return event.finish();
					}
					const cards2 = result.links;
					const color2 = get.color(cards2);
					if (color1 && color2 && color1 !== color2) {
						player.addTempSkill("dddjuxian_ban");
					}
				},
				ai: {
					result: {
						player: 1,
					},
				},
			},
			hand: {
				audio: "dddjuxian",
				filterTarget: lib.filter.notMe,
				filterCard: true,
				selectCard: 1,
				position: "he",
				discard: false,
				delay: false,
				lose: false,
				*content(event, map) {
					const player = map.player,
						cards = event.cards,
						target = event.targets[0];
					player.addTempSkill("dddjuxian_hand", "phaseUseAfter");
					player.showCards(cards);
					const color1 = get.color(cards);
					let result;
					yield player.give(cards, target);
					result = yield player.draw();
					const cards2 = result.filter(i => get.owner(i) === player && get.position(i) === "h");
					if (!cards.length) {
						return event.finish();
					}
					const color2 = get.color(cards2);
					player.showCards(cards2);
					if (color1 && color2 && color1 !== color2) {
						player.addTempSkill("dddjuxian_ban");
					}
				},
				ai: {
					result: {
						player: 1,
						target: 1,
					},
				},
			},
		},
	},
	dddjungui: {
		audio: 2,
		trigger: { player: "phaseJieshuBegin" },
		direct: true,
		*content(event, map) {
			const player = map.player;
			let result = yield player.chooseTarget(get.prompt2("dddjungui"));
			if (!result.bool) {
				return event.finish();
			}
			const target = result.targets[0];
			player.logSkill("dddjungui", target);
			target.draw(2);
			yield target.showHandcards();
			const targetSuitsCount = target
				.getCards("h")
				.map(card => {
					return get.suit(card);
				})
				.toUniqued().length;
			const usedCount = player
				.getHistory("useCard")
				.map(evt => {
					return get.suit(evt.card);
				})
				.toUniqued().length;
			let decreasedCount = 0;
			if (usedCount > 0) {
				const numbers = Array.from({ length: usedCount }, (_, i) => get.cnNumber(i + 1, true));
				result = yield player
					.chooseControl(numbers, "cancel2")
					.set("prompt", `是否令${get.translation(target)}少弃置任意张牌？`)
					.set("ai", () => {
						return get.event("choice");
					})
					.set("choice", get.attitude(player, target) > 0 ? numbers.lastItem : "cancel2");
				if (result.control !== "cancel") {
					decreasedCount = result.index + 1;
					game.log(player, "选择令", target, "少弃置", get.cnNumber(decreasedCount), "张牌");
				}
			}
			const toDiscardNum = targetSuitsCount - decreasedCount;
			if (toDiscardNum <= 0) {
				return event.finish();
			}
			target
				.chooseToDiscard(`隽轨：请弃置${get.cnNumber(toDiscardNum)}张花色不同的手牌`, toDiscardNum, true, (card, player) => {
					const suit = get.suit(card);
					for (const cardx of ui.selected.cards) {
						if (get.suit(cardx) === suit) {
							return false;
						}
					}
					return true;
				})
				.set("complexCard", true);
		},
	},
	//刘宠
	dddjinggou: {
		audio: 2,
		trigger: { player: "useCardAfter" },
		forced: true,
		filter(event, player) {
			if (get.type(event.card) !== "equip") {
				return false;
			}
			if (get.subtype(event.card) !== "equip1") {
				return false;
			}
			const range = player.getAttackRange();
			return !game.hasPlayer(current => {
				return current.getAttackRange() > range;
			});
		},
		direct: true,
		*content(event, map) {
			const player = map.player;
			let result = yield player.chooseTarget("精彀：对一名其他角色造成1点伤害", true, lib.filter.notMe).set("ai", target => {
				var player = get.player();
				return get.damageEffect(target, player, player);
			});
			if (result.bool) {
				const target = result.targets[0];
				player.logSkill("dddjinggou", target);
				target.damage();
			}
		},
	},
	dddmoyan: {
		audio: 2,
		trigger: { global: "roundStart" },
		*content(event, map) {
			const player = map.player;
			const cards = game.cardsGotoOrdering(get.cards(3)).cards;
			yield player.showCards(cards, `${get.translation(player)}发动了【末焱】`);
			let result = yield player.chooseTarget("末焱：选择一名角色获得其中至少一张牌").set("ai", target => get.attitude(get.player(), target));
			if (!result.bool) {
				return event.finish();
			}
			const target = result.targets[0];
			result = yield target.chooseButton(["末焱：获得至少一张牌", cards], true, [1, cards.length]).set("ai", button => {
				return get.value(button.link);
			});
			if (!result.bool) {
				return event.finish();
			}
			const gains = result.links;
			target.gain(gains, "gain2");
			player.setStorage("dddmoyan_target", [target, gains.length]);
			player.addTempSkill("dddmoyan_target", "roundStart");
		},
		subSkill: {
			target: {
				onremove: true,
				trigger: { player: "damageBegin3" },
				filter(event, player) {
					const info = player.getStorage("dddmoyan_target");
					return info[0] && info[0].isIn() && info[0].countCards("h") <= info[1];
				},
				forced: true,
				charlotte: true,
				content() {
					trigger.increase("num");
				},
			},
		},
	},
	//罗宪
	dddshilie: {
		audio: 2,
		enable: "chooseToUse",
		hiddenCard(player, name) {
			if (!player.countCards("h")) {
				return false;
			}
			return name === "sha" || name === "shan";
		},
		filter(event, player) {
			if (event.type === "wuxie" || !_status.currentPhase) {
				return false;
			}
			if (!player.countCards("h") || player.hasSkill("dddshilie_used", null, null, false)) {
				return false;
			}
			for (var name of ["sha", "shan"]) {
				if (event.filterCard({ name: name, isCard: true }, player, event)) {
					return true;
				}
			}
			return false;
		},
		chooseButton: {
			dialog(event, player) {
				var vcards = [];
				for (var name of ["sha", "shan"]) {
					var card = { name: name, isCard: true };
					if (event.filterCard(card, player, event)) {
						vcards.push(["基本", "", name]);
					}
				}
				const dialog = ui.create.dialog("示烈", [vcards, "vcard"], "hidden");
				dialog.direct = true;
				return dialog;
			},
			check(button) {
				return 1;
			},
			backup(links, player) {
				return {
					filterCard(card) {
						return !get.is.shownCard(card);
					},
					filterOk: () => {
						return (
							ui.selected.cards
								.map(card => {
									return get.number(card);
								})
								.reduce((p, c) => {
									return p + c;
								}, 0) >=
							get.player().getHp() + (_status.currentPhase ? _status.currentPhase.getHp() : 0)
						);
					},
					selectCard: [1, Infinity],
					viewAs: {
						name: links[0][2],
						isCard: true,
					},
					popname: true,
					ignoreMod: true,
					ai1(card) {
						const need = get.player().getHp() + (_status.currentPhase ? _status.currentPhase.getHp() : 0);
						let num = 0;
						for (var i = 0; i < ui.selected.cards.length; i++) {
							num += get.number(ui.selected.cards[i]);
						}
						if (num + get.number(card) === need) {
							return 20 - get.value(card);
						}
						if (ui.selected.cards.length === 0) {
							var cards = _status.event.player.getCards("h");
							for (var i = 0; i < cards.length; i++) {
								for (var j = i + 1; j < cards.length; j++) {
									if (cards[i].number + cards[j].number >= need) {
										if (cards[i] === card || cards[j] === card) {
											return 15 - get.value(card);
										}
									}
								}
							}
						}
						return 0.1;
					},
					log: false,
					precontent() {
						"step 0";
						player.logSkill("dddshilie");
						player.addTempSkill("dddshilie_used");
						var cards = event.result.cards.slice();
						player.addShownCards(cards, "visible_dddshilie");
						player.showCards(cards, get.translation(player) + "发动了【示烈】");
						if (
							cards
								.map(card => {
									return get.number(card);
								})
								.reduce((p, c) => {
									return p + c;
								}, 0) ==
							player.getHp() + (_status.currentPhase ? _status.currentPhase.getHp() : 0)
						) {
							player.draw(cards.length);
						}
						event.result.card = new lib.element.VCard({
							name: event.result.card.name,
							isCard: true,
						});
						event.result.cards = [];
						game.delayx();
					},
				};
			},
			prompt(links, player) {
				return `###示烈###明置任意张点数之和不小于${player.getHp() + (_status.currentPhase ? _status.currentPhase.getHp() : 0)}的牌，视为使用【${get.translation(links[0][2])}】`;
			},
		},
		subSkill: { used: { charlotte: true } },
		ai: {
			order(item, player) {
				const evt = get.event();
				for (var name of ["sha", "shan"]) {
					if (evt.filterCard({ name: name }, player, evt)) {
						return get.order({ name: name }) + 0.1;
					}
				}
				return 1;
			},
			respondSha: true,
			respondShan: true,
			skillTagFilter(player, tag, arg) {
				if (!player.countCards("h")) {
					return false;
				}
			},
			result: {
				player(player) {
					return 1;
				},
			},
		},
	},
	//李娥
	dddyeshen: {
		trigger: { global: "phaseJieshuBegin" },
		logTarget: "player",
		prompt2(event, player) {
			var num = player.countMark("dddyeshen");
			var str = "亮出牌堆底的" + get.cnNumber(3 - num) + "张牌，然后其将其中的一张牌当作【铁索连环】使用或打出。";
			if (num >= 2) {
				str += "然后你受到1点火属性伤害并重置此技能。";
			}
			return str;
		},
		check(event, player) {
			if (player.countMark("dddyeshen") >= 2 && get.damageEffect(player, player, player, "fire") < 0) {
				return false;
			}
			return get.attitude(player, event.player) > 0;
		},
		content() {
			"step 0";
			event.target = trigger.player;
			var cards = get.bottomCards(3 - player.countMark("dddyeshen"));
			event.cards = cards;
			game.cardsGotoOrdering(cards);
			player.showCards(cards, get.translation(player) + "对" + get.translation(target) + "发动了【冶身】");
			if (!cards.some(card => get.color(card) === "black")) {
				event.goto(4);
			}
			"step 1";
			if (target.isIn()) {
				var blacks = cards.filter(card => get.color(card) === "black");
				if (blacks.length > 1) {
					target.chooseButton(["选择一张牌当作【铁索连环】使用或重铸", blacks], true).set("ai", button => get.translation(button.link.name).length);
				} else {
					event._result = {
						bool: true,
						links: blacks,
					};
				}
			} else {
				event.goto(4);
			}
			"step 2";
			if (result.bool) {
				event.links = result.links.slice(0);
				var card = get.autoViewAs({ name: "tiesuo" }, result.links);
				var maxNum = get.translation(result.links[0].name).length;
				if (!game.hasPlayer(current => target.canUse(card, current))) {
					event._result = { bool: false };
				} else {
					target
						.chooseTarget(
							"请选择【铁索连环】的目标，或点“取消”重铸",
							function (card, player, target) {
								var card = _status.event.card;
								return player.canUse(card, target);
							},
							[1, Math.min(maxNum, game.countPlayer())]
						)
						.set("card", card)
						.set("ai", function (target) {
							var player = _status.event.player,
								card = _status.event.card;
							return get.effect_use(target, card, player, player);
						});
				}
			}
			"step 3";
			if (result.bool && result.targets.length > 0) {
				var card = get.autoViewAs({ name: "tiesuo" }, event.links);
				target.useCard(result.targets, card, event.links);
			} else {
				target.recast(event.links, (player, cards) => game.cardsDiscard(cards));
			}
			"step 4";
			for (var card of cards) {
				if (get.position(card, true) === "o") {
					ui.cardPile.insertBefore(card, ui.cardPile.firstChild);
				}
			}
			"step 5";
			var num = player.countMark("dddyeshen");
			if (num < 2) {
				player.addMark("dddyeshen", 1, false);
				game.log(player, "的", "#g【冶身】", "的亮出牌数-1");
			} else {
				player.removeMark("dddyeshen", num, false);
				game.log(player, "还原了", "#g【冶身】", "的亮出牌数");
				player.damage("fire", "nocard");
			}
		},
	},
	dddqiaoduan: {
		trigger: { global: "linkAfter" },
		usable: 1,
		filter(event, player) {
			const num = game.countPlayer(current => current.isLinked());
			if (event.player.isLinked()) {
				return player.countCards("he") >= num && game.hasPlayer(current => current.isDamaged());
			} else {
				return num > 0;
			}
		},
		async cost(event, trigger, player) {
			const num = game.countPlayer(current => current.isLinked());
			const { skill } = event;
			if (trigger.player.isLinked()) {
				event.result = await player
					.chooseCardTarget({
						prompt: get.prompt(skill),
						prompt2: `操作提示：选择${get.cnNumber(num)}张牌和一名已受伤的角色。将这些牌置于牌堆底（先选择的在上），然后该角色回复1点体力。`,
						filterCard: true,
						selectCard: num,
						filterTarget: (card, player, target) => target.isDamaged(),
						ai1: card => 5 - get.value(card),
						ai2: target => {
							const player = get.player();
							return get.recoverEffect(target, player, player);
						},
					})
					.forResult();
			} else {
				event.result = await player
					.chooseTarget(get.prompt(skill), [1, num], `令至多${get.cnNumber(num)}名角色各摸一张牌`)
					.set("ai", target => {
						const player = get.player();
						let att = get.attitude(player, target) / Math.sqrt(1 + target.countCards("h"));
						if (target.hasSkillTag("nogain")) {
							att /= 10;
						}
						return att;
					})
					.forResult();
			}
		},
		async content(event, trigger, player) {
			const { targets, cards } = event;
			if (cards?.length) {
				await player.loseToDiscardpile(cards, ui.cardPile);
				await targets[0].recover();
			} else {
				await game.asyncDraw(targets.sortBySeat());
				await game.delayex();
			}
		},
	},
	//孙亮
	ddddiedang: {
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			if (player.storage.ddddiedang) {
				return player.countCards("he") >= 3;
			}
			return true;
		},
		filterCard: true,
		position: "he",
		selectCard() {
			var player = _status.event.player;
			return player.storage.ddddiedang ? 3 : 0;
		},
		prompt() {
			var player = _status.event.player;
			if (player.storage.ddddiedang) {
				return "弃置三张牌，然后摸一张牌";
			}
			return "摸三张牌，然后弃置一张牌";
		},
		check: card => 5 - get.value(card),
		content() {
			"step 0";
			if (player.storage.ddddiedang) {
				player.draw();
			} else {
				player.draw(3);
				player.chooseToDiscard(true, "he");
			}
			"step 1";
			if (player.isMaxHandcard() || player.isMinHandcard()) {
				player.storage.ddddiedang = !player.storage.ddddiedang;
			}
		},
		ai: {
			order: 1,
			result: {
				player(player) {
					if (ui.selected.cards.length) {
						var num = 1 + player.countCards("h", card => !ui.selected.cards.includes(card));
						if (
							!game.hasPlayer(current => {
								return current !== player && current.countCards("h") > num;
							}) ||
							!game.hasPlayer(current => {
								return current !== player && current.countCards("h") < num;
							})
						) {
							return 1;
						}
						return -1;
					}
					return 1;
				},
			},
		},
	},
	dddanliu: {
		trigger: { player: "phaseJieshuBegin" },
		direct: true,
		filter(event, player) {
			return (
				player.countCards("h") > 0 &&
				game.hasPlayer(function (current) {
					return current !== player && current.countCards("h") > 0;
				})
			);
		},
		content() {
			"step 0";
			player
				.chooseTarget(get.prompt2("dddanliu"), function (card, player, target) {
					return target !== player && target.countCards("h") > 0;
				})
				.set("ai", function (target) {
					return get.attitude(get.player(), target) * Math.sqrt(1 + target.countCards("h"));
				});
			"step 1";
			if (result.bool) {
				var target = result.targets[0];
				player.logSkill("dddanliu", target);
				event.target = target;
			} else {
				event.finish();
			}
			"step 2";
			player
				.choosePlayerCard(target, true, "h", "visible", [0, 1])
				.set("filterOk", () => ui.selected.buttons.length > 0)
				.set("ai", button => {
					var player = get.player(),
						target = _status.event.target;
					var color = get.color(button.link);
					if (
						player.hasCard(function (card) {
							return get.color(card) === color;
						}, "h")
					) {
						if (color === "red") {
							return get.recoverEffect(player, player, player) + 2 / Math.max(2, get.value(button.link));
						}
						if (color === "black") {
							return 2 * get.effect(target, { name: "draw" }, target, player) + 2 / Math.max(2, get.value(button.link));
						}
					}
					return get.value(button.link) / 3;
				});
			"step 3";
			if (result.bool) {
				event.card1 = result.cards[0];
				target
					.choosePlayerCard(player, true, "h", "visible", [0, 1], get.translation(player) + "选择了你的" + get.translation(event.card1) + "。请选择其的一张牌")
					.set("ai", function (button) {
						var evt = _status.event.getParent();
						var player = evt.target,
							card = evt.card1,
							source = evt.player;
						var color = get.color(card);
						if (get.attitude(player, target) > 0) {
							if (get.color(button.link) === color) {
								return 20 - get.value(card);
							}
							return -get.value(card);
						} else {
							if (get.color(button.link) === "black") {
								return 20 + get.value(card);
							}
							return get.value(card);
						}
					})
					.set("filterOk", () => ui.selected.buttons.length > 0);
			}
			"step 4";
			if (result.bool) {
				event.card2 = result.cards[0];
				var color = get.color(event.card1);
				if (color !== "none" && get.color(event.card2) === color) {
					event.color = color;
					var next = player.chooseBool("是否与" + get.translation(target) + "交换展示牌");
					var prompt2 = "用" + get.translation(event.card1) + "交换对方的" + get.translation(event.card2);
					if (color === "black") {
						prompt2 += "，然后对方摸两张牌";
						next.set("goon", 2 * get.effect(target, { name: "draw" }, target, player) > 0);
					} else if (color === "red" && player.isDamaged()) {
						prompt2 += "，然后你回复1点体力";
						next.set("goon", get.recoverEffect(player, player, player) > 0);
					}
					next.set("prompt2", prompt2);
					next.set("ai", () => Boolean(_status.event.goon));
				} else {
					event.finish();
				}
			}
			"step 5";
			if (result.bool) {
				player.swapHandcards(target, [event.card2], [event.card1]);
				if (event.color === "black") {
					target.draw(2);
				} else if (event.color === "red") {
					player.recover();
				}
			}
		},
	},
	dddguiying: {
		zhuSkill: true,
		trigger: { player: "phaseZhunbeiBegin" },
		direct: true,
		filter(event, player) {
			return (
				player.hasZhuSkill("dddguiying") &&
				game.hasPlayer(function (current) {
					return current !== player && current.group === "wu" && player.hasZhuSkill("dddguiying", current) && current.countCards("h") > 0;
				})
			);
		},
		gainEffect(player) {
			var gainers = game.filterPlayer(current => current.countCards("ej"));
			if (!gainers.length) {
				return 0;
			}
			var min = Math.min.apply(
				Math,
				gainers.map(current => {
					return Math.min.apply(
						Math,
						current.getCards("ej").map(function (card) {
							return get.number(card, current);
						})
					);
				})
			);
			return Math.max.apply(
				Math,
				game
					.filterPlayer(function (target) {
						return target.hasCard(function (card) {
							return get.number(card, target) === min && lib.filter.canBeGained(card, player, target);
						}, "ej");
					})
					.map(function (target) {
						var cards = target.getCards("ej", function (card) {
								return get.number(card, target) === min && lib.filter.canBeGained(card, player, target);
							}),
							att = get.attitude(player, target);
						return Math.max.apply(
							Math,
							cards.map(card => {
								if (target.getCards("j").includes(card)) {
									var efff = get.effect(
										target,
										{
											name: card.viewAs || card.name,
											cards: [card],
										},
										player,
										player
									);
									if (efff > 0) {
										return -0.5 * att;
									}
									if (efff === 0) {
										return 0;
									}
									return 1.5 * att;
								}
								if (target.getCards("e").includes(card)) {
									var evalue = get.value(card, target);
									if (target.hasSkillTag("noe")) {
										if (evalue >= 7) {
											return (-evalue / 6) * att;
										}
										return (-evalue / 10) * att;
									}
									return (-evalue / 3) * att;
								}
							})
						);
					})
			);
		},
		content() {
			"step 0";
			event.targets = game
				.filterPlayer(function (current) {
					return current !== player && current.group === "wu" && player.hasZhuSkill("dddguiying", current);
				})
				.sortBySeat();
			if (!event.targets.length) {
				event.finish();
			}
			"step 1";
			var target = event.targets.shift();
			event.target = target;
			if (target.isIn() && target.group === "wu" && target.countCards("h") > 0) {
				target
					.chooseBool("归萤：是否响应" + get.translation(player) + "的主公技？", "你可以展示所有手牌，将点数最大的牌交给该角色；然后你可以获得场上点数最小的一张牌")
					.set("ai", function () {
						var player = get.player(),
							source = _status.event.getParent().player;
						if (_status.event.gainEffect <= 0) {
							return 0;
						}
						return get.attitude(player, source) > 0;
					})
					.set("gainEffect", lib.skill.dddguiying.gainEffect(target));
			} else {
				event.goto(7);
			}
			"step 2";
			if (result.bool) {
				target.logSkill("dddguiying", player);
				target.showHandcards(get.translation(target) + "响应了〖归萤〗");
			} else {
				event.goto(7);
			}
			"step 3";
			if (target.isIn()) {
				var cards = target.getCards("he");
				if (!cards.length) {
					event.goto(7);
				}
				var max = Math.max.apply(
					Math,
					cards.map(card => get.number(card, target))
				);
				var gives = cards.filter(card => get.number(card, target) === max);
				if (gives.length <= 1) {
					event._result = { bool: true, cards: gives };
				} else {
					target
						.chooseCard("he", true, "选择给出一张点数最大的牌", function (card) {
							return _status.event.cards.includes(card);
						})
						.set("cards", gives);
				}
			} else {
				event.goto(7);
			}
			"step 4";
			if (result.bool) {
				target.give(result.cards, player, "visible");
			} else {
				event.goto(7);
			}
			"step 5";
			var gainers = game.filterPlayer(current => current.countCards("ej"));
			if (target.isIn() && gainers.length > 0) {
				var min = Math.min.apply(
					Math,
					gainers.map(current => {
						return Math.min.apply(
							Math,
							current.getCards("ej").map(function (card) {
								return get.number(card, current);
							})
						);
					})
				);
				target
					.chooseTarget("是否获得场上点数最小的一张牌？", function (card, player, target) {
						var num = _status.event.minNum;
						return target.hasCard(function (card) {
							return get.number(card, target) === num && lib.filter.canBeGained(card, player, target);
						}, "ej");
					})
					.set("minNum", min)
					.set("ai", function (target) {
						var player = get.player(),
							min = _status.event.minNum;
						var cards = target.getCards("ej", function (card) {
								return get.number(card, target) === min && lib.filter.canBeGained(card, player, target);
							}),
							att = get.attitude(player, target);
						return Math.max.apply(
							Math,
							cards.map(card => {
								if (target.getCards("j").includes(card)) {
									var efff = get.effect(
										target,
										{
											name: card.viewAs || card.name,
											cards: [card],
										},
										player,
										player
									);
									if (efff > 0) {
										return -0.5 * att;
									}
									if (efff === 0) {
										return 0;
									}
									return 1.5 * att;
								}
								if (target.getCards("e").includes(card)) {
									var evalue = get.value(card, target);
									if (target.hasSkillTag("noe")) {
										if (evalue >= 7) {
											return (-evalue / 6) * att;
										}
										return (-evalue / 10) * att;
									}
									return (-evalue / 3) * att;
								}
							})
						);
					});
			} else {
				event.goto(7);
			}
			"step 6";
			if (result.bool) {
				var target2 = result.targets[0];
				target.line(target2, "green");
				var min = Math.min.apply(
						Math,
						target2.getCards("ej").map(function (card) {
							return get.number(card, target2);
						})
					),
					cards = target2.getCards("ej", card => get.number(card, target2) === min);
				if (cards.length <= 1) {
					target.gain(cards, target2, "give", "bySelf");
				} else {
					target
						.gainPlayerCard(target2, "ej", true)
						.set("filterButton", function (button) {
							return _status.event.cards.includes(button.link);
						})
						.set("cards", cards);
				}
			}
			"step 7";
			if (targets.length > 0) {
				event.goto(1);
			}
		},
	},
	//王伉吕凯
	dddbingjian: {
		enable: ["chooseToUse", "chooseToRespond"],
		filter(event, player) {
			if (event.type === "wuxie") {
				return false;
			}
			if (player.countMark("dddbingjian_used") >= 2) {
				return false;
			}
			if (player.countCards("h") === 2) {
				return false;
			}
			return (
				event.filterCard(
					{
						name: "sha",
						isCard: true,
					},
					player,
					event
				) ||
				event.filterCard(
					{
						name: "shan",
						isCard: true,
					},
					player,
					event
				)
			);
		},
		chooseButton: {
			dialog(event, player) {
				return ui.create.dialog("并肩", [["sha", "shan"], "vcard"], "hidden");
			},
			filter(button, player) {
				if (ui.selected.buttons.length) {
					if (typeof button.link === typeof ui.selected.buttons[0].link) {
						return false;
					}
				}
				return _status.event.getParent().filterCard({
					name: button.link[2],
					isCard: true,
				});
			},
			check(button) {
				return 1;
			},
			backup(links, player) {
				var skill = {
					viewAs: {
						name: links[0][2],
						suit: "none",
						number: null,
						isCard: true,
					},
					log: false,
				};
				var num = 2 - player.countCards("h");
				if (num > 0) {
					skill.draw = num;
					skill.filterCard = function () {
						return false;
					};
					skill.selectCard = -1;
					skill.precontent = lib.skill.dddbingjian.content_draw;
				} else {
					skill.selectCard = -num;
					skill.ignoreMod = true;
					skill.filterCard = lib.filter.cardDiscardable;
					skill.precontent = lib.skill.dddbingjian.content_discard;
					skill.check = function (card) {
						return 5 - get.value(card);
					};
				}
				return skill;
			},
			prompt(links, player) {
				var num = 2 - player.countCards("h");
				if (num > 0) {
					return "摸" + get.cnNumber(num) + "张牌并视为使用" + get.translation(links[0][2]);
				} else {
					return "弃置" + get.cnNumber(-num) + "张牌并视为使用" + get.translation(links[0][2]);
				}
			},
		},
		ai: {
			pretao: true,
			order(item, player) {
				if (player.countCards("h") < 4) {
					return get.order({ name: "sha" }, player) + 0.2;
				}
				return 1;
			},
			result: { player: 1 },
		},
		content_draw() {
			"step 0";
			player.logSkill("dddbingjian");
			player.draw(lib.skill.dddbingjian_backup.draw);
			player.addTempSkill("dddbingjian_used");
			player.addMark("dddbingjian_used", 1, false);
			"step 1";
			player.chooseTarget("是否令一名其他角色摸等量的牌？", lib.filter.notMe).set("ai", target => {
				var player = get.player();
				return get.effect(target, { name: "draw" }, player, player);
			});
			"step 2";
			if (result.bool) {
				var target = result.targets[0];
				player.line(target, "green");
				target.draw(lib.skill.dddbingjian_backup.draw);
			}
		},
		content_discard() {
			"step 0";
			player.logSkill("dddbingjian");
			player.discard(event.result.cards);
			event.num = event.result.cards.length;
			player.addTempSkill("dddbingjian_used");
			player.addMark("dddbingjian_used", 1, false);
			event.result.card = {
				name: event.result.card.name,
				isCard: true,
			};
			event.result.cards = [];
			"step 1";
			player
				.chooseTarget("是否弃置一名其他角色等量的牌？", lib.filter.notMe)
				.set("ai", target => {
					var player = get.player(),
						num = target.countCards("he") - get.event("num");
					if (num >= 0) {
						num = 1;
					} else {
						num = 1 - num / 5;
					}
					var eff = get.effect(target, { name: "guohe_copy2" }, player, player);
					return eff / num;
				})
				.set("num", event.num);
			"step 2";
			if (result.bool) {
				var target = result.targets[0];
				player.line(target, "fire");
				player.discardPlayerCard(target, "he", true, event.num);
			}
		},
		content_draw_old() {
			"step 0";
			player.logSkill("dddbingjian");
			player.addTempSkill("dddbingjian_round", "roundStart");
			player.draw(lib.skill.dddbingjian_backup.draw);
			"step 1";
			player.chooseTarget("是否令一名角色本轮内不能使用或打出" + get.translation(event.result.card) + "？").set("ai", function (target) {
				var player = _status.event.player;
				return -get.attitude(player, target) * get.threaten(target, player) * Math.sqrt(1 + target.countCards("h"));
			});
			"step 2";
			if (result.bool) {
				var target = result.targets[0];
				player.line(target, "fire");
				player.chat("你不许使用" + get.translation(event.result.card));
				target.addTempSkill("dddbingjian_blocker", "roundStart");
				target.markAuto("dddbingjian_blocker", [event.result.card.name]);
				game.delayx();
			}
		},
		content_discard_old() {
			"step 0";
			player.logSkill("dddbingjian");
			player.discard(event.result.cards);
			event.result.card = {
				name: event.result.card.name,
				isCard: true,
			};
			event.result.cards = [];
			"step 1";
			var hs = player.countCards("h");
			if (!game.hasPlayer(current => current.countCards("h") !== hs)) {
				event.finish();
			} else {
				player
					.chooseTarget("是否令一名角色将手牌调整至" + get.cnNumber(player.countCards("h")) + "张？", function (card, player, target) {
						return target.countCards("h") !== player.countCards("h");
					})
					.set("ai", function (target) {
						var player = _status.event.player,
							num = target.countCards("h") - player.countCards("h");
						if (num > 0) {
							return get.attitude(player, target) * Math.sqrt(1 + Math.abs(num));
						}
						return -get.attitude(player, target) * Math.sqrt(-num);
					});
			}
			"step 2";
			if (result.bool) {
				var target = result.targets[0];
				player.line(target, "fire");
				var num = target.countCards("h") - player.countCards("h");
				if (num > 0) {
					target.chooseToDiscard("h", true, num);
				} else {
					target.draw(Math.min(5, -num));
				}
			}
		},
		subSkill: {
			round: { charlotte: true },
			blocker: {
				charlotte: true,
				mod: {
					cardEnabled(card, player) {
						if (player.getStorage("dddbingjian_blocker").includes(card.name)) {
							return false;
						}
					},
					cardRespondable(card, player) {
						if (player.getStorage("dddbingjian_blocker").includes(card.name)) {
							return false;
						}
					},
					cardSavable(card, player) {
						if (player.getStorage("dddbingjian_blocker").includes(card.name)) {
							return false;
						}
					},
				},
				mark: true,
				intro: { content: "本轮内不能使用或打出$" },
			},
			used: {
				charlotte: true,
				onremove: true,
			},
		},
	},
	//梁习
	dddtongyu: {
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return player.countCards("hs") > 0;
		},
		viewAs: {
			name: "wugu",
		},
		selectCard: [1, 4],
		filterCard(card) {
			var suit = get.suit(card);
			if (suit === "none") {
				return false;
			}
			if (!ui.selected.cards.length) {
				return true;
			}
			for (var card of ui.selected.cards) {
				if (get.suit(card) === suit) {
					return false;
				}
			}
			return true;
		},
		complexCard: true,
		position: "hs",
		prompt: "将任意张花色不同的牌当做【五谷丰登】使用",
		check(card) {
			return 5 - get.value(card);
		},
		precontent() {
			if (!event.result.card.storage) {
				event.result.card.storage = {};
			}
			event.result.card.storage.chooseDirection = true;
			event.result.card.storage.extraCardsNum = event.result.cards.length;
			player.addTempSkill("dddtongyu_effect");
		},
		ai: {
			order: 1,
		},
		subSkill: {
			effect: {
				trigger: { global: "useCardToTargeted" },
				forced: true,
				charlotte: true,
				popup: false,
				filter(event, player) {
					return event.skill === "dddtongyu" && event.isFirstTarget;
				},
				content() {
					"step 0";
					event.targets = trigger.targets.slice().sortBySeat(_status.currentPhase || player);
					"step 1";
					var target = targets.shift();
					event.target = target;
					if (!target.isUnderControl(true) && !target.isOnline()) {
						game.delayx();
					}
					target
						.chooseControl()
						.set("choiceList", ["本回合不能使用或打出手牌", "令" + get.translation(trigger.card) + "对自己无效"])
						.set("ai", function () {
							var player = _status.event.player;
							var source = _status.event.getTrigger().player;
							return player === source ? 1 : 0;
						});
					"step 2";
					if (result.index === 0) {
						target.chat("接受五谷");
						target.addTempSkill("dddtongyu_blocker");
						game.log(target, "本回合不能使用或打出手牌");
					} else {
						target.chat("拒绝五谷");
						trigger.excluded.add(target);
						var evt = trigger.getParent();
						if (!evt.dddtongyu_targets) {
							evt.dddtongyu_targets = [];
						}
						evt.dddtongyu_targets.add(target);
						game.log(target, "令", trigger.card, "对其无效");
					}
					if (targets.length) {
						event.goto(1);
					}
				},
				group: "dddtongyu_give",
			},
			give: {
				trigger: { player: "wuguRemained" },
				direct: true,
				filter(event, player) {
					if (event.skill !== "dddtongyu" || event.remained.filterInD().length === 0) {
						return false;
					}
					var list = event.getParent().dddtongyu_targets;
					return list?.some(target => target.isIn());
				},
				content() {
					"step 0";
					event.cards = trigger.remained.filterInD();
					player
						.chooseTarget("仝御：令一名角色获得" + get.translation(event.cards), function (card, player, target) {
							return _status.event.targets.includes(target);
						})
						.set("targets", trigger.getParent().dddtongyu_targets)
						.set("ai", function (target) {
							var att = get.attitude(_status.event.player, target);
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
					"step 1";
					if (result.bool) {
						var target = result.targets[0];
						player.logSkill("dddtongyu_give", target);
						target.gain(cards, "gain2");
					}
				},
			},
			blocker: {
				mark: true,
				intro: { content: "本回合不能使用或打出手牌" },
				mod: {
					cardEnabled2(card) {
						if (get.position(card) === "h") {
							return false;
						}
					},
				},
			},
		},
	},
	dddzhilian: {
		trigger: { global: "phaseEnd" },
		direct: true,
		filter(event, player) {
			var targets = game.filterPlayer2(function (current) {
				return current.getHistory("useCard").length + current.getHistory("respond").length > 0;
			});
			if (!targets.includes(player) || !targets.some(target => target !== player && target.hasSex("male"))) {
				return false;
			}
			return targets.length === 2 && !targets.some(target => !target.isIn());
		},
		content() {
			"step 0";
			var targets = game
				.filterPlayer(function (current) {
					return current.getHistory("useCard").length + current.getHistory("respond").length > 0;
				})
				.sortBySeat(trigger.player);
			event.targets = targets;
			var choices = ["摸牌"];
			var prompt2 = "令";
			for (var i = 0; i < 2; i++) {
				if (targets[i] === player) {
					prompt2 += "你";
				} else {
					prompt2 += get.translation(targets[i]);
				}
				if (i === 0) {
					prompt2 += "和";
				}
			}
			prompt2 += "各摸一张牌";
			if (targets.some(target => target.countCards("he") > 0)) {
				prompt2 += "或各弃置一张牌";
				choices.push("弃牌");
			}
			player
				.chooseControl(choices, "cancel2")
				.set("prompt", get.prompt("dddzhilian"))
				.set("prompt2", prompt2)
				.set("ai", function () {
					var player = _status.event.player;
					var targets = _status.event.getParent().targets.slice(0);
					if (targets.includes(player)) {
						targets.remove(player);
						if (get.attitude(player, targets[0]) > 0) {
							return 0;
						}
						if (targets[0].countCards("he") > 0 && !targets[0].hasCard(card => get.value(card, targets[0]) <= 0, "e") && player.countCards("h", "sha") > 0) {
							return 1;
						}
						return "cancel2";
					} else {
						var att1 = get.attitude(player, targets[0]),
							att2 = get.attitude(player, targets[1]);
						if (get.sgn(att1) !== get.sgn(att2)) {
							return "cancel2";
						}
						return att1 > 0 ? 0 : 1;
					}
				});
			"step 1";
			if (result.control !== "cancel2") {
				player.logSkill("dddzhilian", targets);
				if (result.control === "摸牌") {
					game.asyncDraw(targets);
					game.delayex();
				} else {
					for (var target of targets) {
						target.chooseToDiscard("he", true);
					}
				}
				if (!targets.includes(player)) {
					event.finish();
				}
			} else {
				event.finish();
			}
			"step 2";
			var cards = [];
			game.getGlobalHistory("cardMove", function (evt) {
				if ((evt.name === "lose" && evt.position === ui.discardPile) || evt.name === "cardsDiscard") {
					cards.addArray(evt.cards);
				}
			});
			cards = cards.filter(card => card.name === "sha" && get.position(card, true) === "d");
			if (cards.length > 0) {
				player.gain(cards, "gain2");
			}
		},
	},
	dddjijian: {
		enable: "phaseUse",
		usable: 1,
		filterCard: { name: "sha" },
		position: "h",
		discard: false,
		delay: false,
		lose: false,
		filter: (event, player) => game.hasPlayer(current => lib.skill.dddjijian.filterTarget(null, player, current)),
		filterTarget: (card, player, target) => target !== player && target.hasSex("male"),
		content() {
			"step 0";
			player.showCards(cards);
			player.give(cards, target);
			"step 1";
			var cards = target.getCards("h");
			if (!cards.length) {
				event.finish();
			} else if (cards.length === 1) {
				event._result = { bool: true, cards: cards };
			} else {
				target
					.chooseCard("h", true, [1, 2], "请展示一至两张颜色相同的【杀】或普通锦囊牌", (card, player) => {
						var color = get.color(card);
						for (var cardx of ui.selected.cards) {
							if (get.color(cardx) !== color) {
								return false;
							}
						}
						return get.name(card) === "sha" || get.type(card) === "trick";
					})
					.set("complexCard", true)
					.set("ai", function (card) {
						var player = _status.event.player,
							source = _status.event.getParent().player;
						if (get.attitude(source, player) <= 0) {
							return -get.value(card);
						}
						var name = get.name(card),
							color = get.color(card);
						if (
							name === "sha" ||
							player.getUseValue(card) <= 0 ||
							player.hasCard(card2 => {
								return card2 !== card && !ui.selected.cards.includes(card2) && get.name(card2) === name;
							})
						) {
							if (!ui.selected.cards.length && color === "black") {
								return 1 + Math.random();
							}
							return Math.random();
						}
						if (!ui.selected.cards.length || get.color(ui.selected.cards[0] === "red")) {
							if (color === "black") {
								return 0.2 - player.getUseValue(card) / 100 + Math.random();
							}
						}
						return 0.1 - player.getUseValue(card) / 100;
					});
			}
			"step 2";
			if (result.bool) {
				var cards = result.cards;
				event.cards = cards;
				target.showCards(cards, get.translation(player) + "对" + get.translation(target) + "发动了【赍剑】");
				event.usedName = [];
				event.targets = [player, target].sortBySeat(_status.currentPhase || player);
			} else {
				event.finish();
			}
			"step 3";
			var current = event.targets.shift();
			if (!current.isIn()) {
				event.goto(5);
				return;
			}
			event.current = current;
			var list = event.cards
				.filter(card => {
					return (
						!event.usedName.includes(get.name(card)) &&
						current.hasUseTarget({
							name: get.name(card),
							nature: get.nature(card),
						})
					);
				})
				.map(card => {
					return [get.type(card), "", get.name(card), get.nature(card)];
				});
			if (!list.length) {
				event.finish();
			} else {
				current.chooseButton(["赍剑：视为使用一张牌", [list, "vcard"]], true).set("ai", function (button) {
					return get.player().getUseValue({
						name: button.link[2],
						nature: button.link[3],
					});
				});
			}
			"step 4";
			if (result.bool) {
				var name = result.links[0][2];
				event.usedName.add(name);
				event.current.chooseUseTarget(
					{
						name: name,
						nature: result.links[0][3],
						isCard: true,
					},
					true,
					false
				);
			}
			"step 5";
			if (event.targets.length) {
				event.goto(3);
			}
		},
		ai: {
			order: 4,
			result: {
				player(player, target) {
					if (get.attitude(player, target) > 0 && player.hasCard(card => get.name(card) === "sha", "h")) {
						return target.countCards("h");
					}
					return 0.1 / target.countCards("h");
				},
			},
		},
	},
	dddjijian_old: {
		enable: "phaseUse",
		usable: 1,
		filter: (event, player) => game.hasPlayer(current => lib.skill.dddjijian_old.filterTarget(null, player, current)),
		filterTarget: (card, player, target) => target !== player && target.hasSex("male") && target.countCards("h") > 0,
		content() {
			"step 0";
			target.chooseCard("h", true, [1, 2], "请展示一至两张手牌").set("ai", function (card) {
				var player = _status.event.player,
					source = _status.event.getParent().player;
				if (get.attitude(source, player) <= 0) {
					return -get.value(card);
				}
				var name = get.name(card),
					color = get.color(card);
				if (
					name === "sha" ||
					player.getUseValue(card) <= 0 ||
					player.hasCard(card2 => {
						return card2 !== card && !ui.selected.cards.includes(card2) && get.name(card2) === name;
					})
				) {
					if (!ui.selected.cards.length && color === "black") {
						return 1 + Math.random();
					}
					return Math.random();
				}
				if (!ui.selected.cards.length || get.color(ui.selected.cards[0] === "red")) {
					if (color === "black") {
						return 0.2 - player.getUseValue(card) / 100 + Math.random();
					}
				}
				return 0.1 - player.getUseValue(card) / 100;
			});
			"step 1";
			if (result.bool) {
				var cards = result.cards;
				event.cards = cards;
				target.showCards(cards, get.translation(player) + "对" + get.translation(target) + "发动了【赍剑】");
				if (
					!player.hasCard(card => {
						if (_status.connectMode) {
							return true;
						}
						return get.name(card, player) === "sha";
					}, "h")
				) {
					event.finish();
				}
			} else {
				event.finish();
			}
			"step 2";
			var colors = [];
			for (var card of cards) {
				colors.add(get.color(card, target));
			}
			colors.sort();
			var str = "若你给出的【杀】为";
			for (var i = 0; i < colors.length; i++) {
				str += get.translation(colors[i]);
				if (i < colors.length - 1) {
					str += "或";
				}
			}
			str += "，则其获得后续增益效果";
			player
				.chooseCard("h", (card, player) => get.name(card, player) === "sha", "是否交给" + get.translation(target) + "一张【杀】？", str)
				.set("colors", colors)
				.set("ai", function (card) {
					var player = _status.event.player,
						target = _status.event.getParent().target;
					if (get.attitude(player, target) < 0) {
						return false;
					}
					if (!_status.event.colors.includes(get.color(card, player))) {
						return 0;
					}
					if (game.hasNature(card)) {
						return 1.2;
					}
					return 1;
				});
			"step 3";
			if (result.bool) {
				player.give(result.cards, target, "giveAuto");
				var num = 0,
					color = get.color(result.cards[0], player);
				for (var card of cards) {
					if (get.color(card, target) === color) {
						num++;
					}
				}
				if (!num) {
					event.finish();
				} else {
					event.num = num;
				}
			} else {
				event.finish();
			}
			"step 4";
			var cards = target.getCards("h");
			cards.removeArray(event.cards);
			var names = [];
			for (var card of cards) {
				var name = get.name(card, target),
					type = get.type(card);
				if (type !== "basic" && type !== "trick") {
					continue;
				}
				if (name === "sha") {
					var natures = get.natureList(card, target);
					for (var nature of natures) {
						if (nature && lib.nature.has(nature)) {
							name += "|" + nature;
						}
					}
				}
				names.push(name);
			}
			if (!names.length) {
				event.finish();
			} else {
				event.names = names;
			}
			"step 5";
			event.num--;
			target
				.chooseButton([
					"是否视为使用一张牌？",
					[
						event.names.map(name => {
							if (name.indexOf("sha|") === 0) {
								return ["基本", "", "sha", name.slice(4).split("|")];
							}
							return [get.type(name), "", name];
						}),
						"vcard",
					],
				])
				.set("filterButton", function (button) {
					var card = {
							name: button.link[2],
							nature: button.link[3],
							isCard: true,
						},
						player = _status.event.player;
					return player.hasUseTarget(card);
				})
				.set("ai", function (button) {
					var card = {
							name: button.link[2],
							nature: button.link[3],
							isCard: true,
						},
						player = _status.event.player;
					return player.getUseValue(card);
				});
			"step 6";
			if (result.bool) {
				var card = {
					name: result.links[0][2],
					nature: result.links[0][3],
					isCard: true,
				};
				target.chooseUseTarget(card, true, false);
				if (event.num > 0) {
					var name = card.name;
					if (name === "sha") {
						var natures = get.natureList(card, target);
						for (var nature of natures) {
							if (nature && lib.nature.has(nature)) {
								name += "|" + nature;
							}
						}
					}
					event.names.remove(name);
					if (event.names.length > 0) {
						event.goto(5);
					}
				}
			} else {
				event.finish();
			}
		},
		ai: {
			order: 4,
			result: {
				player(player, target) {
					if (get.attitude(player, target) > 0 && player.hasCard(card => get.name(card) === "sha", "h")) {
						return target.countCards("h");
					}
					return 0.1 / target.countCards("h");
				},
			},
		},
	},
	dddzhengjun: {
		trigger: {
			global: ["damageEnd", "loseHpEnd", "recoverEnd", "loseAfter", "equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"],
		},
		filter(event, player) {
			if (!player.isPhaseUsing()) {
				return false;
			}
			if (event.name === "damage" || event.name === "loseHp" || event.name === "recover") {
				if (player.hasSkill("dddzhengjun_hp")) {
					return false;
				}
				return event.player.getHp() === player.getHp();
			}
			const info = get.info("dddzhengjun");
			const hs_check = info.hs_check,
				es_check = info.es_check;
			return game.hasPlayer(target => {
				if (event.getg && event.getg(target) && event.getg(target).length && hs_check(player, target)) {
					return true;
				}
				const evt = event.getl(target);
				if (evt && evt.hs && evt.hs.length && hs_check(player, target)) {
					return true;
				}
				if (event.name === "equip" && event.player === target && (!evt || evt.cards.length !== 1) && es_check(player, target)) {
					return true;
				}
				return evt && evt.es && evt.es.length && es_check(player, target);
			});
		},
		hs_check(player, target) {
			return !player.hasSkill("dddzhengjun_hs") && target.countCards("h") === player.countCards("h");
		},
		es_check(player, target) {
			return !player.hasSkill("dddzhengjun_es") && target.countCards("e") === player.countCards("e");
		},
		async cost(event, trigger, player) {
			if (trigger.name === "damage" || trigger.name === "loseHp" || trigger.name === "recover") {
				let list = ["失去体力", "cancel2"];
				if (trigger.player.isDamaged()) {
					list.unshift("回复体力");
				}
				const {
					result: { control },
				} = await player
					.chooseControl(list)
					.set("prompt", get.prompt(event.skill, trigger.player))
					.set("prompt2", "令" + get.translation(event.player) + "执行其中一项")
					.set("ai", () => {
						const player = get.event("player"),
							target = get.event().getTrigger().player;
						if (get.event("controls").includes("回复体力") && get.recoverEffect(target, player, player) > 0) {
							return "回复体力";
						}
						return get.effect(target, { name: "losehp" }, player, player) > 0 ? "失去体力" : "cancel2";
					});
				event.result = {
					bool: control !== "cancel2",
					targets: [trigger.player],
					cost_data: control,
				};
			} else {
				let map = {};
				const hs_targets = game.filterPlayer(target => {
					if (!get.info("dddzhengjun").hs_check(player, target)) {
						return false;
					}
					if (trigger.getg && trigger.getg(target) && trigger.getg(target).length) {
						return true;
					}
					const evt = trigger.getl(target);
					return evt && evt.hs && evt.hs.length;
				});
				const es_targets = game.filterPlayer(target => {
					if (!get.info("dddzhengjun").es_check(player, target)) {
						return false;
					}
					const evt = trigger.getl(target);
					if (trigger.name === "equip" && trigger.player === target && (!evt || evt.cards.length !== 1)) {
						return true;
					}
					return evt && evt.es && evt.es.length;
				});
				if (hs_targets.length) {
					let target;
					if (hs_targets.length === 1) {
						target = hs_targets[0];
					} else {
						let targets = await player
							.chooseTarget(get.prompt("dddzhengjun"), "令其中一名角色摸一张牌或弃置一张牌", (card, player, target) => {
								return get.event("targets").includes(target);
							})
							.set("ai", target => {
								const player = get.event("player");
								return Math.max(get.effect(target, { name: "guohe_copy2" }, target, player), get.effect(target, { name: "draw" }, player, player));
							})
							.set("targets", hs_targets)
							.forResultTargets();
						if (targets && targets.length) {
							target = targets[0];
						}
					}
					if (target) {
						let list = ["摸牌"];
						if (target.countCards("h")) {
							list.push("弃牌");
						}
						const {
							result: { control },
						} = await player
							.chooseControl(list, "cancel2")
							.set("prompt", get.prompt("dddzhengjun", target))
							.set("prompt2", "令" + get.translation(target) + "执行其中一项")
							.set("ai", () => {
								const player = get.event("player"),
									target = get.event().getTrigger().player;
								if (get.event("controls").includes("弃牌") && get.effect(target, { name: "guohe_copy2" }, player, player) > 0) {
									return "弃牌";
								}
								return get.effect(target, { name: "draw" }, player, player) > 0 ? "摸牌" : "cancel2";
							});
						if (control !== "cancel2") {
							map.hs_target = [target, control];
						}
					}
				}
				if (es_targets.length) {
					let target;
					if (hs_targets.length === 1) {
						const {
							result: { bool },
						} = await player
							.chooseBool()
							.set("prompt", get.prompt("dddzhengjun", hs_targets[0]))
							.set("prompt2", "移动" + get.translation(hs_targets[0]) + "的一张装备牌")
							.set("choice", () => player.canMoveCard(true, true, hs_targets[0]));
						if (bool) {
							target = hs_targets[0];
						}
					} else {
						let targets = await player
							.chooseTarget(get.prompt("dddzhengjun"), "移动其中一名角色的一张装备牌", (card, player, target) => {
								return get.event("targets").includes(target);
							})
							.set("ai", target => {
								const player = get.event("player");
								return player.canMoveCard(true, true, target) ? 1 + Math.random() : 0;
							})
							.set("targets", es_targets)
							.forResultTargets();
						if (targets && targets.length) {
							target = targets[0];
						}
					}
					if (target) {
						map.es_target = target;
					}
				}
				event.result = {
					bool: map.hs_target || map.es_target,
					targets: [(map.hs_target || [])[0]].concat(map.es_target ? [map.es_target] : []),
					cost_data: map,
				};
			}
		},
		async content(event, trigger, player) {
			const data = event.cost_data;
			if (trigger.name === "damage" || trigger.name === "loseHp" || trigger.name === "recover") {
				player.addTempSkill("dddzhengjun_hp", "phaseUseAfter");
				await trigger.player[data === "回复体力" ? "recover" : "loseHp"]();
			} else {
				if (data.hs_target) {
					player.addTempSkill("dddzhengjun_hs", "phaseUseAfter");
					if (data.hs_target[1] === "摸牌") {
						await data.hs_target[0].draw();
					} else {
						await data.hs_target[0].chooseToDiscard("he", true);
					}
				}
				if (data.es_target) {
					player.addTempSkill("dddzhengjun_es", "phaseUseAfter");
					await player.moveCard(true, data.es_target);
				}
			}
		},
		subSkill: {
			hs: { charlotte: true },
			es: { charlotte: true },
			hp: { charlotte: true },
		},
	},
	dddxianxi: {
		trigger: {
			player: "useCard2",
		},
		direct: true,
		filter(event, player) {
			if (event.card.name !== "sha" || !player.isPhaseUsing()) {
				return false;
			}
			return game.hasPlayer(function (current) {
				return !event.targets.includes(current) && lib.filter.targetEnabled2(event.card, player, current);
			});
		},
		content() {
			"step 0";
			player
				.chooseTarget(
					get.prompt("dddxianxi"),
					"为" + get.translation(trigger.card) + "增加任意个目标",
					function (card, player, target) {
						var event = _status.event.getTrigger();
						return !event.targets.includes(target) && lib.filter.targetEnabled2(event.card, player, target);
					},
					[1, Infinity]
				)
				.set("ai", function (target) {
					var evt = _status.event.getTrigger();
					if (get.damageEffect(target, evt.player, evt.player) < 0) {
						return 0;
					}
					return get.effect(target, evt.card, evt.player, evt.player);
				});
			"step 1";
			if (result.bool) {
				var targets = result.targets.sortBySeat();
				event.targets = targets;
				if (!event.isMine() && !event.isOnline()) {
					game.delayx();
				}
			} else {
				event.finish();
			}
			"step 2";
			player.logSkill("dddxianxi", targets);
			trigger.targets.addArray(targets);
			if (!trigger._dddxianxi_map) {
				trigger._dddxianxi_map = {};
			}
			trigger._dddxianxi_map[player.playerid] = targets.slice(0);
			player.addTempSkill("dddxianxi_delay");
		},
		subSkill: {
			delay: {
				charlotte: true,
				trigger: {
					player: "useCardAfter",
				},
				forced: true,
				filter(event, player) {
					if (!event._dddxianxi_map || !event._dddxianxi_map[player.playerid]) {
						return false;
					}
					for (var target of event._dddxianxi_map[player.playerid]) {
						if (
							!target.hasHistory("damage", function (evt) {
								return evt.card === event.card;
							})
						) {
							return true;
						}
					}
					return false;
				},
				content() {
					"step 0";
					var targets = trigger._dddxianxi_map[player.playerid]
						.filter(function (target) {
							return !target.hasHistory("damage", function (evt) {
								return evt.card === trigger.card;
							});
						})
						.sortBySeat();
					event.targets = targets;
					var num = targets.length;
					player.chooseToDiscard("he", num, "险袭：选择弃置" + get.cnNumber(num) + "张牌", "然后对" + get.translation(targets) + "各造成1点伤害。或点击「取消」，改为摸" + get.cnNumber(num) + "张牌并失去1点体力").set("ai", function (card) {
						return 7 - get.value(card);
					});
					"step 1";
					if (result.bool) {
						for (var i of targets) {
							player.line(i);
							i.damage();
						}
					} else {
						player.draw(targets.length);
						player.loseHp();
					}
				},
				sub: true,
			},
		},
	},
	dddlingyong: {
		trigger: {
			global: ["phaseZhunbeiSkipped", "phaseZhunbeiCancelled", "phaseDrawSkipped", "phaseDrawCancelled", "phaseJudgeSkipped", "phaseJudgeCancelled", "phaseUseSkipped", "phaseUseCancelled", "phaseDiscardSkipped", "phaseDiscardCancelled", "phaseJieshuSkipped", "phaseJieshuCancelled"],
		},
		frequent: true,
		content() {
			"step 0";
			player
				.judge(function (card) {
					var name = get.name(card, false);
					if (name === "sha") {
						return -2;
					}
					return 2;
				})
				.set("callback", function () {
					if (event.judgeResult.name !== "sha") {
						var card = event.judgeResult.card;
						if (get.position(card, true) === "o") {
							player.chooseUseTarget(card);
						}
					}
				}).judge2 = function (result) {
				return result.bool;
			};
			"step 1";
			if (result.bool) {
				player.chooseBool("是否继续进行【灵涌】判定？").set("frequentSkill", "dddlingyong");
			} else {
				event.finish();
			}
			"step 2";
			if (result.bool) {
				event.goto(0);
			}
		},
	},
	dddxuxiao: {
		trigger: {
			global: ["loseAfter", "loseAsyncAfter"],
		},
		direct: true,
		filter(event, player) {
			if (event.type !== "discard") {
				return false;
			}
			var cards = event.getd();
			for (var i of cards) {
				if (get.position(i, true) === "d" && get.color(i, false) === "black" && get.type(i) === "basic") {
					var card = get.autoViewAs({ name: "bingliang" }, [i]);
					if (
						game.hasPlayer(function (current) {
							return current.canAddJudge(card);
						})
					) {
						return true;
					}
				}
			}
			return false;
		},
		content() {
			"step 0";
			if (!event.cards) {
				event.cards = [];
			}
			var cards = trigger.getd().filter(function (i) {
				if (!event.cards.includes(i) && get.position(i, true) === "d" && get.color(i, false) === "black" && get.type(i) === "basic") {
					var card = get.autoViewAs({ name: "bingliang" }, [i]);
					if (
						game.hasPlayer(function (current) {
							return current.canAddJudge(card);
						})
					) {
						return true;
					}
				}
				return false;
			});
			if (cards.length) {
				player.chooseButton([get.prompt("dddxuxiao"), cards]);
			} else {
				event.finish();
			}
			"step 1";
			if (result.bool) {
				var card = result.links[0];
				event.cards.push(card);
				event.card = card;
				player
					.chooseTarget(true, "请选择【兵粮寸断】的目标", "将" + get.translation(card) + "置于一名角色的判定区内，然后其摸两张牌", function (card, player, target) {
						var card = get.autoViewAs({ name: "bingliang" }, [_status.event.card]);
						return target.canAddJudge(card);
					})
					.set("card", card)
					.set("ai", function (target) {
						var card = get.autoViewAs({ name: "bingliang" }, [_status.event.card]),
							player = _status.event.player;
						return get.attitude(player, target) + Math.max(0, get.effect(target, card, player, player));
					});
			}
			"step 2";
			if (result.bool) {
				var target = result.targets[0];
				player.logSkill("dddxuxiao", target);
				target.addJudge({ name: "bingliang" }, [card]);
				target.draw(2);
				event.goto(0);
			}
		},
	},
	dddxuyu: {
		trigger: {
			player: "useCardAfter",
		},
		content() {
			player.draw();
			player
				.when({ player: "useCardAfter", global: "phaseAfter" })
				.filter(evt => evt !== trigger)
				.then(() => {
					if (trigger.name === "useCard") {
						player.chooseToDiscard("he", true);
					}
				});
		},
	},
	dddshijian: {
		trigger: {
			global: "useCardAfter",
		},
		filter(event, player) {
			if (player === event.player) {
				return false;
			}
			const evt = event.getParent("phaseUse");
			if (!evt || evt.player !== event.player) {
				return false;
			}
			return (
				event.player.getHistory(
					"useCard",
					evtx => {
						return evtx.getParent("phaseUse") === evt;
					},
					event
				).length === 2
			);
		},
		direct: true,
		*content(event, map) {
			const player = map.player,
				trigger = map.trigger,
				target = trigger.player;
			let result = yield player
				.chooseCard("he", get.prompt("dddshijian", target), `交给${get.translation(target)}一张牌，然后其本回合使用下一张牌指定目标时，你令此牌额外结算一次或摸一张牌。`)
				.set("ai", card => {
					if (get.event("goon")) {
						return 6 - get.value(card);
					}
					return 0;
				})
				.set("goon", get.attitude(player, target) > 0 && target.hasCard(card => target.hasValueTarget(card)));
			if (!result.bool) {
				return event.finish();
			}
			player.logSkill("dddshijian", target);
			player.give(result.cards, target);
			player.addTempSkill("dddshijian_extra");
			player.markAuto("dddshijian_extra", target);
		},
		subSkill: {
			extra: {
				trigger: { global: "useCardToPlayer" },
				filter(event, player) {
					if (!event.isFirstTarget) {
						return false;
					}
					return player.getStorage("dddshijian_extra").includes(event.player);
				},
				charlotte: true,
				forced: true,
				onremove: true,
				*content(event, map) {
					const player = map.player,
						trigger = map.trigger,
						target = trigger.player;
					if (trigger.targets && trigger.targets.length) {
						let result = yield player
							.chooseControl(["额外结算", "摸一张牌"])
							.set("prompt", "实荐：请选择一项")
							.set("prompt2", `令${get.translation(trigger.card)}额外结算一次，或摸一张牌`)
							.set("ai", () => {
								return get.event("choice");
							})
							.set(
								"choice",
								(function () {
									if (trigger.card.name === "tiesuo" || !["basic", "trick"].includes(get.type(trigger.card))) {
										return 1;
									}
									if (
										trigger.targets.reduce((p, c) => {
											return p + get.effect(c, trigger.card, target, _status.event.player);
										}, 0) >= get.effect(player, { name: "draw" }, player, _status.event.player)
									) {
										return 0;
									}
									return 1;
								})()
							);
						if (result.index === 0) {
							trigger.getParent().effectCount++;
							game.log(player, "令", trigger.card, "额外结算一次");
						} else {
							player.draw();
						}
					} else {
						player.draw();
					}
					player.removeSkill("dddshijian_extra");
				},
			},
		},
	},
	dddxuyu_old: {
		trigger: {
			player: "useCardAfter",
		},
		filter(event, player) {
			var evt = event.getParent("phaseUse");
			if (!evt || evt.player !== player) {
				return false;
			}
			return (
				player.getHistory(
					"useCard",
					function (evtx) {
						return evtx.getParent("phaseUse") === evt;
					},
					event
				).length === 1
			);
		},
		content() {
			player.draw(2);
			player.addTempSkill("dddxuyu_old_discard", "phaseUseAfter");
		},
		subSkill: {
			discard: {
				trigger: {
					player: "useCardAfter",
				},
				filter(event, player) {
					if (!player.countCards("he")) {
						return false;
					}
					var evt = event.getParent("phaseUse");
					if (!evt || evt.player !== player) {
						return false;
					}
					return (
						player.getHistory(
							"useCard",
							function (evtx) {
								return evtx.getParent("phaseUse") === evt;
							},
							event
						).length === 3
					);
				},
				forced: true,
				charlotte: true,
				content() {
					player.chooseToDiscard("he", true);
				},
				sub: true,
			},
		},
	},
	dddshijian_old: {
		trigger: {
			global: "useCardAfter",
		},
		filter(event, player) {
			if (player === event.player) {
				return false;
			}
			var evt = event.getParent("phaseUse");
			if (!evt || evt.player !== event.player) {
				return false;
			}
			return (
				event.player.getHistory(
					"useCard",
					function (evtx) {
						return evtx.getParent("phaseUse") === evt;
					},
					event
				).length === 3
			);
		},
		logTarget: "player",
		check(event, player) {
			return get.attitude(player, event.player) > 0;
		},
		content() {
			trigger.player.draw();
			player.addTempSkill("dddshijian_old_draw", "phaseUseAfter");
		},
		subSkill: {
			draw: {
				trigger: {
					global: "useCardAfter",
				},
				filter(event, player) {
					if (!event.player.countCards("he")) {
						return false;
					}
					var evt = event.getParent("phaseUse");
					if (!evt || evt.player !== event.player) {
						return false;
					}
					return (
						event.player.getHistory(
							"useCard",
							function (evtx) {
								return evtx.getParent("phaseUse") === evt;
							},
							event
						).length === 4
					);
				},
				forced: true,
				charlotte: true,
				content() {
					player.draw(2);
				},
				sub: true,
			},
		},
	},
	dddtaisi: {
		trigger: {
			global: "phaseEnd",
		},
		direct: true,
		filter(event, player) {
			if (!game.getGlobalHistory("changeHp").some(evt => evt.player === player)) {
				return false;
			}
			return game.getGlobalHistory("cardMove").some(function (evt) {
				if (evt.name !== "cardsDiscard") {
					if (evt.name !== "lose" || evt.position !== ui.discardPile) {
						return false;
					}
				}
				return evt.cards.some(card => get.position(card, true) === "d");
			});
		},
		content() {
			"step 0";
			player.chooseTarget(get.prompt("dddtaisi"), "你可以令一名角色获得一张于本回合内进入弃牌堆的牌。若该角色于本回合内对你造成过伤害，则你摸两张牌。").set("ai", function (target) {
				var player = _status.event.player,
					att = get.attitude(player, target);
				if (player.hasHistory("damage", evt => evt.source === target)) {
					return 10 + att;
				}
				return att;
			});
			"step 1";
			if (result.bool) {
				var target = result.targets[0];
				player.logSkill("dddtaisi", target);
				event.target = target;
			} else {
				event.finish();
			}
			"step 2";
			var cards = [];
			game.getGlobalHistory("cardMove", function (evt) {
				if (evt.name !== "cardsDiscard") {
					if (evt.name !== "lose" || evt.position !== ui.discardPile) {
						return false;
					}
				}
				cards.addArray(evt.cards.filter(card => get.position(card, true) === "d"));
			});
			if (!cards.length) {
				event.finish();
			} else if (cards.length === 1) {
				event._result = { bool: true, links: cards };
			} else {
				player.chooseButton(["令" + get.translation(target) + "获得一张牌", cards], true).set("ai", function (button) {
					var player = _status.event.player,
						target = _status.event.getParent().target;
					var att = get.attitude(player, target) - 0.1;
					return get.sgn(att) * get.value(button.link, target);
				});
			}
			"step 3";
			if (result.bool) {
				target.gain(result.links, "gain2");
			} else {
				event.finish();
			}
			"step 4";
			if (player.hasHistory("damage", evt => evt.source === target)) {
				player.draw(2);
			}
		},
	},
	dddquche: {
		enable: "phaseUse",
		limited: true,
		skillAnimation: true,
		animationColor: "thunder",
		filter(event, player) {
			return player.hasCard({ color: "red" }, "he");
		},
		filterCard: {
			color: "red",
		},
		filterTarget(card, player, target) {
			return player !== target;
		},
		discard: false,
		delay: false,
		lose: false,
		content() {
			"step 0";
			event.count = 1;
			player.awakenSkill(event.name);
			player.addTempSkill("dddquche_effect");
			player.addMark("dddquche_effect", 1, false);
			player.give(cards, target);
			event.goto(3);
			"step 1";
			if (
				player.hasCard(function (card) {
					if (_status.connectMode && get.position(card) === "h") {
						return true;
					}
					return get.color(card) === "red";
				}, "he")
			) {
				player.chooseCardTarget({
					prompt: "是否将一张红色牌交给一名其他角色？",
					filterCard: { color: "red" },
					filterTarget: lib.filter.notMe,
					position: "he",
				});
			} else {
				event.finish();
			}
			"step 2";
			if (result.bool) {
				player.addMark("dddquche_effect", 1, false);
				player.give(result.cards, result.targets[0]);
			} else {
				event.finish();
			}
			"step 3";
			if (
				player.hasCard(function (card) {
					if (_status.connectMode && get.position(card) === "h") {
						return true;
					}
					return get.color(card) === "black";
				}, "hes")
			) {
				player.chooseCardTarget({
					prompt: "是否将一张黑色牌当做【杀】使用？",
					position: "he",
					filterCard(card, player) {
						if (get.color(card) !== "black") {
							return false;
						}
						var card = get.autoViewAs({ name: "sha" }, [card]);
						return lib.filter.cardEnabled(card, player);
					},
					selectTarget() {
						var card = get.autoViewAs({ name: "sha" }, ui.selected.cards);
						return lib.filter.selectTarget(card, _status.event.player);
					},
					filterTarget(card, player, target) {
						var card = get.autoViewAs({ name: "sha" }, ui.selected.cards);
						return lib.filter.targetEnabled(card, player, target) && lib.filter.targetInRange(card, player, target);
					},
				});
			} else {
				event.finish();
			}
			"step 4";
			if (result.bool) {
				player.addMark("dddquche_effect", 1, false);
				player.useCard({ name: "sha" }, result.cards, result.targets, false);
				event.goto(1);
			} else {
				event.finish();
			}
		},
		subSkill: {
			effect: {
				charlotte: true,
				onremove: true,
				mod: {
					globalFrom(from, to, distance) {
						return distance - from.countMark("dddquche_effect");
					},
				},
				intro: {
					content: "至其他角色的距离-#",
				},
				sub: true,
			},
		},
		mark: true,
		intro: {
			content: "limited",
		},
		init(player, skill) {
			player.storage[skill] = false;
		},
	},
	dddqianlong: {
		zhuSkill: true,
		trigger: {
			source: "dieAfter",
		},
		forced: true,
		filter: (event, player) => player.hasZhuSkill("dddqianlong"),
		content() {
			player.draw(3);
		},
		group: "dddqianlong_cancel",
		subSkill: {
			cancel: {
				trigger: {
					player: ["drawBefore", "discardBefore"],
				},
				forced: true,
				popup: false,
				filter(event, player) {
					if (!player.hasZhuSkill("dddqianlong")) {
						return false;
					}
					var evt = event.getParent();
					return evt && evt.name === "die" && evt.source === player;
				},
				content() {
					trigger.cancel();
				},
				sub: true,
			},
		},
	},
	ddddongcha: {
		trigger: {
			global: "phaseBegin",
		},
		logTarget: "player",
		filter(event, player) {
			return player !== event.player && player.countCards("h") > 0 && event.player.countCards("h") > 0;
		},
		check(event, player) {
			return get.attitude(player, event.player) <= 0;
		},
		content() {
			"step 0";
			event.target = trigger.player;
			player.addTempSkill("ddddongcha_effect");
			if (player.countCards("h") > 0) {
				player.chooseCard("h", true, "选择一张牌作为“鉴”");
			}
			"step 1";
			if (result.bool) {
				player.addToExpansion(result.cards, player, "give").gaintag.add("ddddongcha_effect");
			}
			"step 2";
			if (target.countCards("h") > 0) {
				target.chooseCard("h", true, "选择一张牌作为“鉴”");
			}
			"step 3";
			if (result.bool) {
				player.addToExpansion(result.cards, target, "give").gaintag.add("ddddongcha_effect");
			}
		},
		subSkill: {
			effect: {
				charlotte: true,
				trigger: {
					global: "phaseEnd",
				},
				forced: true,
				filter(event, player) {
					return player.getExpansions("ddddongcha_effect").length > 0;
				},
				content() {
					"step 0";
					var cards = player.getExpansions("ddddongcha_effect");
					if (cards.length > 0) {
						if (cards.length === 1) {
							event._result = {
								bool: true,
								links: cards,
							};
						} else {
							player.chooseButton(["选择获得一张“鉴”", cards], true);
						}
					} else {
						event.finish();
					}
					"step 1";
					if (result.bool) {
						player.gain(result.links, "gain2");
					}
					"step 2";
					var cards = player.getExpansions("ddddongcha_effect");
					if (cards.length > 0 && trigger.player.isIn()) {
						if (cards.length === 1) {
							event._result = {
								bool: true,
								links: cards,
							};
						} else {
							trigger.player.chooseButton(["选择获得一张“鉴”", cards], true).set("ai", function (button) {
								return get.value(button.link, _status.event.player);
							});
						}
					} else {
						event.finish();
					}
					"step 3";
					if (result.bool) {
						trigger.player.gain(result.links, player, "give");
					}
				},
				marktext: "鉴",
				intro: {
					content: "expansion",
					markcount: "expansion",
				},
				sub: true,
			},
		},
	},
	dddzhijie: {
		enable: "chooseToUse",
		filter(event, player) {
			if (event.type === "phase") {
				return false;
			}
			var cards = player.getExpansions("ddddongcha_effect");
			if (cards.length < 2) {
				return false;
			}
			var shan = false,
				wuxie = false;
			for (var i = 0; i < cards.length; i++) {
				for (var j = i + 1; j < cards.length; j++) {
					if (get.color(cards[i], false) === get.color(cards[j], false)) {
						shan = true;
					} else {
						wuxie = true;
					}
				}
			}
			if (shan && event.filterCard(get.autoViewAs({ name: "shan" }, "unsure"), player, event)) {
				return true;
			}
			if (wuxie && event.filterCard(get.autoViewAs({ name: "wuxie" }, "unsure"), player, event)) {
				return true;
			}
			return false;
		},
		hiddenCard(player, name) {
			if (name !== "shan" && name !== "wuxie") {
				return false;
			}
			var cards = player.getExpansions("ddddongcha_effect");
			if (cards.length < 2) {
				return false;
			}
			var shan = false,
				wuxie = false;
			for (var i = 0; i < cards.length; i++) {
				for (var j = i + 1; j < cards.length; j++) {
					if (get.color(cards[i], false) === get.color(cards[j], false)) {
						shan = true;
					} else {
						wuxie = true;
					}
				}
			}
			if (shan && name === "shan") {
				return true;
			}
			if (wuxie && name === "wuxie") {
				return true;
			}
			return false;
		},
		chooseButton: {
			dialog(event, player) {
				return ui.create.dialog("智解", player.getExpansions("ddddongcha_effect"), "hidden");
			},
			select: 2,
			filter(button, player) {
				if (!ui.selected.buttons.length) {
					return true;
				}
				var evt = _status.event.getParent(),
					buttons = ui.selected.buttons;
				return evt.filterCard(
					get.autoViewAs(
						{
							name: get.color(buttons[0].link) === get.color(button.link) ? "shan" : "wuxie",
						},
						[button.link, buttons[0].link]
					)
				);
			},
			check: () => 1,
			backup(links, player) {
				return {
					viewAs: {
						name: get.color(links[0]) === get.color(links[1]) ? "shan" : "wuxie",
					},
					cards: links,
					selectCard: -1,
					position: "x",
					filterCard: card => lib.skill["dddzhijie_backup"].cards.includes(card),
					popname: true,
					precontent() {
						player.addTempSkill("dddzhijie_draw");
					},
				};
			},
		},
		ai: {
			combo: "ddddongcha",
			respondShan: true,
			skillTagFilter(player) {
				return lib.skill["dddzhijie"].hiddenCard(player, "shan");
			},
			order: 10,
			result: { player: 1 },
			effect: {
				target_use(card, player, target) {
					if (card.name === "sha" && target.getExpansions("ddddongcha_effect").length < 2 && lib.skill["dddzhijie"].hiddenCard(target, "shan")) {
						return [1, 1, 1, -get.sgn(get.attitude(player, _status.currentPhase))];
					}
				},
			},
		},
		subSkill: {
			draw: {
				trigger: {
					player: "useCardAfter",
				},
				forced: true,
				charlotte: true,
				popup: false,
				filter(event, player) {
					return event.skill === "dddzhijie_backup";
				},
				content() {
					player.draw(2);
				},
				sub: true,
			},
		},
	},
	dddqiahua: {
		trigger: {
			global: "phaseBegin",
		},
		direct: true,
		filter(event, player) {
			return (
				player !== event.player &&
				event.player.hp > 0 &&
				player.countCards("h", function (card) {
					return !get.is.shownCard(card);
				}) >= event.player.hp
			);
		},
		content() {
			"step 0";
			var target = trigger.player;
			player
				.chooseCard("h", target.hp, get.prompt("dddqiahua", target), "选择明置" + get.cnNumber(target.hp) + "张手牌，然后" + get.translation(target) + "获得技能〖恂恂〗直到本回合结束。", function (card) {
					return !get.is.shownCard(card);
				})
				.set("goon", get.attitude(player, target) > 0)
				.set("ai", function (card) {
					if (_status.event.goon) {
						return 1 + Math.random();
					}
					return 0;
				});
			"step 1";
			if (result.bool) {
				var target = trigger.player,
					cards = result.cards;
				player.logSkill("dddqiahua", target);
				target.addTempSkills("dddxunxun");
				player.addShownCards(cards, "visible_dddxianglang");
				game.log(player, "选择了", cards, "作为“明”");
				player.showCards(cards, get.translation(player) + "对" + get.translation(target) + "发动了【恰化】");
			}
		},
		ai: {
			expose: 0.15,
		},
		derivation: "dddxunxun",
	},
	dddxunxun: {
		trigger: { player: "phaseDrawBegin1" },
		content() {
			"step 0";
			var cards = get.cards(4);
			game.cardsGotoOrdering(cards);
			var next = player.chooseToMove("恂恂：将两张牌置于牌堆顶", true);
			next.set("list", [["牌堆顶", cards], ["牌堆底"]]);
			next.set("filterMove", function (from, to, moved) {
				if (to === 1 && moved[1].length >= 2) {
					return false;
				}
				return true;
			});
			next.set("filterOk", function (moved) {
				return moved[1].length === 2;
			});
			next.set("processAI", function (list) {
				var cards = list[0][1].slice(0).sort(function (a, b) {
					return get.value(b) - get.value(a);
				});
				return [cards, cards.splice(2)];
			});
			"step 1";
			var top = result.moved[0];
			var bottom = result.moved[1];
			top.reverse();
			for (var i = 0; i < top.length; i++) {
				ui.cardPile.insertBefore(top[i], ui.cardPile.firstChild);
			}
			for (i = 0; i < bottom.length; i++) {
				ui.cardPile.appendChild(bottom[i]);
			}
			game.updateRoundNumber();
			game.delayx();
		},
	},
	dddfusi: {
		mod: {
			ignoredHandcard(card, player) {
				if (get.is.shownCard(card)) {
					return true;
				}
			},
			cardDiscardable(card, player, name) {
				if (name === "phaseDiscard" && get.is.shownCard(card)) {
					return false;
				}
			},
		},
		global: "dddfusi_global",
		subSkill: {
			refused: {
				charlotte: true,
				sub: true,
			},
			allowed: {
				charlotte: true,
				sub: true,
			},
		},
	},
	dddfusi_global: {
		mod: {
			cardEnabled2(card, player) {
				var source = _status.currentPhase;
				if (
					!source ||
					source === player ||
					!source.hasSkill("dddfusi") ||
					source.countCards("h") === 0 ||
					source.hasCard(function (card) {
						return !get.is.shownCard(card);
					}, "h")
				) {
					return;
				}
				if (player.getCards("h").includes(card)) {
					return false;
				}
			},
		},
		enable: "chooseToUse",
		filter(event, player) {
			if (event._dddfusi_refused || player.hasSkill("dddfusi_refused")) {
				return false;
			}
			var players = game.filterPlayer(function (current) {
				return current !== player && current.hasSkill("dddfusi");
			});
			for (var source of players) {
				var cards = source.getShownCards();
				for (var i of cards) {
					var card = get.autoViewAs(i);
					if (event.filterCard(card, player, event)) {
						return true;
					}
				}
			}
			return false;
		},
		hiddenCard(player, name) {
			if (player.hasSkill("dddfusi_refused")) {
				return false;
			}
			var players = game.filterPlayer(function (current) {
				return current !== player && current.hasSkill("dddfusi");
			});
			for (var source of players) {
				var cards = source.getShownCards();
				for (var i of cards) {
					var card = get.autoViewAs(i);
					if (name === card.name) {
						return true;
					}
				}
			}
			return false;
		},
		chooseButton: {
			dialog(event, player) {
				var dialog = ui.create.dialog("腹笥", "hidden");
				var players = game
					.filterPlayer(function (current) {
						return current !== player && current.hasSkill("dddfusi");
					})
					.sortBySeat();
				for (var source of players) {
					var cards = source.getShownCards();
					if (cards.length) {
						var str = '<div class="text center">';
						str += get.translation(source);
						var num = source.getSeatNum();
						if (num > 0) {
							str += "（" + get.cnNumber(num, true) + "号位）";
						}
						str += "</div>";
						dialog.add(str);
						dialog.add(cards);
					}
				}
				return dialog;
			},
			filter(button, player) {
				var card = get.autoViewAs(button.link),
					evt = _status.event.getParent();
				return evt.filterCard(card, player, evt);
			},
			check(button) {
				if (_status.event.getParent().type !== "phase") {
					return 1;
				}
				return _status.event.player.getUseValue(get.autoViewAs(button.link), null, true);
			},
			backup(links, player) {
				return {
					card: links[0],
					viewAs: get.autoViewAs(links[0]),
					filterCard: () => false,
					selectCard: -1,
					log: false,
					precontent() {
						"step 0";
						var card = lib.skill["dddfusi_global_backup"].card;
						event.card = card;
						event.result.cards = [card];
						event.source = get.owner(card);
						if (!event.result.card.storage) {
							event.result.card.storage = {};
						}
						event.result.card.storage._dddfusi_owner = event.source;
						player.logSkill("dddfusi_global", event.source);
						if (player.hasSkill("dddfusi_allowed")) {
							event.finish();
						}
						"step 1";
						if (event.result.targets && event.result.targets.length) {
							player.line(event.result.targets, event.result.card.nature);
						}
						player.showCards([card], get.translation(player) + "向" + get.translation(source) + "发动【腹笥】");
						source
							.chooseButton(
								[
									"是否同意" + get.translation(player) + "使用" + get.translation(card) + "？",
									'<div class="text center">' +
										(function () {
											if (event.result.targets && event.result.targets.length) {
												return "（目标角色：" + get.translation(event.result.targets) + "）";
											}
											return "（无目标角色）";
										})() +
										"</div>",
									[["　　 同意 　　", "　　不同意　　"], "tdnodes"],
									[["　　 同意且本回合内不再提示 　　"], "tdnodes"],
									[["　　不同意且本回合内不再提示　　"], "tdnodes"],
									"forcebutton",
								],
								true
							)
							.set("forceAuto", true);
						"step 2";
						if (result.links[0].indexOf("不同意") === -1) {
							source.chat("同意");
							if (result.links[0].indexOf("本回合内不再提示") > 0) {
								player.addTempSkill("dddfusi_allowed");
							}
						} else if (result.links[0].indexOf("不同意") !== -1) {
							source.chat("不同意");
							if (result.links[0].indexOf("本回合内不再提示") > 0) {
								player.addTempSkill("dddfusi_refused");
							} else if (event.result.card.name === "wuxie") {
								player.addTempSkill("dddfusi_refused", "_wuxieAfter");
							}
							var evt = event.getParent();
							evt.set("_dddfusi_refused", true);
							evt.goto(0);
						}
					},
				};
			},
			prompt(links, player) {
				return "请选择" + get.translation(links[0]) + "的目标";
			},
		},
		ai: {
			order: 10,
			result: {
				player(player, target) {
					if (
						!game.hasPlayer(function (current) {
							return current !== player && current.hasSkill("dddfusi") && get.attitude(player, current) >= 0;
						})
					) {
						return 0;
					}
					if (_status.event.dying) {
						return get.attitude(player, _status.event.dying);
					}
					return 1;
				},
			},
			respondSha: true,
			respondShan: true,
			skillTagFilter(player, tag, arg) {
				var name;
				switch (tag) {
					case "respondSha":
						name = "sha";
						break;
					case "respondShan":
						name = "shan";
						break;
				}
				return lib.skill["dddfusi_global"].hiddenCard(player, name);
			},
		},
	},
	dddtuoji: {
		trigger: { global: "useCardAfter" },
		frequent: true,
		filter(event, player) {
			return (
				event.card.storage &&
				event.card.storage._dddfusi_owner === player &&
				!player.hasCard(function (card) {
					return !get.is.shownCard(card);
				}, "h")
			);
		},
		content() {
			player.draw(3);
		},
		ai: {
			combo: "dddfusi",
		},
	},
	dddchashi: {
		trigger: { global: "phaseUseBegin" },
		direct: true,
		filter(event, player) {
			return player !== event.player && player.countCards("he") > 0;
		},
		*content(event, map) {
			const player = map.player,
				trigger = map.trigger,
				target = trigger.player;
			const valuableCards = target.getCards("hs", card => target.hasValueTarget(card));
			let result = yield player
				.chooseToDiscard(get.prompt("dddchashi", target), "弃置一张牌，若其使用的下一张牌的花色或类型与此牌相同，你与其各摸一张牌", "he")
				.set("logSkill", ["dddchashi", target])
				.set("ai", card => {
					if (!get.event("goon")) {
						return 0;
					}
					var list = get.event("list");
					return list[0].includes(get.suit(card)) || list[1].includes(get.type2(card));
				})
				.set("list", [valuableCards.map(card => get.suit(card)).toUniqued(), valuableCards.map(card => get.type2(card)).toUniqued()])
				.set("goon", get.attitude(player, target) > 0);
			if (!result.bool) {
				return event.finish();
			}
			player.storage["dddchashi"] = [result.cards[0], target];
			player.addTempSkill("dddchashi_effect", "phaseUseAfter");
			target.addTempSkill("dddchashi_ai", {
				player: ["phaseUseAfter", "useCard1"],
			});
		},
		content_old() {
			"step 0";
			var target = trigger.player,
				history = target.getHistory("useCard", function (evt) {
					return evt.getParent("phaseUse") === trigger;
				});
			event.target = target;
			if (history.length > 0) {
				var suit = get.suit(history[0].card);
				event.suit = suit;
				player
					.chooseCard("he", get.prompt("dddchashi", target), "你可以展示一张牌。若此牌花色为" + get.translation(suit) + "，则" + get.translation(target) + "获得你展示的牌，然后你摸一张牌。")
					.set("goon", get.sgn(get.attitude(player, target)))
					.set("ai", function (card) {
						if (_status.event.goon <= 0) {
							return _status.event.goon * (get.value(card) + 0.01);
						}
						return 2 / Math.max(0.1, get.value(card));
					});
			} else {
				event.goto(2);
			}
			"step 1";
			if (result.bool) {
				player.logSkill("dddchashi", target);
				var card = result.cards[0];
				player.showCards(card, get.translation(player) + "对" + get.translation(target) + "发动了【察势】");
				if (get.color(card) === event.suit) {
					target.gain(card, player, "give");
					player.draw();
				}
			}
			event.finish();
			"step 2";
			player
				.chooseCard("he", get.prompt("dddchashi", target), "你可以展示一张牌。若其本阶段内使用的第一张牌与此牌花色相同，则" + get.translation(target) + "获得你展示的牌，然后你摸一张牌。")
				.set("goon", get.sgn(get.attitude(player, target)))
				.set("ai", function (card) {
					if (_status.event.goon <= 0) {
						return _status.event.goon * (get.value(card) + 0.01);
					}
					return 2 / Math.max(0.1, get.value(card));
				});
			"step 3";
			if (result.bool) {
				player.logSkill("dddchashi", target);
				var card = result.cards[0];
				player.showCards(card, get.translation(player) + "对" + get.translation(target) + "发动了【察势】");
				player.addTempSkill("dddchashi_effect", "phaseUseAfter");
				player.addGaintag([card], "dddchashi");
				player.storage["dddchashi"] = [card, target];
				target.addTempSkill("dddchashi_ai", {
					player: ["phaseUseAfter", "useCard1"],
				});
			}
		},
		subSkill: {
			effect: {
				trigger: { global: "useCard" },
				forced: true,
				charlotte: true,
				filter(event, player) {
					var storage = player.getStorage("dddchashi");
					if (!storage || !storage.length) {
						return false;
					}
					if (event.player !== storage[1] || !event.player.isIn()) {
						return false;
					}
					if (get.suit(event.card) !== get.suit(storage[0]) && get.type2(event.card) !== get.type2(storage[0])) {
						return false;
					}
					return true;
				},
				content() {
					var storage = player.getStorage("dddchashi");
					game.asyncDraw([player, storage[1]].sortBySeat(_status.currentPhase));
					player.removeSkill("dddchashi_effect");
				},
				onremove(player, storage) {
					delete player.storage["dddchashi"];
				},
			},
			ai: {
				charlotte: true,
			},
		},
	},
	dddqice: {
		trigger: { player: "phaseZhunbeiBegin" },
		filter(event, player) {
			return !player.storage["dddqice"];
		},
		content() {
			player.draw(2);
			player.setStorage("dddqice", true);
			player
				.when("useCard1")
				.filter(evt => get.type2(evt.card) === "trick")
				.then(() => {
					delete player.storage["dddqice"];
				});
		},
		subSkill: {
			effect: {
				trigger: { player: "phaseJieshuBegin" },
				forced: true,
				charlotte: true,
				content() {
					"step 0";
					var list = [];
					player.getHistory("useCard", function (evt) {
						if (get.type(evt.card) === "trick") {
							list.add(evt.card.name);
						}
					});
					list.sort();
					if (list.length > 0) {
						player
							.chooseButton(["齐策：是否视为使用一张牌？", [list, "vcard"]], function (button) {
								return _status.event.player.hasUseTarget({
									name: button.link[2],
									isCard: true,
								});
							})
							.set("ai", function (button) {
								var card = {
										name: button.link[2],
										nature: button.link[3],
										isCard: true,
									},
									player = _status.event.player;
								return player.getUseValue(card);
							});
					} else {
						player.removeSkills("dddqice");
						event.finish();
					}
					"step 1";
					if (result.bool) {
						player.chooseUseTarget(true, {
							name: result.links[0][2],
							isCard: true,
						});
					}
				},
			},
		},
	},
	//甄姬
	dddmiaoxing: {
		audio: 2,
		trigger: { global: "gameDrawBegin" },
		forced: true,
		content() {
			const me = player;
			const numx = trigger.num;
			trigger.num =
				typeof numx === "function"
					? function (player) {
							if (player === me) {
								return 3 * numx(player);
							}
							return numx(player);
						}
					: function (player) {
							if (player === me) {
								return 3 * numx;
							}
							return numx;
						};
			player._dddmiaoxing = true;
			const effect = "dddmiaoxing_out";
			player.addTempSkill(effect, { player: `${effect}After` });
		},
		group: "dddmiaoxing_balance",
		marktext: "水",
		intro: {
			name: "水相",
			markcount(storage, player) {
				return "" + player.getExpansions("dddmiaoxing_1").length + "/" + player.getExpansions("dddmiaoxing_2").length;
			},
			mark(dialog, content, player) {
				const content1 = player.getExpansions("dddmiaoxing_1");
				const content2 = player.getExpansions("dddmiaoxing_2");
				if (content1?.length || content2?.length) {
					if (player === game.me || player.isUnderControl()) {
						if (content1?.length) {
							dialog.addText("第一组");
							dialog.addAuto(content1);
						}
						if (content2?.length) {
							dialog.addText("第二组");
							dialog.addAuto(content2);
						}
					} else {
						let str = "";
						if (content1?.length) {
							str += `第一组“水相”有${get.cnNumber(content1.length)}张`;
						}
						if (content1?.length && content2?.length) {
							str += `；`;
						}
						if (content2?.length) {
							str += `第二组“水相”有${get.cnNumber(content2.length)}张`;
						}
						return str;
					}
				}
			},
		},
		subSkill: {
			out: {
				charlotte: true,
				trigger: { global: "phaseBefore", player: "enterGame" },
				filter(event, player) {
					return (event.name !== "phase" || game.phaseNumber === 0) && player._dddmiaoxing;
				},
				forced: true,
				popup: false,
				async content(event, trigger, player) {
					delete player._dddmiaoxing;
					const hs = player.getCards("h");
					if (!hs.length) {
						return;
					}
					const num = Math.ceil(hs.length / 3);
					const cards = [hs.slice(0, num), hs.slice(num, 2 * num), hs.slice(2 * num)];
					const choices = [],
						dialog = ["淼形：选择一组作为你的手牌"];
					for (let i = 0; i < 3; i++) {
						const str = `第${get.cnNumber(i + 1, true)}组`;
						if (cards[i]?.length) {
							choices.push(str);
							dialog.addArray([`<span class="text center">${str}</span>`, cards[i]]);
						}
					}
					const { result } = await player.chooseControl(choices).set("dialog", dialog);
					cards.splice(result.index, 1);
					let index = 0;
					while (index < 2) {
						const next = player.addToExpansion(cards[index], player, "giveAuto", false);
						next.gaintag.add(`dddmiaoxing_${index + 1}`);
						await next;
						player.markSkill("dddmiaoxing");
						index++;
					}
				},
			},
			balance: {
				trigger: { player: "phaseDrawAfter" },
				filter(event, player) {
					return ["dddmiaoxing_1", "dddmiaoxing_2"].some(tag => player.countExpansions(tag) !== player.countCards("h"));
				},
				locked: true,
				async cost(event, trigger, player) {
					const forced = player.getExpansions("dddmiaoxing_1").length !== player.countCards("h") && player.getExpansions("dddmiaoxing_2").length !== player.countCards("h");
					const dialog = ["淼形：将至少一组“水相”调整至与手牌数相等", [[0, 1].map(i => [i, `第${get.cnNumber(i + 1)}组`]), "tdnodes"]];
					for (let i = 0; i < 2; i++) {
						const str = `第${get.cnNumber(i + 1, true)}组`;
						const cards = player.getExpansions(`dddmiaoxing_${i + 1}`);
						if (cards.length) {
							dialog.addArray([`<span class="text center">${str}</span>`, cards]);
						}
					}
					const next = player.chooseButton([1, 2], forced).set("createDialog", dialog);
					next.set("filterButton", button => {
						const player = get.player();
						const type = typeof button.link;
						return type === "number" && player.countExpansions(`dddmiaoxing_${button.link + 1}`) !== player.countCards("h");
					});
					next.set("ai", button => {
						const player = get.player();
						const ind = button.link + 1;
						return player.countCards("h") - player.countExpansions(`dddmiaoxing_${ind}`);
					});
					const { result } = await next;
					event.result = {
						bool: result?.bool,
						cost_data: result?.links,
					};
				},
				async content(event, trigger, player) {
					const { cost_data: links } = event;
					for (const link of links.sort()) {
						const tag = `dddmiaoxing_${link + 1}`;
						const expansions = player.getExpansions(tag);
						const del = player.countCards("h") - expansions.length;
						if (del === 0) {
							continue;
						} else if (del > 0) {
							const next = player.addToExpansion(get.cards(del), player, "draw");
							next.gaintag.add(tag);
							await next;
						} else if (expansions.length) {
							const { result } = await player.chooseButton([`淼形：移除${get.cnNumber(-del)}张第${get.cnNumber(link + 1)}组的“水相”`, expansions], -del, true).set("ai", button => {
								return -get.buttonValue(button);
							});
							if (result?.bool && result?.links?.length) {
								await player.loseToDiscardpile(result.links);
							}
						}
						player.markSkill("dddmiaoxing");
					}
				},
			},
		},
	},
	dddfushi: {
		audio: 2,
		trigger: { player: ["useCardAfter", "respondAfter"] },
		filter(event, player) {
			return get.type(event.card) === "basic" && (player.countCards("h") || ["dddmiaoxing_1", "dddmiaoxing_2"].some(tag => player.countExpansions(tag)));
		},
		usable: 1,
		async cost(event, trigger, player) {
			const choices = [];
			if (player.countExpansions("dddmiaoxing_1") || player.countCards("h")) {
				choices.push("第一组");
			}
			if (player.countExpansions("dddmiaoxing_2") || player.countCards("h")) {
				choices.push("第二组");
			}
			const dialog = [get.prompt(event.skill), '<span class="text center">用所有手牌交换一组“水相”</span>'];
			for (let i = 0; i < 2; i++) {
				const str = `第${get.cnNumber(i + 1, true)}组`;
				const cards = player.getExpansions(`dddmiaoxing_${i + 1}`);
				if (cards.length) {
					dialog.addArray([`<span class="text center">${str}</span>`, cards]);
				}
			}
			const { result } = await player
				.chooseControl(choices, "cancel2")
				.set("dialog", dialog)
				.set("ai", () => {
					return get.event("choice");
				})
				.set(
					"choice",
					(() => {
						const fn = player === _status.currentPhase ? "useful" : "value";
						const list = [
							[1, player.getExpansions("dddmiaoxing_1").reduce((p, c) => p + get[fn](c), 0)],
							[2, player.getExpansions("dddmiaoxing_2").reduce((p, c) => p + get[fn](c), 0)],
							[3, player.getCards("h").reduce((p, c) => p + get[fn](c), 0)],
						].sort((a, b) => b[1] - a[1]);
						return list[0][0] - 1;
					})()
				);
			event.result = {
				bool: result?.control !== "cancel2",
				cost_data: result?.index,
			};
		},
		async content(event, trigger, player) {
			const index = event.cost_data + 1;
			const tag = `dddmiaoxing_${index}`;
			const gain = player.getExpansions(tag);
			if (player.countCards("h")) {
				const next = player.addToExpansion(player.getCards("h"), player, "giveAuto");
				next.gaintag.add(tag);
				await next;
			}
			if (gain.length) {
				await player.gain(gain, "draw");
				game.log(player, `获得了${get.cnNumber(gain.length)}张“水相”`);
			}
			player.markSkill("dddmiaoxing");
			const targets = game.filterPlayer(current => current.hasSex("male"));
			if (!targets.length) {
				return;
			}
			let result;
			result = await player
				.chooseTarget("是否令一名男性角色选择是否交换“水相”？", (card, player, target) => {
					if (!target.hasSex("male")) {
						return false;
					}
					return target.countCards("h") || ["dddmiaoxing_1", "dddmiaoxing_2"].some(tag => player.countExpansions(tag));
				})
				.set("ai", target => {
					const player = get.player();
					return get.attitude(player, target);
				})
				.forResult();
			if (result?.bool && result?.targets?.length) {
				const {
					targets: [target],
				} = result;
				player.line(target);
				const choices = [];
				if (player.countExpansions("dddmiaoxing_1") || target.countCards("h")) {
					choices.push("第一组");
				}
				if (player.countExpansions("dddmiaoxing_2") || target.countCards("h")) {
					choices.push("第二组");
				}
				if (!choices.length) {
					return;
				}
				const dialog = [get.prompt(event.name), '<span class="text center">用所有手牌交换一组“水相”</span>'];
				for (let i = 0; i < 2; i++) {
					const str = `第${get.cnNumber(i + 1, true)}组`;
					const cards = player.getExpansions(`dddmiaoxing_${i + 1}`);
					if (cards.length) {
						dialog.addArray([`<span class="text center">${str}</span>`, cards]);
					}
				}
				result = await target
					.chooseControl(choices, "cancel2")
					.set("dialog", dialog)
					.set("ai", () => {
						return get.event("choice");
					})
					.set(
						"choice",
						(() => {
							const fn = target === _status.currentPhase ? "useful" : "value";
							const list = [
								[1, player.getExpansions("dddmiaoxing_1").reduce((p, c) => p + get[fn](c), 0)],
								[2, player.getExpansions("dddmiaoxing_2").reduce((p, c) => p + get[fn](c), 0)],
								[3, target.getCards("h").reduce((p, c) => p + get[fn](c), 0)],
							].sort((a, b) => b[1] - a[1]);
							return list[0][0] - 1;
						})()
					)
					.forResult();
				if (result?.control === "cancel2" || typeof result?.index !== "number") {
					return;
				}
				const index = result.index + 1;
				const tag = `dddmiaoxing_${index}`;
				const gain = player.getExpansions(tag);
				if (target.countCards("h")) {
					const next = player.addToExpansion(target.getCards("h"), player, "giveAuto");
					next.gaintag.add(tag);
					await next;
				}
				if (gain.length) {
					await target.gain(gain, player, "giveAuto");
				}
				player.markSkill("dddmiaoxing");
			}
		},
	},
	//赵昂
	dddfenji: {
		audio: 2,
		trigger: { player: ["phaseDrawBegin1", "phaseDiscardBegin"] },
		direct: true,
		filter(event, player) {
			if (event.name === "phaseDraw" && event.numFixed) {
				return false;
			}
			return lib.inpile.filter(i => get.type(i) === "trick").removeArray(player.getStorage("dddfenji")).length > 0;
		},
		content() {
			"step 0";
			var cards = lib.inpile
				.filter(i => {
					return get.type(i) === "trick" && !player.getStorage("dddfenji").includes(i);
				})
				.map(i => ["锦囊", "", i]);
			player
				.chooseButton([get.prompt("dddfenji"), [cards, "vcard"]])
				.set("ai", button => {
					var evt = _status.event.getTrigger();
					if (evt.name === "phaseDraw") {
						if (!get.tag({ name: button.link[2] }, "damage")) {
							return 0;
						}
					} else {
						if (
							lib.skill.xunshi.isXunshi({
								name: button.link[2],
							})
						) {
							return 0;
						}
					}
					return _status.event.player.getUseValue({
						name: button.link[2],
					});
				})
				.set("filterButton", button => {
					return player.hasUseTarget(button.link[2]);
				});
			"step 1";
			if (result.bool) {
				player.logSkill("dddfenji");
				player.markAuto("dddfenji", [result.links[0][2]]);
				player.chooseUseTarget(result.links[0][2], true);
			} else {
				event.finish();
			}
			"step 2";
			if (trigger.name === "phaseDraw") {
				trigger.changeToZero();
				var num = 0;
				game.filterPlayer(current => {
					current.getHistory("sourceDamage", evt => {
						if (evt.getParent(4) === event) {
							num += evt.num;
						}
					});
				});
				if (num > 0) {
					player.draw(num);
				}
			} else {
				trigger.cancel();
				var num = 0;
				player.getHistory("useCard", evt => {
					if (evt.getParent(2) === event) {
						num = evt.targets.length;
					}
				});
				if (num > 0 && player.countCards("he")) {
					player.chooseToDiscard(num, true);
				}
			}
		},
	},
	//周处
	dddxiaheng: {
		audio: 2,
		trigger: { player: "phaseUseBegin" },
		forced: true,
		onremove: ["dddxiaheng", "dddxiaheng_del"],
		intro: { content: "已因此技能对$造成过伤害" },
		content() {
			"step 0";
			event.targets = [];
			player.chooseTarget("侠横：令一名角色弃置两张牌", true).set("ai", target => {
				var player = _status.event.player,
					eff = get.effect(target, { name: "guohe_copy2" }, player, player),
					eff2 = get.damageEffect(target, player, player);
				if (player.storage["dddxiaheng_del"]) {
					return eff;
				}
				var toself = false;
				if (eff2 > eff * 2) {
					toself = !player.isDamaged() && player.countCards("he", card => get.value(card, player) < 5) >= 2;
				}
				if (toself) {
					return target === player ? 100 : 0;
				}
				return eff * (eff2 > eff * 2 ? 0.5 : 1.5);
			});
			"step 1";
			if (result.bool) {
				var target = result.targets[0];
				event.targets.add(target);
				player.line(target);
				target.chooseToDiscard(2, true, "he");
			}
			"step 2";
			player
				.chooseTarget("侠横：对一名角色造成1点伤害", true)
				.set("ai", target => {
					var player = _status.event.player,
						eff = get.damageEffect(target, player, player),
						targetx = _status.event.targetx;
					if (player.storage["dddxiaheng_del"]) {
						return eff;
					}
					var fix = player.getStorage("dddxiaheng").includes(target) ? 0.75 : 1;
					if (target === player && targetx !== player && player.isHealthy() && !player.getStorage("dddxiaheng").includes(player) && player.hp > 2) {
						return 100;
					}
					return eff * (player.hp === 1 || target === targetx ? 0.1 : 1) * fix;
				})
				.set("targetx", targets[0]);
			"step 3";
			if (result.bool) {
				var target = result.targets[0];
				event.targets.add(target);
				player.line(target);
				target.damage();
				player.markAuto("dddxiaheng", [target]);
			}
			"step 4";
			if (player.storage["dddxiaheng_del"]) {
				event.finish();
			} else {
				if (!targets.includes(player)) {
					player.loseMaxHp();
				}
				if (targets.length === 1) {
					player.removeSkills("dddxiaheng");
				}
			}
			"step 5";
			if (player.getStorage("dddxiaheng").length >= 3) {
				player.storage["dddxiaheng_del"] = true;
			}
		},
	},
	//刘巴
	dddfengzheng: {
		audio: 2,
		global: "dddfengzheng_global",
		trigger: {
			global: "roundStart",
		},
		filter(event, player) {
			return game.hasPlayer(current => {
				var history = current.actionHistory;
				for (var i = history.length - 2; i >= 0; i--) {
					var evts = history[i].useSkill;
					for (var evt of evts) {
						if (evt.skill === "dddfengzheng_global") {
							return true;
						}
					}
					if (history[i].isRound) {
						break;
					}
				}
				return false;
			});
		},
		prompt2(event, player) {
			var num = game.countPlayer(current => {
				var history = current.actionHistory;
				for (var i = history.length - 2; i >= 0; i--) {
					var evts = history[i].useSkill;
					for (var evt of evts) {
						if (evt.skill === "dddfengzheng_global") {
							return true;
						}
					}
					if (history[i].isRound) {
						break;
					}
				}
				return false;
			});
			return "观看并分配牌堆顶的" + get.cnNumber(num) + "张牌";
		},
		content() {
			"step 0";
			var num = game.countPlayer(current => {
				var history = current.actionHistory;
				for (var i = history.length - 2; i >= 0; i--) {
					var evts = history[i].useSkill;
					for (var evt of evts) {
						if (evt.skill === "dddfengzheng_global") {
							return true;
						}
					}
					if (history[i].isRound) {
						break;
					}
				}
				return false;
			});
			var cards = game.cardsGotoOrdering(get.cards(num)).cards;
			event.cards = cards;
			if (_status.connectMode) {
				game.broadcastAll(function () {
					_status.noclearcountdown = true;
				});
			}
			event.given_map = {};
			"step 1";
			if (event.cards.length > 1) {
				player.chooseCardButton("丰政：请选择要分配的牌", true, event.cards, [1, event.cards.length]).set("ai", function (button) {
					if (ui.selected.buttons.length === 0) {
						return 1;
					}
					return 0;
				});
			} else if (event.cards.length === 1) {
				event._result = {
					links: event.cards.slice(0),
					bool: true,
				};
			} else {
				event.finish();
			}
			"step 2";
			if (result.bool) {
				event.cards.removeArray(result.links);
				event.togive = result.links.slice(0);
				player
					.chooseTarget("选择一名角色获得" + get.translation(result.links), true)
					.set("ai", function (target) {
						var fix = (_status.event.getParent().given_map[target.playerid] || 0) + 1;
						var att = get.attitude(_status.event.player, target) / Math.sqrt(fix);
						if (_status.event.enemy) {
							return -att;
						} else if (att > 0) {
							return att / (1 + target.countCards("h"));
						} else {
							return att / 100;
						}
					})
					.set("enemy", get.value(event.togive[0], player, "raw") < 0);
			}
			"step 3";
			if (result.targets.length) {
				var id = result.targets[0].playerid,
					map = event.given_map;
				if (!map[id]) {
					map[id] = [];
				}
				map[id].addArray(event.togive);
			}
			if (cards.length > 0) {
				event.goto(1);
			}
			"step 4";
			if (_status.connectMode) {
				game.broadcastAll(function () {
					delete _status.noclearcountdown;
					game.stopCountChoose();
				});
			}
			var list = [],
				lose = false;
			for (var i in event.given_map) {
				var source = (_status.connectMode ? lib.playerOL : game.playerMap)[i];
				player.line(source, "green");
				list.push([source, event.given_map[i]]);
				if (event.given_map[i].length > 2) {
					lose = true;
				}
			}
			game.loseAsync({
				gain_list: list,
				giver: player,
				animate: "draw",
			}).setContent("gaincardMultiple");
			if (!lose) {
				event.finish();
			}
			"step 5";
			player.removeSkills("dddfengzheng");
		},
		subSkill: {
			global: {
				audio: "dddfengzheng",
				enable: "phaseUse",
				usable: 1,
				filter(event, player) {
					return game.hasPlayer(current => current.hasSkill("dddfengzheng"));
				},
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
					return num === 13;
				},
				popname: true,
				complexCard: true,
				prompt: "将任意张点数和为13的手牌当【无中生有】使用",
				check(card) {
					var num = 0;
					for (var i = 0; i < ui.selected.cards.length; i++) {
						num += get.number(ui.selected.cards[i]);
					}
					if (num + get.number(card) === 13) {
						return 5.5 - get.value(card);
					}
					if (ui.selected.cards.length === 0) {
						var cards = _status.event.player.getCards("h");
						for (var i = 0; i < cards.length; i++) {
							for (var j = i + 1; j < cards.length; j++) {
								if (get.number(cards[i]) + get.number(cards[j]) === 13) {
									if (cards[i] === card || cards[j] === card) {
										return 6 - get.value(card);
									}
								}
							}
						}
					}
					return 0;
				},
				position: "hs",
				viewAs: { name: "wuzhong" },
			},
		},
	},
	dddyulv: {
		audio: 2,
		trigger: {
			global: "phaseBefore",
			player: "enterGame",
		},
		forced: true,
		filter(event, player) {
			return event.name !== "phase" || game.phaseNumber === 0;
		},
		group: "dddyulv_enter",
		content() {
			"step 0";
			player.draw();
			"step 1";
			if (!player.countCards("he")) {
				event.finish();
			} else {
				player.chooseCard("玉律：将一张牌置于武将牌上", true);
			}
			"step 2";
			if (result.bool) {
				player.addToExpansion(result.cards, player, "give").gaintag.add("dddyulv");
			}
		},
		marktext: "律",
		intro: {
			markcount: "expansion",
			content: "expansion",
		},
		subSkill: {
			enter: {
				trigger: {
					global: ["loseAfter", "cardsDiscardAfter", "loseAsyncAfter", "equipAfter"],
				},
				forced: true,
				direct: true,
				filter(event, player) {
					var cards = event.getd();
					if (!cards.length) {
						return false;
					}
					const card = player.getExpansions("dddyulv")[0];
					if (!card) {
						return false;
					}
					const number = get.number(card, false);
					if (!_status.currentPhase || !_status.currentPhase.isIn()) {
						return false;
					}
					return cards.some(i => get.number(i, false) === number);
				},
				content() {
					"step 0";
					player
						.chooseControl("摸牌", "弃牌")
						.set("prompt", "玉律：令" + get.translation(_status.currentPhase) + "摸一张牌或弃置一张牌")
						.set("ai", () => {
							return get.attitude(_status.event.player, _status.currentPhase) > 0 ? "摸牌" : "弃牌";
						});
					"step 1";
					player.logSkill("dddyulv_enter", _status.currentPhase);
					var reset = false;
					if (result.index === 0) {
						_status.currentPhase.draw();
					} else {
						_status.currentPhase.chooseToDiscard(true, "he");
					}
					var reset =
						player.getHistory("useSkill", evt => {
							return evt.skill === "dddyulv_enter";
						}).length === 2;
					if (!reset) {
						event.finish();
					}
					"step 2";
					if (!player.countCards("h")) {
						player.draw();
					}
					"step 3";
					if (!player.countCards("h")) {
						event.finish();
					} else {
						player.chooseCard("玉律：选择一张手牌交换“玉律”（" + get.translation(player.getExpansions("dddyulv")) + "）", true);
					}
					"step 4";
					if (result.bool) {
						player.gain(player.getExpansions("dddyulv"), player, "give");
						player.addToExpansion(result.cards, player, "log", "give").gaintag.add("dddyulv");
					}
				},
			},
		},
	},
	dddyulv_old: {
		audio: 2,
		trigger: {
			global: "phaseBefore",
			player: "enterGame",
		},
		forced: true,
		filter(event, player) {
			return event.name !== "phase" || game.phaseNumber === 0;
		},
		group: "dddyulv_old_enter",
		content() {
			"step 0";
			player
				.chooseControl(Array.from({ length: 13 }, (_, i) => get.strNumber(i + 1)))
				.set("prompt", "玉律：声明一个点数")
				.set("ai", () => _status.event.controls.randomGet());
			"step 1";
			player.popup(result.control);
			var number = result.index + 1;
			player.storage["dddyulv_old"] = number;
			player.markSkill("dddyulv_old");
		},
		intro: {
			content: "声明的点数为#",
		},
		subSkill: {
			enter: {
				trigger: {
					global: ["loseAfter", "cardsDiscardAfter", "loseAsyncAfter", "equipAfter"],
				},
				forced: true,
				direct: true,
				filter(event, player) {
					var cards = event.getd();
					if (!cards.length || !player.storage["dddyulv_old"]) {
						return false;
					}
					if (!_status.currentPhase || !_status.currentPhase.isIn()) {
						return false;
					}
					return cards.some(i => get.number(i, false) === player.storage["dddyulv_old"]);
				},
				content() {
					"step 0";
					player
						.chooseControl("摸牌", "弃牌")
						.set("prompt", "玉律：令" + get.translation(_status.currentPhase) + "摸一张牌或弃置一张牌")
						.set("ai", () => {
							return get.attitude(_status.event.player, _status.currentPhase) > 0 ? "摸牌" : "弃牌";
						});
					"step 1";
					player.logSkill("dddyulv_old_enter", _status.currentPhase);
					var reset = false;
					if (result.index === 0) {
						_status.currentPhase.draw();
					} else {
						_status.currentPhase.chooseToDiscard(true, "he");
					}
					if (_status.currentPhase.hasSkill("dddyulv_old_" + result.index)) {
						reset = true;
					}
					_status.currentPhase.removeSkill("dddyulv_old_0");
					_status.currentPhase.removeSkill("dddyulv_old_1");
					_status.currentPhase.addSkill("dddyulv_old_" + result.index);
					if (!reset) {
						event.finish();
					}
					"step 2";
					player
						.chooseControl(Array.from({ length: 13 }, (_, i) => get.strNumber(i + 1)))
						.set("prompt", "玉律：重新声明一个点数")
						.set("ai", () => _status.event.controls.randomGet());
					"step 3";
					player.popup(result.control);
					var number = result.index + 1;
					player.storage["dddyulv_old"] = number;
					player.markSkill("dddyulv_old");
					"step 4";
					var evt = trigger.getParent("phaseUse");
					if (evt && evt.name === "phaseUse") {
						evt.skipped = true;
					}
					var evt = trigger.getParent("phase");
					if (evt && evt.name === "phase") {
						game.log(evt.player, "结束了回合");
						evt.finish();
						evt.untrigger(true);
					}
				},
			},
			0: { charlotte: true },
			1: { charlotte: true },
		},
	},
	//蹇硕
	dddfenye: {
		audio: 2,
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
			player.chooseToCompare([target]).setContent(lib.skill["dddfenye"].chooseToCompareFenye);
			"step 1";
			result.winner.forEach(i => i.addExpose(0.05));
			result.loser.forEach(i => i.addExpose(0.05));
			if (result.winner.length && result.loser.length) {
				var players = result.winner;
				event.players = players.sortBySeat();
				event.targets = result.loser;
			} else {
				event.finish();
			}
			"step 2";
			var current = event.players.shift();
			event.current = current;
			current
				.chooseTarget("是否视为对一名没赢的角色使用一张【杀】？", (card, player, target) => {
					return player.canUse("sha", target, false) && _status.event.targets.includes(target);
				})
				.set("ai", target => {
					return get.effect(target, { name: "sha" }, get.player(), get.player());
				})
				.set("targets", event.targets);
			"step 3";
			if (result.bool) {
				if (!event.isMine() && !event.isOnline()) {
					game.delayx();
				}
				var target = result.targets[0];
				event.current.useCard({ name: "sha", isCard: true }, target, false);
				event.targets.remove(target);
			}
			if (event.targets.length && event.players.length) {
				event.goto(2);
			}
		},
		chooseToCompareFenye() {
			"step 0";
			var target = event.targets[0];
			event.targets.unshift(player);
			event.targetx = target;
			if (player.countCards("h") === 0 || target.countCards("h") === 0) {
				event.result = { cancelled: true, bool: false };
				event.finish();
				return;
			}
			game.log(player, "对", target, "发起拼点");
			"step 1";
			var send = function (targets) {
				var next = game.createEvent("dddfenye_choose", false);
				next.targets = targets;
				next.ai = event.ai;
				next.fixedResult = event.fixedResult;
				next.setContent(lib.skill["dddfenye"].contentx);
				game.resume();
			};
			var sendback = function (result, player) {
				if (!Array.isArray(result)) {
					result = [null, null];
				}
				event.results.push([player, result]);
			};
			event.ai_targets = [];
			event.results = [];
			var players = game.filterPlayer().sortBySeat();
			var time = 10000;
			if (lib.configOL && lib.configOL.choose_timeout) {
				time = parseInt(lib.configOL.choose_timeout) * 1000;
			}
			for (var i = 0; i < players.length; i++) {
				players[i].showTimer(time);
				if (players[i].isOnline()) {
					event.withol = true;
					players[i].send(send, targets);
					players[i].wait(sendback);
				} else if (players[i] === game.me) {
					event.withme = true;
					var next = game.createEvent("dddfenye_choose", false);
					next.player = game.me;
					next.targets = targets;
					next.ai = event.ai;
					next.fixedResult = event.fixedResult;
					next.setContent(lib.skill["dddfenye"].contentx);
					if (_status.connectMode) {
						game.me.wait(sendback);
					}
				} else {
					event.ai_targets.push(players[i]);
				}
			}
			if (event.ai_targets.length) {
				for (var i = 0; i < event.ai_targets.length; i++) {
					if (targets.includes(event.ai_targets[i])) {
						var target = event.ai_targets[i];
						var cards = target.getCards("h").sort((a, b) => {
							return event.ai(b) - event.ai(a);
						});
						sendback([target, cards[0]], target);
						event.ai_targets.splice(i--, 1);
					}
				}
				if (event.ai_targets.length) {
					event.ai_targets.randomSort();
					setTimeout(function () {
						event.interval = setInterval(
							function () {
								var target = event.ai_targets.shift();
								var cards = target
									.getCards("h", card => get.value(card) < 4)
									.sort((a, b) => {
										return event.ai(b) - event.ai(a);
									});
								if (!cards.length) {
									sendback([null, null], target);
								} else {
									if (Math.abs(get.number(cards[0]) - 7) <= 2) {
										sendback([null, null], target);
									} else {
										var sgn = get.number(cards[0]) >= 7 ? 1 : -1;
										var targetsx = targets.slice().sort((a, b) => {
											var attA = get.attitude(target, a),
												attB = get.attitude(target, b);
											return sgn * (attB - attA);
										});
										sendback([targetsx[0], cards[0]], target);
									}
								}
								if (!event.ai_targets.length) {
									clearInterval(event.interval);
									if (event.withai) {
										game.resume();
									}
								}
							},
							_status.connectMode ? 750 : 75
						);
					}, 500);
				}
			}
			"step 2";
			if (event.withme) {
				if (_status.connectMode) {
					game.me.unwait(result, game.me);
				} else {
					if (!Array.isArray(result)) {
						result = [null, null];
					}
					event.results.push([game.me, result]);
				}
			}
			"step 3";
			if (event.withol && !event.resultOL) {
				game.pause();
			}
			"step 4";
			if (event.ai_targets.length > 0) {
				event.withai = true;
				game.pause();
			}
			"step 5";
			delete event._global_waiting;
			for (var i of game.players) {
				i.hideTimer();
			}
			var cards = [];
			var targets = [];
			var lose_list = [];
			event.results.sort((a, b) => lib.sort.seat(a[0], b[0]));
			for (var res of event.results) {
				var target = res[0],
					card = res[1][1],
					skill = res[1][2];
				if (!target || !card) {
					continue;
				}
				if (skill && lib.skill[skill] && lib.skill[skill].onCompare) {
					target.logSkill(skill);
					res[1][1] = lib.skill[skill].onCompare(target);
					if (target !== player) {
						cards.push(res[1][1]);
					}
				} else {
					if (target !== player) {
						cards.push(card);
					}
					lose_list.push([target, [card]]);
				}
				if (target !== player) {
					targets.push(target);
				}
			}
			if (lose_list.length) {
				game.loseAsync({
					lose_list: lose_list,
				}).setContent("chooseToCompareLose");
			}
			event.lose_list = lose_list;
			event.getNum = function (card) {
				for (var i of event.lose_list) {
					if (i[1].includes && i[1].includes(card)) {
						return get.number(card, i[0]);
					}
				}
				return get.number(card, false);
			};
			event.cardlist = cards;
			event.cards = cards;
			event.card1 = event.results[0][1][1];
			event.num1 = event.getNum(event.card1);
			event.iwhile = 0;
			event.targets = targets;
			event.tempplayer = event.player;
			event.players = event.results.filter(i => i[1][0] === player && i[1][1]).map(i => i[0]);
			event.targetsx = event.results.filter(i => i[1][0] === event.targetx && i[1][1]).map(i => i[0]);
			event.result = {
				player: event.card1,
				targets: event.cardlist.slice(0),
				num1: [event.num1],
				num2: [],
				winner: [],
				loser: [],
			};
			game.log(player, "的拼点牌为", event.card1);
			"step 6";
			event.target = null;
			event.trigger("compare");
			lib.skill["dddfenye"].$compareFenye(
				event.players,
				event.results.filter(i => i[1][0] === player).map(i => i[1][1]),
				event.targetsx,
				event.results.filter(i => i[1][0] === event.targetx).map(i => i[1][1])
			);
			"step 7";
			if (event.iwhile < targets.length) {
				event.target = targets[event.iwhile];
				event.target.addTempClass("target");
				event.card2 = event.cardlist[event.iwhile];
				event.num2 = event.getNum(event.card2);
				game.log(event.target, "的拼点牌为", event.card2);
				delete event.player;
				event.trigger("compare");
			} else {
				event.iwhile = 0;
				game.delay(0, 1000);
				event.goto(9);
			}
			"step 8";
			var key = event.players.includes(target) ? "num1" : "num2";
			event.result[key].push(event.num2);
			event.iwhile++;
			event.goto(7);
			"step 9";
			event.player = event.tempplayer;
			event.trigger("compareFixing");
			"step 10";
			if (event.player) {
				delete event.player;
			}
			if (event.iwhile < targets.length) {
				event.target = targets[event.iwhile];
				event.trigger("compareFixing");
			} else {
				event.goto(12);
			}
			"step 11";
			event.iwhile++;
			event.goto(10);
			"step 12";
			event.player = event.tempplayer;
			delete event.tempplayer;
			var str;
			var num1 = event.result.num1.reduce((p, c) => p + c, 0) / event.result.num1.length,
				num2 = event.result.num2.reduce((p, c) => p + c, 0) / event.result.num2.length;
			game.log(event.player, "方的点数均值为", "#y" + Math.floor(num1 * 100) / 100);
			game.log(event.targetx, "方的点数均值为", "#y" + Math.floor(num2 * 100) / 100);
			if (event.players.includes(event.forceWinner) || (!event.targetsx.includes(event.forceWinner) && num1 > num2)) {
				str = get.translation(event.players) + "拼点成功";
				event.players.forEach(i => i.popup("胜"));
				event.targetsx.forEach(i => i.popup("负"));
				event.result.winner = event.players;
				event.result.loser = event.targetsx;
			} else {
				str = get.translation(event.players) + "拼点失败";
				if (!event.targetsx.includes(event.forceWinner) && num1 === num2) {
					event.players.forEach(i => i.popup("平"));
					event.targetsx.forEach(i => i.popup("平"));
					event.result.loser = event.players.addArray(event.targetsx);
				} else {
					event.players.forEach(i => i.popup("负"));
					event.targetsx.forEach(i => i.popup("胜"));
					event.result.winner = event.targetsx;
					event.result.loser = event.players;
				}
			}
			game.broadcastAll(function (str) {
				var dialog = ui.create.dialog(str);
				dialog.classList.add("center");
				setTimeout(function () {
					dialog.close();
				}, 1000);
			}, str);
			game.delay(3);
			"step 13";
			game.broadcastAll(ui.clear);
			"step 14";
			event.cards.add(event.card1);
		},
		contentx() {
			"step 0";
			var player = game.me;
			event.player = player;
			event._global_waiting = true;
			event.result = [];
			if (targets.includes(player)) {
				if (event.fixedResult && event.fixedResult[player.playerid]) {
					event.result[0] = player;
					event.result[1] = event.fixedResult[player.playerid];
					event.finish();
				} else {
					player.chooseCard("请选择拼点牌", true).set("type", "compare").set("glow_result", true).set("_global_waiting", true).ai = event.ai;
				}
			} else {
				player.chooseCardTarget({
					targets: targets,
					filterTarget(card, player, target) {
						return _status.event.targets.includes(target);
					},
					selectCard: 1,
					prompt: "是否于此次拼点加入其中一方？",
					position: "h",
					_global_waiting: true,
					ai1: event.ai,
					ai2(target) {
						var player = _status.event.player,
							sgn = -1;
						if (player.hasCard(card => get.number(card) > 10 && get.value(card) < 5)) {
							sgn = 1;
						}
						return sgn * get.attitude(player, target);
					},
				});
			}
			"step 1";
			if (targets.includes(player)) {
				event.result[0] = player;
				event.result[1] = result.cards[0];
				event.result[2] = result.skill;
			} else {
				if (result.bool) {
					event.result[0] = result.targets[0];
					event.result[1] = result.cards[0];
				} else {
					event.result = [null, null];
				}
			}
		},
		$compareFenye(players, cards1, targets, cards2) {
			game.broadcast(
				function (players, cards1, targets, cards2) {
					lib.skill["dddfenye"].$compareFenye(players, cards1, targets, cards2);
				},
				players,
				cards1,
				targets,
				cards2
			);
			var left0 = -players.length * 52 - (players.length - 1) * 8;
			for (var i = 0; i < players.length; i++) {
				(function (target, card1, i) {
					var left = left0 + i * 120;
					var node1;
					if (left < 0) {
						node1 = target.$throwxy2(card1, "calc(50% - " + -left + "px)", "calc(50% + 10px)", "perspective(600px) rotateY(180deg)", true);
					} else {
						node1 = target.$throwxy2(card1, "calc(50% + " + left + "px)", "calc(50% + 10px)", "perspective(600px) rotateY(180deg)", true);
					}
					if (lib.config.cardback_style !== "default") {
						node1.style.transitionProperty = "none";
						ui.refresh(node1);
						node1.classList.add("infohidden");
						ui.refresh(node1);
						node1.style.transitionProperty = "";
					} else {
						node1.classList.add("infohidden");
					}
					node1.style.transform = "perspective(600px) rotateY(180deg) translateX(0)";
					var onEnd02 = function () {
						node1.removeEventListener("webkitTransitionEnd", onEnd02);
						setTimeout(function () {
							node1.style.transition = "all ease-in 0.3s";
							node1.style.transform = "perspective(600px) rotateY(270deg) translateX(52px)";
							var onEnd = function () {
								node1.classList.remove("infohidden");
								node1.style.transition = "all 0s";
								ui.refresh(node1);
								node1.style.transform = "perspective(600px) rotateY(-90deg) translateX(52px)";
								ui.refresh(node1);
								node1.style.transition = "";
								ui.refresh(node1);
								node1.style.transform = "";
								node1.removeEventListener("webkitTransitionEnd", onEnd);
							};
							node1.listenTransition(onEnd);
						}, 200);
					};
					node1.listenTransition(onEnd02);
				})(players[i], cards1[i], i);
			}
			setTimeout(function () {
				var left0 = -targets.length * 52 - (targets.length - 1) * 8;
				for (var i = 0; i < targets.length; i++) {
					(function (target, card2, i) {
						var left = left0 + i * 120;
						var node2;
						if (left < 0) {
							node2 = target.$throwxy2(card2, "calc(50% - " + -left + "px)", "calc(50% - 114px)", "perspective(600px) rotateY(180deg)", true);
						} else {
							node2 = target.$throwxy2(card2, "calc(50% + " + left + "px)", "calc(50% - 114px)", "perspective(600px) rotateY(180deg)", true);
						}
						if (lib.config.cardback_style !== "default") {
							node2.style.transitionProperty = "none";
							ui.refresh(node2);
							node2.classList.add("infohidden");
							ui.refresh(node2);
							node2.style.transitionProperty = "";
						} else {
							node2.classList.add("infohidden");
						}
						node2.style.transform = "perspective(600px) rotateY(180deg) translateX(0)";
						var onEnd02 = function () {
							node2.removeEventListener("webkitTransitionEnd", onEnd02);
							setTimeout(function () {
								node2.style.transition = "all ease-in 0.3s";
								node2.style.transform = "perspective(600px) rotateY(270deg) translateX(52px)";
								var onEnd = function () {
									node2.classList.remove("infohidden");
									node2.style.transition = "all 0s";
									ui.refresh(node2);
									node2.style.transform = "perspective(600px) rotateY(-90deg) translateX(52px)";
									ui.refresh(node2);
									node2.style.transition = "";
									ui.refresh(node2);
									node2.style.transform = "";
									node2.removeEventListener("webkitTransitionEnd", onEnd);
								};
								node2.listenTransition(onEnd);
							}, 200);
						};
						node2.listenTransition(onEnd02);
					})(targets[i], cards2[i], i);
				}
			}, 200);
		},
		ai: {
			order: 1,
			result: {
				target: -1,
			},
			threaten: 1.3,
		},
	},
	dddshichao: {
		audio: 2,
		trigger: {
			player: "phaseZhunbeiBegin",
		},
		filter(event, player) {
			return player.countMark("dddshichao") + 1 <= game.countPlayer() && get.zhu(player);
		},
		onremove: true,
		forced: true,
		content() {
			"step 0";
			var N = player.countMark("dddshichao") + 1;
			player
				.chooseTarget("逝潮：选择一名手牌数第" + get.cnNumber(N) + "大的角色", true, (card, player, target) => {
					return _status.event.targets.includes(target);
				})
				.set("ai", target => {
					var zhu = get.zhu(player);
					return Math.min(target.countCards("h") - player.countCards("h"), zhu.maxHp - player.countCards("h"));
				})
				.set(
					"targets",
					(function () {
						var list = game
							.filterPlayer()
							.map(i => [i, i.countCards("h")])
							.sort((a, b) => b[1] - a[1]);
						var targets = [];
						var ind = 0,
							tmp = Infinity;
						for (var i of list) {
							if (i[1] < tmp) {
								ind++;
								tmp = i[1];
							}
							if (ind === N) {
								targets.push(i[0]);
							}
							if (ind > N) {
								break;
							}
						}
						if (!targets.length) {
							targets = game.filterPlayer(i => i.countCards("h") === list[list.length - 1][1]);
						}
						return targets;
					})()
				);
			"step 1";
			if (result.bool) {
				var target = result.targets[0];
				player.logSkill("dddshichao", target);
				var zhu = get.zhu(player);
				var del = Math.min(target.countCards("h") - player.countCards("h"), zhu.maxHp - player.countCards("h"));
				if (del > 0) {
					player.draw(del);
				}
				if (del < 0) {
					player.chooseToDiscard(-del, true);
				}
				target.addSkill("dddshichao_up");
				target.markAuto("dddshichao_up", [player]);
				player.addTempSkill("dddshichao_clear", {
					player: "phaseBegin",
				});
				player.markAuto("dddshichao_clear", [target]);
			}
		},
		subSkill: {
			up: {
				trigger: { source: "damageBegin2" },
				filter(event, player) {
					return player.getStorage("dddshichao_up").includes(event.player);
				},
				charlotte: true,
				check(event, player) {
					var eff = get.damageEffect(event.player, player, player);
					return (event.player.hasSkill("dddshichao") && eff < 0) || (event.num === 1 && eff < 13);
				},
				logTarget: "player",
				content() {
					"step 0";
					trigger.cancel();
					if (trigger.player.hasSkill("dddshichao")) {
						trigger.player.addMark("dddshichao", 1, false);
					}
				},
			},
			clear: {
				charlotte: true,
				onremove(player) {
					game.filterPlayer(current => {
						current.unmarkAuto("dddshichao_up", [player]);
					});
				},
			},
		},
	},
	//管宁
	dddyouxue: {
		audio: 2,
		trigger: { global: "roundStart" },
		forced: true,
		content() {
			"step 0";
			if (!game.hasPlayer(current => current.hasMark("dddyouxue"))) {
				player.addMark("dddyouxue");
			}
			if (!game.hasPlayer(current => !current.hasMark("dddyouxue"))) {
				event.finish();
			}
			"step 1";
			player
				.chooseTarget("游学：将“游学”标记交给另一名角色", true, (card, player, target) => {
					return !target.hasMark("dddyouxue");
				})
				.set("ai", target => {
					return get.distance(
						game.findPlayer(current => current.hasMark("dddyouxue")),
						target
					);
				});
			"step 2";
			if (result.bool) {
				var target = result.targets[0];
				var source = game.findPlayer(current => current.hasMark("dddyouxue"));
				if (source === player) {
					player.line(target, "green");
				} else {
					player.line2([source, target], "green");
				}
				source.clearMark("dddyouxue");
				target.addMark("dddyouxue");
				player.draw(get.distance(source, target));
			}
		},
		marktext: "游",
		intro: {
			name: "游学",
			content: () => get.translation(game.filterPlayer(current => current.hasSkill("dddyouxue"))) + "到此一游",
		},
	},
	dddchengjing: {
		audio: 2,
		trigger: { global: "phaseEnd" },
		filter(event, player) {
			if (!event.player.hasMark("dddyouxue")) {
				return false;
			}
			return event.player.hasHistory("useCard", evt => {
				if (!["basic", "trick"].includes(get.type(evt.card))) {
					return false;
				}
				if (!evt.card.isCard || evt.cards.length !== 1) {
					return false;
				}
				return get.position(evt.cards[0], true) === "d";
			});
		},
		forced: true,
		locked: false,
		group: "dddchengjing_use",
		logTarget: "player",
		*content(event, map) {
			const player = map.player,
				trigger = map.trigger,
				target = trigger.player;
			let history = target.getHistory("useCard").reverse();
			let cards = [];
			for (var evt of history) {
				if (!["basic", "trick"].includes(get.type(evt.card))) {
					continue;
				}
				if (!evt.card.isCard || evt.cards.length !== 1) {
					continue;
				}
				if (get.position(evt.cards[0], true) === "d") {
					cards.addArray(evt.cards);
					break;
				}
			}
			const jing = player.getExpansions("dddchengjing");
			if (jing.length) {
				player.loseToDiscardpile(jing);
			}
			player.addToExpansion(cards, "log", "gain2").gaintag.add("dddchengjing");
		},
		marktext: "经",
		intro: {
			name: "经(承经)",
			name2: "经",
			markcount: "expansion",
			content: "expansion",
		},
		subSkill: {
			use: {
				audio: "dddchengjing",
				enable: "phaseUse",
				usable: 1,
				filterCard: true,
				position: "hes",
				filter(event, player) {
					return player.getExpansions("dddchengjing").length > 0;
				},
				viewAs(cards, player) {
					const card = player.getExpansions("dddchengjing")[0];
					return new lib.element.VCard({
						name: get.name(card, false),
						nature: get.nature(card, false),
						storage: { dddchengjing: true },
					});
				},
				popname: true,
				prompt() {
					const card = get.player().getExpansions("dddchengjing")[0];
					return (
						"将一张牌当" +
						get.translation({
							name: get.name(card, false),
							nature: get.nature(card, false),
						}) +
						"使用"
					);
				},
				precontent() {
					player
						.when("useCardAfter")
						.filter(evt => evt.card.storage.dddchengjing)
						.then(() => {
							var cards = trigger.cards.filterInD("od");
							if (!cards.length) {
								event.finish();
								return;
							}
							var target = game.findPlayer(current => current.hasMark("dddyouxue"));
							if (!target) {
								event.finish();
								return;
							}
							target = target.getNext();
							event.target = target;
							player.chooseBool(`承经：是否将${get.translation(cards)}交给${get.translation(target)}？`).set("choice", get.attitude(player, target) > 0);
						})
						.then(() => {
							if (result.bool) {
								player.line(event.target);
								player.addExpose(0.1);
								event.target.gain(trigger.cards.filterInD("od"), "gain2");
							}
						});
				},
			},
		},
		ai: {
			combo: "dddyouxue",
		},
	},
	dddduanbing: {
		enable: "phaseUse",
		filter(event, player) {
			return player.canAddJudge("bingliang") && player.hasCard(card => lib.skill["dddduanbing"].filterCard(card, player), "he");
		},
		filterCard(card, player) {
			if (get.color(card) !== "black" || get.type2(card) === "trick") {
				return false;
			}
			return player.canAddJudge(get.autoViewAs({ name: "bingliang" }, [card]));
		},
		check(card) {
			return 8.2 - get.value(card);
		},
		discard: false,
		lose: false,
		delay: false,
		prepare: "throw",
		group: "dddduanbing_effect",
		position: "he",
		content() {
			"step 0";
			player.addJudge({ name: "bingliang" }, cards);
			"step 1";
			game.delayx();
			player.draw(2);
			"step 2";
			player.chooseUseTarget(
				{
					name: "sha",
					isCard: true,
					storage: { _dddduanbing: true },
				},
				false,
				"nodistance"
			);
		},
		ai: {
			order(item, player) {
				return get.order({ name: "sha" }) - 0.1;
			},
			result: {
				player(player) {
					return player.getUseValue({ name: "sha" }, false);
				},
			},
		},
		subSkill: {
			effect: {
				trigger: { source: "damageSource" },
				charlotte: true,
				filter(event, player) {
					if (event.getParent().type !== "card" || !event.player.isIn()) {
						return false;
					}
					return player.hasCard(card => {
						return (card.viewAs || card.name) === "bingliang" && event.player.canAddJudge(card);
					}, "j");
				},
				prompt: event => "是否将【兵粮寸断】转移给" + get.translation(event.player) + "？",
				check(event, player) {
					return player.hasCard(card => {
						return (
							(card.viewAs || card.name) === "bingliang" &&
							event.player.canAddJudge(card) &&
							get.effect(
								event.player,
								new lib.element.VCard({
									name: "bingliang",
									cards: [card],
								}),
								player,
								_status.event.player
							) >= 0
						);
					}, "j");
				},
				content() {
					var cards = player.getCards("j", card => {
						return (card.viewAs || card.name) === "bingliang" && trigger.player.canAddJudge(card);
					});
					var target = trigger.player;
					player.line(target);
					player.$give(cards, target, false);
					cards.forEach(card => {
						target.addJudge({ name: "bingliang" }, card);
					});
				},
			},
		},
	},
	//轲比能
	dddxiaoxing: {
		audio: 2,
		trigger: { global: "gameDrawBegin" },
		forced: true,
		group: "dddxiaoxing_remove",
		init(player, skill) {
			if (game.online) {
				return;
			}
			var bool = get.event().getParent("phaseLoop", true);
			if (!bool) {
				return;
			}
			if (player.hasSkill(skill)) {
				player.logSkill("dddxiaoxing");
				player.draw(3);
			}
		},
		content() {
			var me = player;
			var numx = trigger.num;
			trigger.num =
				typeof numx === "function"
					? function (player) {
							if (player === me) {
								return 3 + numx(player);
							}
							return numx(player);
						}
					: function (player) {
							if (player === me) {
								return 3 + numx;
							}
							return numx;
						};
		},
		mod: {
			attackRange: (player, num) => num + 3,
			maxHandcard: (player, num) => num + 3,
		},
		subSkill: {
			remove: {
				trigger: { player: "dying" },
				forced: true,
				content() {
					player.removeSkills("dddxiaoxing");
				},
				content_old() {
					"step 0";
					trigger.source
						.chooseBool(get.prompt("dddxiaoxing", player), "废除武器栏，令其失去〖枭行〗")
						.set("ai", () => {
							if (_status.event.maybe) {
								return Math.random() < 0.5;
							}
							return false;
						})
						.set(
							"maybe",
							player.countCards("hs", {
								name: ["tao", "jiu"],
							}) && player.countCards("h") >= 3
						);
					"step 1";
					if (result.bool) {
						trigger.source.logSkill("dddxiaoxing", player);
						trigger.source.disableEquip(1);
						player.removeSkills("dddxiaoxing");
					}
				},
			},
		},
	},
	dddlangzhi: {
		audio: 2,
		trigger: { player: "phaseJieshuBegin" },
		logTarget(event, player) {
			return game.filterPlayer(current => player.inRange(current) && current.countCards("he"));
		},
		prompt: "是否发动【狼志】？",
		prompt2(event, player) {
			return `展示${get.translation(game.filterPlayer(current => player.inRange(current) && current.countCards("he")))}的各一张牌，然后选择一项：1.用任意张牌替换其中等量张牌；2.获得所有展示牌，失去〖狼志〗。`;
		},
		content() {
			"step 0";
			event.targets = game.filterPlayer(current => player.inRange(current) && current.countCards("he"));
			event.cards = [];
			event.num = 0;
			"step 1";
			var target = targets[num];
			event.num++;
			event.target = target;
			player.choosePlayerCard("狼志：展示" + get.translation(target) + "一张牌", "he", target, true);
			"step 2";
			if (result.bool) {
				var card = result.links[0];
				player.showCards(card, get.translation(target) + "被展示");
				event.cards.push(card);
			}
			"step 3";
			if (num < targets.length) {
				event.goto(1);
			} else {
				event.videoId = lib.status.videoId++;
				if (event.isMine()) {
					event.dialog = ui.create.dialog('###是否替换其中的任意张牌？###<div class="text center">或点击“取消”，获得所有展示牌，然后失去〖狼志〗</div>', cards);
					event.dialog.videoId = event.videoId;
				} else if (player.isOnline2()) {
					player.send(
						function (cards, id) {
							var dialog = ui.create.dialog('###是否替换其中的任意张牌？###<div class="text center">或点击“取消”，获得所有展示牌，然后失去〖狼志〗</div>', cards);
							dialog.videoId = id;
						},
						cards,
						event.videoId
					);
				}
				player
					.chooseCard([1, cards.length], "he")
					.set("ai", card => {
						if (ui.selected.cards.length >= _status.event.num) {
							return 0;
						}
						return 100 - get.value(card);
					})
					.set(
						"num",
						(function () {
							if (cards.length < Math.floor(game.countPlayer() / 2 - 0.5)) {
								return 0;
							}
							var val = cards.reduce((p, c) => p + get.value(c), 0);
							if (val < cards.length * 6) {
								return 0;
							}
							var list1 = player.getCards("he").map(card => get.value(card, player)),
								list2 = cards.map((card, i) => get.value(card, targets[i]) * get.sgnAttitude(player, targets[i]));
							list1.sort((a, b) => a[1] - b[1]);
							list2.sort((a, b) => b[1] - a[1]);
							list2 = list2.filter(i => i > 0);
							var count = 0;
							for (var i of list2) {
								for (var j = 0; j < list1.length; j++) {
									if (i > list1[j]) {
										count++;
										list1.splice(j, 1);
										break;
									}
								}
							}
							return count;
						})()
					)
					.set("prompt", false);
			}
			"step 4";
			if (result.bool) {
				var cards2 = result.cards;
				event.cards2 = cards2;
				var func = function (id) {
					var dialog = get.idDialog(id);
					if (dialog) {
						dialog.content.childNodes[1].innerHTML = '<div class="text center">选择要交换的牌（按选择的顺序一一交换）</div>';
					}
				};
				if (event.isMine()) {
					func(event.videoId);
				} else if (player.isOnline2()) {
					player.send(func, event.videoId);
				}
				player
					.chooseButton(cards2.length, true)
					.set("dialog", event.videoId)
					.set("ai", button => {
						return get.value(button.link);
					});
				event.goto(6);
			} else {
				for (var i = 0; i < cards.length; i++) {
					targets[i].$give(cards[i], player, false);
				}
				player.gain(cards, "log");
			}
			"step 5";
			player.removeSkills("dddlangzhi");
			event.finish();
			"step 6";
			game.broadcastAll("closeDialog", event.videoId);
			if (result.bool) {
				var cards2 = event.cards2,
					cards3 = result.links;
				if (cards2.length !== cards3.length) {
					return;
				}
				for (var i = 0; i < cards2.length; i++) {
					player.swapHandcards(get.owner(cards3[i]), [cards2[i]], [cards3[i]]);
				}
			} else {
				event.finish();
			}
			"step 7";
			game.delayx();
		},
	},
	dddfuyi: {
		audio: 2,
		zhuSkill: true,
		locked: true,
		trigger: {
			global: "dieAfter",
		},
		filter(event, player) {
			if (!event.source || !event.source.isIn() || event.source.group !== "qun") {
				return false;
			}
			if (!event.source.countCards("he") < 2) {
				return false;
			}
			if (!player.hasZhuSkill("dddfuyi", event.source)) {
				return false;
			}
			const skills = player.getStockSkills(true, true).filter(skill => {
				return !player.hasSkill(skill, null, false, false);
			});
			return skills.length > 0;
		},
		filter_old(event, player) {
			var evt = event.getParent();
			if (evt.name !== "die" || evt.source !== event.player || event.player === player) {
				return false;
			}
			if (!player.hasZhuSkill("dddfuyi", event.player)) {
				return false;
			}
			var skills = player.getSkills("dddxiaoxing", null, false, false);
			return !skills.includes("dddxiaoxing") || !skills.includes("dddlangzhi");
		},
		direct: true,
		global: "dddfuyi_sha",
		content() {
			"step 0";
			trigger.source.chooseCard("是否响应" + get.translation(player) + "的【附义】？", "弃置两张牌，令其获得其武将牌上的一个技能", "he", 2, lib.filter.cardDiscardable).set("ai", () => {
				let zhu = _status.event.getParent().player;
				if (
					!zhu.getStockSkills(true, true).some(skill => {
						return !zhu.hasSkill(skill, null, false, false);
					}) ||
					get.attitude(_status.event.player, zhu) <= 2
				) {
					return 0;
				}
				return 6 - get.value(card);
			});
			"step 1";
			if (result.bool) {
				player.logSkill("dddfuyi", trigger.source);
				trigger.source.discard(result.cards).discarder = trigger.source;
				var skills = player.getStockSkills(true, true).filter(skill => {
					return !player.hasSkill(skill, null, false, false);
				});
				if (skills.length === 1) {
					event._result = { control: skills[0] };
				} else if (!skills.length) {
					event.finish();
				} else {
					trigger.source
						.chooseControl(skills)
						.set(
							"choiceList",
							skills.map(skill => {
								return '<div class="skill">【' + get.translation(lib.translate[skill + "_ab"] || get.translation(skill).slice(0, 2)) + "】</div><div>" + get.skillInfoTranslation(skill, player) + "</div>";
							})
						)
						.set("displayIndex", false)
						.set("prompt", `附义：选择令${get.translation(player)}获得一个技能`)
						.set("ai", () => {
							var controls = get.event("controls");
							if (controls.includes("dddxiaoxing")) {
								return "dddxiaoxing";
							}
							return controls.sort((a, b) => {
								return get.skillrank(b, "inout") - get.skillrank(a, "inout");
							})[0];
						});
				}
			} else {
				event.finish();
			}
			"step 2";
			var skill = result.control;
			player.addSkills(skill);
		},
		content_old() {
			"step 0";
			var str = "取消此次奖惩，令其获得";
			var skills = player.getSkills("dddxiaoxing", null, false, false);
			var bool1 = !skills.includes("dddxiaoxing"),
				bool2 = !skills.includes("dddlangzhi");
			var choices = [];
			if (bool1) {
				str += "〖枭行〗";
				choices.push("dddxiaoxing");
			}
			if (bool1 && bool2) {
				str += "/";
			}
			if (bool2) {
				str += "〖狼志〗";
				choices.push("dddlangzhi");
			}
			if (bool1 && bool2) {
				str += "中的一或两个";
				choices.push("dddfuyi_both");
			}
			choices.push("cancel2");
			trigger.player
				.chooseControl(choices)
				.set("prompt", "是否对" + get.translation(player) + "发动【附义】？")
				.set("prompt2", str)
				.set("ai", () => {
					if (get.attitude(_status.event.player, _status.event.getParent().player) <= 2) {
						return "cancel2";
					}
					if (_status.event.choices.includes("dddfuyi_both")) {
						return "dddfuyi_both";
					}
					if (_status.event.choices.includes("dddlangzhi")) {
						return "dddlangzhi";
					}
					return Math.random() < 0.5 ? "dddxiaoxing" : "cancel2";
				});
			"step 1";
			if (result.control !== "cancel2") {
				trigger.player.logSkill("dddfuyi", player);
				trigger.cancel();
				var skills = [result.control];
				if (result.control === "dddfuyi_both") {
					skills = ["dddxiaoxing", "dddlangzhi"];
					player.draw(3);
				} else {
					event.finish();
				}
				player.addSkills(skills);
			} else {
				event.finish();
			}
			"step 2";
			player.removeSkills("dddfuyi");
		},
		subSkill: {
			sha: {
				mod: {
					cardUsable(card, player, num) {
						if (card.name === "sha") {
							if (player.group !== "qun") {
								return;
							}
							return (
								num +
								game.countPlayer(current => {
									return current.hasZhuSkill("dddfuyi", player);
								})
							);
						}
					},
				},
			},
		},
	},
	//曹爽
	dddzhuanshe: {
		audio: 2,
		trigger: { global: "phaseUseBegin" },
		filter(event, player) {
			return player.countCards("h") > 0 && event.player !== player;
		},
		direct: true,
		content() {
			"step 0";
			player
				.chooseCard(get.prompt2("dddzhuanshe", trigger.player))
				.set("ai", card => {
					var target = _status.event.getTrigger().player;
					if (!_status.event.goon) {
						if (get.value(card) < 4) {
							return -target.getUseValue(card) + 0.001;
						}
						return 0;
					}
					return target.getUseValue(card);
				})
				.set("goon", get.attitude(player, trigger.player));
			"step 1";
			if (result.bool) {
				var card = result.cards[0];
				player.logSkill("dddzhuanshe", trigger.player);
				player.give(card, trigger.player, true);
				player.addTempSkill("dddzhuanshe_effect");
				player.markAuto("dddzhuanshe_effect", [card.name]);
			}
		},
		subSkill: {
			effect: {
				audio: "dddzhuanshe",
				trigger: { global: "useCard2" },
				filter(event, player) {
					if (!player.getStorage("dddzhuanshe_effect").includes(event.card.name)) {
						return false;
					}
					if (event.player !== _status.currentPhase) {
						return false;
					}
					var type = get.type(event.card, null, false);
					if (type !== "basic" && type !== "trick") {
						return false;
					}
					var info = get.info(event.card);
					if (info.allowMultiple === false) {
						return false;
					}
					if (event.targets && !info.multitarget) {
						if (
							game.hasPlayer(function (current) {
								return !event.targets.includes(current) && lib.filter.targetEnabled2(event.card, event.player, current);
							})
						) {
							return true;
						}
					}
					return false;
				},
				direct: true,
				group: "dddzhuanshe_damage",
				charlotte: true,
				onremove: true,
				content() {
					"step 0";
					var prompt2 = "为" + get.translation(trigger.card) + "增加一个目标";
					player
						.chooseTarget(get.prompt("dddzhuanshe_effect"), function (card, player, target) {
							var player = _status.event.source;
							return !_status.event.targets.includes(target) && lib.filter.targetEnabled2(_status.event.card, player, target);
						})
						.set("prompt2", prompt2)
						.set("ai", function (target) {
							var trigger = _status.event.getTrigger();
							var player = _status.event.source;
							return get.effect(target, trigger.card, player, _status.event.player);
						})
						.set("targets", trigger.targets)
						.set("card", trigger.card)
						.set("source", trigger.player);
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
			damage: {
				audio: "dddzhuanshe",
				trigger: { global: "phaseEnd" },
				filter(event, player) {
					var list = player.getStorage("dddzhuanshe_effect").slice();
					event.player.getHistory("useCard", evt => {
						list.remove(evt.card.name);
					});
					return list.length;
				},
				charlotte: true,
				logTarget: "player",
				prompt2: "对其造成1点伤害",
				check(event, player) {
					return get.damageEffect(event.player, player, player) >= 0;
				},
				content() {
					trigger.player.damage(player);
				},
			},
		},
	},
	dddweiqiu: {
		audio: 2,
		trigger: { global: "recoverBefore" },
		filter(event, player) {
			return !player.countCards("h");
		},
		forced: true,
		direct: true,
		content() {
			trigger.player.logSkill("dddweiqiu", player);
			trigger.cancel();
			player.draw();
		},
	},
	//薛灵芸
	dddlianer: {
		audio: 2,
		trigger: { player: "useCardAfter" },
		filter(event, player) {
			return event.cards.filterInD("od").length > 0 && get.color(event.card) === "red";
		},
		content() {
			"step 0";
			var cards = trigger.cards.filterInD("od");
			event.cards = cards;
			player.gain(cards, "gain2");
			"step 1";
			var number = get.number(cards[0]);
			if (cards.length === 1 && typeof number === "number") {
				player.addTempSkill("dddlianer_ceiling");
				player.storage["dddlianer_ceiling"] = number;
			}
		},
		mod: {
			aiOrder(player, card, num) {
				if (get.itemtype(card) === "card" && get.color(card) === "red") {
					if (!player.storage["dddlianer_ceiling"]) {
						return;
					}
					var numx = get.number(card);
					if (typeof numx === "number") {
						return num + 10 / Math.max(1, player.storage["dddlianer_ceiling"] - numx);
					}
				}
			},
		},
		subSkill: {
			ceiling: {
				onremove: true,
				charlotte: true,
				mod: {
					cardEnabled(card, player) {
						if (!player.storage["dddlianer_ceiling"]) {
							return;
						}
						var num = get.number(card);
						if (num !== "unsure" && (typeof num !== "number" || player.storage["dddlianer_ceiling"] <= num)) {
							return false;
						}
					},
					cardRespondable(card, player) {
						if (!player.storage["dddlianer_ceiling"]) {
							return;
						}
						var num = get.number(card);
						if (num !== "unsure" && (typeof num !== "number" || player.storage["dddlianer_ceiling"] <= num)) {
							return false;
						}
					},
					cardSavable(card, player) {
						if (!player.storage["dddlianer_ceiling"]) {
							return;
						}
						var num = get.number(card);
						if (num !== "unsure" && (typeof num !== "number" || player.storage["dddlianer_ceiling"] <= num)) {
							return false;
						}
					},
				},
			},
		},
	},
	dddanzhi: {
		audio: 2,
		trigger: { global: "phaseBegin" },
		filter(event, player) {
			var evts = game.getAllGlobalHistory("everything", evt => ["useCard", "respond"].includes(evt.name));
			if (!evts.length) {
				return false;
			}
			const color = get.color(evts.lastItem.card, false);
			return color === "black";
		},
		direct: true,
		content() {
			"step 0";
			player.chooseTarget(get.prompt("dddanzhi"), "选择一名角色，此回合其第一次成为黑色牌的目标时，此牌对其无效").set("ai", target => {
				return get.attitude(_status.event.player, target);
			});
			"step 1";
			if (result.bool) {
				var target = result.targets[0];
				player.logSkill("dddanzhi", target);
				target.addTempSkill("dddanzhi_effect");
			}
		},
		subSkill: {
			effect: {
				trigger: { target: "useCardToTarget" },
				filter(event, player) {
					return get.color(event.card) === "black";
				},
				forced: true,
				charlotte: true,
				content() {
					trigger.targets.remove(player);
					trigger.getParent().triggeredTargets2.remove(player);
					trigger.untrigger();
					game.log(trigger.card, "对", player, "无效了");
					game.delayx();
					player.removeSkill("dddanzhi_effect");
				},
			},
		},
	},
	//刘宏
	dddshixing: {
		audio: 2,
		trigger: {
			global: ["changeHp", "useCard1", "phaseBefore"],
		},
		forced: true,
		onremove: true,
		filter(event, player) {
			var num = player.countMark("dddshixing");
			if (event.name === "changeHp") {
				if (event.player.hasSex("female")) {
					var bool = !event.player.isDamaged();
					if ((bool && (num & 1) === 0) || (!bool && (num & 1) === 1)) {
						return true;
					}
				}
				return false;
			}
			if (event.name === "useCard") {
				var bool = game.getGlobalHistory("useCard", evt => get.type2(evt.card) === "trick").length === 0;
				if ((bool && (num & 2) === 0) || (!bool && (num & 2) === 2)) {
					return true;
				}
				return false;
			}
			return true;
		},
		content() {
			lib.skill["dddshixing"].applyChange(player);
		},
		applyChange(player) {
			player.removeAdditionalSkill("dddshixing");
			var bool1 = game.hasPlayer(current => !current.isDamaged() && current.hasSex("female")),
				bool2 = game.getGlobalHistory("useCard", evt => get.type2(evt.card) === "trick").length === 0;
			player.storage["dddshixing"] = bool1 + 2 * bool2;
			var list = [];
			if (bool1) {
				list.push("xiangle");
			}
			if (bool2) {
				list.push("jiushi");
			}
			if (!bool1 && !bool2) {
				list.push("rezhiheng");
			}
			player.addAdditionalSkill("dddshixing", list);
		},
		derivation: ["xiangle", "jiushi", "rezhiheng"],
	},
	ddddanggu: {
		audio: 2,
		trigger: { player: "phaseJieshuBegin" },
		filter(event, player) {
			return game.countPlayer(current => current.isLinked()) < game.countPlayer(current => current.group === "qun");
		},
		forced: true,
		group: "ddddanggu_negative",
		content() {
			"step 0";
			if (!event.loop) {
				event.loop = 0;
			}
			var num = game.countPlayer(current => current.group === "qun") - game.countPlayer(current => current.isLinked());
			player
				.chooseTarget("党锢：横置至少" + get.cnNumber(num) + "名角色", [num, Infinity], true, (card, player, target) => {
					return !target.isLinked();
				})
				.set("ai", target => {
					return get.effect(target, { name: "tiesuo" }, _status.event.player);
				});
			"step 1";
			if (result.bool) {
				var targets = result.targets.sortBySeat();
				player.logSkill("ddddanggu", targets);
				targets.forEach(i => i.link());
			}
		},
		discard() {
			"step 0";
			game.log(player, "进入了弃牌阶段");
			event.num = Math.max(0, player.countCards("he", card => !player.canIgnoreHandcard(card)) - player.getHandcardLimit());
			if (event.num <= 0) {
				event.finish();
			} else {
				if (lib.config.show_phase_prompt) {
					player.popup("弃牌阶段");
				}
			}
			event.trigger("phaseDiscard");
			"step 1";
			player.chooseToDiscard(num, true, "he");
			"step 2";
			event.cards = result.cards;
		},
		subSkill: {
			negative: {
				trigger: { global: "phaseDiscardBegin" },
				filter(event, player) {
					return event.player !== player && event.player.isLinked();
				},
				forced: true,
				logTarget: "player",
				content() {
					trigger.setContent(lib.skill["ddddanggu"].discard);
				},
			},
		},
	},
	dddfuzong: {
		audio: 2,
		zhuSkill: true,
		trigger: {
			global: "phaseBefore",
			player: "enterGame",
		},
		forced: true,
		filter(event, player) {
			if (!player.hasZhuSkill("dddfuzong")) {
				return false;
			}
			return event.name !== "phase" || game.phaseNumber === 0;
		},
		group: "dddfuzong_discard",
		content() {
			player.draw(
				game.countPlayer(current => {
					return current.group === "qun";
				})
			);
		},
		subSkill: {
			discard: {
				trigger: { global: "die" },
				filter(event, player) {
					if (!player.hasZhuSkill("dddfuzong")) {
						return false;
					}
					return event.player.group === "qun";
				},
				zhuSkill: true,
				forced: true,
				logTarget: "player",
				content() {
					trigger.player.discardPlayerCard(player, "he", true).set("forceDie", true);
				},
			},
		},
	},
	//夏侯玄
	dddlanghuai: {
		audio: 2,
		trigger: { player: "phaseDrawBegin1" },
		zhuanhuanji: true,
		direct: true,
		content() {
			"step 0";
			if (player.hasMark("dddxuanlun_del")) {
				event._result = { bool: true };
			} else {
				player
					.chooseBool(get.prompt("dddlanghuai"), "展示手牌（无牌则不展示），并改为摸其中" + (!player.storage["dddlanghuai"] ? "包含" : "缺少") + "花色数的牌")
					.set("ai", () => _status.event.bool)
					.set(
						"bool",
						(function () {
							var list = [],
								cards = player.getCards("h");
							for (var i of cards) {
								var suit = get.suit(i, player);
								if (!lib.suit.includes(suit)) {
									continue;
								}
								list.add(suit);
							}
							if (player.storage["dddlanghuai"]) {
								list = list.removeArray(lib.suit);
							}
							return (list.length === 2 && !player.storage["dddlanghuai"]) || list.length > 2;
						})()
					);
			}
			"step 1";
			if (result.bool) {
				player.logSkill("dddlanghuai");
				delete player.storage["dddxuanlun_del"];
				if (player.countCards("h")) {
					player.showHandcards();
				}
			} else {
				event.finish();
			}
			"step 2";
			var list = [],
				cards = player.getCards("h");
			for (var i of cards) {
				var suit = get.suit(i, player);
				if (!lib.suit.includes(suit)) {
					continue;
				}
				list.add(suit);
			}
			if (player.storage["dddlanghuai"]) {
				list = lib.suit.slice().removeArray(list);
			}
			player.changeZhuanhuanji("dddlanghuai");
			trigger.changeToZero();
			if (list.length) {
				player.draw(list.length);
			}
		},
		mark: true,
		intro: {
			content(storage, player) {
				return "摸牌阶段，你可展示手牌（无牌则不展示），并改为摸其中" + (!storage ? "包含" : "缺少") + "花色数的牌。";
			},
		},
		marktext: "☯",
	},
	dddxuanlun: {
		audio: 2,
		trigger: { player: "damageEnd" },
		content() {
			player.draw(4);
			player.addTempSkill("dddxuanlun_choose");
		},
		ai: {
			maixie: true,
			maixie_hp: true,
			result: {
				effect(card, player, target) {
					if (get.tag(card, "damage")) {
						if (player.hasSkillTag("jueqing", false, target)) {
							return [1, -2];
						}
						if (!target.hasFriend()) {
							return;
						}
						var num = 1;
						if (get.attitude(player, target) > 0) {
							if (player.needsToDiscard()) {
								num = 0.7;
							} else {
								num = 0.5;
							}
						}
						if (target.hp >= 4) {
							return [1, num * 2.5];
						}
						if (target.hp === 3) {
							return [1, num * 1.5];
						}
						if (target.hp === 2) {
							return [1, num * 0.5];
						}
					}
				},
			},
			threaten: 0.6,
		},
		subSkill: {
			choose: {
				trigger: { global: "phaseEnd" },
				forced: true,
				charlotte: true,
				filter(event, player) {
					if (player.hasMark("dddxuanlun_del") && !player.countCards("h")) {
						return false;
					}
					return true;
				},
				content() {
					"step 0";
					var choices = [];
					var choiceList = ["将四张牌以任意顺序置于牌堆顶或底", "删去此项和〖朗怀〗中的“可”，直到你发动〖朗怀〗"];
					if (player.countCards("he") >= 4 || player.hasMark("dddxuanlun_del")) {
						choices.push("选项一");
					} else {
						choiceList[0] = '<span style="opacity:0.5; ">' + choiceList[0] + "</span>";
					}
					if (!player.hasMark("dddxuanlun_del")) {
						choices.push("选项二");
					} else {
						choiceList[1] = '<span style="opacity:0.5; text-decoration:line-through; ">' + choiceList[1] + "</span>";
					}
					if (choices.length === 1 && choices[0] === "选项一") {
						event._result = { control: "选项一" };
					} else {
						player
							.chooseControl(choices)
							.set("choiceList", choiceList)
							.set("ai", () => {
								if (!_status.event.controls.includes("选项一")) {
									return 1;
								}
								if (!_status.event.controls.includes("选项二")) {
									return 0;
								}
								var player = _status.event.player;
								var num = 0;
								for (var card of player.getCards("he")) {
									if (get.value(card, player) <= 5) {
										num++;
									}
									if (num >= 4) {
										break;
									}
								}
								return num >= 4 ? 0 : 1;
							});
					}
					"step 1";
					game.log(player, "选择了", "#y" + result.control);
					if (result.control === "选项一") {
						var cards = player.getCards("he");
						if (cards.length <= 4) {
							event._result = {
								bool: true,
								cards: cards,
							};
						} else {
							player.chooseCard("玄论：将四张牌置于牌堆顶或牌堆底", "he", true, 4);
						}
					} else {
						player.addMark("dddxuanlun_del", 1, false);
						event.finish();
					}
					"step 2";
					if (result.bool) {
						var cards = result.cards;
						event.cards = cards;
						player
							.chooseToMove()
							.set("list", [["牌堆顶", cards], ["牌堆底"]])
							.set("prompt", "玄论：将这些牌置于牌堆顶或牌堆底")
							.set("processAI", function (list) {
								var cards = list[0][1],
									player = _status.event.player;
								var target = _status.currentPhase?.next;
								var att = get.sgn(get.attitude(player, target));
								var top = [];
								var stopped = false;
								if (target) {
									var judges = target.getCards("j");
									if (player !== target || !target.hasWuxie()) {
										for (var i = 0; i < judges.length; i++) {
											var judge = get.judge(judges[i]);
											cards.sort(function (a, b) {
												return (judge(b) - judge(a)) * att;
											});
											if (judge(cards[0]) * att < 0) {
												stopped = true;
												break;
											} else {
												top.unshift(cards.shift());
											}
										}
									}
								}
								var bottom;
								if (!stopped) {
									cards.sort(function (a, b) {
										return (get.value(b, player) - get.value(a, player)) * att;
									});
									while (cards.length) {
										if (get.value(cards[0], player) <= 5 === att > 0) {
											break;
										}
										top.unshift(cards.shift());
									}
								}
								bottom = cards;
								return [top, bottom];
							});
					} else {
						event.finish();
					}
					"step 3";
					if (result.bool) {
						var top = result.moved[0];
						var bottom = result.moved[1];
						top.reverse();
						player.popup(get.cnNumber(top.length) + "上" + get.cnNumber(bottom.length) + "下");
						var cards = top.concat(bottom);
						player.$throw(cards.length, 1000);
						player.lose(cards, ui.cardPile).set("top", top).insert_index = function (event, card) {
							if (event.top.includes(card)) {
								return ui.cardPile.firstChild;
							}
							return null;
						};
					}
				},
			},
		},
	},
	//张闿
	dddjiexing: {
		audio: 2,
		trigger: {
			global: ["recoverBegin", "useCard"],
		},
		filter(event, player) {
			if (event.player === player) {
				return false;
			}
			if (event.name === "recover") {
				return player.isDamaged();
			}
			return get.type(event.card, null, false) === "equip" && event.cards.some(i => get.position(i, true) === "o" && player.canEquip(i, true));
		},
		limited: true,
		skillAnimation: true,
		animationColor: "legend",
		logTarget: "player",
		check(event, player) {
			if (get.attitude(player, event.player) >= 0) {
				return false;
			}
			if (event.name === "recover") {
				return get.recoverEffect(event.player, player, player) < get.recoverEffect(player, player, player);
			}
			return get.effect(event.targets[0], event.card, player, player) < get.effect(player, event.card, player, player);
		},
		content() {
			player.awakenSkill(event.name);
			player.addSkill("dddjiexing_reset");
			if (trigger.name === "recover") {
				trigger.cancel();
				player.recover(trigger.num);
			} else {
				trigger.all_excluded = true;
				trigger.targets.length = 0;
				var cards = trigger.cards.filterInD();
				for (var i of cards) {
					if (player.canEquip(i, true)) {
						player.equip(i);
					}
				}
			}
		},
		subSkill: {
			reset: {
				audio: "dddjiexing",
				trigger: { player: ["recoverAfter", "useCardAfter"] },
				filter(event, player) {
					if (event.getParent().name === "dddjiexing") {
						return false;
					}
					if (event.name === "useCard") {
						return get.type(event.card, null, false) === "equip";
					}
					return true;
				},
				forced: true,
				charlotte: true,
				content() {
					player.restoreSkill("dddjiexing");
					player.removeSkill("dddjiexing_reset");
				},
			},
		},
	},
	dddbailei: {
		audio: 2,
		trigger: { player: "phaseZhunbeiBegin" },
		filter(event, player) {
			return game.hasPlayer(current => current.isMaxEquip(true) && current.countGainableCards(player, "he")) || game.hasPlayer(current => current.getHp() === 1);
		},
		direct: true,
		content() {
			"step 0";
			player
				.chooseTarget(get.prompt2("dddbailei"), (card, player, target) => {
					return (target.isMaxEquip(true) && target.countGainableCards(player, "he")) || target.getHp() === 1;
				})
				.set("ai", target => {
					var att = get.attitude(_status.event.player, target);
					if (att >= 3) {
						return false;
					}
					if (target.hp === 1) {
						return 100;
					}
					return 1;
				});
			"step 1";
			if (result.bool) {
				var target = result.targets[0];
				event.target = target;
				player.logSkill("dddbailei", target);
				if (target.isMaxEquip(true) && target.hp === 1) {
					if (target.countGainableCards(player, "he")) {
						player.gainPlayerCard("拜泪：获得" + get.translation(target) + "一张牌，或点击“取消”对其造成1点伤害", "he", target);
					} else {
						event._result = { bool: false };
					}
				} else if (target.isMaxEquip(true)) {
					player.gainPlayerCard("拜泪：获得" + get.translation(target) + "一张牌", "he", target, true);
				} else {
					event._result = { bool: false };
				}
			} else {
				event.finish();
			}
			"step 2";
			if (!result.bool) {
				player.line(target);
				target.damage();
				game.delayx();
			} else {
				event.finish();
			}
			"step 3";
			if (target.isIn()) {
				event.finish();
				return;
			}
			player.removeSkills("dddbailei");
		},
		subSkill: {
			animate: {
				skillAnimation: true,
				animationColor: "fire",
			},
		},
	},
};

export default skills;
