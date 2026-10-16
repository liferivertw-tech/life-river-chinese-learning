import {groupResources} from './resource-ranking.js';

export const learningPath=[
 {id:'sound',order:1,title:'發音、聲調、拼音',icon:'🎙️',level:'零基礎',categories:['pronunciation','pinyin'],goals:['辨認四聲與輕聲','建立拼音與聲音的連結','能跟讀常用音節']},
 {id:'characters',order:2,title:'漢字、筆畫、部首',icon:'字',level:'零基礎～初級',categories:['characters','zhuyin'],goals:['認識基本筆畫與筆順','用部首建立字形記憶','理解繁體字與注音入口']},
 {id:'basics',order:3,title:'基礎詞彙與句型',icon:'📖',level:'入門～初級',categories:['vocabulary','grammar'],goals:['累積高頻生活詞彙','掌握基本語序與句型','能完成簡短自我表達']},
 {id:'skills',order:4,title:'聽說讀寫',icon:'🎧',level:'初級～中級',categories:['listening','reading'],goals:['提升聽辨與口說反應','閱讀短文與實用資訊','進行簡短書寫']},
 {id:'taiwan',order:5,title:'臺灣生活中文',icon:'🏮',level:'入門～中級',categories:['daily'],goals:['處理交通、購物、就醫等情境','理解臺灣常用語與生活標示','把語言能力帶入真實生活']},
 {id:'work-study',order:6,title:'職場與就學',icon:'💼',level:'初級～中高級',categories:['work'],goals:['理解工作與校園常用語','準備面試、報到與行政溝通','銜接專業領域中文']},
 {id:'traditional',order:7,title:'繁體中文與注音',icon:'ㄅ',level:'全級',categories:['zhuyin','characters'],goals:['熟悉臺灣繁體中文環境','學會注音作為查字與發音輔助','辨識臺灣常見字詞形式']},
 {id:'tocfl',order:8,title:'TOCFL',icon:'🎓',level:'全級',categories:['tocfl','courses'],goals:['了解 TOCFL 分級與題型','依程度找到準備資源','用檢定結果回頭調整學習路徑']}
];

export function resourcesForNode(node,catalog,locale){
 const rows=catalog.filter(r=>node.categories.includes(r.category));
 const grouped=groupResources(rows,locale);
 return {rows,grouped,ordered:[...grouped.primary,...grouped.fallback,...grouped.other]};
}

export function learningPathStats(catalog,locale){
 return learningPath.map(node=>{
  const {rows,grouped}=resourcesForNode(node,catalog,locale);
  return {id:node.id,total:rows.length,native:grouped.primary.length,english:grouped.fallback.length,other:grouped.other.length};
 });
}
