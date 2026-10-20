/**
 * 资源清单（`asset-manifest.json`）生成器 —— 构建与 CI 共用的唯一实现。
 *
 * 为什么需要这份清单：
 *   iOS 的 WKWebView 自定义 scheme **不支持目录列举**，而游戏运行时靠 `getFileList`
 *   扫描 mode / character / card 等目录，只能读这份构建期生成的清单。
 *
 * 为什么单独抽成文件：
 *   此前生成逻辑内联在 `afterSync.ts`（以及历史上的 CI 瘦身步骤）里，
 *   规则一旦要改就得改多处，极易漂移，而清单内容又直接决定 iOS 上
 *   「哪些文件在、哪些不在」。从此约定：**清单内容的唯一来源是本文件**。
 *
 * 用法（CLI，可一次传多个目录）：
 *   tsx scripts/asset-manifest.ts <目录> [<目录> ...]
 * 每个目录内会写入 / 覆盖 `asset-manifest.json`。
 */

import { readdirSync, statSync, writeFileSync } from "node:fs";
import { relative, resolve, sep, posix } from "node:path";
import { pathToFileURL } from "node:url";

/** 不进入清单的条目名（任意层级都跳过） */
const IGNORED_ENTRIES = new Set(["asset-manifest.json", "asset-download-manifest.json", "preload.js", "node_modules"]);

/** 递归收集目录内的文件路径：统一为 POSIX 分隔符，并排序 */
export function collectAssetEntries(root: string): string[] {
	const entries: string[] = [];

	const walk = (dir: string) => {
		for (const name of readdirSync(dir)) {
			if (IGNORED_ENTRIES.has(name)) continue;

			const absolute = resolve(dir, name);
			if (statSync(absolute).isDirectory()) {
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
