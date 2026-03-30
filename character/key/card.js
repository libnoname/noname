import { lib, game, ui, get, ai, _status } from "noname";

const cards = {
	kano_paibingbuzhen: {
		fullskin: true,
		type: "trick",
		enable: true,
		filterTarget: true,
		selectTarget: [1, 3],
		derivation: "key_kano",
		content() {
			"step 0";
			target.draw();
			"step 1";
			var hs = target.getCards("he");
			if (!hs.length) {
				event.finish();
			} else if (hs.length == 1) {
				event._result = { bool: true, cards: hs };
			} else {
				target.chooseCard("he", true, "选择一张牌置入仁库");
			}
			"step 2";
			if (result.bool) {
				var card = result.cards[0];
				target.$throw(card, 1000);
				target.lose(card, "toRenku");
			}
		},
		contentAfter() {
			if (
				player.isIn() &&
				_status.renku.length &&
				(function () {
					var cards = _status.renku;
					if (cards.length == 1) {
						return true;
					}
					var color = get.color(cards[0], false),
						type = get.type(cards[0], false);
					for (var i = 1; i < cards.length; i++) {
						if (color && get.color(cards[i], false) != color) {
							color = false;
						}
						if (type && get.type(cards[i], false) != type) {
							type = false;
						}
						if (!color && !type) {
							return false;
						}
					}
					return true;
				})()
			) {
				player.draw();
			}
		},
		ai: {
			order: 1,
			result: {
				player(player, target) {
					if (player.hasSkill("kano_poyu")) {
						return 2;
					}
					return 0;
				},
				target: 0.1,
			},
		},
	},
	kamome_suitcase: {
		fullskin: true,
		type: "equip",
		subtype: "equip5",
		derivation: "key_kamome",
		skills: ["kamome_suitcase"],
		ai: {
			equipValue(card) {
				return 7;
			},
			basic: {
				equipValue: 7,
			},
		},
	},
	miki_hydrogladiator: {
		fullskin: true,
		type: "equip",
		subtype: "equip1",
		derivation: "key_miki",
		skills: ["miki_hydrogladiator_skill"],
		distance: {
			attackFrom: -5,
		},
		ai: {
			equipValue(card) {
				return 7;
			},
			basic: {
				equipValue: 7,
			},
		},
	},
	miki_binoculars: {
		fullskin: true,
		type: "equip",
		subtype: "equip5",
		derivation: "key_miki",
		skills: ["miki_binoculars"],
		ai: {
			equipValue(card) {
				return 7;
			},
			basic: {
				equipValue: 7,
			},
		},
	},
};
export default cards;
