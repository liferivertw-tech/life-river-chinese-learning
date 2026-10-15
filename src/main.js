import './style.css';
import {categories,catalog} from './catalog.js';
import {localeMessages,isLocalized} from './i18n.js';

const langs=[['zh-TW','繁體中文'],['en','English'],['vi','Tiếng Việt'],['id','Bahasa Indonesia'],['th','ไทย'],['fil','Filipino'],['ja','日本語'],['ko','한국어'],['my','မြန်မာ'],['km','ភាសាខ្មែរ'],['ms','Bahasa Melayu'],['hi','हिन्दी'],['fr','Français'],['es','Español'],['de','Deutsch']];
const symbols=['🎙️','ㄅ','ā','字','📖','💬','🎧','📝','🏮','💼','💻','🎓'];
const colors=['pink','peach','yellow','green','teal','sky','blue','violet','rose','plum','lilac','sand'];
const root=document.querySelector('#app');
root.innerHTML=`
<header class="site-header"><a href="#" class="brand" aria-label="LIFE RIVER 首頁"><span class="logo-container"><img class="brand-logo" src="https://raw.githubusercontent.com/liferivertw-tech/life-river-chinese-learning/main/Life%20River-logo-h-final.png" alt="LifeRiver 生命河品牌標誌" onerror="this.hidden=true;this.nextElementSibling.hidden=false"><span class="logo-mark" hidden>≈</span></span><span class="brand-caption"><strong>Chinese Learning Hub</strong><small>生命河｜中文學習資源網</small></span></a><button type="button" id="menuToggle" class="menu-toggle" aria-label="開啟導覽選單" aria-expanded="false" aria-controls="mainNav">☰</button><nav id="mainNav" class="site-nav" aria-label="主要導覽"><a href="#home">⌂ 首頁</a><a href="#directory">▦ 資源分類</a><a href="#resources">★ 精選資源</a><a href="#about">ⓘ 關於我們</a></nav><label class="language-picker">🌐 <span>介面語言</span><select id="lang" aria-label="介面語言">${langs.map(([code,name])=>`<option value="${code}">${name}</option>`).join('')}</select></label></header>
<main id="home">
<section class="hero"><div class="hero-art hero-art-left" aria-hidden="true">🏯</div><div class="hero-inner"><p class="hero-eyebrow">LIFE RIVER · CHINESE LEARNING HUB</p><h1>學中文・看世界</h1><p class="hero-en">Learn Chinese · Discover a Wider World</p><p class="hero-intro">精選全球優質中文學習資源，幫助您輕鬆找到最適合的學習內容</p><p class="hero-sub">Discover online Chinese learning resources for life, work and study in Taiwan.</p></div><div class="hero-art hero-art-right" aria-hidden="true">臺灣</div></section>
<form id="searchForm" class="search-panel"><label class="search-box"><span aria-hidden="true">⌕</span><input id="query" type="search" placeholder="搜尋發音、注音、拼音、TOCFL、生活中文……" aria-label="搜尋中文學習資源"></label><button type="submit" class="search-button">⌕ 搜尋資源</button><a class="filter-link" href="#resources">☷ 進階篩選</a></form>
<div class="quick-links" aria-label="熱門學習主題"><span>🔥 熱門搜尋</span><button type="button" data-query="TOCFL">TOCFL</button><button type="button" data-query="發音">發音</button><button type="button" data-query="詞彙">詞彙</button><button type="button" data-query="生活">生活中文</button></div><section id="directory" class="directory"><div class="section-heading"><h2>▦ 中文學習資源分類 <span>Resource Categories</span></h2><a href="#resources">查看全部資源 →</a></div><div class="category-grid">${categories.map(([id,title],i)=>`<button type="button" class="category-tile ${colors[i]}" data-category="${id}"><span class="tile-icon" aria-hidden="true">${symbols[i]}</span><span class="tile-title">${title}</span><span class="tile-arrow" aria-hidden="true">›</span></button>`).join('')}</div></section>
<section id="resources" class="resources"><div class="section-heading"><h2>★ 精選學習資源 <span>Featured Resources</span></h2><span class="editorial-note">候選資料 · 尚待人工核驗</span></div><div class="filters"><label>資源分類 <select id="category"><option value="">全部分類</option>${categories.map(([id,name])=>`<option value="${id}">${name}</option>`).join('')}</select></label><label>學習程度 <select id="level"><option value="">全部程度</option><option value="入門">入門</option><option value="初級">初級</option><option value="中級">中級</option><option value="高級">高級</option><option value="多級">多級</option></select></label><button type="button" id="clearFilters" class="clear-button">清除篩選</button></div><p id="count" role="status"></p><div id="results" class="resource-grid"></div></section>
<section id="about" class="about"><h2>讓每個人都能找到合適的中文學習資源</h2><p>生命河整理來自不同機構的網路學習入口。本站目前為開發中的資源索引，不代表第三方網站的官方合作或內容授權。</p></section><aside id="notice" role="status">目前僅部分介面文字提供翻譯，資源介紹以繁體中文為主。</aside>
</main><footer>© 2026 LIFE RIVER · Chinese Learning Hub · BUILD 05</footer>`;

const results=document.querySelector('#results');
const query=document.querySelector('#query');
const category=document.querySelector('#category');
const level=document.querySelector('#level');
function render(){
 const q=query.value.trim().toLocaleLowerCase();
 const rows=catalog.filter(r=>(!category.value||r.category===category.value)&&(!level.value||r.level===level.value)&&(!q||[r.title,r.provider,r.summary,r.category].some(x=>x.toLocaleLowerCase().includes(q))));
 results.replaceChildren();
 for(const r of rows){
  const card=document.createElement('article');card.className='resource-card';
  const art=document.createElement('div');art.className='resource-art';art.textContent=r.category==='tocfl'?'🎓':'📚';
  const body=document.createElement('div');body.className='resource-body';
  const h=document.createElement('h3');h.textContent=r.title;
  const provider=document.createElement('p');provider.className='provider';provider.textContent=r.provider;
  const desc=document.createElement('p');desc.textContent=r.summary;
  const tags=document.createElement('div');tags.className='resource-tags';
  for(const value of [categories.find(x=>x[0]===r.category)?.[1]??r.category,r.level,'待核驗']){const tag=document.createElement('span');tag.textContent=value;tags.append(tag);}
  const a=document.createElement('a');a.href=r.url;a.target='_blank';a.rel='noopener noreferrer';a.textContent='前往來源網站 ↗';
  body.append(h,provider,desc,tags,a);card.append(art,body);results.append(card);
 }
 document.querySelector('#count').textContent='找到 '+rows.length+' 筆候選資源';
 if(!rows.length){const empty=document.createElement('p');empty.textContent='目前沒有符合條件的資源，後續將持續擴充。';results.append(empty);}
}
document.querySelector('#searchForm').addEventListener('submit',e=>{e.preventDefault();render();document.querySelector('#resources').scrollIntoView({behavior:'smooth'});});
[query,category,level].forEach(x=>x.addEventListener('input',render));
document.querySelectorAll('[data-category]').forEach(button=>button.addEventListener('click',()=>{category.value=button.dataset.category;render();document.querySelector('#resources').scrollIntoView({behavior:'smooth'});}));
const menuToggle=document.querySelector('#menuToggle');const mainNav=document.querySelector('#mainNav');menuToggle.addEventListener('click',()=>{const open=menuToggle.getAttribute('aria-expanded')!=='true';menuToggle.setAttribute('aria-expanded',String(open));menuToggle.setAttribute('aria-label',open?'關閉導覽選單':'開啟導覽選單');mainNav.classList.toggle('open',open);});mainNav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{mainNav.classList.remove('open');menuToggle.setAttribute('aria-expanded','false');menuToggle.setAttribute('aria-label','開啟導覽選單');}));document.querySelectorAll('[data-query]').forEach(button=>button.addEventListener('click',()=>{query.value=button.dataset.query;render();document.querySelector('#resources').scrollIntoView({behavior:'smooth'});}));
document.querySelector('#clearFilters').addEventListener('click',()=>{query.value='';category.value='';level.value='';render();});
render();
document.querySelector('#lang').addEventListener('change',e=>{const code=e.target.value;const dict=localeMessages(code);document.documentElement.lang=isLocalized(code)?code:'zh-TW';document.querySelector('#notice').textContent='已選擇 '+langs.find(x=>x[0]===code)[1]+'；完整介面翻譯與資源介紹尚在建置中。';});
