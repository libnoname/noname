import { lib, game, ui, get, ai, _status } from "noname";
import characters from "./character.js";
import pinyins from "./pinyin.js";
import skills from "./skill.js";
import translates from "./translate.js";
import characterIntros from "./intro.js";
import characterFilters from "./characterFilter.js";
import characterTitles from "./characterTitle.js";
import perfectPairs from "./perfectPairs.js";
import characterReplaces from "./characterReplace.js";
import dynamicTranslates from "./dynamicTranslate.js";
import voices from "./voices.js";
import { characterSort, characterSortTranslate } from "./sort.js";
import characterSubstitutes from "./characterSubstitute.js";
import characterAppend from "./characterAppend.js";

game.import("character", function () {
	const mjs = {
		name: "mjs",
		connect: true,
		connectBanned: [],
		character: { ...characters },
		characterSort: {
			mjs: characterSort,
		},
		characterFilter: { ...characterFilters },
		characterTitle: {...characterTitles},
		characterIntro: { ...characterIntros },
		characterAppend: { ...characterAppend },
		characterReplace: { ...characterReplaces },
		skill: { ...skills },
		perfectPair: { ...perfectPairs },
		dynamicTranslate: { ...dynamicTranslates },
		translate: { ...translates, ...voices, ...characterSortTranslate },
		pinyins: { ...pinyins },
		characterSubstitute: {...characterSubstitutes},
	};
	if (!lib.config[`extension_名将杀_characterPack_mjs_enable`]) {
		game.saveExtensionConfig("名将杀", "characterPack_mjs_enable", true);
		lib.config.characters.add("mjs");
		game.saveConfig("characters", lib.config.characters);
	}
	return mjs;
});
