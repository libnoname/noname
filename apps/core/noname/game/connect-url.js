/**
 * 联机地址规范化：把玩家输入的地址整理成可直接用于 WebSocket 的 URL。
 *
 * 处理内容：
 * - 按 NFKC 归一化（全角标点/字母转半角）并去掉所有空白
 * - `http://` → `ws://`、`https://` → `wss://`；其它协议返回 null
 * - 未写协议时按 `useWss` 补 `ws://` / `wss://`
 * - 旧版兼容：未写协议、未写端口且无路径的地址补 8080（与桌面端既有行为一致；
 *   带路径或服务在其它端口时请显式写 `:端口`）
 *
 * @param {string} input 玩家输入
 * @param {boolean} [useWss] 是否使用 wss（来自「使用 WSS 协议」开关）
 * @returns {URL | null} 解析成功返回 URL，无法解析返回 null
 */
export function normalizeConnectAddress(input, useWss = false) {
	const text = String(input ?? "")
		.normalize("NFKC")
		.replace(/\s+/g, "");
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
		// 与桌面端既有行为对齐：未写协议、未写端口、且没有路径时才默认 8080
		// （带路径的地址沿用旧行为，不补端口）
		if (!hasPort && !scheme && url.pathname === "/") {
			url.port = "8080";
		}
	}

	return url;
}
