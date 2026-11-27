import "../../../../../_virtual/_commonjsHelpers.js";
import { __module as modeEcb$1 } from "../../../../../_virtual/mode-ecb.js";
import { __require as requireCore } from "./core.js";
import { __require as requireCipherCore } from "./cipher-core.js";
var modeEcb = modeEcb$1.exports;
var hasRequiredModeEcb;
function requireModeEcb() {
  if (hasRequiredModeEcb) return modeEcb$1.exports;
  hasRequiredModeEcb = 1;
  (function(module, exports$1) {
    ;
    (function(root, factory, undef) {
      if (true) {
        module.exports = exports$1 = factory(requireCore(), requireCipherCore());
      } else if (false) {
        (void 0)(["./core", "./cipher-core"], factory);
      } else {
        factory(root.CryptoJS);
      }
    })(modeEcb, function(CryptoJS) {
      CryptoJS.mode.ECB = (function() {
        var ECB = CryptoJS.lib.BlockCipherMode.extend();
        ECB.Encryptor = ECB.extend({
          processBlock: function(words, offset) {
            this._cipher.encryptBlock(words, offset);
          }
        });
        ECB.Decryptor = ECB.extend({
          processBlock: function(words, offset) {
            this._cipher.decryptBlock(words, offset);
          }
        });
        return ECB;
      })();
      return CryptoJS.mode.ECB;
    });
  })(modeEcb$1, modeEcb$1.exports);
  return modeEcb$1.exports;
}
export {
  requireModeEcb as __require
};
