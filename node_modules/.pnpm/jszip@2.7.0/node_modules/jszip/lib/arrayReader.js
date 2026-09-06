import "../../../../../../_virtual/_commonjsHelpers.js";
import { __require as requireDataReader } from "./dataReader.js";
var arrayReader;
var hasRequiredArrayReader;
function requireArrayReader() {
  if (hasRequiredArrayReader) return arrayReader;
  hasRequiredArrayReader = 1;
  "use strict";
  var DataReader = requireDataReader();
  function ArrayReader(data) {
    if (data) {
      this.data = data;
      this.length = this.data.length;
      this.index = 0;
      this.zero = 0;
      for (var i = 0; i < this.data.length; i++) {
        data[i] = data[i] & 255;
      }
    }
  }
  ArrayReader.prototype = new DataReader();
  ArrayReader.prototype.byteAt = function(i) {
    return this.data[this.zero + i];
  };
  ArrayReader.prototype.lastIndexOfSignature = function(sig) {
    var sig0 = sig.charCodeAt(0), sig1 = sig.charCodeAt(1), sig2 = sig.charCodeAt(2), sig3 = sig.charCodeAt(3);
    for (var i = this.length - 4; i >= 0; --i) {
      if (this.data[i] === sig0 && this.data[i + 1] === sig1 && this.data[i + 2] === sig2 && this.data[i + 3] === sig3) {
        return i - this.zero;
      }
    }
    return -1;
  };
  ArrayReader.prototype.readData = function(size) {
    this.checkOffset(size);
    if (size === 0) {
      return [];
    }
    var result = this.data.slice(this.zero + this.index, this.zero + this.index + size);
    this.index += size;
    return result;
  };
  arrayReader = ArrayReader;
  return arrayReader;
}
export {
  requireArrayReader as __require
};
