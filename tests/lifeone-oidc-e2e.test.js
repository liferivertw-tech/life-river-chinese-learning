import test from 'node:test';
import assert from 'node:assert/strict';
import { chromium } from 'playwright';

test('Life Lingo signs up through real LifeOne Keycloak and returns to preserved learning UI', { timeout: 90000, skip: process.env.RUN_LIFEONE_E2E !== '1' }, async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  try {
    await page.goto('http://127.0.0.1:4173/');
    const signIn = page.getByRole('button', { name: /使用 LifeOne 登入/i });
    await signIn.waitFor({ state: 'visible' });
    await signIn.click();
    await page.waitForURL(/127\.0\.0\.1:18080\/realms\/life-lingo-e2e\/protocol\/openid-connect\/auth/);
    await page.getByRole('link', { name: /register/i }).click();
    await page.waitForURL(/login-actions\/registration/);
    await page.locator('input[name="username"]').fill(process.env.E2E_USERNAME);
    await page.locator('input[name="email"]').fill(process.env.E2E_EMAIL);
    await page.locator('input[name="firstName"]').fill('Life');
    await page.locator('input[name="lastName"]').fill('Lingo');
    await page.locator('input[name="password"]').fill(process.env.E2E_PASSWORD);
    await page.locator('input[name="password-confirm"]').fill(process.env.E2E_PASSWORD);
    await page.locator('form#kc-register-form button[type="submit"], form#kc-register-form input[type="submit"], button[type="submit"], input[type="submit"]').last().click();
    await page.waitForURL('http://127.0.0.1:4173/**', { timeout: 30000 });
    await page.getByRole('button', { name: /LifeOne 已登入/i }).waitFor({ timeout: 30000 });
    assert.ok(await page.locator('#app').count() === 1, 'existing learning UI shell remains mounted');
    assert.ok(await page.locator('#resourceResults').count() === 1, 'existing learning resource results remain mounted');
    console.log('LIFE_LINGO_OIDC_E2E_PASS: real Keycloak self-registration, PKCE login and return to existing learning UI');
  } finally {
    await context.close();
    await browser.close();
  }
});
