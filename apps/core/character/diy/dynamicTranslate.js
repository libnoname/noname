import { lib, game, ui, get, ai, _status } from "noname";

const dynamicTranslates = {
	nsjiquan(player) {
		if (player.storage.nsfuwei) {
			return "锁定技，与你距离1以内的其他角色造成或受到伤害后，你将其区域内的一张牌置于你的武将牌上（称为“威”）。你使用【杀】的次数上限+X（X为“威”数）。";
		}
		return "与你距离1以内的其他角色造成或受到伤害后，你可以将其区域内的一张牌置于你的武将牌上（称为“威”）。你使用【杀】的次数上限+X（X为“威”数）。";
	},
	abyusa_jueqing(player) {
		if (player.storage.abyusa_jueqing_rewrite) {
			return "锁定技，你即将造成的伤害均视为失去体力。";
		}
		return "当你对其他角色造成伤害时，你可以令此伤害值+X。若如此做，你失去X点体力，并于此伤害结算完成后修改〖绝情〗（X为伤害值）。";
	},
	tomoya_shangxian(player) {
		if (player.storage.tomoya_shangxian) {
			return "锁定技，你计算与其他角色的距离时始终从顺时针方向计算。出牌阶段开始时，你可摸一张牌，并改变此方向。";
		}
		return "锁定技，你计算与其他角色的距离时始终从逆时针方向计算。出牌阶段开始时，你可摸一张牌，并改变此方向。";
	},
	yui_lieyin(player) {
		if (player.storage._ichiban_no_takaramono) {
			return "锁定技，出牌阶段开始时，你可选择一项：①本阶段内的红色牌均视为【杀】；②本阶段内的【杀】均视为【决斗】。";
		}
		return "锁定技，出牌阶段开始时，你选择一项：①本阶段内的红色牌均视为【杀】；②本阶段内的【杀】均视为【决斗】。";
	},
	yuzuru_kunfen(player) {
		if (player.storage._yuzuru_sss) {
			return "锁定技，结束阶段，你摸两张牌。然后你可以将两张牌交给一名其他角色。";
		}
		return "锁定技，结束阶段，你失去1点体力并摸两张牌。然后你可以将两张牌交给一名其他角色。";
	},
	yuzuru_quji(player) {
		if (player.storage._yuzuru_sss) {
			return "出牌阶段限一次，你可以弃置X张牌并选择至多等量已受伤的其他角色，这些角色各回复1点体力。（X为你已损失的体力值）";
		}
		return "出牌阶段限一次，你可以弃置X张牌并选择至多等量已受伤的其他角色，这些角色各回复1点体力。若你以此法弃置了黑色牌，则你失去1点体力。（X为你已损失的体力值）";
	},
	kamome_jieban(player) {
		if (player.storage.kamome_jieban) {
			return '转换技。每回合限一次，当你受到或造成伤害后，阴：你可将两张牌交给一名其他角色，然后其交给你一张牌。<span class="bluetext">阳：你可将一张牌交给一名其他角色，然后其交给你两张牌。</span>';
		}
		return '转换技。每回合限一次，当你受到或造成伤害后，<span class="bluetext">阴：你可将两张牌交给一名其他角色，然后其交给你一张牌。</span>阳：你可将一张牌交给一名其他角色，然后其交给你两张牌。';
	},
	shiroha_guying(player) {
		var str = "当你受到伤害/对其他角色造成伤害时，你";
		if (!player.storage.shiroha_jiezhao) {
			str = "锁定技，每回合限一次，" + str;
		}
		if (player.storage.shiroha_jiezhao) {
			str += "可";
		}
		str += "进行判定。若结果为红色/黑色，此伤害-1/+1。";
		return str;
	},
	nsdiewu(player) {
		if (player.storage.nspojian) {
			return "当你获得两张或更多的牌后/受到伤害后，你获得一个“蝶舞”标记；你可移去一枚“蝶舞”标记，然后视为使用一张【杀】。当你以此法使用【杀】造成伤害后，则你摸一张牌。";
		}
		return "当你获得两张或更多的牌后/受到伤害后，你获得一个“蝶舞”标记；你可移去一枚“蝶舞”标记，然后视为使用一张【杀】或【闪】。当你以此法使用【杀】造成伤害后，则你摸一张牌。";
	},
	nsfuzhou(player) {
		var str = "出牌阶段限";
		str += player.storage.nstaiping ? "两" : "一";
		str += "次。你可以将一张黑色牌置于一名角色的判定区内，称为“符”。其于判定阶段进行“符”判定，若判定结果为：黑色，其受到";
		str += player.storage.nsfuzhou_damage ? "两" : "一";
		str += "点雷属性伤害并弃置一张牌；红色，你摸两张牌，";
		str += player.storage.nsfuzhou_draw ? "该角色回复1点体力并摸一张牌，且本回合的手牌上限+1。" : "且该角色本回合手牌上限减1。";
		return str;
	},
	nsguidao(player) {
		if (player.storage.nstaiping) {
			return "一名角色的判定牌生效前，你可以打出一张牌替换之。";
		}
		return "一名角色的判定牌生效前，你可以打出一张黑色牌替换之。";
	},
	junkchigang(player) {
		if (player.storage.junkchigang) {
			return '转换技，锁定技。判定阶段开始前，你取消此阶段。然后你获得一个额外的：阴，摸牌阶段；<span class="bluetext">阳，出牌阶段。</span>';
		}
		return '转换技，锁定技。判定阶段开始前，你取消此阶段。然后你获得一个额外的：<span class="bluetext">阴，摸牌阶段</span>；阳，出牌阶段。';
	},
};
export default dynamicTranslates;
