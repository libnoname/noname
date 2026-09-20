import type { CreateDirOptions, DirEntry, FileHandle, FileInfo, FileSystemAdapter, FileSystemBootstrap, OpenOptions, RemoveOptions } from "../../core/noname/library/fs/index";

type NodeStats = import("node:fs").Stats;
type NodeDirent = import("node:fs").Dirent;
type NodeFileHandle = import("node:fs/promises").FileHandle;
type NodeFsPromises = typeof import("node:fs/promises");
type NodePath = typeof import("node:path");
type NodeFsConstants = typeof import("node:fs").constants;

export interface ElectronFileSystemDependencies {
	readonly fs: NodeFsPromises;
	readonly path: NodePath;
	readonly constants: NodeFsConstants;
}

export class ElectronFileSystemAdapter implements FileSystemAdapter {
	/**
	 * This adapter is a best-effort guard for ordinary caller-controlled paths:
	 * it rejects absolute paths, lexical escapes, and symlink components observed
	 * before an operation. The configured root is trusted. Node path APIs do not
	 * provide a race-free root boundary when another process replaces directories
	 * concurrently, so this is not a guarantee against external TOCTOU attacks.
	 * Directory changes made through this adapter are serialized to avoid races
	 * between its own mutation operations.
	 */
	readonly supported = true;

	private readonly rootDir: string;

	private readonly fs: NodeFsPromises;

	private readonly path: NodePath;

	private readonly constants: NodeFsConstants;

	private directoryMutation: Promise<void> = Promise.resolve();

	constructor(
		rootDir: string,
		dependencies: ElectronFileSystemDependencies,
		private readonly bootstrap: FileSystemBootstrap
	) {
		this.path = dependencies.path;
		this.fs = dependencies.fs;
		this.constants = dependencies.constants;
		this.rootDir = this.path.resolve(rootDir);
	}

	async open(inputPath: string, options: OpenOptions = {}): Promise<FileHandle> {
		const resolvedPath = this.resolvePath(inputPath);
		const append = options.append === true;
		const write = options.write === true || append;
		const read = options.read === true || (options.read === undefined && !write);
		const create = options.create === true;
		const createNew = options.createNew === true;
		const truncate = options.truncate === true;

		if (!read && !write) {
			throw this.createOperationError(inputPath, "At least one access mode is required");
		}
		if ((create || createNew || truncate) && !write) {
			throw this.createOperationError(inputPath, "Creating or truncating a file requires write access");
		}

		await this.assertNoSymlink(resolvedPath, true, inputPath);
		try {
			const stats = await this.fs.lstat(resolvedPath);
			if (!stats.isFile()) {
				throw this.createNotFileError(inputPath);
			}
		} catch (error) {
			if (!isNodeErrorCode(error, "ENOENT")) {
				throw this.mapError(error, inputPath);
			}
		}

		let flags = read && write ? this.constants.O_RDWR : write ? this.constants.O_WRONLY : this.constants.O_RDONLY;
		if (createNew) {
			flags |= this.constants.O_CREAT | this.constants.O_EXCL;
		} else if (create) {
			flags |= this.constants.O_CREAT;
		}
		if (truncate) {
			flags |= this.constants.O_TRUNC;
		}
		if (append) {
			flags |= this.constants.O_APPEND;
		}
		if (this.constants.O_NOFOLLOW !== undefined) {
			flags |= this.constants.O_NOFOLLOW;
		}

		let handle: NodeFileHandle | undefined;
		try {
			handle = await this.fs.open(resolvedPath, flags);
			const stats = await handle.stat();
			if (!stats.isFile()) {
				throw this.createNotFileError(inputPath);
			}
			return new ElectronFileHandle(handle, inputPath, this.bootstrap, read, write, append);
		} catch (error) {
			if (handle) {
				await handle.close().catch(() => {});
			}
			throw this.mapError(error, inputPath);
		}
	}

	async read(inputPath: string): Promise<Uint8Array> {
		let handle: FileHandle | undefined;
		try {
			handle = await this.open(inputPath, { read: true });
			return await handle.readAll();
		} finally {
			if (handle) {
				await handle.close();
			}
		}
	}

	async write(inputPath: string, data: Uint8Array): Promise<void> {
		if (!(data instanceof Uint8Array)) {
			throw this.createOperationError(inputPath, "File data must be a Uint8Array");
		}

		let handle: FileHandle | undefined;
		try {
			handle = await this.open(inputPath, { write: true, create: true, truncate: true });
			await handle.write(data);
		} finally {
			if (handle) {
				await handle.close();
			}
		}
	}

	async stat(inputPath: string): Promise<FileInfo | null> {
		const resolvedPath = this.resolvePath(inputPath);
		await this.assertNoSymlink(resolvedPath, false, inputPath);
		try {
			return toFileInfo(await this.fs.lstat(resolvedPath));
		} catch (error) {
			if (isNodeErrorCode(error, "ENOENT")) {
				return null;
			}
			throw this.mapError(error, inputPath);
		}
	}

	async list(inputPath: string): Promise<DirEntry[]> {
		const resolvedPath = this.resolvePath(inputPath);
		await this.assertNoSymlink(resolvedPath, false, inputPath);
		try {
			const stats = await this.fs.lstat(resolvedPath);
			if (!stats.isDirectory()) {
				throw this.createNotDirectoryError(inputPath);
			}
			const entries = await this.fs.readdir(resolvedPath, { withFileTypes: true });
			return entries.map(entry => ({
				name: entry.name,
				type: entry.isFile() ? "file" : entry.isDirectory() ? "directory" : "other",
			}));
		} catch (error) {
			throw this.mapError(error, inputPath);
		}
	}

	createDir(inputPath: string, options: CreateDirOptions = {}): Promise<void> {
		return this.withDirectoryMutation(() => this.createDirInternal(inputPath, options));
	}

	private async createDirInternal(inputPath: string, options: CreateDirOptions): Promise<void> {
		const resolvedPath = this.resolvePath(inputPath);
		if (options.recursive !== true) {
			await this.assertNoSymlink(resolvedPath, false, inputPath);
			try {
				await this.fs.mkdir(resolvedPath);
			} catch (error) {
				throw this.mapError(error, inputPath);
			}
			return;
		}

		const relativePath = this.path.relative(this.rootDir, resolvedPath);
		if (relativePath === "") {
			try {
				await this.createRootDirectory(inputPath);
			} catch (error) {
				throw this.mapError(error, inputPath);
			}
			return;
		}

		const parts = relativePath.split(this.path.sep);
		let currentPath = this.rootDir;
		for (const part of parts) {
			currentPath = this.path.join(currentPath, part);
			let stats: NodeStats | undefined;
			try {
				stats = await this.fs.lstat(currentPath);
			} catch (error) {
				if (!isNodeErrorCode(error, "ENOENT")) {
					throw this.mapError(error, inputPath);
				}
			}

			if (stats) {
				if (stats.isSymbolicLink()) {
					throw this.createInvalidPathError(inputPath, "Symbolic links are not supported");
				}
				if (stats.isDirectory()) {
					continue;
				}
				if (currentPath === resolvedPath) {
					throw this.createAlreadyExistsError(inputPath);
				}
				throw this.createNotDirectoryError(inputPath);
			}

			try {
				await this.fs.mkdir(currentPath);
			} catch (error) {
				if (!isNodeErrorCode(error, "EEXIST")) {
					throw this.mapError(error, inputPath);
				}
				const racedStats = await this.fs.lstat(currentPath).catch(raceError => {
					throw this.mapError(raceError, inputPath);
				});
				if (racedStats.isSymbolicLink()) {
					throw this.createInvalidPathError(inputPath, "Symbolic links are not supported");
				}
				if (!racedStats.isDirectory()) {
					if (currentPath === resolvedPath) {
						throw this.createAlreadyExistsError(inputPath);
					}
					throw this.createNotDirectoryError(inputPath);
				}
			}
		}
	}

	remove(inputPath: string, options: RemoveOptions = {}): Promise<void> {
		return this.withDirectoryMutation(() => this.removeInternal(inputPath, options));
	}

	private async removeInternal(inputPath: string, options: RemoveOptions): Promise<void> {
		const resolvedPath = this.resolvePath(inputPath);
		if (this.path.relative(this.rootDir, resolvedPath) === "") {
			throw this.createInvalidPathError(inputPath, "The adapter root directory cannot be removed");
		}
		await this.assertNoSymlink(resolvedPath, false, inputPath);

		let stats: NodeStats;
		try {
			stats = await this.fs.lstat(resolvedPath);
		} catch (error) {
			throw this.mapError(error, inputPath);
		}

		try {
			if (stats.isSymbolicLink() || !stats.isDirectory()) {
				await this.fs.unlink(resolvedPath);
				return;
			}
			if (options.recursive === true) {
				if (this.fs.rm) {
					await this.fs.rm(resolvedPath, { recursive: true, force: false });
				} else {
					await this.fs.rmdir(resolvedPath);
				}
				return;
			}
			await this.fs.rmdir(resolvedPath);
		} catch (error) {
			throw this.mapError(error, inputPath);
		}
	}

	private withDirectoryMutation<T>(operation: () => Promise<T>): Promise<T> {
		const previous = this.directoryMutation;
		let release!: () => void;
		this.directoryMutation = new Promise<void>(resolve => {
			release = resolve;
		});

		return previous.then(operation).finally(() => release());
	}

	private async createRootDirectory(inputPath: string) {
		try {
			const stats = await this.fs.lstat(this.rootDir);
			if (!stats.isDirectory()) {
				throw this.createNotDirectoryError(inputPath);
			}
			return;
		} catch (error) {
			if (!isNodeErrorCode(error, "ENOENT")) {
				throw error;
			}
		}

		try {
			await this.fs.mkdir(this.rootDir);
		} catch (error) {
			if (!isNodeErrorCode(error, "EEXIST")) {
				throw error;
			}
		}
	}

	private resolvePath(inputPath: string): string {
		const displayPath = toDisplayPath(inputPath);
		if (typeof inputPath !== "string") {
			throw this.createInvalidPathError(displayPath, "Path must be a string");
		}
		if (inputPath.includes("\0")) {
			throw this.createInvalidPathError(inputPath, "Path must not contain a null byte");
		}
		if (this.path.isAbsolute(inputPath) || this.path.win32.isAbsolute(inputPath) || /^[A-Za-z]:/.test(inputPath)) {
			throw this.createInvalidPathError(inputPath, "Path must be relative to the adapter root");
		}

		const resolvedPath = this.path.resolve(this.rootDir, inputPath);
		const relativePath = this.path.relative(this.rootDir, resolvedPath);
		if (relativePath === ".." || relativePath.startsWith(`..${this.path.sep}`) || this.path.isAbsolute(relativePath)) {
			throw this.createInvalidPathError(inputPath, "Path escapes the adapter root");
		}
		return resolvedPath;
	}

	private async assertNoSymlink(resolvedPath: string, includeLeaf: boolean, inputPath: string) {
		const relativePath = this.path.relative(this.rootDir, resolvedPath);
		const parts = relativePath === "" ? [] : relativePath.split(this.path.sep);
		if (!includeLeaf) {
			parts.pop();
		}

		let currentPath = this.rootDir;
		for (const part of parts) {
			currentPath = this.path.join(currentPath, part);
			try {
				const stats = await this.fs.lstat(currentPath);
				if (stats.isSymbolicLink()) {
					throw this.createInvalidPathError(inputPath, "Symbolic links are not supported");
				}
			} catch (error) {
				if (isNodeErrorCode(error, "ENOENT")) {
					return;
				}
				throw this.mapError(error, inputPath);
			}
		}
	}

	private createOperationError(inputPath: string, detail: string) {
		return this.bootstrap.createError(this.bootstrap.ErrorCode.IoError, toDisplayPath(inputPath), detail, new Error(detail));
	}

	private createInvalidPathError(inputPath: string, detail: string) {
		return this.bootstrap.createError(this.bootstrap.ErrorCode.InvalidPath, toDisplayPath(inputPath), detail, new Error(detail));
	}

	private createAlreadyExistsError(inputPath: string) {
		return this.bootstrap.createError(this.bootstrap.ErrorCode.AlreadyExists, toDisplayPath(inputPath), "A file or directory already exists", new Error("A file or directory already exists"));
	}

	private createNotFileError(inputPath: string) {
		return this.bootstrap.createError(this.bootstrap.ErrorCode.NotFile, toDisplayPath(inputPath), "Path is not a file", new Error("Path is not a file"));
	}

	private createNotDirectoryError(inputPath: string) {
		return this.bootstrap.createError(this.bootstrap.ErrorCode.NotDirectory, toDisplayPath(inputPath), "Path is not a directory", new Error("Path is not a directory"));
	}

	private mapError(error: unknown, inputPath: string) {
		if (this.bootstrap.isError(error)) {
			return error;
		}
		return createMappedError(this.bootstrap, inputPath, error);
	}
}

export class ElectronFileHandle implements FileHandle {
	private closed = false;

	constructor(
		private readonly handle: NodeFileHandle,
		private readonly inputPath: string,
		private readonly bootstrap: FileSystemBootstrap,
		private readonly canRead: boolean,
		private readonly canWrite: boolean,
		private readonly append: boolean
	) {}

	async readAll(): Promise<Uint8Array> {
		this.assertOpen();
		if (!this.canRead) {
			throw this.createIoError("File handle was not opened for reading");
		}

		try {
			const stats = await this.handle.stat();
			if (!Number.isSafeInteger(stats.size) || stats.size < 0) {
				throw new Error("File size is not supported");
			}
			const buffer = new Uint8Array(stats.size);
			if (buffer.byteLength === 0) {
				return buffer;
			}
			let offset = 0;
			while (offset < buffer.byteLength) {
				const result = await this.handle.read(buffer, offset, buffer.byteLength - offset, offset);
				if (result.bytesRead === 0) {
					break;
				}
				if (result.bytesRead < 0 || result.bytesRead > buffer.byteLength - offset) {
					throw new Error("File handle returned an invalid read length");
				}
				offset += result.bytesRead;
			}
			return offset === buffer.byteLength ? buffer : buffer.subarray(0, offset);
		} catch (error) {
			throw this.mapError(error);
		}
	}

	async write(data: Uint8Array): Promise<void> {
		this.assertOpen();
		if (!this.canWrite) {
			throw this.createIoError("File handle was not opened for writing");
		}
		if (!(data instanceof Uint8Array)) {
			throw this.createIoError("File data must be a Uint8Array");
		}

		try {
			if (this.append) {
				await this.writeAll(data, null);
				return;
			}
			await this.handle.truncate(0);
			await this.writeAll(data, 0);
		} catch (error) {
			throw this.mapError(error);
		}
	}

	async stat(): Promise<FileInfo> {
		this.assertOpen();
		try {
			return toFileInfo(await this.handle.stat());
		} catch (error) {
			throw this.mapError(error);
		}
	}

	async truncate(size = 0): Promise<void> {
		this.assertOpen();
		if (!this.canWrite) {
			throw this.createIoError("File handle was not opened for writing");
		}
		if (!Number.isSafeInteger(size) || size < 0) {
			throw this.createIoError("Truncate size must be a non-negative safe integer");
		}

		try {
			await this.handle.truncate(size);
		} catch (error) {
			throw this.mapError(error);
		}
	}

	async close(): Promise<void> {
		if (this.closed) {
			return;
		}
		this.closed = true;
		try {
			await this.handle.close();
		} catch (error) {
			throw this.mapError(error);
		}
	}

	private async writeAll(data: Uint8Array, position: number | null): Promise<void> {
		let offset = 0;
		while (offset < data.byteLength) {
			const result = await this.handle.write(data, offset, data.byteLength - offset, position === null ? null : position + offset);
			if (result.bytesWritten <= 0) {
				throw new Error("File handle made no write progress");
			}
			offset += result.bytesWritten;
		}
	}

	private assertOpen() {
		if (this.closed) {
			throw this.createIoError("File handle is closed");
		}
	}

	private createIoError(detail: string) {
		return this.bootstrap.createError(this.bootstrap.ErrorCode.IoError, this.inputPath, detail, new Error(detail));
	}

	private mapError(error: unknown) {
		if (this.bootstrap.isError(error)) {
			return error;
		}
		return createMappedError(this.bootstrap, this.inputPath, error);
	}
}

function toFileInfo(stats: NodeStats): FileInfo {
	return {
		type: stats.isFile() ? "file" : stats.isDirectory() ? "directory" : "other",
		size: stats.size,
		createdAt: stats.birthtime,
		modifiedAt: stats.mtime,
		accessedAt: stats.atime,
	};
}

function createMappedError(bootstrap: FileSystemBootstrap, inputPath: string, error: unknown) {
	const nodeCode = getNodeErrorCode(error);
	let code = bootstrap.ErrorCode.IoError;
	if (nodeCode === "ENOENT") {
		code = bootstrap.ErrorCode.NotFound;
	} else if (nodeCode === "EEXIST") {
		code = bootstrap.ErrorCode.AlreadyExists;
	} else if (nodeCode === "ENOTDIR") {
		code = bootstrap.ErrorCode.NotDirectory;
	} else if (nodeCode === "EISDIR") {
		code = bootstrap.ErrorCode.NotFile;
	} else if (nodeCode === "EACCES" || nodeCode === "EPERM" || nodeCode === "EROFS") {
		code = bootstrap.ErrorCode.PermissionDenied;
	} else if (nodeCode === "EINVAL" || nodeCode === "ENAMETOOLONG" || nodeCode === "ELOOP") {
		code = bootstrap.ErrorCode.InvalidPath;
	}

	const detail = error instanceof Error ? error.message : String(error);
	return bootstrap.createError(code, toDisplayPath(inputPath), detail, error);
}

function getNodeErrorCode(error: unknown): string | undefined {
	if (typeof error !== "object" || error === null || !("code" in error)) {
		return undefined;
	}
	const code = error.code;
	return typeof code === "string" ? code : undefined;
}

function isNodeErrorCode(error: unknown, code: string): boolean {
	return getNodeErrorCode(error) === code;
}

function toDisplayPath(inputPath: unknown): string {
	try {
		return typeof inputPath === "string" ? inputPath : String(inputPath);
	} catch {
		return "";
	}
}
