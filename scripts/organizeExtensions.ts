import path from "node:path";
import { parseArgs } from "node:util";
import { organize } from "./extension-organizer/index.js";

const root = path.resolve(import.meta.dirname, "..");
const { values } = parseArgs({ options: { input: { type: "string" }, output: { type: "string" }, "dry-run": { type: "boolean" }, verify: { type: "boolean" }, help: { type: "boolean", short: "h" } } });
if (values.help)
	console.log(`扩展包整理器（不安装扩展）
pnpm extensions:organize [--dry-run] [--verify]
  --input <目录>    默认：扩展包/武将扩展
  --output <目录>   默认：扩展包/整理结果
  --dry-run        仅分析并预览，不修改输出（使用临时缓存）
  --verify         重新核验所有输入、缓存和输出，不依赖时间戳
输出：packages/*.zip、整理报告.md、report.json、manifest.json
详见 docs/extension-organizer.md`);
else {
	try {
		const result = await organize({ input: values.input ? path.resolve(values.input) : path.join(root, "扩展包/武将扩展"), output: values.output ? path.resolve(values.output) : path.join(root, "扩展包/整理结果"), dryRun: values["dry-run"], verify: values.verify, log: console.log });
		console.log(`完成${result.dryRun ? "预览" : "整理"}：输出 ${result.outputs}，新生成 ${result.built}，复用 ${result.reused}，跳过 ${result.rows.filter(r => r.status === "跳过").length}，耗时 ${(result.elapsedMs / 1000).toFixed(1)} 秒。`);
		if (result.dryRun) for (const row of result.rows) console.log(`${row.status} | ${row.source} | ${row.extension ?? ""} | ${row.reason ?? `保留 ${row.kept}，剔除 ${row.removed?.length ?? 0}`}`);
	} catch (e) {
		console.error(e instanceof Error ? e.message : e);
		process.exitCode = 1;
	}
}
