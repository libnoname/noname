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
		name: "mobile",
		connect: true,
		character: { ...characters },
		characterSort: {
			mobile: characterSort,
		},
		characterFilter: { ...characterFilters },
		characterTitle: {},
		dynamicTranslate: { ...dynamicTranslates },
		characterIntro: { ...characterIntros },
		characterReplace: { ...characterReplaces },
		characterSubstitute: {
			mb_caomao: [
				["mb_caomao_shadow", ["die:mb_caomao"]],
				["mb_caomao_dead", ["die:mb_caomao"]],
			],
			shichangshi: [["shichangshi_dead", ["die:shichangshi"]]],
			scs_zhangrang: [["scs_zhangrang_dead", ["die:scs_zhangrang"]]],
			scs_zhaozhong: [["scs_zhaozhong_dead", ["die:scs_zhaozhong"]]],
			scs_sunzhang: [["scs_sunzhang_dead", ["die:scs_sunzhang"]]],
			scs_bilan: [["scs_bilan_dead", ["die:scs_bilan"]]],
			scs_xiayun: [["scs_xiayun_dead", ["die:scs_xiayun"]]],
			scs_hankui: [["scs_hankui_dead", ["die:scs_hankui"]]],
			scs_lisong: [["scs_lisong_dead", ["die:scs_lisong"]]],
			scs_duangui: [["scs_duangui_dead", ["die:scs_duangui"]]],
			scs_guosheng: [["scs_guosheng_dead", ["die:scs_guosheng"]]],
			scs_gaowang: [["scs_gaowang_dead", ["die:scs_gaowang"]]],
		},
		card: { ...cards },
		skill: { ...skills },
		perfectPair: { ...perfectPairs },
		translate: { ...translates, ...voices, ...characterSortTranslate },
		pinyins: { ...pinyins },
	};
});
