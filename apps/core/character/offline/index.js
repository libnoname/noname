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
		characterTitle: { ...characterTitles },
		characterSubstitute: {
			jd_sb_sp_zhugeliang: [["sb_zhugeliang", []]],
			shinin_zhenji: [["awaken_shinin_zhenji", []]],
			shinin_wuguotai: [["awaken_shinin_wuguotai", []]],
			shinin_ruiji: [["awaken_shinin_ruiji", []]],
			shinin_lvlingqi: [["awaken_shinin_lvlingqi", []]],
			shinin_dongwan: [["awaken_shinin_dongwan", []]],
			zc26_sp_xushi: [["zc26_sp_xushi_shadow", ["die:xushi"]]],
		},
		dynamicTranslate: { ...dynamicTranslates },
		characterIntro: { ...characterIntros },
		card: { ...cards },
		skill: { ...skills },
		translate: { ...translates, ...voices, ...characterSortTranslate },
		pinyins: { ...pinyins },
	};
});
