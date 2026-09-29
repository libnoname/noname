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
 * 不能读包内的 `asset-manifest.json`——因为它是在**删除资源之后**重建的，
 * 里面恰好不含我们要下载的文件。因此改为在运行时向上游拉取文件树：
 *
 * - 文件列表：`GET /git/trees/<branch>?recursive=1`（GitHub Git Trees API，匿名可用）
 * - 文件内容：`GET https://raw.githubusercontent.com/<owner>/<repo>/<branch>/<path>`
 *
 * 说明：GitHub 对匿名 API 有 60 次/小时的限额，本模块**只用 1 次**列目录，
 * 其余全部走 raw（raw 不计入 API 限额）。
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

/** 并发下载数。太高会被 raw.githubusercontent.com 限流，太低则速度起不来 */
const DOWNLOAD_CONCURRENCY = 6;

/** 单次下载失败后的重试次数（网络抖动很常见） */
const MAX_RETRY = 3;

/** 进度界面刷新节流：每下载 N 个文件刷新一次 DOM，避免频繁重排 */
const UI_REFRESH_STEP = 10;

/** 记录「已处理」的本地存储键，用于界面显示上次完成情况 */
const STORAGE_KEY = "noname_asset_download_state";

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
	/** 由 `attachFileSystemAPI` 挂载，写入 Documents/noname/<path> */
	writeFile?: (data: string | ArrayBuffer | ArrayBufferView | Blob, path: string, name: string, callback?: (error?: unknown) => void) => void;
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
 * 等它跑完后再往「其它」页的左侧容器追加我们的按钮，并为它挂上自己的内容页。
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
		const result = (original as (...a: unknown[]) => unknown).apply(this, args);

		// 联机菜单（connectMenu = true）不提供这个入口，与 core 里「更新」页的处理保持一致
		if (args[0]) {
			return result;
		}

		try {
			appendDownloadButton(lib, game, ui);
		} catch (error) {
			// 菜单渲染失败不应连累整个「其它」页
			console.error("[asset-download] 注入按钮失败:", error);
		}

		return result;
	};

	(wrapped as any).__assetDownloadWrapped = true;
	ui.create.otherMenu = wrapped;
}

// ---------------------------------------------------------------------------
// 界面
// ---------------------------------------------------------------------------

/**
 * 往「其它」页左侧容器追加按钮。
 *
 * `otherMenu.js` 内部用 `start.firstChild`（即 `.left.pane`）作为按钮容器、
 * `start.lastChild`（即 `.right.pane`）作为内容页容器，但这两个变量都在闭包里拿不到。
 * 这里改为从已渲染的 DOM 反查：core 一定会在左侧容器里渲染「更新」按钮，
 * 于是可以从它反推出左右两个 pane。
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
function appendDownloadButton(lib: LibLike, game: GameLike, ui: UiLike): void {
	// iOS 之外（安卓 / 浏览器）不需要这个功能
	if (lib.device !== "ios") {
		return;
	}

	const layout = findMenuLayout();
	if (!layout) {
		console.warn("[asset-download] 找不到「其它」页的左右容器，跳过注入");
		return;
	}
	const { leftPane, rightPane } = layout;

	// 防止重复注入（菜单可能被重建）
	if (leftPane.querySelector(".asset-download-button")) {
		return;
	}

	const page = ui.create.div(".menu-help.asset-download-page");

	/**
	 * @type {HTMLDivElement & { link?: HTMLElement }}
	 */
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
		hideRoundButtons();

		rightPane.appendChild(page);
	});

	// 左侧栏只有 34% 宽、默认字号 26px，长标签会溢出，这里缩小
	button.style.fontSize = "20px";
	button.style.lineHeight = "22px";

	renderPage(page, lib, game, ui);
}

/** 从菜单结构里反查「其它」页的左右两个容器 */
function findMenuLayout(): { leftPane: HTMLElement; rightPane: HTMLElement } | null {
	// 「更新」是本功能的锚点：core 一定会在左侧容器里渲染它
	const allButtons = Array.from(document.querySelectorAll<HTMLElement>(".menubutton.large"));
	const anchor = allButtons.find(el => el.textContent?.trim() === "更新");
	const leftPane = anchor?.parentNode instanceof HTMLElement ? anchor.parentNode : null;

	if (!leftPane) {
		return null;
	}

	// 布局是 `.menu-content > div > (.left.pane + .right.pane)`，右侧就是左容器的下一个兄弟
	const rightPane = leftPane.nextElementSibling;
	if (!(rightPane instanceof HTMLElement)) {
		return null;
	}

	return { leftPane, rightPane };
}

/** 藏掉「其它」页右上角的圆形快捷按钮（作/执/清/播/存/删） */
function hideRoundButtons(): void {
	document.querySelectorAll<HTMLElement>(".menu.main > .menu-content > div > .menubutton.round").forEach(el => (el.style.display = "none"));
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
	statusLine.style.cssText = "font-size:14px;white-space:normal;line-height:1.5;";
	statusLine.textContent = readStateSummary();

	progressBox.appendChild(progressBar);
	progressBox.appendChild(statusLine);

	// ---- 按钮区 ----
	const buttonRow = document.createElement("li");
	buttonRow.style.marginTop = "8px";

	let running = false;
	let cancelRequested = false;

	// 先声明两个按钮，再做事件绑定，避免处理器里引用尚未初始化的变量
	const stopButton = ui.create.node("button", "清空记录", () => {
		// 只清掉本地的进度记录；真正的文件删除交给游戏内既有机制，避免误删玩家已下载的资源
		clearState();
		statusLine.textContent = readStateSummary();
	});
	stopButton.disabled = true;
	stopButton.style.marginLeft = "8px";

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
		}
	});

	buttonRow.appendChild(startButton);
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

	const files = await fetchRemoteFileList(ctx.shouldCancel);
	if (files.length === 0) {
		throw new Error("未获取到任何可下载文件，请检查网络后重试");
	}

	const total = files.length;
	let done = 0;
	let skipped = 0;
	const failed: string[] = [];
	let cursor = 0;

	const updateUi = (force = false) => {
		if (!force && done % UI_REFRESH_STEP !== 0) {
			return;
		}
		const percent = ((done / total) * 100).toFixed(1);
		progressFill.style.width = `${percent}%`;
		statusLine.textContent = `正在下载：${done}/${total}（${percent}%）` + `${skipped ? `，已跳过 ${skipped}` : ""}` + `${failed.length ? `，失败 ${failed.length}` : ""}`;
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
					await downloadOne(game, item.remotePath, item.localPath);
				}
			} catch (error) {
				// 重试若干次后仍失败就记下来，不中断整体流程
				failed.push(item.localPath);
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

	if (failed.length) {
		statusLine.textContent = `下载完成：成功 ${total - failed.length - skipped}，已存在 ${skipped}，失败 ${failed.length}。可再次点击以重试失败项。`;
	} else if (skipped === total) {
		statusLine.textContent = `资源已完备（${total}/${total}），无需重复下载。`;
	} else {
		statusLine.textContent = `下载完成：新增 ${total - skipped}/${total}（已存在 ${skipped}），武将原画与语音已就绪。`;
	}
	progressFill.style.width = "100%";

	saveState({ total, done, failed: failed.length });
	refreshAssets(ctx.ui);
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

/** 下载单个文件：raw → base64 → game.writeFile */
async function downloadOne(game: GameLike, remotePath: string, localPath: string): Promise<void> {
	const url = `https://raw.githubusercontent.com/${UPSTREAM.owner}/${UPSTREAM.repo}/${UPSTREAM.branch}/${remotePath}`;

	let lastError: unknown = null;
	for (let attempt = 1; attempt <= MAX_RETRY; attempt++) {
		try {
			const response = await fetch(url, { cache: "no-store" });
			if (!response.ok) {
				throw new Error(`HTTP ${response.status}`);
			}
			const buffer = await response.arrayBuffer();
			const base64 = arrayBufferToBase64(buffer);
			await writeFileAsync(game, base64, localPath);
			return;
		} catch (error) {
			lastError = error;
			// 简单退避，避免连续打同一个地址
			await sleep(200 * attempt);
		}
	}

	throw lastError instanceof Error ? lastError : new Error(String(lastError));
}

/** 把 `game.writeFile` 的回调风格包成 Promise */
function writeFileAsync(game: GameLike, base64: string, localPath: string): Promise<void> {
	const slash = localPath.lastIndexOf("/");
	const dir = slash === -1 ? "" : localPath.slice(0, slash);
	const name = slash === -1 ? localPath : localPath.slice(slash + 1);

	return new Promise<void>((resolve, reject) => {
		game.writeFile!(base64, dir, name, (error?: unknown) => {
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
 * 通过 GitHub Git Trees API 拉取上游文件树，过滤出我们需要的三类资源。
 *
 * 相比 `contents` API（单目录上限 1000 条，装不下 7600+ 技能语音），
 * Trees API 一次就能返回完整树；实测该仓库 `truncated: false`。
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
}

function saveState(state: Omit<DownloadState, "at">): void {
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...state, at: Date.now() }));
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
		const state = JSON.parse(raw) as DownloadState;
		const time = new Date(state.at).toLocaleString();
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
		return localStorage.getItem(STORAGE_KEY) !== null;
	} catch {
		return false;
	}
}

// ---------------------------------------------------------------------------
// 小工具
// ---------------------------------------------------------------------------

/** ArrayBuffer → base64（分块，避免超大语音文件触发调用栈溢出） */
function arrayBufferToBase64(buffer: ArrayBuffer): string {
	const bytes = new Uint8Array(buffer);
	const CHUNK_SIZE = 0x8000;
	let binary = "";
	for (let i = 0; i < bytes.length; i += CHUNK_SIZE) {
		binary += String.fromCharCode(...bytes.subarray(i, i + CHUNK_SIZE));
	}
	return btoa(binary);
}

function sleep(ms: number): Promise<void> {
	return new Promise(resolve => setTimeout(resolve, ms));
}
