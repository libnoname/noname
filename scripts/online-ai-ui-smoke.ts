import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";
import { mkdir } from "node:fs/promises";

const root = resolve(import.meta.dirname, "..");
const requireCore = createRequire(resolve(root, "apps/core/package.json"));
const requireHost = createRequire(resolve(root, "packages/game-host/package.json"));
const { createServer } = await import(pathToFileURL(requireCore.resolve("vite")).href);
const { chromium } = requireHost("playwright-core");
const server = await createServer({ configFile: resolve(root, "apps/core/vite.config.ts"), root: resolve(root, "apps/core"), server: { port: 8097, strictPort: true, open: false, hmr: false } });
await server.listen();
const component = await server.transformRequest("/noname/online/ui/OnlineLobby.vue");
const vueUrl = component!.code.match(/from\s+["']([^"']*\/vue\.js[^"']*)["']/)?.[1];
if (!vueUrl) throw new Error("Cannot resolve component Vue runtime");
let browser;
try {
  browser = await chromium.launch({ headless: true, executablePath: process.env.CHROMIUM_PATH || (process.platform === "win32" ? "C:/Program Files/Google/Chrome/Application/chrome.exe" : undefined) });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errors: string[] = [];
  page.on("pageerror", error => { errors.push(error.message); console.error(error.message); });
  page.on("console", message => { if (message.type() === "error") console.error(message.text()); });
  await page.route("**/@vite/client", route => route.fulfill({ contentType: "application/javascript", body: `
    const styles = new Map();
    export const createHotContext = () => ({accept(){},acceptExports(){},dispose(){},prune(){},on(){},off(){},send(){},invalidate(){},data:{}});
    export const injectQuery = url => url;
    export function updateStyle(id, css) {
      let style = styles.get(id);
      if (!style) { style = document.createElement('style'); styles.set(id, style); document.head.append(style); }
      style.textContent = css;
    }
    export function removeStyle(id) { styles.get(id)?.remove(); styles.delete(id); }
  ` }));
  // Render the production component with an in-memory platform transport.
  // Authorization and persistence are covered by online-ai-rooms.test.ts.
  await page.route("**/noname/online/client*", route => route.fulfill({ contentType: "application/javascript", body: `
    import { reactive } from '${vueUrl}';
    export const onlineState = reactive({ account:{id:'owner',nickname:'房主'}, status:'connected', chat:[], social:{friends:[],blocked:[],invites:[]}, match:{state:'idle'},
      room:{id:'test',code:'ABC123',name:'好友切磋',modeId:'identity',state:'waiting',revision:1,ownerId:'owner',capacity:4,characterPool:{packs:['standard'],banned:[]},members:[{id:'owner',nickname:'房主',seat:0,ready:false,online:true}]} });
    window.__roomState = onlineState; window.__commands = [];
    export const restoreAccount = async () => {};
    export const disconnectPlatform = () => {}, connectPlatform = async () => {}, onlineId = () => 'test-id', prepareRoomNavigation = async () => {};
    export const searchRooms = async () => {};
    export const onOnlineEvent = () => () => {};
    export const login = async () => {}, logout = async () => {}, copyOnlineText = async () => {}, loadSocial = async () => {}, api = async () => ({});
    export async function command(type,payload) {
      window.__commands.push({type,payload}); const room = onlineState.room;
      if (type === 'room.ai') {
        if (payload.enabled) for (const seat of payload.seats) room.members.push({id:'ai:'+seat,nickname:'AI '+(seat+1)+'号',seat,isAI:true,ready:true,online:false});
        else room.members = room.members.filter(m => !payload.seats.includes(m.seat));
      } else if (type === 'room.ready') room.members[0].ready = payload.ready;
      room.revision++; return room;
    }
  ` }));
  await page.route("**/__ai_ui.html", route => route.fulfill({ contentType: "text/html", body: `
    <meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>body{margin:0;background:#142827}#splash{min-height:100vh}</style><div id="splash"><div id="app"></div></div>
    <script type="module">
      import {createApp} from '${vueUrl}';
      import {lib} from '/noname.js';
      import config from '/game/config.json';
      import Lobby from '/noname/online/ui/OnlineLobby.vue';
      import '/noname/online/ui/online.css';
      lib.config = config; lib.assetURL = '/';
      createApp(Lobby,{modeId:'identity'}).mount('#app');
    </script>
  ` }));
  await page.goto("http://127.0.0.1:8097/__ai_ui.html");
  await page.getByRole("button", { name: "为 3 号位添加 AI", exact: true }).click().catch(async error => { console.error(await page.locator('body').innerText()); throw error; });
  assert.equal(await page.getByText("AI · 自动参战", { exact: true }).count(), 1);
  await page.getByRole("button", { name: "移除 3 号位 AI", exact: true }).click();
  assert.equal(await page.getByText("AI · 自动参战", { exact: true }).count(), 0);
  await page.getByRole("button", { name: "AI 补满空位", exact: true }).click();
  assert.equal(await page.getByText("AI · 自动参战", { exact: true }).count(), 3);
  assert(await page.getByRole("button", { name: "开始对局", exact: true }).isDisabled());
  await page.getByRole("button", { name: "准备就绪", exact: true }).click();
  assert(await page.getByRole("button", { name: "开始对局", exact: true }).isEnabled());
  await mkdir(resolve(root, "output/online-ai"), { recursive: true });
  await page.screenshot({ path: resolve(root, "output/online-ai/desktop.png"), fullPage: true });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole("button", { name: "移除 4 号位 AI", exact: true }).click();
  await page.screenshot({ path: resolve(root, "output/online-ai/mobile.png"), fullPage: true });
  assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
  await page.evaluate(() => { (window as any).__roomState.account.id = "guest"; });
  assert.equal(await page.getByRole("button", { name: /添加 AI|移除.*号位 AI|AI 补满空位/ }).count(), 0);
  await page.evaluate(() => { (window as any).__roomState.account.id = "owner"; (window as any).__roomState.room.state = "in_game"; });
  assert.equal(await page.getByRole("button", { name: /添加 AI|移除.*号位 AI|AI 补满空位/ }).count(), 0);
  const commands = await page.evaluate(() => (window as any).__commands);
  assert.deepEqual(commands[0], { type: "room.ai", payload: { roomId: "test", revision: 1, seats: [2], enabled: true } });
  assert.deepEqual(errors, []);
  console.log("AI 房间 UI：逐席添加/移除、一键补满、准备开局、房主可见性、桌面及手机布局全部通过");
} finally { await browser?.close(); await server.close(); }
