import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import jit from "./jit/vite-plugin-jit";

const port = {
	client: 8080,
	server: 8089,
};

export default defineConfig({
	root: ".",
	resolve: {
		alias: {
			"@": "/noname",
			"@noname": "/noname.js",
		},
		extensions: [".tsx", ".ts", ".js", ".vue"],
	},
	build: {
		minify: false,
		rollupOptions: {
			preserveEntrySignatures: "strict",
			treeshake: false,
			input: {
				index: "index.html",
			},
			output: {
				preserveModules: true, // 保留文件结构
				// preserveModulesRoot: "src", // 指定根目录

				// 去掉 hash
				entryFileNames: "[name].js", // 入口文件
				chunkFileNames: "[name].js", // 代码分块
				assetFileNames: "[name][extname]", // 静态资源
			},
			onwarn(warning, warn) {
				if (warning.code === "CYCLIC_CROSS_CHUNK_REEXPORT") return;
				warn(warning);
			},
		},
	},
	plugins: [
		vue(),
		jit({
			vue: "vue/dist/vue.esm-browser.js",
			"@noname": "/noname.js",
		}),
	],
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
