import { lib, game, ui, get, ai, _status } from "../noname.js";
game.import("character", function () {
	return {
		name: "mtg",
		character: {
			mtg_jiding: ["male", "qun", 4, ["mbaizhan", "msilian"]],
			mtg_jiesi: ["male", "wei", 3, ["mtongnian", "msuoling", "mhuanyi"]],
			mtg_lilianna: ["female", "qun", 3, ["lingyong", "mduohun"]],
		},
		characterIntro: {
			mtg_jiding:
				"这名白色魔法的使用者极其注重忠诚，正义和荣誉。他曾全力追捕茜卓纳拉，如今已不可思议地与这位火焰法师成为伙伴。",
			mtg_jiesi:
				"杰斯贝连是使用蓝色法术的鹏洛客。他擅长心灵法术：读取心灵，幻影，知识，以及欺瞒的咒语。",
			mtg_lilianna:
				"莉莲娜维斯是一位精通死灵术的旅法师，她擅长用黑色法术力来复活死者，腐化生者，并从死亡中召唤力量。",
		},
		skill: {
			mduohun: {
				trigger: { player: "dyingAfter" },
				forced: true,
				filter: function (event, player) {
					return event.source && event.source.isIn() && event.source.hp > 0;
				},
				logTarget: "source",
				content: function () {
					trigger.source.loseHp();
				},
				ai: {
					threaten: function (player, target) {
						if (target.hp == 1) return 0.6;
						return 1;
					},
					effect: {
						target: function (card, player, target, current) {
							if (!target.hasFriend()) return;
							if (target.hp <= 1 && get.tag(card, "damage")) return [1, 0, 0, -1];
						},
					},
				},
			},
			lingyong: {
				enable: "phaseUse",
				filter: function (event, player) {
					return !player.hasSkill("subplayer") && player.getSubPlayers("lingyong_get").length > 0;
				},
				nosub: true,
				group: "lingyong_get",
				direct: true,
				delay: 0,
				skillAnimation: true,
				animationColor: "thunder",
				content: function () {
					player.callSubPlayer().set("tag", "lingyong_get");
				},
				ai: {
					order: 1,
					result: {
						player: function (player, target) {
							return 1;
							// if(player.hp<=1) return 1;
							// if(!player.needsToDiscard(player.hp-1)) return 1;
							// return 0;
						},
					},
				},
				subSkill: {
					get: {
						trigger: { global: "dieAfter" },
						forced: true,
						filter: function (event, player) {
							return (
								!event.player.isMin() &&
								![player.name, player.name1, player.name2].includes(event.player.name)
							);
						},
						content: function () {
							var skills = lib.character[trigger.player.name][3].slice(0);
							for (var i = 0; i < skills.length; i++) {
								if (lib.skill[skills[i]].nosub) {
									skills.splice(i--, 1);
								}
							}
							player.addSubPlayer({
								name: trigger.player.name,
								skills: skills,
								hs: get.cards(2),
								intro: "出牌阶段，你可以调遣此随从（直到随从死亡不可再次切换）",
							});
						},
					},
				},
			},
			mhuanyi: {
				round: 2,
				trigger: { player: "phaseEnd" },
				direct: true,
				addintro: function (storage, player) {
					if (player.hasSkill("mhuanyi_target")) {
						return "直到下一回合开始，当成为某类型的卡牌的惟一目标时，将目标转移给某名其他角色；";
					}
					return "";
				},
				content: function () {
					"step 0";
					var rand = Math.random();
					player
						.chooseTarget(get.prompt2("mhuanyi"), function (card, player, target) {
							return target != player;
						})
						.set("ai", function (target) {
							if (get.attitude(player, target) < 0) {
								return rand;
							}
							return 0;
						});
					"step 1";
					if (result.bool) {
						event.target = result.targets[0];
						if (player.isUnderControl(true)) {
							player.line(event.target, "green");
						}
						player
							.chooseControl("基本牌", "非基本牌", "cancel2", function () {
								return Math.floor(Math.random() * 2);
							})
							.set("prompt", "选择一种卡牌类型");
					} else {
						event.finish();
					}
					"step 2";
					if (result.control && result.control != "cancel2") {
						player.logSkill("mhuanyi");
						player.storage.mhuanyi_target = [event.target, result.index];
						player.addTempSkill("mhuanyi_target", { player: "phaseBegin" });
					}
				},
				subSkill: {
					target: {
						trigger: { target: "useCardToBefore" },
						priority: 6,
						forced: true,
						onremove: true,
						group: "mhuanyi_die",
						filter: function (event, player) {
							if (!player.storage.mhuanyi_target) return false;
							if (event.player == player.storage.mhuanyi_target[0]) return false;
							if (get.type(event.card) == "basic") {
								if (player.storage.mhuanyi_target[1] != 0) return false;
							} else {
								if (player.storage.mhuanyi_target[1] != 1) return false;
							}
							if (
								!lib.filter.targetEnabled2(
									event.card,
									event.player,
									player.storage.mhuanyi_target[0]
								)
							) {
								return false;
							}
							return true;
						},
						logTarget: function (event, player) {
							return player.storage.mhuanyi_target[0];
						},
						content: function () {
							trigger.target = player.storage.mhuanyi_target[0];
							player.removeSkill("mhuanyi_target");
						},
					},
					die: {
						trigger: { global: "dieAfter" },
						silent: true,
						filter: function (event, player) {
							if (!player.storage.mhuanyi_target) return false;
							return event.player == player.storage.mhuanyi_target[0];
						},
						content: function () {
							player.removeSkill("mhuanyi_target");
						},
					},
				},
			},
			msuoling: {
				trigger: { global: "useCard" },
				direct: true,
				priority: 5.5,
				round: 1,
				filter: function (event, player) {
					if (get.type(event.card) == "trick" && event.card.isCard) {
						if (event.player == player) return false;
						if (!player.countCards("he", { suit: get.suit(event.card) })) return false;
						return true;
					}
					return false;
				},
				content: function () {
					"step 0";
					var att = get.attitude(player, trigger.player);
					var suit = get.suit(trigger.card);
					player
						.chooseToDiscard("he", get.prompt2("msuoling", trigger.player), function (card) {
							return get.suit(card) == suit;
						})
						.set("autodelay", true)
						.set("logSkill", ["msuoling", trigger.player]).ai = function (card) {
						if (att < 0) {
							return 8 - get.value(card);
						}
						return 0;
					};
					"step 1";
					if (result.bool) {
						trigger.cancel();
						player.chooseUseTarget(true, trigger.card);
					}
				},
			},
			mtongnian: {
				trigger: { player: "phaseUseBegin" },
				forced: true,
				filter: function (event, player) {
					var enemies = player.getEnemies();
					for (var i = 0; i < enemies.length; i++) {
						if (enemies[i].countCards("h")) return true;
					}
					return false;
				},
				getList: function (player) {
					var list = [];
					var enemies = player.getEnemies();
					for (var i = 0; i < enemies.length; i++) {
						list.addArray(enemies[i].getCards("h"));
					}
					return list;
				},
				content: function () {
					var list = lib.skill.mtongnian.getList(player);
					if (list.length) {
						var card = list.randomGet();
						var fake = game.createCard(card);
						fake.mtongnian_link = card;
						player.gain(fake, "draw")._triggered = null;
						fake.classList.add("glow");
						fake._destroy = "mtongnian";
					}
				},
				group: ["mtongnian_change", "mtongnian_use", "mtongnian_lose"],
				subSkill: {
					change: {
						trigger: { player: "useCard" },
						silent: true,
						filter: function (event, player) {
							return player.hasCard(function (card) {
								return card.mtongnian_link ? true : false;
							}, "h");
						},
						content: function () {
							var list = lib.skill.mtongnian.getList(player);
							var hs = player.getCards("h", function (card) {
								return card.mtongnian_link ? true : false;
							});
							for (var i = 0; i < hs.length; i++) {
								var current = hs[i].mtongnian_link;
								hs[i].mtongnian_link = list.randomGet(current);
								if (!hs[i].mtongnian_link) {
									hs[i].mtongnian_link = current;
								}
								hs[i].init(hs[i].mtongnian_link);
							}
						},
					},
					use: {
						trigger: { player: "useCardBefore" },
						silent: true,
						filter: function (event, player) {
							return event.card.mtongnian_link ? true : false;
						},
						content: function () {
							var link = trigger.card.mtongnian_link;
							var target = get.owner(link);
							if (target && target != player) {
								trigger.cards.add(trigger.card);
								player.lose(trigger.cards, ui.discardPile);
								trigger.card = link;
								trigger.cards.length = 0;
								trigger.cards.push(link);
								target.lose(link, ui.discardPile);
								player.logSkill("mtongnian", target);
								game.log(target, "失去了", link);
								game.delayx();
							} else {
								player.lose(trigger.card);
								trigger.cancel();
							}
						},
					},
					lose: {
						trigger: { player: "phaseUseEnd", global: "loseEnd" },
						silent: true,
						filter: function (event, player) {
							if (event.name == "lose") {
								return lib.skill.mtongnian.getList(player).length == 0;
							}
							return true;
						},
						content: function () {
							var hs = player.getCards("h", function (card) {
								return card.mtongnian_link ? true : false;
							});
							if (hs.length) {
								player.lose(hs)._triggered = null;
							}
						},
					},
				},
				ai: {
					threaten: 1.3,
				},
			},
			mbaizhan: {
				trigger: { source: "damageEnd" },
				forced: true,
				filter: function (event) {
					return event.num > 0;
				},
				content: function () {
					player.changeHujia(trigger.num);
				},
				ai: {
					damageBonus: true,
				},
			},
			msilian: {
				trigger: { player: "phaseEnd" },
				filter: function (event, player) {
					return player.hujia > 0;
				},
				check: function (event, player) {
					return player.hujia > 1 && player.hp > 1;
				},
				content: function () {
					player.storage.msilian = player.hujia;
					player.changeHujia(-player.hujia);
					player.insertPhase();
				},
				group: ["msilian_hp", "msilian_draw"],
				subSkill: {
					hp: {
						trigger: { player: "phaseAfter" },
						silent: true,
						filter: function (event, player) {
							return event.skill == "msilian" && !player.getStat("damage");
						},
						content: function () {
							player.loseHp();
						},
					},
					draw: {
						trigger: { player: "phaseDrawBegin" },
						filter: function (event) {
							return event.getParent("phase").skill == "msilian";
						},
						silent: true,
						content: function () {
							trigger.num += player.storage.msilian - 2;
						},
					},
				},
			},
		},
		translate: {
			mtg_jiding: "基定",
			mtg_jiesi: "杰斯",
			mtg_lilianna: "莉莲娜",

			mduohun: "夺魂",
			mduohun_info: "锁定技，当你解除濒死状态后，令你进入濒死状态的角色失去1点体力。",
			lingyong: "灵俑",
			lingyong2: "灵俑",
			lingyong3: "灵俑",
			lingyong3_bg: "俑",
			lingyong_info:
				"锁定技，每当一名其他角色死亡，你获得一个与该角色同名且体力上限为1、初始手牌为2的随从；出牌阶段，你可以调遣以此法获得的随从（直到随从死亡不可再次切换）。",
			mbaizhan: "百战",
			mbaizhan_info: "锁定技，每当你造成1点伤害，你获得1点护甲。",
			msilian: "祀炼",
			msilian_info:
				"结束阶段，若你有护甲，你可以移去全部护甲，然后进行一个额外回合；在额外回合中，你的摸牌阶段摸牌基数为你移去的护甲数；额外回合结束后，若你未造成伤害，你失去1点体力。",
			mtongnian: "通念",
			mtongnian_info:
				"锁定技，出牌阶段开始时，你获得一张替身牌，此牌对应一名随机敌人的一张随机手牌；每当你使用一张非替身牌，随机更换替身牌对应的牌；当你使用替身牌时，改为使用替身牌对应的牌；当出牌阶段结束，或替身牌离开手牌区，或敌方角色没有手牌时，销毁替身牌。",
			msuoling: "塑灵",
			msuoling_info:
				"每轮限一次，当一名其他角色使用一张非转化的普通锦囊牌时，你可以弃置一张与之花色相同的牌取消之，然后你视为使用该锦囊牌。",
			mhuanyi: "幻逸",
			mhuanyi_info:
				"每两轮限一次，结束阶段，你可以选择一名其他角色和一种卡牌类型（选择结果对其他角色不可见），直到下一回合开始，当你首次成为该类型卡牌的惟一目标时，你将目标转移给你指定的角色（目标须合法）。",
		},
	};
});
