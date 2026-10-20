import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createRequire } from 'node:module';
import { OwnedMarkStore } from '../../apps/core/noname/library/element/ownedMarkStore.js';

// Execute the real skill definitions; only DOM, choices and card movement use a facade.
const require = createRequire(import.meta.url);
const ts = require('typescript');
const core = new URL('../../apps/core/', import.meta.url);
function definitions(file, names, env) {
  const text = fs.readFileSync(new URL(file, core), 'utf8');
  const ast = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true, ts.ScriptKind.JS);
  const found = new Map();
  function visit(node) {
    if (ts.isPropertyAssignment(node) && names.includes(node.name.getText(ast))) found.set(node.name.getText(ast), node.getText(ast));
    ts.forEachChild(node, visit);
  }
  visit(ast);
  assert.equal(found.size, names.length);
  return Function(...Object.keys(env), `return ({${names.map(name => found.get(name)).join(',')}});`)(...Object.values(env));
}
function world() {
  const players = [], lib = { skill: {}, character: { victim: ['male', 'wei', 4, ['f', 'g']] }, translate: {f_info:'f',g_info:'g'} };
  const status = {};
  const game = {
    players, dead: [], phaseNumber: 0,
    getOwnedMarkStore: () => store,
    getOwnedMarkIdentity: p => typeof p === 'string' ? p : p.id,
    resolveOwnedMarkPlayer: id => players.find(p => p.id === id),
    hasPlayer: fn => players.some(p => p.isIn() && fn(p)),
    countPlayer: fn => players.filter(p => p.isIn() && fn(p)).length,
    expandSkills(ids) { const out=[...ids];for(let i=0;i<out.length;i++)for(const s of [].concat(lib.skill[out[i]]?.group||[]))if(!out.includes(s))out.push(s);return out; },
    log() {},
  };
  let previous=[];
  const store = new OwnedMarkStore({sessionId:'skill-test', onChange(snapshot) {
    for(const bucket of snapshot.buckets) {
      const bearer=game.resolveOwnedMarkPlayer(bucket.bearer);
      if(bearer) bearer.storage[bucket.name]=bucket.anonymous+bucket.effects.reduce((n,e)=>n+e.count,0);
    }
    const current=store.list();
    for(const old of previous) if(!current.some(e=>e.id===old.id))lib.skill[old.sourceSkill]?.onOwnedMarkChange?.(null,old,{restoring:false});
    for(const record of current) {
      const old=previous.find(e=>e.id===record.id);
      if(JSON.stringify(old)!==JSON.stringify(record)) lib.skill[record.sourceSkill]?.onOwnedMarkChange?.(record,old||null,{restoring:false});
    }
    previous=current;
  }});
  const get={info:id=>lib.skill[id]||{},attitude:()=>-1,translation:x=>x,prompt:x=>x};
  const env={lib,game,get,_status:status,ui:{},ai:{}};
  Object.assign(lib.skill,definitions('character/extra/skill.js',['drlt_jieying','drlt_duorui','duorui_clear','drlt_duorui1'],env));
  Object.assign(lib.skill,definitions('mode/guozhan/src/skill/character/wushuang.js',['gz_gn_jieying'],env));
  lib.skill.f={};lib.skill.g={};
  function player(id,skills=[]) {
    const p={id,name:'victim',name1:null,name2:null,storage:{},marks:{},skills:[...skills],tempSkills:{},additionalSkills:{},disabledSkills:{},initedSkills:[],hand:[],alive:true,choice:'f',calls:[],
      isIn(){return this.alive;},hasSkill(s){return !this.disabledSkills[s]?.length&&this.getSkills().includes(s);},
      getSkills(){return [...new Set([...this.skills,...Object.values(this.additionalSkills).flat(),...Object.keys(this.tempSkills)])];},
      countMark(name){return Number(this.storage[name])||0;},hasMark(name){return this.countMark(name)>0;},
      addMark(name,n=1){this.storage[name]=(this.storage[name]||0)+n;},removeMark(name,n=1){this.storage[name]=Math.max(0,this.countMark(name)-n);},clearMark(name){this.storage[name]=0;},
      getOwnedMarks(name,owner){return store.list({bearer:this.id,name,owner:owner===undefined?undefined:game.getOwnedMarkIdentity(owner)});},
      countOwnedMark(name,owner){return this.getOwnedMarks(name,owner).reduce((n,e)=>n+e.count,0);},hasOwnedMark(name,owner){return this.countOwnedMark(name,owner)>0;},
      getMarkOwners(name){return [...new Set(this.getOwnedMarks(name).map(e=>e.owner))];},
      addOwnedMark(name,owner,count=1,options={}){return store.grant({...options,name,bearer:this.id,owner:game.getOwnedMarkIdentity(owner),creator:options.creator?game.getOwnedMarkIdentity(options.creator):game.getOwnedMarkIdentity(owner),count});},
      removeOwnedMark(name,owner,count=Infinity,options={}){return store.remove({bearer:this.id,name,owner:game.getOwnedMarkIdentity(owner),...options},count);},
      consumeOwnedMark(name,owner,effectId,revision){return this.removeOwnedMark(name,owner,Infinity,{effectId,revision})[0];},
      transferOwnedMark(name,target,owner,count=Infinity,options={}){return store.transfer({bearer:this.id,name,owner:game.getOwnedMarkIdentity(owner),...options},target.id,count);},
      clearOwnedMarks(name,owner){return store.clear({bearer:this.id,name,owner:owner===undefined?undefined:game.getOwnedMarkIdentity(owner)});},
      hasEnabledSlot(){return false;},
      chooseButton(){return {set(){return this;},forResult:async()=>({bool:true,links:[p.choice]})};},
      countCards(){return this.hand.length;},getCards(){return [...this.hand];},getGainableCards(){return [...this.hand];},
      give(cards,target){this.onGive?.();this.hand=this.hand.filter(x=>!cards.includes(x));target.hand.push(...cards);return Promise.resolve();},
      disableSkill(reason,ids){this.calls.push('disable');for(const id of game.expandSkills([].concat(ids)))this.disabledSkills[id]=[...new Set([...(this.disabledSkills[id]||[]),reason])];},
      enableSkill(reason){for(const [id,reasons] of Object.entries(this.disabledSkills)){this.disabledSkills[id]=reasons.filter(x=>x!==reason);if(!this.disabledSkills[id].length)delete this.disabledSkills[id];}},
      addAdditionalSkill(key,ids){this.calls.push('additional-add');this.additionalSkills[key]=[...new Set([].concat(ids))];},
      removeAdditionalSkill(key){this.calls.push('additional-remove');const removed=this.additionalSkills[key]||[];delete this.additionalSkills[key];for(const skill of removed)if(!this.getSkills().includes(skill))lib.skill[skill]?.onremove?.(this,skill);},
      addSkillTrigger(){this.calls.push('hook-add');},removeSkillTrigger(){this.calls.push('hook-remove');},
      addTempSkills(ids){this.skills.push(...[].concat(ids));return Promise.resolve();},
      addTempSkill(id){if(!this.tempSkills[id])lib.skill[id]?.init?.(this,id);this.tempSkills[id]=true;},
      removeSkills(id){this.skills=this.skills.filter(x=>x!==id);},
    };
    players.push(p);return p;
  }
  return {game,lib,store,status,player};
}
const CAMP='drlt_jieying_mark', GZ='gz_gn_jieying_mark', DUORUI='drlt_duorui_effect';
function camp(p,owner,name=CAMP,count=1){return p.addOwnedMark(name,owner,count,{sourceSkill:name===CAMP?'drlt_jieying':'gz_gn_jieying',lifecycle:{ownerDeath:'remove',bearerDeath:'remove',skillRemoval:'remove',reset:'remove'}});}

test('ordinary camps generate independently and only once per owner globally',async()=>{
  const w=world(),a=w.player('A',['drlt_jieying']),b=w.player('B',['drlt_jieying']),c=w.player('C'),s=w.lib.skill.drlt_jieying.subSkill[1];
  camp(c,a);
  assert.equal(s.filter({},a),false);assert.equal(s.filter({},b),true);
  await s.content({}, {}, b);
  assert.equal(b.countOwnedMark(CAMP,b),1);assert.equal(s.filter({},b),false);
});
test('ordinary transfer moves only the giver own camp even onto another owner camp',async()=>{
  const w=world(),a=w.player('A',['drlt_jieying']),b=w.player('B',['drlt_jieying']),c=w.player('C');
  const first=camp(a,a);camp(a,b);camp(c,b);
  await w.lib.skill.drlt_jieying.subSkill[2].content({targets:[c]}, {}, a);
  assert.equal(a.countOwnedMark(CAMP,a),0);assert.equal(a.countOwnedMark(CAMP,b),1);assert.equal(c.getOwnedMarks(CAMP,a)[0].id,first.id);assert.equal(c.countOwnedMark(CAMP,b),1);
});
test('ordinary recovery consumes only its owner before give; another owner still qualifies',async()=>{
  const w=world(),a=w.player('A',['drlt_jieying']),b=w.player('B',['drlt_jieying']),c=w.player('C'),s=w.lib.skill.drlt_jieying.subSkill[3];
  camp(c,a);camp(c,b);c.hand=['card'];c.onGive=()=>assert.equal(c.hasOwnedMark(CAMP,a),false);
  assert.equal(s.filter({player:c},a),true);await s.content({}, {player:c},a);
  assert.deepEqual(a.hand,['card']);assert.equal(c.hasOwnedMark(CAMP,b),true);assert.equal(s.filter({player:c},b),true);
  await s.content({}, {player:c},b);assert.deepEqual(b.hand,[]);assert.equal(c.hasOwnedMark(CAMP,b),false);
});
test('foreign and self-held camps cannot be collected by an unrelated owner',()=>{
  const w=world(),a=w.player('A',['drlt_jieying']),b=w.player('B',['drlt_jieying']);camp(b,b);
  assert.equal(w.lib.skill.drlt_jieying.subSkill[3].filter({player:b},a),false);
  assert.equal(w.lib.skill.drlt_jieying.subSkill[3].filter({player:b},b),false);
});
test('ordinary buffs count actual effective owner identities, not all holders or quantities',async()=>{
  const w=world(),a=w.player('A',['drlt_jieying']),b=w.player('B',['drlt_jieying']),d=w.player('D',['drlt_jieying']),c=w.player('C'),s=w.lib.skill.drlt_jieying;
  camp(c,a, CAMP,4);camp(c,a);camp(c,b);b.disabledSkills.drlt_jieying=['blocked'];
  assert.equal(s.filter({player:c,numFixed:false},a),true);assert.equal(s.filter({player:c},d),false);assert.equal(s.filter({player:c,numFixed:true},a),false);
  assert.equal(s.subSkill.mark.mod.cardUsable({name:'sha'},c,1),2);assert.equal(s.subSkill.mark.mod.maxHandcard(c,4),5);
  const draw={player:c,num:2};await s.content({},draw,a);assert.equal(draw.num,3);
});
test('ordinary skill removal clears only that owner camps',()=>{
  const w=world(),a=w.player('A',['drlt_jieying']),b=w.player('B',['drlt_jieying']),c=w.player('C');camp(c,a);camp(c,b);
  assert.equal(typeof w.lib.skill.drlt_jieying.onremove,'function');w.lib.skill.drlt_jieying.onremove(a);assert.equal(c.hasOwnedMark(CAMP,a),false);assert.equal(c.hasOwnedMark(CAMP,b),true);
});
test('national camps generate independently and preserve ownership across movement',async()=>{
  const w=world(),a=w.player('A',['gz_gn_jieying']),b=w.player('B',['gz_gn_jieying']),c=w.player('C'),s=w.lib.skill.gz_gn_jieying;
  camp(c,a,GZ);assert.equal(s.filter({},a,'phaseBegin'),false);assert.equal(s.filter({},b,'phaseBegin'),true);await s.content({}, {}, b);
  camp(b,a,GZ);await s.subSkill.effect.content({triggername:'phaseEnd',targets:[c]}, {player:b}, b);
  assert.equal(b.hasOwnedMark(GZ,a),true);assert.equal(b.hasOwnedMark(GZ,b),false);assert.equal(c.hasOwnedMark(GZ,b),true);
});
test('national recovery returns only own camp before awaiting card movement',async()=>{
  const w=world(),a=w.player('A',['gz_gn_jieying']),b=w.player('B',['gz_gn_jieying']),c=w.player('C'),s=w.lib.skill.gz_gn_jieying.subSkill.effect;
  const original=camp(c,a,GZ);camp(c,b,GZ);c.hand=['card'];c.onGive=()=>{assert.equal(c.hasOwnedMark(GZ,a),false);assert.equal(a.hasOwnedMark(GZ,a),true);};
  await s.content({triggername:'phaseAfter',targets:[c]}, {player:c}, a);
  assert.deepEqual(a.hand,['card']);assert.equal(c.hasOwnedMark(GZ,b),true);assert.equal(a.getOwnedMarks(GZ,a)[0].id,original.id);
});
test('national shared draw and mods count actual owners once and exclude ineffective owners',async()=>{
  const w=world(),a=w.player('A',['gz_gn_jieying']),b=w.player('B',['gz_gn_jieying']),d=w.player('D',['gz_gn_jieying']),c=w.player('C'),s=w.lib.skill.gz_gn_jieying.subSkill.mark;
  camp(c,a,GZ,5);camp(c,a,GZ);camp(c,b,GZ);b.disabledSkills.gz_gn_jieying=['blocked'];
  const draw={player:c,num:2};await s.content({},draw,c);assert.equal(draw.num,3);assert.equal(s.mod.cardUsable({name:'sha'},c,1),2);assert.equal(s.mod.maxHandcard(c,4),5);
});
test('duorui second source immediately disables its own selected skill',async()=>{
  const w=world(),a=w.player('A',['drlt_duorui']),c=w.player('C',['drlt_duorui']),b=w.player('B',['f','g']);
  a.choice='f';c.choice='g';await w.lib.skill.drlt_duorui.content({}, {player:b}, a);await w.lib.skill.drlt_duorui.content({}, {player:b}, c);
  const rows=b.getOwnedMarks(DUORUI);assert.equal(rows.length,2);assert.notEqual(rows[0].id,rows[1].id);
  assert.equal(b.hasSkill('f'),false);assert.equal(b.hasSkill('g'),false);assert.equal(a.hasSkill('f'),true);assert.equal(c.hasSkill('g'),true);
  assert.deepEqual(rows.map(r=>r.params.skills),[['f'],['g']]);assert.equal(Array.isArray(b.storage.drlt_duorui),false);
});
test('duorui owner removal restores only its effect and retains other gain providers',async()=>{
  const w=world(),a=w.player('A',['drlt_duorui']),c=w.player('C',['drlt_duorui']),b=w.player('B',['f','g']);
  a.choice='f';c.choice='g';await w.lib.skill.drlt_duorui.content({}, {player:b}, a);await w.lib.skill.drlt_duorui.content({}, {player:b}, c);a.addAdditionalSkill('other-provider',['f']);
  assert.equal(typeof w.lib.skill.drlt_duorui.onremove,'function');w.lib.skill.drlt_duorui.onremove(a);
  assert.equal(b.hasSkill('f'),true);assert.equal(b.hasSkill('g'),false);assert.equal(a.hasSkill('f'),true);assert.equal(b.getOwnedMarks(DUORUI,c).length,1);
});
test('duorui victim turn expiration restores all independent reasons and grants',async()=>{
  const w=world(),a=w.player('A',['drlt_duorui']),c=w.player('C',['drlt_duorui']),b=w.player('B',['f','g']);a.choice='f';c.choice='g';
  await w.lib.skill.drlt_duorui.content({}, {player:b}, a);await w.lib.skill.drlt_duorui.content({}, {player:b}, c);
  assert.ok(w.lib.skill.duorui_clear.filter({player:b},a));await w.lib.skill.duorui_clear.content({}, {player:b},a);
  assert.equal(b.hasSkill('f'),true);assert.equal(b.hasSkill('g'),false);await w.lib.skill.duorui_clear.content({}, {player:b},c);
  assert.equal(b.hasSkill('g'),true);assert.equal(a.hasSkill('f'),false);assert.equal(c.hasSkill('g'),false);
});
test('duorui lifecycle deletion releases the exact disable/gain relationship',async()=>{
  const w=world(),a=w.player('A',['drlt_duorui']),b=w.player('B',['f']);await w.lib.skill.drlt_duorui.content({}, {player:b},a);
  w.store.lifecycle('A','death');assert.equal(b.hasSkill('f'),true);assert.equal(a.hasSkill('f'),false);assert.equal(b.getOwnedMarks(DUORUI).length,0);
});
test('duorui restore hook reconstructs relations without gameplay APIs or broadcasts',()=>{
  const w=world(),a=w.player('A',['drlt_duorui']),b=w.player('B',['f']);
  const effect={id:'saved-effect',name:DUORUI,owner:'A',bearer:'B',params:{skills:['f']},sourceSkill:'drlt_duorui'};
  assert.equal(typeof w.lib.skill.drlt_duorui.onOwnedMarkChange,'function');w.lib.skill.drlt_duorui.onOwnedMarkChange(effect,null,{restoring:true});
  assert.equal(b.hasSkill('f'),false);assert.equal(a.hasSkill('f'),true);assert.equal(a.calls.includes('additional-add'),false);assert.equal(b.calls.includes('disable'),false);
  w.lib.skill.drlt_duorui.onOwnedMarkChange(null,effect,{restoring:true});assert.equal(b.hasSkill('f'),true);assert.equal(a.hasSkill('f'),false);assert.equal(a.calls.includes('additional-remove'),false);
});
test('duorui parameter update retains its live helper and updates the selected reason',async()=>{
  const w=world(),a=w.player('A',['drlt_duorui']),b=w.player('B',['f','g']);await w.lib.skill.drlt_duorui.content({}, {player:b},a);
  const effect=b.getOwnedMarks(DUORUI)[0];w.store.update({effectId:effect.id},{params:{skills:['g']}});
  assert.equal(b.getOwnedMarks(DUORUI).length,1);assert.equal(b.hasSkill('f'),true);assert.equal(b.hasSkill('g'),false);assert.equal(a.hasSkill('f'),false);assert.equal(a.hasSkill('g'),true);
});
test('duorui overlapping reasons for one skill survive removal of the other owner',async()=>{
  const w=world(),a=w.player('A',['drlt_duorui']),c=w.player('C',['drlt_duorui']),b=w.player('B',['f']);
  await w.lib.skill.drlt_duorui.content({}, {player:b},a);await w.lib.skill.drlt_duorui.content({}, {player:b},c);w.lib.skill.drlt_duorui.onremove(a);
  assert.equal(b.hasSkill('f'),false);assert.equal(c.hasSkill('f'),true);w.lib.skill.drlt_duorui.onremove(c);assert.equal(b.hasSkill('f'),true);
});
