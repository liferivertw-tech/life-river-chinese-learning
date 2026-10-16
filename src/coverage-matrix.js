import {learningPath,resourcesForNode} from './learning-path.js';

export const interfaceLanguages=['zh-TW','en','vi','id','th','fil','ja','ko','my','km','ms','hi','fr','es','de'];

export function coverageCell(catalog,locale,node){
 const {grouped}=resourcesForNode(node,catalog,locale);
 const native=grouped.primary.length;
 const english=grouped.fallback.length;
 const other=grouped.other.length;
 const status=native>0?'native':english>0?'english':'gap';
 return {locale,nodeId:node.id,native,english,other,status,total:native+english+other};
}

export function buildCoverageMatrix(catalog,languages=interfaceLanguages){
 return languages.map(locale=>({
  locale,
  cells:learningPath.map(node=>coverageCell(catalog,locale,node))
 }));
}

export function coverageSummary(catalog,languages=interfaceLanguages){
 const matrix=buildCoverageMatrix(catalog,languages);
 return matrix.map(row=>{
  const native=row.cells.filter(c=>c.status==='native').length;
  const english=row.cells.filter(c=>c.status==='english').length;
  const gaps=row.cells.filter(c=>c.status==='gap').length;
  return {locale:row.locale,native,english,gaps,total:row.cells.length};
 });
}

export function priorityGaps(catalog,languages=interfaceLanguages){
 return buildCoverageMatrix(catalog,languages)
  .flatMap(row=>row.cells.filter(c=>c.status!=='native'))
  .sort((a,b)=>{
   const rank={gap:0,english:1};
   return rank[a.status]-rank[b.status]||a.locale.localeCompare(b.locale)||a.nodeId.localeCompare(b.nodeId);
  });
}
