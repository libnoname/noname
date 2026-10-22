/**
 * 判断清单之外的内置资源是否存在。
 *
 * WKWebView 的自定义 scheme 在目标文件不存在时，可能让 fetch 直接 reject，
 * 而不是返回 HTTP 404。这种 rejection 只表示本地资源不存在，不应继续向上
 * 抛出并导致整个启动流程失败。
 *
 * 真正的 HTTP 5xx 仍然抛出，避免把资源通道故障误判为文件缺失。
 */
export async function probeBundledResource(url: string, looksLikeAsset: boolean): Promise<boolean> {
	let response: Response;

	try {
		response = await fetch(url);
	} catch {
		// custom scheme 对缺失文件的常见行为：task.didFailWithError → fetch reject。
		return false;
	}

	if (response.status === 404) return false;
	if (!response.ok) {
		throw new Error(`内置资源探测失败 (${response.status}): ${url}`);
	}

	// 目录请求在部分实现下会返回 index.html，因此排除无扩展名的 HTML 响应。
	const contentType = response.headers.get("content-type") ?? "";
	return !contentType.includes("text/html") || looksLikeAsset;
}
