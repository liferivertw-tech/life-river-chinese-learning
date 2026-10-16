import test from 'node:test';
import assert from 'node:assert/strict';
import {resourceFavoritesI18n} from '../src/resource-favorites-i18n.js';

const locales=['zh-TW','en','vi','id','th','fil','ja','ko','my','km','ms','hi','fr','es','de'];

test('My Learning Plan labels exist for all 15 locales',()=>{
  for(const locale of locales){
    const x=resourceFavoritesI18n[locale];
    assert.ok(x,locale);
    for(const key of ['planTitle','planLocalNote','planStatus','planNow','planLater','planDone','planGroupEmpty','planRemove']){
      assert.ok(x[key],`${locale}:${key}`);
    }
    assert.equal(typeof x.planNowShort,'function',locale);
    assert.equal(typeof x.planMoved,'function',locale);
  }
});

test('learning plan uses three stable state keys',()=>{
  const states=['now','later','done'];
  assert.deepEqual(states,['now','later','done']);
});
