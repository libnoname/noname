export { CoreFileSystemBootstrap } from "./bootstrap";
export type { FileSystemBootstrap, FileSystemBootstrapHost } from "./bootstrap";
export { FileSystem } from "./file-system";

export type { FileHandle } from "./handle";
export { DefaultFileSystemAdapter } from "./adapter";
export type { FileSystemAdapter } from "./adapter";
export type { CreateDirOptions, DirEntry, FileInfo, FileType, OpenOptions, RemoveOptions } from "./types";
export { FileSystemError, FileSystemErrorCode } from "./errors";
export type { FileSystemErrorOptions } from "./errors";
export { installLegacyFileSystemAPI } from "./legacy";
export type { LegacyFileSystemGame, LegacyWriteData } from "./legacy";
