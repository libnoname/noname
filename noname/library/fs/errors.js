var FileSystemErrorCode = /* @__PURE__ */ ((FileSystemErrorCode2) => {
  FileSystemErrorCode2["NotFound"] = "NOT_FOUND";
  FileSystemErrorCode2["AlreadyExists"] = "ALREADY_EXISTS";
  FileSystemErrorCode2["NotFile"] = "NOT_FILE";
  FileSystemErrorCode2["NotDirectory"] = "NOT_DIRECTORY";
  FileSystemErrorCode2["PermissionDenied"] = "PERMISSION_DENIED";
  FileSystemErrorCode2["InvalidPath"] = "INVALID_PATH";
  FileSystemErrorCode2["IoError"] = "IO_ERROR";
  return FileSystemErrorCode2;
})(FileSystemErrorCode || {});
class FileSystemError extends Error {
  constructor(code, path, options) {
    super(options?.detail ? `${code}: ${path}: ${options.detail}` : `${code}: ${path}`, options);
    this.code = code;
    this.path = path;
  }
}
export {
  FileSystemError,
  FileSystemErrorCode
};
