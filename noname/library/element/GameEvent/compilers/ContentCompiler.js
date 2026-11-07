import "../../../../../noname.js";
import StepCompiler from "./StepCompiler.js";
import AsyncCompiler from "./AsyncCompiler.js";
import ArrayCompiler from "./ArrayCompiler.js";
import { lib } from "../../../index.js";
class ContentCompiler {
  #compilerTypes = /* @__PURE__ */ new Set();
  #compilers = /* @__PURE__ */ new Set();
  #compiledContent = /* @__PURE__ */ new WeakMap();
  /**
   * ```plain
   * 注册一个编译器实例
   *
   * 如果后面开始全面迁移到 TypeScript，那么请使用依赖注入代替这个方法喵
   * ```
   *
   * @todo 应该使用依赖注入替代
   * @param compiler 编译器实例对象
   */
  addCompiler(compiler2) {
    const type = compiler2.constructor;
    if (typeof type !== "function") {
      throw new TypeError("content编译器没有明确的类型");
    }
    if (this.#compilerTypes.has(type)) {
      throw new TypeError("相同的content编译器类型不能重复注册");
    }
    this.#compilerTypes.add(type);
    this.#compilers.add(compiler2);
  }
  /**
   * ```plain
   * 对无法直接编译的数据做处理
   * ```
   *
   * @param content
   * @returns
   */
  regularize(content) {
    if (typeof content === "string") {
      return lib.element.content[content] ?? lib.element.contents[content];
    } else if (Symbol.iterator in content) {
      return Array.from(content);
    }
    return content;
  }
  /**
   * ```plain
   * 集成的编译函数
   * 通过责任链模式将content分发给所有注册的编译器喵
   * ```
   *
   * @param content
   */
  compile(content) {
    if (content.compiled) {
      return content;
    }
    const target = this.regularize(content);
    const cached = this.#compiledContent.get(target);
    if (cached) {
      return cached;
    }
    for (const compiler2 of this.#compilers) {
      if (!compiler2.filter(target)) {
        continue;
      }
      const compiled = compiler2.compile(target);
      compiled.compiled = true;
      compiled.type = compiler2.type;
      compiled.original = content;
      this.#compiledContent.set(target, compiled);
      return compiled;
    }
    throw new Error(`不受支持的content: 
 ${String(target)}`);
  }
}
const compiler = new ContentCompiler();
compiler.addCompiler(new ArrayCompiler());
compiler.addCompiler(new AsyncCompiler());
compiler.addCompiler(new StepCompiler());
export {
  compiler as default
};
