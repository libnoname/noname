import "../../../../../../_virtual/_commonjsHelpers.js";
import { __require as requireUint8ArrayReader } from "./uint8ArrayReader.js";
var nodeBufferReader;
var hasRequiredNodeBufferReader;
function requireNodeBufferReader() {
  if (hasRequiredNodeBufferReader) return nodeBufferReader;
  hasRequiredNodeBufferReader = 1;
  "use strict";
  var Uint8ArrayReader = requireUint8ArrayReader();
  function NodeBufferReader(data) {
    this.data = data;
    this.length = this.data.length;
    this.index = 0;
    this.zero = 0;
  }
  NodeBufferReader.prototype = new Uint8ArrayReader();
  NodeBufferReader.prototype.readData = function(size) {
    this.checkOffset(size);
    var result = this.data.slice(this.zero + this.index, this.zero + this.index + size);
    this.index += size;
    return result;
  };
  nodeBufferReader = NodeBufferReader;
  return nodeBufferReader;
}
export {
  requireNodeBufferReader as __require
};
