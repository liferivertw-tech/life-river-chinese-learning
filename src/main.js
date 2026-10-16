import './style.css';
import './learning-path.css';
import {catalog,categories} from './catalog.js';
import {groupResources,matchResource} from './resource-ranking.js';
import {homepageMessages} from './homepage-i18n.js';
import {learningPath,resourcesForNode} from './learning-path.js';
import {renderShell} from './ui-shell.js';

const langs=[['zh-TW','繁體中文'],['en','English'],['vi','Tiếng Việt'],['id','Bahasa Indonesia'],['th','ไทย'],['fil','Filipino'],['ja','日本語'],['ko','한국어'],['my','မြန်မာ'],['km','ភាសាខ្មែរ'],['ms','Bahasa Melayu'],['hi','हिन्दी'],['fr','Français'],['es','Español'],['de','Deutsch']];
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

langs.forEach(([code,name])=>{const o=document.createElement('option');o.value=code;o.textContent=name;qs('#lang').append(o)});

function localizedCategory(id){return ui.categoryNames?.[id]??categoryMap[id]??id}
function statusLabel(r){
 if(r.status==='verified')return '✓ 已核驗';
 if(r.checkedAt)return '◷ 已檢查 '+r.checkedAt;
 return '○ 待核驗';
}
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
  const h=document.createElement('h3');h.textContent=node.title;card.append(h);
  const lev=document.createElement('p');lev.className='path-level';lev.textContent=node.level;card.append(lev);
  const goals=document.createElement('ul');goals.className='path-goals';node.goals.forEach(goal=>{const li=document.createElement('li');li.textContent=goal;goals.append(li)});card.append(goals);
  const sum=document.createElement('p');sum.className='path-resource-summary';sum.textContent=`${ui.native} ${grouped.primary.length} · ${ui.english} ${grouped.fallback.length} · ${ui.other} ${grouped.other.length}`;card.append(sum);
  const actions=document.createElement('div');actions.className='path-actions';node.categories.forEach(cat=>{const b=document.createElement('button');b.type='button';b.textContent=localizedCategory(cat);b.addEventListener('click',()=>{category.value=cat;query.value='';renderResources();qs('#resources').scrollIntoView({behavior:'smooth'});});actions.append(b)});card.append(actions);
  pathGrid.append(card);
 });
}

function setLocale(code){
 currentLocale=code;ui=homepageMessages(code);document.documentElement.lang=code;
 const nav=qsAll('.site-nav a');[ui.navHome,ui.navCategories,ui.navFeatured,ui.navAbout].forEach((v,i)=>{if(nav[i])nav[i].textContent=v;});
 qs('.language-picker span').textContent=ui.langLabel;qs('.hero h1').textContent=ui.heroTitle;qs('.hero-en').textContent=ui.heroEnglish??'';qs('.hero-intro').textContent=ui.heroIntro;qs('.hero-sub').textContent=ui.heroSub;
 query.placeholder=ui.searchPlaceholder;qs('.search-button').textContent=ui.searchButton;qs('.filter-link').textContent=ui.advanced;qs('.quick-links span').textContent='🔥 '+ui.popular;
 qsAll('.quick-links button').forEach((b,i)=>{b.textContent=ui.quick[i]??b.textContent;});
 const heads=qsAll('.section-heading h2');if(heads[0])heads[0].textContent=ui.categories;if(heads[2])heads[2].textContent=ui.featured;
 const view=qs('#directory .section-heading a');if(view)view.textContent=ui.viewAll+' →';
 qsAll('.category-tile').forEach(el=>{el.querySelector('.tile-title').textContent=localizedCategory(el.dataset.category);});
 const labels=qsAll('.filters label');if(labels[0])labels[0].firstChild.textContent=ui.categoryFilter+' ';if(labels[1])labels[1].firstChild.textContent=ui.levelFilter+' ';
 category.options[0].textContent=ui.allCategories;Array.from(category.options).slice(1).forEach(o=>o.textContent=localizedCategory(o.value));
 level.options[0].textContent=ui.allLevels;Array.from(level.options).slice(1).forEach(o=>o.textContent=ui.levels?.[o.value]??o.value);
 qs('#clearFilters').textContent=ui.clear;const about=qs('.about');if(about){const h=about.querySelector('h2'),p=about.querySelector('p');if(h)h.textContent=ui.aboutTitle;if(p)p.textContent=ui.aboutBody;}const notice=qs('#notice');if(notice)notice.textContent=ui.notice;
 renderLearningPath();renderResources();
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
