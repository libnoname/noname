import "../../../../../../_virtual/_commonjsHelpers.js";
import { __require as requireBase64 } from "./base64.js";
import { __require as requireObject } from "./object.js";
import { __require as requireLoad } from "./load.js";
import { __require as requireSupport } from "./support.js";
import { __require as requireDefaults } from "./defaults.js";
import { __require as requireDeprecatedPublicUtils } from "./deprecatedPublicUtils.js";
import { __require as requireCompressions } from "./compressions.js";
var lib;
var hasRequiredLib;
function requireLib() {
  if (hasRequiredLib) return lib;
  hasRequiredLib = 1;
  "use strict";
  var base64 = requireBase64();
  function JSZip(data, options) {
    if (!(this instanceof JSZip)) return new JSZip(data, options);
    this.files = /* @__PURE__ */ Object.create(null);
    this.comment = null;
    this.root = "";
    if (data) {
      this.load(data, options);
    }
    this.clone = function() {
      var newObj = new JSZip();
      for (var i in this) {
        if (typeof this[i] !== "function") {
          newObj[i] = this[i];
        }
      }
      return newObj;
    };
  }
  JSZip.prototype = requireObject();
  JSZip.prototype.load = requireLoad();
  JSZip.support = requireSupport();
  JSZip.defaults = requireDefaults();
  JSZip.utils = requireDeprecatedPublicUtils();
  JSZip.base64 = {
    /**
     * @deprecated
     * This method will be removed in a future version without replacement.
     */
    encode: function(input) {
      return base64.encode(input);
    },
    /**
     * @deprecated
     * This method will be removed in a future version without replacement.
     */
    decode: function(input) {
      return base64.decode(input);
    }
  };
  JSZip.compressions = requireCompressions();
  lib = JSZip;
  return lib;
}
export {
  requireLib as __require
};
