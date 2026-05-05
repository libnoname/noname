import { _status, get, lib } from "noname";
import { Basic } from "./basic.js";

export class AI {
	basic = new Basic();
	get get(){
		return get;
	}
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
			return (
				"[array:[" +
				obj
					.map(i => {
						return this.getCacheKey(i, similar);
					})
					.join("-") +
				"]]"
			);
		}
		if (typeof obj.getCacheKey === "function") {
			return obj.getCacheKey(similar);
		}
		if (similar !== false) {
			if (get.itemtype(obj)) {
				str = "[" + get.itemtype(obj) + ":";
			} else if (!similar) {
				str = "[undefined:";
			}
		}
		try {
			return str + JSON.stringify(obj) + "]";
		} catch (error) {
			return str + get.translation(obj) + "]";
		}
	}
	/**
	 * 获取viewer视角下target手牌的点数、最大值和最小值
	 * @param { Player } target
	 * @param { Player | true } [viewer] 视角，true则透视
	 * @param { function (Card): boolean | Card[] } [cards] 枚举的卡牌或卡牌筛选条件
	 * @param { string } [access] Cache存取，默认"11"。第一位为"1"存入，第二位为"1"读取
	 * @param { number } r 最大值限制，默认13
	 * @param { number } l 最小值限制，默认1
	 * @returns { { nums: number[], max: number, min: number } }
	 */
	guessTargetPoints(target, viewer, cards, access = "11", r = 13, l = 1) {
		if (viewer === true) {
			viewer = target;
		}
		let filter = typeof cards === "function" ? cards : () => true;
		if (!Array.isArray(cards)) {
			cards = target.getCards("h", filter);
		}
		if (!cards.length) {
			return {
				nums: [],
				max: l,
				min: r,
			};
		}
		let key = "",
			cache;
		if (access[1] === "1") {
			key = this.getCacheKey([viewer, target, cards], true);
			cache = _status.event?.getTempCache("guessTargetPoints", key);
			if (cache) {
				return cache;
			}
		}
		let nums = [];
		const known = target.getKnownCards(viewer, filter),
			unknown = cards.length - known.length;
		known.forEach(card => {
			nums.push(get.number(card, target));
		});
		if (unknown) {
			cache = {
				nums,
				max: Math.min(r, Math.max(...nums, r), (r + l) / 2 + ((r - l) / 2) * (1 - 1 / unknown)),
				min: Math.max(l, Math.min(...nums, l), (r + l) / 2 - ((r - l) / 2) * (1 - 1 / unknown)),
			};
		} else {
			cache = {
				nums,
				max: Math.min(r, Math.max(...nums)),
				min: Math.max(l, Math.min(...nums)),
			};
		}
		if (access[0] === "1") {
			_status.event?.putTempCache("guessTargetPoints", key, cache);
		}
		return cache;
	}
}

export let ai = new AI();

/**
 * @param { InstanceType<typeof AI> } [instance]
 */
export let setAI = instance => {
	ai = instance || new AI();
	if (lib.config.dev) {
		window.nonameAI = ai;
	}
};

export { Basic };
