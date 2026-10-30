import test from 'node:test';
import assert from 'node:assert/strict';
import {shadowingUi,taiwanMandarinShadowing} from '../src/shadowing-practice.js';
test('shadowing controls are localized for all 16 interface languages',()=>{for(const locale of ['zh-TW','zh-CN','en','vi','id','th','fil','ja','ko','my','km','ms','hi','fr','es','de']){const ui=shadowingUi[locale];assert.ok(ui,locale);for(const key of ['title','intro','listen','record','stop','again','replay','ready','recording','finishing','first','privacy','meaning'])assert.ok(ui[key],locale+': '+key);}});
test('shadowing practice does not contain Hokkien or Hakka lesson data',()=>{const corpus=JSON.stringify(taiwanMandarinShadowing);assert.doesNotMatch(corpus,/臺灣台語|客語|Hokkien|Hakka/);});
