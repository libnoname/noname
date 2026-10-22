/**
 * 资源清单（`asset-manifest.json`）生成器 —— 构建与 CI 共用的唯一实现。
 *
 * iOS 的 WKWebView 自定义 scheme 不支持目录列举，而游戏运行时依靠
 * `getFileList` 扫描 mode / character / card 等目录，因此必须在构建阶段
 * 生成一份可被运行时索引的资源清单。
 *
 * 使用 `readdirSync(..., { withFileTypes: true })` 可以避免对每个文件额外
 * 执行一次 `statSync`。当前完整包有约 1.5 万个文件，这项改动可将同步阶段的
 * 文件系统调用次数减少近一半。
 *
 * 用法（CLI，可一次传多个目录）：
 *   tsx scripts/asset-manifest.ts <目录> [<目录> ...]
 * 每个目录内会写入 / 覆盖 `asset-manifest.json`。
 */

import { readdirSync, statSync, writeFileSync, type Dirent } from "node:fs";
import { posix, relative, resolve, sep } from "node:path";
import { pathToFileURL } from "node:url";

/** 不进入清单的条目名（任意层级都跳过） */
const IGNORED_ENTRIES = new Set(["asset-manifest.json", "asset-download-manifest.json", "preload.js", "node_modules"]);

/** 优先使用 Dirent 类型，只有符号链接才需要额外 stat。 */
function isDirectoryEntry(absolute: string, entry: Dirent): boolean {
	if (entry.isDirectory()) return true;
	if (entry.isFile()) return false;
	// 保留旧实现跟随符号链接的行为，但普通文件不再逐个 stat。
	if (entry.isSymbolicLink()) return statSync(absolute).isDirectory();
	return false;
}

/** 递归收集目录内的文件路径：统一为 POSIX 分隔符，并排序 */
export function collectAssetEntries(root: string): string[] {
	const entries: string[] = [];

	const walk = (dir: string) => {
		for (const entry of readdirSync(dir, { withFileTypes: true })) {
			const { name } = entry;
			if (IGNORED_ENTRIES.has(name)) continue;

			const absolute = resolve(dir, name);
			if (isDirectoryEntry(absolute, entry)) {
				walk(absolute);
				continue;
			}

			// 统一为 POSIX 分隔符，保证运行时按前缀过滤不受平台影响
			entries.push(relative(root, absolute).split(sep).join(posix.sep));
		}
	};

	walk(root);
	entries.sort();
	return entries;
}

/** 生成并写盘 `asset-manifest.json`，返回写入的条目数 */
export function writeAssetManifest(root: string): number {
	const entries = collectAssetEntries(root);
	writeFileSync(resolve(root, "asset-manifest.json"), `${JSON.stringify(entries)}\n`, "utf8");
	return entries.length;
}

/** 仅当本文件被直接执行（而非被 import）时才走 CLI，避免 import 产生副作用 */
function isDirectRun(): boolean {
	const entry = process.argv[1];
	return entry !== undefined && pathToFileURL(resolve(entry)).href === import.meta.url;
}

if (isDirectRun()) {
	const targets = process.argv.slice(2);
	if (targets.length === 0) {
		console.error("Usage: tsx scripts/asset-manifest.ts <directory> [<directory> ...]");
		process.exit(1);
	}

	for (const target of targets) {
		const root = resolve(target);
		console.log(`${root} asset-manifest.json: ${writeAssetManifest(root)} entries`);
	}
}
