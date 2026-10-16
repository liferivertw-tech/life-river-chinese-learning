import test from 'node:test';
import assert from 'node:assert/strict';
import {homepageMessages} from '../src/homepage-i18n.js';
import {categories} from '../src/catalog.js';
const locales=['zh-TW','en','vi','id','th','fil','ja','ko','my','km','ms','hi','fr','es','de'];
test('all supported languages have homepage coverage',()=>{
 for(const code of locales){
  const d=homepageMessages(code);
  for(const key of ['navHome','navCategories','navFeatured','navAbout','heroTitle','searchButton','searchPlaceholder','aboutTitle','notice','menuOpen','menuClose'])assert.ok(typeof d[key]==='string'&&d[key].length,code+': '+key);
  for(const [id] of categories)assert.ok(d.categoryNames[id],code+': category '+id);
  assert.equal(d.quick.length,4);
 }
});
