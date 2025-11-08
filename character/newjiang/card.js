import { lib, game, ui, get, ai, _status } from "../../noname.js";

const cards = {
	gongqiao_equip: {
		type: "equip",
		derivation: "yj_majun",
		fullskin: true,
		image: "image/card/majun_gongqiao.png",
		cardPrompt(card) {
			let str = `原本是一张装备牌。`,
				subtypes = get.subtypes(card);
			if (subtypes?.length) {
				str = `${str.slice(0, -1)}，被置入了${subtypes.map(i => `${get.translation(i)}栏`).join("、")}。`;
			}
			return str;
		},
		ai: {
			basic: {
				equipValue: 0.1,
			},
		},
	},
	gongqiao_trick: {
		type: "trick",
		derivation: "yj_majun",
		fullskin: true,
		image: "image/card/majun_gongqiao.png",
		cardPrompt(card) {
			let str = `原本是一张锦囊牌。`,
				subtypes = get.subtypes(card);
			if (subtypes?.length) {
				str = `${str.slice(0, -1)}，被置入了${subtypes.map(i => `${get.translation(i)}栏`).join("、")}。`;
			}
			return str;
		},
		ai: {
			basic: {
				equipValue: 4,
			},
		},
	},
	gongqiao_basic: {
		type: "basic",
		derivation: "yj_majun",
		fullskin: true,
		image: "image/card/majun_gongqiao.png",
		cardPrompt(card) {
			let str = `原本是一张基本牌。`,
				subtypes = get.subtypes(card);
			if (subtypes?.length) {
				str = `${str.slice(0, -1)}，被置入了${subtypes.map(i => `${get.translation(i)}栏`).join("、")}。`;
			}
			return str;
		},
		ai: {
			basic: {
				equipValue: 3,
			},
		},
	},
	lukai_spade: {
		fullskin: true,
		noname: true,
	},
	lukai_heart: {
		fullskin: true,
		noname: true,
	},
	lukai_diamond: {
		fullskin: true,
		noname: true,
	},
	lukai_club: {
		fullskin: true,
		noname: true,
	},
};

export default cards;
