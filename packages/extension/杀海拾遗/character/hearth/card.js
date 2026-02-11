import { lib, game, ui, get, ai, _status } from "../../main/utils.js";

const card = {
	hsfashu_anyingjingxiang: {
		fullimage: true,
		type: "hsfashu",
		vanish: true,
		derivation: "hs_xukongzhiying",
		gainable: false,
	},
	hsfashu_buwendingyibian: {
		enable(card, player) {
			return get.cardCount("hsfashu_buwendingyibian", player) < player.hp;
		},
		fullimage: true,
		type: "hsfashu",
		vanish: true,
		derivation: "hs_siwangxianzhi",
		filterTarget: true,
		content() {
			"step 0";
			target.chooseCard("h", true, "重铸一张手牌", lib.filter.cardRecastable);
			"step 1";
			if (result.bool && result.cards.length) {
				target.recast(result.cards, void 0, (player, cards) => {
					var type = get.type(cards[0], "trick"),
						name = cards[0].name,
						card2 = get.cardPile(card => get.type(card, "trick") === type && card.name !== name);
					if (!card2) {
						card2 = get.cardPile(card => get.type(card, "trick") === type);
					}
					if (card2) {
						player.gain(card2, "draw");
					} else {
						player.draw().log = false;
					}
				});
				var clone = game.createCard(card);
				player.gain(clone, "gain2");
				clone.classList.add("glow");
				clone._destroy = "yibian";
				player.addTempSkill("buwendingyibian_lose", "phaseBegin");
				if (target.hasSkill("buwendingyibian_ai1")) {
					target.addTempSkill("buwendingyibian_ai2");
				} else {
					target.addTempSkill("buwendingyibian_ai1");
				}
			}
		},
		ai: {
			wuxie() {
				return 0;
			},
			value(card) {
				if (card._destroy) {
					return 0;
				}
				return 5;
			},
			useful: 0,
			result: {
				target(player, target) {
					if (
						target === player &&
						target.countCards("h", function (card) {
							return card.name !== "hsfashu_buwendingyibian" && get.value(card) <= 1;
						})
					) {
						return 10;
					}
					var num = target.countCards("h");
					var num0 = num;
					if (target === player) {
						num--;
					}
					if (target.hasSkill("buwendingyibian_ai1")) {
						num /= 2;
					}
					if (target.hasSkill("buwendingyibian_ai2")) {
						num /= 2;
					}
					if (num < 0) {
						if (num0 > 0) {
							return 0.1;
						}
						return 0;
					}
					return Math.sqrt(num);
				},
			},
			order: 4,
		},
	},
	hstianqi_dalian: {
		type: "equip",
		subtype: "equip1",
		distance: { attackFrom: -1 },
		fullimage: true,
		vanish: true,
		destroy: "hstianqi",
		derivation: "hs_heifengqishi",
		skills: ["hstianqi_dalian"],
		ai: {
			equipValue: 10,
		},
	},
	hstianqi_shali: {
		type: "equip",
		subtype: "equip2",
		distance: { attackFrom: -1 },
		fullimage: true,
		vanish: true,
		destroy: "hstianqi",
		derivation: "hs_heifengqishi",
		skills: ["hstianqi_shali"],
		ai: {
			equipValue: 10,
		},
	},
	hstianqi_nazigelin: {
		type: "equip",
		subtype: "equip4",
		distance: { globalFrom: -1 },
		fullimage: true,
		vanish: true,
		destroy: "hstianqi",
		derivation: "hs_heifengqishi",
		onEquip() {
			player.changeHujia();
		},
		equipDelay: false,
		ai: {
			equipValue: 10,
		},
	},
	hstianqi_suolasi: {
		type: "equip",
		subtype: "equip3",
		distance: { globalTo: 1 },
		fullimage: true,
		vanish: true,
		destroy: "hstianqi",
		derivation: "hs_heifengqishi",
		onLose() {
			if (player.isDamaged()) {
				player.logSkill("hstianqi_suolasi");
				player.recover();
			}
		},
		loseDelay: false,
		ai: {
			equipValue: 10,
		},
	},
	hsjixie_zhadan: {
		enable: true,
		fullimage: true,
		type: "hsjixie",
		vanish: true,
		derivation: "hs_pengpeng",
		filterTarget(card, player, target) {
			return target === player;
		},
		modTarget: true,
		selectTarget: -1,
		cardcolor: "black",
		content() {
			var targets = target.getEnemies();
			if (targets.length) {
				var target2 = targets.randomGet();
				player.line(target2, "fire");
				target2.addExpose(0.2);
				target2.damage("fire");
			}
		},
		ai: {
			value: 8,
			result: {
				target: 1,
			},
			order: 4,
		},
	},
	hsqizhou_feng: {
		type: "hsqizhou",
		fullimage: true,
		vanish: true,
		enable: true,
		derivation: "hs_kalimosi",
		filterTarget(card, player, target) {
			return target === player;
		},
		selectTarget: -1,
		content() {
			"step 0";
			event.list = target.getEnemies().sortBySeat();
			player.line(event.list, "thunder");
			"step 1";
			if (event.list.length) {
				event.current = event.list.shift();
				event.current.addTempClass("target");
				var next = event.current.chooseToRespond({ name: "sha" });
				next.ai = function (card) {
					if (get.damageEffect(event.current, player, event.current, "thunder") >= 0) {
						return 0;
					}
					if (player.hasSkillTag("notricksource", null, event)) {
						return 0;
					}
					if (event.current.hasSkillTag("notrick", null, event)) {
						return 0;
					}
					return 11 - get.value(card);
				};
				next.autochoose = lib.filter.autoRespondSha;
			} else {
				event.finish();
			}
			"step 2";
			if (!result.bool) {
				event.current.damage("thunder");
			}
			game.delayx(0.5);
			"step 3";
			event.goto(1);
		},
		ai: {
			order: 8,
			useful: [5, 1],
			value: 8,
			result: {
				target: 1,
			},
		},
	},
	hsqizhou_shui: {
		type: "hsqizhou",
		fullimage: true,
		vanish: true,
		enable(event, player) {
			return player.isDamaged();
		},
		derivation: "hs_kalimosi",
		filterTarget(card, player, target) {
			return target === player;
		},
		selectTarget: -1,
		content() {
			target.recover(2);
		},
		ai: {
			order: 8,
			useful: [5, 1],
			value: 8,
			tag: {
				recover: 1,
			},
			result: {
				target: 2,
			},
		},
	},
	hsqizhou_huo: {
		type: "hsqizhou",
		fullimage: true,
		vanish: true,
		enable: true,
		derivation: "hs_kalimosi",
		filterTarget: true,
		content() {
			target.damage("fire");
		},
		ai: {
			order: 5,
			result: {
				target: -1,
			},
			useful: [5, 1],
			value: 8,
			tag: {
				damage: 1,
				fireDamage: 1,
				natureDamage: 1,
			},
		},
	},
	hsqizhou_tu: {
		type: "hsqizhou",
		fullimage: true,
		vanish: true,
		enable: true,
		derivation: "hs_kalimosi",
		filterTarget(card, player, target) {
			return target !== player;
		},
		selectTarget: [1, Infinity],
		content() {
			target.changeHujia();
		},
		ai: {
			order: 8,
			useful: [5, 1],
			value: 8,
			result: {
				target: 1,
			},
		},
	},
	hsqingyu_feibiao: {
		type: "hsqingyu",
		fullimage: true,
		vanish: true,
		enable: true,
		derivation: "hs_aya",
		filterTarget(card, player, target) {
			return target.countCards("he") > 0;
		},
		content() {
			var cards = [];
			var hs = target.getCards("h");
			var es = target.getCards("e");
			if (hs.length) {
				cards.push(hs.randomGet());
			}
			if (es.length) {
				cards.push(es.randomGet());
			}
			target.discard(cards);
		},
		ai: {
			order: 8,
			useful: 3,
			value: 6,
			result: {
				target(player, target) {
					var num = 0;
					if (target.countCards("h")) {
						num--;
					}
					if (target.countCards("e")) {
						num--;
					}
					return num;
				},
			},
		},
	},
	hsqingyu_zhanfang: {
		type: "hsqingyu",
		fullimage: true,
		vanish: true,
		enable: true,
		derivation: "hs_aya",
		filterTarget: true,
		content() {
			target.gainMaxHp();
			target.draw();
		},
		ai: {
			order: 5,
			useful: 3,
			value: 4,
			result: {
				target(player, target) {
					if (target.hp === target.maxHp) {
						if (target.maxHp < 3) {
							return 2;
						}
						if (target.maxHp === 3) {
							return 1.5;
						}
						return 1.2;
					}
					return 1;
				},
			},
		},
	},
	hsqingyu_hufu: {
		type: "hsqingyu",
		fullimage: true,
		vanish: true,
		enable: true,
		derivation: "hs_aya",
		filterTarget: true,
		content() {
			target.changeHujia();
		},
		ai: {
			order: 5,
			useful: 3,
			value: 6,
			result: {
				target(player, target) {
					return 2 / Math.max(1, Math.sqrt(target.hp));
				},
			},
		},
	},
	hsqingyu_shandian: {
		type: "hsqingyu",
		fullimage: true,
		vanish: true,
		enable: true,
		derivation: "hs_aya",
		filterTarget: true,
		content() {
			target.damage("thunder");
		},
		ai: {
			order: 5,
			result: {
				target: -1,
			},
			useful: 5,
			value: 8,
			tag: {
				damage: 1,
				thunderDamage: 1,
				natureDamage: 1,
			},
		},
	},
	hsqingyu_zhao: {
		type: "equip",
		subtype: "equip1",
		distance: { attackFrom: -1 },
		fullimage: true,
		vanish: true,
		derivation: "hs_aya",
		onEquip() {
			player.draw();
		},
		ai: {
			order: 9,
			useful: 5,
			value: 4,
		},
	},
	hsdusu_xueji: {
		type: "hsdusu",
		fullimage: true,
		vanish: true,
		enable: true,
		derivation: "hs_xialikeer",
		filterTarget(card, player, target) {
			return target.countCards("e") > 0;
		},
		content() {
			target.discard(target.getCards("e").randomGets(2));
		},
		ai: {
			order: 5,
			result: {
				target(player, target) {
					if (target.hasSkillTag("noe")) {
						return 0;
					}
					if (target.countCards("e") > 1) {
						return -1.5;
					}
					return -1;
				},
			},
			value: 5,
		},
	},
	hsdusu_kuyecao: {
		type: "hsdusu",
		fullimage: true,
		vanish: true,
		enable: true,
		derivation: "hs_xialikeer",
		filterTarget(card, player, target) {
			return !target.hasSkill("qianxing");
		},
		content() {
			target.tempHide();
		},
		ai: {
			order: 2,
			result: {
				target(player, target) {
					if (player !== target && get.distance(player, target, "absolute") <= 1) {
						return 0;
					}
					var num = 1;
					if (target === player) {
						num = 1.5;
					}
					if (target.hp === 1) {
						return 2 * num;
					}
					if (target.hp === 2 && target.countCards("h") <= 2) {
						return 1.2 * num;
					}
					return num;
				},
			},
			value: 5,
		},
	},
	hsdusu_huangxuecao: {
		type: "hsdusu",
		fullimage: true,
		vanish: true,
		enable: true,
		derivation: "hs_xialikeer",
		filterTarget(card, player, target) {
			return target === player;
		},
		selectTarget: -1,
		modTarget: true,
		content() {
			target.draw(2);
		},
		ai: {
			order: 9,
			result: {
				target: 1,
			},
			value: 10,
		},
	},
	hsdusu_huoyanhua: {
		type: "hsdusu",
		fullimage: true,
		vanish: true,
		enable: true,
		derivation: "hs_xialikeer",
		range: { attack: 1 },
		filterTarget: true,
		content() {
			target.damage("fire");
		},
		ai: {
			order: 5,
			result: {
				target: -1,
			},
			useful: 5,
			value: 8,
			tag: {
				damage: 1,
				fireDamage: 1,
				natureDamage: 1,
			},
		},
	},
	hsdusu_shinancao: {
		type: "hsdusu",
		fullimage: true,
		vanish: true,
		enable: true,
		derivation: "hs_xialikeer",
		filterTarget(card, player, target) {
			return !target.hasSkill("hsdusu_shinancao");
		},
		content() {
			target.addSkill("hsdusu_shinancao");
		},
		ai: {
			order: 7,
			result: {
				target(player, target) {
					if (target.hp > 1) {
						if (target.countCards("h") > 2) {
							return 1;
						}
						return 0.5;
					}
					return 0.2;
				},
			},
			value: 5,
		},
	},
	hsbaowu_cangbaotu: {
		type: "hsbaowu",
		fullimage: true,
		vanish: true,
		enable: true,
		gainable: false,
		derivation: "hs_yelise",
		filterTarget(card, player, target) {
			return target === player;
		},
		selectTarget: -1,
		content() {
			target.addSkill("hsbaowu_cangbaotu");
			target.draw();
		},
		ai: {
			order: 10,
			result: {
				player: 10,
			},
			useful: 10,
			value: 10,
		},
	},
	hsbaowu_huangjinyuanhou: {
		type: "hsbaowu",
		fullimage: true,
		vanish: true,
		enable: true,
		gainable: false,
		derivation: "hs_yelise",
		filterTarget(card, player, target) {
			return target === player;
		},
		selectTarget: -1,
		content() {
			"step 0";
			var cards = target.getCards();
			if (cards.length) {
				target.lose(cards)._triggered = null;
			}
			event.num = 1 + cards.length;
			"step 1";
			var cards = [];
			var list = [];
			if (lib.characterPack.hearth) {
				for (var i = 0; i < lib.cardPack.mode_derivation.length; i++) {
					var name = lib.cardPack.mode_derivation[i];
					var info = lib.card[name];
					if (info.gainable === false) {
						continue;
					}
					if (lib.characterPack.hearth[info.derivation]) {
						list.push(name);
					}
				}
			}
			if (!list.length) {
				list = lib.inpile.slice(0);
			}
			if (list.length) {
				for (var i = 0; i < event.num; i++) {
					cards.push(game.createCard(list.randomGet()));
				}
				target.directgain(cards);
			}
			target.tempHide();
		},
		ai: {
			order: 10,
			result: {
				player(player) {
					if (player.countCards("h") > 1) {
						return 1;
					}
					if (player.hp === 1) {
						return 1;
					}
					return 0;
				},
			},
			useful: 10,
			value: 10,
		},
	},
	hsshenqi_nengliangzhiguang: {
		type: "hsshenqi",
		fullimage: true,
		vanish: true,
		enable(card, player) {
			return !player.isTurnedOver();
		},
		derivation: "hs_lafamu",
		filterTarget: true,
		content() {
			target.gainMaxHp();
			target.recover();
			target.draw(4);
		},
		contentAfter() {
			if (!player.isTurnedOver()) {
				player.turnOver();
			}
		},
		ai: {
			order: 5,
			result: {
				target(player, target) {
					if (target.hp <= 1) {
						return 2;
					}
					if (target.countCards("h") < target.hp || target.hp === 2) {
						return 1.5;
					}
					return 1;
				},
			},
			useful: 5,
			value: 10,
		},
	},
	hsshenqi_kongbusangzhong: {
		type: "hsshenqi",
		fullimage: true,
		vanish: true,
		enable(card, player) {
			return !player.isTurnedOver();
		},
		derivation: "hs_lafamu",
		filterTarget(card, player, target) {
			return target !== player;
		},
		selectTarget: -1,
		content() {
			target.damage();
		},
		contentAfter() {
			if (!player.isTurnedOver()) {
				player.turnOver();
			}
		},
		ai: {
			order: 9,
			result: {
				target: -2,
			},
			tag: {
				damage: 1,
				multitarget: 1,
				multineg: 1,
			},
			useful: 5,
			value: 10,
		},
	},
	hsshenqi_morijingxiang: {
		type: "hsshenqi",
		fullimage: true,
		vanish: true,
		enable(card, player) {
			return !player.isTurnedOver();
		},
		derivation: "hs_lafamu",
		filterTarget(card, player, target) {
			return target !== player && target.countCards("hej") > 0;
		},
		selectTarget: -1,
		content() {
			if (target.countCards("hej")) {
				player.gainPlayerCard(target, "hej", true);
			}
		},
		contentAfter() {
			if (!player.isTurnedOver()) {
				player.turnOver();
			}
		},
		ai: {
			order: 9.5,
			result: {
				player: (player, target) => {
					return lib.card.shunshou.ai.result.player(player, target) - 3 / game.countPlayer();
				},
				target: (player, target) => {
					return lib.card.shunshou.ai.result.target(player, target);
				},
			},
			tag: {
				multitarget: 1,
				multineg: 1,
				loseCard: 1,
				gain: 1,
			},
			useful: 5,
			value: 10,
		},
	},
	hsmengjing_feicuiyoulong: {
		type: "hsmengjing",
		fullimage: true,
		vanish: true,
		enable: true,
		derivation: "hs_ysera",
		filterTarget: true,
		content() {
			target.damage();
		},
		ai: {
			order: 5,
			result: {
				target: -1,
			},
			tag: {
				damage: 1,
			},
			useful: 5,
			value: 10,
		},
	},
	hsmengjing_suxing: {
		type: "hsmengjing",
		fullimage: true,
		vanish: true,
		enable: true,
		derivation: "hs_ysera",
		filterTarget(card, player, target) {
			return player !== target;
		},
		selectTarget: -1,
		content() {
			target.loseHp();
			var he = target.getCards("he");
			if (he.length) {
				target.discard(he.randomGets(2));
			}
		},
		ai: {
			result: {
				target: -1,
			},
			order: 6,
			useful: 5,
			value: 10,
		},
	},
	hsmengjing_mengye: {
		type: "hsmengjing",
		fullimage: true,
		vanish: true,
		enable: true,
		derivation: "hs_ysera",
		filterTarget: true,
		content() {
			target.draw();
			target.addSkill("hsmengjing_mengye");
		},
		ai: {
			order: 1,
			useful: 5,
			value: 10,
			result: {
				target(player, target) {
					if (target.hasSkill("hsmengjing_mengye")) {
						return 0.5;
					}
					return -target.countCards("he");
				},
			},
		},
	},
	hsmengjing_mengjing: {
		type: "hsmengjing",
		fullimage: true,
		vanish: true,
		enable: true,
		derivation: "hs_ysera",
		filterTarget(card, player, target) {
			return !target.hasJudge("lebu") || target.countCards("e") > 0;
		},
		content() {
			"step 0";
			var es = target.getCards("e");
			if (es.length) {
				target.gain(es, "gain2");
			}
			"step 1";
			if (!target.hasJudge("lebu")) {
				target.addJudge(game.createCard("lebu"));
			}
		},
		ai: {
			order: 2,
			useful: 5,
			value: 10,
			result: {
				target(player, target) {
					var num = target.hp - target.countCards("he") - 2;
					if (num > -1) {
						return -1;
					}
					if (target.hp < 3) {
						num--;
					}
					if (target.hp < 2) {
						num--;
					}
					if (target.hp < 1) {
						num--;
					}
					return num;
				},
			},
		},
	},
	hsmengjing_huanxiaojiemei: {
		type: "hsmengjing",
		fullimage: true,
		vanish: true,
		enable: true,
		derivation: "hs_ysera",
		filterTarget(card, player, target) {
			return target.hp < target.maxHp;
		},
		content() {
			target.recover();
		},
		ai: {
			order: 6,
			value: 10,
			useful: [7, 4],
			result: {
				target(player, target) {
					return get.recoverEffect(target, player, target);
				},
			},
		},
	},
	hszuzhou_nvwudeganguo: {
		type: "hszuzhou",
		fullimage: true,
		vanish: true,
		enable: true,
		derivation: "hs_hajiasha",
		filterTarget(card, player, target) {
			return target.countCards("he");
		},
		content() {
			"step 0";
			target.chooseToDiscard("he", true);
			"step 1";
			if (!lib.characterPack.hearth) {
				target.draw();
				return;
			}
			var list = [];
			for (var i = 0; i < lib.cardPack.mode_derivation.length; i++) {
				var name = lib.cardPack.mode_derivation[i];
				var info = lib.card[name];
				if (info.gainable === false || info.destroy) {
					continue;
				}
				if (lib.characterPack.hearth[info.derivation]) {
					list.push(name);
				}
			}
			if (!list.length) {
				target.draw();
			} else {
				target.gain(game.createCard(list.randomGet()), "draw");
			}
		},
		ai: {
			order: 8,
			value: 8,
			result: {
				target: 1,
			},
		},
	},
	hszuzhou_nvwudepingguo: {
		type: "hszuzhou",
		fullimage: true,
		vanish: true,
		enable: true,
		derivation: "hs_hajiasha",
		filterTarget: true,
		content() {
			target.gain([game.createCard("sha"), game.createCard("sha")], "gain2");
		},
		ai: {
			order: 8.1,
			value: 6,
			result: {
				target: 1,
			},
		},
	},
	hszuzhou_nvwudexuetu: {
		type: "hszuzhou",
		fullimage: true,
		vanish: true,
		enable: true,
		derivation: "hs_hajiasha",
		filterTarget(card, player, target) {
			return !target.hasSkill("zhoujiang");
		},
		content() {
			if (!target.hasSkill("fengyin")) {
				target.addTempSkill("fengyin", { player: "phaseAfter" });
			}
			target.addTempSkill("zhoujiang", { player: "phaseAfter" });
		},
		ai: {
			order: 8.5,
			value: 5,
			result: {
				target(player, target) {
					if (target.hasSkill("fengyin")) {
						return 1.5;
					}
					if (target.hasSkillTag("maixie")) {
						if (target.countCards("h") <= 1) {
							return -0.1;
						}
					} else if (target.countCards("h") > 1 && get.threaten(target) <= 1.2) {
						return 1;
					}
				},
			},
		},
	},
	hszuzhou_wushushike: {
		type: "hszuzhou",
		fullimage: true,
		vanish: true,
		enable: true,
		derivation: "hs_hajiasha",
		filterTarget: true,
		selectTarget: -1,
		multitarget: true,
		multiline: true,
		content() {
			"step 0";
			event.targets = game.filterPlayer().sortBySeat();
			"step 1";
			if (event.targets.length) {
				event.current = event.targets.shift();
				var cards = event.current.getCards("h", "shan");
				if (cards.length) {
					event.current.lose(cards)._triggered = null;
				}
				event.num = cards.length;
			} else {
				event.finish();
			}
			"step 2";
			var cards = [];
			for (var i = 0; i < event.num; i++) {
				cards.push(game.createCard("sha"));
			}
			event.current.directgain(cards);
			event.goto(1);
		},
		ai: {
			order: 4,
			value: 6,
			result: {
				player(player) {
					if (
						!player.hasSha() &&
						player.countCards("h", "shan") &&
						game.hasPlayer(function (current) {
							return player.canUse("sha", current, true, true) && get.effect(current, { name: "sha" }, player, player) > 0;
						})
					) {
						return 1;
					}
					return 0;
				},
			},
		},
	},
	hszuzhou_guhuo: {
		type: "hszuzhou",
		fullimage: true,
		vanish: true,
		enable: true,
		derivation: "hs_hajiasha",
		filterTarget(card, player, target) {
			return target !== player && target.countCards("he");
		},
		content() {
			"step 0";
			target.chooseCard("he", true);
			"step 1";
			if (result.bool) {
				target.give(result.cards, player);
			}
		},
		ai: {
			order: 8.6,
			value: 8,
			result: {
				target(player, target) {
					return -1 / Math.sqrt(1 + target.countCards("he"));
				},
			},
		},
	},
	tuteng1: {
		noname: true,
		fullimage: true,
		type: "hstuteng",
		derivation: "hs_sthrall",
		gainable: false,
	},
	tuteng2: {
		noname: true,
		fullimage: true,
		type: "hstuteng",
		derivation: "hs_sthrall",
		gainable: false,
	},
	tuteng3: {
		noname: true,
		fullimage: true,
		type: "hstuteng",
		derivation: "hs_sthrall",
		gainable: false,
	},
	tuteng4: {
		noname: true,
		fullimage: true,
		type: "hstuteng",
		derivation: "hs_sthrall",
		gainable: false,
	},
	tuteng5: {
		noname: true,
		fullimage: true,
		type: "hstuteng",
		derivation: "hs_sthrall",
		gainable: false,
	},
	tuteng6: {
		noname: true,
		fullimage: true,
		type: "hstuteng",
		derivation: "hs_sthrall",
		gainable: false,
	},
	tuteng7: {
		noname: true,
		fullimage: true,
		type: "hstuteng",
		derivation: "hs_sthrall",
		gainable: false,
	},
	tuteng8: {
		noname: true,
		fullimage: true,
		type: "hstuteng",
		derivation: "hs_sthrall",
		gainable: false,
	},
};

for (let i in card) {
	card[i].image = "ext:杀海拾遗/image/card/" + i + ".jpg";
}

export default card;
