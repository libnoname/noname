import test from "node:test";
import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import { installDaiyuAppearance } from "../apps/core/extension/红楼幻境/appearance.js";
import { themes } from "../apps/core/extension/红楼幻境/theme/catalog.js";

// Exercise the actual installer, event handlers and settings with a deterministic
// clock/media element; no browser autoplay permission or multi-minute songs needed.
function setup(t, saved = {}, { random = 0.1, reduced = false, unseen = false, playError } = {}) {
    const nodes = [], audios = [], frames = new Map();
    let frameId = 0, now = 0;
    class Element extends EventTarget {
        constructor(tag) { super(); this.tag = tag; this.children = []; this.style = {}; this.dataset = {}; this.classList = { add() {} }; nodes.push(this); }
        get isConnected() { return this.connected || !!this.parent?.isConnected; }
        append(node) { this.children.push(node); node.parent = this; }
        insertBefore(node) { this.children.unshift(node); node.parent = this; }
        remove() { if (this.parent) this.parent.children = this.parent.children.filter(node => node !== this); this.parent = null; }
        setAttribute(name, value) { this[name] = value; }
        removeAttribute(name) { delete this[name]; }
        querySelector() { return this.children.find(node => Object.hasOwn(node.dataset, "musicStatus")); }
        focus() {}
        showModal() { this.open = true; }
        close() { this.open = false; this.dispatchEvent(new Event("close")); }
    }
    class Audio extends Element {
        constructor() { super("audio"); this.paused = true; this.readyState = 4; this.volume = 0.5; this.muted = false; this.loads = 0; audios.push(this); }
        play() {
            if (this !== base && playError) return Promise.reject(Object.assign(new Error(), { name: playError }));
            this.paused = false; this.dispatchEvent(new Event("play")); return Promise.resolve();
        }
        pause() { this.paused = true; }
        load() { this.loads++; }
        finish() { this.paused = true; this.onended?.(); }
    }
    const document = new Element("document"); document.body = new Element("body"); document.body.connected = true;
    document.head = new Element("head"); document.head.connected = true;
    document.createElement = tag => new Element(tag); document.hidden = false;
    const window = new EventTarget(); window.matchMedia = () => ({ matches: reduced });
    const globals = {
        document, window, Audio,
        Image: class { set src(value) { this._src = value; this.onload?.(); } get src() { return this._src; } },
        MutationObserver: class { observe() {} disconnect() {} },
        requestAnimationFrame: fn => { frames.set(++frameId, fn); return frameId; },
        cancelAnimationFrame: id => frames.delete(id),
    };
    const restorers = [];
    for (const [key, value] of Object.entries(globals)) {
        const previous = Object.getOwnPropertyDescriptor(globalThis, key);
        Object.defineProperty(globalThis, key, { configurable: true, writable: true, value });
        restorers.push(() => { if (previous) Object.defineProperty(globalThis, key, previous); else delete globalThis[key]; });
    }
    t.mock.method(Date, "now", () => now); t.mock.method(Math, "random", () => random);
    t.mock.method(globalThis, "setInterval", () => 1); t.mock.method(globalThis, "clearInterval", () => {});
    t.mock.method(globalThis, "setTimeout", () => 1); t.mock.method(globalThis, "clearTimeout", () => {});
    const base = new Audio(); base.paused = false;
    const avatar = new Element("avatar"); document.body.append(avatar);
    const player = { name: "hlhj_daiyu", node: { avatar }, isConnected: true, active: true, unseen,
        isIn() { return this.active; }, isUnseen() { return this.unseen; }, countMark: () => 0 };
    const lib = { assetURL: "/", config: { hlhj_appearance: saved, background_music: "music_default" }, skill: {}, arenaReady: [], onover: [] };
    const game = { players: [player], me: player, saveConfig(key, value) { lib.config[key] = value; } };
    const ui = { window: document.body, system2: {}, backgroundMusic: base, create: { system() { const node = new Element("button"); document.body.append(node); return node; } } };
    const api = installDaiyuAppearance(lib, game, ui, {}, {}, { theme: "theme/", original: "original.svg" });
    function flush() { for (let i = 0; frames.size && i < 10; i++) { const batch = [...frames]; frames.clear(); batch.forEach(([, fn]) => fn()); } }
    flush(); api.open();
    const select = key => nodes.findLast(node => node.tag === "select" && node.name === key && node.isConnected);
    const click = label => nodes.findLast(node => node.tag === "button" && node.textContent === label && node.isConnected).onclick();
    const change = (key, value) => { const node = select(key); node.value = value; node.onchange(); flush(); };
    t.after(() => { api.dispose(); restorers.forEach(restore => restore()); });
    return { api, lib, base, player, document, nodes, audios, click, change, select,
        refresh() { api.refresh(); flush(); },
        tick(ms) { now += ms; api.refresh(); flush(); },
        unblock() { playError = null; },
        get audio() { return audios.at(-1); },
        get scene() { return document.body.children.find(node => node.className === "background hlhj-backdrop")?.dataset.theme; },
        get portrait() { return nodes.findLast(node => node.className === "hlhj-theme-preview" && node.isConnected)?.dataset.form; },
    };
}
const settle = async () => { await Promise.resolve(); await Promise.resolve(); await Promise.resolve(); };

test("随机开局两套背景均可选中，首次默认原画独立轮换", t => {
    const h = setup(t, {}, { random: 0.9 });
    assert.equal(h.scene, "dream"); assert.match(h.audio.src, /绛珠归梦1\.mp3$/);
    assert.equal(h.select("portrait").value, "cycle"); assert.equal(h.select("background").value, "cycle");
});
test("曲终换景并保留两份歌单进度，全部五首最终循环", async t => {
    const h = setup(t); const audio = h.audio;
    const paths = [];
    for (let i = 0; i < 7; i++) { paths.push(h.audio.src); await settle(); h.audio.finish(); }
    assert.deepEqual(paths.map(path => path.split("/").pop()), ["竹窗听雨1.mp3", "绛珠归梦1.mp3", "竹窗听雨2.mp3", "绛珠归梦2.mp3", "竹窗听雨1.mp3", "绛珠归梦3.m4a", "竹窗听雨2.mp3"]);
    assert.equal(h.audio, audio); assert.equal(audio.loop, false); assert.equal(h.portrait, "bamboo");
});
test("保持背景时歌单顺序循环，原画定时变化不重载音乐", async t => {
    const h = setup(t); h.change("background", "hold"); const loads = h.audio.loads;
    h.tick(12000); assert.equal(h.portrait, "dream"); assert.equal(h.scene, "bamboo"); assert.equal(h.audio.loads, loads);
    await settle(); h.audio.finish(); assert.equal(h.scene, "bamboo"); assert.match(h.audio.src, /竹窗听雨2\.mp3$/);
    await settle(); h.audio.finish(); assert.match(h.audio.src, /竹窗听雨1\.mp3$/);
});
test("背景固定和手动换景不改变原画模式或计时，下一首只换曲", t => {
    const h = setup(t); h.tick(6000); h.click("固定归梦背景");
    assert.equal(h.select("portrait").value, "cycle"); assert.equal(h.scene, "dream");
    h.tick(6000); assert.equal(h.portrait, "dream");
    h.click("下一首"); assert.equal(h.scene, "dream"); assert.match(h.audio.src, /绛珠归梦2\.mp3$/);
    h.click("切换背景"); assert.equal(h.scene, "bamboo"); assert.equal(h.select("background").value, "hold");
    assert.equal(h.portrait, "dream");
});
test("开局设置下局生效，固定背景优先；轮换间隔和固定原画可配置", t => {
    const h = setup(t, { startup: "dream", background: "bamboo" });
    assert.equal(h.scene, "bamboo"); h.change("background", "cycle"); h.change("startup", "dream");
    assert.equal(h.scene, "bamboo"); h.change("portraitInterval", "30"); h.tick(29000);
    assert.equal(h.portrait, "bamboo"); h.tick(1000); assert.equal(h.portrait, "dream");
    h.change("portrait", "original"); h.tick(60000); assert.equal(h.portrait, "original");
});
test("随机歌单每轮包含全部曲目，轮间不连续重复", async t => {
    const h = setup(t, { background: "dream", order: "shuffle" }); const tracks = [];
    for (let i = 0; i < 12; i++) { tracks.push(h.audio.src); await settle(); h.audio.finish(); }
    for (let i = 0; i < 12; i += 3) assert.equal(new Set(tracks.slice(i, i + 3)).size, 3);
    for (let i = 1; i < 12; i++) assert.notEqual(tracks[i], tracks[i - 1]);
});
test("坏曲自动跳过，不换背景；整张歌单失败恢复原音乐且不无限重试", async t => {
    const h = setup(t); await settle(); assert.equal(h.base.paused, true);
    h.audio.onerror(); assert.match(h.audio.src, /竹窗听雨2\.mp3$/); assert.equal(h.scene, "bamboo");
    h.audio.onerror(); await settle(); assert.equal(h.base.paused, false);
    const count = h.audios.length; h.refresh(); assert.equal(h.audios.length, count);
    h.click("播放音乐"); await settle(); assert.equal(h.base.paused, true); assert.equal(h.audios.length, count + 1);
});
test("过期曲终/错误回调不能覆盖用户刚切换的背景或音乐", async t => {
    const h = setup(t); const onended = h.audio.onended, onerror = h.audio.onerror;
    h.click("固定归梦背景"); const src = h.audio.src;
    onended(); onerror(); await settle(); assert.equal(h.scene, "dream"); assert.equal(h.audio.src, src);
});
test("浏览器阻止播放保留原音乐，用户点击可恢复", async t => {
    const h = setup(t, {}, { playError: "NotAllowedError" }); await settle();
    assert.equal(h.base.paused, false); assert.equal(h.audio.paused, true);
    h.unblock(); h.click("播放音乐"); await settle(); assert.equal(h.audio.paused, false); assert.equal(h.base.paused, true);
});
test("静音/原音乐/本体关闭音乐均无曲终换景；音量跟随本体", async t => {
    const h = setup(t); await settle(); assert.equal(h.audio.volume, 0.3);
    h.base.volume = 0.2; h.base.muted = true; h.refresh(); assert.equal(h.audio.volume, 0.12); assert.equal(h.audio.muted, true);
    h.change("music", "off"); assert.equal(h.audio.paused, true); assert.equal(h.base.paused, true); assert.equal(h.audio.onended, null);
    h.change("music", "system"); await settle(); assert.equal(h.base.paused, false); assert.equal(h.scene, "bamboo");
    h.lib.config.background_music = "music_off"; h.change("music", "follow"); assert.equal(h.audio.paused, true);
});
test("页面隐藏暂停且保留曲目进度，返回恢复", async t => {
    const h = setup(t); await settle(); const src = h.audio.src, loads = h.audio.loads;
    h.document.hidden = true; h.document.dispatchEvent(new Event("visibilitychange")); assert.equal(h.audio.paused, true);
    h.refresh(); assert.equal(h.audio.paused, true);
    h.document.hidden = false; h.document.dispatchEvent(new Event("visibilitychange")); await settle();
    assert.equal(h.audio.paused, false); assert.equal(h.audio.src, src); assert.equal(h.audio.loads, loads);
});
test("暗将不泄露外观，离场和结束恢复并清理", async t => {
    const h = setup(t, {}, { unseen: true }); assert.equal(h.scene, undefined); assert.equal(h.audios.length, 1);
    h.player.unseen = false; h.refresh(); await settle(); assert.equal(h.scene, "bamboo");
    h.player.active = false; h.refresh(); await settle(); assert.equal(h.scene, undefined); assert.equal(h.base.paused, false);
    h.player.active = true; h.refresh(); await settle(); h.api.dispose(); await settle();
    assert.equal(h.scene, undefined); assert.equal(h.base.paused, false); assert.equal(h.document.head.children.length, 0);
    assert.equal(h.audio.onended, null); assert.equal(h.audio.onerror, null);
});
test("旧原画联动迁移为背景联动，显式原画选项保留", t => {
    const h = setup(t, { portrait: "dream", background: "follow", music: "follow" });
    assert.equal(h.select("background").value, "cycle"); assert.equal(h.scene, "bamboo"); assert.equal(h.portrait, "dream");
    h.change("background", "hold"); assert.equal(h.lib.config.hlhj_appearance.version, 2);
});
test("减少动态效果停用原画定时切换，音乐曲终行为仍独立", async t => {
    const h = setup(t, {}, { reduced: true }); h.tick(12000); assert.equal(h.portrait, "bamboo");
    await settle(); h.audio.finish(); assert.equal(h.scene, "dream"); assert.equal(h.portrait, "bamboo");
});
test("资源清单覆盖两个目录的所有 MP3/M4A，扩展与本体镜像一致", async () => {
    const root = new URL("../apps/core/extension/红楼幻境/theme/", import.meta.url);
    const mirror = new URL("../apps/core/image/hlhj/theme/", import.meta.url);
    for (const theme of Object.values(themes)) {
        const files = (await readdir(new URL(theme.album + "/", root))).filter(file => /\.(mp3|m4a)$/i.test(file));
        assert.deepEqual(theme.tracks.map(file => file.split("/").pop()).sort(), files.sort());
        for (const file of [theme.image, ...theme.tracks]) assert.deepEqual(await readFile(new URL(file, root)), await readFile(new URL(file, mirror)));
    }
    assert.deepEqual(await readFile(new URL("appearance.css", root)), await readFile(new URL("appearance.css", mirror)));
    assert.deepEqual(await readFile(new URL("catalog.js", root)), await readFile(new URL("catalog.js", mirror)));
});
