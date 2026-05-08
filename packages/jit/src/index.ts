import { Plugin } from "vite";
import fs from "fs";
import path from "path";

export default function vitePluginJIT(): Plugin {
	let root = process.cwd();
	let isBuild = false;

	return {
		name: "vite-plugin-jit",

		configResolved(config) {
			isBuild = config.command === "build";
			root = config.root;
		},

		transformIndexHtml(html) {
			if (!isBuild) return;
			const script = fs.readFileSync(path.resolve(import.meta.dirname, "entry.js")).toString();
			return {
				html,
				tags: [
					{
						tag: "script",
						attrs: {
							type: "module",
						},
						children: script,
						injectTo: "head-prepend",
					},
				],
			};
		},
		closeBundle() {
			fs.copyFileSync(
				path.resolve(import.meta.dirname, "service-worker/index.js"),
				path.resolve("dist/service-worker.js")
			);
			fs.copyFileSync(
				path.resolve(import.meta.dirname, "public/jit-test.ts"),
				path.resolve("dist/jit-test.ts")
			);
		},
	};
}
