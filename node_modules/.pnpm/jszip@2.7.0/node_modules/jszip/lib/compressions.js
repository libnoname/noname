import "../../../../../../_virtual/_commonjsHelpers.js";
import { __exports as compressions } from "../../../../../../_virtual/compressions.js";
import { __require as requireFlate } from "./flate.js";
var hasRequiredCompressions;
function requireCompressions() {
  if (hasRequiredCompressions) return compressions;
  hasRequiredCompressions = 1;
  "use strict";
  compressions.STORE = {
    magic: "\0\0",
    compress: function(content, compressionOptions) {
      return content;
    },
    uncompress: function(content) {
      return content;
    },
    compressInputType: null,
    uncompressInputType: null
  };
  compressions.DEFLATE = requireFlate();
  return compressions;
}
export {
  requireCompressions as __require
};
