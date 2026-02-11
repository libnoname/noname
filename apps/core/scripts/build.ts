import { build } from "vite";
import { Target, viteStaticCopy } from "vite-plugin-static-copy";
import generateImportMap from "./vite-plugin-importmap";
import jit from "@noname/jit";

const importMap: Record<string, string> = {
	noname: "/noname.js",
	vue: "vue/dist/vue.esm-browser.js",
	"pinyin-pro": "pinyin-pro",
	dedent: "dedent",
	// jszip: "jszip",
};

const staticModules: Target[] = [
	{ src: "character", dest: "" },
	{ src: "card", dest: "" },
	{ src: "mode", dest: "" },
	{ src: "layout", dest: "" },
	{ src: "font", dest: "" },
	{ src: "theme", dest: "" },
	{ src: "game", dest: "" },
	{ src: "noname", dest: "src" },
	{ src: "typings", dest: "src" },
	{ src: "noname.js", dest: "src" },
];

// 继承vite.config.ts
// 合并会导致开发服务器依赖失效
await build({
	build: {
		sourcemap: false,
		minify: false,
		rollupOptions: {
			preserveEntrySignatures: "strict",
			treeshake: false,
			external: ["vue"],
			input: {
				index: "index.html",
				noname: "noname.js",
			},
			output: {
				preserveModules: true, // 保留文件结构
				preserveModulesRoot: "./",

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
	plugins: [viteStaticCopy({ targets: staticModules }), generateImportMap(importMap), jit()],
});
