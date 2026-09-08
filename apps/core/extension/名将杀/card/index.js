import { lib, game, ui, get, ai, _status } from "noname";
import card from "./card.js";
import list from "./list.js";
import skill from "./skill.js";
import translate from "./translate.js";

game.import("card", function () {
	const mjs = {
		name: "mjs",
		connect: true,
		card,
		skill,
		translate,
		list,
	};
	lib.config.all.cards.add("mjs");
	return mjs;
});
