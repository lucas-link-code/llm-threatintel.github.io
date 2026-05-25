const { test, expect } = require('@playwright/test');

test.describe('URL filter state - Intel Feed', () => {
  test('direct URL #home?tag=supply-chain shows filtered posts', async ({ page }) => {
    await page.goto('/#home?tag=supply-chain');
    await page.waitForSelector('.post-card');
    const activeFilter = page.locator('.filter-btn.active');
    await expect(activeFilter).toHaveAttribute('data-filter', 'supply-chain');
    const cards = page.locator('#posts-grid .post-card');
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);
  });

  test('direct URL #home?q=konni shows search results', async ({ page }) => {
    await page.goto('/#home?q=konni');
    await page.waitForSelector('#header-search-input');
    await expect(page.locator('#header-search-input')).toHaveValue('konni');
    await page.waitForTimeout(400);
    const cards = page.locator('#posts-grid .post-card');
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);
  });

  test('#home with no params shows all posts unfiltered', async ({ page }) => {
    await page.goto('/#home');
    await page.waitForSelector('.post-card');
    const activeFilter = page.locator('.filter-btn.active');
    await expect(activeFilter).toHaveAttribute('data-filter', 'all');
  });

  test('tag click updates URL with pushState', async ({ page }) => {
    await page.goto('/#home');
    await page.waitForSelector('.post-card');
    await page.locator('.filter-btn[data-filter="malware"]').click();
    await page.waitForTimeout(200);
    const url = page.url();
    expect(url).toContain('#home?tag=malware');
  });

  test('search typing updates URL with replaceState', async ({ page }) => {
    await page.goto('/#home');
    await page.waitForSelector('.post-card');
    await page.locator('#header-search-input').fill('npm');
    await page.waitForTimeout(400);
    const url = page.url();
    expect(url).toContain('#home?q=npm');
  });
});

test.describe('URL filter state - IOC Feed', () => {
  test('direct URL #ioc-feed?type=domain shows domain filter active', async ({ page }) => {
    await page.goto('/#ioc-feed?type=domain');
    await page.waitForSelector('.ioc-table');
    await expect(page.locator('#ioc-type-filter')).toHaveValue('domain');
  });

  test('#ioc-feed with no params defaults to active status', async ({ page }) => {
    await page.goto('/#ioc-feed');
    await page.waitForSelector('.ioc-table');
    await expect(page.locator('#ioc-status-filter')).toHaveValue('active');
  });

  test('direct URL #ioc-feed?status=all shows all statuses', async ({ page }) => {
    await page.goto('/#ioc-feed?status=all');
    await page.waitForSelector('.ioc-table');
    await expect(page.locator('#ioc-status-filter')).toHaveValue('all');
  });
});

test.describe('URL filter state - Actors', () => {
  test('direct URL #actors?q=konni prefills actor search', async ({ page }) => {
    await page.goto('/#actors?q=konni');
    await page.waitForSelector('.actor-table, #search-actors');
    await expect(page.locator('#search-actors')).toHaveValue('konni');
  });
});

test.describe('URL filter state - existing routes preserved', () => {
  test('#post/known-id still renders single post', async ({ page }) => {
    await page.goto('/#post/2026-05-10-konni-ai-generated-powershell-backdoor-blockchain-developers');
    await page.waitForSelector('.post-content');
    const title = await page.locator('h1').first().textContent();
    expect(title.toLowerCase()).toContain('konni');
  });

  test('#blog route still renders', async ({ page }) => {
    await page.goto('/#blog');
    await page.waitForSelector('.main-content');
    const heading = await page.locator('h1').first().textContent();
    expect(heading).toBeTruthy();
  });

  test('#about route still renders', async ({ page }) => {
    await page.goto('/#about');
    await page.waitForSelector('.main-content');
  });
});

test.describe('URL filter state - browser navigation', () => {
  test('browser back restores previous filter state', async ({ page }) => {
    await page.goto('/#home');
    await page.waitForSelector('.post-card');
    await page.locator('.filter-btn[data-filter="malware"]').click();
    await page.waitForTimeout(300);
    expect(page.url()).toContain('tag=malware');
    await page.locator('.filter-btn[data-filter="supply-chain"]').click();
    await page.waitForTimeout(300);
    expect(page.url()).toContain('tag=supply-chain');
    await page.goBack();
    await page.waitForTimeout(300);
    expect(page.url()).toContain('tag=malware');
    const active = page.locator('.filter-btn.active');
    await expect(active).toHaveAttribute('data-filter', 'malware');
  });

  test('no phantom filters when navigating to #home', async ({ page }) => {
    await page.goto('/#home?tag=malware');
    await page.waitForSelector('.post-card');
    await page.goto('/#home');
    await page.waitForTimeout(300);
    const active = page.locator('.filter-btn.active');
    await expect(active).toHaveAttribute('data-filter', 'all');
  });
});
