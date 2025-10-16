import { normalizePath, Plugin } from "vite";
import { resolve } from "path";
import fs from "fs";
import path from "path";

export default function vitePluginJIT(importMap: Record<string, string> = {}): Plugin {
	let root = process.cwd();
	let isBuild = false;
	const resolvedImportMap: Record<string, string> = {};

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
			for (const key in importMap) {
				const resolved = await this.resolve(importMap[key], undefined, { skipSelf: true });
				if (resolved?.id) {
					resolvedImportMap[key] = normalizePath("/" + path.relative(root, resolved.id));
				} else {
					resolvedImportMap[key] = importMap[key];
				}
			}
		},

		closeBundle() {
			const output = path.resolve("dist/jit/import-map.js");
			fs.mkdirSync(path.dirname(output), { recursive: true });
			fs.writeFileSync(output, "export default " + JSON.stringify(resolvedImportMap, null, 2));
			this.warn(`[vite:jit-importmap] Wrote ${output}`);

			fs.mkdirSync(path.dirname(path.resolve("dist/jit/test/canUse.ts")), { recursive: true });
			fs.copyFileSync(path.resolve("jit/test/canUse.ts"), path.resolve("dist/jit/test/canUse.ts"));
		},

		transformIndexHtml(html) {
			if (!isBuild) return;
			const script = `<script type="importmap">\n${JSON.stringify({ imports: resolvedImportMap }, null, 2)}\n</script>`;
			return html.replace("</head>", `${script}\n</head>`);
		},
	};
}
