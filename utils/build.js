import { build } from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy";

await build({
	//继承vite.config.ts
	build: {
		sourcemap: "inline",
		rollupOptions: {
			preserveEntrySignatures: "strict",
			treeshake: false,
			input: {
				main: "index.html",
				// "noname-server": 'noname-server.js',
			},
			output: {
				preserveModules: true, // 保留文件结构
				// preserveModulesRoot: "src", // 指定根目录

				// 去掉 hash
				entryFileNames: "[name].js", // 入口文件
				chunkFileNames: "[name].js", // 代码分块
				assetFileNames: "[name][extname]", // 静态资源
			},
		},
	},
	plugins: [
		viteStaticCopy({
			targets: [
				{ src: "character", dest: "" },
				{ src: "card", dest: "" },
				// { src: "extension", dest: "" },
				{ src: "extension/boss", dest: "extension" },
				{ src: "extension/cardpile", dest: "extension" },
				{ src: "extension/coin", dest: "extension" },
				{ src: "mode", dest: "" },
				{ src: "layout", dest: "" },
				{ src: "font", dest: "" },
				{ src: "theme", dest: "" },
				// step 无法编译，需要覆盖
				{ src: "noname/library/element/content.js", dest: "noname/library/element" },
			],
		}),
	],
});
