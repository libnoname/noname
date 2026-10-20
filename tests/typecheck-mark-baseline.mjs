import ts from "typescript";
import { execFileSync } from "node:child_process";
import path from "node:path";
import fs from "node:fs";

const baseline = process.env.MARK_BASELINE || "f604fd50c870bda892ae25257c2f090a245193fd";
const root = process.cwd(),
	core = path.join(root, "apps/core");
const git = (...args) => execFileSync("git", args, { encoding: "utf8", maxBuffer: 10 * 1024 * 1024, stdio: ["pipe", "pipe", "pipe"] });
const normalize = file => path.resolve(file).replaceAll("\\", "/").toLowerCase();
const changed = git("diff", "--name-only", baseline).trim().split("\n").filter(Boolean);
const untracked = git("ls-files", "--others", "--exclude-standard")
	.trim()
	.split("\n")
	.filter(file => /^(apps\/core|packages\/jit)\//.test(file));
const versions = new Map();
for (const file of [...changed, ...untracked]) {
	let content;
	try {
		content = git("show", `${baseline}:${file}`);
	} catch {}
	versions.set(normalize(path.join(root, file)), content);
}
const configPath = path.join(core, "tsconfig.types.json");
const parsed = ts.getParsedCommandLineOfConfigFile(
	configPath,
	{ noEmit: true, emitDeclarationOnly: false },
	{
		...ts.sys,
		onUnRecoverableConfigFileDiagnostic: error => {
			throw new Error(ts.flattenDiagnosticMessageText(error.messageText, "\n"));
		},
	}
);
function check(old) {
	const host = ts.createCompilerHost(parsed.options);
	if (old) {
		const read = host.readFile,
			exists = host.fileExists;
		host.readFile = file => (versions.has(normalize(file)) ? versions.get(normalize(file)) : read(file));
		host.fileExists = file => (versions.has(normalize(file)) ? versions.get(normalize(file)) !== undefined : exists(file));
	}
	const rootNames = old ? parsed.fileNames.filter(file => !versions.has(normalize(file)) || versions.get(normalize(file)) !== undefined) : parsed.fileNames;
	const program = ts.createProgram(rootNames, parsed.options, host);
	return ts.getPreEmitDiagnostics(program).map(error => ({ file: error.file ? path.relative(root, error.file.fileName).replaceAll("\\", "/") : "<config>", code: error.code, message: ts.flattenDiagnosticMessageText(error.messageText, "\n").replace(/"[^"\n]+"(?: \| "[^"\n]+")+/g, union => union.split(" | ").sort().join(" | ")) }));
}
const before = check(true),
	after = check(false);
const counts = list => {
	const map = new Map();
	for (const item of list) {
		const key = JSON.stringify(item);
		map.set(key, (map.get(key) || 0) + 1);
	}
	return map;
};
const baseCounts = counts(before),
	currentCounts = counts(after),
	added = [],
	removed = [];
for (const [key, count] of currentCounts) if (count > (baseCounts.get(key) || 0)) added.push({ ...JSON.parse(key), count: count - (baseCounts.get(key) || 0) });
for (const [key, count] of baseCounts) if (count > (currentCounts.get(key) || 0)) removed.push({ ...JSON.parse(key), count: count - (currentCounts.get(key) || 0) });
const result = { baseline, before: before.length, after: after.length, added, removed };
fs.writeFileSync("audit/mark-stage2-typecheck-delta.json", JSON.stringify(result, null, 2));
console.log(JSON.stringify(result, null, 2));
process.exitCode = added.length ? 1 : 0;
