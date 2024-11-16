import { lib, game, ui, get, ai, _status } from "../../noname.js";

/** @type { importCharacterConfig['skill'] } */
const skills = {
	//四象封印·少阴
	//孙皓
	stdcanshi: {
		audio: "canshi",
		inherit: "canshi",
		forced: true,
		async content(event, trigger, player) {
			trigger.changeToZero();
			await player.draw(
				Math.max(
					1,
					game.countPlayer(target => {
						if (player.hasSkill("guiming") && target != player && target.group == "wu") return true;
						return target.isDamaged();
					})
				)
			);
			player.addTempSkill("stdcanshi_effect");
		},
		subSkill: {
			effect: {
				charlotte: true,
				trigger: { player: "useCardToPlayered" },
				filter(event, player) {
					if (event.card.name != "sha" && get.type(event.card) != "trick") return false;
					return event.target.isDamaged() && player.countCards("he");
				},
				forced: true,
				autodelay: true,
				content() {
					player.chooseToDiscard("he", true);
				},
			},
		},
	},
	//马腾
	stdxiongyi: {
		unique: true,
		limited: true,
		audio: "xiongyi",
		enable: "phaseUse",
		filterTarget: true,
		selectTarget: [1, Infinity],
		multitarget: true,
		multiline: true,
		skillAnimation: true,
		animationColor: "thunder",
		async content(event, trigger, player) {
			player.awakenSkill("stdxiongyi");
			const targets = event.targets.sortBySeat();
			let keep = true;
			while (true) {
				let stop = false;
				for (const target of targets) {
					let next = target
						.chooseToUse(function (card) {
							const event = get.event();
							if (!lib.filter.cardEnabled(card, event.player, event)) return false;
							return get.name(card) == "sha";
						}, "雄异：是否使用一张不可被响应的【杀】？")
						.set("oncard", card => {
							_status.event.directHit.addArray(game.players);
						});
					if (!keep) next.set("prompt2", "若你不使用，则结束此流程");
					const result = await next.forResult();
					if (!result.bool && !keep) {
						stop = true;
						break;
					}
				}
				if (keep) keep = false;
				if (stop) break;
			}
		},
		ai: {
			order: 10,
			result: {
				target(player, target) {
					if (player.hasUnknown()) return 0;
					return target.countCards("hs");
				},
			},
		},
	},
	stdyouji: {
		audio: 2,
		trigger: { player: "phaseZhunbeiBegin" },
		filter(event, player) {
			return player.canMoveCard(
				null,
				true,
				game.filterPlayer(i => {
					return i.group == "qun";
				}),
				card => {
					return [3, 4, 6].includes(parseInt(get.subtype(card).slice("equip".length)));
				},
				"nojudge"
			);
		},
		direct: true,
		zhuSkill: true,
		content() {
			player
				.moveCard(
					game.filterPlayer(i => {
						return i.group == "qun";
					}),
					card => {
						return [3, 4, 6].includes(parseInt(get.subtype(card).slice("equip".length)));
					}
				)
				.set("prompt", get.prompt2("stdyouji"))
				.set("nojudge", true)
				.set("logSkill", "stdyouji");
		},
	},
	//马云禄
	stdfengpo: {
		audio: "fengpo",
		trigger: { source: "damageBegin1" },
		filter(event, player) {
			return (
				event.card.name == "sha" &&
				[player, event.player].some(target => {
					return target.isIn() && target.countCards("he");
				})
			);
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt2("stdfengpo"), (card, player, target) => {
					const event = get.event().getTrigger();
					return [player, event.player]
						.filter(targetx => {
							return targetx.isIn() && targetx.countCards("he");
						})
						.includes(target);
				})
				.set("ai", target => {
					const player = get.event("player"),
						aim = get.event().getTrigger().player;
					if (get.attitude(player, aim) > 0 || get.damageEffect(aim, player, player) < 0) return 0;
					if (aim.countCards("he")) return -5;
					if (player.getDiscardableCards(player, "he").some(card => get.suit(card) == "diamond")) return 1;
					return 0;
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			const result = await player
				.discardPlayerCard(target, "he", true)
				.set("ai", button => {
					const suit = get.suit(button.link);
					return (suit == "diamond" ? 5 : 1) * get.value(button.link);
				})
				.set("prompt", "凤魄：弃置" + (target != player ? get.translation(target) : "") + "一张牌")
				.set("prompt2", "若弃置了方片牌，则此伤害+1")
				.forResult();
			if (result.bool) {
				if (result.cards && result.cards.some(i => get.suit(i, target) == "diamond")) {
					player.popup("洗具");
					trigger.increase("num");
				}
			}
		},
	},
	//蒋干
	stddaoshu: {
		audio: "daoshu",
		trigger: { global: "phaseZhunbeiBegin" },
		filter(event, player) {
			return game.hasPlayer(target => {
				return target != event.player && target.countCards("h");
			});
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt2("stddaoshu"), (card, player, target) => {
					const event = get.event().getTrigger();
					return target != event.player && target.countCards("h");
				})
				.set("ai", target => {
					const player = get.event("player");
					return -1 / target.countCards("h");
				})
				.forResult();
		},
		async content(event, trigger, player) {
			player.tempBanSkill("stddaoshu", "roundStart", false);
			const target = event.targets[0];
			const result = await player.choosePlayerCard(target, "h", true).forResult();
			if (result.bool) {
				const cards = result.cards || [];
				if (cards.length) {
					await player.showCards(cards, get.translation(player) + "发动了【盗书】");
					await trigger.player.gain(cards, target, "give");
					const suits = cards.reduce((list, card) => {
						return list.add(get.suit(card, target));
					}, []);
					if (suits.length) {
						for (const i of [player, trigger.player]) {
							i.addTempSkill("stddaoshu_effect");
							i.markAuto("stddaoshu_effect", suits);
						}
					}
				}
			}
		},
		subSkill: {
			effect: {
				charlotte: true,
				onremove: true,
				mod: {
					cardEnabled(card, player) {
						if (player.getStorage("stddaoshu_effect").includes(get.suit(card))) return false;
					},
					cardSavable(card, player) {
						if (player.getStorage("stddaoshu_effect").includes(get.suit(card))) return false;
					},
				},
				intro: { content: "不能使用$花色的牌" },
			},
		},
	},
	stddaizui: {
		audio: "spdaizui",
		trigger: { player: "damageEnd" },
		filter(event, player) {
			return player.isTempBanned("stddaoshu");
		},
		forced: true,
		content() {
			delete player.storage.temp_ban_stddaoshu;
			player.popup("盗书");
			game.log(player, "重置了技能", "#g【盗书】");
		},
		ai: {
			combo: "stddaoshu"
		},
	},
	//周处
	stdxiongxia: {
		audio: "xianghai",
		enable: "chooseToUse",
		filterCard: true,
		selectCard: 2,
		position: "hes",
		viewAs: { name: "juedou" },
		selectTarget: 2,
		viewAsFilter(player) {
			if (player.countCards("hes") < 2) return false;
		},
		check(card) {
			if (get.name(card) == "sha") return 4 - get.value(card);
			return 7.5 - get.value(card);
		},
		onuse(links, player) {
			player.addTempSkill("stdxiongxia_effect");
		},
		subSkill: {
			effect: {
				charlotte: true,
				trigger: { player: "useCardAfter" },
				filter(event, player) {
					return (
						event.skill == "stdxiongxia" &&
						(event.targets || []).every(target => {
							return target.getHistory("damage", evt => {
								return evt.card && evt.card == event.card;
							}).length;
						})
					);
				},
				forced: true,
				popup: false,
				content() {
					player.tempBanSkill("stdxiongxia");
				},
			},
		},
	},
	//吕玲绮
	stdhuizhan: {
		audio: "guowu",
		trigger: { player: "useCard2" },
		filter(event, player) {
			if (event.card.name != "sha") return false;
			return game.hasPlayer(target => {
				return !event.targets.includes(target) && lib.filter.targetEnabled2(event.card, player, target) && lib.filter.targetInRange(event.card, player, target);
			});
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(
					get.prompt2("stdhuizhan"),
					(card, player, target) => {
						const event = get.event().getTrigger();
						return !event.targets.includes(target) && lib.filter.targetEnabled2(event.card, player, target) && lib.filter.targetInRange(event.card, player, target);
					},
					[1, 2]
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
			player.addTempSkill("stdhuizhan_effect");
			trigger.card.stdhuizhan = true;
		},
		subSkill: {
			effect: {
				charlotte: true,
				trigger: { global: "chooseToUseBegin" },
				filter(event, player) {
					if (event._stdhuizhan_effect) return false;
					const evt = event.getParent(2);
					return evt.card && evt.card.stdhuizhan;
				},
				forced: true,
				popup: false,
				forceDie: true,
				async content(event, trigger, player) {
					trigger._stdhuizhan_effect = true;
					const targets = trigger
						.getParent(2)
						.targets.filter(i => {
							return i != trigger.player;
						})
						.sortBySeat();
					if (targets.length) {
						for (const target of targets) {
							if (!target.isIn()) continue;
							const next = target.chooseToUse("挥战：是否替" + get.translation(trigger.player) + "使用一张【闪】？", { name: "shan" });
							next.set("ai", () => {
								const event = _status.event;
								return get.attitude(event.player, event.source) - 2;
							});
							next.set("skillwarn", "替" + get.translation(player) + "打出一张闪");
							next.autochoose = lib.filter.autoRespondShan;
							next.set("source", player);
							const result = await next.forResult();
							if (result.bool) {
								trigger.result = { bool: true, card: { name: "shan", isCard: true, cards: result.cards.slice() }, cards: result.cards.slice() };
								trigger.responded = true;
								trigger.animate = false;
								break;
							}
						}
					}
				},
			},
		},
	},
	//羊祜
	stdmingfa: {
		audio: "dcmingfa",
		enable: "phaseUse",
		filter(event, player) {
			if (player.hasSkill("stdmingfa_used")) return false;
			return game.hasPlayer(target => target.getHp() > 1);
		},
		filterTarget(card, player, target) {
			return target.getHp() > 1;
		},
		async content(event, trigger, player) {
			const target = event.target;
			await target.damage();
			if (target.isIn()) {
				player.addSkill("stdmingfa_used");
				player.markAuto("stdmingfa_used", [target]);
			}
		},
		subSkill: {
			used: {
				charlotte: true,
				onremove: true,
				trigger: { global: ["dieAfter", "recoverAfter"] },
				filter(event, player) {
					return player.getStorage("stdmingfa_used").includes(event.player);
				},
				forced: true,
				popup: false,
				content() {
					player.popup("明伐");
					game.log(player, "恢复了技能", "#g【明伐】");
					player.removeSkill("stdmingfa_used");
				},
			},
		},
		ai: {
			order: 10,
			result: {
				target(player, target) {
					return get.sgn(get.attitude(player, target)) * get.damageEffect(target, player, player);
				},
			},
		},
	},
	//骆统
	stdrenzheng: {
		audio: "renzheng",
		trigger: { global: ["damageCancelled", "damageZero"] },
		filter(event, player, name) {
			if (!_status.currentPhase || !_status.currentPhase.isIn()) return false;
			if (name == "damageCancelled") return true;
			return event.change_history.some(i => i < 0);
		},
		forced: true,
		logTarget: () => _status.currentPhase,
		content() {
			_status.currentPhase.draw();
		},
	},
	stdjinjian: {
		audio: "jinjian",
		trigger: { source: "damageBegin1" },
		logTarget: "player",
		filter: function (event, player) {
			return !event.stdjinjian_source2 && !player.hasSkill("stdjinjian_source2");
		},
		prompt2: "令即将对其造成的伤害+1",
		check: function (event, player) {
			return (
				get.attitude(player, event.player) < 0 &&
				!event.player.hasSkillTag("filterDamage", null, {
					player: player,
					card: event.card,
				})
			);
		},
		usable: 1,
		content: function () {
			trigger.stdjinjian_source = true;
			trigger.num++;
			player.addTempSkill("stdjinjian_source2");
		},
		group: "stdjinjian_player",
		subSkill: {
			player: {
				audio: "jinjian",
				trigger: { player: "damageBegin4" },
				filter: function (event, player) {
					return !event.stdjinjian_player2 && !player.hasSkill("stdjinjian_player2");
				},
				prompt2: "令即将受到的伤害-1",
				usable: 1,
				content: function () {
					trigger.stdjinjian_player = true;
					trigger.num--;
					player.addTempSkill("stdjinjian_player2");
				},
			},
			source2: {
				trigger: { source: "damageBegin1" },
				forced: true,
				charlotte: true,
				filter: function (event, player) {
					return !event.stdjinjian_source;
				},
				content: function () {
					trigger.num--;
					trigger.stdjinjian_source2 = true;
					player.removeSkill("stdjinjian_source2");
				},
				marktext: " -1 ",
				intro: {
					content: "下次造成的伤害-1",
				},
			},
			player2: {
				trigger: { player: "damageBegin3" },
				forced: true,
				charlotte: true,
				filter: function (event, player) {
					return !event.stdjinjian_player;
				},
				content: function () {
					trigger.num++;
					trigger.stdjinjian_player2 = true;
					player.removeSkill("stdjinjian_player2");
				},
				marktext: " +1 ",
				intro: {
					content: "下次受到的伤害+1",
				},
			},
		},
		ai: {
			maixie_defend: true,
			threaten: 0.9,
			effect: {
				target: function (card, player, target) {
					if (player.hasSkillTag("jueqing", false, target)) return;
					if (player._stdjinjian_tmp) return;
					const count = player.storage.counttrigger;
					if (count && count.stdjinjian_player && count.stdjinjian_player > 0) return;
					if (_status.event.getParent("useCard", true) || _status.event.getParent("_wuxie", true)) return;
					if (get.tag(card, "damage")) {
						if (target.hasSkill("stdjinjian_player2")) {
							return [1, -2];
						} else {
							if (get.attitude(player, target) > 0) {
								return [0, 0.2];
							}
							if (get.attitude(player, target) < 0 && !player.hasSkillTag("damageBonus")) {
								var sha = player.getCardUsable({ name: "sha" });
								player._stdjinjian_tmp = true;
								var num = player.countCards("h", function (card) {
									if (card.name == "sha") {
										if (sha == 0) {
											return false;
										} else {
											sha--;
										}
									}
									return get.tag(card, "damage") && player.canUse(card, target) && get.effect(target, card, player, player) > 0;
								});
								delete player._stdjinjian_tmp;
								if (player.hasSkillTag("damage")) {
									num++;
								}
								if (num < 2) {
									return [0, 0.8];
								}
							}
						}
					}
				},
			},
		},
	},
	//李傕
	stdxiongsuan: {
		audio: "xinfu_langxi",
		trigger: { player: "phaseZhunbeiBegin" },
		filter(event, player) {
			return player.isMaxHp();
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(
					"请选择【凶算】的目标",
					lib.translate.stdxiongsuan_info,
					(card, player, target) => {
						return target.getHp() == player.getHp();
					},
					[1, Infinity],
					true
				)
				.set("ai", target => {
					const player = get.event("player");
					return get.damageEffect(target, player, player);
				})
				.forResult();
		},
		locked: true,
		async content(event, trigger, player) {
			for (const i of event.targets) {
				await i.damage();
			}
		},
		ai: {
			effect: {
				target(card, player, target) {
					if (
						target.hp <= 1 ||
						!target.hasFriend() ||
						!_status.currentPhase ||
						!get.tag(card, "damage")
					) return;
					let hp = target.hp - 1;
					if (game.hasPlayer(cur => {
						return cur.hp > hp;
					})) return;
					let ori = game.countPlayer(cur => {
						return cur.hp === hp + 1 && get.attitude(target, cur) <= 0;
					}), now = game.countPlayer(cur => {
						return cur.hp === hp && get.attitude(target, cur) <= 0;
					}), seat = 1, tar = _status.currentPhase.next;
					while (tar !== target) {
						if (get.attitude(target, tar) <= 0) seat++;
						tar = tar.next;
					}
					return [1, 2 * (now - ori) / seat];
				}
			}
		}
	},
	//程普
	stdchunlao: {
		audio: "chunlao",
		trigger: { player: "phaseDiscardEnd" },
		filter(event, player) {
			return (
				(event.cards || []).length >= 2 &&
				game.hasPlayer(target => {
					return target != player && target.countCards("h");
				})
			);
		},
		async cost(event, trigger, player) {
			const cards = trigger.cards;
			event.result = await player
				.chooseTarget(get.prompt("stdchunlao"), "用" + get.translation(cards) + "交换一名其他角色的手牌", (card, player, target) => {
					return target != player && target.countCards("h");
				})
				.set("ai", target => {
					return get.event("cards").length - target.countCards("h") - 0.5;
				})
				.set("cards", cards)
				.forResult();
		},
		async content(event, trigger, player) {
			const cards = trigger.cards,
				target = event.targets[0];
			await target.loseToDiscardpile(target.getCards("h"));
			await target.gain(cards, "gain2").set("giver", player);
			if (player.isDamaged()) {
				const bool = await target
					.chooseBool("是否令" + get.translation(player) + "回复1点体力？")
					.set("choice", get.recoverEffect(player, target, target) > 0)
					.forResult("bool");
				if (bool) {
					target.line(player);
					await player.recover();
				}
			}
		},
	},
	//文鸯
	stdquedi: {
		audio: "dbquedi",
		enable: "chooseToUse",
		filterCard: { name: "sha" },
		position: "hes",
		viewAs: { name: "juedou" },
		viewAsFilter(player) {
			if (!player.countCards("hes", { name: "sha" })) return false;
		},
		check(card) {
			return 6 - get.value(card);
		},
	},
	//邓芝
	//只因盟
	stdzhiyinmeng: {
		audio: "weimeng",
		trigger: { player: "phaseZhunbeiBegin" },
		filter(event, player) {
			return player.countCards("he");
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseCardTarget({
					prompt: get.prompt2("stdzhiyinmeng"),
					filterTarget: lib.filter.notMe,
					filterCard: true,
					position: "he",
					selectCard: [1, Infinity],
					complexCard: true,
					complexTarget: true,
					complexSelect: true,
					ai1(card) {
						if (ui.selected.cards.length && card.name != "du") return 0;
						if (card.name == "du") return 114514;
						return 5 - get.value(card);
					},
					ai2(target) {
						if (!ui.selected.cards.length) return 0;
						const player = get.event("player"),
							att = get.attitude(player, target);
						if (ui.selected.cards[0].name == "du") {
							if (!target.hasSkillTag("nodu")) return -att;
							return -0.00001 * att;
						}
						return att;
					},
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			await player.give(event.cards, target);
			await target.chooseToGive("he", [1, Infinity], player);
		},
	},
	stdhehe: {
		audio: "jianliang",
		trigger: { player: "phaseDrawEnd" },
		filter(event, player) {
			return game.hasPlayer(target => {
				return target != player && target.countCards("h") == player.countCards("h");
			});
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(
					get.prompt2("stdhehe"),
					(card, player, target) => {
						return target != player && target.countCards("h") == player.countCards("h");
					},
					[1, 2]
				)
				.set("ai", target => {
					const player = get.event("player");
					return get.effect(target, { name: "draw" }, player, player);
				})
				.forResult();
		},
		locked: true,
		async content(event, trigger, player) {
			await game.asyncDraw(event.targets);
			await game.asyncDelayx();
		},
	},
	//张翼
	stdzhiyi: {
		audio: "zhiyi",
		trigger: { global: "phaseEnd" },
		filter(event, player) {
			return player.getHistory("useCard", evt => {
				return evt.card.name == "sha";
			}).length;
		},
		forced: true,
		async content(event, trigger, player) {
			const result = await player.chooseUseTarget("执义：视为使用【杀】，或摸一张牌", { name: "sha" }, false).forResult();
			if (!result.bool) await player.draw();
		},
	},
	//大魏汉尼拔
	stdshefu: {
		audio: "shefu",
		trigger: { player: "phaseJieshuBegin" },
		filter(event, player) {
			return player.countCards("h");
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseCard(get.prompt("stdshefu"), "将一张手牌置于武将牌上", "h")
				.set("ai", card => {
					return (
						(lib.card.list
							.slice()
							.map(list => list[2])
							.filter(name => {
								return card.name == name;
							}).length -
							1) /
						(get.value(card) || 0.5)
					);
				})
				.forResult();
		},
		content() {
			player.addToExpansion(event.cards, player, "giveAuto").gaintag.add("stdshefu");
		},
		marktext: "伏",
		intro: {
			markcount: "expansion",
			mark(dialog, _, player) {
				const cards = player.getExpansions("stdshefu");
				if (player.isUnderControl(true) && cards.length) dialog.addAuto(cards);
				else return "共有" + get.cnNumber(cards.length) + "张“伏兵”";
			},
		},
		onremove(player, skill) {
			const cards = player.getExpansions(skill);
			if (cards.length) player.loseToDiscardpile(cards);
		},
		group: "stdshefu_effect",
		subSkill: {
			effect: {
				audio: "shefu",
				trigger: { global: "useCard" },
				filter(event, player) {
					return player.getExpansions("stdshefu").some(card => card.name == event.card.name);
				},
				async cost(event, trigger, player) {
					let result = await player
						.chooseButton(["###" + get.prompt("stdshefu") + "###弃置一张同名牌，令此牌无效", player.getExpansions("stdshefu")])
						.set("filterButton", button => {
							return button.link.name == get.event().getTrigger().card.name;
						})
						.set("ai", button => {
							return get.event("goon") ? 1 : 0;
						})
						.set("goon", lib.skill.sbkanpo.subSkill.kanpo.check(trigger, player))
						.forResult();
					if (result.bool && result.links) {
						result.cards = result.links.slice();
						delete result.links;
					}
					event.result = result;
				},
				async content(event, trigger, player) {
					await player.loseToDiscardpile(event.cards);
					trigger.targets.length = 0;
					trigger.all_excluded = true;
				},
			},
		},
	},
	stdyibing: {
		audio: "benyu",
		trigger: { global: "dying" },
		filter(event, player) {
			return event.player != player && event.player.countCards("h");
		},
		direct: true,
		content() {
			const target = trigger.player;
			player.gainPlayerCard(target, "h", true).set("prompt", get.prompt("stdyibing", target)).logSkill = ["stdyibing", target];
		},
	},
	//樊玉凤
	stdbazhan: {
		audio: "bazhan",
		enable: "phaseUse",
		filter(event, player) {
			return player.countCards("h") > 0;
		},
		filterCard: true,
		position: "h",
		filterTarget(card, player, target) {
			return target != player && target.hasSex("male");
		},
		discard: false,
		lose: false,
		delay: false,
		usable: 1,
		check(card) {
			if (card.name == "du") return 114514;
			return 5 - get.value(card);
		},
		async content(event, trigger, player) {
			const target = event.target;
			await player.give(event.cards, target, "visible");
			await target
				.chooseToGive(
					player,
					(card, player) => {
						return get.type2(card) != get.type2(get.event("cards")[0]);
					},
					"he"
				)
				.set("cards", event.cards);
		},
		ai: {
			order: 10,
			result: {
				target(player, target) {
					if (!ui.selected.cards.length) return 0;
					const cardxx = ui.selected.cards[0];
					if (cardxx.name == "du") return -100;
					if (!player.hasSkill("stdzhanying")) return 1;
					if (target.countMark("stdzhanying_count") == target.countCards("h") + 1) {
						const cards = player.getCards("hs", card => {
							return card != cardxx && get.tag(card, "damage") && player.canUse(card, target) && get.effect(target, card, player, player) > 0;
						});
						if (!cards.length) return 1;
						let cardx = cards.filter(card => get.name(card) == "sha");
						cardx.sort((a, b) => get.effect(target, b, player, player) - get.effect(target, a, player, player));
						cardx = cardx.slice(Math.min(cardx.length, player.getCardUsable("sha")), cardx.length);
						cards.removeArray(cardx);
						return -cards.reduce((sum, card) => sum + get.effect(target, card, player, player), 0);
					}
					return 1;
				},
			},
		},
	},
	stdzhanying: {
		audio: "jiaoying",
		trigger: { global: "damageBegin2" },
		filter(event, player) {
			if (_status.currentPhase !== player) return false;
			return event.player.countCards("h") > event.player.countMark("stdzhanying_count");
		},
		forced: true,
		logTarget: "player",
		content() {
			trigger.increase("num");
		},
		global: "stdzhanying_mark",
		subSkill: {
			count: {
				charlotte: true,
				onremove: true,
				intro: {
					markcount: storage => (storage || 0).toString(),
					content: "本回合开始时手牌数为#张",
				},
			},
			mark: {
				charlotte: true,
				trigger: { global: "phaseBegin" },
				filter(event, player) {
					return event.player.hasSkill("stdzhanying", null, null, false);
				},
				forced: true,
				popup: false,
				firstDo: true,
				content() {
					player.addTempSkill("stdzhanying_count");
					player.addMark("stdzhanying_count", player.countCards("h"), false);
				},
				mod: {
					cardEnabled(card, player) {
						if (!_status.currentPhase || !_status.currentPhase.hasSkill("stdzhanying")) return;
						if (get.color(card) == "red" && player.countMark("stdzhanying_count") < player.countCards("h")) return false;
					},
					cardSavable(card, player) {
						if (!_status.currentPhase || !_status.currentPhase.hasSkill("stdzhanying")) return;
						if (get.color(card) == "red" && player.countMark("stdzhanying_count") < player.countCards("h")) return false;
					},
				},
			},
		},
	},
	//F1
	stdtiaohe: {
		audio: "fyjianyu",
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return game.hasPlayer(tar1 => {
				return tar1.countDiscardableCards(player, "e", i => get.subtype(i) == "equip2") && game.hasPlayer(tar2 => {
					return tar1 !== tar2 && tar2.countDiscardableCards(player, "e");
				});
			});
			let e = 0, fj = false;
			game.countPlayer(target => {
				let es = target.getDiscardableCards(player, "e"), js = target.getDiscardableCards(player, "j", i => get.type(i) == "equip");
				if (es.length) e++;
				e += js.length;
				if (!fj && (es.some(card => get.subtype(card) == "equip2") || js.some(card => get.subtype(card) == "equip2"))) fj = true;
			});
			return fj && e >= 2;
		},
		filterTarget(card, player, target) {
			if (!ui.selected.targets.length || ui.selected.targets[0].countDiscardableCards(player, "e", i => get.subtype(i) == "equip2")) {
				return target.countDiscardableCards(player, "e");
			}
			return target.countDiscardableCards(player, "e", i => get.subtype(i) == "equip2");
			let e = 0;
			let es = target.getDiscardableCards(player, "e"), js = target.getDiscardableCards(player, "j", i => get.type(i) == "equip");
			if (es.length) e++;
			e += js.length;
			if (!e) return false;
			if (!ui.selected.targets.length) return true;
			if (!ui.selected.targets[0].countDiscardableCards(player, "ej", i => get.subtype(i) == "equip2")) {
				return es.some(card => get.subtype(card) == "equip2") || js.some(card => get.subtype(card) == "equip2");
			}
			return true;
		},
		selectTarget: function() {
			return 2;
			if (!ui.selected.targets.length) return [1, 2];
			let e = 0, player = get.event("player"), target = ui.selected.targets[0];
			let es = target.getDiscardableCards(player, "e"), js = target.getDiscardableCards(player, "j", i => get.type(i) == "equip");
			if (es.length) e++;
			e += js.length;
			if (e >= 2 && (es.some(card => get.subtype(card) == "equip2") || js.some(card => get.subtype(card) == "equip2"))) return [1, 2];
			return 2;
		},
		complexTarget: true,
		multitarget: true,
		multiline: true,
		async content(event, trigger, player) {
			const targets = event.targets.slice();
			if (targets.length == 1) {
				await player.discardPlayerCard("ej", targets[0], true, 2).set("filterButton", button => {
					let position = get.position(button.link), subtype = get.subtype(button.link);
					if (!subtype || !subtype.startsWith("equip")) return false;
					if (ui.selected.buttons.length) {
						let pos = get.position(ui.selected.buttons[0].link), sub = get.subtype(ui.selected.buttons[0].link);
						if (pos == "e" && position == "e") return false;
						if (sub == "equip2") return true;
						return subtype == "equip2";
					}
					if (position == "e") {
						if (!get.event("js").some(i => get.subtype(i) == "equip2")) return subtype == "equip2";
						return true;
					}
					if (!get.event("es").length) return subtype == "equip2";
					return true;
				}).set("es", targets[0].getDiscardableCards(player, "e", i => get.subtype(i) == "equip2")).set("js", targets[0].getDiscardableCards(player, "j", i => get.type(i) == "equip"));
				return;
			}
			let canfj = targets.filter(target => {
				return target.countDiscardableCards(player, "e", i => get.subtype(i) == "equip2");
			});
			for (let i = 0; i < 2; i++) {
				if (i && canfj.includes(targets[i]) && !targets[i].countDiscardableCards(player, "e", i => get.subtype(i) == "equip2")) break;
				const result = await player
					.discardPlayerCard("e", targets[i], true)
					.set("filterButton", button => {
						if (get.event("fj")) return get.subtype(button.link) == "equip2";
						return true;
						return get.type(button.link) == "equip";
					})
					.set("fj", canfj.length === 1 && canfj.includes(targets[i]))
					.forResult();
				if (result.bool && get.subtype(result.cards[0]) == "equip2") {
					canfj = [];
				}
			}
		},
		ai: {
			order: 10,
			result: {
				target(player, target) {
					let att = get.attitude(player, target), es = [];
					target.countDiscardableCards(player, "e").forEach(i => {
						es.push(get.value(i, target));
					});
					let min = Math.min(...es), max = Math.max(...es), ext = target.hasSkillTag("noe") ? 10 : 0;
					if (att <= 0) return ext - max;
					return ext - min;
				}
			},
		},
	},
	stdqiansu: {
		audio: "shengxi_feiyi",
		trigger: { target: "useCardToTargeted" },
		filter(event, player) {
			return get.type2(event.card) == "trick" && !player.countCards("e");
		},
		frequent: true,
		content() {
			player.draw();
		},
		ai: {
			noe: true,
			effect: {
				target(card, player, target) {
					if (target.countCards("e")) return;
					if (target == player && get.type(card) == "equip" && get.equipValue(card) < 5) return 0;
					if (get.type2(card) == "trick") return [1, 2];
				},
			},
		},
	},
	//标准版甘夫人
	stdshushen: {
		audio: "shushen",
		trigger: { player: "recoverEnd" },
		getIndex(event) {
			return event.num || 1;
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt2("stdshushen"), lib.filter.notMe)
				.set("ai", target => get.attitude(_status.event.player, target))
				.forResult();
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			await target.draw(target.countCards("h") > 0 ? 1 : 2);
		},
		ai: { threaten: 0.8, expose: 0.1 },
	},
	stdkuangfu: {
		audio: "xinkuangfu",
		trigger: { source: "damageSource" },
		forced: true,
		usable: 1,
		filter(event, player) {
			return player.isPhaseUsing() && event.card && event.card.name == "sha" && event.player != player && event.player.isIn();
		},
		async content(event, trigger, player) {
			if (trigger.player.hp < player.hp) player.draw(2);
			else player.loseHp();
		},
		ai: {
			halfneg: true,
		},
	},
	rewangzun: {
		trigger: { global: "phaseZhunbeiBegin" },
		forced: true,
		audio: "wangzun",
		filter(event, player) {
			return event.player.hp > player.hp;
		},
		logTarget: "player",
		async content(event, trigger, player) {
			player.draw();
			let zhu = false;
			const target = trigger.player;
			switch (get.mode()) {
				case "identity": {
					zhu = target.isZhu;
					break;
				}
				case "guozhan": {
					zhu = get.is.jun(target);
					break;
				}
				case "versus": {
					zhu = target.identity == "zhu";
					break;
				}
				case "doudizhu": {
					zhu = target == game.zhu;
					break;
				}
			}
			if (zhu) {
				player.draw();
				target.addTempSkill("rewangzun2");
				target.addMark("rewangzun2", 1, false);
			}
		},
	},
	rewangzun2: {
		onremove: true,
		mod: {
			maxHandcard(player, num) {
				return num - player.countMark("rewangzun2");
			},
		},
		intro: { content: "手牌上限-#" },
	},
	retongji: {
		trigger: { global: "useCardToTarget" },
		logTarget: "target",
		audio: "tongji",
		filter(event, player) {
			return event.card.name == "sha" && event.player != player && !event.targets.includes(player) && event.target.inRange(player) && event.target.countCards("he") > 0;
		},
		async cost(event, trigger, player) {
			const { result } = await trigger.target
				.chooseCard("he", "是否对" + get.translation(player) + "发动【同疾】？", "弃置一张牌，将" + get.translation(trigger.card) + "转移给" + get.translation(player), lib.filter.cardDiscardable)
				.set("ai", card => {
					if (!_status.event.check) return -1;
					return get.unuseful(card) + 9;
				})
				.set(
					"check",
					(() => {
						if (trigger.target.countCards("h", "shan")) {
							return -get.attitude(trigger.target, player);
						}
						if (get.attitude(trigger.target, player) < 5) {
							return 6 - get.attitude(trigger.target, player);
						}
						if (trigger.target.hp == 1 && player.countCards("h", "shan") == 0) {
							return 10 - get.attitude(trigger.target, player);
						}
						if (trigger.target.hp == 2 && player.countCards("h", "shan") == 0) {
							return 8 - get.attitude(trigger.target, player);
						}
						return -1;
					})() > 0
				);
			if (result.bool) {
				event.result = {
					bool: true,
					cost_data: {
						cards: result.cards,
					},
				};
			}
		},
		async content(event, trigger, player) {
			trigger.target.discard(event.cost_data.cards);
			const evt = trigger.getParent();
			evt.triggeredTargets2.remove(trigger.target);
			evt.targets.remove(trigger.target);
			evt.targets.push(player);
		},
		ai: {
			neg: true,
		},
	},
	hujia: {
		audio: 2,
		audioname: ["re_caocao"],
		unique: true,
		zhuSkill: true,
		trigger: { player: ["chooseToRespondBefore", "chooseToUseBefore"] },
		filter(event, player) {
			if (event.responded) return false;
			if (player.storage.hujiaing) return false;
			if (!player.hasZhuSkill("hujia")) return false;
			if (!event.filterCard({ name: "shan", isCard: true }, player, event)) return false;
			return game.hasPlayer(current => current != player && current.group == "wei");
		},
		check(event, player) {
			if (get.damageEffect(player, event.player, player) >= 0) return false;
			return true;
		},
		async content(event, trigger, player) {
			while (true) {
				let bool;
				if (!event.current) event.current = player.next;
				if (event.current == player) return;
				else if (event.current.group == "wei") {
					if ((event.current == game.me && !_status.auto) || get.attitude(event.current, player) > 2 || event.current.isOnline()) {
						player.storage.hujiaing = true;
						const next = event.current.chooseToRespond("是否替" + get.translation(player) + "打出一张闪？", { name: "shan" });
						next.set("ai", () => {
							const event = _status.event;
							return get.attitude(event.player, event.source) - 2;
						});
						next.set("skillwarn", "替" + get.translation(player) + "打出一张闪");
						next.autochoose = lib.filter.autoRespondShan;
						next.set("source", player);
						bool = (await next).result.bool;
					}
				}
				player.storage.hujiaing = false;
				if (bool) {
					trigger.result = { bool: true, card: { name: "shan", isCard: true } };
					trigger.responded = true;
					trigger.animate = false;
					if (typeof event.current.ai.shown == "number" && event.current.ai.shown < 0.95) {
						event.current.ai.shown += 0.3;
						if (event.current.ai.shown > 0.95) event.current.ai.shown = 0.95;
					}
					return;
				} else {
					event.current = event.current.next;
				}
			}
		},
		ai: {
			respondShan: true,
			skillTagFilter(player) {
				if (player.storage.hujiaing) return false;
				if (!player.hasZhuSkill("hujia")) return false;
				return game.hasPlayer(current => current != player && current.group == "wei");
			},
		},
	},
	jianxiong: {
		audio: 2,
		preHidden: true,
		trigger: { player: "damageEnd" },
		filter(event, player) {
			return get.itemtype(event.cards) == "cards" && get.position(event.cards[0], true) == "o";
		},
		async content(event, trigger, player) {
			player.gain(trigger.cards, "gain2");
		},
		ai: {
			maixie: true,
			maixie_hp: true,
			effect: {
				target(card, player, target) {
					if (player.hasSkillTag("jueqing", false, target)) return [1, -1];
					if (get.tag(card, "damage")) return [1, 0.55];
				},
			},
		},
	},
	fankui: {
		audio: 2,
		trigger: { player: "damageEnd" },
		logTarget: "source",
		preHidden: true,
		filter(event, player) {
			return event.source && event.source.countGainableCards(player, event.source != player ? "he" : "e") > 0 && event.num > 0;
		},
		async content(event, trigger, player) {
			player.gainPlayerCard(true, trigger.source, trigger.source != player ? "he" : "e");
		},
		ai: {
			maixie_defend: true,
			effect: {
				target(card, player, target) {
					if (player.countCards("he") > 1 && get.tag(card, "damage")) {
						if (player.hasSkillTag("jueqing", false, target)) return [1, -1.5];
						if (get.attitude(target, player) < 0) return [1, 1];
					}
				},
			},
		},
	},
	guicai: {
		audio: 2,
		audioname2: {
			xin_simayi: "jilue_guicai",
		},
		trigger: { global: "judge" },
		preHidden: true,
		filter(event, player) {
			return player.countCards(get.mode() == "guozhan" ? "hes" : "hs") > 0;
		},
		async cost(event, trigger, player) {
			const {
				result: { bool, cards },
			} = await player
				.chooseCard(get.translation(trigger.player) + "的" + (trigger.judgestr || "") + "判定为" + get.translation(trigger.player.judging[0]) + "，" + get.prompt("guicai"), get.mode() == "guozhan" ? "hes" : "hs", card => {
					const player = _status.event.player;
					const mod2 = game.checkMod(card, player, "unchanged", "cardEnabled2", player);
					if (mod2 != "unchanged") return mod2;
					const mod = game.checkMod(card, player, "unchanged", "cardRespondable", player);
					if (mod != "unchanged") return mod;
					return true;
				})
				.set("ai", card => {
					const trigger = _status.event.getTrigger();
					const player = _status.event.player;
					const judging = _status.event.judging;
					const result = trigger.judge(card) - trigger.judge(judging);
					const attitude = get.attitude(player, trigger.player);
					if (attitude == 0 || result == 0) return 0;
					if (attitude > 0) {
						return result - get.value(card) / 2;
					} else {
						return -result - get.value(card) / 2;
					}
				})
				.set("judging", trigger.player.judging[0])
				.setHiddenSkill("guicai");
			if (bool) event.result = { bool, cost_data: { cards } };
		},
		//技能的logSkill跟着打出牌走 不进行logSkill
		popup: false,
		async content(event, trigger, player) {
			const chooseCardResultCards = event.cost_data.cards;
			player.respond(chooseCardResultCards, "guicai", "highlight", "noOrdering");
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
			trigger.player.judging[0] = chooseCardResultCards[0];
			trigger.orderingCards.addArray(chooseCardResultCards);
			game.log(trigger.player, "的判定牌改为", chooseCardResultCards[0]);
			game.asyncDelay(2);
		},
		ai: {
			rejudge: true,
			tag: {
				rejudge: 1,
			},
		},
	},
	ganglie: {
		audio: 2,
		trigger: { player: "damageEnd" },
		filter(event, player) {
			return event.source != undefined;
		},
		check(event, player) {
			return get.attitude(player, event.source) <= 0;
		},
		logTarget: "source",
		async content(event, trigger, player) {
			const judgeEvent = player.judge(card => {
				if (get.suit(card) == "heart") return -2;
				return 2;
			});
			judgeEvent.judge2 = result => result.bool;
			const {
				result: { judge },
			} = await judgeEvent;
			if (judge < 2) return;
			const {
				result: { bool },
			} = await trigger.source.chooseToDiscard(2).set("ai", card => {
				if (card.name == "tao") return -10;
				if (card.name == "jiu" && _status.event.player.hp == 1) return -10;
				return get.unuseful(card) + 2.5 * (5 - get.owner(card).hp);
			});
			if (bool == false) {
				trigger.source.damage();
			}
		},
		ai: {
			maixie_defend: true,
			effect: {
				target(card, player, target) {
					if (player.hasSkillTag("jueqing", false, target)) return [1, -1];
					return 0.8;
					// if(get.tag(card,'damage')&&get.damageEffect(target,player,player)>0) return [1,0,0,-1.5];
				},
			},
		},
	},
	ganglie_three: {
		audio: "ganglie",
		trigger: { player: "damageEnd" },
		async cost(event, trigger, player) {
			const { result } = await player
				.chooseTarget(get.prompt2("ganglie_three"), (card, player, target) => {
					return target.isEnemyOf(player);
				})
				.set("ai", target => {
					return -get.attitude(_status.event.player, target) / Math.sqrt(1 + target.countCards("h"));
				});
			event.result = result;
		},
		async content(event, trigger, player) {
			event.target = event.targets[0];
			player.logSkill("ganglie_three", event.target);
			const judgeEvent = player.judge(card => {
				if (get.suit(card) == "heart") return -2;
				return 2;
			});
			judgeEvent.judge2 = result => result.bool;
			const {
				result: { judge },
			} = await judgeEvent;
			if (judge < 2) return;
			const {
				result: { bool: chooseToDiscardResultBool },
			} = await event.target.chooseToDiscard(2).set("ai", card => {
				if (card.name == "tao") return -10;
				if (card.name == "jiu" && _status.event.player.hp == 1) return -10;
				return get.unuseful(card) + 2.5 * (5 - get.owner(card).hp);
			});
			if (chooseToDiscardResultBool === false) {
				event.target.damage();
			}
		},
		ai: {
			maixie_defend: true,
			effect: {
				target(card, player, target) {
					if (player.hasSkillTag("jueqing", false, target)) return [1, -1];
					return 0.8;
					// if(get.tag(card,'damage')&&get.damageEffect(target,player,player)>0) return [1,0,0,-1.5];
				},
			},
		},
	},
	tuxi: {
		audio: 2,
		trigger: { player: "phaseDrawBegin1" },
		filter(event, player) {
			return !event.numFixed;
		},
		async cost(event, trigger, player) {
			let num = game.countPlayer(current => current != player && current.countCards("h") > 0 && get.attitude(player, current) <= 0);
			let check = num >= 2;
			const { result } = await player
				.chooseTarget(
					get.prompt("tuxi"),
					"获得其他一至两名角色的各一张手牌",
					[1, 2],
					(card, player, target) => {
						return target.countCards("h") > 0 && player != target;
					},
					target => {
						if (!_status.event.aicheck) return 0;
						const att = get.attitude(_status.event.player, target);
						if (target.hasSkill("tuntian")) return att / 10;
						return 1 - att;
					}
				)
				.set("aicheck", check);
			event.result = result;
		},
		async content(event, trigger, player) {
			player.gainMultiple(event.targets);
			trigger.changeToZero();
			game.asyncDelay();
		},
		ai: {
			threaten: 2,
			expose: 0.3,
		},
	},
	luoyi: {
		audio: 2,
		trigger: { player: "phaseDrawBegin2" },
		check(event, player) {
			if (player.skipList.includes("phaseUse") || player.countCards("h") < 3) return false;
			if (!player.hasSha()) return false;
			return game.hasPlayer(current => get.attitude(player, current) < 0 && player.canUse("sha", current));
		},
		preHidden: true,
		filter(event, player) {
			return !event.numFixed && event.num > 0;
		},
		async content(event, trigger, player) {
			player.addTempSkill("luoyi2", "phaseJieshuBegin");
			trigger.num--;
		},
	},
	luoyi2: {
		trigger: { source: "damageBegin1" },
		filter(event) {
			return event.card && (event.card.name == "sha" || event.card.name == "juedou") && event.notLink();
		},
		forced: true,
		async content(event, trigger, player) {
			trigger.num++;
		},
		ai: {
			damageBonus: true,
		},
	},
	tiandu: {
		audio: 2,
		audioname: ["re_guojia", "xizhicai", "gz_nagisa"],
		trigger: { player: "judgeEnd" },
		preHidden: true,
		frequent(event) {
			//if(get.mode()=='guozhan') return false;
			return event.result.card.name !== "du";
		},
		check(event) {
			return event.result.card.name !== "du";
		},
		filter(event, player) {
			return get.position(event.result.card, true) == "o";
		},
		async content(event, trigger, player) {
			player.gain(trigger.result.card, "gain2");
		},
	},
	yiji: {
		audio: 2,
		trigger: { player: "damageEnd" },
		frequent: true,
		filter(event) {
			return event.num > 0;
		},
		getIndex(event, player, triggername) {
			return event.num;
		},
		async content(event, trigger, player) {
			const { cards } = await game.cardsGotoOrdering(get.cards(2));
			if (_status.connectMode)
				game.broadcastAll(function () {
					_status.noclearcountdown = true;
				});
			event.given_map = {};
			if (!cards.length) return;
			// event.goto -> do while
			do {
				const {
					result: { bool, links },
				} =
					cards.length == 1
						? { result: { links: cards.slice(0), bool: true } }
						: await player.chooseCardButton("遗计：请选择要分配的牌", true, cards, [1, cards.length]).set("ai", () => {
								if (ui.selected.buttons.length == 0) return 1;
								return 0;
						  });
				if (!bool) return;
				cards.removeArray(links);
				event.togive = links.slice(0);
				const {
					result: { targets },
				} = await player
					.chooseTarget("选择一名角色获得" + get.translation(links), true)
					.set("ai", target => {
						const att = get.attitude(_status.event.player, target);
						if (_status.event.enemy) {
							return -att;
						} else if (att > 0) {
							return att / (1 + target.countCards("h"));
						} else {
							return att / 100;
						}
					})
					.set("enemy", get.value(event.togive[0], player, "raw") < 0);
				if (targets.length) {
					const id = targets[0].playerid,
						map = event.given_map;
					if (!map[id]) map[id] = [];
					map[id].addArray(event.togive);
				}
			} while (cards.length > 0);
			if (_status.connectMode) {
				game.broadcastAll(function () {
					delete _status.noclearcountdown;
					game.stopCountChoose();
				});
			}
			const list = [];
			for (const i in event.given_map) {
				const source = (_status.connectMode ? lib.playerOL : game.playerMap)[i];
				player.line(source, "green");
				if (player !== source && (get.mode() !== "identity" || player.identity !== "nei")) player.addExpose(0.2);
				list.push([source, event.given_map[i]]);
			}
			game.loseAsync({
				gain_list: list,
				giver: player,
				animate: "draw",
			}).setContent("gaincardMultiple");
		},
		ai: {
			maixie: true,
			maixie_hp: true,
			effect: {
				target(card, player, target) {
					if (get.tag(card, "damage")) {
						if (player.hasSkillTag("jueqing", false, target)) return [1, -2];
						if (!target.hasFriend()) return;
						let num = 1;
						if (get.attitude(player, target) > 0) {
							if (player.needsToDiscard()) num = 0.7;
							else num = 0.5;
						}
						if (target.hp >= 4) return [1, num * 2];
						if (target.hp == 3) return [1, num * 1.5];
						if (target.hp == 2) return [1, num * 0.5];
					}
				},
			},
		},
	},
	luoshen: {
		audio: 2,
		trigger: { player: "phaseZhunbeiBegin" },
		frequent: true,
		preHidden: true,
		async content(event, trigger, player) {
			while (true) {
				if (event.cards == undefined) event.cards = [];
				const judgeEvent = player.judge(card => {
					if (get.color(card) == "black") return 1.5;
					return -1.5;
				});
				judgeEvent.judge2 = result => result.bool;
				if (get.mode() != "guozhan" && !player.hasSkillTag("rejudge"))
					judgeEvent.set("callback", async event => {
						if (event.judgeResult.color == "black" && get.position(event.card, true) == "o") await player.gain(event.card, "gain2");
					});
				else
					judgeEvent.set("callback", async event => {
						if (event.judgeResult.color == "black") event.getParent().orderingCards.remove(event.card);
					});
				const {
					result: { judge, card },
				} = await judgeEvent;
				let bool;
				if (judge > 0) {
					event.cards.push(card);
					bool = (await player.chooseBool("是否再次发动【洛神】？").set("frequentSkill", "luoshen")).result.bool;
				} else {
					for (let i = 0; i < event.cards.length; i++) {
						if (get.position(event.cards[i], true) != "o") {
							event.cards.splice(i, 1);
							i--;
						}
					}
					if (event.cards.length) {
						player.gain(event.cards, "gain2");
					}
					return;
				}
				if (!bool) {
					if (event.cards.length) {
						player.gain(event.cards, "gain2");
					}
					return;
				}
			}
		},
	},
	xinluoshen: {
		audio: "luoshen",
		// alter:true,
		trigger: { player: "phaseZhunbeiBegin" },
		frequent: true,
		async content(event, trigger, player) {
			while (true) {
				if (event.cards == undefined) event.cards = [];
				const judgeEvent = player.judge(card => {
					if (get.color(card) == "black") return 1.5;
					return -1.5;
				}, ui.special);
				judgeEvent.judge2 = result => result.bool;
				const {
					result: { judge, card },
				} = await judgeEvent;
				let bool;
				if (judge > 0) {
					event.cards.push(card);
					bool = lib.config.autoskilllist.includes("luoshen") ? (await player.chooseBool("是否再次发动【洛神】？")).result.bool : true;
				} else {
					for (let i = 0; i < event.cards.length; i++) {
						if (get.position(event.cards[i]) != "s") {
							event.cards.splice(i, 1);
							i--;
						}
					}
					player.gain(event.cards, "gain2");
					player.storage.xinluoshen = event.cards.slice(0);
					return;
				}
				if (!bool) {
					if (event.cards.length) {
						player.gain(event.cards, "gain2");
						player.storage.xinluoshen = event.cards.slice(0);
						return;
					}
				}
			}
		},
		mod: {
			ignoredHandcard(card, player) {
				if (get.is.altered("xinluoshen") && player.storage.xinluoshen && player.storage.xinluoshen.includes(card)) {
					return true;
				}
			},
		},
		group: "xinluoshen_clear",
		subSkill: {
			clear: {
				trigger: { player: "phaseAfter" },
				silent: true,
				async content(event, trigger, player) {
					delete player.storage.xinluoshen;
				},
			},
		},
	},
	qingguo: {
		mod: {
			aiValue(player, card, num) {
				if (get.name(card) != "shan" && get.color(card) != "black") return;
				const cards = player.getCards("hs", card => get.name(card) == "shan" || get.color(card) == "black");
				cards.sort((a, b) => {
					return (get.name(b) == "shan" ? 1 : 2) - (get.name(a) == "shan" ? 1 : 2);
				});
				const geti = () => {
					if (cards.includes(card)) cards.indexOf(card);
					return cards.length;
				};
				if (get.name(card) == "shan") return Math.min(num, [6, 4, 3][Math.min(geti(), 2)]) * 0.6;
				return Math.max(num, [6.5, 4, 3][Math.min(geti(), 2)]);
			},
			aiUseful() {
				return lib.skill.qingguo.mod.aiValue.apply(this, arguments);
			},
		},
		locked: false,
		audio: 2,
		audioname: ["sb_zhenji"],
		enable: ["chooseToRespond", "chooseToUse"],
		filterCard(card) {
			return get.color(card) == "black";
		},
		viewAs: { name: "shan" },
		viewAsFilter(player) {
			if (!player.countCards("hs", { color: "black" })) return false;
		},
		position: "hs",
		prompt: "将一张黑色手牌当闪使用或打出",
		check() {
			return 1;
		},
		ai: {
			order: 3,
			respondShan: true,
			skillTagFilter(player) {
				if (!player.countCards("hs", { color: "black" })) return false;
			},
			effect: {
				target(card, player, target, current) {
					if (get.tag(card, "respondShan") && current < 0) return 0.6;
				},
			},
		},
	},
	rende: {
		audio: 2,
		enable: "phaseUse",
		filterCard: true,
		selectCard: [1, Infinity],
		discard: false,
		lose: false,
		delay: 0,
		filterTarget(card, player, target) {
			return player != target;
		},
		check(card) {
			if (ui.selected.cards.length > 1) return 0;
			if (ui.selected.cards.length && ui.selected.cards[0].name == "du") return 0;
			if (!ui.selected.cards.length && card.name == "du") return 20;
			const player = get.owner(card);
			let num = 0;
			const evt2 = _status.event.getParent();
			player.getHistory("lose", evt => {
				if (evt.getParent().skill == "rende" && evt.getParent(3) == evt2) num += evt.cards.length;
			});
			if (player.hp == player.maxHp || num > 1 || player.countCards("h") <= 1) {
				if (ui.selected.cards.length) {
					return -1;
				}
				const players = game.filterPlayer();
				for (let i = 0; i < players.length; i++) {
					if (players[i].hasSkill("haoshi") && !players[i].isTurnedOver() && !players[i].hasJudge("lebu") && get.attitude(player, players[i]) >= 3 && get.attitude(players[i], player) >= 3) {
						return 11 - get.value(card);
					}
				}
				if (player.countCards("h") > player.hp) return 10 - get.value(card);
				if (player.countCards("h") > 2) return 6 - get.value(card);
				return -1;
			}
			return 10 - get.value(card);
		},
		async content(event, trigger, player) {
			const evt2 = event.getParent(3);
			let num = 0;
			player.getHistory("lose", evt => {
				if (evt.getParent(2).name == "rende" && evt.getParent(5) == evt2) num += evt.cards.length;
			});
			player.give(event.cards, event.target);
			if (num < 2 && num + event.cards.length > 1) player.recover();
		},
		ai: {
			order(skill, player) {
				if (player.hp < player.maxHp && player.storage.rende < 2 && player.countCards("h") > 1) {
					return 10;
				}
				return 1;
			},
			result: {
				target(player, target) {
					if (target.hasSkillTag("nogain")) return 0;
					if (ui.selected.cards.length && ui.selected.cards[0].name == "du") {
						return target.hasSkillTag("nodu") ? 0 : -10;
					}
					if (target.hasJudge("lebu")) return 0;
					const nh = target.countCards("h");
					const np = player.countCards("h");
					if (player.hp == player.maxHp || player.storage.rende < 0 || player.countCards("h") <= 1) {
						if (nh >= np - 1 && np <= player.hp && !target.hasSkill("haoshi")) return 0;
					}
					return Math.max(1, 5 - nh);
				},
			},
			effect: {
				target(card, player, target) {
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
	},
	rende1: {
		trigger: { player: "phaseUseBegin" },
		silent: true,
		async content(event, trigger, player) {
			player.storage.rende = 0;
		},
	},
	jijiang: {
		audio: "jijiang1",
		audioname: ["liushan", "re_liubei", "re_liushan", "ol_liushan"],
		unique: true,
		group: ["jijiang1"],
		zhuSkill: true,
		filter(event, player) {
			if (!player.hasZhuSkill("jijiang") || !game.hasPlayer(current => current != player && current.group == "shu")) return false;
			return !event.jijiang && (event.type != "phase" || !player.hasSkill("jijiang3"));
		},
		enable: ["chooseToUse", "chooseToRespond"],
		viewAs: { name: "sha" },
		filterCard() {
			return false;
		},
		selectCard: -1,
		ai: {
			order() {
				return get.order({ name: "sha" }) + 0.3;
			},
			respondSha: true,
			skillTagFilter(player) {
				if (!player.hasZhuSkill("jijiang") || !game.hasPlayer(current => current != player && current.group == "shu")) return false;
			},
		},
	},
	jijiang1: {
		audio: 2,
		audioname: ["liushan", "re_liubei", "re_liushan", "ol_liushan"],
		trigger: { player: ["useCardBegin", "respondBegin"] },
		logTarget: "targets",
		filter(event, player) {
			return event.skill == "jijiang";
		},
		forced: true,
		async content(event, trigger, player) {
			delete trigger.skill;
			trigger.getParent().set("jijiang", true);
			while (true) {
				if (event.current == undefined) event.current = player.next;
				if (event.current == player) {
					player.addTempSkill("jijiang3");
					trigger.cancel();
					trigger.getParent().goto(0);
					return;
				} else if (event.current.group == "shu") {
					const chooseToRespondEvent = event.current.chooseToRespond("是否替" + get.translation(player) + "打出一张杀？", { name: "sha" });
					chooseToRespondEvent.set("ai", () => {
						const event = _status.event;
						return get.attitude(event.player, event.source) - 2;
					});
					chooseToRespondEvent.set("source", player);
					chooseToRespondEvent.set("jijiang", true);
					chooseToRespondEvent.set("skillwarn", "替" + get.translation(player) + "打出一张杀");
					chooseToRespondEvent.noOrdering = true;
					chooseToRespondEvent.autochoose = lib.filter.autoRespondSha;
					const { bool, card, cards } = (await chooseToRespondEvent).result;
					if (bool) {
						trigger.card = card;
						trigger.cards = cards;
						trigger.throw = false;
						if (typeof event.current.ai.shown == "number" && event.current.ai.shown < 0.95) {
							event.current.ai.shown += 0.3;
							if (event.current.ai.shown > 0.95) event.current.ai.shown = 0.95;
						}
						return;
					} else event.current = event.current.next;
				} else event.current = event.current.next;
			}
		},
	},
	jijiang3: {
		trigger: { global: ["useCardAfter", "useSkillAfter", "phaseAfter"] },
		silent: true,
		charlotte: true,
		filter(event) {
			return event.skill != "jijiang" && event.skill != "qinwang";
		},
		async content(event, trigger, player) {
			player.removeSkill("jijiang3");
		},
	},
	wusheng: {
		audio: 2,
		audioname2: {
			old_guanzhang: "old_fuhun",
			old_guanyu: "wusheng_re_guanyu",
			guanzhang: "wusheng_guanzhang",
			guansuo: "wusheng_guansuo",
		},
		audioname: ["re_guanyu", "jsp_guanyu", "re_guanzhang", "dc_jsp_guanyu"],
		enable: ["chooseToRespond", "chooseToUse"],
		filterCard(card, player) {
			if (get.zhu(player, "shouyue")) return true;
			return get.color(card) == "red";
		},
		position: "hes",
		viewAs: { name: "sha" },
		viewAsFilter(player) {
			if (get.zhu(player, "shouyue")) {
				if (!player.countCards("hes")) return false;
			} else {
				if (!player.countCards("hes", { color: "red" })) return false;
			}
		},
		prompt: "将一张红色牌当杀使用或打出",
		check(card) {
			const val = get.value(card);
			if (_status.event.name == "chooseToRespond") return 1 / Math.max(0.1, val);
			return 5 - val;
		},
		ai: {
			skillTagFilter(player) {
				if (get.zhu(player, "shouyue")) {
					if (!player.countCards("hes")) return false;
				} else {
					if (!player.countCards("hes", { color: "red" })) return false;
				}
			},
			respondSha: true,
		},
	},
	wusheng_re_guanyu: { audio: 2 },
	zhongyi: {
		audio: 2,
		enable: "phaseUse",
		limited: true,
		skillAnimation: true,
		animationColor: "orange",
		filterCard: true,
		position: "he",
		filter(event, player) {
			return player.countCards("he") > 0;
		},
		discard: false,
		lose: false,
		async content(event, trigger, player) {
			player.awakenSkill("zhongyi");
			player.addTempSkill("zhongyi2", "roundStart");
			player.addToExpansion(player, "give", event.cards).gaintag.add("zhongyi2");
		},
	},
	zhongyi2: {
		trigger: { global: "damageBegin1" },
		forced: true,
		popup: false,
		logTarget: "source",
		filter(event, player) {
			return event.getParent().name == "sha" && event.source && event.source.isFriendOf(player);
		},
		async content(event, trigger, player) {
			trigger.num++;
		},
		intro: { content: "expansion", markcount: "expansion" },
		onremove(player, skill) {
			const cards = player.getExpansions(skill);
			if (cards.length) player.loseToDiscardpile(cards);
		},
	},
	paoxiao: {
		audio: 2,
		firstDo: true,
		audioname: ["re_zhangfei", "xiahouba"],
		audioname2: {
			old_guanzhang: "old_fuhun",
			dc_xiahouba: "paoxiao_xiahouba",
			guanzhang: "paoxiao_guanzhang",
		},
		trigger: { player: "useCard1" },
		forced: true,
		filter(event, player) {
			return !event.audioed && event.card.name == "sha" && player.countUsed("sha", true) > 1 && event.getParent().type == "phase";
		},
		async content(event, trigger, player) {
			trigger.audioed = true;
		},
		mod: {
			cardUsable(card, player, num) {
				if (card.name == "sha") return Infinity;
			},
		},
		ai: {
			unequip: true,
			skillTagFilter(player, tag, arg) {
				if (!get.zhu(player, "shouyue")) return false;
				if (arg && arg.name == "sha") return true;
				return false;
			},
		},
	},
	paoxiao_xiahouba: { audio: 2 },
	guanxing_fail: {},
	guanxing: {
		audio: 2,
		audioname: ["jiangwei", "re_jiangwei", "re_zhugeliang", "ol_jiangwei"],
		trigger: { player: "phaseZhunbeiBegin" },
		frequent: true,
		preHidden: true,
		async content(event, trigger, player) {
			const num = player.hasSkill("yizhi") && player.hasSkill("guanxing") ? 5 : Math.min(5, game.countPlayer());
			const cards = get.cards(num);
			game.cardsGotoOrdering(cards);
			const next = player.chooseToMove();
			next.set("list", [["牌堆顶", cards], ["牌堆底"]]);
			next.set("prompt", "观星：点击将牌移动到牌堆顶或牌堆底");
			next.processAI = list => {
				const cards = list[0][1],
					player = _status.event.player;
				const top = [];
				const judges = player.getCards("j");
				let stopped = false;
				if (!player.hasWuxie()) {
					for (let i = 0; i < judges.length; i++) {
						const judge = get.judge(judges[i]);
						cards.sort((a, b) => judge(b) - judge(a));
						if (judge(cards[0]) < 0) {
							stopped = true;
							break;
						} else {
							top.unshift(cards.shift());
						}
					}
				}
				let bottom;
				if (!stopped) {
					cards.sort((a, b) => get.value(b, player) - get.value(a, player));
					while (cards.length) {
						if (get.value(cards[0], player) <= 5) break;
						top.unshift(cards.shift());
					}
				}
				bottom = cards;
				return [top, bottom];
			};
			const {
				result: { moved },
			} = await next;
			const top = moved[0];
			const bottom = moved[1];
			top.reverse();
			game.cardsGotoPile(top.concat(bottom), ["top_cards", top], (event, card) => {
				if (event.top_cards.includes(card)) return ui.cardPile.firstChild;
				return null;
			});
			player.popup(get.cnNumber(top.length) + "上" + get.cnNumber(bottom.length) + "下");
			game.log(player, "将" + get.cnNumber(top.length) + "张牌置于牌堆顶");
			game.asyncDelayx();
		},
		ai: {
			threaten: 1.2,
		},
	},
	kongcheng: {
		mod: {
			targetEnabled(card, player, target, now) {
				if (target.countCards("h") == 0) {
					if (card.name == "sha" || card.name == "juedou") return false;
				}
			},
		},
		group: "kongcheng1",
		audio: "kongcheng1",
		audioname: ["re_zhugeliang"],
		ai: {
			noh: true,
			skillTagFilter(player, tag) {
				if (tag == "noh") {
					if (player.countCards("h") != 1) return false;
				}
			},
		},
	},
	kongcheng1: {
		audio: 2,
		trigger: { player: "loseEnd" },
		forced: true,
		firstDo: true,
		audioname: ["re_zhugeliang"],
		filter(event, player) {
			if (player.countCards("h")) return false;
			for (let i = 0; i < event.cards.length; i++) {
				if (event.cards[i].original == "h") return true;
			}
			return false;
		},
		async content() {},
	},
	longdan: {
		audio: "longdan_sha",
		audioname: ["re_zhaoyun"],
		group: ["longdan_sha", "longdan_shan", "longdan_draw"],
		subSkill: {
			draw: {
				trigger: { player: ["useCard", "respond"] },
				forced: true,
				popup: false,
				filter(event, player) {
					if (!get.zhu(player, "shouyue")) return false;
					return event.skill == "longdan_sha" || event.skill == "longdan_shan";
				},
				async content(event, trigger, player) {
					player.draw();
					player.storage.fanghun2++;
				},
			},
			sha: {
				audio: 2,
				audioname: ["re_zhaoyun"],
				enable: ["chooseToUse", "chooseToRespond"],
				filterCard: { name: "shan" },
				viewAs: { name: "sha" },
				viewAsFilter(player) {
					if (!player.countCards("hs", "shan")) return false;
				},
				position: "hs",
				prompt: "将一张闪当杀使用或打出",
				check() {
					return 1;
				},
				ai: {
					effect: {
						target(card, player, target, current) {
							if (get.tag(card, "respondSha") && current < 0) return 0.6;
						},
					},
					respondSha: true,
					skillTagFilter(player) {
						if (!player.countCards("hs", "shan")) return false;
					},
					order() {
						return get.order({ name: "sha" }) + 0.1;
					},
					useful: -1,
					value: -1,
				},
			},
			shan: {
				audio: "longdan_sha",
				audioname: ["re_zhaoyun"],
				enable: ["chooseToRespond", "chooseToUse"],
				filterCard: { name: "sha" },
				viewAs: { name: "shan" },
				prompt: "将一张杀当闪使用或打出",
				check() {
					return 1;
				},
				position: "hs",
				viewAsFilter(player) {
					if (!player.countCards("hs", "sha")) return false;
				},
				ai: {
					respondShan: true,
					skillTagFilter(player) {
						if (!player.countCards("hs", "sha")) return false;
					},
					effect: {
						target(card, player, target, current) {
							if (get.tag(card, "respondShan") && current < 0) return 0.6;
						},
					},
					order: 4,
					useful: -1,
					value: -1,
				},
			},
		},
	},
	mashu: {
		mod: {
			globalFrom(from, to, distance) {
				return distance - 1;
			},
		},
	},
	mashu2: {
		mod: {
			globalFrom(from, to, distance) {
				return distance - 1;
			},
		},
	},
	feiying: {
		mod: {
			globalTo(from, to, distance) {
				return distance + 1;
			},
		},
	},
	tieji: {
		audio: 2,
		trigger: { player: "useCardToPlayered" },
		check(event, player) {
			return get.attitude(player, event.target) <= 0;
		},
		filter(event, player) {
			return event.card.name == "sha";
		},
		logTarget: "target",
		preHidden: true,
		async content(event, trigger, player) {
			const judgeEvent = player.judge(card => {
				if (get.zhu(_status.event.player, "shouyue")) {
					if (get.suit(card) != "spade") return 2;
				} else {
					if (get.color(card) == "red") return 2;
				}
				return -0.5;
			});
			judgeEvent.judge2 = result => result.bool;
			const {
				result: { bool },
			} = await judgeEvent;
			if (bool) {
				trigger.getParent().directHit.add(trigger.target);
			}
		},
		ai: {
			directHit_ai: true,
			skillTagFilter(player, tag, arg) {
				if (get.attitude(player, arg.target) > 0 || arg.card.name != "sha" || !ui.cardPile.firstChild || get.color(ui.cardPile.firstChild, player) != "red") return false;
			},
		},
	},
	jizhi: {
		audio: 2,
		audioname: ["jianyong"],
		audioname2: {
			xin_simayi: "jilue_jizhi",
		},
		trigger: { player: "useCard" },
		frequent: true,
		preHidden: true,
		filter(event) {
			return get.type(event.card) == "trick" && event.card.isCard;
		},
		async content(event, trigger, player) {
			player.draw();
		},
		ai: {
			threaten: 1.4,
			noautowuxie: true,
		},
	},
	xinjizhi: {
		audio: "jizhi",
		trigger: { player: "useCard" },
		frequent: true,
		// alter:true,
		filter(event) {
			if (get.type(event.card) == "delay") return false;
			return get.type(event.card, "trick") == "trick" && event.cards[0] && event.cards[0] == event.card;
		},
		async content(event, trigger, player) {
			player.draw();
		},
		ai: {
			threaten: 1.4,
			noautowuxie: true,
		},
	},
	qicai: {
		mod: {
			targetInRange(card, player, target, now) {
				if (["trick", "delay"].includes(get.type(card))) return true;
			},
		},
	},
	xinqicai: {
		// alter:true,
		mod: {
			targetInRange(card, player, target, now) {
				if (["trick", "delay"].includes(get.type(card))) return true;
			},
		},
	},
	xinzhiheng: {
		audio: "zhiheng",
		mod: {
			aiOrder(player, card, num) {
				if (num <= 0 || get.itemtype(card) !== "card" || get.type(card) !== "equip") return num;
				let eq = player.getEquip(get.subtype(card));
				if (eq && get.equipValue(card) - get.equipValue(eq) < Math.max(1.2, 6 - player.hp)) return 0;
			},
		},
		locked: false,
		enable: "phaseUse",
		// alter:true,
		usable: 1,
		position: "he",
		filterCard: true,
		selectCard: [1, Infinity],
		check(card) {
			const player = _status.event.player;
			if (get.is.altered("xinzhiheng") && get.position(card) == "h" && !player.countCards("h", card => get.value(card) >= 8)) {
				return 8 - get.value(card);
			}
			return 6 - get.value(card);
		},
		delay: 0,
		async content(event, trigger, player) {
			if (!player.hasSkill("xinzhiheng_delay")) game.asyncDelayx();
			player.draw(event.cards.length);
		},
		group: "xinzhiheng_draw",
		subSkill: {
			draw: {
				trigger: { player: "loseEnd" },
				silent: true,
				filter(event, player) {
					if (event.getParent(2).skill != "xinzhiheng") return false;
					if (!get.is.altered("xinzhiheng")) return false;
					if (player.countCards("h")) return false;
					for (let i = 0; i < event.cards.length; i++) {
						if (event.cards[i].original == "h") return true;
					}
					return false;
				},
				async content(event, trigger, player) {
					player.draw();
					player.addTempSkill("xinzhiheng_delay", "xinzhihengAfter");
				},
			},
			delay: {},
		},
		ai: {
			order(item, player) {
				if (player.hasCard(i => get.value(i) > Math.max(6, 9 - player.hp), "he")) return 1;
				return 10;
			},
			result: {
				player: 1,
			},
			nokeep: true,
			skillTagFilter(player, tag, arg) {
				if (tag === "nokeep") return (!arg || (arg && arg.card && get.name(arg.card) === "tao")) && player.isPhaseUsing() && !player.getStat().skill.xinzhiheng && player.hasCard(card => get.name(card) !== "tao", "h");
			},
			threaten: 1.55,
		},
	},
	zhiheng: {
		audio: 2,
		audioname: ["gz_jun_sunquan"],
		audioname2: {
			xin_simayi: "jilue_zhiheng",
		},
		mod: {
			aiOrder(player, card, num) {
				if (num <= 0 || get.itemtype(card) !== "card" || get.type(card) !== "equip") return num;
				let eq = player.getEquip(get.subtype(card));
				if (eq && get.equipValue(card) - get.equipValue(eq) < Math.max(1.2, 6 - player.hp)) return 0;
			},
		},
		locked: false,
		enable: "phaseUse",
		usable: 1,
		position: "he",
		filterCard: true,
		selectCard: [1, Infinity],
		prompt: "弃置任意张牌并摸等量的牌",
		check(card) {
			return 6 - get.value(card);
		},
		async content(event, trigger, player) {
			player.draw(event.cards.length);
		},
		ai: {
			order: 1,
			result: {
				player: 1,
			},
			threaten: 1.5,
		},
	},
	jiuyuan: {
		audio: 2,
		unique: true,
		trigger: { target: "taoBegin" },
		zhuSkill: true,
		forced: true,
		filter(event, player) {
			if (event.player == player) return false;
			if (!player.hasZhuSkill("jiuyuan")) return false;
			if (event.player.group != "wu") return false;
			return true;
		},
		async content(event, trigger, player) {
			trigger.baseDamage++;
		},
	},
	xinjiuyuan: {
		audio: "jiuyuan",
		unique: true,
		// alter:true,
		trigger: { target: "taoBegin" },
		zhuSkill: true,
		forced: true,
		filter(event, player) {
			if (get.is.altered("xinjiuyuan")) return false;
			if (event.player == player) return false;
			if (!player.hasZhuSkill("jiuyuan")) return false;
			if (player.hp > 0) return false;
			if (event.player.group != "wu") return false;
			return true;
		},
		async content(event, trigger, player) {
			player.recover();
		},
		global: "xinjiuyuan2",
	},
	xinjiuyuan2: {
		audio: "jiuyuan",
		forceaudio: true,
		trigger: { player: "taoBegin" },
		filter(event, player) {
			if (!get.is.altered("xinjiuyuan")) return false;
			if (player.group != "wu") return false;
			return game.hasPlayer(target => {
				return player != target && target.isDamaged() && target.hp < player.hp && target.hasZhuSkill("xinjiuyuan", player);
			});
		},
		direct: true,
		async content(event, trigger, player) {
			event.list = game.filterPlayer(target => player != target && target.isDamaged() && target.hp < player.hp && target.hasZhuSkill("xinjiuyuan", player)).sortBySeat();
			while (event.list.length > 0) {
				const current = event.list.shift();
				event.current = current;
				const {
					result: { bool },
				} = await player.chooseBool(get.prompt("xinjiuyuan", current)).set("choice", get.attitude(player, current) > 0);
				if (bool) {
					player.logSkill("xinjiuyuan", event.current);
					event.current.recover();
					player.draw();
				}
			}
		},
	},
	qixi: {
		audio: 2,
		audioname: ["re_ganning"],
		audioname2: { re_heqi: "duanbing_heqi" },
		enable: "chooseToUse",
		filterCard(card) {
			return get.color(card) == "black";
		},
		position: "hes",
		viewAs: { name: "guohe" },
		viewAsFilter(player) {
			if (!player.countCards("hes", { color: "black" })) return false;
		},
		prompt: "将一张黑色牌当过河拆桥使用",
		check(card) {
			return 4 - get.value(card);
		},
	},
	keji: {
		audio: 2,
		audioname: ["re_lvmeng", "sp_lvmeng"],
		trigger: { player: "phaseDiscardBefore" },
		frequent(event, player) {
			return player.needsToDiscard();
		},
		filter(event, player) {
			if (player.getHistory("skipped").includes("phaseUse")) return true;
			const history = player.getHistory("useCard").concat(player.getHistory("respond"));
			for (let i = 0; i < history.length; i++) {
				if (history[i].card.name == "sha" && history[i].isPhaseUsing()) return false;
			}
			return true;
		},
		async content(event, trigger, player) {
			trigger.cancel();
		},
	},
	kurou: {
		audio: 2,
		enable: "phaseUse",
		prompt: "失去1点体力并摸两张牌",
		async content(event, trigger, player) {
			player.loseHp(1);
			player.draw(2);
		},
		ai: {
			basic: {
				order: 1,
			},
			result: {
				player(player) {
					if (player.countCards("h") >= player.hp - 1) return -1;
					if (player.hp < 3) return -1;
					return 1;
				},
			},
		},
	},
	yingzi: {
		audio: 2,
		audioname: ["sp_lvmeng"],
		trigger: { player: "phaseDrawBegin2" },
		frequent: true,
		filter(event, player) {
			return !event.numFixed;
		},
		async content(event, trigger, player) {
			trigger.num++;
		},
		ai: {
			threaten: 1.3,
		},
	},
	fanjian: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return player.countCards("h") > 0;
		},
		filterTarget(card, player, target) {
			return player != target;
		},
		async content(event, trigger, player) {
			const target = event.target;
			const control = await target
				.chooseControl("heart2", "diamond2", "club2", "spade2")
				.set("ai", event => {
					switch (Math.floor(Math.random() * 6)) {
						case 0:
							return "heart2";
						case 1:
						case 4:
						case 5:
							return "diamond2";
						case 2:
							return "club2";
						case 3:
							return "spade2";
					}
				})
				.forResultControl();
			game.log(target, "选择了" + get.translation(control));
			event.choice = control;
			target.chat("我选" + get.translation(event.choice));
			const {
				result: { bool, cards },
			} = await target.gainPlayerCard(player, true, "h");
			if (bool && get.suit(cards[0], player) + "2" != event.choice) target.damage("nocard");
		},
		ai: {
			order: 1,
			result: {
				target(player, target) {
					const eff = get.damageEffect(target, player);
					if (eff >= 0) return 1 + eff;
					let value = 0,
						i;
					const cards = player.getCards("h");
					for (i = 0; i < cards.length; i++) value += get.value(cards[i]);
					value /= player.countCards("h");
					if (target.hp == 1) return Math.min(0, value - 7);
					return Math.min(0, value - 5);
				},
			},
		},
	},
	guose: {
		audio: 2,
		filter(event, player) {
			return player.countCards("hes", { suit: "diamond" }) > 0;
		},
		enable: "chooseToUse",
		filterCard(card) {
			return get.suit(card) == "diamond";
		},
		position: "hes",
		viewAs: { name: "lebu" },
		prompt: "将一张方片牌当乐不思蜀使用",
		check(card) {
			return 6 - get.value(card);
		},
		ai: {
			threaten: 1.5,
		},
	},
	liuli: {
		audio: 2,
		audioname: ["re_daqiao", "daxiaoqiao"],
		trigger: { target: "useCardToTarget" },
		preHidden: true,
		filter(event, player) {
			if (event.card.name != "sha") return false;
			if (player.countCards("he") == 0) return false;
			return game.hasPlayer(current => {
				return player.inRange(current) && current != event.player && current != player && lib.filter.targetEnabled(event.card, event.player, current);
			});
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseCardTarget({
					position: "he",
					filterCard: lib.filter.cardDiscardable,
					filterTarget: (card, player, target) => {
						const trigger = _status.event;
						if (player.inRange(target) && target != trigger.source) {
							if (lib.filter.targetEnabled(trigger.card, trigger.source, target)) return true;
						}
						return false;
					},
					ai1: card => get.unuseful(card) + 9,
					ai2: target => {
						if (_status.event.player.countCards("h", "shan")) {
							return -get.attitude(_status.event.player, target);
						}
						if (get.attitude(_status.event.player, target) < 5) {
							return 6 - get.attitude(_status.event.player, target);
						}
						if (_status.event.player.hp == 1 && player.countCards("h", "shan") == 0) {
							return 10 - get.attitude(_status.event.player, target);
						}
						if (_status.event.player.hp == 2 && player.countCards("h", "shan") == 0) {
							return 8 - get.attitude(_status.event.player, target);
						}
						return -1;
					},
					prompt: get.prompt("liuli"),
					prompt2: "弃置一张牌，将此【杀】转移给攻击范围内的一名其他角色",
					source: trigger.player,
					card: trigger.card,
				})
				.setHiddenSkill(event.name)
				.forResult();
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			player.logSkill(event.name, target);
			player.discard(event.cards);
			const evt = trigger.getParent();
			evt.triggeredTargets2.remove(player);
			evt.targets.remove(player);
			evt.targets.push(target);
		},
		ai: {
			effect: {
				target_use(card, player, target) {
					if (target.countCards("he") == 0) return;
					if (card.name != "sha") return;
					let min = 1;
					const friend = get.attitude(player, target) > 0;
					const vcard = { name: "shacopy", nature: card.nature, suit: card.suit };
					const players = game.filterPlayer();
					for (let i = 0; i < players.length; i++) {
						if (player != players[i] && get.attitude(target, players[i]) < 0 && target.canUse(card, players[i])) {
							if (!friend) return 0;
							if (get.effect(players[i], vcard, player, player) > 0) {
								if (!player.canUse(card, players[0])) {
									return [0, 0.1];
								}
								min = 0;
							}
						}
					}
					return min;
				},
			},
		},
	},
	qianxun: {
		mod: {
			targetEnabled(card, player, target, now) {
				if (card.name == "shunshou" || card.name == "lebu") return false;
			},
		},
		audio: 2,
	},
	lianying: {
		audio: 2,
		trigger: {
			player: "loseAfter",
			global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"],
		},
		frequent: true,
		filter(event, player) {
			if (player.countCards("h")) return false;
			const evt = event.getl(player);
			return evt && evt.player == player && evt.hs && evt.hs.length > 0;
		},
		async content(event, trigger, player) {
			player.draw();
		},
		ai: {
			threaten: 0.8,
			effect: {
				target(card) {
					if (card.name == "guohe" || card.name == "liuxinghuoyu") return 0.5;
				},
			},
			noh: true,
			skillTagFilter(player, tag) {
				if (tag == "noh") {
					if (player.countCards("h") != 1) return false;
				}
			},
		},
	},
	xiaoji: {
		audio: 2,
		audioname: ["sp_sunshangxiang", "re_sunshangxiang"],
		trigger: {
			player: "loseAfter",
			global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"],
		},
		frequent: true,
		getIndex(event, player) {
			const evt = event.getl(player);
			if (evt && evt.player === player && evt.es) return evt.es.length;
			return false;
		},
		async content(event, trigger, player) {
			player.draw(2);
		},
		ai: {
			noe: true,
			reverseEquip: true,
			effect: {
				target(card, player, target, current) {
					if (get.type(card) == "equip" && !get.cardtag(card, "gifts")) return [1, 3];
				},
			},
		},
	},
	jieyin: {
		audio: 2,
		enable: "phaseUse",
		filterCard: true,
		usable: 1,
		selectCard: 2,
		check(card) {
			const player = get.owner(card);
			if (player.countCards("h") > player.hp) return 8 - get.value(card);
			if (player.hp < player.maxHp) return 6 - get.value(card);
			return 4 - get.value(card);
		},
		filterTarget(card, player, target) {
			if (!target.hasSex("male")) return false;
			if (target.hp >= target.maxHp) return false;
			if (target == player) return false;
			return true;
		},
		async content(event, trigger, player) {
			player.recover();
			event.target.recover();
		},
		ai: {
			order: 5.5,
			result: {
				player(player) {
					if (player.hp < player.maxHp) return 4;
					if (player.countCards("h") > player.hp) return 0;
					return -1;
				},
				target: 4,
			},
			threaten: 2,
		},
	},
	xinjieyin: {
		group: ["xinjieyin_old", "xinjieyin_new"],
		// alter:true,
		subSkill: {
			new: {
				audio: "jieyin",
				enable: "phaseUse",
				filterCard: true,
				usable: 1,
				position: "he",
				filter(event, player) {
					if (!get.is.altered("xinjieyin")) return false;
					return player.countCards("he") > 0;
				},
				check(card) {
					const player = _status.event.player;
					if (get.position(card) == "e") {
						const subtype = get.subtype(card);
						if (
							!game.hasPlayer(current => {
								return current != player && current.hp != player.hp && get.attitude(player, current) > 0 && !current.countCards("e", { subtype });
							})
						) {
							return 0;
						}
						// 你还想我兼容{subtype:subtype}？不可能！
						if (player.countCards("h", { subtype })) return 20 - get.value(card);
						return 10 - get.value(card);
					} else {
						if (player.countCards("e")) return 0;
						if (player.countCards("h", { type: "equip" })) return 0;
						return 8 - get.value(card);
					}
				},
				filterTarget(card, player, target) {
					if (!target.hasSex("male")) return false;
					card = ui.selected.cards[0];
					if (!card) return false;
					if (get.position(card) == "e" && target.countCards("e", { subtype: get.subtype(card) })) return false;
					return true;
				},
				discard: false,
				delay: 0,
				lose: false,
				async content(event, trigger, player) {
					const { cards, target } = event;
					if (get.position(cards[0]) == "e") {
						player.$give(cards, target);
						target.equip(cards[0]);
					} else {
						player.discard(cards);
					}
					if (player.hp > target.hp) {
						player.draw();
						if (target.isDamaged()) target.recover();
					} else if (player.hp < target.hp) {
						target.draw();
						if (player.isDamaged()) player.recover();
					}
				},
				ai: {
					order() {
						const player = _status.event.player;
						const es = player.getCards("e");
						for (let i = 0; i < es.length; i++) {
							if (player.countCards("h", { subtype: get.subtype(es[i]) })) return 10;
						}
						return 2;
					},
					result: {
						target(player, target) {
							const goon = () => {
								const es = player.getCards("e");
								for (let i = 0; i < es.length; i++) {
									if (player.countCards("h", { subtype: get.subtype(es[i]) })) return true;
								}
								return false;
							};
							if (player.hp < target.hp) {
								if (player.isHealthy()) {
									if (!player.needsToDiscard(1) || goon()) return 0.1;
									return 0;
								}
								return 1.5;
							}
							if (player.hp > target.hp) {
								if (target.isHealthy()) {
									if (!player.needsToDiscard(1) || goon()) return 0.1;
									return 0;
								}
								return 1;
							}
							return 0;
						},
					},
				},
			},
			old: {
				audio: "jieyin",
				enable: "phaseUse",
				filterCard: true,
				usable: 1,
				selectCard: 2,
				filter(event, player) {
					if (get.is.altered("xinjieyin")) return false;
					return player.countCards("h") >= 2;
				},
				check(card) {
					const player = get.owner(card);
					if (player.countCards("h") > player.hp) return 8 - get.value(card);
					if (player.hp < player.maxHp) return 6 - get.value(card);
					return 4 - get.value(card);
				},
				filterTarget(card, player, target) {
					if (!target.hasSex("male")) return false;
					if (target.hp >= target.maxHp) return false;
					if (target == player) return false;
					return true;
				},
				async content(event, trigger, player) {
					player.recover();
					event.target.recover();
				},
				ai: {
					order: 5.5,
					result: {
						player(player) {
							if (player.hp < player.maxHp) return 4;
							if (player.countCards("h") > player.hp) return 0;
							return -1;
						},
						target: 4,
					},
				},
			},
		},
		ai: {
			threaten: 2.3,
		},
	},
	qingnang: {
		audio: 2,
		enable: "phaseUse",
		filterCard: true,
		usable: 1,
		check(card) {
			return 9 - get.value(card);
		},
		filterTarget(card, player, target) {
			if (target.hp >= target.maxHp) return false;
			return true;
		},
		async content(event, trigger, player) {
			event.target.recover();
		},
		ai: {
			order: 9,
			result: {
				target(player, target) {
					if (target.hp == 1) return 5;
					if (player == target && player.countCards("h") > player.hp) return 5;
					return 2;
				},
			},
			threaten: 2,
		},
	},
	jijiu: {
		mod: {
			aiValue(player, card, num) {
				if (get.name(card) != "tao" && get.color(card) != "red") return;
				const cards = player.getCards("hs", card => get.name(card) == "tao" || get.color(card) == "red");
				cards.sort((a, b) => (get.name(a) == "tao" ? 1 : 2) - (get.name(b) == "tao" ? 1 : 2));
				var geti = () => {
					if (cards.includes(card)) cards.indexOf(card);
					return cards.length;
				};
				return Math.max(num, [6.5, 4, 3, 2][Math.min(geti(), 2)]);
			},
			aiUseful() {
				return lib.skill.kanpo.mod.aiValue.apply(this, arguments);
			},
		},
		locked: false,
		audio: 2,
		audioname: ["re_huatuo"],
		enable: "chooseToUse",
		viewAsFilter(player) {
			return player != _status.currentPhase && player.countCards("hes", { color: "red" }) > 0;
		},
		filterCard(card) {
			return get.color(card) == "red";
		},
		position: "hes",
		viewAs: { name: "tao" },
		prompt: "将一张红色牌当桃使用",
		check(card) {
			return 15 - get.value(card);
		},
		ai: {
			threaten: 1.5,
		},
	},
	wushuang: {
		audio: 2,
		audioname: ["re_lvbu", "shen_lvbu", "lvlingqi"],
		forced: true,
		locked: true,
		group: ["wushuang1", "wushuang2"],
		preHidden: ["wushuang1", "wushuang2"],
	},
	wushuang1: {
		audio: "wushuang",
		audioname: ["re_lvbu", "shen_lvbu", "lvlingqi"],
		trigger: { player: "useCardToPlayered" },
		forced: true,
		filter(event, player) {
			return event.card.name == "sha" && !event.getParent().directHit.includes(event.target);
		},
		//priority:-1,
		logTarget: "target",
		async content(event, trigger, player) {
			const id = trigger.target.playerid;
			const map = trigger.getParent().customArgs;
			if (!map[id]) map[id] = {};
			if (typeof map[id].shanRequired == "number") {
				map[id].shanRequired++;
			} else {
				map[id].shanRequired = 2;
			}
		},
		ai: {
			directHit_ai: true,
			skillTagFilter(player, tag, arg) {
				if (arg.card.name != "sha" || arg.target.countCards("h", "shan") > 1) return false;
			},
		},
	},
	wushuang2: {
		audio: "wushuang",
		audioname: ["re_lvbu", "shen_lvbu", "lvlingqi"],
		trigger: { player: "useCardToPlayered", target: "useCardToTargeted" },
		forced: true,
		logTarget(trigger, player) {
			return player == trigger.player ? trigger.target : trigger.player;
		},
		filter(event, player) {
			return event.card.name == "juedou";
		},
		//priority:-1,
		async content(event, trigger, player) {
			const id = (player == trigger.player ? trigger.target : trigger.player)["playerid"];
			const idt = trigger.target.playerid;
			const map = trigger.getParent().customArgs;
			if (!map[idt]) map[idt] = {};
			if (!map[idt].shaReq) map[idt].shaReq = {};
			if (!map[idt].shaReq[id]) map[idt].shaReq[id] = 1;
			map[idt].shaReq[id]++;
		},
		ai: {
			directHit_ai: true,
			skillTagFilter(player, tag, arg) {
				if (arg.card.name != "juedou" || Math.floor(arg.target.countCards("h", "sha") / 2) > player.countCards("h", "sha")) return false;
			},
		},
	},
	zhanshen: {
		audio: 2,
		trigger: { player: "phaseZhunbeiBegin" },
		forced: true,
		skillAnimation: true,
		animationColor: "gray",
		filter(event, player) {
			return player.isDamaged() && game.dead.filter(target => target.isFriendOf(player)).length > 0;
		},
		async content(event, trigger, player) {
			player.awakenSkill("zhanshen");
			const cards = player.getEquips(1);
			if (cards.length) player.discard(cards);
			player.loseMaxHp();
			player.addSkills(["mashu", "shenji"]);
		},
		derivation: ["mashu", "shenji"],
	},
	shenji: {
		mod: {
			selectTarget(card, player, range) {
				if (range[1] == -1) return;
				if (card.name == "sha") range[1] += 2;
			},
			cardUsable(card, player, num) {
				if (card.name == "sha") return num + 1;
			},
		},
	},
	lijian: {
		audio: 2,
		audioname: ["re_diaochan"],
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return game.countPlayer(current => current != player && current.hasSex("male")) > 1;
		},
		check(card) {
			return 10 - get.value(card);
		},
		filterCard: true,
		position: "he",
		filterTarget(card, player, target) {
			if (player == target) return false;
			if (!target.hasSex("male")) return false;
			if (ui.selected.targets.length == 1) {
				return target.canUse({ name: "juedou" }, ui.selected.targets[0]);
			}
			return true;
		},
		targetprompt: ["先出杀", "后出杀"],
		selectTarget: 2,
		multitarget: true,
		async content(event, trigger, player) {
			const useCardEvent = event.targets[1].useCard({ name: "juedou", isCard: true }, "nowuxie", event.targets[0], "noai");
			useCardEvent.animate = false;
			game.asyncDelay(0.5);
		},
		ai: {
			order: 8,
			result: {
				target(player, target) {
					if (ui.selected.targets.length == 0) {
						return -3;
					} else {
						return get.effect(target, { name: "juedou" }, ui.selected.targets[0], target);
					}
				},
			},
			expose: 0.4,
			threaten: 3,
		},
	},
	biyue: {
		audio: 2,
		trigger: { player: "phaseJieshuBegin" },
		frequent: true,
		preHidden: true,
		async content(event, trigger, player) {
			player.draw();
		},
	},
	xinbiyue: {
		audio: "biyue",
		trigger: { player: "phaseJieshuBegin" },
		frequent: true,
		// alter:true,
		async content(event, trigger, player) {
			player.draw();
		},
	},
	yaowu: {
		trigger: { player: "damageBegin3" },
		//priority:1,
		audio: 2,
		filter(event) {
			if (event.card && event.card.name == "sha") {
				if (get.color(event.card) == "red") return true;
			}
			return false;
		},
		forced: true,
		check() {
			return false;
		},
		async content(event, trigger, player) {
			trigger.source.chooseDrawRecover(true);
		},
		ai: {
			neg: true,
			effect: {
				target(card, player, target, current) {
					if (card.name == "sha" && get.color(card) == "red") {
						return [1, -2];
					}
				},
			},
		},
	},
	new_jiangchi: {
		audio: 2,
		trigger: {
			player: "phaseDrawEnd",
		},
		async cost(event, trigger, player) {
			const list = ["弃牌", "摸牌", "cancel2"];
			if (!player.countCards("he")) list.remove("弃牌");
			const control = await player
				.chooseControl(list, () => {
					const player = _status.event.player;
					if (list.includes("弃牌")) {
						if (player.countCards("h") > 3 && player.countCards("h", "sha") > 1) {
							return "弃牌";
						}
						if (player.countCards("h", "sha") > 2) {
							return "弃牌";
						}
					}
					if (!player.countCards("h", "sha")) {
						return "摸牌";
					}
					return "cancel2";
				})
				.set("prompt", get.prompt2("new_jiangchi"))
				.forResultControl();
			if (control === "cancel2") event.result = { bool: false };
			else
				event.result = {
					bool: true,
					cost_data: control,
				};
		},
		async content(event, trigger, player) {
			const control = event.cost_data;

			if (control == "弃牌") {
				player.chooseToDiscard(true, "he");
				player.addTempSkill("jiangchi2", "phaseUseEnd");
			} else if (control == "摸牌") {
				player.draw();
				player.addTempSkill("new_jiangchi3", "phaseEnd");
			}
		},
	},
	new_jiangchi3: {
		mod: {
			cardEnabled(card) {
				if (card.name == "sha") return false;
			},
			cardRespondable(card) {
				if (card.name == "sha") return false;
			},
			ignoredHandcard(card, player) {
				if (get.name(card) == "sha") return true;
			},
			cardDiscardable(card, player, name) {
				if (name == "phaseDiscard" && get.name(card) == "sha") return false;
			},
		},
	},
	xinfu_jijie: {
		enable: "phaseUse",
		usable: 1,
		audio: 2,
		async content(event, trigger, player) {
			const card = get.bottomCards()[0];
			game.cardsGotoOrdering(card);
			event.card = card;
			const {
				result: { bool, targets },
			} = await player
				.chooseTarget(true)
				.set("ai", target => {
					let att = get.attitude(_status.event.player, target);
					if (_status.event.du) {
						if (target.hasSkillTag("nodu")) return 0.5;
						return -att;
					}
					if (att > 0) {
						if (_status.event.player != target) att += 2;
						return att + Math.max(0, 5 - target.countCards("h"));
					}
					return att;
				})
				.set("du", event.card.name == "du")
				.set("createDialog", ["机捷：选择一名角色获得此牌", [card]]);
			if (bool) {
				const target = targets[0];
				player.line(target, "green");
				const gainEvent = target.gain(card, "draw");
				gainEvent.giver = player;
			}
		},
		ai: {
			order: 7.2,
			result: {
				player: 1,
			},
		},
	},
	xinfu_jiyuan: {
		trigger: {
			global: ["dying", "gainAfter", "loseAsyncAfter"],
		},
		audio: 2,
		getIndex(event, player) {
			if (event.name !== "loseAsync") return [event.player];
			else return game.filterPlayer(current => current != player && event.getg(current).length > 0).sortBySeat();
		},
		filter(event, player, triggername, target) {
			if (!target.isIn()) return false;
			if (event.name === "dying") return true;
			if (event.giver !== player) return false;
			if (event.name === "gain") {
				return event.player != player && event.getg(target).length > 0;
			}
			return game.hasPlayer(current => current != player && event.getg(current).length > 0);
		},
		logTarget(event, player, triggername, target) {
			return target;
		},
		check(event, player, triggername, target) {
			return get.attitude(player, target) > 0;
		},
		async content(event, trigger, player) {
			event.targets[0].draw();
		},
	},
};

export default skills;
