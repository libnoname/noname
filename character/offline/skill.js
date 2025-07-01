import { lib, game, ui, get, ai, _status } from "../../noname.js";

/** @type { importCharacterConfig['skill'] } */
const skills = {
	//渭南风云
	//曹操
	wn_dingluan: {
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return game.hasPlayer(current => current != player);
		},
		filterTarget: lib.filter.notMe,
		async content(event, trigger, player) {
			await player.loseHp();
			const card = new lib.element.VCard({ name: "dajunyajing" }),
				target = event.target;
			const result = player.canUse(card, target)
				? await target
						.chooseControl()
						.set("choiceList", [`令${get.translation(player)}视为对你使用一张【大军压境】`, "令你武将牌上的所有技能失效直到你下个回合结束"])
						.set("prompt", "定乱：请选择一项")
						.set("ai", () => {
							const player = get.player(),
								targets = game.countPlayer(current => current != player && get.attitude(player, current) < 0);
							if (targets.length >= player.hp) {
								return 1;
							}
							return Math.random() > 0.7 ? 1 : 0;
						})
						.forResult()
				: {
						index: 1,
				  };
			if (result.index == 0) {
				await player.useCard(card, target);
			} else {
				target.addTempSkill("wn_dingluan_blocker", { player: "phaseAfter" });
			}
		},
		ai: {
			order: 7,
			result: {
				target(player, target) {
					if (player.hp <= 2) {
						return 0;
					}
					return -4;
				},
			},
		},
		subSkill: {
			blocker: {
				init(player, skill) {
					player.addSkillBlocker(skill);
				},
				onremove(player, skill) {
					player.removeSkillBlocker(skill);
				},
				charlotte: true,
				locked: true,
				skillBlocker(skill, player) {
					let skills = player.getStockSkills(true, true);
					let info = get.info(skill);
					return info && !info.charlotte && !info.persevereSkill && skills.includes(skill);
				},
				mark: true,
				marktext: '<span style="text-decoration: line-through;">乱</span>',
				intro: {
					content(list, player, skill) {
						let storage = player.getSkills(null, false, false).filter(function (i) {
							return lib.skill.wn_dingluan_blocker.skillBlocker(i, player);
						});
						if (storage.length) {
							return "失效技能：" + get.translation(storage);
						}
						return "无失效技能";
					},
				},
			},
		},
	},
	wn_zhuijiang: {
		trigger: {
			global: "die",
		},
		filter(event, player) {
			return player.hasZhuSkill("wn_zhuijiang") && game.hasPlayer(current => current.group == "wei");
		},
		zhuSkill: true,
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt2(event.skill, trigger.player), (card, player, target) => {
					return target.group == "wei";
				})
				.set("ai", () => Math.random())
				.forResult();
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			game.broadcastAll(
				(target1, target2) => {
					game.swapSeat(target1, target2);
				},
				target,
				trigger.player
			);
		},
	},
	//韩遂
	wn_jubing: {
		trigger: {
			global: "damageEnd",
		},
		usable: 1,
		filter(event, player) {
			if (!event.player?.isIn()) {
				return false;
			}
			return game.hasPlayer(current => {
				return current.group == "qun" && current.countCards("he") && current.inRange(event.player);
			});
		},
		logTarget: "player",
		prompt2(event, player) {
			const targets = game.filterPlayer(current => {
				return current.group == "qun" && current.countCards("he") && current.inRange(event.player);
			});
			return `弃置${get.translation(targets)}${targets.length > 1 ? "各" : ""}一张牌，视为对其使用等量张【杀】`;
		},
		check(event, player) {
			let eff = 0;
			game.filterPlayer(current => {
				if (current.group != "qun" || !current.countCards("he") || !current.inRange(event.player)) {
					return false;
				}
				eff += get.effect(current, { name: "guohe_copy2" }, player, player);
				const card = new lib.element.VCard({ name: "sha" });
				if (player.canUse(card, event.player, false)) {
					eff += get.effect(event.player, card, player, player);
				}
			});
			return eff > 0;
		},
		async content(event, trigger, player) {
			const targets = game
				.filterPlayer(current => {
					return current.group == "qun" && current.countCards("he") && current.inRange(trigger.player);
				})
				.sortBySeat(_status.currentPhase);
			for (let target of targets) {
				player.line(target, "green");
				await player.discardPlayerCard(target, "he", true);
			}
			let num = 0;
			for (let target of targets) {
				num += target
					.getHistory("lose", evt => {
						return evt.type == "discard" && evt.getParent(3) == event && evt?.cards?.length;
					})
					.reduce((sum, evt) => sum + evt.cards.length, 0);
			}
			while (num > 0) {
				num--;
				const card = new lib.element.VCard({ name: "sha" });
				if (player.canUse(card, trigger.player, false)) {
					await player.useCard(card, trigger.player);
				} else {
					break;
				}
			}
		},
	},
	wn_xiongju: {
		trigger: {
			global: ["phaseBefore", "changeGroupAfter"],
			player: "enterGame",
		},
		zhuSkill: true,
		filter(event, player) {
			return player.hasZhuSkill("wn_xiongju") && lib.skill.wn_xiongju.logTarget(event, player)?.length;
		},
		logTarget(event, player) {
			if (event.name == "changeGroup") {
				if ([event.originGroup, event.group].includes(player.group)) {
					return [event.player];
				}
				return [];
			}
			return game.filterPlayer(current => {
				return current.group == player.group;
			});
		},
		onremove(player, skill) {
			let skillName = `${skill}_${player.playerid}`;
			for (let target of game.players) {
				if (target?.additionalSkills?.[skillName]?.length) {
					target.removeAdditionalSkill(skillName);
				}
			}
		},
		firstDo: true,
		silent: true,
		async content(event, trigger, player) {
			let skillName = `${event.name}_${player.playerid}`;
			for (let target of event.targets) {
				if (target.group == player.group) {
					target.addAdditionalSkill(skillName, ["mashu"], true);
				} else {
					target.removeAdditionalSkill(skillName);
				}
			}
		},
		derivation: ["mashu"],
	},
	wn_zhongtao: {
		trigger: {
			global: "useCardAfter",
		},
		filter(event, player) {
			if (!event.player.isIn() || get.distance(player, event.player) > 1) {
				return false;
			}
			return (
				event.card.name == "sha" &&
				event.targets?.some(i => {
					const card = new lib.element.VCard({ name: "sha" });
					return i.isIn() && player.canUse(card, i, false);
				}) &&
				player.countCards("hes")
			);
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseCardTarget({
					prompt: get.prompt2(event.skill, trigger.targets),
					filterCard(card, player) {
						const targets = get.event("targetx"),
							cardx = new lib.element.VCard({ name: "sha", cards: [card] }, [card]);
						return targets.some(target => player.canUse(cardx, target, false));
					},
					targetx: trigger.targets,
					selectTarget: -1,
					position: "hes",
					filterTarget(card, player, target) {
						const cards = ui.selected.cards,
							targets = get.event("targetx"),
							cardx = new lib.element.VCard({ name: "sha", cards: cards }, cards);
						return player.canUse(cardx, target, false) && targets.includes(target);
					},
					ai1(card) {
						const { targetx: targets, player } = get.event(),
							cardx = new lib.element.VCard({ name: "sha", cards: [card] }, [card]);
						let num = 0;
						targets.filter(target => {
							if (!player.canUse(cardx, target, false)) {
								return false;
							}
							num += get.sgn(get.effect(target, cardx, player, player));
						});
						if (num <= 0) {
							return 0;
						}
						return 7 - get.value(card);
					},
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const { cards, targets } = event;
			const card = new lib.element.VCard({ name: "sha", cards: cards }, cards);
			await player.useCard(card, cards, targets, false);
		},
	},
	wn_dutan: {
		enable: "phaseUse",
		viewAs: {
			name: "juedou",
			isCard: true,
		},
		usable: 1,
		filterCard: () => false,
		selectCard: -1,
		selectTarget: [1, Infinity],
	},
	wn_qifeng: {
		trigger: { global: "phaseEnd" },
		filter(event, player) {
			if (!player.getHistory("lose").length) {
				return false;
			}
			const card = new lib.element.VCard({ name: "sha" });
			return player.canUse(card, event.player, false);
		},
		check(event, player) {
			const card = new lib.element.VCard({ name: "sha" });
			return get.effect(event.player, card, player, player) > 0;
		},
		logTarget: "player",
		async content(event, trigger, player) {
			const card = new lib.element.VCard({ name: "sha" });
			const next = player.useCard(card, trigger.player);
			next.oncard = () => {
				let num = get
					.player()
					.getHistory("lose", evt => {
						return evt?.cards2?.length;
					})
					.reduce((sum, evt) => sum + evt.cards2.length, 0);
				get.event().baseDamage = num;
			};
			await next;
		},
	},
	//君霸天下
	//君刘备
	jun_renwang: {
		audio: "rerende",
		enable: "phaseUse",
		filterCard: true,
		selectCard: [2, Infinity],
		position: "he",
		discard: false,
		lose: false,
		delay: 0,
		filterTarget(card, player, target) {
			return player != target;
		},
		check(card) {
			if (ui.selected.cards.length > 1) {
				return 0;
			}
			const bool = ui.selected.cards?.some(cardx => cardx.name == "du");
			if (bool && card.name == "du") {
				return 20;
			}
			return 10 - get.value(card);
		},
		async content(event, trigger, player) {
			await player.give(event.cards, event.target);
			await player.recover();
			player.addTempSkill("jun_renwang_effect");
			player.addMark("jun_renwang_effect", 1, false);
		},
		ai: {
			order(skill, player) {
				if (player.hp < player.maxHp && player.countCards("h") > 1) {
					return 10;
				}
				return 1;
			},
			result: {
				target(player, target) {
					if (target.hasSkillTag("nogain")) {
						return 0;
					}
					if (ui.selected.cards.length && ui.selected.cards[0].name == "du") {
						return target.hasSkillTag("nodu") ? 0 : -10;
					}
					if (target.hasJudge("lebu")) {
						return 0;
					}
					const nh = target.countCards("h");
					const np = player.countCards("h");
					if (player.hp == player.maxHp || player.countCards("h") <= 1) {
						if (nh >= np - 1 && np <= player.hp && !target.hasSkill("haoshi")) {
							return 0;
						}
					}
					return Math.max(1, 5 - nh);
				},
			},
			effect: {
				target_use(card, player, target) {
					if (player == target && get.type(card) == "equip") {
						if (player.countCards("e", { subtype: get.subtype(card) })) {
							const players = game.filterPlayer();
							for (let i = 0; i < players.length; i++) {
								if (players[i] != player && get.attitude(player, players[i]) > 0) {
									return 0;
								}
							}
						}
					}
				},
			},
			threaten: 0.8,
		},
		subSkill: {
			effect: {
				onremove: true,
				charlotte: true,
				marktext: "武",
				intro: {
					content: "出杀次数+#",
				},
				mod: {
					cardUsable(card, player, num) {
						if (card.name == "sha") {
							return num + player.countMark("jun_renwang_effect");
						}
					},
				},
			},
		},
	},
	//君曹操
	jun_xiongtu: {
		audio: "sbjianxiong",
		trigger: {
			player: "changeHpAfter",
		},
		frequent: true,
		async content(event, trigger, player) {
			const list = [];
			for (let positon of ["c", "d", "ej"]) {
				const card = get.cardPile(
					card => {
						return get.tag(card, "damage") && positon.includes(get.position(card, true));
					},
					"field",
					"random"
				);
				if (card) {
					if (positon == "ej") {
						const owner = get.owner(card);
						if (owner) {
							player.line(owner, "green");
							owner.$give(card, player, false);
							await game.delayx();
						}
					}
					list.push(card);
				}
			}
			const cards = Array.from(ui.ordering.childNodes)
				.slice(0)
				.filter(card => {
					return card && get.tag(card, "damage") && get.position(card, true) == "o";
				});
			if (cards.length) {
				list.push(cards.randomGet());
			}
			if (list.length) {
				await player.gain(list, "gain2");
			}
		},
	},
	//君孙策
	jun_jiang: {
		audio: "sbjiang",
		trigger: {
			player: "useCard",
		},
		filter(event, player) {
			return get.color(event.card) == "red";
		},
		frequent: true,
		async content(event, trigger, player) {
			await player.draw();
		},
	},
	jun_zhiyang: {
		audio: ["yingyang1.mp3", "yingyang2.mp3"],
		trigger: {
			player: "damageEnd",
		},
		filter(event, player) {
			return event.source?.canCompare(player);
		},
		logTarget: "source",
		async content(event, trigger, player) {
			await trigger.source.useSkill("zhiba_global", [player]);
			await trigger.source.useSkill("zhiba_global", [player]);
		},
		derivation: ["zhiba"],
		group: "jun_zhiyang_number",
		subSkill: {
			number: {
				audio: "jun_zhiyang",
				trigger: {
					player: "compare",
					target: "compare",
				},
				filter(event, player) {
					if (event.player == player) {
						return !event.iwhile && get.color(event.card1) == "red";
					} else {
						return get.color(event.card2) == "red";
					}
				},
				forced: true,
				locked: false,
				content() {
					game.log(player, "拼点牌点数视为", "#yK");
					if (player == trigger.player) {
						trigger.num1 = 13;
					} else {
						trigger.num2 = 13;
					}
				},
			},
		},
	},
	//君袁绍
	jun_hefa: {
		audio: "olsbhetao",
		enable: "phaseUse",
		usable: 1,
		viewAs: {
			name: "sha",
			storage: {
				hefa: true,
			},
		},
		viewAsFilter(player) {
			return player.countCards("hs") > 0;
		},
		selectCard() {
			return [1, Infinity];
		},
		selectTarget() {
			let card = get.card(),
				player = get.player();
			if (card == undefined) {
				return;
			}
			let range = [1, Math.max(1, ui.selected.cards.length)];
			game.checkMod(card, player, range, "selectTarget", player);
			return range;
		},
		complexCard: true,
		filterCard: true,
		filterOk() {
			if (!ui.selected.targets.length) {
				return false;
			}
			var card = get.card(),
				player = get.player();
			if (card == undefined) {
				return;
			}
			var range = [1, Math.max(1, ui.selected.cards.length)];
			game.checkMod(card, player, range, "selectTarget", player);
			if ((range[0] <= ui.selected.targets.length && range[1] >= ui.selected.targets.length) || range[0] == -1) {
				return true;
			}
			return false;
		},
		check(card) {
			let player = _status.event.player,
				cardx = get.autoViewAs({ name: "sha" }, ui.selected.cards.concat(card));
			if (
				game.countPlayer(function (current) {
					return (_status.event.filterTarget || lib.filter.filterTarget)(cardx, player, current) && get.effect_use(current, cardx, player, player) > 0;
				}) <= ui.selected.cards.length
			) {
				return 0;
			}
			return 7 - get.value(card);
		},
		position: "hs",
		onuse(links, player) {
			_status.event.addCount = false;
		},
		ai: {
			order: () => get.order({ name: "sha" }) - 0.1,
		},
		locked: false,
		group: "jun_hefa_draw",
		subSkill: {
			draw: {
				trigger: {
					source: "damageSource",
				},
				filter(event, player) {
					return event?.card?.storage?.hefa && player.countCards("h") < player.maxHp;
				},
				forced: true,
				locked: false,
				async content(event, trigger, player) {
					await player.drawTo(player.maxHp);
				},
			},
		},
		mod: {
			cardUsable(card, player, num) {
				if (card.storage?.hefa) {
					return Infinity;
				}
			},
			targetInRange(card, player, num) {
				if (card.storage?.hefa) {
					return true;
				}
			},
		},
	},
	//君张角
	jun_huanlei: {
		audio: "xinleiji",
		trigger: {
			player: ["judgeEnd", "useCardAfter", "respondAfter"],
		},
		disableReason: ["暴虐", "助祭", "弘仪", "孤影", "唤雷"],
		filter(event, player) {
			if (!game.hasPlayer(current => current != player)) {
				return false;
			}
			if (event.name == "judge") {
				return !lib.skill.xinleiji_misa.disableReason.includes(event.judgestr);
			}
			return ["shan", "shandian"].includes(event.card.name);
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt2(event.skill), lib.filter.notMe)
				.set("ai", target => {
					const player = get.player();
					if (target.hasSkill("hongyan")) {
						return 1;
					}
					return get.damageEffect(target, player, player, "thunder");
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const [target] = event.targets;
			const next = target.judge(card => {
				if (get.suit(card) == "spade") {
					return -4;
				}
				return -1;
			});
			const { result } = await next;
			if (result?.suit == "spade") {
				await target.damage(2, "thunder");
			} else if (target.countCards("h")) {
				await player.gainPlayerCard(target, "h", true);
			}
		},
		ai: {
			mingzhi: false,
			useShan: true,
			effect: {
				target_use(card, player, target, current) {
					if (
						get.tag(card, "respondShan") &&
						!player.hasSkillTag(
							"directHit_ai",
							true,
							{
								target: target,
								card: card,
							},
							true
						) &&
						game.hasPlayer(function (current) {
							return get.attitude(target, current) < 0 && get.damageEffect(current, target, target, "thunder") > 0;
						})
					) {
						if (card.name === "sha") {
							if (!target.mayHaveShan(player, "use")) {
								return;
							}
						} else if (!target.mayHaveShan(player)) {
							return 1 - 0.1 * Math.min(5, target.countCards("hs"));
						}
						if (!target.hasSkillTag("rejudge")) {
							return [1, 1];
						}
						let pos = player.hasSkillTag("viewHandcard", null, target, true) ? "hes" : "e";
						if (
							target.hasCard(function (cardx) {
								return get.suit(cardx) === "spade";
							}, pos)
						) {
							return [1, 4];
						}
						if (pos === "e") {
							return [1, Math.min(4, 1 + 0.75 * Math.max(1, target.countCards("hs")))];
						}
						return [1, 1];
					}
				},
			},
		},
	},
	jun_xiandao: {
		audio: "xinguidao",
		mod: {
			aiOrder(player, card, num) {
				if (num > 0 && get.itemtype(card) == "card" && get.color(card) == "black" && get.type(card) == "equip") {
					num * 1.35;
				}
			},
			aiValue(player, card, num) {
				if (num > 0 && get.itemtype(card) == "card" && get.color(card) == "black") {
					return num * 1.15;
				}
			},
			aiUseful(player, card, num) {
				if (num > 0 && get.itemtype(card) == "card" && get.color(card) == "black") {
					return num * 1.35;
				}
			},
		},
		locked: false,
		trigger: {
			global: "judge",
		},
		filter(event, player) {
			return player.countCards("hes", { color: "black" }) > 0;
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseCard(get.translation(trigger.player) + "的" + (trigger.judgestr || "") + "判定为" + get.translation(trigger.player.judging[0]) + "，" + get.prompt("xinguidao"), "hes", function (card) {
					if (get.color(card) != "black") {
						return false;
					}
					let player = _status.event.player;
					let mod2 = game.checkMod(card, player, "unchanged", "cardEnabled2", player);
					if (mod2 != "unchanged") {
						return mod2;
					}
					let mod = game.checkMod(card, player, "unchanged", "cardRespondable", player);
					if (mod != "unchanged") {
						return mod;
					}
					return true;
				})
				.set("ai", function (card) {
					let trigger = _status.event.getTrigger();
					let player = _status.event.player;
					let judging = _status.event.judging;
					let result = trigger.judge(card) - trigger.judge(judging);
					let attitude = get.attitude(player, trigger.player);
					if (attitude == 0 || result == 0) {
						if (trigger.player != player) {
							return 0;
						}
						if (
							game.hasPlayer(function (current) {
								return get.attitude(player, current) < 0;
							})
						) {
							var checkx = lib.skill.xinleiji.judgeCheck(card, true) - lib.skill.xinleiji.judgeCheck(judging);
							if (checkx > 0) {
								return checkx;
							}
						}
						return 0;
					}
					let val = get.value(card);
					if (get.subtype(card) == "equip2") {
						val /= 2;
					} else {
						val /= 7;
					}
					if (attitude == 0 || result == 0) {
						return 0;
					}
					if (attitude > 0) {
						return result - val;
					}
					return -result - val;
				})
				.set("judging", trigger.player.judging[0])
				.forResult();
		},
		async content(event, trigger, player) {
			await player.respond(event.cards, "highlight", event.name, "noOrdering");
			player.$gain2(trigger.player.judging[0]);
			await player.gain(trigger.player.judging[0]);
			await player.draw("nodelay");
			trigger.player.judging[0] = event.cards[0];
			trigger.orderingCards.addArray(event.cards);
			game.log(trigger.player, "的判定牌改为", event.cards[0]);
			await game.delay(2);
		},
		ai: {
			rejudge: true,
			tag: {
				rejudge: 1,
			},
		},
	},
	//君曹丕
	jun_cuanzun: {
		audio: "sbxingshang",
		trigger: {
			global: "die",
		},
		frequent(event) {
			return !event.player.countCards("he", "du");
		},
		logTarget: "player",
		filter(event, player) {
			if (event.player == player) {
				return false;
			}
			return player.isDamaged() || event.player.countCards("he") > 0;
		},
		async content(event, trigger, player) {
			const cards = trigger.player.getCards("he");
			if (cards.length) {
				await player.gain(cards, trigger.player, "giveAuto", "bySelf");
			}
			if (player.isDamaged()) {
				await player.recover();
			}
		},
	},
	jun_liufang: {
		audio: "sbfangzhu",
		enable: "phaseUse",
		trigger: {
			player: "damageEnd",
		},
		filter(event, player) {
			if (!game.hasPlayer(current => current != player)) {
				return false;
			}
			return event.name == "damage" || !player.hasSkill("jun_liufang_used");
		},
		async cost(event, trigger, player) {
			const draw = player.getDamagedHp();
			event.result = await player
				.chooseTarget(get.prompt(event.skill), "令一名其他角色翻面" + (draw > 0 ? "并摸" + get.cnNumber(draw) + "张牌" : ""), function (card, player, target) {
					return player != target;
				})
				.setHiddenSkill(event.skill)
				.set("ai", target => {
					if (target.hasSkillTag("noturn")) {
						return 0;
					}
					const player = _status.event.player;
					const current = _status.currentPhase;
					const dis = current ? get.distance(current, target, "absolute") : 1;
					const draw = player.getDamagedHp();
					const att = get.attitude(player, target);
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
				})
				.forResult();
		},
		filterTarget: lib.filter.notMe,
		async content(event, trigger, player) {
			if (trigger?.name != "damage") {
				player.addTempSkill("jun_liufang_used", "phaseChange");
			}
			const target = event.targets[0],
				num = player.getDamagedHp();
			if (num > 0) {
				await target.draw(num);
			}
			await target.turnOver();
			if (num > 1) {
				await target.executeDelayCardEffect("shandian");
			}
		},
		ai: {
			order: 2,
			result: {
				target(player, target) {
					if (target.isTurnedOver()) {
						return 5;
					}
					return -3;
				},
			},
		},
		subSkill: {
			used: {
				charlotte: true,
			},
		},
	},
	//君刘禅
	jun_fuxiang: {
		audio: "refangquan",
		trigger: {
			player: "phaseUseBefore",
		},
		filter(event, player) {
			return game.hasPlayer(current => current != player);
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt2(event.skill), lib.filter.notMe)
				.set("ai", target => {
					const player = get.player();
					if (target.hasJudge("lebu") || get.attitude(player, target) <= 4) {
						return 0;
					}
					return get.threaten(target) / Math.sqrt(target.hp + 1) / Math.sqrt(target.countCards("h") + 1) > 0;
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			trigger.cancel();
			player
				.when("phaseDiscardAfter")
				.filter(evt => evt.getParent() == trigger.getParent())
				.step(async (event, trigger, player) => {
					const cards = [];
					game.getGlobalHistory("cardMove", evt => {
						if (evt.getParent("phaseDiscard") != trigger) {
							return false;
						}
						if (evt.name == "lose" && (evt.type != "discard" || evt.position != ui.discardPile)) {
							return false;
						}
						cards.addArray(evt.cards.filterInD("d"));
					});
					if (cards.length) {
						player.logSkill("jun_fuxiang", [target]);
						await target.gain(cards, "gain2");
					}
				});
			target.insertPhase();
		},
	},
	jun_leling: {
		audio: "xiangle_re_liushan",
		trigger: {
			target: "useCardToTarget",
		},
		forced: true,
		preHidden: true,
		logTarget: "player",
		filter(event, player) {
			return event.card.name == "sha" || get.type(event.card) == "delay";
		},
		async content(event, trigger, player) {
			const eff = get.effect(player, trigger.card, trigger.player, trigger.player),
				type = get.type2(trigger.card);
			const { result } =
				trigger.player == player
					? {
							bool: false,
					  }
					: await trigger.player
							.chooseToGive(player, `乐陵：交给${get.translation(player)}一张${get.translation(type)}手牌，否则此牌对其无效`, card => {
								return get.type2(card) == get.event("cardType");
							})
							.set("ai", card => {
								if (get.event("eff") > 0) {
									return 10 - get.value(card);
								}
								return 0;
							})
							.set("cardType", type)
							.set("eff", eff);
			if (!result?.bool) {
				trigger.getParent().excluded.add(player);
			}
		},
		ai: {
			effect: {
				target(card, player, target, current) {
					if ((card.name == "sha" || get.type(card) == "delay") && get.attitude(player, target) < 0) {
						if (_status.event.name == "jun_leling") {
							return;
						}
						if (get.attitude(player, target) > 0 && current < 0) {
							return "zerotarget";
						}
						const bs = player.getCards("h", { type: get.type2(card) });
						bs.remove(card);
						if (card.cards) {
							bs.removeArray(card.cards);
						} else {
							bs.removeArray(ui.selected.cards);
						}
						if (!bs.length) {
							return "zerotarget";
						}
						if (player.hasSkill("jiu") || player.hasSkill("tianxianjiu")) {
							return;
						}
						if (bs.length <= 2) {
							for (let i = 0; i < bs.length; i++) {
								if (get.value(bs[i]) < 7) {
									return [1, 0.5, 1, -0.5];
								}
							}
							return [1, 0, 0.3, 0];
						}
						return [1, 0.5, 1, -0.5];
					}
				},
			},
		},
	},
	//君孙权
	jun_henglv: {
		audio: "rezhiheng",
		enable: "phaseUse",
		filter(event, player) {
			return player.countCards("h");
		},
		filterCard: true,
		selectCard: [1, Infinity],
		lose: false,
		discard: false,
		check(card) {
			let player = _status.event.player;
			if (get.position(card) == "e") {
				let subs = get.subtypes(card);
				if (subs.includes("equip2") || subs.includes("equip3")) {
					return player.getHp() - get.value(card);
				}
			}
			return 6 - get.value(card);
		},
		async content(event, trigger, player) {
			const num = (player.getStat("skill")[event.name] || 1) - 1;
			if (num > 0) {
				await player.loseHp(num);
			}
			event.cards = event.cards.filterInD("h");
			await player.discard(event.cards);
			let cards = event.cards.filter(card => card.name == "tao");
			while (cards.length) {
				const { result } =
					cards.length > 1
						? await player.chooseButtonTarget({
								createDialog: [`衡虑：是否分配弃置的【桃】？`, cards],
								selectButton: [1, Infinity],
								cardsx: cards,
								filterTarget: true,
								ai1(button) {
									return get.value(button.link);
								},
								ai2(target) {
									const player = get.player();
									const card = ui.selected.buttons[0].link;
									if (card) {
										let eff = get.value(card, target) * get.attitude(player, target);
										if (player.hasSkill("jiuyuan") && target != player) {
											eff *= 2;
										}
										return eff;
									}
									return 1;
								},
						  })
						: await player
								.chooseTarget(`衡虑：是否令一名角色获得${get.translation(cards)}？`)
								.set("ai", target => {
									const { player, cardx: card } = get.event();
									let eff = get.value(card, target) * get.attitude(player, target);
									if (player.hasSkill("jiuyuan") && target != player) {
										eff *= 2;
									}
									return eff;
								})
								.set("cardx", cards[0]);
				if (result?.bool) {
					if (!result?.links?.length) {
						result.links = cards.slice(0);
					}
					cards.removeArray(result.links);
					player.line(result.targets, "green");
					const gainEvent = result.targets[0].gain(result.links, "gain2");
					gainEvent.giver = player;
					await gainEvent;
				} else {
					break;
				}
			}
			await player.draw(event.cards.length + num);
		},
		ai: {
			order: 1,
			result: {
				player(player, target) {
					const num = player.getStat("jun_henglv") || 0;
					if (num >= 1 || (player.hp < 2 && !player.countCards("hs", "tao"))) {
						return 0;
					}
					return 1;
				},
			},
		},
	},
	//君刘协
	jun_tianze: {
		audio: "tianming",
		trigger: {
			target: "useCardToTargeted",
		},
		check(event, player) {
			let cards = player.getCards("h");
			if (cards.length <= 2) {
				for (let i = 0; i < cards.length; i++) {
					if (cards[i].name == "shan" || cards[i].name == "tao") {
						return false;
					}
				}
			}
			return true;
		},
		filter(event, player) {
			return event.card.name == "sha";
		},
		async cost(event, trigger, player) {
			const num = Math.min(2, player.countCards("he"));
			let bool = true;
			if (num <= 2 && player.getCards("he").some(card => ["shan", "tao"].includes(card.name))) {
				bool = false;
			}
			event.result =
				num > 0
					? await player
							.chooseToDiscard(get.prompt2(event.skill), num, "he")
							.set("boolx", bool)
							.set("ai", card => {
								if (get.event("boolx")) {
									return 11 - get.value(card);
								}
								return 0;
							})
							.set("chooseonly", true)
							.forResult()
					: await player.chooseBool(get.prompt2(event.skill)).forResult();
		},
		async content(event, trigger, player) {
			if (event?.cards?.length) {
				await player.discard(event.cards);
			}
			const cards = get.cards(4, true);
			const result = await player
				.chooseButton(["天择：获得其中两张", cards], 2, true)
				.set("ai", button => {
					return get.buttonValue(button);
				})
				.forResult();
			if (result.bool) {
				await player.gain(result.links, "draw");
			}
			const targets = game.filterPlayer(current => {
				if (current == player) {
					return false;
				}
				return current.isMaxHandcard() || current.isMaxHp();
			});
			if (!targets.length) {
				return;
			}
			const result2 =
				targets.length > 1
					? await player
							.chooseTarget("令一名手牌数或体力值最大的其他角色执行【天择】", true, (card, player, target) => {
								if (target == player) {
									return false;
								}
								return target.isMaxHandcard() || target.isMaxHp();
							})
							.set("ai", target => {
								const player = get.player();
								return get.attitude(player, target);
							})
							.forResult()
					: {
							bool: true,
							targets: targets,
					  };
			if (result2.bool) {
				const target = result2.targets[0];
				player.line(target, "green");
				if (target.countCards("he")) {
					await target.chooseToDiscard(2, "he", true);
				}
				const cards2 = get.cards(4, true);
				const result3 = await target
					.chooseButton(["天择：获得其中两张", cards2], 2, true)
					.set("ai", button => {
						return get.buttonValue(button);
					})
					.forResult();
				if (result3.bool) {
					await target.gain(result3.links, "draw");
				}
			}
		},
		ai: {
			effect: {
				target_use(card, player, target, current) {
					if (card.name == "sha") {
						return [1, 0.5];
					}
				},
			},
		},
	},
	jun_zhaoshou: {
		audio: "mizhao",
		enable: "phaseUse",
		filter(event, player) {
			return player.countCards("h") > 0;
		},
		filterCard: true,
		selectCard: -1,
		filterTarget(card, player, target) {
			return player != target;
		},
		discard: false,
		lose: false,
		delay: false,
		ai: {
			order: 1,
			result: {
				player: 0,
				target(player, target) {
					if (target.hasSkillTag("nogain")) {
						return 0;
					}
					if (player.countCards("h") > 1) {
						return 1;
					}
					var players = game.filterPlayer();
					for (var i = 0; i < players.length; i++) {
						if (players[i].countCards("h") && players[i] != target && players[i] != player && get.attitude(player, players[i]) < 0) {
							break;
						}
					}
					if (i == players.length) {
						return 1;
					}
					return -2 / (target.countCards("h") + 1);
				},
			},
		},
		async content(event, trigger, player) {
			const target = event.targets[0],
				cards = event.cards;
			await player.give(cards, target, false);
			if (!target.countCards("h")) {
				return;
			}
			if (!game.hasPlayer(current => target.canCompare(current) && current != player)) {
				return;
			}
			const result = await player
				.chooseTarget(true, "选择拼点目标", (card, player, target) => {
					return get.event("targetx").canCompare(target) && target != player;
				})
				.set("ai", target => {
					const { player, targetx } = get.event();
					let eff = get.effect(target, { name: "sha" }, targetx, player),
						att = get.attitude(player, target);
					if (att > 0) {
						return eff - 10;
					}
					return eff;
				})
				.set("targetx", target)
				.set("forceDie", true)
				.forResult();
			if (!result.bool || !result?.targets?.length) {
				return;
			}
			const targetx = result.targets[0];
			target.line(targetx, "green");
			const { result: result2 } = await target.chooseToCompare(targetx);
			if (!result2.tie) {
				const user = result2.bool ? target : targetx;
				const card = new lib.element.VCard({ name: "sha" });
				if (user.hasUseTarget(card, false)) {
					await user.chooseUseTarget(card, "nodistance", false, true);
				}
			}
		},
	},
	jun_gezhi: {
		audio: "twgezhi",
		trigger: {
			player: "useCard",
		},
		filter(event, player) {
			return (
				player
					.getCards("he")
					.map(card => get.type2(card))
					.toUniqued().length > 2
			);
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseCard(get.prompt2(event.skill), 3, "he")
				.set("filterCard", (card, player) => {
					if (!lib.filter.cardRecastable(card, player)) {
						return false;
					}
					return !ui.selected.cards?.some(cardx => get.type2(cardx) == get.type2(card));
				})
				.set("complexCard", true)
				.set("ai", card => {
					return 9 - get.value(card);
				})
				.forResult();
		},
		async content(event, trigger, player) {
			await player.recast(event.cards);
			const result = await player
				.chooseButtonTarget({
					createDialog: [
						"革制：请选择一项",
						[
							[
								["recover", "回复1点体力"],
								["limit", "使用下一张牌无次数限制"],
								["damage", "对一名其他角色造成1点伤害"],
							],
							"textbutton",
						],
					],
					filterButton(button) {
						const { player, targetx: targets } = get.event();
						if (button.link == "recover") {
							return player.isDamaged();
						}
						if (button.link == "damage") {
							return game.hasPlayer(current => player != current && !targets.includes(current));
						}
						return true;
					},
					filterTarget(card, player, target) {
						if (ui.selected.buttons[0]?.link != "damage") {
							return false;
						}
						const { targetx: targets } = get.event();
						return target != player && !targets.includes(target);
					},
					forced: true,
					complexSelect: true,
					complexTarget: true,
					selectTarget() {
						if (ui.selected.buttons[0]?.link != "damage") {
							return -1;
						}
						return 1;
					},
					ai1(button) {
						const { player, targetx: targets } = get.event();
						if (button.link == "recover") {
							return get.recoverEffect(player, player, player);
						}
						if (button.link == "damage") {
							const target = game
								.filterPlayer(current => {
									return player != current && !targets.includes(current);
								})
								.maxBy(current => get.damageEffect(current, player, player));
							return get.damageEffect(target, player, player);
						}
						return 1;
					},
					ai2(target) {
						const player = get.player();
						return get.damageEffect(target, player, player);
					},
				})
				.set("targetx", player.getStorage("jun_gezhi_used"))
				.forResult();
			if (result?.bool) {
				if (result.links[0] == "recover") {
					await player.recover();
				}
				if (result.links[0] == "limit") {
					player.addSkill("jun_gezhi_unlimit");
				}
				if (result.links[0] == "damage") {
					player.addSkill("jun_gezhi_used");
					player.markAuto("jun_gezhi_used", result.targets);
					player.line(result.targets, "green");
					await result.targets[0].damage();
				}
			}
		},
		onremove(player) {
			player.removeSkill("jun_gezhi_used");
		},
		subSkill: {
			unlimit: {
				charlotte: true,
				mod: {
					cardUsable: () => Infinity,
				},
				trigger: {
					player: "useCard1",
				},
				forced: true,
				popup: false,
				firstDo: true,
				async content(event, trigger, player) {
					player.removeSkill(event.name);
					const { card } = trigger;
					if (trigger.addCount !== false) {
						trigger.addCount = false;
						player.getStat("card")[card.name]--;
					}
				},
				mark: true,
				intro: {
					content: "使用的下一张牌无任何次数限制",
				},
			},
			used: {
				charlotte: true,
				onremove: true,
				intro: {
					content: "已对$造成过伤害",
				},
			},
		},
	},
	jun_julian: {
		audio: "jsrgjulian",
		trigger: {
			player: "phaseJieshuBegin",
		},
		zhuSkill: true,
		filter(event, player, name, target) {
			return player.hasZhuSkill("jun_julian") && target.isIn();
		},
		getIndex(event, player) {
			return game.filterPlayer(current => current != player && current.group == "qun");
		},
		async cost(event, trigger, player) {
			const target = event.indexedData;
			event.result = await target.chooseBool(get.prompt2(event.skill, target, player)).forResult();
			event.result.targets = [target];
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			await target.draw(2);
			if (target.countCards("he")) {
				await player.gainPlayerCard(target, "he", true);
			}
		},
	},
	//曲阿小将
	peyingzhen: {
		trigger: {
			global: "phaseBefore",
			player: "enterGame",
		},
		filter(event, player) {
			if (!game.countPlayer(current => current != player)) {
				return false;
			}
			return event.name != "phase" || game.phaseNumber == 0;
		},
		async cost(event, trigger, player) {
			const targets = game.filterPlayer(current => current != player);
			event.result =
				targets.length > 1
					? await player
							.chooseTarget(
								get.prompt2(event.skill),
								(card, player, target) => {
									if (target == player) {
										return false;
									}
									if (ui.selected.targets.length) {
										const targetx = ui.selected.targets[0];
										return target == targetx.getPrevious() || target == targetx.getNext();
									}
									return true;
								},
								true,
								2
							)
							.set("targetprompt", ["执行回合", "交换位置"])
							.set("complexTarget", true)
							.set("ai", target => {
								const att = get.attitude(get.player(), target);
								if (ui.selected.targets.length) {
									return -att;
								}
								return att;
							})
							.forResult()
					: {
							bool: true,
							targets: targets,
					  };
		},
		async content(event, trigger, player) {
			const targets = event.targets;
			if (targets.length > 1) {
				game.broadcastAll(
					function (target1, target2) {
						game.swapSeat(target1, target2);
					},
					player,
					targets[1]
				);
			}
			await game.delay(3);
			const evt = player.insertPhase();
			evt.pushHandler("onPhase", (event, option) => {
				if (event.step === 0 && option.state === "begin") {
					event.step = 1;
				}
			});
			targets[0].insertPhase();
			if (trigger.name == "phase" && !trigger._finished) {
				let first = game.findPlayer(current => current.getSeatNum() == 1) || trigger.player;
				trigger.finish();
				trigger._triggered = 5;
				const evtx = first.insertPhase();
				delete evtx.skill;
				const evt2 = trigger.getParent();
				if (evt2.name == "phaseLoop" && evt2._isStandardLoop) {
					evt2.player = first;
				}
			}
		},
	},
	peyuanjue: {
		trigger: {
			player: "phaseDrawBefore",
		},
		zhuanhuanji: true,
		mark: true,
		marktext: "☯",
		intro: {
			content(storage, player, skill) {
				if (storage) {
					return "所有角色的基本牌视为无次数限制的【杀】";
				} else if (storage === false) {
					return "所有角色与你互相计算距离为1，你视为拥有〖同忾〗";
				}
				return get.skillInfoTranslation(skill, player);
			},
		},
		async content(event, trigger, player) {
			trigger.cancel();
			player.changeZhuanhuanji(event.name);
			if (player.getStorage(event.name, false)) {
				player.removeAdditionalSkill(event.name);
			} else {
				player.addAdditionalSkill(event.name, ["petongkai"]);
			}
		},
		locked: false,
		mod: {
			globalFrom(from, to) {
				if (from.storage.peyuanjue === false) {
					return -Infinity;
				}
			},
			globalTo(from, to) {
				if (to.storage.peyuanjue === false) {
					return -Infinity;
				}
			},
		},
		global: "peyuanjue_viewas",
		derivation: "petongkai",
		subSkill: {
			viewas: {
				mod: {
					cardname(card, player) {
						if (
							game.hasPlayer(current => {
								return current.hasSkill("peyuanjue") && current.getStorage("peyuanjue") === true;
							}) &&
							lib.card[card.name]?.type == "basic"
						) {
							return "sha";
						}
					},
					cardUsable(card, player) {
						if (
							!game.hasPlayer(current => {
								return current.hasSkill("peyuanjue") && current.getStorage("peyuanjue") === true;
							}) ||
							card.name != "sha"
						) {
							return;
						}
						if (!card.cards || card.cards.length != 1) {
							return;
						}
						if (get.suit(card) == "unsure" || lib.card[card.cards[0].name]?.type == "basic") {
							return Infinity;
						}
					},
				},
			},
		},
	},
	peaoyong: {
		trigger: {
			player: "gainAfter",
			global: "loseAsyncAfter",
		},
		persevereSkill: true,
		filter(event, player) {
			return !event.getParent("peaoyong", true) && event.getg(player)?.length;
		},
		async cost(event, trigger, player) {
			const result = await player
				.chooseControl(["选项一", "选项二", "选项三", "背水！", "cancel2"])
				.set("choiceList", ["选项一：摸一张牌", "选项二：回复1点体力", "选项三：使用一张牌", "背水，减少1点体力上限"])
				.set("displayIndex", false)
				.set("ai", () => {
					return get.player().hp <= 2 ? "选项二" : "选项一";
				})
				.set("prompt", get.prompt(event.skill))
				.forResult();
			event.result = {
				bool: result.index != 4,
				cost_data: result.index,
			};
		},
		async content(event, trigger, player) {
			const num = event.cost_data;
			if (num == 3) {
				player.popup("背水", "thunder");
			}
			if (num == 0 || num == 3) {
				await player.draw();
			}
			if (num == 1 || num == 3) {
				await player.recover();
			}
			if (num == 2 || num == 3) {
				await player.chooseToUse({
					filterCard(card, player, event) {
						if (get.itemtype(card) != "card") {
							return false;
						}
						return lib.filter.filterCard.apply(this, arguments);
					},
					prompt: "鏊勇：是否使用一张牌？",
					addCount: false,
				});
			}
			if (num == 3) {
				await player.loseMaxHp();
			}
		},
	},
	petongkai: {
		trigger: {
			global: "useCardToTargeted",
		},
		filter(event, player) {
			return get.tag(event.card, "damage") && get.distance(player, event.target) <= 1 && event.target.isIn();
		},
		logTarget: "target",
		async content(event, trigger, player) {
			await player.draw();
			if (trigger.target == player) {
				return;
			}
			const result = await player.chooseToGive(true, "he", trigger.target).set("visibleMove", true).forResult();
			if (!result.bool) {
				return;
			}
			await game.delay();
			const card = result.cards[0];
			if (trigger.target.getCards("h").includes(card) && get.type(card) == "equip") {
				trigger.target.chooseUseTarget(card);
			}
		},
		ai: {
			threaten: 1.1,
		},
	},
	// 曹操＆袁绍 by 刘巴
	yjguibei: {
		trigger: {
			global: "phaseBefore",
			player: "enterGame",
		},
		forced: true,
		filter(event, player) {
			return game.hasPlayer(current => current != player) && (event.name != "phase" || game.phaseNumber == 0);
		},
		async content(event, trigger, player) {
			await player.draw(4);
			let zhu = game.findPlayer(i => i.getSeatNum() == 1);
			if (zhu && zhu.getPrevious() != player) {
				game.broadcastAll(
					function (target1, target2) {
						game.swapSeat(target1, target2);
					},
					player,
					zhu.getPrevious()
				);
			}
			let newzhu = game.findPlayer(i => i.getSeatNum() == 1);
			if (trigger.name === "phase" && newzhu != zhu && !trigger._finished) {
				trigger.finish();
				trigger._triggered = 5;
				const evt = newzhu.insertPhase();
				delete evt.skill;
				const evt2 = trigger.getParent();
				if (evt2.name == "phaseLoop" && evt2._isStandardLoop) {
					evt2.player = newzhu;
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
	},
	yjjiechu: {
		mark: true,
		zhuanhuanji: true,
		marktext: "☯",
		intro: {
			content(storage, player, skill) {
				if (storage) {
					return "当你成为【杀】的目标时，你可以弃置一张手牌改变【杀】的花色和属性。";
				} else {
					return "出牌阶段，你可以视为使用一张【顺手牵羊】，结算结束后成为目标的角色可以对你使你一张【杀】。";
				}
			},
		},
		group: ["yjjiechu_use", "yjjiechu_sha"],
		subSkill: {
			sha: {
				trigger: {
					target: "useCardToTarget",
				},
				filter(event, player) {
					return player.storage?.yjjiechu && event?.card.name === "sha";
				},
				async cost(event, trigger, player) {
					let suits = [],
						bool = false;
					game.getAllGlobalHistory("everything", evt => {
						if (evt.name == "damage" && evt.player == player && evt.card) {
							suits.add(get.suit(evt.card));
						}
					});
					if (suits.includes(get.suit(trigger.card)) && player.hasSkill("yjdaojue")) {
						bool = true;
					}
					let list = lib.linked.slice(0).remove("kami");
					if (
						list.some(nature => {
							if (nature == trigger.card?.nature) {
								return false;
							}
							let card = new lib.element.VCard(trigger.card, trigger.cards, null, nature);
							return get.effect(player, card, trigger.player, player) > get.effect(player, trigger.card, trigger.player, player);
						})
					) {
						bool = true;
					}
					event.result = await player
						.chooseToDiscard(get.prompt("yjjiechu"), "chooseonly", "h")
						.set("prompt2", `你可以弃置一张手牌，改变${get.translation(trigger.card)}的花色和属性。`)
						.set("resultx", bool)
						.set("ai", card => {
							if (!get.event("resultx")) {
								return 0;
							}
							return 7 - get.value(card);
						})
						.forResult();
				},
				async content(event, trigger, player) {
					player.changeZhuanhuanji("yjjiechu");
					await player.discard(event.cards);
					const suits = lib.suit.slice(0).remove(get.suit(trigger.card)),
						natures = lib.linked.slice(0).remove("kami").remove(trigger.card.nature);
					let records = suits.slice(0);
					game.getAllGlobalHistory("everything", evt => {
						if (evt.name == "damage" && evt.player == player && evt.card) {
							records.remove(get.suit(evt.card));
						}
					});
					let nature = trigger.card.nature;
					for (let i of natures) {
						let card1 = new lib.element.VCard(trigger.card, trigger.cards, null, i),
							card2 = new lib.element.VCard(trigger.card, trigger.cards, null, nature);
						let eff1 = get.effect(player, card1, trigger.player, player),
							eff2 = get.effect(player, card2, trigger.player, player);
						if (eff1 > eff2) {
							nature = i;
						}
					}
					const result = await player
						.chooseButton(["劫出：改变此牌的花色和属性", [suits.map(i => ["", "", `lukai_${i}`]), "vcard"], [natures.map(i => [i, get.translation(i)]), "tdnodes"]], 2, true)
						.set("filterButton", button => {
							if (!ui.selected.buttons.length) {
								return true;
							}
							let bool = link => Array.isArray(link);
							return bool(button.link) != bool(ui.selected.buttons[0].link);
						})
						.set("records", records)
						.set("nature", nature)
						.set("ai", button => {
							const { records, nature } = get.event();
							if (Array.isArray(button.link)) {
								if (records.includes(button.link[2].slice(6))) {
									return 1 + Math.random();
								}
								return Math.random();
							}
							if (nature == button.link) {
								return 1 + Math.random();
							}
							return Math.random();
						})
						.forResult();
					if (!result.bool) {
						return;
					}
					if (Array.isArray(result.links[0])) {
						result.links.reverse();
					}
					const naturex = result.links[0],
						suit = result.links[1][2].slice(6);
					player.popup(get.translation(suit));
					game.log(trigger.card, "被转为了", "#y" + get.translation(suit), "花色");
					game.broadcastAll(
						(card, suit) => {
							card.suit = suit;
						},
						trigger.card,
						suit
					);
					player.popup(`${get.translation(naturex)}杀`, naturex);
					game.log(trigger.card, "被转为了", "#y" + get.translation(naturex), "属性");
					game.setNature(trigger.card, naturex);
				},
			},
			effect: {
				trigger: {
					player: "useCardAfter",
				},
				filter(event, player) {
					return event.targets.length && event?.card?.storage?.yjjiechu;
				},
				charlotte: true,
				silent: true,
				forced: true,
				locked: false,
				async content(event, trigger, player) {
					for (const c of trigger.targets.filter(c => c.isIn()).sortBySeat()) {
						await c
							.chooseToUse(function (card, player, event) {
								if (get.name(card) !== "sha") {
									return false;
								}
								return lib.filter.filterCard.apply(this, arguments);
							}, "你可对" + get.translation(player) + "使用一张杀")
							.set("targetRequired", true)
							.set("complexTarget", true)
							.set("complexSelect", true)
							.set("filterTarget", function (card, player, target) {
								const sourcex = get.event("sourcex");
								if (target !== sourcex && !ui.selected.targets.includes(sourcex)) {
									return false;
								}
								return lib.filter.filterTarget.apply(this, arguments);
							})
							.set("sourcex", player);
					}
				},
			},
			use: {
				enable: "phaseUse",
				prompt: "你可以视为使用一张【顺手牵羊】，结算结束后成为目标的角色可以对你使用一张【杀】。",
				viewAs: {
					name: "shunshou",
					storage: {
						yjjiechu: true,
					},
					isCard: true,
				},
				filterCard: () => false,
				selectCard: -1,
				viewAsFilter(player) {
					return !player.storage?.yjjiechu;
				},
				precontent() {
					player.addTempSkill("yjjiechu_effect");
					player.changeZhuanhuanji("yjjiechu");
				},
			},
		},
	},
	yjdaojue: {
		dutySkill: true,
		onremove(player, skill) {
			player.removeTip(skill);
		},
		derivation: ["yjqingzheng", "yjzhian", "feiying", "rehujia", "olsbshenli", "yjzhuni", "olsbshishou"],
		group: ["yjdaojue_effect", "yjdaojue_achieve", "yjdaojue_fail"],
		subSkill: {
			fail: {
				trigger: {
					player: "useCardAfter",
				},
				filter(event, player) {
					return player.getAllHistory("useCard", evt => evt.getParent(3).skill === "yjdaojue_effect").length === 3;
				},
				skillAnimation: true,
				animationColor: "metal",
				forced: true,
				locked: false,
				async content(event, trigger, player) {
					player.awakenSkill("yjdaojue");
					player.removeTip("yjdaojue");
					player.popup("袁绍");
					game.log(player, "使命失败");
					await player.removeSkills("yjjiechu");
					await player.changeGroup("qun");
					await player.addSkills(["olsbshenli", "yjzhuni", "olsbshishou"]);
				},
			},
			achieve: {
				trigger: {
					player: "gainAfter",
					global: "loseAsyncAfter",
				},
				skillAnimation: true,
				animationColor: "metal",
				forced: true,
				locked: false,
				filter(event, player) {
					return (
						player
							.getAllHistory("gain", evt => evt.getParent(2).skill === "yjdaojue_effect")
							.map(c => c.cards.length)
							.reduce((sum, cur) => sum + cur, 0) >= 3
					);
				},
				async content(event, trigger, player) {
					player.awakenSkill("yjdaojue");
					player.removeTip("yjdaojue");
					player.popup("曹操");
					game.log(player, "成功完成使命");
					await player.removeSkills("yjjiechu");
					await player.changeGroup("wei");
					await player.addSkills(["yjzhian", "yjqingzheng", "rehujia"]);
				},
			},
			effect: {
				audio: "yjdaojue",
				trigger: {
					player: "damageBegin4",
				},
				forced: true,
				locked: false,
				filter(event, player) {
					return (
						get.itemtype(event.cards) == "cards" &&
						game.getAllGlobalHistory(
							"everything",
							evt => {
								return evt.name == "damage" && evt.player == player && get.suit(evt?.card, player) === get.suit(event?.card, player);
							},
							event
						).length === 1
					);
				},
				async content(event, trigger, player) {
					trigger.cancel();
					player.addTip(
						"yjdaojue",
						"道抉 " +
							game
								.getAllGlobalHistory(
									"everything",
									evt => {
										return evt.name == "damage" && evt.player == player && get.suit(evt?.card, player);
									},
									trigger
								)
								.map(c => get.suit(c?.card, player))
								.unique()
								.reduce((str, i) => str + get.translation(i), "")
					);
					const card = trigger.cards.filter(c => get.position(c, true) === "o");
					if (!card.length) {
						if (player.hasUsableCard("sha", "use")) {
							await player
								.chooseToUse(
									function (card, player, event) {
										if (get.name(card) !== "sha") {
											return false;
										}
										return lib.filter.filterCard.apply(this, arguments);
									},
									"对所有角色使用一张杀",
									true
								)
								.set("targetRequired", true)
								.set("complexSelect", true)
								.set("selectTarget", -1)
								.set("filterTarget", function (card, player, target) {
									return lib.filter.targetEnabled.apply(this, arguments);
								});
							return;
						}
					}
					const result = await player
						.chooseControlList(get.prompt(event.name), ["获得" + get.translation(card), "使用一张指定所有其他角色的【杀】。"], true)
						.set("ai", () => {
							if (
								get
									.event("card")
									.map(c => get.value(c))
									.reduce((sum, cur) => sum + cur, 0) > 4
							) {
								return 0;
							} else {
								return 1;
							}
						})
						.set("card", card)
						.forResult();
					if (result.index === 0) {
						await player.gain(card, "gain2", "log");
					} else if (player.hasUsableCard("sha", "use")) {
						await player
							.chooseToUse(
								function (card, player, event) {
									if (get.name(card) !== "sha") {
										return false;
									}
									return lib.filter.filterCard.apply(this, arguments);
								},
								"对所有角色使用一张杀",
								true
							)
							.set("targetRequired", true)
							.set("complexSelect", true)
							.set("selectTarget", -1)
							.set("filterTarget", function (card, player, target) {
								return lib.filter.targetEnabled.apply(this, arguments);
							});
					}
				},
			},
		},
	},
	yjzhian: {
		audio: "twzhian",
		trigger: {
			global: "useCardAfter",
		},
		filter(event, player) {
			if (get.type(event.card) == "basic") {
				return false;
			}
			return player.isDamaged() || player.countCards("h") || !player.hasSkill("yjzhian_delete");
		},
		usable(skill, player) {
			return Math.max(1, player.getDamagedHp());
		},
		async cost(event, trigger, player) {
			const cards = trigger.cards?.filterInD("ejod") || [];
			let list = ["选项一", "选项二", "选项三", "cancel2"],
				choiceList = [`弃置一张手牌${cards.length ? `并获得${get.translation(cards)}` : ""}`, "回复1点体力，此技能本轮失效", `对${get.translation(trigger.player)}造成${get.cnNumber(Math.max(1, player.getDamagedHp()))}点伤害，获得〖飞影〗并删去此项`];
			let choice = "cancel2";
			if (player.isDamaged()) {
				if (player.hp <= 1) {
					choice = "选项二";
				}
			} else {
				list.remove("选项二");
				choiceList[1] = `<span style="opacity:0.5">${choiceList[1]}</span>`;
			}
			if (!player.countCards("h")) {
				list.remove("选项一");
				choiceList[0] = `<span style="opacity:0.5">${choiceList[0]}</span>`;
			} else {
				if (cards.length && player.hp > 1) {
					let result = 0,
						card = trigger.card,
						owner = get.owner(card);
					if (owner) {
						if (get.position(card) == "j") {
							const vcard = { name: card.viewAs || card.name, cards: [card] };
							result += get.effect(player, vcard, player, player) * get.sgn(get.attitude(player, owner));
						} else {
							result += (get.value(card, owner) - 0.01) * get.sgn(get.attitude(player, owner));
						}
					} else {
						result += cards.reduce((sum, i) => sum + get.value(i, player), 0);
					}
					result -= get.recoverEffect(player);
					if (
						result >
						player
							.getCards("h")
							.map(i => get.value(i))
							.minBy(i => i)
					) {
						choice = "选项一";
					}
				}
			}
			if (player.hasSkill("yjzhian_delete")) {
				list.remove("选项三");
				choiceList[2] = `<span style="opacity:0.5">${choiceList[2]}</span>`;
			} else if (get.damageEffect(trigger.player, player) > 0 && choice == "cancel2") {
				choice = "选项三";
			}
			const result = await player
				.chooseControl(list)
				.set("prompt", get.prompt(event.skill, trigger.player))
				.set("choiceList", choiceList)
				.set("ai", () => get.event("choice"))
				.set("choice", choice)
				.forResult();
			event.result = {
				bool: result.control != "cancel2",
				cost_data: result.control,
				targets: [trigger.player],
			};
		},
		async content(event, trigger, player) {
			switch (event.cost_data) {
				case "选项一": {
					await player.chooseToDiscard("h", true);
					await player.gain(trigger.cards.filterInD("odej"), "gain2");
					break;
				}
				case "选项二": {
					await player.recover();
					player.tempBanSkill(event.name, "roundEnd");
					break;
				}
				case "选项三": {
					player.addSkill("yjzhian_delete");
					await trigger.player.damage(Math.max(1, player.getDamagedHp()));
					await player.addSkills("feiying");
				}
			}
		},
		subSkill: {
			delete: {
				charlotte: true,
			},
		},
		derivation: "feiying",
	},
	yjqingzheng: {
		audio: "sbqingzheng",
		inherit: "mbcmqingzheng",
		async content(event, trigger, player) {
			const { chooseOneSuitCard } = get.info("mbcmqingzheng");
			const {
				targets: [target],
				cost_data: cards1,
			} = event;
			await player.showHandcards();
			await player.discard(cards1);
			if (!target.countCards("h")) {
				return;
			}
			await target.showHandcards();
			let next,
				str2 = `清正：弃置${get.translation(target)}一种花色的所有牌`;
			let ai2 = function () {
				let list = lib.suits.slice().filter(i => target.hasCard({ suit: i }, "h"));
				let getv = cards => cards.map(i => get.value(i)).reduce((p, c) => p + c, 0);
				return {
					bool: true,
					cards: target.getCards("h", {
						suit: list.sort((a, b) => {
							return getv(target.getCards("h", { suit: b })) - getv(target.getCards("h", { suit: a }));
						})[0],
					}),
				};
			};
			if (event.isMine()) {
				next = chooseOneSuitCard(player, target, true, 1, str2, ai2);
			} else if (player.isOnline()) {
				let { promise, resolve } = Promise.withResolvers();
				player.send(chooseOneSuitCard, player, target, true, 1, str2, ai2);
				player.wait(result => {
					if (result == "ai") {
						result = ai2();
					}
					resolve(result);
				});
				next = promise;
			} else {
				next = Promise.resolve(ai2());
			}
			let result = await next;
			if (!result?.cards?.length) {
				return;
			}
			const cards2 = result.cards.slice().filter(card => lib.filter.canBeDiscarded(card, player, target));
			if (cards2.length) {
				await target.discard(cards2, "notBySelf");
			}
			if (cards1.length > cards2.length) {
				await target.damage(player);
			}
		},
		persevereSkill: false,
	},
	yjzhuni: {
		inherit: "jsrgzhuni",
		async contentAfter(event, trigger, player) {
			let num = event.getParent().maxTicket;
			if (num && typeof num == "number") {
				await player.draw(num);
			}
		},
	},
	yjtuonan: {
		trigger: {
			player: "dying",
		},
		mark: true,
		skillAnimation: true,
		limited: true,
		animationColor: "orange",
		unique: true,
		async content(event, trigger, player) {
			player.awakenSkill(event.name);
			await player.recover();
			const skills = player.getSkills(null, false, false).filter(skill => {
				let info = get.info(skill);
				if (!info || info.charlotte || get.skillInfoTranslation(skill, player).length == 0) {
					return false;
				}
				let list = get.skillCategoriesOf(skill, player);
				list.removeArray(["Charlotte"]);
				return list.length;
			});
			if (!skills.length) {
				return;
			}
			const result =
				skills.length > 1
					? await player
							.chooseButton(["脱难：失去一个有标签的技能", [skills, "skill"]], true)
							.set("displayIndex", false)
							.set("ai", button => {
								const { link } = button;
								if (link == "petuonan") {
									return 2;
								}
								return 1;
							})
							.forResult()
					: { bool: true, links: skills };
			if (result?.bool && result?.links?.length) {
				await player.removeSkills(result.links);
			}
		},
	},
	//风云际会曹操
	psjuebing: {
		enable: "chooseToUse",
		filter(event, player) {
			return player.hasCard(card => get.name(card) != "sha", "hs");
		},
		viewAs: { name: "sha", storage: { psjuebing: true } },
		filterCard(card, player) {
			return get.name(card) != "sha";
		},
		position: "hs",
		prompt: "将一张非【杀】手牌当做【杀】使用",
		check(card) {
			if (get.player().hasUseTarget(card)) {
				return 1;
			}
			return 6 - get.value(card);
		},
		async precontent(event, trigger, player) {
			player.addTempSkill("psjuebing_effect");
		},
		subSkill: {
			effect: {
				getList(event, target) {
					const list = event.cards.filterInD();
					const respondEvts = target.getHistory("useCard").filter(i => i.respondTo?.[1] === event.card);
					if (respondEvts.length) {
						list.addArray(respondEvts.flatMap(evt => evt.cards.filterInD("d")));
					}
					return list;
				},
				charlotte: true,
				trigger: {
					player: ["useCardAfter", "useCardToPlayered"],
					source: "damageSource",
				},
				filter(event, player, name) {
					if (!event.card?.storage?.psjuebing) {
						return false;
					}
					if (["damageSource", "useCardToPlayered"].includes(name)) {
						return true;
					}
					if (!event.targets?.length || event.targets.length != 1) {
						return false;
					}
					const [target] = event.targets;
					const list = get.info("psjuebing_effect").getList(event, target);
					return list.some(card => [player, target].some(current => current.hasUseTarget(card)));
				},
				forced: true,
				popup: false,
				async content(event, trigger, player) {
					if (event.triggername == "damageSource") {
						const evt = trigger.getParent(2);
						if (evt.addCount !== false) {
							evt.addCount = false;
							const stat = player.getStat().card,
								name = trigger.card.name;
							if (typeof stat[name] == "number") {
								stat[name]--;
							}
							game.log(trigger.card, "不计入次数限制");
						}
					} else if (event.triggername == "useCardAfter") {
						const [target] = trigger.targets;
						let list = get.info(event.name).getList(trigger, target);
						for (const current of [player, target].sortBySeat()) {
							if (!current.isIn() || !list.length) {
								continue;
							}
							const { result } = await current
								.chooseButton(["谲兵：你可以使用其中一张牌", list])
								.set("filterButton", button => {
									const player = get.player();
									return player.hasUseTarget(button.link);
								})
								.set("ai", button => {
									const player = get.player();
									return player.getUseValue(button.link);
								});
							if (result?.links?.length) {
								list.removeArray(result.links);
								await current.chooseUseTarget(result.links[0], true, false);
							}
						}
					} else {
						const { target } = trigger;
						target.addTempSkill("psjuebing_block");
						target.markAuto("psjuebing_block", [trigger.card]);
					}
				},
			},
			block: {
				charlotte: true,
				onremove: true,
				mod: {
					cardEnabled(card, player) {
						if (!player.storage.psjuebing_block) {
							return;
						}
						const storage = player.getStorage("psjuebing_block");
						let evt = get.event();
						if (evt.name != "chooseToUse") {
							evt = evt.getParent("chooseToUse");
						}
						if (!evt?.respondTo || !storage.some(i => i.cardid == evt.respondTo[1].cardid)) {
							return;
						}
						if (
							get.number(card) !== "unsure" &&
							(!card.cards?.length ||
								card.cards?.length != 1 ||
								card.cards?.some(cardx => {
									if (get.itemtype(cardx) != "card") {
										return false;
									}
									return get.name(cardx) == "shan" || !["h", "s"].includes(get.position(cardx));
								}))
						) {
							return false;
						}
					},
				},
				trigger: {
					player: ["damageBefore", "damageCancelled", "damageZero"],
					target: ["shaMiss", "useCardToExcluded", "useCardToEnd"],
					global: ["useCardEnd"],
				},
				filter(event, player) {
					const evt = event.getParent("useCard", true, true);
					if (evt && evt.effectedCount < evt.effectCount) {
						return false;
					}
					if (!event.card || !player.storage.psjuebing_block) {
						return false;
					}
					return player.getStorage("psjuebing_block").includes(event.card);
				},
				forced: true,
				popup: false,
				firstDo: true,
				async content(event, trigger, player) {
					player.unmarkAuto(event.name, [trigger.card]);
					if (!player.getStorage(event.name).length) {
						player.removeSkill(event.name);
					}
				},
				group: "psjuebing_shan",
			},
			shan: {
				charlotte: true,
				enable: "chooseToUse",
				filter(event, player) {
					if (!player.hasCard(card => get.name(card) != "shan", "hs")) {
						return false;
					}
					return event.respondTo && player.getStorage("psjuebing_block").some(i => i.cardid == event.respondTo[1].cardid);
				},
				viewAs: { name: "shan" },
				filterCard(card, player) {
					return get.name(card) != "shan";
				},
				position: "hs",
				prompt: "将一张非【闪】手牌当做【闪】使用",
				check(card) {
					if (get.player().hasUseTarget(card)) {
						return 1;
					}
					return 6 - get.value(card);
				},
			},
		},
	},
	psfengxie: {
		enable: "phaseUse",
		filter(card, player) {
			return game.hasPlayer(current => player != current);
		},
		filterTarget: lib.filter.notMe,
		limited: true,
		skillAnimation: true,
		animationColor: "gray",
		async content(event, trigger, player) {
			player.awakenSkill(event.name);
			const { target } = event;
			for (const current of game.filterPlayer(current => target != current).sortBySeat()) {
				const cards = current.getCards("e");
				if (!current.isIn() || !cards.length) {
					continue;
				}
				player.line(current);
				const result =
					cards.length == 1
						? { bool: true, links: cards }
						: await player
								.choosePlayerCard(current, "e", true, `选择${get.translation(current)}装备区的一张牌，如果${get.translation(target)}可以装备，则其装备之，否则你获得之`)
								.set("ai", button => {
									const player = get.player();
									const { target } = get.event().getParent();
									const { link } = button;
									const att = get.attitude(player, target);
									let eff = get.effect(target, link, player, player);
									if (eff < 0) {
										if (att > 0) {
											return 0;
										} else {
											eff += 4;
										}
									}
									if (att > 0 && target.canEquip(link)) {
										eff += 4;
									}
									return eff;
								})
								.forResult();
				if (result?.bool && result?.links?.length) {
					const [card] = result.links;
					if (target.canEquip(card)) {
						const owner = get.owner(card);
						if (owner) {
							owner.$give(card, target, false);
						}
						await game.delay(0.5);
						await target.equip(card);
					} else {
						await player.gain(card, "gain2");
					}
				}
			}
			const targets = game.filterPlayer(current => current.identity == "mingzhong" && ["dongcha", "sheshen"].some(skill => current.hasSkill(skill)));
			if (targets.length) {
				for (const target of targets.sortBySeat()) {
					if (!target.isIn()) {
						continue;
					}
					const skills = ["dongcha", "sheshen"].filter(skill => target.hasSkill(skill));
					await target.removeSkills(skills);
					await player.addSkills(skills);
				}
			}
		},
		derivation: ["dongcha", "sheshen"],
		ai: {
			order(item, player) {
				const list = game.filterPlayer(current => current != player);
				const friends = list.filter(current => get.attitude(player, current) > 0);
				const enemies = list.filter(current => get.attitude(player, current) < 0);
				if (
					friends.some(current => {
						const num = enemies.filter(current2 => current2 != current && current2.hasCard(card => current.canEquip(card) || get.value(card, player) > 2, "e")).length;
						return num > 1;
					})
				) {
					return 10;
				}
				if (
					enemies.some(current => {
						const num = enemies.filter(current2 => current2 != current && current2.hasCard(card => !current.canEquip(card) || get.value(card, player) > 2, "e")).length;
						return num > 1;
					})
				) {
					return 10;
				}
				return 0;
			},
			result: {
				target(player, target) {
					const enemies = game.filterPlayer(current => current != player && get.attitude(player, current) < 0);
					const att = get.attitude(player, target);
					if (att > 0) {
						const num = enemies.filter(current => current != target && current.hasCard(card => target.canEquip(card) || get.value(card, player) > 2, "e")).length;
						return num;
					} else if (att < 0) {
						const num = enemies.filter(current => current != target && current.hasCard(card => !target.canEquip(card), "e")).length;
						return -num;
					} else {
						return 0;
					}
				},
			},
		},
	},
	//风云际会刘备
	pshuji: {
		trigger: { global: "roundStart" },
		filter(event, player) {
			return game.hasPlayer(current => {
				if (current == player) {
					return false;
				}
				return !player.inRange(current) && !current.inRange(player);
			});
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt2(event.skill), (card, player, target) => {
					if (target == player) {
						return false;
					}
					return !player.inRange(target) && !target.inRange(player);
				})
				.set("ai", target => {
					const player = get.player();
					return -get.attitude(player, target) * (1 + target.countCards("h"));
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const {
				targets: [target],
			} = event;
			if (target.countCards("h")) {
				const { result } = target.countCards("h") == 1 ? { bool: true, cards: target.getcards("h") } : await target.chooseCard(true, "h", `选择一张手牌赠予${get.translation(player)}`);
				if (result?.bool && result?.cards?.length) {
					await target.gift(result.cards, player);
				}
			}
			const effect = `${event.name}_effect`;
			player.addTempSkill(effect, "roundStart");
			target.addTempSkill(effect, "roundStart");
			player.markAuto(effect, [target]);
			target.markAuto(effect, [player]);
		},
		subSkill: {
			effect: {
				charlotte: true,
				onremove: true,
				trigger: { global: "phaseEnd" },
				filter(event, player) {
					return player.countDiscardableCards(player, "h") > 1 && game.hasPlayer(current => player.inRange(current) && player.getStorage("pshuji_effect").includes(current));
				},
				forced: true,
				popup: false,
				async content(event, trigger, player) {
					for (const target of game.filterPlayer(current => player.inRange(current) && player.getStorage(event.name).includes(current)).sortBySeat()) {
						if (!target.isIn() || player.countDiscardableCards(player, "h") < 2) {
							continue;
						}
						await player.chooseToDiscard("h", 2, true);
						await target.damage();
					}
				},
				intro: { content: "已和$陷入猜忌之中" },
			},
		},
	},
	pshoufa: {
		trigger: { source: "damageBegin1" },
		filter(event, player) {
			return player.countCards("h") < event.player.maxHp && player.getSeatNum() > event.player.getSeatNum();
		},
		usable: 1,
		async content(event, trigger, player) {
			await player.drawTo(trigger.player.maxHp);
		},
	},
	//风云际会孙权
	pszhanlun: {
		trigger: { player: "yingbian" },
		filter(event, player) {
			return event.card.name == "sha" && lib.yingbian.condition.complex.has("zhuzhan");
		},
		forced: true,
		async content(event, trigger, player) {
			const { zhuzhanresult2, result } = await lib.yingbian.condition.complex.get("zhuzhan")(trigger);
			if (result?.bool) {
				if (trigger.addCount !== false) {
					trigger.addCount = false;
					const stat = player.getStat().card,
						name = trigger.card.name;
					if (typeof stat[name] == "number") {
						stat[name]--;
					}
					game.log(trigger.card, "不计入次数限制");
				}
				player.addTempSkill(event.name + "_effect");
				player.markAuto(event.name + "_effect", [[trigger.card, zhuzhanresult2.cards[0]]]);
			}
		},
		subSkill: {
			effect: {
				charlotte: true,
				onremove: true,
				trigger: { player: "useCardAfter" },
				filter(event, player) {
					return player.getStorage("pszhanlun_effect").some(([card, cards]) => card == event.card && ["red", "black"].includes(get.color(cards)));
				},
				forced: true,
				popup: false,
				async content(event, trigger, player) {
					const card = player.getStorage(event.name).filter(list => list[0] == trigger.card)[0][1];
					if (get.color(card) == "black") {
						player.addTempSkill("pszhanlun_damage");
						player.addMark("pszhanlun_damage", 1, false);
						game.log(player, "本回合下一张【杀】造成的伤害", "#g+1");
					} else {
						const targets = game.filterPlayer(current => current.hasHistory("lose", evt => evt.getParent(2).name == "yingbianZhuzhan"));
						player.tempBanSkill("pszhanlun");
						await game.asyncDraw([player].addArray(targets).sortBySeat(), 2);
					}
				},
			},
			damage: {
				charlotte: true,
				onremove: true,
				trigger: { source: "damageBegin1" },
				filter(event, player) {
					return event.card?.name === "sha";
				},
				forced: true,
				popup: false,
				async content(event, trigger, player) {
					trigger.num += player.countMark(event.name);
					player.removeSkill(event.name);
				},
				intro: { content: "本回合下一张【杀】造成的伤害+#" },
			},
		},
	},
	psjueyi: {
		trigger: { player: "phaseUseBegin" },
		filter(event, player) {
			return player.hasCard(lib.filter.cardRecastable, "he");
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseCard("he", get.prompt2(event.skill), [1, 2], lib.filter.cardRecastable)
				.set("ai", card => {
					const { player, list } = get.event();
					if (!list.length) {
						return 6 - get.value(card);
					}
					const max = list.filter(i => i[1] == list[0][1]).map(i => i[0]);
					let val = 6;
					if (!ui.selected.cards.length) {
						if (get.suit(card) == max && player.needsToDiscard()) {
							val += 4;
						}
						if (
							player.hasSkill("pszhanlun") &&
							player.hasValueTarget({ name: "sha" }) &&
							get.name(card) != "sha" &&
							game.hasPlayer(current => {
								return current != player && get.attitude(player, current) > 0 && current.hasCard(cardx => get.suit(cardx) !== get.suit(card) && get.type(cardx) == "basic", "h");
							})
						) {
							val += 6;
						}
						return val - get.value(card);
					}
					if (get.suit(card) !== get.suit(ui.selected.cards[0])) {
						val += 2;
					}
					return val - get.value(card);
				})
				.set(
					"list",
					(() => {
						const cards = player.getCards("h"),
							map = {};
						if (!cards.length) {
							return [];
						}
						for (const card of cards) {
							const type = get.suit(card);
							if (typeof map[type] != "number") {
								map[type] = 0;
							}
							map[type]++;
						}
						const list = [];
						for (let i in map) {
							if (map[i] > 0) {
								list.push([i, map[i]]);
							}
						}
						list.sort((a, b) => b[1] - a[1]);
						return list;
					})()
				)
				.forResult();
		},
		async content(event, trigger, player) {
			const { cards } = event;
			await player.recast(cards);
			const suits = cards.map(card => get.suit(card)).toUniqued();
			for (const target of game.filterPlayer()) {
				target.addTempSkill(event.name + "_effect");
				target.markAuto(event.name + "_effect", suits);
			}
		},
		subSkill: {
			effect: {
				charlotte: true,
				onremove: true,
				mod: {
					cardDiscardable(card, player) {
						if (player.getStorage("psjueyi_effect").includes(get.suit(card))) {
							return false;
						}
					},
				},
				intro: { content: "本回合内不能弃置$的牌直到有角色进入濒死状态" },
				trigger: { global: "dying" },
				forced: true,
				popup: false,
				async content(event, trigger, player) {
					player.removeSkill(event.name);
				},
			},
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
			await player.draw(cards.length);
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
			const { result } = await player.chooseTarget(
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
			);
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
							["losehp", `失去一点体力并令${get.translation(trigger.card)}失效，然后将此牌交给一名角色并摸一张牌`],
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
			const bool = await player.chooseToCompare(event.target).forResultBool();
			if (bool) {
				const card = new lib.element.VCard({ name: "sha", nature: "stab" });
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
					const cards = event.compareMeanwhile ? event.cards : [event.card1, event.card2];
					return !cards.filterInD("od").some(card => card.name == "du");
				},
				filter(event, player) {
					if (event.compareMeanwhile) {
						return event.cards.someInD("od");
					}
					return [event.card1, event.card2].someInD("od");
				},
				prompt2(event, player) {
					const cards = event.compareMeanwhile ? event.cards : [event.card1, event.card2];
					return `获得${get.translation(cards.filterInD("od"))}`;
				},
				async content(event, trigger, player) {
					const cards = trigger.compareMeanwhile ? trigger.cards : [trigger.card1, trigger.card2];
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
		filterCard: true,
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
		async content(event, trigger, player) {
			const num = event.cards.length,
				targets = game.filterPlayer(current => current.hp < player.hp);
			if (!targets.length) {
				return;
			}
			const result =
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
			const list = [player, ...result.targets].toUniqued().sortBySeat(player),
				cardMap = [],
				nums = [];
			for (let i = 0; i < list.length; i++) {
				let { cards } = await game.cardsGotoOrdering(get.cards());
				await list[i].showCards(cards, get.translation(list[i]) + "发动了【摧袭】");
				cardMap.addArray(cards);
				nums.push(get.number(cards[0], false));
			}

			const videoId = lib.status.videoId++;
			const func = (id, cards, list, num) => {
				const dialog = ui.create.dialog(`【摧袭】：是否令你的点数+${num}？`, cards);
				const getName = function (target) {
					if (target._tempTranslate) {
						return target._tempTranslate;
					}
					let name = target.name;
					if (lib.translate[name + "_ab"]) {
						return lib.translate[name + "_ab"];
					}
					return get.translation(name);
				};
				for (let i = 0; i < list.length; i++) {
					dialog.buttons[i].node.gaintag.innerHTML = getName(list[i]);
				}
				dialog.videoId = id;
				return dialog;
			};
			if (player.isOnline2()) {
				player.send(func, videoId, cardMap, list, num);
			} else {
				func(videoId, cardMap, list, num);
			}
			const result2 = await player.chooseBool().set("dialog", get.idDialog(videoId)).forResult();
			game.broadcastAll("closeDialog", videoId);
			if (result2.bool) {
				nums[0] += num;
			}
			let max = nums.maxBy(i => i);
			for (let i = 0; i < nums.length; i++) {
				if (nums[i] < max) {
					player.line(list[i], "green");
					await list[i].damage(2);
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
			const card = new lib.element.VCard({ name: "juedou" });
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
				const card = new lib.element.VCard({ name: info[2], nature: info[3] });
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
					const card = new lib.element.VCard({ name: button.link[2], nature: button.link[3] }),
						{ player, target } = get.event();
					return target.getUseValue(card) * get.attitude(player, target);
				})
				.set("target", target)
				.forResult();
			if (result.bool) {
				const card = new lib.element.VCard({ name: result.links[0][2], nature: result.links[0][3] });
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
	//青史刘璿
	hssifen: {
		enable: "phaseUse",
		usable: 1,
		filterTarget(card, player, target) {
			return target.hasCard(cardx => target.hasUseTarget(get.autoViewAs({ name: "juedou" }, [cardx]), false, false), "hs") && target != player;
		},
		async content(event, trigger, player) {
			const { target } = event;
			if (!target.hasCard(cardx => target.hasUseTarget(get.autoViewAs({ name: "juedou" }, [cardx]), false, false), "hs")) {
				return;
			}
			const next = target.chooseToUse();
			next.set("openskilldialog", `俟奋：将任意张手牌当作【决斗】使用`);
			next.set("norestore", true);
			next.set("_backupevent", "hssifen_backup");
			next.set("custom", {
				add: {},
				replace: { window() {} },
			});
			next.backup("hssifen_backup");
			next.set("targetRequired", true);
			next.set("complexSelect", true);
			next.set("addCount", false);
			next.set("forced", true);
			const result = await next.forResult();
			await player.draw(2);
			player.addTempSkill("hssifen_viewAs", ["phaseChange", "phaseAfter", "phaseBeforeStart"]);
			player.storage.hssifen_viewAs[target.playerid] = result.cards.length;
		},
		subSkill: {
			backup: {
				filterCard(card, player) {
					return get.itemtype(card) == "card";
				},
				position: "hs",
				viewAs: {
					name: "juedou",
				},
				selectCard: [1, Infinity],
				ai1(card) {
					if (ui.selected.cards.length) {
						return 0;
					}
					return 5 - get.value(card);
				},
				log: false,
			},
			viewAs: {
				init(player, skill) {
					player.storage[skill] = {};
				},
				onremove: true,
				charlotte: true,
				enable: "phaseUse",
				viewAsFilter(player) {
					return player.countCards("hes", lib.skill.hssifen_viewAs.filterCard) > 0;
				},
				filterCard: {
					color: "red",
				},
				complexCard: true,
				selectCard() {
					const map = get.player()?.storage.hssifen_viewAs;
					if (map && Object.keys(map)?.length) {
						let maxCard = Object.keys(map).maxBy(i => map[i]),
							minCard = Object.keys(map).minBy(i => map[i]);
						if (maxCard && minCard) {
							return [map[minCard], map[maxCard]];
						}
					}
					return [1, Infinity];
				},
				prompt() {
					let str = "将指定张红色牌当决斗对【俟奋】目标使用";
					const map = get.player()?.storage.hssifen_viewAs;
					if (map) {
						let list = [];
						for (const id in map) {
							const target = game.findPlayer(current => current.playerid == id);
							if (target) {
								list.push(`${get.translation(target)}：${map[id]}`);
							}
						}
						if (list.length) {
							str += `<br><span class="text" style="font-family: yuanli">${list.join(" ")}</span>`;
						}
					}
					return str;
				},
				filterTarget(card, player, target) {
					const ids = Object.keys(player.storage.hssifen_viewAs);
					if (!ids.includes(target.playerid)) {
						return false;
					}
					if (ui.selected.cards.length != player.storage.hssifen_viewAs[target.playerid]) {
						return false;
					}
					return lib.filter.targetEnabled.apply(this, arguments);
				},
				viewAs: {
					name: "juedou",
				},
				position: "hes",
				check(card) {
					return 6 - get.value(card);
				},
				ai: {
					order: 5,
					result: { player: 1 },
				},
			},
		},
	},
	hsfunan: {
		zhuSkill: true,
		enable: ["chooseToUse", "chooseToRespond"],
		filter(event, player) {
			if (
				player.hasSkill("hsfunan_used") ||
				!player.hasZhuSkill("hsfunan") ||
				!game.hasPlayer(function (current) {
					return current != player && current.group == "shu";
				})
			) {
				return false;
			}
			return !event.hsfunan;
		},
		viewAs: { name: "sha" },
		filterCard: () => false,
		selectCard: -1,
		group: ["hsfunan_2"],
		derivation: "rejijiang",
		ai: {
			order(item, player) {
				const order = get.order({ name: "sha" });
				_status.debugger = _status.event;
				if (order <= 0) {
					return order;
				}
				const losehp = get.effect(player, { name: "losehp" }, player, player);
				if (losehp > 0) {
					return order + 0.3;
				}
				if (player.hp <= 1) {
					// 避免苦肉死
					return 0;
				}
				const draw = 2 * get.effect(player, { name: "draw" }, player, player);
				if (losehp + draw > 0) {
					// 即使不出杀收益也够了
					return order + 0.1;
				}
				const eff = player.getUseValue({ name: "sha" }, null, true);
				if (eff <= 0) {
					return 0;
				}
				const maySha = Math.max(
					...game
						.filterPlayer(current => {
							return player !== current && current.group === "shu" && get.attitude(player, current) > 0;
						})
						.map(current => {
							return current.mayHaveSha(player, _status.event?.name === "chooseToUse" ? "use" : "respond", null, "count");
						})
				);
				if (maySha < 1 && (1 - maySha) * losehp + draw < 0) {
					// 有概率出杀但不值得崩血
					return 0;
				}
				return order + 0.3;
			},
			respondSha: true,
			skillTagFilter(player) {
				if (
					!player.hasZhuSkill("hsfunan") ||
					!game.hasPlayer(function (current) {
						return current != player && current.group == "shu";
					})
				) {
					return false;
				}
			},
		},
		subSkill: {
			2: {
				trigger: { player: ["useCardBegin", "respondBegin"] },
				filter(event, player) {
					return event.skill == "hsfunan";
				},
				forced: true,
				popup: false,
				async content(event, trigger, player) {
					player.addSkill("hsfunan_used");
					const targets = game.filterPlayer(target => target != player && target.group == "shu");
					if (!targets.length) {
						return;
					}
					player.logSkill("rejijiang", targets);
					trigger.getParent().set("hsfunan", true);
					let responded = false;
					for (let target of targets.sortBySeat()) {
						const next = target.chooseToRespond("是否替" + get.translation(player) + "打出一张杀？", { name: "sha" });
						next.set("ai", function () {
							var event = _status.event;
							return get.attitude(event.player, event.source) - 2;
						});
						next.set("source", player);
						next.set("hsfunan", true);
						next.set("skillwarn", "替" + get.translation(player) + "打出一张杀");
						next.noOrdering = true;
						next.autochoose = lib.filter.autoRespondSha;
						const result = await next.forResult();
						if (result.bool) {
							trigger.card = result.card;
							trigger.cards = result.cards;
							trigger.throw = false;
							if (typeof target.ai.shown == "number" && target.ai.shown < 0.95) {
								target.ai.shown += 0.3;
								if (target.ai.shown > 0.95) {
									target.ai.shown = 0.95;
								}
							}
							responded = true;
							break;
						}
					}
					if (!responded) {
						await player.loseHp();
						await player.draw(2);
						trigger.cancel();
						trigger.getParent().goto(0);
					}
				},
			},
			used: {
				charlotte: true,
			},
		},
	},
	//青史曹奂
	hsjunwei: {
		enable: "chooseToUse",
		usable: 1,
		filterCard(card) {
			if (!ui.selected.cards.length) {
				return true;
			}
			return get.color(card) == get.color(ui.selected.cards[0]);
		},
		viewAsFilter(player) {
			return player.countCards("hes") > 1;
		},
		viewAs: {
			name: "wuxie",
			storage: {
				hsjunwei: true,
			},
		},
		selectCard: 2,
		position: "hes",
		prompt: "将一张两张颜色相同的牌当无懈可击使用",
		check(card) {
			return 8 - get.value(card);
		},
		group: ["hsjunwei_effect"],
		subSkill: {
			effect: {
				trigger: { player: "useCardToEnd" },
				filter(event, player) {
					if (event.card.name != "wuxie" || !event.card?.storage?.hsjunwei || event.getParent()._neutralized) {
						return false;
					}
					const card = event.getParent().respondTo?.[1],
						evt = event.getParent(6);
					if (!card) {
						return false;
					}
					const info = get.info(card);
					const bool1 = evt.targets && info.allowMultiple != false && !info.multitarget;
					const bool2 = game.hasPlayer(function (target) {
						return !evt.targets?.includes(target) && lib.filter.targetEnabled2(card, evt.player, target);
					});
					event.set("respondToEvent", evt);
					return bool1 && bool2;
				},
				async cost(event, trigger, player) {
					const evt = trigger.respondToEvent,
						targets = evt.targets,
						source = evt.player,
						card = evt.card;
					event.result = await player
						.chooseTarget(`###${get.prompt("hsjunwei")}###令至多两名角色也成为${get.translation(card)}的目标`, [1, 2], (card, player, target) => {
							return !get.event().targets.includes(target) && lib.filter.targetEnabled2(get.event().card, get.event().sourcex, target);
						})
						.set("targets", targets)
						.set("sourcex", source)
						.set("card", card)
						.set("ai", target => {
							return get.effect(target, get.event().card, get.event().sourcex, get.player());
						})
						.forResult();
				},
				async content(event, trigger, player) {
					const evt = trigger.respondToEvent,
						targets = event.targets.sortBySeat(evt.player);
					evt.targets.addArray(targets);
					game.log(targets, "也成为", evt.card, "的目标");
				},
			},
		},
	},
	hsmoran: {
		trigger: { player: "damageEnd" },
		forced: true,
		filter(event, player) {
			return event.num > 0;
		},
		async content(event, trigger, player) {
			const list = [1, 2, 3];
			const result = await player
				.chooseControl(list)
				.set("prompt", `默然：你选择于一至三个回合结束后（包含此回合）摸两倍所选回合数量的牌，在此期间中你的所有技能失效。`)
				.set("ai", () => Math.random())
				.forResult();
			if (result?.control) {
				const skill = event.name + "_draw",
					num = result.control;
				player.addMark(skill, num, false);
				player.storage[skill + "_num"] = num * 2;
				player.addSkill(skill);
				player.addTempSkill("baiban", { player: "dieAfter" });
			}
		},
		subSkill: {
			draw: {
				onremove(player, skill) {
					delete player.storage[skill];
					delete player.storage[skill + "_num"];
					player.removeSkill("baiban");
				},
				trigger: { global: "phaseEnd" },
				charlotte: true,
				direct: true,
				filter(event, player) {
					return player.hasMark("hsmoran_draw");
				},
				content() {
					player.removeMark(event.name, 1, false);
					if (!player.hasMark(event.name)) {
						const num = player.storage[event.name + "_num"];
						player.logSkill("hsmoran");
						player.removeSkill(event.name);
						player.draw(num);
					}
				},
				mark: true,
				intro: {
					content(storage, player, skill) {
						return `${storage}个回合结束后你摸${player.storage[skill + "_num"]}张牌`;
					},
				},
			},
		},
	},
	//青史刘协
	hsjixu: {
		enable: "phaseUse",
		filterTarget(card, player, target) {
			const storage = player.getStorage("hsjixu_used"),
				selected = ui.selected.targets;
			if (!selected.length) {
				return true;
			}
			const targets = selected.concat([target]).sortBySeat();
			return !storage.some(targetsx => targetsx.sortBySeat().every((targetx, index) => targetx == targets[index]));
		},
		selectTarget: 2,
		multiline: true,
		multitarget: true,
		complexTarget: true,
		async content(event, trigger, player) {
			const targets = event.targets.sortBySeat(),
				num1 = targets.reduce((sum, target) => (sum += target.countCards("h")), 0),
				others = game.filterPlayer().removeArray(targets);
			let goon = true;
			player.addTempSkill(event.name + "_used", ["phaseChange", "phaseAfter", "phaseBeforeStart"]);
			player.markAuto(event.name + "_used", [[...targets]]);
			if (!others.length) {
				goon = true;
			}
			if (others.length == 1 && others[0].countCards("h") <= num1) {
				goon = false;
			}
			if (others.length > 1) {
				for (let i = 0; i < others.length; i++) {
					for (let j = i + 1; j < others.length; j++) {
						if (others[i].countCards("h") + others[j].countCards("h") <= num1) {
							goon = false;
						}
					}
				}
			}
			if (!goon) {
				player.popup("杯具");
				return;
			} else {
				player.popup("洗具");
				if (_status.connectMode) {
					game.broadcastAll(() => (_status.noclearcountdown = true));
				}
				const cards = get.cards(3, true),
					map = {};
				while (cards.length) {
					const result = await player
						.chooseButtonTarget({
							createDialog: [`济恤：请选择要分配的牌和目标`, cards],
							forced: true,
							selectButton: [1, 2],
							cardsx: cards,
							targets: targets,
							map: map,
							filterTarget(card, player, target) {
								return get.event().targets.includes(target);
							},
							ai1(button) {
								const { player, map } = get.event();
								return Math.max(
									...game.filterPlayer().map(target => {
										return [...ui.selected.cards, button.link, ...(map[target.playerid] || [])].reduce((sum, card) => {
											return get.value(card, target) * get.attitude(player, target);
										}, 0);
									})
								);
							},
							ai2(target) {
								const player = get.player();
								const card = ui.selected.buttons[0].link;
								if (card) {
									return get.value(card, target) * get.attitude(player, target);
								}
								return 0;
							},
						})
						.forResult();
					if (result?.bool && result.targets?.length && result.links?.length) {
						cards.removeArray(result.links);
						const id = result.targets[0].playerid;
						if (!map[id]) {
							map[id] = [];
						}
						map[id].addArray(result.links);
					} else {
						break;
					}
					const nogain = targets.filter(target => !map[target.playerid]?.length);
					if (cards.length == 1 && nogain.length > 0) {
						map[nogain[0].playerid] = [cards.pop()];
					}
				}
				if (_status.connectMode) {
					game.broadcastAll(() => {
						delete _status.noclearcountdown;
						game.stopCountChoose();
					});
				}
				if (Object.keys(map).length) {
					const gain_list = [];
					for (const i in map) {
						const source = (_status.connectMode ? lib.playerOL : game.playerMap)[i];
						player.line(source, "green");
						gain_list.push([source, map[i]]);
						game.log(source, "获得了", map[i]);
					}
					await game
						.loseAsync({
							gain_list: gain_list,
							giver: player,
							animate: "gain2",
						})
						.setContent("gaincardMultiple");
				}
			}
		},
		ai: {
			order: 7,
			result: {
				target: 1,
			},
		},
		subSkill: {
			used: {
				charlotte: true,
				onremove: true,
				intro: {
					content(storage, player, skill) {
						let str = "已触发过的组合：";
						if (!storage.length) {
							str += "无";
						} else {
							for (const targets of storage) {
								str += `<br><li>${get.translation(targets)}`;
							}
						}
						return str;
					},
				},
			},
		},
	},
	hsyouchong: {
		enable: "chooseToUse",
		usable: 1,
		filter(event, player) {
			if (event.responded || event.hsyouchong || !game.hasPlayer(target => target.countCards("h") > player.countCards("h"))) {
				return false;
			}
			const list = get.inpileVCardList(info => {
				if (info[0] != "basic") {
					return false;
				}
				return event.filterCard(get.autoViewAs({ name: info[2], nature: info[3] }, "unsure"), player, event);
			});
			return list.length > 0;
		},
		hiddenCard(player, name) {
			if (get.type(name) == "basic" && lib.inpile.includes(name) && game.hasPlayer(target => target.countCards("h") > player.countCards("h"))) {
				return true;
			}
		},
		chooseButton: {
			dialog(event, player) {
				const list = get.inpileVCardList(info => {
					if (info[0] != "basic") {
						return false;
					}
					return event.filterCard(get.autoViewAs({ name: info[2], nature: info[3] }, "unsure"), player, event);
				});
				return ui.create.dialog("优崇", [list, "vcard"], "hidden");
			},
			filter(button, player) {
				return get.event().getParent().filterCard({ name: button.link[2], nature: button.link[3] }, player, get.event().getParent());
			},
			backup(links, player) {
				return {
					selectCard: -1,
					filterCard: () => false,
					viewAs: {
						name: links[0][2],
						nature: links[0][3],
					},
					log: false,
					async precontent(event, trigger, player) {
						if (!game.hasPlayer(target => target.countCards("h") > player.countCards("h"))) {
							return;
						}
						const skill = "hsyouchong",
							cards = event.result.cards,
							card = get.autoViewAs(event.result.card, "unsure");
						const result = await player
							.chooseTarget(`优崇：令任意名手牌数多于你的角色选择是否将三张牌当作${get.translation(card)}替你使用`, [1, Infinity], true, (card, player, target) => {
								return target.countCards("h") > player.countCards("h");
							})
							.set("ai", target => true)
							.forResult();
						if (!result?.targets) {
							return;
						}
						const targets = result.targets.sortBySeat();
						player.logSkill(skill, targets);
						let goon = false;
						for (let target of targets) {
							const resultx = await target
								.chooseCard(`优崇：是否将三张牌当作${get.translation(card)}替${get.translation(player)}使用`, 3)
								.set("ai", card => {
									if (get.event().att) {
										return 7 - get.value(card);
									}
									return 0;
								})
								.set("att", get.attitude(target, player) > 0)
								.forResult();
							if (resultx?.cards?.length) {
								target.popup("响应");
								goon = true;
								if (typeof target.ai.shown == "number" && target.ai.shown < 0.95) {
									target.ai.shown += 0.3;
									if (target.ai.shown > 0.95) {
										target.ai.shown = 0.95;
									}
								}
								event.result.cards = resultx.cards;
							}
						}
						if (!goon) {
							var evt = event.getParent();
							evt.set(skill, true);
							evt.goto(0);
							return;
						}
					},
				};
			},
			prompt(links, player) {
				const name = links[0][2];
				const nature = links[0][3];
				return "选择" + (get.translation(nature) || "") + get.translation(name) + "的目标";
			},
		},
	},
	//青史孙皓
	hsshezuo: {
		trigger: { player: "phaseZhunbeiBegin" },
		async cost(event, trigger, player) {
			const list = lib.skill[event.skill].effectList.slice(),
				controls = [1, 2, 3].map(num => "选项" + (num == 2 ? "二" : get.cnNumber(num)));
			const result = await player
				.chooseControl(controls, "cancel")
				.set("choiceList", list)
				.set("prompt", `###${get.prompt(event.skill)}###选择一项令本回合下次拼点结束后没赢的角色执行`)
				.set("ai", () => Math.random())
				.forResult();
			if (result?.control != "cancel2") {
				event.result = {
					bool: true,
					cost_data: result.index,
				};
			}
		},
		async content(event, trigger, player) {
			const index = event.cost_data;
			player.addTempSkill(event.name + "_effect");
			player.markAuto(event.name + "_effect", index);
		},
		effectList: [`依次弃置两张牌，不足则失去等量体力；`, `横置并受到1点火焰伤害`, `将所有手牌当一张普通锦囊牌使用`],
		group: ["hsshezuo_compare"],
		subSkill: {
			compare: {
				prompt: "摸一张牌与一名其他角色进行拼点",
				enable: "phaseUse",
				usable: 1,
				filter(event, player) {
					return game.hasPlayer(target => player.canCompare(target, true));
				},
				filterTarget(card, player, target) {
					return player.canCompare(target, true);
				},
				async content(event, trigger, player) {
					const target = event.target;
					await player.draw();
					if (player.canCompare(target)) {
						await player.chooseToCompare(target);
					}
				},
				ai: {
					order: 9,
					result: {
						target(player, target) {
							return -1;
						},
					},
				},
			},
			effect: {
				onremove: true,
				charlotte: true,
				forced: true,
				intro: {
					content(storage, player) {
						const list = lib.skill.hsshezuo.effectList.slice();
						let str = "下次拼点结束后没赢的角色须执行：";
						if (!storage.length) {
							str += "无";
						} else {
							storage.forEach(index => (str += `<br><li>${list[index]}`));
						}
						return str;
					},
				},
				trigger: {
					global: ["chooseToCompareAfter", "compareMultipleAfter"],
				},
				filter(event, player, name, target) {
					if (event.preserve || event.result?.cancelled) {
						return false;
					}
					if (!lib.skill.hsshezuo_effect.logTarget(event, player).length) {
						return false;
					}
					if (event.name == "compareMultiple") {
						return true;
					}
					return !event.compareMultiple;
				},
				logTarget(event, player) {
					let list = [];
					if (event.targets?.length) {
						list.addArray([event.player].concat(event.targets).filter(target => target != event.result?.winner));
					} else {
						list.addArray([event.player, event.target].filter(target => target != event.result?.winner));
					}
					return list.sortBySeat();
				},
				async content(event, trigger, player) {
					const { targets } = event,
						storage = player.getStorage(event.name);
					player.removeSkill(event.name);
					for (let target of targets) {
						if (storage.includes(0)) {
							let count = 2;
							while (target.countDiscardableCards(target, "he") && count > 0) {
								await target.chooseToDiscard("he", true);
								count--;
							}
							if (count > 0) {
								await target.loseHp(count);
							}
						}
						if (storage.includes(1)) {
							await target.link(true);
							await target.damage("fire");
						}
						if (storage.includes(2)) {
							if (!target.countCards("h")) {
								continue;
							}
							const list = get.inpileVCardList(info => info[0] == "trick"),
								hs = target.getCards("h");
							if (!list.some(info => target.hasUseTarget(get.autoViewAs({ name: info[2] }, hs), true, false))) {
								continue;
							}
							const result = await target
								.chooseButton([`设座：将所有手牌当作一张普通锦囊牌使用`, [list, "vcard"]], true)
								.set("filterButton", button => get.player().hasUseTarget(get.event().viewAs(button), true, false))
								.set("ai", button => get.player().getUseValue(get.event().viewAs(button)))
								.set("viewAs", button => get.autoViewAs({ name: button.link[2] }, get.player().getCards("h")))
								.forResult();
							if (result?.links?.length) {
								const name = result.links[0][2],
									card = get.autoViewAs({ name: name }, hs);
								await target.chooseUseTarget(card, hs, true, false);
							}
						}
					}
				},
			},
		},
	},
	//神贾诩
	zombiesangluan: {
		trigger: { player: "useCardAfter" },
		filter(event, player) {
			return get.tag(event.card, "damage") >= 0.5 && game.hasPlayer(t => t !== player);
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
				.chooseToUse(function (card, player, event) {
					if (get.name(card) !== "sha") {
						return false;
					}
					return lib.filter.filterCard.apply(this, arguments);
				}, get.translation(event.name) + "：对" + get.translation(target) + "使用一张【杀】，或失去1点体力且" + get.translation(player) + "回复1点体力")
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
					return info[0] === "basic" || info[0] === "trick";
				})
				.some(card =>
					player.hasCard(cardx => {
						if (get.type2(cardx) !== "trick") {
							return false;
						}
						return event.filterCard({ name: card[2], nature: card[3], cards: [cardx] }, player, event);
					}, "hes")
				);
		},
		chooseButton: {
			dialog(event, player) {
				const list = get.inpileVCardList(info => info[0] === "basic" || info[0] === "trick");
				return ui.create.dialog("出策", [list, "vcard"]);
			},
			filter(button, player) {
				const event = get.event().getParent();
				return player.hasCard(cardx => {
					if (get.type2(cardx) !== "trick") {
						return false;
					}
					return event.filterCard({ name: button.link[2], nature: button.link[3], cards: [cardx] }, player, event);
				}, "hes");
			},
			check(button) {
				if (get.event().getParent().type != "phase") {
					return 1;
				}
				return get.player().getUseValue({ name: button.link[2], nature: button.link[3] });
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
					viewAs: { name: links[0][2], nature: links[0][3] },
				};
			},
		},
		hiddenCard(player, name) {
			if (!lib.inpile.includes(name) || !["basic", "trick"].includes(get.type(name))) {
				return false;
			}
			return player.hasCard(card => {
				if (_status.connectMode && get.position(card) === "h") {
					return true;
				}
				return get.type2(card) === "trick";
			}, "hes");
		},
		ai: {
			fireAttack: true,
			respondSha: true,
			skillTagFilter(player, tag, arg) {
				if (arg == "respond") {
					return false;
				}
				if (player.getStat("skill").olsbweilin || !player.countCards("hes")) {
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
			if (event.reserveOut) {
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
					if (player.side) {
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
					if (!target["zombieshibian"] || get.is.playerNames(target, "zombie_zombie")) {
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
	//陈寿
	//用扑克牌打牌神将
	poker_record: {
		mark: true,
		marktext: "🃏",
		intro: {
			name: "扑克牌堆",
			markcount(storage, player) {
				const pile = _status.pokerPile,
					discarded = _status.pokerDiscarded;
				if (!pile || !discarded) {
					return 0;
				}
				return "" + (discarded.length || 0) + "/" + (pile.length || 0);
			},
			mark(dialog, storage, player) {
				const pile = _status.pokerPile,
					discarded = _status.pokerDiscarded;
				if (pile.length) {
					dialog.addText("牌堆");
					dialog.addText(`共${pile.length}张牌`);
				}
				if (discarded.length) {
					dialog.addText("弃牌堆");
					dialog.addSmall(discarded);
				}
				if (!pile.length && !discarded.length) {
					dialog.addText("空空如也");
				}
			},
		},
		charlotte: true,
	},
	hschenzhi: {
		//初始化扑克牌堆
		init(player, skill) {
			player.addSkill("poker_record");
			if (!_status.pokerPile) {
				lib.skill[skill].initPile();
			}
		},
		//初始化单张扑克
		initPoker(suit = "none", number = "none") {
			const card = game.createCard2("hschenzhi_poker", suit, number);
			game.broadcastAll(
				(card, suit) => {
					card.node.image.setBackgroundImage(`image/card/lukai_${suit}.png`);
					//处理移出游戏的部分
					card.destroyed = (card, position, player, event) => {
						//如果要移入的位置是弃牌堆，直接转移到special
						if (position == "discardPile") {
							lib.skill.hschenzhi.discard(card, true);
						}
						return false;
					};
				},
				card,
				suit
			);
			return card;
		},
		//初始化牌堆
		initPile(nocardpile) {
			const suits = lib.suit.slice().randomSort(),
				cards = [];
			if (nocardpile) {
				game.broadcastAll(() => {
					if (!_status.pokerPile) {
						_status.pokerPile = [];
					}
					if (!_status.pokerDiscarded) {
						_status.pokerDiscarded = [];
					}
				});
			} else {
				game.broadcastAll(
					(cards, suits) => {
						for (let suit of suits) {
							for (let i = 1; i < 14; i++) {
								const card = lib.skill.hschenzhi.initPoker(suit, i);
								cards.add(card);
							}
						}
						cards.randomSort();
						if (!_status.pokerPile) {
							_status.pokerPile = cards;
						}
						if (!_status.pokerDiscarded) {
							_status.pokerDiscarded = [];
						}
						game.cardsGotoSpecial(cards);
					},
					cards,
					suits
				);
			}
			lib.skill.hschenzhi.update();
		},
		//扑克牌堆洗牌
		washCard() {
			if (!_status.pokerPile || !_status.pokerDiscarded) {
				lib.skill.hschenzhi.initPile(true);
			}
			if (!_status.pokerPile.length && !_status.pokerDiscarded.length) {
				return;
			}
			const cards = _status.pokerPile.concat(_status.pokerDiscarded);
			game.broadcastAll(cards => {
				_status.pokerDiscarded = [];
				cards.randomSort();
				_status.pokerPile = cards;
			}, cards);
			lib.skill.hschenzhi.update();
		},
		//更新扑克牌堆
		update(discarded, nobroadcast) {
			if (discarded?.length) {
				game.broadcastAll(list => {
					_status.pokerDiscarded.addArray(list);
					game.log(list, "移入专属弃牌堆");
				}, discarded);
			}
			if (!nobroadcast) {
				game.filterPlayer(target => target.hasSkill("poker_record")).forEach(target => target.markSkill("poker_record"));
			}
		},
		//从扑克牌堆获得牌
		getCards(num) {
			if (typeof num != "number") {
				num = 1;
			}
			if (num <= 0) {
				return [];
			}
			const list = [];
			while (num > 0) {
				if (!_status.pokerPile.length) {
					lib.skill.hschenzhi.washCard();
				}
				if (!_status.pokerPile.length) {
					break;
				}
				game.broadcastAll(() => {
					_status.onePoker = _status.pokerPile.shift();
				});
				const cardx = _status.onePoker;
				if (!cardx) {
					break;
				}
				cardx.original = "s";
				list.push(cardx);
				num--;
			}
			//数量不够，用牌堆补一下
			if (num > 0) {
				list.addArray(get.cards(num));
			}
			delete _status.onePoker;
			lib.skill.hschenzhi.update();
			return list;
		},
		//将扑克牌放回牌堆或弃置
		discard(card, noinsert) {
			if (card.name != "hschenzhi_poker") {
				card.discard(false);
				return;
			}
			if (noinsert) {
				game.cardsGotoSpecial(card);
				//更新弃牌堆
				lib.skill.hschenzhi.update([card]);
			} else {
				ui.special.appendChild(card);
				game.broadcastAll(card => {
					_status.pokerPile.splice(get.rand(0, _status.pokerPile.length - 1), 0, card);
				}, card);
				lib.skill.hschenzhi.update();
			}
		},
		trigger: {
			player: "drawBegin",
			global: ["gameDrawBegin", "replaceHandcardsBegin"],
		},
		forced: true,
		lastDo: true,
		filter(event, player) {
			if (event.name == "draw") {
				return event.num > 0;
			}
			return true;
		},
		content() {
			if (trigger.name == "draw") {
				trigger.set("otherGetCards", lib.skill.hschenzhi.getCards);
			} else {
				if (!trigger.otherPile) {
					trigger.set("otherPile", {});
				}
				//第一个元素放获得牌相关的，第二个放弃置牌相关的
				trigger.otherPile[player.playerid] = {
					getCards: lib.skill.hschenzhi.getCards,
					discard: lib.skill.hschenzhi.discard,
				};
			}
		},
		ai: {
			sortCardByNum: true,
			combo: "hsdianmo",
		},
	},
	hsdianmo: {
		init(player, skill) {
			lib.skill[skill].initList();
		},
		initList() {
			//先用许劭评鉴那个函数初始化一下角色列表
			if (!_status.characterlist) {
				game.initCharactertList();
			}
			const characters = _status.characterlist.slice();
			//获取各个角色的技能并去重
			const skills = characters
				.map(i => get.character(i, 3))
				.flat()
				.unique();
			const list = [];
			/*for(let skill of skills){
				const info = get.info(skill);
				//去除觉醒技、隐匿技、势力技、主公技
				if (!info || info.silent || info.juexingji || info.hiddenSkill || info.groupSkill || info.zhuSkill) continue;
				//去除有联动的技能和负面技能
				if (info.ai && (info.ai.combo || info.ai.notemp || info.ai.neg)) continue;
				//筛选跟转化相关的
				const str = get.plainText(get.skillInfoTranslation(skill));
				if (!["当","当做","当作"].some(s=>str.includes(s))) continue;
				list.add(skill);
			}*/

			//展开技能
			game.expandSkills(skills, true);
			//筛选技能
			for (let skill of skills) {
				let info = get.info(skill);
				//判断是否有印牌效果
				if (info.viewAs) {
					info = info.viewAs;
					//有些viewAs是函数形式，就转成字符串了，其他的按键值对处理即可
					if (typeof info == "function") {
						const str = info?.toString();
						if (!str || str.includes("isCard: true")) {
							continue;
						}
					} else if (info.isCard === true) {
						continue;
					}
				} else if (info.chooseButton?.backup) {
					//backup基本都是函数，也要转字符串
					info = info.chooseButton?.backup;
					const str = info?.toString();
					if (!str || !str.includes("viewAs: ") || str.includes("isCard: true")) {
						continue;
					}
				} else {
					continue;
				}
				skill = get.sourceSkillFor(skill);
				info = get.info(skill);
				//去除觉醒技、隐匿技、势力技、主公技
				if (!info || info.silent || info.juexingji || info.hiddenSkill || info.groupSkill || info.zhuSkill) {
					continue;
				}
				//去除有联动的技能和负面技能
				if (info.ai && (info.ai.combo || info.ai.notemp || info.ai.neg)) {
					continue;
				}
				const str = get.plainText(get.skillInfoTranslation(skill));
				if (!["当", "当做", "当作"].some(s => str.includes(s))) {
					continue;
				}
				list.add(skill);
			}

			//最后用全局变量存储，就不需要反复执行这个函数了
			_status.viewAsSkills = list;
		},
		trigger: { player: ["phaseZhunbeiBegin", "damageEnd"] },
		filter(event, player) {
			if (event.name == "damage") {
				return player.getHistory("damage", evt => evt.num > 0).indexOf(event) == 0;
			}
			return true;
		},
		async cost(event, trigger, player) {
			if (!_status.viewAsSkills) {
				lib.skill[event.skill].initList();
			}
			const list = _status.viewAsSkills.filter(skill => !player.hasSkill(skill, null, null, false));
			if (!list.length) {
				return;
			}
			const skills = list.randomGets(2);
			const result = await player
				.chooseButton([
					get.prompt2(event.skill) + `<span class=thundertext style="font-weight:bold;">当前拥有技能：${get.translation(player.additionalSkills["hsdianmo"])}</span>`,
					[
						[
							["gain", "获得技能"],
							["replace", "替换技能"],
							["draw", "直接摸牌"],
						],
						"tdnodes",
					],
					[skills, "skill"],
				])
				.set("selectButton", () => {
					if (ui.selected.buttons.length && ui.selected.buttons[0].link == "draw") {
						return 1;
					}
					return 2;
				})
				.set("filterButton", button => {
					const actions = ["gain", "replace", "draw"],
						len = get.player().additionalSkills["hsdianmo"]?.length || 0;
					if (!ui.selected.buttons.length) {
						if (button.link == "gain") {
							return len < 4;
						}
						if (button.link == "replace") {
							return len > 0;
						}
						if (button.link == "draw") {
							return len < 4;
						}
						return false;
					}
					return ui.selected.buttons[0].link == "draw" ? false : !actions.includes(button.link);
				})
				.set("complexButton", true)
				.set("ai", button => Math.random())
				.forResult();
			if (result?.links?.length) {
				event.result = {
					bool: true,
					cost_data: result.links,
				};
			}
		},
		async content(event, trigger, player) {
			const skill = event.cost_data[1],
				action = event.cost_data[0],
				skills = player.additionalSkills[event.name]?.slice() || [];
			if (action == "replace") {
				if (!skills.length) {
					return;
				}
				const result = await player
					.chooseButton([`###点墨：请选择一个要替换的技能###${get.translation(skill)}：${get.translation(skill + "_info")}`, [skills, "skill"]], true)
					.set("ai", button => Math.random())
					.forResult();
				if (!result?.links?.length) {
					return;
				}
				const replaced = result.links[0];
				skills.remove(replaced);
			}
			if (action != "draw") {
				skills.add(skill);
				await player.addAdditionalSkills(event.name, skills);
			}
			await player.draw(4 - (player.additionalSkills[event.name]?.length || 0));
		},
	},
	hszaibi: {
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return player.countCards("he", card => player.canRecast(card)) > 1;
		},
		filterCard(card, player) {
			const selected = ui.selected.cards.slice();
			if (!selected.length) {
				return player.canRecast(card);
			}
			selected.add(card);
			const nums = selected
				.map(card => get.number(card, get.player()))
				.unique()
				.sort((a, b) => a - b);
			if (nums.length == selected.length && nums.length > 1) {
				if (nums[nums.length - 1] - nums[0] == nums.length - 1) {
					return player.canRecast(card);
				}
			}
			return false;
		},
		position: "he",
		selectCard: [2, Infinity],
		complexCard: true,
		lose: false,
		discard: false,
		delay: false,
		async content(event, trigger, player) {
			const cards = event.cards;
			await player.recast(cards);
			const card = game.createCard2("chunqiubi", "heart", 5);
			if (player.canEquip(card, true)) {
				await player.equip(card);
			}
		},
		ai: {
			order: 7,
			result: {
				player: 1,
			},
		},
	},
	chunqiubi_skill: {
		enable: "phaseUse",
		usable: 1,
		prompts: ["起：失去1点体力", "承：摸已损失体力值张牌", "转：回复1点体力", "合：弃置已损失体力值张手牌"],
		async content(event, trigger, player) {
			let funcs = [
					async target => {
						await target.loseHp();
					},
					async target => {
						if (!target.getDamagedHp()) {
							return;
						}
						await target.draw(target.getDamagedHp());
					},
					async target => {
						if (!target.isDamaged()) {
							return;
						}
						await target.recover();
					},
					async target => {
						if (!target.countDiscardableCards(target, "he") || !target.isDamaged()) {
							return;
						}
						await target.chooseToDiscard("he", target.getDamagedHp(), true);
					},
				],
				prompts = lib.skill.chunqiubi_skill.prompts.slice();
			const selected = prompts.randomGet(),
				char = selected.slice(0, 1),
				index = prompts.indexOf(selected);
			prompts = prompts.slice(index, 4).concat(prompts.slice(0, index));
			funcs = funcs.slice(index, 4).concat(funcs.slice(0, index));
			game.log(player, "抽中了", "#y" + char);
			const result = await player
				.chooseButtonTarget({
					createDialog: [
						`###春秋笔：令一名角色正序或逆序执行以下项（上面为正序。下面为逆序）###${prompts.join("<br>")}<br><br>${[prompts[0]].concat(prompts.slice(1, 4).reverse()).join("<br>")}`,
						[
							[
								["forward", "正序"],
								["reverse", "逆序"],
							],
							"tdnodes",
						],
					],
					forced: true,
					filterButton: true,
					filterTarget: true,
					ai1(button) {},
					ai2(target) {},
				})
				.forResult();
			if (result?.bool) {
				const target = result.targets[0],
					link = result.links[0];
				player.line(target);
				if (link == "reverse") {
					funcs = [funcs[0]].concat(funcs.slice(1, 4).reverse());
				}
				for (const func of funcs) {
					if (!target.isIn()) {
						break;
					}
					await func(target);
				}
			}
		},
		ai: {
			order: 5,
			ai: {
				player: 1,
			},
		},
	},
	// 十常侍共用技能
	pschangshi: {
		initSkill(changshi, skill) {
			if (!lib.skill[skill]) {
				lib.skill[skill] = {
					charlotte: true,
					onremove: true,
					mark: true,
					intro: {
						name: `常侍（${get.translation(changshi)}）`,
						name2: "常侍",
						content: "mark",
					},
				};
				lib.translate[skill] = "常侍";
				lib.translate[skill + "_bg"] = "侍";
			}
		},
		changshi: ["ps_zhangrang", "ps_zhaozhong", "ps_sunzhang", "ps_bilan", "ps_xiayun", "ps_hankui", "ps_lisong", "ps_duangui", "ps_guosheng", "ps_gaowang"],
		trigger: {
			global: "phaseBefore",
			player: "enterGame",
		},
		forced: true,
		locked: false,
		filter(event, player) {
			return event.name != "phase" || game.phaseNumber == 0;
		},
		async content(event, trigger, player) {
			const changshi = get.info(event.name).changshi.randomGet();
			const skill = `${changshi}_${player.playerid}`;
			game.broadcastAll(get.info(event.name).initSkill, changshi, skill);
			player.addSkill([skill, `${event.name}_effect`]);
			player.addMark(skill, 1);
			game.broadcastAll(
				(player, changshi, skill) => {
					if (player.marks[skill]) {
						player.marks[skill].setBackground(changshi, "character");
					}
				},
				player,
				changshi,
				skill
			);
		},
		group: "pschangshi_remove",
		subSkill: {
			remove: {
				trigger: { player: "removeMark" },
				forced: true,
				locked: false,
				filter(event, player) {
					return get.info("pschangshi").changshi.some(name => event.markName == `${name}_${player.playerid}`);
				},
				async content(event, trigger, player) {
					await player.loseMaxHp();
				},
			},
			effect: {
				charlotte: true,
				trigger: {
					player: "damageBegin4",
					global: "phaseDiscardBegin",
				},
				filter(event, player) {
					if (get.info("pschangshi").changshi.every(name => !player.hasMark(`${name}_${player.playerid}`))) {
						return false;
					}
					if (event.name == "phaseDiscard") {
						return get.info("jsrgzhenglve").isFirst(event.player);
					}
					if (event.player.hp + event.player.hujia > event.num) {
						return false;
					}
					return game.hasPlayer(current => {
						return current != player && get.info("pschangshi").changshi.some(name => current.hasMark(`${name}_${current.playerid}`));
					});
				},
				async cost(event, trigger, player) {
					if (trigger.name == "phaseDiscard") {
						const { player: target } = trigger;
						const { result } = await player.chooseBool(get.prompt(event.skill, target), `摸一张牌，令其本局游戏手牌上限+1`).set("choice", get.attitude(player, target) > 0);
						event.result = {
							bool: result?.bool,
							targets: [target],
						};
					} else {
						event.result = await player
							.chooseTarget(
								get.prompt(event.skill),
								(card, player, target) => {
									return target != player && get.info("pschangshi").changshi.some(name => target.hasMark(`${name}_${target.playerid}`));
								},
								`选择一名角色转移伤害`
							)
							.set("ai", target => {
								const player = get.player();
								return -get.attitude(player, target);
							})
							.forResult();
					}
				},
				async content(event, trigger, player) {
					const {
						targets: [target],
					} = event;
					if (trigger.name == "phaseDiscard") {
						await player.draw();
						target.addSkill("pschangshi_hand");
						target.addMark("pschangshi_hand", 1, false);
					} else {
						trigger.cancel();
						await game.delay(0.5);
						const marks = get.info("pschangshi").changshi.filter(name => player.hasMark(`${name}_${player.playerid}`));
						if (marks.length == 1) {
							const mark = `${marks[0]}_${player.playerid}`;
							player.removeMark(mark, 1);
							if (!player.hasMark(mark)) {
								player.removeSkill(mark);
							}
						} else if (marks.length) {
							const { result } = await player.chooseButton(["选择一个常侍标记移去", [marks, "character"]], true);
							if (result?.bool && result?.links?.length) {
								const mark = `${result.links[0]}_${player.playerid}`;
								player.removeMark(mark, 1);
								if (!player.hasMark(mark)) {
									player.removeSkill(mark);
								}
							}
						}
						if (get.info("pschangshi").changshi.every(name => !player.hasMark(`${name}_${player.playerid}`))) {
							player.removeSkill(event.name);
						}
						await target
							.damage(trigger.source ? trigger.source : "nosource", trigger.nature, trigger.num)
							.set("card", trigger.card)
							.set("cards", trigger.cards);
					}
				},
			},
			hand: {
				charlotte: true,
				onremove: true,
				markimage: "image/card/handcard.png",
				intro: { content: "手牌上限+#" },
				mod: {
					maxHandcard(player, num) {
						return num + player.countMark("pschangshi_hand");
					},
				},
			},
		},
	},
	// 张让
	pstaoluan: {
		audio: "scstaoluan",
		enable: "phaseUse",
		usable(skill, player) {
			return game.filterPlayer().reduce((num, current) => {
				const count = get.info("pschangshi").changshi.reduce((sum, name) => sum + current.countMark(`${name}_${current.playerid}`), 0);
				return num + count;
			}, 0);
		},
		filter(event, player) {
			if (!player.countCards("hes")) {
				return false;
			}
			return get.inpileVCardList(info => {
				if (!["basic", "trick"].includes(info[0]) || player.getStorage("pstaoluan_record").includes(info[2])) {
					return false;
				}
				return event.filterCard(get.autoViewAs({ name: info[2], nature: info[3] }, "unsure"), player, event);
			}).length;
		},
		chooseButton: {
			dialog(event, player) {
				const vcards = get.inpileVCardList(info => {
					if (!["basic", "trick"].includes(info[0]) || player.getStorage("pstaoluan_record").includes(info[2])) {
						return false;
					}
					return event.filterCard(get.autoViewAs({ name: info[2], nature: info[3] }, "unsure"), player, event);
				});
				return ui.create.dialog("滔乱", [vcards, "vcard"]);
			},
			check(button) {
				return get.player().getUseValue({ name: button.link[2], nature: button.link[3] });
			},
			backup(links, player) {
				return {
					audio: "pstaoluan",
					popname: true,
					viewAs: { name: links[0][2], nature: links[0][3] },
					filterCard: true,
					position: "hes",
					async precontent(event, trigger, player) {
						player.addTempSkill("pstaoluan_record");
						player.markAuto("pstaoluan_record", [event.result.card.name]);
					},
				};
			},
			prompt(links, player) {
				return "将一张牌当" + (get.translation(links[0][3]) || "") + get.translation(links[0][2]) + "使用";
			},
		},
		ai: {
			combo: "pschangshi",
			order: 7,
			result: { player: 1 },
			threaten: 1.9,
		},
		subSkill: {
			record: {
				charlotte: true,
				onremove: true,
				intro: { content: "已记录牌名：$" },
			},
		},
	},
	// 赵忠
	pschiyan: {
		audio: "scschiyan",
		trigger: { player: "useCardToPlayered" },
		filter(event, player) {
			return event.card.name == "sha" && event.target.countCards("he") && player.countCards("he");
		},
		logTarget: "target",
		check(event, player) {
			return get.attitude(player, event.target) <= 0;
		},
		async content(event, trigger, player) {
			for (const target of [player, trigger.target].sortBySeat()) {
				if (!target.isIn() || !target.countCards("he")) {
					continue;
				}
				const { result } = await target.chooseCard("鸱咽：将任意张牌置于武将牌上直到回合结束", [1, Infinity], true, "he").set("ai", card => {
					const player = get.player();
					if (ui.selected.cards.length) {
						return 0;
					}
					return 6 - get.value(card);
				});
				if (result?.bool && result?.cards?.length) {
					target.addSkill(event.name + "_gain");
					const next = target.addToExpansion("giveAuto", result.cards, target);
					next.gaintag.add(event.name + "_gain");
					await next;
				}
			}
			const { target } = trigger;
			if (target.countCards("h") <= player.countCards("h")) {
				target.addTempSkill(event.name + "_damage");
			}
			if (target.countCards("h") >= player.countCards("h")) {
				target.addTempSkill(event.name + "_effect");
			}
		},
		subSkill: {
			gain: {
				trigger: { global: "phaseEnd" },
				forced: true,
				popup: false,
				charlotte: true,
				filter(event, player) {
					return player.countExpansions("pschiyan_gain");
				},
				async content(event, trigger, player) {
					const cards = player.getExpansions(event.name);
					await player.gain(cards, "draw");
					game.log(player, "收回了" + get.cnNumber(cards.length) + "张“鸱咽”牌");
					player.removeSkill(event.name);
				},
				intro: {
					markcount: "expansion",
					mark(dialog, storage, player) {
						var cards = player.getExpansions("pschiyan_gain");
						if (player.isUnderControl(true)) {
							dialog.addAuto(cards);
						} else {
							return "共有" + get.cnNumber(cards.length) + "张牌";
						}
					},
				},
			},
			damage: {
				charlotte: true,
				trigger: { player: "damageBegin3" },
				forced: true,
				popup: false,
				async content(event, trigger, player) {
					trigger.num++;
				},
				mark: true,
				intro: { content: "本回合受到的伤害+1" },
			},
			effect: {
				charlotte: true,
				mod: {
					cardEnabled(card, player) {
						const hs = player.getCards("h");
						if ([card].concat(card.cards || []).containsSome(...hs)) {
							return false;
						}
					},
					cardSavable(card, player) {
						return lib.skill.pschiyan_effect.mod.cardEnabled.apply(this, arguments);
					},
				},
				mark: true,
				intro: { content: "本回合不能使用手牌" },
			},
		},
	},
	// 孙璋
	pszimou: {
		audio: "scszimou",
		trigger: { player: "phaseUseBegin" },
		forced: true,
		logTarget: () => game.filterPlayer().sortBySeat(),
		async content(event, trigger, player) {
			for (const target of event.targets) {
				if (!target.isIn()) {
					continue;
				}
				if (target != player) {
					const result = !target.countCards("he")
						? { bool: false }
						: await target
								.chooseToGive(player, "he", `交给${get.translation(player)}一张牌，或弃置其一张牌并受到其造成的1点伤害`)
								.set("ai", card => {
									const { player, target } = get.event();
									if (get.damageEffect(player, target, player) + get.effect(target, { name: "guohe_copy2" }, player, player) > 0) {
										return 0;
									}
									return 6 - get.value(card);
								})
								.forResult();
					if (!result?.bool) {
						if (player.countDiscardableCards(target, "he")) {
							await target.discardPlayerCard(player, "he", true);
							await target.damage();
						}
					}
				} else if (player.countDiscardableCards(player, "he")) {
					await player.chooseToDiscard("he", true);
					await player.damage();
				}
			}
		},
	},
	// 毕岚
	psbicai: {
		audio: "scspicai",
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return game.countPlayer(current => current.countCards("h")) >= player.getHp() && player.getHp() > 0;
		},
		filterTarget(card, player, target) {
			return target.countCards("h");
		},
		selectTarget() {
			return get.player().getHp();
		},
		multitarget: true,
		multiline: true,
		async content(event, trigger, player) {
			const num = event.targets.length;
			const list = [];
			for (const target of event.targets.sortBySeat()) {
				if (target.isIn() && target.countCards("h")) {
					const { result } = await target.chooseCard("选择一张手牌置于牌堆顶", "h", true);
					if (result?.bool && result?.cards?.length) {
						list.push(target);
						await target.lose(result.cards, ui.cardPile, "insert");
						game.broadcastAll(player => {
							const cardx = ui.create.card();
							cardx.classList.add("infohidden");
							cardx.classList.add("infoflip");
							player.$throw(cardx, 1000, "nobroadcast");
						}, target);
					}
					if (player == game.me) {
						await game.delay(0.5);
					}
				}
			}
			let cards = get.cards(num);
			await game.cardsGotoOrdering(cards);
			await player.showCards(cards, get.translation(player) + `发动了【${get.translation(event.name)}】`);
			const draw = cards.map(card => get.type2(card)).toUniqued().length;
			await player.draw(draw);
			if (draw == 3 && cards.someInD()) {
				cards = cards.filterInD();
				for (const target of list.sortBySeat()) {
					if (!target.isIn()) {
						continue;
					}
					const result = cards.length == 1 ? { bool: true, links: cards } : await target.chooseButton([`${get.translation(event.name)}：获得其中一张牌`, cards], true).forResult();
					if (result?.bool && result?.links?.length) {
						const { links } = result;
						await target.gain(links, "gain2");
						cards.remove(links[0]);
					}
				}
			}
		},
		ai: {
			order: 10,
			result: { player: 1 },
		},
	},
	// 夏恽
	psyaozhuo: {
		audio: "scsyaozhuo",
		enable: "phaseUse",
		trigger: { player: "damageEnd" },
		filter(event, player) {
			if (!game.hasPlayer(current => player.canCompare(current))) {
				return false;
			}
			return event.name == "damage" || !player.hasSkill("psyaozhuo_used", null, null, false);
		},
		filterTarget(card, player, target) {
			return player.canCompare(target);
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt2(event.skill), (card, player, target) => {
					return player.canCompare(target);
				})
				.set("ai", target => {
					const player = get.player();
					return get.effect(target, "psyaozhuo", player, player);
				})
				.forResult();
		},
		async content(event, trigger, player) {
			if (!trigger) {
				player.addTempSkill(event.name + "_used", "phaseUseAfter");
			}
			const {
				targets: [target],
			} = event;
			const { result } = await player.chooseToCompare(target);
			if (result?.bool) {
				target.addTempSkill(event.name + "_effect");
				target.addMark(event.name + "_effect", 2, false);
			} else {
				await player.recover();
			}
		},
		ai: {
			order(item, player) {
				if (player.isDamaged()) {
					return 10;
				}
				return 1;
			},
			result: {
				target(player, target) {
					var hs = player.getCards("h").sort((a, b) => b.number - a.number);
					var ts = target.getCards("h").sort((a, b) => b.number - a.number);
					if (!hs.length || !ts.length) {
						return 0;
					}
					if ((hs[0].number > ts[0].number - 2 && hs[0].number > 5) || player.isDamaged()) {
						return -1;
					}
					return 0;
				},
			},
		},
		group: "psyaozhuo_gain",
		subSkill: {
			used: { charlotte: true },
			effect: {
				// charlotte: true,
				charlotte: true,
				onremove: true,
				markimage: "image/card/handcard.png",
				intro: { content: "本回合手牌上限-#" },
				mod: {
					maxHandcard(player, num) {
						return num - player.countMark("psyaozhuo_effect");
					},
				},
			},
			gain: {
				audio: "scspsyaozhuo",
				getCards: (event, player) => (player == event.player ? event.card2 : event.card1),
				trigger: { global: ["chooseToCompareAfter", "compareMultipleAfter"] },
				filter(event, player) {
					if (![event.player, event.target].includes(player)) {
						return false;
					}
					if (event.preserve) {
						return false;
					}
					const card = get.info("psyaozhuo_gain").getCards(event, player);
					return !get.owner(card);
				},
				check(event, player) {
					const card = get.info("psyaozhuo_gain").getCards(event, player);
					return card.name != "du";
				},
				prompt2(event, player) {
					const card = get.info("psyaozhuo_gain").getCards(event, player);
					return `获得${get.translation(card)}`;
				},
				async content(event, trigger, player) {
					const card = get.info(event.name).getCards(trigger, player);
					if (!get.owner(card)) {
						await player.gain(card, "gain2");
					}
				},
			},
		},
	},
	// 韩悝
	psxiaolu: {
		audio: "scsxiaolu",
		global: "psxiaolu_give",
		subSkill: {
			give: {
				enable: "phaseUse",
				prompt() {
					const player = get.player();
					const list = game.filterPlayer(current => current != player && current.hasSkill("psxiaolu"));
					let str = "将一张牌交给" + get.translation(list);
					if (list.length > 1) {
						str += "中的一人";
					}
					return str;
				},
				filter(event, player) {
					if (!player.countCards("he") || player.hasSkill("psxiaolu_used", null, null, false)) {
						return false;
					}
					return game.hasPlayer(current => current != player && current.hasSkill("psxiaolu"));
				},
				filterTarget(card, player, target) {
					return target != player && target.hasSkill("psxiaolu");
				},
				selectTarget() {
					const player = get.player();
					const count = game.countPlayer(current => current != player && current.hasSkill("psxiaolu"));
					return count > 1 ? 1 : -1;
				},
				check(card) {
					const player = get.player();
					const hasFriend = game.hasPlayer(current => {
						return current != player && current.hasSkill("psxiaolu") && get.attitude(player, current) > 0;
					});
					return (hasFriend ? 7 : 1) - get.value(card);
				},
				filterCard: true,
				position: "he",
				discard: false,
				lose: false,
				delay: false,
				line: true,
				log: false,
				async content(event, trigger, player) {
					const { target } = event;
					player.logSkill("psxiaolu", target);
					player.addTempSkill("psxiaolu_used", "phaseUseEnd");
					await player.give(event.cards, target);
					const targets = game.filterPlayer(current => current != player && current != target);
					if (!targets.length) {
						return;
					}
					const result =
						targets.length == 1
							? { bool: true, targets }
							: await player
									.chooseTarget("请选择你要使用牌的目标", true, (card, player, target) => {
										return get.event("targetsx").includes(target);
									})
									.set("ai", target => {
										const player = get.player();
										return Math.max.apply(
											Math,
											lib.inpile
												.filter(name => get.type(name) == "trick")
												.map(name => {
													const card = { name, isCard: true };
													if (!player.canUse(card, target, false)) {
														return 0;
													}
													return get.effect(target, card, player, player);
												})
										);
									})
									.set("targetsx", targets)
									.forResult();
					if (result?.bool && result?.targets?.length) {
						const [target1] = result.targets;
						player.line(target1);
						game.log(player, "选择了", target1);
						const list = get.inpileVCardList(info => {
							return info[0] == "trick" && player.canUse({ name: info[2], nature: info[3], isCard: true }, target1, false);
						});
						if (list.length) {
							const result =
								list.length == 1
									? { bool: true, links: list }
									: await player
											.chooseButton([`请选择你要${get.translation(target1)}使用的牌`, [list, "vcard"]], true)
											.set("ai", button => {
												const { player, target1 } = get.event();
												return get.effect(target1, { name: button.link[2], nature: button.link[3], isCard: true }, player, player);
											})
											.set("target1", target1)
											.forResult();
							if (result?.bool && result?.links?.length) {
								const card = get.autoViewAs({ name: result.links[0][2], isCard: true, nature: result.links[0][3] });
								await player.useCard(card, false, target1);
							}
						}
					}
				},
				ai: {
					expose: 0.3,
					order: 10,
					result: { target: 5 },
				},
			},
			used: { charlotte: true },
		},
	},
	// 栗嵩
	pskuiji: {
		audio: "scskuiji",
		inherit: "scskuiji",
		async content(event, trigger, player) {
			const { target } = event;
			if (!target.countCards("h")) {
				return;
			}
			event.list1 = [];
			event.list2 = [];
			const dialog = [];
			if (player.countCards("h")) {
				dialog.addArray(["你的手牌", player.getCards("h")]);
			}
			if (target.countCards("h")) {
				dialog.addArray([get.translation(target) + "的手牌", target.getCards("h")]);
			}
			const next = player.chooseButton(4, dialog);
			next.set("target", target);
			next.set("ai", button => {
				const { player, target } = get.event();
				const ps = [];
				const ts = [];
				for (let i = 0; i < ui.selected.buttons.length; i++) {
					const card = ui.selected.buttons[i].link;
					if (target.getCards("h").includes(card)) {
						ts.push(card);
					} else {
						ps.push(card);
					}
				}
				const card = button.link;
				const owner = get.owner(card);
				const val = get.value(card) || 1;
				if (owner == target) {
					return 2 * val;
				}
				return 7 - val;
			});
			next.set("filterButton", button => {
				for (let i = 0; i < ui.selected.buttons.length; i++) {
					if (get.suit(button.link) == get.suit(ui.selected.buttons[i].link)) {
						return false;
					}
				}
				return true;
			});
			const { result } = await next;
			if (result?.bool && result?.links?.length) {
				for (const link of result.links) {
					if (get.owner(link) == player) {
						event.list1.push(link);
					} else {
						event.list2.push(link);
					}
				}
				if (event.list1.length && event.list2.length) {
					await game
						.loseAsync({
							lose_list: [
								[player, event.list1],
								[target, event.list2],
							],
							discarder: player,
						})
						.setContent("discardMultiple");
				} else if (event.list2.length) {
					await target.discard(event.list2);
				} else {
					await player.discard(event.list1);
				}
				if (event.list1.length != event.list2.length) {
					const list = [player, target];
					if (event.list1.length < event.list2.length) {
						list.reverse();
					}
					await list[0].loseHp();
					await list[1].addTempSkills("rechouhai");
				}
			}
		},
		derivation: "rechouhai",
	},
	// 段珪
	pschihe: {
		audio: "scschihe",
		trigger: {
			player: "useCardToPlayered",
			target: "useCardToTargeted",
		},
		filter(event, player) {
			return event.targets.length == 1 && event.card.name == "sha";
		},
		logTarget(event, player) {
			return player == event.player ? event.targets[0] : event.player;
		},
		check(event, player) {
			const target = get.info("pschihe").logTarget(event, player);
			return get.attitude(player, target) <= 0 || !player.canCompare(target);
		},
		async content(event, trigger, player) {
			await player.draw(2);
			if (!player.countCards("h")) {
				return;
			}
			const { result } = await player.chooseCard("h", true, 2, "选择两张手牌展示");
			if (result?.bool && result?.cards?.length) {
				await player.showCards(result.cards, get.translation(player) + "发动了【" + get.translation(event.name) + "】");
			}
			const target = get.info(event.name).logTarget(trigger, player);
			if (player.canCompare(target)) {
				const { result } = await player.chooseToCompare(target);
				if (result?.bool) {
					const evt = trigger.getParent();
					if (typeof evt.baseDamage != "number") {
						evt.baseDamage = 1;
					}
					evt.baseDamage++;
				} else if (player.countDiscardableCards(player, "he")) {
					await player.chooseToDiscard("he", 2, true);
				}
			}
		},
	},
	// 郭胜
	psniqu: {
		audio: "scsniqu",
		trigger: { global: ["useCardAfter", "respondAfter"] },
		filter(event, player) {
			return event.card?.name == "shan";
		},
		check(event, player) {
			return get.attitude(player, event.player) <= 0 || player == event.player;
		},
		usable: 1,
		logTarget: "player",
		async content(event, trigger, player) {
			await player.draw();
			const { player: target } = trigger;
			const sha = get.autoViewAs({ name: "sha", isCard: true });
			if (player.canUse(sha, target, false)) {
				await player.useCard(sha, target, false);
			}
		},
	},
	// 高望
	psmiaoyu: {
		audio: "scsmiaoyu",
		trigger: { global: "recoverEnd" },
		filter(event, player) {
			return event.player.isIn();
		},
		check(event, player) {
			return get.attitude(player, event.player) <= 0;
		},
		logTarget: "player",
		async content(event, trigger, player) {
			const { player: target } = trigger;
			player.addTempSkill(event.name + "_effect");
			player.markAuto(event.name + "_effect", [target]);
			const gainEvent = target.gain(get.cards(), "draw");
			gainEvent.giver = player;
			await gainEvent;
		},
		subSkill: {
			effect: {
				charlotte: true,
				onremove: true,
				trigger: { global: "phaseEnd" },
				forced: true,
				popup: false,
				async content(event, trigger, player) {
					for (const target of player.getStorage(event.name)) {
						if (!target.isIn()) {
							continue;
						}
						const num = game.getGlobalHistory("everything", evt => evt.name == "psmiaoyu").length;
						player.line(target, "green");
						await target.loseHp(num);
					}
				},
			},
		},
	},
	// 曹操
	jylijun: {
		trigger: { global: "damageEnd" },
		filter(event, player) {
			return event.player.isIn() && event.player.group == "wei";
		},
		check(event, player) {
			return get.effect(event.player, { name: "draw" }, player, player) > 0;
		},
		logTarget: "player",
		async content(event, trigger, player) {
			await trigger.player.draw();
		},
	},
	jytongbei: {
		trigger: { source: "damageBegin1" },
		filter(event, player) {
			return event.player.group != "wei";
		},
		async cost(event, trigger, player) {
			const { player: target } = trigger;
			if (!target.countCards("he")) {
				event.result = await player
					.chooseBool(get.prompt2(event.skill, target))
					.set("choice", get.attitude(player, target) < 0)
					.forResult();
			} else {
				const { result } = await player
					.chooseControl(lib.inpile.map(name => get.type2(name)).unique(), "cancel2")
					.set("prompt", get.prompt(event.skill, target))
					.set("ai", () => {
						let { player, targetx, controls } = get.event();
						const att = get.attitude(player, targetx);
						if (att > 0) {
							return "cancel2";
						}
						if (player.hasSkillTag("viewHandcard", null, target, true)) {
							return controls.filter(type => !targetx.countCards("he", { type: type })).randomGet();
						}
						const types = targetx
							.getCards("he", card => card.isKnownBy(player))
							.map(name => get.type2(name))
							.unique();
						if (types.length < controls.length) {
							return controls.removeArray(types).randomGet();
						}
						return controls.randomGet();
					})
					.set("targetx", target);
				event.result = {
					bool: result?.control != "cancel2",
					cost_data: result?.control,
				};
			}
		},
		logTarget: "player",
		async content(event, trigger, player) {
			const { player: target } = trigger;
			const { cost_data } = event;
			if (cost_data) {
				player.popup(cost_data);
				game.log(player, "声明", "#g" + get.translation(cost_data) + "牌");
			}
			let result;
			if (!cost_data || !target.countCards("he", { type: cost_data })) {
				result = { bool: false };
			} else {
				result = await target
					.chooseToGive(player, "he", { type: cost_data }, `交给${get.translation(player)}一张${get.translation(cost_data)}牌，否则此伤害+1`)
					.set("ai", card => {
						const { player, target } = get.event();
						const att = get.attitude(player, target);
						const eff = get.damageEffect(player, target, player);
						if (eff > 0) {
							return 0;
						}
						return 7 - get.value(card);
					})
					.forResult();
			}
			if (!result?.bool) {
				trigger.num++;
			}
		},
	},
	// 曹仁
	jybeirong: {
		enable: "phaseUse",
		usable: 1,
		filterCard: lib.filter.cardRecastable,
		selectCard: [1, Infinity],
		check(card) {
			return 6.5 - get.value(card);
		},
		discard: false,
		lose: false,
		delay: false,
		async content(event, trigger, player) {
			const { cards } = event,
				num = cards.map(card => get.suit(card)).toUniqued().length;
			await player.recast(cards);
			if (num >= player.getHp()) {
				await player.link();
			}
		},
		ai: {
			order: 10,
			result: { player: 1 },
		},
	},
	jyyujun: {
		trigger: { global: "damageBegin4" },
		filter(event, player) {
			return event.player.isLinked() && event.hasNature();
		},
		check(event, player) {
			return get.damageEffect(event.player, event.source, player, event.nature) * event.num < get.effect(player, { name: "losehp" }, player, player) + get.effect(player, { name: "draw" }, player, player) * 3;
		},
		async content(event, trigger, player) {
			await player.turnOver();
			await player.loseHp();
			await player.draw(3);
			trigger.cancel();
		},
	},
	// 诸葛亮
	jyqibian: {
		trigger: { global: ["roundStart", "roundEnd"] },
		filter(event, player, name) {
			return name === "roundStart" || player.getExpansions("jyqibian").length;
		},
		forced: true,
		async content(event, trigger, player) {
			if (event.triggername === "roundEnd") {
				const cards = player.getExpansions(event.name);
				if (cards.length) {
					await player.loseToDiscardpile(cards);
				}
			} else {
				const next = player.addToExpansion(get.cards(7), "gain2");
				next.gaintag.add(event.name);
				await next;
			}
		},
		marktext: "才",
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
		ai: { combo: "jycailve" },
	},
	jycailve: {
		hiddenCard(player, name) {
			return lib.inpile.includes(name) && player.getExpansions("jyqibian").some(card => get.name(card) == name);
		},
		enable: "chooseToUse",
		onChooseToUse(event) {
			if (!game.online && !event.jycailve_cards) {
				event.set("jycailve_cards", event.player.getExpansions("jyqibian"));
			}
		},
		filter(event, player) {
			if (!Array.isArray(event.jycailve_cards) || event.responded || event.jycailve) {
				return false;
			}
			return player.getExpansions("jyqibian").some(card => event.filterCard(card, player, event));
		},
		chooseButton: {
			dialog(event, player) {
				return ui.create.dialog("才辩", player.getExpansions("jyqibian"), "hidden");
			},
			filter(button, player) {
				const evt = get.event().getParent();
				return evt.filterCard(button.link, player, evt);
			},
			check(button) {
				const { link } = button,
					player = get.player();
				if (get.event().getParent().type != "phase") {
					return 1;
				}
				return player.getUseValue(link);
			},
			backup(links, player) {
				return {
					// filterCard: () => false,
					filterCard(card) {
						return card === lib.skill.jycailve_backup.card;
					},
					selectCard: -1,
					viewAs: links[0],
					card: links[0],
					position: "x",
					async precontent(event, trigger, player) {
						player.addTempSkill("jycailve_effect");
					},
				};
			},
			prompt(links, player) {
				return "才辩：是否使用" + get.translation(links[0]) + "？";
			},
		},
		ai: {
			combo: "jyqibian",
			order: 8,
			effect: {
				target(card, player, target, effect) {
					if (get.tag(card, "respondShan")) {
						return 0.7;
					}
					if (get.tag(card, "respondSha")) {
						return 0.7;
					}
				},
			},
			respondShan: true,
			respondSha: true,
			result: {
				player(player) {
					return get.event().dying ? get.attitude(player, get.event().dying) : 1;
				},
			},
		},
		subSkill: {
			backup: {},
			effect: {
				charlotte: true,
				trigger: { global: "useCardToBegin" },
				filter(event, player) {
					const { target } = event;
					if (!target?.isIn()) {
						return false;
					}
					return event.skill === "jycailve_backup" && player.countDiscardableCards(target, "he");
				},
				forced: true,
				popup: false,
				async content(event, trigger, player) {
					const { target } = trigger;
					if (player.countDiscardableCards(target, "he")) {
						await target.discardPlayerCard(player, "he");
					}
				},
			},
		},
	},
	// 庞统
	jylianhuan: {
		enable: "phaseUse",
		usable: 1,
		viewAs: { name: "tiesuo", isCard: true },
		filterCard: () => false,
		selectCard: -1,
		log: false,
		precontent() {
			player.logSkill("jylianhuan");
			player.loseHp();
		},
		ai: {
			order: 10,
			result: {
				target(player, target) {
					if (player.getHp() < 2) {
						return 0;
					}
					const att = get.attitude(player, target);
					if (player.hasSkill("jyyuhuo")) {
						return !target.isLinked() && att > 0 && player != target ? 1 : -1;
					}
					return lib.card.tiesuo.ai.result.target(player, target);
				},
			},
		},
	},
	jysuozhou: {
		trigger: { player: "useCard", target: "useCardToTarget" },
		filter(event, player) {
			return get.suit(event.card) == "club" && game.hasPlayer(current => current.isLinked());
		},
		usable: 1,
		logTarget: () => game.filterPlayer(current => current.isLinked()).sortBySeat(),
		check(event, player) {
			return (
				get
					.info("jysuozhou")
					.logTarget()
					.reduce((sum, current) => sum + get.effect(current, { name: "draw" }, player, player), 0) > 0
			);
		},
		async content(event, trigger, player) {
			await game.asyncDraw(event.targets);
		},
	},
	jyyuhuo: {
		trigger: { global: "damageBegin4" },
		filter(event, player) {
			return event.player != player && event.player.isLinked();
		},
		forced: true,
		async content(event, trigger, player) {
			trigger[trigger.hasNature() ? "increase" : "decrease"]("num");
		},
	},
	// 鲁肃
	jydimeng: {
		getList(event) {
			const list = [event.player];
			if (event.targets?.length) {
				list.addArray(event.targets);
			} else {
				list.add(event.target);
			}
			return list.sortBySeat();
		},
		trigger: { global: "compareCardShowBefore" },
		filter(event, player) {
			return get.info("jydimeng").getList(event).length > 1;
		},
		async cost(event, trigger, player) {
			const list = get.info(event.skill).getList(trigger);
			event.result = await player
				.chooseTarget(2, get.prompt2(event.skill), (card, player, target) => {
					return get.event("list").includes(target);
				})
				.set("ai", target => {
					const player = get.player();
					const evt = get.event().getTrigger();
					const { player: source, small, lose_list } = evt;
					const att1 = get.attitude(player, source);
					const att2 = get.attitude(player, target);
					const [card] = lose_list.find(i => i[0] === target)[1];
					if (!ui.selected.targets.length) {
						if (target == source) {
							if ((player == source && get.number(evt.card1) <= 7 && !small) || att1 <= 0 || (small && get.number(evt.card1) > 6)) {
								return 10;
							}
						}
						if (att2 > 0 && ((get.number(card) <= 7 && !small) || (small && get.number(card) > 6))) {
							return 10;
						}
					}
					return -att2 * (small ? 14 - get.number(card) : get.number(card));
				})
				.set("list", list)
				.forResult();
		},
		async content(event, trigger, player) {
			const { targets } = event;
			if (trigger.targets?.length) {
				const { cardlist, lose_list } = trigger;
				const [card1] = lose_list.find(i => i[0] === targets[0])[1];
				const [card2] = lose_list.find(i => i[0] === targets[1])[1];
				const index1 = cardlist.indexOf(card1);
				const index2 = cardlist.indexOf(card2);
				if (index1 >= 0 && index2 >= 0) {
					[cardlist[index1], cardlist[index2]] = [cardlist[index2], cardlist[index1]];
				} else {
					trigger.card1 = index1 < 0 ? card2 : card1;
					cardlist[index1 < 0 ? index2 : index1] = index1 < 0 ? card1 : card2;
				}
			} else {
				const list = [trigger.card1, trigger.card2];
				trigger.card1 = list[1];
				trigger.card2 = list[0];
			}
		},
	},
	jyzhouji: {
		enable: "phaseUse",
		usable(skill, player) {
			return player.getHp();
		},
		filter(event, player) {
			return game.hasPlayer(target => get.info("jyzhouji").filterTarget(null, player, target));
		},
		filterTarget(card, player, target) {
			return player.canCompare(target);
		},
		async content(event, trigger, player) {
			const { target } = event;
			const { result } = await player.chooseToCompare(target).set("small", get.attitude(player, target) > 0);
			if (target === result?.winner) {
				await target.draw(2);
			}
		},
		ai: {
			order: 10,
			expose: 0.2,
			result: {
				target(player, target) {
					var maxnum = 0;
					var cards2 = target.getCards("h");
					for (var i = 0; i < cards2.length; i++) {
						if (get.number(cards2[i]) > maxnum) {
							maxnum = get.number(cards2[i]);
						}
					}
					if (maxnum > 10) {
						maxnum = 10;
					}
					if (maxnum < 5 && cards2.length > 1) {
						maxnum = 5;
					}
					var cards = player.getCards("h");
					for (var i = 0; i < cards.length; i++) {
						if (get.number(cards[i]) < maxnum) {
							return 1;
						}
					}
					return 0;
				},
			},
		},
	},
	// 张昭
	jyboyan: {
		enable: "phaseUse",
		usable: 2,
		filter(event, player) {
			return game.hasPlayer(target => get.info("jyboyan").filterTarget(null, player, target));
		},
		filterTarget(card, player, target) {
			return player.canCompare(target);
		},
		async content(event, trigger, player) {
			const { target } = event;
			const { result } = await player.chooseToCompare(target);
			const list = [player, target];
			if (result?.winner) {
				list.remove(result.winner);
			}
			for (const loser of list) {
				loser.addTempSkill(event.name + "_effect");
				await loser.draw(2);
			}
		},
		ai: {
			order: 7,
			result: {
				target(player, target) {
					var hs = player.getCards("h").sort(function (a, b) {
						return get.number(b) - get.number(a);
					});
					var ts = target.getCards("h").sort(function (a, b) {
						return get.number(b) - get.number(a);
					});
					if (!hs.length || !ts.length) {
						return 0;
					}
					if (get.number(hs[0]) > get.number(ts[0]) || get.number(hs[0]) - ts.length >= 9 + Math.min(2, player.hp / 2)) {
						return get.sgnAttitude(player, target) * get.damageEffect(target, player, player);
					}
					return 0;
				},
			},
		},
		subSkill: {
			effect: {
				charlotte: true,
				mod: {
					cardEnabled(card, player) {
						if ([card].concat(card.cards || []).some(cardx => get.itemtype(cardx) === "card" && get.position(cardx) == "h")) {
							return false;
						}
					},
					cardSavable(card, player) {
						if ([card].concat(card.cards || []).some(cardx => get.itemtype(cardx) === "card" && get.position(cardx) == "h")) {
							return false;
						}
					},
				},
				mark: true,
				intro: { content: "本回合不能使用手牌" },
			},
		},
	},
	jymushi: {
		trigger: { player: "phaseJieshuBegin" },
		filter(event, player) {
			return get
				.info("jymushi")
				.logTarget(event, player)
				.some(current => current.countGainableCards(player, "he") || current.countCards("h") != current.getHp());
		},
		async cost(event, trigger, player) {
			const targets = get.info(event.skill).logTarget(trigger, player);
			const choices = [];
			const choiceList = [`获得${get.translation(targets)}${targets.length > 1 ? "各" : ""}一张牌`, `令${get.translation(targets)}将手牌数调整至其体力值`];
			if (targets.some(current => current.countGainableCards(player, "he"))) {
				choices.push("选项一");
			} else {
				choiceList[0] = '<span style="opacity:0.5">' + choiceList[0] + "</span>";
			}
			if (targets.some(current => current.countCards("h") != current.getHp())) {
				choices.push("选项二");
			} else {
				choiceList[1] = '<span style="opacity:0.5">' + choiceList[1] + "</span>";
			}
			const { result } = await player
				.chooseControl(choices, "cancel2")
				.set("choiceList", choiceList)
				.set("prompt", get.prompt(event.skill))
				.set("ai", () => {
					const { player, targets, controls } = get.event();
					const eff1 = targets.reduce((sum, current) => sum + get.effect(current, { name: "shunshou_copy2" }, player, player), 0);
					const eff2 = targets.reduce((sum, current) => sum + 2 * get.effect(current, { name: "guohe_copy2", position: "h" }, player, player) * (current.countCards("h") - current.getHp()), 0);
					if (eff1 <= 0 && eff2 <= 0) {
						return "cancel2";
					}
					if (controls.includes("选项一") && eff1 > 0 && eff1 >= eff2) {
						return "选项一";
					}
					if (controls.includes("选项二") && eff2 > 0) {
						return "选项二";
					}
					return "cancel2";
				})
				.set("targets", targets);
			event.result = {
				bool: result?.control != "cancel2",
				cost_data: result?.control,
			};
		},
		logTarget(event, player) {
			return game.filterPlayer(current => current.countCards("h") >= current.getHp() && current != player).sortBySeat();
		},
		async content(event, trigger, player) {
			const { cost_data, targets } = event;
			for (const target of targets) {
				if (!target.isIn()) {
					continue;
				}
				if (cost_data == "选项一" && target.countDiscardableCards(player, "he")) {
					await player.gainPlayerCard(target, "he", true);
				} else if (cost_data == "选项二" && target.countCards("h") != target.getHp()) {
					const num = target.getHp() - target.countCards("h");
					if (num > 0) {
						await target.draw(num);
					} else if (target.countDiscardableCards(target, "h")) {
						await target.chooseToDiscard(target.countCards("h") - target.getHp(), true);
					}
				}
			}
		},
	},
	// 周瑜
	jysashuang: {
		trigger: { player: "phaseJieshuBegin" },
		filter(event, player) {
			return get.discarded().someInD("d");
		},
		async cost(event, trigger, player) {
			const cards = get.discarded().filterInD("d");
			const { result } = await player
				.chooseButton([`火策：获得其中每种颜色的牌的各一张`, cards], cards.map(card => get.color(card)).toUniqued().length)
				.set("filterButton", button => {
					const { link } = button;
					return !ui.selected.buttons.reduce((list, card) => list.add(get.color(card.link)), []).includes(get.color(link));
				})
				.set("ai", button => {
					return get.value(button.link);
				});
			event.result = {
				bool: result?.bool,
				cost_data: result?.links,
			};
		},
		async content(event, trigger, player) {
			await player.gain(event.cost_data, "gain2");
		},
	},
	jyhuoce: {
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return (
				player.hasCard(card => {
					return lib.filter.cardDiscardable(card, player, "jyhuoce");
				}, "he") && game.hasPlayer(current => get.info("jyhuoce").filterTarget(null, player, current))
			);
		},
		filterTarget(card, player, target) {
			return target != player && target.countCards("he");
		},
		async content(event, trigger, player) {
			const { target } = event;
			const list = [player, target].sortBySeat();
			if (list.some(current => !current.hasCard(card => lib.filter.cardDiscardable(card, current, "jyhuoce"), "he"))) {
				return;
			}
			const { result } = await player
				.chooseCardOL(list, "he", true, "火策：选择弃置一张牌", (card, player) => {
					return lib.filter.cardDiscardable(card, player, "jyhuoce");
				})
				.set("ai", get.unuseful);
			if (!result) {
				return;
			}
			const lose_list = [],
				cards = [];
			for (let i = 0; i < result.length; i++) {
				const current = list[i],
					card = result[i].cards[0];
				lose_list.push([current, result[i].cards]);
				cards.push(card);
			}
			if (lose_list.length) {
				await game
					.loseAsync({
						lose_list,
					})
					.setContent("discardMultiple");
			}
			if (cards.map(card => get.color(card)).toUniqued().length == 1) {
				const { result } = await player.chooseTarget(true, `选择一名角色对其造成1点火焰伤害`).set("ai", target => {
					const player = get.player();
					return get.damageEffect(target, player, player, "fire");
				});
				if (result?.bool && result?.targets?.length) {
					await result.targets[0].damage("fire", player);
				}
			}
		},
		ai: {
			threaten: 1.2,
			order: 9.1,
			result: {
				target(player, target) {
					if (target.hasCard(card => lib.filter.cardDiscardable(card, player, "jyhuoce"), "he")) {
						return -1;
					}
					return 0;
				},
			},
		},
	},
	// 黄盖
	jyliezhou: {
		trigger: { source: ["damageBegin1", "damageSource"] },
		filter(event, player, name) {
			return name == "damageBegin1" || (event.checkJyliezhou && event.num > 0);
		},
		forced: true,
		async content(event, trigger, player) {
			if (event.triggername == "damageBegin1") {
				game.setNature(trigger, "fire");
			} else {
				await player.draw(trigger.num);
			}
		},
	},
	jyzhaxiang: {
		enable: "phaseUse",
		usable: 1,
		async content(event, trigger, player) {
			await player.loseMaxHp();
			player.addTempSkill(event.name + "_effect");
		},
		ai: {
			order: 8,
			result: {
				player(player) {
					if (!player.hasCard(card => get.tag(card, "damage") > 0.5 && player.hasValueTarget(card), "hs") || player.hasSkill("jyzhaxiang_effect") || player.maxHp <= 3) {
						return 0;
					}
					return player.isHealthy() ? 0 : 1;
				},
			},
			halfneg: true,
		},
		subSkill: {
			effect: {
				charlotte: true,
				trigger: { player: "useCard" },
				forced: true,
				popup: false,
				async content(event, trigger, player) {
					trigger.directHit.addArray(game.filterPlayer());
				},
				ai: {
					threaten: 1.5,
					directHit_ai: true,
				},
			},
		},
	},
	// 车胄
	// 沟槽的秘密指定还在追我
	psanmou: {
		trigger: {
			player: "enterGame",
			global: "phaseBefore",
		},
		forced: true,
		filter(event, player) {
			return (event.name != "phase" || game.phaseNumber == 0) && game.hasPlayer(target => target != player);
		},
		async content(event, trigger, player) {
			const result = await player
				.chooseTarget(`暗谋：请暗中指定一名其他角色，然后你与其互相对对方使用牌无次数限制`, true, lib.filter.notMe)
				.set("ai", target => -get.attitude(get.player(), target))
				.set("animate", false)
				.forResult();
			if (result?.targets) {
				const target = result.targets[0],
					skill = event.name + "_effect";
				player.addSkill(skill);
				player.updateStorage(skill, storage => storage.concat([target]).sortBySeat(), false);
				if (!player.storage[skill]) {
					player.storage[skill] = [];
				}
				player.storage[skill].add(target);
				player.storage[skill].sortBySeat();
				//我自己选的我自己会不知道？(doge)
				const func = (player, target, skill) => {
					player.markSkill(skill, null, null, true);
				};
				if (event.isMine()) {
					func(player, target, skill);
				} else if (player.isOnline2()) {
					player.send(func, player, target, skill);
				}
				target.addSkill(skill);
				target.updateStorage(skill, storage => storage.concat([player]).sortBySeat(), false);
			}
		},
		subSkill: {
			effect: {
				charlotte: true,
				onremove: true,
				intro: {
					content: "players",
				},
				mod: {
					cardUsableTarget(card, player, target) {
						if (player.getStorage("psanmou_effect").includes(target)) {
							return Infinity;
						}
					},
				},
			},
		},
	},
	pstousuan: {
		trigger: { global: "damageBegin1" },
		filter(event, player) {
			const skill = "psanmou_effect";
			if (!event.source) {
				return false;
			}
			if (event.source != player && event.player != player) {
				return false;
			}
			return event.source.getStorage(skill).includes(event.player) && !event.source.getRoundHistory("sourceDamage", evt => evt.player == player).length;
		},
		forced: true,
		async content(event, trigger, player) {
			trigger.num++;
			await player.draw(3);
			await player.removeSkills(event.name);
		},
		ai: {
			combo: "psanmou",
		},
	},
	// 雍闿
	// 你也有xiaofan？
	psxiaofan: {
		trigger: { global: ["loseAfter", "equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter", "damageEnd"] },
		filter(event, player, name, target) {
			if (!target?.isIn()) {
				return false;
			}
			if (event.name == "damage") {
				return target.group == "shu" && event.getParent().name != "psxiaofan";
			}
			return true;
		},
		getIndex(event, player, name) {
			if (event.name == "damage") {
				return [event.player];
			}
			return game
				.filterPlayer(current => {
					if (current.group != "wu") {
						return false;
					}
					return event.getl?.(current)?.cards2?.some(card => get.type(card) == "equip");
				})
				.sortBySeat();
		},
		logTarget: (event, player, triggername, target) => target,
		check(event, player, triggername, target) {
			if (event.name == "damage") {
				return get.damageEffect(target, player, player) > 0;
			}
			return [player, target].reduce((sum, i) => sum + get.effect(i, { name: "draw" }, player, player), 0) > 0;
		},
		prompt2(event, player, triggername, target) {
			if (event.name == "damage") {
				return `对${get.translation(target)}造成1点伤害${player.group != "wu" ? "，然后你变更势力至吴" : ""}`;
			}
			return `与${get.translation(target)}各摸一张牌${player.group != "qun" ? "，然后你变更势力至群" : ""}`;
		},
		async content(event, trigger, player) {
			const {
				targets: [target],
			} = event;
			if (trigger.name == "damage") {
				await target.damage();
				if (player.group != "wu") {
					await player.changeGroup("wu");
				}
			} else {
				await game.asyncDraw([player, target].sortBySeat());
				if (player.group != "qun") {
					await player.changeGroup("qun");
				}
			}
		},
		group: "psxiaofan_source",
		subSkill: {
			source: {
				trigger: { global: "damageSource" },
				filter(event, player) {
					return event.source?.group === "qun" && event.cards?.someInD();
				},
				prompt2(event, player) {
					return `获得${get.translation(event.cards.filterInD())}${player.group != "shu" ? "，然后你变更势力至蜀" : ""}`;
				},
				async content(event, trigger, player) {
					if (trigger.cards?.someInD()) {
						await player.gain(trigger.cards.filterInD(), "gain2");
					}
					if (player.group != "shu") {
						await player.changeGroup("shu");
					}
				},
			},
		},
	},
	psjiaohu: {
		groupSkill: "shu",
		trigger: { player: "phaseDrawBegin2" },
		filter(event, player) {
			return !event.numFixed && player.group == "shu";
		},
		forced: true,
		async content(event, trigger, player) {
			const target = game.findPlayer(current => get.info("jsrgzhenglve").isFirst(current));
			let num = 1;
			if (target?.getDamagedHp()) {
				num += target.getDamagedHp();
			}
			trigger.num += num;
		},
	},
	psquanpan: {
		groupSkill: "wu",
		trigger: {
			player: "gainAfter",
			global: "loseAsyncAfter",
		},
		filter(event, player) {
			if (!game.hasPlayer(current => current != player) || player.group != "wu") {
				return false;
			}
			return event.getg?.(player).some(card => get.owner(card) == player && get.position(card) == "h" && get.type(card) == "equip");
		},
		async cost(event, trigger, player) {
			const cards = trigger.getg(player).filter(card => get.owner(card) == player && get.position(card) == "h" && get.type(card) == "equip");
			event.result = await player
				.chooseCardTarget({
					prompt: get.prompt(event.skill),
					prompt2: "展示并交给一名其他角色其中一张牌",
					filterCard(card) {
						return get.event("cards").includes(card);
					},
					filterTarget: lib.filter.notMe,
					ai1(card) {
						return 3 / (Math.abs(get.value(card)) + 0.1);
					},
					ai2(target) {
						const player = get.player();
						return get.value(ui.selected.cards, target) * get.attitude(player, target);
					},
				})
				.set("cards", cards)
				.forResult();
		},
		async content(event, trigger, player) {
			const {
				cards,
				targets: [target],
			} = event;
			await player.showCards(cards, `${get.translation(player)}发动了【${get.translation(event.name)}】`);
			await player.give(cards, target);
		},
	},
	pshuoluan: {
		groupSkill: "qun",
		trigger: { global: "damageBegin1" },
		filter(event, player) {
			const { player: target, source } = event;
			if (!source) {
				return false;
			}
			const list = [target, source];
			if (!list.includes(player) || player.group != "qun") {
				return false;
			}
			if (player == source) {
				list.reverse();
			}
			return list[1].group == "shu";
		},
		forced: true,
		async content(event, trigger, player) {
			trigger.num++;
		},
	},
	//【众】
	hm_zhong_heart_skill: {
		equipSkill: true,
		forced: true,
		trigger: {
			player: "damageEnd",
		},
		async content(event, trigger, player) {
			player.addSkill("hm_zhong_heart_skill_buff");
			player.addMark("hm_zhong_heart_skill_buff", player.countCards("e", { name: "hm_zhong_heart" }));
		},
		subSkill: {
			buff: {
				charlotte: true,
				mod: {
					attackRange(player, num) {
						return num + player.countMark("hm_zhong_heart_skill_buff");
					},
					targetInRange(card) {
						if (card.name == "sha") {
							return true;
						}
					},
				},
			},
		},
	},
	hm_zhong_diamond_skill: {
		equipSkill: true,
		forced: true,
		trigger: {
			player: "damageEnd",
		},
		async content(event, trigger, player) {
			await player.draw(2 * player.countCards("e", { name: "hm_zhong_diamond" }));
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
						let num = target.countCards("e", { name: "hm_zhong_diamond" });
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
	hm_zhong_club_skill: {
		equipSkill: true,
		forced: true,
		trigger: {
			player: "damageEnd",
		},
		async content(event, trigger, player) {
			player.addSkill("hm_zhong_club_skill_buff");
			player.addMark("hm_zhong_club_skill_buff", player.countCards("e", { name: "hm_zhong_club" }));
		},
		subSkill: {
			buff: {
				charlotte: true,
				mod: {
					maxHandcard(player, num) {
						return num + player.countMark("hm_zhong_club_skill_buff");
					},
				},
			},
		},
	},
	hm_zhong_spade_skill: {
		equipSkill: true,
		forced: true,
		trigger: {
			player: "damageEnd",
		},
		async content(event, trigger, player) {
			player.addSkill("hm_zhong_spade_skill_buff");
			player.addMark("hm_zhong_spade_skill_buff", player.countCards("e", { name: "hm_zhong_spade" }));
		},
		subSkill: {
			buff: {
				charlotte: true,
				mod: {
					globalFrom(from, to, current) {
						return current - from.countMark("hm_zhong_club_skill_buff");
					},
					globalTo(from, to, current) {
						return current + to.countMark("hm_zhong_club_skill_buff");
					},
				},
			},
		},
	},
	//白绕
	hm_huoyin: {
		mod: {
			cardUsableTarget(card, player, target, result) {
				if (player.inRange(target) && target.inRange(player)) {
					if (card.name == "sha") {
						return true;
					}
				}
			},
		},
		group: "hm_huoyin_damageSource",
		subSkill: {
			damageSource: {
				trigger: {
					source: "damageSource",
				},
				filter(event) {
					const { source, player } = event;
					return player.inRange(source) && source.inRange(player);
				},
				forced: true,
				async content(event, trigger, player) {
					await player.draw();
					await trigger.player.chooseToUse("【祸引】：是否使用一张牌？");
				},
			},
		},
	},
	//唐周
	hm_jukou: {
		enable: "phaseUse",
		usable: 1,
		filterTarget: lib.filter.notMe,
		subSkill: {
			sha: {
				charlotte: true,
				mod: {
					cardEnabled(card, player) {
						if (card.name == "sha") {
							return false;
						}
					},
				},
			},
			handcard: {
				charlotte: true,
				mod: {
					cardEnabled(card) {
						if (get.position(card) == "h") {
							return false;
						}
					},
				},
			},
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			const name = get.translation(target.name);
			const dialog = [
				"请选择一项",
				[
					[
						["draw", `令${name}摸一张牌`],
						["gain", `令${name}获得武将牌上所有的牌`],
					],
					"textbutton",
				],
			];
			const next = player.chooseButton(dialog, true);
			next.set("ai", function (button) {
				return Math.random();
			});
			next.set("targetx", target);
			next.set("filterButton", function (button) {
				const evt = _status.event;
				const { targetx } = evt;
				if (button.link == "gain") {
					return targetx.countCards("xs", card => !card._cardid) > 0;
				}
				return true;
			});
			const result = await next.forResult();
			if (result.bool) {
				switch (result.links[0]) {
					case "gain":
						await target.gain(
							target.getCards("xs", card => !card._cardid),
							"draw"
						);
						target.addTempSkill("hm_jukou_handcard");
						break;
					case "draw":
						await target.draw();
						target.addTempSkill("hm_jukou_sha");
						break;
				}
			}
		},
		ai: {
			order: 1,
			result: {
				target: 1,
			},
			threaten: 1.5,
		},
	},
	hm_weichenn: {
		limited: true,
		enable: "phaseUse",
		filterTarget: lib.filter.notMe,
		selectTarget: 2,
		targetprompt: ["展示手牌", "摸牌"],
		complexTarget: true,
		multitarget: true,
		async content(event, trigger, player) {
			const { targets } = event;
			player.awakenSkill(event.name);
			await player.showCards(targets[0].getCards("h"));
			await game.asyncDraw([player, targets[1]], 3);
			for (const i of targets) {
				i.addTempSkill("hm_weichenn_buff");
			}
			while (true) {
				const list = targets[0].getCards("h", card => get.tag(card, "damage"));
				if (!list.some(c => targets[0].canUse(c, targets[1], true))) {
					break;
				}
				const next2 = await targets[0]
					.chooseToUse(function (card, player, event) {
						let bool = get.tag(card, "damage");
						if (!bool) {
							return false;
						}
						return lib.filter.cardEnabled.apply(this, arguments);
					}, "违谶：对" + get.translation(targets[1]) + "使用一张伤害牌")
					.set("complexSelect", true)
					.set("filterTarget", function (card, player, target) {
						if (target != _status.event.sourcex && !ui.selected.targets.includes(_status.event.sourcex)) {
							return false;
						}
						return lib.filter.targetEnabled.apply(this, arguments);
					})
					.set("sourcex", targets[1])
					.set("forced", true);
				const result2 = await next2.forResult();
				if (!result2.bool) {
					break;
				}
			}
		},
		subSkill: {
			buff: {
				charlotte: true,
				mod: {
					cardUsable(card, player, num) {
						return Infinity;
					},
				},
			},
		},
	},
	//浮云
	hm_shuiqu: {
		trigger: { global: "phaseDiscardBegin" },
		forced: true,
		filter(event, player) {
			const hs = player.getCards("h");
			if (!hs.length) {
				return false;
			}
			return hs.every(card => lib.filter.cardDiscardable(card, player, "hm_shuiqu"));
		},
		async content(event, trigger, player) {
			await player.chooseToDiscard(true, "h", player.countCards("h"));
			let result;
			if (player.isDamaged()) {
				result = await player
					.chooseControl("baonue_hp", "baonue_maxHp", function (event, player) {
						if (player.hp == player.maxHp) {
							return "baonue_maxHp";
						}
						if (player.hp < player.maxHp - 1 || player.hp <= 2) {
							return "baonue_hp";
						}
						return "baonue_hp";
					})
					.set("prompt", "随去：回复1点体力或加1点体力上限")
					.forResult();
			} else {
				result = { control: "baonue_maxHp" };
			}
			if (!result?.control) {
				return;
			}
			if (result.control == "baonue_hp") {
				await player.recover();
			} else {
				await player.gainMaxHp();
			}
		},
	},
	hm_yure: {
		limited: true,
		trigger: {
			player: "loseAfter",
			global: "loseAsyncAfter",
		},
		filter(event, player) {
			if (event.type != "discard" || event.getlx === false || !game.hasPlayer(current => player != current)) {
				return false;
			}
			return event.getl?.(player)?.cards2?.someInD("d");
		},
		async cost(event, trigger, player) {
			const cards = trigger.getl(player).cards2.filterInD("d");
			event.result = await player
				.chooseTarget(lib.filter.notMe, get.prompt(event.skill), `将${get.translation(cards)}交给一名其他角色`)
				.set("ai", target => {
					const { player, cards } = get.event();
					if (cards.length < 3) {
						return 0;
					}
					let att = get.attitude(player, target);
					if (att < 3) {
						return 0;
					}
					if (target.hasSkillTag("nogain")) {
						att /= 10;
					}
					if (target.hasJudge("lebu")) {
						att /= 5;
					}
					if (target.hasSha() && cards.some(card => card.name == "sha")) {
						att /= 5;
					}
					if (target.needsToDiscard(1) && cards.some(card => card.name == "wuxie")) {
						att /= 5;
					}
					return att / (1 + get.distance(player, target, "absolute"));
				})
				.set("cards", cards)
				.forResult();
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			player.awakenSkill(event.name);
			await target.gain(trigger.getl(player).cards2.filterInD("d"), "gain2").set("giver", player);
		},
	},
	//陶升
	hm_zhannei: {
		limited: true,
		enable: "phaseUse",
		filterTarget: lib.filter.notMe,
		async content(event, trigger, player) {
			player.awakenSkill(event.name);
			player.addTempSkill("hm_zhannei_distance", { player: "dying" });
			player.storage.hm_zhannei_distance = event.targets[0];
		},
		subSkill: {
			distance: {
				charlotte: true,
				onremove: true,
				mod: {
					globalFrom(from, to) {
						if (from.storage.hm_zhannei_distance == to) {
							return -Infinity;
						}
					},
				},
			},
		},
	},
	hm_qianwei: {
		enable: "phaseUse",
		usable: 1,
		discard: false,
		filter(event, player) {
			return player.countCards("he", card => !get.tag(card, "damage"));
		},
		filterCard(card) {
			return !get.tag(card, "damage");
		},
		position: "he",
		selectCard: [1, Infinity],
		filterTarget(_, player, target) {
			return player.distanceTo(target) === 1;
		},
		async content(event, trigger, player) {
			const { cards, targets } = event;
			await player.showCards(cards);
			await player.give(cards, targets[0]);
			await player.draw(cards.length);
			const list = [].concat(cards);
			while (true) {
				if (!list.some(c => targets[0].hasUseTarget(c, true))) {
					break;
				}
				const next2 = targets[0].chooseCardButton(list);
				next2.set("prompt", "选择一张牌使用之");
				next2.set("target", targets[0]);
				next2.set("filterButton", function (button) {
					const evt = _status.event;
					return evt.target.hasUseTarget(button, true);
				});
				const result2 = await next2.forResult();
				if (result2.bool) {
					list.removeArray(result2.links);
					await targets[0].chooseUseTarget(result2.links[0]);
				} else {
					break;
				}
			}
		},
	},
	//于毒
	hm_dafu: {
		trigger: {
			player: "useCardToPlayered",
		},
		prompt2(event, player) {
			const name = event.target.name;
			return `是否令${get.translation(name)}摸一张牌并令其不能响应此牌？`;
		},
		filter(event, player) {
			return get.tag(event.card, "damage");
		},
		check(event, player) {
			return get.attitude(player, event.target) < 0;
		},
		async content(event, trigger, player) {
			await trigger.target.draw();
			trigger.getParent().directHit.add(trigger.target);
		},
	},
	hm_jipin: {
		trigger: {
			source: "damageSource",
		},
		filter(event, player) {
			return event.player.countCards("h") > player.countCards("h");
		},
		async cost(event, trigger, player) {
			const next = player.gainPlayerCard(trigger.player, "h");
			const result = await next.forResult();
			event.result = {
				bool: result.bool,
				cards: result.cards,
				targets: [trigger.player],
			};
		},
		async content(event, trigger, player) {
			const next = player.chooseCardTarget();
			next.set("prompt", "将此牌交给一名其他角色");
			next.set("cardx", event.cards[0]);
			next.set("filterCard", function (card) {
				const evt = _status.event;
				return card == evt.cardx;
			});
			next.set("filterTarget", lib.filter.notMe);
			const result = await next.forResult();
			if (result.bool) {
				player.give(result.cards, result.targets[0], false);
			}
		},
	},
	//南华老仙
	hm_tianshu: {
		audio: "tianshu",
		trigger: { player: "phaseUseBegin" },
		filter(event, player) {
			return (
				player.countCards("he") &&
				!game.hasPlayer(function (current) {
					return current.countCards("ej", "taipingyaoshu");
				})
			);
		},
		async cost(event, trigger, player) {
			const next = player.chooseCardTarget({
				prompt: get.prompt2(event.skill),
				filterCard: true,
				filterTarget(card, player, target) {
					return target.canEquip("taipingyaoshu");
				},
				position: "he",
				ai1(card) {
					return 5 - get.value(card);
				},
				ai2(target) {
					var player = _status.event.player;
					if (get.attitude(player, target) > 0 && !target.hasEmptySlot(2)) {
						return 0;
					}
					return get.attitude(player, target);
				},
			});
			const result = await next.forResult();
			event.result = result;
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			let card;
			player.discard(event.cards);
			if (!lib.inpile.includes("taipingyaoshu")) {
				lib.inpile.push("taipingyaoshu");
				card = game.createCard2("taipingyaoshu", "heart", 3);
			} else {
				card = get.cardPile(function (card) {
					return card.name == "taipingyaoshu";
				});
			}
			if (card) {
				target.equip(card);
			}
		},
	},
	hm_yufeng: {
		usable: 1,
		enable: "phaseUse",
		async content(event, trigger, player) {
			const next = player.judge(card => {
				if (["diamond", "club"].includes(get.suit(card))) {
					return 2;
				}
				return 0;
			});
			const { suit } = await next.forResult();
			switch (suit) {
				case "spade":
					{
						if (!game.hasPlayer(current => player != current)) {
							return;
						}
						const result = await player
							.chooseTarget("【御风】：令一名其他角色跳过其下个回合的出牌阶段和弃牌阶段", lib.filter.notMe, true)
							.set("ai", target => {
								const player = get.player();
								const att = get.attitude(player, target);
								return att * lib.skill.yijin.getValue(player, "yijin_jinmi", target);
							})
							.forResult();
						if (result?.bool && result?.targets?.length) {
							const {
								targets: [target],
							} = result;
							target.skip("phaseUse");
							target.skip("phaseDiscard");
							target.addTempSkill(event.name + "_skipUse", { player: ["phaseUseSkipped", "phaseDiscardSkipped"] });
							game.log(target, "跳过其下个回合的出牌阶段和弃牌阶段");
						}
					}
					break;
				case "heart":
					{
						if (!game.hasPlayer(current => player != current)) {
							return;
						}
						const result = await player
							.chooseTarget("【御风】：令一名其他角色跳过其下个回合的摸牌阶段", lib.filter.notMe, true)
							.set("ai", target => {
								const player = get.player();
								const att = get.attitude(player, target);
								return att * lib.skill.yijin.getValue(player, "yijin_yongbi", target);
							})
							.forResult();
						if (result?.bool && result?.targets?.length) {
							const {
								targets: [target],
							} = result;
							target.skip("phaseDraw");
							target.addTempSkill(event.name + "_skipDraw", { player: "phaseDrawSkipped" });
							game.log(target, "跳过其下个回合的摸牌阶段");
						}
					}
					break;
				case "diamond":
				case "club":
					await player.draw();
					if (!player.getStat().skill.hm_yufeng) {
						return;
					}
					delete player.getStat().skill.hm_yufeng;
					game.log(player, "重置了", "#g【御风】");
					break;
			}
		},
		ai: {
			order: 13,
			result: { player: 1 },
			threaten: 1.5,
		},
		subSkill: {
			skipDraw: {
				charlotte: true,
				mark: true,
				intro: { content: "跳过下回合的摸牌阶段" },
			},
			skipUse: {
				charlotte: true,
				mark: true,
				intro: { content: "跳过下回合的出牌和弃牌阶段" },
			},
		},
	},
	//卜巳
	hm_weiluan: {
		trigger: {
			player: ["phaseZhunbeiBegin", "phaseDrawBegin2", "phaseUseBegin"],
		},
		forced: true,
		filter(event, player, triggername) {
			if (triggername === "phaseDrawBegin2") {
				return !event.numFixed;
			}
			return true;
		},
		async content(event, trigger, player) {
			const next = player.judge(function (card) {
				const suit = get.suit(card);
				if (suit == "spade") {
					return 4;
				}
				return 0;
			});
			next.judge2 = function (result) {
				return result.bool == false ? true : false;
			};
			const { suit } = await next.forResult();
			if (suit == "spade") {
				switch (event.triggername) {
					case "phaseZhunbeiBegin":
						player.addTempSkill("hm_weiluan_attackRange");
						break;
					case "phaseDrawBegin2":
						trigger.num++;
						break;
					case "phaseUseBegin":
						player.addTempSkills("hm_weiluan_sha");
						break;
				}
			}
		},
		subSkill: {
			attackRange: {
				charlotte: true,
				mod: {
					attackRange(player, num) {
						return num++;
					},
				},
			},
			sha: {
				charlotte: true,
				mod: {
					cardUsable(card, player, num) {
						if (card.name == "sha") {
							return num + 1;
						}
					},
				},
			},
		},
	},
	hm_tianpan: {
		trigger: {
			player: "judgeEnd",
		},
		forced: true,
		async content(event, trigger, player) {
			if (trigger.result.suit == "spade") {
				const control = await player
					.chooseControl("baonue_hp", "baonue_maxHp", function (event, player) {
						if (player.hp == player.maxHp) {
							return "baonue_maxHp";
						}
						if (player.hp < player.maxHp - 1 || player.hp <= 2) {
							return "baonue_hp";
						}
						return "baonue_hp";
					})
					.set("prompt", "天判：恢复1点体力或加1点体力上限")
					.forResultControl();
				if (control == "baonue_hp") {
					await player.recover();
				} else {
					await player.gainMaxHp(true);
				}
			} else {
				const control = await player
					.chooseControl("baonue_hp", "baonue_maxHp", function (event, player) {
						if (player.hp == player.maxHp) {
							return "baonue_hp";
						}
						if (player.hp < player.maxHp - 1 || player.hp <= 2) {
							return "baonue_maxHp";
						}
						return "baonue_hp";
					})
					.set("prompt", "天判：失去1点体力或减1点体力上限")
					.forResultControl();
				if (control == "baonue_hp") {
					await player.loseHp();
				} else {
					await player.loseMaxHp(true);
				}
			}
		},
	},
	hm_gaiming: {
		usable: 1,
		trigger: {
			player: "judge",
		},
		filter(event, player) {
			const card = player.judging[0];
			return get.suit(card, player) != "spade";
		},
		prompt2: "亮出牌堆顶的一张牌代替判定牌",
		async content(event, trigger, player) {
			const card = get.cards(1)[0];
			player.respond([card], "hm_gaiming", "highlight", "noOrdering");
			if (player.judging[0].clone) {
				player.judging[0].clone.classList.remove("thrownhighlight");
				game.broadcast(function (card) {
					if (card.clone) {
						card.clone.classList.remove("thrownhighlight");
					}
				}, player.judging[0]);
				game.addVideo("deletenode", player, get.cardsInfo([player.judging[0].clone]));
			}
			await game.cardsDiscard(player.judging[0]);
			player.judging[0] = card;
			trigger.orderingCards.add(card);
			game.log(player, "的判定牌改为", card);
			await game.delay(2);
		},
	},
	//珪固
	hm_tuntian: {
		trigger: { player: "phaseZhunbeiBegin" },
		forced: true,
		async content(event, trigger, player) {
			player.addTempSkill("hm_tuntian_temp", { player: "hm_qianjunAfter" });
			player.addMark("hm_tuntian_temp", 1, false);
		},
		subSkill: {
			temp: {
				charlotte: true,
				mod: {
					maxHandcard(player, num) {
						return num + player.countMark("hm_tuntian_temp");
					},
				},
				trigger: {
					player: ["phaseDrawBegin2", "damageBegin3"],
				},
				forced: true,
				filter(event, player) {
					if (event.name == "phaseDraw") {
						return !event.numFixed;
					}
					return game.getGlobalHistory("everything", evt => evt.name == "damage" && evt.player == player).indexOf(event) == 0;
				},
				async content(event, trigger, player) {
					trigger.num += player.countMark(event.name);
				},
				onremove: true,
				mark: true,
				intro: { content: "本局游戏的摸牌阶段摸牌数、手牌上限、本回合首次受到的伤害+#" },
			},
		},
	},
	hm_qianjun: {
		limited: true,
		enable: "phaseUse",
		seatRelated: "changeSeat",
		skillAnimation: true,
		animationColor: "orange",
		derivation: "olluanji",
		filter(event, player) {
			return player.countCards("e");
		},
		filterTarget: lib.filter.notMe,
		async content(event, trigger, player) {
			const target = event.targets[0];
			player.awakenSkill(event.name);
			await target.gain(player.getCards("e"), "gain2").set("giver", player);
			game.broadcastAll(
				function (target1, target2) {
					game.swapSeat(target1, target2);
				},
				player,
				target
			);
			await player.recover();
			await player.addSkills("olluanji");
		},
		ai: {
			order: 13,
			result: {
				player: 1,
				target: 2,
			},
			threaten: 1.5,
		},
	},
	//神朱儁
	hm_cheji: {
		usable: 1,
		enable: "phaseUse",
		filterCard: true,
		selectCard: [1, Infinity],
		position: "he",
		discard: false,
		prompt: "重铸任意张牌，然后令一名其他角色重铸等量张手牌",
		filterTarget: lib.filter.notMe,
		async content(event, trigger, player) {
			const { cards, targets } = event;
			await player.recast(cards);
			const target = targets[0];
			const next = target.chooseCard(`选择重铸${cards.length}张牌`, "h", cards.length, true, (card, player) => player.canRecast(card));
			const result = await next.forResult();
			if (result.bool) {
				await target.recast(result.cards);
				const cardname = result.cards.map(c => c.name).unique();
				if (cardname.includes("sha")) {
					await target.damage("fire", player);
				}
				if (cardname.includes("shan") && target.hasUseTarget({ name: "sha", isCard: true })) {
					const next2 = player.chooseTarget("选择使用【杀】的目标", true);
					next2.set("filterTarget", function (card, player, targetx) {
						return lib.filter.filterTarget({ name: "sha", isCard: true }, target, targetx);
					});
					next2.set("ai", targetx => get.effect(targetx, { name: "sha", isCard: true }, get.event().target, get.player()));
					next2.set("target", target);
					const result2 = await next2.forResult();
					if (result2.bool) {
						await target.chooseUseTarget({ name: "sha", isCard: true }, true, result2.targets);
					}
				}
				if (cardname.includes("tao")) {
					await game.asyncDraw([player, target], 2);
				}
			}
		},
		ai: {
			order: 1,
			result: {
				player: 1,
			},
			threaten: 1.5,
		},
	},
	hm_daicui: {
		trigger: {
			global: "useCardToPlayered",
		},
		filter(event, player) {
			if (_status.currentPhase != player || !get.discarded().length) {
				return false;
			}
			return event.card.name == "sha" && event.card.hasNature();
		},
		forced: true,
		async content(event, trigger, player) {
			const { target } = trigger;
			const discarded = get.discarded();
			const min = Math.max(0, discarded.length);
			const next = target.chooseCard("he", [min, Infinity], true);
			next.set("prompt2", "置于武将牌上直到回合结束");
			const { bool, cards } = await next.forResult();
			if (bool) {
				target.addSkill("hm_daicui_expansion");
				target.addToExpansion("giveAuto", cards, target).gaintag.add("hm_daicui_expansion");
				trigger.getParent().baseDamage++;
			}
		},
		subSkill: {
			expansion: {
				trigger: {
					global: "phaseEnd",
				},
				forced: true,
				popup: false,
				charlotte: true,
				filter(event, player) {
					return player.getExpansions("hm_daicui_expansion").length > 0;
				},
				async content(event, trigger, player) {
					var cards = player.getExpansions("hm_daicui_expansion");
					await player.gain(cards, "draw");
					game.log(player, "收回了" + get.cnNumber(cards.length) + "张“怠摧”牌");
					player.removeSkill("hm_daicui_expansion");
				},
				intro: {
					markcount: "expansion",
					mark(dialog, storage, player) {
						var cards = player.getExpansions("hm_daicui_expansion");
						if (player.isUnderControl(true)) {
							dialog.addAuto(cards);
						} else {
							return "共有" + get.cnNumber(cards.length) + "张牌";
						}
					},
				},
			},
		},
	},
	hm_kuixiang: {
		trigger: {
			global: "dyingAfter",
		},
		prompt2(event, player) {
			return `对${get.translation(event.player.name)}造成1点伤害`;
		},
		filter(event, player) {
			if (event.player == player || !event.player.isIn()) {
				return false;
			}
			return !player.getStorage("hm_kuixiang_used").includes(event.player);
		},
		onremove(player) {
			player.removeSkill("hm_kuixiang_used");
		},
		logTarget: "player",
		check(event, player) {
			return get.attitude(player, event.player) < 0;
		},
		async content(event, trigger, player) {
			const target = trigger.player;
			player.addSkill("hm_kuixiang_used");
			player.markAuto("hm_kuixiang_used", [target]);
			await target.damage(player);
			if (
				game.getGlobalHistory("everything", evt => {
					if (evt.name != "die" || evt.player != target) {
						return false;
					}
					return evt.reason?.getParent() == event;
				}).length > 0 &&
				target.isDead()
			) {
				const next = player.chooseBool("〖溃降〗：是否摸三张牌？");
				const bool = await next.forResultBool();
				if (bool) {
					await player.draw(3);
				}
			}
		},
		subSkill: {
			used: {
				intro: {
					content: "已对$发动过〖溃降〗",
				},
				charlotte: true,
				onremove: true,
			},
		},
	},
	//神皇甫嵩
	hm_shice: {
		zhuanhuanji: true,
		mark: true,
		marktext: "☯",
		intro: {
			content(storage, player, skill) {
				if (!storage) {
					return "当你受到属性伤害时，若你的技能数不大于伤害来源，你可以防止此伤害并视为使用一张【火攻】。";
				}
				return "当你不因此技能使用牌指定唯一目标后，你可以令其弃置装备区任意张牌，然后此牌额外结算X次（X为其装备区的牌数）。";
			},
		},
		trigger: { player: ["damageBegin4", "useCardToPlayered"] },
		filter(event, player) {
			const storage = player.storage.hm_shice;
			if (!storage && event.name == "damage") {
				const { source } = event;
				if (!source) {
					return false;
				}
				return event.hasNature() && lib.skill.jsrgjuxia.countSkill(source) >= lib.skill.jsrgjuxia.countSkill(player);
			} else if (storage && event.name == "useCardToPlayered") {
				return event.getParent(3).name !== "hm_shice" && event.targets?.length === 1 && event.targets[0].countCards("e");
			}
			return false;
		},
		async cost(event, trigger, player) {
			const { source, target, card, nature } = trigger;
			if (trigger.name == "damage") {
				event.result = await player
					.chooseBool(get.prompt(event.skill), "防止此伤害并视为使用一张【火攻】")
					.set("choice", get.damageEffect(player, source, player, nature) < 0)
					.forResult();
			} else {
				const bool = await player
					.chooseBool(get.prompt(event.skill, target), "令其弃置装备区任意张牌，然后此牌额外结算X次（X为其装备区的牌数）")
					.set("choice", get.effect(target, card, player, player) > 0)
					.forResultBool();
				event.result = {
					bool: bool,
					targets: [target],
				};
			}
		},
		async content(event, trigger, player) {
			player.changeZhuanhuanji(event.name);
			if (trigger.name == "damage") {
				trigger.cancel();
				const huogong = get.autoViewAs({ name: "huogong", isCard: true });
				if (player.hasUseTarget(huogong)) {
					await player.chooseUseTarget(huogong, true);
				}
			} else {
				const { target, card } = trigger;
				if (target.countCards("e")) {
					await target
						.chooseToDiscard("e", [1, Infinity], "弃置装备区任意张牌，然后" + get.translation(card) + "额外结算X次（X为你装备区的牌数）")
						.set("ai", card => {
							if (get.event("goon")) {
								return 0;
							}
							return 7 - get.value(card);
						})
						.set("goon", get.effect(target, card, player, target) > 0);
				}
				const num = target.countCards("e");
				if (!num) {
					return;
				}
				trigger.getParent().effectCount += num;
				game.log(card, `额外结算${num}次`);
			}
		},
	},
	hm_podai: {
		trigger: { global: ["phaseBegin", "phaseEnd"] },
		filter(event, player) {
			const storage = player.getStorage("hm_podai_round");
			if (!event.player.isIn() || storage.length > 1) {
				return false;
			}
			return !storage.includes("draw") || (!storage.includes("disable") && lib.skill.hm_podai.getSkills(event.player).length);
		},
		infoTranslationIncludesString(skill, list, player) {
			const text = get.skillInfoTranslation(skill, player);
			const plainText = get.plainText(text);
			return list.some(key => plainText.includes(key));
		},
		derivation: "hm_podai_faq",
		getSkills(player) {
			return player.getSkills(null, false, true).filter(skill => {
				const info = get.info(skill);
				//无人生还
				const list = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"]
					.concat(["零", "一", "二", "两", "三", "四", "五", "六", "七", "八", "九", "十"])
					.concat(["壹", "贰", "叁", "肆", "伍", "陆", "柒", "捌", "玖", "拾", "佰", "仟", "万", "亿"])
					.concat(get.cardTranslation(c => get.type(c) == "basic"));
				if (!info || info.charlotte || info.persevereSkill) {
					return false;
				}
				return lib.skill.hm_podai.infoTranslationIncludesString(skill, list, player);
			});
		},
		async cost(event, trigger, player) {
			const { player: target } = trigger;
			const storage = player.getStorage("hm_podai_round");
			const name = get.translation(target);
			const dialog = [
				"请选择一项",
				[
					[
						["disable", `令${name}描述中含有基本牌名或数字的一个技能失效`],
						["draw", `令${name}摸三张牌，然后对其造成1点火焰伤害。`],
					],
					"textbutton",
				],
			];
			const next = player.chooseButton(dialog);
			next.set("ai", button => {
				const { player, target } = get.event();
				const { link } = button;
				if (link == "disable") {
					return -(get.threaten(target, player) * get.attitude(player, target));
				} else {
					if (get.attitude(player, target) > 0 && (target.hasSkillTag("nofire") || target.hasSkillTag("nodamage"))) {
						return 1;
					}
					return get.damageEffect(target, player, player, "fire") + get.effect(target, { name: "draw" }, player, player) * 3;
				}
			});
			next.set("filterButton", button => {
				const { player, target, storage } = get.event();
				const { link } = button;
				if (storage.includes(link)) {
					return false;
				}
				const skill = lib.skill.hm_podai.getSkills(target);
				return link !== "disable" || skill.length;
			});
			next.set("target", target);
			next.set("storage", storage);
			const result = await next.forResult();
			event.result = {
				bool: result.bool,
				cost_data: result.links?.[0],
			};
		},
		logTarget: "player",
		async content(event, trigger, player) {
			const { cost_data } = event;
			const { player: target } = trigger;
			player.addTempSkill("hm_podai_round", "roundStart");
			player.markAuto("hm_podai_round", [cost_data]);
			if (cost_data === "disable") {
				const list = lib.skill.hm_podai.getSkills(target);
				if (!list.length) {
					return;
				}
				const dialog = ui.create.dialog(`令${get.translation(target)}的一个技能失效`, [list, "skill"]);
				const next = player.chooseButton(dialog, true);
				const result = await next.forResult();
				if (result.bool) {
					target.addSkill("hm_podai_sb");
					target.markAuto("hm_podai_sb", [result.links[0]]);
				}
			} else if (cost_data === "draw") {
				await target.draw(3);
				await target.damage("fire", player);
			}
		},
		subSkill: {
			round: {
				charlotte: true,
				onremove: true,
			},
			sb: {
				init(player, skill) {
					player.storage[skill] = [];
					player.addSkillBlocker(skill);
				},
				onremove(player, skill) {
					player.removeSkillBlocker(skill);
				},
				charlotte: true,
				skillBlocker(skill, player) {
					return player.getStorage("hm_podai_sb").includes(skill);
				},
				mark: true,
				intro: {
					content(storage, player, skill) {
						const list = player.getSkills(null, false, false).filter(i => {
							return lib.skill.hm_podai_sb.skillBlocker(i, player);
						});
						if (list.length) {
							return "失效技能：" + get.translation(list);
						}
						return "无失效技能";
					},
				},
			},
		},
	},
	//神卢植
	hm_jigan: {
		trigger: { global: "phaseAfter" },
		setDistanceObj(player) {
			const obj = {};
			for (const i of game.players) {
				if (!obj[i.playerid]) {
					obj[i.playerid] = {};
				}
				for (const j of game.players) {
					//i到j的距离
					obj[i.playerid][j.playerid] = get.distance(i, j);
				}
			}
			player.storage["hm_jigan"] = obj;
		},
		filter(event, player) {
			let storage = player.storage["hm_jigan"];
			if (!storage) {
				lib.skill["hm_jigan"].setDistanceObj(player);
				storage = player.storage["hm_jigan"];
			}
			let bool = false;
			if (
				game.getGlobalHistory("everything", event => {
					if (event.name != "gain") {
						return false;
					}
					return event.giver;
				}).length
			) {
				bool = true;
			}
			for (const i of game.players) {
				for (const j of game.players) {
					if (storage[i.playerid]?.[j.playerid] != get.distance(i, j)) {
						bool = true;
					}
				}
			}
			return bool;
		},
		async cost(event, trigger, player) {
			const giver = [];
			game.getGlobalHistory("everything", event => {
				if (event.name != "gain") {
					return false;
				}
				return event.giver;
			}).forEach(evt => {
				giver.add(evt.giver);
			});
			const storage = player.storage["hm_jigan"];
			const distanceChanged = [];
			for (const i of game.players) {
				for (const j of game.players) {
					if (storage[i.playerid]?.[j.playerid] != get.distance(i, j)) {
						distanceChanged.add(i);
					}
				}
			}
			const targetsx = [].concat(giver).concat(distanceChanged);
			const next = player.chooseTarget("令其中两名角色分别视为使用一张基本牌");
			next.set("ai", target => {
				const player = get.player();
				const list = get.inpileVCardList(info => {
					if (info[0] != "basic") {
						return false;
					}
					return target.hasValueTarget({ name: info[2], nature: info[3], isCard: true });
				});
				if (!list.length) {
					return 0;
				}
				return get.attitude(player, target);
			});
			next.set("selectTarget", [2, 2]);
			next.set("targetsx", targetsx);
			next.set("filterTarget", (card, player, target) => {
				const evt = get.event();
				return evt.targetsx.includes(target);
			});
			const { result } = await next;
			lib.skill["hm_jigan"].setDistanceObj(player);
			event.result = result;
		},
		async content(event, trigger, player) {
			const { targets } = event;
			for (const target of targets.sortBySeat()) {
				const list = get.inpileVCardList(info => {
					if (info[0] != "basic") {
						return false;
					}
					return target.hasUseTarget({ name: info[2], nature: info[3], isCard: true });
				});
				if (list.length) {
					const next = target.chooseButton(["是否视为使用一张基本牌？", [list, "vcard"]]);
					next.set("ai", button => {
						const player = get.player();
						const card = {
							name: button.link[2],
							nature: button.link[3],
							isCard: true,
						};
						return player.getUseValue(card);
					});
					const links = await next.forResultLinks();
					if (!links?.length) {
						return;
					}
					const card = { name: links[0][2], nature: links[0][3], isCard: true };
					await target.chooseUseTarget(card, true);
				}
			}
		},
		group: "hm_jigan_gameStart",
		subSkill: {
			gameStart: {
				charlotte: true,
				trigger: {
					global: "phaseBefore",
					player: "enterGame",
				},
				silent: true,
				filter(event, player) {
					return event.name != "phase" || game.phaseNumber == 0;
				},
				async content(event, trigger, player) {
					lib.skill["hm_jigan"].setDistanceObj(player);
				},
			},
		},
	},
	hm_weizhu: {
		enable: "phaseUse",
		usable: 1,
		filterCard: true,
		selectCard: [1, Infinity],
		discard: false,
		lose: false,
		async content(event, trigger, player) {
			const { cards } = event;
			await player.recast(cards);
			const equip = Array.from(ui.discardPile.childNodes).filter(c => get.type(c) === "equip");
			if (cards.length >= equip.length) {
				await player.gain(equip);
			} else {
				const next = player.chooseCardButton(equip, true);
				next.set("selectButton", cards.length);
				const { result } = await next;
				if (result.bool) {
					await player.gain(result.links);
				}
			}
			if (_status.connectMode) {
				game.broadcastAll(() => (_status.noclearcountdown = true));
			}
			const map = new Map();
			while (player.countCards("he")) {
				const { result } = await player.chooseCardTarget({
					forced: true,
					map: map,
					position: "he",
					prompt: "围铸：请选择要分配的卡牌和目标",
					filterTarget(card, player, target) {
						return player != target && !get.event().map.has(target);
					},
					filterCard(card) {
						return !card.hasGaintag("hm_weizhu_tag");
					},
					ai1(card) {
						const { player, map } = get.event();
						return Math.max(
							...game.filterPlayer().map(target => {
								return [...ui.selected.cards, card, ...(map.get(target) || [])].reduce((sum, cardx) => {
									return sum + get.value(cardx, target) * get.attitude(player, target);
								}, 0);
							})
						);
					},
					ai2(target) {
						const player = get.player();
						const card = ui.selected.cards[0];
						if (card) {
							return get.value(card, target) * get.attitude(player, target);
						}
						return 0;
					},
				});
				if (result?.bool && result.targets?.length && result.cards?.length) {
					const target = result.targets[0];
					player.addGaintag(result.cards, "hm_weizhu_tag");
					map.set(target, result.cards);
					if (map.size >= cards.length || map.size >= game.countPlayer(target => target != player)) {
						break;
					}
				} else {
					break;
				}
			}
			if (_status.connectMode) {
				game.broadcastAll(() => {
					delete _status.noclearcountdown;
					game.stopCountChoose();
				});
			}
			if (map.size) {
				const gain_list = [];
				map.forEach((cards, source) => {
					player.line(source, "green");
					gain_list.push([source, cards]);
					source.addTempSkill("hm_weizhu_buff", "roundStart");
				});
				await game
					.loseAsync({
						gain_list: gain_list,
						player: player,
						giver: player,
						animate: "giveAuto",
					})
					.setContent("gaincardMultiple");
			}
		},
		subSkill: {
			tag: {},
			buff: {
				charlotte: true,
				mod: {
					globalFrom(from, to, distance) {
						return distance - 1;
					},
				},
			},
		},
	},
	hm_guiquan: {
		enable: "chooseToUse",
		init(player, skill) {
			player.storage[skill] = [];
		},
		filter(event, player) {
			const cards = player.getCards("hes", { type: "equip" });
			if (!cards.length) {
				return false;
			}
			return lib.inpile.some(name => {
				if (player.getStorage("hm_guiquan").includes(name)) {
					return false;
				}
				if (get.type(name) != "trick") {
					return false;
				}
				let bool = false;
				for (const card of cards) {
					const vcard = get.autoViewAs({ name }, card);
					if (event.filterCard(vcard, player, event)) {
						bool = true;
					}
				}
				return bool;
			});
		},
		chooseButton: {
			dialog(event, player) {
				const list = [];
				for (const name of lib.inpile) {
					if (player.getStorage("hm_guiquan").includes(name)) {
						continue;
					}
					if (get.type(name) == "trick") {
						list.push(["锦囊", "", name]);
					}
				}
				return ui.create.dialog(get.translation("hm_guiquan"), [list, "vcard"]);
			},
			filter(button, player) {
				const event = _status.event.getParent(),
					card = get.autoViewAs({
						name: button.link[2],
					});
				return event.filterCard(card, player, event);
			},
			backup(links, player) {
				return {
					filterCard(card) {
						return get.type(card) == "equip";
					},
					filterTarget(card, player, target) {
						if (target.hp > player.hp) {
							return false;
						}
						return lib.filter.filterTarget.apply(this, arguments);
					},
					selectCard: 1,
					position: "hes",
					popname: true,
					viewAs: { name: links[0][2] },
					onuse(result, player) {
						const { card } = result;
						player.getStorage("hm_guiquan").add(card.name);
					},
				};
			},
			prompt(links, player) {
				return "将一张装备牌当作" + get.translation(links[0][2]) + "使用";
			},
		},
		ai: {
			order: 1,
			result: {
				//Waiting For 157
				player(player) {
					var num = 0;
					return 12 - num;
				},
			},
			threaten: 1.6,
		},
	},
	//程远志
	hm_wuxiao: {
		trigger: {
			global: ["loseAfter", "equipAfter", "loseAsyncAfter", "cardsDiscardAfter"],
		},
		filter(event, player, name) {
			if (!event.getd?.().some(card => get.color(card, false) === "red")) {
				return false;
			}
			return (
				game.getGlobalHistory("everything", evt => {
					return evt.getd?.()?.some(card => get.color(card, false) === "red");
				}).length == 1
			);
		},
		forced: true,
		async content(event, trigger, player) {
			player.addTempSkill(["hm_wuxiao_buff", "hm_wuxiao_debuff"]);
		},
		subSkill: {
			buff: {
				charlotte: true,
				forced: true,
				trigger: {
					source: "damageBegin1",
				},
				async content(event, trigger, player) {
					trigger.num++;
					player.removeSkill("hm_wuxiao_buff");
				},
			},
			debuff: {
				charlotte: true,
				forced: true,
				trigger: {
					player: "damageBegin3",
				},
				async content(event, trigger, player) {
					trigger.num++;
					player.removeSkill("hm_wuxiao_debuff");
				},
			},
		},
	},
	hm_qianhu: {
		enable: "phaseUse",
		filterCard: card => get.color(card) == "red",
		filter(event, player) {
			return player.countCards("he", { color: "red" }) > 1 && player.hasUseTarget("juedou");
		},
		selectCard: 2,
		position: "he",
		check(card) {
			return 6 - get.value(card);
		},
		async content(event, trigger, player) {
			await player.chooseUseTarget("juedou", true);
		},
		group: "hm_qianhu_draw",
		subSkill: {
			draw: {
				trigger: {
					source: "damageSource",
				},
				filter(event, player) {
					return event.getParent(5).skill == "hm_qianhu";
				},
				silent: true,
				charlotte: true,
				async content(event, trigger, player) {
					await player.draw();
				},
			},
		},
		ai: {
			order: 9,
			result: {
				player(player) {
					if (player.getUseValue({ name: "juedou" }) < 0) {
						return 0;
					}
					return 1;
				},
			},
		},
	},
	//高升
	hm_xiongshi: {
		global: "hm_xiongshi_global",
		mark: true,
		intro: {
			markcount: "expansion",
			mark(dialog, content, player) {
				var content = player.getExpansions("hm_xiongshi");
				if (content && content.length) {
					if (player == game.me || player.isUnderControl()) {
						dialog.addAuto(content);
					} else {
						return "共有" + get.cnNumber(content.length) + "张“凶势”";
					}
				}
			},
			content(content, player) {
				var content = player.getExpansions("hm_xiongshi");
				if (content && content.length) {
					if (player == game.me || player.isUnderControl()) {
						return get.translation(content);
					}
					return "共有" + get.cnNumber(content.length) + "张“凶势”";
				}
			},
		},
		subSkill: {
			global: {
				audio: "hm_xiongshi",
				enable: "phaseUse",
				filter(event, player) {
					if (player.hasSkill("hm_xiongshi_used")) {
						return false;
					}
					return (
						player.countCards("he") &&
						game.hasPlayer(function (current) {
							return current.hasSkill("hm_xiongshi");
						})
					);
				},
				log: false,
				delay: false,
				filterCard: true,
				discard: false,
				lose: false,
				position: "he",
				prompt() {
					var player = _status.event.player;
					var list = game.filterPlayer(function (current) {
						return current.hasSkill("hm_xiongshi");
					});
					if (list.length == 1 && list[0] == player) {
						return "将一张牌置于你的武将牌上";
					}
					let str = "将一张牌置于" + get.translation(list);
					if (list.length > 1) {
						return (str += "其中一人的武将牌上");
					}
					return (str += "的武将牌上");
				},
				filterTarget(card, player, target) {
					return target.hasSkill("hm_xiongshi");
				},
				check(card) {
					return 8 - get.value(card);
				},
				async content(event, trigger, player) {
					const { targets, cards } = event;
					targets[0].addToExpansion(cards, player, "giveAuto").gaintag.add("hm_xiongshi");
					player.addTempSkill("hm_xiongshi_used", { player: "phaseUseAfter" });
				},
				ai: {
					order: 2,
					threaten: 1.5,
					result: {
						player(player, target) {
							var target = game.findPlayer(function (current) {
								return current.hasSkill("hm_xiongshi");
							});
							if (target) {
								return get.attitude(player, target);
							}
						},
					},
				},
			},
			used: {
				charlotte: true,
			},
		},
	},
	hm_difeng: {
		trigger: {
			global: ["loseAfter", "loseAsyncAfter", "addToExpansionAfter"],
		},
		getIndex(event, player) {
			return game.filterPlayer(target => event.getl?.(target)?.cards2?.length > 0);
		},
		filter(event, player, name, target) {
			if (!target?.isIn()) {
				return false;
			}
			if (event.name == "addToExpansion") {
				return true;
			}
			return event.getlx !== false && (event.toStorage == true || event.type == "addToExpansion");
		},
		forced: true,
		logTarget(event, player, name, target) {
			return target;
		},
		async content(event, trigger, player) {
			await game.asyncDraw([player, ...event.targets].sortBySeat());
		},
		group: "hm_difeng_damage",
		subSkill: {
			damage: {
				trigger: {
					player: "damageBegin3",
					source: "damageBegin1",
				},
				filter(event, player) {
					return event.source?.isIn() && player.countCards("xs") > 0;
				},
				async cost(event, trigger, player) {
					const { source } = trigger;
					let cards = player.getCards("xs", card => !card._cardid);
					const next = source.chooseCardButton("弃置一张牌令此伤害+1", cards);
					const result = await next.forResult();
					event.result = {
						bool: result.bool,
						cost_data: result.links,
					};
				},
				async content(event, trigger, player) {
					const { cost_data } = event;
					await player.loseToDiscardpile(cost_data);
					trigger.num++;
				},
			},
		},
	},
	//何曼
	hm_juedian: {
		trigger: { source: "damageSource" },
		filter(event, player) {
			const { player: target } = event;
			const juedou = get.autoViewAs({ name: "juedou", isCard: true });
			if (!target.isIn() || !player.canUse(juedou, target, false)) {
				return false;
			}
			return event.getParent().type == "card" && event.getParent(2)?.targets?.length === 1 && player.getHistory("sourceDamage", evt => evt.getParent(2)?.targets?.length === 1).indexOf(event) == 0;
		},
		locked: true,
		async cost(event, trigger, player) {
			const { player: target } = trigger;
			const control = await player
				.chooseControl("baonue_hp", "baonue_maxHp", "背水！")
				.set("prompt", `决巅：选择一项并视为对${get.translation(target)}使用一张【决斗】`)
				.set("ai", () => {
					const { player, target } = get.event();
					const bool1 = player.getHp() > 2;
					const bool2 = player.isDamaged() && player.maxHp > 3;
					const eff = get.effect(target, { name: "juedou", isCard: true }, player, player);
					if (eff > 0 && ((bool1 && bool2 && target.mayHaveSha(player, "respond", null, "count") <= player.mayHaveSha(player, "respond", null, "count")) || player.hasSkill("hm_nitian_buff"))) {
						return "背水！";
					}
					if (bool2) {
						return "baonue_maxHp";
					}
					return "baonue_hp";
				})
				.set("target", target)
				.forResultControl();
			event.result = {
				bool: true,
				cost_data: control,
				targets: [target],
			};
		},
		async content(event, trigger, player) {
			const {
				targets: [target],
				cost_data: control,
			} = event;
			const juedou = get.autoViewAs({ name: "juedou", isCard: true });
			if (["baonue_hp", "背水！"].includes(control)) {
				await player.loseHp();
			}
			if (["baonue_maxHp", "背水！"].includes(control)) {
				await player.loseMaxHp(true);
			}
			if (player.canUse(juedou, target, false)) {
				const next = player.useCard(juedou, target, false);
				next.baseDamage = control == "背水！" ? 2 : 1;
				await next;
			}
		},
	},
	hm_nitian: {
		enable: "phaseUse",
		limited: true,
		skillAnimation: true,
		animationColor: "fire",
		async content(event, trigger, player) {
			player.awakenSkill(event.name);
			player.addTempSkill(event.name + "_buff");
		},
		ai: {
			order(item, player) {
				if (
					game.hasPlayer(current => {
						if (get.attitude(player, current) > 0) {
							return false;
						}
						if (current.getHp() > 3) {
							return false;
						}
						return player.hasCard(card => get.tag(card, "damage") > 0.5 && player.canUse(card, current) && get.effect(current, card, player, player) > 0, "hs");
					})
				) {
					return 10;
				}
				return 0.1;
			},
			result: {
				player(player, target) {
					return player.hasCard(card => get.tag(card, "damage") > 0.5 && player.hasValueTarget(card), "hs") ? 1 : 0;
				},
			},
		},
		subSkill: {
			buff: {
				trigger: { player: ["useCard", "phaseJieshuBegin"] },
				filter(event, player) {
					if (event.name == "useCard") {
						return true;
					}
					return !player.getStat("kill");
				},
				silent: true,
				charlotte: true,
				async content(event, trigger, player) {
					if (trigger.name == "useCard") {
						trigger.directHit.addArray(game.filterPlayer2());
					} else {
						await player.die();
					}
				},
			},
		},
	},
	//严政
	hm_didao: {
		locked: true,
		trigger: {
			player: "phaseUseBegin",
		},
		filter(event, player) {
			return player.isDamaged();
		},
		direct: true,
		async content(event, trigger, player) {
			const next = player.chooseToUse();
			next.set("openskilldialog", "【地道】:将所有手牌当一张【杀】使用");
			next.set("_backupevent", "hm_didao_backup");
			next.set("oncard", () => {
				const evt = get.event();
				evt.baseDamage = evt.cards.length;
			});
			next.backup("hm_didao_backup");
			await next;
		},
		subSkill: {
			backup: {
				filterCard(card) {
					return get.itemtype(card) === "card";
				},
				selectCard: -1,
				position: "h",
				filterTarget: lib.filter.targetEnabledx,
				viewAs: {
					name: "sha",
					nature: "thunder",
				},
				prompt: "将所有手牌当一张【杀】使用",
				check(card) {
					return 7 - get.value(card);
				},
			},
		},
	},
	hm_xianxiang: {
		trigger: {
			source: "die",
		},
		forced: true,
		filter(event, player) {
			return game.countPlayer(target => target != player) >= 1;
		},
		async content(event, trigger, player) {
			const next = player.chooseTarget(`令另一名其他角色获得${get.translation(trigger.player.name)}区域内的所有牌`, lib.filter.notMe, true);
			const { result } = await next;
			if (result.bool) {
				const togain = trigger.player.getCards("hej");
				await result.targets[0].gain(togain, trigger.player, "giveAuto");
			}
		},
	},
	//波才
	hm_kunjun: {
		trigger: {
			player: "useCard",
			target: "useCardToTargeted",
		},
		forced: true,
		filter(event, player, triggername) {
			if (event.player == player) {
				return event.targets.some(c => player.countCards("h") > c.countCards("h"));
			}
			return event.player.countCards("h") > player.countCards("h");
		},
		async content(event, trigger, player) {
			if (trigger.player == player) {
				trigger.directHit.addArray(trigger.targets.filter(c => player.countCards("h") > c.countCards("h")));
			} else {
				trigger.directHit.add(player);
			}
		},
		ai: {
			halfneg: true,
		},
		group: "hm_kunjun_advent",
		subSkill: {
			advent: {
				trigger: { global: "gameDrawBegin" },
				forced: true,
				content() {
					const me = player,
						numx = trigger.num;
					trigger.num = function (player) {
						return (typeof numx == "function" ? numx(player) : numx) + (player === me ? 4 : 0);
					};
				},
			},
		},
	},
	hm_yingzhan: {
		trigger: {
			player: "damageBegin3",
			source: "damageBegin1",
		},
		forced: true,
		filter(event, player) {
			return event.hasNature();
		},
		async content(event, trigger, player) {
			trigger.num++;
		},
	},
	hm_cuiji: {
		trigger: {
			global: "phaseUseBegin",
		},
		filter(event, player) {
			if (event.player == player) {
				return false;
			}
			const card = new lib.element.VCard({ name: "sha", nature: "thunder" });
			return player.countCards("h") > event.player.countCards("h") && lib.filter.targetEnabled(card, player, event.player);
		},
		direct: true,
		async content(event, trigger, player) {
			const next = player.chooseToUse();
			next.set("targets", [trigger.player]);
			next.set("openskilldialog", get.prompt2("hm_cuiji"));
			next.set("norestore", true);
			next.set("_backupevent", "hm_cuiji_backup");
			next.set("custom", {
				add: {},
				replace: { window() {} },
			});
			next.backup("hm_cuiji_backup");
			await next;
		},
		group: "hm_cuiji_draw",
		subSkill: {
			backup: {
				filterCard(card) {
					return get.itemtype(card) == "card";
				},
				selectCard: [1, Infinity],
				position: "hs",
				viewAs: {
					name: "sha",
					nature: "thunder",
				},
				filterTarget(card, player, target) {
					return _status.event.targets && _status.event.targets.includes(target) && lib.filter.targetEnabled.apply(this, arguments);
				},
				prompt: "将任意张手牌当一张雷【杀】使用",
				check(card) {
					return 7 - get.value(card);
				},
			},
			draw: {
				trigger: {
					player: "useCardAfter",
				},
				silent: true,
				charlotte: true,
				filter(event, player) {
					return (
						event.skill == "hm_cuiji_backup" &&
						player.getHistory("sourceDamage", function (card) {
							return card.card == event.card;
						}).length > 0
					);
				},
				async content(event, trigger, player) {
					player.draw(trigger.cards?.length);
				},
			},
		},
	},
	//邓茂
	hm_houying: {
		enable: "phaseUse",
		filterCard: card => get.color(card) == "black",
		filter(event, player) {
			return player.countCards("he", { color: "black" }) > 1 && player.hasUseTarget("sha");
		},
		selectCard: 2,
		position: "he",
		check(card) {
			return 6 - get.value(card);
		},
		async content(event, trigger, player) {
			await player.chooseUseTarget("sha", true, false);
		},
		group: "hm_houying_draw",
		subSkill: {
			draw: {
				trigger: {
					source: "damageSource",
				},
				filter(event, player) {
					return event.getParent(5).skill == "hm_houying";
				},
				silent: true,
				charlotte: true,
				async content(event, trigger, player) {
					await player.draw();
				},
			},
		},
		ai: {
			order: 9,
			result: {
				player(player) {
					if (player.getUseValue({ name: "sha" }) < 0) {
						return 0;
					}
					return 1;
				},
			},
		},
	},
	hm_paoxi: {
		usable: 1,
		trigger: {
			player: "useCardToPlayered",
			target: "useCardToPlayered",
		},
		forced: true,
		filter(event, player) {
			const history = game.getGlobalHistory("useCard");
			const index = history.indexOf(event.getParent()) - 1;
			if (index < 0) {
				return false;
			}
			const evt = history[index];
			if (!evt || !evt.targets || !evt.targets.length) {
				return false;
			}
			if (evt.targets.includes(event.target)) {
				return true;
			}
			return false;
		},
		async content(event, trigger, player) {
			player.addTempSkill(["hm_paoxi_buff", "hm_paoxi_debuff"]);
		},
		subSkill: {
			buff: {
				charlotte: true,
				forced: true,
				trigger: {
					source: "damageBegin1",
				},
				async content(event, trigger, player) {
					trigger.num++;
					player.removeSkill("hm_paoxi_buff");
				},
			},
			debuff: {
				charlotte: true,
				forced: true,
				trigger: {
					player: "damageBegin3",
				},
				async content(event, trigger, player) {
					trigger.num++;
					player.removeSkill("hm_paoxi_debuff");
				},
			},
		},
	},
	//神张角
	hm_fudao: {
		trigger: {
			global: ["phaseBefore", "useSkill_hm_fudao"],
			player: "enterGame",
		},
		filter(event, player) {
			return event.name != "phase" || game.phaseNumber == 0;
		},
		async cost(event, trigger, player) {
			const { result } = await player.chooseVCardButton(["hm_zhong_heart", "hm_zhong_diamond", "hm_zhong_club", "hm_zhong_spade"]).set("ai", function (button) {
				return Math.random();
			});
			event.result = {
				bool: result.bool,
				cost_data: result.links,
			};
		},
		async content(event, trigger, player) {
			const { cost_data } = event;
			const { result } = await player.chooseControl(lib.suit.slice()).set("prompt", "请选择【众】的花色");
			const card = game.createCard(cost_data[0][2], result.control, 1);
			player.chooseUseTarget(card, true);
		},
	},
	hm_zongfu: {
		trigger: { global: "roundStart" },
		async cost(event, trigger, player) {
			const next = player.chooseButton(["###众附：是否声明一种花色？###", [lib.suit.map(i => ["", "", "lukai_" + i]), "vcard"]]);
			next.set("ai", button => {
				return Math.random();
			});
			const { result } = await next;
			event.result = {
				bool: result.bool,
				cost_data: result.links,
			};
		},
		async content(event, trigger, player) {
			const { cost_data } = event;
			const suit = cost_data[0][2];
			game.log(player, "声明了", `#y${get.translation(suit)}`);
			player.storage.hm_zongfu = suit.replace("lukai_", "");
			const targets = game.filterPlayer(p => p.isMinHandcard());
			for (const i of targets) {
				const next = i.chooseCard("将一张牌置于牌堆顶，否则按“取消”从牌堆底摸一张牌", "he");
				next.set("ai", function (card) {
					if (get.attitude(i, player) < 0) {
						return 0;
					}
					if (get.suit(card) == suit.replace("lukai_", "")) {
						return 8 - get.value(card);
					}
					return 6 - get.value(card);
				});
				const { result } = await next;
				if (result.bool) {
					await i.lose(result.cards, ui.cardPile, "insert");
					game.log(i, "将一张牌置于牌堆顶");
					i.addTempSkill("hm_zongfu_lose", { global: "roundStart" });
				} else {
					await i.draw("bottom");
				}
			}
		},
		derivation: "hm_fudao",
		group: "hm_zongfu_useSkill",
		subSkill: {
			lose: {
				charlotte: true,
			},
			useSkill: {
				trigger: {
					global: "damageSource",
				},
				charlotte: true,
				silent: true,
				filter(event, player) {
					return event.source?.hasSkill("hm_zongfu_lose");
				},
				async content(event, trigger, player) {
					event.trigger("useSkill_hm_fudao");
				},
			},
		},
	},
	hm_dangjing: {
		trigger: { player: ["hm_zongfuAfter", "hm_dangjing_callback"] },
		filter(event, player) {
			return player.isMaxEquip();
		},
		async cost(event, trigger, player) {
			const next = player.chooseTarget("令一名角色进行一次判定");
			next.set("ai", function (target) {
				const player = get.player();
				return get.damageEffect(target, player, player, "thunder");
			});
			const { result } = await next;
			event.result = result;
		},
		async content(event, trigger, player) {
			const { targets } = event;
			const next = targets[0].judge(function (card) {
				const evt = get.event();
				if (get.suit(card) == evt.suitx) {
					return -4;
				}
				return 0;
			});
			next.judge2 = function (result) {
				return result.bool == false ? true : false;
			};
			next.set("suitx", player.storage.hm_zongfu);
			const { result } = await next;
			if (result.suit == player.storage.hm_zongfu) {
				targets[0].damage("thunder", player);
				event.trigger("hm_dangjing_callback");
			}
		},
		ai: { combo: "hm_zongfu" },
	},
	//神张宝
	hm_zhouyuan: {
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return player.countCards("h") > 0;
		},
		filterTarget(card, player, target) {
			if (player == target) {
				return false;
			}
			return target.countCards("h") > 0;
		},
		async content(event, trigger, player) {
			const { targets } = event,
				target = targets[0];
			const dialog = [
				"请选择一项",
				[
					[
						["black", "将所有黑色手牌扣置于武将牌上"],
						["red", "将所有红色手牌扣置于武将牌上"],
					],
					"textbutton",
				],
			];
			const next = target.chooseButton(dialog, true);
			next.set("filterButton", function (button) {
				const evt = get.event();
				if (button.link == "black") {
					return evt.player.countCards("h", { color: "black" });
				}
				return evt.player.countCards("h", { color: "red" });
			});
			const { result } = await next;
			if (result?.links) {
				const color1 = result.links[0],
					cards1 = target.getCards("h", { color: color1 }),
					cards2 = player.getCards("h", { color: color1 == "black" ? "red" : "black" });
				game.log(target, "选择了", color1);
				await target.addToExpansion(cards1, "draw").set("gaintag", ["hm_zhouyuan_expansion"]);
				target.addTempSkill("hm_zhouyuan_expansion", ["phaseChange", "phaseAfter", "phaseBeforeStart"]);
				await player.addToExpansion(cards2, "draw").set("gaintag", ["hm_zhouyuan_expansion"]);
				player.addTempSkill("hm_zhouyuan_expansion", ["phaseChange", "phaseAfter", "phaseBeforeStart"]);
			}
		},
		subSkill: {
			expansion: {
				trigger: {
					global: "phaseUseEnd",
				},
				forced: true,
				popup: false,
				charlotte: true,
				filter(event, player) {
					return player.countExpansions("hm_zhouyuan_expansion");
				},
				async content(event, trigger, player) {
					const cards = player.getExpansions("hm_zhouyuan_expansion");
					game.log(player, "收回了" + get.cnNumber(cards.length) + "张“咒兵”牌");
					await player.gain(cards, "draw");
				},
				onremove: true,
				intro: {
					markcount: "expansion",
					mark(dialog, storage, player) {
						const cards = player.getExpansions("hm_zhouyuan_expansion");
						if (player.isUnderControl(true)) {
							dialog.addAuto(cards);
						} else {
							return "共有" + get.cnNumber(cards.length) + "张牌";
						}
					},
				},
			},
		},
		ai: {
			order: 7,
			result: {
				target: -1,
			},
			threaten: 1.5,
		},
	},
	hm_zhaobing: {
		trigger: {
			player: ["loseEnd", "dying", "phaseBefore", "phaseAfter", "dyingAfter", "die"],
			global: ["equipEnd", "addJudgeEnd", "gainEnd", "loseAsyncEnd", "addToExpansionEnd"],
		},
		filter(event, player) {
			return (game.hasPlayer(target => target.countExpansions("hm_zhouyuan_expansion")) && event.name != "die") ^ player.hasSkill("hm_zhaobing_in");
		},
		forced: true,
		firstDo: true,
		silent: true,
		forceDie: true,
		content() {
			if (game.hasPlayer(target => target.countExpansions("hm_zhouyuan_expansion")) && trigger.name != "die") {
				const cards = game
					.filterPlayer()
					.map(target => target.getExpansions("hm_zhouyuan_expansion"))
					.flat();
				const cardsx = cards.map(card => {
					const cardx = ui.create.card();
					cardx.init(get.cardInfo(card));
					cardx._cardid = card.cardid;
					return cardx;
				});
				player.directgains(cardsx, null, "hm_zhaobing_tag");
				player.addSkill("hm_zhaobing_in");
			} else {
				player.removeSkill("hm_zhaobing_in");
			}
		},
		ai: {
			combo: "hm_zhouyuan",
		},
		subSkill: {
			tag: {},
			in: {
				charlotte: true,
				trigger: {
					global: ["addToExpansionEnd", "gainEnd", "loseEnd", "equipEnd", "addJudgeEnd", "loseAsyncEnd"],
				},
				filter(event, player) {
					return (
						event.gaintag?.includes("hm_zhouyuan_expansion") ||
						Object.values(event.gaintag_map || {})
							?.flat()
							.includes("hm_zhouyuan_expansion")
					);
				},
				forced: true,
				locked: false,
				silent: true,
				content() {
					"step 0";
					const cards2 = player.getCards("s", card => card.hasGaintag("hm_zhaobing_tag"));
					if (player.isOnline2()) {
						player.send(
							function (cards, player) {
								cards.forEach(i => i.delete());
								if (player == game.me) {
									ui.updatehl();
								}
							},
							cards2,
							player
						);
					}
					cards2.forEach(i => i.delete());
					if (player == game.me) {
						ui.updatehl();
					}
					"step 1";
					const cards = game
						.filterPlayer()
						.map(target => target.getExpansions("hm_zhouyuan_expansion"))
						.flat();
					const cardsx = cards.map(card => {
						const cardx = ui.create.card();
						cardx.init(get.cardInfo(card));
						cardx._cardid = card.cardid;
						return cardx;
					});
					player.directgains(cardsx, null, "hm_zhaobing_tag");
				},
				onremove(player) {
					const cards2 = player.getCards("s", card => card.hasGaintag("hm_zhaobing_tag"));
					if (player.isOnline2()) {
						player.send(
							function (cards, player) {
								cards.forEach(i => i.delete());
								if (player == game.me) {
									ui.updatehl();
								}
							},
							cards2,
							player
						);
					}
					cards2.forEach(i => i.delete());
					if (player == game.me) {
						ui.updatehl();
					}
				},
				group: "hm_zhaobing_use",
			},
			use: {
				charlotte: true,
				trigger: {
					player: ["useCardBefore", "respondBefore"],
				},
				filter(event, player) {
					const cards = player.getCards("s", card => card.hasGaintag("hm_zhaobing_tag") && card._cardid);
					return (
						event.cards &&
						event.cards.some(card => {
							return cards.includes(card);
						})
					);
				},
				forced: true,
				popup: false,
				firstDo: true,
				content() {
					const idList = player.getCards("s", card => card.hasGaintag("hm_zhaobing_tag")).map(i => i._cardid);
					const cards = game
						.filterPlayer()
						.map(target => target.getExpansions("hm_zhouyuan_expansion"))
						.flat();
					const cards2 = [];
					for (const card of trigger.cards) {
						const cardx = cards.find(cardx => cardx.cardid == card._cardid);
						if (cardx) {
							cards2.push(cardx);
						}
					}
					const cards3 = trigger.cards.slice();
					trigger.cards = cards2;
					trigger.card.cards = cards2;
					if (player.isOnline2()) {
						player.send(
							function (cards, player) {
								cards.forEach(i => i.delete());
								if (player == game.me) {
									ui.updatehl();
								}
							},
							cards3,
							player
						);
					}
					cards3.forEach(i => i.delete());
					if (player == game.me) {
						ui.updatehl();
					}
				},
			},
		},
	},
	//神张梁
	hm_jijun: {
		trigger: { target: "useCardToPlayered" },
		frequent: true,
		filter(event, player) {
			if (!event.isFirstTarget) {
				return false;
			}
			return event.player == player;
		},
		onremove(player, skill) {
			const cards = player.getExpansions(skill);
			if (cards.length) {
				player.loseToDiscardpile(cards);
			}
		},
		intro: {
			markcount: "expansion",
			mark(dialog, storage, player) {
				var cards = player.getExpansions("hm_jijun");
				if (player.isUnderControl(true)) {
					dialog.addAuto(cards);
				} else {
					return "共有" + get.cnNumber(cards.length) + "张牌";
				}
			},
		},
		async content(event, trigger, player) {
			const next = player.judge();
			const { result } = await next;
			const card = result?.card;
			if (!card || get.owner(card)) {
				return;
			}
			const next2 = player
				.chooseControl([`获得${get.translation(card)}`, `将${get.translation(card)}置于武将牌`])
				.set("ai", () => {
					const { player, cardx } = get.event();
					if (player.getUseValue(cardx) > 3) {
						return 0;
					}
					return player.hasSkill("hm_fangtong") ? 1 : 0;
				})
				.set("cardx", card);
			const { result: result2 } = await next2;
			if (result2.index == 0) {
				await player.gain(card, "gain2");
			} else {
				const next = player.addToExpansion("giveAuto", card, player);
				next.gaintag.add(event.name);
				await next;
			}
		},
	},
	hm_fengtong: {
		trigger: { player: "phaseUseEnd" },
		getAuto(player) {
			var hs = player.getCards("h");
			var ss = player.getExpansions("xinfu_jijun");
			var bool = false,
				max = Math.pow(2, ss.length),
				index,
				i;
			for (i = 0; i < hs.length; i++) {
				for (var j = 1; j < max; j++) {
					var num = get.number(hs[i]);
					index = j.toString(2);
					while (index.length < ss.length) {
						index = "0" + index;
					}
					for (var k = 0; k < ss.length; k++) {
						if (index[k] == "1") {
							num += get.number(ss[k]);
						}
					}
					if (num == 36) {
						bool = true;
						break;
					}
				}
				if (bool) {
					break;
				}
			}
			if (!bool) {
				return [];
			}
			var list = [hs[i]];
			for (var k = 0; k < ss.length; k++) {
				if (index[k] == "1") {
					list.push(ss[k]);
				}
			}
			return list;
		},
		filter(event, player) {
			return player.getExpansions("hm_jijun").length && player.hasCard(lib.filter.cardRecastable, "h");
		},
		async cost(event, trigger, player) {
			event.result = await player.chooseCard(get.prompt2(event.skill), "h", lib.filter.cardRecastable).forResult();
		},
		async content(event, trigger, player) {
			const { cards } = event;
			await player.recast(cards);
			const expansions = player.getExpansions("hm_jijun");
			if (!expansions.length) {
				return;
			}
			let result;
			const next = player.chooseCardButton(expansions, [1, Infinity]);
			next.set("num", get.number(cards[0]));
			next.set("filterOk", () => {
				let sum = get.event("num");
				ui.selected.buttons.forEach(button => {
					const num = get.number(button.link);
					if (typeof num == "number") {
						sum += num;
					}
				});
				return sum === 36;
			});
			next.set("autolist", lib.skill.xinfu_fangtong.getAuto(player));
			next.set("processAI", () => {
				if (_status.event.autolist?.length) {
					return {
						bool: true,
						links: _status.event.autolist,
					};
				}
				return { bool: false };
			});
			next.set("complexSelect", true);
			result = await next.forResult();
			if (result?.bool && result?.links?.length) {
				await player.loseToDiscardpile(result.links);
				if (!game.hasPlayer(current => player != current)) {
					return;
				}
				const next = player.chooseTarget("【方统】：对一名其他角色造成3点雷电伤害", lib.filter.notMe, true);
				next.set("ai", target => {
					const player = get.player();
					return get.damageEffect(player, target, player, "thunder");
				});
				result = await next.forResult();
				if (result?.bool && result?.targets?.length) {
					await result.targets[0].damage("thunder", 3, player);
				}
			}
		},
		ai: { combo: "hm_jijun" },
	},
	//三兄弟都有的玩意
	hm_sanshou: {
		trigger: {
			player: "phaseChange",
		},
		filter(event, player) {
			if (event.phaseList[event.num].startsWith("phaseZhunbei") || event.phaseList[event.num].startsWith("phaseJieshu")) {
				return true;
			}
			return false;
		},
		forced: true,
		async content(event, trigger, player) {
			trigger.phaseList[trigger.num] = `phaseUse|${event.name}`;
			const newPair = [];
			for (const i of [player.name1, player.name2]) {
				if (!i) {
					continue;
				}
				if (i == "hm_shen_zhangjiao") {
					const next = player.chooseButton(["请选择变身对象", [["hm_shen_zhangbao", "hm_shen_zhangliang"], "character"]], true);
					next.set("ai", function (button) {
						return Math.random() - 1;
					});
					const { result } = await next;
					if (result.bool) {
						newPair.push(result.links[0]);
					}
				} else {
					newPair.push(i);
				}
			}
			await player.changeCharacter(newPair);
			player.addSkill("hm_sanshou_back");
		},
		subSkill: {
			back: {
				trigger: {
					player: "phaseUseAfter",
				},
				silent: true,
				charlotte: true,
				async content(event, trigger, player) {
					const newPair = [];
					for (const i of [player.name1, player.name2]) {
						if (!i) {
							continue;
						}
						if (["hm_shen_zhangbao", "hm_shen_zhangliang"].includes(i)) {
							newPair.push("hm_shen_zhangjiao");
						} else {
							newPair.push(i);
						}
					}
					await player.changeCharacter(newPair);
					player.removeSkill("hm_sanshou_back");
				},
			},
		},
	},
	//祖郎
	xkxijun: {
		enable: ["chooseToUse", "chooseToRespond"],
		trigger: { player: "damageEnd" },
		filter(event, player) {
			if (player.countMark("xkxijun_used") >= 2) {
				return false;
			}
			if (!player.countCards("hes", { color: "black" })) {
				return false;
			}
			if (event.name == "damage") {
				return ["sha", "juedou"].some(name => player.countCards("hes", card => get.color(card) == "black" && player.hasUseTarget(get.autoViewAs({ name: name }, [card]), false, false)));
			}
			if (!player.isPhaseUsing()) {
				return false;
			}
			return ["sha", "juedou"].some(name => event.filterCard(get.autoViewAs({ name: name }, "unsure"), player, event));
		},
		direct: true,
		async content(event, trigger, player) {
			const result = await player
				.chooseButton([
					get.prompt2("xkxijun"),
					[
						[
							["基本", "", "sha"],
							["锦囊", "", "juedou"],
						],
						"vcard",
					],
				])
				.set("filterButton", button => {
					const name = button.link[2],
						player = get.player();
					return player.countCards("hes", card => get.color(card) == "black" && player.hasUseTarget(get.autoViewAs({ name: name }, [card]), false, false));
				})
				.set("ai", button => {
					const name = button.link[2],
						player = get.player();
					return player.getUseValue({ name: name });
				})
				.forResult();
			if (!result?.bool || !result?.links?.length) {
				return;
			}
			const card = { name: result.links[0][2], storage: { xkxijun: true } };
			game.broadcastAll(card => {
				lib.skill.xkxijun_backup.viewAs = card;
			}, card);
			const next = player.chooseToUse();
			next.set("openskilldialog", "袭军：是否将一张黑色牌当做" + get.translation(card) + "使用？");
			next.set("norestore", true);
			next.set("addCount", false);
			next.set("_backupevent", "xkxijun_backup");
			next.set("custom", {
				add: {},
				replace: { window() {} },
			});
			next.backup("xkxijun_backup");
			await next;
		},
		chooseButton: {
			dialog(event, player) {
				const list = [];
				for (const name of ["sha", "juedou"]) {
					if (event.filterCard(get.autoViewAs({ name: name }, "unsure"), player, event)) {
						list.push([get.type(name), "", name]);
					}
				}
				return ui.create.dialog("袭军", [list, "vcard"]);
			},
			check(button) {
				const player = _status.event.player;
				return player.getUseValue({
					name: button.link[2],
				});
			},
			backup(links, player) {
				const backup = get.copy(lib.skill["xkxijun_backup"]);
				backup.viewAs = { name: links[0][2], storage: { xkxijun: true } };
				return backup;
			},
			prompt(links, player) {
				return "将一张黑色牌当做" + get.translation(links[0][2]) + "使用或打出";
			},
		},
		hiddenCard(player, name) {
			if (!player.isPhaseUsing()) {
				return false;
			}
			if (!["sha", "juedou"].includes(name)) {
				return false;
			}
			return player.countMark("xkxijun_used") < 2 && player.countCards("hes", { color: "black" });
		},
		ai: {
			respondSha: true,
			skillTagFilter(player) {
				if (!player.isPhaseUsing()) {
					return false;
				}
				if (player.countMark("xkxijun_used") >= 2 || !player.countCards("hes", { color: "black" })) {
					return false;
				}
			},
			order: 1,
			result: { player: 1 },
		},
		group: "xkxijun_effect",
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
			effect: {
				trigger: { global: "damageEnd" },
				filter(event, player) {
					if (!event.player.isIn()) {
						return false;
					}
					return event.card?.storage?.xkxijun;
				},
				firstDo: true,
				logTarget: "player",
				forced: true,
				async content(event, trigger, player) {
					event.targets[0].addTempSkill("xkxijun_norecover");
				},
			},
			used: {
				onremove: true,
				charlotte: true,
			},
			backup: {
				audio: "xkxijun",
				filterCard: card => get.itemtype(card) == "card" && get.color(card) == "black",
				popname: true,
				check(card) {
					return 8 - get.value(card);
				},
				position: "hes",
				async precontent(event, trigger, player) {
					player.addTempSkill("xkxijun_used");
					player.addMark("xkxijun_used", 1, false);
				},
			},
		},
	},
	xkhaokou: {
		trigger: {
			global: "phaseBefore",
			player: "enterGame",
		},
		groupSkill: "qun",
		forced: true,
		filter(event, player) {
			if (player.group != "qun") {
				return false;
			}
			return event.name != "phase" || game.phaseNumber == 0;
		},
		async content(event, trigger, player) {
			await lib.skill.xk_qiyijun.qiyi(player);
		},
		group: "xkhaokou_change",
		subSkill: {
			change: {
				trigger: {
					player: "removeQiyi",
				},
				groupSkill: "qun",
				forced: true,
				filter(event, player) {
					if (player.group != "qun") {
						return false;
					}
					return true;
				},
				async content(event, trigger, player) {
					player.changeGroup("wu");
				},
			},
		},
	},
	xkronggui: {
		groupSkill: "wu",
		trigger: {
			global: "useCardToPlayer",
		},
		filter(event, player) {
			if (event.player.group != "wu" || player.group != "wu") {
				return false;
			}
			if (!event.isFirstTarget) {
				return false;
			}
			if (!(event.card.name == "juedou" || (event.card.name == "sha" && get.color(event.card) == "red"))) {
				return false;
			}
			if (!player.countCards("he", { type: "basic" })) {
				return false;
			}
			if (
				game.hasPlayer(current => {
					return !event.targets.includes(current) && lib.filter.targetEnabled2(event.card, event.player, current);
				})
			) {
				return true;
			}
			return false;
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseCardTarget({
					prompt: get.prompt2(event.skill),
					filterCard(card, player) {
						return get.type(card) == "basic" && lib.filter.canBeDiscarded(card, player, player);
					},
					filterTarget(card, player, target) {
						const trigger = get.event().getTrigger();
						return !trigger.targets.includes(target) && lib.filter.targetEnabled2(trigger.card, trigger.player, target);
					},
					ai1(card) {
						return 6 - get.value(card);
					},
					ai2(target) {
						const trigger = get.event().getTrigger(),
							player = get.player();
						return get.effect(target, trigger.card, trigger.player, player);
					},
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const { cards, targets } = event;
			await player.discard(cards);
			trigger.targets.addArray(targets);
		},
	},
	//彭绮
	xkjushou: {
		trigger: {
			global: "phaseBefore",
			player: "enterGame",
		},
		forced: true,
		filter(event, player) {
			return event.name != "phase" || game.phaseNumber == 0;
		},
		async content(event, trigger, player) {
			await lib.skill.xk_qiyijun.qiyi(player);
			if (
				game.hasPlayer(target => {
					return target.getSeatNum() !== 1 && !target.hasSkill("xk_qiyijun") && target != player;
				})
			) {
				const result = await player
					.chooseTarget("聚首：令至多两名其他角色选择是否成为起义军", [1, 2], true, function (card, player, target) {
						return target.getSeatNum() !== 1 && !target.hasSkill("xk_qiyijun") && target != player;
					})
					.set("ai", target => Math.random())
					.forResult();
				if (result.bool && result.targets) {
					for (const target of result.targets) {
						const result2 = await target.chooseBool(`是否响应${get.translation(player)}的号召，成为起义军？`).forResult();
						if (result2.bool) {
							await lib.skill.xk_qiyijun.qiyi(target);
						} else {
							player.line(target, "green");
							await player.gainPlayerCard(target, "h", true);
						}
					}
				}
			}
		},
	},
	xkliaoluan: {
		global: "xkliaoluan_global",
		subSkill: {
			global: {
				enable: "phaseUse",
				filter(event, player) {
					if (!game.hasPlayer(current => current.hasSkill("xkliaoluan"))) {
						return false;
					}
					if (!player.hasSkill("xk_qiyijun")) {
						return false;
					}
					if (player.hasSkill("xkliaoluan_used")) {
						return false;
					}
					return game.hasPlayer(current => !current.hasSkill("xk_qiyijun") && player.inRange(current));
				},
				filterTarget(card, player, target) {
					return !target.hasSkill("xk_qiyijun") && player.inRange(target);
				},
				async content(event, trigger, player) {
					player.addSkill("xkliaoluan_used");
					await player.turnOver();
					await event.target.damage();
				},
				ai: {
					order: 1,
					result: {
						target: -1,
						player(player, target) {
							if (player.isTurnedOver()) {
								return 1;
							}
							return -1;
						},
					},
				},
			},
			used: {
				charlotte: true,
			},
		},
	},
	xkhuaying: {
		trigger: {
			global: "dieAfter",
		},
		filter(event, player) {
			if (!event.player.hasSkill("xk_qiyijun")) {
				return false;
			}
			if (!event.source || event.source == event.player) {
				return false;
			}
			return game.hasPlayer(current => current.hasSkill("xk_qiyijun"));
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt2(event.skill), (card, player, target) => {
					return target.hasSkill("xk_qiyijun");
				})
				.set("ai", target => {
					const player = get.player();
					let eff = get.attitude(player, target);
					if (eff <= 0) {
						return 0;
					}
					if (target.isTurnedOver()) {
						eff *= 2;
					}
					if (target.isLinked()) {
						eff += 2;
					}
					if (target.hasSkill("xkliaoluan_used")) {
						eff += 2;
					}
					return eff;
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			if (target.isTurnedOver()) {
				await target.turnOver(false);
			}
			if (target.isLinked()) {
				await target.link(false);
			}
			if (target.hasSkill("xkliaoluan_used")) {
				target.removeSkill("xkliaoluan_used");
			}
		},
	},
	xkjizhong: {
		locked: true,
		global: "xkjizhong_global",
		subSkill: {
			global: {
				trigger: { player: "phaseDrawBegin2" },
				forced: true,
				filter(event, player) {
					if (!player.hasSkill("xk_qiyijun")) {
						return false;
					}
					if (!game.hasPlayer(current => current.hasSkill("xkjizhong"))) {
						return false;
					}
					return !event.numFixed;
				},
				async content(event, trigger, player) {
					trigger.num += game.countPlayer(current => current.hasSkill("xkjizhong"));
				},
				mod: {
					globalFrom(from, to, distance) {
						if (!from.hasSkill("xk_qiyijun")) {
							return;
						}
						const num = game.countPlayer(current => current.hasSkill("xkjizhong"));
						return distance - num;
					},
				},
			},
		},
	},
	//单福
	xkbimeng: {
		enable: "phaseUse",
		filter(event, player) {
			if (player.countCards("hs") < player.hp || player.hasSkill("xkbimeng_used")) {
				return false;
			}
			for (var i of lib.inpile) {
				var type = get.type(i);
				if ((type == "basic" || type == "trick") && event.filterCard(get.autoViewAs({ name: i }, "unsure"), player, event)) {
					return true;
				}
			}
			return false;
		},
		chooseButton: {
			dialog(event, player) {
				var list = [];
				for (var i = 0; i < lib.inpile.length; i++) {
					var name = lib.inpile[i];
					if (name == "sha") {
						if (event.filterCard(get.autoViewAs({ name }, "unsure"), player, event)) {
							list.push(["基本", "", "sha"]);
						}
						for (var nature of lib.inpile_nature) {
							if (event.filterCard(get.autoViewAs({ name, nature }, "unsure"), player, event)) {
								list.push(["基本", "", "sha", nature]);
							}
						}
					} else if (get.type(name) == "trick" && event.filterCard(get.autoViewAs({ name }, "unsure"), player, event)) {
						list.push(["锦囊", "", name]);
					} else if (get.type(name) == "basic" && event.filterCard(get.autoViewAs({ name }, "unsure"), player, event)) {
						list.push(["基本", "", name]);
					}
				}
				return ui.create.dialog("弊蒙", [list, "vcard"]);
			},
			check(button) {
				if (_status.event.getParent().type != "phase") {
					return 1;
				}
				const player = _status.event.player;
				return player.getUseValue({
					name: button.link[2],
					nature: button.link[3],
				});
			},
			backup(links, player) {
				return {
					filterCard: true,
					audio: "xkbimeng",
					popname: true,
					check(card) {
						return 8 - get.value(card);
					},
					selectCard() {
						const player = get.player();
						return player.hp;
					},
					position: "hs",
					viewAs: { name: links[0][2], nature: links[0][3] },
					precontent() {
						player.addTempSkill("xkbimeng_used", "phaseUseAfter");
					},
				};
			},
			prompt(links, player) {
				return "将" + get.cnNumber(player.hp) + "张牌当做" + (get.translation(links[0][3]) || "") + get.translation(links[0][2]) + "使用";
			},
		},
		ai: {
			fireAttack: true,
			skillTagFilter(player) {
				if (player.countCards("sh") < player.hp || player.hasSkill("xkbimeng_used")) {
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
				charlotte: true,
			},
		},
	},
	xkzhue: {
		groupSkill: "qun",
		usable: 1,
		trigger: {
			global: "useCard",
		},
		filter(event, player) {
			if (event.player.group != "qun" || player.group != "qun") {
				return false;
			}
			if (get.type(event.card) == "equip") {
				return false;
			}
			return true;
		},
		check(event, player) {
			if (get.attitude(player, event.player) <= 0) {
				return false;
			}
			if (!get.tag(event.card, "damage")) {
				return true;
			}
			if (!event.targets?.length) {
				return false;
			}
			let eff = 0;
			for (let target of event.targets) {
				eff += get.effect(target, event.card, event.player, player);
			}
			return eff >= 5;
		},
		logTarget: "player",
		async content(event, trigger, player) {
			await trigger.player.draw();
			trigger.directHit.addArray(game.players);
			player
				.when({ global: "useCardAfter" })
				.filter(evt => evt.card == trigger.card)
				.then(() => {
					if (game.hasPlayer2(current => current.hasHistory("damage", evt => evt.card == trigger.card))) {
						player.changeGroup("shu");
					}
				});
		},
	},
	xkfuzhu: {
		groupSkill: "shu",
		usable: 1,
		trigger: {
			global: "useCardAfter",
		},
		filter(event, player) {
			if (player.group != "shu") {
				return false;
			}
			return player.countCards("he") && get.is.convertedCard(event.card);
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseCard(get.prompt2(event.skill, trigger.player), "he")
				.set("ai", card => {
					const player = get.player(),
						trigger = get.event().getTrigger();
					if (get.attitude(player, trigger.player) <= 0) {
						return 0;
					}
					if (get.type2(card) != "trick") {
						return 4 - get.value(card);
					}
					return trigger.player.getUseValue(card);
				})
				.forResult();
			event.result.targets = [trigger.player];
		},
		async content(event, trigger, player) {
			const { cards, targets } = event;
			player.$throw(get.position(cards[0]) == "e" ? cards[0] : 1, 1000);
			game.log(player, "将", get.position(cards[0]) == "e" ? cards[0] : "#y一张手牌", "置于了牌堆顶");
			await player.lose(cards, ui.cardPile, "insert");
			game.updateRoundNumber();
			const cardx = game.cardsGotoOrdering(get.cards(4)).cards,
				target = targets[0];
			await player.showCards(cardx, get.translation(player) + "发动了【辅主】");
			let putback = [];
			for (let card of cardx) {
				if (get.type2(card) == "trick" && target.hasUseTarget(card)) {
					await target.chooseUseTarget(card, true);
				} else {
					putback.push(card);
				}
			}
			if (putback.length) {
				const next = player.chooseToMove("辅主：点击或拖动将牌置于牌堆顶或牌堆底", true);
				next.set("list", [["牌堆顶", putback], ["牌堆底"]]);
				next.set("processAI", function (list) {
					const cards = list[0][1].slice(0).sort(function (a, b) {
						return get.value(b) - get.value(a);
					});
					return [cards, []];
				});
				const result = await next.forResult();
				if (result?.bool) {
					const top = result.moved[0],
						bottom = result.moved[1];
					top.reverse();
					for (var i = 0; i < top.length; i++) {
						ui.cardPile.insertBefore(top[i], ui.cardPile.firstChild);
					}
					for (i = 0; i < bottom.length; i++) {
						ui.cardPile.appendChild(bottom[i]);
					}
					game.updateRoundNumber();
					await game.delayx();
				}
			}
		},
	},
	//彭虎
	xkjuqian: {
		trigger: {
			global: "phaseBefore",
			player: "enterGame",
		},
		forced: true,
		filter(event, player) {
			return event.name != "phase" || game.phaseNumber == 0;
		},
		async content(event, trigger, player) {
			await lib.skill.xk_qiyijun.qiyi(player);
			if (
				game.hasPlayer(target => {
					return target.getSeatNum() !== 1 && !target.hasSkill("xk_qiyijun") && target != player;
				})
			) {
				const result = await player
					.chooseTarget("聚黔：令至多两名其他角色选择是否成为起义军", [1, 2], true, function (card, player, target) {
						return target.getSeatNum() !== 1 && !target.hasSkill("xk_qiyijun") && target != player;
					})
					.set("ai", target => Math.random())
					.forResult();
				if (result.bool && result.targets) {
					for (const target of result.targets) {
						const result2 = await target.chooseBool(`是否响应${get.translation(player)}的号召，成为起义军？`).forResult();
						if (result2.bool) {
							await lib.skill.xk_qiyijun.qiyi(target);
						} else {
							player.line(target, "green");
							await target.damage(player);
						}
					}
				}
			}
		},
	},
	xkkanpo: {
		trigger: {
			source: "damageSource",
		},
		filter(event, player) {
			if (!game.hasPlayer(current => current.hasSkill("xk_qiyijun"))) {
				return false;
			}
			return !event.player.isIn() || event.player.hp <= player.hp;
		},
		forced: true,
		usable: 1,
		async content(event, trigger, player) {
			const num = game.countPlayer(current => current.hasSkill("xk_qiyijun"));
			await player.draw(num);
		},
	},
	xkyizhong: {
		trigger: {
			global: "becomeQiyi",
		},
		filter(event, player) {
			return event.player.hujia < 5;
		},
		logTarget: "player",
		forced: true,
		async content(event, trigger, player) {
			await trigger.player.changeHujia(1, null, true);
		},
	},
	//崔廉
	xktanlu: {
		trigger: {
			global: "phaseBegin",
		},
		logTarget: "player",
		filter(event, player) {
			return event.player != player;
		},
		check(event, player) {
			return get.attitude(player, event.player) < 0;
		},
		async content(event, trigger, player) {
			const target = trigger.player,
				num = Math.abs(target.hp - player.hp);
			let result;
			if (num == 0 || num > target.countCards("h")) {
				result = {
					index: 1,
				};
			} else {
				result = await target
					.chooseControl("交给牌", "造成伤害")
					.set("prompt", "贪赂：请选择一项")
					.set("choiceList", [`交给${get.translation(player)}${get.cnNumber(num)}张手牌`, `令${get.translation(player)}对你造成1点伤害，然后弃置其一张手牌`])
					.set("target", player)
					.set("ai", () => {
						const { player, target } = get.event();
						const eff1 = get.effect(player, { name: "shunshou_copy2" }, target, player),
							eff2 = get.damageEffect(player, target, player) + get.effect(target, { name: "guohe_copy2" }, player, player);
						if (eff1 >= eff2) {
							return "交给牌";
						}
						return "造成伤害";
					})
					.forResult();
			}
			if (result.index == 0) {
				await target.chooseToGive(player, "h", num, true);
			} else {
				await target.damage(player);
				await target.discardPlayerCard(player, "h", true);
			}
		},
	},
	xkjubian: {
		trigger: {
			player: "damageBegin3",
		},
		filter(event, player) {
			return player.countCards("h") > player.hp;
		},
		forced: true,
		async content(event, trigger, player) {
			await player.chooseToDiscard("h", true, player.countCards("h") - player.hp);
			trigger.cancel();
		},
	},
	//罗历
	xkjuluan: {
		trigger: {
			global: "phaseBefore",
			player: "enterGame",
		},
		forced: true,
		filter(event, player) {
			return event.name != "phase" || game.phaseNumber == 0;
		},
		async content(event, trigger, player) {
			await lib.skill.xk_qiyijun.qiyi(player);
			if (
				game.hasPlayer(target => {
					return target.getSeatNum() !== 1 && !target.hasSkill("xk_qiyijun") && target != player;
				})
			) {
				const result = await player
					.chooseTarget("聚乱：令至多两名其他角色选择是否成为起义军", [1, 2], true, function (card, player, target) {
						return target.getSeatNum() !== 1 && !target.hasSkill("xk_qiyijun") && target != player;
					})
					.set("ai", target => Math.random())
					.forResult();
				if (result.bool && result.targets) {
					for (const target of result.targets) {
						const result2 = await target.chooseBool(`是否响应${get.translation(player)}的号召，成为起义军？`).forResult();
						if (result2.bool) {
							await lib.skill.xk_qiyijun.qiyi(target);
						} else {
							player.line(target, "green");
							await player.discardPlayerCard(target, "h", true);
						}
					}
				}
			}
		},
		group: "xkjuluan_damage",
		subSkill: {
			damage: {
				trigger: {
					source: "damageBegin1",
					player: "damageBegin3",
				},
				forced: true,
				filter(event, player, name) {
					const key = name == "damageBegin1" ? "sourceDamage" : "damage";
					return player.getHistory(key).length == 1;
				},
				async content(event, trigger, player) {
					trigger.num++;
				},
			},
		},
	},
	xkxianxing: {
		trigger: {
			player: "useCardToPlayered",
		},
		filter(event, player) {
			if (!event.targets || event.targets.length != 1) {
				return false;
			}
			if (event.target == player) {
				return false;
			}
			if (!event.card || !get.tag(event.card, "damage")) {
				return false;
			}
			return player.isPhaseUsing();
		},
		logTarget: "target",
		async content(event, trigger, player) {
			player.addTempSkill(event.name + "_used");
			player.addMark(event.name + "_used", 1, false);
			const num = player.countMark(event.name + "_used");
			await player.draw(num);
			if (num > 1) {
				player
					.when("useCardAfter")
					.filter(evt => evt.card == trigger.card)
					.then(() => {
						if (!game.hasPlayer2(current => current.hasHistory("damage", evt => evt.card == card))) {
							player
								.chooseControl(`失去${num - 1}点体力`, "此技能本回合失效")
								.set("prompt", "险行：选择一项")
								.set("ai", () => {
									if (get.event("num") > 1) {
										return 1;
									}
									return [0, 1].randomGet();
								})
								.set("num", num);
						} else {
							event.finish();
						}
					})
					.then(() => {
						if (result.index == 0) {
							player.loseHp(num - 1);
						} else {
							player.tempBanSkill("xkxianxing");
						}
					})
					.vars({
						card: trigger.card,
						num: num,
					});
			}
		},
		subSkill: {
			used: {
				charlotte: true,
				onremove: true,
				intro: {
					content: "已发动过#次",
				},
			},
		},
	},
	xk_qiyijun: {
		charlotte: true,
		nopop: true,
		forced: true,
		trigger: {
			player: "phaseEnd",
		},
		filter(event, player) {
			if (player.hasHistory("sourceDamage", evt => evt.player && !evt.player.hasSkill("xk_qiyijun"))) {
				return false;
			}
			if (
				player.hasHistory(
					"useCard",
					evt =>
						evt.card.name == "sha" &&
						evt.targets?.some(target => {
							return !target.hasSkill("xk_qiyijun");
						})
				)
			) {
				return false;
			}
			return true;
		},
		async content(event, trigger, player) {
			const result = await player
				.chooseControl("失去“起义军”", "失去1点体力")
				.set("prompt", "起义军：请选择一项")
				.set("choiceList", ["失去“起义军”并弃置所有手牌", "失去1点体力"])
				.set("ai", () => {
					if (player.hp <= 1) {
						return "失去“起义军”";
					}
					return ["失去“起义军”", "失去1点体力"].randomGet();
				})
				.forResult();
			if (result.index == 0) {
				await lib.skill.xk_qiyijun.unQiyi(player);
				const hs = player.getDiscardableCards(player, "h");
				if (hs.length) {
					await player.discard(hs);
				}
			} else {
				await player.loseHp();
			}
		},
		mod: {
			cardUsable(card, player, num) {
				if (card.name == "sha") {
					return num + 1;
				}
			},
		},
		global: "xk_qiyijun_effect",
		qiyi(player) {
			player.addSkill("xk_qiyijun");
			player.markSkillCharacter("xk_qiyijun", "shibing1", "起义军", "已决定起义<br>未起义的角色对你使用【杀】次数+1");
			const next = game.createEvent("becomeQiyi");
			next.player = player;
			next.setContent("emptyEvent");
			return next;
		},
		unQiyi(player) {
			player.removeSkill("xk_qiyijun");
			const next = game.createEvent("removeQiyi");
			next.player = player;
			next.setContent("emptyEvent");
			return next;
		},
		subSkill: {
			effect: {
				trigger: {
					player: "useCard",
				},
				filter(event, player) {
					if (!player.isPhaseUsing() || event.card.name != "sha") {
						return false;
					}
					player._countPrenum = true;
					const num = player.getCardUsable("sha");
					delete player._countPrenum;
					if (num >= 0) {
						return false;
					}
					return event.targets?.some(target => target.hasSkill("xk_qiyijun"));
				},
				charlotte: true,
				direct: true,
				async content(event, trigger, player) {
					if (!player.getStorage("xk_qiyijun").length) {
						player.when({ global: ["phaseBefore", "phaseAfter", "phaseUseBefore", "phaseUseAfter"] }).then(() => {
							player.unmarkAuto("xk_qiyijun", player.getStorage("xk_qiyijun"));
						});
					}
					player.markAuto(
						"xk_qiyijun",
						trigger.targets.filter(target => target.hasSkill("xk_qiyijun"))
					);
				},
				mod: {
					cardUsable(card, player, num) {
						if (player._countPrenum || player.hasSkill("xk_qiyijun")) {
							return;
						}
						if (card.name == "sha") {
							return num + game.countPlayer(current => current.hasSkill("xk_qiyijun"));
						}
					},
					playerEnabled(card, player, target) {
						if (card.name != "sha") {
							return;
						}
						player._countPrenum = true;
						const num = player.getCardUsable(card);
						delete player._countPrenum;
						if (num > 0) {
							return;
						}
						if (game.checkMod(card, player, target, false, "cardUsableTarget", player)) {
							return;
						}
						if (player.getStorage("xk_qiyijun").includes(target)) {
							return false;
						}
						if (!target.hasSkill("xk_qiyijun")) {
							return false;
						}
					},
				},
			},
		},
	},
	//e系列纪灵
	yjshuangren: {
		audio: "shuangren",
		enable: "phaseUse",
		filterTarget(card, player, target) {
			return player.canCompare(target);
		},
		filter(event, player) {
			return player.countCards("h") > 0;
		},
		async content(event, trigger, player) {
			const bool = await player.chooseToCompare(event.target).forResultBool();
			if (bool) {
				player.addTempSkill("yjshuangren_count");
				player.addMark("yjshuangren_count", 1, false);
				let num = 0;
				while (num < player.countMark("yjshuangren_count")) {
					num++;
					const card = { name: "sha", isCard: true };
					if (player.hasUseTarget(card)) {
						const result = await player.chooseUseTarget(card, false).forResult();
						if (!result.bool) {
							break;
						}
					} else {
						break;
					}
				}
			} else {
				player.addTempSkill("yjshuangren_viewas");
			}
		},
		ai: {
			order(name, player) {
				const cards = player.getCards("h");
				for (let i = 0; i < cards.length; i++) {
					if (get.number(cards[i]) > 11 && get.value(cards[i]) < 7) {
						return 9;
					}
				}
				return get.order({ name: "sha" }) - 0.1;
			},
			result: {
				player(player) {
					const num = player.countCards("h");
					if (num > player.hp) {
						return 0;
					}
					if (num == 1) {
						return -1;
					}
					if (num == 2) {
						return -0.7;
					}
					return -0.5;
				},
				target(player, target) {
					const num = target.countCards("h");
					if (num == 1) {
						return -2;
					}
					if (num == 2) {
						return -1;
					}
					return -0.7;
				},
			},
			threaten: 1.3,
		},
		subSkill: {
			count: {
				charlotte: true,
				onremove: true,
			},
			viewas: {
				charlotte: true,
				mod: {
					cardname(card, player) {
						if (card.name == "sha") {
							return "shan";
						}
					},
					cardnumber(card) {
						if (card.name == "sha") {
							return 13;
						}
					},
				},
			},
		},
	},
	//线下幻系列
	yjqingjiao: {
		trigger: { player: "phaseJieshuBegin" },
		filter(event, player) {
			return player.hasHistory("sourceDamage", evt => evt.player.group === "qun" && evt.player !== player);
		},
		forced: true,
		zhuSkill: true,
		content() {
			player.draw();
		},
	},
	//燕幽烽火
	//全琮
	yyyaoming: {
		audio: "sbyaoming",
		enable: "phaseUse",
		trigger: { player: "damageEnd" },
		filter(event, player) {
			return game.hasPlayer(target => {
				if (target.countCards("he") && target.countCards("h") >= player.countCards("h")) {
					if (target !== player && (event.name === "damage" || !player.getStorage("yyyaoming_used").includes("弃牌"))) {
						return true;
					}
				}
				if (target.countCards("h") <= player.countCards("h")) {
					if (event.name === "damage" || !player.getStorage("yyyaoming_used").includes("摸牌")) {
						return true;
					}
				}
				return false;
			});
		},
		filterTarget(card, player, target) {
			if (target !== player && target.countCards("he") && target.countCards("h") >= player.countCards("h") && !player.getStorage("yyyaoming_used").includes("弃牌")) {
				return true;
			}
			if (target.countCards("h") <= player.countCards("h") && !player.getStorage("yyyaoming_used").includes("摸牌")) {
				return true;
			}
			return false;
		},
		prompt() {
			const player = get.player(),
				storage = player.getStorage("yyyaoming_used");
			return ["弃牌", "摸牌"]
				.filter(i => !storage.includes(i))
				.map(i => {
					return {
						弃牌: "弃置一名手牌数不小于你的其他角色的一张牌",
						摸牌: "令一名手牌数不大于你的角色摸一张牌",
					}[i];
				})
				.join("，或");
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(
					get.prompt(event.skill),
					(card, player, target) => {
						if (target !== player && target.countCards("he") && target.countCards("h") >= player.countCards("h")) {
							return true;
						}
						if (target.countCards("h") <= player.countCards("h")) {
							return true;
						}
						return false;
					},
					"弃置一名手牌数不小于你的其他角色的一张牌，或令一名手牌数不大于你的角色摸一张牌"
				)
				.set("ai", target => {
					const player = get.player();
					return get.effect(target, "yyyaoming", player, player);
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const target = event.target || event.targets[0];
			let choice = ["弃牌", "摸牌"].filter(choice => {
					if (!(trigger?.name === "damage" || !player.getStorage("yyyaoming_used").includes(choice))) {
						return false;
					}
					if (choice === "弃牌") {
						return target !== player && target.countCards("he") && target.countCards("h") >= player.countCards("h");
					}
					return target.countCards("h") <= player.countCards("h");
				}),
				result;
			if (choice.length === 1) {
				result = { control: choice[0] };
			} else {
				result = await player
					.chooseControl(choice)
					.set("choiceList", ["弃置" + get.translation(target) + "一张牌", "令" + get.translation(target) + "摸一张牌"])
					.set("prompt", "邀名：请选择一项")
					.set("ai", () => {
						const player = get.player(),
							event = get.event().getParent(),
							target = event.target || event.targets[0];
						return get.effect(target, { name: "guohe_copy2" }, player, player) > get.effect(target, { name: "draw" }, player, player) ? 0 : 1;
					})
					.forResult();
			}
			if (result.control === "弃牌") {
				await player.discardPlayerCard(target, "he", true);
			} else {
				await target.draw();
			}
			if (!(trigger?.name === "damage")) {
				player.addTempSkill("yyyaoming_used", "phaseUseAfter");
				player.markAuto("yyyaoming_used", [result.control]);
			}
		},
		ai: {
			order: 7,
			result: {
				player(player, target) {
					let eff = [0, 0],
						hs = player.countCards("h"),
						ht = target.countCards("h");
					if (hs >= ht) {
						eff[0] = get.effect(target, { name: "draw" }, player, player);
					}
					if (hs <= ht) {
						eff[1] = get.effect(target, { name: "guohe_copy2" }, player, player);
					}
					return Math.max.apply(Math, eff);
				},
			},
		},
		subSkill: {
			used: {
				charlotte: true,
				onremove: true,
			},
		},
	},
	//白虎骁骑
	yy_baimaxiaoqi_skill: {
		equipSkill: true,
		mod: {
			attackRange(player, num) {
				if (player.countVCards("e") > 0) {
					return num + player.countVCards("e");
				}
			},
			cardUsable(card, player, num) {
				if (card.name != "sha") {
					return;
				}
				if (player.countVCards("e") > 1) {
					return num + player.countVCards("e");
				}
			},
			globalFrom(player, target, num) {
				if (player.countVCards("e") > 2) {
					return num - player.countVCards("e");
				}
			},
		},
		trigger: { player: "phaseDrawBegin2" },
		filter(event, player) {
			return player.countVCards("e") > 3 && !event.numFixed;
		},
		forced: true,
		content() {
			trigger.num += player.countVCards("e");
		},
	},
	//麴义
	yyfuqi: {
		audio: "fuqi",
		trigger: { player: "useCardToPlayer" },
		filter(event, player) {
			return get.distance(player, event.target) > 1;
		},
		forced: true,
		logTarget: "target",
		content() {
			player.draw();
		},
		group: "yyfuqi_fuqi",
		subSkill: { fuqi: { audio: "fuqi", inherit: "fuqi" } },
	},
	//公孙瓒
	yyqizhen: {
		trigger: { player: "useCardToPlayered" },
		filter(event, player) {
			return event.card.name == "sha";
		},
		check(event, player) {
			return get.attitude(player, event.target) < 0 || event.targets.some(i => get.attitude(player, i) < 0);
		},
		logTarget: "target",
		content() {
			const skill = "yyqizhen_effect";
			player.addTempSkill(skill);
			if (!player.storage[skill]) {
				player.storage[skill] = {};
			}
			const id = trigger.target.playerid;
			if (!player.storage[skill][id]) {
				player.storage[skill][id] = [trigger.target, trigger.getParent()];
			} else {
				player.storage[skill][id].add(trigger.getParent());
			}
		},
		subSkill: {
			effect: {
				charlotte: true,
				onremove: true,
				trigger: { player: "useCardAfter" },
				filter(event, player) {
					return Object.keys(player.storage["yyqizhen_effect"]).some(id => player.storage["yyqizhen_effect"][id].includes(event));
				},
				forced: true,
				popup: false,
				async content(event, trigger, player) {
					const storage = player.storage["yyqizhen_effect"];
					const targets = Object.keys(storage)
						.filter(id => {
							return storage[id].includes(trigger);
						})
						.slice()
						.map(id => storage[id][0]);
					const goon = game.getGlobalHistory("changeHp", evt => evt.getParent().name === "damage" && evt.getParent().card === trigger.card).reduce((sum, evt) => sum - evt.num, 0);
					for (const target of targets) {
						if (goon) {
							player.line(target);
							await player.draw(goon);
						} else {
							if (!target.isIn() || !target.countDiscardableCards(player, "e")) {
								continue;
							}
							player.line(target);
							await player.discardPlayerCard(target, "e", true);
						}
					}
				},
			},
		},
	},
	yymujun: {
		zhuSkill: true,
		limited: true,
		enable: "phaseUse",
		filterTarget(card, player, target) {
			return target.group == "qun" && player.hasZhuSkill("yymujun", target) && !target.hasSkill("yicong", null, false, false);
		},
		skillAnimation: true,
		animationColor: "metal",
		content() {
			player.awakenSkill(event.name);
			target.addSkills("yicong");
		},
		ai: {
			order: 1,
			result: { target: 1 },
		},
		derivation: "yicong",
	},
	//文丑
	yyxuezhan: {
		trigger: { player: "useCard" },
		filter(event) {
			return event.card.name == "juedou";
		},
		forced: true,
		content() {
			trigger.nowuxie = true;
		},
		mod: {
			cardname(card, player) {
				if (get.type(card, "trick", false) == "trick") {
					return "juedou";
				}
			},
		},
	},
	yyyazhen: {
		enable: ["chooseToUse", "chooseToRespond"],
		filter(event, player) {
			return player.countCards("e");
		},
		filterCard: true,
		position: "e",
		viewAs: { name: "sha" },
		check(card) {
			const val = get.value(card);
			if (get.event().name == "chooseToRespond") {
				return 1 / Math.max(0.1, val);
			}
			return 5 - val;
		},
		ai: {
			respondSha: true,
			skillTagFilter(player) {
				if (!player.countCards("e")) {
					return false;
				}
			},
		},
	},
	//公孙渊
	yyxuanshi: {
		enable: "phaseUse",
		filter(event, player) {
			return player.countCards("h") && player.countCards("h", { color: "red" }) === player.countCards("h", { color: "black" });
		},
		filterTarget(card, player, target) {
			return target !== player && target.countCards("hej");
		},
		usable: 2,
		delay: false,
		content() {
			player.showHandcards(get.translation(player) + "对" + get.translation(target) + "发动了【旋势】");
			player.gainPlayerCard(target, "hej", true);
		},
		ai: {
			order: 20,
			result: {
				player(player, target) {
					return get.effect(target, { name: "shunshou" }, player, player);
				},
			},
		},
	},
	yyxiongye: {
		zhuSkill: true,
		enable: "phaseUse",
		selectCard() {
			if (ui.selected.targets.length) {
				return [ui.selected.targets.length, Infinity];
			}
			return [1, Infinity];
		},
		selectTarget: () => ui.selected.cards.length,
		filterTarget(card, player, target) {
			return target !== player && target.group === "qun" && player.hasZhuSkill("yyxiongye", target);
		},
		filterCard: true,
		check(card) {
			if (get.tag(card, "recover")) {
				return 0;
			}
			return 7 - get.value(card);
		},
		position: "h",
		complexCard: true,
		discard: false,
		lose: false,
		delay: false,
		multitarget: true,
		multiline: true,
		usable: 1,
		async content(event, trigger, player) {
			await game
				.loseAsync({
					gain_list: Array.from({ length: event.targets.length }).map((_, i) => [event.targets[i], event.cards[i]]),
					giver: player,
					player: player,
					cards: event.cards,
					animate: "giveAuto",
				})
				.setContent("gaincardMultiple");
			for (const i of event.targets.sortBySeat()) {
				await i.damage();
			}
		},
		ai: {
			order: 5,
			result: {
				player(player, target) {
					return get.damageEffect(target, player, player);
				},
			},
		},
	},
	//袁绍
	yysudi: {
		trigger: { global: ["useCardAfter", "respondAfter"] },
		filter(event, player) {
			if (!Array.isArray(event.respondTo) || event.respondTo[0] !== player) {
				return false;
			}
			return event.player.inRange(player);
		},
		forced: true,
		logTarget: "player",
		content() {
			player.draw();
		},
	},
	yyqishe: {
		trigger: {
			global: "phaseBefore",
			player: ["enterGame", "phaseJieshuBegin"],
		},
		filter(event, player) {
			return event.name !== "phase" || game.phaseNumber === 0;
		},
		frequent: true,
		async cost(event, trigger, player) {
			if (trigger.name !== "phaseJieshu") {
				event.result = { bool: true };
			} else {
				event.result = await player.chooseBool("是否发动【齐射】，从弃牌堆中获得一张【万箭齐发】？").set("frequentSkill", event.skill).forResult();
			}
		},
		content() {
			const card = trigger.name === "phaseJieshu" ? get.discardPile("wanjian") : game.createCard2("wanjian", "heart", 1);
			if (card) {
				player.gain(card, "gain2");
			}
		},
	},
	yylinzhen: {
		locked: true,
		zhuSkill: true,
		global: "yylinzhen_global",
		subSkill: {
			global: {
				zhuSkill: true,
				mod: {
					inRange(from, to) {
						if (from === to || from.group !== "qun") {
							return;
						}
						if (to.hasZhuSkill("yylinzhen", from)) {
							return true;
						}
					},
				},
			},
		},
	},
	//司马懿
	yyyanggu: {
		enable: "chooseToUse",
		filter(event, player) {
			return player.storage.yyyanggu && player.countCards("h");
		},
		filterCard: true,
		position: "h",
		viewAs: { name: "shengdong" },
		prompt: "将一张手牌当作【声东击西】使用",
		check(card) {
			return 7 - get.value(card);
		},
		onuse(result, player) {
			player.changeZhuanhuanji("yyyanggu");
		},
		mark: true,
		zhuanhuanji: true,
		marktext: "☯",
		intro: {
			content(storage) {
				if (storage) {
					return "你可以将一张手牌当作【声东击西】使用";
				}
				return "当你受到伤害后，你可以回复1点体力";
			},
		},
		group: "yyyanggu_effect",
		subSkill: {
			effect: {
				trigger: { player: "damageEnd" },
				filter(event, player) {
					return !player.storage.yyyanggu && player.isDamaged();
				},
				check(event, player) {
					return get.recoverEffect(player, player, player) > 0;
				},
				prompt: "回复1点体力",
				content() {
					player.changeZhuanhuanji("yyyanggu");
					player.recover();
				},
			},
		},
	},
	yyzuifu: {
		trigger: { global: ["gainAfter", "loseAsyncAfter"] },
		filter(event, player, name, target) {
			if (!event.getg || _status.dying.length) {
				return false;
			}
			return target?.isIn();
		},
		getIndex(event, player) {
			if (!event.getg) {
				return false;
			}
			return game
				.filterPlayer(current => {
					const evt = event.getParent("phaseDraw");
					if (evt?.player == current) {
						return false;
					}
					return event.getg(current).length;
				})
				.sortBySeat();
		},
		usable: 1,
		logTarget: (event, player, name, target) => target,
		prompt2: (event, player, name, target) => "对" + get.translation(target) + "造成1点伤害",
		check: (event, player, name, target) => get.damageEffect(target, player, player) > 0,
		content() {
			event.targets[0].damage();
		},
	},
	//曹叡
	yyhuituo: {
		audio: "huituo",
		trigger: { player: "damageEnd" },
		getIndex: event => event.num,
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt2(event.skill))
				.set("ai", target => {
					const player = get.player();
					if (get.attitude(player, target) > 0) {
						return get.recoverEffect(target, player, player) + 1;
					}
					return 0;
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			const result = await target
				.judge(card => {
					if (get.color(card) == "red") {
						return target.isDamaged() ? 1 : -1;
					}
					return 0;
				})
				.forResult();
			if (result.color === "red") {
				await target.recover();
			}
			if (result.color === "black") {
				await target.draw();
			}
		},
	},
	yymingjian: {
		audio: "mingjian",
		trigger: { global: "phaseUseBegin" },
		filter(event, player) {
			return event.player !== player && player.countCards("h");
		},
		async cost(event, trigger, player) {
			const suits = player
				.getCards("h")
				.slice()
				.map(i => get.suit(i, player))
				.unique();
			event.result = await player
				.chooseControl(suits, "cancel2")
				.set("ai", () => {
					const player = get.player(),
						target = get.event().getTrigger().player;
					if (get.attitude(player, target) < 2) {
						return "cancel2";
					}
					return get.event().controls.randomGet();
				})
				.set("prompt", get.prompt2(event.skill, trigger.player))
				.forResult();
			if (event.result.control !== "cancel2") {
				event.result.bool = true;
				event.result.cards = player.getCards("h", { suit: event.result.control });
			}
		},
		logTarget: "player",
		async content(event, trigger, player) {
			const target = trigger.player;
			await player.showHandcards(get.translation(player) + "对" + get.translation(target) + "发动了【明鉴】");
			await player.give(event.cards, target, "visible");
			target.addTempSkill("yymingjian_effect");
			target.addMark("yymingjian_effect", 1, false);
		},
		subSkill: {
			effect: {
				charlotte: true,
				onremove: true,
				intro: { content: "本回合使用的下一张牌额外结算#次" },
				trigger: { player: "useCard" },
				forced: true,
				popup: false,
				content() {
					const num = player.countMark(event.name);
					player.removeSkill(event.name);
					if (lib.skill.dcshixian.filterx(trigger)) {
						trigger.effectCount += num;
						game.log(trigger.card, "额外结算" + num + "次");
					}
				},
				mod: {
					aiOrder(player, card, num) {
						if (typeof card == "object" && !get.tag(card, "norepeat")) {
							const type = get.type(card);
							if (type === "basic" || type === "trick") {
								return num + 20;
							}
						}
					},
				},
			},
		},
	},
	//SCL
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
			return lib.skill.scls_pingcai.takaramonoValue(suit, get.event("player"));
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
					const player = get.event("player");
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
					const player = get.event("player");
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
			const {
				result: { bool, targets },
			} = await player
				.chooseTarget(2, (card, player, target) => {
					if (ui.selected.targets.length) {
						if (!get.event("equip")) {
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
						if (!get.event("equip")) {
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
					const player = get.event("player"),
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
				.set("equip", equip);
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
					const player = get.event("player");
					let eff = get.effect(target, { name: "draw" }, player, player);
					if (target.isDamaged()) {
						eff += get.recoverEffect(target, player, player);
					}
					if (get.event("ingame")) {
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
						return lib.skill.scls_pingcai.takaramonoValue(button.link[2], get.event("player"));
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
				result: {
					bool,
					links: [card],
				},
			} = await player
				.chooseCardButton("冲虚：选择要获得的牌", true, cards)
				.set("ai", button => {
					let color = get.color(button.link),
						need = get.event("color");
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
				);
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
				.set("eff", get.effect(player, trigger.card, trigger.player, trigger.player));
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
		filterCard: true,
		position: "he",
		selectCard: [2, Infinity],
		check(card) {
			if (ui.selected.cards.length > 1) {
				return 0;
			}
			let player = get.event("player");
			if (player.hasSkill("xingtu") && player.storage.xingtu) {
				let number = get.number(card);
				return player.getHp() - player.getUseValue(card, null, number % (player.storage.xingtu_mark || 13) !== 0);
			}
			return 5 - get.value(card);
		},
		async content(event, trigger, player) {
			let cards = get.cards(event.cards.length, true);
			await player.showCards(cards, get.translation(player) + "发动了【爵制】");
			const {
				result: {
					links: [card],
				},
			} = await player.chooseCardButton("爵制：选择要获得的牌", true, cards).set("ai", button => {
				let player = get.event("player"),
					number = get.number(button.link);
				return player.getUseValue(button.link, null, number % (player.storage.xingtu_mark || 13) !== 0);
			});
			if (card) {
				player.gain(card, "gain2");
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
			const { result } = await player
				.chooseButton(["凌人：猜测其有哪些类别的手牌", [["basic", "trick", "equip"], "vcard"]], [0, 3], true)
				.set("ai", button => {
					return get.event("choice").includes(button.link[2]);
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
				);
			if (!result?.bool) {
				return;
			}
			const choices = result.links.map(i => i[2]);
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
	//桃园挽歌
	//铠甲合体
	_taoyuanwange: {
		trigger: {
			global: "phaseBefore",
			player: "enterGame",
		},
		filter(event, player) {
			if (event.name == "phase" && game.phaseNumber != 0) {
				return false;
			}
			return Object.keys(lib.skill._taoyuanwange.getEquip).some(name => {
				return get.nameList(player).includes(name);
			});
		},
		direct: true,
		getEquip: {
			ty_liubei: ["dilu", "ty_feilongduofeng"],
			ty_luxun: ["shangfangbaojian"],
			ty_sunquan: ["qingmingjian"],
		},
		getAudio: {
			ty_liubei: "jizhao2",
			ty_luxun: "nzry_cuike2",
			ty_sunquan: "sbzhiheng2",
		},
		async content(event, trigger, player) {
			let list = get.nameList(player),
				info = lib.skill._taoyuanwange,
				names = Object.keys(info.getEquip);
			for (const name of names) {
				if (list.includes(name)) {
					let equips = [];
					for (let card of info.getEquip[name]) {
						let cardx = get.cardPile(cardx => cardx.name == card && player.canEquip(cardx));
						if (cardx) {
							equips.push(cardx);
						}
					}
					if (equips.length) {
						game.broadcastAll(function (audio) {
							if (lib.config.background_speak) {
								game.playAudio("skill", audio);
							}
						}, info.getAudio[name]);
						player.$gain2(equips);
						await player.equip(equips);
					}
				}
			}
		},
	},
	//刺客×4
	//孩子们，我分身了
	tyliupo: {
		mark: true,
		zhuanhuanji: true,
		marktext: "☯",
		intro: {
			content(storage, player, skill) {
				if (storage) {
					return "回合开始时，你可令本轮所有所有即将造成的伤害均视为体力流失";
				}
				return "回合开始时，你可令所有角色不能使用【桃】";
			},
		},
		trigger: {
			player: "phaseBegin",
		},
		logTarget: () => game.players,
		async content(event, trigger, player) {
			player.changeZhuanhuanji(event.name);
			let skill = event.name + "_" + (player.storage[event.name] ? "wansha" : "jueqing");
			for (let i of game.players) {
				i.addTempSkill(skill, "roundStart");
			}
		},
		subSkill: {
			wansha: {
				charlotte: true,
				mod: {
					cardSavable(card, player) {
						if (card.name == "tao") {
							return false;
						}
					},
					cardEnabled(card, player) {
						if (card.name == "tao") {
							return false;
						}
					},
				},
				mark: true,
				marktext: '<span style="text-decoration: line-through;">桃</span>',
				intro: {
					content: "不能使用桃",
				},
			},
			jueqing: {
				trigger: { player: "damageBefore" },
				forced: true,
				charlotte: true,
				content() {
					trigger.cancel();
					trigger.player.loseHp(trigger.num);
				},
				ai: {
					jueqing: true,
				},
				mark: true,
				marktext: '<span style="text-decoration: line-through;">伤</span>',
				intro: {
					content: "造成伤害改为失去体力",
				},
			},
		},
	},
	tyzhuiling: {
		trigger: {
			global: "loseHpEnd",
		},
		filter(event, player) {
			return player.countMark("tyzhuiling") < 3 && event.num > 0;
		},
		forced: true,
		logTarget: "player",
		async content(event, trigger, player) {
			let num = Math.min(3 - player.countMark(event.name), trigger.num);
			player.addMark(event.name, num);
		},
		marktext: "魂",
		intro: {
			name: "魂",
			content: "mark",
		},
		mod: {
			cardUsableTarget(card, player, target) {
				if (!target.countCards("h")) {
					return Infinity;
				}
			},
			targetInRange(card, player, target) {
				if (!target.countCards("h")) {
					return true;
				}
			},
		},
	},
	tyxihun: {
		trigger: { global: "roundEnd" },
		forced: true,
		async content(event, trigger, player) {
			for (const target of game.players) {
				if (target == player) {
					continue;
				}
				const result = await target
					.chooseToDiscard(2, "h", "弃置两张手牌，或点取消失去1点体力")
					.set("ai", card => {
						let player = get.player();
						if (get.effect(player, { name: "losehp" }, player, player) > 0) {
							return 0;
						}
						return 6 - get.value(card);
					})
					.forResult();
				if (!result.bool) {
					await target.loseHp();
				}
			}
			if (!player.hasMark("tyzhuiling")) {
				return;
			}
			let list = [];
			for (let i = 1; i <= player.countMark("tyzhuiling"); i++) {
				list.push(get.cnNumber(i, true));
			}
			const result = await player
				.chooseControl(list)
				.set("prompt", "吸魂：选择要移去的“魂”数")
				.set("ai", () => {
					const player = get.player();
					return get.cnNumber(Math.max(1, Math.min(player.countMark("tyzhuiling"), player.getDamagedHp())), true);
				})
				.forResult();
			let num = result.index + 1;
			player.removeMark("tyzhuiling", num);
			if (player.isDamaged()) {
				await player.recover(num);
			}
		},
	},
	tyxianqi: {
		global: "tyxianqi_damage",
		subSkill: {
			damage: {
				enable: "phaseUse",
				usable: 1,
				prompt: "弃置两张牌或对自身造成1点伤害，然后令有【献气】的其他角色受到1点伤害",
				filterCard: true,
				position: "he",
				selectCard: [0, 2],
				filter(event, player) {
					return game.hasPlayer(current => current.hasSkill("tyxianqi") && current != player);
				},
				filterTarget(card, player, target) {
					if (ui.selected.cards?.length == 1) {
						return false;
					}
					return target.hasSkill("tyxianqi") && target != player;
				},
				selectTarget() {
					if (ui.selected.cards?.length == 1) {
						return 114514;
					}
					return -1;
				},
				check(card) {
					let player = get.player();
					if (get.damageEffect(player, player, player) > 0) {
						return 0;
					}
					return 8 - get.value(card);
				},
				complexTarget: true,
				async contentBefore(event, trigger, player) {
					if (!event.cards || !event.cards.length) {
						await player.damage();
					}
				},
				async content(event, trigger, player) {
					await event.target.damage();
				},
				ai: {
					order: 6,
					result: {
						player(player, target) {
							if (ui.selected.cards.length) {
								return 0;
							}
							if (player.hp >= target.hp) {
								return -0.9;
							}
							if (player.hp <= 2) {
								return -10;
							}
							return -2;
						},
						target(player, target) {
							if (!ui.selected.cards.length) {
								if (player.hp < 2) {
									return 0;
								}
								if (player.hp == 2 && target.hp >= 2) {
									return 0;
								}
								if (target.hp > player.hp) {
									return 0;
								}
							}
							return get.damageEffect(target, player);
						},
					},
				},
			},
		},
	},
	tyfansheng: {
		trigger: {
			player: "dying",
		},
		filter(event, player) {
			return (
				game
					.getAllGlobalHistory("everything", evt => {
						return evt.name == "dying" && evt.player == player;
					})
					.indexOf(event) == 0
			);
		},
		forced: true,
		skillAnimation: true,
		animationColor: "metal",
		async content(event, trigger, player) {
			await player.recoverTo(1);
			for (const target of game.players) {
				if (target == player) {
					continue;
				}
				const list = [];
				if (target.countCards("h")) {
					list.push("手牌区");
				}
				if (target.countCards("e")) {
					list.push("装备区");
				}
				if (list.length == 0) {
					continue;
				}
				let result;
				if (list.length == 1) {
					result = { control: list[0] };
				} else {
					result = await target
						.chooseControl(list)
						.set("prompt", "返生：弃置一个区域的所有牌")
						.set("ai", () => [0, 1].randomGet())
						.forResult();
				}
				let pos = result.control == "手牌区" ? "h" : "e";
				let cards = target.getCards(pos);
				if (cards.length) {
					await target.discard(cards);
				}
			}
		},
	},
	tyansha: {
		inherit: "tysiji",
		trigger: { global: "phaseBegin" },
		filter(event, player) {
			return (
				player.countCards("hes") &&
				player.canUse(
					{
						name: "sha",
						nature: "stab",
					},
					event.player
				)
			);
		},
		group: "tyansha_range",
		subSkill: {
			range: {
				trigger: { player: "useCardAfter" },
				filter(event, player) {
					return event.skill == "tyansha_backup" && event.targets?.some(current => current.isIn() && !player.getStorage("tyansha_effect").includes(current));
				},
				firstDo: true,
				silent: true,
				content() {
					player.addTempSkill("tyansha_effect", "roundStart");
					player.markAuto(
						"tyansha_effect",
						trigger.targets.filter(current => current.isIn() && !player.getStorage("tyansha_effect").includes(current))
					);
				},
			},
			backup: {
				filterCard(card) {
					return get.itemtype(card) == "card";
				},
				viewAs: {
					name: "sha",
					nature: "stab",
				},
				selectCard: 1,
				position: "hes",
				ai1(card) {
					return 7 - get.value(card);
				},
				log: false,
			},
			effect: {
				charlotte: true,
				onremove: true,
				mod: {
					globalTo(from, to, num) {
						if (to.getStorage("tyansha_effect").includes(from)) {
							return -Infinity;
						}
					},
				},
				intro: { content: "$本轮计算与你的距离视为1" },
			},
		},
	},
	tycangshen: {
		forced: true,
		trigger: {
			player: "useCardAfter",
		},
		filter(event, player) {
			return event.card.name == "sha";
		},
		async content(event, trigger, player) {
			player.tempBanSkill("tycangshen", "roundStart");
		},
		mod: {
			globalTo(from, to, num) {
				if (!to.isTempBanned("tycangshen")) {
					return num + 1;
				}
			},
		},
	},
	tyxiongren: {
		trigger: {
			source: "damageBegin1",
		},
		filter(event, player) {
			if (get.distance(event.player, player) <= 1) {
				return false;
			}
			return event.card?.name == "sha";
		},
		forced: true,
		async content(event, trigger, player) {
			trigger.num++;
		},
		mod: {
			cardUsableTarget(card, player, target) {
				if (get.distance(target, player) <= 1) {
					return Infinity;
				}
			},
			targetInRange(card, player, target) {
				if (get.distance(target, player) <= 1) {
					return true;
				}
			},
		},
	},
	tysiji: {
		trigger: { global: "phaseEnd" },
		filter(event, player) {
			if (
				!event.player.hasHistory("lose", evt => {
					return !["useCard", "respond"].includes(evt.getParent().name);
				})
			) {
				return false;
			}
			return (
				player.countCards("hes") &&
				player.canUse(
					{
						name: "sha",
						nature: "stab",
					},
					event.player,
					false
				)
			);
		},
		direct: true,
		clearTime: true,
		async content(event, trigger, player) {
			const next = player.chooseToUse();
			next.set("openskilldialog", `${get.translation(event.name)}：是否将一张牌当作刺【杀】对${get.translation(trigger.player)}使用？`);
			next.set("norestore", true);
			next.set("_backupevent", `${event.name}_backup`);
			next.set("custom", {
				add: {},
				replace: { window() {} },
			});
			next.backup(`${event.name}_backup`);
			next.set("targetRequired", true);
			next.set("complexSelect", true);
			next.set("complexTarget", true);
			next.set("filterTarget", function (card, player, target) {
				const { sourcex } = get.event();
				if (target != sourcex && !ui.selected.targets.includes(sourcex)) {
					return false;
				}
				return lib.filter.targetEnabled.apply(this, arguments);
			});
			next.set("sourcex", trigger.player);
			next.set("addCount", false);
			next.set("logSkill", event.name);
			await next;
		},
		subSkill: {
			backup: {
				filterCard(card) {
					return get.itemtype(card) == "card";
				},
				viewAs: {
					name: "sha",
					nature: "stab",
				},
				selectCard: 1,
				position: "hes",
				ai1(card) {
					return 7 - get.value(card);
				},
				log: false,
			},
		},
	},
	tydaifa: {
		inherit: "tysiji",
		filter(event, player) {
			if (
				!game.hasPlayer2(current => {
					if (current == event.player) {
						return false;
					}
					if (
						current.hasHistory("lose", evt => {
							if (evt.type != "gain") {
								return false;
							}
							var evtx = evt.getParent();
							if (evtx.giver || evtx.getParent().name == "gift") {
								return false;
							}
							var cards = evtx.getg(event.player);
							if (!cards.length) {
								return false;
							}
							var cards2 = evtx.getl(current).cards2;
							for (var card of cards2) {
								if (cards.includes(card)) {
									return true;
								}
							}
							return false;
						})
					) {
						return true;
					}
				})
			) {
				return false;
			}
			return (
				player.countCards("hes") &&
				player.canUse(
					{
						name: "sha",
						nature: "stab",
					},
					event.player,
					false
				)
			);
		},
	},
	//桃神关羽
	tywushen: {
		audio: "wushen",
		enable: ["chooseToRespond", "chooseToUse"],
		filterCard(card, player) {
			return get.suit(card) == "heart";
		},
		position: "hes",
		viewAs: {
			name: "sha",
			storage: {
				tywushen: true,
			},
		},
		viewAsFilter(player) {
			if (!player.countCards("hes", { suit: "heart" })) {
				return false;
			}
		},
		prompt: "将一张红桃牌当杀使用或打出",
		check(card) {
			const val = get.value(card);
			if (_status.event.name == "chooseToRespond") {
				return 1 / Math.max(0.1, val);
			}
			return 5 - val;
		},
		ai: {
			skillTagFilter(player) {
				if (!player.countCards("hes", { suit: "heart" })) {
					return false;
				}
			},
			respondSha: true,
		},
		locked: false,
		mod: {
			cardUsable(card, player) {
				if (card?.storage?.tywushen) {
					return Infinity;
				}
			},
			targetInRange(card, player) {
				if (card?.storage?.tywushen) {
					return true;
				}
			},
		},
		group: "tywushen_respond",
		subSkill: {
			respond: {
				trigger: { player: "useCard" },
				direct: true,
				forced: true,
				filter(event, player) {
					return event.card?.storage?.tywushen;
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
			},
		},
	},
	tywuhun: {
		audio: "wuhun2",
		trigger: { player: "damageEnd" },
		filter(event, player) {
			return event.source && event.source.isIn();
		},
		forced: true,
		logTarget: "source",
		content() {
			trigger.source.addMark("tywuhun", trigger.num);
		},
		group: "tywuhun_die",
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
					return (
						event.source ||
						game.hasPlayer(function (current) {
							return current != player && current.hasMark("tywuhun");
						})
					);
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
						if (current != player && current.countMark("tywuhun") > num) {
							num = current.countMark("tywuhun");
						}
					}
					player
						.chooseTarget(true, "请选择【武魂】的目标", "令其进行判定，若判定结果不为【桃】，则其死亡", function (card, player, target) {
							return target != player && (target == _status.event.getTrigger().source || target.countMark("tywuhun") == _status.event.num);
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
						player.logSkill("tywuhun_die", target);
						player.line(target, { color: [255, 255, 0] });
						game.delay(2);
					}
					"step 2";
					target.judge(function (card) {
						if (["tao"].includes(card.name)) {
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
	//桃神张飞
	tyshencai: {
		audio: "shencai",
		enable: "phaseUse",
		filter(event, player) {
			if (player.countMark("tyshencai") > player.countMark("shencai")) {
				return false;
			}
			return true;
		},
		filterTarget: lib.filter.notMe,
		onremove: true,
		prompt: "选择一名其他角色进行地狱审判",
		content() {
			player.addMark("tyshencai", 1, false);
			player.addTempSkill("tyshencai_clear", "phaseUseEnd");
			var next = target.judge();
			next.callback = lib.skill.shencai.contentx;
		},
		ai: {
			order: 8,
			result: { target: -1 },
		},
		group: "tyshencai_wusheng",
		subSkill: {
			clear: {
				onremove: ["tyshencai"],
				charlotte: true,
			},
			wusheng: {
				audio: "shencai",
				enable: ["chooseToRespond", "chooseToUse"],
				filterCard(card, player) {
					return get.suit(card) == "none";
				},
				position: "hes",
				viewAs: {
					name: "sha",
					color: "none",
					suit: "none",
				},
				viewAsFilter(player) {
					if (!player.countCards("hes", { suit: "none" })) {
						return false;
					}
				},
				prompt: "将一张无色牌当杀使用或打出",
				check(card) {
					const val = get.value(card);
					if (_status.event.name == "chooseToRespond") {
						return 1 / Math.max(0.1, val);
					}
					return 5 - val;
				},
				ai: {
					skillTagFilter(player) {
						if (!player.countCards("hes", { color: "none" })) {
							return false;
						}
					},
					respondSha: true,
				},
			},
		},
	},
	tyxunshi: {
		audio: "xunshi",
		mod: {
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
		init(player, skill) {
			player.addSkill("tyxunshi_mark");
		},
		onremove(player, skill) {
			player.removeSkill("tyxunshi_mark");
		},
		trigger: { player: "useCard2" },
		forced: true,
		filter(event, player) {
			return get.color(event.card) == "none";
		},
		content() {
			"step 0";
			if (player.countMark("shencai") < 4 && player.hasSkill("tyshencai", null, null, false)) {
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
		subSkill: {
			mark: {
				charlotte: true,
				trigger: {
					player: "gainAfter",
					global: "loseAsyncAfter",
				},
				filter(event, player, name) {
					return event.getg(player).length && player.countCards("h");
				},
				direct: true,
				firstDo: true,
				content() {
					let cards1 = [],
						cards2 = [];
					player.getCards("h").forEach(card => {
						let bool1 = lib.skill.xunshi.isXunshi(card),
							bool2 = card.hasGaintag("tyxunshi_tag");
						if (bool1 && !bool2) {
							cards1.add(card);
						}
						if (!bool1 && bool2) {
							cards2.add(card);
						}
					});
					if (cards1.length) {
						player.addGaintag(cards1, "tyxunshi_tag");
					}
					if (cards2.length) {
						cards2.forEach(card => card.removeGaintag("tyxunshi_tag"));
					}
				},
			},
		},
	},
	//范强张达
	tybianta: {
		trigger: {
			target: "useCardToTargeted",
		},
		usable: 1,
		filter(event, player) {
			return get.tag(event.card, "damage") && event.cards?.length;
		},
		marktext: "怨",
		intro: {
			name: "怨",
			content: "expansion",
			markcount: "expansion",
		},
		init(player, skill) {
			if (player.getExpansions("tyxingsha").length) {
				for (let card of player.getExpansions("tyxingsha")) {
					card.gaintag.remove("tyxingsha");
					card.gaintag.add(skill);
				}
				player.markSkill(skill);
			}
		},
		onremove(player, skill) {
			if (!_status.event.getParent("tyxiezhan", true)) {
				let cards = player.getExpansions(skill);
				if (cards.length) {
					player.loseToDiscardpile(skill);
				}
			}
		},
		async content(event, trigger, player) {
			const next = player.addToExpansion(trigger.cards, "gain2");
			next.gaintag.add("tybianta");
			await next;
		},
		group: "tybianta_jieshu",
		subSkill: {
			jieshu: {
				trigger: {
					player: "phaseJieshuBegin",
				},
				filter(event, player) {
					return player.getExpansions("tybianta").length;
				},
				prompt2: "依次使用或打出你所有的“怨”",
				async content(event, trigger, player) {
					player.addTempSkill("tybianta_use");
					while (player.getExpansions("tybianta").length) {
						const card = player.getExpansions("tybianta")[0];
						if (player.hasUseTarget(card)) {
							const result = await player.chooseUseTarget(card).forResult();
							if (!result.bool) {
								break;
							}
						} else {
							break;
						}
					}
					player.removeSkill("tybianta_use");
				},
			},
			use: {
				enable: ["chooseToUse", "chooseToRespond"],
				filter(event, player) {
					if (!event.tybianta) {
						return false;
					}
					let card = event.tybianta;
					return event.filterCard(card, player, event);
				},
				onChooseToUse(event) {
					if (game.online) {
						return;
					}
					var player = event.player;
					if (!player.getExpansions("tybianta").length) {
						event.set("tybianta", false);
					} else {
						event.set("tybianta", player.getExpansions("tybianta")[0]);
					}
				},
				onChooseToRespond(event) {
					if (game.online) {
						return;
					}
					var player = event.player;
					if (!player.getExpansions("tybianta").length) {
						event.set("tybianta", false);
					} else {
						event.set("tybianta", player.getExpansions("tybianta")[0]);
					}
				},
				filterCard(card, player) {
					return card == _status.event.tybianta;
				},
				selectCard: -1,
				position: "x",
				viewAs(cards, player) {
					let card = _status.event.tybianta;
					if (card) {
						return card;
					}
					return null;
				},
				prompt(event, player) {
					let card = _status.event.tybianta;
					return `是否使用${get.translation(card)}？`;
				},
				precontent() {
					event.result.card = event.result.cards[0];
				},
				hiddenCard(player, name) {
					if (!player.getExpansions("tybianta").length) {
						return false;
					}
					return get.name(player.getExpansions("tybianta")[0], false) == name;
				},
				ai: {
					respondSha: true,
					respondShan: true,
					skillTagFilter(player, tag) {
						let name = tag.slice(7).toLowerCase();
						if (!player.getExpansions("tybianta").length) {
							return false;
						}
						return get.name(player.getExpansions("tybianta")[0], false) == name;
					},
				},
			},
		},
	},
	tybenxiang: {
		trigger: {
			source: "die",
		},
		locked: true,
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt2(event.name.slice(0, -5)), lib.filter.notMe, true)
				.set("ai", target => {
					return get.effect(target, { name: "draw" }, get.player(), get.player());
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			await target.draw(3);
		},
	},
	tyxiezhan: {
		audio: "juesheng",
		trigger: {
			player: ["phaseUseBegin", "enterGame"],
			global: "phaseBefore",
		},
		filter(event, player) {
			return event.name != "phase" || game.phaseNumber == 0;
		},
		locked: true,
		async cost(event, trigger, player) {
			let list = get.nameList(player),
				bool = trigger.name == "phaseUse";
			if (bool) {
				if (list.includes("ty_fanjiang")) {
					event.result = {
						bool: true,
						cost_data: "ty_zhangda",
					};
				} else if (list.includes("ty_zhangda")) {
					event.result = {
						bool: true,
						cost_data: "ty_fanjiang",
					};
				} else {
					bool = false;
				}
			}
			if (!bool) {
				const result = await player
					.chooseControl("范疆", "张达")
					.set("prompt", "协战：请变身")
					.set("ai", () => [0, 1].randomGet())
					.forResult();
				event.result = {
					bool: true,
					cost_data: result.control == "范疆" ? "ty_fanjiang" : "ty_zhangda",
				};
			}
		},
		async content(event, trigger, player) {
			let prename = player.name1;
			if (player.name2 && get.character(player.name2, 3).includes("tyxiezhan")) {
				prename = player.name2;
			}
			await player.reinitCharacter(prename, event.cost_data);
			await game.delay();
		},
	},
	tyxingsha: {
		marktext: "怨",
		intro: {
			name: "怨",
			content: "expansion",
			markcount: "expansion",
		},
		init(player, skill) {
			if (player.getExpansions("tybianta").length) {
				for (let card of player.getExpansions("tybianta")) {
					card.gaintag.remove("tybianta");
					card.gaintag.add(skill);
				}
				player.markSkill(skill);
			}
		},
		onremove(player, skill) {
			if (!_status.event.getParent("tyxiezhan", true)) {
				let cards = player.getExpansions(skill);
				if (cards.length) {
					player.loseToDiscardpile(skill);
				}
			}
		},
		enable: "phaseUse",
		filter(event, player) {
			return player.countCards("he") && !player.hasSkill("tyxingsha_used");
		},
		filterCard: true,
		selectCard: [1, 2],
		lose: false,
		discard: false,
		async content(event, trigger, player) {
			player.addTempSkill("tyxingsha_used");
			const next = player.addToExpansion(event.cards, player, "give");
			next.gaintag.add("tyxingsha");
			await next;
		},
		group: "tyxingsha_use",
		subSkill: {
			used: {
				charlotte: true,
			},
			use: {
				trigger: {
					player: "phaseJieshuBegin",
				},
				filter(event, player) {
					if (!player.hasUseTarget(get.autoViewAs({ name: "sha" }, "unsure"), false)) {
						return false;
					}
					return player.getExpansions("tyxingsha").length;
				},
				async cost(event, trigger, player) {
					const result = await player
						.chooseButton(["刑杀：是否将两张“怨”当作杀使用？", player.getExpansions("tyxingsha")], 2)
						.set("ai", button => {
							let player = get.player(),
								eff = player.getUseValue(get.autoViewAs({ name: "sha" }, "unsure"), false);
							if (eff <= 0) {
								return 0;
							}
							return player.getHp() - player.getUseValue(button.link);
						})
						.forResult();
					event.result = {
						bool: result.bool,
						cards: result.links,
					};
				},
				async content(event, trigger, player) {
					let card = get.autoViewAs({ name: "sha" }, event.cards);
					await player.chooseUseTarget(card, event.cards, false, "nodistance");
				},
			},
		},
	},
	tyxianshou: {
		trigger: {
			source: "die",
		},
		locked: true,
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt2(event.name.slice(0, -5)), lib.filter.notMe, true)
				.set("ai", target => {
					return get.effect(target, { name: "recover" }, get.player(), get.player());
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			if (target.isDamaged()) {
				await target.recover(2);
			}
		},
	},
	//刘阿
	tyxiyu: {
		trigger: {
			global: "useCardToPlayered",
		},
		filter(event, player) {
			return event.isFirstTarget && (get.is.convertedCard(event.card) || get.is.virtualCard(event.card));
		},
		frequent: true,
		async content(event, trigger, player) {
			await player.draw();
		},
	},
	//谭雄
	tylengjian: {
		trigger: {
			player: "useCardToTargeted",
		},
		filter(event, player) {
			if (event.card.name != "sha") {
				return false;
			}
			return !player.getStorage("tylengjian").includes(event.target);
		},
		intro: {
			content: "本回合已对$使用过【杀】",
		},
		forced: true,
		logTarget: "target",
		async content(event, trigger, player) {
			const target = event.targets[0];
			if (!player.getStorage("tylengjian").length) {
				player.when({ global: "phaseEnd" }).then(() => {
					player.unmarkSkill("tylengjian");
					delete player.storage.tylengjian;
				});
			}
			player.markAuto("tylengjian", target);
			if (player.inRange(target)) {
				const id = target.playerid;
				const map = trigger.getParent().customArgs;
				if (!map[id]) {
					map[id] = {};
				}
				if (typeof map[id].extraDamage != "number") {
					map[id].extraDamage = 0;
				}
				map[id].extraDamage++;
			} else {
				trigger.getParent().directHit.push(target);
			}
		},
		mod: {
			targetInRange(card, player, target) {
				if (card.name == "sha" && !player.inRange(target)) {
					if (!player.getStorage("tylengjian").includes(target)) {
						return true;
					}
				}
			},
		},
	},
	tysheju: {
		trigger: { player: "useCardAfter" },
		filter(event, player) {
			if (event.card.name != "sha") {
				return false;
			}
			return event.targets?.some(current => current.isIn() && current.countDiscardableCards(player, "he"));
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt2(event.skill), (card, player, target) => {
					return get.event().getTrigger().targets.includes(target) && target.countDiscardableCards(player, "he");
				})
				.set("ai", target => {
					return get.effect(target, { name: "guohe_copy2" }, get.player(), get.player());
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			const result = await player.discardPlayerCard(target, "he", true).forResult();
			if (!result?.bool || !result?.links?.length) {
				return;
			}
			let subtype = get.subtype(result.links[0]);
			if (subtype && ["equip3", "equip4", "equip6"].includes(subtype)) {
				return;
			}
			target.addTempSkill("tysheju_range");
			target.addMark("tysheju_range", 1, false);
			if (target.inRange(player)) {
				await target
					.chooseToUse(function (card, player, event) {
						if (get.name(card) != "sha") {
							return false;
						}
						return lib.filter.filterCard.apply(this, arguments);
					}, "是否对" + get.translation(player) + "使用一张杀？")
					.set("targetRequired", true)
					.set("complexSelect", true)
					.set("complexTarget", true)
					.set("filterTarget", function (card, player, target) {
						if (target != _status.event.sourcex && !ui.selected.targets.includes(_status.event.sourcex)) {
							return false;
						}
						return lib.filter.targetEnabled.apply(this, arguments);
					})
					.set("sourcex", player);
			}
		},
		subSkill: {
			range: {
				charlotte: true,
				onremove: true,
				mark: true,
				intro: { content: "本回合攻击范围+#" },
				mod: {
					attackFrom(from, to, distance) {
						return distance - from.countMark("tysheju_range");
					},
				},
			},
		},
	},
	//buzhi
	tyhongde: {
		audio: "hongde",
		trigger: {
			player: ["loseAfter", "gainAfter"],
			global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"],
		},
		filter(event, player) {
			var num = event.getl(player).cards2.length;
			if (event.getg) {
				num = Math.max(num, event.getg(player).length);
			}
			return num > 1;
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt2(event.skill))
				.set("ai", function (target) {
					let player = get.player(),
						name = get.attitude(player, target) > 0 ? "draw" : "guohe_copy2";
					return get.effect(target, { name: name }, player, player);
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			const result = await player
				.chooseControl("摸一张牌", "弃置一张牌")
				.set("prompt", `令${get.translation(target)}执行一项`)
				.set("target", target)
				.set("ai", () => {
					const player = get.player(),
						target = get.event("target");
					let eff1 = get.effect(target, { name: "guohe_copy2" }, player, player),
						eff2 = get.effect(target, { name: "draw" }, player, player);
					if (eff1 > eff2) {
						return 1;
					}
					return 0;
				})
				.forResult();
			if (result.index == 0) {
				await target.draw();
			} else if (target.countCards("he")) {
				await target.chooseToDiscard("he", true);
			}
		},
	},
	tydingpan: {
		audio: "dingpan",
		enable: "phaseUse",
		usable(skill, player) {
			return get.event().tydingpan?.length;
		},
		filter(event, player) {
			return game.hasPlayer(current => current.countCards("e"));
		},
		filterTarget(event, player, target) {
			return target.countCards("e");
		},
		onChooseToUse(event) {
			if (event.type != "phase" || game.online) {
				return;
			}
			var list = [],
				player = event.player;
			player.getHistory("useCard", function (evt) {
				list.add(get.type2(evt.card));
			});
			event.set("tydingpan", list);
		},
		async content(event, trigger, player) {
			const { target } = event;
			await target.draw();
			let goon = get.damageEffect(target, player, target) >= 0;
			if (!goon && target.hp >= 4 && get.attitude(player, target) < 0) {
				var es = target.getCards("e");
				for (var i = 0; i < es.length; i++) {
					if (get.equipValue(es[i], target) >= 8) {
						goon = true;
						break;
					}
				}
			}
			const result = await target
				.chooseControl(function () {
					if (_status.event.goon) {
						return "选项二";
					}
					return "选项一";
				})
				.set("goon", goon)
				.set("prompt", "定叛")
				.set("choiceList", ["令" + get.translation(player) + "弃置你两张牌", "获得你装备区内的所有牌并受到1点伤害"])
				.forResult();
			if (result.index == 0) {
				await player.discardPlayerCard(target, "he", Math.min(target.countCards("he"), 2), true);
			} else {
				await target.gain(target.getCards("e"), "gain2");
				await target.damage();
			}
		},
		ai: {
			order: 7,
			result: {
				target(player, target) {
					if (get.damageEffect(target, player, target) >= 0) {
						return 2;
					}
					var att = get.attitude(player, target);
					if (att == 0) {
						return 0;
					}
					var es = target.getCards("e");
					if (att > 0 && (target.countCards("h") > 2 || target.needsToDiscard(1))) {
						return 0;
					}
					if (es.length == 1 && att > 0) {
						return 0;
					}
					for (var i = 0; i < es.length; i++) {
						var val = get.equipValue(es[i], target);
						if (val <= 4) {
							if (att > 0) {
								return 1;
							}
						} else if (val >= 7) {
							if (att < 0) {
								return -1;
							}
						}
					}
					return 0;
				},
			},
		},
	},
	//甘宁
	tyqixi: {
		audio: "qixi",
		inherit: "qixi",
		group: "tyqixi_nowuxie",
		subSkill: {
			nowuxie: {
				trigger: {
					player: "useCard",
				},
				filter(event, player) {
					if (event.card.name != "guohe" || !get.is.convertedCard(event.card)) {
						return false;
					}
					return event.cards?.some(card => get.type(card) != "basic");
				},
				direct: true,
				async content(event, trigger, player) {
					trigger.directHit.addArray(game.players);
				},
			},
		},
	},
	tyfenwei: {
		skillAnimation: true,
		animationColor: "wood",
		audio: "fenwei",
		trigger: { global: "useCardToPlayered" },
		filter(event, player) {
			if (event.getParent().triggeredTargets3.length > 1) {
				return false;
			}
			if (get.type(event.card) != "trick") {
				return false;
			}
			if (get.info(event.card).multitarget) {
				return false;
			}
			if (event.targets.length < 2) {
				return false;
			}
			return true;
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt(event.skill), [1, trigger.targets.length], function (card, player, target) {
					return _status.event.targets.includes(target);
				})
				.set("ai", function (target) {
					var trigger = _status.event.getTrigger();
					if (game.phaseNumber > game.players.length * 2 && trigger.targets.length >= game.players.length - 1 && !trigger.excluded.includes(target)) {
						return -get.effect(target, trigger.card, trigger.player, _status.event.player);
					}
					return -1;
				})
				.set("targets", trigger.targets)
				.forResult();
		},
		async content(event, trigger, player) {
			trigger.getParent().excluded.addArray(event.targets);
			let num = Math.max(1, player.getAllHistory("useSkill", evt => evt.skill == event.name).length - 1);
			const result = await player
				.chooseBool(`失去${num}点体力，或点取消失去【奋威】`)
				.set("choice", player.hp > num)
				.forResult();
			if (result.bool) {
				await player.loseHp(num);
			} else {
				await player.removeSkills(event.name);
			}
		},
	},
	//陆逊
	tyqianshou: {
		mark: true,
		zhuanhuanji: true,
		marktext: "☯",
		intro: {
			content(storage) {
				if (storage) {
					return "其他角色的回合开始时，若其体力值大于你，或其未处于横置状态，你可令其展示并交给你一张牌，若此牌不为黑色，你失去1点体力。";
				}
				return "其他角色的回合开始时，若其体力值大于你，或其未处于横置状态，你可展示并交给其一张红色牌，本回合你不能使用手牌且你与其不能成为牌的目标。";
			},
		},
		trigger: {
			global: "phaseBegin",
		},
		filter(event, player) {
			if (event.player == player) {
				return false;
			}
			if (event.player.hp <= player.hp && event.player.isLinked()) {
				return false;
			}
			if (player.storage.tyqianshou) {
				return event.player.countCards("he");
			}
			return player.countCards("he", { color: "red" });
		},
		async cost(event, trigger, player) {
			if (player.storage.tyqianshou) {
				event.result = await player
					.chooseBool(get.prompt2(event.skill, trigger.player))
					.set("choice", get.attitude(player, trigger.player) > 0 || player.hp > 1)
					.forResult();
			} else {
				event.result = await player
					.chooseCard(get.prompt2(event.skill, trigger.player), "he", function (card) {
						return get.color(card) == "red";
					})
					.set(
						"canGive",
						(function () {
							const att = get.attitude(player, trigger.player) > 0;
							if (trigger.player.hp >= 3) {
								return att;
							}
							if (trigger.player.countCards("h") < 4) {
								return att;
							}
							return false;
						})()
					)
					.set("ai", card => {
						if (get.event("canGive")) {
							return 6 - get.value(card);
						}
						return 0;
					})
					.forResult();
			}
			event.result.targets = [trigger.player];
		},
		async content(event, trigger, player) {
			player.changeZhuanhuanji(event.name);
			if (player.storage[event.name]) {
				await player.showCards(get.translation(player) + "发动了【谦守】", event.cards);
				await player.give(event.cards, event.targets[0]);
				player.addTempSkill("tyqianshou_use");
				for (let target of [player].concat(event.targets)) {
					target.addTempSkill("tyqianshou_target");
				}
			} else {
				const target = event.targets[0],
					result = await target
						.chooseCard("he", true, `交给${get.translation(player)}一张牌，若不为黑色其失去1点体力`)
						.set("att", get.attitude(target, player))
						.set("ai", card => {
							let att = _status.event.att,
								val = 7 - get.value(card);
							if (get.color(card) == "black") {
								val += att;
							}
							return val;
						})
						.forResult();
				await target.showCards(get.translation(player) + "发动了【谦守】", result.cards);
				await target.give(result.cards, player);
				if (
					!player.getHistory("gain", evt => {
						return evt?.cards?.includes(result.cards[0]) && evt.getParent(event.name) == event;
					}).length
				) {
					return;
				}
				if (get.color(result.cards[0]) != "black") {
					await player.loseHp();
				}
			}
		},
		subSkill: {
			use: {
				mark: true,
				marktext: '<span style="text-decoration: line-through;">谦</span>',
				mod: {
					cardEnabled2(card) {
						if (get.position(card) == "h") {
							return false;
						}
					},
				},
				charlotte: true,
				intro: {
					content: "不能使用或打出手牌",
				},
			},
			target: {
				charlotte: true,
				mark: true,
				marktext: '<span style="text-decoration: line-through;">守</span>',
				intro: { content: "本回合无法成为牌的目标" },
				mod: { targetEnabled: () => false },
			},
		},
	},
	tytanlong: {
		enable: "phaseUse",
		usable(skill, player) {
			return 1 + game.countPlayer(current => current.isLinked());
		},
		filter(event, player) {
			return game.hasPlayer(current => player.canCompare(current));
		},
		filterTarget(event, player, target) {
			return player.canCompare(target);
		},
		async content(event, trigger, player) {
			const { target } = event;
			const next = player.chooseToCompare(target);
			if (get.attitude(player, target) > 0) {
				next.set("small", true);
			}
			const result = await next.forResult();
			if (result.tie) {
				return;
			}
			let winner = result.bool ? player : target,
				card = result[result.bool ? "target" : "player"];
			if (winner?.isIn() && card && [card].filterInD("d")) {
				let bool = get.attitude(winner, player) > 0;
				if (winner.getUseValue(card) >= 4) {
					bool = true;
				}
				const result2 = await winner
					.chooseBool(`是否获得${get.translation(card)}并视为对自己使用一张【铁索连环】？`)
					.set("choice", bool)
					.forResult();
				if (!result2.bool) {
					return;
				}
				await winner.gain(card, "gain2");
				let cardx = { name: "tiesuo", isCard: true };
				if (winner.canUse(cardx, winner)) {
					await winner.useCard(cardx, winner);
				}
			}
		},
		ai: {
			order: 7,
			result: {
				target(player, target) {
					return get.effect(target, { name: "tiesuo" }, target, target);
				},
			},
		},
	},
	tyxibei: {
		trigger: {
			global: ["gainAfter", "loseAsyncAfter"],
		},
		getIndex(event, player) {
			if (!event.getg) {
				return [];
			}
			return game
				.filterPlayer(current => {
					if (current == player) {
						return false;
					}
					if (event.name == "gain") {
						return event.getg(current)?.length && event.notFromCardpile;
					}
					return event.getg(current)?.some(card => {
						return card.original != "c";
					});
				})
				.sortBySeat();
		},
		logTarget(event, player, name, target) {
			return target;
		},
		frequent: true,
		async content(event, trigger, player) {
			await player.draw();
			if (!player.isPhaseUsing()) {
				return;
			}
			const result = await player
				.chooseCard("h", "是否展示一张锦囊牌，令此牌视为【火烧连营】？", card => {
					return get.type2(card) == "trick";
				})
				.set("ai", card => {
					let player = get.player();
					if (player.getUseValue("huogong") > 0) {
						return 6 - get.value(card);
					}
					return 0;
				})
				.forResult();
			if (!result.bool) {
				return;
			}
			game.broadcastAll(function (cards) {
				cards.forEach(card => card.addGaintag("tyxibei"));
			}, result.cards);
			player.addTempSkill("tyxibei_viewAs");
		},
		group: "tyxibei_record",
		subSkill: {
			record: {
				trigger: { global: "gainBefore" },
				direct: true,
				filter(event, player) {
					if (player == event.player) {
						return false;
					}
					if (event.cards?.length) {
						if (event.getParent().name == "draw") {
							return false;
						}
						for (var i = 0; i < event.cards.length; i++) {
							if (get.position(event.cards[i]) != "c" || (!get.position(event.cards[i]) && event.cards[i].original != "c")) {
								return true;
							}
						}
					}
					return false;
				},
				content() {
					trigger.notFromCardpile = true;
				},
			},
			viewAs: {
				mod: {
					cardname(card, player) {
						if (card.hasGaintag("tyxibei")) {
							return "lx_huoshaolianying";
						}
					},
				},
				charlotte: true,
				onremove(player) {
					player.removeGaintag("tyxibei");
				},
			},
		},
	},
	//神刘
	tylongnu: {
		mark: true,
		zhuanhuanji: true,
		marktext: "☯",
		intro: {
			content(storage) {
				if (storage) {
					return "出牌阶段开始时，你可以减少1点体力上限并摸一张牌，然后本阶段内你可以将锦囊牌当作无次数限制雷杀使用或打出";
				}
				return "锁定技，出牌阶段开始时，你可以失去1点体力并摸一张牌，然后本阶段内你可以将红色手牌当作无距离限制的火杀使用或打出";
			},
		},
		audio: "nzry_longnu",
		trigger: {
			player: "phaseUseBegin",
		},
		async content(event, trigger, player) {
			player.changeZhuanhuanji("tylongnu");
			await player.draw();
			if (!player.storage.tylongnu) {
				await player.loseMaxHp();
				player.addTempSkill("tylongnu_yang", "phaseUseAfter");
			} else {
				await player.loseHp();
				player.addTempSkill("tylongnu_yin", "phaseUseAfter");
			}
		},
		group: "tylongnu_change",
		subSkill: {
			change: {
				audio: "nzry_longnu",
				trigger: {
					global: "phaseBefore",
					player: "enterGame",
				},
				filter(event, player) {
					return event.name != "phase" || game.phaseNumber == 0;
				},
				prompt2(event, player) {
					return "切换【龙怒】为状态" + (player.storage.tylongnu ? "阴" : "阳");
				},
				check: () => Math.random() > 0.5,
				content() {
					player.changeZhuanhuanji("tylongnu");
				},
			},
			yang: {
				mod: {
					cardUsable(card, player) {
						if (card?.storage?.tylongnu) {
							return Infinity;
						}
					},
				},
				charlotte: true,
				locked: false,
				audio: "nzry_longnu",
				enable: ["chooseToUse", "chooseToRespond"],
				filterCard(card, player) {
					return get.type2(card) == "trick";
				},
				position: "hes",
				viewAs: {
					name: "sha",
					nature: "thunder",
					storage: {
						tylongnu: true,
					},
				},
				viewAsFilter(player) {
					if (!player.countCards("hes", card => get.type2(card) == "trick")) {
						return false;
					}
				},
				prompt: "将一张锦囊牌当雷杀使用或打出",
				check(card) {
					var val = get.value(card);
					return 5 - val;
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
			yin: {
				mod: {
					targetInRange(card) {
						if (card?.storage?.tylongnu) {
							return true;
						}
					},
				},
				charlotte: true,
				locked: false,
				audio: "nzry_longnu",
				enable: ["chooseToUse", "chooseToRespond"],
				filterCard(card, player) {
					return get.color(card) == "red";
				},
				position: "hs",
				viewAs: {
					name: "sha",
					nature: "fire",
					storage: {
						tylongnu: true,
					},
				},
				viewAsFilter(player) {
					if (!player.countCards("hs", { color: "red" })) {
						return false;
					}
				},
				prompt: "将一张红色手牌当火杀使用或打出",
				check(card) {
					var val = get.value(card);
					return 5 - val;
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
	tytaoyuan: {
		enable: "phaseUse",
		usable: 1,
		filterCard: true,
		selectCard: 2,
		position: "he",
		filterTarget: true,
		check(card) {
			return 4 - get.value(card);
		},
		async content(event, trigger, player) {
			const card = game.createCard("taoyuan", "heart", 1);
			if (card) {
				await event.target.gain(card, "gain2");
			}
		},
		ai: {
			order: 4,
			result: {
				target(player, target) {
					if (target.getUseValue("taoyuan") * get.sgnAttitude(player, target) >= player.getUseValue("wuzhong")) {
						return 1;
					}
					return 0;
				},
			},
		},
	},
	//关银屏
	tywuji: {
		skillAnimation: true,
		animationColor: "orange",
		audio: "wuji",
		trigger: { player: "phaseJieshuBegin" },
		forced: true,
		juexingji: true,
		filter(event, player) {
			return player.getStat("damage") >= 3;
		},
		async content(event, trigger, player) {
			player.awakenSkill(event.name);
			await player.gainMaxHp();
			await player.recover();
			await player.removeSkills(["huxiao", "draghuxiao"]);
			const result = await player
				.chooseControl("获得青龙刀", "摸两张牌")
				.set("prompt", "武继：选择一项")
				.set("ai", () => 1)
				.forResult();
			if (result.index == 0) {
				const card = game.createCard("qinglong", "spade", 5);
				if (card) {
					await player.gain(card, "gain2", "log");
				}
			} else {
				await player.draw(2);
			}
		},
	},
	//沙和尚
	tymanyong: {
		onremove: true,
		trigger: {
			player: ["phaseZhunbeiBegin", "phaseJieshuBegin"],
		},
		filter(event, player) {
			let hasCard = player.getEquips("tiejili").length > 0;
			if (event.name == "phaseZhunbei") {
				return !hasCard;
			}
			return hasCard;
		},
		async content(event, trigger, player) {
			if (trigger.name == "phaseZhunbei") {
				const card = game.createCard("tiejili", "spade", 5);
				if (card) {
					player.$gain2(card);
					await player.chooseUseTarget(card, true);
				}
			} else {
				const cards = player.getEquips("tiejili");
				if (cards?.length) {
					await player.discard(cards);
				}
			}
		},
	},
	//关兴
	tyconglong: {
		trigger: {
			global: ["useCard", "damageBegin1", "phaseEnd"],
		},
		filter(event, player) {
			if (event.name == "phase") {
				let num = 0;
				player.getHistory("lose", evt => {
					if (evt.type == "discard") {
						num += evt.cards2.length;
					}
				});
				return num >= 2;
			}
			if (!event.card || event.card.name != "sha" || get.color(event.card) != "red") {
				return false;
			}
			return player.countCards("he", card => get.type2(card) == (event.name == "damage" ? "equip" : "trick"));
		},
		frequent: true,
		async cost(event, trigger, player) {
			if (trigger.name == "phase") {
				event.result = await player.chooseBool(get.prompt(event.skill), "摸一张牌").set("frequentSkill", event.skill).forResult();
			} else {
				const eff1 = get.damageEffect(trigger.player, trigger.source, player);
				const eff2 = get.attitude(player, trigger.player);
				event.result = await player
					.chooseToDiscard("he", card => {
						const type = _status.event.typex;
						return get.type2(card) == type;
					})
					.set("typex", trigger.name == "damage" ? "equip" : "trick")
					.set("prompt", get.prompt(event.skill))
					.set("prompt2", trigger.name == "damage" ? "令此伤害+1" : "令此牌不可响应")
					.set("eff", trigger.name == "damage" ? eff1 : eff2)
					.set("ai", card => {
						if (get.event("eff") <= 0) {
							return 0;
						}
						if (get.color(card) == "red") {
							return 4 - get.value(card);
						}
						return 8 - get.value(card);
					})
					.set("chooseonly", true)
					.forResult();
			}
		},
		async content(event, trigger, player) {
			if (trigger.name == "phase") {
				await player.draw();
			} else {
				await player.discard(event.cards);
				if (trigger.name == "damage") {
					trigger.num++;
				} else {
					trigger.directHit.addArray(game.players);
				}
			}
		},
	},
	tyzhaowu: {
		trigger: { player: "damageEnd" },
		filter(event, player) {
			if (!player.countCards("he")) {
				return false;
			}
			return event.source && event.source != player;
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseToDiscard("he", get.prompt2(event.skill, trigger.source))
				.set("ai", card => {
					let player = get.player(),
						target = get.event().getTrigger().source;
					if (get.attitude(player, target) >= 0 || player.getStorage("tyzhaowu").includes(target)) {
						return 0;
					}
					return 7 - get.value(card);
				})
				.set("chooseonly", true)
				.forResult();
			event.result.targets = [trigger.source];
		},
		async content(event, trigger, player) {
			await player.discard(event.cards);
			player.addTempSkill("tyzhaowu_wusheng", "roundStart");
			player.markAuto("tyzhaowu_wusheng", event.targets);
		},
		subSkill: {
			wusheng: {
				mark: true,
				intro: {
					content: "本轮可对$使用父亲的力量",
				},
				charlotte: true,
				onremove: true,
				mod: {
					targetInRange(card, player, target) {
						if (player.getStorage("tyzhaowu_wusheng").includes(target)) {
							return true;
						}
					},
					playerEnabled(card, player, target) {
						if (player.getStorage("tyzhaowu_wusheng").includes(target)) {
							return;
						}
						if (card.storage?.tyzhaowu) {
							return false;
						}
					},
				},
				locked: false,
				audio: "new_rewusheng",
				enable: "chooseToUse",
				filterCard(card, player) {
					return get.color(card) == "red";
				},
				position: "hes",
				viewAs: {
					name: "sha",
					storage: {
						tyzhaowu: true,
					},
				},
				viewAsFilter(player) {
					if (!player.countCards("hes", { color: "red" })) {
						return false;
					}
				},
				prompt: "将一张红色牌当杀使用或打出",
				check(card) {
					var val = get.value(card);
					return 5 - val;
				},
				ai: {
					respondSha: true,
					skillTagFilter(player) {
						if (!player.countCards("hes", { color: "red" })) {
							return false;
						}
					},
				},
			},
		},
	},
	//侍从
	tyjinzhong: {
		trigger: {
			player: ["phaseUseBegin", "damageEnd"],
		},
		filter(event, player) {
			if (game.hasPlayer(i => i.getSeatNum() == 1 || get.nameList(i).some(name => get.rawName(name) == "刘备"))) {
				return true;
			}
			if (player.countCards("h")) {
				return true;
			}
			return false;
		},
		seatRelated: true,
		async cost(event, trigger, player) {
			const result = await player
				.chooseControl("选项一", "选项二", "cancel2")
				.set("choiceList", ["失去1点体力，令一号位或“刘备”回复1点体力", "交给一名角色至多两张手牌"])
				.set("prompt", get.prompt(event.skill))
				.set(
					"choice",
					(function () {
						let targets = game.filterPlayer(i => i.getSeatNum() == 1 || get.nameList(i).some(name => get.rawName(name) == "刘备"));
						if (targets?.length && targets.some(i => get.attitude(player, i) > 0 && i.hp <= player.hp)) {
							return "选项一";
						}
						if (game.hasPlayer(i => get.attitude(player, i) > 0 && player.countCards("h") > Math.min(2, player.hp))) {
							return "选项二";
						}
						return "cancel2";
					})()
				)
				.set("ai", () => get.event("choice"))
				.forResult();
			if (result.control == "cancel2") {
				event.result = { bool: false };
				return;
			}
			if (result.control == "选项一") {
				event.result = await player
					.chooseTarget("尽忠：是否失去1点体力并令一号位或“刘备”回复1点体力？", function (card, player, target) {
						return target.getSeatNum() == 1 || get.nameList(target).some(name => get.rawName(name) == "刘备");
					})
					.set("ai", target => {
						const player = get.player();
						if (get.attitude(player, target) <= 0) {
							return 0;
						}
						return player.hp + 1 - target.hp;
					})
					.forResult();
			} else {
				event.result = await player
					.chooseCardTarget({
						filterCard: true,
						selectCard: [1, 2],
						position: "h",
						filterTarget: lib.filter.notMe,
						prompt: "尽忠：是否交给一名其他角色至多两张牌？",
						ai1(card) {
							return 8 - get.value(card);
						},
						ai2(target) {
							let player = _status.event.player,
								card = ui.selected.cards[0],
								att = get.attitude(player, target);
							if (att <= 0) {
								return 0;
							}
							return target.getUseValue(card) + 4;
						},
					})
					.forResult();
			}
		},
		async content(event, trigger, player) {
			if (event.cards?.length > 0) {
				await player.give(event.cards, event.targets[0]);
			} else {
				await player.loseHp();
				await event.targets[0].recover();
			}
		},
	},
	//吴班
	tyyoujun: {
		audio: "dcyouzhan",
		enable: "phaseUse",
		usable: 1,
		filterTarget(card, player, target) {
			return target.countGainableCards(player, "he") && target != player;
		},
		async content(event, trigger, player) {
			const target = event.target;
			await player.gainPlayerCard(target, "he", true);
			const result = await target
				.chooseBool("是否令你所有手牌视为杀，然后视为对" + get.translation(player) + "使用决斗？")
				.set("choice", get.effect(player, { name: "juedou" }, target, target) > 0)
				.forResult();
			if (result.bool) {
				target.addTempSkill("tyyoujun_sha");
				const card = { name: "juedou", isCard: true };
				if (target.canUse(card, player)) {
					await target.useCard(card, player);
				}
			}
		},
		subSkill: {
			sha: {
				charlotte: true,
				mod: {
					cardname(card) {
						return "sha";
					},
				},
			},
		},
		ai: {
			order: 5,
			result: {
				target(player, target) {
					if (player.hp == 1) {
						return 0;
					}
					return get.effect(target, { name: "shunshou_copy2" }, player, target);
				},
			},
		},
	},
	tyjicheng: {
		skillAnimation: true,
		animationColor: "fire",
		limited: true,
		trigger: {
			player: "damageEnd",
		},
		filter(event, player) {
			if (player.hp > 2) {
				return false;
			}
			return event.card && get.type(event.card) == "trick";
		},
		async content(event, trigger, player) {
			player.awakenSkill(event.name);
			await player.chooseDrawRecover(2, true);
		},
	},
	//黄忠
	tyyizhuang: {
		trigger: { player: "phaseZhunbeiBegin" },
		filter(event, player) {
			return player.countCards("j");
		},
		check(event, player) {
			return player.hp > 1 && player.countCards("j", card => card.viewAs || card.name != "jsrg_xumou");
		},
		async content(event, trigger, player) {
			await player.damage();
			await player.discardPlayerCard(player, "j", true, player.countCards("j"));
		},
	},
	//廖化
	tydangxian: {
		trigger: { player: "phaseBegin" },
		forced: true,
		audio: "dangxian",
		async content(event, trigger, player) {
			const cards = Array.from(ui.discardPile.childNodes).filter(card => card.name == "sha");
			if (cards.length) {
				const result = await player.chooseButton(["获得一张杀", cards], true).forResult();
				if (result?.bool && result?.links?.length) {
					await player.gain(result.links, "gain2");
				}
			}
			game.updateRoundNumber();
			trigger.phaseList.splice(trigger.num, 0, `phaseUse|${event.name}`);
		},
	},
	tyfuli: {
		audio: "xinfuli",
		skillAnimation: true,
		animationColor: "soil",
		limited: true,
		enable: "chooseToUse",
		filter(event, player) {
			if (event.type != "dying") {
				return false;
			}
			if (player != event.dying) {
				return false;
			}
			return true;
		},
		async content(event, trigger, player) {
			player.awakenSkill(event.name);
			await player.recoverTo(2);
			await player.drawTo(2);
		},
		ai: {
			order: 3,
			save: true,
			skillTagFilter(player, arg, target) {
				return player == target;
			},
			result: { player: 10 },
			threaten(player, target) {
				if (!target.storage.tyfuli) {
					return 0.9;
				}
			},
		},
	},
	//冯习
	tyqingkou: {
		audio: "twqingkou",
		trigger: {
			player: "phaseJieshuBegin",
		},
		frequent: true,
		async content(event, trigger, player) {
			const result = await player.draw("bottom").forResult();
			await player.showCards(get.translation(player) + "发动了【轻寇】", result);
			if (result?.length != 1) {
				return;
			}
			let list = [],
				card = result[0];
			for (let name of lib.inpile) {
				if (get.type(name) == "trick" && get.cardNameLength(name) == player.hp) {
					list.push(["锦囊", "", name]);
				}
			}
			list.push(["基本", "", "sha"]);
			const result2 = await player
				.chooseButton([`是否将${get.translation(result)}当作其中一张使用？`, [list, "vcard"]])
				.set("filterButton", button => {
					let card = get.autoViewAs({ name: button.link[2], natrue: button.link[3] }, get.event("resultCard"));
					return get.player().hasUseTarget(card);
				})
				.set("resultCard", [card])
				.set("ai", button => {
					let card = get.autoViewAs({ name: button.link[2], natrue: button.link[3] }, get.event("resultCard"));
					return get.player().getUseValue(card);
				})
				.forResult();
			if (result2.bool && player.getCards("h").includes(card)) {
				const cardx = { name: result2.links[0][2], natrue: result2.links[0][3] };
				game.broadcastAll(function (card) {
					lib.skill.tyqingkou_backup.viewAs = card;
					lib.skill.tyqingkou_backup.prompt = `是否将此牌当作${get.translation(card)}使用？`;
				}, cardx);
				const next = player.chooseToUse();
				next.set("cards", result);
				next.set("openskilldialog", `是否将此牌当作${get.translation(cardx)}使用？`);
				next.set("norestore", true);
				next.set("_backupevent", "tyqingkou_backup");
				next.set("custom", {
					add: {},
					replace: { window() {} },
				});
				next.backup("tyqingkou_backup");
				await next;
			}
		},
		subSkill: {
			backup: {
				filterCard(card) {
					return get.itemtype(card) == "card" && get.event("cards").includes(card);
				},
				position: "h",
				selectCard: 1,
				check: card => 7 - get.value(card),
				popname: true,
			},
		},
	},
	//张南
	tyfenwu: {
		audio: "twfenwu",
		trigger: { player: "phaseZhunbeiBegin" },
		frequent: true,
		async content(event, trigger, player) {
			const result = await player.draw().forResult();
			if (get.itemtype(result) != "cards") {
				return;
			}
			await player.showCards(get.translation(player) + "发动了【奋武】", result);
			if (result?.length != 1) {
				return;
			}
			let list = [],
				card = result[0];
			for (let name of lib.inpile) {
				if (get.type(name) == "basic" && get.cardNameLength(name) == get.cardNameLength(card)) {
					list.push(["基本", "", name]);
					if (name == "sha") {
						for (let nature of lib.inpile_nature) {
							list.push(["基本", "", name, nature]);
						}
					}
				}
			}
			list.push(["锦囊", "", "juedou"]);
			const result2 = await player
				.chooseButton([`是否将${get.translation(result)}当作其中一张使用？`, [list, "vcard"]])
				.set("filterButton", button => {
					let card = get.autoViewAs({ name: button.link[2], natrue: button.link[3] }, get.event("resultCard"));
					return get.player().hasUseTarget(card);
				})
				.set("resultCard", [card])
				.set("ai", button => {
					let card = get.autoViewAs({ name: button.link[2], natrue: button.link[3] }, get.event("resultCard"));
					return get.player().getUseValue(card);
				})
				.forResult();
			if (result2.bool && result2?.links?.length && player.getCards("h").includes(card)) {
				const cardx = { name: result2.links[0][2], natrue: result2.links[0][3] };
				game.broadcastAll(function (card) {
					lib.skill.tyfenwu_backup.viewAs = card;
					lib.skill.tyfenwu_backup.prompt = `是否将此牌当作${get.translation(card)}使用？`;
				}, cardx);
				const next = player.chooseToUse();
				next.set("cards", result);
				next.set("openskilldialog", `是否将此牌当作${get.translation(cardx)}使用？`);
				next.set("norestore", true);
				next.set("_backupevent", "tyfenwu_backup");
				next.set("custom", {
					add: {},
					replace: { window() {} },
				});
				next.backup("tyfenwu_backup");
				await next;
			}
		},
		subSkill: {
			backup: {
				filterCard(card) {
					return get.itemtype(card) == "card" && get.event("cards").includes(card);
				},
				position: "h",
				selectCard: 1,
				check: card => 7 - get.value(card),
				popname: true,
				log: false,
			},
		},
	},
	//赵融
	tyyuantao: {
		trigger: {
			global: "useCard",
		},
		usable: 1,
		filter(event, player) {
			if (!event.targets.length) {
				return false;
			}
			return get.type(event.card) == "basic";
		},
		check(event, player) {
			return get.effect(event.targets[0], event.card, event.player, player) > 0 && player.hp > 2;
		},
		async content(event, trigger, player) {
			trigger.effectCount++;
			player.when({ global: "phaseEnd" }).then(() => {
				player.loseHp();
			});
		},
	},
	//程畿
	tyzhongen: {
		trigger: {
			global: "phaseJieshuBegin",
		},
		filter(event, player) {
			return player.getHistory("gain").length + player.getHistory("lose", evt => evt.hs?.length).length;
		},
		async cost(event, trigger, player) {
			const target = trigger.player,
				goon = player.hasCard(card => {
					if (_status.connectMode) {
						return true;
					}
					return get.name(card, player) == "sha" && game.checkMod(card, player, "unchanged", "cardEnabled2", player) !== false && lib.filter.targetEnabled2(get.autoViewAs({ name: "wuzhong" }, [card]), player, target);
				}, "hs");
			let list = [];
			if (goon) {
				list.push("选项一");
			}
			list.addArray(["选项二", "cancel2"]);
			const { result } = await player
				.chooseControl(list)
				.set("choiceList", [`将一张【杀】当【无中生有】对${get.translation(target)}使用`, `使用一张无距离限制的【杀】`])
				.set("ai", () => {
					const player = get.event("player"),
						target = get.event().getTrigger().player;
					return get.effect(target, { name: "wuzhong" }, player, player) > player.getUseValue({ name: "sha" }) ? 0 : 1;
				});
			event.result = {
				bool: result.control != "cancel2",
				skill_popup: false,
				cost_data: result.control,
			};
		},
		async content(event, trigger, player) {
			const index = event.cost_data,
				target = trigger.player;
			if (index == "选项一") {
				const {
					result: { bool, cards },
				} = await player
					.chooseCard(
						"hes",
						true,
						(card, player) => {
							if (get.name(card, player) != "sha") {
								return false;
							}
							if (!game.checkMod(card, player, "unchanged", "cardEnabled2", player)) {
								return false;
							}
							return lib.filter.targetEnabled2(get.autoViewAs({ name: "wuzhong" }, [card]), player, get.event("target"));
						},
						"将一张【杀】当作【无中生有】对" + get.translation(target) + "使用"
					)
					.set("ai", card => {
						const player = get.event("player"),
							target = get.event("target");
						return get.effect(target, get.autoViewAs({ name: "wuzhong" }, [card]), player, player) / Math.max(1, get.value(card));
					})
					.set("target", target);
				if (bool) {
					player.logSkill(event.name, target);
					await player.useCard({ name: "wuzhong" }, cards, target, false);
				}
			} else {
				await player
					.chooseToUse(function (card, player, event) {
						if (get.name(card) != "sha") {
							return false;
						}
						return lib.filter.filterCard.apply(this, arguments);
					}, "忠恩：是否使用一张【杀】？")
					.set("targetRequired", true)
					.set("complexSelect", true)
					.set("filterTarget", function (card, player, target) {
						return lib.filter.targetEnabled.apply(this, arguments);
					})
					.set("logSkill", event.name)
					.set("addCount", false)
					.forResult();
			}
		},
	},
	tyliebao: {
		trigger: { global: "useCardToTarget" },
		filter(event, player) {
			if (event.card.name != "sha" || event.targets?.includes(player)) {
				return false;
			}
			if (!event.target.isMinHandcard()) {
				return false;
			}
			return lib.filter.targetEnabled(event.card, event.player, player);
		},
		check(event, player) {
			return get.attitude(player, event.target) > 0 && (player.hp > 2 || player.countCards("h", "shan"));
		},
		logTarget: "target",
		async content(event, trigger, player) {
			const target = event.targets[0];
			const evt = trigger.getParent();
			evt.triggeredTargets2.remove(target);
			evt.targets.remove(target);
			evt.targets.push(player);
			await player.draw();
			target
				.when({ global: "useCardAfter" })
				.filter(evt => evt.card == trigger.card)
				.then(() => {
					if (!skiller.hasHistory("damage", evt => evt.getParent("useCard") == evtx) && player.isDamaged()) {
						player.recover();
					}
				})
				.vars({
					skiller: player,
					evtx: evt,
				});
		},
	},
	//龙果子
	tyzhuan: {
		audio: "qingbei",
		enable: "phaseUse",
		filterCard(card, player) {
			return get.name(card, player) == "sha";
		},
		filterTarget(card, player, target) {
			return target != player && target.countCards("ej", card => get.type(card, target) == "equip");
		},
		check(card) {
			return 5 - get.value(card);
		},
		filter(event, player) {
			if (!player.countCards("he", card => lib.skill.tyzhuan.filterCard(card, player))) {
				return false;
			}
			return game.hasPlayer(target => lib.skill.tyzhuan.filterTarget(event, player, target));
		},
		async content(event, trigger, player) {
			const target = event.target;
			if (!target.countCards("ej", card => get.type(card, target) == "equip")) {
				return;
			}
			await player.gainPlayerCard("ej", target, true).set("filterButton", button => {
				return get.type(button.link, get.owner(button.link)) == "equip";
			});
		},
		ai: {
			order(item, player) {
				if (!player.hasCard(card => player.hasValueTarget(card), "h")) {
					return 9;
				}
				return 1;
			},
			result: {
				target: -1,
			},
		},
		subfrequent: ["draw"],
		group: "tyzhuan_draw",
		subSkill: {
			draw: {
				audio: "tyzhuan",
				trigger: { global: "useCardAfter" },
				filter(event, player) {
					return get.type(event.card, null, false) == "equip";
				},
				frequent: true,
				prompt2: "摸一张牌",
				content() {
					player.draw();
				},
			},
		},
	},
	//龙刘备
	tyqingshi: {
		trigger: { player: "phaseZhunbeiBegin" },
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget([1, player.hp], get.prompt2(event.skill), function (card, player, target) {
					return target.countCards("h");
				})
				.set("ai", target => {
					return Math.max(0.1, get.attitude(get.player(), target));
				})
				.forResult();
		},
		async content(event, trigger, player) {
			await player.chooseToDebate(event.targets.sortBySeat()).set("callback", lib.skill.tyqingshi.callback);
		},
		async callback(event, trigger, player) {
			const result = event.debateResult;
			if (result.bool && result.opinion) {
				if (!["red", "black"].includes(result.opinion)) {
					return;
				}
				const targets = result[result.opinion].map(i => i[0]);
				if (result.opinion == "red") {
					for (const target of targets) {
						target.addTempSkill("tyqingshi_distance", "roundStart");
						target.addMark("tyqingshi_distance", 1, false);
					}
				} else {
					await player.draw(targets.length);
					let gains = [],
						give_map = [];
					while (true) {
						const result = await player
							.chooseCardTarget({
								filterCard(card) {
									return get.itemtype(card) == "card" && !card.hasGaintag("mbjiejian_tag");
								},
								filterTarget(card, player, target) {
									return get.event("canGain")(target) && target != player;
								},
								prompt: "倾师：是否分配手牌？",
								prompt2: "请选择要分配的卡牌和目标",
								ai1(card) {
									return 8 - get.value(card);
								},
								ai2(target) {
									let player = _status.event.player,
										card = ui.selected.cards[0],
										att = get.attitude(player, target);
									if (att <= 0) {
										return 0;
									}
									return target.getUseValue(card) + 4;
								},
							})
							.set("canGain", target => {
								return targets.includes(target) && !gains.includes(target);
							})
							.forResult();
						if (result.bool && result.targets?.length) {
							give_map.add([result.targets[0], result.cards]);
							player.addGaintag(result.cards, "mbjiejian_tag");
							gains.addArray(result.targets);
						} else {
							break;
						}
						if (!game.hasPlayer(i => i != player && targets.includes(i) && !gains.includes(i))) {
							break;
						}
					}
					await game
						.loseAsync({
							gain_list: give_map,
							player: player,
							cards: give_map.map(i => i[1]).flat(),
							giver: player,
							animate: "giveAuto",
						})
						.setContent("gaincardMultiple");
				}
			}
		},
		subSkill: {
			distance: {
				charlotte: true,
				mod: {
					globalFrom(from, to, distance) {
						return distance + from.countMark("tyqingshi_distance");
					},
					globalTo(from, to, distance) {
						return distance + to.countMark("tyqingshi_distance");
					},
				},
				onremove: true,
				mark: true,
				intro: {
					content: "你与其他角色的相互距离+$",
				},
			},
		},
	},
	tyyilin: {
		trigger: {
			global: ["gainAfter", "loseAsyncAfter"],
		},
		getIndex(event, player) {
			if (event.name == "loseAsync" && event.type != "gain") {
				return [];
			}
			if (!event.getl || !event.getg) {
				return [];
			}
			let cardsx = event.getl(player).cards2,
				cardsy = event.getg(player);
			return game
				.filterPlayer(current => {
					if (current == player) {
						return false;
					}
					if (player.getHistory("useSkill", evt => evt.skill == "tyyilin" && evt.targets?.includes(current)).length) {
						return false;
					}
					if (cardsx.length) {
						let cards = event.getg(current);
						if (cards?.length && cards.some(card => cardsx.includes(card))) {
							return true;
						}
					}
					if (cardsy.length) {
						let evt = event.getl(current);
						if (evt?.cards2?.length && evt.cards2.some(card => cardsy.includes(card))) {
							return true;
						}
					}
					return false;
				})
				.sortBySeat();
		},
		logTarget(event, player, name, target) {
			return target;
		},
		check(event, player, name, target) {
			return get.attitude(player, target) > 0;
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			let cards1 = trigger.getl(player)?.cards2,
				cards2 = trigger.getg(player);
			let cardsx = trigger.getl(target)?.cards2,
				cardsy = trigger.getg(target);
			if (cards1?.some(card => cardsy.includes(card))) {
				await target
					.chooseToUse({
						filterCard(card) {
							if (get.itemtype(card) != "card" || !get.event("useCard").includes(card)) {
								return false;
							}
							return lib.filter.filterCard.apply(this, arguments);
						},
						prompt: "是否使用获得的一张牌？",
					})
					.set("useCard", cards1);
			}
			if (cardsx?.some(card => cards2.includes(card))) {
				await player
					.chooseToUse({
						filterCard(card) {
							if (get.itemtype(card) != "card" || !get.event("useCard").includes(card)) {
								return false;
							}
							return lib.filter.filterCard.apply(this, arguments);
						},
						prompt: "是否使用获得的一张牌？",
					})
					.set("useCard", cardsx);
			}
		},
	},
	tychengming: {
		skillAnimation: true,
		animationColor: "fire",
		trigger: { player: "dying" },
		zhuSkill: true,
		filter(event, player) {
			if (player.hp > 0) {
				return false;
			}
			if (!player.hasZhuSkill("tychengming")) {
				return false;
			}
			return game.hasPlayer(function (current) {
				return current != player && current.group == "shu";
			});
		},
		limited: true,
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt2(event.skill), function (card, player, target) {
					return target != player && target.group == "shu";
				})
				.set("ai", target => {
					return Math.max(1, get.attitude(get.player(), target));
				})
				.forResult();
		},
		async content(event, trigger, player) {
			player.awakenSkill(event.name);
			let cards = player.getCards("hej"),
				target = event.targets[0];
			if (cards.length) {
				await target.gain(cards, "give");
			}
			await player.recoverTo(1);
			let skills = target.getSkills(null, false, false).filter(skill => {
				var info = get.info(skill);
				if (!info || info.charlotte || !get.is.locked(skill) || get.skillInfoTranslation(skill, target).length == 0) {
					return false;
				}
				return true;
			});
			if (skills.length) {
				await target.addSkills("rerende");
			}
		},
	},
	//蜀孙权-孩子们，其实我早就是蜀国人了
	tyfuhan: {
		trigger: {
			global: ["gainAfter", "loseAsyncAfter"],
		},
		getIndex(event, player) {
			if (event.name == "loseAsync" && event.type != "gain") {
				return [];
			}
			if (!event.getl || !event.getg) {
				return [];
			}
			let cardsx = event.getl(player).cards2,
				cardsy = event.getg(player);
			return game
				.filterPlayer(current => {
					if (current == player) {
						return false;
					}
					if (cardsx.length) {
						let cards = event.getg(current);
						if (cards?.length && cards.some(card => cardsx.includes(card))) {
							return true;
						}
					}
					if (cardsy.length) {
						let evt = event.getl(current);
						if (evt?.cards2?.length && evt.cards2.some(card => cardsy.includes(card))) {
							return true;
						}
					}
					return false;
				})
				.sortBySeat();
		},
		filter(event, player, name, target) {
			if (!target.isIn()) {
				return false;
			}
			return true;
		},
		async cost(event, trigger, player) {
			const target = event.indexedData;
			let dialog = [get.prompt(event.skill, player, target)],
				list1 = [],
				list2 = [],
				bool = false;
			for (let i = 1; i < 6; i++) {
				if (player.hasEnabledSlot(i)) {
					list1.push(i);
				}
				if (player.hasDisabledSlot(i)) {
					list2.push(i);
				}
			}
			if (list2.length && trigger.getl(player)?.cards2?.length && trigger.getg(target).some(card => trigger.getl(player).cards2.includes(card))) {
				dialog.push("恢复其一个装备栏");
				dialog.push([list2.map(i => [[i, true], get.translation(`equip${i}`) + "栏"]), "tdnodes"]);
				bool = true;
			}
			if (list1.length && trigger.getg(player) && trigger.getl(target)?.cards2.some(card => trigger.getg(player).includes(card))) {
				dialog.push("废除其一个装备栏");
				dialog.push([list1.map(i => [[i, false], get.translation(`equip${i}`) + "栏"]), "tdnodes"]);
				bool = true;
			}
			if (bool) {
				const result = await target
					.chooseButton(dialog)
					.set("ai", button => {
						const type = button.link[1];
						if (_status.event.att > 0) {
							if (!_status.event.used || type) {
								return 1 + Math.random();
							}
							return 0;
						}
						return type ? 0 : 1 + Math.random();
					})
					.set("used", player.getHistory("useSkill", evt => evt.skill == "tyfuhan").length > 0)
					.set("att", get.attitude(target, _status.currentPhase))
					.forResult();
				event.result = {
					bool: result.bool,
					targets: [target],
					cost_data: result.links?.[0],
				};
			} else {
				event.result = { bool: false };
			}
		},
		async content(event, trigger, player) {
			const cost = event.cost_data;
			if (cost[1]) {
				await player.enableEquip(cost[0]);
			} else {
				await player.disableEquip(cost[0]);
			}
		},
		group: "tyfuhan_draw",
		subSkill: {
			draw: {
				trigger: {
					global: "phaseEnd",
				},
				filter(event, player) {
					if (!_status.currentPhase || _status.currentPhase.countCards("h") >= _status.currentPhase.maxHp) {
						return false;
					}
					return player.getHistory("useSkill", evt => evt.skill == "tyfuhan").length;
				},
				forced: true,
				locked: true,
				logTarget: () => _status.currentPhase,
				async content(event, trigger, player) {
					await event.targets[0].drawTo(event.targets[0].maxHp);
				},
			},
		},
	},
	tychende: {
		enable: "phaseUse",
		filterCard: true,
		selectCard: [2, Infinity],
		filter(event, player) {
			return player.countCards("h") > 1;
		},
		check(card) {
			const player = get.player();
			if (ui.selected.cards.length >= 2) {
				return 0;
			}
			if (player.getUseValue(card)) {
				return 10 - get.value(card);
			}
			return 6 - get.value(card);
		},
		position: "h",
		lose: false,
		delay: false,
		discard: false,
		filterTarget: lib.filter.notMe,
		async content(event, trigger, player) {
			const target = event.target,
				cards = event.cards;
			await player.showCards(get.translation(player) + "发动了【臣德】", cards);
			await player.give(cards, target, true);
			let list = [];
			for (let card of cards) {
				if (player.hasUseTarget(card, true, true) && ["trick", "basic"].includes(get.type(card))) {
					list.push([get.type(card), "", get.name(card, false), get.nature(card, false)]);
				}
			}
			if (!list.length) {
				return;
			}
			const result = await player
				.chooseButton(["臣德：是否视为使用其中一张？", [list, "vcard"]])
				.set("ai", button => {
					return get.player().getUseValue(button.link[2]);
				})
				.forResult();
			if (result.bool) {
				await player.chooseUseTarget({ name: result.links[0][2], nature: result.links[0][3] }, true);
			}
		},
		ai: {
			order: 6,
			result: {
				target: 1,
			},
		},
	},
	tywansu: {
		trigger: {
			global: ["useCard", "damageBefore"],
		},
		filter(event, player) {
			if (!event.card || !get.is.virtualCard(event.card)) {
				return false;
			}
			if (event.name == "useCard") {
				return game.players.some(target => target.hasDisabledSlot());
			}
			return true;
		},
		forced: true,
		logTarget(event, player) {
			if (event.name == "useCard") {
				return game.players.filter(target => target.hasDisabledSlot());
			}
			return event.player;
		},
		async content(event, trigger, player) {
			if (trigger.name == "useCard") {
				trigger.directHit.addArray(event.targets);
			} else {
				trigger.cancel();
				trigger.player.loseHp(trigger.num);
			}
		},
		ai: {
			jueqing: true,
		},
	},
	//神秘将军-孩子们，其实我没有死
	tywusheng: {
		enable: ["chooseToRespond", "chooseToUse"],
		filterCard(card, player) {
			return get.color(card) == "red";
		},
		position: "hes",
		viewAs: {
			name: "sha",
			storage: {
				tywusheng: true,
			},
		},
		viewAsFilter(player) {
			if (!player.countCards("hes", { color: "red" })) {
				return false;
			}
		},
		precontent() {
			var targets = event.result.targets;
			for (var target of targets) {
				target.addTempSkill("tywusheng_guanjue");
			}
		},
		prompt: "将一张红色牌当杀使用或打出",
		check(card) {
			const val = get.value(card);
			if (_status.event.name == "chooseToRespond") {
				return 1 / Math.max(0.1, val);
			}
			return 5 - val;
		},
		ai: {
			skillTagFilter(player) {
				if (!player.countCards("hes", { color: "red" })) {
					return false;
				}
			},
			respondSha: true,
		},
		subSkill: {
			guanjue: {
				mod: {
					cardEnabled(card, player) {
						let evt = _status.event;
						if (evt.name != "chooseToUse") {
							evt = evt.getParent("chooseToUse");
						}
						if (!evt || !evt.respondTo) {
							return;
						}
						const cardx = evt.respondTo[1];
						if (!cardx.storage?.tywusheng) {
							return;
						}
						const suit = get.suit(card);
						if (suit != "unsure" && suit != get.suit(cardx)) {
							return false;
						}
					},
				},
				charlotte: true,
			},
		},
	},
	tychengshi: {
		trigger: {
			source: "damageSource",
		},
		forced: true,
		usable: 1,
		filter(event, player) {
			if (!_status.currentPhase) {
				return false;
			}
			if (_status.currentPhase != player && !event.player.isIn()) {
				return false;
			}
			return event.card?.name == "sha" && get.color(event.card) == "red";
		},
		async content(event, trigger, player) {
			if (player == _status.currentPhase) {
				let evt = trigger.getParent("useCard", true);
				if (evt?.addCount !== false) {
					evt.addCount = false;
					evt.player.getStat().card.sha--;
				}
			} else if (trigger.player.isIn()) {
				trigger.player.addTempSkill("tychengshi_tiaoxin", { global: lib.phaseName.map(i => `${i}End`) });
				trigger.player.markAuto("tychengshi_tiaoxin", [player]);
			}
		},
		subSkill: {
			tiaoxin: {
				mark: true,
				intro: {
					content(storage, player) {
						if (!storage || !storage.length) {
							return "无记录";
						}
						if (storage.length > 1) {
							return "不能使用伤害类牌指定任何人";
						}
						return `不能使用伤害类牌指定${get.translation(storage)}以外的角色`;
					},
				},
				charlotte: true,
				onremove: true,
				mod: {
					playerEnabled(card, player, target) {
						if (!get.tag(card, "damage")) {
							return;
						}
						let storage = player.getStorage("tychengshi_tiaoxin");
						if (!storage.length) {
							return;
						}
						if (storage.length > 1 || !player.getStorage("tychengshi_tiaoxin").includes(target)) {
							return false;
						}
					},
				},
			},
		},
	},
	tyfuwei: {
		trigger: {
			global: "damageEnd",
		},
		filter(event, player) {
			if (!player.countCards("he") || !event.player.isIn() || event.player == player) {
				return false;
			}
			if (event.player.getSeatNum() == 1) {
				return true;
			}
			if (get.nameList(event.player).some(name => get.rawName(name) == "刘备")) {
				return true;
			}
		},
		usable: 1,
		seatRelated: true,
		async cost(event, trigger, player) {
			event.result = await player
				.chooseCardTarget({
					prompt: get.prompt(event.skill, trigger.player),
					prompt2: `交给其至多${trigger.num}张牌，然后可以对伤害来源使用至多${trigger.num}张杀`,
					filterCard: true,
					selectCard: [1, trigger.num],
					position: "he",
					filterTarget(card, player, target) {
						return target == _status.event.getTrigger().player;
					},
					ai1(card) {
						return 4 - get.value(card);
					},
					ai2(target) {
						let att = get.attitude(_status.event.player, target);
						return Math.max(0, att);
					},
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const target = event.targets[0],
				cards = event.cards;
			await player.give(cards, target);
			if (!trigger.source || !trigger.source.isIn() || !player.canUse(get.autoViewAs({ name: "sha" }, "unsure"), trigger.source, false)) {
				return;
			}
			let num = 0;
			while (num < trigger.num) {
				const { result } = await player
					.chooseToUse(function (card, player, event) {
						if (get.name(card) != "sha") {
							return false;
						}
						return lib.filter.filterCard.apply(this, arguments);
					}, `抚危：是否对${get.translation(trigger.source)}使用一张杀？（${num}/${trigger.num}）`)
					.set("targetRequired", true)
					.set("complexSelect", true)
					.set("complexTarget", true)
					.set("filterTarget", function (card, player, target) {
						if (target != _status.event.sourcex && !ui.selected.targets.includes(_status.event.sourcex)) {
							return false;
						}
						return lib.filter.targetEnabled.apply(this, arguments);
					})
					.set("sourcex", trigger.source);
				if (result.bool == false) {
					break;
				} else {
					num++;
				}
			}
		},
	},
	//九鼎-徐晃
	jdsbduanliang: {
		audio: "sbduanliang",
		inherit: "sbduanliang",
		async content(event, trigger, player) {
			const target = event.targets[0];
			const result = await player
				.chooseToDuiben(target)
				.set("title", "谋弈")
				.set("namelist", ["固守城池", "突出重围", "围城断粮", "擂鼓进军"])
				.set("translationList", [`以防止${get.translation(player)}通过此技能对你使用【决斗】`, `以防止${get.translation(player)}通过此技能对你使用【兵粮寸断】`, `若成功，你摸一张牌，然后可以将一张黑色非锦囊牌当做【兵粮寸断】对${get.translation(target)}使用`, `若成功，视为对${get.translation(target)}使用【决斗】`])
				.set("ai", button => {
					var source = _status.event.getParent().player,
						target = _status.event.getParent().target;
					if (get.effect(target, { name: "juedou" }, source, source) >= 10 && button.link[2] == "db_def2" && Math.random() < 0.5) {
						return 10;
					}
					return 1 + Math.random();
				})
				.forResult();
			if (result.bool) {
				if (result.player == "db_def1") {
					await player.draw();
					if (target.hasJudge("bingliang") && target.countGainableCards(player, "he")) {
						await player.gainPlayerCard(target, "he", true);
					} else {
						const next = player.chooseToUse();
						next.set("openskilldialog", "断粮：是否将一张黑色非锦囊牌当作【兵粮寸断】对" + get.translation(target) + "使用？");
						next.set("norestore", true);
						next.set("_backupevent", "jdsbduanliang_backup");
						next.set("custom", {
							add: {},
							replace: { window() {} },
						});
						next.backup("jdsbduanliang_backup");
						next.set("targetRequired", true);
						next.set("complexSelect", true);
						next.set("filterTarget", function (card, player, target) {
							if (target != _status.event.sourcex) {
								return false;
							}
							return lib.filter.targetEnabled.apply(this, arguments);
						});
						next.set("sourcex", target);
						await next;
					}
				} else {
					const card = { name: "juedou", isCard: true };
					if (player.canUse(card, target)) {
						await player.useCard(card, target);
					}
				}
			}
		},
		subSkill: {
			backup: {
				viewAs: {
					name: "bingliang",
				},
				filterCard(card, player) {
					return get.itemtype(card) == "card" && get.color(card, player) == "black" && get.type2(card) != "trick";
				},
				position: "hes",
				selectCard: 1,
				check(card) {
					return 6 - get.value(card);
				},
			},
		},
	},
	//九鼎--王元姬
	jdshiren: {
		audio: "shiren",
		trigger: { player: "showCharacterAfter" },
		filter(event, player) {
			if (!event.toShow?.some(i => get.character(i).skills?.includes("jdshiren"))) {
				return false;
			}
			const target = _status.currentPhase;
			return target && target != player && target.isAlive() && target.countCards("h") > 0;
		},
		logTarget: () => _status.currentPhase,
		hiddenSkill: true,
		content() {
			const next = game.createEvent("jdyanxi", false);
			next.player = player;
			next.target = _status.currentPhase;
			next.setContent(lib.skill["jdyanxi"].content);
		},
	},
	jdyanxi: {
		audio: "yanxi",
		inherit: "yanxi",
		async content(event, trigger, player) {
			const target = event.target;
			const [card] = await player.choosePlayerCard(target, "h", true).forResult("cards");
			if (card) {
				const videoId = lib.status.videoId++;
				game.addVideo("showCards", player, [`${get.translation(player)}对${get.translation(target)}发动了【宴戏】`, get.cardsInfo([card])]);
				game.broadcastAll(
					(card, id, player, target) => {
						let dialog;
						if (player === game.me) {
							dialog = ui.create.dialog(`${get.translation(target)}手牌展示中...`);
						} else {
							dialog = ui.create.dialog(`${get.translation(player)}对${get.translation(target)}发动了【宴戏】`, [card]);
						}
						dialog.forcebutton = true;
						dialog.videoId = id;
					},
					card,
					videoId,
					player,
					target
				);
				await game.delay(2);
				game.broadcastAll("closeDialog", videoId);
				let cards = [card].concat(get.cards(2)).randomSort();
				game.log(player, "展示了", cards);
				const videoIdx = lib.status.videoId++;
				const str = get.translation(player) + "对" + get.translation(target) + "发动了【宴戏】";
				game.broadcastAll(
					(str, id, cards) => {
						const dialog = ui.create.dialog(str, cards);
						dialog.videoId = id;
					},
					str,
					videoIdx,
					cards
				);
				game.addVideo("showCards", player, [str, get.cardsInfo(cards)]);
				const func = function (id, target) {
					const dialog = get.idDialog(id);
					if (dialog) {
						dialog.content.firstChild.innerHTML = "猜猜哪张是" + get.translation(target) + "的手牌？";
					}
				};
				if (player == game.me) {
					func(videoIdx, target);
				} else if (player.isOnline()) {
					player.send(func, videoIdx, target);
				}
				const next = player.chooseButton(true);
				next.set("dialog", videoIdx);
				next.set("ai", button => {
					const evt = get.event();
					if (evt.answer) {
						return button.link == evt.answer ? 1 : 0;
					}
					return get.value(button.link, evt.player);
				});
				if (player.hasSkillTag("viewHandcard", null, target, true)) {
					next.set("answer", card);
				}
				const result = await next.forResult();
				game.broadcastAll("closeDialog", videoIdx);
				if (result.bool) {
					const card2 = result.links[0];
					cards.remove(card2);
					if (card2 == card) {
						player.popup("洗具");
						player.$gain2(cards);
						await player.gain(cards, "log");
						await player.gain(card, target, "bySelf", "give");
					} else {
						player.popup("杯具");
						await player.gain(card2, "gain2");
						const { result } = await player
							.chooseToMove("宴戏：将剩余的牌以任意顺序置于牌堆顶", true)
							.set("list", [["牌堆顶", cards]])
							.set("reverse", _status.currentPhase?.next && get.attitude(player, _status.currentPhase.next) > 0)
							.set("processAI", list => {
								const cards = list[0][1].slice(0);
								cards.sort((a, b) => {
									return (_status.event.reverse ? 1 : -1) * (get.value(b) - get.value(a));
								});
								return [cards];
							});
						if (!result.bool) {
							return;
						}
						cards = result.moved[0];
						cards.reverse();
						if (cards.includes(card)) {
							target.$throw(1, 1000);
							await target.lose([card], ui.special);
						}
						await game.cardsGotoPile(cards, "insert");
						game.log(player, "将", cards, "置于了牌堆顶");
					}
				}
			}
		},
	},
	//九鼎-华歆
	jdcaozhao: {
		audio: "caozhao",
		trigger: { global: "phaseUseBegin" },
		filter(event, player) {
			if (
				lib.inpile.every(i => {
					return player.getStorage("jdcaozhao").includes(i);
				})
			) {
				return false;
			}
			return event.player.countCards("h") && event.player.getHp() <= player.getHp();
		},
		async cost(event, trigger, player) {
			const target = trigger.player;
			event.result = await player
				.choosePlayerCard(target, "h", get.prompt2(event.skill, target))
				.set("ai", () => {
					const player = get.player(),
						target = get.event().getTrigger().player;
					if (lib.inpile.some(i => !player.getStorage("jdcaozhao").includes(i) && target.getUseValue(i) * get.attitude(player, target) > 0)) {
						return 1 + Math.random();
					}
					return 0;
				})
				.forResult();
		},
		logTarget: "player",
		round: 1,
		async content(event, trigger, player) {
			const target = trigger.player;
			await player.showCards(event.cards, get.translation(player) + "对" + get.translation(target) + "发动了【草诏】");
			const result = await player
				.chooseButton(
					[
						"草诏：请选择一个基本牌或锦囊牌",
						[
							lib.inpile.filter(i => {
								if (!["basic", "trick"].includes(get.type(i))) {
									return false;
								}
								return !player.getStorage("jdcaozhao").includes(i);
							}),
							"vcard",
						],
					],
					true
				)
				.set("ai", button => {
					const player = get.player(),
						target = get.event().getTrigger().player,
						sgn = get.sgn(get.attitude(player, target));
					const cards = get.event().getParent().cards,
						card = get.autoViewAs({ name: button.link[2] }, cards);
					if (!target.hasUseTarget(card) || target.getUseValue(card) * sgn <= 0) {
						Math.random();
					}
					return 5 + target.getUseValue(card) * sgn;
				})
				.forResult();
			if (result.bool) {
				const name = result.links[0][2];
				player.markAuto("jdcaozhao", [name]);
				player.popup(name, "thunder");
				game.log(player, "声明了", "#y" + get.translation(name));
				const card = get.autoViewAs({ name: name }, event.cards);
				let resultx;
				if (!target.hasUseTarget(card)) {
					resultx = { bool: false };
				} else {
					resultx = await target
						.chooseUseTarget('###草诏###<div class="text center">使用' + get.translation(card) + "（" + get.translation(event.cards) + "），或失去1点体力</div>", card, false)
						.set("cards", event.cards)
						.forResult();
				}
				if (!resultx.bool) {
					await target.loseHp();
				}
			}
		},
	},
	//九鼎-杨婉
	jdmingxuan: {
		audio: "spmingxuan",
		trigger: { player: "phaseUseBegin" },
		filter(event, player) {
			const num = Math.min(
				player
					.getCards("h")
					.slice()
					.map(i => get.suit(i, player))
					.unique().length,
				game.countPlayer(current => {
					return current != player && !player.getStorage("jdmingxuan").includes(current);
				})
			);
			return num > 0;
		},
		forced: true,
		async content(event, trigger, player) {
			const num = Math.min(
				player
					.getCards("h")
					.slice()
					.map(i => get.suit(i, player))
					.unique().length,
				game.countPlayer(current => {
					return current != player && !player.getStorage("jdmingxuan").includes(current);
				})
			);
			const result = await player
				.chooseCard("h", true, [1, num], "瞑昡：请选择至多" + get.cnNumber(num) + "张花色各不相同的手牌", (card, player) => {
					if (!ui.selected.cards.length) {
						return true;
					}
					return !ui.selected.cards.some(i => get.suit(i, player) == get.suit(card));
				})
				.set("complexCard", true)
				.set("ai", card => 6 - get.value(card))
				.forResult();
			if (result.bool && result.cards?.length > 0) {
				let cards = result.cards.slice().randomSort();
				let targets = game.filterPlayer(current => current != player && !player.getStorage("jdmingxuan").includes(current)).sortBySeat(player);
				const dialog = ui.create.dialog("瞑昡", cards, true);
				_status.dieClose.push(dialog);
				dialog.videoId = lib.status.videoId++;
				event.dialogID = dialog.videoId;
				game.addVideo("cardDialog", null, ["瞑昡", get.cardsInfo(cards), dialog.videoId]);
				game.broadcast(
					function (cards, id) {
						var dialog = ui.create.dialog("瞑昡", cards, true);
						_status.dieClose.push(dialog);
						dialog.videoId = id;
					},
					cards,
					dialog.videoId
				);
				while (cards.length && targets.length) {
					await game.delayx();
					const target = targets.shift();
					const resultx = await target
						.chooseButton(true, button => {
							return get.value(button.link, _status.event.player);
						})
						.set("dialog", event.dialogID)
						.set("closeDialog", false)
						.set("dialogdisplay", true)
						.set("cardFilter", cards.slice())
						.set("filterButton", button => {
							return _status.event.cardFilter.includes(button.link);
						})
						.forResult();
					if (resultx.bool) {
						const card = resultx.links[0];
						if (card) {
							cards.remove(card);
							const capt = get.translation(target) + "选择了" + get.translation(card);
							game.broadcastAll(
								(card, id, name, capt) => {
									const dialog = get.idDialog(id);
									if (dialog) {
										dialog.content.firstChild.innerHTML = capt;
										for (let i = 0; i < dialog.buttons.length; i++) {
											if (dialog.buttons[i].link == card) {
												dialog.buttons[i].querySelector(".info").innerHTML = name;
												break;
											}
										}
										game.addVideo("dialogCapt", null, [dialog.videoId, dialog.content.firstChild.innerHTML]);
									}
								},
								card,
								event.dialogID,
								(target => {
									if (target._tempTranslate) {
										return target._tempTranslate;
									}
									const name = target.name;
									if (lib.translate[name + "_ab"]) {
										return lib.translate[name + "_ab"];
									}
									return get.translation(name);
								})(target),
								capt
							);
							await target.gain(card, player, "give");
						}
						const resulty = await target
							.chooseToUse(function (card, player, event) {
								if (get.name(card) != "sha") {
									return false;
								}
								return lib.filter.filterCard.apply(this, arguments);
							}, "对" + get.translation(player) + "使用一张杀，否则交给其一张牌且其摸一张牌")
							.set("targetRequired", true)
							.set("complexSelect", true)
							.set("complexTarget", true)
							.set("filterTarget", function (card, player, target) {
								if (target != _status.event.sourcex && !ui.selected.targets.includes(_status.event.sourcex)) {
									return false;
								}
								return lib.filter.filterTarget.apply(this, arguments);
							})
							.set("sourcex", player)
							.set("addCount", false)
							.forResult();
						if (resulty.bool) {
							player.markAuto("jdmingxuan", [target]);
						} else {
							await target.chooseToGive("he", true, player, "交给" + get.translation(player) + "一张牌");
							await player.draw();
						}
					}
				}
				for (let i = 0; i < ui.dialogs.length; i++) {
					if (ui.dialogs[i].videoId == event.dialogID) {
						const dialogx = ui.dialogs[i];
						dialogx.close();
						_status.dieClose.remove(dialogx);
						break;
					}
				}
				game.broadcast(id => {
					const dialog = get.idDialog(id);
					if (dialog) {
						dialog.close();
						_status.dieClose.remove(dialog);
					}
				}, event.dialogID);
				game.addVideo("cardDialog", null, event.dialogID);
			}
		},
		intro: { content: "已被$使用过杀" },
	},
	//九鼎-黄月英
	jdjizhi: {
		audio: "sbjizhi",
		trigger: { player: "useCard" },
		filter(event, player) {
			return get.type(event.card) == "trick";
		},
		forced: true,
		content() {
			"step 0";
			player.draw();
			"step 1";
			player.addTempSkill("jdjizhi_mark");
			player.addMark("jdjizhi_mark", 1, false);
		},
		subSkill: {
			mark: {
				charlotte: true,
				onremove: true,
				intro: { content: "本回合手牌上限+#" },
				// charlotte: true,
				// onremove: true,
				mod: {
					maxHandcard(player, num) {
						return num + player.countMark("jdjizhi_mark");
					},
				},
			},
		},
	},
	jdqicai: {
		audio: "sbqicai",
		enable: "phaseUse",
		filter(event, player) {
			return player.countCards("he", { type: "equip" });
		},
		filterCard(card) {
			return !ui.selected.cards.length && get.type(card) == "equip";
		},
		selectCard: [1, 2],
		filterTarget: lib.filter.notMe,
		position: "he",
		check(card) {
			return 8 - get.value(card);
		},
		complexCard: true,
		complexSelect: true,
		lose: false,
		discard: false,
		delay: false,
		usable: 1,
		get prompt() {
			return lib.translate.jdqicai_info.slice("①你使用锦囊牌无距离限制。②".length);
		},
		async content(event, trigger, player) {
			const target = event.target;
			const str = get.translation(player);
			await player.showCards(event.cards, get.translation(player) + "发动了【奇才】");
			await player.give(event.cards, target);
			const result = await target
				.chooseCard(
					2,
					"he",
					card => {
						return get.type(card) !== "equip";
					},
					"奇才：交给" + str + "两张非装备牌，或令" + str + "获得两张普通锦囊牌"
				)
				.set("ai", card => {
					if (get.event("att") >= 0) {
						return -1;
					}
					return 7 - get.value(card);
				})
				.set("att", get.attitude(target, player))
				.forResult();
			if (!result.bool) {
				let gains = [];
				while (gains.length < 2) {
					const card = get.cardPile(i => get.type(i) == "trick" && !gains.includes(i), false, "random");
					if (card) {
						gains.push(card);
					} else {
						break;
					}
				}
				if (gains.length) {
					await player.gain(gains, "gain2");
				} else {
					player.chat("无牌可得？！");
					game.log("但是牌堆和弃牌堆都没有普通锦囊牌了！");
				}
			} else {
				await target.showCards(result.cards);
				await target.give(result.cards, player);
			}
		},
		ai: {
			order: 7,
			result: {
				target(player, target) {
					const att = get.attitude(player, target);
					return get.sgn(att) * (2 + get.sgn(att));
				},
			},
		},
		mod: {
			targetInRange(card) {
				if (get.type2(card) == "trick") {
					return true;
				}
			},
		},
		locked: false,
	},
	//九鼎-赵云
	jdlongdan: {
		audio: "sblongdan",
		enable: ["chooseToUse", "chooseToRespond"],
		filter(event, player) {
			if (event.type == "wuxie") {
				return false;
			}
			var marked = player.hasSkill("sblongdan_mark", null, null, false);
			for (var name of lib.inpile) {
				if (!marked && name != "sha" && name != "shan") {
					continue;
				}
				if (get.type(name) != "basic") {
					continue;
				}
				if (player.hasCard(lib.skill.jdlongdan.getFilter(name, player), "hs")) {
					if (event.filterCard(get.autoViewAs({ name }, "unsure"), player, event)) {
						return true;
					}
					if (marked && name == "sha") {
						for (var nature of lib.inpile_nature) {
							if (event.filterCard(get.autoViewAs({ name, nature }, "unsure"), player, event)) {
								return true;
							}
						}
					}
				}
			}
			return false;
		},
		chooseButton: {
			dialog(event, player) {
				var list = [];
				var marked = player.hasSkill("sblongdan_mark", null, null, false);
				for (var name of lib.inpile) {
					if (!marked && name != "sha" && name != "shan") {
						continue;
					}
					if (get.type(name) != "basic") {
						continue;
					}
					if (player.hasCard(lib.skill.jdlongdan.getFilter(name, player), "hs")) {
						if (event.filterCard(get.autoViewAs({ name }, "unsure"), player, event)) {
							list.push(["基本", "", name]);
						}
						if (marked && name == "sha") {
							for (var nature of lib.inpile_nature) {
								if (event.filterCard(get.autoViewAs({ name, nature }, "unsure"), player, event)) {
									list.push(["基本", "", name, nature]);
								}
							}
						}
					}
				}
				return ui.create.dialog("龙胆", [list, "vcard"], "hidden");
			},
			check(button) {
				if (_status.event.getParent().type != "phase") {
					return 1;
				}
				var player = _status.event.player,
					card = { name: button.link[2], nature: button.link[3] };
				if (card.name == "jiu" && player.countCards("h", { type: "basic" }) < 2) {
					return 0;
				}
				return player.getUseValue(card, null, true);
			},
			backup(links, player) {
				return {
					audio: "jdlongdan",
					viewAs: {
						name: links[0][2],
						nature: links[0][3],
					},
					filterCard: lib.skill.jdlongdan.getFilter(links[0][2], player),
					position: "he",
					popname: true,
					check(card) {
						return 6 / Math.max(1, get.value(card));
					},
					precontent() {
						player.addTempSkill("jdlongdan_draw");
					},
				};
			},
			prompt(links, player) {
				var marked = player.hasSkill("sblongdan_mark", null, null, false);
				var card = {
					name: links[0][2],
					nature: links[0][3],
					isCard: true,
				};
				if (marked) {
					return "将一张基本牌当作【" + get.translation(card) + "】使用";
				}
				return "将一张【" + (card.name == "sha" ? "闪" : "杀") + "】当作【" + get.translation(card) + "】使用";
			},
		},
		hiddenCard(player, name) {
			if (get.type(name) != "basic") {
				return false;
			}
			var marked = player.hasSkill("sblongdan_mark", null, null, false);
			if (!marked && name != "sha" && name != "shan") {
				return false;
			}
			return player.hasCard(lib.skill.jdlongdan.getFilter(name, player), "hs");
		},
		ai: {
			respondSha: true,
			respondShan: true,
			skillTagFilter(player, tag) {
				return lib.skill.jdlongdan.hiddenCard(player, tag == "respondSha" ? "sha" : "shan");
			},
			order: 9,
			result: {
				player(player) {
					if (_status.event.dying) {
						return get.attitude(player, _status.event.dying);
					}
					return 1;
				},
			},
		},
		getFilter(name, player) {
			if (!player.hasSkill("sblongdan_mark", null, null, false)) {
				if (name == "sha") {
					return { name: "shan" };
				}
				if (name == "shan") {
					return { name: "sha" };
				}
				return () => false;
			}
			return { type: "basic" };
		},
		derivation: "jdlongdanx",
		onremove(player) {
			player.removeSkill("sblongdan_mark");
		},
		subSkill: {
			backup: { audio: "sblongdan" },
			mark: { charlotte: true },
			draw: {
				charlotte: true,
				trigger: { player: ["useCardAfter", "respondAfter"] },
				filter(event, player) {
					if (player.hasSkill("jdlongdan_mark")) {
						return false;
					}
					return event.skill == "jdlongdan_backup";
				},
				forced: true,
				popup: false,
				*content(event, map) {
					const player = map.player;
					const result = yield player.draw(2);
					if (Array.isArray(result) && result.length) {
						player.addTempSkill("jdlongdan_mark", ["phaseChange", "phaseAfter"]);
					}
				},
			},
		},
	},
	jdjizhu: {
		inherit: "sbjizhu",
		audio: ["sbjizhu", 3],
		ai: {
			combo: "jdlongdan",
		},
	},
	//九鼎-甘宁
	jdqixi: {
		audio: "sbqixi",
		inherit: "sbqixi",
		filterCard(card) {
			return lib.suit.includes(get.suit(card));
		},
		check(card) {
			return 7 - get.value(card);
		},
		position: "h",
		lose: false,
		discard: false,
		async content(event, trigger, player) {
			const target = event.target;
			let suits = lib.suit.slice().reverse(),
				num = 0;
			while (suits.length > 0) {
				const control = await target
					.chooseControl(suits)
					.set("prompt", "奇袭：猜测" + get.translation(player) + "选择的牌的花色")
					.set("ai", () => {
						var player = _status.event.getParent().player,
							controls = _status.event.controls;
						if (player.countCards("h") <= 3 && controls.includes("diamond") && Math.random() < 0.3) {
							return "diamond";
						}
						return controls.randomGet();
					})
					.forResult("control");
				if (control) {
					target.chat("我猜是" + get.translation(control) + "！");
					game.log(target, "猜测为", "#y" + control);
					if (!event.isMine() && !event.isOnline()) {
						await game.delayx();
					}
					if (get.suit(event.cards[0]) !== control) {
						player.chat("猜错了！");
						game.log(target, "猜测", "#y错误");
						suits.remove(control);
						num++;
						continue;
					} else {
						player.chat(num == 0 ? "这么准？" : "猜对了！");
						game.log(target, "猜测", "#g正确");
						const card = event.cards[0];
						if (get.owner(card) == player && get.position(card) == "h") {
							await player.showCards([card], get.translation(player) + "选择的手牌");
							if (lib.filter.cardDiscardable(card, player)) {
								await player.discard([card]);
							}
						}
						if (num > 0 && target.countDiscardableCards(player, "hej")) {
							player.line(target);
							player.discardPlayerCard(target, num, true, "hej");
						}
						break;
					}
				} else {
					break;
				}
			}
		},
	},
	jdfenwei: {
		limited: true,
		audio: "sbfenwei",
		trigger: { global: "useCardToPlayered" },
		filter(event, player) {
			if (!event.isFirstTarget || get.type(event.card) != "trick") {
				return false;
			}
			return event.targets.length >= 2;
		},
		direct: true,
		skillAnimation: true,
		animationColor: "wood",
		content() {
			"step 0";
			player
				.chooseTarget(get.prompt("jdfenwei"), "令" + get.translation(trigger.card) + "对任意名角色无效", [1, trigger.targets.length], (card, player, target) => {
					return _status.event.targets.includes(target);
				})
				.set("ai", target => {
					var trigger = _status.event.getTrigger();
					return -get.effect(target, trigger.card, trigger.player, _status.event.player);
				})
				.set("targets", trigger.targets);
			"step 1";
			if (result.bool) {
				player.logSkill("jdfenwei", result.targets);
				player.awakenSkill(event.name);
				trigger.getParent().excluded.addArray(result.targets);
				if (result.targets.includes(player)) {
					player.addTempSkill("jdfenwei_qixi");
				}
			}
		},
		ai: { expose: 0.2 },
		subSkill: {
			qixi: {
				charlotte: true,
				trigger: { global: "phaseEnd" },
				async cost(event, trigger, player) {
					const result = await player
						.chooseCardTarget({
							prompt: get.prompt2("jdqixi"),
							prompt2: lib.translate.jdqixi_info.slice("出牌阶段限一次，你可以".length),
							filterCard: lib.skill.jdqixi.filterCard,
							filterTarget: lib.skill.jdqixi.filterTarget,
							position: lib.skill.jdqixi.position,
							ai1: lib.skill.jdqixi.check,
							ai2: target => {
								const player = get.player();
								return get.effect(target, "twyuanhu", player, player);
							},
						})
						.forResult();
					event.result = result;
					if (result.bool) {
						event.result.cost_data = result;
					}
				},
				popup: false,
				async content(event, trigger, player) {
					const result = event.cost_data;
					result.skill = "jdqixi";
					player.useResult(result, event);
				},
			},
		},
	},
	//九鼎-庞统
	jdlianhuan: {
		audio: "sblianhuan",
		trigger: { player: "useCardToPlayered" },
		filter(event, player) {
			return event.card.name == "tiesuo" && !event.target.isLinked() && event.target.countCards("he");
		},
		direct: true,
		content() {
			const target = trigger.target;
			player.discardPlayerCard(target, "he", get.prompt("jdlianhuan", target)).logSkill = ["jdlianhuan", target];
		},
		group: "jdlianhuan_lianhuan",
		subSkill: {
			lianhuan: {
				audio: "sblianhuan",
				inherit: "lianhuan",
				prompt: "将♣手牌当作【铁索连环】使用或重铸",
			},
		},
	},
	//九鼎-韩龙
	jdcibei: {
		audio: "cibei",
		inherit: "cibei",
		group: ["jdcibei_gain", "jdcibei_fullyReady"],
		subSkill: {
			fullyReady: {
				audio: "cibei",
				trigger: { global: "phaseEnd" },
				filter(event, player) {
					var storage = player.getExpansions("duwang");
					return storage.length > 0 && storage.every(i => i.name == "sha");
				},
				forced: true,
				locked: false,
				*content(event, map) {
					const player = map.player;
					yield player.gain(player.getExpansions("duwang"), "gain2");
					player.addSkill("jdcibei_effect");
				},
			},
			effect: {
				mod: {
					cardUsable(card) {
						if (card.name == "sha") {
							return Infinity;
						}
					},
					targetInRange(card) {
						if (card.name == "sha") {
							return true;
						}
					},
				},
				charlotte: true,
				mark: true,
				marktext: "杀",
				intro: { content: "准备完毕！本局游戏使用【杀】无距离和次数限制" },
			},
			gain: {
				audio: "cibei",
				trigger: { global: "phaseEnd" },
				filter(event, player) {
					return player.hasHistory("lose", evt => evt.type == "discard" && evt.cards.filterInD("d").some(i => i.name == "sha"));
				},
				forced: true,
				locked: false,
				content() {
					player.gain(
						player
							.getHistory("lose", evt => {
								return evt.type == "discard" && evt.cards.filterInD("d").filter(i => i.name == "sha");
							})
							.slice()
							.map(evt => {
								return evt.cards.filterInD("d").filter(i => i.name == "sha");
							})
							.flat(),
						"gain2"
					);
				},
			},
		},
	},
	//九鼎-夏侯徽
	jdbaoqie: {
		audio: "baoqie",
		trigger: { player: "showCharacterAfter" },
		forced: true,
		hiddenSkill: true,
		filter(event, player) {
			return event.toShow?.some(i => get.character(i).skills?.includes("jdbaoqie"));
		},
		content() {
			"step 0";
			var card = get.cardPile(function (card) {
				return get.subtype(card, false) == "equip2" && !get.cardtag(card, "gifts");
			});
			if (!card) {
				event.finish();
				return;
			}
			event.card = card;
			player.gain(card, "gain2");
			"step 1";
			if (player.getCards("h").includes(card) && get.subtype(card) == "equip2") {
				player.chooseUseTarget(card).nopopup = true;
			}
		},
	},
	//九鼎-曹操
	jdjianxiong: {
		audio: "sbjianxiong",
		inherit: "sbjianxiong",
		filter(event, player) {
			return (get.itemtype(event.cards) == "cards" && event.cards.some(i => get.position(i, true) == "o")) || 2 - player.countMark("sbjianxiong") > 0;
		},
		prompt2(event, player) {
			var gain = get.itemtype(event.cards) == "cards" && event.cards.some(i => get.position(i, true) == "o"),
				draw = 2 - player.countMark("sbjianxiong");
			var str = "";
			if (gain) {
				str += "获得" + get.translation(event.cards);
			}
			if (gain && draw > 0) {
				str += "并";
			}
			if (draw > 0) {
				str += "摸" + get.cnNumber(draw) + "张牌";
			}
			if (player.countMark("sbjianxiong")) {
				str += "，然后可以弃1枚“治世”";
			}
			return str;
		},
		content() {
			"step 0";
			if (get.itemtype(trigger.cards) == "cards" && trigger.cards.some(i => get.position(i, true) == "o")) {
				player.gain(trigger.cards, "gain2");
			}
			var num = player.countMark("sbjianxiong");
			if (2 - num > 0) {
				player.draw(2 - num, "nodelay");
			}
			if (!num) {
				event.finish();
			}
			"step 1";
			player.chooseBool("是否弃1枚“治世”？").set("ai", () => {
				var player = _status.event.player,
					current = _status.currentPhase;
				if (get.distance(current, player, "absolute") > 3 && player.hp <= 2) {
					return true;
				}
				return false;
			});
			"step 2";
			if (result.bool) {
				player.removeMark("sbjianxiong", 1);
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
								return [1, 4.5];
							}
						}
						if (get.value(cards, target) >= 7 + target.getDamagedHp()) {
							return [1, 2];
						}
						return [1, 0.55 + 0.05 * Math.max(0, 2 - target.countMark("sbjianxiong"))];
					}
				},
			},
		},
		group: "jdjianxiong_mark",
	},
	//九鼎-诸葛亮
	jdhuoji: {
		audio: "sbhuoji",
		dutySkill: true,
		derivation: ["jdguanxing", "sbkongcheng"],
		group: ["jdhuoji_fire", "jdhuoji_achieve", "jdhuoji_fail", "jdhuoji_mark"],
		subSkill: {
			fire: {
				audio: "sbhuoji1.mp3",
				enable: "phaseUse",
				filterTarget: lib.filter.notMe,
				prompt: "选择一名其他角色，对其与其势力相同的所有其他角色各造成1点火属性伤害",
				usable: 1,
				line: "fire",
				content() {
					"step 0";
					target.damage("fire");
					"step 1";
					var targets = game.filterPlayer(current => {
						if (current == player || current == target) {
							return false;
						}
						return current.group == target.group;
					});
					if (targets.length) {
						game.delayx();
						player.line(targets, "fire");
						targets.forEach(i => i.damage("fire"));
					}
				},
				ai: {
					order: 7,
					fireAttack: true,
					result: {
						target(player, target) {
							var att = get.attitude(player, target);
							return (
								get.sgn(att) *
								game
									.filterPlayer(current => {
										if (current == player) {
											return false;
										}
										return current.group == target.group;
									})
									.reduce((num, current) => num + get.damageEffect(current, player, player, "fire"), 0)
							);
						},
					},
				},
			},
			achieve: {
				audio: "jdhuoji2.mp3",
				trigger: { player: "phaseZhunbeiBegin" },
				filter(event, player) {
					return player.getAllHistory("sourceDamage", evt => evt.hasNature("fire") && evt.player != player).reduce((num, evt) => num + evt.num, 0) >= game.players.length + game.dead.length;
				},
				forced: true,
				locked: false,
				skillAnimation: true,
				animationColor: "fire",
				async content(event, trigger, player) {
					player.awakenSkill("jdhuoji");
					game.log(player, "成功完成使命");
					player.changeSkin("jdhuoji", "sb_zhugeliang");
					player.changeSkills(["jdguanxing", "sbkongcheng"], ["jdhuoji", "jdkanpo"]);
				},
			},
			fail: {
				audio: "jdhuoji3.mp3",
				trigger: { player: "dying" },
				forced: true,
				locked: false,
				content() {
					player.awakenSkill("jdhuoji");
					game.log(player, "使命失败");
				},
			},
			mark: {
				charlotte: true,
				trigger: { source: "damage" },
				filter(event, player) {
					return event.hasNature("fire");
				},
				firstDo: true,
				forced: true,
				popup: false,
				content() {
					player.addTempSkill("jdhuoji_count", {
						player: ["jdhuoji_achieveBegin", "jdhuoji_failBegin"],
					});
					player.storage.jdhuoji_count = player.getAllHistory("sourceDamage", evt => evt.hasNature("fire") && evt.player != player).reduce((num, evt) => num + evt.num, 0);
					player.markSkill("jdhuoji_count");
				},
			},
			count: {
				charlotte: true,
				intro: { content: "本局游戏已造成过#点火属性伤害" },
			},
		},
	},
	jdkanpo: {
		audio: "sbkanpo",
		trigger: {
			global: ["phaseBefore", "useCard"],
			player: "enterGame",
		},
		filter(event, player) {
			if (event.name == "useCard") {
				return player
					.getExpansions("jdkanpo")
					.slice()
					.map(i => i.name)
					.includes(event.card.name);
			}
			return event.name != "phase" || game.phaseNumber == 0;
		},
		async cost(event, trigger, player) {
			if (trigger.name == "useCard") {
				event.result = await player
					.chooseButton(["###" + get.prompt(event.skill) + "###弃置一张同名牌，令" + get.translation(trigger.card) + "无效", player.getExpansions(event.skill)])
					.set("filterButton", button => {
						const name = get.event().getTrigger().card.name;
						return button.link.name == name;
					})
					.set("ai", () => {
						const player = get.player(),
							trigger = get.event().getTrigger();
						return lib.skill.sbkanpo.subSkill.kanpo.check(trigger, player) ? 1 : 0;
					})
					.forResult();
				if (event.result.bool) {
					event.result.cards = event.result.links;
					event.result.targets = [trigger.player];
				}
			} else {
				event.result = { bool: true };
			}
		},
		async content(event, trigger, player) {
			if (trigger.name == "useCard") {
				await player.loseToDiscardpile(event.cards);
				trigger.targets.length = 0;
				trigger.all_excluded = true;
				game.log(trigger.card, "被无效了");
				await player.draw();
			} else {
				await player.draw(3);
				if (player.countCards("h")) {
					const result = await player
						.chooseCard("看破：是否将至多三张牌置于武将牌上？", [1, 3])
						.set("ai", card => {
							switch (card.name) {
								case "wuxie":
									return 5 + Math.random();
								case "sha":
									return 5 + Math.random();
								case "tao":
									return 4 + Math.random();
								case "jiu":
									return 3 + Math.random();
								case "lebu":
									return 3 + Math.random();
								case "shan":
									return 4.5 + Math.random();
								case "wuzhong":
									return 4 + Math.random();
								case "shunshou":
									return 2.7 + Math.random();
								case "nanman":
									return 2 + Math.random();
								case "wanjian":
									return 1.6 + Math.random();
								default:
									return 0;
							}
						})
						.forResult();
					if (result.bool) {
						await player.addToExpansion(result.cards, player, "giveAuto").set("gaintag", ["jdkanpo"]);
					}
				}
			}
		},
		marktext: "谋",
		intro: {
			mark(dialog, storage, player) {
				var cards = player.getExpansions("jdkanpo");
				if (player.isUnderControl(true)) {
					dialog.addAuto(cards);
				} else {
					return "共有" + get.cnNumber(cards.length) + "张牌";
				}
			},
			markcount: "expansion",
		},
		onremove(player, skill) {
			const cards = player.getExpansions(skill);
			if (cards.length) {
				player.loseToDiscardpile(cards);
			}
		},
	},
	jdguanxing: {
		audio: "sbguanxing",
		inherit: "sbguanxing",
		trigger: { player: "phaseZhunbeiBegin" },
		filter(event, player) {
			const bool = player.hasCard(card => card.hasGaintag("sbguanxing"), "s");
			return bool || 7 - 2 * player.countMark("sbguanxingx") > 0;
		},
		async content(event, trigger, player) {
			player.addMark("sbguanxingx", 1, false);
			const cards = player.getCards("s", card => card.hasGaintag("sbguanxing"));
			if (cards.length) {
				player.loseToDiscardpile(cards);
			}
			const num = Math.max(0, 7 - 2 * (player.countMark("sbguanxingx") - 1));
			if (num) {
				const cards2 = get.cards(num);
				player.$gain2(cards2, false);
				game.log(player, "将", cards2, "置于了武将牌上");
				await player.loseToSpecial(cards2, "sbguanxing").set("visible", true);
				player.markSkill("sbguanxing");
			}
		},
		group: ["sbguanxing_unmark", "jdguanxing_put"],
		subSkill: {
			put: {
				audio: "sbguanxing",
				enable: "phaseUse",
				filter(event, player) {
					return player.hasCard(card => card.hasGaintag("sbguanxing"), "s");
				},
				filterCard(card) {
					return card.hasGaintag("sbguanxing");
				},
				selectCard: [1, Infinity],
				position: "s",
				lose: false,
				discard: false,
				delay: 0,
				prompt: "将任意张“星”置于牌堆顶",
				content() {
					player.loseToDiscardpile(cards, ui.cardPile, "insert").log = false;
					game.log(player, "将", cards, "置于了牌堆顶");
				},
			},
		},
	},
	//九鼎-司马师
	jdtairan: {
		audio: "tairan",
		inherit: "tairan",
		trigger: {
			player: "phaseJieshuBegin",
		},
		async content(event, trigger, player) {
			const maxHp = player.maxHp;
			const hp = maxHp - player.getHp();
			if (hp > 0) {
				await player.recoverTo(maxHp);
			}
			const num = maxHp - player.countCards("h");
			if (num > 0) {
				await player.drawTo(maxHp);
			}
			player
				.when("phaseUseBegin")
				.then(() => {
					if (hp > 0) {
						player.loseHp(hp);
					}
				})
				.then(() => {
					if (player.countCards("h") && num > 0) {
						player.chooseToDiscard("h", num, true);
					}
				})
				.vars({ hp: hp, num: num });
		},
	},
	//九鼎-张飞
	jdsbpaoxiao: {
		audio: "sbpaoxiao",
		inherit: "sbpaoxiao",
		content() {
			if (!trigger.card.storage) {
				trigger.card.storage = {};
			}
			trigger.card.storage.jdsbpaoxiao = true;
			trigger.baseDamage++;
			trigger.directHit.addArray(game.players);
			player.addTempSkill(event.name + "_effect", "phaseUseAfter");
		},
		subSkill: {
			effect: {
				inherit: "sbpaoxiao_effect",
				filter(event, player) {
					return event.card.storage && event.card.storage.jdsbpaoxiao && event.target.isIn();
				},
				group: "jdsbpaoxiao_recoil",
			},
			recoil: {
				inherit: "sbpaoxiao_recoil",
				filter(event, player) {
					return event.card && event.card.storage && event.card.storage.jdsbpaoxiao && event.player.isIn();
				},
				async content(event, trigger, player) {
					await player.loseHp();
					if (player.countDiscardableCards(trigger.player, "h")) {
						await trigger.player.discardPlayerCard(player, "h", true);
					}
				},
			},
		},
	},
	//九鼎-法正
	jdsbxuanhuo: {
		audio: "sbxuanhuo",
		inherit: "sbxuanhuo",
		group: "jdsbxuanhuo_rob",
		filterTarget(card, player, target) {
			return !target.hasMark("jdsbxuanhuo_mark") && player != target;
		},
		onremove(player) {
			delete player.storage.jdsbxuanhuo;
			player.unmarkSkill("jdsbxuanhuo");
		},
		subSkill: {
			mark: {
				marktext: "眩",
				intro: {
					name: "眩惑",
					name2: "眩",
					markcount: () => 0,
					content: "已获得“眩”标记",
				},
			},
			rob: {
				audio: "jdsbxuanhuo",
				inherit: "sbxuanhuo_rob",
				filter(event, player, name, target) {
					return target?.isIn();
				},
				getIndex(event, player) {
					const evt = event.getParent("phaseDraw");
					if (evt?.name == "phaseDraw") {
						return false;
					}
					return game
						.filterPlayer(current => {
							if (!event.getg(current).length || !current.hasMark("jdsbxuanhuo_mark")) {
								return false;
							}
							if (evt?.player == current) {
								return false;
							}
							if (lib.skill.sbxuanhuo.getNum(current, "jdsbxuanhuo_rob", "jdsbxuanhuo_mark") >= 5) {
								return false;
							}
							return current.hasCard(card => lib.filter.canBeGained(card, current, player), "he");
						})
						.sortBySeat();
				},
				async content(event, trigger, player) {
					const target = event.targets[0],
						hs = target.getCards("h", card => lib.filter.canBeGained(card, target, player));
					if (hs.length) {
						await player.gainPlayerCard(target, "h", true);
						if (!player.storage.jdsbxuanhuo) {
							player.storage.jdsbxuanhuo = {};
						}
						player.storage.jdsbxuanhuo[target.playerid] = lib.skill.sbxuanhuo.getNum(target, "jdsbxuanhuo_rob", "jdsbxuanhuo_mark");
						player.markSkill("jdsbxuanhuo");
					}
				},
			},
		},
	},
	jdsbenyuan: {
		audio: "sbenyuan",
		inherit: "sbenyuan",
		filter(event, player, name, target) {
			return target?.isIn();
		},
		getIndex(event, player) {
			return game.filterPlayer(target => target.hasMark("jdsbxuanhuo_mark")).sortBySeat();
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			target.clearMark("jdsbxuanhuo_mark");
			for (const current of game.players) {
				const storage = current.storage.jdsbxuanhuo;
				if (storage && storage[target.playerid]) {
					delete storage[target.playerid];
				}
				if (storage && get.is.empty(storage)) {
					delete current.storage.jdsbxuanhuo;
					current.unmarkSkill("jdsbxuanhuo");
				}
			}
			const bool = target.countCards("h") < player.countCards("h");
			player.logSkill("jdsbenyuan", target, null, null, [bool ? 1 : 2]);
			if (bool) {
				const num = Math.min(player.countCards("he"), 2);
				if (num) {
					await player.chooseToGive(target, `恩怨：交给${get.translation(target)}${get.cnNumber(num)}张牌`, true, num, "he");
				}
			} else {
				await target.loseHp();
				await player.recover();
			}
		},
		ai: {
			combo: "jdsbxuanhuo",
		},
	},
	//九鼎-刘备
	jdsbzhangwu: {
		audio: "sbzhangwu",
		enable: "phaseUse",
		filter(event, player) {
			return player.countMark("sbrende");
		},
		limited: true,
		chooseButton: {
			dialog(event, player) {
				return ui.create.dialog("###章武###" + get.translation("jdsbzhangwu_info"));
			},
			chooseControl(event, player) {
				return Array.from({
					length: player.countMark("sbrende"),
				})
					.map((_, i) => get.cnNumber(i + 1, true))
					.concat(["cancel2"]);
			},
			check(event, player) {
				const choices = Array.from({
					length: player.countMark("sbrende"),
				}).map((_, i) => get.cnNumber(i + 1, true));
				return choices.length - 1;
			},
			backup(result, player) {
				return {
					num: result.index + 1,
					audio: "sbzhangwu",
					filterCard: () => false,
					selectCard: -1,
					skillAnimation: "epic",
					animationColor: "orange",
					async content(event, trigger, player) {
						player.awakenSkill("jdsbzhangwu");
						const num = lib.skill.jdsbzhangwu_backup.num;
						player.removeMark("sbrende", num);
						await player.draw(num);
						player.tempBanSkill("sbrende", { player: "dying" });
						player.addTempSkill("new_repaoxiao2");
					},
				};
			},
			prompt(result, player) {
				return `移去${result.index + 1}枚“仁望”并摸等量张牌`;
			},
		},
		ai: {
			order: 9,
			combo: "sbrende",
			result: {
				player(player, target) {
					return player.countMark("sbrende") > 3 ? 1 : 0;
				},
			},
		},
		subSkill: {
			backup: {},
		},
	},
	//九鼎-孙尚香
	jdsbjieyin: {
		audio: "sbjieyin",
		trigger: { player: "phaseUseBegin" },
		filter(event, player) {
			return game.hasPlayer(current => current.countCards("h") <= player.countCards("h"));
		},
		locked: true,
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(
					get.prompt2(event.name.slice(0, -5)),
					(card, player, target) => {
						return target.countCards("h") <= player.countCards("h");
					},
					true
				)
				.set("ai", target => {
					return get.attitude(get.player(), target) * (target.countCards("h") + 1);
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			const num = Math.min(2, Math.max(1, target.countCards("h")));
			let bool;
			if (player == target) {
				bool = !target.countCards("h") ? false : await player.chooseBool(get.prompt(event.name), "是否获得1点护甲？").forResultBool();
			} else {
				bool = await target
					.chooseToGive(player, `交给${get.translation(player)}${get.cnNumber(num)}张手牌，然后获得1点护甲；或令其回复1点体力并获得所有“妆”，然后其减少1点体力上限，变更势力为吴`, num, "h")
					.set("ai", card => {
						if (_status.event.goon) {
							return 100 - get.value(card);
						}
						return 0;
					})
					.set("goon", get.attitude(target, player) > 1)
					.forResultBool();
			}
			if (bool) {
				await target.changeHujia(1, null, true);
			} else {
				await player.recover();
				if (player.getExpansions("jdsbliangzhu").length) {
					await player.gain(player.getExpansions("jdsbliangzhu"), "gain2");
				}
				await player.loseMaxHp();
				if (player.group != "wu") {
					await player.changeGroup("wu");
				}
			}
		},
	},
	jdsbliangzhu: {
		audio: "sbliangzhu",
		inherit: "sbliangzhu",
		async content(event, trigger, player) {
			const target = event.targets[0];
			const cards = await player.choosePlayerCard(target, "e", true).forResultCards();
			if (!cards || !cards.length) {
				return;
			}
			const next = player.addToExpansion(cards, target, "give");
			next.gaintag.add(event.name);
			await next;
			const targets = game.filterPlayer(current => current != player && current.isDamaged());
			if (!targets) {
				return;
			}
			const list =
				targets.length == 1
					? targets
					: await player
							.chooseTarget(`选择一名其他角色，令其回复1点体力`, (card, player, target) => {
								return target != player && target.isDamaged();
							})
							.set("ai", target => {
								const player = get.player();
								return get.recoverEffect(target, player, player);
							})
							.forResultTargets();
			if (list && list.length) {
				await list[0].recover();
			}
		},
		ai: {
			order: 9,
			result: {
				player: 1,
				target: -1,
			},
		},
	},
	//九鼎-种地的
	jdsbjieyue: {
		audio: "sbjieyue",
		trigger: {
			player: "phaseJieshuBegin",
		},
		filter(event, player) {
			return game.hasPlayer(current => current != player);
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(lib.filter.notMe, get.prompt2(event.name.slice(0, -5)))
				.set("ai", target => {
					return get.attitude(get.player(), target) / Math.sqrt(Math.min(1, target.hp + target.hujia));
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			await target.draw(2);
			await target.changeHujia(1, null, true);
			if (target.countCards("he")) {
				await target.chooseToGive(player, "he", Math.min(2, target.countCards("he")), true);
			}
		},
	},
	//九鼎-高贵名门
	jdsbluanji: {
		audio: "sbluanji",
		inherit: "sbluanji",
		filter(event, player) {
			if (event.name == "chooseToUse") {
				return player.countCards("hs") > 1 && !player.hasSkill("jdsbluanji_used");
			}
			const evt = event.getParent(2);
			return evt.name == "wanjian" && evt.getParent().player == player && event.player != player && event.player.countCards("h") > player.countCards("h") && player.countCards("h") < player.getHp();
		},
		precontent() {
			player.addTempSkill("jdsbluanji_used", "phaseUseAfter");
		},
		subSkill: {
			used: {
				charlotte: true,
			},
		},
	},
	jdsbxueyi: {
		audio: "sbxueyi",
		trigger: {
			global: ["useCardAfter", "respondAfter"],
		},
		filter(event, player) {
			if (!event.respondTo) {
				return false;
			}
			if (player != event.respondTo[0]) {
				return false;
			}
			return player.hasZhuSkill("jdsbxueyi") && event.player != player && event.player.group == "qun";
		},
		zhuSkill: true,
		forced: true,
		logTarget: "player",
		async content(event, trigger, player) {
			for (const name of lib.phaseName) {
				const evt = _status.event.getParent(name);
				if (!evt || evt.name != name) {
					continue;
				}
				trigger.player.addTempSkill(event.name + "_ban", name + "After");
				break;
			}
		},
		mod: {
			maxHandcard(player, num) {
				if (player.hasZhuSkill("jdsbxueyi")) {
					return num + 2 * game.countPlayer(current => player != current && current.group == "qun");
				}
			},
		},
		subSkill: {
			ban: {
				charlotte: true,
				mark: true,
				mod: {
					cardEnabled2(card) {
						if (get.position(card) == "h") {
							return false;
						}
					},
				},
				intro: {
					content: "不能使用或打出手牌",
				},
			},
		},
	},
	//九鼎-孟获
	jdsbhuoshou: {
		audio: "sbhuoshou",
		trigger: {
			player: "phaseUseEnd",
		},
		filter(event, player) {
			return player.countCards("h");
		},
		async content(event, trigger, player) {
			await player.discard(player.getCards("h"));
			const nanman = get.autoViewAs({ name: "nanman", isCard: true });
			if (player.hasUseTarget(nanman)) {
				await player.chooseUseTarget(nanman, true, false);
			}
		},
		forced: true,
		group: ["sbhuoshou_cancel", "sbhuoshou_source"],
	},
	jdsbzaiqi: {
		audio: "sbzaiqi",
		trigger: {
			player: "phaseDiscardEnd",
		},
		filter(event, player) {
			return player.getHistory("lose", evt => evt.type == "discard").length;
		},
		async cost(event, trigger, player) {
			const num = player.getHistory("lose", evt => evt.type == "discard").reduce((num, evt) => num + evt.cards2.length, 0);
			event.result = await player
				.chooseTarget(get.prompt2(event.name.slice(0, -5)), [1, num])
				.set("ai", target => {
					const player = get.player();
					const att = get.attitude(player, target);
					return 3 - get.sgn(att) + Math.abs(att / 1000);
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const targets = event.targets.sortBySeat();
			while (targets.length) {
				const target = targets.shift();
				const bool = !target.countCards("he")
					? false
					: await target
							.chooseToDiscard(get.translation(player) + "对你发动了【再起】", "是否弃置一张牌令其回复1点体力？或者点击“取消”，令该角色摸一张牌。", "he")
							.set("ai", card => {
								const eff = _status.event.eff,
									att = _status.event.att;
								if ((eff > 0 && att > 0) || (eff <= 0 && att < 0)) {
									return 5.5 - get.value(card);
								}
								return 0;
							})
							.set("eff", get.recoverEffect(player, player, target))
							.set("att", get.attitude(target, player))
							.forResultBool();
				target.line(player);
				if (bool) {
					await player.recover(target);
				} else {
					await player.draw();
				}
			}
		},
	},
	//九鼎-大乔
	jdsbguose: {
		audio: "sbguose",
		inherit: "sbguose",
		usable: 1,
		filterTarget(card, player, target) {
			if (!ui.selected.cards.length) {
				if (!target.hasJudge("lebu")) {
					return false;
				}
				return game.hasPlayer(current => current != target && current.canAddJudge("lebu"));
			}
			if (player == target) {
				return false;
			}
			return player.canUse(get.autoViewAs({ name: "lebu" }, ui.selected.cards), target);
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			if (target.hasJudge("lebu")) {
				await player
					.moveCard(true, card => (card.viewAs || card.name) == "lebu")
					.set("sourceTargets", [target])
					.set(
						"aimTargets",
						game.filterPlayer(current => current != target && current.canAddJudge("lebu"))
					)
					.set("prompt", `移动${get.translation(target)}的一张【乐不思蜀】`);
			} else {
				const next = player.useCard({ name: "lebu" }, target, event.cards);
				next.audio = false;
				await next;
			}
		},
	},
	jdsbliuli: {
		audio: "sbliuli",
		inherit: "liuli",
		group: "jdsbliuli_add",
		subSkill: {
			add: {
				trigger: { player: "logSkill" },
				filter(event, player) {
					if (event.skill != "jdsbliuli") {
						return false;
					}
					return event.targets[0].isIn();
				},
				forced: true,
				popup: false,
				content() {
					game.countPlayer(current => current.removeSkill("jdsbliuli_dangxian"));
					trigger.targets[0].addSkill("jdsbliuli_dangxian");
				},
			},
			dangxian: {
				trigger: { player: "phaseBegin" },
				forced: true,
				charlotte: true,
				mark: true,
				marktext: "流",
				intro: { content: "回合开始时，执行一个额外的出牌阶段" },
				content() {
					player.removeSkill(event.name);
					trigger.phaseList.splice(trigger.num, 0, `phaseUse|${event.name}`);
				},
			},
		},
	},
	//九鼎-姜维
	jdsbtiaoxin: {
		audio: "sbtiaoxin",
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return game.hasPlayer(current => current != player);
		},
		filterTarget: lib.filter.notMe,
		selectTarget() {
			return [1, get.player().getHp()];
		},
		multiline: true,
		async content(event, trigger, player) {
			const target = event.target;
			const bool = await target
				.chooseToUse(function (card, player, event) {
					if (get.name(card) != "sha") {
						return false;
					}
					return lib.filter.filterCard.apply(this, arguments);
				}, "挑衅：对" + get.translation(player) + "使用一张杀，或令其获得你一张牌")
				.set("targetRequired", true)
				.set("complexSelect", true)
				.set("complexTarget", true)
				.set("filterTarget", function (card, player, target) {
					if (target != _status.event.sourcex && !ui.selected.targets.includes(_status.event.sourcex)) {
						return false;
					}
					return lib.filter.targetEnabled.apply(this, arguments);
				})
				.set("sourcex", player)
				.forResultBool();
			if (!target.countGainableCards(player, "he")) {
				return;
			}
			if (!bool || (bool && !target.hasHistory("sourceDamage", evt => evt.getParent(4) == event))) {
				await player.gainPlayerCard(target, "he", true);
			}
		},
		ai: {
			threaten: 1.2,
			order: 4,
			expose: 0.2,
			result: {
				target(player, target) {
					if (target.countGainableCards(player, "he") == 0) {
						return 0;
					}
					return -1;
				},
				player(player, target) {
					if (!target.canUse("sha", player)) {
						return 0;
					}
					if (target.countCards("h") == 0) {
						return 0;
					}
					if (target.countCards("h") == 1) {
						return -0.1;
					}
					if (player.hp <= 2) {
						return -2;
					}
					if (player.countCards("h", "shan") == 0) {
						return -1;
					}
					return -0.5;
				},
			},
		},
	},
	jdsbzhiji: {
		audio: "sbzhiji",
		trigger: {
			player: "dying",
		},
		juexingji: true,
		forced: true,
		skillAnimation: true,
		animationColor: "fire",
		async content(event, trigger, player) {
			player.awakenSkill(event.name);
			await player.recoverTo(2);
			await player.loseMaxHp();
			await player.addSkills("jdsbbeifa");
			if (player.isMinHandcard()) {
				await player.draw(2);
			}
		},
		derivation: "jdsbbeifa",
	},
	jdsbbeifa: {
		enable: "phaseUse",
		filter(event, player) {
			return game.hasPlayer(current => current != player);
		},
		filterCard: true,
		selectCard: [1, Infinity],
		check(card) {
			if (ui.selected.cards.length > 2) {
				return 0;
			}
			const player = get.player();
			if (game.hasPlayer(current => current != player && get.attitude(player, current) > 0 && current.getCards("h").some(cardx => get.name(cardx) == get.name(card)))) {
				return 1;
			}
			return 7.5 - get.value(card);
		},
		async content(event, trigger, player) {
			const cards = event.cards,
				num = cards.length,
				names = cards.map(card => get.name(card)).toUniqued();
			if (!game.hasPlayer(current => current != player && current.countCards("h"))) {
				return;
			}
			const targets = await player
				.chooseTarget(`北伐：令一名其他角色展示${num}张手牌`, true, (card, player, target) => {
					return target != player && target.countCards("h");
				})
				.set("ai", target => {
					const player = get.player();
					return get.attitude(player, target) * (1 + target.countCards("h"));
				})
				.forResultTargets();
			if (!targets || !targets.length) {
				return;
			}
			const target = targets[0];
			let showCards = await target
				.chooseCard("h", Math.min(num, target.countCards("h")), true, `选择${get.translation(num)}张手牌展示`)
				.set("ai", card => {
					const player = get.player(),
						goon = get.event("goon"),
						names = get.event("names");
					if (goon) {
						if (names.includes(get.name(card))) {
							return 10;
						}
						return 7.5 - get.value(card);
					} else {
						if (names.includes(get.name(card))) {
							return 0;
						}
						return 6 - get.value(card);
					}
				})
				.set("goon", get.attitude(target, player) > 0)
				.set("names", names)
				.forResultCards();
			if (!showCards || !showCards.length) {
				return;
			}
			await target.showCards(showCards);
			while (showCards.some(card => names.includes(get.name(card)) && player.hasUseTarget(get.autoViewAs({ name: "sha" }, [card]), false, false))) {
				const links = await player
					.chooseButton(["北伐：将其中一张牌当【杀】使用", showCards])
					.set("filterButton", button => {
						const player = get.player(),
							card = button.link;
						if (!get.event("names").includes(get.name(card))) {
							return false;
						}
						return player.hasUseTarget(get.autoViewAs({ name: "sha" }, [card]), false, false);
					})
					.set("ai", button => {
						return get.value(button.link);
					})
					.set("names", names)
					.forResultLinks();
				if (!links || !links.length) {
					break;
				}
				showCards.removeArray(links);
				const card = links[0],
					cardx = {
						name: "sha",
						cards: [card],
					};
				await player.chooseUseTarget(cardx, [card], true, false);
			}
		},
		ai: {
			order: 10,
			result: {
				player(player, target) {
					if (!game.hasPlayer(current => get.effect(current, { name: "sha" }, player, player) > 0)) {
						return 0;
					}
					const names = player
						.getCards("he")
						.map(card => get.name(card))
						.toUniqued();
					if (game.hasPlayer(current => current != player && get.attitude(player, current) > 0 && current.getCards("h").some(card => names.includes(get.name(card))))) {
						return 1;
					}
					return 0;
				},
			},
		},
	},
	//九鼎-关羽
	jdsbwusheng: {
		audio: "sbwusheng",
		trigger: {
			player: "phaseUseBegin",
		},
		filter(event, player) {
			return game.hasPlayer(target => target != player && target.countCards("h"));
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt(event.name.slice(0, -5)), "令一名其他角色展示所有手牌，本阶段对其使用的前X张【杀】无距离和次数限制且结算后你摸一张牌（X为其以此法展示的红色手牌数）", (card, player, target) => {
					return target != player && target.countCards("h");
				})
				.set("ai", target => {
					const player = get.player();
					return get.effect(target, { name: "sha" }, player, player) * (1 + target.countCards("h", { color: "red" }));
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			await target.showHandcards();
			if (get.mode() !== "identity" || player.identity !== "nei") {
				player.addExpose(0.25);
			}
			const num = target.countCards("h", { color: "red" });
			if (num > 0) {
				player.addTempSkill("jdsbwusheng_effect", { player: "phaseUseAfter" });
				player.storage.jdsbwusheng_effect[target.playerid] = num;
			}
		},
		group: "sbwusheng_wusheng",
		subSkill: {
			effect: {
				charlotte: true,
				onremove: true,
				init(player, skill) {
					if (!player.storage[skill]) {
						player.storage[skill] = {};
					}
				},
				mod: {
					targetInRange(card, player, target) {
						if (card.name !== "sha" || typeof player.storage.jdsbwusheng_effect[target.playerid] !== "number") {
							return;
						}
						if (player.storage.jdsbwusheng_effect[target.playerid] > 0) {
							return true;
						}
					},
					cardUsableTarget(card, player, target) {
						if (card.name !== "sha" || typeof player.storage.jdsbwusheng_effect[target.playerid] !== "number") {
							return;
						}
						if (player.storage.jdsbwusheng_effect[target.playerid] > 0) {
							return true;
						}
					},
				},
				audio: "sbwusheng",
				trigger: {
					player: ["useCardAfter", "useCard1"],
				},
				filter(event, player, name) {
					if (event.card.name != "sha" || (name == "useCard1" && event.addCount == false)) {
						return false;
					}
					return event.targets.some(target => typeof player.storage.jdsbwusheng_effect[target.playerid] == "number" && player.storage.jdsbwusheng_effect[target.playerid] > 0);
				},
				forced: true,
				async content(event, trigger, player) {
					if (event.triggername == "useCard1") {
						trigger.addCount = false;
						const stat = player.getStat().card,
							name = trigger.card.name;
						if (typeof stat[name] === "number") {
							stat[name]--;
						}
					} else {
						const targets = trigger.targets.filter(target => typeof player.storage.jdsbwusheng_effect[target.playerid] == "number" && player.storage.jdsbwusheng_effect[target.playerid] > 0);
						player.line(targets);
						await player.draw(targets.length);
						for (const target of targets) {
							player.storage.jdsbwusheng_effect[target.playerid]--;
						}
					}
				},
			},
		},
	},
	jdsbyijue: {
		audio: "sbyijue",
		trigger: {
			player: "phaseZhunbeiBegin",
		},
		filter(event, player) {
			return game.hasPlayer(current => current != player);
		},
		forced: true,
		logTarget(event, player) {
			return game.filterPlayer(current => current != player).sortBySeat();
		},
		async content(event, trigger, player) {
			const givers = [];
			for (const target of event.targets) {
				const bool = !target.countCards("he")
					? false
					: await target
							.chooseToGive(player, "he", `交给${get.translation(player)}一张牌，本回合当你首次受到其的【杀】的造成的伤害时，防止之`)
							.set("ai", card => {
								const player = get.event("player"),
									target = get.event().getParent().player;
								const att = get.attitude(player, target);
								if (att >= 0) {
									return 0;
								}
								if (player.getHp() > 1 || !target.canUse({ name: "sha" }, player, true, true)) {
									return 0;
								}
								return 7.5 - get.value(card);
							})
							.forResultBool();
				if (bool) {
					givers.add(target);
				}
			}
			if (givers.length) {
				player.addTempSkill(event.name + "_effect");
				player.markAuto(event.name + "_effect", givers);
			}
		},
		subSkill: {
			effect: {
				charlotte: true,
				onremove: true,
				intro: {
					content: "本回合$首次受到你的【杀】的造成的伤害时，你防止之",
				},
				trigger: {
					global: "damageBegin4",
				},
				filter(event, player) {
					if (!player.getStorage("jdsbyijue_effect").includes(event.player)) {
						return false;
					}
					return event.card && event.card.name == "sha" && event.getParent().type == "card";
				},
				forced: true,
				popup: false,
				async content(event, trigger, player) {
					trigger.cancel();
					player.unmarkAuto(event.name, [trigger.player]);
				},
			},
		},
	},
	//九鼎-小乔
	jdsbtianxiang: {
		audio: "sbtianxiang",
		trigger: {
			player: "damageBegin4",
		},
		filter(event, player) {
			return player.countCards("h") > 1 && event.num > 0;
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseCardTarget({
					filterCard: true,
					selectCard: 2,
					filterTarget: lib.filter.notMe,
					position: "h",
					ai1(card) {
						return 10 - get.value(card);
					},
					ai2(target) {
						var att = get.attitude(_status.event.player, target);
						var trigger = _status.event.getTrigger();
						var da = 0;
						if (_status.event.player.hp == 1) {
							da = 10;
						}
						var eff = get.damageEffect(target, trigger.source, target);
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
				.forResult();
		},
		async content(event, trigger, player) {
			const cards = event.cards,
				target = event.targets[0];
			await player.showCards(cards);
			const links = await target
				.chooseButton(["天香：获得其中一张牌", cards], true)
				.set("ai", button => {
					const player = get.player(),
						card = button.link;
					return get.value(card);
				})
				.forResultLinks();
			if (!links || !links.length) {
				return;
			}
			const suit = get.suit(links[0], player);
			await target.gain(links, "gain2");
			if (suit == "heart") {
				trigger.cancel();
				await target
					.damage(trigger.source || "nosource", trigger.nature, trigger.num)
					.set("card", trigger.card)
					.set("cards", trigger.cards);
			} else {
				target.addTempSkill(event.name + "_effect");
				target.markAuto(event.name + "_effect", [get.type2(links[0])]);
			}
		},
		subSkill: {
			effect: {
				charlotte: true,
				onremove: true,
				mark: true,
				intro: {
					content: storage => `本回合不能使用${get.translation(storage)}牌`,
				},
				mod: {
					cardEnabled(card, player) {
						const hs = player.getCards("h"),
							cards = [card];
						if (Array.isArray(card.cards)) {
							cards.addArray(card.cards);
						}
						if (cards.containsSome(...hs) && player.getStorage("jdsbtianxiang_effect").includes(get.type2(card))) {
							return false;
						}
					},
					cardSavable(card, player) {
						const hs = player.getCards("h"),
							cards = [card];
						if (Array.isArray(card.cards)) {
							cards.addArray(card.cards);
						}
						if (cards.containsSome(...hs) && player.getStorage("jdsbtianxiang_effect").includes(get.type2(card))) {
							return false;
						}
					},
				},
			},
		},
	},
	jdsbhongyan: {
		audio: "xinhongyan",
		mod: {
			suit(card, suit) {
				if (suit == "spade") {
					return "heart";
				}
			},
		},
		trigger: {
			player: "loseAfter",
			global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"],
		},
		forced: true,
		filter(event, player) {
			if (player.hasHistory("gain", evt => evt.getParent().name == "draw" && evt.getParent(2).name == "jdsbhongyan")) {
				return false;
			}
			const evt = event.getl(player);
			return evt.cards2.some(i => get.suit(i, player) == "heart");
		},
		async content(event, trigger, player) {
			if (!trigger.visible) {
				const cards = trigger.getl(player).hs.filter(i => get.suit(i, player) == "heart");
				if (cards.length > 0) {
					await player.showCards(cards, get.translation(player) + "发动了【红颜】");
				}
			}
			await player.draw();
		},
	},
	//九鼎-孙权
	jdsbzhiheng: {
		audio: "sbzhiheng",
		inherit: "sbzhiheng",
		check(card) {
			let player = _status.event.player;
			if (get.position(card) == "e") {
				if (
					ui.selected.cards.some(i => {
						return get.position(i) == "e";
					})
				) {
					return 0;
				}
				let subs = get.subtypes(card);
				if (subs.includes("equip2") || subs.includes("equip3")) {
					return 2 * player.getHp() - get.value(card);
				}
				return 12 - get.value(card);
			}
			return 6 - get.value(card);
		},
		prompt() {
			return "出牌阶段限一次。你可以弃置任意张牌并摸等量的牌，若你以此法弃置的牌包括你装备区的牌，则你多摸一张牌";
		},
		async content(event, trigger, player) {
			const cards = event.cards;
			const num = cards.some(card => player.getCards("e").includes(card)) ? 1 : 0;
			await player.discard(cards);
			await player.draw(cards.length + num);
		},
	},
	jdsbtongye: {
		init(player) {
			if (game.shuffleNumber == 0) {
				player.addAdditionalSkill("jdsbtongye", get.info("jdsbtongye").derivation);
				lib.onwash.push(function () {
					player.removeAdditionalSkill("jdsbtongye");
				});
			}
		},
		onremove(player) {
			player.removeAdditionalSkill("jdsbtongye");
		},
		derivation: ["sbyingzi", "olguzheng"],
		locked: true,
	},
	jdsbjiuyuan: {
		audio: "sbjiuyuan",
		enable: "phaseUse",
		usable: 1,
		zhuSkill: true,
		filter(event, player) {
			return game.hasPlayer(current => get.info("jdsbjiuyuan").filterTarget(null, player, current));
		},
		filterTarget(card, player, target) {
			return target != player && target.group == "wu" && target.countGainableCards(player, "e") && player.hasZhuSkill("jdsbjiuyuan", target);
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			await player.gain(target.getCards("e"), target, "giveAuto", "bySelf");
			await player.recover();
		},
		ai: {
			order: 10,
			result: {
				target(player, target) {
					return get.effect(target, { name: "shunshou_copy2" }, player, target) * target.countGainableCards(player, "e");
				},
			},
		},
	},
	//九鼎-司马炎
	jdfengtu: {
		mode: ["identity", "guozhan", "doudizhu", "versus"],
		available(mode) {
			if (mode == "versus" && _status.mode == "three") {
				return false;
			}
		},
		trigger: { global: "dieAfter" },
		filter(event, player) {
			//if (game.players.includes(event.player)) return false;
			return game.hasPlayer(target => {
				return !game.getAllGlobalHistory("everything", evt => {
					return evt.name == "loseMaxHp" && evt.getParent().name == "jdfengtu" && evt.player == target;
				}).length;
			});
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt2(event.skill), (card, player, target) => {
					return get.event().targets.includes(target);
				})
				.set("ai", target => {
					const player = get.event("player"),
						att = get.attitude(player, target);
					if (target.maxHp <= 1) {
						return 114514119810 * get.sgn(-att);
					}
					if (player.identity == "nei" && target != player) {
						return 0;
					}
					return (target.maxHp - 1) * att;
				})
				.set(
					"targets",
					game.filterPlayer(target => {
						return !game.getAllGlobalHistory("everything", evt => {
							return evt.name == "loseMaxHp" && evt.getParent().name == "jdfengtu" && evt.player == target;
						}).length;
					})
				)
				.forResult();
		},
		async content(event, trigger, player) {
			if (!lib.onround.includes(lib.skill.jdfengtu.onRound)) {
				lib.onround.push(lib.skill.jdfengtu.onRound);
			}
			const target = event.targets[0];
			await target.loseMaxHp();
			target.addSkill("jdfengtu_phase");
			target.markAuto("jdfengtu_phase", [trigger.player]);
		},
		onRound(event) {
			return event.getParent().skill != "jdfengtu_phase" && (event.relatedEvent || event.getParent(2)).name != "jdfengtu_phase";
		},
		check(source, player) {
			const players = game.players
				.slice()
				.concat(game.dead)
				.sort((a, b) => parseInt(a.dataset.position) - parseInt(b.dataset.position));
			const num = players.indexOf(source),
				num2 = players.indexOf(player);
			return num2 - num == 1 || (num == players.length - 1 && num2 == 0);
		},
		subSkill: {
			phase: {
				charlotte: true,
				trigger: { global: "phaseOver" },
				filter(event, player) {
					return player.getStorage("jdfengtu_phase").some(target => {
						return !game.players.includes(target) && lib.skill.jdfengtu.check(event.player, target);
					});
				},
				forced: true,
				popup: false,
				content() {
					const next = player.insertPhase();
					delete next.skill;
				},
				intro: { content: "获得$的额定回合" },
			},
		},
	},
	jdjuqi: {
		trigger: { global: "phaseZhunbeiBegin" },
		filter(event, player) {
			const storage = player.storage.jdjuqi;
			return event.player == player || event.player.countCards("h", card => _status.connectMode || (get.color(card, event.player) == storage ? "red" : "black"));
		},
		async cost(event, trigger, player) {
			const target = trigger.player;
			if (target == player) {
				event.result = { bool: true };
			} else {
				const color = player.storage.jdjuqi ? "red" : "black";
				event.result = await target
					.chooseCard((card, player) => get.color(card, player) == _status.event.color, `举棋：你可以交给${get.translation(player)}一张${get.translation(color)}手牌`)
					.set("ai", card => {
						const player = get.player(),
							target = get.event("target");
						if (get.attitude(player, target) <= 0) {
							return 0;
						}
						return 6 - get.value(card);
					})
					.set("color", color)
					.set("target", player)
					.forResult();
			}
		},
		async content(event, trigger, player) {
			const target = trigger.player;
			player.changeZhuanhuanji(event.name);
			if (target == player) {
				if (player.storage[event.name]) {
					await player.draw(3);
				} else {
					player.addTempSkill(event.name + "_effect");
				}
			} else {
				await target.showCards(event.cards);
				await target.give(event.cards, player);
			}
		},
		mark: true,
		zhuanhuanji: true,
		marktext: "☯",
		intro: {
			content(storage) {
				if (storage) {
					return "<li>准备阶段，你令你本回合使用牌无次数限制且造成的伤害+1<br><li>其他角色的准备阶段，其可以展示并交给你一张红色手牌";
				}
				return "<li>准备阶段，你摸三张牌<br><li>其他角色的准备阶段，其可以展示并交给你一张黑色手牌";
			},
		},
		subSkill: {
			effect: {
				charlotte: true,
				mod: { cardUsable: () => Infinity },
				forced: true,
				popup: false,
				trigger: { source: "damageBegin1" },
				filter(event, player) {
					return event.card && event.getParent().type == "card";
				},
				async content(event, trigger, player) {
					trigger.num++;
				},
				mark: true,
				intro: { content: "本回合使用牌无次数限制且造成的伤害+1" },
			},
		},
	},
	jdtaishi: {
		zhuSkill: true,
		trigger: { global: "phaseBeginStart" },
		filter(event, player) {
			return game.hasPlayer(current => current.isUnseen(2));
		},
		logTarget() {
			return game.filterPlayer(current => current.isUnseen(2)).sortBySeat();
		},
		limited: true,
		skillAnimation: true,
		animationColor: "orange",
		async content(event, trigger, player) {
			player.awakenSkill(event.name);
			for (const target of game.filterPlayer(current => current.isUnseen(2)).sortBySeat()) {
				await target.showCharacter(2);
			}
		},
	},
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
				const player = get.event("player"),
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
	//线下E系列
	//钟会
	psmouchuan: {
		trigger: {
			global: "roundStart",
		},
		async content(event, trigger, player) {
			await player.draw(2);
			if (!player.countCards("he") || !game.hasPlayer(current => current != player)) {
				return;
			}
			const [cards, targets] = await player
				.chooseCardTarget({
					forced: true,
					prompt: get.prompt("psmouchuan"),
					prompt2: "将一张牌交给一名其他角色",
					filterTarget: lib.filter.notMe,
					filterCard: true,
					position: "he",
					ai1(card) {
						return 6 - get.value(card);
					},
					ai2(target) {
						const player = get.player();
						return get.attitude(player, target);
					},
				})
				.forResult("cards", "targets");
			if (!cards || !cards.length || !targets || !targets.length) {
				return;
			}
			const [target] = targets;
			await player.give(cards, target);
			if ([player, target].some(i => !i.countCards("h"))) {
				return;
			}
			let card1, card2;
			if (player.countCards("h")) {
				const cardp = await player.chooseCard("请展示一张手牌", true, "h").forResultCards();
				await player.showCards(cardp);
				card1 = cardp[0];
			}
			if (target.countCards("h")) {
				const cardt = await target.chooseCard("请展示一张手牌", true, "h").forResultCards();
				await target.showCards(cardt);
				card2 = cardt[0];
			}
			if (card1 && card2) {
				const skill = get.color(card1, player) == get.color(card2, target) ? "psdaohe" : "pszhiyi";
				await player.addTempSkills(skill, "roundStart");
			}
		},
		derivation: ["psdaohe", "pszhiyi"],
	},
	pszizhong: {
		mod: {
			maxHandcard(player, num) {
				return num + get.info("jsrgjuxia").countSkill(player);
			},
		},
		trigger: {
			player: ["useCard", "respond"],
		},
		filter(event, player) {
			const num = get.info("jsrgjuxia").countSkill(player) - 2;
			if (num <= 0 || get.type(event.card) == "equip") {
				return false;
			}
			let name = get.name(event.card),
				stat =
					player.getRoundHistory("useCard", evt => {
						return evt != event && get.name(evt.card) == name;
					}).length +
					player.getRoundHistory("respond", evt => {
						return evt != event && get.name(evt.card) == name;
					}).length;
			return stat == 0;
		},
		forced: true,
		async content(event, trigger, player) {
			const num = get.info("jsrgjuxia").countSkill(player) - 2;
			await player.draw(num);
		},
	},
	psjizun: {
		trigger: { player: "dyingAfter" },
		filter(event, player) {
			return player.isDamaged() || !player.hasSkill("psqingsuan");
		},
		forced: true,
		juexingji: true,
		skillAnimation: true,
		animationColor: "orange",
		async content(event, trigger, player) {
			player.awakenSkill(event.name);
			if (!player.hasSkill("psqingsuan")) {
				await player.addSkills("psqingsuan");
			} else {
				await player.recoverTo(player.maxHp);
			}
		},
		derivation: "psqingsuan",
	},
	psqingsuan: {
		locked: true,
		zhuSkill: true,
		getEnemies(player) {
			const enemies = [];
			player.checkAllHistory("damage", evt => {
				if (evt.source && player.group != evt.source.group) {
					enemies.add(evt.source);
				}
			});
			return enemies;
		},
		mod: {
			targetInRange(card, player, target) {
				if (get.info("psqingsuan").getEnemies(player).includes(target)) {
					return true;
				}
			},
			cardUsableTarget(card, player, target) {
				if (get.info("psqingsuan").getEnemies(player).includes(target)) {
					return true;
				}
			},
		},
	},
	psdaohe: {
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return game.hasPlayer(current => current != player && current.countCards("h"));
		},
		filterTarget(card, player, target) {
			return target != player && target.countCards("h");
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			await target.chooseToGive(player, "h", [1, Infinity], true).set("ai", card => {
				const player = get.player(),
					target = get.event("target"),
					att = get.attitude(player, target);
				if (att <= 0) {
					if (ui.selected.cards.length) {
						return 0;
					}
					return 6 - get.value(card);
				}
				return target.getUseValue(card);
			});
			await target.recover();
		},
		ai: {
			order: 6,
			result: {
				player(player, target) {
					if (target.isHealthy()) {
						return get.effect(target, { name: "shunshou_copy2" }, player, player);
					}
					return get.recoverEffect(target, player, player);
				},
			},
		},
	},
	pszhiyi: {
		enable: "phaseUse",
		usable: 1,
		filterTarget: true,
		async content(event, trigger, player) {
			const target = event.targets[0];
			await target.draw();
			await target.damage();
		},
		ai: {
			order: 1,
			result: {
				player(player, target) {
					return get.effect(target, { name: "draw" }, player, player) + get.damageEffect(target, player, player);
				},
			},
		},
	},
	//鄂焕
	psdiwan: {
		trigger: { player: "useCardToPlayered" },
		filter(event, player) {
			return event.card.name == "sha" && event.isFirstTarget;
		},
		frequent: true,
		usable: 1,
		content() {
			player.draw(trigger.targets.length);
		},
	},
	pssuiluan: {
		trigger: { player: "useCard2" },
		filter(event, player) {
			if (player.group != "qun" || event.card.name != "sha") {
				return false;
			}
			return (
				game.countPlayer(target => {
					return !event.targets.includes(target) && lib.filter.targetEnabled2(event.card, player, target) && lib.filter.targetInRange(event.card, player, target);
				}) > 1
			);
		},
		groupSkill: "qun",
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(
					get.prompt2(event.skill),
					(card, player, target) => {
						const event = get.event().getTrigger();
						return !event.targets.includes(target) && lib.filter.targetEnabled2(event.card, player, target) && lib.filter.targetInRange(event.card, player, target);
					},
					2
				)
				.set("ai", target => {
					const player = get.event("player"),
						event = get.event().getTrigger();
					return get.effect(target, event.card, player);
				})
				.forResult();
		},
		async content(event, trigger, player) {
			trigger.targets.addArray(event.targets);
			player.addTempSkill("pssuiluan_effect");
			trigger.card.pssuiluan = true;
		},
		subSkill: {
			effect: {
				charlotte: true,
				trigger: { player: ["useCardAfter", "damageEnd"] },
				filter(event, player) {
					if (event.name == "damage") {
						return player.group != "shu" && event.getParent(4).name == "pssuiluan_effect";
					}
					return event.card.pssuiluan && (event.targets || []).some(i => i.isIn());
				},
				forced: true,
				popup: false,
				forceDie: true,
				async content(event, trigger, player) {
					if (trigger.name == "damage") {
						await player.changeGroup("shu");
						return;
					}
					const targets = trigger.targets.filter(i => i.isIn()).sortBySeat();
					for (const target of targets) {
						await target
							.chooseToUse(function (card, player, event) {
								if (get.name(card) != "sha") {
									return false;
								}
								return lib.filter.filterCard.apply(this, arguments);
							}, "随乱：是否对" + get.translation(player) + "使用一张【杀】？")
							.set("filterTarget", function (card, player, target) {
								if (target != _status.event.sourcex && !ui.selected.targets.includes(_status.event.sourcex)) {
									return false;
								}
								return lib.filter.filterTarget.apply(this, arguments);
							})
							.set("targetRequired", true)
							.set("complexSelect", true)
							.set("complexTarget", true)
							.set("sourcex", player);
					}
				},
			},
		},
	},
	psconghan: {
		trigger: { global: "damageSource" },
		filter(event, player) {
			if (player.group != "shu" || !event.source || !event.player.isIn()) {
				return false;
			}
			return event.source.getSeatNum() == 1 && (player.hasSha() || (_status.connectMode && player.countCards("hs")));
		},
		direct: true,
		groupSkill: "shu",
		seatRelated: true,
		clearTime: true,
		content() {
			player
				.chooseToUse(function (card, player, event) {
					if (get.name(card) != "sha") {
						return false;
					}
					return lib.filter.filterCard.apply(this, arguments);
				}, get.prompt2("psconghan", trigger.player))
				.set("filterTarget", function (card, player, target) {
					if (target != _status.event.sourcex && !ui.selected.targets.includes(_status.event.sourcex)) {
						return false;
					}
					return lib.filter.filterTarget.apply(this, arguments);
				})
				.set("targetRequired", true)
				.set("complexSelect", true)
				.set("complexTarget", true)
				.set("logSkill", ["psconghan", trigger.player])
				.set("sourcex", trigger.player);
		},
	},
	//肘击
	psyanmou: {
		getCards(event, player) {
			let cards = [];
			if (event.name == "cardsDiscard") {
				const evt = event.getParent().relatedEvent;
				if (evt && evt.name == "judge" && evt.player != player) {
					cards.addArray(event.cards.filter(i => get.position(i, true) == "d"));
				}
			} else {
				if (event.type == "discard" && event.getlx !== false) {
					for (const target of game.filterPlayer2()) {
						if (target == player) {
							continue;
						}
						const evt = event.getl(target);
						if (evt && (evt.cards2 || []).length) {
							cards.addArray((evt.cards2 || []).filter(i => i.original != "j" && get.position(i, true) == "d"));
						}
					}
				}
			}
			return cards.filter(card => {
				return card.name == "huogong" || (card.name == "sha" && game.hasNature(card, "fire"));
			});
		},
		trigger: { global: ["cardsDiscardAfter", "loseAfter", "loseAsyncAfter"] },
		filter(event, player) {
			return lib.skill.psyanmou.getCards(event, player).length;
		},
		prompt2(event, player) {
			return "获得" + get.translation(lib.skill.psyanmou.getCards(event, player));
		},
		frequent: true,
		content() {
			player.gain(lib.skill.psyanmou.getCards(trigger, player), "gain2");
		},
		group: "psyanmou_chooseToUse",
		subSkill: {
			chooseToUse: {
				trigger: {
					player: "gainAfter",
					global: "loseAsyncAfter",
				},
				filter(event, player) {
					return event.getg && event.getg(player).length;
				},
				forced: true,
				locked: false,
				async content(event, trigger, player) {
					let cards = trigger.getg(player);
					await player.showCards(cards, get.translation(player) + "发动了【炎谋】");
					cards = cards.filter(card => {
						if (!player.hasUseTarget(card) || get.owner(card) !== player) {
							return false;
						}
						return get.name(card) == "huogong" || (get.name(card) == "sha" && game.hasNature(card, "fire"));
					});
					if (cards.length) {
						await player
							.chooseToUse(function (card, player, event) {
								if (get.itemtype(card) != "card" || !get.event("cards").includes(card)) {
									return false;
								}
								return lib.filter.filterCard.apply(this, arguments);
							}, "炎谋：选择使用其中的一张【火攻】或火【杀】")
							.set("cards", cards)
							.set("filterTarget", function (card, player, target) {
								return lib.filter.filterTarget.apply(this, arguments);
							})
							.set("targetRequired", true)
							.set("complexSelect", true)
							.set("forced", true)
							.set("addCount", false);
					}
				},
			},
		},
	},
	pszhanyan: {
		enable: "phaseUse",
		filter(event, player) {
			return game.hasPlayer(target => player.inRange(target));
		},
		usable: 1,
		filterTarget(card, player, target) {
			return player.inRange(target);
		},
		selectTarget: -1,
		multitarget: true,
		multiline: true,
		delay: 0,
		async content(event, trigger, player) {
			const targets = event.targets.sortBySeat();
			let damages = 0,
				puts = 0;
			player.line(targets);
			await game.delay();
			for (const target of targets) {
				let dialog = ["绽焰：将手牌中或弃牌堆中的一张【火攻】或火【杀】置于牌堆顶，或受到1点火焰伤害"];
				const Tcards = target.getCards("h", card => {
					return get.name(card) == "huogong" || (get.name(card) == "sha" && game.hasNature(card, "fire"));
				});
				const Pcards = Array.from(ui.discardPile.childNodes).filter(card => {
					return card.name == "huogong" || (card.name == "sha" && game.hasNature(card, "fire"));
				});
				if (Tcards.length) {
					dialog.push('<div class="text center">手牌区</div>');
					dialog.push(Tcards);
				}
				if (Pcards.length) {
					dialog.push('<div class="text center">弃牌堆</div>');
					dialog.push(Pcards);
				}
				let result;
				if (Tcards.length + Pcards.length == 0) {
					result = { bool: false };
				} else {
					result = await target
						.chooseButton(dialog)
						.set("ai", button => {
							const player = get.event("player"),
								source = get.event().getParent().player;
							if (get.damageEffect(source, player, player) <= 0 && get.attitude(player, source) <= 0) {
								return 0;
							}
							if (!get.owner(button.link)) {
								return 114514;
							}
							return 20 - get.value(button.link);
						})
						.forResult();
				}
				if (result.bool) {
					puts++;
					const card = result.links[0];
					target.$throw([card], 1000);
					if (get.owner(card)) {
						await get.owner(card).lose([card], ui.cardPile);
					} else {
						ui.discardPile.removeChild(card);
					}
					ui.cardPile.insertBefore(card, ui.cardPile.firstChild);
					game.updateRoundNumber();
					game.log(target, "将" + get.translation(card) + "置于牌堆顶");
				} else {
					damages++;
					await target.damage(1, "fire");
				}
				await game.delay(0.5);
			}
			const num = Math.min(damages, puts);
			if (num) {
				await player.draw(num);
			}
		},
		ai: {
			order: 9,
			result: { player: 1 },
		},
	},
	psyuhuo: {
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
		mod: {
			cardDiscardable(card, player, name) {
				if (name == "phaseDiscard" && (get.name(card) == "huogong" || (get.name(card) == "sha" && game.hasNature(card, "fire")))) {
					return false;
				}
			},
			ignoredHandcard(card, player) {
				if (get.name(card) == "huogong" || (get.name(card) == "sha" && game.hasNature(card, "fire"))) {
					return true;
				}
			},
		},
	},
	//龙起襄樊
	//龙庞德
	dragtaiguan: {
		enable: "phaseUse",
		usable(skill, player) {
			return Math.max(1, player.getDamagedHp());
		},
		filterCard: true,
		filterTarget(card, player, target) {
			return player.inRange(target) && target.countDiscardableCards("he");
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			const { result } = await target.chooseToDiscard("he", true);
			if (result.cards[0].name != "sha" && player.getHp() <= target.getHp()) {
				await player.chooseUseTarget("juedou", true, [target]);
			}
		},
	},
	//关羽
	//界界关羽
	dragchaojue: {
		trigger: { player: "phaseZhunbeiBegin" },
		frequent: true,
		/*filter(event, player) {
			if (!game.hasPlayer(target => target != player)) return false;
			return player.countCards("h", card => _status.connectMode || lib.filter.cardDiscardable(card, player));
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseToDiscard(get.prompt2(event.skill), "h")
				.set("ai", card => {
					const player = get.event("player");
					if (!game.hasPlayer(target => get.attitude(player, target) < 0)) return 0;
					if (get.suit(card, player) == "diamond") return 8 - get.value(card);
					return 7.5 - get.value(card);
				})
				.set("logSkill", event.skill)
				.forResult();
		},
		popup: false,*/
		async content(event, trigger, player) {
			await player.draw();
			if (!player.countCards("h")) {
				return;
			}
			const result = await player
				.chooseCard("超绝：展示一张手牌", "h", true)
				.set("ai", card => {
					const player = get.event("player");
					if (get.suit(card, player) == "diamond") {
						return 3;
					}
					return 1;
				})
				.forResult();
			if (!result.bool) {
				return;
			}
			await player.showCards(result.cards, `${get.translation(player)}发动了【超绝】`);
			const targets = game.filterPlayer(target => target != player).sortBySeat();
			if (targets.length) {
				const suits = result.cards
					.reduce((list, card) => list.add(get.suit(card, player)), [])
					.sort((a, b) => {
						return lib.suit.indexOf(b) - lib.suit.indexOf(a);
					});
				player.line(targets);
				for (const i of targets) {
					i.addTempSkill("dragchaojue_buff");
					i.markAuto("dragchaojue_buff", suits);
				}
				for (const target of targets) {
					const {
						result: { bool },
					} = await target
						.chooseToGive(
							player,
							(card, player) => {
								return get.event("suits").includes(get.suit(card));
							},
							"h",
							"give"
						)
						.set("suits", suits)
						.set("ai", card => {
							const player = get.event("player"),
								target = get.event().getParent().player;
							const att = get.attitude(player, target);
							if (att > 0) {
								return 7.5 - get.value(card);
							}
							if (att > -1) {
								return 0;
							}
							if (
								att < 0 &&
								get.attitude(target, player) < 0 &&
								player.getSkills(null, false, false).some(skill => {
									if (get.is.locked(skill, player)) {
										return false;
									}
									const info = get.info(skill);
									return info && info.ai && (info.ai.maixie || info.ai.maixie_hp || info.ai.maixie_defend);
								}) &&
								player.getHp() <= 2
							) {
								return 7.5 - get.value(card);
							}
							return 0;
						})
						.set("prompt", "超绝：交给" + get.translation(player) + "一张" + get.translation(suits) + "手牌，或本回合非锁定技失效");
					if (!bool) {
						target.addTempSkill("fengyin");
					}
				}
			}
		},
		subSkill: {
			buff: {
				onremove: true,
				charlotte: true,
				mod: {
					cardEnabled2(card, player) {
						if (player.getStorage("dragchaojue_buff").includes(get.suit(card))) {
							return false;
						}
					},
				},
				marktext: "绝",
				intro: { content: "本回合内不能使用或打出$牌" },
			},
		},
	},
	dragjunshen: {
		mod: {
			targetInRange(card, player) {
				if (get.suit(card) == "diamond" && card.name == "sha") {
					return true;
				}
			},
		},
		locked: false,
		enable: ["chooseToUse", "chooseToRespond"],
		filterCard(card, player) {
			return get.color(card) == "red";
		},
		viewAsFilter(player) {
			return player.countCards("hes", { color: "red" });
		},
		position: "hes",
		viewAs: { name: "sha" },
		prompt: "将一张红色牌当作【杀】使用或打出",
		check(card) {
			const val = get.value(card);
			if (_status.event.name == "chooseToRespond") {
				return 1 / Math.max(0.1, val);
			}
			return 5 - val;
		},
		ai: {
			order(item, player) {
				if (!player || !_status.event.type || _status.event.type != "phase") {
					return 0.1;
				}
				return get.order({ name: "sha" }, player) + 0.3;
			},
			respondSha: true,
			skillTagFilter(player) {
				if (!player.countCards("hes", { color: "red" })) {
					return false;
				}
			},
		},
		group: ["dragjunshen_add", "dragjunshen_damage"],
		subSkill: {
			add: {
				trigger: { player: "useCard2" },
				filter(event, player) {
					if (event.card.name != "sha" || get.suit(event.card) != "heart") {
						return false;
					}
					return game.hasPlayer(target => {
						return target != player && !event.targets.includes(target) && lib.filter.targetEnabled2(event.card, player, target) && lib.filter.targetInRange(event.card, player, target);
					});
				},
				async cost(event, trigger, player) {
					event.result = await player
						.chooseTarget(get.prompt(event.skill), "为" + get.translation(trigger.card) + "额外指定一个目标", (card, player, target) => {
							const evt = get.event().getTrigger();
							return target != player && !evt.targets.includes(target) && lib.filter.targetEnabled2(evt.card, player, target) && lib.filter.targetInRange(evt.card, player, target);
						})
						.set("ai", target => get.effect(target, _status.event.getTrigger().card, _status.event.player))
						.forResult();
				},
				content() {
					trigger.targets.addArray(event.targets);
				},
			},
			damage: {
				trigger: { source: "damageBegin1" },
				filter(event, player) {
					const evt = event.getParent(2);
					return evt.name == "useCard" && evt.skill == "dragjunshen";
				},
				logTarget: "player",
				prompt2(event, player) {
					let prompt = "弃置其一张手牌，或令此伤害+1";
					if (!event.player.countDiscardableCards(event.player, "e")) {
						return prompt;
					}
					return `令${get.translation(event.player)}弃置装备区所有牌，然后你选择等量次：${prompt}`;
				},
				async content(event, trigger, player) {
					const target = trigger.player;
					await target.discard(target.getDiscardableCards(target, "e"));
					const num = Math.max(
						1,
						target
							.getHistory("lose", evt => {
								return evt.type == "discard" && evt.getParent(2) == event;
							})
							.reduce((sum, evt) => (sum += evt.getl(target)?.cards2?.length), 0)
					);
					let count = 0;
					while (count < num) {
						count++;
						let result;
						if (!target.countDiscardableCards(player, "h")) {
							result = { index: 1 };
						} else {
							result = await player
								.chooseControl()
								.set("choiceList", [`弃置${get.translation(target)}一张手牌`, "令此伤害+1"])
								.set("ai", () => {
									const player = get.event("player"),
										trigger = get.event().getTrigger();
									const eff1 = get.effect(trigger.player, { name: "guohe_copy2" }, player, player),
										eff2 = get.damageEffect(trigger.player, player, player);
									if (eff1 > eff2) {
										return 0;
									}
									return 1;
								})
								.forResult();
						}
						if (result.index == 0) {
							await player.discardPlayerCard(target, "h", true);
						} else {
							trigger.increase("num");
						}
					}
				},
			},
		},
	},
	//龙曹仁
	draglizhong: {
		trigger: { player: "phaseJieshuBegin" },
		async cost(event, trigger, player) {
			let choiceList = ["将任意张装备牌至于任意名角色的装备区", "令你或任意名装备区里有牌的角色摸一张牌"],
				choices = ["置入装备", "团体摸牌", "cancel2"];
			if (
				!player.countCards("he", card => {
					if (get.type(card) != "equip") {
						return false;
					}
					return game.hasPlayer(target => {
						return target.canEquip(card);
					});
				})
			) {
				choices.shift();
				choiceList[0] = '<span style="opacity:0.5">' + choiceList[0] + "</span>";
			}
			const {
				result: { control },
			} = await player
				.chooseControl(choices)
				.set("prompt", "###" + get.prompt(event.skill) + "###选择首先执行的一项")
				.set("choiceList", choiceList)
				.set("ai", () => {
					return get.event("controls")[0];
				});
			event.result = { bool: control != "cancel2", cost_data: control };
		},
		async content(event, trigger, player) {
			let choices = ["置入装备", "团体摸牌"],
				used = false;
			if (event.cost_data == "团体摸牌") {
				choices.reverse();
			}
			choices.push(event.cost_data);
			for (let i = 1; i <= 3; i++) {
				if (i == 3 && used) {
					break;
				}
				switch (choices[i - 1]) {
					case "置入装备": {
						while (
							player.hasCard(card => {
								if (get.type(card) != "equip") {
									return false;
								}
								return game.hasPlayer(target => {
									return target.canEquip(card);
								});
							}, "he")
						) {
							const {
								result: { bool, cards, targets },
							} = await player.chooseCardTarget({
								prompt: "厉战：将一张装备牌置于一名角色的装备区",
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
									const player = get.event("player");
									const att = get.attitude(player, target);
									if (att <= 0 || target.countCards("e")) {
										return 0;
									}
									return att * (target == player ? 1 : 3);
								},
							});
							if (bool) {
								if (i == 1 && !used) {
									used = true;
								}
								const card = cards[0],
									target = targets[0];
								player.line(target);
								if (target != player) {
									player.$give(card, target, false);
								}
								await game.delay(0.5);
								await target.equip(card);
							} else {
								break;
							}
						}
						break;
					}
					case "团体摸牌": {
						const { result } = await player
							.chooseTarget(
								"厉战：令你或任意名装备区有牌的角色摸一张牌",
								(card, player, target) => {
									if (target != player && !target.countCards("e")) {
										return false;
									}
									if (ui.selected.targets.length) {
										const choose = ui.selected.targets[0];
										if (choose == player && !player.countCards("e")) {
											return false;
										}
									}
									return true;
								},
								[1, Infinity]
							)
							.set("multitarget", true)
							.set("complexTarget", true)
							.set("ai", target => {
								const player = get.event("player");
								if (!player.countCards("e")) {
									if (
										game.countPlayer(choose => {
											return choose.countCards("e") && get.attitude(player, choose) > 0;
										}) > 1 &&
										target == player
									) {
										return 0;
									}
								}
								return get.attitude(player, target);
							});
						if (result.bool) {
							if (i == 1 && !used) {
								used = true;
							}
							const targets = result.targets.sortBySeat();
							player.line(targets);
							choices.addArray(targets);
							for (let j = 0; j < targets.length; j++) {
								await targets[j].draw("nodelay");
							}
							await game.delayx();
						}
						break;
					}
				}
			}
			choices = choices.slice(3);
			if (choices.length) {
				choices.sortBySeat();
				player.line(choices);
				for (const target of choices) {
					target.addTempSkill("draglizhong_effect", "roundStart");
				}
				await game.delayx();
			}
		},
		subSkill: {
			effect: {
				charlotte: true,
				mod: {
					maxHandcard(player, num) {
						return num + 2;
					},
				},
				enable: "chooseToUse",
				filterCard: true,
				position: "e",
				viewAs: { name: "wuxie" },
				filter(event, player) {
					return player.countCards("e") > 0;
				},
				viewAsFilter(player) {
					return player.countCards("e") > 0;
				},
				prompt: "将一张装备区的牌当作【无懈可击】使用",
				check(card) {
					return 8 - get.equipValue(card);
				},
				mark: true,
				marktext: "守",
				intro: { content: "手牌上限+2，可将装备区的牌当作【无懈可击】使用" },
			},
		},
	},
	//撅碎（难视
	dragjuesui: {
		trigger: { global: "dying" },
		filter(event, player) {
			return !player.getStorage("dragjuesui").includes(event.player) && event.player.hasEnabledSlot();
		},
		check(event, player) {
			const target = event.player;
			if (get.attitude(player, target) <= 0) {
				return false;
			}
			return player.countCards("hs", card => player.canSaveCard(card, target)) + target.countCards("hs", card => target.canSaveCard(card, target)) < 1 - target.hp;
		},
		logTarget: "player",
		async content(event, trigger, player) {
			const target = trigger.player;
			player.markAuto("dragjuesui", [target]);
			const {
				result: { bool },
			} = await target.chooseBool("是否将体力值回复至1点并废除装备栏？");
			if (bool) {
				await target.recoverTo(1);
				let disables = [];
				for (let i = 1; i <= 5; i++) {
					for (let j = 0; j < target.countEnabledSlot(i); j++) {
						disables.push(i);
					}
				}
				if (disables.length) {
					await target.disableEquip(disables);
				}
				target.addSkill("dragjuesui_wusheng");
			} else {
				target.chat("拒绝！");
			}
		},
		init(player) {
			if (player.getStorage("dragjuesui").length) {
				player.markSkill("dragjuesui");
			}
		},
		intro: { content: "已对$发动过此技能" },
		subSkill: {
			wusheng: {
				charlotte: true,
				mark: true,
				marktext: "碎",
				intro: { content: "殊死一搏！可将黑色非基本牌当作无次数限制的【杀】使用" },
				mod: {
					cardUsable(card, player, num) {
						if (card.storage && card.storage.dragjuesui) {
							return Infinity;
						}
					},
				},
				enable: ["chooseToUse", "chooseToRespond"],
				filterCard(card, player) {
					return get.color(card) == "black" && get.type(card) != "basic";
				},
				position: "hse",
				viewAs: { name: "sha", storage: { dragjuesui: true } },
				viewAsFilter(player) {
					if (
						!player.countCards("hes", card => {
							return get.color(card) == "black" && get.type(card) != "basic";
						})
					) {
						return false;
					}
				},
				prompt: "将一张黑色非基本牌当作无次数限制的【杀】使用或打出",
				check(card) {
					return 7 - get.value(card);
				},
				ai: {
					order(item, player) {
						if (!player || !_status.event.type || _status.event.type != "phase") {
							return 0.1;
						}
						return get.order({ name: "sha" }, player) * 0.99;
					},
					respondSha: true,
					skillTagFilter(player) {
						if (
							!player.countCards("hes", card => {
								return get.color(card) == "black" && get.type(card) != "basic";
							})
						) {
							return false;
						}
					},
				},
			},
		},
	},
	//吕常×SP淳于琼√
	dragjuwu: {
		trigger: { target: "shaBefore" },
		filter(event, player) {
			return !game.hasNature(event.card) && game.countPlayer(target => event.player.inRange(target)) >= 3;
		},
		forced: true,
		content() {
			trigger.cancel();
		},
		ai: {
			effect: {
				target_use(card, player, target) {
					if (card.name == "sha" && !game.hasNature(card) && game.countPlayer(targetx => player.inRange(targetx)) >= 3) {
						return "zerotarget";
					}
				},
			},
		},
	},
	dragshouxiang: {
		trigger: { player: "phaseDrawBegin2" },
		filter(event, player) {
			if (!game.hasPlayer(target => target.inRange(player))) {
				return false;
			}
			return !event.numFixed;
		},
		frequent: true,
		async content(event, trigger, player) {
			const num = Math.min(
				3,
				game.countPlayer(target => target.inRange(player))
			);
			trigger.num += num;
			const result = await player
				.chooseTarget(`守襄：选择至多${num}名角色`, true, [1, num])
				.set("ai", target => {
					const player = get.player();
					return get.attitude(player, target);
				})
				.forResult();
			if (result.bool) {
				player.line(result.targets, "green");
				for (const target of result.targets.sortBySeat(_status.currentPhase)) {
					player
						.when({
							player: "phaseDrawEnd",
						})
						.filter(evt => evt == trigger)
						.step(async (event, trigger, player) => {
							const bool1 = player.countCards("h") && player != target,
								bool2 = player.countCards("hes", card => {
									if (get.name(card, player) != "sha") {
										return false;
									}
									const tao = get.autoViewAs({ name: "tao" }, [card]);
									if (!lib.filter.cardEnabled(tao, player, "forceEnable")) {
										return false;
									}
									return lib.filter.targetEnabled2(tao, player, target);
								});
							let result = bool1 ? (bool2 ? 2 : 0) : bool2 ? 1 : -1;
							if (result == -1) {
								return;
							}
							if (result == 2) {
								const result2 = await player
									.chooseControl()
									.set("choiceList", [`交给${get.translation(target)}一张牌`, `将一张【杀】当作【桃】对${get.translation(target)}使用`])
									.set("eff", get.effect(target, { name: "tao" }, player, player))
									.set("ai", () => {
										if (get.event("eff") > 0) {
											return 1;
										}
										return 0;
									})
									.forResult();
								result = result2.index;
							}
							if (result == 1) {
								const result2 = await player
									.chooseCard({
										prompt: `将一张【杀】当作【桃】对${get.translation(target)}使用`,
										position: "hes",
										filterCard(card) {
											if (get.name(card, get.player()) != "sha") {
												return false;
											}
											const tao = get.autoViewAs({ name: "tao" }, [card]),
												target = get.event("target");
											if (!lib.filter.cardEnabled(tao, player, "forceEnable")) {
												return false;
											}
											return lib.filter.targetEnabled2(tao, player, target);
										},
										forced: true,
										ai(card) {
											return 7 - get.value(card);
										},
										target: target,
									})
									.forResult();
								if (result2.bool) {
									await player.useCard(get.autoViewAs({ name: "tao" }, result2.cards), result2.cards, [target]);
								}
							} else {
								await player.chooseToGive("h", true, target);
							}
						})
						.vars({
							target: target,
						});
				}
			}
		},
		subSkill: {
			effect: {
				charlotte: true,
				trigger: { player: "phaseDiscardBegin" },
				filter(event, player) {
					return game.hasPlayer(target => target.inRange(player));
				},
				forced: true,
				async content(event, trigger, player) {
					const num = Math.min(
						5,
						game.countPlayer(target => target.inRange(player))
					);
					if (num) {
						if (_status.connectMode) {
							game.broadcastAll(() => (_status.noclearcountdown = true));
						}
						let list = [];
						while (
							num - list.length > 0 &&
							player.hasCard(card => {
								return !list.some(list => list[1] == card);
							}, "h") &&
							game.hasPlayer(target => {
								return target != player && !list.some(list => list[0] == target);
							})
						) {
							const {
								result: { bool, targets, cards },
							} = await player
								.chooseCardTarget({
									prompt: "守襄：你可以交给任意名角色各一张手牌",
									prompt2: "（还可分配" + (num - list.length) + "张）",
									position: "h",
									animate: false,
									filterCard(card, player) {
										return !get.event("list").some(list => list[1] == card);
									},
									filterTarget(card, player, target) {
										return target != player && !get.event("list").some(list => list[0] == target);
									},
									ai1(card) {
										if (card.name == "shan") {
											return 1;
										}
										return Math.random();
									},
									ai2(target) {
										return get.attitude(get.event("player"), target);
									},
								})
								.set("list", list);
							if (bool) {
								list.push([targets[0], cards[0]]);
								player.addGaintag(cards, "olsujian_given");
							} else {
								break;
							}
						}
						if (_status.connectMode) {
							game.broadcastAll(() => {
								delete _status.noclearcountdown;
								game.stopCountChoose();
							});
						}
						if (list.length) {
							await game
								.loseAsync({
									gain_list: list,
									player: player,
									cards: list.slice().flatMap(list => list[1]),
									giver: player,
									animate: "giveAuto",
								})
								.setContent("gaincardMultiple");
						}
					}
				},
			},
		},
	},
	//天书乱斗虚拟偶像线下化
	//小杀
	vtbguisha: {
		audio: 1,
		trigger: { global: "useCard" },
		direct: true,
		filter(event, player) {
			return event.player != player && event.card.name == "sha" && player.countCards("he") > 0 && event.player.isPhaseUsing();
		},
		content() {
			"step 0";
			var go = false,
				d1 = false;
			if (get.attitude(player, trigger.player) > 0) {
				for (var target of trigger.targets) {
					if (
						!target.mayHaveShan(player, "use") ||
						trigger.player.hasSkillTag(
							"directHit_ai",
							true,
							{
								target: target,
								card: trigger.card,
							},
							true
						)
					) {
						if (
							get.attitude(player, target) < 0 &&
							!trigger.player.hasSkillTag("jueqing", false, target) &&
							!target.hasSkillTag("filterDamage", null, {
								player: trigger.player,
								card: trigger.card,
							})
						) {
							d1 = true;
							break;
						}
					}
				}
				if (trigger.addCount === false || !trigger.player.isPhaseUsing()) {
					go = false;
				} else if (!trigger.player.hasSkill("paoxiao") && !trigger.player.hasSkill("tanlin3") && !trigger.player.hasSkill("zhaxiang2") && !trigger.player.hasSkill("fengnu") && !trigger.player.getEquip("zhuge")) {
					var nh = trigger.player.countCards("h");
					if (player == trigger.player) {
						go = player.countCards("h", "sha") > 0;
					} else if (nh >= 4) {
						go = true;
					} else if (player.countCards("h", "sha")) {
						if (nh == 3) {
							go = Math.random() < 0.8;
						} else if (nh == 2) {
							go = Math.random() < 0.5;
						}
					} else if (nh >= 3) {
						if (nh == 3) {
							go = Math.random() < 0.5;
						} else if (nh == 2) {
							go = Math.random() < 0.2;
						}
					}
				}
			}
			go = go * Math.random() + d1 * Math.random() > 0.4;
			//AI停顿
			if (
				go &&
				!event.isMine() &&
				!event.isOnline() &&
				player.hasCard(function (card) {
					return get.value(card) < 6 && lib.filter.cardDiscardable(card, player, event.name);
				}, "he")
			) {
				game.delayx();
			}
			var next = player.chooseToDiscard(get.prompt("vtbguisha"), "弃置一张牌，令" + get.translation(trigger.player) + "本次使用的【杀】不计入使用次数，且对" + get.translation(trigger.targets) + "造成的伤害+1", "he");
			next.logSkill = ["vtbguisha", trigger.player];
			next.set("ai", function (card) {
				if (_status.event.go) {
					return 6 - get.value(card);
				}
				return 0;
			});
			next.set("go", go);
			"step 1";
			if (result.bool) {
				if (trigger.addCount !== false) {
					trigger.addCount = false;
					trigger.player.getStat().card.sha--;
				}
				trigger.player.addTempSkill("vtbguisha_bonus");
				if (!trigger.card.storage) {
					trigger.card.storage = {};
				}
				trigger.card.storage.vtbguisha_targets = trigger.targets;
			}
		},
		ai: {
			expose: 0.2,
		},
		subSkill: {
			bonus: {
				trigger: {
					source: "damageBegin1",
				},
				forced: true,
				charlotte: true,
				onremove: true,
				filter(event, player) {
					return event.card && event.card.name == "sha" && event.card.storage && event.card.storage.vtbguisha_targets && event.card.storage.vtbguisha_targets.includes(event.player);
				},
				content() {
					trigger.num++;
				},
			},
		},
	},
	vtbshuli: {
		audio: 1,
		trigger: {
			global: "damageSource",
		},
		usable: 2,
		filter(event, player) {
			return event.source && event.source != player && event.card && event.card.name == "sha" && event.source.isIn();
		},
		logTarget: "source",
		check(event, player) {
			return get.attitude(player, event.source) >= 0 || (get.attitude(player, event.source) >= -4 && get.distance(_status.currentPhase, player, "absolute") > get.distance(_status.currentPhase, event.source, "absolute"));
		},
		content() {
			"step 0";
			var drawers = [trigger.source, player].sortBySeat(_status.currentPhase);
			game.asyncDraw(drawers);
		},
	},
	//小闪
	vtbshanwu: {
		audio: 1,
		trigger: {
			global: "useCardToTarget",
		},
		filter(event, player) {
			return (
				event.card.name == "sha" &&
				event.target != player &&
				event.isFirstTarget &&
				player.hasCard(card => {
					return get.name(card) == "shan" || _status.connectMode;
				})
			);
		},
		direct: true,
		content() {
			"step 0";
			player
				.chooseToDiscard(get.prompt("vtbshanwu"), "弃置一张【闪】，取消此【杀】对" + get.translation(trigger.targets) + "的目标", { name: "shan" })
				.set("logSkill", "vtbshanwu")
				.set("ai", card => {
					if (_status.event.goon) {
						return 6 - get.value(card);
					}
					return 0;
				})
				.set(
					"goon",
					(function () {
						var effect = 0;
						for (var target of trigger.targets) {
							var eff = get.effect(target, trigger.card, trigger.player, player);
							if (
								!target.mayHaveShan(player, "use") ||
								trigger.player.hasSkillTag(
									"directHit_ai",
									true,
									{
										target: target,
										card: trigger.card,
									},
									true
								)
							) {
								eff *= 1.25;
							}
							if (target.hp <= 2) {
								eff *= 1.1;
							}
							effect += eff;
						}
						return effect < 0;
					})()
				);
			"step 1";
			if (result.bool) {
				game.log(player, "取消了", trigger.card, "的所有目标");
				trigger.targets.length = 0;
				trigger.getParent().triggeredTargets2.length = 0;
				trigger.untrigger();
			}
		},
		ai: {
			expose: 0.2,
		},
	},
	vtbxianli: {
		audio: 1,
		trigger: {
			player: "loseAfter",
			global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"],
		},
		usable: 2,
		filter(event, player) {
			if (!_status.currentPhase || !_status.currentPhase.isIn() || !_status.currentPhase.countGainableCards(player, "he")) {
				return false;
			}
			var evt = event.getl(player);
			return (
				evt &&
				evt.cards2 &&
				evt.cards2.some(card => {
					return get.name(card, false) == "shan";
				})
			);
		},
		check(event, player) {
			return get.effect(_status.currentPhase, { name: "shunshou_copy2" }, player, player) > 0;
		},
		prompt2(event, player) {
			return "获得" + get.translation(_status.currentPhase) + "的一张牌";
		},
		logTarget: () => _status.currentPhase,
		content() {
			"step 0";
			player.gainPlayerCard(_status.currentPhase, "he", true);
		},
		ai: {
			expose: 0.15,
		},
	},
	//小桃
	vtbtaoyan: {
		audio: 1,
		trigger: {
			player: "phaseBegin",
		},
		direct: true,
		content() {
			"step 0";
			if (!_status.vtbtaoyan_count) {
				_status.vtbtaoyan_count = 6;
			}
			player.chooseTarget(get.prompt("vtbtaoyan"), "令一或两名其他角色摸一张牌并从游戏外获得一张【桃】指示物", lib.filter.notMe, [1, 2]).set("ai", target => {
				var player = _status.event.player;
				return get.recoverEffect(target, player, player) / 2 + get.attitude(player, target);
			});
			"step 1";
			if (result.bool) {
				var targets = result.targets.slice();
				targets.sortBySeat();
				player.logSkill("vtbtaoyan", targets);
				game.broadcastAll(function () {
					if (!lib.inpile.includes("tao")) {
						lib.inpile.add("tao");
					}
				});
				player.addSkill("vtbtaoyan_remove");
				for (var target of targets) {
					target.draw();
					if (!_status.vtbtaoyan_count) {
						continue;
					}
					if (!_status.vtbtaoyan_cards) {
						_status.vtbtaoyan_cards = [];
					}
					_status.vtbtaoyan_count--;
					var card = game.createCard("tao");
					_status.vtbtaoyan_cards.push(card.cardid);
					target.gain(card, "gain2");
				}
			}
		},
		ai: {
			expose: 0.3,
			threaten: 3.2,
		},
		subSkill: {
			remove: {
				trigger: {
					global: ["loseAfter", "loseAsyncAfter", "cardsDiscardAfter", "equipAfter"],
				},
				forced: true,
				charlotte: true,
				popup: false,
				firstDo: true,
				forceDie: true,
				filter(event, player) {
					if (typeof _status.vtbtaoyan_count != "number") {
						return false;
					}
					var cards = event.getd();
					return cards.some(card => {
						return _status.vtbtaoyan_cards.includes(card.cardid);
					});
				},
				content() {
					var cards = trigger.getd(),
						remove = [];
					for (var card of cards) {
						if (_status.vtbtaoyan_cards.includes(card.cardid)) {
							_status.vtbtaoyan_cards.remove(card.cardid);
							remove.push(card);
						}
					}
					if (remove.length) {
						remove.forEach(i => {
							i.remove();
							_status.vtbtaoyan_count++;
						});
						game.log(remove, "被移出了游戏");
					}
				},
			},
		},
	},
	vtbyanli: {
		audio: 1,
		trigger: {
			global: "dying",
		},
		filter(event, player) {
			if (player.hasSkill("vtbyanli_used")) {
				return false;
			}
			if (_status.currentPhase == player) {
				return false;
			}
			return event.player.hp <= 0;
		},
		check(event, player) {
			return get.recoverEffect(event.player, player, player) > 0;
		},
		logTarget: "player",
		content() {
			"step 0";
			player.addTempSkill("vtbyanli_used", "roundStart");
			trigger.player.recover(1 - trigger.player.hp);
			trigger.player.draw();
		},
		subSkill: {
			used: {
				charlotte: true,
			},
		},
	},
	//小乐
	vtbleyu: {
		audio: 1,
		trigger: {
			global: "phaseBegin",
		},
		direct: true,
		filter(event, player) {
			return player.countCards("he") >= 3;
		},
		content() {
			"step 0";
			player
				.chooseToDiscard(get.prompt2("vtbleyu", trigger.player), 3, "he")
				.set("ai", card => {
					if (ui.selected.cards.length == 2) {
						return 10 - get.value(card);
					}
					if (_status.event.effect > 0) {
						return 6 - get.value(card);
					}
					return 0;
				})
				.set("effect", trigger.player.hasJudge("lebu") ? 0 : get.effect(trigger.player, { name: "lebu" }, player, player))
				.set("logSkill", ["vtbleyu", trigger.player]);
			"step 1";
			if (result.bool) {
				trigger.player.judge(lib.card.lebu.judge).judge2 = lib.card.lebu.judge2;
			} else {
				event.finish();
			}
			"step 2";
			if (!result.bool) {
				trigger.player.skip("phaseUse");
			}
		},
		ai: {
			expose: 0.3,
			threaten: 2.9,
		},
	},
	vtbyuanli: {
		audio: 1,
		trigger: { global: ["phaseUseSkipped", "phaseUseCancelled"] },
		direct: true,
		content() {
			"step 0";
			player.chooseTarget(get.prompt2("vtbyuanli"), lib.filter.notMe).set("ai", target => get.attitude(_status.event.player, target) + 1);
			"step 1";
			if (result.bool) {
				player.logSkill("vtbyuanli", result.targets[0]);
				game.asyncDraw([player, result.targets[0]].sortBySeat(_status.currentPhase));
			}
		},
		ai: {
			expose: 0.1,
		},
	},
	vtbmeiniang: {
		audio: 1,
		trigger: { global: "phaseUseBegin" },
		filter(event, player) {
			return event.player != player;
		},
		check(event, player) {
			return get.attitude(player, event.player) > 0 && event.player.getUseValue("jiu") >= 0;
		},
		logTarget: "player",
		content() {
			trigger.player.chooseUseTarget("jiu", true, false);
		},
	},
	vtbyaoli: {
		audio: 1,
		trigger: { global: "useCardAfter" },
		filter(event, player) {
			return event.card.name == "jiu" && event.player != player && event.player.isPhaseUsing();
		},
		logTarget: "player",
		check(event, player) {
			return get.attitude(player, event.player) > 0;
		},
		async content(event, trigger, player) {
			trigger.player.addTempSkill(event.name + "_effect");
			trigger.player.addMark(event.name + "_effect", 1, false);
		},
		ai: { expose: 0.15 },
		subSkill: {
			effect: {
				audio: "vtbyaoli",
				charlotte: true,
				trigger: { player: "useCard2" },
				forced: true,
				onremove: true,
				direct: true,
				filter(event, player) {
					return event.card.name == "sha" && player.countMark("vtbyaoli_effect") > 0;
				},
				async content(event, trigger, player) {
					trigger.directHit.addArray(game.filterPlayer());
					const num = player.countMark(event.name);
					player.removeSkill(event.name);
					const targets = game.filterPlayer(current => !trigger.targets.includes(current) && lib.filter.targetEnabled2(trigger.card, player, current));
					if (!targets.length) {
						return;
					}
					const { result } = await player
						.chooseTarget("媱丽：是否为" + get.translation(trigger.card) + "额外指定" + (num > 1 ? "至多" : "") + get.cnNumber(num) + "个目标？", num == 1 ? 1 : [1, num], (card, player, target) => {
							return !get.event("sourcex").includes(target) && player.canUse(get.event("card"), target);
						})
						.set("sourcex", trigger.targets)
						.set("ai", target => {
							const { player, card } = get.event();
							return get.effect(target, card, player, player);
						})
						.set("card", trigger.card);
					if (!result.targets?.length) {
						return;
					}
					if (!event.isMine() && !event.isOnline()) {
						await game.delayx();
					}
					player.logSkill(event.name, result.targets);
					trigger.targets.addArray(result.targets);
				},
				marktext: "媱",
				intro: { content: "下一张【杀】不可被响应且可以额外指定&个目标" },
				ai: {
					directHit_ai: true,
					skillTagFilter(player, tag, arg) {
						return arg?.card?.name === "sha";
					},
				},
			},
		},
	},
	//官盗S特015神马超
	psshouli: {
		audio: "shouli",
		enable: ["chooseToUse", "chooseToRespond"],
		hiddenCard(player, name) {
			if (player != _status.currentPhase && (name == "sha" || name == "shan")) {
				return true;
			}
		},
		filter(event, player) {
			if (event.responded || event.psshouli || event.type == "wuxie") {
				return false;
			}
			if (
				game.hasPlayer(function (current) {
					return current.getEquips(4).length > 0;
				}) &&
				event.filterCard(
					get.autoViewAs(
						{
							name: "sha",
							storage: { psshouli: true },
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
					return current.getEquips(3).length > 0;
				}) &&
				event.filterCard(
					get.autoViewAs(
						{
							name: "shan",
							storage: { psshouli: true },
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
		locked: true,
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
								storage: { psshouli: true },
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
						storage: { psshouli: true },
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
			evt.set("psshouli", true);
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
								storage: { psshouli: true },
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
								storage: { psshouli: true },
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
							lib.skill.psshouli_backup.viewAs = {
								name: name,
								cards: [result],
								storage: { psshouli: true },
							};
							lib.skill.psshouli_backup.prompt = "选择" + get.translation(name) + "（" + get.translation(result) + "）的目标";
						},
						result.links[0],
						name
					);
					evt.set("_backupevent", "psshouli_backup");
					evt.backup("psshouli_backup");
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
							storage: { psshouli: true },
						},
						result.links
					);
					evt.result.cards = [result.links[0]];
					target.$give(result.links[0], player, false);
					if (player != target) {
						target.addTempSkill("fengyin");
					}
					target.addTempSkill("psshouli_thunder");
					player.addTempSkill("psshouli_thunder");
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
		group: "psshouli_init",
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
				audio: "psshouli",
				trigger: {
					global: "phaseBefore",
					player: "enterGame",
				},
				forced: true,
				filter(event, player) {
					return event.name != "phase" || game.phaseNumber == 0;
				},
				logTarget: () => game.filterPlayer(),
				equips: [
					["heart", 5, "chitu"],
					["diamond", 13, "zixin"],
					["spade", 5, "jueying"],
					["diamond", 13, "hualiu"],
					["club", 5, "dilu"],
					["spade", 13, "dawan"],
					["heart", 13, "zhuahuang"],
					["heart", 3, "jingfanma"],
				],
				content() {
					"step 0";
					event.targets = game.filterPlayer().sortBySeat(_status.firstAct2 || game.zhong || game.zhu || _status.firstAct || player);
					event.target = event.targets.shift();
					game.delayx();
					"step 1";
					player.line(target, "green");
					target
						.chooseToUse("狩骊：使用一张坐骑牌并摸一张牌，或使用一张坐骑牌指示物", function (card, player, event) {
							if (get.subtype(card) != "equip3" && get.subtype(card) != "equip4" && get.subtype(card) != "equip6") {
								return false;
							}
							return lib.filter.filterCard.apply(this, arguments);
						})
						.set("ai", () => 1);
					"step 2";
					if (result.bool) {
						target.draw();
					} else {
						var cardx = lib.skill.psshouli_init.equips.randomRemove();
						if (!cardx) {
							return;
						}
						cardx = {
							suit: cardx[0],
							number: cardx[1],
							name: cardx[2],
						};
						var card = game.createCard(cardx);
						if (!_status.psshouli_equips) {
							_status.psshouli_equips = [];
						}
						_status.psshouli_equips.push(card.cardid);
						if (card) {
							target.chooseUseTarget(card, true, "nopopup", "noanimate");
							player.addSkill("psshouli_remove");
						}
					}
					"step 3";
					event.target = event.targets.shift();
					if (event.target) {
						event.goto(1);
					}
				},
			},
			remove: {
				trigger: { global: ["loseAfter", "loseAsyncAfter", "cardsDiscardAfter", "equipAfter"] },
				forced: true,
				charlotte: true,
				popup: false,
				firstDo: true,
				forceDie: true,
				filter(event, player) {
					if (!_status.psshouli_equips || !_status.psshouli_equips.length) {
						return false;
					}
					var cards = event.getd();
					return cards.filter(i => _status.psshouli_equips.includes(i.cardid)).length;
				},
				content() {
					var cards = trigger.getd(),
						remove = [];
					for (var card of cards) {
						if (_status.psshouli_equips.includes(card.cardid)) {
							_status.psshouli_equips.remove(card.cardid);
							remove.push(card);
						}
					}
					if (remove.length) {
						game.cardsGotoSpecial(remove);
						lib.skill.psshouli_init.equips.addArray(remove.map(i => [i.suit, i.number, i.name]));
						game.log("坐骑指示物", remove, "被移出了游戏");
					}
				},
			},
			backup: {
				precontent() {
					"step 0";
					event.result._apply_args = { throw: false };
					var cards = event.result.card.cards;
					event.result.cards = cards;
					var owner = get.owner(cards[0]);
					event.target = owner;
					owner.$throw(cards[0]);
					player.popup(event.result.card.name, "metal");
					game.delayx();
					event.getParent().addCount = false;
					"step 1";
					if (player != target) {
						target.addTempSkill("fengyin");
					}
					target.addTempSkill("psshouli_thunder");
					player.addTempSkill("psshouli_thunder");
				},
				filterCard: () => false,
				prompt: "请选择【杀】的目标",
				selectCard: -1,
				log: false,
			},
		},
	},
	pshengwu: {
		audio: "hengwu",
		mod: {
			aiOrder: (player, card, num) => {
				if (num > 0 && get.tag(card, "draw") && ui.cardPile.childNodes.length + ui.discardPile.childNodes.length < 20) {
					return 0;
				}
			},
			aiValue: (player, card, num) => {
				if (num > 0 && card.name === "zhuge") {
					return 20;
				}
			},
			aiUseful: (player, card, num) => {
				if (num > 0 && card.name === "zhuge") {
					return 10;
				}
			},
		},
		trigger: { player: ["useCard", "respond"] },
		direct: true,
		locked: false,
		filter(event, player) {
			return game.hasPlayer(i => i.countCards("ej", cardx => get.type(cardx) == "equip" && get.suit(event.card) == get.suit(cardx)));
		},
		content() {
			"step 0";
			var suit = get.suit(trigger.card),
				extra = game
					.filterPlayer()
					.map(i =>
						i.countCards("ej", cardx => {
							return get.type(cardx) == "equip" && get.suit(trigger.card) == get.suit(cardx);
						})
					)
					.reduce((p, c) => p + c);
			var prompt2 = "弃置任意张" + get.translation(suit) + "手牌，然后摸X张牌（X为你弃置的牌数+" + extra + "）";
			player
				.chooseToDiscard("h", [1, player.countCards("h", { suit: suit })], { suit: suit })
				.set("prompt", get.prompt("pshengwu"))
				.set("prompt2", prompt2)
				.set("ai", card => {
					if (_status.event.tie) {
						return 0;
					}
					let player = _status.event.player;
					if (_status.event.goon) {
						return 12 - get.value(card);
					}
					if (player == _status.currentPhase) {
						if (["shan", "caochuan", "tao", "wuxie"].includes(card.name)) {
							return 8 - get.value(card);
						}
						return 6 - get.value(card);
					}
					return 5.5 - get.value(card);
				})
				.set("goon", player.countCards("h", { suit: suit }) == 1)
				.set("tie", extra > ui.cardPile.childNodes.length + ui.discardPile.childNodes.length)
				.set("logSkill", "pshengwu");
			"step 1";
			if (result.bool) {
				var num = result.cards.length;
				player.draw(
					num +
						game
							.filterPlayer()
							.map(i => i.countCards("ej", cardx => get.type(cardx) == "equip" && get.suit(trigger.card) == get.suit(cardx)))
							.reduce((p, c) => p + c)
				);
			}
		},
		ai: {
			threaten: 100,
			reverseEquip: true,
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
						game.countPlayer(current => {
							return current.countCards("e", card => {
								return get.suit(card, current) == suit;
							});
						}),
					];
				},
				target(card, player, target) {
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
	//战役篇田丰
	gzsuishi: {
		audio: "suishi",
		preHidden: ["gzsuishi2"],
		trigger: { global: "dying" },
		forced: true,
		logAudio: () => 1,
		filter(event, player) {
			return event.player != player && event.parent.name == "damage" && event.parent.source && event.parent.source.group == player.group;
		},
		content() {
			player.draw();
		},
		ai: {
			halfneg: true,
		},
		group: "gzsuishi2",
	},
	gzsuishi2: {
		audio: "suishi",
		trigger: { global: "dieAfter" },
		forced: true,
		sourceSkill: "gzsuishi",
		logAudio: () => 2,
		filter(event, player) {
			return event.player.group == player.group;
		},
		content() {
			player.loseHp();
		},
	},
	//战役篇孔融
	zymingshi: {
		audio: "mingshi",
		forced: true,
		trigger: { target: "useCardToBefore" },
		priority: 15,
		filter(event, player) {
			if (!player.hasEmptySlot(2)) {
				return false;
			}
			if (event.card.name != "sha") {
				return false;
			}
			return game.hasNature(event.card);
		},
		content() {
			trigger.cancel();
		},
		ai: {
			effect: {
				target(card, player, target) {
					if (card.name === "sha" && game.hasNature(card) && target.hasEmptySlot(2)) {
						return "zeroplayertarget";
					}
					if (get.subtype(card) == "equip2" && target.isEmpty(2)) {
						return [0.6, -0.8];
					}
				},
			},
		},
	},
	//战役篇蒋钦
	zyshangyi: {
		audio: "shangyi",
		enable: "phaseUse",
		usable: 1,
		filterTarget(card, player, target) {
			return player != target;
		},
		content() {
			"step 0";
			target.viewHandcards(player);
			"step 1";
			if (!target.countCards("h")) {
				event.finish();
			} else {
				player.chooseCardButton(target, target.getCards("h"));
			}
			"step 2";
			if (result.bool) {
				target.discard(result.links[0]);
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
	//官盗K系列杜预
	pkwuku: {
		audio: "spwuku",
		trigger: { global: "useCard" },
		forced: true,
		preHidden: true,
		filter(event, player) {
			if (get.type(event.card) != "equip") {
				return false;
			}
			return player.countMark("pkwuku") < 3;
		},
		content() {
			player.addMark("pkwuku", 1);
		},
		marktext: "库",
		intro: {
			content: "mark",
		},
		ai: {
			combo: "pkmiewu",
			threaten: 3.6,
		},
	},
	pksanchen: {
		audio: "spsanchen",
		trigger: { player: "phaseJieshuBegin" },
		forced: true,
		juexingji: true,
		skillAnimation: true,
		animationColor: "gray",
		filter(event, player) {
			return player.countMark("pkwuku") > 2;
		},
		content() {
			player.awakenSkill(event.name);
			player.gainMaxHp();
			player.recover();
			player.addSkills("pkmiewu");
		},
		ai: {
			combo: "pkwuku",
		},
		derivation: "pkmiewu",
	},
	pkmiewu: {
		audio: "spmiewu",
		enable: ["chooseToUse", "chooseToRespond"],
		filter(event, player) {
			if (!player.countMark("pkwuku") || player.hasSkill("pkmiewu2")) {
				return false;
			}
			for (var i of lib.inpile) {
				var type = get.type(i);
				if ((type == "basic" || type == "trick") && event.filterCard(get.autoViewAs({ name: i }, "unsure"), player, event)) {
					return true;
				}
			}
			return false;
		},
		chooseButton: {
			dialog(event, player) {
				var list = [];
				for (var i = 0; i < lib.inpile.length; i++) {
					var name = lib.inpile[i];
					if (name == "sha") {
						if (event.filterCard(get.autoViewAs({ name }, "unsure"), player, event)) {
							list.push(["基本", "", "sha"]);
						}
						for (var nature of lib.inpile_nature) {
							if (event.filterCard(get.autoViewAs({ name, nature }, "unsure"), player, event)) {
								list.push(["基本", "", "sha", nature]);
							}
						}
					} else if (get.type(name) == "trick" && event.filterCard(get.autoViewAs({ name }, "unsure"), player, event)) {
						list.push(["锦囊", "", name]);
					} else if (get.type(name) == "basic" && event.filterCard(get.autoViewAs({ name }, "unsure"), player, event)) {
						list.push(["基本", "", name]);
					}
				}
				return ui.create.dialog("灭吴", [list, "vcard"]);
			},
			//これ  要らない（そよりん声线）
			//filter:function(button,player){
			//	return _status.event.getParent().filterCard({name:button.link[2]},player,_status.event.getParent());
			//},
			check(button) {
				if (_status.event.getParent().type != "phase") {
					return 1;
				}
				var player = _status.event.player;
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
					audio: "spmiewu",
					filterCard: () => false,
					selectCard: -1,
					popname: true,
					viewAs: { name: links[0][2], nature: links[0][3] },
					precontent() {
						player.addTempSkill("pkmiewu2");
						player.removeMark("pkwuku", 1);
					},
				};
			},
			prompt(links, player) {
				return "视为使用" + (get.translation(links[0][3]) || "") + get.translation(links[0][2]) + "并摸一张牌";
			},
		},
		hiddenCard(player, name) {
			if (!lib.inpile.includes(name)) {
				return false;
			}
			var type = get.type(name);
			return (type == "basic" || type == "trick") && player.countMark("pkwuku") > 0 && !player.hasSkill("pkmiewu2");
		},
		ai: {
			combo: "pkwuku",
			fireAttack: true,
			respondSha: true,
			respondShan: true,
			skillTagFilter(player) {
				if (!player.countMark("pkwuku") || player.hasSkill("pkmiewu2")) {
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
	},
	pkmiewu2: {
		trigger: { player: ["useCardAfter", "respondAfter"] },
		forced: true,
		charlotte: true,
		popup: false,
		sourceSkill: "pkmiewu",
		filter(event, player) {
			return event.skill == "pkmiewu_backup";
		},
		content() {
			player.draw();
		},
	},
	pkmiewu_backup: { audio: "pkmiewu" },
	//官盗S系列关羽
	pszhonghun: {
		audio: "zhongyi",
		trigger: { player: ["useCard", "respond"] },
		filter(event, player) {
			return get.color(event.card) == "red";
		},
		frequent: true,
		content() {
			"step 0";
			var card = game.cardsGotoOrdering(get.cards()).cards[0];
			event.card = card;
			game.updateRoundNumber();
			player.showCards(card, get.translation(player) + "发动了【忠魂】");
			"step 1";
			if (get.color(card) == "red") {
				player.gain(card, "gain2");
			}
		},
	},
	//官盗S系列郭嘉·一版
	psqizuo: {
		trigger: { global: ["damageBegin1", "damageBegin3"] },
		filter(event, player, name) {
			return (name == "damageBegin1" && event.source && event.source.isIn() && player.inRange(event.source)) || (name == "damageBegin3" && event.player && event.player.isIn() && player.inRange(event.player));
		},
		direct: true,
		content() {
			"step 0";
			var name = event.triggername;
			var source = get.translation(trigger.source),
				target = get.translation(trigger.player),
				num = trigger.num;
			var targetx = trigger[name == "damageBegin1" ? "source" : "player"];
			var str = name == "damageBegin1" ? source + "即将对" + target + "造成" + num + "点伤害" : target + "即将受到" + source + "造成的" + num + "点伤害";
			player
				.chooseToDiscard(get.prompt("psqizuo", targetx), str + "，是否弃置一张牌并判定，若结果颜色与此牌相同，你可以令此伤害+1或-1？", "he")
				.set("ai", card => {
					if (_status.event.goon) {
						return 5.25 - get.value(card) + (get.color(card) == get.color(_status.pileTop) ? 0.75 : 0);
					}
					return 0;
				})
				.set(
					"goon",
					(function () {
						var eff = get.damageEffect(trigger.player, trigger.source, player);
						if (
							eff > 5 &&
							!trigger.player.hasSkillTag("filterDamage", null, {
								player: player,
								card: trigger.card,
							})
						) {
							return true;
						}
						if (eff < -5) {
							return true;
						}
						return false;
					})()
				)
				.set("logSkill", ["psqizuo", targetx]);
			"step 1";
			if (result.bool) {
				event.color = get.color(result.cards[0], player);
				player.judge(function (card) {
					if (get.color(card) == _status.event.getParent("psqizuo").color) {
						return 1;
					}
					return 0;
				});
			} else {
				event.finish();
			}
			"step 2";
			if (result.bool) {
				player
					.chooseControl("+1", "-1", "cancel2")
					.set("prompt", "是否令此伤害+1或-1？")
					.set("ai", () => {
						if (_status.event.eff < 0) {
							return 1;
						}
						return 0;
					})
					.set("eff", get.damageEffect(trigger.player, trigger.source, player));
			} else {
				event.finish();
			}
			"step 3";
			if (result.index == 0) {
				trigger.num++;
				player.popup(" +1 ", "fire");
				game.log(player, "令此伤害+1");
			}
			if (result.index == 1) {
				trigger.num--;
				player.popup(" -1 ", "water");
				game.log(player, "令此伤害-1");
			}
		},
		ai: {
			threaten: 0.8,
		},
	},
	//官盗S系列郭嘉·二版
	psquanmou: {
		trigger: {
			global: "useCardAfter",
		},
		direct: true,
		filter(event, player) {
			return get.type2(event.card) == "trick" && event.player != player && event.targets && event.targets.includes(player) && event.cards.filterInD("odj").length && player.countCards("h");
		},
		content() {
			"step 0";
			player
				.chooseToDiscard(get.prompt("psquanmou"), "弃置一张" + get.translation(get.color(trigger.card)) + "手牌，获得" + get.translation(trigger.cards), "h", (card, player) => {
					return get.color(card) == _status.event.color;
				})
				.set("ai", card => {
					return _status.event.value - get.value(card);
				})
				.set("logSkill", "psquanmou")
				.set("value", get.value(trigger.cards, player))
				.set("color", get.color(trigger.card));
			"step 1";
			if (result.bool) {
				var cards = trigger.cards.filterInD("odj");
				if (cards.filterInD("od").length) {
					player.gain(cards.filterInD("od"), "gain2");
				}
				if (cards.filterInD("j").length) {
					player.gain(cards.filterInD("j"), get.owner(cards.filterInD("j")[0]), "give");
				}
			}
		},
	},
	//官盗S赵云·一版
	pshuiqiang: {
		trigger: { player: ["shaMiss", "eventNeutralized"] },
		direct: true,
		clearTime: true,
		filter(event, player) {
			if (!event.card || event.card.name != "sha") {
				return false;
			}
			return event.target.isIn() && player.canUse("sha", event.target, false) && (player.hasSha() || (_status.connectMode && player.countCards("h")));
		},
		content() {
			"step 0";
			player
				.chooseToUse(
					get.prompt2("pshuiqiang", trigger.target),
					function (card, player, event) {
						if (get.name(card) != "sha") {
							return false;
						}
						return lib.filter.filterCard.apply(this, arguments);
					},
					trigger.target,
					-1
				)
				.set("addCount", false).logSkill = "pshuiqiang";
		},
	},
	pshuntu: {
		trigger: { source: "damageSource" },
		usable: 1,
		filter(event, player) {
			return event.card && event.card.name == "sha" && event.getParent(2).player == player && event.notLink() && player.isPhaseUsing();
		},
		direct: true,
		clearTime: true,
		content() {
			"step 0";
			player
				.chooseToUse(
					get.prompt2("pshuntu", trigger.player),
					function (card, player, event) {
						if (get.name(card) != "sha") {
							return false;
						}
						return lib.filter.filterCard.apply(this, arguments);
					},
					trigger.player,
					-1
				)
				.set("addCount", false).logSkill = "pshuntu";
			"step 1";
			if (!result.bool) {
				player.storage.counttrigger.pshuntu--;
			}
		},
	},
	//官盗S赵云·二版
	psqijin: {
		trigger: { player: "phaseDrawBegin1" },
		filter(event, player) {
			return !event.numFixed;
		},
		content() {
			"step 0";
			trigger.changeToZero();
			event.cards = get.cards(7);
			game.cardsGotoOrdering(event.cards);
			event.videoId = lib.status.videoId++;
			game.broadcastAll(
				function (player, id, cards) {
					var str = "七进";
					if (player == game.me && !_status.auto) {
						str += "：获得一种颜色的所有牌";
					}
					var dialog = ui.create.dialog(str, cards);
					dialog.videoId = id;
				},
				player,
				event.videoId,
				event.cards
			);
			event.time = get.utc();
			game.addVideo("showCards", player, ["七进", get.cardsInfo(event.cards)]);
			game.addVideo("delay", null, 2);
			"step 1";
			var list = [];
			for (var i of cards) {
				list.add(get.color(i, false));
			}
			list.sort();
			var next = player.chooseControl(list);
			next.set("ai", function () {
				return _status.event.choice;
			}).set(
				"choice",
				(function () {
					if (list.length == 0) {
						return list[0];
					}
					var color = list[0];
					var cards1 = cards.filter(i => get.color(i) == color),
						cards2 = cards.filter(i => get.color(i) == list[1]);
					if (get.value(cards1) * cards1.length > get.value(cards2) * cards2.length) {
						return list[0];
					}
					return list[1];
				})()
			);
			"step 2";
			event.color = result.control;
			var time = 1000 - (get.utc() - event.time);
			if (time > 0) {
				game.delay(0, time);
			}
			"step 3";
			game.broadcastAll("closeDialog", event.videoId);
			player.gain(
				cards.filter(i => get.color(i, false) == event.color),
				"gain2"
			);
		},
		ai: {
			threaten: 1.5,
		},
	},
	psqichu: {
		enable: ["chooseToUse", "chooseToRespond"],
		hiddenCard(player, name) {
			if (player != _status.currentPhase && !player.hasSkill("psqichu_used") && get.type(name) == "basic" && lib.inpile.includes(name)) {
				return true;
			}
		},
		filter(event, player) {
			if (event.responded || player == _status.currentPhase || player.hasSkill("psqichu_used")) {
				return false;
			}
			for (var i of lib.inpile) {
				if (get.type(i) == "basic" && event.filterCard({ name: i }, player, event)) {
					return true;
				}
			}
			return false;
		},
		delay: false,
		content() {
			"step 0";
			player.addTempSkill("psqichu_used");
			var evt = event.getParent(2);
			var cards = get.cards(2);
			for (var i = cards.length - 1; i >= 0; i--) {
				ui.cardPile.insertBefore(cards[i].fix(), ui.cardPile.firstChild);
			}
			var aozhan = player.hasSkill("aozhan");
			player
				.chooseButton(["七出：选择要" + (evt.name == "chooseToUse" ? "使用" : "打出") + "的牌", cards])
				.set("filterButton", function (button) {
					return _status.event.cards.includes(button.link);
				})
				.set(
					"cards",
					cards.filter(function (card) {
						if (get.type(card) != "basic") {
							return false;
						}
						if (aozhan && card.name == "tao") {
							return (
								evt.filterCard(
									{
										name: "sha",
										isCard: true,
										cards: [card],
									},
									evt.player,
									evt
								) ||
								evt.filterCard(
									{
										name: "shan",
										isCard: true,
										cards: [card],
									},
									evt.player,
									evt
								)
							);
						}
						return evt.filterCard(card, evt.player, evt);
					})
				)
				.set("ai", function (button) {
					var evt = _status.event.getParent(3);
					if (evt && evt.ai) {
						var tmp = _status.event;
						_status.event = evt;
						var result = (evt.ai || event.ai1)(button.link, _status.event.player, evt);
						_status.event = tmp;
						return result;
					}
					return 1;
				});
			"step 1";
			var evt = event.getParent(2);
			if (result.bool && result.links && result.links.length) {
				var name = result.links[0].name,
					aozhan = player.hasSkill("aozhan") && name == "tao";
				if (aozhan) {
					name = evt.filterCard(
						{
							name: "sha",
							isCard: true,
							cards: [card],
						},
						evt.player,
						evt
					)
						? "sha"
						: "shan";
				}
				if (evt.name == "chooseToUse") {
					game.broadcastAll(
						function (result, name) {
							lib.skill.psqichu_backup.viewAs = {
								name: name,
								cards: [result],
								isCard: true,
							};
							lib.skill.psqichu_backup.prompt = "选择" + get.translation(result) + "的目标";
						},
						result.links[0],
						name
					);
					evt.set("_backupevent", "psqichu_backup");
					evt.backup("psqichu_backup");
				} else {
					delete evt.result.used;
					evt.result.card = get.autoViewAs(result.links[0]);
					if (aozhan) {
						evt.result.card.name = name;
					}
					evt.result.cards = [result.links[0]];
					evt.redo();
					return;
				}
			}
			evt.goto(0);
		},
		ai: {
			effect: {
				target(card, player, target, effect) {
					if (target.hasSkill("psqichu_used")) {
						return;
					}
					if (get.tag(card, "respondShan")) {
						return 0.7;
					}
					if (get.tag(card, "respondSha")) {
						return 0.7;
					}
				},
			},
			order: 11,
			respondShan: true,
			respondSha: true,
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
			backup: {
				precontent() {
					var name = event.result.card.name;
					event.result.cards = event.result.card.cards;
					event.result.card = get.autoViewAs(event.result.cards[0]);
					event.result.card.name = name;
				},
				filterCard: () => false,
				selectCard: -1,
				log: false,
			},
			used: { charlotte: true },
		},
	},
	pslongxin: {
		trigger: { player: "phaseJudgeBegin" },
		direct: true,
		filter(event, player) {
			return player.countCards("j") && player.countCards("h");
		},
		content() {
			"step 0";
			player
				.chooseToDiscard(get.prompt2("pslongxin"), { type: "equip" }, "he")
				.set("logSkill", "pslongxin")
				.set("ai", card => {
					if (_status.event.goon) {
						return 15 - get.value(card);
					}
					return 0;
				})
				.set(
					"goon",
					player.hasCard(card => {
						var cardj = card.viewAs ? { name: card.viewAs } : card;
						return get.effect(player, cardj, player, player) < 0;
					}, "j")
				);
			"step 1";
			if (result.bool) {
				player.discardPlayerCard(player, "j", true);
			}
		},
	},
	//官盗S周瑜·一版
	psoldshiyin: {
		trigger: {
			player: "gainAfter",
			global: "loseAsyncAfter",
		},
		frequent: true,
		filter(event, player) {
			if (player != _status.currentPhase) {
				return false;
			}
			return event.getg(player).filter(i => get.owner(i) == player).length > 0;
		},
		content() {
			"step 0";
			player.showCards(
				trigger.getg(player).filter(i => get.owner(i) == player),
				get.translation(player) + "发动了【识音】"
			);
			"step 1";
			var suits = [],
				cards = trigger.getg(player).filter(i => get.owner(i) == player);
			for (var card of cards) {
				suits.add(get.suit(card, player));
			}
			player.addTempSkill("psoldshiyin_effect");
			if (!player.storage.psoldshiyin_effect) {
				player.storage.psoldshiyin_effect = 0;
			}
			player.storage.psoldshiyin_effect = Math.max(player.storage.psoldshiyin_effect, suits.length);
			if (suits.length >= 2) {
				player.addMark("psoldshiyin_damage", 1, false);
			}
		},
		subSkill: {
			effect: {
				trigger: { player: "useCard" },
				charlotte: true,
				forced: true,
				onremove: ["psoldshiyin_effect", "psoldshiyin_damage"],
				content() {
					var num = player.countMark("psoldshiyin_effect");
					if (num >= 1) {
						trigger.directHit.addArray(game.players);
					}
					if (num >= 2 && get.tag(trigger.card, "damage")) {
						trigger.baseDamage += player.countMark("psoldshiyin_damage");
					}
					if (num >= 3) {
						player.draw();
					}
					player.removeSkill("psoldshiyin_effect");
				},
				mod: {
					aiOrder(player, card, num) {
						var numx = player.countMark("psoldshiyin_effect");
						if (numx >= 2 && get.tag(card, "damage")) {
							return num + 10;
						}
					},
				},
			},
		},
	},
	//官盗S周瑜·二版
	psshiyin: {
		trigger: {
			global: "phaseBefore",
			player: "enterGame",
		},
		forced: true,
		locked: false,
		direct: true,
		group: "psshiyin_change",
		filter(event, player) {
			return event.name != "phase" || game.phaseNumber == 0;
		},
		content() {
			"step 0";
			player.chooseCard(get.prompt("psshiyin"), "将一张手牌置于武将牌上，称为“杂音”牌").set("ai", card => 20 - get.value(card));
			"step 1";
			if (result.bool) {
				player.logSkill("psshiyin");
				player.addToExpansion(result.cards, player, "give").gaintag.add("psshiyin");
			}
		},
		marktext: "音",
		intro: {
			name: "杂音",
			name2: "杂音",
			content: "expansion",
			markcount: "expansion",
		},
		subSkill: {
			change: {
				trigger: { player: "phaseUseBegin" },
				direct: true,
				filter(event, player) {
					return player.getExpansions("psshiyin").length && player.countCards("h");
				},
				content() {
					"step 0";
					var card = player.getExpansions("psshiyin")[0];
					player
						.chooseCard(get.prompt("psshiyin"), "用一张手牌替换“杂音”牌（" + get.translation(card) + "）")
						.set("ai", card => {
							if (_status.event.suit && get.suit(card) == _status.event.suit) {
								return 8 - get.value(card);
							}
							return 0;
						})
						.set(
							"suit",
							(function () {
								var suits = lib.suit
									.slice()
									.map(i => [i, (get.suit(card) == i ? 1 : 0) + player.countCards("h", { suit: i })])
									.filter(i => i[1] > 0);
								suits.sort((a, b) => a[1] - b[1]);
								if (suits.length > 0) {
									return suits[0][0];
								}
								return null;
							})()
						);
					"step 1";
					if (result.bool) {
						player.logSkill("psshiyin");
						player.addToExpansion(result.cards[0], "give", player).gaintag.add("psshiyin");
						var card = player.getExpansions("psshiyin")[0];
						if (card) {
							player.gain(card, "gain2");
						}
					}
				},
			},
		},
		ai: {
			combo: "psliaozou",
		},
	},
	psquwu: {
		forced: true,
		trigger: { target: "useCardToBefore" },
		filter(event, player) {
			return player.getExpansions("psshiyin").length && get.suit(player.getExpansions("psshiyin")[0]) == get.suit(event.card);
		},
		content() {
			trigger.cancel();
		},
		ai: {
			threaten: 1.1,
			combo: "psshiyin",
			effect: {
				target(card, player, target, current) {
					var list = target.getExpansions("psshiyin");
					for (var cardx of list) {
						if (get.suit(cardx) == get.suit(card)) {
							return "zeroplayertarget";
						}
					}
				},
			},
		},
		mod: {
			cardEnabled2(card, player) {
				var list = player.getExpansions("psshiyin");
				for (var cardx of list) {
					if (get.suit(cardx) == get.suit(card)) {
						return false;
					}
				}
			},
			cardRespondable(card, player) {
				var list = player.getExpansions("psshiyin");
				for (var cardx of list) {
					if (get.suit(cardx) == get.suit(card)) {
						return false;
					}
				}
			},
			cardSavable(card, player) {
				var list = player.getExpansions("psshiyin");
				for (var cardx of list) {
					if (get.suit(cardx) == get.suit(card)) {
						return false;
					}
				}
			},
		},
	},
	psliaozou: {
		enable: "phaseUse",
		locked: false,
		filter(event, player) {
			return !player.hasSkill("psliaozou_blocker", null, null, false) && player.getExpansions("psshiyin").length > 0;
		},
		content() {
			"step 0";
			player.showHandcards(get.translation(player) + "发动了【聊奏】");
			"step 1";
			var cards = player.getExpansions("psshiyin"),
				bool = true;
			for (var card of cards) {
				var suit = get.suit(card);
				if (player.hasCard(cardx => get.suit(cardx) == suit)) {
					bool = false;
					break;
				}
			}
			if (bool) {
				player.draw();
			} else {
				player.addTempSkill("psliaozou_blocker", {
					player: ["useCard1", "useSkillBegin", "phaseUseEnd"],
				});
			}
		},
		subSkill: {
			blocker: { charlotte: true },
		},
		mod: {
			aiValue(player, card, num) {
				var suit = get.suit(card);
				if (player.isPhaseUsing() && player.getExpansions("psshiyin").some(i => get.suit(i) == suit)) {
					return num / 5;
				}
			},
			aiUseful() {
				return lib.skill.psliaozou.mod.aiValue.apply(this, arguments);
			},
		},
		ai: {
			combo: "psshiyin",
			order: 9.9,
			result: {
				player(player) {
					var cards = player.getExpansions("psshiyin"),
						bool = true;
					for (var card of cards) {
						var suit = get.suit(card);
						if (player.hasCard(cardx => get.suit(cardx) == suit)) {
							return 0;
						}
					}
					return 1;
				},
			},
		},
	},
	//官盗S武将传晋司马
	psquanyi: {
		enable: "phaseUse",
		usable: 1,
		filterTarget(card, player, target) {
			return player.canCompare(target);
		},
		group: "psquanyi_tianbian",
		content() {
			"step 0";
			player.chooseToCompare(target, function (card) {
				if (typeof card == "string" && lib.skill[card]) {
					var ais =
						lib.skill[card].check ||
						function () {
							return 0;
						};
					return ais();
				}
				var player = get.owner(card);
				var getn = function (card) {
					if (player.hasSkill("tianbian") && get.suit(card) == "heart") {
						return 13;
					}
					return get.number(card);
				};
				var event = _status.event.getParent();
				var to = player == event.player ? event.target : event.player;
				var addi = get.value(card) >= 8 && get.type(card) != "equip" ? -6 : 0;
				if (card.name == "du") {
					addi -= 5;
				}
				if (get.color(card) == "black") {
					addi -= 6;
				}
				if (player == event.player) {
					if (event.small) {
						return -getn(card) - get.value(card) / 2 + addi;
					}
					return getn(card) - get.value(card) / 2 + addi;
				} else {
					if (get.attitude(player, to) <= 0 == Boolean(event.small)) {
						return -getn(card) - get.value(card) / 2 + addi;
					}
					return getn(card) - get.value(card) / 2 + addi;
				}
			});
			"step 1";
			if (result.tie) {
				event.finish();
			} else {
				var targets = [player, target];
				if (!result.bool) {
					targets.reverse();
				}
				var suits = [result.player, result.target].map(i => get.suit(i, false));
				event.targets = targets;
				event.suits = suits;
			}
			"step 2";
			if (event.suits.includes("heart")) {
				if (targets[1].countGainableCards("hej", targets[0]) > 0) {
					targets[0].gainPlayerCard(targets[1], "hej", true);
				}
			}
			"step 3";
			if (event.suits.includes("diamond")) {
				targets[1].damage(targets[0]);
			}
			"step 4";
			if (event.suits.includes("spade")) {
				targets[0].loseHp();
			}
			"step 5";
			if (event.suits.includes("club")) {
				if (targets[0].countDiscardableCards(targets[0], "he")) {
					targets[0].chooseToDiscard(2, true, "he");
				}
			}
		},
		ai: {
			order: 6,
			result: {
				target: -1,
			},
		},
		subSkill: {
			tianbian: {
				audio: "psquanyi",
				enable: "chooseCard",
				check(event) {
					var player = _status.event.player;
					if (player.hasSkill("smyyingshi")) {
						var card = ui.cardPile.childNodes[0];
						if ((get.color(card) == "black" && get.number(card) <= 4) || (get.color(card) == "red" && get.number(card) >= 11)) {
							return 20;
						}
					}
					return !player.hasCard(function (card) {
						var val = get.value(card);
						return val < 0 || (get.color(card) == "black" && val <= 4) || (get.color(card) == "red" && get.number(card) >= 11);
					}, "h")
						? 20
						: 0;
				},
				filter(event) {
					return event.type == "compare" && !event.directresult;
				},
				onCompare(player) {
					return game.cardsGotoOrdering(get.cards()).cards;
				},
			},
		},
	},
	//官盗S曹植
	psliushang: {
		trigger: { player: "phaseDrawBegin1" },
		forced: true,
		filter(event, player) {
			return !event.numFixed;
		},
		group: "psliushang_give",
		content() {
			"step 0";
			trigger.changeToZero();
			player.draw(1 + Math.max(3, game.countPlayer()));
			event.targets = game.filterPlayer(i => i != player);
			"step 1";
			var current = targets.shift();
			if (!player.countCards("h")) {
				event.finish();
			} else {
				player.chooseCardTarget({
					prompt: "流殇：将一张牌置于" + get.translation(current) + "武将牌上",
					current: current,
					filterCard: true,
					forced: true,
					filterTarget(card, player, target) {
						return target == _status.event.current;
					},
					selectTarget: -1,
					ai1(card) {
						var current = _status.event.current;
						return get.value(card, current) * get.attitude(_status.event.player, current);
					},
					ai2: () => 1,
				});
			}
			"step 2";
			if (result.bool) {
				result.targets[0].addToExpansion(result.cards, player, "give").gaintag.add("psliushang");
			}
			if (targets.length) {
				event.goto(1);
			}
		},
		marktext: "殇",
		intro: {
			content: "expansion",
			markcount: "expansion",
		},
		subSkill: {
			give: {
				trigger: { global: "phaseZhunbeiBegin" },
				filter(event, player) {
					return event.player != player && event.player.getExpansions("psliushang").length;
				},
				forced: true,
				logTarget: "player",
				content() {
					"step 0";
					var cards = trigger.player.getExpansions("psliushang"),
						name = get.translation(cards);
					event.cards = cards;
					trigger.player
						.chooseControl()
						.set("choiceList", ["获得" + name + "，且于本回合防止对" + get.translation(player) + "的伤害", "将" + name + "置入弃牌堆"])
						.set("ai", () => {
							return _status.event.choice;
						})
						.set(
							"choice",
							(function () {
								if (get.damageEffect(player, trigger.player, trigger.player) <= 0) {
									return 0;
								}
								if (get.value(cards, trigger.player) < 0) {
									return 1;
								}
								if (
									trigger.player.hasCard(card => {
										return get.tag(card, "damage") && trigger.player.canUse(card, player) && get.effect(player, card, trigger.player, trigger.player) > 0;
									}, "hs")
								) {
									return 1;
								}
								return 0;
							})()
						);
					"step 1";
					if (result.index == 0) {
						trigger.player.gain(cards, "gain2");
						trigger.player.addTempSkill("psliushang_prevent");
						trigger.player.markAuto("psliushang_prevent", [player]);
					} else {
						trigger.player.loseToDiscardpile(cards);
					}
					"step 2";
					game.delayx();
				},
			},
			prevent: {
				trigger: { source: "damageBegin2" },
				filter(event, player) {
					return player.getStorage("psliushang_prevent").includes(event.player);
				},
				forced: true,
				onremove: true,
				charlotte: true,
				logTarget: "player",
				content() {
					trigger.cancel();
				},
				ai: {
					effect: {
						target(card, player, target, current) {
							if (player.getStorage("psliushang_prevent").includes(target) && get.tag(card, "damage")) {
								return "zeroplayertarget";
							}
						},
					},
				},
			},
		},
	},
	psqibu: {
		trigger: { player: "dying" },
		filter(event, player) {
			return player.hp <= 0;
		},
		limited: true,
		skillAnimation: true,
		animationColor: "water",
		content() {
			"step 0";
			player.awakenSkill(event.name);
			var cards = game.cardsGotoOrdering(get.cards(7)).cards;
			game.updateRoundNumber();
			event.cards = cards;
			player.showCards(cards, get.translation(player) + "发动了【流殇】");
			"step 1";
			var num = cards.filter(i => get.suit(i) == "heart").length;
			var gains = cards.filter(i => get.suit(i) == "club");
			if (num > 0) {
				player.recover(num);
			}
			if (gains.length) {
				player.gain(gains, "gain2");
			}
		},
	},
	//官盗S曹丕
	psjianwei: {
		trigger: { player: "phaseBegin" },
		skillAnimation: true,
		animationColor: "water",
		limited: true,
		direct: true,
		filter(event, player) {
			return player.hp >= 1;
		},
		content() {
			"step 0";
			player.chooseTarget(get.prompt2("psjianwei"), lib.filter.notMe).set("ai", target => {
				var player = _status.event.player;
				if (player.hp == 1 && !player.canSave(player)) {
					return 0;
				}
				var sgn = get.sgnAttitude(player, target);
				var valMine = [0, 0],
					valHis = [0, 0];
				player.getCards("hej", card => {
					if (get.position(card) == "j") {
						valMine[0] += get.effect(player, card, player);
						valMine[1] += get.effect(target, card, player);
					} else {
						valMine[0] += get.value(card, player);
						valMine[1] += get.value(card, target) * sgn;
					}
				});
				target.getCards("hej", card => {
					if (get.position(card) == "j") {
						valHis[0] += get.effect(player, card, player);
						valHis[1] += get.effect(target, card, player);
					} else {
						valHis[0] += get.value(card, player);
						valHis[1] += get.value(card, target) * sgn;
					}
				});
				return valMine[1] - valMine[0] + valHis[0] - valHis[1] >= 60;
			});
			"step 1";
			if (result.bool) {
				var target = result.targets[0];
				event.target = target;
				player.logSkill("psjianwei", target);
				player.awakenSkill(event.name);
				player.loseHp();
			} else {
				event.finish();
			}
			"step 2";
			if (player.isIn() && target.isIn()) {
				var next = game.createEvent("psjianwei_swap");
				next.player = player;
				next.target = target;
				next.set("cards1", player.getCards("hej"));
				next.set("cards2", target.getCards("hej"));
				next.setContent(lib.skill.psjianwei.swapRegioncards);
			}
		},
		swapRegioncards() {
			"step 0";
			player.$giveAuto(event.cards1, target);
			target.$giveAuto(event.cards2, player);
			"step 1";
			event.h1 = event.cards1.filter(i => get.position(i) == "h");
			event.e1 = event.cards1.filter(i => get.position(i) == "e");
			event.j1 = event.cards1.filter(i => get.position(i) == "j");
			event.h2 = event.cards2.filter(i => get.position(i) == "h");
			event.e2 = event.cards2.filter(i => get.position(i) == "e");
			event.j2 = event.cards2.filter(i => get.position(i) == "j");
			game.loseAsync({
				lose_list: [
					[player, event.cards1],
					[target, event.cards2],
				],
			}).setContent("chooseToCompareLose");
			"step 2";
			var todis = [];
			for (var i = 0; i < event.j1.length; i++) {
				if (target.isDisabledJudge() || target.hasJudge(event.j1[i].viewAs || event.j1[i].name)) {
					todis.push(event.j1[i]);
				}
			}
			for (var i = 0; i < event.j2.length; i++) {
				if (player.isDisabledJudge() || player.hasJudge(event.j2[i].viewAs || event.j2[i].name)) {
					todis.push(event.j2[i]);
				}
			}
			if (todis.length) {
				game.cardsDiscard(todis);
			}
			"step 3";
			game.loseAsync({
				gain_list: [
					[player, event.h2.filter(i => get.position(i, true) == "o")],
					[target, event.h1.filter(i => get.position(i, true) == "o")],
				],
			}).setContent("gaincardMultiple");
			for (var i = 0; i < event.e2.length; i++) {
				if (get.position(event.e2[i], true) == "o") {
					player.equip(event.e2[i]);
				}
			}
			for (var i = 0; i < event.e1.length; i++) {
				if (get.position(event.e1[i], true) == "o") {
					target.equip(event.e1[i]);
				}
			}
			for (var i = 0; i < event.j2.length; i++) {
				if (get.position(event.j2[i], true) == "o") {
					player.addJudge(event.j2[i]);
				}
			}
			for (var i = 0; i < event.j1.length; i++) {
				if (get.position(event.j1[i], true) == "o") {
					target.addJudge(event.j1[i]);
				}
			}
			"step 4";
			game.delayx();
		},
	},
	//官盗S司马懿
	pszhonghu: {
		trigger: { global: "dieAfter" },
		global: "pszhonghu_skip",
		filter(event, player) {
			return player != _status.currentPhase;
		},
		content() {
			"step 0";
			var evt = trigger.getParent("phaseUse");
			if (evt && evt.name == "phaseUse") {
				evt.skipped = true;
			}
			var evt = trigger.getParent("phase");
			if (evt && evt.name == "phase") {
				game.log(evt.player, "结束了回合");
				evt.finish();
				evt.untrigger(true);
			}
			_status._pszhonghu = player;
		},
		subSkill: {
			skip: {
				trigger: { player: "phaseBeforeStart" },
				forced: true,
				priority: Infinity,
				popup: false,
				firstDo: true,
				filter(event, player) {
					if ((_status._pszhonghu && !_status._pszhonghu.isIn()) || event.player == _status._pszhonghu) {
						delete _status._pszhonghu;
					}
					return _status._pszhonghu && event.player != _status._pszhonghu;
				},
				content() {
					trigger.cancel(null, null, "notrigger");
				},
			},
		},
	},
	//官盗S虎啸龙吟司马懿&诸葛亮
	pshuxiao: {
		trigger: { player: "phaseBegin" },
		frequent: true,
		content() {
			"step 0";
			player.judge(function (card) {
				if (get.type(card) == "basic" || get.type(card) == "trick") {
					return 3;
				}
				return -1;
			});
			"step 1";
			if (result.bool) {
				player.addTempSkill("pshuxiao_use");
				player.storage.pshuxiao_use = {
					card: { name: result.name, nature: result.card.nature },
					number: result.number,
					suit: result.suit,
				};
			}
		},
		subSkill: {
			use: {
				charlotte: true,
				onremove: true,
				enable: "chooseToUse",
				popname: true,
				position: "hs",
				hiddenCard(player, name) {
					return player.storage.pshuxiao_use.card.name == name;
				},
				filter(event, player) {
					if (!player.storage.pshuxiao_use) {
						return false;
					}
					if (!player.countCards("h")) {
						return false;
					}
					return event.filterCard(player.storage.pshuxiao_use.card, player, event);
				},
				viewAs(cards, player) {
					return player.storage.pshuxiao_use.card;
				},
				filterCard(card, player) {
					return get.number(card) == player.storage.pshuxiao_use.number || get.suit(card) == player.storage.pshuxiao_use.suit;
				},
				prompt(event) {
					var player = _status.event.player;
					return "将一张" + get.translation(player.storage.pshuxiao_use.suit) + "牌或点数为" + get.strNumber(player.storage.pshuxiao_use.number) + "的牌当作" + get.translation(player.storage.pshuxiao_use.card) + "使用";
				},
			},
		},
	},
	psguanxing: {
		audio: "guanxing",
		trigger: { player: "phaseZhunbeiBegin" },
		frequent: true,
		preHidden: true,
		async content(event, trigger, player) {
			const result = await player.chooseToGuanxing(5).set("prompt", "观星：点击或拖动将牌移动到牌堆顶或牌堆底").forResult();
			if (!result.bool || !result.moved[0].length) {
				player.addTempSkill("guanxing_fail");
			}
		},
		ai: {
			threaten: 1.2,
			guanxing: true,
		},
	},
	pslongyin: {
		enable: ["chooseToUse", "chooseToRespond"],
		filter(event, player) {
			if (!player.countCards("hse") || player.hasSkill("pslongyin_used")) {
				return false;
			}
			for (var i of lib.inpile) {
				var type = get.type(i);
				if ((type == "basic" || type == "trick") && event.filterCard(get.autoViewAs({ name: i }, "unsure"), player, event)) {
					return true;
				}
			}
			return false;
		},
		chooseButton: {
			dialog(event, player) {
				var list = [];
				for (var i = 0; i < lib.inpile.length; i++) {
					var name = lib.inpile[i];
					if (name == "sha") {
						if (event.filterCard({ name: name }, player, event)) {
							list.push(["基本", "", "sha"]);
						}
						for (var j of lib.inpile_nature) {
							if (event.filterCard({ name: name, nature: j }, player, event)) {
								list.push(["基本", "", "sha", j]);
							}
						}
					} else if (get.type(name) == "trick" && event.filterCard({ name: name }, player, event)) {
						list.push(["锦囊", "", name]);
					} else if (get.type(name) == "basic" && event.filterCard({ name: name }, player, event)) {
						list.push(["基本", "", name]);
					}
				}
				return ui.create.dialog("虎啸", [list, "vcard"]);
			},
			filter(button, player) {
				return _status.event.getParent().filterCard({ name: button.link[2], nature: button.link[3] }, player, _status.event.getParent());
			},
			check(button) {
				if (_status.event.getParent().type != "phase") {
					return 1;
				}
				var player = _status.event.player;
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
						return num == 13;
					},
					audio: "pslongyin",
					popname: true,
					complexCard: true,
					check(card) {
						var num = 0;
						for (var i = 0; i < ui.selected.cards.length; i++) {
							num += get.number(ui.selected.cards[i]);
						}
						if (num + get.number(card) == 13) {
							return 5.5 - get.value(card);
						}
						if (ui.selected.cards.length == 0) {
							var cards = _status.event.player.getCards("h");
							for (var i = 0; i < cards.length; i++) {
								for (var j = i + 1; j < cards.length; j++) {
									if (get.number(cards[i]) + get.number(cards[j]) == 13) {
										if (cards[i] == card || cards[j] == card) {
											return 6 - get.value(card);
										}
									}
								}
							}
						}
						return 0;
					},
					position: "hes",
					viewAs: { name: links[0][2], nature: links[0][3] },
					precontent() {
						player.addTempSkill("pslongyin_used");
					},
				};
			},
			prompt(links, player) {
				return "将任意张点数和为13牌当做" + (get.translation(links[0][3]) || "") + get.translation(links[0][2]) + "使用";
			},
		},
		hiddenCard(player, name) {
			if (!lib.inpile.includes(name)) {
				return false;
			}
			var type = get.type(name);
			return (type == "basic" || type == "trick") && player.countCards("she") > 0 && !player.hasSkill("pslongyin_used");
		},
		ai: {
			fireAttack: true,
			respondSha: true,
			respondShan: true,
			skillTagFilter(player) {
				if (!player.countCards("hse") || player.hasSkill("pslongyin_used")) {
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
			used: { charlotte: true },
		},
	},
	//官盗S武将传诸葛亮
	pszhiji: {
		enable: "phaseUse",
		usable: 1,
		filterTarget(card, player, target) {
			if (!ui.selected.targets.length) {
				return true;
			}
			return target.group != ui.selected.targets[0].group;
		},
		selectTarget: 2,
		complexTarget: true,
		multitarget: true,
		multiline: true,
		filterCard: true,
		selectCard: 2,
		check(card) {
			return 6 - get.value(card);
		},
		content() {
			"step 0";
			targets.sortBySeat();
			if (targets[0].canUse("sha", targets[1], false)) {
				targets[0].useCard({ name: "sha", isCard: true }, targets[1], false, "noai");
			}
			"step 1";
			if (targets[1].canUse("sha", targets[0], false)) {
				targets[1].useCard({ name: "sha", isCard: true }, targets[0], false, "noai");
			}
		},
		ai: {
			order: 2.5,
			result: {
				player: 1,
				target(player, target) {
					if (ui.selected.targets.length) {
						var targetx = ui.selected.targets[0];
						if (get.effect(targetx, { name: "sha" }, target, player) + get.effect(target, { name: "sha" }, targetx, player) < 0) {
							return 0;
						}
						return -1;
					}
					return -1;
				},
			},
		},
	},
	psjiefeng: {
		enable: "phaseUse",
		filterCard: true,
		selectCard: 2,
		check(card) {
			return 6 - get.value(card);
		},
		content() {
			"step 0";
			var cards = game.cardsGotoOrdering(get.cards(5)).cards;
			event.cards = cards;
			player.showCards(cards, get.translation(player) + "发动了【借风】");
			"step 1";
			if (cards.filter(i => get.color(i) == "red").length >= 2) {
				player.chooseUseTarget("wanjian", true);
			}
		},
		ai: {
			order: 9,
			result: {
				player(player) {
					if (player.getUseValue({ name: "wanjian" }) < 0) {
						return 0;
					}
					return 1;
				},
			},
		},
	},
	//官盗S马超
	psweihou: {
		trigger: { player: "judgeBegin" },
		filter(event, player) {
			return !event.directresult;
		},
		content() {
			"step 0";
			var cards = get.cards(2);
			for (var i = cards.length - 1; i >= 0; i--) {
				ui.cardPile.insertBefore(cards[i], ui.cardPile.firstChild);
			}
			game.updateRoundNumber();
			event.cards = cards;
			event.videoId = lib.status.videoId++;
			game.broadcastAll(
				function (player, id, cards) {
					var str;
					if (player == game.me && !_status.auto) {
						str = "威侯：选择一张作为本次判定结果";
					} else {
						str = get.translation(player) + "发动了【威侯】";
					}
					var dialog = ui.create.dialog(str, cards);
					dialog.videoId = id;
				},
				player,
				event.videoId,
				event.cards
			);
			game.addVideo("showCards", player, ["威侯", get.cardsInfo(event.cards)]);
			if (!event.isMine() && !event.isOnline()) {
				game.delayx();
			}
			"step 1";
			player
				.chooseButton(["威侯：选择一张作为本次判定结果", cards], true)
				.set("ai", button => {
					return _status.event.getTrigger().judge(button.link);
				})
				.set("dialog", event.videoId);
			"step 2";
			game.broadcastAll("closeDialog", event.videoId);
			if (result.bool) {
				trigger.directresult = result.links[0];
				game.cardsDiscard(cards.removeArray(result.links).filter(i => get.position(i) == "c"));
			}
			"step 3";
			game.updateRoundNumber();
		},
	},
	//官盗S1066★贾诩
	psqupo: {
		trigger: { global: "phaseBegin" },
		filter(event, player) {
			return player.countCards("he") && game.countPlayer() > 2;
		},
		async cost(event, trigger, player) {
			const cards = player.getCards("he");
			const { player: current } = trigger;
			const targets = game.filterPlayer(currentx => {
				if (currentx == current || current == player) {
					return false;
				}
				return !current.canUse("sha", currentx) || (get.effect(currentx, { name: "sha" }, current, player) > 0 && get.attitude(player, currentx) > -3);
			});
			const targets2 = game.filterPlayer(currentx => {
				if (currentx == current || current == player) {
					return false;
				}
				return current.hasCard(card => current.canUse(card, currentx) && get.effect(currentx, card, current, player) > 0 && get.color(card) == "red" && get.tag(card, "damage") > 0.5, "hs");
			});
			event.result = await player
				.chooseCardTarget({
					filterCard: true,
					position: "he",
					prompt: get.prompt2(event.skill),
					current: current,
					targets1: targets,
					targets2: targets2,
					filterTarget(card, player, target) {
						return player != target && target != get.event("current");
					},
					ai1(card) {
						const { player, current, targets1, targets2 } = get.event();
						const color = get.color(card);
						if (!targets2.length) {
							if (get.effect(current, { name: "losehp" }, player, player) < 0) {
								return 0;
							}
							if (color != "black" || !targets1.length) {
								return 0;
							}
							return 5.5 - get.value(card);
						}
						targets2.sort((a, b) => get.threaten(b, current) - get.threaten(a, current));
						if (!targets1.length) {
							if (color != "red") {
								return 0;
							}
							if (get.attitude(player, current) <= 0) {
								return 0;
							}
							return 5.5 - get.value(card);
						}
						const target = targets2[0];
						const color1 = get.effect(current, { name: "losehp" }, player, player) > Math.max(0, get.effect(target, { name: "losehp" }, player, player)) ? "black" : "red";
						if (color !== color1) {
							return 0;
						}
						return 6 - get.value(card);
					},
					ai2(target) {
						if (!ui.selected.cards.length) {
							return 0;
						}
						const { player, current, targets1, targets2 } = get.event();
						const color = get.color(ui.selected.cards[0]);
						if (!["red", "black"].includes(color)) {
							return 0;
						}
						if (color == "black") {
							if (!targets1.includes(target)) {
								return 0;
							}
							return get.attitude(player, target) + 0.1;
						}
						if (!targets2.includes(target)) {
							return 0;
						}
						return get.effect(target, { name: "losehp" }, player, player);
					},
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const {
				targets: [target],
				cards,
			} = event;
			await player.give(cards, target);
			const color = get.color(cards[0]);
			const skill = event.name + "_" + color;
			if (color == "black") {
				trigger.player.addTempSkill(skill);
				trigger.player.markAuto(skill, [target]);
			} else if (color == "red") {
				target.addTempSkill(skill);
				target.addMark(skill, 1, false);
			}
		},
		subSkill: {
			black: {
				trigger: { player: "useCardToPlayer" },
				charlotte: true,
				onremove: true,
				forced: true,
				popup: false,
				filter(event, player) {
					if (event.card.name != "sha") {
						return false;
					}
					return !player.getStorage("psqupo_black").includes(event.target);
				},
				content() {
					player.loseHp();
				},
				intro: { content: "本回合使用【杀】指定不为$的目标时失去1点体力" },
			},
			red: {
				trigger: { player: "damageBegin3" },
				charlotte: true,
				onremove: true,
				forced: true,
				popup: false,
				content() {
					player.loseHp(player.countMark(event.name));
					player.removeSkill(event.name);
				},
				intro: { content: "本回合下一次受到伤害时失去#点体力" },
			},
		},
	},
	psbaoquan: {
		trigger: { player: "damageBegin4" },
		filter(event, player) {
			return player.countCards("h", { type: ["trick", "delay"] }) || _status.connectMode;
		},
		direct: true,
		content() {
			"step 0";
			player
				.chooseToDiscard(get.prompt2("psbaoquan"), { type: ["trick", "delay"] })
				.set("logSkill", "psbaoquan")
				.set("ai", card => {
					if (_status.event.goon) {
						return 7 - get.value(card);
					}
					return 0;
				})
				.set("goon", get.damageEffect(player, trigger.source, player) < -5);
			"step 1";
			if (result.bool) {
				trigger.cancel();
			}
		},
	},
	//官盗S吕布
	pssheji: {
		enable: "phaseUse",
		filterCard: true,
		selectCard: -1,
		position: "h",
		locked: false,
		filter(event, player) {
			if (player.hasSkill("pssheji_used")) {
				return false;
			}
			var hs = player.getCards("h");
			if (!hs.length) {
				return false;
			}
			for (var card of hs) {
				var mod2 = game.checkMod(card, player, "unchanged", "cardEnabled2", player);
				if (mod2 === false) {
					return false;
				}
			}
			return event.filterCard(get.autoViewAs({ name: "sha" }, hs));
		},
		viewAs: {
			name: "sha",
			storage: { pssheji: true },
		},
		onuse(links, player) {
			player.addTempSkill("pssheji_used", "phaseUseAfter");
		},
		ai: {
			order: 1,
			threaten: 1.1,
		},
		mod: {
			targetInRange(card, player, target) {
				if (card.storage && card.storage.pssheji) {
					return true;
				}
			},
		},
		subSkill: {
			used: {
				audio: "pssheji",
				trigger: { source: "damageSource" },
				charlotte: true,
				forced: true,
				popup: false,
				logTarget: "player",
				filter(event, player) {
					return (
						event.card.storage &&
						event.card.storage.pssheji &&
						event.player.hasCard(card => {
							if (!lib.filter.canBeGained(card, player, event.player)) {
								return false;
							}
							return ["equip1", "equip3", "equip4", "equip6"].includes(get.subtype(card));
						}, "e")
					);
				},
				content() {
					var cards = trigger.player.getCards("e", card => {
						if (!lib.filter.canBeGained(card, player, trigger.player)) {
							return false;
						}
						return ["equip1", "equip3", "equip4", "equip6"].includes(get.subtype(card));
					});
					if (cards.length) {
						player.gain(cards, "giveAuto", trigger.player);
					}
				},
			},
		},
	},
	//战役篇国战将转身份
	//钟会
	zyquanji: {
		audio: "gzquanji",
		trigger: {
			player: "damageEnd",
			source: "damageSource",
		},
		frequent: true,
		filter(event, player, name) {
			if (name == "damageEnd") {
				return true;
			}
			const evt = event.getParent();
			if (evt.player != player) {
				return false;
			}
			return evt.card && evt.type == "card" && evt.targets.length == 1;
		},
		async content(event, trigger, player) {
			await player.draw();
			const hs = player.getCards("he");
			if (!hs.length) {
				return;
			}
			const result = hs.length == 1 ? { bool: true, cards: hs } : await player.chooseCard("he", true, "选择一张牌作为“权”").forResult();
			if (result?.bool && result?.cards?.length) {
				const next = player.addToExpansion(result.cards, player, "give");
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
		locked: false,
		mod: {
			maxHandcard(player, num) {
				return num + player.getExpansions("zyquanji").length;
			},
		},
		ai: { notemp: true },
	},
	zypaiyi: {
		audio: "gzpaiyi",
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return player.getExpansions("zyquanji").length > 0;
		},
		chooseButton: {
			dialog(event, player) {
				return ui.create.dialog("排异", player.getExpansions("zyquanji"), "hidden");
			},
			backup(links, player) {
				return {
					audio: "gzpaiyi",
					filterTarget: true,
					filterCard() {
						return false;
					},
					selectCard: -1,
					card: links[0],
					delay: false,
					content: lib.skill.zypaiyi.contentx,
					ai: {
						order: 10,
						result: {
							target(player, target) {
								if (target != player) {
									return 0;
								}
								if (player.getExpansions("zyquanji").length <= 1 || (player.needsToDiscard() && !player.getEquip("zhuge") && !player.hasSkill("new_paoxiao"))) {
									return 0;
								}
								return 1;
							},
						},
					},
				};
			},
			prompt() {
				return "请选择【排异】的目标";
			},
		},
		contentx() {
			"step 0";
			var card = lib.skill.zypaiyi_backup.card;
			player.loseToDiscardpile(card);
			"step 1";
			var num = player.getExpansions("zyquanji").length;
			if (num > 0) {
				target.draw(Math.min(7, num));
			}
			"step 2";
			if (target.countCards("h") > player.countCards("h")) {
				target.damage();
			}
		},
		ai: {
			order(item, player) {
				var num = player.getExpansions("zyquanji").length;
				if (num == 1) {
					return 8;
				}
				return 1;
			},
			result: {
				player: 1,
			},
			combo: "zyquanji",
		},
	},
	//孙綝
	zyshilu: {
		init() {
			if (!_status.characterlist) {
				game.initCharactertList();
			}
		},
		audio: 2,
		preHidden: true,
		trigger: { global: "dieAfter" },
		prompt2(event, player) {
			return "将其的所有武将牌" + (player == event.source ? "及武将牌库里的一张随机武将牌" : "") + "置于武将牌上作为“戮”";
		},
		logTarget: "player",
		content() {
			var list = [],
				target = trigger.player;
			if (target.name1 && !target.isUnseen(0) && target.name1.indexOf("gz_shibing") != 0 && _status.characterlist.includes(target.name1)) {
				list.push(target.name1);
			}
			if (target.name2 && !target.isUnseen(1) && target.name2.indexOf("gz_shibing") != 0 && _status.characterlist.includes(target.name1)) {
				list.push(target.name2);
			}
			_status.characterlist.removeArray(list);
			if (player == trigger.source) {
				list.addArray(_status.characterlist.randomRemove(1));
			}
			if (list.length) {
				player.markAuto("zyshilu", list);
				game.log(player, "将", "#g" + get.translation(list), "置于武将牌上作为", "#y“戮”");
				game.broadcastAll(
					function (player, list) {
						var cards = [];
						for (var i = 0; i < list.length; i++) {
							var cardname = "huashen_card_" + list[i];
							lib.card[cardname] = {
								fullimage: true,
								image: "character:" + list[i],
							};
							lib.translate[cardname] = get.rawName2(list[i]);
							cards.push(game.createCard(cardname, "", ""));
						}
						player.$draw(cards, "nobroadcast");
					},
					player,
					list
				);
			}
		},
		marktext: "戮",
		intro: {
			content: "character",
			onunmark(storage, player) {
				if (storage && storage.length) {
					_status.characterlist.addArray(storage);
					storage.length = 0;
				}
			},
			mark(dialog, storage, player) {
				if (storage && storage.length) {
					dialog.addSmall([storage, "character"]);
				} else {
					return "没有“戮”";
				}
			},
			// content:function(storage,player){
			// 	return '共有'+get.cnNumber(storage.length)+'张“戮”';
			// },
		},
		group: "zyshilu_zhiheng",
		subSkill: {
			zhiheng: {
				audio: "zyshilu",
				trigger: { player: "phaseZhunbeiBegin" },
				filter(event, player) {
					return player.getStorage("zyshilu").length > 0 && player.countCards("he") > 0;
				},
				direct: true,
				content() {
					"step 0";
					var num = Math.min(player.getStorage("zyshilu").length, player.countCards("he"));
					player.chooseToDiscard("he", get.prompt("zyshilu"), "弃置至多" + get.cnNumber(num) + "张牌并摸等量的牌", [1, num]).logSkill = "zyshilu_zhiheng";
					"step 1";
					if (result.bool && result.cards && result.cards.length) {
						player.draw(result.cards.length);
					}
				},
			},
		},
	},
	zyxiongnve: {
		audio: 2,
		trigger: { player: "phaseUseBegin" },
		direct: true,
		filter(event, player) {
			return player.getStorage("zyshilu").length > 0;
		},
		content() {
			"step 0";
			player
				.chooseButton([get.prompt("zyxiongnve"), [player.storage.zyshilu, "character"]])
				.set("ai", function (button) {
					if (!_status.event.goon) {
						return 0;
					}
					return 1;
				})
				.set(
					"goon",
					player.countCards("hs", function (card) {
						return get.tag(card, "damage") && player.hasValueTarget(card);
					}) > 1
				);
			"step 1";
			if (result.bool) {
				player.logSkill("zyxiongnve");
				lib.skill.zyxiongnve.throwCharacter(player, result.links);
				game.delayx();
				player
					.chooseControl()
					.set("prompt", "选择获得一项效果")
					.set("choiceList", ["本回合造成的伤害+1", "本回合造成伤害时，获得其一张牌", "本回合使用牌没有次数限制"])
					.set("ai", function () {
						var player = _status.event.player;
						if (
							player.countCards("hs", function (card) {
								return get.name(card) == "sha" && player.hasValueTarget(card);
							}) > player.getCardUsable("sha")
						) {
							return 0;
						}
						return get.rand(1, 2);
					});
			} else {
				event.finish();
			}
			"step 2";
			var skill = "zyxiongnve_effect" + result.index;
			player.addTempSkill(skill);
			game.log(player, "本回合", "#g" + lib.skill[skill].promptx);
		},
		group: "zyxiongnve_end",
		throwCharacter(player, list) {
			player.unmarkAuto("zyshilu", list);
			_status.characterlist.addArray(list);
			game.log(player, "从", "#y“戮”", "中移去了", "#g" + get.translation(list));
			game.broadcastAll(
				function (player, list) {
					var cards = [];
					for (var i = 0; i < list.length; i++) {
						var cardname = "huashen_card_" + list[i];
						lib.card[cardname] = {
							fullimage: true,
							image: "character:" + list[i],
						};
						lib.translate[cardname] = get.rawName2(list[i]);
						cards.push(game.createCard(cardname, "", ""));
					}
					player.$throw(cards, 1000, "nobroadcast");
				},
				player,
				list
			);
		},
		subSkill: {
			effect0: {
				promptx: "造成的伤害+1",
				charlotte: true,
				onremove: true,
				audio: "zyxiongnve",
				intro: {
					content: "当你造成伤害时，此伤害+1",
				},
				trigger: { source: "damageBegin1" },
				forced: true,
				logTarget: "player",
				content() {
					trigger.num++;
				},
			},
			effect1: {
				promptx: "造成伤害后，获得其一张牌",
				charlotte: true,
				onremove: true,
				audio: "zyxiongnve",
				intro: {
					content: "对其他角色造成伤害时，获得其一张牌",
				},
				trigger: { source: "damageBegin1" },
				forced: true,
				filter(event, player) {
					return player != event.player && event.player.countGainableCards(player, "he") > 0;
				},
				logTarget: "player",
				content() {
					player.gainPlayerCard(trigger.player, true, "he");
				},
			},
			effect2: {
				promptx: "使用牌没有次数限制",
				charlotte: true,
				onremove: true,
				intro: {
					content: "使用牌没有次数限制",
				},
				mod: {
					cardUsable: () => Infinity,
				},
			},
			effect3: {
				charlotte: true,
				audio: "zyxiongnve",
				mark: true,
				intro: {
					content: "受到的伤害-1",
				},
				trigger: { player: "damageBegin4" },
				forced: true,
				filter(event, player) {
					return event.source != player && event.source && event.source.isIn();
				},
				content() {
					trigger.num--;
				},
				ai: {
					effect: {
						target(card, player, target) {
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
			end: {
				trigger: { player: "phaseUseEnd" },
				direct: true,
				filter(event, player) {
					return player.getStorage("zyshilu").length > 1;
				},
				content() {
					"step 0";
					player.chooseButton(["凶虐：是否移去两张“戮”获得减伤？", [player.storage.zyshilu, "character"]], 2).set("ai", function (button) {
						var player = _status.event.player;
						if (game.countPlayer() * 1.5 + player.storage.zyshilu.length / 2 > 8) {
							return 1;
						}
						if (player.hp <= 2) {
							return 1;
						}
						return 0;
					});
					"step 1";
					if (result.bool) {
						player.logSkill("zyxiongnve");
						lib.skill.zyxiongnve.throwCharacter(player, result.links);
						player.addTempSkill("zyxiongnve_effect3", { player: "phaseBegin" });
						game.delayx();
					}
				},
			},
		},
		ai: {
			combo: "zyshilu",
		},
	},
	//孟达
	qiuan: {
		audio: 2,
		trigger: { player: "damageBegin4" },
		filter(event, player) {
			return event.cards && event.cards.filterInD().length > 0 && !player.getExpansions("qiuan").length;
		},
		check(event, player) {
			if (get.damageEffect(player, event.source || player, player, event.nature) >= 0) {
				return false;
			}
			return true;
		},
		preHidden: true,
		content() {
			var cards = trigger.cards.filterInD();
			player.addToExpansion("gain2", cards).gaintag.add("qiuan");
			trigger.cancel();
		},
		ai: {
			combo: "liangfan",
		},
		intro: {
			content: "expansion",
			markcount: "expansion",
		},
		marktext: "函",
	},
	liangfan: {
		audio: 2,
		trigger: { player: "phaseZhunbeiBegin" },
		forced: true,
		filter(event, player) {
			return player.getExpansions("qiuan").length > 0;
		},
		content() {
			"step 0";
			var cards = player.getExpansions("qiuan");
			player.gain(cards, "gain2").gaintag.add("liangfan");
			player.addTempSkill("liangfan2");
			"step 1";
			player.loseHp();
		},
		ai: {
			combo: "qiuan",
		},
	},
	liangfan2: {
		audio: "liangfan",
		mark: true,
		mod: {
			aiOrder(player, card, num) {
				if (get.itemtype(card) == "card" && card.hasGaintag("liangfan")) {
					return num + 0.1;
				}
			},
		},
		intro: { content: "使用“量反”牌造成伤害后，可获得目标角色的一张牌" },
		trigger: { source: "damageEnd" },
		logTarget: "player",
		charlotte: true,
		sourceSkill: "liangfan",
		onremove(player) {
			player.removeGaintag("liangfan");
		},
		prompt: event => "量反：是否获得" + get.translation(event.player) + "的一张牌？",
		filter(event, player) {
			var evt = event.getParent(2);
			if (evt.name != "useCard" || evt.card != event.card) {
				return false;
			}
			if (!event.player.countGainableCards(player, "he")) {
				return false;
			}
			return (
				player.getHistory("lose", function (evt2) {
					if (evt2.getParent() != evt) {
						return false;
					}
					for (var i in evt2.gaintag_map) {
						if (evt2.gaintag_map[i].includes("liangfan")) {
							return true;
						}
					}
					return false;
				}).length > 0
			);
		},
		marktext: "反",
		content() {
			player.gainPlayerCard(trigger.player, true, "he");
		},
	},
	//文钦
	gzjinfa: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return (
				player.countCards("he") > 0 &&
				game.hasPlayer(function (current) {
					return current != player && current.countCards("he") > 0;
				})
			);
		},
		filterCard: true,
		position: "he",
		filterTarget(card, player, target) {
			return target != player && target.countCards("he") > 0;
		},
		check(card) {
			return 6 - get.value(card);
		},
		content() {
			"step 0";
			target
				.chooseCard("he", "交给" + get.translation(player) + "一张装备牌，或令其获得你的一张牌", { type: "equip" })
				.set("ai", function (card) {
					if (_status.event.goon && get.suit(card) == "spade") {
						return 8 - get.value(card);
					}
					return 5 - get.value(card);
				})
				.set("goon", target.canUse("sha", player, false) && get.effect(player, { name: "sha" }, target, target) > 0);
			"step 1";
			if (!result.bool) {
				player.gainPlayerCard(target, "he", true);
				event.finish();
			} else {
				target.give(result.cards, player);
			}
			"step 2";
			if (result.bool && result.cards && result.cards.length && target.isIn() && player.isIn() && get.suit(result.cards[0], target) == "spade" && target.canUse("sha", player, false)) {
				target.useCard({ name: "sha", isCard: true }, false, player);
			}
		},
		ai: {
			order: 6,
			result: {
				player(player, target) {
					if (
						target.countCards("e", function (card) {
							return get.suit(card) == "spade" && get.value(card) < 8;
						}) &&
						target.canUse("sha", player, false)
					) {
						return get.effect(player, { name: "sha" }, target, player);
					}
					return 0;
				},
				target(player, target) {
					var es = target.getCards("e").sort(function (a, b) {
						return get.value(b, target) - get.value(a, target);
					});
					if (es.length) {
						return -Math.min(2, get.value(es[0]));
					}
					return -2;
				},
			},
		},
	},
	//一战成名·群雄逐鹿·长安之战专属神贾诩
	zybishi: {
		trigger: { target: "useCardToTargeted" },
		filter(event, player) {
			return event.card.name == "sha" && event.player != player;
		},
		check(event, player) {
			var effect = 0;
			if (event.targets && event.targets.length) {
				for (var i = 0; i < event.targets.length; i++) {
					effect += get.effect(event.targets[i], event.card, event.player, player);
				}
			}
			if (effect < 0) {
				var target = event.targets[0];
				if (target == player) {
					return !player.countCards("h", "shan");
				} else {
					return target.hp == 1 || (target.countCards("h") <= 2 && target.hp <= 2);
				}
			}
			return false;
		},
		content() {
			player.line(trigger.player, "green");
			trigger.player.draw();
			var evt = trigger.getParent();
			evt.targets.length = 0;
			evt.all_excluded = true;
			game.log(evt.card, "被无效了");
		},
	},
	zyjianbing: {
		trigger: { global: "damageBegin3" },
		logTarget: "player",
		filter(event, player) {
			return event.player != player && event.player.isIn() && event.card && event.card.name == "sha" && event.player.countGainableCards(player, "he") > 0;
		},
		content() {
			"step 0";
			player.gainPlayerCard(trigger.player, true, "he");
			"step 1";
			if (result.bool && result.cards && result.cards.length) {
				var card = result.cards[0];
				if (get.suit(card, trigger.player) == "heart") {
					trigger.player.recover();
				}
			}
		},
	},
	//战役篇改王允
	zylianji: {
		audio: "wylianji",
		trigger: { player: "phaseUseEnd" },
		filter(event, player) {
			return player.hasHistory("useCard", evt => evt.getParent("phaseUse") == event);
		},
		direct: true,
		async content(event, trigger, player) {
			let logged = false;
			const num = player
				.getHistory("useCard", evt => evt.getParent("phaseUse") == trigger)
				.map(evt => get.type2(evt.card))
				.unique().length;
			if (num > 0) {
				const result = await player
					.chooseTarget(get.prompt("zylianji"), "令一名角色摸一张牌")
					.set("ai", target => {
						var player = get.player();
						if (target == player && player.needsToDiscard(1)) {
							return 1;
						}
						return get.effect(target, { name: "draw" }, player, player);
					})
					.forResult();
				if (result?.targets?.length) {
					const target = result.targets[0];
					if (!logged) {
						logged = true;
						player.logSkill("zylianji", target);
					}
					await result.targets[0].draw();
				}
			}
			if (num > 1 && player.isDamaged()) {
				const { result } = await player.chooseBool(get.prompt("zylianji"), "回复1点体力");
				if (result?.bool) {
					if (!logged) {
						logged = true;
						player.logSkill("zylianji");
					}
					await player.recover();
				}
			}
			if (num > 2) {
				let list;
				const evt = trigger.getParent("phase", true);
				if (evt) {
					list = evt.phaseList.slice(evt.num + 1);
				}
				if (!list.length) {
					return;
				}
				const result = await player
					.chooseTarget(get.prompt("zylianji"), `跳过本回合的剩余阶段，然后令一名其他角色执行一个只有${get.translation(list)}的回合`, lib.filter.notMe)
					.set("ai", target => {
						var att = get.attitude(_status.event.player, target),
							num = target.needsToDiscard(),
							numx = player.needsToDiscard();
						if (att < 0 && num > 0) {
							return (-att * Math.sqrt(num)) / 3 + numx;
						}
						var skills = target.getSkills();
						var val = 0;
						for (var skill of skills) {
							var info = get.info(skill);
							if (info.trigger && info.trigger.player && (info.trigger.player.indexOf("phaseJieshu") == 0 || (Array.isArray(info.trigger.player) && info.trigger.player.some(i => i.indexOf("phaseJieshu") == 0)))) {
								var threaten = info.ai && info.ai.threaten ? info.ai.threaten : 1;
								if (info.ai && info.ai.neg) {
									val -= 3 * threaten;
								} else if (info.ai && info.ai.halfneg) {
									val -= 1.5 * threaten;
								} else {
									val += threaten;
								}
							}
						}
						return (att * val) / 2 + numx;
					})
					.forResult();
				if (result?.targets?.length) {
					const target = result.targets[0];
					if (!logged) {
						logged = true;
						player.logSkill("zylianji", target);
					} else {
						player.line(target);
					}
					list = list.map(name => name.split("|")[0]);
					list.forEach(name => player.skip(name));
					game.log(player, "跳过了", list);
					target.insertPhase().set("phaseList", list)._noTurnOver = true;
				}
			}
		},
	},
	zymoucheng: {
		audio: "moucheng",
		enable: "phaseUse",
		usable: 1,
		viewAs: { name: "jiedao" },
		filterCard: { color: "black" },
		position: "he",
		check(card) {
			return 4.5 - get.value(card);
		},
	},
	//用间篇豪华版盒子甄姬
	yjluoshen: {
		audio: "luoshen",
		trigger: { player: "phaseZhunbeiBegin" },
		frequent: true,
		content() {
			"step 0";
			event.cards = [];
			"step 1";
			var next = player.judge(function (card) {
				var color = get.color(card);
				var evt = _status.event.getParent("yjluoshen");
				if (evt) {
					if (!evt.color) {
						evt.color = color;
					} else if (evt.color != color) {
						return -1;
					}
				}
				return 1;
			});
			next.judge2 = function (result) {
				return result.bool;
			};
			if (get.mode() != "guozhan" && !player.hasSkillTag("rejudge")) {
				next.set("callback", function () {
					if (get.position(card, true) == "o") {
						player.gain(card, "gain2");
					}
				});
			} else {
				next.set("callback", function () {
					event.getParent().orderingCards.remove(card);
				});
			}
			"step 2";
			if (result.judge > 0) {
				event.cards.push(result.card);
				player.chooseBool("是否再次发动【洛神】？").set("frequentSkill", "yjluoshen");
			} else {
				for (var i = 0; i < event.cards.length; i++) {
					if (get.position(event.cards[i], true) != "o") {
						event.cards.splice(i, 1);
						i--;
					}
				}
				if (event.cards.length) {
					player.gain(event.cards, "gain2");
				}
				event.finish();
			}
			"step 3";
			if (result.bool) {
				event.goto(1);
			} else {
				if (event.cards.length) {
					player.gain(event.cards, "gain2");
				}
			}
		},
	},
	//用间篇豪华版盒子贾诩
	yjzhenlve: {
		audio: "zhenlue",
		inherit: "zhenlue",
		content() {
			trigger.directHit.addArray(game.players);
		},
	},
	yjjianshu: {
		audio: "jianshu",
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return player.countCards("h") > 0;
		},
		filterTarget(card, player, target) {
			if (target == player) {
				return false;
			}
			if (ui.selected.targets.length) {
				return ui.selected.targets[0] != target && !ui.selected.targets[0].hasSkillTag("noCompareSource") && target.countCards("h") && !target.hasSkillTag("noCompareTarget");
			}
			return true;
		},
		filterCard: true,
		discard: false,
		lose: false,
		delay: false,
		check(card) {
			if (_status.event.player.hp == 1) {
				return 8 - get.value(card);
			}
			return 6 - get.value(card);
		},
		selectTarget: 2,
		targetprompt: ["发起者", "拼点对象"],
		multitarget: true,
		content() {
			"step 0";
			player.give(cards, targets[0], "give");
			"step 1";
			if (targets[0].canCompare(targets[1])) {
				targets[0].chooseToCompare(targets[1]);
			} else {
				event.finish();
			}
			"step 2";
			if (result.bool) {
				targets[1].loseHp();
			} else if (result.tie) {
				targets[0].loseHp();
				targets[1].loseHp();
			} else {
				targets[0].loseHp();
			}
		},
		ai: {
			expose: 0.4,
			order: 4,
			result: {
				target(player, target) {
					if (ui.selected.targets.length) {
						return -1;
					}
					return -0.5;
				},
			},
		},
	},
	yjyongdi: {
		audio: "yongdi",
		limited: true,
		trigger: { player: "phaseZhunbeiBegin" },
		animationColor: "thunder",
		skillAnimation: "legend",
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt2(event.skill), (card, player, target) => {
					return target.hasSex("male") || target.name == "key_yuri";
				})
				.set("ai", target => {
					if (!_status.event.goon) {
						return 0;
					}
					var player = _status.event.player;
					var att = get.attitude(player, target);
					if (att <= 1) {
						return 0;
					}
					var mode = get.mode();
					if (mode == "identity" || (mode == "versus" && _status.mode == "four")) {
						if (
							target.getStockSkills(true, true).some(i => {
								if (target.hasSkill(i)) {
									return false;
								}
								let info = get.info(i);
								return info && info.zhuSkill;
							})
						) {
							return att * 2;
						}
					}
					return att;
				})
				.set("goon", !player.hasUnknown(Math.round(game.players.length / 4 - 0.2)))
				.forResult();
		},
		async content(event, trigger, player) {
			player.awakenSkill(event.name);
			let target = event.targets[0],
				mode = get.mode();
			if (player !== target && (mode !== "identity" || player.identity !== "nei")) {
				player.addExpose(0.3);
			}
			target.gainMaxHp(true);
			target.recover();
			if (mode == "identity" || (mode == "versus" && _status.mode == "four") || mode == "doudizhu") {
				let skills = target.getStockSkills(true, true).filter(i => {
					if (target.hasSkill(i)) {
						return false;
					}
					let info = get.info(i);
					return info && info.zhuSkill;
				});
				if (skills.length) {
					target.addSkills(skills);
				}
			}
		},
	},
	//用间篇豪华版盒子许攸
	yjshicai: {
		audio: "spshicai",
		enable: "phaseUse",
		usable: 1,
		filterCard: true,
		position: "he",
		prompt() {
			var str = "弃置一张牌，然后获得";
			if (get.itemtype(_status.pileTop) == "card") {
				str += get.translation(_status.pileTop);
			} else {
				str += "牌堆顶的一张牌";
			}
			return str;
		},
		check(card) {
			var player = _status.event.player;
			var cardx = _status.pileTop;
			if (get.itemtype(cardx) != "card") {
				return 0;
			}
			var val = player.getUseValue(cardx, null, true);
			if (!val) {
				return 0;
			}
			var val2 = player.getUseValue(card, null, true);
			return (val - val2) / Math.max(0.1, get.value(card));
		},
		group: ["yjshicai_mark"],
		content() {
			var card = get.cards()[0];
			player.gain(card, "gain2").gaintag.add("yjshicai_clear");
			player.addTempSkill("yjshicai_clear", "phaseUseAfter");
		},
		ai: {
			order: 3,
			result: { player: 1 },
		},
		subSkill: {
			mark: {
				trigger: { player: "phaseBegin" },
				silent: true,
				firstDo: true,
				content() {
					player.addTempSkill("spshicai2");
				},
			},
			clear: {
				trigger: {
					player: "loseAfter",
					global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"],
				},
				onremove(player, skill) {
					player.removeGaintag(skill);
				},
				forced: true,
				charlotte: true,
				popup: false,
				filter(event, player) {
					if (event.name == "lose") {
						for (var i in event.gaintag_map) {
							if (event.gaintag_map[i].includes("yjshicai_clear")) {
								return true;
							}
						}
						return false;
					}
					return player.hasHistory("lose", function (evt) {
						if (evt.getParent() != event) {
							return false;
						}
						for (var i in evt.gaintag_map) {
							if (evt.gaintag_map[i].includes("yjshicai_clear")) {
								return true;
							}
						}
					});
				},
				content() {
					delete player.getStat("skill").yjshicai;
				},
			},
		},
	},
	yjchenggong: {
		audio: "chenggong",
		trigger: {
			global: "useCardToPlayered",
		},
		filter(event, player) {
			return event.isFirstTarget && event.targets.length > 1 && event.player.isIn();
		},
		check(event, player) {
			return get.attitude(player, event.player) > 0;
		},
		logTarget: "player",
		content() {
			trigger.player.draw();
		},
		ai: { expose: 0.2 },
	},
	yjzezhu: {
		audio: "zezhu",
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			var zhu = get.zhu(player);
			if (!zhu) {
				return false;
			}
			return zhu.countGainableCards(player, zhu == player ? "ej" : "hej");
		},
		filterTarget(card, player, target) {
			var zhu = get.zhu(player);
			return target == zhu;
		},
		selectTarget: 1,
		content() {
			"step 0";
			player.gainPlayerCard(target, player == target ? "ej" : "hej", true);
			"step 1";
			if (!player.countCards("he") || player == target) {
				event.finish();
			} else {
				player.chooseCard("择主：交给" + get.translation(target) + "一张牌", "he", true);
			}
			"step 2";
			player.give(result.cards, target);
		},
		ai: {
			order: 2.9,
			result: { player: 1 },
		},
	},
	//用间beta董卓
	yjtuicheng: {
		enable: "phaseUse",
		viewAs: { name: "tuixinzhifu", isCard: true },
		filterCard: () => false,
		selectCard: -1,
		log: false,
		precontent() {
			player.logSkill("yjtuicheng");
			player.loseHp();
		},
		ai: {
			effect: {
				player(card, player) {
					if (get.name(card) != "tuixinzhifu" || _status.event.skill != "yjtuicheng") {
						return;
					}
					if (player.hp < 3) {
						return "zeroplayertarget";
					}
					if (player.hasSkill("yjshicha") && !player.hasHistory("useSkill", evt => evt.skill == "yjtuicheng")) {
						return [1, 2];
					}
					return "zeroplayertarget";
				},
			},
		},
	},
	yjyaoling: {
		trigger: {
			player: "phaseUseEnd",
		},
		direct: true,
		content() {
			"step 0";
			player
				.chooseTarget(get.prompt("yjyaoling"), "减1点体力上限，选择一名其他角色A和一名角色B，令A选择对B使用杀或被你弃牌", 2, (card, player, target) => {
					if (!ui.selected.targets.length) {
						return target != player;
					}
					return ui.selected.targets[0].canUse("sha", target, false);
				})
				.set("targetprompt", ["打人", "被打"])
				.set("complexSelect", true)
				.set("ai", target => {
					if (!get.event("check")) {
						return -1;
					}
					var player = _status.event.player;
					if (!ui.selected.targets.length) {
						return get.effect(target, { name: "guohe_copy2" }, player, player);
					}
					var targetx = ui.selected.targets[0];
					return get.effect(target, { name: "sha" }, targetx, player) + 5;
				})
				.set(
					"check",
					(function () {
						if (player.maxHp < 2) {
							return false;
						}
						if (player.hasSkill("yjshicha") && !player.hasHistory("useSkill", evt => evt.skill == "yjtuicheng")) {
							return true;
						}
						if (player.maxHp > 2 && player.getDamagedHp() > 1) {
							return true;
						}
						return false;
					})()
				);
			"step 1";
			if (result.bool) {
				var targets = result.targets;
				event.targets = targets;
				player.logSkill("yjyaoling", targets, false);
				player.line2(targets);
				player.loseMaxHp();
				targets[0]
					.chooseToUse(function (card, player, event) {
						if (get.name(card) != "sha") {
							return false;
						}
						return lib.filter.filterCard.apply(this, arguments);
					}, "耀令：对" + get.translation(targets[1]) + "使用一张杀，或令" + get.translation(player) + "弃置你的一张牌")
					.set("targetRequired", true)
					.set("complexTarget", true)
					.set("filterTarget", function (card, player, target) {
						if (target != _status.event.sourcex && !ui.selected.targets.includes(_status.event.sourcex)) {
							return false;
						}
						return lib.filter.filterTarget.apply(this, arguments);
					})
					.set("sourcex", targets[1]);
			} else {
				event.finish();
			}
			"step 2";
			if (!result.bool && targets[0].countDiscardableCards(player, "he")) {
				player.discardPlayerCard(targets[0], "he", true);
			}
		},
	},
	yjshicha: {
		trigger: { player: "phaseDiscardBegin" },
		forced: true,
		filter(event, player) {
			var tuicheng = false,
				yaoling = false;
			player.getHistory("useSkill", evt => {
				if (evt.skill == "yjtuicheng") {
					tuicheng = true;
				}
				if (evt.skill == "yjyaoling") {
					yaoling = true;
				}
			});
			return !tuicheng && !yaoling;
		},
		content() {
			player.addTempSkill("yjshicha_limit");
		},
		subSkill: {
			limit: {
				charlotte: true,
				mark: true,
				intro: { content: "本回合手牌上限为1" },
				mod: {
					maxHandcard: () => 1,
				},
			},
		},
		ai: {
			neg: true,
		},
	},
	yjyongquan: {
		trigger: { player: "phaseJieshuBegin" },
		zhuSkill: true,
		filter(event, player) {
			return (
				player.hasZhuSkill("yjyongquan") &&
				game.hasPlayer(current => {
					return current != player && player.hasZhuSkill(current) && current.group == "qun";
				})
			);
		},
		logTarget(event, player) {
			return game.filterPlayer(current => {
				return current != player && player.hasZhuSkill(current) && current.group == "qun";
			});
		},
		content() {
			"step 0";
			var targets = lib.skill.yjyongquan.logTarget(trigger, player);
			event.targets = targets;
			"step 1";
			var target = targets.shift();
			event.target = target;
			target
				.chooseCard("拥权：是否交给" + get.translation(player) + "一张牌？", "he")
				.set("ai", card => {
					if (_status.event.goon) {
						return 4.5 - get.value(card);
					}
					return 0;
				})
				.set("goon", get.attitude(target, player) > 3);
			"step 2";
			if (result.bool) {
				target.line(player);
				target.give(result.cards, player);
			}
			"step 3";
			if (targets.length) {
				event.goto(1);
			}
		},
	},
	//用间beta甘宁的新版
	yjjielve: {
		enable: "phaseUse",
		viewAs: { name: "chenghuodajie" },
		filterCard(card, player) {
			if (ui.selected.cards.length) {
				return get.color(card) == get.color(ui.selected.cards[0]);
			}
			var cards = player.getCards("hes");
			for (var cardx of cards) {
				if (card != cardx && get.color(card) == get.color(cardx)) {
					return true;
				}
			}
			return false;
		},
		position: "hes",
		selectCard: 2,
		complexCard: true,
		check(card) {
			return 5 - get.value(card);
		},
		onuse(links, player) {
			player.addTempSkill("yjjielve_check");
		},
		subSkill: {
			check: {
				trigger: { source: "damageSource" },
				forced: true,
				charlotte: true,
				popup: false,
				filter(event, player) {
					return event.card && event.card.name == "chenghuodajie" && event.getParent().skill == "yjjielve";
				},
				content() {
					player.tempBanSkill("yjjielve");
				},
			},
		},
	},
	//用间beta张飞
	yjmangji: {
		forced: true,
		trigger: {
			player: ["loseAfter", "damageEnd", "loseHpEnd", "recoverEnd"],
			global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"],
		},
		direct: true,
		filter(event, player) {
			if (player.hp < 1 || !player.countDiscardableCards(player, "h")) {
				return false;
			}
			if (["damage", "loseHp", "recover"].includes(event.name)) {
				return true;
			}
			var evt = event.getl(player);
			if (event.name == "equip" && event.player == player) {
				return !evt || evt.cards.length != 1;
			}
			if (!evt || !evt.es.length) {
				return false;
			}
			return game.hasPlayer(current => player.canUse("sha", current, false));
		},
		content() {
			"step 0";
			player.chooseCardTarget({
				prompt: "莽击：弃置一张手牌，视为对一名其他角色使用一张【杀】",
				forced: true,
				filterCard: lib.filter.cardDiscardable,
				filterTarget(card, player, target) {
					return player.canUse("sha", target, false);
				},
				ai2(target) {
					return get.effect(target, { name: "sha" }, _status.event.player);
				},
			});
			"step 1";
			if (result.bool) {
				var target = result.targets[0],
					cards = result.cards;
				player.logSkill("yjmangji", target);
				player.discard(cards);
				if (player.canUse("sha", target, false)) {
					player.useCard({ name: "sha", isCard: true }, target, false);
				}
			}
		},
	},
	//用间beta曹洪
	yjlifeng: {
		enable: "phaseUse",
		usable: 1,
		locked: false,
		filter(event, player) {
			for (var card of ui.discardPile.childNodes) {
				if (get.type(card) == "equip") {
					return true;
				}
			}
			return false;
		},
		content() {
			"step 0";
			var cards = Array.from(ui.discardPile.childNodes).filter(i => get.type(i) == "equip");
			player.chooseButton(["厉锋：获得一张装备牌", cards], cards.length > 0).set("ai", get.buttonValue);
			"step 1";
			if (result.bool) {
				var card = result.links[0];
				player.gain(card, "gain2");
			}
		},
		ai: {
			order: 10,
			result: { player: 1 },
			effect: {
				target(card, player, target) {
					if (card && get.type(card) == "equip" && _status.event.skill == "_gifting") {
						return 0;
					}
				},
			},
		},
		mod: {
			cardGiftable(card, player) {
				return get.type(card) == "equip";
			},
		},
	},
	//用间篇李儒
	yjdumou: {
		forced: true,
		mod: {
			cardname(card, player, name) {
				if (player == _status.currentPhase && card.name == "du") {
					return "guohe";
				}
			},
			aiValue(player, card, num) {
				if (card.name == "du") {
					return get.value({ name: "guohe" });
				}
			},
		},
		init: () => {
			game.addGlobalSkill("yjdumou_du");
			game.addGlobalSkill("g_du");
		},
		onremove: () => {
			if (!game.hasPlayer(i => i.hasSkill("yjdumou", null, null, false), true)) {
				game.removeGlobalSkill("yjdumou_du");
			}
		},
		subSkill: {
			du: {
				mod: {
					cardname(card, player, name) {
						if (_status.currentPhase && player != _status.currentPhase && _status.currentPhase.hasSkill("yjdumou") && get.color(card) == "black") {
							return "du";
						}
					},
					aiValue(player, card, num) {
						if (get.name(card) == "du" && card.name != "du") {
							return get.value({ name: card.name });
						}
					},
				},
				trigger: { player: "dieAfter" },
				filter: () => {
					return !game.hasPlayer(i => i.hasSkill("yjdumou", null, null, false), true);
				},
				silent: true,
				forceDie: true,
				content: () => {
					game.removeGlobalSkill("yjdumou_du");
				},
			},
		},
		ai: { threaten: 2.1 },
	},
	yjweiquan: {
		enable: "phaseUse",
		skillAnimation: true,
		animationColor: "soil",
		filterTarget: true,
		limited: true,
		selectTarget: () => [1, game.roundNumber],
		contentBefore() {
			"step 0";
			player.awakenSkill("yjweiquan");
			player.chooseTarget("威权：选择获得牌的角色", true).set("ai", target => {
				var att = get.attitude(_status.event.player, target),
					num = target.needsToDiscard(targets.filter(i => i != target && i.countCards("h")).length);
				if (att > 0 && num <= 2) {
					return 0;
				}
				if (att < 0 && target.needsToDiscard(-5)) {
					return -att - Math.sqrt(num);
				}
				return att - Math.sqrt(num);
			});
			"step 1";
			event.getParent()._yjweiquan = result.targets[0];
		},
		content() {
			"step 0";
			var targetx = event.getParent()._yjweiquan;
			if (target == targetx || !target.countCards("h")) {
				event.finish();
			} else {
				target.chooseCard("威权：将一张手牌交给" + get.translation(targetx), true);
			}
			"step 1";
			if (result.bool) {
				var targetx = event.getParent()._yjweiquan;
				target.give(result.cards, targetx);
			}
		},
		contentAfter() {
			var targetx = event.getParent()._yjweiquan;
			if (targetx.countCards("h") > targetx.hp) {
				var next = targetx.phase();
				event.next.remove(next);
				event.getParent().after.push(next);
				next.player = targetx;
				next._noTurnOver = true;
				next._triggered = null;
				next.setContent(function () {
					game.broadcastAll(function () {
						if (ui.tempnowuxie) {
							ui.tempnowuxie.close();
							delete ui.tempnowuxie;
						}
					});
					player.phaseDiscard();
					if (!player.noPhaseDelay) {
						game.delayx();
					}
					delete player._noSkill;
				});
			}
		},
		ai: {
			order: 6,
			result: {
				player(player) {
					var num = game.countPlayer(current => get.attitude(player, current) < 0 && current.countCards("h"));
					if (
						(game.roundNumber < num && player.hp > 2) ||
						!game.hasPlayer(current => {
							return (get.attitude(player, current) > 0 && current.needsToDiscard(num) < 2) || (get.attitude(player, current) < 0 && current.needsToDiscard(-5));
						})
					) {
						return -10;
					}
					return 1;
				},
				target: -1,
			},
		},
	},
	yjrenwang: {
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			for (var card of ui.discardPile.childNodes) {
				if (get.color(card) == "black" && get.type(card) == "basic") {
					return true;
				}
			}
			return false;
		},
		content() {
			"step 0";
			var cards = Array.from(ui.discardPile.childNodes).filter(i => get.color(i) == "black" && get.type(i) == "basic");
			player.chooseButton(["人望：选择一张黑色基本牌", cards], cards.length > 0).set("ai", get.buttonValue);
			"step 1";
			if (result.bool) {
				var card = result.links[0];
				event.card = card;
				player.chooseTarget("选择一名角色获得" + get.translation(card), true).set("ai", target => get.attitude(_status.event.player, target));
			} else {
				event.finish();
			}
			"step 2";
			if (result.bool) {
				var target = result.targets[0];
				player.line(target);
				target.gain(card, "gain2");
			}
		},
		ai: {
			order: 10,
			result: { player: 1 },
		},
	},
	//群曹操
	yjxiandao: {
		trigger: { player: "giftAccepted" },
		usable: 1,
		forced: true,
		locked: false,
		filter: (event, player) => event.target != player && event.target.isIn(),
		logTarget: "target",
		content() {
			"step 0";
			event.target = trigger.target;
			event.card = trigger.card;
			event.target.markAuto("yjxiandao_block", [get.suit(event.card, false)]);
			event.target.addTempSkill("yjxiandao_block");
			"step 1";
			var type = get.type(card);
			if (type == "trick") {
				player.draw(2);
			}
			if (type == "equip") {
				if (
					target.countGainableCards(player, "he", function (cardx) {
						return cardx != card;
					}) > 0
				) {
					player
						.gainPlayerCard(target, "he", true)
						.set("card", card)
						.set("filterButton", function (button) {
							return button.link != _status.event.card;
						});
				}
				if (get.subtype(card, false) == "equip1") {
					target.damage();
				}
			}
		},
		subSkill: {
			block: {
				charlotte: true,
				onremove: true,
				mod: {
					cardEnabled(card, player) {
						if (player.getStorage("yjxiandao_block").includes(get.suit(card))) {
							return false;
						}
					},
					cardRespondable(card, player) {
						if (player.getStorage("yjxiandao_block").includes(get.suit(card))) {
							return false;
						}
					},
					cardSavable(card, player) {
						if (player.getStorage("yjxiandao_block").includes(get.suit(card))) {
							return false;
						}
					},
				},
				mark: true,
				intro: { content: "不能使用或打出$牌" },
			},
		},
	},
	yjsancai: {
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return player.countCards("h") > 0;
		},
		content() {
			"step 0";
			player.showHandcards();
			var hs = player.getCards("h");
			if (hs.length > 1) {
				var type = get.type2(hs[0], player);
				for (var i = 1; i < hs.length; i++) {
					if (get.type(hs[i]) != type) {
						event.finish();
						return;
					}
				}
			}
			"step 1";
			player.chooseCardTarget({
				prompt: "是否赠予一张手牌？",
				filterCard: true,
				filterTarget: lib.filter.notMe,
			});
			"step 2";
			if (result.bool) {
				var target = result.targets[0];
				player.line(target, "green");
				player.gift(result.cards, target);
			}
		},
		ai: {
			combo: "yixiandao",
		},
	},
	yjyibing: {
		trigger: {
			player: "gainAfter",
			global: "loseAsyncAfter",
		},
		direct: true,
		filter(event, player) {
			if (event.getParent().name == "gift") {
				return false;
			}
			if (event.getParent("yjyibing").player == player) {
				return false;
			}
			var evt = event.getParent("phaseDraw"),
				hs = player.getCards("h"),
				cards = event.getg(player);
			return (
				cards.length > 0 &&
				(!evt || evt.player != player) &&
				cards.filter(function (card) {
					return hs.includes(card) && game.checkMod(card, player, "unchanged", "cardEnabled2", player) !== false;
				}).length == cards.length &&
				player.hasUseTarget(
					{
						name: "sha",
						cards: event.cards,
					},
					false
				)
			);
		},
		content() {
			var cards = trigger.getg(player);
			player.chooseUseTarget(get.prompt("yjyibing"), "将" + get.translation(cards) + "当做【杀】使用", { name: "sha" }, cards, false, "nodistance").logSkill = "yjyibing";
		},
	},
	//龙羽飞
	longyi: {
		enable: ["chooseToUse", "chooseToRespond"],
		filter(event, player) {
			if (event.type == "wuxie") {
				return false;
			}
			var hs = player.getCards("h");
			if (!hs.length) {
				return false;
			}
			for (var i of hs) {
				if (game.checkMod(i, player, "unchanged", "cardEnabled2", player) === false) {
					return false;
				}
			}
			for (var i of lib.inpile) {
				if (i != "du" && get.type(i) == "basic" && event.filterCard({ name: i, cards: hs }, player, event)) {
					return true;
				}
				if (i == "sha") {
					var list = ["fire", "thunder", "ice"];
					for (var j of list) {
						if (event.filterCard({ name: i, nature: j, cards: hs }, player, event)) {
							return true;
						}
					}
				}
			}
			return false;
		},
		chooseButton: {
			dialog(event, player) {
				var vcards = [],
					hs = player.getCards("h");
				for (var i of lib.inpile) {
					if (i != "du" && get.type(i) == "basic" && event.filterCard({ name: i, cards: hs }, player, event)) {
						vcards.push(["基本", "", i]);
					}
					if (i == "sha") {
						for (var j of lib.inpile_nature) {
							if (event.filterCard({ name: i, nature: j, cards: hs }, player, event)) {
								vcards.push(["基本", "", i, j]);
							}
						}
					}
				}
				return ui.create.dialog("龙裔", [vcards, "vcard"]);
			},
			check(button, player) {
				if (_status.event.getParent().type != "phase") {
					return 1;
				}
				return _status.event.player.getUseValue({
					name: button.link[2],
					nature: button.link[3],
				});
			},
			backup(links, player) {
				return {
					audio: "longyi",
					popname: true,
					viewAs: { name: links[0][2], nature: links[0][3] },
					filterCard: true,
					selectCard: -1,
					position: "h",
				};
			},
			prompt(links, player) {
				return "将所有手牌当做" + (get.translation(links[0][3]) || "") + get.translation(links[0][2]) + "使用或打出";
			},
		},
		hiddenCard(player, name) {
			return name != "du" && get.type(name) == "basic" && player.countCards("h") > 0;
		},
		ai: {
			respondSha: true,
			respondShan: true,
			skillTagFilter(player) {
				return player.countCards("h") > 0;
			},
			order: 0.5,
			result: {
				player(player) {
					if (_status.event.dying) {
						return get.attitude(player, _status.event.dying);
					}
					if (_status.event.type == "respondShan") {
						return 1;
					}
					var val = 0,
						hs = player.getCards("h"),
						max = 0;
					for (var i of hs) {
						val += get.value(i, player);
						if (get.type(i, null, player) == "trick") {
							max += 5;
						}
					}
					if (player.hasSkill("zhenjue")) {
						max += 7;
					}
					return val <= max ? 1 : 0;
				},
			},
		},
		group: "longyi_effect",
		subSkill: {
			effect: {
				trigger: { player: ["useCard", "respond"] },
				forced: true,
				charlotte: true,
				popup: false,
				filter(event, player) {
					if (event.skill != "longyi_backup") {
						return false;
					}
					for (var i of event.cards) {
						var type = get.type2(i, player);
						if (type == "equip" || type == "trick") {
							return true;
						}
					}
					return false;
				},
				content() {
					var map = {};
					for (var i of trigger.cards) {
						map[get.type2(i, player)] = true;
					}
					if (map.trick) {
						player.draw();
					}
					if (map.equip && trigger.directHit) {
						trigger.directHit.addArray(game.players);
					}
				},
			},
			backup: {},
		},
	},
	zhenjue: {
		trigger: { global: "phaseJieshuBegin" },
		filter(event, player) {
			return player.countCards("h") == 0;
		},
		logTarget: "player",
		content() {
			"step 0";
			trigger.player
				.chooseToDiscard("he", "弃置一张牌，或令" + get.translation(player) + "摸一张牌")
				.set("ai", function (card) {
					if (_status.event.goon) {
						return 7 - get.value(card);
					}
					return -get.value(card);
				})
				.set("goon", get.attitude(trigger.player, player) < 0);
			"step 1";
			if (!result.bool) {
				player.draw();
			}
		},
	},
	//群刘备
	jsprende: {
		audio: "rerende",
		enable: "phaseUse",
		filterCard: true,
		selectCard: [1, Infinity],
		discard: false,
		lose: false,
		delay: false,
		filterTarget(card, player, target) {
			return player != target;
		},
		onremove: true,
		check(card) {
			if (ui.selected.cards.length && ui.selected.cards[0].name == "du") {
				return 0;
			}
			if (!ui.selected.cards.length && card.name == "du") {
				return 20;
			}
			var player = get.owner(card);
			if (ui.selected.cards.length >= Math.max(2, player.countCards("h") - player.hp)) {
				return 0;
			}
			if (player.hp == player.maxHp || player.storage.jsprende < 0 || player.countCards("h") <= 1) {
				var players = game.filterPlayer();
				for (var i = 0; i < players.length; i++) {
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
		content() {
			"step 0";
			var evt = _status.event.getParent("phaseUse");
			if (evt && evt.name == "phaseUse" && !evt.jsprende) {
				var next = game.createEvent("jsprende_clear");
				_status.event.next.remove(next);
				evt.after.push(next);
				evt.jsprende = true;
				next.player = player;
				next.setContent(function () {
					delete player.storage.jsprende;
				});
			}
			player.give(cards, target);
			if (typeof player.storage.jsprende != "number") {
				player.storage.jsprende = 0;
			}
			if (player.storage.jsprende >= 0) {
				player.storage.jsprende += cards.length;
				if (player.storage.jsprende >= 2) {
					var list = [];
					if (
						lib.filter.cardUsable({ name: "sha", isCard: true }, player, event.getParent("chooseToUse")) &&
						game.hasPlayer(function (current) {
							return player.canUse("sha", current);
						})
					) {
						list.push(["基本", "", "sha"]);
					}
					for (var i of lib.inpile_nature) {
						if (
							lib.filter.cardUsable({ name: "sha", nature: i, isCard: true }, player, event.getParent("chooseToUse")) &&
							game.hasPlayer(function (current) {
								return player.canUse({ name: "sha", nature: i, isCard: true }, current);
							})
						) {
							list.push(["基本", "", "sha", i]);
						}
					}
					if (
						lib.filter.cardUsable({ name: "tao", isCard: true }, player, event.getParent("chooseToUse")) &&
						game.hasPlayer(function (current) {
							return player.canUse("tao", current);
						})
					) {
						list.push(["基本", "", "tao"]);
					}
					if (
						lib.filter.cardUsable({ name: "jiu", isCard: true }, player, event.getParent("chooseToUse")) &&
						game.hasPlayer(function (current) {
							return player.canUse("jiu", current);
						})
					) {
						list.push(["基本", "", "jiu"]);
					}
					if (list.length) {
						player.chooseButton(["是否视为使用一张基本牌？", [list, "vcard"]]).set("ai", function (button) {
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
						});
					} else {
						event.finish();
					}
					player.storage.jsprende = -1;
				} else {
					event.finish();
				}
			} else {
				event.finish();
			}
			"step 1";
			if (result && result.bool && result.links[0]) {
				var card = { name: result.links[0][2], nature: result.links[0][3], isCard: true };
				player.chooseUseTarget(card, true);
			}
		},
		ai: {
			fireAttack: true,
			order(skill, player) {
				if (player.hp < player.maxHp && player.storage.jsprende < 2 && player.countCards("h") > 1) {
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
					var nh = target.countCards("h");
					var np = player.countCards("h");
					if (player.hp == player.maxHp || player.storage.jsprende < 0 || player.countCards("h") <= 1) {
						if (nh >= np - 1 && np <= player.hp && !target.hasSkill("haoshi")) {
							return 0;
						}
					}
					return Math.max(1, 5 - nh);
				},
			},
			effect: {
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
	},
	//曹安民
	nskuishe: {
		enable: "phaseUse",
		usable: 1,
		filterTarget(card, player, target) {
			return target != player && target.countCards("he") > 0;
		},
		content() {
			"step 0";
			player.choosePlayerCard(target, "he", true).set("ai", get.buttonValue);
			"step 1";
			if (result.bool) {
				var card = result.cards[0];
				event.card = card;
				player
					.chooseTarget("将" + get.translation(target) + "的" + (get.position(card) == "h" && !player.hasSkillTag("viewHandcard", null, target, true) ? "手牌" : get.translation(card)) + "交给一名角色", true, function (target) {
						return target != _status.event.getParent().target;
					})
					.set("ai", function (target) {
						var att = get.attitude(_status.event.player, target);
						if (_status.event.du) {
							if (target.hasSkillTag("nodu")) {
								return 0;
							}
							return -att;
						}
						if (target.hasSkillTag("nogain")) {
							return 0.1;
						}
						if (att > 0) {
							return att + Math.max(0, 5 - target.countCards("h"));
						}
						return att;
					})
					.set("du", event.card.name == "du");
			} else {
				event.finish();
			}
			"step 2";
			if (result.bool) {
				var target2 = result.targets[0];
				target.line(target2, "green");
				target2.gain(target, card, "giveAuto").giver = player;
			} else {
				event.finish();
			}
			"step 3";
			target
				.chooseToUse(function (card, player, event) {
					if (get.name(card) != "sha") {
						return false;
					}
					return lib.filter.filterCard.apply(this, arguments);
				}, "是否对" + get.translation(player) + "使用一张杀？")
				.set("targetRequired", true)
				.set("complexSelect", true)
				.set("complexTarget", true)
				.set("filterTarget", function (card, player, target) {
					if (target != _status.event.sourcex && !ui.selected.targets.includes(_status.event.sourcex)) {
						return false;
					}
					return lib.filter.filterTarget.apply(this, arguments);
				})
				.set("sourcex", player);
		},
		ai: {
			order: 6,
			expose: 0.2,
			result: {
				target: -1.5,
				player(player, target) {
					if (!target.canUse("sha", player)) {
						return 0;
					}
					if (target.countCards("h") == 1) {
						return 0.1;
					}
					if (player.hasShan()) {
						return -0.5;
					}
					if (player.hp <= 1) {
						return -2;
					}
					if (player.hp <= 2) {
						return -1;
					}
					return 0;
				},
			},
		},
	},
	//文和乱武
	nsyangwu: {
		enable: "phaseUse",
		usable: 1,
		filterCard: { suit: "heart" },
		filterTarget(card, player, target) {
			return target != player && target.countCards("h") > player.countCards("h");
		},
		filter(event, player) {
			var info = lib.skill.nsyangwu;
			return (
				player.countCards("h", info.filterCard) &&
				game.hasPlayer(function (target) {
					return info.filterTarget(null, player, target);
				})
			);
		},
		check(card) {
			var num = 0;
			var player = _status.event.player;
			game.countPlayer(function (current) {
				if (current != player && get.attitude(player, current) < 0) {
					num = Math.max(num, current.countCards("h") - player.countCards("h"));
				}
			});
			return Math.ceil((num + 1) / 2) * 2 + 4 - get.value(card);
		},
		content() {
			var num = Math.ceil((target.countCards("h") - player.countCards("h")) / 2);
			if (num) {
				player.gainPlayerCard(target, true, "h", num, "visible");
			}
		},
		ai: {
			order: 4,
			result: {
				target(player, target) {
					return player.countCards("h") - target.countCards("h");
				},
			},
		},
	},
	nslulve: {
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return game.hasPlayer(function (current) {
				return current.countCards("e") > 0 && current.countCards("e") <= player.countCards("he");
			});
		},
		filterCard() {
			if (ui.selected.targets.length) {
				return false;
			}
			return true;
		},
		position: "he",
		selectCard: [1, Infinity],
		complexSelect: true,
		complexCard: true,
		filterTarget(card, player, target) {
			return target != player && target.countCards("e") > 0 && ui.selected.cards.length == target.countCards("e");
		},
		check(card) {
			var player = _status.event.player;
			if (
				game.hasPlayer(function (current) {
					return current != player && current.countCards("e") > 0 && ui.selected.cards.length == current.countCards("e") && get.damageEffect(current, player, player) > 0;
				})
			) {
				return 0;
			}
			switch (ui.selected.cards.length) {
				case 0:
					return 8 - get.value(card);
				case 1:
					return 6 - get.value(card);
				case 2:
					return 3 - get.value(card);
				default:
					return 0;
			}
		},
		content() {
			target.damage("nocard");
		},
		ai: {
			damage: true,
			order: 2,
			result: {
				target(player, target) {
					return get.damageEffect(target, player);
				},
			},
			expose: 0.3,
		},
	},
	nsfeixiong: {
		trigger: { player: "phaseUseBegin" },
		direct: true,
		filter(event, player) {
			return (
				player.countCards("h") > 0 &&
				game.hasPlayer(function (current) {
					return current != player && player.canCompare(current);
				})
			);
		},
		content() {
			"step 0";
			player
				.chooseTarget(get.prompt2("nsfeixiong"), function (card, player, target) {
					return player != target && player.canCompare(target);
				})
				.set("ai", function (target) {
					var player = _status.event.player;
					var hs = player.getCards("h").sort(function (a, b) {
						return b.number - a.number;
					});
					var ts = target.getCards("h").sort(function (a, b) {
						return b.number - a.number;
					});
					if (!hs.length || !ts.length) {
						return 0;
					}
					if (hs[0].number > ts[0].number) {
						return get.damageEffect(target, player, player);
					}
					return 0;
				});
			"step 1";
			if (result.bool) {
				var target = result.targets[0];
				event.target = target;
				player.logSkill("nsfeixiong", target);
				if (get.mode() !== "identity" || player.identity !== "nei") {
					player.addExpose(0.2);
				}
				player.chooseToCompare(target);
			} else {
				event.finish();
			}
			"step 2";
			if (!result.tie) {
				var targets = [player, target];
				if (result.bool) {
					targets.reverse();
				}
				targets[0].damage(targets[1]);
			}
		},
	},
	nscesuan: {
		trigger: { player: "damageBegin3" },
		forced: true,
		content() {
			"step 0";
			trigger.cancel();
			event.lose = player.loseMaxHp();
			"step 1";
			if (event.lose && event.lose.loseHp) {
				player.draw();
			}
		},
		ai: {
			neg: true,
			filterDamage: true,
			skillTagFilter(player, tag, arg) {
				if (tag === "filterDamage" && arg && arg.player) {
					if (arg.player.hasSkillTag("jueqing", false, player)) {
						return false;
					}
				}
			},
		},
	},
	//S贾诩
	nsyice: {
		trigger: {
			player: "loseAfter",
			global: ["cardsDiscardAfter", "loseAsyncAfter"],
		},
		filter(event, player) {
			if (event.name != "cardsDiscard") {
				if (event.type != "discard") {
					return false;
				}
				var evt = event.getl(player);
				return evt.cards2 && evt.cards2.filterInD("d").length > 0;
			} else {
				var evt = event.getParent();
				if (evt.name != "orderingDiscard" || !evt.relatedEvent || evt.relatedEvent.player != player || !["useCard", "respond"].includes(evt.relatedEvent.name)) {
					return false;
				}
				return event.cards.filterInD("d").length > 0;
			}
		},
		forced: true,
		content() {
			"step 0";
			var evt = trigger.getParent().relatedEvent;
			if ((trigger.name == "discard" && !trigger.delay) || (evt && evt.name == "respond")) {
				game.delayx();
			}
			"step 1";
			var cards;
			if (trigger.getl) {
				cards = trigger.getl(player).cards2.filterInD("d");
			} else {
				cards = trigger.cards.filterInD("d");
			}
			if (cards.length == 1) {
				event._result = { bool: true, links: cards };
			} else {
				var dialog = ["遗策：选择要放置的卡牌", '<div class="text center">（从左到右为从旧到新，后选择的后置入）</div>', cards];
				var cards2 = player.getExpansions("nsyice");
				cards2.reverse();
				if (cards2.length) {
					dialog.push('<div class="text center">原有“策”</div>');
					dialog.push(cards2);
				}
				player
					.chooseButton(dialog, true, cards.length)
					.set("filterButton", function (button) {
						return _status.event.cards.includes(button.link);
					})
					.set("cards", cards);
			}
			"step 2";
			player.addToExpansion(result.links, "gain2").gaintag.add("nsyice");
			"step 3";
			var storage = player.getExpansions("nsyice");
			var bool = false;
			for (var i = 0; i < storage.length; i++) {
				for (var j = storage.length - 1; j > i; j--) {
					if (get.number(storage[i]) == get.number(storage[j])) {
						bool = true;
						break;
					}
				}
				if (bool) {
					break;
				}
			}
			if (bool) {
				event.cards = storage.splice(i, j - i + 1);
			} else {
				event.finish();
			}
			"step 4";
			var cardsx = [];
			cardsx.push(cards.shift());
			cardsx.push(cards.pop());
			if (cards.length) {
				player.gain(cards, "gain2");
			}
			event.cards = cardsx;
			"step 5";
			player.chooseButton(["将一张牌置于牌堆顶，将另一张牌置于牌堆底", cards], true);
			"step 6";
			player.lose(event.cards, ui.cardPile).set("topper", result.links[0]).insert_index = function (event, card) {
				if (card == event.topper) {
					return ui.cardPile.firstChild;
				}
				return null;
			};
			if (_status.dying.length) {
				event.finish();
			}
			"step 7";
			player.chooseTarget("对一名角色造成1点伤害", true).set("ai", function (target) {
				var player = _status.event.player;
				return get.damageEffect(target, player, player);
			});
			"step 8";
			if (result.bool) {
				var target = result.targets[0];
				player.line(target);
				target.damage("nocard");
			}
		},
		onremove(player, skill) {
			var cards = player.getExpansions(skill);
			if (cards.length) {
				player.loseToDiscardpile(cards);
			}
		},
		marktext: "策",
		intro: {
			content: "expansion",
			markcount: "expansion",
		},
	},
	//用间篇
	yjxuepin: {
		enable: "phaseUse",
		usable: 1,
		filterTarget(event, player, target) {
			return player.inRange(target) && target.countDiscardableCards(player, "he") > 0;
		},
		content() {
			"step 0";
			player.loseHp();
			"step 1";
			if (target.countDiscardableCards(player, "he") > 0) {
				player.discardPlayerCard(target, 2, "he", true);
			} else {
				event.finish();
			}
			"step 2";
			if (result.bool && result.cards.length == 2 && get.type2(result.cards[0], result.cards[0].original == "h" ? target : false) == get.type2(result.cards[1], result.cards[1].original == "h" ? target : false)) {
				player.recover();
			}
		},
		ai: {
			order: 4,
			result: {
				player(player, target) {
					if (player.hp == 1) {
						return -8;
					}
					if (target.countCards("e") > 1) {
						return 0;
					}
					if (player.hp > 2 || target.countCards("h") > 1) {
						return -0.5;
					}
					return -2;
				},
				target(player, target) {
					if (target.countDiscardableCards(player, "he") < 2) {
						return 0;
					}
					return -2;
				},
			},
		},
	},
	nsjianglie: {
		trigger: { player: "useCardToPlayered" },
		filter(event, player) {
			return event.card.name == "sha" && event.target.countCards("h") > 0;
		},
		check(event, player) {
			return get.attitude(player, event.target) < 0;
		},
		logTarget: "target",
		content() {
			"step 0";
			trigger.target.showHandcards();
			"step 1";
			var cards = trigger.target.getCards("h");
			var list = [];
			for (var i = 0; i < cards.length; i++) {
				list.add(get.color(cards[i]));
			}
			if (list.length == 1) {
				event._result = { control: list[0] };
			} else {
				list.sort();
				trigger.target
					.chooseControl(list)
					.set("prompt", "选择弃置一种颜色的所有手牌")
					.set("ai", function () {
						var player = _status.event.player;
						if (get.value(player.getCards("h", { color: "red" })) >= get.value(player.getCards("h", { color: "black" }))) {
							return "black";
						}
						return "red";
					});
			}
			"step 2";
			trigger.target.discard(trigger.target.getCards("h", { color: result.control }));
		},
	},
	//桌游志贴纸
	spyinzhi: {
		trigger: { player: "damageEnd" },
		frequent: true,
		filter(event, player) {
			return event.num > 0;
		},
		getIndex: event => event.num,
		async content(event, trigger, player) {
			let cards = get.cards(2);
			await game.cardsGotoOrdering(cards);
			await player.showCards(cards);
			const { source } = trigger;
			let count = cards.filter(card => get.suit(card) == "spade").length;
			while (count-- && source?.isIn() && game.hasPlayer(current => current != source && source.countGainableCards(current, "h"))) {
				const { result } = await player
					.chooseTarget(`令一名角色获得${get.translation(source)}的一张手牌`, (card, player, target) => {
						const source = get.event().source;
						return target != source && source.countGainableCards(target, "h");
					})
					.set("source", source)
					.set("ai", target => {
						const { player, source } = get.event();
						return get.effect(target, { name: "shunshou_copy", position: "h" }, source, player);
					});
				if (result?.targets?.length) {
					const [target] = result.targets;
					player.line([source, target], "green");
					if (source.countGainableCards(target, "h")) {
						await target.gainPlayerCard(source, "h", true);
					}
				}
			}
			cards = cards.filter(card => get.suit(card) != "spade");
			if (cards.length) {
				await player.gain(cards, "gain2", "log");
			}
		},
	},
	spmingjian: {
		trigger: { global: "phaseBegin" },
		direct: true,
		filter(event, player) {
			return player.countCards("he") > 0;
		},
		content() {
			"step 0";
			var next = player.chooseCard(get.prompt2("spmingjian", trigger.player), "he");
			next.set("ai", function (card) {
				var target = _status.event.getTrigger().player;
				var player = _status.event.player;
				if (get.attitude(player, target) > 0 && target.countCards("j") > 0) {
					return 5 - get.value(card);
				}
				return -1;
			});
			next.set("filterCard", function (card, player) {
				if (get.position(card) == "e") {
					return lib.filter.cardDiscardable.apply(this, arguments);
				}
				return true;
			});
			//next.set('logSkill',['spmingjian',trigger.player]);
			"step 1";
			if (result.bool) {
				player.logSkill("spmingjian", trigger.player);
				var card = result.cards[0];
				event.card = card;
				if (get.position(card) == "e") {
					event._result = { index: 0 };
				} else if (!lib.filter.cardDiscardable(card, player, event)) {
					event._result = { index: 1 };
				} else {
					var name = get.translation(trigger.player);
					player
						.chooseControl()
						.set("choiceList", ["令" + name + "跳过本回合的判定阶段", "令" + name + "于本回合的判定中不触发「判定结果生效前」的时机"])
						.set("ai", function () {
							return 0;
						});
				}
			} else {
				event.finish();
			}
			"step 2";
			if (result.index == 0) {
				player.discard(card);
				trigger.player.skip("phaseJudge");
			} else {
				trigger.player.addToExpansion(card, player, "giveAuto").gaintag.add("spmingjian_charlotte");
				trigger.player.addSkill("spmingjian_charlotte");
			}
		},
		ai: {
			expose: 0.25,
		},
	},
	spmingjian_charlotte: {
		trigger: { player: ["judgeBefore", "phaseAfter"] },
		forced: true,
		firstDo: true,
		silent: true,
		popup: false,
		charlotte: true,
		sourceSkill: "spmingjian",
		content() {
			if (trigger.name == "phase") {
				player.removeSkill(event.name);
			} else {
				trigger.noJudgeTrigger = true;
			}
		},
		onremove(player, skill) {
			var cards = player.getExpansions(skill);
			if (cards.length) {
				player.loseToDiscardpile(cards);
			}
		},
		marktext: "鉴",
		intro: {
			name: "明鉴",
			content: "expansion",
			markcount: "expansion",
		},
	},
	spshude: {
		trigger: { player: "phaseJieshuBegin" },
		frequent: true,
		filter(event, player) {
			return player.countCards("h") < player.maxHp;
		},
		content() {
			player.drawTo(player.maxHp);
		},
	},
	spfuluan: {
		enable: "phaseUse",
		usable: 1,
		filterTarget(card, player, target) {
			return player.inRange(target);
		},
		selectCard: 3,
		position: "he",
		check(card) {
			return 5 - get.value(card);
		},
		complexCard: true,
		filterCard(card, player) {
			if (!ui.selected.cards.length) {
				return player.countCards("he", { suit: get.suit(card) }) > 2;
			}
			return get.suit(card) == get.suit(ui.selected.cards[0]);
		},
		content() {
			target.turnOver();
			player.addTempSkill("spfuluan2");
		},
		ai: {
			order: 1,
			result: {
				target(player, target) {
					if (target.isTurnedOver()) {
						return 2;
					}
					return -1;
				},
			},
		},
	},
	spfuluan2: {
		mod: {
			cardEnabled(card) {
				if (card.name == "sha") {
					return false;
				}
			},
		},
	},
	spzhaoxin: {
		trigger: { player: "phaseDrawEnd" },
		check(event, player) {
			return player.getUseValue({ name: "sha", isCard: true }) > 0;
		},
		filter(event, player) {
			return player.countCards("h") > 0;
		},
		content() {
			"step 0";
			player.showHandcards();
			"step 1";
			player.chooseUseTarget("sha", false);
		},
	},
	splanggu: {
		trigger: { player: "damageEnd" },
		filter(event, player) {
			return get.itemtype(event.source) == "player";
		},
		logTarget: "source",
		content() {
			"step 0";
			player.judge();
			"step 1";
			if (trigger.source.countCards("h") > 0) {
				var next = player.discardPlayerCard(trigger.source, "h", [1, Infinity]);
				next.set("suit", result.suit);
				next.set("filterButton", function (button) {
					return get.suit(button.link) == _status.event.suit;
				});
				next.set("visible", true);
			}
		},
		group: "splanggu_rewrite",
	},
	splanggu_rewrite: {
		trigger: { player: "judge" },
		sourceSkill: "splanggu",
		filter(event, player) {
			return player.countCards("hs") > 0 && event.getParent().name == "splanggu";
		},
		direct: true,
		content() {
			"step 0";
			player
				.chooseCard("狼顾的判定结果为" + get.translation(trigger.player.judging[0]) + "，是否打出一张手牌进行代替？", "hs", function (card) {
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
					return -1;
				});
			"step 1";
			if (result.bool) {
				player.respond(result.cards, "highlight", "splanggu", "noOrdering");
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
	},
	sphantong: {
		trigger: {
			player: "loseEnd",
		},
		frequent: true,
		filter(event, player) {
			return event.type == "discard" && event.getParent(3).name == "phaseDiscard" && event.cards.filterInD("d").length > 0;
		},
		content() {
			if (!player.storage.sphantong) {
				player.storage.sphantong = [];
			}
			var cards = trigger.cards.filterInD("d");
			player.storage.sphantong.addArray(cards);
			player.$gain2(cards);
			game.log(player, "将", cards, "置于武将牌上");
			player.markSkill("sphantong");
		},
		group: ["sphantong_gain"],
		derivation: ["hujia", "jijiang", "jiuyuan", "xueyi"],
		marktext: "诏",
		intro: {
			content: "cards",
			onunmark: "throw",
		},
	},
	sphantong_gain: {
		trigger: { global: "phaseBegin" },
		direct: true,
		sourceSkill: "sphantong",
		filter(event, player) {
			return player.storage.sphantong && player.storage.sphantong.length > 0;
		},
		content() {
			"step 0";
			player.chooseButton([get.prompt("sphantong"), player.storage.sphantong], function (button) {
				var player = _status.event.player;
				if (_status.currentPhase == player) {
					//血裔
					if (
						(player.hasJudge("lebu") || player.skipList.includes("phaseUse")) &&
						game.hasPlayer(function (current) {
							return current != player && current.group == "qun";
						})
					) {
						return 1;
					}
					//激将
					if (
						!player.hasJudge("lebu") &&
						!player.skipList.includes("phaseUse") &&
						game.hasPlayer(function (current) {
							return current != player && current.group == "shu" && current.hasSha() && get.attitude(player, current) > 0 && get.attitude(current, player) > 0;
						}) &&
						game.hasPlayer(function (target) {
							return player.canUse({ name: "sha" }, target) && get.effect(target, { name: "sha" }, player, player) > 0;
						})
					) {
						return 1;
					}
				}
				//护驾
				else if (
					!player.hasShan("all") &&
					game.hasPlayer(function (current) {
						return current != player && current.group == "wei" && current.mayHaveShan(player, "respond") && get.attitude(player, current) > 0 && get.attitude(current, player) > 0;
					})
				) {
					return 1;
				}
				return -1;
			});
			"step 1";
			if (result.bool) {
				player.logSkill("sphantong");
				var card = result.links[0];
				player.$throw(card);
				game.log(player, "将", card, "置入了弃牌堆");
				player.storage.sphantong.remove(card);
				player[player.storage.sphantong.length > 0 ? "markSkill" : "unmarkSkill"]("sphantong");
				game.cardsDiscard(card);
				var list = ["hujia", "jijiang", "jiuyuan", "xueyi"];
				for (var i = 0; i < list.length; i++) {
					if (player.hasSkill(list[i])) {
						list.splice(i--, 1);
					}
				}
				if (list.length) {
					player
						.chooseControl(list)
						.set("prompt", "选择获得以下技能中的一个")
						.set("ai", function () {
							var player = _status.event.player;
							if (_status.currentPhase == player) {
								//血裔
								if (
									(player.hasJudge("lebu") || player.skipList.includes("phaseUse")) &&
									game.hasPlayer(function (current) {
										return current != player && current.group == "qun";
									})
								) {
									return "xueyi";
								}
								//激将
								if (
									!player.hasJudge("lebu") &&
									!player.skipList.includes("phaseUse") &&
									game.hasPlayer(function (current) {
										return current != player && current.group == "shu" && current.hasSha() && get.attitude(player, current) > 0 && get.attitude(current, player) > 0;
									}) &&
									game.hasPlayer(function (target) {
										return player.canUse({ name: "sha" }, target) && get.effect(target, { name: "sha" }, player, player) > 0;
									})
								) {
									return "jijiang";
								}
							}
							//护驾
							else if (
								!player.hasShan("all") &&
								game.hasPlayer(function (current) {
									return current != player && current.group == "wei" && current.mayHaveShan(player, "respond") && get.attitude(player, current) > 0 && get.attitude(current, player) > 0;
								})
							) {
								return "hujia";
							}
						});
				} else {
					event.finish();
				}
			} else {
				event.finish();
			}
			"step 2";
			var skill = result.control;
			player.addTempSkills(skill);
			// player.popup(skill,'wood');
			// game.log(player,'获得了技能','#g【'+get.translation(skill)+'】');
		},
	},
	sphuangen: {
		trigger: { global: "useCardToPlayered" },
		filter(event, player) {
			if (!event.isFirstTarget) {
				return false;
			}
			if (get.type(event.card) != "trick") {
				return false;
			}
			if (get.info(event.card).multitarget) {
				return false;
			}
			if (event.targets.length < 2) {
				return false;
			}
			return player.hp > 0;
		},
		direct: true,
		content() {
			"step 0";
			player
				.chooseTarget(get.prompt("sphuangen"), [1, Math.min(player.hp, trigger.targets.length)], function (card, player, target) {
					return _status.event.targets.includes(target);
				})
				.set("ai", function (target) {
					return -get.effect(target, trigger.card, trigger.player, _status.event.player);
				})
				.set("targets", trigger.targets);
			"step 1";
			if (result.bool) {
				player.logSkill("sphuangen", result.targets);
				trigger.excluded.addArray(result.targets);
				player.draw();
			}
		},
		ai: { threaten: 3.5 },
		global: "sphuangen_ai",
		subSkill: {
			ai: {
				ai: {
					effect: {
						player_use(card, player) {
							if (
								typeof card != "object" ||
								!game.hasPlayer(target => {
									return target.hasSkill("sphuangen") && (get.attitude(player, target) < 0 || get.attitude(target, player) < 0);
								}) ||
								game.countPlayer(target => {
									return player.canUse(card, target);
								}) < 2
							) {
								return;
							}
							if (get.info(card)?.type != "trick") {
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
							if (range[1] == -1 || (range[1] > 1 && ui.selected.targets && ui.selected.targets.length)) {
								return "zeroplayertarget";
							}
						},
					},
				},
			},
		},
	},
	spyicong: {
		trigger: { player: "phaseDiscardEnd" },
		direct: true,
		locked: false,
		filter(event, player) {
			return player.countCards("he") > 0;
		},
		content() {
			"step 0";
			player.chooseCard("he", [1, player.countCards("he")], get.prompt2("spyicong")).set("ai", function (card) {
				if (card.name == "du") {
					return 10;
				}
				if (ui.selected.cards.length) {
					return -1;
				}
				return 4 - get.value(card);
			});
			"step 1";
			if (result.bool) {
				player.logSkill("spyicong");
				player.addToExpansion(result.cards, player, "give").gaintag.add("spyicong");
			}
		},
		mod: {
			globalTo(from, to, num) {
				return num + to.getExpansions("spyicong").length;
			},
		},
		marktext: "扈",
		onremove(player, skill) {
			var cards = player.getExpansions(skill);
			if (cards.length) {
				player.loseToDiscardpile(cards);
			}
		},
		intro: {
			name: "义从",
			content(storage, player) {
				return "共有" + get.cnNumber(player.getExpansions("spyicong").length) + "张“扈”";
			},
			markcount: "expansion",
		},
	},
	sptuji: {
		trigger: { player: "phaseZhunbeiBegin" },
		forced: true,
		locked: false,
		filter(event, player) {
			return player.getExpansions("spyicong").length > 0;
		},
		content() {
			var cards = player.getExpansions("spyicong");
			var num = cards.length;
			player.addMark("sptuji2", num, false);
			player.addTempSkill("sptuji2");
			player.loseToDiscardpile(cards);
			if (num <= 1) {
				player.draw();
			}
		},
		ai: {
			combo: "spyicong",
		},
	},
	sptuji2: {
		onremove: true,
		charlotte: true,
		mod: {
			globalFrom(from, to, num) {
				return num - from.countMark("sptuji2");
			},
		},
		marktext: "突",
		intro: {
			name: "突骑",
			content: "至其他角色的距离-#",
		},
	},
	xinfu_yanyu: {
		trigger: {
			global: "phaseUseBegin",
		},
		direct: true,
		filter(event, player) {
			return player.countCards("he") > 0;
		},
		content() {
			"step 0";
			var next = player.chooseToDiscard(get.prompt("xinfu_yanyu"), get.translation("xinfu_yanyu_info"), "he").set("logSkill", "xinfu_yanyu");
			if (player == trigger.player) {
				next.set(
					"goon",
					(function () {
						var map = {
							basic: 0,
							trick: 0.1,
						};
						var hs = trigger.player.getCards("h");
						var sha = false;
						var jiu = false;
						for (var i = 0; i < hs.length; i++) {
							if (trigger.player.hasValueTarget(hs[i])) {
								if (hs[i].name == "sha" && !sha) {
									sha = true;
									map.basic += 2;
								}
								if (hs[i].name == "tao") {
									map.basic += 6;
								}
								if (hs[i].name == "jiu") {
									jiu = true;
									map.basic += 2.5;
								}
								if (get.type(hs[i]) == "trick") {
									map.trick += get.value(hs[i], player, "raw");
								}
							}
						}
						return map;
					})()
				);
				next.set("ai", function (card) {
					var map = _status.event.goon;
					var type = get.type(card, "trick");
					if (!map[type]) {
						return -1;
					}
					return map[type] - get.value(card);
				});
			} else {
				next.set("ai", function (cardx) {
					var map = {
						basic: 0,
						trick: 0,
					};
					var hs = trigger.player.getCards("h");
					var sha = false;
					var jiu = false;
					for (var i = 0; i < hs.length; i++) {
						if (hs[i] != cardx && trigger.player.hasValueTarget(hs[i])) {
							if (hs[i].name == "sha" && !sha) {
								sha = true;
								map.basic += 2;
							}
							if (hs[i].name == "tao") {
								map.basic += 6;
							}
							if (hs[i].name == "jiu") {
								jiu = true;
								map.basic += 3;
							}
							if (get.type(hs[i]) == "trick") {
								map.trick += player.getUseValue(hs[i]);
							}
						}
					}
					var type = get.type(cardx, "trick");
					if (!map[type]) {
						return -get.value(cardx);
					}
					return map[type] - get.value(cardx);
				});
			}
			"step 1";
			if (result.bool) {
				player.storage.xinfu_yanyu = get.type(result.cards[0], "trick");
				player.addTempSkill("xinfu_yanyu2", "phaseUseAfter");
			}
		},
	},
	xinfu_yanyu2: {
		init(player, skill) {
			player.storage[skill] = 0;
		},
		onremove(player, skill) {
			delete player.storage.xinfu_yanyu;
			delete player.storage.xinfu_yanyu2;
		},
		trigger: {
			global: ["loseAfter", "cardsDiscardAfter", "loseAsyncAfter", "equipAfter"],
		},
		direct: true,
		sourceSkill: "xinfu_yanyu",
		filter(event, player) {
			if (player.storage.xinfu_yanyu2 >= 3) {
				return false;
			}
			var type = player.storage.xinfu_yanyu,
				cards = event.getd();
			for (var i = 0; i < cards.length; i++) {
				if (get.type(cards[i], "trick") == type && get.position(cards[i], true) == "d") {
					return true;
				}
			}
			return false;
		},
		content() {
			"step 0";
			event.logged = false;
			event.cards = [];
			var type = player.storage.xinfu_yanyu;
			var cards = trigger.getd();
			for (var i = 0; i < cards.length; i++) {
				if (get.type(cards[i], "trick") == type && get.position(cards[i], true) == "d") {
					event.cards.push(cards[i]);
				}
			}
			"step 1";
			if (player.storage.xinfu_yanyu2 >= 3) {
				event.finish();
			} else {
				player.chooseCardButton(event.cards, "【燕语】：是否将其中的一张牌交给一名角色？").ai = function (card) {
					if (card.name == "du") {
						return 10;
					}
					return get.value(card);
				};
			}
			"step 2";
			if (result.bool) {
				player.storage.xinfu_yanyu2++;
				if (!event.logged) {
					player.logSkill("xinfu_yanyu");
					player.addExpose(0.25);
					event.logged = true;
				}
				event.togain = result.links[0];
				event.cards.remove(event.togain);
				player
					.chooseTarget(true, "请选择要获得" + get.translation(event.togain) + "的角色")
					.set("ai", function (target) {
						var att = get.attitude(_status.event.player, target);
						var card = _status.event.card;
						var val = get.value(card);
						if (player.storage.xinfu_yanyu2 < 3 && target == _status.currentPhase && target.hasValueTarget(card, null, true)) {
							att = att * 5;
						} else if (target == player && !player.hasJudge("lebu") && get.type(card) == "trick") {
							att = att * 3;
						}
						if (target.hasSkillTag("nogain")) {
							att /= 10;
						}
						return att * val;
					})
					.set("card", event.togain);
			} else {
				event.finish();
			}
			"step 3";
			var target = result.targets[0];
			player.line(target, "green");
			target.gain(event.togain, "gain2");
			if (event.cards.length) {
				event.goto(1);
			}
		},
	},
	xinfu_xiaode: {
		subSkill: {
			remove: {
				charlotte: true,
				trigger: { player: "phaseAfter" },
				forced: true,
				popup: false,
				content() {
					player.removeAdditionalSkill("xinfu_xiaode");
					player.removeSkill("xinfu_xiaode_remove");
				},
			},
		},
		trigger: { global: "dieAfter" },
		direct: true,
		filter(skill, event) {
			return !event.hasSkill("xinfu_xiaode_remove");
		},
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
				if (info.charlotte || info.zhuSkill || (info.unique && !info.limited) || info.juexingji || info.dutySkill || info.hiddenSkill) {
					return false;
				}
				return true;
			};
			for (var i = 0; i < listm.length; i++) {
				if (func(listm[i])) {
					list.add(listm[i]);
				}
			}
			if (list.length) {
				player
					.chooseControl(list, "cancel2")
					.set("prompt", get.prompt("xinfu_xiaode"))
					.set("prompt2", get.translation("xinfu_xiaode_info"))
					.set("ai", function () {
						return list.randomGet();
					});
			} else {
				event.finish();
			}
			"step 1";
			if (result.control && result.control != "cancel2") {
				player.logSkill("xinfu_xiaode");
				player.popup(result.control, "thunder");
				game.log(player, "获得了技能", "#g【" + get.translation(result.control) + "】");
				player.addAdditionalSkill("xinfu_xiaode", [result.control]);
				player.addSkill("xinfu_xiaode_remove");
			}
		},
	},
	chixin: {
		group: ["chixin1", "chixin2"],
		mod: {
			cardUsableTarget(card, player, target) {
				if (card.name == "sha" && !target.hasSkill("chixin3") && player.inRange(target)) {
					return true;
				}
			},
		},
		trigger: { player: "useCardToPlayered" },
		silent: true,
		firstDo: true,
		locked: false,
		content() {
			trigger.target.addTempSkill("chixin3");
		},
	},
	chixin1: {
		enable: ["chooseToRespond", "chooseToUse"],
		filterCard: { suit: "diamond" },
		position: "hes",
		viewAs: { name: "sha" },
		prompt: "将一张♦牌当杀使用或打出",
		sourceSkill: "chixin",
		check(card) {
			return 5 - get.value(card);
		},
		ai: {
			respondSha: true,
		},
	},
	chixin2: {
		enable: ["chooseToUse", "chooseToRespond"],
		filterCard: { suit: "diamond" },
		viewAs: { name: "shan" },
		position: "hes",
		prompt: "将一张♦牌当闪使用或打出",
		sourceSkill: "chixin",
		check(card) {
			return 5 - get.value(card);
		},
		ai: {
			respondShan: true,
			effect: {
				target(card, player, target, current) {
					if (get.tag(card, "respondShan") && current < 0) {
						return 0.8;
					}
				},
			},
		},
	},
	chixin3: { charlotte: true },
	suiren: {
		trigger: { player: "phaseZhunbeiBegin" },
		skillAnimation: true,
		animationColor: "gray",
		filter(event, player) {
			return !player.storage.suiren;
		},
		direct: true,
		limited: true,
		content() {
			"step 0";
			var check = player.hp == 1 || (player.hp == 2 && player.countCards("h") <= 1);
			player
				.chooseTarget(get.prompt2("suiren"))
				.set("ai", function (target) {
					if (!_status.event.check) {
						return 0;
					}
					return get.attitude(_status.event.player, target);
				})
				.set("check", check);
			"step 1";
			if (result.bool) {
				player.storage.suiren = true;
				player.awakenSkill(event.name);
				player.logSkill("suiren", result.targets);
				player.removeSkills("reyicong");
				player.gainMaxHp();
				player.recover();
				result.targets[0].draw(3);
			}
		},
	},
	xinmanjuan: {
		audio: "manjuan",
		forced: true,
		trigger: {
			player: "gainAfter",
			global: "loseAsyncAfter",
		},
		filter(event, player) {
			var hs = player.getCards("h");
			return (
				event.type != "xinmanjuan" &&
				event.getg(player).filter(function (card) {
					return hs.includes(card);
				}).length > 0
			);
		},
		content() {
			"step 0";
			var hs = player.getCards("h"),
				cards = trigger.getg(player).filter(function (card) {
					return hs.includes(card);
				});
			event.cards = cards;
			event.rawCards = cards.slice(0);
			player.loseToDiscardpile(cards);
			if (_status.currentPhase != player) {
				event.finish();
			}
			"step 1";
			event.card = event.cards.shift();
			event.togain = [];
			var number = get.number(event.card);
			for (var i = 0; i < ui.discardPile.childNodes.length; i++) {
				var current = ui.discardPile.childNodes[i];
				if (!event.rawCards.includes(current) && get.number(current) == number) {
					event.togain.push(current);
				}
			}
			if (!event.togain.length) {
				event.goto(4);
			}
			"step 2";
			player.chooseButton(["是否获得其中的一张牌？", event.togain]).ai = function (button) {
				return get.value(button.link);
			};
			"step 3";
			if (result.bool) {
				player.gain(result.links[0], "gain2").type = "xinmanjuan";
			}
			"step 4";
			if (event.cards.length) {
				event.goto(1);
			}
		},
		ai: {
			threaten: 4.2,
			nogain: 1,
			skillTagFilter(player) {
				return player != _status.currentPhase;
			},
		},
	},
	manjuan: {
		audio: true,
		trigger: { global: "loseAfter" },
		filter(event, player) {
			if (event.type != "discard") {
				return false;
			}
			if (event.player == player) {
				return false;
			}
			if (!player.countCards("he")) {
				return false;
			}
			for (var i = 0; i < event.cards2.length; i++) {
				if (get.position(event.cards2[i], true) == "d") {
					return true;
				}
			}
			return false;
		},
		direct: true,
		gainable: true,
		content() {
			"step 0";
			if (trigger.delay == false) {
				game.delay();
			}
			"step 1";
			var cards = [];
			var suits = ["club", "spade", "heart", "diamond"];
			for (var i = 0; i < trigger.cards2.length; i++) {
				if (get.position(trigger.cards2[i], true) == "d") {
					cards.push(trigger.cards2[i]);
					suits.remove(get.suit(trigger.cards2[i]));
				}
			}
			if (cards.length) {
				var maxval = 0;
				for (var i = 0; i < cards.length; i++) {
					var tempval = get.value(cards[i]);
					if (tempval > maxval) {
						maxval = tempval;
					}
				}
				maxval += cards.length - 1;
				var next = player.chooseToDiscard("he", { suit: suits });
				next.set("ai", function (card) {
					return _status.event.maxval - get.value(card);
				});
				next.set("maxval", maxval);
				next.set("dialog", [get.prompt(event.name), "hidden", cards]);
				next.logSkill = event.name;
				event.cards = cards;
			}
			"step 2";
			if (result.bool) {
				player.gain(event.cards, "gain2", "log");
			}
		},
		ai: {
			threaten: 1.3,
		},
	},
	zuixiang: {
		skillAnimation: true,
		animationColor: "gray",
		audio: true,
		limited: true,
		trigger: { player: "phaseZhunbeiBegin" },
		content() {
			"step 0";
			player.awakenSkill(event.name);
			event.cards = player.showCards(get.cards(3)).cards;
			player.addToExpansion(event.cards, "gain2").gaintag.add("zuixiang2");
			"step 1";
			if (lib.skill.zuixiang.filterSame(cards)) {
				player.gain(cards, "gain2").type = "xinmanjuan";
			} else {
				trigger._zuixiang = true;
				player.addSkill("zuixiang2");
			}
		},
		filterSame(c) {
			for (var i = 0; i < c.length; i++) {
				for (var j = i + 1; j < c.length; j++) {
					if (get.number(c[i]) == get.number(c[j])) {
						return true;
					}
				}
			}
			return false;
		},
	},
	zuixiang2: {
		intro: {
			content: "expansion",
			markcount: "expansion",
		},
		mod: {
			cardEnabled(card, player) {
				var type = get.type2(card);
				var list = player.getExpansions("zuixiang2");
				for (var i of list) {
					if (get.type2(i, false) == type) {
						return false;
					}
				}
			},
			cardRespondable() {
				return lib.skill.zuixiang2.mod.cardEnabled.apply(this, arguments);
			},
			cardSavable() {
				return lib.skill.zuixiang2.mod.cardEnabled.apply(this, arguments);
			},
		},
		trigger: {
			player: "phaseZhunbeiBegin",
			target: "useCardToBefore",
		},
		forced: true,
		charlotte: true,
		sourceSkill: "zuixiang",
		filter(event, player) {
			if (event.name == "phaseZhunbei") {
				return !event._zuixiang;
			}
			var type = get.type2(event.card);
			var list = player.getExpansions("zuixiang2");
			for (var i of list) {
				if (get.type2(i) == type) {
					return true;
				}
			}
			return false;
		},
		content() {
			"step 0";
			if (event.triggername == "useCardToBefore") {
				trigger.cancel();
				event.finish();
				return;
			}
			var cards = get.cards(3);
			player.addToExpansion("gain2", cards).gaintag.add("zuixiang2");
			"step 1";
			var cards = player.getExpansions("zuixiang2");
			player.showCards(cards);
			if (lib.skill.zuixiang.filterSame(cards)) {
				player.gain(cards, "gain2", "log").type = "xinmanjuan";
				player.removeSkill("zuixiang2");
			}
		},
		ai: {
			effect: {
				target(card, player, target) {
					var type = get.type2(card);
					var list = target.getExpansions("zuixiang2");
					for (var i of list) {
						if (get.type2(i) == type) {
							return "zeroplayertarget";
						}
					}
				},
			},
		},
	},
	yanxiao: {
		audio: 2,
		enable: "phaseUse",
		filterCard: { suit: "diamond" },
		filterTarget(card, player, target) {
			return target.canAddJudge({ name: "yanxiao_card" });
		},
		check(card) {
			return 7 - get.value(card);
		},
		position: "he",
		filter(event, player) {
			return player.countCards("he", { suit: "diamond" }) > 0;
		},
		discard: false,
		lose: false,
		delay: false,
		prepare: "give",
		content() {
			"step 0";
			game.addGlobalSkill("yanxiao_global");
			target.addJudge({ name: "yanxiao_card" }, cards);
			"step 1";
			game.delay();
		},
		ai: {
			order: 8,
			result: {
				target(player, target) {
					if (
						target.countCards("j", function (card) {
							return (
								get.effect(
									target,
									{
										name: card.viewAs || card.name,
										cards: [card],
									},
									target,
									target
								) < 0
							);
						})
					) {
						return 1;
					}
					return 0;
				},
			},
		},
	},
	yanxiao_global: {
		trigger: { player: "phaseJudgeBegin" },
		forced: true,
		filter(event, player) {
			return player.countCards("j") > 0 && player.hasJudge("yanxiao_card");
		},
		content() {
			player.gain(player.getCards("j"), "gain2");
		},
		ai: {
			effect: {
				target_use(card, player, target) {
					if (get.type(card) == "delay" && target.hasJudge("yanxiao_card")) {
						return [0, 0.1];
					}
				},
			},
		},
	},
	anxian: {
		audio: 2,
		group: ["anxian_source", "anxian_target"],
		subSkill: {
			source: {
				audio: "anxian",
				trigger: { source: "damageBegin2" },
				filter(event, player) {
					return event.card && event.card.name == "sha";
				},
				check(event, player) {
					if (get.damageEffect(event.player, player, player) <= 0) {
						return true;
					}
					return false;
				},
				content() {
					"step 0";
					if (trigger.player.countCards("h")) {
						trigger.player.chooseToDiscard(true);
					}
					"step 1";
					player.draw();
					trigger.cancel();
				},
			},
			target: {
				audio: "anxian",
				trigger: { target: "useCardToTargeted" },
				direct: true,
				filter(event, player) {
					return event.card.name == "sha" && player.countCards("h");
				},
				content() {
					"step 0";
					var next = player.chooseToDiscard(get.prompt2("anxian"));
					next.set("ai", function (card) {
						var player = _status.event.player;
						var trigger = _status.event.getTrigger();
						if (get.attitude(player, trigger.player) > 0) {
							return 9 - get.value(card);
						}
						if (player.countCards("h", { name: "shan" })) {
							return -1;
						}
						return 7 - get.value(card);
					});
					next.logSkill = "anxian";
					"step 1";
					if (result.bool) {
						trigger.player.draw();
						trigger.getParent().excluded.push(player);
					}
				},
			},
		},
	},
	junwei: {
		trigger: { player: "phaseJieshuBegin" },
		direct: true,
		filter(event, player) {
			return player.getExpansions("yinling").length >= 3;
		},
		content() {
			"step 0";
			var cards = player.getExpansions("yinling");
			if (cards.length > 3) {
				player.chooseButton(3, [get.prompt("junwei"), "hidden", cards]).set("ai", function (button) {
					return 1;
				});
			} else {
				player
					.chooseBool()
					.set("createDialog", [get.prompt("junwei"), "hidden", cards])
					.set("dialogselectx", true)
					.set("choice", true);
				event.cards = cards.slice(0);
			}
			"step 1";
			if (result.bool) {
				player.logSkill("junwei");
				var cards = event.cards || result.links;
				player.loseToDiscardpile(cards);
				player
					.chooseTarget(true, function (card, player, target) {
						return player != target;
					})
					.set("ai", function (target) {
						return -get.attitude(_status.event.player, target) / Math.sqrt(1 + target.hp);
					});
			} else {
				event.finish();
			}
			"step 2";
			if (result.bool && result.targets && result.targets.length) {
				var target = result.targets[0];
				player.line(result.targets);
				event.target = target;
				var nshan = target.countCards("h", function (card) {
					if (_status.connectMode) {
						return true;
					}
					return card.name == "shan";
				});
				if (nshan == 0) {
					event.directfalse = true;
				} else {
					target
						.chooseCard("交给" + get.translation(player) + "一张【闪】，或失去1点体力", function (card) {
							return card.name == "shan";
						})
						.set("ai", function (card) {
							if (_status.event.nshan > 1) {
								return 1;
							}
							if (_status.event.player.hp >= 3) {
								return 0;
							}
							return 1;
						})
						.set("nshan", nshan);
				}
			} else {
				event.finish();
			}
			"step 3";
			if (!event.directfalse && result.bool) {
				game.delay();
			}
			ui.clear();
			"step 4";
			if (!event.directfalse && result.bool) {
				event.cards = result.cards;
				event.target.$throw(result.cards);
				player
					.chooseTarget("将" + get.translation(event.cards) + "交给一名角色", true, function (card, player, target) {
						return target != _status.event.getParent().target;
					})
					.set("ai", function (target) {
						return get.attitude(_status.event.player, target) / (target.countCards("h", "shan") + 1);
					});
			} else {
				event.target.loseHp();
				delete event.cards;
			}
			"step 5";
			if (event.cards) {
				player.line(result.targets, "green");
				result.targets[0].gain(event.cards, "gain2").giver = player;
				game.log(player, "将", event.cards, "交给", result.targets[0]);
				event.finish();
			} else {
				if (event.target.countCards("e")) {
					player.choosePlayerCard("e", "将" + get.translation(event.target) + "的一张装备牌移出游戏", true, event.target);
				} else {
					event.finish();
				}
			}
			"step 6";
			if (result.bool) {
				var card = result.links[0];
				target.addToExpansion(card, target, "give").gaintag.add("junwei2");
				target.addSkill("junwei2");
			}
		},
		ai: {
			combo: "yinling",
		},
	},
	junwei2: {
		mark: true,
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
		trigger: { player: "phaseJieshuBegin" },
		forced: true,
		charlotte: true,
		sourceSkill: "junwei",
		content() {
			"step 0";
			var cards = player.getExpansions("junwei2").filter(function (card) {
				return player.canEquip(card, true);
			});
			if (cards.length) {
				player.$give(cards[0], player, false);
				game.delay(0.5);
				player.equip(cards[0]);
				event.redo();
			}
			"step 1";
			player.removeSkill("junwei2");
		},
	},
	yinling: {
		enable: "phaseUse",
		filterCard: { color: "black" },
		position: "he",
		marktext: "锦",
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
		filter(event, player) {
			return player.countCards("he", { color: "black" }) > 0 && player.getExpansions("yinling").length < 4;
		},
		filterTarget(card, player, target) {
			return target.countCards("he") > 0 && target != player;
		},
		check(card) {
			return 6 - get.value(card);
		},
		content() {
			"step 0";
			player.choosePlayerCard("hej", target, true);
			"step 1";
			if (result.bool && result.links && result.links.length) {
				player.addToExpansion(result.links, target, "give").gaintag.add("yinling");
			}
		},
		ai: {
			order: 10.1,
			expose: 0.1,
			result: {
				target(player, target) {
					if (target.hasSkill("tuntian")) {
						return 0;
					}
					var es = target.getCards("e");
					var nh = target.countCards("h");
					var noe = es.length == 0 || target.hasSkillTag("noe");
					var noe2 = es.length == 1 && es[0].name == "baiyin" && target.hp < target.maxHp;
					var noh = nh == 0 || target.hasSkillTag("noh");
					if (noh && noe) {
						return 0;
					}
					if (noh && noe2) {
						return 0.01;
					}
					if (get.attitude(player, target) <= 0) {
						return target.countCards("he") ? -1.5 : 1.5;
					}
					var js = target.getCards("j");
					if (js.length) {
						var jj = js[0].viewAs ? { name: js[0].viewAs } : js[0];
						if (jj.name == "guohe") {
							return 3;
						}
						if (js.length == 1 && get.effect(target, jj, target, player) >= 0) {
							return -1.5;
						}
						return 2;
					}
					return -1.5;
				},
			},
		},
	},
	fenyong: {
		audio: 2,
		trigger: { player: "damageEnd" },
		content() {
			player.addTempSkill("fenyong2");
		},
	},
	fenyong2: {
		audio: "fenyong",
		mark: true,
		intro: {
			content: "防止你受到的所有伤害",
		},
		trigger: { player: "damageBegin3" },
		forced: true,
		sourceSkill: "fenyong",
		content() {
			trigger.cancel();
		},
		ai: {
			maixie: true,
			maixie_hp: true,
			nofire: true,
			nothunder: true,
			nodamage: true,
			effect: {
				target(card, player, target, current) {
					if (get.tag(card, "damage")) {
						return "zeroplayertarget";
					}
				},
			},
		},
	},
	xuehen: {
		audio: 2,
		trigger: { global: "phaseJieshuBegin" },
		forced: true,
		locked: false,
		filter(event, player) {
			return player.hasSkill("fenyong2") && event.player.isIn();
		},
		content() {
			"step 0";
			player.removeSkill("fenyong2");
			player
				.chooseControl("弃牌", "出杀", function () {
					var player = _status.event.player;
					var trigger = _status.event.getTrigger();
					if (get.attitude(player, trigger.player) < 0) {
						var he = trigger.player.countCards("he");
						if (he < 2) {
							return "出杀";
						}
						if (player.maxHp - player.hp >= 2 && he <= 3) {
							return "弃牌";
						}
						if (player.maxHp - player.hp >= 3 && he <= 5) {
							return "弃牌";
						}
						if (player.maxHp - player.hp > 3) {
							return "弃牌";
						}
						return "出杀";
					}
					return "出杀";
				})
				.set("prompt", "弃置" + get.translation(trigger.player) + get.cnNumber(player.maxHp - player.hp) + "张牌，或对任意一名角色使用一张杀");
			"step 1";
			if (result.control == "弃牌") {
				player.line(trigger.player, "green");
				if (player.hp < player.maxHp && trigger.player.countCards("he")) {
					player.discardPlayerCard(trigger.player, true, "he", player.maxHp - player.hp);
				}
			} else {
				player.chooseUseTarget({ name: "sha" }, true, false, "nodistance");
			}
		},
		ai: {
			combo: "fenyong",
		},
	},
	mouduan: {
		audio: 1,
		init2(player) {
			game.broadcastAll(function (player) {
				player._mouduan_mark = player.mark("武", {
					content: "拥有技能【激昂】、【谦逊】",
				});
			}, player);
			player.addAdditionalSkill("mouduan", ["jiang", "qianxun"]);
		},
		derivation: ["jiang", "qianxun", "yingzi", "keji"],
		onremove(player) {
			game.broadcastAll(function (player) {
				if (player._mouduan_mark) {
					player._mouduan_mark.delete();
					delete player._mouduan_mark;
				}
			}, player);
			player.removeAdditionalSkills("mouduan");
		},
		trigger: { player: "loseEnd" },
		forced: true,
		locked: false,
		filter(event, player) {
			return player._mouduan_mark && player._mouduan_mark.name == "武" && player.countCards("h") <= 2;
		},
		content() {
			game.broadcastAll(function (player) {
				if (!player._mouduan_mark) {
					return;
				}
				player._mouduan_mark.name = "文";
				player._mouduan_mark.skill = "文";
				player._mouduan_mark.firstChild.innerHTML = "文";
				player._mouduan_mark.info.content = "拥有技能【英姿】、【克己】";
			}, player);
			player.addAdditionalSkills("mouduan", ["yingzi", "keji"]);
		},
		group: "mouduan2",
	},
	mouduan2: {
		audio: 1,
		trigger: { global: "phaseZhunbeiBegin" },
		sourceSkill: "mouduan",
		//priority:5,
		filter(event, player) {
			return player._mouduan_mark && player._mouduan_mark.name == "文" && player.countCards("h") > 2;
		},
		direct: true,
		content() {
			"step 0";
			player.chooseToDiscard("he", "谋断：是否弃置一张牌将标记变为“武”？").ai = function () {
				return -1;
			};
			"step 1";
			if (result.bool && player.countCards("h") > 2) {
				game.broadcastAll(function (player) {
					if (!player._mouduan_mark) {
						return;
					}
					player._mouduan_mark.name = "武";
					player._mouduan_mark.skill = "武";
					player._mouduan_mark.firstChild.innerHTML = "武";
					player._mouduan_mark.info.content = "拥有技能【激昂】、【谦逊】";
				}, player);
				player.addAdditionalSkills("mouduan", ["jiang", "qianxun"]);
			}
		},
	},
	tanhu: {
		audio: 1,
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
			player.chooseToCompare(target);
			"step 1";
			if (result.bool) {
				target.addTempSkill("tanhu2");
			}
		},
		ai: {
			result: {
				target(player, target) {
					var hs = player.getCards("h");
					if (hs.length < 3) {
						return 0;
					}
					var bool = false;
					for (var i = 0; i < hs.length; i++) {
						if (hs[i].number >= 9 && get.value(hs[i]) < 7) {
							bool = true;
							break;
						}
					}
					if (!bool) {
						return 0;
					}
					return -1;
				},
			},
			order: 9,
		},
		group: "tanhu3",
	},
	tanhu2: {
		mark: true,
		intro: {
			content: "已成为探虎目标",
		},
	},
	tanhu3: {
		mod: {
			globalFrom(from, to) {
				if (to.hasSkill("tanhu2")) {
					return -Infinity;
				}
			},
			wuxieRespondable(card, player, target) {
				if (target && target.hasSkill("tanhu2")) {
					return false;
				}
			},
		},
	},
	jie: {
		audio: 1,
		trigger: { source: "damageBegin1" },
		filter(event) {
			return event.card?.name === "sha" && get.color(event.card) == "red";
		},
		forced: true,
		content() {
			trigger.num++;
		},
	},
	dahe: {
		audio: true,
		enable: "phaseUse",
		usable: 1,
		filterTarget(card, player, target) {
			return player.canCompare(target);
		},
		filter(event, player) {
			return game.hasPlayer(current => get.info("dahe").filterTarget(null, player, current));
		},
		async content(event, trigger, player) {
			const { target } = event;
			const { result } = await player.chooseToCompare(target).set("preserve", "win");
			if (result?.bool) {
				target.addTempSkill(event.name + "_effect");
				const card = result?.target;
				if (get.itemtype(card) == "card") {
					const { result } = await player
						.chooseTarget(`将${get.translation(card)}交给一名角色`, (card, player, target) => {
							return target.hp <= player.hp;
						})
						.set("ai", target => {
							const { player, du } = get.event();
							const att = get.attitude(player, target);
							if (du) {
								return -att;
							}
							return att;
						})
						.set("du", card.name == "du");
					if (result?.bool && result?.targets?.length) {
						player.line(result.targets, "green");
						await result.targets[0].gain(card, "gain2");
					}
				}
			} else if (player.countCards("h")) {
				await player.showHandcards();
				if (player.countDiscardableCards(player, "h")) {
					await player.chooseToDiscard("h", true);
				}
			}
		},
		ai: {
			result: {
				target(player, target) {
					var hs = player.getCards("h");
					if (hs.length < 3) {
						return 0;
					}
					var bool = false;
					for (var i = 0; i < hs.length; i++) {
						if (hs[i].number >= 9 && get.value(hs[i]) < 7) {
							bool = true;
							break;
						}
					}
					if (!bool) {
						return 0;
					}
					if (player.canUse("sha", target) && player.countCards("h", "sha")) {
						return -2;
					}
					return -0.5;
				},
			},
			order: 9,
		},
		subSkill: {
			effect: {
				charlotte: true,
				mark: true,
				intro: { content: "非红桃闪无效" },
				mod: {
					cardRespondable(card, player) {
						if (card.name == "shan") {
							const suit = get.suit(card);
							if (suit != "heart" && suit != "unsure") {
								return false;
							}
						}
					},
					cardEnabled(card, player) {
						if (card.name == "shan") {
							const suit = get.suit(card);
							if (suit != "heart" && suit != "unsure") {
								return false;
							}
						}
					},
				},
			},
		},
	},
	shichou: {
		initSkill(skill) {
			if (!lib.skill[skill]) {
				lib.skill[skill] = {
					mod: {
						aiOrder(player, card, num) {
							if (typeof card == "object" && get.tag(card, "recover")) {
								return num / 114514;
							}
						},
					},
					charlotte: true,
					onremove: true,
					mark: true,
					marktext: "誓",
					intro: {
						markcount: () => 0,
						content: storage => `已为${get.translation(storage)}李代桃僵`,
					},
				};
				lib.translate[skill] = "誓仇";
				lib.translate[skill + "_bg"] = "仇";
			}
		},
		audio: true,
		skillAnimation: true,
		animationColor: "orange",
		limited: true,
		trigger: { player: "phaseZhunbeiBegin" },
		zhuSkill: true,
		filter(event, player) {
			if (!player.hasZhuSkill("shichou")) {
				return false;
			}
			if (player.countCards("he") < 2) {
				return false;
			}
			return game.hasPlayer(current => current != player && current.group == "shu");
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseCardTarget({
					prompt: get.prompt2(event.skill),
					selectCard: 2,
					filterTarget(card, player, target) {
						return target.group == "shu" && target != player;
					},
					filterCard: true,
					position: "he",
					ai1(card) {
						return 7 - get.value(card);
					},
					ai2(target) {
						const player = get.player();
						if (player.hasUnknown()) {
							return 0;
						}
						if (target.hasSkillTag("nodamage")) {
							return 10;
						}
						const att = get.attitude(player, target);
						if (att <= 0) {
							if (target.hp == 1) {
								return (10 - att) / 2;
							}
							return 10 - att;
						} else {
							if (target.hp == 1) {
								return 0;
							}
							return (10 - att) / 4;
						}
					},
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const {
				targets: [target],
				cards,
			} = event;
			player.awakenSkill(event.name);
			await player.give(cards, target);
			player.addSkill(event.name + "_effect");
			const skill = event.name + "_" + player.playerid;
			game.broadcastAll(lib.skill.shichou.initSkill, skill);
			for (const current of game.filterPlayer()) {
				current.removeSkill(skill);
				if (current == target) {
					target.addSkill(skill);
					target.storage[skill] = player;
					target.markSkill(skill);
				}
			}
		},
		subSkill: {
			effect: {
				charlotte: true,
				trigger: {
					global: ["dying", "die"],
					player: "damageBegin4",
				},
				filter(event, player) {
					const target = game.findPlayer(current => current.storage["shichou_" + player.playerid] == player);
					if (!target) {
						return false;
					}
					if (event.name == "damage") {
						return target.isIn();
					}
					return event.player === target;
				},
				forced: true,
				popup: false,
				async content(event, trigger, player) {
					const target = game.findPlayer(current => current.storage["shichou_" + player.playerid] == player);
					if (trigger.name == "damage") {
						trigger.cancel();
						await game.delay(0.5);
						await target
							.damage(trigger.source?.isIn() ? trigger.source : "nosource", trigger.nature, trigger.num)
							.set("card", trigger.card)
							.set("cards", trigger.cards);
						await target.draw(trigger.num);
					} else {
						target.removeSkill("shichou_" + player.playerid);
						player.removeSkill(event.name);
					}
				},
				ai: {
					effect: {
						target(card, player, target, current) {
							if (get.tag(card, "damage")) {
								if (player.hasSkillTag("jueqing", false, target)) {
									return [1, -2];
								}
								if (get.attitude(player, target) > 0) {
									return [0, 0];
								}
								const targetx = game.findPlayer(current => current.storage["shichou_" + target.playerid] == target);
								if (!targetx?.isIn()) {
									return;
								}
								const bool = game.hasPlayer(current => current.hasCard(card => current.canSaveCard(card, targetx), "hs") && get.attitude(current, targetx) > 0);
								let num = -1;
								if (targetx.hp >= 4) {
									return [0, num * 2];
								}
								if (targetx.hp == 3) {
									return [0, num * 1.5];
								}
								if (targetx.hp <= 2) {
									return [0, bool ? num : -num];
								}
							}
						},
					},
				},
			},
		},
	},
	zhaolie: {
		trigger: { player: "phaseDrawBegin2" },
		filter(event, player) {
			return event.num > 0 && !event.numFixed && game.hasPlayer(current => player.inRange(current));
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt2(event.skill), (card, player, target) => {
					return player.inRange(target);
				})
				.set("ai", target => {
					const player = get.player();
					if (get.attitude(player, target) > 0) {
						return 0;
					}
					return get.damageEffect(target, player, player);
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const {
				targets: [target],
			} = event;
			trigger.num--;
			if (trigger.num <= 0) {
				await game.delay();
			}
			player
				.when({ player: "phaseDrawEnd" })
				.filter(evt => trigger == evt)
				.step(async () => {
					let cards = get.cards(3);
					await game.cardsGotoOrdering(cards);
					await player.showCards(cards);
					const cards2 = cards.filter(card => get.type(card) != "basic" || get.name(card) == "tao");
					const num = cards.filter(card => get.type(card) != "basic").length;
					if (cards2.length) {
						cards.removeArray(cards2);
						await game.cardsDiscard(cards2);
					}
					cards = cards.filter(card => get.type(card) == "basic");
					if (!target.isIn()) {
						return;
					}
					let result;
					if (!num) {
						if (!cards.length) {
							return;
						}
						result = await target
							.chooseTarget(
								(card, player, target) => {
									return get.event("list").includes(target);
								},
								`选择一个目标获得${get.translation(cards)}`,
								true
							)
							.set("ai", target => {
								const { player, cardsx } = get.event();
								return get.attitude(player, target) * get.value(cardsx, target);
							})
							.set("list", [player, target])
							.set("cardsx", cards)
							.forResult();
						if (result?.bool && result?.targets?.length) {
							await result.targets[0].gain(cards, "gain2");
						}
					} else {
						let str = `弃置${get.cnNumber(num)}张牌`;
						if (cards.length) {
							str += `并令${get.translation(player)}获得${get.translation(cards)}`;
						}
						str += `，或受到${get.translation(player)}的${num}点伤害`;
						if (cards.length) {
							str += `并获得${get.translation(cards)}`;
						}
						result =
							target.countCards("he") < num
								? { bool: false }
								: await target
										.chooseToDiscard(num, "he", get.prompt("zhaolie"), str)
										.set("ai", card => {
											const { goon } = get.event();
											return goon ? 8 - get.value(card) : 0;
										})
										.set("goon", (get.damageEffect(target, player, target) < 0 && target.getHp() <= 2 * num) || (num >= 2 && !target.countCards("hs", card => target.canSaveCard(card, target)) >= num))
										.forResult();
						if (result?.bool) {
							if (cards.length) {
								await player.gain(cards, "gain2");
							}
						} else {
							if (num) {
								await target.damage(num);
							}
							if (cards.length) {
								if (target.isIn()) {
									await target.gain(cards, "gain2");
								} else {
									await game.cardsDiscard(cards);
								}
							}
						}
					}
				});
		},
	},
	fulu: {
		trigger: { player: "useCard1" },
		filter(event, player) {
			if (event.card.name == "sha" && !game.hasNature(event.card)) {
				return true;
			}
		},
		audio: true,
		check(event, player) {
			var eff = 0;
			for (var i = 0; i < event.targets.length; i++) {
				var target = event.targets[i];
				var eff1 = get.damageEffect(target, player, player);
				var eff2 = get.damageEffect(target, player, player, "thunder");
				eff += eff2;
				eff -= eff1;
			}
			return eff >= 0;
		},
		content() {
			game.setNature(trigger.card, "thunder");
			if (get.itemtype(trigger.card) == "card") {
				var next = game.createEvent("fulu_clear");
				next.card = trigger.card;
				event.next.remove(next);
				trigger.after.push(next);
				next.setContent(function () {
					game.setNature(card, []);
				});
			}
		},
	},
	fuji: {
		trigger: { global: "damageBegin1" },
		filter(event) {
			return event.source && event.source.isIn() && event.hasNature("thunder");
		},
		check(event, player) {
			return get.attitude(player, event.source) > 0 && get.attitude(player, event.player) < 0;
		},
		prompt(event) {
			return get.translation(event.source) + "即将对" + get.translation(event.player) + "造成伤害，" + get.prompt("fuji");
		},
		logTarget: "source",
		content() {
			trigger.source.judge().callback = lib.skill.fuji.callback;
		},
		callback() {
			var evt = event.getParent(2);
			switch (event.judgeResult.color) {
				case "black":
					evt._trigger.num++;
					break;

				case "red":
					evt._trigger.source.gain(card, "gain2");
					break;
				default:
					break;
			}
		},
	},
	//田钏
	pshuying: {
		trigger: {
			global: ["phaseBefore", "dieAfter"],
			player: "enterGame",
		},
		forced: true,
		filter(event, player) {
			if (event.name == "die") {
				return event.player != player;
			}
			return event.name != "phase" || game.phaseNumber == 0;
		},
		async content(event, trigger, player) {
			let cards = [],
				num = trigger.name == "die" ? 1 : 2;
			while (cards.length < num) {
				const card = game.createCard2("xingbian", "spade", 9);
				cards.push(card);
			}
			if (cards.length) {
				await player.gain(cards, "gain2");
			}
		},
		mod: {
			ignoredHandcard(card, player) {
				if (card.name == "xingbian") {
					return true;
				}
			},
			cardDiscardable(card, player, name) {
				if (name == "phaseDiscard" && card.name == "xingbian") {
					return false;
				}
			},
			globalTo(from, to, num) {
				let count = 0;
				game.filterPlayer(current => {
					count += current.countCards("ej", card => card.name == "xingbian");
				});
				return num + count;
			},
		},
	},
	psqianjing: {
		trigger: {
			player: "damageEnd",
			source: "damageSource",
		},
		filter(event, player) {
			if (!player.countCards("h", card => card.name == "xingbian")) {
				return false;
			}
			return game.hasPlayer(current => current.hasEnabledSlot());
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseCardTarget({
					filterCard(card) {
						return card.name == "xingbian";
					},
					position: "h",
					prompt: get.prompt(event.skill),
					prompt2: "将手牌中的一张【刑鞭】置入一名角色装备区",
					filterTarget(card, player, target) {
						return target.hasEnabledSlot();
					},
					ai1(card) {
						return 10 - get.value(card);
					},
					ai2(target) {
						const player = get.player();
						if (target == player) {
							return 1;
						}
						if (get.attitude(player, target) < 0) {
							return 3;
						}
						return 0;
					},
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const target = event.targets[0],
				cardx = event.cards[0];
			const choices = [];
			for (let i = 0; i <= 5; i++) {
				if (target.hasEquipableSlot(i)) {
					choices.push(`equip${i}`);
				}
			}
			if (!choices.length) {
				return;
			}
			const result = await player
				.chooseControl(choices)
				.set("prompt", `请选择为${get.translation(target)}置入【刑鞭】的装备栏`)
				.set("ai", () => _status.event.controls.randomGet())
				.forResult();
			const card = get.autoViewAs(cardx);
			card.subtypes = [result.control];
			player.$give(card, target, false);
			await target.equip(card);
			if (target == player) {
				await player.draw();
			}
		},
		group: "psqianjing_use",
		subSkill: {
			use: {
				enable: "chooseToUse",
				filter(event, player) {
					if (!event.filterCard(get.autoViewAs({ name: "sha" }, "unsure"), player, event)) {
						return false;
					}
					if (player.countCards("h", card => card.name == "xingbian")) {
						return true;
					}
					return game.hasPlayer(current => {
						return current.countCards("ej", card => card.name == "xingbian");
					});
				},
				delay: false,
				locked: false,
				prompt: "将场上或你手牌中的一张【刑鞭】当作【杀】使用",
				filterTarget(card, player, target) {
					let event = _status.event,
						evt = event;
					if (event._backup) {
						evt = event._backup;
					}
					const pos = target == player ? "hej" : "ej";
					return target.countCards(pos, card => {
						if (card.name != "xingbian") {
							return false;
						}
						let sha = get.autoViewAs({ name: "sha", storage: { qianjing: true } }, [card]);
						if (evt.filterCard(sha, player, event)) {
							return game.hasPlayer(function (current) {
								return evt.filterTarget(sha, player, current);
							});
						}
					});
				},
				async content(event, trigger, player) {
					var evt = event.getParent(2),
						target = event.targets[0];
					evt.set("xingbian", true);
					const result = await player
						.choosePlayerCard(true, target, target == player ? "hej" : "ej")
						.set("filterButton", function (button) {
							var card = button.link;
							return card.name == "xingbian";
						})
						.forResult();
					game.broadcastAll(
						function (result, name) {
							lib.skill.psqianjing_backup.viewAs = {
								name: name,
								cards: [result],
								storage: { qianjing: true },
							};
							lib.skill.psqianjing_backup.prompt = "选择" + get.translation(name) + "（" + get.translation(result) + "）的目标";
						},
						result.links[0],
						"sha"
					);
					evt.set("_backupevent", "psqianjing_backup");
					evt.backup("psqianjing_backup");
					evt.set("openskilldialog", "选择杀（" + get.translation(result.links[0]) + "）的目标");
					evt.set("norestore", true);
					evt.set("custom", {
						add: {},
						replace: { window() {} },
					});
					evt.goto(0);
				},
				ai: {
					respondSha: true,
					skillTagFilter(player, tag) {
						var func = card => card.name == "xingbian";
						return game.hasPlayer(function (current) {
							return current.countCards(current == player ? "hej" : "ej", func);
						});
					},
					order: 1,
					result: {
						player(player, target) {
							if (_status.event.type != "phase") {
								return 1;
							}
							if (!player.hasValueTarget({ name: "sha" })) {
								return 0;
							}
							return 0.1;
						},
					},
				},
			},
			backup: {
				precontent() {
					var cards = event.result.card.cards;
					event.result.cards = cards;
					var owner = get.owner(cards[0]);
					event.target = owner;
					owner.$give(cards[0], player, false);
					player.popup(event.result.card.name, "metal");
					game.delayx();
					event.getParent().addCount = false;
				},
				filterCard: () => false,
				prompt: "请选择【杀】的目标",
				selectCard: -1,
				log: false,
			},
		},
	},
	psbianchi: {
		trigger: {
			player: "phaseJieshuEnd",
		},
		limited: true,
		skillAnimation: true,
		animationColor: "metal",
		logTarget(event, player) {
			return game.filterPlayer(current => {
				return current.countCards("ej", card => card.name == "xingbian");
			});
		},
		filter(event, player) {
			const targets = lib.skill.psbianchi.logTarget(event, player);
			return targets && targets.length;
		},
		check(event, player) {
			const targets = lib.skill.psbianchi.logTarget(event, player);
			let eff = 0;
			for (const target of targets) {
				eff += get.sgnAttitude(player, target);
			}
			return eff < 0;
		},
		async content(event, trigger, player) {
			player.awakenSkill(event.name);
			const lose_list = [];
			for (const target of event.targets) {
				lose_list.push([target, target.getCards("ej", card => card.name == "xingbian")]);
			}
			await game
				.loseAsync({
					lose_list: lose_list,
					discarder: player,
				})
				.setContent("discardMultiple");
			for (const target of event.targets) {
				const result = await target
					.chooseControl()
					.set("choiceList", ["令" + get.translation(player) + "操控你执行一个仅能使用两张牌的出牌阶段", "失去2点体力"])
					.set(
						"choice",
						(function () {
							if (get.attitude(target, player) > 0) {
								return "选项一";
							}
							if (get.effect(target, { name: "losehp" }, target, target) > 0 && target.hp > 2) {
								return "选项二";
							}
							return "选项一";
						})()
					)
					.set("ai", () => {
						return _status.event.choice;
					})
					.forResult();
				if (result.control == "选项一") {
					target.addTempSkill("psbianchi_control", { player: "phaseUseEnd" });
					const next = target.phaseUse();
					next.owner = ["psbianchi", player];
					await next;
				} else {
					await target.loseHp(2);
				}
			}
		},
		subSkill: {
			control: {
				forced: true,
				charlotte: true,
				direct: true,
				trigger: {
					player: "phaseUseBefore",
				},
				filter(event, player) {
					return !player._trueMe && event?.owner?.[1].isIn() && player != event.owner[1];
				},
				content() {
					const owner = trigger.owner[1];
					player._trueMe = owner;
					game.addGlobalSkill("autoswap");
					if (player == game.me) {
						game.notMe = true;
						if (!_status.auto) {
							ui.click.auto();
						}
					}
				},
				mod: {
					cardEnabled(card, player) {
						let history = player.getHistory("useCard", evt => {
							let phaseUse = evt.getParent("phaseUse", true);
							return phaseUse?.player == player && phaseUse.owner?.[0] == "psbianchi";
						});
						if (history?.length >= 2) {
							return false;
						}
					},
					cardUsable(card, player) {
						return lib.skill.psbianchi_control.mod.cardEnabled.apply(this, arguments);
					},
					cardSavable(card, player) {
						return lib.skill.psbianchi_control.mod.cardEnabled.apply(this, arguments);
					},
				},
				onremove(player) {
					if (player._trueMe) {
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
					}
				},
			},
		},
	},
	//蛇吕蒙
	shefujing: {
		trigger: {
			global: "roundStart",
		},
		filter(event, player, name) {
			return game.roundNumber === 1;
		},
		forced: true,
		async content(event, trigger, player) {
			await player.turnOver();
			await player.draw(3);
			const result = await player
				.chooseTarget(
					"令一名其他角色获得“伏”",
					(card, player, target) => {
						return !target.getStorage("shefujing_mark").length && target != player;
					},
					true
				)
				.forResult();
			if (result.bool) {
				const target = result.targets[0];
				player.line(target, "green");
				target.addSkill("shefujing_mark");
				target.markAuto("shefujing_mark", player);
			}
		},
		derivation: "shefujing_fu",
		subSkill: {
			mark: {
				charlotte: true,
				onremove: true,
				trigger: {
					player: "damageEnd",
					source: "damageSource",
				},
				filter(event, player, name) {
					if (!player.getStorage("shefujing_mark").some(p => p.isIn())) {
						return false;
					}
					const key = name == "damageEnd" ? "damage" : "sourceDamage";
					return player.getHistory(key, () => true, event).indexOf(event) == 0;
				},
				mark: true,
				marktext: "伏",
				intro: {
					markcount: () => null,
					content(storage, player) {
						const targets = player.getStorage("shefujing_mark").filter(i => i.isIn());
						if (!targets.length) {
							return "无效果";
						}
						return `你每回合首次受到/造成伤害后，${get.translation(targets[0])}可以选择一项：
						1.摸一张牌；2.获得1点护甲；3.背水，失去1点体力并对你发动一次〖攻心〗`;
					},
				},
				async cost(event, trigger, player) {
					const target = player.getStorage("shefujing_mark").find(p => p.isIn());
					const result = await target
						.chooseControl("选项一", "选项二", "背水！", "cancel2")
						.set("prompt", get.prompt(event.skill, player, target))
						.set("choiceList", ["摸一张牌", "获得1点护甲", `背水：失去1点体力并对${get.translation(player)}发动一次【攻心】`])
						.set("ai", () => {
							const player = get.player();
							if (player.hujia > 4) {
								return "选项一";
							}
							if (player.hp > 1) {
								return "背水！";
							}
							return "选项二";
						})
						.forResult();
					event.result = {
						bool: result.control != "cancel2",
						cost_data: result.index,
						skill_popup: false,
						targets: [target],
					};
				},
				async content(event, trigger, player) {
					const target = event.targets[0],
						index = event.cost_data;
					target.logSkill("shefujing", player);
					if (index != 1) {
						await target.draw();
					}
					if (index != 0) {
						await target.changeHujia();
					}
					if (index == 2) {
						await target.loseHp();
						await target.useSkill("gongxin", [player]);
					}
				},
			},
			fu: {},
		},
	},
	shefujiang: {
		trigger: {
			global: "damageEnd",
		},
		usable: 1,
		filter(event, player) {
			return event.player.isIn();
		},
		check(event, player) {
			return get.attitude(player, event.player) < 0;
		},
		logTarget: "player",
		async content(event, trigger, player) {
			for (const target of [trigger.player.getPrevious(), trigger.player.getNext()]) {
				if (!target.isIn() || !trigger.player.isIn()) {
					continue;
				}
				await target
					.chooseToUse(
						`浮江：是否对${get.translation(trigger.player)}使用一张【杀】？`,
						function (card, player, event) {
							if (get.name(card) != "sha") {
								return false;
							}
							return lib.filter.filterCard.apply(this, arguments);
						},
						trigger.player,
						-1
					)
					.set("addCount", false);
			}
		},
	},
	shetonglu: {
		skillAnimation: true,
		animationColor: "wood",
		juexingji: true,
		trigger: {
			global: "roundEnd",
		},
		forced: true,
		filter(event, player) {
			return player.countCards("h") > player.hp;
		},
		async content(event, trigger, player) {
			player.awakenSkill(event.name);
			await player.loseMaxHp();
			await player.addSkills(["gongxin", "rebotu", "sbduojing"]);
			const target = game.findPlayer(current => current.getStorage("shefujing_mark").includes(player));
			if (!target) {
				return;
			}
			const result = await player.chooseBool(`是否令${get.translation(target)}移动至你的上家或下家`).forResult();
			if (!result.bool) {
				return;
			}
			const result2 = await target
				.chooseControl("上家", "下家")
				.set("prompt", `选择移动至${get.translation(player)}的上家或下家`)
				.set("ai", () => ["上家", "下家"].randomGet())
				.forResult();
			const point = result2.index == 1 ? player.getNext() : player;
			if (target == point.getPrevious()) {
				return;
			}
			game.broadcastAll(
				(target1, target2) => {
					game.swapSeat(target1, target2, null, true);
				},
				target,
				point
			);
			player.insertPhase();
		},
		derivation: ["gongxin", "rebotu", "sbduojing"],
	},
	//龙大宝
	dragpojun: {
		audio: "repojun",
		trigger: {
			player: "useCardToPlayered",
		},
		filter(event, player) {
			return event.card.name == "sha" && event.target.hp > 0 && event.target.countCards("he") > 0;
		},
		preHidden: true,
		async cost(event, trigger, player) {
			const num = Math.min(trigger.target.hp, trigger.target.countCards("he"));
			event.result = await player
				.choosePlayerCard(trigger.target, "he", [1, num], get.prompt(event.skill, trigger.target))
				.set("ai", button => {
					if (!_status.event.goon) {
						return 0;
					}
					var val = get.value(button.link);
					if (button.link == _status.event.target.getEquip(2)) {
						return 2 * (val + 3);
					}
					return val;
				})
				.set("goon", get.attitude(player, trigger.target) <= 0)
				.set("forceAuto", true)
				.setHiddenSkill(event.skill)
				.forResult();
			event.result.targets = [trigger.target];
		},
		async content(event, trigger, player) {
			const target = trigger.target;
			await player.viewCards(get.translation(target) + "的“破军”牌", event.cards);
			target.addSkill("repojun2");
			const next = target.addToExpansion("giveAuto", event.cards, target);
			next.gaintag.add("repojun2");
			await next;
			if (event.cards.some(card => get.type2(card) == "equip")) {
				const result = await player
					.chooseButton(["选择一张牌置入弃牌堆", event.cards.filter(card => get.type(card) == "equip")], true)
					.set("ai", function (button) {
						return get.value(button.link, _status.event.getTrigger().target);
					})
					.forResult();
				if (result.bool) {
					await target.loseToDiscardpile(result.links);
				}
			}
			if (event.cards.some(card => get.type2(card) == "trick")) {
				await player.draw();
			}
		},
		ai: {
			unequip_ai: true,
			directHit_ai: true,
			skillTagFilter(player, tag, arg) {
				if (get.attitude(player, arg.target) > 0) {
					return false;
				}
				if (tag == "directHit_ai") {
					return arg.target.hp >= Math.max(1, arg.target.countCards("h") - 1);
				}
				if (arg && arg.name == "sha" && arg.target.getEquip(2)) {
					return true;
				}
				return false;
			},
		},
		group: "repojun3",
	},
	//龙陆逊
	dragqianxun: {
		trigger: { player: "phaseJudgeBegin" },
		filter(event, player) {
			return player.countCards("h") > 1;
		},
		enable: "phaseUse",
		selectCard: 2,
		filterCard: true,
		prompt: "弃置两张手牌并摸一张牌",
		check(card) {
			return 4 - get.value(card);
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseToDiscard("h", 2, get.prompt(event.skill), "弃置两张手牌并弃置判定区里的一张牌")
				.set("ai", card => {
					if (_status.event.goon) {
						return 6 - get.value(card);
					}
					return 0;
				})
				.set(
					"goon",
					(() => {
						if (player.hasSkillTag("rejudge") && player.countCards("j") < 2) {
							return false;
						}
						return player.hasCard(card => {
							if (get.tag(card, "damage") && get.damageEffect(player, player, get.player(), get.natureList(card)) >= 0) {
								return false;
							}
							const cardx = { name: card.viewAs || card.name, cards: [card] };
							return get.effect(player, cardx, player, player) < 0;
						}, "j");
					})()
				)
				.set("chooseonly", true)
				.forResult();
		},
		async content(event, trigger, player) {
			if (trigger?.name == "phaseJudge") {
				await player.discard(event.cards);
				await player.discardPlayerCard(player, "j", true);
			} else {
				await player.draw();
			}
		},
		ai: {
			order: 9,
			result: {
				player(player, target) {
					if (player.countCards("h") > player.getHandcardLimit()) {
						return 1;
					}
					return 0;
				},
			},
		},
	},
	draglianying: {
		trigger: {
			player: "loseAfter",
			global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"],
		},
		frequent: true,
		filter(event, player) {
			if (player.countCards("h")) {
				return false;
			}
			const skills = player.getSkills(null, false, false).filter(skill => {
				let info = get.info(skill);
				if (!info || info.charlotte || get.skillInfoTranslation(skill, player).length == 0) {
					return false;
				}
				return true;
			});
			const evtx = event.getParent("useSkill", true);
			if (evtx && skills.includes(evtx.skill)) {
				return false;
			}
			if (skills.some(skill => event.getParent(skill, true, true))) {
				return false;
			}
			const evt = event.getl(player);
			return evt?.player == player && evt?.hs?.length > 0;
		},
		async content(event, trigger, player) {
			await player.draw(2);
			const result = await player.chooseToDiscard([1, 2], "弃置至多两张牌，若弃置两张牌则令一种牌名的牌对你无效", "he", true).forResult();
			if (result?.cards?.length > 1) {
				player.addTempSkill("draglianying_effect", { player: "phaseBegin" });
				const list = get.inpileVCardList(info => !player.getStorage("draglianying_effect").includes(info[2]) && !info[3]);
				if (!list.length) {
					return;
				}
				const result2 = await player
					.chooseButton(["令一种牌名对你无效", [list, "vcard"]], true)
					.set("ai", button => {
						const player = get.player();
						return -get.effect(player, { name: button.link[2] }, player, player);
					})
					.forResult();
				if (!result2.bool) {
					return;
				}
				player.markAuto("draglianying_effect", result2.links[0][2]);
			}
		},
		ai: {
			threaten: 0.8,
			effect: {
				player_use(card, player, target) {
					if (player.countCards("h") === 1) {
						return [1, 0.8];
					}
				},
				target(card, player, target) {
					if (get.tag(card, "loseCard") && target.countCards("h") === 1) {
						return 0.5;
					}
				},
			},
			noh: true,
			skillTagFilter(player, tag) {
				if (tag == "noh") {
					if (player.countCards("h") != 1) {
						return false;
					}
				}
			},
		},
		subSkill: {
			effect: {
				trigger: {
					target: "useCardToBefore",
				},
				forced: true,
				onremove: true,
				charlotte: true,
				mark: true,
				intro: {
					content(storage, player) {
						if (!storage?.length) {
							return "无效果";
						}
						return `直到你的下回合开始前，${storage.map(i => get.translation(i)).join("、")}对你无效`;
					},
				},
				filter(event, player) {
					return player.getStorage("draglianying_effect").includes(event.card.name);
				},
				async content(event, trigger, player) {
					trigger.cancel();
				},
				ai: {
					effect: {
						target(card, player, target) {
							if (target.getStorage("draglianying_effect").includes(card.name)) {
								return "zeroplayertarget";
							}
						},
					},
				},
			},
		},
	},
	//申耽申仪
	draglianxiang: {
		trigger: { target: "useCardToTarget" },
		filter(event, player) {
			return event.player != player && player.countCards("he");
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseToDiscard("he", get.prompt2(event.skill))
				.set("ai", card => {
					const player = get.player(),
						targets = game.filterPlayer(current => {
							if (get.attitude(player, current) <= 0) {
								return false;
							}
							const count = c => (c == player ? -1 : 0) + c.countCards("h");
							return !game.hasPlayer(currentx => count(currentx) > count(current));
						});
					if (targets.length) {
						return 7 - get.value(card);
					}
					return 0;
				})
				.set("chooseonly", true)
				.forResult();
		},
		async content(event, trigger, player) {
			await player.discard(event.cards);
			const targets = game.filterPlayer(current => current.isMaxHandcard());
			if (!targets.length) {
				return;
			}
			let target = targets[0];
			if (targets.length > 1) {
				const result = await player
					.chooseTarget("令场上手牌数最多的一名角色摸一张牌", true, (card, player, target) => {
						return target.isMaxHandcard();
					})
					.set("ai", target => get.attitude(get.player(), target))
					.forResult();
				if (result.bool) {
					target = result.targets[0];
				}
			}
			player.line(target, "green");
			await target.draw();
		},
	},
	dragpingmeng: {
		trigger: {
			player: ["loseAfter", "useCard"],
			global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"],
		},
		frequent: true,
		filter(event, player) {
			if (player.countCards("h") >= player.maxHp) {
				return false;
			}
			if (event.name == "useCard") {
				return event.card.name == "sha";
			}
			if (player.countCards("h")) {
				return false;
			}
			const evt = event.getl(player);
			return evt?.player == player && evt?.hs?.length > 0;
		},
		async content(event, trigger, player) {
			const list = lib.group.slice().remove(player.group);
			const result = await player
				.chooseControl(list)
				.set("prompt", "平孟：请选择要变更为的势力")
				.set("ai", () => {
					return _status.event.choice;
				})
				.set("choice", list.randomGet())
				.forResult();
			await player.changeGroup(result.control);
			if (player.countCards("h") < player.maxHp) {
				await player.drawTo(player.maxHp);
			}
			player.addTempSkill("dragpingmeng_effect");
		},
		subSkill: {
			effect: {
				trigger: {
					global: "phaseJieshuBegin",
				},
				direct: true,
				charlotte: true,
				async content(event, trigger, player) {
					const card = { name: "sha", isCard: true };
					if (player.hasUseTarget(card)) {
						await player.chooseUseTarget(card);
					}
				},
			},
		},
		ai: {
			threaten: 0.8,
			effect: {
				player_use(card, player, target) {
					if (player.countCards("h") === 1) {
						return [1, 0.8];
					}
				},
				target(card, player, target) {
					if (get.tag(card, "loseCard") && target.countCards("h") === 1) {
						return 0.5;
					}
				},
			},
			noh: true,
			skillTagFilter(player, tag) {
				if (tag == "noh") {
					if (player.countCards("h") != 1) {
						return false;
					}
				}
			},
		},
	},
	dragpanfeng: {
		trigger: {
			player: ["loseAfter", "useCard"],
			global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"],
		},
		frequent: true,
		filter(event, player) {
			if (player.countCards("h") >= player.maxHp) {
				return false;
			}
			if (event.name == "useCard") {
				return event.card.name == "sha";
			}
			if (player.countCards("h")) {
				return false;
			}
			const evt = event.getl(player);
			return evt?.player == player && evt?.hs?.length > 0;
		},
		async content(event, trigger, player) {
			const list = lib.group.slice().remove(player.group);
			let targetGroup = game.findPlayer(current => {
				if (current.group == player.group) {
					return false;
				}
				return !game.hasPlayer(currentx => {
					if (currentx.group == player.group) {
						return false;
					}
					return get.damageEffect(currentx, player, player) > get.damageEffect(current, player, player);
				});
			})?.[0]?.group;
			if (!list.includes(targetGroup)) {
				targetGroup = list.randomGet();
			}
			const result = await player
				.chooseControl(list)
				.set("prompt", "叛封：请选择要变更为的势力")
				.set("ai", () => {
					return _status.event.choice;
				})
				.set("choice", targetGroup)
				.forResult();
			await player.changeGroup(result.control);
			if (player.countCards("h") < player.maxHp) {
				await player.drawTo(player.maxHp);
			}
			const targets = game.filterPlayer(cur => cur.group == player.group);
			if (!targets.length) {
				return;
			}
			if (targets.length == 1) {
				const target = targets[0];
				player.line(target, "green");
				await target.damage(player);
				return;
			}
			const result2 = await player
				.chooseTarget("对一名与你势力相同的角色造成1点伤害", true, (card, player, target) => {
					return target.group == player.group;
				})
				.set("ai", target => get.damageEffect(target, get.player(), get.player()))
				.forResult();
			if (result2.bool) {
				const target = result2.targets[0];
				player.line(target, "green");
				await target.damage(player);
			}
		},
		ai: {
			threaten: 0.8,
			effect: {
				player_use(card, player, target) {
					if (player.countCards("h") === 1) {
						return [1, 0.8];
					}
				},
				target(card, player, target) {
					if (get.tag(card, "loseCard") && target.countCards("h") === 1) {
						return 0.5;
					}
				},
			},
			noh: true,
			skillTagFilter(player, tag) {
				if (tag == "noh") {
					if (player.countCards("h") != 1) {
						return false;
					}
				}
			},
		},
	},
	//龙廖化
	dragzhawang: {
		trigger: { player: "phaseBegin" },
		async cost(event, trigger, player) {
			const result = await player
				.chooseControl("选项一", "选项二", "背水！", "cancel2")
				.set("prompt", get.prompt(event.skill))
				.set("choiceList", ["本回合获得〖诈降〗", "失去1点体力，将本回合的准备阶段和结束阶段改为摸牌阶段", "背水！减少1点体力上限"])
				.set("ai", () => {
					const player = get.player();
					if (player.maxHp > 4) {
						return "背水！";
					}
					if (player.hasSkill("dragxigui") || player.hp > 1) {
						return "选项二";
					}
					return "cancel2";
				})
				.forResult();
			event.result = {
				bool: result.control != "cancel2",
				cost_data: result.index,
			};
		},
		async content(event, trigger, player) {
			const index = event.cost_data;
			if (index != 1) {
				await player.addTempSkills(["zhaxiang"]);
			}
			if (index != 0) {
				await player.loseHp();
				player.addTempSkill("dragzhawang_draw");
			}
			if (index == 2) {
				await player.loseMaxHp();
			}
		},
		derivation: "zhaxiang",
		subSkill: {
			draw: {
				trigger: {
					player: "phaseChange",
				},
				direct: true,
				charlotte: true,
				filter(event, player) {
					return ["phaseZhunbei", "phaseJieshu"].some(key => event.phaseList[event.num].indexOf(key) != -1);
				},
				async content(event, trigger, player) {
					trigger.phaseList[trigger.num] = `phaseDraw|${event.name}`;
				},
			},
		},
	},
	dragxigui: {
		trigger: {
			global: "roundEnd",
			player: "dying",
		},
		check(event, player) {
			return event.name == "dying";
		},
		limited: true,
		filter(event, player) {
			return event.name != "dying" || event.player.hp <= 0;
		},
		skillAnimation: true,
		animationColor: "fire",
		async content(event, trigger, player) {
			player.awakenSkill(event.name);
			await player.recoverTo(player.maxHp);
			player
				.when({ global: "roundEnd" })
				.filter(evt => evt != trigger)
				.step(async (event, trigger, player) => {
					await player.changeSkills(["tydangxian"], ["dragzhawang"]);
				});
		},
		derivation: ["tydangxian"],
	},
	//龙周仓
	dragzhongyong: {
		audio: "mobilezhongyong",
		trigger: {
			global: "useCardToTarget",
		},
		filter(event, player) {
			if (event.target.group != player.group || event.targets?.includes(player)) {
				return false;
			}
			if (event.player == event.target) {
				return false;
			}
			if (!["trick", "basic"].includes(get.type2(event.card))) {
				return false;
			}
			return lib.filter.targetEnabled(event.card, event.player, player);
		},
		check(event, player) {
			const type = get.type2(event.card);
			if (get.tag(event.card, "damage") && player.hp <= type == "trick" ? 2 : 1) {
				return false;
			}
			if (type == "trick" && player.hp <= 1) {
				return false;
			}
			return get.effect(event.target, event.card, event.player, player) <= get.effect(player, event.card, event.player, player) + 1;
		},
		usable(skill, player) {
			return 1 + player.getDamagedHp();
		},
		logTarget: "target",
		async content(event, trigger, player) {
			const target = trigger.target,
				type = get.type2(trigger.card);
			const evt = trigger.getParent();
			evt.triggeredTargets2.remove(target);
			evt.targets.remove(target);
			evt.targets.push(player);
			if (type == "basic") {
				await target.draw();
			} else {
				await player.loseHp();
			}
		},
	},
	//龙关银屏
	dragxueji: {
		audio: "xueji",
		enable: "phaseUse",
		usable: 1,
		filterTarget: true,
		selectTarget() {
			const player = _status.event.player;
			return [1, Math.max(1, player.getDamagedHp())];
		},
		multiline: true,
		line: "fire",
		async content(event, trigger, player) {
			await event.target.damage("fire", "nocard");
		},
		ai: {
			damage: true,
			fireAttack: true,
			threaten: 1.5,
			order: 7,
			result: {
				target(player, target) {
					return get.damageEffect(target, player, target, "fire");
				},
			},
		},
	},
	draghuxiao: {
		audio: "huxiao",
		trigger: { source: "damageSource" },
		forced: true,
		filter(event, player) {
			if (!event.player.isIn()) {
				return false;
			}
			return event.hasNature("fire") && !player.hasHistory("sourceDamage", evt => evt.hasNature("fire") && evt != event, event);
		},
		logTarget: "player",
		async content(event, trigger, player) {
			await player.draw();
			player.addTempSkill("draghuxiao_effect");
			player.markAuto("draghuxiao_effect", trigger.player);
		},
		subSkill: {
			effect: {
				onremove: true,
				mark: true,
				intro: {
					content: "players",
				},
				mod: {
					cardUsableTarget(card, player, target) {
						if (player.getStorage("draghuxiao_effect").includes(target)) {
							return true;
						}
					},
				},
			},
		},
	},
	//龙关平
	draglongyin: {
		audio: "relongyin",
		trigger: {
			global: "useCard",
		},
		filter(event, player) {
			if (event.card.name != "sha" || !event.player.isPhaseUsing()) {
				return false;
			}
			if (get.color(event.card) != "red") {
				return false;
			}
			return true;
		},
		usable: 1,
		logTarget: "player",
		check(event, player) {
			return get.attitude(player, event.player) > 0;
		},
		async content(event, trigger, player) {
			const result = await player.draw().forResult();
			if (!result) {
				return;
			}
			await player.showCards(result, `${get.translation(player)}发动了【龙吟】`);
			if (trigger.addCount !== false) {
				trigger.addCount = false;
				trigger.player.getStat().card.sha--;
			}
			if (get.color(result[0]) == get.color(trigger.card)) {
				trigger.effectCount++;
			}
		},
	},
	dragjiezhong: {
		audio: "jiezhong",
		trigger: {
			global: "phaseZhunbeiBegin",
		},
		limited: true,
		skillAnimation: true,
		animationColor: "orange",
		check(event, player) {
			if (event.player == player) {
				return !game.hasPlayer(current => get.attitude(player, current) >= 0 && current != player);
			}
			return get.attitude(player, event.player) > 0;
		},
		logTarget: "player",
		async content(event, trigger, player) {
			player.awakenSkill(event.name);
			await trigger.player.draw(player.hp);
			if (trigger.player != player) {
				player.when({ global: "roundStart" }).then(() => {
					player.restoreSkill("dragjiezhong");
				});
			}
		},
	},
	//龙关索
	dragqianfu: {
		enable: "chooseToUse",
		filter(event, player) {
			if (event.type === "wuxie") {
				return false;
			}
			return get
				.inpileVCardList(info => get.type(info[2]) == "basic")
				.some(card => {
					return event.filterCard({ name: card[2], nature: card[3] }, player, event);
				});
		},
		usable: 1,
		chooseButton: {
			dialog(event, player) {
				const list = get
					.inpileVCardList(info => get.type(info[2]) == "basic")
					.filter(card => {
						return event.filterCard({ name: card[2], nature: card[3] }, player, event);
					});
				return ui.create.dialog("搴芙", [list, "vcard"], "hidden");
			},
			check(button) {
				const event = get.event().getParent();
				if (event.type !== "phase") {
					return 1;
				}
				return get.player().getUseValue({ name: button.link[2], nature: button.link[3] });
			},
			prompt(links) {
				return "视为使用" + (get.translation(links[0][3]) || "") + get.translation(links[0][2]) + "并摸三张牌";
			},
			backup(links, player) {
				return {
					selectCard: -1,
					filterCard: () => false,
					viewAs: {
						name: links[0][2],
						nature: links[0][3],
						isCard: true,
						storage: {
							dragqianfu: true,
						},
					},
					precontent() {
						player.logSkill("dragqianfu");
						player.addTempSkill("dragqianfu_effect");
					},
				};
			},
		},
		hiddenCard(player, name) {
			if (player.getStat("skill").dragqianfu) {
				return false;
			}
			return get.type(name) == "basic" && lib.inpile.includes(name);
		},
		ai: {
			order: 10,
			respondShan: true,
			respondSha: true,
			skillTagFilter(player, tag, arg) {
				if (arg === "respond") {
					return false;
				}
				return get.info("dragqianfu").hiddenCard(player, tag.slice("respond".length).toLowerCase());
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
		subSkill: {
			effect: {
				charlotte: true,
				trigger: {
					player: ["useCardToPlayer", "useCardAfter"],
				},
				filter(event, player, name) {
					if (!event?.card?.storage?.dragqianfu) {
						return false;
					}
					return name == "useCardAfter" || event.target.hasSex("female");
				},
				forced: true,
				direct: true,
				async content(event, trigger, player) {
					if (event.triggername == "useCardAfter") {
						await player.draw(3);
					} else {
						await trigger.target.gainMaxHp();
					}
				},
			},
		},
	},
	dragchengyuan: {
		trigger: {
			global: "dying",
		},
		check(event, player) {
			if (get.attitude(player, event.player) < 4) {
				return false;
			}
			if (event.player == player || event.player == get.zhu(player)) {
				return true;
			}
			return !player.hasUnknown();
		},
		limited: true,
		filter(event, player) {
			if (event.player != player && !event.player.hasSex("female")) {
				return false;
			}
			return event.player.hp <= 0;
		},
		skillAnimation: true,
		animationColor: "fire",
		logTarget: "player",
		async content(event, trigger, player) {
			player.awakenSkill(event.name);
			await trigger.player.recoverTo(trigger.player.maxHp);
		},
	},
	dragyuxian: {
		dutySkill: true,
		derivation: ["dragyinglong", "dragxiefang"],
		group: ["dragyuxian_phase", "dragyuxian_achieve", "dragyuxian_fail"],
		subSkill: {
			phase: {
				trigger: {
					global: "phaseAfter",
				},
				prompt2: "执行一个额外回合",
				filter(event, player) {
					if (player.hasSkill("dragyuxian_used")) {
						return false;
					}
					return game.hasGlobalHistory("changeHp", evt => {
						return evt.getParent().name == "recover" && [event.player, player].some(p => p == evt.player);
					});
				},
				async content(event, trigger, player) {
					player.addTempSkill("dragyuxian_used", "roundStart");
					player.insertPhase();
				},
			},
			used: {
				charlotte: true,
			},
			achieve: {
				trigger: {
					player: "phaseZhunbeiBegin",
				},
				filter(event, player) {
					return player.actionHistory.filter(i => i.isMe && !i.isSkipped).length >= 4;
				},
				forced: true,
				locked: false,
				skillAnimation: true,
				animationColor: "fire",
				async content(event, trigger, player) {
					player.awakenSkill("dragyuxian");
					game.log(player, "成功完成使命");
					player.addSkills(["dragyinglong", "dragxiefang"]);
				},
			},
			fail: {
				trigger: {
					player: "dying",
				},
				forced: true,
				filter(event, player) {
					return event.source?.hasSex("female");
				},
				locked: false,
				content() {
					player.awakenSkill("dragyuxian");
					game.log(player, "使命失败");
				},
			},
		},
	},
	dragyinglong: {
		trigger: {
			global: "useCard",
		},
		filter(event, player) {
			return get.is.convertedCard(event.card) || get.is.virtualCard(event.card);
		},
		usable: 1,
		async cost(event, trigger, player) {
			const target = trigger.player;
			const result = await player
				.chooseControl("cancel2")
				.set("prompt", get.prompt(event.skill, target))
				.set("choiceList", [`令${get.translation(target)}本回合使用${get.translation(get.type2(trigger.card))}牌不可被响应`, `令${get.translation(target)}本回合使用${get.translation(get.color(trigger.card))}牌无次数限制`])
				.set("ai", () => {
					const player = get.player(),
						trigger = get.event().getTrigger();
					if (get.attitude(player, trigger.player) <= 0) {
						return "cancel2";
					}
					if (get.color(trigger.card) == "none") {
						return "选项一";
					}
					return target.countCards("h") > Math.random() * 4 ? "选项二" : "选项一";
				})
				.forResult();
			event.result = {
				bool: result.control != "cancel2",
				targets: [target],
				cost_data: result.control,
			};
		},
		async content(event, trigger, player) {
			const target = trigger.player,
				result = event.cost_data == "选项一" ? "dragyinglong_directHit" : "dragyinglong_unlimit";
			target.addTempSkill(result);
			target.markAuto(result, trigger.card);
		},
		subSkill: {
			directHit: {
				onremove: true,
				trigger: {
					player: "useCard",
				},
				filter(event, player) {
					return player.getStorage("dragyinglong_directHit").some(card => get.type2(card) == get.type2(event.card));
				},
				marktext: "威",
				intro: {
					markcount: () => null,
					content(storage, player) {
						const list = player
							.getStorage("dragyinglong_directHit")
							.map(card => {
								return get.translation(get.type2(card));
							})
							.toUniqued();
						if (list.length) {
							return `本回合使用${list.join("、")}牌不可被响应`;
						}
						return "无效果";
					},
				},
				charlotte: true,
				forced: true,
				async content(event, trigger, player) {
					trigger.directHit.addArray(game.players);
					game.log(trigger.card, "不可被响应");
				},
				ai: {
					directHit_ai: true,
					skillTagFilter(player, tag, arg) {
						if (!player.getStorage("dragyinglong_directHit").some(card => get.type2(card) == get.type2(arg.card))) {
							return false;
						}
					},
				},
			},
			unlimit: {
				onremove: true,
				marktext: "武",
				intro: {
					markcount: () => null,
					content(storage, player) {
						const list = player
							.getStorage("dragyinglong_unlimit")
							.map(card => {
								return get.translation(get.color(card));
							})
							.toUniqued();
						if (list.length) {
							return `本回合使用${list.join("、")}牌无次数限制`;
						}
						return "无效果";
					},
				},
				charlotte: true,
				mod: {
					cardUsable(card, player) {
						const color = get.color(card);
						if (color == "unsure" || player.getStorage("dragyinglong_unlimit").some(cardx => get.color(cardx) == color)) {
							return Infinity;
						}
					},
				},
			},
		},
	},
	dragxiefang: {
		locked: false,
		trigger: {
			player: "useCard2",
		},
		filter(event, player) {
			if (!["basic", "trick"].includes(get.type(event.card))) {
				return false;
			}
			if (!event.targets) {
				return false;
			}
			const info = get.info(event.card);
			if (info.allowMultiple == false) {
				return false;
			}
			if (
				event.targets &&
				!info.multitarget &&
				game.hasPlayer(current => {
					return !event.targets.includes(current) && lib.filter.targetEnabled2(event.card, player, current) && lib.filter.targetInRange(event.card, player, current);
				})
			) {
				return true;
			}
			return false;
		},
		async cost(event, trigger, player) {
			const num = Math.max(
				1,
				game.countPlayer(current => current.hasSex("female"))
			);
			event.result = await player
				.chooseTarget(
					get.prompt(event.skill),
					`为${get.translation(trigger.card)}额外指定至多${get.cnNumber(num)}个目标`,
					(card, player, target) => {
						const { targets, card: cardx } = get.event();
						if (targets.includes(target)) {
							return false;
						}
						return lib.filter.targetEnabled2(cardx, player, target) && lib.filter.targetInRange(cardx, player, target);
					},
					[1, num]
				)
				.set("autodelay", true)
				.set("ai", target => {
					const trigger = get.event().getTrigger(),
						player = get.player();
					return get.effect(target, trigger.card, player, player);
				})
				.set("targets", trigger.targets)
				.set("card", trigger.card)
				.forResult();
		},
		async content(event, trigger, player) {
			trigger.targets.addArray(event.targets);
		},
		mod: {
			globalFrom(from, to, distance) {
				const num = Math.max(
					1,
					game.countPlayer(current => current.hasSex("female"))
				);
				return distance - num;
			},
		},
	},
	//华雌
	dragshiyao: {
		global: "dragshiyao_global",
		subSkill: {
			global: {
				enable: "phaseUse",
				usable: 1,
				filterTarget(card, player, target) {
					return target.hasSkill("dragshiyao");
				},
				filter(event, player) {
					const num = game.countPlayer(current => current.hasSkill("dragshiyao"));
					return num > 0;
				},
				selectTarget() {
					const num = game.countPlayer(current => current.hasSkill("dragshiyao"));
					if (num > 1) {
						return 1;
					}
					return -1;
				},
				async content(event, trigger, player) {
					const target = event.target;
					await player.draw();
					const card = game.createCard("du", lib.suit.randomGet(), Math.ceil(Math.random() * 13));
					if (card) {
						await target.gain(card, "gain2");
					}
					const result = await player
						.judge(card => {
							if (get.color(card) == "red") {
								return 2;
							}
							return 1;
						})
						.forResult();
					if (result.color == "red" && player.hasUseTarget({ name: "tao" })) {
						const next = player.chooseToUse();
						next.set("openskilldialog", "试药：是否将一张红色牌当做【桃】使用？");
						next.set("norestore", true);
						next.set("addCount", false);
						next.set("_backupevent", "dragshiyao_backup");
						next.set("custom", {
							add: {},
							replace: { window() {} },
						});
						next.backup("dragshiyao_backup");
					} else if (result.color == "black") {
						await target.loseMaxHp();
						const cardx = game.createCard("du", lib.suit.randomGet(), Math.ceil(Math.random() * 13));
						if (cardx) {
							await player.gain(cardx, "gain2");
						}
					}
				},
				ai: {
					order: 1,
					result: {
						player: 1,
					},
				},
			},
			backup: {
				filterCard(card) {
					return get.itemtype(card) == "card" && get.color(card) == "red";
				},
				viewAs: {
					name: "tao",
				},
				position: "hes",
				selectCard: 1,
				check: card => 7 - get.value(card),
				popname: true,
			},
		},
	},
	dragzuoyu: {
		trigger: {
			global: ["loseHpAfter", "recoverAfter"],
		},
		usable: 1,
		filter(event, player) {
			if (event.player == _status.currentPhase || event.player == player) {
				return false;
			}
			if (event.name == "recover") {
				return true;
			}
			if (!player.countCards("hes", "du") && !_status.connectMode) {
				return false;
			}
			if (!event.player.isIn()) {
				return false;
			}
			return ["sha", "guaguliaodu", "yidugongdu"].some(name => {
				if (player.getStorage("dragduyi_used").includes(name)) {
					return false;
				}
				return player.canUse(get.autoViewAs({ name: name }, "unsure"), event.player, false);
			});
		},
		derivation: "dragduyi",
		direct: true,
		async content(event, trigger, player) {
			if (trigger.name == "recover") {
				const result = await player.chooseBool(get.prompt("dragzuoyu"), "增加1点体力上限").forResult();
				if (result.bool) {
					player.logSkill(event.name);
					await player.gainMaxHp();
					return;
				}
			} else {
				const list = [],
					target = trigger.player;
				for (const name of ["sha", "guaguliaodu", "yidugongdu"]) {
					if (player.getStorage("dragduyi_used").includes(name)) {
						continue;
					}
					if (player.canUse(get.autoViewAs({ name: name }, "unsure"), target, false)) {
						list.push([get.type(name), "", name]);
					}
				}
				if (list.length) {
					const result = await player
						.chooseButton([get.prompt("dragzuoyu", target), [list, "vcard"]])
						.set("ai", button => {
							const player = _status.event.player;
							return player.getUseValue({
								name: button.link[2],
							});
						})
						.forResult();
					if (result.bool) {
						const card = { name: result.links[0][2] };
						game.broadcastAll(card => {
							lib.skill.dragduyi_backup.viewAs = card;
						}, card);
						const next = player.chooseToUse();
						next.set("openskilldialog", `毒医：是否将一张【毒】当做【${get.translation(card)}】对${get.translation(target)}使用`);
						next.set("norestore", true);
						next.set("addCount", false);
						next.set("_backupevent", "dragduyi_backup");
						next.set("custom", {
							add: {},
							replace: { window() {} },
						});
						next.set("onlyTarget", target);
						next.backup("dragduyi_backup");
						const result2 = await next.forResult();
						if (result2.bool) {
							return;
						}
					}
				}
			}
			player.storage.counttrigger.dragzuoyu--;
		},
	},
	dragduyi: {
		enable: "chooseToUse",
		filter(event, player) {
			if (!player.countCards("hes", "du") && !_status.connectMode) {
				return false;
			}
			return ["sha", "guaguliaodu", "yidugongdu"].some(name => {
				if (player.getStorage("dragduyi_used").includes(name)) {
					return false;
				}
				return event.filterCard(get.autoViewAs({ name: name }, "unsure"), player, event);
			});
		},
		chooseButton: {
			dialog(event, player) {
				const list = [];
				for (const name of ["sha", "guaguliaodu", "yidugongdu"]) {
					if (player.getStorage("dragduyi_used").includes(name)) {
						continue;
					}
					if (event.filterCard(get.autoViewAs({ name: name }, "unsure"), player, event)) {
						list.push([get.type(name), "", name]);
					}
				}
				return ui.create.dialog("毒医", [list, "vcard"]);
			},
			check(button) {
				const player = _status.event.player;
				return player.getUseValue({
					name: button.link[2],
				});
			},
			backup(links, player) {
				const backup = get.copy(lib.skill["dragduyi_backup"]);
				backup.viewAs = { name: links[0][2] };
				return backup;
			},
			prompt(links, player) {
				return "将一张【毒】当做【" + get.translation(links[0][2]) + "】使用";
			},
		},
		hiddenCard(player, name) {
			if (!["sha", "guaguliaodu", "yidugongdu"].includes(name)) {
				return false;
			}
			if (player.getStorage("dragduyi_used").includes(name)) {
				return false;
			}
			return player.countCards("hes", "du");
		},
		ai: {
			respondSha: true,
			skillTagFilter(player) {
				if (player.getStorage("dragduyi_used").includes("sha")) {
					return false;
				}
				if (!player.countCards("hes", "du")) {
					return false;
				}
			},
			order: 1,
			result: { player: 1 },
		},
		subSkill: {
			used: {
				charlotte: true,
				onremove: true,
			},
			backup: {
				filterCard: card => get.itemtype(card) == "card" && get.name(card) == "du",
				popname: true,
				check(card) {
					return 8 - get.value(card);
				},
				filterTarget(card, player, target) {
					const targetx = get.event("onlyTarget");
					if (targetx && targetx != target) {
						return false;
					}
					return lib.filter.filterTarget.apply(this, arguments);
				},
				position: "hes",
				async precontent(event, trigger, player) {
					const evt = event.getParent("chooseToUse", null, true);
					if (evt?.onlyTarget) {
						player.logSkill("dragzuoyu", [evt.onlyTarget]);
					}
				},
				onuse(event, player) {
					player.addTempSkill("dragduyi_used");
					player.markAuto("dragduyi_used", event.card.name);
				},
			},
		},
	},
	dragjuliao: {
		trigger: {
			player: "loseHpBegin",
			global: "useCardToTargeted",
		},
		forced: true,
		filter(event, player) {
			if (event.name == "loseHp") {
				return event.type == "du";
			}
			if (event.player != player || event.target == player) {
				return false;
			}
			return get.is.convertedCard(event.card);
		},
		logTarget(event, player) {
			return event[event.name == "loseHp" ? "player" : "target"];
		},
		async content(event, trigger, player) {
			if (trigger.name == "loseHp") {
				trigger.cancel();
			} else {
				const target = trigger.target,
					bool = target.maxHp > 1 && get.effect(target, trigger.card, player, target) <= -7;
				const result = await target
					.chooseBool(`拒疗：是否减少1点体力上限，令【${get.translation(trigger.card)}】对你无效？`)
					.set("choice", bool)
					.forResult();
				if (result.bool) {
					await target.loseMaxHp();
					trigger.getParent().excluded.add(target);
				}
			}
		},
		ai: {
			nodu: true,
		},
	},
	xingbian_skill: {
		equipSkill: true,
		mod: {
			attackRange(player, distance) {
				return distance + player.countCards("e", card => card.name == "xingbian");
			},
		},
		trigger: {
			player: "phaseUseBegin",
		},
		forced: true,
		intro: {
			content(storage, player) {
				let str = "";
				for (const arg of storage) {
					str += `${get.translation(arg[0])}命你攻击${get.translation(arg[1])}<br>`;
				}
				return str.slice(0, -4);
			},
		},
		logTarget(event, player) {
			return game.filterPlayer(current => get.nameList(current).includes("yj_tianchuan"));
		},
		filter(event, player) {
			const targets = lib.skill.xingbian_skill.logTarget(event, player);
			return targets && targets.length;
		},
		async content(event, trigger, player) {
			for (const target of event.targets) {
				const result = await target
					.chooseTarget(`刑鞭：为${get.translation(player)}指定塔塔开目标`, true, function (card, player, targetx) {
						return targetx != _status.event.owner;
					})
					.set("owner", player)
					.set("ai", target => {
						return get.distance(_status.event.owner, target) + 1;
					})
					.forResult();
				if (result.bool) {
					if (!player.getStorage("xingbian_skill").length) {
						player.when("phaseJieshuBegin").then(() => {
							const args = player.storage.xingbian_skill.shift();
							let damage = true;
							if (player.getHistory("useCard", evt => evt.card.name == "sha" && evt.targets?.includes(args[1])).length) {
								damage = false;
							}
							if (player.getHistory("sourceDamage", evt => evt.player == args[1]).length) {
								damage = false;
							}
							if (damage === true) {
								args[0].chat("该罚！");
								args[0].line(player, "green");
								player.damage(player);
							}
							if (player.storage.xingbian_skill.length) {
								event.redo();
							} else {
								player.unmarkSkill("xingbian_skill");
								delete player.storage.xingbian_skill;
							}
						});
						player.storage.xingbian_skill = [];
					}
					target.line(result.targets[0], "green");
					player.storage.xingbian_skill.push([target, result.targets[0]]);
					player.markSkill("xingbian_skill");
				}
			}
		},
	},
};

export default skills;
