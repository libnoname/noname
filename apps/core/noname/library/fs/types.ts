export interface OpenOptions {
	read?: boolean;
	write?: boolean;
	create?: boolean;
	truncate?: boolean;
	append?: boolean;
}

export interface RemoveOptions {
	recursive?: boolean;
}

export interface CreateDirOptions {
	recursive?: boolean;
}

export type FileType = "file" | "directory" | "other";

export interface FileInfo {
	type: FileType;
	size?: number;
	mtime?: number;
}

export interface DirEntry {
	name: string;
	type: FileType;
}
