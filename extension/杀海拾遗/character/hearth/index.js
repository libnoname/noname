import { game } from "../../main/utils.js";
import card from "./card.js";
import cardType from "./cardType.js";
import character from "./character.js";
import characterIntro from "./intro.js";
import perfectPair from "./perfectPair.js";
import skill from "./skill.js";
import characterTitle from "./title.js";
import translate from "./translate.js";

game.import("character", function () {
	return {
		name: "hearth",
		character,
		characterIntro,
		characterTitle,
		perfectPair,
		card,
		cardType,
		skill,
		translate,
	};
});
