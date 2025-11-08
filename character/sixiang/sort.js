const characterSort = {
	sixiang_shaoyin: ["std_sunhao", "std_mateng", "std_mayunlu", "std_jianggan", "std_zhouchu", "std_lvlingqi", "std_dc_yanghu", "std_dc_luotong", "std_lijue", "std_chengpu", "std_db_wenyang", "std_re_dengzhi", "std_zhangyì", "std_chengyu", "std_fanyufeng", "std_feiyi"],
	sixiang_taiyin: ["std_guanxing", "std_fuhuanghou", "std_liubiao", "std_gongsunyuan", "std_cenhun", "std_simashi", "std_sunshao", "std_jiangwan", "std_maliang", "std_xushu", "std_xuezong", "std_liuzhang", "std_wangyuanji", "std_wanglang", "std_zhonghui", "std_huaxin"],
	sixiang_shaoyang: ["std_zhangbao", "std_liuchen", "std_guansuo", "std_xiahouba", "std_caorui", "std_liuye", "std_guohuanghou", "std_lvfan", "std_dingfeng", "std_sunluban", "std_liuzan", "std_sunyi", "std_taoqian", "std_jiling", "std_liru", "std_wangyun"],
	sixiang_taiyang: ["std_tianfeng", "std_liuxie", "std_simazhao", "std_guozhao", "std_jiakui", "std_yufan", "std_zhugeke", "std_mengda", "std_caozhen", "std_dongyun", "std_baosanniang", "std_liuba", "std_kongrong", "std_zoushi", "std_sunluyu", "std_zhoufang"],
	sixiang_sort_qinglong: ["std_baoxin", "std_peixiu", "std_yangbiao", "std_huangfusong", "std_zerong", "std_pangdegong", "std_nanhualaoxian"],
	sixiang_sort_baihu: ["std_simahui", "std_zhengxuan", "std_miheng", "std_majun", "std_zhangfen", "std_zhaoyan", "std_liuli"],
	sixiang_sort_zhuque: ["std_huangwudie", "std_qinghegongzhu", "std_quyi", "std_wenyuan", "std_xushao", "std_zhangxuan", "std_jushou"],
	sixiang_zhencang: ["std_zhangyao", "std_wangfuren", "std_panglin", "std_huangchong", "std_caoxiong", "std_maohuanghou", "std_zhencong", "std_jiangjie", "std_zhengcong"],
	sixiang_trashBin: ["old_shen_zhaoyun"],
};

const characterSortTranslate = {
	sixiang_shaoyin: "四象封印·少阴",
	sixiang_taiyin: "四象封印·太阴",
	sixiang_shaoyang: "四象封印·少阳",
	sixiang_taiyang: "四象封印·太阳",
	sixiang_sort_qinglong: "四象封印·青龙",
	sixiang_sort_baihu: "四象封印·白虎",
	sixiang_sort_zhuque: "四象封印·朱雀",
	sixiang_trashBin: "四象封印·垃圾桶",
	sixiang_zhencang: "珍藏·封印",
};

export { characterSort, characterSortTranslate };
