import { lib, game, ui, get, ai, _status } from "noname";

const cards = {
	huntianyi: {
		fullskin: true,
		type: "equip",
		subtype: "equip5",
		derivation: "clan_luji",
		cardcolor: "diamond",
		ai: {
			order: 9.5,
			equipValue(card, player) {
				if (player.hp == 1) {
					return 5;
				}
				return 0;
			},
			basic: {
				equipValue: 2,
			},
		},
		onLose() {
			player.addTempSkill("huntianyi_skill_lose");
			if (event.getParent(2)?.name == "huntianyi_skill") {
				cards.forEach(card => {
					card.fix();
					card.remove();
					card.destroyed = true;
					game.log(card, "被销毁了");
				});
			}
		},
		skills: ["huntianyi_skill"],
	},
};
export default cards;
