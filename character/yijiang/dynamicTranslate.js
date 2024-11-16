import { lib, game, ui, get, ai, _status } from "../../noname.js";

const dynamicTranslates = {
	rejueqing(player) {
		if (player.storage.rejueqing_rewrite) return "锁定技，你即将造成的伤害均视为失去体力。";
		return "当你对其他角色造成伤害时，你可以令此伤害值+X。若如此做，你失去X点体力，并于此伤害结算完成后修改〖绝情〗（X为伤害值）。";
	},
	reyanzhu(player) {
		if (!player.storage.reyanzhu) return "出牌阶段限一次，你可以令一名其他角色选择一项：将装备区里的所有牌交给你并令你修改〖宴诛〗和〖兴学〗，或弃置一张牌并令下一次受到的伤害+1直到其下回合开始。";
		return "出牌阶段限一次，你可以选择一名其他角色。该角色下一次受到的伤害+1直到其下回合开始。";
	},
	rexingxue(player) {
		if (player.storage.reyanzhu) return "结束阶段开始时，你可以令至多X名角色各摸一张牌。然后若有手牌数大于体力值的目标角色，则这些角色各将一张牌置于牌堆顶。（X为你的体力上限）。";
		return "结束阶段开始时，你可以令至多X名角色各摸一张牌。然后若有手牌数大于体力值的目标角色，则这些角色各将一张牌置于牌堆顶。（X为你的体力值）。";
	},
	jiaozhao(player) {
		var num = player.countMark("xindanxin");
		if (num > 2) return "出牌阶段限两次，你可以将一张手牌当做任意基本牌或普通锦囊牌使用（你不能对自己使用此牌）。";
		if (num > 1) return "出牌阶段限一次，你可以将一张手牌当做任意基本牌或普通锦囊牌使用（你不能对自己使用此牌）。";
		if (num > 0) return "出牌阶段限一次，你可以展示一张手牌，然后选择距离最近的一名其他角色，该角色声明一张基本牌或普通锦囊牌的牌名。在此出牌阶段内，你可以将此手牌当声明的牌使用（你不能对自己使用此牌，且此牌不可被【无懈可击】响应）。";
		return "出牌阶段限一次，你可以展示一张手牌，然后选择距离最近的一名其他角色，该角色声明一张基本牌的牌名。在此出牌阶段内，你可以将此手牌当声明的牌使用（你不能对自己使用此牌，且此牌不可被【无懈可击】响应）。";
	},
	funan(player) {
		if (player.hasSkill("funan_jiexun")) return "其他角色使用或打出牌响应你使用的牌时，你可获得其使用或打出的牌。";
		return "其他角色使用或打出牌响应你使用的牌时，你可令其获得你使用的牌（其本回合不能使用或打出这些牌），然后你获得其使用或打出的牌。";
	},
	lkbushi(player) {
		var list = lib.skill.lkbushi.getBushi(player).map(i => get.translation(i));
		return "①你使用" + list[0] + "牌无次数限制。②当你使用或打出" + list[1] + "牌后，你摸一张牌。③当你成为" + list[2] + "牌的目标后，你可以弃置一张牌，令此牌对你无效。④结束阶段开始时，你从牌堆或弃牌堆获得一张" + list[3] + "牌。⑤准备阶段开始时，你可调整此技能中四种花色的对应顺序。";
	},
	diezhang(player) {
		var str = "";
		str += player.storage.duanwan ? "" : "①出牌阶段，你使用【杀】的次数上限+1。②";
		str += "转换技" + (player.storage.duanwan ? "，每回合限一次" : "") + "。";
		var cnNum = get.cnNumber(player.storage.duanwan ? 2 : 1);
		var yinStr = "阴：当你使用牌被其他角色抵消后，你可以弃置一张牌，视为对其使用" + cnNum + "张【杀】";
		var yangStr = "阳：当其他角色使用牌被你抵消后，你可以摸" + cnNum + "张牌，视为对其使用一张【杀】";
		if (player.storage.diezhang) {
			if (player.storage.duanwan) yinStr = '<span style="text-decoration: line-through; ">' + yinStr + "</span>";
			yangStr = '<span class="bluetext">' + yangStr + "</span>";
		} else {
			yinStr = '<span class="bluetext">' + yinStr + "</span>";
			if (player.storage.duanwan) yangStr = '<span style="text-decoration: line-through; ">' + yangStr + "</span>";
		}
		return str + yinStr + "；" + yangStr + "。";
	},
};

export default dynamicTranslates;
