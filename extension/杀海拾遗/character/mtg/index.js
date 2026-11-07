import { game } from "../../main/utils.js";
import character from "./character.js";
import characterIntro from "./intro.js";
import skill from "./skill.js";
import translate from "./translate.js";

game.import("character", function () {
	return {
		name: "mtg",
		character,
		characterIntro,
		skill,
		translate,
	};
});
