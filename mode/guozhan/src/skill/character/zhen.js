import { lib, game, ui, get, ai, _status } from "noname";

/** @type {Record<string, Skill>} */
export default {
	// gz_dengai
	gz_jixi: {
		inherit: "jixi",
		audio: "jixi",
		mainSkill: true,
		init(player) {
			if (player.checkMainSkill("gz_jixi")) {
				player.removeMaxHp();
			}
		},
	},
	ziliang: {
		audio: 2,
		trigger: {
			global: "damageEnd",
		},
		filter(event, player) {
			return event.player.isIn() && event.player.isFriendOf(player) && player.getExpansions("tuntian").length > 0;
		},
		init(player) {
			player.checkViceSkill("ziliang");
		},
		viceSkill: true,
		async cost(event, trigger, player) {
			const next = player.chooseCardButton(get.prompt("ziliang", trigger.player), player.getExpansions("tuntian"));

			next.set("ai", button => get.value(button.link));

			const result = await next.forResult();
			event.result = {
				bool: result.bool,
				cost_data: {
					links: result.links,
				},
			};
		},
		logTarget: "player",
		async content(event, trigger, player) {
			const card = event.cost_data.links[0];
			await player.give(card, trigger.player);
		},
	},

	// gz_caohong
	fake_huyuan: {
		audio: "yuanhu",
		trigger: {
			player: "phaseJieshuBegin",
		},
		filter(_event, player) {
			return (
				player.countCards("he", card => {
					if (get.position(card) == "h" && _status.connectMode) {
						return true;
					}
					return get.type(card) == "equip";
				}) > 0
			);
		},
		async cost(event, _trigger, player) {
			event.result = await player
				.chooseCardTarget({
					prompt: get.prompt2("yuanhu"),
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
						return get.attitude(get.player(), target) - 3;
					},
				})
				.setHiddenSkill("fake_huyuan")
				.forResult();
		},
		preHidden: true,
		async content(event, trigger, player) {
			const card = event.cards[0];
			const target = event.targets[0];
			if (target != player) {
				player.$give(card, target, false, void 0, void 0);
			}
			await target.equip(card, void 0);
		},
		group: "fake_huyuan_discard",
		subSkill: {
			discard: {
				trigger: {
					global: "equipEnd",
				},
				filter(event, player) {
					return (
						// @ts-expect-error 类型系统未来可期
						_status.currentPhase == player &&
						game.hasPlayer(target => {
							return get.distance(event.player, target) <= 1 && target != event.player && target.countCards("hej") > 0;
						})
					);
				},
				async cost(event, trigger, player) {
					event.result = await player
						.chooseTarget(get.prompt("fake_huyuan"), "弃置一名与" + get.translation(trigger.player) + "距离为1以内的另一名角色区域里的一张牌", (card, player, target) => {
							const trigger = get.event().getTrigger();
							return get.distance(trigger.player, target) <= 1 && target != trigger.player && target.countCards("hej");
						})
						.set("ai", target => {
							const player = get.event("player");
							return get.effect(target, { name: "guohe" }, player, player);
						})
						.setHiddenSkill("fake_huyuan")
						.forResult();
				},
				popup: false,
				async content(event, trigger, player) {
					const target = event.targets[0];
					player.logSkill("fake_huyuan", target, undefined, undefined, undefined);
					await player.discardPlayerCard(target, "hej", true);
				},
			},
		},
	},
	heyi: {
		zhenfa: "inline",
		global: "heyi_distance",
		subSkill: {
			distance: {
				mod: {
					globalTo(from, to, distance) {
						if (
							game.hasPlayer(current => {
								return current.hasSkill("heyi") && current.inline(to);
							})
						) {
							return distance + 1;
						}
					},
				},
			},
		},
	},

	// gz_jiangfei
	gz_shengxi: {
		audio: "shengxi",
		preHidden: true,
		frequent: true,
		trigger: {
			player: "phaseJieshuBegin",
		},
		filter(event, player) {
			return !player.hasHistory("sourceDamage");
		},
		async content(event, trigger, player) {
			player.draw(2);
		},
	},
	gz_shoucheng: {
		audio: "shoucheng",
		inherit: "shoucheng",
		preHidden: true,
		filter(event, player) {
			return game.hasPlayer(current => {
				// @ts-expect-error 类型系统未来可期
				if (current == _status.currentPhase || !current.isFriendOf(player)) {
					return false;
				}
				// @ts-expect-error 类型系统未来可期
				const evt = event.getl(current);
				return evt && evt.hs && evt.hs.length && current.countCards("h") == 0;
			});
		},
		async content(event, trigger, player) {
			const list = game
				.filterPlayer(current => {
					// @ts-expect-error 类型系统未来可期
					if (current == _status.currentPhase || !current.isFriendOf(player)) {
						return false;
					}
					// @ts-expect-error 类型系统未来可期
					var evt = trigger.getl(current);
					return evt && evt.hs && evt.hs.length;
				})
				// @ts-expect-error 类型系统未来可期
				.sortBySeat(_status.currentPhase);

			for (const target of list) {
				if (!target.isAlive() || target.countCards("h") > 0) {
					continue;
				}

				const result = await player
					.chooseBool(get.prompt2("gz_shoucheng", target))
					.set("ai", function () {
						// @ts-expect-error 类型系统未来可期
						return get.attitude(get.player(), _status.event?.getParent()?.target) > 0;
					})
					.setHiddenSkill(event.name)
					.forResult();

				if (result.bool) {
					player.logSkill(event.name, target, void 0, void 0, void 0);
					await target.draw();
				}
			}
		},
	},

	// gz_jiangwei
	yizhi: {
		init(player) {
			if (player.checkViceSkill("yizhi") && !player.viceChanged) {
				player.removeMaxHp();
			}
		},
		viceSkill: true,
		inherit: "guanxing",
		filter(_event, player) {
			return !player.hasSkill("guanxing");
		},
	},
	tianfu: {
		init(player) {
			player.checkMainSkill("tianfu");
		},
		mainSkill: true,
		inherit: "kanpo",
		zhenfa: "inline",
		viewAsFilter(player) {
			// @ts-expect-error 类型系统未来可期
			return _status.currentPhase && _status.currentPhase.inline(player) && !player.hasSkill("kanpo") && player.countCards("h", { color: "black" }) > 0;
		},
	},

	// gz_xusheng
	yicheng: {
		audio: 2,
		trigger: {
			global: "useCardToTargeted",
		},
		filter(event, player) {
			return event.card.name == "sha" && event.target.isFriendOf(player);
		},
		preHidden: true,
		logTarget: "target",
		async content(event, trigger, player) {
			await event.targets[0].draw();
			await event.targets[0].chooseToDiscard("he", true);
		},
	},
	gz_yicheng_new: {
		audio: "yicheng",
		trigger: {
			global: ["useCardToPlayered", "useCardToTargeted"],
		},
		filter(event, player, name) {
			const bool = name === "useCardToPlayered";
			// @ts-expect-error 类型系统未来可期
			if (bool && !event.isFirstTarget) {
				return false;
			}
			return event.card.name == "sha" && event[bool ? "player" : "target"].isFriendOf(player);
		},
		logTarget(event, player, name) {
			return event?.[name === "useCardToPlayered" ? "player" : "target"];
		},
		async content(event, trigger, player) {
			await event.targets[0].draw();
			await event.targets[0].chooseToDiscard("he", true);
		},
	},

	// gz_jiangqing
	gz_shangyi: {
		audio: "shangyi",
		usable: 1,
		enable: "phaseUse",
		filter(_event, player) {
			return player.countCards("h") > 0;
		},
		filterTarget(_card, player, target) {
			return player != target && (target.countCards("h") > 0 || target.isUnseen(2));
		},
		async content(event, trigger, player) {
			const target = event.target;

			await target.viewHandcards(player);

			/** @type {Partial<Result>} */
			let result;
			if (!target.countCards("h")) {
				result = { index: 1 };
			} else if (!target.isUnseen(2)) {
				result = { index: 0 };
			} else {
				result = await player
					.chooseControl()
					.set("choiceList", [`观看${get.translation(target)}的手牌并可以弃置其中的一张黑色牌`, `观看${get.translation(target)}的所有暗置的武将牌`])
					.forResult();
			}

			if (result.index == 0) {
				await player
					.discardPlayerCard(target, "h")
					.set("filterButton", function (button) {
						return get.color(button.link) == "black";
					})
					.set("visible", true);
			} else {
				player.viewCharacter(target, 2);
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
	niaoxiang: {
		zhenfa: "siege",
		audio: "zniaoxiang",
		global: "niaoxiang_sha", // ?
		preHidden: true,
		trigger: {
			global: "useCardToPlayered",
		},
		filter(event, player) {
			if (event.card.name != "sha") {
				return false;
			}
			// @ts-expect-error 类型系统未来可期
			if (game.countPlayer() < 4) {
				return false;
			}
			// @ts-expect-error 类型系统未来可期
			return player.siege(event.target) && event.player.siege(event.target);
		},
		forced: true,
		locked: false,
		forceaudio: true,
		logTarget: "target",
		async content(_event, trigger, _player) {
			const id = trigger.target.playerid;
			// @ts-expect-error 类型系统未来可期
			const map = trigger.getParent().customArgs;
			if (!map[id]) {
				map[id] = {};
			}
			if (typeof map[id].shanRequired == "number") {
				map[id].shanRequired++;
			} else {
				map[id].shanRequired = 2;
			}
		},
	},

	// gz_yuji
	qianhuan: {
		audio: 2,
		preHidden: true,
		onremove(player, skill) {
			const cards = player.getExpansions(skill);
			if (cards.length) {
				player.loseToDiscardpile(cards);
			}
		},
		intro: {
			content: "expansion",
			markcount: "expansion",
		},
		group: ["qianhuan_add", "qianhuan_use"],
		ai: {
			threaten: 1.8,
		},
		subSkill: {
			add: {
				audio: "qianhuan",
				trigger: {
					global: "damageEnd",
				},
				filter(event, player) {
					const cards = player.getExpansions("qianhuan");
					const suits = cards.map(card => get.suit(card)).toUniqued();

					if (suits.length >= lib.suit.length) {
						return false;
					}

					return (
						player.isFriendOf(event.player) &&
						player.hasCard(card => {
							if (_status.connectMode && get.position(card) == "h") {
								return true;
							}
							return !suits.includes(get.suit(card));
						}, "he")
					);
				},
				async cost(event, _trigger, player) {
					const cards = player.getExpansions("qianhuan");
					const suits = cards.map(card => get.suit(card)).toUniqued();

					event.result = await player
						.chooseCard("he", get.prompt2("qianhuan"), card => {
							// @ts-expect-error 类型系统未来可期
							return !_status.event.suits.includes(get.suit(card));
						})
						.set("ai", function (card) {
							return 9 - get.value(card);
						})
						.set("suits", suits)
						.setHiddenSkill("qianhuan")
						.forResult();
				},
				async content(event, _trigger, player) {
					const card = event.cards[0];
					const next = player.addToExpansion(card, player, "give");
					// @ts-expect-error 类型系统未来可期
					next.gaintag.add("qianhuan");
					await next;
				},
			},
			use: {
				audio: "qianhuan",
				trigger: {
					global: "useCardToTarget",
				},
				filter(event, player) {
					if (!["basic", "trick"].includes(get.type(event.card, "trick"))) {
						return false;
					}
					return event.target && player.isFriendOf(event.target) && event.targets.length == 1 && player.getExpansions("qianhuan").length > 0;
				},
				async cost(event, trigger, player) {
					let goon = get.effect(trigger.target, trigger.card, trigger.player, player) < 0;

					if (goon) {
						if (["tiesuo", "diaohulishan", "lianjunshengyan", "zhibi", "chiling", "lulitongxin"].includes(trigger.card.name)) {
							goon = false;
						} else if (trigger.card.name == "sha") {
							if (trigger.target.mayHaveShan(player, "use") || trigger.target.hp >= 3) {
								goon = false;
							}
						} else if (trigger.card.name == "guohe") {
							if (trigger.target.countCards("he") >= 3 || !trigger.target.countCards("h")) {
								goon = false;
							}
						} else if (trigger.card.name == "shuiyanqijunx") {
							if (trigger.target.countCards("e") <= 1 || trigger.target.hp >= 3) {
								goon = false;
							}
						} else if (get.tag(trigger.card, "damage") && trigger.target.hp >= 3) {
							goon = false;
						}
					}

					const result = await player
						.chooseButton()
						.set("goon", goon)
						.set("ai", function (button) {
							// @ts-expect-error 类型系统未来可期
							if (_status.event.goon) {
								return 1;
							}
							return 0;
						})
						.set("createDialog", [get.prompt("qianhuan"), '<div class="text center">移去一张“千幻”牌令' + get.translation(trigger.player) + "对" + get.translation(trigger.target) + "的" + get.translation(trigger.card) + "失效</div>", player.getExpansions("qianhuan")])
						.forResult();

					event.result = {
						bool: result.bool,
						cost_data: {
							links: result.links,
						},
					};
				},
				logTarget: "player",
				async content(event, trigger, player) {
					// @ts-expect-error 类型系统未来可期
					trigger.getParent().targets.remove(trigger.target);
					const card = event.cost_data.links[0];
					await player.loseToDiscardpile(card);
				},
			},
		},
	},
};
