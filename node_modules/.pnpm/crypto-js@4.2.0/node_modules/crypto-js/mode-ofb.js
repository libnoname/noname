import "../../../../../_virtual/_commonjsHelpers.js";
import { __module as modeOfb$1 } from "../../../../../_virtual/mode-ofb.js";
import { __require as requireCore } from "./core.js";
import { __require as requireCipherCore } from "./cipher-core.js";
var modeOfb = modeOfb$1.exports;
var hasRequiredModeOfb;
function requireModeOfb() {
  if (hasRequiredModeOfb) return modeOfb$1.exports;
  hasRequiredModeOfb = 1;
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
    })(modeOfb, function(CryptoJS) {
      CryptoJS.mode.OFB = (function() {
        var OFB = CryptoJS.lib.BlockCipherMode.extend();
        var Encryptor = OFB.Encryptor = OFB.extend({
          processBlock: function(words, offset) {
            var cipher = this._cipher;
            var blockSize = cipher.blockSize;
            var iv = this._iv;
            var keystream = this._keystream;
            if (iv) {
              keystream = this._keystream = iv.slice(0);
              this._iv = void 0;
            }
            cipher.encryptBlock(keystream, 0);
            for (var i = 0; i < blockSize; i++) {
              words[offset + i] ^= keystream[i];
            }
          }
        });
        OFB.Decryptor = Encryptor;
        return OFB;
      })();
      return CryptoJS.mode.OFB;
    });
  })(modeOfb$1, modeOfb$1.exports);
  return modeOfb$1.exports;
}
export {
  requireModeOfb as __require
};
