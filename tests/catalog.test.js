import test from 'node:test';
import assert from 'node:assert/strict';
import {catalog,categories} from '../src/catalog.js';
import {groupResources} from '../src/resource-ranking.js';
const ids=new Set(catalog.map(r=>r.id));
test('resource identifiers are unique',()=>assert.equal(ids.size,catalog.length));
test('resources have valid categories and https URLs',()=>{
 const valid=new Set(categories.map(([id])=>id));
 for(const r of catalog){assert.ok(valid.has(r.category),r.id);assert.equal(new URL(r.url).protocol,'https:',r.id);}
});
test('Vietnamese learners receive Vietnamese teaching resources first',()=>{
 const g=groupResources(catalog,'vi');
 assert.ok(g.primary.length>=4);
 assert.ok(g.primary.every(r=>r.languageVerified===true&&r.teachingLanguages.includes('vi')));
});
test('Indonesian learners receive Indonesian teaching resources first',()=>{
 const g=groupResources(catalog,'id');
 assert.ok(g.primary.length>=3);
 assert.ok(g.primary.every(r=>r.languageVerified===true&&r.teachingLanguages.includes('id')));
});
