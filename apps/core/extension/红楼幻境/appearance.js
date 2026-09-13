import { themes } from "./theme/catalog.js";

// Local cosmetics only: no game events, skill replacement or network messages.
export function installDaiyuAppearance(lib, game, ui, get, status, paths) {
    if (typeof document === "undefined" || typeof window.__nonameHostEmit === "function") return;
    if (game.hlhjAppearance) return game.hlhjAppearance;
    const root = paths.theme.replace(/\/?$/, "/");
    const url = path => lib.assetURL + path;
    const defaults = { version: 3, portrait: "cycle", portraitInterval: "15", background: "cycle", startup: "random", music: "follow", order: "sequence", volume: 0.6 };
    const options = {
        portrait: { cycle: "自动轮换（独立计时）", bamboo: "固定 · 潇湘竹影", dream: "固定 · 绛珠归梦", original: "固定 · 绛珠题笺", fate: "随泪数转换" },
        portraitInterval: { "6": "6 秒", "12": "12 秒", "15": "15 秒（默认）", "20": "20 秒", "30": "30 秒", "60": "60 秒" },
        background: { cycle: "每曲结束切换背景", hold: "保持当前背景", bamboo: "固定 · 潇湘竹影", dream: "固定 · 绛珠归梦", system: "使用原背景" },
        startup: { random: "随机选择一套", bamboo: "潇湘竹影", dream: "绛珠归梦" },
        music: { follow: "跟随背景播放对应歌单", system: "使用原音乐", off: "静音" },
        order: { sequence: "顺序循环", shuffle: "随机循环（整轮不重复）" },
    };
    const saved = lib.config.hlhj_appearance || {};
    const prefs = { ...defaults };
    for (const key of Object.keys(options)) if (Object.hasOwn(options[key], saved[key])) prefs[key] = saved[key];
    // Retain explicit fixed choices; migrate the old portrait-linked theme to
    // the independent scene controller. Existing portrait choices stay intact.
    if (saved.version !== defaults.version && ["bamboo", "dream"].includes(saved.music)) {
        if (!saved.background || saved.background === "follow") prefs.background = saved.music;
    }
    // Old installs defaulted to a fixed portrait; migrate once so this release's
    // automatic rotation actually takes effect. Later explicit choices persist.
    if (saved.version !== defaults.version) {
        prefs.portrait = "cycle"; prefs.portraitInterval = "15";
        game.saveConfig("hlhj_appearance", { ...prefs, volume: Number.isFinite(saved.volume) ? Math.max(0, Math.min(1, saved.volume)) : prefs.volume });
    }
    if (Number.isFinite(saved.volume)) prefs.volume = Math.max(0, Math.min(1, saved.volume));
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const portraits = new Map();
    const imageCache = new Map();
    const voicedPortraits = new WeakMap();
    let voiceDucking = 1;
    const removeVoiceAdapter = game.hlhjVoice?.addMusicAdapter(value => { voiceDucking = value; updateVolume(); });
    let alive = [], button, dialog, observer, timer, frame, warmTimer, ended = false, cycleStart = Date.now();
    let backdrop, backgroundKey, music, musicKey, baseMusic, baseWasPlaying = false, stylesheet;
    let audioBlocked = false, failedMusic, audioRevision = 0, playPending = false, panelRefresh;
    let sceneKey, sessionStarted = false;
    const playlist = Object.fromEntries(Object.keys(themes).map(key => [key, { index: 0, queue: null, failed: new Set() }]));
    const trackName = () => themes[musicKey]?.tracks[playlist[musicKey].index].split("/").pop().replace(/\.[^.]+$/, "");
    function ensureScene() {
        if (!sceneKey) sceneKey = prefs.startup === "random" ? (Math.random() < 0.5 ? "bamboo" : "dream") : prefs.startup;
        if (Object.hasOwn(themes, prefs.background)) sceneKey = prefs.background;
        return sceneKey;
    }
    function nextIndex(key) {
        const state = playlist[key], tracks = themes[key].tracks;
        const available = tracks.map((_, index) => index).filter(index => !state.failed.has(index));
        if (!available.length) return false;
        if (prefs.order === "shuffle") {
            if (state.queue) state.queue = state.queue.filter(index => available.includes(index));
            if (!state.queue?.length) {
                state.queue = state.queue === null ? available.filter(index => index !== state.index) : [...available];
                for (let i = state.queue.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [state.queue[i], state.queue[j]] = [state.queue[j], state.queue[i]];
                }
                if (state.queue.length > 1 && state.queue[0] === state.index) {
                    [state.queue[0], state.queue[1]] = [state.queue[1], state.queue[0]];
                }
            }
            state.index = state.queue.shift() ?? available[0];
        } else {
            state.index = available.find(index => index > state.index) ?? available[0];
        }
        return true;
    }
    function retryMusic() {
        failedMusic = null;
        for (const state of Object.values(playlist)) state.failed.clear();
    }
    function finishTrack() {
        if (ended || !sessionStarted || !Object.hasOwn(themes, musicKey)) return;
        nextIndex(musicKey);
        if (prefs.background === "cycle") sceneKey = sceneKey === "bamboo" ? "dream" : "bamboo";
        reconcile(true);
    }
    let audioMessage = "";
    const musicStatus = () => dialog?.querySelector("[data-music-status]");
    function notifyMusic(message) {
        audioMessage = message;
        const node = musicStatus();
        if (node && node.textContent !== message) node.textContent = message;
    }
    function save() { game.saveConfig("hlhj_appearance", { ...prefs }); }
    function isDaiyu(player) { return [player.name, player.name1, player.name2].includes("hlhj_daiyu"); }
    function form(player) {
        if (prefs.portrait === "cycle") return Math.floor((Date.now() - cycleStart) / (Number(prefs.portraitInterval) * 1000)) % 2 ? "dream" : "bamboo";
        if (prefs.portrait === "fate") {
            const limit = lib.skill.hlhj_guimeng?.appearanceThreshold?.() || Infinity;
            return player.countMark("hlhj_lei") >= Math.ceil(limit / 2) ? "dream" : "bamboo";
        }
        return prefs.portrait;
    }
    function portraitPath(key) { return key === "original" ? paths.original : root + (key === "dream" ? "daiyu-dream.png" : "daiyu-bamboo.png"); }
    function loadPortrait(key) {
        if (!imageCache.has(key)) {
            const ready = new Promise((resolve, reject) => {
                const image = new Image(); image.decoding = "async"; image.fetchPriority = "low";
                image.onload = async () => {
                    try { await image.decode?.(); } catch { /* onload already confirmed the image is available */ }
                    resolve(image);
                };
                image.onerror = reject; image.src = url(portraitPath(key));
            }).catch(error => { imageCache.delete(key); throw error; });
            imageCache.set(key, ready);
        }
        return imageCache.get(key);
    }
    function setPortrait(node, key, player) {
        let item = portraits.get(node);
        // Avatar rendering may replace its children. Reattach instead of treating
        // a detached overlay as an already displayed portrait.
        if (item && !item.overlay.isConnected) {
            item.revision++; clearTimeout(item.cleanup); portraits.delete(node); item = null;
        }
        if (!item) {
            const overlay = document.createElement("div");
            overlay.className = "hlhj-portrait-layer";
            overlay.setAttribute("aria-hidden", "true");
            node.append(overlay);
            item = { overlay, key: null, revision: 0 };
            portraits.set(node, item);
        }
        if (item.key === key) return;
        item.key = key;
        const revision = ++item.revision;
        loadPortrait(key).then(image => {
            if (item.revision !== revision || !node.isConnected || !portraits.has(node)) return;
            const next = document.createElement("div");
            next.className = "hlhj-portrait-frame";
            next.style.backgroundImage = `url("${image.src}")`;
            item.overlay.append(next);
            requestAnimationFrame(() => {
                if (item.revision === revision && next.isConnected) {
                    next.classList.add("visible");
                    const previous = voicedPortraits.get(player);
                    voicedPortraits.set(player, key);
                    if (previous && previous !== key) game.hlhjVoice?.emit(player, "hlhj_daiyu", "portrait_" + key, { local: true, event: false });
                }
            });
            // Keep the outgoing image during the fade; never retain a queue.
            clearTimeout(item.cleanup);
            for (const old of [...item.overlay.children].slice(0, -2)) old.remove();
            item.cleanup = setTimeout(() => {
                for (const old of [...item.overlay.children].slice(0, -1)) old.remove();
            }, reducedMotion.matches ? 0 : 1250);
        }).catch(() => { if (item.revision === revision) item.key = null; });
    }
    function setBackground(key) {
        if (!key || key === "system") {
            backdrop?.remove(); backdrop = null; backgroundKey = null;
            return;
        }
        if (backgroundKey === key && backdrop?.isConnected) return;
        if (!backdrop) {
            backdrop = document.createElement("div");
            backdrop.className = "background hlhj-backdrop";
            backdrop.setAttribute("aria-hidden", "true");
            for (const [name, theme] of Object.entries(themes)) {
                const scene = document.createElement("div");
                scene.className = "hlhj-backdrop-scene";
                scene.dataset.scene = name;
                backdrop.append(scene);
            }
            document.body.insertBefore(backdrop, document.body.firstChild);
        }
        const previous = backgroundKey;
        backgroundKey = key;
        // Load only the chosen landscape on entry, leaving bandwidth for the
        // first hand and fonts. The second image loads when it is first selected.
        const scene = backdrop.querySelector(`[data-scene="${key}"]`);
        scene.style.backgroundImage = `url("${url(root + themes[key].image)}")`;
        backdrop.dataset.theme = key;
        if (previous && previous !== key) {
            const ready = new Image();
            ready.onload = () => {
                if (ended || backgroundKey !== key) return;
                const player = alive.find(current => current === game.me && current.isIn()) || alive.find(current => current.isIn());
                if (player) game.hlhjVoice?.emit(player, "hlhj_daiyu", "background_" + key, { local: true, event: false });
            };
            ready.src = url(root + themes[key].image);
        }
    }
    const pauseBase = event => {
        if (event?.type === "play") baseWasPlaying = true;
        if (baseMusic && ((music && !music.paused && !audioBlocked) || musicKey === "off")) baseMusic.pause();
    };
    function releaseMusic() {
        ++audioRevision;
        if (music) { music.onerror = null; music.onended = null; }
        music?.pause();
        if (music) { music.removeAttribute("src"); music.load(); }
        music = null; musicKey = null; audioBlocked = false; playPending = false;
        if (baseMusic) {
            baseMusic.removeEventListener("play", pauseBase);
            if (baseWasPlaying && lib.config.background_music !== "music_off") {
                const result = baseMusic.play();
                result?.catch(() => {});
            }
        }
        baseMusic = null; baseWasPlaying = false;
    }
    function playMusic() {
        if (!music || !Object.hasOwn(themes, musicKey) || document.hidden || playPending || ended) return;
        const playing = music, revision = audioRevision;
        playPending = true;
        playing.play()?.then(() => {
            if (revision !== audioRevision) return;
            playPending = false; audioBlocked = false;
            if (document.hidden) { playing.pause(); return; }
            pauseBase();
            notifyMusic(`正在播放《${trackName()}》${playing.muted || playing.volume === 0 ? "（当前音量为零或静音）" : ""}`);
        }).catch(error => {
            if (revision !== audioRevision) return;
            playPending = false;
            if (error.name === "AbortError") return;
            audioBlocked = true;
            // A blocked new theme should not leave the previously audible game silent.
            if (baseMusic && baseWasPlaying && lib.config.background_music !== "music_off") baseMusic.play()?.catch(() => {});
            notifyMusic(error.name === "NotAllowedError" ? "点击“播放音乐”启用声音" : "音乐暂不可用，可切回原音乐或重试");
        });
    }
    function updateVolume() {
        if (!music) return;
        music.volume = voiceDucking * prefs.volume * (ui.backgroundMusic?.volume ?? 0.5);
        music.muted = ui.backgroundMusic?.muted ?? false;
    }
    function setMusic(key, restart = false) {
        if (key === "system" || lib.config.background_music === "music_off") {
            if (musicKey) releaseMusic();
            notifyMusic(lib.config.background_music === "music_off" ? "本体背景音乐已关闭；请在声音设置中开启" : "正在使用原音乐");
            return;
        }
        if (failedMusic === key) return;
        if (key === musicKey && !restart) {
            updateVolume();
            if (music?.paused && music.readyState >= 2 && !audioBlocked) playMusic();
            if (music && !music.paused) notifyMusic(`正在播放《${trackName()}》${music.muted || music.volume === 0 ? "（当前音量为零或静音）" : ""}`);
            return;
        }
        // Reuse the unlocked media element when changing tracks. Creating a new
        // Audio on every automatic form change can lose browser playback permission.
        ++audioRevision;
        playPending = false;
        if (music) { music.onerror = null; music.onended = null; }
        music?.pause();
        if (!baseMusic && ui.backgroundMusic) {
            baseMusic = ui.backgroundMusic;
            baseWasPlaying = !baseMusic.paused;
            baseMusic.addEventListener("play", pauseBase);
        }
        musicKey = key;
        audioBlocked = false;
        if (key !== "off") {
            if (!music) music = new Audio();
            music.onerror = null;
            music.loop = false;
            music.preload = "metadata";
            updateVolume();
            const candidate = music, revision = audioRevision;
            music.onerror = () => {
                if (candidate !== music || revision !== audioRevision) return;
                playlist[key].failed.add(playlist[key].index);
                if (nextIndex(key)) {
                    setMusic(key, true);
                } else {
                    failedMusic = key; releaseMusic();
                    notifyMusic(`${themes[key].album}的曲目均无法播放，已恢复原音乐；点击播放可重试`);
                }
            };
            music.onended = () => { if (candidate === music && revision === audioRevision) finishTrack(); };
            music.src = url(root + themes[key].tracks[playlist[key].index]);
            music.load();
            notifyMusic(`正在切换至《${trackName()}》…`);
            playMusic();
        } else {
            notifyMusic("黛玉主题音乐已静音");
        }
        if (key === "off") pauseBase();
    }
    function reconcile(restartMusic = false) {
        if (frame) cancelAnimationFrame(frame);
        frame = null;
        if (!ui.window || ended) return;
        alive = [...new Set([...(game.players || []), ...(game.dead || [])])].filter(player => isDaiyu(player) && player.isConnected &&
            !player.isUnseen?.(player.name2 === "hlhj_daiyu" ? 1 : 0));
        if (alive.length && !sessionStarted) {
            sessionStarted = true; cycleStart = Date.now(); ensureScene();
            warmTimer = setTimeout(() => {
                if (!ended) loadPortrait(form(alive[0] || { countMark: () => 0 }) === "dream" ? "bamboo" : "dream").catch(() => {});
            }, 1500);
        }
        const keep = new Set();
        for (const player of alive) {
            const node = player.node[player.name2 === "hlhj_daiyu" ? "avatar2" : "avatar"];
            if (node) { keep.add(node); setPortrait(node, form(player), player); }
        }
        for (const [node, item] of portraits) {
            if (keep.has(node) && item.overlay.isConnected) continue;
            item.revision++; clearTimeout(item.cleanup); item.overlay.remove(); portraits.delete(node);
        }
        setBackground(sessionStarted && prefs.background !== "system" ? ensureScene() : "system");
        const key = sessionStarted ? (prefs.music === "follow" ? (prefs.background === "system" ? "system" : ensureScene()) : prefs.music) : "system";
        setMusic(key, restartMusic === true);
        if (button) button.style.display = sessionStarted ? "" : "none";
        panelRefresh?.();
    }
    function schedule() { if (!frame && !ended) frame = requestAnimationFrame(() => reconcile()); }
    function open() {
        if (dialog?.open) { dialog.focus(); return; }
        const focus = document.activeElement;
        dialog = document.createElement("dialog");
        const panel = dialog;
        dialog.className = "hlhj-theme-dialog";
        dialog.setAttribute("aria-label", "黛玉 · 幻境风华");
        function el(tag, text, parent = dialog) {
            const node = document.createElement(tag);
            if (text) node.textContent = text;
            parent.append(node); return node;
        }
        const header = el("header");
        el("small", "红楼幻境 · 命运", header);
        el("h2", "黛玉 · 幻境风华", header);
        el("p", "一窗竹影，一枕归梦。", header);
        const close = el("button", "关闭", header);
        close.type = "button"; close.onclick = () => panel.close();
        const preview = el("img");
        preview.className = "hlhj-theme-preview";
        preview.alt = "潇湘竹影 · 黛玉原画";
        preview.src = url(root + "daiyu-bamboo.png");
        const fields = el("section"); fields.className = "hlhj-theme-fields";
        const selects = new Map();
        for (const [key, label] of [["portrait", "角色原画"], ["portraitInterval", "原画轮换间隔"], ["background", "背景切换"], ["startup", "开局背景（下局生效）"], ["music", "背景音乐"], ["order", "歌单播放顺序"]]) {
            const row = el("label", label, fields);
            const select = el("select", null, row);
            select.name = key;
            selects.set(key, select);
            for (const [value, text] of Object.entries(options[key])) {
                const option = el("option", text, select); option.value = value;
            }
            select.value = prefs[key];
            select.onchange = () => {
                prefs[key] = select.value; retryMusic();
                if (key === "portrait" || key === "portraitInterval") cycleStart = Date.now();
                if (key === "order") for (const state of Object.values(playlist)) state.queue = null;
                save(); reconcile();
                // change is a user gesture, including retries of an already selected track.
                if (audioBlocked) playMusic();
            };
        }
        const volumeRow = el("label", "主题音乐音量", fields);
        const range = el("input", null, volumeRow); range.type = "range";
        range.min = "0"; range.max = "100"; range.value = String(Math.round(prefs.volume * 100));
        const level = el("output", range.value + "%", volumeRow);
        range.oninput = () => { prefs.volume = Number(range.value) / 100; level.textContent = range.value + "%"; reconcile(); };
        range.onchange = save;
        const hint = el("p", "设置仅在本机生效。原画默认每15秒在竹影、归梦之间轮换；减少动态效果仅取消淡入，不会停用轮换。随泪数模式达到归梦阈值的一半切为归梦，下降后恢复竹影。", fields);
        hint.className = "hlhj-theme-hint";
        el("p", "原画与背景各自切换，互不影响。背景对应独立歌单；每曲结束可换景，也可保持背景并循环歌单。固定背景优先于开局设置。静音、使用原音乐或播放失败时不自动换景；“下一首”只换曲，“切换背景”立即换景换歌单。", fields).className = "hlhj-theme-hint";
        const scenePreview = el("img", null, fields); scenePreview.className = "hlhj-scene-preview";
        const sceneStatus = el("p", null, fields); sceneStatus.className = "hlhj-theme-hint";
        const message = el("p", "选择后立即保存；死亡与结算后保留背景和音乐，离开页面时清理。");
        message.dataset.musicStatus = ""; message.setAttribute("role", "status");
        panelRefresh = () => {
            const subject = alive.includes(game.me) ? game.me : alive[0];
            const key = form(subject || { countMark: () => 0 });
            if (preview.dataset.form !== key) {
                preview.dataset.form = key;
                preview.src = url(portraitPath(key));
                preview.alt = options.portrait[key];
            }
            const scene = backgroundKey && themes[backgroundKey];
            scenePreview.hidden = !scene;
            if (scene && scenePreview.dataset.scene !== backgroundKey) {
                scenePreview.dataset.scene = backgroundKey;
                scenePreview.src = url(root + scene.image); scenePreview.alt = scene.name + "背景";
            }
            const description = !sessionStarted ? "黛玉入场后启用背景与音乐" : scene ? `当前背景：${scene.name} · ${scene.album}（${scene.tracks.length} 首）` : "当前使用原背景与所选音乐设置";
            if (sceneStatus.textContent !== description) sceneStatus.textContent = description;
            selects.get("portraitInterval").disabled = prefs.portrait !== "cycle";
            selects.get("startup").disabled = !["cycle", "hold"].includes(prefs.background);
            selects.get("order").disabled = prefs.music !== "follow" || prefs.background === "system";
        };
        panelRefresh(); notifyMusic(audioMessage || "选择主题后立即保存");
        const footer = el("footer");
        for (const [key, label] of [["bamboo", "固定竹影背景"], ["dream", "固定归梦背景"]]) {
            const preset = el("button", label, footer); preset.type = "button";
            preset.onclick = () => {
                Object.assign(prefs, { background: key, music: "follow" });
                for (const [name, select] of selects) select.value = prefs[name];
                retryMusic(); save(); reconcile(); playMusic();
            };
        }
        const play = el("button", "播放音乐", footer); play.type = "button";
        play.onclick = () => {
            if (!sessionStarted) { notifyMusic("黛玉进入对局后可播放主题音乐"); return; }
            if (lib.config.background_music === "music_off") { notifyMusic("本体已关闭背景音乐，请先在声音设置中开启"); return; }
            if (["off", "system"].includes(prefs.music)) {
                prefs.music = "follow"; save();
                selects.get("music").value = "follow";
            }
            if (prefs.background === "system") {
                prefs.background = "hold"; selects.get("background").value = "hold"; save();
            }
            retryMusic(); reconcile(); playMusic();
        };
        const next = el("button", "下一首", footer); next.type = "button";
        next.onclick = () => {
            if (!sessionStarted || !Object.hasOwn(themes, musicKey)) { notifyMusic("请先启用背景歌单"); return; }
            retryMusic(); nextIndex(musicKey); reconcile(true);
        };
        const switchScene = el("button", "切换背景", footer); switchScene.type = "button";
        switchScene.onclick = () => {
            if (!sessionStarted) { notifyMusic("黛玉进入对局后可切换背景"); return; }
            sceneKey = ensureScene() === "bamboo" ? "dream" : "bamboo";
            if (prefs.background !== "cycle") prefs.background = "hold";
            selects.get("background").value = prefs.background;
            retryMusic(); save(); reconcile(); playMusic();
        };
        const restore = el("button", "恢复默认", footer); restore.type = "button";
        restore.onclick = () => {
            Object.assign(prefs, defaults); retryMusic(); cycleStart = Date.now(); save(); reconcile();
            panel.addEventListener("close", () => open(), { once: true });
            panel.close();
        };
        panel.addEventListener("close", () => {
            if (dialog === panel) { dialog = null; panelRefresh = null; }
            panel.remove(); if (focus?.isConnected) focus.focus();
        }, { once: true });
        document.body.append(dialog); dialog.showModal(); close.focus();
    }
    function onGesture() {
        if (audioBlocked || (music?.paused && Object.hasOwn(themes, musicKey))) playMusic();
    }
    function onVisibility() {
        if (document.hidden) music?.pause();
        else { schedule(); if (music && !audioBlocked) playMusic(); }
    }
    function stop() {
        ended = true; clearInterval(timer); clearTimeout(warmTimer); observer?.disconnect();
        cancelAnimationFrame(frame); frame = null;
        for (const item of portraits.values()) { item.revision++; clearTimeout(item.cleanup); item.overlay.remove(); }
        portraits.clear(); imageCache.clear(); setBackground("system"); releaseMusic(); removeVoiceAdapter?.();
        button?.remove(); button = null; dialog?.close();
        stylesheet?.remove();
        document.removeEventListener("pointerdown", onGesture);
        document.removeEventListener("pointerup", onGesture);
        document.removeEventListener("keydown", onGesture);
        document.removeEventListener("visibilitychange", onVisibility);
    }
    function start() {
        if (observer || ended || !ui.window || !ui.system2) return;
        stylesheet = document.createElement("link");
        stylesheet.rel = "stylesheet"; stylesheet.href = url(root + "appearance.css"); document.head.append(stylesheet);
        button = ui.create.system("黛玉风华", open, true);
        observer = new MutationObserver(schedule);
        // Card movement/animation used to trigger a full reconciliation for every
        // subtree mutation. Watch only seat changes; the timer handles marks.
        observer.observe(ui.arena || ui.window, { childList: true });
        timer = setInterval(schedule, 1000);
        document.addEventListener("pointerdown", onGesture);
        document.addEventListener("pointerup", onGesture);
        document.addEventListener("keydown", onGesture);
        document.addEventListener("visibilitychange", onVisibility);
        // A death can immediately cause game over. Keep local ambience through
        // the result screen and release it only when the page is left/disposed.
        window.addEventListener("pagehide", stop, { once: true });
        schedule();
    }
    lib.arenaReady.push(start);
    if (ui.window) start();
    return game.hlhjAppearance = { open, refresh: schedule, dispose: stop };
}
