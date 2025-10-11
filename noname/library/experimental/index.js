import { lib } from "../index.js";

import * as ExperimentalSymbol from "./symbol.js";

export class Experimental {
	symbol = ExperimentalSymbol;
	symbols = ExperimentalSymbol;

	/**
	 * @type {boolean}
	 */
	get enable() {
		return Reflect.get(lib.config, "experimental_enable");
	}
}

export let experimental = new Experimental();
