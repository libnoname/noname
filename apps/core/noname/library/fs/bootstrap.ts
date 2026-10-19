import type { FileSystemAdapter } from "./adapter";
import { FileSystemError, FileSystemErrorCode } from "./errors";
import { FileSystem } from "./file-system";
import { installLegacyFileSystemAPI, type LegacyFileSystemGame } from "./legacy";

export interface FileSystemBootstrapHost {
	getFileSystem(): FileSystem;
	setFileSystem(fileSystem: FileSystem): void;
	game: LegacyFileSystemGame;
}

export interface FileSystemBootstrap {
	readonly ErrorCode: typeof FileSystemErrorCode;

	createError(code: FileSystemErrorCode, path: string, detail: string, cause?: unknown): FileSystemError;

	isError(error: unknown): error is FileSystemError;

	install(adapter: FileSystemAdapter): FileSystem;
}

export class CoreFileSystemBootstrap implements FileSystemBootstrap {
	readonly ErrorCode = FileSystemErrorCode;

	private installed = false;

	constructor(private readonly host: FileSystemBootstrapHost) {}

	createError(code: FileSystemErrorCode, path: string, detail: string, cause?: unknown): FileSystemError {
		return new FileSystemError(code, path, { detail, cause });
	}

	isError(error: unknown): error is FileSystemError {
		return error instanceof FileSystemError;
	}

	install(adapter: FileSystemAdapter): FileSystem {
		if (this.installed) {
			throw new Error("The file system adapter has already been installed");
		}
		if (!adapter.supported) {
			throw new Error("Cannot install an unsupported file system adapter");
		}

		const previousFileSystem = this.host.getFileSystem();
		const fileSystem = new FileSystem(adapter);
		try {
			this.host.setFileSystem(fileSystem);
			installLegacyFileSystemAPI(this.host.game, fileSystem);
			this.installed = true;
			return fileSystem;
		} catch (error) {
			this.host.setFileSystem(previousFileSystem);
			throw error;
		}
	}
}
