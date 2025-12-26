import { lib, game, ui, get, ai, _status } from "noname";

const cards = {
	xuanhuafu: {
		fullskin: true,
		derivation: "std_zhengcong",
		cardcolor: "diamond",
		type: "equip",
		subtype: "equip1",
		distance: { attackFrom: -2 },
		skills: ["xuanhuafu_skill"],
		ai: {
			basic: {
				equipValue: 4.5,
			},
		},
		enable: true,
		selectTarget: -1,
		filterTarget: (card, player, target) => player == target && target.canEquip(card, true),
		modTarget: true,
		allowMultiple: false,
		content: function () {
			if (
				!card?.cards.some(card => {
					return get.position(card, true) !== "o";
				})
			) {
				target.equip(card);
			}
			//if (cards.length && get.position(cards[0], true) == "o") target.equip(cards[0]);
		},
		toself: true,
	},
	baipishuangbi: {
		fullskin: true,
		derivation: "std_jiangjie",
		cardcolor: "spade",
		type: "equip",
		subtype: "equip1",
		skills: ["baipishuangbi_skill"],
		ai: {
			basic: {
				equipValue: 4.5,
			},
		},
		enable: true,
		selectTarget: -1,
		filterTarget: (card, player, target) => player == target && target.canEquip(card, true),
		modTarget: true,
		allowMultiple: false,
		content: function () {
			if (
				!card?.cards.some(card => {
					return get.position(card, true) !== "o";
				})
			) {
				target.equip(card);
			}
			//if (cards.length && get.position(cards[0], true) == "o") target.equip(cards[0]);
		},
		toself: true,
	},
};
export default cards;
