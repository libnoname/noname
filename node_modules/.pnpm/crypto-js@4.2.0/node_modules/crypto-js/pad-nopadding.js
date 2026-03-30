import "../../../../../_virtual/_commonjsHelpers.js";
import { __module as padNopadding$1 } from "../../../../../_virtual/pad-nopadding.js";
import { __require as requireCore } from "./core.js";
import { __require as requireCipherCore } from "./cipher-core.js";
var padNopadding = padNopadding$1.exports;
var hasRequiredPadNopadding;
function requirePadNopadding() {
  if (hasRequiredPadNopadding) return padNopadding$1.exports;
  hasRequiredPadNopadding = 1;
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
    })(padNopadding, function(CryptoJS) {
      CryptoJS.pad.NoPadding = {
        pad: function() {
        },
        unpad: function() {
        }
      };
      return CryptoJS.pad.NoPadding;
    });
  })(padNopadding$1, padNopadding$1.exports);
  return padNopadding$1.exports;
}
export {
  requirePadNopadding as __require
};
