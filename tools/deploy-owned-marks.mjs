// P0 review: build a core-only preview. Live deployment is frozen for architecture review.
// Historical deployment/backups remain available at the previous commit.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
const repo=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
if(process.argv.includes('--apply'))throw Error('P0 review freeze: use --preview=<directory>; live deployment requires the revised design to be approved.');
const workspace=path.resolve(repo,'../..');
const release=path.resolve(process.env.OWNED_MARK_RELEASE??path.join(workspace,'resources/app'));
if(!fs.existsSync(path.join(release,'noname/library/element/player.js')))throw Error('Set OWNED_MARK_RELEASE to the release resources/app directory.');
const audit=path.resolve(process.env.OWNED_MARK_RESULTS??path.join(workspace,'audit/mark-ownership-implementation'));
const require=createRequire(import.meta.url),ts=require('typescript');
let esbuild;
if(process.env.OWNED_MARK_ESBUILD)esbuild=require(process.env.OWNED_MARK_ESBUILD);
else {try {esbuild=require('esbuild');}catch {esbuild=require(path.join(process.env.USERPROFILE,'node_modules/.pnpm/esbuild@0.28.2/node_modules/esbuild'));}}
const baseline='3e72c4b7980050c3b7d58adc53d232b64bb00791';
const hash=v=>crypto.createHash('sha256').update(v).digest('hex');
const lastPath=path.join(audit,'deployment.json');
const last=fs.existsSync(lastPath)?JSON.parse(fs.readFileSync(lastPath,'utf8')):null;
function originalTarget(dest){
 const current=fs.readFileSync(dest),relative=path.relative(release,dest).replaceAll('\\','/'),entry=last?.files.find(f=>f.path===relative);
 if(!entry)return current.toString('utf8');
 if(hash(current)!==entry.afterSha256)throw Error('Release changed since deployment; preserve and review before overwriting '+relative);
 const original=path.join(last.originalBackup??last.backup,relative);
 return fs.readFileSync(original,'utf8');
}
const parse=(s)=>ts.createSourceFile('module.ts',s,ts.ScriptTarget.Latest,true,ts.ScriptKind.TS);
const print=ts.createPrinter({removeComments:true});
const signature=(n,sf)=>print.printNode(ts.EmitHint.Unspecified,n,sf).replace(/\r\n/g,'\n');
const name=n=>n.name && (ts.isIdentifier(n.name)||ts.isStringLiteral(n.name)||ts.isNumericLiteral(n.name))?n.name.text:undefined;
function shape(n) {
 if(ts.isClassDeclaration(n))return {kind:'class',nodes:n.members};
 const value=n.initializer??(ts.isPropertyAssignment(n)?n.initializer:undefined)??(ts.isExportAssignment(n)?n.expression:undefined);
 if(value&&ts.isObjectLiteralExpression(value))return {kind:'object',nodes:value.properties,node:value};
 if(ts.isObjectLiteralExpression(n))return {kind:'object',nodes:n.properties,node:n};
}
function roots(sf){const result=new Map();for(const s of sf.statements){if(ts.isClassDeclaration(s)&&s.name)result.set(s.name.text,s);if(ts.isVariableStatement(s))for(const d of s.declarationList.declarations)if(name(d)&&shape(d))result.set(name(d),d);if(ts.isExportAssignment(s)&&shape(s))result.set('default',s);}return result;}
function compileMember(node,sf,kind){const raw=node.getText(sf);const wrapped=kind==='class'?`class __OwnedPatch {${raw}\n}`:`const __OwnedPatch={${raw}\n};`;const code=esbuild.transformSync(wrapped,{loader:'ts',target:['chrome91','safari16.4'],format:'esm',legalComments:'none'}).code;const ast=parse(code),container=roots(ast).get('__OwnedPatch');const child=shape(container).nodes.find(x=>name(x)===name(node));if(!child)throw Error('Cannot compile member '+name(node));return child.getText(ast);}
function patchMembers(baseText,newText,targetText,{compiled=false,label}={}){
 const base=parse(baseText),fresh=parse(newText),target=parse(targetText),br=roots(base),nr=roots(fresh),tr=roots(target),edits=[],changes=[],conflicts=[];
 function visit(oldNode,newNode,targetNode,trail){
  const a=shape(oldNode),b=shape(newNode),t=shape(targetNode);
  if(!a||!b||!t||a.kind!==b.kind||b.kind!==t.kind)throw Error('Container mismatch '+trail);
  const oldChildren=new Map(a.nodes.map(x=>[name(x),x]).filter(([k])=>k)),newChildren=new Map(b.nodes.map(x=>[name(x),x]).filter(([k])=>k)),targetChildren=new Map(t.nodes.map(x=>[name(x),x]).filter(([k])=>k)),added=[];
  for(const [key,next]of newChildren){const previous=oldChildren.get(key),dest=targetChildren.get(key);const childTrail=trail+'.'+key;
   if(!previous){if(dest){if(signature(dest,target)!==signature(next,fresh))throw Error('New member already exists with another implementation '+childTrail);continue;}added.push(compiled?compileMember(next,fresh,b.kind):next.getText(fresh));changes.push(childTrail);continue;}
   if(signature(previous,base)===signature(next,fresh))continue;
   if(!dest)throw Error('Missing destination '+childTrail);
   if(shape(previous)&&shape(next)&&shape(dest)){visit(previous,next,dest,childTrail);continue;}
   const replacement=compiled?compileMember(next,fresh,b.kind):next.getText(fresh);
   if(!compiled&&signature(previous,base)!==signature(dest,target)&&signature(next,fresh)!==signature(dest,target))conflicts.push(childTrail);
   edits.push({start:dest.getStart(target),end:dest.end,text:replacement});changes.push(childTrail);
  }
  for(const [key,previous]of oldChildren)if(!newChildren.has(key)){
   const dest=targetChildren.get(key);if(!dest)continue;
   if(!compiled&&signature(previous,base)!==signature(dest,target))conflicts.push(trail+'.'+key);
   let start=dest.getStart(target),end=dest.end;
   if(t.kind==='object'){
    if(targetText[end]===',')end++;
    else {const index=t.nodes.indexOf(dest);if(index>0)start=t.nodes[index-1].end;}
   }
   edits.push({start,end,text:''});changes.push(trail+'.'+key+' (removed)');
  }
  if(added.length){const parent=t.node??targetNode,pos=parent.end-1;let prefix='';if(t.kind==='object'&&t.nodes.length&&!t.nodes.hasTrailingComma)prefix=',';edits.push({start:pos,end:pos,text:prefix+'\n'+added.join(t.kind==='class'?'\n':',\n')+(t.kind==='class'?'':',')+'\n'});}
 }
 for(const [key,next]of nr){const prev=br.get(key);if(!prev)continue;const dest=tr.get(key);if(!dest)throw Error('Missing root '+label+':'+key);visit(prev,next,dest,key);}
 if(conflicts.length)throw Error('Local source member conflict (not overwritten): '+label+' '+conflicts.join(','));
 edits.sort((a,b)=>b.start-a.start||b.end-a.end);for(const edit of edits)targetText=targetText.slice(0,edit.start)+edit.text+targetText.slice(edit.end);
 return {text:targetText,changes};
}
const outputs=new Map(),operations=[];
function update(relative,text,changes){const dest=path.join(release,relative);if(!dest.startsWith(release+path.sep))throw Error('Outside release');outputs.set(dest,text);operations.push({path:relative,changes});}
const targets=[
 ['noname/library/element/player.js','src/noname/library/element/player.js','noname/library/element/player.js'],
 ['noname/game/index.js','src/noname/game/index.js','noname/game/index.js'],
 ['noname/get/index.js','src/noname/get/index.js','noname/get/index.js'],
 ['noname/library/index.js','src/noname/library/index.js','noname/library/index.js'],
 ['noname/library/element/content.ts','src/noname/library/element/content.ts','noname/library/element/content.js'],
 ['noname/library/element/gameEvent.ts','src/noname/library/element/gameEvent.ts','noname/library/element/gameEvent.js'],
 ['noname/library/element/GameEvent/compilers/ArrayCompiler.ts','src/noname/library/element/GameEvent/compilers/ArrayCompiler.ts','noname/library/element/GameEvent/compilers/ArrayCompiler.js'],
];
for(const [file,local,runtime]of targets){
 const gitPath='apps/core/'+file,base=execFileSync('git',['show',`${baseline}:${gitPath}`],{cwd:repo,encoding:'utf8',maxBuffer:8e6}),fresh=fs.readFileSync(path.join(repo,gitPath),'utf8');
 for(const [target,compiled]of [[local,false],...(runtime?[[runtime,true]]:[])]){
  const dest=path.join(release,target),original=outputs.get(dest)??originalTarget(dest);
  const result=patchMembers(base,fresh,original,{compiled,label:target});
  let text=result.text;
  if(file==='noname/game/index.js'){
   const start=fresh.indexOf('const markCompatibilityMethods ='),end=fresh.indexOf('export class Game',start);if(start<0||end<0)throw Error('Missing adapter wiring');
   const wiring='import { OwnedMarkStore } from "../library/element/ownedMarkStore.js";\nimport { createOwnedMarkMethods } from "./ownedMarks.js";\nimport { createMarkCompatibilityMethods } from "./markCompatibility.js";\n'+fresh.slice(start,end)+'\n';
   if(!text.includes('const ownedMarkMethods ='))text=wiring+text;
  }
  if(file==='noname/get/index.js'&&!text.includes('import { appendOwnedMarkIntro }'))text='import { appendOwnedMarkIntro } from "./ownedMarkIntro.js";\n'+text;
  if(file.endsWith('/ArrayCompiler.ts')&&!/import\s*\{[^}]*\bgame\b[^}]*\}/.test(text))text='import { game } from "noname";\n'+text;
  update(target,text,result.changes);
 }
}
for(const file of ['noname/library/element/ownedMarkStore.js','noname/game/ownedMarks.js','noname/game/markCompatibility.js','noname/get/ownedMarkIntro.js']){
 const fresh=fs.readFileSync(path.join(repo,'apps/core',file),'utf8');
 for(const target of ['src/'+file,file])update(target,target.startsWith('src/')?fresh:esbuild.transformSync(fresh,{loader:'js',target:['chrome91','safari16.4'],format:'esm',legalComments:'none'}).code,['new module']);
}
const manifest={baseline,head:execFileSync('git',['rev-parse','HEAD'],{cwd:repo,encoding:'utf8'}).trim(),mode:process.argv.includes('--apply')?'applied':'dry-run',release,operations,files:[]};
const previewArgument=process.argv.find(arg=>arg.startsWith('--preview='));
if(previewArgument&&process.argv.includes('--apply'))throw Error('Preview cannot apply to the live release');
for(const [dest,text]of outputs){
 const before=fs.existsSync(dest)?fs.readFileSync(dest):null;
 const previous=last?.files.find(f=>f.path===path.relative(release,dest).replaceAll('\\','/'));
 if(previous&&(!before||hash(before)!==previous.afterSha256))throw Error('Release file was externally modified after deployment: '+dest);
 const parsed=parse(text);if(parsed.parseDiagnostics.length)throw Error('Syntax error '+dest+': '+parsed.parseDiagnostics.map(d=>d.messageText).join(','));
 manifest.files.push({path:path.relative(release,dest).replaceAll('\\','/'),beforeSha256:before&&hash(before),afterSha256:hash(text),changed:!before||hash(before)!==hash(text)});
}
if(previewArgument){
 const preview=path.resolve(previewArgument.slice('--preview='.length));fs.mkdirSync(preview,{recursive:true});manifest.mode='preview';manifest.preview=preview;
 for(const [dest,text]of outputs){const relative=path.relative(release,dest).replaceAll('\\','/');if(!relative.startsWith('noname/')&&!relative.startsWith('src/noname/'))continue;const file=path.join(preview,relative);fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,text);}
 fs.writeFileSync(path.join(preview,'preview.json'),JSON.stringify(manifest,null,2));
}
if(process.argv.includes('--apply')){
 const backup=path.join(audit,'backups',String(Date.now()));fs.mkdirSync(backup,{recursive:true});manifest.backup=backup;manifest.originalBackup=last?.originalBackup??last?.backup??backup;
 for(const [dest,text]of outputs){const relative=path.relative(release,dest),saved=path.join(backup,relative);fs.mkdirSync(path.dirname(saved),{recursive:true});if(fs.existsSync(dest))fs.copyFileSync(dest,saved);fs.mkdirSync(path.dirname(dest),{recursive:true});fs.writeFileSync(dest,text,'utf8');}
 fs.writeFileSync(path.join(backup,'deployment.json'),JSON.stringify(manifest,null,2));
 fs.mkdirSync(audit,{recursive:true});fs.writeFileSync(lastPath,JSON.stringify(manifest,null,2));
}
console.log(JSON.stringify(manifest,null,2));
