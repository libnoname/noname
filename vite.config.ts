import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { VitePWA } from "vite-plugin-pwa";

const port = {
	client: 8080,
	server: 8089,
};

export default defineConfig({
	root: ".",
	base: "./",
	resolve: {
		alias: {
			"@": "/noname",
			noname: "/noname.js",
		},
		extensions: [".tsx", ".ts", ".js", ".vue"],
	},
	plugins: [
		vue(),
		VitePWA({
			registerType: "autoUpdate",
			injectRegister: "auto",
			devOptions: {
				enabled: true,
			},
			manifest: {
				name: "无名杀",
				short_name: "无名杀",
				start_url: ".",
				scope: ".",
				display: "standalone",
				background_color: "#141414",
				theme_color: "#141414",
				icons: [
					{
						src: "sha.png",
						sizes: "1024x1024",
						type: "image/png",
					},
				],
				screenshots: [
					{
						src: "screenshot2k.png",
						sizes: "2560x1600",
						type: "image/png",
						form_factor: "wide",
					},
					{
						src: "screenshot phone.png",
						sizes: "560x1216",
						type: "image/png",
						form_factor: "narrow",
					},
				],
			},
		}),
	],
	server: {
		host: "0.0.0.0",
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
