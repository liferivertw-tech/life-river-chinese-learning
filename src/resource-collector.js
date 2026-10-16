import {priorityGaps} from './coverage-matrix.js';
import {learningPath} from './learning-path.js';

const languageSearchNames={
 'zh-TW':'Traditional Chinese','en':'English','vi':'Vietnamese','id':'Indonesian','th':'Thai','fil':'Tagalog','ja':'Japanese','ko':'Korean','my':'Burmese','km':'Khmer','ms':'Malay','hi':'Hindi','fr':'French','es':'Spanish','de':'German'
};

export function buildDiscoveryTasks(catalog,languages){
 const nodeMap=Object.fromEntries(learningPath.map(n=>[n.id,n]));
 return priorityGaps(catalog,languages).map((gap,index)=>{
  const node=nodeMap[gap.nodeId];
  const language=languageSearchNames[gap.locale]??gap.locale;
  const topic=node.title;
  return {
   id:`discover-${String(index+1).padStart(3,'0')}-${gap.locale}-${gap.nodeId}`,
   locale:gap.locale,
   nodeId:gap.nodeId,
   categories:[...node.categories],
   level:node.level,
   currentStatus:gap.status,
   priority:gap.status==='gap'?'high':'medium',
   queries:[
    `learn Mandarin ${topic} ${language}`,
    `Chinese learning ${topic} ${language}`,
    `${language} Mandarin course ${topic}`
   ],
   state:'queued'
  };
 });
}

export function normalizeUrl(value){
 try{
  const url=new URL(value);
  url.hash='';
  url.hostname=url.hostname.toLowerCase();
  // Preserve trailing slashes; URL parsing already canonicalizes the host and root path.
  for(const key of [...url.searchParams.keys()]){
   if(/^utm_/i.test(key)||['fbclid','gclid'].includes(key))url.searchParams.delete(key);
  }
  return url.toString();
 }catch{return null;}
}

export function isDuplicateCandidate(candidate,catalog,queue=[]){
 const normalized=normalizeUrl(candidate.url);
 if(!normalized)return true;
 const existing=[...catalog,...queue].map(x=>normalizeUrl(x.url)).filter(Boolean);
 return existing.includes(normalized);
}

export function validateCandidate(candidate){
 const issues=[];
 if(!candidate?.title)issues.push('missing-title');
 if(!normalizeUrl(candidate?.url))issues.push('invalid-url');
 if(!candidate?.provider)issues.push('missing-provider');
 if(!candidate?.category)issues.push('missing-category');
 if(!candidate?.level)issues.push('missing-level');
 const teachingLanguages=Array.isArray(candidate?.teachingLanguages)?candidate.teachingLanguages:[];
 if(teachingLanguages.length===0&&!candidate?.languageClaimed)issues.push('missing-teaching-language');
 if(candidate?.languageVerified===true&&!candidate?.languageEvidenceUrl)issues.push('verified-without-language-evidence');
 if(candidate?.languageVerified===true&&!candidate?.checkedAt)issues.push('verified-without-check-date');
 return {valid:issues.length===0,issues};
}

export function queueCandidate(candidate,catalog,queue=[]){
 if(isDuplicateCandidate(candidate,catalog,queue))return {accepted:false,reason:'duplicate-or-invalid-url'};
 const validation=validateCandidate(candidate);
 if(!validation.valid)return {accepted:false,reason:'validation-failed',issues:validation.issues};
 const status=candidate.languageVerified===true?'ready-for-editorial-review':'needs-language-verification';
 return {accepted:true,item:{...candidate,url:normalizeUrl(candidate.url),reviewStatus:status}};
}

export function promoteCandidate(candidate){
 const validation=validateCandidate(candidate);
 if(!validation.valid||candidate.languageVerified!==true)return null;
 return {
  ...candidate,
  url:normalizeUrl(candidate.url),
  status:'verified',
  license:candidate.license??'link-only'
 };
}
