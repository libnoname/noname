import { build } from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy";
import minimist from "minimist";
import { build as esbuild } from "esbuild";

const argv = minimist(process.argv.slice(2), {
	boolean: true,
});

const staticModules = [
	{ src: "character", dest: "" },
	{ src: "card", dest: "" },
	{ src: "mode", dest: "" },
	{ src: "layout", dest: "" },
	{ src: "font", dest: "" },
	{ src: "theme", dest: "" },
	{ src: "game", dest: "" },
	// step 无法编译，需要覆盖
	// 重构之后请删除
	{ src: "noname/library/element/content.js", dest: "noname/library/element" },
	{ src: "noname/library/skill.js", dest: "noname/library" },
];
if (argv.full) {
	staticModules.push({ src: "audio", dest: "" });
	staticModules.push({ src: "image", dest: "" });
	staticModules.push({ src: "extension", dest: "" });
} else {
	staticModules.push({ src: "extension/boss", dest: "extension" });
	staticModules.push({ src: "extension/cardpile", dest: "extension" });
	staticModules.push({ src: "extension/coin", dest: "extension" });
}

// 继承vite.config.ts
await build({
	plugins: [viteStaticCopy({ targets: staticModules })],
});

await esbuild({
	entryPoints: ["noname-server.cts"],
	outfile: "dist/noname-server.cjs",
	bundle: true,
	platform: "node"
});
