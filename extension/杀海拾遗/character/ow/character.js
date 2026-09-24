/** @type { importCharacterConfig['character'] } */
const character = {
	ow_liekong: {
		sex: "female",
		group: "shu",
		hp: 3,
		skills: ["shanxian", "shanhui"],
	},
	ow_sishen: {
		sex: "male",
		group: "shu",
		hp: 4,
		skills: ["xiandan", "yihun", "shouge"],
	},
	ow_tianshi: {
		sex: "female",
		group: "qun",
		hp: 3,
		skills: ["shouhu", "ziyu", "feiying"],
	},
	ow_falaozhiying: {
		sex: "female",
		group: "shu",
		hp: 3,
		skills: ["feidan", "huoyu", "feiying"],
	},
	ow_zhixuzhiguang: {
		sex: "female",
		group: "qun",
		hp: 3,
		skills: ["guangshu"],
	},
	ow_luxiao: {
		sex: "male",
		group: "wu",
		hp: 3,
		skills: ["yuedong", "kuoyin", "huhuan"],
	},
	ow_shibing: {
		sex: "male",
		group: "shu",
		hp: 4,
		skills: ["tuji", "mujing", "lichang"],
	},
	ow_yuanshi: {
		sex: "male",
		group: "qun",
		hp: 3,
		skills: ["feiren", "lianpo", "zhanlong"],
	},
	ow_chanyata: {
		sex: "male",
		group: "qun",
		hp: 3,
		skills: ["xie", "luan", "sheng"],
	},
	ow_dva: {
		sex: "female",
		group: "shu",
		hp: 2,
		skills: ["jijia", "tuijin", "zihui", "chongzhuang"],
	},
	ow_mei: {
		sex: "female",
		group: "wei",
		hp: 3,
		skills: ["bingqiang", "jidong", "baoxue"],
	},
	ow_ana: {
		sex: "female",
		group: "wei",
		hp: 3,
		skills: ["zhiyuan", "mianzhen", "aqianghua"],
	},
	ow_heibaihe: {
		sex: "female",
		group: "qun",
		hp: 3,
		skills: ["juji", "duwen", "dulei"],
	},
	ow_maikelei: {
		sex: "male",
		group: "shu",
		hp: 4,
		skills: ["shanguang", "tiandan", "shenqiang"],
	},
	ow_kuangshu: {
		sex: "male",
		group: "shu",
		hp: 3,
		skills: ["liudan", "shoujia", "shihuo"],
	},

	ow_tuobiang: {
		sex: "male",
		group: "shu",
		hp: 3,
		skills: ["paotai", "maoding"],
	},
	ow_baolei: {
		sex: "male",
		group: "qun",
		hp: 4,
		skills: ["bshaowei", "zhencha"],
	},
	ow_banzang: {
		sex: "male",
		group: "qun",
		hp: 4,
		skills: ["bfengshi", "yinbo"],
	},
	ow_laiyinhate: {
		sex: "male",
		group: "qun",
		hp: 4,
		skills: ["zhongdun", "mengji"],
	},
	ow_luba: {
		sex: "male",
		group: "shu",
		hp: 4,
		skills: ["liangou", "xiyang"],
	},
	ow_wensidun: {
		sex: "male",
		group: "shu",
		hp: 4,
		skills: ["feitiao", "dianji"],
	},
	ow_zhaliya: {
		sex: "female",
		group: "wei",
		hp: 4,
		skills: ["pingzhang", "owliyong"],
	},

	ow_heiying: {
		sex: "female",
		group: "wei",
		hp: 3,
		skills: ["qinru", "yinshen", "maichong"],
	},
	ow_orisa: {
		sex: "female",
		group: "wu",
		hp: 4,
		skills: ["qianggu", "woliu"],
	},
};

for (let i in character) {
	character[i].img = "extension/杀海拾遗/image/character/" + i + ".jpg";
}

export default character;
