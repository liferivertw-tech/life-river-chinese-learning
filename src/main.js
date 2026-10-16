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

const langs=[['zh-TW','繁體中文'],['en','English'],['vi','Tiếng Việt'],['id','Bahasa Indonesia'],['th','ไทย'],['fil','Filipino'],['ja','日本語'],['ko','한국어'],['my','မြန်မာ'],['km','ភាសាខ្មែរ'],['ms','Bahasa Melayu'],['hi','हिन्दी'],['fr','Français'],['es','Español'],['de','Deutsch']];
const goalMap={zero:['sound'],daily:['taiwan'],speaking:['skills'],literacy:['characters','reading'],taiwan:['taiwan'],work:['work-study'],traditional:['traditional'],tocfl:['tocfl']};
const goalEntries=[['zero','🧭'],['daily','🛍️'],['speaking','🎧'],['literacy','📚'],['taiwan','🏮'],['work','💼'],['traditional','ㄅ'],['tocfl','🎓']];
const qs=s=>document.querySelector(s),qsAll=s=>document.querySelectorAll(s);
let currentLocale='zh-TW',ui={},selectedGoal=null,selectedLevel='入門';
const brandLabels={
 'zh-TW':['LIFE RIVER · 中文學習資源網','生命河｜中文學習資源網'],
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
 const badge=document.createElement('span');badge.className='resource-badge '+(kind==='native'?'native':'english');badge.textContent=kind==='native'?ui.nativeBadge:ui.englishBadge;card.append(badge);
 const body=document.createElement('div');body.className='resource-card-body';
 const h=document.createElement('h3');h.textContent=r.title;body.append(h);
 const provider=document.createElement('p');provider.className='provider';provider.textContent=r.provider;body.append(provider);
 const summary=document.createElement('p');summary.className='resource-summary';
 const localizedSummary=r.summaryByLocale?.[currentLocale]||(currentLocale==='zh-TW'?r.summary:null);
 summary.textContent=localizedSummary||ui.summaryPending;summary.setAttribute('lang',localizedSummary?(r.summaryLanguageByLocale?.[currentLocale]||currentLocale):currentLocale);body.append(summary);
 const tags=document.createElement('div');tags.className='resource-tags';
 [[localCategory(r.category),'tag-category'],[localLevel(r.level),'tag-level'],[localCost(r.cost),'tag-cost'],[localScript(r.script),'tag-script']].forEach(([v,c])=>{const s=document.createElement('span');s.className=c;s.textContent=v;tags.append(s);});
 const status=document.createElement('span');status.className='verification '+(r.status==='verified'?'verified':'pending');
 if(r.status==='verified')status.textContent='✓ '+ui.verified;
 else if(r.checkedAt)status.textContent='✓ '+ui.checked+' · '+r.checkedAt;
 else status.textContent='! '+ui.candidate;
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
  b.addEventListener('click',()=>{selectedGoal=id;renderGoals();renderPath();renderFeatured();const first=nodesForGoal(id)[0];if(first)qs('#path-'+first.id).scrollIntoView({behavior:'smooth',block:'center'});});
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
  const levelTag=document.createElement('span');levelTag.className='path-level';levelTag.textContent=node.level;head.append(levelTag);card.append(head);
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
function setLocale(code){
 currentLocale=code;ui=Object.assign({},homepageMessages(code),homepageFlow(code),onboardingI18n[code]||onboardingI18n.en,recommendationI18n[code]||recommendationI18n.en);document.documentElement.lang=code;document.title='LIFE RIVER · '+ui.categories;
 [ui.navHome,ui.navCategories,ui.navFeatured,ui.navAbout].forEach((v,i)=>{const a=qsAll('.site-nav a')[i];if(a)a.textContent=v;});
 qs('.language-picker b').textContent=ui.langLabel||ui.lang||'Language';
 const brand=brandLabels[code]||brandLabels.en;qs('.hero-eyebrow').textContent=brand[0];qs('.brand-caption strong').textContent=brand[1];qs('.brand-caption small').textContent=ui.categories;qs('#siteFooter').textContent='© 2026 LIFE RIVER · '+brand[1]+' · BUILD 02';
 qs('.hero h1').textContent=ui.hero[0];qs('.hero-en').textContent='';qs('.hero-intro').textContent=ui.hero[1];qs('.hero-sub').textContent=ui.hero[2];qs('.hero-primary').textContent=ui.hero[3];qs('.hero-secondary').textContent=ui.hero[4];qs('.hero-proof-label').textContent=' '+ui.categories;
 qs('#goals h2').textContent=ui.goalTitle;qs('#goals .section-intro').textContent=ui.goalIntro;
 qs('#learningPath h2').textContent=ui.pathTitle;qs('.learning-path-intro').textContent=ui.pathIntro;
 qs('#resources h2').textContent=ui.resourceTitle;qs('.resource-section-intro').textContent=ui.resourceIntro;qs('.resource-more-link').textContent=ui.viewAll+' →';qs('.legend-verified-label').textContent=ui.verifiedLegend;qs('.legend-pending-label').textContent=ui.pendingLegend;
 qs('#directory h2').textContent=ui.categories;qs('#directory .section-link').textContent=ui.viewAll+' →';
 qsAll('.category-tile').forEach(el=>el.querySelector('.tile-title').textContent=localCategory(el.dataset.category));
 qs('#features h2').textContent=ui.featuresTitle;qs('#gap h2').textContent=ui.gapTitle;qs('#gapIntro').textContent=ui.gapIntro;qs('#gapAction').textContent=ui.gapAction;
 qs('#allResources h2').textContent=ui.resourceTitle;qs('#searchInput').placeholder=ui.placeholder;qs('.search-button').textContent=ui.search;qs('.quick-label').textContent='🔥 '+ui.popular;
 qsAll('.quick-links button').forEach((b,i)=>{b.textContent=ui.quick[i]||b.textContent;});
 const filterLabels=qsAll('.filters label span');filterLabels[0].textContent=ui.categoryFilter;filterLabels[1].textContent=ui.levelFilter;
 category.replaceChildren(new Option(ui.allCategories,''),...categories.map(([id])=>new Option(localCategory(id),id)));
 level.replaceChildren(new Option(ui.allLevels,''),...['入門','初級','中級','高級','多級'].map(v=>new Option(ui.levels[v]||v,v)));
 qs('#clearFilters').textContent=ui.clear;qs('#about h2').textContent=ui.aboutTitle;qs('#about p:last-child').textContent=ui.aboutBody;qs('#notice').textContent=ui.notice;
 renderGoals();renderPath();renderFeatured();renderFeatures();renderGap();renderResources();langSelect.value=code;
}
qs('#searchForm').addEventListener('submit',e=>{e.preventDefault();renderResources();qs('#allResources').scrollIntoView({behavior:'smooth'});});
query.addEventListener('input',renderResources);category.addEventListener('change',renderResources);level.addEventListener('change',renderResources);
qs('#goalLevel')?.addEventListener('change',e=>{selectedLevel=e.target.value||'入門';renderGoals();renderFeatured();});
qs('#clearFilters').addEventListener('click',()=>{query.value='';category.value='';level.value='';renderResources();});
qsAll('.category-tile').forEach(b=>b.addEventListener('click',()=>{category.value=b.dataset.category;query.value='';renderResources();qs('#allResources').scrollIntoView({behavior:'smooth'});}));
qsAll('.quick-links button').forEach(b=>b.addEventListener('click',()=>{const cat=b.dataset.category;if(cat){category.value=cat;query.value='';}else query.value=b.dataset.query||'';renderResources();qs('#allResources').scrollIntoView({behavior:'smooth'});}));
qs('#menuToggle').addEventListener('click',()=>{const open=qs('#menuToggle').getAttribute('aria-expanded')!=='true';qs('#menuToggle').setAttribute('aria-expanded',String(open));qs('#mainNav').classList.toggle('open',open);});
langSelect.addEventListener('change',e=>{try{localStorage.setItem('lr-chinese-locale',e.target.value)}catch{}setLocale(e.target.value);});
try{const saved=localStorage.getItem('lr-chinese-locale');if(saved&&homepageLocales.includes(saved))currentLocale=saved;}catch{}
setLocale(currentLocale);
