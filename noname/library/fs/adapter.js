import { FileSystemError, FileSystemErrorCode } from "./errors.js";
class DefaultFileSystemAdapter {
  async open(path, _options) {
    throw this.createError(path);
  }
  async read(path) {
    throw this.createError(path);
  }
  async write(path, _data) {
    throw this.createError(path);
  }
  async stat(path) {
    throw this.createError(path);
  }
  async list(path) {
    throw this.createError(path);
  }
  async createDir(path, _options) {
    throw this.createError(path);
  }
  async remove(path, _options) {
    throw this.createError(path);
  }
  createError(path) {
    return new FileSystemError(FileSystemErrorCode.IoError, path, {
      cause: new Error("File system adapter has not been initialized, or platform doesn't support file system")
    });
  }
}
export {
  DefaultFileSystemAdapter
};
