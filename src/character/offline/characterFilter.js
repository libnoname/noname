import { lib, game, ui, get, ai, _status } from "noname";

const characterFilters = {
	shen_diaochan(mode) {
		return mode == "identity" || mode == "doudizhu" || mode == "single" || (mode == "versus" && _status.mode != "standard" && _status.mode != "three");
	},
    le_shen_jiaxu(mode) {
        return mode == "identity" && _status.mode != "purple";
    },
};

export default characterFilters;
