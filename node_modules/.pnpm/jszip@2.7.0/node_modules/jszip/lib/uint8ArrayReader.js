import "../../../../../../_virtual/_commonjsHelpers.js";
import { __require as requireArrayReader } from "./arrayReader.js";
var uint8ArrayReader;
var hasRequiredUint8ArrayReader;
function requireUint8ArrayReader() {
  if (hasRequiredUint8ArrayReader) return uint8ArrayReader;
  hasRequiredUint8ArrayReader = 1;
  "use strict";
  var ArrayReader = requireArrayReader();
  function Uint8ArrayReader(data) {
    if (data) {
      this.data = data;
      this.length = this.data.length;
      this.index = 0;
      this.zero = 0;
    }
  }
  Uint8ArrayReader.prototype = new ArrayReader();
  Uint8ArrayReader.prototype.readData = function(size) {
    this.checkOffset(size);
    if (size === 0) {
      return new Uint8Array(0);
    }
    var result = this.data.subarray(this.zero + this.index, this.zero + this.index + size);
    this.index += size;
    return result;
  };
  uint8ArrayReader = Uint8ArrayReader;
  return uint8ArrayReader;
}
export {
  requireUint8ArrayReader as __require
};
