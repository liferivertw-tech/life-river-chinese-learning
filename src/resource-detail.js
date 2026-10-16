import './resource-detail.css';
import {catalog} from './catalog.js';
import {resourceDetailI18n} from './resource-detail-i18n.js';

const languageNames={'zh-TW':'繁體中文',en:'English',vi:'Tiếng Việt',id:'Bahasa Indonesia',th:'ไทย',fil:'Filipino',ja:'日本語',ko:'한국어',my:'မြန်မာ',km:'ភាសាខ្មែរ',ms:'Bahasa Melayu',hi:'हिन्दी',fr:'Français',es:'Español',de:'Deutsch'};
const byIdentity=new Map(catalog.map(r=>[`${r.title}\u0000${r.provider}`,r]));
let dialog=null;

function locale(){try{return localStorage.getItem('lr-chinese-locale')||'zh-TW'}catch{return 'zh-TW'}}
function labels(){return resourceDetailI18n[locale()]||resourceDetailI18n.en}
function resourceForCard(card){const title=card.querySelector('h3')?.textContent?.trim()||'';const provider=card.querySelector('.provider')?.textContent?.trim()||'';return byIdentity.get(`${title}\u0000${provider}`)}
function summaryFor(resource){const code=locale();return resource.summaryByLocale?.[code]||(code==='zh-TW'?resource.summary:null)||labels().detailUnknown}
function teachingLanguages(resource){const rows=resource.languageVerified===true&&Array.isArray(resource.teachingLanguages)?resource.teachingLanguages:[];return rows.length?rows.map(x=>languageNames[x]||x).join(' · '):labels().detailUnknown}
function trustFromCard(card){return card.querySelector('.verification')?.textContent?.trim()||labels().detailUnknown}
function reasonsFromCard(card){return [...card.querySelectorAll('.recommendation-reasons li')].map(x=>x.textContent.trim()).filter(Boolean)}
function ensureDialog(){
 if(dialog)return dialog;
 dialog=document.createElement('dialog');dialog.className='resource-detail-dialog';dialog.setAttribute('aria-labelledby','resourceDetailTitle');
 document.body.append(dialog);
 dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close()});
 dialog.addEventListener('cancel',()=>dialog.close());
 return dialog;
}
function item(label,value){const wrap=document.createElement('div');wrap.className='resource-detail-item';const dl=document.createElement('dl');const dt=document.createElement('dt');dt.textContent=label;const dd=document.createElement('dd');dd.textContent=value||labels().detailUnknown;dl.append(dt,dd);wrap.append(dl);return wrap}
function openDetail(resource,card){
 const ui=labels(),modal=ensureDialog(),trust=trustFromCard(card),reasons=reasonsFromCard(card);
 modal.replaceChildren();
 const shell=document.createElement('div');shell.className='resource-detail-shell';
 const head=document.createElement('header');head.className='resource-detail-head';
 const titleBox=document.createElement('div');const kicker=document.createElement('span');kicker.className='recommendation-reasons-title';kicker.textContent=ui.detailTitle;const h=document.createElement('h2');h.id='resourceDetailTitle';h.textContent=resource.title;const provider=document.createElement('p');provider.className='resource-detail-provider';provider.textContent=resource.provider;titleBox.append(kicker,h,provider);
 const close=document.createElement('button');close.type='button';close.className='resource-detail-close';close.setAttribute('aria-label',ui.detailClose);close.textContent='×';close.addEventListener('click',()=>modal.close());head.append(titleBox,close);shell.append(head);
 const summary=document.createElement('p');summary.className='resource-detail-summary';summary.textContent=summaryFor(resource);shell.append(summary);
 const grid=document.createElement('div');grid.className='resource-detail-grid';
 const category=card.querySelector('.tag-category')?.textContent?.trim()||resource.category;
 const level=card.querySelector('.tag-level')?.textContent?.trim()||resource.level;
 const cost=card.querySelector('.tag-cost')?.textContent?.trim()||resource.cost;
 const script=card.querySelector('.tag-script')?.textContent?.trim()||resource.script;
 grid.append(item(ui.detailBestFor,ui.bestFor(category,level)),item(ui.detailLearn,ui.learn(category)),item(ui.detailLanguage,teachingLanguages(resource)),item(ui.detailLevel,level),item(ui.detailCost,cost),item(ui.detailScript,script),item(ui.detailFormat,resource.format),item(ui.detailTrust,trust),item(ui.detailChecked,resource.checkedAt||ui.detailUnknown));
 shell.append(grid);
 if(reasons.length){const reasonBox=document.createElement('section');reasonBox.className='resource-detail-reasons';const rh=document.createElement('h3');rh.textContent=ui.detailReasons;const ul=document.createElement('ul');reasons.forEach(x=>{const li=document.createElement('li');li.textContent=x;ul.append(li)});reasonBox.append(rh,ul);shell.append(reasonBox)}
 const footer=document.createElement('footer');footer.className='resource-detail-footer';const source=document.createElement('a');source.className='resource-detail-source';source.href=resource.url;source.target='_blank';source.rel='noopener noreferrer';source.textContent=ui.detailSource+' ↗';footer.append(source);shell.append(footer);
 modal.append(shell);modal.showModal();close.focus();
}
function enhanceCard(card){
 if(card.dataset.detailReady==='true')return;
 const resource=resourceForCard(card);if(!resource)return;
 card.dataset.detailReady='true';
 const body=card.querySelector('.resource-card-body');if(!body)return;
 const source=body.querySelector(':scope > a');
 const actions=document.createElement('div');actions.className='resource-card-actions';
 if(source)actions.append(source);
 const button=document.createElement('button');button.type='button';button.className='resource-detail-button';button.textContent=labels().detailButton;button.addEventListener('click',()=>openDetail(resource,card));actions.append(button);body.append(actions);
}
function enhance(){document.querySelectorAll('.resource-card').forEach(enhanceCard)}
const observer=new MutationObserver(enhance);observer.observe(document.documentElement,{childList:true,subtree:true});enhance();
