import { spawnSync } from "node:child_process";
import fs from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

/** 执行子命令,非 0 退出码立即终止并报清楚是哪条命令失败 */
function run(cmd: string) {
	const r = spawnSync(cmd, { shell: true, stdio: "inherit" });
	if (r.status !== 0) {
		throw new Error(`构建命令失败(退出码 ${r.status}): ${cmd}`);
	}
}

/**
 * 递归列出 dist 下某目录内所有文件,返回相对 dist 根、以 ./ 开头的 URL 路径。
 * @param {string} dir 相对 dist 的子目录(如 "image");为空则整个 dist
 */
async function listAssets(dir: string): Promise<string[]> {
	const root = "dist";
	const abs = dir ? path.join(root, dir) : root;
	if (!existsSync(abs)) return [];
	const out: string[] = [];
	async function walk(cur: string) {
		const entries = await fs.readdir(cur, { withFileTypes: true });
		for (const e of entries) {
			const full = path.join(cur, e.name);
			if (e.isDirectory()) {
				await walk(full);
			} else if (e.isFile()) {
				// 转成相对 dist 根的 URL(正斜杠,以 ./ 开头)
				const rel = path.relative(root, full).split(path.sep).join("/");
				out.push("./" + rel);
			}
		}
	}
	await walk(abs);
	return out;
}

// 先显式构建本体(core,包名 noname)及其工作区依赖(fs/jit)。
// 注意:`-F noname...` 的 `...` 依赖语法在不同 pnpm 版本行为不一致
// (pnpm 10 曾在 CI 中漏掉 core 本体),故构建后显式校验产物存在。
run("pnpm -F noname... build");
if (!existsSync("apps/core/dist")) {
	throw new Error("apps/core/dist 未生成——core 本体未被构建(检查 pnpm 版本 / -F 过滤器是否匹配到 noname 包)");
}

run("pnpm -F ./packages/extension/** build");

console.log("合并打包结果");
await fs.rm("dist", { recursive: true, force: true });
await fs.mkdir("dist", { recursive: true });
await Promise.all([
	fs.cp("apps/core/dist", "dist", { recursive: true }),
	fs.cp("apps/core/audio", "dist/audio", { recursive: true }),
	fs.cp("apps/core/image", "dist/image", { recursive: true }),
	fs.cp("apps/core/extension", "dist/extension", { recursive: true }),
	fs.cp("docs", "dist/docs", { recursive: true }),
	fs.cp(".nomedia", "dist/.nomedia"),
	fs.cp("LICENSE", "dist/LICENSE"),
	fs.cp("README.md", "dist/README.md"),
	// PWA:清单与离线缓存 SW(纯静态部署可安装、离线可玩)
	fs.cp("apps/core/manifest.webmanifest", "dist/manifest.webmanifest"),
	fs.cp("apps/core/pwa-sw.js", "dist/pwa-sw.js")
]);

// 生成 PWA 离线资源清单(供 SW 预缓存 + 游戏内一键下载使用)
console.log("生成 PWA 资源清单");
{
	// 核心:启动 + 标准对局必需的代码/UI/数据(不含花体字、武将立绘、语音)。
	// 由 SW 在 install 阶段预缓存,保证断网也能稳定启动、进模式、玩标准局。
	const coreDirs = ["noname", "_virtual", "node_modules", "layout", "theme", "game", "mode", "card", "character"];
	const core = new Set<string>(["./index.html", "./noname.js", "./manifest.webmanifest", "./pwa-version.json"]);
	for (const d of coreDirs) {
		for (const f of await listAssets(d)) core.add(f);
	}
	// dist 根目录的启动必需散文件(jit-test.ts、service-worker.js 等 JIT 编译入口、entry)。
	// 之前只扫子目录漏了它们 → 断网时这几个没缓存 → JIT worker 加载失败 → 白屏。
	// 排除仅开发/文档用的散文件(清单本身、README、LICENSE、图标已单列)。
	for (const f of await listAssets("")) {
		// listAssets("") 返回全 dist,只挑根目录一层的 .js/.ts
		const rel = f.replace(/^\.\//, "");
		if (!rel.includes("/") && /\.(js|ts)$/.test(rel) && !rel.startsWith("pwa-")) {
			core.add(f);
		}
	}
	// 花色/基础字体符号属核心(界面必用),花体字(xinwei/yuanli 等大文件)不算核心
	for (const f of await listAssets("font")) {
		if (/\/(suits|motoyamaru)\.woff2$/.test(f)) core.add(f);
	}

	// 全量可下载:核心之外的大素材(立绘、语音、内置扩展、花体字)。
	// 由游戏内"下载离线资源"按钮按需批量缓存,可中断续传。
	const heavy: string[] = [];
	for (const d of ["image", "audio", "extension", "font"]) {
		for (const f of await listAssets(d)) {
			if (!core.has(f)) heavy.push(f);
		}
	}

	const coreList = [...core].sort();
	await fs.writeFile("dist/pwa-core-assets.json", JSON.stringify(coreList));
	await fs.writeFile("dist/pwa-all-assets.json", JSON.stringify(heavy.sort()));
	console.log(`  核心预缓存清单: ${coreList.length} 文件`);
	console.log(`  可下载资源清单: ${heavy.length} 文件`);
}

// 生成 PWA 构建版本戳(YYMMDDHHmm 北京时间),用于界面上确认当前跑的是哪个构建。
// CF 构建服务器在 UTC,加 8 小时转北京时间,用户看到的数字与 push 时间对得上。
{
	const now = new Date(Date.now() + 8 * 3600_000); // UTC+8 北京时间
	const pad = (n: number) => String(n).padStart(2, "0");
	const stamp = `${String(now.getUTCFullYear()).slice(2)}${pad(now.getUTCMonth() + 1)}${pad(now.getUTCDate())}${pad(now.getUTCHours())}${pad(now.getUTCMinutes())}`;
	await fs.writeFile("dist/pwa-version.json", JSON.stringify({ build: stamp }));
	console.log(`  构建版本戳: ${stamp} (北京时间)`);
}
