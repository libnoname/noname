import fs from "node:fs/promises";
import path from "node:path";
import ts from "typescript";
import { Archive, hashFile, safePath, within, digest } from "./extension-organizer/archive.js";
import { parseSource } from "./extension-organizer/analyze.js";

const root = path.resolve(import.meta.dirname, "..");
const input = path.join(root, "扩展包/整理结果");
const target = path.join(root, "apps/core/extension");
const manifest = JSON.parse(await fs.readFile(path.join(input, "manifest.json"), "utf8"));
const registryFile = path.join(root, "apps/core/game/organized-extensions.json");
const previous = JSON.parse(await fs.readFile(registryFile, "utf8").catch(() => "[]"));
const registry: { name: string; hash: string; characters: string[]; files: Record<string, string> }[] = [];
const isBackup = (file: string) => /\.(?:bak|orig|rej|tmp)$/i.test(file) || file.endsWith("~");

async function saveRegistry() {
	// Removing an input ZIP is not authorization to uninstall an existing pack.
	const records = [...previous.filter((p: { name: string }) => !registry.some(r => r.name === p.name)), ...registry];
	const content = JSON.stringify(records, null, 2) + "\n";
	if ((await fs.readFile(registryFile, "utf8").catch(() => undefined)) === content) return;
	const temporary = `${registryFile}.${process.pid}.tmp`;
	await fs.writeFile(temporary, content, { flag: "wx" });
	await fs.rename(temporary, registryFile);
}

for (const product of manifest.products) {
	safePath(product.name);
	if (/[\\/]/.test(product.name) || !/^[a-f0-9]{64}\.zip$/.test(product.file)) throw new Error("Invalid manifest path");
	const destination = path.join(target, product.name);
	if (!within(target, destination)) throw new Error("Target outside extension directory");
	const archivePath = path.join(input, "packages", product.file);
	if ((await hashFile(archivePath)) !== product.hash) throw new Error(`ZIP 校验失败：${product.name}`);
	const installed = await fs.stat(destination).catch(() => undefined);
	if (installed) {
		const record = previous.find((p: { name: string; hash: string }) => p.name === product.name && p.hash === product.hash);
		if (!record) throw new Error(`已有同名目录，停止以避免覆盖：${product.name}`);
		const files = Object.fromEntries(Object.entries(record.files).filter(([file]) => !isBackup(file)));
		for (const [file, hash] of Object.entries(files)) if ((await hashFile(path.join(destination, safePath(file)))) !== hash) throw new Error(`已有安装被修改：${product.name}/${file}`);
		registry.push({ ...record, files });
		continue;
	}
	const staging = await fs.mkdtemp(path.join(target, ".install-"));
	const zip = await Archive.open(archivePath);
	const hashes: Record<string, string> = Object.create(null);
	try {
		for (const name of zip.entries.keys()) {
			safePath(name);
			if (isBackup(name)) continue;
			const output = path.join(staging, name);
			if (!within(staging, output)) throw new Error("Archive path escaped staging");
			await fs.mkdir(path.dirname(output), { recursive: true });
			if (name === "extension.js") {
				const original = (await zip.read(name)).toString("utf8");
				const ast = parseSource(original);
				const registration = ast.statements.find(s => ts.isExpressionStatement(s) && ts.isCallExpression(s.expression) && s.expression.expression.getText(ast) === "game.import");
				let source = original;
				if (registration && ts.isExpressionStatement(registration) && ts.isCallExpression(registration.expression)) {
					const factory = registration.expression.arguments[1].getText(ast);
					source = `import { lib, game, ui, get, ai, _status } from "noname";\nexport const type = "extension";\n` + original.slice(0, registration.getStart(ast)) + `export default ${factory};` + original.slice(registration.end);
				}
				parseSource(source);
				await fs.writeFile(output, source, { flag: "wx" });
				hashes[name] = digest(source);
			} else {
				await zip.extract(name, output);
				hashes[name] = await hashFile(output);
			}
		}
		await fs.rename(staging, destination);
		registry.push({ name: product.name, hash: product.hash, characters: product.characters, files: hashes });
		// Checkpoint every completed installation so an interrupted run is resumable.
		await saveRegistry();
		console.log(`已安装：${product.name}（${product.characters.length} 名武将）`);
	} finally {
		zip.close();
		if (within(target, staging) && path.basename(staging).startsWith(".install-")) await fs.rm(staging, { recursive: true, force: true });
	}
}
await saveRegistry();
console.log(`安装完成：${registry.length} 个扩展，${registry.reduce((sum, p) => sum + p.characters.length, 0)} 名武将。`);
