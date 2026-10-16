import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {verifyCandidateUrl} from '../src/evidence-verifier.js';

const args=process.argv.slice(2);
const arg=(name,fallback)=>args.find(a=>a.startsWith(`--${name}=`))?.split('=').slice(1).join('=')??fallback;
const input=arg('in','review-queue/discovered-resources.json');
const out=arg('out','review-queue/evidence-scan.json');
const limit=Math.max(1,Number(arg('limit',20)));

const inputPath=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..',input);
const source=JSON.parse(await fs.readFile(inputPath,'utf8'));
const items=(source.items??[]).slice(0,limit);
const results=[];
for(const item of items){
  results.push(await verifyCandidateUrl(item));
}

const summary={
 generatedAt:new Date().toISOString(),
 input,
 scanned:results.length,
 strong:results.filter(r=>r.state==='evidence-strong').length,
 possible:results.filter(r=>r.state==='evidence-possible').length,
 notFound:results.filter(r=>r.state==='evidence-not-found').length,
 errors:results.filter(r=>r.state==='error').length
};
const payload={summary,results};
const outPath=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..',out);
await fs.mkdir(path.dirname(outPath),{recursive:true});
await fs.writeFile(outPath,JSON.stringify(payload,null,2)+'\\n');
console.log(JSON.stringify(payload,null,2));
