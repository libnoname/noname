import { lib, game, ui, get, ai, _status } from "../../noname.js";

const cards = {
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
