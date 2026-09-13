import { lib, game, ui, get, ai, _status } from "noname";

const dynamicTranslates = {
	spzhenting(player, skill) {
		if (player.hasSkill("spjincui_delete")) {
			return "每回合限一次。当你或你攻击范围内的角色成为【杀】或延时锦囊的目标时，若你不是此牌的使用者，你可选择一项：①弃置使用者的一张手牌；②摸一张牌。"
		}
		return lib.translate[`${skill}_info`];
	},
};
export default dynamicTranslates;
