import path from "node:path/posix";
import fs from "node:fs";

function walkFiles(dir: string): string[] {
	const out: string[] = [];
	const stack: string[] = [dir];

	while (stack.length) {
		const cur = stack.pop()!;
		let entries: fs.Dirent[];
		try {
			entries = fs.readdirSync(cur, { withFileTypes: true });
		} catch {
			continue;
		}

		for (const ent of entries) {
			const full = path.join(cur, ent.name);
			if (ent.isDirectory()) stack.push(full);
			else if (ent.isFile()) out.push(full);
		}
	}
	return out;
}

function toPosixRelative(fullPath: string, basePath: string): string {
	return path.relative(basePath, fullPath).split(path.sep).join("/");
}

function getAllResources(basePath: string): string[] {
	const folders = ["audio", "font", "image", "theme"] as const;
	const excludeDirs = ["audio/effect", "image/flappybird", "image/pointer"] as const;

	const allFiles: string[] = [];

	for (const folder of folders) {
		const folderPath = path.join(basePath, folder);
		if (!fs.existsSync(folderPath) || !fs.statSync(folderPath).isDirectory()) continue;

		const files = walkFiles(folderPath);
		for (const file of files) {
			if (path.extname(file).toLowerCase() === ".css") continue;

			const rel = toPosixRelative(file, basePath);
			if (excludeDirs.some(ex => rel.startsWith(ex + "/"))) continue;

			allFiles.push(rel);
		}
	}
	return allFiles;
}

let asset = getAllResources("apps/core/dist");
console.log("打包 测试包: output/testpack");
fs.rmSync("output/testpack", { recursive: true, force: true });
fs.mkdirSync("output/testpack", { recursive: true });

for (const i of fs.readdirSync("apps/core/dist")) {
	if (["audio", "extension", "font", "image", "theme"].includes(i)) continue;
	await fs.promises.cp(path.join("apps/core/dist", i), path.join("output/testpack", i), { recursive: true });
}
for (const i of fs.readdirSync("apps/core/dist/extension")) {
	if (!["boss", "cardpile", "coin"].includes(i)) continue;
	await fs.promises.cp(path.join("apps/core/dist/extension", i), path.join("output/testpack/extension", i), { recursive: true });
}
const oldAsset = new Set(JSON.parse(fs.readFileSync("apps/core/game/asset.json", "utf-8")));
asset = asset.filter(i => !oldAsset.has(i));
for (const i of asset) {
	await fs.promises.cp(path.join("apps/core/dist", i), path.join("output/testpack", i), { recursive: true });
}
