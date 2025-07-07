import { get } from "./index.js";

export class Promises {
	/**
	 * @returns { Promise<JSZip> }
	 */
	zip() {
		return new Promise(resolve => get.zip(resolve));
	}
}
