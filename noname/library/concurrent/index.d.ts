import { Uninstantable } from "../../util/index.js";

export class Concurrent extends Uninstantable {
	/**
	 * 执行一个异步的、步长为1的for range循环
	 *
	 * 由于异步的特性，你无法中途中止循环
	 *
	 * > 步长为1主要是C#的Parallel.ForAsync的步长只能为1，~~绝对不是我懒~~
	 *
	 * @param start - 开始索引（包含）
	 * @param end - 结束索引（不包含）
	 * @param callback - 回调函数，接收当前索引；如果回调函数不包含异步操作，则将退化为同步操作
	 * @returns 返回一个Promise，包含执行其中所有的异常
	 * @throws {TypeError} 如果提供的回调函数不是一个函数
	 */
	static async for<T extends number>(start: T, end: T, callback: ForCallback<T>): Promise<ForException<T>[]>;

	/**
	 * 执行一个异步的for range循环
	 *
	 * 由于异步的特性，你无法中途中止循环，但你可以提供一个AbortSignal，来使回调函数能通过该信号中止
	 *
	 * > 步长为1主要是C#的Parallel.ForAsync的步长只能为1，~~绝对不是我懒~~
	 *
	 * @param start - 开始索引（包含）
	 * @param end - 结束索引（不包含）
	 * @param signal - AbortSignal信号，用于自行中止循环
	 * @param callback - 回调函数，接收当前索引和提供的信号；如果回调函数不包含异步操作，则将退化为同步操作
	 * @returns 返回一个Promise，包含执行其中所有的异常
	 * @throws {TypeError} 如果提供的回调函数不是一个函数
	 */
	static async for<T extends number>(start: T, end: T, signal: AbortSignal, callback: ForCallback<T>): Promise<ForException<T>[]>;

	/**
	 * 执行一个异步的for of循环
	 *
	 * 由于异步的特性，你无法中途中止循环
	 *
	 * > 为了性能考虑，假定传入的可迭代对象均为有限迭代器，请勿传递无限迭代器
	 *
	 * @param iterable - 可迭代对象（请勿传递无限迭代器）
	 * @param callback - 回调函数，接收当前索引；如果回调函数不包含异步操作，则将退化为同步操作
	 * @returns 返回一个Promise，包含执行其中所有的异常
	 * @throws {TypeError} 如果提供的`iterable`不是一个对象，或回调函数不是一个函数
	 */
	static async forEach<T>(iterable: Iterable<T>, callback: ForEachCallback<T>): Promise<ForEachException<T>[]>;

	/**
	 * 执行一个异步的for of循环
	 *
	 * 由于异步的特性，你无法中途中止循环，但你可以提供一个AbortSignal，来使回调函数能通过该信号中止
	 *
	 * > 为了性能考虑，假定传入的可迭代对象均为有限迭代器，请勿传递无限迭代器
	 *
	 * @param iterable - 可迭代对象（请勿传递无限迭代器）
	 * @param signal - AbortSignal信号，用于自行中止循环
	 * @param callback - 回调函数，接收当前索引；如果回调函数不包含异步操作，则将退化为同步操作
	 * @returns 返回一个Promise，包含执行其中所有的异常
	 * @throws {TypeError} 如果提供的`iterable`不是一个对象，或回调函数不是一个函数
	 */
	static async forEach<T>(iterable: Iterable<T>, signal: AbortSignal, callback: ForEachCallback<T>): Promise<ForEachException<T>[]>;

	/**
	 * 执行一个异步的for of循环
	 *
	 * 由于异步的特性，你无法中途中止循环
	 *
	 * > 为了性能考虑，假定传入的可迭代对象均为有限迭代器，请勿传递无限迭代器
	 *
	 * @param iterable - 异步可迭代对象（请勿传递无限迭代器）
	 * @param callback - 回调函数，接收当前索引；如果回调函数不包含异步操作，则将退化为同步操作
	 * @returns 返回一个Promise，包含执行其中所有的异常
	 * @throws {TypeError} 如果提供的`iterable`不是一个对象，或回调函数不是一个函数
	 */
	static async forEach<T>(iterable: AsyncIterable<T>, callback: ForEachCallback<T>): Promise<ForEachException<T>[]>;

	/**
	 * 执行一个异步的for of循环
	 *
	 * 由于异步的特性，你无法中途中止循环，但你可以提供一个AbortSignal，来使回调函数能通过该信号中止
	 *
	 * > 为了性能考虑，假定传入的可迭代对象均为有限迭代器，请勿传递无限迭代器
	 *
	 * @param iterable - 异步可迭代对象（请勿传递无限迭代器）
	 * @param signal - AbortSignal信号，用于自行中止循环
	 * @param callback - 回调函数，接收当前索引；如果回调函数不包含异步操作，则将退化为同步操作
	 * @returns 返回一个Promise，包含执行其中所有的异常
	 * @throws {TypeError} 如果提供的`iterable`不是一个对象，或回调函数不是一个函数
	 */
	static async forEach<T>(iterable: AsyncIterable<T>, signal: AbortSignal, callback: ForEachCallback<T>): Promise<ForEachException<T>[]>;
}

type ForCallback<T extends number> = (index: T, signal: AbortSignal) => Promise<void> | void;
type ForException<T extends number, E extends Error = Error> = { index: number; error: E };

type ForEachCallback<T> = (item: T, signal: AbortSignal) => Promise<void> | void;
type ForEachException<T, E extends Error = Error> = { item: T; error: E };
