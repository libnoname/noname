/**
 * 文件系统桥接层共用的类型定义与工具函数。
 *
 * 这里定义的是「原生插件 ↔ 游戏核心」之间的中间契约：
 * 各平台（Android 的 SAF、iOS 的沙盒目录）的原生插件都实现同一套 `NativeFileSystem` 接口，
 * 由 `attachLegacyFileSystemAPI` 统一转换成游戏需要的 `game.*` 老 API。
 *
 * 这样做的目的与核心库 `apps/core/noname/library/fs` 的设计保持一致：
 * 平台初始化代码只负责提供实现，不重复编写映射逻辑。
 */

/** 路径类型查询结果：`none` 表示不存在 */
export type NativeEntryType = "file" | "directory" | "none";

/** 一次路径查询（checkFile / checkDir）的返回 */
export interface NativeEntryResult {
	type: NativeEntryType;
}

/** 一次读取（readFile / readFileAsText）的返回。二进制以 base64 承载 */
export interface NativeReadResult {
	data: string;
}

/** 目录列举（getFileList）的返回 */
export interface NativeListResult {
	folders: string[];
	files: string[];
}

/** 目录授权状态（仅 Android SAF 需要，iOS 恒为已授权） */
export interface NativeAccessResult {
	granted: boolean;
	rootUri?: string;
}

/**
 * 各平台原生文件系统插件的统一接口。
 *
 * 方法命名与 Android 端的 `SafFs` 插件保持一致，便于两端对照维护。
 * 所有方法失败时都应「抛出异常（reject）」，而不是返回错误值。
 */
export interface NativeFileSystem {
	checkFile(options: { fileName: string }): Promise<NativeEntryResult>;

	checkDir(options: { dir: string }): Promise<NativeEntryResult>;

	readFile(options: { fileName: string }): Promise<NativeReadResult>;

	readFileAsText(options: { fileName: string }): Promise<NativeReadResult>;

	writeFile(options: { path: string; data: string }): Promise<void>;

	removeFile(options: { fileName: string }): Promise<void>;

	getFileList(options: { dir: string }): Promise<NativeListResult>;

	createDir(options: { dir: string }): Promise<void>;

	removeDir(options: { dir: string }): Promise<void>;
}

/** 游戏核心对象的一个最小子集，仅包含本层需要读写的字段 */
export interface NonameGameLike {
	[key: string]: unknown;
}

/**
 * 清洗导出文件名，去掉各平台上非法的路径字符。
 *
 * 与 Android 端 `preload.ts` 中的同名逻辑保持一致。
 */
export function sanitizeExportName(name?: string): string {
	return (name || "noname").replace(/[\\/:?"*<>|]/g, "-");
}

/**
 * 拼接目录与文件名。
 *
 * @param path 目录路径，允许为空字符串或带结尾斜杠
 * @param name 文件名
 */
export function joinFilePath(path: string, name: string): string {
	if (path === "" || path.endsWith("/")) {
		return `${path}${name}`;
	}
	return `${path}/${name}`;
}

/** base64 字符串 → ArrayBuffer（用于把原生层读到的二进制交给游戏） */
export function base64ToArrayBuffer(base64: string): ArrayBuffer {
	const binary = atob(base64);
	const bytes = new Uint8Array(binary.length);
	for (let i = 0; i < binary.length; i++) {
		bytes[i] = binary.charCodeAt(i);
	}
	return bytes.buffer;
}

/** Uint8Array → base64 字符串（用于把游戏要写的二进制交给原生层） */
export function bytesToBase64(bytes: Uint8Array): string {
	// 分块处理，避免 `String.fromCharCode(...)` 在超大数组上触发调用栈溢出
	const CHUNK_SIZE = 0x8000;
	let binary = "";
	for (let i = 0; i < bytes.length; i += CHUNK_SIZE) {
		binary += String.fromCharCode(...bytes.subarray(i, i + CHUNK_SIZE));
	}
	return btoa(binary);
}

/**
 * 把游戏传入的各种写入数据类型统一转成 base64。
 *
 * 游戏在 `game.writeFile` 中可能传入字符串、`Blob`、`ArrayBuffer` 或视图对象，
 * 这里统一归一化后再交给原生层。
 */
export async function writeDataToBase64(data: string | ArrayBuffer | ArrayBufferView | Blob): Promise<string> {
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

/** 安全调用回调：仅当 callback 确实是函数时才调用，避免玩家保存数据时抛错打断流程 */
export function callbackError(callback: ((error: Error) => void) | undefined, error: unknown): void {
	if (typeof callback === "function") {
		callback(error instanceof Error ? error : new Error(String(error)));
	}
}
