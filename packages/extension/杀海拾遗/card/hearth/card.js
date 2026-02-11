import { lib, game, ui, get, ai, _status } from "../../main/utils.js";

const card = {
	linghunzhihuo: {
		fullskin: true,
		type: "trick",
		cardnature: "fire",
		enable: true,
		filterTarget: true,
		content() {
			"step 0";
			target.damage("fire");
			"step 1";
			var hs = player.getCards("h");
			if (hs.length) {
				player.discard(hs.randomGet());
			}
		},
		ai: {
			basic: {
				order: 1.8,
				value: [6, 1],
				useful: [4, 1],
			},
			result: {
				player(player, target) {
					if (player === target) {
						return -1;
					}
					if (player.countCards("h") >= player.hp) {
						return -0.1;
					}
					if (player.countCards("h") > 1) {
						return -0.5;
					}
					return 0;
				},
				target: -1,
			},
			tag: {
				damage: 1,
				fireDamage: 1,
				natureDamage: 1,
			},
		},
	},
	jihuocard: {
		fullskin: true,
		type: "trick",
		enable: true,
		toself: true,
		filterTarget(card, player, target) {
			return player === target;
		},
		selectTarget: -1,
		modTarget: true,
		content() {
			if (_status.currentPhase === target) {
				target.addTempSkill("jihuocard2");
			}
			target.draw();
		},
		ai: {
			order: 10,
			result: {
				target: 1,
			},
		},
	},
	zhaomingdan: {
		fullskin: true,
		type: "trick",
		enable: true,
		filterTarget(card, player, target) {
			return player !== target && target.countCards("hej") > 0;
		},
		content() {
			"step 0";
			if (target.countCards("hej")) {
				var next = player.discardPlayerCard("hej", target, true);
				next.visible = true;
				next.delay = false;
			} else {
				event.goto(2);
			}
			"step 1";
			if (result.bool) {
				game.delay(0.5);
			}
			"step 2";
			target.draw(false);
			target.$draw();
			game.delay(0.5);
			"step 3";
			player.draw();
		},
		ai: {
			order: 9.5,
			value: 6,
			useful: 3,
			result: {
				target(player, target) {
					if (get.attitude(player, target) > 0) {
						var js = target.getCards("j");
						if (js.length) {
							var jj = js[0].viewAs ? { name: js[0].viewAs } : js[0];
							if (jj.name === "zhaomingdan") {
								return 3;
							}
							if (js.length === 1 && get.effect(target, jj, target, player) >= 0) {
								return 0;
							}
							return 3;
						}
					}
					var es = target.getCards("e");
					var nh = target.countCards("h");
					var noe = es.length === 0 || target.hasSkillTag("noe");
					var noe2 = es.length === 1 && es[0].name === "baiyin" && target.hp < target.maxHp;
					var noh = nh === 0 || target.hasSkillTag("noh");
					if (noh && noe) {
						return 0;
					}
					if (noh && noe2) {
						return 0.01;
					}
					if (get.attitude(player, target) <= 0) {
						return target.countCards("he") ? -1.5 : 1.5;
					}
					return 0.1;
				},
			},
		},
	},
	shijieshu: {
		fullskin: true,
		enable: true,
		type: "trick",
		filterTarget(card, player, target) {
			return !target.isMin();
		},
		content() {
			"step 0";
			var cards = [];
			var subtype = null;
			for (var i = 0; i < 2; i++) {
				var card = get.cardPile(function (card) {
					if (get.type(card) === "equip") {
						if (subtype) {
							if (get.subtype(card) === subtype) {
								return false;
							}
						} else {
							subtype = get.subtype(card);
						}
						return true;
					}
					return false;
				});
				if (card) {
					ui.special.appendChild(card);
					cards.push(card);
				}
			}
			switch (cards.length) {
				case 1: {
					target.$gain(cards[0]);
					game.delay();
					break;
				}
				case 2: {
					target.$gain(cards[0]);
					setTimeout(function () {
						target.$gain(cards[1]);
					}, 250);
					game.delay();
					break;
				}
			}
			event.cards = cards;
			"step 1";
			if (event.cards.length) {
				target.equip(event.cards.shift());
				game.delay(0.5);
				if (event.cards.length) {
					event.redo();
				}
			}
			"step 2";
			game.delay(0.5);
			"step 3";
			if (target.countCards("he")) {
				target.chooseToDiscard("he", true);
			}
		},
		ai: {
			order: 9,
			value: 6,
			useful: 2,
			result: {
				target(player, target) {
					return Math.max(0, 2 - target.countCards("e"));
				},
			},
			tag: {
				norepeat: 1,
			},
		},
	},
	shandianjian: {
		fullskin: true,
		type: "trick",
		enable: true,
		cardnature: "thunder",
		filterTarget(card, player, target) {
			if (player !== game.me && player.countCards("h") < 2) {
				return false;
			}
			return target.countCards("h") > 0;
		},
		content() {
			"step 0";
			if (target.countCards("h") === 0) {
				event.finish();
				return;
			}
			var rand = Math.random() < 0.5;
			target.chooseCard(true).ai = function (card) {
				if (rand) {
					return Math.random();
				}
				return get.value(card);
			};
			"step 1";
			event.dialog = ui.create.dialog(get.translation(target.name) + "展示的手牌", result.cards);
			event.card2 = result.cards[0];
			event.videoId = lib.status.videoId++;
			game.addVideo("cardDialog", null, [get.translation(target.name) + "展示的手牌", get.cardsInfo(result.cards), event.videoId]);
			game.log(target, "展示了", event.card2);
			player.chooseToDiscard(
				function (card) {
					return get.suit(card) === get.suit(_status.event.parent.card2);
				},
				function (card) {
					if (get.damageEffect(target, player, player, "thunder") > 0) {
						return 6 - get.value(card, _status.event.player);
					}
					return -1;
				}
			).prompt = false;
			game.delay(2);
			"step 2";
			if (result.bool) {
				target.damage("thunder");
			} else {
				target.addTempSkill("huogong2");
			}
			game.addVideo("cardDialog", null, event.videoId);
			event.dialog.close();
		},
		ai: {
			basic: {
				order: 4,
				value: [3, 1],
				useful: 1,
			},
			wuxie(target, card, player, current, state) {
				if (get.attitude(current, player) >= 0 && state > 0) {
					return false;
				}
			},
			result: {
				player(player) {
					var nh = player.countCards("h");
					if (nh <= player.hp && nh <= 4 && _status.event.name === "chooseToUse") {
						if (typeof _status.event.filterCard === "function" && _status.event.filterCard(new lib.element.VCard({ name: "shandianjian" }))) {
							return -10;
						}
						if (_status.event.skill) {
							var viewAs = get.info(_status.event.skill).viewAs;
							if (viewAs === "shandianjian") {
								return -10;
							}
							if (viewAs && viewAs.name === "shandianjian") {
								return -10;
							}
						}
					}
					return 0;
				},
				target(player, target) {
					if (target.hasSkill("huogong2") || target.countCards("h") === 0) {
						return 0;
					}
					if (player.countCards("h") <= 1) {
						return 0;
					}
					if (target === player) {
						if (typeof _status.event.filterCard === "function" && _status.event.filterCard(new lib.element.VCard({ name: "shandianjian" }))) {
							return -1.5;
						}
						if (_status.event.skill) {
							var viewAs = get.info(_status.event.skill).viewAs;
							if (viewAs === "shandianjian") {
								return -1.5;
							}
							if (viewAs && viewAs.name === "shandianjian") {
								return -1.5;
							}
						}
						return 0;
					}
					return -1.5;
				},
			},
			tag: {
				damage: 1,
				thunderDamage: 1,
				natureDamage: 1,
				norepeat: 1,
			},
		},
	},
	shihuawuqi: {
		fullskin: true,
		type: "basic",
		enable: true,
		usable: 1,
		filterTarget(card, player, target) {
			return player === target;
		},
		selectTarget: -1,
		content() {
			player.addTempSkill("shihuawuqi");
			if (!player.countCards("h", "sha")) {
				var card = get.cardPile("sha");
				if (card) {
					player.gain(card, "gain2");
				}
			}
		},
		ai: {
			value: 4,
			useful: 2,
			order: 8,
			result: {
				target(player, target) {
					return target.countCards("h", "sha") ? 0 : 1;
				},
			},
		},
	},
	dunpaigedang: {
		fullskin: true,
		enable: true,
		type: "trick",
		toself: true,
		filterTarget(card, player, target) {
			return player === target;
		},
		selectTarget: -1,
		modTarget: true,
		content() {
			"step 0";
			target.changeHujia();
			target.draw();
			"step 1";
			if (target.countCards("he")) {
				target.chooseToDiscard("he", true);
			}
		},
		ai: {
			order: 8.5,
			value: 7,
			useful: 3,
			result: {
				target: 1,
			},
		},
	},
	chuansongmen: {
		fullskin: true,
		type: "trick",
		enable: true,
		discard: false,
		toself: true,
		selectTarget: -1,
		filterTarget(card, player, target) {
			return target === player;
		},
		modTarget: true,
		// usable:3,
		// forceUsable:true,
		content() {
			"step 0";
			var gained = get.cards()[0];
			target.gain(gained, "gain2");
			if (event.getParent(3).name === "phaseUse" && _status.currentPhase === target && lib.filter.filterCard(gained, target, event.getParent(2))) {
				var next = target.chooseToUse();
				next.filterCard = function (card) {
					return card === gained;
				};
				next.prompt = "是否使用" + get.translation(gained) + "？";
				if (cards[0]) {
					ui.special.appendChild(cards[0]);
				} else {
					event.finish();
				}
			} else {
				// if(cards[0]){
				// 	cards[0].discard();
				// }
				event.finish();
			}
			"step 1";
			if (result.bool && !target.hasSkill("chuansongmen3")) {
				if (target.hasSkill("chuansongmen2")) {
					target.addTempSkill("chuansongmen3");
				} else {
					target.addTempSkill("chuansongmen2");
				}
				cards[0].fix();
				target.gain(cards, "gain2");
			} else {
				cards[0].discard();
			}
		},
		ai: {
			order: 9.5,
			value: 7,
			useful: 3,
			result: {
				target: 1,
			},
			tag: {
				norepeat: 1,
			},
		},
	},
	tanshezhiren: {
		fullskin: true,
		type: "trick",
		enable: true,
		// recastable:true,
		filterTarget(card, player, target) {
			return target === player;
		},
		selectTarget: -1,
		modTarget: true,
		content() {
			"step 0";
			event.current = target;
			event.num = game.countPlayer();
			if (event.num % 2 === 0) {
				event.num--;
			}
			"step 1";
			if (event.num) {
				var enemies = event.current.getEnemies();
				enemies.remove(player);
				for (var i = 0; i < enemies.length; i++) {
					if (!enemies[i].countCards("h")) {
						enemies.splice(i--, 1);
					}
				}
				if (enemies.length) {
					var enemy = enemies.randomGet();
					event.current.line(enemy);
					enemy.discard(enemy.getCards("h").randomGet());
					event.current = enemy;
					event.num--;
					event.redo();
				}
			}
		},
		ai: {
			order: 8.5,
			wuxie() {
				return 0;
			},
			result: {
				player: 1,
			},
			tag: {
				multineg: 1,
				multitarget: 1,
			},
		},
	},
	xingjiegoutong: {
		fullskin: true,
		type: "trick",
		enable: true,
		selectTarget: -1,
		modTarget: true,
		toself: true,
		filterTarget(card, player, target) {
			return player === target;
		},
		content() {
			target.gainMaxHp();
			target.recover();
			target.discard(target.getCards("h"));
		},
		ai: {
			basic: {
				useful: [1, 1],
				value: [1, 1],
			},
			order: 1,
			result: {
				target(player, target) {
					if (target.countCards("h", "tao")) {
						return 0;
					}
					var nh = target.countCards("h");
					if (nh <= 2) {
						return 1;
					}
					if (target.hp === 1 && target.maxHp > 2) {
						return 1;
					}
					return 0;
				},
			},
			tag: {
				recover: 1,
			},
		},
	},
	shenenshu: {
		fullskin: true,
		enable: true,
		type: "trick",
		selectTarget: -1,
		filterTarget(card, player, target) {
			return target === player;
		},
		modTarget: true,
		content() {
			"step 0";
			var cards = target.getCards("h");
			if (cards.length) {
				target.lose(cards)._triggered = null;
			}
			event.num = 1 + cards.length;
			"step 1";
			var cards = [];
			var list = get.typeCard("basic");
			list.remove("du");
			if (list.length) {
				for (var i = 0; i < event.num; i++) {
					cards.push(game.createCard(list.randomGet()));
				}
				target.directgain(cards);
			}
		},
		ai: {
			order: 1,
			result: {
				target(player, target) {
					var hs = target.getCards("h");
					for (var i = 0; i < hs.length; i++) {
						if (get.type(hs[i]) !== "basic" && get.useful(hs[i]) >= 6) {
							return 0;
						}
					}
					return 1;
				},
			},
		},
	},
	zhiliaobo: {
		fullskin: true,
		enable: true,
		filterTarget(card, player, target) {
			return target.hp < target.maxHp;
		},
		type: "trick",
		content() {
			"step 0";
			target.judge(function (card) {
				return get.color(card) === "red" ? 1 : 0;
			});
			"step 1";
			if (result.bool) {
				target.recover();
			} else {
				target.changeHujia();
			}
		},
		ai: {
			order: 4,
			value: [7, 3],
			useful: [6, 3],
			result: {
				target(player, target) {
					var eff = get.recoverEffect(target, player, target);
					if (eff <= 0) {
						return 0;
					}
					var num = target.maxHp - target.hp;
					if (num < 1) {
						return 0;
					}
					if (num === 1) {
						return 1;
					}
					if (target.hp === 1) {
						return 2.5;
					}
					return 2;
				},
			},
			tag: {
				recover: 1,
			},
		},
	},
	yuansuhuimie: {
		fullskin: true,
		type: "trick",
		cardnature: "thunder",
		enable: true,
		selectTarget: -1,
		filterTarget: true,
		reverseOrder: true,
		content() {
			"step 0";
			target.chooseToDiscard([1, 2], "he").ai = function (card) {
				if (get.damageEffect(target, player, target, "thunder") >= 0) {
					if (target.hasSkillTag("maixie")) {
						if (ui.selected.cards.length) {
							return 0;
						}
					} else {
						return 0;
					}
				}
				if (player.hasSkillTag("notricksource")) {
					return 0;
				}
				if (target.hasSkillTag("notrick")) {
					return 0;
				}
				if (card.name === "tao") {
					return 0;
				}
				if (target.hp === 1 && card.name === "jiu") {
					return 0;
				}
				if (get.type(card) !== "basic") {
					return 10 - get.value(card);
				}
				return 8 - get.value(card);
			};
			"step 1";
			if (!result.bool || result.cards.length < 2) {
				if (result.bool) {
					target.damage(2 - result.cards.length, "thunder");
				} else {
					target.damage(2, "thunder");
				}
			}
		},
		ai: {
			basic: {
				order: 7,
				useful: [5, 1],
			},
			result: {
				target(player, target) {
					if (target.hasSkillTag("nothunder")) {
						return 0;
					}
					if (player.hasUnknown(2)) {
						return 0;
					}
					var nh = target.countCards("he");
					if (target === player) {
						nh--;
					}
					if (nh === 2) {
						return -2.5;
					}
					if (nh === 1) {
						return -3;
					}
					if (nh === 0) {
						return -4;
					}
					return -2;
				},
			},
			tag: {
				damage: 1,
				natureDamage: 1,
				thunderDamage: 1,
				multitarget: 1,
				multineg: 1,
				discard: 2,
				loseCard: 2,
			},
		},
	},
};

for (let i in card) {
	card[i].image = "ext:杀海拾遗/image/card/" + i + ".png";
}

export default card;
