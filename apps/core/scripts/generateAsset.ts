#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { cwd } from "node:process";

function naturalCompare(left: string, right: string): number {
	const tokenPattern = /(\d+)|(\D+)/g;

	const leftTokens = left.match(tokenPattern) ?? [];
	const rightTokens = right.match(tokenPattern) ?? [];

	const maxTokenCount = Math.max(leftTokens.length, rightTokens.length);

	for (let index = 0; index < maxTokenCount; index++) {
		const leftToken = leftTokens[index];
		const rightToken = rightTokens[index];

		if (leftToken === undefined) return -1;
		if (rightToken === undefined) return 1;
		if (leftToken === rightToken) continue;

		const leftIsNumber = /^\d+$/.test(leftToken);
		const rightIsNumber = /^\d+$/.test(rightToken);

		if (leftIsNumber && rightIsNumber) {
			const leftNumber = Number(leftToken);
			const rightNumber = Number(rightToken);

			if (leftNumber !== rightNumber) {
				return leftNumber - rightNumber;
			}

			// 数值相同但位数不同（例如 "001" vs "1"）
			return leftToken.length - rightToken.length;
		}

		return leftToken.localeCompare(rightToken);
	}

	return 0;
}

function walkFiles(dir: string): string[] {
	const out: string[] = [];
	const stack: string[] = [dir];

	while (stack.length) {
		const cur = stack.pop()!;
		let entries: fs.Dirent[];
		try {
			entries = fs.readdirSync(cur, { withFileTypes: true });
		} catch {
			continue;
		}

		for (const ent of entries) {
			const full = path.join(cur, ent.name);
			if (ent.isDirectory()) stack.push(full);
			else if (ent.isFile()) out.push(full);
		}
	}
	return out;
}

function toPosixRelative(fullPath: string, basePath: string): string {
	return path.relative(basePath, fullPath).split(path.sep).join("/");
}

function getAllResources(basePath: string): string[] {
	const folders = ["audio", "font", "image", "theme"] as const;
	const excludeDirs = ["audio/effect", "image/flappybird", "image/pointer"] as const;

	const allFiles: string[] = [];

	for (const folder of folders) {
		const folderPath = path.join(basePath, folder);
		if (!fs.existsSync(folderPath) || !fs.statSync(folderPath).isDirectory()) continue;

		const files = walkFiles(folderPath);
		for (const file of files) {
			if (path.extname(file).toLowerCase() === ".css") continue;

			const rel = toPosixRelative(file, basePath);
			if (excludeDirs.some(ex => rel.startsWith(ex + "/"))) continue;

			allFiles.push(rel);
		}
	}
	return allFiles;
}

function readPackageVersion(pkgPath: string): string {
	if (!fs.existsSync(pkgPath)) {
		throw new Error(`未找到 package.json (${pkgPath})`);
	}
	let pkgRaw: string;
	try {
		pkgRaw = fs.readFileSync(pkgPath, "utf8");
	} catch {
		throw new Error(`读取 package.json 失败 (${pkgPath})`);
	}

	let pkg: unknown;
	try {
		pkg = JSON.parse(pkgRaw);
	} catch {
		throw new Error("package.json 解析失败");
	}

	const version = (pkg as { version?: unknown }).version;
	if (typeof version !== "string" || version.trim() === "") {
		throw new Error("package.json 中未定义有效的 version 字段");
	}
	return version.trim();
}
function main(): void {
	// 上级 noname 目录
	const basePath = cwd();
	const outputPath = path.join(basePath, "game", "asset.json");

	// const pkgPath = path.join(basePath, "package.json");
	// let version: string;
	// try {
	// 	version = readPackageVersion(pkgPath);
	// } catch (e) {
	// 	console.error(`错误: ${(e as Error).message}`);
	// 	process.exit(1);
	// }

	const allFiles = getAllResources(basePath);

	allFiles.sort(naturalCompare);

	fs.writeFileSync(outputPath, JSON.stringify(allFiles, null, "\t"), { encoding: "utf8" });

	console.log("✅ 资源清单生成成功！");
	console.log(`├─ 扫描目录: ${basePath.replace(/\\/g, "/")}`);
	console.log(`├─ 输出文件: ${outputPath.replace(/\\/g, "/")}`);
	console.log(`└─ 包含资源: ${allFiles.length} 项`);
	// console.log(`└─ 设置版本: v${version}`);
}

main();
