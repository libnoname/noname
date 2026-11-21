import "../../../../../_virtual/_commonjsHelpers.js";
import { __module as errorStackParser$1 } from "../../../../../_virtual/error-stack-parser2.js";
import { __require as requireStackframe } from "../../../stackframe@1.3.4/node_modules/stackframe/stackframe.js";
var errorStackParser = errorStackParser$1.exports;
var hasRequiredErrorStackParser;
function requireErrorStackParser() {
  if (hasRequiredErrorStackParser) return errorStackParser$1.exports;
  hasRequiredErrorStackParser = 1;
  (function(module, exports$1) {
    (function(root, factory) {
      "use strict";
      if (false) {
        (void 0)("error-stack-parser", ["stackframe"], factory);
      } else if (true) {
        module.exports = factory(requireStackframe());
      } else {
        root.ErrorStackParser = factory(root.StackFrame);
      }
    })(errorStackParser, function ErrorStackParser(StackFrame) {
      "use strict";
      var FIREFOX_SAFARI_STACK_REGEXP = /(^|@)\S+:\d+/;
      var CHROME_IE_STACK_REGEXP = /^\s*at .*(\S+:\d+|\(native\))/m;
      var SAFARI_NATIVE_CODE_REGEXP = /^(eval@)?(\[native code])?$/;
      return {
        /**
         * Given an Error object, extract the most information from it.
         *
         * @param {Error} error object
         * @return {Array} of StackFrames
         */
        parse: function ErrorStackParser$$parse(error) {
          if (typeof error.stacktrace !== "undefined" || typeof error["opera#sourceloc"] !== "undefined") {
            return this.parseOpera(error);
          } else if (error.stack && error.stack.match(CHROME_IE_STACK_REGEXP)) {
            return this.parseV8OrIE(error);
          } else if (error.stack) {
            return this.parseFFOrSafari(error);
          } else {
            throw new Error("Cannot parse given Error object");
          }
        },
        // Separate line and column numbers from a string of the form: (URI:Line:Column)
        extractLocation: function ErrorStackParser$$extractLocation(urlLike) {
          if (urlLike.indexOf(":") === -1) {
            return [urlLike];
          }
          var regExp = /(.+?)(?::(\d+))?(?::(\d+))?$/;
          var parts = regExp.exec(urlLike.replace(/[()]/g, ""));
          return [parts[1], parts[2] || void 0, parts[3] || void 0];
        },
        parseV8OrIE: function ErrorStackParser$$parseV8OrIE(error) {
          var filtered = error.stack.split("\n").filter(function(line) {
            return !!line.match(CHROME_IE_STACK_REGEXP);
          }, this);
          return filtered.map(function(line) {
            if (line.indexOf("(eval ") > -1) {
              line = line.replace(/eval code/g, "eval").replace(/(\(eval at [^()]*)|(,.*$)/g, "");
            }
            var sanitizedLine = line.replace(/^\s+/, "").replace(/\(eval code/g, "(").replace(/^.*?\s+/, "");
            var location = sanitizedLine.match(/ (\(.+\)$)/);
            sanitizedLine = location ? sanitizedLine.replace(location[0], "") : sanitizedLine;
            var locationParts = this.extractLocation(location ? location[1] : sanitizedLine);
            var functionName = location && sanitizedLine || void 0;
            var fileName = ["eval", "<anonymous>"].indexOf(locationParts[0]) > -1 ? void 0 : locationParts[0];
            return new StackFrame({
              functionName,
              fileName,
              lineNumber: locationParts[1],
              columnNumber: locationParts[2],
              source: line
            });
          }, this);
        },
        parseFFOrSafari: function ErrorStackParser$$parseFFOrSafari(error) {
          var filtered = error.stack.split("\n").filter(function(line) {
            return !line.match(SAFARI_NATIVE_CODE_REGEXP);
          }, this);
          return filtered.map(function(line) {
            if (line.indexOf(" > eval") > -1) {
              line = line.replace(/ line (\d+)(?: > eval line \d+)* > eval:\d+:\d+/g, ":$1");
            }
            if (line.indexOf("@") === -1 && line.indexOf(":") === -1) {
              return new StackFrame({
                functionName: line
              });
            } else {
              var functionNameRegex = /((.*".+"[^@]*)?[^@]*)(?:@)/;
              var matches = line.match(functionNameRegex);
              var functionName = matches && matches[1] ? matches[1] : void 0;
              var locationParts = this.extractLocation(line.replace(functionNameRegex, ""));
              return new StackFrame({
                functionName,
                fileName: locationParts[0],
                lineNumber: locationParts[1],
                columnNumber: locationParts[2],
                source: line
              });
            }
          }, this);
        },
        parseOpera: function ErrorStackParser$$parseOpera(e) {
          if (!e.stacktrace || e.message.indexOf("\n") > -1 && e.message.split("\n").length > e.stacktrace.split("\n").length) {
            return this.parseOpera9(e);
          } else if (!e.stack) {
            return this.parseOpera10(e);
          } else {
            return this.parseOpera11(e);
          }
        },
        parseOpera9: function ErrorStackParser$$parseOpera9(e) {
          var lineRE = /Line (\d+).*script (?:in )?(\S+)/i;
          var lines = e.message.split("\n");
          var result = [];
          for (var i = 2, len = lines.length; i < len; i += 2) {
            var match = lineRE.exec(lines[i]);
            if (match) {
              result.push(new StackFrame({
                fileName: match[2],
                lineNumber: match[1],
                source: lines[i]
              }));
            }
          }
          return result;
        },
        parseOpera10: function ErrorStackParser$$parseOpera10(e) {
          var lineRE = /Line (\d+).*script (?:in )?(\S+)(?:: In function (\S+))?$/i;
          var lines = e.stacktrace.split("\n");
          var result = [];
          for (var i = 0, len = lines.length; i < len; i += 2) {
            var match = lineRE.exec(lines[i]);
            if (match) {
              result.push(
                new StackFrame({
                  functionName: match[3] || void 0,
                  fileName: match[2],
                  lineNumber: match[1],
                  source: lines[i]
                })
              );
            }
          }
          return result;
        },
        // Opera 10.65+ Error.stack very similar to FF/Safari
        parseOpera11: function ErrorStackParser$$parseOpera11(error) {
          var filtered = error.stack.split("\n").filter(function(line) {
            return !!line.match(FIREFOX_SAFARI_STACK_REGEXP) && !line.match(/^Error created at/);
          }, this);
          return filtered.map(function(line) {
            var tokens = line.split("@");
            var locationParts = this.extractLocation(tokens.pop());
            var functionCall = tokens.shift() || "";
            var functionName = functionCall.replace(/<anonymous function(: (\w+))?>/, "$2").replace(/\([^)]*\)/g, "") || void 0;
            var argsRaw;
            if (functionCall.match(/\(([^)]*)\)/)) {
              argsRaw = functionCall.replace(/^[^(]+\(([^)]*)\)$/, "$1");
            }
            var args = argsRaw === void 0 || argsRaw === "[arguments not available]" ? void 0 : argsRaw.split(",");
            return new StackFrame({
              functionName,
              args,
              fileName: locationParts[0],
              lineNumber: locationParts[1],
              columnNumber: locationParts[2],
              source: line
            });
          }, this);
        }
      };
    });
  })(errorStackParser$1, errorStackParser$1.exports);
  return errorStackParser$1.exports;
}
export {
  requireErrorStackParser as __require
};
