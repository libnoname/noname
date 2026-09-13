// Self-contained styles travel with the extension module and the built-in pack.
// No dependency on a particular skin, character or external UI library.
const css = `
#hlhj-voice-panel{position:fixed;inset:0;margin:auto;width:min(1120px,calc(100vw - 32px));height:min(800px,calc(100vh - 32px));height:min(800px,calc(100dvh - 32px));max-width:none;max-height:none;padding:0;border:1px solid #8c7958;border-radius:18px;color:#eee7d8;background:linear-gradient(135deg,#1b2926,#242824 55%,#30272c);box-shadow:0 24px 90px #0009;font:14px/1.6 "Microsoft YaHei",sans-serif;z-index:10000;overflow:hidden;text-align:left;color-scheme:dark}
#hlhj-voice-panel::backdrop{background:#080e13ad}
#hlhj-voice-panel *,#hlhj-voice-panel *::before,#hlhj-voice-panel *::after{box-sizing:border-box;position:static;float:none;transform:none;text-shadow:none;letter-spacing:normal}
#hlhj-voice-panel [hidden]{display:none!important}
#hlhj-voice-panel div{transition:none}
#hlhj-voice-panel .vp-shell{display:flex;flex-direction:column;height:100%;min-height:0}
#hlhj-voice-panel header{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:20px 26px;border-bottom:1px solid #bdab7926}
#hlhj-voice-panel h2{margin:0;color:#f1d8a6;font:600 26px/1.4 "Songti SC",SimSun,serif}
#hlhj-voice-panel h3{margin:0;font-size:15px;color:#e5d4af}
#hlhj-voice-panel p{margin:4px 0 0}
#hlhj-voice-panel .vp-muted{font-size:12px;color:#a7b1a8}
#hlhj-voice-panel .vp-body{display:grid;grid-template-columns:268px minmax(0,1fr);flex:1;min-height:0}
#hlhj-voice-panel aside{padding:22px;overflow:auto;border-right:1px solid #bdab7926;background:#101d1826}
#hlhj-voice-panel main{display:flex;flex-direction:column;min-width:0;min-height:0;padding:20px 24px}
#hlhj-voice-panel .vp-switch{display:flex;align-items:center;justify-content:space-between;gap:12px;margin:13px 0;cursor:pointer}
#hlhj-voice-panel input[type=checkbox]{appearance:none;position:relative;width:34px;height:20px;flex:none;border:1px solid #71796c;border-radius:12px;background:#3a433c;cursor:pointer;margin:0}
#hlhj-voice-panel input[type=checkbox]::after{content:"";position:absolute;left:3px;top:3px;width:12px;height:12px;border-radius:50%;background:#aeb7ac}
#hlhj-voice-panel input[type=checkbox]:checked{background:#b69a64;border-color:#b69a64}
#hlhj-voice-panel input[type=checkbox]:checked::after{left:17px;background:#fff7e5}
#hlhj-voice-panel .vp-setting{display:block;padding-top:18px;margin-top:18px;border-top:1px solid #bdab7926}
#hlhj-voice-panel .vp-setting-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:8px}
#hlhj-voice-panel output{color:#ebc789;font-variant-numeric:tabular-nums}
#hlhj-voice-panel input,#hlhj-voice-panel select,#hlhj-voice-panel button{font:inherit;max-width:100%;min-width:0;box-shadow:none;text-shadow:none}
#hlhj-voice-panel select,#hlhj-voice-panel input[type=search]{width:100%;height:38px;padding:7px 10px;border:1px solid #66715c;border-radius:8px;background:#19241f;color:#eee7d8}
#hlhj-voice-panel input[type=range]{width:100%;accent-color:#d6b97d;margin:7px 0}
#hlhj-voice-panel button{display:inline-flex;align-items:center;justify-content:center;gap:6px;min-height:34px;padding:5px 13px;margin:0;border:1px solid #65715f;border-radius:8px;background:#ffffff08;color:#e5e4d7;cursor:pointer;white-space:nowrap}
#hlhj-voice-panel button:hover{background:#c7b37c1f;border-color:#c7b37c}
#hlhj-voice-panel button:disabled{opacity:.4;cursor:default}
#hlhj-voice-panel :focus-visible{outline:2px solid #e1c68a;outline-offset:3px}
#hlhj-voice-panel .vp-primary{background:#c1a574;color:#18231e;border-color:#c1a574}
#hlhj-voice-panel .vp-close{min-width:36px;font-size:22px;padding:0 8px}
#hlhj-voice-panel .vp-filters{display:grid;grid-template-columns:1fr 1.5fr;gap:10px;margin:12px 0 10px}
#hlhj-voice-panel .vp-search{grid-column:1/-1}
#hlhj-voice-panel .vp-toolbar{display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap;padding-bottom:12px}
#hlhj-voice-panel .vp-actions{display:flex;gap:8px;flex-wrap:wrap}
#hlhj-voice-panel .vp-list{flex:1;min-height:0;overflow:auto;overscroll-behavior:contain;padding-right:5px;scrollbar-color:#8a7f62 transparent;scrollbar-width:thin}
#hlhj-voice-panel .vp-card{padding:14px 16px;margin-bottom:10px;border:1px solid #b5ba9a26;border-radius:10px;background:#111b162e}
#hlhj-voice-panel .vp-card[data-playing=true]{border-color:#c4a774;background:#b69b6314}
#hlhj-voice-panel .vp-meta{display:flex;gap:10px;align-items:baseline;flex-wrap:wrap;color:#aab5a8;font-size:12px}
#hlhj-voice-panel .vp-id{color:#d9bb7e;font:600 12px/1.5 monospace}
#hlhj-voice-panel .vp-line{margin:7px 0 12px;color:#f0e5cf;font:19px/1.8 "Songti SC",SimSun,serif;overflow-wrap:anywhere;user-select:text}
#hlhj-voice-panel .vp-controls{display:flex;align-items:center;gap:8px;flex-wrap:wrap}
#hlhj-voice-panel .vp-controls select{width:128px;height:34px}
#hlhj-voice-panel .vp-status{font-size:12px;color:#b9c5b7;min-width:100px}
#hlhj-voice-panel progress{display:block;appearance:none;width:100%;height:3px;margin-top:12px;border:0;border-radius:3px;overflow:hidden;background:#ffffff12;accent-color:#d0b780}
#hlhj-voice-panel progress::-webkit-progress-bar{background:#ffffff12}
#hlhj-voice-panel progress::-webkit-progress-value{background:#d0b780}
#hlhj-voice-panel footer{display:flex;justify-content:space-between;align-items:center;gap:12px;padding-top:12px;color:#a7b1a8;font-size:12px}
#hlhj-voice-panel .vp-empty{padding:35px 15px;text-align:center;color:#a7b1a8}
@media(max-width:720px){#hlhj-voice-panel{width:calc(100vw - 16px);height:calc(100dvh - 16px);border-radius:12px}#hlhj-voice-panel header{padding:12px 16px}#hlhj-voice-panel .vp-body{grid-template-columns:1fr;overflow:auto;display:block}#hlhj-voice-panel aside{border-right:0;border-bottom:1px solid #bdab7926;padding:12px 16px;display:grid;grid-template-columns:1fr 1fr;gap:0 16px}#hlhj-voice-panel aside h3,#hlhj-voice-panel aside>.vp-muted{grid-column:1/-1}#hlhj-voice-panel .vp-switch{margin:7px 0}#hlhj-voice-panel .vp-setting{padding-top:10px;margin-top:8px}#hlhj-voice-panel main{padding:16px;min-height:480px}#hlhj-voice-panel .vp-list{overflow:visible}#hlhj-voice-panel .vp-filters{grid-template-columns:1fr}#hlhj-voice-panel footer{flex-wrap:wrap}}
`;

export function openVoicePanel({ registry, prefs, files, configure, preview, stopAll }) {
    if (!document.getElementById("hlhj-voice-panel-style")) {
        const style = document.createElement("style"); style.id = "hlhj-voice-panel-style"; style.textContent = css; document.head.append(style);
    }
    const previousFocus = document.activeElement, jobs = new Set();
    const dialog = document.createElement("dialog"); dialog.id = "hlhj-voice-panel";
    dialog.setAttribute("aria-label", "红楼配音设置与台词试听");
    for (const type of ["click", "pointerdown", "pointerup", "touchstart", "touchend", "keydown"]) dialog.addEventListener(type, event => event.stopPropagation());
    function node(parent, tag, className, text) {
        const item = document.createElement(tag); if (className) item.className = className;
        if (text) item.textContent = text; parent.append(item); return item;
    }
    const button = (parent, text, click, className) => { const item = node(parent, "button", className, text); item.type = "button"; item.onclick = click; return item; };
    const option = (select, value, text) => { const item = node(select, "option", "", text); item.value = value; };
    let closed = false;
    function close() {
        if (closed) return; closed = true;
        for (const job of jobs) job.stop(); jobs.clear();
        dialog.remove(); previousFocus?.focus?.();
    }
    dialog.addEventListener("cancel", event => { event.preventDefault(); close(); });
    const shell = node(dialog, "div", "vp-shell"), header = node(shell, "header");
    const heading = node(header, "div"); node(heading, "h2", "", "红楼配音");
    node(heading, "p", "vp-muted", "一字一声 · 听取红楼心事");
    button(header, "×", close, "vp-close").setAttribute("aria-label", "关闭配音面板");
    const body = node(shell, "div", "vp-body"), aside = node(body, "aside"), main = node(body, "main");
    node(aside, "h3", "", "播放设置"); node(aside, "p", "vp-muted", "即时保存，仅对本机生效");
    for (const [key, text] of Object.entries({ enabled: "人物配音", skills: "技能配音", life: "登场与命运", appearance: "原画与背景", subtitles: "对局字幕" })) {
        const label = node(aside, "label", "vp-switch"); node(label, "span", "", text);
        const input = node(label, "input"); input.type = "checkbox"; input.checked = !!prefs[key];
        input.onchange = () => configure(key, input.checked);
    }
    const volumeBox = node(aside, "label", "vp-setting"), volumeHead = node(volumeBox, "span", "vp-setting-head");
    node(volumeHead, "span", "", "配音音量"); const level = node(volumeHead, "output", "", `${Math.round(prefs.volume * 100)}%`);
    const volume = node(volumeBox, "input"); volume.type = "range"; volume.min = "0"; volume.max = "100"; volume.value = String(prefs.volume * 100);
    volume.oninput = () => { level.value = volume.value + "%"; configure("volume", Number(volume.value) / 100); };
    node(volumeBox, "span", "vp-muted", "同时遵循本体音效音量");
    const intervalBox = node(aside, "label", "vp-setting"); node(intervalBox, "span", "vp-setting-head", "外观配音间隔");
    const interval = node(intervalBox, "select"); for (const n of [0, 15, 30, 60, 120]) option(interval, String(n), n ? `${n} 秒` : "每次切换均可播放");
    interval.value = String(prefs.appearanceInterval); interval.onchange = () => configure("appearanceInterval", Number(interval.value));
    node(intervalBox, "span", "vp-muted", "不改变原画自动切换的间隔");
    node(main, "h3", "", "台词音册");
    node(main, "p", "vp-muted", "逐句试听，或选择不同演绎。试听独立于对局配音开关。");
    const filters = node(main, "div", "vp-filters"), character = node(filters, "select"), eventSelect = node(filters, "select");
    character.setAttribute("aria-label", "选择人物"); eventSelect.setAttribute("aria-label", "选择技能或情境");
    for (const [id, spec] of registry) option(character, id, spec.label);
    const search = node(filters, "input", "vp-search"); search.type = "search"; search.placeholder = "搜索台词、编号或情境…"; search.setAttribute("aria-label", "搜索台词");
    const toolbar = node(main, "div", "vp-toolbar"), count = node(toolbar, "span", "vp-muted"), actions = node(toolbar, "div", "vp-actions");
    const list = node(main, "div", "vp-list"), footer = node(main, "footer"), summary = node(footer, "span"), pager = node(footer, "div", "vp-actions");
    let page = 0, matches = [];
    const pageSize = 16;
    const back = button(pager, "上一页", () => { page--; render(); });
    const pageLabel = node(pager, "span");
    const forward = button(pager, "下一页", () => { page++; render(); });
    const time = seconds => Number.isFinite(seconds) ? `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, "0")}` : "0:00";
    function start(entry, file, onState) {
        const handle = preview(character.value, entry.event, entry.id, file, onState);
        if (handle) jobs.add(handle);
        return handle;
    }
    button(actions, "随机试听", () => {
        if (!matches.length) return;
        const entry = matches[Math.floor(Math.random() * matches.length)];
        start(entry, null, update => { summary.textContent = `${entry.id} · ${update.state === "error" ? "音频暂不可用" : update.state === "ended" ? "播放结束" : "随机试听"}`; });
    }, "vp-primary");
    button(actions, "停止试听", () => { for (const job of jobs) job.stop(); jobs.clear(); });
    button(aside, "停止全部配音", stopAll, "vp-setting");
    function render() {
        const spec = registry.get(character.value); list.replaceChildren();
        if (!spec) { node(list, "p", "vp-empty", "暂无人物配音"); return; }
        const query = search.value.trim().toLowerCase();
        matches = Object.entries(spec.clips).map(([id, clip]) => {
            const events = Object.entries(spec.events).filter(([, rule]) => rule.lines.includes(id));
            const event = events.find(([name]) => !eventSelect.value || eventSelect.value === name);
            return { id, clip, event: event?.[0], label: events.map(([, rule]) => rule.label).join(" / "), variants: files(clip) };
        }).filter(entry => entry.event && entry.variants.length && (!query || `${entry.id} ${entry.clip.text} ${entry.label}`.toLowerCase().includes(query)));
        const pages = Math.max(1, Math.ceil(matches.length / pageSize)); page = Math.max(0, Math.min(page, pages - 1));
        count.textContent = `${matches.length} 句台词 · ${matches.reduce((sum, entry) => sum + entry.variants.length, 0)} 个演绎`;
        pageLabel.textContent = `${page + 1} / ${pages}`; back.disabled = page === 0; forward.disabled = page + 1 >= pages;
        summary.textContent = "语音并行播放 · 字幕按序呈现";
        if (!matches.length) node(list, "p", "vp-empty", "未找到匹配台词，试试其他关键词。");
        for (const entry of matches.slice(page * pageSize, (page + 1) * pageSize)) {
            const card = node(list, "article", "vp-card"), meta = node(card, "div", "vp-meta");
            node(meta, "span", "vp-id", entry.id); node(meta, "span", "", entry.label);
            node(card, "p", "vp-line", entry.clip.text);
            const controls = node(card, "div", "vp-controls"), variants = node(controls, "select");
            variants.setAttribute("aria-label", `${entry.id} 演绎版本`); option(variants, "", "随机演绎");
            entry.variants.forEach((file, index) => option(variants, file, `演绎 ${String(index + 1).padStart(2, "0")}`));
            let handle;
            const playButton = button(controls, "▶ 播放", () => {
                handle?.stop();
                handle = start(entry, variants.value || null, update => {
                    const index = entry.variants.indexOf(update.file) + 1;
                    card.dataset.playing = String(update.state === "playing");
                    playButton.textContent = update.state === "playing" ? "↻ 重播" : "▶ 播放";
                    status.textContent = update.state === "error" ? "加载失败，可重试" : update.state === "blocked" ? "点击播放以启用声音" :
                        update.state === "loading" ? "正在加载…" : update.state === "stopped" ? "已停止" :
                        `${update.state === "ended" ? "已播完 · " : ""}演绎 ${index} · ${time(update.time)} / ${time(update.duration)}`;
                    progress.value = update.duration > 0 ? update.time / update.duration : 0;
                });
            }, "vp-primary");
            button(controls, "停止", () => handle?.stop());
            const status = node(controls, "span", "vp-status", `${entry.variants.length} 个演绎可选`);
            const progress = node(card, "progress"); progress.max = 1; progress.value = 0; progress.setAttribute("aria-label", `${entry.id} 播放进度`);
        }
        list.scrollTop = 0;
    }
    function changeCharacter() {
        eventSelect.replaceChildren(); option(eventSelect, "", "全部技能与情境");
        const spec = registry.get(character.value);
        for (const [key, rule] of Object.entries(spec?.events || {})) option(eventSelect, key, rule.label);
        page = 0; render();
    }
    character.onchange = changeCharacter; eventSelect.onchange = search.oninput = () => { page = 0; render(); };
    document.body.append(dialog); changeCharacter();
    if (typeof dialog.showModal === "function") dialog.showModal(); else dialog.setAttribute("open", "");
    return { close };
}
