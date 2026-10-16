import test from 'node:test';
import assert from 'node:assert/strict';
import {resourceFavoritesI18n} from '../src/resource-favorites-i18n.js';

const locales=['zh-TW','en','vi','id','th','fil','ja','ko','my','km','ms','hi','fr','es','de'];
const required=['favoriteAdd','favoriteRemove','favoritesTitle','favoritesEmpty','favoritesOpen','favoritesClear','favoritesClose','favoritesSource','favoritesLocalNote','favoritesRemoved','favoritesAdded'];

test('favorites UI contract exists for all 15 locales',()=>{
 for(const locale of locales){
  const x=resourceFavoritesI18n[locale];
  assert.ok(x,locale);
  for(const key of required)assert.ok(x[key],`${locale}:${key}`);
  assert.equal(typeof x.favoritesCount,'function',locale);
  assert.ok(x.favoritesCount(2),locale);
 }
});
