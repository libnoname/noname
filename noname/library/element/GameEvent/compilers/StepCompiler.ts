// 喵喵！step写法的content全在这里处理喵！
import { _status, ai, game, get, lib, ui } from "noname";
import { AsyncFunction, GeneratorFunction, AsyncGeneratorFunction } from "@/util/index.js";
import { security, CodeSnippet, ErrorManager } from "@/util/sandbox.js"
import { EventContent } from "./IContentCompiler.ts";
import ContentCompilerBase from "./ContentCompilerBase.ts";
import ContentCompiler from "./ContentCompiler.ts";

type GeneralFunction = (...args: any[]) => any;

export default class StepCompiler extends ContentCompilerBase {
	type = "step";

	filter(content: EventContent) {
		return typeof content === "function" && ![AsyncFunction, GeneratorFunction, AsyncGeneratorFunction].some(parent => content instanceof parent);
	}

	compile(content: EventContent) {
		if (typeof content != "function") {
			throw new Error("StepCompiler只能接受函数");
		}

		return new StepParser(content).getResult();
	}
}

/**
 * @author 诗笺、Tipx-L
 */
class StepParser {
	static deconstructs = ["step", "source", "target", "targets", "card", "cards", "skill", "forced", "num", "_result: result"];
	static topVars = ["_status", "lib", "game", "ui", "get", "ai"];
	static params = ["topVars", "event", "trigger", "player"];

	/**
	 * 虽然现在 parsex 被控制到了沙盒，
	 * 但是因为默认沙盒还是可以额外操作东西，
	 * 故而对不同的运行域做了区分
	 */
	functionConstructor: new (...args: string[]) => GeneralFunction;
	str: string;
	stepHead: string = "";
	//func中要写步骤的话，必须要写step 0
	step: number = 0;
	contents: GeneralFunction[] = [];
	originals: GeneralFunction[] = [];

	constructor(func: GeneralFunction) {
		if (typeof func !== "function") {
			throw new TypeError("为确保安全禁止用parsex/parseStep解析非函数");
		}
		// ModAsyncFunction
		this.functionConstructor = security.getIsolatedsFrom(func)[2] as any;
		this.str = this.formatFunction(func);
		if (lib.config.dev) {
			this.replaceDebugger();
		}
	}

	getResult(): (e: GameEvent) => Promise<void> {
		this.parseStep();
		const result = ContentCompiler.compile(this.contents);
		result.originals = this.originals;
		return result;
	}

	parseStep() {
		let skipIndex = 0;
		//去除99个step的限制
		while (true) {
			const result = this.str.slice(skipIndex).match(new RegExp(`\\(?['"]step ${this.step}['"]\\)?;?`));
			if (result == null || result.index == null) {
				this.packStep(this.str);
				break;
			}

			const head = this.str.slice(0, skipIndex + result.index);

			if (this.step === 0) {
				this.stepHead = head.trim();
			} else {
				try {
					this.packStep(head);
				} catch (e) {
					skipIndex = result.index + result[0].length;
					continue;
				}
			}

			this.str = this.str.slice(head.length + result[0].length);
			skipIndex = 0;
			this.step++;
		}
	}

	packStep(code: string) {
		const compiled = new this.functionConstructor(
			...StepParser.params,
			`
            var { ${StepParser.deconstructs.join(", ")} } = event;
            var { ${StepParser.topVars.join(", ")} } = topVars;
            
            ${this.stepHead}
            {
                ${code}
            }
        `
		);
		ErrorManager.setCodeSnippet(compiled, new CodeSnippet(code, 3)); // 记录编译后函数的原代码片段
		this.originals.push(compiled);
		this.contents.push(function (event, trigger, player) {
			// @ts-expect-error ignore
			return compiled.apply(this, [{ _status, ai, game, get, lib, ui }, event, trigger, player]);
		});
	}

	formatFunction(func: GeneralFunction) {
		// 沙盒在封装函数时，为了保存源代码会另外存储函数的源代码
		const decompileFunction: (func: GeneralFunction) => string = security.isSandboxRequired() ? security.importSandbox().Marshal.decompileFunction : Function.prototype.call.bind(Function.prototype.toString);

		//移除所有注释
		const code = decompileFunction(func)
			.replace(/((?:(?:^[ \t]*)?(?:\/\*[^*]*\*+(?:[^/*][^*]*\*+)*\/(?:[ \t]*\r?\n(?=[ \t]*(?:\r?\n|\/\*|\/\/)))?|\/\/(?:[^\\]|\\(?:\r?\n)?)*?(?:\r?\n(?=[ \t]*(?:\r?\n|\/\*|\/\/))|(?=\r?\n))))+)|("(?:\\[\s\S]|[^"\\])*"|'(?:\\[\s\S]|[^'\\])*'|(?:\r?\n|[\s\S])[^/"'\\\s]*)/gm, "$2")
			.trim();

		//移除两边括号
		return code
			.slice(0, code.lastIndexOf("}"))
			.slice(code.indexOf("{") + 1)
			.trim();
	}

	replaceDebugger() {
		const regex = /event\.debugger\(\)/;
		// let hasDebugger = false;
		const insertDebugger = `await event.debugger()`; // yield code=>eval(code) 唔唔不是我干的喵
		let debuggerSkip = 0;
		let debuggerResult: RegExpMatchArray | null;

		while ((debuggerResult = this.str.slice(debuggerSkip).match(regex)) != null) {
			if (debuggerResult.index == null) {
				throw new Error("匹配到了debugger但是没有索引值");
			}

			let debuggerCopy = this.str;
			debuggerCopy = debuggerCopy.slice(0, debuggerSkip + debuggerResult.index) + insertDebugger + debuggerCopy.slice(debuggerSkip + debuggerResult.index + debuggerResult[0].length, -1);
			try {
				new this.functionConstructor(debuggerCopy);
				this.str = debuggerCopy + "}";
				debuggerSkip += debuggerResult.index + insertDebugger.length;
				// hasDebugger = true;
			} catch (error) {
				debuggerSkip += debuggerResult.index + debuggerResult[0].length;
			}
		}
	}
}
