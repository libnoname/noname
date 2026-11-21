import { lib, game, ui, get, ai, _status } from "../../main/utils.js";

/** @type { importCardConfig['skill'] } */
const skill = {
	mtg_bingheyaosai_skill: {
		trigger: { player: "useCard" },
		forced: true,
		filter(event, player) {
			if (player.countCards("he") === 0) {
				return false;
			}
			return event.card.name === "sha";
		},
		autodelay: true,
		content() {
			player.chooseToDiscard(true, "he");
		},
		ai: {
			mapValue: -4,
		},
	},
	mtg_duzhao_skill: {
		trigger: { player: "phaseEnd" },
		forced: true,
		content() {
			player.gain(game.createCard("du"), "gain2");
		},
		ai: {
			mapValue: -5,
		},
	},
	mtg_shamolvzhou_skill: {
		mod: {
			ignoredHandcard(card) {
				if (get.type(card) === "basic") {
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
		filter(event, player) {
			return player.isDamaged() && !player._temp_mtg_haidao && event.num > 0;
		},
		content() {
			player.recover(trigger.num);
			trigger.cancel();
		},
		ai: {
			mapValue: 1,
		},
	},
	mtg_yixialan_skill: {
		enable: "phaseUse",
		filter: (event, player) => player.hasCard(card => lib.skill.mtg_yixialan_skill.filterCard(card, player), "h"),
		filterCard: (card, player) => get.type(card) === "basic" && player.canRecast(card),
		discard: false,
		lose: false,
		check(card) {
			return 7 - get.value(card);
		},
		usable: 1,
		content() {
			player.recast(cards, void 0, (player, cards) => {
				var cardsToGain = [];
				for (var repetition = 0; repetition < cards.length; repetition++) {
					var card = get.cardPile(card => get.type(card, "trick") === "trick");
					if (card) {
						cardsToGain.push(card);
					}
				}
				if (cardsToGain.length) {
					player.gain(cardsToGain, "draw");
				}
				if (cards.length - cardsToGain.length) {
					player.draw(cards.length - cardsToGain.length).log = false;
				}
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
			maxHandcard(player, num) {
				return num - 1;
			},
		},
		trigger: { player: "phaseDiscardEnd" },
		forced: true,
		filter(event) {
			return event.cards && event.cards.length > 0;
		},
		content() {
			player.draw();
		},
		ai: {
			mapValue: 2,
		},
	},
	mtg_feixu_skill: {
		trigger: { player: "phaseBegin" },
		silent: true,
		content() {
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
		filter(event, player) {
			return player.countCards("h", { type: ["trick", "delay"] });
		},
		filterCard(card) {
			return get.type(card, "trick") === "trick";
		},
		check(card) {
			return 7 - get.value(card);
		},
		content() {
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
		filterCard(card) {
			return get.type(card) === "basic";
		},
		usable: 1,
		viewAs: { name: "sha" },
		viewAsFilter(player) {
			if (!player.getEquip(1)) {
				return false;
			}
			if (!player.countCards("h", { type: "basic" })) {
				return false;
			}
		},
		prompt: "将一张基本牌当杀使用",
		check(card) {
			return 6 - get.value(card);
		},
		ai: {
			mapValue: 2,
			respondSha: true,
			order() {
				return get.order({ name: "sha" }) - 0.1;
			},
			skillTagFilter(player, tag, arg) {
				if (arg !== "use") {
					return false;
				}
				if (!player.getEquip(1)) {
					return false;
				}
				if (!player.countCards("h", { type: "basic" })) {
					return false;
				}
			},
		},
	},
	mtg_cangbaohaiwan_skill: {
		trigger: { player: "drawBegin" },
		silent: true,
		content() {
			if (Math.random() < 1 / 3) {
				var list = [];
				for (var i = 0; i < lib.cardPack.mode_derivation.length; i++) {
					var name = lib.cardPack.mode_derivation[i];
					var info = lib.card[name];
					if (info.gainable === false || info.destroy) {
						continue;
					}
					list.push(name);
				}
				if (list.length) {
					ui.cardPile.insertBefore(game.createCard(list.randomGet()), ui.cardPile.firstChild);
				}
			}
		},
		ai: {
			mapValue: 5,
		},
	},
	mtg_longlushanfeng_skill: {
		mod: {
			cardUsable(card, player, num) {
				if (card.name === "sha") {
					return num + 1;
				}
			},
		},
		ai: {
			mapValue: 2,
		},
	},
	mtg_lindixiliu_skill: {
		trigger: { player: "phaseBegin" },
		direct: true,
		filter(event, player) {
			return player.countCards("he", { suit: "heart" }) && player.countCards("j");
		},
		content() {
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
};

export default skill;
