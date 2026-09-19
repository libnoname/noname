import { registerPlugin } from "@capacitor/core";
import type {
	CreateDirOptions,
	DirEntry,
	FileHandle,
	FileInfo,
	FileSystemAdapter,
	FileSystemBootstrap,
	FileType,
	OpenOptions,
	RemoveOptions,
} from "../../core/noname/library/fs/index";

export interface SafFsAccessResult {
	granted: boolean;
	rootUri?: string;
}

export interface SafFsStatResult {
	type: "file" | "directory" | "other" | "none";
	size?: number;
	modifiedAt?: number;
}

export interface SafFsListResult {
	entries: Array<{ name: string; type: FileType }>;
}

export interface SafFsPlugin {
	hasAccess(): Promise<SafFsAccessResult>;
	requestAccess(): Promise<SafFsAccessResult>;
	stat(options: { path: string }): Promise<SafFsStatResult>;
	list(options: { path: string }): Promise<SafFsListResult>;
	read(options: { path: string }): Promise<{ data: string }>;
	write(options: { path: string; data: string }): Promise<{ success: boolean }>;
	createDir(options: { path: string; recursive?: boolean }): Promise<{ success: boolean }>;
	remove(options: { path: string; recursive?: boolean }): Promise<{ success: boolean }>;
}

export const SafFs = registerPlugin<SafFsPlugin>("SafFs");

const ERROR_CODES = new Set([
	"NOT_FOUND",
	"ALREADY_EXISTS",
	"NOT_FILE",
	"NOT_DIRECTORY",
	"PERMISSION_DENIED",
	"INVALID_PATH",
	"IO_ERROR",
]);

export class MobileFileSystemAdapter implements FileSystemAdapter {
	readonly supported = true;

	constructor(
		private readonly plugin: SafFsPlugin,
		private readonly bootstrap: FileSystemBootstrap
	) {}

	async open(inputPath: string, options: OpenOptions = {}): Promise<FileHandle> {
		const path = this.assertPath(inputPath);
		const append = options.append === true;
		const write = options.write === true || append;
		const read = options.read === true || (options.read === undefined && !write);
		const create = options.create === true;
		const createNew = options.createNew === true;
		const truncate = options.truncate === true;

		if (!read && !write) {
			throw this.createOperationError(path, "At least one access mode is required");
		}
		if ((create || createNew || truncate) && !write) {
			throw this.createOperationError(path, "Creating or truncating a file requires write access");
		}

		const info = await this.stat(path);
		if (info !== null && info.type !== "file") {
			throw this.createNotFileError(path);
		}
		if (info !== null && createNew) {
			throw this.createAlreadyExistsError(path);
		}
		if (info === null && (!write || (!create && !createNew))) {
			throw this.createNotFoundError(path);
		}

		let buffer = new Uint8Array();
		if (info === null) {
			await this.writeBytes(path, buffer);
		} else if (truncate) {
			await this.writeBytes(path, buffer);
		} else {
			buffer = await this.readBytes(path);
		}

		return new MobileFileHandle(this, path, this.bootstrap, buffer, read, write, append);
	}

	async read(inputPath: string): Promise<Uint8Array> {
		return this.readBytes(this.assertPath(inputPath));
	}

	async write(inputPath: string, data: Uint8Array): Promise<void> {
		if (!(data instanceof Uint8Array)) {
			throw this.createOperationError(inputPath, "File data must be a Uint8Array");
		}
		await this.writeBytes(this.assertPath(inputPath), data);
	}

	async stat(inputPath: string): Promise<FileInfo | null> {
		const path = this.assertPath(inputPath, true);
		try {
			const result = await this.plugin.stat({ path });
			if (result.type === "none") {
				return null;
			}
			return {
				type: result.type,
				size: result.size,
				modifiedAt: typeof result.modifiedAt === "number" ? new Date(result.modifiedAt) : undefined,
			};
		} catch (error) {
			throw this.mapError(error, path);
		}
	}

	async list(inputPath: string): Promise<DirEntry[]> {
		const path = this.assertPath(inputPath, true);
		try {
			const result = await this.plugin.list({ path });
			return (result.entries ?? []).map(entry => ({
				name: entry.name,
				type: entry.type,
			}));
		} catch (error) {
			throw this.mapError(error, path);
		}
	}

	async createDir(inputPath: string, options: CreateDirOptions = {}): Promise<void> {
		const path = this.assertPath(inputPath, true);
		try {
			await this.plugin.createDir({ path, recursive: options.recursive === true });
		} catch (error) {
			throw this.mapError(error, path);
		}
	}

	async remove(inputPath: string, options: RemoveOptions = {}): Promise<void> {
		const path = this.assertPath(inputPath);
		try {
			await this.plugin.remove({ path, recursive: options.recursive === true });
		} catch (error) {
			throw this.mapError(error, path);
		}
	}

	async readBytes(path: string): Promise<Uint8Array> {
		try {
			const result = await this.plugin.read({ path });
			return base64ToBytes(result.data);
		} catch (error) {
			throw this.mapError(error, path);
		}
	}

	async writeBytes(path: string, data: Uint8Array): Promise<void> {
		try {
			await this.plugin.write({ path, data: bytesToBase64(data) });
		} catch (error) {
			throw this.mapError(error, path);
		}
	}

	private assertPath(inputPath: unknown, allowEmpty = false): string {
		const displayPath = toDisplayPath(inputPath);
		if (typeof inputPath !== "string") {
			throw this.createInvalidPathError(displayPath, "Path must be a string");
		}
		if (inputPath.includes("\0")) {
			throw this.createInvalidPathError(inputPath, "Path must not contain a null byte");
		}
		if (inputPath.startsWith("/") || inputPath.startsWith("\\") || /^[A-Za-z]:/.test(inputPath)) {
			throw this.createInvalidPathError(inputPath, "Path must be relative to the adapter root");
		}

		const normalized = inputPath.replace(/\\/g, "/").replace(/^\.\/+/, "").replace(/\/+$/, "");
		if (normalized === "" || normalized === ".") {
			if (allowEmpty) {
				return "";
			}
			throw this.createInvalidPathError(inputPath, "Path must be a non-empty relative path");
		}
		if (normalized.split("/").includes("..")) {
			throw this.createInvalidPathError(inputPath, "Path must not contain ..");
		}
		return normalized;
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

	private createNotFoundError(inputPath: string) {
		return this.bootstrap.createError(this.bootstrap.ErrorCode.NotFound, toDisplayPath(inputPath), "Path does not exist", new Error("Path does not exist"));
	}

	mapError(error: unknown, inputPath: string) {
		if (this.bootstrap.isError(error)) {
			return error;
		}

		const code = getCapacitorErrorCode(error);
		const mapped =
			code === "NOT_FOUND"
				? this.bootstrap.ErrorCode.NotFound
				: code === "ALREADY_EXISTS"
					? this.bootstrap.ErrorCode.AlreadyExists
					: code === "NOT_FILE"
						? this.bootstrap.ErrorCode.NotFile
						: code === "NOT_DIRECTORY"
							? this.bootstrap.ErrorCode.NotDirectory
							: code === "PERMISSION_DENIED"
								? this.bootstrap.ErrorCode.PermissionDenied
								: code === "INVALID_PATH"
									? this.bootstrap.ErrorCode.InvalidPath
									: this.bootstrap.ErrorCode.IoError;
		const detail = error instanceof Error ? error.message : String(error);
		return this.bootstrap.createError(mapped, toDisplayPath(inputPath), detail, error);
	}
}

export class MobileFileHandle implements FileHandle {
	private closed = false;

	constructor(
		private readonly adapter: MobileFileSystemAdapter,
		private readonly inputPath: string,
		private readonly bootstrap: FileSystemBootstrap,
		private buffer: Uint8Array,
		private readonly canRead: boolean,
		private readonly canWrite: boolean,
		private readonly append: boolean
	) {}

	async readAll(): Promise<Uint8Array> {
		this.assertOpen();
		if (!this.canRead) {
			throw this.createIoError("File handle was not opened for reading");
		}
		return this.buffer.slice();
	}

	async write(data: Uint8Array): Promise<void> {
		this.assertOpen();
		if (!this.canWrite) {
			throw this.createIoError("File handle was not opened for writing");
		}
		if (!(data instanceof Uint8Array)) {
			throw this.createIoError("File data must be a Uint8Array");
		}

		this.buffer = this.append ? concatBytes(this.buffer, data) : data.slice();
		await this.adapter.writeBytes(this.inputPath, this.buffer);
	}

	async stat(): Promise<FileInfo> {
		this.assertOpen();
		const info = await this.adapter.stat(this.inputPath);
		if (info === null) {
			throw this.adapter.mapError(
				this.bootstrap.createError(this.bootstrap.ErrorCode.NotFound, this.inputPath, "Path does not exist", new Error("Path does not exist")),
				this.inputPath
			);
		}
		return info;
	}

	async truncate(size = 0): Promise<void> {
		this.assertOpen();
		if (!this.canWrite) {
			throw this.createIoError("File handle was not opened for writing");
		}
		if (!Number.isSafeInteger(size) || size < 0) {
			throw this.createIoError("Truncate size must be a non-negative safe integer");
		}

		if (size < this.buffer.byteLength) {
			this.buffer = this.buffer.slice(0, size);
		} else if (size > this.buffer.byteLength) {
			const next = new Uint8Array(size);
			next.set(this.buffer);
			this.buffer = next;
		}
		await this.adapter.writeBytes(this.inputPath, this.buffer);
	}

	async close(): Promise<void> {
		this.closed = true;
	}

	private assertOpen() {
		if (this.closed) {
			throw this.createIoError("File handle is closed");
		}
	}

	private createIoError(detail: string) {
		return this.bootstrap.createError(this.bootstrap.ErrorCode.IoError, this.inputPath, detail, new Error(detail));
	}
}

function base64ToBytes(base64: string): Uint8Array {
	const binary = atob(base64);
	const bytes = new Uint8Array(binary.length);
	for (let i = 0; i < binary.length; i++) {
		bytes[i] = binary.charCodeAt(i);
	}
	return bytes;
}

function bytesToBase64(bytes: Uint8Array): string {
	let binary = "";
	const chunkSize = 0x8000;
	for (let i = 0; i < bytes.length; i += chunkSize) {
		binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
	}
	return btoa(binary);
}

function concatBytes(left: Uint8Array, right: Uint8Array): Uint8Array {
	const bytes = new Uint8Array(left.byteLength + right.byteLength);
	bytes.set(left, 0);
	bytes.set(right, left.byteLength);
	return bytes;
}

function getCapacitorErrorCode(error: unknown): string | undefined {
	if (typeof error !== "object" || error === null || !("code" in error)) {
		return undefined;
	}
	const code = error.code;
	return typeof code === "string" && ERROR_CODES.has(code) ? code : undefined;
}

function toDisplayPath(inputPath: unknown): string {
	try {
		return typeof inputPath === "string" ? inputPath : String(inputPath);
	} catch {
		return "";
	}
}
