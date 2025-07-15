import { game } from "../../main/utils.js";
import card from "./card.js";
import character from "./character.js";
import characterIntro from "./intro.js";
import skill from "./skill.js";
import translate from "./translate.js";

await game.import("character", function () {
	return {
		name: "gujian",
		character,
		characterIntro,
		card,
		skill,
		translate,
	};
});
