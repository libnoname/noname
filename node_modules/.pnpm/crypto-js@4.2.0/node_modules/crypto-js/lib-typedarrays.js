import "../../../../../_virtual/_commonjsHelpers.js";
import { __module as libTypedarrays$1 } from "../../../../../_virtual/lib-typedarrays.js";
import { __require as requireCore } from "./core.js";
var libTypedarrays = libTypedarrays$1.exports;
var hasRequiredLibTypedarrays;
function requireLibTypedarrays() {
  if (hasRequiredLibTypedarrays) return libTypedarrays$1.exports;
  hasRequiredLibTypedarrays = 1;
  (function(module, exports$1) {
    ;
    (function(root, factory) {
      if (true) {
        module.exports = exports$1 = factory(requireCore());
      } else if (false) {
        (void 0)(["./core"], factory);
      } else {
        factory(root.CryptoJS);
      }
    })(libTypedarrays, function(CryptoJS) {
      (function() {
        if (typeof ArrayBuffer != "function") {
          return;
        }
        var C = CryptoJS;
        var C_lib = C.lib;
        var WordArray = C_lib.WordArray;
        var superInit = WordArray.init;
        var subInit = WordArray.init = function(typedArray) {
          if (typedArray instanceof ArrayBuffer) {
            typedArray = new Uint8Array(typedArray);
          }
          if (typedArray instanceof Int8Array || typeof Uint8ClampedArray !== "undefined" && typedArray instanceof Uint8ClampedArray || typedArray instanceof Int16Array || typedArray instanceof Uint16Array || typedArray instanceof Int32Array || typedArray instanceof Uint32Array || typedArray instanceof Float32Array || typedArray instanceof Float64Array) {
            typedArray = new Uint8Array(typedArray.buffer, typedArray.byteOffset, typedArray.byteLength);
          }
          if (typedArray instanceof Uint8Array) {
            var typedArrayByteLength = typedArray.byteLength;
            var words = [];
            for (var i = 0; i < typedArrayByteLength; i++) {
              words[i >>> 2] |= typedArray[i] << 24 - i % 4 * 8;
            }
            superInit.call(this, words, typedArrayByteLength);
          } else {
            superInit.apply(this, arguments);
          }
        };
        subInit.prototype = WordArray;
      })();
      return CryptoJS.lib.WordArray;
    });
  })(libTypedarrays$1, libTypedarrays$1.exports);
  return libTypedarrays$1.exports;
}
export {
  requireLibTypedarrays as __require
};
