import StackFrame from "../../_virtual/stackframe.js";
import ErrorStackParser from "../../_virtual/error-stack-parser.js";
import StackTraceGPS from "../../_virtual/stacktrace-gps.js";
import "./sandbox.js";
import { ErrorManager } from "./sandbox/error.js";
function getStatusInfo({ lib, get, _status }) {
  if (!_status?.event) return "";
  let str = "";
  const evt = _status.event;
  str += `
event.name: ${evt.name}
event.step: ${evt.step}`;
  if (evt.parent) {
    str += `
event.parent.name: ${evt.parent.name}
event.parent.step: ${evt.parent.step}`;
  }
  if (evt.parent && evt.parent.parent) {
    str += `
event.parent.parent.name: ${evt.parent.parent.name}
event.parent.parent.step: ${evt.parent.parent.step}`;
  }
  if (evt.player || evt.target || evt.source || evt.skill || evt.card) {
    str += "\n-------------";
  }
  if (evt.player) {
    if (lib.translate[evt.player.name]) {
      str += `
player: ${lib.translate[evt.player.name]}[${evt.player.name}]`;
    } else {
      str += "\nplayer: " + evt.player.name;
    }
    let distance = get.distance(_status.roundStart, evt.player, "absolute");
    if (distance != Infinity) {
      str += `
座位号: ${distance + 1}`;
    }
  }
  if (evt.target) {
    if (lib.translate[evt.target.name]) {
      str += `
target: ${lib.translate[evt.target.name]}[${evt.target.name}]`;
    } else {
      str += "\ntarget: " + evt.target.name;
    }
  }
  if (evt.source) {
    if (lib.translate[evt.source.name]) {
      str += `
source: ${lib.translate[evt.source.name]}[${evt.source.name}]`;
    } else {
      str += "\nsource: " + evt.source.name;
    }
  }
  if (evt.skill) {
    if (lib.translate[evt.skill]) {
      str += `
skill: ${lib.translate[evt.skill]}[${evt.skill}]`;
    } else {
      str += "\nskill: " + evt.skill;
    }
  }
  if (evt.card) {
    if (lib.translate[evt.card.name]) {
      str += `
card: ${lib.translate[evt.card.name]}[${evt.card.name}]`;
    } else {
      str += "\ncard: " + evt.card.name;
    }
  }
  return str;
}
function normalizeError(reason) {
  if (reason instanceof Error) return reason;
  if (typeof reason === "string") {
    return new Error(reason);
  }
  try {
    return new Error(JSON.stringify(reason));
  } catch {
    return new Error(String(reason));
  }
}
async function fromError(error, opts) {
  try {
    const gps = new StackTraceGPS(opts);
    const stackframes = ErrorStackParser.parse(error);
    return Promise.all(
      stackframes.map(async (sf) => {
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
function setOnError({ lib, game, get, _status }) {
  window.onunhandledrejection = async (event) => {
    const error = normalizeError(event.reason);
    window.onerror?.(error.message, void 0, void 0, void 0, error);
  };
  window.onerror = async (_msg, _src, _line, _column, err) => {
    if (!err) return;
    const stackframes = await fromError(err);
    const frame = stackframes[0].source || stackframes[0].origin;
    const msg = err.message;
    const src = frame.fileName;
    const log = [];
    log.push(`错误文件: ${typeof src == "string" ? decodeURI(src).replace(lib.assetURL, "") : "未知文件"}`);
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
    log.push(getStatusInfo({ lib, get, _status }));
    log.push("-------------");
    const errorReporter = ErrorManager.getErrorReporter(err);
    if (errorReporter) {
      game.print(errorReporter.report(log.join("\n") + "\n代码出现错误"));
    } else {
      if (typeof frame.lineNumber == "number" && (typeof game.readFile == "function" || location.origin != "file://")) {
        const createShowCode = (code, line) => {
          const lines = code.split("\n");
          const showCode = [];
          for (let i = Math.max(0, line - 5); i < line + 6 && i < lines.length; i++) {
            showCode.push(`${i + 1}| ${line == i + 1 ? "⚠️" : ""}${lines[i]}`);
          }
          showCode.push("-------------");
          return showCode;
        };
        if (frame.functionName === "packStep") {
          const codes = _status.event.content.originals[_status.event.step];
          if (typeof codes == "function") {
            const regex = /<anonymous>:(\d+):\d+/;
            const match2 = err.stack?.split("\n")[1].match(regex);
            if (match2) {
              log.push(...createShowCode(codes.toString(), parseInt(match2[1])));
            }
          }
        } else if (typeof src == "string" && src.startsWith(location.protocol) && src.endsWith(".js")) {
          try {
            let relativeUrl = function(from, to) {
              try {
                const fromUrl = new URL(from);
                const toUrl = new URL(to);
                if (fromUrl.origin !== toUrl.origin) {
                  return to;
                }
                const fromParts = fromUrl.pathname.split("/").filter(Boolean);
                const toParts = toUrl.pathname.split("/").filter(Boolean);
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
            };
            const source = stackframes[0].source;
            if (!source?.fileName) throw new Error();
            let rawSourceMap = await lib.init.promises.req(src + ".map");
            if (!rawSourceMap) throw new Error();
            const sourceMap = JSON.parse(rawSourceMap);
            const file = relativeUrl(src, source.fileName);
            const content = sourceMap.sourcesContent[sourceMap.sources.indexOf(file)];
            log.push(...createShowCode(content, frame.lineNumber || 0));
          } catch (e) {
            let code = await lib.init.promises.req(src);
            if (code) log.push(...createShowCode(code, frame.lineNumber || 0));
          }
        }
      }
      if (err && err.stack) {
        log.push(`${err.name}: ${err.message}`);
        log.push(
          ...stackframes.map((frame2) => {
            const f = frame2.source || frame2.origin;
            return `    at ${f.functionName || "(anonymous)"} (${decodeURI(f.fileName || "").replace(new RegExp(lib.assetURL, "g"), "")}:${f.lineNumber}:${f.columnNumber})`;
          })
        );
      }
      alert(log.join("\n"));
      game.print(log.join("\n"));
    }
  };
}
export {
  setOnError
};
