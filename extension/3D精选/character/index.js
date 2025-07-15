import { lib, game, ui, get, ai, _status } from "../../../noname.js";
import characters from "./character.js";
import cards from "./card.js";
import pinyins from "./pinyin.js";
import skills from "./skill.js";
import translates from "./translate.js";
import characterIntros from "./intro.js";
import characterFilters from "./characterFilter.js";
import dynamicTranslates from "./dynamicTranslate.js";
import voices from "./voices.js";
import { characterSort, characterSortTranslate } from "./sort.js";

game.import("character", function () {
	return {
		name: "ddd",
		connect: true,
		character: { ...characters },
		characterSort: {
			ddd: characterSort,
		},
		characterFilter: { ...characterFilters },
		characterTitle: {
			ddd_handang: "#g晓ャ绝对",
			ddd_wuzhi: "#g沸治·克里夫",
			ddd_xujing: "#g沸治·克里夫",
			ddd_caomao: "#gRocxu",
			ddd_xinxianying: "#g好孩子系我",
			ddd_xianglang: "#g会乱武的袁绍",
			ddd_liuye: "#g好孩子系我",
			ddd_baosanniang: "#g会乱武的袁绍",
			ddd_wangkanglvkai: "#g扬林",
			ddd_yujin: "#g虎鲸",
			ddd_caoshuang: "#g辰木",
			ddd_zhenji: "#g巴德",
			ddd_zhaoang: "#g君腾天下",
			ddd_xuelingyun: "#gGENTOVA07",
			ddd_liuhong: "#g拉普拉斯",
			ddd_xiahouxuan: "#g好孩子系我",
			ddd_zhouchu: "#g志文",
			ddd_kebineng: "#g晨星",
			ddd_zhangkai: "#g拼音",
			ddd_liuba: "#g浅水",
			ddd_jianshuo: "#g浅水",
			ddd_guanning: "#g虎鲸",
			ddd_lie: "#gyyuaN",
			ddd_liangxi: "#g先負",
			ddd_sunliang: "#g空照",
			ddd_qianzhao: "#g林己",
			ddd_zhangmiao: "#g厨房给好友",
			ddd_liuchong: "#g扬林0602",
			ddd_luoxian: "#g绝代倾国倾城貌",
		},
		dynamicTranslate: { ...dynamicTranslates },
		characterIntro: { ...characterIntros },
		card: { ...cards },
		skill: { ...skills },
		translate: { ...translates, ...voices, ...characterSortTranslate },
		pinyins: { ...pinyins },
	};
});
