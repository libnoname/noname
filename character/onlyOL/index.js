import { lib, game, ui, get, ai, _status } from "../../noname.js";
import characters from "./character.js";
import cards from "./card.js";
import pinyins from "./pinyin.js";
import skills from "./skill.js";
import translates from "./translate.js";
import characterIntros from "./intro.js";
import characterFilters from "./characterFilter.js";
import characterReplaces from "./characterReplace.js";
import dynamicTranslates from "./dynamicTranslate.js";
import voices from "./voices.js";
import { characterSort, characterSortTranslate } from "./sort.js";

game.import("character", function () {
	return {
		name: "onlyOL",
		connect: true,
		character: { ...characters },
		characterSort: {
			onlyOL: characterSort,
		},
		characterFilter: { ...characterFilters },
		characterTitle: {},
		dynamicTranslate: { ...dynamicTranslates },
		characterIntro: { ...characterIntros },
		characterReplace: { ...characterReplaces },
		characterSubstitute: {
			ol_sb_yuanshao: [
				["ol_sb_yuanshao_shadow", ["die:ol_sb_yuanshao"]],
			],
		},
		card: { ...cards },
		skill: { ...skills },
		translate: { ...translates, ...voices, ...characterSortTranslate },
		pinyins: { ...pinyins },
	};
});
