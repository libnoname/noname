import fs from 'node:fs';
import vm from 'node:vm';
import {OwnedMarkStore} from '../../apps/core/noname/library/element/ownedMarkStore.js';
import {createMarkCompatibilityMethods} from '../../apps/core/noname/game/markCompatibility.js';
export function fixture() {
 const players=[],events=[]; let n=0;
 const lib={skill:{},translate:{},config:{}};
 const game={players,online:false,log(){},addVideo(){},broadcast(){},
  broadcastAll(fn,...args){fn(...args);},callHook(){},
  getOwnedMarkIdentity(p){if(!p||typeof p!=='object')throw TypeError('Player required');return p._ownedMarkIdentity??=( `match:player:${++n}`);},
  resolveOwnedMarkPlayer(id){return players.find(p=>p._ownedMarkIdentity===id);},
  getOwnedMarkStore(){return ledger;},
  createEvent(name){const e={name,setContent(){}};events.push(e);return e;}
 };
 Object.assign(game,createMarkCompatibilityMethods());
 const ledger=new OwnedMarkStore({sessionId:'match',onChange(state){for(const b of state.buckets){const p=game.resolveOwnedMarkPlayer(b.bearer);if(p)p.storage[b.name]=b.anonymous+b.effects.reduce((n,e)=>n+e.count,0);}}});
 game.handleOwnedMarkLifecycle=(p,reason,skill)=>p._ownedMarkIdentity?ledger.lifecycle(p._ownedMarkIdentity,reason,skill):[];
 game.refreshOwnedMarks=()=>{for(const b of ledger.snapshot().buckets){const p=game.resolveOwnedMarkPlayer(b.bearer);if(p)p.storage[b.name]=ledger.total(b.bearer,b.name);}};
 const context=vm.createContext({game,lib,get:{event(){return null;},info(s){return lib.skill[s]??{};},cnNumber:String,itemtype(){return null;}},_status:{event:{clearStepCache(){}}},HTMLDivElement:class {},CacheContext:{inject(){}},ui:{updatem(){}}});
 vm.runInContext(`Array.prototype.add=function(x){if(!this.includes(x))this.push(x);return this;};Array.prototype.addArray=function(xs){xs.forEach(x=>this.add(x));return this;};Array.prototype.remove=function(x){const i=this.indexOf(x);if(i>=0)this.splice(i,1);return this;};Array.prototype.removeArray=function(xs){xs.forEach(x=>this.remove(x));return this;};`,context);
 const source=fs.readFileSync(new URL('../../apps/core/noname/library/element/player.js',import.meta.url),'utf8').replace(/^import .*;\r?\n/gm,'').replace('export class Player','globalThis.Player = class Player');
 vm.runInContext(source,context);
 function player(name='same_general') {const p=Object.create(context.Player.prototype);Object.assign(p,{storage:{},marks:{},name,playerid:`id${players.length}`,skills:[],tempSkills:{},additionalSkills:{},disabledSkills:{}});p.markSkill=()=>p;p.unmarkSkill=()=>p;p.syncStorage=()=>{};p.hasSkill=s=>p.skills.includes(s);p.isIn=()=>true;players.push(p);return p;}
 return {game,lib,ledger,player,events,context};
}
