import "../../../../../../_virtual/_commonjsHelpers.js";
var compressedObject;
var hasRequiredCompressedObject;
function requireCompressedObject() {
  if (hasRequiredCompressedObject) return compressedObject;
  hasRequiredCompressedObject = 1;
  "use strict";
  function CompressedObject() {
    this.compressedSize = 0;
    this.uncompressedSize = 0;
    this.crc32 = 0;
    this.compressionMethod = null;
    this.compressedContent = null;
  }
  CompressedObject.prototype = {
    /**
     * Return the decompressed content in an unspecified format.
     * The format will depend on the decompressor.
     * @return {Object} the decompressed content.
     */
    getContent: function() {
      return null;
    },
    /**
     * Return the compressed content in an unspecified format.
     * The format will depend on the compressed conten source.
     * @return {Object} the compressed content.
     */
    getCompressedContent: function() {
      return null;
    }
  };
  compressedObject = CompressedObject;
  return compressedObject;
}
export {
  requireCompressedObject as __require
};
