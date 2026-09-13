import "../../../../../../_virtual/_commonjsHelpers.js";
import { __require as requireDataReader } from "./dataReader.js";
import { __require as requireUtils } from "./utils.js";
var stringReader;
var hasRequiredStringReader;
function requireStringReader() {
  if (hasRequiredStringReader) return stringReader;
  hasRequiredStringReader = 1;
  "use strict";
  var DataReader = requireDataReader();
  var utils = requireUtils();
  function StringReader(data, optimizedBinaryString) {
    this.data = data;
    if (!optimizedBinaryString) {
      this.data = utils.string2binary(this.data);
    }
    this.length = this.data.length;
    this.index = 0;
    this.zero = 0;
  }
  StringReader.prototype = new DataReader();
  StringReader.prototype.byteAt = function(i) {
    return this.data.charCodeAt(this.zero + i);
  };
  StringReader.prototype.lastIndexOfSignature = function(sig) {
    return this.data.lastIndexOf(sig) - this.zero;
  };
  StringReader.prototype.readData = function(size) {
    this.checkOffset(size);
    var result = this.data.slice(this.zero + this.index, this.zero + this.index + size);
    this.index += size;
    return result;
  };
  stringReader = StringReader;
  return stringReader;
}
export {
  requireStringReader as __require
};
