import { defineConfig } from "vitest/config";
import vue from "@vitejs/plugin-vue";

const port = {
	client: 8081,
	server: 8089,
};

export default defineConfig({
	appType: "mpa",
	root: ".",
	base: "./",
	resolve: {
		alias: {
			"@": "/noname",
			noname: "/noname.js",
		},
	},
	plugins: [vue()],
	test: {
		// 只收集源码下的测试，避免误收 dist/ 构建产物中的同名测试文件
		include: ["noname/**/*.test.js"],
	},
	server: {
		host: "127.0.0.1",
		port: port.client,
		fs: {
			allow: ["../.."],
		},
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
