import test from 'node:test';
import assert from 'node:assert/strict';
import {catalog} from '../src/catalog.js';
import {teachingLanguages} from '../src/resource-ranking.js';

function byId(id){return catalog.find(r=>r.id===id)}

test('BUILD 19 adds verified resources for Myanmar Khmer Filipino and Malay',()=>{
 for(const [id,lang] of [
  ['myanmar-boc-my','my'],
  ['gogo-chinese-my','my'],
  ['bfl-khmer-km','km'],
  ['mandarin-master-fil','fil'],
  ['learn-mandarin-ms','ms']
 ]){
  const resource=byId(id);
  assert.ok(resource,`missing ${id}`);
  assert.equal(resource.languageVerified,true);
  assert.equal(resource.status,'verified');
  assert.ok(teachingLanguages(resource).includes(lang),`${id} should teach in ${lang}`);
  assert.ok(resource.languageEvidenceUrl);
  assert.equal(resource.checkedAt,'2026-10-16');
 }
});

test('official WDA migrant Chinese resource is verified for four worker languages',()=>{
 const resource=byId('wda-migrant-2026-th');
 assert.equal(resource.provider,'勞動部勞動力發展署');
 assert.equal(resource.status,'verified');
 assert.deepEqual(new Set(teachingLanguages(resource)),new Set(['th','id','vi','fil']));
 assert.equal(resource.cost,'免費');
});
