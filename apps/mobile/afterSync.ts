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
		// 完整包不打包素材下载功能。
		define: {
			__NONAME_FULL_ASSETS__: JSON.stringify(process.env.NONAME_FULL_ASSETS === "1"),
		},
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
	// 直接调用 CLI，避免依赖平台的 shell 命令解析。
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

/** 裁剪前生成完整素材下载清单，供精简包补齐资源。 */
function writeDownloadManifest() {
	/** 与 src/ios/asset-download.ts 里的 TARGET_GROUPS 保持一致 */
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

/** iOS 资源通道不支持列目录，需在 cap sync 前生成资源清单。 */
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
if (process.env.NONAME_FULL_ASSETS !== "1") writeDownloadManifest();
writeAssetManifest();
capSync();
patchAndroidAssets();
