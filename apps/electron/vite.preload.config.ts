import { defineConfig } from "vite";

export default defineConfig({
	configFile: false,
	root: process.cwd(),
	publicDir: false,
	build: {
		lib: {
			entry: "src/preload.ts",
			formats: ["es"],
			fileName: () => "preload.js",
		},
		outDir: "dist",
		emptyOutDir: false,
		copyPublicDir: false,
		minify: false,
	},
});
