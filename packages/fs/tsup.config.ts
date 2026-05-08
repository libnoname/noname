import { defineConfig } from "tsup";

export default defineConfig({
	entry: ["src/index.ts", "src/entry.ts"],
	format: ["esm", "cjs"],
	clean: true,
	platform: "node",
	dts: true,
	sourcemap: true,
});
