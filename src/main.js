import {catalog,categories} from './catalog.js';
import {groupResources} from './resource-ranking.js';
import {homepageMessages} from './homepage-i18n.js';
const langs=[['zh-TW','繁體中文'],['en','English'],['vi','Tiếng Việt'],['id','Bahasa Indonesia'],['th','ไทย'],['fil','Filipino'],['ja','日本語'],['ko','한국어'],['my','မြန်မာ'],['km','ភាសាខ្មែរ'],['ms','Bahasa Melayu'],['hi','हिन्दी'],['fr','Français'],['es','Español'],['de','Deutsch']];
let currentLocale='zh-TW';let ui=homepageMessages(currentLocale);
const qs=s=>document.querySelector(s);
const query=qs('#searchInput'),category=qs('#categoryFilter'),level=qs('#levelFilter'),results=qs('#resourceResults');
function localizedCategory(id){return ui.categoryNames?.[id]??Object.fromEntries(categories)[id]??id}
function render(){
 const filtered=catalog.filter(r=>(!category.value||r.category===category.value)&&(!level.value||r.level===level.value)&&(!query.value.trim()||[r.title,r.summary,r.provider,r.category].join(' ').toLowerCase().includes(query.value.trim().toLowerCase())));
 const g=groupResources(filtered,currentLocale);
 results.innerHTML='';
 const info=document.createElement('p');info.className='language-resource-notice';info.textContent=ui.native+': '+g.primary.length+' · '+ui.english+': '+g.fallback.length+' · '+ui.other+': '+g.other.length;results.append(info);
 if(!filtered.length){const e=document.createElement('p');e.className='empty';e.textContent=ui.empty;results.append(e);return;}
 [...g.primary,...g.fallback,...g.other].forEach(r=>{
  const card=document.createElement('article');card.className='resource-card';
  const label=document.createElement('p');label.className='resource-language-label';label.textContent=g.primary.includes(r)?ui.native:g.fallback.includes(r)?ui.english:ui.other;card.append(label);
  const h=document.createElement('h3');h.textContent=r.title;card.append(h);
  const p=document.createElement('p');p.textContent=r.summary;card.append(p);
  const meta=document.createElement('p');meta.textContent=localizedCategory(r.category)+' · '+(ui.levels?.[r.level]??r.level)+' · '+r.cost;card.append(meta);
  const a=document.createElement('a');a.href=r.url;a.target='_blank';a.rel='noopener noreferrer';a.textContent=ui.link;card.append(a);results.append(card);
 });
}
function setLocale(code){
 currentLocale=code;ui=homepageMessages(code);document.documentElement.lang=code;
 const nav=qsAll('.site-nav a');[ui.navHome,ui.navCategories,ui.navFeatured,ui.navAbout].forEach((v,i)=>{if(nav[i])nav[i].textContent=v;});
 qs('.language-picker span').textContent=ui.langLabel;qs('.hero h1').textContent=ui.heroTitle;qs('.hero-en').textContent=ui.heroEnglish??'';qs('.hero-intro').textContent=ui.heroIntro;qs('.hero-sub').textContent=ui.heroSub;
 query.placeholder=ui.searchPlaceholder;qs('.search-button').textContent=ui.searchButton;qs('.filter-link').textContent=ui.advanced;qs('.quick-links span').textContent='🔥 '+ui.popular;
 qsAll('.quick-links button').forEach((b,i)=>{b.textContent=ui.quick[i]??b.textContent;});
 qsAll('.section-heading h2').forEach((h,i)=>{h.textContent=i===0?ui.categories:ui.featured;});const view=qs('#directory .section-heading a');if(view)view.textContent=ui.viewAll+' →';
 qsAll('.category-tile').forEach(el=>{el.querySelector('.tile-title').textContent=localizedCategory(el.dataset.category);});
 const labels=qsAll('.filters label');if(labels[0])labels[0].firstChild.textContent=ui.categoryFilter+' ';if(labels[1])labels[1].firstChild.textContent=ui.levelFilter+' ';
 category.options[0].textContent=ui.allCategories;Array.from(category.options).slice(1).forEach(o=>o.textContent=localizedCategory(o.value));
 level.options[0].textContent=ui.allLevels;Array.from(level.options).slice(1).forEach(o=>o.textContent=ui.levels?.[o.value]??o.value);
 const clear=qs('#clearFilters');if(clear)clear.textContent=ui.clear;const about=qs('.about');if(about){const h=about.querySelector('h2'),p=about.querySelector('p');if(h)h.textContent=ui.aboutTitle;if(p)p.textContent=ui.aboutBody;}const notice=qs('#notice');if(notice)notice.textContent=ui.notice;
 render();
}
function qsAll(s){return document.querySelectorAll(s)}
qs('#lang').addEventListener('change',e=>{try{sessionStorage.setItem('lr-chinese-locale',e.target.value)}catch{}setLocale(e.target.value)});
try{const saved=sessionStorage.getItem('lr-chinese-locale');if(saved&&langs.some(x=>x[0]===saved)){qs('#lang').value=saved;setLocale(saved)}}catch{}
query.addEventListener('input',render);category.addEventListener('change',render);level.addEventListener('change',render);qs('#clearFilters').addEventListener('click',()=>{query.value='';category.value='';level.value='';render()});
langs.forEach(([code,name])=>{const o=document.createElement('option');o.value=code;o.textContent=name;qs('#lang').append(o)});
setLocale(currentLocale);
