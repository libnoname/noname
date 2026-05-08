import { lib, game, ui, get, ai, _status } from "noname";

const dynamicTranslates = {
	sbkeji(player) {
		return "①出牌阶段" + (player.storage.sbkeji ? "" : "各") + "限一次。你可以选择一项：1.弃置一张手牌，然后获得1点护甲；2.失去1点体力，然后获得2点护甲。②你的手牌上限+X（X为你的护甲数）。③若你不为正在结算濒死流程的角色，你不能使用【桃】。";
	},
	sblongdan(player) {
		if (player.hasSkill("sblongdan_mark", null, null, false)) {
			return "蓄力技（1/3）。①你可以消耗1点蓄力值，将一张基本牌当做任意基本牌使用或打出，然后若你以此法使用牌，你摸一张牌。②一名角色的回合结束时，你获得1点蓄力值。";
		}
		return "蓄力技（1/3）。①你可以消耗1点蓄力值，将【杀】当做【闪】或将【闪】当做【杀】使用或打出，然后若你以此法使用牌，你摸一张牌。②一名角色的回合结束时，你获得1点蓄力值。";
	},
	sblianhuan(player) {
		var str = "①出牌阶段，你可以重铸一张♣手牌。②出牌阶段限一次。你可以将一张♣手牌当【铁索连环】使用。";
		if (!player.storage.sblianhuan) {
			str += "③当你使用【铁索连环】时，你可以失去1点体力，然后当此牌指定第一个目标后，你随机弃置每名不处于连环状态的目标角色一张手牌。";
		} else {
			str += "③当你使用【铁索连环】时，你可以额外指定任意名角色为目标。④当你使用【铁索连环】指定第一个目标后，你随机弃置每名不处于连环状态的目标角色一张手牌。";
		}
		return str;
	},
	sbjiang(player) {
		var str = "①当你使用【决斗】或红色【杀】指定目标后，或当你成为【决斗】或红色【杀】的目标后，你摸一张牌。②当你使用【决斗】时，你可以额外指定一名目标，然后你失去1点体力。③出牌阶段限";
		if (player.countMark("sbjiang")) {
			str += "X次。你可以将所有手牌当【决斗】使用（X为场上其他吴势力角色数+1）。";
		} else {
			str += "一次。你可以将所有手牌当【决斗】使用。";
		}
		return str;
	},
	sbzhenliang(player) {
		const bool = player.storage.sbzhenliang;
		let yang = "出牌阶段限一次，你可以弃置X张与“任”颜色相同的牌并对攻击范围内的一名角色造成1点伤害（X为你与其体力值值差且X至少为1）",
			yin = "你的回合外，一名角色使用或打出牌结算完成后，若此牌与“任”类别相同，则你可以令至多两名角色各摸两张牌";
		if (bool) {
			yin = `<span class='bluetext'>${yin}</span>`;
		} else {
			yang = `<span class='firetext'>${yang}</span>`;
		}
		let start = "转换技。",
			end = "。";
		return `${start}阳：${yang}；阴：${yin}${end}`;
	},
	sbwansha(player) {
		const storage = player.storage.sbwansha;
		var str = "①你的回合内，不处于濒死状态的其他角色不能使用【桃】。②每轮限两次，一名角色进入濒死状态时，你可以观看其手牌并选择其";
		str += storage ? "区域内的" : "中";
		str += "零至三张牌（其他角色不可见），然后其选择一项：1.你将这些牌分配给任意名不为其的角色；2.其弃置除这些牌以外的牌。";
		return str;
	},
	sbweimu(player) {
		const storage = player.storage.sbweimu;
		var str = "锁定技。";
		str += storage ? "①" : "";
		str += "当你成为黑色锦囊牌的目标时，取消之。";
		if (storage) {
			str += "②每轮开始时，你从弃牌堆中随机获得一张黑色锦囊牌或防具牌。";
		}
		return str;
	},
	sbtiandu(player) {
		const bool = player.storage.sbtiandu;
		let yang = "你可以弃置两张手牌，然后视为使用一张普通锦囊牌",
			yin = "你进行判定并获得判定牌，然后若判定结果与你本局游戏因〖天妒〗弃置的牌花色相同，你受到1点无来源伤害";
		if (bool) {
			yin = `<span class='bluetext'>${yin}</span>`;
		} else {
			yang = `<span class='firetext'>${yang}</span>`;
		}
		let start = "转换技。出牌阶段开始时，",
			end = "。";
		return `${start}阳：${yang}；阴：${yin}${end}`;
	},
};
export default dynamicTranslates;
