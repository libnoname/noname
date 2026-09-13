import { lib, game, ui, get, ai, _status } from "noname";

const characterFilters = {
	shen_dengai(mode) {
		if (["boss", "chess", "tafang", "stone"].includes(mode)) {
			return false;
		}
		if (mode == "versus") {
			return _status.mode != "three";
		}
		return true;
	},
	// leitong(mode) {
	// 	return mode != "identity" && mode != "guozhan";
	// },
	// wulan(mode) {
	// 	return mode != "identity" && mode != "guozhan";
	// },
};

export default characterFilters;
