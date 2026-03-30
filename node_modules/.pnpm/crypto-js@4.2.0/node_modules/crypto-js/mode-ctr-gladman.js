import "../../../../../_virtual/_commonjsHelpers.js";
import { __module as modeCtrGladman$1 } from "../../../../../_virtual/mode-ctr-gladman.js";
import { __require as requireCore } from "./core.js";
import { __require as requireCipherCore } from "./cipher-core.js";
var modeCtrGladman = modeCtrGladman$1.exports;
var hasRequiredModeCtrGladman;
function requireModeCtrGladman() {
  if (hasRequiredModeCtrGladman) return modeCtrGladman$1.exports;
  hasRequiredModeCtrGladman = 1;
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
    })(modeCtrGladman, function(CryptoJS) {
      CryptoJS.mode.CTRGladman = (function() {
        var CTRGladman = CryptoJS.lib.BlockCipherMode.extend();
        function incWord(word) {
          if ((word >> 24 & 255) === 255) {
            var b1 = word >> 16 & 255;
            var b2 = word >> 8 & 255;
            var b3 = word & 255;
            if (b1 === 255) {
              b1 = 0;
              if (b2 === 255) {
                b2 = 0;
                if (b3 === 255) {
                  b3 = 0;
                } else {
                  ++b3;
                }
              } else {
                ++b2;
              }
            } else {
              ++b1;
            }
            word = 0;
            word += b1 << 16;
            word += b2 << 8;
            word += b3;
          } else {
            word += 1 << 24;
          }
          return word;
        }
        function incCounter(counter) {
          if ((counter[0] = incWord(counter[0])) === 0) {
            counter[1] = incWord(counter[1]);
          }
          return counter;
        }
        var Encryptor = CTRGladman.Encryptor = CTRGladman.extend({
          processBlock: function(words, offset) {
            var cipher = this._cipher;
            var blockSize = cipher.blockSize;
            var iv = this._iv;
            var counter = this._counter;
            if (iv) {
              counter = this._counter = iv.slice(0);
              this._iv = void 0;
            }
            incCounter(counter);
            var keystream = counter.slice(0);
            cipher.encryptBlock(keystream, 0);
            for (var i = 0; i < blockSize; i++) {
              words[offset + i] ^= keystream[i];
            }
          }
        });
        CTRGladman.Decryptor = Encryptor;
        return CTRGladman;
      })();
      return CryptoJS.mode.CTRGladman;
    });
  })(modeCtrGladman$1, modeCtrGladman$1.exports);
  return modeCtrGladman$1.exports;
}
export {
  requireModeCtrGladman as __require
};
