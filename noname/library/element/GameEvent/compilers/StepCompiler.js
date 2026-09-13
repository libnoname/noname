import "../../../../../noname.js";
import { AsyncFunction, GeneratorFunction, AsyncGeneratorFunction } from "../../../../util/index.js";
import "../../../../util/sandbox.js";
import ContentCompilerBase from "./ContentCompilerBase.js";
import compiler from "./ContentCompiler.js";
import { security } from "../../../../util/sandbox/security.js";
import { ErrorManager, CodeSnippet } from "../../../../util/sandbox/error.js";
import { ui } from "../../../../ui/index.js";
import { lib } from "../../../index.js";
import { get } from "../../../../get/index.js";
import { game } from "../../../../game/index.js";
import { ai } from "../../../../ai/index.js";
import { _status } from "../../../../status/index.js";
class StepCompiler extends ContentCompilerBase {
  type = "step";
  filter(content) {
    return typeof content === "function" && ![AsyncFunction, GeneratorFunction, AsyncGeneratorFunction].some((parent) => content instanceof parent);
  }
  compile(content) {
    if (typeof content != "function") {
      throw new Error("StepCompiler只能接受函数");
    }
    return new StepParser(content).getResult();
  }
}
class StepParser {
  static deconstructs = ["step", "source", "target", "targets", "card", "cards", "skill", "forced", "num", "_result: result"];
  static topVars = ["_status", "lib", "game", "ui", "get", "ai"];
  static params = ["topVars", "event", "trigger", "player"];
  /**
   * 虽然现在 parsex 被控制到了沙盒，
   * 但是因为默认沙盒还是可以额外操作东西，
   * 故而对不同的运行域做了区分
   */
  functionConstructor;
  str;
  stepHead = "";
  //func中要写步骤的话，必须要写step 0
  step = 0;
  contents = [];
  originals = [];
  constructor(func) {
    if (typeof func !== "function") {
      throw new TypeError("为确保安全禁止用parsex/parseStep解析非函数");
    }
    this.functionConstructor = security.getIsolatedsFrom(func)[2];
    this.str = this.formatFunction(func);
  }
  getResult() {
    this.parseStep();
    const result = compiler.compile(this.contents);
    result.originals = this.originals;
    return result;
  }
  parseStep() {
    let skipIndex = 0;
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
  packStep(code) {
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
    ErrorManager.setCodeSnippet(compiled, new CodeSnippet(code, 3));
    this.originals.push(compiled);
    this.contents.push(function(event, trigger, player) {
      return compiled.apply(this, [{ _status, ai, game, get, lib, ui }, event, trigger, player]);
    });
  }
  formatFunction(func) {
    const decompileFunction = security.isSandboxRequired() ? security.importSandbox().Marshal.decompileFunction : Function.prototype.call.bind(Function.prototype.toString);
    const code = decompileFunction(func).replace(/((?:(?:^[ \t]*)?(?:\/\*[^*]*\*+(?:[^/*][^*]*\*+)*\/(?:[ \t]*\r?\n(?=[ \t]*(?:\r?\n|\/\*|\/\/)))?|\/\/(?:[^\\]|\\(?:\r?\n)?)*?(?:\r?\n(?=[ \t]*(?:\r?\n|\/\*|\/\/))|(?=\r?\n))))+)|("(?:\\[\s\S]|[^"\\])*"|'(?:\\[\s\S]|[^'\\])*'|(?:\r?\n|[\s\S])[^/"'\\\s]*)/gm, "$2").trim();
    return code.slice(0, code.lastIndexOf("}")).slice(code.indexOf("{") + 1).trim();
  }
}
export {
  StepCompiler as default
};
