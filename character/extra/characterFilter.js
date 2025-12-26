import { lib, game, ui, get, ai, _status } from "noname";

const characterFilters = {
	shen_diaochan(mode) {
		return mode == "identity" || mode == "doudizhu" || mode == "single" || (mode == "versus" && _status.mode != "standard" && _status.mode != "three");
	},
	shen_dengai(mode) {
		if (["boss", "chess", "tafang", "stone"].includes(mode)) {
			return false;
		}
		if (mode == "versus") {
			return _status.mode != "three";
		}
		return true;
	},
	le_shen_jiaxu(mode) {
		return mode == "identity" && _status.mode != "purple";
	},
};

export default characterFilters;
