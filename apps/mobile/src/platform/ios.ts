import { registerPlugin } from "@capacitor/core";
import { Filesystem, Directory, Encoding } from "@capacitor/filesystem";
import { joinFilePath, dataToBase64, base64ToArrayBuffer, toTriState, callbackError, type EntryType, type MinimalFileSystem } from "./general";

interface BundledFileSystem {
	stat(options: { path: string }): Promise<{ type: EntryType }>;
	readdir(options: { path: string }): Promise<{
		folders: string[];
		files: string[];
	}>;
}

let fs: IosFileSystem;

export function initializeIos(): MinimalFileSystem {
	fs = new IosFileSystem(registerPlugin<BundledFileSystem>("BundledFileSystem"));
	try {
		const folders = ["image/character", "audio/skill", "audio/die", "extension"];
		for (const folder of folders) {
			fs.createDir({ dir: folder }).catch(console.error);
		}
	} catch (error) {
		console.warn("[mobile] 预建导入目录失败:", error);
	}
	return fs;
}

export function attachIosFileSystem(game: any): void {
	game.checkFile = function checkFile(fileName, callback, onerror) {
		fs
			.statEntry({ entryName: fileName })
			.then(result => callback?.(toTriState(result.type, "file")))
			.catch(error => callbackError(onerror, error));
	};

	game.checkDir = function checkDir(dir, callback, onerror) {
		fs
			.statEntry({ entryName: dir })
			.then(result => callback?.(toTriState(result.type, "directory")))
			.catch(error => callbackError(onerror, error));
	};

	game.readFile = function readFile(fileName, callback = (_: any) => {}, onerror = () => {}) {
		fs
			.readFile({ fileName })
			.then(result => callback(typeof result.data === "string" ? base64ToArrayBuffer(result.data) : result.data))
			.catch(error => callbackError(onerror, error));
	};

	game.readFileAsText = function readFileAsText(fileName, callback = (_: any) => {}, onerror = () => {}) {
		fs
			.readFileAsText({ fileName })
			.then(result => callback(result.data))
			.catch(error => callbackError(onerror, error));
	};

	game.writeFile = function writeFile(data, path, name, callback = () => {}) {
		fs
			.createDir({ dir: path })
			.then(async () => {
				await fs.writeFile({
					path: joinFilePath(path, name),
					data: await dataToBase64(data),
				});
			})
			.then(() => callback(), callback);
	};

	game.removeFile = function removeFile(fileName, callback = (_?: any) => {}, onerror = () => {}) {
		fs
			.removeFile({ fileName })
			.then(() => callback())
			.catch(error => {
				callback(error);
				callbackError(onerror, error);
			});
	};

	game.getFileList = function getFileList(dir, callback = (_folders: any, _files: any) => {}, onerror) {
		fs
			.getFileList({ dir })
			.then(result => callback(result.folders, result.files))
			.catch(error => callbackError(onerror, error));
	};

	game.ensureDirectory = function ensureDirectory(list, callback = () => {}, file = false) {
		let pathArray = typeof list == "string" ? list.split("/") : list;
		if (file) {
			pathArray = pathArray.slice(0, -1);
		}
		game.createDir?.(pathArray.join("/"), callback, console.error);
	};

	game.createDir = function createDir(directory, successCallback = () => {}, errorCallback = console.error) {
		fs
			.createDir({ dir: directory })
			.then(() => successCallback())
			.catch(error => callbackError(errorCallback, error));
	};

	game.removeDir = function removeDir(directory, successCallback = () => {}, errorCallback = console.error) {
		fs
			.removeDir({ dir: directory })
			.then(() => successCallback())
			.catch(error => callbackError(errorCallback, error));
	};
}

class IosFileSystem implements MinimalFileSystem {
	private readonly BundledBaseUrl = "capacitor://localhost";

	constructor(private bundleFs: BundledFileSystem) {}

	async statEntry(options: { entryName: string }) {
		return { type: await this.resolveType(options.entryName) };
	}

	async readFile(options: { fileName: string }): Promise<{ data: string | ArrayBuffer }> {
		const writablePath = this.normalizeSegments(options.fileName);

		if (await this.exists(writablePath)) {
			const result = await Filesystem.readFile({
				path: writablePath,
				directory: Directory.Documents,
			});
			return { data: result.data as string };
		}

		return { data: await this.readBundled(options.fileName) };
	}

	async readFileAsText(options: { fileName: string }): Promise<{ data: string }> {
		const writablePath = this.normalizeSegments(options.fileName);

		if (await this.exists(writablePath)) {
			const result = await Filesystem.readFile({
				path: writablePath,
				directory: Directory.Documents,
				encoding: Encoding.UTF8,
			});
			return { data: result.data as string };
		}

		return { data: await this.readBundledText(options.fileName) };
	}

	async writeFile(options: { path: string; data: string }): Promise<void> {
		await Filesystem.writeFile({
			path: this.normalizeSegments(options.path),
			directory: Directory.Documents,
			data: options.data,
			recursive: true,
		});
	}

	async removeFile(options: { fileName: string }): Promise<void> {
		const writablePath = this.normalizeSegments(options.fileName);

		if (!(await this.exists(writablePath))) {
			const bundled = (await this.bundleFs.stat({ path: options.fileName })).type !== "none";
			throw new Error(bundled ? `文件只读: ${options.fileName}` : `文件不存在: ${options.fileName}`);
		}

		await Filesystem.deleteFile({
			path: writablePath,
			directory: Directory.Documents,
		});
	}

	async getFileList(options: { dir: string }): Promise<{
		folders: string[];
		files: string[];
	}> {
		const writablePath = this.normalizeSegments(options.dir);

		const writableType = await this.statWritable(writablePath);
		if (writableType === "file") {
			throw new Error(`${options.dir} 不是文件夹`);
		}
		const bundledType = (await this.bundleFs.stat({ path: options.dir })).type;
		if (writableType == null && bundledType !== "directory") {
			throw new Error(bundledType === "file" ? `${options.dir} 不是文件夹` : `${options.dir} 不存在`);
		}

		const bundled = bundledType === "directory" ? await this.bundleFs.readdir({ path: options.dir }) : { folders: [], files: [] };
		const folders = new Set(bundled.folders);
		const files = new Set(bundled.files);

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
				console.warn(`[ios-fs] 列举可写目录失败（已降级为仅内置资源）: ${options.dir}`, error);
			}
		}

		return { folders: [...folders], files: [...files] };
	}

	async createDir(options: { dir: string }): Promise<void> {
		const path = this.normalizeSegments(options.dir);
		if (path === "") {
			return;
		}

		try {
			await Filesystem.mkdir({
				path,
				directory: Directory.Documents,
				recursive: true,
			});
		} catch (error) {
			if (!(await this.exists(path))) {
				throw error;
			}
		}
	}

	async removeDir(options: { dir: string }): Promise<void> {
		const path = this.normalizeSegments(options.dir);

		if (path === "") {
			throw new Error(`不能删除可写根目录: ${options.dir}`);
		}
		if (!(await this.exists(path))) {
			const bundled = (await this.bundleFs.stat({ path: options.dir })).type !== "none";
			throw new Error(bundled ? `内置资源只读: ${options.dir}` : `目录不存在: ${options.dir}`);
		}

		await Filesystem.rmdir({
			path,
			directory: Directory.Documents,
			recursive: true,
		});
	}

	private normalizeSegments(path: string): string {
		return path
			.replace(/\\/g, "/")
			.split("/")
			.filter(segment => segment !== "" && segment !== "." && segment !== "..")
			.join("/");
	}

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

	private async resolveType(path: string): Promise<"file" | "directory" | "none"> {
		const writablePath = this.normalizeSegments(path);

		const writableType = await this.statWritable(writablePath);
		if (writableType !== null) {
			return writableType;
		}

		return (await this.bundleFs.stat({ path })).type;
	}

	private async exists(path: string): Promise<boolean> {
		if (path === "") {
			return true;
		}
		return (await this.statWritable(path)) !== null;
	}

	private toBundledUrl(path: string): string {
		const normalized = this.normalizeSegments(path);
		return `${this.BundledBaseUrl}/${normalized}`;
	}

	private async readBundled(path: string): Promise<ArrayBuffer> {
		const response = await fetch(this.toBundledUrl(path));
		if (!response.ok) {
			throw new Error(response.status === 404 ? `文件不存在: ${path}` : `文件读取失败 (${response.status}): ${path}`);
		}

		return response.arrayBuffer();
	}

	private async readBundledText(path: string): Promise<string> {
		const response = await fetch(this.toBundledUrl(path));
		if (!response.ok) {
			throw new Error(response.status === 404 ? `文件不存在: ${path}` : `文件读取失败 (${response.status}): ${path}`);
		}
		return response.text();
	}
}
