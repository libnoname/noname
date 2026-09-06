import { lib, game, ui, get, ai, _status } from "noname";

const dynamicTranslates = {
	chegu(player, skill) {
		const info = lib.translate[`${skill}_info`],
			num = 2 + player.countMark(`${skill}_effect`);
		return info.replaceAll("[2]", `[${num}]`);
	},
	yao_chenwei(player, skill) {
		const bool = player.storage[skill];
		let str1 = "阳：令一名角色将你的一张手牌翻面";
		let str2 = "获得一名其他角色的一张牌并将此牌背置";
		if (bool) {
			str2 = `<span class="bluetext">${str2}</span>`;
		} else {
			str1 = `<span class="firetext">${str1}</span>`;
		}
		return `转换技。当你使用背置牌时，你可以，${str1}；阴：${str2}。`;
	},
};
export default dynamicTranslates;
