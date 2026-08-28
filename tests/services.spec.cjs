// @ts-check
const { test, expect } = require('@playwright/test');

const BASE_URL = 'http://localhost:3000';

const VIEWPORTS = [
  { name: '375px-mobile', width: 375, height: 667 },
  { name: '768px-tablet', width: 768, height: 1024 },
  { name: '1440px-desktop', width: 1440, height: 900 },
];

const SERVICE_PAGES = [
  { path: '/services/design-ui-ux.html', name: 'Design UI/UX' },
  { path: '/services/developpement-web.html', name: 'Développement Web' },
  { path: '/services/seo-performance.html', name: 'SEO & Performance' },
  { path: '/services/maintenance-support.html', name: 'Maintenance' },
  { path: '/services/strategie-digitale.html', name: 'Stratégie Digitale' },
];

async function waitForAnimations(page) {
  await page.evaluate(async () => {
    const scrollHeight = document.documentElement.scrollHeight;
    for (let y = 0; y < scrollHeight; y += 400) {
      window.scrollTo(0, y);
      await new Promise(r => setTimeout(r, 50));
    }
    window.scrollTo(0, 0);
    await new Promise(r => setTimeout(r, 300));
  });
}

for (const viewport of VIEWPORTS) {
  test.describe(`Viewport: ${viewport.name}`, () => {
    test.use({ viewport: { width: viewport.width, height: viewport.height } });

    for (const pageDef of SERVICE_PAGES) {
      test(`${pageDef.name} — no horizontal overflow`, async ({ page }) => {
        await page.goto(`${BASE_URL}${pageDef.path}`, { waitUntil: 'domcontentloaded' });
        await waitForAnimations(page);
        const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
        const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
        expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1);
      });

      test(`${pageDef.name} — H1 exists`, async ({ page }) => {
        await page.goto(`${BASE_URL}${pageDef.path}`, { waitUntil: 'domcontentloaded' });
        const h1 = await page.$('h1');
        expect(h1).not.toBeNull();
      });

      test(`${pageDef.name} — CTA button exists`, async ({ page }) => {
        await page.goto(`${BASE_URL}${pageDef.path}`, { waitUntil: 'domcontentloaded' });
        const btn = await page.$('.btn-primary');
        expect(btn).not.toBeNull();
      });

      test(`${pageDef.name} — breadcrumb exists`, async ({ page }) => {
        await page.goto(`${BASE_URL}${pageDef.path}`, { waitUntil: 'domcontentloaded' });
        const bc = await page.$('.breadcrumb');
        expect(bc).not.toBeNull();
      });

      test(`${pageDef.name} — no invented prices`, async ({ page }) => {
        await page.goto(`${BASE_URL}${pageDef.path}`, { waitUntil: 'domcontentloaded' });
        const text = await page.evaluate(() => document.body.innerText);
        expect(text).not.toMatch(/\d+\s*€/);
      });

      test(`${pageDef.name} — no invented stats`, async ({ page }) => {
        await page.goto(`${BASE_URL}${pageDef.path}`, { waitUntil: 'domcontentloaded' });
        const text = await page.evaluate(() => document.body.innerText);
        expect(text).not.toMatch(/\d+%/);
      });
    }

    test(`Screenshot services — ${viewport.name}`, async ({ page }) => {
      await page.goto(`${BASE_URL}/services/design-ui-ux.html`, { waitUntil: 'domcontentloaded' });
      await waitForAnimations(page);
      await page.screenshot({ 
        path: `tests/screenshots/services-design-${viewport.name}.png`,
        fullPage: true 
      });
    });
  });
}
