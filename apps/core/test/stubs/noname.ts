import { vi } from "vitest";

/**
 * 最小引擎替身。
 *
 * 单元测试不加载真实引擎：模块顶层的任意深链（如 lib.filter.notMe）都由代理兜住，
 * 需要参与断言的少量成员（natureSeparator、announce、natureList 等）显式提供。
 */
const stub: any = new Proxy(function () {}, {
	get(_target, property) {
		if (property === Symbol.toPrimitive) {
			return () => "";
		}
		if (property === "then") {
			return undefined;
		}
		if (property === Symbol.iterator) {
			return function* () {};
		}
		return stub;
	},
	apply() {
		return stub;
	},
	construct() {
		return stub;
	},
});

const announce = {
	publish: vi.fn(),
	subscribe: vi.fn(),
	unsubscribe: vi.fn(),
};

const nature = new Set(["fire", "thunder", "ice", "stab", "kami"]);

const natureList = (card: any) => {
	if (!card) {
		return [];
	}
	if (typeof card === "string") {
		return card.split("|").filter(Boolean);
	}
	if (Array.isArray(card)) {
		return card;
	}
	if (typeof card.nature === "string") {
		return card.nature.split("|").filter(Boolean);
	}
	return Array.isArray(card.nature) ? card.nature : [];
};

const itemtype = (item: any) => {
	if (Array.isArray(item)) {
		return "cards";
	}
	if (item && typeof item === "object" && item.__card === true) {
		return "card";
	}
	return null;
};

const libValues: Record<PropertyKey, any> = {
	natureSeparator: "|",
	nature,
	announce,
};

const getValues: Record<PropertyKey, any> = {
	natureList,
	itemtype,
};

export const lib: any = new Proxy(libValues, {
	get(target, property) {
		return property in target ? target[property] : stub;
	},
});

export const get: any = new Proxy(getValues, {
	get(target, property) {
		return property in target ? target[property] : stub;
	},
});

export const game: any = stub;
export const ui: any = stub;
export const ai: any = stub;
export const _status: any = stub;

export const AI: any = stub;
export const Game: any = stub;
export const Get: any = stub;
export const Library: any = stub;
export const UI: any = stub;
export const status: any = stub;

export const rootURL = new URL("http://localhost/");

export const setAI = () => stub;
export const setGame = () => stub;
export const setGet = () => stub;
export const setLibrary = () => stub;
export const setStatus = () => stub;
export const setUI = () => stub;
