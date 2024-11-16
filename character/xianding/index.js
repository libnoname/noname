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
		name: "xianding",
		connect: true,
		character: { ...characters },
		characterSort: {
			xianding: characterSort,
		},
		characterSubstitute: {
			dc_sb_simayi: [
				["dc_sb_simayi_shadow", []],
			],
			dc_sb_zhouyu: [
				["dc_sb_zhouyu_shadow", []],
			],
			dc_sb_lusu: [
				["dc_sb_lusu_shadow", []],
			],
			dc_sb_jiaxu: [
				["dc_sb_jiaxu_shadow", []],
			],
		},
		characterFilter: { ...characterFilters },
		characterTitle: {
			// wulan:'#b对决限定武将',
			// leitong:'#b对决限定武将',
		},
		dynamicTranslate: { ...dynamicTranslates },
		characterIntro: { ...characterIntros },
		characterReplace: { ...characterReplaces },
		card: { ...cards },
		skill: { ...skills },
		translate: { ...translates, ...voices, ...characterSortTranslate },
		pinyins: { ...pinyins },
	};
});
