import test from 'node:test';
import assert from 'node:assert/strict';
import {technologyRegistry,getTechnology} from '../src/technology-registry.js';
test('technology registry has unique stable identifiers',()=>{const ids=technologyRegistry.map(x=>x.id);assert.equal(new Set(ids).size,ids.length);});
test('all requested open-source technologies are represented',()=>{for(const id of ['hanzi-writer','opencc','pypinyin','moedict','faster-whisper','funasr','paddleocr','rime','taiwan-speech-corpora'])assert.ok(getTechnology(id),id);});
test('each record includes source, scope, integration and review date',()=>{for(const x of technologyRegistry){assert.ok(x.source,x.id);assert.ok(x.licenseScope,x.id);assert.ok(x.integration,x.id);assert.equal(x.checkedAt,'2026-10-31');assert.ok(x.compatibility,x.id);}});
test('model and dataset rights are not inferred from source code licenses',()=>{for(const id of ['faster-whisper','funasr','paddleocr']){const x=getTechnology(id);assert.ok(x.dataDependencies.length);assert.ok(x.dataDependencies.every(d=>d.commercialUse==='blocked-until-model-selected-and-reviewed'));}});
test('Moedict and regional speech data remain blocked pending rights review',()=>{for(const id of ['moedict','taiwan-speech-corpora'])assert.equal(getTechnology(id).status,'rights-review-required');});
test('Hanzi Writer code and stroke data retain separate licenses',()=>{const x=getTechnology('hanzi-writer');assert.equal(x.license,'MIT');assert.equal(x.dataDependencies[0].license,'Arphic Public License');});
