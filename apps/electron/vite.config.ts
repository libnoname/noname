import { defineConfig } from "vite";
import electron from "vite-plugin-electron";

export default defineConfig({
	resolve: {
		extensions: [".ts", ".mts", ".cts", ".js"],
	},
	plugins: [
		electron([
			{
				entry: "app/main.ts",
				vite: {
					build: {
						outDir: "dist/app/",
						minify: false,
						// rollupOptions: {
						// 	output: {
						// 		preserveModules: true,
						// 	},
						// },
					},
				},
			},
			{
				entry: "app/preload.ts",
				onstart({ reload }) {
					// Notify the Renderer process to reload the page when the Preload scripts build is complete,
					// instead of restarting the entire Electron App.
					reload();
				},
				vite: {
					build: {
						outDir: "dist/app/",
						// rollupOptions: {
						// 	output: {
						// 		preserveModules: true,
						// 	},
						// },
					},
				},
			},
		]),
	],
});
