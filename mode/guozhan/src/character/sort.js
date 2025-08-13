import normal, { sort as normalSort } from "./normal.js";
import zhen, { sort as zhenSort } from "./zhen.js";
import shi, { sort as shiSort } from "./shi.js";
import bian, { sort as bianSort } from "./bian.js";
import quan, { sort as quanSort } from "./quan.js";

export default {
	[normalSort]: Object.keys(normal),
	[zhenSort]: Object.keys(zhen),
	[shiSort]: Object.keys(shi),
	[bianSort]: Object.keys(bian),
	[quanSort]: Object.keys(quan),
	guozhan_jun: ["gz_jun_caocao", "gz_jun_sunquan", "gz_jun_liubei", "gz_jun_zhangjiao", "gz_jun_jin_simayi"],
	guozhan_single: ["gz_re_xushu", "gz_yanbaihu", "gz_wujing", "gz_dongzhao", "gz_huangzu", "gz_zhugeke", "gz_liuba", "gz_zhuling"],
	// 谷爱凌
	guozhan_double: ["gz_db_wenyang", "gz_tangzi", "gz_liuqi", "gz_mengda", "gz_mifangfushiren", "gz_zhanglu", "gz_shixie", "gz_xuyou", "gz_xiahouba", "gz_panjun", "gz_xf_sufei", "gz_wenqin", "gz_pengyang"],
	// 野心家
	guozhan_yexinjia: ["gz_zhonghui", "gz_simazhao", "gz_gongsunyuan", "gz_sunchen", "gz_zhugedan", "gz_pot_weiyan", "gz_re_lvbu", "gz_yl_yuanshu", "gz_jsrg_liuyan"],
	// 晋势力
	guozhan_jin: ["gz_jin_simayi", "gz_jin_simazhao", "gz_jin_simashi", "gz_jin_zhangchunhua", "gz_jin_wangyuanji", "gz_jin_xiahouhui", "gz_duyu", "gz_zhanghuyuechen", "gz_jin_yanghuiyu", "gz_simazhou", "gz_shibao", "gz_weiguan", "gz_zhongyan", "gz_yangyan", "gz_zuofen", "gz_xinchang", "gz_xuangongzhu", "gz_yangzhi"],
	guozhan_jinEX1: ["gz_simaliang", "gz_simalun", "gz_jin_guohuai", "gz_wangjun", "gz_malong", "gz_new_jin_simayi", "gz_new_jin_zhangchunhua"],
	guozhan_jinEX2: ["gz_wenyang", "gz_bailingyun", "gz_sunxiù", "gz_yangjun", "gz_wangxiang"],
	guozhan_zongheng: ["gz_huaxin", "gz_luyusheng", "gz_zongyu", "gz_miheng", "gz_fengxi", "gz_dengzhi", "gz_re_xunchen", "gz_dc_yanghu"],
	guozhan_decade: ["gz_pk_sp_duyu", "gz_wangling", "gz_wangji", "gz_yanyan", "gz_xin_zhuran", "gz_gaoshun", "gz_jin_jiachong", "gz_jin_yanghu"],
	guozhan_wushuang: ["gz_zhangyao", "gz_caochun","gz_mizhu" ,"gz_shichangshi", "gz_yj_zhanghe", "gz_gaolan", "gz_caoang", "gz_zhangxingcai", "gz_luzhi", "gz_quyi", "gz_caoying", "gz_guansuo", "gz_zhangxuan", "gz_guanyinping", "gz_xinxianying"],
	guozhan_mobile: ["gz_sp_duyu"],
	guozhan_qunxiong: ["gz_xf_huangquan", "gz_guohuai", "gz_guanqiujian", "gz_zhujun", "gz_chengong", "gz_re_xugong"],
	guozhan_online: ["gz_liuyan", "gz_re_xusheng", "gz_ol_sb_sunjian", "gz_re_huanggai", "gz_re_xuzhu", "gz_ol_weiyan", "gz_ol_yanwen"],
	guozhan_tw: ["gz_tw_tianyu", "gz_tw_liufuren", "gz_tw_xiahoushang", "gz_fuwan", "gz_old_huaxiong", "gz_yangxiu"],
	guozhan_others: ["gz_ol_lisu", "gz_mazhong", "gz_bulianshi", "gz_caozhen", "gz_maliang", "gz_re_panshu", "gz_tengyin", "gz_xurong", "gz_xianglang", "gz_zumao", "gz_zhugejin", "gz_zhouyi", "gz_lingcao", "gz_beimihu", "gz_lvlingqi", "gz_yangwan", "gz_chendao", "gz_lifeng", "gz_liaohua", "gz_jianggan", "gz_wangyi", "gz_key_ushio", "gz_re_nanhualaoxian"],
};
