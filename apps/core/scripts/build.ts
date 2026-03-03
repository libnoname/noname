import { build } from "vite";
import { join, dirname } from "path";
import { moveSync } from "fs-extra/esm";
import { fileURLToPath } from "node:url";
import { existsSync, readdirSync, rmdirSync } from "fs";
import { Target, viteStaticCopy } from "vite-plugin-static-copy";
import generateImportMap from "./vite-plugin-importmap";
import jit from "@noname/jit";

import { moderned_characters } from "../game/config.json";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const root = join(__dirname, "..");

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
for (const file of readdirSync(charaDist)) {
	if (moderned_characters.includes(file)) {
		// 考虑后续可能存在的ts版本，优先使用ts文件
		const ts = existsSync(join(charaDist, file, "index.ts"));
		// 依照vite入口规范，使用相对于根目录的路径作为输入
		// 后续可直接用于vite的input配置，无需再进行路径转换
		charaInputs[file] = `character/${file}/index.${ts ? "ts" : "js"}`;
		continue;
	}
	// 剩下的武将包未完成进行异步化，可能仍然存在step content，故直接复制
	// 此外，该过程也会将位于character文件夹的单文件复制过去
	staticModules.push({ src: `character/${file}`, dest: "character" });
}

// 打包无名杀本体
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
// 由于武将包拥有更多的“外部包”，且最终需要打包成单文件，因此需要单独构建
await build({
	build: {
		sourcemap: false,
		minify: false,
		// 由于outDir会被清空，因此先输出到临时目录，待打包完成后再移动到最终目录
		outDir: `dist/character/.tmp`,
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
});
// 移动武将包打包结果
const distChara = join(root, "dist/character");
const tmp = join(distChara, ".tmp");
for (const file of readdirSync(tmp)) {
	moveSync(join(tmp, file), join(distChara, file));
}
// 现在tmp目录应该为空，如果仍有文件说明存在异常情况，使用rmdirSync而非rmSync以即使发现问题
rmdirSync(tmp);
