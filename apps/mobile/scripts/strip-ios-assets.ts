import { readdirSync, rmSync } from "node:fs";
import { resolve } from "node:path";

const publicDir = resolve(import.meta.dirname, "../native/ios/App/App/public");

for (const dir of ["audio/skill", "audio/die"]) {
	rmSync(resolve(publicDir, dir), { recursive: true, force: true });
}

const characterDir = resolve(publicDir, "image/character");
for (const name of readdirSync(characterDir)) {
	if (!name.startsWith("default_silhouette_")) {
		rmSync(resolve(characterDir, name), { recursive: true, force: true });
	}
}
