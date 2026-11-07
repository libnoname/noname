import { lib } from "noname";
const Character = lib.element.Character;

export default {
	gz_jiananfeng: new Character({
		sex: "female",
		group: "ye",
		hp: 3,
		maxHp: 3,
		skills: ["gz_liaoye", "gz_fangzi", "gz_liudu"],
		img: "image/character/gz_zifeng_jiananfeng.jpg",
		names: "贾|南风",
	}),
	gz_simajiong: new Character({
		sex: "male",
		group: "jin",
		hp: 3,
		maxHp: 3,
		skills: ["gz_chuchong", "gz_dufu"],
		img: "image/character/gz_zifeng_simajiong.jpg",
		names: "司马|冏",
	}),
	gz_simaying: new Character({
		sex: "male",
		group: "jin",
		hp: 4,
		maxHp: 4,
		skills: ["gz_chengguan"],
		img: "image/character/gz_zifeng_simaying.jpg",
		names: "司马|颖",
	}),
	gz_simayong: new Character({
		sex: "male",
		group: "jin",
		hp: 4,
		maxHp: 4,
		skills: ["gz_jianyi", "gz_gouni"],
		img: "image/character/gz_zifeng_simayong.jpg",
		names: "司马|颙",
	}),
	gz_simayue: new Character({
		sex: "male",
		group: "jin",
		hp: 4,
		maxHp: 4,
		skills: ["gz_huluan", "gz_yinfu"],
		img: "image/character/gz_zifeng_simayue.jpg",
		names: "司马|越",
	}),
	gz_simawei: new Character({
		sex: "male",
		group: "jin",
		hp: 4,
		maxHp: 4,
		skills: ["gz_guorui"],
		img: "image/character/gz_zifeng_simawei.jpg",
		names: "司马|玮",
	}),
	gz_simayi_bawang: new Character({
		sex: "male",
		group: "jin",
		hp: 4,
		maxHp: 4,
		skills: ["gz_fengguo"],
		img: "image/character/gz_zifeng_simayi_bawang.jpg",
		names: "司马|乂",
	}),
};

export const sort = "guozhan_zifeng";
