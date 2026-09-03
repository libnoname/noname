import type { FileSystemAdapter } from "./adapter";
import type { OpenOptions } from "./types";

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
		return (await this.adapter.stat(path)) !== null;
	}

	// ...
}

export type { FileHandle } from "./handle";
export type { DirEntry, FileInfo, OpenOptions, RemoveOptions, CreateDirOptions } from "./types";
export { FileSystemError, FileSystemErrorCode } from "./errors";
