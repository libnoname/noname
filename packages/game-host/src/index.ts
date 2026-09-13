import { chromium, type Browser, type BrowserContext, type Page } from "playwright-core";
import { hasRoomMemory } from "./resources.js";
export interface HostSpec { instanceId: string; roomId: string; modeId: string; build: string; characterPool?: { packs: string[]; banned: string[] }; members: { id: string; nickname: string; isAI?: boolean }[]; }
export interface HostEvent { type: string; code?: string; resources?: string[]; diagnostic?: string; accountId?: string; raw?: string; token?: string; deadline?: number; results?: { accountId: string; won: boolean | null }[]; }
export class GameHost {
  private instances = new Map<string, { context?: BrowserContext; page?: Page; ended: boolean; timer?: NodeJS.Timeout; fail?: (error: Error) => void }>();
  private browser?: Browser;
  private launching?: Promise<Browser>;
  private startupQueue: Promise<unknown> = Promise.resolve();
  private closing = false;
  private async getBrowser() {
    if (this.closing) throw new Error("HOST_CLOSED");
    if (this.browser?.isConnected()) return this.browser;
    if (!this.launching) {
      this.launching = chromium.launch({ headless: true, executablePath: this.options.executablePath, chromiumSandbox: process.env.CHROMIUM_SANDBOX !== "0", timeout: 45000,
        args: ["--disable-background-timer-throttling", "--disable-renderer-backgrounding", "--disable-gpu", "--mute-audio"] }).then(async browser => {
        if (this.closing) { await browser.close(); throw new Error("HOST_CLOSED"); }
        this.browser = browser;
        browser.on("disconnected", () => { if (this.browser === browser) this.browser = undefined; });
        return browser;
      }).finally(() => { this.launching = undefined; });
    }
    return this.launching;
  }
  constructor(private options: { clientUrl: string; executablePath?: string; maxInstances: number; }) {}
  async start(spec: HostSpec, emit: (event: HostEvent) => void): Promise<void> {
    if (this.instances.size >= this.options.maxInstances) throw new Error("SERVICE_BUSY");
    if (this.instances.has(spec.instanceId)) throw new Error("DUPLICATE_INSTANCE");
    if (this.closing) throw new Error("HOST_CLOSED");
    const instance: { context?: BrowserContext; page?: Page; ended: boolean; timer?: NodeJS.Timeout; fail?: (error: Error) => void } = { ended: false };
    this.instances.set(spec.instanceId, instance);
    let ready!: () => void, failed!: (error: Error) => void;
    const waiting = new Promise<void>((resolve, reject) => { ready = resolve; failed = reject; });
    instance.fail = failed;
    // Attach rejection handling immediately: Chromium launch itself may take time.
    void waiting.catch(() => {});
    // Only one room boots at a time; this avoids ten simultaneous compilation
    // and allocation spikes. A reservation still counts toward the room limit.
    const previous = this.startupQueue;
    let release!: () => void;
    this.startupQueue = new Promise<void>(resolve => { release = resolve; });
    let timeout: NodeJS.Timeout | undefined;
    try {
      await previous;
      if (instance.ended) throw new Error("HOST_CANCELLED");
      if (!(await hasRoomMemory())) throw new Error("HOST_MEMORY_PRESSURE");
      timeout = setTimeout(() => failed(new Error("HOST_BOOT_TIMEOUT")), 60000);
      const browser = await this.getBrowser();
      const context = instance.context = await browser.newContext({ viewport: { width: 800, height: 600 }, serviceWorkers: "block" });
      if (instance.ended) { await context.close(); throw new Error("HOST_CANCELLED"); }
      const origin = new URL(this.options.clientUrl).origin;
      await context.route("**/*", route => {
        const url = new URL(route.request().url());
        if (url.origin !== origin || /^\/(extension|api|ws|readFile|readFileAsText|writeFile|removeFile|createDir|removeDir|getFileList|checkFile|checkDir|src)(\/|$)/i.test(url.pathname)) return route.abort();
        // The host runs rules, never renders or plays the player's media.
        if (["image", "media", "font"].includes(route.request().resourceType()) || /^\/(image|audio|font)(\/|$)/i.test(url.pathname)) return route.abort();
        return route.continue();
      });
      const page = instance.page = await context.newPage();
      const reportFailure = (message: string) => {
        if (instance.ended) return;
        console.error("Game host runtime failure", { roomId: spec.roomId, message: message.slice(0, 1000) });
        failed(new Error(message)); emit({ type: "failed" });
      };
      page.on("dialog", dialog => { void dialog.dismiss().catch(() => {}); reportFailure("HOST_UNEXPECTED_DIALOG: " + dialog.message()); });
      page.on("pageerror", error => reportFailure("HOST_SCRIPT_ERROR: " + error.message));
      page.on("crash", () => { if (instance.ended) return; failed(new Error("HOST_CRASH")); emit({ type: "failed" }); });
      context.on("close", () => { if (!instance.ended) { failed(new Error("HOST_DISCONNECTED")); emit({ type: "failed" }); } });
      await page.exposeFunction("__nonameHostEmit", (event: HostEvent) => {
        if (instance.ended) return;
        if (event.type === "ready") ready();
        if (event.type === "failed") {
          console.error("Game host reported failure", { roomId: spec.roomId, instanceId: spec.instanceId, code: event.code,
            resources: event.resources, diagnostic: event.diagnostic?.slice(0, 2000) });
          failed(new Error(event.code || "HOST_FAILED"));
        }
        emit(event);
      });
      await page.addInitScript(data => {
        Object.defineProperty(window, "__nonameHost", { value: data, writable: false });
        localStorage.setItem("gplv3_noname_alerted", "true");
      }, spec);
      await page.goto(this.options.clientUrl, { waitUntil: "domcontentloaded", timeout: 45000 });
      await waiting;
      instance.timer = setTimeout(() => { emit({ type: "failed" }); void this.stop(spec.instanceId); }, 4 * 60 * 60 * 1000);
    } catch (error: any) {
      console.error("Game host startup failed", { roomId: spec.roomId, instanceId: spec.instanceId, message: String(error.message).slice(0, 300) });
      await this.stop(spec.instanceId); throw error;
    }
    finally { clearTimeout(timeout); release(); }
  }
  async receive(instanceId: string, message: { accountId: string; type: string; payload?: unknown }) {
    const instance = this.instances.get(instanceId);
    if (!instance?.page || instance.ended) throw new Error("INSTANCE_UNAVAILABLE");
    await instance.page.evaluate(data => {
      const receiver = (window as any).__nonameHostReceive;
      if (typeof receiver !== "function") throw new Error("HOST_NOT_READY");
      return receiver(data);
    }, message);
  }
  async stop(id: string) {
    const instance = this.instances.get(id);
    if (!instance) return;
    instance.ended = true; clearTimeout(instance.timer); instance.fail?.(new Error("HOST_CANCELLED"));
    try { await instance.context?.close(); }
    catch (error: any) { console.error("Game host close failed", { instanceId: id, message: String(error?.message || error).slice(0, 300) }); }
    finally { this.instances.delete(id); }
  }
  async close() {
    this.closing = true;
    await Promise.allSettled([...this.instances.keys()].map(id => this.stop(id)));
    await this.startupQueue;
    await this.launching?.catch(() => {});
    await this.browser?.close();
    this.browser = undefined;
  }
  get count() { return this.instances.size; }
}
