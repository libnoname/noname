import * as buildin from "./buildin.js";

/**
 * @template {NonameHookType} HookType
 * @template {keyof HookType} Name
 * @extends {Array<HookType[Name]>}
 */
export class NonameHook extends Array {
	/**
	 * @type {Name}
	 */
	#name;

	/**
	 *
	 * @param {Name} name
	 */
	constructor(name) {
		super();
		this.#name = name;

		if (name in buildin) {
			// @ts-expect-error ignore
			for (const item of buildin[name]) {
				this.push(item);
			}
		}
	}

	static get [Symbol.species]() {
		return Array;
	}

	get name() {
		return this.#name;
	}
}
