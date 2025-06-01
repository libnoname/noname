import { Character } from "../../../../noname/library/element/index.js";

export default {
	gz_sp_duyu: new Character({
		sex: "male",
		group: "qun",
		hp: 4,
		maxHp: 4,
		hujia: 0,
		skills: ["fakezhufu"],
	}),
	gz_wangji: new Character({
		sex: "male",
		group: "wei",
		hp: 3,
		maxHp: 3,
		hujia: 0,
		skills: ["fakeqizhi", "fakejinqu"],
	}),
	gz_yangyan: new Character({
		sex: "female",
		group: "jin",
		hp: 3,
		maxHp: 3,
		hujia: 0,
		skills: ["fakexuanbei", "xianwan"],
	}),
	gz_shibao: new Character({
		sex: "male",
		group: "jin",
		hp: 4,
		maxHp: 4,
		hujia: 0,
		skills: ["fakezhuosheng", "fakejuhou"],
	}),
	gz_simazhou: new Character({
		sex: "male",
		group: "jin",
		hp: 4,
		maxHp: 4,
		hujia: 0,
		skills: ["fakecaiwang", "fakenaxiang"],
	}),
};
