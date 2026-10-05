/**
 * iOS「边玩边下」：把瘦身包裁掉的素材改成就地按需下载。
 *
 * ---
 *
 * ## 要解决的问题
 *
 * iOS 侧载包（AltStore / SideStore）装不下全量资源：`audio/skill`(470M) +
 * `image/character`(390M) + `audio/die`(111M) 接近 1GB，而超过 300MB 的 ipa
 * 在未打补丁的 AltStore 上会直接报 `Bad Allocation`。因此
 * `.github/workflows/ios-build.yml` **恒定**删掉这三个目录，包里只留 3 张默认剪影。
 *
 * 删掉之后有两种补齐方式，本模块负责更省事的那一种：
 *
 * | 方式 | 触发 | 代价 |
 * | --- | --- | --- |
 * | 批量补齐（`asset-download.ts`） | 玩家手动点「菜单 → 其它 → 更新 → 下载素材」 | 一次约 970MB，得等 |
 * | **边玩边下（本模块）** | 游戏用到谁就下谁，无需操作 | 首次遇到某武将时轻微延迟 |
 *
 * 两者共用同一份下载源与写盘逻辑，文件也都落在同一个可写层，互不冲突：
 * 批量下载补齐过的文件，懒加载探测时会直接当作「本地已有」跳过。
 *
 * ## 为什么能「就地生效」
 *
 * iOS 端已有两层覆盖层，写进 `Documents/` 的文件游戏立刻就能读到：
 *
 * 1. `fs/ios.ts` 的 `IosFileSystem`：`readFile` 先查可写层，未命中再回退内置资源；
 * 2. `ios/App/App/NonameRouter.swift`：WebView 对 `<img src>` / `<audio src>`
 *    这类直接请求也走同一套覆盖层。
 *
 * 所以本模块不需要改 core，也不需要碰文件系统实现层，只要保证
 * **在游戏真正需要某个文件之前（或刚失败之后）把它放进可写层**。
 *
 * ## 需求信号从哪来（两个钩子）
 *
 * 1. **图片**：`HTMLDivElement.prototype.setBackgroundImage` 是游戏显示立绘的唯一出口
 *    （`setBackground` 最终也调它）。在它外面包一层，就能拿到「这一局用到了哪个武将」。
 *    注意这个方法是 core 的 `init/polyfill.ts` 在启动时才挂到原型上的，
 *    而 `preload` 跑得更早，所以不能用赋值的方式抢——改成在原型上装一个
 *    **访问器属性**：无论 core 何时赋值，都会经由我们的 setter 完成包装。
 * 2. **语音**：`<audio>` 没有这种「出口方法」，但加载失败会派发 `error` 事件。
 *    在 `window` 上用捕获阶段监听，就能从 `event.target.src` 反推出是哪个文件。
 *    之所以要捕获阶段，是因为 core 自己的 `onerror` 会把元素移出文档，
 *    我们在它之前拿到机会，才能把元素捞回来重播。
 *
 * ## 一个必须处理的细节：重新请求
 *
 * 文件下好之后要让它显示出来，就必须让 WebView **重新发起请求**。
 * 但把 `background-image` / `audio.src` 设成与之前**完全相同**的值属于空操作，
 * 浏览器不会重新请求，于是我们给 URL 追加一个 `?_lazy=<时间戳>` 后缀。
 * 这个后缀不会影响文件定位——`NonameRouter.route(for:)` 会先剥掉查询串
 * （见该文件里的 `stripQuery`）。
 *
 * ## 失败与收敛
 *
 * - `404` 是确定性结论（上游确实没有这个文件，例如多数武将本就没有阵亡语音），
 *   标记为不可用后整个会话不再重试；
 * - 其它错误（超时 / 5xx / 域名不可达）会换源重试，仍失败则同样在**本会话内**放弃，
 *   绝不在后台反复打网络。
 *
 * 所有状态都只存在于内存（每个会话重建）：文件是否已存在由 `game.checkFile` 判断，
 * 它会同时看可写层与内置资源，因此「上次已经补好」的结论天然持久。
 */

import { CONTENT_SOURCES, SKIP_BASENAMES, TARGET_GROUPS, fetchAssetBytes, fileExists, isIosRuntime, toRemotePath, writeFileAsync, type GameLike, type LibLike, type UiLike } from "./asset-download.js";

export interface LazyAssetsOptions {
	lib: LibLike;
	game: GameLike;
	ui: UiLike;
}

/** 一次按需补齐的结果 */
export type LazyOutcome =
	/** 本地已有：内置资源，或之前已经补齐过 */
	| "available"
	/** 本次会话刚下载完成（调用方需要让界面重新取一次这个文件） */
	| "downloaded"
	/** 拿不到：上游没有这个文件，或多次尝试都失败 */
	| "unavailable";

export interface LazyAssetsHandle {
	/** 请求补齐某个游戏内路径；同一个路径在一次会话里只会真正下载一次 */
	request(path: string): Promise<LazyOutcome>;
}

/** 并发上限。刻意比批量下载（6）小：开局时游戏自己也在抢带宽，别把首屏挤掉 */
const CONCURRENCY = 3;

/** 缓存击穿用的查询参数名，见文件头「一个必须处理的细节」 */
const BUSTER_KEY = "_lazy";

/** 每个媒体元素最多补救几次，避免 core 的多级回退链把请求放大 */
const MAX_REPAIRS_PER_ELEMENT = 4;

/** 懒加载的适用范围：只有这三个目录会被真正裁掉 */
const LAZY_PREFIXES = TARGET_GROUPS.map(group => group.prefix);

// ---------------------------------------------------------------------------
// DOM 钩子注册表
//
// 原型上的钩子与 window 上的监听都只装一次，但每次 `installLazyAssets`
// 都会换一个新的上下文；这里用一个模块级引用转发，保证热重载 / 重复安装时
// 不会层层包装。
// ---------------------------------------------------------------------------

interface HookContext {
	handleBackground(element: Element, value: unknown): void;
	handleResourceError(target: Element): void;
	ui: UiLike;
}

let activeContext: HookContext | null = null;

/** `setBackgroundImage` 的原始实现与对外暴露的实现（两者必须分开，否则重绘会递归） */
const backgroundHook: {
	raw: ((this: Element, img: unknown) => unknown) | null;
	exposed: ((this: Element, img: unknown) => unknown) | null;
} = { raw: null, exposed: null };

let backgroundHookInstalled = false;
let errorHookInstalled = false;

/**
 * 把 `HTMLDivElement.prototype.setBackgroundImage` 换成访问器属性。
 *
 * core 的 `init/polyfill.ts` 会在启动阶段用 `=` 给它赋值，而我们（preload）
 * 跑在那之前，所以「先拿到再包装」是拿不到的；改成访问器后，core 的赋值会
 * 经过我们的 setter，从而无论时机如何都能包上。
 */
function installBackgroundHook(): void {
	if (backgroundHookInstalled) return;
	backgroundHookInstalled = true;

	const proto = HTMLDivElement.prototype as unknown as Record<string, unknown>;

	/** 包一层：先跑原实现（让它照常设 style），再把「用到了哪个文件」报给上下文 */
	const wrap = (fn: (this: Element, img: unknown) => unknown) => {
		backgroundHook.raw = fn;
		backgroundHook.exposed = function (this: Element, img: unknown) {
			const result = fn.call(this, img);
			try {
				activeContext?.handleBackground(this, img);
			} catch (error) {
				console.warn("[lazy-assets] 处理背景图时出错:", error);
			}
			return result;
		};
		return backgroundHook.exposed;
	};

	// 极端情况下 core 已经把方法挂好了（例如被重复初始化）：直接包上现有的实现
	const existing = proto.setBackgroundImage;
	if (typeof existing === "function") {
		wrap(existing as (this: Element, img: unknown) => unknown);
	}

	Object.defineProperty(proto, "setBackgroundImage", {
		configurable: true,
		enumerable: false,
		get: () => backgroundHook.exposed,
		set: (value: unknown) => {
			if (typeof value === "function") {
				wrap(value as (this: Element, img: unknown) => unknown);
			} else {
				backgroundHook.raw = null;
				backgroundHook.exposed = value as never;
			}
		},
	});
}

/**
 * 捕获阶段监听资源加载失败。
 *
 * 用捕获而不是冒泡：媒体元素的 `error` 事件不冒泡，而且 core 自己的 `onerror`
 * 会把 `<audio>` 从文档里摘掉，我们必须抢在它前面把元素拿到手。
 */
function installResourceErrorHook(): void {
	if (errorHookInstalled) return;
	errorHookInstalled = true;

	window.addEventListener(
		"error",
		event => {
			// 脚本运行时异常没有资源 target（其 target 是 window），与网络资源无关
			const target = event.target;
			if (!target || target === window || target === document) return;
			try {
				activeContext?.handleResourceError(target as Element);
			} catch (error) {
				console.warn("[lazy-assets] 处理资源加载失败时出错:", error);
			}
		},
		true
	);
}

// ---------------------------------------------------------------------------
// 安装入口
// ---------------------------------------------------------------------------

/**
 * 安装「边玩边下」。iOS 之外直接返回空实现——安卓/桌面包里资源是齐全的，
 * 套这层只会白白多出探测开销。
 */
export function installLazyAssets(options: LazyAssetsOptions): LazyAssetsHandle {
	const { lib, game, ui } = options;

	if (!isIosRuntime(lib)) {
		// 同时清掉上下文：万一先前装过（理论上不会），也不该让钩子继续指向旧状态
		activeContext = null;
		return { request: () => Promise.resolve("unavailable") };
	}

	/** 已确认本地有（内置资源或之前补齐过） */
	const available = new Set<string>();
	/** 已确认拿不到（上游 404，或多次失败） */
	const unavailable = new Set<string>();
	/** 正在处理的文件 → 结果，保证同一个文件不会并发下载两次 */
	const inflight = new Map<string, Promise<LazyOutcome>>();
	/** 待处理队列 */
	const queue: { path: string; resolve: (outcome: LazyOutcome) => void }[] = [];
	/** 每个媒体元素已尝试补救的路径数，见 MAX_REPAIRS_PER_ELEMENT */
	const repairCounts = new WeakMap<Element, Set<string>>();

	let running = 0;
	/** 记住上次成功的源，后续文件优先用它 */
	let preferredSource = 0;
	let downloaded = 0;

	const indicator = createIndicator();

	/** 真正去取文件：探测 → 下载 → 落盘 */
	async function acquire(path: string): Promise<LazyOutcome> {
		// 先探测一次。`checkFile` 同时看可写层与内置资源，
		// 因此「内置就有」和「上次已经补好」都能在这里命中，不必重复下载。
		if (await fileExists(game, path)) {
			available.add(path);
			return "available";
		}

		let lastError = "未知错误";
		// 只调一次：重试策略（同源退避 + 换源）都在 `fetchAssetBytes` 内部，
		// 这里再套一层循环只会把失败时的请求数翻倍。
		const result = await fetchAssetBytes(toRemotePath(path), preferredSource);
		if (result.ok && result.buffer) {
			// 落盘：必须是原始字节（详见 `fetchAssetBytes` 的注释）
			await writeFileAsync(game, result.buffer, path);
			preferredSource = result.sourceIndex;
			available.add(path);
			downloaded++;
			console.log(`[lazy-assets] 已补齐 ${path}（${result.buffer.byteLength} 字节，源：${CONTENT_SOURCES[result.sourceIndex].name}）`);
			return "downloaded";
		}
		lastError = result.error ?? lastError;

		unavailable.add(path);
		console.warn(`[lazy-assets] 无法补齐 ${path}：${lastError}`);
		return "unavailable";
	}

	/** 从队列取任务填满并发位 */
	function pump(): void {
		while (running < CONCURRENCY && queue.length > 0) {
			const task = queue.shift()!;
			running++;
			indicator.update(running + queue.length, downloaded);

			acquire(task.path)
				.catch(error => {
					console.warn(`[lazy-assets] 处理 ${task.path} 时出错:`, error);
					return "unavailable" as LazyOutcome;
				})
				.then(outcome => task.resolve(outcome))
				.finally(() => {
					running--;
					indicator.update(running + queue.length, downloaded);
					pump();
				});
		}
	}

	/** 对外（与钩子）统一的入口：同一个路径只会真正下载一次 */
	function request(path: string): Promise<LazyOutcome> {
		if (!isLazyPath(path)) return Promise.resolve("unavailable");
		if (available.has(path)) return Promise.resolve("available");
		if (unavailable.has(path)) return Promise.resolve("unavailable");

		const existing = inflight.get(path);
		if (existing) return existing;

		const task = new Promise<LazyOutcome>(resolve => {
			queue.push({ path, resolve });
			pump();
		});
		inflight.set(path, task);
		void task.then(() => inflight.delete(path));
		return task;
	}

	/** 图片钩子：拿到 path 就排队，下好了再把背景重新设一次 */
	function handleBackground(element: Element, value: unknown): void {
		for (const path of imageCandidates(value)) {
			void request(path).then(outcome => {
				if (outcome === "downloaded") {
					repaintBackground(element, value, path);
				}
			});
		}
	}

	/** 语音/图片钩子：加载失败 → 补下 → 换个 URL 重试 */
	function handleResourceError(target: Element): void {
		if (!(target instanceof HTMLMediaElement) && !(target instanceof HTMLImageElement)) return;

		const path = toGamePath((target as HTMLImageElement & HTMLMediaElement).src);
		if (!path || !isLazyPath(path)) return;

		let tried = repairCounts.get(target);
		if (!tried) {
			tried = new Set<string>();
			repairCounts.set(target, tried);
		}
		if (tried.has(path) || tried.size >= MAX_REPAIRS_PER_ELEMENT) return;
		tried.add(path);

		void request(path).then(outcome => {
			if (outcome === "downloaded") {
				retryResource(target, path);
			}
		});
	}

	/** 文件刚落盘：把原值加个查询后缀重新设一次，逼 WebView 重新请求 */
	function repaintBackground(element: Element, value: unknown, downloadedPath: string): void {
		const raw = backgroundHook.raw;
		if (typeof raw !== "function") return;
		try {
			raw.call(element, bustLazyEntries(value, downloadedPath));
		} catch (error) {
			console.warn(`[lazy-assets] 重新应用背景图失败（${downloadedPath}）:`, error);
		}
	}

	/** 资源加载失败后重试一次：换 URL + 必要时挂回文档 */
	function retryResource(target: Element, downloadedPath: string): void {
		try {
			if (target instanceof HTMLImageElement) {
				target.src = withBuster(target.src);
				return;
			}

			const media = target as HTMLMediaElement;
			if (!media.src || /^(data|blob):/i.test(media.src)) return;

			media.src = withBuster(media.src);
			// core 在 `onerror` 里会 `remove()` 掉音频元素；媒体元素不要求挂在文档上，
			// 但挂回去更稳（个别 WebKit 版本对游离元素的播放有额外限制）。
			if (!media.isConnected) {
				const host = ui.window instanceof HTMLElement ? ui.window : document.body;
				host?.appendChild(media);
			}
			void Promise.resolve(media.play?.()).catch(() => {});
		} catch (error) {
			console.warn(`[lazy-assets] 重试播放失败（${downloadedPath}）:`, error);
		}
	}

	activeContext = { handleBackground, handleResourceError, ui };
	installBackgroundHook();
	installResourceErrorHook();

	console.log("[lazy-assets] 已启用：武将立绘与语音将在首次用到时按需下载");

	return { request };
}

// ---------------------------------------------------------------------------
// 路径与 DOM 工具
// ---------------------------------------------------------------------------

/** 该路径是否属于「被裁掉的三大目录」 */
function isLazyPath(path: string): boolean {
	if (!LAZY_PREFIXES.some(prefix => path.startsWith(prefix))) {
		return false;
	}
	// 默认剪影是打包保留的必需资源，不该被覆盖
	const base = path.slice(path.lastIndexOf("/") + 1);
	return !SKIP_BASENAMES.test(base);
}

/**
 * 把 `setBackgroundImage` 的实参（字符串或字符串数组）解析成候选路径。
 *
 * 立绘走的是数组形式：`[真实立绘, 默认剪影]`，两个都可能是我们要关心的路径。
 */
function imageCandidates(value: unknown): string[] {
	const list = Array.isArray(value) ? value : [value];
	const result: string[] = [];
	for (const item of list) {
		const path = toGamePath(item);
		if (path && isLazyPath(path)) {
			result.push(path);
		}
	}
	return [...new Set(result)];
}

/**
 * 还原成游戏内的相对路径。
 *
 * 需要同时吃得下两种形态：
 * - 相对路径（`image/character/zhaoyun.jpg`）——`setBackgroundImage` 的实参；
 * - 绝对地址（`capacitor://localhost/audio/skill/x.mp3`）——`audio.src` 拿到的东西。
 */
function toGamePath(value: unknown): string | null {
	if (typeof value !== "string") return null;
	let path = value.trim();
	if (path === "") return null;

	if (/^[a-z][a-z0-9+.-]*:/i.test(path)) {
		// `db:` / `blob:` / `data:` 这类不是文件路径
		if (/^(data|blob):/i.test(path)) return null;
		try {
			path = new URL(path, document.baseURI).pathname;
		} catch {
			return null;
		}
	} else {
		const query = path.indexOf("?");
		if (query !== -1) path = path.slice(0, query);
		const hash = path.indexOf("#");
		if (hash !== -1) path = path.slice(0, hash);
	}

	try {
		path = decodeURIComponent(path);
	} catch {
		// 解码失败就按原样处理
	}

	path = path.replace(/^\/+/, "").replace(/^\.\//, "");
	return path === "" ? null : path;
}

/** 只给「这次刚下好的那个文件」加后缀，其余保持不变 */
function bustLazyEntries(value: unknown, downloadedPath: string): unknown {
	if (Array.isArray(value)) {
		return value.map(item => (toGamePath(item) === downloadedPath ? withBuster(String(item)) : item));
	}
	if (toGamePath(value) === downloadedPath) {
		return withBuster(String(value));
	}
	return value;
}

/** 追加缓存击穿后缀；`blob:` / `data:` 不能加 */
function withBuster(url: string, stamp: number = Date.now()): string {
	if (!url || /^(data|blob):/i.test(url)) return url;
	const separator = url.includes("?") ? "&" : "?";
	return `${url}${separator}${BUSTER_KEY}=${stamp}`;
}

/**
 * 角落里的下载提示。
 *
 * 按需下载会让开局多出零点几秒的等待，没有反馈的话玩家会以为游戏卡住了。
 * 做成不可交互、自动淡出的小胶囊，尽量不打扰游戏本身。
 */
function createIndicator(): { update: (pending: number, done: number) => void } {
	let node: HTMLElement | null = null;
	let hideTimer: ReturnType<typeof setTimeout> | null = null;

	const ensure = (): HTMLElement | null => {
		if (node?.isConnected) return node;
		const host = document.body ?? document.documentElement;
		if (!host) return null;

		node = document.createElement("div");
		node.className = "lazy-assets-indicator";
		node.style.cssText = ["position:fixed", "left:50%", "bottom:9%", "transform:translateX(-50%)", "padding:3px 12px", "border-radius:14px", "background:rgba(0,0,0,.55)", "color:#fff", "font-size:13px", "line-height:1.7", "white-space:nowrap", "pointer-events:none", "z-index:9999", "opacity:0", "transition:opacity .3s"].join(";");
		host.appendChild(node);
		return node;
	};

	return {
		update(pending, done) {
			if (pending <= 0) {
				if (node && hideTimer === null) {
					hideTimer = setTimeout(() => {
						hideTimer = null;
						if (node) node.style.opacity = "0";
					}, 900);
				}
				return;
			}

			const target = ensure();
			if (!target) return;
			if (hideTimer !== null) {
				clearTimeout(hideTimer);
				hideTimer = null;
			}
			target.textContent = done > 0 ? `正在补齐素材…（已下载 ${done}）` : "正在补齐素材…";
			target.style.opacity = "1";
		},
	};
}
