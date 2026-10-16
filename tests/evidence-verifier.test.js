import test from 'node:test';
import assert from 'node:assert/strict';
import {extractPageText,scoreLanguageEvidence,verifyCandidateUrl} from '../src/evidence-verifier.js';

test('Thai evidence requires Thai script and learning terms',()=>{
 const result=scoreLanguageEvidence('th','<p>เรียนภาษาจีน บทเรียน ภาษาจีนกลาง</p>');
 assert.equal(result.verdict,'strong');
 assert.ok(result.matchedTerms.length>=2);
});

test('Vietnamese evidence is detected from Vietnamese teaching terms',()=>{
 const result=scoreLanguageEvidence('vi','Học tiếng Trung cơ bản và luyện phát âm.');
 assert.equal(result.verdict,'strong');
});

test('random English page is not strong Vietnamese evidence',()=>{
 const result=scoreLanguageEvidence('vi','Learn Mandarin pronunciation and vocabulary.');
 assert.notEqual(result.verdict,'strong');
});

test('HTML extraction removes scripts and markup',()=>{
 assert.equal(extractPageText('<script>tiếng trung</script><p>Học tiếng Trung</p>'),'Học tiếng Trung');
});

test('candidate verifier never auto-promotes',async()=>{
 const result=await verifyCandidateUrl({id:'x',url:'https://example.test',languageClaimed:'th'},{fetchImpl:async()=>({ok:true,text:async()=>'<p>เรียนภาษาจีน บทเรียน ภาษาจีนกลาง</p>'})});
 assert.equal(result.state,'evidence-strong');
 assert.equal(result.evidence.verdict,'strong');
});
