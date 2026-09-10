/** One-shot physical restructure requested on 2026-09-09. No backup is created. */
import fs from "node:fs/promises";
import path from "node:path";
import policy from "../apps/core/game/extension-restructure.json";

const root = path.resolve("apps/core/extension");
const merges: Record<string, string[]> = {
  "风云浮生明辉月": ["风云变幻", "浮生晓明月", "辉烬卧床包", "山海异志将包"],
  "觉醒突破": ["极限觉醒", "纪元突破【谋】"],
  "清瑶葭绮": ["假装无敌", "渐意新生", "玉言·离光", "云游四海"],
  "群雄并起": ["群雄并起", "强标包", "三国名医", "杀海拾遗", "玩点论杀", "新·将", "阳光包"],
};
const renamed: Record<string, string> = policy.renamed;
const textExtensions = new Set([".js", ".ts", ".css", ".json", ".html", ".htm", ".md", ".txt"]);
const exists = (file: string) => fs.access(file).then(() => true, () => false);
const exact = (name: string) => {
  if (!name || name.includes("/") || name.includes("\\") || name === "." || name === "..") throw new Error(`Invalid extension name: ${name}`);
  const result = path.resolve(root, name);
  if (path.dirname(result) !== root) throw new Error(`Path escaped extension root: ${result}`);
  return result;
};
async function walk(directory: string): Promise<string[]> {
  const output: string[] = [];
  for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
    if (entry.isSymbolicLink()) throw new Error(`Refuse linked content: ${path.join(directory, entry.name)}`);
    const item = path.join(directory, entry.name);
    if (entry.isDirectory()) output.push(...await walk(item)); else output.push(item);
  }
  return output;
}
async function rewriteMember(directory: string, target: string, source: string, layout = "members") {
  const base = `${target}/${layout}/${source}`;
  for (const file of await walk(directory)) {
    if (!textExtensions.has(path.extname(file).toLowerCase())) continue;
    let text = await fs.readFile(file, "utf8");
    const before = text;
    text = text.split(`extension/${source}/`).join(`extension/${base}/`);
    text = text.split(`extension/${source}'`).join(`extension/${base}'`);
    text = text.split(`extension/${source}"`).join(`extension/${base}"`);
    text = text.split(`ext:${source}`).join(`ext:${base}`);
    text = text.split(`die:${source}:`).join(`die:ext:${base}/`);
    text = text.split(`../../../${source}/`).join(`../../../${base}/`);
    if (text !== before) await fs.writeFile(file, text);
  }
}
async function rewriteRename(directory: string, from: string, to: string) {
  for (const file of await walk(directory)) {
    if (!textExtensions.has(path.extname(file).toLowerCase())) continue;
    const before = await fs.readFile(file, "utf8");
    const after = before.split(from).join(to);
    if (after !== before) await fs.writeFile(file, after);
  }
}
function wrapper(name: string, members: string[]) {
  return `import { lib, game, ui, get, ai, _status } from "noname";\nimport { createMergedExtension } from "../_merge.js";\nexport const type = "extension";\nexport default function (...args) {\n    return createMergedExtension(${JSON.stringify(name)}, ${JSON.stringify(members)}, args, import.meta.url);\n}\n`;
}

// Validate the entire source/target set before the first move or deletion.
for (const name of policy.removed) if (!await exists(exact(name))) throw new Error(`Missing removal source: ${name}`);
for (const [from, to] of Object.entries(renamed)) {
  if (!await exists(exact(from))) throw new Error(`Missing rename source: ${from}`);
  if (await exists(exact(to))) throw new Error(`Rename target exists: ${to}`);
}
for (const [target, members] of Object.entries(merges)) {
  if (target !== "群雄并起" && await exists(exact(target))) throw new Error(`Merge target exists: ${target}`);
  for (const member of members) if (!await exists(exact(member))) throw new Error(`Missing merge member: ${member}`);
}
if (!await exists(exact("手杀武将")) || !await exists(exact("手杀补全"))) throw new Error("Missing handkill merge source");

// Remove assets for characters explicitly discarded from the two retained small packs.
for (const file of await fs.readdir(exact("蔡阳与友"))) if (!new Set(["extension.js", "CYZi.jpg"]).has(file)) await fs.rm(path.join(exact("蔡阳与友"), file), { recursive: true, force: true });
for (const file of await fs.readdir(exact("超神赵云"))) if (!new Set(["extension.js"]).has(file)) await fs.rm(path.join(exact("超神赵云"), file), { recursive: true, force: true });

// Rename standalone packs and rewrite their extension name, resource paths, and metadata.
for (const [from, to] of Object.entries(renamed)) {
  await fs.rename(exact(from), exact(to));
  await rewriteRename(exact(to), from, to);
}

// Create physical parent packs and move every complete source below members/.
for (const [target, members] of Object.entries(merges)) {
  const targetPath = exact(target);
  const stagedBase = target === "群雄并起" ? exact("群雄并起.__source") : undefined;
  if (stagedBase) await fs.rename(targetPath, stagedBase);
  await fs.mkdir(path.join(targetPath, "members"), { recursive: true });
  for (const member of members) {
    const from = member === target && stagedBase ? stagedBase : exact(member);
    const destination = path.join(targetPath, "members", member);
    await fs.rename(from, destination);
    await rewriteMember(destination, target, member);
  }
  await fs.writeFile(path.join(targetPath, "extension.js"), wrapper(target, members));
  await fs.writeFile(path.join(targetPath, "info.json"), JSON.stringify({ name: target, author: "原扩展作者", version: "1", intro: `实体合并：${members.join("、")}` }, null, 2) + "\n");
}

// Handkill already has a specialized additive composer.
const handkillMember = path.join(exact("手杀武将"), "apk", "手杀补全");
if (await exists(handkillMember)) throw new Error("Handkill member target exists");
await fs.rename(exact("手杀补全"), handkillMember);
await rewriteMember(handkillMember, "手杀武将", "手杀补全", "apk");

// Delete only the exact, prevalidated directories explicitly requested.
for (const name of policy.removed) await fs.rm(exact(name), { recursive: true, force: false });

const directories = (await fs.readdir(root, { withFileTypes: true })).filter(entry => entry.isDirectory()).length;
if (directories !== 50) throw new Error(`Unexpected final directory count: ${directories}`);
console.log(JSON.stringify({ status: "applied", directories, removed: policy.removed.length, renamed, merges, handkill: "手杀补全" }, null, 2));
