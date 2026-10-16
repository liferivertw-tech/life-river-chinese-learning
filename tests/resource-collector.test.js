import test from 'node:test';
import assert from 'node:assert/strict';
import {buildDiscoveryTasks,normalizeUrl,isDuplicateCandidate,validateCandidate,queueCandidate,promoteCandidate} from '../src/resource-collector.js';
import {catalog} from '../src/catalog.js';

test('buildDiscoveryTasks prioritizes uncovered learning nodes',()=>{
 const tasks=buildDiscoveryTasks(catalog,['my']);
 assert.ok(tasks.length>0);
 assert.ok(tasks.every(t=>t.locale==='my'));
 assert.ok(tasks.some(t=>t.priority==='high'||t.priority==='medium'));
 assert.ok(tasks.every(t=>Array.isArray(t.queries)&&t.queries.length===3));
 assert.ok(tasks.every(t=>t.level));
});

test('normalizeUrl removes tracking parameters and fragments',()=>{
 assert.equal(normalizeUrl('https://Example.com/a/?utm_source=x#top'),'https://example.com/a/');
});

test('duplicate detection matches normalized catalog url',()=>{
 const c={url:catalog[0].url+'?utm_source=test'};
 assert.equal(isDuplicateCandidate(c,catalog),true);
});

test('verified candidates require evidence url and check date',()=>{
 const result=validateCandidate({title:'X',url:'https://example.com',provider:'P',category:'courses',level:'入門',teachingLanguages:['th'],languageVerified:true});
 assert.equal(result.valid,false);
 assert.ok(result.issues.includes('verified-without-language-evidence'));
 assert.ok(result.issues.includes('verified-without-check-date'));
});

test('unverified discovered candidates may use a claimed language',()=>{
 const result=validateCandidate({title:'X',url:'https://example.com',provider:'P',category:'courses',level:'入門',teachingLanguages:[],languageVerified:false,languageClaimed:'th'});
 assert.equal(result.valid,true);
});

test('queue and promote verified candidate',()=>{
 const candidate={id:'sample',title:'Sample',url:'https://sample.example/course?utm_medium=x',provider:'Sample',category:'courses',level:'入門',teachingLanguages:['th'],languageVerified:true,languageEvidenceUrl:'https://sample.example/course',checkedAt:'2026-10-16',cost:'免費',script:'未核驗',format:'網站',summary:'sample'};
 const queued=queueCandidate(candidate,catalog,[]);
 assert.equal(queued.accepted,true);
 assert.equal(queued.item.reviewStatus,'ready-for-editorial-review');
 const promoted=promoteCandidate(queued.item);
 assert.equal(promoted.status,'verified');
 assert.equal(promoted.license,'link-only');
});
