/**
 * iOS 端「补充下载武将原画与语音」功能。
 *
 * ---
 *
 * ## 背景
 *
 * iOS 侧载包（AltStore / SideStore）对未压缩 App 体积非常敏感：
 * 上游 `.github/workflows/ios-build.yml` 的 `slim_assets` 步骤会把这三大目录整目录删掉，
 * 否则约 2.8GB 的资源根本装不进手机：
 *
 * - `audio/skill`    470M  武将技能语音（全为 mp3）
 * - `audio/die`      111M  阵亡语音（全为 mp3）
 * - `image/character` 390M  武将立绘（仅保留 3 张 `default_silhouette_*` 占位图）
 *
 * 后果是：游戏能正常玩，但**武将没有立绘、技能与阵亡没有语音**。
 *
 * ## 本模块的做法
 *
 * 在「菜单 → 其它 → 更新」页里，针对 iOS 追加一个「下载武将原画与语音」按钮，
 * 点击后把这些资源从**上游 GitHub 仓库**补齐，写进 iOS 的 Documents 可写目录。
 *
 * 之所以写入后立刻生效，是因为 iOS 端已经有两层「覆盖层」：
 *
 * 1. `apps/mobile/src/fs/ios.ts` 的 `IosFileSystem`：
 *    `readFile` 先查 `Documents/noname/<path>`，未命中才回退内置资源；
 * 2. `apps/mobile/ios/App/App/NonameRouter.swift`：
 *    WebView 对 `<img src>` / `<audio src>` 的直接请求也走同一套覆盖层。
 *
 * 因此只要把文件写进 `Documents/noname/image/character/xxx.jpg`，
 * 游戏里的立绘与语音就都能读到——**无需修改 core 里的任何业务代码**，
 * 也无需改动文件系统实现层。
 *
 * ## 为什么不用 `lib.updateURL` 的在线更新
 *
 * 游戏内的「在线更新」已停用（界面上写着「由于无名杀正在重构项目结构，在线更新暂时无法使用」），
 * 且 `get.url()` 拼出来的 `master/` 路径与上游现在的 `apps/core/` 布局不匹配。
 * 所以这里直接用 GitHub 的公开接口，不依赖游戏自身的更新通道。
 *
 * ## 文件清单从哪来
 *
 * **首选：构建期内置的 `asset-download-manifest.json`**（见 `afterSync.ts`）。
 * 它由构建脚本在资源仍完整的阶段生成，随包发布，运行时直接读取——
 * 完全离线，不依赖任何接口，这是最主要、也最稳的路径。
 *
 * 注意**不能**读包内的 `asset-manifest.json`：那一份是在**删除资源之后**重建的，
 * 恰好不含我们要下载的文件。
 *
 * **回退：GitHub Git Trees API**（`GET /git/trees/<branch>?recursive=1`）。
 * 仅在内置清单缺失时使用（例如用旧包运行），因为该接口匿名限额只有 60 次/小时，
 * 且在大陆网络下常被干扰。
 *
 * ## 文件内容从哪来
 *
 * `CONTENT_SOURCES` 里按顺序尝试多个源（GitHub Raw + 三个 jsDelivr 节点），
 * 第一个成功即用；某个源连续失败若干次会自动切换到下一个。
 * 这样单一域名被墙/被限流时不会导致整体失败。
 */

/** 上游仓库坐标（与 `apps/core/noname/library/update-urls.js` 中的 github 源保持一致） */
const UPSTREAM = {
	owner: "libnoname",
	repo: "noname",
	/** 与上游默认分支一致；改这里即可切换下载源 */
	branch: "main",
};

/** 上游仓库里资源所在的根目录（注意：不是仓库根目录，而是 `apps/core`） */
const UPSTREAM_ASSET_ROOT = "apps/core";

/** 游戏内路径前缀 → 该目录的说明，用于界面显示 */
const TARGET_GROUPS: { prefix: string; label: string }[] = [
	{ prefix: "image/character/", label: "武将原画" },
	{ prefix: "audio/skill/", label: "技能语音" },
	{ prefix: "audio/die/", label: "阵亡语音" },
];

/** 立绘占位图必须保留在内置资源里，下载时跳过它们（避免无意义覆盖） */
const SKIP_BASENAMES = /^default_silhouette_/;

/**
 * 构建期生成的内置下载清单（见 `apps/mobile/afterSync.ts` 的 `writeDownloadManifest`）。
 *
 * 它是文件清单的**首选来源**：全部离线，不依赖任何接口。
 * 只有它缺失时（例如用旧包运行）才回退到 GitHub Trees API。
 */
const BUNDLED_MANIFEST = "asset-download-manifest.json";

/**
 * 文件内容的下载源。**按顺序尝试，第一个成功即用。**
 *
 * 之所以要多个源：`raw.githubusercontent.com` 在大陆网络下经常被干扰，
 * 而 `api.github.com` 还会额外受匿名限额（60 次/小时）影响。
 * jsDelivr 是正经的公共 CDN，国内可达性明显更好，作为主要备用。
 *
 * 同一份文件在四个源上路径完全一致（都是 `<owner>/<repo>@<branch>/<path>`），
 * 因此切换源不需要改任何清单数据。
 */
const CONTENT_SOURCES: { name: string; url: (path: string) => string }[] = [
	{
		name: "GitHub Raw",
		url: path => `https://raw.githubusercontent.com/${UPSTREAM.owner}/${UPSTREAM.repo}/${UPSTREAM.branch}/${path}`,
	},
	{
		name: "jsDelivr",
		url: path => `https://cdn.jsdelivr.net/gh/${UPSTREAM.owner}/${UPSTREAM.repo}@${UPSTREAM.branch}/${path}`,
	},
	{
		name: "jsDelivr(Fastly)",
		url: path => `https://fastly.jsdelivr.net/gh/${UPSTREAM.owner}/${UPSTREAM.repo}@${UPSTREAM.branch}/${path}`,
	},
	{
		name: "jsDelivr(Gcore)",
		url: path => `https://gcore.jsdelivr.net/gh/${UPSTREAM.owner}/${UPSTREAM.repo}@${UPSTREAM.branch}/${path}`,
	},
];

/** 并发下载数。太高会被 CDN 限流，太低则速度起不来 */
const DOWNLOAD_CONCURRENCY = 6;

/** 同一个源上单个文件的尝试次数（网络抖动很常见） */
const ATTEMPTS_PER_SOURCE = 2;

/** 某个源连续失败多少次后，自动切换到下一个源 */
const SOURCE_FAILURE_THRESHOLD = 5;

/** 进度界面刷新节流：每下载 N 个文件刷新一次 DOM，避免频繁重排 */
const UI_REFRESH_STEP = 10;

/** 记录「已处理」的本地存储键，用于界面显示上次完成情况 */
const STORAGE_KEY = "noname_asset_download_state";

/**
 * 落盘格式版本。
 *
 * **只要写入方式变了就必须 +1。** 因为「续传」是靠「文件已存在」来判断跳过的，
 * 一旦旧版本写出的文件内容有问题（例如曾经把 base64 文本当成文件内容写进去，
 * 导致图片与音频全部损坏），那些坏文件会被续传逻辑当成「已下载」永久留着。
 * 提升版本号即可让旧记录失效，从而强制重新下载、覆盖坏文件。
 *
 * - v1：早期版本（曾经把 base64 字符串直接当内容写入，产出损坏文件）
 * - v2：改为传原始 ArrayBuffer 字节
 */
const WRITE_FORMAT_VERSION = 2;

// ---------------------------------------------------------------------------
// 类型（尽量宽松，避免与 core 的运行时对象强耦合）
// ---------------------------------------------------------------------------

interface LibLike {
	[key: string]: any;
	/** core 会把它设成 "ios" / "android" / undefined */
	device?: string;
	/** 运行时读写文件用 */
	init?: any;
}

interface GameLike {
	[key: string]: any;
	/** 由 `attachFileSystemAPI` 挂载，写入可写层（iOS 下即 `Documents/<path>`） */
	writeFile?: (data: string | ArrayBuffer | ArrayBufferView | Blob, path: string, name: string, callback?: (error?: unknown) => void) => void;
	/** 由 `attachFileSystemAPI` 挂载，读取文件；回调收到 ArrayBuffer */
	readFile?: (fileName: string, callback?: (data: ArrayBuffer) => void, onerror?: (err: Error) => void) => void;
	/** 由 `attachFileSystemAPI` 挂载，先确保父目录存在 */
	ensureDirectory?: (list: string | string[], callback?: () => void, file?: boolean) => void;
	/** 由 `attachFileSystemAPI` 挂载；1 = 文件存在，0 = 是目录，-1 = 不存在 */
	checkFile?: (fileName: string, callback?: (result: -1 | 0 | 1) => void, onerror?: (err: Error) => void) => void;
}

interface UiLike {
	[key: string]: any;
	create?: any;
	window?: HTMLElement;
	click?: any;
}

export interface AssetDownloaderOptions {
	lib: LibLike;
	game: GameLike;
	ui: UiLike;
}

// ---------------------------------------------------------------------------
// 安装入口
// ---------------------------------------------------------------------------

/**
 * 把「下载武将原画与语音」入口挂到「菜单 → 其它 → 更新」页。
 *
 * 实现方式是在 `ui.create.otherMenu` 外面包一层：原函数照常渲染它自己的菜单按钮，
 * 我们则在它执行期间捕获「其它」页的左右两个容器，再把按钮与内容页塞进去。
 * 这样 core 侧一行都不用改，整个功能都留在 `apps/mobile` 层。
 *
 * 注意调用时机：`preload()` 在 `boot()` 之前执行，而菜单是在 `boot()` 阶段才构建的，
 * 所以这里注册的包装函数一定会被后续的菜单构建逻辑用到。
 */
export function installAssetDownloader(options: AssetDownloaderOptions): void {
	const { lib, game, ui } = options;

	if (!ui?.create) {
		console.warn("[asset-download] ui.create 不可用，跳过安装");
		return;
	}

	const original = ui.create.otherMenu;
	if (typeof original !== "function") {
		console.warn("[asset-download] ui.create.otherMenu 不是函数，跳过安装");
		return;
	}

	// 防止热重载 / 重复 preload 造成层层包装
	if ((original as any).__assetDownloadWrapped) {
		return;
	}

	const wrapped = function (this: unknown, ...args: unknown[]) {
		// 联机菜单（connectMenu = true）不提供这个入口，与 core 里「更新」页的处理保持一致
		if (args[0]) {
			return (original as (...a: unknown[]) => unknown).apply(this, args);
		}

		// 「其它」页在菜单构建阶段尚未接入 document（见 interceptMenuPane 的说明），
		// 因此只能在 otherMenu 执行期间就地捕获容器，不能事后查 DOM。
		const captured: { leftPane: HTMLElement | null } = { leftPane: null };
		const restore = interceptMenuPane(ui, captured);

		let result: unknown;
		try {
			result = (original as (...a: unknown[]) => unknown).apply(this, args);
		} finally {
			restore();
		}

		try {
			if (captured.leftPane) {
				attachDownloadEntry(lib, game, ui, captured.leftPane);
			} else {
				console.warn("[asset-download] 未能捕获「其它」页左侧容器，跳过注入");
			}
		} catch (error) {
			// 菜单渲染失败不应连累整个「其它」页
			console.error("[asset-download] 注入按钮失败:", error);
		}

		return result;
	};

	(wrapped as any).__assetDownloadWrapped = true;
	ui.create.otherMenu = wrapped;
}

/**
 * 在 `otherMenu` 执行期间临时包一层 `ui.create.div`，**捕获它把
 * `.menubutton.large` 塞进了哪个容器**——那正是「其它」页的 `.left.pane`。
 *
 * ### 为什么非得这样捕获
 *
 * `createMenu()` 里每一页都是 `createPage(active ? menuContent : null)` 创建的，
 * 非激活页的父节点是 `null`，也就是**整页（含 `.left.pane` / `.right.pane`）在菜单
 * 构建阶段并不在 document 里**；只有用户点开该标签时才会被
 * `menuContent.appendChild(this._link)` 接上去。
 *
 * 因此此刻任何基于 `document.querySelectorAll` 的查找都会落空。
 * 这正是上一版按钮没出现的原因——当时用「更新」按钮反查父节点，查不到任何东西。
 *
 * ### 捕获为什么可靠
 *
 * `otherMenu` 一定会调用
 * `ui.create.div(".menubutton.large", "更新", start.firstChild, clickMode)`，
 * 其中 `start.firstChild` 就是该页的 `.left.pane`。
 * 我们只认**第一个** `.menubutton.large`（即最先创建的「更新」按钮），
 * 从它的实参里取出那个带 `pane` class 的父元素即可。
 * 更早创建的圆形按钮是 `.menubutton.round.highlight`，不含 `large`，会被自然排除。
 *
 * @returns 还原 `ui.create.div` 的函数；调用方必须在 finally 中执行
 */
function interceptMenuPane(ui: UiLike, out: { leftPane: HTMLElement | null }): () => void {
	const create = ui.create;
	const originalDiv = create.div;

	create.div = function (...a: unknown[]) {
		const node = (originalDiv as (...x: unknown[]) => unknown).apply(this, a);

		if (!out.leftPane && typeof a[0] === "string" && a[0].includes("menubutton") && a[0].includes("large")) {
			// 父容器通常是第 3 个实参，但为稳健起见扫描全部实参
			const parent = a.find(x => isElement(x) && (x as HTMLElement).classList.contains("pane"));
			if (parent) {
				out.leftPane = parent as HTMLElement;
			}
		}

		return node;
	};

	return () => {
		create.div = originalDiv;
	};
}

/** 判断一个值是不是 DOM 元素（用 nodeType 而非 instanceof，避免跨 window 失效） */
function isElement(value: unknown): boolean {
	return typeof value === "object" && value !== null && (value as { nodeType?: number }).nodeType === 1;
}

// ---------------------------------------------------------------------------
// 界面
// ---------------------------------------------------------------------------

/**
 * 把按钮与内容页挂到已捕获的「其它」页容器上。
 *
 * 关键点：core 的按钮切换由闭包内的 `clickMode` 驱动，它做了三件事——
 *   1. 清掉兄弟按钮的 `.active`；
 *   2. 调 `active.link?.remove()` 把旧内容页摘掉；
 *   3. 把新内容页 `appendChild` 到 `.right.pane`。
 *
 * 我们自己渲染的按钮不经过 `clickMode`，但**必须遵守同一份契约**
 * （尤其是给按钮挂 `link`），否则「先点我们的按钮、再点上游按钮」时，
 * `clickMode` 找不到 `link`，我们那页就会残留在右侧。
 * 因此下面显式复刻了这套语义。
 */
function attachDownloadEntry(lib: LibLike, game: GameLike, ui: UiLike, leftPane: HTMLElement): void {
	// iOS 之外（安卓 / 桌面浏览器）不提供该入口
	if (!isIosRuntime(lib)) {
		return;
	}

	// 菜单可能被重建（例如重开一局），避免重复注入
	if (leftPane.querySelector(".asset-download-button")) {
		return;
	}

	const page = ui.create.div(".menu-help.asset-download-page");
	const button = ui.create.div(".menubutton.large.asset-download-button", "下载素材", leftPane);

	// 与 core 保持一致：把内容页挂在按钮的 `link` 上，
	// 这样其它按钮的 clickMode 能把我们这页一并摘掉。
	(button as any).link = page;

	button.addEventListener("click", () => {
		const active = leftPane.querySelector(".active");
		if (active === button) {
			return;
		}
		if (active) {
			active.classList.remove("active");
			// 复刻 clickMode：旧内容页如果有 link 就移除
			const oldLink = (active as any).link;
			if (oldLink instanceof HTMLElement) {
				oldLink.remove();
			}
		}
		button.classList.add("active");

		// 进入内容页时，藏掉「其它」页右上角那几颗圆形快捷按钮，避免视觉干扰
		hideRoundButtons(leftPane.parentNode);

		// 右侧内容容器是左侧按钮容器的下一个兄弟（`.left.pane` + `.right.pane`）
		const rightPane = leftPane.nextElementSibling;
		if (rightPane instanceof HTMLElement) {
			rightPane.appendChild(page);
		}
	});

	// 左侧栏只有 34% 宽、默认字号 26px，长标签会溢出，这里缩小
	button.style.fontSize = "20px";
	button.style.lineHeight = "22px";

	renderPage(page, lib, game, ui);
}

/**
 * 判断当前是否为 iOS 运行环境。
 *
 * 首选判据是 WebView 桥：`window.webkit.messageHandlers.bridge` 由 Capacitor 原生层注入，
 * 安卓侧没有它。这也是 `packages/jit` 里已经**在用户真机上验证有效**的同款判断
 * （JIT 弹窗正是靠它静默跳过的），因此比 `lib.device` 更可靠。`lib.device` 作为兜底。
 */
function isIosRuntime(lib: LibLike): boolean {
	const wk = (window as unknown as { webkit?: { messageHandlers?: { bridge?: unknown } } }).webkit;
	if (wk?.messageHandlers?.bridge) {
		return true;
	}
	return lib.device === "ios";
}

/** 藏掉「其它」页右上角的圆形快捷按钮（作/执/清/播/存/删） */
function hideRoundButtons(scope: Node | null): void {
	if (!(scope instanceof HTMLElement)) {
		return;
	}
	scope.querySelectorAll<HTMLElement>(".menubutton.round").forEach(el => {
		el.style.display = "none";
	});
}

/** 渲染内容页（标题、说明、统计、按钮、进度条、日志） */
function renderPage(page: HTMLElement, lib: LibLike, game: GameLike, ui: UiLike): void {
	const ul = document.createElement("ul");

	const title = document.createElement("li");
	title.textContent = "下载武将原画与语音";
	title.style.fontWeight = "bold";

	const desc = document.createElement("li");
	desc.innerHTML = "iOS 侧载包为控制体积，未内置武将原画、技能语音与阵亡语音。" + "点击下方按钮可从上游仓库补齐这些资源（写入应用沙盒，随下随生效，无需重启游戏）。";

	const hint = document.createElement("li");
	hint.style.opacity = "0.7";
	hint.textContent = `资源来源：github.com/${UPSTREAM.owner}/${UPSTREAM.repo}（${UPSTREAM.branch} 分支）`;

	ul.appendChild(title);
	ul.appendChild(desc);
	ul.appendChild(hint);

	// ---- 进度区 ----
	const progressBox = document.createElement("li");
	progressBox.style.marginTop = "8px";

	const progressBar = document.createElement("div");
	progressBar.style.cssText = "width:100%;height:12px;background:rgba(255,255,255,0.15);border-radius:6px;overflow:hidden;margin:6px 0;";

	const progressFill = document.createElement("div");
	progressFill.style.cssText = "width:0%;height:100%;background:#4caf50;transition:width 0.2s;";
	progressBar.appendChild(progressFill);

	const statusLine = document.createElement("div");
	// 带上类名：既是样式锚点，也让本地 jsdom 测试能稳定取到这一行
	statusLine.classList.add("asset-download-status");
	statusLine.style.cssText = "font-size:14px;white-space:normal;line-height:1.5;";
	statusLine.textContent = readStateSummary();

	progressBox.appendChild(progressBar);
	progressBox.appendChild(statusLine);

	// ---- 按钮区 ----
	const buttonRow = document.createElement("li");
	buttonRow.style.marginTop = "8px";

	let running = false;
	let cancelRequested = false;

	// 先声明按钮，再做事件绑定，避免处理器里引用尚未初始化的变量
	const stopButton = ui.create.node("button", "清空记录", () => {
		// 只清掉本地的进度记录；真正的文件删除交给游戏内既有机制，避免误删玩家已下载的资源
		clearState();
		statusLine.textContent = readStateSummary();
	});
	stopButton.disabled = true;
	stopButton.style.marginLeft = "8px";

	/**
	 * 诊断入口：逐个探测下载源，结果原地铺开。
	 *
	 * 之所以要做这个按钮：iOS 上玩家看不到控制台，出问题时只能靠猜。
	 * 有了它，「哪个域名通、哪个不通」一眼可见，不必再来回构建验证。
	 */
	const testButton = ui.create.node("button", "测试连接", async () => {
		testButton.disabled = true;
		statusLine.style.whiteSpace = "pre-line";
		statusLine.textContent = "正在测试下载源…";

		const lines: string[] = [];
		try {
			await testSources(line => {
				lines.push(line);
				statusLine.textContent = lines.join("\n");
			});
			lines.push("· 只要有一个源显示 ✓ 即可正常下载（会自动选用可用的那个）");
		} catch (error) {
			lines.push(`测试失败：${describeError(error)}`);
		}

		statusLine.textContent = lines.join("\n");
		testButton.disabled = false;
	});

	const startButton = ui.create.node("button", "开始下载", async () => {
		if (running) {
			// 下载中再点就是「取消」
			cancelRequested = true;
			startButton.textContent = "正在取消…";
			startButton.disabled = true;
			return;
		}

		running = true;
		cancelRequested = false;
		startButton.textContent = "取消下载";
		stopButton.disabled = false;
		testButton.disabled = true;
		statusLine.style.whiteSpace = "pre-line";

		try {
			await runDownload({ lib, game, ui, statusLine, progressFill, shouldCancel: () => cancelRequested });
			startButton.textContent = "重新下载";
		} catch (error) {
			statusLine.textContent = `下载失败：${error instanceof Error ? error.message : String(error)}`;
			startButton.textContent = "重试";
		} finally {
			running = false;
			startButton.disabled = false;
			stopButton.disabled = true;
			testButton.disabled = false;
		}
	});

	buttonRow.appendChild(startButton);
	buttonRow.appendChild(testButton);
	buttonRow.appendChild(stopButton);

	ul.appendChild(progressBox);
	ul.appendChild(buttonRow);
	page.appendChild(ul);
}

// ---------------------------------------------------------------------------
// 下载主流程
// ---------------------------------------------------------------------------

interface RunDownloadContext {
	lib: LibLike;
	game: GameLike;
	ui: UiLike;
	statusLine: HTMLElement;
	progressFill: HTMLElement;
	shouldCancel: () => boolean;
}

async function runDownload(ctx: RunDownloadContext): Promise<void> {
	const { game, statusLine, progressFill } = ctx;

	if (typeof game.writeFile !== "function") {
		throw new Error("当前环境不支持写入文件（game.writeFile 缺失）");
	}

	statusLine.textContent = "正在获取资源清单…";

	const { items: files, origin } = await resolveFileList(ctx.shouldCancel);
	if (files.length === 0) {
		throw new Error("未获取到任何可下载文件：内置清单缺失，且接口也不可用");
	}

	const total = files.length;
	let done = 0;
	let skipped = 0;
	const failed: string[] = [];
	let cursor = 0;

	/** 当前使用的下载源；连续失败达到阈值就往后切 */
	let sourceIndex = 0;
	let sourceFailures = 0;

	/** 第一个成功写入的文件，收尾时回读做写入自检（见 verifyWrittenBytes） */
	let firstWritten: { localPath: string; byteLength: number } | null = null;

	const updateUi = (force = false) => {
		if (!force && done % UI_REFRESH_STEP !== 0) {
			return;
		}
		const percent = ((done / total) * 100).toFixed(1);
		progressFill.style.width = `${percent}%`;
		statusLine.textContent = `正在下载：${done}/${total}（${percent}%）　源：${CONTENT_SOURCES[sourceIndex].name}　清单：${origin}` + `${skipped ? `，已跳过 ${skipped}` : ""}` + `${failed.length ? `，失败 ${failed.length}` : ""}`;
	};

	/**
	 * 固定并发数的 worker 池；每个 worker 从共享游标取任务。
	 *
	 * 关于「跳过已存在文件」：只有**上次确实下载过**（本地有进度记录）时才逐个 `checkFile`。
	 * 这样既能让「取消后再点」变成续传，又避免首次使用时白跑一万多次本地探测
	 * （虽然 `stat` 很便宜，但每次都过一次原生桥，累积起来并不划算）。
	 */
	const resumable = hasPreviousDownload();
	const worker = async () => {
		while (true) {
			if (ctx.shouldCancel()) {
				return;
			}
			const index = cursor++;
			if (index >= total) {
				return;
			}

			const item = files[index];
			try {
				if (resumable && (await fileExists(game, item.localPath))) {
					skipped++;
				} else {
					const result = await downloadOne(game, item, sourceIndex);
					if (result.ok) {
						sourceFailures = 0;
						// 记住真正成功的那个源，后续继续用它
						sourceIndex = result.sourceIndex;
						// 只留第一个成功写入的文件，收尾时回读一次做写入自检
						if (!firstWritten && typeof result.byteLength === "number") {
							firstWritten = { localPath: item.localPath, byteLength: result.byteLength };
						}
					} else {
						failed.push(`${item.localPath}（${result.error}）`);
						sourceFailures++;
						// 连续失败过多 → 判定该源不可用，切到下一个
						if (sourceFailures >= SOURCE_FAILURE_THRESHOLD && sourceIndex < CONTENT_SOURCES.length - 1) {
							console.warn(`[asset-download] ${CONTENT_SOURCES[sourceIndex].name} 连续失败 ${sourceFailures} 次，切换到下一个源`);
							sourceIndex++;
							sourceFailures = 0;
						}
					}
				}
			} catch (error) {
				failed.push(`${item.localPath}（${describeError(error)}）`);
				console.warn(`[asset-download] 下载失败: ${item.localPath}`, error);
			} finally {
				done++;
				updateUi();
			}
		}
	};

	await Promise.all(Array.from({ length: Math.min(DOWNLOAD_CONCURRENCY, total) }, worker));

	updateUi(true);

	if (ctx.shouldCancel()) {
		statusLine.textContent = `已取消：${done}/${total}（已下载 ${done - skipped - failed.length}，已跳过 ${skipped}）。再次点击可继续。`;
		saveState({ total, done, failed: failed.length });
		// 部分文件已落盘，让游戏重新扫描资源目录
		refreshAssets(ctx.ui);
		return;
	}

	const succeeded = total - failed.length - skipped;
	// 结束语里同时带上「清单来源」和「实际使用的源」：
	// 玩家截图发来时，这两项就足以判断是清单问题还是域名可达性问题。
	const usedSource = CONTENT_SOURCES[sourceIndex].name;

	// 收尾自检：回读一个刚写入的文件，确认字节数一致。
	// 这一步能在界面上直接暴露「写入层把内容弄坏了」这类问题——
	// 之前就出过「全部下载成功、但原画与语音一个都出不来」的事故。
	const verdict = firstWritten ? await verifyWrittenBytes(game, firstWritten) : "";
	const tail = verdict ? `　${verdict}` : "";

	if (failed.length) {
		// 把失败原因摊开给用户看：多数情况下这一句就能定位是哪个域名不可达
		const sample = failed.slice(0, 3).join("；");
		statusLine.textContent = `下载完成：成功 ${succeeded}，已存在 ${skipped}，失败 ${failed.length}。` + `源：${usedSource}　清单：${origin}。失败示例：${sample}。可再次点击重试失败项。`;
	} else if (skipped === total) {
		statusLine.textContent = `资源已完备（${total}/${total}），无需重复下载。源：${usedSource}　清单：${origin}`;
	} else {
		statusLine.textContent = `下载完成：新增 ${succeeded}/${total}（已存在 ${skipped}），武将原画与语音已就绪。源：${usedSource}　清单：${origin}${tail}`;
	}
	progressFill.style.width = "100%";

	saveState({ total, done, failed: failed.length });
	refreshAssets(ctx.ui);
}

/**
 * 回读一个刚写入的文件，比对字节数。
 *
 * 这是对**写入链路**的端到端自检。来历：曾经出过一次「下载全部成功、
 * 但原画与语音一个都出不来」的事故，根因是写入时把 base64 文本当成了文件内容
 * （`game.writeFile` 收到字符串会当作内容本身，收到 ArrayBuffer 才是二进制）。
 * 当时若做一次回读比对，就能立刻把问题锁定在写入层，而不必去怀疑读取层。
 *
 * @returns 供界面显示的结论；无法回读时返回空串（不干扰正常流程）
 */
async function verifyWrittenBytes(game: GameLike, sample: { localPath: string; byteLength: number }): Promise<string> {
	if (typeof game.readFile !== "function") {
		return "";
	}

	const actual = await new Promise<number | null>(resolve => {
		try {
			game.readFile!(
				sample.localPath,
				data => resolve(data?.byteLength ?? null),
				() => resolve(null)
			);
		} catch {
			resolve(null);
		}
	});

	if (actual === null) {
		return "";
	}
	if (actual !== sample.byteLength) {
		return `⚠️ 写入校验失败：${sample.localPath} 期望 ${sample.byteLength} 字节、实际 ${actual} 字节，文件可能已损坏`;
	}
	return `写入校验：通过（${sample.byteLength} 字节）`;
}

/** 查询可写层里是否已经有这个文件（用于续传时跳过已下载项） */
function fileExists(game: GameLike, localPath: string): Promise<boolean> {
	if (typeof game.checkFile !== "function") {
		return Promise.resolve(false);
	}
	return new Promise<boolean>(resolve => {
		try {
			game.checkFile!(
				localPath,
				(result: -1 | 0 | 1) => resolve(result === 1),
				() => resolve(false)
			);
		} catch {
			resolve(false);
		}
	});
}

/** 下载失败时携带 HTTP 状态码，便于区分「文件不存在(404)」与「该源不可用」 */
class DownloadError extends Error {
	status?: number;

	constructor(message: string, status?: number) {
		super(message);
		this.name = "DownloadError";
		this.status = status;
	}
}

/**
 * 下载单个文件：多源尝试 → base64 → game.writeFile。
 *
 * 从 `preferred` 号源开始依次尝试，规则：
 * - **404 视为确定性失败**（该文件在上游确实不存在），立即结束、不再换源；
 * - 其它错误（超时 / 5xx / 429 / 网络不通）继续尝试下一个源——这正是
 *   「GitHub Raw 被干扰时自动改走 jsDelivr」的落点。
 *
 * @returns 是否成功、最终生效的源序号，以及失败原因
 */
async function downloadOne(game: GameLike, item: DownloadItem, preferred: number): Promise<{ ok: boolean; sourceIndex: number; error?: string; byteLength?: number }> {
	let lastError = "未知错误";

	for (let i = preferred; i < CONTENT_SOURCES.length; i++) {
		const source = CONTENT_SOURCES[i];

		for (let attempt = 1; attempt <= ATTEMPTS_PER_SOURCE; attempt++) {
			try {
				const response = await fetch(source.url(item.remotePath), { cache: "no-store" });
				if (!response.ok) {
					throw new DownloadError(`HTTP ${response.status}`, response.status);
				}
				const buffer = await response.arrayBuffer();
				// ⚠️ 这里必须传**原始字节**（ArrayBuffer），不能先自己转成 base64 字符串。
				// `game.writeFile` → `writeDataToBase64()` 对字符串的处理是
				// 「UTF-8 编码这段文本、再 base64」，也就是把字符串**当成文件内容**；
				// 若这里传 base64 文本，落盘的就会是那串文本本身（图片/音频全部损坏，
				// 表现为下载成功但原画与语音都出不来）。
				// 传 ArrayBuffer 时它会走 `new Uint8Array(data)` 分支，得到正确字节。
				await writeFileAsync(game, buffer, item.localPath);
				return { ok: true, sourceIndex: i, byteLength: buffer.byteLength };
			} catch (error) {
				lastError = describeError(error);

				// 404 是确定性结论：换源也没用
				if (error instanceof DownloadError && error.status === 404) {
					return { ok: false, sourceIndex: i, error: lastError };
				}

				// 同一源内的退避重试
				if (attempt < ATTEMPTS_PER_SOURCE) {
					await sleep(150 * attempt);
				}
			}
		}
	}

	return { ok: false, sourceIndex: CONTENT_SOURCES.length - 1, error: lastError };
}

/** 把各种异常统一成可读文案 */
function describeError(error: unknown): string {
	if (error instanceof Error) {
		return error.message;
	}
	return String(error);
}

/** 把 `game.writeFile` 的回调风格包成 Promise */
/**
 * 把 `game.writeFile` 的回调风格包成 Promise。
 *
 * `data` 传**原始字节**：见 `downloadOne` 里的说明，
 * 传字符串会被当成文件内容、传 ArrayBuffer 才是二进制。
 */
function writeFileAsync(game: GameLike, data: ArrayBuffer, localPath: string): Promise<void> {
	const slash = localPath.lastIndexOf("/");
	const dir = slash === -1 ? "" : localPath.slice(0, slash);
	const name = slash === -1 ? localPath : localPath.slice(slash + 1);

	return new Promise<void>((resolve, reject) => {
		game.writeFile!(data, dir, name, (error?: unknown) => {
			if (error) {
				reject(error instanceof Error ? error : new Error(String(error)));
			} else {
				resolve();
			}
		});
	});
}

// ---------------------------------------------------------------------------
// 远端文件清单
// ---------------------------------------------------------------------------

interface DownloadItem {
	/** 上游仓库内的路径，如 `apps/core/image/character/ahuinan.jpg` */
	remotePath: string;
	/** 游戏内相对路径，如 `image/character/ahuinan.jpg` */
	localPath: string;
}

/**
 * 读取构建期内置的下载清单（`asset-download-manifest.json`）。
 *
 * 这是清单的**首选来源**：随包发布、完全离线，不依赖任何接口。
 * 文件缺失或格式不对时返回空数组，由调用方回退到 API。
 *
 * 用相对路径 fetch：iOS 下会经过请求层覆盖层，若玩家在 Documents 里放了
 * 同名文件则优先使用玩家那份（便于自行定制）。
 */
async function readBundledManifest(): Promise<DownloadItem[]> {
	try {
		const response = await fetch(BUNDLED_MANIFEST, { cache: "no-store" });
		if (!response.ok) {
			return [];
		}
		const data: unknown = await response.json();
		if (!Array.isArray(data)) {
			return [];
		}
		return data.filter((path): path is string => typeof path === "string" && path.length > 0).map(localPath => ({ localPath, remotePath: `${UPSTREAM_ASSET_ROOT}/${localPath}` }));
	} catch (error) {
		console.warn("[asset-download] 读取内置清单失败，将回退到接口:", describeError(error));
		return [];
	}
}

/**
 * 取得待下载文件清单：**内置清单优先**，缺失时才退回 GitHub Trees API。
 *
 * @returns 清单，以及来源说明（会显示在界面上，便于排查）
 */
async function resolveFileList(shouldCancel: () => boolean): Promise<{ items: DownloadItem[]; origin: string }> {
	const bundled = await readBundledManifest();
	if (bundled.length > 0) {
		return { items: bundled, origin: "内置" };
	}

	console.warn("[asset-download] 未找到内置清单，回退到 GitHub API");
	return { items: await fetchRemoteFileList(shouldCancel), origin: "接口" };
}

/**
 * 逐个探测各下载源是否可用，把结果交给 `report` 逐行输出。
 *
 * 这是给玩家（以及远程排查）用的诊断入口：下载失败时一眼就能看出
 * 哪个域名在这台设备、这条网络上通，哪个不通。
 */
async function testSources(report: (line: string) => void): Promise<void> {
	const all = await readBundledManifest();
	// 清单为空时用一个稳定的样例文件兜底探测
	const probe = all[0] ?? {
		localPath: "image/character/ahuinan.jpg",
		remotePath: `${UPSTREAM_ASSET_ROOT}/image/character/ahuinan.jpg`,
	};

	for (const source of CONTENT_SOURCES) {
		const url = source.url(probe.remotePath);
		try {
			// 先用 HEAD 省流量；个别 CDN 不支持 HEAD（405）时再退回 GET
			let response = await fetch(url, { method: "HEAD", cache: "no-store" });
			if (response.status === 405) {
				response = await fetch(url, { cache: "no-store" });
			}
			report(`${response.ok ? "✓" : "✗"} ${source.name}：HTTP ${response.status}`);
		} catch (error) {
			report(`✗ ${source.name}：${describeError(error)}`);
		}
	}

	report(`· 内置清单：${all.length > 0 ? `${all.length} 个文件` : "缺失（会回退到 GitHub 接口）"}`);
}

/**
 * 通过 GitHub Git Trees API 拉取上游文件树，过滤出我们需要的三类资源。
 *
 * 仅在**内置清单缺失**时才会走到这里。相比 `contents` API（单目录上限 1000 条，
 * 装不下 7600+ 技能语音），Trees API 一次就能返回完整树；实测该仓库 `truncated: false`。
 *
 * ⚠️ 该接口匿名限额 60 次/小时，且在大陆网络下常返回 5xx —— 所以它只是兜底，
 * 正常路径应当由构建期清单承担。
 */
async function fetchRemoteFileList(shouldCancel: () => boolean): Promise<DownloadItem[]> {
	const apiUrl = `https://api.github.com/repos/${UPSTREAM.owner}/${UPSTREAM.repo}/git/trees/${UPSTREAM.branch}?recursive=1`;

	const response = await fetch(apiUrl, {
		headers: { Accept: "application/vnd.github+json" },
		cache: "no-store",
	});
	if (!response.ok) {
		throw new Error(`获取资源清单失败（HTTP ${response.status}）`);
	}

	const data = (await response.json()) as { tree?: { path?: string; type?: string }[]; truncated?: boolean };
	if (data.truncated) {
		console.warn("[asset-download] 上游文件树被截断，可能漏掉部分资源");
	}

	const prefix = `${UPSTREAM_ASSET_ROOT}/`;
	const items: DownloadItem[] = [];

	for (const entry of data.tree ?? []) {
		if (shouldCancel()) {
			break;
		}
		if (entry.type !== "blob" || typeof entry.path !== "string") {
			continue;
		}
		if (!entry.path.startsWith(prefix)) {
			continue;
		}

		const localPath = entry.path.slice(prefix.length);
		if (!TARGET_GROUPS.some(group => localPath.startsWith(group.prefix))) {
			continue;
		}

		const basename = localPath.slice(localPath.lastIndexOf("/") + 1);
		if (SKIP_BASENAMES.test(basename)) {
			// 占位剪影是内置资源，不需要下载
			continue;
		}

		items.push({ remotePath: entry.path, localPath });
	}

	return items;
}

// ---------------------------------------------------------------------------
// 下载完成后的刷新
// ---------------------------------------------------------------------------

/**
 * 下载完成后，让游戏重新扫描武将资源目录。
 *
 * 为什么有效：新文件写在可写层，而 `game.getFileList` 每次调用都会重新读目录，
 * 并不存在「启动时只扫一次」的缓存。因此只要触发一次武将列表重建，
 * 新补上的立绘就会被 `get.characterData` 之类的调用重新解析到。
 *
 * 这里全程「尽力而为」：拿不到对应 API 就当无事发生，
 * 反正文件已经落盘，玩家重进一局或重启游戏同样能看到效果。
 */
function refreshAssets(ui: UiLike): void {
	// 武将菜单的 update 函数会把角色数据、立绘、语音重新挂到界面上
	try {
		const updaters = ui?.updateCharacterPackMenu;
		if (Array.isArray(updaters)) {
			for (const update of updaters) {
				if (typeof update === "function") {
					update();
				}
			}
		}
	} catch (error) {
		console.warn("[asset-download] 刷新武将菜单失败（不影响已下载的文件）:", error);
	}

	console.log("[asset-download] 资源已写入 Documents 可写层，立绘与语音将随下次刷新生效");
}

// ---------------------------------------------------------------------------
// 本地进度记录
// ---------------------------------------------------------------------------

interface DownloadState {
	/** 完成时间戳 */
	at: number;
	total: number;
	done: number;
	failed: number;
	/** 写入这笔记录时使用的落盘格式版本，见 `WRITE_FORMAT_VERSION` */
	format: number;
}

function saveState(state: Omit<DownloadState, "at" | "format">): void {
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...state, at: Date.now(), format: WRITE_FORMAT_VERSION }));
	} catch {
		// 隐私模式下 localStorage 可能不可写
	}
}

function clearState(): void {
	try {
		localStorage.removeItem(STORAGE_KEY);
	} catch {
		// 忽略
	}
}

/** 生成「上次下载于 …」这类摘要文本 */
function readStateSummary(): string {
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (!raw) {
			return "尚未下载。点击「开始下载」补齐武将原画与语音。";
		}
		const state = JSON.parse(raw) as Partial<DownloadState>;
		const time = state.at ? new Date(state.at).toLocaleString() : "未知时间";
		if (state.format !== WRITE_FORMAT_VERSION) {
			// 明确告诉玩家为什么会「重下」：旧格式写出的文件内容是坏的，必须覆盖
			return `检测到旧版本下载的文件（${time}），其内容有误、无法显示，需要重新下载覆盖。点击「开始下载」即可。`;
		}
		const failed = state.failed ? `，失败 ${state.failed}` : "";
		return `上次下载：${time}（${state.done}/${state.total}${failed}）`;
	} catch {
		return "尚未下载。点击「开始下载」补齐武将原画与语音。";
	}
}

/**
 * 判断本地是否留有上次的下载记录。
 *
 * 只用来决定「要不要逐个探测文件是否已存在」：
 * 有记录说明大概率下了一部分，值得花探测成本换取续传能力。
 */
function hasPreviousDownload(): boolean {
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (!raw) {
			return false;
		}
		const state = JSON.parse(raw) as Partial<DownloadState>;
		// 只有「同一种落盘格式」留下的文件才敢当成已下载跳过。
		// 格式变过 → 旧文件内容可能是坏的 → 返回 false，强制整批重下覆盖。
		return state.format === WRITE_FORMAT_VERSION;
	} catch {
		return false;
	}
}

// ---------------------------------------------------------------------------
// 小工具
// ---------------------------------------------------------------------------

function sleep(ms: number): Promise<void> {
	return new Promise(resolve => setTimeout(resolve, ms));
}
