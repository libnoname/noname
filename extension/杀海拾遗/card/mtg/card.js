import { lib, game, ui, get, ai, _status } from "../../main/utils.js";

const card = {
	mtg_lindixiliu: {
		type: "land",
		fullborder: "wood",
		enable(card, player) {
			return !player.hasSkill("land_used");
		},
		notarget: true,
		content() {
			"step 0";
			game.changeLand("mtg_lindixiliu", player);
			var card = get.cardPile2(function (card) {
				return get.suit(card) === "heart";
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
				.set("prompt2", "弃置任意张红桃牌，每弃置一张牌，将一张延时锦囊牌置入一名随机敌方角色的判定区");
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
		enable(card, player) {
			return !player.hasSkill("land_used");
		},
		notarget: true,
		content() {
			"step 0";
			game.changeLand("mtg_longlushanfeng", player);
			player
				.chooseControl("获得杀", "获得闪")
				.set("prompt", "选择一项")
				.set("ai", function () {
					var player = _status.event.player;
					if (player.hasShan("all")) {
						return 0;
					}
					return 1;
				});
			"step 1";
			if (result.control === "获得杀") {
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
		enable(card, player) {
			if (!lib.cardPack.mode_derivation || !lib.cardPack.mode_derivation.length) {
				return false;
			}
			return !player.hasSkill("land_used");
		},
		notarget: true,
		content() {
			"step 0";
			game.changeLand("mtg_cangbaohaiwan", player);
			event.map = {};
			var pack1 = [];
			var pack2 = [];
			for (var i = 0; i < lib.cardPack.mode_derivation.length; i++) {
				var name = lib.cardPack.mode_derivation[i];
				var info = lib.card[name];
				if (info.gainable === false || info.destroy) {
					continue;
				}
				if (info.derivationpack) {
					var trans = lib.translate[info.derivationpack + "_card_config"] + "（卡牌包）";
					if (!event.map[trans]) {
						event.map[trans] = [];
						pack2.push(trans);
					}
					event.map[trans].push(name);
				} else if (typeof info.derivation === "string") {
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
		enable(card, player) {
			return !player.hasSkill("land_used");
		},
		notarget: true,
		content() {
			"step 0";
			game.changeLand("mtg_linzhongjianta", player);
			player.discoverCard(
				function (card) {
					return get.subtype(card) === "equip1";
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
				player(player) {
					if (player.getEquip(1)) {
						return 0;
					}
					return 1;
				},
			},
		},
	},
	mtg_youlin: {
		type: "land",
		fullborder: "wood",
		enable(card, player) {
			return !player.hasSkill("land_used");
		},
		notarget: true,
		content() {
			game.changeLand("mtg_youlin", player);
			var list = get.inpile("trick");
			while (list.length) {
				var name = list.randomRemove();
				if (lib.card[name].multitarget) {
					continue;
				}
				var targets = game.filterPlayer();
				while (targets.length) {
					var target = targets.randomRemove();
					if (player.canUse(name, target, false) && get.effect(target, { name: name }, player, player) > 0) {
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
		enable(card, player) {
			return !player.hasSkill("land_used");
		},
		notarget: true,
		content() {
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
		enable(card, player) {
			return !player.hasSkill("land_used");
		},
		notarget: true,
		content() {
			"step 0";
			game.changeLand("mtg_yixialan", player);
			player
				.chooseControl("基本牌", "锦囊牌")
				.set("prompt", "选择一个类型获得该类型的一张牌")
				.set("ai", function () {
					var player = _status.event.player;
					if (!player.hasSha("all") || !player.hasShan("all") || player.hp === 1) {
						return 0;
					}
					return 1;
				});
			"step 1";
			if (result.control === "基本牌") {
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
		enable(card, player) {
			return !player.hasSkill("land_used");
		},
		notarget: true,
		content() {
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
				player(player) {
					if (
						!player.countCards("h", function (card) {
							return card.name !== "mtg_shuimomuxue" && get.value(card) < 8;
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
		enable(card, player) {
			return !player.hasSkill("land_used");
		},
		notarget: true,
		content() {
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
		enable(card, player) {
			return !player.hasSkill("land_used");
		},
		notarget: true,
		content() {
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
		enable(card, player) {
			return !player.hasSkill("land_used");
		},
		notarget: true,
		content() {
			"step 0";
			game.changeLand("mtg_duzhao", player);
			player.chooseTarget("选择一名角色令其获得一张毒", true).set("ai", function (target) {
				if (target.hasSkillTag("nodu")) {
					return 0;
				}
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
				player(player) {
					if (
						game.countPlayer(function (current) {
							if (current.hasSkillTag("nodu")) {
								return false;
							}
							return get.attitude(player, current) < 0;
						}) >
						game.countPlayer(function (current) {
							if (current.hasSkillTag("nodu")) {
								return false;
							}
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
		enable(card, player) {
			return !player.hasSkill("land_used");
		},
		notarget: true,
		content() {
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
};

for (let i in card) {
	card[i].image = "ext:杀海拾遗/image/card/" + i + ".jpg";
}

export default card;
