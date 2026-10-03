import { lib, game, ui, get, ai, _status } from "../../main/utils.js";

const card = {
	hufu: {
		fullskin: true,
		type: "basic",
		global: ["g_hufu_sha", "g_hufu_shan", "g_hufu_jiu"],
		savable(card, player, dying) {
			return dying === player;
		},
		ai: {
			value: [7.5, 5, 2],
			useful: [7.5, 5, 2],
		},
	},
	liuxinghuoyu: {
		fullskin: true,
		type: "trick",
		enable: true,
		filterTarget: true,
		cardcolor: "red",
		cardnature: "fire",
		content() {
			"step 0";
			if (target.countCards("he") < 2) {
				event.directfalse = true;
			} else {
				target.chooseToDiscard("he", 2).ai = function (card) {
					if (target.hasSkillTag("nofire")) {
						return 0;
					}
					if (get.damageEffect(target, player, target, "fire") >= 0) {
						return 0;
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
					if (target.hp === 1 && get.type(card) !== "basic") {
						return 10 - get.value(card);
					}
					return 8 - get.value(card);
				};
			}
			"step 1";
			if (event.directfalse || !result.bool) {
				target.damage("fire");
			}
		},
		ai: {
			basic: {
				order: 4,
				value: 7,
				useful: 2,
			},
			result: {
				target(player, target) {
					if (target.hasSkillTag("nofire")) {
						return 0;
					}
					if (get.damageEffect(target, player, player) < 0 && get.attitude(player, target) > 0) {
						return -2;
					}
					var nh = target.countCards("he");
					if (target === player) {
						nh--;
					}
					switch (nh) {
						case 0:
						case 1:
							return -2;
						case 2:
							return -1.5;
						case 3:
							return -1;
						default:
							return -0.7;
					}
				},
			},
			tag: {
				damage: 1,
				fireDamage: 1,
				natureDamage: 1,
				discard: 1,
				loseCard: 1,
				position: "he",
			},
		},
	},
	dujian: {
		// fullskin: true,
		type: "basic",
		enable: true,
		filterTarget(card, player, target) {
			return target.countCards("h") > 0;
		},
		content() {
			"step 0";
			if (target.countCards("h") === 0 || player.countCards("h") === 0) {
				event.finish();
				return;
			}
			player.chooseCard(true);
			"step 1";
			event.card1 = result.cards[0];
			var rand = Math.random() < 0.5;
			target.chooseCard(true).ai = function (card) {
				if (rand) {
					return Math.random();
				}
				return get.value(card);
			};
			"step 2";
			event.card2 = result.cards[0];
			ui.arena.classList.add("thrownhighlight");
			game.addVideo("thrownhighlight1");
			player.$compare(event.card1, target, event.card2);
			game.delay(4);
			"step 3";
			game.log(player, "展示了", event.card1);
			game.log(target, "展示了", event.card2);
			if (get.color(event.card2) === get.color(event.card1)) {
				player.discard(event.card1).animate = false;
				target.$gain2(event.card2);
				var clone = event.card1.clone;
				if (clone) {
					clone.style.transition = "all 0.5s";
					clone.style.transform = "scale(1.2)";
					clone.delete();
					game.addVideo("deletenode", player, get.cardsInfo([clone]));
				}
				target.loseHp();
			} else {
				player.$gain2(event.card1);
				target.$gain2(event.card2);
				target.addTempSkill("dujian2");
			}
			ui.arena.classList.remove("thrownhighlight");
			game.addVideo("thrownhighlight2");
		},
		ai: {
			basic: {
				order: 2,
				value: 3,
				useful: 1,
			},
			result: {
				player(player, target) {
					if (player.countCards("h") <= Math.min(5, Math.max(2, player.hp)) && _status.event.name === "chooseToUse") {
						if (typeof _status.event.filterCard === "function" && _status.event.filterCard({ name: "dujian" })) {
							return -10;
						}
						if (_status.event.skill) {
							var viewAs = get.info(_status.event.skill).viewAs;
							if (viewAs === "dujian") {
								return -10;
							}
							if (viewAs && viewAs.name === "dujian") {
								return -10;
							}
						}
					}
					return 0;
				},
				target(player, target) {
					if (target.hasSkill("dujian2") || target.countCards("h") === 0) {
						return 0;
					}
					if (player.countCards("h") <= 1) {
						return 0;
					}
					return -1.5;
				},
			},
			tag: {
				loseHp: 1,
			},
		},
	},
	yangpijuan: {
		fullskin: true,
		type: "trick",
		enable: true,
		toself: true,
		filterTarget(card, player, target) {
			return target === player;
		},
		modTarget: true,
		content() {
			"step 0";
			var choice;
			if (target.countCards("h", "shan") === 0 || target.countCards("h", "sha") === 0 || target.hp <= 1) {
				choice = "basic";
			} else {
				var e2 = target.getEquip(2);
				var e3 = target.getEquip(3);
				if ((e2 && e3) || ((e2 || e3) && target.needsToDiscard() <= 1) || Math.random() < 0.5) {
					choice = "trick";
				} else {
					choice = "equip";
				}
			}
			target
				.chooseControl("basic", "trick", "equip", function () {
					return choice;
				})
				.set("prompt", "选择一种卡牌类型");
			"step 1";
			var list = get.inpile(result.control, "trick");
			list = list.randomGets(3);
			for (var i = 0; i < list.length; i++) {
				list[i] = [get.translation(result.control), "", list[i]];
			}
			var dialog = ui.create.dialog("选择一张加入你的手牌", [list, "vcard"], "hidden");
			target.chooseButton(dialog, true).ai = function (button) {
				return get.value({ name: button.link[2] });
			};
			"step 2";
			if (result.buttons) {
				target.gain(game.createCard(result.buttons[0].link[2]), "draw");
			}
		},
		selectTarget: -1,
		ai: {
			order: 7,
			value: 7,
			useful: 4,
			result: {
				target: 1,
			},
		},
	},
	shencaojie: {
		fullskin: true,
		type: "trick",
		nodelay: true,
		// recastable:true,
		global: "g_shencaojie",
		content() {
			var evt = event.getParent("g_shencaojie")._trigger;
			if (evt) {
				if (evt.player === player) {
					evt.num--;
				} else {
					evt.num++;
				}
			}
		},
		ai: {
			order: 1,
			useful: 5,
			value: 6,
			result: {
				target(player, target) {
					if (target === player) {
						if (get.damageEffect(target, player, target) >= 0) {
							return 0;
						}
						return 1;
					} else {
						if (get.attitude(player, target) > 0) {
							return 0;
						}
						if (get.damageEffect(target, player, target) >= 0) {
							return 0;
						}
						return -1;
					}
				},
			},
		},
	},
	yuruyi: {
		type: "equip",
		subtype: "equip5",
		skills: ["yuruyi"],
		fullskin: true,
		ai: {
			basic: {
				equipValue: 6,
			},
		},
	},
	fengyinzhidan: {
		type: "basic",
		enable: true,
		fullskin: true,
		filterTarget(card, player, target) {
			return target === player;
		},
		selectTarget: -1,
		modTarget: true,
		// usable:1,
		content() {
			"step 0";
			event.num = 2;
			var list = [];
			event.list = list;
			for (var i = 0; i < lib.inpile.length; i++) {
				if (lib.filter.filterCard({ name: lib.inpile[i] }, target)) {
					var info = lib.card[lib.inpile[i]];
					if (info.type === "trick" && !info.multitarget && !info.notarget) {
						if (Array.isArray(info.selectTarget)) {
							if (info.selectTarget[0] > 0 && info.selectTarget[1] >= info.selectTarget[0]) {
								list.push(lib.inpile[i]);
							}
						} else if (typeof info.selectTarget === "number") {
							list.push(lib.inpile[i]);
						}
					}
				}
			}
			"step 1";
			var list = event.list;
			while (list.length) {
				var card = { name: list.randomRemove() };
				var info = get.info(card);
				var targets = game.filterPlayer(function (current) {
					return lib.filter.filterTarget(card, target, current);
				});
				if (targets.length) {
					targets.sort(lib.sort.seat);
					if (info.selectTarget === -1) {
						target.useCard(card, targets, "noai");
					} else {
						var num = info.selectTarget;
						if (Array.isArray(num)) {
							if (targets.length < num[0]) {
								continue;
							}
							num = num[0] + Math.floor(Math.random() * (num[1] - num[0] + 1));
						} else {
							if (targets.length < num) {
								continue;
							}
						}
						target.useCard(card, targets.randomGets(num), "noai");
					}
					if (--event.num > 0) {
						event.redo();
					}
					break;
				}
			}
		},
		ai: {
			order: 9,
			value: 8,
			useful: 3,
			result: {
				target: 1,
			},
		},
	},
	yuchanqian: {
		fullskin: true,
		type: "jiqi",
		addinfo: "杀",
		autoViewAs: "sha",
		global: ["g_yuchan_swap", "g_yuchan_equip"],
		ai: {
			value: 6,
			useful: [5, 1],
		},
	},
	yuchankun: {
		fullskin: true,
		type: "jiqi",
		addinfo: "药",
		autoViewAs: "caoyao",
		global: ["g_yuchan_swap", "g_yuchan_equip"],
		ai: {
			value: 6,
			useful: [7, 2],
		},
	},
	yuchanzhen: {
		fullskin: true,
		type: "jiqi",
		autoViewAs: "jiu",
		addinfo: "酒",
		global: ["g_yuchan_swap", "g_yuchan_equip"],
		savable(card, player, dying) {
			return dying === player;
		},
		ai: {
			value: 6,
			useful: [4, 1],
		},
	},
	yuchanxun: {
		fullskin: true,
		type: "jiqi",
		autoViewAs: "tao",
		addinfo: "桃",
		global: ["g_yuchan_swap", "g_yuchan_equip"],
		savable: true,
		ai: {
			value: 6,
			useful: [8, 6.5],
		},
	},
	yuchankan: {
		fullskin: true,
		type: "jiqi",
		autoViewAs: "shenmiguo",
		global: ["g_yuchan_swap", "g_yuchan_equip"],
		addinfo: "果",
		ai: {
			order: 1,
			useful: 4,
			value: 6,
			result: {
				player() {
					var cardname = _status.event.cardname;
					if (cardname === "tiesuo") {
						return 0;
					}
					if (cardname === "jiu") {
						return 0;
					}
					if (cardname === "tianxianjiu") {
						return 0;
					}
					if (cardname === "toulianghuanzhu") {
						return 0;
					}
					if (cardname === "shijieshu") {
						return 0;
					}
					if (cardname === "xietianzi") {
						return 0;
					}
					if (cardname === "huogong") {
						return 0;
					}
					if (cardname === "shandianjian") {
						return 0;
					}
					return 1;
				},
			},
		},
	},
	yuchanli: {
		fullskin: true,
		type: "jiqi",
		autoViewAs: "tianxianjiu",
		global: ["g_yuchan_swap", "g_yuchan_equip"],
		addinfo: "仙",
		savable(card, player, dying) {
			return dying === player;
		},
		ai: {
			value: 6,
			useful: 1,
		},
	},
	yuchangen: {
		fullskin: true,
		type: "jiqi",
		addinfo: "蛋",
		autoViewAs: "fengyinzhidan",
		global: ["g_yuchan_swap", "g_yuchan_equip"],
		ai: {
			value: 6,
			useful: 1,
		},
	},
	yuchandui: {
		fullskin: true,
		type: "jiqi",
		addinfo: "雪",
		autoViewAs: "xuejibingbao",
		global: ["g_yuchan_swap", "g_yuchan_equip"],
		ai: {
			value: 6,
			useful: 4,
		},
	},
	mujiaren: {
		fullskin: true,
		enable: true,
		type: "jiguan",
		usable: 1,
		updateUsable: "phaseUse",
		forceUsable: true,
		wuxieable: true,
		selectTarget: -1,
		filterTarget(card, player, target) {
			return target === player;
		},
		content() {
			"step 0";
			var cards = target.getCards("h", function (card) {
				return get.type(card) !== "basic";
			});
			if (cards.length) {
				target.lose(cards)._triggered = null;
			}
			event.num = 1 + cards.length;
			"step 1";
			var cards = [];
			var list = get.typeCard("jiguan");
			for (var i = 0; i < list.length; i++) {
				if (lib.card[list[i]].derivation) {
					list.splice(i--, 1);
				}
			}
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
				target: 1,
			},
		},
	},
	zhiluxiaohu: {
		enable(card, player) {
			return lib.filter.filterCard({ name: "sha" }, player);
		},
		fullskin: true,
		type: "jiguan",
		wuxieable: true,
		filterTarget(card, player, target) {
			return target === player;
		},
		modTarget: true,
		selectTarget: -1,
		content() {
			"step 0";
			var targets = target.getEnemies();
			if (targets.length) {
				var target2 = targets.randomGet();
				target2.addExpose(0.2);
				target.useCard({ name: "sha" }, target2);
			}
			player.addSkill("zhiluxiaohu");
			"step 1";
			player.removeSkill("zhiluxiaohu");
		},
		ai: {
			value: 6,
			result: {
				target: 1,
			},
			order() {
				return get.order({ name: "sha" }) + 0.1;
			},
		},
	},
	xuejibingbao: {
		enable: true,
		fullskin: true,
		type: "basic",
		filterTarget(card, player, target) {
			return !target.hasSkill("xuejibingbao");
		},
		content() {
			target.storage.xuejibingbao = 2;
			target.addSkill("xuejibingbao");
		},
		ai: {
			order: 2,
			value: 6,
			result: {
				target(player, target) {
					var num = 1;
					if (target.hp < 2) {
						num = 0.5;
					}
					return num / Math.sqrt(Math.max(1, target.countCards("h")));
				},
			},
		},
	},
	gouhunluo: {
		enable: true,
		fullskin: true,
		type: "jiguan",
		wuxieable: true,
		filterTarget(card, player, target) {
			return !target.hasSkill("gouhunluo");
		},
		content() {
			target.storage.gouhunluo = 3;
			target.storage.gouhunluo2 = player;
			target.addSkill("gouhunluo");
		},
		ai: {
			order: 2,
			value: 5,
			result: {
				target(player, target) {
					return -1 / Math.max(1, target.hp);
				},
			},
		},
	},
	zhuquezhizhang: {
		type: "jiqi",
		fullskin: true,
		global: "g_zhuquezhizhang",
		ai: {
			value: 8,
			useful: 6.5,
		},
	},
	xuanwuzhihuang: {
		type: "jiqi",
		fullskin: true,
		global: "g_xuanwuzhihuang",
		ai: {
			value: 8,
			useful: 6.5,
		},
	},
	huanglinzhicong: {
		type: "jiqi",
		fullskin: true,
		global: "g_huanglinzhicong",
		ai: {
			value: 8,
			useful: 6.5,
		},
	},
	cangchizhibi: {
		type: "jiqi",
		fullskin: true,
		global: "g_cangchizhibi",
		ai: {
			value: 8,
			useful: 6.5,
		},
	},
	qinglongzhigui: {
		type: "jiqi",
		fullskin: true,
		global: "g_qinglongzhigui",
		ai: {
			value: 8,
			useful: 6.5,
		},
	},
	baishouzhihu: {
		type: "jiqi",
		fullskin: true,
		global: "g_baishouzhihu",
		ai: {
			value: 8,
			useful: 6.5,
		},
	},
	jiguantong: {
		fullskin: true,
		type: "jiguan",
		cardnature: "fire",
		enable: true,
		wuxieable: true,
		selectTarget: -1,
		reverseOrder: true,
		filterTarget(card, player, target) {
			return target !== player;
		},
		content() {
			"step 0";
			if (target.countCards("h")) {
				var next = target.chooseToDiscard("机关火筒：弃置一张手牌或受到1点火焰伤害");
				next.set("ai", function (card) {
					var evt = _status.event.getParent();
					if (get.damageEffect(evt.target, evt.player, evt.target, "fire") >= 0) {
						return 0;
					}
					return 8 - get.useful(card);
				});
			} else {
				target.damage("fire");
				event.parent.preResult = true;
				event.finish();
			}
			"step 1";
			if (result.bool === false) {
				target.damage("fire");
				event.parent.preResult = true;
			}
		},
		contentAfter() {
			if (!event.preResult) {
				player.draw();
			}
		},
		ai: {
			wuxie(target, card, player, viewer) {
				if (get.attitude(viewer, target) > 0) {
					if (target.countCards("h") > 0 || target.hp > 1) {
						return 0;
					}
				}
			},
			basic: {
				order: 9,
				useful: 1,
			},
			result: {
				target(player, target) {
					if (player.hasUnknown(2)) {
						return 0;
					}
					var nh = target.countCards("h");
					if (get.mode() === "identity") {
						if (target.isZhu && nh <= 1 && target.hp <= 1) {
							return -100;
						}
					}
					if (nh === 0) {
						return -1;
					}
					if (nh === 1) {
						return -0.7;
					}
					return -0.5;
				},
			},
			tag: {
				discard: 1,
				loseCard: 1,
				damage: 1,
				natureDamage: 1,
				fireDamage: 1,
				multitarget: 1,
				multineg: 1,
			},
		},
	},
	donghuangzhong: {
		fullskin: true,
		type: "equip",
		subtype: "equip5",
		nomod: true,
		nopower: true,
		unique: true,
		skills: ["donghuangzhong"],
		ai: {
			equipValue: 7,
		},
	},
	xuanyuanjian: {
		fullskin: true,
		type: "equip",
		subtype: "equip1",
		nomod: true,
		nopower: true,
		unique: true,
		skills: ["xuanyuanjian", "xuanyuanjian2", "xuanyuanjian3"],
		enable(card, player) {
			return player.hasSkill("xuanyuan") || player.hp > 2;
		},
		distance: { attackFrom: -2 },
		onEquip() {
			if (!player.hasSkill("xuanyuan") && player.hp <= 2) {
				player.discard(card);
			} else {
				player.changeHujia();
			}
		},
		ai: {
			equipValue: 9,
		},
	},
	pangufu: {
		fullskin: true,
		type: "equip",
		subtype: "equip1",
		skills: ["pangufu"],
		nomod: true,
		nopower: true,
		unique: true,
		distance: { attackFrom: -3 },
		ai: {
			equipValue: 8,
		},
	},
	lianyaohu: {
		fullskin: true,
		type: "equip",
		subtype: "equip5",
		equipDelay: false,
		loseDelay: false,
		nomod: true,
		nopower: true,
		unique: true,
		onEquip() {
			player.markSkill("lianyaohu_skill");
		},
		onLose() {
			player.unmarkSkill("lianyaohu_skill");
			if (player.getStat().skill.lianhua) {
				delete player.getStat().skill.lianhua;
			}
			if (player.getStat().skill.shouna) {
				delete player.getStat().skill.shouna;
			}
		},
		clearLose: true,
		ai: { equipValue: 6 },
		skills: ["lianhua", "shouna", "lianyaohu_skill"],
	},
	haotianta: {
		fullskin: true,
		type: "equip",
		subtype: "equip5",
		skills: ["haotianta"],
		nomod: true,
		nopower: true,
		unique: true,
		ai: {
			equipValue: 7,
		},
	},
	fuxiqin: {
		fullskin: true,
		type: "equip",
		subtype: "equip5",
		skills: ["kongxin"],
		nomod: true,
		nopower: true,
		unique: true,
		ai: { equipValue: 6 },
		onLose() {
			if (player.getStat().skill.kongxin) {
				delete player.getStat().skill.kongxin;
			}
		},
	},
	shennongding: {
		fullskin: true,
		type: "equip",
		subtype: "equip5",
		skills: ["shennongding"],
		nomod: true,
		nopower: true,
		unique: true,
		ai: { equipValue: 6 },
		onLose() {
			if (player.getStat().skill.shennongding) {
				delete player.getStat().skill.shennongding;
			}
		},
	},
	kongdongyin: {
		fullskin: true,
		type: "equip",
		subtype: "equip5",
		skills: ["kongdongyin"],
		nomod: true,
		nopower: true,
		unique: true,
		ai: {
			equipValue(card, player) {
				if (player.hp === 2) {
					return 7;
				}
				if (player.hp === 1) {
					return 10;
				}
				return 5;
			},
			basic: {
				equipValue: 7,
			},
		},
	},
	kunlunjingc: {
		fullskin: true,
		type: "equip",
		subtype: "equip5",
		skills: ["kunlunjingc"],
		nomod: true,
		nopower: true,
		unique: true,
		ai: { equipValue: 6 },
		onLose() {
			if (player.getStat().skill.kunlunjingc) {
				delete player.getStat().skill.kunlunjingc;
			}
		},
	},
	nvwashi: {
		fullskin: true,
		type: "equip",
		subtype: "equip5",
		skills: ["nvwashi"],
		nomod: true,
		nopower: true,
		unique: true,
		ai: {
			equipValue: 5,
		},
	},
	guisheqi: {
		fullskin: true,
		type: "trick",
		enable: true,
		filterTarget: true,
		content() {
			target.changeHujia();
		},
		ai: {
			basic: {
				order: 5,
				useful: 3,
				value: [6, 2, 1],
			},
			result: {
				target(player, target) {
					return 2 / Math.max(1, Math.sqrt(target.hp));
				},
			},
		},
	},
	jiguanfeng: {
		fullskin: true,
		type: "jiguan",
		enable: true,
		wuxieable: true,
		filterTarget(card, player, target) {
			return target !== player;
		},
		content() {
			"step 0";
			var next = target.chooseToRespond({ name: "shan" });
			next.set("respondTo", [player, card]);
			next.autochoose = lib.filter.autoRespondShan;
			"step 1";
			if (result.bool === false) {
				if (!target.hasSkill("fengyin")) {
					target.addTempSkill("fengyin", { player: "phaseBegin" });
				}
				target.damage();
			} else {
				event.finish();
			}
		},
		ai: {
			basic: {
				order: 9,
				useful: 3,
				value: 6.5,
			},
			result: {
				target: -2,
			},
			tag: {
				respond: 1,
				respondShan: 1,
				// damage:1,
			},
		},
	},
	jiguanyuan: {
		fullskin: true,
		type: "jiguan",
		wuxieable: true,
		enable(card, player) {
			var hs = player.getCards("he");
			return hs.length > 1 || (hs.length === 1 && hs[0] !== card);
		},
		filterTarget(card, player, target) {
			return target !== player && !target.hasSkill("jiguanyuan");
		},
		content() {
			"step 0";
			if (player.countCards("he")) {
				player.chooseCard(true, "he").set("prompt2", "你将" + get.translation(cards) + "和选择牌置于" + get.translation(target) + "的武将牌上，然后摸一张牌；" + get.translation(target) + "于下一结束阶段获得武将牌上的牌");
			} else {
				event.finish();
			}
			"step 1";
			player.$throw(result.cards);
			player.lose(result.cards, ui.special);
			ui.special.appendChild(cards[0]);
			event.togive = [cards[0], result.cards[0]];
			game.delay();
			"step 2";
			// target.gain(event.togive).delay=false;
			target.$gain2(event.togive);
			target.storage.jiguanyuan = event.togive;
			target.addSkill("jiguanyuan");
			game.log(target, "从", player, "获得了", event.togive);
			player.draw();
		},
		ai: {
			basic: {
				order: 2,
				useful: 2,
				value: 7,
			},
			result: {
				target(player, target) {
					var players = game.filterPlayer(function (current) {
						return current !== player && !current.isTurnedOver() && get.attitude(player, current) >= 3 && get.attitude(current, player) >= 3;
					});
					players.sort(lib.sort.seat);
					if (target === players[0]) {
						return 2;
					}
					return 0.5;
				},
			},
		},
	},
	shenmiguo: {
		fullskin: true,
		type: "basic",
		global: "g_shenmiguo",
		content() {
			if (Array.isArray(player.storage.shenmiguo)) {
				player.useCard(player.storage.shenmiguo[0], player.storage.shenmiguo[1]);
			}
		},
		ai: {
			order: 1,
			useful: 6,
			value: 6,
			result: {
				player() {
					var cardname = _status.event.cardname;
					if (get.tag({ name: cardname }, "norepeat")) {
						return 0;
					}
					return 1;
				},
			},
		},
	},
	qinglianxindeng: {
		fullskin: true,
		type: "equip",
		subtype: "equip2",
		skills: ["qinglianxindeng"],
		ai: {
			basic: {
				equipValue: 8,
			},
		},
	},
	lingjiandai: {
		fullskin: true,
		enable: true,
		type: "jiguan",
		wuxieable: true,
		filterTarget(card, player, target) {
			return target === player;
		},
		selectTarget: -1,
		modTarget: true,
		content() {
			var list = get.typeCard("hslingjian");
			if (list.length) {
				list = list.randomGets(3);
				for (var i = 0; i < list.length; i++) {
					list[i] = game.createCard(list[i]);
				}
				target.gain(list, "gain2");
			}
		},
		ai: {
			order: 10,
			value: 7,
			useful: 1,
			tag: {
				gain: 1,
			},
			result: {
				target(player, target) {
					if (target === player && target.countCards("h", { type: "equip" })) {
						return 2.5;
					}
					return 1;
				},
			},
		},
	},
	jiguanshu: {
		fullskin: true,
		type: "jiguan",
		wuxieable: true,
		modTarget: true,
		enable(card, player) {
			var es = player.getCards("e");
			for (var i = 0; i < es.length; i++) {
				if (lib.inpile.includes(es[i].name) && !lib.card[es[i].name].nopower && !lib.card[es[i].name].unique && !es[i].nopower) {
					return true;
				}
			}
			return false;
		},
		filterTarget(card, player, target) {
			return target === player;
			// var es=target.getCards('e');
			// for(var i=0;i<es.length;i++){
			// 	if(lib.inpile.includes(es[i].name)) return true;
			// }
			// return false;
		},
		selectTarget: -1,
		content() {
			"step 0";
			var es = target.getCards("e");
			var list = get.typeCard("hslingjian");
			var list2 = get.typeCard("jiqi");
			var list3 = [];
			var list4 = [];
			for (var i = 0; i < list2.length; i++) {
				if (list2[i].indexOf("yuchan") === 0) {
					list4.push(list2[i]);
				} else {
					list3.push(list2[i]);
				}
			}
			if (Math.random() < 1 / 3) {
				list2 = list4;
			} else {
				list2 = list3;
			}
			var cards = [];
			var time = 0;
			for (var i = 0; i < es.length; i++) {
				if (!lib.inpile.includes(es[i].name) || lib.card[es[i].name].nopower || lib.card[es[i].name].unique || es[i].nopower) {
					es.splice(i--, 1);
				}
			}
			if (!es.length) {
				event.finish();
				return;
			}
			if (!list.length && !list2.length) {
				event.finish();
				return;
			}
			var num = get.rand(es.length);
			var card;
			target.removeEquipTrigger();
			var delayed = 0;
			for (var i = 0; i < es.length; i++) {
				if (i === num) {
					card = game.createCard(list2.randomGet());
				} else {
					card = game.createCard(list.randomGet());
				}
				if (!card) {
					delayed++;
					continue;
				}
				cards.push(card);
				time += 200;
				setTimeout(
					(function (card, name, last) {
						return function () {
							game.createCard(card).discard();
							card.init([card.suit, card.number, name, card.nature]);
							card.style.transform = "scale(1.1)";
							card.classList.add("glow");
							if (last) {
								game.resume();
							}
							setTimeout(function () {
								card.style.transform = "";
								card.classList.remove("glow");
							}, 500);
						};
					})(es[i], lib.skill.lingjianduanzao.process([card, es[i]]), i === es.length - 1),
					(i - delayed) * 200
				);
			}
			target.$gain2(cards);
			game.pause();
			"step 1";
			target.addEquipTrigger();
		},
		ai: {
			value: 7,
			order: 7.5,
			result: {
				// target:function(player,target){
				// 	var es=target.getCards('e');
				// 	var num=0;
				// 	for(var i=0;i<es.length;i++){
				// 		if(lib.inpile.includes(es[i].name)) num++;
				// 	}
				// 	return num;
				// }
				target: 1,
			},
		},
	},
	jiguanyaoshu: {
		fullskin: true,
		enable: true,
		type: "jiguan",
		range: { global: 1 },
		wuxieable: true,
		filterTarget(card, player, target) {
			for (var i = 1; i <= 5; i++) {
				if (!target.getEquip(i)) {
					return !target.hasSkill("jiguanyaoshu_skill") && !target.isMin();
				}
			}
			return false;
		},
		content() {
			var types = [];
			for (var i = 1; i <= 5; i++) {
				if (!target.getEquip(i)) {
					types.push("equip" + i);
				}
			}
			var list = get.inpile("equip");
			for (var i = 0; i < list.length; i++) {
				if (!types.includes(lib.card[list[i]].subtype)) {
					list.splice(i--, 1);
				}
			}
			var card = game.createCard(list.randomGet());
			target.$gain2(card);
			target.equip(card);
			target.addSkill("jiguanyaoshu_skill");
			game.delay();
		},
		ai: {
			wuxie() {
				return 0;
			},
			order: 10.1,
			value: [5, 1],
			result: {
				target(player, target) {
					return 1 / (1 + target.countCards("e"));
				},
			},
		},
	},
	hslingjian_xuanfengzhiren: {
		type: "hslingjian",
		fullimage: true,
		vanish: true,
		enable: true,
		derivation: true,
		derivationpack: "swd",
		filterTarget(card, player, target) {
			return target.countCards("he") > 0;
		},
		content() {
			target.discard(target.getCards("he").randomGet());
		},
		ai: {
			order: 9,
			result: {
				target: -1,
			},
			useful: [2, 0.5],
			value: [2, 0.5],
		},
	},
	hslingjian_zhongxinghujia: {
		type: "hslingjian",
		fullimage: true,
		vanish: true,
		enable: true,
		derivation: true,
		derivationpack: "swd",
		filterTarget(card, player, target) {
			return !target.isMin();
		},
		content() {
			"step 0";
			var list = [];
			for (var i = 0; i < lib.inpile.length; i++) {
				if (lib.card[lib.inpile[i]].subtype === "equip2") {
					list.push(lib.inpile[i]);
				}
			}
			if (list.length) {
				var card = game.createCard(list.randomGet());
				target.$draw(card);
				game.delay();
				target.equip(card);
			}
			"step 1";
			var hs = target.getCards("h");
			if (hs.length) {
				target.discard(hs.randomGet());
			}
		},
		ai: {
			order: 4,
			result: {
				target(player, target) {
					if (target.getEquip(2)) {
						if (target.countCards("h") && !target.hasSkillTag("noe")) {
							return -0.6;
						}
						return 0;
					} else {
						var hs = target.getCards("h");
						var num = 0;
						if (target.hasSkillTag("noe")) {
							num = 1;
						}
						if (player === target) {
							if (hs.length === 2) {
								return num;
							}
							if (hs.length === 1) {
								return num + 1;
							}
							if (hs.length <= 4) {
								for (var i = 0; i < hs.length; i++) {
									if (get.value(hs[i]) > 6) {
										return num;
									}
								}
							}
							if (hs.length > 4) {
								return num + 0.5;
							}
						} else {
							if (hs.length) {
								if (hs.length <= 3) {
									return num;
								}
								return num + 0.5;
							}
						}
						return num + 1;
					}
				},
			},
			useful: [2, 0.5],
			value: [2, 0.5],
		},
	},
	hslingjian_xingtigaizao: {
		type: "hslingjian",
		fullimage: true,
		vanish: true,
		enable: true,
		derivation: true,
		derivationpack: "swd",
		filterTarget(card, player, target) {
			return target === player;
		},
		selectTarget: -1,
		content() {
			target.draw();
			target.addSkill("hslingjian_xingtigaizao");
			if (typeof target.storage.hslingjian_xingtigaizao === "number") {
				target.storage.hslingjian_xingtigaizao++;
			} else {
				target.storage.hslingjian_xingtigaizao = 1;
			}
		},
		ai: {
			order: 9,
			result: {
				target(player, target) {
					if (!player.needsToDiscard()) {
						return 1;
					}
					return 0;
				},
			},
			useful: [2, 0.5],
			value: [2, 0.5],
		},
	},
	hslingjian_shijianhuisu: {
		type: "hslingjian",
		fullimage: true,
		vanish: true,
		enable: true,
		derivation: true,
		derivationpack: "swd",
		filterTarget(card, player, target) {
			return target !== player && target.countCards("e") > 0;
		},
		content() {
			var es = target.getCards("e");
			target.gain(es);
			target.$gain2(es);
		},
		ai: {
			order: 5,
			result: {
				target(player, target) {
					if (target.hasSkillTag("noe") || target.hasSkillTag("reverseEquip")) {
						return target.countCards("e") * 2;
					}
					if (target.getEquip("baiyin") && target.isDamaged()) {
						return 2;
					}
					if (target.getEquip("xuanyuanjian") || target.getEquip("qiankundai")) {
						return 1;
					}
					if (target.hasSkill("jiguanyaoshu_skill")) {
						return 0.5;
					}
					var num = 0;
					var es = target.getCards("e");
					for (var i = 0; i < es.length; i++) {
						var subtype = get.subtype(es[i]);
						if (subtype === "equip1" || subtype === "equip3") {
							num++;
						}
					}
					var mn = target.getEquip("muniu");
					if (mn && mn.cards && mn.cards.length) {
						num += mn.cards.length;
					}
					return -num;
				},
			},
			useful: [2, 0.5],
			value: [2, 0.5],
			tag: {
				loseCard: 1,
			},
		},
	},
	hslingjian_jinjilengdong: {
		type: "hslingjian",
		fullimage: true,
		vanish: true,
		enable: true,
		derivation: true,
		derivationpack: "swd",
		filterTarget(card, player, target) {
			return !target.isTurnedOver() && target !== player;
		},
		content() {
			"step 0";
			target.changeHujia(2);
			target.turnOver();
			"step 1";
			if (target.isTurnedOver()) {
				target.addTempSkill("hslingjian_jinjilengdong", { player: "turnOverAfter" });
			}
		},
		ai: {
			order: 2,
			result: {
				target(player, target) {
					var num = get.threaten(target, player);
					if (target.hasSkillTag("noturn")) {
						return 2 * num;
					}
					if (target.hp > 4) {
						return -1.2 * num;
					} else if (target.hp === 4) {
						return -1 * num;
					} else if (target.hp === 3) {
						return -0.9 * num;
					} else if (target.hp === 2) {
						return -0.5 * num;
					} else {
						if (target.maxHp > 2) {
							if (target.hujia) {
								return 0.5 * num;
							}
							return num;
						}
						return 0;
					}
				},
			},
			useful: [2, 0.5],
			value: [2, 0.5],
		},
	},
	hslingjian_shengxiuhaojiao: {
		type: "hslingjian",
		fullimage: true,
		vanish: true,
		enable: true,
		derivation: true,
		derivationpack: "swd",
		filterTarget(card, player, target) {
			return !target.hasSkill("hslingjian_chaofeng");
		},
		content() {
			target.addTempSkill("hslingjian_chaofeng", { player: "phaseBegin" });
		},
		ai: {
			order: 2,
			result: {
				target(player, target) {
					if (get.distance(player, target, "absolute") <= 1) {
						return 0;
					}
					if (target.countCards("h") <= target.hp) {
						return -0.1;
					}
					return -1;
				},
			},
			useful: [2, 0.5],
			value: [2, 0.5],
		},
	},
	hslingjian_yinmilichang: {
		type: "hslingjian",
		fullimage: true,
		vanish: true,
		enable: true,
		derivation: true,
		derivationpack: "swd",
		filterTarget(card, player, target) {
			return player !== target && !target.hasSkill("qianxing");
		},
		content() {
			target.tempHide();
		},
		ai: {
			order: 2,
			result: {
				target(player, target) {
					if (get.distance(player, target, "absolute") <= 1) {
						return 0;
					}
					if (target.hp === 1) {
						return 2;
					}
					if (target.hp === 2 && target.countCards("h") <= 2) {
						return 1.2;
					}
					return 1;
				},
			},
			useful: [2, 0.5],
			value: [2, 0.5],
		},
	},
	xingjunyan: {
		fullskin: true,
		type: "equip",
		subtype: "equip5",
		skills: ["xingjunyan"],
		ai: {
			basic: {
				equipValue: 4,
			},
		},
	},
	qinglonglingzhu: {
		fullskin: true,
		type: "equip",
		subtype: "equip5",
		skills: ["qinglonglingzhu"],
		ai: {
			basic: {
				equipValue: 5,
			},
		},
	},
	baihupifeng: {
		fullskin: true,
		type: "equip",
		subtype: "equip2",
		skills: ["baihupifeng"],
		ai: {
			equipValue(card, player) {
				if (player.hp <= 2) {
					return 8;
				}
				return 6;
			},
			basic: {
				equipValue: 7,
			},
		},
	},
	fengxueren: {
		fullskin: true,
		type: "equip",
		subtype: "equip1",
		distance: { attackFrom: -1 },
		skills: ["fengxueren"],
		ai: {
			basic: {
				equipValue: 5,
			},
		},
	},
	chilongya: {
		fullskin: true,
		type: "equip",
		subtype: "equip1",
		distance: { attackFrom: -1 },
		skills: ["chilongya"],
		ai: {
			basic: {
				equipValue: 4,
			},
		},
	},
	daihuofenglun: {
		type: "equip",
		subtype: "equip4",
		fullskin: true,
		cardnature: "fire",
		distance: { globalFrom: -2, globalTo: -1 },
		ai: {
			basic: {
				equipValue: 4,
			},
		},
	},
	xiayuncailing: {
		type: "equip",
		subtype: "equip3",
		fullskin: true,
		distance: { globalFrom: 1, globalTo: 2 },
	},
	shentoumianju: {
		fullskin: true,
		type: "equip",
		subtype: "equip5",
		skills: ["shentou"],
		ai: { basic: { equipValue: 7 } },
		onLose() {
			if (player.getStat().skill.shentou) {
				delete player.getStat().skill.shentou;
			}
		},
	},
	xianluhui: {
		fullskin: true,
		type: "trick",
		enable: true,
		selectTarget: -1,
		reverseOrder: true,
		filterTarget(card, player, target) {
			return target.isDamaged();
		},
		content() {
			target.changeHujia();
		},
		ai: {
			tag: {
				multitarget: 1,
			},
			basic: {
				order: 7,
				useful: 3,
				value: 3,
			},
			result: {
				target(player, target) {
					if (target.hp <= 1) {
						return 1.5;
					}
					if (target.hp === 2) {
						return 1.2;
					}
					return 1;
				},
			},
		},
	},
	xiangyuye: {
		type: "basic",
		enable: true,
		// fullskin: true,
		filterTarget(card, player, target) {
			return get.distance(player, target, "attack") > 1;
		},
		content() {
			"step 0";
			if (!target.countCards("h", { color: "black" })) {
				target.loseHp();
				event.finish();
			} else {
				target.chooseToDiscard({ color: "black" }, "弃置一张黑色手牌或受失去1点体力").ai = function (card) {
					return 8 - get.value(card);
				};
			}
			"step 1";
			if (!result.bool) {
				target.loseHp();
			}
		},
		ai: {
			basic: {
				order: 9,
				value: 3,
				useful: 1,
			},
			result: {
				target: -2,
			},
			tag: {
				discard: 1,
				loseHp: 1,
			},
		},
	},
	caoyao: {
		fullskin: true,
		type: "basic",
		range: { global: 1 },
		enable: true,
		filterTarget(card, player, target) {
			return target.hp < target.maxHp;
		},
		content() {
			target.recover();
		},
		ai: {
			basic: {
				useful: [7, 2],
				value: [7, 2],
			},
			order: 2.2,
			result: {
				target: 2,
			},
			tag: {
				recover: 1,
			},
		},
	},
	tianxianjiu: {
		fullskin: true,
		type: "basic",
		toself: true,
		enable(event, player) {
			return !player.hasSkill("tianxianjiu");
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
				target.addTempSkill("tianxianjiu", ["phaseAfter", "shaAfter"]);
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
					return 3;
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
					return 3;
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
	huanpodan: {
		fullskin: true,
		type: "basic",
		enable: true,
		logv: false,
		filterTarget(card, player, target) {
			return !target.hasSkill("huanpodan_skill");
		},
		async content(event, trigger, player) {
			const target = event.target,
				targets = event.targets;
			let card = event.card,
				cards = event.cards;
			target.addSkill("huanpodan_skill");
			if (cards && cards.length) {
				card = cards[0];
			}
			if (target === targets[0] && card.clone && (card.clone.parentNode === player.parentNode || card.clone.parentNode === ui.arena)) {
				card.clone.moveDelete(target);
				game.addVideo("gain2", target, get.cardsInfo([card]));
			}
		},
		ai: {
			basic: {
				value: 8,
				useful: 4,
			},
			order: 2,
			result: {
				target(player, target) {
					return 1 / Math.sqrt(1 + target.hp);
				},
			},
		},
	},
	langeguaiyi: {
		fullskin: true,
		type: "equip",
		subtype: "equip5",
		skills: ["longfan"],
		ai: { basic: { equipValue: 7 } },
		onLose() {
			if (player.getStat().skill.longfan) {
				delete player.getStat().skill.longfan;
			}
		},
	},
	guiyoujie: {
		fullskin: true,
		type: "delay",
		filterTarget(card, player, target) {
			return lib.filter.judge(card, player, target) && player !== target;
		},
		judge(card) {
			if (get.color(card) === "black") {
				return -3;
			}
			return 0;
		},
		effect() {
			if (result.bool === false) {
				player.loseHp();
				player.randomDiscard();
			}
		},
		ai: {
			basic: {
				order: 1,
				useful: 1,
				value: 6,
			},
			result: {
				target(player, target) {
					if (target.hasSkillTag("noturn")) {
						return 0;
					}
					return -3;
				},
			},
		},
	},
	yufulu: {
		fullskin: true,
		type: "equip",
		subtype: "equip5",
		skills: ["touzhi"],
		ai: {
			basic: {
				equipValue: 5,
			},
		},
	},
	xixueguizhihuan: {
		fullskin: true,
		type: "equip",
		subtype: "equip5",
		skills: ["xixue"],
		ai: {
			basic: {
				equipValue: 5,
			},
		},
	},
	zhufangshenshi: {
		fullskin: true,
		type: "trick",
		enable: true,
		global: "g_zhufangshenshi",
		filterTarget(card, player, target) {
			return target !== player;
		},
		content() {
			player.storage.zhufangshenshi = target;
			player.addTempSkill("zhufangshenshi");
		},
		ai: {
			tag: {
				norepeat: 1,
			},
			value: 4,
			wuxie() {
				return 0;
			},
			useful: [2, 1],
			basic: {
				order: 7,
			},
			result: {
				player(player, target) {
					if (get.attitude(player, target) < 0) {
						if (get.distance(player, target) > 1) {
							return 1;
						}
						return 0.6;
					}
					return 0.3;
				},
			},
		},
	},
	jingleishan: {
		fullskin: true,
		type: "trick",
		enable: true,
		selectTarget: -1,
		reverseOrder: true,
		cardcolor: "black",
		cardnature: "thunder",
		filterTarget(card, player, target) {
			return target !== player;
		},
		content() {
			"step 0";
			var next = target.chooseToRespond({ name: "sha" });
			next.ai = function (card) {
				if (get.damageEffect(target, player, target, "thunder") >= 0) {
					return 0;
				}
				if (player.hasSkillTag("notricksource")) {
					return 0;
				}
				if (target.hasSkillTag("notrick")) {
					return 0;
				}
				return 11 - get.value(card);
			};
			next.set("respondTo", [player, card]);
			next.autochoose = lib.filter.autoRespondSha;
			"step 1";
			if (result.bool === false) {
				target.damage("thunder");
			}
		},
		ai: {
			wuxie(target, card, player, viewer) {
				if (get.attitude(viewer, target) > 0 && target.countCards("h", "sha")) {
					if (!target.countCards("h") || target.hp === 1 || Math.random() < 0.7) {
						return 0;
					}
				}
			},
			basic: {
				order: 9,
				useful: [5, 1],
				value: 5,
			},
			result: {
				target(player, target) {
					if (target.hasSkillTag("nothunder")) {
						return 0;
					}
					if (target.hasUnknown(2)) {
						return 0;
					}
					var nh = target.countCards("h");
					if (lib.config.mode === "identity") {
						if (target.isZhu && nh <= 2 && target.hp <= 1) {
							return -100;
						}
					}
					if (nh === 0) {
						return -2;
					}
					if (nh === 1) {
						return -1.7;
					}
					return -1.5;
				},
			},
			tag: {
				respond: 1,
				respondSha: 1,
				damage: 1,
				natureDamage: 1,
				thunderDamage: 1,
				multitarget: 1,
				multineg: 1,
			},
		},
	},

	chiyuxi: {
		fullskin: true,
		type: "trick",
		enable: true,
		selectTarget: -1,
		reverseOrder: true,
		cardcolor: "red",
		cardnature: "fire",
		filterTarget(card, player, target) {
			return target !== player;
		},
		content() {
			"step 0";
			var next = target.chooseToRespond({ name: "shan" });
			next.ai = function (card) {
				if (get.damageEffect(target, player, target, "fire") >= 0) {
					return 0;
				}
				if (player.hasSkillTag("notricksource")) {
					return 0;
				}
				if (target.hasSkillTag("notrick")) {
					return 0;
				}
				if (target.hasSkillTag("noShan", null, "respond")) {
					return -1;
				}
				return 11 - get.value(card);
			};
			next.set("respondTo", [player, card]);
			next.autochoose = lib.filter.autoRespondShan;
			"step 1";
			if (result.bool === false) {
				target.damage("fire");
			}
		},
		ai: {
			wuxie(target, card, player, viewer) {
				if (get.attitude(viewer, target) > 0 && target.countCards("h", "shan")) {
					if (!target.countCards("h") || target.hp === 1 || Math.random() < 0.7) {
						return 0;
					}
				}
			},
			basic: {
				order: 9,
				useful: 1,
				value: 5,
			},
			result: {
				target(player, target) {
					if (target.hasSkillTag("nofire")) {
						return 0;
					}
					if (player.hasUnknown(2)) {
						return 0;
					}
					var nh = target.countCards("h");
					if (lib.config.mode === "identity") {
						if (target.isZhu && nh <= 2 && target.hp <= 1) {
							return -100;
						}
					}
					if (nh === 0) {
						return -2;
					}
					if (nh === 1) {
						return -1.7;
					}
					return -1.5;
				},
			},
			tag: {
				respond: 1,
				respondShan: 1,
				damage: 1,
				natureDamage: 1,
				fireDamage: 1,
				multitarget: 1,
				multineg: 1,
			},
		},
	},
	guangshatianyi: {
		fullskin: true,
		type: "equip",
		subtype: "equip2",
		skills: ["guangshatianyi"],
		ai: {
			basic: {
				equipValue: 6,
			},
		},
	},
	guilingzhitao: {
		type: "equip",
		fullskin: true,
		subtype: "equip5",
		skills: ["nigong"],
		ai: {
			equipValue(card, player) {
				if (!player.storage.nigong) {
					return 5;
				}
				return 5 + player.storage.nigong;
			},
			basic: {
				equipValue: 5,
			},
		},
		equipDelay: false,
		loseDelay: false,
		clearLose: true,
		onLose() {
			player.storage.nigong = 0;
			player.unmarkSkill("nigong");
		},
		onEquip() {
			player.storage.nigong = 0;
			player.markSkill("nigong");
		},
	},
	qipoguyu: {
		type: "equip",
		subtype: "equip5",
		skills: ["xujin"],
		equipDelay: false,
		loseDelay: false,
		clearLose: true,
		onLose() {
			player.storage.xujin = 0;
		},
		onEquip() {
			player.storage.xujin = 0;
		},
	},
	sadengjinhuan: {
		fullskin: true,
		type: "equip",
		subtype: "equip5",
		skills: ["sadengjinhuan"],
		ai: {
			basic: {
				equipValue: 5.5,
			},
		},
	},
	sifeizhenmian: {
		fullskin: true,
		type: "equip",
		subtype: "equip5",
		skills: ["yiluan"],
		ai: { basic: { equipValue: 7 } },
		onLose() {
			if (player.getStat().skill.yiluan) {
				delete player.getStat().skill.yiluan;
			}
		},
	},
	shuchui: {
		fullskin: true,
		type: "equip",
		subtype: "equip5",
		skills: ["shuchui"],
		ai: { basic: { equipValue: 5.5 } },
		onLose() {
			if (player.getStat().skill.shuchui) {
				delete player.getStat().skill.shuchui;
			}
		},
	},
	guiyanfadao: {
		fullskin: true,
		type: "equip",
		subtype: "equip1",
		distance: { attackFrom: -1 },
		ai: {
			basic: {
				equipValue: 3,
			},
		},
		skills: ["guiyanfadao"],
	},
	qiankundai: {
		fullskin: true,
		type: "equip",
		subtype: "equip5",
		onLose() {
			player.draw();
		},
		skills: ["qiankundai"],
		ai: {
			order: 9.5,
			equipValue(card, player) {
				if (player.countCards("h", "qiankundai")) {
					return 6;
				}
				return 1;
			},
			basic: {
				equipValue: 5,
			},
		},
	},
};

for (let i in card) {
	if (card[i].fullskin) {
		card[i].image = "ext:杀海拾遗/image/card/" + i + ".png";
	} else if (card[i].fullimage) {
		card[i].image = "ext:杀海拾遗/image/card/" + i + ".jpg";
	}
}

export default card;
