import { lib, game, ui, get, ai, _status } from "noname";

const dynamicTranslates = {
	huamao_wushen(player, skill) {
		const suit = get.translation(get.info("wxdl_huamao").getSuit(player, skill));
		return `锁定技。①你的${suit}手牌均视为【杀】。②你使用${suit}【杀】无距离和次数限制且不可被响应。`;
	},
	huamao_liushi(player, skill) {
		const suit = get.translation(get.info("wxdl_huamao").getSuit(player, skill));
		return `出牌阶段，你可以将一张${suit}牌置于牌堆顶，视为对一名角色使用一张【杀】（无距离限制且不计入使用次数）。当此【杀】造成伤害后，受到伤害的角色获得一个“流”。有“流”的角色手牌上限-X（X为其“流”数）。`;
	},
	huamao_gongxin(player, skill) {
		const suit = get.translation(get.info("wxdl_huamao").getSuit(player, skill));
		return `出牌阶段限一次，你可以观看一名其他角色的手牌，并可以展示其中一张${suit}牌，然后将其弃置或置于牌堆顶。`;
	},
	huamao_tianxiang(player, skill) {
		const suit = get.translation(get.info("wxdl_huamao").getSuit(player, skill));
		return `当你受到伤害时，你可以弃置一张${suit}手牌，防止此次伤害并选择一名其他角色，然后你选择一项：1.令其受到伤害来源对其造成的1点伤害，然后摸X张牌（X为其已损失体力值且至多为5）；2.令其失去1点体力，然后获得你弃置的牌。`;
	},
	huamao_guose(player, skill) {
		const suit = get.translation(get.info("wxdl_huamao").getSuit(player, skill));
		return `出牌阶段限一次，你可以选择一项：将一张${suit}牌当做【乐不思蜀】使用；或弃置一张${suit}牌并弃置场上的一张【乐不思蜀】。选择完成后，你摸一张牌。`;
	},
	huamao_limu(player, skill) {
		const suit = get.translation(get.info("wxdl_huamao").getSuit(player, skill));
		return `出牌阶段，你可以将一张${suit}牌当做【乐不思蜀】对自己使用，然后回复1点体力。只要你的判定区内有牌，你对攻击范围内的其他角色使用牌便没有次数和距离限制。`;
	},
	huamao_fengpo(player, skill) {
		const suit = get.translation(get.info("wxdl_huamao").getSuit(player, skill));
		return `每种牌名各限一次。当你每回合使用的第一张【杀】或【决斗】指定目标后，若目标角色数为1，你可以选择一项：1.摸X张牌，令此牌的伤害值基数+1；2.摸一张牌，令此牌的伤害值基数+X（X为其${suit}牌的数量）。`;
	},
	huamao_jiexun(player, skill) {
		const suit = get.translation(get.info("wxdl_huamao").getSuit(player, skill));
		return `结束阶段，你可令一名其他角色摸等同于场上${suit}牌数的牌，然后弃置X张牌（X为此前该技能发动过的次数）。若有角色因此法弃置了所有牌，则你将X归零，然后你发动〖复难〗时，无须令对方获得你使用的牌。`;
	},
	huamao_leiji(player, skill) {
		const suit = get.translation(get.info("wxdl_huamao").getSuit(player, skill));
		return `当你使用或打出一张【闪】时，你可令任意一名角色进行一次判定。若结果为${suit}，其受到2点雷电伤害。`;
	},
	huamao_zuoding(player, skill) {
		const suit = get.translation(get.info("wxdl_huamao").getSuit(player, skill));
		return `当其他角色于其回合内使用${suit}牌指定目标后，若本回合内没有角色受到过伤害，则你可以令其中一名目标角色摸一张牌。`;
	},
	huamao_miehai(player, skill) {
		const suit = get.translation(get.info("wxdl_huamao").getSuit(player, skill));
		return `你可以将两张牌当作无距离次数限制的刺【杀】使用。此【杀】结算完成后，此过程中正面失去${suit}牌且已受伤的角色摸两张牌并回复1点体力。`;
	},
	huamao_jiyu(player, skill) {
		const suit = get.translation(get.info("wxdl_huamao").getSuit(player, skill));
		return `出牌阶段限一次，你可以令一名角色弃置一张手牌。若如此做，你不能使用与之相同花色的牌，直到回合结束。若其以此法弃置的牌为${suit}，你翻面并令其失去1点体力。若你有未被〖讥谀〗限制的手牌，则你可以继续发动此技能，但不能选择本回合已经选择过的目标。`;
	},
	huamao_luoying(player, skill) {
		const suit = get.translation(get.info("wxdl_huamao").getSuit(player, skill));
		return `当其他角色的${suit}牌因弃置或判定而进入弃牌堆后，你可以获得之。`;
	},
	huamao_lianhuan(player, skill) {
		const suit = get.translation(get.info("wxdl_huamao").getSuit(player, skill));
		return `你可以将${suit}手牌当作【铁索连环】使用或重铸。`;
	},
	huamao_zhujiu(player, skill) {
		const suit = get.translation(get.info("wxdl_huamao").getSuit(player, skill));
		return `你可以将至少X+1张牌当【酒】使用（X为你本回合已使用过【酒】的次数），然后若这些牌存在非${suit}牌，此技能失效直到回合结束。`;
	},
	huamao_ninghan(player, skill) {
		const suit = get.translation(get.info("wxdl_huamao").getSuit(player, skill));
		return `锁定技。①所有角色手牌中的${suit}【杀】均视为冰【杀】。②当一名角色受到冰冻伤害后，你将造成此伤害的牌对应的实体牌置入“城”。`;
	},
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
