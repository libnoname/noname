import { lib } from "../../main/utils.js";

/** @type { importCharacterConfig['character'] } */
const characters = {
	diy_caocao: {
		sex: "male",
		group: "wei",
		hp: 4,
		skills: ["xicai", "diyjianxiong", "hujia"],
		names: "曹|操",
	},
	diy_weiyan: {
		sex: "male",
		group: "shu",
		hp: 4,
		skills: ["diykuanggu"],
		names: "魏|延",
	},
	diy_sp_zhouyu: {
		sex: "male",
		group: "wu",
		hp: 3,
		skills: ["xiongzi", "yaliang"],
		names: "周|瑜",
		img: "extension/杀海拾遗/image/character/diy_zhouyu.jpg",
	},
	diy_luxun: {
		sex: "male",
		group: "wu",
		hp: 3,
		skills: ["shaoying", "zonghuo"],
		names: "陆|逊",
	},
	diy_yuji: {
		sex: "male",
		group: "qun",
		hp: 3,
		skills: ["diyguhuo", "diychanyuan"],
	},
	diy_zhouyu: {
		sex: "male",
		group: "wu",
		hp: 3,
		skills: ["jieyan", "honglian"],
		names: "周|瑜",
	},
	diy_caiwenji: {
		sex: "female",
		group: "qun",
		hp: 3,
		skills: ["beige", "guihan"],
		names: "蔡|琰",
	},
	diy_lukang: {
		sex: "male",
		group: "wu",
		hp: 4,
		skills: ["luweiyan", "qianxun"],
		clans: ["吴郡陆氏"],
	},
	diy_zhenji: {
		sex: "female",
		group: "wei",
		hp: 3,
		skills: ["diy_jiaoxia", "yiesheng"],
	},
	old_majun: {
		sex: "male",
		group: "wei",
		hp: 3,
		skills: ["xinfu_jingxie", "xinfu_qiaosi"],
	},
};

for (let i in characters) {
	if (!characters[i].img) {
		characters[i].img = "extension/杀海拾遗/image/character/" + i + ".jpg";
	}
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
}

export default characters;
