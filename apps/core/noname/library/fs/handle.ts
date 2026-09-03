import { FileInfo } from "./types";

export interface FileHandle {
	readAll(): Promise<Uint8Array>;

	write(data: Uint8Array): Promise<void>;

	stat(): Promise<FileInfo>;

	close(): Promise<void>;
}
