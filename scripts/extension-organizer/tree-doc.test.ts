import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import groups from "../../apps/core/game/extension-groups.json";

test("review tree lists all eligible packages and character IDs, excluding protected packages", async () => {
  const source = await fs.readFile("docs/current-extension-tree.md", "utf8");
  const marker = "<!-- GENERATED:EXTENSION_CHARACTER_TREE:START -->";
  assert.ok(source.includes(marker));
  const section = source.slice(source.indexOf(marker));
  assert.match(section, /待评估扩展（12）/);
  assert.match(section, /含武将定义（12）/);
  assert.match(section, /无静态武将定义（0）/);
  assert.match(section, /清瑶（ID："qy_qyqingyaoxuying"）/);
  assert.doesNotMatch(section, /ID："(?:character|translate|characterPrefix)"/);
  const listed = [...section.matchAll(/apps\/core\/extension\/([^/\r\n]+)\//g)].map(match => match[1]);
  assert.equal(listed.length, 12);
  assert.equal(new Set(listed).size, 12);
  for (const name of listed) await fs.access(path.join("apps/core/extension", name));
  const excluded = new Set(["名将杀", "英雄杀", ...groups.flatMap(group => group.members)]);
  for (const name of listed) assert.ok(!excluded.has(name), `${name} should be excluded`);
  const counts = [...section.matchAll(/apps\/core\/extension\/[^/]+\/（(\d+) 个定义/g)].map(match => Number(match[1]));
  assert.equal(counts.reduce((sum, count) => sum + count, 0), 1487);
});

test("explicitly deleted cleanup backup is absent while source archives remain", async () => {
  const exists = (file: string) => fs.access(file).then(() => true, () => false);
  assert.equal(await exists("扩展包/扩展/整理备份/20260909-apk-cleanup"), false);
  assert.equal(await exists("扩展包/扩展/整理备份"), false);
  assert.equal(await exists("扩展包/扩展/手杀武将（木牛流马、蒋婉）[清瑶版可便捷导入].zip"), true);
  assert.equal(await exists("扩展包/扩展/补充包/仿官复刻V3.2完整包(势程普,清瑶版可快捷导入).zip"), true);
});
