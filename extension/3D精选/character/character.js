import { lib, game, ui, get, ai, _status } from "../../../noname.js";

/** @type { importCharacterConfig['character'] } */
const characters = {
	ddd_handang: {
		sex: "male",
		group: "wu",
		hp: 4,
		skills: ["dddxianxi"],
	},
	ddd_wuzhi: {
		sex: "male",
		group: "wei",
		hp: 3,
		skills: ["dddlingyong", "dddxuxiao"],
	},
	ddd_xujing: {
		sex: "male",
		group: "shu",
		hp: 3,
		skills: ["dddxuyu", "dddshijian"],
	},
	ddd_caomao: {
		sex: "male",
		group: "wei",
		hp: 3,
		skills: ["dddtaisi", "dddquche", "dddqianlong"],
		isZhugong: true,
	},
	ddd_xinxianying: {
		sex: "female",
		group: "wei",
		hp: 3,
		skills: ["ddddongcha", "dddzhijie"],
	},
	ddd_xianglang: {
		sex: "male",
		group: "shu",
		hp: 3,
		skills: ["dddqiahua", "dddfusi", "dddtuoji"],
	},
	ddd_yujin: {
		sex: "male",
		group: "wei",
		hp: 4,
		skills: ["dddzhengjun"],
	},
	ddd_liuye: {
		sex: "male",
		group: "wei",
		hp: 3,
		skills: ["dddchashi", "dddqice"],
	},
	ddd_baosanniang: {
		sex: "female",
		group: "shu",
		hp: 3,
		skills: ["dddzhilian", "dddjijian"],
	},
	ddd_zhenji: {
		sex: "female",
		group: "wei",
		hp: 3,
		skills: ["dddmiaoxing", "dddfushi"],
	},
	ddd_zhaoang: {
		sex: "male",
		group: "wei",
		hp: 4,
		skills: ["dddfenji"],
	},
	ddd_zhouchu: {
		sex: "male",
		group: "wu",
		hp: 5,
		skills: ["dddxiaheng"],
	},
	ddd_liuba: {
		sex: "male",
		group: "shu",
		hp: 3,
		skills: ["dddfengzheng", "dddyulv"],
	},
	ddd_jianshuo: {
		sex: "male",
		group: "qun",
		hp: 4,
		skills: ["dddfenye", "dddshichao"],
	},
	ddd_guanning: {
		sex: "male",
		group: "qun",
		hp: 3,
		skills: ["dddyouxue", "dddchengjing"],
	},
	ddd_dingfeng: {
		sex: "male",
		group: "wu",
		hp: 4,
		skills: ["dddduanbing"],
	},
	ddd_caoshuang: {
		sex: "male",
		group: "wei",
		hp: 5,
		skills: ["dddzhuanshe", "dddweiqiu"],
	},
	ddd_xuelingyun: {
		sex: "female",
		group: "wei",
		hp: 3,
		skills: ["dddlianer", "dddanzhi"],
	},
	ddd_liuhong: {
		sex: "male",
		group: "qun",
		hp: 4,
		skills: ["dddshixing", "ddddanggu", "dddfuzong"],
		isZhugong: true,
	},
	ddd_xiahouxuan: {
		sex: "male",
		group: "wei",
		hp: 3,
		skills: ["dddlanghuai", "dddxuanlun"],
		names: "夏侯|玄",
	},
	ddd_zhangkai: {
		sex: "male",
		group: "qun",
		hp: 3,
		maxHp: 4,
		skills: ["dddjiexing", "dddbailei"],
	},
	ddd_liangxi: {
		sex: "male",
		group: "wei",
		hp: 4,
		skills: ["dddtongyu"],
	},
	ddd_wangkanglvkai: {
		sex: "male",
		group: "shu",
		hp: 4,
		skills: ["dddbingjian"],
		names: "王|伉-吕|凯",
	},
	ddd_sunliang: {
		sex: "male",
		group: "wu",
		hp: 3,
		skills: ["ddddiedang", "dddanliu", "dddguiying"],
		isZhugong: true,
	},
	ddd_lie: {
		sex: "female",
		group: "wu",
		hp: 3,
		skills: ["dddyeshen", "dddqiaoduan"],
	},
	ddd_kebineng: {
		sex: "male",
		group: "qun",
		hp: 4,
		skills: ["dddxiaoxing", "dddlangzhi", "dddfuyi"],
		isZhugong: true,
		names: "null|null",
	},
	ddd_qianzhao: {
		sex: "male",
		group: "wei",
		hp: 4,
		skills: ["dddyuanzhen", "dddzhishu"],
	},
	ddd_zhangmiao: {
		sex: "male",
		group: "qun",
		hp: 4,
		skills: ["dddxiaxing"],
	},
	ddd_zhangcheng: {
		sex: "male",
		group: "wu",
		hp: 3,
		skills: ["dddjuxian", "dddjungui"],
	},
	ddd_liuchong: {
		sex: "male",
		group: "qun",
		hp: 4,
		skills: ["dddjinggou", "dddmoyan"],
	},
	ddd_luoxian: {
		sex: "male",
		group: "shu",
		hp: 4,
		skills: ["dddshilie"],
	},
};

for (let i in characters) {
	characters[i].img = "extension/3D精选/image/character/" + i + ".jpg";
}

if (lib.characterReplace) {
	for (let i in characters) {
		const name = i.slice(4);
		if (!lib.character[name]) {
			continue;
		}
		if (!lib.characterReplace[name]) {
			lib.characterReplace[name] = [name, i];
		} else {
			lib.characterReplace[name].push(i);
		}
	}
	if (!lib.characterReplace.tw_jianshuo) {
		lib.characterReplace.tw_jianshuo = ["tw_jianshuo", "ddd_jianshuo"];
	} else {
		lib.characterReplace.tw_jianshuo.push("ddd_jianshuo");
	}
}

export default characters;
