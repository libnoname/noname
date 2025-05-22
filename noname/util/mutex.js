/**
 * 一个非常普通的“锁”
 */
export class Mutex {
	/**
	 * 锁目前的状态，只有“unlocked”和“locked”两种情况
	 *
	 * @type {'locked' | 'unlocked'}
	 */
	#status;

	/**
	 * 上锁后用于等待的锁Promise
	 *
	 * @type {null | Promise<void>}
	 */
	#promise;

	/**
	 * 上锁后用于触发锁Promise的resolve函数
	 *
	 * @type {null | function(): void}
	 */
	#resolve;

	constructor() {
		this.#status = "unlocked";
		this.#promise = null;
		this.#resolve = null;
	}

	/**
	 * 上锁
	 *
	 * 请时刻记住使用`await Mutex#lock()`来使锁正常工作
	 */
	async lock() {
		switch (this.#status) {
			case "locked":
				await this.#promise;
			// [falls through]
			case "unlocked":
				this.#status = "locked";
				({ promise: this.#promise, resolve: this.#resolve } = Promise.withResolvers());
				break;
		}
	}

	/**
	 * 解锁
	 *
	 * 请不要在未上锁的情况下解锁
	 */
	unlock() {
		if (this.#status === "unlocked") {
			throw new Error("This Mutex is not locked.");
		}

		this.#status = "unlocked";
		if (this.#resolve) {
			this.#resolve();
		}
	}

	/**
	 * 启用锁的try-finally封装，用于在函数执行完后自动解放锁的控制权（就算发生错误）
	 *
	 * @param {function(): void | Promise<void>} content
	 */
	async scoped(content) {
		try {
			await this.lock();
			await content();
		} finally {
			this.unlock();
		}
	}
}
