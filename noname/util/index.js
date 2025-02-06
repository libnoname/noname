/** @type { string } */
// @ts-ignore
export const nonameInitialized = localStorage.getItem("noname_inited");
export const assetURL = "";
/** @type {typeof Function} */
// @ts-ignore
export const GeneratorFunction = function* () {}.constructor;
/** @type {typeof Function} */
// @ts-ignore
export const AsyncFunction = async function () {}.constructor;
/** @type {typeof Function} */
// @ts-ignore
export const AsyncGeneratorFunction = async function* () {}.constructor;
export const userAgent = navigator.userAgent;
export const userAgentLowerCase = userAgent.toLowerCase();
// export { Mutex } from "./mutex.js";
export const characterDefaultPicturePath = "image/character/default_silhouette_";

export const device = nonameInitialized && nonameInitialized !== "nodejs" ? (userAgentLowerCase.includes("android") ? "android" : userAgentLowerCase.includes("iphone") || userAgentLowerCase.includes("ipad") || userAgentLowerCase.includes("macintosh") ? "ios" : void 0) : void 0;

export const androidNewStandardApp = device === "android" && typeof window.NonameAndroidBridge != "undefined";

/**
 * 不能被new的类
 */
export class Uninstantable {
	constructor() {
		throw new TypeError(`${new.target.name} is not a constructor`);
	}
}

/**
 * 暂停x毫秒
 * @param { number } ms
 * @returns { Promise<void> }
 */
export function delay(ms) {
	return new Promise(resolve => {
		let timeout = setTimeout(() => {
			clearTimeout(timeout);
			resolve();
		}, ms);
	});
}

/**
 * 将当前Record已有的普通项封装起来，但不阻止其继续扩展
 *
 * @template {object} T
 * @param {T} record - 要封装的Record
 * @returns {Readonly<T>}
 */
export function freezeButExtensible(record) {
	const descriptors = Object.getOwnPropertyDescriptors(record);
	if (descriptors) {
		for (const [key, descriptor] of Object.entries(descriptors)) {
			if ("value" in descriptor) descriptor.writable = false;
			descriptor.configurable = false;
			// @ts-ignore
			Reflect.defineProperty(record, key, descriptor);
		}
	}

	return record;
}

// 目前是否还在game.js内运行代码
export let compatibleEnvironment = true;
export function leaveCompatibleEnvironment() {
	compatibleEnvironment = false;
}

/**
 *
 *
 * @return {never}
 * @throws {Error}
 */
export function jumpToCatchBlock() {
	throw new Error("");
}

/**
 *
 * @return {boolean}
 * @param {function} func
 */
export function isClass(func) {
	if (typeof func !== "function") return false;
	const fnStr = Function.prototype.toString.call(func);
	return /^class\s/.test(fnStr);
}
