import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

const port = {
	client: 8080,
	server: 8089,
};

export default defineConfig({
	root: ".",
	resolve: {
		alias: {
			"@": "/noname",
			"noname": "/noname.js",
		},
		extensions: [".tsx", ".ts", ".js", ".vue"],
	},
	plugins: [vue()],
	server: {
		open: true,
		host: "127.0.0.1",
		port: port.client,
		proxy: {
			"/checkFile": "http://127.0.0.1:" + port.server,
			"/checkDir": "http://127.0.0.1:" + port.server,
			"/readFile": "http://127.0.0.1:" + port.server,
			"/readFileAsText": "http://127.0.0.1:" + port.server,
			"/writeFile": "http://127.0.0.1:" + port.server,
			"/removeFile": "http://127.0.0.1:" + port.server,
			"/getFileList": "http://127.0.0.1:" + port.server,
			"/createDir": "http://127.0.0.1:" + port.server,
			"/removeDir": "http://127.0.0.1:" + port.server,
		},
	},
});
