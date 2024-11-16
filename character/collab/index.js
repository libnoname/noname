import { lib, game, ui, get, ai, _status } from "../../noname.js";
import characters from "./character.js";
import cards from "./card.js";
import pinyins from "./pinyin.js";
import skills from "./skill.js";
import translates from "./translate.js";
import characterIntros from "./intro.js";
import { characterFilters, characterInitFilters } from "./characterFilter.js";
import characterReplaces from "./characterReplace.js";
import dynamicTranslates from "./dynamicTranslate.js";
import voices from "./voices.js";
import { characterSort, characterSortTranslate } from "./sort.js";

game.import("character", function () {
	return {
		name: "collab",
		connect: true,
		character: { ...characters },
		characterSort: {
			collab: characterSort,
		},
		characterSubstitute: {
			zhutiexiong: [
				["wu_zhutiexiong", ["die:zhutiexiong"]],
			],
			liuxiecaojie: [
				["liuxiecaojie_shadow", []],
			],
		},
		characterFilter: { ...characterFilters },
		characterInitFilter: { ...characterInitFilters },
		characterTitle: {},
		dynamicTranslate: { ...dynamicTranslates },
		characterIntro: { ...characterIntros },
		characterReplace: { ...characterReplaces },
		card: { ...cards },
		skill: { ...skills },
		translate: { ...translates, ...voices, ...characterSortTranslate },
		pinyins: { ...pinyins },
	};
});
