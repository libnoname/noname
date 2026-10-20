import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { fixture } from '../owned-marks/player-fixture.mjs';
import { appendOwnedMarkIntro } from '../../apps/core/noname/get/ownedMarkIntro.js';

// Exercise the real central hover method; only the DOM/dialog boundary is a
// small in-memory surface. The browser suite covers native DOM integration.
class Element {
 constructor(tag = 'div') { this.tagName = tag; this.children = []; this.style = {}; this.dataset = {}; this.className = ''; this._text = ''; this.classList = { contains: name => this.className.split(' ').includes(name), add: name => { this.className += ' ' + name; } }; }
 appendChild(child) { this.children.push(child); return child; }
 set textContent(value) { this._text = String(value); this.children = []; }
 get textContent() { return this._text + this.children.map(child => typeof child === 'string' ? child : child.textContent).join(''); }
}
async function hoverFixture() {
 const world = fixture();
 const { game, player } = world;
	game._ownedMarkStore = world.ledger;
 const bearer = player('target'); bearer.dataset = { position: '2' }; bearer.classList = { contains: name => name === 'player' };
 const node = { classList: { contains: name => name === 'mark' }, parentNode: { parentNode: bearer }, skill: 'camp', info: { name: '营', content: '原有说明' } };
 const dialog = { entries: [], setAttribute() {}, add(value) { this.entries.push(value); return { style: {} }; }, hide() { this.hidden = true; }, show() { this.hidden = false; } };
 const get = { translation(value) { return ({ same_general: '同名武将', camp: '营', target: '目标' })[value?.name || value] || value?.name || value; }, storageintro(content, storage) { return `${content}；数量：${storage}`; } };
 const document = { createElement: tag => new Element(tag) };
 const context = vm.createContext({ get, game, lib: { config: {} }, ui: { create: { div() { return new Element(); } } }, _status: {}, document, Promise, appendOwnedMarkIntro });
 const source = fs.readFileSync(new URL('../../apps/core/noname/get/index.js', import.meta.url), 'utf8');
 const method = source.slice(source.indexOf('\tnodeintro('), source.indexOf('\tlinkintro('));
 const nodeintro = vm.runInContext(`({${method}}).nodeintro`, context);
 get.nodeintro = nodeintro;
 const text = () => dialog.entries.map(entry => typeof entry === 'string' ? entry : entry.textContent).join('\n');
 const sections = () => dialog.entries.filter(entry => entry.className?.split(' ').includes('owned-mark-sources'));
 return { ...world, bearer, node, dialog, get, text, sections, hover: () => nodeintro(node, false, undefined, dialog) };
}

test('normal mark hover appends known sources and preserves original content and quantity', async () => {
 const f = await hoverFixture(); const owner = f.player(); owner.seatNum = 1;
 f.bearer.addOwnedMark('camp', owner, 2); f.hover();
 assert.match(f.text(), /原有说明；数量：2/);
 assert.equal(f.sections().length, 1, 'central hover should append the source section');
 assert.match(f.sections()[0].textContent, /同名武将.*1号位.*2/);
 assert.doesNotMatch(f.sections()[0].textContent, /match:player/);
});

test('same-name owners remain separate and mixed anonymous quantities stay explicit', async () => {
 const f = await hoverFixture(); const a = f.player(), b = f.player(); a.seatNum = 1; b.seatNum = 2;
 f.bearer.addMark('camp', 3, false); f.bearer.addOwnedMark('camp', a, 2); f.bearer.addOwnedMark('camp', b, 1); f.hover();
 assert.equal(f.sections().length, 1);
 assert.match(f.text(), /同名武将.*1号位.*2/); assert.match(f.text(), /同名武将.*2号位.*1/);
 assert.match(f.text(), /来源未知.*3/); assert.match(f.text(), /数量：6/);
});

test('untracked numeric and collection marks never invent an owner or initialize a ledger', async () => {
 for (const value of [4, ['card-a', 'card-b']]) {
  const f = await hoverFixture(); f.bearer.storage.camp = value; f.hover();
  assert.equal(f.sections().length, 1); assert.match(f.text(), new RegExp(`来源未知.*${Array.isArray(value) ? 2 : 4}`));
  assert.equal(f.bearer._ownedMarkIdentity, undefined);
 }
});

test('declared shared resource and private semantics are visible without guessed ownership', async () => {
 for (const [semantics, label] of [['shared', '公共标记（共享）'], ['resource', '自身资源'], ['private', '私有标记']]) {
  const f = await hoverFixture(); f.game.getOwnedMarkPolicy = () => ({ semantics }); f.bearer.storage.camp = 3; f.hover();
  assert.equal(f.sections().length, 1); assert.ok(f.text().includes(label)); assert.doesNotMatch(f.text(), /目标.*号位/);
 }
});

test('custom mark callback keeps its original node reference and appends provenance afterwards', async () => {
 const f = await hoverFixture(); const custom = new Element(); custom.textContent = '卡牌列表和自定义状态';
 f.node.info.mark = dialog => { dialog.add(custom); return '原有规则'; }; f.bearer.storage.camp = 1; f.hover();
 assert.ok(f.dialog.entries.includes(custom)); assert.match(f.text(), /原有规则/); assert.equal(f.sections().length, 1);
 assert.ok(f.dialog.entries.indexOf(custom) < f.dialog.entries.indexOf(f.sections()[0]));
});

test('mark-specific custom intro still receives the appended section and can suppress its dialog', async () => {
 const f = await hoverFixture(); f.bearer.storage.camp = 1;
 f.node._customintro = dialog => { dialog.add('覆盖原说明的自定义介绍'); }; f.hover();
 assert.match(f.text(), /覆盖原说明的自定义介绍/); assert.equal(f.sections().length, 1);
 f.dialog.entries = []; f.node._customintro = () => false;
 assert.equal(f.hover(), undefined); assert.equal(f.sections().length, 0);
});

test('owner rows keep identity internal and render character labels as literal text with fallback seats', async () => {
 const f = await hoverFixture(); const a = f.player('<img src=x onerror=alert(1)>'); a.dataset = { position: '4' };
 f.bearer.addOwnedMark('camp', a, 1); f.bearer.addOwnedMark('camp', a, 2); f.hover();
 const row = f.sections()[0].children[1];
 assert.equal(row.textContent, '<img src=x onerror=alert(1)>（5号位）：3');
 assert.equal(row.children.length, 0); assert.equal(row.dataset.ownedMarkOwner, a._ownedMarkIdentity);
 assert.doesNotMatch(f.sections()[0].textContent, /match:player/);
});

test('async custom mark callback finishes before provenance is appended', async () => {
 const f = await hoverFixture(); let finish;
 f.node.info.mark = dialog => new Promise(resolve => { finish = () => { dialog.add('异步原内容'); resolve(); }; });
 f.bearer.storage.camp = 2; f.hover(); assert.equal(f.dialog.hidden, true); assert.equal(f.sections().length, 0);
 finish(); await Promise.resolve(); assert.equal(f.dialog.hidden, false); assert.equal(f.sections().length, 1);
 assert.ok(f.dialog.entries.indexOf('异步原内容') < f.dialog.entries.indexOf(f.sections()[0]));
});

test('restored ledger resolves source labels identically and unresolved owners stay unknown', async () => {
 const f = await hoverFixture(); const a = f.player(); a.seatNum = 4;
 f.bearer.addOwnedMark('camp', a, 2); const saved = f.ledger.snapshot(); f.hover(); const before = f.sections()[0]?.textContent;
 f.ledger.restore(saved, { force: true }); f.dialog.entries = []; f.hover(); assert.equal(f.sections().length, 1); assert.equal(f.sections()[0].textContent, before);
 f.game.resolveOwnedMarkPlayer = () => undefined; f.dialog.entries = []; f.hover(); assert.match(f.text(), /来源未知.*2/); assert.doesNotMatch(f.text(), /match:player/);
});
test('hover inside a private skill scope still gives custom intros the total count',async()=>{
 const f=await hoverFixture(),a=f.player(),b=f.player();f.game.registerOwnedMarkPolicy('camp',{semantics:'multi',skills:['apply']});
 f.bearer.addOwnedMark('camp',a,2);f.bearer.addOwnedMark('camp',b,3);
 f.node.info.mark=(dialog,storage,player)=>'动态合计：'+player.countMark('camp');
 f.game.withMarkExecution(a,'apply',()=>f.hover());assert.match(f.text(),/动态合计：5/);assert.doesNotMatch(f.text(),/动态合计：2/);
});
