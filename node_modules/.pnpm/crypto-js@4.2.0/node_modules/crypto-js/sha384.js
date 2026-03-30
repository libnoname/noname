import "../../../../../_virtual/_commonjsHelpers.js";
import { __module as sha384$1 } from "../../../../../_virtual/sha384.js";
import { __require as requireCore } from "./core.js";
import { __require as requireX64Core } from "./x64-core.js";
import { __require as requireSha512 } from "./sha512.js";
var sha384 = sha384$1.exports;
var hasRequiredSha384;
function requireSha384() {
  if (hasRequiredSha384) return sha384$1.exports;
  hasRequiredSha384 = 1;
  (function(module, exports$1) {
    ;
    (function(root, factory, undef) {
      if (true) {
        module.exports = exports$1 = factory(requireCore(), requireX64Core(), requireSha512());
      } else if (false) {
        (void 0)(["./core", "./x64-core", "./sha512"], factory);
      } else {
        factory(root.CryptoJS);
      }
    })(sha384, function(CryptoJS) {
      (function() {
        var C = CryptoJS;
        var C_x64 = C.x64;
        var X64Word = C_x64.Word;
        var X64WordArray = C_x64.WordArray;
        var C_algo = C.algo;
        var SHA512 = C_algo.SHA512;
        var SHA384 = C_algo.SHA384 = SHA512.extend({
          _doReset: function() {
            this._hash = new X64WordArray.init([
              new X64Word.init(3418070365, 3238371032),
              new X64Word.init(1654270250, 914150663),
              new X64Word.init(2438529370, 812702999),
              new X64Word.init(355462360, 4144912697),
              new X64Word.init(1731405415, 4290775857),
              new X64Word.init(2394180231, 1750603025),
              new X64Word.init(3675008525, 1694076839),
              new X64Word.init(1203062813, 3204075428)
            ]);
          },
          _doFinalize: function() {
            var hash = SHA512._doFinalize.call(this);
            hash.sigBytes -= 16;
            return hash;
          }
        });
        C.SHA384 = SHA512._createHelper(SHA384);
        C.HmacSHA384 = SHA512._createHmacHelper(SHA384);
      })();
      return CryptoJS.SHA384;
    });
  })(sha384$1, sha384$1.exports);
  return sha384$1.exports;
}
export {
  requireSha384 as __require
};
