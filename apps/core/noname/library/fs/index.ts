import type { FileSystemAdapter } from "./adapter";
import type { CreateDirOptions, OpenOptions, RemoveOptions } from "./types";

export class FileSystem {
	constructor(private readonly adapter: FileSystemAdapter) {}

	open(path: string, options?: OpenOptions) {
		return this.adapter.open(path, options);
	}

	read(path: string) {
		return this.adapter.read(path);
	}

	async readText(path: string) {
		const data = await this.read(path);
		return new TextDecoder().decode(data);
	}

	write(path: string, data: Uint8Array) {
		return this.adapter.write(path, data);
	}

	writeText(path: string, text: string) {
		return this.write(path, new TextEncoder().encode(text));
	}

	async exists(path: string) {
		return (await this.stat(path)) !== null;
	}

	stat(path: string) {
		return this.adapter.stat(path);
	}

	async isFile(path: string) {
		return (await this.stat(path))?.type === "file";
	}

	async isDirectory(path: string) {
		return (await this.stat(path))?.type === "directory";
	}

	list(path: string) {
		return this.adapter.list(path);
	}

	createDir(path: string, options?: CreateDirOptions) {
		return this.adapter.createDir(path, options);
	}

	remove(path: string, options?: RemoveOptions) {
		return this.adapter.remove(path, options);
	}
}

export type { FileHandle } from "./handle";
export { DefaultFileSystemAdapter } from "./adapter";
export type { FileSystemAdapter } from "./adapter";
export type { CreateDirOptions, DirEntry, FileInfo, FileType, OpenOptions, RemoveOptions } from "./types";
export { FileSystemError, FileSystemErrorCode } from "./errors";
export type { FileSystemErrorOptions } from "./errors";
export { installLegacyFileSystemAPI } from "./legacy";
export type { LegacyFileSystemGame, LegacyWriteData } from "./legacy";
