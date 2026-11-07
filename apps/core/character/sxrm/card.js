import { lib, game, ui, get, ai, _status } from "noname";

const cards = {
	sxrm_nvzhuang: {
		fullskin: true,
		cardimage: "nvzhuang",
		type: "equip",
		subtype: "equip2",
		derivation: "sxrm_lvlingqi",
		enable: true,
		selectTarget: -1,
		toself: true,
		filterTarget(card, player, target) {
			return player === target && target.canEquip(card, true);
		},
		async content(event) {
			await event.target.equip(event.card);
		},
		skills: ["jueqing"],
		async onEquip(event, trigger, player) {
			if (player.sex === "male") await player.chooseToDiscard("he", true, card => !(event.card.cards || []).includes(card));
		},
		async onLose(event, trigger, player) {
			if (player.sex === "male" && player.countCards("he")) await player.chooseToDiscard("he", true);
		},
		ai: { basic: { equipValue: 7 } },
	},
};
export default cards;
