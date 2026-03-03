import { join } from "path";
import { build } from "vite";
import { moveSync } from "fs-extra/esm";
import { existsSync, readdirSync, rmdirSync } from "fs";
import { Target, viteStaticCopy } from "vite-plugin-static-copy";
import generateImportMap from "./vite-plugin-importmap";
import jit from "@noname/jit";

import { moderned_characters } from "../game/config.json";

const importMap: Record<string, string> = {
	noname: "/noname.js",
	vue: "vue/dist/vue.esm-browser.js",
	"pinyin-pro": "pinyin-pro",
	dedent: "dedent",
	// jszip: "jszip",
};

const staticModules: Target[] = [
	// { src: "character", dest: "" },
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

const root = new URL("../", import.meta.url).pathname;
const character = join(root, "character");
const charaInputs: Record<string, string> = {};
for (const file of readdirSync(character)) {
	if (moderned_characters.includes(file)) {
		const ts = existsSync(join(character, file, "index.ts"));
		charaInputs[file] = `character/${file}/index.${ts ? "ts" : "js"}`;
		continue;
	}
	staticModules.push({ src: `character/${file}`, dest: "character" });
}


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

// 打包武将包
await build({
	build: {
		sourcemap: false,
		minify: false,
		outDir: `dist/character/.tmp`,
		rollupOptions: {
			preserveEntrySignatures: "strict",
			treeshake: false,
			external: Object.keys(importMap),
			input: {
				...charaInputs,
			},
			output: {
				preserveModules: false,
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
});
// 移动打包结果
const distChara = join(root, "dist/character");
const tmp = join(distChara, ".tmp");
for (const file of readdirSync(tmp)) {
	moveSync(join(tmp, file), join(distChara, file));
}
rmdirSync(tmp);
