import { PromiseErrorHandler } from "./promise-error-handler";
/**
 * 关于`Google Chrome`的异步错误处理
 *
 * 由于`v8`提供的`Error.prepareStackTrace(error, structuredStackTrace)`接口存在一些限制，导致不适合无名杀
 *
 * 故我们直接解析`Error`的栈堆信息，来获取相关内容
 *
 * ~~`Chrome`所用的`v8`引擎为`Error`提供了特有的报错栈堆处理接口，用于用户自定义报错栈堆的内容。~~
 *
 * ~~我们用到了`Error.prepareStackTrace(error, structuredStackTrace)`这个接口，这个接口的信息可参考[这里](https://v8.dev/docs/stack-trace-api#customizing-stack-traces)~~
 *
 * ~~该接口提供了结构化的栈堆信息，很幸运的是，这个结构化的栈堆能直接告诉我们报错的文件以及位置，故我们使用该接口，让异步报错能直接定位原始位置~~
 */
export class ChromePromiseErrorHandler implements PromiseErrorHandler {
	/**
	 * ~~用于临时记录报错信息的列表，通过`Error.prepareStackTrace`更新该列表~~
	 *
	 * 现在用于存储报错过的错误信息
	 *
	 * @type {Error[]}
	 */
	#errorList;

	/**
	 * 判断是否是v8错误栈堆用到的正则
	 */
	#STACK_REGEXP = /^\s*at .*(\S+:\d+|\(native\))/m;

	/**
	 * ~~初始化`Error.prepareStackTrace`，将该值赋值成我们需要的函数~~
	 *
	 * ~~未防止本来Error.prepareStackTrace便存在赋值的行为，我们将原始值存储，并在需要的函数中调用~~
	 *
	 * 初始化存储报错信息的列表
	 */
	onLoad() {
		/*
		this.#errorList = [];
		this.#originErrorPrepareStackTrace = Error.prepareStackTrace;
		Error.prepareStackTrace = (error, stackTraces) => {
			// 其实这步或许不需要
			// 但真赋值了Error.prepareStackTrace的话，保不齐会出现需要返回值的情况
			const result = this.#originErrorPrepareStackTrace
				? this.#originErrorPrepareStackTrace(error, stackTraces)
				: void 0;
			this.#errorList.push([error, stackTraces]);
			return result;
		};
		*/
		this.#errorList = [];
	}

	/**
	 * ~~将原来可能的`Error.prepareStackTrace`赋值回去~~
	 *
	 * @deprecated
	 */
	onUnload() {
		/*
		Error.prepareStackTrace = this.#originErrorPrepareStackTrace;
		*/
	}

	/**
	 * 在获取报错的时候，我们通过发生报错的`Promise`来进行捕获错误的操作
	 *
	 * 如果捕获出来的错误存放我们存报错栈堆的列表中，则证明该错误能获取到栈堆，由此来获取报错的地址和行列号
	 *
	 * @param {PromiseRejectionEvent} event
	 */
	onHandle(event) {
		event.promise.catch(error => {
			// 如果`error`是个错误，则继续处理
			if (error instanceof Error) {
				if (/Failed to fetch/.test(error.message) || /Failed to load because no supported source was found/.test(error.message)) {
					return;
				}
				// 如果已经处理过该错误，则不再处理
				if (this.#errorList.includes(error)) {
					return;
				}
				this.#errorList.push(error);
				// 如果`error`拥有字符串形式的报错栈堆，且报错栈堆确实符合v8的stack
				if (typeof error.stack === "string" && this.#STACK_REGEXP.test(error.stack)) {
					// 获取符合栈堆信息的字符串，一般来说就是从第二行开始的所有行
					// 为了处理eval的情况，故必须获取完行数
					let lines = error.stack.split("\n").filter(line => this.#STACK_REGEXP.test(line));

					let fileName: string | undefined = void 0;
					let line: number | undefined = void 0;
					let column: number | undefined = void 0;

					// 从第一条开始遍历，一直遍历到不存在eval的位置
					for (let currentLine = 0; currentLine < lines.length; ++currentLine) {
						if (/\(eval /.test(lines[currentLine])) {
							continue;
						}

						let formatedLine = lines[currentLine]
							.replace(/^\s+/, "")
							.replace(/\(eval code/g, "(")
							.replace(/^.*?\s+/, "");

						const location = formatedLine.match(/ (\(.+\)$)/);
						if (location) {
							formatedLine = formatedLine.replace(location[0], "");
						}

						const locationParts = extractLocation(location ? location[1] : formatedLine);

						fileName = ["eval", "<anonymous>"].includes(locationParts[0]) ? void 0 : locationParts[0];
						line = Number(locationParts[1]);
						column = Number(locationParts[2]);
						break;
					}

					// @ts-expect-error Chrome status
					window.onerror(error.message, fileName, line, column, error);
				}
				// 反之我们只能不考虑报错文件信息，直接调用onerror
				else {
					try {
						// @ts-expect-error Maybe success in chrome
						let [_, src = void 0, line = void 0, column = void 0] = /at\s+.*\s+\((.*):(\d*):(\d*)\)/i.exec(error.stack.split("\n")[1]);
						if (typeof line == "string") {
							line = Number(line);
						}
						if (typeof column == "string") {
							column = Number(column);
						}
						// @ts-expect-error Chrome status
						window.onerror(error.message, src, line, column, error);
					} catch (e) {
						// @ts-expect-error Chrome status
						window.onerror(error.message, "", 0, 0, error);
					}
				}
			}
			/*
			console.error(error)
			const result = this.#errorList.find(savedError => savedError[0] === error);
			if (result) {
				// @ts-ignore
				window.onerror(
					result[0].message,
					result[1][0].getScriptNameOrSourceURL(),
					result[1][0].getLineNumber() || void 0,
					result[1][0].getColumnNumber() || void 0,
					result[0]
				);
			}
			*/
		});
	}
}

/**
 * 简易的解析报错栈堆位置信息的函数
 *
 * @param {string} urlLike
 * @returns {string[]}
 */
export function extractLocation(urlLike) {
	// 不存在地址信息的字符串
	if (!/:/.test(urlLike)) {
		return [urlLike];
	}

	// 捕获位置用到的正则
	const regExp = /(.+?)(?::(\d+))?(?::(\d+))?$/;
	const parts = regExp.exec(urlLike.replace(/[()]/g, ""));

	// @ts-expect-error Chrome status
	return [parts[1], parts[2] || void 0, parts[3] || void 0];
}
