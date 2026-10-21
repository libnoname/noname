import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const resolve = (path: string) => fileURLToPath(new URL(path, import.meta.url));

export default defineConfig({
	resolve: {
		alias: {
			"@": resolve("./noname"),
			// 单元测试不加载真实引擎，所有 import "noname" 的模块都走最小替身
			noname: resolve("./test/stubs/noname.ts"),
		},
	},
	test: {
		environment: "node",
		setupFiles: ["./test/setup.ts"],
		include: ["test/**/*.test.ts"],
		restoreMocks: true,
		coverage: {
			provider: "v8",
			reporter: ["text", "html"],
		},
	},
});
