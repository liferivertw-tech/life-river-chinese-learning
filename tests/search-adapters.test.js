import test from 'node:test';
import assert from 'node:assert/strict';
import {buildProviderRequest,mapProviderResults,searchProviderFromEnv} from '../src/search-adapters.js';

test('provider auto-detection prefers configured Bing then Google',()=>{
  assert.equal(searchProviderFromEnv({BING_SEARCH_KEY:'x'}),'bing');
  assert.equal(searchProviderFromEnv({GOOGLE_CSE_KEY:'x',GOOGLE_CSE_CX:'y'}),'google');
  assert.equal(searchProviderFromEnv({}),'none');
});

test('Bing request contains query and auth header',()=>{
  const r=buildProviderRequest('bing','learn Mandarin Thai',{BING_SEARCH_KEY:'secret',SEARCH_RESULT_COUNT:'3'});
  assert.match(r.url,/q=learn\+Mandarin\+Thai/);
  assert.equal(r.headers['Ocp-Apim-Subscription-Key'],'secret');
});

test('Google request contains CSE parameters',()=>{
  const r=buildProviderRequest('google','learn Mandarin Vietnamese',{GOOGLE_CSE_KEY:'key',GOOGLE_CSE_CX:'cx'});
  assert.match(r.url,/key=key/);
  assert.match(r.url,/cx=cx/);
});

test('provider results become unverified review candidates',()=>{
  const rows=mapProviderResults('bing',{webPages:{value:[{name:'Example Chinese',url:'https://example.com/chinese',snippet:'Thai explanation'}]}},{id:'task-1',locale:'th',nodeId:'sound',categories:['pronunciation'],queries:['learn Mandarin Thai'],level:'零基礎'});
  assert.equal(rows.length,1);
  assert.equal(rows[0].languageVerified,false);
  assert.deepEqual(rows[0].teachingLanguages,[]);
  assert.equal(rows[0].languageClaimed,'th');
  assert.equal(rows[0].discovery.taskId,'task-1');
});
