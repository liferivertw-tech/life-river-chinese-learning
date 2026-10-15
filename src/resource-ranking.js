// Resource language must be confirmed from actual teaching content, not site menus.
export function teachingLanguages(resource){
 return resource.languageVerified===true && Array.isArray(resource.teachingLanguages)
  ? resource.teachingLanguages : [];
}
export function groupResources(rows,locale){
 const primary=[],fallback=[],other=[];
 for(const r of rows){
  const languages=teachingLanguages(r);
  if(languages.includes(locale))primary.push(r);
  else if(locale!=='en'&&languages.includes('en'))fallback.push(r);
  else other.push(r);
 }
 return {primary,fallback,other};
}
export function matchResource(resource,term,categoryName=''){
 const q=term.trim().toLocaleLowerCase();
 if(!q)return true;
 return [resource.title,resource.provider,resource.summary,resource.category,categoryName,...(resource.tags??[])]
  .some(v=>String(v??'').toLocaleLowerCase().includes(q));
}
