import { lib, game, ui, get, ai, _status } from "noname";

const dynamicTranslates = {
	jsrgshichong(player) {
		const bool = player.storage.jsrgshichong;
		let yang = "你可以获得目标角色一张手牌",
			yin = "目标角色可以交给你一张手牌";
		if (bool) {
			yin = `<span class='bluetext'>${yin}</span>`;
		} else {
			yang = `<span class='firetext'>${yang}</span>`;
		}
		let start = "转换技。当你使用牌指定其他角色为唯一目标后，",
			end = "。";
		return `${start}阳：${yang}；阴：${yin}${end}`;
	},
	jsrgdangren(player) {
		const bool = player.storage.jsrgdangren;
		let yang = "当你需要对自己使用【桃】时，你可以视为使用之",
			yin = "当你可以对其他角色使用【桃】时，你须视为使用之";
		if (bool) {
			yin = `<span class='bluetext'>${yin}</span>`;
		} else {
			yang = `<span class='firetext'>${yang}</span>`;
		}
		let start = "转换技。",
			end = "。";
		return `${start}阳：${yang}；阴：${yin}${end}`;
	},
};

export default dynamicTranslates;
