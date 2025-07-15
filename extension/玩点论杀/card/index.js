import { game } from "../../../noname.js";
import card from "./card.js";
import list from "./list.js";
import skill from "./skill.js";
import translate from "./translate.js";

game.import("card", function () {
	return {
		name: "wandian",
		connect: false, // 【调兵遣将】无法联机
		card,
		skill,
		translate,
		list,
	};
});
