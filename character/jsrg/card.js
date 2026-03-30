import { lib, game, ui, get, ai, _status } from "noname";

const cards = {
	xumou_jsrg: {
		type: "special_delay",
		allowDuplicate: true,
		blankCard: true,
		fullimage: true,
		wuxieable: false,
		effect() {
			"step 0";
			var card = get.autoViewAs(event.cards[0]);
			card.storage.xumou_jsrg = true;
			player.chooseUseTarget(card, event.cards, `蓄谋:是否使用${get.translation(card)}？`, `请选择要使用的目标。若不使用此牌，则判定区内的所有“蓄谋”牌都将被置入弃牌堆。`);
			"step 1";
			if (!result.bool) {
				var cards = player.getCards("j", card => {
					return (card.viewAs || card.name) == "xumou_jsrg";
				});
				if (cards.length > 0) {
					player.loseToDiscardpile(cards);
				}
			} else {
				player.addTempSkill("xumou_jsrg_temp", "phaseChange");
				player.markAuto("xumou_jsrg_temp", [event.cards[0].name]);
			}
		},
	},
	ying: {
		audio: true,
		fullskin: true,
		type: "basic",
		cardcolor: "spade",
		enable: false,
		destroy: "discardPile",
		getYing(count) {
			var cards = [];
			if (typeof count != "number") {
				count = 1;
			}
			while (count--) {
				let card = game.createCard("ying", "spade", 1);
				cards.push(card);
			}
			return cards;
		},
		ai: {
			basic: {
				useful: 0,
				value: 0,
			},
		},
	},
};
export default cards;
