// 放一些通用于JS里面的杂项函数喵
// 禁止什么都往里面丢喵！除非这个函数确实规模很小不足以成单文件，而且又确实没有现成的其他文件可以安放喵
// 第二件事是禁止在这里面丢类喵！类请另行创建文件喵！

const NO_RETURN = Symbol("no return");

/**
 * 防抖函数喵
 * 
 * @template {(...args: any[]) => any} T
 * @param {T} sourceFunction
 * @param {number | { delay?: number, failResult?: any }} [options=500] 配置防抖函数选项，如果未配置失败结果默认将在被防抖淘汰时不返回结果
 * @returns {import('./utils.d.ts').Asynchronized<T>}
 */
export function debounce(sourceFunction, options = 500) {
    /** @type {object | number | null} */
    let lastTimerId = null;
    /** @type {((result: any) => void) | null} */
    let lastResolve = null;

    let delay = typeof options === 'number' ? options : options?.delay;

    if (!delay || !Number.isInteger(delay) || delay <= 0) {
        delay = 500;
    }

    let failResult = typeof options === 'number' ? NO_RETURN : options?.failResult;

    /** 
     * @this {any}
     * @param {...any} args
     */
    // @ts-expect-error 还是TS好用喵
    return function(...args) {
        if (lastTimerId != null) {
            if (failResult !== NO_RETURN) {
                lastResolve?.(failResult);
            }

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
 * @template {(...args: any[]) => any} T
 * @param {T} sourceFunction
 * @param {number | { delay?: number, failResult?: any }} [options=500] 配置节流函数选项，如果未配置失败结果默认将在被节流淘汰时不返回结果
 * @returns {import('./utils.d.ts').Asynchronized<T>}
 */
export function throttle(sourceFunction, options = 500) {
    /** @type {object | number | null} */
    let lastTimerId = null;
    /** @type {((result: any) => void) | null} */
    let lastResolve = null;

    let delay = typeof options === 'number' ? options : options?.delay;

    if (!delay || !Number.isInteger(delay) || delay <= 0) {
        delay = 500;
    }

    let failResult = typeof options === 'number' ? NO_RETURN : options?.failResult;

    /** 
     * @this {any}
     * @param {...any} args
     */
    // @ts-expect-error 还是TS好用喵
    return function(...args) {
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