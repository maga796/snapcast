const { loadEnvConfig } = require('@next/env');
const { chromium } = require('playwright');
loadEnvConfig(process.cwd());
console.log(JSON.stringify({ publishableKeyPresent: Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY), secretKeyPresent: Boolean(process.env.CLERK_SECRET_KEY) }));
(async () => {
  const browser = await chromium.launch({ channel: 'msedge' });
  try {
    const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
    await page.goto('http://localhost:3000/dashboard');
    await page.waitForURL('**/sign-in**', { timeout: 60000 });
    console.log('Dashboard redirects to local sign-in.');
    await page.locator('.cl-signIn-root').waitFor({ state: 'visible', timeout: 60000 });
    console.log('Clerk sign-in form loaded.');
    await page.screenshot({ path: 'artifacts/auth-sign-in-desktop.png' });
    await page.setViewportSize({ width: 375, height: 800 });
    console.log('Mobile document width:', await page.evaluate(() => document.documentElement.scrollWidth));
    await page.screenshot({ path: 'artifacts/auth-sign-in-mobile.png' });
    await page.goto('http://localhost:3000/sign-up');
    await page.locator('.cl-signUp-root').waitFor({ state: 'visible', timeout: 60000 });
    console.log('Clerk sign-up form loaded.');
  } finally { await browser.close(); }
})().catch(() => { console.error('Auth browser verification failed; inspect the local browser or build status.'); process.exitCode = 1; });
