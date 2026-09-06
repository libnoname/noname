import { lib, game, ui, get, ai, _status } from "../../main/utils.js";

export default function arenaReady() {
	if (_status.connectMode) {
		return;
	}
	lib.card.list.splice(Math.floor(lib.card.list.length * Math.random()), 0, ["spade", 5, "wuxingpan"]);
	if (!_status.video) {
		lib.video.push({
			type: "play",
			name: "wuxing",
		});
	}
}
