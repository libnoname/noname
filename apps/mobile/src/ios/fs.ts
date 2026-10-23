/**
 * iOS 平台文件系统桥接。
 *
 * 与 Android 端的差别（关键设计取舍）：
 *
 * - **Android** 使用 SAF（Storage Access Framework）：游戏资源放在公共目录，
 *   `public/` 下的内置资源只读，用户所选目录作为可写的「覆盖层」，优先级高于内置资源。
 * - **iOS** 采用应用沙盒机制，**没有「让用户选一个目录」这个概念**，因此不需要授权流程。
 *   资源与可写数据统一放在沙盒内：
 *   - 内置资源：随 App 一起打包，由 Capacitor 以 `public/` 目录（WKWebView 的 asset handler）提供；
 *   - 可写数据（存档、扩展、导出文件）：`Documents` 目录。
 *
 * 因此 iOS 侧的读取遵循与 Android 相同的「覆盖层」语义：
 * **先查 Documents（可写层），命中则返回；否则回退到内置资源（只读层）。**
 * 这样「用户修改过的文件覆盖内置文件」「删除用户文件即可还原内置文件」的行为与 Android 一致。
 *
 * 读二进制统一以 base64 承载（与 Android 端插件保持一致，避免依赖各平台各自的二进制传输能力）。
 */

import { Filesystem, Directory, Encoding } from "@capacitor/filesystem";
import { Capacitor, registerPlugin } from "@capacitor/core";
import type { NativeAccessResult, NativeEntryResult, NativeFileSystem, NativeListResult, NativeReadResult } from "../fs/types.js";

const BundledFileSystem = registerPlugin<{
	stat(options: { path: string }): Promise<NativeEntryResult>;
	readdir(options: { path: string }): Promise<NativeListResult>;
}>("BundledFileSystem");

/**
 * 内置资源根目录。
 *
 * Capacitor 会把 `webDir`（即仓库根目录的 `dist/`）同步到 iOS 工程的
 * `App/App/public/`，并在 `capacitor://localhost` 这一自定义 scheme 下提供这些文件。
 * 这里用 `Directory.Data` 之外的方案无法直接访问打包资源，
 * 因此内置资源的读取改为通过 `fetch` 走 WebView 的资源通道（见 `readBundled`）。
 */
const BUNDLED_BASE_URL = "capacitor://localhost";

export class IosFileSystem implements NativeFileSystem {
	/**
	 * iOS 不需要目录授权，恒为已授权。
	 *
	 * 保留该方法是为了让上层 `preload` 的平台分支代码可以复用同一套流程判断。
	 */
	async hasAccess(): Promise<NativeAccessResult> {
		return { granted: true };
	}

	async checkFile(options: { fileName: string }): Promise<NativeEntryResult> {
		return { type: await this.resolveType(options.fileName) };
	}

	async checkDir(options: { dir: string }): Promise<NativeEntryResult> {
		return { type: await this.resolveType(options.dir) };
	}

	async readFile(options: { fileName: string }): Promise<NativeReadResult> {
		const writablePath = normalizeSegments(options.fileName);

		// 覆盖层：优先读可写层
		if (await this.exists(writablePath)) {
			const result = await Filesystem.readFile({
				path: writablePath,
				directory: Directory.Documents,
			});
			return { data: await normalizeBase64(result.data) };
		}

		// 回退到内置资源
		return { data: await this.readBundled(options.fileName) };
	}

	async readFileAsText(options: { fileName: string }): Promise<NativeReadResult> {
		const writablePath = normalizeSegments(options.fileName);

		if (await this.exists(writablePath)) {
			const result = await Filesystem.readFile({
				path: writablePath,
				directory: Directory.Documents,
				encoding: Encoding.UTF8,
			});
			return { data: String(result.data) };
		}

		// 内置资源本身是文本，直接从资源通道取字符串
		return { data: await this.readBundledText(options.fileName) };
	}

	async writeFile(options: { path: string; data: string }): Promise<void> {
		await Filesystem.writeFile({
			path: normalizeSegments(options.path),
			directory: Directory.Documents,
			data: options.data,
			// 写入前自动补齐父目录，避免调用方必须先 createDir
			recursive: true,
		});
	}

	async removeFile(options: { fileName: string }): Promise<void> {
		const writablePath = normalizeSegments(options.fileName);

		if (!(await this.exists(writablePath))) {
			// 内置资源属于 App 包，不可删除，这里明确报错而不是静默失败
			const bundled = (await BundledFileSystem.stat({ path: options.fileName })).type !== "none";
			throw new Error(bundled ? `内置资源只读: ${options.fileName}` : `文件不存在: ${options.fileName}`);
		}

		await Filesystem.deleteFile({
			path: writablePath,
			directory: Directory.Documents,
		});
	}

	async getFileList(options: { dir: string }): Promise<NativeListResult> {
		const writablePath = normalizeSegments(options.dir);
		const writableType = await this.statWritable(writablePath);
		if (writableType === "file") {
			throw new Error(`${options.dir} 不是文件夹`);
		}

		const bundledType = (await BundledFileSystem.stat({ path: options.dir })).type;
		if (writableType === null && bundledType !== "directory") {
			throw new Error(bundledType === "file" ? `${options.dir} 不是文件夹` : `${options.dir} 不存在`);
		}

		const bundled = bundledType === "directory" ? await BundledFileSystem.readdir({ path: options.dir }) : { folders: [], files: [] };
		const folders = new Set(bundled.folders);
		const files = new Set(bundled.files);

		// 同名时以可写层为准，包括文件与目录类型不同的情况。
		if (writableType === "directory") {
			try {
				const result = await Filesystem.readdir({
					path: writablePath,
					directory: Directory.Documents,
				});
				for (const entry of result.files) {
					if (entry.type === "directory") {
						folders.add(entry.name);
						files.delete(entry.name);
					} else {
						files.add(entry.name);
						folders.delete(entry.name);
					}
				}
			} catch (error) {
				// 保留可写目录列举失败时退化为仅内置资源的行为。
				console.warn(`[ios-fs] 列举可写目录失败（已降级为仅内置资源）: ${options.dir}`, error);
			}
		}

		return { folders: [...folders], files: [...files] };
	}

	async createDir(options: { dir: string }): Promise<void> {
		const path = normalizeSegments(options.dir);
		if (path === "") {
			// 根目录始终存在
			return;
		}

		try {
			await Filesystem.mkdir({
				path,
				directory: Directory.Documents,
				recursive: true,
			});
		} catch (error) {
			// 目录已存在不算失败（与 Android `ensureDirectory` 的行为一致）
			if (!(await this.exists(path))) {
				throw error;
			}
		}
	}

	async removeDir(options: { dir: string }): Promise<void> {
		const path = normalizeSegments(options.dir);

		if (path === "") {
			throw new Error(`不能删除可写根目录: ${options.dir}`);
		}
		if (!(await this.exists(path))) {
			const bundled = (await BundledFileSystem.stat({ path: options.dir })).type !== "none";
			throw new Error(bundled ? `内置资源只读: ${options.dir}` : `目录不存在: ${options.dir}`);
		}

		await Filesystem.rmdir({
			path,
			directory: Directory.Documents,
			recursive: true,
		});
	}

	/** 查询某个路径在两个层里的类型 */
	private async resolveType(path: string): Promise<"file" | "directory" | "none"> {
		const writablePath = normalizeSegments(path);

		// 一次 stat 同时得到「是否存在」与「类型」，避免先 exists 再 stat 的两次原生调用
		const writableType = await this.statWritable(writablePath);
		if (writableType !== null) {
			return writableType;
		}

		return (await BundledFileSystem.stat({ path })).type;
	}

	/** 判断可写层中是否存在该路径 */
	private async exists(path: string): Promise<boolean> {
		if (path === "") {
			return true;
		}
		return (await this.statWritable(path)) !== null;
	}

	/** 一次 stat 同时判断存在性与类型；不存在或 stat 失败时返回 null */
	private async statWritable(path: string): Promise<"file" | "directory" | null> {
		if (path === "") {
			return "directory";
		}
		try {
			const info = await Filesystem.stat({ path, directory: Directory.Documents });
			return info.type === "directory" ? "directory" : "file";
		} catch {
			return null;
		}
	}

	// ---------- 内置资源访问 ----------

	/** 读取内置资源的二进制，转成 base64 */
	private async readBundled(path: string): Promise<string> {
		const response = await fetch(this.toBundledUrl(path));
		if (!response.ok) {
			throw new Error(response.status === 404 ? `内置资源不存在: ${path}` : `内置资源读取失败 (${response.status}): ${path}`);
		}

		const buffer = await response.arrayBuffer();
		return arrayBufferToBase64(buffer);
	}

	/** 读取内置资源的文本 */
	private async readBundledText(path: string): Promise<string> {
		const response = await fetch(this.toBundledUrl(path));
		if (!response.ok) {
			throw new Error(response.status === 404 ? `内置资源不存在: ${path}` : `内置资源读取失败 (${response.status}): ${path}`);
		}
		return response.text();
	}

	private toBundledUrl(path: string): string {
		const normalized = normalizeSegments(path);
		return `${BUNDLED_BASE_URL}/${normalized}`;
	}
}

/**
 * iOS 平台文件系统实现的工厂函数。
 *
 * 上层 `preload` 通过它取得平台实现，避免直接依赖具体类。
 */
export function createIosFileSystem(): NativeFileSystem {
	return new IosFileSystem();
}

/** 判断当前是否运行在 iOS 上 */
export function isIos(): boolean {
	return Capacitor.getPlatform() === "ios";
}

/** 归一化路径分段，剔除空段、`.` 与 `..` */
function normalizeSegments(path: string): string {
	return path
		.replace(/\\/g, "/")
		.split("/")
		.filter(segment => segment !== "" && segment !== "." && segment !== "..")
		.join("/");
}

/** ArrayBuffer → base64 */
function arrayBufferToBase64(buffer: ArrayBuffer): string {
	const bytes = new Uint8Array(buffer);
	const CHUNK_SIZE = 0x8000;
	let binary = "";
	for (let i = 0; i < bytes.length; i += CHUNK_SIZE) {
		binary += String.fromCharCode(...bytes.subarray(i, i + CHUNK_SIZE));
	}
	return btoa(binary);
}

/**
 * Capacitor 的 `readFile` 在不同平台可能返回 string（base64）或 Blob。
 * 这里统一成 base64 字符串，供上层 `base64ToArrayBuffer` 使用。
 */
async function normalizeBase64(data: string | Blob): Promise<string> {
	if (typeof data === "string") {
		return data;
	}
	return arrayBufferToBase64(await data.arrayBuffer());
}
