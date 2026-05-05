import { game } from "../../main/utils.js";
import arenaReady from "./arenaReady.js";
import card from "./card.js";
import element from "./element.js";
import help from "./help.js";
import skill from "./skill.js";
import translate from "./translate.js";
import video from "./video.js";

game.import("play", function () {
	return {
		name: "wuxing",
		arenaReady,
		video,
		element,
		skill,
		card,
		translate,
		help,
	};
});
