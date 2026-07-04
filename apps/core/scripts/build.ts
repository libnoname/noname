import { build } from "vite";
import { join, dirname } from "path";
import { existsSync, readdirSync } from "fs";
import { Target, viteStaticCopy } from "vite-plugin-static-copy";
import generateImportMap from "./vite-plugin-importmap";
import jit from "@noname/jit";

import { moderned_characters } from "../game/config.json";
const root = join(import.meta.dirname, "..");

/**
 * 构建脚本入口。
 *
 * 负责收集本体构建需要复制的静态资源、各类单独构建包体的入口，
 * 然后依次执行本体构建和包体构建。
 */
async function main() {
	/**
	 * 编译目标
	 *
	 * 目前无名杀的目标为`Chromium >= 91 || Safari >=16.4.0`
	 */
	const target = ["chrome91", "safari16.4"];

	/**
	 * 无名杀所使用的导入映射（import map，翻译来源MDN）
	 */
	const importMap: Record<string, string> = {
		noname: "/noname.js",
		vue: "vue/dist/vue.esm-browser.js",
		"pinyin-pro": "pinyin-pro",
		dedent: "dedent",
		// jszip: "jszip",
	};

	/**
	 * 本体编译过程需要直接复制的文件
	 */
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

	/**
	 * 需要脱离本体单独输出的包体，无名杀中即为武将包、卡牌包和模式
	 *
	 * Individual译为“个体”，不过此处只是找个后续不太用得上的单词
	 */
	const individuals: Record<IndividualType, IndividualContent[]> = {
		character: [],
		mode: [{ name: "identity", index: "mode/identity.js", moderned: false }],
		card: [],
	};

	// #3446 - 通过moderned_characters配置更新character内容
	for (const name of moderned_characters) {
		let index = `character/${name}/index.ts`
		if (!existsSync(join(root, index))) {
			index = `character/${name}/index.js`;
		}
		individuals.character.push({
			name,
			index,
			moderned: true,
		});
	}

	// #3941 - 卡牌包均重写完毕
	for (const file of readdirSync(join(root, "card"))) {
		individuals.card.push({
			name: getEntryName(file),
			index: `card/${file}`,
			moderned: false,
		});
	}

	// 将单独构建的包体全部复制到dist/src中
	for (const [type, content] of Object.entries(individuals)) {
		for (const { index, moderned } of content) {
			const src = moderned ? dirname(index) : index;
			const dest = `src/${type}`;
			staticModules.push({ src, dest });
		}
	}

	// 编译无名杀本体
	await buildSelf(target, importMap, staticModules);

	// 编译脱离本体单独输出的包体
	for (const [type, content] of Object.entries(individuals)) {
		// 构建vite编译输入
		const input: Record<string, string> = {};
		for (const { name, index } of content) {
			input[name] = index;
		}

		// 获取需要单独复制的文件
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

/**
 * 构建无名杀本体。
 *
 * @param target Vite/Rollup的浏览器编译目标
 * @param importMap 写入最终产物的导入映射
 * @param copies 本体构建阶段需要直接复制到dist的文件
 */
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

/**
 * 构建需要脱离本体单独输出的包体。
 *
 * @param type 包体类型，同时也是输出目录名
 * @param target Vite/Rollup的浏览器编译目标
 * @param input Rollup入口配置，key会成为最终输出文件名
 * @param importMap 用于决定哪些依赖在单独构建时保持外部引用
 * @param copies 单独构建阶段需要原样复制的同类包体
 */
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

/**
 * 从顶层文件或目录名中取得可与Rollup入口配置对比的入口名。
 *
 * @example
 * getEntryName("identity.js") // "identity"
 * getEntryName("guozhan") // "guozhan"
 */
function getEntryName(file: string): string {
	return file.replace(/\.(js|ts)$/, "");
}

/** 支持按包体维度处理的目录类型。 */
type IndividualType = "character" | "card" | "mode";

/** 单个需要独立构建的包体配置。 */
interface IndividualContent {
	/** 包体名称，同时作为 Rollup input 的 key 使用。 */
	name: string;
	/** 包体入口文件，使用相对于 apps/core 的路径。 */
	index: string;
	/** 是否属于已经现代化为目录入口的包体。 */
	moderned: boolean;
}

if (import.meta.main) {
	await main();
}
