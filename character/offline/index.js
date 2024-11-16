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
		name: "offline",
		connect: true,
		connectBanned: ["zhangliang", "yj_tianchuan"],
		character: { ...characters },
		characterSort: {
			offline: characterSort,
		},
		characterFilter: { ...characterFilters },
		characterTitle: {
			jsp_liubei: "S1019",
			ns_caoanmin: "S1023",
			longyufei: "S1044",
			ps1059_guojia: "S1059",
			ps_lvbu: "S1061",
			ps1062_zhouyu: "S1062",
			ps_jiaxu: "S1066",
			ps_jin_simayi: "S1067",
			ps_guanyu: "S2065",
			ps2063_zhaoyun: "S2063",
			ps2066_zhugeliang: "S2066",
			ps2067_zhaoyun: "S2067",
			ps2068_simayi: "S2068",
			ps_machao: "S2069",
			ps2070_guojia: "S2070",
			ps_simayi: "S2073",
			ps_zhugeliang: "S2073",
			ps_caopi: "S2075",
			ns_jiaxu: "S2079",
			ps2080_zhouyu: "S2080",
			ps_caozhi: "S2081",
			ps_shen_machao: "SX015",
		},
		characterSubstitute: {
			jd_sb_sp_zhugeliang: [["sb_zhugeliang", []]],
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
