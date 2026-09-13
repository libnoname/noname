import { lib, game, ui, get, ai, _status } from "../../main/utils.js";

export default {
	player: {
		init(player) {
			if (player.node.wuxing) {
				player.node.wuxing.remove();
			}
			if (_status.video || _status.connectMode) {
				return;
			}
			let node = ui.create.div(".wunature", player);
			let nature = ["metal", "wood", "water", "fire", "soil"].randomGet();
			player.wunature = nature;
			node.dataset.nature = nature;
			node.innerHTML = get.translation(nature);
			player.node.wuxing = node;
		},
	},
	card: {
		init(card) {
			if (_status.video || _status.connectMode) {
				return;
			}
			if (card.name === "wuxingpan") {
				return;
			}
			if (card.wunature) {
				return;
			}
			if (Math.random() > (Number.parseFloat(lib.config.extension_杀海拾遗_rand) || 0)) {
				return;
			}
			let node = ui.create.div(".wunature", card);
			let nature = ["metal", "wood", "water", "fire", "soil"].randomGet();
			card.wunature = nature;
			node.dataset.nature = nature;
			node.innerHTML = get.translation(nature);
			card.node.wuxing = node;
			if (!card.suit || !card.number) {
				card.node.wuxing.style.display = "none";
			}
		},
	},
};
