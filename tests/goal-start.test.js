import test from 'node:test';
import assert from 'node:assert/strict';
import {homepageFlow,flowLocales} from '../src/homepage-flow-i18n.js';

test('all 15 locales provide localized goal starting-point guidance',()=>{
 for(const locale of flowLocales){
  const ui=homepageFlow(locale);
  assert.ok(ui.goalStartTitle,locale+': goalStartTitle');
  assert.equal(typeof ui.goalStart,'function',locale+': goalStart');
  assert.ok(ui.goalStartAction,locale+': goalStartAction');
  assert.match(ui.goalStart('A','B'),'A');
 }
});
