import { game } from "../../../noname.js";
import card from "./card.js";
import list from "./list.js";
import skill from "./skill.js";
import translate from "./translate.js";

await game.import("card", function () {
	return {
		name: "欢乐卡牌",
		connect: true,
		card,
		skill,
		translate,
		list,
	};
});
