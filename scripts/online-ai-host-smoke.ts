import assert from "node:assert/strict";
import { createServer } from "node:http";
import { readFile, stat, mkdir, writeFile } from "node:fs/promises";
import { resolve, extname, relative, isAbsolute } from "node:path";
import { createReadStream } from "node:fs";
import { createRequire } from "node:module";

const root = resolve(process.env.HOST_RUNTIME_DIR || "dist-online-host");
const manifest = JSON.parse(await readFile(resolve(root, "deployment.json"), "utf8"));
const requireHost = createRequire(resolve("packages/game-host/package.json"));
const { chromium } = requireHost("playwright-core");
const server = createServer(async (req, res) => {
  try {
    const file = resolve(root, "." + decodeURIComponent(new URL(req.url!, "http://localhost").pathname));
    const delta = relative(root, file);
    if (delta.startsWith("..") || isAbsolute(delta) || !(await stat(file)).isFile()) throw new Error("Not found");
    const mime: Record<string, string> = { ".js": "application/javascript", ".css": "text/css", ".json": "application/json", ".html": "text/html", ".wasm": "application/wasm" };
    res.setHeader("Content-Type", mime[extname(file)] || "application/octet-stream");
    createReadStream(file).pipe(res);
  } catch { res.writeHead(404); res.end(); }
});
await new Promise<void>(resolve => server.listen(0, "127.0.0.1", resolve));
const url = `http://127.0.0.1:${(server.address() as any).port}/index.html`;
let browser;
const report: any[] = [];
try {
  browser = await chromium.launch({ headless: true, executablePath: process.env.CHROMIUM_PATH || (process.platform === "win32" ? "C:/Program Files/Google/Chrome/Application/chrome.exe" : undefined) });
  for (const [modeId, count, humanSeat] of [["identity", 2, 0], ["identity", 8, 3], ["doudizhu", 3, 0]] as const) {
    const context = await browser.newContext();
    try {
      await context.route("**/*", route => ["image", "media", "font"].includes(route.request().resourceType()) ? route.abort() : route.continue());
      const page = await context.newPage(), events: any[] = [], errors: string[] = [];
      page.on("pageerror", error => errors.push(error.stack || error.message));
      page.on("dialog", dialog => { errors.push(dialog.message()); void dialog.dismiss(); });
      const members = Array.from({ length: count }, (_, seat) => ({ id: `seat-${seat}`, nickname: seat === humanSeat ? "真人" : `AI ${seat + 1}号`, isAI: seat !== humanSeat }));
      await page.exposeFunction("__nonameHostEmit", (event: any) => events.push(event));
      await page.addInitScript(spec => {
        Object.defineProperty(window, "__nonameHost", { value: spec });
        localStorage.setItem("gplv3_noname_alerted", "true");
      }, { instanceId: `ai-smoke-${modeId}-${count}`, roomId: "ai-smoke", modeId, build: manifest.build, characterPool: { packs: ["standard"], banned: [] }, members });
      await page.goto(url);
      await page.waitForFunction(() => typeof (window as any).__nonameHostReceive === "function", undefined, { timeout: 60000 });
      await page.evaluate(async humanId => {
        const { game, lib } = await import("/noname.js");
        (window as any).__aiEngine = await import("/noname.js");
        lib.config.game_speed = "vvfast";
        const receive = (window as any).__nonameHostReceive;
        receive({ accountId: humanId, type: "attach", payload: { generation: 1 } });
        receive({ accountId: humanId, type: "inited", payload: { generation: 1 } });
      }, members[humanSeat].id);
      await page.waitForFunction(() => (window as any).__aiEngine.game.players.length > 0 && (window as any).__aiEngine.game.players.every(p => p.playerid), undefined, { timeout: 20000 });
      const seats = await page.evaluate(() => {
        const { game, lib } = (window as any).__aiEngine;
        return { clients: lib.node.clients.map(c => c.id), players: game.players.map(p => ({ id: p.playerid, remote: p.isOnline(), auto: !!p.isAuto })) };
      });
      assert.deepEqual(seats.clients, [members[humanSeat].id]);
      assert.equal(seats.players.filter(p => !p.remote && p.auto).length, count - 1);
      // Exercise the real human prompt, then use the public auto action so the
      // full match can finish unattended. AI seats never attach or send input.
      await page.waitForFunction(() => Object.keys((window as any).__aiEngine.lib.node.torespond).length > 0, undefined, { timeout: 30000 });
      await page.evaluate(humanId => (window as any).__nonameHostReceive({ accountId: humanId, type: "auto", payload: { generation: 1, enabled: true } }), members[humanSeat].id);
      await page.waitForFunction(() => (window as any).__aiEngine._status.over, undefined, { timeout: 180000 });
      const final = await page.evaluate(() => {
        const { game } = (window as any).__aiEngine;
        return { phases: game.phaseNumber, players: [...game.players, ...game.dead].map(p => ({ id: p.playerid, name: p.name, turns: p.getAllHistory().filter(h => h.isMe).length })) };
      });
      assert.equal(events.filter(e => e.type === "started").length, 1);
      assert.equal(events.filter(e => e.type === "failed").length, 0);
      assert.equal(events.filter(e => e.type === "finished").length, 1);
      assert.equal(events.find(e => e.type === "finished").results.length, count);
      assert.equal(events.filter(e => e.type === "choice" && e.accountId !== members[humanSeat].id).length, 0);
      assert(final.players.every(p => p.name));
      assert(final.players.some(p => p.id !== members[humanSeat].id && p.turns > 0));
      assert.deepEqual(errors, []);
      report.push({ modeId, count, humanSeat, ...final });
      console.log(JSON.stringify(report.at(-1)));
    } finally { await context.close(); }
  }
} finally {
  await mkdir(resolve("output/online-ai"), { recursive: true });
  await writeFile(resolve("output/online-ai/host-report.json"), JSON.stringify(report, null, 2));
  await browser?.close();
  await new Promise<void>(resolve => server.close(() => resolve()));
}
