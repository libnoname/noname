import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { createWriteStream } from "node:fs";
import { resolve, relative, join } from "node:path";
import { finished } from "node:stream/promises";
import { createHash } from "node:crypto";
import yazl from "yazl";
import yauzl from "yauzl";

const root = resolve(import.meta.dirname, "..");
const source = resolve(root, "apps/core/extension/红楼幻境");
const output = resolve(root, "output/红楼幻境");
const info = JSON.parse(await readFile(join(source, "info.json"), "utf8"));
const zipPath = join(output, `${info.name}-${info.version}.zip`);
await mkdir(output, { recursive: true });
const entries = [];
async function collect(dir) {
    for (const item of (await readdir(dir, { withFileTypes: true })).sort((a, b) => a.name.localeCompare(b.name))) {
        const path = join(dir, item.name);
        // Original video masters are retained locally, never duplicated in the release.
        if (relative(source, path).replaceAll("\\", "/") === "theme/动态资源") continue;
        if (item.isDirectory()) await collect(path);
        else if (item.isFile()) entries.push({ path, name: relative(source, path).replaceAll("\\", "/"), data: await readFile(path) });
        else throw new Error(`不打包符号链接或特殊文件：${path}`);
    }
}
await collect(source);
for (const required of ["extension.js", "info.json", "README.md", "hlhj_daiyu.svg"]) {
    if (!entries.some(e => e.name === required)) throw new Error(`缺少文件：${required}`);
}
const zip = new yazl.ZipFile();
const stream = createWriteStream(zipPath);
zip.outputStream.pipe(stream);
for (const entry of entries) zip.addBuffer(entry.data, entry.name, { mtime: new Date("2026-01-01T00:00:00Z"), mode: 0o100644 });
zip.end();
await finished(stream);
const checked = [];
await new Promise((done, reject) => {
    yauzl.open(zipPath, { lazyEntries: true }, (error, archive) => {
        if (error) return reject(error);
        archive.on("error", reject);
        archive.on("entry", entry => {
            const original = entries.find(e => e.name === entry.fileName);
            if (!original) { archive.close(); return reject(new Error(`意外条目：${entry.fileName}`)); }
            archive.openReadStream(entry, (error, input) => {
                if (error) return reject(error);
                const chunks = [];
                input.on("data", chunk => chunks.push(chunk));
                input.on("error", reject);
                input.on("end", () => {
                    if (!Buffer.concat(chunks).equals(original.data)) { archive.close(); return reject(new Error(`内容不一致：${entry.fileName}`)); }
                    checked.push(entry.fileName); archive.readEntry();
                });
            });
        });
        archive.on("end", done);
        archive.readEntry();
    });
});
if (checked.length !== entries.length) throw new Error("ZIP文件数不符");
const data = await readFile(zipPath);
const sha256 = createHash("sha256").update(data).digest("hex");
await writeFile(join(output, "package-report.json"), JSON.stringify({ name: info.name, version: info.version, bytes: data.length, sha256, entries: checked, verified: true }, null, 2));
console.log(JSON.stringify({ zipPath, bytes: data.length, sha256, entries: checked }, null, 2));
