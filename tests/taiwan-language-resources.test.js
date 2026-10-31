import test from 'node:test';
import assert from 'node:assert/strict';
import {taiwanLanguageVarieties,taiwanSpeechSources,speechRightsRules} from '../src/taiwan-language-resources.js';
test('only Taiwan Mandarin varieties are in this product scope',()=>{assert.deepEqual(taiwanLanguageVarieties.map(x=>x.id),['mandarin-standard','mandarin-regional']);});
test('speech sources cover standard and regional Taiwan Mandarin only',()=>{assert.deepEqual(new Set(taiwanSpeechSources.map(x=>x.variety)),new Set(['mandarin-standard','mandarin-regional']));for(const source of taiwanSpeechSources){assert.ok(source.license);assert.ok(source.access);assert.ok(source.commercial);assert.ok(source.status);assert.ok(source.url);}});
test('restricted corpora are not presented as open download',()=>{assert.notEqual(taiwanSpeechSources.find(x=>x.id==='sinica-taiwan-mandarin').status,'usable-with-conditions');});
test('rights safeguards are explicit',()=>assert.ok(speechRightsRules.length>=4));
