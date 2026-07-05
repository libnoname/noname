import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		environment: "node",
		globals: false,
		include: ["src/**/*.spec.ts"],
	},
});
