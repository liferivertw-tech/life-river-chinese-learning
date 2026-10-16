import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const main=fs.readFileSync(new URL('../src/main.js',import.meta.url),'utf8');
const shell=fs.readFileSync(new URL('../src/ui-shell.js',import.meta.url),'utf8');
const css=fs.readFileSync(new URL('../src/style.css',import.meta.url),'utf8');

test('homepage does not hard-code quick-search display text',()=>{
 assert.match(shell,/data-category="tocfl"/);
 assert.match(shell,/data-query="pronunciation"/);
 assert.match(shell,/data-query="vocabulary"/);
 assert.match(shell,/data-query="daily"/);
 assert.doesNotMatch(shell,/data-query="發音"/);
 assert.doesNotMatch(shell,/data-query="詞彙"/);
 assert.doesNotMatch(shell,/data-query="生活中文"/);
});

test('homepage chrome is localized by selected locale',()=>{
 assert.match(main,/const brandLabels=/);
 assert.match(main,/qs\('\.hero-eyebrow'\)\.textContent=brand\[0\]/);
 assert.match(main,/qs\('#siteFooter'\)\.textContent=/);
});

test('goal cards expose selected state accessibly and mobile controls have touch targets',()=>{
 assert.match(main,/setAttribute\('aria-pressed'/);
 assert.match(css,/\.goal-card,.path-resource-button,.category-tile/);
 assert.match(css,/min-height:44px/);
});
