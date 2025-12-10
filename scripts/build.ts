import { build } from "vite";
import { Target, viteStaticCopy } from "vite-plugin-static-copy";
import generateImportMap from "../jit/vite-plugin-importmap";
import jit from "../jit/vite-plugin-jit";
import minimist from "minimist";
import { build as esbuild } from "esbuild";
import { generateTestPack } from "./generateTestPack";
import fs from "fs-extra";
import path from "path";

const argv = minimist(process.argv.slice(2));

const importMap: Record<string, string> = {
	noname: "/noname.js",
	vue: "vue/dist/vue.esm-browser.js",
	"pinyin-pro": "pinyin-pro",
	"dedent": "dedent",
	// jszip: "jszip",
};

const staticModules: Target[] = [
	{ src: "character", dest: "" },
	{ src: "card", dest: "" },
	{ src: "docs", dest: "" },
	{ src: "mode", dest: "" },
	{ src: "layout", dest: "" },
	{ src: "font", dest: "" },
	{ src: "theme", dest: "" },
	{ src: "game", dest: "" },
	{ src: "LICENSE", dest: "" },
	{ src: "README.md", dest: "" },
	{ src: ".nomedia", dest: "" },
	// step 无法编译，需要覆盖
	// 重构之后请删除
	{ src: "noname/get/pinyins/index.js", dest: "noname/get/pinyins" },
	{ src: "noname/library/element/content.js", dest: "noname/library/element" },
	{ src: "noname/library/skill.js", dest: "noname/library" },
];

//完整包
if (argv.mode) {
	staticModules.push({ src: "audio", dest: "" });
	staticModules.push({ src: "image", dest: "" });
	staticModules.push({ src: "extension", dest: "" });
	staticModules.push(
		...[
			{ src: "jit", dest: "src" },
			{ src: "noname", dest: "src" },
			{ src: "typings", dest: "src" },
			{ src: "noname.js", dest: "src" },
			{ src: "noname-server.cts", dest: "src" },
		]
	);
} else {
	staticModules.push({ src: "extension/boss", dest: "extension" });
	staticModules.push({ src: "extension/cardpile", dest: "extension" });
	staticModules.push({ src: "extension/coin", dest: "extension" });
}

// 继承vite.config.ts
await build({
	build: {
		// 需要覆写map文件，必须外置
		sourcemap: argv.sourcemap || false,
		minify: false,
		rollupOptions: {
			preserveEntrySignatures: "strict",
			treeshake: false,
			external: ["vue"],
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
	plugins: [
		viteStaticCopy({ targets: staticModules }),
		generateImportMap(importMap),
		jit(),
		(() => {
			let hasSourceMap = false;
			return {
				name: "rewrite-sourcemap-path",
				enforce: "post",
				apply: "build",

				configResolved(config) {
					hasSourceMap = !!config.build.sourcemap;
				},
				/**
				 * 重写sourcemap的sources路径
				 * 将指向根目录变为指向dist/目录，以适配外部平台
				 * @example
				 * 打包结果：dist/a/bundle.js 指向 a/b/c.ts
				 * 转换：../../a/b/c.ts -> b/c.ts
				 */
				writeBundle(_, bundle) {
					if (!hasSourceMap) return;
					for (const [fileName, chunk] of Object.entries(bundle)) {
						if (!fileName.endsWith(".map") || chunk.type !== "asset") continue;

						try {
							const mapPath = path.resolve("dist", fileName);
							const jsDir = path.dirname(fileName.replace(/\.map$/, ""));
							const map = JSON.parse(chunk.source as string);

							map.sources = map.sources.map((src: string) => path.relative(jsDir, src.replace(/^(\.\.\/)+/, "")));

							fs.writeFileSync(mapPath, JSON.stringify(map));
						} catch (err) {
							console.warn(`rewrite-sourcemap-path: failed for ${fileName}`, err);
						}
					}
				},
			};
		})(),
	],
});

await esbuild({
	entryPoints: ["noname-server.cts"],
	outfile: "dist/noname-server.cjs",
	bundle: true,
	platform: "node",
});

if (argv.zip) {
	generateTestPack(argv.mode == "diff");
}
