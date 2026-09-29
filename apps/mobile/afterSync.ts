import { copyFileSync, existsSync, mkdirSync, readdirSync, renameSync, rmSync, statSync, writeFileSync } from "fs";
import { posix, relative, resolve, sep } from "path";
import { spawnSync } from "child_process";
import { build } from "vite";

const root = import.meta.dirname;
const workspaceRoot = resolve(root, "../..");
const distDir = resolve(workspaceRoot, "dist");
const preloadOutDir = resolve(root, ".mobile-preload");
const androidAssetsNodeModules = resolve(root, "android/app/src/main/assets/public/node_modules");

function cleanOldPreloadArtifacts() {
	if (!existsSync(distDir)) return;

	for (const name of readdirSync(distDir)) {
		if (/^(preload(?:-.+)?|web-.+|index\.esm-.+)\.js$/.test(name)) {
			rmSync(resolve(distDir, name), { force: true });
		}
	}
}

async function buildPreload() {
	rmSync(preloadOutDir, { recursive: true, force: true });
	cleanOldPreloadArtifacts();

	await build({
		root,
		configFile: false,
		build: {
			outDir: preloadOutDir,
			emptyOutDir: true,
			target: ["chrome91", "safari16.4"],
			sourcemap: false,
			minify: false,
			lib: {
				entry: resolve(root, "src/preload.ts"),
				formats: ["es"],
				fileName: () => "preload.js",
			},
			rollupOptions: {
				output: {
					inlineDynamicImports: true,
					assetFileNames: "preload-[name][extname]",
				},
			},
		},
	});

	mkdirSync(distDir, { recursive: true });
	copyFileSync(resolve(preloadOutDir, "preload.js"), resolve(distDir, "preload.js"));
	rmSync(preloadOutDir, { recursive: true, force: true });
}

function capSync() {
	// 直接用 node 调 Capacitor CLI 的 JS 入口，而不是 shell 里的 `cap`。
	// 原因：Windows 的 `cmd /c cap` 不会去 node_modules/.bin 找可执行文件
	// （那是 POSIX shell 的机制），会报「'cap' 不是内部或外部命令」。
	// 用 node 直调 .js 入口在 Windows / macOS / Linux 上行为一致。
	const cliEntry = resolve(root, "node_modules/@capacitor/cli/bin/capacitor");

	const result = spawnSync(process.execPath, [cliEntry, "sync"], {
		cwd: root,
		stdio: "inherit",
	});

	if (result.status !== 0) {
		throw new Error(`cap sync failed with exit code ${result.status ?? "unknown"}${result.error ? `: ${result.error.message}` : ""}`);
	}
}

function patchAndroidAssets() {
	const pnpmDir = resolve(androidAssetsNodeModules, ".pnpm");
	const androidSafePnpmDir = resolve(androidAssetsNodeModules, "_pnpm");

	if (!existsSync(pnpmDir)) return;

	if (existsSync(androidSafePnpmDir)) {
		rmSync(androidSafePnpmDir, { recursive: true, force: true });
	}

	renameSync(pnpmDir, androidSafePnpmDir);
}

/**
 * 生成「补充下载清单」`dist/asset-download-manifest.json`。
 *
 * 用途：iOS 瘦身包会删掉 `audio/skill`、`audio/die`、`image/character` 三个目录
 * （见 `.github/workflows/ios-build.yml` 的 slim_assets），游戏内的「下载素材」
 * 按钮需要知道**该补哪些文件**。
 *
 * 为什么不复用 `asset-manifest.json`：那一份是在**删除资源之后**重建的，
 * 恰好不含被删掉的文件。必须在资源还完整的阶段（本函数执行时）单独留一份。
 *
 * 顺带的好处：运行时不再需要请求 `api.github.com`。
 * 该接口匿名限额只有 60 次/小时，且在大陆网络下常被干扰返回 5xx。
 *
 * 注意：必须在 `writeAssetManifest()` **之前**调用，这样本文件会被列进
 * `asset-manifest.json` 的忽略项，不会反过来污染内置资源清单。
 */
function writeDownloadManifest() {
	/** 与 asset-download.ts 里的 TARGET_GROUPS 保持一致 */
	const groups = ["image/character", "audio/skill", "audio/die"];
	const entries: string[] = [];

	for (const group of groups) {
		const absolute = resolve(distDir, group);
		if (!existsSync(absolute)) {
			console.warn(`asset-download-manifest: 跳过缺失目录 ${group}`);
			continue;
		}
		for (const name of readdirSync(absolute)) {
			// 默认剪影是游戏必需的占位图，任何时候都内置，无需下载
			if (name.startsWith("default_silhouette_")) continue;
			if (!statSync(resolve(absolute, name)).isFile()) continue;
			entries.push(`${group}/${name}`);
		}
	}

	entries.sort();
	writeFileSync(resolve(distDir, "asset-download-manifest.json"), `${JSON.stringify(entries)}\n`, "utf8");
	console.log(`asset-download-manifest.json written: ${entries.length} entries`);
}

/**
 * 生成内置资源清单 `dist/asset-manifest.json`。
 *
 * iOS 的 WKWebView 自定义 scheme 不支持目录列举，运行时的 `getFileList`
 * （游戏靠它扫描 mode/character/card 等目录）只能依赖这份构建期清单。
 * 清单必须存在于 dist 内、且在 `cap sync` 之前写盘，才会被同步进 iOS 工程。
 */
function writeAssetManifest() {
	const entries: string[] = [];
	const ignored = new Set(["asset-manifest.json", "asset-download-manifest.json", "preload.js", "node_modules"]);

	const collect = (dir: string) => {
		for (const name of readdirSync(dir)) {
			if (ignored.has(name)) continue;

			const absolute = resolve(dir, name);
			if (statSync(absolute).isDirectory()) {
				collect(absolute);
				continue;
			}

			// 统一为 POSIX 分隔符，保证运行时按前缀过滤不受平台影响
			entries.push(relative(distDir, absolute).split(sep).join(posix.sep));
		}
	};

	collect(distDir);
	entries.sort();

	writeFileSync(resolve(distDir, "asset-manifest.json"), `${JSON.stringify(entries)}\n`, "utf8");
	console.log(`asset-manifest.json written: ${entries.length} entries`);
}

await buildPreload();
writeDownloadManifest();
writeAssetManifest();
capSync();
patchAndroidAssets();
