import { normalizePath, Plugin } from "vite";
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
			for (const key in importMap) {
				try {
					const resolved = require.resolve(importMap[key]);
					resolvedImportMap[key] = normalizePath("/" + path.relative(root, resolved));
				} catch (e) {
					resolvedImportMap[key] = importMap[key];
				}
			}
		},

		closeBundle() {
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
		},

		transformIndexHtml(html) {
			if (!isBuild) return;
			const script = `<script type="importmap">\n${JSON.stringify({ imports: resolvedImportMap }, null, 2)}\n</script>`;
			return html.replace("</head>", `${script}\n</head>`);
		},
	};
}