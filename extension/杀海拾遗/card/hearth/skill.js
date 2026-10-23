import { lib, game, ui, get, ai, _status } from "../../main/utils.js";

/** @type { importCardConfig['skill'] } */
const skill = {
	chuansongmen2: {},
	chuansongmen3: {},
	shihuawuqi: {
		mod: {
			attackFrom(from, to, distance) {
				return distance - 1;
			},
		},
	},
	jihuocard2: {
		mod: {
			maxHandcard(player, num) {
				return num + 2;
			},
		},
	},
};

export default skill;
