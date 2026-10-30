import test from 'node:test';
import assert from 'node:assert/strict';
import {taiwanLanguageVarieties,taiwanSpeechSources,speechRightsRules} from '../src/taiwan-language-resources.js';
test('Taiwan Mandarin, Taiwanese and Hakka varieties are separately represented',()=>{for(const id of ['mandarin-standard','mandarin-regional','taiwanese-hokkien','hakka-sixian','hakka-hailu','hakka-other'])assert.ok(taiwanLanguageVarieties.some(x=>x.id===id));});
test('speech sources have explicit access and rights states',()=>{for(const source of taiwanSpeechSources){assert.ok(source.license,source.id);assert.ok(source.access,source.id);assert.ok(source.commercial,source.id);assert.ok(source.status,source.id);assert.ok(source.url,source.id);}});
test('restricted corpora are not presented as open download',()=>{for(const id of ['hakka-speech-db','naer-taiwanese-corpus','sinica-taiwan-mandarin']){const item=taiwanSpeechSources.find(x=>x.id===id);assert.notEqual(item.status,'usable-with-conditions');}});
test('rights safeguards are explicit',()=>assert.ok(speechRightsRules.length>=4));
