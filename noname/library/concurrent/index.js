import { Uninstantable } from "../../util/index.js";

// 文档信息请查阅对应的`index.d.ts`文件
export class Concurrent extends Uninstantable {
	static #control = new AbortController();

	static async for(begin, end, callback, options) {
		if (typeof callback != "function") {
			throw new TypeError("Callback must be a function");
		}

		const signal = options?.signal ?? this.#control.signal;
		const length = end - begin;

		const promises = Array(length);
		for (let i = begin; i < end; i++) {
			promises[i - begin] = Promise.try(callback, i, signal);
		}
		const results = await Promise.allSettled(promises);

		return Iterator.from(results)
			.map((result, index) => {
				if (result.status == "rejected") {
					return { status: "rejected", index: index + begin, value: result.reason };
				}
				return { status: "fulfilled", index: index + begin, value: result.value };
			})
			.filter(result => result.status == "rejected")
			.map(result => ({ index: result.index, error: result.value }))
			.toArray();
	}

	// 谁传一个无限迭代器我必拷打谁
	static async forEach(iterable, callback, options) {
		if (iterable == null || typeof iterable != "object") {
			throw new TypeError("Iterable must be an object");
		}
		if (typeof callback != "function") {
			throw new TypeError("Callback must be a function");
		}

		const signal = options?.signal ?? this.#control.signal;

		let promises;
		if (Symbol.asyncIterator in iterable) {
			promises = [];
			// 异步迭代除了`for await`外似乎没什么好的办法，先使用`for await`，后续再考虑全盘异步
			for await (const item of iterable) {
				promises.push(createPromise(item));
			}
		} else {
			promises = Iterator.from(iterable)
				.map(item => createPromise(item))
				.toArray();
		}

		const results = await Promise.all(promises);
		return Iterator.from(results)
			.filter(result => result != null)
			.toArray();

		function createPromise(item) {
			return Promise.try(callback, item, signal).then(
				() => null,
				error => ({ item, error })
			);
		}
	}
}
