import { lib, game, ui, get, ai, _status } from "noname";

const characterFilters = {
	simashi(mode) {
		if (["boss", "chess", "tafang", "stone"].includes(mode)) {
			return false;
		}
		if (mode == "versus") {
			return _status.mode != "three";
		}
		return true;
	},
};

export default characterFilters;
