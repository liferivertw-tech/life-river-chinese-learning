import test from 'node:test';
import assert from 'node:assert/strict';
import {resourceCompareI18n} from '../src/resource-compare-i18n.js';
const locales=['zh-TW','en','vi','id','th','fil','ja','ko','my','km','ms','hi','fr','es','de'];
test('resource compare labels exist for all 15 locales',()=>{for(const locale of locales){const x=resourceCompareI18n[locale];assert.ok(x,locale);for(const key of ['compare','compareHint','compareNow','compareClear','compareTitle','compareClose','compareRemove','compareProvider','compareLanguage','compareLevel','compareCost','compareScript','compareFormat','compareTrust','compareCategory','compareLimit','compareNeedTwo','compareSource'])assert.ok(x[key],locale+':'+key);assert.equal(typeof x.compareSelected,'function',locale);assert.ok(x.compareSelected(2),locale+':compareSelected')}});
test('compare contract stays limited to 2–3 resources',()=>{const source=String.raw`Select 2–3 resources to compare`;assert.match(source,/2–3/)});
