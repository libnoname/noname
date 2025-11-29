import { normalizePath, Plugin } from "vite";
import { resolve } from "path";
import fs from "fs";
import path from "path";
// import { createRequire } from 'module';
// const require = createRequire(import.meta.url);

export default function vitePluginJIT(importMap: Record<string, string> = {}): Plugin {
	let root = process.cwd();
	let isBuild = false;
	// const resolvedImportMap: Record<string, string> = {};

	return {
		name: "vite-plugin-jit",

		configResolved(config) {
			isBuild = config.command === "build";
			root = config.root;
		},

		async buildStart() {
			if (!isBuild) return;
			const swEntry = resolve(import.meta.dirname, "./service-worker.ts");
			this.emitFile({
				type: "chunk",
				id: swEntry,
				fileName: "service-worker.js",
			});
			// for (const key in importMap) {
			// 	try {
			// 		const resolved = require.resolve(importMap[key]);
			// 		resolvedImportMap[key] = normalizePath("/" + path.relative(root, resolved));
			// 	} catch (e) {
			// 		resolvedImportMap[key] = importMap[key];
			// 	}
			// }
		},

		closeBundle() {
			fs.mkdirSync(path.resolve("dist/jit"), { recursive: true });
			// fs.writeFileSync(path.resolve("dist/jit/import-map.json"), JSON.stringify(resolvedImportMap, null, 2));
			fs.copyFileSync(path.resolve(import.meta.dirname, "canUse.ts"), path.resolve("dist/jit/canUse.ts"));
		},
	};
}
