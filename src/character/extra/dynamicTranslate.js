import { lib, game, ui, get, ai, _status } from "noname";

const dynamicTranslates = {
	nzry_longnu(player) {
		const bool = player.hasSkill("nzry_longnu_2") || player.storage.nzry_longnu;
		let yang = "你失去1点体力并摸等同于你损失体力值张牌，然后本回合你的红色手牌均视为【火【杀】】（无距离限制）",
			yin = "你减1点体力上限并摸等同于你体力值张牌，然后本回合你的锦囊牌均视为【雷【杀】】（无次数限制且不计入次数限制）";
		if (bool) {
			yin = `<span class='bluetext'>${yin}</span>`;
		} else {
			yang = `<span class='firetext'>${yang}</span>`;
		}
		let start = "转换技，锁定技。出牌阶段开始时，",
			end = "。";
		return `${start}阳：${yang}；阴：${yin}${end}`;
	},
};
export default dynamicTranslates;
