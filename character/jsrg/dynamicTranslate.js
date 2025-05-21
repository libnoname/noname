import { lib, game, ui, get, ai, _status } from "../../noname.js";

const dynamicTranslates = {
	jsrgshichong(player) {
		if (player.storage.jsrgshichong) {
			return '转换技。当你使用牌指定其他角色为唯一目标后，阴：你可以获得目标角色一张手牌；<span class="bluetext">阳：目标角色可以交给你一张手牌</span>。';
		}
		return '转换技。当你使用牌指定其他角色为唯一目标后，<span class="bluetext">阴：你可以获得目标角色一张手牌</span>；阳：目标角色可以交给你一张手牌。';
	},
	jsrgdangren(player) {
		if (player.storage.jsrgdangren) {
			return '转换技。阴：当你需要对自己使用【桃】时，你可以视为使用之。<span class="bluetext">阳：当你可以对其他角色使用【桃】时，你须视为使用之。</span>';
		}
		return '转换技。<span class="bluetext">阴：当你需要对自己使用【桃】时，你可以视为使用之。</span>阳：当你可以对其他角色使用【桃】时，你须视为使用之。';
	},
};

export default dynamicTranslates;
