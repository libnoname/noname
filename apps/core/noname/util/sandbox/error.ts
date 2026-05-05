export class CodeSnippet {
	static #snippetStack: CodeSnippet[] = [];

	#code: string;
	#erroff: number;

	/**
	 * ```plain
	 * 构造一个代码片段对象
	 *
	 * 通过 `erroff` 指定在发生错误时，错误信息指出的行与实际代码行的偏移量
	 * ```
	 */
	constructor(code: string, erroff: number = 0) {
		this.#code = String(code);
		this.#erroff = parseInt(String(erroff)) || 0;
	}

	get code(): string {
		return this.#code;
	}

	get lines(): string[] {
		return this.code.split(/\r?\n/);
	}

	/**
	 * ```plain
	 * 给定错误行号来获取错误代码片段
	 * ```
	 */
	viewCode(lineno: number): string {
		const range = 5;

		if (!Number.isInteger(lineno)) {
			throw new TypeError("错误行号必须是一个整数");
		}

		const index = lineno - this.#erroff;
		const lines = this.lines;
		const width = String(index + range).length;

		let codeView = "";

		for (let i = index - range; i < index + range + 1; i++) {
			if (i < 0 || i >= lines.length) {
				continue;
			}

			codeView += String(i + 1).padStart(width, "0");
			codeView += `|${i == index ? "⚠️" : "    "}${lines[i]}\n`;
		}

		return codeView;
	}

	/**
	 * ```plain
	 * 获取当前代码片段
	 * ```
	 */
	static get currentSnippet() {
		if (!this.#snippetStack.length) {
			return null;
		}

		return this.#snippetStack[this.#snippetStack.length - 1];
	}

	/**
	 * ```plain
	 * 压入一个代码片段作为当前代码片段
	 * ```
	 */
	static pushSnippet(snippet: CodeSnippet) {
		if (!(snippet instanceof CodeSnippet)) {
			throw new TypeError("参数必须是一个代码片段对象");
		}

		this.#snippetStack.push(snippet);
	}

	/**
	 * ```plain
	 * 弹出当前代码片段
	 * ```
	 */
	static popSnippet(): CodeSnippet {
		if (!this.#snippetStack.length) {
			throw new Error("代码片段栈为空");
		}

		return this.#snippetStack.pop()!;
	}
}

export class ErrorReporter {
	static #topAlert = window.alert.bind(null);
	static #errorLineNoPatterns = [/<anonymous>:(\d+):\d+\)/, /at <anonymous>:(\d+):\d+/, /eval:(\d+):\d+/, /Function:(\d+):\d+/, /:(\d+):\d+/];

	#snippet: CodeSnippet | null;
	#message: string;
	#stack: string;

	/**
	 * ```plain
	 * 构造一个错误报告对象
	 * 以此来保存错误相关信息
	 * ```
	 */
	constructor(error: Error, snippet: CodeSnippet | null = CodeSnippet.currentSnippet) {
		if (!("stack" in error)) {
			throw new TypeError("传入的对象不是一个错误对象");
		}

		this.#snippet = snippet;
		this.#message = String(error);
		this.#stack = String(error.stack);
	}

	get message() {
		return this.#message;
	}

	get stack() {
		return this.#stack;
	}

	static #findLineNo(line: string): number {
		for (const pattern of ErrorReporter.#errorLineNoPatterns) {
			const match = pattern.exec(line);

			if (match) {
				return parseInt(match[1]);
			}
		}

		return NaN;
	}

	viewCode() {
		if (!this.#snippet) {
			return null;
		}

		const stack = this.#stack;
		const line = stack.split("\n")[1];
		const lineno = ErrorReporter.#findLineNo(line);

		if (!isNaN(lineno)) {
			return this.#snippet.viewCode(lineno);
		}

		return null;
	}

	/**
	 * ```plain
	 * 向用户报告错误信息
	 * ```
	 */
	report(title: string): string {
		const codeView = this.viewCode() || "#没有代码预览#";
		let errorInfo = `${title}:\n\t${this.#message}\n`;
		errorInfo += `-------------\n${codeView.trim()}\n`;
		errorInfo += `-------------\n调用堆栈:\n${this.#stack}`;
		ErrorReporter.#topAlert(errorInfo);
		return errorInfo;
	}

	/**
	 * ```plain
	 * 向用户报告错误信息
	 * ```
	 */
	static reportError(error: Error, title: string = "发生错误") {
		new ErrorReporter(error).report(title);
	}
}

export class ErrorManager {
	static #codeSnippets = new WeakMap<Function, CodeSnippet>();
	static #errorReporters = new WeakMap<object, ErrorReporter>();

	/**
	 * ```plain
	 * 获取函数对应的代码片段
	 * ```
	 */
	static getCodeSnippet(func: Function): CodeSnippet | null {
		if (typeof func !== "function") {
			throw new TypeError("参数func必须是一个function");
		}

		return this.#codeSnippets.get(func) || null;
	}

	/**
	 * ```plain
	 * 设置函数对应的代码片段
	 * ```
	 */
	static setCodeSnippet(func: Function, snippet: CodeSnippet) {
		if (typeof func !== "function") {
			throw new TypeError("参数func必须是一个function");
		}
		if (!(snippet instanceof CodeSnippet)) {
			throw new TypeError("参数snippet必须是一个CodeSnippet");
		}

		return this.#codeSnippets.set(func, snippet);
	}

	/**
	 * ```plain
	 * 获取错误堆栈中与行列无关的错误信息
	 * ```
	 */
	static #getFramesHead(error: Error): string[] | null {
		return (
			error.stack
				?.slice(String(error).length + 1)
				.split("\n")
				.map(line => {
					line = line.trim();
					const match = /^\s*(.+?):\d+:\d+/.exec(line);
					return match ? match[1] : line;
				}) || null
		);
	}

	/**
	 * ```plain
	 * 计算错误A比错误B多的堆栈层数
	 * ```
	 */
	static #compareStackLevel(errorA: Error, errorB: Error): number | null {
		const stackA = ErrorManager.#getFramesHead(errorA);
		const stackB = ErrorManager.#getFramesHead(errorB);

		if (!stackA || !stackB || stackA.length < stackB.length) {
			return null;
		}

		const lastFrameA = stackA[stackA.length - 1];
		const indexInB = stackB.lastIndexOf(lastFrameA);

		if (indexInB === -1) {
			return stackA.length - stackB.length;
		}

		return stackA.length - indexInB - 1;
	}

	/**
	 * ```plain
	 * 封装被设定了代码片段函数的错误捕获调用
	 *
	 * 当 `body` 函数在它这一层调用栈中出现错误时
	 * 此函数将自动记录此次错误信息并整理相关代码片段
	 * ```
	 * @example
	 * ```javascript
	 * ErrorManager.errorHandle(() => {
	 *     event.content(...);
	 * }, event.content);
	 * ```
	 *
	 * @param action 调用函数的闭包
	 * @param body 实际被调用的函数，同时也是持有代码片段的函数
	 * @param extraLevel action调用到body的间隔调用栈层数
	 */
	static errorHandle(action: Function, body: Function, extraLevel = 0) {
		const snippet = ErrorManager.getCodeSnippet(body);

		try {
			action();
		} catch (e) {
			if (!(e instanceof Error)) {
				throw e;
			}

			if (snippet) {
				const diff = ErrorManager.#compareStackLevel(e, new Error());

				if (diff && diff == 2 + extraLevel) {
					ErrorManager.setErrorReporter(e, snippet);
				}
			}

			throw e;
		}
	}

	/**
	 * ```plain
	 * 设置错误报告器
	 *
	 * 在报告错误时可以从此处获取错误报告器来直接报告错误
	 * ```
	 */
	static setErrorReporter(obj: object, reporter: ErrorReporter | CodeSnippet | null = null) {
		if (obj !== Object(obj)) {
			throw new TypeError("参数必须是一个对象");
		}

		if (!(reporter instanceof ErrorReporter)) {
			if (reporter instanceof CodeSnippet) {
				reporter = new ErrorReporter(obj as Error, reporter);
			} else {
				reporter = new ErrorReporter(obj as Error);
			}
		}

		ErrorManager.#errorReporters.set(obj, reporter);
	}

	/**
	 * ```plain
	 * 获取设置的错误报告器
	 * ```
	 */
	static getErrorReporter(obj: object): ErrorReporter | null {
		return ErrorManager.#errorReporters.get(obj) || null;
	}
}
