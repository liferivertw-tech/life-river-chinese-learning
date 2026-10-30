import test from 'node:test';
import assert from 'node:assert/strict';
import {convertChineseText,createStrokeWriter,strokeDataLicense} from '../src/hanzi-opencc.js';
test('OpenCC converts Simplified Chinese to Taiwan Traditional Chinese',()=>{assert.equal(convertChineseText('汉语','toTraditional'),'漢語');assert.equal(convertChineseText('我想买一张车票。','toTraditional'),'我想買一張車票。');});
test('OpenCC converts Taiwan Traditional Chinese to Simplified Chinese',()=>{assert.equal(convertChineseText('漢語','toSimplified'),'汉语');assert.equal(convertChineseText('我想買一張車票。','toSimplified'),'我想买一张车票。');});
test('OpenCC rejects unsupported directions and non-string inputs',()=>{assert.throws(()=>convertChineseText('中文','bad'),RangeError);assert.throws(()=>convertChineseText(null),TypeError);});
test('Hanzi Writer requires an element and exactly one character',()=>{assert.throws(()=>createStrokeWriter(null,'學'),TypeError);assert.throws(()=>createStrokeWriter({},'學習'),TypeError);});
test('stroke data license is explicit and separate from Hanzi Writer code license',()=>{assert.equal(strokeDataLicense.name,'Arphic Public License');assert.equal(strokeDataLicense.version,'hanzi-writer-data@2.0.1');});
