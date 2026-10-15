import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import fs from "node:fs/promises";
import path from "node:path";

const root = import.meta.dirname;

/**
 * 同步执行一条命令，并在失败时立刻中止构建。
 *
 * 此前这里直接 `spawnSync(...)` 而不检查返回值，子构建失败（退出码非 0）
 * 也会被静默忽略，随后继续把上一次/残缺的 dist 复制出去并以退出码 0 结束，
 * 于是 CI 一路绿灯、上线的是坏包。构建脚本的退出码必须可信。
 */
function run(command: string, step: string) {
	console.log(`\n==> ${step}: ${command}`);
	const result = spawnSync(command, { shell: true, stdio: "inherit" });

	if (result.error) {
		console.error(`\n构建失败（${step}）：${result.error.message}`);
		process.exit(1);
	}
	if (result.status !== 0) {
		console.error(`\n构建失败（${step}）：退出码 ${result.status ?? "unknown"}`);
		process.exit(1);
	}
}

run("pnpm -F noname... build", "构建本体及其依赖包");

// packages/extension/ 目前只放各扩展包的源码目录（本仓库内仅有一个 .gitignore）。
// 空 glob 会让 `pnpm -F` 以「No projects matched the filters」失败退出；
// 在下面的严格退出码检查生效后，这会让每一次构建都直接中断。
// 因此这里只在确实存在扩展包时才执行该步骤，既保留扩展包的构建能力，又不误报失败。
const extensionRoot = path.resolve(root, "packages/extension");
const extensionPackages = existsSync(extensionRoot)
	? (await fs.readdir(extensionRoot, { withFileTypes: true }))
			.filter(entry => entry.isDirectory() && existsSync(path.resolve(extensionRoot, entry.name, "package.json")))
			.map(entry => entry.name)
	: [];

if (extensionPackages.length > 0) {
	run("pnpm -F ./packages/extension/** build", `构建扩展包（${extensionPackages.length} 个）`);
} else {
	console.log("\n==> 跳过扩展包构建：packages/extension 下没有任何带 package.json 的包");
}

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
]);
