// Native video decoding only: no per-frame canvas copies or game-event hooks.
export function createMotionController({ enabled }) {
    const records = new Map(), failedSources = new Set();
    const portraitLimit = (navigator.deviceMemory && navigator.deviceMemory <= 4) || navigator.hardwareConcurrency <= 4 ? 1 : 2;
    let started = false, disposed = false, timer, idle, loading;
    let prepared, prepareTimer, preparedExpiry;
    const observer = typeof IntersectionObserver === "function" ? new IntersectionObserver(entries => {
        for (const entry of entries) {
            const record = records.get(entry.target);
            if (record) record.visible = entry.isIntersecting;
        }
        refresh();
    }) : null;

    function cancelPump() {
        clearTimeout(timer); timer = null;
        if (idle != null) window.cancelIdleCallback?.(idle);
        idle = null;
    }
    function clearPrepared() {
        clearTimeout(prepareTimer); clearTimeout(preparedExpiry);
        prepareTimer = preparedExpiry = null;
        if (prepared) {
            prepared.video.onloadeddata = prepared.video.onerror = null;
            prepared.video.pause(); prepared.video.removeAttribute("src"); prepared.video.load();
            prepared = null;
        }
    }
    function prepare(source) {
        if (disposed || !enabled() || document.hidden || navigator.connection?.saveData || prepared?.source === source || prepareTimer) return;
        if ([...records.values()].some(record => record.source === source && record.video)) return;
        // One likely portrait while its selection button is on screen; never warm
        // both landscapes or create a second decoder for an already playing clip.
        prepareTimer = setTimeout(() => {
            prepareTimer = null;
            if (disposed || !enabled() || document.hidden || loading) return;
            clearPrepared();
            const video = document.createElement("video");
            video.muted = video.defaultMuted = true; video.playsInline = true;
            video.preload = "auto";
            prepared = { source, video };
            video.onerror = clearPrepared;
            video.onloadeddata = () => { video.preload = "metadata"; };
            preparedExpiry = setTimeout(clearPrepared, 30000);
            video.src = source; video.load();
        }, 100);
    }
    function finishLoading(record) {
        clearTimeout(record.timeout); record.timeout = null;
        if (loading === record) loading = null;
        queue();
    }
    function release(record) {
        ++record.revision;
        clearTimeout(record.timeout); record.timeout = null;
        if (loading === record) loading = null;
        const video = record.video;
        record.video = null; record.ready = false; record.pending = false;
        record.quality = null; record.badSamples = 0;
        if (!video) return;
        if (record.frame != null) video.cancelVideoFrameCallback?.(record.frame);
        record.frame = null;
        video.onplaying = video.onerror = video.onwaiting = video.onstalled = null;
        video.pause(); video.removeAttribute("src"); video.load(); video.remove();
    }
    function detach(host) {
        const record = records.get(host);
        if (!record) return;
        observer?.unobserve(host); records.delete(host); release(record); queue();
    }
    function fail(record) {
        failedSources.add(record.source); release(record); refresh();
    }
    function watch(record) {
        if (record.timeout || !record.allowed || document.hidden) return;
        record.timeout = setTimeout(() => {
            record.timeout = null;
            if (record.video && record.allowed && !document.hidden) fail(record);
        }, 15000);
    }
    function play(record) {
        const video = record.video;
        if (!video || !record.allowed || document.hidden || record.blocked || record.pending || !video.paused) return;
        const revision = record.revision;
        record.pending = true;
        video.play()?.then(() => {
            if (revision !== record.revision) return;
            record.pending = false;
            if (!record.allowed || document.hidden) video.pause();
        }).catch(error => {
            if (revision !== record.revision) return;
            record.pending = false;
            if (error.name === "AbortError") return;
            if (error.name === "NotAllowedError") {
                // Retry only on a real gesture, not on every reconciliation tick.
                record.blocked = true; release(record); refresh();
            } else fail(record);
        });
    }
    function load(record) {
        loading = record;
        const cached = prepared?.source === record.source;
        const video = cached ? prepared.video : document.createElement("video");
        if (cached) {
            clearTimeout(preparedExpiry); preparedExpiry = null;
            video.onloadeddata = video.onerror = null;
            prepared = null;
        } else if (record.kind === "portrait") clearPrepared();
        const revision = ++record.revision;
        record.video = video;
        video.className = "hlhj-motion-video";
        video.muted = video.defaultMuted = true;
        video.loop = true; video.playsInline = true; video.preload = "none";
        video.controls = false; video.disablePictureInPicture = true;
        video.disableRemotePlayback = true; video.tabIndex = -1;
        video.setAttribute("muted", ""); video.setAttribute("playsinline", "");
        video.setAttribute("webkit-playsinline", ""); video.setAttribute("aria-hidden", "true");
        const current = () => record.video === video && revision === record.revision;
        const reveal = () => {
            record.frame = null;
            if (!current() || !record.allowed || document.hidden) return;
            record.ready = true;
            video.classList.add("visible");
            finishLoading(record);
        };
        video.onplaying = () => {
            if (!current() || !record.allowed || document.hidden) { video.pause(); return; }
            if (record.ready) { finishLoading(record); return; }
            // Wait for a decoded frame, not metadata/canplay, before covering the poster.
            if (record.frame == null) {
                if (video.requestVideoFrameCallback) record.frame = video.requestVideoFrameCallback(reveal);
                else reveal(); // playing already guarantees decoded media on older WebViews.
            }
        };
        video.onerror = () => { if (current()) fail(record); };
        video.onwaiting = video.onstalled = () => { if (current()) watch(record); };
        record.host.append(video);
        if (!cached) video.src = record.source;
        watch(record); play(record);
    }
    function queue() {
        if (!started || disposed || loading || timer != null || idle != null || document.hidden || !enabled()) return;
        if (![...records.values()].some(record => record.allowed && !record.video && !record.blocked && !failedSources.has(record.source))) return;
        // Stagger source assignment as well as decoding; never fetch all four clips at entry.
        timer = setTimeout(() => {
            timer = null;
            const run = () => {
                idle = null;
                if (disposed || loading || document.hidden || !enabled()) return;
                const record = [...records.values()].sort((a, b) => a.priority - b.priority).find(record => record.allowed && record.host.isConnected && !record.video && !record.blocked && !failedSources.has(record.source));
                if (record) load(record);
            };
            const portraitWaiting = [...records.values()].some(record => record.allowed && !record.video && record.kind === "portrait");
            if (!portraitWaiting && window.requestIdleCallback) idle = window.requestIdleCallback(run, { timeout: 150 });
            else run();
        }, 0);
    }
    function refresh() {
        if (disposed) return;
        const permitted = started && enabled();
        let portraitCount = 0, backgroundCount = 0;
        for (const record of [...records.values()].sort((a, b) => a.priority - b.priority)) {
            if (!record.host.isConnected) { detach(record.host); continue; }
            const eligible = permitted && record.active && record.visible && !record.blocked && !failedSources.has(record.source);
            const selected = eligible && (record.kind === "portrait" ? portraitCount++ < portraitLimit : backgroundCount++ < 1);
            record.allowed = selected && !document.hidden;
            if (!selected) {
                // Retired frames may remain briefly for a crossfade, but never keep decoding.
                if (!record.active && record.ready && permitted) {
                    record.video?.pause(); clearTimeout(record.timeout); record.timeout = null;
                } else release(record);
                continue;
            }
            if (document.hidden) {
                if (!record.ready) release(record);
                else { record.video?.pause(); clearTimeout(record.timeout); record.timeout = null; record.quality = null; }
            } else if (record.video) {
                play(record);
                if (!record.ready) watch(record);
            }
        }
        if (!permitted || document.hidden) {
            cancelPump();
            if (document.hidden || !enabled()) clearPrepared();
        }
        else queue();
    }
    function attach(host, source, kind, priority = 1) {
        if (disposed || !source) return;
        detach(host);
        // A landscape's slow first frame must not occupy the only loading slot
        // while the newly chosen general is waiting to animate.
        if (kind === "portrait" && loading?.kind === "background" && !loading.ready) release(loading);
        records.set(host, { host, source, kind, priority, active: true, visible: !observer || kind === "background", allowed: false,
            revision: 0, video: null, ready: false, blocked: false, pending: false, frame: null, timeout: null, quality: null, badSamples: 0 });
        if (kind === "portrait") observer?.observe(host);
        refresh();
    }
    function retire(host) {
        const record = records.get(host);
        if (record) { record.active = false; refresh(); }
    }
    function removeTree(node) {
        if (!node) return;
        for (const host of records.keys()) if (host === node || node.contains(host)) detach(host);
    }
    function tick() {
        refresh();
        const now = performance.now();
        for (const record of records.values()) {
            const video = record.video;
            if (!record.allowed || !record.ready || !video || video.paused || !video.getVideoPlaybackQuality) continue;
            const previous = record.quality;
            if (previous && now - previous.time < 4000) continue;
            const quality = video.getVideoPlaybackQuality();
            record.quality = { time: now, total: quality.totalVideoFrames, dropped: quality.droppedVideoFrames };
            if (!previous) continue;
            const total = quality.totalVideoFrames - previous.total;
            const dropped = quality.droppedVideoFrames - previous.dropped;
            record.badSamples = total >= 24 && dropped / total > 0.2 ? record.badSamples + 1 : 0;
            // Sustained decoder overload falls back once; no expensive reload loop.
            if (record.badSamples >= 2) fail(record);
        }
    }
    return {
        attach, retire, removeTree, refresh, tick, prepare,
        start() {
            if (started || disposed) return;
            started = true; refresh();
        },
        gesture() { for (const record of records.values()) record.blocked = false; refresh(); },
        dispose() {
            disposed = true; cancelPump(); clearPrepared(); observer?.disconnect();
            for (const record of records.values()) release(record);
            records.clear(); failedSources.clear();
        },
    };
}
