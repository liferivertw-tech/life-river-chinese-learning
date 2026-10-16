import test from 'node:test';
import assert from 'node:assert/strict';
import {recommendationI18n} from '../src/recommendation-i18n.js';
const locales=['zh-TW','en','vi','id','th','fil','ja','ko','my','km','ms','hi','fr','es','de'];
test('goal recommendation copy exists for all 15 locales',()=>{for(const locale of locales){const x=recommendationI18n[locale];assert.ok(x,locale);assert.ok(x.goalLevelLabel,locale);assert.equal(typeof x.recommendationNote,'function',locale);assert.ok(x.recommendationNote('Beginner'),locale)}});
