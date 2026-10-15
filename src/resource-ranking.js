// Explicit teaching-language metadata only. Unknown languages must never be inferred.
export function teachingLanguages(resource){return Array.isArray(resource.teachingLanguages)?resource.teachingLanguages:[];}
export function groupResources(rows,locale){
 const primary=rows.filter(r=>teachingLanguages(r).includes(locale));
 const fallback=locale==='en'?[]:rows.filter(r=>!teachingLanguages(r).includes(locale)&&teachingLanguages(r).includes('en'));
 const other=rows.filter(r=>!primary.includes(r)&&!fallback.includes(r));
 return {primary,fallback,other};
}
