import { lib, game, ui, get, ai, _status } from "noname";
import characters from "./character.js";
import cards from "./card.js";
import pinyins from "./pinyin.js";
import skills from "./skill.js";
import translates from "./translate.js";
import characterTitles from "./characterTitle.js";
import characterIntros from "./intro.js";
import perfectPairs from "./perfectPairs.js";
import characterFilters from "./characterFilter.js";
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
			dc_sb_simayi: [["dc_sb_simayi_shadow", []]],
			dc_sb_zhouyu: [["dc_sb_zhouyu_shadow", []]],
			dc_sb_lusu: [["dc_sb_lusu_shadow", []]],
			dc_sb_jiaxu: [["dc_sb_jiaxu_shadow", []]],
			dc_sb_xunyu: [["dc_sb_xunyu_shadow", []]],
			dc_sb_jiangwei: [["dc_sb_jiangwei_shadow", []]],
			dc_sb_luxun: [["dc_sb_luxun_shadow", []]],
			dc_sb_pangtong: [["dc_sb_pangtong_shadow", []]],
		},
		characterFilter: { ...characterFilters },
		characterTitle: { ...characterTitles },
		dynamicTranslate: { ...dynamicTranslates },
		characterIntro: { ...characterIntros },
		perfectPair: { ...perfectPairs },
		card: { ...cards },
		skill: { ...skills },
		translate: { ...translates, ...voices, ...characterSortTranslate },
		pinyins: { ...pinyins },
	};
});
