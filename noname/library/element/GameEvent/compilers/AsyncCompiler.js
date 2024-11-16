import ContentCompiler from "./ContentCompiler.js";
import ContentCompilerBase from "./ContentCompilerBase.js";
export default class AsyncCompiler extends ContentCompilerBase {
    type = "async";
    filter(content) {
        if (typeof content !== 'function') return false;
        return content.constructor.name === "AsyncFunction" && content.length >= 1;
    }
    compile(content) {
        return ContentCompiler.compile([content]);
    }
}