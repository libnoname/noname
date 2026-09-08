import characters from "./character.js";

const characterSort = {
	mjs_sort_sanguoyunqi: [],
	mjs_sort_chuhanzhizheng: [],
	mjs_sort_hezonglianheng: [],
	mjs_sort_qinsaoliuhe: [
		"mjs_jingke", "mjs_qinwuyang", "mjs_zhaoji", "mjs_lvbuwei","mjs_luzhonglian", "mjs_junwanghou", 
		"mjs_gaojianli", "mjs_baqing", "mjs_yingzheng", "mjs_wangjian", "mjs_taizidan", "mjs_weiliao", 
		"mjs_baiqi", "mjs_lixin", "mjs_xiangyan", "mjs_lumochou", "mjs_houying", "mjs_zhuhai", 
		"mjs_weijiu", "mjs_pangnuan", "mjs_zhaoshe", "mjs_limu", "mjs_hane", "mjs_zhengguo", 
	],
	mjs_sort_hanwushengshi: [
		"mjs_liuche", "mjs_chenajiao", "mjs_weiqing", "mjs_huoqubing", "mjs_dongzhongshu", "mjs_liguang",
		"mjs_zhangqian", "mjs_weizifu", "mjs_sanghongyang", "mjs_pingyanggongzhu", "mjs_huoguang", "mjs_zhaojieyu", "mjs_lifuren", 
		"mjs_zhuowenjun", "mjs_simaxiangru", "mjs_zhufuyan", "mjs_guojie", "mjs_liuju", "mjs_guosheren", 
		"mjs_zhongjun", "mjs_hananguo", 
	],
	mjs_sort_jinluoxingti: [],
	mjs_sort_jiangxintiangong: ["mjs_yanshi", "mjs_majun"],
	mjs_sort_hanqueyichen: ["mjs_liufuling"],
};

const list = Object.values(characterSort).flat();

for (const name in characters) {
	if (list.includes(name)) {
		continue;
	} else if (["donghan", "wei", "shu", "wu", "huangjin"].includes(characters[name].group)) {
		characterSort.mjs_sort_sanguoyunqi.add(name);
	}
	else if (["han", "yan", "zhao", "wèi", "chu", "qi", "daqin", "zhāngchǔ"].includes(characters[name].group)) {
		characterSort.mjs_sort_hezonglianheng.add(name);
	}
	else if (["xihan", "xichu"].includes(characters[name].group)) {
		characterSort.mjs_sort_chuhanzhizheng.add(name);
	} else if (["xijin"].includes(characters[name].group)) {
		characterSort.mjs_sort_jinluoxingti.add(name);
	}
}

const characterSortTranslate = {
	mjs_sort_hezonglianheng: "合纵连横",
	mjs_sort_sanguoyunqi: "三国云起",
	mjs_sort_chuhanzhizheng: "楚汉之争",
	mjs_sort_qinsaoliuhe: "秦扫六合",
	mjs_sort_hanwushengshi: "汉武盛世",
	mjs_sort_jinluoxingti: "晋洛兴替",
	mjs_sort_jiangxintiangong: "匠心天工",
	mjs_sort_hanqueyichen: "汉阙遗尘",
};

export { characterSort, characterSortTranslate };
