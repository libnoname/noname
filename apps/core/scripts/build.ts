import { build } from "vite";
import { join, dirname } from "path";
import { existsSync, readdirSync } from "fs";
import { Target, viteStaticCopy } from "vite-plugin-static-copy";
import generateImportMap from "./vite-plugin-importmap";
import jit from "@noname/jit";

import { moderned_characters } from "../game/config.json";
const root = join(import.meta.dirname, "..");

async function main() {
	// 编译目标，目前无名杀的目标为Chromium >= 91 || Safari >=16.4.0
	const target = ["chrome91", "safari16.4"];

	// 无名杀所使用的导入映射（import map，翻译来源MDN）
	const importMap: Record<string, string> = {
		noname: "/noname.js",
		vue: "vue/dist/vue.esm-browser.js",
		"pinyin-pro": "pinyin-pro",
		dedent: "dedent",
		// jszip: "jszip",
	};

	// 编译过程需要直接复制的文件
	const staticModules: Target[] = [
		// { src: "character", dest: "" },
		// { src: "card", dest: "" },
		// { src: "mode", dest: "" },
		{ src: "layout", dest: "" },
		{ src: "font", dest: "" },
		{ src: "theme", dest: "" },
		{ src: "game", dest: "" },
		{ src: "noname", dest: "src" },
		{ src: "typings", dest: "src" },
		{ src: "noname.js", dest: "src" },
	];

	// 需要单独构建的包体，false表示暂未存在可以构建的文件，后续会直接复制
	const individuals: Record<IndividualType, false | IndividualContent[]> = {
		character: [],
		mode: [{ name: "identity", index: "mode/identity.js", moderned: false }],
		card: false,
	};

	// #3446 - 通过moderned_characters配置更新character内容
	for (const name of moderned_characters) {
		let index = `character/${name}/index.ts`
		if (!existsSync(join(root, index))) {
			index = `character/${name}/index.js`;
		}
		(<IndividualContent[]>individuals.character).push({
			name,
			index,
			moderned: true,
		});
	}

	// 将单独构建的包体全部复制到dist/src中，直接复制的包体直接复制
	for (const [type, content] of Object.entries(individuals)) {
		if (content === false) {
			staticModules.push({ src: type, dest: "" });
			continue;
		}

		for (const { index, moderned } of content) {
			const src = moderned ? dirname(index) : index;
			const dest = `src/${type}`;
			staticModules.push({ src, dest });
		}
	}

	// 编译无名杀本体
	await buildSelf(target, importMap, staticModules);

	// 编译单独包体
	for (const [type, content] of Object.entries(individuals)) {
		if (content === false) {
			continue;
		}

		// 构建vite编译输入
		const input: Record<string, string> = {};
		for (const { name, index } of content) {
			input[name] = index;
		}

		// 构建需要单独复制的文件
		const copies: Target[] = [];
		for (const file of readdirSync(join(root, type))) {
			if (getEntryName(file) in input) {
				continue;
			}

			copies.push({ src: `${type}/${file}`, dest: "" });
		}

		await buildIndividual(type, target, input, importMap, copies);
	}
}

async function buildSelf(target: string | string[], importMap: Record<string, string>, copies: Target[]) {
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
		plugins: [viteStaticCopy({ targets: copies }), generateImportMap(importMap), jit()],
	});
}

async function buildIndividual(type: string, target: string | string[], input: Record<string, string>, importMap: Record<string, string>, copies: Target[]) {
	await build({
		build: {
			target,
			sourcemap: false,
			minify: false,
			outDir: `dist/${type}`,
			rollupOptions: {
				preserveEntrySignatures: "strict",
				treeshake: true,
				external: Object.keys(importMap),
				input,
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
		plugins: [viteStaticCopy({ targets: copies })],
	});
}

function getEntryName(file: string) {
	return file.replace(/\.(js|ts)$/, "");
}

type IndividualType = "character" | "card" | "mode";

interface IndividualContent {
	name: string;
	index: string;
	moderned: boolean;
}

await main();
