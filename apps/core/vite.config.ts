import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

const port = {
	client: 8081,
	server: 8089,
};
// The browser dev server is local, while the online platform normally runs on
// the deployment host. Override this with VITE_ONLINE_ORIGIN for another
// environment or a local platform instance.
const onlineOrigin = new URL(process.env.VITE_ONLINE_ORIGIN || "http://139.196.192.5").origin;
const onlineWsOrigin = onlineOrigin.replace(/^http/, "ws");
const onlineProxy = {
	target: onlineOrigin,
	changeOrigin: true,
	secure: false,
	// The platform validates Origin on state-changing HTTP requests and on the
	// WebSocket upgrade. The proxy presents the configured public origin.
	headers: { origin: onlineOrigin },
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
	// Discover common runtime dependencies before the first browser request, rather
	// than restarting dependency optimization as dynamic packs arrive.
	optimizeDeps: {
		entries: ["index.html"],
		include: ["core-js-bundle", "vue", "vue/dist/vue.esm-browser.js", "pinyin-pro", "jszip", "dedent", "path-browserify-esm",
			"stackframe", "error-stack-parser", "stacktrace-gps", "stacktrace-js", "crypto-js", "nosleep.js", "pressure"],
	},
	server: {
		host: "127.0.0.1",
		port: port.client,
		// Do not silently switch ports: a different origin has a different save DB.
		strictPort: true,
		warmup: { clientFiles: ["./noname/entry.ts", "./noname/init/index.ts", "./noname/online/ui/EntryShell.vue"] },
		fs: {
			allow: ["../.."],
		},
		proxy: {
			"/api/v1": onlineProxy,
			"/ws/v1": { ...onlineProxy, target: onlineWsOrigin, ws: true },
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
