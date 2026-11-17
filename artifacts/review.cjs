const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ channel: 'msedge' });
  const page = await browser.newPage();
  page.on('pageerror', error => console.log(error.message));
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('http://localhost:3000/ui-review');
  await page.getByRole('heading', { name: 'Dashboard', exact: true }).waitFor();
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: 'artifacts/dashboard-desktop.png' });
  await page.setViewportSize({ width: 375, height: 800 });
  await page.screenshot({ path: 'artifacts/dashboard-mobile.png' });
  console.log('mobile width', await page.evaluate(() => document.documentElement.scrollWidth));
  await browser.close();
})();
