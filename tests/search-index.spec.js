const { test, expect } = require('@playwright/test');

test.describe('Pre-built search index', () => {
  test('search for known CVE returns correct post', async ({ page }) => {
    await page.goto('/#home');
    await page.waitForSelector('.post-card');
    await page.locator('#header-search-input').fill('CVE-2026-42208');
    await page.waitForTimeout(400);
    const cards = page.locator('#posts-grid .post-card');
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);
    const titles = await cards.evaluateAll(els => els.map(e => e.querySelector('.post-title')?.textContent || ''));
    const match = titles.some(t => t.toLowerCase().includes('litellm') || t.toLowerCase().includes('42208'));
    expect(match).toBe(true);
  });

  test('search for actor name returns correct posts', async ({ page }) => {
    await page.goto('/#home');
    await page.waitForSelector('.post-card');
    await page.locator('#header-search-input').fill('KONNI');
    await page.waitForTimeout(400);
    const cards = page.locator('#posts-grid .post-card');
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);
  });

  test('multi-word AND search still works', async ({ page }) => {
    await page.goto('/#home');
    await page.waitForSelector('.post-card');
    const allCards = await page.locator('#posts-grid .post-card').count();
    await page.locator('#header-search-input').fill('supply chain npm');
    await page.waitForTimeout(400);
    const filtered = await page.locator('#posts-grid .post-card').count();
    expect(filtered).toBeGreaterThan(0);
    expect(filtered).toBeLessThan(allCards);
  });

  test('empty search returns all posts', async ({ page }) => {
    await page.goto('/#home');
    await page.waitForSelector('.post-card');
    const allCards = await page.locator('#posts-grid .post-card').count();
    await page.locator('#header-search-input').fill('test-nonexistent-xyz-123');
    await page.waitForTimeout(400);
    const zero = await page.locator('#posts-grid .post-card').count();
    expect(zero).toBe(0);
    await page.locator('#header-search-input').fill('');
    await page.waitForTimeout(400);
    const restored = await page.locator('#posts-grid .post-card').count();
    expect(restored).toBe(allCards);
  });

  test('no network waterfall of per-post MD fetches', async ({ page }) => {
    const mdRequests = [];
    page.on('request', req => {
      if (req.url().includes('/posts/') && req.url().endsWith('.md')) {
        mdRequests.push(req.url());
      }
    });
    await page.goto('/#home');
    await page.waitForSelector('.post-card');
    await page.waitForTimeout(1500);
    expect(mdRequests.length).toBeLessThan(5);
  });

  test('search-index.json is fetched on page load', async ({ page }) => {
    let indexFetched = false;
    page.on('request', req => {
      if (req.url().includes('search-index.json')) {
        indexFetched = true;
      }
    });
    await page.goto('/#home');
    await page.waitForSelector('.post-card');
    await page.waitForTimeout(500);
    expect(indexFetched).toBe(true);
  });

  test('fallback works when search-index.json returns 404', async ({ page }) => {
    await page.route('**/data/search-index.json', route => {
      route.fulfill({ status: 404, body: 'Not found' });
    });
    await page.goto('/#home');
    await page.waitForSelector('.post-card');
    await page.locator('#header-search-input').fill('supply');
    await page.waitForTimeout(2000);
    const cards = page.locator('#posts-grid .post-card');
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);
  });

  test('tag filter combines with search using pre-built index', async ({ page }) => {
    await page.goto('/#home');
    await page.waitForSelector('.post-card');
    await page.locator('.filter-btn[data-filter="supply-chain"]').click();
    await page.waitForTimeout(200);
    await page.locator('#header-search-input').fill('waveshaper-2026');
    await page.waitForTimeout(400);
    const cards = page.locator('#posts-grid .post-card');
    await expect(cards).toHaveCount(1);
  });
});
