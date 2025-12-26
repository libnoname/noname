import { lib, game, ui, get, ai, _status } from "noname";

const dynamicTranslates = {
	nzry_longnu(player) {
		const bool = player.hasSkill("nzry_longnu_2") || player.storage.nzry_longnu;
		let yang = "你失去1点体力并摸一张牌，然后本阶段内你的红色手牌均视为火【杀】且无距离限制",
			yin = "你减1点体力上限并摸一张牌，然后本阶段内你的锦囊牌均视为雷【杀】且无使用次数限制";
		if (bool) {
			yin = `<span class='bluetext'>${yin}</span>`;
		} else {
			yang = `<span class='firetext'>${yang}</span>`;
		}
		let start = "转换技，锁定技。出牌阶段开始时，",
			end = "。";
		return `${start}阳：${yang}；阴：${yin}${end}`;
	},
	fengliao(player) {
		const bool = player.storage.fengliao;
		let yang = "你令其摸一张牌",
			yin = "你对其造成1点火焰伤害";
		if (bool) {
			yin = `<span class='bluetext'>${yin}</span>`;
		} else {
			yang = `<span class='firetext'>${yang}</span>`;
		}
		let start = "锁定技，转换技。你使用牌指定唯一目标后，",
			end = "。";
		return `${start}阳：${yang}；阴：${yin}${end}`;
	},
};
export default dynamicTranslates;
