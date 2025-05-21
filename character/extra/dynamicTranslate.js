import { lib, game, ui, get, ai, _status } from "../../noname.js";

const dynamicTranslates = {
	nzry_longnu(player) {
		if (player.hasSkill("nzry_longnu_2")) {
			return '转换技，锁定技，阴：出牌阶段开始时，你失去1点体力并摸一张牌，然后本阶段内你的红色手牌均视为火【杀】且无距离限制。<span class="legendtext">阳：出牌阶段开始时，你减1点体力上限并摸一张牌，然后本阶段内你的锦囊牌均视为雷【杀】且无使用次数限制。</span>';
		}
		if (player.hasSkill("nzry_longnu_1")) {
			return '转换技，锁定技，<span class="legendtext">阴：出牌阶段开始时，你失去1点体力并摸一张牌，然后本阶段内你的红色手牌均视为火【杀】且无距离限制。</span>阳：出牌阶段开始时，你减1点体力上限并摸一张牌，然后本阶段内你的锦囊牌均视为雷【杀】且无使用次数限制。';
		}
		if (player.storage.nzry_longnu == true) {
			return '转换技，锁定技，阴：出牌阶段开始时，你失去1点体力并摸一张牌，然后本阶段内你的红色手牌均视为火【杀】且无距离限制。<span class="bluetext">阳：出牌阶段开始时，你减1点体力上限并摸一张牌，然后本阶段内你的锦囊牌均视为雷【杀】且无使用次数限制。</span>';
		}
		return '转换技，锁定技，<span class="bluetext">阴：出牌阶段开始时，你失去1点体力并摸一张牌，然后本阶段内你的红色手牌均视为火【杀】且无距离限制。</span>阳：出牌阶段开始时，你减1点体力上限并摸一张牌，然后本阶段内你的锦囊牌均视为雷【杀】且无使用次数限制。';
	},
	fengliao(player) {
		if (player.storage["fengliao"]) {
			return `锁定技，转换技，你使用牌指定唯一目标后，阳：你令其摸一张牌；<span class="bluetext">阴：你对其造成1点火焰伤害。</span>`;
		}
		return `锁定技，转换技，你使用牌指定唯一目标后，<span class="bluetext">阳：你令其摸一张牌</span>；阴：你对其造成1点火焰伤害。`;
	},
};
export default dynamicTranslates;
