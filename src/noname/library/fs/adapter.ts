import { FileSystemError, FileSystemErrorCode } from "./errors";
import type { FileHandle } from "./handle";
import type { CreateDirOptions, DirEntry, FileInfo, OpenOptions, RemoveOptions } from "./types";

export interface FileSystemAdapter {
	open(path: string, options?: OpenOptions): Promise<FileHandle>;

	read(path: string): Promise<Uint8Array>;

	write(path: string, data: Uint8Array): Promise<void>;

	stat(path: string): Promise<FileInfo | null>;

	list(path: string): Promise<DirEntry[]>;

	createDir(path: string, options?: CreateDirOptions): Promise<void>;

	remove(path: string, options?: RemoveOptions): Promise<void>;
}

/**
 * 在运行环境尚未提供文件系统实现时使用的默认适配器。
 */
export class DefaultFileSystemAdapter implements FileSystemAdapter {
	async open(path: string, _options?: OpenOptions): Promise<FileHandle> {
		throw this.createError(path);
	}

	async read(path: string): Promise<Uint8Array> {
		throw this.createError(path);
	}

	async write(path: string, _data: Uint8Array): Promise<void> {
		throw this.createError(path);
	}

	async stat(path: string): Promise<FileInfo | null> {
		throw this.createError(path);
	}

	async list(path: string): Promise<DirEntry[]> {
		throw this.createError(path);
	}

	async createDir(path: string, _options?: CreateDirOptions): Promise<void> {
		throw this.createError(path);
	}

	async remove(path: string, _options?: RemoveOptions): Promise<void> {
		throw this.createError(path);
	}

	private createError(path: string): FileSystemError {
		return new FileSystemError(FileSystemErrorCode.IoError, path, {
			cause: new Error("File system adapter has not been initialized, or platform doesn't support file system"),
		});
	}
}
