import { lib, game, ui, get, ai, _status } from "../../main/utils.js";

/** @type { importCharacterConfig['skill'] } */
const skill = {
	woliu: {
		trigger: { player: "phaseEnd" },
		direct: true,
		unique: true,
		forceunique: true,
		content() {
			"step 0";
			player.chooseTarget(get.prompt("woliu"), lib.filter.notMe, [1, 2]).ai = function (target) {
				if (get.attitude(player, target) < 0) {
					return get.effect(target, { name: "sha" }, player, player);
				}
				return 0;
			};
			"step 1";
			if (result.bool) {
				player.logSkill("woliu", result.targets);
				var list = [player].concat(result.targets);
				for (var i = 0; i < list.length; i++) {
					list[i].storage.woliu2 = list.slice(0);
					list[i].addSkill("woliu2");
				}
			}
		},
		group: "woliu_clear",
		subSkill: {
			clear: {
				trigger: { player: ["dieBegin", "phaseBegin"] },
				forced: true,
				popup: false,
				content() {
					for (var i = 0; i < game.players.length; i++) {
						game.players[i].removeSkill("woliu2");
					}
				},
			},
		},
	},
	woliu2: {
		mark: true,
		intro: {
			content: "players",
		},
		trigger: { global: "useCard" },
		forced: true,
		popup: false,
		onremove(player) {
			delete player.storage.woliu2;
			for (var i = 0; i < game.players.length; i++) {
				var current = game.players[i];
				if (Array.isArray(current.storage.woliu2) && current.storage.woliu2.includes(player)) {
					current.storage.woliu2.remove(player);
					current.updateMarks();
				}
			}
		},
		filter(event, player) {
			if (event.card.name !== "sha") {
				return false;
			}
			if (!event.targets.includes(player)) {
				return false;
			}
			if (!player.storage.woliu2) {
				return false;
			}
			for (var i = 0; i < player.storage.woliu2.length; i++) {
				var current = player.storage.woliu2[i];
				if (current.isIn() && event.player !== current && !event.targets.includes(current)) {
					return true;
				}
			}
			return false;
		},
		content() {
			"step 0";
			game.delayx();
			"step 1";
			var list = [];
			for (var i = 0; i < player.storage.woliu2.length; i++) {
				var current = player.storage.woliu2[i];
				if (current.isIn() && trigger.player !== current && !trigger.targets.includes(current)) {
					list.push(current);
				}
			}
			player.logSkill("woliu2", list);
			trigger.targets.addArray(list);
		},
		group: "woliu2_die",
		subSkill: {
			die: {
				trigger: { player: "dieBegin" },
				silent: true,
				content() {
					player.removeSkill("woliu2");
				},
			},
		},
		ai: {
			effect: {
				target_use(card, player, target) {
					if (_status.woliu2_temp) {
						return;
					}
					if (card.name === "sha" && target.storage.woliu2) {
						_status.woliu2_temp = true;
						var num = game.countPlayer(function (current) {
							if (current !== player && current !== target && target.storage.woliu2.includes(current)) {
								return get.sgn(get.effect(current, card, player, target));
							}
						});
						delete _status.woliu2_temp;
						if (target.hasSkill("qianggu2") && get.attitude(player, target) > 0) {
							return [0, num];
						}
						if (target.hp === 1 && !target.hasShan("all")) {
							return;
						}
						return [1, num];
					}
				},
			},
		},
	},
	qianggu: {
		enable: "phaseUse",
		usable: 1,
		filterCard: true,
		selectCard: 2,
		position: "he",
		check(card) {
			return 8 - get.value(card);
		},
		filter(event, player) {
			return player.countCards("he") >= 2;
		},
		content() {
			player.changeHujia(2);
			player.addTempSkill("qianggu2", { player: "phaseBegin" });
		},
		ai: {
			result: {
				player: 1,
			},
			order: 2.5,
		},
	},
	qianggu2: {
		trigger: { target: "useCardToBefore" },
		forced: true,
		filter(event, player) {
			return event.card.name === "sha";
		},
		mark: true,
		marktext: "固",
		intro: {
			content: "其他角色对你使用杀时需要弃置一张基本牌，否则杀对你无效",
		},
		content() {
			"step 0";
			var eff;
			if (player.hasSkill("woliu2")) {
				eff = -get.attitude(trigger.player, player);
			} else {
				eff = get.effect(player, trigger.card, trigger.player, trigger.player);
			}
			trigger.player
				.chooseToDiscard("强固：弃置一张基本牌，否则杀对" + get.translation(player) + "无效", function (card) {
					return get.type(card) === "basic";
				})
				.set("ai", function (card) {
					if (_status.event.eff > 0) {
						return 10 - get.value(card);
					}
					return 0;
				})
				.set("eff", eff);
			"step 1";
			if (result.bool === false) {
				trigger.cancel();
			}
		},
		ai: {
			effect: {
				target(card, player, target, current) {
					if (card.name === "sha") {
						if (_status.event.name === "qianggu2") {
							return;
						}
						if (get.attitude(player, target) > 0) {
							return;
						}
						var bs = player.getCards("h", { type: "basic" });
						if (bs.length < 2) {
							return 0;
						}
						if (player.hasSkill("jiu") || player.hasSkill("tianxianjiu")) {
							return;
						}
						if (bs.length <= 3 && player.countCards("h", "sha") <= 1) {
							for (var i = 0; i < bs.length; i++) {
								if (bs[i].name !== "sha" && get.value(bs[i]) < 7) {
									return [1, 0, 1, -0.5];
								}
							}
							return 0;
						}
						return [1, 0, 1, -0.5];
					}
				},
			},
		},
	},
	dianji: {
		enable: "phaseUse",
		filter(event, player) {
			return player.countCards("h") > 0;
		},
		filterCard: true,
		usable: 1,
		viewAs: { name: "jingleishan", nature: "thunder" },
		check(card) {
			return 8 - get.value(card);
		},
		ai: {
			order: 8,
			expose: 0.2,
			threaten: 1.2,
		},
		mod: {
			playerEnabled(card, player, target) {
				if (_status.event.skill === "dianji" && get.distance(player, target) > 2) {
					return false;
				}
			},
		},
	},
	feitiao: {
		trigger: { player: "phaseUseBegin" },
		direct: true,
		filter(event, player) {
			return player.countCards("he") > 0;
		},
		content() {
			"step 0";
			var next = player.chooseCardTarget({
				prompt: get.prompt("feitiao"),
				position: "he",
				filterCard: true,
				ai1(card) {
					return 7 - get.value(card);
				},
				ai2(target) {
					var att = get.attitude(player, target);
					if (att >= 0) {
						return 0;
					}
					if (!target.countCards("he")) {
						return -0.01;
					}
					var dist = get.distance(player, target);
					if (dist > 2) {
						att -= 2;
					} else if (dist === 2) {
						att--;
					}
					return -att;
				},
				filterTarget(card, player, target) {
					return player !== target;
				},
			});
			"step 1";
			if (result.bool) {
				player.discard(result.cards);
				var target = result.targets[0];
				player.logSkill("feitiao", target);
				player.storage.feitiao2 = target;
				player.addTempSkill("feitiao2");
				target.randomDiscard();
			}
		},
	},
	feitiao2: {
		mod: {
			globalFrom(from, to) {
				if (to === from.storage.feitiao2) {
					return -Infinity;
				}
			},
		},
		mark: "character",
		intro: {
			content: "与$的距离视为1直到回合结束",
		},
		onremove: true,
	},
	zhencha: {
		init(player) {
			player.storage.zhencha = true;
		},
		mark: true,
		intro: {
			content(storage, player) {
				if (storage) {
					return "每当你使用一张杀，你摸一张牌或回复1点体力";
				} else if (player.hasSkill("bshaowei") && player.storage.bshaowei) {
					return "你的杀无视距离和防具、无数量限制且不可闪避；你不能闪避杀";
				} else {
					return "无额外技能";
				}
			},
		},
		trigger: { player: "phaseEnd" },
		filter(event, player) {
			if (player.hasSkill("zhencha2")) {
				return false;
			}
			return !player.storage.zhencha;
		},
		content() {
			player.storage.bshaowei = false;
			player.storage.zhencha = true;
			if (player.marks.zhencha) {
				player.marks.zhencha.firstChild.innerHTML = "侦";
			}
			player.addTempSkill("zhencha2");
		},
		subSkill: {
			sha: {
				trigger: { player: "shaBegin" },
				direct: true,
				filter(event, player) {
					return player.storage.zhencha && event.card && event.card.name === "sha";
				},
				content() {
					player.chooseDrawRecover(get.prompt("zhencha")).logSkill = "zhencha";
				},
			},
		},
		group: "zhencha_sha",
	},
	bshaowei: {
		init(player) {
			player.storage.bshaowei = false;
		},
		trigger: { player: "phaseEnd" },
		filter(event, player) {
			if (player.hasSkill("zhencha2")) {
				return false;
			}
			return !player.storage.bshaowei;
		},
		check(event, player) {
			if (!player.hasShan()) {
				return true;
			}
			if (!player.hasSha()) {
				return false;
			}
			return Math.random() < 0.5;
		},
		content() {
			player.storage.bshaowei = true;
			player.storage.zhencha = false;
			if (player.marks.zhencha) {
				player.marks.zhencha.firstChild.innerHTML = "哨";
			}
			player.addTempSkill("zhencha2");
		},
		subSkill: {
			sha: {
				mod: {
					targetInRange(card, player, target, now) {
						if (card.name === "sha" && player.storage.bshaowei) {
							return true;
						}
					},
					cardUsable(card, player, num) {
						if (card.name === "sha" && player.storage.bshaowei) {
							return Infinity;
						}
					},
				},
				trigger: { target: "shaBegin", player: "shaBegin" },
				forced: true,
				filter(event, player) {
					return player.storage.bshaowei;
				},
				check() {
					return false;
				},
				content() {
					trigger.directHit = true;
				},
				ai: {
					unequip: true,
					skillTagFilter(player, tag, arg) {
						if (!player.storage.bshaowei) {
							return false;
						}
						if (arg && arg.name === "sha") {
							return true;
						}
						return false;
					},
				},
			},
		},
		group: "bshaowei_sha",
		ai: {
			threaten(player, target) {
				if (target.storage.bshaowei) {
					return 1.7;
				}
				return 1;
			},
		},
	},
	zhencha2: {},
	pingzhang: {
		trigger: { global: "damageBegin" },
		intro: {
			content(storage, player) {
				if (player.hasSkill("pingzhang2")) {
					if (player.hasSkill("pingzhang3")) {
						return "已对自已和其他角色发动屏障";
					} else {
						return "已对自已发动屏障";
					}
				} else {
					return "已对其他角色发动屏障";
				}
			},
			markcount(storage, player) {
				if (player.hasSkill("pingzhang2") && player.hasSkill("pingzhang3")) {
					return 2;
				}
				return 1;
			},
		},
		filter(event, player) {
			if (event.num <= 0) {
				return false;
			}
			var position = "he";
			if (event.player === player) {
				if (player.hasSkill("pingzhang2")) {
					return false;
				}
				return player.countCards(position, { suit: "heart" });
			} else {
				if (player.hasSkill("pingzhang3")) {
					return false;
				}
				return player.countCards(position, { suit: "spade" });
			}
		},
		direct: true,
		content() {
			"step 0";
			var position = "he";
			var suit = player === trigger.player ? "heart" : "spade";
			var next = player.chooseToDiscard(position, { suit: suit }, get.prompt("pingzhang", trigger.player));
			next.ai = function (card) {
				if (get.damageEffect(trigger.player, trigger.source, player) < 0) {
					return 8 - get.value(card);
				}
				return 0;
			};
			next.logSkill = ["pingzhang", trigger.player];
			"step 1";
			if (result.bool) {
				trigger.num--;
				if (player === trigger.player) {
					player.addSkill("pingzhang2");
				} else {
					player.addSkill("pingzhang3");
				}
				player.markSkill("pingzhang");
			}
		},
		group: ["pingzhang_count"],
		subSkill: {
			count: {
				trigger: { player: "phaseBegin" },
				silent: true,
				content() {
					player.storage.pingzhang = 0;
					if (player.hasSkill("pingzhang2")) {
						player.storage.pingzhang++;
						player.removeSkill("pingzhang2");
					}
					if (player.hasSkill("pingzhang3")) {
						player.storage.pingzhang++;
						player.removeSkill("pingzhang3");
					}
					player.unmarkSkill("pingzhang");
				},
			},
		},
		ai: {
			expose: 0.2,
			threaten: 1.5,
		},
	},
	pingzhang2: {},
	pingzhang3: {},
	owliyong: {
		trigger: { player: "phaseDrawBegin" },
		forced: true,
		filter(event, player) {
			return player.storage.pingzhang > 0;
		},
		content() {
			trigger.num += player.storage.pingzhang;
		},
	},
	liangou: {
		enable: "phaseUse",
		usable: 1,
		filterTarget(card, player, target) {
			return target !== player;
		},
		filterCard: true,
		position: "he",
		check(card) {
			return 5 - get.value(card);
		},
		content() {
			"step 0";
			player.judge(function (card) {
				return get.suit(card) !== "heart" ? 1 : -1;
			});
			"step 1";
			if (result.bool) {
				target.addTempSkill("liangou2");
				target.storage.liangou2 = player;
			}
		},
		ai: {
			order: 10,
			expose: 0.2,
			result: {
				target(player, target) {
					if (
						get.damageEffect(target, player, target) < 0 &&
						player.hasCard(function (card) {
							return get.tag(card, "damage") ? true : false;
						})
					) {
						return -1;
					}
					return 0;
				},
			},
		},
	},
	liangou2: {
		mod: {
			globalTo(from, to) {
				if (from === to.storage.liangou2) {
					return -Infinity;
				}
			},
		},
		onremove: true,
		trigger: { player: "damageBegin" },
		usable: 1,
		forced: true,
		popup: false,
		content() {
			trigger.num++;
		},
	},
	xiyang: {
		trigger: { player: "phaseEnd" },
		filter(event, player) {
			return !player.isTurnedOver() && player.isDamaged();
		},
		check(event, player) {
			return player.hp <= 1;
		},
		content() {
			"step 0";
			player.turnOver();
			"step 1";
			player.recover(2);
		},
	},
	qinru: {
		trigger: { player: "useCardToBegin" },
		filter(event, player) {
			return event.card.name === "sha" && event.target !== player && event.target && !event.target.hasSkill("fengyin");
		},
		logTarget: "target",
		check(event, player) {
			return get.attitude(player, event.target) < 0;
		},
		intro: {
			content: "players",
			mark(dialog, storage, player) {
				var one = [],
					two = [],
					three = [];
				for (var i = 0; i < storage.length; i++) {
					switch (player.storage.qinru_turn[i]) {
						case 1:
							three.push(storage[i]);
							break;
						case 2:
							two.push(storage[i]);
							break;
						default:
							one.push(storage[i]);
					}
				}
				if (one.length) {
					dialog.addText("一回合前");
					dialog.addSmall(one);
				}
				if (two.length) {
					dialog.addText("两回合前");
					dialog.addSmall(two);
				}
				if (three.length) {
					dialog.addText("三回合前");
					dialog.addSmall(three);
				}
			},
		},
		init(player) {
			player.storage.qinru = [];
			player.storage.qinru_turn = [];
		},
		content() {
			"step 0";
			trigger.target.judge(function (card) {
				return get.suit(card) === "heart" ? 0 : -1;
			});
			"step 1";
			if (result.suit !== "heart") {
				var target = trigger.target;
				var index = player.storage.qinru.indexOf(target);
				var num = _status.currentPhase === player ? 4 : 3;
				if (index === -1) {
					player.storage.qinru.push(target);
					player.storage.qinru_turn.push(num);
				} else {
					player.storage.qinru_turn[index] = num;
				}
				target.addTempSkill("fengyin", { player: "phaseAfter" });
				player.markSkill("qinru");
			}
		},
		ai: {
			expose: 0.2,
			threaten: 1.3,
		},
		subSkill: {
			die: {
				trigger: { global: "dieAfter" },
				silent: true,
				content() {
					var index = player.storage.qinru.indexOf(trigger.player);
					if (index !== -1) {
						player.storage.qinru.splice(index, 1);
						player.storage.qinru_turn.splice(index, 1);
					}
					if (!player.storage.qinru.length) {
						player.unmarkSkill("qinru");
					} else {
						player.updateMarks();
					}
				},
			},
			count: {
				trigger: { player: "phaseAfter" },
				silent: true,
				content() {
					for (var i = 0; i < player.storage.qinru_turn.length; i++) {
						if (player.storage.qinru_turn[i] > 1) {
							player.storage.qinru_turn[i]--;
						} else {
							player.storage.qinru.splice(i, 1);
							player.storage.qinru_turn.splice(i, 1);
							i--;
						}
					}
					if (!player.storage.qinru.length) {
						player.unmarkSkill("qinru");
					} else {
						player.updateMarks();
					}
				},
			},
		},
		group: ["qinru_count", "qinru_die"],
	},
	yinshen: {
		trigger: { player: "loseEnd" },
		forced: true,
		filter(event, player) {
			if (player.countCards("h", { type: "basic" })) {
				return false;
			}
			for (var i = 0; i < event.cards.length; i++) {
				if (event.cards[i].original === "h" && get.type(event.cards[i]) === "basic") {
					return true;
				}
			}
			return false;
		},
		content() {
			player.tempHide();
		},
	},
	maichong: {
		trigger: { player: "useCard" },
		forced: true,
		filter(event, player) {
			if (!player.hasSkill("qinru") || !player.storage.qinru || !player.storage.qinru.length) {
				return false;
			}
			if (get.type(event.card) === "trick" && event.cards[0] && event.cards[0] === event.card) {
				for (var i = 0; i < player.storage.qinru.length; i++) {
					if (player.storage.qinru[i].isIn() && player.storage.qinru[i].countCards("he")) {
						return true;
					}
				}
			}
			return false;
		},
		autodelay: true,
		logTarget(event, player) {
			var list = [];
			for (var i = 0; i < player.storage.qinru.length; i++) {
				if (player.storage.qinru[i].isIn() && player.storage.qinru[i].countCards("he")) {
					list.push(player.storage.qinru[i]);
				}
			}
			return list;
		},
		content() {
			"step 0";
			event.list = player.storage.qinru.slice(0).sortBySeat();
			"step 1";
			if (event.list.length) {
				var target = event.list.shift();
				if (target.isIn()) {
					target.randomDiscard("he", false);
				}
				event.redo();
			}
		},
		ai: {
			threaten: 1.2,
			noautowuxie: true,
		},
	},
	mengji: {
		trigger: { source: "damageBegin" },
		forced: true,
		unique: true,
		filter(event, player) {
			return player.storage.zhongdun && !player.hujia && event.card && event.card.name === "sha" && event.notLink();
		},
		content() {
			trigger.num++;
		},
	},
	zhongdun: {
		unique: true,
		init2(player) {
			if (!player.storage.zhongdun) {
				player.changeHujia(8);
				player.storage.zhongdun = true;
			}
		},
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return player.hujia > 0;
		},
		filterTarget(card, player, target) {
			return !target.hujia;
		},
		filterCard: true,
		position: "he",
		check(card) {
			var player = _status.event.player;
			if (
				game.hasPlayer(function (current) {
					return current.hp === 1 && get.attitude(player, current) > 2;
				})
			) {
				return 7 - get.value(card);
			}
			return 5 - get.value(card);
		},
		content() {
			player.changeHujia(-1);
			target.changeHujia();
		},
		ai: {
			order: 5,
			expose: 0.2,
			result: {
				target(player, target) {
					return 1 / Math.max(1, target.hp);
				},
			},
		},
	},
	maoding: {
		trigger: { player: "damageEnd", source: "damageEnd" },
		frequent: true,
		content() {
			var list = get.typeCard("hslingjian");
			if (!list.length) {
				return;
			}
			player.gain(game.createCard(list.randomGet()), "gain2");
		},
		group: "maoding2",
		ai: {
			threaten: 1.5,
			maixie_defend: true,
		},
	},
	maoding2: {
		enable: "phaseUse",
		filter(event, player) {
			return player.countCards("h", { type: "hslingjian" }) > 1;
		},
		filterCard: { type: "hslingjian" },
		filterTarget(card, player, target) {
			return !target.hujia;
		},
		selectCard: 2,
		content() {
			target.changeHujia();
		},
		ai: {
			order: 9,
			result: {
				target(player, target) {
					return 2 / Math.max(1, Math.sqrt(target.hp));
				},
			},
		},
	},
	paotai: {
		enable: "phaseUse",
		intro: {
			content(storage) {
				var num;
				switch (storage) {
					case 1:
						num = 30;
						break;
					case 2:
						num = 60;
						break;
					case 3:
						num = 100;
						break;
				}
				return "结束阶段，有" + num + "%机率对一名随机敌人造成1点火焰伤害";
			},
		},
		init(player) {
			player.storage.paotai = 0;
		},
		filter(event, player) {
			return player.countCards("h", "sha") > 0 && player.storage.paotai < 3;
		},
		filterCard: { name: "sha" },
		content() {
			player.storage.paotai++;
			player.markSkill("paotai");
		},
		ai: {
			order: 5,
			threaten: 1.5,
			result: {
				player: 1,
			},
		},
		group: ["paotai2", "paotai3"],
	},
	paotai2: {
		trigger: { player: "phaseEnd" },
		forced: true,
		filter(event, player) {
			var num = 0;
			switch (player.storage.paotai) {
				case 1:
					num = 30;
					break;
				case 2:
					num = 60;
					break;
				case 3:
					num = 100;
					break;
			}
			return 100 * Math.random() < num;
		},
		content() {
			var targets = player.getEnemies();
			if (targets.length) {
				var target = targets.randomGet();
				target.addExpose(0.3);
				player.addExpose(0.3);
				target.damage("fire");
				player.line(target, "fire");
			}
		},
	},
	paotai3: {
		trigger: { player: "damageEnd" },
		forced: true,
		popup: false,
		filter(event, player) {
			return player.storage.paotai > 0 && event.num > 0;
		},
		content() {
			player.storage.paotai -= trigger.num;
			if (player.storage.paotai <= 0) {
				player.storage.paotai = 0;
				player.unmarkSkill("paotai");
			} else {
				player.updateMarks();
			}
		},
	},
	bfengshi: {
		trigger: { player: "shaBegin" },
		forced: true,
		check(event, player) {
			return get.attitude(player, event.target) <= 0;
		},
		filter(event, player) {
			if (player.hasSkill("bfengshi4")) {
				return false;
			}
			var num = 0.2;
			return Math.random() < num * player.countUsed();
		},
		content() {
			trigger.directHit = true;
		},
		mod: {
			attackFrom(from, to, distance) {
				return distance - from.countUsed();
			},
		},
		group: ["bfengshi2", "bfengshi3"],
	},
	bfengshi2: {
		trigger: { source: "damageBegin" },
		forced: true,
		check(event, player) {
			return get.attitude(player, event.target) <= 0;
		},
		filter(event, player) {
			if (player.hasSkill("bfengshi4")) {
				return false;
			}
			var num = 0.2;
			return event.card && event.card.name === "sha" && Math.random() < num * player.countUsed();
		},
		content() {
			trigger.num++;
		},
	},
	bfengshi3: {
		trigger: { player: "useCard" },
		silent: true,
		filter(event, player) {
			if (player.hasSkill("bfengshi4")) {
				return false;
			}
			return event.card.name === "sha";
		},
		content() {
			player.addTempSkill("bfengshi4");
		},
	},
	bfengshi4: {},
	yinbo: {
		enable: "phaseUse",
		usable: 1,
		filterCard: { suit: "spade" },
		position: "he",
		filter(event, player) {
			return player.countCards("he", { suit: "spade" }) > 0;
		},
		check(card) {
			return 7 - get.value(card);
		},
		content() {
			"step 0";
			var targets = player.getEnemies(function (target) {
				return target.countCards("he") > 0;
			});
			if (targets.length) {
				event.targets = targets.randomGets(3);
				event.targets.sort(lib.sort.seat);
				player.line(event.targets, "green");
			}
			"step 1";
			if (event.targets.length) {
				var target = event.targets.shift();
				var he = target.getCards("he");
				if (he.length) {
					target.addExpose(0.1);
					target.discard(he.randomGet());
				}
				event.redo();
			}
		},
		ai: {
			order: 10,
			expose: 0.3,
			result: {
				player: 1,
			},
		},
	},
	aqianghua: {
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return player.countCards("h") >= 1;
		},
		filterTarget(card, player, target) {
			return target !== player;
		},
		filterCard: true,
		selectCard: -1,
		discard: false,
		prepare: "give",
		content() {
			target.gain(cards);
			target.changeHujia();
			target.addSkill("aqianghua2");
		},
		ai: {
			threaten: 1.5,
			order: 2.1,
			result: {
				target(player, target) {
					if (target.hasSkillTag("nogain")) {
						return 0;
					}
					if (get.attitude(player, target) < 3) {
						return 0;
					}
					if (target.hasJudge("lebu")) {
						return 0;
					}
					if (target.hasSkill("aqianghua2")) {
						return 0.1;
					}
					return 1;
				},
			},
		},
	},
	aqianghua2: {
		trigger: { source: "damageBegin" },
		forced: true,
		content() {
			trigger.num++;
			player.unmarkSkill("aqianghua2");
			player.removeSkill("aqianghua2");
		},
		mark: true,
		intro: {
			content: "下一次造成的伤害+1",
		},
	},
	shihuo: {
		trigger: { global: "damageEnd" },
		forced: true,
		filter(event) {
			return event.hasNature("fire");
		},
		content() {
			player.draw();
		},
	},
	shoujia: {
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return player.countCards("h") > 0;
		},
		filterCard: true,
		check(card) {
			return 6 - get.value(card);
		},
		discard: false,
		prepare: "give2",
		filterTarget(card, player, target) {
			return target !== player && !target.hasSkill("shoujia2");
		},
		content() {
			target.storage.shoujia = cards[0];
			target.storage.shoujia2 = player;
			target.addSkill("shoujia2");
			target.syncStorage("shoujia");
		},
		ai: {
			order: 1,
			expose: 0.2,
			threaten: 1.4,
			result: {
				target: -1,
			},
		},
	},
	shoujia2: {
		mark: true,
		trigger: { player: "useCardToBegin" },
		forced: true,
		filter(event, player) {
			return get.suit(event.card) === get.suit(player.storage.shoujia) && event.target && event.target !== player;
		},
		content() {
			"step 0";
			player.showCards([player.storage.shoujia], get.translation(player) + "发动了【兽夹】");
			"step 1";
			player.storage.shoujia.discard();
			delete player.storage.shoujia;
			delete player.storage.shoujia2;
			player.removeSkill("shoujia2");
			game.addVideo("storage", player, ["shoujia", null]);
			game.addVideo("storage", player, ["shoujia2", null]);
			player.turnOver(true);
		},
		intro: {
			mark(dialog, content, player) {
				if (player.storage.shoujia2 && player.storage.shoujia2.isUnderControl(true)) {
					dialog.add([player.storage.shoujia]);
				} else {
					return "已成为" + get.translation(player.storage.shoujia2) + "的兽夹目标";
				}
			},
			content(content, player) {
				if (player.storage.shoujia2 && player.storage.shoujia2.isUnderControl(true)) {
					return get.translation(player.storage.shoujia);
				}
				return "已成为" + get.translation(player.storage.shoujia2) + "的兽夹目标";
			},
		},
		group: "shoujia3",
	},
	shoujia3: {
		trigger: { global: "damageEnd" },
		forced: true,
		filter(event, player) {
			return event.player === player.storage.shoujia2;
		},
		content() {
			player.storage.shoujia.discard();
			player.$throw(player.storage.shoujia);
			game.log(player.storage.shoujia, "被置入弃牌堆");
			delete player.storage.shoujia;
			delete player.storage.shoujia2;
			player.removeSkill("shoujia2");
			game.addVideo("storage", player, ["shoujia", null]);
			game.addVideo("storage", player, ["shoujia2", null]);
		},
	},
	liudan: {
		trigger: { player: "useCard" },
		check(event, player) {
			return (
				game.countPlayer(function (current) {
					if (event.targets.includes(current) === false && current !== player && lib.filter.targetEnabled(event.card, player, current)) {
						return get.effect(current, event.card, player, player);
					}
				}) >= 0
			);
		},
		filter(event, player) {
			if (event.card.name !== "sha") {
				return false;
			}
			return game.hasPlayer(function (current) {
				return event.targets.includes(current) === false && current !== player && lib.filter.targetEnabled(event.card, player, current);
			});
		},
		content() {
			var list = game.filterPlayer(function (current) {
				return trigger.targets.includes(current) === false && current !== player && lib.filter.targetEnabled(trigger.card, player, current);
			});
			if (list.length) {
				var list2 = [];
				for (var i = 0; i < list.length; i++) {
					if (Math.random() < 0.5) {
						list2.push(list[i]);
						trigger.targets.push(list[i]);
					}
				}
				if (list2.length) {
					game.log(list2, "被追加为额外目标");
					player.line(list2, "green");
				}
			}
		},
	},
	shenqiang: {
		trigger: { source: "damageEnd" },
		forced: true,
		filter(event, player) {
			return event.card && event.card.name === "sha" && _status.currentPhase === player;
		},
		content() {
			player.getStat().card.sha--;
		},
	},
	tiandan: {
		trigger: { player: "phaseDrawBegin" },
		filter(event, player) {
			return Math.min(5, player.hp) > player.countCards("h") && !player.skipList.includes("phaseUse") && !player.skipList.includes("phaseDiscard");
		},
		check(event, player) {
			var nh = player.countCards("h");
			if (Math.min(5, player.hp) - nh >= 2) {
				return true;
			}
			return false;
		},
		content() {
			var num = Math.min(5, player.hp) - player.countCards("h");
			var cards = [];
			while (num--) {
				cards.push(game.createCard("sha"));
			}
			player.gain(cards, "gain2");
			player.skip("phaseUse");
			player.skip("phaseDiscard");
		},
	},
	shanguang: {
		enable: "phaseUse",
		usable: 1,
		filterCard: { suit: "diamond" },
		position: "he",
		filter(event, player) {
			return player.countCards("he", { suit: "diamond" }) > 0;
		},
		filterTarget(card, player, target) {
			return target !== player && get.distance(player, target, "attack") <= 1;
		},
		check(card) {
			if (card.name === "sha" && _status.event.player.countCards("h", "sha") < 3) {
				return 0;
			}
			return 6 - get.value(card);
		},
		content() {
			target.addTempSkill("shanguang2");
		},
		ai: {
			order: 7.9,
			result: {
				target(player, target) {
					var nh = target.countCards("h");
					if (get.attitude(player, target) < 0 && nh >= 3 && player.canUse("sha", target) && player.countCards("h", "sha") && get.effect(target, { name: "sha" }, player, player) > 0) {
						return -nh - 5;
					}
					return -nh;
				},
			},
		},
	},
	shanguang2: {
		mod: {
			cardEnabled() {
				return false;
			},
			cardUsable() {
				return false;
			},
			cardRespondable() {
				return false;
			},
			cardSavable() {
				return false;
			},
		},
		ai: {
			effect: {
				target(card, player, target, current) {
					if (get.tag(card, "respondShan") || get.tag(card, "respondSha")) {
						if (current < 0) {
							return 1.5;
						}
					}
				},
			},
		},
	},
	baoxue: {
		enable: "phaseUse",
		init(player) {
			player.storage.baoxue = false;
		},
		intro: {
			content: "limited",
		},
		mark: true,
		unique: true,
		limited: true,
		skillAnimation: true,
		animationColor: "water",
		line: "thunder",
		filter(event, player) {
			return !player.storage.baoxue && player.countCards("he", { color: "black" }) > 0;
		},
		filterTarget(card, player, target) {
			return target !== player;
		},
		selectTarget() {
			return [1, _status.event.player.countCards("he", { color: "black" })];
		},
		delay: false,
		contentBefore() {
			"step 0";
			game.delayx();
			"step 1";
			player.storage.baoxue = true;
			player.awakenSkill(event.name);
			player.showHandcards();
			player.discard(player.getCards("he", { color: "black" }));
		},
		content() {
			"step 0";
			var he = target.getCards("he");
			if (he.length) {
				target.discard(he.randomGet());
			}
			"step 1";
			target.turnOver(true);
		},
		contentAfter() {
			player.turnOver(true);
		},
		ai: {
			order(skill, player) {
				var num = game.countPlayer(function (current) {
					return get.attitude(player, current) < 0;
				});
				var nh = player.countCards("he", { color: "black" });
				if (nh === 1 && num > 1) {
					return 0;
				}
				if (nh > num) {
					return 1;
				}
				return 11;
			},
			result: {
				target(player, target) {
					if (target.hasSkillTag("noturn")) {
						return 0;
					}
					if (player.hasUnknown()) {
						return 0;
					}
					return -1;
				},
			},
		},
	},
	mianzhen: {
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return player.countCards("he") > 0;
		},
		filterTarget(card, player, target) {
			return target !== player && !target.hasSkill("mianzhen2");
		},
		filterCard: true,
		position: "he",
		check(card) {
			return 8 - get.value(card);
		},
		content() {
			"step 0";
			target.chooseToRespond({ name: "shan" });
			"step 1";
			if (!result.bool) {
				target.addSkill("mianzhen2");
			}
		},
		ai: {
			order: 2.2,
			result: {
				target(player, target) {
					return Math.min(-0.1, -1 - target.countCards("h") + Math.sqrt(target.hp) / 2);
				},
			},
		},
	},
	mianzhen2: {
		mark: true,
		intro: {
			content: "不能使用或打出手牌直到受到伤害或下一回合结束",
		},
		trigger: { player: ["damageEnd", "phaseEnd"] },
		forced: true,
		popup: false,
		content() {
			player.removeSkill("mianzhen2");
		},
		mod: {
			cardEnabled2(card) {
				if (get.position(card) === "h") {
					return false;
				}
			},
		},
		ai: {
			threaten: 0.6,
		},
	},
	zhiyuan: {
		trigger: { source: "damageBefore" },
		check(event, player) {
			player.disableSkill("tmp", "zhiyuan");
			var eff = get.damageEffect(event.player, player, player);
			var att = get.attitude(player, event.player);
			var bool = false;
			if (att > 0) {
				if (eff <= 0 || event.player.hp < event.player.maxHp) {
					bool = true;
				}
			} else {
				if (eff < 0 && event.player.hp === event.player.maxHp) {
					bool = true;
				}
			}
			player.enableSkill("tmp", "zhiyuan");
			return bool;
		},
		logTarget: "player",
		filter(event, player) {
			return event.num > 0;
		},
		content() {
			trigger.cancel();
			trigger.player.recover(trigger.num);
		},
		ai: {
			effect: {
				player(card, player, target) {
					if (get.tag(card, "damage") && get.attitude(player, target) > 0) {
						if (target.hp === target.maxHp || get.recoverEffect(target, player, player) <= 0) {
							return "zeroplayertarget";
						}
						return [0, 0, 0, 1];
					}
				},
			},
		},
	},
	duwen: {
		trigger: { source: "damageBegin" },
		check(event, player) {
			return get.attitude(player, event.player) <= 0;
		},
		forced: true,
		filter(event, player) {
			return player.countCards("h") === event.player.countCards("h") && event.notLink();
		},
		content() {
			trigger.num++;
		},
		ai: {
			threaten: 1.5,
		},
	},
	duwen2: {
		trigger: { source: "damageEnd" },
		forced: true,
		filter(event, player) {
			return event.card && event.card.name === "sha" && player.hp === event.player.hp && event.notLink();
		},
		content() {
			player.draw(2);
		},
	},
	juji: {
		enable: "phaseUse",
		usable: 1,
		position: "he",
		filter(event, player) {
			return player.countCards("he") > 0;
		},
		filterCard(card) {
			var suit = get.suit(card);
			for (var i = 0; i < ui.selected.cards.length; i++) {
				if (get.suit(ui.selected.cards[i]) === suit) {
					return false;
				}
			}
			return true;
		},
		complexCard: true,
		filterTarget(card, player, target) {
			return target !== player && target.countCards("h") > 0;
		},
		check(card) {
			if (ui.selected.cards.length > 1) {
				return 0;
			}
			return 5 - get.value(card);
		},
		selectCard: [1, 4],
		content() {
			var suits = [];
			for (var i = 0; i < cards.length; i++) {
				suits.push(get.suit(cards[i]));
			}
			var success = false;
			for (var i = 0; i < suits.length; i++) {
				if (target.countCards("h", { suit: suits[i] })) {
					success = true;
					break;
				}
			}
			if (!success) {
				player.popup("失败");
			} else {
				player.popup("成功");
				player.addSkill("juji2");
				player.storage.juji2 = target;
				player.markSkillCharacter("juji2", target, "狙击", "与" + get.translation(target) + "的距离视为1且" + get.translation(target) + "不能闪避你的杀，直到回合结束");
			}
		},
		ai: {
			order: 4,
			result: {
				target(player, target) {
					if (!player.countCards("h", "sha")) {
						return 0;
					}
					if (target.countCards("h") <= 1 && get.distance(player, target, "attack") <= 1) {
						return 0;
					}
					var min = [];
					var num = 0;
					var players = game.filterPlayer();
					for (var i = 0; i < players.length; i++) {
						if (players[i] !== player && player.canUse("sha", players[i], false)) {
							var eff = get.effect(players[i], { name: "sha" }, player, player);
							if (eff > num) {
								min.length = 0;
								min.push(players[i]);
								num = eff;
							}
						}
					}
					for (var i = 0; i < min.length; i++) {
						if (get.attitude(player, min[i]) > 0) {
							return 0;
						}
						if (min[i].countCards("h") <= 1 && get.distance(player, min[i], "attack") <= 1) {
							return 0;
						}
					}
					if (min.includes(target)) {
						return -1;
					}
					return 0;
				},
			},
		},
	},
	juji2: {
		ai: {
			effect: {
				player(card, player, target) {
					if (card.name === "sha" && target === player.storage.juji2) {
						return [1, 0, 1, -1];
					}
				},
			},
		},
		trigger: { player: "phaseAfter" },
		forced: true,
		popup: false,
		content() {
			player.unmarkSkill("juji2");
			player.removeSkill("juji2");
			delete player.storage.juji2;
		},
		group: "juji3",
	},
	juji3: {
		trigger: { player: "shaBegin" },
		forced: true,
		filter(event, player) {
			return event.target === player.storage.juji2;
		},
		content() {
			trigger.directHit = true;
		},
		mod: {
			globalFrom(from, to) {
				if (to === from.storage.juji2) {
					return -Infinity;
				}
			},
		},
	},
	dulei: {
		enable: "phaseUse",
		filter(event, player) {
			return !player.hasSkill("dulei2");
		},
		filterCard: true,
		check(card) {
			return 6 - get.value(card);
		},
		discard: false,
		prepare(cards, player) {
			player.$give(1, player, false);
		},
		content() {
			player.storage.dulei = cards[0];
			player.addSkill("dulei2");
			player.syncStorage("dulei");
		},
		ai: {
			order: 1,
			result: {
				player: 1,
			},
		},
	},
	dulei2: {
		mark: true,
		trigger: { target: "useCardToBegin" },
		forced: true,
		filter(event, player) {
			return event.player !== player && get.suit(event.card) === get.suit(player.storage.dulei);
		},
		content() {
			"step 0";
			player.showCards([player.storage.dulei], get.translation(player) + "发动了【诡雷】");
			"step 1";
			player.storage.dulei.discard();
			delete player.storage.dulei;
			player.removeSkill("dulei2");
			game.addVideo("storage", player, ["dulei", null]);
			trigger.player.loseHp();
			"step 2";
			var he = trigger.player.getCards("he");
			if (he.length) {
				trigger.player.discard(he.randomGet());
			}
		},
		intro: {
			mark(dialog, content, player) {
				if (player === game.me || player.isUnderControl()) {
					dialog.add([player.storage.dulei]);
				} else {
					return "已发动诡雷";
				}
			},
			content(content, player) {
				if (player === game.me || player.isUnderControl()) {
					return get.translation(player.storage.dulei);
				}
				return "已发动诡雷";
			},
		},
	},
	bingqiang: {
		enable: "phaseUse",
		position: "he",
		filterCard(card) {
			var color = get.color(card);
			for (var i = 0; i < ui.selected.cards.length; i++) {
				if (get.color(ui.selected.cards[i]) !== color) {
					return false;
				}
			}
			return true;
		},
		selectCard: [1, Infinity],
		complexCard: true,
		filterTarget(card, player, target) {
			return !target.hasSkill("bingqiang2") && !target.hasSkill("bingqiang5") && !target.next.hasSkill("bingqiang2") && !target.next.hasSkill("bingqiang5") && !target.previous.hasSkill("bingqiang2") && !target.previous.hasSkill("bingqiang5");
		},
		check(card) {
			if (ui.selected.cards.length) {
				return 0;
			}
			var player = _status.event.player;
			var max = 0,
				min = 0,
				players = game.filterPlayer();
			for (var i = 0; i < players.length; i++) {
				if (!lib.skill.bingqiang.filterTarget(null, player, players[i])) {
					continue;
				}
				var num = lib.skill.bingqiang.ai.result.playerx(player, players[i]);
				if (num > max) {
					max = num;
				}
				if (num < min) {
					min = num;
				}
			}
			if (max === -min) {
				return 5 - get.value(card);
			} else if (max > -min) {
				if (get.color(card) === "red") {
					return 5 - get.value(card);
				}
			} else {
				if (get.color(card) === "black") {
					return 5 - get.value(card);
				}
			}
			return 0;
		},
		changeTarget(player, targets) {
			var target = targets[0];
			var add = game.filterPlayer(function (player) {
				return get.distance(target, player, "pure") === 1;
			});
			for (var i = 0; i < add.length; i++) {
				targets.add(add[i]);
			}
		},
		content() {
			if (get.color(cards[0]) === "red") {
				target.storage.bingqiang2 = cards.length;
				target.addSkill("bingqiang2");
			} else {
				target.storage.bingqiang5 = cards.length;
				target.addSkill("bingqiang5");
			}
			if (!player.storage.bingqiang) {
				player.storage.bingqiang = [];
			}
			player.storage.bingqiang.add(target);
		},
		ai: {
			order: 11,
			result: {
				playerx(player, target) {
					var targets = game.filterPlayer(function (player) {
						return player === target || get.distance(target, player, "pure") === 1;
					});
					var num = 0;
					for (var i = 0; i < targets.length; i++) {
						num += get.attitude(player, targets[i]);
					}
					return num;
				},
				player(player, target) {
					var num = lib.skill.bingqiang.ai.result.playerx(player, target);
					if (ui.selected.cards.length) {
						if (get.color(ui.selected.cards[0]) === "black") {
							return -num;
						} else {
							return num;
						}
					}
					return 0;
				},
			},
		},
		group: "bingqiang_remove",
	},
	bingqiang_remove: {
		trigger: { player: ["phaseBegin", "dieBegin"] },
		forced: true,
		popup: false,
		filter(event, player) {
			return player.storage.bingqiang && player.storage.bingqiang.length > 0;
		},
		content() {
			for (var i = 0; i < player.storage.bingqiang.length; i++) {
				player.storage.bingqiang[i].removeSkill("bingqiang2");
				player.storage.bingqiang[i].removeSkill("bingqiang5");
			}
			player.storage.bingqiang = [];
		},
	},
	bingqiang2: {
		mark: true,
		intro: {
			content: "防御距离+#",
		},
		mod: {
			globalTo(from, to, distance) {
				if (typeof to.storage.bingqiang2 === "number") {
					return distance + to.storage.bingqiang2;
				}
			},
		},
	},
	bingqiang3: {
		mark: true,
		intro: {
			content: "防御距离-#",
		},
		mod: {
			globalTo(from, to, distance) {
				if (typeof to.storage.bingqiang3 === "number") {
					return distance - to.storage.bingqiang3;
				}
			},
		},
	},
	bingqiang4: {
		mark: true,
		intro: {
			content: "进攻距离+#",
		},
		mod: {
			globalFrom(from, to, distance) {
				if (typeof from.storage.bingqiang4 === "number") {
					return distance - from.storage.bingqiang4;
				}
			},
		},
	},
	bingqiang5: {
		mark: true,
		intro: {
			content: "进攻距离-#",
		},
		mod: {
			globalFrom(from, to, distance) {
				if (typeof from.storage.bingqiang5 === "number") {
					return distance + from.storage.bingqiang5;
				}
			},
		},
	},
	jidong: {
		trigger: { global: "phaseEnd" },
		filter(event, player) {
			return player.hp === 1 && !player.isTurnedOver();
		},
		content() {
			"step 0";
			player.turnOver();
			player.recover(2);
			"step 1";
			if (player.isTurnedOver()) {
				player.addTempSkill("jidong2", { player: "turnOverAfter" });
			}
		},
		ai: {
			threaten(player, target) {
				if (target.hp === 1) {
					return 2;
				}
				return 1;
			},
		},
	},
	jidong2: {
		trigger: { player: "damageBefore" },
		forced: true,
		content() {
			trigger.cancel();
		},
		ai: {
			nofire: true,
			nothunder: true,
			nodamage: true,
			effect: {
				target(card, player, target, current) {
					if (get.tag(card, "damage")) {
						return [0, 0];
					}
				},
			},
		},
		mod: {
			targetEnabled(card, player, target) {
				if (player !== target) {
					return false;
				}
			},
		},
	},
	chongzhuang: {
		trigger: { source: "damageEnd" },
		forced: true,
		filter(event, player) {
			return player.storage.jijia <= 0 && event.num > 0;
		},
		popup: false,
		unique: true,
		content() {
			player.storage.jijia2 += trigger.num;
			if (player.storage.jijia2 >= 4) {
				player.storage.jijia = 4;
				player.storage.jijia2 = 0;
				player.markSkill("jijia");
				if (lib.config.skill_animation_type !== "off") {
					player.logSkill("chongzhuang");
					player.$skill("重装");
				}
			}
		},
	},
	tuijin: {
		enable: "phaseUse",
		usable: 1,
		unique: true,
		filter(event, player) {
			if (player.storage.jijia > 0) {
				return game.hasPlayer(function (current) {
					return get.distance(player, current) > 1;
				});
			}
			return false;
		},
		filterTarget(card, player, target) {
			return target !== player && get.distance(player, target) > 1;
		},
		content() {
			player.storage.tuijin2 = target;
			player.addTempSkill("tuijin2");
		},
		ai: {
			order: 11,
			result: {
				target(player, target) {
					if (get.attitude(player, target) < 0) {
						if (get.distance(player, target) > 2) {
							return -1.5;
						}
						return -1;
					}
					return 0.3;
				},
			},
		},
	},
	tuijin2: {
		mod: {
			globalFrom(from, to) {
				if (to === from.storage.tuijin2) {
					return -Infinity;
				}
			},
		},
		mark: "character",
		intro: {
			content: "与$的距离视为1直到回合结束",
		},
		onremove: true,
	},
	jijia: {
		mark: true,
		unique: true,
		init(player) {
			player.storage.jijia = 4;
			player.storage.jijia2 = 0;
		},
		intro: {
			content: "机甲体力值：#",
		},
		mod: {
			maxHandcard(player, num) {
				if (player.storage.jijia > 0) {
					return num + player.storage.jijia;
				}
			},
		},
		trigger: { player: "changeHp" },
		forced: true,
		popup: false,
		filter(event, player) {
			return player.storage.jijia > 0 && event.parent.name === "damage" && event.num < 0;
		},
		content() {
			player.hp -= trigger.num;
			player.update();
			player.storage.jijia += trigger.num;
			if (player.storage.jijia <= 0) {
				player.unmarkSkill("jijia");
			} else {
				player.updateMarks();
			}
		},
		ai: {
			threaten(player, target) {
				if (target.storage.jijia <= 0) {
					return 2;
				}
				return 1;
			},
		},
	},
	zihui: {
		enable: "phaseUse",
		filter(event, player) {
			return player.storage.jijia > 0;
		},
		filterTarget(card, player, target) {
			return target !== player && get.distance(player, target) <= 2;
		},
		unique: true,
		selectTarget: -1,
		skillAnimation: true,
		animationColor: "fire",
		line: "fire",
		content() {
			"step 0";
			var num = player.storage.jijia;
			target.chooseToDiscard(num, "he", "弃置" + get.cnNumber(num) + "张牌，或受到2点火焰伤害").ai = function (card) {
				if (target.hasSkillTag("nofire")) {
					return 0;
				}
				if (get.type(card) !== "basic") {
					return 11 - get.value(card);
				}
				if (target.hp > 4) {
					return 7 - get.value(card);
				}
				if (target.hp === 4 && num >= 3) {
					return 7 - get.value(card);
				}
				if (target.hp === 3 && num >= 4) {
					return 7 - get.value(card);
				}
				if (num > 1) {
					return 8 - get.value(card);
				}
				return 10 - get.value(card);
			};
			"step 1";
			if (!result.bool) {
				target.damage(2, "fire");
			}
			if (target === targets[targets.length - 1]) {
				player.storage.jijia = 0;
				player.unmarkSkill("jijia");
			}
		},
		ai: {
			order: 2,
			result: {
				player(player) {
					var num = 0;
					var players = game.filterPlayer();
					for (var i = 0; i < players.length; i++) {
						if (players[i] === player || players[i].hasSkillTag("nofire") || get.distance(player, players[i]) > 2) {
							continue;
						}
						var nh = players[i].countCards("h");
						var att = get.attitude(player, players[i]);
						if (nh < player.storage.jijia) {
							if (att < 0) {
								if (players[i].hp <= 2) {
									num += 2;
								} else {
									num += 1.5;
								}
							} else if (att > 0) {
								if (players[i].hp <= 2) {
									num -= 2;
								} else {
									num -= 1.5;
								}
							}
						} else if (nh === player.storage.jijia) {
							if (att < 0) {
								num += 0.5;
							} else if (att > 0) {
								num -= 0.5;
							}
						}
					}
					if (num >= 2) {
						return 1;
					}
					return 0;
				},
			},
		},
	},
	xiandan: {
		trigger: { player: "shaBegin" },
		direct: true,
		content() {
			"step 0";
			var dis =
				trigger.target.countCards("h", "shan") ||
				trigger.target.hasSkillTag(
					"freeShan",
					false,
					{
						player: player,
						card: trigger.card,
						type: "use",
					},
					true
				) ||
				trigger.target.countCards("h") > 2;
			var att = get.attitude(player, trigger.target);
			var next = player.chooseToDiscard(get.prompt("xiandan"));
			next.ai = function (card) {
				if (att) {
					return 0;
				}
				if (dis) {
					return 7 - get.value(card);
				}
				return 0;
			};
			next.logSkill = "xiandan";
			"step 1";
			if (result.bool) {
				if (get.color(result.cards[0]) === "red") {
					trigger.directHit = true;
				} else {
					player.addTempSkill("xiandan2", "shaAfter");
				}
			}
		},
	},
	xiandan2: {
		trigger: { source: "damageBegin" },
		filter(event) {
			return event.card && event.card.name === "sha" && event.notLink();
		},
		forced: true,
		popup: false,
		content() {
			trigger.num++;
		},
	},
	shouge: {
		trigger: { source: "dieAfter" },
		frequent: true,
		content() {
			player.gain(game.createCard("zhiliaobo"), "gain2");
		},
	},
	tuji: {
		mod: {
			globalFrom(from, to, distance) {
				if (_status.currentPhase === from) {
					return distance - from.countUsed();
				}
			},
		},
	},
	mujing: {
		enable: ["chooseToRespond", "chooseToUse"],
		filterCard(card) {
			return get.color(card) === "black";
		},
		position: "he",
		viewAs: { name: "sha" },
		viewAsFilter(player) {
			if (!player.countCards("he", { color: "black" })) {
				return false;
			}
		},
		prompt: "将一张黑色牌当杀使用或打出",
		check(card) {
			return 4 - get.value(card);
		},
		ai: {
			skillTagFilter(player) {
				if (!player.countCards("he", { color: "black" })) {
					return false;
				}
			},
			respondSha: true,
		},
		group: "mujing2",
	},
	mujing2: {
		trigger: { player: "shaMiss" },
		forced: true,
		popup: false,
		filter(event) {
			return !event.parent._mujinged;
		},
		content() {
			trigger.parent._mujinged = true;
			player.getStat().card.sha--;
		},
	},
	lichang: {
		trigger: { player: "phaseEnd" },
		direct: true,
		filter(event, player) {
			return player.countCards("he", { color: "red" }) > 0;
		},
		content() {
			"step 0";
			var next = player.chooseToDiscard(get.prompt("lichang"), "he", { color: "red" });
			next.logSkill = "lichang";
			next.ai = function (card) {
				return 6 - get.value(card);
			};
			"step 1";
			if (result.bool) {
				player.addSkill("lichang2");
			}
		},
	},
	lichang2: {
		trigger: { player: "phaseBegin" },
		direct: true,
		mark: true,
		intro: {
			content: "下个准备阶段令一名距离1以内的角色回复1点体力或摸两张牌",
		},
		content() {
			"step 0";
			player.chooseTarget(get.prompt("lichang"), function (card, player, target) {
				return get.distance(player, target) <= 1;
			}).ai = function (target) {
				var att = get.attitude(player, target);
				if (att > 0) {
					if (target.hp === 1 && target.maxHp > 1) {
						return att * 2;
					}
				}
				return att;
			};
			player.removeSkill("lichang2");
			"step 1";
			if (result.bool) {
				player.logSkill("lichang", result.targets);
				result.targets[0].chooseDrawRecover(2, true);
			}
		},
	},
	zhanlong: {
		trigger: { player: "phaseBegin" },
		unique: true,
		mark: true,
		limited: true,
		skillAnimation: true,
		init(player) {
			player.storage.zhanlong = false;
		},
		check(event, player) {
			if (player.hasJudge("lebu")) {
				return false;
			}
			return true;
		},
		filter(event, player) {
			if (player.storage.zhanlong) {
				return false;
			}
			if (player.countCards("he") === 0) {
				return false;
			}
			if (player.hp !== 1) {
				return false;
			}
			return true;
		},
		content() {
			"step 0";
			player.discard(player.getCards("he"));
			"step 1";
			player.addTempSkill("zhanlong2");
			player.awakenSkill(event.name);
			player.storage.zhanlong = true;
			var cards = [];
			for (var i = 0; i < 3; i++) {
				cards.push(game.createCard("sha"));
			}
			player.gain(cards, "gain2");
		},
		ai: {
			threaten(player, target) {
				if (target.hp === 1) {
					return 3;
				}
				return 1;
			},
			effect: {
				target(card, player, target) {
					if (!target.hasFriend()) {
						return;
					}
					if (get.tag(card, "damage") === 1 && target.hp === 2 && target.countCards("he") && !target.isTurnedOver() && _status.currentPhase !== target) {
						if (get.distance(_status.currentPhase, target, "absolute") <= 2) {
							return [0.5, 1];
						}
						return 0.8;
					}
				},
			},
		},
		intro: {
			content: "limited",
		},
	},
	zhanlong2: {
		mod: {
			cardUsable(card) {
				if (card.name === "sha") {
					return Infinity;
				}
			},
		},
	},
	feiren: {
		trigger: { source: "damageBegin" },
		forced: true,
		filter(event, player) {
			return event.card && event.card.name === "sha" && get.suit(event.card) === "spade" && event.notLink();
		},
		content() {
			trigger.num++;
		},
		mod: {
			targetInRange(card) {
				if (card.name === "sha") {
					return true;
				}
			},
			selectTarget(card, player, range) {
				if (card.name === "sha" && range[1] !== -1 && get.suit(card) === "club") {
					range[1]++;
				}
			},
		},
		ai: {
			threaten: 1.4,
		},
	},
	feiren3: {
		trigger: { player: "useCardAfter" },
		filter(event, player) {
			if (event.parent.name === "feiren2") {
				return false;
			}
			if (event.card.name !== "sha") {
				return false;
			}
			if (get.suit(event.card) !== "spade") {
				return false;
			}
			var card = game.createCard(event.card.name, event.card.suit, event.card.number, event.card.nature);
			for (var i = 0; i < event.targets.length; i++) {
				if (!event.targets[i].isIn()) {
					return false;
				}
				if (!player.canUse({ name: event.card.name }, event.targets[i], false, false)) {
					return false;
				}
			}
			return true;
		},
		content() {
			var card = game.createCard(trigger.card.name, trigger.card.suit, trigger.card.number, trigger.card.nature);
			player.useCard(card, trigger.targets);
		},
		ai: {
			threaten: 1.3,
		},
	},
	xie: {
		enable: "phaseUse",
		unique: true,
		filterTarget(card, player, target) {
			return target !== player && !target.hasSkill("xie2");
		},
		filter(event, player) {
			return player.countCards("h", { suit: "heart" });
		},
		filterCard: { suit: "heart" },
		check(card) {
			return 7 - get.value(card);
		},
		content() {
			var current = game.findPlayer(function (player) {
				return player.hasSkill("xie2");
			});
			if (current) {
				current.removeSkill("xie2");
			}
			target.addSkill("xie2");
			target.storage.xie = "now";
			target.storage.xie2 = player;
		},
		ai: {
			expose: 0.2,
			order: 9.1,
			threaten: 2,
			result: {
				target(player, target) {
					var current = game.findPlayer(function (player) {
						return player.hasSkill("xie2");
					});
					if (current && get.recoverEffect(current, player, player) > 0) {
						return 0;
					}
					return get.recoverEffect(target, player, target);
				},
			},
		},
	},
	xie2: {
		mark: true,
		trigger: { global: "phaseEnd" },
		forced: true,
		filter(event, player) {
			if (player.storage.xie === "now") {
				return event.player === player;
			}
			var num = game.phaseNumber - player.storage.xie;
			return num && num % 6 === 0;
		},
		content() {
			if (player.storage.xie === "now") {
				player.storage.xie = game.phaseNumber;
			}
			player.recover();
		},
		intro: {
			content(storage, player) {
				var str = "每隔六回合回复1点体力，直到" + get.translation(storage) + "死亡";
				if (typeof player.storage.xie === "number") {
					var num = game.phaseNumber - player.storage.xie;
					num = num % 6;
					if (num === 0) {
						str += "（下次生效于本回合）";
					} else {
						str += "（下次生效于" + (6 - num) + "回合后）";
					}
				}
				return str;
			},
			onunmark(storage, player) {
				delete player.storage.xie;
				delete player.storage.xie2;
			},
		},
		group: ["xie3", "xie4"],
	},
	xie3: {
		trigger: { global: "phaseBegin" },
		forced: true,
		popup: false,
		content() {
			var num = game.phaseNumber - player.storage.xie;
			num = num % 6;
			if (num) {
				num = 6 - num;
			}
			player.storage.xie2_markcount = num;
			player.updateMarks();
		},
	},
	xie4: {
		trigger: { global: "dieAfter" },
		forced: true,
		popup: false,
		filter(event, player) {
			return event.player === player.storage.xie2;
		},
		content() {
			game.log(player, "解除了", "【谐】");
			player.removeSkill("xie2");
		},
	},
	luan: {
		enable: "phaseUse",
		unique: true,
		filterTarget(card, player, target) {
			return target !== player && !target.hasSkill("luan2");
		},
		filter(event, player) {
			return player.countCards("h", { suit: "spade" });
		},
		filterCard: { suit: "spade" },
		check(card) {
			return 7 - get.value(card);
		},
		content() {
			var current = game.findPlayer(function (player) {
				return player.hasSkill("luan2");
			});
			if (current) {
				current.removeSkill("luan2");
			}
			target.addSkill("luan2");
			target.storage.luan2 = player;
		},
		ai: {
			expose: 0.2,
			order: 9.1,
			threaten: 2,
			result: {
				target(player, target) {
					var current = game.findPlayer(function (player) {
						return player.hasSkill("luan2");
					});
					if (current && get.attitude(player, current) < 0) {
						return 0;
					}
					if (target.hp === 1) {
						return 0.5;
					}
					return -1;
				},
			},
		},
	},
	luan2: {
		mark: true,
		intro: {
			content: "受到的伤害后失去1点体力，直到首次进入濒死状态",
		},
		trigger: { player: "damageEnd" },
		forced: true,
		content() {
			player.loseHp();
		},
		ai: {
			threaten: 1.2,
		},
		group: ["luan3", "luan4"],
	},
	luan3: {
		trigger: { player: "dyingAfter" },
		forced: true,
		popup: false,
		content() {
			game.log(player, "解除了", "【乱】");
			player.removeSkill("luan2");
		},
	},
	luan4: {
		trigger: { global: "dieAfter" },
		forced: true,
		popup: false,
		filter(event, player) {
			return event.player === player.storage.luan2;
		},
		content() {
			game.log(player, "解除了", "【乱】");
			player.removeSkill("luan2");
		},
	},
	sheng: {
		enable: "phaseUse",
		unique: true,
		mark: true,
		limited: true,
		skillAnimation: true,
		animationColor: "metal",
		init(player) {
			player.storage.sheng = false;
		},
		filter(event, player) {
			if (player.storage.sheng) {
				return false;
			}
			return true;
		},
		filterTarget(card, player, target) {
			return target.isDamaged();
		},
		selectTarget: [1, Infinity],
		contentBefore() {
			player.turnOver();
			player.addSkill("sheng2");
			player.awakenSkill(event.skill);
			player.storage.sheng = true;
		},
		content() {
			target.recover();
		},
		ai: {
			order: 1,
			result: {
				target(player, target) {
					var eff = get.recoverEffect(target, player, target);
					if (player.hp === 1) {
						return eff;
					}
					if (player.hasUnknown()) {
						return 0;
					}
					var num1 = 0,
						num2 = 0,
						num3 = 0,
						players = game.filterPlayer();
					for (var i = 0; i < players.length; i++) {
						if (get.attitude(player, players[i]) > 0) {
							num1++;
							if (players[i].isDamaged()) {
								num2++;
								if (players[i].hp <= 1) {
									num3++;
								}
							}
						}
					}
					if (num1 === num2) {
						return eff;
					}
					if (num2 === num1 - 1 && num3) {
						return eff;
					}
					if (num3 >= 2) {
						return eff;
					}
					return 0;
				},
			},
		},
		intro: {
			content: "limited",
		},
	},
	sheng2: {
		trigger: { player: "phaseBegin" },
		forced: true,
		popup: false,
		content() {
			player.removeSkill("sheng2");
		},
		mod: {
			targetEnabled(card, player, target) {
				if (player !== target) {
					return false;
				}
			},
		},
	},
	yihun: {
		trigger: { player: "phaseEnd" },
		direct: true,
		filter(event, player) {
			return player.countCards("he", { color: "black" }) > 0 && !player.hasSkill("yihun2");
		},
		content() {
			"step 0";
			var next = player.chooseCardTarget({
				prompt: get.prompt("yihun"),
				position: "he",
				filterCard(card, player) {
					return get.color(card) === "black" && lib.filter.cardDiscardable(card, player);
				},
				ai1(card) {
					return 7 - get.value(card);
				},
				ai2(target) {
					var att = -get.attitude(player, target);
					if (target === player.next) {
						att /= 10;
					}
					if (target === player.next.next) {
						att /= 2;
					}
					return att;
				},
				filterTarget(card, player, target) {
					return player !== target;
				},
			});
			"step 1";
			if (result.bool) {
				player.discard(result.cards);
				player.logSkill("yihun", result.targets);
				player.addSkill("yihun2");
				var target = result.targets[0];
				player.storage.yihun2 = target;
				if ((target && get.mode() !== "guozhan") || !target.isUnseen()) {
					player.markSkillCharacter("yihun2", target, "移魂", "在" + get.translation(target) + "的下一准备阶段视为对其使用一张杀");
				}
			}
		},
	},
	yihun2: {
		trigger: { global: ["phaseBegin", "dieAfter"] },
		forced: true,
		filter(event, player) {
			return event.player === player.storage.yihun2;
		},
		content() {
			if (player.storage.yihun2.isIn()) {
				player.useCard({ name: "sha" }, player.storage.yihun2);
			}
			player.removeSkill("yihun2");
			delete player.storage.yihun2;
		},
		mod: {
			targetEnabled() {
				return false;
			},
			cardEnabled(card, player) {
				return false;
			},
		},
	},
	huoyu: {
		enable: "phaseUse",
		unique: true,
		mark: true,
		limited: true,
		skillAnimation: true,
		animationColor: "fire",
		init(player) {
			player.storage.huoyu = false;
		},
		filter(event, player) {
			if (player.storage.huoyu) {
				return false;
			}
			if (player.countCards("he", { color: "red" }) < 2) {
				return false;
			}
			return true;
		},
		filterTarget(card, player, target) {
			return player.canUse("chiyuxi", target);
		},
		filterCard: { color: "red" },
		selectCard: 2,
		position: "he",
		check(card) {
			return 7 - get.value(card);
		},
		selectTarget: -1,
		multitarget: true,
		multiline: true,
		line: "fire",
		content() {
			"step 0";
			targets.sort(lib.sort.seat);
			player.awakenSkill(event.name);
			player.storage.huoyu = true;
			player.useCard({ name: "chiyuxi" }, targets).animate = false;
			"step 1";
			player.useCard({ name: "chiyuxi" }, targets).animate = false;
		},
		ai: {
			order: 5,
			result: {
				target(player, target) {
					if (player.hasUnknown()) {
						return 0;
					}
					return get.effect(target, { name: "chiyuxi" }, player, target);
				},
			},
		},
		intro: {
			content: "limited",
		},
	},
	feidan: {
		trigger: { source: "damageAfter" },
		direct: true,
		filter(event, player) {
			if (player.countCards("he") === 0) {
				return false;
			}
			if (!event.card) {
				return false;
			}
			if (event.card.name !== "sha") {
				return false;
			}
			return game.hasPlayer(function (current) {
				return current !== event.player && get.distance(event.player, current) <= 1;
			});
		},
		content() {
			"step 0";
			var eff = 0;
			var targets = game.filterPlayer(function (current) {
				if (current !== trigger.player && get.distance(trigger.player, current) <= 1) {
					eff += get.damageEffect(current, player, player);
					return true;
				}
			});
			event.targets = targets;
			player
				.chooseToDiscard(get.prompt("feidan", targets))
				.set("ai", function (card) {
					if (eff > 0) {
						return 7 - get.value(card);
					}
					return 0;
				})
				.set("logSkill", ["feidan", targets]);
			"step 1";
			if (result.bool) {
				event.targets.sort(lib.sort.seat);
			} else {
				event.finish();
			}
			"step 2";
			if (event.targets.length) {
				event.targets.shift().damage();
				event.redo();
			}
		},
		mod: {
			targetInRange(card, player, target) {
				if (card.name === "sha") {
					if (get.distance(player, target) <= 1) {
						return false;
					}
					return true;
				}
			},
		},
	},
	yuedong: {
		trigger: { player: "phaseUseEnd" },
		direct: true,
		content() {
			"step 0";
			var num = 1 + player.storage.yuedong_num;
			player
				.chooseTarget(get.prompt("yuedong"), [1, num], function (card, player, target) {
					if (player.storage.yuedong_recover) {
						return target.hp < target.maxHp;
					}
					return true;
				})
				.set("ai", function (target) {
					if (player.storage.yuedong_recover) {
						return get.recoverEffect(target, player, player);
					}
					var att = get.attitude(player, target) / Math.sqrt(2 + target.countCards("h"));
					if (player === target) {
						var num2 = player.needsToDiscard(num);
						if (num2 > 1) {
							return att / 5;
						}
						if (num2 === 1) {
							if (num > 1) {
								return att / 3;
							}
							return att / 4;
						}
						return att * 1.1;
					}
					return att;
				});
			"step 1";
			if (result.bool) {
				player.logSkill("yuedong", result.targets);
				var eff = 1 + player.storage.yuedong_eff;
				if (player.storage.yuedong_recover) {
					result.targets.sort(lib.sort.seat);
					for (var i = 0; i < result.targets.length; i++) {
						result.targets[i].recover(eff);
					}
				} else {
					game.asyncDraw(result.targets, eff);
				}
			}
		},
		ai: {
			expose: 0.2,
			threaten: 1.6,
		},
	},
	huhuan: {
		enable: "phaseUse",
		filterCard: true,
		selectCard: 2,
		position: "he",
		filter(event, player) {
			return player.countCards("he") > 1 && !player.storage.yuedong_recover;
		},
		check(card) {
			return 6 - get.value(card);
		},
		content() {
			player.storage.yuedong_recover = true;
		},
		ai: {
			order: 10.2,
			result: {
				player(player) {
					var num1 = 0,
						num2 = 0,
						players = game.filterPlayer();
					for (var i = 0; i < players.length; i++) {
						if (get.attitude(player, players[i]) > 0) {
							num2++;
							if (players[i].hp <= 2 && players[i].maxHp > 2) {
								num1++;
								if (players[i].hp === 1) {
									num1++;
								}
							}
						}
					}
					if (num1 >= 3) {
						return 1;
					}
					return 0;
				},
			},
		},
	},
	kuoyin: {
		enable: "phaseUse",
		filterCard: true,
		selectCard() {
			if (_status.event.player.storage.yuedong_eff) {
				return 1;
			}
			if (_status.event.player.storage.yuedong_num) {
				return 2;
			}
			return [1, 2];
		},
		position: "he",
		filter(event, player) {
			if (player.storage.yuedong_eff && player.storage.yuedong_num) {
				return false;
			}
			return player.countCards("he") > 0;
		},
		check(card) {
			var player = _status.event.player;
			var num1 = 0,
				num2 = 0,
				players = game.filterPlayer();
			for (var i = 0; i < players.length; i++) {
				if (get.attitude(player, players[i]) > 0) {
					num2++;
					if (players[i].hp <= 2 && players[i].maxHp > 2) {
						num1++;
					}
				}
			}
			if (player.storage.yuedong_recover) {
				if (num1 > 1 && !player.storage.yuedong_num) {
					if (ui.selected.cards.length) {
						return 0;
					}
					return 7 - get.value(card);
				}
				return 0;
			} else {
				if (num2 > 1 && !player.storage.yuedong_num) {
					if (ui.selected.cards.length) {
						return 0;
					}
					return 7 - get.value(card);
				}
				if (num2 > 2) {
					return 6 - get.value(card);
				}
				return 5 - get.value(card);
			}
		},
		content() {
			if (cards.length === 1) {
				player.storage.yuedong_num += 2;
			} else {
				player.storage.yuedong_eff++;
			}
		},
		ai: {
			threaten: 1.6,
			order: 10.1,
			result: {
				player: 1,
			},
		},
		group: "kuoyin2",
	},
	kuoyin2: {
		trigger: { player: "phaseBegin" },
		silent: true,
		content() {
			player.storage.yuedong_recover = false;
			player.storage.yuedong_num = 0;
			player.storage.yuedong_eff = 0;
		},
	},
	guangshu: {
		enable: "phaseUse",
		check(card) {
			var player = _status.event.player;
			var suit = get.suit(card);
			if (suit === "heart") {
				if (
					game.hasPlayer(function (current) {
						return current.hp === 1 && get.attitude(player, current) > 0;
					})
				) {
					// /-???
				}
			} else if (suit === "spade") {
				return 7 - get.value(card);
			}
			return 6 - get.value(card);
		},
		filter(event, player) {
			return player.countCards("he") > 0;
		},
		filterTarget(card, player, target) {
			return !target.hasSkill("guangshu_heart") && !target.hasSkill("guangshu_spade") && !target.hasSkill("guangshu_club") && !target.hasSkill("guangshu_diamond");
		},
		filterCard: true,
		position: "he",
		content() {
			target.addSkill("guangshu_" + get.suit(cards[0]));
		},
		ai: {
			expose: 0.2,
			threaten: 1.6,
			order: 5,
			result: {
				target(player, target) {
					if (!ui.selected.cards.length) {
						return 0;
					}
					switch (get.suit(ui.selected.cards[0])) {
						case "heart":
							if (target.hp === 1) {
								return 1;
							}
							return 0.1;
						case "diamond":
							return 1 + Math.sqrt(target.countCards("h"));
						case "club":
							return -target.countCards("h") - Math.sqrt(target.countCards("h", "sha"));
						case "spade":
							return get.damageEffect(target, player, target, "thunder");
						default:
							return 0;
					}
				},
			},
		},
	},
	guangshu_diamond: {
		mark: true,
		intro: {
			content: "下次造成伤害时摸两张牌",
		},
		trigger: { source: "damageEnd" },
		forced: true,
		content() {
			player.draw(2);
			player.removeSkill("guangshu_diamond");
		},
	},
	guangshu_heart: {
		mark: true,
		intro: {
			content: "下次受到伤害时回复1点体力",
		},
		trigger: { player: "damageEnd" },
		priority: 6,
		forced: true,
		content() {
			player.recover();
			player.removeSkill("guangshu_heart");
		},
	},
	guangshu_club: {
		mark: true,
		intro: {
			content: "无法使用杀直到下一回合结束",
		},
		trigger: { player: "phaseEnd" },
		forced: true,
		popup: false,
		content() {
			player.removeSkill("guangshu_club");
		},
		mod: {
			cardEnabled(card) {
				if (card.name === "sha") {
					return false;
				}
			},
		},
	},
	guangshu_spade: {
		mark: true,
		intro: {
			content: "下个结束阶段受到1点无来源的雷电伤害",
		},
		trigger: { player: "phaseEnd" },
		forced: true,
		content() {
			player.damage("thunder", "nosource");
			player.removeSkill("guangshu_spade");
		},
	},
	ziyu: {
		trigger: { global: "phaseEnd" },
		direct: true,
		filter(event, player) {
			return game.phaseNumber % 4 === 0;
		},
		content() {
			player.chooseDrawRecover(get.prompt("ziyu")).logSkill = "ziyu";
		},
	},
	shouhu: {
		mod: {
			cardEnabled(card) {
				if (card.name === "sha") {
					return false;
				}
			},
		},
		enable: "phaseUse",
		filter(event, player) {
			return player.countCards("h", "sha") > 0;
		},
		filterTarget(card, player, target) {
			return target.hp < target.maxHp && target !== player;
		},
		content() {
			target.recover();
		},
		filterCard: { name: "sha" },
		ai: {
			order: 7,
			threaten: 2,
			result: {
				target(player, target) {
					return get.recoverEffect(target, player, target);
				},
			},
		},
	},
	shanxian: {
		trigger: { global: "phaseBefore" },
		filter(event, player) {
			return event.player !== player && !player.isTurnedOver() && !player.storage.shanxian;
		},
		check(event, player) {
			return get.attitude(player, event.player) < 0 && ((player.countCards("h") > player.hp && player.countCards("h", "lebu") === 0) || get.distance(player, event.player) > 1);
		},
		intro: {
			content(storage, player) {
				var str = "";
				if (player.storage.shanxian_h.length) {
					if (player.isUnderControl(true)) {
						str += "手牌区：" + get.translation(player.storage.shanxian_h);
					} else {
						str += "手牌区：" + player.storage.shanxian_h.length + "张牌";
					}
				}
				if (player.storage.shanxian_e.length) {
					if (str.length) {
						str += "、";
					}
					if (player.isUnderControl(true)) {
						str += "装备区：" + get.translation(player.storage.shanxian_e);
					} else {
						str += "装备区：" + player.storage.shanxian_e.length + "张牌";
					}
				}
				return str;
			},
			mark(dialog, content, player) {
				if (player.storage.shanxian_h.length) {
					if (player.isUnderControl(true)) {
						dialog.add('<div class="text center">手牌区</div>');
						dialog.addSmall(player.storage.shanxian_h);
					} else {
						dialog.add('<div class="text center">手牌区：' + player.storage.shanxian_h.length + "张牌</div>");
					}
				}
				if (player.storage.shanxian_e.length) {
					if (player.isUnderControl(true)) {
						dialog.add('<div class="text center">装备区</div>');
						dialog.addSmall(player.storage.shanxian_e);
					} else {
						dialog.add('<div class="text center">装备区：' + player.storage.shanxian_e.length + "张牌</div>");
					}
				}
			},
		},
		logTarget: "player",
		content() {
			"step 0";
			player.draw(false);
			player.$draw();
			"step 1";
			player.storage.shanxian_h = player.getCards("h");
			player.storage.shanxian_e = player.getCards("e");
			player.storage.shanxian_n = 1;
			player.syncStorage("shanxian_e");
			player.phase("shanxian");
			player.storage.shanxian = trigger.player;
			player.removeSkill("shanxian2");
			player.markSkill("shanxian");
			"step 2";
			player.turnOver(true);
			delete player.storage.shanxian;
		},
		mod: {
			targetInRange(card, player, target, now) {
				if (target === player.storage.shanxian) {
					return true;
				}
			},
		},
		ai: {
			expose: 0.1,
		},
	},
	shanxian2: {
		trigger: { player: ["gainBegin", "loseBegin"] },
		forced: true,
		popup: false,
		content() {
			player.removeSkill("shanxian2");
		},
	},
	shanhui: {
		unique: true,
		trigger: { player: "damageEnd", source: "damageEnd" },
		filter(event, player) {
			return player.storage.shanxian_h && player.storage.shanxian_e && player.storage.shanxian_n > 0 && !player.hasSkill("shanxian2");
		},
		check(event, player) {
			var n1 = player.countCards("he");
			var n2 = player.storage.shanxian_h.length + player.storage.shanxian_e.length;
			if (n1 < n2) {
				return true;
			}
			if (player.hp === player.maxHp) {
				return false;
			}
			if (n1 === n2 + 1) {
				return true;
			}
			if (n2 === n2 + 2 && player.hp <= 1) {
				return true;
			}
			return false;
		},
		video(player) {
			var cards = player.getCards("he");
			for (var i = 0; i < cards.length; i++) {
				cards[i].remove();
			}
			for (var i = 0; i < player.storage.shanxian_e.length; i++) {
				player.$equip(player.storage.shanxian_e[i]);
			}
		},
		content() {
			game.addVideo("skill", player, "shanhui");
			for (var i = 0; i < player.storage.shanxian_h.length; i++) {
				if (get.position(player.storage.shanxian_h[i]) === "s") {
					player.storage.shanxian_h[i] = game.createCard(player.storage.shanxian_h[i]);
				}
			}
			for (var i = 0; i < player.storage.shanxian_e.length; i++) {
				if (get.position(player.storage.shanxian_e[i]) === "s") {
					player.storage.shanxian_e[i] = game.createCard(player.storage.shanxian_e[i]);
				}
			}
			player.removeEquipTrigger();
			var cards = player.getCards("he");
			for (var i = 0; i < cards.length; i++) {
				cards[i].discard();
			}
			player.directgain(player.storage.shanxian_h);
			for (var i = 0; i < player.storage.shanxian_e.length; i++) {
				player.$equip(player.storage.shanxian_e[i]);
			}
			if (cards.length > player.storage.shanxian_h.length + player.storage.shanxian_e.length) {
				player.recover();
			}
			player.storage.shanxian_n--;
			if (player.storage.shanxian_n <= 0) {
				delete player.storage.shanxian_h;
				delete player.storage.shanxian_e;
				delete player.storage.shanxian_n;
				player.unmarkSkill("shanxian");
			} else {
				player.addSkill("shanxian2");
			}
		},
	},
};

export default skill;
