import { AsyncFunction } from "../../../../util/index.js";
import compiler from "./ContentCompiler.js";
import ContentCompilerBase from "./ContentCompilerBase.js";
class AsyncCompiler extends ContentCompilerBase {
  type = "async";
  filter(content) {
    return typeof content === "function" && content instanceof AsyncFunction;
  }
  compile(content) {
    return compiler.compile([content]);
  }
}
export {
  AsyncCompiler as default
};
