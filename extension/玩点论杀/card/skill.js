import { lib, game, ui, get, ai, _status } from "../../../noname.js";

/** @type { importCardConfig['skill'] } */
const skill = {
	youdishenru: {
		trigger: { source: "damageEnd" },
		silent: true,
		onremove: true,
		filter(event, player) {
			return event.card && event.card.name === "sha" && event.player === player.storage.youdishenru;
		},
		async content(event, trigger, player) {
			delete player.storage.youdishenru;
		},
	},
	g_youdishenru: {
		trigger: { target: "shaBefore" },
		direct: true,
		filter(event, player) {
			return !event.getParent().directHit.includes(player) && player.hasUsableCard("youdishenru");
		},
		async content(event, trigger, player) {
			event.youdiinfo = {
				source: trigger.player,
				evt: trigger,
			};
			await player
				.chooseToUse(function (card, player) {
					if (get.name(card) !== "youdishenru") {
						return false;
					}
					return lib.filter.cardEnabled(card, player, "forceEnable");
				}, "是否使用诱敌深入？")
				.set("source", trigger.player);
		},
	},
};

export default skill;
