import { lib, game, ui, get, ai, _status } from "../../noname.js";

const cards = {
	real_zhuge: {
		derivation: "you_zhugeliang",
		cardimage: "zhuge",
		fullskin: true,
		type: "equip",
		subtype: "equip1",
		distance: {
			attackFrom: -98,
		},
		destroy: true,
		ai: {
			order() {
				return get.order({ name: "sha" }) + 0.1;
			},
			equipValue(card, player) {
				if (player._zhuge_temp) {
					return 1;
				}
				player._zhuge_temp = true;
				var result = (function () {
					if (
						!game.hasPlayer(function (current) {
							return get.distance(player, current) <= 1 && player.canUse("sha", current) && get.effect(current, { name: "sha" }, player, player) > 0;
						})
					) {
						return 1;
					}
					if (player.hasSha() && _status.currentPhase === player) {
						if ((player.getEquip("zhuge") && player.countUsed("sha")) || player.getCardUsable("sha") === 0) {
							return 10;
						}
					}
					var num = player.countCards("h", "sha");
					if (num > 1) {
						return 6 + num;
					}
					return 3 + num;
				})();
				delete player._zhuge_temp;
				return result;
			},
			basic: {
				equipValue: 5,
			},
			tag: {
				valueswap: 1,
			},
		},
		skills: ["real_zhuge_skill"],
	},
	olhuaquan_heavy: {
		fullskin: true,
		noname: true,
	},
	olhuaquan_light: {
		fullskin: true,
		noname: true,
	},
	ruyijingubang: {
		fullskin: true,
		derivation: "sunwukong",
		type: "equip",
		subtype: "equip1",
		cardcolor: "heart",
		skills: ["ruyijingubang_skill", "ruyijingubang_effect"],
		equipDelay: false,
		distance: {
			attackFrom: -2,
			attackRange: (card, player) => {
				return player.storage.ruyijingubang_skill || 3;
			},
		},
		onEquip() {
			if (!card.storage.ruyijingubang_skill) {
				card.storage.ruyijingubang_skill = 3;
			}
			player.storage.ruyijingubang_skill = card.storage.ruyijingubang_skill;
			player.markSkill("ruyijingubang_skill");
		},
		onLose() {
			if (player.getStat().skill.ruyijingubang_skill) {
				delete player.getStat().skill.ruyijingubang_skill;
			}
		},
	},
};
export default cards;
