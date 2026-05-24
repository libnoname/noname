import { build } from "vite";
import { join } from "path";
import { moveSync } from "fs-extra/esm";
import { existsSync, readdirSync, rmdirSync } from "fs";
import { Target, viteStaticCopy } from "vite-plugin-static-copy";
import generateImportMap from "./vite-plugin-importmap";
import jit from "@noname/jit";

import { moderned_characters } from "../game/config.json";
const root = join(import.meta.dirname, "..");

const target = ["chrome91", "safari16.4"];
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

const charaDist = join(root, "character");
const charaInputs: Record<string, string> = {};
const charaCopys: Target[] = [];
for (const file of readdirSync(charaDist)) {
	if (moderned_characters.includes(file)) {
		// 考虑后续可能存在的ts版本，优先使用ts文件
		const ts = existsSync(join(charaDist, file, "index.ts"));
		// 依照vite入口规范，使用相对于根目录的路径作为输入
		// 后续可直接用于vite的input配置，无需再进行路径转换
		charaInputs[file] = `character/${file}/index.${ts ? "ts" : "js"}`;
		staticModules.push({
			src: `character/${file}`,
			dest: "src/character",
		});
		continue;
	}
	// 剩下的武将包未完成进行异步化，可能仍然存在step content，故直接复制
	// 此外，该过程也会将位于character文件夹的单文件复制过去
	charaCopys.push({ src: `character/${file}`, dest: "" });
}

// 打包无名杀本体
// 继承vite.config.ts
// 合并会导致开发服务器依赖失效
await build({
	build: {
		target,
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
// 由于武将包拥有更多的“外部包”，且最终需要打包成单文件，因此需要单独构建
await build({
	build: {
		target,
		sourcemap: false,
		minify: false,
		outDir: `dist/character`,
		rollupOptions: {
			preserveEntrySignatures: "strict",
			treeshake: true,
			external: Object.keys(importMap),
			input: charaInputs,
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
	plugins: [viteStaticCopy({ targets: charaCopys })],
});
