import { lib, game, ui, get, ai, _status } from "noname";

const characterFilters = {
	re_zuoci(mode) {
		return mode != "guozhan";
	},
};

export default characterFilters;
