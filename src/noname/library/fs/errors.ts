export enum FileSystemErrorCode {
	NotFound = "NOT_FOUND",
	AlreadyExists = "ALREADY_EXISTS",
	NotFile = "NOT_FILE",
	NotDirectory = "NOT_DIRECTORY",
	PermissionDenied = "PERMISSION_DENIED",
	InvalidPath = "INVALID_PATH",
	IoError = "IO_ERROR",
}

export interface FileSystemErrorOptions extends ErrorOptions {
	detail?: string;
}

export class FileSystemError extends Error {
	constructor(
		public readonly code: FileSystemErrorCode,
		public readonly path: string,
		options?: FileSystemErrorOptions
	) {
		super(options?.detail ? `${code}: ${path}: ${options.detail}` : `${code}: ${path}`, options);
	}
}
