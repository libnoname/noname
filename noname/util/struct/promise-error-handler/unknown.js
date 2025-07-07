/**
 * 关于除已实现浏览器外其余浏览器的异步错误处理
 *
 * 很遗憾，对于这类浏览器，因为标准未涉及报错栈堆或地址及行列号，故我们只能直接，暴力地throw出我们捕获到的错误，
 *
 * 尽管我们还是会为了这类浏览器判断是不是捕获到了一个`Error`
 *
 * 总之，虽然这里跟Safari无关，但我们还是为新时代IE默哀一秒
 *
 * @implements {PromiseErrorHandler}
 */
export class UnknownPromiseErrorHandler {
	/**
	 * 在获取报错的时候，我们通过发生报错的`Promise`来进行捕获错误的操作
	 *
	 * 如果捕获到的错误是`Error`，则...我们只能暴力的将`Error`再次`throw`出去
	 *
	 * @param {PromiseRejectionEvent} event
	 */
	onHandle(event) {
		event.promise.catch(error => {
			if (typeof error === "object" && error instanceof Error) {
				if (/Failed to fetch/.test(error.message)) {
					return;
				}
				// 很遗憾，因浏览器问题，你只能看到这一段
				throw error;
			}
		});
	}
}

/**
 * @typedef {import('../interface/promise-error-handler').PromiseErrorHandler} PromiseErrorHandler
 */
