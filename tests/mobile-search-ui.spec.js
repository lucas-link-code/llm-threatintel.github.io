const { test, expect } = require('@playwright/test');
const path = require('path');

const MOBILE_VIEWPORTS = [
  { name: 'iphone14pro', width: 393, height: 852 },
  { name: 'iphone14promax', width: 430, height: 932 },
  { name: 'mobile375', width: 375, height: 667 },
];

const SCREENSHOTS_DIR = 'tests/screenshots/mobile-search-ui';

async function waitForFeed(page) {
  await page.goto('/index.html#home');
  await page.waitForSelector('#posts-grid .post-card', { timeout: 20000 });
}

for (const vp of MOBILE_VIEWPORTS) {
  test.describe(`Mobile header + search modal — ${vp.name} (${vp.width}x${vp.height})`, () => {
    test.use({ viewport: { width: vp.width, height: vp.height } });

    test('logo is left-aligned, search and hamburger are grouped on the right', async ({ page }) => {
      await waitForFeed(page);
      await page.screenshot({ path: `${SCREENSHOTS_DIR}/${vp.name}-header.png`, fullPage: false });

      const logo = page.locator('.site-logo');
      const searchBtn = page.locator('#mobile-search-btn');
      const navToggle = page.locator('.nav-toggle');

      await expect(logo).toBeVisible();
      await expect(searchBtn).toBeVisible();
      await expect(navToggle).toBeVisible();
      await expect(page.locator('#header-search-input')).not.toBeVisible();

      const logoBox = await logo.boundingBox();
      const searchBox = await searchBtn.boundingBox();
      const toggleBox = await navToggle.boundingBox();

      // logo left edge is near viewport left
      expect(logoBox.x).toBeLessThan(60);

      // search button is to the right of the logo
      expect(searchBox.x).toBeGreaterThan(logoBox.x + logoBox.width);

      // hamburger is to the right of the search button (or at minimum right of logo)
      expect(toggleBox.x).toBeGreaterThan(logoBox.x + logoBox.width);

      // search and hamburger are close together (gap < 20px)
      const gap = Math.abs(toggleBox.x - (searchBox.x + searchBox.width));
      expect(gap).toBeLessThan(20);

      // both controls are in the right half of the viewport
      expect(searchBox.x).toBeGreaterThan(vp.width / 2);
      expect(toggleBox.x).toBeGreaterThan(vp.width / 2);
    });

    test('search modal opens as bottom sheet within viewport', async ({ page }) => {
      await waitForFeed(page);
      await page.locator('#mobile-search-btn').click();
      await expect(page.locator('#search-modal-overlay.open')).toBeVisible();
      await page.screenshot({ path: `${SCREENSHOTS_DIR}/${vp.name}-modal-open.png`, fullPage: false });

      const modal = page.locator('.search-modal');
      await expect(modal).toBeVisible();

      const box = await modal.boundingBox();
      // modal does not overflow beyond viewport width
      expect(box.x).toBeGreaterThanOrEqual(0);
      expect(box.x + box.width).toBeLessThanOrEqual(vp.width + 1);
      // modal bottom is within viewport height
      expect(box.y + box.height).toBeLessThanOrEqual(vp.height + 2);
    });

    test('no horizontal overflow on modal or its children', async ({ page }) => {
      await waitForFeed(page);
      await page.locator('#mobile-search-btn').click();
      await expect(page.locator('#search-modal-overlay.open')).toBeVisible();

      // modal itself must not overflow its own width
      const modalOverflow = await page.evaluate(() => {
        const el = document.querySelector('.search-modal');
        return el ? el.scrollWidth > el.clientWidth + 2 : false;
      });
      expect(modalOverflow).toBe(false);

      // no action button extends beyond viewport right edge
      const actionOverflow = await page.evaluate((vpw) => {
        const btns = document.querySelectorAll('.search-modal-actions .btn');
        for (const btn of btns) {
          const r = btn.getBoundingClientRect();
          if (r.right > vpw + 2) return true;
        }
        return false;
      }, vp.width);
      expect(actionOverflow).toBe(false);

      // input must not extend beyond viewport right edge
      const inputOverflow = await page.evaluate((vpw) => {
        const el = document.getElementById('mobile-search-input');
        if (!el) return false;
        return el.getBoundingClientRect().right > vpw + 2;
      }, vp.width);
      expect(inputOverflow).toBe(false);
    });

    test('mobile search input font-size is at least 16px', async ({ page }) => {
      await waitForFeed(page);
      await page.locator('#mobile-search-btn').click();
      await expect(page.locator('#search-modal-overlay.open')).toBeVisible();

      const fontSize = await page.evaluate(() => {
        const el = document.getElementById('mobile-search-input');
        if (!el) return 0;
        return parseFloat(window.getComputedStyle(el).fontSize);
      });
      expect(fontSize).toBeGreaterThanOrEqual(16);
    });

    test('body scroll is locked when modal is open', async ({ page }) => {
      await waitForFeed(page);
      await page.locator('#mobile-search-btn').click();
      await expect(page.locator('#search-modal-overlay.open')).toBeVisible();

      const bodyLocked = await page.evaluate(() => {
        return document.body.classList.contains('search-modal-open');
      });
      expect(bodyLocked).toBe(true);
    });

    test('close modal restores body scroll and body class is removed', async ({ page }) => {
      await waitForFeed(page);
      await page.locator('#mobile-search-btn').click();
      await expect(page.locator('#search-modal-overlay.open')).toBeVisible();
      await page.locator('#mobile-search-close').click();
      await expect(page.locator('#search-modal-overlay.open')).toHaveCount(0);

      const bodyUnlocked = await page.evaluate(() => {
        return !document.body.classList.contains('search-modal-open');
      });
      expect(bodyUnlocked).toBe(true);
    });

    test('search flow: type, search, results shown, reopen, clear, close', async ({ page }) => {
      await waitForFeed(page);

      await page.locator('#mobile-search-btn').click();
      await expect(page.locator('#search-modal-overlay.open')).toBeVisible();

      const input = page.locator('#mobile-search-input');
      await input.fill('teampcp');
      await page.screenshot({ path: `${SCREENSHOTS_DIR}/${vp.name}-modal-input-filled.png`, fullPage: false });

      await page.locator('#mobile-search-apply').click();
      await expect(page.locator('#search-modal-overlay.open')).toHaveCount(0);
      await page.screenshot({ path: `${SCREENSHOTS_DIR}/${vp.name}-search-results.png`, fullPage: false });
      await expect(page.locator('#feed-status')).toContainText(/matching/i);

      await page.locator('#mobile-search-btn').click();
      await expect(page.locator('#search-modal-overlay.open')).toBeVisible();
      await page.locator('#mobile-search-clear').click();
      await page.locator('#mobile-search-close').click();
      await expect(page.locator('#search-modal-overlay.open')).toHaveCount(0);
      await expect(page.locator('#feed-status')).toBeEmpty();
    });

    test('Escape key closes modal', async ({ page }) => {
      await waitForFeed(page);
      await page.locator('#mobile-search-btn').click();
      await expect(page.locator('#search-modal-overlay.open')).toBeVisible();
      await page.keyboard.press('Escape');
      await expect(page.locator('#search-modal-overlay.open')).toHaveCount(0);
    });

    test('mobile nav hamburger still works after modal use', async ({ page }) => {
      await waitForFeed(page);
      await page.locator('#mobile-search-btn').click();
      await page.locator('#mobile-search-close').click();
      await page.locator('.nav-toggle').click();
      await expect(page.locator('.site-nav.open')).toBeVisible();
    });

    test('action buttons are all visible inside modal with no overflow', async ({ page }) => {
      await waitForFeed(page);
      await page.locator('#mobile-search-btn').click();
      await expect(page.locator('#search-modal-overlay.open')).toBeVisible();

      for (const id of ['mobile-search-apply', 'mobile-search-clear', 'mobile-search-close']) {
        const btn = page.locator(`#${id}`);
        await expect(btn).toBeVisible();
        const box = await btn.boundingBox();
        expect(box.x).toBeGreaterThanOrEqual(0);
        expect(box.x + box.width).toBeLessThanOrEqual(vp.width + 1);
      }
    });
  });
}

test.describe('Desktop search regression — 1440x1000', () => {
  test.use({ viewport: { width: 1440, height: 1000 } });

  test('desktop header: search input visible, mobile controls hidden', async ({ page }) => {
    await waitForFeed(page);
    await page.screenshot({ path: `${SCREENSHOTS_DIR}/desktop-header.png`, fullPage: false });

    await expect(page.locator('#header-search-input')).toBeVisible();
    await expect(page.locator('#mobile-search-btn')).not.toBeVisible();
    await expect(page.locator('.nav-toggle')).not.toBeVisible();
  });

  test('desktop logo on left, nav on right', async ({ page }) => {
    await waitForFeed(page);

    const logo = page.locator('.site-logo');
    const nav = page.locator('.site-nav');
    const logoBox = await logo.boundingBox();
    const navBox = await nav.boundingBox();

    // at 1440px with max-width: 1240px centred, logo starts at ~100-140px from viewport edge
    expect(logoBox.x).toBeLessThan(200);
    expect(navBox.x).toBeGreaterThan(logoBox.x + logoBox.width);
  });

  test('desktop header search filters feed', async ({ page }) => {
    await waitForFeed(page);
    const search = page.locator('#header-search-input');
    await search.fill('teampcp');
    await page.waitForTimeout(400);
    await expect(page.locator('#feed-status')).toContainText(/matching/i);
    await page.screenshot({ path: `${SCREENSHOTS_DIR}/desktop-search-active.png`, fullPage: false });

    await page.locator('.feed-status-clear-btn').click();
    await expect(page.locator('#feed-status')).toBeEmpty();
  });

  test('desktop tag filter + search combined', async ({ page }) => {
    await waitForFeed(page);
    await page.locator('.filter-btn[data-filter="supply-chain"]').click();
    await page.waitForTimeout(200);
    await page.locator('#header-search-input').fill('waveshaper-2026');
    await page.waitForTimeout(350);
    await expect(page.locator('#feed-status')).toContainText(/supply/i);
  });

  test('desktop intel feed renders cards', async ({ page }) => {
    await waitForFeed(page);
    const count = await page.locator('#posts-grid .post-card').count();
    expect(count).toBeGreaterThan(0);
  });

  test('desktop #actors route renders', async ({ page }) => {
    await waitForFeed(page);
    await page.goto('/index.html#actors');
    await page.waitForSelector('#actor-table tbody tr', { timeout: 20000 });
    const rows = await page.locator('#actor-table tbody tr').count();
    expect(rows).toBeGreaterThan(0);
  });

  test('desktop #ioc-feed route renders', async ({ page }) => {
    await waitForFeed(page);
    await page.goto('/index.html#ioc-feed');
    await page.waitForSelector('.feed-card', { timeout: 10000 });
    await expect(page.locator('.feed-card').first()).toBeVisible();
  });

  test('desktop IOC modal opens and closes', async ({ page }) => {
    await waitForFeed(page);
    await page.locator('.stats-row .stat-card').nth(2).click();
    await expect(page.locator('#modal-overlay.open')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.locator('#modal-overlay.open')).toHaveCount(0);
  });

  test('desktop #blog route renders', async ({ page }) => {
    await waitForFeed(page);
    await page.goto('/index.html#blog');
    await page.waitForSelector('.page-title', { timeout: 10000 });
    await expect(page.locator('.page-title')).toBeVisible();
  });

  test('desktop #about route renders', async ({ page }) => {
    await waitForFeed(page);
    await page.goto('/index.html#about');
    await page.waitForSelector('.about-content', { timeout: 10000 });
    await expect(page.locator('.about-content')).toBeVisible();
  });

  test('no console errors on desktop home', async ({ page }) => {
    const errors = [];
    page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
    await waitForFeed(page);
    const networkErrors = errors.filter(e =>
      !e.includes('favicon') && !e.includes('site.webmanifest') && !e.includes('rss.xml')
    );
    expect(networkErrors).toHaveLength(0);
  });
});

test.describe('Tablet regression — 768x1024', () => {
  test.use({ viewport: { width: 768, height: 1024 } });

  test('feed renders at tablet width', async ({ page }) => {
    await waitForFeed(page);
    await page.screenshot({ path: `${SCREENSHOTS_DIR}/tablet-home.png`, fullPage: false });
    const count = await page.locator('#posts-grid .post-card').count();
    expect(count).toBeGreaterThan(0);
  });
});
