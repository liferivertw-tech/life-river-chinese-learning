import {catalog,categories} from '../src/catalog.js';
const validCategories=new Set(categories.map(([id])=>id));
const ids=new Set();
const errors=[],warnings=[];
for(const r of catalog){
 if(!r.id||ids.has(r.id))errors.push('Duplicate/missing id: '+r.id);
 ids.add(r.id);
 if(!validCategories.has(r.category))errors.push(r.id+': invalid category');
 try{const u=new URL(r.url);if(u.protocol!=='https:')errors.push(r.id+': URL must use https');}catch{errors.push(r.id+': invalid URL');}
 if(r.languageVerified===true&&(!r.languageEvidenceUrl||!r.teachingLanguages?.length))errors.push(r.id+': verified teaching language needs evidence URL and languages');
 if(r.languageVerified!==true&&r.teachingLanguages?.length)warnings.push(r.id+': unverified teaching languages will be ignored');
 if(r.status==='candidate')warnings.push(r.id+': candidate; not approved for featured placement');
 if(!r.checkedAt)warnings.push(r.id+': missing review date');
}
console.log(JSON.stringify({total:catalog.length,errors,warnings},null,2));
if(errors.length)process.exitCode=1;
