import { defineConfig } from "vite";
import path from "node:path";
import vue from "@vitejs/plugin-vue";
import analyze from "rollup-plugin-analyzer";
import fs from "node:fs";
import serveStatic from 'serve-static'

export default defineConfig({
	root: ".",
	build: {
		rollupOptions: {
			plugins: [
				analyze({
					summaryOnly: false,
					filter: m => !m.id.includes("node_modules"),
					writeTo: analysis => {
						fs.writeFileSync("dist/analyze.txt", analysis, "utf-8");
					},
				}),
			],
		},
	},
	server: {
		open: true,
		host: "127.0.0.1",
		port: 8080,
		proxy: {
			"/checkFile": "http://127.0.0.1:8089",
			"/checkDir": "http://127.0.0.1:8089",
			"/readFile": "http://127.0.0.1:8089",
			"/readFileAsText": "http://127.0.0.1:8089",
			"/writeFile": "http://127.0.0.1:8089",
			"/removeFile": "http://127.0.0.1:8089",
			"/getFileList": "http://127.0.0.1:8089",
			"/createDir": "http://127.0.0.1:8089",
			"/removeDir": "http://127.0.0.1:8089",
		}
	},
	plugins: [
        vue(),
		// {
		// 	name: "serve-plugins",
		// 	configureServer(server) {
		// 		server.middlewares.use("/card", serveStatic(path.resolve(__dirname, "./card")));
		// 		server.middlewares.use("/character", serveStatic(path.resolve(__dirname, "./character")));
		// 		server.middlewares.use("/extension", serveStatic(path.resolve(__dirname, "./extension")));
		// 		server.middlewares.use("/mode", serveStatic(path.resolve(__dirname, "./mode")));
		// 	},
		// },
	],
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./"),
		},
		extensions: [".tsx", ".ts", ".js"],
	},
});
