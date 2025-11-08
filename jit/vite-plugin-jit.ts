import { normalizePath, Plugin } from "vite";
import { resolve } from "path";
import fs from "fs";
import path from "path";
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

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
				try {
					const resolved = require.resolve(importMap[key]);
					console.log(resolved)
					resolvedImportMap[key] = normalizePath("/" + path.relative(root, resolved));
				} catch (e) {
					resolvedImportMap[key] = importMap[key];
				}
			}
		},

		closeBundle() {
			const jitImportMap = path.resolve("dist/jit/import-map.js");
			fs.mkdirSync(path.dirname(jitImportMap), { recursive: true });
			fs.writeFileSync(jitImportMap, "export default " + JSON.stringify(resolvedImportMap, null, 2));

			const gameJs = path.resolve("dist/game/game.js");
			fs.mkdirSync(path.dirname(gameJs), { recursive: true });
			fs.writeFileSync(
				gameJs,
				`"use strict"
			
const im = document.createElement("script");
im.type = "importmap";
im.textContent = \`${JSON.stringify({ imports: resolvedImportMap }, null, 2)}\`;
document.currentScript.after(im);

const script = document.createElement("script");
script.type = "module";
script.src = "/noname/entry.js";
document.head.appendChild(script);
`
			);

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
