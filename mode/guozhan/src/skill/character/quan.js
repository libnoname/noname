import { lib, game, ui, get, ai, _status } from "noname";

/** @type {Record<string, Skill>} */
export default {
	gz_zhengbi: {
		audio: "zhengbi",
		trigger: {
			player: "phaseUseBegin",
		},
		preHidden: true,
		filter(_event, player) {
			//if(event.player!=player) return false;
			return game.hasPlayer(current => current != player && current.identity == "unknown") || player.countCards("h", { type: "basic" }) > 0;
		},
		check(event, player) {
			if (player.countCards("h", card => get.value(card) < 7)) {
				if (player.isUnseen()) {
					return Math.random() > 0.7;
				}
				return true;
			}
		},
		async content(event, trigger, player) {
			const choices = [];
			if (game.hasPlayer(current => current.isUnseen())) {
				choices.push("选择一名未确定势力的角色");
			}
			if (game.hasPlayer(current => current != player && !current.isUnseen()) && player.countCards("h", { type: "basic" })) {
				choices.push("将一张基本牌交给一名已确定势力的角色");
			}

			/** @type {Partial<Result>} */
			let result;
			if (choices.length == 1) {
				result = {
					index: choices[0] == "选择一名未确定势力的角色" ? 0 : 1,
				};
			} else {
				const next = player.chooseControl();

				next.set("prompt", "征辟：请选择一项");
				next.set("choiceList", choices);
				next.set("ai", controlCheck);

				result = await next.forResult();
			}

			switch (result.index) {
				case 0: {
					result = await player.chooseTarget("请选择一名未确定势力的角色", (card, player, target) => target != player && target.identity == "unknown", true).forResult();
					break;
				}
				default: {
					result = await player
						.chooseCardTarget({
							prompt: "请将一张基本牌交给一名已确定势力的其他角色",
							position: "h",
							filterCard(card) {
								return get.type(card) == "basic";
							},
							filterTarget(card, player, target) {
								return target != player && target.identity != "unknown";
							},
							ai1(card) {
								return 5 - get.value(card);
							},
							ai2(target) {
								const player = get.player();
								const att = get.attitude(player, target);
								if (att > 0) {
									return 0;
								}
								return -(att - 1) / target.countCards("h");
							},
						})
						.set("forced", true)
						.forResult();
					break;
				}
			}

			if (!result.targets?.length) {
				return;
			}

			const target = result.targets[0];
			player.line(result.targets, "green");
			if (result.cards?.length) {
				await player.give(result.cards, result.targets[0]);
			} else {
				player.storage.gz_zhengbi_eff1 = result.targets[0];
				player.addTempSkill("gz_zhengbi_eff1", "phaseUseAfter");
				return;
			}

			choices.length = 0;
			if (target.countCards("he", { type: ["trick", "delay", "equip"] })) {
				choices.push("一张非基本牌");
			}
			if (target.countCards("h", { type: "basic" }) > 1) {
				choices.push("两张基本牌");
			}

			if (choices.length) {
				result = await target
					.chooseControl(choices)
					.set("ai", (event, player) => {
						if (choices.length > 1) {
							if (player.countCards("he", { type: ["trick", "delay", "equip"] }, card => get.value(card) < 7)) {
								return 0;
							}
							return 1;
						}
						return 0;
					})
					.set("prompt", "征辟：交给" + get.translation(player) + "…</div>")
					.forResult();
			} else {
				if (target.countCards("h")) {
					const cards = target.getCards("h");
					await target.give(cards, player);
				}
				return;
			}

			const check = result.control == "一张非基本牌";
			result = await target.chooseCard("he", check ? 1 : 2, { type: check ? ["trick", "delay", "equip"] : "basic" }, true).forResult();
			if (result.cards?.length) {
				await target.give(result.cards, player);
			}

			return;

			function controlCheck() {
				if (choices.length > 1) {
					const player = get.player();
					let identity = null;
					if (
						!game.hasPlayer(current => {
							return (
								(!current.isUnseen() && current.getEquip("yuxi")) ||
								(current.hasSkill("gzyongsi") &&
									!game.hasPlayer(function (current) {
										return current.getEquips("yuxi").length > 0;
									}))
							);
						}) &&
						game.hasPlayer(current => {
							return current != player && current.isUnseen();
						})
					) {
						identity = game.players.find(item => item.isMajor())?.identity;
					}
					if (!player.isUnseen() && player.identity != identity && get.population(player.identity) + 1 >= get.population(identity)) {
						return 0;
					}
					return 1;
				}
				return 0;
			}
		},
		subSkill: {
			eff1: {
				audio: "zhengbi",
				trigger: {
					player: "phaseUseEnd",
				},
				forced: true,
				charlotte: true,
				onremove: true,
				filter(_event, player) {
					const target = player.storage.gz_zhengbi_eff1;
					return target && !target.isUnseen() && target.countGainableCards(player, "he") > 0;
				},
				logTarget(event, player) {
					return player?.storage.gz_zhengbi_eff1;
				},
				async content(_event, _trigger, player) {
					var num = 0;
					var target = player.storage.gz_zhengbi_eff1;
					if (target.countGainableCards(player, "h")) {
						num++;
					}
					if (target.countGainableCards(player, "e")) {
						num++;
					}
					if (num) {
						player.gainPlayerCard(target, num, "he", true).set("filterButton", button => {
							for (let i = 0; i < ui.selected.buttons.length; i++) {
								// @ts-expect-error 类型系统未来可期
								if (get.position(button.link) == get.position(ui.selected.buttons[i].link)) {
									return false;
								}
							}
							return true;
						});
					}
				},
				sub: true,
			},
		},
	},
	gz_fengying: {
		audio: "fengying",
		enable: "phaseUse",
		filterCard: true,
		selectCard: -1,
		position: "h",
		filter(_event, player) {
			return !player.storage.gz_fengying && player.countCards("h") > 0;
		},
		filterTarget(_card, player, target) {
			return target == player;
		},
		selectTarget: -1,
		discard: false,
		lose: false,
		limited: true,
		skillAnimation: "epic",
		animationColor: "gray",
		async content(event, _trigger, player) {
			const { cards, target } = event;
			player.awakenSkill("gz_fengying", undefined);
			player.storage.gz_fengying = true;
			await player.useCard({ name: "xietianzi" }, cards, target);

			const list = game.filterPlayer(current => current.isFriendOf(player) && current.countCards("h") < current.maxHp);
			list.sort(lib.sort.seat);
			player.line(list, "thunder");
			await game.asyncDraw(list, current => current.maxHp - current.countCards("h"));
		},
		ai: {
			order: 0.1,
			result: {
				player(player) {
					let value = 0;
					const cards = player.getCards("h");
					if (cards.length >= 4) {
						return 0;
					}
					for (let i = 0; i < cards.length; i++) {
						value += Math.max(0, get.value(cards[i], player, "raw"));
					}
					const targets = game.filterPlayer(function (current) {
						return current.isFriendOf(player) && current != player;
					});
					let eff = 0;
					for (let i = 0; i < targets.length; i++) {
						var num = targets[i].countCards("h") - targets[i].maxHp;
						if (num <= 0) {
							continue;
						}
						eff += num;
					}
					return 5 * eff - value;
				},
			},
		},
	},

	gz_jieyue: {
		audio: ["jieyue", 2],
		audioname2: {
			gz_jun_caocao: "jianan_jieyue",
		},
		trigger: {
			player: "phaseZhunbeiBegin",
		},
		filter(event, player) {
			return (
				player.countCards("h") > 0 &&
				game.hasPlayer(function (current) {
					return current != player && current.identity != "wei";
				})
			);
		},
		preHidden: true,
		async cost(event, _trigger, player) {
			event.result = await player
				.chooseCardTarget({
					prompt: get.prompt2("gz_jieyue"),
					position: "h",
					filterCard: true,
					filterTarget(card, player, target) {
						return target.identity != "wei" && target != player;
					},
					ai1(card, player, target) {
						if (get.attitude(player, target) > 0) {
							return 11 - get.value(card);
						}
						return 7 - get.value(card);
					},
					ai2(target) {
						var att = get.attitude(get.event().player, target);
						if (att < 0) {
							return -att;
						}
						return 1;
					},
				})
				.setHiddenSkill("gz_jieyue")
				.forResult();
		},
		logTarget: "targets",
		async content(event, _trigger, player) {
			const { targets, cards } = event;
			const target = targets[0];

			await player.give(cards, target);

			const junlingResult = await player.chooseJunlingFor(target).forResult();
			const { junling, targets: junlingTargets } = junlingResult;

			const choiceList = [];
			choiceList.push(`执行该军令，然后${get.translation(player)}摸一张牌`);
			choiceList.push(`令${get.translation(player)}摸牌阶段额外摸三张牌`);

			const chooseJunlingResult = await target.chooseJunlingControl(player, junling, junlingTargets).set("prompt", "节钺").set("choiceList", choiceList).set("ai", chooseJunlingCheck).forResult();

			if (chooseJunlingResult.index == 0) {
				await target.carryOutJunling(player, junling, junlingTargets);
				await player.draw();
			} else {
				player.addTempSkill("gz_jieyue_eff");
			}

			return;

			function chooseJunlingCheck() {
				if (get.attitude(target, player) > 0) {
					return get.junlingEffect(player, junling, target, junlingTargets, target) > 1 ? 0 : 1;
				}
				return get.junlingEffect(player, junling, target, junlingTargets, target) >= -1 ? 0 : 1;
			}
		},
		ai: {
			threaten: 2,
		},
		subSkill: {
			eff: {
				trigger: {
					player: "phaseDrawBegin2",
				},
				filter(event, _player) {
					return !event.numFixed;
				},
				charlotte: true,
				silent: true,
				async content(_event, trigger, _player) {
					trigger.num += 3;
				},
				sub: true,
			},
		},
	},
};
