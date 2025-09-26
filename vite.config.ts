import { defineConfig } from "vite";
import path from "path";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
	root: ".",
	resolve: {
		alias: {
			"@": path.resolve(import.meta.dirname, "./"),
		},
        extensions: ['.tsx', '.ts', '.js'],
	},
	plugins: [
		vue(),
	],
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
		},
	},
});
