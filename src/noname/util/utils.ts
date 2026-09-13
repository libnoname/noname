// 放一些通用于JS里面的杂项函数喵
// 禁止什么都往里面丢喵！除非这个函数确实规模很小不足以成单文件，而且又确实没有现成的其他文件可以安放喵
// 第二件事是禁止在这里面丢类喵！类请另行创建文件喵！

const NO_RETURN = Symbol("no return");
type Options = number | { delay?: number; failResult?: any };

export type AsynchronizedType<T> = T extends Promise<unknown> ? T : Promise<T>;
export type Asynchronized<T extends (...args: any[]) => any> = T extends (...args: infer Args) => infer Return ? (...args: infer Args) => AsynchronizedType<Return> : never;
/**
 * 防抖函数喵
 *
 * @param sourceFunction
 * @param options 配置防抖函数选项，如果未配置失败结果默认将在被防抖淘汰时不返回结果
 * @returns
 */
export function debounce<T extends (...args: any[]) => any>(sourceFunction: T, options: Options = 500): Asynchronized<T> {
	let lastTimerId: object | number | null = null;
	let lastResolve: ((result: any) => void) | null = null;

	let delay = typeof options === "number" ? options : options?.delay;

	if (!delay || !Number.isInteger(delay) || delay <= 0) {
		delay = 500;
	}

	let failResult = typeof options === "number" ? NO_RETURN : options?.failResult;

    // @ts-ignore
	return function (this: any, ...args: any[]) {
		if (lastTimerId != null) {
			if (failResult !== NO_RETURN) {
				lastResolve?.(failResult);
			}

			// @ts-ignore
			clearTimeout(lastTimerId);
		}

		return new Promise(resolve => {
			lastResolve = resolve;
			lastTimerId = setTimeout(() => {
				lastTimerId = null;
				resolve(sourceFunction.apply(this, args));
			}, delay);
		});
	};
}

/**
 * 节流函数喵
 *
 * @param sourceFunction
 * @param options 配置节流函数选项，如果未配置失败结果默认将在被节流淘汰时不返回结果
 * @returns
 */
export function throttle<T extends (...args: any[]) => any>(sourceFunction: T, options: Options = 500): Asynchronized<T> {
	let lastTimerId: object | number | null = null;
	let lastResolve: ((result: any) => void) | null = null;

	let delay = typeof options === "number" ? options : options?.delay;

	if (!delay || !Number.isInteger(delay) || delay <= 0) {
		delay = 500;
	}

	let failResult = typeof options === "number" ? NO_RETURN : options?.failResult;

    // @ts-ignore
	return function (this: any, ...args: any[]) {
		if (lastTimerId != null) {
			if (failResult !== NO_RETURN) {
				return Promise.resolve(failResult);
			}

			return new Promise(() => {});
		}

		return new Promise(resolve => {
			lastResolve = resolve;
			lastTimerId = setTimeout(() => {
				lastTimerId = null;
				resolve(sourceFunction.apply(this, args));
			}, delay);
		});
	};
}
