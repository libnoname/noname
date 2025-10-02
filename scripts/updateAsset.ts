#!/usr/bin/env -S deno run --allow-env --allow-read --allow-run --allow-write

import { exec } from "node:child_process";
import { copyFile, writeFile } from "node:fs/promises";
import { basename, dirname, join, sep } from "node:path";
import { argv, exit } from "node:process";
import { fileURLToPath } from "node:url";
const __filename: string = fileURLToPath(import.meta.url);
const __dirname: string = dirname(__filename);

const assetListPath: string = join(__dirname, "./asset.js");
const supportAudioSuffix = [".mp3", ".ogg", ".wav"];
const supportImageSuffix = [".jpg", ".jpeg", ".png", ".webp"];
const supportFontSuffix = [".woff2"];
const assetSuffixFilter: Record<string, string[]> = {
	audio: supportAudioSuffix,
	font: supportFontSuffix,
	image: supportImageSuffix,
	theme: supportImageSuffix,
};

async function main(argv: string[]): Promise<number> {
	if (argv.length < 2) {
		return 1;
	}
	const [nextVersion, commitHash] = argv;

	await backup(assetListPath);
	const assetList = await importAsset();
	const diffList = await loadDiffFiles(commitHash);

	// 添加一个可能没啥用的缓存，但万个数据的情况也不好说
	const splitCache = new Map<string, [type: string, subtype: string]>();
	const assetNewFiles = diffList.filter(path => {
		const [type, subtype] = path.split(sep);
		splitCache.set(path, [type, subtype]);
		return assetSuffixFilter[type]?.some(suffix => path.endsWith(suffix));
	});

	const newAssetList: string[] = [];
	for (const oldAsset of assetList) {
		if (oldAsset.startsWith("v")) {continue;}
		if (!newAssetList.includes(oldAsset)) {
			newAssetList.push(oldAsset);
		}
	}
	for (const newAsset of assetNewFiles) {
		if (!newAssetList.includes(newAsset)) {
			newAssetList.push(newAsset);
		}
	}
	newAssetList.sort();

	// 对素材进行分组
	// @ts-expect-error must be here.
	const group = Map.groupBy(newAssetList, path => {
		const [type, subtype] = splitCache.get(path) ?? path.split(sep);
		splitCache.set(path, [type, subtype]);

		if (["theme", "font"].includes(type)) {return type;}

		return `${type}${sep}${subtype}`;
	});

	const source = await genAssetSource(nextVersion, group, splitCache);
	await writeFile(assetListPath, source);

	return 0;
}


async function backup(filePath: string) {
	const fileName = basename(filePath);
	const dirPath = dirname(filePath);
	await copyFile(filePath, join(dirPath, `${fileName}.bak`));
}

async function importAsset(): Promise<string[]> {
	await import(assetListPath);
	const assetList = window.noname_asset_list!;
	delete window.noname_asset_list;
	delete window.noname_skin_list;
	return assetList;
}

async function loadDiffFiles(commitHash: string): Promise<string[]> {
	const execOut = await new Promise<string>((resolve, reject) => {
		exec(`git diff --name-only ${commitHash}`, (error, stdout) => {
			if (error) {
				reject(error);
			} else {
				resolve(stdout);
			}
		});
	});

	return execOut.split("\n");
}

async function genAssetSource(version: string, assetGroup: Map<string, string[]>, splitCache: Map<string, [type: string, subtype: string]>) {
	const sourceLines = ["window.noname_asset_list = [", `\t"v${version}",`];
	const addFiles = (files: string[]) => {
		for (const file of files) {
			sourceLines.push(`\t"${file}",`);
		}
	};

	for (const [term, files] of assetGroup) {
		if (["font", "theme"].includes(term)) {
			addFiles(files);
			continue;
		}

		const [type, subtype] = splitCache.get(term) ?? term.split(sep);
		sourceLines.push(`\t/* ${subtype} ${type} start */`);
		addFiles(files);
		sourceLines.push(`\t/* ${subtype} ${type} end */\n`);
	}

	sourceLines.push("];");
	// 末尾的换行符用于表示*nix下的留尾
	sourceLines.push("window.noname_skin_list = {};\n");

	return sourceLines.join("\n");
}

if (argv[1] === __filename) {
	exit(await main(argv.slice(2)));
}
