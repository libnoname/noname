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
import perfectPairs from "./perfectPairs.js";
import voices from "./voices.js";
import { characterSort, characterSortTranslate } from "./sort.js";

game.import("character", function () {
	return {
		name: "newjiang",
		connect: true,
		character: { ...characters },
		characterSort: {
			newjiang: characterSort,
		},
		characterSubstitute: {
			yj_sb_guojia: [
				["yj_sb_guojia_shadow", []],
			],
		},
		characterFilter: { ...characterFilters },
		characterTitle: {},
		dynamicTranslate: { ...dynamicTranslates },
		characterIntro: { ...characterIntros },
		characterReplace: { ...characterReplaces },
		card: { ...cards },
		skill: { ...skills },
		perfectPair: { ...perfectPairs },
		translate: { ...translates, ...voices, ...characterSortTranslate },
		pinyins: { ...pinyins },
	};
});
