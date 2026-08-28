// @ts-check
const { test, expect } = require('@playwright/test');
const BASE_URL = 'http://localhost:3000';

const VIEWPORTS = [
  { name: '375px-mobile', width: 375, height: 667 },
  { name: '1440px-desktop', width: 1440, height: 900 },
];

const ARTICLES = [
  { path: '/blog/site-web-perreux-sur-marne.html', name: 'Perreux-sur-Marne' },
  { path: '/blog/site-web-nogent-sur-marne.html', name: 'Nogent-sur-Marne' },
];

async function waitForAnimations(page) {
  await page.evaluate(async () => {
    const h = document.documentElement.scrollHeight;
    for (let y = 0; y < h; y += 400) {
      window.scrollTo(0, y);
      await new Promise(r => setTimeout(r, 50));
    }
    window.scrollTo(0, 0);
    await new Promise(r => setTimeout(r, 300));
  });
}

for (const vp of VIEWPORTS) {
  test.describe(vp.name, () => {
    test.use({ viewport: { width: vp.width, height: vp.height } });

    for (const a of ARTICLES) {
      test(`${a.name} — no overflow`, async ({ page }) => {
        await page.goto(`${BASE_URL}${a.path}`, { waitUntil: 'domcontentloaded' });
        await waitForAnimations(page);
        const sw = await page.evaluate(() => document.documentElement.scrollWidth);
        const cw = await page.evaluate(() => document.documentElement.clientWidth);
        expect(sw).toBeLessThanOrEqual(cw + 1);
      });

      test(`${a.name} — H1 exists`, async ({ page }) => {
        await page.goto(`${BASE_URL}${a.path}`, { waitUntil: 'domcontentloaded' });
        const h1 = await page.$('h1');
        expect(h1).not.toBeNull();
      });

      test(`${a.name} — CTA exists`, async ({ page }) => {
        await page.goto(`${BASE_URL}${a.path}`, { waitUntil: 'domcontentloaded' });
        const btn = await page.$('.btn-primary');
        expect(btn).not.toBeNull();
      });

      test(`${a.name} — breadcrumb exists`, async ({ page }) => {
        await page.goto(`${BASE_URL}${a.path}`, { waitUntil: 'domcontentloaded' });
        const bc = await page.$('.breadcrumb');
        expect(bc).not.toBeNull();
      });

      test(`${a.name} — no invented prices`, async ({ page }) => {
        await page.goto(`${BASE_URL}${a.path}`, { waitUntil: 'domcontentloaded' });
        const text = await page.evaluate(() => document.body.innerText);
        expect(text).not.toMatch(/\d+\s*\u20ac/);
      });

      test(`${a.name} — no invented stats`, async ({ page }) => {
        await page.goto(`${BASE_URL}${a.path}`, { waitUntil: 'domcontentloaded' });
        const text = await page.evaluate(() => document.body.innerText);
        expect(text).not.toMatch(/\d+%/);
      });
    }
  });
}
