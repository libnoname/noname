/**
 * 关于`Mozilla Firefox`的异步错误处理
 *
 * 很幸运，Mozilla直接为`Firefox`的报错提供了地址和行列号，故我们能直接获取到要获取的信息，不用像`v8`那样通过栈堆获取
 *
 * 虽然但是，我们还是需要判断一下捕获的报错是否是错误
 *
 * @implements {PromiseErrorHandler}
 */
export class FirefoxPromiseErrorHandler {
	/**
	 * 在获取报错的时候，我们通过发生报错的`Promise`来进行捕获错误的操作
	 *
	 * 如果捕获到的错误是`Error`，则能直接通过`Firefox`的特性来获取地址和行列号
	 *
	 * @param {PromiseRejectionEvent} event
	 */
	onHandle(event) {
		event.promise.catch(error => {
			if (typeof error === "object" && error instanceof Error) {
				if (/Failed to fetch/.test(error.message) || /The media resource indicated by the src attribute or assigned media provider object was not suitable/.test(error.message)) {
					return;
				}

				// Firefox在大环境下默认情况必须要那么多ts-ignore
				// @ts-expect-error Firefox status
				window.onerror(
					error.message,
					// @ts-expect-error Firefox status
					error.fileName,
					// @ts-expect-error Firefox status
					error.lineNumber,
					// @ts-expect-error Firefox status
					error.columnNumber,
					error
				);
			}
		});
	}
}

/**
 * @typedef {import('../interface/promise-error-handler').PromiseErrorHandler} PromiseErrorHandler
 */
