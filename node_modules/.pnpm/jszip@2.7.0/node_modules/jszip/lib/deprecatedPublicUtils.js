import "../../../../../../_virtual/_commonjsHelpers.js";
import { __exports as deprecatedPublicUtils } from "../../../../../../_virtual/deprecatedPublicUtils.js";
import { __require as requireUtils } from "./utils.js";
var hasRequiredDeprecatedPublicUtils;
function requireDeprecatedPublicUtils() {
  if (hasRequiredDeprecatedPublicUtils) return deprecatedPublicUtils;
  hasRequiredDeprecatedPublicUtils = 1;
  "use strict";
  var utils = requireUtils();
  deprecatedPublicUtils.string2binary = function(str) {
    return utils.string2binary(str);
  };
  deprecatedPublicUtils.string2Uint8Array = function(str) {
    return utils.transformTo("uint8array", str);
  };
  deprecatedPublicUtils.uint8Array2String = function(array) {
    return utils.transformTo("string", array);
  };
  deprecatedPublicUtils.string2Blob = function(str) {
    var buffer = utils.transformTo("arraybuffer", str);
    return utils.arrayBuffer2Blob(buffer);
  };
  deprecatedPublicUtils.arrayBuffer2Blob = function(buffer) {
    return utils.arrayBuffer2Blob(buffer);
  };
  deprecatedPublicUtils.transformTo = function(outputType, input) {
    return utils.transformTo(outputType, input);
  };
  deprecatedPublicUtils.getTypeOf = function(input) {
    return utils.getTypeOf(input);
  };
  deprecatedPublicUtils.checkSupport = function(type) {
    return utils.checkSupport(type);
  };
  deprecatedPublicUtils.MAX_VALUE_16BITS = utils.MAX_VALUE_16BITS;
  deprecatedPublicUtils.MAX_VALUE_32BITS = utils.MAX_VALUE_32BITS;
  deprecatedPublicUtils.pretty = function(str) {
    return utils.pretty(str);
  };
  deprecatedPublicUtils.findCompression = function(compressionMethod) {
    return utils.findCompression(compressionMethod);
  };
  deprecatedPublicUtils.isRegExp = function(object) {
    return utils.isRegExp(object);
  };
  return deprecatedPublicUtils;
}
export {
  requireDeprecatedPublicUtils as __require
};
