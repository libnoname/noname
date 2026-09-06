import "../../../../../../_virtual/_commonjsHelpers.js";
import { __exports as signature } from "../../../../../../_virtual/signature.js";
var hasRequiredSignature;
function requireSignature() {
  if (hasRequiredSignature) return signature;
  hasRequiredSignature = 1;
  "use strict";
  signature.LOCAL_FILE_HEADER = "PK";
  signature.CENTRAL_FILE_HEADER = "PK";
  signature.CENTRAL_DIRECTORY_END = "PK";
  signature.ZIP64_CENTRAL_DIRECTORY_LOCATOR = "PK\x07";
  signature.ZIP64_CENTRAL_DIRECTORY_END = "PK";
  signature.DATA_DESCRIPTOR = "PK\x07\b";
  return signature;
}
export {
  requireSignature as __require
};
