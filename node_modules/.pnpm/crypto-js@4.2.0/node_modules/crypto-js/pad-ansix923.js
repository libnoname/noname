import "../../../../../_virtual/_commonjsHelpers.js";
import { __module as padAnsix923$1 } from "../../../../../_virtual/pad-ansix923.js";
import { __require as requireCore } from "./core.js";
import { __require as requireCipherCore } from "./cipher-core.js";
var padAnsix923 = padAnsix923$1.exports;
var hasRequiredPadAnsix923;
function requirePadAnsix923() {
  if (hasRequiredPadAnsix923) return padAnsix923$1.exports;
  hasRequiredPadAnsix923 = 1;
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
    })(padAnsix923, function(CryptoJS) {
      CryptoJS.pad.AnsiX923 = {
        pad: function(data, blockSize) {
          var dataSigBytes = data.sigBytes;
          var blockSizeBytes = blockSize * 4;
          var nPaddingBytes = blockSizeBytes - dataSigBytes % blockSizeBytes;
          var lastBytePos = dataSigBytes + nPaddingBytes - 1;
          data.clamp();
          data.words[lastBytePos >>> 2] |= nPaddingBytes << 24 - lastBytePos % 4 * 8;
          data.sigBytes += nPaddingBytes;
        },
        unpad: function(data) {
          var nPaddingBytes = data.words[data.sigBytes - 1 >>> 2] & 255;
          data.sigBytes -= nPaddingBytes;
        }
      };
      return CryptoJS.pad.Ansix923;
    });
  })(padAnsix923$1, padAnsix923$1.exports);
  return padAnsix923$1.exports;
}
export {
  requirePadAnsix923 as __require
};
