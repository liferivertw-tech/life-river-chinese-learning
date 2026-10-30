import test from 'node:test';
import assert from 'node:assert/strict';
import {preferenceDefaults,normalizePreferences,defaultsForNativeLanguage,loadPreferences,savePreferences} from '../src/learner-preferences.js';
test('preference dimensions remain independent',()=>{const p=normalizePreferences({nativeLanguage:'zh-CN',interfaceLanguage:'en',targetScript:'traditional',phoneticSystem:'pinyin'});assert.equal(p.nativeLanguage,'zh-CN');assert.equal(p.interfaceLanguage,'en');assert.equal(p.targetScript,'traditional');assert.equal(p.phoneticSystem,'pinyin');});
test('Taiwan Traditional Chinese native defaults to Traditional and Zhuyin',()=>{const p=defaultsForNativeLanguage('zh-TW');assert.equal(p.targetScript,'traditional');assert.equal(p.phoneticSystem,'zhuyin');});
test('Simplified Chinese native defaults to comparison and Pinyin',()=>{const p=defaultsForNativeLanguage('zh-CN');assert.equal(p.targetScript,'both');assert.equal(p.phoneticSystem,'pinyin');});
test('invalid preference values safely fall back',()=>{const p=normalizePreferences({nativeLanguage:'bad',targetScript:'bad',phoneticSystem:'bad'});assert.equal(p.nativeLanguage,preferenceDefaults.nativeLanguage);assert.equal(p.targetScript,preferenceDefaults.targetScript);assert.equal(p.phoneticSystem,preferenceDefaults.phoneticSystem);});
test('preferences persist through a storage adapter',()=>{let value=null;const storage={getItem:()=>value,setItem:(_k,v)=>{value=v}};const saved=savePreferences(storage,{nativeLanguage:'zh-CN',targetScript:'both'});assert.deepEqual(loadPreferences(storage),saved);});
