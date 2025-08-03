import { lib, game, ui, get, ai, _status } from "../../noname.js";

const dynamicTranslates = {
	clanlianzhu(player) {
		const bool = player.storage.clanlianzhu;
		let yang = "Ａ可以重铸一张牌，然后你可以重铸一张牌。若这两张牌颜色相同，则你的手牌上限-1",
			yin = "Ａ可以令你选择一名在你或Ａ攻击范围内的另一名其他角色Ｂ，然后Ａ和你可依次选择是否对Ｂ使用一张【杀】。若这两张【杀】颜色不同，则你的手牌上限+1";
		if (bool) {
			yin = `<span class='bluetext'>${yin}</span>`;
		} else {
			yang = `<span class='firetext'>${yang}</span>`;
		}
		let start = "转换技。每名角色Ａ的出牌阶段限一次，",
			end = "。";
		return `${start}阳：${yang}；阴：${yin}${end}`;
	},
	clanguangu(player) {
		const bool = player.storage.clanguangu;
		let yang = "你可以观看牌堆顶的至多四张牌",
			yin = "你可以观看一名角色的至多四张手牌";
		if (bool) {
			yin = `<span class='bluetext'>${yin}</span>`;
		} else {
			yang = `<span class='firetext'>${yang}</span>`;
		}
		let start = "转换技。出牌阶段限一次，",
			end = "，然后你可以使用其中的一张牌。";
		return `${start}阳：${yang}；阴：${yin}${end}`;
	},
	clanjiexuan(player) {
		const bool = (player.storage?.clanjiexuan || 0) % 2;
		let yang = "你可以将一张红色牌当【顺手牵羊】使用",
			yin = "你可以将一张黑色牌当【过河拆桥】使用";
		if (bool) {
			yin = `<span class='bluetext'>${yin}</span>`;
		} else {
			yang = `<span class='firetext'>${yang}</span>`;
		}
		let start = "限定技，转换技。",
			end = "。";
		return `${start}阳：${yang}；阴：${yin}${end}`;
	},
};
export default dynamicTranslates;
