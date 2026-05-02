const { test, expect } = require('@playwright/test');
const path = require('path');
const fs = require('fs');

const DESKTOP = { width: 1280, height: 800 };
const MOBILE  = { width: 390,  height: 844 };

const FIRST_POST_ID = '2026-05-02-cve-2026-42208-litellm-sqli-active-exploitation';

function screenshotDir(subfolder) {
  const dir = path.join(__dirname, 'screenshots', subfolder);
  fs.mkdirSync(dir, { recursive: true });
  return dir;
}

async function waitForFeed(page) {
  await page.goto('/index.html#home');
  await page.waitForSelector('#posts-grid .post-card', { timeout: 20000 });
}

// ---- Desktop ---------------------------------------------------------------

test.describe('Scroll smoothness - desktop', () => {
  test.use({ viewport: DESKTOP });

  test('homepage loads without console errors', async ({ page }) => {
    const errors = [];
    page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
    await waitForFeed(page);
    const dir = screenshotDir('after-phase1');
    await page.screenshot({ path: path.join(dir, 'desktop-home-top.png'), fullPage: false });
    expect(errors.filter(e => !e.includes('favicon') && !e.includes('net::ERR'))).toHaveLength(0);
  });

  test('sticky filter bar applies is-stuck when scrolled, removes at top', async ({ page }) => {
    await waitForFeed(page);
    await page.evaluate(() => window.scrollTo({ top: 1400, behavior: 'instant' }));
    await page.waitForTimeout(250);

    const dir = screenshotDir('after-phase1');
    await page.screenshot({ path: path.join(dir, 'desktop-home-filter-stuck.png'), fullPage: false });

    const stuck = await page.evaluate(
      () => document.querySelector('.filter-bar-wrap')?.classList.contains('is-stuck')
    );
    expect(stuck).toBe(true);

    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    await page.waitForTimeout(250);

    const unstuck = await page.evaluate(
      () => document.querySelector('.filter-bar-wrap')?.classList.contains('is-stuck')
    );
    expect(unstuck).toBe(false);
  });

  test('no is-stuck flap across threshold scroll', async ({ page }) => {
    await waitForFeed(page);

    // Use MutationObserver inside the page to count class toggles on .filter-bar-wrap
    await page.evaluate(() => {
      window._stuckToggleCount = 0;
      const wrap = document.querySelector('.filter-bar-wrap');
      if (!wrap) return;
      window._stuckObserver = new MutationObserver(mutations => {
        for (const m of mutations) {
          if (m.attributeName === 'class') {
            window._stuckToggleCount++;
          }
        }
      });
      window._stuckObserver.observe(wrap, { attributes: true, attributeFilter: ['class'] });
    });

    // Scroll from 0 to 2000 in 50px increments through the sticky threshold
    for (let y = 0; y <= 2000; y += 50) {
      await page.evaluate(pos => window.scrollTo({ top: pos, behavior: 'instant' }), y);
      await page.waitForTimeout(20);
    }

    const toggleCount = await page.evaluate(() => {
      window._stuckObserver?.disconnect();
      return window._stuckToggleCount;
    });

    // Expect at most 2 class mutations (one to add is-stuck, one is-animating on state change)
    // More than 6 would indicate rapid flapping
    expect(toggleCount).toBeLessThan(8);
  });

  test('back-to-top button: appears after 400px, click returns to top', async ({ page }) => {
    await waitForFeed(page);

    await expect(page.locator('#scroll-top-btn')).not.toHaveClass(/visible/);

    await page.evaluate(() => window.scrollTo({ top: 600, behavior: 'instant' }));
    await page.waitForTimeout(250);
    await expect(page.locator('#scroll-top-btn')).toHaveClass(/visible/);

    const dir = screenshotDir('after-phase1');
    await page.screenshot({ path: path.join(dir, 'desktop-home-scrolled-btt.png'), fullPage: false });

    await page.locator('#scroll-top-btn').click();
    await page.waitForTimeout(1200);
    const scrollY = await page.evaluate(() => window.scrollY);
    expect(scrollY).toBeLessThanOrEqual(10);
  });

  test('no horizontal overflow on homepage', async ({ page }) => {
    await waitForFeed(page);
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1
    );
    expect(overflow).toBe(false);
  });

  test('all routes render without console errors', async ({ page }) => {
    const errors = [];
    page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });

    const dir = screenshotDir('after-phase1');
    const routes = [
      { hash: '#actors',   file: 'desktop-actors.png',   selector: '#actor-table' },
      { hash: '#ioc-feed', file: 'desktop-ioc-feed.png',  selector: '.feed-card' },
      { hash: '#blog',     file: 'desktop-blog.png',      selector: 'h1.page-title' },
      { hash: '#about',    file: 'desktop-about.png',     selector: '.about-content' },
    ];

    for (const { hash, file, selector } of routes) {
      await page.goto(`/index.html${hash}`);
      await page.waitForSelector(selector, { timeout: 20000 });
      await page.screenshot({ path: path.join(dir, file), fullPage: false });
    }

    await page.goto(`/index.html#post/${FIRST_POST_ID}`);
    await page.waitForSelector('.post-content', { timeout: 20000 });
    await page.screenshot({ path: path.join(dir, 'desktop-single-post.png'), fullPage: false });

    const errs = errors.filter(e => !e.includes('favicon') && !e.includes('net::ERR'));
    expect(errs).toHaveLength(0);
  });

  test('search still works after changes', async ({ page }) => {
    await waitForFeed(page);
    const dir = screenshotDir('after-phase1');
    await page.locator('#header-search-input').fill('supply');
    await page.waitForTimeout(400);
    await page.screenshot({ path: path.join(dir, 'desktop-search-active.png'), fullPage: false });
    const count = await page.locator('#posts-grid .post-card').count();
    expect(count).toBeGreaterThan(0);
    await expect(page.locator('#feed-status')).toContainText(/matching/i);
  });

  test('IOC modal opens and closes', async ({ page }) => {
    await waitForFeed(page);
    await page.locator('.stats-row .stat-card').nth(2).click();
    await expect(page.locator('#modal-overlay.open')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.locator('#modal-overlay.open')).toHaveCount(0);
  });
});

// ---- Mobile ----------------------------------------------------------------

test.describe('Scroll smoothness - mobile', () => {
  test.use({ viewport: MOBILE });

  test('mobile: homepage loads, no horizontal overflow', async ({ page }) => {
    await waitForFeed(page);
    const dir = screenshotDir('after-phase1');
    await page.screenshot({ path: path.join(dir, 'mobile-home-top.png'), fullPage: false });

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1
    );
    expect(overflow).toBe(false);
  });

  test('mobile: nav toggle opens menu', async ({ page }) => {
    await waitForFeed(page);
    await page.locator('.nav-toggle').click();
    await expect(page.locator('.site-nav.open')).toBeVisible();
    const dir = screenshotDir('after-phase1');
    await page.screenshot({ path: path.join(dir, 'mobile-nav-open.png'), fullPage: false });
  });

  test('mobile: search modal opens, applies, closes', async ({ page }) => {
    await waitForFeed(page);
    await page.locator('#mobile-search-btn').click();
    await expect(page.locator('#search-modal-overlay.open')).toBeVisible();
    const dir = screenshotDir('after-phase1');
    await page.screenshot({ path: path.join(dir, 'mobile-search-modal.png'), fullPage: false });
    await page.keyboard.press('Escape');
    await expect(page.locator('#search-modal-overlay.open')).toHaveCount(0);
  });

  test('mobile: sticky filter bar applies is-stuck when scrolled', async ({ page }) => {
    await waitForFeed(page);
    await page.evaluate(() => window.scrollTo({ top: 1400, behavior: 'instant' }));
    await page.waitForTimeout(300);
    const stuck = await page.evaluate(
      () => document.querySelector('.filter-bar-wrap')?.classList.contains('is-stuck')
    );
    expect(stuck).toBe(true);
    const dir = screenshotDir('after-phase1');
    await page.screenshot({ path: path.join(dir, 'mobile-filter-stuck.png'), fullPage: false });
  });
});
