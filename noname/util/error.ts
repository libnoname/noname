import { promiseErrorHandlerMap } from "@/util/promise-error-handler";
import StackFrame from "stackframe";
import ErrorStackParser from "error-stack-parser";
import StackTraceGPS from "stacktrace-gps";

class CodeSnippet {
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

class ErrorReporter {
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

class ErrorManager {
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

	static getStatusInfo({ lib, get, _status }) {
		if (!_status?.event) return "";

		let str = "";
		const evt = _status.event;
		str += `\nevent.name: ${evt.name}\nevent.step: ${evt.step}`;
		if (evt.parent) {
			str += `\nevent.parent.name: ${evt.parent.name}\nevent.parent.step: ${evt.parent.step}`;
		}
		if (evt.parent && evt.parent.parent) {
			str += `\nevent.parent.parent.name: ${evt.parent.parent.name}\nevent.parent.parent.step: ${evt.parent.parent.step}`;
		}
		if (evt.player || evt.target || evt.source || evt.skill || evt.card) {
			str += "\n-------------";
		}
		if (evt.player) {
			if (lib.translate[evt.player.name]) {
				str += `\nplayer: ${lib.translate[evt.player.name]}[${evt.player.name}]`;
			} else {
				str += "\nplayer: " + evt.player.name;
			}
			let distance = get.distance(_status.roundStart, evt.player, "absolute");
			if (distance != Infinity) {
				str += `\n座位号: ${distance + 1}`;
			}
		}
		if (evt.target) {
			if (lib.translate[evt.target.name]) {
				str += `\ntarget: ${lib.translate[evt.target.name]}[${evt.target.name}]`;
			} else {
				str += "\ntarget: " + evt.target.name;
			}
		}
		if (evt.source) {
			if (lib.translate[evt.source.name]) {
				str += `\nsource: ${lib.translate[evt.source.name]}[${evt.source.name}]`;
			} else {
				str += "\nsource: " + evt.source.name;
			}
		}
		if (evt.skill) {
			if (lib.translate[evt.skill]) {
				str += `\nskill: ${lib.translate[evt.skill]}[${evt.skill}]`;
			} else {
				str += "\nskill: " + evt.skill;
			}
		}
		if (evt.card) {
			if (lib.translate[evt.card.name]) {
				str += `\ncard: ${lib.translate[evt.card.name]}[${evt.card.name}]`;
			} else {
				str += "\ncard: " + evt.card.name;
			}
		}
		return str;
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
	 * 目前和StackTrace.fromError一样
	 * @param error
	 * @param opts
	 * @returns
	 */
	static async fromError(error: Error, opts?: StackTraceGPS.Options): Promise<{ origin: StackFrame; source?: StackFrame }[]> {
		try {
			const gps = new StackTraceGPS(opts);
			const stackframes = ErrorStackParser.parse(error);
			return Promise.all(
				stackframes.map(async sf => {
					try {
						const source = await gps.pinpoint(sf);
						return { origin: sf, source };
					} catch {
						return { origin: sf };
					}
				})
			);
		} catch (e) {
			return [{ origin: new StackFrame({}) }];
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

export async function setOnError({ lib, game, get, _status }) {
	const [core] = get.coreInfo();

	const promiseErrorHandler = new (core in promiseErrorHandlerMap ? promiseErrorHandlerMap[core] : promiseErrorHandlerMap.other)();

	if (promiseErrorHandler.onLoad) {
		await promiseErrorHandler.onLoad();
	}

	window.onunhandledrejection = async event => {
		if (promiseErrorHandler.onHandle) {
			await promiseErrorHandler.onHandle(event);
		}
	};

	window.onerror = async function (msg: string | Event, src?: string, line?: number, column?: number, err?: Error) {
		if (!err) return;
		const stackframes = await ErrorManager.fromError(err);
		const frame = stackframes[0].source || stackframes[0].origin;
		const log: string[] = [];
		const winPath = window.__dirname ? "file:///" + (__dirname.replace(new RegExp("\\\\", "g"), "/") + "/") : "";
		log.push(`错误文件: ${typeof src == "string" ? decodeURI(src).replace(lib.assetURL, "").replace(winPath, "") : "未知文件"}`);
		log.push(`错误信息: ${msg}`);
		const tip = lib.getErrorTip(msg);
		if (tip) {
			log.push(`错误提示: ${tip}`);
		}
		log.push(`行号: ${frame.lineNumber}`);
		log.push(`列号: ${frame.columnNumber}`);
		const version = typeof lib.version != "undefined" ? lib.version : "";
		const match = version.match(/[^\d.]/) != null;
		log.push(`${match ? "游戏" : "无名杀"}版本: ${version || "未知版本"}`);
		if (match) {
			log.push("⚠️您使用的游戏代码不是源于libnoname/noname无名杀官方仓库，请自行寻找您所使用的游戏版本开发者反馈！");
		}
		log.push(ErrorManager.getStatusInfo({ lib, get, _status }));
		log.push("-------------");
		const errorReporter = ErrorManager.getErrorReporter(err);
		if (errorReporter) {
			game.print(errorReporter.report(log.join("\n") + "\n代码出现错误"));
		} else {
			if (typeof line == "number" && (typeof game.readFile == "function" || location.origin != "file://")) {
				/**
				 * @param code 源代码
				 * @param line 代码报错行数
				 */
				const createShowCode = (code: string, line: number) => {
					const lines = code.split("\n");
					const showCode: string[] = [];
					// 10行窗口
					for (let i = Math.max(0, line - 5); i < line + 6 && i < lines.length; i++) {
						showCode.push(`${i + 1}| ${line == i + 1 ? "⚠️" : ""}${lines[i]}`);
					}
					showCode.push("-------------");
					return showCode;
				};
				// 解析step content的错误
				if (frame.functionName === "packStep") {
					const codes = _status.event.content.originals[_status.event.step];
					if (typeof codes == "function") {
						const regex = /<anonymous>:(\d+):\d+/;
						const match = err.stack?.split("\n")[1].match(regex);
						if (match) {
							log.push(...createShowCode(codes.toString(), parseInt(match[1])));
						}
					}
				}
				// 协议名须和html一致(网页端防跨域)，且文件是js
				else if (typeof src == "string" && src.startsWith(location.protocol) && src.endsWith(".js")) {
					const sourcePath = "local:" + decodeURI(src).replace(lib.assetURL, "").replace(winPath, "");
					//获取sourcemap
					try {
						const source = stackframes[0].source;
						if (!source?.fileName) throw new Error();

						let rawSourceMap = lib.init.reqSync(sourcePath + ".map");
						if (!rawSourceMap) throw new Error();
						const sourceMap = JSON.parse(rawSourceMap);

						function relativeUrl(from: string, to: string): string {
							try {
								const fromUrl = new URL(from);
								const toUrl = new URL(to);

								if (fromUrl.origin !== toUrl.origin) {
									// 不同域名没法相对，直接返回绝对路径
									return to;
								}

								const fromParts = fromUrl.pathname.split("/").filter(Boolean);
								const toParts = toUrl.pathname.split("/").filter(Boolean);

								// 找到公共前缀长度
								let i = 0;
								while (i < fromParts.length && i < toParts.length && fromParts[i] === toParts[i]) {
									i++;
								}

								const backSteps = fromParts.length - i;
								const relativeParts = [...Array(backSteps).fill(".."), ...toParts.slice(i)];

								return relativeParts.join("/") || toParts[toParts.length - 1];
							} catch {
								return to;
							}
						}

						const file = relativeUrl(src, source.fileName);
						const content = sourceMap.sourcesContent[sourceMap.sources.indexOf(file)];

						log.push(...createShowCode(content, frame.lineNumber || 0));
					} catch (e) {
						let code = lib.init.reqSync(sourcePath);
						if (code) log.push(...createShowCode(code, frame.lineNumber || 0));
					}
				}
			}
			if (err && err.stack) {
				log.push(`${err.name}: ${err.message}`);
				log.push(
					...stackframes.map(frame => {
						const f = frame.source || frame.origin;
						return `    at ${f.functionName || "(anonymous)"} (${decodeURI(f.fileName || "")
							.replace(new RegExp(lib.assetURL, "g"), "")
							.replace(new RegExp(winPath, "g"), "")}:${f.lineNumber}:${f.columnNumber})`;
					})
				);
			}
			alert(log.join("\n"));
			game.print(log.join("\n"));
		}
		// window.ea = [msg, src, line, column, err];
		// window.em = msg;
		// window.el = line;
		// window.ec = column;
		// window.eo = err;
	};

	return promiseErrorHandler;
}

export { CodeSnippet, ErrorReporter, ErrorManager };
