import { build } from "vite";
import { Target, viteStaticCopy } from "vite-plugin-static-copy";
import minimist from "minimist";
import { build as esbuild } from "esbuild";

const argv = minimist(process.argv.slice(2), {
	boolean: true,
});

const staticModules: Target[] = [
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
	//源码
	staticModules.push({ src: "jit", dest: "src" });
	staticModules.push({ src: "noname", dest: "src" });
	staticModules.push({ src: "typings", dest: "src" });
	staticModules.push({ src: "noname.js", dest: "src" });
	staticModules.push({ src: "noname-compatible.js", dest: "src" });
	staticModules.push({ src: "noname-server.cts", dest: "src" });
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
	platform: "node",
});
