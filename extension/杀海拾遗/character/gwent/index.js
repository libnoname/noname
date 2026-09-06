import { game } from "../../main/utils.js";
import card from "./card.js";
import cardType from "./cardType.js";
import character from "./character.js";
import characterIntro from "./intro.js";
import skill from "./skill.js";
import translate from "./translate.js";

game.import("character", function () {
	return {
		name: "gwent",
		character,
		characterIntro,
		card,
		cardType,
		skill,
		translate,
	};
});
