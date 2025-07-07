import { Uninstantable } from "../../util/index.js";

/**
 * 提供一组用于并发异步操作的静态工具方法
 *
 * 由于 JavaScript 的单线程特性，不能实现真正的并行操作。
 * 该类提供的方法通过异步操作模拟并发执行，优化处理多个异步任务的效率。
 */
export class Concurrent extends Uninstantable {
	/**
	 * 执行一个异步的for range循环
	 *
	 * 由于异步的特性，你无法中途中止循环，但你可以提供一个AbortSignal，来使回调函数能通过该信号中止
	 *
	 * > 步长为1主要是C#的Parallel.ForAsync的步长只能为1，~~绝对不是我懒~~
	 *
	 * @param start - 开始索引（包含）
	 * @param end - 结束索引（不包含）
	 * @param callback - 回调函数，接收当前索引和提供的信号；如果回调函数不包含异步操作，则将退化为同步操作
	 * @param options - 可选参数，具体可参阅`ConcurrentOptions`
	 * @returns 返回一个Promise，包含执行过程中所有的异常
	 * @throws {TypeError} 如果提供的回调函数不是一个函数
	 * @example
	 * // 使用AbortController来控制循环的终止
	 * const controller = new AbortController();
	 * await Concurrent.for(1, 100, async (i, signal) => {
	 * 	if (signal.aborted) return;
	 * 	await someAsyncOperation(i);
	 * }, { signal: controller.signal });
	 */
	static async for<T extends number>(start: T, end: T, callback: ForCallback<T>, options?: ConcurrentOptions): Promise<ForException<T>[]>;

	/**
	 * 执行一个异步的for of循环
	 *
	 * 由于异步的特性，你无法中途中止循环
	 *
	 * > 为了性能考虑，假定传入的可迭代对象均为有限迭代器，请勿传递无限迭代器
	 *
	 * @param iterable - 可迭代对象（请勿传递无限迭代器）
	 * @param callback - 回调函数，接收当前元素；如果回调函数不包含异步操作，则将退化为同步操作
	 * @param options - 可选参数，具体可参阅`ConcurrentOptions`
	 * @returns 返回一个Promise，包含执行过程中所有的异常
	 * @throws {TypeError} 如果提供的`iterable`不是一个对象，或回调函数不是一个函数
	 * @example
	 * // 对数组中的每项进行异步处理
	 * const controller = new AbortController();
	 * const items = [1, 2, 3, 4, 5];
	 * await Concurrent.forEach(items, async (item) => {
	 *   await processItem(item);
	 * }, { signal: controller.signal });
	 */
	static async forEach<T>(iterable: Iterable<T> | AsyncIterable<T>, callback: ForEachCallback<T>, options?: ConcurrentOptions): Promise<ForEachException<T>[]>;
}

/**
 * 并发循环的可选项
 */
export interface ConcurrentOptions {
	/**
	 * AbortSignal信号，用于自行中止循环
	 */
	signal?: AbortSignal;
}

/**
 * For循环回调函数类型
 * @template T 索引类型，必须是数字类型
 */
type ForCallback<T extends number> = (index: T, signal: AbortSignal) => Promise<void> | void;

/**
 * For循环异常信息类型
 * @template T 索引类型，必须是数字类型
 * @template E 错误类型，默认为Error
 */
type ForException<T extends number, E extends Error = Error> = { index: number; error: E };

/**
 * ForEach循环回调函数类型
 * @template T 元素类型
 */
type ForEachCallback<T> = (item: T, signal: AbortSignal) => Promise<void> | void;

/**
 * ForEach循环异常信息类型
 * @template T 元素类型
 * @template E 错误类型，默认为Error
 */
type ForEachException<T, E extends Error = Error> = { item: T; error: E };
