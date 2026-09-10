/** Generate the Markdown inventory used for extension consolidation reviews. */
import fs from "node:fs/promises";
import path from "node:path";
import ts from "typescript";
import groups from "../apps/core/game/extension-groups.json";
import registry from "../apps/core/game/organized-extensions.json";
import restructure from "../apps/core/game/extension-restructure.json";
import characterMenu from "../apps/core/game/character-menu-groups.json";

const extensionRoot = path.resolve("apps/core/extension");
const excluded = new Set(["名将杀", "英雄杀", ...restructure.removed, ...groups.flatMap(group => group.members)]);
const deepScan = new Set(["3D精选", "活动武将", "风云浮生明辉月", "觉醒突破", "清瑶葭绮", "群雄并起", "手杀武将"]);
const skippedParts = new Set(["dist", "node_modules", "audio", "image", "images", "assets", "asset", "font", "fonts", "pixi", "skin"]);
const keyOf = (name: ts.PropertyName | undefined) => {
  if (!name) return undefined;
  if (ts.isIdentifier(name) || ts.isStringLiteralLike(name) || ts.isNumericLiteral(name)) return name.text;
  return undefined;
};

async function sourceFiles(root: string, deep: boolean, relative = ""): Promise<string[]> {
  const output: string[] = [];
  for (const entry of await fs.readdir(path.join(root, relative), { withFileTypes: true })) {
    const rel = path.join(relative, entry.name);
    if (entry.isDirectory()) {
      if (root.endsWith("群雄并起") && /members[\\/]杀海拾遗[\\/](character|card)[\\/]/.test(rel) && characterMenu.removed.includes(entry.name)) continue;
      if (deep && !skippedParts.has(entry.name.toLowerCase())) output.push(...await sourceFiles(root, true, rel));
    } else if (/\.(?:js|ts)$/i.test(entry.name) && (deep || ["extension.js", "extension.ts", "apk-original.js", "base.js"].includes(entry.name))) {
      output.push(rel);
    }
  }
  return output;
}

function inspect(source: string, filename: string, ids: Set<string>, stringValues: [string, string, number][]) {
  const ast = ts.createSourceFile(filename, source, ts.ScriptTarget.Latest, true, filename.endsWith(".ts") ? ts.ScriptKind.TS : ts.ScriptKind.JS);
  const metadataKeys = new Set(["character", "translate", "characterPrefix", "characterSort", "characterTitle", "characterIntro", "characterFilter", "skill", "card"]);
  const collectDictionary = (dictionary: ts.ObjectLiteralExpression) => {
    for (const member of dictionary.properties) {
      if (!ts.isPropertyAssignment(member)) continue;
      const id = keyOf(member.name);
      if (id && !metadataKeys.has(id) && (ts.isArrayLiteralExpression(member.initializer) || ts.isObjectLiteralExpression(member.initializer))) ids.add(id);
    }
  };
  function visit(node: ts.Node) {
    if (ts.isPropertyAssignment(node)) {
      const key = keyOf(node.name);
      if (key && (ts.isStringLiteralLike(node.initializer) || ts.isNoSubstitutionTemplateLiteral(node.initializer))) {
        const container = node.parent;
        const owner = container.parent;
        const ownerName = ts.isPropertyAssignment(owner) || ts.isVariableDeclaration(owner) ? keyOf(owner.name as ts.PropertyName) : undefined;
        const translationFile = /(?:^|[\\/])translate(?:s)?\.js$/i.test(filename);
        const priority = ownerName === "translate" || ownerName === "translates" ? 3 : translationFile ? 2 : 0;
        if (priority) stringValues.push([key, node.initializer.text, priority]);
      }
      if (key === "character" && ts.isObjectLiteralExpression(node.initializer)) {
        const directKeys = new Set(node.initializer.properties.map((member: any) => keyOf(member.name)).filter(Boolean));
        const siblings = ts.isObjectLiteralExpression(node.parent) ? new Set(node.parent.properties.map((member: any) => keyOf(member.name)).filter(Boolean)) : new Set<string>();
        if (!directKeys.has("character") && !directKeys.has("translate") && (siblings.has("translate") || siblings.has("characterSort") || siblings.has("name"))) collectDictionary(node.initializer);
      }
    } else if (path.basename(filename).toLowerCase() === "character.js" && ts.isExportAssignment(node) && ts.isObjectLiteralExpression(node.expression)) {
      collectDictionary(node.expression);
    } else if (path.basename(filename).toLowerCase() === "character.js" && ts.isVariableDeclaration(node) && keyOf(node.name as ts.Identifier) === "characters" && ts.isObjectLiteralExpression(node.initializer)) {
      collectDictionary(node.initializer);
    }
    ts.forEachChild(node, visit);
  }
  visit(ast);
}

const dirs = (await fs.readdir(extensionRoot, { withFileTypes: true }))
  .filter(entry => entry.isDirectory() && !excluded.has(entry.name))
  .map(entry => entry.name)
  .sort((a, b) => a.localeCompare(b, "zh-CN"));

const records = [];
for (const name of dirs) {
  const row: any = registry.find(item => item.name === name);
  const ids = new Set<string>(row?.characters || []);
  const translations = new Map<string, string>();
  const stringValues: [string, string, number][] = [];
  const origins: [string, number][] = [];
  const files = await sourceFiles(path.join(extensionRoot, name), deepScan.has(name));
  for (const file of files) {
    try {
      const before = ids.size;
      inspect(await fs.readFile(path.join(extensionRoot, name, file), "utf8"), file, ids, stringValues);
      if (ids.size > before) origins.push([file.replaceAll("\\", "/"), ids.size - before]);
    }
    catch (error) { console.error(`Skipped unparsable ${name}/${file}:`, error); }
  }
  const priorities = new Map<string, number>();
  for (const [key, value, priority] of stringValues) {
    if (ids.has(key) && value.trim() && priority >= (priorities.get(key) || 0)) {
      translations.set(key, value.replace(/<[^>]+>/g, "").trim());
      priorities.set(key, priority);
    }
  }
  records.push({ name, ids: [...ids], translations, files, origins, registered: !!row, runtimeCount: row?.characters?.length });
}

const characterPacks = records.filter(record => record.ids.length);
const nonCharacterPacks = records.filter(record => !record.ids.length);
if (process.argv.includes("--summary")) {
  console.log(JSON.stringify({ directories: dirs.length, characterPacks: characterPacks.map(record => [record.name, record.ids.length]), nonCharacterPacks: nonCharacterPacks.map(record => record.name), totalDefinitions: characterPacks.reduce((sum, record) => sum + record.ids.length, 0) }, null, 2));
  process.exit(0);
}
if (process.argv.includes("--origins")) {
  console.log(JSON.stringify(records.filter(record => record.origins.length).map(record => ({ name: record.name, origins: record.origins })), null, 2));
  process.exit(0);
}
const line = (id: string, translations: Map<string, string>) => {
  const display = translations.get(id);
  const visibleId = JSON.stringify(id);
  return display && display !== id ? `${display}（ID：${visibleId}）` : `ID：${visibleId}`;
};
const output: string[] = [
  "<!-- GENERATED:EXTENSION_CHARACTER_TREE:START -->",
  "## 五、除 PXLNGU／名将杀／英雄杀外的扩展与武将明细",
  "",
  `生成范围：扫描 \`apps/core/extension/\` 当前 ${dirs.length} 个符合条件的一级目录。排除了 PXLNGU 分组内的 ${groups.flatMap(group => group.members).length} 个成员，以及“名将杀”“英雄杀”。`,
  "",
  "说明：这里列的是扩展内部的武将定义（包括隐藏形态、变身形态和 BOSS），所以数量不一定等于不同人物数。中文名取自扩展翻译，括号内保留真实 ID，方便判断冲突、合并和删除。动态生成且源码中没有静态字典的内容可能无法枚举；已单独标明无静态武将定义的包。",
  "",
  "```text",
  `待评估扩展（${dirs.length}）`,
  `├─ 含武将定义（${characterPacks.length}）`,
];
characterPacks.forEach((record, packageIndex) => {
  const lastPackage = packageIndex === characterPacks.length - 1;
  const branch = lastPackage ? "│  └─" : "│  ├─";
  const child = lastPackage ? "│     " : "│  │  ";
  let countLabel = `${record.ids.length} 个定义`;
  if (record.name === "手杀武将" && record.runtimeCount !== record.ids.length) countLabel += `，登记启用清单 ${record.runtimeCount} 个`;
  output.push(`${branch} apps/core/extension/${record.name}/（${countLabel}）`);
  record.ids.forEach((id, index) => {
    const isLast = index === record.ids.length - 1;
    const pending = record.name === "手杀武将" && ["s_weiyan", "s_weiyan2", "s_weiyan3", "hy_zhouyu", "hy_zhouyu2", "hy_zhouyu3", "hy_xiaoqiao"].includes(id) ? "【待兼容，未加载】" : "";
    output.push(`${child}${isLast ? "└─" : "├─"} ${line(id, record.translations)}${pending}`);
  });
});
output.push(`└─ 无静态武将定义（${nonCharacterPacks.length}）`);
nonCharacterPacks.forEach((record, index) => {
  output.push(`   ${index === nonCharacterPacks.length - 1 ? "└─" : "├─"} apps/core/extension/${record.name}/`);
});
output.push("```", "", "### 使用建议", "", "- 优先合并“含武将定义”里的小包；先用 ID 检查与目标包的冲突，再迁移图片、音频、技能和翻译。", "- “无静态武将定义”表示扫描不到独立武将字典，不代表目录可以直接删除；它可能是玩法、卡牌、技能补丁或工具。", "- 手杀武将的 7 个势魏延相关定义只是物理收纳，仍处于待兼容状态，不应按可玩武将计算。", "- 清瑶葭绮中的“清瑶”会按真实 ID 列出；它是合并包内武将，不是一级扩展。", "<!-- GENERATED:EXTENSION_CHARACTER_TREE:END -->", "");
const generated = output.join("\n");
if (process.argv.includes("--write")) {
  const document = path.resolve("docs/current-extension-tree.md");
  const current = await fs.readFile(document, "utf8");
  const region = /<!-- GENERATED:EXTENSION_CHARACTER_TREE:START -->[\s\S]*?<!-- GENERATED:EXTENSION_CHARACTER_TREE:END -->\r?\n?/;
  if (!region.test(current)) throw new Error("tree.md 中未找到可更新的生成区域");
  const next = current.replace(region, generated);
  if (next !== current) await fs.writeFile(document, next);
  console.log(`已更新 ${document}`);
} else console.log(generated);
