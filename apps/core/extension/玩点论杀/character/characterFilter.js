import { lib, game, ui, get, ai, _status } from "noname";

const characterFilters = {
	wdb_liuyan(mode) {
		return mode !== "chess" && mode !== "tafang";
	},
};

export default characterFilters;
