export * as rank from "./rank.js";
export * as pile from "./pile.js";

export const junList = ["liubei", "zhangjiao", "sunquan", "caocao", "jin_simayi"];

export const substitute = {
	gz_shichangshi: [
		//似了
		["gz_shichangshi_dead", ["character:shichangshi_dead", "die:shichangshi"]],
		//没似
		["gz_scs_zhangrang", ["character:scs_zhangrang", "die:shichangshi"]],
		["gz_scs_zhaozhong", ["character:scs_zhaozhong", "die:shichangshi"]],
		["gz_scs_sunzhang", ["character:scs_sunzhang", "die:shichangshi"]],
		["gz_scs_bilan", ["character:scs_bilan", "die:shichangshi"]],
		["gz_scs_xiayun", ["character:scs_xiayun", "die:shichangshi"]],
		["gz_scs_hankui", ["character:scs_hankui", "die:shichangshi"]],
		["gz_scs_lisong", ["character:scs_lisong", "die:shichangshi"]],
		["gz_scs_duangui", ["character:scs_duangui", "die:shichangshi"]],
		["gz_scs_guosheng", ["character:scs_guosheng", "die:shichangshi"]],
		["gz_scs_gaowang", ["character:scs_gaowang", "die:shichangshi"]],
		//似了
		["gz_scs_zhangrang_dead", ["character:scs_zhangrang_dead", "die:shichangshi"]],
		["gz_scs_zhaozhong_dead", ["character:scs_zhaozhong_dead", "die:shichangshi"]],
		["gz_scs_sunzhang_dead", ["character:scs_sunzhang_dead", "die:shichangshi"]],
		["gz_scs_bilan_dead", ["character:scs_bilan_dead", "die:shichangshi"]],
		["gz_scs_xiayun_dead", ["character:scs_xiayun_dead", "die:shichangshi"]],
		["gz_scs_hankui_dead", ["character:scs_hankui_dead", "die:shichangshi"]],
		["gz_scs_lisong_dead", ["character:scs_lisong_dead", "die:shichangshi"]],
		["gz_scs_duangui_dead", ["character:scs_duangui_dead", "die:shichangshi"]],
		["gz_scs_guosheng_dead", ["character:scs_guosheng_dead", "die:shichangshi"]],
		["gz_scs_gaowang_dead", ["character:scs_gaowang_dead", "die:shichangshi"]],
	],
};
