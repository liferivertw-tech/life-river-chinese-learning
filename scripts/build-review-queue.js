import {writeFile} from 'node:fs/promises';
import {catalog} from '../src/catalog.js';
import {interfaceLanguages} from '../src/coverage-matrix.js';
import {buildDiscoveryTasks} from '../src/resource-collector.js';

const tasks=buildDiscoveryTasks(catalog,interfaceLanguages);
const payload={
 generatedAt:new Date().toISOString(),
 source:'BUILD 18 coverage matrix',
 count:tasks.length,
 highPriority:tasks.filter(t=>t.priority==='high').length,
 mediumPriority:tasks.filter(t=>t.priority==='medium').length,
 tasks
};
const json=JSON.stringify(payload,null,2)+'\n';
const output=process.argv[2];
if(output){
 await writeFile(output,json,'utf8');
 console.log(`Wrote ${tasks.length} discovery tasks to ${output}`);
}else{
 process.stdout.write(json);
}
