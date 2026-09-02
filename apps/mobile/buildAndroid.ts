import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { resolve } from "node:path";

const mobileRoot = import.meta.dirname;
const workspaceRoot = resolve(mobileRoot, "../..");
const androidRoot = resolve(mobileRoot, "android");

const args = new Set(process.argv.slice(2));
const variant = process.argv.find((arg) => arg.startsWith("--variant="))?.split("=", 2)[1] ?? "release";
const normalizedVariant = variant.toLowerCase();
const task = args.has("--aab") ? `bundle${capitalize(normalizedVariant)}` : `assemble${capitalize(normalizedVariant)}`;

if (!/^[a-z][a-z0-9]*$/.test(normalizedVariant)) {
	throw new Error(`Invalid Android build variant: ${variant}`);
}

if (args.has("--help")) {
	console.log(`Usage: pnpm build:android [options]

Options:
  --variant=<name>  Gradle variant to build (default: release)
  --aab             Build an Android App Bundle instead of an APK
  --skip-web-build  Reuse the existing dist directory
`);
	process.exit(0);
}

checkJavaVersion();

if (args.has("--skip-web-build")) {
	console.log("--skip-web-build is set; reusing the existing dist directory.");
} else {
	run("pnpm", ["build"], workspaceRoot, "Web build");
}

run("pnpm", ["sync"], mobileRoot, "Capacitor sync");

const gradleCommand = process.platform === "win32" ? "gradlew.bat" : "./gradlew";
run(gradleCommand, [task, "--no-daemon", "--stacktrace"], androidRoot, `Android ${task}`);

const output = resolve(
	androidRoot,
	"app/build/outputs",
	args.has("--aab") ? `bundle/${normalizedVariant}/app-${normalizedVariant}.aab` : `apk/${normalizedVariant}/app-${normalizedVariant}.apk`
);

if (!existsSync(output)) {
	throw new Error(`Gradle completed, but the expected artifact was not found: ${output}`);
}

console.log(`Android artifact: ${output}`);

function capitalize(value: string) {
	return value.charAt(0).toUpperCase() + value.slice(1);
}

function run(command: string, commandArgs: string[], cwd: string, step: string) {
	console.log(`\n==> ${step}`);
	const executable = process.platform === "win32" && command === "pnpm" ? "pnpm.cmd" : command;
	const result = spawnSync(executable, commandArgs, {
		cwd,
		stdio: "inherit",
		shell: process.platform === "win32" && (command === "pnpm" || command.endsWith(".bat")),
	});

	if (result.error) {
		throw new Error(`${step} failed: ${result.error.message}`);
	}
	if (result.status !== 0) {
		throw new Error(`${step} failed with exit code ${result.status ?? "unknown"}`);
	}
}

function checkJavaVersion() {
	const result = spawnSync("java", ["-version"], { encoding: "utf8" });
	const versionOutput = `${result.stdout ?? ""}\n${result.stderr ?? ""}`;
	const match = versionOutput.match(/version "(\d+)/);
	const major = match ? Number(match[1]) : undefined;

	if (major === undefined) {
		throw new Error("Java was not found. Install JDK 21 and make sure java is available on PATH.");
	}
	if (major !== 21) {
		throw new Error(`JDK 21 is required for this Android build; detected JDK ${major}. Set JAVA_HOME to a JDK 21 installation.`);
	}
}
