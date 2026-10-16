import test from 'node:test';
import assert from 'node:assert/strict';
import {homepageFlow,flowLocales} from '../src/homepage-flow-i18n.js';
import {homepageMessages} from '../src/homepage-i18n.js';

const locales=['zh-TW','en','vi','id','th','fil','ja','ko','my','km','ms','hi','fr','es','de'];
test('homepage flow covers all 15 supported interface languages',()=>{
 assert.deepEqual(flowLocales,locales);
 for(const locale of locales){
  const d=homepageFlow(locale);
  for(const key of ['hero','goals','goalTitle','goalIntro','pathTitle','pathIntro','pathTitles','pathGoals','resourceTitle','resourceIntro','gapTitle','gapIntro','featuresTitle','features','search','placeholder','categoryFilter','levelFilter','notice']){
   assert.ok(d[key],locale+': '+key);
  }
  assert.equal(d.hero.length,5,locale+': hero');
  assert.equal(d.goals.length,8,locale+': goals');
  assert.equal(d.pathTitles.length,8,locale+': pathTitles');
  assert.equal(d.pathGoals.length,8,locale+': pathGoals');
  assert.ok(d.pathGoals.every(g=>g.length===3&&g.every(Boolean)),locale+': path goal completeness');
  assert.equal(d.features.length,5,locale+': feature labels');
  const ui=homepageMessages(locale);
  assert.equal(Object.keys(ui.categoryNames).length,12,locale+': category localization');
 }
});
