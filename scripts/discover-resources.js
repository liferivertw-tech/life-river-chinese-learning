import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {catalog} from '../src/catalog.js';
import {buildDiscoveryTasks,queueCandidate} from '../src/resource-collector.js';
import {mapProviderResults,searchWeb} from '../src/search-adapters.js';

const args=process.argv.slice(2);
const arg=(name,fallback)=>args.find(a=>a.startsWith(`--${name}=`))?.split('=').slice(1).join('=')??fallback;
const provider=arg('provider',undefined);
const locale=arg('locale',undefined);
const maxTasks=Math.max(1,Number(arg('max-tasks',10)));
const queriesPerTask=Math.max(1,Math.min(3,Number(arg('queries-per-task',1))));
const out=arg('out','review-queue/discovered-resources.json');

const tasks=buildDiscoveryTasks(catalog,locale?[locale]:undefined).slice(0,maxTasks);
const queue=[];
const errors=[];
let searched=0;

for(const task of tasks){
  for(const query of task.queries.slice(0,queriesPerTask)){
    try{
      const result=await searchWeb(query,{provider});
      searched++;
      if(result.skipped)continue;
      for(const candidate of mapProviderResults(result.provider,result.results,task)){
        const queued=queueCandidate(candidate,catalog,queue);
        if(queued.accepted)queue.push(queued.item);
      }
    }catch(error){
      errors.push({taskId:task.id,query,error:String(error)});
    }
  }
}

const payload={
  generatedAt:new Date().toISOString(),
  provider:provider??process.env.SEARCH_PROVIDER??'auto',
  tasksRequested:tasks.length,
  searchesCompleted:searched,
  candidatesAccepted:queue.length,
  errors,
  items:queue
};

const outputPath=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..',out);
await fs.mkdir(path.dirname(outputPath),{recursive:true});
await fs.writeFile(outputPath,JSON.stringify(payload,null,2)+'\n');
console.log(JSON.stringify(payload,null,2));
