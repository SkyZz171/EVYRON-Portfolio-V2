// @ts-check
const { test, expect } = require('@playwright/test');

const BASE_URL = 'http://localhost:3000';

const VIEWPORTS = [
  { name: '320px-mobile', width: 320, height: 568 },
  { name: '375px-iphone-se', width: 375, height: 667 },
  { name: '390px-iphone-14', width: 390, height: 844 },
  { name: '430px-iphone-15-pro-max', width: 430, height: 932 },
  { name: '768px-ipad', width: 768, height: 1024 },
  { name: '1024px-ipad-landscape', width: 1024, height: 768 },
  { name: '1440px-desktop', width: 1440, height: 900 },
];

const PAGES = [
  { path: '/', name: 'Homepage' },
  { path: '/agence-web-france', name: 'Agence web France' },
  { path: '/creation-site-web', name: 'Creation site web' },
  { path: '/refonte-site-web', name: 'Refonte site web' },
  { path: '/seo-local', name: 'SEO local' },
  { path: '/creation-site-web-perreux-sur-marne', name: 'Perreux-sur-Marne' },
  { path: '/creation-site-web-nogent-sur-marne', name: 'Nogent-sur-Marne' },
  { path: '/blog/', name: 'Blog' },
];

/**
 * Wait for scroll-reveal animations to fire by scrolling through the page
 */
async function waitForAnimations(page) {
  await page.evaluate(async () => {
    // Scroll through entire page to trigger all IntersectionObservers
    const scrollHeight = document.documentElement.scrollHeight;
    const step = 400;
    for (let y = 0; y < scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise(r => setTimeout(r, 50));
    }
    // Scroll back to top
    window.scrollTo(0, 0);
    await new Promise(r => setTimeout(r, 300));
  });
}

/**
 * Check for horizontal overflow — the most critical responsive issue
 */
async function checkNoHorizontalOverflow(page) {
  const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
  const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
  expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1);
}

/**
 * Check that the H1 is in the DOM and has correct dimensions
 */
async function checkH1Exists(page) {
  const h1 = await page.$('h1');
  expect(h1).not.toBeNull();
  const box = await h1.boundingBox();
  expect(box).not.toBeNull();
  expect(box.width).toBeGreaterThan(0);
  expect(box.height).toBeGreaterThan(0);
}

/**
 * Check that navigation is in the DOM and has proper structure
 */
async function checkNavigation(page, viewportWidth) {
  const nav = await page.$('nav');
  expect(nav).not.toBeNull();

  if (viewportWidth <= 900) {
    // Mobile: hamburger menu should exist
    const menuBtn = await page.$('.nv-menu');
    expect(menuBtn).not.toBeNull();
    // Desktop links should be hidden
    const display = await page.evaluate(() => {
      const el = document.querySelector('.nv-links');
      return el ? window.getComputedStyle(el).display : 'none';
    });
    expect(display).toBe('none');
  } else {
    // Desktop: nav links should exist
    const navLinks = await page.$('.nv-links');
    expect(navLinks).not.toBeNull();
  }
}

/**
 * Check that CTA buttons exist on homepage
 */
async function checkCTAsExist(page) {
  const primaryBtn = await page.$('.btn-primary');
  expect(primaryBtn).not.toBeNull();
  const secondaryBtn = await page.$('.btn-secondary');
  expect(secondaryBtn).not.toBeNull();
}

/**
 * Check that footer is in the DOM
 */
async function checkFooterExists(page) {
  const footer = await page.$('footer');
  expect(footer).not.toBeNull();
}

/**
 * Check form elements are accessible on contact page
 */
async function checkFormAccessible(page) {
  const form = await page.$('#contact-form');
  if (form) {
    const inputs = await form.$$('input, select, textarea');
    expect(inputs.length).toBeGreaterThan(0);
  }
}

// ============================================
// TESTS
// ============================================

for (const viewport of VIEWPORTS) {
  test.describe(`Viewport: ${viewport.name} (${viewport.width}x${viewport.height})`, () => {
    test.use({ viewport: { width: viewport.width, height: viewport.height } });

    // Horizontal overflow tests for ALL pages
    for (const pageDef of PAGES) {
      test(`${pageDef.name} — no horizontal overflow`, async ({ page }) => {
        await page.goto(`${BASE_URL}${pageDef.path}`, { waitUntil: 'domcontentloaded' });
        await waitForAnimations(page);
        await checkNoHorizontalOverflow(page);
      });

      test(`${pageDef.name} — H1 exists and has dimensions`, async ({ page }) => {
        await page.goto(`${BASE_URL}${pageDef.path}`, { waitUntil: 'domcontentloaded' });
        await waitForAnimations(page);
        await checkH1Exists(page);
      });
    }

    // Homepage-specific structural tests
    test('Homepage — navigation structure', async ({ page }) => {
      await page.goto(`${BASE_URL}/`, { waitUntil: 'domcontentloaded' });
      await checkNavigation(page, viewport.width);
    });

    test('Homepage — CTA buttons exist', async ({ page }) => {
      await page.goto(`${BASE_URL}/`, { waitUntil: 'domcontentloaded' });
      await checkCTAsExist(page);
    });

    test('Homepage — footer exists', async ({ page }) => {
      await page.goto(`${BASE_URL}/`, { waitUntil: 'domcontentloaded' });
      await checkFooterExists(page);
    });

    // Contact form structural test
    test('Homepage — form accessible', async ({ page }) => {
      await page.goto(`${BASE_URL}/`, { waitUntil: 'domcontentloaded' });
      await page.evaluate(() => {
        const contact = document.getElementById('contact');
        if (contact) contact.scrollIntoView();
      });
      await new Promise(r => setTimeout(r, 300));
      await checkFormAccessible(page);
    });

    // Visual screenshot for manual review
    test(`Screenshot — ${viewport.name}`, async ({ page }) => {
      await page.goto(`${BASE_URL}/`, { waitUntil: 'domcontentloaded' });
      await waitForAnimations(page);
      await page.screenshot({ 
        path: `tests/screenshots/homepage-${viewport.name}.png`,
        fullPage: true 
      });
    });
  });
}
