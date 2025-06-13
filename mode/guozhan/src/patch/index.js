import { GameGuozhan } from "./game.js";
import { GetGuozhan } from "./get.js";
import { PlayerGuozhan } from "./player.js";
import ContentGuozhan from "./content.js";

export const gamePatch = _generateExtraFunctions(GameGuozhan.prototype);
export const getPatch = _generateExtraFunctions(GetGuozhan.prototype);
export const playerPatch = _generateExtraFunctions(PlayerGuozhan.prototype);
export const contentPatch = ContentGuozhan;

/**
 * 一个非常申必的生成额外函数的函数
 *
 * @template {object} T
 * @param {T} prototype
 * @returns {{ [K in T]: T[K] }}
 */
function _generateExtraFunctions(prototype) {
	/** @type {object} */
	const result = {};
	const names = Object.getOwnPropertyNames(prototype);

	if (names[0] === "constructor") {
		names.shift();
	} else if (names[names.length - 1] === "constructor") {
		names.pop();
	} else {
		names.remove("constructor");
	}

	for (const name of names) {
		result[name] = prototype[name];
	}

	return result;
}
