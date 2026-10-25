import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const mobileRoot = resolve(import.meta.dirname, "..");
const workspaceRoot = resolve(mobileRoot, "../..");
const iosRoot = resolve(mobileRoot, "native/ios");
const archivePath = resolve(iosRoot, "build/noname.xcarchive");
const exportDir = resolve(iosRoot, "build/export");

const args = new Set(process.argv.slice(2));

if (args.has("--help")) {
	console.log(`Usage: pnpm --filter @noname/mobile build:ios [options]

Options:
  --team=<id>             Apple Developer Team ID (required)
  --method=<method>       development (default) | ad-hoc | app-store-connect
  --configuration=<name>  Debug (default) | Release
  --skip-web-build        Reuse the existing dist directory
  --help                  Show this message

Requirements:
  - Must run on macOS (xcodebuild is required).
  - Xcode 26.0+ (Capacitor 8 uses Swift Package Manager).
  - The iOS project ships with the repository (apps/mobile/native/ios).
`);
	process.exit(0);
}

const teamId = readOption("--team=");
const method = readOption("--method=") ?? "development";
const configuration = readOption("--configuration=") ?? "Debug";

const allowedMethods = new Set(["development", "ad-hoc", "app-store-connect", "enterprise", "validation"]);
if (!allowedMethods.has(method)) {
	throw new Error(`Invalid --method=${method}. Expected one of: ${[...allowedMethods].join(", ")}`);
}

assertMacOS();

if (!teamId) {
	throw new Error("Missing --team=<Apple Developer Team ID>. Find it at https://developer.apple.com/account (Membership details).");
}

const workspacePath = resolve(iosRoot, "App/App.xcworkspace");
const projectPath = resolve(iosRoot, "App/App.xcodeproj");
const buildTarget = existsSync(workspacePath) ? workspacePath : projectPath;
const buildTargetFlag = existsSync(workspacePath) ? "-workspace" : "-project";

if (!existsSync(workspacePath) && !existsSync(projectPath)) {
	throw new Error(`iOS project not found at ${projectPath}`);
}

if (args.has("--skip-web-build")) {
	console.log("--skip-web-build is set; reusing the existing dist directory.");
} else {
	run("pnpm", ["build"], workspaceRoot, "Web build");
}

run("pnpm", ["sync:ios"], mobileRoot, "Capacitor sync");

run("xcodebuild", [buildTargetFlag, buildTarget, "-scheme", "App", "-configuration", configuration, "-archivePath", archivePath, "-destination", "generic/platform=iOS", "DEVELOPMENT_TEAM=" + teamId, "CODE_SIGN_STYLE=Automatic", "archive"], iosRoot, "xcodebuild archive");

mkdirSync(resolve(iosRoot, "build"), { recursive: true });
const exportOptionsPath = resolve(iosRoot, "build/ExportOptions.plist");
writeFileSync(
	exportOptionsPath,
	`<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
	<key>method</key>
	<string>${method}</string>
	<key>teamID</key>
	<string>${teamId}</string>
	<key>compileBitcode</key>
	<false/>
	<key>stripSwiftSymbols</key>
	<true/>
	<key>signingStyle</key>
	<string>automatic</string>
</dict>
</plist>
`,
	{ encoding: "utf8" }
);

run("xcodebuild", ["-exportArchive", "-archivePath", archivePath, "-exportPath", exportDir, "-exportOptionsPlist", exportOptionsPath], iosRoot, "xcodebuild -exportArchive");

console.log(`\niOS archive: ${archivePath}`);
console.log(`iOS IPA exported to: ${exportDir}`);

function readOption(prefix: string): string | undefined {
	const found = process.argv.find(arg => arg.startsWith(prefix));
	return found?.slice(prefix.length);
}

function assertMacOS() {
	if (process.platform !== "darwin") {
		throw new Error(`iOS builds require macOS (current platform: ${process.platform}).`);
	}
}

function run(command: string, commandArgs: string[], cwd: string, step: string) {
	console.log(`\n==> ${step}`);
	const result = spawnSync(command, commandArgs, {
		cwd,
		stdio: "inherit",
		shell: process.platform === "win32" && command === "pnpm",
	});

	if (result.error) {
		throw new Error(`${step} failed: ${result.error.message}`);
	}
	if (result.status !== 0) {
		throw new Error(`${step} failed with exit code ${result.status ?? "unknown"}`);
	}
}
