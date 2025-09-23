import { Character } from "../../../../noname/library/element/index.js";

export default {
	gz_cuimao: new Character({
		sex: "male",
		group: "wei",
		hp: 3,
		maxHp: 3,
		hujia: 0,
		skills: ["gz_zhengbi", "gz_fengying"],
		hasSkinInGuozhan: true,
	}),
	gz_yujin: new Character({
		sex: "male",
		group: "wei",
		hp: 4,
		maxHp: 4,
		hujia: 0,
		skills: ["gz_jieyue"],
		img: "image/character/yujin_yujin.jpg",
		dieAudios: ["yujin"],
	}),
	gz_wangping: new Character({
		sex: "male",
		group: "shu",
		hp: 4,
		maxHp: 4,
		hujia: 0,
		skills: ["jianglue"],
		hasSkinInGuozhan: true,
	}),
	gz_fazheng: new Character({
		sex: "male",
		group: "shu",
		hp: 3,
		maxHp: 3,
		hujia: 0,
		skills: ["gzxuanhuo", "gzenyuan"],
		hasSkinInGuozhan: true,
		dieAudios: ["xin_fazheng"],
	}),
	gz_wuguotai: new Character({
		sex: "female",
		group: "wu",
		hp: 3,
		maxHp: 3,
		hujia: 0,
		skills: ["gzbuyi", "ganlu"],
		img: "image/character/re_wuguotai.jpg",
	}),
	gz_lukang: new Character({
		sex: "male",
		group: "wu",
		hp: 4,
		maxHp: 4,
		hujia: 0,
		skills: ["fakejueyan", "fakekeshou"],
		hasSkinInGuozhan: true,
	}),
	gz_yuanshu: new Character({
		sex: "male",
		group: "qun",
		hp: 4,
		maxHp: 4,
		hujia: 0,
		skills: ["gzweidi", "gzyongsi"],
		hasSkinInGuozhan: true,
	}),
	gz_zhangxiu: new Character({
		sex: "male",
		group: "qun",
		hp: 4,
		maxHp: 4,
		hujia: 0,
		skills: ["gzfudi", "gzcongjian"],
		hasSkinInGuozhan: true,
	}),
};

export const intro = {};

export const sort = "guozhan_quan";
