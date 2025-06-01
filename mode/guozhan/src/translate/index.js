import card from "./card/index.js";
import character from "./character/index.js";
import skill from "./skill/index.js";
import rest from "./rest.js";

export default {
	yexinjia_mark: "野心家",

	bumingzhi: "不明置",
	mingzhizhujiang: "明置主将",
	mingzhifujiang: "明置副将",
	tongshimingzhi: "同时明置",
	mode_guozhan_character_config: "国战武将",
	_zhenfazhaohuan: "阵法召唤",
	_zhenfazhaohuan_info: "由拥有阵法技的角色发起，满足此阵法技条件的未确定势力角色均可按逆时针顺序依次明置其一张武将牌(响应阵法召唤)，以发挥阵法技的效果。",

	...rest,
	...card,
	...character,
	...skill,
};

export { default as dynamic } from "./dynamic.js";
