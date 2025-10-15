import { normalizePath, Plugin } from "vite";
import { resolve } from "path";
import { URL } from "url";
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

		// 开发环境：虚拟 /sw.js
		// 有vite自动编译，不启用
		// configureServer(server) {
		// 	if (isBuild) return;
		// 	server.middlewares.use(async (req, res, next) => {
		// 		if (req.url === "/service-worker.js") {
		// 			try {
		// 				// 编译
		// 				const result = await server.transformRequest(new URL("./service-worker.ts", import.meta.url).pathname);
		// 				if (result) {
		// 					let code = result.code;
		// 					res.setHeader("Content-Type", "application/javascript");
		// 					// sourcemap
		// 					if (result.map) {
		// 						const map = typeof result.map === "string" ? result.map : JSON.stringify(result.map);
		// 						code += `\n//# sourceMappingURL=data:application/json;base64,${Buffer.from(map).toString("base64")}`;
		// 					}
		// 					res.end(code);
		// 					return;
		// 				}
		// 			} catch (err) {
		// 				res.statusCode = 500;
		// 				res.end("JIT Service Worker load error: " + err);
		// 				return;
		// 			}
		// 		}
		// 		next();
		// 	});
		// },

		// 生产环境：单独打包
		async buildStart() {
			if (!isBuild) return;
			const swEntry = resolve(import.meta.dirname, "./service-worker.ts");
			this.emitFile({
				type: "chunk",
				id: swEntry,
				fileName: "service-worker.js",
			});
			for (const i in importMap) {
				const resolved = await this.resolve(importMap[i], undefined, { skipSelf: true });
				if (resolved?.id) {
					resolvedImportMap[i] = normalizePath("/" + path.relative(root, resolved.id));
				}
			}
		},

		closeBundle() {
			const output = path.resolve("dist/jit/import-map.js");
			fs.mkdirSync(path.dirname(output), { recursive: true });
			fs.writeFileSync(output, "export default " + JSON.stringify(resolvedImportMap, null, 2));
			this.warn(`[vite:jit-importmap] Wrote ${output}`);
			
			fs.mkdirSync(path.dirname(path.resolve("dist/jit/test/canUse.ts")), { recursive: true });
			fs.copyFileSync(path.resolve("jit/test/canUse.ts"),path.resolve("dist/jit/test/canUse.ts"))
		},
	};
}
