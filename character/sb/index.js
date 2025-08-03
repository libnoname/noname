import { lib, game, ui, get, ai, _status } from "../../noname.js";
import characters from "./character.js";
import cards from "./card.js";
import pinyins from "./pinyin.js";
import skills from "./skill.js";
import translates from "./translate.js";
import characterIntros from "./intro.js";
import characterFilters from "./characterFilter.js";
import dynamicTranslates from "./dynamicTranslate.js";
import voices from "./voices.js";
import { characterSort, characterSortTranslate } from "./sort.js";

game.import("character", function () {
	//strategy and battle, "sb" in short ——Spmario233
	return {
		name: "sb",
		connect: true,
		character: { ...characters },
		characterSort: {
			sb: characterSort,
		},
		characterFilter: { ...characterFilters },
		characterTitle: {},
		characterSubstitute: {
			sb_sp_zhugeliang: [["sb_zhugeliang", []]],
		},
		dynamicTranslate: { ...dynamicTranslates },
		characterIntro: { ...characterIntros },
		card: { ...cards },
		skill: { ...skills },
		translate: { ...translates, ...voices, ...characterSortTranslate },
		pinyins: { ...pinyins },
	};
});
