import { lib, game, ui, get, ai, _status } from "noname";

const characterFilters = {
	jsrg_caocao(mode) {
		return mode != "chess" && mode != "tafang";
	},
	jsrg_xushao(mode) {
		return mode != "guozhan";
	},
	jsrg_jiangwei(mode) {
		return mode !== "guozhan";
	},
};

export default characterFilters;
