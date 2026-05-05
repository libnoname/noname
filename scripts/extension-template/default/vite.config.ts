import { defineConfig, type PluginOption } from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy";
import info from "./info.json";

export default defineConfig(({ mode }) => ({
	define: {
		"process.env.NODE_ENV": JSON.stringify(mode),
	},
	plugins: [
		viteStaticCopy({
			targets: [
				{ src: "audio", dest: "" },
				{ src: "image", dest: "" },
				{ src: "info.json", dest: "" },
				{ src: "LICENSE", dest: "" },
			],
		}) as PluginOption,
	],
	build: {
		sourcemap: true,
		minify: false,
		lib: {
			entry: {
				extension: "src/index.ts",
			},
			formats: ["es"],
		},
		outDir: `../../../apps/core/extension/${info.name}`,
		emptyOutDir: true,
		rollupOptions: {
			preserveEntrySignatures: "strict",
			external: ["noname"],
			output: {
				preserveModules: true,
				preserveModulesRoot: "./",
				entryFileNames: "[name].js",
				chunkFileNames: "[name].js",
				assetFileNames: "[name][extname]",
			},
		},
	},
}));
