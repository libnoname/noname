import { mkdir, writeFile } from "node:fs/promises";

// User-confirmed mapping: ZH49 is now supplied; XX skips folder 53 without
// reserving a text number; GM skips folder 71. No alternate guessed mappings.
if (process.argv.length > 2) throw new Error("本脚本直接生成已确认的对应关系，不再接受旧编号选项");
const folders = {};
const add = (group, folder, id) => { folders[group + "/" + folder] = id; };
const fill = (group, prefix, count, start) => {
    for (let n = 1; n <= count; n++) add(group, String(start + n - 1).padStart(2, "0"), prefix + String(n).padStart(2, "0"));
};
fill("1JZ", "JZ", 13, 1); fill("2MS", "MS", 14, 21); fill("3XD", "XD", 10, 31);
fill("4ZH", "ZH", 12, 40);
let n = 1;
for (let folder = 51; folder <= 61; folder++) {
    if (folder !== 53) add("5XX", String(folder), "XX" + String(n++).padStart(2, "0"));
}
n = 1;
for (let folder = 61; folder <= 74; folder++) {
    if (folder !== 71) add("6GM", String(folder), "GM" + String(n++).padStart(2, "0"));
}
fill("7YY", "YY", 14, 71); fill("8QS", "QS", 13, 81); fill("9EN", "EN", 4, 91);
for (const [group, prefix, count] of [["10D", "D", 5], ["11P", "P", 8], ["12B", "B", 4], ["13O", "H", 2], ["13O", "DY", 4], ["13O", "W", 4], ["13O", "L", 3], ["14TS", "TS", 6]]) {
    for (let n = 1; n <= count; n++) { const id = prefix + String(n).padStart(2, "0"); add(group, id, id); }
}
const config = {
    character: "hlhj_daiyu", source: "theme/绛珠仙子_配音", document: "VOICE-LINES-REVIEW.md",
    missing: ["XX11"], pendingGroups: [], folders,
};
const folder = new URL("../apps/core/extension/红楼幻境/voice/import/", import.meta.url);
await mkdir(folder, { recursive: true });
await writeFile(new URL("hlhj_daiyu.json", folder), JSON.stringify(config, null, 2) + "\n");
