//每次提交commit后自动更新
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
//仓库根目录
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

//自动更新info.json中的lastEditTime
const infoPath = path.join(rootDir, 'info.json');
const info = JSON.parse(fs.readFileSync(infoPath, 'utf8'));
const now = new Date();
const yyyy = now.getFullYear();
const mm = String(now.getMonth() + 1).padStart(2, '0');
const dd = String(now.getDate()).padStart(2, '0');
const hh = String(now.getHours()).padStart(2, '0');
const mi = String(now.getMinutes()).padStart(2, '0');
const ss = String(now.getSeconds()).padStart(2, '0');
info.lastEditTime = `${yyyy}/${mm}/${dd} ${hh}:${mi}:${ss}`;
fs.writeFileSync(infoPath, JSON.stringify(info, null, 4), 'utf8');
//终端输出，给鸟鸟看的
console.log(`本次commit提交时间: ${info.lastEditTime}`);

//自动更新file.json
const walkFiles = dir => {
    let result = [];
    //排除目录/文件
    const ignoreNames = new Set(['.git', '.github', 'node_modules', 'update_temp', 'update_backup']);
    const ignoreFiles = new Set(['info.json', 'js/file.json']);
    for (const name of fs.readdirSync(dir)) {
        if (ignoreNames.has(name)) continue;
        const fullPath = path.join(dir, name);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) result.push(...walkFiles(fullPath));
        else if (stat.isFile()) {
            const relativePath = path.relative(rootDir, fullPath).replace(/\\/g, '/');
            if (ignoreFiles.has(relativePath)) continue;
            result.push({
                path: relativePath,
                size: stat.size,
            });
        }
    }
    return result;
};
const files = walkFiles(rootDir).sort((a, b) => a.path.localeCompare(b.path));
const fileJsonPath = path.join(rootDir, 'js', 'file.json');
fs.writeFileSync(fileJsonPath, JSON.stringify({ files }, null, 4), 'utf8');
//终端输出，给鸟鸟看的
console.log(`已更新file.json，共${files.length}个文件`);
