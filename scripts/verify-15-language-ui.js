import {spawn} from 'node:child_process';
import {mkdirSync,writeFileSync} from 'node:fs';
import {join} from 'node:path';
import {setTimeout as delay} from 'node:timers/promises';
import {chromium} from 'playwright';
import {homepageMessages} from '../src/homepage-i18n.js';
import {homepageFlow,flowLocales} from '../src/homepage-flow-i18n.js';

const PORT=4173;
const BASE_URL=`http://127.0.0.1:${PORT}`;
const OUT_DIR=join(process.cwd(),'artifacts','visual-15-language');
const LOCALES=flowLocales;
const DESKTOP={width:1440,height:900};
const MOBILE={width:390,height:844};

mkdirSync(OUT_DIR,{recursive:true});

function startServer(){
  const child=spawn('npm',['run','dev','--','--port',String(PORT)],{stdio:'inherit',shell:process.platform==='win32'});
  return child;
}
async function waitForServer(){
  for(let i=0;i<60;i++){
    try{
      const response=await fetch(BASE_URL);
      if(response.ok)return;
    }catch{}
    await delay(500);
  }
  throw new Error('Vite preview server did not become ready.');
}
function assert(condition,message){
  if(!condition)throw new Error(message);
}
async function metrics(page){
  return page.evaluate(()=>({
    viewport:{width:innerWidth,height:innerHeight},
    scrollWidth:document.documentElement.scrollWidth,
    clientWidth:document.documentElement.clientWidth,
    sections:['goals','learningPath','resources','directory','features','gap','allResources','about']
      .map(id=>({id,top:document.getElementById(id)?.getBoundingClientRect().top ?? -1})),
    categoryCount:document.querySelectorAll('.category-tile').length,
    pathCount:document.querySelectorAll('.path-card').length,
    goalCount:document.querySelectorAll('.goal-card').length,
    resourceCount:document.querySelectorAll('#resourceResults .resource-card').length,
    languageCount:document.querySelectorAll('#lang option').length,
    logoLoaded:!!document.querySelector('.brand-logo')?.complete && (document.querySelector('.brand-logo')?.naturalWidth ?? 0)>0,
    menuVisible:getComputedStyle(document.querySelector('#mainNav')).display!=='none',
    menuToggleVisible:getComputedStyle(document.querySelector('#menuToggle')).display!=='none',
    touchTargets:[...document.querySelectorAll('.goal-card,.category-tile,.path-resource-button,.search-button,.clear-button,#lang')]
      .map(el=>({name:el.className||el.id,height:el.getBoundingClientRect().height,width:el.getBoundingClientRect().width}))
  }));
}
async function checkLocale(page,locale,viewportName,viewport){
  await page.setViewportSize(viewport);
  await page.goto(BASE_URL,{waitUntil:'networkidle'});
  await page.selectOption('#lang',locale);
  await page.waitForTimeout(80);

  const expected=homepageMessages(locale);
  const flow=homepageFlow(locale);
  const actual=await page.evaluate(()=>({
    lang:document.documentElement.lang,
    title:document.title,
    hero:document.querySelector('.hero h1')?.textContent?.trim(),
    goalsTitle:document.querySelector('#goals h2')?.textContent?.trim(),
    pathTitle:document.querySelector('#learningPath h2')?.textContent?.trim(),
    resourceTitle:document.querySelector('#resources h2')?.textContent?.trim(),
    directoryTitle:document.querySelector('#directory h2')?.textContent?.trim(),
    featureTitle:document.querySelector('#features h2')?.textContent?.trim(),
    gapTitle:document.querySelector('#gap h2')?.textContent?.trim(),
    allResourcesTitle:document.querySelector('#allResources h2')?.textContent?.trim(),
    aboutTitle:document.querySelector('#about h2')?.textContent?.trim(),
    options:[...document.querySelectorAll('#lang option')].map(o=>o.value),
    categoryTexts:[...document.querySelectorAll('.category-tile .tile-title')].map(el=>el.textContent.trim()),
    pathTexts:[...document.querySelectorAll('.path-card h3')].map(el=>el.textContent.trim()),
    goalTexts:[...document.querySelectorAll('.goal-card strong')].map(el=>el.textContent.trim()),
    featureTexts:[...document.querySelectorAll('.feature-card strong')].map(el=>el.textContent.trim())
  }));

  assert(actual.lang===locale,`${locale}/${viewportName}: document language mismatch`);
  assert(actual.hero===expected.heroTitle,`${locale}/${viewportName}: hero text mismatch`);
  assert(actual.goalsTitle===flow.goalTitle,`${locale}/${viewportName}: goals title mismatch`);
  assert(actual.pathTitle===flow.pathTitle,`${locale}/${viewportName}: path title mismatch`);
  assert(actual.resourceTitle===flow.resourceTitle,`${locale}/${viewportName}: resource title mismatch`);
  assert(actual.directoryTitle===expected.categories,`${locale}/${viewportName}: directory title mismatch`);
  assert(actual.featureTitle===flow.featuresTitle,`${locale}/${viewportName}: feature title mismatch`);
  assert(actual.gapTitle===flow.gapTitle,`${locale}/${viewportName}: gap title mismatch`);
  assert(actual.allResourcesTitle===flow.resourceTitle,`${locale}/${viewportName}: all-resources title mismatch`);
  assert(actual.aboutTitle===expected.aboutTitle,`${locale}/${viewportName}: about title mismatch`);
  assert(actual.options.length===15 && actual.options.every((v,i)=>v===LOCALES[i]),`${locale}/${viewportName}: language selector coverage mismatch`);
  assert(actual.categoryTexts.length===12 && actual.categoryTexts.every(Boolean),`${locale}/${viewportName}: category labels incomplete`);
  assert(actual.pathTexts.length===8 && actual.pathTexts.every(Boolean),`${locale}/${viewportName}: learning path labels incomplete`);
  assert(actual.goalTexts.length===8 && actual.goalTexts.every(Boolean),`${locale}/${viewportName}: goal labels incomplete`);
  assert(actual.featureTexts.length===5 && actual.featureTexts.every(Boolean),`${locale}/${viewportName}: feature labels incomplete`);

  const m=await metrics(page);
  assert(m.scrollWidth<=m.clientWidth+1,`${locale}/${viewportName}: horizontal overflow ${m.scrollWidth}>${m.clientWidth}`);
  assert(m.categoryCount===12,`${locale}/${viewportName}: expected 12 category tiles`);
  assert(m.pathCount===8,`${locale}/${viewportName}: expected 8 path cards`);
  assert(m.goalCount===8,`${locale}/${viewportName}: expected 8 goal cards`);
  assert(m.languageCount===15,`${locale}/${viewportName}: expected 15 language options`);
  assert(m.logoLoaded,`${locale}/${viewportName}: brand logo did not load`);
  if(viewportName==='mobile'){
    assert(m.menuToggleVisible,`${locale}/mobile: menu toggle is hidden`);
    assert(!m.menuVisible,`${locale}/mobile: navigation should start collapsed`);
    for(const target of m.touchTargets)assert(target.height>=40,`${locale}/mobile: touch target too small (${target.name}=${target.height}px)`);
    const tiles=await page.locator('.category-tile').evaluateAll(els=>els.map(el=>{const r=el.getBoundingClientRect();return{x:r.x,y:r.y,width:r.width,height:r.height}}));
    assert(tiles.length===12 && tiles[0].y===tiles[1].y && tiles[2].y>tiles[0].y,`${locale}/mobile: category grid is not two-column responsive`);
    await page.click('#menuToggle');
    await page.waitForTimeout(30);
    const open=await page.locator('#mainNav').evaluate(el=>getComputedStyle(el).display!=='none');
    assert(open,`${locale}/mobile: menu did not open`);
    await page.click('#menuToggle');
    await page.waitForTimeout(30);
    const closed=await page.locator('#mainNav').evaluate(el=>getComputedStyle(el).display==='none');
    assert(closed,`${locale}/mobile: menu did not close`);
  }else{
    assert(!m.menuToggleVisible,`${locale}/desktop: mobile menu toggle should be hidden`);
    assert(m.menuVisible,`${locale}/desktop: navigation should be visible`);
  }

  const file=join(OUT_DIR,`${locale}-${viewportName}.png`);
  await page.screenshot({path:file,fullPage:false});
  return {locale,viewport:viewportName,...m};
}

const server=startServer();
const browser=await chromium.launch({headless:true});
try{
  await waitForServer();
  const page=await browser.newPage();
  const results=[];
  for(const locale of LOCALES){
    results.push(await checkLocale(page,locale,'desktop',DESKTOP));
    results.push(await checkLocale(page,locale,'mobile',MOBILE));
  }
  const report={
    build:'BUILD 05',
    generatedAt:new Date().toISOString(),
    baseUrl:BASE_URL,
    locales:LOCALES,
    viewports:{desktop:DESKTOP,mobile:MOBILE},
    checks:results
  };
  writeFileSync(join(OUT_DIR,'report.json'),JSON.stringify(report,null,2));
  console.log(`BUILD 05 visual QA passed: ${LOCALES.length} languages × 2 viewports = ${results.length} renders.`);
}finally{
  await browser.close();
  server.kill('SIGTERM');
}
