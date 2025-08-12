import { Character } from "../../../../noname/library/element/index.js";

export default {
	gz_re_lidian: new Character({
		sex: "male",
		group: "wei",
		hp: 3,
		maxHp: 3,
		hujia: 0,
		skills: ["xunxun", "wangxi"],
	}),
	gz_zangba: new Character({
		sex: "male",
		group: "wei",
		hp: 4,
		maxHp: 4,
		hujia: 0,
		skills: ["gz_hengjiang"],
		img: "image/character/tw_zangba.jpg",
	}),
	gz_madai: new Character({
		sex: "male",
		group: "shu",
		hp: 4,
		maxHp: 4,
		hujia: 0,
		skills: ["gz_md_mashu", "qianxi"],
		hasSkinInGuozhan: true,
	}),
	gz_mifuren: new Character({
		sex: "female",
		group: "shu",
		hp: 3,
		maxHp: 3,
		hujia: 0,
		skills: ["gz_guixiu", "gz_cunsi"],
	}),
	gz_sunce: new Character({
		sex: "male",
		group: "wu",
		hp: 4,
		maxHp: 4,
		hujia: 0,
		skills: ["jiang", "yingyang", "baka_hunshang"],
		hasSkinInGuozhan: true,
	}),
	gz_chendong: new Character({
		sex: "male",
		group: "wu",
		hp: 4,
		maxHp: 4,
		hujia: 0,
		skills: ["duanxie", "fake_fenming"],
		hasSkinInGuozhan: true,
	}),
	gz_sp_dongzhuo: new Character({
		sex: "male",
		group: "qun",
		hp: 4,
		maxHp: 4,
		hujia: 0,
		skills: ["hengzheng", "fake_baoling"],
	}),
	gz_zhangren: new Character({
		sex: "male",
		group: "qun",
		hp: 4,
		maxHp: 4,
		hujia: 0,
		skills: ["chuanxin", "gz_fengshi"],
	}),
};

export const intro = {};

export const sort = "guozhan_shi";
