import { lib, game, ui, get, ai, _status } from "noname";
import html from "dedent";

/** @type { importCharacterConfig["skill"] } */
const skills = {
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
					if (!get.event().check) {
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
					.chooseToUse(
						function (card, player, event) {
							if (get.name(card) != "sha") {
								return false;
							}
							return lib.filter.filterCard.apply(this, arguments);
						},
						"耀令：对" + get.translation(targets[1]) + "使用一张杀，或令" + get.translation(player) + "弃置你的一张牌"
					)
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
		trigger: {
			player: ["loseAfter", "changeHpAfter"],
			global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"],
		},
		filter(event, player) {
			if (player.hp < 1 || !player.countDiscardableCards(player, "h")) {
				return false;
			}
			if (event.name == "changeHp") {
				return event.changedHp != 0;
			}
			const evt = event.getl(player);
			if (event.name == "equip" && event.player == player) {
				return !evt || evt.cards.length != 1;
			}
			if (!evt?.es.length) {
				return false;
			}
			return game.hasPlayer(current => player.canUse({ name: "sha", isCard: true }, current, false));
		},
		direct: true,
		forced: true,
		async content(event, trigger, player) {
			if (!player.countDiscardableCards(player, "h") || !game.hasPlayer(current => player.canUse({ name: "sha", isCard: true }, current, false))) {
				return;
			}
			const result = await player
				.chooseCardTarget({
					prompt: "莽击：弃置一张手牌，视为对一名其他角色使用一张【杀】",
					forced: true,
					filterCard: lib.filter.cardDiscardable,
					filterTarget(card, player, target) {
						return player.canUse({ name: "sha", isCard: true }, target, false);
					},
					ai2(target) {
						return get.effect(target, { name: "sha" }, _status.event.player);
					},
				})
				.forResult();
			if (result?.bool) {
				const target = result.targets[0],
					cards = result.cards;
				player.logSkill(event.name, target);
				await player.discard(cards);
				if (player.canUse({ name: "sha", isCard: true }, target, false)) {
					await player.useCard({ name: "sha", isCard: true }, target, false);
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
};

export default skills;
