import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const main=fs.readFileSync(new URL('../src/main.js',import.meta.url),'utf8');
test('homepage resource directory renders native language first and English fallback only',()=>{
 assert.match(main,/g\.primary\.length/);
 assert.match(main,/g\.fallback\.length/);
 assert.doesNotMatch(main,/\[\.\.\.g\.primary,\.\.\.g\.fallback,\.\.\.g\.other\]/);
});
