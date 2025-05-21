// node game/updateAsset.js nextVersion commitHash

// import { exec } from "node:child_process";
const { exec } = require("node:child_process");
// import { copyFile, writeFile } from "node:fs/promises";
const { copyFile, writeFile } = require("node:fs/promises");
// import { basename, dirname, join, sep } from "node:path";
const { basename, dirname, join, sep } = require("node:path");
// import { argv, exit } from "node:process";
const { argv, exit } = require("node:process");

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

// @ts-expect-error core-js
if (typeof Map.groupBy !== 'function') {
	// await import('./core-js-bundle.js');
	require('./core-js-bundle.js');
}

const assetListPath = join(__dirname, "./asset.js");
const supportAudioSuffix = [".mp3", ".ogg", ".wav"];
const supportImageSuffix = [".jpg", ".jpeg", ".png", ".webp"];
const supportFontSuffix = [".woff2"];
const assetSuffixFilter = {
	audio: supportAudioSuffix,
	font: supportFontSuffix,
	image: supportImageSuffix,
	theme: supportImageSuffix,
};

if (typeof window == 'undefined') {
	// @ts-expect-error just set a global
	globalThis.window = globalThis;
}

/**
 * 
 * @param { string[] } argv 
 * @returns { Promise<number> }
 */
async function main(argv) {
	console.log(argv);
	
	if (argv.length < 2) {
		return 1;
	}
	const [nextVersion, commitHash] = argv;

	await backup(assetListPath);

	const assetList = await importAsset();
	const diffList = await loadDiffFiles(commitHash);

	// 添加一个可能没啥用的缓存，但万个数据的情况也不好说
	/**
	 * @type { Map<string, [type: string, subtype: string]> }
	 */
	const splitCache = new Map();
	const assetNewFiles = diffList.filter(path => {
		const [type, subtype] = path.split(sep);
		splitCache.set(path, [type, subtype]);
		return assetSuffixFilter[type]?.some(suffix => path.endsWith(suffix));
	});

	/**
	 * @type { string[] }
	 */
	const newAssetList = [];
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
	// @ts-expect-error core-js
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

/**
 * 
 * @param { string } filePath 
 */
async function backup(filePath) {
	const fileName = basename(filePath);
	const dirPath = dirname(filePath);
	await copyFile(filePath, join(dirPath, `${fileName}.bak`));
}

/**
 * @returns { Promise<string[]> }
 */
async function importAsset() {
	// @ts-expect-error take it as a module
	await import("./asset.js");
	const assetList = window.noname_asset_list;
	delete window.noname_asset_list;
	delete window.noname_skin_list;
	// @ts-expect-error must be true
	return assetList;
}

/**
 * @param { string } commitHash 
 * @returns { Promise<string[]> }
 */
async function loadDiffFiles(commitHash) {
	const execOut = await new Promise((resolve, reject) => {
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

/**
 * @param { string } version 
 * @param { Map<string, string[]> } assetGroup 
 * @param { Map<string, [type: string, subtype: string]> } _splitCache
 */
async function genAssetSource(version, assetGroup, _splitCache) {
	const sourceLines = ["window.noname_asset_list = [", `\t"v${version}",`];
	/**
	 * @param { string[] } files 
	 */
	const addFiles = (files) => {
		for (const file of files) {
			sourceLines.push(`\t"${file}",`);
		}
	};

	for (const [term, files] of assetGroup) {
		if (["font", "theme"].includes(term)) {
			addFiles(files);
			continue;
		}
		
		// const [type, subtype] = splitCache.get(term) ?? term.split(sep);
		// sourceLines.push(`\t/* ${subtype} ${type} start */`);
		addFiles(files);
		// sourceLines.push(`\t/* ${subtype} ${type} end */\n`);
	}

	sourceLines.push("];");
	// 末尾的换行符用于表示*nix下的留尾
	sourceLines.push("window.noname_skin_list = {};\n");

	return sourceLines.join("\n");
}

if (argv[1] === __filename) {
	// exit(await main(argv.slice(2)));
	main(argv.slice(2)).then(result => {
		exit(result);
	});
}
