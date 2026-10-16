import test from 'node:test';
import assert from 'node:assert/strict';
import {onboardingI18n} from '../src/onboarding-i18n.js';
const locales=['zh-TW','en','vi','id','th','fil','ja','ko','my','km','ms','hi','fr','es','de'];
test('first-visit onboarding is localized for all 15 interface languages',()=>{for(const locale of locales){const x=onboardingI18n[locale];assert.ok(x,locale);assert.ok(x.startGuideTitle,locale);assert.equal(x.startSteps.length,3,locale);for(const step of x.startSteps){assert.ok(step.title,locale);assert.ok(step.body,locale)}}});
