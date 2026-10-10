import "../../../../../_virtual/_commonjsHelpers.js";
import { __module as sha224$1 } from "../../../../../_virtual/sha224.js";
import { __require as requireCore } from "./core.js";
import { __require as requireSha256 } from "./sha256.js";
var sha224 = sha224$1.exports;
var hasRequiredSha224;
function requireSha224() {
  if (hasRequiredSha224) return sha224$1.exports;
  hasRequiredSha224 = 1;
  (function(module, exports$1) {
    ;
    (function(root, factory, undef) {
      if (true) {
        module.exports = exports$1 = factory(requireCore(), requireSha256());
      } else if (false) {
        (void 0)(["./core", "./sha256"], factory);
      } else {
        factory(root.CryptoJS);
      }
    })(sha224, function(CryptoJS) {
      (function() {
        var C = CryptoJS;
        var C_lib = C.lib;
        var WordArray = C_lib.WordArray;
        var C_algo = C.algo;
        var SHA256 = C_algo.SHA256;
        var SHA224 = C_algo.SHA224 = SHA256.extend({
          _doReset: function() {
            this._hash = new WordArray.init([
              3238371032,
              914150663,
              812702999,
              4144912697,
              4290775857,
              1750603025,
              1694076839,
              3204075428
            ]);
          },
          _doFinalize: function() {
            var hash = SHA256._doFinalize.call(this);
            hash.sigBytes -= 4;
            return hash;
          }
        });
        C.SHA224 = SHA256._createHelper(SHA224);
        C.HmacSHA224 = SHA256._createHmacHelper(SHA224);
      })();
      return CryptoJS.SHA224;
    });
  })(sha224$1, sha224$1.exports);
  return sha224$1.exports;
}
export {
  requireSha224 as __require
};
