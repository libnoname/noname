import fs from "node:fs/promises";
import path from "node:path";
import { parseArgs } from "node:util";

const ROOT_DIR = path.resolve(import.meta.dirname, "..");
const TEMPLATE_DIR = path.join(ROOT_DIR, "scripts", "extension-template", "default");
const TEMPLATE_DIR_WITH_VUE = path.join(ROOT_DIR, "scripts", "extension-template", "vue");
const EXTENSION_ROOT = path.join(ROOT_DIR, "packages", "extension");

async function copyTemplateDirectory(sourceDir: string, targetDir: string, vars: Record<string, string>) {
	const entries = await fs.readdir(sourceDir, { withFileTypes: true });
	await fs.mkdir(targetDir, { recursive: true });

	await Promise.all(
		entries.map(async entry => {
			const sourcePath = path.join(sourceDir, entry.name);
			const targetPath = path.join(targetDir, entry.name);
			if (entry.isDirectory()) {
				await copyTemplateDirectory(sourcePath, targetPath, vars);
				return;
			}
			if (entry.name === ".gitkeep") return;
			let content = await fs.readFile(sourcePath, "utf8");
			for (const [key, value] of Object.entries(vars)) {
				content = content.replaceAll(`{{${key}}}`, value);
			}
			await fs.writeFile(targetPath, content, "utf8");
		})
	);
}

async function main() {
	const {
		values: { author, vue: useVue, help },
		positionals: [extensionName],
	} = parseArgs({
		args: process.argv.slice(2),
		allowPositionals: true,
		options: {
			author: {
				type: "string",
				default: "无名玩家",
			},
			vue: {
				type: "boolean",
			},
			help: {
				type: "boolean",
				short: "h",
			},
		},
	});
	const helpMessage = `
用法:
    pnpm init:extension <name> [--author <author>] [--vue]

参数:
    <name>               扩展目录名与扩展名
    --author <author>    作者名，默认: 无名玩家
    --vue                启用 Vue
`;
	if (help) {
		console.log(helpMessage);
		return;
	}

	if (!extensionName) {
		throw new Error(`请输入扩展名\n` + helpMessage);
	}

	const targetDir = path.join(EXTENSION_ROOT, extensionName);
	await fs.stat(targetDir).then(
		() => {
			throw new Error(`扩展已存在: ${targetDir}`);
		},
		() => {}
	);

	await copyTemplateDirectory(TEMPLATE_DIR, targetDir, {
		EXTENSION_NAME: extensionName,
		AUTHOR: author,
	});

	if (useVue) {
		await copyTemplateDirectory(TEMPLATE_DIR_WITH_VUE, targetDir, {
			EXTENSION_NAME: extensionName,
			AUTHOR: author,
		});
	}

	console.log(`扩展初始化完成: packages/extension/${extensionName}，可执行以下命令：
pnpm i
pnpm dev
`);
}

main().catch(error => {
	const message = error instanceof Error ? error.message : String(error);
	console.error(`[init:extension] ${message}`);
	process.exit(1);
});
