export * as rank from "./rank.js";
export * as pile from "./pile.js";

export const junList = ["liubei", "zhangjiao", "sunquan", "caocao", "jin_simayi"];

export const substitute = {
	gz_shichangshi: [
		["gz_shichangshi_dead", ["character:shichangshi_dead", "die:shichangshi"]],
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
	],
};
