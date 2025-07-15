import { game } from "../../../noname.js";
import character from "./character.js";
import characterTitle from "./title.js";
import characterIntro from "./intro.js";
import skill from "./skill.js";
import translate from "./translate.js";

game.import("character", function () {
	return {
		name: "yxs",
		character,
		characterIntro,
		characterTitle,
		skill,
		translate,
	};
});
