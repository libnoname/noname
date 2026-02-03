import { spawnSync } from "child_process";
import { copyFileSync, existsSync } from "fs";
import { build } from "tsup";

type Platform = "darwin" | "linux" | "win32";

const platform: Platform = process.argv[2] as Platform;

function run(cmd: string, args: string[] = []) {
	console.log(`\n> ${[cmd, ...args].join(" ")}`);
	const res = spawnSync(cmd, args, { stdio: "inherit", shell: true });
	if (res.error) throw res.error;
	if (res.status && res.status !== 0) {
		throw new Error(`Command failed: ${cmd} ${args.join(" ")} (exit ${res.status})`);
	}
}

async function main(platform) {
	try {
		if (!platform) return;

		await build({
			config: false,
			entry: ["src/entry.ts"],
			format: "cjs",
			outDir: "output",
			platform: "node",
			bundle: true,
			noExternal: ["minimist", "fastify", "@fastify/static", "@fastify/cors"],
			minify: "terser",
			outExtension({ format }) {
				return {
					js: `.bundle.cjs`,
				};
			},
		});
		console.log(`Detected platform: ${platform}`);

		run("node", ["--experimental-sea-config", "sea-config.json"]);

		// validate index.blob exists
		const blobPath = "output/index.blob";
		if (!existsSync(blobPath)) {
			console.warn(`Warning: ${blobPath} not found. Proceeding anyway (postject will fail if file missing).`);
		}

		// determine target executable name & extra postject args per platform
		let targetExe = "output/noname-server";
		const sentinelFuse = "NODE_SEA_FUSE_fce680ab2cc467b6e072b8b5df1996b2";
		const sentinelKey = "NODE_SEA_BLOB";

		if (platform === "win32") {
			targetExe += ".exe";
			copyFileSync(process.execPath, targetExe);
			run("npx", ["postject", targetExe, sentinelKey, blobPath, "--sentinel-fuse", sentinelFuse]);
			console.log("Windows build done");
			return;
		}

		// macOS (darwin) and Linux share most steps; mac has extra codesign steps & macho segment arg
		else if (platform === "macos") {
			copyFileSync(process.execPath, targetExe);

			// remove signature (may fail on older/newer macOS; we try and warn if it fails)
			try {
				console.log("Attempting to remove codesign signature (macOS)...");
				run("codesign", ["--remove-signature", targetExe]);
			} catch (e) {
				console.warn("Failed to remove signature (maybe not signed or not supported). Continuing.", (e as Error).message);
			}

			run("npx", ["postject", targetExe, sentinelKey, blobPath, "--sentinel-fuse", sentinelFuse, "--macho-segment-name", "NODE_SEA"]);

			// re-sign ad-hoc: note this uses ad-hoc signing (`-`), which may be enough for many cases.
			try {
				console.log("Re-signing binary (ad-hoc) ...");
				run("codesign", ["--sign", "-", targetExe]);
			} catch (e) {
				console.warn("codesign failed. You may need to run the re-sign step manually or provide proper identity.", (e as Error).message);
			}

			console.log("macOS build done");
			return;
		} else if (platform === "linux") {
			copyFileSync(process.execPath, targetExe);
			run("npx", ["postject", targetExe, sentinelKey, blobPath, "--sentinel-fuse", sentinelFuse, "--macho-segment-name", "NODE_SEA"]);

			console.log("Linux build done");
			return;
		}
	} catch (err) {
		console.error("\nBuild failed:", (err as Error).message);
		process.exit(1);
	}
}

main(platform);
