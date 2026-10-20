import test from 'node:test';
import assert from 'node:assert/strict';
import {fixture} from '../owned-marks/player-fixture.mjs';
import {createOwnedMarkMethods} from '../../apps/core/noname/game/ownedMarks.js';
import {OwnedMarkStore} from '../../apps/core/noname/library/element/ownedMarkStore.js';
const module=await import('../../apps/core/noname/game/markCompatibility.js').catch(()=>({}));
function world(){const w=fixture();Object.assign(w.game,module.createMarkCompatibilityMethods?.()||{});return w;}
const policy={semantics:'multi',skills:['apply','expire'],sourceSkill:'apply',query:'owner',remove:'owner',selfResource:true};
test('declared old API calls attribute only an explicit synchronous actor',()=>{
 const w=world(),a=w.player(),b=w.player(),c=w.player();w.game.registerOwnedMarkPolicy('debt',policy);
 w.game.withMarkExecution(a,'apply',()=>c.addMark('debt',2));
 w.game.withMarkExecution(b,'apply',()=>c.addMark('debt',3));
 assert.equal(c.countMark('debt'),5);assert.equal(c.countOwnedMark('debt',a),2);assert.equal(c.countOwnedMark('debt',b),3);
 w.game.withMarkExecution(a,'expire',()=>{assert.equal(c.countMark('debt'),2);c.clearMark('debt');assert.equal(c.hasMark('debt'),false);});
 assert.equal(c.countMark('debt'),3);assert.equal(c.hasOwnedMark('debt',b),true);
});
test('undeclared or unrelated skill execution never invents an owner',()=>{
 const w=world(),a=w.player(),c=w.player();w.game.registerOwnedMarkPolicy('debt',policy);
 w.game.withMarkExecution(a,'other',()=>c.addMark('debt',2));c.addMark('debt',1);
 assert.equal(c.countMark('debt'),3);assert.equal(c.countOwnedMark('debt'),0);
 assert.equal(w.ledger.snapshot().buckets[0].anonymous,3);
});
test('unknown removal cannot consume an attributed share; explicit all-source clear can',()=>{
 const w=world(),a=w.player(),c=w.player();w.game.registerOwnedMarkPolicy('debt',policy);
 w.game.withMarkExecution(a,'apply',()=>c.addMark('debt',2));c.addMark('debt',1);c.removeMark('debt',99);
 assert.equal(c.countMark('debt'),2);c.clearMark('debt',false,{scope:'all'});assert.equal(c.countMark('debt'),0);
});
test('shared and resource declarations keep default aggregate numeric behavior',()=>{
 const w=world(),a=w.player(),b=w.player();w.game.registerOwnedMarkPolicy('nightmare',{semantics:'shared'});w.game.registerOwnedMarkPolicy('rage',{semantics:'resource'});
 w.game.withMarkExecution(a,'anything',()=>{b.addMark('nightmare',2);a.addMark('rage',3);});
 w.game.withMarkExecution(b,'anything',()=>{assert.equal(b.countMark('nightmare'),2);b.clearMark('nightmare');});
 assert.equal(a.countMark('rage'),3);assert.equal(b.countMark('rage'),0);assert.equal(a.countOwnedMark('rage'),0);
});
test('Promise suspension clears scope; unrelated and post-await calls remain unknown',async()=>{
 const w=world(),a=w.player(),c=w.player();w.game.registerOwnedMarkPolicy('debt',policy);let release;
 const wait=new Promise(resolve=>release=resolve);
 const task=w.game.withMarkExecution(a,'apply',async()=>{c.addMark('debt');await wait;c.addMark('debt');});
 c.addMark('debt');release();await task;
 assert.equal(c.countOwnedMark('debt',a),1);assert.equal(c.countMark('debt'),3);assert.equal(w.ledger.snapshot().buckets[0].anonymous,2);
});
test('explicit captured callbacks and nested unknown barriers do not leak actors',()=>{
 const w=world(),a=w.player(),b=w.player(),c=w.player();w.game.registerOwnedMarkPolicy('debt',policy);let captured;
 w.game.withMarkExecution(a,'apply',()=>{captured=w.game.captureMarkCallback(()=>c.addMark('debt'));w.game.withMarkExecution(null,null,()=>c.addMark('debt'));w.game.withMarkExecution(b,'apply',()=>c.addMark('debt'));});
 captured();assert.equal(c.countOwnedMark('debt',a),1);assert.equal(c.countOwnedMark('debt',b),1);assert.equal(w.ledger.snapshot().buckets[0].anonymous,1);
});
test('binding a scheduled event restores only its explicitly registered execution scope',()=>{
 const w=world(),a=w.player(),c=w.player(),event={player:c};w.game.registerOwnedMarkPolicy('debt',policy);
 w.game.bindMarkExecution(event,a,'apply');w.game.runMarkContent(event,()=>c.addMark('debt'));w.game.runMarkContent({player:a},()=>c.addMark('debt'));
 assert.equal(c.countOwnedMark('debt',a),1);assert.equal(w.ledger.snapshot().buckets[0].anonymous,1);
});
test('explicit owner query and removal work outside an ambient execution scope',()=>{
 const w=world(),a=w.player(),b=w.player(),c=w.player();w.game.registerOwnedMarkPolicy('debt',policy);
 w.game.withMarkExecution(a,'apply',()=>c.addMark('debt',2));w.game.withMarkExecution(b,'apply',()=>c.addMark('debt',3));
 assert.equal(c.countMark('debt',{scope:'owner',owner:a}),2);c.removeMark('debt',1,false,{scope:'owner',owner:b});assert.equal(c.countMark('debt'),4);
});
test('numeric semantics policy cannot silently reinterpret old array marks',()=>{
 const w=world(),a=w.player(),c=w.player();w.game.registerOwnedMarkPolicy('debt',policy);c.storage.debt=['one','two'];
 w.game.withMarkExecution(a,'apply',()=>assert.equal(c.countMark('debt'),2));assert.equal(c.countOwnedMark('debt'),0);
});
function recoverable(){const w=world();let id=0;Object.assign(w.game,createOwnedMarkMethods({OwnedMarkStore,getId:()=>String(++id),getSkill:name=>w.lib.skill[name],isVideo:()=>false}));const player=w.player;w.player=name=>{const p=player(name);p.dataset={position:String(w.game.players.indexOf(p))};p.updateMarks=()=>{};return p;};return w;}
test('explicit policy declarations roundtrip with ledger state and invalid policy import is atomic',()=>{
 const host=recoverable(),a=host.player(),c=host.player();host.game.registerOwnedMarkPolicy('debt',policy);host.game.registerOwnedMarkPolicy('dream',{semantics:'shared'});
 host.game.withMarkExecution(a,'apply',()=>c.addMark('debt',2));const payload=host.game.exportOwnedMarkState();assert.equal(payload.policies.length,2);
 const client=recoverable();client.player();const target=client.player();client.game.importOwnedMarkState(payload);assert.equal(client.game.getOwnedMarkPolicy('dream').semantics,'shared');assert.equal(target.countMark('debt'),2);
 const old=client.game.exportOwnedMarkState();payload.ledger.revision++;payload.policies[0][1].semantics='guessed';assert.throws(()=>client.game.importOwnedMarkState(payload),/policy|semantics/);assert.deepEqual(client.game.exportOwnedMarkState(),old);
});
test('a legacy snapshot with no policies clears a previous match policy set',()=>{
 const host=recoverable(),a=host.player();const c=host.player();c.addOwnedMark('debt',a,1);const payload=host.game.exportOwnedMarkState();assert.equal(payload.policies,undefined);
 const client=recoverable();client.player();client.player();client.game.registerOwnedMarkPolicy('debt',policy);client.game.importOwnedMarkState(payload,{force:true});
 assert.equal(client.game.getOwnedMarkPolicy('debt'),undefined);
});
test('restoration hooks cannot silently mutate restored legacy quantities',()=>{
 const host=recoverable(),a=host.player(),c=host.player();host.game.registerOwnedMarkPolicy('debt',policy);host.game.withMarkExecution(a,'apply',()=>c.addMark('debt',2));const saved=host.game.exportOwnedMarkState();
 const client=recoverable();client.player();const target=client.player();client.lib.skill.apply={onOwnedMarkChange(record,before,{restoring}){if(restoring&&record)target.removeMark('debt',1,false);}};
 client.game.importOwnedMarkState(saved,{force:true});assert.equal(target.countMark('debt'),2);assert.equal(client.game.getOwnedMarkStore().snapshot().revision,saved.ledger.revision);
});
test('foreign direct Player mod callbacks cannot inherit the calling skill owner',()=>{
 const w=world(),a=w.player(),b=w.player(),c=w.player();w.game.registerOwnedMarkPolicy('debt',policy);w.game.withMarkExecution(a,'apply',()=>c.addMark('debt',2));w.game.withMarkExecution(b,'apply',()=>c.addMark('debt',3));
 let observed;w.context.get.is={object:()=>true};w.context._status.event.getParent=()=>({name:'phaseUse'});c.getModableSkills=()=>['foreign_mod'];w.lib.skill.foreign_mod={mod:{cardDiscardable(card,player){observed=player.countMark('debt');return true;}}};
 w.game.withMarkExecution(a,'apply',()=>c.modedDiscard({cards:[{}]}));assert.equal(observed,5);
});
test('signed old add/remove keep arithmetic meaning within a declared numeric source',()=>{
 const w=world(),a=w.player(),c=w.player();w.game.registerOwnedMarkPolicy('debt',policy);
 w.game.withMarkExecution(a,'apply',()=>{c.addMark('debt',3);c.addMark('debt',-1);c.removeMark('debt',-2);});assert.equal(c.countOwnedMark('debt',a),4);
});
test('a declared all-source clear does not reuse an owner-scoped query quantity',()=>{
 const w=world(),a=w.player(),b=w.player(),c=w.player();w.game.registerOwnedMarkPolicy('debt',{...policy,remove:'all'});
 w.game.withMarkExecution(a,'apply',()=>c.addMark('debt',2));w.game.withMarkExecution(b,'apply',()=>c.addMark('debt',3));
 w.game.withMarkExecution(a,'expire',()=>c.clearMark('debt'));assert.equal(c.countMark('debt'),0);
});
