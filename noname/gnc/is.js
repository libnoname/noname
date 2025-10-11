import { GeneratorFunction } from "@/util/index.js";

export class Is {
	/**
	 * @param {*} item
	 * @returns {boolean}
	 */
	coroutine(item) {
		return typeof item == "function" && item.name == "genCoroutine";
	}

	/**
	 * @param {*} item
	 * @returns {boolean}
	 */
	generatorFunc(item) {
		return item instanceof GeneratorFunction;
	}

	/**
	 * @param {*} item
	 * @returns {boolean}
	 */
	generator(item) {
		return typeof item == "object" && "constructor" in item && item.constructor && "constructor" in item.constructor && item.constructor.constructor === GeneratorFunction;
	}
}
