import { lib, game, ui, get, ai, _status } from "noname";
import { PlayerGuozhan } from "../../patch/player.js";
import { broadcastAll } from "../../patch/game.js";

export default {
	// gz_caocao
	gz_jianxiong: {
		audio: "jianxiong",
		trigger: {
			player: "damageEnd",
		},
		/**
		 * @param {GameEvent} event
		 * @param {GameEvent} trigger
		 * @param {PlayerGuozhan} player
		 */
		async cost(event, trigger, player) {
			let list = ["摸牌"];
			if (get.itemtype(trigger.cards) == "cards" && trigger.cards.filterInD().length) {
				list.push("拿牌");
			}
			list.push("cancel2");
			const { control } = await player
				.chooseControl(list)
				.set("prompt", get.prompt2("rejianxiong_old"))
				.set("ai", () => {
					const player = get.event().player,
						trigger = get.event().getTrigger();
					const cards = trigger.cards ? trigger.cards.filterInD() : [];
					// @ts-expect-error 类型就是这么写的
					if (get.event().controls.includes("拿牌")) {
						if (
							cards.reduce((sum, card) => {
								return sum + (card.name == "du" ? -1 : 1);
							}, 0) > 1 ||
							player.getUseValue(cards[0]) > 6
						) {
							return "拿牌";
						}
					}
					return "摸牌";
				}).forResult();
			event.result = { bool: control != "cancel2", cost_data: { result: control } };
		},
		/**
		 * @param {GameEvent} event
		 * @param {GameEvent} trigger
		 * @param {PlayerGuozhan} player
		 */
		async content(event, trigger, player) {
			if (event.cost_data.result == "摸牌") {
				await player.draw();
			} else {
				await player.gain(trigger.cards.filterInD(), "gain2");
			}
		},
		ai: {
			maixie: true,
			maixie_hp: true,
			effect: {
				target(card, player, target) {
					if (player.hasSkillTag("jueqing", false, target)) {
						return [1, -1];
					}
					if (get.tag(card, "damage") && player != target) {
						return [1, 0.6];
					}
				},
			},
		},
	},

	// gz_xiahoudun
	gz_ganglie: {
		audio: "ganglie", // TODO: 改成独立的配音
		trigger: {
			player: "damageEnd",
		},
		/**
		 * @param {GameEvent} event
		 * @param {PlayerGuozhan} _player
		 * @returns {boolean}
		 */
		filter(event, _player) {
			return event.source != undefined && event.num > 0;
		},
		/**
		 * @param {GameEvent} event
		 * @param {PlayerGuozhan} player
		 * @returns {boolean}
		 */
		check(event, player) {
			return get.attitude(player, event.source) <= 0;
		},
		logTarget: "source",
		preHidden: true,
		/**
		 * @param {GameEvent} event
		 * @param {GameEvent} trigger
		 * @param {PlayerGuozhan} player
		 */
		async content(event, trigger, player) {
			const result = await player.judge(card => (get.color(card) == "red" ? 1 : 0)).forResult();

			switch (result.color) {
				case "black":
					if (trigger.source.countCards("he")) {
						player.discardPlayerCard(trigger.source, "he", true);
					}
					break;

				case "red":
					if (trigger.source.isIn()) {
						trigger.source.damage();
					}
					break;
				default:
					break;
			}
		},
		ai: {
			maixie_defend: true,
			expose: 0.4,
		},
	},

	// gz_zhangliao
	gz_tuxi: {
		audio: "tuxi", // TODO: 改成独立的配音
		audioname2: {
			gz_jun_caocao: "jianan_tuxi",
		},
		trigger: {
			player: "phaseDrawBegin2",
		},
		preHidden: true,
		/**
		 * @param {GameEvent} event
		 * @param {PlayerGuozhan} player
		 * @returns {boolean}
		 */
		filter(event, player) {
			// @ts-expect-error 类型就是这么写的
			return event.num > 0 && !event.numFixed && game.hasPlayer(target => target.countCards("h") > 0 && player != target);
		},
		/**
		 * @param {GameEvent} event
		 * @param {GameEvent} trigger
		 * @param {PlayerGuozhan} player
		 */
		async cost(event, trigger, player) {
			const num = Math.min(trigger.num, 2);

			const next = player.chooseTarget(
				get.prompt("gz_tuxi"),
				`获得至多${get.translation(num)}名角色的各一张手牌，然后少摸等量的牌`,
				[1, num],
				(_card, player, target) => target.countCards("h") > 0 && player != target,
				target => {
					const att = get.attitude(_status.event?.player, target);
					if (target.hasSkill("tuntian")) {
						return att / 10;
					}
					return 1 - att;
				}
			);
			next.setHiddenSkill("gz_tuxi");

			event.result = await next.forResult();
		},
		logTarget: "targets",
		/**
		 * @param {GameEvent} event
		 * @param {GameEvent} trigger
		 * @param {PlayerGuozhan} player
		 */
		async content(event, trigger, player) {
			const { targets } = event;
			targets.sortBySeat();
			await player.gainMultiple(targets);
			trigger.num -= targets.length;
			if (trigger.num <= 0) {
				await game.delay();
			}
		},
		ai: {
			threaten: 1.6,
			expose: 0.2,
		},
	},

	// gz_xuzhu
	gz_luoyi: {
		audio: "luoyi",
		trigger: {
			player: "phaseDrawEnd",
		},
		preHidden: true,
		/**
		 * @param {GameEvent} _event
		 * @param {PlayerGuozhan} player
		 * @returns {boolean}
		 */
		filter(_event, player) {
			return player.countCards("he") > 0;
		},
		/**
		 * @param {GameEvent} event
		 * @param {GameEvent} _trigger
		 * @param {PlayerGuozhan} player
		 */
		async cost(event, _trigger, player) {
			const next = player.chooseToDiscard("he", get.prompt2("gz_luoyi"));

			next.setHiddenSkill("gz_luoyi");
			next.set("ai", check);

			event.result = await next.forResult();

			return;

			/**
			 * @param {Card} card
			 * @returns {number}
			 */
			function check(card) {
				const player = get.player();

				if (player.hasCard(cardx => cardx != card && (cardx.name == "sha" || cardx.name == "juedou") && player.hasValueTarget(cardx, undefined, true), "hs")) {
					return 5 - get.value(card);
				}

				return -get.value(card);
			}
		},
		/**
		 * @param {GameEvent} _event
		 * @param {GameEvent} _trigger
		 * @param {PlayerGuozhan} player
		 */
		async content(_event, _trigger, player) {
			player.addTempSkill("gz_luoyi_buff");
		},
		subSkill: {
			buff: {
				audio: "luoyi",
				charlotte: true,
				forced: true,
				trigger: {
					source: "damageBegin1",
				},
				/**
				 * @param {GameEvent} event
				 * @param {PlayerGuozhan} _player
				 * @returns {boolean}
				 */
				filter(event, _player) {
					const parent = event.getParent();
					if (parent == null || !("type" in parent)) {
						return false;
					}
					return event.card && (event.card.name == "sha" || event.card.name == "juedou") && parent.type == "card";
				},
				/**
				 * @param {GameEvent} _event
				 * @param {GameEvent} trigger
				 * @param {PlayerGuozhan} _player
				 */
				async content(_event, trigger, _player) {
					trigger.num++;
				},
			},
		},
	},

	// gz_guojia
	gz_yiji: {
		audio: "yiji",
		trigger: {
			player: "damageEnd",
		},
		frequent: true,
		preHidden: true,

		/**
		 * @param {GameEvent} event
		 * @param {GameEvent} trigger
		 * @param {PlayerGuozhan} player
		 */
		async content(event, trigger, player) {
			const cards = game.cardsGotoOrdering(get.cards(2)).cards;
			/** @type {Map<string, Card[]>} */
			const givenMap = new Map();

			if (_status.connectMode) {
				broadcastAll(() => {
					Reflect.set(_status, "noclearcountdown", true);
				});
			}

			while (cards.length > 0) {
				/** @type {Partial<Result>} */
				let result;

				if (cards.length > 1) {
					result = await player
						.chooseCardButton("遗计：请选择要分配的牌", true, cards, [1, cards.length])
						.set("ai", () => {
							if (ui.selected.buttons.length == 0) {
								return 1;
							}
							return 0;
						})
						.forResult();
				} else {
					result = { bool: true, links: cards.slice(0) };
				}

				if (!result.bool) {
					break;
				}

				cards.removeArray(result.links);
				const toGive = result.links.slice(0);

				result = await player
					.chooseTarget("选择一名角色获得" + get.translation(result.links), true)
					.set("ai", (/** @type {PlayerGuozhan} */ target) => {
						const event = get.event();
						const att = get.attitude(event.player, target);
						if (event.enemy) {
							return -att;
						} else if (att > 0) {
							return att / (1 + target.countCards("h"));
						} else {
							return att / 100;
						}
					})
					.set("enemy", get.value(toGive[0], player, "raw") < 0)
					.forResult();

				if (!result.bool) {
					break;
				}

				const targets = result.targets;
				if (targets.length) {
					const id = targets[0].playerid ?? "";

					if (!givenMap.has(id)) {
						givenMap.set(id, []);
					}
					const current = givenMap.get(id);
					current?.addArray(toGive);
				}
			}

			if (_status.connectMode) {
				broadcastAll(() => {
					Reflect.deleteProperty(_status, "noclearcountdown");
					game.stopCountChoose();
				});
			}

			const list = [];
			for (const [id, cards] of givenMap) {
				const source = (_status.connectMode ? lib.playerOL : game.playerMap)[id];
				player.line(source, "green");
				list.push([source, cards]);
			}
			await game
				.loseAsync({
					gain_list: list,
					giver: player,
					animate: "draw",
				})
				.setContent("gaincardMultiple");
		},
		ai: {
			maixie: true,
			maixie_hp: true,
			effect: {
				target(card, player, target) {
					if (get.tag(card, "damage")) {
						if (player.hasSkillTag("jueqing", false, target)) {
							return [1, -2];
						}
						if (!target.hasFriend()) {
							return;
						}

						let num = 1;
						if (get.attitude(player, target) > 0) {
							if (player.needsToDiscard()) {
								num = 0.7;
							} else {
								num = 0.5;
							}
						}

						if (target.hp >= 4) {
							return [1, num * 2];
						}
						if (target.hp == 3) {
							return [1, num * 1.5];
						}
						if (target.hp == 2) {
							return [1, num * 0.5];
						}
					}
				},
			},
		},
	},

	// gz_xiahouyuan
	gz_shensu: {
		audio: "shensu1", // TODO: 独立素材，留给后来人
		audioname: ["xiahouba", "re_xiahouyuan", "ol_xiahouyuan"],
		group: ["gz_shensu_1", "gz_shensu_2"],
		preHidden: ["gz_hensu_1", "gz_shensu_2", "gz_shensu"],
		trigger: {
			player: "phaseDiscardBegin",
		},
		/**
		 * @param {GameEvent} _event
		 * @param {PlayerGuozhan} player
		 * @returns {boolean}
		 */
		filter(_event, player) {
			return player.hp > 0;
		},
		/**
		 * @param {GameEvent} event
		 * @param {GameEvent} _trigger
		 * @param {PlayerGuozhan} player
		 */
		async cost(event, _trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt("gz_shensu"), "失去1点体力并跳过弃牌阶段，视为对一名其他角色使用一张无距离限制的【杀】", (card, player, target) => player.canUse("sha", target, false))
				.setHiddenSkill("gz_shensu")
				.set("goon", player.needsToDiscard())
				.set("ai", target => {
					const event = get.event();
					const player = get.player();
					if (!event.goon || player.hp <= target.hp) {
						return false;
					}
					return get.effect(target, { name: "sha", isCard: true }, player, player);
				})
				.forResult();
		},
		logTarget: "targets",
		/**
		 * @param {GameEvent} event
		 * @param {GameEvent} trigger
		 * @param {PlayerGuozhan} player
		 */
		async content(event, trigger, player) {
			const { targets } = event;
			const target = targets[0];
			await player.loseHp();
			trigger.cancel();
			await player.useCard({ name: "sha", isCard: true }, target, false);
		},
		subSkill: {
			// TODO: 后面或许将不存在shensu1，所以后来人需要重新填写技能信息
			1: {
				audio: "shensu1",
				inherit: "shensu1",
				sourceSkill: "gz_shensu",
			},
			2: {
				inherit: "shensu2",
				sourceSkill: "gz_shensu",
			},
		},
	},

	// gz_zhanghe
	gz_qiaobian: {
		audio: "qiaobian", // TODO: 你说得对，未来得拆，未来可期
		audioname2: { gz_jun_caocao: "jianan_qiaobian" },
		trigger: {
			player: ["phaseJudgeBefore", "phaseDrawBefore", "phaseUseBefore", "phaseDiscardBefore"],
		},
		/**
		 * @param {GameEvent} _event
		 * @param {PlayerGuozhan} player
		 * @returns {boolean}
		 */
		filter(_event, player) {
			return player.countCards("h") > 0;
		},
		preHidden: true,
		/**
		 * @param {GameEvent} event
		 * @param {GameEvent} trigger
		 * @param {PlayerGuozhan} player
		 */
		async cost(event, trigger, player) {
			let check;
			let str = "弃置一张手牌并跳过";
			str += ["判定", "摸牌", "出牌", "弃牌"][lib.skill.qiaobian?.trigger?.player?.indexOf(event.triggername) ?? 0];
			str += "阶段";
			if (trigger.name == "phaseDraw") {
				str += "，然后可以获得至多两名角色各一张手牌";
			}
			if (trigger.name == "phaseUse") {
				str += "，然后可以移动场上的一张牌";
			}
			switch (trigger.name) {
				case "phaseJudge":
					check = player.countCards("j");
					break;
				case "phaseDraw": {
					let i;
					let num = 0;
					let num2 = 0;
					const players = game.filterPlayer(lib.filter.all);
					for (i = 0; i < players.length; i++) {
						// @ts-expect-error type be right
						if (player != players[i] && players[i].countCards("h")) {
							const att = get.attitude(player, players[i]);
							if (att <= 0) {
								num++;
							}
							if (att < 0) {
								num2++;
							}
						}
					}
					check = num >= 2 && num2 > 0;
					break;
				}
				case "phaseUse":
					if (!player.canMoveCard(true)) {
						check = false;
					} else {
						check = game.hasPlayer(current => {
							return get.attitude(player, current) > 0 && current.countCards("j") > 0;
						});
						if (!check) {
							if (player.countCards("h") > player.hp + 1) {
								check = false;
							} else if (player.countCards("h", { name: "wuzhong" })) {
								check = false;
							} else {
								check = true;
							}
						}
					}
					break;
				case "phaseDiscard":
					check = player.needsToDiscard();
					break;
			}
			event.result = await player
				.chooseToDiscard(get.prompt("qiaobian"), str, lib.filter.cardDiscardable)
				.set("ai", card => {
					const event = get.event();
					if (!event.check) {
						return -1;
					}
					return 7 - get.value(card);
				})
				.set("check", check)
				.setHiddenSkill("qiaobian")
				.forResult();
		},
		/**
		 * @param {GameEvent} event
		 * @param {GameEvent} trigger
		 * @param {PlayerGuozhan} player
		 */
		async content(event, trigger, player) {
			trigger.cancel();
			game.log(player, "跳过了", "#y" + ["判定", "摸牌", "出牌", "弃牌"][lib.skill.qiaobian?.trigger?.player?.indexOf(event.triggername) ?? 0] + "阶段");
			if (trigger.name == "phaseUse") {
				if (player.canMoveCard()) {
					await player.moveCard();
				}
			} else if (trigger.name == "phaseDraw") {
				const result = await player
					.chooseTarget([1, 2], "获得至多两名角色各一张手牌", function (card, player, target) {
						return target != player && target.countCards("h");
					})
					.set("ai", target => {
						return 1 - get.attitude(get.player(), target);
					})
					.forResult();
				if (!result.bool) {
					return;
				}
				result.targets?.sortBySeat();
				player.line(result.targets, "green");
				if (!result.targets?.length) {
					return;
				}
				await player.gainMultiple(result.targets);
				await game.delay();
			}
		},
		ai: {
			threaten: 3,
		},
	},

	// gz_xuhuang
	gz_duanliang: {
		locked: false,
		audio: "duanliang1", // 未来可期未来改
		audioname2: {
			gz_jun_caocao: "jianan_duanliang",
		},
		enable: "chooseToUse",
		/**
		 * @param {Card} card
		 * @returns {boolean}
		 */
		filterCard(card) {
			if (get.type(card) != "basic" && get.type(card) != "equip") {
				return false;
			}
			return get.color(card) == "black";
		},
		/**
		 * @param {GameEvent} _event
		 * @param {PlayerGuozhan} player
		 * @returns {boolean}
		 */
		filter(_event, player) {
			if (player.hasSkill("gz_duanliang_off")) {
				return false;
			}
			return player.countCards("hes", { type: ["basic", "equip"], color: "black" }) > 0;
		},
		position: "hes",
		viewAs: {
			name: "bingliang",
		},
		onuse(result, player) {
			if (get.distance(player, result.targets[0]) > 2) {
				player.addTempSkill("gz_duanliang_off");
			}
		},
		prompt: "将一黑色的基本牌或装备牌当兵粮寸断使用",
		check(card) {
			return 6 - get.value(card);
		},
		mod: {
			targetInRange(card, player, target) {
				if (card.name == "bingliang") {
					return true;
				}
			},
		},
		ai: {
			order: 9,
			basic: {
				order: 1,
				useful: 1,
				value: 4,
			},
			result: {
				target(player, target) {
					if (target.hasJudge("caomu")) {
						return 0;
					}
					return -1.5 / Math.sqrt(target.countCards("h") + 1);
				},
			},
			tag: {
				skip: "phaseDraw",
			},
		},
		subSkill: {
			off: {
				sub: true,
			},
		},
	},

	// gz_caoren
	gz_jushou: {
		audio: "xinjushou", // 你懂我要说什么.png
		trigger: {
			player: "phaseJieshuBegin",
		},
		preHidden: true,
		/**
		 * @param {GameEvent} event
		 * @param {GameEvent} trigger
		 * @param {PlayerGuozhan} player
		 */
		async content(event, trigger, player) {
			"step 0";
			const groups = [];
			const players = game.filterPlayer(lib.filter.all);

			for (const target of players) {
				if (target.isUnseen(-1)) {
					continue;
				}
				let add = true;
				for (const group of groups) {
					if (group.isFriendOf(target)) {
						add = false;
						break;
					}
				}
				if (add) {
					groups.add(target);
				}
			}
			const num = groups.length;
			await player.draw(num);
			if (num > 2) {
				await player.turnOver();
			}

			const result = await player
				.chooseCard("h", true, "弃置一张手牌，若以此法弃置的是装备牌，则你改为使用之")
				.set("ai", (/** @type {Card} */ card) => {
					if (get.type(card) == "equip") {
						return 5 - get.value(card);
					}
					return -get.value(card);
				})
				.set("filterCard", lib.filter.cardDiscardable)
				.forResult();

			if (result.bool && result.cards?.length) {
				if (get.type(result.cards[0]) == "equip" && player.hasUseTarget(result.cards[0])) {
					player.chooseUseTarget(result.cards[0], true, "nopopup");
				} else {
					player.discard(result.cards[0]);
				}
			}
		},
	},

	// gz_dianwei
	/** @type {Skill} */
	gz_qiangxi: {
		audio: "qiangxi", // 已经，没有什么好怕的了（
		enable: "phaseUse",
		filterCard(card) {
			return get.subtype(card) == "equip1";
		},
		selectCard() {
			return [0, 1];
		},
		filterTarget(_card, player, target) {
			if (player == target) {
				return false;
			}
			if (target.hasSkill("gz_qiangxi_off")) {
				return false;
			}
			return player.inRange(target);
		},
		async content(event, _trigger, player) {
			const { cards, target } = event;

			if (cards.length == 0) {
				await player.loseHp();
			}

			target.addTempSkill("gz_qiangxi_off", "phaseUseAfter");
			await target.damage("nocard");
		},
		/**
		 * @param {Card} card
		 * @returns {number}
		 */
		check(card) {
			return 10 - get.value(card);
		},
		position: "he",
		ai: {
			order: 8.5,
			threaten: 1.5,
			result: {
				target(player, target) {
					if (!ui.selected.cards.length) {
						if (player.hp < 2) {
							return 0;
						}
						if (target.hp >= player.hp) {
							return 0;
						}
					}
					return get.damageEffect(target, player);
				},
			},
		},
		subSkill: {
			off: {
				sub: true,
			},
		},
	},

	// gz_xunyu
	/** @type {Skill} */
	gz_quhu: {
		audio: "quhu",
		audioname: ["re_xunyu", "ol_xunyu"],
		enable: "phaseUse",
		usable: 1,
		filter(_event, player) {
			if (player.countCards("h") == 0) {
				return false;
			}
			return game.hasPlayer(current => current.hp > player.hp && player.canCompare(current));
		},
		filterTarget(_card, player, target) {
			return target.hp > player.hp && player.canCompare(target);
		},
		async content(event, _trigger, player) {
			const target = event.target;
			const { bool } = await player.chooseToCompare(target, void 0).forResult();
			if (!bool) {
				return void (await player.damage(target));
			}
			if (!game.hasPlayer(player => player != target && target.inRange(player))) {
				return;
			}
			const result = await player
				.chooseTarget((card, player, target) => {
					const source = _status.event?.source;
					return target != source && source?.inRange(target);
				}, true)
				.set("ai", target => get.damageEffect(target, _status.event?.source, player))
				.set("source", target)
				.forResult();
			if (!result.bool || !result.targets || !result.targets.length) {
				return;
			}
			target.line(result.targets[0], "green");
			await result.targets[0].damage(target);
		},
		ai: {
			order: 0.5,
			result: {
				target(player, target) {
					const att = get.attitude(player, target);
					const oc = target.countCards("h") == 1;
					if (att > 0 && oc) {
						return 0;
					}
					const players = game.filterPlayer(lib.filter.all);
					for (let i = 0; i < players.length; i++) {
						if (players[i] != target && players[i] != player && target.inRange(players[i])) {
							if (get.damageEffect(players[i], target, player) > 0) {
								return att > 0 ? att / 2 : att - (oc ? 5 : 0);
							}
						}
					}
					return 0;
				},
				player(player, target) {
					if (target.hasSkillTag("jueqing", false, target)) {
						return -10;
					}
					const hs = player.getCards("h");
					let mn = 1;
					for (let i = 0; i < hs.length; i++) {
						const num = get.number(hs[i]);
						if (typeof num == "number") {
							mn = Math.max(mn, num);
						}
					}
					if (mn <= 11 && player.hp < 2) {
						return -20;
					}
					let max = player.maxHp - hs.length;
					const players = game.filterPlayer(lib.filter.all);
					for (let i = 0; i < players.length; i++) {
						if (get.attitude(player, players[i]) > 2) {
							max = Math.max(Math.min(5, players[i].hp) - players[i].countCards("h"), max);
						}
					}
					switch (max) {
						case 0:
							return mn == 13 ? 0 : -20;
						case 1:
							return mn >= 12 ? 0 : -15;
						case 2:
							return 0;
						case 3:
							return 1;
						default:
							return max;
					}
				},
			},
			expose: 0.2,
		},
	},
	/** @type {Skill} */
	gz_jieming: {
		audio: "jieming",
		trigger: {
			player: "damageEnd",
		},
		preHidden: true,
		async cost(event, _trigger, player) {
			const next = player.chooseTarget(get.prompt("gz_jieming"), "令一名角色将手牌补至X张（X为其体力上限且至多为5）");

			next.set("ai", check);
			next.setHiddenSkill("gz_jieming");

			event.result = await next.forResult();

			/**
			 * @param {PlayerGuozhan} target
			 */
			function check(target) {
				const player = get.player();
				const att = get.attitude(player, target);
				if (att > 2) {
					return Math.max(0, Math.min(5, target.maxHp) - target.countCards("h"));
				}
				return att / 3;
			}
		},
		logTarget: "targets",
		async content(event, _trigger, _player) {
			for (const target of event.targets) {
				const num = Math.min(5, target.maxHp) - target.countCards("h");
				if (num > 0) {
					await target.draw(num);
				}
			}
		},
		ai: {
			maixie: true,
			maixie_hp: true,
			effect: {
				target(card, player, target, current) {
					if (get.tag(card, "damage") && target.hp > 1) {
						if (player.hasSkillTag("jueqing", false, target)) {
							return [1, -2];
						}
						let max = 0;
						const players = game.filterPlayer(lib.filter.all);
						for (let i = 0; i < players.length; i++) {
							if (get.attitude(target, players[i]) > 0) {
								max = Math.max(Math.min(5, players[i].hp) - players[i].countCards("h"), max);
							}
						}
						switch (max) {
							case 0:
								return 2;
							case 1:
								return 1.5;
							case 2:
								return [1, 2];
							default:
								return [0, max];
						}
					}
					if ((card.name == "tao" || card.name == "caoyao") && target.hp > 1 && target.countCards("h") <= target.hp) {
						return [0, 0];
					}
				},
			},
		},
	},

	// gz_caopi
	/** @type {Skill} */
	gz_xingshang: {
		audio: "xingshang",
		trigger: {
			global: "die",
		},
		preHidden: true,
		target: "player",
		filter(event) {
			return event.player.countCards("he") > 0;
		},
		async content(_event, trigger, player) {
			const toGain = trigger.player.getCards("he");
			await player.gain(toGain, trigger.player, "giveAuto", "bySelf");
		},
	},
	/** @type {Skill} */
	gz_fangzhu: {
		audio: "fangzhu",
		audioname2: {
			new_simayi: "refangzhu_new_simayi",
		},
		trigger: {
			player: "damageEnd",
		},
		preHidden: true,
		async cost(event, _trigger, player) {
			const next = player.chooseTarget(get.prompt2("gz_fangzhu"), (_card, player, target) => player != target);

			next.setHiddenSkill("gz_fangzhu");
			next.set("ai", check);

			event.result = await next.forResult();

			return;

			function check(target) {
				if (target.hasSkillTag("noturn")) {
					return 0;
				}

				const player = get.player();
				const att = get.attitude(player, target);

				if (att == 0) {
					return 0;
				}
				if (att > 0) {
					if (target.isTurnedOver()) {
						return 1000 - target.countCards("h");
					}
					return -1;
				} else {
					if (target.isTurnedOver()) {
						return -1;
					}
					if (player.getDamagedHp() >= 3) {
						return -1;
					}
					return target.countCards("h") + 1;
				}
			}
		},
		logTarget: "targets",
		async content(event, _trigger, player) {
			const { targets } = event;
			const target = targets[0];
			const num = player.getDamagedHp();

			/**
			 * @type {Partial<Result>}
			 */
			let result;

			if (num > 0) {
				const str = [`放逐：弃置${get.cnNumber(num)}张牌并失去1点体力`, `或者点击“取消”不弃牌，改为摸${get.cnNumber(num)}张牌并叠置`];
				const next = target.chooseToDiscard(num, "he", ...str);
				next.set("ai", check);

				result = await next.forResult();
			} else {
				result = {
					bool: false,
					cards: [],
				};
			}

			if (result.bool) {
				await target.loseHp();
			} else {
				if (num > 0) {
					await target.draw(num);
				}
				await target.turnOver(void 0);
			}

			return;

			function check(card) {
				const player = get.player();
				if (player.isTurnedOver()) {
					return -1;
				}
				return player.hp * player.hp - Math.max(1, get.value(card));
			}
		},
		ai: {
			maixie: true,
			maixie_hp: true,
			effect: {
				target(card, player, target) {
					if (get.tag(card, "damage")) {
						if (player.hasSkillTag("jueqing", false, target)) {
							return [1, -2];
						}
						if (target.hp <= 1) {
							return;
						}
						if (!target.hasFriend()) {
							return;
						}
						let hastarget = false;
						let turnfriend = false;
						const players = game.filterPlayer(lib.filter.all);
						for (let i = 0; i < players.length; i++) {
							if (get.attitude(target, players[i]) < 0 && !players[i].isTurnedOver()) {
								hastarget = true;
							}
							if (get.attitude(target, players[i]) > 0 && players[i].isTurnedOver()) {
								hastarget = true;
								turnfriend = true;
							}
						}
						if (get.attitude(player, target) > 0 && !hastarget) {
							return;
						}
						if (turnfriend || target.hp == target.maxHp) {
							return [0.5, 1];
						}
						if (target.hp > 1) {
							return [1, 0.5];
						}
					}
				},
			},
		},
	},

	// gz_yuejin
	/** @type {Skill} */
	gz_xiaoguo: {
		audio: "xiaoguo",
		audioname2: {
			gz_jun_caocao: "jianan_xiaoguo",
		},
		trigger: {
			global: "phaseZhunbeiBegin",
		},
		filter(event, player) {
			return (
				event.player != player &&
				player.countCards("h", card => {
					if (_status.connectMode) {
						return true;
					}
					// @ts-expect-error 类型系统未来可期
					return get.type(card) == "basic" && lib.filter.cardDiscardable(card, player);
				}) > 0
			);
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseToDiscard(
					get.prompt2("gz_xiaoguo", trigger.player),
					(card, player) => {
						return get.type(card) == "basic";
					},
					[1, Infinity]
				)
				.set("complexSelect", true)
				.set("ai", card => {
					const player = get.event().player,
						target = get.event().getTrigger().player;
					const effect = get.damageEffect(target, player, player);
					const cards = target.getCards("e", card => get.attitude(player, target) * get.value(card, target) < 0);
					if (effect <= 0 && !cards.length) {
						return 0;
					}
					if (ui.selected.cards.length > cards.length - (effect <= 0 ? 1 : 0)) {
						return 0;
					}
					return 1 / (get.value(card) || 0.5);
				})
				.set("logSkill", ["gz_xiaoguo", trigger.player])
				.setHiddenSkill("gz_xiaoguo")
				.forResult();
		},
		popup: false,
		preHidden: true,
		async content(event, trigger, player) {
			const num = trigger.player.countCards("e");
			const num2 = event.cards.length;
			await player.discardPlayerCard(trigger.player, "e", num2, true, "allowChooseAll");
			if (num2 > num) {
				await trigger.player.damage();
			}
		},
	},

	gz_jiubian_jianxiong: {
		audio: "jianxiong",
		trigger: {
			player: "damageEnd",
		},
		async cost(event, trigger, player) {
			let list = [];
			if (get.itemtype(trigger.cards) == "cards" && trigger.cards.filterInD().length) {
				list.push("拿牌");
			}
			list.push("摸牌");
			list.push("cancel2");
			const { control } = await player
				.chooseControl(list)
				.set("prompt", get.prompt2("gz_jiubian_jianxiong"))
				.set("ai", () => {
					const player = get.event().player,
						trigger = get.event().getTrigger();
					const cards = trigger.cards ? trigger.cards.filterInD() : [];
					if (get.event().controls.includes("拿牌")) {
						if (
							cards.reduce((sum, card) => {
								return sum + (card.name == "du" ? -1 : 1);
							}, 0) > 1 ||
							player.getUseValue(cards[0]) > 6
						) {
							return "拿牌";
						}
					}
					return "摸牌";
				})
				.forResult();
			event.result = { bool: control != "cancel2", cost_data: { result: control } };
		},
		async content(event, trigger, player) {
			if (event.cost_data.result == "摸牌") {
				await player.draw();
			} else {
				await player.gain(trigger.cards.filterInD(), "gain2");
			}
		},
		ai: {
			maixie: true,
			maixie_hp: true,
			effect: {
				target(card, player, target) {
					if (player.hasSkillTag("jueqing", false, target)) {
						return [1, -1];
					}
					if (get.tag(card, "damage") && player != target) {
						return [1, 0.6];
					}
				},
			},
		},
	},

	gz_jiubian_jushou: {
		audio: "xinjushou",
		trigger: {
			player: "phaseJieshuBegin",
		},
		preHidden: true,
		async content(event, trigger, player) {
			const groups = [];
			const players = game.filterPlayer(lib.filter.all);
			for (const target of players) {
				if (target.isUnseen(-1)) {
					continue;
				}
				let add = true;
				for (const group of groups) {
					if (group.isFriendOf(target)) {
						add = false;
						break;
					}
				}
				if (add) {
					groups.add(target);
				}
			}
			const num = groups.length;
			await player.draw(num);
			if (num > 3) {
				await player.turnOver();
			}
			const result = await player
				.chooseCard("h", true, "弃置一张手牌，若以此法弃置的是装备牌，则你改为使用之")
				.set("ai", card => {
					if (get.type(card) == "equip") {
						return 5 - get.value(card);
					}
					return -get.value(card);
				})
				.set("filterCard", lib.filter.cardDiscardable)
				.forResult();
			const card = result.cards[0];
			if (get.type(card) == "equip") {
				await player.chooseUseTarget({ card: card, nopopup: true, forced: true });
			} else {
				await player.discard({ cards: [card] });
			}
		},
	},

	gz_jiubian_xiaoguo: {
		audio: "xiaoguo",
		audioname2: {
			gz_jun_caocao: "jianan_xiaoguo",
		},
		trigger: {
			global: "phaseJieshuBegin",
		},
		filter(event, player) {
			return (
				event.player != player &&
				player.countCards("h", card => {
					if (_status.connectMode) {
						return true;
					}
					return lib.filter.cardDiscardable(card, player);
				}) > 0
			);
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseToDiscard({ prompt: get.prompt2("gz_jiubian_xiaoguo", trigger.player), position: "h" })
				.set("ai", card => {
					const player = get.event().player,
						target = get.event().getTrigger().player;
					if (get.damageEffect(target, player, player) <= 0) {
						return 0;
					}
					return 6 - get.value(card);
				})
				.set("logSkill", ["gz_jiubian_xiaoguo", trigger.player])
				.setHiddenSkill("gz_jiubian_xiaoguo")
				.forResult();
		},
		popup: false,
		preHidden: true,
		async content(event, trigger, player) {
			const target = trigger.player;
			await target.damage();
			if (target.isIn() && target.isDamaged() && target.countCards("e")) {
				const result = await target
					.chooseToDiscard({ prompt: "骁果：是否弃置装备区内的一张牌，然后回复1点体力？", position: "e" })
					.set("ai", card => {
						const player = get.event().player;
						return get.recoverEffect(player, player, player) - get.value(card, player);
					})
					.forResult();
				if (result.bool) {
					await target.recover();
				}
			}
		},
	},

	gz_jiubian_huoshou: {
		inherit: "huoshou",
	},

	gz_jiubian_zaiqi: {
		audio: "rezaiqi",
		direct: true,
		filter(event, player) {
			return lib.skill.gz_jiubian_zaiqi.count() > 0;
		},
		trigger: {
			player: "phaseJieshuBegin",
		},
		async content(event, trigger, player) {
			let result;
			result = await player
				.chooseTarget({ selectTarget: [1, lib.skill.gz_jiubian_zaiqi.count()], prompt: get.prompt2("gz_jiubian_zaiqi") })
				.set("ai", target => {
					return get.attitude(_status.event.player, target);
				})
				.forResult();
			if (result.bool) {
				const targets = result.targets;
				targets.sortBySeat();
				player.line(targets, "fire");
				player.logSkill("gz_jiubian_zaiqi", targets);
				event.targets = targets;
			} else {
				return;
			}
			while (event.targets.length) {
				event.current = event.targets.shift();
				if (player.isHealthy()) {
					result = { index: 0 };
				} else {
					result = await event.current
						.chooseControl()
						.set("choiceList", ["摸一张牌", "令" + get.translation(player) + "回复1点体力"])
						.set("ai", () => {
							if (get.attitude(event.current, player) > 0) {
								return 1;
							}
							return 0;
						})
						.forResult();
				}
				if (result.index == 1) {
					event.current.line(player);
					await player.recover({ source: event.current });
				} else {
					await event.current.draw();
				}
				await game.delay();
			}
		},
		count: () => get.discarded().filter(card => get.suit(card) === "heart").length,
	},

	gz_jiubian_qixi: {
		inherit: "qixi",
	},
	gz_jiubian_fenwei: {
		inherit: "fenwei",
	},

	gz_jiubian_shuangxiong: {
		audio: "shuangxiong",
		trigger: {
			player: "phaseUseBegin",
		},
		preHidden: true,
		filter(event, player) {
			return game.hasPlayer(target => target.countCards("he") > 0);
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget({ prompt: get.prompt2("gz_jiubian_shuangxiong"), filterTarget: (card, player, target) => target.countCards("he") > 0 })
				.set("ai", target => {
					const player = get.player();
					const att = get.attitude(player, target);
					if (target == player) {
						return player.hasValueTarget({ name: "juedou" }) ? 1 : 0;
					}
					return -att;
				})
				.setHiddenSkill("gz_jiubian_shuangxiong")
				.forResult();
		},
		logTarget: "targets",
		async content(event, trigger, player) {
			const target = event.targets[0];
			const result = await target
				.chooseToDiscard({ prompt: "双雄：弃置一张牌", position: "he", forced: true })
				.set("ai", card => {
					const player = get.player();
					return 6 - get.value(card, player);
				})
				.forResult();
			if (!result.bool || !result.cards?.length) {
				return;
			}
			player.addTempSkill("gz_jiubian_shuangxiong_viewas", "phaseAfter");
			player.markAuto("gz_jiubian_shuangxiong_viewas", [get.color(result.cards[0], false)]);
		},
		subSkill: {
			viewas: {
				charlotte: true,
				onremove: true,
				audio: "shuangxiong",
				enable: "chooseToUse",
				viewAs: {
					name: "juedou",
				},
				position: "h",
				sourceSkill: "gz_jiubian_shuangxiong",
				viewAsFilter(player) {
					return player.hasCard(card => lib.skill.gz_jiubian_shuangxiong.subSkill.viewas.filterCard(card, player), "h");
				},
				filterCard(card, player) {
					const color = get.color(card);
					const colors = player.getStorage("gz_jiubian_shuangxiong_viewas");
					for (const i of colors) {
						if (color != i) {
							return true;
						}
					}
					return false;
				},
				prompt() {
					const colors = _status.event.player.getStorage("gz_jiubian_shuangxiong_viewas");
					let str = "将一张颜色";
					for (let i = 0; i < colors.length; i++) {
						if (i > 0) {
							str += "或";
						}
						str += "不为";
						str += get.translation(colors[i]);
					}
					str += "的手牌当做【决斗】使用";
					return str;
				},
				check(card) {
					const player = _status.event.player;
					const raw = player.getUseValue(card, null, true);
					const eff = player.getUseValue(get.autoViewAs({ name: "juedou" }, [card]));
					return eff - raw;
				},
				ai: {
					order: 7,
				},
			},
		},
	},

	gz_jiubian_xunu: {
		audio: "gz_zhangren",
		trigger: { player: "phaseZhunbeiBegin" },
		preHidden: true,
		filter(event, player) {
			return lib.skill.gz_jiubian_xunu.getRelations(player).length > 0;
		},
		async cost(event, trigger, player) {
			const relations = lib.skill.gz_jiubian_xunu.getRelations(player);
			const choiceList = relations.map(relation => `${relation.type}：${get.translation(relation.players)}`);
			const result = await player
				.chooseControl("cancel2")
				.set("prompt", get.prompt2(event.skill))
				.set("choiceList", choiceList)
				.set("relations", relations)
				.set("ai", () => {
					const player = get.player();
					const relations = _status.event.relations;
					let choice = "cancel2",
						value = 0;
					for (let i = 0; i < relations.length; i++) {
						const effect = relations[i].targets.reduce((sum, target) => sum + get.effect(target, { name: "diaohulishan" }, player, player), 0);
						if (effect > value) {
							value = effect;
							choice = `选项${get.cnNumber(i + 1, true)}`;
						}
					}
					return choice;
				})
				.forResult();
			if (result.control == "cancel2") {
				event.result = { bool: false };
			} else {
				event.result = { bool: true, cost_data: relations[result.index] };
			}
		},
		async content(event, trigger, player) {
			const relation = event.cost_data;
			if (!relation || !relation.targets || !relation.targets.length) {
				return;
			}
			const targets = relation.targets.filter(target => target.isIn());
			if (!targets.length) {
				return;
			}
			await player.useCard({ card: { name: "diaohulishan", isCard: true }, targets: targets, addCount: false });
			const num = targets.length - player.countCards("h");
			if (num > 0) {
				await player.draw(num);
			}
		},
		getRelations(player) {
			const relations = [],
				keys = [],
				card = { name: "diaohulishan", isCard: true };
			for (const group of lib.skill.gz_jiubian_xunu.getInlineGroups()) {
				const targets = group.filter(target => target != player && player.canUse(card, target, false));
				if (!targets.length) {
					continue;
				}
				const key =
					"inline:" +
					group
						.map(current => current.playerid)
						.sort()
						.join(":");
				if (!keys.includes(key)) {
					keys.push(key);
					relations.push({ type: "队列", players: group, targets });
				}
			}
			for (const group of lib.skill.gz_jiubian_xunu.getSiegeGroups()) {
				const targets = group.filter(target => target != player && player.canUse(card, target, false));
				if (!targets.length) {
					continue;
				}
				const key =
					"siege:" +
					group
						.map(current => current.playerid)
						.sort()
						.join(":");
				if (!keys.includes(key)) {
					keys.push(key);
					relations.push({ type: "围攻", players: group, targets });
				}
			}
			return relations;
		},
		getInlineGroups() {
			const players = game.filterPlayer(current => current.isIn()),
				groups = [],
				keys = [];
			for (const player of players) {
				if (!player.inline()) {
					continue;
				}
				const group = players.filter(current => current == player || current.inline(player)).sortBySeat();
				if (group.length < 2) {
					continue;
				}
				const key = group
					.map(current => current.playerid)
					.sort()
					.join(":");
				if (!keys.includes(key)) {
					keys.push(key);
					groups.push(group);
				}
			}
			return groups;
		},
		getSiegeGroups() {
			const players = game.filterPlayer(current => current.isIn()),
				groups = [],
				keys = [];
			for (const target of players) {
				const next = target.getNext(),
					previous = target.getPrevious();
				if (!lib.skill.gz_jiubian_cegu.isSiegedInList(target, next, previous)) {
					continue;
				}
				const group = [target, next, previous].sortBySeat();
				const key = group
					.map(current => current.playerid)
					.sort()
					.join(":");
				if (!keys.includes(key)) {
					keys.push(key);
					groups.push(group);
				}
			}
			return groups;
		},
	},

	gz_jiubian_fengshi: {
		audio: "gz_zhangren",
		zhenfa: "siege",
		trigger: { source: "damageBegin1" },
		forced: true,
		preHidden: true,
		filter(event, player) {
			return event.card && event.card.name == "sha" && player.inline() && player.siege(event.player);
		},
		async content(event, trigger, player) {
			trigger.num += lib.skill.gz_jiubian_fengshi.getInlineNum(player);
		},
		getInlineNum(player) {
			return game.countPlayer(current => current == player || current.inline(player));
		},
	},

	gz_jiubian_shuangren: {
		audio: "shuangren",
		trigger: {
			player: "phaseUseBegin",
		},
		direct: true,
		preHidden: true,
		filter(event, player) {
			return (
				player.countCards("h") > 0 &&
				game.hasPlayer(current => {
					return current != player && player.canCompare(current);
				})
			);
		},
		async content(event, trigger, player) {
			const goon = player.needsToDiscard() > 1 ? player.hasCard(card => card.number > 10 && get.value(card) <= 5, "h") : player.hasCard(card => (card.number >= 9 && get.value(card) <= 5) || get.value(card) <= 3, "h");
			let result = await player
				.chooseTarget({ prompt: get.prompt2("gz_jiubian_shuangren"), filterTarget: (card, player, target) => player.canCompare(target) })
				.set("ai", target => {
					const player = _status.event.player;
					if (_status.event.goon && get.attitude(player, target) < 0) {
						return get.effect(target, { name: "sha" }, player, player);
					}
					return 0;
				})
				.set("goon", goon)
				.setHiddenSkill("gz_jiubian_shuangren")
				.forResult();
			if (!result.bool) {
				return;
			}
			const compareTarget = result.targets[0];
			player.logSkill("gz_jiubian_shuangren", compareTarget);
			result = await player.chooseToCompare(compareTarget).forResult();
			if (!result.bool) {
				player.addTempSkill("zishou2");
				return;
			}
			const targets = game.filterPlayer(current => {
				return current.isFriendOf(compareTarget) && player.canUse("sha", current, false);
			});
			if (!targets.length) {
				return;
			}
			result = await player
				.chooseTarget({
					selectTarget: [1, targets.length],
					prompt: "双刃：视为对任意名与" + get.translation(compareTarget) + "势力相同的角色使用一张【杀】",
					forced: true,
					filterTarget: (card, player, target) => {
						const compareTarget = _status.event.compareTarget;
						return target.isFriendOf(compareTarget) && player.canUse("sha", target, false);
					},
				})
				.set("compareTarget", compareTarget)
				.set("ai", target => {
					const player = _status.event.player;
					return get.effect(target, { name: "sha" }, player, player);
				})
				.forResult();
			if (result.bool && result.targets?.length) {
				await player.useCard({ card: { name: "sha", isCard: true }, targets: result.targets, addCount: false });
			}
		},
	},

	gz_jiubian_huyuan: {
		audio: "yuanhu",
		trigger: {
			global: "useCardToTargeted",
		},
		preHidden: true,
		filter(event, player) {
			const currentPhase = lib.skill.gz_jiubian_huyuan.getCurrentPhase(event);
			return event.card.name == "sha" && event.target.isFriendOf(player) && player.countCards("he") > 0 && game.hasPlayer(target => lib.skill.gz_jiubian_huyuan.isTarget(player, target, currentPhase));
		},
		getCurrentPhase(event) {
			return event.getParent("phase")?.player || _status.currentPhase;
		},
		isTarget(player, target, currentPhase) {
			return target != player && target != currentPhase && target.identity != "unknown" && !target.isFriendOf(player) && player.canUse({ name: "diaohulishan", isCard: true }, target, false);
		},
		async cost(event, trigger, player) {
			const currentPhase = lib.skill.gz_jiubian_huyuan.getCurrentPhase(trigger);
			event.result = await player
				.chooseCardTarget({
					prompt: get.prompt2("gz_jiubian_huyuan", trigger.target),
					position: "he",
					filterCard: true,
					selectTarget: [1, 2],
					filterTarget(card, player, target) {
						return lib.skill.gz_jiubian_huyuan.isTarget(player, target, get.event().currentPhase);
					},
					ai1(card) {
						return 7 - get.value(card);
					},
					ai2(target) {
						return get.effect(target, { name: "diaohulishan" }, get.player(), get.player());
					},
				})
				.set("currentPhase", currentPhase)
				.setHiddenSkill("gz_jiubian_huyuan")
				.forResult();
		},
		async content(event, trigger, player) {
			const currentPhase = lib.skill.gz_jiubian_huyuan.getCurrentPhase(trigger);
			const targets = event.targets.filter(target => lib.skill.gz_jiubian_huyuan.isTarget(player, target, currentPhase));
			if (!targets.length) {
				return;
			}
			const card = get.autoViewAs({ name: "diaohulishan" }, event.cards);
			await player.useCard({ card: card, cards: event.cards, targets: targets, addCount: false });
		},
	},

	gz_jiubian_heyi: {
		zhenfa: "inline",
		global: "gz_jiubian_heyi_kaikang",
		subSkill: {
			kaikang: {
				audio: "kaikang",
				trigger: {
					global: "useCardToTargeted",
				},
				filter(event, player) {
					return !player.hasSkill("kaikang") && event.card.name == "sha" && get.distance(player, event.target) <= 1 && event.target.isIn() && game.hasPlayer(current => current.hasSkill("gz_jiubian_heyi") && current.inline(player));
				},
				check(event, player) {
					return get.attitude(player, event.target) >= 0;
				},
				preHidden: true,
				logTarget: "target",
				sourceSkill: "gz_jiubian_heyi",
				async content(event, trigger, player) {
					await player.draw();
					if (trigger.target == player) {
						return;
					}
					const result = await player
						.chooseCard({ position: "he", forced: true, prompt: "交给" + get.translation(trigger.target) + "一张牌" })
						.set("ai", card => {
							if (get.position(card) == "e") {
								return -1;
							}
							if (card.name == "shan") {
								return 1;
							}
							if (get.type(card) == "equip") {
								return 0.5;
							}
							return 0;
						})
						.forResult();
					if (!result.bool || !result.cards?.length) {
						return;
					}
					const card = result.cards[0];
					await player.give(result.cards, trigger.target, "give");
					await game.delay();
					if (trigger.target.getCards("h").includes(card) && get.type(card) == "equip") {
						await trigger.target.chooseUseTarget({ card: card });
					}
				},
				ai: {
					threaten: 1.1,
				},
			},
		},
	},

	gz_jiubian_shenzhi: {
		audio: "shenzhi",
		trigger: {
			player: "phaseZhunbeiBegin",
		},
		preHidden: true,
		filter(event, player) {
			return game.hasPlayer(target => lib.skill.gz_jiubian_shenzhi.getCards(player, target).length > 0);
		},
		getCards(player, target) {
			const cards = [];
			for (const position of ["h", "e", "j"]) {
				const area = target.getCards(position);
				if (area.length == 1 && lib.filter.canBeDiscarded(area[0], target, player)) {
					cards.push(area[0]);
				}
			}
			return cards;
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget({
					prompt: get.prompt2("gz_jiubian_shenzhi"),
					filterTarget: (card, player, target) => {
						return lib.skill.gz_jiubian_shenzhi.getCards(player, target).length > 0;
					},
				})
				.set("ai", target => {
					const player = get.player();
					const cards = lib.skill.gz_jiubian_shenzhi.getCards(player, target);
					const discard = cards.reduce((max, card) => {
						let value = get.value(card, target);
						if (get.position(card) == "j") {
							value = -value;
						}
						return Math.max(max, -get.attitude(player, target) * value);
					}, -Infinity);
					return discard + get.recoverEffect(target, player, player);
				})
				.setHiddenSkill("gz_jiubian_shenzhi")
				.forResult();
		},
		logTarget: "targets",
		async content(event, trigger, player) {
			const target = event.targets[0];
			const result = await player
				.discardPlayerCard({ target: target, position: "hej", forced: true })
				.set("prompt", "神智：弃置" + get.translation(target) + "一个区域内的最后一张牌")
				.set("filterButton", button => {
					const player = get.player();
					const target = get.event().target;
					return lib.skill.gz_jiubian_shenzhi.getCards(player, target).includes(button.link);
				})
				.forResult();
			if (result.bool && target.isIn()) {
				await target.recover();
			}
		},
	},

	gz_jiubian_shushen: {
		audio: "mbshushen",
		trigger: {
			player: ["gainAfter", "recoverBegin"],
			global: "loseAsyncAfter",
		},
		preHidden: true,
		filter(event, player) {
			const type = event.name == "recover" ? "recover" : "gain";
			if (player.getStorage("gz_jiubian_shushen_used").includes(type)) {
				return false;
			}
			if (type == "recover") {
				return game.hasPlayer(target => target != player);
			}
			return event.getg(player).length >= 2 && game.hasPlayer(target => target != player && target.isDamaged());
		},
		async cost(event, trigger, player) {
			const recover = trigger.name == "recover";
			event.result = await player
				.chooseTarget({
					prompt: get.prompt("gz_jiubian_shushen"),
					prompt2: "令一名其他角色" + (recover ? "摸两张牌" : "回复1点体力"),
					filterTarget: (card, player, target) => {
						if (target == player) {
							return false;
						}
						return get.event().recover || target.isDamaged();
					},
				})
				.set("recover", recover)
				.set("ai", target => {
					const player = get.player();
					if (get.event().recover) {
						return get.effect(target, { name: "draw" }, player, player) * 2;
					}
					return get.recoverEffect(target, player, player);
				})
				.setHiddenSkill("gz_jiubian_shushen")
				.forResult();
		},
		async content(event, trigger, player) {
			const recover = trigger.name == "recover";
			player.addTempSkill("gz_jiubian_shushen_used");
			player.markAuto("gz_jiubian_shushen_used", [recover ? "recover" : "gain"]);
			const target = event.targets[0];
			if (recover) {
				await target.draw(2);
			} else {
				await target.recover();
			}
		},
		subSkill: {
			used: {
				charlotte: true,
				onremove: true,
			},
		},
	},

	gz_jiubian_yimie: {
		locked: true,
		audio: "yimie",
		global: "gz_jiubian_yimie_effect",
		trigger: { global: "dying" },
		priority: 16,
		forced: true,
		preHidden: true,
		filter(event, player) {
			return _status.currentPhase == player;
		},
		logTarget: "player",
		async content() {},
		subSkill: {
			effect: {
				enable: "chooseToUse",
				viewAsFilter(player) {
					if (!_status.currentPhase || !_status.currentPhase.hasSkill("gz_jiubian_yimie")) {
						return false;
					}
					const target = _status.event.dying;
					if (!target || target.isUnseen()) {
						return false;
					}
					return !player.isFriendOf(target) && player.countCards("h", { suit: "heart" });
				},
				filterCard(card) {
					return get.suit(card) == "heart";
				},
				locked: true,
				position: "h",
				viewAs: { name: "tao" },
				prompt: "将一张♥手牌当桃使用",
				check(card) {
					return 15 - get.value(card);
				},
				mod: {
					cardSavable(card, player) {
						if (card.name == "tao" && _status.currentPhase?.isIn() && _status.currentPhase.hasSkill("gz_jiubian_yimie")) {
							if (_status.event.dying && player.isFriendOf(_status.event.dying)) {
								return false;
							}
						}
					},
					cardEnabled(card, player) {
						if (card.name == "tao" && _status.currentPhase?.isIn() && _status.currentPhase.hasSkill("gz_jiubian_yimie")) {
							if (_status.event.dying && player.isFriendOf(_status.event.dying)) {
								return false;
							}
						}
					},
				},
			},
		},
	},

	gz_jiubian_ruilve: {
		audio: "ruilve",
		trigger: { global: "phaseEnd" },
		preHidden: true,
		filter(event, player) {
			if (event.player == player || !event.player.isUnseen()) {
				return false;
			}
			return lib.skill.gz_jiubian_ruilve.getCards().length > 0;
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseBool({ prompt: get.prompt("gz_jiubian_ruilve", trigger.player), prompt2: "获得弃牌堆内本回合进入的所有伤害牌，然后令其摸等量的牌" })
				.set("choice", true)
				.setHiddenSkill("gz_jiubian_ruilve")
				.forResult();
		},
		async content(event, trigger, player) {
			const cards = lib.skill.gz_jiubian_ruilve.getCards();
			if (!cards.length) {
				return;
			}
			await player.gain({ cards: cards, animate: "gain2" });
			await trigger.player.draw(cards.length);
		},
		getCards() {
			return get.discarded().filter(card => get.position(card, true) == "d" && get.is.damageCard(card));
		},
	},

	gz_jiubian_ciwei: {
		audio: "ciwei",
		trigger: { global: "useCard" },
		preHidden: true,
		popup: false,
		filter(event, player) {
			if (event.all_excluded || event.player == player || player != _status.currentPhase || !player.countCards("he")) {
				return false;
			}
			return game.hasPlayer(current => {
				if (current == event.player) {
					return false;
				}
				if (lib.skill.gz_jiubian_ciwei.isSameKnownGroup(current, event.player)) {
					return false;
				}
				return current.getHistory("useCard").length || current.getHistory("respond").length;
			});
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseToDiscard({ prompt: get.prompt2(event.skill, trigger.player), position: "he" })
				.set("ai", card => {
					return _status.event.goon / 1.4 - get.value(card);
				})
				.set(
					"goon",
					(function () {
						if (!trigger.targets.length) {
							return -get.attitude(player, trigger.player);
						}
						let num = 0;
						for (const target of trigger.targets) {
							num -= get.effect(target, trigger.card, trigger.player, player);
						}
						return num;
					})()
				)
				.setHiddenSkill(event.skill)
				.set("logSkill", [event.skill, trigger.player])
				.forResult();
		},
		async content(event, trigger, player) {
			trigger.targets.length = 0;
			trigger.all_excluded = true;
		},
		isSameKnownGroup(player, target) {
			if (player.isUnseen() || target.isUnseen()) {
				return false;
			}
			return player.isFriendOf(target);
		},
	},

	gz_jiubian_caiyuan: {
		audio: "caiyuan",
		trigger: {
			player: ["phaseBeginStart", "damageBegin3"],
		},
		forced: true,
		filter(event, player) {
			if (player.isUnseen(2)) {
				return false;
			}
			return event.name != "damage" || event.num > 0;
		},
		async content(event, trigger, player) {
			if (trigger.name == "phase") {
				await player.draw(2);
				return;
			}
			trigger.num--;
			if (!player.isUnseen(0) && get.character(player.name1, 3).includes("gz_jiubian_caiyuan")) {
				await player.hideCharacter(0);
			}
			if (!player.isUnseen(1) && get.character(player.name2, 3).includes("gz_jiubian_caiyuan")) {
				await player.hideCharacter(1);
			}
		},
	},

	gz_jiubian_yicheng: {
		audio: "yicheng",
		trigger: {
			global: ["useCardToPlayered", "useCardToTargeted"],
		},
		preHidden: true,
		filter(event, player, name) {
			if (event.card.name != "sha") {
				return false;
			}
			const target = event.target;
			if (!target?.isIn() || lib.skill.gz_jiubian_yicheng.getNum(target) <= 0) {
				return false;
			}
			if (name == "useCardToPlayered") {
				return event.player == player;
			}
			return event.player != player && target.isFriendOf(player);
		},
		logTarget: "target",
		async cost(event, trigger, player) {
			const target = trigger.target;
			const num = lib.skill.gz_jiubian_yicheng.getNum(target);
			const result = await player
				.choosePlayerCard({ target: target, prompt: `将${get.translation(target)}的${num}张牌扣置于其武将牌旁`, position: "he", selectButton: num })
				.set("ai", button => get.buttonValue(button))
				.setHiddenSkill(event.skill)
				.set("logSkill", [event.skill, target])
				.forResult();
			event.result = {
				bool: result.bool,
				cost_data: result.links,
			};
		},
		async content(event, trigger, player) {
			const target = trigger.target;
			const cards = event.cost_data;
			if (!cards?.length) {
				return;
			}
			const next = target.addToExpansion({ cards: cards, animate: "giveAuto", source: target });
			next.gaintag.add("gz_jiubian_yicheng");
			await next;
			target.addSkill("gz_jiubian_yicheng_gain");
			player.addTempSkill("gz_jiubian_yicheng_draw", "phaseAfter");
			if (!player.storage.gz_jiubian_yicheng_draw) {
				player.storage.gz_jiubian_yicheng_draw = [];
			}
			player.storage.gz_jiubian_yicheng_draw.push(trigger.getParent());
		},
		getNum(target) {
			return Math.min(target.hp, target.countCards("he"));
		},
		subSkill: {
			gain: {
				charlotte: true,
				trigger: { global: "phaseEnd" },
				forced: true,
				popup: false,
				filter(event, player) {
					return player.getExpansions("gz_jiubian_yicheng").length > 0;
				},
				async content(event, trigger, player) {
					const cards = player.getExpansions("gz_jiubian_yicheng");
					if (cards.length) {
						await player.gain({ cards: cards, animate: "gain2" });
					}
					player.removeSkill("gz_jiubian_yicheng_gain");
				},
				intro: {
					content: "expansion",
					markcount: "expansion",
				},
			},
			draw: {
				charlotte: true,
				trigger: { global: "useCardAfter" },
				forced: true,
				popup: false,
				onremove: true,
				filter(event, player) {
					return player.getStorage("gz_jiubian_yicheng_draw").includes(event);
				},
				async content(event, trigger, player) {
					const storage = player.getStorage("gz_jiubian_yicheng_draw"),
						records = storage.filter(evt => evt == trigger);
					player.storage.gz_jiubian_yicheng_draw = storage.filter(evt => evt != trigger);
					if (!trigger.player.hasHistory("sourceDamage", evt => evt.card === trigger.card)) {
						await player.draw(records.length);
					}
				},
			},
		},
	},

	gz_jiubian_duanxie: {
		audio: "duanxie",
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return !player.isLinked() || game.hasPlayer(current => current != player && !current.isLinked());
		},
		filterTarget(card, player, target) {
			return target != player && !target.isLinked();
		},
		selectTarget: [0, 4],
		async content(event, trigger, player) {
			const target = event.target;
			if (!target) return;
			if (!target.isLinked()) {
				await target.link(true);
				event.getParent()._gz_jiubian_duanxie_count = (event.getParent()._gz_jiubian_duanxie_count || 0) + 1;
			}
		},
		async contentAfter(event, trigger, player) {
			const num = event.getParent()._gz_jiubian_duanxie_count || event._gz_jiubian_duanxie_count || 0;
			if (!player.isLinked()) {
				await player.link(true);
			}
			if (num > player.getDamagedHp()) {
				await player.damage({ nosource: true, nocard: true });
			}
		},
		ai: {
			order: 2,
			result: {
				player(player) {
					return player.isLinked() ? 0 : -0.8;
				},
				target(player, target) {
					return get.effect(target, { name: "tiesuo" }, player, target) / get.attitude(target, target);
				},
			},
		},
	},

	gz_jiubian_fenming: {
		audio: "fenming",
		trigger: { player: "damageEnd" },
		preHidden: true,
		filter(event, player) {
			return player.isLinked() && game.hasPlayer(current => current.isLinked() && current.countCards("he"));
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseBool({ prompt: get.prompt2(event.skill) })
				.setHiddenSkill(event.skill)
				.forResult();
		},
		async content(event, trigger, player) {
			const targets = game.filterPlayer(current => current.isLinked() && current.countCards("he")).sortBySeat();
			for (const target of targets) {
				if (target == player) {
					await player.chooseToDiscard({ forced: true, position: "he" });
				} else {
					await player.discardPlayerCard({ target: target, forced: true, position: "he" });
				}
			}
		},
	},

	gz_jiubian_xuanlve: {
		audio: "xuanlve",
		trigger: {
			player: ["loseAfter", "phaseDiscardEnd"],
			global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"],
		},
		preHidden: true,
		filter(event, player) {
			if (event.name == "phaseDiscard") {
				const cards = [];
				player.getHistory("lose", evt => {
					if (evt.type == "discard" && evt.getParent("phaseDiscard") == event) {
						cards.addArray(evt.cards2);
					}
				});
				return cards.length >= 2;
			}
			const evt = event.getl(player);
			return evt && evt.es && evt.es.length > 0;
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget({
					prompt: get.prompt(event.skill),
					prompt2: "弃置一名其他角色的一张牌",
					filterTarget: (card, player, target) => {
						return target != player && target.countDiscardableCards(player, "he") > 0;
					},
				})
				.set("ai", target => {
					const player = get.player();
					return get.effect(target, { name: "guohe_copy2" }, player, player);
				})
				.setHiddenSkill(event.skill)
				.forResult();
		},
		async content(event, trigger, player) {
			await player.discardPlayerCard({ target: event.targets[0], position: "he", forced: true });
		},
		ai: {
			noe: true,
			reverseEquip: true,
			effect: {
				target(card) {
					if (get.type(card) == "equip") {
						return [1, 1];
					}
				},
			},
		},
	},

	gz_jiubian_yongjin: {
		audio: "yongjin",
		limited: true,
		skillAnimation: true,
		animationColor: "wood",
		enable: "phaseUse",
		filter() {
			return true;
		},
		canMove(player, cards = [], receivers = []) {
			return game.hasPlayer(from => {
				const equips = from.getCards("e", card => !cards.includes(card));
				return equips.some(card => game.hasPlayer(to => to != from && !to.isMin() && !receivers.includes(to) && to.canEquip(card)));
			});
		},
		async content(event, trigger, player) {
			player.awakenSkill(event.name);
			event.cards = [];
			event.receivers = [];
			event.count = 3;
			while (event.count > 0) {
				if (!lib.skill.gz_jiubian_yongjin.canMove(player, event.cards, event.receivers)) {
					break;
				}
				event.count--;
				const chooseTargetResult = await player
					.chooseTarget({
						selectTarget: 2,
						filterTarget: (card, player, target) => {
							const cards = _status.event.cards;
							const receivers = _status.event.receivers;
							if (ui.selected.targets.length) {
								const from = ui.selected.targets[0];
								if (target == from || target.isMin() || receivers.includes(target)) {
									return false;
								}
								return from.getCards("e", card => !cards.includes(card) && target.canEquip(card)).length > 0;
							}
							return (
								target.countCards("e", card => {
									return !cards.includes(card) && game.hasPlayer(current => current != target && !current.isMin() && !receivers.includes(current) && current.canEquip(card));
								}) > 0
							);
						},
					})
					.set("ai", target => {
						const player = _status.event.player;
						if (!ui.selected.targets.length) {
							const att = get.attitude(player, target);
							return att < 0 ? -att : 0;
						}
						const from = ui.selected.targets[0];
						const attFrom = get.attitude(player, from);
						const attTo = get.attitude(player, target);
						if (attFrom < 0 && attTo > 0) {
							return attTo - attFrom;
						}
						return Math.max(0, attTo - attFrom);
					})
					.set("multitarget", true)
					.set("cards", event.cards)
					.set("receivers", event.receivers)
					.set("targetprompt", ["被移走", "移动目标"])
					.set("prompt", "移动场上的一张装备牌")
					.forResult();
				if (!chooseTargetResult.bool || !chooseTargetResult.targets || chooseTargetResult.targets.length != 2) {
					break;
				}
				const targets = chooseTargetResult.targets;
				player.line2(targets, "green");
				await game.delay();
				const chooseCardResult = await player
					.choosePlayerCard({ position: "e", forced: true, target: targets[0] })
					.set("filterButton", button => {
						return !_status.event.cards.includes(button.link) && _status.event.targets1.canEquip(button.link);
					})
					.set("ai", button => {
						const player = _status.event.player;
						const from = _status.event.targets0;
						const to = _status.event.targets1;
						const attFrom = get.attitude(player, from);
						const attTo = get.attitude(player, to);
						if (attFrom < 0 && attTo > 0) {
							return get.value(button.link, from) + get.effect(to, button.link, player, to);
						}
						return get.effect(to, button.link, player, to) - get.value(button.link, from);
					})
					.set("cards", event.cards)
					.set("targets0", targets[0])
					.set("targets1", targets[1])
					.forResult();
				if (!chooseCardResult.bool || !chooseCardResult.links || !chooseCardResult.links.length) {
					break;
				}
				const card = chooseCardResult.links[0];
				event.cards.add(card);
				event.receivers.add(targets[1]);
				await targets[1].equip(card);
				targets[0].$give(card, targets[1]);
				await game.delay();
			}
		},
		ai: {
			order: 7,
			result: {
				player(player) {
					return lib.skill.gz_jiubian_yongjin.canMove(player) ? 1 : 0;
				},
			},
		},
	},

	gz_jiubian_cegu: {
		audio: "gz_lukang",
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return player.countCards("he") >= 2;
		},
		filterCard: true,
		position: "he",
		selectCard: 2,
		filterTarget: true,
		check(card) {
			return 6 - get.value(card);
		},
		async content(event, trigger, player) {
			if (lib.skill.gz_jiubian_cegu.canCreateNewSiege(event.target)) {
				await event.target.damage({ num: 2, source: player });
			} else {
				await player.draw();
			}
		},
		canCreateNewSiege(target) {
			const players = game.filterPlayer(current => current.isIn());
			if (!players.includes(target) || players.length <= 3) {
				return false;
			}
			const before = lib.skill.gz_jiubian_cegu.getSiegeKeys(players);
			const after = lib.skill.gz_jiubian_cegu.getSiegeKeys(players.filter(current => current != target));
			return after.some(key => !before.includes(key));
		},
		getSiegeKeys(players) {
			if (players.length < 3) {
				return [];
			}
			const list = [];
			for (let i = 0; i < players.length; i++) {
				const current = players[i],
					next = players[(i + 1) % players.length],
					previous = players[(i - 1 + players.length) % players.length];
				if (lib.skill.gz_jiubian_cegu.isSiegedInList(current, next, previous)) {
					const attackers = [next.playerid, previous.playerid].sort();
					list.push([current.playerid, attackers[0], attackers[1]].join(":"));
				}
			}
			return list;
		},
		isSiegedInList(current, next, previous) {
			if (!next || !previous || next == previous || current.identity == "unknown") {
				return false;
			}
			if (next.identity == "unknown" || next.isFriendOf(current)) {
				return false;
			}
			if (next.hasSkill("undist") || previous.hasSkill("undist")) {
				return false;
			}
			return next.isFriendOf(previous);
		},
		ai: {
			order: 7,
			result: {
				target(player, target) {
					if (lib.skill.gz_jiubian_cegu.canCreateNewSiege(target)) {
						return get.damageEffect(target, player, target, "nocard");
					}
					return 0;
				},
				player(player) {
					return 1;
				},
			},
		},
	},

	gz_jiubian_keshou: {
		audio: "gz_lukang",
		trigger: {
			player: "loseAfter",
			global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"],
		},
		preHidden: true,
		filter(event, player) {
			const evt = event.getl(player);
			return evt && evt.cards2 && evt.cards2.length >= 2 && game.hasPlayer(current => current.isFriendOf(player));
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget({
					prompt: get.prompt2(event.skill),
					filterTarget: (card, player, target) => {
						return target.isFriendOf(player);
					},
				})
				.set("ai", target => {
					return get.attitude(get.player(), target);
				})
				.setHiddenSkill(event.skill)
				.forResult();
		},
		async content(event, trigger, player) {
			for (const target of event.targets) {
				target.when("phaseBegin").then((event, trigger, player) => {
					player.addTempSkill("gz_jiubian_keshou_effect");
				});
			}
		},
		subSkill: {
			effect: {
				charlotte: true,
				mark: true,
				intro: {
					content: "下回合受到的伤害-1",
				},
				trigger: { player: "damageBegin3" },
				forced: true,
				filter(event, player) {
					return event.num > 0;
				},
				async content(event, trigger, player) {
					trigger.num--;
				},
			},
		},
	},

	// gz_liubei
	/** @type {Skill} */
	gz_rende: {
		audio: "rerende",
		audioname: ["gz_jun_liubei"],
		enable: "phaseUse",
		filter(_event, player) {
			// @ts-expect-error 类型系统未来可期
			return player.countCards("h") > 0 && game.hasPlayer(current => get.info("gz_rende").filterTarget?.(null, player, current));
		},
		filterTarget(_card, player, target) {
			if (player == target) {
				return false;
			}
			return !player.getStorage("gz_rende_targeted").includes(target);
		},
		filterCard: true,
		selectCard: [1, Infinity],
		allowChooseAll: true,
		discard: false,
		lose: false,
		delay: false,
		check(card) {
			if (ui.selected.cards.length && ui.selected.cards[0].name == "du") {
				return 0;
			}
			if (!ui.selected.cards.length && card.name == "du") {
				return 20;
			}
			const player = get.owner(card);
			if (player == null) {
				return 0;
			}
			if (ui.selected.cards.length >= Math.max(2, player.countCards("h") - player.hp)) {
				return 0;
			}
			if (player.hp == player.maxHp || player.storage.rerende < 0 || player.countCards("h") <= 1) {
				const players = game.filterPlayer(lib.filter.all);
				for (let i = 0; i < players.length; i++) {
					if (players[i].hasSkill("haoshi") && !players[i].isTurnedOver() && !players[i].hasJudge("lebu") && get.attitude(player, players[i]) >= 3 && get.attitude(players[i], player) >= 3) {
						return 11 - get.value(card);
					}
				}
				if (player.countCards("h") > player.hp) {
					return 10 - get.value(card);
				}
				if (player.countCards("h") > 2) {
					return 6 - get.value(card);
				}
				return -1;
			}
			return 10 - get.value(card);
		},
		async content(event, _trigger, player) {
			const { target, cards, name } = event;
			player.addTempSkill(name + "_targeted", "phaseUseAfter");
			player.markAuto(name + "_targeted", [target]);
			let num = 0;
			player.getHistory("lose", evt => {
				// @ts-expect-error 类型系统未来可期
				if (evt.getParent(2)?.name == name) {
					num += evt.cards.length;
				}
				return true;
			});
			await player.give(cards, target);
			const list = get.inpileVCardList(info => {
				return get.type(info[2]) == "basic" && player.hasUseTarget(new lib.element.VCard({ name: info[2], nature: info[3], isCard: true }), void 0, true);
			});
			if (num < 2 && num + cards.length > 1 && list.length) {
				const { links } = await player
					.chooseButton(["是否视为使用一张基本牌？", [list, "vcard"]])
					.set("ai", button => {
						return get.player().getUseValue({ name: button.link[2], nature: button.link[3], isCard: true });
					})
					.forResult();
				if (!links?.length) {
					return;
				}
				await player.chooseUseTarget(get.autoViewAs({ name: links[0][2], nature: links[0][3], isCard: true }), true);
			}
		},
		ai: {
			fireAttack: true,
			order(skill, player) {
				if (player.hp < player.maxHp && player.storage.rerende < 2 && player.countCards("h") > 1) {
					return 10;
				}
				return 4;
			},
			result: {
				target(player, target) {
					if (target.hasSkillTag("nogain")) {
						return 0;
					}
					if (ui.selected.cards.length && ui.selected.cards[0].name == "du") {
						if (target.hasSkillTag("nodu")) {
							return 0;
						}
						return -10;
					}
					if (target.hasJudge("lebu")) {
						return 0;
					}
					const nh = target.countCards("h");
					const np = player.countCards("h");
					if (player.hp == player.maxHp || player.storage.rerende < 0 || player.countCards("h") <= 1) {
						if (nh >= np - 1 && np <= player.hp && !target.hasSkill("haoshi")) {
							return 0;
						}
					}
					return Math.max(1, 5 - nh);
				},
			},
			effect: {
				// @ts-expect-error 类型系统未来可期
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
		subSkill: {
			targeted: {
				onremove: true,
				charlotte: true,
			},
		},
	},

	// gz_guanyu
	/** @type {Skill} */
	gz_wusheng: {
		audio: "wusheng",
		audioname: ["re_guanyu", "jsp_guanyu", "re_guanzhang", "dc_jsp_guanyu"],
		audioname2: {
			gz_guansuo: "wusheng_guansuo",
			dc_guansuo: "wusheng_guansuo",
			guanzhang: "wusheng_guanzhang",
			guansuo: "wusheng_guansuo",
			gz_jun_liubei: "shouyue_wusheng",
			std_guanxing: "wusheng_guanzhang",
			ty_guanxing: "wusheng_guanzhang",
		},
		enable: ["chooseToRespond", "chooseToUse"],
		filterCard(card, player) {
			if (get.zhu(player, "shouyue")) {
				return true;
			}
			return get.color(card) == "red";
		},
		locked: false,
		position: "hes",
		viewAs: {
			name: "sha",
		},
		viewAsFilter(player) {
			if (get.zhu(player, "shouyue")) {
				if (!player.countCards("hes")) {
					return false;
				}
			} else {
				if (!player.countCards("hes", { color: "red" })) {
					return false;
				}
			}
		},
		prompt: "将一张红色牌当杀使用或打出",
		check(card) {
			const val = get.value(card);
			const event = get.event();
			if (event.name == "chooseToRespond") {
				return 1 / Math.max(0.1, val);
			}
			return 5 - val;
		},
		mod: {
			targetInRange(card) {
				if (get.suit(card) == "diamond" && card.name == "sha") {
					return true;
				}
			},
		},
		ai: {
			respondSha: true,
			skillTagFilter(player) {
				if (get.zhu(player, "shouyue")) {
					if (!player.countCards("hes")) {
						return false;
					}
				} else {
					if (!player.countCards("hes", { color: "red" })) {
						return false;
					}
				}
			},
		},
	},

	// gz_zhangfei
	/** @type {Skill} */
	gz_paoxiao: {
		audio: "paoxiao",
		audioname2: {
			gz_jun_liubei: "shouyue_paoxiao",
		},
		trigger: {
			player: "useCard",
		},
		filter(event, player) {
			// @ts-expect-error 类型系统未来可期
			if (_status.currentPhase != player) {
				return false;
			}
			if (event.card.name != "sha") {
				return false;
			}
			const history = player.getHistory("useCard", evt => {
				return evt.card.name == "sha";
			});
			return history && history.indexOf(event) == 1;
		},
		forced: true,
		preHidden: true,
		async content(_event, _trigger, player) {
			await player.draw();
		},
		mod: {
			cardUsable(card, player, num) {
				if (card.name == "sha") {
					return Infinity;
				}
			},
		},
		ai: {
			unequip: true,
			skillTagFilter(player, tag, arg) {
				if (!get.zhu(player, "shouyue")) {
					return false;
				}
				if (arg && arg.name == "sha") {
					return true;
				}
				return false;
			},
		},
	},

	// gz_zhugeliang
	/** @type {Skill} */
	gz_kongcheng: {
		audio: "kongcheng",
		trigger: {
			target: "useCardToTarget",
		},
		locked: true,
		forced: true,
		check(event, player) {
			return get.effect(event.target, event.card, event.player, player) < 0;
		},
		filter(event, player) {
			return player.countCards("h") == 0 && (event.card.name == "sha" || event.card.name == "juedou");
		},
		async content(_event, trigger, player) {
			// @ts-expect-error 类型系统未来可期
			trigger.getParent()?.targets.remove(player);
		},
		onremove(player, skill) {
			const cards = player.getExpansions(skill);
			if (cards.length) {
				player.loseToDiscardpile(cards);
			}
		},
		ai: {
			effect: {
				target(card, _player, target, _current) {
					if (target.countCards("h") == 0 && (card.name == "sha" || card.name == "juedou")) {
						return "zeroplayertarget";
					}
				},
			},
		},
		intro: {
			markcount: "expansion",
			mark(dialog, _content, player) {
				const contents = player.getExpansions("gz_kongcheng");
				if (contents?.length) {
					if (player == game.me || player.isUnderControl(void 0, void 0)) {
						dialog.addAuto(contents);
					} else {
						return "共有" + get.cnNumber(contents.length) + "张牌";
					}
				}
			},
			content(_content, player) {
				const contents = player.getExpansions("gz_kongcheng");
				if (contents && contents.length) {
					if (player == game.me || player.isUnderControl(void 0, void 0)) {
						return get.translation(contents);
					}
					return "共有" + get.cnNumber(contents.length) + "张牌";
				}
			},
		},
		group: ["gz_kongcheng_gain", "gz_kongcheng_got"],
		subSkill: {
			gain: {
				audio: "kongcheng",
				trigger: {
					player: "gainBefore",
				},
				filter(event, player) {
					// @ts-expect-error 类型系统未来可期
					return event.source && event.source != player && player != _status.currentPhase && !event.bySelf && player.countCards("h") == 0;
				},
				async content(_event, trigger, _player) {
					trigger.name = "addToExpansion";
					trigger.setContent("addToExpansion");
					// @ts-expect-error 类型系统未来可期
					trigger.gaintag = ["gz_kongcheng"];
					// @ts-expect-error 类型系统未来可期
					trigger.untrigger();
					trigger.trigger("addToExpansionBefore");
				},
				sub: true,
				forced: true,
			},
			got: {
				trigger: {
					player: "phaseDrawBegin1",
				},
				filter(_event, player) {
					return player.getExpansions("gz_kongcheng").length > 0;
				},
				async content(_event, _trigger, player) {
					player.gain(player.getExpansions("gz_kongcheng"), "draw");
				},
				sub: true,
				forced: true,
			},
		},
	},

	// gz_zhaoyun
	/** @type {Skill} */
	gz_longdan: {
		audio: "longdan_sha",
		audioname2: { gz_jun_liubei: "shouyue_longdan" },
		group: ["gz_longdan_sha", "gz_longdan_shan", "gz_longdan_draw", "gz_longdan_shamiss", "gz_longdan_shanafter"],
		subSkill: {
			shanafter: {
				sub: true,
				audio: "longdan_sha",
				audioname2: { gz_jun_liubei: "shouyue_longdan" },
				trigger: {
					player: "useCard",
				},
				//priority:1,
				filter(event, _player) {
					// @ts-expect-error 类型系统未来可期
					return event.skill == "gz_longdan_shan" && event.getParent(2)?.name == "sha";
				},
				async cost(event, trigger, player) {
					event.result = await player
						.chooseTarget("是否发动【龙胆】令一名其他角色回复1点体力？", function (card, player, target) {
							return target != _status.event?.source && target != player && target.isDamaged();
						})
						.set("ai", function (target) {
							return get.attitude(_status.event?.player, target);
						})
						// @ts-expect-error 类型系统未来可期
						.set("source", trigger.getParent(2)?.player)
						.forResult();
				},
				logTarget: "targets",
				async content(event, _trigger, _player) {
					await event.targets[0].recover();
				},
			},
			shamiss: {
				sub: true,
				audio: "longdan_sha",
				audioname2: { gz_jun_liubei: "shouyue_longdan" },
				trigger: {
					player: "shaMiss",
				},
				filter(event, player) {
					return event.skill == "gz_longdan_sha";
				},
				async cost(event, trigger, player) {
					event.result = await player
						.chooseTarget("是否发动【龙胆】对一名其他角色造成1点伤害？", function (card, player, target) {
							return target != _status.event?.target && target != player;
						})
						.set("ai", function (target) {
							return -get.attitude(_status.event?.player, target);
						})
						.set("target", trigger.target)
						.forResult();
				},
				logTarget: "targets",
				async content(event, _trigger, _player) {
					await event.targets[0].damage();
				},
			},
			draw: {
				trigger: {
					player: ["useCard", "respond"],
				},
				audio: "longdan_sha",
				audioname2: { gz_jun_liubei: "shouyue_longdan" },
				forced: true,
				locked: false,
				filter(event, player) {
					if (!get.zhu(player, "shouyue")) {
						return false;
					}
					return event.skill == "gz_longdan_sha" || event.skill == "gz_longdan_shan";
				},
				async content(_event, _trigger, player) {
					player.draw();
					//player.storage.fanghun2++;
				},
				sub: true,
			},
			sha: {
				audio: "longdan_sha",
				audioname2: { gz_jun_liubei: "shouyue_longdan" },
				enable: ["chooseToUse", "chooseToRespond"],
				filterCard: {
					name: "shan",
				},
				viewAs: {
					name: "sha",
				},
				position: "hs",
				viewAsFilter(player) {
					if (!player.countCards("hs", "shan")) {
						return false;
					}
				},
				prompt: "将一张闪当杀使用或打出",
				check() {
					return 1;
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
					skillTagFilter(player) {
						if (!player.countCards("hs", "shan")) {
							return false;
						}
					},
					order() {
						return get.order({ name: "sha" }) + 0.1;
					},
				},
				sub: true,
			},
			shan: {
				audio: "longdan_sha",
				audioname2: { gz_jun_liubei: "shouyue_longdan" },
				enable: ["chooseToRespond", "chooseToUse"],
				filterCard: {
					name: "sha",
				},
				viewAs: {
					name: "shan",
				},
				position: "hs",
				prompt: "将一张杀当闪使用或打出",
				check() {
					return 1;
				},
				viewAsFilter(player) {
					if (!player.countCards("hs", "sha")) {
						return false;
					}
				},
				ai: {
					respondShan: true,
					skillTagFilter(player) {
						if (!player.countCards("hs", "sha")) {
							return false;
						}
					},
					effect: {
						target(card, player, target, current) {
							if (get.tag(card, "respondShan") && current < 0) {
								return 0.6;
							}
						},
					},
				},
				sub: true,
			},
		},
	},

	// gz_machao
	/** @type {Skill} */
	gz_tieji: {
		audio: "retieji",
		audioname2: {
			gz_jun_liubei: "shouyue_tieji",
		},
		trigger: {
			player: "useCardToPlayered",
		},
		check(event, player) {
			return get.attitude(player, event.target) < 0;
		},
		filter(event) {
			return event.card.name == "sha";
		},
		logTarget: "target",
		async content(_event, trigger, player) {
			const { target } = trigger;

			/** @type {string[]} */
			const addingSkills = [];
			const targetMainShowing = !target.isUnseen(0);
			const targetViceShowing = !target.isUnseen(1);
			if (get.zhu(player, "shouyue")) {
				if (targetMainShowing) {
					addingSkills.push("fengyin_main");
				}
				if (targetViceShowing) {
					addingSkills.push("fengyin_vice");
				}
			} else {
				const controls = [];
				if (targetMainShowing && !target.hasSkill("fengyin_main")) {
					controls.push("主将");
				}
				if (targetViceShowing && !target.hasSkill("fengyin_vice")) {
					controls.push("副将");
				}

				/** @type {?Partial<Result>} */
				let result = null;

				if (controls.length == 1) {
					result = { control: controls[0] };
				} else if (controls.length > 1) {
					result = await player
						.chooseControl(controls)
						.set("ai", () => {
							let choice = "主将";
							const skills = lib.character[target.name2][3];
							for (const skill of skills) {
								const info = get.info(skill);
								if (info?.ai?.maixie) {
									choice = "副将";
									break;
								}
							}
							return choice;
						})
						.set("prompt", `请选择一个武将牌，令${get.translation(target)}该武将牌上的非锁定技全部失效。`)
						.forResult();
				}

				if (result?.control) {
					const map = {
						主将: "fengyin_main",
						副将: "fengyin_vice",
					};

					addingSkills.push(map[result.control]);
				}
			}

			addingSkills.forEach(skill => {
				target.addTempSkill(skill);
			});

			const result = await player.judge(() => 0).forResult();

			// @ts-expect-error 类型系统未来可期
			const suit = get.suit(result.card);
			const num = target.countCards("h", "shan");
			const result2 = await target
				.chooseToDiscard("请弃置一张" + get.translation(suit) + "牌，否则不能使用闪抵消此杀", "he", function (card) {
					// @ts-expect-error 类型系统未来可期
					return get.suit(card) == get.event().suit;
				})
				.set("ai", card => {
					const num = get.event().num;
					if (num == 0) {
						return 0;
					}
					if (card.name == "shan") {
						return num > 1 ? 2 : 0;
					}
					return 8 - get.value(card);
				})
				.set("num", num)
				.set("suit", suit)
				.forResult();

			if (result2 && !result2.bool) {
				// @ts-expect-error 类型系统未来可期
				trigger.getParent().directHit.add(trigger.target);
			}
		},
	},

	/** @type {Skill} */
	gz_mashu: {
		mod: {
			globalFrom(from, to, distance) {
				return distance - 1;
			},
		},
	},
	/** @type {Skill} */
	gz_md_mashu: {
		inherit: "gz_mashu",
	},
	/** @type {Skill} */
	gz_mt_mashu: {
		inherit: "gz_mashu",
	},
	/** @type {Skill} */
	gz_pd_mashu: {
		inherit: "gz_mashu",
	},

	// gz_huangyueying
	gz_jizhi: {
		audio: "jizhi",
		trigger: { player: "useCard" },
		frequent: true,
		preHidden: true,
		filter(event) {
			return get.type(event.card) == "trick" && event.card.isCard;
		},
		async content(event, trigger, player) {
			await player.draw("nodelay");
		},
		ai: {
			threaten: 1.4,
			noautowuxie: true,
		},
	},

	// gz_huangzhong
	/** @type {Skill} */
	gz_liegong: {
		audio: "liegong",
		audioname2: {
			gz_jun_liubei: "shouyue_liegong",
		},
		trigger: {
			player: "useCardToPlayered",
		},
		locked: false,
		filter(event, player) {
			return event.card.name == "sha" && player.hp <= event.target.hp;
		},
		preHidden: true,
		async cost(event, trigger, player) {
			const target = get.translation(trigger.target);
			const card = get.translation(trigger.card);

			const next = player.chooseControl("cancel2");

			next.set("prompt", get.prompt("gz_liegong", trigger.target));
			next.set("choiceList", [`令${card}对${target}的伤害+1`, `令${target}不能响应${card}`]);
			next.set("ai", check);
			next.setHiddenSkill("gz_liegong");

			const result = await next.forResult();

			event.result = {
				bool: result.control != "cancel2",
				targets: [trigger.target],
				cost_data: {
					index: result.index,
					control: result.control,
				},
			};

			return;

			function check() {
				const player = get.player();
				const target = get.event().getTrigger().target;

				if (get.attitude(player, target) > 0) {
					return 2;
				}

				return target.mayHaveShan(player, "use") ? 1 : 0;
			}
		},
		logTarget: "targets",
		async content(event, trigger, player) {
			const [target] = event.targets;

			const { index } = event.cost_data;

			if (index == 1) {
				game.log(trigger.card, "不可被", target, "响应");
				// @ts-expect-error 类型系统未来可期
				trigger.directHit.add(target);
			} else {
				game.log(trigger.card, "对", target, "的伤害+1");
				// @ts-expect-error 类型系统未来可期
				const map = trigger.getParent()?.customArgs;
				const id = target.playerid;
				map[id] ??= {};
				map[id].extraDamage ??= 0;
				map[id].extraDamage++;
			}
		},
		mod: {
			targetInRange(card, player, target) {
				if (card.name == "sha" && target.countCards("h") < player.countCards("h")) {
					return true;
				}
			},
			attackRange(player, distance) {
				if (get.zhu(player, "shouyue")) {
					return distance + 1;
				}
			},
		},
	},

	// gz_weiyan
	/** @type {Skill} */
	gz_kuanggu: {
		audio: "kuanggu",
		audioname: ["re_weiyan", "ol_weiyan"],
		trigger: {
			source: "damageSource",
		},
		filter(event, _player) {
			// @ts-expect-error 类型系统未来可期
			return event.checkKuanggu && event.num > 0;
		},
		getIndex(event, _player, _triggername) {
			return event.num;
		},
		preHidden: true,
		async cost(event, _trigger, player) {
			let choice;
			if (
				player.isDamaged() &&
				get.recoverEffect(player) > 0 &&
				player.countCards("hs", function (card) {
					return card.name == "sha" && player.hasValueTarget(card);
				}) >= player.getCardUsable("sha", void 0)
			) {
				choice = "recover_hp";
			} else {
				choice = "draw_card";
			}
			const next = player.chooseDrawRecover("###" + get.prompt(event.skill) + "###摸一张牌或回复1点体力");
			next.set("choice", choice);
			next.set("ai", function () {
				// @ts-expect-error 类型系统未来可期
				return _status.event.getParent().choice;
			});
			next.set("logSkill", event.skill);
			next.setHiddenSkill(event.skill);
			const { control } = await next.forResult();
			if (control == "cancel2") {
				return;
			}
			event.result = { bool: true, skill_popup: false };
		},
		async content(_event, _trigger, _player) {},
	},

	// gz_pangtong
	/** @type {Skill} */
	gz_lianhuan: {
		audio: "lianhuan",
		hiddenCard(player, name) {
			return name == "tiesuo" && player.hasCard(card => get.suit(card) == "club", "sh");
		},
		enable: "chooseToUse",
		filter(event, player) {
			if (!player.hasCard(card => get.suit(card) == "club", "sh")) {
				return false;
			}
			return event.type == "phase" || event.filterCard(get.autoViewAs({ name: "tiesuo" }, "unsure"), player, event);
		},
		position: "hs",
		filterCard(card, player, event) {
			if (!event) {
				event = _status.event;
			}
			if (get.suit(card) != "club") {
				return false;
			}
			if (event.type == "phase" && get.position(card) != "s" && player.canRecast(card)) {
				return true;
			} else {
				if (game.checkMod(card, player, "unchanged", "cardEnabled2", player) === false) {
					return false;
				}
				const cardx = get.autoViewAs({ name: "tiesuo" }, [card]);
				return event._backup.filterCard(cardx, player, event);
			}
		},
		filterTarget(fuck, player, target) {
					const card = ui.selected.cards[0],
						event = _status.event,
						backup = event._backup;
					if (!card || game.checkMod(card, player, "unchanged", "cardEnabled2", player) === false) {
						return false;
					}
					const cardx = get.autoViewAs({ name: "tiesuo" }, [card]);
					return backup.filterCard(cardx, player, event) && backup.filterTarget(cardx, player, target);
		},
		selectTarget() {
					const card = ui.selected.cards[0],
						event = _status.event,
						player = event.player,
						backup = event._backup;
					let recast = false,
						use = false;
					const cardx = get.autoViewAs({ name: "tiesuo" }, [card]);
					if (event.type == "phase" && player.canRecast(card)) {
						recast = true;
					}
					if (card && game.checkMod(card, player, "unchanged", "cardEnabled2", player) !== false) {
						if (backup.filterCard(cardx, player, event)) {
							use = true;
						}
					}
					if (!use) {
						return [0, 0];
					} else {
						const select = backup.selectTarget(cardx, player);
						if (recast && select[0] > 0) {
							select[0] = 0;
						}
						return select;
					}
		},
		filterOk() {
					const card = ui.selected.cards[0],
						event = _status.event,
						player = event.player,
						backup = event._backup;
					const selected = ui.selected.targets.length;
					let recast = false,
						use = false;
					const cardx = get.autoViewAs({ name: "tiesuo" }, [card]);
					if (event.type == "phase" && player.canRecast(card)) {
						recast = true;
					}
					if (card && game.checkMod(card, player, "unchanged", "cardEnabled2", player) !== false) {
						if (backup.filterCard(cardx, player, event)) {
							use = true;
						}
					}
					if (recast && selected == 0) {
						return true;
					} else if (use) {
						const select = backup.selectTarget(cardx, player);
						if (select[0] <= -1) {
							return true;
						}
						return selected >= select[0] && selected <= select[1];
					}
		},
		ai1(card) {
			return 6 - get.value(card);
		},
		ai2(target) {
			if (!target) return 0;
			const player = get.player();
			return get.effect(target, { name: "tiesuo" }, player, player);
		},
		discard: false,
		lose: false,
		delay: false,
		viewAs(cards, player) {
			return {
				name: "tiesuo",
			};
		},
		prepare: () => true,
		async precontent(event, trigger, player) {
			const result = event.result;
			if (!result?.targets?.length) {
				delete result.card;
			}
		},
		async content(event, trigger, player) {
			await player.recast(event.cards);
		},
		ai: {
			order(item, player) {
				if (game.hasPlayer(current => get.effect(current, { name: "tiesuo" }, player, player) > 0) || player.hasCard(card => get.suit(card) == "club" && player.canRecast(card), "h")) {
					return 8;
				}
				return 1;
			},
			result: { player: 1 },
		},
	},
	/** @type {Skill} */
	gz_niepan: {
		audio: "niepan",
		audioname2: {
			sb_pangtong: "sbniepan",
		},
		unique: true,
		enable: "chooseToUse",
		mark: true,
		skillAnimation: true,
		limited: true,
		animationColor: "orange",
		init(player) {
			player.storage.gz_niepan = false;
		},
		filter(event, player) {
			if (player.storage.gz_niepan) {
				return false;
			}
			if (event.type == "dying") {
				// @ts-expect-error 类型系统未来可期
				if (player != event.dying) {
					return false;
				}
				return true;
			}
			return false;
		},
		async content(event, trigger, player) {
			player.awakenSkill("gz_niepan", void 0);
			player.storage.gz_niepan = true;
			await player.discard(player.getCards("hej"));
			await player.link(false);
			await player.turnOver(false);
			await player.draw(3);
			if (player.hp < 3) {
				await player.recover(3 - player.hp);
			}
		},
		ai: {
			order: 1,
			skillTagFilter(player, arg, target) {
				if (player != target || player.storage.oldniepan) {
					return false;
				}
			},
			save: true,
			result: {
				player(player) {
					if (player.hp <= 0) {
						return 10;
					}
					if (player.hp <= 2 && player.countCards("he") <= 1) {
						return 10;
					}
					return 0;
				},
			},
			threaten(player, target) {
				if (!target.storage.oldniepan) {
					return 0.6;
				}
			},
		},
		intro: {
			content: "limited",
		},
	},

	// gz_ganfuren
	/** @type {Skill} */
	gz_shushen: {
		audio: "shushen",
		trigger: {
			player: "recoverEnd",
		},
		getIndex: event => event.num || 1,
		preHidden: true,
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt2(event.skill), lib.filter.notMe)
				.set("ai", target => {
					const player = get.player();
					return get.effect(target, { name: "draw" }, player, player) * (1 + (target.countCards("h") == 0 ? 1 : 0));
				})
				.setHiddenSkill(event.skill)
				.forResult();
		},
		async content(event, trigger, player) {
			event.targets[0].draw(event.targets[0].countCards("h") > 0 ? 1 : 2);
		},
		ai: {
			threaten: 0.8,
			expose: 0.1,
		},
	},

	// gz_sunquan
	gz_zhiheng: {
		inherit: "zhiheng",
		audio: "zhiheng",
		audioname2: {
			new_simayi: "rezhiheng_new_simayi",
		},
		selectCard() {
			const player = get.player();
			const range1 = [1, player.maxHp];
			if (player.hasSkill("dinglanyemingzhu_skill")) {
				for (let i = 0; i < ui.selected.cards.length; i++) {
					if (ui.selected.cards[i] == player.getEquip("dinglanyemingzhu")) {
						return range1;
					}
				}
				return [1, Infinity];
			}
			return range1;
		},
		filterCard(card, player) {
			if (ui.selected.cards.length < player.maxHp || !player.hasSkill("dinglanyemingzhu_skill")) {
				return true;
			}
			return card != player.getEquip("dinglanyemingzhu");
		},
		complexCard: true,
		complexSelect: true,
		prompt() {
			const player = get.player();
			if (player.hasSkill("dinglanyemingzhu_skill")) {
				return "出牌阶段限一次，你可以弃置任意张牌，然后摸等量的牌";
			}
			return "出牌阶段限一次，你可以弃置至多X张牌（X为你的体力上限），然后摸等量的牌";
		},
	},

	// gz_lvmeng
	/** @type {Skill} */
	gz_keji: {
		audio: "keji",
		forced: true,
		trigger: {
			player: "phaseDiscardBegin",
		},
		filter(event, player) {
			const list = [];
			player.getHistory("useCard", function (evt) {
				if (evt.isPhaseUsing(player)) {
					const color = get.color(evt.card);
					if (color != "nocolor") {
						list.add(color);
					}
				}
				return true;
			});
			return list.length <= 1;
		},
		check(event, player) {
			return player.needsToDiscard();
		},
		async content(event, trigger, player) {
			player.addTempSkill("keji_add", "phaseAfter");
		},
	},
	/** @type {Skill} */
	gz_mouduan: {
		trigger: {
			player: "phaseJieshuBegin",
		},
		//priority:2,
		audio: "botu",
		filter(event, player) {
			const history = player.getHistory("useCard");
			const suits = [];
			const types = [];
			for (let i = 0; i < history.length; i++) {
				const suit = get.suit(history[i].card);
				if (suit) {
					suits.add(suit);
				}
				types.add(get.type(history[i].card));
			}
			return suits.length >= 4 || types.length >= 3;
		},
		check(event, player) {
			return player.canMoveCard(true, void 0);
		},
		async content(event, trigger, player) {
			await player.moveCard();
		},
	},

	// gz_huanggai
	/** @type {Skill} */
	gz_kurou: {
		audio: "rekurou",
		enable: "phaseUse",
		usable: 1,
		filterCard: true,
		check(card) {
			return 8 - get.value(card);
		},
		position: "he",
		async content(event, trigger, player) {
			await player.loseHp();
			await player.draw(3);
			player.addTempSkill("kurou_effect", "phaseAfter");
		},
		ai: {
			order: 8,
			result: {
				player(player) {
					if (player.needsToDiscard(3) && !player.hasValueTarget({ name: "sha" })) {
						return -1;
					}
					if (player.hp <= 2) {
						return player.countCards("h") == 0 ? 1 : 0;
					}
					if (player.countCards("h", { name: "sha", color: "red" })) {
						return 1;
					}
					return player.countCards("h") <= player.hp ? 1 : 0;
				},
			},
		},
	},

	// gz_luxun
	/** @type {Skill} */
	gz_qianxun: {
		audio: "qianxun",
		trigger: {
			target: "useCardToTarget",
			player: "addJudgeBefore",
		},
		forced: true,
		preHidden: true,
		priority: 15,
		check(event, player) {
			return event.name == "addJudge" || get.effect(event.target, event.card, event.player, player) < 0;
		},
		filter(event, player) {
			return event.card.name == (event.name == "addJudge" ? "lebu" : "shunshou");
		},
		async content(event, trigger, player) {
			if (trigger.name == "addJudge") {
				trigger.cancel(undefined, undefined, undefined);
				const owner = get.owner(trigger.card);
				if (owner && owner.getCards("hej").includes(trigger.card)) {
					owner.lose(trigger.card, ui.discardPile);
				} else {
					game.cardsDiscard(trigger.card);
				}
				game.log(trigger.card, "进入了弃牌堆");
			} else {
				// @ts-expect-error 类型系统未来可期
				trigger.getParent()?.targets?.remove(player);
			}
		},
		ai: {
			effect: {
				target(card, player, target, current) {
					if (card.name == "shunshou" || card.name == "lebu") {
						return "zeroplayertarget";
					}
				},
			},
		},
	},
	/** @type {Skill} */
	gz_duoshi: {
		audio: "duoshi",
		trigger: { player: "phaseUseBegin" },
		filter(event, player) {
			return player.hasUseTarget(new lib.element.VCard({ name: "yiyi", isCard: true }));
		},
		direct: true,
		preHidden: true,
		async content(event, trigger, player) {
			await player
				.chooseUseTarget(get.prompt2(event.name), new lib.element.VCard({ name: "yiyi", isCard: true }), false)
				.set("hiddenSkill", event.name)
				.set("logSkill", event.name);
		},
	},

	// gz_sunshangxiang
	gz_xiaoji: {
		inherit: "xiaoji",
		audio: "xiaoji",
		preHidden: true,
		getIndex(event, player) {
			const evt = event.getl(player);
			if (evt && evt.player === player && evt.es && evt.es.length) {
				return 1;
			}
			return false;
		},
		async content(event, trigger, player) {
			// @ts-expect-error 类型系统未来可期
			await player.draw(player == _status.currentPhase ? 1 : 3);
		},
	},

	// gz_xiaoqiao
	gz_tianxiang: {
		audio: "tianxiang",
		audioname: ["daxiaoqiao", "re_xiaoqiao", "ol_xiaoqiao"],
		trigger: { player: "damageBegin4" },
		preHidden: true,
		usable: 1,
		filter(event, player) {
			return (
				player.countCards("h", card => {
					return _status.connectMode || (get.suit(card, player) == "heart" && lib.filter.cardDiscardable(card, player));
				}) > 0 && event.num > 0
			);
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseCardTarget({
					filterCard(card, player) {
						return get.suit(card) == "heart" && lib.filter.cardDiscardable(card, player);
					},
					filterTarget: lib.filter.notMe,
					ai1(card) {
						return 10 - get.value(card);
					},
					ai2(target) {
						const att = get.attitude(get.player(), target);
						const trigger = get.event().getTrigger();
						let da = 0;
						if (get.player().hp == 1) {
							da = 10;
						}
						const eff = get.damageEffect(target, trigger.source, target);
						if (att == 0) {
							return 0.1 + da;
						}
						if (eff >= 0 && att > 0) {
							return att + da;
						}
						if (att > 0 && target.hp > 1) {
							if (target.maxHp - target.hp >= 3) {
								return att * 1.1 + da;
							}
							if (target.maxHp - target.hp >= 2) {
								return att * 0.9 + da;
							}
						}
						return -att + da;
					},
					prompt: get.prompt(event.skill),
					prompt2: lib.translate[`${event.skill}_info`],
				})
				.setHiddenSkill(event.skill)
				.forResult();
		},
		async content(event, trigger, player) {
			const {
				cards,
				targets: [target],
			} = event;
			trigger.cancel();
			await player.discard(cards);
			const result = await player
				// @ts-expect-error 类型系统未来可期
				.chooseControlList(true, (event, player) => get.event().index, [`令${get.translation(target)}受到伤害来源对其造成的1点伤害，然后摸X张牌（X为其已损失体力值且至多为5）`, `令${get.translation(target)}失去1点体力，然后获得${get.translation(cards)}`])
				.set(
					"index",
					(() => {
						let att = get.attitude(player, target);
						if (target.hasSkillTag("maihp")) {
							att = -att;
						}
						return att > 0 ? 0 : 1;
					})()
				)
				.forResult();
			if (typeof result.index != "number") {
				return;
			}
			if (result.index == 0) {
				await target.damage(trigger.source || "nosource", "nocard");
				if (target.getDamagedHp()) {
					await target.draw(Math.min(5, target.getDamagedHp()));
				}
			} else {
				await target.loseHp();
				if (cards[0].isInPile()) {
					await target.gain(cards, "gain2");
				}
			}
		},
		ai: {
			maixie_defend: true,
			effect: {
				target(card, player, target) {
					if (player.hasSkillTag("jueqing", false, target)) {
						return;
					}
					if (get.tag(card, "damage") && target.countCards("he") > 1) {
						return 0.7;
					}
				},
			},
		},
	},
	gz_hongyan: {
		mod: {
			suit(card, suit) {
				if (suit == "spade") {
					return "heart";
				}
			},
			maxHandcard(player, num) {
				if (
					player.hasCard(function (card) {
						return get.suit(card, player) == "heart";
					}, "e")
				) {
					return num + 1;
				}
			},
		},
	},

	// gz_re_taishici
	gz_hanzhan: {
		audio: "hanzhan",
		trigger: {
			player: ["chooseToCompareAfter", "compareMultipleAfter"],
			target: ["chooseToCompareAfter", "compareMultipleAfter"],
		},
		filter(event, player) {
			if (event.preserve) {
				return false;
			}
			const list = [event.player, event.target];
			const targets = list.slice().filter(i => (event.num1 - event.num2) * get.sgn(0.5 - list.indexOf(i)) <= 0);
			return targets.some(i => {
				const target = list[1 - list.indexOf(i)];
				return target.hasCard(card => {
					return lib.filter.canBeGained(card, i, target);
				}, "e");
			});
		},
		async cost(event, trigger, player) {
			let users = [];
			const list = [trigger.player, trigger.target];
			let targets = list.slice().filter(i => (trigger.num1 - trigger.num2) * get.sgn(0.5 - list.indexOf(i)) <= 0);
			targets = targets
				.filter(i => {
					const target = list[1 - list.indexOf(i)];
					return target.hasCard(card => {
						return lib.filter.canBeGained(card, i, target);
					}, "e");
				})
				.sortBySeat(player);
			for (const i of targets) {
				const aim = list[1 - list.indexOf(i)];
				const { bool } = await i.chooseBool(get.prompt("gz_hanzhan"), "获得" + get.translation(aim) + "装备区的一张牌").set(
					"choice",
					aim.hasCard(card => {
						return get.value(card, aim) * get.attitude(i, aim) < 0;
					}, "e")
				).forResult();
				if (bool) {
					users.push(i);
				}
			}
			event.result = { bool: Boolean(users.length), targets: users };
		},
		logLine: false,
		async content(event, trigger, player) {
			const list = [trigger.player, trigger.target];
			let targets = list.slice().filter(i => (trigger.num1 - trigger.num2) * get.sgn(0.5 - list.indexOf(i)) <= 0);
			targets = targets
				.filter(i => {
					const target = list[1 - list.indexOf(i)];
					return target.hasCard(card => {
						return lib.filter.canBeGained(card, i, target);
					}, "e");
				})
				.sortBySeat(player);
			for (const i of targets) {
				const aim = list[1 - list.indexOf(i)];
				i.line(aim, "green");
				await i.gainPlayerCard(aim, "e", true);
			}
		},
	},

	// gz_dingfeng
	gz_duanbing: {
		audio: "duanbing",
		inherit: "reduanbing",
		preHidden: ["gz_duanbing_sha"],
		group: ["gz_duanbing", "gz_duanbing_sha"],
		subSkill: {
			sha: {
				audio: "duanbing",
				trigger: { player: "useCardToPlayered" },
				filter(event, player) {
					return event.card.name == "sha" && !event.getParent().directHit.includes(event.target) && event.targets.length == 1;
				},
				forced: true,
				logTarget: "target",
				async content(event, trigger, player) {
					const id = trigger.target.playerid;
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
				ai: {
					directHit_ai: true,
					skillTagFilter(player, tag, arg) {
						if (!arg || !arg.card || !arg.target || arg.card.name != "sha" || arg.target.countCards("h", "shan") > 1 || get.distance(player, arg.target) > 1) {
							return false;
						}
					},
				},
			},
		},
	},

	// gz_lvbu
	gz_wushuang: {
		audio: "wushuang",
		audioname2: {
			gz_lvlingqi: "wushuang_lvlingqi",
		},
		locked: true,
		group: ["wushuang1", "wushuang2"],
		preHidden: ["wushuang1", "wushuang2", "gz_wushuang"],
		trigger: { player: "useCard1" },
		filter(event, player) {
			if (event.card.name != "juedou" || !event.card.isCard) {
				return false;
			}
			if (event.targets) {
				if (
					game.hasPlayer(function (current) {
						return !event.targets.includes(current) && lib.filter.targetEnabled2(event.card, player, current);
					})
				) {
					return true;
				}
			}
			return false;
		},
		async cost(event, trigger, player) {
			const num = game.countPlayer(current => !trigger.targets.includes(current) && lib.filter.targetEnabled2(trigger.card, player, current));

			event.result = await player
				.chooseTarget("无双：是否为" + get.translation(trigger.card) + "增加" + (num > 1 ? "至多两个" : "一个") + "目标？", [1, Math.min(2, num)], (card, player, target) => {
					const trigger = get.event().getTrigger();
					const cardx = trigger.card;
					return !trigger.targets.includes(target) && lib.filter.targetEnabled2(cardx, player, target);
				})
				.set("ai", target => {
					const player = get.event().player;
					const card = get.event().getTrigger().card;
					return get.effect(target, card, player, player);
				})
				.setHiddenSkill("gzwushuang")
				.forResult();

			if (event.result.bool && player != game.me && !player.isOnline()) {
				await game.delayx();
			}
		},
		logTarget: "targets",
		async content(event, trigger, player) {
			const targets = event.targets.sortBySeat();
			trigger.targets.addArray(targets);
		},
	},

	// gz_yuanshao
	gz_luanji: {
		audio: "luanji",
		enable: "phaseUse",
		viewAs: {
			name: "wanjian",
		},
		filterCard(card, player) {
			if (!player.storage.gz_luanji) {
				return true;
			}
			return !player.storage.gz_luanji.includes(get.suit(card));
		},
		selectCard: 2,
		position: "hs",
		filter(event, player) {
			return (
				player.countCards("hs", function (card) {
					return !player.storage.gz_luanji || !player.storage.gz_luanji.includes(get.suit(card));
				}) > 1
			);
		},
		check(card) {
			const player = get.player();
			const targets = game.filterPlayer(current => player.canUse("wanjian", current) ?? false);
			let num = 0;
			for (let i = 0; i < targets.length; i++) {
				let eff = get.sgn(get.effect(targets[i], { name: "wanjian" }, player, player));
				if (targets[i].hp == 1) {
					eff *= 1.5;
				}
				num += eff;
			}
			if (!player.needsToDiscard(-1)) {
				if (targets.length >= 7) {
					if (num < 2) {
						return 0;
					}
				} else if (targets.length >= 5) {
					if (num < 1.5) {
						return 0;
					}
				}
			}
			return 6 - get.value(card);
		},
		group: ["gz_luanji_count", "gz_luanji_reset", "gz_luanji_respond"],
		subSkill: {
			reset: {
				trigger: {
					player: "phaseAfter",
				},
				silent: true,
				filter(event, player) {
					return player.storage.gz_luanji ? true : false;
				},
				async content(event, trigger, player) {
					delete player.storage.gz_luanji;
				},
				sub: true,
				forced: true,
				popup: false,
			},
			count: {
				trigger: {
					player: "useCard",
				},
				silent: true,
				filter(event) {
					return event.skill == "gz_luanji";
				},
				async content(event, trigger, player) {
					if (!player.storage.gz_luanji) {
						player.storage.gz_luanji = [];
					}
					for (let i = 0; i < trigger.cards.length; i++) {
						player.storage.gz_luanji.add(get.suit(trigger.cards[i]));
					}
				},
				sub: true,
				forced: true,
				popup: false,
			},
			respond: {
				trigger: {
					global: "respond",
				},
				silent: true,
				filter(event) {
					if (event.player.isUnseen()) {
						return false;
					}
					// @ts-expect-error 类型系统未来可期
					return event.getParent(2).skill == "gz_luanji" && event.player.isFriendOf(_status.currentPhase);
				},
				async content(event, trigger, player) {
					await trigger.player.draw();
				},
				sub: true,
				forced: true,
				popup: false,
			},
		},
	},

	// gz_yanwen
	gz_shuangxiong: {
		audio: "shuangxiong",
		subfrequent: ["tiandu"],
		group: ["gz_shuangxiong_effect", "gz_shuangxiong_tiandu"],
		subSkill: {
			effect: {
				audio: "shuangxiong1",
				inherit: "shuangxiong1",
				async content(event, trigger, player) {
					player.judge().set("callback", get.info("gz_shuangxiong").subSkill?.effect.callback);
					trigger.changeToZero();
				},
				async callback(event, trigger, player) {
					player.addTempSkill("shuangxiong2");
					player.markAuto("shuangxiong2", [event.judgeResult.color]);
				},
			},
			tiandu: {
				audio: "shuangxiong",
				inherit: "tiandu",
				filter(event, player) {
					// @ts-expect-error 类型系统未来可期
					return _status.currentPhase == player && get.info("tiandu").filter(event, player);
				},
			},
		},
	},

	// gz_jiaxu
	/** @type {Skill} */
	gz_weimu: {
		audio: "weimu",
		trigger: {
			target: "useCardToTarget",
			player: "addJudgeBefore",
		},
		forced: true,
		priority: 15,
		preHidden: true,
		check(event, player) {
			return event.name == "addJudge" || (event.card.name != "chiling" && get.effect(event.target, event.card, event.player, player) < 0);
		},
		filter(event, player) {
			if (event.name == "addJudge") {
				return get.color(event.card) == "black";
			}
			return get.type(event.card, null, false) == "trick" && get.color(event.card) == "black";
		},
		async content(event, trigger, player) {
			if (trigger.name == "addJudge") {
				trigger.cancel(undefined, undefined, undefined);
				const owner = get.owner(trigger.card);
				if (owner?.getCards("hej").includes(trigger.card)) {
					await owner.lose(trigger.card, ui.discardPile);
				} else {
					await game.cardsDiscard(trigger.card);
				}
				game.log(trigger.card, "进入了弃牌堆");
			} else {
				// @ts-expect-error 类型系统未来可期
				trigger.getParent()?.targets.remove(player);
			}
		},
		ai: {
			effect: {
				target(card, player, target, current) {
					if (get.type(card, "trick") == "trick" && get.color(card) == "black") {
						return "zeroplayertarget";
					}
				},
			},
		},
	},

	// gz_caiwenji
	/** @type {Skill} */
	gz_duanchang: {
		audio: "duanchang",
		trigger: {
			player: "die",
		},
		forced: true,
		forceDie: true,
		filter(event, player) {
			return event.source && event.source.isIn() && event.source != player && (event.source.hasMainCharacter() || event.source.hasViceCharacter());
		},
		logTarget: "source",
		async content(event, trigger, player) {
			const main = trigger.source.hasMainCharacter();
			const vice = trigger.source.hasViceCharacter();

			/** @type {Partial<Result>} */
			let result;
			if (!vice) {
				result = { control: "主将" };
			} else if (!main) {
				result = { control: "副将" };
			} else {
				result = await player
					// @ts-expect-error 类型系统未来可期
					.chooseControl("主将", "副将", () => get.event().choice)
					.set("prompt", "令" + get.translation(trigger.source) + "失去一张武将牌的所有技能")
					.set("forceDie", true)
					.set(
						"choice",
						(() => {
							let rank = get.guozhanRank(trigger.source.name1, trigger.source) - get.guozhanRank(trigger.source.name2, trigger.source);
							if (rank == 0) {
								rank = Math.random() > 0.5 ? 1 : -1;
							}
							return rank * get.attitude(player, trigger.source) > 0 ? "副将" : "主将";
						})()
					)
					.forResult();
			}

			let skills;
			if (result.control == "主将") {
				trigger.source.showCharacter(0);
				broadcastAll(player => {
					player.node.avatar.classList.add("disabled");
				}, trigger.source);
				skills = lib.character[trigger.source.name][3];
				game.log(trigger.source, "失去了主将技能");
			} else {
				trigger.source.showCharacter(1);
				broadcastAll(player => {
					player.node.avatar2.classList.add("disabled");
				}, trigger.source);
				skills = lib.character[trigger.source.name2][3];
				game.log(trigger.source, "失去了副将技能");
			}
			const list = [];
			for (let i = 0; i < skills.length; i++) {
				list.add(skills[i]);
				const info = lib.skill[skills[i]];
				if (info.charlotte) {
					list.splice(i--);
					continue;
				}
				if (typeof info.derivation == "string") {
					list.add(info.derivation);
				} else if (Array.isArray(info.derivation)) {
					list.addArray(info.derivation);
				}
			}
			trigger.source.removeSkill(list);
			trigger.source.syncSkills();
			player.line(trigger.source, "green");
		},
		ai: {
			threaten(player, target) {
				if (target.hp == 1) {
					return 0.2;
				}
				return 1.5;
			},
			effect: {
				target(card, player, target, current) {
					if (!target.hasFriend()) {
						return;
					}
					if (target.hp <= 1 && get.tag(card, "damage")) {
						return [1, 0, 0, -2];
					}
				},
			},
		},
	},

	// gz_kongrong
	/** @type {Skill} */
	gz_mingshi: {
		audio: "mingshi",
		trigger: { player: "damageBegin3" },
		forced: true,
		preHidden: true,
		filter(event, player) {
			return event.num > 0 && event.source && event.source.isUnseen(2);
		},
		async content(event, trigger, player) {
			trigger.num--;
		},
		ai: {
			effect: {
				target(card, player, target) {
					if (player.hasSkillTag("jueqing", false, target)) {
						return;
					}
					if (!player.isUnseen(2)) {
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

	// gz_tianfeng
	gz_suishi: {
		audio: "suishi",
		locked: true,
		forced: true,
		preHidden: ["gz_suishi_draw", "gz_suishi_lose"],
		group: ["gz_suishi_draw", "gz_suishi_lose"],
		/** @type {Record<string, Skill>} */
		subSkill: {
			draw: {
				audio: "suishi1.mp3",
				trigger: {
					global: "dying",
				},
				forced: true,
				filter(event, player) {
					return event.player != player && event.parent?.name == "damage" && event.parent.source && event.parent.source.isFriendOf(player);
				},
				async content(_event, _trigger, player) {
					await player.draw();
				},
			},
			lose: {
				audio: "suishi2.mp3",
				trigger: {
					global: "dieAfter",
				},
				check() {
					return false;
				},
				forced: true,
				filter(event, player) {
					return event.player.isFriendOf(player);
				},
				async content(_event, _trigger, player) {
					const result = player.countDiscardableCards(player, "h") ? await player.chooseBool("随势：弃置所有手牌，或点取消失去1点体力").forResult() : { bool: false };
					if (result.bool) {
						await player.modedDiscard(player.getCards("h"));
					} else {
						await player.loseHp();
					}
				},
			},
		},
	},

	// gz_panfeng
	/** @type {Skill} */
	gz_kuangfu: {
		audio: "kuangfu",
		trigger: {
			player: "useCardToPlayered",
		},
		preHidden: true,
		logTarget: "target",
		filter(event, player) {
			return event.card.name == "sha" && player.isPhaseUsing() && !player.hasSkill("gz_kuangfu_extra") && event.target.countGainableCards(player, "e") > 0;
		},
		check(event, player) {
			if (
				get.attitude(player, event.target) > 0 ||
				!event.target.hasCard(function (card) {
					return lib.filter.canBeGained(card, player, event.target) && get.value(card, event.target) > 0;
				}, "e")
			) {
				return false;
			}
			return true;
		},
		async content(event, trigger, player) {
			// @ts-expect-error 类型系统未来可期
			trigger.getParent()._gz_kuangfued = true;
			await player.gainPlayerCard(trigger.target, "e", true);
			player.addTempSkill("gz_kuangfu_extra", "phaseUseAfter");
		},
		subSkill: {
			extra: {
				trigger: { player: "useCardAfter" },
				charlotte: true,
				forced: true,
				filter(event, player) {
					return (
						// @ts-expect-error 类型系统未来可期
						event._gz_kuangfued && !player.hasHistory("sourceDamage", evt => evt.card && event.card) && player.countCards("h") > 0
					);
				},
				async content(event, trigger, player) {
					await player.chooseToDiscard("h", 2, true);
				},
			},
		},
	},

	// gz_zoushi
	/** @type {Skill} */
	gz_huoshui: {
		audio: 2,
		forced: true,
		global: "gz_huoshui_mingzhi",
		trigger: { player: "useCardToTargeted" },
		preHidden: true,
		filter(event, player) {
			return (event.card.name == "sha" || event.card.name == "wanjian") && event.target.isUnseen(2) && event.target.isEnemyOf(player);
		},
		logTarget: "target",
		async content(event, trigger, player) {
			const target = trigger.target;
			target.addTempSkill("gz_huoshui_norespond");
			target.markAuto("gz_huoshui_norespond", [trigger.card]);
		},

		subSkill: {
			norespond: {
				charlotte: true,
				trigger: { global: "useCardEnd" },
				onremove: true,
				forced: true,
				popup: false,
				silent: true,
				firstDo: true,
				filter(event, player) {
					return player.getStorage("gz_huoshui_norespond").includes(event.card);
				},
				async content(event, trigger, player) {
					player.unmarkAuto("gz_huoshui_norespond", [trigger.card]);
					if (!player.storage.gz_huoshui_norespond.length) {
						player.removeSkill("gz_huoshui_norespond");
					}
				},
				mod: {
					cardEnabled(card) {
						if (card.name == "shan") {
							return false;
						}
					},
					cardRespondable(card) {
						if (card.name == "shan") {
							return false;
						}
					},
				},
			},
			mingzhi: {
				ai: {
					nomingzhi: true,
					skillTagFilter(player) {
						// @ts-expect-error 类型系统未来可期
						if (_status.currentPhase && _status.currentPhase != player && _status.currentPhase.hasSkill("gz_huoshui")) {
							return true;
						}
						return false;
					},
				},
			},
		},
	},
	/** @type {Skill} */
	qingcheng: {
		audio: 2,

		subSkill: {
			ai: {
				ai: {
					effect: {
						target(card) {
							if (get.tag(card, "damage")) {
								return 2;
							}
						},
					},
				},
			},
		},
	},
	/** @type {Skill} */
	gz_qingcheng: {
		audio: "qingcheng",
		enable: "phaseUse",
		filter(event, player) {
			return (
				player.countCards("he", { color: "black" }) > 0 &&
				game.hasPlayer(function (current) {
					return current != player && !current.isUnseen(2);
				})
			);
		},
		filterCard: {
			color: "black",
		},
		position: "he",
		filterTarget(card, player, target) {
			if (target == player) {
				return false;
			}
			return !target.isUnseen(2);
		},
		check(card) {
			return 6 - get.value(card, get.event().player);
		},
		async content(event, trigger, player) {
			await chooseToHide(event.target);

			if (get.type(event.cards[0]) != "equip") {
				return;
			}

			const result = await player
				.chooseTarget("是否暗置一名武将牌均为明置的角色的一张武将牌？", (card, player, target) => {
					return target != player && !target.isUnseen(2);
				})
				.set("ai", target => {
					return -get.attitude(_status.event.player, target);
				})
				.forResult();

			if (result.bool && result.targets && result.targets.length) {
				player.line(result.targets[0], "green");
				await chooseToHide(result.targets[0]);
			}

			return;

			/**
			 * @param {PlayerGuozhan} target
			 */
			async function chooseToHide(target) {
				/** @type {Partial<Result>} */
				let result;

				if (get.is.jun(target)) {
					result = { control: "副将" };
				} else {
					let choice = "主将";
					const skills = lib.character[target.name2][3];
					for (var i = 0; i < skills.length; i++) {
						var info = get.info(skills[i]);
						if (info && info.ai && info.ai.maixie) {
							choice = "副将";
							break;
						}
					}
					if (get.character(target.name, 3).includes("buqu")) {
						choice = "主将";
					} else if (get.character(target.name2, 3).includes("buqu")) {
						choice = "副将";
					}
					result = await player
						.chooseControl("主将", "副将", () => {
							// @ts-expect-error 类型系统未来可期
							return _status.event.choice;
						})
						.set("prompt", "暗置" + get.translation(event.target) + "的一张武将牌")
						.set("choice", choice)
						.forResult();
				}

				if (result.control == "主将") {
					target.hideCharacter(0);
				} else {
					target.hideCharacter(1);
				}
				target.addTempSkill("qingcheng_ai");
			}
		},
		ai: {
			order: 8,
			result: {
				target(player, target) {
					if (target.hp <= 0) {
						return -5;
					}
					if (player.getStat().skill.gz_qingcheng) {
						return 0;
					}
					if (!target.hasSkillTag("maixie")) {
						return 0;
					}
					if (get.attitude(player, target) >= 0) {
						return 0;
					}
					if (
						player.hasCard(function (card) {
							// ?????
							return get.tag(card, "damage") && player.canUse(card, target, true, true);
						}, undefined)
					) {
						if (target.maxHp > 3) {
							return -0.5;
						}
						return -1;
					}
					return 0;
				},
			},
		},
	},
};
