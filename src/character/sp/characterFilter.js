import { lib, game, ui, get, ai, _status } from "noname";

const characterFilters = {
	tianyu(mode) {
		return mode != "chess" && mode != "tafang" && mode != "stone";
	},
	ol_mengda(mode) {
		return mode !== "guozhan";
	},
};

export default characterFilters;
