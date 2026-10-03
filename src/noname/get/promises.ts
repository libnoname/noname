import { get } from "./index.js";
import type JSZip from "jszip";

export class Promises {
	zip(): Promise<JSZip> {
		return new Promise(resolve => get.zip(resolve));
	}
}
