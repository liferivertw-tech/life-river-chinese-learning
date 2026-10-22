import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const auth = fs.readFileSync(new URL('../src/auth/lifeone.js', import.meta.url), 'utf8');
const main = fs.readFileSync(new URL('../src/main.js', import.meta.url), 'utf8');
const pkg = JSON.parse(fs.readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
const env = fs.readFileSync(new URL('../.env.example', import.meta.url), 'utf8');

test('Life Lingo uses approved Keycloak OIDC public client and PKCE S256', () => {
  assert.match(pkg.dependencies['keycloak-js'], /^26\.2\.0$/);
  assert.match(auth, /pkceMethod: 'S256'/);
  assert.match(auth, /onLoad: 'check-sso'/);
  assert.match(auth, /VITE_LIFEONE_URL/);
  assert.match(auth, /VITE_LIFEONE_REALM/);
  assert.match(auth, /VITE_LIFEONE_CLIENT_ID/);
  assert.match(auth, /window\.location\.origin/);
});

test('Life Lingo does not persist access or ID tokens in browser storage', () => {
  assert.doesNotMatch(auth, /localStorage|sessionStorage/);
  assert.match(auth, /getLifeOneIdentity/);
});

test('existing Chinese learning UI mounts LifeOne without replacing learning features', () => {
  assert.match(main, /mountLifeOneSignIn/);
  assert.match(main, /renderShell\(qs\('#app'\),categories\)/);
  assert.match(env, /public browser client/i);
  assert.match(env, /VITE_LIFEONE_CLIENT_ID/);
});
