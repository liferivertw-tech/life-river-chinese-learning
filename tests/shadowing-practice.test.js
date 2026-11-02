import test from 'node:test';
import assert from 'node:assert/strict';
import {taiwanMandarinShadowing} from '../src/shadowing-practice.js';
test('shadowing bank has six reviewed Taiwan Mandarin daily situations',()=>{assert.equal(taiwanMandarinShadowing.length,6);assert.equal(new Set(taiwanMandarinShadowing.map(x=>x.id)).size,6);});
test('every shadowing sentence has Traditional, Simplified, Pinyin and meaning',()=>{for(const item of taiwanMandarinShadowing){assert.ok(item.traditional.length>0,item.id);assert.ok(item.simplified.length>0,item.id);assert.ok(item.pinyin.length>0,item.id);assert.ok(item.meaning.length>0,item.id);}});
test('sentence bank focuses on Taiwan Mandarin vocabulary and examples',()=>{const mrt=taiwanMandarinShadowing.find(x=>x.id==='directions');assert.match(mrt.traditional,/捷運/);assert.match(mrt.simplified,/地铁/);const ticket=taiwanMandarinShadowing.find(x=>x.id==='ticket');assert.match(ticket.traditional,/臺南/);});
