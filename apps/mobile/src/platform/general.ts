import { CapacitorHttp } from "@capacitor/core";

export type EntryType = "file" | "directory" | "none";

export interface MinimalFileSystem {
	statEntry(options: { entryName: string }): Promise<{ type: EntryType }>;
}

export interface DownloadFileSystem {
	createDir(options: { dir: string }): Promise<void>;
	writeFile(options: { path: string; data: string }): Promise<void>;
	statEntry?(options: { entryName: string }): Promise<{ type: string }>;
}

export function sanitizeExportName(name?: string) {
	return (name || "noname").replace(/\\|\/|:|\?|"|\*|<|>|\|/g, "-");
}

export function joinFilePath(path: string, name: string) {
	if (path.endsWith("/") || path === "") return `${path}${name}`;
	return `${path}/${name}`;
}

export function dirnameOf(path: string) {
	const index = path.lastIndexOf("/");
	return index <= 0 ? "" : path.slice(0, index);
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

/**
 * 为 Capacitor 端补上 game.download。
 *
 * 走 CapacitorHttp（原生请求，不受 WKWebView 的 CORS 限制），二进制以 base64 返回，
 * 可直接交给各平台的 writeFile（均以 base64 为入参）。原生接口不提供下载进度，
 * 因此在写盘完成时一次性回报 onprogress(loaded, total)。
 */
export function installDownload(game: any, fs: DownloadFileSystem) {
	const debugLines: string[] = [];
	const logDebug = (line: string) => {
		debugLines.push(line);
		if (debugLines.length > 40) {
			debugLines.splice(0, debugLines.length - 40);
		}
		void dataToBase64(debugLines.join("\n"))
			.then(data => fs.writeFile({ path: "download-debug.log", data }))
			.catch(() => {});
	};
	game.download = function download(url: string, folder: string, onsuccess?: () => void, onerror?: (error: unknown) => void, dev?: unknown, onprogress?: (loaded: number, total?: number) => void) {
		let target = String(url);
		if (!/^[a-z][a-z0-9+.-]*:\/\//i.test(target)) {
			const getLib = (globalThis as any).get;
			if (typeof getLib?.url === "function") {
				target = getLib.url(dev) + target;
			} else if (typeof globalThis.location !== "undefined") {
				target = new URL(target, globalThis.location.href).href;
			}
		}
		// 扩展目录名可能含中文等非 ASCII 字符，原生请求需要先转义
		target = encodeURI(target);
		const fail = (error: unknown) => {
			const wrapped = error instanceof Error ? error : new Error(String(error));
			(wrapped as any).source = folder;
			logDebug(`fail folder=${folder} error=${wrapped.message}`);
			callbackError(onerror as Function | undefined, wrapped);
		};
		void (async () => {
			try {
				const response = await CapacitorHttp.request({
					url: target,
					method: "GET",
					responseType: "arraybuffer" as any,
				});
				if (response.status < 200 || response.status >= 300) {
					throw new Error(`下载失败（HTTP ${response.status}）：${target}`);
				}
				const dataType = typeof response.data;
				const base64 = dataType === "string" ? (response.data as string) : await dataToBase64(response.data as ArrayBuffer);
				const dir = dirnameOf(folder);
				if (dir) {
					await fs.createDir({ dir });
				}
				await fs.writeFile({ path: folder, data: base64 });
				const stat = await fs.statEntry?.({ entryName: folder }).catch(error => ({ type: `error:${String(error)}` }));
				logDebug(`ok folder=${folder} dataType=${dataType} base64Len=${base64.length} stat=${stat?.type ?? "-"}`);
				if (typeof onprogress === "function") {
					const bytes = Math.floor((base64.length * 3) / 4);
					onprogress(bytes, bytes);
				}
				onsuccess?.();
			} catch (error) {
				fail(error);
			}
		})();
	};
	return game.download;
}
