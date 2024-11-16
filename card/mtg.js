import { lib, game, ui, get, ai, _status } from "../noname.js";
game.import("card", function () {
	return {
		name: "mtg",
		card: {
			mtg_lindixiliu: {
				type: "land",
				fullborder: "wood",
				enable: function (card, player) {
					return !player.hasSkill("land_used");
				},
				notarget: true,
				content: function () {
					"step 0";
					game.changeLand("mtg_lindixiliu", player);
					var card = get.cardPile2(function (card) {
						return get.suit(card) == "heart";
					});
					if (card) {
						player.gain(card, "draw");
					}
					"step 1";
					player
						.chooseToDiscard("he", [1, Infinity], { suit: "heart" }, "林地溪流")
						.set("ai", function (card) {
							return 8 - get.value(card);
						})
						.set(
							"prompt2",
							"弃置任意张红桃牌，每弃置一张牌，将一张延时锦囊牌置入一名随机敌方角色的判定区"
						);
					"step 2";
					if (result.bool) {
						event.num = result.cards.length;
						event.targets = player.getEnemies();
					}
					"step 3";
					if (event.num && event.targets && event.targets.length) {
						var target = event.targets.randomGet();
						var list = get.inpile("delay");
						for (var i = 0; i < list.length; i++) {
							if (target.hasJudge(list[i])) {
								list.splice(i--, 1);
							}
						}
						if (list.length) {
							player.line(target);
							var card = game.createCard(list.randomGet());
							target.addJudge(card);
							target.$draw(card);
							game.delay();
							event.num--;
						} else {
							event.targets.remove(target);
						}
						event.redo();
					}
				},
				ai: {
					value: 6,
					useful: 3,
					order: 7,
					result: {
						player: 1,
					},
				},
			},
			mtg_longlushanfeng: {
				type: "land",
				fullborder: "wood",
				enable: function (card, player) {
					return !player.hasSkill("land_used");
				},
				notarget: true,
				content: function () {
					"step 0";
					game.changeLand("mtg_longlushanfeng", player);
					player
						.chooseControl("获得杀", "获得闪")
						.set("prompt", "选择一项")
						.set("ai", function () {
							var player = _status.event.player;
							if (player.hasShan()) return 0;
							return 1;
						});
					"step 1";
					if (result.control == "获得杀") {
						player.gain(game.createCard("sha"), "gain2");
					} else {
						player.gain(game.createCard("shan"), "gain2");
					}
				},
				ai: {
					value: 5,
					useful: 3,
					order: 4,
					result: {
						player: 1,
					},
				},
			},
			mtg_cangbaohaiwan: {
				type: "land",
				fullborder: "wood",
				enable: function (card, player) {
					if (!lib.cardPack.mode_derivation || !lib.cardPack.mode_derivation.length) return false;
					return !player.hasSkill("land_used");
				},
				notarget: true,
				content: function () {
					"step 0";
					game.changeLand("mtg_cangbaohaiwan", player);
					event.map = {};
					var pack1 = [];
					var pack2 = [];
					for (var i = 0; i < lib.cardPack.mode_derivation.length; i++) {
						var name = lib.cardPack.mode_derivation[i];
						var info = lib.card[name];
						if (info.gainable == false || info.destroy) continue;
						if (info.derivationpack) {
							var trans = lib.translate[info.derivationpack + "_card_config"] + "（卡牌包）";
							if (!event.map[trans]) {
								event.map[trans] = [];
								pack2.push(trans);
							}
							event.map[trans].push(name);
						} else if (typeof info.derivation == "string") {
							for (var j in lib.characterPack) {
								if (lib.characterPack[j][info.derivation]) {
									var trans = lib.translate[j + "_character_config"] + "（武将包）";
									if (!event.map[trans]) {
										event.map[trans] = [];
										pack1.push(trans);
									}
									event.map[trans].push(name);
									break;
								}
							}
						}
					}
					if (!pack1.length && !pack2.length) {
						event.finish();
						return;
					}
					player
						.chooseControl(pack1.concat(pack2), "dialogcontrol", function () {
							return _status.event.controls.randomGet("轩辕剑（卡牌包）");
						})
						.set("prompt", "选择一个扩展包获得其中一张衍生牌");
					"step 1";
					if (result.control && event.map[result.control]) {
						player.gain(game.createCard(event.map[result.control].randomGet()), "draw");
					}
				},
				ai: {
					value: 7,
					useful: 3,
					order: 9,
					result: {
						player: 1,
					},
				},
			},
			mtg_linzhongjianta: {
				type: "land",
				fullborder: "wood",
				enable: function (card, player) {
					return !player.hasSkill("land_used");
				},
				notarget: true,
				content: function () {
					"step 0";
					game.changeLand("mtg_linzhongjianta", player);
					player.discoverCard(
						function (card) {
							return get.subtype(card) == "equip1";
						},
						"nogain",
						"选择一个武器装备之"
					);
					"step 1";
					if (result.choice) {
						player.equip(game.createCard(result.choice), true);
					}
				},
				ai: {
					value: 5,
					useful: 3,
					order: 9,
					result: {
						player: function (player) {
							if (player.getEquip(1)) return 0;
							return 1;
						},
					},
				},
			},
			mtg_youlin: {
				type: "land",
				fullborder: "wood",
				enable: function (card, player) {
					return !player.hasSkill("land_used");
				},
				notarget: true,
				content: function () {
					game.changeLand("mtg_youlin", player);
					var list = get.inpile("trick");
					while (list.length) {
						var name = list.randomRemove();
						if (lib.card[name].multitarget) continue;
						var targets = game.filterPlayer();
						while (targets.length) {
							var target = targets.randomRemove();
							if (
								player.canUse(name, target, false) &&
								get.effect(target, { name: name }, player, player) > 0
							) {
								player.useCard({ name: name }, target);
								return;
							}
						}
					}
				},
				ai: {
					value: 5,
					useful: 3,
					order: 4,
					result: {
						player: 1,
					},
				},
			},
			mtg_haidao: {
				type: "land",
				fullborder: "wood",
				enable: function (card, player) {
					return !player.hasSkill("land_used");
				},
				notarget: true,
				content: function () {
					"step 0";
					game.changeLand("mtg_haidao", player);
					if (player.isHealthy()) {
						player.changeHujia();
						event.finish();
					} else {
						player._temp_mtg_haidao = true;
						player
							.chooseToDiscard("he", "海岛")
							.set("ai", function (card) {
								return 5 - get.value(card);
							})
							.set("prompt2", "弃置一张牌并回复1点体力，或取消并获得1点护甲");
					}
					"step 1";
					if (result.bool) {
						player.recover();
					} else {
						player.changeHujia();
					}
					"step 2";
					delete player._temp_mtg_haidao;
				},
				ai: {
					value: 5,
					useful: 3,
					order: 4,
					result: {
						player: 1,
					},
				},
			},
			mtg_yixialan: {
				type: "land",
				fullborder: "wood",
				enable: function (card, player) {
					return !player.hasSkill("land_used");
				},
				notarget: true,
				content: function () {
					"step 0";
					game.changeLand("mtg_yixialan", player);
					player
						.chooseControl("基本牌", "锦囊牌")
						.set("prompt", "选择一个类型获得该类型的一张牌")
						.set("ai", function () {
							var player = _status.event.player;
							if (!player.hasSha() || !player.hasShan() || player.hp == 1) return 0;
							return 1;
						});
					"step 1";
					if (result.control == "基本牌") {
						player.gain(game.createCard(get.inpile("basic").randomGet()), "gain2");
					} else {
						player.gain(game.createCard(get.inpile("trick", "trick").randomGet()), "gain2");
					}
				},
				ai: {
					value: 5,
					useful: 3,
					order: 4,
					result: {
						player: 1,
					},
				},
			},
			mtg_shuimomuxue: {
				type: "land",
				fullborder: "wood",
				enable: function (card, player) {
					return !player.hasSkill("land_used");
				},
				notarget: true,
				content: function () {
					"step 0";
					game.changeLand("mtg_shuimomuxue", player);
					if (player.countDiscardableCards("he")) {
						player.chooseToDiscard("是否弃置一张牌并摸两张牌？", "he").set("ai", function (card) {
							return 8 - get.value(card);
						});
					} else {
						event.finish();
					}
					"step 1";
					if (result.bool) {
						player.draw(2);
					}
				},
				ai: {
					value: 5,
					useful: 3,
					order: 4,
					result: {
						player: function (player) {
							if (
								!player.countCards("h", function (card) {
									return card.name != "mtg_shuimomuxue" && get.value(card) < 8;
								})
							) {
								return 0;
							}
							return 1;
						},
					},
				},
			},
			mtg_feixu: {
				type: "land",
				fullborder: "wood",
				enable: function (card, player) {
					return !player.hasSkill("land_used");
				},
				notarget: true,
				content: function () {
					game.changeLand("mtg_feixu", player);
					player.discoverCard(ui.discardPile.childNodes);
				},
				ai: {
					value: 5,
					useful: 3,
					order: 4,
					result: {
						player: 1,
					},
				},
			},
			mtg_shamolvzhou: {
				type: "land",
				fullborder: "wood",
				enable: function (card, player) {
					return !player.hasSkill("land_used");
				},
				notarget: true,
				content: function () {
					game.changeLand("mtg_shamolvzhou", player);
					player.discoverCard(get.inpile("basic"));
				},
				ai: {
					value: 5,
					useful: 3,
					order: 4,
					result: {
						player: 1,
					},
				},
			},
			mtg_duzhao: {
				type: "land",
				fullborder: "wood",
				enable: function (card, player) {
					return !player.hasSkill("land_used");
				},
				notarget: true,
				content: function () {
					"step 0";
					game.changeLand("mtg_duzhao", player);
					player.chooseTarget("选择一名角色令其获得一张毒", true).set("ai", function (target) {
						if (target.hasSkillTag("nodu")) return 0;
						return -get.attitude(_status.event.player, target) / Math.sqrt(target.hp + 1);
					});
					"step 1";
					if (result.bool) {
						var target = result.targets[0];
						player.line(target, "green");
						target.gain(game.createCard("du"), "gain2");
					}
				},
				ai: {
					value: 5,
					useful: 3,
					order: 4,
					result: {
						player: function (player) {
							if (
								game.countPlayer(function (current) {
									if (current.hasSkillTag("nodu")) return false;
									return get.attitude(player, current) < 0;
								}) >
								game.countPlayer(function (current) {
									if (current.hasSkillTag("nodu")) return false;
									return get.attitude(player, current) > 0;
								})
							) {
								return 1;
							}
							return 0;
						},
					},
				},
			},
			mtg_bingheyaosai: {
				type: "land",
				fullborder: "wood",
				enable: function (card, player) {
					return !player.hasSkill("land_used");
				},
				notarget: true,
				content: function () {
					"step 0";
					game.changeLand("mtg_bingheyaosai", player);
					player.draw(2);
					"step 1";
					player.chooseToDiscard("he", 2, true);
				},
				ai: {
					value: 5,
					useful: 3,
					order: 2,
					result: {
						player: 1,
					},
				},
			},
		},
		skill: {
			mtg_bingheyaosai_skill: {
				trigger: { player: "useCard" },
				forced: true,
				filter: function (event, player) {
					if (player.countCards("he") == 0) return false;
					return event.card.name == "sha";
				},
				autodelay: true,
				content: function () {
					player.chooseToDiscard(true, "he");
				},
				ai: {
					mapValue: -4,
				},
			},
			mtg_duzhao_skill: {
				trigger: { player: "phaseEnd" },
				forced: true,
				content: function () {
					player.gain(game.createCard("du"), "gain2");
				},
				ai: {
					mapValue: -5,
				},
			},
			mtg_shamolvzhou_skill: {
				mod: {
					ignoredHandcard: function (card) {
						if (get.type(card) == "basic") {
							return true;
						}
					},
				},
				ai: {
					mapValue: 3,
				},
			},
			mtg_haidao_skill: {
				trigger: { player: "changeHujiaBefore" },
				forced: true,
				filter: function (event, player) {
					return player.isDamaged() && !player._temp_mtg_haidao && event.num > 0;
				},
				content: function () {
					player.recover(trigger.num);
					trigger.cancel();
				},
				ai: {
					mapValue: 1,
				},
			},
			mtg_yixialan_skill: {
				enable: "phaseUse",
				filter: (event, player) =>
					player.hasCard((card) => lib.skill.mtg_yixialan_skill.filterCard(card, player), "h"),
				filterCard: (card, player) => get.type(card) == "basic" && player.canRecast(card),
				discard: false,
				lose: false,
				check: function (card) {
					return 7 - get.value(card);
				},
				usable: 1,
				content: function () {
					player.recast(cards, void 0, (player, cards) => {
						var cardsToGain = [];
						for (var repetition = 0; repetition < cards.length; repetition++) {
							var card = get.cardPile((card) => get.type(card, "trick") == "trick");
							if (card) cardsToGain.push(card);
						}
						if (cardsToGain.length) player.gain(cardsToGain, "draw");
						if (cards.length - cardsToGain.length)
							player.draw(cards.length - cardsToGain.length).log = false;
					});
				},
				ai: {
					mapValue: 2,
					order: 1,
					result: {
						player: 1,
					},
				},
			},
			mtg_shuimomuxue_skill: {
				mod: {
					maxHandcard: function (player, num) {
						return num - 1;
					},
				},
				trigger: { player: "phaseDiscardEnd" },
				forced: true,
				filter: function (event) {
					return event.cards && event.cards.length > 0;
				},
				content: function () {
					player.draw();
				},
				ai: {
					mapValue: 2,
				},
			},
			mtg_feixu_skill: {
				trigger: { player: "phaseBegin" },
				silent: true,
				content: function () {
					var num = ui.discardPile.childNodes.length;
					if (num) {
						var card = ui.discardPile.childNodes[get.rand(num)];
						if (card) {
							ui.cardPile.insertBefore(card, ui.cardPile.firstChild);
						}
					}
				},
				ai: {
					mapValue: 0,
				},
			},
			mtg_youlin_skill: {
				enable: "phaseUse",
				usable: 1,
				filter: function (event, player) {
					return player.countCards("h", { type: ["trick", "delay"] });
				},
				filterCard: function (card) {
					return get.type(card, "trick") == "trick";
				},
				check: function (card) {
					return 7 - get.value(card);
				},
				content: function () {
					player.discoverCard();
				},
				ai: {
					mapValue: 1,
					order: 7,
					result: {
						player: 2,
					},
				},
			},
			mtg_linzhongjianta_skill: {
				enable: "chooseToUse",
				filterCard: function (card) {
					return get.type(card) == "basic";
				},
				usable: 1,
				viewAs: { name: "sha" },
				viewAsFilter: function (player) {
					if (!player.getEquip(1)) return false;
					if (!player.countCards("h", { type: "basic" })) return false;
				},
				prompt: "将一张基本牌当杀使用",
				check: function (card) {
					return 6 - get.value(card);
				},
				ai: {
					mapValue: 2,
					respondSha: true,
					order: function () {
						return get.order({ name: "sha" }) - 0.1;
					},
					skillTagFilter: function (player, tag, arg) {
						if (arg != "use") return false;
						if (!player.getEquip(1)) return false;
						if (!player.countCards("h", { type: "basic" })) return false;
					},
				},
			},
			mtg_cangbaohaiwan_skill: {
				trigger: { player: "drawBegin" },
				silent: true,
				content: function () {
					if (Math.random() < 1 / 3) {
						var list = [];
						for (var i = 0; i < lib.cardPack.mode_derivation.length; i++) {
							var name = lib.cardPack.mode_derivation[i];
							var info = lib.card[name];
							if (info.gainable == false || info.destroy) continue;
							list.push(name);
						}
						if (list.length) {
							ui.cardPile.insertBefore(
								game.createCard(list.randomGet()),
								ui.cardPile.firstChild
							);
						}
					}
				},
				ai: {
					mapValue: 5,
				},
			},
			mtg_longlushanfeng_skill: {
				mod: {
					cardUsable: function (card, player, num) {
						if (card.name == "sha") return num + 1;
					},
				},
				ai: {
					mapValue: 2,
				},
			},
			mtg_lindixiliu_skill: {
				trigger: { player: "phaseBegin" },
				direct: true,
				filter: function (event, player) {
					return player.countCards("he", { suit: "heart" }) && player.countCards("j");
				},
				content: function () {
					"step 0";
					player
						.chooseToDiscard("he", { suit: "heart" }, get.prompt2("mtg_lindixiliu_skill"))
						.set("ai", function (card) {
							return 8 - get.value(card);
						})
						.set("logSkill", "mtg_lindixiliu_skill");
					"step 1";
					if (result.bool) {
						player.discardPlayerCard(player, "j", true);
					}
				},
				ai: {
					mapValue: 1.5,
				},
			},
		},
		cardType: {
			land: 0.6,
		},
		translate: {
			land: "地图",
			mtg_yixialan: "依夏兰",
			mtg_yixialan_skill: "依夏兰",
			mtg_yixialan_info:
				"选项一：随机获得一张基本牌；选项二：随机获得一张锦囊牌。地图效果：出牌阶段限一次，你可以将一张基本牌重铸为锦囊牌。",
			mtg_yixialan_skill_info: "出牌阶段限一次，你可以将一张基本牌重铸为锦囊牌。",
			mtg_shuimomuxue: "水没墓穴",
			mtg_shuimomuxue_skill: "水没墓穴",
			mtg_shuimomuxue_info:
				"你可以弃置一张牌并摸两张牌。地图效果：锁定技，你的手牌上限-1；若弃牌阶段弃置了至少一张牌，则在此阶段结束时摸一张牌。",
			mtg_shuimomuxue_skill_info:
				"锁定技，你的手牌上限-1；若弃牌阶段弃置了至少一张牌，则在此阶段结束时摸一张牌。",
			mtg_feixu: "废墟",
			mtg_feixu_skill: "废墟",
			mtg_feixu_info: "从弃牌堆中发现一张牌。地图效果：准备阶段，随机将弃牌堆的一张牌置于牌堆顶。",
			mtg_feixu_skill_info: "准备阶段，随机将弃牌堆的一张牌置于牌堆顶。",
			mtg_haidao: "海岛",
			mtg_haidao_skill: "海岛",
			mtg_haidao_info:
				"选项一：获得1点护甲（无视地图效果）；选项二：弃置一张牌并回复1点体力。地图效果：锁定技，当你获得护甲时，若你已受伤，改为回复等量体力。",
			mtg_haidao_skill_info: "锁定技，当你获得护甲时，若你已受伤，改为回复等量体力。",
			mtg_youlin: "幽林",
			mtg_youlin_skill: "幽林",
			mtg_youlin_info:
				"随机使用一张普通锦囊牌，随机指定一个具有正收益的目标。地图效果：出牌阶段限一次，你可以弃置一张锦囊牌并发现一张牌。",
			mtg_youlin_skill_info: "出牌阶段限一次，你可以弃置一张锦囊牌并发现一张牌。",
			mtg_shamolvzhou: "沙漠绿洲",
			mtg_shamolvzhou_skill: "沙漠绿洲",
			mtg_shamolvzhou_info: "发现一张基本牌。地图效果：你的基本牌不计入手牌上限。",
			mtg_shamolvzhou_skill_info: "你的基本牌不计入手牌上限。",

			mtg_duzhao: "毒沼",
			mtg_duzhao_skill: "毒沼",
			mtg_duzhao_info: "选择一名角色令其获得一张毒。地图效果：结束阶段，你获得一张毒。",
			mtg_duzhao_skill_info: "结束阶段，你获得一张毒。",
			mtg_linzhongjianta: "林中尖塔",
			mtg_linzhongjianta_skill: "林中尖塔",
			mtg_linzhongjianta_info:
				"发现一张武器牌并装备之。地图效果：若你装备区内有武器牌，你可以将一张基本牌当作杀使用。",
			mtg_linzhongjianta_skill_info: "若你装备区内有武器牌，你可以将一张基本牌当作杀使用。",
			mtg_cangbaohaiwan: "藏宝海湾",
			mtg_cangbaohaiwan_skill: "藏宝海湾",
			mtg_cangbaohaiwan_info:
				"选择一个扩展包，随机获得来自该扩展包的一张衍生牌。地图效果：你在摸牌时有可能摸到衍生牌。",
			mtg_cangbaohaiwan_skill_info: "你在摸牌时有可能摸到衍生牌。",
			mtg_longlushanfeng: "龙颅山峰",
			mtg_longlushanfeng_skill: "龙颅山峰",
			mtg_longlushanfeng_info: "选项一：获得一张杀；选项二：获得一张闪。地图效果：你出杀的次数上限+1。",
			mtg_longlushanfeng_skill_info: "你出杀的次数上限+1。",
			mtg_bingheyaosai: "冰河要塞",
			mtg_bingheyaosai_skill: "冰河要塞",
			mtg_bingheyaosai_info:
				"摸两张牌，然后弃置两张牌。地图效果：锁定技，每当你使用一张杀，若你有牌，则需弃置一张牌。",
			mtg_bingheyaosai_skill_info: "锁定技，每当你使用一张杀，若你有牌，则需弃置一张牌。",
			mtg_lindixiliu: "林地溪流",
			mtg_lindixiliu_skill: "林地溪流",
			mtg_lindixiliu_info:
				"从牌堆中摸一张红桃牌，然后弃置任意张红桃牌，每弃置一张牌，将一张延时锦囊牌置入一名随机敌方角色的判定区。地图效果：准备阶段，你可以弃置一张红桃牌，然后弃置判定区内的一张牌。",
			mtg_lindixiliu_skill_info: "准备阶段，你可以弃置一张红桃牌，然后弃置判定区内的一张牌。",
		},
		help: {
			万智牌:
				"<ul><li>地图牌可于出牌阶段使用，每阶段最多使用一张地图牌<li>" +
				"地图牌分为两部分：即时效果以及地图效果，即时效果由使用者在使用时选择；地图效果对所有角色有效<li>" +
				"当使用者死亡或下个回合开始时，当前地图效果消失<li>" +
				"新地图被使用时会覆盖当前地图效果",
		},
		list: [
			["club", 12, "mtg_yixialan"],
			["spade", 11, "mtg_shuimomuxue"],
			["diamond", 5, "mtg_haidao"],
			["club", 10, "mtg_youlin"],
			["club", 8, "mtg_feixu"],
			["heart", 6, "mtg_shamolvzhou"],

			["club", 12, "mtg_cangbaohaiwan"],
			["spade", 11, "mtg_lindixiliu"],
			["diamond", 5, "mtg_bingheyaosai"],
			["club", 10, "mtg_longlushanfeng"],
			["club", 8, "mtg_duzhao"],
			["heart", 6, "mtg_linzhongjianta"],
		],
	};
});
