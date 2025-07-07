import { userAgentLowerCase } from "../util/index.js";

/**
 * 用于老版本能用的`get`
 */
export class GetCompatible {
	// require是需求的版本号，current是浏览器环境本身的版本号
	/**
	 *
	 * @param {[majorVersion: number, minorVersion: number, patchVersion: number]} require
	 * @param {[majorVersion: number, minorVersion: number, patchVersion: number]} current
	 * @returns
	 */
	checkVersion(require, current) {
		// 防止不存在的意外，提前截断当前版本号的长度
		if (current.length > require.length) {
			current.length = require.length;
		}

		// 考虑到玄学的NaN情况，记录是否存在NaN
		let flag = false;
		// 从主版本号遍历到修订版本号，只考虑当前版本号的长度
		for (let i = 0; i < current.length; ++i) {
			// 当前环境版本号当前位若是NaN，则记录后直接到下一位
			if (isNaN(current[i])) {
				flag = true;
				continue;
			}
			// 如果此时flag为true且current[i]不为NaN，版本号则不合法，直接否
			if (flag) {
				return false;
			}
			// 上位版本号未达到要求，直接否决
			if (require[i] > current[i]) {
				return false;
			}
			// 上位版本号已超过要求，直接可行
			if (current[i] > require[i]) {
				return true;
			}
		}
		return true;
	}

	/**
	 * 获取当前内核版本信息
	 *
	 * 目前仅考虑`chrome`, `firefox`和`safari`三种浏览器的信息，其余均归于其他范畴
	 *
	 * > 其他后续或许会增加，但`IE`永无可能
	 *
	 * @returns {["firefox" | "chrome" | "safari" | "other", number, number, number]}
	 */
	coreInfo() {
		// 如果存在process并且存在process.versions，则默认为node环境
		if (typeof window.process != "undefined" && typeof window.process.versions == "object") {
			// 如果存在versions.chrome，默认为electron的versions.chrome
			if (window.process.versions.chrome) {
				return parseVersion("chrome", window.process.versions.chrome);
			}
		}

		// Chrome/Chromium下的实验性特性，具体可参见
		// https://developer.mozilla.org/en-US/docs/Web/API/Navigator/userAgentData
		// @ts-expect-error ignore
		if (typeof navigator.userAgentData != "undefined") {
			// @ts-expect-error ignore
			const userAgentData = navigator.userAgentData;
			if (userAgentData.brands && userAgentData.brands.length) {
				const brand = userAgentData.brands.find(({ brand }) => {
					let str = brand.toLowerCase();
					// 当前支持的浏览器中只有chrome支持userAgentData，故只判断chrome的情况
					return str.includes("chrome") || str.includes("chromium");
				});

				// 如果能通过userAgentData找到对应的浏览器信息，则直接返回
				// 反之则继续通过正则表达式匹配userAgent
				if (brand) {
					return ["chrome", parseInt(brand.version), 0, 0];
				}
			}
		}

		// 目前仅考虑Firefox, Chrome和Safari三种浏览器
		// 其余浏览器均归于other
		const regex = /(firefox|chrome|safari)\/(\d+(?:\.\d+)+)/;
		let result = userAgentLowerCase.match(regex);
		if (result == null) {
			return ["other", NaN, NaN, NaN];
		}

		// 非Safari情况可直接返回结果
		if (result[1] !== "safari") {
			// @ts-expect-error Type must be right
			return parseVersion(result[1], result[2]);
		}

		// 以下是所有Safari平台的判断方法
		// macOS以及以桌面显示的移动端则直接判断
		if (/macintosh/.test(userAgentLowerCase)) {
			result = userAgentLowerCase.match(/version\/(\d+(?:\.\d+)+).*safari/);
			if (result == null) {
				return ["other", NaN, NaN, NaN];
			}
		}
		// 不然则通过OS后面的版本号来获取内容
		else {
			let safariRegex = /(?:iphone|ipad); cpu (?:iphone )?os (\d+(?:_\d+)+)/;
			result = userAgentLowerCase.match(safariRegex);
			if (result == null) {
				return ["other", NaN, NaN, NaN];
			}
		}
		// result = userAgent.match(/version\/(\d+(?:\.\d+)+).*safari/)
		return parseVersion("safari", result[1]);

		/**
		 * 通用解析版本号方法
		 *
		 * @param {"firefox" | "chrome" | "safari" | "other"} coreName
		 * @param {string} versions
		 * @returns {["firefox" | "chrome" | "safari" | "other", number, number, number]}
		 */
		function parseVersion(coreName, versions) {
			const [major, minor, patch] = versions.split(".");
			const majorVersion = parseInt(major);

			// 如果major解析为NaN，则整体解析为NaN（此时不考虑minor和patch）
			if (Number.isNaN(majorVersion)) {
				return [coreName, NaN, NaN, NaN];
			}

			// 反之则将不为NaN的minor和patch解析为0
			return [coreName, majorVersion, parseInt(minor) || 0, parseInt(patch) || 0];
		}
	}
}

export let get = new GetCompatible();

/**
 * @param { InstanceType<typeof GetCompatible> } [instance]
 */
export function setGetCompatible(instance) {
	get = instance || new GetCompatible();
}
