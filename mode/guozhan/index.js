import { lib, game, ui, get, ai, _status } from "../../noname.js";
import { cast } from "../../noname/util/index.js";

import { start, startBefore, onreinit } from "./src/main.js";
import { pack, intro, sort, yingbian } from "./src/character/index.js";
import card from "./src/card/index.js";
import skill from "./src/skill/index.js";
import translate, { dynamic } from "./src/translate/index.js";
import voices from "./src/voices/index.js";
import * as info from "./src/info/index.js";
import { gamePatch, getPatch, contentPatch, playerPatch } from "./src/patch/index.js";
import help from "./src/help/index.js";

export const type = "mode";

/**
 * @type {importModeConfig}
 */
export default {
	// 模式名称
	name: "guozhan",

	// 模式启动函数
	start,
	startBefore,
	onreinit,

	// 模式的武将/卡牌/技能/翻译
	characterSort: {
		mode_guozhan: sort,
	},
	characterPack: {
		mode_guozhan: pack,
	},
	characterIntro: intro,
	card: cast(card),
	guozhanPile: info.pile.normal,
	skill: cast(skill),
	translate: {
		...translate,
		...voices,
	},
	dynamicTranslate: dynamic,
	characterSubstitute: info.substitute,

	// 模式的其余内容（诸如武将等级）
	aozhanRank: info.rank.aozhan,
	guozhanRank: info.rank.guozhan,

	// 特定配置下所需要的内容
	junList: info.junList,
	yingbian_guozhan: yingbian,
	guozhanPile_yingbian: info.pile.yingbian,
	guozhanPile_old: info.pile.old,

	// 模式自行提供的垫片函数
	game: gamePatch,
	element: {
		content: contentPatch,
		player: playerPatch,
	},
	get: getPatch,

	// 模式帮助
	help: cast(help),
};
