import { defineConfig } from "vite";
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
	server: {
		host: "127.0.0.1",
		port: port.client,
		fs: {
			allow: ["../.."],
		},
		proxy: {
			// 开发模式下页面由 vite 提供、文件接口经代理转发；
			// fs 服务要求本地会话凭据，代理统一注入 debug 专用标记（仅 debug 模式接受）。
			"/checkFile": { target: "http://127.0.0.1:" + port.server, headers: { "x-noname-fs-auth": "noname-fs-dev" } },
			"/checkDir": { target: "http://127.0.0.1:" + port.server, headers: { "x-noname-fs-auth": "noname-fs-dev" } },
			"/readFile": { target: "http://127.0.0.1:" + port.server, headers: { "x-noname-fs-auth": "noname-fs-dev" } },
			"/readFileAsText": { target: "http://127.0.0.1:" + port.server, headers: { "x-noname-fs-auth": "noname-fs-dev" } },
			"/writeFile": { target: "http://127.0.0.1:" + port.server, headers: { "x-noname-fs-auth": "noname-fs-dev" } },
			"/removeFile": { target: "http://127.0.0.1:" + port.server, headers: { "x-noname-fs-auth": "noname-fs-dev" } },
			"/getFileList": { target: "http://127.0.0.1:" + port.server, headers: { "x-noname-fs-auth": "noname-fs-dev" } },
			"/createDir": { target: "http://127.0.0.1:" + port.server, headers: { "x-noname-fs-auth": "noname-fs-dev" } },
			"/removeDir": { target: "http://127.0.0.1:" + port.server, headers: { "x-noname-fs-auth": "noname-fs-dev" } },
		},
	},
});
