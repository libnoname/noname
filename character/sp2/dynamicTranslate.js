import { lib, game, ui, get, ai, _status } from "../../noname.js";

const dynamicTranslates = {
	mubing(player) {
		if (player.storage.mubing2) {
			return "出牌阶段开始时，你可以亮出牌堆顶的四张牌。你可弃置任意张手牌，并可获得任意张点数之和不大于你弃置的牌点数之和的牌。然后你可将以此法得到的牌以任意方式交给其他角色。";
		}
		return "出牌阶段开始时，你可以亮出牌堆顶的三张牌。你可弃置任意张手牌，并可获得任意张点数之和不大于你弃置的牌点数之和的牌。";
	},
	piaoping(player) {
		if (player.storage.piaoping) {
			return '转换技，锁定技。当你使用一张牌时，阴：你摸X张牌。<span class="bluetext">阳：你弃置X张牌。</span>（X为你本阶段内发动过〖漂萍〗的次数且至多等于你的体力值）';
		}
		return '转换技，锁定技。当你使用一张牌时，<span class="bluetext">阴：你摸X张牌。</span>阳：你弃置X张牌。（X为你本阶段内发动过〖漂萍〗的次数且至多等于你的体力值）';
	},
	zhuili(player) {
		if (!player.hasSkill("piaoping", null, null, false)) {
			return "锁定技。当你成为其他角色使用黑色牌的目标后，若你的〖漂萍〗：处于阳状态，则你将〖漂萍〗转换至阴状态；处于阴状态，则你令〖托献〗发动次数+1，然后若〖托献〗发动次数大于3，则〖惴栗〗于本回合内失效。";
		}
		if (player.storage.piaoping) {
			return '锁定技。当你成为其他角色使用黑色牌的目标后，若你的〖漂萍〗：<span class="bluetext">处于阳状态，则你将〖漂萍〗转换至阴状态；</span>处于阴状态，则你令〖托献〗发动次数+1，然后若〖托献〗发动次数大于3，则〖惴栗〗于本回合内失效。';
		}
		return '锁定技。当你成为其他角色使用黑色牌的目标后，若你的〖漂萍〗：处于阳状态，则你将〖漂萍〗转换至阴状态；<span class="bluetext">处于阴状态，则你令〖托献〗发动次数+1，然后若〖托献〗发动次数大于3，则〖惴栗〗于本回合内失效。</span>';
	},
	dcdouzhen(player) {
		var str = "锁定技。①转换技。你的回合内，";
		if (player.countMark("dcdouzhen") % 2) {
			str += '阴：当你使用非转化且对应的实体牌为一张黑色基本牌的【决斗】时，你获得目标角色各一张牌并获得1枚“☯”；<span class="bluetext">阳：当你使用或打出非转化且对应的实体牌为一张红色基本牌的【杀】时，你获得1枚“☯”。</span>②若你的“☯”数为：偶数，你的黑色基本牌均视为【决斗】；<span class="bluetext">奇数，你的红色基本牌均视为无次数限制的普【杀】。</span>';
		} else {
			str += '<span class="bluetext">阴：当你使用非转化且对应的实体牌为一张黑色基本牌的【决斗】时，你获得目标角色各一张牌并获得1枚“☯”；</span>阳：当你使用或打出非转化且对应的实体牌为一张红色基本牌的【杀】时，你获得1枚“☯”。</span>②若你的“☯”数为：<span class="bluetext">偶数，你的黑色基本牌均视为【决斗】；</span>奇数，你的红色基本牌均视为无次数限制的普【杀】。';
		}
		return str;
	},
};

export default dynamicTranslates;
