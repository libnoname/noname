import "../../../../../../_virtual/_commonjsHelpers.js";
import { __exports as support } from "../../../../../../_virtual/support.js";
var hasRequiredSupport;
function requireSupport() {
  if (hasRequiredSupport) return support;
  hasRequiredSupport = 1;
  "use strict";
  support.base64 = true;
  support.array = true;
  support.string = true;
  support.arraybuffer = typeof ArrayBuffer !== "undefined" && typeof Uint8Array !== "undefined";
  support.nodebuffer = typeof Buffer !== "undefined";
  support.uint8array = typeof Uint8Array !== "undefined";
  if (typeof ArrayBuffer === "undefined") {
    support.blob = false;
  } else {
    var buffer = new ArrayBuffer(0);
    try {
      support.blob = new Blob([buffer], {
        type: "application/zip"
      }).size === 0;
    } catch (e) {
      try {
        var Builder = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder || window.MSBlobBuilder;
        var builder = new Builder();
        builder.append(buffer);
        support.blob = builder.getBlob("application/zip").size === 0;
      } catch (e2) {
        support.blob = false;
      }
    }
  }
  return support;
}
export {
  requireSupport as __require
};
