import test from 'node:test';
import assert from 'node:assert/strict';
import {homepageFlow,flowLocales} from '../src/homepage-flow-i18n.js';

test('all 15 homepage locales localize resource metadata',()=>{
 for(const locale of flowLocales){
  const ui=homepageFlow(locale);
  assert.ok(ui.costMap,locale+': costMap');
  assert.ok(ui.scriptMap,locale+': scriptMap');
  for(const key of ['免費','免費內容','部分免費','付費','付費內容','未核驗']) assert.ok(ui.costMap[key],locale+': '+key);
  for(const key of ['繁體中文','簡體中文','繁體與簡體選項','未核驗']) assert.ok(ui.scriptMap[key],locale+': '+key);
 }
});
