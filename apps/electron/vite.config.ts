import { defineConfig } from "vite";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import type { Plugin } from "vite";
import electron from "vite-plugin-electron";

const gamePreloadPath = resolve(process.cwd(), "dist/preload.js");
const gamePreload: Plugin = {
	name: "noname-game-preload",
	enforce: "pre",
	configureServer(server) {
		server.middlewares.use((request, response, next) => {
			const pathname = request.url?.split("?", 1)[0];
			if (pathname !== "/preload.js") {
				next();
				return;
			}

			try {
				const content = readFileSync(gamePreloadPath);
				response.statusCode = 200;
				response.setHeader("Content-Type", "application/javascript; charset=utf-8");
				response.setHeader("Cache-Control", "no-store");
				response.end(content);
			} catch (error) {
				next(error);
			}
		});
	},
};

export default defineConfig({
	resolve: {
		extensions: [".ts", ".mts", ".cts", ".js"],
	},
	server: {
		host: "127.0.0.1",
		port: 8080,
		strictPort: true,
		proxy: {
			"/": {
				target: "http://127.0.0.1:8081",
				ws: true,
			},
		},
	},
	plugins: [
		gamePreload,
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
