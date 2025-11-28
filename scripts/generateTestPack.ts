import { execSync } from "node:child_process";
import path from "node:path/posix";
import fs from "fs-extra";
import JSZip from "jszip";

interface FileList {
	added: Set<string>;
	modified: Set<string>;
	deleted: Set<string>;
}

const getDiff = (baseRef?: string, targetRef = "HEAD"): FileList => {
	baseRef ??= execSync("git describe --tags --abbrev=0").toString().trim();
	const output = execSync(`git diff --name-status ${baseRef}...${targetRef}`).toString().trim();
	const fileList: FileList = { added: new Set(), modified: new Set(), deleted: new Set() };

	if (!output) return fileList;

	for (const line of output.split("\n")) {
		const [status, filePath] = line.trim().split(/\s+/);

		switch (status[0]) {
			case "A":
				fileList.added.add(filePath);
				break;
			case "M":
				fileList.modified.add(filePath);
				break;
			case "D":
				fileList.deleted.add(filePath);
				break;
			case "R": {
				const [, oldPath, newPath] = line.trim().split(/\s+/);
				fileList.deleted.add(oldPath);
				fileList.added.add(newPath);
				break;
			}
			default:
				break;
		}
	}

	return fileList;
};

const formatDate = (date = new Date()) => {
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, "0"); // getMonth() 返回的是0-11，所以需要加1
	const day = String(date.getDate()).padStart(2, "0");
	return `${year}${month}${day}`;
};

const addFolderToZip = (zip: JSZip, base: string, filter: (p: string) => boolean = () => true) => {
	const _addFolderToZip = (zip: JSZip, folderPath: string) => {
		const files = fs.readdirSync(path.join(base, folderPath));

		files.forEach(fileName => {
			const filePath = path.join(folderPath, fileName);
			const fileStat = fs.statSync(path.join(base, filePath));

			if (fileStat.isDirectory()) {
				const folder = zip.folder(fileName);
				_addFolderToZip(folder, filePath);
				if (!Object.keys(folder.files).some(i => i !== folder.root && i.startsWith(folder.root))) {
					zip.remove(fileName);
				}
			} else {
				if (!filter(filePath)) return;
				const fileData = fs.readFileSync(path.join(base, filePath));
				zip.file(fileName, fileData);
			}
		});
	};
	_addFolderToZip(zip, "");
};

export function generateTestPack(diff: boolean) {
	let filter: (p: string) => boolean = () => true;
	if (diff) {
		const diff = getDiff();
		filter = p => {
			if (["audio", "image", "font"].some(i => p.startsWith(i))) {
				return diff.added.has(p) || diff.modified.has(p);
			}
			if (p.startsWith("extension") && !["extension/boss", "extension/cardpile", "extension/coin"].some(i => p.startsWith(i))) {
				return diff.added.has(p) || diff.modified.has(p);
			}
			if (p.startsWith("noname-server.exe")) return false;
			return true;
		};
	}
	const zip = new JSZip();
	console.log("打包 " + `测试包-${formatDate()}.zip`);
	addFolderToZip(zip, "dist", filter);
	const result = zip.generate({ type: "nodebuffer" });
	fs.ensureDirSync("output");
	fs.writeFileSync(`output/测试包-${formatDate()}.zip`, result);
}
