import { game } from "../../main/utils.js";
import card from "./card.js";
import cardType from "./type.js";
import help from "./help.js";
import list from "./list.js";
import skill from "./skill.js";
import translate from "./translate.js";

game.import("card", function () {
	return {
		name: "gwent",
		card,
		skill,
		help,
		translate,
		cardType,
		list,
	};
});
