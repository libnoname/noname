import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { transformSkillContext } from "../../packages/jit/src/skill-context-transform";

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
	plugins: [{
		name: "noname-skill-context", enforce: "pre",
		transform(code, id) {
			if (id.includes("/node_modules/") || id.includes("/extension/") || !/\.[cm]?[jt]s$/.test(id)) return;
			return transformSkillContext(code, id);
		},
	}, vue()],
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
