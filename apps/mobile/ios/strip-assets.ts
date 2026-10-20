import { existsSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const publicDir = resolve(import.meta.dirname, "App/App/public");

for (const dir of ["audio/skill", "audio/die"]) {
	rmSync(resolve(publicDir, dir), { recursive: true, force: true });
}

const characterDir = resolve(publicDir, "image/character");
for (const name of readdirSync(characterDir)) {
	if (!name.startsWith("default_silhouette_")) {
		rmSync(resolve(characterDir, name), { recursive: true, force: true });
	}
}

// 下载清单保留全部素材，资源清单只保留包内实际存在的文件。
const manifestPath = resolve(publicDir, "asset-manifest.json");
const manifest: string[] = JSON.parse(readFileSync(manifestPath, "utf8"));
writeFileSync(manifestPath, `${JSON.stringify(manifest.filter(path => existsSync(resolve(publicDir, path))))}\n`);
