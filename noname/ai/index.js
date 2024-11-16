import { get } from "../get/index.js";
import { lib } from "../library/index.js";
import { Basic } from "./basic.js";

export class AI {
	basic = new Basic();
	get = get;
	/**
	 * @param { any } obj
	 * @param { boolean } [similar] true伪equals, false统一前缀
	 * @returns { string } cacheKey
	 */
	getCacheKey(obj, similar) {
		let str = "[" + typeof obj + ":";
		if (typeof obj !== "object" || obj === null) {
			return str + String(obj) + "]";
		}
		if (Array.isArray(obj)) {
			return "[array:[" + obj.map(i => {
				return this.getCacheKey(i, similar);
			}).join("-") + "]]";
		}
		if (typeof obj.getCacheKey === "function") {
			return obj.getCacheKey(similar);
		}
		if (similar !== false) {
			if (get.itemtype(obj)) str = "[" + get.itemtype(obj) + ":";
			else if (!similar) str = "[undefined:";
		}
		try {
			return str + JSON.stringify(obj) + "]";
		} catch (error) {
			return str + get.translation(obj) + "]";
		}
	}
}

export let ai = new AI();

/**
 * @param { InstanceType<typeof AI> } [instance]
 */
export let setAI = (instance) => {
	ai = instance || new AI();
	if (lib.config.dev) {
		window.nonameAI = ai;
	}
};

export { Basic };
