import { lib, game, ui, get, ai, _status } from "../../noname.js";

/** @type { importCharacterConfig['skill'] } */
const skills = {
	//加纳天善（改版）
	tenzen_fenghuan: {
		trigger: { global: "useCardAfter" },
		filter(event, player) {
			if (player == event.player || event.targets.length != 1 || event.targets[0] != player || !event.player.isIn() || (event.card.name != "sha" && (get.type(event.card, null, false) != "trick" || !get.tag(event.card, "damage")))) {
				return false;
			}
			if (
				!player.canUse(
					{
						name: event.card.name,
						nature: event.card.nature,
						isCard: true,
					},
					event.player,
					false
				)
			) {
				return false;
			}
			var num = get.number(event.card);
			if (typeof num != "number") {
				return false;
			}
			num *= 2;
			var hs = player.getCards("he");
			for (var i of hs) {
				num -= get.number(i);
				if (num <= 0) {
					return true;
				}
			}
			return false;
		},
		async cost(event, trigger, player) {
			const num = get.number(trigger.card) * 2,
				card = {
					name: trigger.card.name,
					nature: trigger.card.nature,
					isCard: true,
				};
			event.result = await player
				.chooseToDiscard("he", get.prompt(event.skill, trigger.player), "弃置任意张点数之和不小于" + num + "的牌，然后视为对其使用一张" + get.translation(card), "chooseonly")
				.set("selectCard", function () {
					var cards = ui.selected.cards,
						num = _status.event.cardNumber;
					for (var i of cards) {
						num -= get.number(i);
						if (num <= 0) {
							return [cards.length, cards.length + 1];
						}
					}
					return [cards.length + 1, cards.length + 1];
				})
				.set("cardNumber", num)
				.set("effect", get.effect(trigger.player, card, player, player))
				.set("ai", function (card) {
					var eff = _status.event.effect;
					if (eff <= 0) {
						return 0;
					}
					for (var i of ui.selected.cards) {
						eff -= get.value(i) / Math.sqrt(get.number(i) / 3);
					}
					return eff - get.value(card) / Math.sqrt(get.number(card) / 3);
				})
				.forResult();
		},
		async content(event, trigger, player) {
			await player.discard(event.cards);
			var card = {
					name: trigger.card.name,
					nature: trigger.card.nature,
					isCard: true,
				},
				target = trigger.player;
			if (target.isIn() && player.canUse(card, target, false)) {
				await player.useCard(card, target, false);
			}
		},
	},
	tenzen_retianquan: {
		trigger: { player: "useCardToPlayered" },
		filter(event, player) {
			return (
				event.card.name == "sha" &&
				(player.hp > 0 ||
					player.hasCard(function (card) {
						return lib.filter.cardDiscardable(card, player, "tenzen_retianquan");
					}, "he"))
			);
		},
		logTarget: "target",
		usable: 1,
		check(event, player) {
			if (get.attitude(player, event.target) >= 0) {
				return false;
			}
			if (player.hp > player.maxHp / 2) {
				return true;
			}
			if (
				player.hasCard(function (card) {
					return lib.filter.cardDiscardable(card, player, "tenzen_retianquan") && get.value(card) < 6;
				}, "he")
			) {
				return true;
			}
			return true;
		},
		prompt2: "你可失去1点体力或弃置一张牌，亮出牌堆顶的三张牌（若你的体力值小于体力上限的50%，则改为展示五张牌）。每有一张基本牌，其所需使用的【闪】的数量便+1。然后若此牌造成过伤害，则你获得展示牌中的所有非基本牌。",
		content() {
			"step 0";
			player
				.chooseToDiscard("弃置一张牌，或点「取消」失去1点体力", "he")
				.set("goon", player.hp > player.maxHp / 2)
				.set("ai", function (card) {
					var val = get.value(card);
					if (_status.event.goon) {
						return 0.1 - val;
					}
					return 6 - val;
				});
			"step 1";
			if (!result.bool) {
				player.loseHp();
			}
			"step 2";
			var cards = get.cards(player.hp <= player.maxHp / 2 ? 5 : 3);
			player.showCards(cards, get.translation(player) + "发动了【天全】");
			game.cardsGotoOrdering(cards).relatedEvent = trigger.getParent();
			var num = cards.filter(function (card) {
				return get.type(card, null, false) == "basic";
			}).length;
			if (num) {
				if (trigger.card.name == "sha") {
					var id = trigger.target.playerid;
					var map = trigger.getParent().customArgs;
					if (!map[id]) {
						map[id] = {};
					}
					if (typeof map[id].shanRequired == "number") {
						map[id].shanRequired += num;
					} else {
						map[id].shanRequired = 1 + num;
					}
				}
			}
			if (num < 5) {
				var next = game.createEvent("tenzen_retianqua_gain");
				next.cards = cards;
				next.player = player;
				event.next.remove(next);
				trigger.getParent().after.push(next);
				next.setContent(function () {
					if (
						player.getHistory("sourceDamage", function (evt) {
							return evt.card == event.parent.card;
						}).length > 0
					) {
						player.gain(
							cards.filter(function (card) {
								return get.type(card, null, false) != "basic";
							}),
							"gain2"
						);
					}
				});
			}
		},
	},
	//藤林杏
	kyou_zhidian: {
		locked: false,
		mod: {
			targetInRange(card) {
				if (card.kyou_zhidian) {
					return true;
				}
			},
			aiOrder(player, card, numx) {
				var num = _status.event._kyou_zhidian_baseValue;
				if (num > 0 && get.type2(card) == "trick" && player.getUseValue(card) < num) {
					return numx / 10;
				}
			},
		},
		enable: "chooseToUse",
		filter(event, player) {
			return player.countCards("hs", card => get.type2(card) == "trick") > 0;
		},
		filterCard(card) {
			return get.type2(card) == "trick";
		},
		onChooseToUse(event) {
			event._kyou_zhidian_baseValue = event.player.getUseValue({
				name: "sha",
			});
		},
		check(card) {
			var num = _status.event._kyou_zhidian_baseValue,
				player = _status.event.player;
			return num - player.getUseValue(card);
		},
		prompt: "将一张锦囊牌当做【杀】使用",
		viewAs: {
			name: "sha",
			kyou_zhidian: true,
		},
		group: "kyou_zhidian_aim",
		ai: {
			respondSha: true,
			skillTagFilter: player => player.countCards("hs", card => get.type2(card) == "trick") > 0,
		},
		subSkill: {
			aim: {
				trigger: {
					player: "useCardToPlayered",
				},
				forced: true,
				locked: false,
				filter(event, player) {
					return event.isFirstTarget && event.card.name == "sha";
				},
				logTarget: "target",
				content() {
					"step 0";
					var list = ["不可被响应", "无视防具", "伤害+1", "不计入次数"];
					list.remove(player.storage.kyou_zhidian);
					player
						.chooseControl(list)
						.set("prompt", "掷典：请为" + get.translation(trigger.card) + "选择一种效果")
						.set(
							"choice",
							(function () {
								if (list.includes("不计入次数") && player.hasSha()) {
									return "不计入次数";
								}
								if (list.includes("不可被响应") && trigger.target.mayHaveShan(player, "use")) {
									return "不可被响应";
								}
								if (list.includes("伤害+1")) {
									return "伤害+1";
								}
								return list.randomGet();
							})()
						)
						.set("ai", () => _status.event.choice);
					"step 1";
					var target = trigger.target;
					player.storage.kyou_zhidian = result.control;
					game.log(player, "对", target, "的", trigger.card, "#g" + result.control);
					switch (result.control) {
						case "不可被响应":
							trigger.directHit.add(target);
							break;
						case "无视防具":
							target.addTempSkill("qinggang2");
							target.storage.qinggang2.add(trigger.card);
							break;
						case "伤害+1":
							var map = trigger.customArgs;
							var id = target.playerid;
							if (!map[id]) {
								map[id] = {};
							}
							if (!map[id].extraDamage) {
								map[id].extraDamage = 0;
							}
							map[id].extraDamage++;
							break;
						case "不计入次数":
							var evt = trigger.getParent();
							if (evt.addCount !== false) {
								evt.addCount = false;
								player.getStat().card.sha--;
							}
							break;
					}
				},
			},
		},
	},
	kyou_duanfa: {
		trigger: { player: "damageBegin2" },
		limited: true,
		skillAnimation: true,
		animationColor: "thunder",
		filter(event, player) {
			return player.hp <= event.num;
		},
		content() {
			player.awakenSkill(event.name);
			if (player.countCards("h") > 0) {
				player.chooseToDiscard("h", true, player.countCards("h"));
			}
			player.recover();
			trigger.cancel();
			player.addTempSkill("kyou_duanfa_draw", {
				player: "phaseBeginStart",
			});
		},
		subSkill: {
			draw: {
				trigger: { target: "useCardToTargeted" },
				forced: true,
				charlotte: true,
				filter(event, player) {
					if (event.card.name == "sha") {
						return true;
					}
					return get.type(event.card, null, false) == "trick" && get.tag(event.card, "damage") > 0;
				},
				content() {
					player.draw();
				},
			},
		},
	},
	//天王寺瑚太朗
	kotarou_aurora: {
		trigger: {
			player: ["damageEnd", "loseHpEnd", "gainMaxHpEnd"],
		},
		forced: true,
		charlotte: true,
		filter(event, player) {
			return player.hasEnabledSlot(1);
		},
		content() {
			if (player.hasEmptySlot(1)) {
				var card = get.cardPile2(function (card) {
					return get.subtype(card) == "equip1" && !get.cardtag(card, "gifts") && player.canUse(card, player);
				});
				if (card) {
					player.chooseUseTarget(card, true);
				}
			} else {
				player.chooseUseTarget("sha", true, false);
			}
		},
	},
	kotarou_rewrite: {
		enable: "phaseUse",
		charlotte: true,
		filter(event, player) {
			return !player.hasSkill("kotarou_rewrite_block");
		},
		content() {
			"step 0";
			player.getHistory("custom").push({ kotarou_rewrite: true });
			player
				.chooseControl()
				.set("choiceList", ["视为使用一张本局游戏没有以此法使用过的基本牌或普通锦囊牌", "移动场上的一张牌", "增加1点体力上限并失去1点体力", "本回合内下一次造成的伤害+1", "本回合内下一次回复体力时，额外回复1点体力", "本回合内手牌上限和【杀】的使用次数+1 　　　　　　　　　　　　　　　　　　　　　　　　"])
				.set("ai", function () {
					var player = _status.event.player;
					if (player.hp > 2 && player.getUseValue({ name: "sha" }) > 0) {
						return 2;
					}
					return 0;
				});
			"step 1";
			lib.skill.kotarou_rewrite.rewrites[result.index](player, event);
			if (result.index != 0) {
				event.goto(3);
			}
			"step 2";
			if (result.bool) {
				player.storage.kotarou_rewrite.push(result.links[0][2]);
				player.chooseUseTarget(true, {
					name: result.links[0][2],
					nature: result.links[0][3],
					isCard: true,
				});
			}
			"step 3";
			if (
				player.getHistory("custom", function (evt) {
					return evt && evt.kotarou_rewrite == true;
				}).length >= 3
			) {
				player.addTempSkill("kotarou_rewrite_block");
			}
		},
		onremove: true,
		rewrites: [
			function (player, event) {
				var list = [];
				if (!player.storage.kotarou_rewrite) {
					player.storage.kotarou_rewrite = [];
				}
				for (var i of lib.inpile) {
					if (player.storage.kotarou_rewrite.includes(i)) {
						continue;
					}
					var type = get.type(i);
					if (type == "basic" || type == "trick") {
						list.push([type, "", i]);
					}
					if (i == "sha") {
						for (var j of lib.inpile_nature) {
							list.push([type, "", i, j]);
						}
					}
				}
				if (list.length) {
					player
						.chooseButton(["改写：视为使用一张基本牌或普通锦囊牌", [list, "vcard"]], true)
						.set("filterButton", function (button) {
							return player.hasUseTarget(
								{
									name: button.link[2],
									nature: button.link[3],
									isCard: true,
								},
								null,
								true
							);
						})
						.set("ai", function (button) {
							return player.getUseValue({
								name: button.link[2],
								nature: button.link[3],
								isCard: true,
							});
						});
				} else {
					event._result = { bool: false };
				}
			},
			function (player, event) {
				player.moveCard(true);
			},
			function (player, event) {
				if (player.maxHp < 5) {
					player.gainMaxHp();
				}
				player.loseHp();
			},
			function (player, event) {
				player.addSkill("kotarou_rewrite_damage");
				player.addMark("kotarou_rewrite_damage", 1, false);
				game.log(player, "本回合下次造成的伤害", "#y+1");
			},
			function (player, event) {
				player.addSkill("kotarou_rewrite_recover");
				player.addMark("kotarou_rewrite_recover", 1, false);
				game.log(player, "本回合下次回复的体力", "#y+1");
			},
			function (player, event) {
				player.addSkill("kotarou_rewrite_sha");
				player.addMark("kotarou_rewrite_sha", 1, false);
				game.log(player, "本回合的手牌上限和使用【杀】的次数上限", "#y+1");
			},
		],
		ai: {
			order: 4,
			result: {
				player(player) {
					if (
						player.getHistory("custom", function (evt) {
							return evt && evt.kotarou_rewrite == true;
						}).length >= 2
					) {
						return 0;
					}
					return 1;
				},
			},
		},
	},
	kotarou_rewrite_damage: {
		onremove: true,
		trigger: { source: "damageBegin1" },
		forced: true,
		content() {
			trigger.num += player.countMark("kotarou_rewrite_damage");
			player.removeSkill("kotarou_rewrite_damage");
		},
		charlotte: true,
		intro: { content: "下一次造成的伤害+#" },
	},
	kotarou_rewrite_recover: {
		onremove: true,
		trigger: { player: "recoverBegin" },
		forced: true,
		content() {
			trigger.num += player.countMark("kotarou_rewrite_recover");
			player.removeSkill("kotarou_rewrite_recover");
		},
		charlotte: true,
		intro: { content: "下一次回复的体力+#" },
	},
	kotarou_rewrite_sha: {
		onremove: true,
		mod: {
			maxHandcard(player, num) {
				return num + player.countMark("kotarou_rewrite_sha");
			},
			cardUsable(card, player, num) {
				if (card.name == "sha") {
					return num + player.countMark("kotarou_rewrite_sha");
				}
			},
		},
		charlotte: true,
		intro: { content: "手牌上限和出杀次数+#" },
	},
	kotarou_rewrite_block: {
		trigger: { player: "phaseEnd" },
		forced: true,
		charlotte: true,
		content() {
			player.removeSkill("kotarou_rewrite");
			player.removeSkill("kotarou_aurora");
			if (player.maxHp > 3) {
				player.loseMaxHp(player.maxHp - 3);
			}
		},
	},
	//伊座并杏子
	kyouko_rongzhu: {
		trigger: { global: "gainEnd" },
		filter(event, player) {
			if (player == event.player || event.getParent().name == "kyouko_rongzhu") {
				return false;
			}
			var evt = event.getl(player);
			return evt && evt.cards2 && evt.cards2.length > 0;
		},
		logTarget: "player",
		check(event, player) {
			return get.attitude(player, event.player) > 0;
		},
		content() {
			"step 0";
			player.draw();
			"step 1";
			var target = trigger.player;
			if (player.countCards("he") > 0 && target.isIn()) {
				player.chooseCard("he", true, "将一张牌交给" + get.translation(target));
			} else {
				event.finish();
			}
			"step 2";
			if (result.bool) {
				player.give(result.cards, trigger.player);
				var target = _status.currentPhase;
				var name;
				if (target == player) {
					name = "kyouko_rongzhu_me";
					player.addTempSkill(name);
					player.addMark(name, 1, false);
				} else if (target == trigger.player) {
					name = "kyouko_rongzhu_notme";
					target.addTempSkill(name);
					target.addMark(name, 1, false);
				}
			}
		},
		subSkill: {
			me: {
				mod: {
					maxHandcard(player, num) {
						return num + player.countMark("kyouko_rongzhu_me");
					},
				},
				intro: { content: "手牌上限+#" },
				onremove: true,
			},
			notme: {
				mod: {
					cardUsable(card, player, num) {
						if (card.name == "sha") {
							return num + player.countMark("kyouko_rongzhu_notme");
						}
					},
				},
				intro: { content: "使用杀的次数上限+#" },
				onremove: true,
			},
		},
	},
	kyouko_gongmian: {
		enable: "phaseUse",
		prompt: "出牌阶段，你可以选择一名未以此法选择过的角色，若其手牌：大于你，你获得其一张牌，然后交给其一张牌；小于你，其交给你一张牌，然后你交给其一张牌；等于你，你与其各摸一张牌。",
		filter(event, player) {
			return game.hasPlayer(function (current) {
				return current != player && lib.skill.kyouko_gongmian.filterTarget(null, player, current);
			});
		},
		filterTarget(card, kyouko, hina) {
			if (kyouko == hina || kyouko.getStorage("kyouko_gongmian").includes(hina)) {
				return false;
			}
			var hs = hina.countCards("he");
			if (hs == 0) {
				return kyouko.countCards("h") == 0;
			}
			return true;
		},
		content() {
			"step 0";
			player.markAuto("kyouko_gongmian", targets);
			var hs = player.countCards("h"),
				ts = target.countCards("h");
			player.getHistory("custom").push({ kyouko_gongmian: true });
			if (hs > ts) {
				event.utype = 1;
				target.chooseCard("he", true, "交给" + get.translation(player) + "一张牌");
			} else if (hs == ts) {
				game.asyncDraw([player, target]);
				event.utype = 2;
			} else {
				event.utype = 3;
				player.gainPlayerCard(target, true, "he");
			}
			"step 1";
			if (event.utype == 2) {
				game.delayx();
				event.finish();
			} else if (!result.bool) {
				event.finish();
			} else if (event.utype == 1) {
				target.give(result.cards, player);
			}
			"step 2";
			if (player.countCards("he") > 0) {
				player.chooseCard("he", true, "交给" + get.translation(target) + "一张牌");
			} else {
				event.finish();
			}
			"step 3";
			if (result.bool) {
				player.give(result.cards, target);
			}
		},
		intro: {
			content: "已与$共勉",
		},
		group: ["kyouko_gongmian_use", "kyouko_gongmian_discard"],
		ai: {
			order: 6,
			result: {
				target(player, target) {
					if (
						player.getHistory("custom", function (evt) {
							return evt.kyouko_gongmian == true;
						}).length
					) {
						return 0;
					}
					return 1;
				},
			},
		},
	},
	kyouko_gongmian_use: {
		trigger: { player: "phaseUseEnd" },
		filter(event, player) {
			return (
				player.getHistory("custom", function (evt) {
					return evt.kyouko_gongmian == true;
				}).length > 0 &&
				game.hasPlayer(function (current) {
					return current != player && current.countGainableCards(player, "hej") > 0;
				})
			);
		},
		async cost(event, trigger, player) {
			const num = player.getHistory("custom", function (evt) {
				return evt.kyouko_gongmian == true;
			}).length;
			event.result = await player
				.chooseTarget(get.prompt("kyouko_gongmian"), "获得一名其他角色的至多" + get.cnNumber(num) + "张牌，然后交给其等量的牌", function (card, player, target) {
					return target != player && target.countGainableCards(player, "hej") > 0;
				})
				.set("ai", function (target) {
					var player = _status.event.player,
						att = get.attitude(player, target);
					if (att > 0) {
						return att;
					}
					var he = player.getCards("he");
					if (
						target.countCards("he", function (card) {
							return get.value(card, target) > 7;
						}) &&
						he.length > 0
					) {
						return (
							-att +
							5 -
							Math.min.apply(
								Math,
								he.map(function (card) {
									return get.value(card, player);
								})
							)
						);
					}
					return 0;
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const num = player.getHistory("custom", function (evt) {
					return evt.kyouko_gongmian == true;
				}).length,
				target = event.targets[0];
			let result = await player.gainPlayerCard(target, "hej", true, [1, num]).forResult();
			if (target.isIn() && result.bool && result.cards && result.cards.length && player.countCards("he") > 0) {
				const num = result.cards.length,
					hs = player.getCards("he");
				if (hs.length <= num) {
					result = { bool: true, cards: hs };
				} else {
					result = await player.chooseCard("he", true, num, "交给" + get.translation(target) + get.cnNumber(num) + "张牌").forResult();
				}
				if (result.bool && result.cards && result.cards.length) {
					player.give(result.cards, target);
				}
			}
		},
	},
	kyouko_gongmian_discard: {
		trigger: { player: "phaseDiscardBegin" },
		filter(event, player) {
			var hs = player.countCards("h");
			return (
				hs > 0 &&
				player.getHistory("custom", function (evt) {
					return evt.kyouko_gongmian == true;
				}).length >= player.hp &&
				game.hasPlayer(function (current) {
					return current != player && current.countCards("h") < hs;
				})
			);
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt("kyouko_gongmian"), "获得一名其他角色的所有手牌，然后将一半的牌交给该角色（向上取整）", function (card, player, target) {
					return target != player && target.countCards("h") < player.countCards("h");
				})
				.forResult();
		},
		content() {
			"step 0";
			var target = event.targets[0];
			event.target = target;
			var hs = target.getCards("h");
			if (hs.length > 0) {
				player.gain(hs, target, "giveAuto", "bySelf");
			}
			"step 1";
			if (target.isIn() && player.countCards("h") > 0) {
				var hs = player.getCards("h"),
					num = Math.ceil(hs.length / 2);
				if (hs.length <= num) {
					event._result = { bool: true, cards: hs };
				} else {
					player.chooseCard("he", true, num, "交给" + get.translation(target) + get.cnNumber(num) + "张牌");
				}
			} else {
				event.finish();
			}
			"step 2";
			if (result.bool && result.cards && result.cards.length) {
				player.give(result.cards, target);
			}
		},
	},
	//冰室忧希
	yuuki_yicha: {
		trigger: { player: "phaseUseBegin" },
		frequent: true,
		createDialog(id) {
			var dialog = ui.create.dialog("hidden");
			(dialog.textPrompt = dialog.add("异插")).style.textAlign = "center";
			dialog.cards = [];
			dialog.rawButtons = [];
			dialog.videoId = id;
			var cards = [];
			for (var i = 0; i < 3; i++) {
				var card = ui.create.card(null, null, true);
				card.pos = i;
				card.pos_x = i;
				card.pos_y = 0;
				cards.push(card);
				dialog.rawButtons.push(card);
			}
			dialog.add(cards);
			cards = [];
			for (var i = 0; i < 3; i++) {
				var card = ui.create.card(null, null, true);
				card.pos = i + 3;
				card.pos_x = i;
				card.pos_y = 1;
				cards.push(card);
				dialog.rawButtons.push(card);
			}
			dialog.add(cards);
			for (var i of dialog.buttons) {
				i.pos_x = i.link.pos_x;
				i.pos_y = i.link.pos_y;
				i.link = i.link.pos;
			}
			dialog.open();
		},
		addCard(card, id, pos) {
			var dialog = get.idDialog(id);
			if (!dialog) {
				return;
			}
			for (var i = 0; i < dialog.buttons.length; i++) {
				var button = dialog.buttons[i];
				if (button.link == pos) {
					var card2 = ui.create.button(card, "card");
					card2.pos = button.link;
					card2.pos_x = button.pos_x;
					card2.pos_y = button.pos_y;
					card2.classList.add("noclick");
					button.parentNode.insertBefore(card2, button);
					dialog.cards.push(card2);
					button.remove();
					dialog.buttons.splice(i, 1);
					break;
				}
			}
		},
		changePrompt(str, id) {
			var dialog = get.idDialog(id);
			if (!dialog) {
				return;
			}
			dialog.textPrompt.innerHTML = str;
		},
		content() {
			"step 0";
			var next = game.createEvent("cardsGotoOrdering");
			next.cards = [];
			next.setContent("cardsGotoOrdering");
			event.videoId = lib.status.videoId++;
			event.forceDie = true;
			event.cards = [];
			event.positions = [0, 1, 2, 3, 4, 5];
			game.broadcastAll(function (id) {
				lib.skill.yuuki_yicha.createDialog(id);
			}, event.videoId);
			player.judge().set("callback", function () {
				event.getParent().orderingCards.remove(event.judgeResult.card);
				event.getParent(2).orderingCards.add(event.judgeResult.card);
			});
			"step 1";
			if (get.position(result.card, true) == "o") {
				var pos = event.positions.randomRemove();
				event._first_pos = pos;
				game.broadcastAll(
					function (card, id, player, pos) {
						lib.skill.yuuki_yicha.addCard(card, id, pos);
						lib.skill.yuuki_yicha.changePrompt(get.translation(player) + "放置了" + get.translation(card), id);
					},
					result.card,
					event.videoId,
					player,
					pos
				);
				cards.push(result.card);
				game.delay(2);
			}
			player.judge().set("callback", function () {
				event.getParent().orderingCards.remove(event.judgeResult.card);
				event.getParent(2).orderingCards.add(event.judgeResult.card);
			});
			"step 2";
			if (get.position(result.card, true) == "o") {
				var list = event.positions;
				if (get.isLuckyStar(player)) {
					var index = get.color(cards[0], false) == get.color(result.card, false) ? 0 : 1;
					list = list.filter(function (i) {
						return Math.abs((i % 2) - (event._first_pos % 2)) == index;
					});
				}
				var pos = list.randomRemove();
				game.broadcastAll(
					function (card, id, player, pos) {
						lib.skill.yuuki_yicha.addCard(card, id, pos);
						lib.skill.yuuki_yicha.changePrompt(get.translation(player) + "放置了" + get.translation(card), id);
					},
					result.card,
					event.videoId,
					player,
					pos
				);
				cards.push(result.card);
				game.delay(2);
			}
			if (cards.length) {
				event.count = 4;
			} else {
				game.broadcastAll("closeDialog", event.videoId);
				event.finish();
			}
			"step 3";
			event.count--;
			player.judge().set("callback", function () {
				event.getParent().orderingCards.remove(event.judgeResult.card);
				event.getParent(2).orderingCards.add(event.judgeResult.card);
			});
			"step 4";
			var card = result.card;
			event.card = card;
			var str = "请选择一个位置放置" + get.translation(card);
			if (player == game.me || player.isUnderControl()) {
				lib.skill.yuuki_yicha.changePrompt(str, event.videoId);
			} else if (player.isOnline()) {
				player.send(
					function (str, id) {
						lib.skill.yuuki_yicha.changePrompt(str, event.videoId);
					},
					str,
					id
				);
			}
			player
				.chooseButton()
				.set("dialog", event.videoId)
				.set("filterButton", function (button) {
					var posx = button.pos_x,
						posy = button.pos_y;
					var list = [],
						cards = ui.dialog.cards;
					for (var i of cards) {
						if (i.pos_x == posx && Math.abs(i.pos_y - posy) == 1) {
							list.push(i.link);
						}
						if (i.pos_y == posy && Math.abs(i.pos_x - posx) == 1) {
							list.push(i.link);
						}
					}
					if (list.length > 0) {
						var color = get.color(list[0], false);
						if (list.length > 1) {
							for (var i = 1; i < list.length; i++) {
								if (get.color(list[i]) != color) {
									return false;
								}
							}
						}
						return get.color(_status.event.card, false) != color;
					}
					return false;
				})
				.set("card", card);
			"step 5";
			if (result.bool) {
				cards.push(card);
				event.positions.remove(result.links[0]);
				game.broadcastAll(
					function (card, id, pos, player) {
						lib.skill.yuuki_yicha.addCard(card, id, pos);
						lib.skill.yuuki_yicha.changePrompt(get.translation(player) + "放置了" + get.translation(card), id);
					},
					card,
					event.videoId,
					result.links[0],
					player
				);
				game.delay(2);
			}
			if (event.count > 0) {
				event.goto(3);
			}
			"step 6";
			game.broadcastAll("closeDialog", event.videoId);
			player.chooseTarget("令一名角色获得" + get.translation(cards), true).set("ai", function (target) {
				return get.attitude(_status.event.player, target);
			});
			"step 7";
			if (result.bool && result.targets && result.targets.length) {
				var target = result.targets[0];
				player.line(target, "green");
				target.gain(cards, "gain2");
			}
		},
	},
	//库特莉亚芙卡
	kud_qiaoshou: {
		getList(event) {
			const bool = event.name == "phaseJieshu";
			const subtypes = bool ? ["equip2", "equip3"] : ["equip1", "equip4"];
			const list = bool ? ["rewrite_bagua", "rewrite_renwang", "rewrite_tengjia", "rewrite_baiyin"] : ["pyzhuren_heart", "pyzhuren_diamond", "pyzhuren_club", "pyzhuren_spade", "pyzhuren_shandian", "rewrite_zhuge"];
			return list
				.addArray(lib.inpile)
				.map(name => [get.subtype(name), "", name])
				.filter(([subtype]) => subtypes.includes(subtype));
		},
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			if (!get.info("kud_qiaoshou").getList(event).length) {
				return false;
			}
			return player.countCards("h") && !player.hasVCard(card => card.storage?.kud_qiaoshou, "e");
		},
		chooseButton: {
			dialog(event, player) {
				const list = get.info("kud_qiaoshou").getList(event);
				return ui.create.dialog("巧手：选择一种装备牌", [list, "vcard"], "hidden");
			},
			check(button) {
				const player = get.player();
				const name = button.link[2];
				if (get.subtype(name) == "equip4" || player.getEquip(name)) {
					return 0;
				}
				const sha = player.countCards("h", "sha");
				switch (name) {
					case "rewrite_zhuge":
						return sha - player.getCardUsable("sha");
					case "guding":
						if (
							sha > 0 &&
							game.hasPlayer(current => {
								return get.attitude(player, current) < 0 && !current.countCards("h") && player.canUse("sha", current) && get.effect(current, { name: "sha" }, player) > 0;
							})
						) {
							return 1.4 + Math.random();
						}
						return 0;
					case "guanshi":
						if (sha > 0) {
							return 0.7 + Math.random();
						}
						return 0;
					case "qinggang":
						if (sha > 0) {
							return 0.4 + Math.random();
						}
						return 0;
					case "zhuque":
						if (
							game.hasPlayer(function (current) {
								return get.attitude(player, current) < 0 && current.getEquip("tengjia") && get.effect(current, { name: "sha", nature: "fire" }, player) > 0;
							})
						) {
							return 1.2 + Math.random();
						}
						return 0;
					default:
						return 0;
				}
			},
			backup(links) {
				return {
					cardname: links[0][2],
					filterCard: true,
					discard: false,
					lose: false,
					delay: false,
					check(event, player) {
						return 6 - get.value(card);
					},
					async content(event, trigger, player) {
						const name = lib.skill.kud_qiaoshou_backup.cardname,
							card = {
								name,
								subtypes: [],
								storage: { kud_qiaoshou: true },
							};
						game.log(player, "声明了", "#y" + get.translation(name));
						player.$throw(event.cards);
						await game.delay(0, 300);
						await player.equip(get.autoViewAs(card, event.cards));
						player.addTempSkill("kud_qiaoshou_equip", { player: ["phaseUseEnd", "phaseZhunbeiBegin"] });
						await player.draw();
					},
					ai: { result: { player: 1 } },
				};
			},
			prompt(links) {
				return `选择一张手牌，将之视为${get.translation(links[0][2])}然后装备之`;
			},
		},
		group: "kud_qiaoshou_end",
		ai: {
			notemp: true,
			order: 5,
			result: { player: 1 },
		},
		subSkill: {
			end: {
				trigger: { player: "phaseJieshuBegin" },
				filter(event, player) {
					if (!get.info("kud_qiaoshou").getList(event).length) {
						return false;
					}
					return player.countCards("h") && !player.hasVCard(card => card.storage?.kud_qiaoshou, "e");
				},
				async cost(event, trigger, player) {
					const list = get.info("kud_qiaoshou").getList(trigger);
					if (!list.length) {
						return;
					}
					let result;
					result = await player
						.chooseButton([get.prompt("kud_qiaoshou"), [list, "vcard"]])
						.set("ai", button => {
							const player = get.player();
							const name = button.link[2];
							if (get.subtype(name) == "equip3" || player.getEquip(name)) {
								return false;
							}
							switch (name) {
								case "yexingyi":
									if (player.hp > 2 || player.getEquip("bagua") || player.getEquip("tengjia")) {
										return 1.5 + Math.random();
									}
									return 0.5 + Math.random();
								case "rewrite_bagua":
								case "rewrite_renwang":
									if (player.getEquip("bagua") || player.getEquip("tengjia") || player.getEquip("renwang")) {
										return Math.random();
									}
									return 1.2 + Math.random();
								case "rewrite_tengjia":
									if (player.getEquip("baiyin")) {
										return 1.3 + Math.random();
									}
									return Math.random();
								case "rewrite_baiyin":
									return 0.4 + Math.random();
								default:
									return 0;
							}
						})
						.forResult();
					if (!result?.bool || !result?.links?.length) {
						return;
					}
					const cardname = result.links[0][2];
					result = await player.chooseCard("h", `选择一张手牌，将之视为${get.translation(cardname)}然后装备之`).forResult();
					event.result = {
						bool: result?.bool,
						cards: result?.cards,
						cost_data: { cardname: cardname },
					};
				},
				async content(event, trigger, player) {
					const name = event.cost_data.cardname,
						card = {
							name,
							subtypes: [],
							storage: { kud_qiaoshou: true },
						};
					game.log(player, "声明了", "#y" + get.translation(name));
					player.$throw(event.cards);
					await game.delay(0, 300);
					await player.equip(get.autoViewAs(card, event.cards));
					player.addTempSkill("kud_qiaoshou_equip", { player: ["phaseUseEnd", "phaseZhunbeiBegin"] });
					await player.draw();
				},
			},
			backup: {},
			equip: {
				charlotte: true,
				onremove(player, skill) {
					const cards = player.getCards("e", card => card[card.cardSymbol]?.storage?.kud_qiaoshou);
					if (cards.length) {
						player.loseToDiscardpile(cards);
					}
				},
				mark: true,
				intro: {
					markcount: "expansion",
					mark(dialog, storage, player) {
						const cards = player.getCards("e", card => card[card.cardSymbol]?.storage?.kud_qiaoshou);
						if (!cards.length) {
							return "无“巧”";
						} else {
							dialog.addText("当前装备");
							dialog.add(cards);
						}
					},
				},
			},
		},
	},
	kud_buhui: {
		enable: "chooseToUse",
		filter(event, player) {
			return event.type == "dying" && player == event.dying && player.countCards("e") > 0;
		},
		skillAnimation: true,
		limited: true,
		animationColor: "gray",
		async content(event, trigger, player) {
			player.awakenSkill(event.name);
			const cards = player.getCards("e");
			if (cards.length) {
				await player.discard(cards);
				await player.draw(cards.length);
			}
			player.addSkills("kud_chongzhen");
			await player.recoverTo(2);
		},
		derivation: "riki_chongzhen",
		ai: {
			order: 0.5,
			result: { player: 1 },
			save: true,
			skillTagFilter(player, tag, target) {
				return player == target;
			},
		},
	},
	kud_chongzhen: {
		inherit: "riki_chongzhen",
	},
	//神尾观铃
	misuzu_hengzhou: {
		trigger: {
			player: ["phaseJieshuBegin", "recoverEnd", "damageEnd", "phaseDrawBegin2", "phaseZhunbeiBegin"],
		},
		forced: true,
		character: true,
		filter(event, player) {
			if (event.name == "phaseZhunbei") {
				return true;
			}
			if (["damage", "recover"].includes(event.name)) {
				return event.num > 0;
			}
			var num = player.countMark("misuzu_hengzhou");
			if (event.name == "phaseDraw") {
				return num > 0 && !event.numFixed;
			}
			return num > 3;
		},
		content() {
			var num = player.countMark("misuzu_hengzhou");
			if (trigger.name == "phaseDraw") {
				trigger.num += num;
			} else if (trigger.name == "phaseJieshu") {
				player.removeMark("misuzu_hengzhou", num);
				player.loseHp();
			} else {
				player.addMark("misuzu_hengzhou", trigger.num || 1);
			}
		},
		intro: {
			name: "诅咒",
			name2: "诅咒",
			content: "mark",
		},
		marktext: "诅",
		mod: {
			maxHandcard(player, num) {
				return num + player.countMark("misuzu_hengzhou");
			},
		},
		ai: {
			notemp: true,
		},
	},
	misuzu_nongyin: {
		enable: "chooseToUse",
		viewAs: {
			name: "tao",
			isCard: true,
		},
		viewAsFilter(player) {
			return (
				!player.hasJudge("lebu") &&
				player.countCards("hes", function (card) {
					return get.color(card) == "red" && get.type(card, "trick") != "trick";
				})
			);
		},
		filterCard(card) {
			return get.color(card) == "red" && get.type(card, "trick") != "trick";
		},
		check(card) {
			return 7 + (_status.event.dying || _status.event.player).getDamagedHp() - get.value(card);
		},
		ignoreMod: true,
		position: "hes",
		log: false,
		precontent() {
			player.logSkill("misuzu_nongyin");
			player.$throw(event.result.cards);
			player.addJudge({ name: "lebu" }, event.result.cards);
			event.result.card.cards = [];
			event.result.cards = [];
			delete event.result.card.suit;
			delete event.result.card.number;
		},
		ai: { result: 0.5 },
	},
	misuzu_zhongxing: {
		trigger: {
			player: "loseAfter",
			global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"],
		},
		filter(event, player) {
			var evt = event.getl(player);
			return evt && evt.js && evt.js.length > 0 && !player.hasSkill("misuzu_zhongxing_haruko");
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt(event.skill), "令一名角色选择摸两张牌或回复1点体力")
				.set("ai", function (card) {
					return get.attitude(_status.event.player, card);
				})
				.forResult();
		},
		async content(event, trigger, player) {
			var target = event.targets[0];
			player.addTempSkill("misuzu_zhongxing_haruko");
			target.chooseDrawRecover(2, true);
		},
	},
	misuzu_zhongxing_haruko: { charlotte: true },
	//久岛鸥
	kamome_suitcase: {
		trigger: {
			player: ["phaseJudgeBefore", "phaseDiscardBefore", "turnOverBefore"],
		},
		forced: true,
		popup: false,
		equipSkill: true,
		content() {
			trigger.cancel();
		},
	},
	kamome_yangfan: {
		trigger: {
			player: ["loseAfter", "enterGame"],
			global: ["equipAfter", "addJudgeAfter", "phaseBefore", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"],
		},
		forced: true,
		filter(event, player) {
			if (typeof event.getl != "function") {
				return event.name != "phase" || game.phaseNumber == 0;
			}
			var evt = event.getl(player);
			return evt && evt.player == player && evt.es && evt.es.length;
		},
		content() {
			if (trigger.getl) {
				player.draw(2 * trigger.getl(player).es.length);
			} else {
				player.equip(game.createCard2("kamome_suitcase", "spade", 1));
			}
		},
		ai: {
			noe: true,
			reverseEquip: true,
			effect: {
				target(card, player, target, current) {
					if (get.type(card) == "equip" && !get.cardtag(card, "gifts")) {
						return [1, 3];
					}
				},
			},
		},
	},
	kamome_huanmeng: {
		trigger: { player: "phaseZhunbeiBegin" },
		frequent: true,
		content() {
			"step 0";
			var num = 1 + player.countCards("e");
			var cards = get.cards(num);
			game.cardsGotoOrdering(cards);
			var next = player.chooseToMove();
			next.set("list", [["牌堆顶", cards], ["牌堆底"]]);
			next.set("prompt", "幻梦：点击或拖动将牌移动到牌堆顶或牌堆底");
			next.processAI = function (list) {
				var cards = list[0][1],
					player = _status.event.player;
				var top = [];
				var judges = player.getCards("j");
				var stopped = false;
				if (!player.hasWuxie()) {
					for (var i = 0; i < judges.length; i++) {
						var judge = get.judge(judges[i]);
						cards.sort(function (a, b) {
							return judge(b) - judge(a);
						});
						if (judge(cards[0]) < 0) {
							stopped = true;
							break;
						} else {
							top.unshift(cards.shift());
						}
					}
				}
				var bottom;
				if (!stopped) {
					cards.sort(function (a, b) {
						return get.value(b, player) - get.value(a, player);
					});
					while (cards.length) {
						if (get.value(cards[0], player) <= 5) {
							break;
						}
						top.unshift(cards.shift());
					}
				}
				bottom = cards;
				return [top, bottom];
			};
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
			player.popup(get.cnNumber(top.length) + "上" + get.cnNumber(bottom.length) + "下");
			game.log(player, "将" + get.cnNumber(top.length) + "张牌置于牌堆顶");
			game.updateRoundNumber();
			game.delayx();
		},
		ai: {
			threaten: 1.2,
		},
	},
	kamome_jieban: {
		trigger: {
			player: "damageEnd",
			source: "damageSource",
		},
		zhuanhuanji: true,
		marktext: "☯",
		mark: true,
		intro: {
			content(storage, player) {
				return "转换技。每回合限一次，当你受到或造成伤害后，" + (!storage ? "你可将两张牌交给一名其他角色，然后其交给你一张牌。" : "你可将一张牌交给一名其他角色，然后其交给你两张牌。");
			},
		},
		filter(event, player) {
			var num = player.storage.kamome_jieban ? 1 : 2;
			return player.countCards("he") >= num && !player.hasSkill("kamome_jieban_phase");
		},
		async cost(event, trigger, player) {
			event.num = player.storage.kamome_jieban ? 1 : 2;
			event.result = await player
				.chooseCardTarget({
					position: "he",
					filterCard: true,
					filterTarget: lib.filter.notMe,
					selectCard: event.num,
					prompt: get.prompt(event.skill),
					prompt2: event.num == 2 ? "将两张牌交给一名其他角色，然后其交给你一张牌。" : "将一张牌交给一名其他角色，然后其交给你两张牌。",
					ai1(card) {
						if (card.name == "du") {
							return 20;
						}
						var val = get.value(card);
						var player = _status.event.player;
						if (get.position(card) == "e") {
							if (val <= 0) {
								return 10;
							}
							return 10 / val;
						}
						return 6 - val;
					},
					ai2(target) {
						var player = _status.event.player;
						var att = get.attitude(player, target);
						if (ui.selected.cards[0].name == "du") {
							return -2 * att;
						}
						if (att > 0) {
							return 1.5 * att;
						}
						var num = get.select(_status.event.selectCard)[1];
						if (att < 0 && num == 1) {
							return -0.7 * att;
						}
						return att;
					},
				})
				.forResult();
		},
		content() {
			"step 0";
			event.num = player.storage.kamome_jieban ? 1 : 2;
			var target = targets[0];
			event.target = target;
			player.addTempSkill("kamome_jieban_phase");
			player.give(cards, target);
			player.changeZhuanhuanji("kamome_jieban");
			"step 1";
			var num = 3 - event.num;
			var hs = target.getCards("he");
			if (hs.length) {
				if (hs.length <= num) {
					event._result = { bool: true, cards: hs };
				} else {
					target.chooseCard("he", true, "交给" + get.translation(player) + get.cnNumber(num) + "张牌", num).set("ai", function (card) {
						var player = _status.event.player;
						var target = _status.event.getParent().player;
						if (get.attitude(player, target) > 0) {
							if (!target.hasShan("all") && card.name == "shan") {
								return 10;
							}
							if (get.type(card) == "equip" && !get.cardtag(card, "gifts") && target.hasUseTarget(card)) {
								return 10 - get.value(card);
							}
							return 6 - get.value(card);
						}
						return -get.value(card);
					});
				}
			} else {
				event.finish();
			}
			"step 2";
			target.give(result.cards, player);
		},
	},
	kamome_jieban_phase: { charlotte: true },
	//友利奈绪
	nao_duyin: {
		trigger: { global: "phaseBegin" },
		filter(event, player) {
			return event.player != player && (!player.storage.nao_duyin || !player.storage.nao_duyin.includes(event.player));
		},
		logTarget: "player",
		charlotte: true,
		check() {
			return false;
		},
		content() {
			"step 0";
			player.chooseToDiscard("he", "弃置一张牌，或将武将牌翻面").set("ai", function (card) {
				if (_status.event.player.isTurnedOver()) {
					return 0;
				}
				return 6 - get.value(card);
			});
			"step 1";
			if (!result.bool) {
				player.turnOver();
			}
			player.addTempSkill("nao_duyin2", { player: "phaseAfter" });
			if (!player.storage.nao_duyin) {
				player.storage.nao_duyin = [];
			}
			player.storage.nao_duyin.push(trigger.player);
			if (!player.storage.nao_duyin2) {
				player.storage.nao_duyin2 = [];
			}
			player.storage.nao_duyin2.push(trigger.player);
			player.markSkill("nao_duyin2");
		},
	},
	nao_duyin2: {
		intro: {
			content: "$不能使用牌指定你为目标，对$使用牌没有距离和次数限制",
		},
		mod: {
			targetEnabled(card, player, target) {
				if (target.storage.nao_duyin2 && target.storage.nao_duyin2.includes(player)) {
					return false;
				}
			},
			targetInRange(card, player, target) {
				if (player.storage.nao_duyin2 && player.storage.nao_duyin2.includes(target)) {
					return true;
				}
			},
		},
		trigger: { player: "useCardEnd" },
		firstDo: true,
		silent: true,
		onremove: true,
		filter(event, player) {
			if (player.storage.nao_duyin2) {
				for (var i of player.storage.nao_duyin2) {
					if (event.targets.includes(i)) {
						return true;
					}
				}
			}
			return false;
		},
		content() {
			if (trigger.addCount !== false) {
				trigger.addCount = false;
				var stat = player.getStat();
				if (stat && stat.card && stat.card[trigger.card.name]) {
					stat.card[trigger.card.name]--;
				}
			}
		},
	},
	nao_wanxin: {
		trigger: { global: "phaseEnd" },
		hasHistory(player) {
			return player.getHistory("damage").length > 0;
		},
		filter(event, player) {
			return game.hasPlayer(function (current) {
				return lib.skill.nao_wanxin.hasHistory(current);
			});
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt2(event.skill), function (card, player, target) {
					return _status.event.yuus.includes(target);
				})
				.set(
					"yuus",
					game.filterPlayer(function (current) {
						return lib.skill.nao_wanxin.hasHistory(current);
					})
				)
				.set("ai", function (target) {
					return get.attitude(_status.event.player, target);
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			await target.draw(2);
			await player.turnOver(false);
			await player.link(false);
			if (target == player) {
				return;
			}
			await target.turnOver(false);
			await target.link(false);
		},
	},
	nao_shouqing: {
		global: "nao_shouqing2",
	},
	nao_shouqing2: {
		enable: "phaseUse",
		viewAs() {
			return { name: "tao" };
		},
		filterCard(card) {
			return get.name(card, false) === "tao";
		},
		ignoreMod: true,
		filterTarget(card, player, target) {
			return target != player && target.isDamaged() && target.hasSkill("nao_shouqing");
		},
		selectTarget() {
			return game.countPlayer(function (current) {
				return lib.skill.nao_shouqing2.filterTarget(null, _status.event.player, current);
			}) > 1
				? 1
				: -1;
		},
		filter(event, player) {
			return (
				player.hasCard(card => get.name(card, false) === "tao", "hs") &&
				game.hasPlayer(function (current) {
					return lib.skill.nao_shouqing2.filterTarget(null, player, current);
				})
			);
		},
		filterOk() {
			return ui.selected.cards.length === 1 && ui.selected.targets.length === 1;
		},
		position: "hs",
		onuse(links, player) {
			player.addSkill("nao_shouqing3");
			player.addMark("nao_shouqing3", 1, false);
		},
		prompt() {
			var list = game.filterPlayer(function (current) {
				return lib.skill.nao_shouqing2.filterTarget(null, _status.event.player, current);
			});
			var str = "对" + get.translation(list);
			if (list.length > 1) {
				str += "中的一名角色";
			}
			str += "使用一张【桃】";
			return str;
		},
	},
	nao_shouqing3: {
		intro: {
			content: "手牌上限+#",
		},
		mod: {
			maxHandcard(player, num) {
				return num + player.countMark("nao_shouqing3");
			},
		},
		trigger: { player: "useCardAfter" },
		forced: true,
		popup: false,
		filter(event, player) {
			return event.skill == "nao_shouqing2";
		},
		content() {
			player.draw();
		},
	},
	//远野美凪&远野小满
	minagi_peiquan: {
		enable: "phaseUse",
		filter(event, player) {
			return player.hasCard(card => card.hasGaintag("minagi_tag"), "h");
		},
		filterCard(card) {
			return card.hasGaintag("minagi_tag");
		},
		position: "h",
		filterTarget: lib.filter.notMe,
		discard: false,
		lose: false,
		delay: false,
		locked: true,
		promptfunc: () => "出牌阶段，你可以赠予一张“米券”，然后执行一项本回合内未被选择过的效果：⒈对其造成1点伤害；⒉摸两张牌；⒊弃置其的两张牌；⒋亮出牌堆顶的一张牌，然后你可以使用之。",
		check: card => {
			const player = _status.event.player;
			return get.type(card) == "equip" && game.hasPlayer(current => player.canGift(card, current, true) && !current.refuseGifts(card, player) && get.effect(current, card, player, player) > 0) ? 2 : 1 + Math.random();
		},
		content() {
			"step 0";
			player.gift(cards, target);
			"step 1";
			var list = player.getStorage("minagi_peiquan_yukito");
			if (list.length >= 4) {
				event.finish();
			} else {
				var yukito = get.translation(target);
				player
					.chooseButton(
						[
							"配券：请选择一项执行",
							[
								[
									["damage", "选项一：对" + yukito + "造成1点伤害"],
									["draw", "选项二：摸两张牌"],
									["discard", "选项三：弃置" + yukito + "的两张牌"],
									["use", "选项四：亮出牌堆顶的一张牌，然后可以使用之"],
								],
								"textbutton",
							],
						],
						true
					)
					.set("list", list)
					.set("filterButton", function (button) {
						return !_status.event.list.includes(button.link);
					})
					.set("ai", function (button) {
						var player = _status.event.player,
							target = _status.event.getParent().target;
						switch (button.link) {
							case "damage":
								return get.damageEffect(target, player, player);
							case "draw":
								return 2 * get.effect(player, { name: "draw" }, player, player);
							case "discard":
								return get.effect(target, { name: "guohe_copy2" }, player, player) * Math.min(1.6, target.countCards("he"));
							case "use":
								return _status.event.getRand("minagi_peiquan") * 4;
						}
					});
			}
			"step 2";
			player.markAuto("minagi_peiquan_yukito", result.links);
			player.addTempSkill("minagi_peiquan_yukito");
			switch (result.links[0]) {
				case "damage":
					target.damage("nocard");
					break;
				case "draw":
					player.draw(2);
					break;
				case "discard":
					player.discardPlayerCard(target, 2, "he", true);
					break;
			}
			if (result.links[0] != "use") {
				event.finish();
			}
			"step 3";
			var card = get.cards()[0];
			game.cardsGotoOrdering(card);
			player.showCards(card);
			player.chooseUseTarget(card, "是否使用" + get.translation(card) + "？");
		},
		ai: {
			order: 4,
			result: {
				player: (player, target) => {
					const giftEffects = ui.selected.cards.map(value => player.getGiftEffect(value, target));
					const baseEffect = Math.min(3, giftEffects.reduce((previousValue, currentValue) => previousValue + currentValue, 0) / giftEffects.length);
					const choices = ["damage", "draw", "discard", "use"];
					choices.removeArray(player.getStorage("minagi_peiquan_yukito"));
					if (choices.length <= 0) {
						return baseEffect;
					}
					return (
						baseEffect +
						Math.max(
							...choices.map(choice => {
								switch (choice) {
									case "damage":
										return get.damageEffect(target, player, player);
									case "draw":
										return 2 * get.effect(player, { name: "draw" }, player, player);
									case "discard":
										return get.effect(target, { name: "guohe_copy2" }, player, player) * Math.min(1.6, target.countCards("he"));
									case "use":
										return _status.event.getRand("minagi_peiquan") * 4;
								}
							})
						)
					);
				},
			},
		},
		group: "minagi_peiquan_umareta",
		subSkill: {
			yukito: { charlotte: true, onremove: true },
			umareta: {
				trigger: {
					global: "phaseBefore",
					player: "enterGame",
				},
				forced: true,
				filter(event, player) {
					return (event.name != "phase" || game.phaseNumber == 0) && player.countCards("h") > 0;
				},
				content() {
					var hs = player.getCards("h");
					player.addGaintag(hs, "minagi_tag");
				},
			},
		},
	},
	minagi_huanliu: {
		trigger: { player: "phaseZhunbeiBegin" },
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(lib.filter.notMe, get.prompt(event.skill), "和一名其他角色进行“协力”，并获得“远野小满”的所有对应技能")
				.set("ai", function (target) {
					return get.threaten(target) * Math.sqrt(1 + target.countCards("h")) * (target.isTurnedOver() || target.hasJudge("lebu") ? 0.1 : 1);
				})
				.forResult();
		},
		content() {
			"step 0";
			var target = targets[0];
			player.chooseCooperationFor(target, "minagi_huanliu").set("ai", function (button) {
				var base = 0;
				switch (button.link) {
					case "cooperation_damage":
						base = 0.1;
						break;
					case "cooperation_draw":
						base = 0.6;
						break;
					case "cooperation_discard":
						base = 0.1;
						break;
					case "cooperation_use":
						base = 0.3;
						break;
				}
				return base + Math.random();
			});
			player.addAdditionalSkill("cooperation", ["minagi_huanliu_effect", "michiru_sheyuan"]);
			"step 1";
			game.delayx();
		},
		subSkill: {
			effect: {
				charlotte: true,
				trigger: { global: "phaseJieshuBegin" },
				forced: true,
				logTarget: "player",
				filter(event, player) {
					return player.checkCooperationStatus(event.player, "minagi_huanliu") && player.countCards("h") > 0;
				},
				content() {
					game.log(player, "和", trigger.player, "的协力成功");
					var hs = player.getCards("h");
					player.addGaintag(hs, "minagi_tag");
					game.delayx();
				},
			},
		},
		derivation: "michiru_sheyuan",
	},
	michiru_sheyuan: {
		charlotte: true,
		enable: "chooseToUse",
		filter(event, player) {
			if (player.hasSkill("michiru_sheyuan_round")) {
				return false;
			}
			var hs = player.getCards("h");
			if (!hs.length) {
				return false;
			}
			for (var i of hs) {
				if (i.hasGaintag("minagi_tag")) {
					return false;
				}
				if (!game.checkMod(i, player, "unchanged", "cardEnabled2", player)) {
					return false;
				}
			}
			for (var name of lib.inpile) {
				var type = get.type(name);
				if (type != "basic" && type != "trick") {
					return false;
				}
				var card = get.autoViewAs({ name: name }, hs);
				if (event.filterCard(card, player, event)) {
					return true;
				}
				if (name == "sha") {
					for (var nature of lib.inpile_nature) {
						card.nature = nature;
						if (event.filterCard(card, player, event)) {
							return true;
						}
					}
				}
			}
			return false;
		},
		hiddenCard(player, name) {
			var type = get.type(name);
			if (type != "basic" && type != "trick") {
				return false;
			}
			if (player.hasSkill("michiru_sheyuan_round")) {
				return false;
			}
			var hs = player.getCards("h");
			if (!hs.length) {
				return false;
			}
			if (_status.connectMode) {
				return true;
			}
			for (var i of hs) {
				if (i.hasGaintag("minagi_tag")) {
					return false;
				}
				if (!game.checkMod(i, player, "unchanged", "cardEnabled2", player)) {
					return false;
				}
			}
			return true;
		},
		chooseButton: {
			dialog(event, player) {
				var list = [],
					hs = player.getCards("h");
				for (var name of lib.inpile) {
					var type = get.type(name);
					if (type != "basic" && type != "trick") {
						continue;
					}
					var card = get.autoViewAs({ name: name }, hs);
					if (event.filterCard(card, player, event)) {
						list.push([type, "", name]);
					}
					if (name == "sha") {
						for (var nature of lib.inpile_nature) {
							card.nature = nature;
							if (event.filterCard(card, player, event)) {
								list.push([type, "", name, nature]);
							}
						}
					}
				}
				return ui.create.dialog("舍愿", [list, "vcard"], "hidden");
			},
			check(button) {
				var player = _status.event.player;
				var card = {
					name: button.link[2],
					nature: button.link[3],
				};
				if (_status.event.getParent().type == "phase") {
					return player.getUseValue(card, null, true);
				}
				return 1;
			},
			backup(links, player) {
				return {
					viewAs: {
						name: links[0][2],
						nature: links[0][3],
					},
					filterCard: true,
					position: "h",
					selectCard: -1,
					onuse(result, player) {
						player.addTempSkill("michiru_sheyuan_round", "roundStart");
					},
				};
			},
			prompt(links, player) {
				return "将所有手牌当做" + (get.translation(links[0][3]) || "") + get.translation(links[0][2]) + "使用，然后摸等量的牌";
			},
		},
		ai: {
			respondSha: true,
			respondShan: true,
			skillTagFilter(player, tag, arg) {
				return lib.skill.michiru_sheyuan.hiddenCard(player, "s" + tag.slice(8));
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
			round: {
				charlotte: true,
				trigger: { player: "useCardAfter" },
				forced: true,
				popup: false,
				filter(event, player) {
					return event.skill == "michiru_sheyuan_backup";
				},
				content() {
					player.draw(trigger.cards.length);
				},
			},
			backup: {},
		},
	},
	//坂上智代
	tomoyo_wuwei: {
		enable: ["chooseToUse", "chooseToRespond"],
		viewAs: { name: "sha" },
		viewAsFilter(player) {
			var storage = player.getStorage("tomoyo_wuwei_mark");
			return player.hasCard(function (card) {
				return !storage.includes(get.suit(card));
			}, "hs");
		},
		position: "hs",
		filterCard(card, player) {
			var storage = player.getStorage("tomoyo_wuwei_mark");
			return !storage.includes(get.suit(card));
		},
		check(card) {
			return 5 - get.value(card);
		},
		onuse(result, player) {
			player.markAuto("tomoyo_wuwei_mark", [get.suit(result.card, false)]);
			player.addTempSkill("tomoyo_wuwei_mark");
		},
		onrespond(event, player) {
			player.markAuto("tomoyo_wuwei_mark", [get.suit(event.card, false)]);
			player.addTempSkill("tomoyo_wuwei_mark");
		},
		group: "tomoyo_wuwei_combo",
		subSkill: {
			mark: {
				charlotte: true,
				onremove: true,
			},
			combo: {
				trigger: { global: "useCardAfter" },
				direct: true,
				//chooseToUse类技能暂时没办法改
				filter(event, player) {
					return event.card.name == "shan" && player.inRangeOf(event.player) && player.canUse("sha", event.player, false);
				},
				content() {
					player
						.chooseToUse(
							"武威：是否对" + get.translation(trigger.player) + "使用一张【杀】？",
							function (card, player, event) {
								if (get.name(card) != "sha") {
									return false;
								}
								return lib.filter.filterCard.apply(this, arguments);
							},
							trigger.player,
							-1
						)
						.set("addCount", false).logSkill = "tomoyo_wuwei_combo";
				},
			},
		},
	},
	tomoyo_zhengfeng: {
		dutySkill: true,
		trigger: { player: "phaseZhunbeiBegin" },
		filter(event, player) {
			return game.hasPlayer(current => player.inRange(current));
		},
		derivation: "tomoyo_changshi",
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt(event.skill), "令一名攻击范围内的角色进行判定。其于你的下回合开始前使用与判定结果颜色相同的牌时，你摸一张牌。", function (card, player, target) {
					return player.inRange(target);
				})
				.set("ai", function (target) {
					var player = _status.event.player;
					if (player.hp <= 1 && !player.countCards("h")) {
						return 0;
					}
					var hs = target.countCards("h"),
						thr = get.threaten(target);
					if (target.hasJudge("lebu")) {
						return 0;
					}
					return Math.sqrt(1 + hs) * Math.sqrt(Math.max(1, 1 + thr));
				})
				.forResult();
		},
		content() {
			"step 0";
			var target = targets[0];
			event.target = target;
			target.judge();
			"step 1";
			player.addTempSkill("tomoyo_zhengfeng_tomoyo", {
				player: "phaseBeginStart",
			});
			player.markAuto("tomoyo_zhengfeng_tomoyo", [
				{
					target: target,
					color: result.color,
				},
			]);
		},
		group: "tomoyo_zhengfeng_after",
		subSkill: {
			tomoyo: {
				charlotte: true,
				onremove: true,
				mod: {
					inRangeOf(source, player) {
						var list = player.getStorage("tomoyo_zhengfeng_tomoyo");
						for (var obj of list) {
							if (obj.target == source) {
								return true;
							}
						}
					},
				},
				trigger: { global: "useCard" },
				forced: true,
				filter(event, player) {
					var color = get.color(event.card);
					if (color == "none") {
						return false;
					}
					var list = player.getStorage("tomoyo_zhengfeng_tomoyo");
					for (var obj of list) {
						if (obj.target == event.player && color == obj.color) {
							return true;
						}
					}
					return false;
				},
				content() {
					player.draw();
				},
				intro: {
					mark(dialog, students, player) {
						if (!students || !students.length) {
							return "全校风纪良好！";
						}
						var str = "";
						for (var i of students) {
							if (str.length > 0) {
								str += "<br>";
							}
							str += get.translation(i.target);
							str += "：";
							str += get.translation(i.color);
						}
						dialog.addText(str);
					},
				},
			},
			after: {
				trigger: { player: "phaseJieshuBegin" },
				filter(event, player) {
					return !player.hasHistory("useSkill", function (evt) {
						return evt.skill == "tomoyo_zhengfeng";
					});
				},
				prompt: "整风：是否放弃使命？",
				prompt2: "你可以减1点体力上限并失去〖武威〗，摸两张牌并回复1点体力，然后获得技能〖长誓〗。",
				skillAnimation: true,
				animationColor: "gray",
				check(event, player) {
					return player.hp * 1.1 + player.countCards("h") < 3;
				},
				content() {
					"step 0";
					game.log(player, "放弃了身为学生会长的使命");
					player.awakenSkill("tomoyo_zhengfeng");
					player.loseMaxHp();
					"step 1";
					player.removeSkills("tomoyo_wuwei");
					"step 2";
					player.draw(2);
					player.recover();
					"step 3";
					player.addSkills("tomoyo_changshi");
				},
			},
		},
	},
	tomoyo_changshi: {
		trigger: {
			global: ["gainAfter", "loseAsyncAfter"],
		},
		forced: true,
		filter(event, player) {
			return game.hasPlayer(function (current) {
				return current != player && event.getg(current).length > 1 && player.inRangeOf(current);
			});
		},
		content() {
			player.draw();
		},
		group: "tomoyo_changshi_recover",
		subSkill: {
			recover: {
				trigger: { global: "recoverAfter" },
				forced: true,
				filter(event, player) {
					return event.player.isAlive() && player.inRangeOf(event.player);
				},
				content() {
					player.changeHujia(1);
				},
			},
		},
	},
	//天宫希优
	kiyu_yuling: {
		mod: {
			targetEnabled(card) {
				var info = get.info(card);
				if (!info || (info.type != "trick" && info.type != "delay")) {
					return;
				}
				if (info.range) {
					return false;
				}
			},
		},
		trigger: { target: "useCardToTargeted" },
		forced: true,
		charlotte: true,
		filter(event, player) {
			return event.card.name == "sha" && event.player.countCards("he") > 0;
		},
		logTarget: "player",
		content() {
			trigger.player.chooseToDiscard("he", true, get.distance(trigger.player, player));
		},
		ai: {
			threaten: 0.7,
			effect: {
				target_use(card, player, target, current) {
					if (card.name == "sha") {
						return 0.7;
					}
				},
			},
		},
	},
	kiyu_rexianyu: {
		trigger: { player: "phaseUseEnd" },
		charlotte: true,
		filter(event, player) {
			return (
				!player.hasSkill("kiyu_rexianyu_round", null, null, false) &&
				player.hasHistory("useCard", function (evt) {
					var type = get.type(evt.card);
					if (type != "basic" && type != "trick") {
						return false;
					}
					return evt.getParent("phaseUse") == event;
				})
			);
		},
		async cost(event, trigger, player) {
			const history = player.getHistory("useCard", function (evt) {
				var type = get.type(evt.card);
				if (type != "basic" && type != "trick") {
					return false;
				}
				return evt.getParent("phaseUse") == trigger;
			});
			const list = [];
			for (var i = 0; i < Math.min(history.length, 3); i++) {
				var card = history[i].card;
				list.push({ name: card.name, isCard: true });
				if (card.nature) {
					list[i].nature = card.nature;
				}
			}
			const { result } = await player
				.chooseTarget(get.prompt(event.skill), "将以下使用结果告知于一名其他角色：" + get.translation(list), function (card, player, target) {
					return target != player && !target.hasSkill("kiyu_rexianyu_lastrun", null, null, false);
				})
				.set("ai", function (target) {
					return get.attitude(_status.event.player, target) * get.threaten(target) * Math.sqrt(1 + target.countCards("h")) * (target.isTurnedOver() || target.hasJudge("lebu") ? 0.1 : 1);
				});
			if (result.bool) {
				event.result = {
					bool: result.bool,
					targets: result.targets,
					cost_data: { list },
				};
			}
		},
		async content(event, trigger, player) {
			player.addTempSkill("kiyu_rexianyu_round", "roundStart");
			const tabito = event.targets[0];
			tabito.storage.kiyu_rexianyu_lastrun = event.cost_data.list;
			tabito.storage.amamiya_kiyu = player;
			tabito.addTempSkill("kiyu_rexianyu_lastrun", {
				player: ["phaseUseAfter"],
				global: ["roundStart"],
			});
			await game.delayx();
		},
		subSkill: {
			round: { charlotte: true },
			lastrun: {
				enable: "chooseToUse",
				onChooseToUse(event) {
					if (!game.online && event.type == "phase") {
						var evtx = event.getParent();
						var num = event.player.getHistory("useCard", function (evt) {
							return evt.getParent("phaseUse") == evtx;
						}).length;
						event.set("rexianyu_num", num);
					}
				},
				filter(event, player) {
					if (!player.countCards("hs")) {
						return false;
					}
					var num = event.rexianyu_num,
						list = player.storage.kiyu_rexianyu_lastrun;
					if (!Array.isArray(list) || typeof num != "number" || list.length <= num) {
						return false;
					}
					var card = get.copy(list[num]);
					delete card.isCard;
					card = get.autoViewAs(card, "unsure");
					if (event.filterCard(card, player, event)) {
						return true;
					}
					return false;
				},
				onremove: true,
				viewAs(cards, player) {
					var num = _status.event.rexianyu_num,
						list = player.storage.kiyu_rexianyu_lastrun;
					if (!Array.isArray(list) || typeof num != "number" || list.length <= num) {
						return { name: "sha" };
					}
					var card = get.copy(list[num]);
					delete card.isCard;
					return card;
				},
				prompt() {
					var player = _status.event.player;
					var num = _status.event.rexianyu_num,
						list = player.storage.kiyu_rexianyu_lastrun;
					if (!Array.isArray(list) || typeof num != "number" || list.length <= num) {
						return "无可用牌";
					}
					var card = list[num];
					var str = "将一张牌当做" + get.translation(card);
					var kiyu = player.storage.amamiya_kiyu;
					if (kiyu && kiyu.isAlive()) {
						str += "；然后" + get.translation(kiyu) + "摸一张牌，且你本回合的手牌上限+1";
					}
					return str;
				},
				filterCard: true,
				position: "h",
				popname: true,
				check(card) {
					var player = _status.event.player;
					var num = _status.event.rexianyu_num,
						list = player.storage.kiyu_rexianyu_lastrun;
					return player.getUseValue(list[num], null, true) - player.getUseValue(card, null, true);
				},
				group: "kiyu_rexianyu_earthbound",
				mark: true,
				intro: { content: "已记录：$" },
				ai: {
					order: 12,
					result: {
						player(player) {
							var lunarq = player.storage.amamiya_kiyu;
							if (lunarq && get.attitude(player, lunarq) <= 0) {
								return -1;
							}
							return 1;
						},
					},
				},
			},
			earthbound: {
				trigger: { player: "useCardAfter" },
				forced: true,
				charlotte: true,
				filter(event, player) {
					if (event.skill != "kiyu_rexianyu_lastrun") {
						return false;
					}
					var lunarq = player.storage.amamiya_kiyu;
					return get.itemtype(lunarq) == "player" && lunarq.isAlive();
				},
				content() {
					var lunarq = player.storage.amamiya_kiyu;
					lunarq.draw();
					player.addTempSkill("kiyu_rexianyu_wolf");
					player.addMark("kiyu_rexianyu_wolf", 1, false);
				},
			},
			wolf: {
				charlotte: true,
				onremove: true,
				mod: {
					maxHandcard(player, num) {
						return num + player.countMark("kiyu_rexianyu_wolf");
					},
				},
				markimage: "image/card/handcard.png",
				intro: { content: "手牌上限+#" },
			},
		},
	},
	//樱庭星罗
	seira_xinghui: {
		trigger: { player: "phaseZhunbeiBegin" },
		check(event, player) {
			return !player.getExpansions("seira_xinghui").length;
		},
		content() {
			"step 0";
			game.delayx();
			"step 1";
			if (get.isLuckyStar(player)) {
				event.num = 6;
				player.throwDice(6);
			} else {
				player.throwDice();
			}
			"step 2";
			var cards = get.cards(num);
			event.cards = cards;
			game.cardsGotoOrdering(cards);
			var next = player.chooseToMove();
			next.set("prompt", "星辉：选择要作为“星屑”的牌（先选择的在上）");
			next.set("list", [["置于武将牌上", cards], ["置入弃牌堆"]]);
			next.processAI = function (list) {
				var cards = list[0][1],
					player = _status.event.player;
				var top = [];
				var judges = player.getCards("j");
				var stopped = false;
				if (!player.hasWuxie()) {
					for (var i = 0; i < judges.length; i++) {
						var judge = get.judge(judges[i]);
						cards.sort(function (a, b) {
							return judge(b) - judge(a);
						});
						if (judge(cards[0]) < 0) {
							stopped = true;
							break;
						} else {
							top.unshift(cards.shift());
						}
					}
				}
				var bottom;
				if (!stopped) {
					cards.sort(function (a, b) {
						return get.value(b, player) - get.value(a, player);
					});
					while (cards.length) {
						if (get.value(cards[0], player) <= 5) {
							break;
						}
						top.unshift(cards.shift());
					}
				}
				bottom = cards;
				return [top, bottom];
			};
			"step 3";
			if (result.bool && result.moved && result.moved[0].length) {
				event.cards = result.moved[0];
				player
					.chooseTarget(true, "将以下牌置于一名角色的武将牌上", get.translation(event.cards), function (card, player, target) {
						return !target.getExpansions("seira_xinghui").length;
					})
					.set("ai", function (target) {
						return target == _status.event.player ? 1 : 0;
					});
				event.cards.reverse();
			} else {
				event.finish();
			}
			"step 4";
			var target = result.targets[0];
			player.line(target, { color: [253, 153, 182] });
			target.addToExpansion(cards).gaintag.add("seira_xinghui");
			game.log(player, "将" + get.cnNumber(cards.length) + "张牌置于", target, "的武将牌上");
			target.addSkill("seira_xinghui_hoshikuzu");
		},
		intro: {
			markcount: "expansion",
			content(storage, player) {
				return "共有" + get.cnNumber(player.getExpansions("seira_xinghui").length) + "张牌";
			},
			onunmark(storage, player) {
				player.removeSkill("seira_xinghui_hoshikuzu");
			},
		},
		subSkill: {
			hoshikuzu: {
				trigger: { source: "damageBegin1" },
				forced: true,
				charlotte: true,
				filter(event, player) {
					return player.getExpansions("seira_xinghui").length > 0;
				},
				content() {
					trigger.num++;
					game.log(player, "造成了", "#y暴击伤害");
				},
				group: ["seira_xinghui_draw", "seira_xinghui_judge"],
			},
			draw: {
				trigger: { player: "drawBefore" },
				forced: true,
				filter(event, player) {
					return player.getExpansions("seira_xinghui").length > 0;
				},
				content() {
					var cards = player.getExpansions("seira_xinghui");
					var num = Math.min(cards.length, trigger.num);
					trigger.num -= num;
					player.gain(cards.slice(0, num), "draw");
					if (trigger.num == 0) {
						trigger.cancel();
					}
				},
			},
			judge: {
				trigger: { player: "judgeBegin" },
				forced: true,
				filter(event, player) {
					return player.getExpansions("seira_xinghui").length > 0;
				},
				content() {
					trigger.directresult = player.getExpansions("seira_xinghui")[0];
				},
			},
		},
	},
	seira_yuanying: {
		enable: "phaseUse",
		usable: 1,
		filterTarget: true,
		selectTarget: 2,
		multitarget: true,
		multiline: true,
		line: { color: [253, 153, 182] },
		content() {
			game.filterPlayer()
				.sortBySeat()
				.forEach(function (current) {
					if (!targets.includes(current)) {
						current.removeSkills("seira_yinyuan");
					} else {
						current.addSkills("seira_yinyuan");
					}
				});
			game.delayx();
		},
		ai: {
			order: 1,
			result: { target: 1 },
			expose: 0.1,
		},
		derivation: "seira_yinyuan",
	},
	seira_yinyuan: {
		enable: "phaseUse",
		usable: 1,
		filterTarget(card, player, target) {
			return target != player && target.hasSkill("seira_yinyuan", null, null, false) && target.countCards("hej") > 0;
		},
		content() {
			player.gainPlayerCard(target, true, "hej");
			target.recover();
		},
		mark: true,
		intro: {
			content: "你的手牌对其他“姻缘者”可见。出牌阶段限一次，你可以获得一名其他“姻缘者”区域内的一张牌，然后其回复1点体力。",
		},
		ai: {
			order: 9,
			viewHandcard: true,
			skillTagFilter(player, tag, arg) {
				if (player == arg) {
					return false;
				}
				return player.hasSkill("seira_yinyuan") && arg.hasSkill("seira_yinyuan");
			},
			result: {
				player(player, target) {
					var effect = get.effect(target, { name: "shunshou_copy" }, player, player);
					if (target.isDamaged()) {
						if (effect < 0) {
							effect /= 2;
						}
						effect += get.recoverEffect(target, player, player);
					}
					return effect;
				},
			},
		},
	},
	//佐藤雏
	hina_shenshi: {
		groupSkill: "shen",
		trigger: { player: ["phaseUseBegin", "phaseUseEnd"] },
		frequent: true,
		filter(event, player) {
			return player.group == "shen";
		},
		content() {
			"step 0";
			player.draw(2).gaintag = ["hina_shenshi"];
			player.addSkill("hina_shenshi_yingbian");
			"step 1";
			var cards = player.getCards("h", function (card) {
				return card.hasGaintag("hina_shenshi");
			});
			if (!cards.length) {
				event.finish();
			} else if (cards.length == 1) {
				event._result = { bool: true, cards: cards };
			} else {
				player.chooseCard("h", true, "将一张“神视”牌置于牌堆顶", function (card) {
					return card.hasGaintag("hina_shenshi");
				});
			}
			"step 2";
			if (result.bool) {
				game.log(player, "将一张牌置于了牌堆顶");
				player.lose(result.cards, ui.cardPile, "insert");
				player.$throw(1, 1000);
			} else {
				event.finish();
			}
			"step 3";
			game.delayx();
		},
		onremove(player) {
			player.removeGaintag("hina_shenshi");
		},
		group: "hina_shenshi_yingbian",
	},
	hina_shenshi_yingbian: {
		trigger: { player: "yingbian" },
		forced: true,
		filter: (event, player) => event.card.isCard && player.hasHistory("lose", evt => evt.getParent() == event && Object.values(evt.gaintag_map).some(value => value.includes("hina_shenshi"))),
		content: () => {
			if (!Array.isArray(trigger.temporaryYingbian)) {
				trigger.temporaryYingbian = [];
			}
			trigger.temporaryYingbian.add("force");
			trigger.temporaryYingbian.addArray(get.yingbianEffects());
		},
	},
	hina_xingzhi: {
		groupSkill: "key",
		trigger: { player: "yingbian" },
		usable: 1,
		filter: (event, player) => player.group == "key" && !event.card.yingbian && lib.yingbian.condition.complex.has("zhuzhan"),
		content: () => {
			"step 0";
			trigger.yingbianZhuzhanAI = (player, card, source, targets) => cardx => {
				if (get.attitude(player, source) <= 0) {
					return 0;
				}
				var info = get.info(card),
					num = 0;
				if (info && info.ai && info.ai.yingbian) {
					var ai = info.ai.yingbian(card, source, targets, player);
					if (ai) {
						num = ai;
					}
				}
				return Math.max(num, 6) - get.value(cardx);
			};
			trigger.afterYingbianZhuzhan = event => event.zhuzhanresult.draw(2);
			lib.yingbian.condition.complex.get("zhuzhan")(trigger);
			"step 1";
			if (!result.bool) {
				return;
			}
			trigger.card.yingbian = true;
			lib.yingbian.effect.forEach(value => game.yingbianEffect(trigger, value));
			player.addTempSkill("yingbian_changeTarget");
		},
	},
	//神山识
	shiki_omusubi: {
		audio: 2,
		trigger: { global: "roundStart" },
		direct: true,
		content() {
			"step 0";
			player.chooseTarget(get.prompt2("shiki_omusubi"), lib.filter.notMe).set("ai", function (target) {
				var player = _status.event.player;
				if (player.isHealthy()) {
					return 0;
				}
				if (player.hp < 3 && player.getDamagedHp() < 2) {
					return 0;
				}
				var list = [];
				if (lib.character[target.name]) {
					list.addArray(lib.character[target.name][3]);
				}
				if (lib.character[target.name1]) {
					list.addArray(lib.character[target.name1][3]);
				}
				if (lib.character[target.name2]) {
					list.addArray(lib.character[target.name2][3]);
				}
				list = list.filter(function (i) {
					return !player.hasSkill(i);
				});
				if (!list.length) {
					return 0;
				}
				return 1 + Math.random();
			});
			"step 1";
			if (result.bool) {
				var target = result.targets[0];
				player.logSkill("shiki_omusubi", target);
				player.loseMaxHp();
				var list = [];
				if (lib.character[target.name]) {
					list.addArray(lib.character[target.name][3]);
				}
				if (lib.character[target.name1]) {
					list.addArray(lib.character[target.name1][3]);
				}
				if (lib.character[target.name2]) {
					list.addArray(lib.character[target.name2][3]);
				}
				player.addSkills(list);
				game.broadcastAll(function (list) {
					lib.character.key_shiki[3].addArray(list);
					game.expandSkills(list);
					for (var i of list) {
						var info = lib.skill[i];
						if (!info) {
							continue;
						}
						if (!info.audioname2) {
							info.audioname2 = {};
						}
						info.audioname2.key_shiki = "shiki_omusubi";
					}
				}, list);
			}
		},
	},
	//篝
	kagari_zongsi: {
		enable: "phaseUse",
		usable: 1,
		content() {
			"step 0";
			var controls = [];
			if (ui.cardPile.hasChildNodes()) {
				controls.push("选择牌堆中的一张牌");
			}
			if (ui.discardPile.hasChildNodes()) {
				controls.push("选择弃牌堆中的一张牌");
			}
			if (
				game.hasPlayer(function (current) {
					return current.countCards("hej") > 0;
				})
			) {
				controls.push("选择一名角色区域内的一张牌");
			}
			if (!controls.length) {
				event.finish();
				return;
			}
			event.controls = controls;
			var next = player.chooseControl();
			next.set("choiceList", controls);
			next.set("prompt", "请选择要移动的卡牌的来源");
			next.ai = function () {
				return 0;
			};
			"step 1";
			result.control = event.controls[result.index];
			var list = ["弃牌堆", "牌堆", "角色"];
			for (var i = 0; i < list.length; i++) {
				if (result.control.indexOf(list[i]) != -1) {
					event.index = i;
					break;
				}
			}
			if (event.index == 2) {
				player.chooseTarget("请选择要移动的卡牌的来源", true, function (card, kagari, target) {
					return target.countCards("hej") > 0;
				});
			} else {
				var source = ui[event.index == 0 ? "discardPile" : "cardPile"].childNodes;
				var list = [];
				for (var i = 0; i < source.length; i++) {
					list.push(source[i]);
				}
				if (event.index == 0) {
					list.reverse();
				}
				player.chooseButton(["请选择要移动的卡牌", list], true).ai = get.buttonValue;
			}
			"step 2";
			if (event.index == 2) {
				player.line(result.targets[0]);
				event.target1 = result.targets[0];
				player.choosePlayerCard(result.targets[0], true, "hej").set("visible", true);
			} else {
				event.card = result.links[0];
			}
			"step 3";
			if (event.index == 2) {
				event.card = result.cards[0];
			}
			var controls = ["将这张牌移动到牌堆的顶部或者底部", "将这张牌移动到弃牌堆的顶部或者底部", "将这张牌移动到一名角色对应的区域里"];
			event.controls = controls;
			var next = player.chooseControl();
			next.set("prompt", "要对" + get.translation(event.card) + "做什么呢？");
			next.set("choiceList", controls);
			next.ai = function () {
				return 2;
			};
			"step 4";
			result.control = event.controls[result.index];
			var list = ["弃牌堆", "牌堆", "角色"];
			for (var i = 0; i < list.length; i++) {
				if (result.control.indexOf(list[i]) != -1) {
					event.index2 = i;
					break;
				}
			}
			if (event.index2 == 2) {
				player.chooseTarget("要将" + get.translation(card) + "移动到哪一名角色的对应区域呢", true).ai = function (target) {
					return target == _status.event.player ? 1 : 0;
				};
			} else {
				player.chooseControl("顶部", "底部").set("prompt", "把" + get.translation(card) + "移动到" + (event.index2 == 0 ? "弃" : "") + "牌堆的...");
			}
			"step 5";
			if (event.index2 != 2) {
				event.way = result.control;
			} else {
				event.target2 = result.targets[0];
				var list = ["手牌区"];
				if (lib.card[card.name].type == "equip" && event.target2.canEquip(card)) {
					list.push("装备区");
				}
				if (lib.card[card.name].type == "delay" && !event.target2.isDisabledJudge() && !event.target2.hasJudge(card.name)) {
					list.push("判定区");
				}
				if (list.length == 1) {
					event._result = { control: list[0] };
				} else {
					player.chooseControl(list).set("prompt", "把" + get.translation(card) + "移动到" + get.translation(event.target2) + "的...").ai = function () {
						return 0;
					};
				}
			}
			"step 6";
			if (event.index2 != 2) {
				var node = ui[event.index2 == 0 ? "discardPile" : "cardPile"];
				if (event.target1) {
					var next = event.target1.lose(card, event.position);
					if (event.way == "顶部") {
						next.insert_card = true;
					}
				} else {
					if (event.way == "底部") {
						node.appendChild(card);
					} else {
						node.insertBefore(card, node.firstChild);
					}
				}
				game.updateRoundNumber();
				event.finish();
			} else {
				if (result.control == "手牌区") {
					var next = event.target2.gain(card);
					if (event.target1) {
						next.source = event.target1;
						next.animate = "giveAuto";
					} else {
						next.animate = "draw";
					}
				} else if (result.control == "装备区") {
					if (event.target1) {
						event.target1.$give(card, event.target2);
					}
					event.target2.equip(card);
				} else {
					if (event.target1) {
						event.target1.$give(card, event.target2);
					}
					event.target2.addJudge(card);
				}
			}
			"step 7";
			game.updateRoundNumber();
		},
		ai: {
			order: 10,
			result: { player: 1 },
		},
	},
	//伊吹风子
	fuuko_xingdiao: {
		trigger: {
			global: "phaseBefore",
			player: "enterGame",
		},
		forced: true,
		filter: event => {
			return event.name != "phase" || game.phaseNumber == 0;
		},
		content() {
			"step 0";
			player.drawTo(8);
			"step 1";
			var hs = player.getCards("h");
			if (hs.length > 0) {
				player.addShownCards(hs, "visible_fuuko_xingdiao");
			}
		},
		mod: {
			ignoredHandcard(card) {
				if (card.hasGaintag("visible_fuuko_xingdiao")) {
					return true;
				}
			},
			cardDiscardable(card, player, name) {
				if (name == "phaseDiscard" && card.hasGaintag("visible_fuuko_xingdiao")) {
					return false;
				}
			},
		},
		onremove: true,
		global: "fuuko_xingdiao_gain",
		subSkill: {
			gain: {
				enable: "phaseUse",
				filter: (event, player) => {
					return game.hasPlayer(current => lib.skill.fuuko_xingdiao_gain.filterTarget(null, player, current));
				},
				filterTarget: (card, player, target) => {
					return target != player && target.hasCard(card => card.hasGaintag("visible_fuuko_xingdiao"), "h") && !target.getStorage("fuuko_xingdiao").includes(player) && target.hasSkill("fuuko_xingdiao");
				},
				selectTarget: () => {
					const num = game.countPlayer(current => lib.skill.fuuko_xingdiao_gain.filterTarget(null, _status.event.player, current));
					return num > 1 ? 1 : -1;
				},
				content() {
					"step 0";
					target.markAuto("fuuko_xingdiao", [player]);
					var cards = target.getCards("h", card => card.hasGaintag("visible_fuuko_xingdiao"));
					if (!cards.length) {
						event.finish();
					} else if (cards.length == 1) {
						event._result = { bool: true, links: cards };
					} else {
						player.chooseButton(true, ["选择获得" + get.translation(target) + "的一张“星”", cards]);
					}
					"step 1";
					if (result.bool) {
						player.gain(result.links, target, "give");
						target.draw();
					}
				},
				ai: {
					order: 6,
					result: {
						target: 1,
					},
				},
			},
		},
	},
	fuuko_chuanyuan: {
		trigger: {
			player: "loseAfter",
			global: ["gainAfter", "equipAfter", "addJudgeAfter", "loseAsyncAfter", "addToExpansionAfter"],
		},
		forced: true,
		filter(event, player) {
			const evt = event.getl(player);
			if (!evt.hs.length) {
				return false;
			}
			for (let i in evt.gaintag_map) {
				if (evt.gaintag_map[i].includes("visible_fuuko_xingdiao")) {
					return true;
				}
			}
			return false;
		},
		content() {
			var evt = trigger.getl(player),
				gains = [],
				draws = 0;
			var map = evt.gaintag_map;
			var cards = evt.hs.filter(card => {
				return map[card.cardid] && map[card.cardid].includes("visible_fuuko_xingdiao");
			});
			cards.forEach(card => {
				var suit = get.suit(card, player),
					num = get.number(card, player);
				var card2 = get.cardPile2(function (card) {
					if (gains.includes(card)) {
						return false;
					}
					return get.suit(card, player) == suit && get.number(card, player) == num;
				});
				if (card2) {
					gains.push(card2);
				} else {
					draws++;
				}
			});
			if (gains.length) {
				player.gain(gains, "gain2").gaintag.add("fuuko_chuanyuan");
			}
			if (draws) {
				player.draw(draws).gaintag = ["fuuko_chuanyuan"];
			}
			player.addSkill("fuuko_chuanyuan_effect");
		},
		ai: {
			combo: "fuuko_xingdiao",
		},
		subSkill: {
			effect: {
				mod: {
					targetInRange(card) {
						if (!card.cards || !card.cards.length) {
							return;
						}
						for (var i of card.cards) {
							if (!i.hasGaintag("fuuko_chuanyuan")) {
								return;
							}
						}
						return true;
					},
					cardUsable(card) {
						if (!card.cards || !card.cards.length) {
							return;
						}
						for (var i of card.cards) {
							if (!i.hasGaintag("fuuko_chuanyuan")) {
								return;
							}
						}
						return Infinity;
					},
				},
				charlotte: true,
				trigger: { player: "useCard1" },
				forced: true,
				popup: false,
				firstDo: true,
				filter(event, player) {
					if (event.addCount === false) {
						return false;
					}
					return player.hasHistory("lose", evt => {
						const evtx = evt.relatedEvent || evt.getParent();
						if (evtx != event) {
							return false;
						}
						for (let i in evt.gaintag_map) {
							if (evt.gaintag_map[i].includes("fuuko_chuanyuan")) {
								return true;
							}
						}
					});
				},
				content() {
					trigger.addCount = false;
					player.getStat("card")[trigger.card.name]--;
				},
			},
		},
	},
	//伊莉雅
	iriya_yinji: {
		trigger: { player: "phaseUseBegin" },
		forced: true,
		filter(event, player) {
			return player.countCards("h") < 17;
		},
		content() {
			player.drawTo(17).gaintag = ["iriya_yinji_tag"];
			player.addSkill("iriya_yinji_tag");
		},
		subSkill: {
			tag: {
				charlotte: true,
				mod: {
					cardEnabled(card) {
						if (get.itemtype(card) == "card") {
							if (card.hasGaintag("iriya_yinji_tag")) {
								return false;
							}
						} else if (card.isCard && card.cards) {
							if (card.cards.some(card => card.hasGaintag("iriya_yinji_tag"))) {
								return false;
							}
						}
					},
					aiValue(player, card, num) {
						if (get.itemtype(card) == "card" && card.hasGaintag("iriya_yinji_tag")) {
							return num / 10000;
						}
					},
					aiUseful(player, card, num) {
						if (get.itemtype(card) == "card" && card.hasGaintag("iriya_yinji_tag")) {
							return num / 10000;
						}
					},
				},
			},
		},
	},
	iriya_haozhi: {
		enable: "phaseUse",
		filterCard: true,
		selectCard: [2, Infinity],
		promptfunc: () => "出牌阶段，你可以按照斗地主牌型弃置至少两张牌，且其他角色可以依次对其进行一轮响应。最后一名进行响应的角色可以根据对应牌型执行对应效果。",
		position: "he",
		getType(cards, player) {
			var nums = cards
					.map(card => {
						var num = get.number(card, player);
						if (num <= 2) {
							return num + 13;
						}
						return num;
					})
					.sort((a, b) => a - b),
				len = nums.length;
			if (len == 1) {
				return ["单张", nums[0], 1];
			}
			if (len == 2) {
				return nums[1] == nums[0] ? ["对子", nums[0], 1] : null;
			}
			var map = {};
			for (var i = 0; i < len; i++) {
				var count = get.numOf(nums, nums[i]);
				if (!map[count]) {
					map[count] = [];
				}
				map[count].push(nums[i]);
				i += count - 1;
			}
			if (len == 3) {
				if (map[3]) {
					return ["三张", nums[0], 1];
				}
				return null;
			}
			if (map[len]) {
				return ["炸弹", nums[0], length];
			}
			if (map[1]) {
				if (map[1].length == len && len > 4) {
					for (var i = 0; i < map[1].length - 1; i++) {
						if (map[1][i + 1] - map[1][i] != 1) {
							return null;
						}
						if (map[1][i + 1] == 15) {
							return null;
						}
					}
					return ["单顺", nums[0], len];
				} else if (map[1].length == 2 && map[4] && len == 6) {
					return ["四带二", map[4][0], 1];
				} else if (map[3] && map[1].length == map[3].length && len == map[1].length * 4) {
					if (map[3].length == 1) {
						return ["三带一", map[3][0], 1];
					}
					for (var i = 0; i < map[3].length - 1; i++) {
						if (map[3][i + 1] - map[3][i] != 1) {
							return null;
						}
					}
					return ["单带飞机", map[3][0], map[3].length];
				}
				return null;
			}
			if (map[2]) {
				if (map[2].length * 2 == len && len > 5) {
					for (var i = 0; i < map[2].length - 1; i++) {
						if (map[2][i + 1] - map[2][i] != 1) {
							return null;
						}
						if (map[2][i + 1] == 15) {
							return null;
						}
					}
					return ["双顺", nums[0], len];
				} else if (map[4] && len == 6) {
					return ["四带二", map[4][0], 1];
				} else if (map[3] && map[2].length == map[3].length && len == map[2].length * 5) {
					if (map[3].length == 1) {
						return ["三带二", map[3][0], 1];
					}
					for (var i = 0; i < map[3].length - 1; i++) {
						if (map[3][i + 1] - map[3][i] != 1) {
							return null;
						}
						if (map[3][i + 1] == 15) {
							return null;
						}
					}
					return ["双带飞机", map[3][0], map[3].length];
				}
				return null;
			}
			if (map[3]) {
				if (map[3].length * 3 == len && len > 5) {
					for (var i = 0; i < map[3].length - 1; i++) {
						if (map[3][i + 1] - map[3][i] != 1) {
							return null;
						}
						if (map[3][i + 1] == 15) {
							return null;
						}
					}
					return ["三顺", nums[0], len];
				}
				return null;
			}
			return null;
		},
		filterOk() {
			return Array.isArray(lib.skill.iriya_haozhi.getType(ui.selected.cards, _status.event.player));
		},
		check(card) {
			var player = _status.event.player;
			//收益都一样 多一牌不如少一牌
			var types = ["炸弹", "三顺", "单顺", "双顺", "三张", "对子"];
			var getNum = function (card, player) {
					var num = get.number(card, player);
					if (num <= 2) {
						return num + 13;
					}
					return num;
				},
				hasEnemy = game.hasPlayer(current => get.attitude(player, current) < 0);
			//所有手牌
			var nums = player
				.getCards("he", function (card) {
					return lib.filter.cardDiscardable(card, player);
				})
				.map(card => getNum(card, player));
			var numu = ui.selected.cards.map(card => getNum(card, player));
			var num = getNum(card, player);
			if (!_status.event._iriya_haozhi_type) {
				for (var type of types) {
					switch (type) {
						case "炸弹":
							if (!hasEnemy) {
								break;
							}
							for (var i of nums) {
								if (get.numOf(nums, i) >= 4) {
									_status.event._iriya_haozhi_type = "炸弹";
									break;
								}
							}
							break;
						case "三顺":
							if (!hasEnemy) {
								break;
							}
							for (var i of nums) {
								if (i < 14 && get.numOf(nums, i) >= 3 && get.numOf(nums, i + 1) >= 3) {
									_status.event._iriya_haozhi_type = "三顺";
									break;
								}
							}
							break;
						case "双顺":
							if (!hasEnemy) {
								break;
							}
							for (var i of nums) {
								if (i < 13 && get.numOf(nums, i) >= 2) {
									for (var j = 1; j < 3; j++) {
										if (get.numOf(nums, i + j) < 2) {
											break;
										}
										if (j == 2) {
											_status.event._iriya_haozhi_type = "双顺";
										}
									}
								}
							}
							break;
						case "单顺":
							if (!hasEnemy) {
								break;
							}
							for (var i of nums) {
								if (i < 11) {
									for (var j = 1; j < 5; j++) {
										if (!nums.includes(i + j)) {
											break;
										}
										if (j == 4) {
											_status.event._iriya_haozhi_type = "单顺";
										}
									}
								}
							}
							break;
						case "三张":
							if (!hasEnemy) {
								break;
							}
							for (var i of nums) {
								if (get.numOf(nums, i) >= 3) {
									_status.event._iriya_haozhi_type = "三张";
									break;
								}
							}
							break;
						case "对子":
							for (var i of nums) {
								if (get.numOf(nums, i) >= 2) {
									_status.event._iriya_haozhi_type = "对子";
									break;
								}
							}
							break;
					}
					if (_status.event._iriya_haozhi_type) {
						break;
					}
				}
				if (!_status.event._iriya_haozhi_type) {
					_status.event._iriya_haozhi_type = "要不起";
				}
			}
			if (_status.event._iriya_haozhi_type == "要不起") {
				return 0;
			}
			//复用响应AI
			if (!ui.selected.cards.length) {
				var count = get.numOf(nums, num);
				switch (_status.event._iriya_haozhi_type) {
					case "炸弹":
						if (count >= 4) {
							return 15;
						}
						break;
					case "对子":
						if (
							count > 1 &&
							player.hasCard(function (cardx) {
								return cardx != card && getNum(cardx, player) == num && cardx.hasGaintag("iriya_yinji_tag");
							}, "he")
						) {
							return 4 - get.value(card);
						}
						break;
					case "三张":
						if (count > 2) {
							return 8 - get.value(card);
						}
						break;
					case "单顺":
						if (num > 10) {
							return 0;
						}
						for (var i = 1; i < 5; i++) {
							if (get.numOf(nums, num + i) < 1) {
								return 0;
							}
						}
						return 9 - get.value(card);
					case "双顺":
						if (count < 2 || num > 12) {
							return 0;
						}
						for (var i = 1; i < 3; i++) {
							if (get.numOf(nums, num + i) < 2) {
								return 0;
							}
						}
						return 9 - get.value(card);
					case "三顺":
						if (count < 3 || num > 13) {
							return 0;
						}
						for (var i = 1; i < 2; i++) {
							if (get.numOf(nums, num + i) < 2) {
								return 0;
							}
						}
						return 12 - get.value(card);
				}
				return 0;
			} else {
				switch (_status.event._iriya_haozhi_type) {
					case "炸弹":
						if (numu.length >= 4) {
							return 0;
						}
						if (num == numu[0]) {
							return 15;
						}
						return 0;
					case "对子":
						if (numu.length >= 2) {
							return 0;
						}
						if (num == numu[0]) {
							return 3 - get.value(card);
						}
						return 0;
					case "三张":
						if (numu.length >= 3) {
							return 0;
						}
						if (num == numu[0]) {
							return 9 - get.value(card);
						}
						return 0;
					case "单顺":
					case "双顺":
					case "三顺":
						var map = {
								单顺: [5, 0],
								双顺: [3, 1],
								三顺: [2, 2],
							},
							len = map[_status.event._iriya_haozhi_type][0],
							addNum = map[_status.event._iriya_haozhi_type][1];
						if (numu.length >= len) {
							return 0;
						}
						var numt = numu[numu.length - 1] + (numu.length % (1 + addNum) == 0 ? 1 : 0);
						if (num == numt) {
							return 10 + addNum - get.value(card);
						}
						return 0;
				}
			}
		},
		//响应AI
		respondAI(card) {
			if (!_status.event.goon) {
				return 0;
			}
			var type = _status.event.type,
				player = _status.event.player;
			var getNum = function (card, player) {
					var num = get.number(card, player);
					if (num <= 2) {
						return num + 13;
					}
					return num;
				},
				nums = player
					.getCards("he", function (card) {
						return lib.filter.cardDiscardable(card, player, "iriya_haozhi");
					})
					.map(card => getNum(card, player));
			var num = getNum(card, player);
			if (!ui.selected.cards.length) {
				var count = get.numOf(nums, num);
				if (count >= 4 && (type[0] != "炸弹" || num > type[1] || count > type[2])) {
					return 15;
				}
				switch (type[0]) {
					case "对子":
						if (count > 1 && num > type[1]) {
							return 8 - get.value(card);
						}
						break;
					case "三张":
					case "三带一":
					case "三带二":
						if (count > 2 && num > type[1]) {
							return 9 - get.value(card);
						}
						break;
					case "单顺":
						if (num <= type[1] || num > 15 - type[2]) {
							return 0;
						}
						for (var i = 1; i < type[2]; i++) {
							if (get.numOf(nums, num + i) < 1) {
								return 0;
							}
						}
						return 10 - get.value(card);
					case "双顺":
						if (num <= type[1] || count < 2 || num > 15 - type[2] / 2) {
							return 0;
						}
						for (var i = 1; i < type[2] / 2; i++) {
							if (get.numOf(nums, num + i) < 2) {
								return 0;
							}
						}
						return 11 - get.value(card);
					case "三顺":
					case "单带飞机":
					case "双带飞机":
						var size = 3 + ["三顺", "单带飞机", "双带飞机"].indexOf(type[0]);
						if (num <= type[1] || count < 3 || num > 15 - type[2] / size) {
							return 0;
						}
						for (var i = 1; i < type[2] / size; i++) {
							if (get.numOf(nums, num + i) < 2) {
								return 0;
							}
						}
						return 12 - get.value(card);
				}
				return 0;
			} else {
				var numu = ui.selected.cards.map(card => getNum(card, player));
				var numx = numu[0];
				if (num == numx) {
					var count = get.numOf(nums, numx);
					if (count >= 4 && (type[0] != "炸弹" || num > type[1] || count > type[2]) && numu.length < (type[0] == "炸弹" ? type2 : 4)) {
						return 15;
					}
				}
				switch (type[0]) {
					case "对子":
						if (numu.length >= 2) {
							return 0;
						}
						if (num == numu[0]) {
							return 8 - get.value(card);
						}
						return 0;
					case "三张":
						if (numu.length >= 3) {
							return 0;
						}
						if (num == numu[0]) {
							return 9 - get.value(card);
						}
						return 0;
					case "三带一":
						if (numu.length == 3 || num == numu[0]) {
							return 9 - get.value(card);
						}
						return 0;
					case "三带二":
						if (numu.length >= 5) {
							return false;
						}
						if (numu.length == 3) {
							if (num == numu[0] || get.numOf(nums, num) < 2) {
								return 0;
							}
						} else if (numu.length == 4) {
							return num == numu[3] ? 9 - get.value(card) : 0;
						}
						if (num == numu[0]) {
							return 9 - get.value(card);
						}
						return 0;
					case "单顺":
					case "双顺":
					case "三顺":
						if (numu.length >= type[2]) {
							return 0;
						}
						var addNum = ["单顺", "双顺", "三顺"].indexOf(type[0]);
						var numt = numu[numu.length - 1] + (numu.length % (1 + addNum) == 0 ? 1 : 0);
						if (num == numt) {
							return 10 + addNum - get.value(card);
						}
						return 0;
					case "单带飞机":
						if (numu.length >= type[2]) {
							return 0;
						}
						var len = (type[2] / 4) * 3;
						if (numu.length < len) {
							var numt = numu[numu.length - 1] + (numu.length % 3 == 0 ? 1 : 0);
							if (num == numt) {
								return 12 - get.value(card);
							}
						} else {
							if (num >= numu[0] || num <= numu[len - 1]) {
								return 0;
							}
							return 12 - get.value(card);
						}
						return 0;
					case "双带飞机":
						if (numu.length >= type[2]) {
							return 0;
						}
						var len = (type[2] / 5) * 3;
						if (numu.length < len) {
							var numt = numu[numu.length - 1] + (numu.length % 3 == 0 ? 1 : 0);
							if (num == numt) {
								return 12 - get.value(card);
							}
						} else {
							if ((numu.length - len) % 2 == 0) {
								if (numu.includes(num) || get.numOf(nums, num) < 2) {
									return 0;
								}
								return 12 - get.value(card);
							} else {
								return num == numu[numu.length - 1] ? 12 - get.value(card) : 0;
							}
						}
						return 0;
				}
			}
		},
		content() {
			"step 0";
			var players = game.filterPlayer().sortBySeat(player.getNext());
			event.players = players;
			event.current = player;
			event.current_type = lib.skill.iriya_haozhi.getType(cards, player);
			event.current_cards = cards.slice(0);
			if (!event.current_type) {
				event.finish();
			}
			"step 1";
			var target = event.players.shift();
			if ((target != player || event.current != player) && target.isIn() && target.countCards("h") >= Math.min(cards.length, 4)) {
				event.target = target;
				target.addTempSkill("iriya_haozhi_temp", {
					global: ["discardBefore", "chooseToDiscardEnd", "phaseAfter"],
				});
				var trans = get.translation(event.current);
				var cardsn = (function (cards, player) {
					var getn = (card, player) => {
						var num = get.number(card, player);
						if (num <= 2) {
							return num + 13;
						}
						return num;
					};
					cards.sort(function (a, b) {
						var numa = getn(a, player),
							numb = getn(b, player);
						if (numa != numb) {
							return numa - numb;
						}
						return lib.suit.indexOf(get.suit(a, player) - get.suit(b, player));
					});
					var str = "";
					for (var i of cards) {
						str += ",";
						str += get.strNumber(get.number(i, player));
						str += get.translation(get.suit(i, player));
					}
					return str.slice(1);
				})(event.current_cards, event.current);
				var next = target.chooseToDiscard("是否响应" + trans + "的" + get.translation(event.current_type[0]) + "？", trans + "的牌组为" + cardsn + "。您此时可以点击“整理手牌”，将手牌按点数排序。", [2, Infinity], "he");
				next.set("type", event.current_type);
				next.set("filterOk", function () {
					var type = lib.skill.iriya_haozhi.getType(ui.selected.cards, _status.event.player);
					if (!type) {
						return false;
					}
					var ptype = _status.event.type;
					if (type[0] == "炸弹") {
						if (ptype[0] == "炸弹") {
							if (type[2] > ptype[2]) {
								return true;
							}
							return type[1] > ptype[1] && type[2] == ptype[2];
						}
						return true;
					}
					return type[0] == ptype[0] && type[2] == ptype[2] && type[1] > ptype[1];
				});
				next.set("goon", get.attitude(target, event.current) < 0);
				next.set("ai", lib.skill.iriya_haozhi.respondAI);
			} else if (event.players.length > 0) {
				event.redo();
			} else {
				event.goto(3);
			}
			"step 2";
			if (result.bool) {
				event.current = target;
				event.current_type = lib.skill.iriya_haozhi.getType(result.cards.slice(0), target);
				event.current_cards = result.cards.slice(0);
				if (!event.current_type) {
					event.finish();
				}
				event.current.addExpose(0.5);
			}
			if (event.players.length > 0) {
				event.goto(1);
			}
			"step 3";
			var current = event.current,
				type = 0;
			if (!current.isIn()) {
				return;
			}
			switch (event.current_type[0]) {
				case "对子":
					type = 1;
					break;
				case "三张":
				case "三带一":
				case "三带二":
					type = 2;
					break;
				case "单顺":
					type = 3;
					break;
				case "双顺":
					type = 4;
					break;
				case "三顺":
				case "单带飞机":
				case "双带飞机":
					type = 5;
					break;
				case "炸弹":
				case "四带二":
					type = 6;
					break;
			}
			/*if(type==2){
				current.addSkill('iriya_haozhi_extra');
				current.addMark('iriya_haozhi_extra',1,false);
			}
			else */
			if (type > 0) {
				var next = game.createEvent("iriya_haozhi_effect", false);
				next.player = current;
				next.setContent(lib.skill.iriya_haozhi["content" + type]);
			}
		},
		content1() {
			"step 0";
			player.chooseTarget([1, 2], "是否令至多两名角色各摸一张牌？").set("ai", function (target) {
				var player = _status.event.player,
					att = get.attitude(player, target);
				if (target.hasSkillTag("nogain")) {
					att /= 10;
				}
				return att;
			});
			"step 1";
			if (result.bool) {
				var targets = result.targets.sortBySeat();
				player.line(targets);
				game.asyncDraw(targets);
				game.delayex();
			}
		},
		content2() {
			"step 0";
			player
				.chooseTarget([1, 3], "是否弃置至多三名角色的各一张牌？", function (card, player, target) {
					return (
						target != player &&
						target.hasCard(function (card) {
							return lib.filter.canBeDiscarded(card, player, target);
						}, "he")
					);
				})
				.set("ai", function (target) {
					var player = _status.event.player;
					return get.effect(target, { name: "guohe_copy2" }, player, player);
				});
			"step 1";
			if (result.bool) {
				var targets = result.targets.sortBySeat();
				player.line(targets, "green");
				for (var target of targets) {
					player.discardPlayerCard(target, true, "he");
				}
			}
			"step 2";
			player.draw();
		},
		content3() {
			"step 0";
			event.count = 0;
			"step 1";
			var next = player
				.chooseTarget("是否弃置一名其他角色的一张牌？", function (card, player, target) {
					return (
						target != player &&
						target.hasCard(function (card) {
							return lib.filter.canBeDiscarded(card, player, target);
						}, "he")
					);
				})
				.set("ai", function (target) {
					var player = _status.event.player;
					return get.effect(target, { name: "guohe_copy2" }, player, player);
				});
			if (event.color) {
				next.set("prompt2", "若你弃置的牌为" + get.translation(event.color) + "，则你可以重复此流程");
			}
			"step 2";
			if (result.bool) {
				var target = result.targets[0];
				player.line(target, "fire");
				player.discardPlayerCard(target, true, "he");
			} else {
				event.goto(4);
			}
			"step 3";
			if (result.bool) {
				event.count++;
				var card = result.cards[0],
					color = get.color(card, false);
				if (!event.color) {
					event.color = color;
					event.goto(1);
				} else if (color == event.color) {
					event.goto(1);
				}
			}
			"step 4";
			if (event.count > 0) {
				player.draw(event.count);
			}
		},
		content4() {
			"step 0";
			event.count = 0;
			"step 1";
			var next = player
				.chooseTarget("是否获得一名其他角色的一张牌？", function (card, player, target) {
					return (
						target != player &&
						target.hasCard(function (card) {
							return lib.filter.canBeGained(card, player, target);
						}, "he")
					);
				})
				.set("ai", function (target) {
					var player = _status.event.player;
					return get.effect(target, { name: "shunshou_copy2" }, player, player);
				});
			if (event.color) {
				next.set("prompt2", "若你得到的牌为" + get.translation(event.color) + "，则你可以重复此流程");
			}
			"step 2";
			if (result.bool) {
				var target = result.targets[0];
				player.line(target, "fire");
				player.gainPlayerCard(target, true, "he");
			} else {
				event.goto(4);
			}
			"step 3";
			if (result.bool) {
				event.count++;
				var card = result.cards[0],
					color = get.color(card, false);
				if (!event.color) {
					event.color = color;
					event.goto(1);
				} else if (color == event.color) {
					event.goto(1);
				}
			}
			"step 4";
			if (event.count > 0) {
				player.recover(event.count);
			}
		},
		content5() {
			"step 0";
			player.chooseTarget([1, 3], "是否令至多三名其他角色翻面？", lib.filter.notMe).set("ai", function (target) {
				var player = _status.event.player,
					att = get.attitude(player, target);
				if (target.isTurnedOver()) {
					return 10 * att;
				}
				return -6 * att;
			});
			"step 1";
			if (result.bool) {
				var targets = result.targets.sortBySeat();
				player.line(targets, "thunder");
				event.targets = targets;
				for (var target of targets) {
					target.turnOver();
				}
			}
			"step 2";
			player
				.chooseTarget("是否对一名目标角色造成1点火属性伤害？", function (card, player, target) {
					return _status.event.getParent().targets.includes(target);
				})
				.set("ai", function (target) {
					var player = _status.event.player;
					return get.damageEffect(target, player, player, "fire");
				});
			"step 3";
			if (result.bool) {
				var target = result.targets[0];
				player.line(target, "fire");
				target.damage("fire");
			}
		},
		content6() {
			"step 0";
			player.chooseTarget("是否对一名其他角色进行核打击？", "你对该角色造成2点雷属性伤害，然后该角色翻面，弃置装备区内的所有牌和四张手牌。", lib.filter.notMe).set("ai", function (target) {
				var player = _status.event.player,
					att = get.attitude(player, target);
				if (target.isTurnedOver()) {
					return -6 * att * Math.sqrt(2 + target.countCards("he"));
				}
				return -att * Math.sqrt(2 + target.countCards("he"));
			});
			"step 1";
			if (result.bool) {
				var target = result.targets[0];
				event.target = target;
				player.line(target, "thunder");
				target.damage("thunder", 2);
				target.turnOver();
			} else {
				event.finish();
			}
			"step 2";
			var num = target.countCards("e");
			if (num > 0) {
				target.chooseToDiscard("e", true, num);
			}
			"step 3";
			var num = target.countCards("h");
			if (num > 0) {
				target.chooseToDiscard("h", true, Math.min(4, num));
			}
		},
		ai: {
			sortCardByNum: true,
			order: 13,
			result: {
				player: 1,
			},
		},
		subSkill: {
			extra: {
				charlotte: true,
				mod: {
					targetInRange: () => true,
					cardUsable: () => Infinity,
				},
				trigger: { player: "useCard2" },
				forced: true,
				onremove: true,
				content() {
					"step 0";
					var num = player.countMark("iriya_haozhi_extra");
					player.removeSkill("iriya_haozhi_extra");
					var card = trigger.card;
					if (trigger.addCount !== false) {
						trigger.addCount = false;
						var stat = player.getStat().card;
						if (stat[card.name] && stat[card.name] > 0) {
							stat[card.name]--;
						}
					}
					var info = get.info(card);
					if (info.allowMultiple == false) {
						event.finish();
					}
					if (trigger.targets && !info.multitarget) {
						if (
							game.hasPlayer(function (current) {
								return !trigger.targets.includes(current) && lib.filter.targetEnabled2(card, player, current);
							})
						) {
							var prompt2 = "为" + get.translation(card) + "增加" + (num > 1 ? "至多" : "") + get.cnNumber(num) + "个目标";
							player
								.chooseTarget(get.prompt("iriya_haozhi_extra"), [1, num], function (card, player, target) {
									var player = _status.event.player;
									return !_status.event.targets.includes(target) && lib.filter.targetEnabled2(_status.event.card, player, target);
								})
								.set("prompt2", prompt2)
								.set("ai", function (target) {
									var trigger = _status.event.getTrigger();
									var player = _status.event.player;
									return get.effect(target, trigger.card, player, player);
								})
								.set("card", trigger.card)
								.set("targets", trigger.targets);
						}
					}
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
						player.logSkill("iriya_haozhi_extra", event.targets);
						trigger.targets.addArray(event.targets);
					}
				},
				intro: {
					content: "使用下一张牌无距离和次数限制，且可以增加#个目标",
				},
			},
			temp: {
				ai: { sortCardByNum: true },
				charlotte: true,
			},
		},
	},
	//藏里见
	satomi_luodao: {
		trigger: { player: "useCardToPlayered" },
		logTarget: "target",
		filter(event, player) {
			return event.card.name == "sha" && event.target.countCards("h") > 0;
		},
		content() {
			"step 0";
			var target = trigger.target;
			event.target = target;
			target.showHandcards(get.translation(player) + "对" + get.translation(target) + "发动了【落刀】");
			"step 1";
			if (
				target.hasCard(function (card) {
					return get.name(card, target) == "shan";
				}, "h")
			) {
				player.discardPlayerCard(target, true, "h", "visible").set("filterButton", function (button) {
					return get.name(button.link) == "shan";
				});
			} else if (player.countCards("he") > 0) {
				player.chooseToDiscard("he", true);
			}
		},
	},
	satomi_daohai: {
		trigger: { player: "phaseJieshuBegin" },
		filter(event, player) {
			return (
				player.hasHistory("lose", function (evt) {
					return evt.type == "discard" && evt.cards2.length > 0;
				}) && player.hasUseTarget({ name: "wugu" })
			);
		},
		check(event, player) {
			return player.getUseValue({ name: "wugu" }) + player.getUseValue({ name: "lebu" }) > 0;
		},
		content() {
			"step 0";
			player.chooseUseTarget("wugu", true);
			"step 1";
			if (result.bool) {
				var cards = [];
				player.getHistory("gain", function (evt) {
					if (evt.getParent().name == "wugu" && evt.getParent(4) == event) {
						cards.addArray(evt.cards);
					}
				});
				cards = cards.filter(function (card) {
					return player.getCards("h").includes(card) && game.checkMod(card, player, "unchanged", "cardEnabled2", player);
				});
				if (cards.length) {
					player.chooseCardTarget({
						prompt: "是否将得到的牌当做【乐不思蜀】使用？",
						filterCard(card) {
							return _status.event.cards.includes(card);
						},
						cards: cards,
						filterTarget(card, player, target) {
							var card = get.autoViewAs({ name: "lebu" }, ui.selected.cards);
							return player.canUse(card, target);
						},
						ai1: () => 1,
						ai2(target) {
							var player = _status.event.player,
								card = get.autoViewAs({ name: "lebu" }, ui.selected.cards);
							return get.effect(target, { name: "lebu" }, player, player);
						},
					});
				} else {
					event.finish();
				}
			} else {
				event.finish();
			}
			"step 2";
			if (result.bool) {
				player.useCard({ name: "lebu" }, result.cards, result.targets[0]);
			}
		},
	},
	//苍井绘梨花
	erika_shisong: {
		trigger: { player: "useCard" },
		forced: true,
		charlotte: true,
		filter(event, player) {
			if (player != _status.currentPhase) {
				return false;
			}
			var index = player.getHistory("useCard").indexOf(event),
				history = player.actionHistory;
			for (var i = history.length - 2; i >= 0; i--) {
				if (history[i].isMe) {
					var evt = history[i].useCard[index];
					return evt && get.type2(evt.card) == get.type(event.card);
				}
			}
			return false;
		},
		content() {
			player.draw();
		},
		mod: {
			maxHandcard(player, num) {
				return num + player.hujia;
			},
		},
	},
	erika_yousheng: {
		init: player => {
			player.addSkill("erika_yousheng_mamori");
		},
		dutySkill: true,
		group: ["erika_yousheng_achieve", "erika_yousheng_fail"],
		trigger: { global: "useCardToTarget" },
		filter(event, player) {
			return player.getStorage("erika_yousheng").includes(event.target) && (event.card.name == "sha" || (get.type2(event.card, false) == "trick" && get.tag(event.card, "damage") > 0)) && player.countMark("erika_yousheng_ruka") + 1 <= player.countCards("he");
		},
		intro: {
			content: "已保护$",
		},
		async cost(event, trigger, player) {
			const num = player.countMark("erika_yousheng_ruka") + 1;
			event.result = await player.chooseToDiscard("he", num, get.prompt(event.skill, trigger.target), "弃置" + num + "张牌，并转移" + get.translation(trigger.card)).forResult();
		},
		async content(event, trigger, player) {
			player.discard(event.cards);
			var ruka = trigger.target,
				evt = trigger.getParent();
			evt.targets.remove(ruka);
			evt.triggeredTargets2.remove(ruka);
			evt.targets.push(player);
			evt.triggeredTargets2.push(player);
			player.addTempSkill("erika_yousheng_ruka");
			var str = "erika_yousheng_" + player.playerid;
			if (!evt[str]) {
				evt[str] = [];
			}
			evt[str].add(ruka);
		},
		subSkill: {
			achieve: {
				trigger: { player: "changeHujiaAfter" },
				forced: true,
				skillAnimation: "legend",
				animationColor: "water",
				filter(event, player) {
					return player.storage.erika_yousheng && event.num < 0 && !player.hujia;
				},
				content() {
					"step 0";
					player.awakenSkill("erika_yousheng");
					game.log(player, "成功完成使命");
					var list = [player];
					list.addArray(player.storage.erika_yousheng);
					list.sortBySeat();
					list = list.filter(function (current) {
						return current.isAlive();
					});
					player.line(list, "green");
					game.asyncDraw(list, 3);
					"step 1";
					game.delayx();
				},
			},
			fail: {
				trigger: { global: "damageEnd" },
				forced: true,
				filter(event, player) {
					return player.getStorage("erika_yousheng").includes(event.player) && event.card && (event.card.name == "sha" || (get.type2(event.card, false) == "trick" && get.tag(event.card, "damage") > 0));
				},
				content() {
					player.awakenSkill("erika_yousheng");
					game.log(player, "使命失败");
					var num = player.hujia;
					if (num > 0) {
						player.changeHujia(-num);
						player.chooseToDiscard(num, true, "he");
					}
				},
			},
			mamori: {
				trigger: { global: "roundStart" },
				skillAnimation: true,
				animationColor: "wood",
				async cost(event, trigger, player) {
					event.result = await player
						.chooseTarget(get.prompt("erika_yousheng"), [1, 2], lib.filter.notMe, "选择至多两名其他角色。你减2点体力上限并获得3点护甲。")
						.set("ai", function (ruka) {
							return -1;
						})
						.forResult();
				},
				async content(event, trigger, player) {
					player.awakenSkill(event.name);
					player.markAuto("erika_yousheng", event.targets);
					await player.loseMaxHp(2);
					await player.changeHujia(3);
				},
			},
			ruka: {
				trigger: { global: "useCardAfter" },
				charlotte: true,
				filter(event, player) {
					return event["erika_yousheng_" + player.playerid] && event.cards.filterInD().length > 0;
				},
				async cost(event, trigger, player) {
					event.result = await player
						.chooseTarget("是否令一名原目标角色获得" + get.translation(trigger.cards.filterInD()) + "？", function (card, player, target) {
							return _status.event.targets.includes(target);
						})
						.set("targets", trigger["erika_yousheng_" + player.playerid])
						.forResult();
				},
				async content(event, trigger, player) {
					const ruka = event.targets[0];
					player.line(ruka, "green");
					ruka.gain(trigger.cards.filterInD(), "gain2");
				},
			},
		},
	},
	//李映夏
	liyingxia_sanli: {
		trigger: { target: "useCardToTargeted" },
		forced: true,
		filter(event, player) {
			if (event.player == player || event.player != _status.currentPhase) {
				return false;
			}
			var index = event.player
				.getHistory("useCard", function (evt) {
					return evt.targets.includes(player);
				})
				.indexOf(event.getParent());
			if (index == 2) {
				return event.player.isIn() && player.countCards("he") > 0;
			}
			return index < 2 && index > -1;
		},
		logTarget: "player",
		content() {
			"step 0";
			var index = trigger.player
				.getHistory("useCard", function (evt) {
					return evt.targets.includes(player);
				})
				.indexOf(trigger.getParent());
			if (index == 2) {
				player.chooseCard("he", true, "三礼：交给" + get.translation(trigger.player) + "一张牌");
			} else {
				player.draw();
				event.finish();
			}
			"step 1";
			if (result.bool) {
				player.give(result.cards, trigger.player);
			}
		},
	},
	liyingxia_zhenjun: {
		trigger: { player: "phaseJieshuBegin" },
		filter(event, player) {
			return player.group == "key";
		},
		async cost(event, trigger, player) {
			const num =
				player.getHistory("useCard", function (evt) {
					return evt.card.name == "sha" || (get.type(evt.card) == "trick" && get.tag(evt.card, "damage") > 0);
				}).length + 1;
			event.result = await player
				.chooseTarget(get.prompt(event.skill), [1, num], "令至多" + get.cnNumber(num) + "名角色各摸一张牌")
				.set("ai", serafu => get.attitude(_status.event.player, serafu))
				.forResult();
		},
		groupSkill: "key",
		content() {
			targets.sortBySeat();
			game.asyncDraw(targets);
			for (var i of targets) {
				i.addTempSkill("liyingxia_zhenjun_enhance", {
					player: player == i ? "phaseJieshuBegin" : "phaseAfter",
				});
			}
			game.delayx();
		},
		subSkill: {
			enhance: {
				trigger: { source: "damageBegin1" },
				forced: true,
				charlotte: true,
				mark: true,
				filter: (event, player) => player == _status.currentPhase,
				intro: { content: "下回合首次造成的伤害+1" },
				content() {
					trigger.num++;
					player.removeSkill(event.name);
				},
			},
		},
	},
	liyingxia_wumai: {
		trigger: { global: "roundStart" },
		filter(event, player) {
			return player.group == "shu" && (player.getStorage("liyingxia_wumai").length < 4 || game.hasPlayer(current => current.isDamaged()));
		},
		async cost(event, trigger, player) {
			var list = lib.skill.liyingxia_wumai.derivation.slice(0);
			list.removeArray(player.getStorage("liyingxia_wumai"));
			if (list.length) {
				const { result } = await player.chooseControl(list, "cancel2").set("prompt", get.prompt(event.skill)).set("prompt2", "获得一个技能直到本轮结束");
				if (result.control !== "cancel2") {
					event.result = {
						bool: true,
						cost_data: {
							type: "addSkill",
							skill: result.control,
						},
					};
				}
			} else {
				const num = Math.min(
					3,
					game.countPlayer(current => current.isDamaged())
				);
				const { result } = await player.chooseBool(get.prompt(event.skill) + "（可摸" + get.cnNumber(num) + "张牌）");
				if (result.bool) {
					event.result = {
						bool: true,
						cost_data: {
							type: "drawCards",
							num,
						},
					};
				}
			}
		},
		groupSkill: "shu",
		async content(event, trigger, player) {
			const result = event.cost_data;
			if (result.type === "addSkill") {
				player.markAuto("liyingxia_wumai", [result.skill]);
				player.addTempSkills(result.skill, "roundStart");
			} else if (result.type === "drawCards") {
				player.draw(result.num);
			}
		},
		derivation: ["bazhen", "rejizhi", "reguanxing", "youlong"],
	},
	//雾岛佳乃
	kano_liezhen: {
		trigger: { player: "phaseJieshuBegin" },
		filter(event, player) {
			return player.getHistory("useCard").length > 0;
		},
		frequent: true,
		async cost(event, trigger, player) {
			var history = player.getHistory("useCard");
			if (history.length > 1) {
				var type = get.type2(history[0].card, false);
				for (var i = 1; i < history.length; i++) {
					if (get.type2(history[i].card, false) != type) {
						const result = await player
							.chooseButton(["列阵：是否视为使用其中一种牌？", [["kano_paibingbuzhen"].concat(get.zhinangs()), "vcard"]])
							.set("filterButton", function (button) {
								return _status.event.player.hasUseTarget({
									name: button.link[2],
									isCard: true,
								});
							})
							.set("ai", function (button) {
								return _status.event.player.getUseValue({
									name: button.link[2],
									isCard: true,
								});
							})
							.forResult();
						if (result.bool) {
							event.result = {
								bool: true,
								cost_data: {
									links: result.links,
								},
							};
						}
						return;
					}
				}
			}
			var str = _status.renku.length ? "获得仁库中的所有牌" : "摸两张牌";
			event.result = await player.chooseBool(get.prompt(event.skill), str).set("frequentSkill", event.skill).forResult();
		},
		async content(event, trigger, player) {
			const result = event.cost_data;
			if (!result || !result.links.length) {
				if (_status.renku.length) {
					const cards = _status.renku.slice(0);
					_status.renku.length = 0;
					game.updateRenku();
					await player.gain(cards, "gain2", "fromRenku");
				} else {
					player.draw(2);
				}
			} else {
				player.chooseUseTarget(result.links[0][2], true);
			}
		},
		init(player) {
			player.storage.renku = true;
		},
	},
	kano_poyu: {
		trigger: { target: "useCardToTargeted" },
		charlotte: true,
		filter(event, player) {
			return _status.renku.length > 0 && (event.card.name == "sha" || (get.type(event.card) == "trick" && get.tag(event.card, "damage") > 0));
		},
		check(trigger, player) {
			return get.effect(player, trigger.card, trigger.player, player) < 0;
		},
		content() {
			"step 0";
			player.judge();
			"step 1";
			var bool = false,
				type = get.type2(result.card.name);
			for (var i of _status.renku) {
				if (get.suit(i) == result.suit || get.type2(i) == type) {
					bool = true;
					break;
				}
			}
			if (bool) {
				player
					.chooseButton(["是否移去一张牌，令" + get.translation(trigger.card) + "对你无效？", _status.renku])
					.set("types", [result.suit, type])
					.set("filterButton", function (button) {
						var types = _status.event.types;
						return get.suit(button.link, false) == types[0] || get.type2(button.link, false) == types[1];
					})
					.set("ai", () => 1);
			} else {
				event.finish();
			}
			"step 2";
			if (result.bool) {
				var card = result.links[0];
				player.$throw(card, 1000);
				_status.renku.remove(card);
				game.cardsDiscard(card).fromRenku = true;
				game.log(player, "将", card, "置入了弃牌堆");
				trigger.excluded.add(player);
				game.updateRenku();
			}
		},
		init(player) {
			player.storage.renku = true;
		},
	},
	//藤川米亚
	mia_shihui: {
		trigger: { player: "phaseDrawBegin1" },
		forced: true,
		filter(event, player) {
			return !event.numFixed;
		},
		content() {
			trigger.changeToZero();
			var num = 0;
			all = player.getAllHistory();
			if (all.length > 1) {
				for (var i = all.length - 2; i >= 0; i--) {
					if (all[i].isMe) {
						for (var evt of all[i].lose) {
							if (evt.type == "discard") {
								num += evt.cards2.length;
							}
						}
						break;
					}
				}
			}
			player.draw(1 + num);
		},
		group: "mia_shihui_recover",
		subSkill: {
			recover: {
				trigger: { player: "phaseJieshuBegin" },
				forced: true,
				filter(event, player) {
					return player.isDamaged() || player.countCards("he") > 0;
				},
				content() {
					player.chooseToDiscard("he", true);
					player.recover();
				},
			},
		},
	},
	mia_qianmeng: {
		trigger: {
			global: "phaseBefore",
			player: "enterGame",
		},
		forced: true,
		locked: false,
		dutySkill: true,
		derivation: "mia_fengfa",
		filter(event, player) {
			return event.name != "phase" || game.phaseNumber == 0;
		},
		content() {
			"step 0";
			player.draw();
			"step 1";
			if (player.countCards("he") > 0) {
				player.chooseCard("he", true, "潜梦：选择一张牌置于牌堆中");
			} else {
				event.finish();
			}
			"step 2";
			if (result.bool) {
				var card = result.cards[0];
				player.storage.mia_qianmeng = card;
				player.$throw(card, 1000);
				player.lose(card, ui.cardPile).insert_index = function () {
					return ui.cardPile.childNodes[Math.ceil(ui.cardPile.childNodes.length / 2)];
				};
			} else {
				event.finish();
			}
			"step 3";
			game.delayx();
		},
		onremove: true,
		group: ["mia_qianmeng_achieve", "mia_qianmeng_fail"],
		subSkill: {
			achieve: {
				trigger: {
					global: ["gainAfter", "loseAsyncAfter"],
				},
				forced: true,
				filter(event, player) {
					var card = player.storage.mia_qianmeng;
					if (event.name == "gain") {
						var source = event.player,
							cards = event.getg(source);
						return cards.includes(card) && source.getCards("hejsx").includes(card);
					} else {
						if (event.type != "gain") {
							return false;
						}
						var owner = get.owner(card);
						return owner && event.getg(owner).includes(card);
					}
				},
				skillAnimation: true,
				animationColor: "key",
				content() {
					"step 0";
					game.log(player, "成功完成使命");
					player.awakenSkill("mia_qianmeng");
					var card = player.storage.mia_qianmeng,
						owner = get.owner(card);
					if (owner && owner != player) {
						owner.give(card, player);
					}
					"step 1";
					if (player.hp < player.maxHp) {
						player.recover(player.maxHp - player.hp);
					}
					player.changeSkills(["mia_fengfa"], ["mia_shihui"]);
				},
			},
			fail: {
				trigger: { player: "die" },
				forceDie: true,
				filter(event, player) {
					return get.itemtype(player.storage.mia_qianmeng) == "card";
				},
				async cost(event, trigger, player) {
					event.result = await player.chooseTarget(get.prompt("mia_qianmeng"), "令一名角色获得牌堆中所有点数为" + player.storage.mia_qianmeng.number + "的牌", lib.filter.notMe).forResult();
				},
				async content(event, trigger, player) {
					game.log(player, "使命失败");
					player.awakenSkill("mia_qianmeng");
					var target = event.targets[0];
					var num = player.storage.mia_qianmeng.number,
						suit = player.storage.mia_qianmeng.suit,
						cards = [];
					for (var i = 0; i < ui.cardPile.childNodes.length; i++) {
						var card = ui.cardPile.childNodes[i];
						if (card.number == num && card.suit == suit) {
							cards.push(card);
						}
					}
					if (cards.length) {
						await target.gain(cards, "gain2");
					}
				},
			},
		},
	},
	mia_fengfa: {
		trigger: { player: "phaseDrawBegin2" },
		forced: true,
		filter(event, player) {
			return !event.numFixed;
		},
		content() {
			var num = 0;
			all = player.getAllHistory();
			if (all.length > 1) {
				for (var i = all.length - 2; i >= 0; i--) {
					if (all[i].isMe) {
						num += all[i].useCard.length;
						break;
					}
				}
			}
			trigger.num += num;
		},
	},
	//一之濑琴美
	kotomi_qinji: {
		trigger: { player: "phaseUseBegin" },
		filter(event, player) {
			return player.hasUseTarget("wanjian");
		},
		//chooseUseTarget也不好改 先放着
		direct: true,
		content() {
			player.addTempSkill("kotomi_qinji2");
			player.chooseUseTarget({ name: "wanjian", isCard: true }, get.prompt("kotomi_qinji"), "视为使用一张【万箭齐发】").logSkill = "kotomi_qinji";
		},
	},
	kotomi_qinji2: {
		trigger: { source: "damageBefore" },
		forced: true,
		popup: false,
		filter(event, player) {
			return event.getParent().skill == "kotomi_qinji";
		},
		content() {
			trigger.cancel();
			trigger.player.loseHp(trigger.num);
		},
	},
	kotomi_chuanxiang: {
		global: "kotomi_chuanxiang2",
	},
	kotomi_chuanxiang2: {
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return !player.hasSkill("kotomi_chuanxiang") && player.countCards("e", lib.skill.kotomi_chuanxiang2.filterCard) > 0;
		},
		filterCard(card, player) {
			if (!player) {
				player = _status.event.player;
			}
			return game.hasPlayer(function (current) {
				return current != player && current.canEquip(card);
			});
		},
		position: "e",
		filterTarget(card, player, target) {
			return target != player && target.canEquip(ui.selected.cards[0]);
		},
		check(card) {
			if (get.value(card) <= 0) {
				return 10;
			}
			var player = _status.event.player;
			if (
				game.hasPlayer(function (current) {
					return current.hasSkill("kotomi_chuanxiang") && get.attitude(player, current) > 0;
				})
			) {
				var subtype = get.subtype(card, false);
				if (
					player.countCards("hs", function (cardx) {
						return get.type(cardx) == "equip" && get.subtype(cardx, false) == subtype && player.canUse(cardx, player) && get.effect(player, cardx, player, player) > 0;
					})
				) {
					return 8;
				}
				return 7 / Math.max(1, get.value(card));
			}
			return 0;
		},
		promptfunc() {
			var players = game.filterPlayer(function (current) {
				return current.hasSkill("kotomi_chuanxiang");
			});
			return "将一张装备牌传给其他角色，然后令" + get.translation(players) + "摸一张牌。若传给该角色，则其改为摸两张牌。";
		},
		prepare: "give",
		discard: false,
		lose: false,
		content() {
			"step 0";
			target.equip(cards[0]);
			var list = game.filterPlayer(function (current) {
				return current.hasSkill("kotomi_chuanxiang");
			});
			game.asyncDraw(list, function (targetx) {
				return targetx == target ? 2 : 1;
			});
			"step 1";
			game.delayx();
		},
		ai: {
			order: 8,
			result: {
				target(player, target) {
					var card = ui.selected.cards[0];
					if (!card) {
						return 0;
					}
					var eff = get.effect(target, card, player, target);
					if (target.hasSkill("kotomi_chuanxiang")) {
						eff++;
					}
					return eff;
				},
			},
		},
	},
	//井上晶
	asara_shelu: {
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return (
				player.countCards("he") > 0 &&
				game.hasPlayer(function (current) {
					return current != player && current.countCards("h") > 0;
				})
			);
		},
		filterCard: true,
		position: "he",
		filterTarget(card, player, target) {
			return target != player && target.countCards("h") > 0;
		},
		check(card) {
			return 6 - get.value(card);
		},
		content() {
			"step 0";
			if (!target.countCards("h")) {
				event.finish();
			} else {
				player.choosePlayerCard(target, "h", true);
			}
			"step 1";
			player.showCards(result.cards);
			event.cards2 = result.cards;
			"step 2";
			target.$give(event.cards2, player, false);
			target.loseToSpecial(event.cards2, "asara_yingwei", player).visible = true;
			var card1 = cards[0],
				card2 = event.cards2[0];
			if (card1.suit == card2.suit) {
				player.draw(2);
			}
			if (card1.number == card2.number) {
				player.recover();
			}
		},
		ai: {
			order: 6,
			result: {
				target: -1,
			},
		},
	},
	asara_yingwei: {
		trigger: { player: "yingbian" },
		forced: true,
		filter: (event, player) => event.card.isCard && player.hasHistory("lose", evt => evt.getParent() == event && Object.values(evt.gaintag_map).some(value => value.includes("asara_yingwei"))),
		content: () => {
			trigger.forceYingbian = true;
		},
		ai: {
			combo: "asara_shelu",
		},
	},
	//国崎往人
	yukito_kongwu: {
		enable: "phaseUse",
		usable: 1,
		content() {
			"step 0";
			if (_status.connectMode) {
				event.time = lib.configOL.choose_timeout;
			}
			event.videoId = lib.status.videoId++;
			if (player.isUnderControl()) {
				game.swapPlayerAuto(player);
			}
			var switchToAuto = function () {
				game.pause();
				game.countChoose();
				setTimeout(function () {
					_status.imchoosing = false;
					event._result = {
						bool: true,
						score: get.rand(1, 5),
					};
					if (event.dialog) {
						event.dialog.close();
					}
					if (event.control) {
						event.control.close();
					}
					game.resume();
				}, 5000);
			};
			var createDialog = function (player, id) {
				if (_status.connectMode) {
					lib.configOL.choose_timeout = "30";
				}
				if (player == game.me) {
					return;
				}
				var str = get.translation(player) + "正在表演《小空飞天》...<br>";
				ui.create.dialog(str).videoId = id;
			};
			var chooseButton = function () {
				lib.skill.yufeng.$playFlappyBird(5, "小空飞天");
			};
			game.broadcastAll(createDialog, player, event.videoId);
			if (event.isMine()) {
				chooseButton();
			} else if (event.isOnline()) {
				event.player.send(chooseButton);
				event.player.wait();
				game.pause();
			} else {
				switchToAuto();
			}
			"step 1";
			game.broadcastAll(
				function (id, time) {
					if (_status.connectMode) {
						lib.configOL.choose_timeout = time;
					}
					var dialog = get.idDialog(id);
					if (dialog) {
						dialog.close();
					}
				},
				event.videoId,
				event.time
			);
			var result = event.result || result;
			game.log(player, "获得了", "#g" + result.score + "分");
			if (!result.score) {
				player.chooseToDiscard(2, true, "he");
				event.finish();
				return;
			}
			var list = [];
			var list2 = [];
			for (var i = 0; i < 5; i++) {
				if (lib.skill.yukito_kongwu.moves[i].filter(player, true)) {
					list.push(i);
				} else {
					list2.push(i);
				}
			}
			if (list.length >= result.score) {
				list = list.randomGets(result.score);
			} else {
				list.addArray(list2.randomGets(result.score - list.length));
			}
			list.sort();
			var next = player.chooseButton([
				"控物：请选择一项",
				[
					list.map(i => {
						return [i, lib.skill.yukito_kongwu.moves[i].prompt];
					}),
					"textbutton",
				],
			]);
			next.set("forced", true);
			next.set("filterButton", function (button) {
				return lib.skill.yukito_kongwu.moves[button.link].filter(_status.event.player);
			});
			next.set("ai", function (button) {
				if (lib.skill.yukito_kongwu.moves[button.link].filter(_status.event.player, true)) {
					return 1 + Math.random();
				}
				return Math.random();
			});
			"step 2";
			var num = result.links[0];
			switch (num) {
				case 0:
					event.goto(3);
					break;
				case 1:
					event.goto(5);
					break;
				case 2:
					event.goto(7);
					break;
				case 3:
					event.goto(9);
					break;
				case 4:
					player.moveCard(true);
					event.finish();
					break;
			}
			"step 3";
			player.chooseTarget(true, "令一名角色摸两张牌").set("ai", function (target) {
				var player = _status.event.player;
				var att = get.attitude(player, target) / Math.sqrt(1 + target.countCards("h"));
				if (target.hasSkillTag("nogain")) {
					att /= 10;
				}
				return att;
			});
			"step 4";
			if (result.bool) {
				var target = result.targets[0];
				player.line(target, "green");
				target.draw(2);
			}
			event.finish();
			"step 5";
			player.chooseTarget(true, "对一名角色造成1点伤害").set("ai", function (target) {
				var player = _status.event.player;
				return get.damageEffect(target, player, player);
			});
			"step 6";
			if (result.bool) {
				var target = result.targets[0];
				player.line(target, "green");
				target.damage();
			}
			event.finish();
			"step 7";
			player
				.chooseTarget(true, "令一名已受伤的角色回复1点体力", function (card, player, target) {
					return target.isDamaged();
				})
				.set("ai", function (target) {
					var player = _status.event.player;
					return get.recoverEffect(target, player, player);
				});
			"step 8";
			if (result.bool) {
				var target = result.targets[0];
				player.line(target, "green");
				target.recover();
			}
			event.finish();
			"step 9";
			player
				.chooseTarget(true, "弃置一名角色区域内的两张牌", function (card, player, target) {
					return target.countDiscardableCards(player, "hej") > 0;
				})
				.set("ai", function (target) {
					return -get.attitude(_status.event.player, target);
				});
			"step 10";
			if (result.bool) {
				var target = result.targets[0];
				player.line(target, "green");
				player.discardPlayerCard(target, "hej", true, 2);
			}
			event.finish();
		},
		moves: [
			{
				prompt: "令一名角色摸两张牌",
				filter: () => true,
			},
			{
				prompt: "对一名角色造成1点伤害",
				filter(player, ai) {
					if (!ai) {
						return true;
					}
					return game.hasPlayer(function (current) {
						return get.damageEffect(current, player, player) > 0;
					});
				},
			},
			{
				prompt: "令一名已受伤的角色回复1点体力",
				filter(player, ai) {
					return game.hasPlayer(function (current) {
						if (current.isDamaged()) {
							return !ai || get.recoverEffect(current, player, player) > 0;
						}
					});
				},
			},
			{
				prompt: "弃置一名角色区域内的两张牌",
				filter(player, ai) {
					return game.hasPlayer(function (current) {
						return (
							current.countDiscardableCards(player, "hej", function (card) {
								if (!ai) {
									return true;
								}
								return (
									get.buttonValue({
										link: card,
									}) *
										get.attitude(player, current) >
									0
								);
							}) >= (ai ? 1 : Math.min(2, current.countDiscardableCards(player, "hej")))
						);
					});
				},
			},
			{
				prompt: "移动场上的一张牌",
				filter(player, ai) {
					return player.canMoveCard(ai);
				},
			},
		],
		ai: {
			order: 10,
			result: { player: 1 },
			threaten: 3.2,
		},
	},
	yukito_yaxiang: {
		forceunique: true,
		enable: "chooseToUse",
		limited: true,
		filter(event, player) {
			return event.type == "dying" && (player.name1 == "key_yukito" || player.name2 == "key_yukito");
		},
		filterTarget(card, player, target) {
			return target == _status.event.dying;
		},
		selectTarget: -1,
		skillAnimation: true,
		animationColor: "key",
		content() {
			"step 0";
			player.awakenSkill(event.name);
			player.reinitCharacter("key_yukito", "key_crow", false);
			"step 1";
			if (target.hp < 3) {
				target.recover(3 - target.hp);
			}
			"step 2";
			var cards = target.getCards("j");
			if (cards.length) {
				target.discard(cards);
			}
			"step 3";
			target.addSkills("misuzu_zhongyuan");
		},
		derivation: "misuzu_zhongyuan",
		ai: {
			save: true,
			order: 4,
			result: {
				target(player, target) {
					if (get.attitude(player, target) < 4) {
						return false;
					}
					if (
						player.countCards("h", function (card) {
							var mod2 = game.checkMod(card, player, "unchanged", "cardEnabled2", player);
							if (mod2 != "unchanged") {
								return mod2;
							}
							var mod = game.checkMod(card, player, target, "unchanged", "cardSavable", player);
							if (mod != "unchanged") {
								return mod;
							}
							var savable = get.info(card).savable;
							if (typeof savable == "function") {
								savable = savable(card, player, target);
							}
							return savable;
						}) >=
						1 - target.hp
					) {
						return false;
					}
					if (target == player || target == get.zhu(player)) {
						return true;
					}
					return !player.hasUnknown();
				},
			},
		},
	},
	misuzu_zhongyuan: {
		trigger: { player: "judge" },
		limited: true,
		skillAnimation: true,
		animationColor: "key",
		logTarget: "player",
		cost() {
			"step 0";
			var str = "你的" + (trigger.judgestr || "") + "判定为" + get.translation(trigger.player.judging[0]) + "，是否发动【终愿】修改判定结果？";
			if (player.isUnderControl()) {
				game.swapPlayerAuto(player);
			}
			var switchToAuto = function () {
				_status.imchoosing = false;
				event._result = {
					bool: false,
				};
				if (event.dialog) {
					event.dialog.close();
				}
				if (event.control) {
					event.control.close();
				}
			};
			var chooseButton = function (player, str) {
				var event = _status.event;
				player = player || event.player;
				if (!event._result) {
					event._result = {};
				}
				var dialog = ui.create.dialog(str, "forcebutton", "hidden");
				event.dialog = dialog;
				dialog.addText("花色");
				var table = document.createElement("div");
				table.classList.add("add-setting");
				table.style.margin = "0";
				table.style.width = "100%";
				table.style.position = "relative";
				var listi = ["spade", "heart", "club", "diamond"];
				for (var i = 0; i < listi.length; i++) {
					var td = ui.create.div(".shadowed.reduce_radius.pointerdiv.tdnode");
					td.link = listi[i];
					table.appendChild(td);
					td.innerHTML = "<span>" + get.translation(listi[i]) + "</span>";
					td.addEventListener(lib.config.touchscreen ? "touchend" : "click", function () {
						if (_status.dragged) {
							return;
						}
						if (_status.justdragged) {
							return;
						}
						_status.tempNoButton = true;
						setTimeout(function () {
							_status.tempNoButton = false;
						}, 500);
						var link = this.link;
						var current = this.parentNode.querySelector(".bluebg");
						if (current) {
							current.classList.remove("bluebg");
						}
						this.classList.add("bluebg");
						event._result.suit = link;
					});
				}
				dialog.content.appendChild(table);
				dialog.addText("点数");
				var table2 = document.createElement("div");
				table2.classList.add("add-setting");
				table2.style.margin = "0";
				table2.style.width = "100%";
				table2.style.position = "relative";
				for (var i = 1; i < 14; i++) {
					var td = ui.create.div(".shadowed.reduce_radius.pointerdiv.tdnode");
					td.link = i;
					table2.appendChild(td);
					var num = i;
					td.innerHTML = "<span>" + get.strNumber(num) + "</span>";
					td.addEventListener(lib.config.touchscreen ? "touchend" : "click", function () {
						if (_status.dragged) {
							return;
						}
						if (_status.justdragged) {
							return;
						}
						_status.tempNoButton = true;
						setTimeout(function () {
							_status.tempNoButton = false;
						}, 500);
						var link = this.link;
						var current = this.parentNode.querySelector(".bluebg");
						if (current) {
							current.classList.remove("bluebg");
						}
						this.classList.add("bluebg");
						event._result.number = link;
					});
				}
				dialog.content.appendChild(table2);
				dialog.add("　　");
				event.dialog.open();
				event.switchToAuto = function () {
					event._result = {
						bool: false,
					};
					event.dialog.close();
					event.control.close();
					game.resume();
					_status.imchoosing = false;
				};
				event.control = ui.create.control("ok", "cancel2", function (link) {
					var result = event._result;
					if (link == "cancel2") {
						result.bool = false;
					} else {
						if (!result.number || !result.suit) {
							return;
						}
						result.bool = true;
					}
					event.dialog.close();
					event.control.close();
					game.resume();
					_status.imchoosing = false;
				});
				for (var i = 0; i < event.dialog.buttons.length; i++) {
					event.dialog.buttons[i].classList.add("selectable");
				}
				game.pause();
				game.countChoose();
			};
			if (event.isMine()) {
				chooseButton(player, str);
			} else if (event.isOnline()) {
				event.player.send(chooseButton, event.player, str);
				event.player.wait();
				game.pause();
			} else {
				switchToAuto();
			}
			"step 1";
			var map = event.result || result;
			if (map.bool) {
				event.result = {
					bool: true,
					cost_data: map,
				};
			}
		},
		async content(event, trigger, player) {
			var map = event.cost_data;
			player.awakenSkill(event.name);
			game.log(player, "将判定结果修改为了", "#g" + get.translation(map.suit + 2) + get.strNumber(map.number));
			trigger.fixedResult = {
				suit: map.suit,
				color: get.color({ suit: map.suit }),
				number: map.number,
			};
			player.popup(get.translation(map.suit + 2) + get.strNumber(map.number), "thunder");
			event.getParent("arrangeTrigger").finish();
		},
	},
	//凤千早
	chihaya_liewu: {
		derivation: "chihaya_huairou",
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
		trigger: { player: "useCard2" },
		filter(event, player) {
			var card = event.card;
			var info = get.info(card);
			if (info.type != "trick" || info.allowMultiple == false) {
				return false;
			}
			if (event.targets && !info.multitarget) {
				if (
					game.hasPlayer(function (current) {
						return !event.targets.includes(current) && lib.filter.targetEnabled2(card, player, current);
					})
				) {
					return true;
				}
			}
			return false;
		},
		async cost(event, trigger, player) {
			var prompt2 = "为" + get.translation(trigger.card) + "增加一个目标";
			event.result = await player
				.chooseTarget(get.prompt(event.skill), function (card, player, target) {
					var player = _status.event.player;
					return !_status.event.targets.includes(target) && lib.filter.targetEnabled2(_status.event.card, player, target);
				})
				.set("prompt2", prompt2)
				.set("ai", function (target) {
					var trigger = _status.event.getTrigger();
					var player = _status.event.player;
					return get.effect(target, trigger.card, player, player);
				})
				.set("card", trigger.card)
				.set("targets", trigger.targets)
				.forResult();
		},
		autodelay: true,
		async content(event, trigger, player) {
			trigger.targets.addArray(event.targets);
			game.log(event.targets, "也成为了", trigger.card, "的目标");
		},
		group: "chihaya_liewu2",
	},
	chihaya_liewu2: {
		trigger: { player: "disableEquipAfter" },
		forced: true,
		filter(event, player) {
			return !player.hasEnabledSlot() && !player._chihaya_liewu;
		},
		skillAnimation: true,
		animationColor: "orange",
		content() {
			player._chihaya_liewu = true;
			player.loseMaxHp(4);
			player.addSkills("chihaya_huairou");
		},
	},
	chihaya_huairou: {
		audio: 2,
		enable: "phaseUse",
		position: "he",
		filter: (event, player) => player.hasCard(card => lib.skill.chihaya_huairou.filterCard(card, player), lib.skill.chihaya_huairou.position),
		filterCard: (card, player) => get.type(card) == "equip" && player.canRecast(card),
		check(card) {
			if (get.position(card) == "e") {
				return 0.5 - get.value(card, get.player());
			}
			if (!get.player().hasEquipableSlot(get.subtype(card))) {
				return 5;
			}
			return 3 - get.value(card);
		},
		content() {
			player.recast(cards);
		},
		discard: false,
		lose: false,
		delay: false,
		prompt: "将一张装备牌置入弃牌堆并摸一张牌",
		ai: {
			order: 10,
			result: {
				player: 1,
			},
		},
	},
	chihaya_youfeng: {
		enable: "chooseToUse",
		zhuanhuanji: true,
		mark: true,
		intro: {
			content(storage, player) {
				return storage ? "每轮限一次，你可以废除你的一个装备栏，视为使用一张基本牌。" : "每轮限一次，你可以加1点体力上限，视为使用一张普通锦囊牌。";
			},
		},
		marktext: "☯",
		init(player) {
			player.storage.chihaya_youfeng = false;
		},
		hiddenCard(player, name) {
			if (player.storage.chihaya_youfeng && !player.hasEnabledSlot()) {
				return false;
			}
			if (player.hasSkill("chihaya_youfeng_" + (player.storage.chihaya_youfeng || false))) {
				return false;
			}
			var type = get.type(name);
			if (player.storage.chihaya_youfeng) {
				return type == "basic";
			}
			return type == "trick";
		},
		filter(event, player) {
			if (player.storage.chihaya_youfeng && !player.hasEnabledSlot()) {
				return false;
			}
			if (player.hasSkill("chihaya_youfeng_" + (player.storage.chihaya_youfeng || false))) {
				return false;
			}
			var type = player.storage.chihaya_youfeng ? "basic" : "trick";
			for (var name of lib.inpile) {
				if (get.type(name) != type) {
					continue;
				}
				if (event.filterCard({ name: name, isCard: true }, player, event)) {
					return true;
				}
			}
			return false;
		},
		chooseButton: {
			dialog(event, player) {
				const dialog = ui.create.dialog("游凤", "hidden");
				const equips = [];
				if (player.storage.chihaya_youfeng) {
					for (let i = 1; i < 6; i++) {
						if (!player.hasEnabledSlot(i)) {
							continue;
						}
						equips.push([i, get.translation("equip" + i)]);
					}
					if (equips.length > 0) {
						dialog.add([equips, "tdnodes"]);
					}
				}
				const type = player.storage.chihaya_youfeng ? "basic" : "trick";
				const list = [];
				for (const name of lib.inpile) {
					if (get.type(name) != type) {
						continue;
					}
					if (event.filterCard({ name: name, isCard: true }, player, event)) {
						list.push([type, "", name]);
						if (name == "sha") {
							for (let j of lib.inpile_nature) {
								list.push([type, "", name, j]);
							}
						}
					}
				}
				dialog.add([list, "vcard"]);
				return dialog;
			},
			filter(button) {
				if (ui.selected.buttons.length && typeof button.link == typeof ui.selected.buttons[0].link) {
					return false;
				}
				return true;
			},
			select() {
				if (_status.event.player.storage.chihaya_youfeng) {
					return 2;
				}
				return 1;
			},
			check(button) {
				var player = _status.event.player;
				if (typeof button.link == "number") {
					if (!player.hasEmptySlot(button.link)) {
						var card = player.getEquip(button.link);
						if (card) {
							var val = get.value(card);
							if (val > 0) {
								return 0;
							}
							return 5 - val;
						}
					}
					switch (button.link) {
						case 3:
							return 4.5;
						case 4:
							return 4.4;
						case 5:
							return 4.3;
						case 2:
							return (3 - player.hp) * 1.5;
						case 1: {
							if (
								game.hasPlayer(function (current) {
									return (get.realAttitude || get.attitude)(player, current) < 0 && get.distance(player, current) > 1;
								})
							) {
								return 0;
							}
							return 3.2;
						}
					}
				}
				var name = button.link[2];
				var evt = _status.event.getParent();
				if (get.type(name) == "basic") {
					if (name == "shan") {
						return 2;
					}
					if (evt.type == "dying") {
						if (get.attitude(player, evt.dying) < 2) {
							return false;
						}
						if (name == "jiu") {
							return 2.1;
						}
						return 1.9;
					}
					if (evt.type == "phase") {
						return player.getUseValue({
							name: name,
							nature: button.link[3],
							isCard: true,
						});
					}
					return 1;
				}
				if (!["chuqibuyi", "shuiyanqijunx", "juedou", "nanman", "wanjian", "shunshou", "zhujinqiyuan"].includes(name)) {
					return 0;
				}
				var card = { name: name, isCard: true };
				if (["shunshou", "zhujinqiyuan"].includes(card.name)) {
					if (
						!game.hasPlayer(function (current) {
							return get.attitude(player, current) != 0 && get.distance(player, current) <= 1 && player.canUse(card, current) && get.effect(current, card, player, player) > 0;
						})
					) {
						return 0;
					}
					return player.getUseValue(card) - 7;
				}
				return player.getUseValue(card) - 4;
			},
			backup(links, player) {
				if (links.length == 1) {
					return {
						filterCard() {
							return false;
						},
						selectCard: -1,
						viewAs: {
							name: links[0][2],
							nature: links[0][3],
							isCard: true,
						},
						log: false,
						popname: true,
						precontent() {
							player.logSkill("chihaya_youfeng");
							player.gainMaxHp();
							player.addTempSkill("chihaya_youfeng_" + (player.storage.chihaya_youfeng || false), "roundStart");
							player.changeZhuanhuanji("chihaya_youfeng");
						},
					};
				}
				if (typeof links[1] == "number") {
					links.reverse();
				}
				var equip = links[0];
				var name = links[1][2];
				var nature = links[1][3];
				return {
					filterCard() {
						return false;
					},
					selectCard: -1,
					equip: equip,
					viewAs: {
						name: name,
						nature: nature,
						isCard: true,
					},
					popname: true,
					log: false,
					precontent() {
						player.logSkill("chihaya_youfeng");
						player.disableEquip(lib.skill.chihaya_youfeng_backup.equip);
						player.addTempSkill("chihaya_youfeng_" + (player.storage.chihaya_youfeng || false), "roundStart");
						player.changeZhuanhuanji("chihaya_youfeng");
					},
				};
			},
			prompt(links, player) {
				if (links.length == 1) {
					return "增加1点体力上限，视为使用" + (get.translation(links[0][3]) || "") + get.translation(links[0][2]);
				}
				if (typeof links[1] == "number") {
					links.reverse();
				}
				var equip = "equip" + links[0];
				var name = links[1][2];
				var nature = links[1][3];
				return "废除自己的" + get.translation(equip) + "栏，视为使用" + (get.translation(nature) || "") + get.translation(name);
			},
		},
		ai: {
			respondSha: true,
			respondShan: true,
			skillTagFilter(player, tag, arg) {
				if (arg == "respond") {
					return false;
				}
				if (!player.storage.chihaya_youfeng || player.hasSkill("chihaya_youfeng_true")) {
					return false;
				}
			},
			order: 1,
			result: {
				player: 1,
			},
		},
		subSkill: {
			true: { charlotte: true },
			false: { charlotte: true },
		},
	},
	//七濑留美
	rumi_shuwu: {
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
		trigger: { player: "useCard2" },
		filter(event, player) {
			var card = event.card;
			var info = get.info(card);
			if (info.type != "trick" || info.allowMultiple == false) {
				return false;
			}
			if (event.targets && !info.multitarget) {
				if (
					game.hasPlayer(function (current) {
						return !event.targets.includes(current) && lib.filter.targetEnabled2(card, player, current);
					})
				) {
					return true;
				}
			}
			return false;
		},
		autodelay: true,
		async cost(event, trigger, player) {
			var prompt2 = "为" + get.translation(trigger.card) + "增加一个目标";
			const { result } = await player
				.chooseTarget(get.prompt(event.skill), function (card, player, target) {
					var player = _status.event.player;
					return !_status.event.targets.includes(target) && lib.filter.targetEnabled2(_status.event.card, player, target);
				})
				.set("prompt2", prompt2)
				.set("ai", function (target) {
					var trigger = _status.event.getTrigger();
					var player = _status.event.player;
					return get.effect(target, trigger.card, player, player);
				})
				.set("card", trigger.card)
				.set("targets", trigger.targets);
			event.result = result;
		},
		content() {
			trigger.targets.addArray(event.targets);
			game.log(event.targets, "也成为了", trigger.card, "的目标");
		},
		group: "rumi_shuwu2",
	},
	rumi_shuwu2: {
		trigger: { player: "phaseUseEnd" },
		forced: true,
		filter(event, player) {
			if (player.hp <= 3) {
				return true;
			}
			if (
				player.getHistory("useCard", function (evt) {
					return evt.card.name == "sha" && evt.addCount !== false && evt.getParent("phaseUse") == event;
				}).length <= 1
			) {
				return true;
			}
			if (
				player.getHistory("sourceDamage", function (evt) {
					return get.type(evt.card, null, false) == "trick" && evt.getParent("phaseUse") == event;
				}).length == 0
			) {
				return true;
			}
			return false;
		},
		content() {
			var num = 0;
			if (player.hp <= 3) {
				num++;
			}
			if (
				player.getHistory("useCard", function (evt) {
					return evt.card.name == "sha" && evt.addCount !== false && evt.getParent("phaseUse") == trigger;
				}).length <= 1
			) {
				num++;
			}
			if (
				player.getHistory("sourceDamage", function (evt) {
					return get.type(evt.card, null, false) == "trick" && evt.getParent("phaseUse") == trigger;
				}).length == 0
			) {
				num++;
			}
			player.draw(num);
			player.addTempSkill("rumi_shuwu3");
			player.addMark("rumi_shuwu3", num, false);
		},
	},
	rumi_shuwu3: {
		mod: {
			maxHandcard(player, num) {
				return num + player.countMark("rumi_shuwu3");
			},
		},
		onremove: true,
	},
	//凤咲夜
	sakuya_junbu: {
		mod: {
			targetInRange(card, player) {
				if (player.countDisabledSlot() >= 1) {
					return true;
				}
			},
			cardUsable(card, player) {
				if (player.countDisabledSlot() >= 2) {
					return Infinity;
				}
			},
		},
		trigger: { player: "useCard2" },
		filter(event, player) {
			if (player.countDisabledSlot() >= 4) {
				return true;
			}
			return lib.skill.sakuya_junbu.filter2.apply(this, arguments);
		},
		filter2(event, player) {
			if (player.countDisabledSlot() < 3) {
				return false;
			}
			var card = event.card;
			var info = get.info(card);
			if (info.allowMultiple == false) {
				return false;
			}
			if (event.targets && !info.multitarget) {
				if (
					game.hasPlayer(function (current) {
						return !event.targets.includes(current) && lib.filter.targetEnabled2(card, player, current);
					})
				) {
					return true;
				}
			}
			return false;
		},
		async cost(event, trigger, player) {
			const result = { bool: false };
			event.result = result;
			if (player.countDisabledSlot() >= 4) {
				result.bool = true;
				if (!lib.skill.sakuya_junbu.filter2(trigger, player)) {
					return;
				}
			}
			var prompt2 = "为" + get.translation(trigger.card) + "增加一个目标";
			const { result: result2 } = await player
				.chooseTarget(get.prompt(event.skill), function (card, player, target) {
					var player = _status.event.player;
					return !_status.event.targets.includes(target) && lib.filter.targetEnabled2(_status.event.card, player, target);
				})
				.set("prompt2", prompt2)
				.set("ai", function (target) {
					var trigger = _status.event.getTrigger();
					var player = _status.event.player;
					return get.effect(target, trigger.card, player, player);
				})
				.set("card", trigger.card)
				.set("targets", trigger.targets);
			if (result2.bool) {
				result.bool = true;
				result.targets = result2.targets;
			}
		},
		async content(event, trigger, player) {
			if (player.countDisabledSlot() >= 4) {
				trigger.directHit.addArray(game.players);
				game.log(trigger.card, "不可被响应");
			}
			if (event.targets && event.targets.length > 0) {
				trigger.targets.addArray(event.targets);
				game.log(event.targets, "也成为了", trigger.card, "的目标");
			}
		},
		group: "sakuya_junbu_damage",
		subSkill: {
			damage: {
				trigger: { source: "damageBegin1" },
				forced: true,
				sub: true,
				filter(event, player) {
					return !player.hasEnabledSlot() && event.getParent().type == "card";
				},
				logTarget: "player",
				content() {
					player.loseHp();
					trigger.num++;
				},
			},
		},
		ai: {
			combo: "youlong",
		},
	},
	//铃木央人
	hiroto_huyu: {
		trigger: { global: "phaseUseEnd" },
		noHidden: true,
		filter(event, player) {
			return player != event.player && player.hasSkill("hiroto_huyu") && !player.hasSkill("hiroto_zonglve") && event.player.countCards("h") > 0;
		},
		async cost(event, trigger, player) {
			event.result = await trigger.player
				.chooseCard(2, "h", "是否对" + get.translation(player) + "发动【虎驭】？", "将两张手牌交给该角色，然后令其获得〖纵略〗并于下回合获得该角色得到的所有牌")
				.set(
					"goon",
					(function () {
						var source = trigger.player;
						if (get.attitude(source, player) > 0) {
							return 7;
						}
						if (source.hp > 2) {
							return 4;
						}
						return 0;
					})()
				)
				.set("ai", function (card) {
					return _status.event.goon - get.value(card);
				})
				.forResult();
		},
		content() {
			var target = trigger.player;
			target.give(cards, player);
			player.storage.hiroto_huyu2 = target;
			player.addSkills("hiroto_zonglve");
			player.addSkill("hiroto_huyu2");
		},
		derivation: "hiroto_zonglve",
	},
	hiroto_huyu2: {
		trigger: { player: "phaseEnd" },
		forced: true,
		popup: false,
		charlotte: true,
		async content(event, trigger, player) {
			player.removeSkill("hiroto_huyu2");
			await player.removeSkills("hiroto_zonglve");
			player.removeGaintag("hiroto_huyu2");
			var target = player.storage.hiroto_huyu2;
			if (target && target.isIn()) {
				var cards = [];
				player.getHistory("gain", function (evt) {
					cards.addArray(evt.cards);
				});
				var he = player.getCards("he");
				cards = cards.filter(function (card) {
					return he.includes(card);
				});
				if (cards.length) {
					target.gain(cards, player, "giveAuto", "bySelf");
				}
			}
		},
		mark: "character",
		intro: { content: "已成为$的工具人" },
		group: "hiroto_huyu_gain",
	},
	hiroto_huyu_gain: {
		trigger: { player: "gainBegin" },
		silent: true,
		filter(event, player) {
			if (player == _status.currentPhase) {
				event.gaintag.add("hiroto_huyu2");
			}
			return false;
		},
	},
	hiroto_zonglve: {
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return (
				player.countCards("h") > 0 &&
				game.hasPlayer(function (current) {
					return current != player && current.countCards("h") > 0;
				})
			);
		},
		filterTarget(card, player, target) {
			return target != player && target.countCards("h") > 0;
		},
		filterCard: true,
		delay: false,
		charlotte: true,
		position: "h",
		discard: false,
		lose: false,
		content() {
			"step 0";
			player.choosePlayerCard(true, target, "h");
			"step 1";
			event.card = result.cards[0];
			player.$compare(cards[0], target, event.card);
			game.log(player, "展示了", cards[0]);
			game.log(target, "展示了", event.card);
			game.delay(3.5);
			"step 2";
			game.broadcastAll(ui.clear);
			if (get.color(cards[0], player) == get.color(card, target)) {
				target.damage("nocard");
				target.discard(card).animate = false;
			} else {
				player.gainPlayerCard(target, true, 2, "hej");
			}
		},
		mod: {
			maxHandcard(player, num) {
				return num + 3;
			},
		},
		ai: {
			order: 7,
			result: {
				target: -1,
			},
		},
	},
	hiroto_tuolao: {
		trigger: { player: "phaseAfter" },
		forced: true,
		juexingji: true,
		skillAnimation: true,
		animationColor: "water",
		filter(event, player) {
			return (
				player.phaseNumber > 1 &&
				!player.getHistory("lose", function (evt) {
					return evt.getParent(2).name == "hiroto_huyu2";
				}).length
			);
		},
		content() {
			player.awakenSkill(event.name);
			player.draw(3);
			player.changeSkills(["hiroto_zonglve"], ["hiroto_huyu"]);
		},
	},
	//水织静久
	shizuku_sizhi: {
		audio: 2,
		enable: "phaseUse",
		getResult(cards) {
			var l = cards.length;
			var all = Math.pow(l, 2);
			var list = [];
			for (var i = 1; i < all; i++) {
				var array = [];
				for (var j = 0; j < l; j++) {
					if (Math.floor((i % Math.pow(2, j + 1)) / Math.pow(2, j)) > 0) {
						array.push(cards[j]);
					}
				}
				var num = 0;
				for (var k of array) {
					num += get.number(k);
				}
				if (num == 13) {
					list.push(array);
				}
			}
			if (list.length) {
				list.sort(function (a, b) {
					if (a.length != b.length) {
						return b.length - a.length;
					}
					return get.value(a) - get.value(b);
				});
				return list[0];
			}
			return list;
		},
		usable: 1,
		filterCard(card) {
			var num = 0;
			for (var i = 0; i < ui.selected.cards.length; i++) {
				num += get.number(ui.selected.cards[i]);
			}
			return get.number(card) + num <= 13;
		},
		complexCard: true,
		selectCard() {
			var num = 0;
			for (var i = 0; i < ui.selected.cards.length; i++) {
				num += get.number(ui.selected.cards[i]);
			}
			if (num == 13) {
				return ui.selected.cards.length;
			}
			return ui.selected.cards.length + 2;
		},
		check(card) {
			var evt = _status.event;
			if (!evt.shizuku_sizhi_choice) {
				evt.shizuku_sizhi_choice = lib.skill.shizuku_sizhi.getResult(evt.player.getCards("he"));
			}
			if (!evt.shizuku_sizhi_choice.includes(card)) {
				return 0;
			}
			return 1;
		},
		position: "he",
		content() {
			player.draw(cards.length * 2).gaintag = ["shizuku_sizhi2"];
			player.addTempSkill("shizuku_sizhi2");
		},
		ai: {
			order: 5,
			result: { player: 1 },
		},
	},
	shizuku_sizhi2: {
		onremove(player) {
			player.removeGaintag("shizuku_sizhi2");
		},
		mod: {
			targetInRange(card) {
				if (!card.cards || !card.cards.length) {
					return;
				}
				for (var i of card.cards) {
					if (!i.hasGaintag("shizuku_sizhi2") || get.color(i) != "black") {
						return;
					}
				}
				return true;
			},
			cardUsable(card) {
				if (!card.cards || !card.cards.length) {
					return;
				}
				for (var i of card.cards) {
					if (!i.hasGaintag("shizuku_sizhi2") || get.color(i) != "black") {
						return;
					}
				}
				return Infinity;
			},
			ignoredHandcard(card, player) {
				if (card.hasGaintag("shizuku_sizhi2") && get.color(card) == "red") {
					return true;
				}
			},
			cardDiscardable(card, player, name) {
				if (name == "phaseDiscard" && card.hasGaintag("shizuku_sizhi2") && get.color(card) == "red") {
					return false;
				}
			},
			aiOrder(player, card, num) {
				if (get.itemtype(card) == "card" && card.hasGaintag("shizuku_sizhi2") && get.color(card) == "black") {
					return num - 0.1;
				}
			},
		},
	},
	shizuku_biyi: {
		trigger: { player: "damageEnd" },
		frequent: true,
		content() {
			"step 0";
			player.judge();
			"step 1";
			var num = result.number;
			var next = player.chooseToDiscard(
				"是否弃置任意张点数之和为" + get.cnNumber(num) + "的牌并回复1点体力？",
				function (card) {
					var num = 0;
					for (var i = 0; i < ui.selected.cards.length; i++) {
						num += get.number(ui.selected.cards[i]);
					}
					return get.number(card) + num <= _status.event.num;
				},
				"he"
			);
			next.set("num", num);
			next.set("complexCard", true);
			next.set("selectCard", function () {
				var num = 0;
				for (var i = 0; i < ui.selected.cards.length; i++) {
					num += get.number(ui.selected.cards[i]);
				}
				if (num == _status.event.num) {
					return ui.selected.cards.length;
				}
				return ui.selected.cards.length + 2;
			});
			next.set(
				"cardResult",
				(function () {
					var cards = player.getCards("he");
					var l = cards.length;
					var all = Math.pow(l, 2);
					var list = [];
					for (var i = 1; i < all; i++) {
						var array = [];
						for (var j = 0; j < l; j++) {
							if (Math.floor((i % Math.pow(2, j + 1)) / Math.pow(2, j)) > 0) {
								array.push(cards[j]);
							}
						}
						var numx = 0;
						for (var k of array) {
							numx += get.number(k);
						}
						if (numx == num) {
							list.push(array);
						}
					}
					if (list.length) {
						list.sort(function (a, b) {
							return get.value(a) - get.value(b);
						});
						return list[0];
					}
					return list;
				})()
			);
			next.set("ai", function (card) {
				if (!_status.event.cardResult.includes(card)) {
					return 0;
				}
				return 6 - get.value(card);
			});
			"step 2";
			if (result.bool) {
				player.recover();
			}
		},
	},
	shizuku_sanhua: {
		trigger: { player: "die" },
		forceDie: true,
		skillAnimation: true,
		animationColor: "thunder",
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt2(event.skill), lib.filter.notMe)
				.set("ai", function (target) {
					return get.attitude(_status.event.player, target);
				})
				.forResult();
		},
		async content(event, trigger, player) {
			var target = event.targets[0];
			var names = [];
			var cards = [];
			while (cards.length < 4) {
				var card = get.cardPile2(function (card) {
					return !cards.includes(card) && !names.includes(card.name) && get.type(card) == "basic";
				});
				if (card) {
					cards.push(card);
					names.push(card.name);
				} else {
					break;
				}
			}
			if (cards.length) {
				await target.gain(cards, "gain2");
			}
		},
	},
	//鸣濑白羽
	shiroha_yuzhao: {
		trigger: {
			global: "phaseBefore",
			player: "enterGame",
		},
		forced: true,
		charlotte: true,
		filter(event, player) {
			return event.name != "phase" || game.phaseNumber == 0;
		},
		content() {
			player.addToExpansion(get.cards(game.countGroup()), "draw").gaintag.add("shiroha_yuzhao");
		},
		marktext: "兆",
		intro: {
			markcount: "expansion",
			mark(dialog, content, player) {
				var content = player.getExpansions("shiroha_yuzhao");
				if (content && content.length) {
					if (player == game.me || player.isUnderControl()) {
						dialog.addAuto(content);
					} else {
						return "共有" + get.cnNumber(content.length) + "张牌";
					}
				}
			},
			content(content, player) {
				var content = player.getExpansions("shiroha_yuzhao");
				if (content && content.length) {
					if (player == game.me || player.isUnderControl()) {
						return get.translation(content);
					}
					return "共有" + get.cnNumber(content.length) + "张牌";
				}
			},
		},
		group: "shiroha_yuzhao_umi",
	},
	shiroha_yuzhao_umi: {
		trigger: { global: "phaseBegin" },
		forced: true,
		filter(event, player) {
			return player.getExpansions("shiroha_yuzhao").length > 0 && get.distance(event.player, player) <= 1;
		},
		content() {
			"step 0";
			event.num = game.countGroup();
			player.addToExpansion(get.cards(event.num)).gaintag.add("shiroha_yuzhao");
			"step 1";
			var next = player.chooseToMove(),
				num = game.countGroup();
			next.set("prompt", "预兆：将" + get.cnNumber(num) + "张牌置于牌堆顶");
			next.set("num", num);
			next.set("forced", true);
			next.set("filterOk", function (moved) {
				return moved[1].length == _status.event.num;
			});
			next.set("filterMove", function (from, to, moved) {
				if (to != 1) {
					return true;
				}
				return moved[1].length < _status.event.num;
			});
			next.set("list", [[get.translation(player) + "（你）的“兆”", player.getExpansions("shiroha_yuzhao")], ["牌堆顶"]]);
			next.set("processAI", function (list) {
				var cards = list[0][1],
					cards2 = cards.randomRemove(_status.event.num);
				return [cards, cards2];
			});
			"step 2";
			if (result && result.bool) {
				var cards = result.moved[1];
				player.lose(cards, ui.cardPile, "insert");
			}
			game.updateRoundNumber();
		},
	},
	shiroha_guying: {
		derivation: "shiroha_guying_rewrite",
		trigger: {
			player: "damageBegin3",
			source: "damageBegin1",
		},
		filter(event, player, name) {
			if (!player.storage.shiroha_jiezhao && player.hasSkill("shiroha_guying_temp")) {
				return false;
			}
			if (name == "damageBegin3") {
				return true;
			}
			return player != event.player;
		},
		locked(skill, player) {
			if (!player || !player.storage.shiroha_jiezhao) {
				return true;
			}
			return false;
		},
		cost() {
			"step 0";
			var num = event.triggername == "damageBegin3" ? -1 : 1;
			if (player.storage.shiroha_jiezhao || !player.hasSkill("shiroha_guying")) {
				if (num > 0) {
					player.chooseBool(get.prompt("shiroha_guying", trigger.player), "进行判定。若判定结果为黑色，则即将对其造成的伤害+1");
				} else {
					player.chooseBool(get.prompt("shiroha_guying"), "进行判定。若判定结果为红色，则即将受到的伤害-1");
				}
			} else {
				event._result = { bool: true };
			}
			"step 1";
			event.result = result;
		},
		content() {
			"step 0";
			var num = event.triggername == "damageBegin3" ? -1 : 1;
			event.num = num;
			player.addTempSkill("shiroha_guying_temp");
			player.judge(function (card) {
				return get.color(card) == (_status.event.getParent("shiroha_guying").num > 0 ? "black" : "red") ? 2 : 0;
			}).judge2 = function (result) {
				return result.bool ? true : false;
			};
			"step 1";
			if (result.bool) {
				trigger.num += num;
			}
		},
	},
	shiroha_guying_temp: { charlotte: true },
	shiroha_jiezhao: {
		trigger: { global: "judge" },
		filter(event, player) {
			return player.getExpansions("shiroha_yuzhao").length && event.player.isIn();
		},
		async cost(event, trigger, player) {
			const list = player.getExpansions("shiroha_yuzhao");
			const { result } = await player
				.chooseButton([get.translation(trigger.player) + "的" + (trigger.judgestr || "") + "判定为" + get.translation(trigger.player.judging[0]) + "，" + get.prompt(event.skill), list, "hidden"], function (button) {
					var card = button.link;
					var trigger = _status.event.getTrigger();
					var player = _status.event.player;
					var judging = _status.event.judging;
					var result = trigger.judge(card) - trigger.judge(judging);
					var attitude = get.attitude(player, trigger.player);
					return result * attitude;
				})
				.set("judging", trigger.player.judging[0])
				.set("filterButton", function (button) {
					var player = _status.event.player;
					var card = button.link;
					var mod2 = game.checkMod(card, player, "unchanged", "cardEnabled2", player);
					if (mod2 != "unchanged") {
						return mod2;
					}
					var mod = game.checkMod(card, player, "unchanged", "cardRespondable", player);
					if (mod != "unchanged") {
						return mod;
					}
					return true;
				});
			if (result.bool) {
				event.result = { bool: true, cards: result.links };
			}
		},
		//logSkill留给respond
		popup: false,
		async content(event, trigger, player) {
			const cards = event.cards;
			await player.respond(cards, "shiroha_jiezhao", "highlight", "noOrdering");
			if (trigger.player.judging[0].clone) {
				trigger.player.judging[0].clone.classList.remove("thrownhighlight");
				game.broadcast(function (card) {
					if (card.clone) {
						card.clone.classList.remove("thrownhighlight");
					}
				}, trigger.player.judging[0]);
				game.addVideo("deletenode", player, get.cardsInfo([trigger.player.judging[0].clone]));
			}
			const oldJudgeCard = trigger.player.judging[0];
			trigger.player.judging[0] = cards[0];
			trigger.orderingCards.addArray(cards);
			game.log(trigger.player, "的判定牌改为", cards[0]);
			await game.cardsDiscard(oldJudgeCard);
			await game.delay(2);
			if (!player.getExpansions("shiroha_yuzhao").length) {
				player.storage.shiroha_jiezhao = true;
				player.gainMaxHp();
				player.recover();
				var list = ["umi_chaofan", "ao_xishi", "tsumugi_mugyu", "kamome_jieban"];
				var skill = list.randomGet();
				player.flashAvatar("shiroha_jiezhao", "key_" + skill.split("_")[0]);
				await player.addSkills(skill);
			}
		},
		ai: {
			rejudge: true,
			tag: {
				rejudge: 0.6,
			},
			combo: "shiroha_yuzhao",
		},
		derivation: ["umi_chaofan", "ao_xishi", "tsumugi_mugyu", "kamome_jieban"],
	},
	//高城丈士朗
	jojiro_shensu: {
		group: ["jojiro_shensu1", "jojiro_shensu2", "jojiro_shensu4"],
		charlotte: true,
	},
	jojiro_shensu1: {
		trigger: { player: "phaseJudgeBefore" },
		async cost(event, trigger, player) {
			const check = player.countCards("h") > 2;
			event.result = await player
				.chooseTarget(get.prompt("jojiro_shensu"), "跳过判定阶段和摸牌阶段，视为对一名其他角色使用一张【杀】", function (card, player, target) {
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
				.forResult();
		},
		async content(event, trigger, player) {
			trigger.cancel();
			player.skip("phaseDraw");
			await player.useCard({ name: "sha", isCard: true }, event.targets[0], false);
		},
	},
	jojiro_shensu2: {
		trigger: { player: "phaseUseBefore" },
		filter(event, player) {
			return player.countCards("he", { type: "equip" }) > 0;
		},
		async cost(event, trigger, player) {
			const check = player.needsToDiscard();
			event.result = await player
				.chooseCardTarget({
					prompt: get.prompt("jojiro_shensu"),
					prompt2: "弃置一张装备牌并跳过出牌阶段，视为对一名其他角色使用一张【杀】",
					filterCard(card, player) {
						return get.type(card) == "equip" && lib.filter.cardDiscardable(card, player);
					},
					position: "he",
					filterTarget(card, player, target) {
						if (player == target) {
							return false;
						}
						return player.canUse({ name: "sha" }, target, false);
					},
					ai1(card) {
						if (_status.event.check) {
							return 0;
						}
						return 6 - get.value(card);
					},
					ai2(target) {
						if (_status.event.check) {
							return 0;
						}
						return get.effect(target, { name: "sha" }, _status.event.player);
					},
					check: check,
				})
				.forResult();
		},
		async content(event, trigger, player) {
			trigger.cancel();
			await player.discard(event.cards[0]);
			await player.useCard({ name: "sha", isCard: true }, event.targets[0]);
		},
	},
	jojiro_shensu4: {
		trigger: { player: "phaseDiscardBefore" },
		async cost(event, trigger, player) {
			var check = player.needsToDiscard() || player.isTurnedOver() || (player.hasSkill("shebian") && player.canMoveCard(true, true));
			event.result = await player
				.chooseTarget(get.prompt("jojiro_shensu"), "跳过弃牌阶段并将武将牌翻面，视为对一名其他角色使用一张【杀】", function (card, player, target) {
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
					return get.effect(target, { name: "sha" }, _status.event.player, _status.event.player);
				})
				.forResult();
		},
		async content(event, trigger, player) {
			trigger.cancel();
			await player.turnOver();
			await player.useCard({ name: "sha", isCard: true }, event.targets[0], false);
		},
	},
	jojiro_shunying: {
		trigger: { player: "phaseEnd" },
		forced: true,
		charlotte: true,
		filter(event, player) {
			return player.getHistory("skipped").length > 0;
		},
		content() {
			"step 0";
			var num = player.getHistory("skipped").length;
			event.num = num;
			player.chooseToMoveChess(num, "瞬影：移动至多" + get.cnNumber(num) + "格或失去1点体力");
			"step 1";
			if (!result.bool) {
				player.loseHp();
			} else {
				player.draw(num);
			}
		},
	},
	//神户小鸟
	kotori_yumo: {
		trigger: {
			global: "phaseBefore",
			player: "enterGame",
		},
		forced: true,
		charlotte: true,
		filter(event, player) {
			return event.name != "phase" || game.phaseNumber == 0;
		},
		derivation: ["kotori_skill_wei", "kotori_skill_shu", "kotori_skill_wu", "kotori_skill_qun", "kotori_skill_jin", "kotori_skill_key"],
		content() {
			var list = ["wei", "shu", "wu", "qun", "jin"];
			for (var i of list) {
				if (!player.hasMark("kotori_yumo_" + i)) {
					player.addMark("kotori_yumo_" + i, 1, false);
					game.log(player, "获得了一个", lib.translate["kotori_yumo_" + i].replace(/魔物/g, "【魔物】"));
				}
			}
		},
		group: ["kotori_yumo_damage", "kotori_yumo_gain"],
	},
	kotori_yumo_damage: {
		trigger: { global: "damageEnd" },
		forced: true,
		filter(event, player) {
			var name = "kotori_yumo_" + event.player.group;
			return lib.skill[name] && !player.hasMark(name);
		},
		popup: false,
		content() {
			game.log(player, "对", trigger.player, "发动了", "#g【驭魔】");
			var group = trigger.player.group;
			player.popup("驭魔", get.groupnature(group));
			player.addMark("kotori_yumo_" + group, 1, false);
			game.log(player, "获得了一个", lib.translate["kotori_yumo_" + group].replace(/魔物/g, "【魔物】"));
		},
	},
	kotori_yumo_gain: {
		trigger: { player: "phaseBegin" },
		filter(event, player) {
			var list = ["wei", "shu", "wu", "qun", "key", "jin"];
			for (var i in list) {
				if (player.hasMark("kotori_yumo_" + list[i])) {
					return true;
				}
			}
			return false;
		},
		async cost(event, trigger, player) {
			const list = ["wei", "shu", "wu", "qun", "key", "jin"];
			const list2 = [];
			for (const i of list) {
				if (player.hasMark("kotori_yumo_" + i)) {
					list2.push("kotori_skill_" + i);
				}
			}
			list2.push("cancel2");
			const { control } = await player
				.chooseControl(list2)
				.set("prompt", "###是否发动【驭魔】？###弃置对应的标记并获得下列技能中的一个，或点取消，不获得技能")
				.set(
					"choice",
					(function () {
						if (
							list2.includes("kotori_skill_shu") &&
							player.countCards("h", function (card) {
								return get.name(card, player) == "sha" && player.getUseValue(card) > 0;
							}) > 1
						) {
							return "kotori_skill_shu";
						}
						if (list2.includes("kotori_skill_key") && player.hp > 1) {
							return "kotori_skill_key";
						}
						if (list2.includes("kotori_skill_qun") && player.isDamaged() && player.needsToDiscard() > 1) {
							return "kotori_skill_qun";
						}
						return "cancel2";
					})()
				)
				.set("ai", function () {
					return _status.event.choice;
				})
				.forResult();
			event.result = {
				bool: control !== "cancel2",
				cost_data: { control },
			};
		},
		content() {
			const result = event.cost_data;
			if (result.control != "cancel2") {
				var name = "kotori_yumo_" + result.control.slice(13);
				player.removeMark(name, 1, false);
				game.log(player, "移去了一个", lib.translate[name].replace(/魔物/g, "【魔物】"));
				player.addTempSkills(result.control);
				game.log(player, "获得了技能", lib.translate[name].replace(/魔物/g, "【" + get.translation(result.control) + "】"));
			}
		},
	},
	kotori_skill_wei: {
		trigger: { player: "phaseBegin" },
		filter(event, player) {
			return player.countCards("he") > 0;
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseCardTarget({
					prompt: get.prompt2(event.skill),
					filterCard: lib.filter.cardDiscardable,
					filterTarget(card, player, target) {
						return player != target;
					},
					position: "he",
					ai1(card) {
						return 6 - get.value(card);
					},
					ai2(target) {
						return (1 / (1 + target.countCards("he"))) * -get.attitude(_status.event.player, target);
					},
				})
				.forResult();
		},
		content() {
			"step 0";
			player.discard(cards);
			targets[0].chooseToDiscard("弃置一张牌，或令" + get.translation(player) + "摸一张牌", "he").ai = lib.skill.zhiheng.check;
			"step 1";
			if (!result.bool) {
				player.draw();
			}
		},
	},
	kotori_skill_shu: {
		mod: {
			cardUsable(card, player, num) {
				if (card.name == "sha") {
					return num + 1;
				}
			},
		},
		trigger: { player: "phaseUseEnd" },
		forced: true,
		filter(event, player) {
			return (
				player.getHistory("useCard", function (evt) {
					return evt.card && evt.card.name == "sha" && evt.getParent("phaseUse") == event;
				}).length > 1
			);
		},
		content() {
			player.draw();
		},
	},
	kotori_skill_wu: {
		trigger: { player: "phaseEnd" },
		forced: true,
		filter(event, player) {
			return player.countCards("h") != player.hp;
		},
		content() {
			player.draw();
		},
	},
	kotori_skill_qun: {
		trigger: { player: "phaseDiscardBegin" },
		forced: true,
		filter(event, player) {
			return player.getDamagedHp() > 1 || player.countCards("h") - player.getHp() > 1;
		},
		content() {
			var num = 0;
			if (player.getDamagedHp() > 1) {
				num++;
			}
			if (player.countCards("h") - player.getHp() > 1) {
				num++;
			}
			player.addMark("kotori_qunxin_temp", num, false);
			player.addTempSkill("kotori_qunxin_temp", "phaseDiscardEnd");
		},
	},
	kotori_skill_key: {
		enable: "phaseUse",
		usable: 1,
		content() {
			"step 0";
			player.draw();
			"step 1";
			player.changeHujia(1);
			"step 2";
			var evt = event.getParent("phase");
			if (evt && evt.after) {
				var next = player.loseHp();
				event.next.remove(next);
				evt.after.push(next);
			}
		},
		ai: {
			order: 10,
			result: {
				player(player) {
					return player.hp - 1;
				},
			},
		},
	},
	kotori_skill_jin: {
		trigger: { player: "phaseDrawEnd" },
		filter(event, player) {
			var hs = player.getCards("h");
			return (
				hs.length > 0 &&
				player.getHistory("gain", function (evt) {
					if (evt.getParent().name != "draw" || evt.getParent("phaseDraw") != event) {
						return false;
					}
					for (var i of evt.cards) {
						if (hs.includes(i)) {
							return true;
						}
					}
					return false;
				}).length > 0
			);
		},
		check(event, player) {
			var hs = player.getCards("h"),
				cards = [],
				suits = [];
			player.getHistory("gain", function (evt) {
				if (evt.getParent().name != "draw" || evt.getParent("phaseDraw") != event) {
					return false;
				}
				for (var i of evt.cards) {
					if (hs.includes(i)) {
						cards.add(i);
						suits.add(get.suit(i, player));
					}
				}
			});
			return cards.length == suits.length;
		},
		content() {
			var hs = player.getCards("h"),
				cards = [],
				suits = [];
			player.getHistory("gain", function (evt) {
				if (evt.getParent().name != "draw" || evt.getParent("phaseDraw") != trigger) {
					return false;
				}
				for (var i of evt.cards) {
					if (hs.includes(i)) {
						cards.add(i);
						suits.add(get.suit(i, player));
					}
				}
			});
			player.showCards(cards, get.translation(player) + "发动了【晋势】");
			if (cards.length == suits.length) {
				player.draw();
			}
		},
	},
	kotori_qunxin_temp: {
		onremove: true,
		mod: {
			maxHandcard(player, num) {
				return num + player.countMark("kotori_qunxin_temp");
			},
		},
	},
	kotori_yumo_wei: {
		marktext: '<span class="thundertext">魔</span>',
		intro: {
			name: '<span class="thundertext">魔物</span>',
			content: "mark",
		},
	},
	kotori_yumo_shu: {
		marktext: '<span class="firetext">魔</span>',
		intro: {
			name: '<span class="firetext">魔物</span>',
			content: "mark",
		},
	},
	kotori_yumo_wu: {
		marktext: '<span class="greentext">魔</span>',
		intro: {
			name: '<span class="greentext">魔物</span>',
			content: "mark",
		},
	},
	kotori_yumo_qun: {
		marktext: '<span class="yellowtext">魔</span>',
		intro: {
			name: '<span class="yellowtext">魔物</span>',
			content: "mark",
		},
	},
	kotori_yumo_key: {
		marktext: '<span class="legendtext">魔</span>',
		intro: {
			name: '<span class="legendtext">魔物</span>',
			content: "mark",
		},
	},
	kotori_yumo_jin: {
		marktext: '<span class="icetext">魔</span>',
		intro: {
			name: '<span class="icetext">魔物</span>',
			content: "mark",
		},
	},
	kotori_huazhan: {
		charlotte: true,
		enable: "chooseToUse",
		filter(event, player) {
			var bool = false;
			var list = ["wei", "shu", "wu", "qun", "key", "jin"];
			for (var i of list) {
				if (player.hasMark("kotori_yumo_" + i) && !player.getStorage("kotori_huazhan2").includes("kotori_yumo_" + i)) {
					bool = true;
					break;
				}
			}
			return bool && event.filterCard({ name: "kaihua", isCard: true }, player, event);
		},
		chooseButton: {
			dialog(event, player) {
				return ui.create.dialog("###花绽###" + lib.translate.kotori_huazhan_info);
			},
			chooseControl(event, player) {
				var list = ["wei", "shu", "wu", "qun", "key", "jin"];
				var list2 = [];
				for (var i of list) {
					if (player.hasMark("kotori_yumo_" + i) && !player.getStorage("kotori_huazhan2").includes("kotori_yumo_" + i)) {
						list2.push("kotori_yumo_" + i);
					}
				}
				list2.push("cancel2");
				return list2;
			},
			check() {
				var player = _status.event.player;
				var list = ["wei", "shu", "wu", "qun", "key", "jin"];
				var list2 = [];
				for (var i of list) {
					if (player.hasMark("kotori_yumo_" + i) && !player.getStorage("kotori_huazhan2").includes("kotori_yumo_" + i)) {
						list2.push("kotori_yumo_" + i);
					}
				}
				if (list2.includes("kotori_yumo_wei")) {
					return "kotori_yumo_wei";
				}
				if (list2.includes("kotori_yumo_wu")) {
					return "kotori_yumo_wu";
				}
				if (list2.includes("kotori_yumo_qun")) {
					return "kotori_yumo_qun";
				}
				if (list2.includes("kotori_yumo_key")) {
					return "kotori_yumo_key";
				}
				if (
					list2.includes("kotori_yumo_shu") &&
					game.hasPlayer(function (current) {
						return current.group == "shu";
					})
				) {
					return "kotori_yumo_shu";
				}
				return "cancel2";
			},
			backup(result, player) {
				return {
					markname: result.control,
					viewAs: { name: "kaihua", isCard: true },
					filterCard() {
						return false;
					},
					selectCard: -1,
					log: false,
					precontent() {
						var name = lib.skill.kotori_huazhan_backup.markname;
						if (!player.storage.kotori_huazhan2) {
							player.storage.kotori_huazhan2 = [];
						}
						player.storage.kotori_huazhan2.push(name);
						player.addTempSkill("kotori_huazhan2");
						player.popup("花绽", get.groupnature(name.slice(12)));
						game.log(player, "发动了技能", lib.translate[name].replace(/魔物/g, "【花绽】"));
						player.removeMark(name, 1, false);
						game.log(player, "移去了一个", lib.translate[name].replace(/魔物/g, "【魔物】"));
					},
				};
			},
		},
		ai: {
			order: 1,
			result: {
				player(player) {
					if (
						player.countCards("he", function (card) {
							if (get.type(card, null, player) == "equip") {
								return get.value(card) < 6;
							}
							return get.value(card) < 5;
						}) < 2
					) {
						return 0;
					}
					return player.getUseValue({ name: "kaihua" });
				},
			},
			combo: "kotori_yumo",
		},
	},
	kotori_huazhan2: { onremove: true, charlotte: true },
	//三谷良一
	ryoichi_baoyi: {
		trigger: {
			player: "loseAfter",
			global: ["gainAfter", "equipAfter", "addJudgeAfter", "loseAsyncAfter", "addToExpansionAfter"],
		},
		filterTarget(card, player, target) {
			return target != player && (target.hasSex("female") || target.countCards("hej") > 0);
		},
		filter(event, player) {
			var evt = event.getl(player);
			return (
				evt &&
				evt.es &&
				evt.es.length > 0 &&
				game.hasPlayer(function (target) {
					return lib.skill.ryoichi_baoyi.filterTarget;
				})
			);
		},
		forced: true,
		content() {
			"step 0";
			event.count = trigger.getl(player).es.length;
			player.draw(event.count);
			"step 1";
			event.count--;
			if (
				game.hasPlayer(function (target) {
					return lib.skill.ryoichi_baoyi.filterTarget(null, player, target);
				})
			) {
				player.chooseTarget(true, lib.skill.ryoichi_baoyi.filterTarget, "请选择【爆衣】的目标").set("ai", function (target) {
					return -get.attitude(_status.event.player, target);
				});
			} else {
				event.finish();
			}
			"step 2";
			if (result.bool && result.targets && result.targets.length) {
				var target = result.targets[0];
				player.line(target, "green");
				if (target.hasSex("female")) {
					target.loseHp();
				} else {
					player.discardPlayerCard(target, 2, "hej", true);
				}
			} else {
				event.finish();
			}
			"step 3";
			if (
				event.count &&
				game.hasPlayer(function (target) {
					return lib.skill.ryoichi_baoyi.filterTarget(null, player, target);
				})
			) {
				event.goto(1);
			}
		},
	},
	ryoichi_tuipi: {
		mod: {
			targetEnabled(card) {
				if (card.name == "shunshou" || card.name == "guohe") {
					return false;
				}
			},
		},
		trigger: { player: "phaseDiscardBegin" },
		forced: true,
		content() {
			trigger.setContent(lib.skill.ryoichi_tuipi.phaseDiscardContent);
		},
		phaseDiscardContent() {
			"step 0";
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
		ai: {
			halfneg: true,
		},
	},
	//乙坂有宇
	yuu_lveduo: {
		mod: {
			cardEnabled(card, player) {
				if (player.isTurnedOver()) {
					return false;
				}
			},
			cardRespondable(card, player) {
				if (player.isTurnedOver()) {
					return false;
				}
			},
			cardSavable(card, player) {
				if (player.isTurnedOver()) {
					return false;
				}
			},
		},
		trigger: { global: "phaseBeginStart" },
		filter(event, player) {
			return player != event.player && !event.player._trueMe && !player.getStorage("yuu_lveduo").includes(event.player) && !player.isTurnedOver() && !player.hasSkill("yuu_lveduo4");
		},
		charlotte: true,
		check(event, player) {
			if (get.attitude(player, event.player) > 0) {
				return false;
			}
			if (event.player.hasJudge("lebu") || !event.player.needsToDiscard()) {
				return false;
			}
			return true;
		},
		logTarget: "player",
		content() {
			"step 0";
			player.turnOver();
			"step 1";
			if (player.isTurnedOver()) {
				player.addTempSkill("yuu_lveduo4", "roundStart");
				if (!player.storage.yuu_lveduo) {
					player.storage.yuu_lveduo = [];
				}
				player.storage.yuu_lveduo.push(trigger.player);
				trigger.player._trueMe = player;
				game.addGlobalSkill("autoswap");
				if (trigger.player == game.me) {
					game.notMe = true;
					if (!_status.auto) {
						ui.click.auto();
					}
				}
				player.addSkill("yuu_lveduo2");
				trigger.player.addSkill("yuu_lveduo3");
			}
		},
	},
	yuu_lveduo2: {
		trigger: {
			player: "turnOverEnd",
		},
		lastDo: true,
		charlotte: true,
		forceDie: true,
		forced: true,
		silent: true,
		filter(event, player) {
			return !player.isTurnedOver();
		},
		content() {
			var target = game.findPlayer(function (current) {
				return current._trueMe == player;
			});
			if (target) {
				if (target == game.me) {
					if (!game.notMe) {
						game.swapPlayerAuto(target._trueMe);
					} else {
						delete game.notMe;
					}
					if (_status.auto) {
						ui.click.auto();
					}
				}
				delete target._trueMe;
				target.removeSkill("yuu_lveduo3");
				var skills = target.getStockSkills(true, true).filter(function (skill) {
					var info = get.info(skill);
					return info && info.charlotte == true;
				});
				if (skills.length) {
					target.removeSkills(skills);
					player.addSkills(skills);
					lib.translate.yuu_lveduo_info = lib.translate.yuu_lveduo_full_info;
				}
				if (target.name == "key_yusa") {
					delete target.storage.dualside;
					target.storage.dualside_over = true;
					target.unmarkSkill("dualside");
					target.removeSkill("dualside");
				} else if (target.name == "key_misa") {
					delete target.storage.dualside;
					target.storage.dualside_over = true;
					target.unmarkSkill("dualside");
					target.reinit("key_misa", "key_yusa");
					target.removeSkill("yusa_misa");
					target.removeSkill("dualside");
					target.turnOver(false);
				}
			}
			player.removeSkill("yuu_lveduo2");
		},
	},
	yuu_lveduo3: {
		trigger: {
			player: ["phaseAfter", "dieAfter"],
			global: "phaseBefore",
		},
		lastDo: true,
		charlotte: true,
		forceDie: true,
		forced: true,
		silent: true,
		content() {
			player.removeSkill("yuu_lveduo3");
		},
		onremove(player) {
			if (player._trueMe && player._trueMe.isTurnedOver()) {
				player._trueMe.turnOver();
			}
		},
	},
	yuu_lveduo4: { charlotte: true },
	//松下五段
	godan_yuanyi: {
		trigger: { player: "phaseBegin" },
		forced: true,
		async content(event, trigger, player) {
			const num = game.roundNumber;
			if (num && typeof num == "number") {
				await player.draw(Math.min(3, num));
			}
			trigger.phaseList.splice(trigger.num, 0, `phaseUse|${event.name}`);
		},
	},
	godan_feiqu: {
		inherit: "doruji_feiqu",
	},
	godan_xiaoyuan: {
		trigger: { player: "changeHp" },
		forced: true,
		juexingji: true,
		skillAnimation: true,
		animationColor: "soil",
		filter(event, player) {
			return event.num < 0 && player.hp < 4;
		},
		content() {
			player.awakenSkill(event.name);
			player.loseMaxHp(3);
			player.draw(3);
			player.removeSkills("godan_feiqu");
		},
		ai: {
			combo: "godan_feiqu",
			halfneg: true,
		},
	},
	//游佐
	abyusa_jueqing: {
		audio: 2,
		trigger: { source: "damageBegin2" },
		skillAnimation: true,
		animationColor: "water",
		filter(event, player) {
			return player != event.player && !player.storage.abyusa_jueqing_rewrite;
		},
		prompt2(event, player) {
			var num = get.cnNumber(2 * event.num, true);
			return "令即将对其造成的伤害翻倍至" + num + "点，并令自己失去" + get.cnNumber(event.num) + "点体力";
		},
		check(event, player) {
			return (
				player.hp > event.num &&
				event.player.hp > event.num &&
				!event.player.hasSkillTag("filterDamage", null, {
					player: player,
					card: event.card,
				}) &&
				get.attitude(player, event.player) < 0
			);
		},
		locked(skill, player) {
			return player && player.storage.abyusa_jueqing_rewrite;
		},
		logTarget: "player",
		content() {
			player.loseHp(trigger.num);
			trigger.num *= 2;
			player.storage.abyusa_jueqing_rewrite = true;
		},
		derivation: "abyusa_jueqing_rewrite",
		group: "abyusa_jueqing_rewrite",
		subSkill: {
			rewrite: {
				audio: "abyusa_jueqing",
				trigger: { source: "damageBefore" },
				forced: true,
				charlotte: true,
				filter(event, player) {
					return player.storage.abyusa_jueqing_rewrite == true;
				},
				check() {
					return false;
				},
				content() {
					trigger.cancel();
					trigger.player.loseHp(trigger.num);
				},
				ai: {
					jueqing: true,
					skillTagFilter(player) {
						return player.storage.abyusa_jueqing_rewrite == true;
					},
				},
			},
		},
	},
	abyusa_dunying: {
		audio: 2,
		trigger: { player: ["phaseZhunbeiBegin", "phaseJieshuBegin"] },
		forced: true,
		filter(event, player) {
			return player.isDamaged();
		},
		content() {
			player.draw(player.getDamagedHp());
		},
		mod: {
			globalTo(from, to, num) {
				return num + to.getDamagedHp();
			},
		},
	},
	//水濑秋子
	akiko_dongcha: {
		trigger: { global: "phaseBefore" },
		forced: true,
		filter(event, player) {
			return get.mode() == "identity" && game.phaseNumber == 0;
		},
		content() {
			var func = function () {
				game.countPlayer(function (current) {
					current.setIdentity();
				});
			};
			if (player == game.me) {
				func();
			} else if (player.isOnline()) {
				player.send(func);
			}
			if (!player.storage.zhibi) {
				player.storage.zhibi = [];
			}
			player.storage.zhibi.addArray(game.players);
		},
		ai: {
			viewHandcard: true,
			skillTagFilter(player, tag, arg) {
				if (player == arg) {
					return false;
				}
			},
		},
	},
	//美坂香里
	kaori_siyuan: {
		enable: "phaseUse",
		filter(event, player) {
			return player.countCards("he", lib.skill.kaori_siyuan.filterCard);
		},
		filterCard(card) {
			return ["equip", "delay"].includes(get.type(card));
		},
		filterTarget(card, player, target) {
			if (player == target) {
				return false;
			}
			var card = ui.selected.cards[0];
			if (get.type(card) == "delay") {
				return target.canAddJudge({ name: get.name(card, player) });
			}
			return target.canEquip(card);
		},
		discard: false,
		lose: false,
		prepare: "give",
		content() {
			"step 0";
			var card = cards[0];
			if (get.type(card) == "equip") {
				target.equip(card);
			} else {
				target.addJudge(get.name(card, player), [card]);
			}
			"step 1";
			var list = [];
			for (var i of lib.inpile) {
				var type = get.type(i);
				if (type == "basic" || type == "trick") {
					list.push([type, "", i]);
				}
				if (i == "sha") {
					for (var j of lib.inpile_nature) {
						list.push([type, "", i, j]);
					}
				}
			}
			player
				.chooseButton(["是否视为使用一张基本牌或普通锦囊牌？", [list, "vcard"]])
				.set("filterButton", function (button) {
					return player.hasUseTarget({
						name: button.link[2],
						nature: button.link[3],
						isCard: true,
					});
				})
				.set("ai", function (button) {
					return player.getUseValue({
						name: button.link[2],
						nature: button.link[3],
						isCard: true,
					});
				});
			"step 2";
			if (result.bool) {
				player.chooseUseTarget(true, {
					name: result.links[0][2],
					nature: result.links[0][3],
					isCard: true,
				});
			}
		},
		ai: {
			basic: {
				order: 10,
			},
			result: {
				target(player, target) {
					var card = ui.selected.cards[0];
					if (card) {
						return get.effect(target, card, target, target);
					}
					return 0;
				},
			},
		},
	},
	//美坂栞
	shiori_huijuan: {
		trigger: { global: "phaseJieshuBegin" },
		locked: true,
		filter(event, player) {
			return (
				event.player != player &&
				event.player.getHistory("useCard", function (evt) {
					return (
						evt.isPhaseUsing() &&
						["basic", "trick"].includes(get.type(evt.card)) &&
						player.hasUseTarget({
							name: evt.card.name,
							nature: evt.card.nature,
							isCard: true,
						})
					);
				}).length > 0
			);
		},
		async cost(event, trigger, player) {
			const list = [];
			trigger.player.getHistory("useCard", function (evt) {
				if (!evt.isPhaseUsing() || !["basic", "trick"].includes(get.type(evt.card))) {
					return;
				}
				if (evt.card.name == "sha" && evt.card.nature) {
					list.add("sha:" + evt.card.nature);
				} else {
					list.add(evt.card.name);
				}
			});
			for (var i = 0; i < list.length; i++) {
				if (list[i].indexOf("sha:") == 0) {
					list[i] = ["基本", "", "sha", list[i].slice(4)];
				} else {
					list[i] = [get.type(list[i]), "", list[i]];
				}
			}
			const { result } = await player
				.chooseButton([get.prompt(event.skill), [list, "vcard"]])
				.set("filterButton", function (button) {
					return player.hasUseTarget({
						name: button.link[2],
						nature: button.link[3],
						isCard: true,
					});
				})
				.set("ai", function (button) {
					return player.getUseValue({
						name: button.link[2],
						nature: button.link[3],
						isCard: true,
					});
				});
			if (result.bool) {
				event.result = {
					bool: true,
					cost_data: {
						card: {
							name: result.links[0][2],
							nature: result.links[0][3],
							isCard: true,
						},
					},
				};
			}
		},
		async content(event, trigger, player) {
			player.chooseUseTarget(true, event.cost_data.card);
			player.getStat("skill").shiori_huijuan = 1;
		},
		group: "shiori_huijuan_discard",
	},
	shiori_huijuan_discard: {
		trigger: { player: "phaseZhunbeiBegin" },
		filter(event, player) {
			var num = 0;
			var stat = player.stat;
			for (var i = stat.length - 2; i--; i >= 0) {
				if (stat[i].isMe) {
					break;
				}
				if (stat[i].skill && stat[i].skill.shiori_huijuan) {
					num++;
				}
			}
			return num >= Math.max(2, game.countPlayer() / 2);
		},
		forced: true,
		content() {
			"step 0";
			if (!player.countDiscardableCards(player, "ej")) {
				event._result = { bool: false };
			} else {
				player.discardPlayerCard(player, "ej").set("ai", function (button) {
					var card = button.link;
					var player = _status.event.player;
					if (get.position(card) == "j") {
						return 7 + Math.random();
					}
					return 4 + player.needsToDiscard() - get.value(card);
				});
			}
			"step 1";
			if (!result.bool) {
				player.skip("phaseUse");
			}
		},
	},
	//野村美希
	miki_shenqiang: {
		trigger: {
			global: "phaseBefore",
			player: "enterGame",
		},
		forced: true,
		filter(event, player) {
			return event.name != "phase" || game.phaseNumber == 0;
		},
		content() {
			player.equip(game.createCard2("miki_hydrogladiator", "club", 6));
			player.equip(game.createCard2("miki_binoculars", "diamond", 6));
		},
		mod: {
			canBeDiscarded(card) {
				if (get.position(card) == "e" && ["equip1", "equip5"].includes(get.subtype(card))) {
					return false;
				}
			},
		},
	},
	miki_huanmeng: {
		inherit: "kamome_huanmeng",
	},
	miki_zhiluo: {
		trigger: { global: "phaseEnd" },
		filter(event, player) {
			return !event.player.countCards("e") && player.inRange(event.player);
		},
		locked: true,
		async cost(event, trigger, player) {
			event.result = { bool: true, cost_data: { index: 0 } };
			if (player.canUse("sha", trigger.player, false)) {
				const { index } = await player
					.chooseControl()
					.set("prompt", "制裸：请选择一项")
					.set("choiceList", ["摸一张牌", "视为对" + get.translation(trigger.player) + "使用一张【杀】"])
					.set("ai", function () {
						if (get.effect(_status.event.getTrigger().player, { name: "sha" }, _status.event.player) > 0) {
							return 1;
						}
						return 0;
					})
					.forResult();
				event.result.cost_data.index = index;
			}
		},
		async content(event, trigger, player) {
			const result = event.cost_data;
			if (result.index == 0) {
				player.logSkill("miki_zhiluo");
				player.draw();
			} else {
				player.useCard({ name: "sha", isCard: true }, trigger.player, "miki_zhiluo");
			}
		},
	},
	miki_hydrogladiator_skill: {
		trigger: {
			source: "damageSource",
		},
		locked: true,
		popup: "海德洛",
		filter(event, player) {
			return (
				event.getParent().name == "sha" &&
				game.hasPlayer(function (current) {
					return (current == event.player || (current != player && get.distance(current, event.player) <= 1)) && current.countDiscardableCards(player, "he") > 0;
				})
			);
		},
		cost() {
			"step 0";
			var list = [];
			var choiceList = [];
			if (trigger.player.countDiscardableCards(player, "he") > 0) {
				list.push(true);
				choiceList.push("弃置" + get.translation(trigger.player) + "的两张牌");
			}
			if (
				game.hasPlayer(function (current) {
					return current != player && get.distance(current, trigger.player) <= 1;
				})
			) {
				list.push(false);
				choiceList.push("弃置所有至" + get.translation(trigger.player) + "距离为1的角色的各一张牌");
			}
			event.list = list;
			if (list.length == 1) {
				event._result = { index: 0 };
			} else {
				player
					.chooseControl()
					.set("choiceList", choiceList)
					.set("prompt", "海德洛格拉迪尔特·改")
					.set("ai", function () {
						var player = _status.event.player;
						var source = _status.event.getTrigger().player;
						var num = game.countPlayer(function (current) {
							if (current != player && get.distance(current, source) <= 1 && current.countDiscardableCards(player, "he") > 0) {
								return -get.sgn(get.attitude(player, current));
							}
						});
						if (num > Math.min(2, source.countDiscardableCards(player, "he"))) {
							return 1;
						}
						return 0;
					});
			}
			"step 1";
			if (event.list[result.index]) {
				event.result = {
					bool: true,
					cost_data: { type: "single" },
					targets: [trigger.player],
				};
			} else {
				event.result = {
					bool: true,
					cost_data: { type: "multiple" },
					targets: game
						.filterPlayer(function (current) {
							return current != player && get.distance(current, trigger.player) <= 1;
						})
						.sortBySeat(),
				};
			}
		},
		content() {
			"step 0";
			if (event.cost_data.type == "single") {
				player.discardPlayerCard(targets[0], "he", 2, true);
				event.finish();
			}
			"step 1";
			var target = targets.shift();
			if (target.countDiscardableCards(player, "he") > 0) {
				player.discardPlayerCard(target, "he", true);
			}
			if (targets.length) {
				event.redo();
			}
		},
	},
	miki_binoculars: {
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
	//关根诗织&入江美雪
	shiorimiyuki_banyin: {
		audio: 2,
		trigger: { player: ["damageEnd", "recoverEnd"] },
		filter(event, player) {
			return game.hasPlayer(function (current) {
				return current != player && current.isDamaged();
			});
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt(event.skill), "令一名其他角色回复1点体力", lib.filter.notMe)
				.set("ai", function (target) {
					var player = _status.event.player;
					return get.recoverEffect(target, player, player);
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			target.recover();
		},
	},
	shiorimiyuki_tingxian: {
		audio: 2,
		trigger: { player: "phaseUseBegin" },
		async cost(event, trigger, player) {
			const { control, index } = await player
				.chooseControl("一张", "两张", "三张", "cancel2")
				.set("prompt", get.prompt2(event.skill))
				.set("ai", function () {
					var player = _status.event.player;
					var max = Math.min(player.hp + 1, player.maxHp);
					var min = Math.min(Math.max(max - 2, max - player.hp), 3);
					if (min) {
						return min - 1;
					}
					return 3;
				})
				.forResult();
			if (control != "cancel2") {
				event.result = { bool: true, cost_data: index };
			}
		},
		async content(event, trigger, player) {
			let num = 1 + event.cost_data;
			await player.draw(num).set("gaintag", ["shiorimiyuki_tingxian"]);
			await player.recover();
			player.addTempSkill("shiorimiyuki_tingxian2", "phaseUseAfter");
		},
		group: "shiorimiyuki_tingxian1",
	},
	shiorimiyuki_tingxian1: { audio: true },
	shiorimiyuki_tingxian2: {
		audio: true,
		trigger: { player: "phaseUseEnd" },
		forced: true,
		charlotte: true,
		mod: {
			aiOrder(player, card, num) {
				if (get.itemtype(card) == "card" && card.hasGaintag("shiorimiyuki_tingxian")) {
					return num + 2;
				}
			},
			aiValue(player, card, num) {
				if (get.itemtype(card) == "card" && card.hasGaintag("shiorimiyuki_tingxian")) {
					return 0;
				}
			},
		},
		filter(event, player) {
			return (
				player.countCards("h", function (card) {
					return card.hasGaintag("shiorimiyuki_tingxian");
				}) > 0
			);
		},
		content() {
			player.loseHp(
				player.countCards("h", function (card) {
					return card.hasGaintag("shiorimiyuki_tingxian");
				})
			);
			player.removeGaintag("shiorimiyuki_tingxian");
		},
	},
	//中津静流
	shizuru_nianli: {
		enable: "chooseToUse",
		charlotte: true,
		prompt: "展示一张♦/♣/♥/♠手牌，然后视为使用一张雷【杀】/【闪】/【桃】/【无懈可击】",
		viewAs(cards, player) {
			var name = false;
			var nature = null;
			switch (get.suit(cards[0], player)) {
				case "club":
					name = "shan";
					break;
				case "diamond":
					name = "sha";
					nature = "thunder";
					break;
				case "spade":
					name = "wuxie";
					break;
				case "heart":
					name = "tao";
					break;
			}
			if (name) {
				return { name: name, nature: nature, isCard: true };
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
						player.countCards("h", function (card) {
							return get.suit(card, player) == map[name];
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
					return 1;
				}
				return 0;
			}
			return 1;
		},
		ignoreMod: true,
		filterCard(card, player, event) {
			event = event || _status.event;
			var filter = event._backup.filterCard;
			var name = get.suit(card, player);
			if (name == "club" && filter({ name: "shan" }, player, event)) {
				return true;
			}
			if (name == "diamond" && filter({ name: "sha", nature: "thunder" }, player, event)) {
				return true;
			}
			if (name == "spade" && filter({ name: "wuxie" }, player, event)) {
				return true;
			}
			if (name == "heart" && filter({ name: "tao" }, player, event)) {
				return true;
			}
			return false;
		},
		filter(event, player) {
			if (player.hasSkill("shizuru_nianli_round")) {
				return false;
			}
			var filter = event.filterCard;
			if (filter({ name: "sha", nature: "thunder" }, player, event) && player.countCards("h", { suit: "diamond" })) {
				return true;
			}
			if (filter({ name: "shan" }, player, event) && player.countCards("h", { suit: "club" })) {
				return true;
			}
			if (filter({ name: "tao" }, player, event) && player.countCards("h", { suit: "heart" })) {
				return true;
			}
			if (filter({ name: "wuxie" }, player, event) && player.countCards("h", { suit: "spade" })) {
				return true;
			}
			return false;
		},
		log: false,
		precontent() {
			player.logSkill("shizuru_nianli");
			player.addTempSkill("shizuru_nianli_clear");
			player.addTempSkill("shizuru_nianli_round", "roundStart");
			player.showCards(get.translation(player) + "发动了【念力】", event.result.cards.slice(0));
			event.result.card.cards = [];
			event.result.cards = [];
			delete event.result.card.suit;
			delete event.result.card.number;
			event.getParent().addCount = false;
			event.getParent().shizuru_nianli = true;
		},
		ai: {
			respondSha: true,
			respondShan: true,
			skillTagFilter(player, tag) {
				if (player.hasSkill("shizuru_nianli_round")) {
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
				if (!player.countCards("h", { suit: name })) {
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
							player.countCards("h", function (card) {
								return get.suit(card, player) == map[name];
							}) > 0 &&
							player.getUseValue({
								name: name,
								nature: name == "sha" ? "thunder" : null,
							}) > 0
						) {
							var temp = get.order({
								name: name,
								nature: name == "sha" ? "thunder" : null,
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
			if (name == "wuxie") {
				return (
					player.countCards("h", function (card) {
						return _status.connectMode || get.suit(card) == "spade";
					}) > 0 && !player.hasSkill("shizuru_nianli_round")
				);
			}
			if (name == "tao") {
				return player.countCards("h", { suit: "heart" }) > 0 && !player.hasSkill("shizuru_nianli_round");
			}
			return false;
		},
		subSkill: {
			round: {
				charlotte: true,
				mark: true,
				intro: { content: "本轮已发动" },
			},
			clear: {
				charlotte: true,
				trigger: { player: "useCardAfter" },
				lastDo: true,
				silent: true,
				filter(event, player) {
					return event.getParent().shizuru_nianli == true;
				},
				content() {
					player.getHistory("useCard").remove(trigger);
				},
			},
		},
	},
	shizuru_benzhan: {
		trigger: { global: ["useCard", "respond"] },
		usable: 1,
		filter(event, player) {
			return Array.isArray(event.respondTo) && event.respondTo[0] != event.player && [event.respondTo[0], event.player].includes(player);
		},
		async cost(event, trigger, player) {
			event.type = get.type(trigger.card) == "basic";
			var prompt = event.type ? "令一名角色摸两张牌或弃置两张牌" : "令一名角色回复1点体力或对其造成1点伤害";
			event.result = await player
				.chooseTarget(get.prompt(event.skill), prompt)
				.set("ai", function (target) {
					var player = _status.event.player;
					if (_status.event.getParent().type) {
						var att = get.attitude(player, target);
						if (target.hasSkillTag("nogain")) {
							return -att;
						}
						if (target.countCards("he") == 1 && att < 0) {
							att /= 2;
						}
						return Math.abs(att) * (1 + 0.1 * Math.min(0, 5 - target.countCards("h")));
					}
					return Math.max(get.recoverEffect(target, player, player), get.damageEffect(target, player, player));
				})
				.forResult();
		},
		content() {
			"step 0";
			event.type = get.type(trigger.card) == "basic";
			var target = event.targets[0];
			event.target = target;
			var trans = get.translation(target);
			var list;
			if (event.type) {
				if (!target.countCards("he")) {
					event._result = { index: 0 };
				} else {
					list = ["令" + trans + "摸两张牌", "令" + trans + "弃置两张牌"];
				}
			} else {
				if (target.isHealthy()) {
					event._result = { index: 1 };
				} else {
					list = ["令" + trans + "回复1点体力", "对" + trans + "造成1点伤害"];
				}
			}
			player
				.chooseControl()
				.set("choiceList", list)
				.set(
					"choice",
					(function () {
						if (event.type) {
							return get.attitude(player, target) > 0 ? 0 : 1;
						}
						return get.recoverEffect(target, player, player) > get.damageEffect(target, player, player) ? 0 : 1;
					})()
				)
				.set("ai", function () {
					return _status.event.choice;
				});
			"step 1";
			player.addExpose(0.2);
			if (event.type) {
				if (result.index == 0) {
					target.draw(2);
				} else {
					target.chooseToDiscard(2, "he", true);
				}
			} else {
				if (result.index == 0) {
					target.recover();
				} else {
					target.damage();
				}
			}
		},
	},
	//岬镜子
	kyoko_juwu: {
		trigger: {
			global: ["loseAfter", "cardsDiscardAfter", "loseAsyncAfter", "equipAfter"],
		},
		filter(event, player) {
			if (player == _status.currentPhase) {
				return false;
			}
			var cards = event.getd();
			if (!cards.length) {
				return false;
			}
			cards.removeArray(event.getd(player));
			for (var card of cards) {
				if (get.position(card, true) == "d" && get.type(card, null, false) == "equip") {
					return true;
				}
			}
			return false;
		},
		autodelay(event, player) {
			return event.delay === false;
		},
		async cost(event, trigger, player) {
			var cards = trigger.getd();
			cards.removeArray(trigger.getd(player));
			cards = cards.filter(function (card) {
				if (get.position(card, true) == "d" && get.type(card, null, false) == "equip") {
					return true;
				}
			});
			const { result } = await player.chooseButton([get.prompt(event.skill), cards], [1, cards.length]).set("ai", function () {
				return 1;
			});
			if (result.bool) {
				event.result = {
					bool: true,
					cards: result.links,
				};
			}
		},
		async content(event, trigger, player) {
			await player.gain(event.cards, "gain2", "log");
		},
	},
	kyoko_zhengyi: {
		locked: true,
		group: ["kyoko_jingce", "kyoko_shelie", "kyoko_zhiheng"],
		count(player) {
			var list = [];
			player.countCards("e", function (card) {
				list.add(get.suit(card, player));
			});
			return list.length;
		},
	},
	kyoko_jingce: {
		trigger: { player: ["phaseUseEnd", "phaseJieshuBegin"] },
		filter(event, player) {
			var num = lib.skill.kyoko_zhengyi.count(player);
			if (!num || (event.name == "phaseUse") == num > 3) {
				return false;
			}
			return (
				player.getHistory("useCard", function (evt) {
					return event.name != "phaseUse" || evt.getParent("phaseUse") == event;
				}).length >= player.hp
			);
		},
		frequent: true,
		content() {
			"step 0";
			if (trigger.name == "phaseUse") {
				player.draw(2);
				event.finish();
				return;
			}
			var list = [],
				history = player.getHistory("useCard");
			for (var i of history) {
				list.add(get.suit(i.card));
				if (list.length >= player.hp) {
					break;
				}
			}
			if (list.length >= player.hp) {
				event.goon = true;
			} else {
				player.chooseControl("摸牌阶段", "出牌阶段").set("prompt", "精策：选择要执行的额外阶段");
			}
			"step 1";
			if (event.goon || result.index == 0) {
				var next = player.phaseDraw();
				event.next.remove(next);
				trigger.getParent().next.push(next);
			}
			if (event.goon || result.index == 1) {
				var next = player.phaseUse();
				event.next.remove(next);
				trigger.getParent().next.push(next);
			}
		},
	},
	kyoko_shelie: {
		audio: 2,
		trigger: { player: "phaseDrawBegin1" },
		filter(event, player) {
			return !event.numFixed && lib.skill.kyoko_zhengyi.count(player) > 1;
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
			var next = player.chooseButton([0, 5], true);
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
	},
	kyoko_zhiheng: {
		enable: "phaseUse",
		usable: 1,
		position: "he",
		filter(event, player) {
			return lib.skill.kyoko_zhengyi.count(player) > 2;
		},
		prompt() {
			var str = "弃置任意张牌并摸等量的牌";
			if (lib.skill.kyoko_zhengyi.count(_status.event.player) > 3) {
				str += "，若弃置了所有手牌则多摸一张牌。";
			}
			return str;
		},
		filterCard: lib.filter.cardDiscardable,
		discard: false,
		lose: false,
		delay: false,
		selectCard: [1, Infinity],
		allowChooseAll: true,
		check(card) {
			var player = _status.event.player;
			if (get.position(card) == "h") {
				return 8 - get.value(card);
			}
			if (get.position(card) == "e") {
				let subs = get.subtypes(card);
				if (subs.includes("equip2") || subs.includes("equip3")) {
					return player.getHp() - get.value(card);
				}
			}
			return 6 - get.value(card);
		},
		content() {
			"step 0";
			player.discard(cards);
			event.num = 1;
			var hs = player.getCards("h");
			if (!hs.length || lib.skill.kyoko_zhengyi.count(player) < 4) {
				event.num = 0;
			} else {
				for (var i = 0; i < hs.length; i++) {
					if (!cards.includes(hs[i])) {
						event.num = 0;
						break;
					}
				}
			}
			"step 1";
			player.draw(event.num + cards.length);
		},
		ai: {
			order: 1,
			result: {
				player: 1,
			},
		},
	},
	//音无结弦（3v3）
	yuzuru_bujin: {
		global: "yuzuru_bujin2",
		trigger: { global: "phaseDrawBegin" },
		forced: true,
		logTarget: "player",
		filter(event, player) {
			return event.player != player && event.player.isFriendOf(player);
		},
		content() {
			trigger.num++;
		},
	},
	yuzuru_bujin2: {
		mod: {
			globalFrom(from, to, num) {
				return (
					num -
					game.countPlayer(function (current) {
						return current != from && current.hasSkill("yuzuru_bujin") && current.isFriendOf(from);
					})
				);
			},
		},
	},
	//西园美鱼
	mio_tuifu: {
		trigger: { global: "damageBegin1" },
		forced: true,
		filter(event, player) {
			return event.source && event.source.sameSexAs(event.player);
		},
		content() {
			player.draw();
		},
	},
	mio_tishen: {
		trigger: { player: "phaseZhunbeiBegin" },
		limited: true,
		forceunique: true,
		charlotte: true,
		skillAnimation: true,
		animationColor: "water",
		filter(event, player) {
			return player.isDamaged();
		},
		check(event, player) {
			if (![player.name1, player.name2].includes("key_mio")) {
				return false;
			}
			return player.hp <= 1 || player.getDamagedHp() > 1;
		},
		content() {
			player.awakenSkill(event.name);
			var num = player.maxHp - player.hp;
			player.recover(num);
			player.draw(num);
			if (_status.characterlist && _status.characterlist.includes("key_midori")) {
				player.reinitCharacter("key_mio", "key_midori", false);
			}
		},
	},
	//西园美鸟
	midori_nonghuan: {
		enable: "phaseUse",
		usable(skill, player) {
			return player.hp;
		},
		charlotte: true,
		filter(event, player) {
			return game.hasPlayer(target => lib.skill.midori_nonghuan.filterTarget(null, player, target));
		},
		filterTarget(card, player, target) {
			var stat = player.getStat("midori_nonghuan");
			return target != player && (!stat || !stat.includes(target)) && target.countGainableCards(player, "hej") > 0;
		},
		content() {
			"step 0";
			var stat = player.getStat();
			if (!stat.midori_nonghuan) {
				stat.midori_nonghuan = [];
			}
			stat.midori_nonghuan.push(target);
			player.gainPlayerCard(target, "hej", true);
			player.draw();
			"step 1";
			if (player.countCards("he") > 0) {
				player.chooseCard("he", true, "交给" + get.translation(target) + "一张牌");
			} else {
				event.goto(3);
			}
			"step 2";
			player.give(result.cards, target);
			"step 3";
			var history = game.getGlobalHistory("cardMove");
			for (var i = 0; i < history.length; i++) {
				if (history[i].getParent("midori_nonghuan") == event) {
					history.splice(i--, 1);
				}
			}
			game.countPlayer2(function (current) {
				var history = current.getHistory("lose");
				for (var i = 0; i < history.length; i++) {
					if (history[i].getParent("midori_nonghuan") == event) {
						history.splice(i--, 1);
					}
				}
				var history = current.getHistory("gain");
				for (var i = 0; i < history.length; i++) {
					if (history[i].getParent("midori_nonghuan") == event) {
						history.splice(i--, 1);
					}
				}
			});
		},
		ai: {
			order: 9,
			result: {
				player() {
					return lib.card.shunshou.ai.result.player.apply(this, arguments);
				},
				target() {
					return lib.card.shunshou.ai.result.target.apply(this, arguments);
				},
			},
		},
	},
	midori_tishen: {
		trigger: { player: "phaseZhunbeiBegin" },
		limited: true,
		charlotte: true,
		forceunique: true,
		skillAnimation: true,
		animationColor: "water",
		filter(event, player) {
			return player.isDamaged();
		},
		check(event, player) {
			if (![player.name1, player.name2].includes("key_midori")) {
				return false;
			}
			return player.hp <= 1 || player.getDamagedHp() > 1;
		},
		content() {
			player.awakenSkill(event.name);
			var num = player.maxHp - player.hp;
			player.recover(num);
			player.draw(num);
			if (_status.characterlist && _status.characterlist.includes("key_mio")) {
				player.reinitCharacter("key_midori", "key_mio", false);
			}
		},
	},
	//立华奏
	kanade_mapo: {
		audio: 2,
		derivation: "mapodoufu",
		enable: "chooseToUse",
		viewAs: { name: "mapodoufu" },
		filterCard: { suit: "heart" },
		viewAsFilter(player) {
			return player.countCards("hes", { suit: "heart" }) > 0;
		},
		position: "hes",
		mod: {
			selectTarget(card, player, range) {
				if (card.name == "mapodoufu" && range[1] != -1) {
					range[1]++;
				}
			},
		},
		check(card) {
			var player = _status.event.player;
			if (
				game.countPlayer(function (current) {
					return player.canUse("mapodoufu", current) && get.effect(current, { name: "mapodoufu" }, player, player) > 0;
				}) > 1
			) {
				return 6 - get.value(card);
			}
			return 4 - get.value(card);
		},
	},
	kanade_benzhan: {
		audio: 3,
		trigger: { global: ["useCard", "respond"] },
		usable: 1,
		filter(event, player) {
			return Array.isArray(event.respondTo) && event.respondTo[0] != event.player && [event.respondTo[0], event.player].includes(player);
		},
		async cost(event, trigger, player) {
			event.type = get.type(trigger.card) == "basic";
			var prompt = event.type ? "令一名角色摸两张牌或弃置两张牌" : "令一名角色回复1点体力或对其造成1点伤害";
			event.result = await player
				.chooseTarget(get.prompt(event.skill), prompt)
				.set("ai", function (target) {
					var player = _status.event.player;
					if (_status.event.getParent().type) {
						var att = get.attitude(player, target);
						if (target.hasSkillTag("nogain")) {
							return -att;
						}
						if (target.countCards("he") == 1 && att < 0) {
							att /= 2;
						}
						return Math.abs(att) * (1 + 0.1 * Math.min(0, 5 - target.countCards("h")));
					}
					return Math.max(get.recoverEffect(target, player, player), get.damageEffect(target, player, player));
				})
				.forResult();
		},
		content() {
			"step 0";
			event.type = get.type(trigger.card) == "basic";
			var target = event.targets[0];
			event.target = target;
			var trans = get.translation(target);
			var list;
			if (event.type) {
				if (!target.countCards("he")) {
					event._result = { index: 0 };
				} else {
					list = ["令" + trans + "摸两张牌", "令" + trans + "弃置两张牌"];
				}
			} else {
				if (target.isHealthy()) {
					event._result = { index: 1 };
				} else {
					list = ["令" + trans + "回复1点体力", "对" + trans + "造成1点伤害"];
				}
			}
			player
				.chooseControl()
				.set("choiceList", list)
				.set(
					"choice",
					(function () {
						if (event.type) {
							return get.attitude(player, target) > 0 ? 0 : 1;
						}
						return get.recoverEffect(target, player, player) > get.damageEffect(target, player, player) ? 0 : 1;
					})()
				)
				.set("ai", function () {
					return _status.event.choice;
				});
			"step 1";
			player.addExpose(0.2);
			if (event.type) {
				if (result.index == 0) {
					target.draw(2);
				} else {
					target.chooseToDiscard(2, "he", true);
				}
			} else {
				if (result.index == 0) {
					target.recover();
				} else {
					target.damage();
				}
			}
		},
	},
	//音无结弦
	yuzuru_wuxin: {
		trigger: { player: "phaseJieshuBegin" },
		async cost(event, trigger, player) {
			event.result = await player
				.chooseCardTarget({
					filterTarget() {
						if (ui.selected.cards.length) {
							return false;
						}
						return true;
					},
					filterCard() {
						if (ui.selected.targets.length) {
							return false;
						}
						return lib.filter.cardDiscardable.apply(this, arguments);
					},
					selectTarget() {
						if (!ui.selected.cards.length) {
							return [1, 1];
						}
						return [0, 0];
					},
					selectCard() {
						if (ui.selected.targets.length) {
							return [0, 0];
						}
						if (!ui.selected.cards.length) {
							return [0, 2];
						}
						return [2, 2];
					},
					prompt: get.prompt2(event.skill),
					complexCard: true,
					complexTarget: true,
					ai1(card) {
						var player = _status.event.player;
						if (player.hp > 3) {
							return 0;
						}
						return player.getDamagedHp() * 2 - get.value(card);
					},
					ai2(target) {
						if (player.hp < 4 || target.hasSkillTag("nogain")) {
							return 0;
						}
						return get.attitude(_status.event.player, target);
					},
				})
				.forResult();
		},
		async content(event, trigger, player) {
			if (event.cards && event.cards.length) {
				player.discard(event.cards);
				player.recover();
			} else {
				const target = event.targets[0];
				player.loseHp();
				target.draw(2);
			}
		},
	},
	yuzuru_deyi: {
		derivation: ["yuzuru_kunfen", "yuzuru_quji", "yuzuru_wangsheng", "yuzuru_kunfen_rewrite", "yuzuru_quji_rewrite"],
		trigger: { global: "dieAfter" },
		forced: true,
		juexingji: true,
		skillAnimation: true,
		animationColor: "orange",
		content() {
			player.awakenSkill(event.name);
			player.changeSkills(["yuzuru_kunfen", "yuzuru_quji", "yuzuru_wangsheng"], ["yuzuru_wuxin"]);
			player.loseMaxHp();
			player.recover();
		},
	},
	yuzuru_kunfen: {
		trigger: { player: "phaseJieshuBegin" },
		forced: true,
		content() {
			"step 0";
			if (!player.storage._yuzuru_sss) {
				player.loseHp();
			}
			player.draw(2);
			"step 1";
			if (player.countCards("he") < 2) {
				event.finish();
			} else {
				player.chooseCardTarget({
					selectCard: 2,
					filterTarget: lib.filter.notMe,
					prompt: "是否交给一名其他角色两张牌？",
					position: "he",
					ai1(card) {
						var player = _status.event.player;
						if (player.maxHp - player.hp == 1 && card.name == "du") {
							return 30;
						}
						var check = player.countCards("h") - 2;
						if (check < 1) {
							return 0;
						}
						if (player.hp > 1 && check < 2) {
							return 0;
						}
						return get.unuseful(card) + 9;
					},
					ai2(target) {
						var att = get.attitude(_status.event.player, target);
						if (ui.selected.cards.length == 1 && ui.selected.cards[0].name == "du") {
							return 1 - att;
						}
						return att - 2;
					},
				});
			}
			"step 2";
			if (result.bool) {
				player.give(result.cards, result.targets[0]);
			}
		},
	},
	yuzuru_quji: {
		audio: 2,
		enable: "phaseUse",
		usable: 1,
		position: "he",
		filterCard: true,
		selectCard() {
			var player = _status.event.player;
			return player.getDamagedHp();
		},
		filterTarget(card, player, target) {
			return target != player && target.hp < target.maxHp;
		},
		filter(event, player) {
			return player.hp < player.maxHp;
		},
		selectTarget() {
			return [1, ui.selected.cards.length];
		},
		complexSelect: true,
		check(card) {
			if (!_status.event.player.storage._yuzuru_sss && get.color(card) == "black") {
				return -1;
			}
			return 9 - get.value(card);
		},
		line: { color: [194, 117, 92] },
		content() {
			"step 0";
			target.recover();
			"step 1";
			if (target == targets[targets.length - 1] && !player.storage._yuzuru_sss) {
				for (var i = 0; i < cards.length; i++) {
					if (get.color(cards[i], player) == "black") {
						player.loseHp();
						break;
					}
				}
			}
		},
		ai: {
			result: {
				target: 1,
			},
			order: 6,
		},
	},
	yuzuru_wangsheng: {
		trigger: { player: "dieBegin" },
		forced: true,
		juexingji: true,
		skillAnimation: true,
		animationColor: "soil",
		content() {
			"step 0";
			trigger.cancel();
			player.awakenSkill(event.name);
			player.storage._yuzuru_sss = true;
			if (player.countCards("he") > 0) {
				player.chooseCardTarget({
					selectCard: [1, Infinity],
					filterTarget: lib.filter.notMe,
					prompt: "将任意张牌交给一名其他角色，或点【取消】。",
					position: "he",
					ai1(card) {
						var player = _status.event.player;
						if (
							get.suit(card, false) == "heart" &&
							game.hasPlayer(function (current) {
								return current.hasSkill("kanade_mapo") && get.attitude(player, current) > 0;
							})
						) {
							return 1;
						}
						return 0;
					},
					ai2(kanade) {
						if (kanade.hasSkill("kanade_mapo") && get.attitude(_status.event.player, kanade) > 0) {
							return 2;
						}
						return 0;
					},
				});
			} else {
				event.goto(2);
			}
			"step 1";
			if (result.bool) {
				player.give(result.cards, result.targets[0]);
			}
			"step 2";
			player.loseMaxHp();
			"step 3";
			if (player.hp < 2) {
				player.recover(2 - player.hp);
			}
		},
	},
	//空门苍
	ao_xishi: {
		trigger: {
			player: ["useCard", "respond"],
			target: "useCardToTargeted",
		},
		forced: true,
		filter(event, player, name) {
			return (name == "useCard" || name == "respond" || event.player != player) && get.suit(event.card) == "diamond";
		},
		content() {
			player.draw();
		},
	},
	ao_kuihun: {
		trigger: { global: "dying" },
		logTarget: "player",
		line: "thunder",
		filter(event, player) {
			return player != event.player;
		},
		content() {
			"step 0";
			player.draw();
			"step 1";
			if (!trigger.player.countCards("h")) {
				event.finish();
			} else {
				player.chooseButton(["选择一张牌作为「蝶」", trigger.player.getCards("h")]).set("ai", function (button) {
					var val = get.buttonValue(button);
					if (get.attitude(_status.event.player, get.owner(button.link)) <= 0) {
						return 10 + val;
					}
					if (val <= 0) {
						return 20;
					}
					if (button.link.name == "tao" || button.link.name == "jiu") {
						return 0;
					}
					return 1 / val;
				});
			}
			"step 2";
			if (result.bool) {
				player.addToExpansion(result.links, trigger.player, "give").set("log", false).gaintag.add("ao_diegui");
				game.log(result.links, "飞向了", player);
			}
		},
		locked: false,
		mod: {
			targetInRange(card, player) {
				const cardSuit = get.suit(card, false);
				const list = player.getExpansions("ao_diegui");
				for (let i = 0; i < list.length; i++) {
					if (cardSuit === "unsure" || get.suit(list[i], false) === cardSuit) {
						return true;
					}
				}
			},
			cardUsable(card, player) {
				const cardSuit = get.suit(card, false);
				const list = player.getExpansions("ao_diegui");
				for (let i = 0; i < list.length; i++) {
					if (cardSuit === "unsure" || get.suit(list[i], false) === cardSuit) {
						return Infinity;
					}
				}
			},
			maxHandcard(player, num) {
				return num + player.getExpansions("ao_diegui").length;
			},
		},
	},
	ao_shixin: {
		derivation: "ao_diegui",
		trigger: { player: "phaseZhunbeiBegin" },
		juexingji: true,
		forced: true,
		skillAnimation: true,
		animationColor: "key",
		filter(event, player) {
			var list = player.getExpansions("ao_diegui");
			var list2 = [];
			for (var i = 0; i < list.length; i++) {
				list2.add(get.suit(list[i], false));
			}
			return list2.length > 2;
		},
		content() {
			player.awakenSkill(event.name);
			player.changeSkills(["ao_diegui"], ["ao_kuihun"]);
			player.gainMaxHp();
			player.recover();
		},
		ai: { combo: "ao_kuihun" },
	},
	ao_diegui: {
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return player.getExpansions("ao_diegui").length > 0;
		},
		chooseButton: {
			dialog(event, player) {
				return ui.create.dialog("蝶归", player.getExpansions("ao_diegui"), "hidden");
			},
			backup(links, player) {
				return {
					card: links,
					filterCard() {
						return false;
					},
					selectCard: -1,
					filterTarget: true,
					delay: false,
					content: lib.skill.ao_diegui.contentx,
					line: "thunder",
					ai: {
						result: {
							target(player, target) {
								if (target != player && target.hasSkillTag("nogain")) {
									return 0;
								}
								var num = 1;
								if (target.isTurnedOver()) {
									num += 2;
								}
								if (target.isLinked()) {
									num += 0.5;
								}
								return num;
							},
						},
					},
				};
			},
			prompt(links, player) {
				return "选择一名角色，令其获得" + get.translation(links[0]) + "，摸两张牌并将武将牌复原。";
			},
		},
		contentx() {
			"step 0";
			player.give(lib.skill.ao_diegui_backup.card, target, "visible");
			target.draw(2);
			"step 1";
			target.link(false);
			"step 2";
			target.turnOver(false);
		},
		intro: {
			name: "七影蝶",
			content: "expansion",
			markcount: "expansion",
		},
		onremove(player, skill) {
			var cards = player.getExpansions(skill);
			if (cards.length) {
				player.loseToDiscardpile(cards);
			}
		},
		ai: { order: 1, result: { player: 1 } },
	},
	//直井文人
	ayato_jianshen: {
		mod: {
			cardnature(card, player) {
				if (get.name(card) == "sha") {
					return "kami";
				}
			},
		},
		ai: { threaten: 3 },
	},
	ayato_zonghuan: {
		enable: "phaseUse",
		usable: 1,
		filterTarget(card, player, target) {
			return target != player && target.countCards("h") > 0;
		},
		content() {
			"step 0";
			player.chooseButton(["请选择" + get.translation(target) + "的一张手牌", target.getCards("h")], true).set("ai", get.buttonValue);
			"step 1";
			if (result.bool) {
				var card = result.links[0];
				event.card = card;
				if (!lib.filter.cardEnabled(card, target)) {
					event._result = { bool: false };
				} else {
					var targets = game.players.slice(0);
					var info = get.info(card);
					var range;
					if (!info.notarget) {
						var select = get.copy(info.selectTarget);
						if (select == undefined) {
							range = [1, 1];
						} else if (typeof select == "number") {
							range = [select, select];
						} else if (get.itemtype(select) == "select") {
							range = select;
						} else if (typeof select == "function") {
							range = select(card, player);
						}
						game.checkMod(card, target, range, "selectTarget", target);
					}
					if (info.notarget || range[1] == -1) {
						if (range[1] == -1) {
							for (var i = 0; i < targets.length; i++) {
								if (!target.canUse(card, targets[i])) {
									targets.splice(i--, 1);
								}
							}
							if (targets.length) {
								event.targets2 = targets;
							} else {
								event.finish();
								return;
							}
						} else {
							event.targets2 = [];
						}
						var next = player.chooseBool();
						next.set("prompt", event.prompt || "是否令" + get.translation(target) + (event.targets2.length ? "对" : "") + get.translation(event.targets2) + "使用" + get.translation(card) + "?");
						next.set("prompt2", "或点「取消」，令其将此牌置入弃牌堆");
						next.ai = function () {
							var eff = 0;
							for (var i = 0; i < event.targets2.length; i++) {
								eff += get.effect(event.targets2[i], card, target, player);
							}
							return eff > 0;
						};
					} else {
						var next = player.chooseTarget();
						next.set("_get_card", card);
						next.set("source", target);
						next.set("filterTarget", function (card, player, target) {
							return lib.filter.filterTarget(_status.event._get_card, _status.event.source, target);
						});
						next.set("ai", function (target) {
							var evt = _status.event;
							return get.effect(target, evt._get_card, evt.source, evt.player);
						});
						next.set("selectTarget", function () {
							var card = get.card(),
								player = _status.event.source;
							if (card == undefined) {
								return;
							}
							var range;
							var select = get.copy(get.info(card).selectTarget);
							if (select == undefined) {
								if (get.info(card).filterTarget == undefined) {
									return [0, 0];
								}
								range = [1, 1];
							} else if (typeof select == "number") {
								range = [select, select];
							} else if (get.itemtype(select) == "select") {
								range = select;
							} else if (typeof select == "function") {
								range = select(card, player);
							}
							game.checkMod(card, player, range, "selectTarget", player);
							return range;
						});
						next.set("prompt", event.prompt || "选择" + get.translation(target) + "使用" + get.translation(card) + "的目标");
						next.set("prompt2", "或点「取消」令其将此牌置入弃牌堆");
					}
				}
			} else {
				event.finish();
			}
			"step 2";
			if (result.bool) {
				target.useCard(card, event.targets2 || result.targets, false, "noai");
				player.draw();
			} else {
				target.lose(card, ui.discardPile);
				target.$throw(card);
				game.log(target, "将", card, "置入了弃牌堆");
			}
		},
		ai: { order: 10, result: { target: -1 } },
	},
	//古河渚
	nagisa_tiandu: {
		trigger: { player: "judgeEnd" },
		charlotte: true,
		frequent(event) {
			if (event.result.card.name == "du") {
				return false;
			}
			return true;
		},
		check(event) {
			if (event.result.card.name == "du") {
				return false;
			}
			return true;
		},
		filter(event, player) {
			return get.position(event.result.card, true) == "o";
		},
		content() {
			player.gain(trigger.result.card, "gain2");
		},
	},
	nagisa_fuxin: {
		trigger: {
			global: ["gainAfter", "loseAfter", "loseAsyncAfter", "damageEnd"],
		},
		filterx(event, player) {
			var source = _status.currentPhase;
			if (event.name == "damage") {
				return event.player.isAlive() && event.player != source;
			} else if (event.name == "lose") {
				if (event.type != "discard" || event.player == source || event.player.isDead()) {
					return false;
				}
				if ((event.discarder || event.getParent(2).player) == event.player) {
					return false;
				}
				if (!event.getl(event.player).hs.length) {
					return false;
				}
				return true;
			} else if (event.name == "gain") {
				if (event.giver || event.getParent().name == "gift") {
					return false;
				}
				var cards = event.getg(event.player);
				if (!cards.length) {
					return false;
				}
				return game.hasPlayer(function (current) {
					if (current == event.player || current == source) {
						return false;
					}
					var hs = event.getl(current).hs;
					for (var i of hs) {
						if (cards.includes(i)) {
							return true;
						}
					}
					return false;
				});
			} else if (event.type == "gain") {
				if (event.giver || !event.player || event.player == source || event.player.isDead()) {
					return false;
				}
				var hs = event.getl(event.player);
				return game.hasPlayer(function (current) {
					if (current == event.player) {
						return false;
					}
					var cards = event.getg(current);
					for (var i of cards) {
						if (hs.includes(i)) {
							return true;
						}
					}
				});
			} else if (event.type == "discard") {
				if (!event.discarder) {
					return false;
				}
				return game.hasPlayer(function (current) {
					return current != source && current != event.discarder && event.getl(current).hs.length > 0;
				});
			}
			return false;
		},
		filter(event, player, triggername, target) {
			return target.isIn();
		},
		getIndex(trigger, player, triggername) {
			if (!lib.skill.nagisa_fuxin.filterx(trigger, player)) {
				return false;
			}
			const targets = [],
				source = _status.currentPhase;
			if (trigger.name == "gain") {
				const cards = trigger.getg(trigger.player);
				targets.addArray(
					game.filterPlayer(function (current) {
						if (current === trigger.player || current === source) {
							return false;
						}
						const hs = trigger.getl(current).hs;
						for (const i of hs) {
							if (cards.includes(i)) {
								return true;
							}
						}
						return false;
					})
				);
			} else if (trigger.name == "loseAsync" && trigger.type == "discard") {
				targets.addArray(
					game.filterPlayer(function (current) {
						return current != trigger.discarder && current != source && trigger.getl(current).hs.length > 0;
					})
				);
			} else {
				targets.push(trigger.player);
			}
			targets.sortBySeat();
			return targets;
		},
		logTarget: (event, player, triggername, target) => target,
		check(event, player, triggername, target) {
			const source = _status.currentPhase;
			if (source && source.isIn() && get.attitude(player, source) > 0) {
				return false;
			}
			return get.attitude(player, target) > 0;
		},
		async content(event, trigger, player) {
			const target = event.indexedData;
			const { result } = await target.judge();
			switch (result.color) {
				case "red":
					await target.draw();
					break;

				case "black": {
					const source = _status.currentPhase;
					if (source && source.isIn() && source.countCards("h") > 0) {
						source.chooseToDiscard("he", true);
					}
					break;
				}

				default:
					break;
			}
		},
		ai: { expose: 0.2 },
	},
	//冈崎朋也
	tomoya_shangxian: {
		trigger: { player: "phaseUseBegin" },
		mark: true,
		locked: true,
		intro: {
			content(s) {
				return "计算与其他角色的距离时始终从" + (s ? "顺" : "逆") + "时针计算";
			},
		},
		async content(event, trigger, player) {
			await player.draw();
			player.storage.tomoya_shangxian = !player.storage.tomoya_shangxian;
		},
		ai: {
			left_hand: true,
			right_hand: true,
			skillTagFilter(player, tag) {
				return Boolean(player.storage.tomoya_shangxian) === Boolean(tag === "left_hand");
			},
		},
	},
	tomoya_wangjin: {
		trigger: { global: "phaseJieshuBegin" },
		filter(event, player) {
			return player != event.player && !player.hasSkill("tomoya_wangjin_" + player.inRange(event.player));
		},
		logTarget: "player",
		check(event, player) {
			var target = event.player;
			var bool = player.inRange(target);
			if (!bool) {
				if (target.hp > player.hp) {
					return get.effect(target, { name: "sha", isCard: true }, player, player) > 0;
				}
				var temp = target;
				while (true) {
					temp = temp.getNext();
					if (temp == target || temp == _status.roundStart) {
						return true;
					}
					if (temp == player) {
						continue;
					}
					if (temp.hp > player.hp && !player.inRange(temp) && get.effect(temp, { name: "sha", isCard: true }, player, player) > 0) {
						return false;
					}
				}
			}
			if (get.attitude(player, target) < 2) {
				return false;
			}
			if (target.hp < player.hp && !target.hasSkillTag("nogain")) {
				return true;
			}
			var temp = target;
			while (true) {
				temp = temp.getNext();
				if (temp == target || temp == _status.roundStart) {
					return true;
				}
				if (temp == player) {
					continue;
				}
				if (temp.hp < player.hp && player.inRange(temp) && get.attitude(player, target) >= 2 && !temp.hasSkillTag("nogain")) {
					return false;
				}
			}
		},
		content() {
			"step 0";
			event.bool = player.inRange(trigger.player);
			player.addTempSkill("tomoya_wangjin_" + event.bool, "roundStart");
			if (event.bool) {
				trigger.player.draw();
			} else {
				player.draw(2);
			}
			"step 1";
			if (event.bool) {
				if (trigger.player.hp < player.hp) {
					player.draw();
				} else {
					event.finish();
				}
			} else {
				if (player.countDiscardableCards(trigger.player, "h") > 0) {
					trigger.player.discardPlayerCard(player, "h", true);
				} else {
					event.finish();
				}
			}
			"step 2";
			if (event.bool) {
				player.chooseCard("h", "是否交给" + get.translation(trigger.player) + "一张牌？");
			} else {
				event.finish();
				if (player.hp >= trigger.player.hp) {
					return;
				}
				var card = { name: "sha", isCard: true };
				if (player.canUse(card, trigger.player, false)) {
					player.useCard(card, trigger.player, false);
				}
			}
			"step 3";
			if (result.bool) {
				player.give(result.cards, target);
			}
		},
		subSkill: {
			true: { charlotte: true },
			false: { charlotte: true },
		},
		ai: { expose: 0.2 },
	},
	//野田
	noda_fengcheng: {
		audio: 2,
		trigger: {
			player: "gainAfter",
		},
		forced: true,
		filter(event, player) {
			return get.itemtype(event.source) == "player" && event.bySelf != true;
		},
		check(event, player) {
			return get.attitude(player, event.source) > 0;
		},
		logTarget: "source",
		content() {
			trigger.source.draw();
		},
		ai: {
			combo: "noda_xunxin",
			halfneg: true,
		},
	},
	noda_xunxin: {
		audio: 2,
		enable: "phaseUse",
		usable(skill, player) {
			return player.hp;
		},
		filter(event, player) {
			return game.hasPlayer(target => lib.skill.noda_xunxin.filterTarget(null, player, target));
		},
		viewAs: {
			name: "juedou",
			isCard: true,
		},
		filterTarget(card, player, target) {
			if (target.hp < player.hp) {
				return false;
			}
			return player.canUse({ name: "juedou" }, target);
		},
		selectCard: -1,
		filterCard: () => false,
		group: "noda_xunxin2",
	},
	noda_xunxin2: {
		trigger: { player: "juedouAfter" },
		popup: false,
		forced: true,
		filter(event, player) {
			if (event.target.isDead()) {
				return false;
			}
			return event.turn && event.turn.countCards("he") > 0;
		},
		content() {
			"step 0";
			event.giver = trigger.turn;
			event.gainner = event.giver == player ? trigger.target : player;
			event.giver.chooseCard("he", true, "交给" + get.translation(event.gainner) + "一张牌");
			"step 1";
			event.giver.give(result.cards, event.gainner);
		},
	},
	//日向秀树
	hinata_qiulve: {
		audio: 2,
		enable: ["chooseToUse", "chooseToRespond"],
		viewAsFilter(player) {
			return (
				player.countCards("hes", function (card) {
					return get.type(card) != "basic";
				}) > 0
			);
		},
		viewAs: { name: "sha" },
		filterCard(card, player) {
			return get.type(card) != "basic";
		},
		locked: false,
		position: "hes",
		check(card) {
			var val = get.value(card);
			if (val >= 6) {
				return 0;
			}
			if (get.color(card) == "black") {
				return 12 - val;
			}
			return 6 - val;
		},
		mod: {
			targetInRange(card, player, target) {
				if (_status.event.skill == "hinata_qiulve") {
					return true;
				}
			},
		},
		group: "hinata_qiulve_clear",
		ai: {
			respondSha: true,
			skillTagFilter(player) {
				return (
					player.countCards("hes", function (card) {
						return get.type(card) != "basic";
					}) > 0
				);
			},
		},
	},
	hinata_qiulve_clear: {
		trigger: { player: "useCard1" },
		firstDo: true,
		silent: true,
		filter(event, player) {
			return event.skill == "hinata_qiulve";
		},
		content() {
			if (get.color(trigger.card) == "red") {
				trigger.directHit.addArray(game.players);
			} else if (trigger.addCount !== false) {
				trigger.addCount = false;
				var stat = player.getStat().card;
				if (stat.sha) {
					stat.sha--;
				}
			}
		},
	},
	hinata_ehou: {
		audio: 2,
		trigger: { global: "useCardAfter" },
		//这个也是chooseToUse 改不了
		direct: true,
		filter(event, player) {
			return player != event.player && event.targets && event.targets.includes(player) && (_status.connectMode || player.hasSha());
		},
		clearTime: true,
		content() {
			"step 0";
			player.chooseToUse({
				logSkill: "hinata_ehou",
				preTarget: trigger.player,
				prompt: "是否发动【扼喉】，对" + get.translation(trigger.player) + "使用一张【杀】？",
				filterCard(card, player) {
					return get.name(card) == "sha" && lib.filter.filterCard.apply(this, arguments);
				},
				filterTarget(card, player, target) {
					return target == _status.event.preTarget && lib.filter.filterTarget.apply(this, arguments);
				},
				addCount: false,
			});
			"step 1";
			if (
				result.bool &&
				player.getHistory("sourceDamage", function (evt) {
					return evt.getParent(4) == event;
				}).length
			) {
				player.draw();
			}
		},
	},
	//高桥久子
	hisako_yinbao: {
		audio: 2,
		trigger: { player: ["damageEnd", "recoverAfter"] },
		content() {
			"step 0";
			player.judge(function (card) {
				return get.suit(card) == "spade" ? 2 : -2;
			}).judge2 = function (result) {
				return result.bool;
			};
			"step 1";
			if (result.bool && game.hasPlayer(current => current != player)) {
				player.chooseTarget(lib.filter.notMe, true, "选择一名其他角色，对其造成1点雷属性伤害").set("ai", function (target) {
					var player = _status.event.player;
					return get.damageEffect(target, player, player, "thunder");
				});
			} else {
				event.finish();
			}
			"step 2";
			var target = result.targets[0];
			player.addExpose(0.2);
			player.line(target, "thunder");
			target.damage("thunder");
		},
	},
	hisako_zhuanyun: {
		trigger: { player: "judgeBegin" },
		forced: true,
		charlotte: true,
		silent: true,
		filter(event, player) {
			return !event.directresult;
		},
		content() {
			var tempcard = false,
				temp = -Infinity;
			for (var i = 0; i < ui.cardPile.childElementCount; i++) {
				var card = ui.cardPile.childNodes[i];
				var temp2 = trigger.judge(card);
				if (temp2 > temp) {
					tempcard = card;
					temp = temp2;
				}
			}
			if (tempcard) {
				trigger.directresult = tempcard;
			}
		},
		ai: { luckyStar: true },
	},
	//直枝理树
	riki_spwenji: {
		audio: 2,
		trigger: { player: "phaseUseBegin" },
		filter(event, player) {
			return game.hasPlayer(function (current) {
				return current != player && current.countCards("he");
			});
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt2(event.skill), function (card, player, target) {
					return target != player && target.countCards("he");
				})
				.set("ai", function (target) {
					var att = get.attitude(_status.event.player, target);
					if (att > 0) {
						return Math.sqrt(att) / 10;
					}
					return 5 - att;
				})
				.forResult();
		},
		content() {
			"step 0";
			target = targets[0];
			event.target = target;
			target.chooseCard("he", true, "问计：将一张牌交给" + get.translation(player));
			"step 1";
			if (result.bool) {
				player.addTempSkill("riki_spwenji_respond");
				player.storage.riki_spwenji_respond = get.type2(result.cards[0], target);
				event.target.give(result.cards, player, true);
			}
		},
		ai: { expose: 0.2 },
		subSkill: {
			respond: {
				onremove: true,
				trigger: { player: "useCard" },
				forced: true,
				charlotte: true,
				audio: "riki_spwenji",
				filter(event, player) {
					return get.type2(event.card) == player.storage.riki_spwenji_respond;
				},
				content() {
					trigger.directHit.addArray(game.players);
				},
				ai: {
					directHit_ai: true,
					skillTagFilter(player, tag, arg) {
						return get.type2(arg.card) == player.storage.riki_spwenji_respond;
					},
				},
			},
		},
	},
	riki_nvzhuang: {
		init(player) {
			if (get.character(player.name1, 3).includes("riki_nvzhuang")) {
				player.storage.riki_nvzhuang = player.sex;
				if (player.sex === "male") {
					player.sex = "double";
				} else {
					player.sex = "female";
				}
			}
		},
		onremove(player) {
			if (player.storage.riki_nvzhuang) {
				player.sex = player.storage.riki_nvzhuang;
			}
		},
		trigger: { player: "phaseJieshuBegin" },
		forced: true,
		content() {
			player.draw(player.countCards("h") == 0 ? 2 : 1);
		},
	},
	riki_mengzhong: {
		trigger: { player: "phaseZhunbeiBegin" },
		forced: true,
		derivation: "riki_chongzhen",
		juexingji: true,
		skillAnimation: true,
		animationColor: "key",
		filter(event, player) {
			var num = 0;
			player.getAllHistory("gain", function (evt) {
				if (evt.getParent().name == "riki_spwenji") {
					num += evt.cards.length;
				}
			});
			return num >= 3;
		},
		content() {
			player.awakenSkill(event.name);
			player.removeSkills("riki_spwenji");
			player.gainMaxHp();
			player.recover();
			player.addSkills("riki_chongzhen");
		},
		ai: { combo: "riki_spwenji" },
	},
	riki_chongzhen: {
		trigger: {
			player: "phaseUseBegin",
		},
		filter(event, player) {
			return game.hasPlayer(current => player.canCompare(current));
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt2(event.skill), function (card, player, target) {
					return player.canCompare(target);
				})
				.set("ai", function (target) {
					return (-get.attitude(player, target) * (1 + target.countCards("e"))) / (1 + target.countCards("j"));
				})
				.forResult();
		},
		content() {
			"step 0";
			var target = targets[0];
			event.target = target;
			player.chooseToCompare(target);
			"step 1";
			if (result.bool) {
				var num = 0;
				if (target.countCards("h")) {
					num++;
				}
				if (target.countCards("e")) {
					num++;
				}
				if (target.countCards("j")) {
					num++;
				}
				if (num) {
					player.gainPlayerCard(target, num, "hej", true).set("filterButton", function (button) {
						for (var i = 0; i < ui.selected.buttons.length; i++) {
							if (get.position(button.link) == get.position(ui.selected.buttons[i].link)) {
								return false;
							}
						}
						return true;
					});
				}
			} else {
				player.addTempSkill("zishou2", "phaseUseAfter");
			}
		},
		ai: { expose: 0.2 },
	},
	//来谷唯湖
	yuiko_fenglun: {
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return (
				player.countCards("h") > 0 &&
				game.hasPlayer(function (current) {
					return player.canCompare(current);
				})
			);
		},
		filterTarget(card, player, target) {
			return player.canCompare(target);
		},
		content() {
			"step 0";
			player.chooseToCompare(target);
			"step 1";
			if (result.bool) {
				player.addTempSkill("yuiko_fenglun2", "phaseUseEnd");
			}
		},
		ai: {
			order: 10,
			result: { target: -1 },
		},
	},
	yuiko_fenglun2: {
		mod: {
			cardUsable() {
				return Infinity;
			},
			targetInRange() {
				return true;
			},
		},
	},
	yuiko_dilve: {
		enable: "chooseCard",
		check() {
			return 20;
		},
		filter(event) {
			return event.type == "compare" && !event.directresult;
		},
		onCompare(player) {
			return game.cardsGotoOrdering(get.bottomCards()).cards;
		},
		group: "yuiko_dilve_gain",
		subSkill: {
			gain: {
				trigger: {
					player: ["chooseToCompareAfter", "compareMultipleAfter"],
					target: ["chooseToCompareAfter", "compareMultipleAfter"],
				},
				filter(event, player) {
					if (event.preserve) {
						return false;
					}
					return [event.card1, event.card2].filterInD("od").length > 0;
				},
				prompt2(event, player) {
					return "获得" + get.translation([event.card1, event.card2].filterInD("od"));
				},
				content() {
					player.gain([trigger.card1, trigger.card2].filterInD("od"), "gain2", "log");
				},
			},
		},
	},
	//多鲁基
	doruji_feiqu: {
		trigger: {
			player: "useCard",
			target: "useCardToTargeted",
		},
		forced: true,
		filter(event, player) {
			return event.card.name == "sha";
		},
		content() {
			if (trigger.name == "useCard") {
				trigger.directHit.addArray(game.players);
			} else {
				trigger.directHit.add(player);
			}
		},
		ai: {
			halfneg: true,
			directHit_ai: true,
			skillTagFilter(player, tag, arg) {
				return arg.card.name == "sha";
			},
		},
		global: "doruji_feiqu_ai",
	},
	doruji_feiqu_ai: {
		ai: {
			directHit_ai: true,
			skillTagFilter(player, tag, arg) {
				return arg.card.name == "sha" && (arg.target.hasSkill("doruji_feiqu") || arg.target.hasSkill("godan_feiqu"));
			},
		},
	},
	//千里朱音
	akane_jugu: {
		audio: 2,
		mod: {
			maxHandcard(player, num) {
				return num + player.maxHp;
			},
		},
		trigger: { global: "phaseBefore", player: "enterGame" },
		forced: true,
		filter(event, player) {
			return event.name != "phase" || game.phaseNumber == 0;
		},
		content() {
			player.draw(player.maxHp);
		},
	},
	akane_quanqing: {
		enable: "phaseUse",
		filterCard: true,
		filterTarget(card, player, target) {
			return target != player && player.inRange(target);
		},
		position: "he",
		check(card) {
			var val = get.value(card);
			var num = card.number;
			if (num > 10) {
				return 8 - val;
			}
			var player = _status.event.player;
			if (player.getUseValue(card, null, true) > player.getUseValue({ name: "guohe" })) {
				return 0;
			}
			if (num > 6) {
				return 6 - val;
			}
			return 3 - val;
		},
		content() {
			"step 0";
			var num = cards[0].number;
			var trans = get.translation(target);
			var list = ["令" + trans + "摸一张牌"];
			event.addIndex = 0;
			if (num > 6) {
				if (target.countDiscardableCards(player, "hej") > 0) {
					list.push("弃置" + trans + "区域内的一张牌");
				} else {
					event.addIndex++;
				}
			}
			if (num > 10) {
				list.push("对" + trans + "造成1点伤害");
			}
			if (list.length == 1) {
				event._result = { index: 0 };
			} else {
				player
					.chooseControl()
					.set("choiceList", list)
					.set("index", list.length - 1)
					.set("ai", function () {
						return _status.event.index;
					});
			}
			"step 1";
			if (result.index > 0) {
				result.index += event.addIndex;
			}
			switch (result.index) {
				case 0:
					target.draw();
					break;
				case 1:
					player.discardPlayerCard(target, "hej", true);
					break;
				case 2:
					target.damage("nocard");
					break;
			}
		},
		ai: {
			order: 4,
			result: {
				target(player, target) {
					var card = ui.selected.cards[0];
					if (card) {
						if (card.number > 10) {
							return get.damageEffect(target, player, target);
						}
						if (card.number > 6) {
							return lib.card.guohe.ai.result.target.apply(this, arguments);
						}
						return 1;
					}
				},
			},
		},
	},
	akane_yifu: {
		global: "akane_yifu2",
		zhuSkill: true,
	},
	akane_yifu2: {
		audio: 2,
		enable: "phaseUse",
		discard: false,
		line: true,
		log: false,
		delay: false,
		lose: false,
		prepare(cards, player, targets) {
			targets[0].logSkill("akane_yifu");
		},
		prompt() {
			var player = _status.event.player;
			var list = game.filterPlayer(function (target) {
				return target != player && target.hasZhuSkill("akane_yifu", player);
			});
			var str = "将一张手牌交给" + get.translation(list);
			if (list.length > 1) {
				str += "中的一人";
			}
			return str;
		},
		filter(event, player) {
			if (player.group != "key") {
				return false;
			}
			if (player.countCards("h") == 0) {
				return 0;
			}
			return game.hasPlayer(function (target) {
				return target != player && target.hasZhuSkill("akane_yifu", player) && !target.hasSkill("akane_yifu3");
			});
		},
		filterCard: true,
		filterTarget(card, player, target) {
			return target != player && target.hasZhuSkill("akane_yifu", player) && !target.hasSkill("akane_yifu3");
		},
		content() {
			"step 0";
			player.give(cards, target);
			target.addTempSkill("akane_yifu3", "phaseUseEnd");
			target.draw();
			"step 1";
			if (target.countCards("h") > 0) {
				target.chooseCard("h", true, "交给" + get.translation(player) + "一张牌").set("ai", function (card) {
					return 14 - get.value(card);
				});
			} else {
				event.finish();
			}
			"step 2";
			target.give(result.cards, player);
		},
		ai: {
			expose: 0.3,
			order: 10,
			result: {
				target: 5,
			},
		},
	},
	akane_yifu3: { charlotte: true },
	//笹濑川佐佐美
	sasami_miaobian: {
		derivation: ["sasami_gongqing", "sasami_funan", "sasami_baoqiu"],
		init2(player) {
			if (player.hp <= 3) {
				player.addSkill("sasami_gongqing");
			}
			if (player.hp <= 2) {
				player.addSkill("sasami_funan");
			}
			if (player.hp <= 1) {
				player.addSkill("sasami_baoqiu");
			}
		},
		trigger: { player: "changeHp" },
		firstDo: true,
		silent: true,
		content() {
			lib.skill.sasami_miaobian.init2(player);
		},
	},
	sasami_baoqiu: {
		line: { color: [173, 149, 206] },
		inherit: "rin_baoqiu",
	},
	sasami_gongqing: {
		audio: true,
		trigger: {
			player: ["damageBegin3", "damageBegin4"],
		},
		forced: true,
		filter(event, player, name) {
			if (!event.source) {
				return false;
			}
			var range = event.source.getAttackRange();
			if (name == "damageBegin3") {
				return range > 3;
			}
			return event.num > 1 && range < 3;
		},
		content() {
			trigger.num = event.triggername == "damageBegin4" ? 1 : trigger.num + 1;
		},
		ai: {
			filterDamage: true,
			skillTagFilter(player, tag, arg) {
				if (arg && arg.player) {
					if (arg.player.hasSkillTag("jueqing", false, player)) {
						return false;
					}
					if (arg.player.getAttackRange() < 3) {
						return true;
					}
				}
				return false;
			},
		},
	},
	sasami_funan: {
		audio: 2,
		trigger: { global: ["respond", "useCard"] },
		line: { color: [173, 149, 206] },
		filter(event, player) {
			if (!event.respondTo) {
				return false;
			}
			if (event.player == player) {
				return false;
			}
			if (player != event.respondTo[0]) {
				return false;
			}
			if (!player.hasSkill("sasami_funan_jiexun")) {
				var cards = [];
				if (get.itemtype(event.respondTo[1]) == "card") {
					cards.push(event.respondTo[1]);
				} else if (event.respondTo[1].cards) {
					cards.addArray(event.respondTo[1].cards);
				}
				return cards.filterInD("od").length > 0;
			} else {
				return event.cards.filterInD("od").length > 0;
			}
		},
		check(event, player) {
			if (player.hasSkill("sasami_funan_jiexun") || get.attitude(player, event.player) > 0) {
				return true;
			}
			let cards = [];
			if (get.itemtype(event.respondTo[1]) == "card") {
				cards.push(event.respondTo[1]);
			} else if (event.respondTo[1].cards) {
				cards.addArray(event.respondTo[1].cards);
			}
			return (
				event.cards.filterInD("od").reduce((acc, card) => {
					return acc + get.value(card);
				}, 0) -
				cards.filterInD("od").reduce((acc, card) => {
					return acc + get.value(card);
				})
			);
		},
		logTarget: "player",
		content() {
			"step 0";
			if (!player.hasSkill("sasami_funan_jiexun")) {
				var cards = [];
				if (get.itemtype(trigger.respondTo[1]) == "card") {
					cards.push(trigger.respondTo[1]);
				} else if (trigger.respondTo[1].cards) {
					cards.addArray(trigger.respondTo[1].cards);
				}
				cards = cards.filterInD("od");
				trigger.player.gain(cards, "gain2", "log").gaintag.add("sasami_funan");
				trigger.player.addTempSkill("sasami_funan_use");
			}
			"step 1";
			var cards = trigger.cards.filterInD("od");
			player.gain(cards, "log", "gain2");
		},
		subSkill: {
			use: {
				onremove(player) {
					player.removeGaintag("sasami_funan");
				},
				charlotte: true,
				mod: {
					cardEnabled2(card, player) {
						if (get.itemtype(card) == "card" && card.hasGaintag("sasami_funan")) {
							return false;
						}
					},
				},
			},
		},
	},
	//枣铃
	rin_baoqiu: {
		mod: {
			attackRange(rin, ball) {
				return ball + 2;
			},
		},
		trigger: { player: "useCardToPlayered" },
		forced: true,
		logTarget: "target",
		filter(event, player) {
			return event.card.name == "sha";
		},
		line: { color: [194, 117, 92] },
		content() {
			"step 0";
			player.judge(function () {
				return 0;
			});
			"step 1";
			var target = trigger.target;
			var map = trigger.customArgs;
			var id = target.playerid;
			if (!map[id]) {
				map[id] = {};
			}
			if (result.color == "red") {
				if (!map[id].extraDamage) {
					map[id].extraDamage = 0;
				}
				map[id].extraDamage++;
			}
			if (result.color == "black") {
				trigger.directHit.add(target);
			}
			if (result.suit == "spade" || result.suit == "heart") {
				var evt = trigger.getParent();
				if (evt.addCount !== false) {
					evt.addCount = false;
					player.getStat().card.sha--;
				}
				player.draw();
			}
			if (result.suit == "diamond" || result.suit == "club") {
				target.addTempSkill("fengyin");
				if (target.countDiscardableCards(player, "he") > 0) {
					player.discardPlayerCard(target, "he", true);
				}
			}
		},
	},
	//春原阳平&春原芽衣
	sunohara_chengshuang: {
		trigger: {
			global: "phaseBefore",
			player: "enterGame",
		},
		group: "sunohara_chengshuang_phase",
		forced: true,
		filter(event, player) {
			return event.name != "phase" || game.phaseNumber == 0;
		},
		content() {
			"step 0";
			var evt = event.getParent("phase");
			if (evt && evt.player == player) {
				evt.sunohara_chengshuang = true;
			}
			player.chooseControl("male", "female").set("prompt", "成双：请选择自己的性别");
			"step 1";
			var sex = result.control;
			game.broadcastAll(
				function (player, sex) {
					player.sex = sex;
					if (player.marks && player.marks.sunohara_chengshuang) {
						player.marks.sunohara_chengshuang.firstChild.innerHTML = sex == "male" ? "♂" : "♀";
					}
				},
				player,
				sex
			);
			game.log(player, "将性别变更为", "#g" + get.translation(sex) + "性");
		},
		mark: true,
		intro: {
			content(storage, player) {
				if (player.sex == "unknown" || player.sex == "double") {
					return "当前性别未确定";
				}
				return "当前性别：" + get.translation(player.sex);
			},
		},
		ai: {
			combo: "sunohara_jianren",
		},
	},
	sunohara_chengshuang_phase: {
		trigger: {
			player: "phaseBegin",
		},
		filter(event, player) {
			if (event.sunohara_chengshuang) {
				return false;
			}
			return game.phaseNumber > 1;
		},
		prompt2(event, player) {
			if (player.sex == "unknown" || player.sex == "double") {
				return "选择自己的性别";
			}
			return "将自己的性别变更为" + (player.sex == "male" ? "女性" : "男性");
		},
		content() {
			"step 0";
			if (player.sex == "unknown" || player.sex == "double") {
				player.chooseControl("male", "female").set("prompt", "成双：请选择自己的性别");
			} else {
				event._result = {
					control: player.sex == "male" ? "female" : "male",
				};
			}
			"step 1";
			var sex = result.control;
			game.broadcastAll(
				function (player, sex) {
					player.sex = sex;
					if (player.marks && player.marks.sunohara_chengshuang) {
						player.marks.sunohara_chengshuang.firstChild.innerHTML = sex == "male" ? "♂" : "♀";
					}
				},
				player,
				sex
			);
			game.log(player, "将性别变更为", "#g" + get.translation(sex) + "性");
		},
	},
	sunohara_tiaoyin: {
		enable: "phaseUse",
		usable: 1,
		filterTarget(card, player, target) {
			return target != player && target.countGainableCards(player, "hej") > 0;
		},
		selectCard: [1, 4],
		filterCard(card) {
			for (var i = 0; i < ui.selected.cards.length; i++) {
				if (get.suit(ui.selected.cards[i]) == get.suit(card)) {
					return false;
				}
			}
			return true;
		},
		complexSelect: true,
		complexCard: true,
		complexTarget: true,
		selectTarget() {
			return [ui.selected.cards.length, ui.selected.cards.length];
		},
		line: { color: [239, 204, 96] },
		content() {
			if (target.countGainableCards(player, "hej") > 0) {
				player.gainPlayerCard(target, "hej", "visible");
			}
		},
		contentAfter() {
			var bool = false;
			for (var i = 0; i < targets.length; i++) {
				if (targets[i].differentSexFrom(player)) {
					bool = true;
					break;
				}
			}
			if (bool) {
				player.loseHp();
			}
		},
		ai: {
			order: 6,
			result: {
				target(player, target) {
					return lib.card.shunshou.ai.result.target.apply(this, arguments);
				},
				player(player, target) {
					if (target.sameSexAs(player)) {
						return 0;
					}
					for (var i = 0; i < ui.selected.targets.length; i++) {
						if (ui.selected.targets[i].differentSexFrom(player)) {
							return 0;
						}
					}
					return get.attitude(player, target) < 0 && target.countCards("h", "tao") > 0 ? 1 : -2;
				},
			},
		},
	},
	sunohara_jianren: {
		trigger: { player: "damageEnd" },
		line: { color: [145, 149, 179] },
		async cost(event, trigger, player) {
			const num = !trigger.source || trigger.source.isDead() || trigger.source.differentSexFrom(player) ? 3 : 1;
			event.result = await player
				.chooseTarget(get.prompt(event.skill), "令一名角色摸" + get.cnNumber(num) + "张牌。")
				.set("ai", function (target) {
					const player = get.player();
					const att = get.attitude(player, target);
					if (att <= 0) {
						return 0;
					}
					if (target.hasSkillTag("nogain") && target != _status.currentPhase) {
						return 0.1;
					}
					return att / (1 + 0.1 * target.countCards("h"));
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			const num = !trigger.source || trigger.source.isDead() || trigger.source.differentSexFrom(player) ? 3 : 1;
			target.draw(num);
		},
	},
	//椎名
	shiina_qingshen: {
		audio: 1,
		trigger: {
			player: "damageEnd",
			source: "damageSource",
		},
		filter(event, player) {
			return event.cards && event.cards.filterInD().length > 0;
		},
		frequent: true,
		content() {
			"step 0";
			var cards = trigger.cards.filterInD("od");
			player.gain(cards, "gain2", "log");
			event.count = cards.length;
			"step 1";
			var cards = player.getCards("he");
			if (cards.length == 0) {
				event.finish();
				return;
			} else if (cards.length <= event.count) {
				event._result = { bool: true, cards: cards };
			} else {
				player.chooseCard(true, "he", event.count, "请选择要置于武将牌上的牌");
			}
			"step 2";
			if (result.bool && result.cards.length) {
				var cards = result.cards;
				player.addToExpansion(cards, player, "give").gaintag.add("shiina_qingshen");
			}
		},
		intro: {
			content: "expansion",
			markcount: "expansion",
		},
		mod: {
			attackRange(from, num) {
				return num + from.getExpansions("shiina_qingshen").length;
			},
			maxHandcard(from, num) {
				return num + from.getExpansions("shiina_qingshen").length;
			},
		},
		ai: {
			notemp: true,
		},
	},
	shiina_feiyan: {
		audio: 1,
		animalList: ["key_inari", "key_doruji"],
		trigger: { global: "phaseBegin" },
		filter(event, player) {
			if (lib.skill.shiina_feiyan.animalList.includes(event.player.name)) {
				return false;
			}
			return player.getExpansions("shiina_qingshen").length > 0 && player.inRange(event.player);
		},
		async cost(event, trigger, player) {
			const { result } = await player
				.chooseButton([get.prompt(event.skill, trigger.player), player.getExpansions("shiina_qingshen")])
				.set("goon", get.attitude(player, trigger.player) < 0 ? 1 : -1)
				.set("ai", function () {
					return _status.event.goon;
				});
			if (result.bool) {
				event.result = {
					bool: true,
					cards: result.links,
				};
			}
		},
		logTarget: "player",
		async content(event, trigger, player) {
			await player.loseToDiscardpile(event.cards);
			const cardToUse = { name: "sha", isCard: true };
			if (lib.filter.targetEnabled(cardToUse, player, trigger.player)) {
				const { card } = await player.useCard(cardToUse, trigger.player);
				if (
					!player.hasHistory("sourceDamage", function (evt) {
						return evt.card === card;
					})
				) {
					await player.draw();
				}
			}
		},
		group: "shiina_retieji",
		ai: {
			combo: "shiina_qingshen",
		},
	},
	shiina_retieji: {
		audio: 1,
		trigger: { player: "useCardToPlayered" },
		check(event, player) {
			return get.attitude(player, event.target) < 0;
		},
		filter(event, player) {
			return event.card.name == "sha" && event.getParent(2).name == "shiina_feiyan";
		},
		logTarget: "target",
		content() {
			"step 0";
			player.judge(function () {
				return 0;
			});
			if (!trigger.target.hasSkill("fengyin")) {
				trigger.target.addTempSkill("fengyin");
			}
			"step 1";
			var suit = get.suit(result.card);
			var target = trigger.target;
			var num = target.countCards("h", "shan");
			target
				.chooseToDiscard("请弃置一张" + get.translation(suit) + "牌，否则不能使用闪抵消此杀", "he", function (card) {
					return get.suit(card) == _status.event.suit;
				})
				.set("ai", function (card) {
					var num = _status.event.num;
					if (num == 0) {
						return 0;
					}
					if (card.name == "shan") {
						return num > 1 ? 2 : 0;
					}
					return 8 - get.value(card);
				})
				.set("num", num)
				.set("suit", suit);
			"step 2";
			if (!result.bool) {
				trigger.getParent().directHit.add(trigger.target);
			}
		},
	},
	//稻荷
	inari_baiwei: {
		enable: ["chooseToUse", "chooseToRespond"],
		hiddenCard(player, name) {
			return name != "du" && get.type(name) == "basic" && player.countCards("hes", { suit: "diamond" }) > 0;
		},
		filter(event, player) {
			if (event.type == "wuxie" || !player.countCards("hse", { suit: "diamond" })) {
				return false;
			}
			for (var i = 0; i < lib.inpile.length; i++) {
				var name = lib.inpile[i];
				if (name != "du" && get.type(name) == "basic" && event.filterCard(get.autoViewAs({ name: name }, "unsure"), player, event)) {
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
					if (name == "du") {
						continue;
					}
					if (name == "sha") {
						list.push(["基本", "", "sha"]);
						for (var j of lib.inpile_nature) {
							list.push(["基本", "", name, j]);
						}
					} else if (get.type(name) == "basic") {
						list.push(["基本", "", name]);
					}
				}
				return ui.create.dialog("摆尾", [list, "vcard"], "hidden");
			},
			filter(button, player) {
				return _status.event.getParent().filterCard(get.autoViewAs({ name: button.link[2] }, "unsure"), player, _status.event.getParent());
			},
			check(button) {
				if (_status.event.getParent().type == "phase") {
					var player = _status.event.player;
					var fakecard = {
						name: button.link[2],
						nature: button.link[3],
					};
					if (player.getUseValue(fakecard) > 0) {
						return get.order(fakecard);
					}
					return 0;
				}
				return 1;
			},
			backup(links, player) {
				return {
					selectCard: 1,
					filterCard: { suit: "diamond" },
					popname: true,
					check(card) {
						if (get.type(card) == "basic") {
							return 6;
						}
						return 1 / Math.max(0.1, get.value(card));
					},
					position: "hse",
					viewAs: { name: links[0][2], nature: links[0][3] },
				};
			},
			prompt(links, player) {
				return "将一张♦牌当做" + (get.translation(links[0][3]) || "") + get.translation(links[0][2]) + "使用或打出";
			},
		},
		ai: {
			order(item, player) {
				if (player && _status.event.type == "phase") {
					var max = 0;
					for (var i = 0; i < lib.inpile.length; i++) {
						var name = lib.inpile[i];
						if (get.type(name) == "basic" && player.getUseValue({ name: name }) > 0) {
							var temp = get.order({ name: name });
							if (temp > max) {
								max = temp;
							}
						}
					}
					if (max > 0) {
						max += 0.5;
					}
					return max;
				}
				return 4;
			},
			result: {
				player: 1,
			},
			respondSha: true,
			fireAttack: true,
			skillTagFilter(player, tag) {
				return tag == "fireAttack" || player.countCards("he", { suit: "diamond" }) > 0;
			},
		},
		group: ["inari_baiwei_draw"],
	},
	inari_baiwei_draw: {
		trigger: { player: ["useCardAfter", "respondAfter"] },
		forced: true,
		popup: false,
		filter(event, player) {
			return event.skill && event.skill.indexOf("inari_baiwei") == 0;
		},
		content() {
			player.draw();
		},
	},
	inari_huhun: {
		mod: {
			suit(card, suit) {
				if (suit == "club") {
					return "diamond";
				}
			},
			maxHandcard(player, num) {
				return num + 1;
			},
		},
	},
	//朱鹭户沙耶
	saya_powei: {
		audio: 2,
		trigger: { player: "phaseAfter" },
		limited: true,
		locked: false,
		skillAnimation: true,
		animationColor: "metal",
		filter(event, player) {
			return (
				event.type != "saya_powei" &&
				game.hasPlayer(function (current) {
					return current.hp > player.hp;
				})
			);
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(get.prompt2(event.skill), function (card, saya, kyousuke) {
					return kyousuke.hp > saya.hp;
				})
				.set("ai", function (target) {
					var player = _status.event.player;
					var att = get.attitude(player, target);
					if (att >= -2) {
						return 0;
					}
					if (target != get.zhu(target) && player.hasUnknown()) {
						return 0;
					}
					if (target.getEquip(3) && !player.getEquip(4)) {
						att /= 2;
					}
					if (player.hp <= 1) {
						att *= 1.5;
					}
					return -att;
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			player.awakenSkill(event.name);
			await game.delay(3);
			var next = game.createEvent("saya_powei_loop", false, trigger);
			next.playertrue = player;
			next.playerfalse = target;
			next.setContent(lib.skill.saya_powei.content2);
		},
		content2() {
			"step 0";
			event.count = 0;
			event.stat = true;
			event.current = event["player" + event.stat];
			game.countPlayer2(function (current) {
				if (current != event.playertrue && current != event.playerfalse) {
					current.addSkill("saya_nodis");
				}
			});
			event.playertrue.addSkill("saya_judge");
			"step 1";
			event.count++;
			event.current.phase().set("type", "saya_powei");
			"step 2";
			if (event.count == 9 || event.playertrue.isDead() || event.playerfalse.isDead()) {
				game.countPlayer2(function (current) {
					current.removeSkill("saya_nodis");
					current.removeSkill("saya_judge");
				});
			} else {
				event.stat = !event.stat;
				event.current = event["player" + event.stat];
				event.goto(1);
			}
		},
	},
	saya_nodis: {
		group: "undist",
		mark: true,
		intro: { content: "不计入距离和座次的计算" },
	},
	saya_judge: {
		trigger: { player: "phaseBegin" },
		forced: true,
		popup: false,
		filter(event, player) {
			return event.type == "saya_powei" && player == event.getParent().playertrue;
		},
		content() {
			"step 0";
			player.judge(function (card) {
				return get.color(card) == "red" ? 5 : 0;
			}).judge2 = function (result) {
				return result.bool ? true : false;
			};
			"step 1";
			if (result.bool) {
				player.line(trigger.getParent().playerfalse);
				trigger.getParent().playerfalse.damage();
			}
		},
	},
	saya_shouji: {
		audio: 2,
		trigger: { player: "useCardAfter" },
		filter(event, player) {
			return event.cards.filterInD().length > 0;
		},
		usable: 1,
		async cost(event, trigger, player) {
			const goon = (function () {
				var num = 0;
				var cards = trigger.cards.filterInD();
				for (var i = 0; i < cards.length; i++) {
					num += player.getUseValue(cards[i]);
				}
				return (
					player.countCards("h", function (card) {
						return player.getUseValue(card, null, true) > num;
					}) == 0
				);
			})();
			event.result = await player
				.chooseTarget(get.prompt2(event.skill), lib.filter.notMe)
				.set("ai", function (target) {
					if (!_status.event.goon) {
						return 0;
					}
					var player = _status.event.player;
					var cards = _status.event.getTrigger().cards.filterInD();
					var att = get.attitude(player, target);
					var num = 0;
					for (var i = 0; i < cards.length; i++) {
						num += target.getUseValue(cards[i]);
					}
					return Math.max(num, 0.1) * att;
				})
				.set("goon", goon)
				.forResult();
		},
		async content(event, trigger, player) {
			const target = event.targets[0],
				cards = trigger.cards.filterInD();
			await target.gain(cards, "gain2", "log");
			const result = await target
				.chooseToUse({
					cards: cards,
					filterCard(card) {
						if (get.itemtype(card) != "card" || !_status.event.cards || !_status.event.cards.includes(card)) {
							return false;
						}
						return lib.filter.filterCard.apply(this, arguments);
					},
					prompt: "是否使用得到的牌中的一张？",
				})
				.forResult();
			if (result.bool) {
				await player.draw();
			}
		},
	},
	//三枝叶留佳&二木佳奈多
	haruka_shuangche: {
		audio: 2,
		enable: "phaseUse",
		filter(event, player) {
			return !player.hasSkill("haruka_kanata");
		},
		chooseButton: {
			dialog(event, player) {
				var list = [];
				for (var i = 0; i < lib.inpile.length; i++) {
					var name = lib.inpile[i];
					if (name == "boss_mengpohuihun") {
						continue;
					}
					if (name == "sha") {
						list.push(["基本", "", "sha"]);
						for (var j of lib.inpile_nature) {
							list.push(["基本", "", name, j]);
						}
					} else if (get.type(name) == "trick") {
						list.push(["锦囊", "", name]);
					} else if (get.type(name) == "basic") {
						list.push(["基本", "", name]);
					}
				}
				return ui.create.dialog("双掣", [list, "vcard"]);
			},
			filter(button, player) {
				return _status.event.getParent().filterCard({ name: button.link[2] }, player, _status.event.getParent());
			},
			check(button) {
				var player = _status.event.player;
				if (player.countCards("h", button.link[2]) > 0) {
					return 0;
				}
				if (["wugu", "zhulu_card"].includes(button.link[2])) {
					return 0;
				}
				var effect = player.getUseValue(button.link[2]);
				if (effect > 0) {
					return effect;
				}
				return 0;
			},
			backup(links, player) {
				return {
					audio: "haruka_shuangche",
					filterCard() {
						return false;
					},
					selectCard: -1,
					popname: true,
					check(card) {
						return 6 - get.value(card);
					},
					position: "he",
					viewAs: {
						name: links[0][2],
						nature: links[0][3],
						isCard: true,
					},
				};
			},
			prompt(links, player) {
				return "请选择" + (get.translation(links[0][3]) || "") + get.translation(links[0][2]) + "的目标";
			},
		},
		ai: {
			order: 1,
			result: {
				player(player) {
					var cards = player.getCards("he").sort(function (a, b) {
						return get.value(a) - get.value(b);
					});
					var num = (player.getStat("skill").haruka_shuangche || 0) + 1;
					if (player.needsToDiscard() >= num) {
						return 1;
					}
					if (player.hp > 2) {
						return 1;
					}
					if (cards.length >= num) {
						var val = 0;
						for (var i = 0; i < cards.length; i++) {
							val += get.value(cards[i]);
						}
						return 12 - val;
					}
					return 0;
				},
			},
			fireAttack: true,
		},
		group: "kanata_shuangche",
	},
	kanata_shuangche: {
		trigger: { player: "useCardAfter" },
		forced: true,
		filter(event, player) {
			return event.skill == "haruka_shuangche_backup";
		},
		content() {
			"step 0";
			var num = player.getStat("skill").haruka_shuangche || 1;
			player.chooseToDiscard("###双掣：请选择一项###选择弃置" + get.cnNumber(num) + "张牌，或失去1点体力且令〖双掣〗失效至回合结束", num, "he").set("ai", function (card) {
				var total = 12;
				for (var i = 0; i < ui.selected.cards.length; i++) {
					total -= get.value(ui.selected.cards[i]);
				}
				return total - get.value(card);
			});
			"step 1";
			if (!result.bool) {
				player.addTempSkill("haruka_kanata");
				player.loseHp();
			}
		},
	},
	haruka_kanata: { charlotte: true },
	//紬文德斯
	tsumugi_mugyu: {
		audio: 5,
		trigger: { target: "useCardToTargeted" },
		frequent: true,
		filter(event, player) {
			return player.countCards("h") < player.maxHp;
		},
		content() {
			player.draw();
		},
	},
	tsumugi_huilang: {
		trigger: { player: "phaseEnd" },
		charlotte: true,
		line: { color: [253, 198, 116] },
		filter(event, player) {
			return player.countCards("he") > 0;
		},
		async cost(event, trigger, player) {
			event.result = await player
				.chooseCard("he", [1, player.countCards("he")], get.prompt2(event.skill))
				.set("ai", function (card) {
					if (get.position(card) != "h") {
						return -1;
					}
					if (!["shan", "wuxie", "caochuan"].includes(get.name(card))) {
						return 9;
					}
					return 5 - get.value(card);
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const cards = event.cards;
			player.addSkill("tsumugi_huilang2");
			player.addToExpansion("giveAuto", cards, player).gaintag.add("tsumugi_huilang2");
		},
	},
	tsumugi_huilang2: {
		charlotte: true,
		marktext: "隐",
		intro: { content: "隐藏于回廊之牌", markcount: "expansion" },
		onremove(player, skill) {
			var cards = player.getExpansions(skill);
			if (cards.length) {
				player.loseToDiscardpile(cards);
			}
		},
		trigger: { player: "phaseBegin" },
		forced: true,
		filter(event, player) {
			return player.getExpansions("tsumugi_huilang2").length > 0;
		},
		content() {
			"step 0";
			var cards = player.getExpansions("tsumugi_huilang2");
			event.num = cards.length;
			player.gain(cards, "draw");
			"step 1";
			player.chooseTarget([1, num], "是否令至多" + get.cnNumber(num) + "名角色各摸一张牌？").set("ai", function (target) {
				return get.attitude(_status.event.player, target);
			});
			"step 2";
			if (result.bool) {
				var targets = result.targets;
				player.line(targets, lib.skill.tsumugi_huilang.line);
				targets.sortBySeat();
				game.asyncDraw(targets);
			} else {
				event.finish();
			}
			"step 3";
			game.delay();
		},
	},
	//由依
	yui_jiang: {
		audio: 2,
		audioname: ["sp_lvmeng", "re_sunben", "re_sunce"],
		trigger: {
			player: "useCardToPlayered",
			target: "useCardToTargeted",
		},
		filter(event, player) {
			if (!(event.card.name == "juedou" || (event.card.name == "sha" && get.color(event.card) == "red"))) {
				return false;
			}
			return player == event.target || event.getParent().triggeredTargets3.length == 1;
		},
		frequent: true,
		content() {
			player.draw();
		},
		ai: {
			effect: {
				target_use(card, player, target) {
					if (card.name == "sha" && get.color(card) == "red") {
						return [1, 0.6];
					}
				},
				player_use(card, player, target) {
					if (card.name == "sha" && get.color(card) == "red") {
						return [1, 1];
					}
				},
			},
		},
	},
	yui_lieyin: {
		trigger: { player: "phaseUseBegin" },
		locked: true,
		async cost(event, trigger, player) {
			const list = [];
			if (player.storage._ichiban_no_takaramono) {
				list.push("cancel2");
			}
			const { control, index } = await player
				.chooseControl(...list)
				.set("choiceList", ["令此阶段内的所有红色牌视为【杀】", "令此阶段内的所有【杀】视为【决斗】"])
				.set("prompt", player.storage._ichiban_no_takaramono ? get.prompt(event.skill) : "烈音：请选择一项")
				.set("ai", function () {
					var player = _status.event.player;
					var shas = player.countCards("h", "sha");
					if (shas > 0) {
						if (
							game.hasPlayer(function (current) {
								return get.attitude(player, current) < 0 && player.canUse("juedou", current) && !current.hasSha() && get.effect(current, { name: "juedou" }, player, player) > 0;
							})
						) {
							return 1;
						}
						if (player.storage._ichiban_no_takaramono) {
							return "cancel2";
						}
					}
					if (
						player.countCards("h", function (card) {
							return get.color(card) == "red" && card.name != "sha" && player.hasValueTarget(card);
						}) == 0
					) {
						return 0;
					}
					if (player.storage._ichiban_no_takaramono) {
						return "cancel2";
					}
					return 1;
				})
				.forResult();
			if (control !== "cancel2") {
				event.result = {
					bool: true,
					cost_data: { index },
				};
			}
		},
		async content(event, trigger, player) {
			player.addTempSkill(`yui_lieyin${event.cost_data.index}`, "phaseUseEnd");
		},
	},
	yui_lieyin0: {
		mod: {
			cardname(card) {
				if (get.color(card) == "red") {
					return "sha";
				}
			},
		},
	},
	yui_lieyin1: {
		mod: {
			cardname(card) {
				if (card.name == "sha") {
					return "juedou";
				}
			},
		},
	},
	yui_takaramono: {
		trigger: { player: "phaseZhunbeiBegin" },
		forced: true,
		juexingji: true,
		skillAnimation: true,
		animationColor: "key",
		filter(event, player) {
			var num = 0;
			if (player.hp <= 1) {
				num++;
			}
			if (game.dead.length > 0) {
				num++;
			}
			if (num != 1) {
				return num > 1;
			}
			var draw = 0;
			player.getAllHistory("gain", function (evt) {
				if (evt.getParent(2).name == "yui_jiang") {
					draw += evt.cards.length;
				}
			});
			return draw >= 3;
		},
		content() {
			player.awakenSkill(event.name);
			player.addSkills("yui_yinhang");
			player.storage._ichiban_no_takaramono = true;
			player.gainMaxHp();
			player.recover();
		},
		derivation: "yui_yinhang",
	},
	yui_yinhang: {
		trigger: { player: "changeHp" },
		locked: true,
		getIndex: event => Math.abs(event.num),
		line: { color: [253, 153, 182] },
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget([1, 2], get.prompt(event.skill), "令至多两名角色各摸一张牌")
				.set("ai", function (target) {
					return get.attitude(_status.event.player, target);
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const targets = event.targets;
			targets.sortBySeat();
			game.asyncDraw(targets);
		},
	},
	//吉野晴彦
	yoshino_jueyi: {
		trigger: { player: "phaseUseBegin" },
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget(lib.filter.notMe, get.prompt2(event.skill))
				.set("ai", function (target) {
					var player = _status.event.player;
					if (get.damageEffect(target, player, player) < 0) {
						return 0;
					}
					var att = get.attitude(player, target);
					if (att > 0) {
						return 0;
					}
					if (att == 0) {
						return 0.1;
					}
					var eff = 0;
					var hs = player.getCards("h");
					for (var i = 0; i < hs.length; i++) {
						if (player.canUse(hs[i], target)) {
							var eff2 = get.effect(target, hs[i], player, player);
							if (eff2 > 0) {
								eff += eff2;
							}
						}
					}
					return -att / (1 + eff);
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const target = event.targets[0];
			await player.draw();
			let result;
			do {
				result = await player.chooseToPSS(target).forResult();
			} while (result.tie);
			if (result.bool) {
				await target.damage();
			} else {
				target.addTempSkill("yoshino_fail", "phaseUseEnd");
			}
		},
	},
	yoshino_fail: {
		mod: {
			targetEnabled(card, player, target) {
				if (player == _status.currentPhase) {
					return false;
				}
			},
		},
	},
	//宫泽谦吾
	kengo_weishang: {
		locked: false,
		mod: {
			cardUsable(card, player, num) {
				if (card.name == "sha" && player.hasDisabledSlot(1)) {
					return num + 1;
				}
			},
			globalFrom(from, to, distance) {
				if (from.hasDisabledSlot(4)) {
					return distance - 1;
				}
			},
			globalTo(from, to, distance) {
				if (to.hasDisabledSlot(3)) {
					return distance + 1;
				}
			},
		},
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			var list = ["equip1", "equip2", "equip3", "equip4", "equip5"];
			for (var i = 0; i < list.length; i++) {
				if (player.hasEnabledSlot(list[i]) && (!player.storage.kengo_guidui2 || !player.storage.kengo_guidui2.includes(list[i]))) {
					return true;
				}
			}
			return false;
		},
		content() {
			"step 0";
			var list = ["equip1", "equip2", "equip3", "equip4", "equip5"];
			for (var i = 0; i < list.length; i++) {
				if (!player.hasEnabledSlot(list[i]) || (player.storage.kengo_guidui2 && player.storage.kengo_guidui2.includes(list[i]))) {
					list.splice(i--, 1);
				}
			}
			player.chooseControl(list).set("prompt", "请选择废除一个装备栏").ai = function () {
				if (
					list.includes("equip1") &&
					player.hasEmptySlot("equip1") &&
					player.countCards("h", function (card) {
						return card.name == "sha" && player.getUseValue(card) > 0;
					})
				) {
					return "equip1";
				}
				if (list.includes("equip3") && player.hasEmptySlot("equip3")) {
					return "equip3";
				}
				if (list.includes("equip4") && player.hasEmptySlot("equip4")) {
					return "equip4";
				}
				if (list.includes("equip5") && player.hasEmptySlot("equip5")) {
					return "equip5";
				}
				if (list.includes("equip2") && player.hasEmptySlot("equip2")) {
					return "equip2";
				}
				return list.randomGet();
			};
			"step 1";
			player.disableEquip(result.control);
			player.draw(2);
		},
		group: ["kengo_weishang_sha", "kengo_weishang_shan"],
		ai: {
			order: 10,
			result: { player: 1 },
		},
	},
	kengo_weishang_sha: {
		trigger: { player: "useCardToPlayered" },
		forced: true,
		filter(event, player) {
			return event.card.name == "sha" && player.hasDisabledSlot(1) && event.target.countCards("he") > 0;
		},
		logTarget: "target",
		content() {
			trigger.target.chooseToDiscard("he", true);
		},
	},
	kengo_weishang_shan: {
		enable: ["chooseToUse", "chooseToRespond"],
		viewAs: { name: "shan" },
		filterCard: true,
		position: "hes",
		prompt: "将一张牌当做闪使用或打出",
		viewAsFilter(player) {
			return player.hasDisabledSlot(2) && player.countCards("hes") > 0;
		},
		check(card) {
			return 1 / Math.max(0.1, get.value(card));
		},
		ai: {
			respondShan: true,
			skillTagFilter(player) {
				return player.hasDisabledSlot(2) && player.countCards("he") > 0;
			},
		},
	},
	kengo_guidui: {
		trigger: { player: "phaseZhunbeiBegin" },
		forced: true,
		filter(event, player) {
			return player.countDisabledSlot() > 0;
		},
		content() {
			var list = [];
			for (var i = 1; i <= 5; i++) {
				for (var j = 0; j < player.countDisabledSlot(i); j++) {
					list.push("equip" + i);
				}
			}
			player.enableEquip(list);
			if (!player.storage.kengo_guidui2) {
				player.storage.kengo_guidui2 = [];
			}
			player.storage.kengo_guidui2.addArray(list);
		},
		ai: {
			combo: "kengo_weishang",
		},
	},
	kengo_guidui2: { onremove: true },
	//岩泽雅美
	iwasawa_yinhang: {
		trigger: { player: "changeHp" },
		locked: true,
		line: { color: [235, 96, 138] },
		getIndex: event => Math.abs(event.num),
		async cost(event, trigger, player) {
			event.result = await player
				.chooseTarget([1, 2], get.prompt(event.skill), "令至多两名角色各摸一张牌")
				.set("ai", function (target) {
					return get.attitude(_status.event.player, target);
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const targets = event.targets;
			targets.sortBySeat();
			game.asyncDraw(targets);
		},
	},
	iwasawa_mysong: {
		trigger: {
			player: ["phaseBeginStart", "phaseAfter", "dyingBefore"],
		},
		forced: true,
		filter(event, player) {
			return event.name == "dying" || player.hp < 1;
		},
		content() {
			if (trigger.name == "dying") {
				trigger.cancel();
			} else if (event.triggername == "phaseBeginStart") {
				player.addTempSkill("iwasawa_fenyin");
			} else {
				player.die();
			}
		},
		nobracket: true,
		derivation: "iwasawa_fenyin",
	},
	iwasawa_refenyin: {
		audio: 2,
		audioname2: {
			wufan: "refenyin_wufan",
		},
		trigger: {
			global: ["loseAfter", "cardsDiscardAfter", "equipAfter"],
		},
		forced: true,
		filter(event, player) {
			if (player != _status.currentPhase) {
				return false;
			}
			var cards = event.getd();
			var list = [];
			for (var i = 0; i < cards.length; i++) {
				var card = cards[i];
				list.add(card.suit);
			}
			game.getGlobalHistory("cardMove", function (evt) {
				if (evt == event || evt.getParent() == event || (evt.name != "lose" && evt.name != "cardsDiscard")) {
					return false;
				}
				if (evt.name == "lose" && evt.position != ui.discardPile) {
					return false;
				}
				for (var i = 0; i < evt.cards.length; i++) {
					var card = evt.cards[i];
					list.remove(card.suit);
				}
			});
			return list.length > 0;
		},
		content() {
			var list = [];
			var list2 = [];
			var cards = trigger.getd();
			for (var i = 0; i < cards.length; i++) {
				var card = cards[i];
				var suit = card.suit;
				list.add(suit);
				list2.add(suit);
			}
			game.getGlobalHistory("cardMove", function (evt) {
				if (evt == trigger || evt.getParent() == trigger || (evt.name != "lose" && evt.name != "cardsDiscard")) {
					return false;
				}
				if (evt.name == "lose" && evt.position != ui.discardPile) {
					return false;
				}
				for (var i = 0; i < evt.cards.length; i++) {
					var card = evt.cards[i];
					var suit = card.suit;
					list.remove(suit);
					list2.add(suit);
				}
			});
			list2.sort();
			player.draw(list.length);
			player.storage.iwasawa_refenyin_mark = list2;
			player.addTempSkill("iwasawa_refenyin_mark");
			player.markSkill("iwasawa_refenyin_mark");
		},
		subSkill: {
			mark: {
				onremove: true,
				intro: {
					content(s) {
						var str = "本回合已经进入过弃牌堆的卡牌的花色：";
						for (var i = 0; i < s.length; i++) {
							str += get.translation(s[i]);
						}
						return str;
					},
				},
			},
		},
	},
	iwasawa_fenyin: {
		mod: {
			aiOrder(player, card, num) {
				if (typeof card == "object" && player == _status.currentPhase) {
					var evt = player.getLastUsed();
					if (evt && evt.card && get.color(evt.card) != "none" && get.color(card) != "none" && get.color(evt.card) != get.color(card)) {
						return num + 10;
					}
				}
			},
		},
		audio: 2,
		trigger: { player: "useCard" },
		frequent: true,
		//usable:3,
		filter(event, player) {
			if (_status.currentPhase != player) {
				return false;
			}
			var evt = player.getLastUsed(1);
			if (!evt) {
				return false;
			}
			var color1 = get.color(evt.card);
			var color2 = get.color(event.card);
			return color1 && color2 && color1 != "none" && color2 != "none" && color1 != color2;
		},
		content() {
			player.draw();
		},
		ai: {
			threaten(player, target) {
				if (target.hp < 1) {
					return 3;
				}
				return 1;
			},
		},
	},
	//井之原真人
	masato_baoquan: {
		trigger: { source: "damageBefore" },
		forced: true,
		content() {
			"step 0";
			player
				.chooseControl("防止伤害", "增加伤害")
				.set("prompt", "暴拳：防止即将对" + get.translation(trigger.player) + "造成的伤害，或失去1点体力上限并令此伤害+2")
				.set("choice", get.attitude(player, trigger.player) >= 0 ? 0 : 1)
				.set("ai", function () {
					return _status.event.choice;
				});
			"step 1";
			if (result.control == "增加伤害") {
				player.loseMaxHp();
				trigger.num += 2;
			} else {
				trigger.cancel();
			}
		},
		ai: {
			effect: {
				player(card, player, target) {
					if (target && get.attitude(player, target) > 0 && get.tag(card, "damage")) {
						return "zeroplayertarget";
					}
				},
			},
		},
	},
	//西森柚咲&黑羽美砂
	yusa_yanyi: {
		enable: "phaseUse",
		usable: 1,
		filterTarget(card, player, target) {
			return get.distance(player, target) <= player.hp;
		},
		selectTarget() {
			return [1, Math.max(_status.event.player.getAttackRange())];
		},
		line: "thunder",
		content() {
			"step 0";
			if (target.isHealthy()) {
				player.draw();
				event.finish();
			} else {
				var name = get.translation(player);
				target
					.chooseControl()
					.set("choiceList", ["令" + name + "摸一张牌", "回复1点体力，然后交给" + name + "一张牌"])
					.set("ai", function () {
						return 1;
					});
			}
			"step 1";
			if (result.index == 0) {
				player.draw();
				event.finish();
			} else {
				target.recover();
			}
			"step 2";
			if (target != player && target.countCards("he") > 0) {
				target.chooseCard("交给" + get.translation(player) + "一张牌", "he", true);
			} else {
				event.finish();
			}
			"step 3";
			target.give(result.cards, player, "giveAuto");
		},
		ai: {
			order: 10,
			result: {
				player(player, target) {
					return target.isHealthy() ? 1 : 0;
				},
				target(player, target) {
					if (target.isHealthy()) {
						return 0;
					}
					return get.recoverEffect(target, player, target);
				},
			},
		},
	},
	yusa_misa: {
		charlotte: true,
		trigger: { player: "useSkillAfter" },
		filter(event, player) {
			return event.skill == "yusa_yanyi" && !player.storage.dualside_over && Array.isArray(player.storage.dualside);
		},
		content() {
			player.turnOver();
		},
		ai: {
			combo: "yusa_yanyi",
		},
	},
	misa_yusa: {
		charlotte: true,
		trigger: { player: "misa_yehuoAfter" },
		filter(event, player) {
			return event.bool === true && !player.storage.dualside_over && Array.isArray(player.storage.dualside);
		},
		content() {
			player.turnOver();
		},
	},
	misa_yehuo: {
		charlotte: true,
		trigger: { global: "phaseDrawBegin1" },
		locked: true,
		line: { color: [236, 137, 52] },
		filter(event, player) {
			var target = event.player;
			return player.inRange(target) && player.countCards("he") >= get.distance(player, target);
		},
		async cost(event, trigger, player) {
			var next = player.chooseToDiscard("he", get.distance(player, trigger.player) || 1, get.prompt2(event.skill, trigger.player), "chooseonly");
			next.set("ai", function (card) {
				var val = _status.event.val;
				for (var i = 0; i < ui.selected.cards.length; i++) {
					val -= get.value(ui.selected.cards[i]);
				}
				return val - get.value(card);
			});
			next.set("val", -2 * get.attitude(player, trigger.player));
			event.result = await next.forResult();
		},
		logTarget: "player",
		content() {
			"step 0";
			player.discard(cards);
			"step 1";
			event.bool = true;
			if (trigger.numFixed) {
				event._result = { index: 0 };
			} else if (trigger.player.isIn()) {
				var name = get.translation(trigger.player);
				player.chooseControl().set("choiceList", ["对" + name + "造成1点火属性伤害", "令" + name + "此出牌阶段的额定摸牌数改为0"]);
			} else {
				event.finish();
			}
			"step 2";
			if (result.index == 0) {
				trigger.player.damage("fire");
			} else {
				trigger.changeToZero();
			}
		},
		ai: {
			fireAttack: true,
		},
	},
	//宫泽有纪宁
	yukine_wenzhou: {
		trigger: { global: "phaseUseBegin" },
		filter(event, player) {
			return event.player.countCards("he") > 0;
		},
		async cost(event, trigger, player) {
			event.forceDie = true;
			var ask = trigger.player.chooseCard("he", get.prompt(event.skill));
			if (player === trigger.player) {
				ask.set("prompt2", "选择一张牌，然后从牌堆中获得一张与此牌类型相同的牌。本回合内使用与此牌类型相同的牌时不可被其他角色响应。");
			} else {
				ask.set("prompt2", "将一张牌交给" + get.translation(player) + "然后其可以选择：交给你一张牌；或令你从牌堆中获得一张与此牌类型相同的牌，且你本回合内使用与此牌类型相同的牌时不可被响应。");
			}
			ask.set("ai", function (card) {
				if (get.attitude(_status.event.player, _status.event.getParent().player) > 0) {
					return 10 - get.value(card);
				}
				return -1;
			});
			event.result = await ask.forResult();
		},
		content() {
			"step 0";
			event.forceDie = true;
			event.type = get.type(cards[0], "trick");
			if (trigger.player != player) {
				trigger.player.give(cards, player, "giveAuto");
			}
			"step 1";
			if (player == trigger.player || player.countCards("he") == 0) {
				event._result = { index: 1 };
			} else {
				player
					.chooseControl()
					.set("choiceList", ["将一张牌交给" + get.translation(trigger.player), "令" + get.translation(trigger.player) + "从牌堆中获得一张" + get.translation(event.type) + "牌，且其本回合内使用与此牌名称相同的牌时不可被响应"])
					.set("forceDie", true)
					.set("ai", function () {
						if (get.attitude(_status.event.player, _status.event.getTrigger().player) > 0) {
							return 1;
						}
						return 0;
					});
			}
			"step 2";
			event.index = result.index;
			if (result.index == 1) {
				var magic = get.cardPile2(function (card) {
					return get.type(card, "trick") == event.type;
				});
				if (magic) {
					trigger.player.addTempSkill("yukine_magic", "phaseUseEnd");
					trigger.player.storage.yukine_magic.add(magic.name);
					trigger.player.gain(magic, "draw");
				} else {
					event.finish();
				}
			} else {
				player.chooseCard("he", true, "选择要交给" + get.translation(trigger.player) + "的牌").set("ai", function (card) {
					return -get.value(card, _status.event.getTrigger().player);
				});
			}
			"step 3";
			if (event.index == 1) {
				game.updateRoundNumber();
			} else if (result.bool) {
				player.give(result.cards, trigger.player, "giveAuto");
			}
		},
	},
	yukine_magic: {
		trigger: { player: "useCard" },
		forced: true,
		popup: false,
		charlotte: true,
		filter(event, player) {
			return player.storage.yukine_magic && player.storage.yukine_magic.includes(event.card.name);
		},
		content() {
			trigger.directHit.addArray(
				game.filterPlayer(function (current) {
					if (player != current) {
						return true;
					}
					return !player.hasSkill("yukine_wenzhou");
				})
			);
		},
		onremove: true,
		init(player, skill) {
			if (!player.storage[skill]) {
				player.storage[skill] = [];
			}
		},
		ai: {
			directHit_ai: true,
			skillTagFilter(player, tag, arg) {
				return player.storage.yukine_magic && player.storage.yukine_magic.includes(arg.card.name);
			},
		},
	},
	//神北小毬
	komari_tiankou: {
		trigger: {
			player: "useCard2",
			target: "useCardToTarget",
		},
		forced: true,
		filter(event, player, name) {
			if (name == "useCardToTarget" && player == event.player) {
				return false;
			}
			if (get.color(event.card) != "red") {
				return false;
			}
			if (get.tag(event.card, "damage")) {
				return false;
			}
			return ["basic", "trick"].includes(get.type(event.card));
		},
		content() {
			"step 0";
			var info = get.info(trigger.card);
			var bool = true;
			if (info.multitarget || info.allowMultiple === false) {
				bool = false;
			} else {
				var list = game.filterPlayer(function (current) {
					return !trigger.targets.includes(current) && lib.filter.targetEnabled2(trigger.card, trigger.player, current);
				});
				if (!list.length) {
					bool = false;
				}
			}
			if (bool) {
				player
					.chooseTarget("甜口：为" + get.translation(trigger.card) + "增加一个额外目标，或点【取消】摸一张牌。", function (candy, komari, rin) {
						return _status.event.rin_chan.includes(rin);
					})
					.set("rin_chan", list)
					.set("ai", function (target) {
						var evt = _status.event;
						return get.effect(target, evt.candy, evt.source, evt.player);
					})
					.set("candy", trigger.card)
					.set("", trigger.player);
			} else {
				event._result = { bool: false };
			}
			"step 1";
			if (result.bool) {
				var rin = result.targets[0];
				trigger.targets.push(rin);
				player.line(rin, { color: [255, 224, 172] });
			} else {
				player.draw();
			}
		},
	},
	komari_xueshang: {
		trigger: { global: "die" },
		forced: true,
		skillAnimation: true,
		chargingSkill: true,
		filter(event, player) {
			return player.hp > 0;
		},
		animationColor: "metal",
		content() {
			"step 0";
			player.addSkill("riki_xueshang");
			var map = {};
			var list = [];
			for (var i = 1; i <= player.hp; i++) {
				var cn = get.cnNumber(i, true);
				map[cn] = i;
				list.push(cn);
			}
			event.map = map;
			player
				.chooseControl(list, function () {
					return "一";
				})
				.set("prompt", "血殇：请选择自己受到的伤害的点数");
			"step 1";
			var num = event.map[result.control] || 1;
			event.num = num > 1 ? 2 : 1;
			event.list = game
				.filterPlayer(function (current) {
					return current != player;
				})
				.sortBySeat();
			player.damage(num);
			player.line(event.list, { color: [255, 224, 172] });
			"step 2";
			if (!player.hasSkill(event.name)) {
				return;
			} else {
				event.list.shift().damage(num);
				if (event.list.length) {
					event.redo();
				}
			}
		},
	},
	riki_xueshang: {
		trigger: { global: "dying" },
		forced: true,
		popup: false,
		charlotte: true,
		filter(event, player) {
			return event.getParent(2).name == "komari_xueshang" && event.getParent(2).player == player;
		},
		content() {
			player.removeSkills("komari_xueshang");
			player.gainMaxHp(true);
			player.recover();
		},
	},
	//鹰原羽未
	umi_chaofan: {
		enable: "phaseUse",
		usable: 1,
		selectCard: 2,
		complexCard: true,
		filter(summer, umi) {
			return umi.countCards("h") > 1;
		},
		check(ingredient) {
			return 7 - get.value(ingredient);
		},
		filterCard(ingredient) {
			if (ui.selected.cards.length) {
				return get.suit(ingredient) != get.suit(ui.selected.cards[0]);
			}
			return true;
		},
		line: { color: [251, 193, 217] },
		filterTarget: lib.filter.notMe,
		content() {
			"step 0";
			player.draw();
			"step 1";
			if (player.hp > 2) {
				target.recover();
			} else if (player.hp == 2) {
				target.draw(2);
			} else {
				target.damage("fire", "nosource");
			}
		},
		ai: {
			order: 2,
			result: {
				target(umi, takahara) {
					if (umi.hp > 2 && takahara.isDamaged()) {
						return 2.2;
					}
					if (umi.hp == 2 && !takahara.hasSkillTag("nogain")) {
						return 2;
					}
					if (umi.hp < 2) {
						return get.damageEffect(takahara, umi, umi, "fire");
					}
				},
			},
		},
	},
	umi_lunhui: {
		trigger: { global: "phaseAfter" },
		filter(summer, umi) {
			return summer.player != umi && umi.countCards("h") < umi.hp;
		},
		line: { color: [251, 193, 217] },
		logTarget: "player",
		charlotte: true,
		content() {
			"step 0";
			player.loseHp();
			"step 1";
			player.draw(2);
			player.insertPhase();
			player.storage.umi_shiroha = trigger.player;
			player.addTempSkill("umi_shiroha");
		},
	},
	umi_shiroha: {
		mark: "character",
		intro: {
			content: "到$的距离视为1",
		},
		onremove: true,
		charlotte: true,
		mod: {
			globalFrom(umi, shiroha) {
				if (umi.storage.umi_shiroha == shiroha) {
					return -Infinity;
				}
			},
		},
	},
	umi_qihuan: {
		forceunique: true,
		enable: "chooseToUse",
		filter(summer, umi) {
			return summer.type == "dying" && umi.isDying() && [umi.name1, umi.name2].includes("key_umi");
		},
		limited: true,
		skillAnimation: true,
		charlotte: true,
		animationColor: "key",
		content() {
			"step 0";
			player.awakenSkill(event.name);
			player.reinitCharacter("key_umi", "key_umi2", false);
			player.recover(game.countGroup() || 1);
			if (!game.dead.length) {
				event.finish();
			}
			"step 1";
			var chara = [];
			var skills = [];
			for (var i = 0; i < game.dead.length; i++) {
				var name = game.dead[i].name;
				var name2 = game.dead[i].name2;
				var skill = [];
				if (name && lib.character[name]) {
					skill.addArray(lib.character[name][3]);
				}
				if (name2 && lib.character[name2]) {
					skill.addArray(lib.character[name2][3]);
				}
				if (skill.length) {
					chara.push(game.dead[i]);
					skills.push(skill);
				}
			}
			if (!chara.length) {
				event.finish();
			}
			event.chara = chara;
			event.skills = skills;
			event.chosen = [];
			"step 2";
			var next = player.chooseTarget("是否获得一名已死亡角色的一个技能？");
			next.set("chara", event.chara);
			next.set("skills", event.skills);
			next.set("chosen", event.chosen);
			next.set("filterTarget", function (card, player, target) {
				if (target.isAlive()) {
					return false;
				}
				var evt = _status.event;
				if (!evt.chosen.length) {
					return true;
				}
				var skills = evt.skills[evt.chara.indexOf(target)];
				if (skills.length == 1 && skills[0] == evt.chosen[0]) {
					return false;
				}
				return true;
			});
			next.set("deadTarget", true);
			next.set("ai", function () {
				return Math.random();
			});
			"step 3";
			if (!result.bool) {
				event.finish();
			} else {
				event.temp = result.targets[0];
				var list = event.skills[event.chara.indexOf(result.targets[0])];
				result.targets[0].line(player, {
					color: [251, 193, 217],
				});
				list.removeArray(event.chosen);
				player.chooseControl(list).set("prompt", "选择获得一个技能");
			}
			"step 4";
			player.addSkills(result.control);
			var info = get.info(result.control);
			if (info.zhuSkill) {
				if (!player.storage.zhuSkill_umi_qihuan) {
					player.storage.zhuSkill_umi_qihuan = [];
				}
				player.storage.zhuSkill_umi_qihuan.push(result.control);
			}
			event.chosen.push(result.control);
			if (event.chosen.length < 2) {
				event.goto(2);
			}
		},
		ai: {
			order: 10,
			save: true,
			skillTagFilter(player, tag, target) {
				return player == target;
			},
			result: { player: 1 },
		},
	},
	//神尾晴子
	haruko_haofang: {
		mod: {
			cardname(card, player, name) {
				if (lib.card[card.name].type == "delay") {
					return "wuzhong";
				}
			},
		},
		trigger: { player: "drawBefore" },
		forced: true,
		filter(event, player) {
			return event.getParent().name == "wuzhong";
		},
		content() {
			trigger.num += 2;
		},
	},
	haruko_zhuishi: {
		trigger: { global: "phaseJudgeBegin" },
		filter(misuzu) {
			return misuzu.player.countCards("j") > 0;
		},
		check(event, player) {
			return get.attitude(player, event.player) > 1;
		},
		logTarget: "player",
		content() {
			"step 0";
			player.gain(trigger.player.getCards("j"), trigger.player, "give", "bySelf");
			"step 1";
			if (player.hp > 1) {
				player.loseHp();
			}
		},
	},
	yuri_xingdong: {
		audio: 3,
		group: "yuri_xingdong_gain",
		subSkill: {
			mark: {
				mark: true,
				marktext: "令",
				intro: {
					content: "跳过下个回合的判定阶段和摸牌阶段",
				},
			},
			gain: {
				audio: 2,
				trigger: { player: "phaseUseBegin" },
				forced: true,
				content() {
					"step 0";
					var card = get.cardPile(function (card) {
						return card.name == "sha" || get.type(card) == "trick";
					});
					if (card) {
						player.gain(card, "gain2", "log");
					}
					"step 1";
					game.updateRoundNumber();
				},
			},
		},
		enable: "phaseUse",
		usable: 1,
		locked: true,
		filter(event, player) {
			return player.countCards("h", lib.skill.yuri_xingdong.filterCard);
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
				target.addTempSkill("yuri_xingdong_mark", "phaseJudgeSkipped");
				target.skip("phaseJudge");
				target.skip("phaseDraw");
				target.addTempSkill("zhengjing3", {
					player: "phaseAfter",
				});
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
								eff += get.effect(current, card, target, target);
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
	yuri_wangxi: {
		audio: 2,
		trigger: { global: "dieAfter" },
		limited: true,
		mark: false,
		init(player) {
			if (player.hasZhuSkill("yuri_wangxi")) {
				player.markSkill("yuri_wangxi");
				player.storage.yuri_wangxi = false;
			}
		},
		zhuSkill: true,
		skillAnimation: true,
		animationColor: "thunder",
		filter(event, player) {
			if (get.mode() != "identity") {
				return false;
			}
			if (!player.hasZhuSkill("yuri_wangxi")) {
				return false;
			}
			if (event.player.isIn()) {
				return false;
			}
			if (event.player.identity == "mingzhong") {
				return false;
			}
			var evt = event.getParent("yuri_xingdong");
			return evt && evt.name == "yuri_xingdong" && evt.player == player;
		},
		async cost(event, trigger, player) {
			event.result = await trigger.player
				.chooseBool("是否发动" + get.translation(player) + "的【忘隙】？")
				.set("forceDie", true)
				.forResult();
		},
		logTarget: "player",
		async content(event, trigger, player) {
			player.awakenSkill(event.name);
			var identity = "zhong";
			if (_status.mode == "purple") {
				if (["rNei", "bNei"].includes(player.identity)) {
					identity = player.identity;
				} else if (["rZhu", "rZhong", "bNei"].includes(player.identity)) {
					identity = "rZhong";
				} else {
					identity = "bZhong";
				}
			}
			game.broadcastAll(
				function (source, identity) {
					if (source.node.dieidentity) {
						source.node.dieidentity.innerHTML = get.translation(identity + 2);
					}
					source.revive(2, false);
					source.identity = identity;
					source.setIdentity();
				},
				trigger.player,
				identity
			);
			var evt = trigger.getParent("damage");
			if (evt.untrigger) {
				evt.untrigger(false, trigger.player);
			}
			game.addVideo("setIdentity", trigger.player, "zhong");

			await trigger.player.changeGroup(player.group);
			await trigger.player.draw();
		},
		ai: { combo: "yuri_xingdong" },
	},
	//枣恭介
	nk_shekong: {
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return player.countCards("h") > 0;
		},
		filterCard: true,
		selectCard() {
			if (ui.selected.targets.length) {
				return [1, ui.selected.targets[0].countCards("he")];
			}
			return [1, Infinity];
		},
		filterTarget(event, player, target) {
			return target != player && target.countCards("he") >= Math.max(1, ui.selected.cards.length);
		},
		check(card) {
			if (
				!game.hasPlayer(function (current) {
					return current != _status.event.player && get.attitude(_status.event.player, current) < 0 && current.countCards("he") > ui.selected.cards.length;
				})
			) {
				return 0;
			}
			return 6 - get.value(card);
		},
		content() {
			"step 0";
			event.cardsx = cards.slice(0);
			var num = get.cnNumber(cards.length);
			var trans = get.translation(player);
			var prompt = "弃置" + num + "张牌，然后" + trans + "摸一张牌";
			if (cards.length > 1) {
				prompt += "；或弃置一张牌，然后" + trans + "摸" + num + "张牌";
			}
			var next = target.chooseToDiscard(prompt, "he", true);
			next.numx = cards.length;
			next.selectCard = function () {
				if (ui.selected.cards.length > 1) {
					return _status.event.numx;
				}
				return [1, _status.event.numx];
			};
			next.complexCard = true;
			next.ai = function (card) {
				if (
					ui.selected.cards.length == 0 ||
					_status.event.player.countCards("he", function (cardxq) {
						return get.value(cardxq) < 7;
					}) >= _status.event.numx
				) {
					return 7 - get.value(card);
				}
				return -1;
			};
			"step 1";
			if (result.bool) {
				if (result.cards.length == cards.length) {
					player.draw();
				} else {
					player.draw(cards.length);
				}
				event.cardsx.addArray(result.cards);
				for (var i = 0; i < event.cardsx.length; i++) {
					if (get.position(event.cardsx[i]) != "d") {
						event.cardsx.splice(i--, 1);
					}
				}
			} else {
				event.finish();
			}
			"step 2";
			if (event.cardsx.length) {
				player.chooseButton(["请按顺序将卡牌置于牌堆顶（先选择的在上）", event.cardsx], true, event.cardsx.length);
			} else {
				event.finish();
			}
			"step 3";
			if (result.bool) {
				var cardsx = result.links;
				while (cardsx.length) {
					var card = cardsx.pop();
					card.fix();
					ui.cardPile.insertBefore(card, ui.cardPile.firstChild);
				}
			}
		},
		ai: {
			order: 10,
			result: {
				target: -1,
			},
		},
	},
	key_huanjie: {
		trigger: { player: ["drawBegin", "judgeBegin"] },
		forced: true,
		silent: true,
		popup: false,
		lastDo: true,
		filter(event) {
			return event.name == "draw" || !event.directresult;
		},
		content() {
			if (trigger.name == "draw") {
				if (trigger.bottom) {
					trigger.bottom = false;
				} else {
					trigger.bottom = true;
				}
			} else {
				trigger.directresult = get.bottomCards()[0];
			}
		},
		ai: {
			abnormalDraw: true,
			skillTagFilter(player, tag, arg) {
				if (tag === "abnormalDraw") {
					return !arg || arg === "bottom";
				}
			},
		},
	},
	//此花露西娅
	lucia_duqu: {
		trigger: {
			player: ["damage", "loseHpBefore", "useCardBefore"],
			source: "damage",
		},
		forced: true,
		charlotte: true,
		filter(event, player, onrewrite) {
			if (onrewrite == "loseHpBefore") {
				return event.type == "du";
			}
			return event.source != undefined && event.source != event.player;
		},
		content() {
			var onrewrite = event.triggername;
			if (onrewrite == "loseHpBefore") {
				trigger.cancel();
				player.recover(trigger.num);
			} else {
				var another = trigger[trigger.source == player ? "player" : "source"];
				player.line(another, { color: [220, 90, 139] });
				another.gain(game.createCard2("du"), "gain2");
			}
		},
		ai: {
			usedu: true,
		},
	},
	lucia_zhenren: {
		trigger: { global: "phaseJieshuBegin" },
		forced: true,
		charlotte: true,
		filter(event, player) {
			return player.countCards("e") > 0;
		},
		content() {
			"step 0";
			var es = player.getCards("e");
			event.count = es.length;
			player.discard(es);
			"step 1";
			event.count--;
			if (
				game.hasPlayer(function (current) {
					return current.countDiscardableCards(player, "ej") > 0;
				})
			) {
				player.chooseTarget("请选择一名角色，弃置其装备区或判定区内的一张牌。", true, function (card, player, target) {
					return target.countDiscardableCards(player, "ej") > 0;
				}).ai = function (target) {
					var att = get.attitude(_status.event.player, target);
					if (target.countCards("j") && att > 0) {
						return att * 1.5;
					}
					return -att;
				};
			} else {
				event.finish();
			}
			"step 2";
			if (result.bool && result.targets && result.targets.length) {
				var target = result.targets[0];
				player.line(target, { color: [220, 90, 139] });
				player.discardPlayerCard(target, "ej", true);
				if (event.count) {
					event.goto(1);
				}
			}
		},
	},
};

export default skills;
