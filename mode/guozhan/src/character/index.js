import { lib } from "noname";
const Character = lib.element.Character;

import normal from "./normal.js";
import zhen from "./zhen.js";
import shi from "./shi.js";
import bian from "./bian.js";
import quan from "./quan.js";
import yingbian from "./yingbian.js";
import wushuang from "./wushuang.js";

import restCharacter from "./rest.js";

/** @type {Record<string, Character>} */
export const pack = {
	gz_shibing1wei: new Character({
		sex: "male",
		group: "wei",
		hp: 0,
		maxHp: 0,
		hujia: 0,
		skills: [],
		isUnseen: true,
	}),
	gz_shibing2wei: new Character({
		sex: "female",
		group: "wei",
		hp: 0,
		maxHp: 0,
		hujia: 0,
		skills: [],
		isUnseen: true,
	}),
	gz_shibing1shu: new Character({
		sex: "male",
		group: "shu",
		hp: 0,
		maxHp: 0,
		hujia: 0,
		skills: [],
		isUnseen: true,
	}),
	gz_shibing2shu: new Character({
		sex: "female",
		group: "shu",
		hp: 0,
		maxHp: 0,
		hujia: 0,
		skills: [],
		isUnseen: true,
	}),
	gz_shibing1wu: new Character({
		sex: "male",
		group: "wu",
		hp: 0,
		maxHp: 0,
		hujia: 0,
		skills: [],
		isUnseen: true,
	}),
	gz_shibing2wu: new Character({
		sex: "female",
		group: "wu",
		hp: 0,
		maxHp: 0,
		hujia: 0,
		skills: [],
		isUnseen: true,
	}),
	gz_shibing1qun: new Character({
		sex: "male",
		group: "qun",
		hp: 0,
		maxHp: 0,
		hujia: 0,
		skills: [],
		isUnseen: true,
	}),
	gz_shibing2qun: new Character({
		sex: "female",
		group: "qun",
		hp: 0,
		maxHp: 0,
		hujia: 0,
		skills: [],
		isUnseen: true,
	}),
	gz_shibing1jin: new Character({
		sex: "male",
		group: "jin",
		hp: 0,
		maxHp: 0,
		hujia: 0,
		skills: [],
		isUnseen: true,
	}),
	gz_shibing2jin: new Character({
		sex: "female",
		group: "jin",
		hp: 0,
		maxHp: 0,
		hujia: 0,
		skills: [],
		isUnseen: true,
	}),
	gz_shibing1ye: new Character({
		sex: "male",
		group: "ye",
		hp: 0,
		maxHp: 0,
		hujia: 0,
		skills: [],
		isUnseen: true,
	}),
	gz_shibing2ye: new Character({
		sex: "female",
		group: "ye",
		hp: 0,
		maxHp: 0,
		hujia: 0,
		skills: [],
		isUnseen: true,
	}),
	gz_shibing1key: new Character({
		sex: "male",
		group: "key",
		hp: 0,
		maxHp: 0,
		hujia: 0,
		skills: [],
		isUnseen: true,
	}),
	gz_shibing2key: new Character({
		sex: "female",
		group: "key",
		hp: 0,
		maxHp: 0,
		hujia: 0,
		skills: [],
		isUnseen: true,
	}),

	...restCharacter,
	...normal,
	...zhen,
	...shi,
	...bian,
	...quan,
	...yingbian,
	...wushuang,
};

export { default as intro } from "./intro.js";
export { default as sort } from "./sort.js";
export { default as yingbian } from "./yingbian.js";
