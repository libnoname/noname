/** @type { importCharacterConfig['character'] } */
const character = {
	gjqt_bailitusu: {
		sex: "male",
		group: "shu",
		hp: 4,
		skills: ["xuelu", "fanshi", "shahun"],
		names: "百里|屠苏",
	},
	gjqt_fengqingxue: {
		sex: "female",
		group: "wu",
		hp: 3,
		skills: ["qinglan", "yuehua", "gjqtwuxie"],
	},
	gjqt_xiangling: {
		sex: "female",
		group: "wu",
		hp: 3,
		skills: ["xlqianhuan", "meihu", "xidie"],
	},
	gjqt_fanglansheng: {
		sex: "male",
		group: "wu",
		hp: 3,
		skills: ["fanyin", "mingkong", "fumo"],
	},
	gjqt_yinqianshang: {
		sex: "male",
		group: "qun",
		hp: 4,
		skills: ["zuiji", "zuizhan"],
	},
	gjqt_hongyu: {
		sex: "female",
		group: "shu",
		hp: 4,
		skills: ["jianwu", "meiying"],
	},

	gjqt_yuewuyi: {
		sex: "male",
		group: "wei",
		hp: 4,
		skills: ["yanjia", "xiuhua", "liuying"],
	},
	gjqt_wenrenyu: {
		sex: "female",
		group: "shu",
		hp: 4,
		skills: ["chizhen", "dangping"],
		names: "闻人|羽",
	},
	gjqt_xiayize: {
		sex: "male",
		group: "qun",
		hp: 3,
		skills: ["xuanning", "liuguang", "yangming"],
	},
	gjqt_aruan: {
		sex: "female",
		group: "wu",
		hp: 3,
		skills: ["zhaolu", "jiehuo", "yuling"],
		names: "null|阮",
	},

	gjqt_xunfang: {
		sex: "female",
		group: "shu",
		hp: 3,
		skills: ["manwu", "xfanghua"],
	},
	gjqt_ouyangshaogong: {
		sex: "male",
		group: "shu",
		hp: 3,
		skills: ["yunyin", "shishui", "duhun"],
		names: "欧阳|少恭",
	},

	gjqt_xieyi: {
		sex: "male",
		group: "qun",
		hp: 3,
		skills: ["lingyan", "xunjian", "humeng"],
	},
	gjqt_yanjiaxieyi: {
		sex: "male",
		group: "qun",
		hp: 2,
		skills: ["xianju"],
		isUnseen: true,
	},
	gjqt_chuqi: {
		sex: "male",
		group: "qun",
		hp: 2,
		skills: ["xuanci"],
		isUnseen: true,
		names: "谢|衣",
	},

	gjqt_beiluo: {
		sex: "male",
		group: "qun",
		hp: 4,
		skills: ["lingnu", "zhenying", "cihong"],
	},
	gjqt_yunwuyue: {
		sex: "female",
		group: "wei",
		hp: 3,
		skills: ["yange", "woxue", "lianjing"],
	},
	gjqt_cenying: {
		sex: "female",
		group: "shu",
		hp: 3,
		skills: ["yunyou", "xuanzhen", "qingshu"],
	},
};

for (let i in character) {
	character[i].img = "extension/杀海拾遗/image/character/" + i + ".jpg";
}

export default character;
