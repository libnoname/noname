import "../../../../../../_virtual/_commonjsHelpers.js";
import { __require as requireSupport } from "./support.js";
import { __require as requireUtils } from "./utils.js";
import { __require as requireCrc32 } from "./crc32.js";
import { __require as requireSignature } from "./signature.js";
import { __require as requireDefaults } from "./defaults.js";
import { __require as requireBase64 } from "./base64.js";
import { __require as requireCompressions } from "./compressions.js";
import { __require as requireCompressedObject } from "./compressedObject.js";
import { __require as requireNodeBuffer } from "./nodeBuffer.js";
import { __require as requireUtf8 } from "./utf8.js";
import { __require as requireStringWriter } from "./stringWriter.js";
import { __require as requireUint8ArrayWriter } from "./uint8ArrayWriter.js";
var object;
var hasRequiredObject;
function requireObject() {
  if (hasRequiredObject) return object;
  hasRequiredObject = 1;
  "use strict";
  var support = requireSupport();
  var utils = requireUtils();
  var crc32 = requireCrc32();
  var signature = requireSignature();
  var defaults = requireDefaults();
  var base64 = requireBase64();
  var compressions = requireCompressions();
  var CompressedObject = requireCompressedObject();
  var nodeBuffer = requireNodeBuffer();
  var utf8 = requireUtf8();
  var StringWriter = requireStringWriter();
  var Uint8ArrayWriter = requireUint8ArrayWriter();
  var getRawData = function(file) {
    if (file._data instanceof CompressedObject) {
      file._data = file._data.getContent();
      file.options.binary = true;
      file.options.base64 = false;
      if (utils.getTypeOf(file._data) === "uint8array") {
        var copy = file._data;
        file._data = new Uint8Array(copy.length);
        if (copy.length !== 0) {
          file._data.set(copy, 0);
        }
      }
    }
    return file._data;
  };
  var getBinaryData = function(file) {
    var result = getRawData(file), type = utils.getTypeOf(result);
    if (type === "string") {
      if (!file.options.binary) {
        if (support.nodebuffer) {
          return nodeBuffer(result, "utf-8");
        }
      }
      return file.asBinary();
    }
    return result;
  };
  var dataToString = function(asUTF8) {
    var result = getRawData(this);
    if (result === null || typeof result === "undefined") {
      return "";
    }
    if (this.options.base64) {
      result = base64.decode(result);
    }
    if (asUTF8 && this.options.binary) {
      result = out.utf8decode(result);
    } else {
      result = utils.transformTo("string", result);
    }
    if (!asUTF8 && !this.options.binary) {
      result = utils.transformTo("string", out.utf8encode(result));
    }
    return result;
  };
  var ZipObject = function(name, data, options) {
    this.name = name;
    this.dir = options.dir;
    this.date = options.date;
    this.comment = options.comment;
    this.unixPermissions = options.unixPermissions;
    this.dosPermissions = options.dosPermissions;
    this._data = data;
    this.options = options;
    this._initialMetadata = {
      dir: options.dir,
      date: options.date
    };
  };
  ZipObject.prototype = {
    /**
     * Return the content as UTF8 string.
     * @return {string} the UTF8 string.
     */
    asText: function() {
      return dataToString.call(this, true);
    },
    /**
     * Returns the binary content.
     * @return {string} the content as binary.
     */
    asBinary: function() {
      return dataToString.call(this, false);
    },
    /**
     * Returns the content as a nodejs Buffer.
     * @return {Buffer} the content as a Buffer.
     */
    asNodeBuffer: function() {
      var result = getBinaryData(this);
      return utils.transformTo("nodebuffer", result);
    },
    /**
     * Returns the content as an Uint8Array.
     * @return {Uint8Array} the content as an Uint8Array.
     */
    asUint8Array: function() {
      var result = getBinaryData(this);
      return utils.transformTo("uint8array", result);
    },
    /**
     * Returns the content as an ArrayBuffer.
     * @return {ArrayBuffer} the content as an ArrayBufer.
     */
    asArrayBuffer: function() {
      return this.asUint8Array().buffer;
    }
  };
  var decToHex = function(dec, bytes) {
    var hex = "", i;
    for (i = 0; i < bytes; i++) {
      hex += String.fromCharCode(dec & 255);
      dec = dec >>> 8;
    }
    return hex;
  };
  var prepareFileAttrs = function(o) {
    o = o || {};
    if (o.base64 === true && (o.binary === null || o.binary === void 0)) {
      o.binary = true;
    }
    o = utils.extend(o, defaults);
    o.date = o.date || /* @__PURE__ */ new Date();
    if (o.compression !== null) o.compression = o.compression.toUpperCase();
    return o;
  };
  var fileAdd = function(name, data, o) {
    var dataType = utils.getTypeOf(data), parent;
    o = prepareFileAttrs(o);
    if (typeof o.unixPermissions === "string") {
      o.unixPermissions = parseInt(o.unixPermissions, 8);
    }
    if (o.unixPermissions && o.unixPermissions & 16384) {
      o.dir = true;
    }
    if (o.dosPermissions && o.dosPermissions & 16) {
      o.dir = true;
    }
    if (o.dir) {
      name = forceTrailingSlash(name);
    }
    if (o.createFolders && (parent = parentFolder(name))) {
      folderAdd.call(this, parent, true);
    }
    if (o.dir || data === null || typeof data === "undefined") {
      o.base64 = false;
      o.binary = false;
      data = null;
      dataType = null;
    } else if (dataType === "string") {
      if (o.binary && !o.base64) {
        if (o.optimizedBinaryString !== true) {
          data = utils.string2binary(data);
        }
      }
    } else {
      o.base64 = false;
      o.binary = true;
      if (!dataType && !(data instanceof CompressedObject)) {
        throw new Error("The data of '" + name + "' is in an unsupported format !");
      }
      if (dataType === "arraybuffer") {
        data = utils.transformTo("uint8array", data);
      }
    }
    var object2 = new ZipObject(name, data, o);
    this.files[name] = object2;
    return object2;
  };
  var parentFolder = function(path) {
    if (path.slice(-1) == "/") {
      path = path.substring(0, path.length - 1);
    }
    var lastSlash = path.lastIndexOf("/");
    return lastSlash > 0 ? path.substring(0, lastSlash) : "";
  };
  var forceTrailingSlash = function(path) {
    if (path.slice(-1) != "/") {
      path += "/";
    }
    return path;
  };
  var folderAdd = function(name, createFolders) {
    createFolders = typeof createFolders !== "undefined" ? createFolders : false;
    name = forceTrailingSlash(name);
    if (!this.files[name]) {
      fileAdd.call(this, name, null, {
        dir: true,
        createFolders
      });
    }
    return this.files[name];
  };
  var generateCompressedObjectFrom = function(file, compression, compressionOptions) {
    var result = new CompressedObject(), content;
    if (file._data instanceof CompressedObject) {
      result.uncompressedSize = file._data.uncompressedSize;
      result.crc32 = file._data.crc32;
      if (result.uncompressedSize === 0 || file.dir) {
        compression = compressions["STORE"];
        result.compressedContent = "";
        result.crc32 = 0;
      } else if (file._data.compressionMethod === compression.magic) {
        result.compressedContent = file._data.getCompressedContent();
      } else {
        content = file._data.getContent();
        result.compressedContent = compression.compress(utils.transformTo(compression.compressInputType, content), compressionOptions);
      }
    } else {
      content = getBinaryData(file);
      if (!content || content.length === 0 || file.dir) {
        compression = compressions["STORE"];
        content = "";
      }
      result.uncompressedSize = content.length;
      result.crc32 = crc32(content);
      result.compressedContent = compression.compress(utils.transformTo(compression.compressInputType, content), compressionOptions);
    }
    result.compressedSize = result.compressedContent.length;
    result.compressionMethod = compression.magic;
    return result;
  };
  var generateUnixExternalFileAttr = function(unixPermissions, isDir) {
    var result = unixPermissions;
    if (!unixPermissions) {
      result = isDir ? 16893 : 33204;
    }
    return (result & 65535) << 16;
  };
  var generateDosExternalFileAttr = function(dosPermissions, isDir) {
    return (dosPermissions || 0) & 63;
  };
  var generateZipParts = function(name, file, compressedObject, offset, platform, encodeFileName) {
    var data = compressedObject.compressedContent, useCustomEncoding = encodeFileName !== utf8.utf8encode, encodedFileName = utils.transformTo("string", encodeFileName(file.name)), utfEncodedFileName = utils.transformTo("string", utf8.utf8encode(file.name)), comment = file.comment || "", encodedComment = utils.transformTo("string", encodeFileName(comment)), utfEncodedComment = utils.transformTo("string", utf8.utf8encode(comment)), useUTF8ForFileName = utfEncodedFileName.length !== file.name.length, useUTF8ForComment = utfEncodedComment.length !== comment.length, o = file.options, dosTime, dosDate, extraFields = "", unicodePathExtraField = "", unicodeCommentExtraField = "", dir, date;
    if (file._initialMetadata.dir !== file.dir) {
      dir = file.dir;
    } else {
      dir = o.dir;
    }
    if (file._initialMetadata.date !== file.date) {
      date = file.date;
    } else {
      date = o.date;
    }
    var extFileAttr = 0;
    var versionMadeBy = 0;
    if (dir) {
      extFileAttr |= 16;
    }
    if (platform === "UNIX") {
      versionMadeBy = 798;
      extFileAttr |= generateUnixExternalFileAttr(file.unixPermissions, dir);
    } else {
      versionMadeBy = 20;
      extFileAttr |= generateDosExternalFileAttr(file.dosPermissions, dir);
    }
    dosTime = date.getHours();
    dosTime = dosTime << 6;
    dosTime = dosTime | date.getMinutes();
    dosTime = dosTime << 5;
    dosTime = dosTime | date.getSeconds() / 2;
    dosDate = date.getFullYear() - 1980;
    dosDate = dosDate << 4;
    dosDate = dosDate | date.getMonth() + 1;
    dosDate = dosDate << 5;
    dosDate = dosDate | date.getDate();
    if (useUTF8ForFileName) {
      unicodePathExtraField = // Version
      decToHex(1, 1) + // NameCRC32
      decToHex(crc32(encodedFileName), 4) + // UnicodeName
      utfEncodedFileName;
      extraFields += // Info-ZIP Unicode Path Extra Field
      "up" + // size
      decToHex(unicodePathExtraField.length, 2) + // content
      unicodePathExtraField;
    }
    if (useUTF8ForComment) {
      unicodeCommentExtraField = // Version
      decToHex(1, 1) + // CommentCRC32
      decToHex(this.crc32(encodedComment), 4) + // UnicodeName
      utfEncodedComment;
      extraFields += // Info-ZIP Unicode Path Extra Field
      "uc" + // size
      decToHex(unicodeCommentExtraField.length, 2) + // content
      unicodeCommentExtraField;
    }
    var header = "";
    header += "\n\0";
    header += !useCustomEncoding && (useUTF8ForFileName || useUTF8ForComment) ? "\0\b" : "\0\0";
    header += compressedObject.compressionMethod;
    header += decToHex(dosTime, 2);
    header += decToHex(dosDate, 2);
    header += decToHex(compressedObject.crc32, 4);
    header += decToHex(compressedObject.compressedSize, 4);
    header += decToHex(compressedObject.uncompressedSize, 4);
    header += decToHex(encodedFileName.length, 2);
    header += decToHex(extraFields.length, 2);
    var fileRecord = signature.LOCAL_FILE_HEADER + header + encodedFileName + extraFields;
    var dirRecord = signature.CENTRAL_FILE_HEADER + // version made by (00: DOS)
    decToHex(versionMadeBy, 2) + // file header (common to file and central directory)
    header + // file comment length
    decToHex(encodedComment.length, 2) + // disk number start
    "\0\0\0\0" + // external file attributes
    decToHex(extFileAttr, 4) + // relative offset of local header
    decToHex(offset, 4) + // file name
    encodedFileName + // extra field
    extraFields + // file comment
    encodedComment;
    return {
      fileRecord,
      dirRecord,
      compressedObject
    };
  };
  var out = {
    /**
     * Read an existing zip and merge the data in the current JSZip object.
     * The implementation is in jszip-load.js, don't forget to include it.
     * @param {String|ArrayBuffer|Uint8Array|Buffer} stream  The stream to load
     * @param {Object} options Options for loading the stream.
     *  options.base64 : is the stream in base64 ? default : false
     * @return {JSZip} the current JSZip object
     */
    load: function(stream, options) {
      throw new Error("Load method is not defined. Is the file jszip-load.js included ?");
    },
    /**
     * Filter nested files/folders with the specified function.
     * @param {Function} search the predicate to use :
     * function (relativePath, file) {...}
     * It takes 2 arguments : the relative path and the file.
     * @return {Array} An array of matching elements.
     */
    filter: function(search) {
      var result = [], filename, relativePath, file, fileClone;
      for (filename in this.files) {
        file = this.files[filename];
        fileClone = new ZipObject(file.name, file._data, utils.extend(file.options));
        relativePath = filename.slice(this.root.length, filename.length);
        if (filename.slice(0, this.root.length) === this.root && // the file is in the current root
        search(relativePath, fileClone)) {
          result.push(fileClone);
        }
      }
      return result;
    },
    /**
     * Add a file to the zip file, or search a file.
     * @param   {string|RegExp} name The name of the file to add (if data is defined),
     * the name of the file to find (if no data) or a regex to match files.
     * @param   {String|ArrayBuffer|Uint8Array|Buffer} data  The file data, either raw or base64 encoded
     * @param   {Object} o     File options
     * @return  {JSZip|Object|Array} this JSZip object (when adding a file),
     * a file (when searching by string) or an array of files (when searching by regex).
     */
    file: function(name, data, o) {
      if (arguments.length === 1) {
        if (utils.isRegExp(name)) {
          var regexp = name;
          return this.filter(function(relativePath, file) {
            return !file.dir && regexp.test(relativePath);
          });
        } else {
          return this.filter(function(relativePath, file) {
            return !file.dir && relativePath === name;
          })[0] || null;
        }
      } else {
        name = this.root + name;
        fileAdd.call(this, name, data, o);
      }
      return this;
    },
    /**
     * Add a directory to the zip file, or search.
     * @param   {String|RegExp} arg The name of the directory to add, or a regex to search folders.
     * @return  {JSZip} an object with the new directory as the root, or an array containing matching folders.
     */
    folder: function(arg) {
      if (!arg) {
        return this;
      }
      if (utils.isRegExp(arg)) {
        return this.filter(function(relativePath, file) {
          return file.dir && arg.test(relativePath);
        });
      }
      var name = this.root + arg;
      var newFolder = folderAdd.call(this, name);
      var ret = this.clone();
      ret.root = newFolder.name;
      return ret;
    },
    /**
     * Delete a file, or a directory and all sub-files, from the zip
     * @param {string} name the name of the file to delete
     * @return {JSZip} this JSZip object
     */
    remove: function(name) {
      name = this.root + name;
      var file = this.files[name];
      if (!file) {
        if (name.slice(-1) != "/") {
          name += "/";
        }
        file = this.files[name];
      }
      if (file && !file.dir) {
        delete this.files[name];
      } else {
        var kids = this.filter(function(relativePath, file2) {
          return file2.name.slice(0, name.length) === name;
        });
        for (var i = 0; i < kids.length; i++) {
          delete this.files[kids[i].name];
        }
      }
      return this;
    },
    /**
     * Generate the complete zip file
     * @param {Object} options the options to generate the zip file :
     * - base64, (deprecated, use type instead) true to generate base64.
     * - compression, "STORE" by default.
     * - type, "base64" by default. Values are : string, base64, uint8array, arraybuffer, blob.
     * @return {String|Uint8Array|ArrayBuffer|Buffer|Blob} the zip file
     */
    generate: function(options) {
      options = utils.extend(options || {}, {
        base64: true,
        compression: "STORE",
        compressionOptions: null,
        type: "base64",
        platform: "DOS",
        comment: null,
        mimeType: "application/zip",
        encodeFileName: utf8.utf8encode
      });
      utils.checkSupport(options.type);
      if (options.platform === "darwin" || options.platform === "freebsd" || options.platform === "linux" || options.platform === "sunos") {
        options.platform = "UNIX";
      }
      if (options.platform === "win32") {
        options.platform = "DOS";
      }
      var zipData = [], localDirLength = 0, centralDirLength = 0, writer, i, encodedComment = utils.transformTo("string", options.encodeFileName(options.comment || this.comment || ""));
      for (var name in this.files) {
        var file = this.files[name];
        var compressionName = file.options.compression || options.compression.toUpperCase();
        var compression = compressions[compressionName];
        if (!compression) {
          throw new Error(compressionName + " is not a valid compression method !");
        }
        var compressionOptions = file.options.compressionOptions || options.compressionOptions || {};
        var compressedObject = generateCompressedObjectFrom.call(this, file, compression, compressionOptions);
        var zipPart = generateZipParts.call(this, name, file, compressedObject, localDirLength, options.platform, options.encodeFileName);
        localDirLength += zipPart.fileRecord.length + compressedObject.compressedSize;
        centralDirLength += zipPart.dirRecord.length;
        zipData.push(zipPart);
      }
      var dirEnd = "";
      dirEnd = signature.CENTRAL_DIRECTORY_END + // number of this disk
      "\0\0\0\0" + // total number of entries in the central directory on this disk
      decToHex(zipData.length, 2) + // total number of entries in the central directory
      decToHex(zipData.length, 2) + // size of the central directory   4 bytes
      decToHex(centralDirLength, 4) + // offset of start of central directory with respect to the starting disk number
      decToHex(localDirLength, 4) + // .ZIP file comment length
      decToHex(encodedComment.length, 2) + // .ZIP file comment
      encodedComment;
      var typeName = options.type.toLowerCase();
      if (typeName === "uint8array" || typeName === "arraybuffer" || typeName === "blob" || typeName === "nodebuffer") {
        writer = new Uint8ArrayWriter(localDirLength + centralDirLength + dirEnd.length);
      } else {
        writer = new StringWriter(localDirLength + centralDirLength + dirEnd.length);
      }
      for (i = 0; i < zipData.length; i++) {
        writer.append(zipData[i].fileRecord);
        writer.append(zipData[i].compressedObject.compressedContent);
      }
      for (i = 0; i < zipData.length; i++) {
        writer.append(zipData[i].dirRecord);
      }
      writer.append(dirEnd);
      var zip = writer.finalize();
      switch (options.type.toLowerCase()) {
        // case "zip is an Uint8Array"
        case "uint8array":
        case "arraybuffer":
        case "nodebuffer":
          return utils.transformTo(options.type.toLowerCase(), zip);
        case "blob":
          return utils.arrayBuffer2Blob(utils.transformTo("arraybuffer", zip), options.mimeType);
        // case "zip is a string"
        case "base64":
          return options.base64 ? base64.encode(zip) : zip;
        default:
          return zip;
      }
    },
    /**
     * @deprecated
     * This method will be removed in a future version without replacement.
     */
    crc32: function(input, crc) {
      return crc32(input, crc);
    },
    /**
     * @deprecated
     * This method will be removed in a future version without replacement.
     */
    utf8encode: function(string) {
      return utils.transformTo("string", utf8.utf8encode(string));
    },
    /**
     * @deprecated
     * This method will be removed in a future version without replacement.
     */
    utf8decode: function(input) {
      return utf8.utf8decode(input);
    }
  };
  object = out;
  return object;
}
export {
  requireObject as __require
};
