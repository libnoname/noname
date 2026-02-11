import { spawnSync } from "node:child_process";
import fs from "node:fs/promises";
spawnSync("pnpm -F noname... build", {
	shell: true,
	stdio: "inherit",
});

spawnSync("pnpm -F ./packages/extension/** build", {
	shell: true,
	stdio: "inherit",
});

console.log("合并打包结果");
await fs.rm("dist", { recursive: true, force: true });
await fs.mkdir("dist", { recursive: true });
await Promise.all([
	fs.cp("apps/core/dist", "dist", { recursive: true }),
	fs.cp("apps/core/audio", "dist/audio", { recursive: true }),
	fs.cp("apps/core/image", "dist/image", { recursive: true }),
	fs.cp("docs", "dist/docs", { recursive: true }),
	fs.cp(".nomedia", "dist/.nomedia"),
	fs.cp("LICENSE", "dist/LICENSE"),
	fs.cp("README.md", "dist/README.md"),
	(async () => {
		const extensions = await fs.readdir("packages/extension", { withFileTypes: true });
		await Promise.all(
			extensions.map(async i => {
				if (!i.isDirectory()) return;
				if (
					await fs.access(`packages/extension/${i.name}/dist`).then(
						() => true,
						() => false
					)
				) {
					await fs.cp(`packages/extension/${i.name}/dist`, `dist/extension/${i.name}`, { recursive: true });
				} else {
					await fs.cp(`packages/extension/${i.name}`, `dist/extension/${i.name}`, { recursive: true });
				}
			})
		);
	})(),
]);
