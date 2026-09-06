import { lib, game, ui, get, ai, _status } from "../../main/utils.js";

const card = {
	gwjinli_jiu: {
		fullimage: true,
		gainable: false,
		cardimage: "gw_xianzumaijiu",
	},
	gw_xianzumaijiu: {
		type: "special",
		fullborder: "gold",
		vanish: true,
		derivation: "gw_huoge",
		toself: true,
		enable(event, player) {
			return !player.hasSkill("gw_xianzumaijiu");
		},
		savable(card, player, dying) {
			return dying === player;
		},
		usable: 1,
		selectTarget: -1,
		logv: false,
		modTarget: true,
		filterTarget(card, player, target) {
			return target === player;
		},
		async content(event, trigger, player) {
			const target = event.target,
				targets = event.targets;
			let card = event.card,
				cards = event.cards;
			if (target.isDying()) {
				await target.recover();
			} else {
				target.addTempSkill("gw_xianzumaijiu", ["phaseAfter", "shaAfter"]);
				if (cards && cards.length) {
					card = cards[0];
				}
				if (target === targets[0] && card.clone && (card.clone.parentNode === player.parentNode || card.clone.parentNode === ui.arena)) {
					card.clone.moveDelete(target);
					game.addVideo("gain2", target, get.cardsInfo([card]));
				}
				if (!target.node.jiu && lib.config.jiu_effect) {
					target.node.jiu = ui.create.div(".playerjiu", target.node.avatar);
					target.node.jiu2 = ui.create.div(".playerjiu", target.node.avatar2);
				}
			}
		},
		ai: {
			basic: {
				useful(card, i) {
					if (_status.event.player.hp > 1) {
						if (i === 0) {
							return 5;
						}
						return 1;
					}
					if (i === 0) {
						return 7.3;
					}
					return 4;
				},
				value(card, player, i) {
					if (player.hp > 1) {
						if (i === 0) {
							return 5;
						}
						return 1;
					}
					if (i === 0) {
						return 7.3;
					}
					return 4;
				},
			},
			order() {
				return get.order({ name: "sha" }) + 0.2;
			},
			result: {
				target(player, target) {
					if (target && target.isDying()) {
						return 2;
					}
					if (lib.config.mode === "stone" && !player.isMin()) {
						if (player.getActCount() + 1 >= player.actcount) {
							return false;
						}
					}
					var shas = player.getCards("h", "sha");
					if (shas.length > 1 && player.getCardUsable("sha") > 1) {
						return 0;
					}
					var card;
					if (shas.length) {
						for (var i = 0; i < shas.length; i++) {
							if (lib.filter.filterCard(shas[i], target)) {
								card = shas[i];
								break;
							}
						}
					} else if (player.hasSha()) {
						card = { name: "sha" };
					}
					if (card) {
						if (
							game.hasPlayer(function (current) {
								return !current.hujia && get.attitude(target, current) < 0 && target.canUse(card, current, true, true) && get.effect(current, card, target) > 0;
							})
						) {
							return 1;
						}
					}
					return 0;
				},
			},
		},
	},
	gwmaoxian_yioufeisi: {
		type: "gwmaoxian",
		fullborder: "gold",
		vanish: true,
		derivation: "gw_diandian",
		image: "character:gw_yioufeisisp",
		enable() {
			return game.countPlayer() > 2;
		},
		filterTarget(card, player, target) {
			return target !== player;
		},
		selectTarget: 2,
		multitarget: true,
		multiline: true,
		content() {
			"step 0";
			targets[0].useCard({ name: "sha" }, targets[1], "noai");
			"step 1";
			if (targets[0].isIn() && targets[1].isIn()) {
				targets[1].useCard({ name: "sha" }, targets[0], "noai");
			}
		},
		contentAfter() {
			var evt = _status.event.getParent("phaseUse");
			if (evt && evt.name === "phaseUse") {
				evt.skipped = true;
			}
		},
		ai: {
			value: 10,
			order: 1,
			result: {
				target(player, target) {
					return get.effect(target, { name: "sha" }, target, target);
				},
			},
		},
	},
	gwmaoxian_luoqi: {
		type: "gwmaoxian",
		fullborder: "gold",
		vanish: true,
		derivation: "gw_diandian",
		image: "character:gw_luoqi",
		enable: true,
		filterTarget(card, player, target) {
			return player.canUse("sha", target, false);
		},
		content() {
			"step 0";
			player.useCard({ name: "sha" }, target, false).animate = false;
			"step 1";
			event.targets = game.filterPlayer(function (current) {
				return current.canUse("sha", target, false) && current !== player;
			});
			event.targets.sortBySeat();
			"step 2";
			if (event.targets.length && target.isIn()) {
				event.current = event.targets.shift();
				if (event.current.hasSha()) {
					event.current.chooseToUse({ name: "sha" }, "是否对" + get.translation(target) + "使用一张杀？", target, -1);
				}
				event.redo();
			}
		},
		contentAfter() {
			var evt = _status.event.getParent("phaseUse");
			if (evt && evt.name === "phaseUse") {
				evt.skipped = true;
			}
		},
		ai: {
			value: 10,
			order: 1,
			result: {
				target(player, target) {
					return get.effect(target, { name: "sha" }, player, target);
				},
			},
		},
	},
	gwmaoxian_jieluote: {
		type: "gwmaoxian",
		fullborder: "gold",
		vanish: true,
		derivation: "gw_diandian",
		image: "character:gw_jieluote",
		enable: true,
		filterTarget: true,
		content() {
			if (target.isMaxHp() && target.hp > 2) {
				target.damage(2);
			} else {
				target.damage();
			}
		},
		contentAfter() {
			var evt = _status.event.getParent("phaseUse");
			if (evt && evt.name === "phaseUse") {
				evt.skipped = true;
			}
		},
		ai: {
			value: 10,
			order: 1,
			tag: {
				damage: 1,
			},
			result: {
				player(player, target) {
					var eff = get.damageEffect(target, player, player);
					if (eff > 0) {
						eff = Math.sqrt(eff);
						if (target.isMaxHp() && target.hp > 2) {
							if (get.attitude(player, target) > 0) {
								return 0;
							}
							switch (target.hp) {
								case 3:
									return eff * 2;
								case 4:
									return eff * 1.5;
								default:
									return eff * 1.1;
							}
						} else {
							switch (target.hp) {
								case 1:
									return eff * 1.6;
								case 2:
									return eff * 1.1;
								default:
									return eff;
							}
						}
					}
					return 0;
				},
			},
		},
	},
	gwmaoxian_yenaifa: {
		type: "gwmaoxian",
		fullborder: "gold",
		vanish: true,
		derivation: "gw_diandian",
		image: "character:gw_yenaifa",
		enable: true,
		notarget: true,
		content() {
			"step 0";
			event.targets = player.getEnemies().randomGets(3).sortBySeat();
			"step 1";
			if (event.targets.length) {
				player.line(event.targets.shift().getDebuff(false).addExpose(0.1));
				event.redo();
			}
			"step 2";
			game.delay();
		},
		contentAfter() {
			var evt = _status.event.getParent("phaseUse");
			if (evt && evt.name === "phaseUse") {
				evt.skipped = true;
			}
		},
		ai: {
			value: 10,
			order: 1,
			result: {
				player: 1,
			},
		},
	},
	gwmaoxian_telisi: {
		type: "gwmaoxian",
		fullborder: "gold",
		vanish: true,
		derivation: "gw_diandian",
		image: "character:gw_telisi",
		enable: true,
		notarget: true,
		content() {
			"step 0";
			event.targets = player.getFriends().randomGets(3);
			event.targets.add(player);
			event.targets.sortBySeat();
			"step 1";
			if (event.targets.length) {
				player.line(event.targets.shift().getBuff(false).addExpose(0.1));
				event.redo();
			}
			"step 2";
			game.delay();
		},
		contentAfter() {
			var evt = _status.event.getParent("phaseUse");
			if (evt && evt.name === "phaseUse") {
				evt.skipped = true;
			}
		},
		ai: {
			value: 10,
			order: 1,
			result: {
				player: 1,
			},
		},
	},
	gwmaoxian_hengsaite: {
		type: "gwmaoxian",
		fullborder: "gold",
		vanish: true,
		derivation: "gw_diandian",
		image: "character:gw_hengsaite",
		enable: true,
		notarget: true,
		content() {
			var targets = game
				.filterPlayer(function (current) {
					return player.canUse("wanjian", current);
				})
				.sortBySeat();
			if (targets.length) {
				player.addTempSkill("gwmaoxian_hengsaite_sha");
				player.useCard({ name: "wanjian" }, targets);
			}
		},
		contentAfter() {
			var evt = _status.event.getParent("phaseUse");
			if (evt && evt.name === "phaseUse") {
				evt.skipped = true;
			}
		},
		ai: {
			value: 10,
			order: 1,
			result: {
				player(player, target) {
					var targets = game.filterPlayer(function (current) {
						return player.canUse("wanjian", current);
					});
					var eff = 0;
					for (var i = 0; i < targets.length; i++) {
						eff += get.sgn(get.effect(targets[i], { name: "wanjian" }, player, player)) / Math.sqrt(targets[i].hp + 1);
					}
					return get.sgn(eff);
				},
			},
		},
	},
	gwmaoxian_fuertaisite: {
		type: "gwmaoxian",
		fullborder: "gold",
		vanish: true,
		derivation: "gw_diandian",
		image: "character:gw_fuertaisite",
		enable: true,
		filterTarget: true,
		selectTarget: [1, 2],
		content() {
			target.changeHujia();
		},
		contentAfter() {
			var evt = _status.event.getParent("phaseUse");
			if (evt && evt.name === "phaseUse") {
				evt.skipped = true;
			}
		},
		ai: {
			value: 10,
			order: 1,
			result: {
				target(player, target) {
					var num = 1 / Math.sqrt(target.hp + 1);
					if (target.hasSkillTag("maixie_hp")) {
						num *= 0.7;
					}
					if (target.hp === 1) {
						num *= 1.5;
					}
					return num;
				},
			},
		},
	},
	gwmaoxian_laduoweide: {
		type: "gwmaoxian",
		fullborder: "gold",
		vanish: true,
		derivation: "gw_diandian",
		image: "character:gw_laduoweide",
		enable: true,
		filterTarget: true,
		content() {
			target.addTempSkill("fengyin", { player: "phaseAfter" });
			target.damage();
		},
		contentAfter() {
			var evt = _status.event.getParent("phaseUse");
			if (evt && evt.name === "phaseUse") {
				evt.skipped = true;
			}
		},
		ai: {
			value: 10,
			order: 1,
			result: {
				target(player, target) {
					var num = 1 / Math.sqrt(target.hp + 1);
					if (target.hasSkillTag("maixie_hp")) {
						num *= 1.5;
					}
					return -num;
				},
			},
		},
	},
	gwmaoxian_enxier: {
		type: "gwmaoxian",
		fullborder: "gold",
		vanish: true,
		derivation: "gw_diandian",
		image: "character:gw_enxier",
		enable: true,
		filterTarget(card, player, target) {
			return Math.abs(target.countCards("h") - player.countCards("h")) <= 1;
		},
		content() {
			player.swapHandcards(target);
		},
		contentAfter() {
			var evt = _status.event.getParent("phaseUse");
			if (evt && evt.name === "phaseUse") {
				evt.skipped = true;
			}
		},
		ai: {
			value: 10,
			order: 1,
			result: {
				target(player, target) {
					var dh = target.countCards("h") - player.countCards("h");
					if (dh > 0) {
						return -1;
					}
					if (dh === 0 && player.needsToDiscard()) {
						return -0.5;
					}
					return 0;
				},
			},
		},
	},
	gwmaoxian_fulisi: {
		type: "gwmaoxian",
		fullborder: "gold",
		vanish: true,
		derivation: "gw_diandian",
		image: "character:gw_fulisi",
		enable: true,
		filterTarget(card, player, target) {
			return target !== player && target.countCards("h");
		},
		selectTarget: [1, 3],
		multitarget: true,
		multiline: true,
		content() {
			"step 0";
			var dialog = ui.create.dialog("弃置至多两张手牌", "hidden");
			for (var i = 0; i < targets.length; i++) {
				var hs = targets[i].getCards("h");
				if (hs.length) {
					dialog.addText(get.translation(targets[i]));
					dialog.add(hs);
				}
			}
			player.chooseButton(dialog, [1, 2]).ai = function (button) {
				return get.value(button.link, get.owner(button.link));
			};
			"step 1";
			if (result.bool) {
				var owner1 = get.owner(result.links[0]);
				var owner2 = get.owner(result.links[1]);
				if (owner1 === owner2) {
					owner1.discard(result.links.slice(0));
				} else {
					owner1.discard(result.links[0]).delay = false;
					owner2.discard(result.links[1]);
				}
			}
		},
		contentAfter() {
			var evt = _status.event.getParent("phaseUse");
			if (evt && evt.name === "phaseUse") {
				evt.skipped = true;
			}
		},
		ai: {
			value: 10,
			order: 1,
			result: {
				target: -1,
			},
		},
	},
	gwmaoxian_kaerweite: {
		type: "gwmaoxian",
		fullborder: "gold",
		vanish: true,
		derivation: "gw_diandian",
		image: "character:gw_kaerweite",
		enable: true,
		filterTarget(card, player, target) {
			return target !== player && target.countCards("h");
		},
		selectTarget: [1, 2],
		multitarget: true,
		multiline: true,
		content() {
			player.gainMultiple(targets);
		},
		contentAfter() {
			var evt = _status.event.getParent("phaseUse");
			if (evt && evt.name === "phaseUse") {
				evt.skipped = true;
			}
		},
		ai: {
			value: 10,
			order: 1,
			result: {
				target(player, target) {
					if (target.hasSkillTag("nolose") || target.hasSkillTag("noh")) {
						return 0;
					}
					return -1 / Math.sqrt(1 + target.countCards("h"));
				},
			},
		},
	},
	gwmaoxian_bulanwang: {
		type: "gwmaoxian",
		fullborder: "gold",
		vanish: true,
		derivation: "gw_diandian",
		image: "character:gw_bulanwang",
		enable: true,
		notarget: true,
		content() {
			"step 0";
			player.chooseToDiscard("he", [1, 2], "弃置至多两张牌并摸弃牌数2倍的牌").set("ai", function (card) {
				return 9 - get.value(card);
			});
			"step 1";
			if (result.bool) {
				player.draw(2 * result.cards.length);
			}
			player.skip("phaseDiscard");
		},
		contentAfter() {
			var evt = _status.event.getParent("phaseUse");
			if (evt && evt.name === "phaseUse") {
				evt.skipped = true;
			}
		},
		ai: {
			value: 10,
			order: 1,
			result: {
				player(player, target) {
					if (
						player.hasCard("he", function (card) {
							return get.value(card) < 9;
						})
					) {
						return 1;
					}
					return 0;
				},
			},
		},
	},
	gwmaoxian_kuite: {
		type: "gwmaoxian",
		fullborder: "gold",
		vanish: true,
		derivation: "gw_diandian",
		image: "character:gw_kuite",
		enable: true,
		filterTarget(card, player, target) {
			return target.countCards("h") >= player.countCards("h") && player.canUse("juedou", target);
		},
		content() {
			"step 0";
			player.useCard({ name: "juedou" }, target).animate = false;
			"step 1";
			if (player.isIn() && target.isIn()) {
				player.useCard({ name: "juedou" }, target);
			}
		},
		contentAfter() {
			var evt = _status.event.getParent("phaseUse");
			if (evt && evt.name === "phaseUse") {
				evt.skipped = true;
			}
		},
		ai: {
			value: 10,
			order: 1,
			result: {
				target(player, target) {
					return get.effect(target, { name: "juedou" }, player, target);
				},
			},
		},
	},
	gwmaoxian_haluo: {
		type: "gwmaoxian",
		fullborder: "gold",
		vanish: true,
		derivation: "gw_diandian",
		image: "character:gw_haluo",
		enable: true,
		filterTarget(card, player, target) {
			return target.isMinHp();
		},
		selectTarget: -1,
		content() {
			target.damage();
		},
		contentAfter() {
			var evt = _status.event.getParent("phaseUse");
			if (evt && evt.name === "phaseUse") {
				evt.skipped = true;
			}
		},
		ai: {
			value: 10,
			order: 1,
			result: {
				target: -1.5,
			},
			tag: {
				damage: 1,
			},
		},
	},
	gwmaoxian_dagong: {
		type: "gwmaoxian",
		fullborder: "gold",
		vanish: true,
		derivation: "gw_diandian",
		image: "character:gw_dagong",
		enable: true,
		content() {
			target.addSkill("gw_ciguhanshuang");
			target.addSkill("gw_birinongwu");
			target.addSkill("gw_qinpendayu");
		},
		filterTarget(card, player, target) {
			return !target.hasSkill("gw_ciguhanshuang") || !target.hasSkill("gw_qinpendayu") || !target.hasSkill("gw_birinongwu");
		},
		changeTarget(player, targets) {
			game.filterPlayer(function (current) {
				return get.distance(targets[0], current, "pure") === 1;
			}, targets);
		},
		contentAfter() {
			var evt = _status.event.getParent("phaseUse");
			if (evt && evt.name === "phaseUse") {
				evt.skipped = true;
			}
		},
		ai: {
			value: 10,
			order: 1,
			result: {
				target(player, target) {
					return get.effect(target, { name: "gw_ciguhanshuang" }, player, target);
				},
			},
		},
	},
	gwmaoxian_gaier: {
		type: "gwmaoxian",
		fullborder: "gold",
		vanish: true,
		derivation: "gw_diandian",
		image: "character:gw_gaier",
		enable: true,
		filterTarget: true,
		content() {
			"step 0";
			var str1 = "令" + get.translation(target);
			var str2 = "1点体力和体力上限";
			player.chooseControlList([str1 + "增加" + str2, str1 + "减少" + str2], function () {
				if (get.attitude(player, target) > 0) {
					return 0;
				}
				return 1;
			});
			"step 1";
			if (result.index === 0) {
				target.gainMaxHp(true);
				target.recover();
			} else {
				target.loseHp();
				target.loseMaxHp(true);
			}
		},
		contentAfter() {
			var evt = _status.event.getParent("phaseUse");
			if (evt && evt.name === "phaseUse") {
				evt.skipped = true;
			}
		},
		ai: {
			value: 10,
			order: 1,
			result: {
				player(player, target) {
					var num = 1;
					if (target.hasSkillTag("maixie_hp")) {
						num = 1.5;
					}
					return num / Math.sqrt(target.hp + 1);
				},
			},
		},
	},
	gwmaoxian_airuiting: {
		type: "gwmaoxian",
		fullborder: "gold",
		vanish: true,
		derivation: "gw_diandian",
		image: "character:gw_airuiting",
		enable: true,
		filterTarget(card, player, target) {
			return target !== player;
		},
		selectTarget: -1,
		content() {
			"step 0";
			target.chooseToUse({ name: "sha" }, "使用一张杀，或失去1点体力");
			"step 1";
			if (!result.bool) {
				target.loseHp();
			}
		},
		contentAfter() {
			var evt = _status.event.getParent("phaseUse");
			if (evt && evt.name === "phaseUse") {
				evt.skipped = true;
			}
		},
		ai: {
			value: 10,
			order: 1,
			result: {
				target(player, target) {
					if (target.hasSha()) {
						if (Math.random() < 0.5) {
							return 1;
						}
						return 0;
					}
					if (target.countCards("h") >= 2) {
						return 0;
					} else {
						return -1;
					}
				},
			},
		},
	},
	gwmaoxian_aisinie: {
		type: "gwmaoxian",
		fullborder: "gold",
		vanish: true,
		derivation: "gw_diandian",
		image: "character:gw_aisinie",
		enable: true,
		notarget: true,
		content() {
			"step 0";
			player.recover();
			"step 1";
			var list = get.typeCard("spell_silver");
			if (list.length) {
				player.chooseVCardButton("获得一张银卡法术", list, true);
			} else {
				event.finish();
			}
			"step 2";
			if (result.bool) {
				player.gain(game.createCard(result.links[0][2]), "gain2");
			}
		},
		contentAfter() {
			var evt = _status.event.getParent("phaseUse");
			if (evt && evt.name === "phaseUse") {
				evt.skipped = true;
			}
		},
		ai: {
			value: 10,
			order: 1,
			result: {
				player: 1,
			},
		},
	},
	gwmaoxian_falanxisika: {
		type: "gwmaoxian",
		fullborder: "gold",
		vanish: true,
		derivation: "gw_diandian",
		image: "character:gw_falanxisika",
		enable: true,
		notarget: true,
		content() {
			"step 0";
			var list = get.typeCard("spell_gold");
			list.remove("gw_huangjiashenpan");
			if (list.length) {
				player.chooseVCardButton("使用一张金卡法术", list.randomGets(3), true).ai = function (button) {
					var info = get.info(button.link[2]);
					if (info && info.ai && info.ai.result && info.ai.result.player) {
						return info.ai.result.player(player, player);
					}
					return 0;
				};
			} else {
				event.finish();
			}
			"step 1";
			if (result.bool) {
				player.useCard(game.createCard(result.links[0][2]));
			}
		},
		contentAfter() {
			var evt = _status.event.getParent("phaseUse");
			if (evt && evt.name === "phaseUse") {
				evt.skipped = true;
			}
		},
		ai: {
			value: 10,
			order: 1,
			result: {
				player: 1,
			},
		},
	},
	gwmaoxian_huoge: {
		type: "gwmaoxian",
		fullborder: "gold",
		vanish: true,
		derivation: "gw_diandian",
		image: "character:gw_huoge",
		enable: true,
		notarget: true,
		content() {
			"step 0";
			event.cards = get.cards(6);
			player
				.chooseCardButton(event.cards, [1, 2], "选择至多两牌依次使用之")
				.set("filterButton", function (button) {
					return game.hasPlayer(function (current) {
						return player.canUse(button.link, current);
					});
				})
				.set("ai", function (button) {
					return get.value(button.link);
				});
			"step 1";
			if (result.bool) {
				event.list = result.links.slice(0);
				for (var i = 0; i < event.cards.length; i++) {
					if (!event.list.includes(event.cards[i])) {
						event.cards[i].discard();
					}
				}
			}
			"step 2";
			if (event.list.length) {
				player.chooseUseTarget(true, event.list.shift());
				event.redo();
			}
		},
		contentAfter() {
			var evt = _status.event.getParent("phaseUse");
			if (evt && evt.name === "phaseUse") {
				evt.skipped = true;
			}
		},
		ai: {
			value: 10,
			order: 1,
			result: {
				player: 1,
			},
		},
	},
	gw_wuyao: {
		type: "special",
		fullimage: true,
		derivation: "gw_linjing",
		vanish: true,
		addinfo: "杀",
		autoViewAs: "sha",
		ai: {
			order() {
				return get.order({ name: "sha" }) + 0.5;
			},
		},
	},
	gw_lang: {
		type: "special",
		fullimage: true,
		derivation: "gw_linjing",
		vanish: true,
		addinfo: "酒",
		autoViewAs: "jiu",
		ai: {
			order() {
				return get.order({ name: "jiu" }) + 0.5;
			},
		},
	},
	gw_dudayuanshuai1: {
		type: "special",
		fullimage: true,
		derivation: "gw_zhuoertan",
		vanish: true,
		addinfo: "小伙伴",
		notarget: true,
		content() {
			var evt = event.getParent(3)._trigger;
			if (evt.gw_dudayuanshuai1) {
				evt.cancel();
			}
			if (evt.cards) {
				player.gain(evt.cards, "gain2");
			}
		},
		ai: {
			value: 10,
			useful: 9,
			result: {
				player: 1,
			},
		},
	},
	gw_dudayuanshuai2: {
		type: "special",
		fullimage: true,
		derivation: "gw_zhuoertan",
		vanish: true,
		addinfo: "捣蛋鬼",
		ai: {
			value: -1,
		},
	},
};

for (let i in card) {
	if (!card[i].image) {
		if (card[i].fullimage) {
			card[i].image = "ext:杀海拾遗/image/card/" + i + ".jpg";
		}
	}
}

export default card;
