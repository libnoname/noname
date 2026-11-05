/// <reference types="vite/client" />
import { app, BrowserWindow, crashReporter, dialog, Menu, net, protocol, shell } from "electron";
import fs from "fs";
import path from "path";
import { pathToFileURL } from "url";
import remote from "@electron/remote/main/index.js";
remote.initialize();
const dirname = path.join(import.meta.dirname, "../");

const LOCAL_HOST = "localhost:8089";

async function handleLocalRequest(request: Request) {
	const root = path.resolve(dirname);
	let pathname: string;
	try {
		pathname = decodeURIComponent(new URL(request.url).pathname);
	} catch {
		return new Response("Bad Request", { status: 400 });
	}
	let full = path.resolve(root, "." + pathname);
	if (full !== root && !full.startsWith(root + path.sep)) {
		return new Response("Forbidden", { status: 403 });
	}
	let stat: fs.Stats;
	try {
		stat = await fs.promises.stat(full);
		if (stat.isDirectory()) {
			full = path.join(full, "index.html");
			stat = await fs.promises.stat(full);
		}
	} catch {
		return new Response("Not Found", { status: 404 });
	}
	const fileUrl = pathToFileURL(full).toString();
	const range = parseRange(request.method === "GET" ? request.headers.get("Range") : null, stat.size);
	if (range === "unsatisfiable") {
		return new Response(null, {
			status: 416,
			headers: { "Accept-Ranges": "bytes", "Content-Range": `bytes */${stat.size}` },
		});
	}
	// file:// 加载器会按 Range 截取内容，但仍返回 200 且不带 Content-Range，故状态码与范围头需在此补齐
	const response = await net.fetch(fileUrl, range ? { headers: { Range: `bytes=${range.start}-${range.end}` } } : undefined);
	const headers = new Headers(response.headers);
	headers.set("Accept-Ranges", "bytes");
	if (!range) {
		headers.set("Content-Length", String(stat.size));
		return new Response(response.body, { status: 200, headers });
	}
	headers.set("Content-Length", String(range.end - range.start + 1));
	headers.set("Content-Range", `bytes ${range.start}-${range.end}/${stat.size}`);
	return new Response(response.body, { status: 206, statusText: "Partial Content", headers });

	/**
	 * 解析单段 Range 请求头（RFC 9110 §14.1.2）
	 *
	 * @returns 可满足时返回闭区间；不可满足返回 `"unsatisfiable"`；缺失、语法无效或多段时返回 `null`（按规范忽略 Range，返回完整内容）
	 */
	function parseRange(header: string | null, size: number): { start: number; end: number } | "unsatisfiable" | null {
		if (!header) return null;
		const match = /^bytes=(\d*)-(\d*)$/.exec(header.trim());
		if (!match || (match[1] === "" && match[2] === "")) return null;
		let start: number;
		let end: number;
		if (match[1] === "") {
			const suffix = Number(match[2]);
			if (suffix === 0) return "unsatisfiable";
			start = Math.max(0, size - suffix);
			end = size - 1;
		} else {
			start = Number(match[1]);
			if (match[2] !== "" && Number(match[2]) < start) return null;
			end = match[2] === "" ? size - 1 : Math.min(Number(match[2]), size - 1);
		}
		if (start >= size) return "unsatisfiable";
		return { start, end };
	}
}

function registerLocalProtocol() {
	protocol.handle("http", request => {
		if (new URL(request.url).host === LOCAL_HOST) {
			if (request.method !== "GET" && request.method !== "HEAD") {
				return new Response("Method Not Allowed", { status: 405 });
			}
			return handleLocalRequest(request);
		}
		return net.fetch(request, { bypassCustomProtocolHandlers: true });
	});
}

// 获取单实例锁
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
	// 如果获取失败，说明已经有实例在运行了，直接退出
	app.quit();
}

app.setAppUserModelId("com.libnoname.noname");

//防止32位无名杀的乱码
app.setName("无名杀");
// protocol.handle 内部会 new Headers(request.headers)，非 Latin-1 的 UA 会使其抛错（ERR_UNEXPECTED）
app.userAgentFallback = app.userAgentFallback.replace("无名杀", "noname");

function setPath(path1: any, path2: any) {
	app.getPath(path1);
	fs.mkdirSync(path2, { recursive: true });
	app.setPath(path1, path2);
}

setPath("home", path.join(dirname, "Home"));
setPath("appData", path.join(dirname, "Home", "AppData"));
setPath("userData", path.join(dirname, "Home", "UserData"));
setPath("temp", path.join(dirname, "Home", "Temp"));
setPath("cache", path.join(dirname, "Home", "Cache"));
//崩溃转储文件存储的目录
setPath("crashDumps", path.join(dirname, "Home", "crashDumps"));
//日志目录
setPath("logs", path.join(dirname, "Home", "logs"));

//崩溃处理
crashReporter.start({
	productName: "无名杀",
	//崩溃报告将被收集并存储在崩溃目录中，不会上传
	uploadToServer: false,
	compress: false,
});

// 其他实例启动时，主实例会通过 second-instance 事件接收其他实例的启动参数 `argv`
app.on("second-instance", (event, argv) => {
	// Windows 下通过协议URL启动时，URL会作为参数，所以需要在这个事件里处理
	if (process.platform === "win32") {
		createWindow();
	}
});

// macOS 下通过协议URL启动时，主实例会通过 open-url 事件接收这个 URL
app.on("open-url", (event, urlStr) => {
	createWindow();
});

app.setAboutPanelOptions({
	iconPath: "noname.ico",
	website: "https://github.com/libnoname/noname",
});

process.env["ELECTRON_DEFAULT_ERROR_MODE"] = "true";
process.env["ELECTRON_DISABLE_SECURITY_WARNINGS"] = "true";
process.noDeprecation = true;

function createWindow() {
	createMainWindow();
}

function createMainWindow() {
	let win = new BrowserWindow({
		width: 1000,
		height: 800,
		title: "无名杀",
		icon: path.join(dirname, "noname.ico"),
		webPreferences: {
			webSecurity: false,
			preload: path.join(dirname, "app/preload.js"),
			nodeIntegration: true, //主页面用node
			nodeIntegrationInSubFrames: true, //子页面用node
			nodeIntegrationInWorker: true, //worker用node
			contextIsolation: false, //必须为false
			plugins: true, //启用插件
			// @ts-ignore
			enableRemoteModule: true, //可以调用Remote
			experimentalFeatures: true, //启用Chromium的实验功能
		},
	});
	if (import.meta.env.DEV) {
		win.loadURL(`http://localhost:8080`);
	} else {
		win.loadURL(`http://${LOCAL_HOST}/index.html`);
	}
	remote.enable(win.webContents);
	const menuTemplate: Electron.MenuItemConstructorOptions[] = [
		{
			label: "操作",
			submenu: [
				{
					label: "打开无名杀目录",
					click: () => {
						shell.showItemInFolder(path.join(app.getAppPath(), "app"));
					},
				},
			],
		},
		{
			label: "窗口",
			submenu: [
				{
					label: "重新加载当前窗口",
					role: "reload",
				},
				{
					label: "打开/关闭控制台",
					role: "toggleDevTools",
				},
				{
					type: "separator",
				},
				{
					label: "全屏模式",
					role: "togglefullscreen",
				},
				{
					label: "最小化",
					role: "minimize",
				},
				{
					type: "separator",
				},
			],
		},
		{
			label: "帮助",
			submenu: [
				{
					label: "bug反馈",
					click: () => {
						shell.openExternal("https://tieba.baidu.com/p/9117747182");
					},
				},
				{
					label: "版权声明",
					click: () => {
						dialog.showMessageBoxSync(win, {
							message:
								"【无名杀】属于个人（水乎）开发项目且【完全免费】。如非法倒卖用于牟利将承担法律责任 开发团队将追究到底",
							type: "info",
							title: "版权声明",
							icon: path.join(app.getAppPath(), "app", "noname.ico"),
						});
					},
				},
			],
		},
	];
	Menu.setApplicationMenu(Menu.buildFromTemplate(menuTemplate));
	return win;
}

app.whenReady().then(() => {
	if (!import.meta.env.DEV) registerLocalProtocol();
	createWindow();
	app.on("activate", () => {
		if (BrowserWindow.getAllWindows().length === 0) {
			createWindow();
		}
	});
});

app.on("window-all-closed", () => {
	if (process.platform !== "darwin") {
		app.quit();
	}
});
