import test from 'node:test';
import assert from 'node:assert/strict';
import {recommendationI18n} from '../src/recommendation-i18n.js';
const locales=['zh-TW','en','vi','id','th','fil','ja','ko','my','km','ms','hi','fr','es','de'];
test('trust layer has A/B/C labels for all 15 locales',()=>{for(const locale of locales){const x=recommendationI18n[locale];assert.ok(x,locale);for(const key of ['trustHeading','trustA','trustB','trustC','trustTooltip','trustALegend','trustBCLabel'])assert.ok(x[key],locale+':'+key);}});
