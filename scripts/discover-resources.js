import fs from 'node:fs/promises';
import {catalog} from '../src/catalog.js';
import {learningPath} from '../src/learning-path.js';
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
const nodeMap=Object.fromEntries(learningPath.map(node=>[node.id,node]));
const queue=[];
const errors=[];
let searched=0;

for(const task of tasks){
  const enriched={...task,level:nodeMap[task.nodeId]?.level??'待核驗'};
  for(const query of enriched.queries.slice(0,queriesPerTask)){
    try{
      const result=await searchWeb(query,{provider});
      searched++;
      if(result.skipped)continue;
      for(const candidate of mapProviderResults(result.provider,result.results,enriched)){
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

await fs.mkdir(new URL('../'+out,import.meta.url),{recursive:true}).catch(()=>{});
await fs.writeFile(new URL('../'+out,import.meta.url),JSON.stringify(payload,null,2)+'\\n');
console.log(JSON.stringify(payload,null,2));
