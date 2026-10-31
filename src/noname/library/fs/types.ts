export interface OpenOptions {
	read?: boolean;
	write?: boolean;
	create?: boolean;
	createNew?: boolean;
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
	createdAt?: Date;
	modifiedAt?: Date;
	accessedAt?: Date;
}

export interface DirEntry {
	name: string;
	type: FileType;
}
