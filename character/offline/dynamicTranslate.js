import { lib, game, ui, get, ai, _status } from "../../noname.js";

const dynamicTranslates = {
	scls_miaojian(player) {
		if (player.hasMark("scls_miaojian")) return "出牌阶段限一次，你可视为使用一张刺【杀】或【无中生有】。";
		return "出牌阶段限一次，你可将一张基本牌当做刺【杀】使用，或将一张非基本牌当做【无中生有】使用。";
	},
	scls_lianhua(player) {
		if (player.hasMark("scls_lianhua")) return "当你成为【杀】的目标后，你摸一张牌。然后此【杀】的使用者需弃置一张牌，否则此【杀】对你无效。";
		return "当你成为【杀】的目标后，你摸一张牌。";
	},
	jdjuqi(player) {
		if (player.storage.jdjuqi) return '转换技。阴：准备阶段，你摸三张牌；其他角色的准备阶段，其可以展示并交给你一张黑色手牌。<span class="bluetext">阳：准备阶段，你令你本回合使用牌无次数限制且造成的伤害+1；其他角色的准备阶段，其可以展示并交给你一张红色手牌。</span>';
		return '转换技。<span class="bluetext">阴：准备阶段，你摸三张牌；其他角色的准备阶段，其可以展示并交给你一张黑色手牌。</span>阳：准备阶段，你令你本回合使用牌无次数限制且造成的伤害+1；其他角色的准备阶段，其可以展示并交给你一张红色手牌。';
	},
	jdlongdan(player) {
		return lib.translate["jdlongdan" + (player.hasSkill("sblongdan_mark", null, null, false) ? "x" : "") + "_info"];
	},
	tylongnu(player) {
		let str = "转换技，游戏开始时，你可以改变此转换技的状态。出牌阶段开始时，你可以摸一张牌并：";
		let yin = "阴：失去1点体力，然后此阶段内你可以将红色手牌当无距离限制的火【杀】使用或打出；";
		if (player.hasSkill("tylongnu_yin")) yin = "<span class='legendtext'>" + yin + "</span>";
		else if (!player.storage.tylongnu && !player.hasSkill("tylongnu_yang")) yin = "<span class='bluetext'>" + yin + "</span>";
		str += yin;
		let yang = "阳：减少1点体力上限，然后此阶段内你可以将锦囊牌当无次数限制的雷【杀】使用或打出。";
		if (player.hasSkill("tylongnu_yang")) yang = "<span class='legendtext'>" + yang + "</span>";
		else if (player.storage.tylongnu && !player.hasSkill("tylongnu_yin")) yang = "<span class='firetext'>" + yang + "</span>";
		str += yang;
		return str;
	},
	tyqianshou(player) {
		let str = "转换技，其他角色的回合开始时，若其体力值大于你，或其未处于横置状态，",
			yin = "阴：你可展示并交给其一张红色牌，本回合你不能使用手牌且你与其不能成为牌的目标；",
			yang = "阳：你可令其展示并交给你一张牌，若此牌不为黑色，你失去一点体力。";
		if (player.storage.tyqianshou) yang = "<span class='firetext'>" + yang + "</span>";
		else yin = "<span class='bluetext'>" + yin + "</span>";
		return str + yin + yang;
	},
	tyliupo(player) {
		let str = "转换技，回合开始时，你令本轮：",
			yin = "阴：所有角色不能使用【桃】；",
			yang = "阳：所有即将造成的伤害均视为体力流失。";
		if (player.storage.tyliupo) yang = "<span class='firetext'>" + yang + "</span>";
		else yin = "<span class='bluetext'>" + yin + "</span>";
		return str + yin + yang;
	},
	yyyanggu(player) {
		if (player.storage.yyyanggu) return '转换技。阳，当你受到伤害后，你可以回复1点体力；<span class="bluetext">阴，你可以将一张手牌当作【声东击西】使用</span>。';
		return '转换技。<span class="bluetext">阳，当你受到伤害后，你可以回复1点体力</span>；阴，你可以将一张手牌当作【声东击西】使用。';
	},
};
export default dynamicTranslates;
