import { lib, game, ui, get, ai, _status } from "../../noname.js";

const dynamicTranslates = {
	clanlianzhu(player) {
		if (player.storage.clanlianzhu) return '转换技。每名角色Ａ的出牌阶段限一次。阴：Ａ可以重铸一张牌，然后你可以重铸一张牌。若这两张牌颜色不同，则你的手牌上限-1；<span class="bluetext">阳：Ａ可以令你选择一名在你或Ａ攻击范围内的另一名其他角色Ｂ，然后Ａ和你可依次选择是否对Ｂ使用一张【杀】。若这两张【杀】颜色相同，则你的手牌上限+1</span>。';
		return '转换技。每名角色Ａ的出牌阶段限一次。<span class="bluetext">阴：Ａ可以重铸一张牌，然后你可以重铸一张牌。若这两张牌颜色不同，则你的手牌上限-1</span>；阳：Ａ可以令你选择一名在你或Ａ攻击范围内的另一名其他角色Ｂ，然后Ａ和你可依次选择是否对Ｂ使用一张【杀】。若这两张【杀】颜色相同，则你的手牌上限+1。';
	},
	clanguangu(player) {
		if (player.storage.clanguangu) return '转换技，出牌阶段限一次。阴：你可以观看牌堆顶的至多四张牌；<span class="bluetext">阳：你可以观看一名角色的至多四张手牌。</span>然后你可以使用其中的一张牌。';
		return '转换技，出牌阶段限一次。<span class="bluetext">阴：你可以观看牌堆顶的至多四张牌；</span>阳：你可以观看一名角色的至多四张手牌。然后你可以使用其中的一张牌。';
	},
	clanjiexuan(player) {
		if((player.storage?.clanjiexuan || 0) % 2) return '限定技，转换技。阴：你可以将一张红色牌当【顺手牵羊】使用；<span class="bluetext">阳：你可以将一张黑色牌当【过河拆桥】使用。</span>';
		return '限定技，转换技。<span class="bluetext">阴：你可以将一张红色牌当【顺手牵羊】使用；</span>阳：你可以将一张黑色牌当【过河拆桥】使用。';
	},
};
export default dynamicTranslates;
