import { lib, game, ui, get, ai, _status } from "noname";

const dynamicTranslates = {
	sxrmdancui(player, skill) {
		const bool = player.getStorage(skill, false);
		let type = !bool ? get.poptip("sxrm_qidingSkill") : "锁定技";
		let forced = !bool ? "可以" : "须";
		return `${type}。当你造成伤害时，你${forced}弃置两张牌（无牌则不弃，不足则全弃），令此伤害+1。`;
	},
	sxrmqishi(player, skill) {
		const bool = player.getStorage(skill, false);
		let type = !bool ? get.poptip("sxrm_qidingSkill") : "锁定技";
		let forced = !bool ? "可以" : "";
		return `${type}。结束阶段，你${forced}获得本回合其他角色进入弃牌堆的至多五张牌，然后你跳过下个摸牌阶段。`;
	},
	sxrmbiyi(player, skill) {
		const bool = player.getStorage(skill, false);
		let sk = player.storage.sxrmfusui_skill;
		let yang = sk ? `【${get.translation(sk)}】` : "无技能",
			yin = "【枭姬】";
		if (bool) {
			yin = `<span class='bluetext'>${yin}</span>`;
		} else {
			yang = `<span class='firetext'>${yang}</span>`;
		}
		let start = "转换技，你视为拥有：",
			end = "。当你发动上述对应技能后，切换本技能状态。";
		return `${start}阳：${yang}；阴：${yin}${end}`;
	},
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
