import { lib, game, ui, get, ai, _status } from "../../noname.js";

const dynamicTranslates = {
	eu_zhitong(player) {
		const bool = player.storage.eu_zhitong;
		let yang = "自己，摸两张牌且回复1点体力",
			yin = "其他角色，你获得其装备区所有牌并对其造成1点伤害";
		if (bool) {
			yin = `<span class='bluetext'>${yin}</span>`;
		} else {
			yang = `<span class='firetext'>${yang}</span>`;
		}
		let start = "转换技，当你使用牌时，若目标包含，",
			end = "。";
		return `${start}阳：${yang}；阴：${yin}${end}`;
	},
	peyuanjue(player) {
		const bool = player.storage.peyuanjue;
		let yang = "令所有角色的基本牌视为无次数限制的【杀】",
			yin = "令所有角色与你互相计算距离为1，且你视为拥有〖同忾〗";
		if (bool) {
			yin = `<span class='bluetext'>${yin}</span>`;
		} else {
			yang = `<span class='firetext'>${yang}</span>`;
		}
		let start = "转换技。摸牌阶段开始时，你可以跳过摸牌阶段，",
			end = "。";
		return `${start}阳：${yang}；阴：${yin}${end}`;
	},
	yjjiechu(player) {
		const bool = player.getStorage("yjjiechu", false);
		let yang = "出牌阶段，你可以视为使用一张【顺手牵羊】，结算结束后成为目标的角色可以对你使用一张【杀】",
			yin = "当你成为【杀】的目标时，你可以弃置一张手牌改变【杀】的花色和属性";
		if (bool) {
			yin = `<span class='bluetext'>${yin}</span>`;
		} else {
			yang = `<span class='firetext'>${yang}</span>`;
		}
		let start = "转换技。",
			end = "。";
		return `${start}阳：${yang}；阴：${yin}${end}`;
	},
	scls_miaojian(player) {
		if (player.hasMark("scls_miaojian")) {
			return "出牌阶段限一次，你可视为使用一张刺【杀】或【无中生有】。";
		}
		return "出牌阶段限一次，你可将一张基本牌当做刺【杀】使用，或将一张非基本牌当做【无中生有】使用。";
	},
	scls_lianhua(player) {
		if (player.hasMark("scls_lianhua")) {
			return "当你成为【杀】的目标后，你摸一张牌。然后此【杀】的使用者需弃置一张牌，否则此【杀】对你无效。";
		}
		return "当你成为【杀】的目标后，你摸一张牌。";
	},
	jdjuqi(player) {
		const bool = player.storage.jdjuqi;
		let yang = "你摸三张牌；其他角色的准备阶段，其可以展示并交给你一张黑色手牌",
			yin = "你令你本回合使用牌无次数限制且造成的伤害+1；其他角色的准备阶段，其可以展示并交给你一张红色手牌";
		if (bool) {
			yin = `<span class='bluetext'>${yin}</span>`;
		} else {
			yang = `<span class='firetext'>${yang}</span>`;
		}
		let start = "转换技。准备阶段，",
			end = "。";
		return `${start}阳：${yang}。阴：${yin}${end}`;
	},
	jdlongdan(player) {
		return lib.translate["jdlongdan" + (player.hasSkill("sblongdan_mark", null, null, false) ? "x" : "") + "_info"];
	},
	tylongnu(player) {
		const bool = player.hasSkill("tylongnu_yang") || (player.storage.tylongnu && !player.hasSkill("tylongnu_yin"));
		let yang = "失去1点体力，然后此阶段内你可以将红色手牌当无距离限制的火【杀】使用或打出",
			yin = "减少1点体力上限，然后此阶段内你可以将锦囊牌当无次数限制的雷【杀】使用或打出";
		if (bool) {
			yin = `<span class='bluetext'>${yin}</span>`;
		} else {
			yang = `<span class='firetext'>${yang}</span>`;
		}
		let start = "转换技。游戏开始时，你可以改变此转换技的状态。出牌阶段开始时，你可以摸一张牌并：",
			end = "。";
		return `${start}阳：${yang}；阴：${yin}${end}`;
	},
	tyqianshou(player) {
		const bool = player.storage.tyqianshou;
		let yang = "你可展示并交给其一张红色牌，本回合你不能使用手牌且你与其不能成为牌的目标",
			yin = "你可令其展示并交给你一张牌，若此牌不为黑色，你失去1点体力";
		if (bool) {
			yin = `<span class='bluetext'>${yin}</span>`;
		} else {
			yang = `<span class='firetext'>${yang}</span>`;
		}
		let start = "转换技。其他角色的回合开始时，若其体力值大于你，或其未处于横置状态，",
			end = "。";
		return `${start}阳：${yang}；阴：${yin}${end}`;
	},
	tyliupo(player) {
		const bool = player.storage.tyliupo;
		let yang = "所有角色不能使用【桃】",
			yin = "所有即将造成的伤害均视为体力流失";
		if (bool) {
			yin = `<span class='bluetext'>${yin}</span>`;
		} else {
			yang = `<span class='firetext'>${yang}</span>`;
		}
		let start = "转换技。回合开始时，你令本轮：",
			end = "。";
		return `${start}阳：${yang}；阴：${yin}${end}`;
	},
	yyyanggu(player) {
		const bool = player.storage.yyyanggu;
		let yang = "当你受到伤害后，你可以回复1点体力",
			yin = "你可以将一张手牌当作【声东击西】使用";
		if (bool) {
			yin = `<span class='bluetext'>${yin}</span>`;
		} else {
			yang = `<span class='firetext'>${yang}</span>`;
		}
		let start = "转换技。",
			end = "。";
		return `${start}阳：${yang}；阴：${yin}${end}`;
	},
	hm_shice(player) {
		const bool = player.storage.hm_shice;
		let yang = "当你受到属性伤害时，若你的技能数不大于伤害来源，你可以防止此伤害并视为使用一张【火攻】",
			yin = "当你不因此技能使用牌指定唯一目标后，你可以令其弃置装备区任意张牌，然后此牌额外结算X次（X为其装备区的牌数）";
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
