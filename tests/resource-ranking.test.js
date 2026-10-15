import test from 'node:test';
import assert from 'node:assert/strict';
import {groupResources,matchResource,teachingLanguages} from '../src/resource-ranking.js';

const thai={id:'thai',category:'daily',title:'Thai Chinese lessons',languageVerified:true,teachingLanguages:['th']};
const english={id:'english',category:'daily',title:'English Chinese lessons',languageVerified:true,teachingLanguages:['en']};
const unverified={id:'unknown',category:'daily',title:'Unverified Thai page',teachingLanguages:['th']};

test('Thai learners get Thai first and English second, unknown language last',()=>{
 const grouped=groupResources([english,unverified,thai],'th');
 assert.deepEqual(grouped.primary.map(x=>x.id),['thai']);
 assert.deepEqual(grouped.fallback.map(x=>x.id),['english']);
 assert.deepEqual(grouped.other.map(x=>x.id),['unknown']);
});
test('English learners do not get a duplicate English fallback',()=>{
 const grouped=groupResources([english,thai],'en');
 assert.deepEqual(grouped.primary.map(x=>x.id),['english']);
 assert.equal(grouped.fallback.length,0);
});
test('unverified language metadata is not promoted',()=>{
 assert.deepEqual(teachingLanguages(unverified),[]);
});
test('search matches localized category names and tags',()=>{
 assert.equal(matchResource(thai,'ชีวิตประจำวัน','ภาษาจีนในชีวิตประจำวัน'),true);
 assert.equal(matchResource(thai,'nonexistent','ภาษาจีนในชีวิตประจำวัน'),false);
});
