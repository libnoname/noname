import { AsyncFunction } from "../../../../util/index.js";
import ContentCompiler from "./ContentCompiler.js";
import ContentCompilerBase from "./ContentCompilerBase.js";
export default class AsyncCompiler extends ContentCompilerBase {
	type = "async";
	filter(content) {
		return typeof content === "function" && content instanceof AsyncFunction;
	}
	compile(content) {
		return ContentCompiler.compile([content]);
	}
}
