import { createHash } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import ts from "typescript";
import bundled from "../apps/core/game/bundled-extensions.json";
import cleanup from "../apps/core/game/apk-extension-cleanup.json";
import policy from "../apps/core/game/extension-restructure.json";

const root = path.resolve("apps/core/extension");
const registryFile = path.resolve("apps/core/game/organized-extensions.json");
const previous: any[] = JSON.parse(await fs.readFile(registryFile, "utf8"));
const previousByName = new Map(previous.map(row => [row.name, row]));
const bundledNames = new Set<string>(bundled);
const renamed = new Map(Object.entries(policy.renamed));
const reverseRename = new Map([...renamed].map(([oldName, newName]) => [newName, oldName]));
const mergedByTarget = new Map(Object.entries(policy.merged));
const retired = new Set<string>([
	...cleanup.removed,
	...cleanup.merged.map(item => item.name),
	...policy.removed,
	...renamed.keys(),
	...Object.entries(policy.merged).flatMap(([target, sources]) => sources.filter(name => name !== target)),
	"手杀补全",
]);
const skipped = new Set(["node_modules", "dist", "audio", "image", "images", "assets", "asset", "font", "fonts", "pixi", "skin"]);
const metadata = new Set(["character", "translate", "characterPrefix", "characterSort", "characterTitle", "characterIntro", "characterFilter", "skill", "card"]);

function propertyName(name: ts.PropertyName | ts.BindingName | undefined) {
	if (name && (ts.isIdentifier(name) || ts.isStringLiteralLike(name) || ts.isNumericLiteral(name))) return name.text;
}

async function filesBelow(directory: string, relative = ""): Promise<string[]> {
	const output: string[] = [];
	for (const entry of await fs.readdir(path.join(directory, relative), { withFileTypes: true })) {
		const rel = path.join(relative, entry.name);
		if (entry.isDirectory()) output.push(...await filesBelow(directory, rel));
		else output.push(rel);
	}
	return output;
}

async function sourceFiles(directory: string, relative = ""): Promise<string[]> {
	const output: string[] = [];
	for (const entry of await fs.readdir(path.join(directory, relative), { withFileTypes: true })) {
		const rel = path.join(relative, entry.name);
		if (entry.isDirectory()) {
			if (directory.endsWith("群雄并起") && /members[\\/]杀海拾遗[\\/](character|card)[\\/](gwent|gujian|swd|hearth|ow|xianjian|mtg)$/.test(rel)) continue;
			if (!skipped.has(entry.name.toLowerCase())) output.push(...await sourceFiles(directory, rel));
		} else if (/\.(?:js|ts)$/i.test(entry.name)) output.push(rel);
	}
	return output;
}

function collectCharacters(source: string, filename: string, ids: Set<string>) {
	const ast = ts.createSourceFile(filename, source, ts.ScriptTarget.Latest, true, filename.endsWith(".ts") ? ts.ScriptKind.TS : ts.ScriptKind.JS);
	const collectDictionary = (dictionary: ts.ObjectLiteralExpression) => {
		for (const member of dictionary.properties) {
			if (!ts.isPropertyAssignment(member)) continue;
			const id = propertyName(member.name);
			if (id && !metadata.has(id) && (ts.isArrayLiteralExpression(member.initializer) || ts.isObjectLiteralExpression(member.initializer))) ids.add(id);
		}
	};
	function visit(node: ts.Node) {
		if (ts.isPropertyAssignment(node)) {
			const key = propertyName(node.name);
			if (key === "character" && ts.isObjectLiteralExpression(node.initializer)) {
				const direct = new Set(node.initializer.properties.map(member => propertyName(member.name)).filter(Boolean));
				const siblings = ts.isObjectLiteralExpression(node.parent) ? new Set(node.parent.properties.map(member => propertyName(member.name)).filter(Boolean)) : new Set<string>();
				if (!direct.has("character") && !direct.has("translate") && (siblings.has("translate") || siblings.has("characterSort") || siblings.has("name"))) collectDictionary(node.initializer);
			}
		} else if (path.basename(filename).toLowerCase() === "character.js" && ts.isExportAssignment(node) && ts.isObjectLiteralExpression(node.expression)) {
			collectDictionary(node.expression);
		} else if (path.basename(filename).toLowerCase() === "character.js" && ts.isVariableDeclaration(node) && propertyName(node.name) === "characters" && ts.isObjectLiteralExpression(node.initializer)) {
			collectDictionary(node.initializer);
		}
		ts.forEachChild(node, visit);
	}
	visit(ast);
}

async function inventory(name: string) {
	const directory = path.join(root, name);
	const sourceNames = mergedByTarget.get(name) || [reverseRename.get(name) || name];
	const ids = new Set<string>(sourceNames.flatMap(sourceName => previousByName.get(sourceName)?.characters || []));
	// Re-scan active modules instead of resurrecting removed crossover IDs from old manifests.
	if (name === "群雄并起") ids.clear();
	for (const file of await sourceFiles(directory)) {
		try { collectCharacters(await fs.readFile(path.join(directory, file), "utf8"), file, ids); }
		catch (error) { console.warn(`无法解析 ${name}/${file}: ${String(error)}`); }
	}
	if (name === "蔡阳") { ids.clear(); ids.add("CYZi"); }
	if (name === "超神赵云") { ids.clear(); ids.add("超神赵云"); }
	if (name === "手杀武将") {
		ids.clear();
		for (const sourceName of sourceNames) for (const id of previousByName.get(sourceName)?.characters || []) ids.add(id);
	}
	const hashes: Record<string, string> = {};
	for (const file of (await filesBelow(directory)).sort()) {
		const data = await fs.readFile(path.join(directory, file));
		hashes[file.replaceAll("\\", "/")] = createHash("sha256").update(data).digest("hex");
	}
	const hash = createHash("sha256").update(Object.entries(hashes).map(([file, digest]) => `${file}\0${digest}`).join("\n")).digest("hex");
	const oldRow = previousByName.get(name) || previousByName.get(reverseRename.get(name));
	return {
		name,
		hash,
		characters: [...ids],
		files: hashes,
		...(oldRow?.defaultEnabled === false ? { defaultEnabled: false } : {}),
		...(oldRow?.source ? { source: oldRow.source } : {}),
	};
}

// Retired resources can remain on disk if filesystem deletion is denied; never register them.
const directories = (await fs.readdir(root, { withFileTypes: true })).filter(entry => entry.isDirectory() && !retired.has(entry.name)).map(entry => entry.name).sort((a, b) => a.localeCompare(b, "zh-CN"));
if (directories.length !== 49) throw new Error(`扩展目录数量异常：${directories.length}，预期 49`);
const registryNames = directories.filter(name => !bundledNames.has(name));
const records = [];
for (const name of registryNames) {
	if (retired.has(name)) throw new Error(`已退役扩展仍存在：${name}`);
	records.push(await inventory(name));
	console.log(`${name}: ${records.at(-1)!.characters.length} 个武将定义`);
}
const temporary = `${registryFile}.${process.pid}.tmp`;
await fs.writeFile(temporary, JSON.stringify(records, null, 2) + "\n");
await fs.copyFile(temporary, registryFile);
await fs.rm(temporary);
const ignoreFile = path.resolve("apps/core/.gitignore");
const ignore = await fs.readFile(ignoreFile, "utf8");
const allowlist = ["extension/**", "!extension/_merge.js", ...directories.flatMap(name => [`!extension/${name}/`, `!extension/${name}/**`]), ""].join("\n");
const allowlistRegion = /extension\/\*\*[\s\S]*?(?=# Extension allowlists)/;
if (!allowlistRegion.test(ignore)) throw new Error("未找到扩展 allowlist 区域");
const updatedIgnore = ignore.replace(allowlistRegion, allowlist);
if (updatedIgnore !== ignore) await fs.writeFile(ignoreFile, updatedIgnore);
console.log(JSON.stringify({ directories: directories.length, bundled: bundled.length, registered: records.length, characters: records.reduce((sum, row) => sum + row.characters.length, 0) }, null, 2));
