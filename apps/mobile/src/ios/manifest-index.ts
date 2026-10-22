/**
 * 内置资源清单索引。
 *
 * `asset-manifest.json` 是 1.5 万条左右的扁平路径数组。iOS 侧每次
 * `getFileList` / `checkFile` 都线性扫描整份清单，启动阶段会被反复调用，
 * 属于纯重复计算。这里在首次使用时把清单预处理成：
 *
 * - `files`：全部内置文件路径集合（存在性检查 O(1)）；
 * - `directories`：目录 → 直接子项（目录列举 O(1)）。
 *
 * 索引只构建一次，后续查询不再触碰原始清单。
 */

/** 目录的直接子项，名称已排序 */
export interface ManifestDirectory {
	folders: string[];
	files: string[];
}

export interface ManifestIndex {
	/** 全部内置文件路径（POSIX 分隔符、已归一化） */
	files: Set<string>;
	/** 目录路径 → 直接子项；根目录用空字符串 */
	directories: Map<string, ManifestDirectory>;
}

export type ManifestPathType = "file" | "directory" | "unknown";

/** 与 `fs.ts` 的 normalizeSegments 保持一致：统一分隔符并剔除空段、`.`、`..` */
export function normalizeManifestPath(path: string): string {
	return path
		.replace(/\\/g, "/")
		.split("/")
		.filter(segment => segment !== "" && segment !== "." && segment !== "..")
		.join("/");
}

/** 使用已构建索引一次判定文件、目录或未知路径。 */
export function getManifestPathType(index: ManifestIndex, path: string): ManifestPathType {
	const normalized = normalizeManifestPath(path);
	if (index.files.has(normalized)) return "file";
	if (index.directories.has(normalized)) return "directory";
	return "unknown";
}

export function buildManifestIndex(entries: readonly string[]): ManifestIndex {
	const files = new Set<string>();
	const rawDirectories = new Map<string, { folders: Set<string>; files: Set<string> }>();

	const directory = (path: string) => {
		let entry = rawDirectories.get(path);
		if (!entry) {
			entry = { folders: new Set(), files: new Set() };
			rawDirectories.set(path, entry);
		}
		return entry;
	};

	// 根目录始终存在，保证 getFileList("") 返回稳定结果
	directory("");

	for (const entry of entries) {
		if (typeof entry !== "string") continue;

		const path = normalizeManifestPath(entry);
		if (path === "" || files.has(path)) continue;
		files.add(path);

		const slash = path.lastIndexOf("/");
		const parent = slash === -1 ? "" : path.slice(0, slash);
		const name = slash === -1 ? path : path.slice(slash + 1);

		directory(parent).files.add(name);

		// 为每一级祖先目录登记这个子目录（a/b/c.js → a/b 是目录、a 的子目录含 b）
		let dir = parent;
		while (dir !== "") {
			const dirSlash = dir.lastIndexOf("/");
			const up = dirSlash === -1 ? "" : dir.slice(0, dirSlash);
			const dirName = dirSlash === -1 ? dir : dir.slice(dirSlash + 1);
			directory(up).folders.add(dirName);
			dir = up;
		}
	}

	const directories = new Map<string, ManifestDirectory>();
	for (const [path, { folders, files }] of rawDirectories) {
		directories.set(path, {
			folders: [...folders].sort(),
			files: [...files].sort(),
		});
	}

	return { files, directories };
}
