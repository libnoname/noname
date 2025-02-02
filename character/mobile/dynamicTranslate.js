import { lib, game, ui, get, ai, _status } from "../../noname.js";

const dynamicTranslates = {
	yizan_use(player) {
		if (player.storage.yizan) return "你可以将一张基本牌当做任意基本牌使用或打出。";
		return "你可以将两张牌（其中至少一张为基本牌）当做任意基本牌使用或打出。";
	},
	miaojian(player) {
		return ["出牌阶段限一次。你可将一张【杀】当做刺【杀】使用，或将一张锦囊牌当做【无中生有】使用。", "出牌阶段限一次。你可将一张基本牌当做刺【杀】使用，或将一张非基本牌当做【无中生有】使用。", "出牌阶段限一次。你可视为使用一张刺【杀】或【无中生有】。"][player.countMark("miaojian")];
	},
	shhlianhua(player) {
		return ["当你成为【杀】的目标后，你摸一张牌。", "当你成为【杀】的目标后，你摸一张牌。然后你进行判定，若结果为黑桃，则此【杀】对你无效。", "当你成为【杀】的目标后，你摸一张牌。然后此【杀】的使用者选择一项：①弃置一张牌。②令此【杀】对你无效。"][player.countMark("shhlianhua")];
	},
	mobilexingxue(player) {
		return lib.translate[(player.storage.mobileyanzhu ? "mobilexingxuex" : "mobilexingxue") + "_info"];
	},
	shoufa(player) {
		const zhoufa = player.storage.zhoulin_zhoufa;
		const nodoudizhu = get.mode() == "doudizhu" ? "与你距离不小于1的/距离不大于1的" : "与你距离不小于2的/距离不大于2的";
		if (!zhoufa) return "当你受到伤害后/于一回合首次造成伤害后，你可以选择一名" + nodoudizhu + "角色，令其随机执行以下一项：豹，令其受到1点无来源伤害；鹰，你随机获得其一张牌；熊，你随机弃置其装备区的一张牌；兔，令其摸一张牌。";
		let str = "当你受到伤害后/于一回合首次造成伤害后，你可以选择一名" + nodoudizhu + "角色，";
		str += ["令其受到1点无来源伤害", "你随机获得其一张牌", "你随机弃置其装备区的一张牌", "令其摸一张牌"][["豹", "鹰", "熊", "兔"].indexOf(zhoufa)];
		return str + "。";
	},
	mbxuetu(player) {
		const xuetu = player.storage.mbxuetu,
			status = player.countMark("mbxuetu_status");
		if (status === 0) {
			if (!xuetu) return '转换技。出牌阶段限一次，<span class="bluetext">阴：你可以令一名角色回复1点体力；</span>阳：你可以令一名角色摸两张牌。';
			return '转换技。出牌阶段限一次，阴：你可以令一名角色回复1点体力；<span class="bluetext">阳：你可以令一名角色摸两张牌。</span>';
		} else if (status === 1) {
			return lib.translate.mbxuetu_achieve_info;
		} else {
			if (!xuetu) return '转换技。出牌阶段限一次，<span class="bluetext">阴：你可以回复1点体力，然后令一名其他角色弃置两张牌；</span>阳：你可以摸一张牌，然后对一名其他角色造成1点伤害。';
			return '转换技。出牌阶段限一次，阴：你可以回复1点体力，然后令一名其他角色弃置两张牌；<span class="bluetext">阳：你可以摸一张牌，然后对一名其他角色造成1点伤害。</span>';
		}
	},
	mbzuoyou(player) {
		const mbzuoyou = player.storage.mbzuoyou,
			versus = get.mode() == "versus" && _status.mode == "two" ? "角色" : "有手牌的角色弃置一张手牌，然后其";
		if (mbzuoyou) return '转换技。出牌阶段限一次，阴：你可以令一名角色摸三张牌，然后其弃置两张牌；<span class="bluetext">阳：你可以令一名' + versus + "获得1点护甲。</span>";
		return '转换技。出牌阶段限一次，<span class="bluetext">阴：你可以令一名角色摸三张牌，然后其弃置两张牌；</span>阳：你可以令一名' + versus + "获得1点护甲。";
	},
	pothanzhan(player) {
		let str = lib.translate.pothanzhan_info;
		if (!player.storage.pothanzhan) return str;
		return str.replace(
			"X为各自体力上限",
			"X为" +
				{
					hp: "各自体力值",
					damagedHp: "各自损失体力值",
					countplayer: "场上存活角色数",
				}[player.storage.pothanzhan]
		);
	},
	potzhanlie(player) {
		let str = lib.translate.potzhanlie_info;
		if (!player.storage.potzhanlie) return str;
		return str.replace(
			"X为你的攻击范围",
			"X为" +
				{
					hp: "你的体力值",
					damagedHp: "你的损失体力值",
					countplayer: "场上存活角色数",
				}[player.storage.pothanzhan]
		);
	},
	mbfunan(player) {
		if (player.storage.mbfunan_rewrite) return `其他角色使用或打出牌响应你使用的牌时，你可以获得其使用或打出的牌，且你使用以此法获得的牌结算结束后，若没有其他角色响应此牌，你摸一张牌。`;
		return `其他角色使用或打出牌响应你使用的牌时，你可以获得其使用或打出的牌。`;
	},
};
export default dynamicTranslates;
