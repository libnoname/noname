import cards from "../mode/guozhan/src/card/index.js";
import guozhanSkills from "../mode/guozhan/src/skill/character/rest.js";
import translate from "../mode/guozhan/src/translate/card/index.js";
import { jiubianExtra } from "../mode/guozhan/src/info/pile.js";

const type = "card";
const cardNames = ["duoduo", "qiaoqu", "fendao", "tuqiong", "gouwei", "lveshan", "zhanshejian", "yangsuiqiang", "huohuanyi", "baiqilin", "tianlu", "yingwubei", "dunjiatianshu", "jiuzhouding"];
const skillNames = ["yangsuiqiang_skill", "dunjiatianshu_skill", "huohuanyi_prevent", "huohuanyi_damage", "zhanshejian_skill", "baiqilin_skill", "yingwubei_skill", "jiuzhouding_skill", "tianlu_skill"];
const ruleSkillNames = ["_jiuzhouding_place", "_jiubian_qizhen_viewer", "_jiubian_lveshan_mod", "_jiubian_lveshan_gain", "_gz_jiubian_qizhen_rule"];

const pick = (source, names) => {
	const result = {};
	for (const name of names) {
		if (source[name]) {
			result[name] = source[name];
		}
	}
	return result;
};

const jiubian = {
	name: "jiubian",
	connect: true,
	card: pick(cards, cardNames),
	skill: {
		...pick(cards, skillNames),
		...pick(guozhanSkills, ruleSkillNames),
	},
	translate: {
		jiubian: "九变篇",
		...pick(
			translate,
			cardNames.concat(
				cardNames.map(name => `${name}_info`),
				skillNames,
				skillNames.map(name => `${name}_info`)
			)
		),
		jiubian_cardsInfo: "<li>此包为国战九变篇补充牌，共52张，须与国战标准版牌堆（108张）混合使用。<br><li>不能与势备篇牌堆同时使用。<br><li>此包中的8张装备牌均带有“奇珍”规则。<br><li>武将皮肤感谢B站UP主星河依旧长明0929提供。",
	},
	list: jiubianExtra,
	help: {
		九变篇: '<div style="margin:10px">奇珍</div><ul style="margin-top:0"><li>此扩展包中的8张装备牌均有奇珍标记。<br><li>装备区里拥有奇珍牌的角色受到【杀】造成的伤害后，伤害来源可以获得其装备区内的一张奇珍牌。<br><li>奇珍牌进入弃牌堆时仍属于弃牌堆，洗牌时正常洗入新牌堆。</ul>',
	},
};

export { jiubian as default, type };
