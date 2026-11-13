import { DefaultFileSystemAdapter } from "./adapter.js";
import { FileSystemError, FileSystemErrorCode } from "./errors.js";
import { installLegacyFileSystemAPI } from "./legacy.js";
class FileSystem {
  constructor(adapter) {
    this.adapter = adapter;
  }
  open(path, options) {
    return this.adapter.open(path, options);
  }
  read(path) {
    return this.adapter.read(path);
  }
  async readText(path) {
    const data = await this.read(path);
    return new TextDecoder().decode(data);
  }
  write(path, data) {
    return this.adapter.write(path, data);
  }
  writeText(path, text) {
    return this.write(path, new TextEncoder().encode(text));
  }
  async exists(path) {
    return await this.stat(path) !== null;
  }
  stat(path) {
    return this.adapter.stat(path);
  }
  async isFile(path) {
    return (await this.stat(path))?.type === "file";
  }
  async isDirectory(path) {
    return (await this.stat(path))?.type === "directory";
  }
  list(path) {
    return this.adapter.list(path);
  }
  createDir(path, options) {
    return this.adapter.createDir(path, options);
  }
  remove(path, options) {
    return this.adapter.remove(path, options);
  }
}
export {
  DefaultFileSystemAdapter,
  FileSystem,
  FileSystemError,
  FileSystemErrorCode,
  installLegacyFileSystemAPI
};
