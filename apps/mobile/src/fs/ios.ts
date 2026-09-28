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
import { Capacitor } from "@capacitor/core";
import type {
	NativeAccessResult,
	NativeEntryResult,
	NativeFileSystem,
	NativeListResult,
	NativeReadResult,
} from "./types.js";

/**
 * 内置资源根目录。
 *
 * Capacitor 会把 `webDir`（即仓库根目录的 `dist/`）同步到 iOS 工程的
 * `App/App/public/`，并在 `capacitor://localhost` 这一自定义 scheme 下提供这些文件。
 * 这里用 `Directory.Data` 之外的方案无法直接访问打包资源，
 * 因此内置资源的读取改为通过 `fetch` 走 WebView 的资源通道（见 `readBundled`）。
 */
const BUNDLED_BASE_URL = "capacitor://localhost";

/** 可写层的根目录名（位于 iOS 的 Documents 目录下） */
const WRITABLE_ROOT = "noname";

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
		return { type: await this.resolveType(options.fileName, "file") };
	}

	async checkDir(options: { dir: string }): Promise<NativeEntryResult> {
		return { type: await this.resolveType(options.dir, "directory") };
	}

	async readFile(options: { fileName: string }): Promise<NativeReadResult> {
		const writablePath = this.toWritablePath(options.fileName);

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
		const writablePath = this.toWritablePath(options.fileName);

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
			path: this.toWritablePath(options.path),
			directory: Directory.Documents,
			data: options.data,
			// 写入前自动补齐父目录，避免调用方必须先 createDir
			recursive: true,
		});
	}

	async removeFile(options: { fileName: string }): Promise<void> {
		const writablePath = this.toWritablePath(options.fileName);

		if (!(await this.exists(writablePath))) {
			// 内置资源属于 App 包，不可删除，这里明确报错而不是静默失败
			throw new Error(`内置资源只读或文件不存在: ${options.fileName}`);
		}

		await Filesystem.deleteFile({
			path: writablePath,
			directory: Directory.Documents,
		});
	}

	async getFileList(options: { dir: string }): Promise<NativeListResult> {
		const folders = new Set<string>();
		const files = new Set<string>();

		// 先收集内置资源层的条目
		for (const entry of await this.listBundled(options.dir)) {
			if (entry.isDirectory) {
				folders.add(entry.name);
			} else {
				files.add(entry.name);
			}
		}

		// 再叠加可写层的条目（同名时以可写层为准，与覆盖层语义一致）
		const writablePath = this.toWritablePath(options.dir);
		if (await this.exists(writablePath)) {
			const result = await Filesystem.readdir({
				path: writablePath,
				directory: Directory.Documents,
			});
			for (const entry of result.files) {
				if (entry.type === "directory") {
					folders.add(entry.name);
					files.delete(entry.name);
				} else {
					if (!folders.has(entry.name)) {
						files.add(entry.name);
					}
				}
			}
		}

		if (folders.size === 0 && files.size === 0) {
			// 两层都没有内容：抛错以符合 Android 端「目录不存在」的行为
			if (!(await this.exists(writablePath))) {
				throw new Error(`${options.dir} 不存在`);
			}
		}

		return { folders: [...folders], files: [...files] };
	}

	async createDir(options: { dir: string }): Promise<void> {
		const path = this.toWritablePath(options.dir);
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
		const path = this.toWritablePath(options.dir);

		if (path === "" || !(await this.exists(path))) {
			throw new Error(`内置资源只读或目录不存在: ${options.dir}`);
		}

		await Filesystem.rmdir({
			path,
			directory: Directory.Documents,
			recursive: true,
		});
	}

	/** 查询某个路径在两个层里的类型 */
	private async resolveType(path: string, expected: "file" | "directory"): Promise<"file" | "directory" | "none"> {
		const writablePath = this.toWritablePath(path);

		if (await this.exists(writablePath)) {
			try {
				const info = await Filesystem.stat({
					path: writablePath,
					directory: Directory.Documents,
				});
				return info.type === "directory" ? "directory" : "file";
			} catch {
				// stat 失败时继续探测内置资源
			}
		}

		// 内置资源：通过资源通道探测（HEAD 请求判断文件是否存在）
		if (expected === "file") {
			if (await this.bundledFileExists(path)) {
				return "file";
			}
			// 也可能是目录：尝试列目录
			if ((await this.listBundled(path)).length > 0) {
				return "directory";
			}
		} else {
			if ((await this.listBundled(path)).length > 0) {
				return "directory";
			}
			if (await this.bundledFileExists(path)) {
				return "file";
			}
		}

		return "none";
	}

	/** 判断可写层中是否存在该路径 */
	private async exists(path: string): Promise<boolean> {
		if (path === "") {
			return true;
		}
		try {
			await Filesystem.stat({ path, directory: Directory.Documents });
			return true;
		} catch {
			return false;
		}
	}

	/** 游戏内路径 → Documents 目录下的相对路径 */
	private toWritablePath(path: string): string {
		const normalized = normalizeSegments(path);
		if (normalized === "") {
			return WRITABLE_ROOT;
		}
		return `${WRITABLE_ROOT}/${normalized}`;
	}

	// ---------- 内置资源访问 ----------

	/**
	 * 探测内置资源里是否存在某个文件。
	 *
	 * Capacitor 的 iOS 资源由 WKWebView 的自定义 scheme 提供，
	 * 因此这里用 `fetch(..., { method: "GET" })` 判断可读性。
	 */
	private async bundledFileExists(path: string): Promise<boolean> {
		try {
			const response = await fetch(this.toBundledUrl(path));
			if (!response.ok) {
				return false;
			}
			// 目录请求在部分实现下会返回 HTML，因此仍需排除「看起来是目录」的情况
			const contentType = response.headers.get("content-type") ?? "";
			return !contentType.includes("text/html") || this.looksLikeAsset(path);
		} catch {
			return false;
		}
	}

	/** 读取内置资源的二进制，转成 base64 */
	private async readBundled(path: string): Promise<string> {
		const response = await fetch(this.toBundledUrl(path));
		if (!response.ok) {
			throw new Error(`内置资源不存在: ${path}`);
		}

		const buffer = await response.arrayBuffer();
		return arrayBufferToBase64(buffer);
	}

	/** 读取内置资源的文本 */
	private async readBundledText(path: string): Promise<string> {
		const response = await fetch(this.toBundledUrl(path));
		if (!response.ok) {
			throw new Error(`内置资源不存在: ${path}`);
		}
		return response.text();
	}

	/**
	 * 列出内置资源目录。
	 *
	 * 限制说明：WKWebView 的自定义 scheme **不支持目录列举**，
	 * 因此 iOS 端无法真正「读取打包资源的目录列表」。
	 *
	 * 解决方案：由构建阶段生成一份资源清单（`asset-manifest.json`），
	 * 运行时按清单过滤出该目录下的条目。清单见 `scripts` 目录下的生成脚本，
	 * 以及本文件末尾 `loadManifest` 的懒加载逻辑。
	 */
	private async listBundled(dir: string): Promise<{ name: string; isDirectory: boolean }[]> {
		const manifest = await this.loadManifest();
		const normalized = normalizeSegments(dir);
		const prefix = normalized === "" ? "" : `${normalized}/`;

		const folders = new Set<string>();
		const files = new Set<string>();

		for (const entry of manifest) {
			if (prefix !== "" && !entry.startsWith(prefix)) {
				continue;
			}

			const relative = entry.slice(prefix.length);
			if (relative === "") {
				continue;
			}

			const slashIndex = relative.indexOf("/");
			if (slashIndex === -1) {
				files.add(relative);
			} else {
				folders.add(relative.slice(0, slashIndex));
			}
		}

		return [
			...[...folders].map(name => ({ name, isDirectory: true })),
			...[...files].map(name => ({ name, isDirectory: false })),
		];
	}

	/** 懒加载并缓存资源清单；缺失时退化为空清单（仅影响目录列举，不影响文件读取） */
	private async loadManifest(): Promise<string[]> {
		if (this.manifestCache) {
			return this.manifestCache;
		}

		try {
			const response = await fetch(this.toBundledUrl("asset-manifest.json"));
			if (!response.ok) {
				this.manifestCache = [];
				return this.manifestCache;
			}
			const data = (await response.json()) as unknown;
			this.manifestCache = Array.isArray(data) ? data.filter((item): item is string => typeof item === "string") : [];
		} catch {
			this.manifestCache = [];
		}

		return this.manifestCache;
	}

	private manifestCache: string[] | null = null;

	/** 资源目录不应该是 HTML，用于排除「目录被返回成 index.html」的误判 */
	private looksLikeAsset(path: string): boolean {
		return /\.[a-z0-9]+$/i.test(path);
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
