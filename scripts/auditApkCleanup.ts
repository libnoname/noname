import fs from 'node:fs/promises';
import ts from 'typescript';
import installed from '../apps/core/game/organized-extensions.json';
const key=(n:any)=>n?.text;
function props(n:any){return ts.isObjectLiteralExpression(n??{})?n.properties.map((p:any)=>key(p.name)).filter(Boolean):[];}
function value(n:any,k:string){return n?.properties?.find((p:any)=>key(p.name)===k)?.initializer;}
for(const r of installed.filter(p=>'source' in p&&p.source?.startsWith('apk:')&&(!process.argv[2]||process.argv[2].split(',').includes(p.name)))){
 const src=await fs.readFile(`apps/core/extension/${r.name}/extension.js`,'utf8');
 const ast=ts.createSourceFile('extension.js',src,ts.ScriptTarget.Latest,true,ts.ScriptKind.JS);
 let obj:any;let imports:string[]=[];let writes:string[]=[];
 function visit(n:ts.Node){
  if(ts.isObjectLiteralExpression(n)&&value(n,'name')?.text===r.name&&props(n).includes('package'))obj=n;
  if(ts.isCallExpression(n)&&n.expression.getText(ast)==='game.import')imports.push(n.arguments[0]?.getText(ast));
  if(ts.isBinaryExpression(n)&&n.operatorToken.kind===ts.SyntaxKind.EqualsToken&&/^(lib\.(character|skill)|game\.|ui\.)/.test(n.left.getText(ast)))writes.push(n.left.getText(ast));
  ts.forEachChild(n,visit);
 }visit(ast);
 const pack=value(obj,'package');
 const summary:any={name:r.name,chars:r.characters,staticChars:props(value(value(pack,'character'),'character')),cards:props(value(value(pack,'card'),'card')),skills:props(value(value(pack,'skill'),'skill')),config:props(value(obj,'config')),hooks:['content','precontent'].map(k=>[k,value(obj,k)?.getText(ast).slice(0,220)]),imports,writes:[...new Set(writes)].slice(0,24)};
 if(process.argv[2]){
  const calls=new Set<string>();
  function scan(n:ts.Node){if(ts.isCallExpression(n))calls.add(n.expression.getText(ast));ts.forEachChild(n,scan);}if(pack)scan(pack);
  console.log(JSON.stringify({name:r.name,calls:[...calls].filter(s=>/^(game\.|lib\.|get\.|dcdAnim|skinSwitch|decadeUI|Tts|player\.)/.test(s)).map(s=>s.slice(0,90))}));
  for(const k of ['content','precontent']){const f=value(obj,k);console.log(k);for(const s of f?.body?.statements||[])console.log(s.getText(ast).slice(0,280).replace(/\s+/g,' '));}
 }else console.log(JSON.stringify(summary));
}
