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
