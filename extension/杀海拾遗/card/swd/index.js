import { game } from "../../main/utils.js";
import card from "./card.js";
import cardType from "./type.js";
import list from "./list.js";
import skill from "./skill.js";
import translate from "./translate.js";
import help from "./help.js";

game.import("card", function () {
	return {
		name: "swd",
		card,
		skill,
		cardType,
		help,
		translate,
		list,
	};
});
