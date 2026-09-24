import { lib, game, ui, get, ai, _status } from "noname";

const dynamicTranslates = {
	rejiushi(player) {
		if (player.storage.chengzhang) {
			return "当你需要使用【酒】时，若你的武将牌正面向上，你可以翻面，视为使用一张【酒】。当你受到伤害后，若你的武将牌于受到伤害时背面向上，你可以翻面。当你翻面时，你获得牌堆中的一张随机锦囊牌。";
		}
		return "当你需要使用【酒】时，若你的武将牌正面向上，你可以翻面，视为使用一张【酒】。当你受到伤害后，若你的武将牌于受到伤害时背面向上，你可以翻面并获得牌堆中的一张随机锦囊牌。";
	},
	rejiaozhao(player) {
		return ["出牌阶段限一次。你可以展示一张手牌，并令一名距离你最近的角色选择一种基本牌或普通锦囊牌的牌名。你可将此牌当做其声明的牌使用直到此阶段结束（你不是此牌的合法目标）。", "出牌阶段限一次。你可以将一张手牌当做一张基本牌或普通锦囊牌使用（你不是此牌的合法目标）。", "出牌阶段每种类型各限一次。你可以将一张手牌当做一张基本牌或普通锦囊牌使用。"][player.countMark("redanxin")];
	},
};
export default dynamicTranslates;
