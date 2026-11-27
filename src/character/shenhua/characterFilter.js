import { lib, game, ui, get, ai, _status } from "noname";

const characterFilters = {
	zuoci(mode) {
		return mode != "guozhan";
	},
};

export default characterFilters;
