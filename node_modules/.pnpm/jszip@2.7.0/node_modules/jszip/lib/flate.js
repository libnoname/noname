import "../../../../../../_virtual/_commonjsHelpers.js";
import { __exports as flate } from "../../../../../../_virtual/flate.js";
import { __require as requirePako } from "../../../../pako@1.0.11/node_modules/pako/index.js";
var hasRequiredFlate;
function requireFlate() {
  if (hasRequiredFlate) return flate;
  hasRequiredFlate = 1;
  "use strict";
  var USE_TYPEDARRAY = typeof Uint8Array !== "undefined" && typeof Uint16Array !== "undefined" && typeof Uint32Array !== "undefined";
  var pako = requirePako();
  flate.uncompressInputType = USE_TYPEDARRAY ? "uint8array" : "array";
  flate.compressInputType = USE_TYPEDARRAY ? "uint8array" : "array";
  flate.magic = "\b\0";
  flate.compress = function(input, compressionOptions) {
    return pako.deflateRaw(input, {
      level: compressionOptions.level || -1
      // default compression
    });
  };
  flate.uncompress = function(input) {
    return pako.inflateRaw(input);
  };
  return flate;
}
export {
  requireFlate as __require
};
