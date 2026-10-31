/** @type { importCharacterConfig['character'] } */
const character = {
	pal_lixiaoyao: {
		sex: "male",
		group: "qun",
		hp: 4,
		skills: ["tianjian", "xjyufeng"],
	},
	pal_zhaoliner: {
		sex: "female",
		group: "wei",
		hp: 3,
		skills: ["huimeng", "tianshe"],
	},
	pal_linyueru: {
		sex: "female",
		group: "wei",
		hp: 3,
		skills: ["guiyuan", "qijian"],
	},
	pal_anu: {
		sex: "female",
		group: "wu",
		hp: 3,
		skills: ["lingdi", "anwugu"],
		names: "null|奴",
	},

	pal_wangxiaohu: {
		sex: "male",
		group: "qun",
		hp: 4,
		skills: ["husha"],
	},
	pal_sumei: {
		sex: "female",
		group: "shu",
		hp: 3,
		skills: ["sheying", "dujiang", "huahu"],
	},
	pal_shenqishuang: {
		sex: "female",
		group: "wei",
		hp: 3,
		skills: ["qixia", "jianzhen", "binxin"],
	},

	pal_jingtian: {
		sex: "male",
		group: "wu",
		hp: 3,
		skills: ["sajin", "jtjubao"],
	},
	pal_xuejian: {
		sex: "female",
		group: "shu",
		hp: 3,
		skills: ["xshuangren", "shenmu", "duci"],
		names: "唐|雪见",
	},
	pal_longkui: {
		sex: "female",
		group: "qun",
		hp: 3,
		skills: ["fenxing", "diewu", "lingyu"],
	},
	pal_zixuan: {
		sex: "female",
		group: "wei",
		hp: 3,
		skills: ["shuiyun", "wangyou", "changnian"],
	},
	pal_changqing: {
		sex: "male",
		group: "wei",
		hp: 4,
		skills: ["luanjian", "ctianfu"],
		names: "徐|长卿",
	},

	pal_nangonghuang: {
		sex: "male",
		group: "wei",
		hp: 3,
		skills: ["zhaoyao", "sheling", "zhangmu"],
		names: "南宫|煌",
	},
	pal_wenhui: {
		sex: "female",
		group: "shu",
		hp: 4,
		skills: ["huxi", "longxiang"],
	},
	pal_wangpengxu: {
		sex: "female",
		group: "shu",
		hp: 3,
		skills: ["duxinshu", "feixu"],
	},
	pal_xingxuan: {
		sex: "male",
		group: "wei",
		hp: 3,
		skills: ["feizhua", "leiyu", "lingxue"],
		names: "周|煊",
	},
	pal_leiyuange: {
		sex: "male",
		group: "shu",
		hp: 4,
		skills: ["feng", "ya", "song"],
	},

	pal_yuntianhe: {
		sex: "male",
		group: "wu",
		hp: 4,
		skills: ["longxi", "zhuyue", "guanri"],
	},
	pal_hanlingsha: {
		sex: "female",
		group: "shu",
		hp: 3,
		skills: ["tannang", "tuoqiao"],
	},
	pal_liumengli: {
		sex: "female",
		group: "wei",
		hp: 3,
		skills: ["tianxian", "runxin", "xjzhimeng"],
	},
	pal_murongziying: {
		sex: "male",
		group: "wei",
		hp: 4,
		skills: ["xuanning", "poyun", "qianfang"],
		names: "慕容|紫英",
	},
	pal_xuanxiao: {
		sex: "male",
		group: "wei",
		hp: 4,
		skills: ["xuanyan", "ningbin", "xfenxin"],
	},

	pal_jiangyunfan: {
		sex: "male",
		group: "wei",
		hp: 4,
		skills: ["xunying", "liefeng"],
	},
	pal_tangyurou: {
		sex: "female",
		group: "shu",
		hp: 3,
		skills: ["txianqu", "qiongguang"],
	},
	pal_longyou: {
		sex: "male",
		group: "wei",
		hp: 4,
		skills: ["yuexing", "minsha"],
	},
	pal_xiaoman: {
		sex: "female",
		group: "shu",
		hp: 3,
		skills: ["anwugu", "lingquan", "shenwu"],
		names: "韩|小蛮",
	},

	pal_xiahoujinxuan: {
		sex: "male",
		group: "shu",
		hp: 3,
		skills: ["xuanmo", "danqing"],
		names: "夏侯|瑾轩",
	},
	pal_muchanglan: {
		sex: "female",
		group: "wu",
		hp: 3,
		skills: ["feixia", "lueying"],
	},
	pal_xia: {
		sex: "female",
		group: "shu",
		hp: 3,
		skills: ["xjzongyu", "fanling"],
		names: "null|瑕",
	},
	pal_jiangcheng: {
		sex: "male",
		group: "qun",
		hp: 4,
		skills: ["yanzhan", "fenshi"],
	},

	pal_yuejinzhao: {
		sex: "male",
		group: "wei",
		hp: 4,
		skills: ["ywuhun", "xjyingfeng"],
	},
	pal_yueqi: {
		sex: "female",
		group: "wei",
		hp: 3,
		skills: ["tianwu", "liguang", "shiying"],
	},
	pal_mingxiu: {
		sex: "female",
		group: "shu",
		hp: 3,
		skills: ["linghuo", "guijin", "chengxin"],
	},
	pal_xianqing: {
		sex: "male",
		group: "qun",
		hp: 4,
		skills: ["xtanxi", "xiaoyue"],
	},
	pal_luozhaoyan: {
		sex: "female",
		group: "shu",
		hp: 4,
		skills: ["fenglue", "tanhua"],
	},
	pal_jushifang: {
		sex: "male",
		group: "shu",
		hp: 3,
		skills: ["yujia", "xiepan", "yanshi"],
	},
};

for (let i in character) {
	character[i].img = "extension/杀海拾遗/image/character/" + i + ".jpg";
}

export default character;
