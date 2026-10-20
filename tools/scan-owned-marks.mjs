// Repeatable lexical inventory; classifications are reviewed decisions, not regex bug claims.
import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
const repo=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const output=process.argv[2]??process.env.OWNED_MARK_RESULTS??path.resolve(repo,'audit/mark-ownership-implementation');
fs.mkdirSync(output,{recursive:true});
const files=execFileSync('git',['ls-files','-z'],{cwd:repo,encoding:'utf8'}).split('\0').filter(p=>/\.(?:[cm]?js|tsx?)$/.test(p));
const groups={legacyMark:/\b(?:addMark|removeMark|clearMark|setMark|countMark|hasMark|markAuto|unmarkAuto|markSkill|unmarkSkill)\s*\(/,ownedMark:/\b(?:addOwnedMark|removeOwnedMark|consumeOwnedMark|transferOwnedMark|clearOwnedMarks|countOwnedMark|hasOwnedMark|getOwnedMarks|getMarkOwners|updateOwnedMark|mergeOwnedMarks)\s*\(/,storage:/\b(?:storage|getStorage|setStorage|syncStorage)\b/,indirect:/\b(?:addAdditionalSkill|removeAdditionalSkill|addTempSkill|removeSkill|playerid|gaintag)\b/,lifecycle:/\b(?:onremove|onunmark|dieAfter|dieBegin|reinit|uninit|onOwnedMarkChange)\b/};
const stats={},hits=[];
for(const file of files){if(!fs.existsSync(path.join(repo,file)))continue;const lines=fs.readFileSync(path.join(repo,file),'utf8').split(/\r?\n/);for(let i=0;i<lines.length;i++)for(const[k,re]of Object.entries(groups))if(re.test(lines[i])){hits.push({kind:k,path:file,line:i+1,text:lines[i].trim()});stats[k]??={hits:0,files:new Set()};stats[k].hits++;stats[k].files.add(file);}}
const decisions={migrated:['drlt_jieying','gz_gn_jieying','mbjiejian','yj_yanyu','drlt_duorui'],sharedCleanupFixed:['yichong'],sharedRetained:['new_wuhun','zongkui','guju','baijia','bmcanshi','yingba','scfuhai','pinghe','xinfu_xionghuo','jsrgzhenglve','jsrghuilie','jsrgpingrong','dcjizhong','dcrihui','dcguangshi','equan'],selfResourceRetained:['baonu','renjie','nzry_junlve'],existingSourceMechanismsRetained:['dawu','kuangfeng','gz_dawu','suizheng','shefujing','mbpanxiang','twxianyuan'],needsSeparateSemanticReview:['dcshengdu','yijiao','sbxuanhuo','jdsbxuanhuo','yujue','twyujue','maihuo','mjweipo','zuoxing','dcsilve']};
const summary={baseline:'3e72c4b7980050c3b7d58adc53d232b64bb00791',head:execFileSync('git',['rev-parse','HEAD'],{cwd:repo,encoding:'utf8'}).trim(),trackedSourceFiles:files.length,groups:Object.fromEntries(Object.entries(stats).map(([k,v])=>[k,{hits:v.hits,files:v.files.size}])),decisions,limits:['All tracked text source searched; not all hits manually verified.','Computed keys, aliases, physical-card gaintags, expansion relations and third-party extensions are not proven safe.','Shared and existing-source lists do not imply all lifecycle variants passed integration tests.','New untracked tooling is not counted until committed.']};
fs.writeFileSync(path.join(output,'implementation-scan-hits.jsonl'),hits.map(x=>JSON.stringify(x)).join('\n')+'\n');
fs.writeFileSync(path.join(output,'implementation-scan-summary.json'),JSON.stringify(summary,null,2)+'\n');
console.log(JSON.stringify(summary,null,2));
