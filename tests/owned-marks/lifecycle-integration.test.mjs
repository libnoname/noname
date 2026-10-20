import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {fixture} from './player-fixture.mjs';
import {OwnedMarkStore} from '../../apps/core/noname/library/element/ownedMarkStore.js';
import {createOwnedMarkMethods} from '../../apps/core/noname/game/ownedMarks.js';
function world(){
 const f=fixture();let seq=0;
 Object.assign(f.game,createOwnedMarkMethods({OwnedMarkStore,getId:()=>String(++seq),isVideo:()=>false,getSkill:n=>f.lib.skill[n],readSavedState:()=>null}));f.game.dead=[];
 function player(id){const p=f.player(id);p.playerid=id;p.dataset={position:String(f.game.players.length-1)};
  for(const k of ['skills','hiddenSkills','invisibleSkills','initedSkills','awakenedSkills'])p[k]=vm.runInContext('[]',f.context);
  p.checkConflict=()=>{};p.addSkillTrigger=()=>{};p.removeSkillTrigger=()=>{};p.removeAdditionalSkills=()=>{};p.enableSkill=()=>{};
  p.updateMarks=()=>{};p.mark=(name,info)=>({info,style:{transform:''},delete(){}});
  p.unmarkSkill=f.context.Player.prototype.unmarkSkill;
  p.hasSkill=name=>p.skills.includes(name)||Object.values(p.additionalSkills).some(xs=>xs.includes(name));
  p.getSkills=()=>[...new Set([...p.skills,...Object.values(p.additionalSkills).flat(),...Object.keys(p.tempSkills)])];
  p.clearSkills=()=>{};p.$uninit=()=>{};return p;
 }
 function loadYanyu(){const text=fs.readFileSync(new URL('../../apps/core/character/newjiang/skill.js',import.meta.url),'utf8'),start=text.indexOf('\tyj_yanyu: {')+'\tyj_yanyu: '.length,end=text.indexOf('\n\t},',start)+3;const sk=Function('lib','game','get','ui','_status',`return (${text.slice(start,end)})`)(f.lib,f.game,{info:n=>f.lib.skill[n]}, {},{});f.lib.skill.yj_yanyu=sk;for(const[k,v]of Object.entries(sk.subSkill))f.lib.skill['yj_yanyu_'+k]=v;return sk;}
 return {...f,player,loadYanyu};
}
test('uninit clears anonymous legacy counters without resurrecting them through retained projection',()=>{const w=world(),a=w.player('a'),b=w.player('b');b.addMark('camp',3,false);b.addOwnedMark('camp',a);b.uninit();assert.equal(b.countMark('camp'),0);assert.equal(w.game.getOwnedMarkStore().total(w.game.getOwnedMarkIdentity(b),'camp'),0);b.addOwnedMark('retained',a,1,{lifecycle:{reset:'retain'}});b.addMark('retained',2,false);b.uninit();assert.equal(b.countOwnedMark('retained'),1);assert.equal(b.countMark('retained'),1);});
test('live owned-effect expiration executes actual AdditionalSkill onunmark cleanup',()=>{const w=world(),a=w.player('a'),b=w.player('b');let cleaned=0;w.lib.skill.borrowed={intro:{onunmark(){cleaned++;}}};w.lib.skill.effect={onOwnedMarkChange(record,previous){if(!record)w.game.resolveOwnedMarkPlayer(previous.owner).removeAdditionalSkill(previous.id);}};const e=b.addOwnedMark('effect',a,1,{sourceSkill:'effect'});a.additionalSkills[e.id]=vm.runInContext('["borrowed"]',w.context);a.marks.borrowed={style:{transform:''},delete(){}};a.storage.borrowed=['state'];b.consumeOwnedMark('effect',a,e.id,e.revision);assert.equal(cleaned,1);assert.equal(a.additionalSkills[e.id],undefined);});
test('ledger-only restoration rebuilds yanyu conversion and reward auxiliary skills',()=>{const host=world();host.loadYanyu();const a=host.player('a'),b=host.player('b');b.addOwnedMark('yj_yanyu_effect',a,1,{sourceSkill:'yj_yanyu',params:{suits:['heart']},lifecycle:{ownerDeath:'retain'}});const saved=host.game.exportOwnedMarkState();const restored=world();restored.loadYanyu();const x=restored.player('a'),y=restored.player('b');assert.equal(restored.game.importOwnedMarkState(saved),true);assert.equal(y.hasSkill('yj_yanyu_fire'),true);assert.equal(x.hasSkill('yj_yanyu_use'),true);assert.equal(y.getOwnedMarks('yj_yanyu_effect')[0].params.suits[0],'heart');});
test('changing owner of a self-held yanyu relation withdraws only the former reward helper',()=>{const w=world();w.loadYanyu();const a=w.player('a'),b=w.player('b');const e=a.addOwnedMark('yj_yanyu_effect',a,1,{sourceSkill:'yj_yanyu',params:{suits:['heart']}});assert.equal(a.hasSkill('yj_yanyu_fire'),true);assert.equal(a.hasSkill('yj_yanyu_use'),true);a.updateOwnedMark(e.name,e.id,a,{owner:w.game.getOwnedMarkIdentity(b)});assert.equal(a.hasSkill('yj_yanyu_fire'),true);assert.equal(a.hasSkill('yj_yanyu_use'),false);assert.equal(b.hasSkill('yj_yanyu_use'),true);});
test('a reentrant relation grant emits each quantity event only once',()=>{const w=world(),a=w.player('a'),b=w.player('b');w.lib.skill.chain={onOwnedMarkChange(record,previous){if(record&&!previous)b.addOwnedMark('second',a);}};b.addOwnedMark('first',a,1,{sourceSkill:'chain'});assert.deepEqual(w.events.map(e=>[e.markName,e.num]).sort(),[['first',1],['second',1]]);assert.equal(b.countMark('first'),1);assert.equal(b.countMark('second'),1);});
