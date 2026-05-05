import { build } from "tsup";
import fs from "node:fs/promises";
await build({
	config: false,
	clean: true,
	entry: ["src/index.ts"],
	format: ["esm"],
	platform: "node",
	dts: true,
});
await build({
	config: false,
	entry: ["src/entry.ts"],
	format: ["esm"],
	platform: "browser",
});
await build({
	config: false,
	entry: ["src/service-worker/index.ts"],
	outDir: "dist/service-worker",
	format: ["esm"],
	platform: "browser",
	bundle: true,
	noExternal: ["typescript", "@vue/compiler-sfc", "dedent"],
	minify: "terser",
});
await fs.cp("public", "dist/public", { recursive: true });
