import { Uninstantable } from "../../util/index.js";

// 文档信息请查阅对应的`index.d.ts`文件
export class Concurrent extends Uninstantable {
	static #control = new AbortController();

	static async for(begin, end, signal, callback) {
		if (typeof signal == "function") {
			callback = signal;
			signal = this.#control.signal;
		}
		if (typeof callback != "function") {
			throw new TypeError("Callback must be a function");
		}

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
}
