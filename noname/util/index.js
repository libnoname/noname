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
 *
 * @param { number } ms - 毫秒数
 * @param { Object } [option] - 选项
 * @param { AbortSignal } [option.signal] - 中止信号
 * @param { boolean } [option.rejectOnAbort = true] - 中止时是否拒绝Promise
 * @returns { Promise<void> }
 */
export function delay(ms, option = {}) {
	const { signal, rejectOnAbort = true } = option;
	if (signal?.aborted) {
		return rejectOnAbort ? Promise.reject(signal.reason) : Promise.resolve();
	}

	return new Promise((resolve, reject) => {
		const abort = () => {
			clearTimeout(timeout);
			if (rejectOnAbort) {
				reject(signal?.reason);
			} else {
				resolve();
			}
		};
		const done = () => {
			signal?.removeEventListener("abort", abort);
			clearTimeout(timeout);
			resolve();
		};
		let timeout = setTimeout(done, ms);
		signal?.addEventListener("abort", abort, { once: true });
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
