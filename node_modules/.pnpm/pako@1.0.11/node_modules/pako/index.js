import "../../../../../_virtual/_commonjsHelpers.js";
import { __require as requireCommon } from "./lib/utils/common.js";
import { __require as requireDeflate } from "./lib/deflate.js";
import { __require as requireInflate } from "./lib/inflate.js";
import { __require as requireConstants } from "./lib/zlib/constants.js";
var pako_1;
var hasRequiredPako;
function requirePako() {
  if (hasRequiredPako) return pako_1;
  hasRequiredPako = 1;
  "use strict";
  var assign = requireCommon().assign;
  var deflate = requireDeflate();
  var inflate = requireInflate();
  var constants = requireConstants();
  var pako = {};
  assign(pako, deflate, inflate, constants);
  pako_1 = pako;
  return pako_1;
}
export {
  requirePako as __require
};
