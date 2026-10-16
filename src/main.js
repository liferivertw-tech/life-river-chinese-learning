import './style.css';
import './learning-path.css';
import './coverage-matrix.css';
import {catalog,categories} from './catalog.js';
import {groupResources,matchResource} from './resource-ranking.js';
import {homepageMessages} from './homepage-i18n.js';
import {learningPath,resourcesForNode} from './learning-path.js';
import {buildCoverageMatrix,coverageSummary} from './coverage-matrix.js';
import {renderShell} from './ui-shell.js';

const langs=[['zh-TW','繁體中文'],['en','English'],['vi','Tiếng Việt'],['id','Bahasa Indonesia'],['th','ไทย'],['fil','Filipino'],['ja','日本語'],['ko','한국어'],['my','မြန်မာ'],['km','ភាសាខ្មែរ'],['ms','Bahasa Melayu'],['hi','हिन्दी'],['fr','Français'],['es','Español'],['de','Deutsch']];
const pathHeadings={
 'zh-TW':'從零開始學中文｜學習路徑','en':'Start Chinese from Zero｜Learning Path','vi':'Bắt đầu học tiếng Trung từ số 0｜Lộ trình học','id':'Belajar Mandarin dari Nol｜Jalur Belajar','th':'เริ่มเรียนภาษาจีนจากศูนย์｜เส้นทางการเรียน','fil':'Magsimulang Matuto ng Chinese mula Zero｜Learning Path','ja':'ゼロから学ぶ中国語｜学習ルート','ko':'처음부터 배우는 중국어｜학습 경로','my':'တရုတ်ဘာသာကို အစမှ လေ့လာရန်｜သင်ယူလမ်းကြောင်း','km':'រៀនភាសាចិនពីសូន្យ｜ផ្លូវសិក្សា','ms':'Belajar Bahasa Cina dari Sifar｜Laluan Pembelajaran','hi':'शून्य से चीनी सीखें｜अध्ययन मार्ग','fr':'Apprendre le chinois à partir de zéro｜Parcours','es':'Aprender chino desde cero｜Ruta de aprendizaje','de':'Chinesisch von Grund auf lernen｜Lernpfad'};
const pathIntros={
 'zh-TW':'依學習順序找到適合的網路教材；系統優先顯示您的介面母語資源，不足時以英文補充。','en':'Follow the learning order to find suitable online resources. Your interface language is prioritized, with English as fallback.','vi':'Tìm tài nguyên trực tuyến theo đúng thứ tự học. Hệ thống ưu tiên tiếng mẹ đẻ của giao diện và dùng tiếng Anh để bổ sung.','id':'Temukan sumber belajar daring sesuai urutan belajar. Bahasa antarmuka Anda diprioritaskan, lalu bahasa Inggris sebagai pelengkap.','th':'ค้นหาแหล่งเรียนออนไลน์ตามลำดับการเรียน ระบบจะให้ความสำคัญกับภาษาของอินเทอร์เฟซ และใช้ภาษาอังกฤษเสริมเมื่อจำเป็น','fil':'Sundin ang pagkakasunod-sunod ng pag-aaral upang makahanap ng angkop na online resources. Uunahin ang wika ng interface at English ang fallback.','ja':'学習順に適したオンライン教材を探せます。表示言語の教材を優先し、不足時は英語で補います。','ko':'학습 순서에 따라 적합한 온라인 자료를 찾습니다. 인터페이스 언어 자료를 우선하고 부족하면 영어로 보완합니다.','my':'သင်ယူအစီအစဉ်အတိုင်း သင့်တော်သော အွန်လိုင်းအရင်းအမြစ်များကို ရှာဖွေပါ။ မျက်နှာပြင်ဘာသာစကားကို ဦးစားပေးပြီး မလုံလောက်ပါက အင်္ဂလိပ်ကို ဖြည့်စွက်အသုံးပြုသည်။','km':'ស្វែងរកធនធានអនឡាញតាមលំដាប់សិក្សា។ ប្រព័ន្ធផ្តល់អាទិភាពដល់ភាសាចំណុចប្រទាក់ ហើយប្រើភាសាអង់គ្លេសជាជំនួយ។','ms':'Cari sumber pembelajaran dalam talian mengikut urutan belajar. Bahasa antara muka diutamakan dan bahasa Inggeris digunakan sebagai sokongan.','hi':'सीखने के क्रम के अनुसार उपयुक्त ऑनलाइन संसाधन खोजें। आपकी इंटरफ़ेस भाषा को प्राथमिकता दी जाएगी और अंग्रेज़ी बैकअप होगी।','fr':'Trouvez des ressources en ligne selon l’ordre d’apprentissage. La langue de l’interface est prioritaire, puis l’anglais en complément.','es':'Encuentra recursos en línea según el orden de aprendizaje. Se prioriza el idioma de la interfaz y el inglés sirve de apoyo.','de':'Finde Online-Ressourcen entlang der Lernreihenfolge. Die Sprache der Benutzeroberfläche hat Vorrang, Englisch dient als Ergänzung.'};
let currentLocale='zh-TW';
let ui=homepageMessages(currentLocale);
const qs=s=>document.querySelector(s);
const qsAll=s=>document.querySelectorAll(s);
renderShell(qs('#app'),categories);

const query=qs('#searchInput');
const category=qs('#categoryFilter');
const level=qs('#levelFilter');
const results=qs('#resourceResults');
const pathGrid=qs('#pathGrid');
const categoryMap=Object.fromEntries(categories);
const languageNames=Object.fromEntries(langs);
langs.forEach(([code,name])=>{const o=document.createElement('option');o.value=code;o.textContent=name;qs('#lang').append(o)});

function localizedCategory(id){return ui.categoryNames?.[id]??categoryMap[id]??id}
function statusLabel(r){return r.checkedAt?`✓ ${r.checkedAt}`:ui.candidate}
function renderResources(){
 const q=query.value.trim().toLocaleLowerCase();
 const filtered=catalog.filter(r=>(!category.value||r.category===category.value)&&(!level.value||r.level===level.value)&&matchResource(r,q,localizedCategory(r.category)));
 const g=groupResources(filtered,currentLocale);
 results.replaceChildren();
 const info=document.createElement('p');info.className='language-resource-notice';info.textContent=ui.native+': '+g.primary.length+' · '+ui.english+': '+g.fallback.length+' · '+ui.other+': '+g.other.length;results.append(info);
 if(!filtered.length){const e=document.createElement('p');e.className='empty';e.textContent=ui.empty;results.append(e);return;}
 [...g.primary,...g.fallback,...g.other].forEach(r=>{
  const card=document.createElement('article');card.className='resource-card';
  const label=document.createElement('p');label.className='resource-language-label';label.textContent=g.primary.includes(r)?ui.native:g.fallback.includes(r)?ui.english:ui.other;card.append(label);
  const h=document.createElement('h3');h.textContent=r.title;card.append(h);
  const provider=document.createElement('p');provider.className='provider';provider.textContent=r.provider;card.append(provider);
  const p=document.createElement('p');p.textContent=r.summary;card.append(p);
  const meta=document.createElement('p');meta.textContent=localizedCategory(r.category)+' · '+(ui.levels?.[r.level]??r.level)+' · '+r.cost+' · '+statusLabel(r);card.append(meta);
  const a=document.createElement('a');a.href=r.url;a.target='_blank';a.rel='noopener noreferrer';a.textContent=ui.link;card.append(a);results.append(card);
 });
}

function renderLearningPath(){
 pathGrid.replaceChildren();
 learningPath.forEach(node=>{
  const {grouped}=resourcesForNode(node,catalog,currentLocale);
  const card=document.createElement('article');card.className='path-card';
  const top=document.createElement('div');top.className='path-step';top.innerHTML=`<span class="path-number">${node.order}</span><span class="path-icon">${node.icon}</span>`;card.append(top);
  const h=document.createElement('h3');h.textContent=currentLocale==='zh-TW'?node.title:node.categories.map(localizedCategory).join(' · ');card.append(h);
  const lev=document.createElement('p');lev.className='path-level';lev.textContent=ui.levels?.[node.level]??(node.level==='零基礎'?ui.levels?.['入門']??node.level:node.level);card.append(lev);
  const goals=document.createElement('ul');goals.className='path-goals';
  const visibleGoals=currentLocale==='zh-TW'?node.goals:node.categories.map(localizedCategory);
  visibleGoals.forEach(goal=>{const li=document.createElement('li');li.textContent=goal;goals.append(li)});card.append(goals);
  const sum=document.createElement('p');sum.className='path-resource-summary';sum.textContent=`${ui.native} ${grouped.primary.length} · ${ui.english} ${grouped.fallback.length} · ${ui.other} ${grouped.other.length}`;card.append(sum);
  const actions=document.createElement('div');actions.className='path-actions';node.categories.forEach(cat=>{const b=document.createElement('button');b.type='button';b.textContent=localizedCategory(cat);b.addEventListener('click',()=>{category.value=cat;query.value='';renderResources();qs('#resources').scrollIntoView({behavior:'smooth'});});actions.append(b)});card.append(actions);
  pathGrid.append(card);
 });
}

function renderCoverage(){
 const head=qs('#coverageHead');const body=qs('#coverageBody');const summaryBox=qs('#coverageSummary');
 const matrix=buildCoverageMatrix(catalog,langs.map(([code])=>code));
 const summary=coverageSummary(catalog,langs.map(([code])=>code));
 head.innerHTML=`<tr><th>語言</th>${learningPath.map(n=>`<th title="${n.title}">${n.order}. ${n.title}</th>`).join('')}</tr>`;
 body.replaceChildren();
 matrix.forEach(row=>{
  const tr=document.createElement('tr');
  const name=document.createElement('td');name.textContent=languageNames[row.locale]??row.locale;tr.append(name);
  row.cells.forEach(cell=>{const td=document.createElement('td');td.className=`coverage-cell ${cell.status}`;td.title=`母語 ${cell.native} · 英文 ${cell.english} · 其他 ${cell.other}`;td.textContent=cell.status==='native'?`母 ${cell.native}`:cell.status==='english'?`英 ${cell.english}`:'缺';tr.append(td)});
  body.append(tr);
 });
 const nativeCells=summary.reduce((n,r)=>n+r.native,0);const englishCells=summary.reduce((n,r)=>n+r.english,0);const gaps=summary.reduce((n,r)=>n+r.gaps,0);
 summaryBox.innerHTML=`<article><strong>${nativeCells}</strong><span>母語已覆蓋節點</span></article><article><strong>${englishCells}</strong><span>只有英文補充節點</span></article><article><strong>${gaps}</strong><span>優先蒐集缺口</span></article>`;
}

function setLocale(code){
 currentLocale=code;ui=homepageMessages(code);document.documentElement.lang=code;
 const nav=qsAll('.site-nav a');[ui.navHome,ui.navCategories,ui.navFeatured,ui.navAbout].forEach((v,i)=>{if(nav[i])nav[i].textContent=v;});
 qs('.language-picker span').textContent=ui.langLabel;qs('.hero h1').textContent=ui.heroTitle;qs('.hero-en').textContent=ui.heroEnglish??'';qs('.hero-intro').textContent=ui.heroIntro;qs('.hero-sub').textContent=ui.heroSub;
 query.placeholder=ui.searchPlaceholder;qs('.search-button').textContent=ui.searchButton;qs('.filter-link').textContent=ui.advanced;qs('.quick-links span').textContent='🔥 '+ui.popular;
 qsAll('.quick-links button').forEach((b,i)=>{b.textContent=ui.quick[i]??b.textContent;});
 const heads=qsAll('.section-heading h2');if(heads[0])heads[0].textContent=ui.categories;if(heads[1])heads[1].textContent=pathHeadings[code]??pathHeadings.en;if(heads[3])heads[3].textContent=ui.featured;
 const intro=qs('.learning-path-intro');if(intro)intro.textContent=pathIntros[code]??pathIntros.en;
 const view=qs('#directory .section-heading a');if(view)view.textContent=ui.viewAll+' →';
 qsAll('.category-tile').forEach(el=>{el.querySelector('.tile-title').textContent=localizedCategory(el.dataset.category);});
 const labels=qsAll('.filters label');if(labels[0])labels[0].firstChild.textContent=ui.categoryFilter+' ';if(labels[1])labels[1].firstChild.textContent=ui.levelFilter+' ';
 category.options[0].textContent=ui.allCategories;Array.from(category.options).slice(1).forEach(o=>o.textContent=localizedCategory(o.value));
 level.options[0].textContent=ui.allLevels;Array.from(level.options).slice(1).forEach(o=>o.textContent=ui.levels?.[o.value]??o.value);
 qs('#clearFilters').textContent=ui.clear;const about=qs('.about');if(about){const h=about.querySelector('h2'),p=about.querySelector('p');if(h)h.textContent=ui.aboutTitle;if(p)p.textContent=ui.aboutBody;}const notice=qs('#notice');if(notice)notice.textContent=ui.notice;
 renderLearningPath();renderResources();renderCoverage();
}

qs('#searchForm').addEventListener('submit',e=>{e.preventDefault();renderResources();qs('#resources').scrollIntoView({behavior:'smooth'});});
query.addEventListener('input',renderResources);category.addEventListener('change',renderResources);level.addEventListener('change',renderResources);
qs('#clearFilters').addEventListener('click',()=>{query.value='';category.value='';level.value='';renderResources()});
qsAll('.category-tile').forEach(button=>button.addEventListener('click',()=>{category.value=button.dataset.category;query.value='';renderResources();qs('#resources').scrollIntoView({behavior:'smooth'});}));
qsAll('.quick-links button').forEach(button=>button.addEventListener('click',()=>{query.value=button.dataset.query??button.textContent;renderResources();qs('#resources').scrollIntoView({behavior:'smooth'});}));
qs('#menuToggle').addEventListener('click',()=>{const open=qs('#menuToggle').getAttribute('aria-expanded')!=='true';qs('#menuToggle').setAttribute('aria-expanded',String(open));qs('#mainNav').classList.toggle('open',open);});
qs('#lang').addEventListener('change',e=>{try{sessionStorage.setItem('lr-chinese-locale',e.target.value)}catch{}setLocale(e.target.value)});
try{const saved=sessionStorage.getItem('lr-chinese-locale');if(saved&&langs.some(x=>x[0]===saved)){qs('#lang').value=saved;currentLocale=saved}}catch{}
setLocale(currentLocale);
