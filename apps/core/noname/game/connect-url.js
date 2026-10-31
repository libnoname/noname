/**
 * 联机地址规范化：把玩家输入的地址整理成可直接用于 WebSocket 的 URL。
 *
 * 处理内容：
 * - 全角标点转半角、去首尾空白
 * - `http://` → `ws://`、`https://` → `wss://`；其它协议返回 null
 * - 未写协议时按 `useWss` 补 `ws://` / `wss://`
 * - 旧版兼容：未写协议且未写端口的地址补 8080（与桌面端既有行为一致；
 *   服务在其它端口时请显式写 `:端口`）
 *
 * @param {string} input 玩家输入
 * @param {boolean} [useWss] 是否使用 wss（来自「使用 WSS 协议」开关）
 * @returns {URL | null} 解析成功返回 URL，无法解析返回 null
 */
function normalizeInput(input) {
	return String(input ?? "")
		.replace(/：/g, ":")
		.replace(/／/g, "/")
		.replace(/．/g, ".")
		.replace(/[\s\u3000]+/g, "");
}

export function normalizeConnectAddress(input, useWss = false) {
	const text = normalizeInput(input);
	if (!text) {
		return null;
	}

	let href;
	const scheme = /^([a-zA-Z][a-zA-Z0-9+.-]*):\/\//.exec(text);
	if (scheme) {
		const name = scheme[1].toLowerCase();
		const rest = text.slice(scheme[0].length);
		if (name === "http") {
			href = `ws://${rest}`;
		} else if (name === "https") {
			href = `wss://${rest}`;
		} else if (name === "ws" || name === "wss") {
			href = `${name}://${rest}`;
		} else {
			return null;
		}
	} else {
		href = `${useWss ? "wss" : "ws"}://${text}`;
	}

	let url;
	try {
		url = new URL(href);
	} catch {
		return null;
	}
	if (url.protocol !== "ws:" && url.protocol !== "wss:") {
		return null;
	}
	if (!url.hostname) {
		return null;
	}

	if (!url.port) {
		const hostPart = text.split("://").pop() ?? "";
		const hasPort = /:\d+(?:[/?#]|$)/.test(hostPart);
		if (!hasPort && !scheme) {
			// 与桌面端既有行为对齐：未写协议、未写端口时默认 8080
			url.port = "8080";
		}
	}

	return url;
}
