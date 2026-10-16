import test from 'node:test';
import assert from 'node:assert/strict';
import {learningPath,resourcesForNode,learningPathStats} from '../src/learning-path.js';
import {catalog} from '../src/catalog.js';

test('BUILD 17 learning path has eight ordered nodes',()=>{
 assert.equal(learningPath.length,8);
 assert.deepEqual(learningPath.map(x=>x.order),[1,2,3,4,5,6,7,8]);
 assert.equal(new Set(learningPath.map(x=>x.id)).size,8);
});

test('every learning path node maps to at least one existing category',()=>{
 for(const node of learningPath){
  assert.ok(node.categories.length>0,node.id);
  assert.ok(node.categories.every(Boolean),node.id);
 }
});

test('resource mapping preserves locale-first then English fallback grouping',()=>{
 const node=learningPath.find(x=>x.id==='basics');
 const result=resourcesForNode(node,catalog,'th');
 assert.ok(Array.isArray(result.ordered));
 assert.equal(result.ordered.length,result.rows.length);
 assert.equal(result.grouped.primary.length+result.grouped.fallback.length+result.grouped.other.length,result.rows.length);
});

test('stats report all nodes',()=>{
 const stats=learningPathStats(catalog,'vi');
 assert.equal(stats.length,learningPath.length);
 assert.ok(stats.every(x=>Number.isInteger(x.total)&&x.total>=0));
});
