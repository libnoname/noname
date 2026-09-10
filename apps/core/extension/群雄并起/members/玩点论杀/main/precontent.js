import { lib, game, ui, get, ai, _status } from "noname";

export async function precontent(config, pack) {
	// Await both modules so the engine cannot start with only half of the pack.
	await Promise.all([import("../card/index.js"), import("../character/index.js")]);
	lib.translate.wandian_card_config = "玩点论杀";
	lib.translate.wandian_character_config = "玩点论杀";
}
