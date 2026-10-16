import test from 'node:test';
import assert from 'node:assert/strict';
import {buildCoverageMatrix,coverageCell,coverageSummary,interfaceLanguages,priorityGaps} from '../src/coverage-matrix.js';
import {learningPath} from '../src/learning-path.js';

const catalog=[
 {id:'vi-sound',category:'pronunciation',languageVerified:true,teachingLanguages:['vi','en']},
 {id:'en-work',category:'work',languageVerified:true,teachingLanguages:['en']},
 {id:'other-tocfl',category:'tocfl',languageVerified:true,teachingLanguages:['zh-TW']}
];

test('matrix covers every language and learning path node',()=>{
 const matrix=buildCoverageMatrix(catalog);
 assert.equal(matrix.length,interfaceLanguages.length);
 assert.ok(matrix.every(row=>row.cells.length===learningPath.length));
});

test('native resource outranks english fallback',()=>{
 const sound=learningPath.find(n=>n.id==='sound');
 const cell=coverageCell(catalog,'vi',sound);
 assert.equal(cell.status,'native');
 assert.equal(cell.native,1);
});

test('english fallback is identified when native resource is absent',()=>{
 const work=learningPath.find(n=>n.id==='work-study');
 const cell=coverageCell(catalog,'th',work);
 assert.equal(cell.status,'english');
 assert.equal(cell.english,1);
});

test('gap summary and priority gaps expose missing native coverage',()=>{
 const summary=coverageSummary(catalog,['vi','th']);
 assert.equal(summary.length,2);
 assert.ok(summary.find(r=>r.locale==='th').gaps>0);
 const gaps=priorityGaps(catalog,['vi','th']);
 assert.ok(gaps.length>0);
 assert.notEqual(gaps[0].status,'native');
});
