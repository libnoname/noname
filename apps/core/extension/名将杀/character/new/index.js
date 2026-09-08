import { lib, game, ui, get, ai, _status } from "noname";
import characters from "./character.js";
import pinyins from "./pinyin.js";
import skills from "./skill.js";
import translates from "./translate.js";
import characterIntros from "./intro.js";
import characterFilters from "./characterFilter.js";
import characterTitles from "./characterTitle.js";
import perfectPairs from "./perfectPairs.js";
import dynamicTranslates from "./dynamicTranslate.js";
import voices from "./voices.js";
import { characterSort, characterSortTranslate } from "./sort.js";
import characterAppend from "./characterAppend.js";

game.import("character", function () {
	const mjs = {
		name: "mjsnew",
		connect: true,
		connectBanned: [],
		character: { ...characters },
		characterSort: {
			mjsnew: characterSort,
		},
		characterFilter: { ...characterFilters },
		characterTitle: {...characterTitles},
		characterIntro: { ...characterIntros },
		characterAppend: { ...characterAppend },
		skill: { ...skills },
		perfectPair: { ...perfectPairs },
		dynamicTranslate: { ...dynamicTranslates },
		translate: { ...translates, ...voices, ...characterSortTranslate },
		pinyins: { ...pinyins },
	};
	if (!lib.config[`extension_名将杀_characterPack_mjsnew_enable`]) {
		game.saveExtensionConfig("名将杀", "characterPack_mjsnew_enable", true);
		lib.config.characters.add("mjsnew");
		game.saveConfig("characters", lib.config.characters);
	}
	return mjs;
});
