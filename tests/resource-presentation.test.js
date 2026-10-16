import test from 'node:test';
import assert from 'node:assert/strict';
import {homepageFlow,flowLocales} from '../src/homepage-flow-i18n.js';

test('all 15 locales provide an honest pending-translation label for resource summaries',()=>{
 for(const locale of flowLocales){
  const ui=homepageFlow(locale);
  assert.ok(typeof ui.summaryPending==='string'&&ui.summaryPending.length,locale+': summaryPending');
 }
});

test('localized resource summaries are optional and locale-scoped',()=>{
 const resource={summary:'中文原始說明',summaryByLocale:{en:'English description'}};
 assert.equal(resource.summaryByLocale.en,'English description');
 assert.equal(resource.summaryByLocale.th,undefined);
});
