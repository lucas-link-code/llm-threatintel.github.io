const { test, expect } = require('@playwright/test');

async function waitForFeedCards(page) {
  await page.goto('/index.html#/home');
  await page.waitForSelector('#posts-grid .post-card', { timeout: 20000 });
}

test.describe('Intel feed search desktop', () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  test('header search filters cards and shows status', async ({ page }) => {
    await waitForFeedCards(page);
    const search = page.locator('#header-search-input');
    await expect(search).toBeVisible();
    await search.fill('teampcp');
    await page.waitForTimeout(400);
    await expect(page.locator('#feed-status')).toContainText(/matching/i);
    const cards = page.locator('#posts-grid .post-card');
    const n = await cards.count();
    expect(n).toBeGreaterThan(0);
    await page.locator('.feed-status-clear-btn').click();
    await expect(page.locator('#feed-status')).toBeEmpty();
    const after = await page.locator('#posts-grid .post-card').count();
    expect(after).toBeGreaterThanOrEqual(n);
  });

  test('CVE search matches after index optional', async ({ page }) => {
    await waitForFeedCards(page);
    await page.locator('#header-search-input').fill('CVE-2026-33032');
    await page.waitForTimeout(400);
    const n = await page.locator('#posts-grid .post-card').count();
    expect(n).toBeGreaterThanOrEqual(1);
  });

  test('tag filter combines with search', async ({ page }) => {
    await waitForFeedCards(page);
    await page.locator('.filter-btn[data-filter="supply-chain"]').click();
    await page.waitForTimeout(200);
    await page.locator('#header-search-input').fill('waveshaper-2026');
    await page.waitForTimeout(350);
    await expect(page.locator('#feed-status')).toContainText(/Supply Chain|supply/i);
    await expect(page.locator('#posts-grid .post-card')).toHaveCount(1);
  });

  test('search from actors route navigates home', async ({ page }) => {
    await waitForFeedCards(page);
    await page.click('a[href="#actors"]');
    await page.waitForSelector('#actor-table tbody tr', { timeout: 30000 });
    await page.locator('#header-search-input').fill('bitwarden');
    await page.waitForTimeout(350);
    await expect(page).toHaveURL(/#home/);
    await expect(page.locator('#posts-grid .post-card')).not.toHaveCount(0);
  });

  test('IOC modal still opens from stat tile', async ({ page }) => {
    await waitForFeedCards(page);
    await page.locator('.stats-row .stat-card').nth(2).click();
    await expect(page.locator('#modal-overlay.open')).toBeVisible();
    await expect(page.locator('#modal-content')).toContainText(/IOC/i);
    await page.keyboard.press('Escape');
    await expect(page.locator('#modal-overlay.open')).toHaveCount(0);
  });
});

test.describe('Intel feed search mobile', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test('mobile search modal flow', async ({ page }) => {
    await waitForFeedCards(page);
    await expect(page.locator('#header-search-input')).not.toBeVisible();
    const btn = page.locator('#mobile-search-btn');
    await expect(btn).toBeVisible();
    await btn.click();
    await expect(page.locator('#search-modal-overlay.open')).toBeVisible();
    const inp = page.locator('#mobile-search-input');
    await expect(inp).toBeFocused();
    await inp.fill('marimo');
    await page.locator('#mobile-search-apply').click();
    await expect(page.locator('#search-modal-overlay.open')).toHaveCount(0);
    await expect(page.locator('#posts-grid .post-card')).not.toHaveCount(0);
    await page.locator('#mobile-search-btn').click();
    await page.locator('#mobile-search-clear').click();
    await page.keyboard.press('Escape');
    await expect(page.locator('#search-modal-overlay.open')).toHaveCount(0);
  });

  test('Escape closes search modal', async ({ page }) => {
    await waitForFeedCards(page);
    await page.locator('#mobile-search-btn').click();
    await expect(page.locator('#search-modal-overlay.open')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.locator('#search-modal-overlay.open')).toHaveCount(0);
  });

  test('nav toggle still opens menu', async ({ page }) => {
    await waitForFeedCards(page);
    await page.locator('.nav-toggle').click();
    await expect(page.locator('.site-nav.open')).toBeVisible();
  });
});
