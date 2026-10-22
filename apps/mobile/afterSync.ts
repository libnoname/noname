import { copyFileSync, existsSync, mkdirSync, readdirSync, renameSync, rmSync, writeFileSync } from "fs";
import { resolve } from "path";
import { spawnSync } from "child_process";
import { build } from "vite";
import { writeAssetManifest } from "./scripts/asset-manifest.js";

const root = import.meta.dirname;
const workspaceRoot = resolve(root, "../..");
const distDir = resolve(workspaceRoot, "dist");
const preloadOutDir = resolve(root, ".mobile-preload");
const androidAssetsNodeModules = resolve(root, "android/app/src/main/assets/public/node_modules");
const platform = process.argv[2];

if (platform !== undefined && platform !== "android" && platform !== "ios") {
	throw new Error(`Invalid sync platform: ${platform}`);
}

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
	// 直接调用 CLI，避免依赖平台的 shell 命令解析。
	const cliEntry = resolve(root, "node_modules/@capacitor/cli/bin/capacitor");

	const result = spawnSync(process.execPath, [cliEntry, "sync", ...(platform ? [platform] : [])], {
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
		for (const entry of readdirSync(absolute, { withFileTypes: true })) {
			const { name } = entry;
			// 默认剪影是游戏必需的占位图，任何时候都内置，无需下载
			if (name.startsWith("default_silhouette_")) continue;
			if (!entry.isFile()) continue;
			entries.push(`${group}/${name}`);
		}
	}

	entries.sort();
	writeFileSync(resolve(distDir, "asset-download-manifest.json"), `${JSON.stringify(entries)}\n`, "utf8");
	console.log(`asset-download-manifest.json written: ${entries.length} entries`);
}

await buildPreload();
if (platform === "android") {
	rmSync(resolve(distDir, "asset-download-manifest.json"), { force: true });
	rmSync(resolve(distDir, "asset-manifest.json"), { force: true });
} else {
	if (process.env.NONAME_FULL_ASSETS !== "1") writeDownloadManifest();
	const entries = writeAssetManifest(distDir);
	console.log(`asset-manifest.json written: ${entries} entries`);
}
capSync();
if (platform !== "ios") patchAndroidAssets();
