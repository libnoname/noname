import { lib, game, ui, get, ai, _status } from "noname";

const characterFilters = {
	old_lingju(mode) {
		return mode == "identity";
	},
};

const characterInitFilters = {
	dc_zhaoyun(tag) {
		if (tag == "noZhuSkill" && (get.mode() != "doudizhu" || _status.mode != "normal")) {
			return false;
		}
	},
};

export { characterFilters, characterInitFilters };
