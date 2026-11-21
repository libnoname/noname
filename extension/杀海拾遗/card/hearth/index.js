import { game } from "../../main/utils.js";
import card from "./card.js";
import list from "./list.js";
import skill from "./skill.js";
import translate from "./translate.js";

game.import("card", function () {
	return {
		name: "hearth",
		card,
		skill,
		translate,
		list,
	};
});
