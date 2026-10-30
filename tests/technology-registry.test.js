import test from 'node:test';
import assert from 'node:assert/strict';
import {technologyRegistry,getTechnology} from '../src/technology-registry.js';
test('technology registry has unique stable identifiers',()=>{const ids=technologyRegistry.map(x=>x.id);assert.equal(new Set(ids).size,ids.length);});
test('all requested open-source technologies are represented',()=>{for(const id of ['hanzi-writer','opencc','pypinyin','moedict','faster-whisper','funasr','paddleocr','rime','taiwan-speech-corpora'])assert.ok(getTechnology(id),id);});
test('each record includes source, scope, integration and review date',()=>{for(const x of technologyRegistry){assert.ok(x.source,x.id);assert.ok(x.licenseScope,x.id);assert.ok(x.integration,x.id);assert.equal(x.checkedAt,'2026-10-31');assert.ok(x.compatibility,x.id);}});
test('model and dataset rights are recorded separately from source code licenses',()=>{for(const id of ['faster-whisper','funasr','paddleocr']){const x=getTechnology(id);assert.ok(x.dataDependencies.length);assert.ok(x.dataDependencies.every(d=>d.license));assert.ok(x.dataDependencies.every(d=>d.commercialUse));}});
test('Moedict attribution restrictions and regional speech rights are explicit',()=>{assert.equal(getTechnology('moedict').status,'restricted-attribution-required');assert.match(getTechnology('moedict').license,/CC BY-ND 3.0 Taiwan/);assert.equal(getTechnology('taiwan-speech-corpora').status,'rights-review-required');});
test('Hanzi Writer code and stroke data retain separate licenses',()=>{const x=getTechnology('hanzi-writer');assert.equal(x.license,'MIT');assert.equal(x.dataDependencies[0].license,'Arphic Public License');});
