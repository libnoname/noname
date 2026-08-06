export function isExternalAudioSource(source) {
	return typeof source === "string" && ["blob:", "data:", "file:", "http:", "https:"].some(prefix => source.startsWith(prefix));
}

export function getAudioSourceCandidates(source) {
	if (!source || isExternalAudioSource(source)) {
		return [source];
	}
	if (typeof source !== "string" || /\.[^./\\]+$/.test(source)) {
		return [source];
	}
	return [`${source}.m4a`, `${source}.mp3`];
}

export function setAudioSourceWithFallback(audio, sources, onError) {
	const candidates = Array.from(new Set(sources.filter(Boolean)));
	let index = 0;
	audio.onerror = event => {
		if (index + 1 < candidates.length) {
			index++;
			audio.src = candidates[index];
			return;
		}
		onError?.(event);
	};
	if (candidates.length) {
		audio.src = candidates[0];
	} else {
		onError?.();
	}
}
