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
}

type ForCallback<T extends number> = (index: T, signal: AbortSignal) => Promise<void> | void;
type ForException<T extends number, E extends Error = Error> = { index: number; error: E };
