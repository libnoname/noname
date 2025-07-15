import { lib, game, ui, get, ai, _status } from "../../../noname.js";

const dynamicTranslates = {
	dddxiaheng(player) {
		return "锁定技。出牌阶段开始时，你选择一名角色，其弃置两张牌，然后你对一名角色造成1点伤害。" + (player.storage["dddxiaheng_del"] ? "" : "“若两名角色：均不为你，你失去1点体力上限；为同一名角色，你失去1点体力；然后若以此法对包括你在内三名不同的角色造成伤害，删除双引号里的描述内容”");
	},
	dddshichao(player) {
		return "锁定技，准备阶段，你选择一名手牌数为全场第（" + (1 + player.countMark("dddshichao")) + "）大的角色，将手牌数调整至与其相等且至多等于主公的体力上限；其于你的下回合开始前对你造成伤害时，其可防止之，然后令（）内的数字+1。";
	},
	dddlanghuai(player) {
		return "转换技，摸牌阶段，你" + (player.hasMark("dddxuanlun_del") ? "" : "可") + "展示手牌（无牌则不展示），并改为摸其中：" + (player.storage["dddlanghuai"] ? '阴：包含花色数的牌；<span class="bluetext">阳：缺少花色数的牌。</span>' : '<span class="bluetext">阴：包含花色数的牌；</span>阳：缺少花色数的牌。');
	},
	dddxuanlun(player) {
		var deleted = player.hasMark("dddxuanlun_del");
		return "你受到伤害后，你可摸四张牌；你发动此技能的回合结束时，" + (deleted ? "你" : "须选择一项：") + "将四张牌以任意顺序置于牌堆顶或底" + (deleted ? "。" : "；或删去此项和“朗怀”中的“可”，直到你发动“朗怀”。");
	},
	ddddiedang(player) {
		if (player.storage.ddddiedang) {
			return "出牌阶段限一次，你可以弃置三张牌，然后摸一张牌；然后若你的手牌数为全场最多或最少，则你交换上述描述中的“弃置”和“摸”。";
		}
		return "出牌阶段限一次，你可以摸三张牌，然后弃置一张牌；然后若你的手牌数为全场最多或最少，则你交换上述描述中的“摸”和“弃置”。";
	},
	dddyeshen(player) {
		return "一名角色的结束阶段，你可以亮出牌堆底" + get.cnNumber(3 - player.countMark("dddyeshen")) + "张牌，令其将其中一张黑色牌当做最大目标数为牌名字数的【铁索连环】使用或重铸，其余牌置于牌堆顶，然后此技能亮出牌数-1；若减至零张或其中没有黑色牌，你复原此技能并对自己造成1点火焰伤害。";
	},
};
export default dynamicTranslates;
