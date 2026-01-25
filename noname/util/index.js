/** @type { string } */
// @ts-expect-error ignore
export const nonameInitialized = localStorage.getItem("noname_inited");
export const assetURL = "";
/** @type {typeof Function} */
// @ts-expect-error ignore
export const GeneratorFunction = function* () {}.constructor;
/** @type {typeof Function} */
// @ts-expect-error ignore
export const AsyncFunction = async function () {}.constructor;
/** @type {typeof Function} */
// @ts-expect-error ignore
export const AsyncGeneratorFunction = async function* () {}.constructor;
export const userAgent = navigator.userAgent;
export const userAgentLowerCase = userAgent.toLowerCase();
export const characterDefaultPicturePath = "image/character/default_silhouette_";

// 设备环境判定：
// - iPadOS 有时会伪装成 Macintosh（Safari “请求桌面网站”），需要通过触控点数区分
// - macOS 桌面浏览器不应被视为 iOS，否则会走 cordova 分支并尝试加载 cordova.js
const isIPadOSMasqueradingAsMac =
       userAgentLowerCase.includes("macintosh") && typeof navigator != "undefined" && Number(navigator.maxTouchPoints) > 1;

export const device =
       nonameInitialized !== "nodejs"
               ? userAgentLowerCase.includes("android")
                       ? "android"
                       : userAgentLowerCase.includes("iphone") || userAgentLowerCase.includes("ipad") || isIPadOSMasqueradingAsMac
                               ? "ios"
                               : void 0
               : void 0;


// export const androidNewStandardApp = device === "android" && typeof window.NonameAndroidBridge != "undefined";

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
 *
 * @return {boolean}
 * @param {function} func
 */
export function isClass(func) {
	if (typeof func !== "function") {
		return false;
	}
	const fnStr = Function.prototype.toString.call(func);
	return /^class\s/.test(fnStr);
}
