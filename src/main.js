import './style.css';
import {catalog,categories} from './catalog.js';
import {groupResources,matchResource} from './resource-ranking.js';
import {homepageMessages} from './homepage-i18n.js';
import {homepageFlow,flowLocales as homepageLocales} from './homepage-flow-i18n.js';
import {learningPath} from './learning-path.js';
import {coverageSummary} from './coverage-matrix.js';
import {renderShell} from './ui-shell.js';
import {onboardingI18n} from './onboarding-i18n.js';
import {recommendationI18n} from './recommendation-i18n.js';
import {loadPreferences,savePreferences,defaultsForNativeLanguage,preferenceOptions} from './learner-preferences.js';
import {presentExample,examplePreview} from './dual-script-examples.js';
import {taiwanLanguageVarieties,taiwanSpeechSources,speechRightsRules} from './taiwan-language-resources.js';
import {convertChineseText,createStrokeWriter} from './hanzi-opencc.js';

const langs=[['zh-TW','繁體中文'],['zh-CN','简体中文（中国大陆）'],['en','English'],['vi','Tiếng Việt'],['id','Bahasa Indonesia'],['th','ไทย'],['fil','Filipino'],['ja','日本語'],['ko','한국어'],['my','မြန်မာ'],['km','ភាសាខ្មែរ'],['ms','Bahasa Melayu'],['hi','हिन्दी'],['fr','Français'],['es','Español'],['de','Deutsch']];
const goalMap={zero:['sound'],daily:['taiwan'],speaking:['skills'],literacy:['characters','reading'],taiwan:['taiwan'],work:['work-study'],traditional:['traditional'],tocfl:['tocfl']};
const goalEntries=[['zero','🧭'],['daily','🛍️'],['speaking','🎧'],['literacy','📚'],['taiwan','🏮'],['work','💼'],['traditional','ㄅ'],['tocfl','🎓']];
const qs=s=>document.querySelector(s),qsAll=s=>document.querySelectorAll(s);
let currentLocale='zh-TW',ui={},selectedGoal=null,selectedLevel='入門';
let learnerPreferences=loadPreferences(globalThis.localStorage);
const brandLabels={
 'zh-TW':['LIFE RIVER · 中文學習資源網','生命河｜中文學習資源網'],
 'zh-CN':['LIFE RIVER · 中文学习资源网','生命河｜中文学习资源网'],
 en:['LIFE RIVER · CHINESE LEARNING HUB','LIFE RIVER · Chinese Learning Hub'],
 vi:['LIFE RIVER · TRUNG TÂM HỌC TIẾNG TRUNG','LIFE RIVER · Trung tâm học tiếng Trung'],
 id:['LIFE RIVER · PUSAT BELAJAR MANDARIN','LIFE RIVER · Pusat Belajar Mandarin'],
 th:['LIFE RIVER · ศูนย์เรียนภาษาจีน','LIFE RIVER · ศูนย์เรียนภาษาจีน'],
 fil:['LIFE RIVER · CHINESE LEARNING HUB','LIFE RIVER · Sentro ng Pag-aaral ng Chinese'],
 ja:['LIFE RIVER · 中国語学習リソース','LIFE RIVER · 中国語学習リソース網'],
 ko:['LIFE RIVER · 중국어 학습 리소스 허브','LIFE RIVER · 중국어 학습 리소스 허브'],
 my:['LIFE RIVER · တရုတ်ဘာသာ လေ့လာရေးအရင်းအမြစ်','LIFE RIVER · တရုတ်ဘာသာ လေ့လာရေးအရင်းအမြစ်'],
 km:['LIFE RIVER · មជ្ឈមណ្ឌលធនធានរៀនភាសាចិន','LIFE RIVER · មជ្ឈមណ្ឌលរៀនភាសាចិន'],
 ms:['LIFE RIVER · HAB PEMBELAJARAN BAHASA CINA','LIFE RIVER · Hab Pembelajaran Bahasa Cina'],
 hi:['LIFE RIVER · चीनी अध्ययन संसाधन केंद्र','LIFE RIVER · चीनी अध्ययन संसाधन केंद्र'],
 fr:['LIFE RIVER · CENTRE DE RESSOURCES DE CHINOIS','LIFE RIVER · Centre de ressources de chinois'],
 es:['LIFE RIVER · CENTRO DE RECURSOS DE CHINO','LIFE RIVER · Centro de recursos de chino'],
 de:['LIFE RIVER · CHINESISCH-LERNZENTRUM','LIFE RIVER · Chinesisch-Lernzentrum']
};
renderShell(qs('#app'),categories);
const langSelect=qs('#lang');
langs.forEach(([code,name])=>{const o=document.createElement('option');o.value=code;o.textContent=name;langSelect.append(o);});
const query=qs('#searchInput'),category=qs('#categoryFilter'),level=qs('#levelFilter'),results=qs('#resourceResults');

function localCategory(id){return ui.categoryNames&&ui.categoryNames[id]||id}
function localCost(value){return ui.costMap&&ui.costMap[value]||value}
function localLevel(value){return ui.levels&&ui.levels[value]||value}
function localScript(value){return ui.scriptMap&&ui.scriptMap[value]||value}
function resourceGroup(rows){return groupResources(rows,currentLocale)}
function nodesForGoal(goal){const ids=new Set(goalMap[goal]||[]);return learningPath.filter(n=>ids.has(n.id))}
function resourceLevelScore(resource,level){
 const value=String(resource.level||'');
 if(level==='入門')return /入門|零基礎/.test(value)?4:/初級/.test(value)?2:/全級|多級/.test(value)?1:0;
 if(level==='初級')return /初級/.test(value)?4:/入門/.test(value)?2:/中級|全級|多級/.test(value)?1:0;
 if(level==='中級')return /中級/.test(value)?4:/初級/.test(value)?2:/高級|全級|多級/.test(value)?1:0;
 if(level==='高級')return /高級|中高級/.test(value)?4:/中級/.test(value)?2:/全級|多級/.test(value)?1:0;
 return /全級|多級/.test(value)?4:1;
}
function featuredResources(){
 let rows=catalog.slice();
 if(selectedGoal){
  const cats=new Set(nodesForGoal(selectedGoal).flatMap(n=>n.categories));
  rows=rows.filter(r=>cats.has(r.category));
 }
 rows.sort((a,b)=>resourceLevelScore(b,selectedLevel)-resourceLevelScore(a,selectedLevel));
 const g=resourceGroup(rows),primary=g.primary.slice(0,6),fallback=g.fallback.slice(0,Math.max(0,6-primary.length));
 return {primary,fallback,level:selectedLevel};
}
function trustTier(r){
 if(r.status==='verified')return {key:'A',label:ui.trustA};
 if(r.checkedAt)return {key:'B',label:ui.trustB};
 return {key:'C',label:ui.trustC};
}
function recommendationReasons(r,kind){
 const reasons=[];
 if(kind==='native')reasons.push(ui.reasonNative);
 else if(kind==='english')reasons.push(ui.reasonEnglish);
 const levelScore=resourceLevelScore(r,selectedLevel);
 if(levelScore>=4)reasons.push(ui.reasonLevel);
 if(r.status==='verified')reasons.push(ui.reasonVerified);
 else if(r.checkedAt)reasons.push(ui.reasonChecked);
 if(r.cost==='免費')reasons.push(ui.reasonFree);
 return reasons.slice(0,3);
}
function renderResourceCard(r,kind){
 const card=document.createElement('article');card.className='resource-card';
 const badge=document.createElement('span');badge.className='resource-badge '+(kind==='native'?'native':kind==='english'?'english':'other');badge.textContent=kind==='native'?ui.nativeBadge:kind==='english'?ui.englishBadge:ui.other;card.append(badge);
 const body=document.createElement('div');body.className='resource-card-body';
 const h=document.createElement('h3');h.textContent=r.title;body.append(h);
 const provider=document.createElement('p');provider.className='provider';provider.textContent=r.provider;body.append(provider);
 const summary=document.createElement('p');summary.className='resource-summary';
 const localizedSummary=r.summaryByLocale?.[currentLocale]||(currentLocale==='zh-TW'?r.summary:null);
 summary.textContent=localizedSummary||ui.summaryPending;summary.setAttribute('lang',localizedSummary?(r.summaryLanguageByLocale?.[currentLocale]||currentLocale):currentLocale);body.append(summary);
 const tags=document.createElement('div');tags.className='resource-tags';
 [[localCategory(r.category),'tag-category'],[localLevel(r.level),'tag-level'],[localCost(r.cost),'tag-cost'],[localScript(r.script),'tag-script']].forEach(([v,c])=>{const s=document.createElement('span');s.className=c;s.textContent=v;tags.append(s);});
 const trust=trustTier(r); const status=document.createElement('span');status.className='verification trust-'+trust.key.toLowerCase(); status.title=ui.trustTooltip;
 status.textContent=trust.key+' · '+trust.label+(r.checkedAt&&trust.key!=='C'?' · '+r.checkedAt:'');
 tags.append(status);
 body.append(tags);
 const reasons=recommendationReasons(r,kind);
 if(reasons.length){
  const wrap=document.createElement('div');wrap.className='recommendation-reasons';
  const title=document.createElement('span');title.className='recommendation-reasons-title';title.textContent=ui.reasonsTitle;wrap.append(title);
  const list=document.createElement('ul');reasons.forEach(reason=>{const li=document.createElement('li');li.textContent=reason;list.append(li)});wrap.append(list);body.append(wrap);
 }
 const a=document.createElement('a');a.href=r.url;a.target='_blank';a.rel='noopener noreferrer';a.textContent=ui.link;body.append(a);
 card.append(body);return card;
}
function renderFeatured(){
 const box=qs('#resourceFeature');box.replaceChildren();
 const selected=featuredResources();
 const rec=qs('#resourceRecommendationNote');
 if(rec)rec.textContent=selectedLevel&&selectedGoal?ui.recommendationNote(selectedLevel):'';
 selected.primary.forEach(r=>box.append(renderResourceCard(r,'native')));
 selected.fallback.forEach(r=>box.append(renderResourceCard(r,'english')));
 if(!selected.primary.length&&!selected.fallback.length){
  const empty=document.createElement('div');empty.className='resource-gap-empty';
  const strong=document.createElement('strong');strong.textContent=ui.noResources;empty.append(strong);
  const p=document.createElement('p');p.textContent=ui.gapIntro;empty.append(p);box.append(empty);
 }
 const note=document.createElement('p');note.className='resource-selection-note';
 note.textContent=selected.primary.length?(selected.fallback.length?ui.native+' · '+ui.english:ui.native):(selected.fallback.length?ui.english:ui.gapIntro);
 box.append(note);
}
function renderGoals(){
 const grid=qs('#goalGrid');grid.replaceChildren();
 goalEntries.forEach(([id,icon])=>{
  const b=document.createElement('button');b.type='button';b.className='goal-card'+(selectedGoal===id?' selected':'');b.setAttribute('aria-pressed',String(selectedGoal===id));
  const i=document.createElement('span');i.className='goal-icon';i.textContent=icon;b.append(i);
  const h=document.createElement('strong');h.textContent=ui.goals[goalEntries.findIndex(x=>x[0]===id)];b.append(h);
  const related=nodesForGoal(id)[0];const p=document.createElement('span');p.textContent=related?(ui.pathTitles&&ui.pathTitles[related.order-1]||related.title):'';b.append(p);
  b.addEventListener('click',()=>{selectedGoal=id;renderGoals();renderPath();renderFeatured();qs('#goalStartPanel')?.scrollIntoView({behavior:'smooth',block:'nearest'});});
  grid.append(b);
 });
 const panel=qs('#goalStartPanel');
 if(panel){
  panel.hidden=!selectedGoal;
  if(selectedGoal){
   const idx=goalEntries.findIndex(x=>x[0]===selectedGoal), node=nodesForGoal(selectedGoal)[0];
   panel.querySelector('.goal-start-title').textContent=ui.goalStartTitle||'';
   panel.querySelector('.goal-start-body').textContent=(ui.goalStart||((g,p)=>g+' → '+p))(ui.goals[idx],node?(ui.pathTitles?.[node.order-1]||node.title):'');
   const levelLabel=panel.querySelector('.goal-level-label');if(levelLabel)levelLabel.textContent=ui.goalLevelLabel||'Level';
   const levelSelect=panel.querySelector('.goal-level-select');if(levelSelect){levelSelect.replaceChildren(new Option(ui.allLevels||'All levels',''),...['入門','初級','中級','高級'].map(v=>new Option(ui.levels[v]||v,v)));levelSelect.value=selectedLevel;}
   panel.querySelector('.goal-start-action').textContent=ui.goalStartAction||ui.pathView;
   panel.querySelector('.goal-start-action').onclick=()=>node&&qs('#path-'+node.id)?.scrollIntoView({behavior:'smooth',block:'center'});
  }
 }
}
function renderPath(){
 const grid=qs('#pathGrid');grid.replaceChildren();
 learningPath.forEach((node,index)=>{
  const grouped=resourceGroup(catalog.filter(r=>node.categories.includes(r.category)));
  const card=document.createElement('article');card.className='path-card'+(goalMap[selectedGoal]&&goalMap[selectedGoal].includes(node.id)?' focused':'');card.id='path-'+node.id;
  const head=document.createElement('div');head.className='path-head';
  const num=document.createElement('span');num.className='path-number';num.textContent=String(node.order).padStart(2,'0');head.append(num);
  const icon=document.createElement('span');icon.className='path-icon';icon.textContent=node.icon;head.append(icon);
  const levelTag=document.createElement('span');levelTag.className='path-level';levelTag.textContent=(ui.levels?.[node.level]||node.level);head.append(levelTag);card.append(head);
  const h=document.createElement('h3');h.textContent=ui.pathTitles&&ui.pathTitles[index]||node.title;card.append(h);
  const ul=document.createElement('ul');ul.className='path-goals';const goals=ui.pathGoals&&ui.pathGoals[index]||node.goals;goals.forEach(g=>{const li=document.createElement('li');li.textContent=g;ul.append(li)});card.append(ul);
  const meta=document.createElement('p');meta.className='path-resource-meta';
  meta.textContent=grouped.primary.length?ui.pathNative(grouped.primary.length)+(grouped.fallback.length?' · '+ui.pathEnglish(grouped.fallback.length):''):grouped.fallback.length?ui.pathEnglish(grouped.fallback.length):ui.pathGap;card.append(meta);
  const btn=document.createElement('button');btn.type='button';btn.className='path-resource-button';btn.textContent=ui.pathView;btn.addEventListener('click',()=>{category.value=node.categories[0];query.value='';renderResources();qs('#allResources').scrollIntoView({behavior:'smooth'});});card.append(btn);
  grid.append(card);
 });
}
function renderFeatures(){
 const grid=qs('#featureGrid');grid.replaceChildren();
 const icons=['💰','🎚️','🌐','字','✓'];
 ui.features.forEach((label,i)=>{const card=document.createElement('article');card.className='feature-card';const icon=document.createElement('span');icon.textContent=icons[i];card.append(icon);const strong=document.createElement('strong');strong.textContent=label;card.append(strong);grid.append(card);});
}
function renderGap(){
 const summary=coverageSummary(catalog,[currentLocale])[0],box=qs('#gapStats');box.replaceChildren();
 [['native',summary.native,ui.native],['english',summary.english,ui.english],['gap',summary.gaps,ui.pathGap]].forEach(([kind,n,label])=>{const item=document.createElement('span');item.className='gap-stat '+kind;const strong=document.createElement('strong');strong.textContent=n;item.append(strong);const small=document.createElement('small');small.textContent=label;item.append(small);box.append(item);});
 qs('#gapAction').onclick=()=>qs('#allResources').scrollIntoView({behavior:'smooth'});
}
function renderResources(){
 const q=query.value.trim().toLocaleLowerCase();
 const filtered=catalog.filter(r=>(!category.value||r.category===category.value)&&(!level.value||r.level===level.value)&&matchResource(r,q,localCategory(r.category)));
 const g=resourceGroup(filtered);results.replaceChildren();
 const info=document.createElement('p');info.className='language-resource-notice';info.textContent=ui.native+': '+g.primary.length+' · '+ui.english+': '+g.fallback.length+' · '+ui.other+': '+g.other.length;results.append(info);
 if(!filtered.length){const e=document.createElement('p');e.className='empty';e.textContent=ui.empty;results.append(e);return;}
 [...g.primary,...g.fallback].forEach(r=>results.append(renderResourceCard(r,g.primary.includes(r)?'native':'english')));
 if(g.other.length){
  const details=document.createElement('details');details.className='resource-other';
  const summary=document.createElement('summary');summary.textContent=ui.other+' ('+g.other.length+')';details.append(summary);
  const grid=document.createElement('div');grid.className='resource-grid resource-other-grid';
  g.other.forEach(r=>grid.append(renderResourceCard(r,'other')));details.append(grid);results.append(details);
 }
}

const exampleUi={
 'zh-TW':{title:'認識繁體與簡體中文',intro:'以臺灣繁體中文為主要學習目標，同時理解簡體字的對應形式。',traditional:'繁體中文',simplified:'簡體中文',pinyin:'漢語拼音',translation:'母語解釋',noTranslation:'此語言的解釋仍在整理中。'},
 'zh-CN':{title:'认识繁体与简体中文',intro:'以台湾繁体中文为主要学习目标，同时理解简体字的对应形式。',traditional:'繁体中文',simplified:'简体中文',pinyin:'汉语拼音',translation:'母语解释',noTranslation:'该语言的解释仍在整理中。'},
 en:{title:'Compare Traditional and Simplified Chinese',intro:'Learn Taiwan Traditional Chinese as the primary target while recognizing its Simplified counterparts.',traditional:'Traditional Chinese',simplified:'Simplified Chinese',pinyin:'Pinyin',translation:'Your language',noTranslation:'A translation in your language is not available yet.'}
};
let speechRate=0.9;
function speakChinese(text,locale){if(!('speechSynthesis' in window)||typeof SpeechSynthesisUtterance==='undefined'){qs('#speechStatus').textContent=currentLocale==='zh-CN'?'此浏览器不支持语音朗读。':'此瀏覽器不支援語音朗讀。';return;}window.speechSynthesis.cancel();const utterance=new SpeechSynthesisUtterance(text);utterance.lang=locale;utterance.rate=speechRate;const voices=window.speechSynthesis.getVoices();const preferred=voices.find(v=>v.lang.toLowerCase()===locale.toLowerCase())||voices.find(v=>v.lang.toLowerCase().startsWith(locale.slice(0,2).toLowerCase()));if(preferred)utterance.voice=preferred;utterance.onstart=()=>{qs('#speechStatus').textContent=currentLocale==='zh-CN'?'正在播放中文发音…':'正在播放中文發音…';};utterance.onend=()=>{qs('#speechStatus').textContent=currentLocale==='zh-CN'?'播放完毕。':'播放完畢。';};utterance.onerror=()=>{qs('#speechStatus').textContent=currentLocale==='zh-CN'?'语音播放失败，请检查浏览器语音设置。':'語音播放失敗，請檢查瀏覽器語音設定。';};window.speechSynthesis.speak(utterance);}
function makeSpeakButton(text,locale,label){const button=document.createElement('button');button.type='button';button.className='example-speak-button';button.textContent='▶';button.setAttribute('aria-label',label);button.title=label;button.addEventListener('click',()=>speakChinese(text,locale));return button;}

let strokeWriter=null,activeStrokeCharacter='學';
function setupStrokePractice(){const canvas=qs('#strokeCanvas'),status=qs('#strokeStatus');const loadCharacter=character=>{activeStrokeCharacter=character;canvas.replaceChildren();status.textContent='正在載入「'+character+'」的筆順資料…';try{strokeWriter=createStrokeWriter(canvas,character,{onLoadCharDataSuccess:()=>{status.textContent='已載入「'+character+'」，可播放筆順或開始書寫測驗。';},onLoadCharDataError:()=>{status.textContent='筆順資料載入失敗，請稍後再試。';}});strokeWriter.animateCharacter();}catch(error){status.textContent='筆順模組初始化失敗：'+error.message;}};qsAll('[data-stroke-char]').forEach(button=>button.addEventListener('click',()=>{qsAll('[data-stroke-char]').forEach(b=>b.classList.toggle('selected',b===button));loadCharacter(button.dataset.strokeChar);}));qs('#strokeAnimate').addEventListener('click',()=>{if(strokeWriter){strokeWriter.animateCharacter();status.textContent='正在播放筆順…';}});qs('#strokeQuiz').addEventListener('click',()=>{if(strokeWriter){status.textContent='請依照正確筆順在字框中書寫。';strokeWriter.quiz({onComplete:()=>{status.textContent='完成練習！你已完成這個字的筆順測驗。';}});}});loadCharacter(activeStrokeCharacter);}
function setupOpenCC(){const input=qs('#conversionInput'),output=qs('#conversionOutput');qs('#convertToTraditional').addEventListener('click',()=>{try{output.textContent=convertChineseText(input.value,'toTraditional');}catch(error){output.textContent='轉換失敗：'+error.message;}});qs('#convertToSimplified').addEventListener('click',()=>{try{output.textContent=convertChineseText(input.value,'toSimplified');}catch(error){output.textContent='轉換失敗：'+error.message;}});}

function renderPronunciationResult(data){const box=qs('#pronunciationResult');box.replaceChildren();const title=document.createElement('strong');title.textContent='自動發音輔助';box.append(title);for(const [label,values] of [['拼音',data.pinyin],['注音',data.zhuyin]]){const row=document.createElement('p');const b=document.createElement('b');b.textContent=label+'：';row.append(b,document.createTextNode(values.join(' · ')));box.append(row);}const note=document.createElement('small');note.textContent=data.note||'自動結果請人工核對。';box.append(note);}
function renderDictionaryResult(data,word){const box=qs('#dictionaryResult');box.replaceChildren();const link=document.createElement('a');link.href='https://www.moedict.tw/'+encodeURIComponent(word);link.target='_blank';link.rel='noopener noreferrer';link.textContent='在萌典查看完整原始詞條 ↗';box.append(link);if(!Array.isArray(data)||!data.length){const p=document.createElement('p');p.textContent='目前沒有找到詞條，請嘗試單字或其他詞形。';box.append(p);return;}const entry=data[0];if(entry.title){const h=document.createElement('h3');h.textContent=entry.title;box.append(h);}for(const heteronym of (entry.heteronyms||[]).slice(0,4)){const reading=document.createElement('p');reading.className='dictionary-reading';reading.textContent=[heteronym.bopomofo||'',heteronym.pinyin||''].filter(Boolean).join('　');box.append(reading);for(const definition of (heteronym.definitions||[]).slice(0,5)){const item=document.createElement('article');item.className='dictionary-definition';const def=document.createElement('p');def.textContent=definition.def||'';item.append(def);for(const example of definition.example||[]){const ex=document.createElement('blockquote');ex.textContent=example;item.append(ex);}box.append(item);}}const attribution=document.createElement('small');attribution.textContent='詞條文字依來源原文呈現；請至萌典原頁核對完整內容及更新。';box.append(attribution);}
async function lookupTaiwanChinese(){const word=qs('#dictionaryWord').value.trim();const status=qs('#dictionaryResult');if(!word){status.textContent='請先輸入中文字或詞語。';return;}qs('#dictionarySearch').disabled=true;status.textContent='正在查詢臺灣辭典…';qs('#pronunciationResult').replaceChildren();try{const [pronunciation,dictionary]=await Promise.allSettled([fetch('/api/pronunciation?text='+encodeURIComponent(word)).then(r=>{if(!r.ok)throw new Error('發音 API 暫時無法使用');return r.json();}),fetch('https://www.moedict.tw/'+encodeURIComponent(word)+'.json').then(r=>{if(!r.ok)throw new Error('辭典查詢暫時無法使用');return r.json();})]);if(pronunciation.status==='fulfilled')renderPronunciationResult(pronunciation.value);else{const p=document.createElement('p');p.textContent='拼音／注音服務尚未部署；可先使用瀏覽器語音及萌典原頁。';qs('#pronunciationResult').append(p);}if(dictionary.status==='fulfilled')renderDictionaryResult(dictionary.value,word);else status.textContent='萌典 API 暫時無法連線，請改由萌典網站查詢。';}catch(error){status.textContent='查詢失敗：'+error.message;}finally{qs('#dictionarySearch').disabled=false;}}

async function submitAudioForRecognition(){const file=qs('#asrAudio').files?.[0];const status=qs('#asrStatus'),result=qs('#asrTranscript');result.textContent='';if(!file){status.textContent='請先選擇音訊檔案。';return;}if(file.size>20*1024*1024){status.textContent='檔案超過 20 MB，請先縮短或壓縮。';return;}const form=new FormData();form.append('file',file);const language=qs('#asrLanguage').value;if(language)form.append('language',language);const button=qs('#asrSubmit');button.disabled=true;status.textContent='正在上傳並辨識，首次啟動可能需要載入模型…';try{const response=await fetch('/asr-api/transcribe',{method:'POST',body:form});const data=await response.json();if(!response.ok)throw new Error(data.detail||'辨識服務暫時無法使用。');result.textContent=data.text||'未辨識到文字。';status.textContent='辨識語言：'+data.language+'（信心 '+Math.round(data.language_probability*100)+'%）。'+data.notice;}catch(error){status.textContent='辨識失敗：'+error.message+' 請確認 ASR 服務已啟動。';}finally{button.disabled=false;}}

async function submitToneSample(){const file=qs('#toneAudio').files?.[0],box=qs('#toneResult');box.replaceChildren();if(!file){box.textContent='請先選擇 WAV 或 AIFF 錄音。';return;}const form=new FormData();form.append('file',file);form.append('target_tone',qs('#targetTone').value);const button=qs('#toneSubmit');button.disabled=true;box.textContent='正在分析音高曲線…';try{const response=await fetch('/api/tone-assessment',{method:'POST',body:form});const data=await response.json();if(!response.ok)throw new Error(data.detail||'分析服務暫時無法使用。');const heading=document.createElement('strong');heading.textContent=data.target_name+' · '+data.score+'/100（實驗性參考）';box.replaceChildren(heading);const curve=document.createElement('p');curve.textContent='相對音高曲線：'+data.contour_semitones.join(' → ')+' 半音';box.append(curve);const feedback=document.createElement('p');feedback.textContent=data.feedback;box.append(feedback);const note=document.createElement('small');note.textContent=data.notice;box.append(note);}catch(error){box.textContent='分析失敗：'+error.message;}finally{button.disabled=false;}}

async function submitImageForOcr(){const file=qs('#ocrImage').files?.[0],status=qs('#ocrStatus'),result=qs('#ocrText'),preview=qs('#ocrPreview');result.textContent='';preview.replaceChildren();if(!file){status.textContent='請先選擇圖片。';return;}if(file.size>10*1024*1024){status.textContent='圖片超過 10 MB。';return;}const image=document.createElement('img');image.src=URL.createObjectURL(file);image.alt='待辨識圖片預覽';image.onload=()=>URL.revokeObjectURL(image.src);preview.append(image);const form=new FormData();form.append('file',file);const button=qs('#ocrSubmit');button.disabled=true;status.textContent='正在辨識圖片，首次啟動可能需要下載模型…';try{const response=await fetch('/ocr-api/ocr',{method:'POST',body:form});const data=await response.json();if(!response.ok)throw new Error(data.detail||'OCR 服務暫時無法使用。');result.textContent=data.text||'目前沒有辨識到文字。';status.textContent=data.notice||'辨識完成，請核對原圖。';}catch(error){status.textContent='辨識失敗：'+error.message+' 請確認 OCR 服務已啟動。';}finally{button.disabled=false;}}
function renderExampleLab(){const t=exampleUi[currentLocale]||exampleUi.en;qs('#exampleLabTitle').textContent=t.title;qs('#exampleLabIntro').textContent=t.intro;const box=qs('#exampleCards');box.replaceChildren();const rate=qs('#speechRate');rate.value=String(speechRate);qs('#speechRateValue').textContent=speechRate.toFixed(1)+'×';qs('#speechRateLabel').textContent=currentLocale==='zh-CN'?'语音速度':'語音速度';for(const example of examplePreview){const view=presentExample(example,{nativeLocale:learnerPreferences.nativeLanguage,mode:learnerPreferences.targetScript});const card=document.createElement('article');card.className='example-card';const title=document.createElement('h3');title.textContent=example.id==='taiwan-mrt'?(currentLocale==='zh-CN'?'询问捷运站':'詢問捷運站'):(currentLocale==='zh-CN'?'购买车票':'購買車票');card.append(title);if(view.traditional){const row=document.createElement('div');row.className='example-script-row traditional';const label=document.createElement('span');label.textContent=t.traditional;const value=document.createElement('strong');value.lang='zh-Hant-TW';value.textContent=view.traditional;row.append(label,value,makeSpeakButton(view.traditional,'zh-TW',currentLocale==='zh-CN'?'播放繁体中文':'播放繁體中文'));card.append(row);}if(view.simplified){const row=document.createElement('div');row.className='example-script-row simplified';const label=document.createElement('span');label.textContent=t.simplified;const value=document.createElement('strong');value.lang='zh-Hans';value.textContent=view.simplified;row.append(label,value,makeSpeakButton(view.simplified,'zh-CN',currentLocale==='zh-CN'?'播放简体中文':'播放簡體中文'));card.append(row);}if(learnerPreferences.phoneticSystem!=='none'&&view.pinyin){const row=document.createElement('div');row.className='example-pinyin';const label=document.createElement('span');label.textContent=t.pinyin;const value=document.createElement('p');value.textContent=view.pinyin;row.append(label,value);card.append(row);}const row=document.createElement('div');row.className='example-translation';const label=document.createElement('span');label.textContent=t.translation;const value=document.createElement('p');value.textContent=view.translation||t.noTranslation;row.append(label,value);card.append(row);box.append(card);}}
qs('#speechRate').addEventListener('input',e=>{speechRate=Number(e.target.value);qs('#speechRateValue').textContent=speechRate.toFixed(1)+'×';});

function renderTaiwanLanguageLab(){const selected=learnerPreferences.spokenVariety||'mandarin-standard',v=taiwanLanguageVarieties.find(x=>x.id===selected)||taiwanLanguageVarieties[0];const labels=currentLocale==='en'?{title:'Taiwan Mandarin and regional speech',intro:'Choose Taiwan Mandarin or explore regional pronunciation differences.',focus:'Learning focus',region:'Region',sources:'Speech and learning resources',restricted:'Application / rights review required',open:'Available with conditions'}:currentLocale==='zh-CN'?{title:'台湾华语与地区语音',intro:'选择台湾华语标准发音或了解地区语音差异。',focus:'学习重点',region:'地区',sources:'语音与学习资源',restricted:'需申请／权利核验',open:'符合条件可使用'}:{title:'臺灣華語與地區語音',intro:'學習臺灣華語標準發音，並了解不同地區的語音差異。',focus:'學習重點',region:'地區',sources:'語音與學習資源',restricted:'需申請／權利核驗',open:'符合條件可使用'};qs('#regionalLanguageTitle').textContent=labels.title;qs('#regionalLanguageIntro').textContent=labels.intro;const select=qs('#spokenVariety');select.replaceChildren(...taiwanLanguageVarieties.map(x=>new Option(x.label,x.id)));select.value=selected;const summary=qs('#varietySummary');summary.replaceChildren();for(const [label,value] of [[labels.focus,v.focus],[labels.region,v.region]]){const p=document.createElement('p');const strong=document.createElement('strong');strong.textContent=label+'：';p.append(strong,document.createTextNode(value));summary.append(p);}const box=qs('#speechResourceCards');box.replaceChildren();const relevant=taiwanSpeechSources.filter(x=>x.variety===selected||(selected==='mandarin-standard'&&x.id==='common-voice-zh-tw'));for(const item of relevant){const card=document.createElement('article');card.className='speech-resource-card';const h=document.createElement('h3');h.textContent=item.name;card.append(h);const type=document.createElement('p');type.textContent=item.type;card.append(type);const license=document.createElement('p');license.textContent='授權：'+item.license;card.append(license);const access=document.createElement('p');access.textContent='取得方式：'+item.access;card.append(access);const commercial=document.createElement('p');commercial.textContent='商業使用：'+item.commercial;card.append(commercial);const link=document.createElement('a');link.href=item.url;link.target='_blank';link.rel='noopener noreferrer';link.textContent='查看來源與申請方式 ↗';card.append(link);box.append(card);}if(!relevant.length){const p=document.createElement('p');p.textContent='此類臺灣華語語音資料仍在整理與核驗中。';box.append(p);}const rules=qs('#speechRightsRules');rules.replaceChildren();speechRightsRules.forEach(text=>{const li=document.createElement('li');li.textContent=text;rules.append(li);});}
function renderLearnerPreferences(){const labels=preferenceLabelsByLocale[currentLocale]||{native:'Native language',script:'Learning script',phonetic:'Phonetic guide',title:'Learning preferences',intro:'Set your preferences independently.'};qs('#preferencesTitle').textContent=labels.title;qs('#preferencesIntro').textContent=labels.intro;const native=qs('#nativeLanguage'),script=qs('#targetScript'),phonetic=qs('#phoneticSystem'),variety=qs('#spokenVariety');native.replaceChildren(...preferenceOptions.nativeLanguage.map(([v,t])=>new Option(t,v)));script.replaceChildren(new Option(ui.scriptTraditional||'繁體中文','traditional'),new Option(ui.scriptSimplified||'简体中文','simplified'),new Option(ui.scriptBoth||'繁簡對照','both'));phonetic.replaceChildren(new Option(ui.phoneticZhuyin||'注音符號','zhuyin'),new Option(ui.phoneticPinyin||'漢語拼音','pinyin'),new Option(ui.phoneticNone||'不顯示','none'));variety.replaceChildren(...preferenceOptions.spokenVariety.map(([v,t])=>new Option(t,v)));qs('#nativeLanguageLabel').textContent=labels.native;qs('#targetScriptLabel').textContent=labels.script;qs('#phoneticSystemLabel').textContent=labels.phonetic;qs('#spokenVarietyLabel').textContent=currentLocale==='en'?'Taiwan Mandarin':currentLocale==='zh-CN'?'台湾华语语音':'臺灣華語語音';native.value=learnerPreferences.nativeLanguage;script.value=learnerPreferences.targetScript;phonetic.value=learnerPreferences.phoneticSystem;variety.value=learnerPreferences.spokenVariety;}
function setLocale(code){
 currentLocale=code;ui=Object.assign({},homepageMessages(code),homepageFlow(code),onboardingI18n[code]||onboardingI18n.en,recommendationI18n[code]||recommendationI18n.en);document.documentElement.lang=code;document.title='LIFE RIVER · '+ui.categories;
 [ui.navHome,ui.navCategories,ui.navFeatured,ui.navAbout].forEach((v,i)=>{const a=qsAll('.site-nav a')[i];if(a)a.textContent=v;});
 qs('.language-picker b').textContent=ui.langLabel||ui.lang||'Language';
 langSelect.setAttribute('aria-label',ui.langLabel||ui.lang||'Language');
 qs('#menuToggle').setAttribute('aria-label',qs('#menuToggle').getAttribute('aria-expanded')==='true'?(ui.menuClose||'Close menu'):(ui.menuOpen||'Open menu'));
 const brand=brandLabels[code]||brandLabels.en;qs('.hero-eyebrow').textContent=brand[0];qs('.brand-caption strong').textContent=brand[1];qs('.brand-caption small').textContent=ui.categories;qs('#siteFooter').textContent='© 2026 LIFE RIVER · '+brand[1];
 qs('.hero h1').textContent=ui.hero[0];qs('.hero-en').textContent='';qs('.hero-intro').textContent=ui.hero[1];qs('.hero-sub').textContent=ui.hero[2];qs('.hero-primary').textContent=ui.hero[3];qs('.hero-secondary').textContent=ui.hero[4];qs('.hero-proof-label').textContent=' '+ui.categories;
 qs('#goals h2').textContent=ui.goalTitle;qs('#goals .section-intro').textContent=ui.goalIntro;
 qs('#learningPath h2').textContent=ui.pathTitle;qs('.learning-path-intro').textContent=ui.pathIntro;
 qs('#resources h2').textContent=ui.resourceTitle;qs('.resource-section-intro').textContent=ui.resourceIntro;qs('.resource-more-link').textContent=ui.viewAll+' →';qs('.trust-heading').textContent=ui.trustHeading;qs('.legend-verified-label').textContent=ui.trustALegend;qs('.legend-pending-label').textContent=ui.trustBCLabel;qs('.trust-c-label').textContent=ui.trustC||ui.candidate||'';
 qs('#directory h2').textContent=ui.categories;qs('#directory .section-link').textContent=ui.viewAll+' →';
 qsAll('.category-tile').forEach(el=>el.querySelector('.tile-title').textContent=localCategory(el.dataset.category));
 qs('#features h2').textContent=ui.featuresTitle;qs('#gap h2').textContent=ui.gapTitle;qs('#gapIntro').textContent=ui.gapIntro;qs('#gapAction').textContent=ui.gapAction;
 qs('#allResources h2').textContent=ui.resourceTitle;qs('#searchInput').placeholder=ui.placeholder;qs('.search-button').textContent=ui.search;qs('.quick-label').textContent='🔥 '+ui.popular;
 qsAll('.quick-links button').forEach((b,i)=>{b.textContent=ui.quick[i]||b.textContent;});
 const filterLabels=qsAll('.filters label span');filterLabels[0].textContent=ui.categoryFilter;filterLabels[1].textContent=ui.levelFilter;
 const previousCategory=category.value,previousLevel=level.value;
 category.replaceChildren(new Option(ui.allCategories,''),...categories.map(([id])=>new Option(localCategory(id),id)));
 level.replaceChildren(new Option(ui.allLevels,''),...['入門','初級','中級','高級','多級'].map(v=>new Option(ui.levels[v]||v,v)));
 category.value=previousCategory;level.value=previousLevel;
 qs('#clearFilters').textContent=ui.clear;qs('#about h2').textContent=ui.aboutTitle;qs('#about p:last-child').textContent=ui.aboutBody;qs('#notice').textContent=ui.notice;
 renderGoals();renderPath();renderFeatured();renderFeatures();renderGap();renderResources();renderLearnerPreferences();renderExampleLab();renderTaiwanLanguageLab();langSelect.value=code;
}
qs('#searchForm').addEventListener('submit',e=>{e.preventDefault();renderResources();qs('#allResources').scrollIntoView({behavior:'smooth'});});
query.addEventListener('input',renderResources);category.addEventListener('change',renderResources);level.addEventListener('change',renderResources);
qs('#goalLevel')?.addEventListener('change',e=>{selectedLevel=e.target.value||'入門';renderGoals();renderFeatured();});
qs('#clearFilters').addEventListener('click',()=>{query.value='';category.value='';level.value='';renderResources();});
qsAll('.category-tile').forEach(b=>b.addEventListener('click',()=>{category.value=b.dataset.category;query.value='';renderResources();qs('#allResources').scrollIntoView({behavior:'smooth'});}));
qsAll('.quick-links button').forEach(b=>b.addEventListener('click',()=>{const cat=b.dataset.category;if(cat){category.value=cat;query.value='';}else query.value=b.dataset.query||'';renderResources();qs('#allResources').scrollIntoView({behavior:'smooth'});}));
qs('#menuToggle').addEventListener('click',()=>{const open=qs('#menuToggle').getAttribute('aria-expanded')!=='true';qs('#menuToggle').setAttribute('aria-expanded',String(open));qs('#mainNav').classList.toggle('open',open);qs('#menuToggle').setAttribute('aria-label',open?(ui.menuClose||'Close menu'):(ui.menuOpen||'Open menu'));});
qsAll('#mainNav a').forEach(link=>link.addEventListener('click',()=>{qs('#mainNav').classList.remove('open');qs('#menuToggle').setAttribute('aria-expanded','false');qs('#menuToggle').setAttribute('aria-label',ui.menuOpen||'Open menu');}));
langSelect.addEventListener('change',e=>{try{localStorage.setItem('lr-chinese-locale',e.target.value)}catch{}learnerPreferences=savePreferences(globalThis.localStorage,{...learnerPreferences,interfaceLanguage:e.target.value});setLocale(e.target.value);});
['nativeLanguage','targetScript','phoneticSystem','spokenVariety'].forEach(id=>qs('#'+id).addEventListener('change',e=>{if(id==='nativeLanguage')learnerPreferences=defaultsForNativeLanguage(e.target.value);else learnerPreferences={...learnerPreferences,[id]:e.target.value};learnerPreferences=savePreferences(globalThis.localStorage,learnerPreferences);renderLearnerPreferences();renderExampleLab();renderTaiwanLanguageLab();}));
try{const saved=localStorage.getItem('lr-chinese-locale');if(saved&&homepageLocales.includes(saved))currentLocale=saved;}catch{}
setLocale(currentLocale);
setupStrokePractice();setupOpenCC();qs('#asrSubmit').addEventListener('click',submitAudioForRecognition);qs('#toneSubmit').addEventListener('click',submitToneSample);qs('#ocrSubmit').addEventListener('click',submitImageForOcr);qs('#dictionarySearch').addEventListener('click',lookupTaiwanChinese);qs('#dictionaryWord').addEventListener('keydown',e=>{if(e.key==='Enter')lookupTaiwanChinese();});
