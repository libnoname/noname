import "../../../../../../_virtual/_commonjsHelpers.js";
import { __require as requireBase64 } from "./base64.js";
import { __require as requireUtf8 } from "./utf8.js";
import { __require as requireUtils } from "./utils.js";
import { __require as requireZipEntries } from "./zipEntries.js";
var load;
var hasRequiredLoad;
function requireLoad() {
  if (hasRequiredLoad) return load;
  hasRequiredLoad = 1;
  "use strict";
  var base64 = requireBase64();
  var utf8 = requireUtf8();
  var utils = requireUtils();
  var ZipEntries = requireZipEntries();
  load = function(data, options) {
    var files, zipEntries, i, input;
    options = utils.extend(options || {}, {
      base64: false,
      checkCRC32: false,
      optimizedBinaryString: false,
      createFolders: false,
      decodeFileName: utf8.utf8decode
    });
    if (options.base64) {
      data = base64.decode(data);
    }
    zipEntries = new ZipEntries(data, options);
    files = zipEntries.files;
    for (i = 0; i < files.length; i++) {
      input = files[i];
      this.file(input.fileNameStr, input.decompressed, {
        binary: true,
        optimizedBinaryString: true,
        date: input.date,
        dir: input.dir,
        comment: input.fileCommentStr.length ? input.fileCommentStr : null,
        unixPermissions: input.unixPermissions,
        dosPermissions: input.dosPermissions,
        createFolders: options.createFolders
      });
    }
    if (zipEntries.zipComment.length) {
      this.comment = zipEntries.zipComment;
    }
    return this;
  };
  return load;
}
export {
  requireLoad as __require
};
