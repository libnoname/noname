// Production-path integration in disposable Chromium profiles. No game files are written.
import http from 'node:http';
import fs from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const workspace=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../../..');
const defaultRelease='C:/Users/32360/Desktop/无名杀-win32-x64';
const selectedRelease=path.resolve(process.env.OWNED_MARK_RELEASE||defaultRelease);
const root=existsSync(path.join(selectedRelease,'resources/app/index.html'))?path.join(selectedRelease,'resources/app'):selectedRelease;
const resultsDirectory=path.resolve(process.env.OWNED_MARK_RESULTS||path.join(defaultRelease,'audit/mark-ownership-implementation'));
const output=path.resolve(process.env.OWNED_MARK_BROWSER_RESULTS||path.join(resultsDirectory,'browser-results.json'));
const toolingRoot=existsSync(path.join(root,'tmp_diag/node_modules/playwright-core'))?root:path.join(defaultRelease,'resources/app');
const require=createRequire(path.join(toolingRoot,'tmp_diag/package.json'));
const {chromium}=require('playwright-core');
const result={startedAt:new Date().toISOString(),releaseRoot:root,scope:'Real production modules, Player and GameEvent; self-built WebSocket relay, not product lobby/reconnect/full video playback',checks:[],pageErrors:[],consoleErrors:[],misses:[],writes:[],requests:[]};
const mime={'.html':'text/html','.js':'text/javascript','.mjs':'text/javascript','.ts':'text/javascript','.css':'text/css','.json':'application/json','.wasm':'application/wasm','.svg':'image/svg+xml','.png':'image/png','.webp':'image/webp','.jpg':'image/jpeg','.woff2':'font/woff2','.ttf':'font/ttf'};
const seen=new Set(),sockets=new Set();
let wireMessages=0,browser,deadline;
const server=http.createServer(async(req,res)=>{
 const url=new URL(req.url,'http://localhost');seen.add(url.pathname);
 const resolve=value=>{const target=path.resolve(root,'.'+'/'+value.replace(/^\/+/,''));if(target!==root&&!target.startsWith(root+path.sep))throw Error('outside game root');return target;};
 const json=(data)=>{res.writeHead(200,{'Content-Type':'application/json','Cache-Control':'no-store'});res.end(JSON.stringify({success:true,data}));};
 try{
  if(req.method!=='GET'||['/writeFile','/createDir','/removeFile','/removeDir'].includes(url.pathname)){result.writes.push(url.pathname);res.writeHead(403);res.end('Read-only test server');return;}
  if(['/checkFile','/checkDir'].includes(url.pathname)){const st=await fs.stat(resolve(url.searchParams.get('fileName')||url.searchParams.get('dir')||'')).catch(()=>null);json(st?.isFile()?'file':st?.isDirectory()?'directory':null);return;}
  if(['/readFile','/readFileAsText'].includes(url.pathname)){const data=await fs.readFile(resolve(url.searchParams.get('fileName')||''));json(url.pathname==='/readFile'?Array.from(data):data.toString('utf8'));return;}
  if(url.pathname==='/getFileList'){const list=await fs.readdir(resolve(url.searchParams.get('dir')||''),{withFileTypes:true});json({files:list.filter(x=>x.isFile()).map(x=>x.name),folders:list.filter(x=>x.isDirectory()).map(x=>x.name)});return;}
  const file=resolve(decodeURIComponent(url.pathname==='/'?'/index.html':url.pathname));const data=await fs.readFile(file);res.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream','Cache-Control':'no-store'});res.end(data);
 }catch(e){result.misses.push(url.pathname);res.writeHead(e.code==='ENOENT'||e.code==='EISDIR'?404:500);res.end(String(e));}
});
// Minimal text WebSocket relay. Browser sockets do the actual RFC6455 transport;
// both game encoding and dispatch use the real Client/get/message implementation.
function frame(payload,opcode=1){const b=Buffer.from(payload);let h;if(b.length<126)h=Buffer.from([128|opcode,b.length]);else if(b.length<65536){h=Buffer.alloc(4);h[0]=128|opcode;h[1]=126;h.writeUInt16BE(b.length,2);}else{h=Buffer.alloc(10);h[0]=128|opcode;h[1]=127;h.writeBigUInt64BE(BigInt(b.length),2);}return Buffer.concat([h,b]);}
server.on('upgrade',(req,socket,head)=>{
 const url=new URL(req.url,'http://localhost');if(url.pathname!=='/__audit_wire'){socket.destroy();return;}
 const key=req.headers['sec-websocket-key'];if(!key){socket.destroy();return;}
 const accept=createHash('sha1').update(key+'258EAFA5-E914-47DA-95CA-C5AB0DC85B11').digest('base64');
 socket.write('HTTP/1.1 101 Switching Protocols\r\nUpgrade: websocket\r\nConnection: Upgrade\r\nSec-WebSocket-Accept: '+accept+'\r\n\r\n');
 socket.role=url.searchParams.get('role');sockets.add(socket);let pending=Buffer.from(head);
 const drain=chunk=>{pending=Buffer.concat([pending,chunk]);while(pending.length>=2){let n=pending[1]&127,pos=2;const op=pending[0]&15,masked=!!(pending[1]&128);if(n===126){if(pending.length<4)return;n=pending.readUInt16BE(2);pos=4;}else if(n===127){if(pending.length<10)return;const big=pending.readBigUInt64BE(2);if(big>4000000n){socket.destroy();return;}n=Number(big);pos=10;}if(pending.length<pos+(masked?4:0)+n)return;const mask=masked?pending.subarray(pos,pos+4):null;pos+=masked?4:0;const data=Buffer.from(pending.subarray(pos,pos+n));pending=pending.subarray(pos+n);if(mask)for(let i=0;i<data.length;i++)data[i]^=mask[i%4];if(op===8){socket.end(frame('',8));return;}if(op===9){socket.write(frame(data,10));continue;}if(op===1&&socket.role==='host'){wireMessages++;for(const peer of sockets)if(peer.role==='client'&&!peer.destroyed)peer.write(frame(data));}}};
 socket.on('data',drain);socket.on('close',()=>sockets.delete(socket));socket.on('error',()=>sockets.delete(socket));if(head.length)drain(Buffer.alloc(0));
});
function check(name,pass,details){result.checks.push({name,pass:!!pass,...(details===undefined?{}:{details})});}
async function until(page,predicate,arg,timeout=15000){const end=Date.now()+timeout;let last;while(Date.now()<end){try{if(await page.evaluate(predicate,arg))return;}catch(e){last=String(e);}await page.waitForTimeout(150);}throw Error('Async module readiness deadline exceeded'+(last?': '+last:''));}
async function openPage(mode='identity'){
 const context=await browser.newContext();
 await context.addInitScript(mode=>{localStorage.setItem('gplv3_noname_alerted','true');localStorage.setItem('noname_0.9_config',JSON.stringify({show_splash:'off',mode,extensions:[]}));sessionStorage.setItem('isJITReloaded','true');sessionStorage.setItem('canUseTs','true');},mode);
 const page=await context.newPage();page.on('pageerror',e=>result.pageErrors.push(String(e)));page.on('console',m=>{if(m.type()==='error')result.consoleErrors.push(m.text().slice(0,400));});page.on('dialog',async d=>{result.pageErrors.push('DIALOG: '+d.message().slice(0,400));await d.accept();});
 await page.goto(result.origin+'/index.html',{waitUntil:'domcontentloaded',timeout:15000});await page.waitForTimeout(2000);
 await until(page,async()=>{const{lib,ui}=await import('/noname.js');return !!ui.arena&&!!lib.skill.drlt_jieying&&Object.keys(lib.skill).length>1000;});
 if(mode!=='identity'){
  // This release stores mode in IndexedDB, not the legacy localStorage config.
  await page.evaluate(async mode=>{const{game}=await import('/noname.js');await new Promise(resolve=>game.saveConfig('mode',mode,false,resolve));await new Promise(resolve=>game.saveConfig('show_splash','off',false,resolve));},mode);
  await page.reload({waitUntil:'domcontentloaded',timeout:15000});
  await until(page,async mode=>{const{lib,ui}=await import('/noname.js');return lib.config?.mode===mode&&!!ui.arena&&!!lib.skill.gz_gn_jieying_effect;},mode);
  // Raw mode dependencies can cause a further stock-JIT reload. Wait for a
  // stable document, not merely a predicate observed on the outgoing page.
  await page.waitForTimeout(1800);
  await until(page,async mode=>{const{lib,ui}=await import('/noname.js');return lib.config?.mode===mode&&!!ui.arena&&!!lib.skill.gz_gn_jieying_effect;},mode);
 }
 return page;
}
async function setup(page){
 await until(page,async()=>{const{lib,ui}=await import('/noname.js');return !!lib.config&&!!ui.arena;},undefined,10000);
 return page.evaluate(async()=>{
  const m=await import('/noname.js'),{lib,game,ui}=m;
  if(!lib.config)throw Error('fixture entered before production config initialized');
  const direct=await import('/noname/library/index.js');if(direct.lib!==lib)throw Error('fixture sees split library singletons');
  // Leave the stock character-choice loop suspended on its original pause manager.
  m.game.pause();const{status,setStatus}=await import('/noname/status/index.js');setStatus(new status());const s=(await import('/noname.js'))._status;
  s.event=lib.element.GameEvent.initialGameEvent();s.gameStarted=true;s.gameDrawed=true;lib.config.background_speak=false;lib.config.background_audio=false;lib.config.show_log='off';lib.config.game_speed='vvvfast';
  function world(n=4,generals=[]){game.resetOwnedMarks();for(const p of game.players||[])p.remove();game.players=[];game.dead=[];game.playerMap={};lib.playerOL={};
   const players=[];for(let i=0;i<n;i++){const p=ui.create.player(ui.arena);p.dataset.position=String(i);p.init(generals[i]||'caocao',generals[i]?undefined:false);p.getId();p.identity=i?'fan':'zhu';players.push(p);game.players.push(p);lib.playerOL[p.playerid]=p;}
   players.forEach((p,i)=>{p.nextSeat=p.next=players[(i+1)%n];p.previousSeat=p.previous=players[(i+n-1)%n];});game.me=players[0];game.zhu=players[0];s.currentPhase=players[0];return players;
  }
  async function run(fn,name='ownedMarkBrowser'){const event=game.createEvent(name,false);event.fixture=fn;event.setContent(async event=>{await event.fixture(event);event.finish();});await event;return event;}
  function camp(bearer,owner,name='drlt_jieying_mark',count=1){return bearer.addOwnedMark(name,owner,count,{sourceSkill:name==='drlt_jieying_mark'?'drlt_jieying':'gz_gn_jieying',lifecycle:{ownerDeath:'remove',bearerDeath:'remove',skillRemoval:'remove',reset:'remove'}});}
  window.__ownedBrowser={...m,s,world,run,camp};
  return {api:typeof lib.element.Player.prototype.addOwnedMark==='function'&&typeof game.getOwnedMarkIdentity==='function',playerClass:lib.element.Player.name,skills:Object.keys(lib.skill).length};
 });
}
try{
 deadline=setTimeout(()=>{result.timeout=true;browser?.close().catch(()=>{});for(const socket of sockets)socket.destroy();server.close();},55000);
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));result.origin='http://127.0.0.1:'+server.address().port;
 browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true,args:['--proxy-server=direct://','--proxy-bypass-list=*']});result.browser=browser.version();result.isolatedProfiles=true;
 const host=await openPage();
 const api=await host.evaluate(async()=>{const{lib,game}=await import('/noname.js');return typeof lib.element.Player.prototype.addOwnedMark==='function'&&typeof game.getOwnedMarkStore==='function';});check('production entry loads the owned-mark Player and Game APIs',api);
 if(api){
  result.host=await setup(host);
  const checks=await host.evaluate(async()=>{
   const{lib,game,get,s,world,run,camp}=window.__ownedBrowser;const out=[];
   const eq=(a,b)=>{if(Object.is(a,b))return;if(JSON.stringify(a)!==JSON.stringify(b))throw Error(JSON.stringify({actual:a,expected:b}));};
   const test=async(name,fn)=>{try{const details=await Promise.race([fn(),new Promise((_,reject)=>setTimeout(()=>reject(Error('case deadline 5000ms')),5000))]);out.push({name,pass:true,...(details===undefined?{}:{details})});}catch(e){out.push({name,pass:false,details:String(e.stack||e).slice(0,1500)});}};
   await test('two real Shen Ganning Players create independent camps despite the same general ID',async()=>{const[a,b]=world(4,['shen_ganning','shen_ganning']);eq(a instanceof lib.element.Player,true);eq(a.name,'shen_ganning');eq(a.name,b.name);eq(a.playerid===b.playerid,false);eq(game.getOwnedMarkIdentity(a)===game.getOwnedMarkIdentity(b),false);eq(lib.skill.drlt_jieying.canCreate(a),true);camp(a,a);eq(lib.skill.drlt_jieying.canCreate(b),true);camp(b,b);eq(a.countOwnedMark('drlt_jieying_mark',a),1);eq(b.countOwnedMark('drlt_jieying_mark',b),1);return {general:a.name,playersAreReal:true,independentCamps:true};});
   await test('different generals gain the same camp skill through real addSkill and keep source rights separate',async()=>{const[a,b,c]=world(4,['caocao','liubei']);eq(a.name===b.name,false);a.addSkill('drlt_jieying');b.addSkill('drlt_jieying');camp(c,a);camp(c,b);eq(c.getMarkOwners('drlt_jieying_mark').length,2);a.removeSkill('drlt_jieying');eq(c.hasOwnedMark('drlt_jieying_mark',a),false);eq(c.hasOwnedMark('drlt_jieying_mark',b),true);eq(b.hasSkill('drlt_jieying'),true);return {generals:[a.name,b.name],realSkillRegistration:true};});
   await test('ordinary numeric resources and array marks retain old behavior',async()=>{const[a,b,c]=world();c.addMark('browser_resource',0,false);c.addMark('browser_resource',2,false);eq(c.countMark('browser_resource'),3);c.setMark('browser_resource',4,false);eq(c.countMark('browser_resource'),4);c.clearMark('browser_resource',false);eq(c.countMark('browser_resource'),0);c.markAuto('browser_array',[a,b]);eq(c.countMark('browser_array'),2);c.unmarkAuto('browser_array',[a]);eq(c.storage.browser_array[0],b);});
   await test('real camp mods count the two actual owners, excluding unrelated holders and mark quantity',async()=>{const[a,b,c,d]=world();a.addSkill('drlt_jieying');b.addSkill('drlt_jieying');d.addSkill('drlt_jieying');camp(c,a,undefined,5);camp(c,a);camp(c,b);eq(lib.skill.drlt_jieying_mark.mod.cardUsable({name:'sha'},c,1),3);eq(lib.skill.drlt_jieying_mark.mod.maxHandcard(c,4),6);return {owners:c.getMarkOwners('drlt_jieying_mark').length,slashLimit:3};});
   await test('real phaseDrawBegin2 trigger queue adds one card for each actual camp owner',async()=>{const[a,b,c,d]=world();a.addSkill('drlt_jieying');b.addSkill('drlt_jieying');d.addSkill('drlt_jieying');camp(c,a);camp(c,b);s.currentPhase=c;let number;await run(async()=>{const event=game.createEvent('phaseDraw',false);event.player=c;event.num=2;event.setContent(async event=>{await event.trigger('phaseDrawBegin2');event.finish();});await event;number=event.num;});eq(number,4);return {syntheticPhaseDrawEvent:true,realArrangeTrigger:true,num:number};});
   await test('ordinary collection consumes only its owner camp and leaves the second source',async()=>{const[a,b,c]=world();a.addSkill('drlt_jieying');b.addSkill('drlt_jieying');camp(c,a);camp(c,b);await lib.skill.drlt_jieying_3.content({}, {player:c},a);eq(c.hasOwnedMark('drlt_jieying_mark',a),false);eq(c.hasOwnedMark('drlt_jieying_mark',b),true);eq(lib.skill.drlt_jieying_3.filter({player:c},b),true);});
   await test('temporary skill disable pauses camp buffs without deleting effects; removal cleans only the source',async()=>{const[a,b,c]=world();a.addSkill('drlt_jieying');b.addSkill('drlt_jieying');camp(c,a);camp(c,b);a.disableSkill('browser-disable','drlt_jieying');eq(c.countOwnedMark('drlt_jieying_mark'),2);eq(lib.skill.drlt_jieying_mark.mod.maxHandcard(c,4),5);a.enableSkill('browser-disable');eq(lib.skill.drlt_jieying_mark.mod.maxHandcard(c,4),6);a.removeSkill('drlt_jieying');eq(c.hasOwnedMark('drlt_jieying_mark',a),false);eq(c.hasOwnedMark('drlt_jieying_mark',b),true);});
   await test('duorui real Player hooks isolate disable reasons and gained-skill providers',async()=>{const[a,b,c]=world();lib.skill.browser_f={};lib.skill.browser_g={};lib.translate.browser_f='F';lib.translate.browser_g='G';a.addSkill('drlt_duorui');b.addSkill('drlt_duorui');c.addSkill(['browser_f','browser_g']);c.storage.drlt_duorui=['legacy-array'];const one=c.addOwnedMark('drlt_duorui_effect',a,1,{sourceSkill:'drlt_duorui',params:{skills:['browser_f']},lifecycle:{ownerDeath:'remove'}});const two=c.addOwnedMark('drlt_duorui_effect',b,1,{sourceSkill:'drlt_duorui',params:{skills:['browser_g']},lifecycle:{ownerDeath:'remove'}});eq(c.hasSkill('browser_f'),false);eq(c.hasSkill('browser_g'),false);eq(a.hasSkill('browser_f'),true);a.addAdditionalSkill('other-provider',['browser_f']);a.removeSkill('drlt_duorui');eq(c.hasSkill('browser_f'),true);eq(c.hasSkill('browser_g'),false);eq(a.hasSkill('browser_f'),true);eq(c.getOwnedMarks('drlt_duorui_effect',b)[0].id,two.id);eq(c.storage.drlt_duorui,['legacy-array']);return {separateReasons:one.id!==two.id};});
   await test('jiejian real Player relations keep each donor hp threshold',async()=>{const[a,b,c]=world();a.addSkill('mbjiejian');b.addSkill('mbjiejian');c.addOwnedMark('mbjiejian_mark',a,1,{sourceSkill:'mbjiejian',params:{hpAtGrant:4}});c.addOwnedMark('mbjiejian_mark',b,1,{sourceSkill:'mbjiejian',params:{hpAtGrant:2}});eq(c.getOwnedMarks('mbjiejian_mark',a)[0].params.hpAtGrant,4);eq(c.getOwnedMarks('mbjiejian_mark',b)[0].params.hpAtGrant,2);eq(lib.skill.mbjiejian_remove.filter({player:c},a),true);eq(lib.skill.mbjiejian_remove.filter({player:c},b),true);c.consumeOwnedMark('mbjiejian_mark',a,c.getOwnedMarks('mbjiejian_mark',a)[0].id);eq(c.hasOwnedMark('mbjiejian_mark',b),true);});
   await test('yanyu real card conversion uses the suit union and reward filters use the matching owner',async()=>{const[a,b,c]=world();a.addSkill('yj_yanyu');b.addSkill('yj_yanyu');c.addOwnedMark('yj_yanyu_effect',a,1,{sourceSkill:'yj_yanyu',params:{suits:['heart']},lifecycle:{ownerDeath:'retain',bearerDeath:'retain',skillRemoval:'retain'}});c.addOwnedMark('yj_yanyu_effect',b,1,{sourceSkill:'yj_yanyu',params:{suits:['club']},lifecycle:{ownerDeath:'retain',bearerDeath:'retain',skillRemoval:'retain'}});const card=game.createCard('shan','club',7);const event={player:c,card:{name:'sha'},cards:[card]};eq(lib.skill.yj_yanyu_use.filter(event,a),false);eq(lib.skill.yj_yanyu_use.filter(event,b),true);eq(lib.skill.yj_yanyu_fire.mod.cardname(card,c,'shan'),'sha');});
   await test('actual ownedMarks video handler maps saved identities onto new real Players by position',async()=>{let[a,b,c]=world();a.addSkill('drlt_jieying');b.addSkill('drlt_jieying');camp(c,a);camp(c,b);const payload=JSON.parse(JSON.stringify(game.exportOwnedMarkState()));const owner=game.getOwnedMarkIdentity(a),oldPlayer=a;[a,b,c]=world();a.addSkill('drlt_jieying');b.addSkill('drlt_jieying');game.videoContent.ownedMarks(null,payload);eq(game.resolveOwnedMarkPlayer(owner)===a,true);eq(a===oldPlayer,false);eq(c.getOwnedMarks('drlt_jieying_mark').length,2);eq(c.hasOwnedMark('drlt_jieying_mark',a),true);return {actualVideoHandler:true,fullVideoPlayer:false};});
   return out;
  });result.checks.push(...checks);
  // Two entirely separate browser contexts with actual WebSocket bytes.
  const client=await openPage();await setup(client);const wsURL=result.origin.replace('http:','ws:')+'/__audit_wire';
  await client.evaluate(async wsURL=>{const f=window.__ownedBrowser,{game,lib,get}=f;const players=f.world();players.forEach((p,i)=>{delete game.playerMap[p.playerid];p.playerid='wire-'+i;game.playerMap[p.playerid]=p;lib.playerOL[p.playerid]=p;});game.online=true;window.__wireErrors=[];window.__wireReceived=0;const ws=new WebSocket(wsURL+'?role=client');window.__wireSocket=ws;ws.onmessage=e=>{try{const message=JSON.parse(e.data);for(let i=1;i<message.length;i++)message[i]=get.parsedResult(message[i]);lib.message.client[message.shift()].apply(null,message);window.__wireReceived++;}catch(error){window.__wireErrors.push(String(error.stack||error));}};await new Promise((resolve,reject)=>{ws.onopen=resolve;ws.onerror=reject;});},wsURL);
  const hostWire=await host.evaluate(async wsURL=>{const f=window.__ownedBrowser,{game,lib}=f;const players=f.world();players.forEach((p,i)=>{delete game.playerMap[p.playerid];p.playerid='wire-'+i;game.playerMap[p.playerid]=p;lib.playerOL[p.playerid]=p;});const{Client}=await import('/noname/library/element/client.js');const ws=new WebSocket(wsURL+'?role=host');window.__wireSocket=ws;await new Promise((resolve,reject)=>{ws.onopen=resolve;ws.onerror=reject;});const peer=new Client(ws,true);peer.inited=true;lib.node=lib.node||{};lib.node.clients=[peer];players[0].addSkill('drlt_jieying');players[1].addSkill('drlt_jieying');f.camp(players[2],players[0]);f.camp(players[2],players[1]);return {records:players[2].getOwnedMarks('drlt_jieying_mark').map(e=>({id:e.id,owner:e.owner})),total:players[2].countMark('drlt_jieying_mark')};},wsURL);
  try{await client.waitForFunction(()=>window.__ownedBrowser.game.players[2].getOwnedMarks('drlt_jieying_mark').length===2,null,{timeout:5000});}catch{}
  const clientWire=await client.evaluate(()=>{const{game}=window.__ownedBrowser;return {records:game.players[2].getOwnedMarks('drlt_jieying_mark').map(e=>({id:e.id,owner:e.owner})),total:game.players[2].countMark('drlt_jieying_mark'),received:window.__wireReceived,errors:window.__wireErrors};});
  check('real broadcast -> Client.send encoding -> WebSocket relay -> parsedResult/exec -> client ledger',JSON.stringify(hostWire.records)===JSON.stringify(clientWire.records)&&clientWire.total===2&&clientWire.received>0&&clientWire.errors.length===0,{host:hostWire,client:clientWire,transport:'self-built local WebSocket relay; real game Client/encoder/dispatch; no product lobby'});
  const national=await openPage('guozhan');
  await until(national,async()=>{const{lib}=await import('/noname.js');return !!lib.skill.gz_gn_jieying_effect;},undefined,10000);
  await setup(national);
  const nationalChecks=await national.evaluate(async()=>{
   const{lib,game,s,world,run,camp}=window.__ownedBrowser,out=[];
   const assert=(condition,message)=>{if(!condition)throw Error(message);};
   const test=async(name,fn)=>{try{out.push({name,pass:true,details:await fn()});}catch(e){out.push({name,pass:false,details:String(e.stack||e).slice(0,1500)});}};
   await test('actual guozhan mode loads its unbundled runtime skill tree',async()=>{assert(lib.config.mode==='guozhan','wrong mode');assert(typeof lib.skill.gz_gn_jieying.canCreate==='function','old national skill loaded');return {mode:lib.config.mode,modernedModes:lib.config.moderned_modes};});
   await test('national real trigger queue counts the two bearer owners and ignores unrelated skill holders',async()=>{
    const[a,b,c,d]=world();for(const p of[a,b,d])p.addSkill('gz_gn_jieying');camp(c,a,'gz_gn_jieying_mark');camp(c,b,'gz_gn_jieying_mark');
    assert(lib.skill.gz_gn_jieying_mark.mod.cardUsable({name:'sha'},c,1)===3,'slash bonus must be two');assert(lib.skill.gz_gn_jieying.canCreate(d),'another owner camp must not block generation');s.currentPhase=c;let number;
    await run(async()=>{const event=game.createEvent('phaseDraw',false);event.player=c;event.num=2;event.setContent(async event=>{await event.trigger('phaseDrawBegin2');event.finish();});await event;number=event.num;});assert(number===4,'draw queue must add two');return {num:number,realArrangeTrigger:true};
   });
   await test('national return and redeployment move only the chosen owner camp; source loss stays precise',async()=>{
    const[a,b,c]=world();a.addSkill('gz_gn_jieying');b.addSkill('gz_gn_jieying');const record=camp(c,a,'gz_gn_jieying_mark');camp(c,b,'gz_gn_jieying_mark');
    await lib.skill.gz_gn_jieying_effect.content({triggername:'phaseAfter',targets:[c]},{player:c},a);
    assert(a.getOwnedMarks('gz_gn_jieying_mark',a)[0]?.id===record.id,'return changed identity');assert(c.hasOwnedMark('gz_gn_jieying_mark',b),'return cleared foreign camp');assert(!c.hasOwnedMark('gz_gn_jieying_mark',a),'return left old bearer');
    await lib.skill.gz_gn_jieying_effect.content({triggername:'phaseEnd',targets:[c]},{player:a},a);assert(c.hasOwnedMark('gz_gn_jieying_mark',a),'foreign camp prevented redeployment');a.removeSkill('gz_gn_jieying');assert(!c.hasOwnedMark('gz_gn_jieying_mark',a),'source removal left own camp');assert(c.hasOwnedMark('gz_gn_jieying_mark',b),'source removal cleared other owner');return {preservedEffectId:true};
   });
   return out;
  });result.checks.push(...nationalChecks);
 }
}catch(e){result.fatal=String(e.stack||e);check('browser integration completed within deadline',false,result.fatal);}
finally{
 clearTimeout(deadline);await browser?.close().catch(()=>{});for(const socket of sockets)socket.destroy();await new Promise(resolve=>server.close(resolve));
 result.finishedAt=new Date().toISOString();result.wireMessages=wireMessages;result.requests=[...seen].filter(x=>/entry\.js$|^\/character\/(extra|mobile|newjiang)|\/ownedMark|ownedMarks|\/mode\//.test(x));result.passed=result.checks.filter(x=>x.pass).length;result.failed=result.checks.filter(x=>!x.pass).length;result.ok=result.failed===0&&!result.timeout&&!result.fatal&&result.pageErrors.length===0;
 await fs.mkdir(path.dirname(output),{recursive:true});await fs.writeFile(output,JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify({output,ok:result.ok,passed:result.passed,failed:result.failed,checks:result.checks,wireMessages,timeout:result.timeout},null,2));if(!result.ok)process.exitCode=1;
}
