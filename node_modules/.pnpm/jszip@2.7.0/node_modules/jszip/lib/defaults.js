import "../../../../../../_virtual/_commonjsHelpers.js";
import { __exports as defaults } from "../../../../../../_virtual/defaults.js";
var hasRequiredDefaults;
function requireDefaults() {
  if (hasRequiredDefaults) return defaults;
  hasRequiredDefaults = 1;
  "use strict";
  defaults.base64 = false;
  defaults.binary = false;
  defaults.dir = false;
  defaults.createFolders = false;
  defaults.date = null;
  defaults.compression = null;
  defaults.compressionOptions = null;
  defaults.comment = null;
  defaults.unixPermissions = null;
  defaults.dosPermissions = null;
  return defaults;
}
export {
  requireDefaults as __require
};
