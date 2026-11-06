// ==============================================================================
// ■ local-protocol.ts
// ------------------------------------------------------------------------------
// 拦截 HTTP 协议，以 `localhost:8089` 提供游戏本地静态文件，替代原本地 HTTP 服务。
// ==============================================================================

/**
 * @file
 * 为何全局拦截 http，而非启动本地 http 服务、改用 file:// 或自定义协议：
 * - 页面 origin 必须保持 `http://localhost:8089`，否则 localStorage / IndexedDB 中已有的配置与存档会因 origin 变化而丢失
 * - 不启动真实的 http 服务：监听端口会暴露给本机其他网页与进程（#4524），且端口可能被占用
 * - 兼容通过 service worker 在运行时编译 TS / Vue 的机制，而 `file://` 下无法注册 service worker
 * - `protocol.handle` 只能按协议拦截，无法按 host 过滤，因此其他 host 的 http 请求也会经过这里，只能转发出去
 *
 * 转发的代价：外部 http 请求改由主进程重新发起，重定向会在主进程内跟随（渲染端的 `response.url` 仍是原地址），
 * 且无法通过 `redirect: "manual"` 规避（请求会挂起）。https / ws / wss 不受影响。
 */

import { net, protocol } from "electron";
import fs from "fs";
import path from "path";
import { pathToFileURL } from "url";

export const LOCAL_HOST = "localhost:8089";

/**
 * 接管默认 session 的 http 协议：`LOCAL_HOST` 下的请求以 `root` 为根目录提供静态文件，其余请求原样转发
 */
export function registerLocalProtocol(root: string) {
	const resolvedRoot = path.resolve(root);
	protocol.handle("http", request => {
		if (new URL(request.url).host === LOCAL_HOST) {
			if (request.method !== "GET" && request.method !== "HEAD") {
				return new Response("Method Not Allowed", { status: 405 });
			}
			return handleLocalRequest(request, resolvedRoot);
		}
		return net.fetch(request, { bypassCustomProtocolHandlers: true });
	});
}

async function handleLocalRequest(request: Request, root: string) {
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
	if (request.method === "HEAD") {
		const response = await net.fetch(fileUrl, stat.size > 0 ? { headers: { Range: "bytes=0-0" } } : undefined);
		await response.arrayBuffer();
		const headers = new Headers(response.headers);
		headers.set("Accept-Ranges", "bytes");
		headers.set("Content-Length", String(stat.size));
		return new Response(null, { status: 200, headers });
	}
	const range = parseRange(request.headers.get("Range"), stat.size);
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
}

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
		if (size === 0) return null;
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
