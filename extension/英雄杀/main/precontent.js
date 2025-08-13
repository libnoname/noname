import { lib, game, ui, get, ai, _status } from "../../../noname.js";
import "../character/index.js"; // 适用于简单、无依赖、非异步场景

export function precontent(config, pack) {
	lib.translate.yxs_character_config = "英雄杀";
}
