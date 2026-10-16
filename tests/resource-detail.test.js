import test from 'node:test';
import assert from 'node:assert/strict';
import {resourceDetailI18n} from '../src/resource-detail-i18n.js';

const locales=['zh-TW','en','vi','id','th','fil','ja','ko','my','km','ms','hi','fr','es','de'];

test('resource detail labels exist for all 15 locales',()=>{
 for(const locale of locales){
  const ui=resourceDetailI18n[locale];
  assert.ok(ui,locale);
  for(const key of ['detailButton','detailTitle','detailClose','detailBestFor','detailLearn','detailLanguage','detailLevel','detailCost','detailScript','detailFormat','detailTrust','detailChecked','detailReasons','detailSource','detailUnknown'])assert.ok(ui[key],`${locale}:${key}`);
  assert.equal(typeof ui.bestFor,'function',`${locale}:bestFor`);
  assert.equal(typeof ui.learn,'function',`${locale}:learn`);
 }
});
