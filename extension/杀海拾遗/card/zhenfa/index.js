import { game } from "../../main/utils.js";
import card from "./card.js";
import list from "./list.js";
import translate from "./translate.js";

game.import("card", function () {
	return {
		name: "zhenfa",
		card,
		translate,
		list,
	};
});
