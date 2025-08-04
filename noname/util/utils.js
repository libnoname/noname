// 放一些通用于JS里面的杂项函数喵
// 禁止什么都往里面丢喵！除非这个函数确实规模很小不足以成单文件，而且又确实没有现成的其他文件可以安放喵
// 第二件事是禁止在这里面丢类喵！类请另行创建文件喵！

/**
 * 防抖函数喵
 * 
 * @template {(...args: any[]) => any} T
 * @param {T} sourceFunction
 * @param {number} [delay=500]
 * @returns {import('./utils.d.ts').Asynchronized<T>}
 */
export function debonuce(sourceFunction, delay = 500) {
    let lastTimerId = null;

    // @ts-expect-error 还是TS好用喵
    return function(...args) {
        if (lastTimerId != null) {
            clearTimeout(lastTimerId);
        }

        return new Promise(resolve => {
            lastTimerId = setTimeout(() => {
                lastTimerId = null;
                resolve(sourceFunction(...args));
            }, delay);
        });
    };
}

/**
 * 节流函数喵
 * 
 * @template {(...args: any[]) => any} T
 * @param {T} sourceFunction
 * @param {number} [delay=500]
 * @returns {import('./utils.d.ts').Asynchronized<T>}
 */
export function throttle(sourceFunction, delay = 500) {
    let lastTimerId = null;

    // @ts-expect-error 还是TS好用喵
    return function(...args) {
        if (lastTimerId != null) {
            return new Promise(() => {});
        }

        return new Promise(resolve => {
            lastTimerId = setTimeout(() => {
                lastTimerId = null;
                resolve(sourceFunction(...args));
            }, delay);
        });
    };
}