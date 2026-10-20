/**
 * P0 evidence: baseline skill object text is extracted by TypeScript AST and
 * evaluated unchanged inside the production Player fixture's VM realm.
 * Explicit test execution scopes are NOT the real event scheduler/ArrayCompiler.
 * IO stubs below only model hp/cards/animation. No skill function body is patched.
 * KNOWN LIMIT tests execute desired assertions: failures are hard unmet
 * requirements, NOT green acceptance results or evidence of full compatibility.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {createRequire} from 'node:module';
import vm from 'node:vm';
import {fixture} from '../owned-marks/player-fixture.mjs';
import {createMarkCompatibilityMethods} from '../../apps/core/noname/game/markCompatibility.js';

const ts=createRequire(import.meta.url)('typescript');
const BASE='3e72c4b7980050c3b7d58adc53d232b64bb00791';
const sources=new Map();
function original(w,path,name){
 if(!sources.has(path))sources.set(path,execFileSync('git',['show',`${BASE}:${path}`],{encoding:'utf8',maxBuffer:20*1024*1024}));
 const text=sources.get(path),sf=ts.createSourceFile(path,text,ts.ScriptTarget.Latest,true,ts.ScriptKind.JS),found=[];
 function visit(node){if(ts.isPropertyAssignment(node)&&node.name.getText(sf)===name&&ts.isObjectLiteralExpression(node.initializer))found.push(node.initializer);ts.forEachChild(node,visit);}
 visit(sf);assert.equal(found.length,1,`unique original object ${path}:${name}`);
 const node=found[0],literal=text.slice(node.getStart(sf),node.end);
 const value=vm.runInContext(`(${literal})`,w.context,{filename:`${BASE}/${path}#${name}`});
 w.lib.skill[name]=value;
 for(const[k,v]of Object.entries(value.subSkill||{}))w.lib.skill[`${name}_${k}`]=v;
 return value;
}
const SP='apps/core/character/sp/skill.js',EXTRA='apps/core/character/extra/skill.js';
const GZ='apps/core/mode/guozhan/src/skill/character/wushuang.js';
function world(){
 const w=fixture();Object.assign(w.game,createMarkCompatibilityMethods(),{
  phaseNumber:0,dead:[],hasPlayer(fn){return this.players.some(fn);},countPlayer(fn){return this.players.filter(fn).length;},
  filterPlayer(fn){return fn?this.players.filter(fn):this.players.slice();},delay:async()=>{},delayx:async()=>{},
  loseAsync(){return{setContent:async()=>{}};},
 });
 Object.assign(w.context.get,{rand:()=>1,type:()=> 'basic',type2:()=> 'basic',translation:x=>String(x)});
 const basePlayer=w.player;
 w.player=(id,skills=[])=>{const p=basePlayer(id);Object.assign(p,{
  hp:4,skills,hand:[],received:[],drawn:0,lostHp:0,lines:[],
  line(target,color){this.lines.push([target.playerid,color]);},
  loseHp:async function(){this.hp--;this.lostHp++;},
  draw:async function(n=1){this.drawn+=n;},
  countCards(){return this.hand.length;},getCards(){return this.hand.slice();},getGainableCards(){return this.hand.slice();},
  give:async function(cards,recipient){this.hand=this.hand.filter(c=>!cards.includes(c));recipient.received.push(...cards);},
  // Controlled IO: helper skill installation is observed, not engine-simulated.
  addTempSkill(name){this.tempSkills[name]=true;},
 });return p;};
 w.run=(actor,skill,fn,args=[],globals={})=>{
  Object.assign(w.context,{player:actor,...globals});
  return w.game.withMarkExecution(actor,skill,()=>fn(...args),{event:globals.event||null});
 };
 return w;
}
function policy(w,name,skills,sourceSkill,{selfResource=false}={}){
 w.game.registerOwnedMarkPolicy(name,{semantics:'multi',skills,sourceSkill,query:'owner',remove:'owner',selfResource});
}
function xurong({owned=true}={}){
 const w=world(),s=original(w,SP,'xinfu_xionghuo'),shajue=original(w,SP,'xinfu_shajue');
 if(owned)policy(w,'xinfu_xionghuo',['xinfu_xionghuo','xinfu_xionghuo_init','xinfu_xionghuo_damage','xinfu_xionghuo_effect','xinfu_shajue'],'xinfu_xionghuo',{selfResource:true});
 const a=w.player('A',['xinfu_xionghuo']),b=w.player('B',['xinfu_xionghuo']),c=w.player('C');
 const init=p=>w.run(p,'xinfu_xionghuo_init',s.subSkill.init.content,[],{trigger:{name:'phase'}});
 const give=p=>w.run(p,'xinfu_xionghuo',s.content,[],{target:c});
 return{...w,s,shajue,a,b,c,init,give};
}

test('original 徐荣 1: initial original init gives exactly three self resources',()=>{
 const w=xurong();assert.equal(w.s.subSkill.init.filter({name:'phase'},w.a),true);w.init(w.a);
 assert.equal(w.a.countMark('xinfu_xionghuo'),3);assert.equal(w.a.countOwnedMark('xinfu_xionghuo',w.a),3);
 assert.equal(w.s.subSkill.init.filter({name:'phase'},w.a),false);
});
test('original 徐荣 2: unchanged gift spends A resource and records C relation to A',()=>{
 const w=xurong();w.init(w.a);assert.equal(w.run(w.a,'xinfu_xionghuo',w.s.filterTarget,[{},w.a,w.c]),true);w.give(w.a);
 assert.equal(w.a.countMark('xinfu_xionghuo'),2);assert.equal(w.c.countOwnedMark('xinfu_xionghuo',w.a),1);
});
test('original 徐荣 3: B damage filter does not use the mark A gave C under explicit new policy',()=>{
 const w=xurong();w.init(w.a);w.give(w.a);
 assert.equal(w.run(w.b,'xinfu_xionghuo_damage',w.s.subSkill.damage.filter,[{player:w.c},w.b]),false);
});
test('original 徐荣 4: A original damage content increases damage by one',()=>{
 const w=xurong();w.init(w.a);w.give(w.a);const trigger={player:w.c,num:1};
 assert.equal(w.run(w.a,'xinfu_xionghuo_damage',w.s.subSkill.damage.filter,[trigger,w.a]),true);
 w.run(w.a,'xinfu_xionghuo_damage',w.s.subSkill.damage.content,[],{trigger});assert.equal(trigger.num,2);
});
test('original 徐荣 5: B can pass original target filter despite A external relation with new policy',()=>{
 const w=xurong();w.init(w.a);w.init(w.b);w.give(w.a);
 assert.equal(w.run(w.b,'xinfu_xionghuo',w.s.filterTarget,[{},w.b,w.c]),true);w.give(w.b);
 assert.equal(w.c.countOwnedMark('xinfu_xionghuo',w.a),1);assert.equal(w.c.countOwnedMark('xinfu_xionghuo',w.b),1);
 assert.equal(w.c.countMark('xinfu_xionghuo'),2);
});
test('original 徐荣 6: original phase-use case1 consumes A only before controlled loseHp await',async()=>{
 const w=xurong();w.init(w.a);w.init(w.b);w.give(w.a);w.give(w.b);
 assert.equal(w.run(w.a,'xinfu_xionghuo_effect',w.s.subSkill.effect.filter,[{player:w.c},w.a]),true);
 await w.run(w.a,'xinfu_xionghuo_effect',w.s.subSkill.effect.content,[{}, {player:w.c},w.a]);
 assert.equal(w.c.countOwnedMark('xinfu_xionghuo',w.a),0);assert.equal(w.c.countOwnedMark('xinfu_xionghuo',w.b),1);
 assert.equal(w.c.lostHp,1);assert.equal(w.c.countMark('xinfu_xionghuo_low'),1);
 assert.equal(w.run(w.a,'xinfu_xionghuo_effect',w.s.subSkill.effect.filter,[{player:w.c},w.a]),false);
});
test('original 徐荣 7: B separately resolves its original phase-use case1; each source consumes once',async()=>{
 const w=xurong();w.init(w.a);w.init(w.b);w.give(w.a);w.give(w.b);
 for(const p of [w.a,w.b])await w.run(p,'xinfu_xionghuo_effect',w.s.subSkill.effect.content,[{}, {player:w.c},p]);
 assert.equal(w.c.countMark('xinfu_xionghuo'),0);assert.equal(w.c.lostHp,2);assert.equal(w.c.countMark('xinfu_xionghuo_low'),2);
});
test('original 徐荣 8: no-policy shared control rejects B gift, allows B damage and consumes A mark',async()=>{
 const w=xurong({owned:false});w.init(w.a);w.init(w.b);w.give(w.a);
 assert.equal(w.run(w.b,'xinfu_xionghuo',w.s.filterTarget,[{},w.b,w.c]),false);
 assert.equal(w.run(w.b,'xinfu_xionghuo_damage',w.s.subSkill.damage.filter,[{player:w.c},w.b]),true);
 await w.run(w.b,'xinfu_xionghuo_effect',w.s.subSkill.effect.content,[{}, {player:w.c},w.b]);
 assert.equal(w.c.countMark('xinfu_xionghuo'),0);assert.equal(w.c.countOwnedMark('xinfu_xionghuo'),0);
});
test('original 徐荣 self resource and a different donor external relation coexist on one bearer',async()=>{
 const w=xurong();w.init(w.a);w.init(w.b);
 assert.equal(w.run(w.a,'xinfu_xionghuo',w.s.filterTarget,[{},w.a,w.b]),true);
 w.run(w.a,'xinfu_xionghuo',w.s.content,[],{target:w.b});
 assert.equal(w.b.countMark('xinfu_xionghuo'),4);assert.equal(w.b.countOwnedMark('xinfu_xionghuo',w.a),1);assert.equal(w.b.countOwnedMark('xinfu_xionghuo',w.b),3);
 w.give(w.b);assert.equal(w.b.countOwnedMark('xinfu_xionghuo',w.b),2);assert.equal(w.b.countOwnedMark('xinfu_xionghuo',w.a),1);
 await w.run(w.a,'xinfu_xionghuo_effect',w.s.subSkill.effect.content,[{}, {player:w.b},w.a]);
 assert.equal(w.b.countOwnedMark('xinfu_xionghuo',w.a),0);assert.equal(w.b.countOwnedMark('xinfu_xionghuo',w.b),2);
 assert.equal(w.a.countMark('xinfu_xionghuo'),2);
});

function camps(gz=false){
 const w=world(),name=gz?'gz_gn_jieying':'drlt_jieying',mark=`${name}_mark`,s=original(w,gz?GZ:EXTRA,name);
 policy(w,mark,gz?[name,`${name}_effect`,`${name}_mark`]:[name,`${name}_1`,`${name}_2`,`${name}_3`,`${name}_mark`],name,{selfResource:true});
 const a=w.player('A',[name]),b=w.player('B',[name]),c=w.player('C'),d=w.player('unrelated-holder',[name]);
 const generate=p=>gz?w.run(p,name,s.content,[{}, {},p]):w.run(p,`${name}_1`,s.subSkill[1].content,[{}, {},p]);
 const give=(p,target=c)=>gz?w.run(p,`${name}_effect`,s.subSkill.effect.content,[{triggername:'phaseEnd',targets:[target]},{player:p},p]):w.run(p,`${name}_2`,s.subSkill[2].content,[{targets:[target]}, {},p]);
 return{...w,name,mark,s,a,b,c,d,generate,give};
}
test('original double 神甘宁: policy permits one camp for A and B and source-selective ordinary collection',async()=>{
 const w=camps();await w.generate(w.a);
 assert.equal(w.run(w.b,'drlt_jieying_1',w.s.subSkill[1].filter,[{},w.b]),true);await w.generate(w.b);
 await w.give(w.a);await w.give(w.b);w.c.hand=['h1'];
 assert.equal(w.c.countOwnedMark(w.mark,w.a),1);assert.equal(w.c.countOwnedMark(w.mark,w.b),1);
 await w.run(w.a,'drlt_jieying_3',w.s.subSkill[3].content,[{}, {player:w.c},w.a]);
 assert.equal(w.c.countOwnedMark(w.mark,w.a),0);assert.equal(w.c.countOwnedMark(w.mark,w.b),1);assert.deepEqual(w.a.received,['h1']);
});
test('KNOWN LIMIT: original ordinary camp remove/add must preserve effect ID',{},async()=>{
 const w=camps();await w.generate(w.a);const before=w.a.getOwnedMarks(w.mark,w.a)[0];await w.give(w.a);
 assert.equal(w.c.getOwnedMarks(w.mark,w.a)[0].id,before.id);
});
test('original ordinary camp mods: observe unrelated holders still counted',async()=>{
 const w=camps();await w.generate(w.a);await w.give(w.a);
 const actual=w.run(w.a,'drlt_jieying_mark',w.s.subSkill.mark.mod.cardUsable,[{name:'sha'},w.c,1]);
 assert.equal(actual,4); // A + B + unrelated D, despite only A having a camp on C.
 assert.equal(w.c.countOwnedMark(w.mark),1);
});
test('KNOWN LIMIT: original ordinary camp bonus should count actual effective camp owners',{},async()=>{
 const w=camps();await w.generate(w.a);await w.give(w.a);
 assert.equal(w.run(w.a,'drlt_jieying_mark',w.s.subSkill.mark.mod.cardUsable,[{name:'sha'},w.c,1]),2);
});
test('original 国战 double camp generation and gift keep owner quantities separate',async()=>{
 const w=camps(true);await w.generate(w.a);
 assert.equal(w.run(w.b,w.name,w.s.filter,[{},w.b,'phaseBegin']),true);await w.generate(w.b);await w.give(w.a);await w.give(w.b);
 assert.equal(w.c.countOwnedMark(w.mark,w.a),1);assert.equal(w.c.countOwnedMark(w.mark,w.b),1);
});
test('original 国战 recovery: observe await loses test scope and leaves source camp at bearer',async()=>{
 const w=camps(true);await w.generate(w.a);await w.generate(w.b);await w.give(w.a);await w.give(w.b);w.c.hand=['h1'];
 await w.run(w.a,`${w.name}_effect`,w.s.subSkill.effect.content,[{triggername:'phaseAfter',targets:[w.c]},{player:w.c},w.a]);
 assert.deepEqual(w.a.received,['h1']);assert.equal(w.c.countOwnedMark(w.mark,w.a),1);assert.equal(w.c.countOwnedMark(w.mark,w.b),1);
 assert.equal(w.a.countOwnedMark(w.mark,w.a),0);assert.equal(w.a.countMark(w.mark),2); // Anonymous aggregate copied after await.
});
test('KNOWN LIMIT: original 国战 recovery needs resumed scope and exact selected transfer',{},async()=>{
 const w=camps(true);await w.generate(w.a);await w.give(w.a);w.c.hand=['h1'];
 await w.run(w.a,`${w.name}_effect`,w.s.subSkill.effect.content,[{triggername:'phaseAfter',targets:[w.c]},{player:w.c},w.a]);
 assert.equal(w.c.countOwnedMark(w.mark,w.a),0);assert.equal(w.a.countOwnedMark(w.mark,w.a),1);
});
test('original 国战 mark mods likewise count unrelated global holders',async()=>{
 const w=camps(true);await w.generate(w.a);await w.give(w.a);
 assert.equal(w.run(w.a,`${w.name}_mark`,w.s.subSkill.mark.mod.maxHandcard,[w.c,4]),7);
});

test('another original simple application: test-only multi policy records zongkui actor before await',async()=>{
 const w=world(),s=original(w,'apps/core/character/sp2/skill.js','zongkui'),a=w.player('A'),b=w.player('B'),c=w.player('C');
 // Diagnostic override only: normal 傀 is shared; this does not recommend a product rule change.
 policy(w,'zongkui_mark',['zongkui'],'zongkui');
 await w.run(a,'zongkui',s.content,[{targets:[c]}, {},a]);await w.run(b,'zongkui',s.content,[{targets:[c]}, {},b]);
 assert.equal(c.countOwnedMark('zongkui_mark',a),1);assert.equal(c.countOwnedMark('zongkui_mark',b),1);
});
test('representative original 协穆: one declarative policy isolates targets rewards and source expiry',async()=>{
 const w=world(),path='apps/core/character/sp2/skill.js';
 const apply=original(w,path,'rexiemu'),reward=original(w,path,'rexiemu2'),expire=original(w,path,'rexiemu3');
 policy(w,'rexiemu',['rexiemu','rexiemu2','rexiemu3'],'rexiemu');
 const a=w.player('A'),b=w.player('B'),c=w.player('C'),d=w.player('D');
 for(const p of[a,b]){p.addSkill=skill=>p.skills.push(skill);p.removeSkill=skill=>p.skills=p.skills.filter(id=>id!==skill);}
 w.game.asyncDraw=async players=>{for(const p of players)await p.draw();};w.context._status.currentPhase=d;
 await w.run(a,'rexiemu',apply.content,[{targets:[c]}, {},a]);
 assert.equal(w.run(b,'rexiemu',apply.filter,[{},b]),true);
 await w.run(b,'rexiemu',apply.content,[{targets:[d]}, {},b]);
 const event={player:c,hs:['card'],getParent:()=>({name:'useCard'})};
 assert.equal(w.run(a,'rexiemu2',reward.filter,[event,a]),true);assert.equal(w.run(b,'rexiemu2',reward.filter,[event,b]),false);
 await w.run(a,'rexiemu2',reward.content,[{},event,a]);assert.equal(a.drawn,1);assert.equal(c.drawn,1);assert.equal(b.drawn,0);assert.equal(d.drawn,0);
 await w.run(a,'rexiemu3',expire.content,[{}, {},a]);assert.equal(c.countOwnedMark('rexiemu',a),0);assert.equal(d.countOwnedMark('rexiemu',b),1);
});
test('original 节谏 after-await application remains anonymous at this explicit synchronous boundary',async()=>{
 const w=world(),s=original(w,'apps/core/character/mobile/skill.js','mbjiejian'),a=w.player('A'),b=w.player('B'),c=w.player('C');
 policy(w,'mbjiejian_mark',['mbjiejian','mbjiejian_remove','mbjiejian_liuli'],'mbjiejian');
 c.hp=4;await w.run(a,'mbjiejian',s.content,[{targets:[c],cost_data:[[c,[]]]},{},a]);
 c.hp=2;await w.run(b,'mbjiejian',s.content,[{targets:[c],cost_data:[[c,[]]]},{},b]);
 const records=c.getOwnedMarks('mbjiejian_mark');assert.equal(records.length,0);
 assert.equal(c.countMark('mbjiejian_mark'),2);assert.equal(c.countOwnedMark('mbjiejian_mark',a),0);
 assert.equal(c.countOwnedMark('mbjiejian_mark',b),0);
 // Original formula overwrote A=4 with B=2; HP=3 would need different giver outcomes.
 assert.equal(3>=4,false);assert.equal(3>=c.countMark('mbjiejian_mark'),true);
});
test('KNOWN LIMIT: original 节谏 application needs source-associated HP params',{},async()=>{
 const w=world(),s=original(w,'apps/core/character/mobile/skill.js','mbjiejian'),a=w.player('A'),c=w.player('C');
 policy(w,'mbjiejian_mark',['mbjiejian'],'mbjiejian');
 await w.run(a,'mbjiejian',s.content,[{targets:[c],cost_data:[[c,[]]]},{},a]);
 assert.equal(c.getOwnedMarks('mbjiejian_mark',a)[0]?.params?.hpAtGrant,4);
});
test('original 节谏 without policy loses independent giver thresholds in one aggregate',async()=>{
 const w=world(),s=original(w,'apps/core/character/mobile/skill.js','mbjiejian'),a=w.player('A'),b=w.player('B'),c=w.player('C');
 c.hp=4;await w.run(a,'mbjiejian',s.content,[{targets:[c],cost_data:[[c,[]]]},{},a]);c.hp=2;
 await w.run(b,'mbjiejian',s.content,[{targets:[c],cost_data:[[c,[]]]},{},b]);assert.equal(c.countMark('mbjiejian_mark'),2);assert.equal(c.countOwnedMark('mbjiejian_mark'),0);
});
test('shared 梦魇 / 傀 original applications and self 暴怒 / 忍 keep aggregate API control behavior',async()=>{
 const w=world(),a=w.player('A'),b=w.player('B'),c=w.player('C');
 for(const name of ['new_wuhun','zongkui_mark'])w.game.registerOwnedMarkPolicy(name,{semantics:'shared'});
 for(const name of ['baonu','renjie'])w.game.registerOwnedMarkPolicy(name,{semantics:'resource'});
 const nightmare=original(w,EXTRA,'new_wuhun'),puppet=original(w,'apps/core/character/sp2/skill.js','zongkui'),rage=original(w,EXTRA,'baonu'),endure=original(w,EXTRA,'renjie');
 await w.run(a,'new_wuhun',nightmare.content,[{}, {source:c,num:2},a]);await w.run(b,'new_wuhun',nightmare.content,[{}, {source:c,num:1},b]);
 assert.equal(c.countMark('new_wuhun'),3);assert.equal(c.countOwnedMark('new_wuhun'),0);
 await w.run(a,'zongkui',puppet.content,[{targets:[c]}, {},a]);assert.equal(c.countMark('zongkui_mark'),1);assert.equal(c.countOwnedMark('zongkui_mark'),0);
 await w.run(a,'baonu',rage.content,[{}, {name:'enterGame'},a]);await w.run(a,'baonu',rage.content,[{}, {name:'damage',num:3},a]);
 await w.run(a,'renjie',endure.content,[{}, {num:2},a]);assert.equal(a.countMark('baonu'),5);assert.equal(a.countMark('renjie'),2);assert.equal(b.countMark('baonu'),0);
 a.removeMark('baonu',2);a.removeMark('renjie',1);assert.equal(a.countMark('baonu'),3);assert.equal(a.countMark('renjie'),1);
 assert.equal(a.countOwnedMark('baonu'),0);assert.equal(a.countOwnedMark('renjie'),0);
});
