import { FileHandle } from "./handle";
import { CreateDirOptions, DirEntry, FileInfo, OpenOptions, RemoveOptions } from "./types";

export interface FileSystemAdapter {
	open(path: string, options?: OpenOptions): Promise<FileHandle>;

	read(path: string): Promise<Uint8Array>;

	write(path: string, data: Uint8Array): Promise<void>;

	stat(path: string): Promise<FileInfo | null>;

	list(path: string): Promise<DirEntry[]>;

	createDir(path: string, options?: CreateDirOptions): Promise<void>;

	remove(path: string, options?: RemoveOptions): Promise<void>;
}
