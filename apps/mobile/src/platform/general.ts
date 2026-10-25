export type EntryType = "file" | "directory" | "none";

export interface MinimalFileSystem {
	statEntry(options: { entryName: string }): Promise<{ type: EntryType }>;
}

export function sanitizeExportName(name?: string) {
	return (name || "noname").replace(/\\|\/|:|\?|"|\*|<|>|\|/g, "-");
}

export function joinFilePath(path: string, name: string) {
	if (path.endsWith("/") || path === "") return `${path}${name}`;
	return `${path}/${name}`;
}

export function base64ToArrayBuffer(base64: string) {
	const binary = atob(base64);
	const buffer = new Uint8Array(binary.length);
	for (let i = 0; i < binary.length; i++) {
		buffer[i] = binary.charCodeAt(i);
	}
	return buffer.buffer;
}

export function bytesToBase64(bytes: Uint8Array) {
	let binary = "";
	const chunkSize = 0x8000;
	for (let i = 0; i < bytes.length; i += chunkSize) {
		const chunk = bytes.subarray(i, i + chunkSize);
		binary += String.fromCharCode(...chunk);
	}
	return btoa(binary);
}

export async function dataToBase64(data: string | ArrayBuffer | ArrayBufferView | Blob) {
	if (typeof data == "string") {
		return bytesToBase64(new TextEncoder().encode(data));
	}

	if (data instanceof Blob) {
		return bytesToBase64(new Uint8Array(await data.arrayBuffer()));
	}

	if (ArrayBuffer.isView(data)) {
		return bytesToBase64(new Uint8Array(data.buffer, data.byteOffset, data.byteLength));
	}

	return bytesToBase64(new Uint8Array(data));
}

export function toTriState(type: "file" | "directory" | "none", expected: "file" | "directory"): -1 | 0 | 1 {
	const enum EntryType {
		ENTRY_NOT_FOUND = -1,
		ENTRY_NOT_EXPECTED,
		ENTRY_EXPECTED,
	}

	if (type === "none") {
		return EntryType.ENTRY_NOT_FOUND;
	}
	return type === expected ? EntryType.ENTRY_EXPECTED : EntryType.ENTRY_NOT_EXPECTED;
}

export function callbackError(callback: Function | undefined, error: unknown) {
	if (typeof callback == "function") {
		callback(error instanceof Error ? error : new Error(String(error)));
	}
}
