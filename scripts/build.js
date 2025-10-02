import { build } from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy";
import minimist from "minimist";

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
	// step 无法编译，需要覆盖
	// step 废弃之后请删除
	{ src: "noname/library/element/content.js", dest: "noname/library/element" },
];
if (argv.full) {
	staticModules.push({ src: "extension/boss", dest: "extension" });
	staticModules.push({ src: "extension/cardpile", dest: "extension" });
	staticModules.push({ src: "extension/coin", dest: "extension" });
} else {
	staticModules.push({ src: "audio", dest: "" });
	staticModules.push({ src: "image", dest: "" });
	staticModules.push({ src: "extension", dest: "" });
}

await build({
	//继承vite.config.ts
	plugins: [viteStaticCopy({ targets: staticModules })],
});
