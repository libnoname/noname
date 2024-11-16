import { lib, game, ui, get, ai, _status } from "../../noname.js";

const dynamicTranslates = {
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
	spshidi(player) {
		if (player.countMark("spshidi") % 2 == 0) return '转换技，锁定技。①准备阶段/结束阶段开始时，若你发动此分支的累计次数为奇数/偶数，则你获得一个“☯”。<span class="bluetext">②若你的“☯”数为偶数，则你至其他角色的距离-1，且你使用的黑色【杀】不可被响应。</span>③若你的“☯”数为奇数，则其他角色至你的距离+1，且你不可响应红色【杀】。';
		return '转换技，锁定技。①准备阶段/结束阶段开始时，若你发动此分支的累计次数为奇数/偶数，则你获得一个“☯”。②若你的“☯”数为偶数，则你至其他角色的距离-1，且你使用的黑色【杀】不可被响应。<span class="bluetext">③若你的“☯”数为奇数，则其他角色至你的距离+1，且你不可响应红色【杀】。</span>';
	},
	xianmou(player) {
		const storage = player.storage.xianmou;
		var str = "转换技，①游戏开始时，你可以转换此技能状态；②你失去过牌的回合结束时，你可以：";
		if (!storage) str += '<span class="bluetext">';
		str += "阳，观看牌堆顶五张牌并获得至多X张牌，若未获得X张牌则获得〖遗计〗直到再发动此项；";
		if (!storage) str += "</span>";
		if (storage) str += '<span class="bluetext">';
		str += "阴，观看一名角色手牌并弃置其中至多X张牌，若弃置X张牌则你进行一次【闪电】判定。";
		if (storage) str += "</span>";
		return str+="（X为你本回合失去牌数）";
	},
	xiongjin(player){
		const storage = player.storage.xiongjin;
		var str = "转换技。";
		if (!storage) str += '<span class="bluetext">';
		str += "阳：出牌阶段开始时，你可以摸X张牌，然后本回合的弃牌阶段开始时，你弃置所有非基本牌";
		if (!storage) str += "</span>";
		str += "；";
		if (storage) str += '<span class="bluetext">';
		str += "阴，其他角色的出牌阶段开始时，你可以令其摸X张牌，然后本回合的弃牌阶段开始时，其弃置所有基本牌";
		if (storage) str += "</span>";
		return str+="（X为你已损失的体力值，至少为1，至多为3）。";
	},
};

export default dynamicTranslates;
