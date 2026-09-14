// Optional bounded prefetch only. Rendering must never wait for this queue.
const cache = new Map<string, Promise<boolean>>();

export function prepareImage(src: string): Promise<boolean> {
	const cached = cache.get(src);
	if (cached) return cached;
	const ready = new Promise<boolean>(resolve => {
		const image = new Image();
		const timeout = setTimeout(() => {
			image.onload = image.onerror = null;
			image.removeAttribute("src"); resolve(false);
		}, 8000);
		image.decoding = "async";
		image.onload = async () => {
			try { await image.decode(); } catch { /* onload is sufficient on older clients */ }
			clearTimeout(timeout); resolve(true);
		};
		image.onerror = () => { clearTimeout(timeout); resolve(false); };
		image.src = src;
	});
	cache.set(src, ready);
	// Evict only completed requests, so simultaneous uses share the in-flight load.
	void ready.then(success => {
		if (!success || cache.size > 256) cache.delete(src);
	});
	return ready;
}

export function warmImages(sources: string[]) {
	const queue = [...new Set(sources)];
	// Share bandwidth with the active screen; no all-character/all-skin preload.
	for (let worker = 0; worker < Math.min(2, queue.length); worker++) {
		void (async () => {
			while (queue.length) {
				await prepareImage(queue.shift()!);
			}
		})();
	}
}
