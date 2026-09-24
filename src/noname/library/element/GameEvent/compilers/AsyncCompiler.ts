// 因为需要规范content的函数体，所以即使是async也要编译喵！
import { AsyncFunction } from "@/util/index.js";
import ContentCompiler from "./ContentCompiler.ts";
import ContentCompilerBase from "./ContentCompilerBase.ts";
import { EventContent } from "./IContentCompiler.ts";

type AsyncFunction<R> = (...args: any[]) => Promise<R>;

export default class AsyncCompiler extends ContentCompilerBase {
	type = "async";

	filter(content: EventContent): boolean {
		return typeof content === "function" && content instanceof AsyncFunction;
	}

	compile(content: EventContent) {
		return ContentCompiler.compile([content as AsyncFunction<void>]);
	}
}
