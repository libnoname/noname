import { defineConfig } from "vite";
import path from "path";
import fs from "fs";
import vue from "@vitejs/plugin-vue";
import jit from "./jit/vite-plugin-jit";

const port = {
	client: 8080,
	server: 8089,
};

export default defineConfig({
	root: ".",
	resolve: {
		alias: {
			"@": "/noname",
			"@noname": "/noname.js"
		},
		extensions: [".tsx", ".ts", ".js"],
	},
	build: {
		// 需要覆写map文件，必须外置，请勿更改
		sourcemap: true,
		rollupOptions: {
			preserveEntrySignatures: "strict",
			treeshake: false,
			input: {
				main: "index.html",
			},
			output: {
				preserveModules: true, // 保留文件结构
				// preserveModulesRoot: "src", // 指定根目录

				// 去掉 hash
				entryFileNames: "[name].js", // 入口文件
				chunkFileNames: "[name].js", // 代码分块
				assetFileNames: "[name][extname]", // 静态资源
			},
			onwarn(warning, warn) {
				if (warning.code === "CYCLIC_CROSS_CHUNK_REEXPORT") return;
				warn(warning);
			},
		},
	},
	plugins: [
		vue(),
		jit({
			"vue": "vue/dist/vue.esm-browser.js",
			"@": "/noname",
			"@noname": "/noname.js",
		}),
		{
			name: "rewrite-sourcemap-path",
			enforce: "post",
			apply: "build",
			/**
			 * 重写sourcemap的sources路径
			 * 将指向根目录变为指向dist/目录，以适配外部平台
			 * @example
			 * 打包结果：dist/a/bundle.js 指向 a/b/c.ts
			 * 转换：../../a/b/c.ts -> b/c.ts
			 */
			writeBundle(_, bundle) {
				for (const [fileName, chunk] of Object.entries(bundle)) {
					if (chunk.type !== "chunk") continue;

					const mapPath = path.resolve("dist", `${fileName}.map`);
					if (!fs.existsSync(mapPath)) continue;

					const map = JSON.parse(fs.readFileSync(mapPath, "utf-8"));
					const bundleDir = path.dirname(fileName);

					map.sources = map.sources.map((src: string) => path.relative(bundleDir, src.replace(/^(\.\.\/)+/, "")));

					fs.writeFileSync(mapPath, JSON.stringify(map));
				}
			},
		},
	],
	server: {
		open: true,
		host: "127.0.0.1",
		port: port.client,
		proxy: {
			"/checkFile": "http://127.0.0.1:" + port.server,
			"/checkDir": "http://127.0.0.1:" + port.server,
			"/readFile": "http://127.0.0.1:" + port.server,
			"/readFileAsText": "http://127.0.0.1:" + port.server,
			"/writeFile": "http://127.0.0.1:" + port.server,
			"/removeFile": "http://127.0.0.1:" + port.server,
			"/getFileList": "http://127.0.0.1:" + port.server,
			"/createDir": "http://127.0.0.1:" + port.server,
			"/removeDir": "http://127.0.0.1:" + port.server,
		},
	},
});
