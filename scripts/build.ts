import { build } from "vite";
import { Target, viteStaticCopy } from "vite-plugin-static-copy";
import generateImportMap from "../jit/vite-plugin-importmap";
import jit from "../jit/vite-plugin-jit";
import minimist from "minimist";
import { build as esbuild } from "esbuild";
import { execSync } from "node:child_process";
import path from "node:path/posix";
import fs from "fs-extra";
import JSZip from "jszip";

const argv = minimist(process.argv.slice(2));

const importMap: Record<string, string> = {
	"@noname": "/noname.js",
	vue: "vue/dist/vue.esm-browser.js",
	"pinyin-pro": "pinyin-pro",
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
	{ src: "LICENSE", dest: "" },
	{ src: "README.md", dest: "" },
	// step 无法编译，需要覆盖
	// 重构之后请删除
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
			input: {
				index: "index.html",
			},
			output: {
				preserveModules: true, // 保留文件结构

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
		jit(importMap),
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
	interface FileList {
		added: Set<string>;
		modified: Set<string>;
		deleted: Set<string>;
	}

	const getDiff = (baseRef?: string, targetRef = "HEAD"): FileList => {
		baseRef ??= execSync("git describe --tags --abbrev=0").toString().trim();
		const output = execSync(`git diff --name-status ${baseRef}...${targetRef}`).toString().trim();
		const fileList: FileList = { added: new Set(), modified: new Set(), deleted: new Set() };

		if (!output) return fileList;

		for (const line of output.split("\n")) {
			const [status, filePath] = line.trim().split(/\s+/);

			switch (status[0]) {
				case "A":
					fileList.added.add(filePath);
					break;
				case "M":
					fileList.modified.add(filePath);
					break;
				case "D":
					fileList.deleted.add(filePath);
					break;
				case "R": {
					const [, oldPath, newPath] = line.trim().split(/\s+/);
					fileList.deleted.add(oldPath);
					fileList.added.add(newPath);
					break;
				}
				default:
					break;
			}
		}

		return fileList;
	};
	
	const formatDate = (date = new Date()) => {
		const year = date.getFullYear();
		const month = String(date.getMonth() + 1).padStart(2, "0"); // getMonth() 返回的是0-11，所以需要加1
		const day = String(date.getDate()).padStart(2, "0");
		return `${year}${month}${day}`;
	};

	const addFolderToZip = (zip: JSZip, base: string, filter: (p: string) => boolean = () => true) => {
		const _addFolderToZip = (zip: JSZip, folderPath: string) => {
			const files = fs.readdirSync(path.join(base, folderPath));

			files.forEach(fileName => {
				const filePath = path.join(folderPath, fileName);
				const fileStat = fs.statSync(path.join(base, filePath));

				if (fileStat.isDirectory()) {
					const folder = zip.folder(fileName);
					_addFolderToZip(folder, filePath);
					if (!Object.keys(folder.files).some(i => i !== folder.root && i.startsWith(folder.root))) {
						zip.remove(fileName);
					}
				} else {
					if (!filter(filePath)) return;
					const fileData = fs.readFileSync(path.join(base, filePath));
					zip.file(fileName, fileData);
				}
			});
		};
		_addFolderToZip(zip, "");
	};

	const diff = getDiff();
	console.log("打包 " + `测试包-${formatDate()}.zip`);
	const zip = new JSZip();
	let filter: (p: string) => boolean = () => true;
	if (argv.mode == "diff") {
		filter = p => {
			if (["audio", "image", "font"].some(i => p.startsWith(i))) {
				return diff.added.has(p) || diff.modified.has(p);
			}
			if (p.startsWith("extension") && !["extension/boss", "extension/cardpile", "extension/coin"].some(i => p.startsWith(i))) {
				return diff.added.has(p) || diff.modified.has(p);
			}
			if (p.startsWith("noname-server.exe")) return false;
			return true;
		};
	}
	addFolderToZip(zip, path.join(process.cwd(), "dist"), filter);
	const result = zip.generate({ type: "nodebuffer" });
	fs.ensureDirSync(path.join(process.cwd(), "output"));
	fs.writeFileSync(path.join(process.cwd(), "output", `测试包-${formatDate()}.zip`), result);
	fs.copySync(path.join(process.cwd(), "scripts/noname-server.exe"), path.join(process.cwd(), "output/noname-server.exe"));
}
