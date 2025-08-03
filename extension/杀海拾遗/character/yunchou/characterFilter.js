import { lib, game, ui, get, ai, _status } from "../../main/utils.js";

const characterFilters = {
	diy_caocao(mode) {
		return mode === 'identity' || mode === 'guozhan';
	},
};

export default characterFilters;
