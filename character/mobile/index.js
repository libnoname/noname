import { lib, game, ui, get, ai, _status } from "noname";
import characters from "./character.js";
import cards from "./card.js";
import pinyins from "./pinyin.js";
import skills from "./skill.js";
import translates from "./translate.js";
import characterIntros from "./intro.js";
import characterFilters from "./characterFilter.js";
import characterTitles from "./characterTitle.js";
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
		characterTitle: { ...characterTitles },
		dynamicTranslate: { ...dynamicTranslates },
		characterIntro: { ...characterIntros },
		characterSubstitute: {
			mb_caomao: [
				["mb_caomao_shadow", ["die:mb_caomao"]],
				["mb_caomao_dead", ["die:mb_caomao"]],
			],
			shichangshi: [["shichangshi_dead", ["die:shichangshi"]]],
			scs_zhangrang: [["scs_zhangrang_dead", ["die:shichangshi"]]],
			scs_zhaozhong: [["scs_zhaozhong_dead", ["die:shichangshi"]]],
			scs_sunzhang: [["scs_sunzhang_dead", ["die:shichangshi"]]],
			scs_bilan: [["scs_bilan_dead", ["die:shichangshi"]]],
			scs_xiayun: [["scs_xiayun_dead", ["die:shichangshi"]]],
			scs_hankui: [["scs_hankui_dead", ["die:shichangshi"]]],
			scs_lisong: [["scs_lisong_dead", ["die:shichangshi"]]],
			scs_duangui: [["scs_duangui_dead", ["die:shichangshi"]]],
			scs_guosheng: [["scs_guosheng_dead", ["die:shichangshi"]]],
			scs_gaowang: [["scs_gaowang_dead", ["die:shichangshi"]]],
			pot_taishici: [
				["pot_taishici_shadow1", ["die:pot_taishici"]],
				["pot_taishici_shadow2", ["die:pot_taishici"]],
				["pot_taishici_shadow3", ["die:pot_taishici"]],
				["pot_taishici_shadow4", ["die:pot_taishici"]],
			],
			pot_weiyan: [
				["pot_weiyan_achieve", []],
				["pot_weiyan_fail", []],
			],
			mb_simazhao: [["jin_jsrg_simazhao", []]],
			pot_yuji: [["pot_yuji_shadow", []]],
			mb_zerong: [
				["mb_zerong_red", ["die:mb_zerong"]],
				["mb_zerong_black", ["die:mb_zerong"]],
				["mb_zerong_all", ["die:mb_zerong"]],
			],
			mb_cuilingyi: [
				["mb_cuilingyi_guidian1", ["character:mb_cuilingyi", "die:mb_cuilingyi"]],
				["mb_cuilingyi_guidian2", ["die:mb_cuilingyi"]],
				["mb_cuilingyi_guidian3", ["die:mb_cuilingyi"]],
				["mb_cuilingyi_dongjiao1", ["die:mb_cuilingyi"]],
				["mb_cuilingyi_dongjiao2", ["die:mb_cuilingyi"]],
				["mb_cuilingyi_dongjiao3", ["die:mb_cuilingyi"]],
				["mb_cuilingyi_xiuge1", ["die:mb_cuilingyi"]],
				["mb_cuilingyi_xiuge2", ["die:mb_cuilingyi"]],
				["mb_cuilingyi_xiuge3", ["die:mb_cuilingyi"]],
			],
		},
		card: { ...cards },
		skill: { ...skills },
		perfectPair: { ...perfectPairs },
		translate: { ...translates, ...voices, ...characterSortTranslate },
		pinyins: { ...pinyins },
	};
});
