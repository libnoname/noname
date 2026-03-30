import "../../../../../../_virtual/_commonjsHelpers.js";
import { __require as requireUtils } from "./utils.js";
var stringWriter;
var hasRequiredStringWriter;
function requireStringWriter() {
  if (hasRequiredStringWriter) return stringWriter;
  hasRequiredStringWriter = 1;
  "use strict";
  var utils = requireUtils();
  var StringWriter = function() {
    this.data = [];
  };
  StringWriter.prototype = {
    /**
     * Append any content to the current string.
     * @param {Object} input the content to add.
     */
    append: function(input) {
      input = utils.transformTo("string", input);
      this.data.push(input);
    },
    /**
     * Finalize the construction an return the result.
     * @return {string} the generated string.
     */
    finalize: function() {
      return this.data.join("");
    }
  };
  stringWriter = StringWriter;
  return stringWriter;
}
export {
  requireStringWriter as __require
};
