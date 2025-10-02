import { Character } from "../../../../noname/library/element/index.js";

export default {
	gz_dengai: new Character({
		sex: "male",
		group: "wei",
		hp: 4,
		maxHp: 4,
		hujia: 0,
		skills: ["tuntian", "ziliang", "gz_jixi"],
		hasSkinInGuozhan: true,
	}),
	gz_caohong: new Character({
		sex: "male",
		group: "wei",
		hp: 4,
		maxHp: 4,
		hujia: 0,
		skills: ["fake_huyuan", "heyi"],
		hasSkinInGuozhan: true,
	}),
	gz_jiangfei: new Character({
		sex: "male",
		group: "shu",
		hp: 3,
		maxHp: 3,
		hujia: 0,
		skills: ["gz_shengxi", "gz_shoucheng"],
		hasSkinInGuozhan: true,
	}),
	gz_jiangwei: new Character({
		sex: "male",
		group: "shu",
		hp: 4,
		maxHp: 4,
		hujia: 0,
		skills: ["tiaoxin", "yizhi", "tianfu"],
		hasSkinInGuozhan: true,
	}),
	gz_xusheng: new Character({
		sex: "male",
		group: "wu",
		hp: 4,
		maxHp: 4,
		hujia: 0,
		skills: ["gz_yicheng_new"],
		hasSkinInGuozhan: true,
	}),
	gz_jiangqing: new Character({
		sex: "male",
		group: "wu",
		hp: 4,
		maxHp: 4,
		hujia: 0,
		skills: ["gz_shangyi", "niaoxiang"],
	}),
	gz_hetaihou: new Character({
		sex: "female",
		group: "qun",
		hp: 3,
		maxHp: 3,
		hujia: 0,
		skills: ["zhendu", "qiluan"],
		hasSkinInGuozhan: true,
	}),
	gz_yuji: new Character({
		sex: "male",
		group: "qun",
		hp: 3,
		maxHp: 3,
		hujia: 0,
		skills: ["qianhuan"],
		hasSkinInGuozhan: true,
	}),
};

export const intro = {};

export const sort = "guozhan_zhen";
