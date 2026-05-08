import { lib, game, ui, get, ai, _status } from "noname";

const cards = {
	nsfuzhou_card: {
		fullskin: true,
		type: "delay",
		wuxieable: false,
		modTarget(card, player, target) {
			return lib.filter.judge(card, player, target);
		},
		enable(card, player) {
			return player.canAddJudge(card);
		},
		filterTarget(card, player, target) {
			return lib.filter.judge(card, player, target) && player == target;
		},
		judge(card) {
			if (get.color(card) == "red") {
				return 0;
			}
			return -4;
		},
		effect() {
			var source = cards[0].storage.nsfuzhou_source;
			if (!source || !source.isIn()) {
				return;
			}
			source.line(player, "thunder");
			switch (result.color) {
				case "black":
					player.damage(source, source.storage.nsfuzhou_damage ? 2 : 1, "thunder");
					player.chooseToDiscard("he", true);
					break;
				case "red":
					source.draw(2);
					if (typeof player.storage.nsfuzhou_num != "number") {
						player.storage.nsfuzhou_num = 0;
					}
					if (source.storage.nsfuzhou_draw) {
						player.recover();
						player.draw();
						player.storage.nsfuzhou_num++;
					} else {
						player.storage.nsfuzhou_num--;
					}
					player.addTempSkill("nsfuzhou_num");
					player.markSkill("nsfuzhou_num");
					break;

				default:
					break;
			}
		},
		ai: {
			basic: {
				order: 1,
				useful: 0,
				value: 0,
			},
			result: {
				target: -1,
			},
			tag: {
				damage: 0.5,
				natureDamage: 0.5,
				thunderDamage: 0.5,
			},
		},
	},
};
export default cards;
