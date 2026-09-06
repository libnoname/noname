import "../../../../../../_virtual/_commonjsHelpers.js";
import { __module as nodeBuffer$1 } from "../../../../../../_virtual/nodeBuffer.js";
var nodeBuffer = nodeBuffer$1.exports;
var hasRequiredNodeBuffer;
function requireNodeBuffer() {
  if (hasRequiredNodeBuffer) return nodeBuffer$1.exports;
  hasRequiredNodeBuffer = 1;
  "use strict";
  nodeBuffer$1.exports = function(data, encoding) {
    return new Buffer(data, encoding);
  };
  nodeBuffer$1.exports.test = function(b) {
    return Buffer.isBuffer(b);
  };
  return nodeBuffer$1.exports;
}
export {
  requireNodeBuffer as __require
};
