import { lib, game, ui, get, ai, _status } from "noname";

const dynamicTranslates = {
	sxrmcongfeng(player, skill) {
		const bool = player.getStorage(skill, false);
		let yang = "与使用者各摸一张牌",
			yin = "弃置使用者两张牌";
		if (bool) {
			yin = `<span class='bluetext'>${yin}</span>`;
		} else {
			yang = `<span class='firetext'>${yang}</span>`;
		}
		let start = "转换技，你使用牌或成为牌的目标后，你可以",
			end = "。";
		return `${start}阳：${yang}；阴：${yin}${end}`;
	},
	sxrmweiwo_rende(player, skill) {
		const targets = player.getStorage(skill);
		let info = lib.translate[`${skill}_info`];
		if (!targets?.length) {
			return info;
		}
		let str = `${get.translation(targets)}${targets.length > 1 ? "中的一人" : ""}`;
		return info.replace("其他角色", str);
	},
	sxrmweiwo_qingnang(player, skill) {
		const targets = player.getStorage(skill);
		let info = lib.translate[`${skill}_info`];
		if (!targets?.length) {
			return info;
		}
		let str = `${get.translation(targets)}${targets.length > 1 ? "中的一人" : ""}`;
		return info.replace("一名角色", str);
	},
	sxrmweiwo_longyin(player, skill) {
		const targets = player.getStorage(skill);
		let info = lib.translate[`${skill}_info`];
		if (!targets?.length) {
			return info;
		}
		let str = `${get.translation(targets)}${targets.length > 1 ? "中的一人" : ""}`;
		return info.replace("一名角色", str);
	},
};

export default dynamicTranslates;
