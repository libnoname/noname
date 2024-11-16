import { get } from "../get/index.js";
import { lib } from "../library/index.js";
import { Basic } from "./basic.js";

export class AI {
	basic = new Basic();
	get = get;
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
