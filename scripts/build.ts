import { build } from "vite";
import { Target, viteStaticCopy } from "vite-plugin-static-copy";
import minimist from "minimist";
import { build as esbuild } from "esbuild";
import { execSync } from "node:child_process";
import path from "path";
import fs from "fs";
import JSZip from "jszip";

const argv = minimist(process.argv.slice(2));

const getDiffResources = () => {
	const latestTag = execSync("git describe --tags --abbrev=0").toString().trim();
	const diff = execSync(`git diff --name-only ${latestTag}...HEAD`).toString();
	return diff
		.split("\n")
		.filter(file => {
			if (!file.startsWith("audio") && !file.startsWith("image")) return false;
			const filePath = path.join(import.meta.dirname, "../", file);
			return fs.existsSync(filePath) && fs.lstatSync(filePath).isFile();
		})
		.map(file => ({
			src: file,
			dest: path.dirname(file),
		}));
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

const sourceCode: Target[] = [
	{ src: "jit", dest: "src" },
	{ src: "noname", dest: "src" },
	{ src: "typings", dest: "src" },
	{ src: "noname.js", dest: "src" },
	{ src: "noname-server.cts", dest: "src" },
];

//完整包
if (argv.mode == "full") {
	staticModules.push({ src: "audio", dest: "" });
	staticModules.push({ src: "image", dest: "" });
	staticModules.push({ src: "extension", dest: "" });
	staticModules.push({ src: "scripts/noname-server.exe", dest: "" });
	staticModules.push(...sourceCode);
}
//离线包
else if (argv.mode == "diff") {
	staticModules.push(...getDiffResources());
	staticModules.push({ src: "extension/boss", dest: "extension" });
	staticModules.push({ src: "extension/cardpile", dest: "extension" });
	staticModules.push({ src: "extension/coin", dest: "extension" });
	staticModules.push({ src: "scripts/noname-server.exe", dest: "" });
	staticModules.push(...sourceCode);
}
//无资源包
else {
	staticModules.push({ src: "extension/boss", dest: "extension" });
	staticModules.push({ src: "extension/cardpile", dest: "extension" });
	staticModules.push({ src: "extension/coin", dest: "extension" });
}

// 继承vite.config.ts
await build({
	build: {
		// 需要覆写map文件，必须外置
		sourcemap: argv.sourcemap || false,
	},
	plugins: [
		viteStaticCopy({ targets: staticModules }),
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

// 打包zip到根目录
if (argv.zip) {
	const formatDate = (date = new Date()) => {
		const year = date.getFullYear();
		const month = String(date.getMonth() + 1).padStart(2, "0"); // getMonth() 返回的是0-11，所以需要加1
		const day = String(date.getDate()).padStart(2, "0");
		return `${year}${month}${day}`;
	};

	const addFolderToZip = (zip: JSZip, folderPath: string) => {
		const files = fs.readdirSync(folderPath);

		files.forEach(fileName => {
			const filePath = path.join(folderPath, fileName);
			const fileStat = fs.statSync(filePath);

			if (fileStat.isDirectory()) {
				// 递归添加子文件夹
				const newZipFolder = zip.folder(fileName);
				addFolderToZip(newZipFolder, filePath);
			} else {
				// 添加文件
				const fileData = fs.readFileSync(filePath);
				zip.file(fileName, fileData);
			}
		});
	};

	const target = path.join(import.meta.dirname, "../", `测试包-${formatDate()}.zip`);
	console.log("打包" + target);
	const zip = new JSZip();
	addFolderToZip(zip, path.join(import.meta.dirname, "../dist"));
	const result = zip.generate({ type: "nodebuffer" });
	fs.writeFileSync(target, result);
}
