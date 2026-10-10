import "../../../../../../_virtual/_commonjsHelpers.js";
import { __require as requireUtils } from "./utils.js";
var uint8ArrayWriter;
var hasRequiredUint8ArrayWriter;
function requireUint8ArrayWriter() {
  if (hasRequiredUint8ArrayWriter) return uint8ArrayWriter;
  hasRequiredUint8ArrayWriter = 1;
  "use strict";
  var utils = requireUtils();
  var Uint8ArrayWriter = function(length) {
    this.data = new Uint8Array(length);
    this.index = 0;
  };
  Uint8ArrayWriter.prototype = {
    /**
     * Append any content to the current array.
     * @param {Object} input the content to add.
     */
    append: function(input) {
      if (input.length !== 0) {
        input = utils.transformTo("uint8array", input);
        this.data.set(input, this.index);
        this.index += input.length;
      }
    },
    /**
     * Finalize the construction an return the result.
     * @return {Uint8Array} the generated array.
     */
    finalize: function() {
      return this.data;
    }
  };
  uint8ArrayWriter = Uint8ArrayWriter;
  return uint8ArrayWriter;
}
export {
  requireUint8ArrayWriter as __require
};
