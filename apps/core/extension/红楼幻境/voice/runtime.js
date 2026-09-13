import { openVoicePanel } from "./panel.js";

// Single-file catalogs remain supported for characters with only one take.
export function voiceFiles(clip) {
    return Array.isArray(clip?.variants) ? clip.variants : clip?.file ? [clip.file] : [];
}

// Shared, optional presentation layer. No game-state, card or RNG mutation.
export function installVoiceRuntime(lib, game, ui, get, status) {
    if (game.hlhjVoice) return game.hlhjVoice;
    const registry = new Map(), entered = new WeakSet();
    const last = new Map(), cooldowns = new Map(), failed = new Set(), musicAdapters = new Set();
    const active = new Set(), received = new Set(), captions = [];
    const defaults = { enabled: true, skills: true, life: true, appearance: true, subtitles: true, volume: 1, appearanceInterval: 60 };
    const prefs = { ...defaults, ...lib.config.hlhj_voice };
    prefs.volume = Math.max(0, Math.min(1, Number(prefs.volume) || 0));
    const browser = typeof document !== "undefined" && !(typeof window !== "undefined" && window.__nonameHostEmit);
    let caption, panel, stopped = false, sequence = 0;
    function shown(player, character) {
        return [player?.name, player?.name1, player?.name2].includes(character) &&
            !player.isUnseen?.(player.name2 === character ? 1 : 0);
    }
    function duck(value) { for (const adapter of musicAdapters) adapter(value); }
    function updateDucking() { duck([...active].some(job => job.playing) ? 0.35 : 1); }
    function release(job) {
        clearTimeout(job.expiry);
        const audio = job.audio; job.audio = null; job.playing = false;
        if (audio) {
            audio.autoplay = false; audio.oncanplay = null; audio.pause(); audio.remove();
            // Native playAudio may still have a pending resource-resolution microtask.
            Promise.resolve().then(() => { audio.pause(); audio.remove(); });
        }
    }
    function renderCaptions() {
        // Completed later lines stay until earlier lines finish: strict FIFO
        // removal, independent of overlapping audio durations and load order.
        while (captions[0]?.done) captions.shift().row?.remove();
        if (!prefs.subtitles || !captions.length) { caption?.remove(); caption = null; return; }
        if (!caption) {
            caption = document.createElement("div");
            caption.style.cssText = "position:fixed;left:10%;right:10%;bottom:19%;max-height:28vh;overflow-y:auto;z-index:100;pointer-events:none;display:flex;flex-direction:column;gap:4px;text-align:center;color:#fff3d0;font:20px/1.65 serif;text-shadow:0 1px 4px #000,0 0 8px #000;";
            document.body.append(caption);
        }
        for (const job of captions) {
            if (!job.row && job.started) {
                job.row = document.createElement("div");
                job.row.style.cssText = "position:relative;flex:none;overflow-wrap:anywhere;";
                job.row.textContent = job.spec.label + "：" + job.spec.clips[job.packet.line].text;
            }
            if (job.row) caption.append(job.row);
        }
        caption.scrollTop = caption.scrollHeight;
    }
    function notify(job, state) {
        job.onState?.({ state, file: job.file, time: job.audio?.currentTime || 0, duration: job.audio?.duration || 0 });
    }
    function finish(job, state = "ended") {
        if (!active.delete(job)) return;
        notify(job, state);
        release(job); job.done = true;
        renderCaptions(); updateDucking();
    }
    function stop() {
        for (const job of active) { notify(job, "stopped"); release(job); job.done = true; }
        active.clear(); captions.length = 0;
        caption?.remove(); caption = null; updateDucking();
    }
    function available(character, event) {
        const spec = registry.get(character), rule = spec?.events[event];
        return rule ? rule.lines.filter(id => availableFiles(character, id).length) : [];
    }
    function availableFiles(character, line) {
        return voiceFiles(registry.get(character)?.clips[line]).filter(file => !failed.has(character + ":" + file));
    }
    function enabled(rule, preview) {
        return !stopped && (preview || (prefs.enabled && prefs[rule.category || "skills"] && lib.config.background_speak !== false));
    }
    function play(job) {
        const { packet, rule, spec } = job;
        if (!active.has(job)) return;
        if (!enabled(rule, packet.preview) || document.hidden) { finish(job, "stopped"); return; }
        const files = availableFiles(packet.character, packet.line);
        if (!files.length) { finish(job, "error"); return; }
        // Usually use the authority's chosen take. If this client cannot load
        // that file, try another take of the same line without losing its text.
        const file = files.includes(packet.file) ? packet.file : files[Math.floor(Math.random() * files.length)];
        job.file = file;
        notify(job, "loading");
        // Legacy string signature is supported by both the current engine and
        // older module-based releases; native playback supplies replay recording.
        let audio;
        const retry = () => {
            if (!active.has(job) || (audio && job.audio !== audio)) return;
            failed.add(packet.character + ":" + file);
            // Auditioning a chosen version must never silently substitute a
            // different performance; gameplay still falls back within the line.
            if (packet.preview) { finish(job, "error"); return; }
            release(job); updateDucking();
            if (Date.now() < job.expires && availableFiles(packet.character, packet.line).length) play(job);
            else finish(job, "error");
        };
        try {
            audio = packet.preview ? new Audio(lib.assetURL + spec.root + file) : game.playAudio("..", spec.root + file);
        }
        catch { retry(); return; }
        if (!audio?.addEventListener) { finish(job, "error"); return; }
        job.audio = audio;
        audio.volume = Math.max(0, Math.min(1, prefs.volume * (Number(lib.config.volumn_audio ?? 8) / 8)));
        const ended = () => { if (job.audio === audio) finish(job); };
        audio.addEventListener("ended", ended, { once: true });
        audio.addEventListener("error", retry, { once: true });
        audio.addEventListener("timeupdate", () => { if (active.has(job) && job.audio === audio) notify(job, "playing"); });
        audio.addEventListener("playing", () => {
            if (!active.has(job) || job.audio !== audio) { audio.pause(); audio.remove(); return; }
            clearTimeout(job.expiry);
            job.expiry = setTimeout(ended, Math.max(15000, Math.min(120000, (Number(audio.duration) || 30) * 1000 + 3000)));
            job.playing = job.started = true;
            notify(job, "playing");
            updateDucking(); renderCaptions();
        });
        // Each utterance owns its timeout, audio and subtitle row. An error or
        // blocked autoplay never stops another overlapping utterance.
        job.expiry = setTimeout(() => { if (job.audio === audio) finish(job, "error"); }, 10000);
        if (packet.preview) audio.play()?.catch(error => {
            if (!active.has(job) || job.audio !== audio) return;
            if (error.name === "NotAllowedError") notify(job, "blocked");
            else retry();
        });
    }
    function receive(player, packet) {
        const spec = registry.get(packet.character), rule = spec?.events[packet.event];
        if (!rule || !rule.lines.includes(packet.line) || !spec.clips[packet.line]) return;
        // Only catalog paths are accepted; do not play arbitrary broadcast URLs.
        if (packet.file != null && !voiceFiles(spec.clips[packet.line]).includes(packet.file)) return;
        if (packet.event === "enter" && player) entered.add(player);
        if (!browser || status.video || !enabled(rule, packet.preview) || document.hidden) return;
        // Private delivery can reach the owner both locally and via player.send.
        // Deduplicate delivery IDs, not separate activations of the same skill.
        if (packet.id) {
            if (received.has(packet.id)) return;
            received.add(packet.id);
            if (received.size > 512) received.delete(received.values().next().value);
        }
        const key = `${packet.character}:${player?.playerid || player?.dataset?.position || "local"}:${rule.group || packet.event}`;
        const wait = rule.category === "appearance" ? Number(prefs.appearanceInterval) * 1000 :
            rule.category === "skills" ? 0 : (rule.cooldown ?? 3) * 1000;
        if (!packet.preview && Date.now() - (cooldowns.get(key) || 0) < wait) return;
        cooldowns.set(key, Date.now());
        const job = { packet, spec, rule, expires: Date.now() + (rule.ttl ?? 10) * 1000 };
        active.add(job); captions.push(job); play(job);
    }
    // Keep the public hook compatible with existing characters. Parallel
    // playback does not suppress child skill cues according to priority.
    function scope() {}
    function emit(player, character, eventName, options = {}) {
        const spec = registry.get(character), rule = spec?.events[eventName];
        if (!rule || status.video || (!options.local && game.online)) return;
        if (!options.preview && rule.category === "appearance" &&
            ((!entered.has(player) && !(game.phaseNumber > 0)) || !shown(player, character) || !player?.isIn?.() || status.over)) return;
        const ids = available(character, eventName);
        if (!ids.length) return;
        const key = character + ":" + eventName, previous = last.get(key);
        const candidates = ids.length > 1 ? ids.filter(id => id !== previous) : ids;
        const line = candidates[Math.floor(Math.random() * candidates.length)]; last.set(key, line);
        // Pick a line first, then one of its takes. Extra recordings must not
        // make that line more likely than other lines in the same event pool.
        const variants = availableFiles(character, line);
        const file = variants[Math.floor(Math.random() * variants.length)];
        const packet = { id: `${Date.now()}:${++sequence}`, character, event: eventName, line, file, preview: !!options.preview };
        if (options.local || options.preview) receive(player, packet);
        else if (options.private) {
            if (game.me === player) receive(player, packet);
            player?.send?.(function (target, data) { game.hlhjVoice?.receive(target, data); }, player, packet);
        } else if (typeof game.broadcastAll === "function") {
            game.broadcastAll(function (target, data) { game.hlhjVoice?.receive(target, data); }, player, packet);
        } else {
            receive(player, packet);
            game.broadcast?.(function (target, data) { game.hlhjVoice?.receive(target, data); }, player, packet);
        }
        if (!browser && !options.private && !options.local) game.addVideo?.("playAudio", null, "../" + spec.root + file);
    }
    function lifecycle(name, player, trigger) {
        for (const character of registry.keys()) {
            if (!shown(player, character)) continue;
            if (["phaseBefore", "enterGame", "showCharacterAfter"].includes(name)) {
                if (!entered.has(player) || name === "enterGame") { entered.add(player); emit(player, character, "enter"); }
            } else if (name === "dieBegin") {
                // Native default death paths are disabled only for a character
                // with an installed custom death pool, never for other packs.
                if (available(character, "death").length) trigger.noDieAudio = true;
                emit(player, character, "death");
            } else if (name === "dying") emit(player, character, "dying");
            else if (name === "damageEnd") emit(player, character, "hurt");
        }
        if (name === "damageEnd") {
            for (const source of game.players || []) for (const [character, spec] of registry) {
                if (source !== player && source.isIn() && shown(source, character) && spec.isBond?.(source, player)) emit(source, character, "bondHurt");
            }
        }
    }
    const ruleSkill = {
        charlotte: true, forced: true, silent: true, popup: false, forceDie: true, lastDo: true, priority: -100,
        trigger: { global: "phaseBefore", player: ["enterGame", "showCharacterAfter", "damageEnd", "dying", "dieBegin"] },
        filter(event, player) {
            if (event.name === "damage") return [...registry].some(([id, spec]) => shown(player, id) || (game.players || []).some(source => shown(source, id) && spec.isBond?.(source, player)));
            return [...registry.keys()].some(id => shown(player, id)) && (event.name !== "phase" || !entered.has(player));
        },
        async content(event, trigger, player) { lifecycle(event.triggername, player, trigger); },
    };
    function configure(key, value) {
        prefs[key] = value;
        game.saveConfig("hlhj_voice", { ...prefs });
        if (key === "subtitles") renderCaptions();
        else if (key === "volume") {
            for (const job of active) if (job.audio) job.audio.volume = prefs.volume * Math.max(0, Math.min(1, Number(lib.config.volumn_audio ?? 8) / 8));
        } else for (const job of [...active]) {
            if (!enabled(job.rule, job.packet.preview)) finish(job, "stopped");
        }
    }
    function preview(character, event, line, file, onState) {
        const spec = registry.get(character), rule = spec?.events[event];
        if (!browser || !rule?.lines.includes(line)) return;
        const variants = voiceFiles(spec.clips[line]);
        if (!variants.length || (file && !variants.includes(file))) return;
        file ||= variants[Math.floor(Math.random() * variants.length)];
        // Explicit retry is allowed even if a previous attempt failed.
        failed.delete(character + ":" + file);
        const packet = { character, event, line, file, preview: true };
        const job = { packet, spec, rule, onState, expires: Date.now() + 10000 };
        active.add(job); captions.push(job); play(job);
        return { stop: () => finish(job, "stopped") };
    }
    function open() {
        if (!browser) return;
        panel?.close();
        panel = openVoicePanel({ registry, prefs, files: voiceFiles, configure, preview, stopAll: stop });
    }
    if (browser) {
        const resume = () => {
            if (document.hidden) return;
            for (const job of active) if (job.audio?.paused) job.audio.play()?.catch(() => {});
        };
        document.addEventListener("pointerdown", resume, { passive: true });
        document.addEventListener("keydown", resume);
        document.addEventListener("visibilitychange", () => { if (document.hidden) stop(); });
        window.addEventListener("pagehide", () => { stopped = true; stop(); }, { once: true });
        (lib.arenaReady ||= []).push(() => { if (!ui.hlhjVoiceButton) ui.hlhjVoiceButton = ui.create.system("红楼配音", open, true); });
        (lib.onover ||= []).push(result => {
            for (const character of registry.keys()) if (shown(game.me, character) && typeof result === "boolean") emit(game.me, character, result ? "win" : "lose", { local: true, event: false });
        });
    }
    return game.hlhjVoice = {
        register(spec) { registry.set(spec.character, spec); }, emit, receive, scope, shown, entered, ruleSkill, open, stop,
        addMusicAdapter(adapter) {
            musicAdapters.add(adapter);
            // Let the registering controller finish initializing its media state.
            Promise.resolve().then(() => { if (musicAdapters.has(adapter)) adapter([...active].some(job => job.playing) ? 0.35 : 1); });
            return () => musicAdapters.delete(adapter);
        },
    };
}
